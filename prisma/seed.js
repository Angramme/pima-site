// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import userData from "../src/data/initial-users.json" assert { type: "json" }

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  for (const p of userData) {
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