import { redirect, error } from '@sveltejs/kit';
import links from "$data/external-links.json"


/** @type {import('../$types').PageServerLoad} */
export function load({ params  }) {
    if(params.slug in links){
        throw redirect(302, links[params.slug]);
    }else{
        throw error(404, `external link to ${params.slug} does not exist!`)
    }
}