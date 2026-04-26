<!-- BEGIN:nextjs-agent-rules -->

# Context proyecto

Proyecto base de una aplicacion SaaS llamada U+ Revai. La plataforma permitira que administradores y empleados de distintos negocios puedan centralizar, consultar y analizar reseñas de sus sucursales. En el MVP se trabajara principalmente con Google Reviews, pero la arquitectura debe quedar preparada para soportar multiples clientes, multiples sucursales y multiples usuarios por negocio.

Tecnologias principales:

- Supabase Auth para autenticacion
- Prisma + PostgreSQL para persistencia
- Next.js para frontend y servicios web
- Vercel para hosting
- Google Business Profile API para obtener reseñas
- Gemini API para generar analisis y reportes

La aplicacion tendra un dashboard para administradores y empleados donde podran ver reseñas unificadas por negocio y sucursal, filtrarlas por fecha, plataforma, calificacion y estado, y consultar analisis generados automaticamente.

Flujo principal:

- El sistema obtiene reseñas desde Google Business Profile API.
- Las reseñas se normalizan y almacenan en la base de datos.
- Luego se envian al servicio de analisis para generar resumenes, fortalezas, debilidades, tendencias y hallazgos relevantes.
- Los resultados se guardan y se exponen en el dashboard para apoyar la toma de decisiones.

Modelo SaaS y multi-tenant:

- La aplicacion se vendera a multiples negocios en una misma base de datos.
- No se usara una base de datos separada por cliente en el MVP.
- Cada entidad de negocio estara aislada logicamente por `businessId`.
- Un negocio puede tener multiples sucursales.
- Un usuario puede pertenecer a uno o varios negocios segun el modelo de membresias.
- Un administrador puede gestionar varias sucursales de su negocio.
- Un empleado puede tener acceso solo a determinadas sucursales.

Servicios principales:

- Auth: se encargara de la autenticacion y autorizacion de usuarios usando Supabase Auth. Debe manejar usuarios, roles, membresias por negocio, acceso por sucursal y permisos por endpoint.
- Review Service: se encargara de sincronizar, almacenar y consultar reseñas de Google por negocio y sucursal.
- Analysis Service: se encargara de procesar las reseñas con Gemini para generar analisis individuales y agregados.
- Report Service: se encargara de construir reportes ejecutivos y resumentes a partir de reseñas y analisis guardados.
- Survey Service: se encargara de registrar encuestas internas realizadas a clientes recurrentes desde una tablet u otro dispositivo en el local. Estas encuestas buscaran capturar opiniones mas directas y cercanas sobre la atencion, servicio, experiencia y satisfaccion del cliente.
- Frontend: se encargara de mostrar dashboard, autenticacion, gestion de usuarios, sucursales, reseñas, analisis, reportes y encuestas.

Alcance de Survey Service:

- Las encuestas podran ser mostradas por un mesero o colaborador al cliente desde una tablet dentro del negocio.
- Las respuestas quedaran asociadas a un negocio y opcionalmente a una sucursal.
- Las encuestas podran complementar el analisis de reseñas publicas con feedback privado y recurrente.
- El sistema debe permitir distinguir entre feedback publico de plataformas externas y feedback interno capturado en sitio.

Tablas base sugeridas para soportar multiples usuarios y sucursales:

- AppUser: perfil interno del usuario autenticado con Supabase.
- Role: rol del usuario dentro del sistema, por ejemplo ADMIN o TRABAJADOR.
- Endpoint: endpoints protegidos por permisos.
- RoleEndpointPermission: permisos por rol y endpoint.
- Business: negocio o cliente que compra la plataforma.
- Branch: sucursal perteneciente a un negocio.
- BusinessMembership: relacion entre usuario, negocio y rol dentro de ese negocio.
- UserBranchAccess: sucursales a las que un usuario tiene acceso.
- Survey: definicion de encuesta.
- SurveyQuestion: preguntas de una encuesta.
- SurveyResponse: respuesta general de un cliente a una encuesta.
- SurveyAnswer: respuesta por pregunta.

Notas para app-frontend:

- Este servicio debe consumir los demas servicios y presentar la informacion al usuario autenticado.
- Debe respetar el contexto activo de negocio y sucursal segun los permisos entregados por Auth.
- No debe duplicar reglas de autorizacion sensibles que correspondan al backend.
- Debe ofrecer vistas para dashboard, gestion de usuarios, sucursales, reseñas, analisis, reportes y encuestas.
  <!-- END:nextjs-agent-rules -->
