'use client'
import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

function MobileCards() {
  const [active, setActive] = React.useState(0)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (!scrollRef.current) return
    const cardWidth = scrollRef.current.scrollWidth / 3
    const index = Math.round(scrollRef.current.scrollLeft / cardWidth)
    setActive(index)
  }

  const cards = [
    { icon: '🔍', n: '1', t: 'Trouvez', d: 'Un réparateur certifié proche de chez vous' },
    { icon: '📲', n: '2', t: 'Contactez', d: 'Direct et 100% gratuit' },
    { icon: '🛠️', n: '3', t: 'Réparez', d: 'Votre téléphone comme neuf' },
  ]

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          display: 'flex', gap: '12px',
          overflowX: 'auto', scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '4px', scrollbarWidth: 'none',
        }}
      >
        {cards.map((c, i) => (
          <div key={i} style={{
            flex: '0 0 75%',
            background: '#fff', borderRadius: '14px',
            padding: '1.25rem',
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
            scrollSnapAlign: 'center',
            fontFamily: '"DM Sans", sans-serif',
          }}>
            <div style={{
              width: '40px', height: '40px', background: '#eff6ff',
              borderRadius: '10px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', marginBottom: '10px',
              fontSize: '20px',
            }}>
              {c.icon}
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#f0f0f0', lineHeight: 1, marginBottom: '6px', letterSpacing: '-0.05em' }}>{c.n}</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#111', marginBottom: '4px' }}>{c.t}</div>
            <div style={{ fontSize: '13px', color: '#666', lineHeight: 1.5 }}>{c.d}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', padding: '12px 0 6px' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            height: '6px',
            width: i === active ? '22px' : '6px',
            borderRadius: '3px',
            background: i === active ? '#2563eb' : '#e0e0e0',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>
      <div style={{ textAlign: 'center', fontSize: '11px', color: '#bbb', paddingBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontFamily: '"DM Sans", sans-serif' }}>
        Glissez pour voir la suite →
      </div>
    </div>
  )
}

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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  const router = useRouter()
  const timeoutRef = useRef<any>(null)

  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return }
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          'https://geo.api.gouv.fr/communes?nom=' + encodeURIComponent(query) + '&fields=nom&boost=population&limit=8'
        )
        const data = await res.json()
        const villes = data
          .map((item: any) => item.nom)
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
    <main style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', fontFamily: '"DM Sans", sans-serif' }}>

      {/* HERO WRAPPER - navbar + hero fondus ensemble */}
      <div style={{
        background: 'linear-gradient(135deg, #0f2d6b 0%, #1a4db8 35%, #2563eb 60%, #38a8f5 100%)',
        position: 'relative',
        overflow: 'visible',
      }}>
        {/* Blob décoratif */}
        <div style={{
          position: 'absolute', width: '520px', height: '520px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          top: '-160px', right: '-40px', pointerEvents: 'none',
        }} />

        {/* NAVBAR */}
        <nav style={{
          padding: '0 1.5rem',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10,
        }}>
          <span
            onClick={() => router.push('/')}
            style={{
              fontSize: isMobile ? '14px' : '20px', fontWeight: 700, color: '#ffffff',
              letterSpacing: '-0.01em', cursor: 'pointer',
              whiteSpace: 'nowrap', flexShrink: 0,
              fontFamily: '"DM Sans", sans-serif',
              fontSize: isMobile ? '11px' : undefined,
            }}
          >
            {isMobile ? 'Trouve ton répar.' : 'Trouve ton réparateur'}
          </span>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px', flexShrink: 0 }}>
            <button
              onClick={() => document.getElementById('comment-ca-marche')?.scrollIntoView({ behavior: 'smooth' })}
              className="nav-comment-btn"
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '15px', fontWeight: 500,
                color: '#ffffff',
                background: 'transparent',
                border: 'none', cursor: 'pointer',
                whiteSpace: 'nowrap', padding: '8px 12px', borderRadius: '8px',
                display: isMobile ? 'none' : 'block',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              Comment ça marche ?
            </button>
            <button
              onClick={() => router.push('/mon-compte')}
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: isMobile ? '10px' : '15px', fontWeight: 600,
                color: '#ffffff',
                background: 'rgba(255,255,255,0.12)',
                border: '1.5px solid rgba(255,255,255,0.65)',
                padding: isMobile ? '5px 9px' : '8px 18px',
                borderRadius: '100px', cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.22)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.9)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.65)'
              }}
            >
              Espace client
            </button>
            <button
              onClick={() => router.push('/inscrire')}
              className="nav-reparateur-btn"
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: isMobile ? '10px' : '15px', fontWeight: 600,
                color: '#ffffff',
                background: 'rgba(255,255,255,0.12)',
                border: '1.5px solid rgba(255,255,255,0.65)',
                padding: isMobile ? '5px 9px' : '8px 18px', borderRadius: '100px', cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'block',
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
          padding: isMobile ? '0.25rem 1.25rem 0' : '1rem 1.5rem 0',
          display: 'flex', alignItems: isMobile ? 'flex-start' : 'flex-end',
          minHeight: isMobile ? 'unset' : '380px', position: 'relative', zIndex: 2,
          flexWrap: isMobile ? 'wrap' : 'nowrap',
        }}>
          {/* GAUCHE */}
          <div className="hero-left-col" style={{ flex: 1, paddingBottom: isMobile ? '1.5rem' : '3.5rem', maxWidth: isMobile ? '100%' : '55%' }}>
            <h1 className="hero-title" style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '48px', fontWeight: 700, color: '#fff',
              lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '2rem',
            }}>
              Trouvez le bon<br />réparateur<br /><span style={{background: 'linear-gradient(90deg, #93c5fd, #bfdbfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>près de chez vous.</span>
            </h1>

            {/* BARRE DE RECHERCHE */}
            <div style={{
              background: '#fff', borderRadius: '100px',
              display: 'flex', alignItems: 'center',
              padding: '6px 6px 6px 20px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              maxWidth: '560px', position: 'relative',
            }}>
              <span style={{ fontSize: '18px', color: '#9ca3af', marginRight: '10px', flexShrink: 0 }}>🔍</span>
              <input
                type="text"
                placeholder="Ville ou code postal..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  fontSize: '15px', color: '#111', outline: 'none',
                  fontFamily: '"DM Sans", sans-serif',
                }}
              />

              <button
                onClick={handleSearch}
                className="btn-shine search-bar-btn"
                style={{
                  background: '#0f2d6b', color: '#fff', border: 'none',
                  borderRadius: '100px', padding: '12px 24px',
                  fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                  whiteSpace: 'nowrap', fontFamily: '"DM Sans", sans-serif',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  position: 'relative', overflow: 'hidden', transition: 'background 0.2s ease',
                }}
              >
                Rechercher ›
              </button>

              {showSuggestions && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute', top: '110%', left: 0, right: 0,
                  background: '#fff', border: '1px solid #e0e0e0',
                  borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  zIndex: 20, overflow: 'hidden',
                }}>
                  {suggestions.map((ville, i) => (
                    <button
                      key={i}
                      onClick={() => selectSuggestion(ville)}
                      style={{
                        width: '100%', textAlign: 'left', padding: '11px 16px',
                        fontSize: '14px', color: '#111', background: 'none',
                        border: 'none', borderBottom: '1px solid #f5f5f5', cursor: 'pointer',
                        fontFamily: '"DM Sans", sans-serif', display: 'flex', alignItems: 'center', gap: '8px',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f8f9fc')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      <span><span style={{ fontWeight: 700, color: '#111' }}>{ville.slice(0, query.length)}</span><span style={{ color: '#555' }}>{ville.slice(query.length)}</span></span>
                      <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#bbb', fontFamily: '"DM Sans", sans-serif' }}>France</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* DROITE - espace photo */}
          <div style={{
            flex: '0 0 42%', display: isMobile ? 'none' : 'flex', alignItems: 'flex-end',
            justifyContent: 'center', minHeight: '380px', position: 'relative', zIndex: 2,
          }}>
            <div style={{
              width: '100%', maxWidth: '360px', height: '380px',
              background: 'rgba(255,255,255,0.07)',
              borderRadius: '50% 50% 0 0 / 55% 55% 0 0',
              border: '1px solid rgba(255,255,255,0.12)', borderBottom: 'none',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '10px',
            }}>
              <span style={{ fontSize: '36px', opacity: 0.2 }}>📷</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.22)' }}>Photo à venir</span>
            </div>
          </div>
        </div>
      </div>

      {/* STATS desktop / CARDS mobile */}
      {!isMobile ? (
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
              padding: '1.5rem', textAlign: 'center',
              borderRight: i < 3 ? '1px solid #ebebeb' : 'none',
            }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#111', letterSpacing: '-0.03em', fontFamily: '"DM Sans", sans-serif' }}>{s.n}</div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '2px', fontFamily: '"DM Sans", sans-serif' }}>{s.l}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '1.25rem 1.25rem 0.5rem', background: '#f8f9fc' }}>
          <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.75rem', fontFamily: '"DM Sans", sans-serif' }}>
            Comment ça marche ?
          </div>
          <MobileCards />
        </div>
      )}

      {/* CHIFFRES MOBILE */}
      {isMobile && (
        <div style={{ padding: '2rem 1.5rem', textAlign: 'center', borderBottom: '1px solid #f0f0f0', maxWidth: '100%', overflow: 'hidden' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f2d6b', marginBottom: '2rem', fontFamily: '"DM Sans", sans-serif' }}>
            Trouve ton réparateur en chiffres
          </div>
          {[
            { n: '+2 000', l: 'réparateurs certifiés et formés' },
            { n: '+480 000', l: 'téléphones réparés' },
            { n: '11 040', l: 'tonnes de CO₂ évitées grâce à la réparation' },
          ].map((s, i, arr) => (
            <div key={i} style={{
              paddingBottom: i < arr.length - 1 ? '1.5rem' : 0,
              marginBottom: i < arr.length - 1 ? '1.5rem' : 0,
              borderBottom: i < arr.length - 1 ? '1px solid #f0f0f0' : 'none',
            }}>
              <div style={{ fontSize: '42px', fontWeight: 700, color: '#0f2d6b', letterSpacing: '-0.04em', lineHeight: 1, fontFamily: '"DM Sans", sans-serif' }}>{s.n}</div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '6px', lineHeight: 1.4, fontFamily: '"DM Sans", sans-serif' }}>{s.l}</div>
            </div>
          ))}
        </div>
      )}

      {/* COMMENT CA MARCHE */}

      {/* CTA RÉPARATEURS */}
      {!isMobile && (
        <div className="cta-block" style={{
          background: '#0a0a0a', margin: '0 1.5rem 2rem',
          borderRadius: '16px', padding: '2.5rem 1.5rem', textAlign: 'center',
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#fff', marginBottom: '0.5rem', fontFamily: '"DM Sans", sans-serif' }}>
            Tu répares des téléphones ?
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem', lineHeight: 1.6, fontFamily: '"DM Sans", sans-serif' }}>
            Rejoins la plateforme gratuitement.<br />Sois visible, crédible, trouvé.
          </p>
          <button
            onClick={() => router.push('/inscrire')}
            style={{
              background: '#fff', color: '#111', border: 'none',
              borderRadius: '100px', padding: '11px 28px',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              fontFamily: '"DM Sans", sans-serif',
            }}
          >
            Inscrire ma boutique — c'est gratuit
          </button>
        </div>
      )}

      {/* FAQ */}
      <section style={{ maxWidth: '640px', margin: '0 auto', padding: '0 1.5rem 3rem', width: '100%' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111', marginBottom: '1.25rem', textAlign: 'center', fontFamily: '"DM Sans", sans-serif' }}>
          Questions frequentes
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { q: "Comment fonctionne Trouve ton réparateur ?", a: "Entrez votre ville ou code postal, on vous affiche les réparateurs les plus proches. Cliquez sur une fiche pour voir les services, horaires et contacter le professionnel directement." },
            { q: "Est-ce gratuit pour les clients ?", a: "Oui, totalement gratuit. Vous trouvez un réparateur, vous l'appelez directement. Aucune commission, aucun intermédiaire." },
            { q: "Les réparateurs sont-ils vérifiés ?", a: "Oui. Chaque réparateur inscrit fournit un document Kbis. Seules les boutiques validées apparaissent dans les résultats." },
            { q: "Comment inscrire ma boutique ?", a: "Cliquez sur Vous etes reparateur en haut de la page, remplissez le formulaire et deposez votre Kbis. Votre fiche sera publiee sous 24h." },
            { q: "Comment contacter un réparateur ?", a: "Cliquez sur la fiche du réparateur puis appuyez sur le bouton Appeler pour le contacter directement." },
            { q: "Qu'est-ce que le déplacement à domicile ?", a: "Certains réparateurs se déplacent directement chez vous. Repérez le badge vert Déplacement à domicile sur les fiches." },
          ].map((item, i) => (
            <FaqItem key={i} question={item.q} answer={item.a} />
          ))}
        </div>
      </section>

    </main>
  )
}
