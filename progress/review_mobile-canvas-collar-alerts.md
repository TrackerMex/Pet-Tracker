# review: mobile-canvas-collar-alerts (#203)
Fecha: 2026-10-24
Veredicto: APROBADO (segunda revisión, HEAD `515719ed`)
Bloqueantes: 0. B1 cerrado. Observaciones no bloqueantes: 5 (O1 a O4 de la primera revisión, siguen como deuda; O5 nueva).

Historial:
- Primera revisión, HEAD `0677e469`: RECHAZADO por B1. El texto queda intacto debajo, de «Primera revisión» hasta «HEAD revisado».
- Segunda revisión, HEAD `515719ed`: APROBADO. Ver «## Segunda revisión (2026-10-24)» al final.

# Primera revisión (2026-10-24, HEAD `0677e469`): RECHAZADO

## Gate
`init-203.log` es la corrida del leader sobre `0677e469`. El fichero nació a las 20:13:59 UTC y el commit de HEAD es de las 20:12:59 UTC, así que la corrida empezó después de HEAD. Termina en `exit=0` y «Todo verde».
- Backend unit: 187 suites y 1474 tests passed; el grupo adicional, 2 suites y 14 tests.
- Móvil: 150 suites, 5154 tests, 1 snapshot, 250.394 s.
- E2E: 30 suites passed y 3 skipped de 33; 468 tests passed y 8 skipped de 476.
- Lint y typecheck limpios. Los 46 `●` del log son todos `● Console`; ninguno es un fallo.

El reviewer no corrió `./init.sh` (lo prohíbe el encargo). El gate se apoya en ese log.

## Rojos verificados (C4)
Script `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/redcheck.sh`:
1. Pone `mobile-pet-tracker/src` en el estado del commit rojo.
2. Borra los ficheros que solo existen en HEAD. Uno es `components/confirm-dialog.tsx` de #202; sin borrarlo, contamina los inventarios con dos fallos ajenos.
3. Corre jest dirigido.
4. Restaura con `git checkout HEAD -- mobile-pet-tracker/src`.

`git diff` y `git diff --cached` quedaron en 0 tras cada lote. Logs: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev203-red-R<n>.log`.

| Rojo | Fallos / total | Coincide con el informe | ReferenceError / TypeError / Cannot find module / SyntaxError |
|---|---|---|---|
| R1 `01167214` | 4 / 32 | sí | 0 |
| R2 `f61299ab` | 19 / 223 | sí | 0 |
| R3 `d09c24c5` | 3 / 112 | sí | 0 |
| R4 `4f8eec63` | 17 / 268 | sí | 0 |
| R5 `581ef0bb` | 7 / 207 | sí | 0 |
| R6 `fddd70af` | 3 / 325 | sí | 0 |
| R7 `17917920` | 22 / 406 | sí | 0 |
| R8 `214e17fc` | 20 / 136 | sí | 0 |
| R9 `6ca3aba1` | 1 / 82 | sí | 0 |
| R10 `9060bebc` | 19 / 184 | sí | 0 |
| R11 `7df7f6bf` | 1 / 131 | sí | 0 |

R12 nace verde por diseño (`tasks.md` §R12): lee la producción de R2 a R11.

## Checklists C2-C8

### C2 — Estado coherente
- [x] Hay 0 features `in_progress` en `feature_list.json`, así que no hay dos a la vez. #203 sigue en `spec_ready`; ver O3.
- [x] `progress/current.md` está modificado y sin commitear. Declara el fallback a `implementer` (Sonnet) que exige CLAUDE.md §Excepciones (línea 8).

### C3 — Arquitectura
- N/A. La feature es solo UI móvil: no toca backend ni capas de dominio.

### C4 — TDD
- [x] Cada R1 a R12 tiene al menos un `it` que lo nombra. `git grep` de `'#203 R<n>` en `mobile-pet-tracker/src` da: R1 1, R2 7, R3 1, R4 3, R5 2, R6 2, R7 8, R8 4, R9 2, R10 2, R11 2, R12 2.
- [x] Separación de commits, por `git diff-tree` de cada commit de `18fd4693..497a8b5b`:
  - Los 12 commits `test(...)` (R1 a R12) solo tocan `*.test.*` o `__tests__/`; producción 0 en todos.
  - Los 11 commits `feat(...)` (R1 a R11) solo tocan producción; 0 tests. La única excepción es `88d75d24` (R6), que añade el bloque Enmienda #203 a `docs/ui-guidelines.md`. Lo prescriben `tasks.md` §R6 paso 2 y E1.
  - `497a8b5b` (docs) solo toca `traceability.md` y el informe.
