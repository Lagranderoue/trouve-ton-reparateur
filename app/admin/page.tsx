'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'

export default function Admin() {
  const [password, setPassword] = useState('')
  const [auth, setAuth] = useState(false)
  const [error, setError] = useState('')
  const [reparateurs, setReparateurs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('dashboard')
  const [kbisUrl, setKbisUrl] = useState<string | null>(null)
  const mapRef = useRef<any>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === 'true') {
      setAuth(true)
      loadReparateurs()
    }
  }, [])

  const handleLogin = () => {
    if (password === '1904') {
      sessionStorage.setItem('admin_auth', 'true')
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

  const voirKbis = async (fileName: string) => {
    const { data } = await supabase.storage.from('kbis').createSignedUrl(fileName, 300)
    if (data?.signedUrl) setKbisUrl(data.signedUrl)
  }

  useEffect(() => {
    if (tab === 'dashboard' && auth && reparateurs.length > 0) {
      setTimeout(async () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        }
        const L = (await import('leaflet')).default
        await import('leaflet/dist/leaflet.css')
        if (!mapRef.current) return
        const map = L.map(mapRef.current).setView([46.5, 2.5], 6)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'OpenStreetMap'
        }).addTo(map)
        const icon = L.divIcon({
          html: '<div style="background:#2563eb;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>',
          iconSize: [12, 12],
          className: ''
        })
        reparateurs.filter(r => r.latitude && r.statut === 'approved').forEach(r => {
          L.marker([r.latitude, r.longitude], { icon })
            .addTo(map)
            .bindPopup('<strong>' + r.nom + '</strong><br>' + r.ville)
        })
        mapInstanceRef.current = map
      }, 300)
    }
  }, [tab, auth, reparateurs])
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

      {kbisUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-6" onClick={() => setKbisUrl(null)}>
          <div className="bg-white rounded-xl overflow-hidden max-w-3xl w-full max-h-screen" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-medium text-gray-900">Document Kbis</h2>
              <button onClick={() => setKbisUrl(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-4">
              {kbisUrl.match(/\.(jpg|jpeg|png)$/i) ? (
                <img src={kbisUrl} alt="Kbis" className="w-full rounded-lg" />
              ) : (
                <iframe src={kbisUrl} className="w-full rounded-lg" style={{ height: '600px' }} />
              )}
            </div>
          </div>
        </div>
      )}

      <nav className="border-b border-gray-100 px-6 py-4 bg-white flex items-center justify-between">
        <h1 className="text-base font-medium">Admin <span className="text-blue-600">Trouve ton reparateur</span></h1>
        <div className="flex gap-2">
          <button onClick={() => setTab('dashboard')} className={'text-sm px-4 py-2 rounded-lg ' + (tab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100')}>
            Dashboard
          </button>
          <button onClick={() => setTab('inscriptions')} className={'text-sm px-4 py-2 rounded-lg ' + (tab === 'inscriptions' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100')}>
            Inscriptions {pending.length > 0 && <span className="ml-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pending.length}</span>}
          </button>
          <button onClick={() => setTab('reparateurs')} className={'text-sm px-4 py-2 rounded-lg ' + (tab === 'reparateurs' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100')}>
            Reparateurs
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {tab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-white border border-gray-100 rounded-xl p-5">
                <div className="text-2xl font-medium text-gray-900">{reparateurs.length}</div>
                <div className="text-sm text-gray-400 mt-1">Total inscrits</div>
              </div>
              <div className="bg-white border border-green-100 rounded-xl p-5">
                <div className="text-2xl font-medium text-green-600">{approved.length}</div>
                <div className="text-sm text-gray-400 mt-1">Approuves</div>
              </div>
              <div className="bg-white border border-orange-100 rounded-xl p-5">
                <div className="text-2xl font-medium text-orange-500">{pending.length}</div>
                <div className="text-sm text-gray-400 mt-1">En attente</div>
              </div>
              <div className="bg-white border border-red-100 rounded-xl p-5">
                <div className="text-2xl font-medium text-red-400">{rejected.length}</div>
                <div className="text-sm text-gray-400 mt-1">Rejetes</div>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Carte des reparateurs</h2>
              <div ref={mapRef} style={{ height: '450px', borderRadius: '8px' }} />
            </div>
          </div>
        )}

        {tab === 'inscriptions' && (
          <div>
            {pending.length === 0 && (
              <div className="text-center text-gray-400 py-20">
                <p className="text-sm">Aucune inscription en attente</p>
              </div>
            )}
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
                      <button onClick={() => voirKbis(r.kbis_url)} className="text-xs border border-blue-200 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50">
                        Voir Kbis
                      </button>
                    )}
                    <button onClick={() => updateStatut(r.id, 'approved')} disabled={loading} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg">
                      Approuver
                    </button>
                    <button onClick={() => updateStatut(r.id, 'rejected')} disabled={loading} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg">
                      Rejeter
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

        {tab === 'reparateurs' && (
          <div>
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
        )}
      </div>
    </main>
  )
}