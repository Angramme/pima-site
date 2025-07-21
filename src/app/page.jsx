import prisma from '../lib/prisma';
import Banner from '../components/Banner';
import links from '../data/external-links.json';

export default async function Home() {
  const members_count = await prisma.user.count();
  const ancien_count = await prisma.user.count({
    where: {
      grad_year: { lte: new Date().getFullYear() },
    },
  });

  return (
    <div>
      <Banner src="/img/banners/1.jpg" />

      <h1 className="header">
        <span><b>D</b>ouble</span>
        <span><b>M</b>ajeure</span>
        <span><b>M</b>athématiques</span>
        <span><b>I</b>nformatique</span>
      </h1>

      <p>
        Site <i>non-officiel</i> DMMI/PIMA.
        <br />"Æ PIMA" : "Anciens-Etudiants-du-Parcours-PIMA"
      </p>

      <hr />

      <p>
        Ce site est maintenu par les étudiants de la double majeure en Mathématiques et Informatique à Sorbonne Université, également connue sous l'acronyme PIMA. L'objectif de ce site est de rassembler des ressources utiles, telles que des <span className="accent">comptes rendus</span> au format PDF rédigés par d'anciens étudiants, des instructions pour obtenir des documents administratifs tels que les <span className="accent">descriptifs des Unités d'Enseignement</span> (UE), des <span className="accent">conseils pour la rédaction</span> de lettres de recommandation, de lettres de motivation, de CV, et bien plus encore.
      </p>

      <p>
        Sur ce site, vous trouverez également des informations sur les <span className="accent">procédures d'admission</span>, des conseils, des documents partagés sur le drive, et même la possibilité de <span className="accent">contacter d'anciens étudiants</span> de la PIMA qui ont intégré les écoles que vous visez. De plus, nous prévoyons également de fournir des <span className="accent">conseils sur les documents administratifs</span> et sur la manière de naviguer au mieux dans les méandres de l'administration de la Sorbonne.
      </p>

      <p>
        L'idée maîtresse qui sous-tend ce projet est que, une fois que vous aurez également réussi à intégrer une école, vous serez encouragés à contribuer au site en partageant vos expériences et connaissances pour aider les générations futures d'étudiants de la PIMA.
      </p>

      <p>
        Actuellement, l'accès au site est exclusif, ce qui signifie que vous devez créer un compte pour accéder aux informations existantes et ajouter de nouvelles ressources. Cette approche vise à garantir que les contacts des anciens étudiants et les informations demeurent aussi confidentiels que possible. Nous voulons également nous assurer que les personnes extérieures à la PIMA, pour ne pas les nommer, ne puissent pas accéder à nos précieuses données.
      </p>

      <p>
        Dans l'ensemble, ce site offre un véritable réseau et une source de connaissances précieuses pour la vie académique et professionnelle des étudiants de la PIMA, à condition qu'un nombre suffisant d'étudiants s'y inscrivent.
      </p>

      <h3>En chiffres :</h3>

      <p>
        Actuellement, pima.ozieblowski.dev a{' '}
        <span className="accent">
          <strong>{members_count}</strong> membres
        </span>, dont{' '}
        <strong>{ancien_count}</strong> qui ont obtenu leur licence en {new Date().getFullYear()} ou avant. (i.e. les anciens)
      </p>

      <h2>Contribuer :</h2>
      <p>
        Pour ajouter du contenu à ce site web, veuillez suivre les instructions sur la page <b>GitHub</b> (<a target="_blank" href="https://github.com/Angramme/pima-site">lien</a>). Pour ajouter du contenu sur le <b>Google Drive</b> contacter un des admins pour recevoir les droits. Pour suggerer des changement a ce site web, veuillez contacter les admins. Pour connaitre les admins, chercher simplement "admin" sur la page "anciens" ou consultez la page "login"/"connexion".
      </p>

      <h2>Liens externes : </h2>
      <p>🔒 protegé</p>
      {Object.entries(links).map(([category, lks]) => (
        <div key={category}>
          <h3>{category} : </h3>
          <ul>
            {Object.keys(lks).map((lk) => (
              <li key={lk}>
                {lk} : <a href={`/restricted/external/${lk}`} target="_blank" rel="noreferrer">lien</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
