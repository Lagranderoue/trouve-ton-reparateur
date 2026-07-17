'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

// Client Supabase créé une seule fois
let supabaseInstance: any = null
const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return supabaseInstance
}

export default function Navbar() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profil, setProfil] = useState<any>(null)
  const [userType, setUserType] = useState<'client' | 'reparateur' | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await getSupabase().auth.getUser()
      if (!user) return
      setUser(user)

      // Vérifier si c'est un réparateur
      const { data: rep } = await getSupabase()
        .from('reparateurs')
        .select('id, nom')
        .eq('email', user.email)
        .single()

      if (rep) {
        setUserType('reparateur')
        setProfil({ nom: rep.nom, initiale: rep.nom?.[0]?.toUpperCase() || 'R' })
      } else {
        // Client
        const { data: client } = await getSupabase()
          .from('clients')
          .select('prenom, nom')
          .eq('id', user.id)
          .single()
        setUserType('client')
        const prenom = client?.prenom || user.email?.split('@')[0] || ''
        const nom = client?.nom || ''
        setProfil({ prenom, nom, initiale: prenom[0]?.toUpperCase() || 'C' })
      }
    }
    init()

    const { data: { subscription } } = getSupabase().auth.onAuthStateChange((_event: any, session: any) => {
      if (!session) { setUser(null); setProfil(null); setUserType(null) }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = async () => {
    await getSupabase().auth.signOut()
    setUser(null); setProfil(null); setUserType(null); setMenuOpen(false)
    router.push('/')
  }

  const clientLinks = [
    { label: 'Mon tableau de bord', href: '/mon-compte' },
    { label: 'Mes réservations', href: '/mon-compte?tab=reservations' },
    { label: 'Mes messages', href: '/mon-compte?tab=messages' },
    { label: 'Mes avis', href: '/mon-compte?tab=avis' },
    { label: 'Mon profil', href: '/mon-compte?tab=profil' },
  ]

  const repLinks = [
    { label: 'Mon tableau de bord', href: '/espace-reparateur/dashboard' },
    { label: 'Mes réservations', href: '/espace-reparateur/dashboard?tab=reservations' },
    { label: 'Mes messages', href: '/espace-reparateur/dashboard?tab=messages' },
    { label: 'Mes avis', href: '/espace-reparateur/dashboard?tab=avis' },
    { label: 'Mon profil', href: '/espace-reparateur/dashboard?tab=profil' },
  ]

  const links = userType === 'reparateur' ? repLinks : clientLinks

  return (
    <nav style={{ background: '#0f2d6b', padding: '0 1.5rem', height: '60px', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Logo */}
      <span
        onClick={() => router.push('/')}
        style={{ fontSize: isMobile ? '13px' : '18px', fontWeight: 700, color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: '"DM Sans", sans-serif', letterSpacing: '-0.01em' }}
      >
        Trouve ton réparateur
      </span>

      <div style={{ flex: 1 }} />

      {user && profil ? (
        /* CONNECTÉ */
        <div ref={menuRef} style={{ position: 'relative' }}>
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 10px', borderRadius: '100px', background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.3)' }}
          >
            {/* Avatar */}
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {profil.initiale}
            </div>
            {/* Nom */}
            {!isMobile && (
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userType === 'reparateur' ? profil.nom : (profil.prenom + ' ' + profil.nom).trim()}
              </span>
            )}
            {/* Hamburger */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
              <div style={{ width: '16px', height: '2px', background: '#fff', borderRadius: '2px' }} />
              <div style={{ width: '16px', height: '2px', background: '#fff', borderRadius: '2px' }} />
              <div style={{ width: '16px', height: '2px', background: '#fff', borderRadius: '2px' }} />
            </div>
          </div>

          {/* Menu déroulant */}
          {menuOpen && (
            <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: '#fff', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', minWidth: '220px', overflow: 'hidden', zIndex: 200 }}>
              {/* Header menu */}
              <div style={{ padding: '12px 16px', background: '#f4f6fb', borderBottom: '1px solid #e8eaf0' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111' }}>
                  {userType === 'reparateur' ? profil.nom : (profil.prenom + ' ' + profil.nom).trim() || profil.prenom}
                </div>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                  {userType === 'reparateur' ? 'Espace réparateur' : 'Espace client'}
                </div>
              </div>
              {/* Liens */}
              {links.map((link, i) => (
                <div
                  key={i}
                  onClick={() => { router.push(link.href); setMenuOpen(false) }}
                  style={{ padding: '11px 16px', fontSize: '13px', color: '#333', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', fontWeight: 500 }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f4f6fb')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {link.label}
                </div>
              ))}
              {/* Déconnexion */}
              <div
                onClick={handleLogout}
                style={{ padding: '11px 16px', fontSize: '13px', color: '#dc2626', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                Déconnexion
              </div>
            </div>
          )}
        </div>
      ) : (
        /* NON CONNECTÉ */
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '10px', flexShrink: 0 }}>
          <button
            onClick={() => router.push('/mon-compte')}
            style={{ fontFamily: '"DM Sans", sans-serif', fontSize: isMobile ? '11px' : '13px', fontWeight: 600, color: '#fff', background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.65)', padding: isMobile ? '6px 10px' : '7px 14px', borderRadius: '100px', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {isMobile ? 'Client' : 'Espace client'}
          </button>
          <button
            onClick={() => router.push('/espace-reparateur')}
            style={{ fontFamily: '"DM Sans", sans-serif', fontSize: isMobile ? '11px' : '13px', fontWeight: 600, color: '#fff', background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.65)', padding: isMobile ? '6px 10px' : '7px 14px', borderRadius: '100px', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {isMobile ? 'Réparateur' : 'Vous êtes réparateur ?'}
          </button>
        </div>
      )}
    </nav>
  )
}
