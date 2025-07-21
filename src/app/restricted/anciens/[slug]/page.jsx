import prisma from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../api/auth/[...nextauth]/route';
import { notFound } from 'next/navigation';
import Markdown from '../../../../../components/Markdown';
import { user_data_into_forms } from '../../../../../lib/transformers';
import AdminActions from './admin-actions';

export default async function AncienPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=/restricted/anciens/${params.slug}`,
        permanent: false,
      },
    };
  }

  const subject = await prisma.user.findFirst({
    where: {
      id: params.slug,
    },
    select: {
      // never show
      password: false,
      // show if admin
      admin: session.user.admin,
      updatedAt: session.user.admin,
      login: session.user.admin,
      id: session.user.admin,
      // safe info
      prenom: true,
      nom: true,
      email: true,
      contact: true,
      grad_year: true,
      nationalite: true,
      moyenneL2: true,
      moyenneL3: true,
      admis: true,
      choisi: true,
      travails: true,
      description: true,
      createdAt: true,
    },
  });

  if (!subject) {
    notFound();
  }

  const sectioned = user_data_into_forms(subject).map(({ n, l }) => ({
    n,
    l: l.filter(({ k }) => k !== 'description' && subject && subject.hasOwnProperty(k)),
  }));

  return (
    <div>
      <h1>
        {subject?.prenom} {subject?.nom || '😎🤐'}
      </h1>

      {sectioned.map(({ n, l: list }) => (
        <fieldset key={n}>
          <legend>{n}</legend>
          <table>
            <tbody>
              {list.map(({ k, l, v }) => (
                <tr key={k}>
                  <th>{l}</th>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </fieldset>
      ))}

      {session.user.admin && <AdminActions subject={subject} user={session.user} />}

      <h2>Conseils / description : </h2>
      <Markdown markdown={subject?.description || ''} />
    </div>
  );
}
