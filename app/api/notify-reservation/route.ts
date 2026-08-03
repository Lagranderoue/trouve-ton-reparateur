import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { reparateurId, reparateurNom, clientEmail, typeReparation, marque, modele, date, heure, note } = await req.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Récupérer l'email du réparateur
  const { data: rep } = await supabase
    .from('reparateurs')
    .select('email')
    .eq('id', reparateurId)
    .single()

  if (!rep?.email) return NextResponse.json({ ok: false })

  // Récupérer les infos client via auth
  const { data: authUsers } = await supabase.auth.admin.listUsers()
  const authUser = authUsers?.users?.find((u: any) => u.email === clientEmail)
  
  let clientNom = clientEmail
  let clientTel = ''

  if (authUser) {
    const { data: client } = await supabase
      .from('clients')
      .select('prenom, nom, telephone')
      .eq('id', authUser.id)
      .single()
    if (client) {
      clientNom = [client.prenom, client.nom].filter(Boolean).join(' ') || clientEmail
      clientTel = client.telephone || ''
    }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: 'Trouve ton réparateur <onboarding@resend.dev>',
    to: rep.email,
    subject: 'Nouvelle réservation — ' + clientNom,
    html: `
      <div style="font-family:DM Sans,Arial,sans-serif;max-width:560px;margin:0 auto;background:#f4f6fb;padding:2rem;">
        <div style="background:#fff;border-radius:16px;overflow:hidden;">
          <div style="background:#0f2d6b;padding:1.25rem 1.5rem;">
            <div style="font-size:16px;font-weight:700;color:#fff;">Trouve ton réparateur</div>
          </div>
          <div style="padding:1.5rem;">
            <h2 style="font-size:18px;font-weight:700;color:#111;margin-bottom:12px;">Nouvelle réservation !</h2>
            <p style="font-size:13px;color:#555;line-height:1.8;margin-bottom:1rem;">
              <strong>${clientNom}</strong> souhaite réserver :<br>
              ${marque || modele ? `📱 <strong>${[marque, modele].filter(Boolean).join(' ')}</strong><br>` : ''}
              🔧 <strong>${typeReparation}</strong><br>
              📅 <strong>${date} à ${heure}</strong><br>
              ${clientTel ? `📞 <strong>${clientTel}</strong><br>` : ''}
              📧 ${clientEmail}
              ${note ? `<br>💬 <em>${note}</em>` : ''}
            </p>
            <a href="https://trouvetonreparateur.com/espace-reparateur/dashboard?tab=reservations" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:11px 24px;border-radius:8px;font-size:13px;font-weight:600;">Gérer la réservation →</a>
          </div>
        </div>
      </div>`
  })

  return NextResponse.json({ ok: true })
}
