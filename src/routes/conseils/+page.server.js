import prisma from "$lib/prisma";

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, depends }) {
  depends("user:update");

  const loggedIn = locals.user ? true : false;

  // if(!locals.user) return { streamed: { descs: Promise.resolve([]) } }; // user is not logged in...

  let descs = prisma.user.findMany({
    where: {
      sleeping: false,
      description: {
        not: "TODO 😴", // not default value
      },
      grad_year: {
        lte: new Date().getFullYear(),
      },
      ...(loggedIn ? {} : { public_description: true }),
    },
    select: {
      // Fields for UserProfileModal, only available when logged in
      email: loggedIn,
      contact: loggedIn,
      nationalite: loggedIn,
      admis: loggedIn,
      moyenneL2: loggedIn,
      moyenneL3: loggedIn,
      travails: loggedIn,
      nom: loggedIn,
      id: loggedIn,

      // Fields always available for the card itself
      prenom: true,
      grad_year: true,
      choisi: true,
      description: true,
    },
    orderBy: {
      grad_year: "desc",
    },
  });

  return {
    streamed: {
      descs: descs,
    },
  };
}
