'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase.js'

function ConnexionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [prenom, setPrenom] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const separator = redirect.includes('?') ? '&' : '?'
  const target = redirect + separator + 'avis=ouvrir'

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setError('Email ou mot de passe incorrect.'); return }
    router.push(target)
  }

  const handleSignup = async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { prenom } }
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    if (data.session) {
      router.push(target)
    } else {
      setInfo('Compte créé ! Vérifiez votre boîte mail pour confirmer votre adresse, puis connectez-vous.')
      setTab('login')
    }
  }

  const inputStyle = {
    width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px',
    padding: '10px 12px', fontSize: '14px', color: '#111',
    background: '#fafafa', outline: 'none', fontFamily: '"DM Sans", sans-serif',
    boxSizing: 'border-box' as const, marginBottom: '12px',
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: '"DM Sans", sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div onClick={() => router.push('/')} style={{ textAlign: 'center', fontSize: '16px', fontWeight: 700, color: '#0f2d6b', marginBottom: '1.5rem', cursor: 'pointer' }}>
          Trouve ton <span style={{ color: '#2563eb' }}>réparateur</span>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '1.25rem', background: '#f5f5f5', borderRadius: '8px', padding: '4px' }}>
            <button
              onClick={() => { setTab('login'); setError(''); setInfo('') }}
              style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', fontWeight: 600, background: tab === 'login' ? '#fff' : 'transparent', color: tab === 'login' ? '#2563eb' : '#888', boxShadow: tab === 'login' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}
            >
              Se connecter
            </button>
            <button
              onClick={() => { setTab('signup'); setError(''); setInfo('') }}
              style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', fontWeight: 600, background: tab === 'signup' ? '#fff' : 'transparent', color: tab === 'signup' ? '#2563eb' : '#888', boxShadow: tab === 'signup' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}
            >
              Créer un compte
            </button>
          </div>

          {info && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', marginBottom: '12px' }}>
              {info}
            </div>
          )}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', marginBottom: '12px' }}>
              {error}
            </div>
          )}

          {tab === 'signup' && (
            <input style={inputStyle} placeholder="Votre prénom" value={prenom} onChange={e => setPrenom(e.target.value)} />
          )}
          <input style={inputStyle} type="email" placeholder="Adresse email" value={email} onChange={e => setEmail(e.target.value)} />
          <input style={inputStyle} type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />

          <button
            onClick={tab === 'login' ? handleLogin : handleSignup}
            disabled={loading || !email || !password || (tab === 'signup' && !prenom)}
            style={{ width: '100%', background: loading ? '#93c5fd' : '#0f2d6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif' }}
          >
            {loading ? 'Veuillez patienter...' : tab === 'login' ? 'Se connecter →' : 'Créer mon compte →'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default function Connexion() {
  return (
    <Suspense fallback={null}>
      <ConnexionContent />
    </Suspense>
  )
}
