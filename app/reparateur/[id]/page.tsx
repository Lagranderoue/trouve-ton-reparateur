import { supabase } from '../../../lib/supabase'
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
  const horaireDuJour = horairesList.find((h: { jour: string; horaire: string }) => h.jour === jourActuelNom)

  const serviceIcons: Record<string, string> = {
    'Écran cassé': 'ti-device-mobile',
    'Batterie': 'ti-battery',
    'Connecteur de charge': 'ti-plug',
    'Caméra': 'ti-camera',
    'Haut-parleur': 'ti-volume',
    'Micro': 'ti-microphone',
    'Bouton': 'ti-circle',
    'Châssis': 'ti-tool',
    'Carte mère': 'ti-cpu',
    'Vitre arrière': 'ti-layout',
    'Récupération de données': 'ti-database',
    'Autre': 'ti-settings',
    'PC / Tablette': 'ti-device-laptop',
    'Téléphone oxydé': 'ti-droplet',
    'Châssis complet': 'ti-tool',
    'Boutons': 'ti-circle',
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: '"DM Sans", sans-serif' }}>
      <style>{`
        @media (max-width: 768px) {
          .fiche-desktop { display: none !important; }
          .fiche-mobile { display: block !important; }
          .fiche-corps { grid-template-columns: 1fr !important; }
          .services-grid-desktop { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (min-width: 769px) {
          .fiche-mobile { display: none !important; }
          .fiche-desktop { display: block !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ background: '#0f2d6b', padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#fff' }}>Trouve ton réparateur</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/mon-compte" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Espace client</a>
          <a href="/espace-reparateur" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Espace réparateur</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(150deg, #0f2d6b 0%, #1e4db7 100%)', padding: '20px 28px 28px' }}>
        <a href="javascript:history.back()" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '18px' }}>
          ← Retour aux résultats
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '18px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 500, color: '#0f2d6b', flexShrink: 0, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.15)' }}>
            {r.logo_url ? <img src={r.logo_url} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : r.nom?.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 500, color: '#fff', margin: 0 }}>{r.nom}</h1>
              <span style={{ fontSize: '12px', background: ouvert ? 'rgba(34,197,94,0.22)' : 'rgba(255,255,255,0.1)', color: ouvert ? '#86efac' : 'rgba(255,255,255,0.6)', padding: '3px 10px', borderRadius: '20px', fontWeight: 500 }}>
                {ouvert ? '● Ouvert' : 'Fermé'}
                {ouvert && horaireDuJour && <span style={{ marginLeft: '4px', opacity: 0.8 }}> jusqu'à {horaireDuJour.horaire.split(' - ')[1]}</span>}
              </span>
              {r.deplacement && (
                <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)', padding: '3px 10px', borderRadius: '20px' }}>
                  Déplacement à domicile
                </span>
              )}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              📍 {r.adresse}, {r.ville} {r.code_postal}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
            {r.telephone && (
              <>
                <a href="#" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '0.5px solid rgba(255,255,255,0.3)', borderRadius: '10px', padding: '11px 20px', fontSize: '13px', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📅 Réserver
                </a>
                <a href={'tel:' + r.telephone} style={{ background: '#fff', color: '#0f2d6b', border: 'none', borderRadius: '10px', padding: '11px 20px', fontSize: '13px', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📞 Appeler
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 16px' }}>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
          {[
            { icon: 'ti-star-filled', color: '#f59e0b', val: r.note ? r.note.toFixed(1) : 'N/A', label: 'Note moyenne' },
            { icon: 'ti-clock', color: '#16a34a', val: '~1h', label: 'Délai moyen' },
            { icon: 'ti-home', color: '#2563eb', val: r.deplacement ? 'Disponible' : 'En boutique', label: r.deplacement ? 'Déplacement domicile' : 'Sur place uniquement' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', border: '0.5px solid #e8eaf0', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <i className={'ti ' + s.icon} style={{ fontSize: '22px', color: s.color, flexShrink: 0 }} aria-hidden="true" />
              <div>
                <div style={{ fontSize: '17px', fontWeight: 500, color: '#111' }}>{s.val}</div>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '1px' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* DESCRIPTION */}
        {r.description && (
          <div style={{ background: '#fff', border: '0.5px solid #e8eaf0', borderRadius: '12px', padding: '16px', marginBottom: '14px', fontSize: '14px', color: '#555', lineHeight: 1.6 }}>
            {r.description}
          </div>
        )}

        {/* SERVICES + HORAIRES */}
        <div className="fiche-corps" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>

          {/* SERVICES */}
          <div style={{ background: '#fff', border: '0.5px solid #e8eaf0', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>Services proposés</div>
            <div className="services-grid-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {servicesList.slice(0, 7).map((s: string, i: number) => (
                <div key={i} style={{ background: '#f4f6fb', borderRadius: '10px', padding: '10px 6px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                  <i className={'ti ' + (serviceIcons[s] || 'ti-tool')} style={{ fontSize: '20px', color: '#2563eb' }} aria-hidden="true" />
                  <span style={{ fontSize: '10px', color: '#555', lineHeight: 1.3 }}>{s}</span>
                </div>
              ))}
              {servicesList.length > 7 && (
                <div style={{ background: '#f4f6fb', borderRadius: '10px', padding: '10px 6px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', border: '0.5px dashed #e0e0e0' }}>
                  <i className="ti ti-dots" style={{ fontSize: '20px', color: '#bbb' }} aria-hidden="true" />
                  <span style={{ fontSize: '10px', color: '#bbb' }}>+{servicesList.length - 7}</span>
                </div>
              )}
            </div>
          </div>

          {/* HORAIRES */}
          <div style={{ background: '#fff', border: '0.5px solid #e8eaf0', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>Horaires d'ouverture</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {horairesList.map(({ jour, horaire }: { jour: string; horaire: string }) => {
                const estAujourdhui = jour === jourActuelNom
                return (
                  <div key={jour} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: '8px', background: estAujourdhui ? '#eff6ff' : '#f8f9fc' }}>
                    <span style={{ fontSize: '13px', fontWeight: estAujourdhui ? 500 : 400, color: estAujourdhui ? '#2563eb' : horaire === 'Fermé' ? '#bbb' : '#555' }}>{jour}</span>
                    <span style={{ fontSize: '13px', color: estAujourdhui ? '#2563eb' : horaire === 'Fermé' ? '#bbb' : '#111', fontWeight: estAujourdhui ? 500 : 400 }}>{horaire}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* AVIS */}
        <div style={{ background: '#fff', border: '0.5px solid #e8eaf0', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Avis clients</div>
            <AvisForm reparateurId={r.id} />
          </div>
          <AvisList reparateurId={r.id} />
        </div>

      </div>
    </main>
  )
}