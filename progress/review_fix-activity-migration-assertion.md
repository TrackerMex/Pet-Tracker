# review: fix-activity-migration-assertion
Fecha: 2026-08-05
Veredicto: APROBADO

## Naturaleza de la tarea

Bugfix de 1 archivo sobre feature ya `done` (`trips-activity` #10). Sin spec
ni traceability que gatear (bugfix de harness de tests, no feature) — se
aplica el checklist reducido acordado en la instrucción del leader en vez del
checklist C2-C7 completo.

## 1. Diff toca exactamente 1 archivo

`git show --stat 4314edb` y `git diff main...fix/activity-migration-assertion --stat`
coinciden: único archivo modificado es
`backend-pet-tracker/src/modules/activity/infrastructure/repositories/activity.drizzle.store.spec.ts`
(+12/-1). Ningún otro archivo de aplicación tocado.

## 2. Fidelidad del patrón replicado

Confirmado leyendo `devices.schema.spec.ts` (líneas 8-24, 180-202) y
`pets.schema.spec.ts` (líneas 8-22, 171-180) junto al diff real:

- Ambos archivos de referencia localizan la migración por **contenido**
  (`.find((sql) => sql.includes('CREATE TABLE "X"'))`), no por posición/orden
  en el directorio, y luego assertan que ese SQL no menciona tablas hermanas.
- El fix replica exactamente ese patrón: `files.map(migrationSql).find(...)`
  sobre `CREATE TABLE "activity_daily"`, seguido de 6
  `expect(...).not.toContain('CREATE TABLE "X"')` — uno por cada tabla del
  esquema salvo `activity_daily` (`pets`, `pet_users`, `devices`,
  `pet_devices`, `users`, `audit_log`; confirmado contra
  `backend-pet-tracker/src/db/schema/*.schema.ts`, 6 archivos de schema
  existentes).
- Ninguna de las dos referencias cubre `email_verification_tokens`
  tampoco (devices.schema.spec.ts solo chequea 4 tablas, pets.schema.spec.ts
  solo 1) — no es un hueco introducido por este fix, es consistente con la
  convención ya establecida en ambos archivos hermanos.
- La aserción vieja (`files.filter((file) => file > '0005_zzzz')`) fue
  **eliminada por completo**, no comentada ni duplicada (ver C7 abajo).
- El bloque exhaustivo preexistente e intocado (líneas 148-155:
  `createdTables` extraído por regex del SQL de `added[0]` y comparado con
  `toEqual(['activity_daily'])`) ya cubre el caso completo — incluyendo
  `email_verification_tokens` — así que las 6 aserciones nuevas son
  redundantes con ese chequeo posterior, pero es la redundancia pedida
  explícitamente por la tarea ("mismo patrón que devices/pets"), no
  sobre-ingeniería del implementer.

Patrón fiel, sin variación con hueco.

## 3. Verificación independiente

`./init.sh` corrido por el reviewer (no por el implementer):

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

Coincide exactamente con el reporte del implementer. (Nota aparte, no
bloqueante: init.sh emite `⚠️ STATUS.md desactualizado (9/18 declarado vs
10/18 real)` — preexistente, ajeno a este bugfix, no lo introduce ni lo
agrava esta branch.)

`pnpm -C backend-pet-tracker test:e2e` corrido por separado:

```
FAIL test/media.e2e-spec.ts
  ● Pet photo upload (e2e) › R8: el bucket nunca es publico — GET directo sin firma responde 403
    Expected: 403
    Received: 200

Test Suites: 1 failed, 8 passed, 9 total
Tests:       1 failed, 121 passed, 122 total
```

Único fallo: `test/media.e2e-spec.ts` R8. Verificado contra `STATUS.md`
líneas 294-301 (cierre de `pet-photos-s3` #6): LocalStack Community 4.14 no
aplica ACL/bucket-policy en el plano de datos S3, `GET` anónimo responde
`200` en vez de `403` — limitación documentada y aceptada por el humano, no
relacionada a `activity` ni a migraciones. No hay ninguna otra regresión en
el resto de la suite e2e (121/122 pasan).

## 4. El test sigue siendo una prueba real

- `.find()` localiza la migración por contenido — si `activity_daily` migrara
  junto con cualquiera de las 6 tablas listadas, el `not.toContain`
  correspondiente fallaría. No es un `expect(true).toBe(true)` disfrazado.
- El propio reporte del implementer documenta la reproducción rojo → verde:
  con un archivo `0006_zzz_repro.sql` temporal (root cause real: cualquier
  migración posterior a la 0005 rompía la aserción vieja), la aserción vieja
  fallaba con evidencia concreta (`Received array: ["0006_zzz_repro.sql"]`);
  tras el fix, verde tanto con `0006` presente como sin él — confirma que ya
  no depende del orden/posición en el directorio.
- El bloque exhaustivo preexistente e intocado (`createdTables` vs
  `['activity_daily']`) sigue funcionando como red de seguridad adicional:
  detecta el caso real que le importa (0005 crea únicamente
  `activity_daily`) independientemente de las 6 aserciones nuevas.
- No se editó código de aplicación para verificar esto (fuera del rol de
  reviewer); la verificación es estática (lectura de la aserción) más la
  evidencia rojo/verde ya documentada por el implementer.

## 5. `.gitignore` / `.mcp.json`

`git show --stat 4314edb` y `git diff main...fix/activity-migration-assertion --stat`
solo listan el archivo de test. `.gitignore`/`.mcp.json` aparecen modificados
en el working tree (`git status`) pero **no forman parte de este commit ni de
esta branch** — son drift local preexistente, ajeno a esta tarea, tal como
declaró el implementer.

## Checklist reducido (aplica solo lo pertinente a un bugfix de 1 archivo)

- [x] C3 — Arquitectura: único archivo tocado es un `.spec.ts` de
      infrastructure/repositories que verifica texto SQL de una migración;
      cero código de dominio/aplicación/infraestructura de producción
      tocado, cero cruce de capas posible.
- [x] C7 — Sin código huérfano: la aserción vieja fue eliminada por
      completo (no comentada, no duplicada); nada que reemplazó quedó sin
      limpiar (confirmado `git status` sin `0006_zzz_repro.sql` ni otros
      restos).
- N/A — C4/C5/C6 (TDD por R-id, trazabilidad, spec aprobada): no aplican,
      bugfix de harness sin spec, según instrucción explícita de la tarea.

## Observaciones

Ninguna. Aprobado sin reservas.
