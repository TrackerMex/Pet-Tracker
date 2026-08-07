# review: media-r8-localstack

Fecha: 2026-08-07
Branch: `fix/media-r8-localstack` (3 commits sobre `main`)
Tipo: ciclo corto de fix — sin entrada en `feature_list.json`, sin spec propia.
Veredicto: **APROBADO**

Todo lo que el implementer afirma en `progress/fix_media-r8-localstack.md` fue
reproducido de forma independiente. Nada se dio por bueno a partir del reporte.

---

## 1. El código de producción no se tocó

```
$ git diff main --stat -- backend-pet-tracker/src/
(vacío)
```

Confirmado: **cero cambios en `src/`**. `provisionMediaBucket()`
(`backend-pet-tracker/src/aws/provisioning.ts:235-255`) sigue aplicando los
cuatro flags. El diff completo de la branch toca solo test, harness y docs:

| archivo | ± |
|---|---|
| `backend-pet-tracker/test/media.e2e-spec.ts` | 125 |
| `docs/architecture.md` | 1 |
| `init.config.sh` | 9 |
| `init.sh` | 34 |
| `progress/fix_media-r8-localstack.md` | 173 |
| `specs/pet-photos-s3/requirements.md` | 30 |
| `specs/pet-photos-s3/traceability.md` | 2 |

`feature_list.json` sin tocar. Árbol de trabajo limpio.

---

## 2. El test nuevo tiene valor real — verificado, no aceptado

Este era el único punto que decidía si el test sirve o es decorativo. Lo
reproduje mutando el estado vivo del bucket en LocalStack (sin tocar `src/`,
porque el test asserta sobre el estado del bucket: da igual si la config falta
porque alguien borró el `PutPublicAccessBlockCommand` o porque la borré yo —
el test ve exactamente lo mismo).

Estado de partida registrado antes de empezar:

```
PublicAccessBlock: {"BlockPublicAcls":true,"IgnorePublicAcls":true,
                    "BlockPublicPolicy":true,"RestrictPublicBuckets":true}
BucketPolicy     : <NoSuchBucketPolicy>
```

| # | Escenario | Resultado esperado | Resultado real |
|---|---|---|---|
| 0 | Baseline intacto | verde | `10 skipped, 2 passed` ✅ |
| 1 | `DeletePublicAccessBlock` (config ausente) | **rojo** | **ROJO** — `NoSuchPublicAccessBlockConfiguration`, `1 failed, 10 skipped, 1 passed` ✅ |
| 2 | 3 de 4 flags (`RestrictPublicBuckets: false`) | **rojo** | **ROJO** — diff limpio `- "RestrictPublicBuckets": true / + false` ✅ |
| 3 | Bucket policy pública (`Allow` + `Principal {"AWS":"*"}`) | **rojo** | **ROJO** — falla el 2º caso, muestra el statement ✅ |
| 4 | Policy con comodín *dentro* de un ARN (`arn:aws:iam::*:root`) | verde (no es público) | **VERDE** — sin falso positivo ✅ |

El escenario 1 reproduce literalmente el output que el implementer reportó.
El 2 y el 3 no estaban verificados en el reporte con evidencia y también
pasan. El 4 confirma que `grantsPublicAccess()`
(`backend-pet-tracker/test/media.e2e-spec.ts:37-42`) hace lo que su comentario
dice: busca el token `"*"` ya serializado, así que un ARN con comodín interno
no cuenta como público.

**El test no es decorativo: se pone rojo ante la regresión que dice cubrir, y
ante dos variantes más que el reporte no demostraba.**

### La premisa de fondo también se verificó

El cambio entero se apoya en que LocalStack no hace cumplir el
`PublicAccessBlock`. Si eso fuera falso, el test original habría sido correcto
y este fix injustificado. Comprobado directamente: con los 4 flags en `true` y
sin bucket policy, subí un objeto y lo pedí **sin ninguna firma**:

```
unsigned GET status = 200  body = "probe"
=> LocalStack NO aplica PublicAccessBlock en el plano de datos
```

Además, LocalStack aceptó sin rechistar una bucket policy pública **con
`BlockPublicPolicy: true`** — en AWS real ese `PutBucketPolicy` sería
rechazado. Doble confirmación de que el emulador solo persiste metadata.

La premisa se sostiene: el criterio original medía el emulador, no el código.

**Estado del bucket restaurado a su valor exacto de partida** (4 flags `true`,
`NoSuchBucketPolicy`, objeto de prueba borrado). Árbol git limpio.

