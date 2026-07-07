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
    const lignes = r.horaires.split('|')
    for (const ligne of lignes) {
      const parts = ligne.split(':')
      if (parts.length < 2) continue
      const jour = parts[0].trim()
      const horaire = parts.slice(1).join(':').trim()
      if (jour !== jourActuel) continue
      if (horaire === 'Fermé') return false
      const times = horaire.split(' - ')
      if (times.length !== 2) return false
      const [hOuv, mOuv] = times[0].trim().split(':').map(Number)
      const [hFerm, mFerm] = times[1].trim().split(':').map(Number)
      return (now.getHours() * 60 + now.getMinutes()) >= hOuv * 60 + mOuv && (now.getHours() * 60 + now.getMinutes()) < hFerm * 60 + mFerm
    }
    return false
  })()

  const jourActuelNom = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][new Date().getDay()]
  const horaireDuJour = horairesList.find(h => h.jour === jourActuelNom)

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: '"DM Sans", sans-serif' }}>

      {/* NAVBAR */}
      <nav style={{ background: '#0f2d6b', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ fontSize: '14px', fontWeight: 500, color: '#fff', textDecoration: 'none' }}>
          Trouve ton réparateur
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="/mon-compte" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Espace client</a>
          <a href="/espace-reparateur" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Espace réparateur</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(160deg, #0f2d6b 0%, #1e4db7 100%)', padding: '20px 24px 28px' }}>
        <a href="javascript:history.back()" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>
          ← Retour aux résultats
        </a>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ width: '68px', height: '68px', borderRadius: '16px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 500, color: '#0f2d6b', flexShrink: 0, overflow: 'hidden' }}>
            {r.logo_url ? <img src={r.logo_url} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : r.nom?.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 500, color: '#fff', margin: 0 }}>{r.nom}</h1>
              <span style={{ fontSize: '12px', background: ouvert ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.1)', color: ouvert ? '#86efac' : 'rgba(255,255,255,0.6)', padding: '3px 10px', borderRadius: '20px', fontWeight: 500 }}>
                {ouvert ? '● Ouvert' : 'Fermé'}
                {ouvert && horaireDuJour && <span style={{ marginLeft: '4px', opacity: 0.8 }}>jusqu'à {horaireDuJour.horaire.split(' - ')[1]}</span>}
              </span>
              {r.deplacement && (
                <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)', padding: '3px 10px', borderRadius: '20px' }}>
                  Déplacement à domicile
                </span>
              )}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              📍 {r.adresse}, {r.ville} {r.code_postal}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            {r.telephone && (
              <>
                <a href={'/reparateur/' + r.id + '?reserv=1'} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '0.5px solid rgba(255,255,255,0.3)', borderRadius: '10px', padding: '10px 18px', fontSize: '13px', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📅 Réserver
                </a>
                <a href={'tel:' + r.telephone} style={{ background: '#fff', color: '#0f2d6b', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '13px', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📞 Appeler
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '20px 16px' }}>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
          <div style={{ background: '#fff', border: '0.5px solid #e8eaf0', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '22px', color: '#f59e0b' }}>★</span>
            <div>
              <div style={{ fontSize: '17px', fontWeight: 500, color: '#111' }}>{r.note ? r.note.toFixed(1) : 'N/A'}</div>
              <div style={{ fontSize: '11px', color: '#888' }}>Note moyenne</div>
            </div>
          </div>
          <div style={{ background: '#fff', border: '0.5px solid #e8eaf0', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>⏱️</span>
            <div>
              <div style={{ fontSize: '17px', fontWeight: 500, color: '#111' }}>~1h</div>
              <div style={{ fontSize: '11px', color: '#888' }}>Délai moyen</div>
            </div>
          </div>
          <div style={{ background: '#fff', border: '0.5px solid #e8eaf0', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>{r.deplacement ? '🏠' : '🏪'}</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>{r.deplacement ? 'Disponible' : 'En boutique'}</div>
              <div style={{ fontSize: '11px', color: '#888' }}>{r.deplacement ? 'Déplacement domicile' : 'Sur place uniquement'}</div>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        {r.description && (
          <div style={{ background: '#fff', border: '0.5px solid #e8eaf0', borderRadius: '12px', padding: '16px', marginBottom: '16px', fontSize: '14px', color: '#555', lineHeight: 1.6 }}>
            {r.description}
          </div>
        )}

        {/* SERVICES + HORAIRES */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>

          {/* SERVICES */}
          <div style={{ background: '#fff', border: '0.5px solid #e8eaf0', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Services proposés</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {servicesList.slice(0, 8).map((s, i) => {
                const icons: Record<string, string> = {
                  'Écran cassé': '📱', 'Batterie': '🔋', 'Connecteur de charge': '🔌',
                  'Caméra': '📷', 'Haut-parleur': '🔊', 'Micro': '🎤',
                  'Bouton': '⚪', 'Châssis': '🔧', 'Carte mère': '💾',
                  'Vitre arrière': '🪟', 'Récupération de données': '💿', 'Autre': '🛠️'
                }
                return (
                  <div key={i} style={{ background: '#f4f6fb', borderRadius: '10px', padding: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', marginBottom: '4px' }}>{icons[s] || '🔧'}</div>
                    <div style={{ fontSize: '10px', color: '#555', lineHeight: 1.3 }}>{s}</div>
                  </div>
                )
              })}
              {servicesList.length > 8 && (
                <div style={{ background: '#f4f6fb', borderRadius: '10px', padding: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', marginBottom: '4px' }}>➕</div>
                  <div style={{ fontSize: '10px', color: '#888' }}>+{servicesList.length - 8}</div>
                </div>
              )}
            </div>
          </div>

          {/* HORAIRES */}
          <div style={{ background: '#fff', border: '0.5px solid #e8eaf0', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Horaires d'ouverture</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {horairesList.map(({ jour, horaire }) => {
                const estAujourdhui = jour === jourActuelNom
                return (
                  <div key={jour} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderRadius: '8px', background: estAujourdhui ? '#eff6ff' : 'transparent' }}>
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
            <div style={{ fontSize: '11px', fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Avis clients</div>
            <AvisForm reparateurId={r.id} />
          </div>
          <AvisList reparateurId={r.id} />
        </div>

      </div>
    </main>
  )
}