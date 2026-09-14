# review: pet-online-pill (#73)
Fecha: 2026-09-14
Branch: `feature/73-pet-online-pill` @ `ea0a32a1` (worktree `/home/claude/sites/Pet-Tracker-wt-backend`, `origin/main` = `8601ee8f`, merge-base `572a24e4`)
Veredicto: **APROBADO, pendiente del gate humano R11**

Revisión independiente: `./init.sh` corrido por el reviewer en primer plano, sondas de mutación repetidas por el reviewer, rojos de C4 reproducidos en worktrees temporales (borrados al terminar), `git status` limpio al final (salvo `progress/current.md`, ver hallazgo 6).

---

## Checklist C2 — Estado coherente

| Ítem | Evidencia | |
|---|---|---|
| Solo 1 feature `in_progress` | `grep -c '"status": "in_progress"' feature_list.json` → `1`; es `id: 73` (`feature_list.json:1368`) | [x] |
| `progress/current.md` describe la sesión activa | entrada `2026-09-14 … reviewer lanzado …` | [x] |

## Checklist C3 — Arquitectura

| Ítem | Evidencia | |
|---|---|---|
| domain sin imports de infrastructure | `backend-pet-tracker/src/modules/devices/domain/connectivity.ts:3` — único import: `@/pipeline/constants` (núcleo puro, `docs/architecture.md:104`) | [x] |
| contratos en domain son interfaces puras | `DerivedConnectivity` es un tipo; `deriveConnectivity` es función pura sin IO | [x] |
| application depende de interfaces | no se tocó `application/`; el puerto `IngestionStore` (`workers/ingestion-store.ts`) solo cambia docblock | [x] |
| infrastructure sin lógica de negocio | `device-status.mapper.ts:1,32` delega a `deriveConnectivity(source.lastMessageAt, now)`; el umbral vive en `pipeline/constants.ts:27` | [x] |

## Checklist C4 — TDD

| Ítem | Evidencia | |
|---|---|---|
| Cada R nombra su R-id en un test | grep `#73 R` en suites: R1, R2 (×2), R3, R5, R6 (×2), R7 (×2), R8, R9 y E2 nombrados en `describe`/`it`. R4: la spec firmada fija la forma (comentario `// #73 R4` en `test/ingestion.e2e-spec.ts:218`, dentro del `it` R19) | [x] |
| Historial test-primero | `git log --oneline origin/main..HEAD`: por cada R un `test(...)` antes de su `feat|fix(...)`: R1 `b9026577→d0b4de73`, R2 `2f04bc49`+R3 `b77468ba→f92f0736`, R4 `0bce51d6→7ef50f06`, R5 `d2a7f56f→fb1d2752`, R6 `badf0069→9ea95b76`, R7 `e5a498c9→d734daf9`, R8 `dcff4641→dfbb7190`, R9 `b0570334→5793f723` | [x] |
| Rojo de aserciones, no de compilación (R1) | worktree temporal @ `b9026577`, `pnpm test -- connectivity`: `Tests: 6 failed, 6 total`; `Expected: 120000 / Received: 0` (it 1) y `not implemented` (it 2-6) | [x] |
| Rojo de aserciones (R2/R3) | `git show 2f04bc49 -- device-status.mapper.ts`: stub `now: Date` + `void now` + `connectivity: null`, `DeviceStatusSource` sin `connectivity`; R3 `b77468ba` añade el e2e antes del `feat` `f92f0736` | [x] |
| Rojo de aserciones (R4) | `git show 0bce51d6 -- test/ingestion.e2e-spec.ts`: `-toBe('online')` / `+toBeNull(); // #73 R4` antes de borrar la línea del store en `7ef50f06` (`-        connectivity: 'online',`) | [x] |
| Rojo de aserciones (R8/E2) | worktree temporal @ `dcff4641`, `bun run test -- pet-hero-header legibility`: `Tests: 18 failed, 44 passed`; `Unable to find an element with testID: pet-hero-status` (R8 ×8), `duration` 0≠1000 y `Expected number of calls: 1 / Received: 0` (E2 ×6), fila `pet-hero-header.tsx` de legibility (×1). Los 3 restantes son arnés, ver hallazgo 1 | [x] |
| R10 vía (b) mutación | sondas 1-5 repetidas abajo, todas rojas por aserción y restauradas | [x] |
| Ningún rojo por `ReferenceError` de helper | no hay: `elementChild` se copia en el mismo commit rojo (`pet-hero-header.test.tsx:82-86`) | [x] |
| Ningún rojo por mutación del doble | no hay: todos los rojos son por stub/placeholder en producción o aserción nueva | [x] |

