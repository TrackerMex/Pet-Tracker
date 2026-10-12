# review: mobile-tab-headers-canvas (#168)
Fecha: 2026-10-12
HEAD revisado: 53f0e8f9 (branch feature/168-mobile-tab-headers-canvas, worktree Pet-Tracker-wt-168). H0 = b082f6e5.
Veredicto: RECHAZADO — tres cláusulas de #168 con ramas sin candado (R5.1/R5.3: chip de peso ausente, edad no finita y «Sin esterilizar»; R4.3: posición de `photo-upload-error`). El código de producción hace lo correcto en las cuatro ramas; lo que falta son los candados, y la spec no los prescribía (O1, O2). R13 (humo humano) y las cuatro firmas de enmienda siguen abiertas, fuera del gate del reviewer.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `feature_list.json` da `[(168, 'mobile-tab-headers-canvas')]`.
- [x] `progress/current.md` describe la sesión de #168: firmas `a372efdc`, E1 `a2e684ee`, E2 `c8c6aee3` y el handoff a Codex.

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: la feature no toca backend. `git diff --stat b082f6e5 53f0e8f9 -- backend-pet-tracker/ infra-pet-tracker/` sale vacío.
- [x] Contratos en domain como interfaces puras: sin cambios.
- [x] application depende de interfaces: sin cambios.
- [x] infrastructure sin lógica de negocio: sin cambios.

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra:
  - R1: `#168 R1` en los tests de Salud, Perfil y Nutrición, y en `tab-headers-canvas.test.ts` (G).
  - R2-R3: `#168 R2`, `#168 R3: cada vacuna lleva su tile pastel` en `src/screens/health/index.test.tsx`.
  - R4-R7: `#168 R4: Perfil sustituye el hero por profile-pet-card`, `#168 R5: Perfil pinta chips pastel por dato`, `#168 R6: cada fila de navegación lleva su tile pastel` y `#168 R7` en `src/screens/profile/index.test.tsx`.
  - R8-R10: `#168 R8: food-plan-card pinta el anillo`, `#168 R9: el anillo dice el porcentaje acotado`, `#168 R10: el anillo transiciona con reduce motion` en `src/app/(tabs)/__tests__/food.test.tsx`.
  - R11: `#168 R11: las specs enmendadas por #168 llevan su bloque` en `src/__tests__/hero-header-amendments.test.ts`.
  - R12: los candados globales de `tab-headers-canvas.test.ts` (c25) y las filas de `consistency-classnames.test.ts` que cita `traceability.md`.
  - R13 es humana y no tiene test, como dice la spec.
- [x] El historial muestra test primero. Los 30 commits de Codex alternan `test` y `feat`/`docs`, con tres `test` de corrección antes del verde (c3b, c7b, c17b). Además de las mediciones de `progress/impl_mobile-tab-headers-canvas.md`, volví a correr cada rojo y su verde en mi worktree de scratchpad (fichero entero, `--runTestsByPath`):

  | Commit rojo | R | Rojo (fichero entero) | `●` con `#168` | Verde | Resultado |
  |---|---|---|---|---|---|
  | `c5618f43` | R1/R2 Salud | 18 failed / 71 | 15 | `1abc7950` | 71 passed |
  | `675c465e` (c3b, sobre c3 `2c01414a`) | R3 | 4 failed / 75 | 4 | `74447b19` | 75 passed |
  | `bb71dc3b` | R1 Perfil | 6 failed / 45 | 6 | `e65457de` | 45 passed |
  | `b550084e` (c7b, sobre c7 `ce060f18`) | R4 | 9 failed / 47 | 6 | `30db66c1` | 47 passed |
  | `11ef23d5` | R5 | 3 failed / 50 | 3 | `b6cfa1b5` | 50 passed |
  | `56e75042` | R6 | 5 failed / 54 | 4 | `72a3fe23` | 54 passed |
  | `d8c5c06b` | R7 | 5 failed / 59 | 5 | `90908a6f` | 59 passed |
  | `03064141` | R1 Nutrición | 7 failed / 69 | 6 | `6b371832` | 69 passed |
  | `e37b72a3` (c17b, sobre c17 `3abdfbc3`) | R8 | 7 failed / 72 | 7 | `963f29e1` | 72 passed |
  | `b054fd63` | R9 | 6 failed / 80 | 6 | `439da40f` | 80 passed |
  | `fa68d334` | R10 | 3 failed / 83 | 3 | `1e3669c9` | 83 passed |
  | `5d174a8c` | R11 | 3 failed / 6 | 3 | `2f5c294c` | 6 passed |

  Los rojos sin `#168` son `it` previos que `tasks.md` manda reescribir en el mismo commit de test, y todos aparecen en su tabla:
  - `#155 R4 … queda en el sitio del vacío que sustituye` (Salud y Comida);
  - `R5 (mobile-design-drift): aplica el safe area superior al contenido`;
  - `shows the hub and a loading state while pets are pending`;
  - `#87 R16 … deja cuenta, mascotas y detalle en sus claves canónicas`;
  - `R2: estructura Figma`;
  - `R7: cambiar foto … keeps the old photo…`;
  - `#41 R9 … pinta la fila de zonas seguras`.

  Mis cifras van por fichero entero. Las del impl suman suites vecinas en algunos tramos (por ejemplo, 6/138 en c3), así que no coinciden una a una, pero el sentido rojo-verde coincide en todos.

  - c25 `5d6be139` (G) nace verde a propósito: R12 y la parte global de R1 son candados de inventario. Codex anotó las sondas S1-S8, cada una en rojo, antes del commit.
  - La PARADA de c18 (44 rojos) se resolvió con c17b `e37b72a3`, que cambia el doble de `Circle` por una función. Es un commit `test` y va antes del verde `963f29e1`.

