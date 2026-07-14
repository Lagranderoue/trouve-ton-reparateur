import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const reservationId = searchParams.get('reservation_id')
  if (!reservationId) return NextResponse.json({ messages: [] })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('reservation_id', reservationId)
    .order('created_at', { ascending: true })

  return NextResponse.json({ messages: data || [] })
}

export async function POST(request: NextRequest) {
  const { reservation_id, sender_id, sender_type, contenu } = await request.json()
  if (!reservation_id || !sender_id || !sender_type || !contenu) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase.from('messages').insert({
    reservation_id,
    sender_id,
    sender_type,
    contenu,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: data })
}

export async function PATCH(request: NextRequest) {
  const { reservation_id, reader_id } = await request.json()
  if (!reservation_id || !reader_id) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  await supabase
    .from('messages')
    .update({ lu: true })
    .eq('reservation_id', reservation_id)
    .neq('sender_id', reader_id)

  return NextResponse.json({ ok: true })
}
