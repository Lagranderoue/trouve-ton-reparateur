'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
const MapReparateurs = dynamic(() => import('./MapReparateurs'), { ssr: false })
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import {
  IconLayoutDashboard, IconTool, IconUsers, IconCalendar, IconStar,
  IconMessage, IconAlertCircle, IconMail, IconSettings, IconFileText,
  IconCheck, IconX, IconEye, IconChevronRight, IconLogout, IconPlus,
  IconPhone, IconPencil, IconTrash, IconBuildingStore, IconClipboardList,
} from '@tabler/icons-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ADMIN_PASSWORD = '1904'

const SIDEBAR_ITEMS = [
  { section: 'Principal', items: [
    { id: 'dashboard', icon: IconLayoutDashboard, label: 'Tableau de bord' },
  ]},
  { section: 'Utilisateurs', items: [
    { id: 'reparateurs', icon: IconTool, label: 'Réparateurs' },
    { id: 'inscriptions', icon: IconClipboardList, label: 'Inscriptions', badge: true },
    { id: 'clients', icon: IconUsers, label: 'Clients' },
  ]},
  { section: 'Activité', items: [
    { id: 'reservations', icon: IconCalendar, label: 'Réservations' },
    { id: 'avis', icon: IconStar, label: 'Avis' },
    { id: 'messages', icon: IconMessage, label: 'Messages' },
  ]},
  { section: 'SAV', items: [
    { id: 'litiges', icon: IconAlertCircle, label: 'Litiges', badge: true },
    { id: 'communications', icon: IconMail, label: 'Communications' },
  ]},
  { section: 'Config', items: [
    { id: 'parametres', icon: IconSettings, label: 'Paramètres' },
    { id: 'logs', icon: IconFileText, label: 'Logs' },
  ]},
]

