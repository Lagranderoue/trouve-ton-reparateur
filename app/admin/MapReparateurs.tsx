'use client'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix icônes Leaflet
const icon = L.divIcon({
  className: '',
  html: `<div style="
    width:32px;height:32px;border-radius:50%;
    background:#2563eb;border:3px solid #fff;
    box-shadow:0 2px 8px rgba(0,0,0,0.3);
    display:flex;align-items:center;justify-content:center;
    font-size:14px;color:#fff;
  ">🔧</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -20],
})

const iconSelf = L.divIcon({
  className: '',
  html: `<div style="
    width:38px;height:38px;border-radius:50%;
    background:#0f2d6b;border:3px solid #60a5fa;
    box-shadow:0 3px 12px rgba(0,0,0,0.4);
    display:flex;align-items:center;justify-content:center;
    font-size:16px;color:#fff;
  ">🔧</div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -22],
})

export default function MapReparateurs() {
  const [reparateurs, setReparateurs] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data } = await supabase
        .from('reparateurs')
        .select('id, nom, ville, note, latitude, longitude, statut')
        .eq('statut', 'approved')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
      setReparateurs(data || [])
    }
    load()
  }, [])

  return (
    <MapContainer
      center={[46.5, 2.5]}
      zoom={6}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {reparateurs.map(r => (
        <Marker
          key={r.id}
          position={[r.latitude, r.longitude]}
          icon={r.nom === 'La Grande Roue' ? iconSelf : icon}
        >
          <Popup>
            <div style={{ fontFamily: '"DM Sans", sans-serif', minWidth: '160px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#111', marginBottom: '4px' }}>{r.nom}</div>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>{r.ville}</div>
              {r.note && <div style={{ fontSize: '12px', color: '#f59e0b' }}>{'★'.repeat(Math.round(r.note))} {r.note}</div>}
              <a href={'/reparateur/' + r.id} target="_blank" style={{ display: 'inline-block', marginTop: '8px', background: '#2563eb', color: '#fff', padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, textDecoration: 'none' }}>Voir la fiche →</a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
