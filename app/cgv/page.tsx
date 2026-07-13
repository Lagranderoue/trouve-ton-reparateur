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

export default function CGV() {
  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: '"DM Sans", sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <a href="/" style={{ fontSize: '12px', color: '#888', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>← Retour à l&apos;accueil</a>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111', marginBottom: '6px' }}>Conditions Générales de Vente</h1>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '2rem' }}>Dernière mise à jour : juillet 2026</p>

        <div style={cardStyle}>
          <h2 style={h2Style}>1. Objet</h2>
          <p style={pStyle}>Les présentes Conditions Générales de Vente régissent l&apos;utilisation de la plateforme trouvetonreparateur.com, éditée par La Grande Roue (SIREN 894 015 882), 24 avenue Mathias Duval, 06130 Grasse.</p>
        </div>

        <div style={cardStyle}>
          <h2 style={h2Style}>2. Accès et gratuité</h2>
          <p style={pStyle}>L&apos;accès à la plateforme trouvetonreparateur.com est entièrement gratuit, aussi bien pour les clients que pour les réparateurs. La consultation des fiches, la prise de contact, la réservation en ligne et la publication d&apos;avis sont des services gratuits.</p>
        </div>

        <div style={cardStyle}>
          <h2 style={h2Style}>3. Rôle de la plateforme</h2>
          <p style={pStyle}>Trouvetonreparateur.com est une plateforme de mise en relation. Elle ne réalise aucune prestation de réparation et n&apos;est pas partie aux contrats conclus entre les clients et les réparateurs.</p>
        </div>

        <div style={cardStyle}>
          <h2 style={h2Style}>4. Inscription et comptes</h2>
          <p style={pStyle}>Les clients peuvent créer un compte gratuitement. Les réparateurs doivent soumettre une demande incluant un justificatif d&apos;activité. La Grande Roue se réserve le droit d&apos;accepter ou de refuser toute inscription.</p>
        </div>

        <div style={cardStyle}>
          <h2 style={h2Style}>5. Avis clients</h2>
          <p style={pStyle}>Les avis publiés sont soumis à validation. Tout avis frauduleux ou diffamatoire sera supprimé. En soumettant un avis, l&apos;utilisateur garantit avoir bénéficié des services du réparateur concerné.</p>
        </div>

        <div style={cardStyle}>
          <h2 style={h2Style}>6. Réservations</h2>
          <p style={pStyle}>Le système de réservation permet aux clients de proposer un créneau auprès d&apos;un réparateur. La réservation n&apos;est confirmée qu&apos;après acceptation explicite du réparateur.</p>
        </div>

        <div style={cardStyle}>
          <h2 style={h2Style}>7. Responsabilité</h2>
          <p style={pStyle}>La Grande Roue s&apos;efforce d&apos;assurer l&apos;exactitude des informations publiées mais ne peut garantir leur exhaustivité. En cas de problèmes techniques, la responsabilité de la plateforme ne saurait être engagée.</p>
        </div>

        <div style={cardStyle}>
          <h2 style={h2Style}>8. Droit applicable</h2>
          <p style={pStyle}>Les présentes CGV sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
        </div>

        <div style={cardStyle}>
          <h2 style={h2Style}>9. Contact</h2>
          <p style={pStyle}>Pour toute question relative aux présentes CGV : lagranderouecontact@gmail.com</p>
        </div>

      </div>
      <Footer />
    </main>
  )
}
