import { redirect, error } from '@sveltejs/kit';
import { flat_map as links } from "$data/external-links"

// const links = Object.assign({}, ...Object.values(links_r));

/** @type {import('../$types').PageServerLoad} */
export function load({ params, depends }) {
    depends("user:update");
    if(params.slug in links){
        throw redirect(302, links[params.slug]);
    }else{
        throw error(404, `external link to ${params.slug} does not exist!`)
    }
}