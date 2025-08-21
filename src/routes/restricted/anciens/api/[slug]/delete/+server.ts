import prisma from '$lib/prisma';

export async function POST({ params, locals, request }) {
	if (!locals.user || !locals.user.admin) {
		return new Response(JSON.stringify({ error: 'user does not have privilages' }), { status: 403 });
	}

    const data = await request.json();
    const login_confirm = data.login_confirm;

    if(!login_confirm){
        return new Response(JSON.stringify({ error: 'invalid form data' }), { status: 400 });
    }

    const user_to_modify = await prisma.user.findUnique({where: {id: params.slug}});
    if(user_to_modify?.login !== login_confirm){
        return new Response(JSON.stringify({ error: 'login confirmation failed' }), { status: 403 });
    }

	try {
		await prisma.session.deleteMany({ where: { user_id: params.slug } });
		await prisma.user.delete({ where: { id: params.slug } });
		return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
	} catch (e) {
		return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
	}
}


