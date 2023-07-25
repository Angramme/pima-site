import { error } from '@sveltejs/kit';
import anciens from "$data/contact-anciens.json"

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    if(!(params.slug in anciens)) 
        throw error(404, "Cette personne n'est pas repertorié");

    return Object.assign({nom: params.slug}, anciens[params.slug]);
}