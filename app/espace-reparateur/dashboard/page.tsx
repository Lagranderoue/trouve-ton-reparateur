'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import {
  IconHome, IconUser, IconPhoto, IconStar, IconClock, IconSettings,
  IconLogout, IconPencil, IconPlus, IconMapPin, IconPhone, IconMail,
  IconBuildingStore, IconCamera, IconEye, IconMessage, IconCheck
} from '@tabler/icons-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SERVICES_LIST = [
  'Écran cassé', 'Batterie', 'Connecteur de charge', 'Caméra',
  'Haut-parleur', 'Micro', 'Bouton', 'Vitre arrière',
  'Carte mère', 'Châssis', 'Récupération de données', 'Autre'
]

function PhotosTab({ reparateur }: { reparateur: any }) {
  const [photos, setPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadPhotos()
  }, [])

  const loadPhotos = async () => {
    const { data, error } = await supabase.storage.from('photos').list(String(reparateur.id))
    if (data && !error) {
      const urls = data
        .filter(f => f.name !== '.emptyFolderPlaceholder')
        .map(f =>
          supabase.storage.from('photos').getPublicUrl(String(reparateur.id) + '/' + f.name).data.publicUrl
        )
      setPhotos(urls)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setUploading(true)
    const file = e.target.files[0]
    const cleanName = file.name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9._-]/g, '_')
    const fileName = String(reparateur.id) + '/' + Date.now() + '-' + cleanName
    const { error, data } = await supabase.storage.from('photos').upload(fileName, file, { upsert: true })
    console.log('upload result:', { error, data })
    if (!error) await loadPhotos()
    else console.error('upload error:', error)
    setUploading(false)
  }

  const handleDelete = async (url: string) => {
    const path = url.split('/photos/')[1]
    await supabase.storage.from('photos').remove([path])
    await loadPhotos()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>Mes photos</div>

      <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>Photos de ma boutique</div>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>Ces photos apparaîtront sur votre fiche publique</div>
          </div>
          <label style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', fontWeight: 600, color: '#2563eb',
            background: '#eff6ff', border: '1px solid #bfdbfe',
            borderRadius: '8px', padding: '8px 16px', cursor: 'pointer',
            fontFamily: '"DM Sans", sans-serif',
          }}>
            <IconPlus size={15} />
            {uploading ? 'Upload...' : 'Ajouter une photo'}
            <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
          </label>
        </div>

        {photos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <IconPhoto size={48} color="#e0e0e0" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#111', marginBottom: '6px' }}>Aucune photo pour le moment</div>
            <div style={{ fontSize: '13px', color: '#888' }}>Ajoutez des photos de votre boutique pour attirer plus de clients</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {photos.map((url, i) => (
              <div key={i} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', aspectRatio: '1' }}>
                <img src={url} alt="photo boutique" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  onClick={() => handleDelete(url)}
                  style={{
                    position: 'absolute', top: '8px', right: '8px',
                    background: 'rgba(0,0,0,0.6)', color: '#fff',
                    border: 'none', borderRadius: '6px', padding: '4px 8px',
                    fontSize: '12px', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
            <label style={{
              aspectRatio: '1', borderRadius: '10px', background: '#f8f9fc',
              border: '2px dashed #e0e0e0', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '8px',
            }}>
              <IconPlus size={28} color="#ccc" />
              <span style={{ fontSize: '12px', color: '#bbb' }}>Ajouter</span>
              <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
            </label>
          </div>
        )}
      </div>
    </div>
  )
}

function ProfilTab({ reparateur, setReparateur }: { reparateur: any, setReparateur: any }) {
  const [form, setForm] = useState({
    nom: reparateur?.nom || '',
    telephone: reparateur?.telephone || '',
    adresse: reparateur?.adresse || '',
    description: reparateur?.description || '',
    services: reparateur?.services || '',
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const selectedServices = form.services ? form.services.split(',').map((s: string) => s.trim()).filter(Boolean) : []

  const toggleService = (service: string) => {
    const current = selectedServices
    const updated = current.includes(service)
      ? current.filter((s: string) => s !== service)
      : [...current, service]
    setForm({ ...form, services: updated.join(', ') })
  }

  const handleSave = async () => {
    setSaving(true)
    const { data, error } = await supabase
      .from('reparateurs')
      .update({
        nom: form.nom,
        telephone: form.telephone,
        adresse: form.adresse,
        description: form.description,
        services: form.services,
      })
      .eq('id', reparateur.id)
      .select()
      .single()

    if (!error && data) {
      setReparateur(data)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setSaving(false)
  }

  const inputStyle = {
    width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px',
    padding: '10px 12px', fontSize: '14px', color: '#111',
    background: '#fafafa', outline: 'none', fontFamily: '"DM Sans", sans-serif',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    fontSize: '11px', fontWeight: 700 as const, color: '#888',
    textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '5px', display: 'block' as const,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>Mon profil</div>

      {success && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconCheck size={18} /> Profil mis à jour avec succès !
        </div>
      )}

      {/* INFOS GÉNÉRALES */}
      <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '1.25rem' }}>Informations générales</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Nom de la boutique</label>
            <input style={inputStyle} value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Nom de votre boutique" />
          </div>
          <div>
            <label style={labelStyle}>Téléphone</label>
            <input style={inputStyle} value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder="06 XX XX XX XX" />
          </div>
          <div>
            <label style={labelStyle}>Adresse</label>
            <input style={inputStyle} value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} placeholder="Votre adresse complète" />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Décrivez votre boutique, vos spécialités..."
            />
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '1.25rem' }}>Mes services</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {SERVICES_LIST.map(service => {
            const selected = selectedServices.includes(service)
            return (
              <div
                key={service}
                onClick={() => toggleService(service)}
                style={{
                  fontSize: '13px', fontWeight: 500, padding: '7px 14px',
                  borderRadius: '100px', cursor: 'pointer', transition: 'all 0.15s',
                  background: selected ? '#2563eb' : '#f5f5f5',
                  color: selected ? '#fff' : '#555',
                  border: `1px solid ${selected ? '#2563eb' : '#e0e0e0'}`,
                }}
              >
                {service}
              </div>
            )
          })}
        </div>
      </div>

      {/* BOUTON SAUVEGARDER */}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          background: saving ? '#93c5fd' : '#0f2d6b',
          color: '#fff', border: 'none', borderRadius: '10px',
          padding: '14px', fontSize: '15px', fontWeight: 600,
          cursor: saving ? 'not-allowed' : 'pointer',
          fontFamily: '"DM Sans", sans-serif',
          transition: 'background 0.15s',
        }}
      >
        {saving ? 'Sauvegarde en cours...' : 'Sauvegarder les modifications →'}
      </button>
    </div>
  )
}

