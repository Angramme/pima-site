import prisma from '$lib/prisma';

export async function POST({ params, request, locals }) {
	if (!locals.user || !locals.user.admin) {
		return new Response(JSON.stringify({ error: 'user does not have privilages' }), { status: 403 });
	}
	let grant = false;
	try {
		const body = await request.json();
		grant = Boolean(body?.grant);
	} catch {
		// fallback to form data
		try {
			const fd = await request.formData();
			grant = fd.has('grant') ? fd.get('grant') === 'true' : false;
		} catch {}
	}

	try {
		await prisma.user.update({
			where: { id: params.slug },
			data: { admin: grant },
		});
		return new Response(JSON.stringify({ ok: true, admin: grant }), { headers: { 'content-type': 'application/json' } });
	} catch (e) {
		return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
	}
}


