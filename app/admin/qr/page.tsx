'use client'

import QRCode from 'react-qr-code'

const URL = 'https://match-n-taste.vercel.app'

export default function QRPage() {

  function handlePrint() {
    window.print()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', color: 'var(--cream)', padding: '2.5rem 2rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <a href="/admin" style={{ color: 'var(--gold-dark)', textDecoration: 'none', fontSize: '0.9rem' }}>← Dashboard</a>
          <h1 style={{ color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontSize: '1.75rem', margin: 0 }}>QR Code</h1>
        </div>

        {/* Screen version */}
        <div
          style={{
            background: 'var(--dark-3)', border: '1px solid var(--gold-dark)',
            borderRadius: '12px', padding: '2rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
          }}
          className="no-print"
        >
          <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '8px' }}>
            <QRCode value={URL} size={200} />
          </div>
          <p style={{ color: 'var(--cream-dim)', fontSize: '0.9rem', textAlign: 'center', margin: 0 }}>
            Scan to start the cocktail quiz
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>{URL}</p>
          <button onClick={handlePrint} style={primaryBtn}>
            🖨️ Print card
          </button>
        </div>

        {/* Print version */}
        <div className="print-only" style={{ display: 'none' }}>
          <div style={{
            width: '85mm', margin: '0 auto', padding: '8mm',
            border: '1px solid #C9A84C', borderRadius: '4mm',
            fontFamily: 'Georgia, serif', textAlign: 'center',
            background: '#0F0D0A', color: '#F5EED8',
          }}>
            <p style={{ fontSize: '20px', color: '#C9A84C', marginBottom: '4mm', letterSpacing: '0.05em' }}>
              🍸 Match &apos;n&apos; Taste
            </p>
            <div style={{ background: '#fff', padding: '4mm', borderRadius: '2mm', display: 'inline-block', marginBottom: '4mm' }}>
              <QRCode value={URL} size={160} />
            </div>
            <p style={{ fontSize: '11px', color: '#C8B98A', marginBottom: '2mm' }}>
              Scan to find your perfect cocktail
            </p>
            <p style={{ fontSize: '9px', color: '#7A6A4F' }}>match-n-taste.vercel.app</p>
          </div>
        </div>

      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-only, .print-only * { visibility: visible !important; display: block !important; }
          .print-only { position: fixed; top: 0; left: 0; width: 100%; }
          @page { size: A4; margin: 20mm; }
        }
      `}</style>
    </div>
  )
}

const primaryBtn: React.CSSProperties = {
  background: 'var(--gold)', color: 'var(--dark)', border: 'none',
  borderRadius: '8px', padding: '0.6rem 1.25rem', fontWeight: 600,
  cursor: 'pointer',
}