- [x] El orden es rojo y luego verde en los 11 R con comportamiento, y los rojos fallan por aserción (tabla de arriba).
- [x] Mocks `virtual`: la feature añade 0 líneas `virtual: true`. En HEAD quedan 0, porque #207 retiró los 4 de la base.
- [ ] **Candados con la forma que fija la spec: no se cumple.** Tres tests no asertan el «className exacto» que la spec prescribe, y una mutación plantada sobrevive en cada uno. Detalle en B1.

### C5 — Trazabilidad
- [x] `traceability.md` tiene 12 filas, todas «cubierto»; `grep -c pendiente` da 0.
- [x] Los 23 hashes de la tabla están en `18fd4693..497a8b5b` y coinciden con su commit.
- [x] Los commits siguen `test|feat(#203 R<n>): <desc>`, la forma de scope que usa el repo.

### C6 — Spec aprobada
- [x] `requirements.md` está en `status: approved`. Están marcadas `- [x] Aprobado por humano (fecha: 2026-10-23)` (línea 675) y `- [x] Enmienda #203 a la carta ... aprobada por humano` (línea 679).
- [x] La firma delegada en el leader consta en la nota, y las erratas llegan a E5.
- [x] La spec y el canvas congelado (`specs/mobile-canvas-collar-alerts/canvas/*.dc.html`) no cambian en `18fd4693..497a8b5b`.

### C7 — Sin código huérfano
- [x] `HomeEntrance` ya no se importa en `alerts/index.tsx` ni en `alert-detail/index.tsx`, y sus dobles se borraron de los dos tests. Sigue en uso en otras 8 pantallas, así que el componente no queda huérfano.
- [x] `ALERT_ROW_ENTRANCE_LIMIT` desaparece del árbol.
- [x] En `pairing/index.tsx` ya no están `Alert` (sustituido por `BottomSheet`), `HeaderHeightContext` ni `useContext`.
- [x] `alerts-title-row` está retirado (D10).

### C8 — Carta de UI (`docs/ui-guidelines.md`)
- [x] En las líneas añadidas de los 5 ficheros de producción no hay hex, clases `[...]`, `StyleSheet.create`, `shadow-sm/md/lg/xl`, `shadowColor`, `elevation` ni `rgba`. El único acierto del grep es el array JS de `rise-delays.ts`, que es un falso positivo.
- [x] Los márgenes superiores salen de `useSafeAreaInsets` (`insets.top + 8`) en pairing, alerts y el detalle, y el inferior de pairing de `insets.bottom + 24`.
- [x] El labio rojo de los destructivos está cubierto por la Enmienda #203, firmada.
- [x] `rounded-card` y `rounded-22` en la tarjeta: ver O2. No bloquea.

### Merge de dev (`0677e469`)
- [x] `consistency-classnames.test.ts`, `src/app/__tests__/layout.test.tsx` y `src/app/_layout.tsx` dan una unión exacta: el md5 de las líneas ± ordenadas del delta de la feature es igual al de merge contra dev.
- [x] `chunky-cta-canvas-fidelity.test.ts`: la cuenta es 39, es decir 38 de la feature más 1 de dev. El mapa de radios tiene `geofence-editor` 4 (dev) y `pairing` 4 (feature).
- [x] `design-drift.test.ts`, `alerts-canvas-fidelity.test.ts` y `profile-canvas-fidelity.test.ts`: el hunk de merge contra dev es idéntico al delta de la feature. La única diferencia es el título concatenado, con los sufijos de #203 antes que el de #202. `outsideReminders(/rounded-22/)` da `['screens/pairing/index.tsx']`, `pairing` 4 en el mapa de radios, y las listas text-15 y text-26 contienen ambos lados.

