# Implementacion — Feature #66 `pets-list-response-enrichment`

- Fecha: 2026-09-06
- Branch: `feature/66-pets-list-response-enrichment`
- Base del implementer: `b3a344a`
- Alcance: R1-R4, backend NestJS modulo `pets`
- Resultado: implementacion y verificaciones automaticas completas;
  `./init.sh` final termino con exit 0. La feature permanece `in_progress`
  hasta la revision independiente.

## Que se implemento

- R1: `ListPetsUseCase` inyecta el puerto existente
  `PET_PHOTO_URL_RESOLVER`, exporta `PetListItem` y resuelve en paralelo con
  `Promise.all` una URL por cada mascota cuyo `photoKey` no es nulo. Las
  mascotas sin foto conservan `photoUrl: null`, el orden y los roles.
- R1/D3: el TTL se importa de
  `get-pet.use-case.ts` mediante
  `PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS`; la constante sigue definida una
  sola vez y vale 3600 segundos.
- R2: `PetsController.list()` pasa el `photoUrl` resuelto como quinto
  argumento de `toPetProfileResponse`, con `device` explicitamente en
  `null`. El mapper y la forma HTTP de 24 claves no cambiaron.
- R3: el e2e contra Postgres + LocalStack crea dos mascotas, asigna
  `photo_key` solo a una y verifica firma SigV4, `X-Amz-Expires=3600`, clave
  en el pathname, pathname identico al detalle, 24 claves y `null` para la
  mascota sin foto. No sube objetos a S3.
- R4: el listado hace una sola llamada a `findAllByMember`, devuelve solo
  `pet`, `role` y `photoUrl`, y la guarda de fuente excluye los puertos de
  device y vacuna.

## Historial TDD en orden

| Orden | Fase | Commit | Evidencia |
|---:|---|---|---|
| 1 | rojo R1 | `56a58a1 test(pets-list-response-enrichment): listado resuelve photoUrl por mascota con foto (R1)` | `photoUrl` recibido como `undefined`; typecheck TS2554/TS2339. |
| 2 | rojo R4 | `f147e27 test(pets-list-response-enrichment): listado sin N+1 ni puertos de device/vacuna (R4)` | faltaban la clave `photoUrl` y `PET_PHOTO_URL_RESOLVER` en el fuente. |
| 3 | rojo R2 | `558b75c test(pets-list-response-enrichment): GET /v1/pets serializa photoUrl con contrato intacto (R2)` | el controller devolvia `photoUrl: null`; la guarda de 24 claves nacio verde, como declara la excepcion aprobada R2(b). |
| 4 | rojo R3 | `9c387b2 test(pets-list-response-enrichment): e2e GET /v1/pets firma photoUrl con la misma clave que el detalle (R3)` | `typeof photoUrl` fue `object` porque el valor era `null`; 20 e2e heredados pasaron. |
| 5 | verde R1/R4 | `9722580 feat(pets-list-response-enrichment): ListPetsUseCase resuelve photoUrl via PET_PHOTO_URL_RESOLVER (R1,R4)` | suite dirigida: 1/1, 6/6 tests; typecheck exit 0. |
| 6 | trazabilidad R1/R4 | `b7930ba docs(pets-list-response-enrichment): record use case traceability (R1,R4)` | filas actualizadas inmediatamente despues del verde. |
| 7 | estilo R3 | `bbed5e8 style(pets-list-response-enrichment): format R3 e2e setup (R3)` | solo formateo Prettier del `db.update`; ninguna asercion cambio. |
| 8 | verde R2/R3 | `e93149f feat(pets-list-response-enrichment): GET /v1/pets serializa photoUrl del listado (R2,R3)` | dirigidos: 2/2 suites, 23/23 unitarios; 1/1 suite, 21/21 e2e. |
| 9 | trazabilidad R2/R3 | `bb437dd docs(pets-list-response-enrichment): complete requirement traceability (R2,R3)` | tabla R1-R4 sin filas pendientes. |

Los cuatro commits rojos preceden a cualquier codigo productivo. Los verdes
se agrupan como ordena `tasks.md`: R1/R4 comparten el cambio del use case y
R2/R3 comparten la unica linea de propagacion efectiva del controller. El
historial anterior ya contiene nueve commits antes de este informe, por
encima del minimo de ocho solicitado.

## Evidencia roja decisiva

Tras los cuatro commits de test y antes de produccion:

```text
$ pnpm test -- list-pets.use-case pets.controller
Test Suites: 2 failed, 2 total
Tests:       4 failed, 19 passed, 23 total
exit 1

Fallos dirigidos:
- R1(a): photoUrl [undefined, undefined, undefined]
- R4(a): falta la clave photoUrl
- R4(b): falta PET_PHOTO_URL_RESOLVER en el fuente
- R2(a): expected https://signed.example/a, received null
```

```text
$ pnpm run test:e2e -- pets.e2e-spec
Test Suites: 1 failed, 1 total
Tests:       1 failed, 20 passed, 21 total
R3: expected typeof photoUrl "string", received "object" (null)
exit 1
```

### Discrepancia de R1(b) con la prediccion de `tasks.md`

Jest esta configurado para transpilar este spec sin emitir diagnosticos de
tipos. Por eso R1(b), listado vacio, ejecuto verde en la primera corrida:
el codigo anterior ya devolvia `[]` y JavaScript ignoro el segundo argumento
del constructor. No se fabrico un fallo. El pipeline de TypeScript si quedo
rojo en ese mismo punto y senalo ambos constructores de R1:

```text
list-pets.use-case.spec.ts(104,47): TS2554 Expected 1 arguments, but got 2
list-pets.use-case.spec.ts(109,38): TS2339 Property 'photoUrl' does not exist
list-pets.use-case.spec.ts(138,47): TS2554 Expected 1 arguments, but got 2
```

Por tanto el commit R1 fue rojo tanto por comportamiento (R1a) como por
typecheck (R1a/R1b), pero la prediccion concreta de que `pnpm test` haria
fallar ambos `it` mediante ts-jest no coincide con la configuracion real.
Esta diferencia queda explicitamente registrada para el reviewer.

## Evidencia verde decisiva

```text
$ pnpm test -- list-pets.use-case
Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total

$ pnpm test -- list-pets.use-case pets.controller
Test Suites: 2 passed, 2 total
Tests:       23 passed, 23 total

$ pnpm run test:e2e -- pets.e2e-spec
Test Suites: 1 passed, 1 total
Tests:       21 passed, 21 total

$ pnpm exec tsc --noEmit --pretty false
exit 0
```

Corrida final desde la raiz, despues de `graphify update .` y de comprobar
que no habia otro `bash ./init.sh` real:

```text
$ ./init.sh
Build: OK
Backend unit: 163/163 suites, 1243/1243 tests
Infra: 2/2 suites, 14/14 tests
Harness env-drift: 28/28 tests
Mobile: 59/59 suites, 891/891 tests, 1/1 snapshot
E2E: 25 suites y 354 tests pasados; 3 suites/8 tests omitidos por gates existentes
Lint: OK
Typecheck: OK
Todo verde
exit 0
```

`graphify update .` termino con exit 0 y actualizo sus artefactos ignorados.
Aviso no bloqueante: 16 SQL no entraron al grafo porque no esta instalado
`tree_sitter_sql`; no se anadio la dependencia porque la feature exige cero
dependencias nuevas.

## Archivos tocados

- `backend-pet-tracker/src/modules/pets/application/use-cases/list-pets.use-case.ts`
- `backend-pet-tracker/src/modules/pets/application/use-cases/list-pets.use-case.spec.ts`
- `backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.ts`
- `backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.spec.ts`
- `backend-pet-tracker/test/pets.e2e-spec.ts`
- `specs/pets-list-response-enrichment/traceability.md`
- `progress/current.md`
- `progress/impl_pets-list-response-enrichment.md`

## Contencion y fuera de alcance

- `git diff --name-only b3a344a..HEAD -- mobile-pet-tracker/`: vacio. Se
  consulto la documentacion oficial versionada
  `https://docs.expo.dev/versions/v57.0.0/`, pero no se edito el cliente.
- Sin cambios en `pet-profile-response.mapper.ts`, `get-pet.use-case.ts`,
  `pet.repository.ts`, `pet.drizzle.repository.ts`, `pets.module.ts`,
  `src/modules/media/**`, schemas, migraciones, infraestructura o variables
  de entorno.
- `PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS =` aparece una sola vez, en
  `get-pet.use-case.ts`.
- No se instalaron dependencias, no se hizo `cdk deploy`, no se crearon
  recursos AWS reales y no se subieron bytes a S3 en R3.
- No se marco #66 como `done`, no se actualizo `STATUS.md` y no se abrio PR:
  esos pasos corresponden al reviewer y al cierre posterior. El warning
  preexistente de `STATUS.md` (58/63 declarado frente a 60/72 real) y las
  claves locales ausentes `RESEND_API_KEY`, `RESEND_FROM` y
  `RESET_LINK_HOST` no pertenecen a esta feature.
