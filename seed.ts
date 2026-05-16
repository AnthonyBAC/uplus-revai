import 'dotenv/config';
import { prisma } from '@uplus/db';

interface EndpointDef {
  key: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description?: string;
}

const endpoints: EndpointDef[] = [
  // ─── auth ────────────────────────────────────────────
  { key: 'auth.session.get', method: 'GET', path: '/api/auth/session', description: 'Obtener sesión actual' },
  { key: 'auth.register.post', method: 'POST', path: '/api/auth/register', description: 'Registro de nuevo negocio' },
  { key: 'auth.logout.post', method: 'POST', path: '/api/auth/logout', description: 'Cerrar sesión' },
  { key: 'business.members.list', method: 'GET', path: '/api/businesses/:id/members', description: 'Listar miembros de negocio' },
  { key: 'business.members.create', method: 'POST', path: '/api/businesses/:id/members', description: 'Agregar trabajador' },
  { key: 'business.members.update', method: 'PATCH', path: '/api/businesses/:id/members/:userId', description: 'Editar rol/accesos de miembro' },
  { key: 'business.members.delete', method: 'DELETE', path: '/api/businesses/:id/members/:userId', description: 'Remover miembro' },
  { key: 'branches.list', method: 'GET', path: '/api/branches', description: 'Listar sucursales' },
  { key: 'branches.create', method: 'POST', path: '/api/branches', description: 'Crear sucursal' },
  { key: 'branches.get', method: 'GET', path: '/api/branches/:id', description: 'Obtener sucursal' },
  { key: 'branches.update', method: 'PATCH', path: '/api/branches/:id', description: 'Editar sucursal' },
  { key: 'branches.delete', method: 'DELETE', path: '/api/branches/:id', description: 'Eliminar sucursal' },
  { key: 'roles.list', method: 'GET', path: '/api/roles', description: 'Listar roles' },
  { key: 'endpoints.list', method: 'GET', path: '/api/endpoints', description: 'Listar endpoints y permisos' },

  // ─── reviews ─────────────────────────────────────────
  { key: 'reviews.list', method: 'GET', path: '/api/reviews', description: 'Listar reseñas' },
  { key: 'reviews.get', method: 'GET', path: '/api/reviews/:id', description: 'Obtener reseña' },
  { key: 'connections.list', method: 'GET', path: '/api/connections', description: 'Listar conexiones' },
  { key: 'connections.create', method: 'POST', path: '/api/connections', description: 'Crear conexión a plataforma' },
  { key: 'connections.get', method: 'GET', path: '/api/connections/:id', description: 'Obtener conexión' },
  { key: 'connections.delete', method: 'DELETE', path: '/api/connections/:id', description: 'Eliminar conexión' },
  { key: 'sync.trigger', method: 'POST', path: '/api/sync', description: 'Disparar sincronización' },
  { key: 'sync.get', method: 'GET', path: '/api/sync/:id', description: 'Estado de sincronización' },

  // ─── surveys ─────────────────────────────────────────
  { key: 'surveys.list', method: 'GET', path: '/api/surveys', description: 'Listar encuestas' },
  { key: 'surveys.create', method: 'POST', path: '/api/surveys', description: 'Crear encuesta' },
  { key: 'surveys.get', method: 'GET', path: '/api/surveys/:id', description: 'Obtener encuesta' },
  { key: 'surveys.update', method: 'PATCH', path: '/api/surveys/:id', description: 'Editar encuesta' },
  { key: 'surveys.delete', method: 'DELETE', path: '/api/surveys/:id', description: 'Eliminar encuesta' },
  { key: 'surveys.respond', method: 'POST', path: '/api/surveys/:id/respond', description: 'Responder encuesta' },
  { key: 'surveys.responses', method: 'GET', path: '/api/surveys/:id/responses', description: 'Ver respuestas de encuesta' },
  { key: 'surveys.questions.list', method: 'GET', path: '/api/surveys/:id/questions', description: 'Listar preguntas' },
  { key: 'surveys.questions.create', method: 'POST', path: '/api/surveys/:id/questions', description: 'Agregar pregunta' },
  { key: 'surveys.questions.update', method: 'PATCH', path: '/api/surveys/:id/questions/:questionId', description: 'Editar pregunta' },
  { key: 'surveys.questions.delete', method: 'DELETE', path: '/api/surveys/:id/questions/:questionId', description: 'Eliminar pregunta' },

  // ─── reports ─────────────────────────────────────────
  { key: 'analysis.list', method: 'GET', path: '/api/analysis', description: 'Listar análisis' },
  { key: 'analysis.create', method: 'POST', path: '/api/analysis', description: 'Crear análisis' },
  { key: 'reports.list', method: 'GET', path: '/api/reports', description: 'Listar reportes' },
  { key: 'reports.create', method: 'POST', path: '/api/reports', description: 'Crear reporte' },
  { key: 'reports.get', method: 'GET', path: '/api/reports/:id', description: 'Obtener reporte' },

  // ─── BFF ────────────────────────────────────────────
  { key: 'dashboard.get', method: 'GET', path: '/api/analysis/dashboard', description: 'Dashboard agregado' },
  { key: 'analysis.reviews', method: 'GET', path: '/api/analysis/reviews', description: 'Listar reseñas desde analysis' },
  { key: 'analysis.insights', method: 'GET', path: '/api/analysis/insights', description: 'Listar insights desde analysis' },
  { key: 'analysis.improvements', method: 'GET', path: '/api/analysis/improvements', description: 'Listar mejoras desde analysis' },
];

