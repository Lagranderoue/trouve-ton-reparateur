'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Chat from '../../../components/Chat'
import Navbar from '../../../components/Navbar'
import {
  IconHome, IconUser, IconPhoto, IconStar, IconStarFilled, IconClock, IconSettings,
  IconLogout, IconPencil, IconPlus, IconMapPin, IconPhone, IconMail,
  IconBuildingStore, IconCalendar, IconCamera, IconEye, IconMessage, IconCheck,
  IconShieldCheck, IconClockHour4, IconX
} from '@tabler/icons-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SERVICES_LIST = [
  'Écran cassé', 'Batterie', 'Connecteur de charge', 'Caméra',
  'Haut-parleur', 'Micro', 'Bouton', 'Vitre arrière',
  'Carte mère', 'Châssis', 'Récupération de données', 'Autre'
]

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

function HorairesTab({ reparateur, setReparateur }: { reparateur: any, setReparateur: any }) {
  const parseHoraires = () => {
    const result: Record<string, { ouvert: boolean, ouverture: string, fermeture: string }> = {}
    JOURS.forEach(j => { result[j] = { ouvert: false, ouverture: '09:00', fermeture: '19:00' } })
    if (reparateur?.horaires) {
      reparateur.horaires.split('|').forEach((h: string) => {
        const parts = h.split(':')
        if (parts.length >= 2) {
          const jour = parts[0].trim()
          const horaire = parts.slice(1).join(':').trim()
          if (jour && result[jour] !== undefined) {
            if (horaire === 'Fermé') {
              result[jour] = { ouvert: false, ouverture: '09:00', fermeture: '19:00' }
            } else {
              const times = horaire.split(' - ')
              result[jour] = { ouvert: true, ouverture: times[0] || '09:00', fermeture: times[1] || '19:00' }
            }
          }
        }
      })
    }
    return result
  }

  const [horaires, setHoraires] = useState(parseHoraires())
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const horaireStr = JOURS.map(j => {
      const h = horaires[j]
      return h.ouvert ? `${j}: ${h.ouverture} - ${h.fermeture}` : `${j}: Fermé`
    }).join('|')

    const { data, error } = await supabase
      .from('reparateurs')
      .update({ horaires: horaireStr })
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>Mes horaires</div>

      {success && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconCheck size={18} /> Horaires mis à jour avec succès !
        </div>
      )}

      <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '1.25rem' }}>Horaires d'ouverture</div>

        {JOURS.map(jour => (
          <div key={jour} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
            <div style={{ width: '90px', fontSize: '13px', fontWeight: 600, color: '#111', flexShrink: 0 }}>{jour}</div>
            <div
              onClick={() => setHoraires({ ...horaires, [jour]: { ...horaires[jour], ouvert: !horaires[jour].ouvert } })}
              style={{ width: '40px', height: '22px', background: horaires[jour].ouvert ? '#22c55e' : '#e0e0e0', borderRadius: '100px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}
            >
              <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: horaires[jour].ouvert ? '20px' : '2px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            </div>
            {horaires[jour].ouvert ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <input
                  type="time"
                  value={horaires[jour].ouverture}
                  onChange={e => setHoraires({ ...horaires, [jour]: { ...horaires[jour], ouverture: e.target.value } })}
                  style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', outline: 'none' }}
                />
                <span style={{ fontSize: '13px', color: '#888' }}>—</span>
                <input
                  type="time"
                  value={horaires[jour].fermeture}
                  onChange={e => setHoraires({ ...horaires, [jour]: { ...horaires[jour], fermeture: e.target.value } })}
                  style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', outline: 'none' }}
                />
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: '#bbb', fontStyle: 'italic' }}>Fermé</div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{ background: saving ? '#93c5fd' : '#0f2d6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif' }}
      >
        {saving ? 'Sauvegarde...' : 'Sauvegarder les horaires →'}
      </button>
    </div>
  )
}

function MessagesReparateurTab({ reparateur }: { reparateur: any }) {
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const [userId, setUserId] = useState<string>('')

  const selectConversation = (r: any) => {
    setSelected(r)
    window.history.replaceState({}, '', '/espace-reparateur/dashboard?tab=messages&conv=' + r.id)
  }

  useEffect(() => {
    const load = async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)

      const res = await fetch('/api/reservations?reparateur_id=' + reparateur.id)
      const data = await res.json()
      const approved = (data.reservations || []).filter((r: any) => r.statut === 'approved')
      setReservations(approved)
      setLoading(false)

      // Restaurer la conversation depuis l'URL
      const params = new URLSearchParams(window.location.search)
      const convId = params.get('conv')
      if (convId) {
        const found = approved.find((r: any) => r.id === convId)
        if (found) setSelected(found)
      }
    }
    load()
  }, [])

  const MOIS = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>Messages</div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Chargement...</div>
      ) : reservations.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '3rem', textAlign: 'center' }}>
          <IconMessage size={40} color="#e0e0e0" style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#111', marginBottom: '6px' }}>Aucun message</div>
          <div style={{ fontSize: '13px', color: '#888' }}>Les conversations apparaîtront ici après vos réservations acceptées.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '280px 1fr' : '1fr', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {reservations.map((r: any) => {
              const date = new Date(r.date)
              const dateStr = date.getDate() + ' ' + MOIS[date.getMonth()]
              return (
                <div
                  key={r.id}
                  onClick={() => selectConversation(r)}
                  style={{
                    background: selected?.id === r.id ? '#eff6ff' : '#fff',
                    border: '1px solid',
                    borderColor: selected?.id === r.id ? '#bfdbfe' : '#e8eaf0',
                    borderRadius: '10px', padding: '12px 14px', cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#111', marginBottom: '2px' }}>{r.client_nom || r.client_email || 'Client'}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>{r.type_reparation} · {dateStr}</div>
                </div>
              )
            })}
          </div>

          {selected && userId && (
            <Chat
              reservationId={selected.id}
              userId={userId}
              senderType="reparateur"
              nomInterlocuteur={selected.client_nom || selected.client_email || 'Client'}
            />
          )}
        </div>
      )}
    </div>
  )
}

