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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Sans", sans-serif', color: '#888' }}>
      Chargement...
    </div>
  )

  const sidebarItems = [
    { id: 'accueil', icon: '🏠', label: 'Tableau de bord' },
    { id: 'profil', icon: '👤', label: 'Mon profil' },
    { id: 'photos', icon: '📷', label: 'Mes photos' },
    { id: 'avis', icon: '⭐', label: 'Mes avis' },
    { id: 'horaires', icon: '🕐', label: 'Mes horaires' },
  ]

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: '"DM Sans", sans-serif' }}>

      {/* NAVBAR */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e8eaf0', padding: '0 1.5rem', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2d6b', cursor: 'pointer' }} onClick={() => router.push('/')}>
          Trouve ton réparateur
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>👤</div>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#111' }}>{reparateur?.nom || 'Mon espace'}</span>
          <button onClick={handleLogout} style={{ fontSize: '12px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
            Déconnexion
          </button>
        </div>
      </nav>

      <div style={{ display: 'flex' }}>

        {/* SIDEBAR */}
        <div style={{ width: '200px', background: '#fff', borderRight: '1px solid #e8eaf0', minHeight: 'calc(100vh - 56px)', padding: '1rem 0', flexShrink: 0 }}>
          {sidebarItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 1.25rem', fontSize: '13px', fontWeight: 500,
                color: activeTab === item.id ? '#2563eb' : '#666',
                background: activeTab === item.id ? '#eff6ff' : 'transparent',
                borderLeft: `3px solid ${activeTab === item.id ? '#2563eb' : 'transparent'}`,
                cursor: 'pointer',
              }}
            >
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, padding: '1.5rem', maxWidth: 'calc(100% - 200px)' }}>

          {activeTab === 'accueil' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#111' }}>Bonjour, {reparateur?.nom} 👋</div>
                <div style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>Voici un aperçu de votre activité</div>
              </div>

              {/* STATS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1.25rem' }}>
                {[
                  { n: reparateur?.note ? reparateur.note.toFixed(1) + '★' : 'N/A', l: 'Note moyenne', bg: '#f0fdf4', color: '#16a34a' },
                  { n: '0', l: 'Avis reçus', bg: '#fefce8', color: '#ca8a04' },
                  { n: reparateur?.statut === 'approved' ? '✓' : '⏳', l: 'Statut', bg: '#eff6ff', color: '#2563eb' },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ width: '32px', height: '32px', background: s.bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', fontSize: '14px', color: s.color, fontWeight: 700 }}>{s.n[0]}</div>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.03em' }}>{s.n}</div>
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>{s.l}</div>
                  </div>
                ))}
              </div>

              {/* INFOS RAPIDES */}
              <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111', marginBottom: '1rem' }}>Ma fiche</div>
                {[
                  { l: 'Nom', v: reparateur?.nom },
                  { l: 'Ville', v: reparateur?.ville },
                  { l: 'Téléphone', v: reparateur?.telephone },
                  { l: 'Adresse', v: reparateur?.adresse },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 3 ? '1px solid #f5f5f5' : 'none' }}>
                    <span style={{ fontSize: '13px', color: '#888' }}>{row.l}</span>
                    <span style={{ fontSize: '13px', color: '#111', fontWeight: 500 }}>{row.v || '—'}</span>
                  </div>
                ))}
                <button
                  onClick={() => setActiveTab('profil')}
                  style={{ marginTop: '1rem', background: '#0f2d6b', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}
                >
                  Modifier mes infos →
                </button>
              </div>
            </div>
          )}

          {activeTab === 'profil' && (
            <div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#111', marginBottom: '1.25rem' }}>Mon profil</div>
              <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.25rem' }}>
                <p style={{ fontSize: '14px', color: '#888', textAlign: 'center', padding: '2rem 0' }}>
                  🚧 Section en cours de développement
                </p>
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#111', marginBottom: '1.25rem' }}>Mes photos</div>
              <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.25rem' }}>
                <p style={{ fontSize: '14px', color: '#888', textAlign: 'center', padding: '2rem 0' }}>
                  🚧 Section en cours de développement
                </p>
              </div>
            </div>
          )}

          {activeTab === 'avis' && (
            <div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#111', marginBottom: '1.25rem' }}>Mes avis</div>
              <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.25rem' }}>
                <p style={{ fontSize: '14px', color: '#888', textAlign: 'center', padding: '2rem 0' }}>
                  🚧 Section en cours de développement
                </p>
              </div>
            </div>
          )}

          {activeTab === 'horaires' && (
            <div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#111', marginBottom: '1.25rem' }}>Mes horaires</div>
              <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.25rem' }}>
                <p style={{ fontSize: '14px', color: '#888', textAlign: 'center', padding: '2rem 0' }}>
                  🚧 Section en cours de développement
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}
