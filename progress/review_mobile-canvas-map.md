# review: mobile-canvas-map (#201)
Fecha: 2026-10-24
Veredicto: APROBADO
Bloqueantes: 0 — No bloqueantes: 8

Base revisada: worktree `/home/claude/sites/Pet-Tracker-wt-201`, branch
`feature/201-mobile-canvas-map`, HEAD `ba13cc36` (merge de `origin/dev` `8a08a289`
sobre `283b435e`). Rango de código: `b4924c5d..283b435e` (37 commits).

## Gate (./init.sh)

No lo corrió el reviewer, por mandato del leader. Se leyó el log del leader:
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/init-201.log`.

- **Momento de la corrida.** El log se creó a las 22:44:46 UTC del 2026-10-24, después
  del commit HEAD `ba13cc36` (22:43:39 UTC). Termina en `exit=0`.
- **Resultados:**

  | Área | Suites | Tests |
  |---|---|---|
  | backend | 187/187 | 1474/1474 |
  | infra | 2/2 | 14/14 |
  | mobile | 152/152 | 5295/5295, más 1 snapshot (178 s) |
  | e2e | 30 pasan, 3 se saltan (33) | 468 pasan, 8 se saltan (476) |

- Lint, typecheck y build en verde. Cierra con «Todo verde. Listo para trabajar.» y «Sin features en progreso».
- No hay ninguna línea `FAIL`. Las 46 líneas con `●` son salidas de Console.
- Dos avisos, los dos ya existían antes de esta feature: el de `.env` obsoleto y el de force-exit del worker de jest.

## Checklists C2–C8

### C2 — Estado coherente
- [x] 0 features `in_progress` en `feature_list.json`. #201 está en `spec_ready`, el estado que toca hasta que el leader la cierre.
- [x] `progress/current.md` lo modificó el leader a propósito y no se tocó. `git diff --stat` muestra solo ese fichero y `git diff --cached --stat` sale vacío.

### C3 — Arquitectura
- [x] Solo cambian ficheros de pantalla y de componentes móviles: `screens/map/index.tsx` y `components/pet-map.tsx`. No hay capas de backend afectadas.
- [x] `pet-map.tsx` añade la prop opcional `polylineWidth`, que solo se propaga cuando viene definida. No hay lógica de negocio nueva.

### C4 — TDD
- [x] **Ficheros por tipo de commit.** Los 37 commits del rango están revisados uno a uno:
  - cada `test(#201 …)` toca solo ficheros `*.test.ts(x)` o `__tests__/`;
  - cada `feat(#201)` toca solo producción;
  - los `docs` y `chore(spec)` tocan solo `specs/` y `progress/`.
- [x] **Historial rojo→verde por requisito**, de R15 y R1 a R13. Cada rojo va antes de su verde.
- [x] **Los rojos fallan por aserción.** Se corrieron todos los commits rojos en un snapshot (logs `rev201-red-<commit>.log`). Ninguno falla por `ReferenceError` ni por `TypeError`: fallan por `expect` o por «Unable to find».
- [x] **Cada R-id tiene un `it` que lo nombra.**
  - R1–R13, R15 y R16 tienen `it` con `#201 Rn` en MT y CF. R15 también está en PM ×3.
  - R14 tiene 0 `it` a propósito: la spec dice «R14 no cambia producción ni añade tests: no tiene commit rojo ni verde». La entrega es de `#198 R18` y sus seis `it` siguen en EH. El ancla `grep -cF '#201 R14'` en ES da 0, como pide la spec.
- [x] **R3 y R16 nacen verdes y protegen de verdad.** Se probó con mutación, ver la sección Mutaciones:
  - R3: M3a y M3b se ponen rojas;
  - R16: M16a–M16d se ponen rojas.
- [x] **Candados no tautológicos.**
  - MT no importa `CATEGORY_SLOTS`, `useShadows`, `STAT_DASH`, `CONTINUOUS_CORNER`, `homeEntering` ni nada de `theme/`.
  - El doble de `use-theme-colors` devuelve hex literales.
  - CF compara cuentas fijas tanto en el artboard como en producción.
- [x] **Sin mocks virtual nuevos.** Ningún `{ virtual: true }` en el rango.
- [x] **Los verdes dejan las suites en verde.** Los 13 commits verdes dejan las 11 suites tocadas en verde, de 757 a 836 tests (logs `rev201-green-<commit>.log`).

### C5 — Trazabilidad
- [x] `traceability.md` no tiene ninguna fila «pendiente». Las 16 filas dicen «implementado».
- [x] Los 33 hashes citados existen y caen todos en `b4924c5d..283b435e`.
- [x] Formato de los commits: `test(#201 Rn): …` y `feat(#201): Rn …`, el formato de la ola. La variante `test(#201): Rn` aparece en dos commits (ver O7).

### C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla `[x] Aprobado por humano (fecha: 2026-10-24)`, firmada por delegación en el leader.
- [x] Las erratas E1–E4 tienen sus commits de firma: E1 es `b4924c5d`, base del rango; E2 es `13c4712c`; E3 es `98d00838`; E4 es `80cc73e9`.
- [ ] Las casillas de smoke en dev build Android siguen abiertas. Son de cierre, no del gate de implementación, y las firma el humano.

### C7 — Sin código huérfano
- [x] `map-retry` y `map-last-retry` tienen 0 referencias en `src/`.
- [x] `map-no-tracking-body` sale de la plantilla `${testID}-body` de `EmptyState` y lo usan tests vivos.
- [x] La pose `collar` sigue en uso en `screens/geofences/index.tsx`, así que no es huérfana.
- [x] `Card` sigue en uso en `map-empty-overlay` (R9).

### C8 — Carta de UI
- [x] Ningún hex en los tres ficheros. Las tres coincidencias de `map/index.tsx` son los comentarios `// #201 R6`, `R7` y `R13`, que la exención `#NNN R<n>` cubre.
- [x] Ningún `StyleSheet.create`, ninguna sombra legacy (`shadow*` o `elevation`) y ninguna clase arbitraria `-[…]`.
- [x] Los `style={{…}}` en línea son solo los insets de `useSafeAreaInsets` (patrón previo) y el `marginRight: 8` del `actionIcon`, que es el mismo que el icono por defecto de `empty-state.tsx`.
- [x] La carga usa `Skeleton variant="pulse"` (11 bloques).
- [x] La entrada respeta `useReducedMotion`.
- [x] Se usan los tokens `CATEGORY_SLOTS.rose`, `shadows.floating`, `CONTINUOUS_CORNER` y `chunkyLip.primary`.
- [x] **Fidelidad al canvas.** CF (`src/__tests__/map-canvas-fidelity.test.ts`) compara cada literal del artboard (`specs/mobile-canvas-map/canvas/*.dc.html`) con su traducción en producción, con cuentas fijas. CF está verde en el gate y se pone rojo en M4, M10a, M10b, M11c, M12, M13a, M15a, M6b y M6c.

## Tabla de R-ids

Abreviaturas:
- **MT**: `screens/map/index.test.tsx`
- **CF**: `map-canvas-fidelity`
- **PM**: `pet-map.test.tsx`
- **EH**: `empty-state-hero.test.tsx`

| R | Rojo | Verde | Mutación que lo prueba | Resultado |
|---|---|---|---|---|
| R1 | `87f3198e`, `dea9ba0c` (E2) | `185cd67e` | M1 (ignora reduced motion); B1 (bottom 90, zona ciega) | rojo |
| R2 | `c5791111` | `28345d2d` | M2 (punto online); M2b (tono offline) | rojo |
| R3 | `3eefc27b` (nace verde) | — | M3a (nombre del detalle); M3b (avatar del detalle) | rojo |
| R4 | `f84fb5ff` | `c322db7b` | M4 (`shadows.card`) | rojo |
| R5 | `f3b9b4ba` | `75ac3bc7` | M5 (rótulo debajo) | rojo |
| R6 | `b205a365` | `74dd6786` | M6, M6b, M6c (guiones); M6d (batería nula) | rojo |
| R7 | `95b6e7aa` | `b13ac6bd` | M7 (color del triángulo) | rojo |
| R8 | `1bd49c3c` | `40600ea1` | M8 (error antes del botón) | rojo |
| R9 | `6993dd71` | `3b187687` | M9 (color del icono) | rojo |
| R10 | `b6b8dbd5`, `78954267` | `143bc01c` | M10a (shimmer); M10b (w-16, zona ciega) | rojo |
| R11 | `5b5e3724`, `3a39f70a` | `9687c788` | M11a (refetch equivocado); M11b (color del icono, zona ciega); M11c (`right-8`, zona ciega) | rojo |
| R12 | `f83f3a72` | `a0a539aa` | M12 (Plus 2.6) | rojo |
| R13 | `a86bcd4d`, `af59bbf1` (E4), `48caa133` | `d16f343e` | M13a (sin labio) | rojo |
| R14 | sin commits (por spec) | — | no aplica: lo entregó `#198 R18` y EH sigue verde | — |
| R15 | `08cbc116` | `6dcf8701` | M15a (ancho 4); M15b (`width` siempre) | rojo |
| R16 | `d19288c7` (nace verde) | — | M16a (hex), M16b (radio), M16c (séptimo icono), M16d (`text-accent`) | rojo |

Detalle por R:
- **R3**: los rojos son `#116 R3` y MT R3 ×2.
- **R13**: M13b (trazo del collar a `muted`, zona ciega) sobrevive: ver O3.

## Mutaciones

Todas se plantaron en el árbol, se corrieron con jest dirigido (`--runTestsByPath … --runInBand --testTimeout=30000`) y se revirtieron con `git checkout HEAD -- <ruta>`. En total, 34 mutaciones: 31 se ponen rojas y 3 sobreviven.

Logs de cada lote, en el scratchpad:
- `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev201-mut1.log`: M1–M5 (R1–R5). Las 6 se ponen rojas.
- `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev201-mut2.log`: M6–M10b (R6–R10). Las 6 se ponen rojas. M10b está en zona ciega.
- `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev201-mut3.log`: M11a–M15b (R11–R13 y R15).
  - Se ponen rojas 6 de 7. M11b está en zona ciega.
  - **M13b sobrevive** (864 verdes).
- `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev201-mut4.log`: M16a–M16d (R16), B1 y B2.
  - Se ponen rojas 5 de 6. M16d y B1 están en zona ciega.
  - **B2 sobrevive**.
- `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev201-mut5.log`: M6b, M6c, M6d, M2b, M11c y M7b.
  - Se ponen rojas 5 de 6. M11c está en zona ciega.
  - **M7b sobrevive**.

Cada corrida está completa en `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev201-mut-run-<id>.log`.

Las tres que sobreviven:
- **M13b.** `stroke={accentForeground}` del Svg del collar pasa a `muted` y nadie lo nota. La spec de R13 solo prescribe para MT «`strokeWidth` 2 y sus tres hijos», no el color del trazo. Es un hueco de la spec, no un incumplimiento del implementador. → O3.
- **B2.** Quitar `style={CONTINUOUS_CORNER}` del tile de batería no pone nada en rojo. En la base `b4924c5d` ya había 5 usos de `CONTINUOUS_CORNER` en el mapa y ninguno tenía candado. Es un hueco anterior a #201. → O4.
- **M7b.** Cambiar `variant="danger-soft"` por `secondary` no pone nada en rojo. Ese variant ya estaba en la base sin candado, y R7 no lo prescribe en sus `it`. Es un hueco anterior a #201. → O4.

## Bloqueantes

Ninguno.

## Observaciones

Las dos primeras responden a las notas del implementador; las demás son no bloqueantes.

- **D1 — `StyleSheet` en MT. Aceptable.** El import es nuevo en el rango, y su único uso es `StyleSheet.flatten(badge.props.style).boxShadow` (MT, línea 2714), que es justo lo que prescribe el `it` de R13. No hay `StyleSheet.create`. La errata E2 hablaba de las filas 29 y 30 (`toHaveStyle`), no de este import.

- **O1 — `48caa133`, sufijo tardío del título `#177 R7.2` de CC. No bloqueante.**
  - **Por qué no es enmienda mecánica.** La regla de enmienda mecánica (spec, línea 771) es para `it` **no inventariados**. `#177 R7.2` es la fila 21 del inventario, así que su sufijo es parte del rojo de R13 que la spec ya prescribe, no una enmienda mecánica.
  - **Por qué no bloquea.** El cuerpo de la fila (`'screens/map/index.tsx': 1`) ya estaba en el rojo `a86bcd4d`, y el commit solo cambia el título. El ancla de la línea 157 (`(enmendado por #201 R13)` = 6) solo cuadra con este commit, y en HEAD da 6.
  - **El fallo de forma.** El sufijo llegó después del verde `d16f343e`, cuando debía ir en el rojo `a86bcd4d`.

- **O2 — Números en letra obsoletos en CC. Deuda, no bloqueante.**
  - Los títulos de R7.4 dicen «dieciocho consumidores» y los de R12.1/R12.2 «diecinueve ficheros», pero tras el merge hay 23 ficheros reales.
  - Las aserciones son correctas: miden la lista real, no la palabra.
  - El desfase viene de dev, que sumó `profile` sin tocar el texto.
  - La spec aprobada de #201 ancla esos literales (líneas 158–161, fila 23). Cambiarlos ahora rompería las anclas.
  - Arreglarlo exige enmendar la spec: queda como deuda para una feature o errata posterior.

- **O3 — Hueco de la spec en R13 (M13b). No bloqueante.** Ningún candado mira el color de trazo del collar. Si se quiere cerrar, basta añadir a la prescripción de MT R13 `collar.props.stroke === '#FFFFFF'`, el `accent-foreground` del doble.

- **O4 — Huecos anteriores a #201 (B2 y M7b). No bloqueante.** Ni `CONTINUOUS_CORNER` en los tiles ni `variant="danger-soft"` del botón de modo perdido tenían candado en la base. No los introduce esta feature.

- **O5 — Rojos colaterales de R11, subcontados en el informe del implementador. No bloqueante.**
  - En `5b5e3724` hubo 24 rojos. Tres no inventariados caen por «Unable to find» y pasan aislados con `-t` (log `rev201-red-5b5e3724-iso.log`):
    - `R5: mascota free degrada sin mapa › shows the collar requirement…`;
    - `R6 › R8 (android-map-never-ready)…`;
    - `R6 › R3 (android-map-never-ready)…`.
  - Es contaminación entre `it` mientras el envoltorio hero aún no existe, y desaparece en el verde.
  - El informe del implementador detalla solo unos 20 de los 24.

- **O6 — `3a39f70a` fuera del inventario. No bloqueante.** El commit añade reduced motion a cuatro bloques de MT que no estaban inventariados. No cambia ninguna aserción, y la errata E3 (`98d00838`) lo validó después.

- **O7 — Formato de commits. No bloqueante.** Conviven `test(#201 Rn): …` y `test(#201): Rn …` (`08cbc116` y `87f3198e`), y los `feat` usan `feat(#201): Rn …`. Todo cae dentro del formato que acepta la ola.

- **O8 — Merge sin trailers. No bloqueante.** El merge `ba13cc36` usó el mensaje por defecto, sin los trailers de atribución.

Comprobación del merge `ba13cc36`:
- **Método.** Se comparó `git diff 8bd88522 283b435e` con `git diff 8a08a289 ba13cc36`, fichero a fichero, sobre los cuatro conflictos (`alerts-canvas-fidelity`, `chunky-cta-canvas-fidelity`, `design-drift`, `heroui-text-size-merge`) y sobre `consistency-classnames` y `legibility-classnames`.
- **Resultado: unión de los dos lados.** La delta de #201 queda aplicada exacta sobre dev:
  - sumas: R7.3 y `cardElements`;
  - inventarios: `radii`, `rounded-16`, `rounded-14`, `text-15` y CO `toHaveLength(16 + 1 + 1 + 1)`;
  - sufijos de título: los de dev en su orden y los de #201 al final.
- **Ficheros sin delta.** CO y LG coinciden sin diferencias. Dev no tocó ningún fichero de producción del mapa, ni `empty-state` ni `pet-map`.

## HEAD revisado
`ba13cc3653ac7b8926366511903eb5c8ea081b15`
