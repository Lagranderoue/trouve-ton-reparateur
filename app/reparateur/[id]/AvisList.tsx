'use client'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase.js'
import { IconStarFilled, IconShieldCheck, IconCircleCheck } from '@tabler/icons-react'

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

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Avis clients</h3>
      <div className="space-y-3">
        {avis.map(a => (
          <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-gray-800">{a.auteur}</span>
                {a.user_id ? (
                  <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    <IconShieldCheck size={12} /> Client vérifié
                  </span>
                ) : a.email_verifie ? (
                  <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    <IconCircleCheck size={12} /> Avis vérifié
                  </span>
                ) : null}
              </div>
              <span className="flex items-center text-yellow-400">
                {Array.from({ length: a.note }).map((_, i) => <IconStarFilled key={i} size={14} />)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{a.commentaire}</p>
            <p className="text-xs text-gray-400">{formatDate(a.created_at)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