---

## 3. Documentación: honesta, sin degradar el requisito

La cláusula normativa de R8 es **byte-idéntica** a la aprobada:

> THE SYSTEM SHALL exponer el acceso a fotos de mascotas exclusivamente a
> través de URLs S3 prefirmadas (`PUT` para subir, `GET` para leer) — nunca
> una URL pública o sin firmar.

Lo único que cambió es el **criterio de verificación en local**, y el hueco
que queda queda marcado explícitamente en los cuatro sitios pedidos:

- `backend-pet-tracker/test/media.e2e-spec.ts:300-321` — comentario que explica por qué no se hace el GET anónimo y qué queda pendiente.
- `specs/pet-photos-s3/requirements.md:97-124` — criterio local nuevo + bloque de limitación fechado, con **"Pendiente de verificar en un despliegue AWS real"**.
- `specs/pet-photos-s3/traceability.md:18` — fila R8 pasa de "en ROJO, limitación aceptada" a "en VERDE", con los 2 tests, la prueba de regresión y el pendiente.
- `docs/architecture.md:103` — fila nueva en el mapa de adaptaciones LocalStack.

**No se da por verificado nada que no lo esté**: el `403` en AWS real aparece
como pendiente en los cuatro documentos. No hay degradación del requisito.

---

## 4. Mecanismo de `init.sh`

### `port_open()` (`init.sh:23-27`) — sin fugas ni roturas

```
fds antes:            0 1 2 255
fds tras 20 llamadas: 0 1 2 255
```

**No fuga descriptores.** El `exec 3<>` de la línea 24 ocurre dentro de un
subshell `( )`, que cierra el fd al salir; el fd 3 nunca llega al proceso
padre. Bajo `set -e` tampoco rompe: el `|| return 1` protege la línea 24 de
errexit, y devuelve 1 correctamente para un puerto cerrado sin abortar.

### El gate en sus tres direcciones (bloque `init.sh:205-224`)

Extraje el bloque literal y lo ejercité con la config variada:

| caso | condición | esperado | real |
|---|---|---|---|
| A | puerto cerrado (9) | aviso + continúa, `exit 0` | ✅ `[WARN] Puerto 9 sin respuesta`, alcanza el paso siguiente, `exit=0` |
| B | infra arriba + e2e **rojo** | **falla `init.sh`** | ✅ `exit=1`, **no** alcanza el paso de lint |
| C | infra arriba + e2e verde | continúa | ✅ `[OK] Tests e2e pasados`, `exit=0` |

**El caso B es el que importa y funciona**: con la infra levantada, un e2e rojo
sí aborta `init.sh`. El salto por infra ausente no enmascara fallos reales,
solo la ausencia de Docker.

El comentario de `init.sh:201-204` es honesto sobre la contrapartida: si en CI
la infra no estuviera levantada, este paso pasaría de largo sin verificar nada.

---

## 5. `./init.sh` ejecutado por el reviewer

Con Docker levantado (`pet-tracker-postgres` y `pet-tracker-localstack`, ambos
`healthy`). **Exit code 0.**

```
→ Build...
✅ Build exitoso

→ Ejecutando tests...
Test Suites: 97 passed, 97 total
Tests:       699 passed, 699 total
✅ Tests pasados

→ Tests e2e...
Test Suites: 11 passed, 11 total
Tests:       146 passed, 146 total
Time:        41.152 s
✅ Tests e2e pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

✅ Todo verde. Listo para trabajar.
  Features: 12/18 completadas | 6 pendientes
```

**699 unit / 146 e2e — exactamente los conteos esperados.** Confirmado que el
146 es correcto y no una pérdida de tests: el 165 correspondía a la branch de
la feature #13, que añade `alerts-center-notifier.e2e-spec.ts`; esta branch
sale de `main` y no lo incluye. Sin regresiones.

---

## Checklist CHECKPOINTS

### C2 — Estado coherente
- [x] Ninguna feature en `in_progress` — `feature_list.json` sin tocar
- [x] `progress/current.md` en plantilla ("sin sesión activa"), coherente con un ciclo de fix cerrado
- [x] Toda feature `done` conserva sus tests (146 e2e + 699 unit verdes)

### C3 — Arquitectura
- [x] N/A material: cero cambios en `src/`, las capas quedan intactas
- [x] El test consume `S3_CLIENT` y `BUCKET_MEDIA` vía los tokens públicos ya existentes, sin cliente nuevo ni mocks — no invierte ninguna dependencia