export default function Dashboard() {
  const [reparateur, setReparateur] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('accueil')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab')
    if (tab) setActiveTab(tab)
  }, [])

  const changeTab = (tab: string) => {
    setActiveTab(tab)
    window.history.pushState({}, '', '/espace-reparateur/dashboard?tab=' + tab)
  }
  const [deplacement, setDeplacement] = useState(false)
  const [visible, setVisible] = useState(true)
  const [vuesMois, setVuesMois] = useState(0)
  const [nbAvis, setNbAvis] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/espace-reparateur'); return }
      const { data } = await supabase.from('reparateurs').select('*').eq('email', user.email).single()
      if (data) {
        setReparateur(data)
        setDeplacement(data.deplacement || false)
        setVisible(data.statut === 'approved')
      }
      console.log('rep id:', data.id)
      // Vues ce mois
      const debutMois = new Date()
      debutMois.setDate(1)
      debutMois.setHours(0,0,0,0)
      const { count: countVues } = await supabase
        .from('vues')
        .select('*', { count: 'exact', head: true })
        .eq('reparateur_id', data.id)
        .gte('created_at', debutMois.toISOString())
      setVuesMois(countVues || 0)

      // Nombre d'avis
      const { count: countAvis } = await supabase
        .from('avis')
        .select('*', { count: 'exact', head: true })
        .eq('reparateur_id', data.id)
        .eq('statut', 'approved')
      setNbAvis(countAvis || 0)

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
        <div style={{ width: '36px', height: '36px', border: '3px solid #e0e0e0', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <div style={{ fontSize: '14px', color: '#888' }}>Chargement...</div>
      </div>
      <style>{"@keyframes spin { to { transform: rotate(360deg) } }"}</style>
    </div>
  )

  const sidebarItems = [
    { id: 'accueil', icon: <IconHome size={18} />, label: 'Mon tableau de bord' },
    { id: 'profil', icon: <IconUser size={18} />, label: 'Mon profil' },
    { id: 'photos', icon: <IconPhoto size={18} />, label: 'Mes photos' },
    { id: 'avis', icon: <IconStar size={18} />, label: 'Mes avis' },
    { id: 'horaires', icon: <IconClock size={18} />, label: 'Mes horaires' },
    { id: 'parametres', icon: <IconSettings size={18} />, label: 'Paramètres' },
  ]

  const services = reparateur?.services ? reparateur.services.split(',').map((s: string) => s.trim()).filter(Boolean) : []

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: '"DM Sans", sans-serif' }}>
      <style>{"@keyframes spin { to { transform: rotate(360deg) } }"}</style>

      {/* NAVBAR */}
      <nav style={{ background: '#ffffff', boxShadow: '0 1px 0 #e8eaf0, 0 2px 8px rgba(0,0,0,0.04)', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => router.push('/')} style={{ fontSize: '15px', fontWeight: 700, color: '#0f2d6b', cursor: 'pointer' }}>
          Trouve ton réparateur
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #0f2d6b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff' }}>
            {reparateur?.nom?.[0] || 'R'}
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>{reparateur?.nom}</span>
          <button onClick={handleLogout} style={{ fontSize: '12px', color: '#888', background: '#f5f5f5', border: '1px solid #e8e8e8', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
            Déconnexion
          </button>
        </div>
      </nav>

      <div style={{ display: 'flex' }}>

        {/* SIDEBAR */}
        <div style={{ width: '220px', background: '#ffffff', borderRight: '1px solid #e8eaf0', minHeight: 'calc(100vh - 60px)', padding: '1.25rem 0', flexShrink: 0, position: 'sticky', top: '60px', height: 'calc(100vh - 60px)', overflowY: 'auto' }}>
          <div style={{ padding: '0 1rem 0.75rem', fontSize: '10px', fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Menu</div>
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

        {/* MAIN */}
        <div style={{ flex: 1, padding: '2rem', minWidth: 0 }}>
          {activeTab === 'accueil' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              <div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>Bonjour, {reparateur?.nom} 👋</div>
                <div style={{ fontSize: '14px', color: '#888', marginTop: '3px' }}>Voici un aperçu de votre activité sur la plateforme</div>
              </div>

              {/* STATS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                  { icon: <IconEye size={20} color="#2563eb" />, n: vuesMois.toString(), l: 'Vues ce mois', bg: '#eff6ff', link: '/espace-reparateur/stats' },
                  { icon: <IconStar size={20} color="#16a34a" />, n: reparateur?.note ? reparateur.note.toFixed(1) : 'N/A', l: 'Note moyenne', bg: '#f0fdf4', link: null },
                  { icon: <IconMessage size={20} color="#ca8a04" />, n: nbAvis.toString(), l: 'Avis reçus', bg: '#fefce8', link: null },
                ].map((s, i) => (
                  <div key={i} onClick={() => s.link && router.push(s.link)} style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', cursor: s.link ? 'pointer' : 'default' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>{s.icon}</div>
                    <div style={{ fontSize: '26px', fontWeight: 700, color: '#111', letterSpacing: '-0.03em' }}>{s.n}</div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>{s.l}</div>
                    {s.link && <div style={{ fontSize: '11px', color: '#2563eb', marginTop: '4px', fontWeight: 500 }}>Voir les stats →</div>}
                  </div>
                ))}
              </div>

              {/* MON PROFIL */}
              <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>Mon profil</div>
                  <button onClick={() => changeTab('profil')} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                    <IconPencil size={13} /> Modifier
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.25rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#f0f4ff', border: '2px dashed #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <IconCamera size={24} color="#93c5fd" />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#111' }}>{reparateur?.nom}</div>
                    <div style={{ fontSize: '13px', color: '#888', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <IconMapPin size={13} /> {reparateur?.ville}, {reparateur?.code_postal}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Téléphone</div>
                    <div style={{ fontSize: '13px', color: '#111', background: '#f8f9fc', border: '1px solid #e8eaf0', borderRadius: '7px', padding: '8px 12px' }}>{reparateur?.telephone || '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Email</div>
                    <div style={{ fontSize: '13px', color: '#111', background: '#f8f9fc', border: '1px solid #e8eaf0', borderRadius: '7px', padding: '8px 12px' }}>{reparateur?.email || '—'}</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Description</div>
                  <div style={{ fontSize: '13px', color: '#666', background: '#f8f9fc', border: '1px solid #e8eaf0', borderRadius: '7px', padding: '8px 12px', lineHeight: 1.5 }}>{reparateur?.description || 'Aucune description'}</div>
                </div>
              </div>

              {/* STATUT */}
              <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '1rem' }}>Statut de la boutique</div>
                {[
                  { label: 'Profil visible', desc: 'Votre fiche est visible dans les recherches', val: visible, set: setVisible },
                  { label: 'Déplacement à domicile', desc: 'Vous déplacez-vous chez vos clients ?', val: deplacement, set: setDeplacement },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i === 0 ? '1px solid #f5f5f5' : 'none' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>{item.label}</div>
                      <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{item.desc}</div>
                    </div>
                    <div onClick={() => item.set(!item.val)} style={{ width: '44px', height: '24px', background: item.val ? '#22c55e' : '#e0e0e0', borderRadius: '100px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
                      <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: item.val ? '22px' : '2px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* SERVICES */}
              <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>Mes services</div>
                  <button onClick={() => changeTab('profil')} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                    <IconPencil size={13} /> Modifier
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {services.length > 0 ? services.map((s: string, i: number) => (
                    <span key={i} style={{ fontSize: '12px', fontWeight: 500, padding: '5px 12px', borderRadius: '100px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>{s}</span>
                  )) : <span style={{ fontSize: '13px', color: '#888' }}>Aucun service renseigné</span>}
                </div>
              </div>

              {/* PHOTOS */}
              <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>Mes photos</div>
                  <button onClick={() => changeTab('photos')} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                    <IconPlus size={13} /> Ajouter
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ aspectRatio: '1', borderRadius: '10px', background: '#f8f9fc', border: '2px dashed #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <IconPlus size={24} color="#ccc" />
                    </div>
                  ))}
                </div>
              </div>

              {/* AVIS */}
              <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '1rem' }}>Derniers avis reçus</div>
                <div style={{ fontSize: '13px', color: '#888', textAlign: 'center', padding: '1.5rem 0' }}>Aucun avis pour le moment</div>
              </div>

            </div>
          )}

          {activeTab === 'photos' && (
            <PhotosTab reparateur={reparateur} />
          )}

          {activeTab === 'profil' && (
            <ProfilTab reparateur={reparateur} setReparateur={setReparateur} />
          )}

          {activeTab !== 'accueil' && activeTab !== 'profil' && (
            <div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '1.5rem' }}>
                {sidebarItems.find(i => i.id === activeTab)?.label}
              </div>
              <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <IconSettings size={40} color="#e0e0e0" style={{ marginBottom: '12px' }} />
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
