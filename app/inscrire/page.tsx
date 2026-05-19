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
      setError('Veuillez remplir tous les champs obligatoires et joindrif (success) return (
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
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between bg-white">
        <a href="/" className="text-base font-medium">Trouve ton <span className="text-blue-600">réparateur</span></a>
      </nav>
      <div className="max-w-xl mx-auto px-6 py-8">
        <h1 className="text-xl font-medium text-gray-900 mb-1">Inscrire ma boutique</h1>
        <p className="text-sm text-gray-400 mb-6">Votre dossier sera vérifié avant publication. Un Kbis est obligatoire.</p>
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
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">{label}</label>
              <input name={name} placeholder={placeholder} value={(form as any)[name]} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Services proposés</label>
            <textarea name="services" placeholder="Écran, batterie, connecteur..." value={form.services} onChange={handleChange} rows={2}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Horaires</label>
            <input name="horaires" placeholder="Lun-Sam 10h-19h" value={form.horaires} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Description</label>
            <textarea name="description" placeholder="Présentez votre boutique..." value={form.description} onChange={handleChange} rows={3}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Kbis (PDF ou image) *</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setKbis(e.target.files?.[0] || null)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button onClick={handleSubmit} disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-lg text-sm font-medium disabled:opacity-50">
            {loading ? 'Envoi en cours...' : 'Envoyer ma demande'}
          </button>
        </div>
      </div>
    </main>
  )
}