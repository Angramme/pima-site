import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import prisma from '../../../../lib/prisma';
import { redirect } from 'next/navigation';
import UserPage from './user-page';

export default async function User() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?redirect=/restricted/user');
  }

  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
    select: {
      admis: true,
      choisi: true,
      grad_year: true,
      public_description: true,
      email: true,
      contact: true,
      nom: true,
      prenom: true,
      nationalite: true,
      description: true,
      travails: true,
      moyenneL2: true,
      moyenneL3: true,
      login: true,
      admin: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return <UserPage user={user} />;
}
