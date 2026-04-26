# src/app/api

Aqui van los endpoints del servicio usando `route.ts`.

Si va aqui:

- handlers HTTP
- validacion basica de entrada o salida
- llamada hacia la capa de servicios

No va aqui:

- consultas Prisma grandes
- reglas de negocio completas
- tipos globales que deban reutilizarse fuera del endpoint