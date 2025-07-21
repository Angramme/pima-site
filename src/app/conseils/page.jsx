import prisma from '../../lib/prisma';
import Banner from '../../components/Banner';
import Markdown from '../../components/Markdown';
import Rolldown from '../../components/Rolldown';
import { getServerSession } from "next-auth/next"
import { authOptions } from '../api/auth/[...nextauth]/route';
import Link from 'next/link';

export default async function Conseils() {
  const session = await getServerSession(authOptions);
  const loggedIn = !!session;

  const descs = await prisma.user.findMany({
    where: {
      sleeping: false,
      description: {
        not: 'TODO 😴', // not default value
      },
      grad_year: {
        lte: new Date().getFullYear(),
      },
      ...(loggedIn ? {} : { public_description: true }),
    },
    select: {
      id: true,
      choisi: true,
      grad_year: true,
      prenom: true,
      description: true,
    },
    orderBy: {
      grad_year: 'desc',
    },
  });

  return (
    <div>
      <Banner title="Conseils" src="/img/banners/5.jpg" />

      <h1>Conseils des anciens</h1>

      <p>
        Conseils des anciens du parcours listés par l'ordre de plus récent (année fin L3).
      </p>

      {!loggedIn && (
        <p>
          ⚠️ Vous voyez uniquement les conseils des anciens qui ont été partagés publiquement. <Link href="/login">Connectez-vous</Link> pour voir tous les conseils. ⚠️
        </p>
      )}

      <br />

      {descs.map((des) => (
        <div className="conseil" key={des.id}>
          <hr />
          <h3>
            <a href={`/restricted/anciens/${des.id}`}>{des.prenom}</a>
            <span style={{ float: 'right', fontSize: '80%' }}>
              {des.choisi}; PIMA {des.grad_year - 3}-{des.grad_year}
            </span>
          </h3>

          <Rolldown>
            <Markdown markdown={des.description} />
          </Rolldown>
        </div>
      ))}

      {descs.length === 0 && (
        <>
          {loggedIn ? (
            <p>Personne n'a encore partagé de conseil.</p>
          ) : (
            <p>
              Aucun conseil n'est publique pour le moment. Connectez-vous pour voir les conseils des anciens.
            </p>
          )}
        </>
      )}
    </div>
  );
}
