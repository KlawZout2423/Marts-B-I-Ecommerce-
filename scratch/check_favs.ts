import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const favorites = await prisma.favorite.findMany()
  console.log('Total Favorites in DB:', favorites.length)
  console.log('Recent Favorites:', JSON.stringify(favorites.slice(-5), null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
