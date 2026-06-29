'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { IconCheck } from '@tabler/icons-react'

function AvisBannerContent() {
  const searchParams = useSearchParams()
  if (searchParams.get('avis') !== 'verifie') return null

  return (
    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-center gap-2">
      <IconCheck size={16} /> Votre avis a bien été confirmé, il sera publié après validation par notre équipe.
    </div>
  )
}

export default function AvisBanner() {
  return (
    <Suspense fallback={null}>
      <AvisBannerContent />
    </Suspense>
  )
}
