import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const user = await prisma.user.findFirst({
            where: { email: 'admin@marts.com' }
        });
        
        console.log('User found:', user);
        
        if (user && user.role !== 'admin') {
            const updated = await prisma.user.update({
                where: { id: user.id },
                data: { role: 'admin' }
            });
            console.log('Successfully updated role to admin:', updated);
        } else if (!user) {
            console.log('Admin user admin@marts.com not found in database.');
        } else {
            console.log('User already has admin role.');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
