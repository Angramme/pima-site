'use client';

import { useState } from 'react';
import { user_status_change, user_delete } from './actions';

export default function AdminActions({ subject, user }) {
  const [userInput, setUserInput] = useState('user login');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleStatusChange = async (formData) => {
    const { success, error } = await user_status_change(formData);
    setSuccess(success);
    setError(error);
  };

  const handleDelete = async (formData) => {
    const { success, error } = await user_delete(formData);
    setSuccess(success);
    setError(error);
  };

  return (
    <div>
      <h2>Admin</h2>
      <fieldset>
        {error && <p className="error">Erreur serveur: "{error}"</p>}
        {success && <p className="success">Update successfull!!!! </p>}
        <legend>Admin actions</legend>
        <fieldset>
          <legend>admin privilages</legend>
          <form action={handleStatusChange}>
            <input name="user_id" type="text" value={subject?.id} hidden />
            <button name="admin_rights_on" disabled={subject?.admin}>
              Give admin permissions
            </button>
            <button name="admin_rights_off" disabled={!subject?.admin || subject.id == user.id}>
              Remove admin permissions
            </button>
          </form>
        </fieldset>
        <fieldset>
          <legend>delete user</legend>
          <form action={handleDelete}>
            <input name="user_id" type="text" value={subject?.id} hidden />
            <input value={userInput} onChange={(e) => setUserInput(e.target.value)} type="text" />
            <button
              name="delete_user"
              disabled={userInput != subject?.login || subject?.admin || subject?.id == user.id}
            >
              Delete this user
            </button>
          </form>
        </fieldset>
      </fieldset>
    </div>
  );
}
