'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Event {
  event_type:   string
  node_id:      string | null
  option_label: string | null
  cocktail_id:  string | null
  lang:         string
  created_at:   string
}

interface Tally {
  label: string
  count: number
}

function tally(items: string[]): Tally[] {
  const map: Record<string, number> = {}
  for (const item of items) map[item] = (map[item] ?? 0) + 1
  return Object.entries(map)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
}

export default function AnalyticsPage() {
  const [events, setEvents]   = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('quiz_events')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setEvents(data)
      setLoading(false)
    }
    load()
  }, [])

  const choices = events.filter(e => e.event_type === 'choice')
  const results = events.filter(e => e.event_type === 'result')

  const topChoices   = tally(choices.map(e => e.option_label ?? 'unknown'))
  const topCocktails = tally(results.map(e => e.cocktail_id ?? 'unknown'))
  const langSplit    = tally(events.map(e => e.lang))

  const total     = results.length
  const enCount   = events.filter(e => e.lang === 'en').length
  const grCount   = events.filter(e => e.lang === 'gr').length

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--gold-light)' }}>Loading…</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', color: 'var(--cream)', padding: '2.5rem 2rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <a href="/admin" style={{ color: 'var(--gold-dark)', textDecoration: 'none', fontSize: '0.9rem' }}>← Dashboard</a>
          <h1 style={{ color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontSize: '1.75rem', margin: 0 }}>Analytics</h1>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total completions', value: total },
            { label: 'EN sessions',        value: enCount },
            { label: 'GR sessions',        value: grCount },
          ].map(stat => (
            <div key={stat.label} style={statCard}>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gold)', margin: 0 }}>{stat.value}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--cream-dim)', margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Top cocktails */}
          <div style={section}>
            <h2 style={sectionTitle}>🍹 Most matched cocktails</h2>
            {topCocktails.length === 0
              ? <p style={empty}>No data yet</p>
              : topCocktails.map(({ label, count }) => (
                <div key={label} style={row}>
                  <span style={{ color: 'var(--cream)' }}>{label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '80px', height: '6px', background: 'var(--dark-4)', borderRadius: '3px' }}>
                      <div style={{
                        width: `${Math.round((count / topCocktails[0].count) * 100)}%`,
                        height: '100%', background: 'var(--gold)', borderRadius: '3px',
                      }} />
                    </div>
                    <span style={{ color: 'var(--gold)', fontWeight: 600, minWidth: '1.5rem', textAlign: 'right' }}>{count}</span>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Top choices */}
          <div style={section}>
            <h2 style={sectionTitle}>👆 Most selected options</h2>
            {topChoices.length === 0
              ? <p style={empty}>No data yet</p>
              : topChoices.map(({ label, count }) => (
                <div key={label} style={row}>
                  <span style={{ color: 'var(--cream)' }}>{label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '80px', height: '6px', background: 'var(--dark-4)', borderRadius: '3px' }}>
                      <div style={{
                        width: `${Math.round((count / topChoices[0].count) * 100)}%`,
                        height: '100%', background: 'var(--gold)', borderRadius: '3px',
                      }} />
                    </div>
                    <span style={{ color: 'var(--gold)', fontWeight: 600, minWidth: '1.5rem', textAlign: 'right' }}>{count}</span>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Language split */}
          <div style={section}>
            <h2 style={sectionTitle}>🌐 Language split</h2>
            {langSplit.map(({ label, count }) => (
              <div key={label} style={row}>
                <span style={{ color: 'var(--cream)' }}>{label === 'en' ? '🇬🇧 English' : '🇬🇷 Greek'}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '80px', height: '6px', background: 'var(--dark-4)', borderRadius: '3px' }}>
                    <div style={{
                      width: `${Math.round((count / (enCount + grCount || 1)) * 100)}%`,
                      height: '100%', background: 'var(--gold)', borderRadius: '3px',
                    }} />
                  </div>
                  <span style={{ color: 'var(--gold)', fontWeight: 600, minWidth: '1.5rem', textAlign: 'right' }}>{count}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent activity */}
          <div style={section}>
            <h2 style={sectionTitle}>🕐 Recent activity</h2>
            {events.slice(0, 8).map((e, i) => (
              <div key={i} style={{ ...row, fontSize: '0.82rem' }}>
                <span style={{ color: e.event_type === 'result' ? 'var(--gold)' : 'var(--cream-dim)' }}>
                  {e.event_type === 'result' ? `🍹 ${e.cocktail_id}` : `👆 ${e.option_label}`}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  {new Date(e.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

const statCard: React.CSSProperties = {
  background: 'var(--dark-3)', border: '1px solid var(--gold-dark)',
  borderRadius: '12px', padding: '1.25rem',
  display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center', textAlign: 'center',
}
const section: React.CSSProperties = {
  background: 'var(--dark-3)', border: '1px solid var(--dark-4)',
  borderRadius: '12px', padding: '1.5rem',
  display: 'flex', flexDirection: 'column', gap: '0.75rem',
}
const sectionTitle: React.CSSProperties = {
  color: 'var(--gold)', fontFamily: 'var(--font-serif)',
  fontSize: '1rem', margin: '0 0 0.5rem',
}
const row: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between',
  alignItems: 'center', padding: '0.4rem 0',
  borderBottom: '1px solid var(--dark-4)',
}
const empty: React.CSSProperties = {
  color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0,
}