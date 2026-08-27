---
feature: "pet-lost-mode"
issue: 45
branch: "feature/45-pet-lost-mode"
date: 2026-08-27
status: implementation_complete_human_smoke_pending
---

# Implementación — pet-lost-mode (#45)

## Resultado

- **R1–R4 backend:** `POST /v1/pets/:petId/lost-mode` valida
  `{ enabled: boolean }`, queda protegido por `PetAccessGuard` y
  `@RequirePetRole('owner')`, persiste el flag, actualiza `updatedAt`, registra
  `pet.lost_mode` con `{ enabled }` y devuelve `PetProfileResponse`.
- **R5 cliente móvil:** `setLostMode` usa `postJson`, bearer token y el contrato
  por `kind` para 200, 401, 403, otros status, body inválido, red caída y URL
  ausente.
- **R6–R7 Map:** el owner ve el label correspondiente al valor actual, puede
  activar/desactivar, el botón se bloquea durante la petición y el perfil se
  refresca. Los roles `family`, `walker` y `vet` mantienen la acción visible
  pero deshabilitada. Un fallo muestra el texto seleccionable
  `Could not update Lost Mode`, re-habilita el botón y se limpia al reintentar.
- `PetProfile.myRole` quedó alineado con los roles reales:
  `owner | family | walker | vet`.
- `lost_mode` sigue siendo solo un flag: no se añadieron efectos en alertas,
  posiciones, polling ni notificaciones. No se creó ni tocó ningún recurso AWS
  real.
- El tab Map conserva deliberadamente su estructura fat-route.

## Evidencia TDD y commits

| R-id | Rojo | Verde / implementación |
|---|---|---|
| R1 | `b9a4ac7` | `aeed8dc` |
| R2 | `739c582` | `b8e0cd7` |
| R3 | `8a19603` | `e3c64a7` |
| R4 | `bda3b38` | `d0299ce` |
| R5 | `566633a` | `e79f234` |
| R6 | `81fc2df` | `322c48d` |
| R7 | `f8f17f7` | `75835d8` |
| R8 | Sin test propio por spec; el primer gate final detectó la firma incompatible del constructor | `21445b3` y gate final verde |

Cada commit rojo precede a su implementación. Tras cada requisito se actualizó
`specs/pet-lost-mode/traceability.md`. El único bloque heredado reemplazado fue
el describe R10 del stub de `map.test.tsx`; el describe R5 se añadió al final de
`pets.test.ts` sin alterar casos existentes.

## Verificación R8

| Comando | Exit | Resultado relevante |
|---|---:|---|
| `docker compose up -d` | 0 | Postgres y LocalStack locales en ejecución |
| `bun run typecheck` en móvil | 0 | TypeScript limpio |
| `bun run lint` en móvil | 0 | Expo lint limpio |
| `bun run test` en móvil | 0 | 49 suites, 556 tests, 1 snapshot |
| `pnpm -C backend-pet-tracker run lint` | 0 | ESLint limpio; aplicó solo formato permitido |
| `pnpm -C backend-pet-tracker test` | 0 | 152 suites, 1162 tests |
| `pnpm -C backend-pet-tracker run test:e2e` | 0 | 22 suites / 343 tests; 3 suites / 8 tests omitidos por gates existentes |
| E2E focalizado de Lost Mode | 0 | 1 suite, 7 tests R1–R4 |
| `map.test.tsx` completo | 0 | 31 tests |
| `./init.sh` final | 0 | Build, tests, e2e, lint y typecheck verdes; mensaje `Todo verde` |

El primer `./init.sh` posterior a la implementación llegó hasta typecheck y
detectó que un test histórico construía `PetsController` con cinco argumentos.
Se mantuvo ese test intacto y la inyección nueva se hizo compatible en
producción; el E2E focalizado y la repetición completa del harness pasaron.

Dos flakes preexistentes aparecieron durante el baseline en corridas separadas:
orden de auditoría en `health-vaccines.e2e-spec.ts` y mock de ImagePicker en
`src/screens/add-pet/index.test.tsx`. Ambos pasaron aislados y no reaparecieron
en los gates finales.

## Contención y carta móvil

- La comparación automatizada de `git diff --name-only main...HEAD` contra la
  allowlist de R8 devolvió `allowlist_unexpected=0`.
- `git diff --check main...HEAD`: exit 0.
- Grep C8 de producción: `hex_outside_theme=0`, `arbitrary_classes=0` y
  `legacy_styles=0` (`StyleSheet.create`, shadow/elevation legacy).
- No se añadieron dependencias ni variables de entorno.
- El plugin Expo disponible localmente no exponía la skill solicitada
  `expo-overview`; se aplicaron sus equivalentes oficiales disponibles
  `building-native-ui` y `native-data-fetching`. La carta no pedía animación
  para este toggle, por lo que no se introdujo motion nuevo.
- Un commit concurrente ajeno a #45 (`a95dab8`) intentó versionar las skills.
  Se neutralizó en esta rama con `d2c217b`; los archivos quedaron preservados
  localmente y fuera del diff/PR, igual que al iniciar la sesión.

## Handoff humano R9

R9 no fue ejecutado ni cerrado por Codex. La feature permanece `in_progress`.
El humano debe probar en Android contra el backend local:

1. Levantar `docker compose up -d` y
   `pnpm -C backend-pet-tracker run start:dev`.
2. Configurar la IP LAN en el `.env` móvil y ejecutar `bunx expo start --go`
   desde `mobile-pet-tracker/`.
3. Login owner → Map con posición → `Activate Lost Mode` habilitado.
4. Pulsar y confirmar `Deactivate Lost Mode` y `lostMode: true` en perfil/GET;
   pulsar otra vez y confirmar el retorno a `false`.
5. Apagar backend, pulsar y confirmar el error visible y el reintento usable.
6. Si existe usuario `family`, confirmar botón visible y deshabilitado.

El humano registra aquí el resultado de ese smoke, actualiza la fila R9 de
trazabilidad y solo entonces la feature puede pasar a `done`.
