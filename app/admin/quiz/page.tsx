'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { QuizNode, QuizOption } from '@/types'

export default function QuizPage() {
  const [nodes, setNodes]     = useState<QuizNode[]>([])
  const [options, setOptions] = useState<QuizOption[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [error, setError]     = useState<string | null>(null)

  // ── node form
  const emptyNode = { id: '', tag_en: '', tag_gr: '', question_en: '', question_gr: '', order_index: 0 }
  const [nodeForm, setNodeForm]   = useState(emptyNode)
  const [editingNode, setEditingNode] = useState<QuizNode | null>(null)
  const [isNewNode, setIsNewNode] = useState(false)
  const [savingNode, setSavingNode] = useState(false)

  // ── option form
  const emptyOpt = { node_id: '', label_en: '', label_gr: '', emoji: '', next_node_id: '', next_cocktail_id: '' }
  const [optForm, setOptForm]     = useState(emptyOpt)
  const [editingOpt, setEditingOpt] = useState<QuizOption | null>(null)
  const [isNewOpt, setIsNewOpt]   = useState(false)
  const [savingOpt, setSavingOpt] = useState(false)

  async function load() {
    const [{ data: n }, { data: o }] = await Promise.all([
      supabase.from('quiz_nodes').select('*').order('order_index'),
      supabase.from('quiz_options').select('*').order('order_index'),
    ])
    if (n) setNodes(n)
    if (o) setOptions(o)
  }

  useEffect(() => { load() }, [])

  // ── Node CRUD ─────────────────────────────────────────────────────

  function openNewNode() {
    setIsNewNode(true); setEditingNode(null)
    setNodeForm(emptyNode); setError(null)
  }

  function openEditNode(n: QuizNode) {
    setIsNewNode(false); setEditingNode(n)
    setNodeForm({ id: n.id, tag_en: n.tag_en, tag_gr: n.tag_gr, question_en: n.question_en, question_gr: n.question_gr, order_index: n.order_index })
    setError(null)
  }

  async function saveNode() {
    setSavingNode(true); setError(null)
    const { error } = isNewNode
      ? await supabase.from('quiz_nodes').insert(nodeForm)
      : await supabase.from('quiz_nodes').update(nodeForm).eq('id', editingNode!.id)
    if (error) { setError(error.message); setSavingNode(false); return }
    await load(); setIsNewNode(false); setEditingNode(null); setSavingNode(false)
  }

  async function deleteNode(id: string) {
    if (!confirm('Delete this node and all its options?')) return
    await supabase.from('quiz_nodes').delete().eq('id', id)
    await load()
  }

  // ── Option CRUD ───────────────────────────────────────────────────

  function openNewOpt(nodeId: string) {
    setIsNewOpt(true); setEditingOpt(null)
    setOptForm({ ...emptyOpt, node_id: nodeId }); setError(null)
  }

  function openEditOpt(o: QuizOption) {
    setIsNewOpt(false); setEditingOpt(o)
    setOptForm({
      node_id: o.node_id,
      label_en: o.label_en, label_gr: o.label_gr,
      emoji: o.emoji ?? '',
      next_node_id: o.next_node_id ?? '',
      next_cocktail_id: o.next_cocktail_id ?? '',
    })
    setError(null)
  }

  async function saveOpt() {
    setSavingOpt(true); setError(null)
    const payload = {
      node_id:          optForm.node_id,
      label_en:         optForm.label_en,
      label_gr:         optForm.label_gr,
      emoji:            optForm.emoji,
      next_node_id:     optForm.next_node_id     || null,
      next_cocktail_id: optForm.next_cocktail_id || null,
      order_index:      editingOpt?.order_index ?? 0,
    }
    const { error } = isNewOpt
      ? await supabase.from('quiz_options').insert(payload)
      : await supabase.from('quiz_options').update(payload).eq('id', editingOpt!.id)
    if (error) { setError(error.message); setSavingOpt(false); return }
    await load(); setIsNewOpt(false); setEditingOpt(null); setSavingOpt(false)
  }

  async function deleteOpt(id: string) {
    if (!confirm('Delete this option?')) return
    await supabase.from('quiz_options').delete().eq('id', id)
    await load()
  }

  // ── Render ────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', color: 'var(--cream)', padding: '2.5rem 2rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a href="/admin" style={{ color: 'var(--gold-dark)', textDecoration: 'none', fontSize: '0.9rem' }}>← Dashboard</a>
            <h1 style={{ color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontSize: '1.75rem', margin: 0 }}>Quiz</h1>
          </div>
          <button onClick={openNewNode} style={primaryBtn}>+ Add question</button>
        </div>

        {error && <p style={{ color: '#ff6b6b', marginBottom: '1rem' }}>{error}</p>}

        {/* New / Edit Node form */}
        {(isNewNode || editingNode) && (
          <div style={formBox}>
            <h2 style={formTitle}>{isNewNode ? 'New question' : `Edit — ${editingNode!.id}`}</h2>
            {isNewNode && nf('ID (e.g. q4)', 'id')}
            {nf('Tag EN', 'tag_en')}
            {nf('Tag GR', 'tag_gr')}
            {nf('Question EN', 'question_en')}
            {nf('Question GR', 'question_gr')}
            {nf('Order', 'order_index')}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={saveNode} disabled={savingNode} style={primaryBtn}>{savingNode ? 'Saving…' : 'Save'}</button>
              <button onClick={() => { setIsNewNode(false); setEditingNode(null) }} style={ghostBtn}>Cancel</button>
            </div>
          </div>
        )}

        {/* Nodes list */}
        {nodes.map(node => {
          const nodeOptions = options.filter(o => o.node_id === node.id)
          const open = expanded === node.id

          return (
            <div key={node.id} style={{ marginBottom: '1rem', border: '1px solid var(--dark-4)', borderRadius: '12px', overflow: 'hidden' }}>

              {/* Node row */}
              <div style={{ background: 'var(--dark-3)', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div onClick={() => setExpanded(open ? null : node.id)} style={{ cursor: 'pointer', flex: 1 }}>
                  <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{node.id}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '0.75rem' }}>#{node.order_index}</span>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', color: 'var(--cream-dim)' }}>{node.question_en}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                  <button onClick={() => setExpanded(open ? null : node.id)} style={ghostBtn}>{open ? 'Collapse' : 'Options'}</button>
                  <button onClick={() => openEditNode(node)} style={ghostBtn}>Edit</button>
                  <button onClick={() => deleteNode(node.id)} style={dangerBtn}>Delete</button>
                </div>
              </div>

              {/* Options */}
              {open && (
                <div style={{ background: 'var(--dark-2)', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                  {nodeOptions.map(opt => (
                    <div key={opt.id} style={{ background: 'var(--dark-3)', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '1.1rem', marginRight: '0.5rem' }}>{opt.emoji}</span>
                        <span style={{ color: 'var(--cream)' }}>{opt.label_en}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '0.75rem' }}>
                          → {opt.next_node_id ?? `🍹 ${opt.next_cocktail_id}`}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openEditOpt(opt)} style={ghostBtn}>Edit</button>
                        <button onClick={() => deleteOpt(opt.id)} style={dangerBtn}>Delete</button>
                      </div>
                    </div>
                  ))}

                  {/* New / Edit Option form */}
                  {(isNewOpt || editingOpt) && optForm.node_id === node.id && (
                    <div style={{ ...formBox, margin: 0 }}>
                      <h3 style={{ ...formTitle, fontSize: '1rem' }}>{isNewOpt ? 'New option' : 'Edit option'}</h3>
                      {of('Label EN', 'label_en')}
                      {of('Label GR', 'label_gr')}
                      {of('Emoji', 'emoji')}
                      {of('Next node ID (leave blank if leaf)', 'next_node_id')}
                      {of('Next cocktail ID (leave blank if branch)', 'next_cocktail_id')}
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={saveOpt} disabled={savingOpt} style={primaryBtn}>{savingOpt ? 'Saving…' : 'Save'}</button>
                        <button onClick={() => { setIsNewOpt(false); setEditingOpt(null) }} style={ghostBtn}>Cancel</button>
                      </div>
                    </div>
                  )}

                  <button onClick={() => openNewOpt(node.id)} style={{ ...ghostBtn, alignSelf: 'flex-start' }}>+ Add option</button>
                </div>
              )}
            </div>
          )
        })}

      </div>
    </div>
  )

  // ── Field helpers ─────────────────────────────────────────────────

  function nf(label: string, key: keyof typeof nodeForm) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label style={{ fontSize: '0.8rem', color: 'var(--cream-dim)' }}>{label}</label>
        <input
          value={String(nodeForm[key])}
          onChange={e => setNodeForm(f => ({ ...f, [key]: key === 'order_index' ? Number(e.target.value) : e.target.value }))}
          style={inputStyle}
        />
      </div>
    )
  }

  function of(label: string, key: keyof typeof optForm) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label style={{ fontSize: '0.8rem', color: 'var(--cream-dim)' }}>{label}</label>
        <input
          value={optForm[key]}
          onChange={e => setOptForm(f => ({ ...f, [key]: e.target.value }))}
          style={inputStyle}
        />
      </div>
    )
  }
}

const inputStyle: React.CSSProperties = {
  background: 'var(--dark-2)', border: '1px solid var(--gold-dark)',
  borderRadius: '8px', padding: '0.65rem 0.75rem',
  color: 'var(--cream)', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box',
}
const primaryBtn: React.CSSProperties = {
  background: 'var(--gold)', color: 'var(--dark)', border: 'none',
  borderRadius: '8px', padding: '0.6rem 1.25rem', fontWeight: 600, cursor: 'pointer',
}
const ghostBtn: React.CSSProperties = {
  background: 'transparent', border: '1px solid var(--gold-dark)',
  color: 'var(--cream-dim)', borderRadius: '8px', padding: '0.6rem 1.25rem', cursor: 'pointer',
}
const dangerBtn: React.CSSProperties = {
  background: 'transparent', border: '1px solid #7f3030',
  color: '#ff6b6b', borderRadius: '8px', padding: '0.6rem 1.25rem', cursor: 'pointer',
}
const formBox: React.CSSProperties = {
  background: 'var(--dark-3)', border: '1px solid var(--gold-dark)',
  borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem',
  display: 'flex', flexDirection: 'column', gap: '1rem',
}
const formTitle: React.CSSProperties = {
  color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: 0,
}