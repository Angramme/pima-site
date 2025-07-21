import '../styles/globals.css';
import Nav from '../components/Nav';
import Cookies from '../components/Cookies';
import { cookies } from 'next/headers';
import {-Next-Auth-action-for-getting-the-session-} from "next-auth/next"
import { authOptions } from './api/auth/[...nextauth]/route';


export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  const cookies_accepted = cookies().get("cookies_accepted")?.value === "true";

  return (
    <html lang="en">
      <body>
        <div id="cont">
          <Nav />
          <Cookies />
          {session?.user?.sleeping && (
            <div className="pls-wake-up">
              <div>
                Votre compte est pour l'instant caché sur le serveur, pour publier votre compte, mettez a jour vos données dans la section utilisateur en haut a droite!
              </div>
              <div>
                Une fois dans la section utilisateur, cherchez la section "Mes donnes" et remplissez vos informations. Un fois terminé, appuyez sur "Mettre a jour".
              </div>
            </div>
          )}
          <div id="slot-cont">{children}</div>
          <footer>
            <hr />
            Copyright &copy; 2023-{new Date().getFullYear()} Kacper Ozieblowski <br />
            En utilisant ce site et les services y présents vous acceptez la <a href="/reglementation">réglementation</a>
          </footer>
        </div>
      </body>
    </html>
  );
}
