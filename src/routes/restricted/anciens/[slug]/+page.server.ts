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
            subject: user,
        };
    else
        throw error(404, "Cette personne n'est pas repertorié");
};

/** @type {import('./$types').RequestHandler} */
// JSON endpoint moved to +server.ts for clarity

/** @type {import('./$types').Actions} */
export const actions = {
    user_status_change: async ({ request, locals }) => {
        if(!locals.user) return { error: "user logged out" };
        if(!locals.user.admin) return { error: "user does not have privilages" };
        const data = await request.formData();
        const user_id = data.get("user_id")?.toString();
        const login_confirm = data.get("login_confirm")?.toString();

        if(!user_id || !login_confirm){
            return { error: "invalid form data" };
        }

        const user_to_modify = await prisma.user.findUnique({where: {id: user_id}});
        if(user_to_modify?.login !== login_confirm){
            return { error: "login confirmation failed" };
        }

        if(data.has("admin_rights_on") || data.has("admin_rights_off")){
            try{
                await prisma.user.update({
                    where: { id: user_id },
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
        const user_id = data.get("user_id")?.toString();
        const login_confirm = data.get("login_confirm")?.toString();

        if(!user_id || !login_confirm){
            return { error: "invalid form data" };
        }

        const user_to_modify = await prisma.user.findUnique({where: {id: user_id}});
        if(user_to_modify?.login !== login_confirm){
            return { error: "login confirmation failed" };
        }

        try{
            await prisma.session.deleteMany({
                where: { user_id: user_id }
            });
            await prisma.user.delete({
                where: { id: user_id }
            });
        }catch(error){
            console.error(error);
            return { error: `Prisma error : ${error}` } 
        }

        return { success: true };
    }
};