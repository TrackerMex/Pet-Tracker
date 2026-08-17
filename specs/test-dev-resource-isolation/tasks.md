---
feature: "test-dev-resource-isolation"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[test-dev-resource-isolation]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Reglas de commit (C4 de [[../../CHECKPOINTS|CHECKPOINTS]], no negociables):**
>
> 1. **Un commit por sub-item (1) y otro por sub-item (2), como mínimo.** El
>    commit del test en rojo va **ANTES** que el de su implementación, siempre.
>    Nunca test + implementación + docs en el mismo commit: en #19 se hizo así y
>    quedó registrado como incumplimiento.
> 2. Formato: `test(test-dev-resource-isolation): <desc> (R<n>)` para el rojo,
>    `feat(...)`/`refactor(...)`/`docs(...)` para el verde
>    (`docs/conventions.md` §Commits).
> 3. Cada `describe` nombra su R-id: `describe('R1: …')`.
> 4. Tras cada verde, actualizar la fila correspondiente de
>    [[traceability]] — nunca al final de todo.
>
> **El orden de abajo es el orden de ejecución**, no una lista de deseos: R1-R3
> construyen la pieza de la que dependen todas las demás; R11 (la guarda) va
> después de que R4 y R6 hayan migrado a los consumidores, para que su
> rojo→verde sea un solo paso y no quede roja durante media feature.

---

## Bloque A — la pieza de resolución

## R1 — Los diez nombres con sufijo `'test'` valen exactamente lo tabulado

- [ ] (1) Escribir test que falla para R1 en
      `backend-pet-tracker/src/aws/resource-names.spec.ts`:
      `describe('R1: …')` que llama a `buildResourceNames('test')` y compara los
      diez campos con los diez literales de la columna "Test" de la tabla de
      [[requirements]] R1, **escritos a mano en el test** (no derivados con
      `resourceName`, o el test se probaría a sí mismo). Añadir el caso
      `buildResourceNames('')` contra la columna "Desarrollo".
- [ ] (2) Implementación mínima: crear
      `backend-pet-tracker/src/aws/resource-names.ts` con `AwsResourceNames` y
      `buildResourceNames` ([[design]] §D2).
- [ ] (3) Refactor con tests verdes.

## R2 — El sufijo se deriva de `NODE_ENV` en modo local

- [ ] (1) Escribir test que falla para R2: `describe('R2: …')` parametrizado
      (`it.each`) sobre `NODE_ENV` = `'test'` ⇒ `'test'`, y `undefined`, `''`,
      `'  '`, `'development'`, `'production'`, `'testing'` ⇒ `''`, con
      `rawMode` en local. Incluir `' test '` ⇒ `'test'` (se aplica `.trim()`).
- [ ] (2) Implementación mínima: `RESOURCE_SUFFIX_TEST` y
      `resolveResourceSuffix(rawMode, rawNodeEnv)`; añadir `export` a
      `resolveAwsMode` en `backend-pet-tracker/src/aws/aws-clients.ts:62`
      (**solo la palabra `export`**).
- [ ] (3) Refactor con tests verdes.

## R3 — `AWS_MODE=aws` fuerza sufijo `''` y no lanza

