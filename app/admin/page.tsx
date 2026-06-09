'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--dark)',
      color: 'var(--cream)',
      padding: '3rem 2rem',
    }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h1 style={{ color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>
            🍸 Match &apos;n&apos; Taste
          </h1>
          <button onClick={handleLogout} style={ghostBtn}>
            Log out
          </button>
        </div>

        <p style={{ color: 'var(--cream-dim)', marginBottom: '2.5rem' }}>
          Welcome to the admin panel. Manage your cocktails and quiz from here.
        </p>

        {/* Nav cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <a href="/admin/cocktails" style={card}>
            <span style={{ fontSize: '2rem' }}>🍹</span>
            <h2 style={cardTitle}>Cocktails</h2>
            <p style={cardDesc}>Add, edit, or remove cocktails from the menu.</p>
          </a>
          <a href="/admin/qr" style={card}>
            <span style={{ fontSize: '2rem' }}>🔲</span>
            <h2 style={cardTitle}>QR Code</h2>
            <p style={cardDesc}>Generate and print QR codes per venue.</p>
          </a>
          <a href="/admin/quiz" style={card}>
            <span style={{ fontSize: '2rem' }}>🧠</span>
            <h2 style={cardTitle}>Quiz</h2>
            <p style={cardDesc}>Manage quiz questions and answer branches.</p>
          </a>
          <a href="/admin/analytics" style={card}>
            <span style={{ fontSize: '2rem' }}>📊</span>
            <h2 style={cardTitle}>Analytics</h2>
            <p style={cardDesc}>Track quiz choices, popular cocktails, and language usage.</p>
          </a>
        </div>

      </div>
    </div>
  )
}

const card: React.CSSProperties = {
  background: 'var(--dark-3)',
  border: '1px solid var(--gold-dark)',
  borderRadius: '12px',
  padding: '2rem',
  textDecoration: 'none',
  color: 'var(--cream)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  cursor: 'pointer',
}

const cardTitle: React.CSSProperties = {
  color: 'var(--gold)',
  fontFamily: 'var(--font-serif)',
  fontSize: '1.25rem',
  margin: 0,
}

const cardDesc: React.CSSProperties = {
  color: 'var(--cream-dim)',
  fontSize: '0.9rem',
  margin: 0,
  lineHeight: 1.6,
}

const ghostBtn: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid var(--gold-dark)',
  color: 'var(--cream-dim)',
  borderRadius: '8px',
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  fontSize: '0.9rem',
}