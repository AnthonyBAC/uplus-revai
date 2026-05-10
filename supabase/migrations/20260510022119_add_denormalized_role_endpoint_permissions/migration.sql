-- 1. Agregar columnas como nullable primero
ALTER TABLE "role_endpoint_permissions"
ADD COLUMN "endpoint_key" TEXT,
ADD COLUMN "role_name" "RoleName";

-- 2. Poblar datos existentes desde las relaciones
UPDATE "role_endpoint_permissions" rp
SET
  "endpoint_key" = e."key",
  "role_name" = r."name"
FROM "endpoints" e, "roles" r
WHERE rp."endpoint_id" = e."id" AND rp."role_id" = r."id";

-- 3. Hacerlas NOT NULL
ALTER TABLE "role_endpoint_permissions"
ALTER COLUMN "endpoint_key" SET NOT NULL,
ALTER COLUMN "role_name" SET NOT NULL;
