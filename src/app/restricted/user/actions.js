'use server';

import prisma from '../../../../lib/prisma';
import { check_password, end_session, hash_password } from '../../../../lib/sessions';
import { capFirst, generate_password, zip } from '../../../../lib/utils';
import { redirect } from 'next/navigation';
import { sendCreationMail } from '../../../../lib/mail';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';
import { signOut } from 'next-auth/react';

export async function disconnect() {
  await signOut({ redirect: false });
  redirect('/');
}

export async function pwd_chg(formData) {
  const session = await getServerSession(authOptions);
  const old_pwd = formData.get('old_pwd');
  const new_pwd = formData.get('new_pwd');
  if (!session?.user || !old_pwd || !new_pwd) return { pwd_rst_missing: true };
  const user_id = await check_password(session.user.login, old_pwd.toString());
  if (!user_id) return { pwd_rst_incorrect: true };
  try {
    await prisma.user.update({
      where: { id: user_id },
      data: { password: hash_password(session.user.login, new_pwd.toString()) },
    });
  } catch (error) {
    console.error(error);
    return { pwd_rst_errror: `Prisma Error: ${error}` };
  }
  return { pwd_rst_success: true };
}

export async function update_data(formData) {
  const session = await getServerSession(authOptions);
  const keys_to_update = [
    'admis',
    'choisi',
    'grad_year',
    'email',
    'contact',
    'nom',
    'prenom',
    'nationalite',
    'description',
    'travails',
    'moyenneL2',
    'moyenneL3',
    'public_description',
  ];
  const list_entries = ['nationalite', 'contact', 'admis', 'travails'];
  const number_entries = ['grad_year', 'moyenneL2', 'moyenneL3'];
  const bool_entries = ['public_description'];

  if (!session?.user) return { update_failure: 'user logged out!' };
  if (keys_to_update.some((k) => !formData.has(k) && !bool_entries.includes(k)))
    return { update_failure: 'Invalid form data submitted!' };

  let prisma_data = Object();
  prisma_data['sleeping'] = false;
  for (let k of keys_to_update) prisma_data[k] = formData.get(k)?.toString().trim();
  /// @ts-ignore
  for (let k of list_entries) prisma_data[k] = prisma_data[k].split(',').map((x) => x.trim());
  for (let k of number_entries) prisma_data[k] = Number(prisma_data[k]);
  for (let k of bool_entries) prisma_data[k] = prisma_data[k] ? true : false;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: prisma_data,
    });
    revalidatePath('/restricted/user');
  } catch (error) {
    console.error(error);
    return { update_failure: `Prisma Error: ${error}` };
  }

  return { update_success: true };
}

export async function delete_account() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { delete_failure: "Vous n'etez pas connectés" };
  try {
    await prisma.session.deleteMany({
      where: { userId: session.user.id },
    });
    await prisma.user.delete({
      where: { id: session.user.id },
    });
    revalidatePath('/restricted/user');
  } catch (error) {
    console.error(error);
    return { delete_failure: `Prisma Error: ${error}` };
  }
  return { delete_success: true };
}

export async function create_account(formData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { creation_failure: 'user logged out' };
  if (!session.user.admin) return { creation_failure: 'user does not have permissions' };

  if (
    !formData.has('prenom') ||
    !formData.has('nom') ||
    !formData.has('grad_year') ||
    !formData.has('password')
  )
    return { creation_failure: 'form data incomplete' };

  const prenom = formData.get('prenom')?.toString() || '';
  const nom = formData.get('nom')?.toString() || '';
  let login = `${nom.toLowerCase()}-${prenom.toLowerCase()}`;
  const grad_year = Number(formData.get('grad_year')?.toString()) || 0;
  const password_hash = hash_password(login, formData.get('password')?.toString() || '');

  // make login unique
  const logins = (
    await prisma.user.findMany({
      where: {
        login: {
          contains: login,
        },
      },
      select: { login: true },
    })
  ).map(({ login }) => login);
  let i = 0;
  while (logins.includes(login)) login = `${nom.toLowerCase()}-${prenom.toLowerCase()}-${i++}`;

  try {
    await prisma.user.create({
      data: { prenom, nom, login, grad_year, password: password_hash },
    });
    revalidatePath('/restricted/user');
  } catch (error) {
    console.error(error);
    return { creation_failure: `Prisma Error: ${error}` };
  }

  return { creation_success: true, new_account_login: login };
}

