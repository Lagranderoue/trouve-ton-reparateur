'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
                  onClick={() => { setOpen(false); setEtape('form'); setDateChoisie(null); setHeureChoisie(''); setTypeRep(''); setNote('') }}
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
