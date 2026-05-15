'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/resultats?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleGeolocate = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords
      router.push(`/resultats?lat=${latitude}&lng=${longitude}`)
    })
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="text-base font-medium">
          Trouve ton <span className="text-blue-600">réparateur</span>
        </div>
        <button
          onClick={() => router.push('/inscrire')}
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Inscrire ma boutique
        </button>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-medium text-gray-900 mb-3 leading-tight">
          Votre téléphone est cassé ?<br />
          Trouvez un réparateur en urgence.
        </h1>
        <p className="text-gray-500 mb-8 text-sm">
          Entrez votre ville ou code postal — on trouve le pro le plus proche.
        </p>

        <div className="flex w-full max-w-md border border-gray-200 rounded-xl overflow-hidden mb-3">
          <input
            type="text"
            placeholder="Ville ou code postal..."
            className="flex-1 px-4 py-3 text-sm outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-5 text-sm font-medium"
          >
            Rechercher
          </button>
        </div>

        <button
          onClick={handleGeolocate}
          className="text-sm text-gray-400 flex items-center gap-1 mb-12"
        >
          📍 Utiliser ma position actuelle
        </button>

        <div className="flex gap-10 border-t border-gray-100 pt-8">
          <div className="text-center">
            <div className="text-xl font-medium">1 200+</div>
            <div className="text-xs text-gray-400">Réparateurs</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-medium">4.8 / 5</div>
            <div className="text-xs text-gray-400">Note moyenne</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-medium">Gratuit</div>
            <div className="text-xs text-gray-400">Pour le client</div>
          </div>
        </div>
      </div>
    </main>
  )
}
