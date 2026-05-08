import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const msgCount = await prisma.$queryRaw`SELECT COUNT(*) FROM contact_message` as any[];
    const subCount = await prisma.$queryRaw`SELECT COUNT(*) FROM subscriber` as any[];
    
    console.log('--- DATABASE STATUS ---');
    console.log('Messages:', msgCount[0].count);
    console.log('Subscribers:', subCount[0].count);
    
    const latestMsg = await prisma.$queryRaw`SELECT * FROM contact_message ORDER BY "createdAt" DESC LIMIT 1` as any[];
    if (latestMsg.length > 0) {
      console.log('Latest Message:', latestMsg[0].message);
    }
  } catch (e) {
    console.error('Query Failed:', e);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
