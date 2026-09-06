---
feature: "pets-list-response-enrichment"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[pets-list-response-enrichment]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Reglas de commit (C4 de [[../../CHECKPOINTS|CHECKPOINTS]], no negociables):**
>
> 1. **Un commit por sub-item (1) y otro por sub-item (2), como mínimo.** El
>    commit del test en rojo va **ANTES** que el de su implementación, siempre.
>    Nunca test + implementación + docs en el mismo commit (incumplimiento
>    registrado en #19).
> 2. Formato: `test(pets-list-response-enrichment): <desc> (R<n>)` para el
>    rojo, `feat(...)`/`refactor(...)` para el verde
>    (`docs/conventions.md` §Commits).
> 3. Cada `describe` nombra su R-id:
>    `describe('R1 (pets-list-response-enrichment #66): …')`.
> 4. Tras cada verde, actualizar la fila correspondiente de [[traceability]] —
>    nunca al final de todo.
>
> **Regla dura heredada de #27, #28 y #29**: si un test que esta lista pide
> en rojo nace **verde**, o si esta spec se contradice con el código real,
> **para y reporta** en `progress/impl_pets-list-response-enrichment.md`. No
> fabriques un fallo y no edites un test existente para ponerlo verde — con
> **una excepción declarada**: los dos `it` del describe `R7:` de #5 en
> `list-pets.use-case.spec.ts:33-63`, que esta spec ordena editar en la fase
> (2) de R1 ([[design]] §Inventario de riesgo).
>
> **Orden de ejecución: los cuatro (1) primero, luego los (2).** Motivo: R2
> (controller) y R3 (e2e) solo pueden nacer rojos si se escriben **antes** de
> que el use case y el controller cambien; y R4(b) (guarda de fuente) solo
> es rojo mientras `list-pets.use-case.ts` no importa
> `PET_PHOTO_URL_RESOLVER`. Escribir los cuatro tests rojos, verificar los
> cuatro rojos con los comandos de abajo, y solo entonces implementar.
>
> Comandos (desde `backend-pet-tracker/`):
> - unitarios: `pnpm test -- list-pets.use-case pets.controller`
> - e2e (requiere `docker compose up` con Postgres 5432 y LocalStack 4566):
>   `pnpm run test:e2e -- pets.e2e-spec`
> - todo: `./init.sh` desde la raíz (corre también `bun run --cwd
>   mobile-pet-tracker test`, que es la prueba de compatibilidad del móvil,
>   [[design]] §D5).

---

## Fase roja — los cuatro tests, en este orden

## R1 — El use case resuelve `photoUrl` por mascota con foto

- [ ] (1) Escribir test que falla para R1 en
      `backend-pet-tracker/src/modules/pets/application/use-cases/list-pets.use-case.spec.ts`:
      describe `R1 (pets-list-response-enrichment #66): el listado resuelve
      photoUrl por mascota con foto y deja null sin foto` con los `it` (a) y
      (b) de [[requirements]] R1. Ampliar `buildPet(id, name)` con un tercer
      parámetro `photoKey: string | null = null`. El stub del resolver es
      `resolveDownloadUrl: jest.fn((key: string) => Promise.resolve(\`https://signed.example/${key}\`))`.
      Rojo esperado: `new ListPetsUseCase(repo, resolver)` no compila (el
      constructor acepta un solo argumento) — error de tipos de ts-jest, que
      cuenta como rojo.
      Commit: `test(pets-list-response-enrichment): listado resuelve photoUrl por mascota con foto (R1)`.

## R4 — Sin N+1: una consulta, sin puertos de device ni vacuna

- [ ] (1) Escribir test que falla para R4 en el mismo archivo: describe `R4
      (pets-list-response-enrichment #66): sin N+1 — una consulta al
      repositorio y sin puertos de device ni vacuna` con los `it` (a) y (b)
      de [[requirements]] R4. En (a) el mock de repositorio es
      `{ findAllByMember } as unknown as PetRepository` — **solo** ese
      método. En (b), `readFileSync(path.join(__dirname, 'list-pets.use-case.ts'), 'utf-8')`
      con las cuatro aserciones (contiene `PET_PHOTO_URL_RESOLVER`; no
      contiene `PET_DEVICE_READER`; no contiene `PET_VACCINE_READER`;
      `length > 500`). Rojo esperado: (a) por el mismo error de constructor
      que R1 y por `Object.keys(item)` sin `photoUrl`; (b) porque el fuente
      aún no contiene `PET_PHOTO_URL_RESOLVER`.
      Commit: `test(pets-list-response-enrichment): listado sin N+1 ni puertos de device/vacuna (R4)`.

## R2 — El controller serializa `photoUrl` sin alterar el contrato

- [ ] (1) Escribir test que falla para R2 en
      `backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.spec.ts`:
      describe `R2 (pets-list-response-enrichment #66): GET /v1/pets serializa
      el photoUrl de cada item sin alterar el contrato` con los `it` (a) y
      (b) de [[requirements]] R2. Usar el `buildController()` y `buildPet()`
      existentes; `listExecute.mockResolvedValue([...])` con items que llevan
      `photoUrl`. La lista de 24 claves se copia literal al test (no se
      importa del mapper). Rojo esperado: (a) `response[0].photoUrl` es
      `null` porque `list()` no pasa el 5.º argumento; (b) nace verde (el
      contrato ya tiene 24 claves) — es la mitad "no cambia" del requisito,
      declarada en [[traceability]] §Excepciones.
      Commit: `test(pets-list-response-enrichment): GET /v1/pets serializa photoUrl con contrato intacto (R2)`.

## R3 — e2e: el listado firma la misma URL que el detalle

- [ ] (1) Escribir test que falla para R3 en
      `backend-pet-tracker/test/pets.e2e-spec.ts`: describe `R3
      (pets-list-response-enrichment #66): GET /v1/pets devuelve photoUrl
      prefirmada para la mascota con photo_key`, un `it` con la siembra y las
      siete aserciones de [[requirements]] R3 (`X-Amz-Signature` no vacío,
      `X-Amz-Expires === '3600'`, `pathname` termina en `/<photo_key>`, la
      otra mascota `null`, 24 claves en ambas, `pathname` igual al del
      detalle). Rojo esperado: `photoUrl` del listado es `null` →
      `new URL(null)` lanza / `expect(typeof photoUrl).toBe('string')` falla.
      Commit: `test(pets-list-response-enrichment): e2e GET /v1/pets firma photoUrl con la misma clave que el detalle (R3)`.

- [ ] **Verificar los cuatro rojos** antes de seguir: `pnpm test --
      list-pets.use-case pets.controller` (R1, R4, R2a rojos; R2b verde,
      declarado) y `pnpm run test:e2e -- pets.e2e-spec` (R3 rojo, los
      describes de #5 verdes).

---

## Fase verde

## R1 + R4 — Implementación mínima del use case

- [ ] (2) Implementación mínima en
      `backend-pet-tracker/src/modules/pets/application/use-cases/list-pets.use-case.ts`,
      **con la forma exacta de [[design]] §D2**: import de
      `PET_PHOTO_URL_RESOLVER` / `PetPhotoUrlResolver` desde
      `@/modules/pets/domain/ports/pet-photo-url-resolver`, import de
      `PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS` desde `./get-pet.use-case`,
      `export interface PetListItem extends PetWithRole { photoUrl: string | null }`,
      segundo parámetro del constructor, y `execute()` con `Promise.all`.
      Actualizar el JSDoc de la clase (hoy dice solo "GET /v1/pets (R7)";
      añadir "#66 R1: resuelve `photoUrl` vía PET_PHOTO_URL_RESOLVER solo
      cuando `photoKey` no es nulo, misma constante y condición que
      GetPetUseCase"). **En el mismo commit**, la edición declarada de los
      dos `it` del describe `R7:` de #5 (`list-pets.use-case.spec.ts:33-63`):
      pasar el resolver stub al constructor y asertar
      `toEqual(memberships.map((m) => ({ ...m, photoUrl: null })))` en el
      primero; en el segundo solo el constructor. Verde esperado: R1(a),
      R1(b), R4(a), R4(b) y los dos `it` de R7 editados.
      Commit: `feat(pets-list-response-enrichment): ListPetsUseCase resuelve photoUrl via PET_PHOTO_URL_RESOLVER (R1,R4)`.
- [ ] (3) Refactor con tests verdes — si no hay nada que refactorizar, no
      inventar un commit.

## R2 + R3 — Implementación mínima del controller

- [ ] (2) Implementación mínima en
      `backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.ts`
      `list()`: destructurar `photoUrl` del item y pasar
      `toPetProfileResponse(pet, role, now, null, photoUrl)`. Sustituir el
      comentario de la línea 76-78 si lo hay; no tocar `detail()` ni el
      resto. Verde esperado: R2(a) y, con Docker levantado, R3. También
      `pets.controller.spec.ts:110-128` (R7 de #5) **sin editar**.
      Commit: `feat(pets-list-response-enrichment): GET /v1/pets serializa photoUrl del listado (R2,R3)`.
- [ ] (3) Refactor con tests verdes.

---

## Cierre

- [ ] `./init.sh` verde desde la raíz (build, lint, typecheck, unitarios de
      backend + infra + móvil, e2e si los puertos 5432/4566 responden).
- [ ] `git diff --name-only <base>..HEAD` lista **solo** los cinco archivos
      de [[design]] §Archivos afectados §Modificados (+ `specs/` y
      `progress/`): nada bajo `mobile-pet-tracker/`, `src/modules/media/`,
      `src/db/`, ni el mapper, el repositorio o `pets.module.ts`.
- [ ] [[traceability]] sin filas "pendiente", con hash y mensaje de cada
      commit, y la tabla de excepciones a C4 confirmada (solo R2b).
- [ ] `progress/impl_pets-list-response-enrichment.md` escrito: qué se
      hizo, qué nació verde, y cualquier discrepancia con esta spec.