## Checklist C5 — Trazabilidad
- [x] `specs/mobile-tab-headers-canvas/traceability.md` no tiene filas «pendiente». R13 dice «no aplica» (humana).
- [x] Los 28 hashes que cita la tabla son ancestros de `53f0e8f9`.
- [x] Los commits siguen `test|feat|docs(mobile|harness|specs|mobile-tab-headers-canvas): <desc> (#168 Rn)`. Los commits de reanudación del leader solo tocan `progress/handoff_mobile-tab-headers-canvas.md`.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved`. Están marcadas con `[X]` la casilla de aprobación, B1-B4, la casilla de candados y las enmiendas E1 y E2.
- [x] `requirements.md`, `design.md` y `tasks.md` no cambian entre H0 y HEAD.
- [ ] Abiertas, como corresponde a esta fase:
  - la casilla de R13 (humo humano);
  - las cuatro líneas `- [ ] Enmienda #168 aprobada por humano`, en `specs/mobile-health-make-parity/requirements.md`, `specs/mobile-pet-hero-header/requirements.md`, `specs/mobile-kcal-consumed-bar/requirements.md` y `docs/ui-guidelines.md`.

  La spec dice que el leader no marca `done` sin ellas.

## Checklist C7 — Sin código huérfano
- [x] Lo reemplazado ya no está:
  - el import y el JSX de `PetHeroHeader` en `src/screens/health/index.tsx` y `src/screens/profile/index.tsx`;
  - el título `text-2xl` viejo de Salud;
  - `food-plan-track`, `food-plan-fill`, el tile `ForkKnife` y su import en `src/app/(tabs)/food.tsx`.
- [x] Los tests del hero en Salud y Perfil y los de la barra en Nutrición se reescribieron o retiraron según la tabla de `tasks.md`.
- `src/components/pet-hero-header.tsx` se queda: Inicio lo sigue usando (Regla N1). No es huérfano.

## Checklist C8 — Carta UI
- [x] Sin `StyleSheet`, sin clases con corchetes y sin `text-accent` suelto en las tres pantallas ni en sus tres tests.
- [x] 0 hex en el código de producción del diff. Los 5 hex de `src/screens/health/index.test.tsx` son anteriores a #168 y los permite E1.b; el diff no añade ninguno.
- [x] Sin `shadow`, `elevation` ni `boxShadow` nuevos.
- [x] Los colores pastel salen de `CATEGORY_SLOTS[slot].surface/ink`. Los iconos usan el token `category-<slot>-strong` vía `useThemeColors`. `CONTINUOUS_CORNER` y `TABULAR_NUMS` son las constantes compartidas.
- [x] El anillo usa un color estático (`'accent-foreground'` vía `useThemeColors`), nunca una variable CSS dentro de Reanimated. La transición lleva `ReduceMotion.System` (R10).
- [x] Sin dependencias nuevas: `package.json`, `bun.lock` y `app.json` no cambian (R12.4).

## Lista cerrada
`git diff --name-only b082f6e5 53f0e8f9` devuelve 16 rutas: las 15 de la lista cerrada de `progress/impl_mobile-tab-headers-canvas.md` más `progress/handoff_mobile-tab-headers-canvas.md`, que es del leader (12 commits de reanudación, ninguno toca otra ruta).
- Producción: `src/screens/health/index.tsx`, `src/screens/profile/index.tsx`, `src/app/(tabs)/food.tsx`.
- Tests: `src/screens/health/index.test.tsx`, `src/screens/profile/index.test.tsx`, `src/app/(tabs)/__tests__/food.test.tsx`, `src/__tests__/tab-headers-canvas.test.ts` (nuevo), `src/__tests__/hero-header-amendments.test.ts`, `src/__tests__/consistency-classnames.test.ts`.
- Documentos (R11): `docs/ui-guidelines.md`, `specs/mobile-health-make-parity/requirements.md`, `specs/mobile-pet-hero-header/requirements.md`, `specs/mobile-kcal-consumed-bar/requirements.md`.
- Harness: `specs/mobile-tab-headers-canvas/traceability.md`, `progress/impl_mobile-tab-headers-canvas.md`.

`git diff --quiet b082f6e5 53f0e8f9 -- <ruta>` da 0 para todas las rutas que R12.4 y R12.5 dejan fuera: `package.json`, `bun.lock`, `app.json`, `src/i18n/catalog.ts`, `src/__tests__/ui-copy-table.ts`, `src/components/pet-hero-header.tsx`, `src/components/pet-avatar.tsx` y `specs/mobile-ui-language/design.md`.

