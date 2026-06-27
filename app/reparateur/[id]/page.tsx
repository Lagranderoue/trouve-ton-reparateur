import { supabase } from '../../../lib/supabase'
import AvisForm from './AvisForm'
import AvisList from './AvisList'

export const dynamic = 'force-dynamic'

async function enregistrerVue(id: string) {
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  await supabase.from('vues').insert({ reparateur_id: id })
}

export default async function FicheReparateur({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await enregistrerVue(id)

  const { data: r } = await supabase
    .from('reparateurs')
    .select('*')
    .eq('id', id)
    .single()

  if (!r) return <div className="p-10 text-center text-gray-400">Réparateur introuvable.</div>

  const servicesList: string[] = r.services
    ? r.services.split(',').map((s: string) => s.trim()).filter(Boolean)
    : []

  const horairesList: { jour: string; horaire: string }[] = r.horaires
    ? r.horaires.split('|').map((h: string) => {
        const parts = h.trim().split(':')
        const jour = parts[0]?.trim() || ''
        const horaire = parts.slice(1).join(':').trim()
        return { jour, horaire }
}).filter((h: { jour: string; horaire: string }) => h.jour)
    : []

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between bg-white">
        <a href="/" className="text-base font-medium">
          Trouve ton <span className="text-blue-600">réparateur</span>
        </a>
        <a href="/inscrire" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg">
          Inscrire ma boutique
        </a>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <a href="javascript:history.back()" className="text-sm text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1">
          ← Retour aux résultats
        </a>

        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-xl font-medium text-blue-700 flex-shrink-0 overflow-hidden">
                {r.logo_url ? (
                  <img src={r.logo_url} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  r.nom?.charAt(0)
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-xl font-medium text-gray-900">{r.nom}</h1>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${r.ouvert ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'}`}>
                    {r.ouvert ? 'Ouvert' : 'Fermé'}
                  </span>
                </div>
                <div className="text-sm text-gray-400 flex items-center gap-1 mb-2">
                  {r.adresse}, {r.ville} {r.code_postal}
                </div>
                {r.description && <p className="text-sm text-gray-500">{r.description}</p>}
              </div>
            </div>
            {r.telephone && (
              <a href={'tel:' + r.telephone} className="flex-shrink-0 flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium">
                📞 Appeler
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Services</h2>
            <div className="flex flex-wrap gap-2">
              {r.deplacement && (
              <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-sm px-3 py-1.5 rounded-full font-medium mb-4">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Déplacement à domicile disponible
              </div>
            )}
            {servicesList.length > 0 ? servicesList.map((s) => (
                <span key={s} className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                  {s}
                </span>
              )) : <p className="text-sm text-gray-400">Non renseigné</p>}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Horaires</h2>
            <div className="flex flex-col gap-2">
              {horairesList.length > 0 ? horairesList.map(({ jour, horaire }) => (
                <div key={jour} className="flex justify-between text-sm">
                  <span className={horaire === 'Fermé' ? 'text-gray-300' : 'text-gray-700 font-medium'}>{jour}</span>
                  <span className={horaire === 'Fermé' ? 'text-gray-300' : 'text-gray-500'}>{horaire}</span>
                </div>
              )) : <p className="text-sm text-gray-400">Non renseigné</p>}
            </div>
          </div>
        </div>
      </div>
    <section className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Laisser un avis</h2>
        <AvisForm reparateurId={r.id} />
        <AvisList reparateurId={r.id} />
      </section>
    </main>
  )
}