import { supabase } from '../../lib/supabase'

async function geocodeVille(query: string) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=fr&format=json&limit=1`,
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
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  let reparateurs: any[] = []
  let fallback = false

  if (q) {
    const { data } = await supabase
      .from('reparateurs')
      .select('*')
.or(`ville.ilike.%${q}%,code_postal.ilike.%${q}%`)
      .eq('statut', 'approved')
    if (data && data.length > 0) {
      reparateurs = data
    } else {
      // Fallback : géolocalisation par proximité
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
            .slice(0, 10)
          fallback = true
        }
      }
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between bg-white">
        <a href="/" className="text-base font-medium">
          Trouve ton <span className="text-blue-600">réparateur</span>
        </a>
        <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg">
          Inscrire ma boutique
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex items-center gap-3 mb-4">
          <a href="/" className="text-sm text-gray-400 hover:text-gray-600">← Retour</a>
          <h1 className="text-base font-medium text-gray-900">
            {fallback
              ? `Aucun réparateur à ${q} — réparateurs les plus proches :`
              : `${reparateurs.length} réparateur(s) trouvé(s) pour "${q}"`}
          </h1>
        </div>

        {reparateurs.length === 0 && (
          <div className="text-center text-gray-400 py-20">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">Aucun réparateur trouvé.</p>
            <a href="/" className="text-blue-600 text-sm mt-2 inline-block">Réessayer</a>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {reparateurs.map((r) => (
            <a href={`/reparateur/${r.id}`} key={r.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-sm font-medium text-blue-700 flex-shrink-0">
                {r.nom?.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-gray-900">{r.nom}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.ouvert ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'}`}>
                    {r.ouvert ? 'Ouvert' : 'Fermé'}
                  </span>
                </div>
                <div className="text-xs text-gray-400">{r.adresse}, {r.ville}</div>
              </div>
              <div className="text-right flex-shrink-0">
                {r.distance && (
                  <div className="text-xs text-blue-500 font-medium">{Math.round(r.distance)} km</div>
                )}
                <div className="text-xs text-gray-400">📍 {r.ville}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
