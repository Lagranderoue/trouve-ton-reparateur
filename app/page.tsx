'use client'
import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
      >
        <span>{question}</span>
        <span className="text-gray-400 ml-4">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()
  const timeoutRef = useRef<any>(null)

  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return }
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          'https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(query) + '&countrycodes=fr&format=json&limit=5&addressdetails=1',
          { headers: { 'User-Agent': 'trouvetonreparateur/1.0' } }
        )
        const data = await res.json()
        const villes = data
          .map((item: any) => item.address?.city || item.address?.town || item.address?.village || item.address?.municipality || '')
          .filter((v: string) => v.length > 0)
          .filter((v: string, i: number, arr: string[]) => arr.indexOf(v) === i)
        setSuggestions(villes)
        setShowSuggestions(true)
      } catch { setSuggestions([]) }
    }, 300)
  }, [query])

  const handleSearch = () => {
    if (query.trim()) {
      setShowSuggestions(false)
      router.push('/resultats?q=' + encodeURIComponent(query.trim()))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleGeolocate = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords
      router.push('/resultats?lat=' + latitude + '&lng=' + longitude)
    })
  }

  const selectSuggestion = (ville: string) => {
    setQuery(ville)
    setShowSuggestions(false)
    router.push('/resultats?q=' + encodeURIComponent(ville))
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* HERO WRAPPER */}
      <div style={{
        background: 'linear-gradient(135deg, #0f2d6b 0%, #1a4db8 35%, #2563eb 60%, #38a8f5 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Blob décoratif */}
        <div style={{
          position: 'absolute', width: '520px', height: '520px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          top: '-160px', right: '-40px', pointerEvents: 'none',
        }} />

        {/* NAVBAR fondue dans le bleu */}
        <nav style={{
          padding: '0 1.5rem',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10,
          fontFamily: '"DM Sans", sans-serif',
        }}>
          <span style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#ffffff',
            letterSpacing: '-0.01em',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            fontFamily: '"DM Sans", sans-serif',
          }}
            onClick={() => router.push('/')}
          >
            Trouve ton réparateur
          </span>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <button
              onClick={() => document.getElementById('comment-ca-marche')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                color: '#ffffff',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                padding: '8px 12px',
                borderRadius: '8px',
                WebkitAppearance: 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              Comment ça marche ?
            </button>
            <button
              onClick={() => router.push('/inscrire')}
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#ffffff',
                background: 'rgba(255,255,255,0.12)',
                border: '1.5px solid rgba(255,255,255,0.65)',
                padding: '8px 18px',
                borderRadius: '100px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                WebkitAppearance: 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.22)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.9)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.65)'
              }}
              onMouseDown={e => {
                e.currentTarget.style.transform = 'scale(0.96)'
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(255,255,255,0.15)'
              }}
              onMouseUp={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Vous êtes réparateur ?
            </button>
          </div>
        </nav>

      {/* HERO */}
      <div style={{
        background: 'linear-gradient(135deg, #0f2d6b 0%, #1a4db8 35%, #2563eb 60%, #38a8f5 100%)',
        padding: '2.5rem 2rem 0',
        display: 'flex',
        alignItems: 'center',
        minHeight: '380px',
        overflow: 'hidden',
        position: 'relative',
        gap: '1rem',
      }}>
        {/* Blobs décoratifs */}
        <div style={{
          position: 'absolute', width: '340px', height: '340px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,179,255,0.18) 0%, transparent 70%)',
          top: '-80px', right: '60px', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: '240px', height: '240px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)',
          bottom: '20px', left: '10px', pointerEvents: 'none',
        }} />

        {/* GAUCHE — texte + recherche */}
        <div style={{
          flex: '0 0 52%', maxWidth: '52%',
          position: 'relative', zIndex: 2,
          paddingBottom: '2.5rem',
          display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>
          {/* Cadran glassmorphism */}
          <div style={{
            width: '100%',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem 1.1rem',
            backdropFilter: 'blur(20px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 32px rgba(0,0,0,0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.20)',
              borderRadius: '100px',
              padding: '3px 10px',
              fontSize: '10px', fontWeight: 500, color: 'rgba(255,255,255,0.75)',
              letterSpacing: '0.04em', marginBottom: '0.75rem',
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#86efac', display: 'inline-block' }} />
              Réparateurs vérifiés en France
            </div>
            {/* Titre */}
            <h1 style={{
              fontSize: '24px', fontWeight: 500, color: '#fff',
              lineHeight: 1.25, letterSpacing: '-0.02em', margin: 0,
            }}>
              Ton téléphone est cassé ?<br />
              Trouve le bon réparateur<br />
              <span style={{
                background: 'linear-gradient(90deg, #93c5fd, #bfdbfe, #e0f2fe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                près de chez vous.
              </span>
            </h1>
            <p style={{
              fontSize: '12.5px', color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.6, marginTop: '0.6rem',
            }}>
              Comparez les avis, les services et les horaires.<br />Gratuit. Sans inscription.
            </p>
          </div>

          {/* Cadran recherche */}
          <div style={{
            width: '100%',
            background: 'rgba(255,255,255,0.96)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            position: 'relative', zIndex: 2,
          }}>
            <div style={{
              fontSize: '10px', fontWeight: 500, color: '#888',
              textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '7px',
            }}>
              Où êtes-vous ?
            </div>
            <div style={{ display: 'flex', gap: '7px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Ville ou code postal..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                style={{
                  flex: 1, border: '1px solid #e0e0e0', borderRadius: '6px',
                  padding: '9px 12px', fontSize: '13px', color: '#111',
                  background: '#f8f9fc', outline: 'none',
                }}
              />
              <button
                onClick={handleSearch}
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                  color: '#fff', border: 'none', borderRadius: '6px',
                  padding: '9px 16px', fontSize: '12px', fontWeight: 500,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                Chercher →
              </button>
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                background: '#fff', border: '1px solid #e0e0e0',
                borderRadius: '8px', marginTop: '4px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)', zIndex: 20, overflow: 'hidden',
              }}>
                {suggestions.map((ville, i) => (
                  <button
                    key={i}
                    onClick={() => selectSuggestion(ville)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '10px 14px',
                      fontSize: '13px', color: '#333', background: 'none',
                      border: 'none', borderBottom: '1px solid #f0f0f0', cursor: 'pointer',
                    }}
                  >
                    📍 {ville}
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
              {[
                { icon: '✓', label: 'Kbis vérifié' },
                { icon: '★', label: 'Avis certifiés' },
                { icon: '📍', label: 'Rayon 70 km' },
              ].map((item, i) => (
                <span key={i} style={{ fontSize: '10px', color: '#999', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <span style={{ color: '#bbb' }}>{item.icon}</span> {item.label}
                </span>
              ))}
            </div>

            <button
              onClick={handleGeolocate}
              style={{
                marginTop: '8px', fontSize: '11px', color: '#888',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              }}
            >
              📍 Utiliser ma position actuelle
            </button>
          </div>
        </div>

        {/* DROITE — espace photo */}
        <div style={{
          flex: 1,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          alignSelf: 'flex-end',
          position: 'relative', zIndex: 2,
          minHeight: '300px',
        }}>
          <div style={{
            width: '190px', height: '280px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderBottom: 'none',
            borderRadius: '10px 10px 0 0',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
            <span style={{ fontSize: '30px', opacity: 0.2 }}>📷</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>Photo à venir</span>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        borderBottom: '1px solid #ebebeb',
      }}>
        {[
          { n: '+500', l: 'Réparateurs' },
          { n: '4.8★', l: 'Note moyenne' },
          { n: '100%', l: 'Gratuit' },
          { n: '<2min', l: 'Pour trouver' },
        ].map((s, i) => (
          <div key={i} style={{
            padding: '1.25rem', textAlign: 'center',
            borderRight: i < 3 ? '1px solid #ebebeb' : 'none',
          }}>
            <div style={{ fontSize: '22px', fontWeight: 500, color: '#111', letterSpacing: '-0.03em' }}>{s.n}</div>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* COMMENT ÇA MARCHE */}
      <section id="comment-ca-marche" style={{ padding: '2.5rem 2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#999', marginBottom: '0.5rem' }}>
          Comment ça marche
        </div>
        <div style={{ fontSize: '22px', fontWeight: 500, color: '#111', marginBottom: '1.5rem' }}>Simple et rapide.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { n: '01', t: 'Tu cherches', d: 'Tape ta ville ou ton code postal. On géolocalise les pros autour de toi.' },
            { n: '02', t: 'Tu compares', d: 'Avis, services, horaires — tout est visible avant d\'appeler.' },
            { n: '03', t: 'Tu appelles', d: 'Un clic pour contacter directement le réparateur de ton choix.' },
            { n: '04', t: 'Tu notes', d: 'Laisse un avis pour aider toute la communauté.' },
          ].map((step, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '16px',
              padding: '1rem 0',
              borderBottom: i < 3 ? '1px solid #f0f0f0' : 'none',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: '#bbb', minWidth: '24px', paddingTop: '2px' }}>{step.n}</div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 500, color: '#111', marginBottom: '2px' }}>{step.t}</div>
                <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.55 }}>{step.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA RÉPARATEURS */}
      <div style={{
        background: '#0a0a0a', margin: '0 1.5rem 2rem',
        borderRadius: '16px', padding: '2.5rem 1.5rem', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: '22px', fontWeight: 500, color: '#fff', marginBottom: '0.5rem' }}>
          Tu répares des téléphones ?
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Rejoins la plateforme gratuitement.<br />Sois visible, crédible, trouvé.
        </p>
        <button
          onClick={() => router.push('/inscrire')}
          style={{
            background: '#fff', color: '#111', border: 'none',
            borderRadius: '100px', padding: '11px 28px',
            fontSize: '14px', fontWeight: 500, cursor: 'pointer',
          }}
        >
          Inscrire ma boutique — c'est gratuit →
        </button>
      </div>

      {/* FAQ */}
      <section style={{ maxWidth: '640px', margin: '0 auto', padding: '0 1.5rem 3rem', width: '100%' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#111', marginBottom: '1.25rem', textAlign: 'center' }}>
          Questions fréquentes
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { q: "Comment fonctionne Trouve ton réparateur ?", a: "Entrez votre ville ou code postal, on vous affiche les réparateurs les plus proches. Cliquez sur une fiche pour voir les services, horaires et contacter le professionnel directement." },
            { q: "Est-ce gratuit pour les clients ?", a: "Oui, totalement gratuit. Vous trouvez un réparateur, vous l'appelez directement. Aucune commission, aucun intermédiaire." },
            { q: "Les réparateurs sont-ils vérifiés ?", a: "Oui. Chaque réparateur inscrit fournit un document Kbis. Seules les boutiques validées apparaissent dans les résultats." },
            { q: "Comment inscrire ma boutique ?", a: "Cliquez sur \"Je suis réparateur\" en haut de la page, remplissez le formulaire et déposez votre Kbis. Votre fiche sera publiée sous 24h." },
            { q: "Comment contacter un réparateur ?", a: "Cliquez sur la fiche du réparateur puis appuyez sur le bouton \"Appeler\" pour le contacter directement." },
            { q: "Qu'est-ce que le déplacement à domicile ?", a: "Certains réparateurs se déplacent directement chez vous. Repérez le badge vert \"Déplacement à domicile\" sur les fiches." },
          ].map((item, i) => (
            <FaqItem key={i} question={item.q} answer={item.a} />
          ))}
        </div>
      </section>

    </main>
  )
}