## Checklist C5 — Trazabilidad

| Ítem | Evidencia | |
|---|---|---|
| `traceability.md` sin filas "pendiente" | R1-R9 con hash rojo + verde; R10 "sin hash de test; evidencia de sondas"; R11 "gate humano por ejecutar" (a propósito) | [x] |
| Hashes existen y son ancestros de HEAD | `git cat-file -e` OK en los 19 hashes citados (incluidos `0a76562b` y `383d3fef`); `git merge-base --is-ancestor` OK | [x] |
| Formato de commits | `test(pet-online-pill): … (Rn)` / `feat\|fix(pet-online-pill): … (Rn)`; el verde de R2 lleva `(R2,R3)` | [x] |

## Checklist C6 — Spec aprobada

| Ítem | Evidencia | |
|---|---|---|
| `status: approved` + casilla humana | `requirements.md:3` `status: approved`; `:939` `[X] Aprobado por humano (fecha: 2026-09-12)` (`0a76562b`) | [x] |
| Enmiendas E1-E3 firmadas | `requirements.md:933` `[X] Enmiendas E1-E3 aprobadas por humano (fecha: 2026-09-13)` (`383d3fef`); Codex las revalidó antes de R8 (impl §R8) | [x] |
| Ningún requisito modificado tras la firma sin gate | `git log origin/main..HEAD -- specs/pet-online-pill/requirements.md` solo toca §Enmiendas (`eba4ef5a`, `383d3fef`) | [x] |

## Checklist C7 — Sin código huérfano

- [x] Lo reemplazado (el write `connectivity: 'online'` del store) fue eliminado: `rg "connectivity: 'online'" backend-pet-tracker/src` → 0.
- [x] `DeviceStatusSource.connectivity` eliminada (R2); la columna y la entidad se conservan **por decisión firmada** (D2, "borrado por migración es feature aparte"), no por descuido.
- [x] No queda test de código borrado.

## Checklist C8 — UI móvil (carta `docs/ui-guidelines.md`)

