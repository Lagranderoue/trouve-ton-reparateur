import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'

function estOuvert(horaires: string | null): boolean {
  if (!horaires) return false
  const now = new Date()
  const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const jourActuel = jours[now.getDay()]
  const heureActuelle = now.getHours() * 60 + now.getMinutes()
  const lignes = horaires.split('|')
  for (const ligne of lignes) {
    const parts = ligne.split(':')
    if (parts.length < 2) continue
    const jour = parts[0].trim()
    const horaire = parts.slice(1).join(':').trim()
    if (jour !== jourActuel) continue
    if (horaire === 'Fermé') return false
    const times = horaire.split(' - ')
    if (times.length !== 2) return false
    const [hOuv, mOuv] = times[0].trim().split(':').map(Number)
    const [hFerm, mFerm] = times[1].trim().split(':').map(Number)
    const ouverture = hOuv * 60 + mOuv
    const fermeture = hFerm * 60 + mFerm
    return heureActuelle >= ouverture && heureActuelle < fermeture
  }
  return false
}

async function geocodeVille(query: string) {
  const res = await fetch(
    'https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(query) + '&countrycodes=fr&format=json&limit=1',
    { headers: { 'User-Agent': 'trouvetonreparateur/1.0' } }
  )
  const data = await res.json()
  if (!data[0]) return null
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
}

function distance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

export default async function Resultats({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; lat?: string; lng?: string }>
}) {
  const { q, lat, lng } = await searchParams

  let reparateurs: any[] = []
  let fallback = false

  if (lat && lng) {
    const userLat = parseFloat(lat)
    const userLng = parseFloat(lng)
    const { data: tous } = await supabase
      .from('reparateurs')
      .select('*')
      .not('latitude', 'is', null)
      .eq('statut', 'approved')
    if (tous) {
      reparateurs = tous
        .map(r => ({ ...r, distance: distance(userLat, userLng, r.latitude, r.longitude) }))
        .sort((a, b) => a.distance - b.distance)
        .filter(r => r.distance <= 70)
        .slice(0, 10)
      fallback = true
    }
  } else if (q) {
    const { data } = await supabase
      .from('reparateurs')
      .select('*')
      .or('ville.ilike.%' + q + '%,code_postal.ilike.%' + q + '%')
      .eq('statut', 'approved')
    if (data && data.length > 0) {
      reparateurs = data
    } else {
      const coords = await geocodeVille(q)
      if (coords) {
        const { data: tous } = await supabase
          .from('reparateurs')
          .select('*')
          .not('latitude', 'is', null)
          .eq('statut', 'approved')
        if (tous) {
          reparateurs = tous
            .map(r => ({ ...r, distance: distance(coords.lat, coords.lng, r.latitude, r.longitude) }))
            .sort((a, b) => a.distance - b.distance)
            .filter(r => r.distance <= 70)
            .slice(0, 10)
          fallback = true
        }
      }
    }
  }

  // Récupérer les avis pour chaque réparateur
  const ids = reparateurs.map(r => r.id)
  let avisMap: Record<string, { moyenne: number, count: number }> = {}
  if (ids.length > 0) {
    const { data: avis } = await supabase
      .from('avis')
      .select('reparateur_id, note')
      .in('reparateur_id', ids)
      .eq('statut', 'approved')
    if (avis) {
      ids.forEach(id => {
        const avisDuRep = avis.filter(a => a.reparateur_id === id)
        if (avisDuRep.length > 0) {
          const moyenne = avisDuRep.reduce((acc, a) => acc + a.note, 0) / avisDuRep.length
          avisMap[id] = { moyenne: Math.round(moyenne * 10) / 10, count: avisDuRep.length }
        }
      })
    }
  }

  const meilleuxNote = reparateurs.length > 0 ? reparateurs.reduce((best: any, r: any) => {
    const noteBest = avisMap[best.id]?.moyenne || 0
    const noteR = avisMap[r.id]?.moyenne || 0
    return noteR > noteBest ? r : best
  }) : null

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: '"DM Sans", sans-serif' }}>
      
      <Navbar />

      <div style={{ background: '#0f2d6b', padding: '12px 24px 20px' }}>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '2px' }}>
          {reparateurs.length} résultat{reparateurs.length > 1 ? 's' : ''} pour
        </div>
        <div style={{ fontSize: '20px', fontWeight: 500, color: '#fff' }}>
          {q || 'votre recherche'}
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
        {reparateurs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888' }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#111', marginBottom: '6px' }}>Aucun réparateur trouvé</div>
            <div style={{ fontSize: '13px', marginBottom: '16px' }}>Aucun réparateur dans un rayon de 70 km.</div>
            <a href="/" style={{ color: '#2563eb', fontSize: '13px', fontWeight: 500 }}>← Nouvelle recherche</a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {reparateurs.map((r: any) => {
              const estMeilleuxNote = meilleuxNote?.id === r.id && avisMap[r.id]
              const services = r.services ? r.services.split(',').map((s: string) => s.trim()).filter(Boolean) : []
              const avis = avisMap[r.id]
              return (
                <a key={r.id} href={'/reparateur/' + r.id} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{
                    background: '#fff',
                    border: estMeilleuxNote ? '0.5px solid #2563eb' : '0.5px solid #e8eaf0',
                    borderRadius: '14px',
                    overflow: 'hidden',
                  }}>
                    {estMeilleuxNote && (
                      <div style={{ background: '#eff6ff', padding: '4px 14px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 500, color: '#2563eb' }}>★ Mieux noté dans votre zone</span>
                      </div>
                    )}
                    <div style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 500, color: '#2563eb', flexShrink: 0, overflow: 'hidden' }}>
                          {r.logo_url ? <img src={r.logo_url} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : r.nom?.charAt(0)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '15px', fontWeight: 500, color: '#111' }}>{r.nom}</span>
                            <span style={{ fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px', background: estOuvert(r.horaires) ? '#f0fdf4' : '#f5f5f5', color: estOuvert(r.horaires) ? '#16a34a' : '#888' }}>
                              {estOuvert(r.horaires) ? '● Ouvert' : 'Fermé'}
                            </span>
                            {r.deplacement && (
                              <span style={{ fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px', background: '#eff6ff', color: '#2563eb' }}>
                                Déplacement
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>📍 {r.ville}</span>
                            {r.distance && <span> · {Math.round(r.distance)} km</span>}
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                            {services.slice(0, 3).map((s: string, i: number) => (
                              <span key={i} style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '20px', background: '#f4f6fb', border: '0.5px solid #e8eaf0', color: '#555' }}>{s}</span>
                            ))}
                            {services.length > 3 && <span style={{ fontSize: '11px', color: '#888' }}>+{services.length - 3}</span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                          {avis ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ color: '#f59e0b', fontSize: '13px' }}>★</span>
                              <span style={{ fontSize: '13px', fontWeight: 500, color: '#111' }}>{avis.moyenne}</span>
                              <span style={{ fontSize: '11px', color: '#888' }}>({avis.count})</span>
                            </div>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#bbb' }}>Aucun avis</span>
                          )}
                          <div style={{ background: '#2563eb', color: '#fff', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 500 }}>
                            Voir la fiche →
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}