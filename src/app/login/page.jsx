import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth/next"
import { authOptions } from '../api/auth/[...nextauth]/route';
import prisma from '../../lib/prisma';
import Link from 'next/link';
import { LoginForm } from './login-form';

export default async function LoginPage({ searchParams }) {
  const session = await getServerSession(authOptions);

  if (session) {
    const redir = searchParams.redirect || '/';
    redirect(redir);
  }

  const admins = await prisma.user.findMany({
    where: { admin: true },
    select: { nom: true, prenom: true, email: true },
  });

  return (
    <div>
      <h2>Connexion</h2>
      <LoginForm />
      <p>
        Veuillez noter qu'en vous connectant sur ce site, vous acceptez l'utilisation de cookies essentiels. En utilisant ce site et les services qui y sont proposés, vous acceptez la{' '}
        <Link href="/reglementation">réglementation</Link>
      </p>
      <h3>Infos : </h3>
      <p>Pour créer un compte, veuillez prendre contact avec l'un des administrateurs : </p>
      <ul>
        {admins.map(({ nom, prenom, email }) => (
          <li key={email}>
            {nom} {prenom} :{' '}
            <button onClick={() => alert(`email = ${email}`)}>email </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
