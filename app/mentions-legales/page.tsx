import Navbar from '../../components/Navbar'

function Footer() {
  return (
    <footer style={{ background: '#0f2d6b', padding: '2rem 2rem 1.5rem', marginTop: '3rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Trouve ton réparateur</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>La plateforme qui connecte les clients avec les meilleurs réparateurs de téléphone en France.</div>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '10px' }}>Plateforme</div>
            <a href="/" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginBottom: '6px', textDecoration: 'none' }}>Trouver un réparateur</a>
            <a href="/espace-reparateur" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginBottom: '6px', textDecoration: 'none' }}>Espace réparateur</a>
            <a href="/mon-compte" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginBottom: '6px', textDecoration: 'none' }}>Espace client</a>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '10px' }}>Légal</div>
            <a href="/mentions-legales" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginBottom: '6px', textDecoration: 'none' }}>Mentions légales</a>
            <a href="/cgv" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginBottom: '6px', textDecoration: 'none' }}>CGV</a>
            <a href="/confidentialite" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginBottom: '6px', textDecoration: 'none' }}>Confidentialité</a>
            <a href="/contact" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginBottom: '6px', textDecoration: 'none' }}>Contact</a>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>© 2026 Trouve ton réparateur — Tous droits réservés</div>
        </div>
      </div>
    </footer>
  )
}

const cardStyle = { background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '20px 24px', marginBottom: '12px' } as const
const h2Style = { fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '10px' } as const
const pStyle = { fontSize: '13px', color: '#555', lineHeight: 1.7 } as const

export default function MentionsLegales() {
  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: '"DM Sans", sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <a href="/" style={{ fontSize: '12px', color: '#888', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>← Retour à l'accueil</a>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111', marginBottom: '6px' }}>Mentions légales</h1>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '2rem' }}>Dernière mise à jour : juillet 2026</p>

        <div style={cardStyle}>
          <h2 style={h2Style}>1. Éditeur du site</h2>
          <p style={pStyle}>Le site trouvetonreparateur.com est édité par La Grande Roue, entreprise individuelle immatriculée au SIREN 894 015 882, dont le siège social est situé au 24 avenue Mathias Duval, 06130 Grasse, France. Email : lagranderouecontact@gmail.com</p>
        </div>

        <div style={cardStyle}>
          <h2 style={h2Style}>2. Directeur de la publication</h2>
          <p style={pStyle}>Le directeur de la publication est le représentant légal de La Grande Roue.</p>
        </div>

        <div style={cardStyle}>
          <h2 style={h2Style}>3. Hébergeur</h2>
          <p style={pStyle}>Le site est hébergé par Vercel Inc., 340 Pine Street Suite 701, San Francisco, CA 94104, États-Unis. Site web : vercel.com</p>
        </div>

        <div style={cardStyle}>
          <h2 style={h2Style}>4. Propriété intellectuelle</h2>
          <p style={pStyle}>L&apos;ensemble du contenu de ce site (textes, images, logos, icônes, code source) est la propriété exclusive de La Grande Roue ou fait l&apos;objet d&apos;une autorisation d&apos;utilisation. Toute reproduction, représentation, modification ou exploitation non autorisée de tout ou partie de ce site est strictement interdite.</p>
        </div>

        <div style={cardStyle}>
          <h2 style={h2Style}>5. Responsabilité</h2>
          <p style={pStyle}>La Grande Roue ne peut être tenue responsable des dommages directs ou indirects causés au matériel de l&apos;utilisateur lors de l&apos;accès au site.</p>
        </div>

        <div style={cardStyle}>
          <h2 style={h2Style}>6. Contact</h2>
          <p style={pStyle}>Pour toute question relative aux présentes mentions légales : lagranderouecontact@gmail.com</p>
        </div>

      </div>
      <Footer />
    </main>
  )
}
