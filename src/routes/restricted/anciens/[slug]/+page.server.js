import { error } from '@sveltejs/kit';
import prisma from '$lib/prisma';

/** @type {import('./$types').PageServerLoad} */
export function load({ params, locals, depends }) {
    depends("user:update");

    let user = prisma.user.findFirst({
        where: {
            id: params.slug,
        },
        select: {
            // never show
            password: false,
            // show if admin
            admin: Boolean(locals.user?.admin),
            updatedAt: Boolean(locals.user?.admin),
            login: Boolean(locals.user?.admin),
            id: Boolean(locals.user?.admin),
            // safe info
            prenom: true,
            nom: true,
            email: true,
            contact: true,
            grad_year: true,
            nationalite: true,
            moyenneL2: true,
            moyenneL3: true,
            admis: true,
            choisi: true,
            travails: true,
            description: true,
            createdAt: true,
        }
    })
    if(user != null) 
        return {
            user,
            me: locals.user,
        };
    else
        throw error(404, "Cette personne n'est pas repertorié");
};

/** @type {import('./$types').Actions} */
export const actions = {
    user_status_change: async ({ request, locals }) => {
        if(!locals.user) return { error: "user logged out" };
        if(!locals.user.admin) return { error: "user does not have privilages" };
        const data = await request.formData();

        if(data.has("user_id") && (data.has("admin_rights_on") || data.has("admin_rights_off"))){
            try{
                await prisma.user.update({
                    where: { id: data.get("user_id")?.toString() },
                    data: { admin: data.has("admin_rights_on") }
                });
            }catch(error){
                console.error(error);
                return { error: `Prisma error : ${error}` } 
            }

            return { success: true };
        }else{
            return { error: "invalid form data" };
        }
    },
    user_delete: async ({ request, locals}) => {
        if(!locals.user) return { error: "user logged out" };
        if(!locals.user.admin) return { error: "user does not have privilages" };
        const data = await request.formData();

        if(!data.has("user_id")) return { error: "invalid form data" };

        try{
            await prisma.session.deleteMany({
                where: { user_id: data.get("user_id")?.toString() }
            });
            await prisma.user.delete({
                where: { id: data.get("user_id")?.toString() }
            });
        }catch(error){
            console.error(error);
            return { error: `Prisma error : ${error}` } 
        }

        return { success: true };
    }
};