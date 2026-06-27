'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Dashboard() {
  const [reparateur, setReparateur] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('accueil')
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/espace-reparateur'); return }
      const { data } = await supabase.from('reparateurs').select('*').eq('email', user.email).single()
      setReparateur(data)
      setLoading(false)
    }
    init()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/espace-reparateur')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e0e0e0', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <div style={{ fontSize: '14px', color: '#888' }}>Chargement...</div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const sidebarItems = [
    { id: 'accueil', icon: '▪', label: 'Tableau de bord' },
    { id: 'profil', icon: '▪', label: 'Mon profil' },
    { id: 'photos', icon: '▪', label: 'Mes photos' },
    { id: 'avis', icon: '▪', label: 'Mes avis' },
    { id: 'horaires', icon: '▪', label: 'Mes horaires' },
    { id: 'parametres', icon: '▪', label: 'Paramètres' },
  ]

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: '"DM Sans", sans-serif' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      {/* NAVBAR */}
      <nav style={{
        background: '#ffffff',
        boxShadow: '0 1px 0 #e8eaf0, 0 2px 12px rgba(0,0,0,0.04)',
        padding: '0 2rem', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div
          onClick={() => router.push('/')}
          style={{ fontSize: '15px', fontWeight: 700, color: '#0f2d6b', cursor: 'pointer', letterSpacing: '-0.01em' }}
        >
          Trouve ton réparateur
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb, #0f2d6b)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 700, color: '#fff',
            }}>
              {reparateur?.nom?.[0] || 'R'}
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>{reparateur?.nom}</span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              fontSize: '13px', color: '#888', background: '#f5f5f5',
              border: '1px solid #e8e8e8', borderRadius: '6px',
              padding: '6px 14px', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
            }}
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <div style={{ display: 'flex' }}>

        {/* SIDEBAR */}
        <div style={{
          width: '220px', background: '#ffffff',
          borderRight: '1px solid #e8eaf0',
          minHeight: 'calc(100vh - 60px)',
          padding: '1.25rem 0',
          flexShrink: 0,
          position: 'sticky', top: '60px', height: 'calc(100vh - 60px)',
        }}>
          <div style={{ padding: '0 1rem 0.75rem', fontSize: '10px', fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Menu
          </div>
          {sidebarItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 1rem', margin: '1px 8px',
                fontSize: '13px', fontWeight: activeTab === item.id ? 600 : 500,
                color: activeTab === item.id ? '#2563eb' : '#555',
                background: activeTab === item.id ? '#eff6ff' : 'transparent',
                borderRadius: '8px',
                borderLeft: activeTab === item.id ? '3px solid #2563eb' : '3px solid transparent',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (activeTab !== item.id) e.currentTarget.style.background = '#f8f9fc' }}
              onMouseLeave={e => { if (activeTab !== item.id) e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{
                width: '28px', height: '28px', borderRadius: '7px',
                background: activeTab === item.id ? '#dbeafe' : '#f4f4f4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px',
              }}>
                {item.id === 'accueil' && '🏠'}
                {item.id === 'profil' && '👤'}
                {item.id === 'photos' && '📷'}
                {item.id === 'avis' && '⭐'}
                {item.id === 'horaires' && '🕐'}
                {item.id === 'parametres' && '⚙️'}
              </div>
              {item.label}
            </div>
          ))}

          <div style={{ margin: '1rem 8px 0', borderTop: '1px solid #f0f0f0', paddingTop: '1rem' }}>
            <div
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 1rem', fontSize: '13px', fontWeight: 500,
                color: '#dc2626', cursor: 'pointer', borderRadius: '8px',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🚪</div>
              Déconnexion
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, padding: '2rem', minWidth: 0 }}>

          {activeTab === 'accueil' && (
            <div>
              {/* Header */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>
                  Bonjour, {reparateur?.nom} 👋
                </div>
                <div style={{ fontSize: '14px', color: '#888', marginTop: '3px' }}>
                  Voici un aperçu de votre activité sur la plateforme
                </div>
              </div>

              {/* STATS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
                {[
                  { icon: '⭐', n: reparateur?.note ? reparateur.note.toFixed(1) : 'N/A', l: 'Note moyenne', bg: '#f0fdf4', iconBg: '#dcfce7', color: '#16a34a' },
                  { icon: '💬', n: '0', l: 'Avis reçus', bg: '#fefce8', iconBg: '#fef08a', color: '#ca8a04' },
                  { icon: '✅', n: reparateur?.statut === 'approved' ? 'Approuvé' : 'En attente', l: 'Statut', bg: '#eff6ff', iconBg: '#bfdbfe', color: '#2563eb' },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: '#ffffff', border: '1px solid #e8eaf0',
                    borderRadius: '12px', padding: '1.25rem',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: s.iconBg, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '18px', marginBottom: '10px',
                    }}>{s.icon}</div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#111', letterSpacing: '-0.03em' }}>{s.n}</div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>{s.l}</div>
                  </div>
                ))}
              </div>

              {/* FICHE */}
              <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>Ma fiche</div>
                  <button
                    onClick={() => setActiveTab('profil')}
                    style={{
                      fontSize: '12px', fontWeight: 600, color: '#2563eb',
                      background: '#eff6ff', border: '1px solid #bfdbfe',
                      borderRadius: '6px', padding: '5px 12px', cursor: 'pointer',
                      fontFamily: '"DM Sans", sans-serif',
                    }}
                  >
                    ✏️ Modifier
                  </button>
                </div>
                {[
                  { l: 'Nom de la boutique', v: reparateur?.nom },
                  { l: 'Ville', v: reparateur?.ville },
                  { l: 'Code postal', v: reparateur?.code_postal },
                  { l: 'Téléphone', v: reparateur?.telephone },
                  { l: 'Adresse', v: reparateur?.adresse },
                ].map((row, i, arr) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: i < arr.length - 1 ? '1px solid #f5f5f5' : 'none',
                  }}>
                    <span style={{ fontSize: '13px', color: '#888' }}>{row.l}</span>
                    <span style={{ fontSize: '13px', color: '#111', fontWeight: 500 }}>{row.v || '—'}</span>
                  </div>
                ))}
              </div>

              {/* BADGE STATUT */}
              <div style={{
                background: reparateur?.statut === 'approved' ? '#f0fdf4' : '#fefce8',
                border: `1px solid ${reparateur?.statut === 'approved' ? '#bbf7d0' : '#fde68a'}`,
                borderRadius: '12px', padding: '1rem 1.25rem',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <div style={{ fontSize: '24px' }}>{reparateur?.statut === 'approved' ? '✅' : '⏳'}</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>
                    {reparateur?.statut === 'approved' ? 'Votre fiche est visible' : 'Votre fiche est en attente'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                    {reparateur?.statut === 'approved'
                      ? 'Les clients peuvent vous trouver dans les résultats de recherche.'
                      : 'Votre fiche sera examinée et publiée sous 24h.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'accueil' && (
            <div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                {sidebarItems.find(i => i.id === activeTab)?.label}
              </div>
              <div style={{
                background: '#fff', border: '1px solid #e8eaf0',
                borderRadius: '12px', padding: '3rem',
                textAlign: 'center', color: '#888',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚧</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#111', marginBottom: '6px' }}>Section en cours de développement</div>
                <div style={{ fontSize: '13px', color: '#888' }}>Cette section sera disponible très prochainement.</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}
