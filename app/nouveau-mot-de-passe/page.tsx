'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function NouveauMotDePasse() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleReset = async () => {
    if (!password || !confirm) { setError('Veuillez remplir tous les champs.'); return }
    if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError('Une erreur est survenue. Le lien a peut-être expiré.')
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/'), 3000)
    }
  }

  const inputStyle = {
    width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px',
    padding: '11px 14px', fontSize: '14px', outline: 'none',
    fontFamily: '"DM Sans", sans-serif', background: '#fafafa',
    boxSizing: 'border-box' as const,
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', display: 'flex', flexDirection: 'column', fontFamily: '"DM Sans", sans-serif' }}>
      <nav style={{ background: '#fff', borderBottom: '1px solid #e8eaf0', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center' }}>
        <div onClick={() => router.push('/')} style={{ fontSize: '15px', fontWeight: 700, color: '#0f2d6b', cursor: 'pointer' }}>
          Trouve ton réparateur
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '440px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>

          {success ? (
            <>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Mot de passe modifié !</div>
              <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.6 }}>
                Votre mot de passe a été mis à jour avec succès.<br />
                Vous allez être redirigé automatiquement...
              </div>
            </>
          ) : (
            <>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Nouveau mot de passe</div>
              <div style={{ fontSize: '13px', color: '#888', marginBottom: '1.5rem' }}>Choisissez un nouveau mot de passe sécurisé</div>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#dc2626', textAlign: 'left' }}>
                  {error}
                </div>
              )}

              <div style={{ textAlign: 'left', marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '5px' }}>Nouveau mot de passe</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
              </div>

              <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '5px' }}>Confirmer le mot de passe</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReset()} placeholder="••••••••" style={inputStyle} />
              </div>

              <button onClick={handleReset} disabled={loading} style={{ width: '100%', background: loading ? '#93c5fd' : '#0f2d6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                {loading ? 'Modification...' : 'Enregistrer le nouveau mot de passe →'}
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
