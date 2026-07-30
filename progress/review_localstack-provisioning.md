# review: localstack-provisioning
Fecha: 2026-07-30
Veredicto: APROBADO (tras fix puntual en commit 2bd5de2 — ver sección "Actualización — re-revisión del fix puntual" al final)

## Resumen ejecutivo

El trabajo del implementer es de alta calidad: arquitectura correcta,
idempotencia bien resuelta, guardas estáticas bien escritas, documentación
honesta y explícita sobre el bloqueo de Docker en este sandbox. Verifiqué
independientemente que `init.sh` pasa completo (build/tests/lint/typecheck
en verde) y que el e2e de LocalStack falla exactamente por conexión
rechazada (no por un error de compilación/tipos/imports), lo cual confirma
que el código y el test están bien formados.

Sin embargo, encontré **un defecto real y puntual, independiente del
bloqueo de Docker**: el requisito **R4 no tiene ningún test (`describe`/`it`)
que lo nombre explícitamente** — solo aparece dentro de un comentario en el
`beforeAll` de `test/localstack-provisioning.e2e-spec.ts`. Esto viola
CHECKPOINTS C4 ("Cada requisito R<n> ... tiene al menos un test que lo
nombra explícitamente") y la regla dura de `reviewer.md`: "No apruebas si
algún test no nombra su R-id." La propia `traceability.md` lo reconoce
honestamente (`"R4 (beforeAll)"`), pero un `beforeAll` es un hook, no un
test — no es "equivalente" a un `describe('R4: ...')`/`it('R4: ...')` en el
sentido que exige C4, y no aparecerá como tal en el output de Jest.

Este es un fix de minutos, no un problema de arquitectura ni de lógica de
negocio, y **no invalida el resto del trabajo**. Lo marco como rechazo
formal porque la regla del reviewer no tiene excepción para "requisito
cubierto indirectamente por composición" — pero el implementer solo necesita
añadir un `it('R4: ...', ...)` explícito (puede ser tan simple como repetir
la aserción del primer `exitCode` dentro de su propio bloque nombrado, o
añadir una aserción adicional que confirme que los 8 recursos existen tras
la primera corrida) y actualizar la fila de `traceability.md`.

## Checklist C2 — Estado coherente
- [x] Máximo una feature en `in_progress` en `feature_list.json` (confirmado con script: solo id=2)
- [x] `progress/current.md` describe la sesión activa (bloqueo de Docker documentado, reviewer: pendiente)
- [x] `progress/history.md` tiene entrada de la sesión anterior cerrada (id=1); la de id=2 se añadirá al cerrar sesión, correcto según la plantilla

## Checklist C3 — Arquitectura
- [x] N/A parcial: esta feature vive fuera de domain/application/infrastructure, justificado explícitamente en `design.md` ("análoga a `src/db/`"), mismo patrón aceptado en feature #1
- [x] `src/aws/aws-clients.ts` no contiene lógica de negocio, solo factories de clientes SDK
- [x] `src/aws/provisioning.ts` es infraestructura de arranque pura (creación idempotente de recursos), no un caso de uso de dominio
- [x] `AwsModule` sigue el mismo patrón de `DrizzleModule`/token `DRIZZLE`: `@Global()`, tokens `Symbol`, `useFactory` + `inject: [ConfigService]`, `exports` explícito de los 4 tokens — confirmado leyendo `aws.module.ts`
- [x] Constructor/factory injection consistente con `.claude/skills/backend-nestjs-best-practices/SKILL.md` (tokens de inyección en `aws.constants.ts`, no strings mágicos)

## Checklist C4 — TDD
- [ ] **R4 no tiene test que lo nombre explícitamente** (solo un comentario dentro de `beforeAll`) — único incumplimiento encontrado
- [x] R1, R2, R3, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15, R16, R17, R18, R19: todos tienen `describe('R<n>: ...')` real, verificado abriendo cada `.spec.ts` (no solo por nombre de archivo)
- [x] Historial de commits (`5226220` implementación, `303fa22` test de integración, commits previos por requisito) muestra test-primero por tramos, no todo en un commit

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin ninguna fila "pendiente" real (la única mención de "pendiente" es la regla de cierre del archivo)
- [x] Cada requisito tiene test y commit registrados, incluyendo marca ⚠️ honesta en las 10 filas no ejecutadas contra LocalStack real
- [x] Commits siguen `feat(<scope>): <desc> (R-ids)` / `test(<scope>): ... (R-ids)` / `docs(<scope>): ... (R-ids)`

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` en el frontmatter
- [x] Casilla "Aprobado por humano (fecha: 2026-07-30)" marcada
- [x] Ningún requisito fue modificado después de la aprobación (19 filas de `traceability.md` corresponden 1:1 a R1-R19 de `requirements.md`, sin desvíos)

## Checklist C7 — Sin código huérfano
- [ ] N/A — esta feature no reemplaza nada existente

## Verificación independiente ejecutada

### `bash init.sh` (pnpm no soporta `./init.sh` directo por permisos de ejecución del archivo — se corrió con `bash init.sh`, mismo efecto)
```
✅ node disponible
✅ pnpm disponible
✅ .env encontrado / DATABASE_URL definida
✅ Dependencias instaladas
✅ Archivos del harness presentes
⚠️  Feature en progreso: localstack-provisioning
✅ STATUS.md sincronizado con feature_list.json
✅ Build exitoso
Test Suites: 19 passed, 19 total
Tests:       33 passed, 33 total
✅ Tests pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

### `pnpm -C backend-pet-tracker run test:e2e -- test/localstack-provisioning.e2e-spec.ts` (sin Docker, resultado esperado: fallo controlado)
```
console.error
    No se pudo conectar a LocalStack en http://localhost:4566. ¿Está
    levantado? Corre "docker compose up -d" y vuelve a intentar. Detalle:
    AWS SDK error wrapper for AggregateError

      at runProvisioning (../src/aws/run-provisioning.ts:50:12)
      at Object.<anonymous> (localstack-provisioning.e2e-spec.ts:91:22)

Test Suites: 1 failed, 1 total
Tests:       9 failed, 9 total
```
Las 9 aserciones fallan porque `beforeAll` obtiene `exitCode=1` (LocalStack
no levantado) en vez de `0` — no hay ningún error de `Cannot find module`,
de tipos, ni de sintaxis. El mensaje de error impreso confirma además que
`describeProvisioningError` (R16) y la detección de `AggregateError`
documentada en `provisioning.ts` funcionan correctamente en la práctica: el
propio SDK bajo `ts-jest` produjo exactamente el `AggregateError` envuelto
que el implementer anticipó en su comentario, y el mensaje resultante es
claro ("¿Está levantado? Corre docker compose up -d"), no un stack trace
crudo. Esto es evidencia indirecta fuerte de que R16 y la lógica de
`provisioning.ts` están bien construidas.

## Revisión de los 10 requisitos no verificables contra LocalStack real (R4-R8, R10-R14)

Veredicto por sub-punto, tal como pidió el leader:

**(a) ¿El código de producción implementa correctamente la lógica pedida?**
Sí. Leí `provisioning.ts` completo:
- `ensureQueueWithDlq` crea la DLQ antes que la cola principal (R9) y arma
  la `RedrivePolicy` con `deadLetterTargetArn` + `SQS_MAX_RECEIVE_COUNT=3`
  (R7, R8) — coincide con `design.md`.
- `provisionQueues` crea las 4 colas con los nombres exactos de
  `constants.ts` (R6).
- `provisionPositionsTable` encadena `CreateTable` (pk String/HASH, sk
  Number/RANGE — R10) → espera `ACTIVE` → `UpdateTimeToLive` sobre
  `expires_at` (R11), ignorando `ResourceInUseException` y el caso
  "TTL ya habilitado" de forma acotada (solo si el mensaje confirma ese
  motivo específico, no cualquier `ValidationException` — buena práctica
  defensiva, evita esconder errores reales de configuración).
- `provisionMediaBucket` crea el bucket (R12) y aplica
  `PutPublicAccessBlockCommand` con los 4 flags en `true` (R13).
- `provisionEventBus` crea el bus `pet-tracker` (R14), idempotente vía
  `ResourceAlreadyExistsException`.
- `provisionAllResources` orquesta los 8 recursos (R4) y es naturalmente
  idempotente en su totalidad porque cada función interna lo es (R5).

No encontré errores de lógica, off-by-one, condiciones de carrera obvias, ni
desviaciones de `design.md`.

**(b) ¿El test de integración ejercería realmente el requisito si corriera
contra LocalStack real?**
Sí, para R5-R14: cada `describe` hace la llamada AWS SDK v3 real
correspondiente (`ListQueuesCommand`, `GetQueueAttributesCommand`,
`DescribeTableCommand`, `DescribeTimeToLiveCommand`, `ListBucketsCommand`,
`GetPublicAccessBlockCommand`, `ListEventBusesCommand`) y hace asserts
específicos y correctos (ej. R7/R8 verifican `deadLetterTargetArn` contiene
el nombre de la DLQ correcta, no solo que existe *alguna* `RedrivePolicy`).
No until aquí no encontré asserts equivocados ni mocks disfrazados de
integración — es tráfico de red real contra el endpoint de
`AWS_ENDPOINT_URL`. Para R4 específicamente: la aserción existe y es
correcta (`expect(exitCode).toBe(0)` tras la primera corrida), pero vive
dentro de `beforeAll` sin un `describe`/`it` propio — ver el rechazo arriba.

**(c) ¿El bloqueo está documentado honestamente?**
Sí, de forma ejemplar: el propio archivo de test tiene un comentario
dirigido explícitamente al reviewer explicando el bloqueo de Docker antes
de cualquier código; `traceability.md` marca cada fila afectada con ⚠️ en
vez de simular que ya se verificó; `impl_localstack-provisioning.md` y
`progress/current.md` repiten la misma información sin maquillaje; `STATUS.md`
documenta el mismo estado real ("9/19 verificados... 10 restantes...no se
pudieron ejecutar con éxito"). No encontré ningún intento de ocultar o
disfrazar el bloqueo como "verificado".

## Observaciones (razón del rechazo)

1. **[Bloqueante] R4 sin test nombrado explícitamente.** `test/localstack-provisioning.e2e-spec.ts` solo menciona "R4" en un comentario dentro de `beforeAll` (línea 89), nunca en un `describe`/`it`. Grep de confirmación:
   ```
   grep -rn "R4" backend-pet-tracker/src/aws/*.spec.ts backend-pet-tracker/test/*.ts
   → solo 2 resultados, ambos comentarios (líneas 53 y 89 del e2e spec)
   ```
   Fix sugerido: envolver la aserción de la primera corrida en un
   `describe('R4: primera corrida sobre LocalStack limpio crea los 8 recursos y termina en 0', () => { it(...) })`
   propio (puede seguir viviendo antes de los `describe` de R5-R14, o
   moverse fuera del `beforeAll` a un `it` explícito que se ejecute
   primero), y actualizar la fila R4 de `traceability.md` para apuntar al
   nuevo nombre en vez de `"R4 (beforeAll)"`.

No hay más observaciones — el resto del trabajo (código de producción,
demás tests, documentación, trazabilidad, spec aprobada, convención de
imports, ausencia de literales AWS reales) está correcto y no requiere
cambios.

## Recomendación sobre `feature_list.json`

**No pasar a `done` todavía**, por dos motivos independientes:
1. El defecto puntual de R4 arriba (bloqueante per CHECKPOINTS C4, fix de
   minutos).
2. 10/19 requisitos (R4-R8, R10-R14) siguen sin verificación real contra
   LocalStack — el código y los tests están listos y son, a mi juicio,
   correctos por lectura, pero "correcto por lectura" no es lo mismo que
   "verificado". Recomiendo mantener `in_progress` (no crear un estado
   intermedio nuevo fuera del esquema existente) hasta que: (a) el
   implementer corrija el punto 1, y (b) alguien con acceso a Docker corra
   `docker compose up -d && pnpm -C backend-pet-tracker run test:e2e --
   test/localstack-provisioning.e2e-spec.ts` y confirme las 9 aserciones en
   verde, igual que se dejó pendiente para Postgres en la feature #1 en su
   momento (aunque esa sí se cerró `done` — criterio a decisión del
   leader/humano, no mío: aquí señalo el hecho, no fuerzo la política).

Si el humano/leader decide que el mismo criterio aplicado a Postgres en la
feature #1 (aceptar la desviación de entorno y marcar `done` con seguimiento
pendiente) debe aplicar igual aquí, eso es una decisión de política del
proyecto que no me corresponde a mí como reviewer — mi veredicto de código
es: corrijan R4, y esta feature queda objetivamente en muy buen estado para
ese mismo tratamiento.

---

## Actualización — re-revisión del fix puntual (2026-07-30)

**Veredicto revisado: APROBADO**

El implementer aplicó el fix quirúrgico en el commit `2bd5de2` y solo re-verifiqué
ese punto (no repetí la revisión completa desde cero, ya cubierta arriba).

### 1. Verificación del fix en `backend-pet-tracker/test/localstack-provisioning.e2e-spec.ts`

Leí el archivo completo (254 líneas). Confirmado:

- **(a) R4 ahora tiene `describe`/`it` propio.** Líneas 106-110:
  ```ts
  describe('R4: primera corrida sobre LocalStack crea los 8 recursos y termina en 0', () => {
    it('runProvisioning devuelve exit code 0', () => {
      expect(firstRunExitCode).toBe(0);
    });
  });
  ```
  Este bloque aparecerá con su propio nombre en el output de Jest (Jest lista
  `describe > it` por separado del `beforeAll`), a diferencia de la versión
  anterior donde el `expect` vivía dentro del hook y no era nombrable.
  Confirmado también por grep: `grep -n "R4" test/localstack-provisioning.e2e-spec.ts`
  ya no muestra el `expect` viejo dentro de `beforeAll` (línea 89 en la
  versión rechazada) — ahora las únicas menciones de R4 son dos comentarios
  explicativos (líneas 81 y 85) y el `describe` real (línea 106).

- **(b) No rompió R5-R14.** El `beforeAll` (líneas 89-97) ahora solo arma los
  4 clientes AWS y ejecuta `firstRunExitCode = await runProvisioning(process.env)`
  — sin `expect` dentro del hook, correcto: los hooks no deben tener
  aserciones per C4. `firstRunExitCode` es una variable de closure declarada
  en el nivel del `describe` raíz (línea 87, `let firstRunExitCode: number;`)
  y solo se lee dentro del nuevo `describe('R4: ...')`. R5 en adelante
  (`describe('R5: segunda corrida...')` línea 112 y siguientes) no leen
  `firstRunExitCode` en ningún momento — cada uno llama directamente al SDK
  real (`ListQueuesCommand`, `GetQueueAttributesCommand`,
  `DescribeTableCommand`, etc.) o vuelve a invocar `runProvisioning` por su
  cuenta (R5). Es decir, R5-R14 nunca dependieron de un side-effect distinto
  al hecho de que `runProvisioning` ya corrió una vez contra un LocalStack
  limpio antes de que empiecen — y ese efecto (crear los recursos) sigue
  ocurriendo exactamente igual en el `beforeAll`, solo que ahora sin el
  `expect` acoplado. No hay regresión de lógica ni de orden de ejecución.

### 2. Verificación de `specs/localstack-provisioning/traceability.md`

Fila R4 (línea 14) actualizada correctamente:
```
| R4 | `test/localstack-provisioning.e2e-spec.ts::"R4: primera corrida sobre LocalStack crea los 8 recursos y termina en 0"` ⚠️ no ejecutado contra LocalStack real | `303fa22` ...; fix posterior a review: R4 pasó de vivir solo en `beforeAll` a tener su propio `describe`/`it` nombrado |
```
- Ya no dice `"R4 (beforeAll)"`.
- Apunta al nombre real y exacto del nuevo `describe`.
- Mantiene la marca ⚠️ (correcto, sigue sin correr contra LocalStack real —
  mismo criterio de mi revisión anterior, no penalizable).
- `grep -c "pendiente" specs/localstack-provisioning/traceability.md` → 1,
  y esa única ocurrencia es la línea de regla de cierre del archivo
  ("el reviewer no aprueba si alguna fila queda pendiente"), no una fila de
  la tabla. Confirmado: ninguna de las 19 filas R1-R19 dice "pendiente".

### 3. Verificación independiente de `init.sh`

Corrido por mí mismo desde la raíz del repo:
```
export PATH="$HOME/.npm-global/bin:$PATH"
bash init.sh
```
Resultado:
```
✅ Dependencias instaladas
✅ Archivos del harness presentes
⚠️  Feature en progreso: localstack-provisioning
✅ STATUS.md sincronizado con feature_list.json
✅ Build exitoso
Test Suites: 19 passed, 19 total
Tests:       33 passed, 33 total
✅ Tests pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
Sin regresiones. No repetí `test:e2e` contra LocalStack (ya confirmado antes
que falla de forma controlada por conexión rechazada sin Docker — el fix no
cambia esa realidad, solo la estructura de nombrado del test).

### Checklist C4 — TDD (revisado)
- [x] R4 ahora tiene `describe('R4: ...')`/`it(...)` real que lo nombra
      explícitamente — defecto original corregido.
- [x] R1-R19: todos tienen test que los nombra explícitamente (confirmado en
      revisión anterior + R4 ahora también).

### Checklist C5 — Trazabilidad (revisado)
- [x] `traceability.md` fila R4 actualizada, sin decir "beforeAll", sin
      ninguna fila "pendiente" en la tabla.

## Observaciones (post-fix)

Ninguna. El fix es correcto, mínimo, no introduce regresiones, y resuelve
exactamente el defecto señalado en la revisión anterior.

## Recomendación final sobre `feature_list.json` id=2

**Sí recomiendo pasar a `done`**, con el mismo criterio ya aplicado a la
feature #1 (Postgres) respecto al bloqueo de entorno: el código de
producción y los 19 tests están completos y correctos por lectura y por
verificación estática/estructural; `init.sh` está verde; el único defecto
real encontrado (R4 sin test nombrado) ya fue corregido y re-verificado.
Los 10/19 requisitos (R4-R8, R10-R14) que dependen de LocalStack real siguen
sin ejecutarse en este sandbox por el bloqueo de Docker (sin acceso al
socket, sin sudo, confirmado y documentado honestamente en el propio test,
en `traceability.md` con ⚠️, en `STATUS.md` y en
`progress/impl_localstack-provisioning.md`). Esto no es negligencia del
implementer — es una limitación de entorno fuera de su control, igual que
Postgres en la feature #1. Recomiendo que quede documentado como
seguimiento pendiente (correr
`docker compose up -d && pnpm -C backend-pet-tracker run test:e2e -- test/localstack-provisioning.e2e-spec.ts`
en una máquina con Docker disponible) en vez de bloquear el cierre de la
feature. La decisión final de marcar `done` y de cómo registrar el
seguimiento le corresponde al leader/humano, no a mí.
