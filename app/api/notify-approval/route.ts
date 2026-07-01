import { Resend } from 'resend'
import { NextResponse } from 'next/server'


export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { email, nom } = await req.json()

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Votre boutique est approuvée sur Trouve ton réparateur !',
    text: `Bonjour ${nom},\n\nBonne nouvelle ! Votre boutique a été validée et est maintenant visible sur Trouve ton réparateur.\n\nVos clients peuvent désormais vous trouver sur : https://trouvetonreparateur.com\n\nBonne continuation !\n\nL'équipe Trouve ton réparateur`
  })

  return NextResponse.json({ ok: true })
}