## Requisitos contra el código
- R1/R2 (Salud):
  - `health-title` es el primer hijo del `ScrollView` (`src/screens/health/index.tsx:96`).
  - `health-content` lleva `style={{ gap: 16 }}` (`:100`) y abre con `PetSwitcher` (`:101`).
  - El `contentContainerStyle` es `{ padding: 24, gap: 16, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 96 }` (`:89-94`).
- R3: los slots salen en `:182-186` (rose si vencida, amber si es `nextVaccine`, green en otro caso; `Clock`/`Check`). El tile (`:193-202`) cumple R3.2 y R3.6. La fila tiene dos hijos y la columna lleva `flex-1 gap-1`.
- R1/R4 (Perfil):
  - `profile-title` está en `src/screens/profile/index.tsx:196`.
  - `profile-hero-skeleton` lleva `h-52` (`:247`).
  - `profile-pet-card` va con `PetAvatar size={96}`, nombre y chips (`:266-271`).
  - Después vienen `change-photo` (`:273`) y `photo-upload-error` (`:284-288`), fuera de la tarjeta y en el orden actual.
- R5: `PetPills` (`:65-80`) aplica las cuatro condiciones de la tabla R5.1 con el hueco atado al dato y `key` igual al `testID`.
- R6: las cuatro filas de navegación llevan su tile pastel decorativo (`:313-396`).
- R7: `me-identity`, `me-avatar` y `me-identity-text` están en `:412-430`; las iniciales recortan y pasan a mayúsculas (`:125-127`).
- R1/R8 (Nutrición):
  - `food-title` está en `src/app/(tabs)/food.tsx:133`.
  - `food-plan-summary` agrupa `food-plan-progress` y la columna `flex-1 gap-1` (`:206-262`).
  - El `Svg` es de 104 y contiene la pista y el relleno con la receta exacta de R8.4 (`:218-231`).
  - `food-plan-percent` y `food-plan-consumed` llevan sus clases y `TABULAR_NUMS`.
- R9:
  - `strokeDashoffset = KCAL_RING_CIRCUMFERENCE * (1 - pct / 100)`, con `pct` acotado al llamar a `withTiming(Math.min(kcalPct, 100), …)` (`:79-85`).
  - La semántica accesible de #113 R3 sigue en `food-plan-progress` (`:210-216`). Solo cambia la indentación.
- R10: `KCAL_BAR_TIMING = { duration: 250, easing: Easing.bezier(0.77, 0, 0.175, 1), reduceMotion: ReduceMotion.System }` (`:31-35`).
- R11:
  - Los marcadores en prosa van en la línea siguiente al encabezado prescrito: `specs/mobile-health-make-parity/requirements.md:137`, `specs/mobile-pet-hero-header/requirements.md:286` y `specs/mobile-kcal-consumed-bar/requirements.md:144`.
  - El bloque y la Regla N1 se añaden al final de `docs/ui-guidelines.md`.
  - El diff de los cuatro documentos no tiene líneas `-` (R11.4).
- R12: los candados de inventario de `consistency-classnames.test.ts` se mueven con el comentario `// #168 R…` que prescribe la tabla R12.3/E1.c.
- R13: humana, abierta.

## Sondas propias
Todas en el worktree desprendido `<scratchpad>/rev168` sobre `53f0e8f9`, con `bunx jest --testTimeout=30000 --maxWorkers=2 --runTestsByPath <fichero> [-t '#168']`. Tras cada sonda, `git checkout HEAD -- <ficheros>` y `git diff --quiet` / `git diff --cached --quiet` = `00` (comprobado en todas). Bases: Salud 19 passed / 56 skipped, Perfil 24 / 35, Nutrición 24 / 59 con `-t '#168'`.

