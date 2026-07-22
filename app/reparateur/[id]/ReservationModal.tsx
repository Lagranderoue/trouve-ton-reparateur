'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const MODELES: Record<string, { groupe?: string, modeles: string[] }[]> = {
  'Apple': [
    { groupe: 'iPhone 15', modeles: ['iPhone 15', 'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15 Pro Max'] },
    { groupe: 'iPhone 14', modeles: ['iPhone 14', 'iPhone 14 Plus', 'iPhone 14 Pro', 'iPhone 14 Pro Max'] },
    { groupe: 'iPhone 13', modeles: ['iPhone 13', 'iPhone 13 Mini', 'iPhone 13 Pro', 'iPhone 13 Pro Max'] },
    { groupe: 'iPhone 12', modeles: ['iPhone 12', 'iPhone 12 Mini', 'iPhone 12 Pro', 'iPhone 12 Pro Max'] },
    { groupe: 'iPhone 11', modeles: ['iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max'] },
    { groupe: 'iPhone X/XS/XR', modeles: ['iPhone X', 'iPhone XS', 'iPhone XS Max', 'iPhone XR'] },
    { groupe: 'iPhone Anciens', modeles: ['iPhone SE (2022)', 'iPhone SE (2020)', 'iPhone SE (2016)', 'iPhone 8', 'iPhone 8 Plus', 'iPhone 7', 'iPhone 7 Plus', 'iPhone 6S', 'iPhone 6S Plus', 'iPhone 6', 'iPhone 6 Plus'] },
  ],
  'Samsung': [
    { groupe: 'Galaxy S24', modeles: ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24'] },
    { groupe: 'Galaxy S23', modeles: ['Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23', 'Galaxy S23 FE'] },
    { groupe: 'Galaxy S22', modeles: ['Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22'] },
    { groupe: 'Galaxy S21', modeles: ['Galaxy S21 Ultra', 'Galaxy S21+', 'Galaxy S21', 'Galaxy S21 FE'] },
    { groupe: 'Galaxy S20', modeles: ['Galaxy S20 Ultra', 'Galaxy S20+', 'Galaxy S20', 'Galaxy S20 FE'] },
    { groupe: 'Galaxy S10/S9/S8', modeles: ['Galaxy S10+', 'Galaxy S10', 'Galaxy S10e', 'Galaxy S9+', 'Galaxy S9', 'Galaxy S8+', 'Galaxy S8'] },
    { groupe: 'Galaxy A', modeles: ['Galaxy A55', 'Galaxy A35', 'Galaxy A25', 'Galaxy A15', 'Galaxy A54', 'Galaxy A34', 'Galaxy A14', 'Galaxy A53', 'Galaxy A33', 'Galaxy A13', 'Galaxy A52', 'Galaxy A32', 'Galaxy A12', 'Galaxy A51', 'Galaxy A31', 'Galaxy A21s', 'Galaxy A71', 'Galaxy A41'] },
    { groupe: 'Galaxy Note', modeles: ['Galaxy Note 20 Ultra', 'Galaxy Note 20', 'Galaxy Note 10+', 'Galaxy Note 10', 'Galaxy Note 9', 'Galaxy Note 8'] },
    { groupe: 'Galaxy Z', modeles: ['Galaxy Z Fold 5', 'Galaxy Z Flip 5', 'Galaxy Z Fold 4', 'Galaxy Z Flip 4', 'Galaxy Z Fold 3', 'Galaxy Z Flip 3'] },
  ],
  'Xiaomi': [
    { groupe: 'Xiaomi 14', modeles: ['Xiaomi 14 Ultra', 'Xiaomi 14 Pro', 'Xiaomi 14'] },
    { groupe: 'Xiaomi 13', modeles: ['Xiaomi 13 Ultra', 'Xiaomi 13 Pro', 'Xiaomi 13'] },
    { groupe: 'Xiaomi 12', modeles: ['Xiaomi 12 Pro', 'Xiaomi 12', 'Xiaomi 12X'] },
    { groupe: 'Redmi Note', modeles: ['Redmi Note 13 Pro+', 'Redmi Note 13 Pro', 'Redmi Note 13', 'Redmi Note 12 Pro+', 'Redmi Note 12 Pro', 'Redmi Note 12', 'Redmi Note 11 Pro', 'Redmi Note 11', 'Redmi Note 10 Pro', 'Redmi Note 10', 'Redmi Note 9 Pro', 'Redmi Note 9', 'Redmi Note 8 Pro', 'Redmi Note 8'] },
    { groupe: 'Redmi', modeles: ['Redmi 13C', 'Redmi 12', 'Redmi 10', 'Redmi 9', 'Redmi 9A', 'Redmi 8', 'Redmi 7'] },
    { groupe: 'POCO', modeles: ['POCO X6 Pro', 'POCO X6', 'POCO F5 Pro', 'POCO F5', 'POCO X5 Pro', 'POCO X5', 'POCO M5', 'POCO M4 Pro'] },
  ],
  'Huawei': [
    { groupe: 'P Series', modeles: ['P60 Pro', 'P50 Pro', 'P50', 'P40 Pro+', 'P40 Pro', 'P40', 'P30 Pro', 'P30', 'P20 Pro', 'P20', 'P10 Plus', 'P10', 'P9 Plus', 'P9'] },
    { groupe: 'Mate Series', modeles: ['Mate 60 Pro', 'Mate 50 Pro', 'Mate 50', 'Mate 40 Pro', 'Mate 40', 'Mate 30 Pro', 'Mate 30', 'Mate 20 Pro', 'Mate 20', 'Mate 10 Pro', 'Mate 10', 'Mate 9'] },
    { groupe: 'Nova', modeles: ['Nova 12', 'Nova 11', 'Nova 10', 'Nova 9', 'Nova 8', 'Nova 7', 'Nova 5T', 'Nova 3'] },
    { groupe: 'Y Series', modeles: ['Y90', 'Y70', 'Y61', 'Y6p', 'Y5p'] },
  ],
  'OnePlus': [
    { groupe: 'OnePlus 12', modeles: ['OnePlus 12', 'OnePlus 12R'] },
    { groupe: 'OnePlus 11', modeles: ['OnePlus 11', 'OnePlus 11R'] },
    { groupe: 'OnePlus 10', modeles: ['OnePlus 10 Pro', 'OnePlus 10T', 'OnePlus 10R'] },
    { groupe: 'OnePlus 9', modeles: ['OnePlus 9 Pro', 'OnePlus 9', 'OnePlus 9R', 'OnePlus 9RT'] },
    { groupe: 'OnePlus 8', modeles: ['OnePlus 8 Pro', 'OnePlus 8T', 'OnePlus 8'] },
    { groupe: 'OnePlus 7', modeles: ['OnePlus 7 Pro', 'OnePlus 7T Pro', 'OnePlus 7T', 'OnePlus 7'] },
    { groupe: 'Nord', modeles: ['Nord 3', 'Nord CE 3 Lite', 'Nord CE 3', 'Nord 2T', 'Nord CE 2 Lite', 'Nord CE 2', 'Nord 2', 'Nord CE', 'Nord'] },
  ],
  'Google Pixel': [
    { groupe: 'Pixel 8', modeles: ['Pixel 8 Pro', 'Pixel 8'] },
    { groupe: 'Pixel 7', modeles: ['Pixel 7 Pro', 'Pixel 7', 'Pixel 7a'] },
    { groupe: 'Pixel 6', modeles: ['Pixel 6 Pro', 'Pixel 6', 'Pixel 6a'] },
    { groupe: 'Pixel 5', modeles: ['Pixel 5', 'Pixel 5a', 'Pixel 4a 5G', 'Pixel 4a'] },
    { groupe: 'Pixel 4', modeles: ['Pixel 4 XL', 'Pixel 4', 'Pixel 3a XL', 'Pixel 3a'] },
  ],
  'Oppo': [
    { groupe: 'Find X', modeles: ['Find X7 Ultra', 'Find X7', 'Find X6 Pro', 'Find X6', 'Find X5 Pro', 'Find X5', 'Find X3 Pro', 'Find X3'] },
    { groupe: 'Reno', modeles: ['Reno 11 Pro', 'Reno 11', 'Reno 10 Pro+', 'Reno 10 Pro', 'Reno 10', 'Reno 8 Pro', 'Reno 8', 'Reno 6 Pro', 'Reno 6', 'Reno 4 Pro', 'Reno 4'] },
    { groupe: 'A Series', modeles: ['A98', 'A78', 'A58', 'A38', 'A17', 'A16', 'A15', 'A9', 'A5'] },
  ],
  'Sony': [
    { groupe: 'Xperia 1', modeles: ['Xperia 1 V', 'Xperia 1 IV', 'Xperia 1 III', 'Xperia 1 II', 'Xperia 1'] },
    { groupe: 'Xperia 5', modeles: ['Xperia 5 V', 'Xperia 5 IV', 'Xperia 5 III', 'Xperia 5 II', 'Xperia 5'] },
    { groupe: 'Xperia 10', modeles: ['Xperia 10 V', 'Xperia 10 IV', 'Xperia 10 III', 'Xperia 10 II', 'Xperia 10'] },
    { groupe: 'Xperia L', modeles: ['Xperia L4', 'Xperia L3', 'Xperia L2'] },
  ],
  'Nokia': [
    { groupe: 'Nokia G', modeles: ['Nokia G60', 'Nokia G42', 'Nokia G22', 'Nokia G21', 'Nokia G20', 'Nokia G10'] },
    { groupe: 'Nokia X', modeles: ['Nokia X30', 'Nokia X20', 'Nokia X10'] },
    { groupe: 'Nokia C', modeles: ['Nokia C32', 'Nokia C22', 'Nokia C12', 'Nokia C21', 'Nokia C20', 'Nokia C10'] },
    { groupe: 'Nokia Anciens', modeles: ['Nokia 8.3', 'Nokia 7.2', 'Nokia 6.2', 'Nokia 5.4', 'Nokia 3.4', 'Nokia 2.4', 'Nokia 1.4'] },
  ],
  'Motorola': [
    { groupe: 'Edge', modeles: ['Edge 40 Pro', 'Edge 40 Neo', 'Edge 40', 'Edge 30 Ultra', 'Edge 30 Pro', 'Edge 30 Fusion', 'Edge 30', 'Edge 20 Pro', 'Edge 20'] },
    { groupe: 'Moto G', modeles: ['Moto G84', 'Moto G73', 'Moto G54', 'Moto G53', 'Moto G34', 'Moto G23', 'Moto G14', 'Moto G13', 'Moto G82', 'Moto G72', 'Moto G62', 'Moto G52', 'Moto G32', 'Moto G22', 'Moto G42', 'Moto G31', 'Moto G50', 'Moto G30', 'Moto G10'] },
    { groupe: 'Moto E', modeles: ['Moto E13', 'Moto E22', 'Moto E20', 'Moto E7', 'Moto E6s'] },
    { groupe: 'Razr', modeles: ['Razr 40 Ultra', 'Razr 40', 'Razr 2022'] },
  ],
}

const MARQUES = ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'OnePlus', 'Google Pixel', 'Oppo', 'Sony', 'Nokia', 'Motorola', 'Autre']

const JOURS_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const MOIS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const MOIS_COURT = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc']
const JOURS_COURT = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

function isJourOuvert(horaires: string | null, date: Date): boolean {
  if (!horaires) return false
  const jourNom = JOURS_FR[date.getDay()]
  const ligne = horaires.split('|').find(h => h.startsWith(jourNom + ':'))
  return !!ligne && !ligne.includes('Fermé')
}

function getCreneaux(horaires: string | null, date: Date): string[] {
  if (!horaires) return []
  const jourNom = JOURS_FR[date.getDay()]
  const ligne = horaires.split('|').find(h => h.startsWith(jourNom + ':'))
  if (!ligne || ligne.includes('Fermé')) return []
  const parts = ligne.split(': ')
  if (parts.length < 2) return []
  const times = parts[1].split(' - ')
  if (times.length < 2) return []
  const [hO, mO] = times[0].trim().split(':').map(Number)
  const [hF, mF] = times[1].trim().split(':').map(Number)
  const creneaux: string[] = []
  let totalMinO = hO * 60 + (mO || 0)
  const totalMinF = hF * 60 + (mF || 0)
  while (totalMinO < totalMinF) {
    const h = Math.floor(totalMinO / 60).toString().padStart(2, '0')
    const m = (totalMinO % 60).toString().padStart(2, '0')
    creneaux.push(h + ':' + m)
    totalMinO += 30
  }
  return creneaux
}

