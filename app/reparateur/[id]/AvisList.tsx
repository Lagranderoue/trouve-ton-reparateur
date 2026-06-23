'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AvisList({ reparateurId }: { reparateurId: string }) {
  const [avis, setAvis] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('avis')
      .select('*')
      .eq('reparateur_id', reparateurId)
      .eq('statut', 'approved')
      .order('created_at', { ascending: false })
      .then(({ data }) => setAvis(data || []))
  }, [reparateurId])

  if (avis.length === 0) return null

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Avis clients</h3>
      <div className="space-y-3">
        {avis.map(a => (
          <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm text-gray-800">{a.prenom}</span>
              <span className="text-sm">{'⭐'.repeat(a.note)}</span>
            </div>
            <p className="text-sm text-gray-600">{a.commentaire}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