| Id | Mutación | Test | Resultado | Lectura |
|---|---|---|---|---|
| H1 | slot vencida `<` por `<=` | health `#168` | rojo: R3 `next` | frontera de R3.3 candada |
| H2 | todo lo no-rose pasa a `'amber'` | health `#168` | rojo: R3 `completed` y `future` | R3.5 candada |
| H3 | `Icon = slot === 'rose' ? Clock : Check` | health `#168` | rojo: R3 `next` | icono de R3.4 candado |
| H4 | `color` sin la rama amber | health `#168` | rojo: R3 `next` | color por slot candado |
| H5a / H5b | tile sin `accessibilityElementsHidden` / sin `importantForAccessibility` | health `#168` | rojo: los 4 `it` de R3 (cada una) | R3.6, las dos props |
| H6 | tile sin `CONTINUOUS_CORNER` | health `#168` | rojo: 4 | R3.2 |
| H7 | icono a 24 | health `#168` | rojo: 4 | R3.2 |
| H8 | `<View testID="probe-first" />` antes del título | health `#168` | rojo: 12 (6 R1 + 6 R2) | primer hijo candado |
| H9 | `health-content` con `gap: 12` | health `#168` | rojo: R2 métricas | R2 |
| H10 | columna `flex-1 gap-2` | health `#168` | rojo: 4 | R3.1 |
| H11 | `paddingTop` + 16 | health `#168` | rojo: R2 métricas | R2 |
| H12 | fila `flex-row items-center gap-3 gap-1` | health, consistency, G | rojo: 4 R3 (el `Card` fusiona a `gap-1`) | el `toContain` de la fila (`index.test.tsx:1075`) no es ciego: el `Card` antepone sus clases y el `twMerge` deja ver la mutación |
| P1 | huecos de sexo y esterilizado intercambiados | profile `#168` | rojo: R5 ordena | hueco atado al dato |
| **P2** | chip de peso siempre `` `${pet.currentWeightKg} kg` `` (pinta «null kg» sin peso) | profile entero + `(tabs)/__tests__/profile.test.tsx`, `ui-language`, G, `consistency-classnames`, `design-drift` | **verde**: 59 passed; 166 passed | **R5.3 sin candado para `currentWeightKg === null`** (O1) |
| **P3** | chip de edad siempre visible (sin `Number.isFinite`) | mismas suites | **verde**: 59; 166 | **R5.1/R5.3 sin candado para la edad ausente** (O1) |
| P4o | esterilizado siempre `t('profile.sterilized')` | profile entero; resto | profile entero verde (59); rojo solo por `#65 R18` / `#65 R7` (la clave deja de usarse) | lo mata un candado de catálogo, no uno de #168 |
| P4b | `sterilized` / `notSterilized` intercambiados | profile entero | rojo: `#168 R5 ordena` + `R2: estructura Figma` | rama `true` candada |
| **P4c** | `pet.sterilized !== undefined ? t('profile.sterilized') : t('profile.notSterilized')` (las dos claves siguen en uso) | profile entero + `ui-language` + `(tabs)/__tests__/profile.test.tsx` | **verde**: 90 passed | **rama «Sin esterilizar» sin candado** (O1) |
| P6 | iniciales sin `trim` | profile `#168` | rojo: « ana »/«» y «»/« » | R7 |
| P7 | iniciales sin `toUpperCase` | profile `#168` | rojo: 3 | R7 |
| P8 | `{true ? (` en la rama de iniciales | profile `#168` | rojo: «»/« » | R7 |
| P9 | `me-avatar` sin `accessibilityElementsHidden` | profile `#168` | rojo: 4 R7 | R7 |
| P10 | tile de documentos sin `accessibilityElementsHidden` | profile `#168` | rojo: R6 documents | R6 |
| P22 | tile de recordatorios sin `importantForAccessibility` | profile entero | rojo: R6 reminders | R6, la segunda prop |
| P11 | tile de geocercas violeta | profile `#168` | rojo: geofences | R6 |
| P20 | `MapIcon` violeta | profile `#168` | rojo: geofences | R6 |
| P12 | avatar a 80 | profile `#168` | rojo: R4 con foto y sin foto | R4.2/R4.6 |
| P14 | skeleton `h-80` | profile `#168` | rojo: R4 h-52 | R4.4 |
| P16 | `Card` sin `variant="secondary"` | profile `#168` | rojo: R4 ordena | R4.2 |
| P21 | `change-photo` dentro de la tarjeta | profile entero | rojo: 2 R4 | R4.3, rama `change-photo` |
| **P13** | bloque `{photoError ? … : null}` movido antes de `<Button testID="change-photo"` | profile entero; y `(tabs)/__tests__/profile.test.tsx`, `ui-language`, G, `consistency-classnames`, `design-drift` | **verde**: 59 passed; 166 passed | **R4.3 sin candado para la posición de `photo-upload-error`** (O2) |
| P18 | chips sin `justify-center` | profile `#168` | rojo: R5 centra | R5.1 |
| P19 | `ink` del chip fijado a blue | profile `#168` | rojo: 2 R5 | R5.2 |
| F1 | `withTiming(kcalPct, …)` sin `Math.min` | food `#168` | rojo: R10 acota + R9 150% | R9.2 |
| F2 | `reduceMotion: ReduceMotion.Never` | food `#168` | rojo: 2 R10 | R10, enum de la librería (no tautológico) |
| F3 | `strokeWidth: 12` extra en `useAnimatedProps` | food `#168` | rojo: R8 relleno + 8 R9 | «solo `strokeDashoffset`» candado |
| F4 | pista `strokeOpacity={0.3}` | food `#168` | rojo: R8 pista | R8.4 |
| F5 | `strokeLinecap="butt"` | food `#168` | rojo: R8 relleno | R8.4 |
| F6 | `rotate(90 52 52)` | food `#168` | rojo: R8 relleno | R8.4 |
| F7 | relleno con `stroke={accent}` | food `#168` | rojo: R8 relleno | R8.4 |
| F9 | `2 * Math.PI * 45` | food `#168` | rojo: 9 (R8, R9, R10) | desfases literales, no tautológicos |
| F10 | porcentaje `font-bold` | food `#168` | rojo: R8 clases | R8.5 |
| F11 | columna sin `flex-1` | food `#168` | rojo: R8 agrupa | R8.1 |
| F12 | `Svg width={100}` | food `#168` | rojo: R8 SVG de 104 | R8.4 |
| F13 | `size-24` | food `#168` | rojo: R8 ordena | R8.3 |
| F14 | pista `r={40}` | food `#168` | rojo: R8 pista | R8.4 |
| F16 | `duration: 300` | food `#168` | rojo: R10 transiciona | R10 |
| F18 | `food-plan-consumed` sin `TABULAR_NUMS` | food `#168` | rojo: R8 cifras tabulares | R8.5 |
| F8 | `accessible accessibilityRole="progressbar"` en `food-plan-ring` | food `#168` | verde: 24 | fuera de la spec: R8.3 no prescribe la accesibilidad del anillo (O4) |
| F17 | `now: Math.min(kcalPct, 100)` | food `#113\|#168` | verde: 37 | R9.3 con `kcalPct > 100` sin candado; viene de #113 (O3) |
| A1 | marcador de la Regla N1 sin «de #168» en `docs/ui-guidelines.md` | A | rojo: marcador en prosa | R11.2 |
| A1b | marcador B3 sin «#168» en `specs/mobile-kcal-consumed-bar/requirements.md` | A | rojo: marcador en prosa | R11.2 |
| A4 | encabezado del bloque cambiado («Salud y Perfil») en la carta | A | rojo: bloque literal | R11.2 |
| A2 | firma con `- [X]` en `specs/mobile-health-make-parity/requirements.md` | A | verde: 6 | firmar no pone rojo el candado |
| A3 | firma con `- [x]` minúscula | A | rojo: línea de firma | coherente con R11.3 («`[ ]` o `[X]`»); ver O5 |

