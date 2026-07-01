import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id')
  if (!userId) return NextResponse.json({ avis: [] })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: avisData } = await supabase
    .from('avis')
    .select('*, reparateurs(nom)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const avis = (avisData || []).map((a: any) => ({
    ...a,
    reparateur_nom: a.reparateurs?.nom || 'Réparateur'
  }))

  return NextResponse.json({ avis })
}
