# impl: fix-activity-migration-assertion
Fecha: 2026-08-05

## Contexto

Bugfix de 1 archivo sobre la feature `trips-activity` (#10), ya `done`/mergeada.
Sin spec — root cause y fix ya diagnosticados y verificados de forma
independiente por el `reviewer` de la feature `geofences-crud` (#11, branch
separada), que detectó que `./init.sh` no cierra en verde en cuanto existe una
migración `0006` (de cualquier feature). Esta tarea solo aplica ese fix ya
acordado, sin rediseñar nada.

## Archivo modificado

- `backend-pet-tracker/src/modules/activity/infrastructure/repositories/activity.drizzle.store.spec.ts`
  — test `'la 0005 es la unica migracion nueva y solo crea esa tabla'`.

  La aserción `expect(files.filter((file) => file > '0005_zzzz')).toHaveLength(0)`
  verificaba una propiedad global y temporal del directorio de migraciones
  ("no existe ningún archivo alfabéticamente posterior a 0005"), no una
  propiedad de la migración 0005 en sí. Se rompe con cualquier migración
  futura de cualquier feature (ya ocurre con la `0006` de `geofences-crud`).

  Reemplazada por una verificación local al contenido de la migración 0005,
  replicando el patrón ya usado en `devices.schema.spec.ts` (líneas 8-24,
  180-202) y `pets.schema.spec.ts`: localizar el archivo `.sql` por su
  contenido (`CREATE TABLE "activity_daily"`) y confirmar que no crea
  ninguna otra tabla conocida del esquema (`pets`, `pet_users`, `devices`,
  `pet_devices`, `users`, `audit_log`).

  ```diff
       expect(added).toHaveLength(1);
  -    expect(files.filter((file) => file > '0005_zzzz')).toHaveLength(0);
  +
  +    // Local a 0005: localiza la migracion por contenido (no por ser la
  +    // ultima del directorio) y confirma que no crea ninguna otra tabla.
  +    const activityMigrationSql = files
  +      .map((file) => migrationSql(file))
  +      .find((content) => content.includes('CREATE TABLE "activity_daily"'));
  +    expect(activityMigrationSql).not.toContain('CREATE TABLE "pets"');
  +    expect(activityMigrationSql).not.toContain('CREATE TABLE "pet_users"');
  +    expect(activityMigrationSql).not.toContain('CREATE TABLE "devices"');
  +    expect(activityMigrationSql).not.toContain('CREATE TABLE "pet_devices"');
  +    expect(activityMigrationSql).not.toContain('CREATE TABLE "users"');
  +    expect(activityMigrationSql).not.toContain('CREATE TABLE "audit_log"');

       const sql = migrationSql(added[0]);
  ```

  No se tocó ninguna otra aserción de ese `it`, ningún otro test del archivo,
  ni nada fuera de este único archivo.

## TDD: rojo → verde

Esta branch (creada desde `main`) todavía no tiene una migración `0006`, así
que la aserción rota no falla "en frío" aquí. Para reproducir la causa raíz
exactamente como la describió el reviewer, se creó temporalmente
`backend-pet-tracker/src/db/migrations/0006_zzz_repro.sql` (archivo suelto,
no registrado en `meta/_journal.json`, solo para el test unitario):

**Rojo** (con `0006_zzz_repro.sql` presente, antes del fix):
```
FAIL src/modules/activity/infrastructure/repositories/activity.drizzle.store.spec.ts
  ● R10: la migracion 0005 crea unicamente activity_daily › la 0005 es la unica migracion nueva y solo crea esa tabla

    expect(received).toHaveLength(expected)
    Expected length: 0
    Received length: 1
    Received array:  ["0006_zzz_repro.sql"]
      at activity.drizzle.store.spec.ts:135:56
```

Se borró el archivo de repro, se aplicó el fix, y se confirmó:
1. **Verde** sin `0006` presente (estado real de esta branch).
2. **Verde** volviendo a crear `0006_zzz_repro.sql` (prueba de que el fix ya
   no depende de la posición del archivo en el directorio).
3. Se borró `0006_zzz_repro.sql` de nuevo — no queda ningún rastro en el
   working tree (`git status` solo muestra `.gitignore`/`.mcp.json`, ajenos).

## Commit

- `4314edbdc3f47147e4454aab37a7cbe0a6ef411d` —
  `fix(activity): stop asserting migration 0005 is the last in the repo`
  (branch `fix/activity-migration-assertion`, 1 archivo, +12/-1)

## Resultado de `./init.sh`

Verde completo:

```
→ Build...
✅ Build exitoso

→ Ejecutando tests...
Test Suites: 91 passed, 91 total
Tests:       623 passed, 623 total
✅ Tests pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

✅ Todo verde. Listo para trabajar.
  Features: 10/18 completadas | 8 pendientes
```

`init.sh` usa `TEST_CMD` (jest con `testRegex: .*\.spec\.ts$`), que no
incluye los e2e (`*.e2e-spec.ts`, config separada `test/jest-e2e.json`). Se
corrió `pnpm -C backend-pet-tracker test:e2e` aparte, tal como pide la
verificación de esta tarea:

```
Test Suites: 1 failed, 8 passed, 9 total
Tests:       1 failed, 121 passed, 122 total
```

El único fallo es el ya conocido y documentado en `STATUS.md` (líneas
~295-322, feature `pet-photos-s3` #6): `test/media.e2e-spec.ts` › `R8: el
bucket nunca es publico` — LocalStack Community 4.14 no aplica ACL/bucket
policy, el GET sin firma responde `200` en vez de `403`. No relacionado a
este cambio (no toca `activity` ni migraciones) y ya aceptado como
limitación documentada de LocalStack. No se intentó arreglar — fuera de
alcance de esta tarea.

## Notas para el reviewer

- Cambio de una sola aserción en un solo archivo `.spec.ts`; sin spec/R-ids
  asociados (bugfix de harness de tests, no feature).
- El fallo de `media.e2e-spec.ts` R8 es preexistente y documentado — no lo
  reintroduje ni lo agravé; corre igual en esta branch que en `main`.
- `.gitignore` y `.mcp.json` quedan modificados en el working tree pero sin
  stage/commit — son cambios ajenos preexistentes, no tocados por esta tarea.
