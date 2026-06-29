'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase.js'
import { IconStarFilled, IconX, IconCheck } from '@tabler/icons-react'

export default function AvisForm({ reparateurId }: { reparateurId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [user, setUser] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [note, setNote] = useState(0)
  const [commentaire, setCommentaire] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Si on revient de /connexion avec ?avis=ouvrir et qu'on est bien connecté, on ouvre la modal.
  useEffect(() => {
    if (searchParams.get('avis') !== 'ouvrir') return
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user)
        setShowModal(true)
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
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSuccess(false)
    setNote(0)
    setCommentaire('')
    setError('')
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
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Laisser un avis
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative" onClick={e => e.stopPropagation()}>
            <button type="button" onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <IconX size={20} />
            </button>

            {success ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-3">
                  <IconCheck size={24} />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">Merci pour votre avis !</h3>
                <p className="text-sm text-gray-500">Il sera publié après validation par notre équipe.</p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Votre avis</h3>

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
            )}
          </div>
        </div>
      )}
    </>
  )
}