function ReservationsTab({ reparateur }: { reparateur: any }) {
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtre, setFiltre] = useState('tous')
  const [modifModal, setModifModal] = useState<any>(null)
  const [newDate, setNewDate] = useState('')
  const [newHeure, setNewHeure] = useState('')
  const [msgRep, setMsgRep] = useState('')
  const [savingModif, setSavingModif] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/reservations?reparateur_id=' + reparateur.id)
      const data = await res.json()
      setReservations(data.reservations || [])
      setLoading(false)
    }
    load()
  }, [])

  const moderer = async (id: string, statut: string, msg?: string) => {
    await fetch('/api/reservations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, statut, message_reparateur: msg || '' })
    })
    setReservations(prev => prev.map(r => r.id === id ? { ...r, statut } : r))
  }

  const modifierRDV = async () => {
    if (!modifModal || !newDate || !newHeure) return
    setSavingModif(true)
    await fetch('/api/reservations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: modifModal.id, date: newDate, heure: newHeure, message_reparateur: msgRep })
    })
    setReservations(prev => prev.map(r => r.id === modifModal.id ? { ...r, date: newDate, heure: newHeure } : r))
    setSavingModif(false)
    setModifModal(null)
  }

  const filtrees = filtre === 'tous' ? reservations : reservations.filter(r => r.statut === filtre)
  const nbAttente = reservations.filter(r => r.statut === 'pending').length
  const MOIS = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc']

  const badgeStyle = (statut: string) => ({
    fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '100px', flexShrink: 0,
    background: statut === 'approved' ? '#f0fdf4' : statut === 'rejected' ? '#fef2f2' : statut === 'cancelled' ? '#f5f5f5' : '#fefce8',
    color: statut === 'approved' ? '#16a34a' : statut === 'rejected' ? '#dc2626' : statut === 'cancelled' ? '#888' : '#ca8a04',
  } as React.CSSProperties)

  const badgeLabel = (statut: string) => statut === 'approved' ? 'Acceptée' : statut === 'rejected' ? 'Refusée' : statut === 'cancelled' ? 'Annulée' : 'En attente'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>Mes réservations</div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'tous', label: 'Toutes' },
          { id: 'pending', label: `En attente${nbAttente > 0 ? ' (' + nbAttente + ')' : ''}` },
          { id: 'approved', label: 'Acceptées' },
          { id: 'rejected', label: 'Refusées' },
        ].map(f => (
          <button key={f.id} onClick={() => setFiltre(f.id)} style={{
            fontSize: '12px', fontWeight: 500, padding: '6px 14px', borderRadius: '100px',
            background: filtre === f.id ? '#0f2d6b' : '#fff',
            color: filtre === f.id ? '#fff' : '#555',
            border: `1px solid ${filtre === f.id ? '#0f2d6b' : '#e0e0e0'}`,
            cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
          }}>{f.label}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Chargement...</div>
      ) : filtrees.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '3rem', textAlign: 'center' }}>
          <IconCalendar size={40} color="#e0e0e0" style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#111', marginBottom: '6px' }}>Aucune réservation</div>
          <div style={{ fontSize: '13px', color: '#888' }}>Les demandes apparaîtront ici.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtrees.map((r: any) => {
            const date = new Date(r.date)
            const dateStr = date.getDate() + ' ' + MOIS[date.getMonth()]
            const initiale = (r.client_email || 'C')[0].toUpperCase()
            return (
              <div key={r.id} style={{
                background: r.statut === 'pending' ? '#fefce8' : '#fff',
                border: `1px solid ${r.statut === 'pending' ? '#fde68a' : '#e8eaf0'}`,
                borderRadius: '12px', padding: '14px 16px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                {/* Header client */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 600, color: '#2563eb', flexShrink: 0 }}>
                      {initiale}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '2px' }}>{r.client_email || 'Client'}</div>
                      {r.client_telephone && <div style={{ fontSize: '12px', color: '#888' }}>{r.client_telephone}</div>}
                    </div>
                  </div>
                  <span style={badgeStyle(r.statut)}>{badgeLabel(r.statut)}</span>
                </div>

                {/* Détails */}
                <div style={{ background: 'rgba(0,0,0,0.03)', borderRadius: '8px', padding: '10px 12px', marginBottom: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#888', marginBottom: '2px' }}>Réparation</div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#111' }}>{r.type_reparation}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#888', marginBottom: '2px' }}>Date</div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#111' }}>{dateStr}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#888', marginBottom: '2px' }}>Heure</div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#111' }}>{r.heure}</div>
                  </div>
                </div>

                {r.note && (
                  <div style={{ fontSize: '12px', color: '#555', background: 'rgba(0,0,0,0.03)', borderRadius: '6px', padding: '7px 10px', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 500, color: '#888', fontSize: '11px' }}>Note : </span>{r.note}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {r.statut === 'pending' && (
                    <>
                      <button onClick={() => moderer(r.id, 'approved')} style={{ flex: 1, background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', minWidth: '100px' }}>
                        <IconCheck size={14} /> Accepter
                      </button>
                      <button onClick={() => moderer(r.id, 'rejected')} style={{ flex: 1, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', padding: '9px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', minWidth: '100px' }}>
                        <IconX size={14} /> Refuser
                      </button>
                    </>
                  )}
                  <button onClick={() => { setModifModal(r); setNewDate(r.date); setNewHeure(r.heure); setMsgRep('') }} style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '9px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconPencil size={14} /> Modifier
                  </button>
                  {r.client_telephone && (
                    <a href={'tel:' + r.client_telephone} style={{ background: '#f4f6fb', color: '#111', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '9px 12px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <IconPhone size={14} /> Appeler
                    </a>
                  )}
                  {r.statut === 'approved' && (
                    <button onClick={() => moderer(r.id, 'cancelled')} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', padding: '9px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <IconX size={14} /> Annuler
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* MODAL MODIFIER */}
      {modifModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '400px' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>Modifier le rendez-vous</div>
              <button onClick={() => setModifModal(null)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#888' }}>×</button>
            </div>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#1e40af' }}>
                Le client recevra un email avec le nouveau créneau proposé.
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>Nouvelle date</div>
                <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', outline: 'none' }} />
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>Nouvel horaire</div>
                <input type="time" value={newHeure} onChange={e => setNewHeure(e.target.value)} style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', outline: 'none' }} />
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>Message au client (optionnel)</div>
                <textarea value={msgRep} onChange={e => setMsgRep(e.target.value)} placeholder="Ex: Je suis disponible plutôt à 11h..." style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', outline: 'none', resize: 'none', minHeight: '70px' }} />
              </div>
              <button onClick={modifierRDV} disabled={savingModif} style={{ background: savingModif ? '#93c5fd' : '#0f2d6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                {savingModif ? 'Envoi...' : 'Proposer ce nouveau créneau →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

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

function AvisTab({ reparateur }: { reparateur: any }) {
  const [avis, setAvis] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtre, setFiltre] = useState<'tous' | 'pending' | 'approved' | 'rejected'>('tous')

  useEffect(() => {
    if (!reparateur?.id) return
    const load = async () => {
      const res = await fetch('/api/avis-reparateur?id=' + reparateur.id)
      const data = await res.json()
      setAvis(data.avis || [])
      setLoading(false)
    }
    load()
  }, [reparateur?.id])

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  const avisFiltres = filtre === 'tous' ? avis : avis.filter(a => a.statut === filtre)

  const modererAvis = async (avisId: string, statut: 'approved' | 'rejected') => {
    await fetch('/api/moderer-avis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avisId, statut }),
    })
    setAvis(prev => prev.map(a => a.id === avisId ? { ...a, statut } : a))
  }

  const statutBadge = (statut: string) => {
    if (statut === 'approved') return { label: 'Approuvé', bg: '#f0fdf4', color: '#166534', icon: <IconCheck size={12} /> }
    if (statut === 'rejected') return { label: 'Rejeté', bg: '#fef2f2', color: '#dc2626', icon: <IconX size={12} /> }
    return { label: 'En attente', bg: '#fefce8', color: '#ca8a04', icon: <IconClockHour4 size={12} /> }
  }

  const filtres: { id: typeof filtre, label: string }[] = [
    { id: 'tous', label: 'Tous' },
    { id: 'pending', label: 'En attente' },
    { id: 'approved', label: 'Approuvés' },
    { id: 'rejected', label: 'Rejetés' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>Mes avis</div>

      <div style={{ display: 'flex', gap: '6px' }}>
        {filtres.map(f => (
          <div
            key={f.id}
            onClick={() => setFiltre(f.id)}
            style={{
              fontSize: '12px', fontWeight: 600, padding: '7px 14px', borderRadius: '100px', cursor: 'pointer',
              background: filtre === f.id ? '#2563eb' : '#fff',
              color: filtre === f.id ? '#fff' : '#555',
              border: `1px solid ${filtre === f.id ? '#2563eb' : '#e8eaf0'}`,
            }}
          >
            {f.label}
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ fontSize: '13px', color: '#888', textAlign: 'center', padding: '2rem 0' }}>Chargement...</div>
      ) : avisFiltres.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <IconStar size={40} color="#e0e0e0" style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#111', marginBottom: '6px' }}>Aucun avis pour le moment</div>
          <div style={{ fontSize: '13px', color: '#888' }}>Les avis laissés par vos clients apparaîtront ici.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {avisFiltres.map(a => {
            const badge = statutBadge(a.statut)
            return (
              <div key={a.id} style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{a.prenom}</span>
                    {a.user_id && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, background: '#eff6ff', color: '#2563eb', borderRadius: '100px', padding: '2px 8px' }}>
                        <IconShieldCheck size={12} /> Client vérifié
                      </span>
                    )}
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, background: badge.bg, color: badge.color, borderRadius: '100px', padding: '3px 10px' }}>
                    {badge.icon} {badge.label}
                  </span>
                </div>
                <div style={{ display: 'flex', color: '#facc15', marginBottom: '8px' }}>
                  {Array.from({ length: a.note || 0 }).map((_, i) => <IconStarFilled key={i} size={14} />)}
                </div>
                <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.5, marginBottom: '8px' }}>{a.commentaire}</p>
                <p style={{ fontSize: '11px', color: '#aaa', marginBottom: a.statut === 'pending' ? '12px' : '0' }}>{formatDate(a.created_at)}</p>
                {a.statut === 'pending' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => modererAvis(a.id, 'approved')}
                      style={{ flex: 1, background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '7px 0', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => modererAvis(a.id, 'rejected')}
                      style={{ flex: 1, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', padding: '7px 0', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}
                    >
                      Rejeter
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
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
      // Stats via API route
      const statsRes = await fetch('/api/stats?id=' + data.id)
      const stats = await statsRes.json()
      setVuesMois(stats.vuesMois || 0)
      setNbAvis(stats.nbAvis || 0)

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
      <style>{`
        @media (max-width: 768px) {
          .sidebar-rep { display: none !important; }
          .main-rep { padding: 1rem !important; padding-bottom: 80px !important; }
        }
        @media (min-width: 769px) {
          .bottomnav-rep { display: none !important; }
        }
      `}</style>
      <style>{"@keyframes spin { to { transform: rotate(360deg) } }"}</style>
    </div>
  )

  const sidebarItems = [
    { id: 'accueil', icon: <IconHome size={18} />, label: 'Mon tableau de bord' },
    { id: 'profil', icon: <IconUser size={18} />, label: 'Mon profil' },
    { id: 'photos', icon: <IconPhoto size={18} />, label: 'Mes photos' },
    { id: 'avis', icon: <IconStar size={18} />, label: 'Mes avis' },
    { id: 'horaires', icon: <IconClock size={18} />, label: 'Mes horaires' },
    { id: 'reservations', icon: <IconCalendar size={18} />, label: 'Réservations' },
    { id: 'messages', icon: <IconMessage size={18} />, label: 'Messages' },
    { id: 'parametres', icon: <IconSettings size={18} />, label: 'Paramètres' },
  ]

  const services = reparateur?.services ? reparateur.services.split(',').map((s: string) => s.trim()).filter(Boolean) : []

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: '"DM Sans", sans-serif' }}>
      <style>{"@keyframes spin { to { transform: rotate(360deg) } }"}</style>
      <style>{`
        @media (max-width: 768px) {
          .sidebar-rep { display: none !important; }
          .main-rep { padding: 1rem !important; padding-bottom: 80px !important; }
        }
        @media (min-width: 769px) {
          .bottomnav-rep { display: none !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <Navbar />

      <div style={{ display: 'flex' }}>

        {/* SIDEBAR */}
        <div className='sidebar-rep' style={{ width: '220px', background: '#ffffff', borderRight: '1px solid #e8eaf0', minHeight: 'calc(100vh - 60px)', padding: '1.25rem 0', flexShrink: 0, position: 'sticky', top: '60px', height: 'calc(100vh - 60px)', overflowY: 'auto' }}>
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
        <div className='main-rep' style={{ flex: 1, padding: '2rem', minWidth: 0 }}>
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
                  <label style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#f0f4ff', border: '2px dashed #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                    {reparateur?.logo_url ? (
                      <img src={reparateur.logo_url} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                    ) : (
                      <IconCamera size={24} color="#93c5fd" />
                    )}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                      if (!e.target.files?.[0]) return
                      const file = e.target.files[0]
                      const cleanName = file.name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9._-]/g, '_')
                      const fileName = 'logos/' + reparateur.id + '-' + cleanName
                      const { error } = await supabase.storage.from('photos').upload(fileName, file, { upsert: true })
                      if (!error) {
                        const { data: urlData } = supabase.storage.from('photos').getPublicUrl(fileName)
                        await supabase.from('reparateurs').update({ logo_url: urlData.publicUrl }).eq('id', reparateur.id)
                        setReparateur({ ...reparateur, logo_url: urlData.publicUrl })
                      }
                    }} />
                  </label>
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
                    <div onClick={async () => { item.set(!item.val); if (item.label === 'Profil visible') { await supabase.from('reparateurs').update({ statut: !item.val ? 'approved' : 'hidden' }).eq('id', reparateur.id) } if (item.label === 'Déplacement à domicile') { await supabase.from('reparateurs').update({ deplacement: !item.val }).eq('id', reparateur.id) } }} style={{ width: '44px', height: '24px', background: item.val ? '#22c55e' : '#e0e0e0', borderRadius: '100px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
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

          {activeTab === 'messages' && (
            <MessagesReparateurTab reparateur={reparateur} />
          )}

          {activeTab === 'reservations' && (
            <ReservationsTab reparateur={reparateur} />
          )}

          {activeTab === 'photos' && (
            <PhotosTab reparateur={reparateur} />
          )}

          {activeTab === 'profil' && (
            <ProfilTab reparateur={reparateur} setReparateur={setReparateur} />
          )}

          {activeTab === 'horaires' && (
            <HorairesTab reparateur={reparateur} setReparateur={setReparateur} />
          )}

          {activeTab === 'avis' && (
            <AvisTab reparateur={reparateur} />
          )}

          {activeTab !== 'accueil' && activeTab !== 'profil' && activeTab !== 'horaires' && activeTab !== 'photos' && activeTab !== 'avis' && (
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
    {/* NAV MOBILE BAS */}
      <div className='bottomnav-rep' style={{ display: 'flex', position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e8eaf0', zIndex: 100, padding: '6px 0 8px' }}>
        {[
          { id: 'accueil', icon: <IconHome size={20} />, label: 'Accueil' },
          { id: 'reservations', icon: <IconCalendar size={20} />, label: 'RDV' },
          { id: 'messages', icon: <IconMessage size={20} />, label: 'Messages' },
          { id: 'avis', icon: <IconStar size={20} />, label: 'Avis' },
          { id: 'profil', icon: <IconUser size={20} />, label: 'Profil' },
        ].map(item => (
          <div key={item.id} onClick={() => changeTab(item.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', padding: '4px 0', color: activeTab === item.id ? '#2563eb' : '#aaa' }}>
            {item.icon}
            <span style={{ fontSize: '9px', fontWeight: activeTab === item.id ? 600 : 500 }}>{item.label}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
