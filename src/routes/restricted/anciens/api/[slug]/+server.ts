import prisma from '$lib/prisma';

export async function GET({ params, locals }) {
	const user = await prisma.user.findFirst({
		where: { id: params.slug },
		select: {
			password: false,
			admin: Boolean(locals.user?.admin),
			updatedAt: Boolean(locals.user?.admin),
			login: Boolean(locals.user?.admin),
			id: Boolean(locals.user?.admin),
			prenom: true,
			nom: true,
			email: true,
			contact: true,
			grad_year: true,
			nationalite: true,
			moyenneL2: true,
			moyenneL3: true,
			admis: true,
			choisi: true,
			travails: true,
			description: true,
			createdAt: true,
		},
	});
	return new Response(JSON.stringify({ subject: user }), {
		headers: { 'content-type': 'application/json' },
	});
}


