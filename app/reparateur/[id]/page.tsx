import { supabase } from '../../../lib/supabase'

export default async function FicheReparateur({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: r } = await supabase
    .from('reparateurs')
    .select('*')
    .eq('id', id)
    .single()

  if (!r) return <div className="p-10 text-center text-gray-400">Réparateur introuvable.</div>

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

      <div className="max-w-3xl mx-auto px-6 py-6">
        <a href="/resultats" className="text-sm text-gray-400 hover:text-gray-600 mb-4 block">← Retour aux résultats</a>

        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-lg font-medium text-blue-700 flex-shrink-0">
              {r.nom?.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-medium text-gray-900">{r.nom}</h1>
                <span className={`text-xs px-2 py-0.5 rounded-full ${r.ouvert ? "bg-green-50 text-green-700" : "bg-red-50 text-red-500"}`}>
                  {r.ouvert ? "Ouvert" : "Fermé"}
                </span>
              </div>
              <div className="text-sm text-gray-400 mb-1">📍 {r.adresse}, {r.ville} {r.code_postal}</div>
              {r.note && (
                <div className="text-sm text-yellow-500">
                  {"★".repeat(Math.floor(r.note))} <span className="text-gray-400">{r.note}/5</span>
                </div>
              )}
            </div>
          </div>
          {r.description && <p className="text-sm text-gray-500">{r.description}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="col-span-2 bg-white border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Services</h2>
            <p className="text-sm text-gray-700">{r.services}</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Horaires</h2>
            <p className="text-sm text-gray-700">{r.horaires}</p>
            {r.telephone && (
              <a href={`tel:${r.telephone}`} className="w-full mt-4 bg-blue-600 text-white text-sm py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 block text-center">
                📞 Appeler
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}