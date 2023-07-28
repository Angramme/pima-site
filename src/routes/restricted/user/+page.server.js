import prisma from '$lib/prisma';
import { check_password, end_session } from '$lib/sessions';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    if(!locals.user) return { user: null };

    const user = await prisma.user.findFirst({
        where: { id: locals.user.id },
        select: {
            admis: true,
            choisi: true,
            grad_year: true,
            
            email: true,
            contact: true,
            
            description: true,
            nationalite: true,
            nom: true,
            prenom: true,
            login: true,
            
            admin: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    return {
        user
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
    disconnect: async ({ cookies }) => {
        end_session(cookies);
        throw redirect(303, "/");
    },
    reset_pwd: async ({ request, cookies, locals }) => {
        const data = await request.formData();
        const old_pwd = data.get("old_pwd");
        const new_pwd = data.get("new_pwd");
        if(!locals.user || !old_pwd) return { reset_pwd: true, missing: true };
        const user_id = await check_password(locals.user.login, old_pwd.toString());
        if(!user_id) return { reset_pwd: true, incorrect: true };
        await prisma.user.update({
            where: { id: user_id },
            data: { password: new_pwd?.toString() },
        });
        return { reset_pwd: true, success: true };
    },
    update_data: async ({}) => {

    },
};