Las sondas S1-S8 de Codex sobre G (c25) cubren el retorno de `PetHeroHeader` a las tres pantallas; no las repetí.

## Observaciones
1. **O1 (bloqueante). R5.1/R5.3: tres ramas de los chips sin candado.** El código es correcto (`src/screens/profile/index.tsx:69-71`), pero estas mutaciones pasan en verde contra el fichero entero y contra las suites vecinas:
   - **P2**: chip de peso siempre `` `${pet.currentWeightKg} kg` ``. Con `currentWeightKg: null`, un caso real del tipo `number | null`, pinta «null kg».
   - **P3**: chip de edad siempre visible. Quita la guarda `Number.isFinite`.
   - **P4c**: rama `false` de esterilizado. Pinta «Esterilizado» en lugar de «Sin esterilizar» y no la detecta ni el candado de catálogo, porque las dos claves siguen en uso.

   El `describe('#168 R5: Perfil pinta chips pastel por dato')` (`src/screens/profile/index.test.tsx:1144-1177`) solo usa las dos fixtures que prescribe el párrafo «Candados» de la spec (`specs/mobile-tab-headers-canvas/requirements.md:247`): la completa, con `sterilized: true`, `ageMonths: 26` y `currentWeightKg: 12.4`, y la de `sex` y `sterilized` a `null`. Codex cumplió lo prescrito: el hueco está en la spec.

   R5.3 («IF un dato falta») es universal sobre los cuatro datos, y R5.1 da dos textos para esterilizado. Cada rama necesita su `it`:
   - peso `null`: tres chips, sin `profile-pet-chip-weight`, con sexo, esterilizado y edad en sus huecos;
   - `ageMonths` no finito: sin `profile-pet-chip-age`, con el peso en violeta;
   - `sterilized: false`: chip verde con el literal ES «Sin esterilizar».
2. **O2 (bloqueante). R4.3: la posición de `photo-upload-error` no está candada.** R4.3 nombra los dos nodos («`change-photo` y `photo-upload-error` inmediatamente después de `profile-pet-card`, fuera de ella, en el orden actual»). El único `it`, `deja change-photo inmediatamente después de la tarjeta` (`src/screens/profile/index.test.tsx:1113-1119`), renderiza sin error de subida y solo mira `change-photo`. El `it` que provoca el error, `keeps the old photo and shows an error when upload fails` (`:612-627`), comprueba la visibilidad pero no el orden. La sonda **P13** pasa en verde (59 passed): mueve el bloque `{photoError ? (<Text testID="photo-upload-error" …>) : null}` de `src/screens/profile/index.tsx:284-288` delante de `<Button testID="change-photo"` (`:273`). Falta un candado con la subida fallida: tras la tarjeta, `change-photo` y después `photo-upload-error`, los dos fuera de `profile-pet-card`.
3. **O3 (no bloqueante, deuda heredada). R9.3, `now: kcalPct` sin acotar.** La sonda F17 acota `now` a 100 y pasa en verde (`-t '#113|#168'`, 37 passed). La tabla de `#113 R3` solo tiene filas con `now` 63 y 0 (`src/app/(tabs)/__tests__/food.test.tsx:1075-1076`), y los `it` de R9 no miran `accessibilityValue`. La línea `accessibilityValue={{ min: 0, max: 100, now: kcalPct }}` no cambia en el diff (solo se reindenta), y R9.3 prohíbe tocar los `it` de #113 R3. No la cuento como fallo de #168. La dejo anotada para que, si la enmienda de O1/O2 abre ronda, el leader decida si suma un `it` de #168 R9 con `kcalPct > 100`, y para que no aparezca como hallazgo nuevo en la siguiente revisión.
4. **O4 (no bloqueante, fuera de la spec).** F8 pasa en verde: añade `accessible accessibilityRole="progressbar"` a `food-plan-ring`. R8.3 no prescribe la accesibilidad del anillo (la semántica vive en `food-plan-progress`, R9.3), así que no hay cláusula incumplida. Queda registrada por la misma razón que O3.
5. **O5 (para el humano).** El candado de firma de R11 acepta `- [ ]` y `- [X]`, y la sonda A3 muestra que `- [x]` en minúscula lo pone rojo. Es lo que prescribe R11.3. Al firmar las cuatro líneas `Enmienda #168 aprobada por humano`, hay que usar `X` mayúscula.
6. **Pendiente humano, fuera del gate del reviewer:**
   - R13 (humo en dev build de Android);
   - las cuatro firmas de enmienda, en `specs/mobile-health-make-parity/requirements.md`, `specs/mobile-pet-hero-header/requirements.md`, `specs/mobile-kcal-consumed-bar/requirements.md` y `docs/ui-guidelines.md`.
