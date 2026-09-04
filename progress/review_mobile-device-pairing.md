# review: mobile-device-pairing
Fecha: 2026-09-03 22:55 UTC
Veredicto: APROBADO (gate automático; G1 sigue pendiente del humano — la feature no pasa a `done` hasta que lo cierre)

Revisado en el worktree `/home/claude/sites/Pet-Tracker-wt-42`, branch
`feature/42-mobile-device-pairing`, HEAD `2d24fe1` (27 commits sobre
`c0d342a`). Working tree limpio antes y después de la revisión; no se
commiteó ni pusheó nada.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: #42, count = 1)
- [x] progress/current.md actualizado (sesión #42 activa, handoff registrado)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure — backend intacto: `git diff --stat c0d342a HEAD -- backend-pet-tracker` vacío
- [x] repositories/contratos en domain son interfaces puras — sin cambios en backend
- [x] application depende de interfaces, no implementaciones — sin cambios en backend
- [x] infrastructure sin lógica de negocio — sin cambios en backend
- [x] Separación móvil de design.md §Archivos: `src/api/devices.ts` y `src/api/subscriptions.ts` importan solo `./http`, `./types`, `./positions` (cero React); route `src/app/(tabs)/pairing.tsx` de 5 líneas delega en `PairingScreen`; toda la UI vive en `src/screens/pairing/index.tsx`

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra: R1, R2 (`api/__tests__/devices.test.ts`), R3 (`api/__tests__/subscriptions.test.ts`), R4–R9 (`screens/pairing/index.test.tsx`), R10 (`profile/index.test.tsx` y `(tabs)/__tests__/home.test.tsx` con sufijo `(mobile-device-pairing)`), R11 (`__tests__/design-drift.test.ts`). Los `describe` copian literalmente los nombres de requirements.md.
- [x] Historial test-primero verificado en `git log --reverse c0d342a..HEAD`: los 11 pares `test(...) (Rn)` → `feat(...) (Rn)` más el par extra de R8 (`6cda534` → `b5d365a`). `git show --stat` de cada commit: los `test` tocan solo archivos de test, los `feat` solo fuente.
- [x] Rojo→verde reproducido por mí (estado de fuente del commit rojo sobre HEAD, luego `git checkout HEAD -- …`):
  - R1: `7218959` (test) con `src/api/devices.ts` ausente → `FAIL Cannot find module '../devices'`; HEAD → `27 passed`.
  - R5: `05ece6c` (test + `index.tsx` de ese commit) → `3 failed, 8 skipped` en el describe R5; HEAD → suite completa `47 passed`.
  - R9: `332c778` (test + `index.tsx` de ese commit) → `9 failed, 37 skipped` en el describe R9; HEAD → `47 passed`.
  - Nota metodológica: checkout del archivo de test solo (como pedía el prompt) no puede dar rojo porque HEAD ya implementa todo; se restauró también el fuente del commit rojo, que es la reproducción fiel.

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" en R1–R11; G1 queda `pendiente (humano)` como exige la spec
- [x] Commits siguen el formato `test|feat|fix|docs(mobile-device-pairing): <desc> (Rn)`; hashes de la tabla coinciden con `git log`

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved` y casilla humana marcada (2026-09-03); commit humano `6d32094` (AlexisSM377 "Approve mobile device pairing requirements"). Tras la aprobación solo `c0d342a` tocó requirements/design/tasks y únicamente cambió el frontmatter `draft → approved` (flujo documentado); ningún requisito modificado.

## Checklist C7 — Sin código huérfano
- [ ] Componentes/módulos reemplazados por esta feature fueron eliminados
- [ ] Sus tests también fueron eliminados
- [x] N/A — esta feature no reemplaza nada existente (home y profile solo ganan un enlace)

## Checklist C8 — UI móvil (aplica: hay UI)
- [x] Grep-clean: `grep -nE 'hex|[..]|StyleSheet.create|shadow*|elevation' src/screens/pairing/ src/api/devices.ts src/api/subscriptions.ts src/app/(tabs)/pairing.tsx` → 0 coincidencias; describe `C8` existente y `R11 (mobile-device-pairing)` verdes
- [x] Dimensiones uniformes en `contentContainerStyle`: `padding: 24`, `gap: 16`, `paddingTop: insets.top + 12`, `paddingBottom: insets.bottom + 96` (`index.tsx:226-231`)
- [x] Estados de carga con `Skeleton` de heroui dimensionado (`pairing-skeleton` ×3, `plan-skeleton`); sin Spinner
- [x] Componentes compartidos: `Card` (`../../components/card`) y `PetSwitcher` (`../../components/pet-switcher`); sin forks locales
- [x] Touch target ≥ 44pt: `pairing-back` `size-11`, botones `min-h-11`, `ready-done` `min-h-11`, `collar-pair-link` `min-h-11`; feedback pressed vía heroui `Button`; los `Pressable` planos siguen el patrón ya existente del repo (`docs-back`, `documents-link`)
- [x] Animaciones/haptics nuevos: ninguno (`entering=`/`expo-haptics` → 0), conforme a D8
- [x] Route delgado (5 líneas) + `src/screens/pairing/`; `Alert.alert` nativo en unpair con `Cancel`/`Unpair` (`style: 'cancel'`/`'destructive'`) conforme a D6
- [x] Copy D7 exacto (verificado string a string en `index.tsx`, `profile/index.tsx`, `home.tsx`): títulos, nota free, mensajes de R6/R9, subtítulo ready, labels de filas, pill/bloques de plan, labels de enlaces

## Contratos backend (D1) — comparados contra el código real
- `POST /v1/devices/claim`: `DevicesController.claim` (`@Controller('devices')` + `@Post('claim')`, `setGlobalPrefix('v1')`), `ClaimDeviceSchema { petId: z.uuid(), activationCode: z.string().trim().min(1).max(64) }`; 201 devuelve `toDeviceStatusResponse` (5 claves). `mapDeviceError`: 404 genérico (PetNotAccessible), 403 genérico (InsufficientPetRole), 404 `DEVICE_NOT_FOUND`, 409 `DEVICE_ALREADY_ASSIGNED`, 409 `PET_ALREADY_HAS_DEVICE`, 402 `DEVICE_SUBSCRIPTION_REQUIRED`. `claimDevice` (`devices.ts:30-82`) mapea exactamente eso; los 404/409 sin `code` reconocido → `error`.
- `DELETE /v1/pets/:petId/device`: `PetDeviceController.release` con `@HttpCode(204)`, `@RequirePetRole('owner')`, `PetAccessGuard` (404 genérico), `DEVICE_NOT_ASSIGNED` → 404. `releaseDevice` (`devices.ts:93-127`) mapea 204/404/403/401/otro.
- `GET /v1/pets/:petId/positions/last`: `PositionsController` con `@UseGuards(PetAccessGuard, PetTrackingGuard)`; el guard lanza 402 `DEVICE_SUBSCRIPTION_REQUIRED` cuando `isPetTracked` es falso. `getPetTracking` delega en `getLastPosition` (402 → `no-tracking` → `tracked: false`; 200 → `tracked: true`) con el comentario `ponytail:` pedido por D2.
- `SubscriptionsModule` exporta solo `SUBSCRIPTION_REPOSITORY` y `PetTrackingGuard`: no hay endpoint de suscripciones y la app no inventa ninguno.

## Contención
- `git diff --stat c0d342a HEAD -- backend-pet-tracker mobile-pet-tracker/src/theme mobile-pet-tracker/package.json .env.example mobile-pet-tracker/.env.example` → vacío. También vacío para lockfiles, `app.json`, `global.css` y `feature_list.json`.
- `grep -rn "expo-camera" mobile-pet-tracker/src mobile-pet-tracker/package.json` → 0.
- `profile/index.tsx`: +12 líneas, solo la fila `pairing-link` tras `documents-link` con el mismo markup (`rounded-xl bg-default px-3 py-2`, chevron `›`) y `router.push('/pairing' as Href)`; ningún texto ni testID previo tocado. `home.tsx`: +12 líneas, `collar-pair-link` dentro de `collar-card` solo con `device === null`; test negativo "does not show the pair action when the pet has a collar" presente.

## Observaciones
Ninguna bloqueante. Anotaciones para el leader:

1. **Línea ~86 del impl report** ("no afectó el exit ni pertenece a esta feature"): es `NodeVersionSupportWarning: The AWS SDK for JavaScript (v3) will require node >=22. You are running node v20.20.2`, emitido por el SDK de AWS en la etapa de build/synth (infra/backend). Es un aviso de entorno del VPS (Node 20), sin relación con el código móvil de esta feature; en mi ejecución también apareció y el exit fue 0. **No bloqueante.** Deuda de entorno: planificar Node 22 en el VPS/CI.
2. **e2e y `.env`**: el `.env.example` (`pet_tracker:pet_tracker@localhost:5432`) no autentica contra el Postgres activo (`password authentication failed`), tal como describe el impl report. Ejecuté `init.sh` inyectando en el entorno del proceso las variables del `.env` del tree principal (vía dotenv, sin copiar ni leer valores) y borré al final el `.env` que `init.sh` genera desde el ejemplo. Los e2e corrieron de verdad (25 suites / 353 tests; los 3 suites / 8 tests omitidos son gates preexistentes `aws-real-*`, idénticos a la baseline del implementer).
3. **D7 filas de valor (cosmético, no bloqueante)**: D7 pedía "mismo InfoRow que profile" (`text-sm`, separador `border-b border-separator py-3`). `DeviceRow` en pairing usa tamaño de texto por defecto y `gap-4` sin separadores. Ningún R-id fija esas clases y C8 se cumple; si en el smoke G1 el humano quiere las filas idénticas al perfil, es un ajuste de 2 clases en `DeviceRow` (`index.tsx:33-54`).
4. **Deuda anotada por la spec**: endpoint propio `GET /v1/pets/:petId/subscription` para sustituir la sonda sobre `positions/last` (D2). Queda para el backlog del leader.
5. G1 (smoke en dev build Android con `SIM_MODE`) sigue **pendiente (humano)**; guion presente en `docs/verification.md` §"Feature 42 — mobile-device-pairing" (idéntico a design.md §D11). La feature no debe marcarse `done` hasta que el humano lo registre con fecha en `progress/impl_mobile-device-pairing.md`.

## Output de ./init.sh
Ejecutado por el reviewer desde `/home/claude/sites/Pet-Tracker-wt-42` (exit 0; log completo de 11.562 líneas en el scratchpad de la sesión, `init_wt42.log`). Resumen por etapa:

```
→ Verificando entorno...
✅ node disponible (/usr/bin/node)          # v20.20.2
✅ pnpm disponible · ✅ bun disponible
→ Verificando variables de entorno...
⚠️  .env no encontrado. Copiando desde .env.example...   # borrado al terminar
✅   DATABASE_URL definida
→ Instalando dependencias...  ✅ Dependencias instaladas
→ Verificando coherencia del harness...
✅ Archivos del harness presentes
⚠️  Feature en progreso: mobile-device-pairing
✅ STATUS.md sincronizado con feature_list.json
→ Build...  ✅ Build exitoso
   (node:…) Warning: NodeVersionSupportWarning: The AWS SDK for JavaScript (v3)
   will require node >=22. You are running node v20.20.2.
→ Ejecutando tests...
   backend:  Test Suites: 163 passed, 163 total · Tests: 1235 passed, 1235 total
   infra:    Test Suites: 2 passed, 2 total     · Tests: 14 passed, 14 total
   harness:  # tests 28 · # pass 28 · # fail 0
   móvil:    Test Suites: 56 passed, 56 total
             Tests:       707 passed, 707 total
             Snapshots:   1 passed, 1 total
             PASS src/screens/pairing/index.test.tsx (5.411 s)   # sin console.error/warn propios
✅ Tests pasados
→ Tests e2e...
   Test Suites: 3 skipped, 25 passed, 25 of 28 total
   Tests:       8 skipped, 353 passed, 361 total
✅ Tests e2e pasados
→ Lint...      ✅ Lint sin errores
→ Typecheck... ✅ Typecheck sin errores
══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
  Features: 56/60 completadas | 3 pendientes
```
