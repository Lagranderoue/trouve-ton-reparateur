import { Resend } from 'resend'
import { NextResponse } from 'next/server'


export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const body = await req.json()
  const { nom, adresse, ville, telephone, email, services, horaires, description } = body

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'lagranderouecontact@gmail.com',
    subject: 'Nouvelle inscription - ' + nom,
    html: '<h2>Nouvelle demande d inscription</h2>' +
      '<p><strong>Boutique :</strong> ' + nom + '</p>' +
      '<p><strong>Adresse :</strong> ' + adresse + ', ' + ville + '</p>' +
      '<p><strong>Telephone :</strong> ' + telephone + '</p>' +
      '<p><strong>Email :</strong> ' + email + '</p>' +
      '<p><strong>Services :</strong> ' + services + '</p>' +
      '<p><strong>Horaires :</strong> ' + horaires + '</p>' +
      '<p><strong>Description :</strong> ' + description + '</p>' +
      '<br><p>Connectez-vous a Supabase pour valider ou rejeter cette inscription.</p>'
  })

  return NextResponse.json({ ok: true })
}
