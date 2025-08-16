import { redirect, error } from '@sveltejs/kit';
import links_r from "$data/external-links.json"

const links = Object.assign({}, ...Object.values(links_r));

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, depends }) {
    depends("user:update");
    if(params.slug in links){
        throw redirect(302, links[params.slug]);
    }else{
        throw error(404, `external link to ${params.slug} does not exist!`)
    }
}