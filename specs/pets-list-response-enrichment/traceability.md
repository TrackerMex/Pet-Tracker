---
feature: "pets-list-response-enrichment"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[pets-list-response-enrichment]]

## Requisitos

| Requisito | Test (archivo::nombre) | Archivo implementado | Commit (hash + mensaje) |
|---|---|---|---|
| R1 | pendiente — `backend-pet-tracker/src/modules/pets/application/use-cases/list-pets.use-case.spec.ts::R1 (pets-list-response-enrichment #66): el listado resuelve photoUrl por mascota con foto y deja null sin foto` | `backend-pet-tracker/src/modules/pets/application/use-cases/list-pets.use-case.ts` | pendiente |
| R2 | pendiente — `backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.spec.ts::R2 (pets-list-response-enrichment #66): GET /v1/pets serializa el photoUrl de cada item sin alterar el contrato` | `backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.ts` | pendiente |
| R3 | pendiente — `backend-pet-tracker/test/pets.e2e-spec.ts::R3 (pets-list-response-enrichment #66): GET /v1/pets devuelve photoUrl prefirmada para la mascota con photo_key` | `backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.ts` (+ use case de R1) | pendiente |
| R4 | pendiente — `backend-pet-tracker/src/modules/pets/application/use-cases/list-pets.use-case.spec.ts::R4 (pets-list-response-enrichment #66): sin N+1 — una consulta al repositorio y sin puertos de device ni vacuna` | `backend-pet-tracker/src/modules/pets/application/use-cases/list-pets.use-case.ts` | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(pets-list-response-enrichment): <desc> (R1,R4)`,
con el commit del test en rojo (`test(pets-list-response-enrichment): …`)
**antes** que el de la implementación — C4 exige historial rojo→verde por
R-id. Los nombres de test de arriba son los que [[requirements]] fija; si el
implementador los cambia, actualiza esta tabla en el mismo commit.

## Excepciones a C4 declaradas por adelantado

Lección de #28 y #29: la lista se escribe **antes** de implementar.

| R-id / `it` | Por qué nace verde | Qué debe decir su commit |
|---|---|---|
| R2 (b) — "24 claves y placeholders en null" | Es la mitad "el contrato **no** cambia" de R2: asevera que el listado sigue teniendo exactamente las 24 claves de #5 R8 con `device`/`nextVaccine`/`nextReminder`/`activitySummary` en `null`, propiedad que ya se cumple antes del cambio. Es una guarda de regresión; R2 (a) tiene su rojo propio. | "guarda de regresión, nace verde" |

**Ningún otro `it` debe nacer verde.** R1 (a)(b) y R4 (a) son rojos por
error de compilación del constructor (un solo argumento hoy) y por la forma
del item; R4 (b) es rojo porque el fuente no contiene
`PET_PHOTO_URL_RESOLVER`; R2 (a) es rojo porque `list()` no pasa `photoUrl`;
R3 es rojo porque el listado responde `photoUrl: null`. Si alguno llega
verde, el implementador **para y reporta** en
`progress/impl_pets-list-response-enrichment.md` — no se fabrica un fallo.

## Test existente que SÍ se edita (declarado)

| Archivo | `it` | Motivo | Cuándo |
|---|---|---|---|
| `backend-pet-tracker/src/modules/pets/application/use-cases/list-pets.use-case.spec.ts:33-63` | Los dos `it` del describe `R7: ListPetsUseCase devuelve solo las membresias activas del usuario` (#5) | El constructor gana un segundo parámetro obligatorio (deja de compilar) y cada item gana `photoUrl: null` (`toEqual(memberships)` deja de pasar). El enunciado de R7 de #5 no cambia. | En el commit verde de R1+R4 ([[tasks]]), nunca en la fase roja |

## Aserciones anti-vacío obligatorias

Herencia de #28 R11 y #29. Un solo test de esta feature lee un fichero con
`readFileSync` — R4 (b) sobre `list-pets.use-case.ts` — y SHALL asertar
además `source.length > 500` (el archivo tiene ~700 bytes hoy y crece con
el cambio). Sin esa aserción, R4 no se da por cubierto: un
`expect(source).not.toContain(...)` pasa igual sobre la cadena vacía.

## Tests que deben quedar verdes SIN editarse

Lista que revisa el `reviewer`. Según el inventario de riesgo de [[design]],
ninguno cambia de resultado:

| Archivo | Qué cubre |
|---|---|
| `backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.spec.ts` (todos los describes existentes, incluido `R7:` líneas 110-128) | Controller de #5, #6, #7 — `list()` con items sin `photoUrl` cae en el default del mapper |
| `backend-pet-tracker/src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.spec.ts` | Contrato de 24 claves (#5 R8, #6 R6) — el mapper no cambia |
| `backend-pet-tracker/src/modules/pets/application/use-cases/get-pet.use-case.spec.ts` | Detalle (#5, #6, #7, #14) — no cambia |
| `backend-pet-tracker/test/pets.e2e-spec.ts` describes de #5 (R2-R16) | CRUD e2e — R7 no asevera `photoUrl`; R8 es el detalle |
| `backend-pet-tracker/test/media.e2e-spec.ts` | Upload + detalle (#6) |
| Resto de `backend-pet-tracker/test/*.e2e-spec.ts` que llaman `GET /v1/pets` | Ninguna siembra `photo_key`; reciben `photoUrl: null` |
| `mobile-pet-tracker/**` (jest-expo, vía `TEST_CMD` de `init.sh`) | Consumidores de `listPets`/`PetProfile` — `null` sigue válido; `pet-switcher.test.tsx` ya cubre el no nulo |

## Comprobaciones del reviewer que no son tests

- `git diff --name-only <base>..HEAD -- mobile-pet-tracker/` **vacío**
  ([[design]] §D5, criterio 5 de #66: la UI móvil no implementa nada).
- `git diff --name-only <base>..HEAD -- backend-pet-tracker/src` lista
  **exactamente** `list-pets.use-case.ts`, `list-pets.use-case.spec.ts`,
  `pets.controller.ts`, `pets.controller.spec.ts` (más
  `test/pets.e2e-spec.ts` fuera de `src/`). Nada en `media/`, `db/`, el
  mapper, el repositorio ni `pets.module.ts` (R2, R4).
- `PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS` sigue definida **una sola vez**
  (`grep -rn "PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS =" src/` → una línea,
  `get-pet.use-case.ts:20`) — [[design]] §D3, OD-2.
- Historial rojo→verde: cuatro commits `test(...)` antes de los dos
  `feat(...)` ([[tasks]]).

## Decisiones abiertas del gate humano

Las cuatro de [[requirements]] §Decisiones que el humano debe confirmar:
OD-1 (firmar siempre), OD-2 (3600 s compartidos), OD-3 (`device` fuera),
OD-4 (informativa; solo genera un R5 si el humano pide la firma redondeada).
Si el humano cambia OD-1 a `?include=photo` u OD-3 a "entra", la spec
vuelve a `spec_author` antes del handoff: cambian R1-R4, no solo una cifra.

El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
