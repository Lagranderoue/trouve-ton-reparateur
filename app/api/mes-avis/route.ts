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

  const { data: avisData, error } = await supabase
    .from('avis')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false, nullsFirst: false })

  if (error || !avisData) return NextResponse.json({ avis: [] })

  // Récupérer les noms des réparateurs
  const reparateurIds = [...new Set(avisData.map((a: any) => a.reparateur_id))]
  const { data: reparateurs } = await supabase
    .from('reparateurs')
    .select('id, nom')
    .in('id', reparateurIds)

  const reparateursMap: Record<string, string> = {}
  ;(reparateurs || []).forEach((r: any) => { reparateursMap[r.id] = r.nom })

  const avis = avisData.map((a: any) => ({
    ...a,
    reparateur_nom: reparateursMap[a.reparateur_id] || 'Réparateur'
  }))

  return NextResponse.json({ avis })
}
