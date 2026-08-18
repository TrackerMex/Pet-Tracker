# Implementacion: nutrition-profile-engine (#17)

Fecha: 2026-08-18
Branch: `feature/17-nutrition-profile-engine`

## Resultado

- Motor deterministico, perfil persistente e historial idempotente implementados en `src/modules/nutrition/`.
- Migracion nueva `0013_wet_may_parker.sql` generada con sus artefactos meta.
- Cuatro rutas HTTP protegidas por `PetAccessGuard`, sin `PetTrackingGuard`.
- `traceability.md` cubre R1..R27 con hashes de test e implementacion.
- La feature queda abierta para el reviewer; no se modificaron `feature_list.json`, `STATUS.md` ni los archivos de cierre de sesion.

## Commits por requisito

| R-id | Test | Implementacion |
|---|---|---|
| R1 | `f255ca6` | `e619962` |
| R2 | `469340f` | `f093a2b` |
| R3 | `b9ab034` | `ac74daa` |
| R4 | `3a39b1c` | `bd9fa4c` |
| R5 | `e19bd1e` | `893bc0b` |
| R6 | `c593500` | `7c38258` |
| R7 | `b373be3` | `f27fad4` |
| R8 | `070c938` | `33cb04c` |
| R9 | `f092130` | `c9702ab` |
| R10 | `6cea9e7` | `96067f8` |
| R11 | `0080f31` | `570e54a` |
| R12 | `e254816` | `d6aeb2f` |
| R13 | `c27f43b` | `2d45427` |
| R14 | `026258c` | `92d636c` |
| R15 | `12d2ae0`, `8be4a4b` | `89efb95` |
| R16 | `ef9addd` | `45e9f24` |
| R17 | `9207b2d` | `21482e1` |
| R18 | `9dfd8d0` | `d530faa` |
| R19 | `712dcef` | `2d914f7` |
| R20 | `788bfc3` | `1de7a02` |
| R21 | `3f78fb7` | `cfc1f07` |
| R22 | `a78313f` | `a2be049` |
| R23 | `0009bb9` | `60fcf86` |
| R24 | `60764e8` | `03ec047` |
| R25 | `bf5ee5d` | `ea19425` |
| R26 | `e1f5ce4` | `7957456` |
| R27 | `5ac4065` | `45e9f24` |

El ajuste final de lint y tipos esta en `b0ef38f`.

## Verificacion

- Postgres confirmado con binding `0.0.0.0:5432` y `[::]:5432`.
- `./init.sh` final: exit code 0.
- Build backend e infraestructura: verde.
- Backend unitario: 143/143 suites, 1111/1111 tests.
- Infraestructura: 2/2 suites, 14/14 tests.
- Harness env drift: 11 suites, 28/28 tests.
- E2E: 20 suites pasadas, 2 omitidas; 319 tests pasados, 6 omitidos.
- Lint: verde.
- Typecheck: verde.
- El log E2E mostro la carrera conocida FK `23503` en `pet_users`; Jest termino verde y la corrida se repitio con infraestructura caliente.
- Advertencia no bloqueante: `.env` no define `AWS_MODE`, `SIM_HOME_LAT`, `SIM_HOME_LNG` ni `SIM_SEED`.

## Decisiones y excepciones

- Se aplicaron OV1, OV2 y OV3 literalmente: kcal obligatorio, edad con precedencia y nutricion sin muro de pago.
- La migracion conserva los seis CHECKs definidos por la tabla normativa de requisitos, aunque una frase de tareas los contabiliza como cinco.
- R14 nacio verde al componer R2..R13; se registro como test ancla y no se reescribio historia.
- R27 nacio verde porque la conversion `numeric` ya era necesaria en R16; la trazabilidad referencia el commit real `45e9f24`.
- No se inventaron cifras clinicas ni se detectaron vacios numericos en la spec.
