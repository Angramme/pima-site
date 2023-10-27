import prisma from '$lib/prisma';
import { check_password, end_session, hash_password } from '$lib/sessions';
import { generate_password, zip } from '$lib/utils';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, depends }) {
    depends("user:update");
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
            travails: true,
            moyenneL2: true,
            moyenneL3: true,
            
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
        throw redirect(302, "/");
        return { disconnected: true };
    },
    pwd_chg: async ({ request, locals }) => {
        const data = await request.formData();
        const old_pwd = data.get("old_pwd");
        const new_pwd = data.get("new_pwd");
        if(!locals.user || !old_pwd || !new_pwd) return { pwd_rst_missing: true };
        const user_id = await check_password(locals.user.login, old_pwd.toString());
        if(!user_id) return { pwd_rst_incorrect: true };
        try{
            await prisma.user.update({
                where: { id: user_id },
                data: { password: hash_password(locals.user.login, new_pwd.toString()) },
            });
        }catch(error){
            console.error(error);
            return { pwd_rst_errror: `Prisma Error: ${error}` };
        }
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
            "travails",
            "moyenneL2",
            "moyenneL3",
        ];
        const list_entries = [
            "nationalite",
            "contact",
            "admis",
            "travails",
        ];
        const number_entries = [ 
            "grad_year",
            "moyenneL2",
            "moyenneL3",
         ];

        if(!locals.user) return { update_failure: "user logged out!" };
        if(keys_to_update.some(k=>!data.has(k))) return { update_failure: "Invalid form data submitted!" };

        let prisma_data = Object();
        prisma_data["sleeping"] = false;
        for(let k of keys_to_update) prisma_data[k] = data.get(k)?.toString().trim();
        /// @ts-ignore
        for(let k of list_entries) prisma_data[k] = prisma_data[k].split(",").map(x=>x.trim());
        for(let k of number_entries) prisma_data[k] = Number(prisma_data[k]);

        console.log(prisma_data);

        try{
            await prisma.user.update({
                where: { id: locals.user.id },
                data: prisma_data,
            })
        }catch(error){
            console.error(error);
            return { update_failure: `Prisma Error: ${error}` }; 
        }
        
        return { update_success: true };
    },
    delete_account: async ({ locals })=>{
        if(!locals.user) return { delete_failure: "Vous n'etez pas connectés" };
        try{
            await prisma.session.deleteMany({
                where: { user_id: locals.user.id }
            });
            await prisma.user.delete({
                where: { id: locals.user.id }
            });
        }catch(error){
            console.error(error);
            return { delete_failure: `Prisma Error: ${error}` };
        }
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
        const password_hash = hash_password(login, data.get("password")?.toString() || "");

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

        try{
            await prisma.user.create({
                data: { prenom, nom, login, grad_year, choisi: "? 😴", password: password_hash }
            });
        }catch(error){
            console.error(error);
            return { creation_failure: `Prisma Error: ${error}` }
        }

        return { creation_success: true, new_account_login: login }; 
    },
    mass_create_accounts: async ({ locals, request }) => {
        if(!locals.user) return { creation_failure: "user logged out" };
        if(!locals.user.admin) return { creation_failure: "user does not have permissions" };

        const data = await request.formData();
        if(!data.has("emails") || !data.has("grad_year"))
            return { creation_failure: "form data incomplete" };

        const emails_s = data.getAll("emails")
            ?.map(value=>value.toString());

        if(!emails_s.every(s=>s.split('@')[1] == "etu.sorbonne-universite.fr"))
            return { creation_failure: "invalid email address host found (does not match etu.sorbonne-universite.fr)" };

        const unique_logins = await Promise.all(emails_s
            .map(s=>s.split("@")[0].replace(".", "-"))
            .map(async login_o=>{
                // make it unique 
                const clashes = (await prisma.user.findMany({
                        where: { login: {
                            contains: login_o
                        }},
                        select: { login: true }
                    }))
                    .map(({login})=>login);
                let login = login_o;
                let i = 0;
                while(clashes.includes(login)) // very inefficient but we will not have thousands of users with the same name (we wont have thousands of users)
                    login = `${login_o}-${i++}`;
            }));

        const passwords = Array.from(unique_logins, _login=>generate_password());
        /** @type {string[]} */
        const password_hashes = zip([unique_logins, passwords])
            // @ts-ignore
            .map(([login, pwd])=>hash_password(login, pwd));

        // prenom, nom, login, pwd hash
        /** @type {[string, string, string, string][]} */
        const creation_data = zip([unique_logins, password_hashes])
            //@ts-ignore
            .map(([login, pwshash])=>[login.split("-")[0], login.split("-")[1], login, pwshash]);

        const grad_year = Number(data.get("grad_year")?.toString()) || 0; 

        try{
            await prisma.user.createMany({
                    data: creation_data.map(([prenom, nom, login, pwdhash])=>({
                        prenom, nom, login, grad_year, choisi: "? 😴", password: pwdhash
                    })),
                });
        }catch(error){
            console.error(error);
            return { creation_failure: `Prisma Error: ${error}` }
        }


        // TODO: try sending emails here 
        // if it fails, reverse all the modifications to the database, i.e. delete all added records
        // then return a response with the appropriate error message



        return { creation_success: true, new_account_logins: unique_logins }; 
    },
};