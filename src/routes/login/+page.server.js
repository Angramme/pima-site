import { fail, redirect } from "@sveltejs/kit";
import { log_in_user } from "$lib/sessions";
import prisma from "$lib/prisma";

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url }) {
  if (locals.user) {
    const redir = url.searchParams.get("redirect") || "/";
    throw redirect(302, redir);
  }

  const admins = prisma.user.findMany({
    where: { admin: true },
    select: { nom: true, prenom: true, email: true },
  });

  return {
    streamed: {
      admins,
    },
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, cookies, url }) => {
    const data = await request.formData();
    const login = data.get("login");
    const pwd = data.get("password");

    if (!login || !pwd) return fail(400, { login, missing: true });

    const sessionID = await log_in_user(login.toString(), pwd.toString());
    if (!sessionID) return fail(400, { login, incorrect: true });

    cookies.set("sessionID", sessionID);

    const redir = url.searchParams.get("redirect");
    if (redir) throw redirect(302, redir);

    return { success: true };
  },
};
