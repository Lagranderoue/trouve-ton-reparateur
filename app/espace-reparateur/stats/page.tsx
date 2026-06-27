'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { IconEye, IconPhoneCall, IconStar, IconArrowLeft, IconTrendingUp } from '@tabler/icons-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Stats() {
  const [reparateur, setReparateur] = useState<any>(null)
  const [vuesMois, setVuesMois] = useState(0)
  const [vuesMoisPrecedent, setVuesMoisPrecedent] = useState(0)
  const [vuesParJour, setVuesParJour] = useState<{jour: string, count: number}[]>([])
  const [loading, setLoading] = useState(true)
  const [periode, setPeriode] = useState('mois')
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/espace-reparateur'); return }
      const { data: rep } = await supabase.from('reparateurs').select('*').eq('email', user.email).single()
      if (!rep) return
      setReparateur(rep)

      // Vues ce mois
      const debutMois = new Date()
      debutMois.setDate(1)
      debutMois.setHours(0,0,0,0)

      const { count: countMois } = await supabase
        .from('vues')
        .select('*', { count: 'exact', head: true })
        .eq('reparateur_id', rep.id)
        .gte('created_at', debutMois.toISOString())
      setVuesMois(countMois || 0)

      // Vues mois précédent
      const debutMoisPrec = new Date()
      debutMoisPrec.setMonth(debutMoisPrec.getMonth() - 1)
      debutMoisPrec.setDate(1)
      debutMoisPrec.setHours(0,0,0,0)
      const finMoisPrec = new Date()
      finMoisPrec.setDate(0)
      finMoisPrec.setHours(23,59,59,999)

      const { count: countPrec } = await supabase
        .from('vues')
        .select('*', { count: 'exact', head: true })
        .eq('reparateur_id', rep.id)
        .gte('created_at', debutMoisPrec.toISOString())
        .lte('created_at', finMoisPrec.toISOString())
      setVuesMoisPrecedent(countPrec || 0)

      // Vues par jour ce mois
      const { data: vues } = await supabase
        .from('vues')
        .select('created_at')
        .eq('reparateur_id', rep.id)
        .gte('created_at', debutMois.toISOString())
        .order('created_at', { ascending: true })

      if (vues) {
        const parJour: Record<string, number> = {}
        vues.forEach(v => {
          const jour = new Date(v.created_at).getDate().toString()
          parJour[jour] = (parJour[jour] || 0) + 1
        })
        const today = new Date().getDate()
        const result = []
        for (let i = 1; i <= today; i++) {
          result.push({ jour: i.toString(), count: parJour[i.toString()] || 0 })
        }
        setVuesParJour(result)
      }

      setLoading(false)
    }
    init()
  }, [])

  const tendance = vuesMoisPrecedent > 0
    ? Math.round(((vuesMois - vuesMoisPrecedent) / vuesMoisPrecedent) * 100)
    : null

  const maxVues = Math.max(...vuesParJour.map(v => v.count), 1)

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #e0e0e0', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <div style={{ fontSize: '14px', color: '#888' }}>Chargement...</div>
      </div>
      <style>{"@keyframes spin { to { transform: rotate(360deg) } }"}</style>
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: '"DM Sans", sans-serif' }}>
      <style>{"@keyframes spin { to { transform: rotate(360deg) } }"}</style>

      {/* NAVBAR */}
      <nav style={{ background: '#ffffff', boxShadow: '0 1px 0 #e8eaf0', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => router.push('/espace-reparateur/dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#666', background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}
          >
            <IconArrowLeft size={16} /> Retour au dashboard
          </button>
        </div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f2d6b' }}>Mes statistiques</div>
        <div style={{ width: '140px' }} />
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.25rem' }}>
          {[
            {
              icon: <IconEye size={20} color="#2563eb" />,
              bg: '#eff6ff',
              n: vuesMois.toString(),
              l: 'Vues ce mois',
              trend: tendance !== null ? (tendance >= 0 ? '↑ +' + tendance + '%' : '↓ ' + tendance + '%') : 'Premier mois',
              trendColor: tendance !== null ? (tendance >= 0 ? '#16a34a' : '#dc2626') : '#888'
            },
            {
              icon: <IconPhoneCall size={20} color="#16a34a" />,
              bg: '#f0fdf4',
              n: '—',
              l: 'Clics "Appeler"',
              trend: 'Bientôt disponible',
              trendColor: '#888'
            },
            {
              icon: <IconStar size={20} color="#ca8a04" />,
              bg: '#fefce8',
              n: reparateur?.note ? reparateur.note.toFixed(1) : 'N/A',
              l: 'Note moyenne',
              trend: '— Stable',
              trendColor: '#888'
            },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>{s.icon}</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#111', letterSpacing: '-0.03em' }}>{s.n}</div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>{s.l}</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: s.trendColor, marginTop: '5px' }}>{s.trend}</div>
            </div>
          ))}
        </div>

        {/* GRAPHIQUE */}
        <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>Vues par jour</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['mois'].map(p => (
                <button key={p} style={{ fontSize: '12px', fontWeight: 500, padding: '5px 12px', borderRadius: '6px', border: '1px solid #bfdbfe', background: '#eff6ff', color: '#2563eb', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                  Ce mois
                </button>
              ))}
            </div>
          </div>

          {vuesParJour.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#888', fontSize: '14px' }}>
              <IconTrendingUp size={40} color="#e0e0e0" style={{ marginBottom: '10px' }} />
              <div>Aucune vue pour le moment</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>Les vues apparaîtront quand des clients visiteront votre fiche</div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '140px', paddingTop: '10px' }}>
                {vuesParJour.map((v, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ fontSize: '9px', color: '#888', fontWeight: 500 }}>{v.count > 0 ? v.count : ''}</div>
                    <div style={{ width: '100%', height: `${(v.count / maxVues) * 100}%`, minHeight: v.count > 0 ? '4px' : '0', borderRadius: '3px 3px 0 0', background: '#2563eb', opacity: v.count > 0 ? 1 : 0.1, transition: 'all 0.3s' }} />
                    <div style={{ fontSize: '9px', color: '#bbb' }}>{v.jour}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }} />
                <span style={{ fontSize: '11px', color: '#888' }}>Vues</span>
              </div>
            </>
          )}
        </div>

      </div>
    </main>
  )
}
