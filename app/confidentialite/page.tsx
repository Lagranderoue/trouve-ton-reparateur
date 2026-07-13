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
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>© 2026 Trouve ton réparateur — Tous droits réservés</div>
        </div>
      </div>
    </footer>
  )
}

const cardStyle = { background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '20px 24px', marginBottom: '12px' } as const
const h2Style = { fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '10px' } as const
const pStyle = { fontSize: '13px', color: '#555', lineHeight: 1.7 } as const

export default function Confidentialite() {
  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: '"DM Sans", sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <a href="/" style={{ fontSize: '12px', color: '#888', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>← Retour à l&apos;accueil</a>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111', marginBottom: '6px' }}>Politique de confidentialité</h1>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '2rem' }}>Dernière mise à jour : juillet 2026</p>

        <div style={cardStyle}>
          <h2 style={h2Style}>1. Responsable du traitement</h2>
          <p style={pStyle}>La Grande Roue (SIREN 894 015 882), 24 avenue Mathias Duval, 06130 Grasse — lagranderouecontact@gmail.com est responsable du traitement de vos données personnelles collectées via trouvetonreparateur.com.</p>
        </div>

        <div style={cardStyle}>
          <h2 style={h2Style}>2. Données collectées</h2>
          <p style={pStyle}>Nous collectons : adresse email, prénom, nom, numéro de téléphone (lors de la création d&apos;un compte ou d&apos;une réservation), données de navigation, informations de réservation et avis laissés sur la plateforme.</p>
        </div>

        <div style={cardStyle}>
          <h2 style={h2Style}>3. Finalités du traitement</h2>
          <p style={pStyle}>Vos données sont utilisées pour : la gestion de votre compte, la mise en relation avec les réparateurs, l&apos;envoi de notifications relatives à vos réservations et avis, et l&apos;amélioration de nos services.</p>
        </div>

        <div style={cardStyle}>
          <h2 style={h2Style}>4. Base légale</h2>
          <p style={pStyle}>Le traitement est fondé sur l&apos;exécution du contrat (utilisation de la plateforme), votre consentement (communications marketing) et nos intérêts légitimes (amélioration du service, sécurité).</p>
        </div>

        <div style={cardStyle}>
          <h2 style={h2Style}>5. Conservation des données</h2>
          <p style={pStyle}>Vos données sont conservées pendant la durée de votre utilisation de la plateforme et pendant 3 ans après votre dernière activité.</p>
        </div>

        <div style={cardStyle}>
          <h2 style={h2Style}>6. Partage des données</h2>
          <p style={pStyle}>Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées avec les réparateurs dans le cadre d&apos;une réservation et avec nos prestataires techniques (Supabase, Resend, Vercel).</p>
        </div>

        <div style={cardStyle}>
          <h2 style={h2Style}>7. Vos droits</h2>
          <p style={pStyle}>Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de portabilité et d&apos;opposition. Pour exercer ces droits : lagranderouecontact@gmail.com</p>
        </div>

        <div style={cardStyle}>
          <h2 style={h2Style}>8. Cookies</h2>
          <p style={pStyle}>La plateforme utilise uniquement des cookies techniques nécessaires au bon fonctionnement (session, authentification). Aucun cookie publicitaire n&apos;est utilisé.</p>
        </div>

      </div>
      <Footer />
    </main>
  )
}
