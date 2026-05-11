import 'dotenv/config';
import { prisma } from '@uplus/db';

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
