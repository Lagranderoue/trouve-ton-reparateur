'use client'
import { useState } from 'react'
import Navbar from '../../components/Navbar'

function Footer() {
  return (
    <footer style={{ background: '#0f2d6b', padding: '2rem 2rem 1.5rem', marginTop: '3rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Trouve ton réparateur</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>La plateforme qui connecte les clients avec les meilleurs réparateurs de téléphone en France.</div>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '10px' }}>Plateforme</div>
            {[{l:'Trouver un réparateur',h:'/'},{l:'Inscrire ma boutique',h:'/espace-reparateur'},{l:'Espace client',h:'/mon-compte'},{l:'Espace réparateur',h:'/espace-reparateur'}].map((x,i) => (
              <a key={i} href={x.h} style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginBottom: '6px', textDecoration: 'none' }}>{x.l}</a>
            ))}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '10px' }}>Légal</div>
            {[{l:'Mentions légales',h:'/mentions-legales'},{l:'CGV',h:'/cgv'},{l:'Confidentialité',h:'/confidentialite'},{l:'Contact',h:'/contact'}].map((x,i) => (
              <a key={i} href={x.h} style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginBottom: '6px', textDecoration: 'none' }}>{x.l}</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>© 2026 Trouve ton réparateur — Tous droits réservés</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {[{l:'Mentions légales',h:'/mentions-legales'},{l:'CGV',h:'/cgv'},{l:'Confidentialité',h:'/confidentialite'}].map((x,i) => (
              <a key={i} href={x.h} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>{x.l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function Contact() {
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [sujet, setSujet] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!prenom || !email || !sujet || !message) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    setLoading(true)
    setError('')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prenom, email, sujet, message })
    })
    setLoading(false)
    if (res.ok) {
      setSuccess(true)
    } else {
      setError('Une erreur est survenue. Veuillez réessayer.')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px',
    padding: '10px 12px', fontSize: '13px', color: '#111',
    background: '#fff', fontFamily: '"DM Sans", sans-serif', outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '11px', fontWeight: 600, color: '#888',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    marginBottom: '5px', display: 'block',
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: '"DM Sans", sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <a href="/" style={{ fontSize: '12px', color: '#888', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>← Retour à l'accueil</a>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111', marginBottom: '6px' }}>Nous contacter</h1>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '2rem' }}>Une question ? Nous vous répondrons dans les plus brefs délais.</p>

        {/* Cards info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '2rem' }}>
          <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '20px' }}>✉️</span>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111', marginBottom: '2px' }}>Email</div>
              <a href="mailto:lagranderouecontact@gmail.com" style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'none' }}>lagranderouecontact@gmail.com</a>
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '20px' }}>⏱️</span>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111', marginBottom: '2px' }}>Réponse sous</div>
              <div style={{ fontSize: '12px', color: '#888' }}>24 à 48h ouvrées</div>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        {success ? (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#111', marginBottom: '6px' }}>Message envoyé !</div>
            <div style={{ fontSize: '13px', color: '#555' }}>Nous vous répondrons dans les 24 à 48h ouvrées.</div>
          </div>
        ) : (
          <div style={{ background: '#f8f9fc', borderRadius: '12px', padding: '20px', border: '1px solid #e8eaf0' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '16px' }}>Formulaire de contact</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={labelStyle}>Prénom</label>
                <input value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Votre prénom" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Sujet</label>
              <input value={sujet} onChange={e => setSujet(e.target.value)} placeholder="Votre sujet" style={inputStyle} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Message</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Votre message..." style={{ ...inputStyle, minHeight: '100px', resize: 'none' }} />
            </div>

            {error && (
              <div style={{ fontSize: '13px', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px' }}>{error}</div>
            )}

            <button onClick={handleSubmit} disabled={loading} style={{ background: loading ? '#93c5fd' : '#0f2d6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
              {loading ? 'Envoi en cours...' : 'Envoyer le message →'}
            </button>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
