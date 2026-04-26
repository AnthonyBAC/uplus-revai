# U+ Revai

<p>
  <img alt="Branch main" src="https://img.shields.io/badge/main-scaffold%20y%20documentacion-1f6feb?style=for-the-badge" />
  <img alt="Branch dev" src="https://img.shields.io/badge/dev-integracion%20activa-238636?style=for-the-badge" />
  <img alt="Workflow feature" src="https://img.shields.io/badge/feature-rama%20de%20trabajo-f59e0b?style=for-the-badge" />
</p>

<p>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" />
  <img alt="Python" src="https://img.shields.io/badge/Python-3.11%2B-3776ab?logo=python&logoColor=white" />
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-AI%20service-009688?logo=fastapi&logoColor=white" />
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16.2.4-111111?logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19.2.4-149eca?logo=react&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-7.8.0-2d3748?logo=prisma&logoColor=white" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-v22.22.0-339933?logo=nodedotjs&logoColor=white" />
</p>

Base inicial del workspace para U+ Revai.

> [!IMPORTANT]
> Este repositorio se mantiene en `main` solo con scaffold y documentacion.
> La logica de negocio, modelos finales y conexiones reales se trabajaran despues en `dev` y en ramas por feature.

## Navegacion rapida

- [Servicios](#servicios)
- [Clonar el repositorio](#clonar-el-repositorio)
- [Flujo recomendado de ramas](#flujo-recomendado-de-ramas)
- [Stack base](#stack-base)
- [Instalacion inicial](#instalacion-inicial)
- [Estructura base sugerida](#estructura-base-sugerida)
- [Flujo del backend de IA](#flujo-del-backend-de-ia)
- [Prisma en esta etapa](#prisma-en-esta-etapa)
- [Convencion para main](#convencion-para-main)

---

## Servicios

| Servicio               | Perfil     | Estado actual                                                    | Nota rapida                                         |
| ---------------------- | ---------- | ---------------------------------------------------------------- | --------------------------------------------------- |
| `app-auth`             | Backend    | ![Scaffold](https://img.shields.io/badge/estado-scaffold-2ea043) | Base con Prisma y guias `USO_CARPETA.md`            |
| `app-ai-service`       | Backend IA | ![Scaffold](https://img.shields.io/badge/estado-scaffold-2ea043) | FastAPI para orquestar `review + surveys -> report` |
| `app-frontend`         | Frontend   | ![Scaffold](https://img.shields.io/badge/estado-scaffold-2ea043) | Base UI y cliente por servicios                     |
| `app-review-service`   | Backend    | ![Scaffold](https://img.shields.io/badge/estado-scaffold-2ea043) | Servicio aislado para review                        |
| `app-analysis-service` | Backend    | ![Scaffold](https://img.shields.io/badge/estado-scaffold-2ea043) | Servicio aislado para analysis                      |
| `app-report-service`   | Backend    | ![Scaffold](https://img.shields.io/badge/estado-scaffold-2ea043) | Servicio aislado para reportes                      |
| `app-surveys-service`  | Backend    | ![Scaffold](https://img.shields.io/badge/estado-scaffold-2ea043) | Servicio aislado para encuestas                     |

La mayoria de los servicios fueron creados con la misma base de Next.js para mantener consistencia en el equipo. La excepcion actual es `app-ai-service`, que se deja en Python con FastAPI porque su responsabilidad principal es la orquestacion de IA entre servicios.

---

## Clonar el repositorio

Para bajar este workspace por primera vez:

```bash
git clone git@github.com:AnthonyBAC/uplus-revai.git
cd uplus-revai
git switch dev || git switch -c dev --track origin/dev
git pull origin dev
```

> [!TIP]
> Despues de clonar el repositorio, cualquier trabajo nuevo debe partir desde la rama `dev`.

Desde `dev`, se crea una rama nueva para la tarea o servicio que se vaya a trabajar:

```bash
git switch -c feature/<nombre-de-la-rama>
```

Cuando la tarea termine, se debe subir esa rama y abrir un Pull Request hacia `dev` para revision.

```bash
git push -u origin feature/<nombre-de-la-rama>
```

---

## Antes De Hacer Push: Actualiza Tu Rama

Antes de subir cambios a una rama de trabajo, primero se debe actualizar esa rama con los cambios mas recientes de `dev`.

```bash
git switch dev
git pull origin dev
git switch feature/<nombre-de-la-rama>
git merge dev
git push
```

Esto ayuda a evitar que cada rama quede atrasada respecto a los cambios ya aprobados en `dev`.

Tambien exige buena comunicacion del equipo: cuando un Pull Request se completa y entra a `dev`, los demas deben saberlo para actualizar su rama local antes de seguir trabajando o antes de subir cambios.

> [!IMPORTANT]
> Regla del equipo:
>
> - cualquier servicio o tarea nueva parte desde `dev`
> - cualquier Pull Request debe apuntar a `dev`
> - `main` no recibe trabajo directo; solo cambios ya revisados e integrados

---

## Stack base

La mayor parte del workspace esta hecha con TypeScript, no con JavaScript.

En estilos se esta trabajando con CSS vanilla por ahora. Todavia no se esta usando Tailwind CSS en esta base, porque esa implementacion se dejara para `app-frontend` cuando se trabaje la capa visual del proyecto.

Para el backend de IA se agrega una excepcion intencional: `app-ai-service` usa Python con FastAPI para facilitar integraciones con proveedores LLM, orquestacion de prompts y pipelines de analisis.

| Tecnologia        | Version base |
| ----------------- | ------------ |
| Node.js           | `v22.22.0`   |
| Python            | `3.11+`      |
| FastAPI           | `>=0.115.0`  |
| Next.js           | `16.2.4`     |
| React             | `19.2.4`     |
| React DOM         | `19.2.4`     |
| TypeScript        | `^5`         |
| ESLint            | `^9`         |
| Prisma CLI        | `^7.8.0`     |
| Prisma Client     | `^7.8.0`     |
| Prisma Adapter PG | `^7.8.0`     |
| `pg`              | `^8.20.0`    |
| `dotenv`          | `^17.4.2`    |
| `tsx`             | `^4.21.0`    |

---

## AGENTS por servicio

Cada servicio tiene su propio archivo `AGENTS.md` dentro de su carpeta raiz.

Ese archivo define el contexto, las reglas y las decisiones especificas de ese servicio para que la inteligencia o agente que trabaje ahi lea la guia correcta antes de hacer cambios.

Antes de trabajar en cualquier servicio, revisar primero:

- [app-analysis-service/AGENTS.md](app-analysis-service/AGENTS.md)
- [app-ai-service/AGENTS.md](app-ai-service/AGENTS.md)
- [app-auth/AGENTS.md](app-auth/AGENTS.md)
- [app-frontend/AGENTS.md](app-frontend/AGENTS.md)
- [app-report-service/AGENTS.md](app-report-service/AGENTS.md)
- [app-review-service/AGENTS.md](app-review-service/AGENTS.md)
- [app-surveys-service/AGENTS.md](app-surveys-service/AGENTS.md)

---

## Instalacion inicial

Los servicios Node ya tienen declaradas las dependencias necesarias para trabajar con Next.js y Prisma mas adelante. `app-ai-service` usa dependencias Python declaradas en `pyproject.toml`.

> [!WARNING]
> La raiz del workspace no tiene un `package.json` unico ni un `pyproject.toml` unico.
> Por eso la instalacion se hace dentro de cada servicio segun su stack.

Instalacion para servicios Node/Next:

```bash
cd /home/anthony/projects/uplus-revai/<nombre-del-servicio>
npm install
```

Instalacion para `app-ai-service`:

```bash
cd /home/anthony/projects/uplus-revai/app-ai-service
python -m venv .venv
source .venv/bin/activate
pip install -e .
```

La recomendacion para Python es que el entorno virtual quede dentro del servicio, por ejemplo `app-ai-service/.venv`, y no suelto en la raiz del workspace.

Tambien puedes simplificar ese setup con:

```bash
cd /home/anthony/projects/uplus-revai/app-ai-service
make setup
```

O evitar depender del Python local usando Docker:

```bash
cd /home/anthony/projects/uplus-revai/app-ai-service
cp env.example .env
docker compose up --build
```

Para `app-ai-service`, ese flujo con Docker debe considerarse el flujo oficial del equipo.

Tambien se recomienda instalar en VS Code la extension `Prettier - Code formatter` de `esbenp.prettier-vscode`. Cada carpeta `app-*` tiene su propio `.prettierrc.json` para mantener formato consistente por servicio.

Repetir el paso correspondiente segun el stack de cada servicio.

---

## Estructura base sugerida

Dentro de cada servicio se deja una estructura minima para que el equipo tenga un punto de partida comun.

### Backend services

Para servicios backend como `app-auth`, `app-review-service`, `app-analysis-service`, `app-report-service` y `app-surveys-service` la estructura sugerida es esta:

| Ruta                             | Uso esperado                                                |
| -------------------------------- | ----------------------------------------------------------- |
| `src/app`                        | rutas, paginas y layout de Next.js                          |
| `src/app/api/<feature>/route.ts` | endpoints API del servicio                                  |
| `src/lib`                        | utilidades, helpers, clientes y configuraciones compartidas |
| `src/services`                   | logica de aplicacion o integraciones por servicio           |
| `src/types`                      | tipos e interfaces compartidas del servicio                 |

En `app-auth` se dejan ademas archivos `USO_CARPETA.md` dentro de las carpetas importantes para indicar que va ahi y que no. Antes de crear archivos nuevos en ese servicio, conviene leer primero esas descripciones locales.

### Frontend

Para `app-frontend` la estructura sugerida es esta:

| Ruta                     | Uso esperado                                       |
| ------------------------ | -------------------------------------------------- |
| `src/app`                | rutas, paginas y layout de Next.js                 |
| `src/components`         | componentes visuales y secciones reutilizables     |
| `src/features`           | modulos por dominio de UI                          |
| `src/hooks`              | hooks reutilizables del frontend                   |
| `src/lib/config`         | configuracion del frontend, como URLs de servicios |
| `src/lib/utils`          | helpers del frontend                               |
| `src/services/http`      | cliente base para fetch                            |
| `src/services/<service>` | integraciones por servicio backend                 |
| `src/types`              | tipos de respuestas, UI y contratos del frontend   |

La idea del frontend es conectarse a los servicios usando variables de entorno con las URLs publicas de despliegue, por ejemplo Vercel u otro gateway. Esas URLs no deben quedar hardcodeadas dentro de componentes.

En `app-frontend` se deja tambien un ejemplo minimo de cliente para consumir el service de auth desde `src/services/auth`.

### Servicio de IA en Python

Para `app-ai-service` la estructura inicial sugerida es esta:

| Ruta             | Uso esperado                        |
| ---------------- | ----------------------------------- |
| `src/main.py`    | entrypoint FastAPI                  |
| `src/api/routes` | rutas HTTP del servicio             |
| `src/core`       | configuracion y utilidades base     |
| `src/services`   | clientes internos y orquestacion IA |
| `src/schemas`    | contratos de request y response     |

### Notas de estructura

- `route.ts` se deja como ejemplo para mostrar donde deben vivir los endpoints.
- `src/generated/prisma` no se crea manualmente; lo genera Prisma con `npx prisma generate`.
- Las carpetas vacias se dejan con `.gitkeep` para que la estructura quede visible desde el inicio.
- En frontend las conexiones a servicios deben salir desde variables `NEXT_PUBLIC_*`, definidas en `.env.example` y luego configuradas en el entorno real de despliegue.

---

## Flujo del backend de IA

`app-ai-service` queda pensado como un backend de orquestacion, no como reemplazo de `review`, `surveys` ni `report`.

Flujo esperado:

1. `app-review-service` expone reviews normalizadas por negocio y sucursal.
2. `app-surveys-service` expone respuestas de encuestas internas para el mismo negocio o sucursal.
3. `app-ai-service` consume ambas fuentes, construye el contexto y genera analisis con el proveedor LLM configurado.
4. `app-ai-service` envia el resultado consolidado a `app-report-service`.
5. `app-report-service` persiste o expone el artefacto final para consumo del dashboard.

Resumen corto del flujo:

```text
review + surveys -> app-ai-service -> report
```

> [!TIP]
> FastAPI es una buena eleccion para este servicio porque te deja separar facil la capa HTTP, la capa de clientes internos y la capa de integracion con el proveedor de IA.

---

## Prisma en esta etapa

Prisma queda instalado en los servicios Node donde se espera persistencia o acceso relacional directo. `app-ai-service` no depende de Prisma en esta base inicial porque su rol principal es orquestar datos entre servicios y generar analisis.

Por ahora `main` no deja listas las conexiones reales ni las variables de entorno finales. La idea es:

- dejar Prisma instalado
- dejar el scaffold de cada app consistente
- documentar el paso a paso para cuando se implemente cada servicio

### Paquetes Prisma ya incluidos

En cada servicio quedan instalados o declarados estos paquetes:

- `prisma`
- `@prisma/client`
- `@prisma/adapter-pg`
- `pg`
- `dotenv`
- `tsx`

### Pasos sugeridos para implementar Prisma despues

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

> [!WARNING]
> Para que ese test funcione, antes deben existir:
>
> - `.env` con `DIRECT_URL`
> - `prisma/schema.prisma`
> - cliente generado en `src/generated/prisma`

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

### Prueba de conexion con Prisma

La prueba simple recomendada se hace con un archivo `test-prisma.ts` en la carpeta raiz del servicio.

Ese archivo sirve para:

- cargar variables de entorno
- crear el adapter PostgreSQL
- instanciar Prisma Client
- ejecutar una consulta simple como `select now()`

### Variables de entorno para conexion

Se deja un ejemplo en `.env.example` dentro de la carpeta raiz del servicio.

Estructura esperada:

```env
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
```

### IMPORTANTE ANTES DE EMPEZAR CON PRISMA

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

### Comandos a repetir cuando cambie el schema

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

---

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

---

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
