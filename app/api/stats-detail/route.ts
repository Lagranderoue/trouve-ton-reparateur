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

  const debutMoisPrec = new Date()
  debutMoisPrec.setMonth(debutMoisPrec.getMonth() - 1)
  debutMoisPrec.setDate(1)
  debutMoisPrec.setHours(0, 0, 0, 0)

  const finMoisPrec = new Date()
  finMoisPrec.setDate(0)
  finMoisPrec.setHours(23, 59, 59, 999)

  const { count: vuesMois } = await supabase
    .from('vues')
    .select('*', { count: 'exact', head: true })
    .eq('reparateur_id', reparateurId)
    .gte('created_at', debutMois.toISOString())

  const { count: vuesMoisPrecedent } = await supabase
    .from('vues')
    .select('*', { count: 'exact', head: true })
    .eq('reparateur_id', reparateurId)
    .gte('created_at', debutMoisPrec.toISOString())
    .lte('created_at', finMoisPrec.toISOString())

  const { data: vuesParJour } = await supabase
    .from('vues')
    .select('created_at')
    .eq('reparateur_id', reparateurId)
    .gte('created_at', debutMois.toISOString())
    .order('created_at', { ascending: true })

  return NextResponse.json({
    vuesMois: vuesMois || 0,
    vuesMoisPrecedent: vuesMoisPrecedent || 0,
    vuesParJour: vuesParJour || []
  })
}
