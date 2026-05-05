import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  const adminEmail = "admin@marts.com";
  await prisma.account.deleteMany({ where: { user: { email: adminEmail } } });
  await prisma.session.deleteMany({ where: { user: { email: adminEmail } } });
  await prisma.user.deleteMany({ where: { email: adminEmail } });
  console.log("Deleted old admin user and associated records.");
  await prisma.$disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
