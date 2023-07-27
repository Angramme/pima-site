import { error } from '@sveltejs/kit';
import prisma from '$lib/prisma';

/** @type {import('./$types').PageServerLoad} */
export function load({ params }) {
    let user = prisma.user.findFirst({
        where: {
            id: params.slug,
        },
        select: {
            // never show
            password: false,
            // show if admin
            admin: false,
            updatedAt: false,
            login: false,
            // safe info
            id: false,
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
        }
    })
    if(user != null) 
        return {
            user 
        };
    else
        throw error(404, "Cette personne n'est pas repertorié");
}