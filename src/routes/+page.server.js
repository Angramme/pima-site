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

export const actions = {
    accept_cookies: async ({ cookies, request }) => {
        const formData = await request.formData();
        const accept_cookies = formData.get('cookies_accepted')?.toString() || 'false';
        cookies.set('cookies_accepted', accept_cookies);
    }
}