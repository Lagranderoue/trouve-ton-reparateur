'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase.js'
import { IconStarFilled } from '@tabler/icons-react'

export default function AvisForm({ reparateurId }: { reparateurId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [user, setUser] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [note, setNote] = useState(0)
  const [commentaire, setCommentaire] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Si on revient de /connexion avec ?avis=ouvrir, on ouvre directement le formulaire.
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user && searchParams.get('avis') === 'ouvrir') {
        setShowForm(true)
      }
    })
  }, [])

  const handleClick = async () => {
    const { data } = await supabase.auth.getUser()
    if (!data.user) {
      router.push('/connexion?redirect=' + encodeURIComponent('/reparateur/' + reparateurId))
      return
    }
    setUser(data.user)
    setShowForm(true)
  }

  const handleSubmit = async () => {
    if (!note || !commentaire || !user) return
    setLoading(true)
    setError('')

    const auteur = user.user_metadata?.prenom || user.email?.split('@')[0] || 'Client'

    const { error } = await supabase.from('avis').insert({
      reparateur_id: reparateurId,
      user_id: user.id,
      auteur,
      note,
      commentaire,
      statut: 'pending',
    })

    setLoading(false)
    if (error) { setError('Une erreur est survenue, veuillez réessayer.'); return }
    setSuccess(true)
    setNote(0)
    setCommentaire('')
  }

  if (success) {
    return (
      <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">
        Merci pour votre avis ! Il sera publié après validation par notre équipe.
      </div>
    )
  }

  if (!showForm) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Laisser un avis
      </button>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-2">
      {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}

      <div className="mb-4">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Note</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <button key={i} type="button" onClick={() => setNote(i)} className={`transition-transform ${note >= i ? 'scale-110 text-yellow-400' : 'text-gray-200'}`}>
              <IconStarFilled size={26} />
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
        type="button"
        onClick={handleSubmit}
        disabled={loading || !note || !commentaire}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
      >
        {loading ? 'Envoi...' : 'Envoyer mon avis'}
      </button>
    </div>
  )
}
