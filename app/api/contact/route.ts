import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { prenom, email, sujet, message } = await req.json()
  if (!prenom || !email || !sujet || !message) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }
  await resend.emails.send({
    from: 'Trouve ton réparateur <noreply@trouvetonreparateur.com>',
    to: 'lagranderouecontact@gmail.com',
    subject: '[Contact] ' + sujet,
    html: `
      <div style="font-family:DM Sans,Arial,sans-serif;max-width:560px;margin:0 auto;background:#f4f6fb;padding:2rem;">
        <div style="background:#fff;border-radius:16px;overflow:hidden;">
          <div style="background:#0f2d6b;padding:1.25rem 1.5rem;">
            <div style="font-size:16px;font-weight:700;color:#fff;">Trouve ton réparateur — Nouveau message</div>
          </div>
          <div style="padding:1.5rem;">
            <p style="font-size:13px;color:#555;line-height:1.6;margin-bottom:1rem;">
              <strong>De :</strong> ${prenom} (${email})<br>
              <strong>Sujet :</strong> ${sujet}
            </p>
            <div style="background:#f8f9fc;border-radius:8px;padding:14px;font-size:13px;color:#555;line-height:1.7;">
              ${message}
            </div>
            <p style="font-size:12px;color:#888;margin-top:1rem;">Répondre à : <a href="mailto:${email}" style="color:#2563eb;">${email}</a></p>
          </div>
        </div>
      </div>`
  })
  return NextResponse.json({ ok: true })
}
