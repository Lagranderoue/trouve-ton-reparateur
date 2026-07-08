'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <nav style={{
      background: '#0f2d6b',
      padding: '0 1.5rem',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <span
        onClick={() => router.push('/')}
        style={{ fontSize: isMobile ? '13px' : '18px', fontWeight: 700, color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: '"DM Sans", sans-serif', letterSpacing: '-0.01em' }}
      >
        Trouve ton réparateur
      </span>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '10px', flexShrink: 0 }}>
        <button
          onClick={() => router.push('/mon-compte')}
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: isMobile ? '11px' : '13px', fontWeight: 600,
            color: '#ffffff',
            background: 'rgba(255,255,255,0.12)',
            border: '1.5px solid rgba(255,255,255,0.65)',
            padding: isMobile ? '6px 10px' : '7px 14px',
            borderRadius: '100px', cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {isMobile ? 'Client' : 'Espace client'}
        </button>
        <button
          onClick={() => router.push('/espace-reparateur')}
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: isMobile ? '11px' : '13px', fontWeight: 600,
            color: '#ffffff',
            background: 'rgba(255,255,255,0.12)',
            border: '1.5px solid rgba(255,255,255,0.65)',
            padding: isMobile ? '6px 10px' : '7px 14px',
            borderRadius: '100px', cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {isMobile ? 'Réparateur' : 'Vous êtes réparateur ?'}
        </button>
      </div>
    </nav>
  )
}
