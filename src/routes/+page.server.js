import prisma from '$lib/prisma';


/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url }) {
    return {
        members_count: await prisma.user.count(),
        ancien_count: await prisma.user.count({
            where: {
                grad_year: { lte: new Date().getFullYear() }
            }
        })
    }
}