### Canvas contra producción
Los literales del canvas son estos:
- `Alertas`: `rise 400ms ease-out` con 0, 70, 140, 200 y 260 ms.
- `padding: 56px 20px` en Vincular, VincularVinculado, VincularDesvincular, Alertas y DetalleAlerta.
- `VincularVinculado`: `font-size: 28px`, `border-radius: 22px`, `height: 54px` y `border-radius: 16px`.
- `Celebracion`: `font-size: 30px` y `max-width: 300px`.

Corresponden con producción:
- `ALERT_ROW_RISE_DELAYS = [0, 70, 140, 200, 260]`.
- `insets.top + 8` (40 + 8 = 48 con el inset de test) y `paddingHorizontal: 20`.
- `text-28`, `rounded-22`, `h-13.5` y `rounded-16`.
- `text-3xl` y `max-w-75`.

## Tabla de R-ids
| R | Test que lo nombra | Rojo | Verde | Mutación que lo pone en rojo | Zona ciega |
|---|---|---|---|---|---|
| R1 | `layout.test.tsx` › `#203 R1: %s oculta la cabecera nativa` | `01167214` | `b41a5118` | M25 | M26: el `contentStyle` del detalle lo caza #170 R9 |
| R2 | `pairing/index.test.tsx` › `#203 R2.1` a `R2.4` | `f61299ab` | `4ac62813` | M2 | M1 sobrevive (O1) |
| R3 | `#203 R3: %s entra con RiseIn %i` | `d09c24c5` | `c04fb181` | M3 | — |
| R4 | `#203 R4.1` a `R4.3` | `4f8eec63` | `8e18bfe8` | M4, M6, M7 | **M5 sobrevive (B1)** |
| R5 | `#203 R5` (dos `it`) | `581ef0bb` | `2fba8162` | M8 | — |
| R6 | `#203 R6: desvincular es 54, radio 16, labio rojo y va al fondo` | `fddd70af` | `88d75d24` | M9, M15 (R7.7) | **M10 sobrevive (B1)** |
| R7 | `#203 R7.1` a `R7.8` | `17917920` | `c4555d2c` | M11, M12, M13 | **M14 sobrevive (B1)** |
| R8 | `alerts/index.test.tsx` › `#203 R8` (cuatro `it`) | `214e17fc` | `177aed0f` | M17, M19 | M16 sobrevive (O1) |
| R9 | `#203 R9: envuelve e0 a e4 ...` | `6ca3aba1` | `bd6e49bb` | M18, M20 | — |
| R10 | `alert-detail/index.test.tsx` › `#203 R10` (dos `it`) | `9060bebc` | `c4ceb49b` | M22, M23 | M21 sobrevive (O1) |
| R11 | `#203 R11: la tarjeta entra en 0 y el mapa en 80 con RiseIn` | `7df7f6bf` | `662a4077` | M24 | — |
| R12 | `collar-alerts-canvas-fidelity.test.ts` › `#203 R12: %s` | `d580239e` (nace verde) | n/a | M19, M20, M27, M28, M29 | — |

## Mutaciones
Script `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/mut.py`:
1. Exige que el ancla aparezca exactamente una vez.
2. Planta la mutación y corre jest dirigido.
3. Revierte siempre con `git checkout HEAD -- <ruta>`.

Tras cada mutación, `git diff --stat` solo muestra el `progress/current.md` que ya estaba modificado.

