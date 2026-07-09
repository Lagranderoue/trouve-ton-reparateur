'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

function getProchainsDays(horaires: string | null, nb: number) {
  const days = []
  const now = new Date()
  // Commencer à demain si après 17h, sinon aujourd'hui
  const startOffset = now.getHours() >= 17 ? 1 : 0
  for (let i = startOffset; i < 30 && days.length < nb; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    d.setHours(0, 0, 0, 0)
    const jourNom = JOURS[(d.getDay() + 6) % 7]
    if (!horaires) { days.push(d); continue }
    const ligne = horaires.split('|').find(h => h.startsWith(jourNom + ':'))
    if (ligne && !ligne.includes('Fermé')) days.push(d)
  }
  return days
}

function getCreneaux(horaires: string | null, date: Date) {
  if (!horaires) return []
  const jourNom = JOURS[(date.getDay() + 6) % 7]
  const ligne = horaires.split('|').find(h => h.startsWith(jourNom))
  if (!ligne || ligne.includes('Fermé')) return []
  const parts = ligne.split(': ')
  if (parts.length < 2) return []
  const times = parts[1].split(' - ')
  if (times.length < 2) return []
  const [hO, mO] = times[0].split(':').map(Number)
  const [hF] = times[1].split(':').map(Number)
  const creneaux = []
  for (let h = hO; h < hF; h++) {
    creneaux.push(h.toString().padStart(2, '0') + ':' + (mO === 30 ? '30' : '00'))
  }
  return creneaux
}

const JOURS_COURT = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM']
const MOIS = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc']

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
  const [open, setOpen] = useState(false)
  const [etape, setEtape] = useState<'form' | 'confirm'>( 'form')
  const [typeRep, setTypeRep] = useState('')
  const [dateChoisie, setDateChoisie] = useState<Date | null>(null)
  const [heureChoisie, setHeureChoisie] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const servicesList = services ? services.split(',').map(s => s.trim()).filter(Boolean) : []
  const jours = getProchainsDays(horaires, 7)
  const creneaux = dateChoisie ? getCreneaux(horaires, dateChoisie) : []

  const handleReserver = async () => {
    if (!typeRep || !dateChoisie || !heureChoisie) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/connexion?redirect=/reparateur/' + reparateurId + '&reserv=1')
      return
    }
    const dateStr = dateChoisie.toISOString().split('T')[0]
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
    if (err) { setError('Une erreur est survenue.'); return }
    setEtape('confirm')
  }

  const inputStyle = {
    width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px',
    padding: '9px 12px', fontSize: '13px', color: '#111',
    background: '#fafafa', fontFamily: '"DM Sans", sans-serif',
    outline: 'none',
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
                <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#111' }}>Réserver une réparation</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{reparateurNom}</div>
                  </div>
                  <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>×</button>
                </div>

                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>Type de réparation</div>
                    <select value={typeRep} onChange={e => setTypeRep(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">Choisir un service</option>
                      {servicesList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>Choisir une date</div>
                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                      {jours.map((d, i) => {
                        const selected = dateChoisie?.toDateString() === d.toDateString()
                        return (
                          <div key={i} onClick={() => { setDateChoisie(d); setHeureChoisie('') }} style={{ flexShrink: 0, textAlign: 'center', padding: '8px 12px', borderRadius: '10px', background: selected ? '#2563eb' : '#f4f6fb', border: '1px solid', borderColor: selected ? '#2563eb' : '#e0e0e0', cursor: 'pointer' }}>
                            <div style={{ fontSize: '10px', color: selected ? 'rgba(255,255,255,0.7)' : '#888' }}>{JOURS_COURT[d.getDay()]}</div>
                            <div style={{ fontSize: '16px', fontWeight: 600, color: selected ? '#fff' : '#111' }}>{d.getDate()}</div>
                            <div style={{ fontSize: '10px', color: selected ? 'rgba(255,255,255,0.7)' : '#888' }}>{MOIS[d.getMonth()]}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {dateChoisie && (
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>Choisir un créneau</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                        {creneaux.map(h => {
                          const selected = heureChoisie === h
                          return (
                            <div key={h} onClick={() => setHeureChoisie(h)} style={{ textAlign: 'center', padding: '9px', borderRadius: '8px', background: selected ? '#2563eb' : '#f4f6fb', border: '1px solid', borderColor: selected ? '#2563eb' : '#e0e0e0', fontSize: '13px', color: selected ? '#fff' : '#555', fontWeight: selected ? 600 : 400, cursor: 'pointer' }}>
                              {h}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>Note (optionnel)</div>
                    <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Ex: iPhone 13, écran fissuré..." style={{ ...inputStyle, minHeight: '70px', resize: 'none' }} />
                  </div>

                  {error && <div style={{ fontSize: '13px', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 12px' }}>{error}</div>}

                  <button onClick={handleReserver} disabled={loading} style={{ background: loading ? '#93c5fd' : '#0f2d6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                    {loading ? 'Envoi en cours...' : 'Confirmer la réservation →'}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <i className="ti ti-circle-check" style={{ fontSize: '28px', color: '#16a34a' }} aria-hidden="true" />
                </div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: '#111', marginBottom: '6px' }}>Demande envoyée !</div>
                <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Votre demande a été envoyée à <strong>{reparateurNom}</strong>.<br />
                  {dateChoisie && <><strong>{JOURS_COURT[dateChoisie.getDay()]} {dateChoisie.getDate()} {MOIS[dateChoisie.getMonth()]}</strong> · <strong>{heureChoisie}</strong><br /></>}
                  <br />Vous recevrez un email dès que le réparateur aura répondu.
                </div>
                <button onClick={() => router.push('/mon-compte?tab=reservations')} style={{ background: '#0f2d6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', width: '100%', marginBottom: '8px' }}>
                  Voir mes réservations
                </button>
                <button onClick={() => { setOpen(false); setEtape('form') }} style={{ background: '#f4f6fb', color: '#111', border: '1px solid #e8eaf0', borderRadius: '10px', padding: '12px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', width: '100%' }}>
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
