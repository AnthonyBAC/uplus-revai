import 'dotenv/config';
import { Client } from 'pg';

async function main() {
    if (!process.env.DIRECT_URL) {
        throw new Error('DIRECT_URL no está definido en el .env de la raíz');
    }

    const client = new Client({
        connectionString: process.env.DIRECT_URL,
    });

    await client.connect();

    try {
        const result = await client.query('select now()');
        console.log('Conexion OK con PostgreSQL:', result.rows);
    } finally {
        await client.end();
    }
}

main()
    .catch((error) => {
        console.error('Error conectando con Prisma:', error);
        process.exit(1);
    });
