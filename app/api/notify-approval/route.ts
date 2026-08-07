import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { id } = await req.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Récupérer les infos du réparateur
  const { data: rep } = await supabase
    .from('reparateurs')
    .select('email, nom')
    .eq('id', id)
    .single()

  if (!rep?.email) return NextResponse.json({ ok: false })

  // Générer un lien de création de mot de passe via Supabase
  const { data: linkData, error } = await supabase.auth.admin.generateLink({
    type: 'invite',
    email: rep.email,
    options: {
      redirectTo: 'https://trouvetonreparateur.com/espace-reparateur/dashboard',
      data: { role: 'reparateur', reparateur_id: id }
    }
  })

  if (error || !linkData) {
    console.error('Erreur generateLink:', error)
    return NextResponse.json({ ok: false, error: error?.message })
  }

  const lienCreation = linkData.properties?.action_link

  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: 'Trouve ton réparateur <onboarding@resend.dev>',
    to: rep.email,
    subject: 'Votre boutique est approuvée — Créez votre mot de passe',
    html: `
      <div style="font-family:DM Sans,Arial,sans-serif;max-width:560px;margin:0 auto;background:#f4f6fb;padding:2rem;">
        <div style="background:#fff;border-radius:16px;overflow:hidden;">
          <div style="background:#0f2d6b;padding:1.25rem 1.5rem;">
            <div style="font-size:16px;font-weight:700;color:#fff;">Trouve ton réparateur</div>
          </div>
          <div style="padding:1.5rem;">
            <h2 style="font-size:20px;font-weight:700;color:#111;margin-bottom:8px;">Félicitations ${rep.nom} !</h2>
            <p style="font-size:14px;color:#555;line-height:1.7;margin-bottom:1.25rem;">
              Votre boutique a été <strong>validée</strong> et est maintenant visible sur Trouve ton réparateur.<br><br>
              Pour accéder à votre espace de gestion, cliquez sur le bouton ci-dessous pour créer votre mot de passe.
            </p>
            <a href="${lienCreation}" style="display:inline-block;background:#0f2d6b;color:#fff;text-decoration:none;padding:13px 28px;border-radius:10px;font-size:14px;font-weight:600;margin-bottom:1.25rem;">
              Créer mon mot de passe →
            </a>
            <p style="font-size:12px;color:#888;line-height:1.6;">
              Ce lien est valable 24h. Si vous ne l'avez pas demandé, ignorez cet email.<br>
              Une fois connecté, vous pourrez gérer vos réservations, messages et avis depuis votre tableau de bord.
            </p>
          </div>
          <div style="background:#f4f6fb;padding:1rem 1.5rem;border-top:1px solid #e8eaf0;">
            <div style="font-size:11px;color:#bbb;">Trouve ton réparateur — trouvetonreparateur.com</div>
          </div>
        </div>
      </div>
    `
  })

  return NextResponse.json({ ok: true })
}
