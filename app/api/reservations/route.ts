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

  let query = supabase.from('reservations').select('*').order('date', { ascending: true }).order('heure', { ascending: true })
  if (reparateurId) query = query.eq('reparateur_id', reparateurId)
  if (clientId) query = query.eq('client_id', clientId)

  const { data } = await query
  if (!data || data.length === 0) return NextResponse.json({ reservations: [] })

  // Récupérer les noms des réparateurs
  const repIds = [...new Set(data.map((r: any) => r.reparateur_id))]
  const { data: reps } = await supabase.from('reparateurs').select('id, nom, adresse, ville, telephone').in('id', repIds)
  const repsMap: Record<string, any> = {}
  ;(reps || []).forEach((r: any) => { repsMap[r.id] = r })

  // Récupérer les infos clients
  const clientIds = [...new Set(data.filter((r: any) => r.client_id).map((r: any) => r.client_id))]
  const { data: clients } = await supabase.from('clients').select('id, prenom, nom, telephone').in('id', clientIds)
  const clientsMap: Record<string, any> = {}
  ;(clients || []).forEach((c: any) => { clientsMap[c.id] = c })

  const reservations = data.map((r: any) => {
    const rep = repsMap[r.reparateur_id]
    const client = clientsMap[r.client_id]
    const clientNomComplet = client ? [client.prenom, client.nom].filter(Boolean).join(' ') : null
    return {
      ...r,
      reparateur_nom: rep?.nom || null,
      reparateur_adresse: rep?.adresse || null,
      reparateur_ville: rep?.ville || null,
      reparateur_telephone: rep?.telephone || null,
      client_nom: clientNomComplet || r.client_email,
      client_telephone: client?.telephone || r.client_telephone || null,
    }
  })
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
