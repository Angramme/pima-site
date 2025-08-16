import prisma from '$lib/prisma'

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
            ...(loggedIn ? {} : {public_description:true})
        },
        select: {
            // never show
            login: false,
            password: false,
            email: false,
            contact: false,
            admis: false,
            nationalite: false,
            createdAt: false,
            // show if admin
            admin: false,
            updatedAt: false,
            sleeping: false,
            // show if logged in
            id: loggedIn,
            nom: loggedIn,
            // show no matter what
            choisi: true,
            grad_year: true,
            prenom: true,
            description: true,
        },
        orderBy: {
            grad_year: "desc",
        }
    });

    return {
        streamed: {
            descs: descs,
        }
    }
}