'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase.js'
import { IconStarFilled, IconX, IconMail, IconUserCircle, IconCheck } from '@tabler/icons-react'

type Step = 'closed' | 'choice' | 'invite' | 'compte' | 'merci' | 'merci-invite'

export default function AvisForm({ reparateurId }: { reparateurId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [step, setStep] = useState<Step>('closed')
  const [user, setUser] = useState<any>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState(0)
  const [commentaire, setCommentaire] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setCheckingAuth(false)
      if (data.user) {
        setPrenom(data.user.user_metadata?.prenom || '')
      }
      if (searchParams.get('avis') === 'ouvrir') {
        setStep(data.user ? 'compte' : 'choice')
      }
    })
  }, [])

  const resetForm = () => {
    setPrenom(user?.user_metadata?.prenom || '')
    setEmail('')
    setNote(0)
    setCommentaire('')
    setError('')
  }

  const openModal = () => {
    resetForm()
    setStep(user ? 'compte' : 'choice')
  }

  const closeModal = () => setStep('closed')

  const handleSubmitCompte = async () => {
    if (!prenom || !note || !commentaire || !user) return
    setLoading(true)
    setError('')
    const { error } = await supabase.from('avis').insert({
      reparateur_id: reparateurId,
      auteur: prenom,
      commentaire,
      note,
      statut: 'pending',
      user_id: user.id,
      email_verifie: true,
    })
    setLoading(false)
    if (error) { setError("Une erreur est survenue, veuillez réessayer."); return }
    setStep('merci')
  }

  const handleSubmitInvite = async () => {
    if (!prenom || !email || !note || !commentaire) return
    setLoading(true)
    setError('')

    const token = crypto.randomUUID()

    const { error: insertError } = await supabase.from('avis').insert({
      reparateur_id: reparateurId,
      auteur: prenom,
      commentaire,
      note,
      statut: 'pending',
      email,
      email_verifie: false,
      token,
    })

    if (insertError) {
      setLoading(false)
      setError("Une erreur est survenue, veuillez réessayer.")
      return
    }

    await fetch('/api/envoyer-confirmation-avis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token, prenom }),
    })

    setLoading(false)
    setStep('merci-invite')
  }

  const starInput = (
    <div className="mb-4">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Note</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(i => (
          <button key={i} onClick={() => setNote(i)} className={`transition-transform ${note >= i ? 'scale-110 text-yellow-400' : 'text-gray-200'}`}>
            <IconStarFilled size={26} />
          </button>
        ))}
      </div>
    </div>
  )

  if (checkingAuth) return null

  return (
    <>
      <button
        onClick={openModal}
        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Laisser un avis
      </button>

      {step !== 'closed' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative" onClick={e => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <IconX size={20} />
            </button>

            {step === 'choice' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Laisser un avis</h3>
                <p className="text-sm text-gray-500 mb-6">Connectez-vous ou continuez en tant qu'invité.</p>
                <button
                  onClick={() => router.push('/connexion?redirect=' + encodeURIComponent('/reparateur/' + reparateurId))}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-sm font-medium mb-3"
                >
                  <IconUserCircle size={18} />
                  Se connecter / Créer un compte
                </button>
                <button
                  onClick={() => { resetForm(); setStep('invite') }}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-medium"
                >
                  <IconMail size={18} />
                  Continuer en tant qu'invité
                </button>
              </div>
            )}

            {(step === 'invite' || step === 'compte') && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Votre avis</h3>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>
                )}

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

                {step === 'invite' && (
                  <div className="mb-4">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Votre email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="vous@exemple.com"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">Un email de confirmation vous sera envoyé pour valider votre avis.</p>
                  </div>
                )}

                {starInput}

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
                  onClick={step === 'compte' ? handleSubmitCompte : handleSubmitInvite}
                  disabled={
                    loading || !prenom || !note || !commentaire || (step === 'invite' && !email)
                  }
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {loading ? 'Envoi...' : 'Envoyer mon avis'}
                </button>
              </div>
            )}

            {step === 'merci' && (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-3">
                  <IconCheck size={24} />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">Merci pour votre avis !</h3>
                <p className="text-sm text-gray-500">Il sera publié après validation par notre équipe.</p>
              </div>
            )}

            {step === 'merci-invite' && (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <IconMail size={24} />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">Vérifiez votre boîte mail</h3>
                <p className="text-sm text-gray-500">Cliquez sur le lien reçu par email pour confirmer votre avis. Il sera ensuite publié après validation par notre équipe.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
