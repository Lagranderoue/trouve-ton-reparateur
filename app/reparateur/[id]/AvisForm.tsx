'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase.js'
import { IconStarFilled, IconX, IconCheck, IconMail, IconUserCircle } from '@tabler/icons-react'

type Etape = 'choix' | 'compte-form' | 'invite-form' | 'merci-compte' | 'merci-invite'

export default function AvisForm({ reparateurId }: { reparateurId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [open, setOpen] = useState(false)
  const [etape, setEtape] = useState<Etape>('choix')
  const [user, setUser] = useState<any>(null)

  // Champs invité
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  // Champs communs
  const [note, setNote] = useState(0)
  const [commentaire, setCommentaire] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Retour depuis /connexion avec ?avis=ouvrir : passer directement au formulaire compte
  useEffect(() => {
    if (searchParams.get('avis') !== 'ouvrir') return
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user)
        setEtape('compte-form')
        setOpen(true)
      }
    })
  }, [])

  const openChoix = () => {
    setEtape('choix')
    setNote(0)
    setCommentaire('')
    setPrenom('')
    setEmail('')
    setError('')
    setOpen(true)
  }

  const closeModal = () => setOpen(false)

  // Bouton A — compte
  const handleChoixCompte = async () => {
    const { data } = await supabase.auth.getUser()
    if (data.user) {
      setUser(data.user)
      setEtape('compte-form')
    } else {
      const dest = '/reparateur/' + reparateurId
      router.push('/connexion?redirect=' + encodeURIComponent(dest) + '&avis=ouvrir')
    }
  }

  // Bouton B — invité
  const handleChoixInvite = () => {
    setEtape('invite-form')
  }

  const handleSubmitCompte = async () => {
    if (!note || !commentaire || !user) return
    setLoading(true)
    setError('')
    const { error } = await supabase.from('avis').insert({
      reparateur_id: reparateurId,
      user_id: user.id,
      prenom: user.user_metadata?.prenom || user.email?.split('@')[0] || 'Client',
      note,
      commentaire,
      statut: 'pending',
    })
    setLoading(false)
    if (error) { setError('Une erreur est survenue.'); return }
    setEtape('merci-compte')
  }

  const handleSubmitInvite = async () => {
    if (!prenom || !email || !note || !commentaire) return
    setLoading(true)
    setError('')
    const token = crypto.randomUUID()
    const { error: insertError } = await supabase.from('avis').insert({
      reparateur_id: reparateurId,
      prenom,
      email,
      token,
      note,
      commentaire,
      statut: 'pending',
      email_verifie: false,
    })
    if (insertError) { setLoading(false); setError('Une erreur est survenue.'); return }
    await fetch('/api/envoyer-confirmation-avis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token, prenom }),
    })
    setLoading(false)
    setEtape('merci-invite')
  }

  const Etoiles = () => (
    <div className="mb-4">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Note</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(i => (
          <button key={i} type="button" onClick={() => setNote(i)}
            className={`transition-transform ${note >= i ? 'scale-110 text-yellow-400' : 'text-gray-200'}`}>
            <IconStarFilled size={26} />
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <>
      <button
        type="button"
        onClick={openChoix}
        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Laisser un avis
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 relative"
            onClick={e => e.stopPropagation()}
          >
            <button type="button" onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <IconX size={20} />
            </button>

            {/* ÉCRAN DE CHOIX — toujours affiché en premier */}
            {etape === 'choix' && (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Laisser un avis</h3>
                <p className="text-sm text-gray-500 mb-6">Comment souhaitez-vous procéder ?</p>

                <button
                  type="button"
                  onClick={handleChoixCompte}
                  className="w-full flex items-start gap-3 bg-blue-600 text-white py-3 px-4 rounded-xl mb-3 text-left"
                >
                  <IconUserCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Se connecter / Créer un compte</div>
                    <div className="text-xs opacity-80 mt-0.5">Avis publié avec badge Client vérifié</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleChoixInvite}
                  className="w-full flex items-start gap-3 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl text-left"
                >
                  <IconMail size={20} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Continuer en tant qu'invité</div>
                    <div className="text-xs text-gray-500 mt-0.5">Email requis, vérification par lien</div>
                  </div>
                </button>
              </>
            )}

            {/* FORMULAIRE COMPTE */}
            {etape === 'compte-form' && (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Votre avis</h3>
                {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}
                <Etoiles />
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
                  onClick={handleSubmitCompte}
                  disabled={loading || !note || !commentaire}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {loading ? 'Envoi...' : 'Envoyer mon avis'}
                </button>
              </>
            )}

            {/* FORMULAIRE INVITÉ */}
            {etape === 'invite-form' && (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Votre avis (invité)</h3>
                {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}
                <div className="mb-3">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Prénom <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={prenom}
                    onChange={e => setPrenom(e.target.value)}
                    placeholder="Ex : Marie"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div className="mb-3">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Un lien de confirmation vous sera envoyé. Sans clic, l'avis ne sera pas publié.</p>
                </div>
                <Etoiles />
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Commentaire <span className="text-red-500">*</span></label>
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
                  onClick={handleSubmitInvite}
                  disabled={loading || !prenom || !email || !note || !commentaire}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {loading ? 'Envoi...' : 'Envoyer mon avis'}
                </button>
                <button type="button" onClick={() => setEtape('choix')} className="w-full text-center text-xs text-gray-400 mt-3 hover:text-gray-600">
                  ← Retour
                </button>
              </>
            )}

            {/* CONFIRMATION COMPTE */}
            {etape === 'merci-compte' && (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-3">
                  <IconCheck size={24} />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">Merci pour votre avis !</h3>
                <p className="text-sm text-gray-500">Il sera publié après validation par notre équipe.</p>
              </div>
            )}

            {/* CONFIRMATION INVITÉ */}
            {etape === 'merci-invite' && (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <IconMail size={24} />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">Vérifiez votre boîte mail</h3>
                <p className="text-sm text-gray-500">Cliquez sur le lien reçu par email pour confirmer votre avis. Sans ce clic, il ne sera jamais publié.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
