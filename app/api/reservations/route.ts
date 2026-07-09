import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const reparateurId = searchParams.get('reparateur_id')
  const clientId = searchParams.get('client_id')
  if (!reparateurId && !clientId) return NextResponse.json({ reservations: [] })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let query = supabase.from('reservations').select('*, reparateurs(nom, adresse, ville, telephone)').order('date', { ascending: true }).order('heure', { ascending: true })
  if (reparateurId) query = query.eq('reparateur_id', reparateurId)
  if (clientId) query = query.eq('client_id', clientId)

  const { data } = await query
  const reservations = (data || []).map((r: any) => ({
    ...r,
    reparateur_nom: r.reparateurs?.nom,
    reparateur_adresse: r.reparateurs?.adresse,
    reparateur_ville: r.reparateurs?.ville,
    reparateur_telephone: r.reparateurs?.telephone,
  }))
  return NextResponse.json({ reservations })
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { id, statut, date, heure, message_reparateur } = body
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const updateData: any = {}
  if (statut) updateData.statut = statut
  if (date) updateData.date = date
  if (heure) updateData.heure = heure
  if (message_reparateur !== undefined) updateData.message_reparateur = message_reparateur

  const { error } = await supabase.from('reservations').update(updateData).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Envoyer email si statut change
  if (statut && (statut === 'approved' || statut === 'rejected' || statut === 'cancelled')) {
    const { data: resa } = await supabase
      .from('reservations')
      .select('*, reparateurs(nom, adresse, ville)')
      .eq('id', id)
      .single()

    if (resa?.client_email) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const reparateurNom = resa.reparateurs?.nom || 'Le réparateur'
      const adresse = resa.reparateurs ? resa.reparateurs.adresse + ', ' + resa.reparateurs.ville : ''

      if (statut === 'approved') {
        await resend.emails.send({
          from: 'Trouve ton réparateur <noreply@trouvetonreparateur.com>',
          to: resa.client_email,
          subject: 'Réservation confirmée — ' + reparateurNom,
          html: `
            <div style="font-family:DM Sans,Arial,sans-serif;max-width:560px;margin:0 auto;background:#f4f6fb;padding:2rem;">
              <div style="background:#fff;border-radius:16px;overflow:hidden;">
                <div style="background:#0f2d6b;padding:1.25rem 1.5rem;">
                  <div style="font-size:16px;font-weight:700;color:#fff;">Trouve ton réparateur</div>
                </div>
                <div style="padding:1.5rem;">
                  <h2 style="font-size:18px;font-weight:700;color:#111;margin-bottom:8px;">Réservation confirmée ✓</h2>
                  <p style="font-size:13px;color:#555;line-height:1.6;margin-bottom:1rem;">
                    <strong>${reparateurNom}</strong> a accepté votre réservation.<br><br>
                    <strong>Réparation :</strong> ${resa.type_reparation}<br>
                    <strong>Date :</strong> ${resa.date} à ${resa.heure}<br>
                    ${adresse ? '<strong>Adresse :</strong> ' + adresse : ''}
                    ${message_reparateur ? '<br><strong>Message du réparateur :</strong> ' + message_reparateur : ''}
                  </p>
                  <a href="https://trouvetonreparateur.com/mon-compte?tab=reservations" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:11px 24px;border-radius:8px;font-size:13px;font-weight:600;">Voir ma réservation</a>
                </div>
              </div>
            </div>`
        })
      } else if (statut === 'rejected') {
        await resend.emails.send({
          from: 'Trouve ton réparateur <noreply@trouvetonreparateur.com>',
          to: resa.client_email,
          subject: 'Réservation refusée — ' + reparateurNom,
          html: `
            <div style="font-family:DM Sans,Arial,sans-serif;max-width:560px;margin:0 auto;background:#f4f6fb;padding:2rem;">
              <div style="background:#fff;border-radius:16px;overflow:hidden;">
                <div style="background:#0f2d6b;padding:1.25rem 1.5rem;">
                  <div style="font-size:16px;font-weight:700;color:#fff;">Trouve ton réparateur</div>
                </div>
                <div style="padding:1.5rem;">
                  <h2 style="font-size:18px;font-weight:700;color:#111;margin-bottom:8px;">Réservation non disponible</h2>
                  <p style="font-size:13px;color:#555;line-height:1.6;margin-bottom:1rem;">
                    Malheureusement, <strong>${reparateurNom}</strong> n'est pas disponible pour votre créneau.<br><br>
                    ${message_reparateur ? '<strong>Message :</strong> ' + message_reparateur + '<br><br>' : ''}
                    Vous pouvez essayer un autre réparateur ou un autre créneau.
                  </p>
                  <a href="https://trouvetonreparateur.com" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:11px 24px;border-radius:8px;font-size:13px;font-weight:600;">Trouver un autre réparateur</a>
                </div>
              </div>
            </div>`
        })
      }
    }
  }

  return NextResponse.json({ ok: true })
}
