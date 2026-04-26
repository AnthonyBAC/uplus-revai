# U+ Revai

Base inicial del workspace para U+ Revai.

Este repositorio se mantiene en `main` solo con scaffold y documentacion. La logica de negocio, modelos finales y conexiones reales se trabajaran despues en `dev` y en ramas por feature.

## Servicios

- `app-auth`
- `app-frontend`
- `app-review-service`
- `app-analysis-service`
- `app-report-service`
- `app-surveys-service`

Todos los servicios fueron creados con la misma base de Next.js para mantener consistencia en el equipo.

## Clonar el repositorio

Para bajar este workspace por primera vez:

```bash
git clone git@github.com:AnthonyBAC/uplus-revai.git
cd uplus-revai
git switch dev || git switch -c dev --track origin/dev
git pull origin dev
```

Despues de clonar el repositorio, cualquier trabajo nuevo debe partir desde la rama `dev`.

Desde `dev`, se crea una rama nueva para la tarea o servicio que se vaya a trabajar:

```bash
git switch -c feature/<nombre-de-la-rama>
```

Cuando la tarea termine, se debe subir esa rama y abrir un Pull Request hacia `dev` para revision.

```bash
git push -u origin feature/<nombre-de-la-rama>
```

Antes de subir cambios a una rama de trabajo, primero se debe actualizar esa rama con los cambios mas recientes de `dev`.

## Antes De Hacer Push: Actualiza Tu Rama

```bash
git switch dev
git pull origin dev
git switch feature/<nombre-de-la-rama>
git merge dev
```

Recien despues de actualizar la rama local `dev`, volver a la rama en la que se esta trabajando, unir ahi los cambios de `dev` con `git merge dev` y resolver cualquier conflicto, se debe hacer push de la rama de trabajo.

```bash
git push
```

Esto ayuda a evitar que cada rama quede atrasada respecto a los cambios ya aprobados en `dev`.

Tambien exige buena comunicacion del equipo: cuando un Pull Request se completa y entra a `dev`, los demas deben saberlo para actualizar su rama local antes de seguir trabajando o antes de subir cambios.

Regla del equipo:

- cualquier servicio o tarea nueva parte desde `dev`
- cualquier Pull Request debe apuntar a `dev`
- `main` no recibe trabajo directo; solo cambios ya revisados e integrados

## Stack base

La base actual del workspace esta hecha con TypeScript, no con JavaScript.

En estilos se esta trabajando con CSS vanilla por ahora. Todavia no se esta usando Tailwind CSS en esta base, porque esa implementacion se dejara para `app-frontend` cuando se trabaje la capa visual del proyecto.

## AGENTS por servicio

Cada servicio tiene su propio archivo `AGENTS.md` dentro de su carpeta raiz.

Ese archivo define el contexto, las reglas y las decisiones especificas de ese servicio para que la inteligencia o agente que trabaje ahi lea la guia correcta antes de hacer cambios.

Antes de trabajar en cualquier servicio, revisar primero:

```bash
/home/anthony/projects/uplus-revai/<nombre-del-servicio>/AGENTS.md
```

## Versiones base

- Node.js: `v22.22.0`
- Next.js: `16.2.4`
- React: `19.2.4`
- React DOM: `19.2.4`
- TypeScript: `^5`
- ESLint: `^9`
- Prisma CLI: `^7.8.0`
- Prisma Client: `^7.8.0`
- Prisma Adapter PG: `^7.8.0`
- `pg`: `^8.20.0`
- `dotenv`: `^17.4.2`
- `tsx`: `^4.21.0`

## Instalacion inicial

Cada servicio ya tiene declaradas las dependencias necesarias para trabajar con Next.js y Prisma mas adelante.

Importante: la raiz del workspace no tiene un `package.json` unico. Por eso `npm install` no se corre en `/home/anthony/projects/uplus-revai`, sino dentro de cada servicio.

Orden recomendado para empezar el proyecto desde cero:

```bash
cd /home/anthony/projects/uplus-revai/<nombre-del-servicio>
npm install
```

Repetir el mismo paso en cada carpeta raiz de servicio del workspace.

