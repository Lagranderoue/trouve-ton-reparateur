'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Inscrire() {
  const [form, setForm] = useState({
    nom: '', adresse: '', ville: '', code_postal: '', telephone: '',
    email: '', services: '', horaires: '', description: ''
  })
  const [kbis, setKbis] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
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
      const { error: insertError } = await supabase.from('reparateurs').insert({
        ...form, latitude: lat, longitude: lng, kbis_url: fileName, statut: 'pending', ouvert: false, note: null
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
        <div className="text-5xl mb-4">OK</div>
        <h1 className="text-xl font-medium text-gray-900 mb-2">Demande envoyee !</h1>
        <p className="text-sm text-gray-500">Votre dossier est en cours de verification. Vous serez contacte par email sous 48h.</p>
        <a href="/" className="text-blue-600 text-sm mt-4 inline-block">Retour</a>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 px-6 py-4 bg-white">
        <a href="/" className="text-base font-medium">Trouve ton <span className="text-blue-600">reparateur</span></a>
      </nav>
      <div className="max-w-xl mx-auto px-6 py-8">
        <h1 className="text-xl font-medium text-gray-900 mb-1">Inscrire ma boutique</h1>
        <p className="text-sm text-gray-400 mb-6">Votre dossier sera verifie avant publication. Un Kbis est obligatoire.</p>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Nom *</label>
            <input name="nom" placeholder="La Grande Roue" value={form.nom} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Adresse *</label>
            <input name="adresse" placeholder="24 avenue Mathias Duval" value={form.adresse} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Ville *</label>
            <input name="ville" placeholder="Grasse" value={form.ville} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Code postal</label>
            <input name="code_postal" placeholder="06130" value={form.code_postal} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Telephone *</label>
            <input name="telephone" placeholder="09 86 27 89 02" value={form.telephone} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Email *</label>
            <input name="email" placeholder="contact@boutique.fr" value={form.email} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Services</label>
            <textarea name="services" placeholder="Ecran, batterie..." value={form.services} onChange={handleChange} rows={2} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Horaires</label>
            <input name="horaires" placeholder="Lun-Sam 10h-19h" value={form.horaires} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Description</label>
            <textarea name="description" placeholder="Presentez votre boutique..." value={form.description} onChange={handleChange} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Kbis (PDF ou image) *</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setKbis(e.target.files?.[0] || null)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 text-white py-3 rounded-lg text-sm font-medium disabled:opacity-50">
            {loading ? 'Envoi...' : 'Envoyer ma demande'}
          </button>
        </div>
      </div>
    </main>
  )
}
