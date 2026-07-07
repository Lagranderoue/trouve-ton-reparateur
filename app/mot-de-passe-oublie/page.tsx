'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function MotDePasseOublie() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleReset = async () => {
    if (!email) { setError('Veuillez entrer votre adresse email.'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://trouvetonreparateur.com/nouveau-mot-de-passe',
    })
    setLoading(false)
    if (error) {
      setError('Une erreur est survenue. Vérifiez votre adresse email.')
    } else {
      setSuccess(true)
    }
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
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Email envoyé !</div>
              <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Un lien de réinitialisation a été envoyé à<br />
                <strong style={{ color: '#111' }}>{email}</strong><br /><br />
                Vérifiez votre boîte mail et cliquez sur le lien pour choisir un nouveau mot de passe.
              </div>
              <button onClick={() => router.push('/')} style={{ background: '#0f2d6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                Retour à l'accueil
              </button>
            </>
          ) : (
            <>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Mot de passe oublié</div>
              <div style={{ fontSize: '13px', color: '#888', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </div>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#dc2626' }}>
                  {error}
                </div>
              )}

              <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '5px' }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleReset()}
                  placeholder="votre@email.com"
                  style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '11px 14px', fontSize: '14px', outline: 'none', fontFamily: '"DM Sans", sans-serif', background: '#fafafa', boxSizing: 'border-box' as const }}
                />
              </div>

              <button onClick={handleReset} disabled={loading} style={{ width: '100%', background: loading ? '#93c5fd' : '#0f2d6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', marginBottom: '12px' }}>
                {loading ? 'Envoi en cours...' : 'Envoyer le lien →'}
              </button>

              <div style={{ fontSize: '13px', color: '#888' }}>
                <span onClick={() => router.back()} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 500 }}>← Retour</span>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