Si quieres instalar todo el workspace de una vez desde la raiz, puedes correr:

```bash
for service in app-auth app-frontend app-review-service app-analysis-service app-report-service app-surveys-service; do
    (cd "$service" && npm install)
done
```

## Estructura base sugerida

Dentro de cada servicio se deja una estructura minima para que el equipo tenga un punto de partida comun.

Para servicios backend como `app-auth`, `app-review-service`, `app-analysis-service`, `app-report-service` y `app-surveys-service` la estructura sugerida es esta:

- `src/app`: rutas, paginas y layout de Next.js
- `src/app/api/<feature>/route.ts`: endpoints API del servicio
- `src/lib`: utilidades, helpers, clientes y configuraciones compartidas
- `src/services`: logica de aplicacion o integraciones por servicio
- `src/types`: tipos e interfaces compartidas del servicio

En `app-auth` se dejan ademas archivos `USO_CARPETA.md` dentro de las carpetas importantes para indicar que va ahi y que no. Antes de crear archivos nuevos en ese servicio, conviene leer primero esas descripciones locales.

Para `app-frontend` la estructura sugerida es esta:

- `src/app`: rutas, paginas y layout de Next.js
- `src/components`: componentes visuales y secciones reutilizables
- `src/features`: modulos por dominio de UI
- `src/hooks`: hooks reutilizables del frontend
- `src/lib/config`: configuracion del frontend, como URLs de servicios
- `src/lib/utils`: helpers del frontend
- `src/services/http`: cliente base para fetch
- `src/services/<service>`: integraciones por servicio backend
- `src/types`: tipos de respuestas, UI y contratos del frontend

La idea del frontend es conectarse a los servicios usando variables de entorno con las URLs publicas de despliegue, por ejemplo Vercel u otro gateway. Esas URLs no deben quedar hardcodeadas dentro de componentes.

En `app-frontend` se deja tambien un ejemplo minimo de cliente para consumir el service de auth desde `src/services/auth`.

Notas:

- `route.ts` se deja como ejemplo para mostrar donde deben vivir los endpoints
- `src/generated/prisma` no se crea manualmente; lo genera Prisma con `npx prisma generate`
- las carpetas vacias se dejan con `.gitkeep` para que la estructura quede visible desde el inicio
- en frontend las conexiones a servicios deben salir desde variables `NEXT_PUBLIC_*`, definidas en `.env.example` y luego configuradas en el entorno real de despliegue

## Prisma en esta etapa

Prisma queda instalado en todos los servicios para que el equipo no tenga que volver a agregar paquetes despues.

Por ahora `main` no deja listas las conexiones reales ni las variables de entorno finales. La idea es:

- dejar Prisma instalado
- dejar el scaffold de cada app consistente
- documentar el paso a paso para cuando se implemente cada servicio

## Paquetes Prisma ya incluidos

En cada servicio quedan instalados o declarados estos paquetes:

- `prisma`
- `@prisma/client`
- `@prisma/adapter-pg`
- `pg`
- `dotenv`
- `tsx`

## Pasos sugeridos para implementar Prisma despues

Cuando un servicio realmente vaya a usar base de datos, el orden recomendado es este.

1. Entrar al servicio:

```bash
cd /home/anthony/projects/uplus-revai/<nombre-del-servicio>
```

2. Crear el archivo local de entorno a partir del ejemplo:

```bash
cp .env.example .env
```

3. Inicializar Prisma.

Este comando crea `prisma/schema.prisma`, `prisma.config.ts` y `.env`:

```bash
npx prisma init
```

4. Ajustar `prisma.config.ts` para trabajar con `DIRECT_URL`:

```ts
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: process.env['DIRECT_URL'],
    },
});
```

5. Validar el schema.

`npx prisma validate` no crea archivos. Solo valida que el schema sea correcto:

```bash
npx prisma validate
```

6. Generar el cliente.

Este comando crea la carpeta `src/generated/prisma`:

```bash
npx prisma generate
```

7. Crear o copiar `test-prisma.ts`.

