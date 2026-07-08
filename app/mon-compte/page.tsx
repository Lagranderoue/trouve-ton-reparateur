'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import {
  IconLayoutDashboard, IconStar, IconCalendar, IconUser,
  IconLogout, IconPencil, IconCheck, IconClock, IconX,
  IconBuildingStore
} from '@tabler/icons-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function MonCompteInner() {
  const [user, setUser] = useState<any>(null)
  const [client, setClient] = useState<any>(null)
  const [avis, setAvis] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) setActiveTab(tab)
  }, [])

  const changeTab = (tab: string) => {
    setActiveTab(tab)
    window.history.pushState({}, '', '/mon-compte?tab=' + tab)
  }

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/connexion?redirect=/mon-compte'); return }
      setUser(user)

      const { data: clientData } = await supabase.from('clients').select('*').eq('id', user.id).single()
      setClient(clientData || {})

      const res = await fetch('/api/mes-avis?user_id=' + user.id)
      const data = await res.json()
      setAvis(data.avis || [])

      setLoading(false)
    }
    init()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #e0e0e0', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <div style={{ fontSize: '14px', color: '#888' }}>Chargement...</div>
      </div>
      <style>{"@keyframes spin { to { transform: rotate(360deg) } }"}</style>
    </div>
  )

  const sidebarItems = [
    { id: 'dashboard', icon: <IconLayoutDashboard size={18} />, label: 'Tableau de bord' },
    { id: 'avis', icon: <IconStar size={18} />, label: 'Mes avis' },
    { id: 'reservations', icon: <IconCalendar size={18} />, label: 'Mes réservations' },
    { id: 'profil', icon: <IconUser size={18} />, label: 'Mon profil' },
  ]

  const prenom = client?.prenom || user?.email?.split('@')[0] || ''

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: '"DM Sans", sans-serif' }}>
      <style>{"@keyframes spin { to { transform: rotate(360deg) } }"}</style>

      <nav style={{ background: '#fff', boxShadow: '0 1px 0 #e8eaf0', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => router.push('/')} style={{ fontSize: '15px', fontWeight: 700, color: '#0f2d6b', cursor: 'pointer' }}>
          Trouve ton réparateur
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #0f2d6b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff' }}>
            {prenom[0]?.toUpperCase() || 'C'}
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>{prenom}</span>
        </div>
      </nav>

      {/* Navigation mobile en bas */}
      <div style={{ display: 'none' }} className="mobile-nav-bottom" />
      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .main-content-area { padding: 1rem !important; padding-bottom: 80px !important; }
          .mobile-bottom-nav { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-bottom-nav { display: none !important; }
        }
      `}</style>

      {/* Nav mobile bas */}
      <div className="mobile-bottom-nav" style={{ display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e8eaf0', zIndex: 100, padding: '8px 0' }}>
        {sidebarItems.map(item => (
          <div key={item.id} onClick={() => changeTab(item.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', padding: '4px 0' }}>
            <div style={{ color: activeTab === item.id ? '#2563eb' : '#999' }}>{item.icon}</div>
            <div style={{ fontSize: '9px', fontWeight: 500, color: activeTab === item.id ? '#2563eb' : '#999' }}>{item.label.replace('Mon ', '').replace('Mes ', '')}</div>
          </div>
        ))}
        <div onClick={handleLogout} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', padding: '4px 0' }}>
          <div style={{ color: '#dc2626' }}><IconLogout size={18} /></div>
          <div style={{ fontSize: '9px', fontWeight: 500, color: '#dc2626' }}>Quitter</div>
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        <div className='sidebar-desktop' style={{ width: '220px', background: '#fff', borderRight: '1px solid #e8eaf0', minHeight: 'calc(100vh - 60px)', padding: '1.25rem 0', flexShrink: 0, position: 'sticky', top: '60px', height: 'calc(100vh - 60px)', overflowY: 'auto' }}>
          <div style={{ padding: '0 1rem 0.75rem', fontSize: '10px', fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mon espace</div>
          {sidebarItems.map(item => (
            <div key={item.id} onClick={() => changeTab(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 1rem', margin: '1px 8px', fontSize: '13px', fontWeight: activeTab === item.id ? 600 : 500, color: activeTab === item.id ? '#2563eb' : '#555', background: activeTab === item.id ? '#eff6ff' : 'transparent', borderRadius: '8px', borderLeft: activeTab === item.id ? '3px solid #2563eb' : '3px solid transparent', cursor: 'pointer' }}>
              {item.icon} {item.label}
            </div>
          ))}
          <div style={{ margin: '1rem 8px 0', borderTop: '1px solid #f0f0f0', paddingTop: '1rem' }}>
            <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 1rem', fontSize: '13px', fontWeight: 500, color: '#dc2626', cursor: 'pointer', borderRadius: '8px' }}>
              <IconLogout size={18} /> Déconnexion
            </div>
          </div>
        </div>

        <div className='main-content-area' style={{ flex: 1, padding: '2rem', minWidth: 0 }}>

          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>Bonjour, {prenom} 👋</div>
                <div style={{ fontSize: '14px', color: '#888', marginTop: '3px' }}>Bienvenue dans votre espace client</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                  { icon: <IconStar size={20} color="#ca8a04" />, n: avis.length.toString(), l: 'Avis laissés', bg: '#fefce8' },
                  { icon: <IconCalendar size={20} color="#2563eb" />, n: '0', l: 'Réservations', bg: '#eff6ff' },
                  { icon: <IconUser size={20} color="#16a34a" />, n: '0', l: 'Messages', bg: '#f0fdf4' },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>{s.icon}</div>
                    <div style={{ fontSize: '26px', fontWeight: 700, color: '#111', letterSpacing: '-0.03em' }}>{s.n}</div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>{s.l}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '1rem' }}>Mes derniers avis</div>
                {avis.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0', color: '#888', fontSize: '13px' }}>
                    <IconStar size={36} color="#e0e0e0" style={{ marginBottom: '8px' }} />
                    <div>Vous n'avez pas encore laissé d'avis</div>
                  </div>
                ) : avis.slice(0, 3).map((a: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 0', borderBottom: i < 2 ? '1px solid #f5f5f5' : 'none' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconBuildingStore size={18} color="#2563eb" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{a.reparateur_nom || 'Réparateur'}</div>
                      <div style={{ fontSize: '12px', color: '#f59e0b' }}>{'★'.repeat(a.note)}{'☆'.repeat(5 - a.note)}</div>
                      <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>{a.commentaire}</div>
                    </div>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '100px',
                      background: a.statut === 'approved' ? '#f0fdf4' : a.statut === 'rejected' ? '#fef2f2' : '#fefce8',
                      color: a.statut === 'approved' ? '#16a34a' : a.statut === 'rejected' ? '#dc2626' : '#ca8a04'
                    }}>
                      {a.statut === 'approved' ? 'Publié' : a.statut === 'rejected' ? 'Refusé' : 'En attente'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'avis' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#111' }}>Mes avis</div>
              <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                {avis.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0', color: '#888' }}>
                    <IconStar size={40} color="#e0e0e0" style={{ marginBottom: '12px' }} />
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#111', marginBottom: '6px' }}>Aucun avis pour le moment</div>
                    <div style={{ fontSize: '13px' }}>Vos avis apparaîtront ici après vos réparations</div>
                  </div>
                ) : avis.map((a: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: i < avis.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconBuildingStore size={20} color="#2563eb" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>{a.reparateur_nom || 'Réparateur'}</div>
                      <div style={{ fontSize: '13px', color: '#f59e0b', margin: '2px 0' }}>{'★'.repeat(a.note)}{'☆'.repeat(5 - a.note)}</div>
                      <div style={{ fontSize: '13px', color: '#555' }}>{a.commentaire}</div>
                      <div style={{ fontSize: '11px', color: '#bbb', marginTop: '4px' }}>{new Date(a.created_at).toLocaleDateString('fr-FR')}</div>
                    </div>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '100px',
                      background: a.statut === 'approved' ? '#f0fdf4' : a.statut === 'rejected' ? '#fef2f2' : '#fefce8',
                      color: a.statut === 'approved' ? '#16a34a' : a.statut === 'rejected' ? '#dc2626' : '#ca8a04'
                    }}>
                      {a.statut === 'approved' ? 'Publié' : a.statut === 'rejected' ? 'Refusé' : 'En attente'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reservations' && (
            <ReservationsClientTab user={user} />
          )}

          {activeTab === 'profil' && (
            <ProfilClientTab user={user} client={client} setClient={setClient} />
          )}

        </div>
      </div>
    </main>
  )
}

export default function MonCompte() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Sans", sans-serif', color: '#888' }}>Chargement...</div>}>
      <MonCompteInner />
    </Suspense>
  )
}

function ReservationsClientTab({ user }: { user: any }) {
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/reservations?client_id=' + user.id)
      const data = await res.json()
      setReservations(data.reservations || [])
      setLoading(false)
    }
    load()
  }, [])

  const MOIS = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>Mes réservations</div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Chargement...</div>
      ) : reservations.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <IconCalendar size={40} color="#e0e0e0" style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#111', marginBottom: '6px' }}>Aucune réservation</div>
          <div style={{ fontSize: '13px', color: '#888' }}>Vos réservations apparaîtront ici après vos demandes.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {reservations.map((r: any) => {
            const date = new Date(r.date)
            const dateStr = date.getDate() + ' ' + MOIS[date.getMonth()]
            return (
              <div key={r.id} style={{
                background: '#fff', border: '1px solid #e8eaf0',
                borderRadius: '12px', padding: '14px 16px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '3px' }}>{r.reparateur_nom || 'Réparateur'}</div>
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '2px' }}>{r.type_reparation}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{dateStr} · {r.heure}</div>
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '100px', flexShrink: 0,
                    background: r.statut === 'approved' ? '#f0fdf4' : r.statut === 'rejected' ? '#fef2f2' : '#fefce8',
                    color: r.statut === 'approved' ? '#16a34a' : r.statut === 'rejected' ? '#dc2626' : '#ca8a04',
                  }}>
                    {r.statut === 'approved' ? 'Acceptée' : r.statut === 'rejected' ? 'Refusée' : 'En attente'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ProfilClientTab({ user, client, setClient }: { user: any, client: any, setClient: any }) {
  const supabaseLocal = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [form, setForm] = useState({ prenom: client?.prenom || '', nom: client?.nom || '', telephone: client?.telephone || '' })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await supabaseLocal.from('clients').upsert({ id: user.id, ...form })
    setClient({ ...client, ...form })
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    setSaving(false)
  }

  const inputStyle = { width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', color: '#111', background: '#fafafa', outline: 'none', fontFamily: '"DM Sans", sans-serif', boxSizing: 'border-box' as const }
  const labelStyle = { fontSize: '11px', fontWeight: 700 as const, color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '5px', display: 'block' as const }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: '#111' }}>Mon profil</div>

      {success && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconCheck size={18} /> Profil mis à jour !
        </div>
      )}

      <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '1.25rem' }}>Informations personnelles</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div>
            <label style={labelStyle}>Prénom</label>
            <input style={inputStyle} value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} placeholder="Votre prénom" />
          </div>
          <div>
            <label style={labelStyle}>Nom</label>
            <input style={inputStyle} value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Votre nom" />
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Téléphone</label>
          <input style={inputStyle} value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder="06 XX XX XX XX" />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Email</label>
          <div style={{ ...inputStyle, color: '#888', background: '#f5f5f5' }}>{user?.email}</div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{ background: saving ? '#93c5fd' : '#0f2d6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px 24px', fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif' }}
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder →'}
        </button>
      </div>
    </div>
  )
}
