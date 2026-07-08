import { createClient } from '@supabase/supabase-js'
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
  return NextResponse.json({ reservations: data || [] })
}

export async function PATCH(request: NextRequest) {
  const { id, statut } = await request.json()
  if (!id || !statut) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase.from('reservations').update({ statut }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