| Ítem | Evidencia | |
|---|---|---|
| Grep-clean sobre lo tocado (`pet-hero-header.tsx`, `screens/home/index.tsx`, `utils/device-connectivity.ts`, `i18n/catalog.ts`) | cero hex, cero `[...]`, cero `StyleSheet.create`, cero `rounded-2xl\|lg\|md\|sm`, cero shadow/elevation, cero `text-[11px]`, cero `Chip`. `animate-pulse` solo en el docblock de `STATUS_DOT_PULSE` (`pet-hero-header.tsx:33`), que E2 exige literalmente | [x] |
| Dimensiones / safe areas | no cambian (hero conserva `useSafeAreaInsets`, candado #67 verde) | [x] |
| Skeleton, no Spinner | sin skeleton nuevo por decisión firmada (R8 decisión 13, D6) | [x] |
| Componentes compartidos | la píldora vive dentro del hero (D8); Home no duplica receta | [x] |
| Tappables | la píldora no es tappable (sin rol, D7) — no aplica touch target | [x] |
| Animaciones: Reanimated UI thread, interrumpibles, reduced motion | `useSharedValue`+`useAnimatedStyle` (`pet-hero-header.tsx:103-105`), `cancelAnimation` en cleanup (`:122-125`), doble guarda `useReducedMotion()` + `ReduceMotion.System` (`:102,40`); estilo animado solo `{ opacity }` sin `Color`/var CSS | [x] |
| Enmienda #70 (elemento con todas sus decisiones candadas) | ver tabla abajo | [x] |

### Enmienda #70 — píldora, aserción por decisión (`pet-hero-header.test.tsx`)

| Decisión | Aserción | Línea |
|---|---|---|
| Texto formateado por el llamante | `within(pill).getByTestId('pet-hero-status-text')` → `toHaveTextContent('En línea')` | 428 |
| Token del punto / del fondo / de la tinta | `it.each` 3 filas sobre `pill.props.className`, `elementChild(pill,0).props.className`, `elementChild(pill,1)…` | 432-448 |
| Orden punto → texto y 2 hijos exactos | `pill.children` `toHaveLength(2)`; `elementChild(pill,0/1).props.testID` | 423-426 |
| `accessible` + `accessibilityLabel` = texto | 481-482 | |
| `text-2xs font-semibold`, `rounded-full` cápsula, `self-start`, `size-1.5` | 465-470 | |
| Sitio: primer hijo de la columna izquierda de `pet-hero-caption`, nunca en slot ni media | `elementChild(caption,0)` → `elementChild(left,0/1)`; `within(slot/media).queryByTestId` null | 493-506 |
| Condición de render (sin `status` / `pet === null`) | 510-524 | |
| Pulso: constante `STATUS_DOT_PULSE` (1000 ms, `ReduceMotion.System`, bezier por fuente) | 542-550 | |
| Doble guarda reduced motion (rama estática, sin `withRepeat`) | 552-566 | |
| Solo `success` pulsa; `warning`/`muted` estáticos | 568-582 (`toHaveAnimatedStyle`, `withTiming` 0.5→1, `withRepeat(…,-1,false)`) y 584-596 | |
| `cancelAnimation` en cleanup | 598-608 | |
| Orden con `within`/`elementChild`, no `getByTestId` global | sí en R8 it 1, 5 y en R9 (`within(pill)`, `index.test.tsx:723-731`) | |

---

## Verificación independiente

### `./init.sh` (primer plano, desde la raíz del worktree, `pgrep` vacío antes)

`./init.sh > …/init-73-review.log 2>&1; echo exit=$?` → **`exit=0`**. Log: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/7a67f1ed-3af6-4089-8df5-647269dc2bb5/scratchpad/init-73-review.log`. Líneas decisivas:

```
✅ Build exitoso
Tests:       1277 passed, 1277 total          (backend unit, 166 suites)
Tests:       1259 passed, 1259 total          (móvil, 73 suites)
Tests:       8 skipped, 365 passed, 373 total (e2e, 26 suites)
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

Ninguna suite que estaba verde quedó roja.

### Drift (`git diff --stat origin/main...HEAD -- . ':!specs' ':!progress' ':!feature_list.json'`)

27 ficheros. **Ninguno** de los vetados por R10: `map.tsx`, `map.test.tsx`, `app/(tabs)/home.tsx`, `floating-tab-bar.tsx`, `docs/ui-guidelines.md`, `specs/mobile-pet-hero-header/design.md`, `specs/devices-claim/requirements.md`, `progress/audit_animations_mobile.md` — ausentes. `src/screens/profile/index.tsx`, `src/screens/pairing/index.tsx`, `src/api/types.ts` tampoco (como declara D "No se tocan"). Único fichero fuera de `files_affected`: `STATUS.md` (hallazgo 3).

### Sondas de mutación (todas con `git diff --exit-code -- <fichero>` = 0 tras restaurar)

| # | Mutación (producción) | Rojo visto | Restaurado |
|---|---|---|---|
| a | reponer `connectivity: 'online',` en `ingestion.drizzle.store.ts` | `pnpm test:e2e -- ingestion` → `ingestion.e2e-spec.ts:218` `toBeNull()` / `Received: "online"`; `1 failed, 2 passed` | sí |
| b | `DEVICE_ONLINE_THRESHOLD_MS = 2 * 60_000 - 1_000` | `pnpm test -- connectivity` → `connectivity.spec.ts:8` `Expected: 120000 / Received: 119000`; `1 failed, 5 passed` | sí |
| c | cruzar `dot` `success`↔`warning` en `STATUS_TONE_CLASSES` | `bun run test -- pet-hero-header screens/home` → 5 fallos: R8 `it.each` filas `success` y `warning`, E2 it 2 (`bg-success`), R9 `it.each` 2 filas; `5 failed, 211 passed` | sí |
| d | cruzar `labelKey` `unknown`↔`offline` en `HOME_CONNECTION` | `bun run test -- screens/home` → 4 fallos: los dos `it` R7 y 2 filas del `it.each` R9; `4 failed, 176 passed` | sí |
| e1 | quitar `!reduceMotion` de `pulses` | `bun run test -- pet-hero-header` → rojo E2 it 2 ("con reduced motion activo el punto es estatico"); `1 failed, 35 passed` | sí |
| e2 | `status?.tone !== 'muted'` en `pulses` | `bun run test -- pet-hero-header` → rojo E2 `it.each` fila `warning`; `1 failed, 35 passed` | sí |
| 5 (R10) | solo lectura | `git diff --name-only origin/main...HEAD \| grep -c 'map\.'` → 0 | — |

Coincide con la evidencia de `progress/impl_pet-online-pill.md` §R4/§R8/§R9/§R10 (mismas líneas `:218`, `:8`, `:448`, `:658/:681/:747`).

### Candados — deltas de §Candados "Cambian" (diff `origin/main...HEAD`)

| Candado | Esperado | En el diff |
|---|---|---|
| `test/ingestion.e2e-spec.ts:218` | `toBeNull()` | ✓ |
| `device-status.mapper.spec.ts` | reescrito, 3 `it`, 5 claves | ✓ |
| `pets.controller.spec.ts:230` | `'offline'` + 2 `it` | ✓ |
| `language-provider.test.tsx:41` | `260 + 16 + 1 + 4 + 7 + 14 + 2` | ✓ (`:55`) |
| `ui-language.test.ts:84` | `21 + 15 + 1 + 4 + 7 + 2 + 1` | ✓ (`:85`) |
| `ui-language.test.ts:167` | `42 + 2 + 1` | ✓ (`:168`) |
| `ui-copy-table.ts` | +`home.unknown` (R3_HOME), +`deviceConnectivity.offline` (R10_PAIRING) | ✓ (`:57`, `:376`) |
| `legibility-classnames.test.ts` | +`[components/pet-hero-header.tsx, 1]`, `13 + 1 + 1` | ✓ (`:129`, `:139`) |
| `home/index.test.tsx:640-658` | `null` → `'Esperando señal'` | ✓ |
| `specs/mobile-ui-language/design.md` | 2 filas `← añadida por #73 (R5)` | ✓ (`:291`, `:685`) |

"Siguen verdes": `git diff origin/main...HEAD -- mobile-pet-tracker/src/__tests__ mobile-pet-tracker/src/providers/__tests__` toca **solo** los tres ficheros de arriba; `design-drift.test.ts`, `consistency-classnames.test.ts`, `hero-header-amendments.test.ts`, `map.test.tsx` intactos y verdes en `init.sh`. Ningún recuento absoluto nuevo.

### Contrato backend (R2/R4/E3)

- `specs/wialon-ingestion-pipeline/requirements.md:326-341`: bloque `## Enmienda #73 — la conectividad se deriva en lectura` literal, casilla `[X] … (firmada en \`0a76562b\`, 2026-09-12 — ver §Aprobación de \`specs/pet-online-pill/requirements.md\`)` ✓ (E3).
- `docs/data-model.md:53`: nota "`connectivity` está **obsoleta desde #73** …" literal ✓ (R4).
- `device-status.mapper.ts:3-8`: cabecera reescrita literal ✓ (R2). `workers/ingestion-store.ts:44-49`: docblock del puerto ✓.
- `pipeline/constants.ts:18-28`: comentario literal de E1 y `2 * 60_000`, tras `FUTURE_TS_TOLERANCE_MS` ✓.
- Tres llamadores pasan `now` (`pets.controller.ts:110`, `pet-device.controller.ts:43`, `devices.controller.ts:43`) ✓.

### R11 (gate humano)

`progress/impl_pet-online-pill.md` §R11: guion de 7 pasos + 6-bis con las enmiendas (paso 2 "dentro de los 2 min", paso 5 redactado como E1, 6-bis pulso + «Quitar animaciones»), dos sentencias SQL, códigos `ACT-00x`, tabla de 8 filas vacía. **No lo ejecuta el reviewer.**

---

## Hallazgos (ninguno bloqueante)

1. **Media** — `mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx:44-58` (mock de `Skeleton` de heroui-native → `View`) y `:71` (`default: { ...actual.default, View }`): dos parches de arnés que E2 **no** prescribe. Causa raíz: premisa de E2 falsa — el mock "calcado" de `weekly-activity-chart.test.tsx:58-66` no rinde `Skeleton` (ese componente no lo monta; `grep Skeleton weekly-activity-chart.tsx` → 0). Efecto: en el commit rojo `dcff4641` los 3 tests de skeleton de #67 (`R8: el hero sin mascota es un skeleton dimensionado`) cayeron con `Element type is invalid … got: undefined` (arnés, no aserción; son 3 de los 18 fallos); el verde `dfbb7190` los devolvió a verde **contra un `Skeleton` mockeado**. Sonda del reviewer (f): quitar el mock de `heroui-native` → 4 fallos con el mismo error; restaurado. Mitigantes: las aserciones de #67 (alto `PET_HERO_MEDIA_HEIGHT`, slot, caption sin texto, import de `Skeleton` por fuente) siguen intactas y significativas; el `Skeleton` real sigue montándose sin mock en la suite de Home (R9 it 3, `index.test.tsx:762-770`); Codex lo declaró en el impl §R8. Qué haría falta: nada para cerrar #73; recomiendo al leader anotar una errata en E2 (el mock de Reanimated en suites que rinden `Skeleton` de heroui necesita este parche) para la próxima feature que toque el hero.
2. **Baja** — `pet-hero-header.test.tsx:471`: `not.toMatch(/className=[^\n]*animate-pulse/)` en lugar del `not.toContain('animate-pulse')` de E2. La propia E2 exige un docblock con el texto "animate-pulse de Tailwind" (`pet-hero-header.tsx:33`), así que la aserción literal de la spec era imposible de cumplir; la regex conserva la intención (ninguna clase `animate-pulse`). Declarado en el impl §R8.
3. **Baja** — `STATUS.md` (+17 líneas, en `ea0a32a1`): fuera de `files_affected` de #73 y **omitido** en la lista `git diff --name-only` del impl §R10. No está vetado por R10 y el leader ya prevé recalcular `STATUS.md` desde `feature_list.json` al cerrar (aviso de #125 sobre la misma línea).
4. **Info** — skills: Codex cargó `expo:building-native-ui`, `appllama-app-design-skill` y `animate-expo` en lugar de `expo-overview` / `expo-native-ui` / `expo-animation` (impl §Línea base). No es motivo de rechazo.
5. **Info** — R4 nombra el R-id en el comentario de la aserción (`ingestion.e2e-spec.ts:218`), no en el título del `it`; es exactamente la forma que la spec firmada prescribe (R4 §Test).
6. **Info** — `progress/current.md` aparece modificado sin commitear en el worktree durante esta revisión (entrada del 2026-09-14 del leader); el reviewer no lo tocó.

---

## Veredicto

**APROBADO, pendiente del gate humano R11** (smoke en dev build de Android, tabla de `progress/impl_pet-online-pill.md` §R11). R1-R10 cumplen spec + E1-E3, C2-C8 verdes, `./init.sh` exit 0 por el reviewer, sondas a-e rojas por aserción y restauradas, trazabilidad completa, drift sin ficheros vetados. Hasta la firma humana de R11 la feature **no** pasa a `done`.
