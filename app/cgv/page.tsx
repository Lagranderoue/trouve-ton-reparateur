import Navbar from '../../components/Navbar'

export default function CGV() {
  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: '"DM Sans", sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <a href="/" style={{ fontSize: '12px', color: '#888', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>← Retour à l'accueil</a>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111', marginBottom: '6px' }}>Conditions Générales de Vente</h1>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '2rem' }}>Dernière mise à jour : juillet 2026</p>

        {[
          {
            titre: '1. Objet',
            contenu: 'Les présentes Conditions Générales de Vente régissent l&apos;utilisation de la plateforme trouvetonreparateur.com, éditée par La Grande Roue (SIREN 894 015 882), 24 avenue Mathias Duval, 06130 Grasse. La plateforme met en relation des clients particuliers avec des réparateurs de téléphones et appareils mobiles.'
          },
          {
            titre: '2. Accès et gratuité',
            contenu: 'L&#39;accès à la plateforme trouvetonreparateur.com est entièrement gratuit, aussi bien pour les clients que pour les réparateurs. La consultation des fiches réparateurs, la prise de contact, la réservation en ligne et la publication d&apos;avis sont des services gratuits.'
          },
          {
            titre: '3. Rôle de la plateforme',
            contenu: 'Trouvetonreparateur.com est une plateforme de mise en relation. Elle ne réalise aucune prestation de réparation et n&apos;est pas partie aux contrats conclus entre les clients et les réparateurs. La responsabilité de la plateforme ne peut être engagée en cas de litige entre un client et un réparateur.'
          },
          {
            titre: '4. Inscription et comptes',
            contenu: 'Les clients peuvent créer un compte gratuitement en fournissant une adresse email valide. Les réparateurs doivent soumettre une demande d&apos;inscription incluant un justificatif d&apos;activité (Kbis ou équivalent). La Grande Roue se réserve le droit d&#39;accepter ou de refuser toute inscription sans avoir à s&apos;en justifier.'
          },
          {
            titre: '5. Avis clients',
            contenu: 'Les avis publiés sur la plateforme sont soumis à validation par notre équipe. Tout avis frauduleux, diffamatoire ou contraire aux bonnes mœurs sera supprimé. En soumettant un avis, l&apos;utilisateur garantit avoir effectivement bénéficié des services du réparateur concerné.'
          },
          {
            titre: '6. Réservations',
            contenu: 'Le système de réservation en ligne permet aux clients de proposer un créneau de rendez-vous auprès d&apos;un réparateur. La réservation n&apos;est confirmée qu&apos;après acceptation explicite du réparateur. La plateforme envoie des notifications par email aux deux parties.'
          },
          {
            titre: '7. Responsabilité',
            contenu: 'La Grande Roue s&apos;efforce d&#39;assurer l&apos;exactitude des informations publiées sur la plateforme mais ne peut garantir leur exhaustivité. En cas de force majeure, de problèmes techniques ou d&#39;interruption de service, la responsabilité de la plateforme ne saurait être engagée.'
          },
          {
            titre: '8. Droit applicable',
            contenu: 'Les présentes CGV sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.'
          },
          {
            titre: '9. Contact',
            contenu: 'Pour toute question relative aux présentes CGV : lagranderouecontact@gmail.com'
          },
        ].map(({ titre, contenu }, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', padding: '20px 24px', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '10px' }}>{titre}</h2>
            <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.7 }}>{contenu}</p>
          </div>
        ))}
      </div>
      <Footer />
    </main>
  )
}

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
            {[{l:'Trouver un réparateur',h:'/'},{l:'Inscrire ma boutique',h:'/espace-reparateur'},{l:'Espace client',h:'/mon-compte'},{l:'Espace réparateur',h:'/espace-reparateur'}].map((x,i) => (
              <a key={i} href={x.h} style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginBottom: '6px', textDecoration: 'none' }}>{x.l}</a>
            ))}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '10px' }}>Légal</div>
            {[{l:'Mentions légales',h:'/mentions-legales'},{l:'CGV',h:'/cgv'},{l:'Confidentialité',h:'/confidentialite'},{l:'Contact',h:'/contact'}].map((x,i) => (
              <a key={i} href={x.h} style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginBottom: '6px', textDecoration: 'none' }}>{x.l}</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>© 2026 Trouve ton réparateur — Tous droits réservés</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {[{l:'Mentions légales',h:'/mentions-legales'},{l:'CGV',h:'/cgv'},{l:'Confidentialité',h:'/confidentialite'}].map((x,i) => (
              <a key={i} href={x.h} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>{x.l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
