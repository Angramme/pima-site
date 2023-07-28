import { session_get_user } from "$lib/sessions"

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    const url = new URL(event.request.url);

    const user = await session_get_user(event.cookies);

    if(!user && url.pathname.startsWith("/restricted")){
        // clean url from sveltekit stuff
        const redir_url = url.pathname.endsWith("__data.json") ? 
            url.pathname.split("/").slice(0, -1).join("/")
            : url.pathname;
        return new Response('Redirect', {
            status: 303, 
            headers: { Location: `/login?redirect=${encodeURIComponent(redir_url)}` }});
    }

   
    event.locals.user = user;

    return resolve(event);
}