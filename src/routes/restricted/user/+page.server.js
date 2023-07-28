import prisma from '$lib/prisma';
import { check_password, end_session, hash_password } from '$lib/sessions';
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
            
            nom: true,
            prenom: true,
            nationalite: true,
            description: true,
            
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
        return { disconnected: true };
    },
    pwd_chg: async ({ request, locals }) => {
        const data = await request.formData();
        const old_pwd = data.get("old_pwd");
        const new_pwd = data.get("new_pwd");
        if(!locals.user || !old_pwd || !new_pwd) return { pwd_rst_missing: true };
        const user_id = await check_password(locals.user.login, old_pwd.toString());
        if(!user_id) return { pwd_rst_incorrect: true };
        await prisma.user.update({
            where: { id: user_id },
            data: { password: hash_password(locals.user.login, new_pwd.toString()) },
        });
        return { pwd_rst_success: true };
    },
    update_data: async ({ request, locals }) => {
        const data = await request.formData();

        const keys_to_update = [
            "admis",
            "choisi",
            "grad_year",
            "email",
            "contact",
            "nom",
            "prenom",
            "nationalite",
            "description",
        ];
        const list_entries = [
            "nationalite",
            "contact",
            "admis",
        ];
        const number_entries = [ "grad_year" ];

        if(!locals.user) return { update_failure: "user logged out!" };
        if(keys_to_update.some(k=>!data.has(k))) return { update_failure: "Invalid form data submitted!" };

        let prisma_data = Object();
        for(let k of keys_to_update) prisma_data[k] = data.get(k)?.toString().trim();
        /// @ts-ignore
        for(let k of list_entries) prisma_data[k] = prisma_data[k].split(",").map(x=>x.trim());
        for(let k of number_entries) prisma_data[k] = Number(prisma_data[k]);

        console.log(prisma_data);

        await prisma.user.update({
            where: { id: locals.user.id },
            data: prisma_data,
        })
        
        return { update_success: true };
    },
    delete_account: async ({ locals })=>{
        if(!locals.user) return { delete_failure: "Vous n'etez pas connectés" };
        await prisma.session.deleteMany({
            where: { user_id: locals.user.id }
        });
        await prisma.user.delete({
            where: { id: locals.user.id }
        });
        return { delete_success: true };
    },
    create_account: async ({ locals, request }) => {
        if(!locals.user) return { creation_failure: "user logged out" };
        if(!locals.user.admin) return { creation_failure: "user does not have permissions" };

        const data = await request.formData();
        if(!data.has("prenom") || !data.has("nom") || !data.has("grad_year") || !data.has("password"))
            return { creation_failure: "form data incomplete" };

        const prenom = data.get("prenom")?.toString() || ""; 
        const nom = data.get("nom")?.toString() || ""; 
        let login = `${nom.toLowerCase()}-${prenom.toLowerCase()}`; 
        const grad_year = Number(data.get("grad_year")?.toString()) || 0; 
        const password = hash_password(login, data.get("password")?.toString() || "");

        // make login unique
        const logins = (await prisma.user.findMany({
                where: { login: {
                    contains: login
                }},
                select: { login: true }
            }))
            .map(({login})=>login);
        let i = 0;
        while(logins.includes(login))
            login = `${nom.toLowerCase()}-${prenom.toLowerCase()}-${i++}`;

        await prisma.user.create({
            data: { prenom, nom, login, grad_year, choisi: "? 😴", password }
        });

        return { creation_success: true, new_account_login: login }; 
    },
};