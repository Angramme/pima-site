'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await signIn('credentials', {
      redirect: false,
      login: formData.get('login'),
      password: formData.get('password'),
    });

    if (result.error) {
      setError('Mot de passe ou login incorrect!');
    } else {
      router.refresh();
    }
  };

  return (
    <form method="POST" onSubmit={handleSubmit}>
      <fieldset>
        {error && <p className="error">{error}</p>}
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="user">Login:</label>
              </td>
              <td>
                <input type="text" id="user" name="login" /> <br />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="pwd">Mot de passe:</label>
              </td>
              <td>
                <input type="password" id="pwd" name="password" /> <br />
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <input type="submit" id="submit" value="Connexion" />
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <input
                  type="button"
                  id="forgot"
                  value="mdb ou identifiant oublié"
                  disabled
                />
              </td>
            </tr>
          </tbody>
        </table>
      </fieldset>
    </form>
  );
}