### C4 — TDD
- [x] R8 tiene tests que lo nombran: `describe('R8: el bucket nunca es publico — PublicAccessBlock en los 4 flags y sin bucket policy publica')`
- [x] Ciclo rojo→verde real, reproducido por el reviewer (sección 2)

### C5 — Trazabilidad
- [x] `traceability.md` completo R1-R9, **ninguna fila "pendiente"** (las palabras "Pendiente de verificar en AWS real" de la fila R8 son una salvedad de alcance documentada, no una celda sin rellenar)
- [x] Commits convencionales; ver observación menor sobre el sufijo de R-ids

### C6 — Spec aprobada
- [x] `requirements.md` con `status: approved`
- [x] Casilla `- [X] Aprobado por humano (fecha: 2026-08-05)` marcada
- [ ] **Ver observación 1**: R8 se editó después de esa aprobación

### C7 — Sin código huérfano
- [x] El test R8 viejo (GET anónimo → 403) y su bloque de comentario fueron **eliminados** en el mismo commit que introduce el nuevo, no coexisten
- [x] No quedan restos del criterio anterior en el código de test

---

## Observaciones (ninguna bloqueante)

**1 — MENOR, procedimental (C6).** `specs/pet-photos-s3/requirements.md:97-124`
R8 fue modificado el 2026-08-07, después del gate humano del 2026-08-05, y la
casilla de aprobación sigue con la fecha vieja sin registro de re-aprobación.
Verifiqué que la cláusula `THE SYSTEM SHALL` es byte-idéntica y que solo cambió
el criterio de verificación — es decir, la sustancia del requisito no se tocó,
que era justo el encargo. No bloqueo por esto, pero **el humano debería
re-confirmar la casilla** dejando constancia de la edición: es exactamente el
tipo de cambio para el que existe el gate.

**2 — MENOR.** `specs/pet-photos-s3/tasks.md:80-82` sigue describiendo la tarea
de R8 con el criterio viejo (`GET` sin firma → `403`), ahora inconsistente con
`requirements.md` R8 y `traceability.md`. Atenuante: *todas* las casillas de
`tasks.md` están sin marcar pese a que la feature está `done`, o sea que el
archivo no se mantiene vivo en este repo — la inconsistencia es preexistente y
no una regresión de este fix. El criterio autoritativo vive en
`requirements.md` + `traceability.md`, ambos correctos.

**3 — COSMÉTICO.** `init.sh:25` — `exec 3<&-` es código muerto: el fd 3 solo se
abre dentro del subshell de la línea 24, que lo cierra al salir. Verificado que
no hace daño (ni fuga ni rotura bajo `set -e`), pero la línea no hace nada. La
función serían dos líneas en vez de cuatro.

**4 — INFORMATIVO.** `init.sh:219` — un e2e rojo aborta vía `set -e` sin
imprimir el `❌` de `fail()`, así que el motivo queda solo en la salida de jest.
Es el mismo patrón que `BUILD_CMD` (`init.sh:184`) y `TEST_CMD`
(`init.sh:194`), o sea consistente con la convención existente del arnés, no un
defecto nuevo.

**5 — INFORMATIVO.** El commit `f0e8547 test(media): ...` no lleva el sufijo
`(R8)` que muestra `docs/conventions.md:164`. Esa misma convención documenta
`refactor(<scope>): <descripción>` sin R-ids, así que `test(...)` es
defendible. No bloqueante.

**6 — INFORMATIVO, preexistente.** El ruido de
`pet_users_user_id_users_id_fk` en la salida de los e2e viene de un caso que
espera fallo y loguea el error de Postgres. No introducido aquí. Los tests
pasan.

---

## Conclusión

**APROBADO.** El fix hace exactamente lo encargado: deja intacto el código de
producción, sustituye una aserción que medía al emulador por otra que mide la
configuración que el código sí controla, y esa aserción **demostradamente** se
pone roja ante la regresión (reproducido en 3 variantes, más un caso de
control que confirma que no da falsos positivos). La limitación queda
documentada en los cuatro sitios sin degradar el requisito ni declarar
verificado el `403` de AWS real. El nuevo gate de e2e en `init.sh` funciona en
las dos direcciones y `port_open()` está limpio. `./init.sh` corrido por el
reviewer: verde, exit 0, 699 unit + 146 e2e, sin regresiones.

Antes de mergear, atender la observación 1 (re-confirmación humana de R8) —
procedimental, no técnica.
