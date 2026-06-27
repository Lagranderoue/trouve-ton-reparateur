import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const reparateurId = searchParams.get('id')
  if (!reparateurId) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const debutMois = new Date()
  debutMois.setDate(1)
  debutMois.setHours(0, 0, 0, 0)

  const { count: vuesMois } = await supabase
    .from('vues')
    .select('*', { count: 'exact', head: true })
    .eq('reparateur_id', reparateurId)
    .gte('created_at', debutMois.toISOString())

  const { count: nbAvis } = await supabase
    .from('avis')
    .select('*', { count: 'exact', head: true })
    .eq('reparateur_id', reparateurId)
    .eq('statut', 'approved')

  return NextResponse.json({ vuesMois: vuesMois || 0, nbAvis: nbAvis || 0 })
}
