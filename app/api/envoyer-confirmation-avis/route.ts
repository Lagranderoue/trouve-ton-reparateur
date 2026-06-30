import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { email, token, prenom } = await req.json()
  if (!email || !token) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

  const lien = 'https://trouvetonreparateur.com/api/valider-avis?token=' + encodeURIComponent(token)

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Confirmez votre avis — Trouve ton réparateur',
    html:
      '<p>Bonjour ' + (prenom || '') + ',</p>' +
      '<p>Merci pour votre avis ! Cliquez sur le lien ci-dessous pour le valider :</p>' +
      '<p><a href="' + lien + '" style="color:#2563eb;font-weight:600">Confirmer mon avis</a></p>' +
      '<p style="color:#888;font-size:12px">Sans ce clic, votre avis ne sera pas publié.</p>'
  })

  return NextResponse.json({ ok: true })
}
