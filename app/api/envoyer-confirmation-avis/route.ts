import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { email, token, prenom } = await req.json()
  if (!email || !token) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

  const lienValidation = new URL('/api/valider-avis?token=' + encodeURIComponent(token), req.nextUrl.origin).toString()

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Confirmez votre avis - Trouve ton réparateur',
    html:
      '<h2>Confirmez votre avis</h2>' +
      '<p>Bonjour ' + (prenom || '') + ',</p>' +
      '<p>Merci d\'avoir laissé un avis sur Trouve ton réparateur. Pour le valider, cliquez sur le lien ci-dessous :</p>' +
      '<p><a href="' + lienValidation + '">Confirmer mon avis</a></p>' +
      '<p>Si vous n\'êtes pas à l\'origine de cette demande, ignorez cet email.</p>'
  })

  return NextResponse.json({ ok: true })
}