7. **Barrido.** Las sondas recorren cada cláusula universal de R3 (tres ramas de slot, icono, color y las dos props decorativas), R5, R6 (las cuatro filas y las dos props), R7, R8.4 (cada atributo de los dos círculos), R9, R10 y R11 (marcador, bloque y firma). Fuera de O1-O4 no queda ninguna mutación en verde.
8. Worktree de scratchpad: `<scratchpad>/rev168` ya está borrado (`git worktree remove --force`, rc=0, ya no sale en `git worktree list`). No ejecuté sondas ni checkouts en `Pet-Tracker-wt-168`, y el único cambio que dejo ahí es este fichero, sin commitear.

## Output de ./init.sh
Lo corrió el leader sobre `53f0e8f9` (`review168/head` = `53f0e8f99211548e2e7d87952220843833710b39`, `review168/exit` = `exit=0`), sin pipe. Las líneas decisivas de `review168/init.log`:
```
14:    ⚠️  .env desactualizado: faltan 6 claves de .env.example
42:    ⚠️  Feature en progreso: mobile-tab-headers-canvas
58:    ✅ Build exitoso
219:   Test Suites: 187 passed, 187 total
220:   Tests:       1474 passed, 1474 total          (backend unit)
232:   Test Suites: 2 passed, 2 total
233:   Tests:       14 passed, 14 total              (infra)
458:   # pass 28 / # fail 0
507:   # pass 5  / # fail 0
655:   # pass 15 / # fail 0                          (harness node tests)
37455: Test Suites: 99 passed, 99 total
37456: Tests:       2833 passed, 2833 total          (mobile; coincide con el ALL de la Reanudación 11)
37460: ✅ Tests pasados
37485: ✅ Esquema y recursos e2e listos
37777: Test Suites: 3 skipped, 30 passed, 30 of 33 total
37778: Tests:       8 skipped, 468 passed, 476 total  (backend e2e)
37782: ✅ Tests e2e pasados
37794: ✅ Lint sin errores                            (0 coincidencias de 'Failed to run|SIGKILL|Killed')
37798: ✅ Typecheck sin errores
37801: ✅ Todo verde. Listo para trabajar.
exit=0
```
El aviso de `.env` (claves de Anthropic y Resend) es del entorno y no afecta a #168. «A worker process has failed to exit gracefully» (37453) aparece antes del resumen verde de mobile y no cambia el exit.

## Barrido pre-firma de la Enmienda E3 (701d29d5)
Fecha: 2026-10-12. No es la re-review de cierre: no corrí `init.sh` ni la suite entera.

Lo medí en el spike desprendido `<scratchpad>/spike168e3b` (`dc5ed2e7`, la misma producción que `53f0e8f9`, con los 6 `it` de E3 insertados), desde `mobile-pet-tracker/`, con `bunx jest --testTimeout=30000 --maxWorkers=2 --runTestsByPath <fichero>` y un solo jest a la vez. Cada mutación se localiza por contenido. Después de cada una restauré con `git checkout HEAD -- <producción>`, y `git diff --quiet -- <producción>` y `git diff --cached --quiet` dieron `0 0` en todas. Bases: Perfil 64 passed, Comida 84 passed. «Vecinas» son `ui-language`, `tab-headers-canvas` (G), `(tabs)/__tests__/profile.test.tsx`, `design-drift` y `consistency-classnames`, con 166 passed. Repetí las siete sondas de la tabla de E3 y todas dan el rojo único que declara la spec, sobre el `it` previsto.

