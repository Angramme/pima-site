import prisma from '$lib/prisma'

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, depends }) {
    depends("user:update");

    const loggedIn = locals.user ? true : false;

    // if(!locals.user) return { streamed: { descs: Promise.resolve([]) } }; // user is not logged in...

    let descs = prisma.user.findMany({
        where: {
            sleeping: false,
            description: {
                not: "TODO 😴", // not default value
            },
            grad_year: {
                lte: new Date().getFullYear(),
            },
            ...(loggedIn ? {} : { public_description: true })
        },
        select: {
            // never show
            login: false,
            password: false,
            email: false,
            contact: false,
            admis: false,
            nationalite: false,
            createdAt: false,
            // show if admin
            admin: false,
            updatedAt: false,
            sleeping: false,
            // show if logged in
            id: loggedIn,
            nom: loggedIn,
            // show no matter what
            choisi: true,
            grad_year: true,
            prenom: true,
            description: true,
            upvotedByIds: true,
            downvotedByIds: true,
        },
        orderBy: {
            grad_year: "desc",
        }
    }).then(users => users.map(u => {
        const { upvotedByIds, downvotedByIds, ...rest } = u;
        return {
            ...rest,
            upvotes: upvotedByIds.length,
            downvotes: downvotedByIds.length,
            weUpvoted: upvotedByIds.includes(locals.user?.id ?? ""),
            weDownvoted: downvotedByIds.includes(locals.user?.id ?? ""),
        }
    }));

    return {
        streamed: {
            descs: descs,
        }
    }
}


export const actions = {
    upvote: async ({ request, locals }) => {
        if (!locals.user) return { creation_failure: "user logged out" };

        const data = await request.formData();
        if (!data.has("id"))
            return { creation_failure: "form data incomplete" };

        const id = data.get("id")?.toString();
        if (!id)
            return { creation_failure: "form data incomplete" };

        try {
            await prisma.user.update({
                where: {
                    id
                },
                data: {
                    upvotedBy: {
                        connect: [{ id: locals.user.id }]
                    }
                }
            });
            await prisma.user.update({
                where: {
                    id
                },
                data: {
                    downvotedBy: {
                        disconnect: [{ id: locals.user.id }]
                    }
                }
            });
        } catch (error) {
            console.error(error);
            return { creation_failure: `Prisma Error: ${error}` }
        }

        return { creation_success: true };
    },

    downvote: async ({ request, locals }) => {
        if (!locals.user) return { creation_failure: "user logged out" };

        const data = await request.formData();
        if (!data.has("id"))
            return { creation_failure: "form data incomplete" };

        const id = data.get("id")?.toString();
        if (!id)
            return { creation_failure: "form data incomplete" };

        try {
            await prisma.user.update({
                where: {
                    id
                },
                data: {
                    upvotedBy: {
                        disconnect: [{ id: locals.user.id }]
                    }
                }
            });
            await prisma.user.update({
                where: {
                    id
                },
                data: {
                    downvotedBy: {
                        connect: [{ id: locals.user.id }]
                    }
                }
            });
        } catch (error) {
            console.error(error);
            return { creation_failure: `Prisma Error: ${error}` }
        }

        return { creation_success: true };
    },

    reset_vote: async ({ request, locals }) => {
        if (!locals.user) return { creation_failure: "user logged out" };

        const data = await request.formData();
        if (!data.has("id"))
            return { creation_failure: "form data incomplete" };

        const id = data.get("id")?.toString();
        if (!id)
            return { creation_failure: "form data incomplete" };

        try {
            await prisma.user.update({
                where: {
                    id
                },
                data: {
                    upvotedBy: {
                        disconnect: [{ id: locals.user.id }]
                    }
                }
            });
            await prisma.user.update({
                where: {
                    id
                },
                data: {
                    downvotedBy: {
                        disconnect: [{ id: locals.user.id }]
                    }
                }
            });
        } catch (error) {
            console.error(error);
            return { creation_failure: `Prisma Error: ${error}` }
        }

        return { creation_success: true };
    },
}