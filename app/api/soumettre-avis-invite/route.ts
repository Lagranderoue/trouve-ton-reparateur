import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { prenom, email, token, note, commentaire, reparateur_id } = await req.json()

  if (!prenom || !email || !token || !note || !commentaire || !reparateur_id) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  // Insert via service role pour bypasser RLS (évite le problème de session auth en cours)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error: insertError } = await supabase.from('avis').insert({
    reparateur_id,
    prenom,
    email,
    token,
    note,
    commentaire,
    statut: 'pending',
    email_verifie: false,
  })

  if (insertError) {
    return NextResponse.json({ error: 'Erreur insert : ' + insertError.message }, { status: 500 })
  }

  // Envoi de l'email de confirmation
  const resend = new Resend(process.env.RESEND_API_KEY)
  const lien = 'https://trouvetonreparateur.com/api/valider-avis?token=' + encodeURIComponent(token)

  const { error: emailError } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Confirmez votre avis — Trouve ton réparateur',
    html:
      '<p>Bonjour ' + prenom + ',</p>' +
      '<p>Merci pour votre avis ! Cliquez sur le lien ci-dessous pour le valider :</p>' +
      '<p><a href="' + lien + '" style="color:#2563eb;font-weight:600">Confirmer mon avis</a></p>' +
      '<p style="color:#888;font-size:12px">Sans ce clic, votre avis ne sera pas publié.</p>'
  })

  if (emailError) {
    // L'avis est inséré mais l'email a échoué — on le signale clairement
    return NextResponse.json({ error: 'Avis enregistré mais email non envoyé : ' + emailError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
