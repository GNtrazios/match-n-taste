'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Cocktail } from '@/types'

const empty: Omit<Cocktail, 'id'> = {
  name: '', glass: '',
  subtitle_en: '', subtitle_gr: '',
  description_en: '', description_gr: '',
  ingredients: [],
  image_url: '',
}

export default function CocktailsPage() {
  const [cocktails, setCocktails]   = useState<Cocktail[]>([])
  const [editing, setEditing]       = useState<Cocktail | null>(null)
  const [isNew, setIsNew]           = useState(false)
  const [form, setForm]             = useState<Omit<Cocktail, 'id'>>(empty)
  const [formId, setFormId]         = useState('')
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [uploading, setUploading]   = useState(false)

  async function load() {
    const { data } = await supabase.from('cocktails').select('*').order('name')
    if (data) setCocktails(data)
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setIsNew(true); setEditing(null)
    setForm(empty); setFormId(''); setError(null)
  }

  function openEdit(c: Cocktail) {
    setIsNew(false); setEditing(c); setFormId(c.id)
    setForm({
      name: c.name, glass: c.glass,
      subtitle_en: c.subtitle_en, subtitle_gr: c.subtitle_gr,
      description_en: c.description_en, description_gr: c.description_gr,
      ingredients: c.ingredients,
      image_url: c.image_url ?? '',
    })
    setError(null)
  }

  function closeForm() { setEditing(null); setIsNew(false) }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext      = file.name.split('.').pop()
    const filename = `${formId || 'new'}-${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('cocktail-images')
      .upload(filename, file, { upsert: true })
    if (error) { setError(error.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage
      .from('cocktail-images')
      .getPublicUrl(filename)
    setForm(f => ({ ...f, image_url: publicUrl }))
    setUploading(false)
  }

  async function handleSave() {
    setSaving(true); setError(null)
    const payload = { ...form, id: isNew ? formId : editing!.id }
    const { error } = isNew
      ? await supabase.from('cocktails').insert(payload)
      : await supabase.from('cocktails').update(form).eq('id', editing!.id)
    if (error) { setError(error.message); setSaving(false); return }
    await load(); closeForm(); setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this cocktail?')) return
    await supabase.from('cocktails').delete().eq('id', id)
    await load()
  }

  const field = (label: string, key: keyof Omit<Cocktail,'id'>, multiline = false) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label style={{ fontSize: '0.8rem', color: 'var(--cream-dim)' }}>{label}</label>
      {multiline
        ? <textarea rows={3} value={form[key] as string}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            style={{ ...inputStyle, resize: 'vertical' }} />
        : <input value={form[key] as string}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            style={inputStyle} />
      }
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', color: 'var(--cream)', padding: '2.5rem 2rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a href="/admin" style={{ color: 'var(--gold-dark)', textDecoration: 'none', fontSize: '0.9rem' }}>← Dashboard</a>
            <h1 style={{ color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontSize: '1.75rem', margin: 0 }}>Cocktails</h1>
          </div>
          <button onClick={openNew} style={primaryBtn}>+ Add cocktail</button>
        </div>

        {/* Form */}
        {(isNew || editing) && (
          <div style={{ background: 'var(--dark-3)', border: '1px solid var(--gold-dark)', borderRadius: '12px', padding: '2rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ color: 'var(--gold)', fontFamily: 'var(--font-serif)', margin: 0 }}>
              {isNew ? 'New cocktail' : `Edit — ${editing!.name}`}
            </h2>

            {isNew && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--cream-dim)' }}>ID (slug, e.g. mojito)</label>
                <input value={formId} onChange={e => setFormId(e.target.value.toLowerCase().replace(/\s+/g, '-'))} style={inputStyle} />
              </div>
            )}

            {field('Name', 'name')}
            {field('Glass / emoji', 'glass')}
            {field('Subtitle EN', 'subtitle_en')}
            {field('Subtitle GR', 'subtitle_gr')}
            {field('Description EN', 'description_en', true)}
            {field('Description GR', 'description_gr', true)}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--cream-dim)' }}>Ingredients (comma-separated)</label>
              <input
                value={form.ingredients.join(', ')}
                onChange={e => setForm(f => ({ ...f, ingredients: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                style={inputStyle}
              />
            </div>

            {/* Image upload */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--cream-dim)' }}>Cocktail image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ color: 'var(--cream-dim)', fontSize: '0.85rem' }} />
              {uploading && <p style={{ fontSize: '0.8rem', color: 'var(--gold)' }}>Uploading…</p>}
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt="preview"
                  style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--gold-dark)' }}
                />
              )}
            </div>

            {error && <p style={{ color: '#ff6b6b', fontSize: '0.85rem' }}>{error}</p>}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleSave} disabled={saving} style={primaryBtn}>{saving ? 'Saving…' : 'Save'}</button>
              <button onClick={closeForm} style={ghostBtn}>Cancel</button>
            </div>
          </div>
        )}

        {/* Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {cocktails.map(c => (
            <div key={c.id} style={{ background: 'var(--dark-3)', border: '1px solid var(--dark-4)', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {c.image_url
                  ? <img src={c.image_url} alt={c.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--gold-dark)' }} />
                  : <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: 'var(--dark-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>🍸</div>
                }
                <div>
                  <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{c.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '0.75rem' }}>{c.id}</span>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--cream-dim)' }}>{c.subtitle_en}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => openEdit(c)} style={ghostBtn}>Edit</button>
                <button onClick={() => handleDelete(c.id)} style={dangerBtn}>Delete</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
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