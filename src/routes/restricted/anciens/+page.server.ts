import prisma from '$lib/prisma'

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, depends }) {
    depends("user:update");

    if(!locals.user) return { streamed: { users: Promise.resolve([]) } }; // user is not logged in...

    const where = locals.user.admin ? {} : {
        sleeping: false,
    };

    let users = prisma.user.findMany({
        where,
        select: {
            // never show
            login: false,
            password: false,
            // show if admin
            updatedAt: locals.user.admin,
            sleeping: locals.user.admin,
            // safe info
            admin: true,
            id: true,
            prenom: true,
            nom: true,
            email: true,
            contact: true,
            grad_year: true,
            nationalite: true,
            admis: true,
            choisi: true,
            description: true,
            createdAt: true,
            travails: true,
            moyenneL2: true,
            moyenneL3: true,
        },
    });

    return {
        streamed: {
            users: users,
        }
    }
}