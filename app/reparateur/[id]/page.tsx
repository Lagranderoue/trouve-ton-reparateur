import { supabase } from '../../../lib/supabase'
import Navbar from '../../../components/Navbar'
import AvisForm from './AvisForm'
import AvisList from './AvisList'

export const dynamic = 'force-dynamic'

async function enregistrerVue(id: string) {
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  await supabase.from('vues').insert({ reparateur_id: id })
}

export default async function FicheReparateur({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await enregistrerVue(id)

  const { data: r } = await supabase
    .from('reparateurs')
    .select('*')
    .eq('id', id)
    .single()

  if (!r) return <div className="p-10 text-center text-gray-400">Réparateur introuvable.</div>

  const servicesList: string[] = r.services
    ? r.services.split(',').map((s: string) => s.trim()).filter(Boolean)
    : []

  const horairesList: { jour: string; horaire: string }[] = r.horaires
    ? r.horaires.split('|').map((h: string) => {
        const parts = h.trim().split(':')
        const jour = parts[0]?.trim() || ''
        const horaire = parts.slice(1).join(':').trim()
        return { jour, horaire }
}).filter((h: { jour: string; horaire: string }) => h.jour)
    : []

  const ouvert = (() => {
    if (!r.horaires) return false
    const now = new Date()
    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
    const jourActuel = jours[now.getDay()]
    const heureActuelle = now.getHours() * 60 + now.getMinutes()
    for (const ligne of r.horaires.split('|')) {
      const parts = ligne.split(':')
      if (parts.length < 2) continue
      const jour = parts[0].trim()
      const horaire = parts.slice(1).join(':').trim()
      if (jour !== jourActuel) continue
      if (horaire === 'Fermé') return false
      const times = horaire.split(' - ')
      if (times.length !== 2) return false
      const [hO, mO] = times[0].trim().split(':').map(Number)
      const [hF, mF] = times[1].trim().split(':').map(Number)
      return heureActuelle >= hO * 60 + mO && heureActuelle < hF * 60 + mF
    }
    return false
  })()

  const jourActuelNom = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][new Date().getDay()]
  const horaireDuJour = horairesList.find((h: {jour: string; horaire: string}) => h.jour === jourActuelNom)

  const serviceIcons: Record<string, string> = {
    'Écran cassé': 'ti-device-mobile',
    'Batterie': 'ti-battery',
    'Connecteur de charge': 'ti-plug',
    'Caméra': 'ti-camera',
    'Haut-parleur': 'ti-volume',
    'Micro': 'ti-microphone',
    'Bouton': 'ti-circle',
    'Boutons': 'ti-circle',
    'Châssis': 'ti-tool',
    'Châssis complet': 'ti-tool',
    'Carte mère': 'ti-cpu',
    'Vitre arrière': 'ti-layout-2',
    'Récupération de données': 'ti-database',
    'PC / Tablette': 'ti-device-laptop',
    'Téléphone oxydé': 'ti-droplet',
    'Autre': 'ti-settings',
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: '"DM Sans", sans-serif' }}>

      <Navbar />

      {/* HERO */}
      <div style={{ background: 'linear-gradient(150deg, #0f2d6b 0%, #1e4db7 100%)', padding: '16px 16px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <a href="javascript:history.back()" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            ← Retour
          </a>
        </div>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 500, color: '#0f2d6b', flexShrink: 0, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)' }}>
            {r.logo_url ? <img src={r.logo_url} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : r.nom?.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 500, color: '#fff', marginBottom: '6px' }}>{r.nom}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', background: ouvert ? 'rgba(34,197,94,0.22)' : 'rgba(255,255,255,0.1)', color: ouvert ? '#86efac' : 'rgba(255,255,255,0.55)', padding: '3px 9px', borderRadius: '20px', fontWeight: 500 }}>
                {ouvert ? '● Ouvert' : 'Fermé'}
              </span>
              {ouvert && horaireDuJour && (
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>jusqu'à {horaireDuJour.horaire.split(' - ')[1]}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BOUTONS ACTION */}
      <div style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#fff', borderBottom: '0.5px solid #e8eaf0' }}>
        {r.telephone ? (
          <a href={'tel:' + r.telephone} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px', fontSize: '13px', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <i className="ti ti-phone" aria-hidden="true" /> Appeler
          </a>
        ) : (
          <div style={{ background: '#e0e0e0', color: '#aaa', borderRadius: '10px', padding: '11px', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <i className="ti ti-phone" aria-hidden="true" /> Appeler
          </div>
        )}
        <button style={{ background: '#f4f6fb', color: '#111', border: '0.5px solid #e8eaf0', borderRadius: '10px', padding: '11px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: '"DM Sans", sans-serif' }}>
          <i className="ti ti-calendar" aria-hidden="true" /> Réserver
        </button>
      </div>

      <div style={{ padding: '16px' }}>

        {/* STATS 2x2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          <div style={{ background: '#fff', border: '0.5px solid #e8eaf0', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="ti ti-star-filled" style={{ fontSize: '20px', color: '#f59e0b', flexShrink: 0 }} aria-hidden="true" />
            <div>
              <div style={{ fontSize: '15px', fontWeight: 500, color: '#111' }}>{r.note ? r.note.toFixed(1) : 'N/A'}</div>
              <div style={{ fontSize: '10px', color: '#888', marginTop: '1px' }}>Note moyenne</div>
            </div>
          </div>
          <div style={{ background: '#fff', border: '0.5px solid #e8eaf0', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="ti ti-message" style={{ fontSize: '20px', color: '#2563eb', flexShrink: 0 }} aria-hidden="true" />
            <div>
              <div style={{ fontSize: '15px', fontWeight: 500, color: '#111' }}>1 avis</div>
              <div style={{ fontSize: '10px', color: '#888', marginTop: '1px' }}>Clients vérifiés</div>
            </div>
          </div>
          <div style={{ background: '#fff', border: '0.5px solid #e8eaf0', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="ti ti-clock" style={{ fontSize: '20px', color: '#16a34a', flexShrink: 0 }} aria-hidden="true" />
            <div>
              <div style={{ fontSize: '15px', fontWeight: 500, color: '#111' }}>~1h</div>
              <div style={{ fontSize: '10px', color: '#888', marginTop: '1px' }}>Délai moyen</div>
            </div>
          </div>
          <div style={{ background: '#fff', border: '0.5px solid #e8eaf0', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="ti ti-home" style={{ fontSize: '20px', color: '#2563eb', flexShrink: 0 }} aria-hidden="true" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#111' }}>{r.deplacement ? 'Déplacement' : 'En boutique'}</div>
              <div style={{ fontSize: '10px', color: '#888', marginTop: '1px' }}>{r.deplacement ? 'À domicile' : 'Sur place'}</div>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        {r.description && (
          <div style={{ background: '#fff', border: '0.5px solid #e8eaf0', borderRadius: '12px', padding: '14px', marginBottom: '12px', fontSize: '13px', color: '#555', lineHeight: 1.6 }}>
            {r.description}
          </div>
        )}

        {/* SERVICES */}
        <div style={{ background: '#fff', border: '0.5px solid #e8eaf0', borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>Services proposés</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '7px' }}>
            {servicesList.slice(0, 5).map((s: string, i: number) => (
              <div key={i} style={{ background: '#f4f6fb', borderRadius: '10px', padding: '10px 6px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                <i className={'ti ' + (serviceIcons[s] || 'ti-tool')} style={{ fontSize: '20px', color: '#2563eb' }} aria-hidden="true" />
                <span style={{ fontSize: '10px', color: '#555', lineHeight: 1.3 }}>{s}</span>
              </div>
            ))}
            {servicesList.length > 5 && (
              <div style={{ background: '#f4f6fb', borderRadius: '10px', padding: '10px 6px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', border: '0.5px dashed #e0e0e0' }}>
                <i className="ti ti-dots" style={{ fontSize: '20px', color: '#bbb' }} aria-hidden="true" />
                <span style={{ fontSize: '10px', color: '#bbb' }}>+{servicesList.length - 5}</span>
              </div>
            )}
          </div>
        </div>

        {/* HORAIRES */}
        <div style={{ background: '#fff', border: '0.5px solid #e8eaf0', borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>Horaires d'ouverture</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {horairesList.map(({ jour, horaire }: { jour: string; horaire: string }) => {
              const estAujourdhui = jour === jourActuelNom
              return (
                <div key={jour} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderRadius: '8px', background: estAujourdhui ? '#eff6ff' : '#f8f9fc' }}>
                  <span style={{ fontSize: '12px', fontWeight: estAujourdhui ? 500 : 400, color: estAujourdhui ? '#2563eb' : horaire === 'Fermé' ? '#bbb' : '#555' }}>{jour}</span>
                  <span style={{ fontSize: '12px', fontWeight: estAujourdhui ? 500 : 400, color: estAujourdhui ? '#2563eb' : horaire === 'Fermé' ? '#bbb' : '#111' }}>{horaire}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* AVIS */}
        <div style={{ background: '#fff', border: '0.5px solid #e8eaf0', borderRadius: '12px', padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Avis clients</div>
            <AvisForm reparateurId={r.id} />
          </div>
          <AvisList reparateurId={r.id} />
        </div>

      </div>
    </main>
  )
}