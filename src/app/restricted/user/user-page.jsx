'use client';

import { useState } from 'react';
import Banner from '../../../../components/Banner';
import Markdown from '../../../../components/Markdown';
import { user_data_into_forms } from '../../../../lib/transformers';
import { generate_password } from '../../../../lib/utils';
import {
  disconnect,
  pwd_chg,
  update_data,
  delete_account,
  create_account,
  mass_create_accounts,
} from './actions';

export default function UserPage({ user }) {
  const [form, setForm] = useState({});
  const [descMarkdown, setDescMarkdown] = useState(user?.description || '');
  const [newPwdVal, setNewPwdVal] = useState('');
  const [conPwdVal, setConPwdVal] = useState('');
  const [userAgreed, setUserAgreed] = useState(false);
  const [deleteAccountBtn, setDeleteAccountBtn] = useState(true);

  const sections = user ? user_data_into_forms(user) : null;

  const handleAction = async (action, formData) => {
    const result = await action(formData);
    setForm(result);
  };

  return (
    <div>
      <Banner />
      <h1>Donnes et parametres utilisateur</h1>

      {/* Server message sesction */}
      {form?.pwd_rst_missing && <p className="error">Manque de mot de passe!</p>}
      {form?.pwd_rst_incorrect && <p className="error">Mot de passe incorrect!</p>}
      {form?.pwd_rst_success && <p className="success">Changement réussi!</p>}
      {form?.disconnected && <p className="success">Déconnexion réussie!</p>}
      {form?.update_success && <p className="success">Mise a jour réussie!</p>}
      {form?.update_failure && (
        <p className="error">Erreur de mise à jour: "{form.update_failure}""</p>
      )}

      <form action={() => handleAction(disconnect)}>
        <fieldset>
          <legend>Deconnexion</legend>
          <div>
            {form?.disconnected && <p className="success">Déconnexion réussie!</p>}
            <input type="submit" value="Deconnexion" />
          </div>
        </fieldset>
      </form>

      <hr />

      <form action={(formData) => handleAction(update_data, formData)}>
        <fieldset>
          <legend>Mes donnes</legend>
          <p className="info">
            {' '}
            Attention, pour faire des changement il faut imperativement soumettre les données avec
            le bouton "Mettre a jour" en bas.{' '}
          </p>
          {!sections ? (
            <p className="error">Erreur interne! Donnes indisponibles!</p>
          ) : (
            sections.map(({ n, l: list }) => (
              <fieldset key={n}>
                <legend>{n}</legend>
                <table>
                  <tbody>
                    {list.map(({ k: key, l: label, v: value, t: type, ro: read_only }) => (
                      <tr key={key}>
                        <td>
                          <label htmlFor={`input_${key}`}>{label}</label>
                        </td>
                        {type === 'textlist' || type === 'longtext' ? (
                          <td>
                            {type === 'textlist' && (
                              <div className="info">lister en séparant par des ","</div>
                            )}
                            <textarea
                              name={key}
                              id={`input_${key}`}
                              rows={type === 'textlist' ? 3 : 12}
                              cols="40"
                              defaultValue={value}
                            ></textarea>
                          </td>
                        ) : type === 'markdown' ? (
                          <>
                            <h4>Markdown : </h4>
                            <textarea
                              value={descMarkdown}
                              onChange={(e) => setDescMarkdown(e.target.value)}
                              name={key}
                              id={`input_${key}`}
                              rows={12}
                              cols="40"
                            ></textarea>
                            <h4>Preview : </h4>
                            <div className="markdown-preview">
                              <Markdown markdown={descMarkdown} />
                            </div>
                          </>
                        ) : type === 'date' ? (
                          <td>{value}</td>
                        ) : type === 'checkbox' ? (
                          <td>
                            <input
                              name={key}
                              id={`input_${key}`}
                              type={type}
                              defaultChecked={value}
                              readOnly={read_only}
                            />
                          </td>
                        ) : (
                          <td>
                            <input
                              name={key}
                              id={`input_${key}`}
                              type={type}
                              defaultValue={value}
                              readOnly={read_only}
                            />
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </fieldset>
            ))
          )}
          <fieldset>
            <legend>Soumettre</legend>
            {form?.update_success && <p className="success">Mise a jour réussie!</p>}
            {form?.update_failure && (
              <p className="error">Erreur de mise à jour: "{form.update_failure}""</p>
            )}
            <table>
              <tbody>
                <tr>
                  <td>
                    <input
                      checked={userAgreed}
                      onChange={(e) => setUserAgreed(e.target.checked)}
                      id="agreement"
                      type="checkbox"
                    />
                    <label htmlFor="agreement">
                      <u>J'ai pris conaissance</u> de la réglementation{' '}
                      <a href="/reglementation" target="_blank">
                        ici
                      </a>{' '}
                      et <u>je donne mon accord</u> pour utilisation de mes donnees plus haut.
                    </label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <input
                      type="submit"
                      disabled={!userAgreed}
                      id="mettre_a_jour"
                      value="Mettre a jour"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </fieldset>
        </fieldset>
      </form>

      <hr />

      <form action={(formData) => handleAction(pwd_chg, formData)}>
        <fieldset id="pwd_chg">
          <legend>Reinitialisation mot de passe</legend>
          {form?.pwd_rst_missing && <p className="error">Manque de mot de passe!</p>}
          {form?.pwd_rst_incorrect && <p className="error">Mot de passe incorrect!</p>}
          {form?.pwd_rst_success && <p className="success">Changement réussi!</p>}
          <table>
            <tbody>
              <tr>
                <td>
                  <label htmlFor="old_pwd">Ancien mot de passe</label>
                </td>
                <td>
                  <input name="old_pwd" id="old_pwd" type="password" />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="new_pwd">Nouveau mot de passe</label>
                </td>
                <td>
                  <input
                    value={newPwdVal}
                    onChange={(e) => setNewPwdVal(e.target.value)}
                    name="new_pwd"
                    id="new_pwd"
                    type="password"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="rep_pwd">Confirmer nouveau mot de passe</label>
                </td>
                <td>
                  <input
                    value={conPwdVal}
                    onChange={(e) => setConPwdVal(e.target.value)}
                    id="rep_pwd"
                    type="password"
                  />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <input
                    type="submit"
                    value="Changer"
                    disabled={newPwdVal !== conPwdVal}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </fieldset>
      </form>

      <hr />

      <form
        action={async () => {
          const yes = confirm(
            "Veuillez vous vraiment supprimer votre compte? Attention cette opération n'est pas réversible."
          );
          if (!yes) return;
          handleAction(delete_account);
        }}
      >
        <fieldset className="danger">
          <legend>Supprimer ce compte</legend>
          {form?.delete_failure && (
            <p className="error">Erreur serveur: "{form.delete_failure}"</p>
          )}
          {form?.delete_success && <p className="success">Compte supprimé!</p>}
          <p className="info">
            Pour supprimer votre compte, debloquez d'abbord le bouton "Supprimer ce compte" avec
            le bouton "Debloquer". Ensuite appuyez sur "Supprimer ce compte". Enfin confirmez que
            vous voulez supprimer votre compte.
          </p>
          <input
            type="button"
            value="Debloquer"
            onClick={() => {
              setDeleteAccountBtn(false);
            }}
          />
          <input
            type="submit"
            value="Supprimer ce compte"
            disabled={deleteAccountBtn}
          />
        </fieldset>
      </form>

      <hr />

      {user?.admin && (
        <>
          <form action={(formData) => handleAction(create_account, formData)}>
            <fieldset className="admin">
              <legend>Admin</legend>
              <fieldset>
                <legend>Créer un compte</legend>
                {form?.creation_failure && (
                  <p className="error">Erreur serveur: "{form.creation_failure}"</p>
                )}
                {form?.creation_success && (
                  <p className="success">
                    Creation réussie! login: {form.new_account_login}{' '}
                  </p>
                )}
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <label htmlFor="create_prenom">prenom</label>
                      </td>
                      <td>
                        <input name="prenom" id="create_prenom" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="create_nom">nom</label>
                      </td>
                      <td>
                        <input name="nom" id="create_nom" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="create_grad_year">année fin L3</label>
                      </td>
                      <td>
                        <input name="grad_year" id="create_grad_year" type="number" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="create_pwd">password</label>
                      </td>
                      <td>
                        <input
                          name="password"
                          id="create_pwd"
                          type="string"
                          defaultValue={generate_password()}
                        />
                      </td>
                      <td>
                        <input
                          type="button"
                          onClick={() =>
                            navigator.clipboard.writeText(document.getElementById('create_pwd').value)
                          }
                          value="copy"
                        />
                      </td>
                      <td>
                        <input
                          type="button"
                          onClick={() =>
                            (document.getElementById('create_pwd').value = generate_password())
                          }
                          value="regenerate"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <input type="submit" value="Créer" />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p className="info">
                  Copiez le mot de passe, cliquez sur creer puis copiez le login.
                </p>
              </fieldset>
            </fieldset>
          </form>
          <form action={(formData) => handleAction(mass_create_accounts, formData)}>
            <fieldset className="admin">
              <legend>Admin</legend>
              <fieldset>
                <legend>Créer des comptes à partir des emails</legend>
                {form?.creation_failure && (
                  <p className="error">Erreur serveur: "{form.creation_failure}"</p>
                )}
                {form?.creation_success && (
                  <p className="success">
                    Creation réussie! logins: {form.new_account_login}{' '}
                  </p>
                )}
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <label htmlFor="create_emails">emails (separate with ";")</label>
                      </td>
                      <td>
                        <textarea name="emails" id="create_emails" rows={3} cols={40}></textarea>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="create_grad_year2">année fin L3</label>
                      </td>
                      <td>
                        <input name="grad_year" id="create_grad_year2" type="number" />
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <input type="submit" value="Créer" />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p className="info">Entrez des emails des personnes et l'année de leur L3</p>
              </fieldset>
            </fieldset>
          </form>
        </>
      )}
    </div>
  );
}
