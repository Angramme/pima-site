

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, depends}) {
    depends("user:update")

    return {
        user: locals.user
    };
}