export default function AdminPage() {
  const router = useRouter()
  const [auth, setAuth] = useState(false)
  const [pwd, setPwd] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({ reparateurs: 0, clients: 0, reservations: 0, inscriptions: 0, avis: 0 })
  const [inscriptionsBadge, setInscriptionsBadge] = useState(0)

  useEffect(() => {
    const ok = sessionStorage.getItem('admin_auth')
    if (ok === 'true') setAuth(true)
  }, [])

  useEffect(() => {
    if (!auth) return
    loadStats()
  }, [auth])

  const loadStats = async () => {
    const [r1, r2, r3, r4, r5] = await Promise.all([
      supabase.from('reparateurs').select('id', { count: 'exact' }).eq('statut', 'approved'),
      supabase.from('clients').select('id', { count: 'exact' }),
      supabase.from('reservations').select('id', { count: 'exact' }),
      supabase.from('reparateurs').select('id', { count: 'exact' }).eq('statut', 'pending'),
      supabase.from('avis').select('id', { count: 'exact' }).eq('statut', 'pending'),
    ])
    setStats({
      reparateurs: r1.count || 0,
      clients: r2.count || 0,
      reservations: r3.count || 0,
      inscriptions: r4.count || 0,
      avis: r5.count || 0,
    })
    setInscriptionsBadge(r4.count || 0)
  }

  const handleLogin = () => {
    if (pwd === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true')
      setAuth(true)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    setAuth(false)
    router.push('/')
  }

  if (!auth) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f2f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Sans", sans-serif' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '2.5rem', width: '320px', border: '1px solid #e8eaf0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#0f2d6b', marginBottom: '4px' }}>TTR Admin</div>
          <div style={{ fontSize: '13px', color: '#888', marginBottom: '1.5rem' }}>Accès restreint</div>
          <input
            type="password"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Mot de passe"
            style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', outline: 'none', marginBottom: '12px' }}
          />
          <button onClick={handleLogin} style={{ width: '100%', background: '#0f2d6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
            Se connecter
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', background: '#f0f2f7' }}>

      {/* SIDEBAR */}
      <div style={{ width: '210px', background: '#0f2d6b', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '8px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>TTR Admin</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Panel d'administration</div>
        </div>
        {SIDEBAR_ITEMS.map(({ section, items }) => (
          <div key={section}>
            <div style={{ padding: '10px 16px 4px', fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{section}</div>
            {items.map(({ id, icon: Icon, label, badge }) => (
              <div key={id} onClick={() => setActiveTab(id)} style={{ padding: '9px 16px', display: 'flex', alignItems: 'center', gap: '9px', fontSize: '12px', fontWeight: 500, color: activeTab === id ? '#fff' : 'rgba(255,255,255,0.6)', background: activeTab === id ? 'rgba(255,255,255,0.12)' : 'transparent', borderLeft: activeTab === id ? '3px solid #60a5fa' : '3px solid transparent', cursor: 'pointer' }}>
                <Icon size={16} />
                <span style={{ flex: 1 }}>{label}</span>
                {badge && id === 'inscriptions' && inscriptionsBadge > 0 && (
                  <span style={{ background: '#dc2626', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '1px 6px', borderRadius: '20px' }}>{inscriptionsBadge}</span>
                )}
              </div>
            ))}
          </div>
        ))}
        <div style={{ marginTop: 'auto', padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
            <IconLogout size={16} /> Déconnexion
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: '24px', minWidth: 0 }}>
        {activeTab === 'dashboard' && <DashboardTab stats={stats} setActiveTab={setActiveTab} />}
        {activeTab === 'reparateurs' && <ReparateursTab />}
        {activeTab === 'inscriptions' && <InscriptionsTab onUpdate={loadStats} />}
        {activeTab === 'clients' && <ClientsTab />}
        {activeTab === 'reservations' && <ReservationsAdminTab />}
        {activeTab === 'avis' && <AvisAdminTab />}
        {activeTab === 'messages' && <MessagesAdminTab />}
        {activeTab === 'litiges' && <LitigesTab />}
        {activeTab === 'communications' && <CommunicationsTab />}
        {activeTab === 'parametres' && <ParametresTab />}
        {activeTab === 'logs' && <LogsTab />}
      </div>
    </div>
  )
}

// ==================== STYLES COMMUNS ====================
const cardStyle = { background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', overflow: 'hidden' as const }
const thStyle = { fontSize: '10px', fontWeight: 600, color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.06em', padding: '8px 14px' }
const tdStyle = { padding: '10px 14px', fontSize: '12px', color: '#111', borderBottom: '1px solid #f8f9fc' }
const badgeStyle = (type: string) => ({
  display: 'inline-flex', alignItems: 'center', fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px',
  background: type === 'approved' ? '#f0fdf4' : type === 'pending' ? '#fefce8' : type === 'rejected' ? '#fef2f2' : '#eff6ff',
  color: type === 'approved' ? '#16a34a' : type === 'pending' ? '#ca8a04' : type === 'rejected' ? '#dc2626' : '#2563eb',
})
const btnStyle = (color: string) => ({
  border: 'none', borderRadius: '7px', padding: '6px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
  fontFamily: '"DM Sans", sans-serif', display: 'inline-flex', alignItems: 'center', gap: '4px',
  background: color === 'green' ? '#16a34a' : color === 'red' ? '#fef2f2' : color === 'blue' ? '#eff6ff' : '#f5f5f5',
  color: color === 'green' ? '#fff' : color === 'red' ? '#dc2626' : color === 'blue' ? '#2563eb' : '#555',
  ...(color === 'red' ? { border: '1px solid #fecaca' } : color === 'blue' ? { border: '1px solid #bfdbfe' } : {}),
} as React.CSSProperties)

// ==================== DASHBOARD ====================
function DashboardTab({ stats, setActiveTab }: { stats: any, setActiveTab: (t: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>Tableau de bord</div>
          <div style={{ fontSize: '13px', color: '#888' }}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
      </div>

      {stats.inscriptions > 0 && (
        <div onClick={() => setActiveTab('inscriptions')} style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <IconAlertCircle size={18} color="#ca8a04" />
          <span style={{ fontSize: '13px', color: '#92400e', fontWeight: 500 }}>{stats.inscriptions} inscription{stats.inscriptions > 1 ? 's' : ''} en attente de validation</span>
          <IconChevronRight size={16} color="#ca8a04" style={{ marginLeft: 'auto' }} />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {[
          { label: 'Réparateurs actifs', value: stats.reparateurs, color: '#eff6ff', iconColor: '#2563eb', Icon: IconTool },
          { label: 'Clients inscrits', value: stats.clients, color: '#f0fdf4', iconColor: '#16a34a', Icon: IconUsers },
          { label: 'Réservations total', value: stats.reservations, color: '#fff7ed', iconColor: '#f59e0b', Icon: IconCalendar },
          { label: 'Avis en attente', value: stats.avis, color: '#fdf4ff', iconColor: '#9333ea', Icon: IconStar },
        ].map(({ label, value, color, iconColor, Icon }, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={20} color={iconColor} />
            </div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#111' }}>{value}</div>
              <div style={{ fontSize: '11px', color: '#888' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>
      {/* CARTE */}
      <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>Réparateurs sur la carte</div>
        </div>
        <div style={{ height: '400px' }}>
          <MapReparateurs />
        </div>
      </div>
    </div>
  )
}

// ==================== INSCRIPTIONS ====================
function InscriptionsTab({ onUpdate }: { onUpdate: () => void }) {
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const { data } = await supabase.from('reparateurs').select('*').eq('statut', 'pending').order('created_at', { ascending: false })
    setList(data || [])
    setLoading(false)
  }

  const moderer = async (id: string, statut: string) => {
    await supabase.from('reparateurs').update({ statut }).eq('id', id)
    if (statut === 'approved') {
      await fetch('/api/notify-approval', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    }
    load()
    onUpdate()
    setSelected(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>Inscriptions en attente</div>
      {loading ? <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Chargement...</div>
      : list.length === 0 ? (
        <div style={{ ...cardStyle, padding: '3rem', textAlign: 'center' }}>
          <IconClipboardList size={40} color="#e0e0e0" style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#111', marginBottom: '6px' }}>Aucune inscription en attente</div>
          <div style={{ fontSize: '13px', color: '#888' }}>Toutes les demandes ont été traitées.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {list.map(r => (
              <div key={r.id} onClick={() => setSelected(r)} style={{ ...cardStyle, padding: '14px 16px', cursor: 'pointer', borderColor: selected?.id === r.id ? '#bfdbfe' : '#e8eaf0', background: selected?.id === r.id ? '#eff6ff' : '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '2px' }}>{r.nom}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{r.email} · {r.ville} {r.code_postal}</div>
                  </div>
                  <span style={badgeStyle('pending')}>En attente</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={e => { e.stopPropagation(); moderer(r.id, 'approved') }} style={btnStyle('green')}><IconCheck size={13} /> Approuver</button>
                  <button onClick={e => { e.stopPropagation(); moderer(r.id, 'rejected') }} style={btnStyle('red')}><IconX size={13} /> Rejeter</button>
                  {r.kbis_url && (
                    <a href={'https://okfaytytljhfpcxpfmtt.supabase.co/storage/v1/object/public/kbis/' + r.kbis_url} target="_blank" style={{ ...btnStyle('blue'), textDecoration: 'none' }}><IconEye size={13} /> Kbis</a>
                  )}
                </div>
              </div>
            ))}
          </div>
          {selected && (
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '14px' }}>Fiche complète</div>
              {[
                { l: 'Nom', v: selected.nom },
                { l: 'Email', v: selected.email },
                { l: 'Téléphone', v: selected.telephone },
                { l: 'Adresse', v: selected.adresse },
                { l: 'Ville', v: selected.ville + ' ' + selected.code_postal },
                { l: 'Services', v: selected.services },
                { l: 'Déplacement', v: selected.deplacement ? 'Oui' : 'Non' },
              ].map(({ l, v }) => v ? (
                <div key={l} style={{ display: 'flex', gap: '10px', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#888', minWidth: '90px', flexShrink: 0 }}>{l}</span>
                  <span style={{ color: '#111', fontWeight: 500 }}>{v}</span>
                </div>
              ) : null)}
              {selected.description && (
                <div style={{ background: '#f4f6fb', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#555', marginTop: '8px' }}>{selected.description}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ==================== RÉPARATEURS ====================
function ReparateursTab() {
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { load() }, [])

  const load = async () => {
    const { data } = await supabase.from('reparateurs').select('*').eq('statut', 'approved').order('nom')
    setList(data || [])
    setLoading(false)
  }

  const suspendre = async (id: string) => {
    await supabase.from('reparateurs').update({ statut: 'rejected' }).eq('id', id)
    load()
  }

  const filtered = list.filter(r => r.nom?.toLowerCase().includes(search.toLowerCase()) || r.ville?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>Réparateurs actifs</div>
        <div style={{ fontSize: '13px', color: '#888' }}>{filtered.length} réparateur{filtered.length > 1 ? 's' : ''}</div>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par nom ou ville..." style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', outline: 'none', background: '#fff' }} />
      {loading ? <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Chargement...</div> : (
        <div style={{ ...cardStyle }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 120px', borderBottom: '1px solid #f0f0f0' }}>
            {['Nom', 'Ville', 'Note', 'Statut', 'Actions'].map(h => <div key={h} style={thStyle}>{h}</div>)}
          </div>
          {filtered.map(r => (
            <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 120px', alignItems: 'center', borderBottom: '1px solid #f8f9fc' }}>
              <div style={tdStyle}>
                <div style={{ fontWeight: 600 }}>{r.nom}</div>
                <div style={{ fontSize: '11px', color: '#888' }}>{r.email}</div>
              </div>
              <div style={tdStyle}>{r.ville} {r.code_postal}</div>
              <div style={tdStyle}>{r.note ? '★ ' + r.note : '—'}</div>
              <div style={tdStyle}><span style={badgeStyle(r.statut)}>{r.statut === 'approved' ? 'Actif' : r.statut}</span></div>
              <div style={{ ...tdStyle, display: 'flex', gap: '5px' }}>
                <a href={'/reparateur/' + r.id} target="_blank" style={{ ...btnStyle('blue'), textDecoration: 'none' }}><IconEye size={12} /></a>
                <button onClick={() => suspendre(r.id)} style={btnStyle('red')}><IconX size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== CLIENTS ====================
function ClientsTab() {
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { load() }, [])

  const load = async () => {
    const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
    setList(data || [])
    setLoading(false)
  }

  const filtered = list.filter(c => (c.prenom + ' ' + c.nom)?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>Clients inscrits</div>
        <div style={{ fontSize: '13px', color: '#888' }}>{filtered.length} client{filtered.length > 1 ? 's' : ''}</div>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un client..." style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', outline: 'none', background: '#fff' }} />
      {loading ? <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Chargement...</div> : (
        <div style={cardStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', borderBottom: '1px solid #f0f0f0' }}>
            {['Nom', 'Téléphone', 'Inscription'].map(h => <div key={h} style={thStyle}>{h}</div>)}
          </div>
          {filtered.map(c => (
            <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', alignItems: 'center', borderBottom: '1px solid #f8f9fc' }}>
              <div style={tdStyle}>
                <div style={{ fontWeight: 600 }}>{c.prenom} {c.nom}</div>
              </div>
              <div style={tdStyle}>{c.telephone || '—'}</div>
              <div style={tdStyle}>{new Date(c.created_at).toLocaleDateString('fr-FR')}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== RÉSERVATIONS ====================
function ReservationsAdminTab() {
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtre, setFiltre] = useState('tous')

  useEffect(() => { load() }, [])

  const load = async () => {
    const res = await fetch('/api/reservations?admin=1')
    const data = await res.json()
    setList(data.reservations || [])
    setLoading(false)
  }

  const filtered = filtre === 'tous' ? list : list.filter(r => r.statut === filtre)
  const MOIS = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>Toutes les réservations</div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['tous', 'pending', 'approved', 'rejected', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFiltre(f)} style={{ fontSize: '12px', fontWeight: 500, padding: '6px 14px', borderRadius: '100px', background: filtre === f ? '#0f2d6b' : '#fff', color: filtre === f ? '#fff' : '#555', border: '1px solid', borderColor: filtre === f ? '#0f2d6b' : '#e0e0e0', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
            {f === 'tous' ? 'Toutes' : f === 'pending' ? 'En attente' : f === 'approved' ? 'Acceptées' : f === 'rejected' ? 'Refusées' : 'Annulées'}
          </button>
        ))}
      </div>
      {loading ? <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Chargement...</div> : (
        <div style={cardStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr', borderBottom: '1px solid #f0f0f0' }}>
            {['Client', 'Réparateur', 'Réparation', 'Date', 'Statut'].map(h => <div key={h} style={thStyle}>{h}</div>)}
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#888', fontSize: '13px' }}>Aucune réservation</div>
          ) : filtered.map(r => {
            const date = new Date(r.date)
            return (
              <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr', alignItems: 'center', borderBottom: '1px solid #f8f9fc' }}>
                <div style={tdStyle}><div style={{ fontWeight: 600 }}>{r.client_nom || r.client_email}</div></div>
                <div style={tdStyle}>{r.reparateur_nom || '—'}</div>
                <div style={tdStyle}>{r.type_reparation}</div>
                <div style={tdStyle}>{date.getDate()} {MOIS[date.getMonth()]}</div>
                <div style={tdStyle}><span style={badgeStyle(r.statut)}>{r.statut === 'approved' ? 'Acceptée' : r.statut === 'pending' ? 'En attente' : r.statut === 'rejected' ? 'Refusée' : 'Annulée'}</span></div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ==================== AVIS ====================
function AvisAdminTab() {
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    const { data } = await supabase.from('avis').select('*, reparateurs(nom)').order('created_at', { ascending: false })
    setList(data || [])
    setLoading(false)
  }

  const moderer = async (id: string, statut: string) => {
    await fetch('/api/moderer-avis', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, statut }) })
    load()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>Modération des avis</div>
      {loading ? <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Chargement...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {list.map(a => (
            <div key={a.id} style={{ ...cardStyle, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{a.prenom} → {a.reparateurs?.nom || '—'}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>{'★'.repeat(a.note)} · {new Date(a.created_at).toLocaleDateString('fr-FR')}</div>
                </div>
                <span style={badgeStyle(a.statut)}>{a.statut}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '10px' }}>{a.commentaire}</div>
              {a.statut === 'pending' && (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => moderer(a.id, 'approved')} style={btnStyle('green')}><IconCheck size={13} /> Approuver</button>
                  <button onClick={() => moderer(a.id, 'rejected')} style={btnStyle('red')}><IconX size={13} /> Rejeter</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== MESSAGES ====================
function MessagesAdminTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>Messages</div>
      <div style={{ ...cardStyle, padding: '3rem', textAlign: 'center' }}>
        <IconMessage size={40} color="#e0e0e0" style={{ marginBottom: '12px' }} />
        <div style={{ fontSize: '15px', fontWeight: 600, color: '#111', marginBottom: '6px' }}>Consultation des messages</div>
        <div style={{ fontSize: '13px', color: '#888' }}>Disponible uniquement en cas de litige signalé.</div>
      </div>
    </div>
  )
}

// ==================== LITIGES ====================
function LitigesTab() {
  const [litiges, setLitiges] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [newTitre, setNewTitre] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    const { data } = await supabase
      .from('litiges')
      .select('*, reparateurs(nom), clients(prenom, nom)')
      .order('created_at', { ascending: false })
    setLitiges(data || [])
    setLoading(false)
  }

  const resoudre = async (id: string) => {
    await supabase.from('litiges').update({ statut: 'resolu', resolved_at: new Date().toISOString() }).eq('id', id)
    load()
    setSelected(null)
  }

  const creerLitige = async () => {
    if (!newTitre) return
    await supabase.from('litiges').insert({ titre: newTitre, description: newDesc, statut: 'ouvert' })
    setNewTitre('')
    setNewDesc('')
    setShowForm(false)
    load()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>Litiges & SAV</div>
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {litiges.map(l => (
            <div key={l.id} onClick={() => setSelected(l)} style={{ ...cardStyle, padding: '14px 16px', cursor: 'pointer', background: l.statut === 'ouvert' ? '#fef2f2' : '#fff', borderColor: selected?.id === l.id ? '#bfdbfe' : l.statut === 'ouvert' ? '#fecaca' : '#e8eaf0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{l.titre}</div>
                <span style={{ ...badgeStyle(l.statut === 'ouvert' ? 'pending' : 'approved') }}>{l.statut}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>{l.client} vs {l.reparateur}</div>
            </div>
          ))}
        </div>
        {selected && (
          <div style={{ ...cardStyle, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>{selected.titre}</div>
            <div style={{ fontSize: '13px', color: '#555', lineHeight: 1.6 }}>{selected.description}</div>
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Répondre</div>
              <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Message au client ou réparateur..." style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', outline: 'none', resize: 'none', minHeight: '80px', marginBottom: '8px' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ ...btnStyle('blue'), flex: 1, justifyContent: 'center' }}><IconMail size={13} /> Envoyer au client</button>
                <button style={{ ...btnStyle('green'), flex: 1, justifyContent: 'center' }}><IconCheck size={13} /> Marquer résolu</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== COMMUNICATIONS ====================
function CommunicationsTab() {
  const [destinataires, setDestinataires] = useState('reparateurs')
  const [sujet, setSujet] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const inputStyle = { width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', outline: 'none', background: '#fafafa' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>Communications</div>
      <div style={{ ...cardStyle, padding: '20px', maxWidth: '600px' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '16px' }}>Envoyer un email groupé</div>
        {sent ? (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '1.5rem', textAlign: 'center' }}>
            <IconCheck size={32} color="#16a34a" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#111' }}>Email envoyé !</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Destinataires</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['reparateurs', 'clients', 'tous'].map(d => (
                  <button key={d} onClick={() => setDestinataires(d)} style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '100px', background: destinataires === d ? '#0f2d6b' : '#f4f6fb', color: destinataires === d ? '#fff' : '#555', border: '1px solid', borderColor: destinataires === d ? '#0f2d6b' : '#e0e0e0', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 500 }}>
                    {d === 'reparateurs' ? 'Réparateurs' : d === 'clients' ? 'Clients' : 'Tous'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Sujet</div>
              <input value={sujet} onChange={e => setSujet(e.target.value)} placeholder="Objet de l'email..." style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Message</div>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Votre message..." style={{ ...inputStyle, minHeight: '120px', resize: 'none' }} />
            </div>
            <button onClick={() => setSent(true)} disabled={!sujet || !message} style={{ background: !sujet || !message ? '#e0e0e0' : '#0f2d6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: !sujet || !message ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
              Envoyer à tous les {destinataires === 'tous' ? 'utilisateurs' : destinataires}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== PARAMÈTRES ====================
function ParametresTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>Paramètres</div>
      <div style={{ ...cardStyle, padding: '20px', maxWidth: '500px' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '16px' }}>Informations légales</div>
        {[
          { l: 'Nom légal', v: 'La Grande Roue' },
          { l: 'SIREN', v: '894 015 882' },
          { l: 'Adresse', v: '24 avenue Mathias Duval, 06130 Grasse' },
          { l: 'Email', v: 'lagranderouecontact@gmail.com' },
        ].map(({ l, v }) => (
          <div key={l} style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '13px', alignItems: 'center' }}>
            <span style={{ color: '#888', minWidth: '100px', flexShrink: 0 }}>{l}</span>
            <span style={{ color: '#111', fontWeight: 500, flex: 1 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== LOGS ====================
function LogsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>Logs d'activité</div>
      <div style={{ ...cardStyle }}>
        {[
          { action: 'Inscription approuvée', detail: 'Phone Expert Nice', time: 'il y a 2h', color: '#16a34a' },
          { action: 'Avis approuvé', detail: 'Avis de Marie D.', time: 'il y a 3h', color: '#2563eb' },
          { action: 'Réparateur suspendu', detail: 'iRepair Fake', time: 'hier', color: '#dc2626' },
          { action: 'Email groupé envoyé', detail: '12 réparateurs', time: 'il y a 3j', color: '#f59e0b' },
        ].map((log, i) => (
          <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid #f8f9fc', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: log.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{log.action}</span>
              <span style={{ fontSize: '13px', color: '#888' }}> — {log.detail}</span>
            </div>
            <span style={{ fontSize: '11px', color: '#bbb' }}>{log.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