const trabajadorEndpoints = new Set([
  'auth.session.get',
  'auth.logout.post',
  'branches.list',
  'surveys.list',
  'surveys.get',
  'surveys.respond',
  'surveys.responses',
  'surveys.questions.list',
]);

async function main() {
  console.log('Creando roles...');
  const adminRole = await prisma.roles.upsert({
    where: { name: 'ADMIN' },
    create: { id: crypto.randomUUID(), name: 'ADMIN', description: 'Dueño del negocio — acceso total', updated_at: new Date() },
    update: { description: 'Dueño del negocio — acceso total' },
  });

  const trabajadorRole = await prisma.roles.upsert({
    where: { name: 'TRABAJADOR' },
    create: { id: crypto.randomUUID(), name: 'TRABAJADOR', description: 'Empleado — acceso a encuestas', updated_at: new Date() },
    update: { description: 'Empleado — acceso a encuestas' },
  });

  console.log('Creando endpoints...');
  for (const ep of endpoints) {
    await prisma.endpoints.upsert({
      where: { key: ep.key },
      create: {
        id: crypto.randomUUID(),
        key: ep.key,
        method: ep.method,
        path: ep.path,
        description: ep.description,
        updated_at: new Date(),
      },
      update: { method: ep.method, path: ep.path, description: ep.description },
    });
  }

  console.log('Creando permisos...');
  const allEndpoints = await prisma.endpoints.findMany();

  for (const ep of allEndpoints) {
    const isTrabajador = trabajadorEndpoints.has(ep.key);

    await prisma.role_endpoint_permissions.upsert({
      where: {
        role_id_endpoint_id: {
          role_id: adminRole.id,
          endpoint_id: ep.id,
        },
      },
      create: { role_id: adminRole.id, role_name: 'ADMIN', endpoint_id: ep.id, endpoint_key: ep.key, allowed: true },
      update: { allowed: true },
    });

    await prisma.role_endpoint_permissions.upsert({
      where: {
        role_id_endpoint_id: {
          role_id: trabajadorRole.id,
          endpoint_id: ep.id,
        },
      },
      create: { role_id: trabajadorRole.id, role_name: 'TRABAJADOR', endpoint_id: ep.id, endpoint_key: ep.key, allowed: isTrabajador },
      update: { allowed: isTrabajador },
    });
  }

  console.log(`Seed completado: ${allEndpoints.length} endpoints, 2 roles.`);
  console.log(`ADMIN: todos los endpoints | TRABAJADOR: ${trabajadorEndpoints.size} endpoints`);
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
