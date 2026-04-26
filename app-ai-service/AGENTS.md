# Context proyecto

Proyecto base de una aplicacion SaaS llamada U+ Revai. La plataforma permitira que administradores y empleados de distintos negocios puedan centralizar, consultar y analizar reseñas de sus sucursales.

Tecnologias principales:

- FastAPI para exponer endpoints internos del servicio de IA
- Python para orquestacion, prompts y conectores de IA
- PostgreSQL para persistencia compartida a nivel de plataforma
- Gemini API u otro proveedor LLM configurable por entorno

Responsabilidad de `app-ai-service`:

- consumir datos consolidados desde `app-review-service`
- consumir feedback interno desde `app-surveys-service`
- combinar ambas fuentes en una sola carga de analisis
- generar resumenes, temas, alertas, hallazgos y recomendaciones
- publicar el resultado procesado hacia `app-report-service`

Limites del servicio:

- no debe asumir autenticacion de usuario final; su comunicacion principal es servicio a servicio
- no debe duplicar la logica de captura de reviews ni de encuestas
- no debe convertirse en el servicio final de reportes; su salida debe alimentar a `app-report-service`

Contrato esperado inicial:

- entrada principal: `businessId`, `branchId` opcional, rango de fechas opcional
- fuentes remotas: reviews y surveys normalizados por negocio y sucursal
- salida principal: artefacto de analisis listo para ser persistido o consumido por el servicio de reportes

Notas de implementacion:

- usar variables de entorno para URLs internas de `review`, `surveys` y `report`
- encapsular llamadas HTTP en clientes pequenos y testeables
- mantener el proveedor de IA detras de una abstraccion para poder cambiar de Gemini a otro proveedor despues
