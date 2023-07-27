import prisma from '$lib/prisma'

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    let users = await prisma.user.findMany({
        select: {
            // never show
            login: false,
            password: false,
            // show if admin
            admin: false,
            updatedAt: false,
            // safe info
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