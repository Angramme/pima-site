

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies, locals, depends}) {
    depends("user:update", "cookies:update");

    return {
        user: locals.user,
        cookies_accepted: cookies.get("cookiesAccepted"),
    };
}