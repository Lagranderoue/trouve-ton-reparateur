'use client'
import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AvisForm({ reparateurId }: { reparateurId: string }) {
  const [prenom, setPrenom] = useState('')
  const [note, setNote] = useState(0)
  const [commentaire, setCommentaire] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!prenom || !note || !commentaire) return
    setLoading(true)
    await supabase.from('avis').insert({
      reparateur_id: reparateurId,
      prenom,
      note,
      commentaire,
      statut: 'pending'
    })
    setLoading(false)
    setSuccess(true)
    setPrenom('')
    setNote(0)
    setCommentaire('')
  }

  if (success) return (
    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">
      ✅ Merci pour votre avis ! Il sera publié après validation.
    </div>
  )

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Votre prénom</label>
        <input
          type="text"
          value={prenom}
          onChange={e => setPrenom(e.target.value)}
          placeholder="Ex: Marie"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
        />
      </div>
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Note</label>
        <div className="flex gap-2">
          {[1,2,3,4,5].map(i => (
            <button key={i} onClick={() => setNote(i)} className={`text-2xl transition-transform ${note >= i ? 'scale-110' : 'opacity-30'}`}>
              ⭐
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Commentaire</label>
        <textarea
          value={commentaire}
          onChange={e => setCommentaire(e.target.value)}
          placeholder="Décrivez votre expérience..."
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none resize-none"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading || !prenom || !note || !commentaire}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
      >
        {loading ? 'Envoi...' : 'Envoyer mon avis'}
      </button>
    </div>
  )
}
