import prisma from "$lib/prisma";
import { createHash } from "node:crypto";
import { PASSWORD_HASH_SALT } from "$env/static/private";

const SESSION_ID_COOKIE = "sessionID";

/**
 * hashes password with the hash function
 * @param {string} usr login
 * @param {string} pwd password
 */
export function hash_password(usr, pwd) {
  // The SHA-3 hash algorithm is the latest member of the Secure Hash Algorithm family.
  // SHA-3 was originally called “Keccak”. The Keccak algorithm is the winner in the
  // NIST hash function competition.
  const hash = createHash("sha3-256");
  hash.update(usr + pwd + PASSWORD_HASH_SALT);
  const hex = hash.digest("hex");
  return hex;
}

/**
 * Logs the user in and returns a sessionID
 * @param {string} user_login login
 * @param {string} user_pwd  paszsword
 */
export async function log_in_user(user_login, user_pwd) {
  // verify password and retreive user id
  const user_id = await check_password(user_login, user_pwd);
  if (!user_id) return null;

  // delete all older sessions
  await prisma.session.deleteMany({
    where: { user_id },
  });

  // create new session
  const session = await prisma.session.create({
    data: { user_id },
  });
  return session.id;
}

/**
 * Get the user associated to the sessionID
 * @param {import("@sveltejs/kit").Cookies} cookies
 */
export async function session_get_user(cookies) {
  const sessionID = cookies.get(SESSION_ID_COOKIE);
  if (!sessionID) return null;
  const rec = await prisma.session.findFirst({
    where: { id: sessionID },
    select: {
      user: {
        select: {
          // verify if is consistent with app.d.ts,},
          id: true,
          prenom: true,
          nom: true,
          admin: true,
          login: true,
          sleeping: true,
        },
      },
      createdAt: true,
    },
  });
  if (!rec) return null;
  // check if lived for more than 3 hours
  const now = new Date().getTime();
  const diff = now - rec.createdAt.getTime();
  if (diff > 3 * 60 * 60 * 1000) {
    prisma.session.delete({
      where: { id: sessionID },
    });
    return null;
  }
  return rec.user;
}

/**
 * Verifies password and returns users id if correct, null otherwise
 * @param {string} login login
 * @param {string} pwd  password
 */
export async function check_password(login, pwd) {
  const user = await prisma.user.findFirst({
    where: {
      login: login,
    },
    select: {
      id: true,
      password: true,
    },
  });
  if (!user) return null;
  if (hash_password(login, pwd) != user.password) return null;

  return user.id;
}

/**
 *
 * @param {import("@sveltejs/kit").Cookies} cookies
 */
export async function end_session(cookies) {
  const sessionID = cookies.get(SESSION_ID_COOKIE);
  if (!sessionID) return false;
  await prisma.session.delete({
    where: { id: sessionID },
  });
  return true;
}