| Id | Alternativa | Cláusula | `it` que la tumba | ¿Medida? |
|---|---|---|---|---|
| P2 | peso sin guarda («null kg») | R5.3 peso | E3 `sin peso omite su chip…` | sí: 1 failed / 64 |
| P2t | peso por *truthiness* (omite 0) | R5.1 peso | E3 `con 0 meses y 0 kg…` | sí: 1 / 64 |
| — | peso con `!= null` o `typeof === 'number'` | R5.1 peso | ninguno; es equivalente dentro de `number \| null` | no (equivalente) |
| N6 | peso con `toFixed(1)` («0.0 kg», «12.0 kg») | R5.1 texto | E3 `con 0 meses y 0 kg…` + `R2: estructura Figma` | sí: 2 / 64 |
| P3 | edad sin guarda («NaN meses») | R5.3 edad | E3 `con la edad no finita…` | sí: 1 / 64 |
| P3t | edad por *truthiness* (omite 0) | R5.1 edad | E3 `con 0 meses y 0 kg…` | sí: 1 / 64 |
| — | edad con `!= null`, `typeof === 'number'` o `> 0` | R5.1 edad | E3 `no finita` (NaN pasa las dos primeras) o E3 `0 meses` (`> 0`) | no, por lectura |
| **N1** | **edad con `!Number.isNaN(pet.ageMonths)`**: `Infinity` y `-Infinity` pintan «Infinity meses» | **R5.1 (`Number.isFinite`) / R5.3** | **ninguno**: el `it` de E3 se titula «no finita», pero solo usa `NaN` | **sí: verde, 64 / 64; vecinas 166 / 166** |
| P4c | esterilizado `!== undefined` (false pinta «Esterilizado») | R5.1 texto | E3 `sin esterilizar…` | sí: 1 / 64 |
| N7 | esterilizado por *truthiness* (omite `false`) | R5.1 / R5.3 | E3 `sin esterilizar…` | sí: 1 / 64 |
| — | esterilizado con `== null` | R5.1 | ninguno; es equivalente dentro de `boolean \| null` | no (equivalente) |
| — | sexo por *truthiness* | R5.1 sexo | ninguno; es equivalente porque `PetSex` es `'male' \| 'female'` y `''` no existe | no (equivalente) |
| N8 | «Sin esterilizar» como literal ES en vez de `t()` | R5.1 texto ES/EN | `ui-language` `#65 R7` y `#65 R18` (3 rojos); Perfil sigue verde | sí: Perfil 64 / 64, `ui-language` 3 failed / 30 |
| **N2** | **la guarda de esterilizado lee `pet.sex`** (`text: pet.sex === null ? null : pet.sterilized ? …`). Con sexo presente y esterilizado `null` pinta «Sin esterilizar»; con sexo `null` y esterilizado `true` omite el chip | **R5.3** | **ninguno** | **sí: verde, 64 / 64; vecinas 166 / 166** |
| **N3** | **la guarda de sexo lee `pet.sterilized`** (`text: pet.sterilized === null ? null : pet.sex`). Con sexo presente y esterilizado `null` omite el chip de sexo | **R5.3** | **ninguno** | **sí: verde, 64 / 64; vecinas 166 / 166** |
| N5 | color por el índice de la lista filtrada | R5.3 (el hueco viaja con el dato) | `sin sexo ni esterilización…` (ya existía) + E3 `edad no finita` | sí: 2 / 64 |
| — | color por índice inverso | R5.3 | E3 `sin peso…` y E3 `edad no finita` (sexo azul) | no, por lectura |
| — | color por rama (verde solo con `true`) | R5.1 / R5.2 | E3 `sin esterilizar…` (asevera `bg-category-green` con `false`) | no, por lectura |
| — | orden de chips cambiado | R5.1 orden | `ordena los cuatro chips` + el orden de cada `it` de E3 | no, por lectura (P1 del review) |
| N4 | `key={pill.text}` en vez de `key={pill.testID}` | R5.1 `key` | ninguno; no es observable: React no expone `key` y dos textos solo coinciden con datos imposibles | sí: verde, 64 / 64. No la cuento |
| P13 | `photo-upload-error` delante de `change-photo` | R4.3 | E3 `con la subida fallida…` | sí: 1 / 64 |
| N10 | `photo-upload-error` como cuarto hijo de la tarjeta | R4.3 «fuera de ella» | E3 `con la subida fallida…` | sí: 1 / 64 |
| N11 | `photo-upload-error` envuelto en un `View` | R4.3 «inmediatamente después» | E3 `con la subida fallida…` | sí: 1 / 64 |
| — | un `View` que envuelve `change-photo` y el error | R4.3 | `deja change-photo inmediatamente después…` + E3 | no, por lectura |
| — | error tras `pet-info-card` | R4.3 | E3 (`index + 2`) | no, por lectura |
| F17 | `now: Math.min(kcalPct, 100)` | R9.3 | E3 `anuncia el valor sin acotar…` | sí: 1 failed / 84 |
| N13 | `now` sin redondear (62.676) | R9.3 | `#113 R3` fila 890/1420 | sí: 1 / 84 |
| — | `now` con `Math.floor` | R9.3 | `#113 R3` fila 890/1420 (62 frente a 63) | no, por lectura |
| N12 | `now` con `Math.ceil` en una expresión aparte de `kcalPct` | R9.3 | ninguno (las filas que miran `now` son 62.68, 0 y 150, y ahí `ceil` coincide con `round`) | sí: verde, 84 / 84. Plausibilidad baja |
| N14 | `now` aparte sin la guarda `merKcal > 0` (NaN con 0/0) | R9.3 | ninguno (la fila `merKcal 0` de R9 no mira `accessibilityValue`) | sí: verde, 84 / 84. Plausibilidad baja |
| — | `accessible`, `accessibilityRole` y `accessibilityLabel` | R9.3 | `#113 R3` (dos filas) | no, por lectura |