function getJoursDuMois(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days: (Date | null)[] = []
  // Padding début (lundi = 0)
  let startPad = (firstDay.getDay() + 6) % 7
  for (let i = 0; i < startPad; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d))
  return days
}

export default function ReservationModal({
  reparateurId,
  reparateurNom,
  horaires,
  services,
}: {
  reparateurId: string
  reparateurNom: string
  horaires: string | null
  services: string | null
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [etape, setEtape] = useState<'form' | 'confirm'>('form')
  const [marque, setMarque] = useState('')
  const [modele, setModele] = useState('')
  const [rechercheModele, setRechercheModele] = useState('')
  const [saisieManuelle, setSaisieManuelle] = useState(false)
  const [typeRep, setTypeRep] = useState('')
  const [dateChoisie, setDateChoisie] = useState<Date | null>(null)
  const [heureChoisie, setHeureChoisie] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [moisAff, setMoisAff] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })

  const servicesList = services ? services.split(',').map(s => s.trim()).filter(Boolean) : []
  const today = new Date(); today.setHours(0,0,0,0)
  const jours = getJoursDuMois(moisAff.year, moisAff.month)
  const creneaux = dateChoisie ? getCreneaux(horaires, dateChoisie) : []

  const moisPrecedent = () => {
    setMoisAff(prev => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 }
      return { year: prev.year, month: prev.month - 1 }
    })
  }
  const moisSuivant = () => {
    setMoisAff(prev => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 }
      return { year: prev.year, month: prev.month + 1 }
    })
  }

  const handleReserver = async () => {
    if (!typeRep || !dateChoisie || !heureChoisie) {
      setError('Veuillez sélectionner un type, une date et un créneau.')
      return
    }
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/connexion?redirect=/reparateur/' + reparateurId + '&reserv=1')
      return
    }
    const dateStr = dateChoisie.getFullYear() + '-' +
      String(dateChoisie.getMonth() + 1).padStart(2, '0') + '-' +
      String(dateChoisie.getDate()).padStart(2, '0')
    const { error: err } = await supabase.from('reservations').insert({
      reparateur_id: reparateurId,
      client_id: user.id,
      client_email: user.email,
      marque: marque || null,
      modele: modele || null,
      type_reparation: typeRep,
      date: dateStr,
      heure: heureChoisie,
      note: note || null,
      statut: 'pending',
    })
    setLoading(false)
    if (err) { setError('Une erreur est survenue. Veuillez réessayer.'); return }
    setEtape('confirm')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px',
    padding: '9px 12px', fontSize: '13px', color: '#111',
    background: '#fafafa', fontFamily: '"DM Sans", sans-serif', outline: 'none',
  }

  const sectionTitle: React.CSSProperties = {
    fontSize: '10px', fontWeight: 600, color: '#999',
    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px',
  }

  return (
    <>
      <button
        onClick={async () => {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) {
            router.push('/connexion?redirect=/reparateur/' + reparateurId + '&reserv=1')
            return
          }
          setOpen(true)
        }}
        style={{ background: '#0f2d6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: '"DM Sans", sans-serif', flex: 1 }}
      >
        <i className="ti ti-calendar" aria-hidden="true" /> Réserver
      </button>

      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '420px', maxHeight: '90vh', overflowY: 'auto' }}>

            {etape === 'form' ? (
              <>
                {/* HEADER */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#111' }}>Réserver une réparation</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{reparateurNom}</div>
                  </div>
                  <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#888', lineHeight: 1 }}>×</button>
                </div>

                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                  {/* MARQUE */}
                  <div>
                    <div style={sectionTitle}>Marque du téléphone</div>
                    {marque ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '8px', padding: '9px 12px' }}>
                        <i className="ti ti-check" style={{ fontSize: '14px', color: '#2563eb' }} aria-hidden="true" />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb', flex: 1 }}>{marque}</span>
                        <button onClick={() => { setMarque(''); setModele(''); setRechercheModele(''); setSaisieManuelle(false) }} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>×</button>
                      </div>
                    ) : (
                      <div style={{ position: 'relative' }}>
                        <select value={marque} onChange={e => { setMarque(e.target.value); setModele(''); setRechercheModele(''); setSaisieManuelle(false) }} style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none' as any }}>
                          <option value="">Sélectionner une marque...</option>
                          {MARQUES.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <i className="ti ti-chevron-down" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: '14px', pointerEvents: 'none' }} aria-hidden="true" />
                      </div>
                    )}
                  </div>

                  {/* MODÈLE */}
                  {marque && marque !== 'Autre' && (
                    <div>
                      <div style={sectionTitle}>Modèle</div>
                      {!modele && !saisieManuelle ? (
                        <>
                          <div style={{ position: 'relative', marginBottom: '7px' }}>
                            <i className="ti ti-search" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#2563eb', fontSize: '15px' }} aria-hidden="true" />
                            <input
                              value={rechercheModele}
                              onChange={e => setRechercheModele(e.target.value)}
                              placeholder={'Rechercher un modèle ' + marque + '...'}
                              style={{ ...inputStyle, paddingLeft: '34px', border: '1.5px solid #2563eb' }}
                            />
                          </div>
                          <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', maxHeight: '180px', overflowY: 'auto' }}>
                            {(MODELES[marque] || []).map((groupe, gi) => {
                              const filtered = groupe.modeles.filter(m => m.toLowerCase().includes(rechercheModele.toLowerCase()))
                              if (rechercheModele && filtered.length === 0) return null
                              return (
                                <div key={gi}>
                                  {!rechercheModele && groupe.groupe && (
                                    <div style={{ padding: '5px 12px', fontSize: '10px', color: '#999', fontWeight: 700, background: '#f8f9fc', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #f0f0f0' }}>
                                      {groupe.groupe}
                                    </div>
                                  )}
                                  {filtered.map((m, mi) => (
                                    <div key={mi} onClick={() => setModele(m)}
                                      style={{ padding: '9px 12px', fontSize: '13px', color: '#111', cursor: 'pointer', borderBottom: '1px solid #f5f5f5' }}
                                      onMouseEnter={e => (e.currentTarget.style.background = '#f4f6fb')}
                                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                      {m}
                                    </div>
                                  ))}
                                </div>
                              )
                            })}
                            <div onClick={() => setSaisieManuelle(true)}
                              style={{ padding: '9px 12px', fontSize: '12px', color: '#888', cursor: 'pointer', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid #f0f0f0' }}
                              onMouseEnter={e => (e.currentTarget.style.background = '#f4f6fb')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                              <i className="ti ti-pencil" style={{ fontSize: '12px' }} aria-hidden="true" /> Saisir un autre modèle manuellement
                            </div>
                          </div>
                        </>
                      ) : modele ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '8px', padding: '9px 12px' }}>
                          <i className="ti ti-device-mobile" style={{ fontSize: '15px', color: '#2563eb' }} aria-hidden="true" />
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb', flex: 1 }}>{modele}</span>
                          <button onClick={() => { setModele(''); setRechercheModele(''); setSaisieManuelle(false) }} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>×</button>
                        </div>
                      ) : (
                        <input
                          value={modele}
                          onChange={e => setModele(e.target.value)}
                          placeholder={'Modèle ' + marque + ' (ex: ' + (MODELES[marque]?.[0]?.modeles?.[0] || '') + ')'}
                          style={inputStyle}
                          autoFocus
                        />
                      )}
                    </div>
                  )}

                  {/* AUTRE MARQUE */}
                  {marque === 'Autre' && (
                    <div>
                      <div style={sectionTitle}>Marque et modèle</div>
                      <input
                        value={modele}
                        onChange={e => setModele(e.target.value)}
                        placeholder="Ex: Honor Magic 5, Vivo Y22..."
                        style={inputStyle}
                      />
                    </div>
                  )}

                  {/* TYPE DE RÉPARATION */}
                  <div>
                    <div style={sectionTitle}>Type de réparation</div>
                    <select value={typeRep} onChange={e => setTypeRep(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">Choisir un service</option>
                      {servicesList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* CALENDRIER */}
                  <div>
                    <div style={sectionTitle}>Choisir une date</div>
                    <div style={{ background: '#f8f9fc', borderRadius: '12px', padding: '12px' }}>
                      {/* Header mois */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <button onClick={moisPrecedent} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '18px', lineHeight: 1, padding: '4px 8px' }}>‹</button>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>{MOIS_FR[moisAff.month]} {moisAff.year}</span>
                        <button onClick={moisSuivant} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '18px', lineHeight: 1, padding: '4px 8px' }}>›</button>
                      </div>
                      {/* En-têtes jours */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
                        {JOURS_COURT.map((j, i) => (
                          <div key={i} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 600, color: i >= 5 ? '#e0e0e0' : '#bbb' }}>{j}</div>
                        ))}
                      </div>
                      {/* Jours du mois */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                        {jours.map((d, i) => {
                          if (!d) return <div key={i} />
                          const isPast = d < today
                          const isSelected = dateChoisie?.toDateString() === d.toDateString()
                          const isToday = d.toDateString() === today.toDateString()
                          const ouvert = isJourOuvert(horaires, d)
                          const isWeekend = d.getDay() === 0 || d.getDay() === 6
                          const disabled = isPast || !ouvert || isWeekend
                          return (
                            <div
                              key={i}
                              onClick={() => { if (!disabled) { setDateChoisie(d); setHeureChoisie('') } }}
                              style={{
                                textAlign: 'center', padding: '6px 2px', borderRadius: '8px',
                                fontSize: '12px', cursor: disabled ? 'default' : 'pointer',
                                background: isSelected ? '#2563eb' : isToday && !disabled ? '#eff6ff' : 'transparent',
                                color: isSelected ? '#fff' : disabled ? '#ddd' : '#111',
                                fontWeight: isSelected ? 700 : isToday ? 600 : 400,
                                border: isToday && !isSelected ? '1px solid #bfdbfe' : '1px solid transparent',
                              }}
                            >
                              {d.getDate()}
                            </div>
                          )
                        })}
                      </div>
                      {/* Légende */}
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2563eb' }} />
                          <span style={{ fontSize: '10px', color: '#888' }}>Sélectionné</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e0e0e0' }} />
                          <span style={{ fontSize: '10px', color: '#888' }}>Fermé</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CRÉNEAUX */}
                  {dateChoisie && (
                    <div>
                      <div style={sectionTitle}>
                        Créneau · {dateChoisie.getDate()} {MOIS_COURT[dateChoisie.getMonth()]}
                      </div>
                      {creneaux.length === 0 ? (
                        <div style={{ fontSize: '13px', color: '#888', textAlign: 'center', padding: '12px 0' }}>Aucun créneau disponible ce jour</div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px' }}>
                          {creneaux.map(h => {
                            const selected = heureChoisie === h
                            return (
                              <div
                                key={h}
                                onClick={() => setHeureChoisie(h)}
                                style={{
                                  textAlign: 'center', padding: '8px 4px', borderRadius: '8px',
                                  background: selected ? '#2563eb' : '#f4f6fb',
                                  border: '1px solid', borderColor: selected ? '#2563eb' : '#e0e0e0',
                                  fontSize: '11px', color: selected ? '#fff' : '#555',
                                  fontWeight: selected ? 600 : 400, cursor: 'pointer',
                                }}
                              >
                                {h}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* NOTE */}
                  <div>
                    <div style={sectionTitle}>Note (optionnel)</div>
                    <textarea
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="Ex: iPhone 13, écran fissuré sur le coin droit..."
                      style={{ ...inputStyle, minHeight: '65px', resize: 'none' }}
                    />
                  </div>

                  {error && (
                    <div style={{ fontSize: '13px', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 12px' }}>
                      {error}
                    </div>
                  )}

                  {/* RÉCAPITULATIF */}
                  {(marque || modele || typeRep) && dateChoisie && heureChoisie && (
                    <div style={{ background: '#f4f6fb', borderRadius: '10px', padding: '12px 14px', border: '1px solid #e8eaf0' }}>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '9px' }}>Récapitulatif</div>
                      {(marque || modele) && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span style={{ fontSize: '12px', color: '#888' }}>Téléphone</span>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#111' }}>{[marque, modele].filter(Boolean).join(' · ')}</span>
                        </div>
                      )}
                      {typeRep && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span style={{ fontSize: '12px', color: '#888' }}>Réparation</span>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#111' }}>{typeRep}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid #e8eaf0', marginTop: '4px' }}>
                        <span style={{ fontSize: '12px', color: '#888' }}>RDV</span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb' }}>
                          {dateChoisie.getDate()} {MOIS_COURT[dateChoisie.getMonth()]} · {heureChoisie}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleReserver}
                    disabled={loading}
                    style={{ background: loading ? '#93c5fd' : '#0f2d6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif' }}
                  >
                    {loading ? 'Envoi en cours...' : 'Confirmer la réservation →'}
                  </button>

                </div>
              </>
            ) : (
              /* CONFIRMATION */
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <i className="ti ti-circle-check" style={{ fontSize: '28px', color: '#16a34a' }} aria-hidden="true" />
                </div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: '#111', marginBottom: '6px' }}>Demande envoyée !</div>
                <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Votre demande a été envoyée à <strong>{reparateurNom}</strong>.<br />
                  {dateChoisie && (
                    <><strong>{JOURS_FR[dateChoisie.getDay()]} {dateChoisie.getDate()} {MOIS_COURT[dateChoisie.getMonth()]}</strong> à <strong>{heureChoisie}</strong><br /></>
                  )}
                  <br />Vous recevrez un email dès que le réparateur aura répondu.
                </div>
                <button
                  onClick={() => router.push('/mon-compte?tab=reservations')}
                  style={{ background: '#0f2d6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', width: '100%', marginBottom: '8px' }}
                >
                  Voir mes réservations
                </button>
                <button
                  onClick={() => { setOpen(false); setEtape('form'); setDateChoisie(null); setHeureChoisie(''); setMarque(''); setModele(''); setTypeRep(''); setNote('') }}
                  style={{ background: '#f4f6fb', color: '#111', border: '1px solid #e8eaf0', borderRadius: '10px', padding: '12px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', width: '100%' }}
                >
                  Retour à la fiche
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  )
}
