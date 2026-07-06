import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ existe: false })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data } = await supabase
    .from('reparateurs')
    .select('id, statut')
    .eq('email', email)
    .single()

  if (!data) return NextResponse.json({ existe: false })
  return NextResponse.json({ existe: true, statut: data.statut })
}
