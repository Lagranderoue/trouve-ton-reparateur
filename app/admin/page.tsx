'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Admin() {
  const [password, setPassword] = useState('')
  const [auth, setAuth] = useState(false)
  const [error, setError] = useState('')
  const [reparateurs, setReparateurs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    if (password === '1904') {
      setAuth(true)
      loadReparateurs()
    } else {
      setError('Mot de passe incorrect')
    }
  }

  const loadReparateurs = async () => {
    const { data } = await supabase
      .from('reparateurs')
      .select('*')
      .order('created_at', { ascending: false })
    setReparateurs(data || [])
  }

  const updateStatut = async (id: string, statut: string) => {
    setLoading(true)
    await supabase.from('reparateurs').update({ statut }).eq('id', id)
    await loadReparateurs()
    setLoading(false)
  }

  const deleteReparateur = async (id: string) => {
    if (!confirm('Supprimer ce reparateur ?')) return
    setLoading(true)
    await supabase.from('reparateurs').delete().eq('id', id)
    await loadReparateurs()
    setLoading(false)
  }

  const getKbisUrl = async (fileName: string) => {
    const { data } = await supabase.storage.from('kbis').createSignedUrl(fileName, 60)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  if (!auth) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 border border-gray-100 w-full max-w-sm">
        <h1 className="text-lg font-medium text-gray-900 mb-6">Admin</h1>
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none mb-3"
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium">
          Connexion
        </button>
      </div>
    </main>
  )

  const pending = reparateurs.filter(r => r.statut === 'pending')
  const approved = reparateurs.filter(r => r.statut === 'approved')
  const rejected = reparateurs.filter(r => r.statut === 'rejected')

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 px-6 py-4 bg-white flex items-center justify-between">
        <h1 className="text-base font-medium">Admin <span className="text-blue-600">Trouve ton reparateur</span></h1>
        <div className="flex gap-4 text-sm text-gray-400">
          <span>{pending.length} en attente</span>
          <span>{approved.length} approuves</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {pending.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">En attente ({pending.length})</h2>
            <div className="flex flex-col gap-3">
              {pending.map((r) => (
                <div key={r.id} className="bg-white border border-orange-100 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{r.nom}</h3>
                      <p className="text-sm text-gray-400">{r.adresse}, {r.ville} {r.code_postal}</p>
                      <p className="text-sm text-gray-400">{r.telephone} — {r.email}</p>
                    </div>
                    <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full">En attente</span>
                  </div>
                  {r.services && <p className="text-sm text-gray-600 mb-1"><strong>Services:</strong> {r.services}</p>}
                  {r.horaires && <p className="text-sm text-gray-600 mb-3"><strong>Horaires:</strong> {r.horaires}</p>}
                  <div className="flex gap-2 flex-wrap">
                    {r.kbis_url && (
                      <button onClick={() => getKbisUrl(r.kbis_url)} className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50">
                        Voir Kbis
                      </button>
                    )}
                    <button onClick={() => updateStatut(r.id, 'approved')} disabled={loading} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg disabled:opacity-50">
                      Approuver
                    </button>
                    <button onClick={() => updateStatut(r.id, 'rejected')} disabled={loading} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg disabled:opacity-50">
                      Rejeter
                    </button>
                    <button onClick={() => deleteReparateur(r.id)} disabled={loading} className="text-xs border border-red-200 text-red-400 px-3 py-1.5 rounded-lg disabled:opacity-50">
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Approuves ({approved.length})</h2>
          <div className="flex flex-col gap-3">
            {approved.map((r) => (
              <div key={r.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-sm text-gray-900">{r.nom}</h3>
                  <p className="text-xs text-gray-400">{r.ville} — {r.email}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatut(r.id, 'rejected')} disabled={loading} className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-gray-500">
                    Desapprouver
                  </button>
                  <button onClick={() => deleteReparateur(r.id)} disabled={loading} className="text-xs border border-red-200 text-red-400 px-3 py-1.5 rounded-lg">
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {rejected.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Rejetes ({rejected.length})</h2>
            <div className="flex flex-col gap-3">
              {rejected.map((r) => (
                <div key={r.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between opacity-60">
                  <div>
                    <h3 className="font-medium text-sm text-gray-900">{r.nom}</h3>
                    <p className="text-xs text-gray-400">{r.ville} — {r.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateStatut(r.id, 'approved')} disabled={loading} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg">
                      Approuver
                    </button>
                    <button onClick={() => deleteReparateur(r.id)} disabled={loading} className="text-xs border border-red-200 text-red-400 px-3 py-1.5 rounded-lg">
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