## IMPORTANTE ANTES DEL SIGUIENTE PASO `test-prisma.ts`

Para que ese test funcione, antes deben existir:

- `.env` con `DIRECT_URL`
- `prisma/schema.prisma`
- cliente generado en `src/generated/prisma`

Para ejecutarlo, cuando la conexion ya exista, el flujo esperado seria:

```bash
cd /home/anthony/projects/uplus-revai/<nombre-del-servicio>
npx tsx test-prisma.ts
```

8. Ejecutar la prueba de conexion:

```bash
npx tsx test-prisma.ts
```

Si todo esta bien, la salida esperada es parecida a esta:

```bash
Conexion OK con Prisma: [ { now: 2026-04-26T01:21:25.283Z } ]
```

## Prueba de conexion con Prisma

La prueba simple recomendada se hace con un archivo `test-prisma.ts` en la carpeta raiz del servicio.

Ese archivo sirve para:

- cargar variables de entorno
- crear el adapter PostgreSQL
- instanciar Prisma Client
- ejecutar una consulta simple como `select now()`

## Variables de entorno para conexion

Se deja un ejemplo en `.env.example` dentro de la carpeta raiz del servicio.

Estructura esperada:

```env
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
```

## IMPORTANTE ANTES DE EMPEZAR CON PRISMA

Si la base de datos del servicio ya tiene tablas creadas, no empieces creando migraciones nuevas a ciegas.

Primero debes traer el estado real de la base hacia tu proyecto local:

```bash
cd /home/anthony/projects/uplus-revai/<nombre-del-servicio>
npx prisma db pull
```

Ese comando lee la estructura actual de la base de datos y actualiza `prisma/schema.prisma` con las tablas reales existentes.

Despues de eso, puedes generar el cliente:

```bash
npx prisma generate
```

Recien cuando el `schema.prisma` local represente correctamente lo que ya existe en la base, tiene sentido evaluar si debes crear una nueva migracion.

Si corres `npx prisma migrate dev` sin haber alineado antes el schema local con una base que ya tiene tablas, Prisma puede detectar drift y pedir reset del schema.

## Comandos a repetir cuando cambie el schema

Cada vez que se cree o cambie `prisma/schema.prisma`, correr desde la carpeta raiz del servicio:

```bash
npx prisma generate
npx prisma migrate dev
```

Cuando Prisma pida el nombre de la migracion, usar un nombre relacionado al cambio.

Ejemplos:

- `authtable-integration-tenant`
- `initial-tables-analysis-service`

Nota: `npx prisma migrate dev` esta bien para desarrollo. Si despues despliegas cambios a un entorno remoto o compartido, normalmente el comando esperado sera `npx prisma migrate deploy`.

Importante: todos los comandos de Prisma deben correrse dentro de la carpeta raiz del servicio correspondiente. Si se ejecutan desde la raiz del workspace, Prisma no va a encontrar el `prisma/schema.prisma` de ese servicio.

## Convencion para `main`

`main` debe contener solo:

- scaffold de proyectos
- dependencias base
- documentacion
- convenciones de equipo

No deberia contener aun:

- logica de negocio avanzada
- endpoints finales
- seeds definitivos
- modelos cerrados si todavia no fueron acordados

## Flujo recomendado de ramas

1. `main`: base estable y limpia.
2. `dev`: integracion del proyecto.
3. `feature/*`: trabajo puntual por servicio o tarea.

Flujo esperado:

1. actualizar o posicionarse en `dev`
2. crear una rama `feature/*` desde `dev`
3. desarrollar la tarea en esa rama
4. antes de hacer push, actualizar `dev`, volver a la rama propia y hacer merge de `dev`
5. subir la rama actualizada
6. abrir Pull Request hacia `dev`
7. esperar revision y aprobacion antes de integrar

No se deben abrir Pull Requests hacia `main` desde ramas de trabajo. El destino normal de integracion es siempre `dev`.

Regla operativa: si un PR ya fue aprobado e integrado en `dev`, el resto del equipo debe actualizar su copia local de `dev` y volver a mezclarla en su rama antes de seguir empujando cambios.
