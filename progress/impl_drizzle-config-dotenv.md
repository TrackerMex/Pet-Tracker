# impl: drizzle-config-dotenv

Fecha: 2026-09-06
Agente: `implementer` (fallback documentado en `CLAUDE.md` §Excepciones — fix
suelto sin spec ni id de feature: `drizzle.config.ts` carga el `.env` raíz vía
dotenv y aborta si `DATABASE_URL` falta; un spec y un párrafo en
`docs/conventions.md`). Branch `fix/drizzle-config-dotenv` desde `origin/main`
(`f0872ea`). Sin commit: lo hace el leader.

## Problema

`backend-pet-tracker/drizzle.config.ts` leía `process.env.DATABASE_URL ?? ''`
y drizzle-kit no carga ningún `.env` por su cuenta, así que `pnpm db:migrate`
(PR #107) intentaba conectar con cadena vacía en una máquina limpia. Contexto
en `progress/impl_db-migrate-script.md`.

## Archivos modificados

- `backend-pet-tracker/drizzle.config.ts` — importa `config as loadDotenv` de
  `dotenv` (ya dependencia), llama `loadDotenv({ path: '../.env' })` con el
  mismo patrón exacto que `scripts/provision-local.ts` (ruta relativa al cwd
  `backend-pet-tracker/`), lanza `Error` en español si `DATABASE_URL` sigue
  ausente o vacía, y quita el `?? ''`. Comentario R6 ampliado con el porqué;
  el resto del comentario se mantiene.
- `backend-pet-tracker/src/db/drizzle-config.spec.ts` — **el archivo ya
  existía** (test R2 de `db-setup-drizzle`, referenciado en
  `specs/db-setup-drizzle/traceability.md`). Se conserva el `describe`/`it`
  de R2 con nombres idénticos, pero ahora carga el módulo vía el mismo helper
  `loadDrizzleConfig()` (con `jest.isolateModules` + `jest.doMock('dotenv')`
  y `DATABASE_URL` fijada) en vez del `import` estático de arriba: con el
  cambio, un import estático habría dependido del `.env` real y roto el test
  R2 en CI sin `.env`. Se añade un segundo `describe` con los dos `it` pedidos
  (falta ⇒ lanza error que nombra `DATABASE_URL`; presente ⇒
  `dbCredentials.url` es esa cadena). `afterEach` global restaura la variable.
- `docs/conventions.md` §Variables de entorno — párrafo nuevo justo después
  de "El `.env` vive en la raíz del repo...": migraciones con
  `pnpm db:migrate` / `pnpm db:generate` desde `backend-pet-tracker/`,
  `drizzle.config.ts` carga el `.env` raíz vía dotenv (excepción documentada,
  la misma que `provision-local.ts`) y aborta si `DATABASE_URL` falta.

No tocado: `backend-pet-tracker/README.md` (boilerplate de Nest, sin sección
propia de setup). `progress/current.md` aparece modificado en el working tree
pero es del leader, no de este fix.

## Diff completo

```diff
diff --git a/backend-pet-tracker/drizzle.config.ts b/backend-pet-tracker/drizzle.config.ts
index 37938c9..4a9383d 100644
--- a/backend-pet-tracker/drizzle.config.ts
+++ b/backend-pet-tracker/drizzle.config.ts
@@ -1,3 +1,4 @@
+import { config as loadDotenv } from 'dotenv';
 import { defineConfig } from 'drizzle-kit';
 
 // NOTE (accepted exception to R6): drizzle-kit runs as a standalone CLI tool
@@ -7,11 +8,30 @@ import { defineConfig } from 'drizzle-kit';
 // (see specs/db-setup-drizzle/design.md, "Alternativas descartadas"). No
 // other file under src/** may read process.env.DATABASE_URL directly — see
 // the R6 static check in src/db/database-url-source.spec.ts.
+//
+// Because it runs outside Nest, nothing loads the root `.env` for it: this
+// file loads it explicitly with dotenv (same pattern as
+// scripts/provision-local.ts, relative to the `backend-pet-tracker/` cwd from
+// which `pnpm db:migrate` runs) and aborts if DATABASE_URL is still missing,
+// instead of letting drizzle-kit connect with an empty string.
+loadDotenv({ path: '../.env' });
+
+const databaseUrl = process.env.DATABASE_URL;
+
+if (!databaseUrl) {
+  throw new Error(
+    'Falta DATABASE_URL: drizzle-kit la lee del .env de la raíz del repo ' +
+      '(../.env desde backend-pet-tracker/). Copia .env.example a .env en la ' +
+      'raíz — ahí está el valor local — o exporta DATABASE_URL antes de correr ' +
+      'pnpm db:migrate.',
+  );
+}
+
 export default defineConfig({
   schema: 'src/db/schema/index.ts',
   out: 'src/db/migrations',
   dialect: 'postgresql',
   dbCredentials: {
-    url: process.env.DATABASE_URL ?? '',
+    url: databaseUrl,
   },
 });
diff --git a/backend-pet-tracker/src/db/drizzle-config.spec.ts b/backend-pet-tracker/src/db/drizzle-config.spec.ts
index f2680d8..c4d2c93 100644
--- a/backend-pet-tracker/src/db/drizzle-config.spec.ts
+++ b/backend-pet-tracker/src/db/drizzle-config.spec.ts
@@ -1,9 +1,52 @@
-import config from '../../drizzle.config';
+import type { Config } from 'drizzle-kit';
+
+// drizzle.config.ts vive fuera de src/ (rootDir de jest): el require sube dos
+// niveles. Se mockea dotenv para que ningún test dependa del .env real.
+const CONFIG_PATH = '../../drizzle.config';
+const TEST_DATABASE_URL = 'postgresql://u:p@localhost:5432/test_db';
+
+function loadDrizzleConfig(): Config & { dbCredentials: { url: string } } {
+  let loaded: Config | undefined;
+  jest.isolateModules(() => {
+    jest.doMock('dotenv', () => ({ config: jest.fn() }));
+    // eslint-disable-next-line @typescript-eslint/no-require-imports
+    loaded = (require(CONFIG_PATH) as { default: Config }).default;
+  });
+  return loaded as Config & { dbCredentials: { url: string } };
+}
+
+const originalDatabaseUrl = process.env.DATABASE_URL;
+
+afterEach(() => {
+  if (originalDatabaseUrl === undefined) {
+    delete process.env.DATABASE_URL;
+  } else {
+    process.env.DATABASE_URL = originalDatabaseUrl;
+  }
+});
 
 describe('R2: drizzle.config.ts points to schema barrel and migrations folder', () => {
   it('sets schema, out and dialect for drizzle-kit', () => {
+    process.env.DATABASE_URL = TEST_DATABASE_URL;
+
+    const config = loadDrizzleConfig();
+
     expect(config.schema).toBe('src/db/schema/index.ts');
     expect(config.out).toBe('src/db/migrations');
     expect(config.dialect).toBe('postgresql');
   });
 });
+
+describe('drizzle.config: DATABASE_URL obligatoria al correr drizzle-kit', () => {
+  it('aborta con un error que nombra DATABASE_URL cuando falta', () => {
+    delete process.env.DATABASE_URL;
+
+    expect(() => loadDrizzleConfig()).toThrow(/DATABASE_URL/);
+  });
+
+  it('expone dbCredentials.url con el valor de DATABASE_URL cuando está definida', () => {
+    process.env.DATABASE_URL = TEST_DATABASE_URL;
+
+    expect(loadDrizzleConfig().dbCredentials.url).toBe(TEST_DATABASE_URL);
+  });
+});
diff --git a/docs/conventions.md b/docs/conventions.md
index 4f4bf62..1c28a91 100644
--- a/docs/conventions.md
+++ b/docs/conventions.md
@@ -213,6 +213,12 @@ El `.env` vive en la **raíz del repo** (docker-compose e `init.sh` lo leen
 desde ahí). Como la app corre en `backend-pet-tracker/`, el `ConfigModule`
 debe cargarlo con `envFilePath: ['../.env']`.
 
+Las migraciones se aplican con `pnpm db:migrate` desde `backend-pet-tracker/`
+(y se generan con `pnpm db:generate`). drizzle-kit corre fuera de Nest, así
+que `drizzle.config.ts` carga el `.env` raíz vía dotenv (excepción
+documentada, la misma que `scripts/provision-local.ts`) y aborta con mensaje
+claro si `DATABASE_URL` falta o está vacía — no hace falta exportarla a mano.
+
 | Variable | Para qué | Estado |
 |---|---|---|
 | `DATABASE_URL` | Connection string de Postgres (Docker local) | en `.env.example` — la app la consume desde la primera feature con persistencia |
```

## TDD

1. Rojo: spec nuevo con `drizzle.config.ts` sin tocar →
   `aborta con un error que nombra DATABASE_URL cuando falta` falla con
   `Received function did not throw` (1 failed, 1 passed).
2. Verde: cambio en `drizzle.config.ts` → 3/3 en el spec, 76/76 en `src/db`.

ts-jest transforma `drizzle.config.ts` fuera de `src/` sin `moduleNameMapper`
ni ajuste alguno; no hizo falta tocar la config de jest.

## Comandos ejecutados y salida decisiva

```
$ cd backend-pet-tracker && pnpm test -- src/db
Test Suites: 16 passed, 16 total
Tests:       76 passed, 76 total
```
(incluye `database-url-source.spec.ts` R6 en verde: sigue escaneando solo
`src/**`, `drizzle.config.ts` queda fuera del check como antes.)

```
$ pnpm test            # suite completa del backend
Test Suites: 163 passed, 163 total
Tests:       1237 passed, 1237 total
```

```
$ pnpm run build
> nest build && tsc-alias -p tsconfig.build.json
build exit=0
```

```
$ npx eslint drizzle.config.ts src/db/drizzle-config.spec.ts
eslint exit=0
$ npx prettier --write drizzle.config.ts src/db/drizzle-config.spec.ts
drizzle.config.ts (unchanged) / src/db/drizzle-config.spec.ts (unchanged)
```

Rama del error contra el CLI real (sin base de datos; `.env` raíz renombrado
temporalmente y restaurado en el mismo comando — verificado `ls -la ../.env`
después, mismo tamaño 1520 y mtime original):

```
$ mv ../.env ../.env.tmp-bak && env -u DATABASE_URL npx drizzle-kit migrate; mv ../.env.tmp-bak ../.env
Falta DATABASE_URL: drizzle-kit la lee del .env de la raíz del repo (../.env desde backend-pet-tracker/). Copia .env.example a .env en la raíz — ahí está el valor local — o exporta DATABASE_URL antes de correr pnpm db:migrate.
exit=1
```

`pnpm db:migrate` NO se ejecutó contra ninguna base de datos.

## Notas para el reviewer

- `DOTENV_CONFIG_PATH` no aplica a `config({ path })` explícito (solo al
  preload `dotenv/config`), por eso la rama del error se verificó renombrando
  el `.env` raíz y no con esa variable.
- El helper del spec usa `require` con `eslint-disable-next-line
  @typescript-eslint/no-require-imports`: `jest.isolateModules` es síncrono y
  un `import()` dinámico no cabe dentro. Es el único `require` en specs del
  repo; alternativa sería `jest.isolateModulesAsync` + `await import`, que
  con `module: nodenext` ts-jest no compila a `require` de forma fiable.
- La regla "una sola vía" se respeta: `drizzle.config.ts` y
  `provision-local.ts` usan la misma llamada literal
  `loadDotenv({ path: '../.env' })`. Cualquier script que se corra desde
  otro cwd seguirá sin encontrar el `.env`, igual que antes.