Logs:
- Pairing: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev203-mut1-pairing.log`
- Alertas: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev203-mut2-alerts.log`
- Detalle: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev203-mut3-detail.log`
- Layout: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev203-mut4-layout.log`
- R12: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev203-mut5-r12.log`

| # | R | Mutación | Resultado |
|---|---|---|---|
| M1 | R2 (ciega) | `backFallback="/profile"` → `"/"` | **sobrevive** (496/496) |
| M2 | R2.4 | `insets.bottom + 24` → `+ 20` | rojo, 9 (`#203 R2.4` ×5, `#188 R10` ×2, `R11 mobile-device-pairing`, `R4 /pairing`) |
| M3 | R3 | `pairing-hero-rise` `delayMs` 0 → 40 | rojo, `#203 R3` |
| M4 | R4.1 | `device-title` sin `mt-2` | rojo, `#203 R4.1` |
| M5 | R4.2 (ciega) | `Card` `className` + `bg-default` | **sobrevive** (496/496) |
| M6 | R4.2 | `style={shadows.card}` → `undefined` | rojo, `#203 R4.2` |
| M7 | R4.3 | tonos de batería invertidos | rojo, `#203 R4.3` ×2 |
| M8 | R5 | punto `size-2` → `size-2.5` | rojo, `#203 R5` |
| M9 | R6 | `<View />` tras el espaciador | rojo, `#203 R6` |
| M10 | R6 (ciega) | `opacity-80` delante en `device-unpair` | **sobrevive** (347/347) |
| M11 | R7.3 | `closeUnpair` sin efecto | rojo, `#203 R7.3` ×2 |
| M12 | R7.4 a R7.6 | `finally` sin `setUnpairOpen(false)` | rojo, 7 (`R7.4` ×2, `R7.5` ×4, `R7.6`) |
| M13 | R7.2 | cuerpo `max-w-80` → `max-w-72` | rojo, `#203 R7.2` |
| M14 | R7.2 (ciega) | `opacity-80` delante en `pairing-unpair-confirm` | **sobrevive** (422/422) |
| M15 | R6 (ciega) | `device-unpair` sin `isDisabled={releasing}` | rojo, `#203 R7.7` |
| M16 | R8 (ciega) | `backFallback="/"` → `"/home"` | **sobrevive** (238/238) |
| M17 | R8 | insignia con `count >= 0` | rojo, 10 (`#203 R8` ×2, `#170 R4` ×8) |
| M18 | R9 | `index < 4` | rojo, `#203 R9` |
| M19 | R8, R12 | `paddingTop: insets.top + 12` en alertas | rojo, 3 (`#203 R8`, `#203 R12: margen superior`, `#78 R4`) |
| M20 | R9, R12 | `rise-delays` 70 → 75 | rojo, `#203 R9` y `#203 R12: retardos de Alertas` |
| M21 | R10 (ciega) | `backFallback="/alerts"` → `"/"` | **sobrevive** (144/144) |
| M22 | R10 | título `alerts.detailTitle` → `alerts.title` | rojo, 6 (`#203 R10` ×3, `#180 R1.2` ×3) |
| M23 | R10 | `insets.top + 12` en el detalle | rojo, 5 (`#203 R10`, `#203 R12`, `#180 R2.1` ×2, `#100 R3`) |
| M24 | R11 | tarjeta `delayMs` 0 → 40 | rojo, `#203 R11` |
| M25 | R1 | `pairing` `headerShown: true` | rojo, `#203 R1` |
| M26 | R1 (ciega) | detalle sin `contentStyle` | rojo, 3 (`#203 R1`, `#170 R9`, `#100 R2`) |
| M27 | R12 | celebración `text-3xl` → `text-2xl` | rojo, `#203 R12: Celebración título` |
| M28 | R12 | celebración `max-w-75` → `max-w-70` | rojo, `#203 R12: Celebración cuerpo` |
| M29 | R12 | `device-unpair` `chunkyLip.danger` → `neutral` | rojo, `#203 R12: labio rojo` |

## Bloqueantes

### B1 — R4.2, R6 y R7.2 no asertan el «className exacto» que prescribe la spec
La spec fija la forma de estos tres tests. Los tests usan comprobaciones parciales, y una clase añadida al nodo pasa en verde, aunque cambia lo que se pinta.

1. **R4.2.** `requirements.md` dice: «`'#203 R4.2: ...'` (className exacto y `style` que contiene `shadows.card` ...)». El test en `mobile-pet-tracker/src/screens/pairing/index.test.tsx:1542` hace:
   `expect(classes).toEqual(expect.arrayContaining(['rounded-22', 'px-4', 'py-4.5', 'shadow-none']));`
   - M5 añade `bg-default` al `className` de `device-status-card`. `twMerge` expulsa `bg-surface`, el fondo de la tarjeta cambia y los 496 tests de pairing más los candados pasan.
   - El nodo host recibe hoy la cadena determinista `rounded-card border border-border bg-surface p-4 rounded-22 px-4 py-4.5 shadow-none` (sonda `twm.cjs` del scratchpad).
