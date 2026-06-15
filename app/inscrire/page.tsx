'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const SERVICES = [
  'Écran cassé', 'Batterie', 'Connecteur de charge', 'Boutons',
  'Caméra', 'Haut-parleur', 'Téléphone oxydé', 'Carte mère',
  'Vitre arrière', 'PC / Tablette', 'Châssis complet'
]

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

const CRENEAUX = Array.from({ length: 29 }, (_, i) => {
  const h = Math.floor(i / 2) + 8
  const m = i % 2 === 0 ? '00' : '30'
  return `${String(h).padStart(2, '0')}:${m}`
})

const defaultHoraires = JOURS.map((jour, i) => ({
  jour,
  ouvert: i < 6,
  ouverture: '09:00',
  fermeture: '19:00'
}))

export default function Inscrire() {
  const [form, setForm] = useState({
    nom: '', adresse: '', ville: '', code_postal: '', telephone: '', email: '', description: ''
  })
  const [services, setServices] = useState<string[]>([])
  const [horaires, setHoraires] = useState(defaultHoraires)
  const [kbis, setKbis] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [deplacement, setDeplacement] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const toggleService = (s: string) => {
    setServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const toggleJour = (i: number) => {
    setHoraires(prev => prev.map((h, idx) => idx === i ? { ...h, ouvert: !h.ouvert } : h))
  }

  const updateHoraire = (i: number, key: 'ouverture' | 'fermeture', val: string) => {
    setHoraires(prev => prev.map((h, idx) => idx === i ? { ...h, [key]: val } : h))
  }

  const handleSubmit = async () => {
    if (!form.nom || !form.adresse || !form.ville || !form.telephone || !form.email || !kbis) {
      setError('Veuillez remplir tous les champs obligatoires et joindre votre Kbis.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const geoRes = await fetch(
        'https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(form.adresse + ' ' + form.ville) + '&countrycodes=fr&format=json&limit=1',
        { headers: { 'User-Agent': 'trouvetonreparateur/1.0' } }
      )
      const geoData = await geoRes.json()
      const lat = geoData[0] ? parseFloat(geoData[0].lat) : null
      const lng = geoData[0] ? parseFloat(geoData[0].lon) : null
      const fileName = Date.now() + '-' + kbis.name
      const { error: uploadError } = await supabase.storage.from('kbis').upload(fileName, kbis)
      if (uploadError) throw uploadError
      const horairesText = horaires
        .map(h => h.ouvert ? h.jour + ': ' + h.ouverture + ' - ' + h.fermeture : h.jour + ': Fermé')
        .join(' | ')
      const { error: insertError } = await supabase.from('reparateurs').insert({
        ...form,
        services: services.join(', '),
        horaires: horairesText,
          deplacement: deplacement,
        latitude: lat,
        longitude: lng,
        kbis_url: fileName,
        statut: 'pending',
        ouvert: false,
        note: null
      })
      if (insertError) throw insertError
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      setSuccess(true)
    } catch (e) {
      setError('Une erreur est survenue. Veuillez reessayer.')
    } finally {
      setLoading(false)
    }
  }
  if (success) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-xl font-medium text-gray-900 mb-2">Demande envoyée !</h1>
        <p className="text-sm text-gray-500">Votre dossier est en cours de vérification. Vous serez contacté par email sous 48h.</p>
        <a href="/" className="text-blue-600 text-sm mt-4 inline-block">Retour à l'accueil</a>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 px-6 py-5 bg-white">
        <a href="/" className="text-base font-medium">Trouve ton <span className="text-blue-600">réparateur</span></a>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-medium text-gray-900 mb-1">Inscrire ma boutique</h1>
        <p className="text-sm text-gray-400 mb-8">Votre dossier sera vérifié avant publication. Un Kbis est obligatoire.</p>

        <div className="flex flex-col gap-6">

          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-5">Informations générales</h2>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Nom de la boutique *', name: 'nom', placeholder: 'La Grande Roue' },
                { label: 'Adresse *', name: 'adresse', placeholder: '24 avenue Mathias Duval' },
                { label: 'Ville *', name: 'ville', placeholder: 'Grasse' },
                { label: 'Code postal', name: 'code_postal', placeholder: '06130' },
                { label: 'Téléphone *', name: 'telephone', placeholder: '09 86 27 89 02' },
                { label: 'Email *', name: 'email', placeholder: 'contact@boutique.fr' },
              ].map(({ label, name, placeholder }) => (
                <div key={name}>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-1.5">{label}</label>
                  <input name={name} placeholder={placeholder} value={(form as any)[name]} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-400" />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-1.5">Description</label>
                <textarea name="description" placeholder="Présentez votre boutique en quelques mots..." value={form.description} onChange={handleChange} rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-400 resize-none" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-5">Services proposés</h2>
            <div className="grid grid-cols-2 gap-3">
              {SERVICES.map(s => (
                <label key={s} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer py-1">
                  <input type="checkbox" checked={services.includes(s)} onChange={() => toggleService(s)}
                    className="w-4 h-4 accent-blue-600 flex-shrink-0" />
                  {s}
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-5">Options de service</h2>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-700">Deplacement a domicile</p>
                  <p className="text-xs text-gray-400 mt-1">Je me deplace chez le client pour reparer</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDeplacement(prev => !prev)}
                  className={"relative inline-flex h-6 w-11 items-center rounded-full transition-colors " + (deplacement ? "bg-green-600" : "bg-gray-200")}
                >
                  <span className={"inline-block h-4 w-4 transform rounded-full bg-white transition-transform " + (deplacement ? "translate-x-6" : "translate-x-1")} />
                </button>
              </div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-5">Horaires d'ouverture</h2>
            <div className="flex flex-col gap-3">
              {horaires.map((h, i) => (
                <div key={h.jour} className="grid items-center gap-3" style={{ gridTemplateColumns: '100px 1fr' }}>
                  <label className={`flex items-center gap-2 text-sm cursor-pointer ${!h.ouvert ? 'text-gray-300' : 'text-gray-700'}`}>
                    <input type="checkbox" checked={h.ouvert} onChange={() => toggleJour(i)} className="w-4 h-4 accent-blue-600" />
                    {h.jour}
                  </label>
                  <div className={`flex items-center gap-2 ${!h.ouvert ? 'opacity-30 pointer-events-none' : ''}`}>
                    <select value={h.ouverture} onChange={e => updateHoraire(i, 'ouverture', e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400">
                      {CRENEAUX.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <span className="text-gray-300 text-sm">→</span>
                    <select value={h.fermeture} onChange={e => updateHoraire(i, 'fermeture', e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400">
                      {CRENEAUX.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-5">Document Kbis</h2>
            <p className="text-xs text-gray-400 mb-3">Joignez votre extrait Kbis (PDF ou image). Ce document sera vérifié par notre équipe.</p>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setKbis(e.target.files?.[0] || null)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm" />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button onClick={handleSubmit} disabled={loading}
            className="bg-blue-600 text-white py-4 rounded-xl text-sm font-medium disabled:opacity-50 w-full">
            {loading ? 'Envoi en cours...' : 'Envoyer ma demande'}
          </button>

        </div>
      </div>
    </main>
  )
}