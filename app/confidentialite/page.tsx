import Navbar from '../../components/Navbar'

export default function Confidentialite() {
  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: '"DM Sans", sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <a href="/" style={{ fontSize: '12px', color: '#888', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>← Retour à l'accueil</a>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111', marginBottom: '6px' }}>Politique de confidentialité</h1>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '2rem' }}>Dernière mise à jour : juillet 2026</p>

        {[
          {
            titre: '1. Responsable du traitement',
            contenu: 'La Grande Roue (SIREN 894 015 882), 24 avenue Mathias Duval, 06130 Grasse — lagranderouecontact@gmail.com est responsable du traitement de vos données personnelles collectées via la plateforme trouvetonreparateur.com.'
          },
          {
            titre: '2. Données collectées',
            contenu: 'Nous collectons les données suivantes : adresse email, prénom, nom, numéro de téléphone (lors de la création d&apos;un compte ou d&apos;une réservation), données de navigation (pages visitées, durée de session), informations de réservation (type de réparation, date, heure) et avis laissés sur la plateforme.'
          },
          {
            titre: '3. Finalités du traitement',
            contenu: 'Vos données sont utilisées pour : la gestion de votre compte utilisateur, la mise en relation avec les réparateurs, l&#39;envoi de notifications relatives à vos réservations et avis, l&apos;amélioration de nos services et la sécurité de la plateforme.'
          },
          {
            titre: '4. Base légale',
            contenu: 'Le traitement de vos données est fondé sur l&apos;exécution du contrat (utilisation de la plateforme), votre consentement (pour les communications marketing) et nos intérêts légitimes (amélioration du service, sécurité).'
          },
          {
            titre: '5. Conservation des données',
            contenu: 'Vos données sont conservées pendant la durée de votre utilisation de la plateforme et pendant 3 ans après votre dernière activité. Les données de facturation sont conservées 10 ans conformément aux obligations légales.'
          },
          {
            titre: '6. Partage des données',
            contenu: 'Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées avec les réparateurs dans le cadre d&apos;une réservation (nom, email, téléphone) et avec nos prestataires techniques (Supabase pour la base de données, Resend pour les emails, Vercel pour l&#39;hébergement).'
          },
          {
            titre: '7. Vos droits',
            contenu: 'Conformément au RGPD, vous disposez d&apos;un droit d&#39;accès, de rectification, d&#39;effacement, de portabilité et d&#39;opposition au traitement de vos données. Pour exercer ces droits, contactez-nous à : lagranderouecontact@gmail.com'
          },
          {
            titre: '8. Cookies',
            contenu: 'La plateforme utilise des cookies techniques nécessaires au bon fonctionnement du site (session, authentification). Aucun cookie publicitaire n&apos;est utilisé.'
          },
          {
            titre: '9. Contact DPO',
            contenu: 'Pour toute question relative à la protection de vos données : lagranderouecontact@gmail.com'
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
