cat > ~/trouve-ton-reparateur/app/resultats/page.tsx << 'EOF'
import { supabase } from '../../lib/supabase'

export default async function Resultats({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  let reparateurs: any[] = []

  if (q) {
    const { data } = await supabase
      .from('reparateurs')
      .select('*')
      .or(`ville.ilike.%${q}%,code_postal.ilike.%${q}%`)

    reparateurs = data ?? []
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
            {reparateurs.length} réparateur(s) trouvé(s)
            {q && <span className="text-gray-400 font-normal"> pour "{q}"</span>}
          </h1>
        </div>

        {reparateurs.length === 0 && (
          <div className="text-center text-gray-400 py-20">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">Aucun réparateur trouvé pour cette recherche.</p>
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
                <div className="text-xs text-gray-400">📍 {r.ville}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
