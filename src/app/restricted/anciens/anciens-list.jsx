'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { parse_ast, ast_match } from '../../../lib/search';

export default function AnciensList({ users }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showHint, setShowHint] = useState(false);

  const astTerm = useMemo(() => parse_ast(searchTerm), [searchTerm]);

  const filteredUsers = useMemo(() => {
    if (!astTerm) return users;
    return users.filter((o) => ast_match(astTerm, Object.values(o), o));
  }, [astTerm, users]);

  return (
    <div>
      <p>
        Exemples d'utilisation{' '}
        <button onClick={() => setShowHint(!showHint)}>
          {showHint ? 'cacher' : 'afficher'}
        </button>
        :
      </p>
      {showHint && (
        <div>
          <ul>
            <li>Trouver une personne: taper son nom ou prenom, par exemple "fred"</li>
            <li>
              Recherche par mot clef: taper le mot clef, par exemple "ingé", cela cherche dans
              toutes les proprietes
            </li>
            <li>
              Sinon il y a 3 operateurs
              <ul>
                <li>| ou logique</li>
                <li>& et logique</li>
                <li>: inclusion</li>
              </ul>
            </li>
            <li>
              Trouver tout le monde admis a l'X: taper "admis : (poly | X)" (i.e le champ
              "admis" contient "poly" ou "X")
            </li>
            <li>
              Trouver des Telecom admis en 2023: taper "(admis:tele) & (grad_year:2023)".
            </li>
            <li>
              Trouver des Telecom admis strictement apres 2022: taper "(admis:tele) &
              (grad_year:&gt;2022)".
            </li>
            <li>Trouver des gens de nationalié Polonaise: taper "nationalite:(pl | polo)"</li>
            <li>
              Trouver tout le monde avec 18 de moyenne en L2 OU en L3: taper
              "(moyenneL2|moyenneL3):18"
            </li>
            <li>
              Trouver tout le monde avec au moins 15 de moyenne en L2 ET en L3: taper
              "(moyenneL2&moyenneL3):&gt;14"
            </li>
            <li>En general vous pouvez cherchez toutes les données :)</li>
          </ul>
          Voici les proprietes possibles:
          <ul>
            {users.length > 0 &&
              Object.keys(users[0]).map((k) => <li key={k}>{k}</li>)}
          </ul>
        </div>
      )}
      <p>
        Les informations présentes ont été fournies par les élèves eux-mêmes avec leur
        consentement.
      </p>
      Rechercher : <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /> -{' '}
      {filteredUsers.length} résultat{filteredUsers.length === 1 ? '' : 's'}
      <hr />
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>PIMA</th>
            <th>Suite</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((data) => (
            <tr key={data.id}>
              <td className={(data.sleeping ? 'sleeper ' : '') + (data.admin ? 'admin ' : '')}>
                {data.nom || '🤐'} {data.prenom}
              </td>
              <td>
                {data.grad_year - 3}-{data.grad_year}
              </td>
              <td>{data.choisi}</td>
              <td>
                <Link href={`/restricted/anciens/${data.id}`}>plus d'infos</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
