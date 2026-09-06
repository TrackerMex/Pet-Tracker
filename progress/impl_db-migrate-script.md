# impl: db-migrate-script

Fecha: 2026-09-05
Agente: `implementer` (fallback documentado en `CLAUDE.md` §Excepciones — cambio
trivial de una línea, sin spec y sin TDD: es un script de `package.json`, no
lógica de aplicación).

## Archivos modificados

- `C:\pet-tracker\backend-pet-tracker\package.json` — añadida una línea en
  `"scripts"`, justo después de `"db:generate"`:

  ```json
  "db:migrate": "drizzle-kit migrate",
  ```

Sin cambios en dependencias ni en ningún otro script. Orden preservado,
indentación de 4 espacios como el resto del bloque, y el archivo sigue con
finales de línea LF (verificado antes y después: 0 caracteres CR, igual que en
HEAD, así que no hay churn de line endings).

Diff completo:

```
diff --git a/backend-pet-tracker/package.json b/backend-pet-tracker/package.json
index 6af3adb..d2897d7 100644
--- a/backend-pet-tracker/package.json
+++ b/backend-pet-tracker/package.json
@@ -19,6 +19,7 @@
     "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
     "test:e2e": "jest --config ./test/jest-e2e.json",
     "db:generate": "drizzle-kit generate",
+    "db:migrate": "drizzle-kit migrate",
     "provision:local": "ts-node -r tsconfig-paths/register scripts/provision-local.ts",
     "provision:device": "ts-node -r tsconfig-paths/register scripts/provision-device.ts",
     "seed:devices": "ts-node -r tsconfig-paths/register scripts/seed-devices.ts",
```

`git diff --stat`: `1 file changed, 1 insertion(+)`.

## Verificaciones ejecutadas

### 1. JSON válido

```
$ node -e "require('C:/pet-tracker/backend-pet-tracker/package.json'); console.log('valid JSON')"
valid JSON
```

### 2. El script se resuelve (sin ejecutar la migración)

```
$ pnpm -C C:/pet-tracker/backend-pet-tracker run
...
  db:generate
    drizzle-kit generate
  db:migrate
    drizzle-kit migrate
  provision:local
    ts-node -r tsconfig-paths/register scripts/provision-local.ts
...
```

`db:migrate` aparece en el listado, en la posición esperada. **No** se ejecutó
`pnpm run db:migrate` — la BD ya está al día.

No se corrieron `$BUILD_CMD` ni `$TEST_CMD`: el cambio no toca código
compilable ni testeable (solo el bloque `scripts`), y el alcance recibido lo
excluía explícitamente.

## Nota sobre DATABASE_URL (importante para quien use el script)

`drizzle-kit migrate` lee la conexión desde `drizzle.config.ts`, que a su vez
toma `process.env.DATABASE_URL` directamente (excepción aceptada a R6,
documentada en el propio archivo: drizzle-kit corre como CLI fuera del runtime
de NestJS, así que `ConfigService` no está disponible ahí).

En local ese valor vive en `C:\pet-tracker\.env`, y **nadie lo carga
automáticamente** para drizzle-kit — `drizzle.config.ts` no importa `dotenv`.
Si la variable no está en el entorno, `dbCredentials.url` cae al `?? ''` y el
comando falla por conexión vacía.

Uso correcto:

```bash
DATABASE_URL=postgres://... pnpm run db:migrate
```

o con la variable ya exportada en la shell (en PowerShell:
`$env:DATABASE_URL = '...'` antes de invocar el script).

## Fuera de alcance (no hecho, a propósito)

- Sin commit.
- Sin tocar `docs/`, `STATUS.md`, `specs/`, `.env.example` ni ningún otro
  archivo.
- No se añadió carga de `dotenv` a `drizzle.config.ts`: sería un cambio de
  comportamiento fuera del alcance pedido. Si el paso manual de la variable
  molesta, es una decisión aparte para el leader.

## Notas para el reviewer

- El único punto que merece mirada es el de `DATABASE_URL`: el script es
  cómodo pero no es autosuficiente, y alguien que lo invoque a secas verá un
  error de conexión poco obvio. Si eso se considera una trampa, la corrección
  natural (añadir `dotenv/config` a `drizzle.config.ts`, apuntando a
  `../.env`) debería entrar como su propia tarea, no colada aquí.
- Verificar que la indentación y el orden del bloque `scripts` no se
  alteraron: el diff de una sola línea lo confirma.
