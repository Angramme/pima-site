import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import Banner from '../../../../components/Banner';
import AnciensList from './anciens-list';

export default async function AnciensPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/login?redirect=/restricted/anciens',
        permanent: false,
      },
    };
  }

  const where = session.user.admin ? {} : { sleeping: false };

  const users = await prisma.user.findMany({
    where,
    select: {
      // never show
      login: false,
      password: false,
      // show if admin
      updatedAt: session.user.admin,
      sleeping: session.user.admin,
      // safe info
      admin: true,
      id: true,
      prenom: true,
      nom: true,
      email: true,
      contact: true,
      grad_year: true,
      nationalite: true,
      admis: true,
      choisi: true,
      description: true,
      createdAt: true,
      travails: true,
      moyenneL2: true,
      moyenneL3: true,
    },
  });

  return (
    <div>
      <Banner src="/img/banners/4.jpg" title="Anciens" />
      <h1>Repertoire des anciens :</h1>
      <AnciensList users={users} />
    </div>
  );
}