2. **R6.** La spec dice «Test ... `'#203 R6: ...'`: className exacto ...». El test en `pairing/index.test.tsx:1647` solo compara el sufijo:
   `expect(classes.slice(-4)).toEqual(['h-13.5', 'w-full', 'rounded-16', 'bg-danger']);`
   - M10 antepone `opacity-80` a `device-unpair` y los 347 tests pasan.
   - Ningún candado de `src/__tests__` lee el `className` de `device-unpair`. `collar-alerts-canvas-fidelity` solo mira `style={chunkyLip.danger}` y `chunky-cta` no tiene fila para él.
3. **R7.2.** La spec dice «(orden de hijos, className exactos, ...)». El test en `pairing/index.test.tsx:1748` hace lo mismo con `pairing-unpair-confirm`:
   `.slice(-4)).toEqual(['w-full', 'h-13.5', 'rounded-16', 'bg-danger'])`
   - M14 antepone `opacity-80` y los 422 tests pasan.
   - `pairing-unpair-cancel` sí está candado exacto por la fila `NEUTRAL_ROWS` de `chunky-cta-canvas-fidelity.test.ts:77`; `confirm` no tiene equivalente.

Es factible asertar exacto un `Button` de HeroUI: el repo ya lo hace en `src/screens/profile/index.test.tsx:2018`, con `profile-sign-out` y `toBe('pressable-feedback__root button__root ...')` sobre la cadena host completa.

Para cerrar B1, los tres `it` deben fallar ante M5, M10 y M14. Hay que replantar las tres mutaciones, verlas en rojo, revertirlas y apuntarlo en `impl_mobile-canvas-collar-alerts.md`. El cambio es solo de tests, en un commit `test(#203 R4 R6 R7)`, y `traceability.md` debe reapuntar los hashes.

