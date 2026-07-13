import Navbar from '../../components/Navbar'

export default function MentionsLegales() {
  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: '"DM Sans", sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <a href="/" style={{ fontSize: '12px', color: '#888', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>← Retour à l'accueil</a>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111', marginBottom: '6px' }}>Mentions légales</h1>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '2rem' }}>Dernière mise à jour : juillet 2026</p>

        {[
          {
            titre: '1. Éditeur du site',
            contenu: 'Le site trouvetonreparateur.com est édité par La Grande Roue, entreprise individuelle immatriculée au SIREN 894 015 882, dont le siège social est situé au 24 avenue Mathias Duval, 06130 Grasse, France. Email : lagranderouecontact@gmail.com'
          },
          {
            titre: '2. Directeur de la publication',
            contenu: 'Le directeur de la publication est le représentant légal de La Grande Roue.'
          },
          {
            titre: '3. Hébergeur',
            contenu: 'Le site est hébergé par Vercel Inc., 340 Pine Street Suite 701, San Francisco, CA 94104, États-Unis. Site web : vercel.com'
          },
          {
            titre: '4. Propriété intellectuelle',
            contenu: 'L&#39;ensemble du contenu de ce site (textes, images, logos, icônes, code source) est la propriété exclusive de La Grande Roue ou fait l&#39;objet d&apos;une autorisation d&#39;utilisation. Toute reproduction, représentation, modification ou exploitation non autorisée de tout ou partie de ce site est strictement interdite et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.'
          },
          {
            titre: '5. Responsabilité',
            contenu: 'La Grande Roue ne peut être tenue responsable des dommages directs ou indirects causés au matériel de l&apos;utilisateur lors de l&apos;accès au site, résultant soit de l&apos;utilisation d&apos;un matériel ne répondant pas aux spécifications techniques requises, soit de l&#39;apparition d&apos;un bug ou d&apos;une incompatibilité.'
          },
          {
            titre: '6. Contact',
            contenu: 'Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter à l&apos;adresse suivante : lagranderouecontact@gmail.com'
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
