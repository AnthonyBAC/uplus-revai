// Prisma config global — ejecutar desde la raíz del proyecto
// Requiere: npm install (en raíz) y un archivo .env con DIRECT_URL
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
    schema: 'supabase/schema.prisma',
    migrations: {
        path: 'supabase/migrations',
    },
    datasource: {
        url: process.env['DIRECT_URL'],
    },
});
