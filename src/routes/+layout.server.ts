

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies, locals, depends}) {
    return {
        user: locals.user,
        cookies_accepted: Boolean(cookies.get("cookies_accepted")) ?? false,
    };
}