export async function mass_create_accounts(formData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { creation_failure: 'user logged out' };
  if (!session.user.admin) return { creation_failure: 'user does not have permissions' };

  if (!formData.has('emails') || !formData.has('grad_year'))
    return { creation_failure: 'form data incomplete' };

  const emails_s = formData
    .getAll('emails')
    ?.map((s) => s?.toString())
    .flatMap((s) => s.split(';'))
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (emails_s.length == 0)
    return { creation_failure: 'no emails provided, invalid request!' };

  const email_correct = (s) => s.split('@')[1] == 'etu.sorbonne-universite.fr';
  if (!emails_s.every(email_correct)) {
    return {
      creation_failure:
        'invalid email address host found (does not match etu.sorbonne-universite.fr) mismatches: [' +
        emails_s.filter((s) => !email_correct(s)).join('; ') +
        ']',
    };
  }

  const prenom_nom = emails_s
    .map((s) => s.split('@')[0].split('.'))
    .map(([pre, nom]) => [capFirst(pre.replaceAll('_', ' ').trim()), capFirst(nom.replaceAll('_', ' ').trim())]);

  const unique_logins = await Promise.all(
    prenom_nom
      .map(([prenom, nom]) => (nom + ' ' + prenom).replaceAll(' ', '-').toLowerCase())
      .map(async (login_o) => {
        // make it unique
        const clashes = (
          await prisma.user.findMany({
            where: {
              login: {
                contains: login_o,
              },
            },
            select: { login: true },
          })
        ).map(({ login }) => login);
        let login = login_o;
        let i = 0;
        while (clashes.includes(login))
          // very inefficient but we will not have thousands of users with the same name (we wont have thousands of users)
          login = `${login_o}-${i++}`;
        return login;
      })
  );

  const passwords = Array.from(unique_logins, (_login) => generate_password());
  /** @type {string[]} */
  const password_hashes = zip([unique_logins, passwords])
    // @ts-ignore
    .map(([login, pwd]) => hash_password(login, pwd));

  // prenom, nom, login, pwd hash, pwd clear, email
  /** @type {[string, string, string, string, string, string][]} */
  const creation_data = zip([unique_logins, prenom_nom, password_hashes, passwords, emails_s])
    //@ts-ignore
    .map(([login, [prenom, nom], pwshash, clearpwd, email]) => [
      prenom,
      nom,
      login,
      pwshash,
      clearpwd,
      email,
    ]);

  const grad_year = Number(formData.get('grad_year')?.toString()) || 0;

  try {
    await prisma.user.createMany({
      data: creation_data.map(([prenom, nom, login, pwdhash, _clearpwd, email]) => ({
        prenom,
        nom,
        login,
        grad_year,
        password: pwdhash,
        email,
      })),
    });
    revalidatePath('/restricted/user');
  } catch (error) {
    console.error(error);
    return { creation_failure: `Prisma Error: ${error}` };
  }

  try {
    await Promise.all(
      creation_data.map(([prenom, nom, login, _pwdhash, clearpwd, email]) =>
        sendCreationMail(email, login, nom, prenom, clearpwd)
      )
    );
  } catch (error) {
    // cleanup, since error occured, return to the previous state
    await prisma.user.deleteMany({
      where: {
        login: {
          in: unique_logins,
        },
      },
    });

    console.error(error);
    return { creation_failure: `SMTP [nodemailer] Error: ${error}` };
  }

  return { creation_success: true, new_account_login: unique_logins.join(';') };
}
