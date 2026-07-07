'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { IconTool } from '@tabler/icons-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function EspaceReparateur() {
  const [tab, setTab] = useState<'login' | 'signup'>( 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nomBoutique, setNomBoutique] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) router.replace('/espace-reparateur/dashboard')
    }
    check()
  }, [])

  const handleLogin = async () => {
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return }
    if (loading) return
    setLoading(true)
    setError('')
    try {
      // Vérifier si le compte réparateur existe
      const checkRes = await fetch('/api/check-reparateur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const checkData = await checkRes.json()
      if (!checkData.existe) {
        setError('COMPTE_DESACTIVE')
        setLoading(false)
        return
      }
      const { error, data } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Email ou mot de passe incorrect.')
        setLoading(false)
      } else if (!data?.user) {
        setError('COMPTE_DESACTIVE')
        setLoading(false)
      } else {
        router.push('/espace-reparateur/dashboard')
      }
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.')
      setLoading(false)
    }
  }

  const handleSignup = async () => {
    if (!nomBoutique || !email || !password) { setError('Veuillez remplir tous les champs.'); return }
    if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError('Une erreur est survenue : ' + error.message)
      setLoading(false)
      return
    }
    setLoading(false)
    setInfo('')
    router.push('/inscrire?email=' + encodeURIComponent(email) + '&nom=' + encodeURIComponent(nomBoutique))
  }

  const inputStyle = {
    width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px',
    padding: '11px 14px', fontSize: '14px', outline: 'none',
    fontFamily: '"DM Sans", sans-serif', background: '#fafafa',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    fontSize: '11px', fontWeight: 600 as const, color: '#555',
    marginBottom: '5px', textTransform: 'uppercase' as const,
    letterSpacing: '0.04em', display: 'block' as const,
  }

  if (error === 'COMPTE_DESACTIVE') return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Sans", sans-serif', padding: '1rem' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '440px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        </div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Compte désactivé</div>
        <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Votre compte réparateur a été désactivé par notre équipe.<br /><br />
          Si vous pensez qu'il s'agit d'une erreur ou souhaitez plus d'informations, contactez-nous.
        </div>
        <a href="mailto:contact@trouvetonreparateur.com" style={{ display: 'block', background: '#0f2d6b', color: '#fff', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', marginBottom: '10px' }}>
          Contacter le support
        </a>
        <div onClick={() => router.push('/')} style={{ fontSize: '13px', color: '#2563eb', cursor: 'pointer', fontWeight: 500 }}>← Retour à l'accueil</div>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', display: 'flex', flexDirection: 'column', fontFamily: '"DM Sans", sans-serif' }}>
      
      <nav style={{ background: '#fff', borderBottom: '1px solid #e8eaf0', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div onClick={() => router.push('/')} style={{ fontSize: '15px', fontWeight: 700, color: '#0f2d6b', cursor: 'pointer' }}>
          Trouve ton réparateur
        </div>
        <div onClick={() => router.push('/mon-compte')} style={{ fontSize: '13px', color: '#2563eb', cursor: 'pointer', fontWeight: 500 }}>
          Espace client
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '440px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>

          {/* Icône + titre */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <IconTool size={26} color="#2563eb" />
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#111' }}>Espace réparateur</div>
            <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
              {tab === 'login' ? 'Connectez-vous pour gérer votre boutique' : 'Créez votre compte et rejoignez la plateforme'}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', background: '#f4f6fb', borderRadius: '10px', padding: '3px', marginBottom: '1.5rem' }}>
            {(['login', 'signup'] as const).map(t => (
              <div key={t} onClick={() => { setTab(t); setError(''); setInfo('') }} style={{
                flex: 1, textAlign: 'center', padding: '9px', fontSize: '13px', fontWeight: 600,
                borderRadius: '8px', cursor: 'pointer',
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? '#0f2d6b' : '#999',
                boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s',
              }}>
                {t === 'login' ? 'Se connecter' : 'S\'inscrire'}
              </div>
            ))}
          </div>

          {error && <div style={{ fontSize: '13px', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' }}>{error}</div>}
          {info && <div style={{ fontSize: '13px', color: '#166534', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' }}>{info}</div>}

          {tab === 'login' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Mot de passe</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleLogin()} style={inputStyle} />
              </div>
              <div style={{ textAlign: 'right', marginTop: '-8px', marginBottom: '4px' }}>
                <span onClick={() => router.push('/mot-de-passe-oublie')} style={{ fontSize: '12px', color: '#2563eb', cursor: 'pointer', fontWeight: 500 }}>Mot de passe oublié ?</span>
              </div>
              <button onClick={handleLogin} disabled={loading} style={{ background: loading ? '#93c5fd' : '#0f2d6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                {loading ? 'Connexion...' : 'Se connecter →'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '12px 14px', fontSize: '12px', color: '#1e40af', lineHeight: 1.5 }}>
                Après inscription, complétez votre fiche boutique pour apparaître dans les résultats.
              </div>
              <div>
                <label style={labelStyle}>Nom de la boutique</label>
                <input type="text" value={nomBoutique} onChange={e => setNomBoutique(e.target.value)} placeholder="La Grande Roue" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email professionnel</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="contact@maboutique.fr" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Mot de passe</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
              </div>
              <button onClick={handleSignup} disabled={loading} style={{ background: loading ? '#93c5fd' : '#0f2d6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                {loading ? 'Création...' : 'Créer mon compte →'}
              </button>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#bbb', marginBottom: '8px' }}>ou</div>
                <button onClick={() => router.push('/inscrire')} style={{ width: '100%', background: '#fff', color: '#0f2d6b', border: '1.5px solid #bfdbfe', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                  Remplir le formulaire complet
                </button>
                <div style={{ fontSize: '11px', color: '#bbb', marginTop: '6px' }}>Pour une inscription complète avec Kbis</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}
