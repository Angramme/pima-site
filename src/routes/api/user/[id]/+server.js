import prisma from "$lib/prisma";
import { session_get_user } from "$lib/sessions";
import { error, json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler}*/
export async function POST({ request, locals, params }) {
  if (!locals.user) throw error(401, "not logged in");
  if (!locals.user.admin) throw error(403, "not an admin");

  const { id } = params;

  if (request.method !== "POST") throw error(405, "Method not allowed");

  const body = await request.json();

  if (body.action === "delete") {
    try {
      await prisma.session.deleteMany({
        where: { user_id: id },
      });
      await prisma.user.delete({
        where: { id: id },
      });
    } catch (err) {
      console.error(err);
      throw error(500, "Prisma Error");
    }
  }

  return json({ success: true });
}