Lectura:
- **O1, O2 y O3 quedan cerradas.** P2, P3 y P4c (O1), P13 (O2) y F17 (O3) dan cada una un único rojo, en el `it` de E3 que declara la spec. P2t y P3t también. Los recuentos coinciden con la tabla de E3 y con el bloque O de `tasks.md` (60 → 64 en Perfil y 84 en Comida, acumulados).
- **N2 y N3 (R5.3) siguen sin candado.** Las fixtures de R5 nunca separan sexo y esterilizado: la de «sin sexo ni esterilización» los pone a `null` a la vez, y el resto lleva los dos presentes. Una guarda cruzada entre los dos datos pasa en verde contra Perfil y contra las vecinas. N2 además pinta un dato falso («Sin esterilizar» cuando no se sabe). Los casos son reales: `create-pet.dto.ts` deja `sex` y `sterilized` opcionales por separado. Faltan dos fixtures: sexo `null` con esterilizado presente, y esterilizado `null` con sexo presente. Cada una debe aseverar los tres chips restantes en sus huecos, igual que los `it` de E3.a. Los demás cruces (edad y peso con cualquier otro dato) ya los tumban las fixtures de E3, que anulan un solo dato cada vez.
- **N1 (R5.1) sigue sin candado.** La condición de presencia es `Number.isFinite`, y el `it` de E3 dice «no finita» pero solo prueba `NaN`. Hoy la API no puede mandar `Infinity`, igual que no puede mandar `NaN`. Aun así, la cláusula abarca `NaN`, `Infinity` y `-Infinity`, y `!Number.isNaN` pasa en verde.
- N4, N12 y N14 no los cuento. N4 no es observable. N12 y N14 exigen reescribir `now: kcalPct` como una expresión aparte, y R9.3 manda no tocar esa línea. Quedan anotados por si el leader quiere ensanchar E3.c a las filas 333/1000 y 0/0 de la tabla de R9.
- No toqué código ni tests de `Pet-Tracker-wt-168`. El único cambio es esta sección, sin commitear. El spike conserva los 6 `it` de E3; la producción está restaurada.

**Veredicto del barrido: E3 no cierra. Cierra O1-O3, pero faltan candados para R5.3 con sexo o esterilizado ausentes por separado (N2 y N3 verdes) y para la edad `±Infinity` de R5.1 (N1 verde).**

### Re-barrido (2cb3cd5c)
No volví a medir lo que ya midió el leader. Comprobé que los tres bloques `ts` de §Enmienda E3 están byte a byte en los dos ficheros de test del spike.

1. **Los bloques nuevos no abren ninguna alternativa en verde.**
   - Guardas cruzadas: cada fixture de R5 anula ahora un solo dato (peso; edad NaN/±Infinity; sexo; esterilizado), además de la completa y la doble. Con eso, cualquier guarda que lea el dato de otro chip, sola o combinada con la suya, omite un chip que la fixture espera, en los 12 pares posibles.
   - Texto de esterilizado decidido por otro dato: lo tumban `sin esterilizar…` y `sin sexo conserva…`.
   - Color por índice, directo o inverso: lo tumba `sin sexo conserva…` (antes ya lo hacían otros dos `it`).
   - Guardas de edad que coinciden con `Number.isFinite` en 26, 0, NaN y ±Infinity: `isFinite()` global, `Number.isInteger`, `Math.abs(x) < Infinity`. Solo difieren en edades fraccionarias o negativas, y el backend no las produce (`calculateAgeMonths` da un entero ≥ 0). Las cuento como equivalentes.
2. **Los recuentos acumulados de `tasks.md` §Bloque O cuadran.** La base es 59. Cada fila suma sus `it`: O1 60, O2 63, O3 64, O4 65, O5 66, O6 67, O7 68. Los conjuntos de rojos coinciden fila a fila con la tabla:
   - P3: 3 (las filas del `it.each`; la de 0 meses pinta «0 meses»).
   - N1: 2.
   - P3t: 3 en O4. NaN se omite por *truthiness*; caen las dos filas `±Infinity` y la de cero.
   - N2: 1 en O5 y 2 en O6.
   - N3: 1 en O6. Solo se planta ahí; en O5 nacería verde, porque `sin sexo…` anula el `text` del sexo de todas formas.
   - P2, P4c, P2t y P13: 1 cada una.
   - F17: 1 / 84.
   Con los 68 `it`, las cifras coinciden con la tabla de la spec.

**Veredicto del re-barrido: E3 cierra O1-O3 y N1-N3.**
