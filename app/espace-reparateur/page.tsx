'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function EspaceReparateur() {
  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) router.push('/espace-reparateur/dashboard')
    }
    check()
  }, [])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
    } else {
      router.push('/espace-reparateur/dashboard')
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Sans", sans-serif', padding: '1rem' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f2d6b', marginBottom: '6px' }}>Trouve ton réparateur</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#111' }}>Espace réparateur</div>
          <div style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>Connectez-vous pour gérer votre fiche</div>
        </div>

        {/* Champs */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email</div>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="votre@email.com"
            style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '11px 14px', fontSize: '14px', outline: 'none', fontFamily: '"DM Sans", sans-serif', background: '#fafafa' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Mot de passe</div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '11px 14px', fontSize: '14px', outline: 'none', fontFamily: '"DM Sans", sans-serif', background: '#fafafa' }}
          />
        </div>

        {error && <div style={{ fontSize: '13px', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' }}>{error}</div>}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', background: '#0f2d6b', color: '#fff', border: 'none', borderRadius: '8px', padding: '13px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}
        >
          {loading ? 'Connexion...' : 'Se connecter →'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '13px', color: '#888' }}>
          Pas encore de compte ?{' '}
          <span onClick={() => router.push('/inscrire')} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 500 }}>
            Inscrire ma boutique
          </span>
        </div>

      </div>
    </main>
  )
}
