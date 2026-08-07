# fix: media-r8-localstack

Fecha: 2026-08-07
Branch: `fix/media-r8-localstack`
Tipo: ciclo corto de fix — **no** es una feature del backlog, `feature_list.json` sin tocar.

## Problema

Al activar los e2e desde `init.sh` (commit `6df9ab4` de esta branch — antes
`TEST_CMD` usaba un jest con `rootDir: "src"` que nunca los alcanzaba)
apareció un fallo determinista:

```
test/media.e2e-spec.ts:317
  R8: el bucket nunca es publico — GET directo sin firma responde 403
  Expected: 403   Received: 200
```

## Diagnóstico (confirmado, no es una vulnerabilidad)

El código de la feature #6 es correcto y el bucket **no** está expuesto.
`provisionMediaBucket()` (`backend-pet-tracker/src/aws/provisioning.ts:235`)
aplica los cuatro flags y LocalStack los almacena:

```
GetPublicAccessBlock(pet-tracker-media-local) →
{"BlockPublicAcls":true,"IgnorePublicAcls":true,
 "BlockPublicPolicy":true,"RestrictPublicBuckets":true}
```

LocalStack Community los **persiste como metadata pero no los hace cumplir**:
el enforcement de IAM en el plano de datos de S3 es funcionalidad Pro, así que
sirve el objeto sin firma con `200` igualmente. Comprobado también con una
bucket policy `Deny` explícita sobre un bucket descartable: tampoco se aplica.

En AWS real, con esos flags y sin bucket policy pública, ese mismo `GET`
anónimo respondería `403`.

O sea: **el test verificaba el emulador, no el código.**

## Qué cambié

### `backend-pet-tracker/test/media.e2e-spec.ts` (único archivo de código)

R8 reescrito. Sigue siendo e2e contra LocalStack real — reutiliza el
`S3Client` que el contenedor Nest ya expone (`app.get(S3_CLIENT)`, `AwsModule`
es `@Global`), sin construir cliente nuevo ni mocks. Dos casos:

1. `GetPublicAccessBlock devuelve los 4 flags de bloqueo en true`
2. `no existe una bucket policy que conceda acceso publico` —
   `GetBucketPolicy`; `NoSuchBucketPolicy` es el estado esperado (nadie crea
   policy), cualquier otro error rompe el test. Si hubiera policy, se filtran
   los statements `Allow` sobre el principal anónimo y se exige lista vacía.

Añadido un bloque de comentario que explica **por qué no se comprueba lo
obvio**: que el `GET` anónimo no sirve como aserción contra LocalStack, y que
en AWS real ese mismo `GET` daría `403`.

Helper `grantsPublicAccess()` a nivel de módulo: detecta el principal anónimo
en sus tres formas (`"*"`, `{"AWS":"*"}`, `{"AWS":["*"]}`) buscando el token
`"*"` ya serializado, de modo que un ARN con comodín interno
(`arn:aws:iam::*:root`) no cuenta como público.

### Documentación

- `specs/pet-photos-s3/requirements.md` — R8: **el requisito no cambia**. Se
  añade el criterio de verificación en local y un bloque de limitación que
  marca explícitamente qué queda pendiente de verificar en AWS real.
- `specs/pet-photos-s3/traceability.md` — fila R8 actualizada: de "en ROJO,
  limitación aceptada" a "en VERDE", con los dos tests, la prueba de regresión
  y el pendiente de AWS real.
- `docs/architecture.md` — nueva fila en la tabla de adaptaciones LocalStack
  para el bloqueo de acceso público de S3.

### Lo que NO toqué

`src/modules/media/` y `provisionMediaBucket()` quedan **byte-idénticos a
HEAD** (verificado con `git diff --exit-code`). El código está bien; el
problema era el criterio de verificación.

## Cómo comprobé que el test nuevo detecta la regresión

Ciclo rojo-verde real contra el LocalStack levantado:

1. Verde de partida: `2 passed, 10 skipped`.
2. Quité el `PutPublicAccessBlockCommand` del cuerpo de
   `provisionMediaBucket()`.
3. Borré la config viva del bucket (`DeletePublicAccessBlockCommand`) para
   dejarlo en el estado en que el código roto lo dejaría en un entorno limpio.
4. Corrí `pnpm run provision:local` — confirmado que **no** restaura los flags.
5. Corrí el test → **ROJO**:

```
● Pet photo upload (e2e) › R8: el bucket nunca es publico — PublicAccessBlock
  en los 4 flags y sin bucket policy publica › GetPublicAccessBlock devuelve
  los 4 flags de bloqueo en true

  NoSuchPublicAccessBlockConfiguration: The public access block configuration
  was not found

  > 329 |       const { PublicAccessBlockConfiguration } = await s3Client().send(

Tests: 1 failed, 10 skipped, 1 passed, 12 total
```

6. Restauré `provisioning.ts`, `pnpm run provision:local`, test → **VERDE**
   (`2 passed`).

Un flag parcial (3 de 4 en `true`) también rompe: `GetPublicAccessBlock`
devuelve config y el `objectContaining` falla con diff limpio.

## Qué queda sin verificar hasta que exista un despliegue AWS real

**Que un `GET` sin firma sobre `https://<bucket>.s3.<region>.amazonaws.com/<key>`
responde efectivamente `403`.** En local es inverificable por diseño del
emulador. Lo que sí queda cubierto en local es la configuración que produce ese
`403` en AWS —los cuatro flags y la ausencia de policy pública— más la garantía
de código de que `PHOTO_STORAGE` solo emite URLs prefirmadas
(`createUploadUrl` / `createDownloadUrl`, ambos presignan siempre).

Mismo precedente ya aceptado en `localstack-provisioning` #2 R13.

## Output de `./init.sh` (última corrida, completa)

Salida literal (`exit=0`):

```
→ Build...
✅ Build exitoso

→ Ejecutando tests...
Test Suites: 97 passed, 97 total
Tests:       699 passed, 699 total
Snapshots:   0 total
✅ Tests pasados

→ Tests e2e...
> jest --config ./test/jest-e2e.json
Test Suites: 11 passed, 11 total
Tests:       146 passed, 146 total
Snapshots:   0 total
✅ Tests e2e pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

✅ Todo verde. Listo para trabajar.
```

Ningún otro e2e falla — no hubo nada que reportar aparte de R8.

**Discrepancia de conteo**: el encargo mencionaba 165 tests e2e; la corrida
real da **146** (11 suites, 0 skipped). Mi cambio suma uno (R8 pasó de 1 a 2
casos), así que antes eran 145 — la diferencia con 165 no viene de aquí.
Probablemente un conteo previo distinto; lo dejo anotado para que el reviewer
lo confirme y no se lea como tests desaparecidos.

## Notas para el reviewer

- `git diff HEAD~2 -- backend-pet-tracker/src/` debe salir **vacío**: esta
  branch no toca código de aplicación, solo el test y documentación.
- El ruido de `pet_users_user_id_users_id_fk` en el output de los e2e es
  preexistente (un caso que espera fallo loguea el error de Postgres); los
  tests pasan. No introducido aquí, no arreglado aquí.
- La aserción de bucket policy es una red de seguridad: hoy no existe ninguna
  policy, así que ese test pasa por la rama `NoSuchBucketPolicy`. Su valor es
  detectar el día en que alguien añada una.
- Decidir si el pendiente de AWS real merece entrada propia en un backlog de
  verificación de despliegue, o basta con la nota en `requirements.md` R8 y
  `docs/architecture.md`.
