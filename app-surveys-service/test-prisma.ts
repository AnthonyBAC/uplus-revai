import 'dotenv/config';
import { PrismaClient } from './src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
    connectionString: process.env.DIRECT_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    const result = await prisma.$queryRaw`select now()`;
    console.log('Conexion OK con Prisma:', result);
}

main()
    .catch(error => {
        console.error('Error conectando con Prisma:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
