import prisma from '$lib/prisma'

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, depends }) {
    depends("user:update");

    if(!locals.user) return { users: [] }; // user is not logged in...

    const where = locals.user.admin ? {} : {
        sleeping: false,
    };

    let users = await prisma.user.findMany({
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
        },
    });

    return {
        users: users
    }
}