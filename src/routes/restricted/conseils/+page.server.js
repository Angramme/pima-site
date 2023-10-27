import prisma from '$lib/prisma'

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, depends }) {
    depends("user:update");

    if(!locals.user) return { streamed: { descs: Promise.resolve([]) } }; // user is not logged in...

    let descs = prisma.user.findMany({
        where: {
            sleeping: false,
            description: {
                not: "TODO 😴", // not default value
            },
            grad_year: {
                lte: new Date().getFullYear(),
            }
        },
        select: {
            // never show
            login: false,
            password: false,
            // show if admin
            updatedAt: false,
            sleeping: false,
            // safe info
            admin: false,
            id: true,
            prenom: true,
            nom: true,
            email: false,
            contact: false,
            grad_year: true,
            nationalite: false,
            admis: false,
            choisi: true,
            description: true,
            createdAt: false,
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