## Observaciones (no bloqueantes)
- **O1 — `backFallback` sin candado en R2, R8 y R10.** El texto de los tres R fija el literal (`"/profile"`, `"/"`, `"/alerts"`), pero ninguna de sus prescripciones de test lo pide, y el implementer siguió la prescripción. M1, M16 y M21 sobreviven. Es un hueco de la spec, no una desviación de la implementación. Lo dejo como deuda para el leader: un fallback erróneo solo se nota al entrar por enlace profundo sin historial.
- **O2 — `rounded-card` y `rounded-22` conviven en la tarjeta de R4.2.**
  - `twMerge` 3.6.0 no reconoce `rounded-22` como radio y conserva ambas clases.
  - Uniwind 1.11.0 recorre los tokens en orden en `resolveStyles` y, a igual complejidad, gana el último, así que el radio efectivo es 22 px. R4.2 y el canvas se cumplen.
  - `components/confirm-dialog.tsx` (#202) ya usa el mismo patrón con `rounded-hero`.
  - No bloquea. Queda registrado por si una actualización de Uniwind cambia el orden de resolución.
- **O3 — Estado.** #203 sigue en `spec_ready` en `feature_list.json` y `progress/current.md` está sin commitear. Los actualiza el leader al cierre.
- **O4 — R12 sin commit verde.** Lo prescribe `tasks.md` §R12 («nace verde»). El informe del implementer registra una mutación por fila; reproduje cinco (M19, M20, M27, M28, M29) y todas ponen R12 en rojo.

## HEAD revisado
`0677e469` (branch `feature/203-mobile-canvas-collar-alerts`, worktree `/home/claude/sites/Pet-Tracker-wt-203`).
- Rango de código: `18fd4693..497a8b5b`.
- Merge de `origin/dev` `a1f4a4cb`, con base de merge `8bd88522`.

Al terminar: `git diff --stat` muestra solo `progress/current.md`, que ya estaba modificado, y `git diff --cached --stat` está vacío.

# Segunda revisión (2026-10-24)
Veredicto: APROBADO. HEAD revisado: `515719ed`.

## Gate
- Log: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/init-203.log`, la corrida del leader sobre `515719ed`. El reviewer no corrió `./init.sh` (lo prohíbe el encargo).
- Termina en `exit=0` y «✅ Todo verde».
- Backend unit: 187 suites y 1474 tests passed. Infra: 2 suites y 14 tests.
- Móvil: 152 suites, 5251 tests y 1 snapshot, en 163.442 s.
- E2E: 30 suites passed y 3 skipped de 33; 468 tests passed y 8 skipped de 476.
- El log tiene 46 marcadores `●`, todos `● Console`; ninguno es un fallo.
- La corrida empezó después de HEAD:
  - `515719ed` se commiteó a las 23:02:04 UTC.
  - La primera marca horaria del log es el test Nest del backend a las 11:04:10 PM, con el sistema en UTC. La preceden install, harness, nest build y cdk synth, sin marca horaria.
  - El mtime del log es 23:10:56 UTC.
  - La fecha de nacimiento del fichero (20:13:59) no sirve: el fichero se reutilizó desde la primera corrida.
- El árbol de la corrida es el mergeado: 152 suites, y `515719ed` tiene 151 ficheros de test más 1 suite. `49732f36` tiene 149 ficheros y la corrida anterior dio 150 suites; solo el árbol del merge da 152.

## B1: cerrado
- `26843a00` `test(#203 R4 R6 R7)` toca solo `mobile-pet-tracker/src/screens/pairing/index.test.tsx` (3 inserciones, 8 borrados).
- Las tres cadenas son literales, no se calculan desde producción:
  - R4.2: `toBe('rounded-card border border-border bg-surface p-4 rounded-22 px-4 py-4.5 shadow-none')`
  - R6: `toBe('pressable-feedback__root button__root button__root--variant-primary button__root--size-md h-13.5 w-full rounded-16 bg-danger')`
  - R7.2: `toBe('pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full h-13.5 rounded-16 bg-danger')`
- El commit quita `arrayContaining`, `slice(-4)` y los `not.toContain` que sobraban.
- Las cadenas coinciden con la sonda `twm.cjs` de la primera revisión y con el patrón ya usado en `profile/index.test.tsx` (`profile-sign-out`).

### Mutaciones replantadas sobre `515719ed`
Cada mutación se aplicó con `mut.py` del scratchpad, que exige que el ancla aparezca una sola vez y revierte con `git checkout HEAD -- <ruta>`.

Jest dirigido, con `--runTestsByPath --runInBand --testTimeout=30000`:
- `pairing/index.test.tsx`;
- `collar-alerts-canvas-fidelity`, `pairing-canvas-fidelity`, `chunky-cta-canvas-fidelity`, `design-drift` y `consistency-classnames`.

Son 422 tests.

| Id | Nodo | Mutación | Resultado |
|---|---|---|---|
| M5b | `device-status-card` | añade `bg-default` | rojo, solo `#203 R4.2` (1/422) |
| M10b | `device-unpair` | antepone `opacity-80` | rojo, solo `#203 R6` |
| M14b | `pairing-unpair-confirm` | antepone `opacity-80` | rojo, solo `#203 R7.2` |
| M30 | `device-status-card` | quita `py-4.5` | rojo, solo `#203 R4.2` |
| M31 | `pairing-unpair-confirm` | quita `h-13.5` | rojo, solo `#203 R7.2` |

- Los cinco rojos son por aserción: diffs Expected/Received de `toBe`. `TypeError`, `ReferenceError`, `Cannot find module` y `SyntaxError` dan 0 en los logs.
- Logs:
  - `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev203b-mut1-b1.log` (M5b, M10b, M14b);
  - `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev203b-mut2-b1-quitar.log` (M30 y M31, las que quitan una clase).

## Trazabilidad
- `49732f36` `docs(#203)` toca solo `specs/mobile-canvas-collar-alerts/traceability.md` (3 líneas).
- Añade `26843a00` a la columna Verde de R4 (`8e18bfe8`), R6 (`88d75d24`) y R7 (`c4555d2c`), con la nota «B1: className exacto».
- `grep -c pendiente` da 0. La trazabilidad no tiene fila del smoke humano, así que no hay excepción que justificar.
- Detalle menor, no bloqueante: un hash de commit `test(...)` en la columna Verde es poco ortodoxo, pero la nota lo explica.

## Merge `515719ed`
- Padres: `49732f36` (feature) y `8a08a289` (`origin/dev`, con #206 y #196). Base de merge: `a1f4a4cb`.
- No toca `pairing`, `alerts`, `alert-detail`, `_layout.tsx` ni `celebration.tsx` de #203.

### Unión de los cuatro conflictos
- El delta de la feature (`a1f4a4cb..49732f36`) y el del merge frente a dev (`8a08a289..515719ed`) cubren los mismos 29 ficheros.
- Comparé, fichero a fichero, las líneas ± ordenadas de ambos deltas (md5). Hay 26 idénticos de 29.
- `chunky-cta-canvas-fidelity.test.ts` es idéntico: el merge aplica exactamente el delta de #203 sobre dev.
- `alerts-canvas-fidelity`, `design-drift` y `profile-canvas-fidelity` difieren solo en la línea de título concatenada de cada uno. El merge añade al final el sufijo de dev: `(enmendado por #196 R6)`, `(… #196 R5)` y `(… #196 R1)`. El orden queda #203, #202 y luego #196. Es unión, no pérdida.

### Cuentas del informe de merge
Comprobadas contra `8a08a289` y `515719ed`, todas «dev + delta de #203»:
- `neutralInventory`: 10 + 1 = 11 entradas.
- `count(/\brounded-16\b/)`: `26 + 1 + 1 + 1 + 2 + 2 + 1 + 1 + 1` = 36 en dev, `… + 2 + 1` = 39 en HEAD (R6 +1, R7 +2).
- `count(/border-lip-gray/)`: `10 + 1` = 11 en dev, `10 + 1 + 1` = 12 en HEAD (R7 +1).
- La línea `consumers` y el sufijo `(enmendado por #196 R4)` de R7.4 vienen de dev.
- El gate verde confirma que esas cifras casan con producción.

### Carta `docs/ui-guidelines.md`
- `grep -c '^## Enmienda #203'` da 1, en la línea 925.
- Lleva su casilla `- [X] Enmienda #203 aprobada por humano`, con la firma delegada citada.
- La Enmienda #206 va detrás, en la línea 940.
- `git diff 8a08a289 515719ed -- docs/ui-guidelines.md` muestra solo el bloque #203: 15 inserciones, 0 borrados.
- No contradice la #206:
  - #203 trata del labio de `device-unpair` y `pairing-unpair-confirm`.
  - #206 trata de los iconos SVG y la cápsula de `FloatingTabBar`.
  - Ninguna toca el objeto de la otra.

### Prosa de candado desfasada en `chunky-cta`: deuda, no bloquea
Hay tres títulos con prosa desfasada:
- R4.3, «nueve secundarios»: hay 11.
- R7.3, «veintisiete radios de dieciséis»: hay 39.
- R7.4, «diecisiete consumidores».

Ya estaban así, con el mismo texto, en la base de merge `a1f4a4cb` y en dev `8a08a289`. La deuda la arrastran #189, #191, #197, #200 y otras anteriores; #203 no la introdujo. Son solo títulos de `it`: las aserciones usan las cifras y los inventarios exactos, que cuadran. Se apunta como **O5**.

## O5 (nueva, no bloqueante)
- **O5 — Títulos con recuentos caducados en `chunky-cta-canvas-fidelity.test.ts`.** R4.3, R7.3 y R7.4 citan «nueve», «veintisiete» y «diecisiete», y las cifras reales hoy son 11, 39 y más de 17.
- Es preexistente y cosmético. Lo repara un `test:` sin cambio de aserciones.
- Para el leader: anclar los títulos por contenido, no por recuento (memoria «Constantes congeladas en specs»).

O1 a O4 de la primera revisión siguen como deuda. O3 sigue vigente: `feature_list.json` tiene #203 en `spec_ready`, sin ninguna `in_progress`.

## HEAD revisado
`515719ed` (branch `feature/203-mobile-canvas-collar-alerts`, worktree `/home/claude/sites/Pet-Tracker-wt-203`).
- Commits nuevos desde `0677e469`: `26843a00`, `49732f36` y el merge `515719ed`.

Al terminar, `git diff --stat` muestra solo `progress/current.md` y `progress/impl_mobile-canvas-collar-alerts.md`, ambos modificados a propósito antes de esta revisión. `git diff --cached --stat` está vacío.