- [ ] (1) Escribir test que falla para R3: `describe('R3: …')` que cubre
      `rawMode` = `'aws'`, `'AWS'`, `' aws '` combinados con `NODE_ENV='test'`
      ⇒ `''`; que afirma **explícitamente** que no lanza
      (`expect(() => …).not.toThrow()`); y que
      `buildResourceNames(resolveResourceSuffix('aws', 'test'))` devuelve los
      diez nombres desnudos. Cubrir además las dos vías,
      `resolveResourceNamesFromEnv` y `resolveResourceNamesFromConfigService`,
      con el mismo resultado (patrón de R5 de #21).
- [ ] (2) Implementación mínima: la comprobación de modo **primero** en
      `resolveResourceSuffix`, más las dos funciones de resolución ([[design]] §D5).
- [ ] (3) Refactor con tests verdes.

## R5 — `constants.ts` sigue siendo literales `const`

> Va aquí, antes de tocar nada más, porque es la restricción que decide la
> forma de todo lo demás. Es un test de regresión: nace **verde**.

- [ ] (1) Escribir el test en `backend-pet-tracker/src/aws/resource-names.spec.ts`:
      `describe('R5: …')` que afirma `typeof QUEUE_POSITIONS_RAW === 'string'`
      para los diez, y que el fuente de `src/aws/constants.ts` **no** contiene
      `process.env` ni `@nestjs/config`. Documentar en el commit que nace verde
      (guarda de regresión, no rojo→verde) — es la excepción admitida a la
      regla 1 de arriba, y la única de esta feature.
- [ ] (2) Sin implementación: si el test falla al escribirlo, algo ya se rompió
      — **para y reporta**.
- [ ] (3) Refactor con tests verdes.

## Bloque B — cableado en el runtime

## R4 — Token `AWS_RESOURCE_NAMES` inyectable y cero `process.env` en `src/`

- [ ] (1) Escribir test que falla para R4 en
      `backend-pet-tracker/src/aws/aws.module.spec.ts` (archivo existente):
      `describe('R4: …')` que compila un módulo de test con `AwsModule` y un
      `ConfigService` falso con `NODE_ENV='test'`, resuelve el token
      `AWS_RESOURCE_NAMES` y afirma que devuelve los diez nombres sufijados.
      Añadir un segundo test que escanea `backend-pet-tracker/src/**` y afirma
      que ningún archivo contiene `process.env.NODE_ENV` ni
      `process.env.AWS_MODE`.
- [ ] (2) Implementación mínima: token en `src/aws/aws.constants.ts`, provider
      `useFactory` + `inject: [ConfigService]` y `exports` en
      `src/aws/aws.module.ts` ([[design]] §D2).
- [ ] (3) Refactor con tests verdes.

## R4 (cont.) — migrar los ocho consumidores de producción

> Mismo R-id, trabajo mecánico. **Un commit por archivo**, cada uno con su
> spec unitario actualizado en el mismo commit (el spec y el archivo son la
> misma unidad de cambio; lo que no se permite es mezclar dos consumidores).

- [ ] (1) Por cada archivo de [[design]] §Archivos afectados → "consumidores de
      producción", actualizar primero su `*.spec.ts` colocado para que
      construya los nombres con `buildResourceNames('')` e inyecte
      `AWS_RESOURCE_NAMES` — el spec falla porque el sujeto aún no acepta la
      inyección.
- [ ] (2) Añadir `@Inject(AWS_RESOURCE_NAMES) private readonly names:
      AwsResourceNames` al constructor y sustituir el literal importado por el
      campo. Orden sugerido: `poller.service.ts` →
      `positions-consumer.service.ts` → `notifier-consumer.service.ts` →
      `alerts-engine-consumer.service.ts` → `reminders-dispatch.service.ts` →
      `photo-storage.s3.adapter.ts` → `daily-positions.dynamo.reader.ts` →
      `position-history.dynamo.reader.ts`.
- [ ] (3) Refactor con tests verdes. **No** deduplicar las cinco copias de
      `resolveQueueUrl` ([[design]] §Alternativas descartadas).

## Bloque C — provisioning

## R6 — `provision:local` crea los dos juegos en una invocación

- [ ] (1) Escribir test que falla para R6 en
      `backend-pet-tracker/src/aws/run-provisioning.spec.ts` (archivo
      existente): `describe('R6: …')` con clientes falsos que registran cada
      comando enviado, afirmando que tras `runProvisioning` se pidió crear las
      **veinte** cosas — los diez nombres desnudos y los diez con `-test`.
- [ ] (2) Implementación mínima: `PROVISIONED_SUFFIXES`, el bucle en
      `run-provisioning.ts` y el parámetro `names` en las seis funciones de
      `provisioning.ts` ([[design]] §D6).
- [ ] (3) Refactor con tests verdes.

## R7 — La doble corrida sigue devolviendo 0

> **CORRECCIÓN del 2026-08-17, gate humano.** Este requisito **nace verde** y se
> añadió a la lista de excepciones a C4 de [[traceability]], junto a R5, R8 y
> R12. Lo de abajo pedía un rojo que este orden hace imposible: R6 va primero y
> crea el bucle sobre los dos sufijos, así que cuando llega R7 el fallo ya es
> inalcanzable, y adelantar R7 solo daría el rojo de R6 con otro nombre. **No
> fabriques un fallo**: commitea el test verde diciéndolo en el mensaje.

- [x] (1) Extender
      `backend-pet-tracker/test/localstack-provisioning.e2e-spec.ts` para que
      verifique **los dos** juegos con `buildResourceNames('')` y
      `buildResourceNames(RESOURCE_SUFFIX_TEST)`; el bloque de idempotencia ya
      existente (L112-L115) debe seguir afirmando exit 0 en la segunda corrida.
      El test debe llamar a `runProvisioning` **además** de la llamada del
      `beforeAll`, para ejercer de verdad la doble corrida.
- [ ] (2) Sin implementación propia: si hiciera falta tocar código para que el
      segundo juego se recupere, **es señal de que el bucle de R6 está mal
      puesto** — revisar §D6 antes de añadir nada.
- [ ] (3) Commit verde único, con la excepción declarada en el mensaje.

## R8 — La guarda de `AWS_MODE=aws` en el provisioning sigue intacta

- [ ] (1) Escribir test que falla para R8 (o verificar que ya existe en
      `run-provisioning.spec.ts`): `describe('R8: …')` que con
      `AWS_MODE=aws` afirma exit code 1 **y** que no se envió ni un comando de
      creación a ningún cliente — ni desnudo ni sufijado.
- [ ] (2) Implementación mínima: ninguna si ya pasa; la guarda de
      `run-provisioning.ts:39-42` no se modifica.
- [ ] (3) Refactor con tests verdes.

## Bloque D — aislamiento efectivo

## R9 — Los e2e resuelven nombres de test; URLs distintas

- [ ] (1) Escribir test que falla para R9 en el archivo nuevo
      `backend-pet-tracker/test/resource-isolation.e2e-spec.ts`:
      `describe('R9: …')` que afirma que `GetQueueUrlCommand` sobre
      `positions-raw` y sobre `positions-raw-test` devuelve `QueueUrl`
      distintas, y que `resolveResourceNamesFromEnv(process.env)` bajo Jest
      devuelve los sufijados.
- [ ] (2) Implementación mínima: migrar las siete suites e2e a
      `resolveResourceNamesFromEnv(process.env)` y
      `localstack-provisioning.e2e-spec.ts` a los dos juegos explícitos
      ([[design]] §Archivos afectados). **Un commit por suite.**
- [ ] (3) Refactor con tests verdes. En este punto, actualizar la línea 19 de
      `src/aws/cdk-dev-stack-docs.spec.ts` según [[design]] §"guarda heredada de
      #20" — dejando L18 intacta — y **decirlo en el mensaje del commit**.

## R10 — La cadena de ingesta no mueve las colas de desarrollo

> **CORRECCIÓN del 2026-08-17, gate humano.** Este requisito **nace verde**,
> igual que R7, y se añadió a la lista de excepciones a C4 de [[traceability]].
> El punto (2) de abajo ya lo anticipaba y contradecía al (1): R4, R6 y R9 van
> antes, y R10 no aporta código propio — verifica end-to-end lo que esos tres
> arreglaron. **No fabriques un fallo**: commitea el test verde diciéndolo en el
> mensaje.

- [x] (1) Escribir el test de R10 en
      `test/resource-isolation.e2e-spec.ts`: `describe('R10: …')` con el
      recuento antes/después de las tres colas de desarrollo (suma de los tres
      atributos `Approximate*`), la aserción de igualdad exacta, **y** la
      aserción de que la cola de test sí se movió ([[design]] §D9a, punto 4-ii:
      sin ella el test pasaría en vacío).
- [ ] (2) Sin implementación propia: si hiciera falta código nuevo para que este
      requisito quede verde, **hay una fuga real** — encuéntrala en vez de
      ajustar el test.
- [ ] (3) Commit verde único, con la excepción declarada en el mensaje.

## R11 — Guarda anti-regresión: nadie importa los diez literales

- [ ] (1) Escribir test que falla para R11 en el archivo nuevo
      `backend-pet-tracker/src/aws/resource-names-guard.spec.ts`, con la lista
      blanca exacta de [[design]] §D8 y el patrón de escaneo de
      `src/aws/relative-import-guard.spec.ts`.
- [ ] (2) Implementación mínima: corregir los import sites que la guarda
      delate. Si R4 y R9 se hicieron completos, deberían ser cero.
- [ ] (3) Refactor con tests verdes.

## R12 — El stack CDK no cambia

- [ ] (1) Escribir test que falla para R12 (nace **verde**, como R5 — decirlo en
      el commit): `describe('R12: …')` en
      `backend-pet-tracker/src/aws/resource-names-guard.spec.ts` que afirma que
      el fuente de `infra/lib/pet-tracker-dev-stack.ts` **no** contiene
      `resource-names` ni `RESOURCE_SUFFIX_TEST`, y que sigue conteniendo
      `const ENV_SUFFIX = '';`.
- [ ] (2) Sin implementación. La evidencia complementaria es
      `git diff --name-only` sin ninguna ruta bajo `infra/`, y los 20 tests de
      `infra/test/` verdes sin modificar — registrar ambas cosas en
      `progress/impl_test-dev-resource-isolation.md`.
- [ ] (3) Refactor con tests verdes.

## Bloque E — documentación y evidencia

## R13 — `docs/verification.md` documenta el procedimiento manual

- [ ] (1) Escribir test que falla para R13 en
      `backend-pet-tracker/src/aws/resource-names-guard.spec.ts`:
      `describe('R13: …')` que afirma que `docs/verification.md` contiene
      `### Feature 28 — test-dev-resource-isolation`,
      `get-queue-attributes`, `ApproximateNumberOfMessagesNotVisible`,
      `provision:local` y `test:e2e` (subcadenas, nunca el texto completo —
      patrón de R7 de #21).
- [ ] (2) Implementación mínima: escribir la sección con el bloque literal de
      [[design]] §D9b.
- [ ] (3) Refactor con tests verdes.

## R14 — Evidencia de proceso

- [ ] (1) Sin test. Abrir `progress/impl_test-dev-resource-isolation.md` en el
      **primer** commit de la feature, no al final.
- [ ] (2) Registrar durante el trabajo: decisiones tomadas, cualquier
      contradicción encontrada en esta spec (**parar y reportar**, no
      improvisar — precedente de #21), la corrida final de `./init.sh` con exit
      code y recuento de suites, y el resultado del procedimiento manual de R13
      ejecutado por el humano.
- [ ] (3) Cerrar [[traceability]] sin ninguna fila "pendiente" y verificar que
      `git log --oneline` de la branch muestra el rojo antes del verde para
      cada R-id de R1 a R13.

---

## Orden de dependencias (resumen)

```
R1 → R2 → R3 → R5        (la pieza; R5 fija la restricción)
        ↓
R4 (token) → R4 (8 consumidores)
        ↓
R6 → R7 → R8             (provisioning: los dos juegos)
        ↓
R9 (7 suites e2e) → R10  (la medida del aislamiento)
        ↓
R11 → R12                (guardas anti-regresión)
        ↓
R13 → R14                (docs y evidencia)
```
