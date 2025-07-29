import { PrismaClient } from "@prisma/client";
import { DATABASE_URL } from '$env/static/private';

const prisma = new PrismaClient();
export default prisma;
