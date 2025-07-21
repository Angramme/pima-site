import { redirect, notFound } from 'next/navigation';
import links_r from '../../../../../data/external-links.json';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../api/auth/[...nextauth]/route';

const links = Object.assign({}, ...Object.values(links_r));

export default async function ExternalRedirectPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=/restricted/external/${params.slug}`,
        permanent: false,
      },
    };
  }

  if (params.slug in links) {
    redirect(links[params.slug]);
  } else {
    notFound();
  }
}
