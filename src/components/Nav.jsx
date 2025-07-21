'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Nav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const pages = [
    ['/', 'accueil'],
    ['/restricted/anciens', 'anciens'],
    ['/conseils', 'conseils'],
    ['/restricted/external/Google Drive', 'drive'],
    // ["/restricted/faq", "FAQ"],
  ];

  return (
    <div id="nav-cont">
      <nav>
        <div className="logo">
          <span>Æ PIMA</span>
        </div>
        {pages.map((p) => (
          <div key={p[0]}>
            <Link href={p[0]} className={pathname == p[0] ? 'current' : ''}>
              {' '}
              {p[1]}{' '}
            </Link>
          </div>
        ))}
        <div className="login">
          {session ? (
            <Link href="/restricted/user"> {session.user.prenom}</Link>
          ) : (
            <Link href="/login"> connexion </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
