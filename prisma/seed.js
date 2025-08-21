// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import userData from "../src/data/initial-users.json" assert { type: "json" }
import { hash_password } from "../src/lib/sessions"

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  for (const p of userData) {
    p.password = hash_password(p.login, p.password); // store the hashed password
    const user = await prisma.user.create({
        data: p,
    })
    console.log(`Created user ${p.login} with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })