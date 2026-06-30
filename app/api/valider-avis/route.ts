import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.redirect(new URL('/', req.nextUrl.origin))

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('avis')
    .update({ email_verifie: true, token: null })
    .eq('token', token)
    .select('reparateur_id')
    .single()

  if (error || !data) {
    return NextResponse.redirect(new URL('/?avis=erreur', req.nextUrl.origin))
  }

  return NextResponse.redirect(
    new URL('/reparateur/' + data.reparateur_id + '?avis=confirme', req.nextUrl.origin)
  )
}
