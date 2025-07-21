'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { accept_cookies } from './actions';

export default function Cookies() {
  const [cookiesAccepted, setCookiesAccepted] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const accepted = document.cookie.includes('cookies_accepted=true');
    setCookiesAccepted(accepted);
  }, []);

  const handleAccept = async () => {
    await accept_cookies();
    setCookiesAccepted(true);
  };

  if (cookiesAccepted || pathname.startsWith('/reglementation')) {
    return null;
  }

  return (
    <div className="cookies">
      <div>
        <h2>Cookies</h2>
        En utilisant ce site web vous acceptez l'utilisation des cookies essentiels pour son
        fonctionnement, pour plus d'informations veuillez consulter le{' '}
        <a target="_blank" href="/reglementation/cookie_policy">
          Cookie Policy
        </a>
        <br />
        <br />
        <form action={handleAccept}>
          <button type="submit">Je donne mon accord</button>
        </form>
      </div>
    </div>
  );
}
