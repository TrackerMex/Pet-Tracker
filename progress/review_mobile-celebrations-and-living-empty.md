# review: mobile-celebrations-and-living-empty (#171)
Fecha: 2026-10-13 03:40 UTC
HEAD revisado: 9b825948 (branch feature/171-mobile-celebrations-and-living-empty). H0 del handoff: d01b03bf.
Veredicto: RECHAZADO

Hay dos motivos de rechazo:

1. **C5.** La columna de tests de `traceability.md` dice `pendiente` en R1–R15.
2. **C4.** Hay cláusulas prescritas de R6.3, R7.1, R10.3 y R5.1 que se pueden mutar con todos los tests en verde. Lo prueban las sondas S1–S5b, S10 y S12.

El código de producción cumple la spec en todo lo que he leído. Los rechazos son de trazabilidad y de candados que no miran.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `feature_list.json` tiene únicamente #171 en `in_progress`.
- [x] `progress/current.md` está actualizado: describe la sesión de #171 hasta las correcciones H0 tras la firma de E1.

## Checklist C3 — Arquitectura
- [x] Solo cambia la capa de presentación móvil:
  - un componente nuevo, `src/components/celebration.tsx`;
  - constantes nuevas en `src/theme/motion.ts`;
  - la paleta `CONFETTI_FILLS` en `src/utils/category-palette.ts`.
- [x] `add-pet` reutiliza `listPets` y `petKeys.list()`, la misma clave y la misma función que Vincular (R4.1).
- [x] `git diff --stat d01b03bf..HEAD` no toca `backend-pet-tracker/` ni `infra-pet-tracker/`.
- [x] No hay lógica de negocio fuera de su sitio.

## Checklist C4 — TDD
- [x] Cada R1–R15 tiene al menos un test que lo nombra (`#171 R<n>` en el describe o en el it).
- [x] El historial va test primero: cada par rojo → verde de traceability.md es ancestro de HEAD y está en orden.
  - c7.1 (`f65fc05d`) es una corrección mecánica de test entre el rojo y el verde de R6.
  - R13 es un commit único de candado (`a74fefca`). Por el camino (b), su evidencia de mutación está en S8, S9 y S9b: las tres en rojo.
- [ ] **Cada requisito queda probado por su test.** Falla en R6.3, R7.1, R10.3 y R5.1: ver observaciones 2–5.

## Checklist C5 — Trazabilidad
- [ ] **`traceability.md` sin filas «pendiente»: falla.** Ver observación 1.
- [x] Los commits siguen `test(mobile)/feat(mobile)/docs(mobile): <desc> (R-ids)`.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` está en `status: approved`.
- [x] Casillas marcadas:
  - gate humano (2026-10-12, firma 1b20491c);
  - enmienda de la carta (R15);
  - E1 (firma 82eda89f).
- [x] R16 sigue sin marcar, que es lo esperado porque es el smoke humano.
- [x] El último cambio a `requirements.md` es 82eda89f, anterior a H0. Las correcciones posteriores a H0 son de mecánica de test en tasks.md y en el handoff, sin cambiar requisitos.

## Checklist C7 — Sin código huérfano
- [x] El bloque en línea de `ready` de Vincular se sustituye por `<Celebration testID="pairing-ready">`.
  - El import de `Pressable` desaparece.
  - `DeviceRow` y `CONTINUOUS_CORNER` siguen en uso dentro de `pairing/index.tsx`.
- [x] Sus tests no se borran. Los de `ready-model`, `ready-esn`, el `—` de respaldo, `ready-map` y `ready-done` siguen vivos y verdes contra el componente nuevo.
- [x] Los inventarios de `consistency-classnames` bajan −1 donde `ready-map`/`ready-done` se mudan y suben +1 por la celebración, como dice R14.3.

## Checklist C8 — Carta UI (`docs/ui-guidelines.md`)
- [x] La sección «Enmienda #171 — confeti de celebración» es literal de design §8.
- [x] Su casilla `- [ ] Aprobada por humano (fecha: ____)` queda para el humano, y el candado R15 la acepta con `[ xX]`. R15.1 dice «solo si», así que la casilla sin marcar es compatible.
- [x] No hay hex, clases con corchetes, `StyleSheet` ni sombras. S9 y S9b lo comprueban.
- [x] El movimiento corre en el hilo de UI (`useSharedValue`/`useAnimatedStyle` con `.get()`/`.set()`) y solo anima `transform` y `opacity`, como asevera R13.2.
- [x] Con reduce motion, el confeti no se monta.
- [x] Hay un solo háptico de éxito por montaje y va con su cambio visual.

## Output de ./init.sh

Lo corrió el leader, no el reviewer, porque el clasificador se lo deniega a los subagentes. `/tmp/171-review-init.head` es `9b825948`, el HEAD revisado. Del log `/tmp/171-review-init.log`:

```
Test Suites: 99 passed, 99 total
Tests:       2856 passed, 2856 total          (móvil; cuadra con el cierre del handoff, 99/2856)
Test Suites: 3 skipped, 30 passed, 30 of 33 total
Tests:       8 skipped, 468 passed, 476 total  (e2e backend)
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

## Sondas de mutación

Cada sonda corrió como jest de un solo fichero desde `mobile-pet-tracker/` con `bunx jest --testTimeout=30000 --runTestsByPath <test>`, sobre 9b825948. Después se revirtió con `git checkout HEAD -- <fuente>` y se comprobaron `git diff --quiet` y `git diff --cached --quiet`: `limpio=0` en todas. Ninguna dio timeout ni «Test suite failed to run».

La línea base S0 es celebration + empty-state: 146/146 en verde.

| # | Req. | Mutación (fuente) | Test | Esperado | Observado |
|---|---|---|---|---|---|
| S1 | R6.3 T_i | `duration: MOTION_CONFETTI_MIN_MS` sin `+ (index * 137) % SPREAD` (celebration.tsx) | celebration.test.tsx | rojo | **verde 46/46: zona ciega** |
| S2 | R6.3 easing | quitar `...MOTION_CONFETTI_FALL_TIMING,` (celebration.tsx) | celebration.test.tsx | rojo | **verde 46/46: zona ciega**. eslint solo da un warning `no-unused-vars` con exit 0, así que init.sh también pasa |
| S3 | R6.3 opacidad | `interpolate(p, [0, 0.5, 1], …)` en vez de `[0, 0.1, 1]` | celebration.test.tsx | rojo | **verde 46/46: zona ciega** |
| S4 | R6.3 D_i | `(index * 53)` sin `% MOTION_CONFETTI_SPREAD_MS` | celebration.test.tsx | rojo | **verde 46/46: zona ciega** |
| S5 | R7.1 muelle | `pingoScale.set(withTiming(1, MOTION_FADE_TIMING))` en vez de `withSpring(1, MOTION_POP_SPRING)` | celebration.test.tsx | rojo | **verde 46/46: zona ciega** |
| S5b | R7.1/R7.2 rebote | `withSpring(1, { ...MOTION_POP_SPRING, dampingRatio: 1 })` en los dos | celebration.test.tsx | rojo | **verde 46/46: zona ciega** |
| S6 | R7.2 retardo | `badgeScale` sin `withDelay` | celebration.test.tsx | rojo (aserción) | rojo 1: `R7.3 la insignia sigue en reposo a los 300 ms` |
| S7 | R9.2 | dependencias del efecto háptico `[title]` | celebration.test.tsx | rojo (aserción) | rojo 1: `R9.2 rerenderizar con otro título no repite el háptico` |
| S8 | R13.2 (b) | import de `withRepeat` en celebration.tsx | design-drift.test.ts | rojo (aserción) | rojo 1: `#171 R13 › R13.2 …` |
| S9 | R13.1 (b) | `elevation: 2` en el estilo de la insignia | design-drift.test.ts | rojo (aserción) | rojo 1: `#171 R13 › R13.1 src/components/celebration.tsx …` |
| S9b | R13.1 (b) | `export const MOTION_PROBE_HEX = "#ff0000";` en motion.ts | design-drift.test.ts | rojo (aserción) | rojo 2: `#171 R13.1 src/theme/motion.ts` más el preexistente `#152 R9` |
| S10 | R10.3 | `withTiming(-MOTION_FLOAT_OFFSET_Y, { ...MOTION_FLOAT_TIMING, duration: 600 })` (empty-state.tsx) | empty-state.test.tsx | rojo | **verde 100/100: zona ciega** |
| S11 | R11.1 | con reduce motion, `offset.set(withTiming(-MOTION_FLOAT_OFFSET_Y, …))` | empty-state.test.tsx | rojo (aserción) | rojo 1: `#171 R11 › R11.1 conserva la posición a los 1200 y los 10000 ms` |
| S12 | R5.1 petName | `setCelebratePetName(input.name)` en vez de `result.pet.name` (add-pet/index.tsx) | add-pet/index.test.tsx | rojo | **verde 40/40: zona ciega** |
| S13 | R4.4 | `pets.data.pets.length <= 1` | add-pet/index.test.tsx | rojo (aserción) | rojo 3: `#171 R4.4` y dos preexistentes (R6, R7) cuya lista de fixture tiene una mascota |
| S14 | R3.4 | forzar `ready` en la rama de error del claim | pairing/index.test.tsx | rojo | no la repetí: es la S8.1 del handoff, medida por Codex sobre 2e7d60bd con 5 rojos (impl, §S8.1) |

## Observaciones

1. **C5: la columna de tests de `traceability.md` está sin rellenar.**
   - `specs/mobile-celebrations-and-living-empty/traceability.md`, filas R1–R15: la columna «Test (archivo::nombre)» dice `pendiente` en las quince.
   - El handoff (`progress/handoff_…md`, bloque de c29: «solo la columna de commits … No toques … la columna de tests») mandó a Codex no rellenarla, y nadie la rellenó después.
   - Solo R16, el smoke humano, puede quedar pendiente.
   - Referencia de formato: `specs/mobile-chunky-cta/traceability.md` (#166) usa `archivo::describe > it`.
   - Hay que rellenar cada fila con el fichero y el nombre de su test:
     - R1, R2, R6–R9, R12, R14 y R15 → `src/components/__tests__/celebration.test.tsx`;
     - R6 y R7 también → `src/theme/__tests__/motion.test.ts`;
     - R3 → `src/screens/pairing/index.test.tsx`;
     - R4 y R5 → `src/screens/add-pet/index.test.tsx`;
     - R10 y R11 → `src/components/__tests__/empty-state.test.tsx`;
     - R13 → `src/__tests__/design-drift.test.ts` y el R13.2 de celebration.test.tsx;
     - R14 también → `src/__tests__/consistency-classnames.test.ts`.

2. **R6.3: solo dos piezas muestreadas y solo por rangos.** S1–S4 quedan en verde: ningún test distingue las fórmulas que R6.3 prescribe.
   - Los únicos instantes intermedios que se miran son la pieza 0 a 1200 ms (solo `0 < opacity < 1`) y la pieza 22 en reposo a 1100 ms. R6.4 solo mira el final, a 5000 ms.
   - **T_i (S1):** con todas las duraciones en 2400 ms la pieza 0 no cambia (T_0 = 2400) y todas terminan antes de 5000 ms. Ningún test toca una pieza con T_i ≠ 2400 en vuelo, como la 17, que acaba a los 4430 ms según la propia R6.4.
   - **D_i (S4):** sin el módulo solo cambia la pieza 23 (1219 ms en vez de 19 ms), y ninguna aserción la muestrea antes de los 1219 ms.
   - **Easing (S2):** la curva de `MOTION_CONFETTI_FALL_TIMING` no se observa. `motion.test.ts` fija el valor de la constante, no su uso. Quitar el spread solo deja un warning de eslint, que init.sh no trata como error.
   - **Opacidad (S3):** `interpolate(p, [0, 0.1, 1], [0, 1, 0])` solo se comprueba como «entre 0 y 1». Cualquier curva con pico interior pasa.

3. **R7.1/R7.2: el muelle no se distingue de un `withTiming`.**
   - S5 cambia `withSpring(1, MOTION_POP_SPRING)` por `withTiming`, y S5b pone `dampingRatio: 1`. Las dos quedan en verde.
   - Los tests de R7 solo miran el estado inicial (0.6) y el final (1 a 2000/2400 ms).
   - El rebote que P5 justifica (pico de unos 1,065) nunca se muestrea, y `MOTION_POP_SPRING` solo se fija como valor en `motion.test.ts`.
   - Resultado: «anima la escala a 1 con `withSpring(1, MOTION_POP_SPRING)`» no está probado.

4. **R10.3: la duración del flotar no está candada (S10 en verde).**
   - `withRepeat` está doblado como identidad, y `translateY` solo se mira a 1200 ms, en el extremo (−4).
   - Cualquier duración ≤ 1200 ms deja −4 a los 1200 ms, así que «`withTiming(-MOTION_FLOAT_OFFSET_Y, MOTION_FLOAT_TIMING)`» no se distingue de otro timing.
   - `toHaveBeenCalledWith(expect.anything(), -1, true)` no mira el primer argumento.

5. **R5.1: el nombre sale de `result.pet.name`, pero el fixture no distingue la fuente (S12 en verde).**
   - `saveNala()` teclea `' Nala '`, el formulario lo recorta a `Nala` y el doble de `createPet` devuelve `name: 'Nala'`.
   - Celebrar con `input.name` da el mismo título y el mismo cuerpo.
   - Ningún test usa un `result.pet.name` distinto del nombre tecleado.

6. **Sin hallazgo, solo constancia:**
   - R16 queda pendiente del smoke humano en dev build de Android, como prevé la spec; no bloquea.
   - La casilla de la enmienda #171 en `docs/ui-guidelines.md` queda sin marcar a propósito para el humano.
   - Las sondas S6–S9b, S11 y S13 rojean donde deben, en el `it` correcto y por aserción.

## Ronda 2
Fecha: 2026-10-13 17:02 UTC (comprobaciones) – 17:11 UTC (sondas y veredicto)
HEAD revisado: 0da89d9e (branch feature/171-mobile-celebrations-and-living-empty). H1 del handoff de la ronda 2: d65a2140. El merge de origin/main (#167/#168/#169) no entra en esta ronda: es la ronda 3 con la Enmienda E3.
Veredicto: APROBADO

### Comprobaciones

1. **C4, test primero.** `git show --numstat` de los cuatro commits de test da solo líneas añadidas (columna de borradas a 0):
   - e090b609 (R6): `47 0` en celebration.test.tsx;
   - 58885e74 (R7): `37 0` en celebration.test.tsx;
   - 11c13470 (R10): `12 0` en empty-state.test.tsx;
   - 67fde1b5 (R5): `7 0` en add-pet/index.test.tsx.

   `git diff --stat d65a2140..0da89d9e` sobre `src/components/celebration.tsx`, `src/components/empty-state.tsx`, `src/theme/motion.ts` y `src/screens/add-pet/index.tsx` sale vacío: producción no cambia.
2. **Lista cerrada.** `git diff --name-only d65a2140..0da89d9e` da exactamente los cinco ficheros esperados: los tres tests, `progress/impl_mobile-celebrations-and-living-empty.md` y `specs/mobile-celebrations-and-living-empty/traceability.md`. Nada en `backend-pet-tracker/` ni en `infra/`.
3. **Los tests casan con la spec.** Comparé por script cada línea no vacía de los bloques `ts` de tasks.md §E2.1–E2.4 (93 líneas) con los tres ficheros:
   - las 93 están, literales;
   - no hay ninguna línea añadida que no salga de esos bloques.

   La tabla `CONFETTI_AT_1200` de tasks.md es idéntica, fila a fila, a la de requirements.md §Enmienda E2. También coinciden con R7.4 `POP_SAMPLES` y los instantes 50/100/150/200 y 450/500/550/600 ms, y con R10.4 los valores −0.579/−2/−3.421 a 300/600/900 ms. Las tolerancias son las de la spec:
   - `toBeCloseTo(…, 2)`, es decir ±0,005, para la opacidad, la escala y el translateY del flote;
   - `toBeCloseTo(…, 0)`, es decir ±0,5, para el translateY y los grados del confeti.

   Los nombres cubren R5.4, R6.5, R7.4 (×2) y R10.4. Los comentarios son `// #171 R6 (E2):` y `// #171 R7 (E2):`; `grep -cF '#171 E2'` da 0 en los tres ficheros.
4. **C5, trazabilidad.**
   - R1–R15 tienen columna de tests. Comprobé por script que cada nombre `archivo::describe > it` citado existe en su fichero: 0 ausentes.
   - En las filas R5, R6, R7 y R10, el word-diff confirma que solo se añadió al final de la celda de commits `; \`<hash> <mensaje>\` (E2, nace verde)`. La columna de tests no se tocó.
   - Los 36 hashes citados en traceability.md son ancestros de HEAD (`git merge-base --is-ancestor`) y su asunto coincide con el mensaje citado. Entre ellos están 67fde1b5, e090b609, 58885e74 y 11c13470.
   - R16 sigue `pendiente`, a la espera del smoke humano.
5. **Sondas:** las once rojean donde deben, por aserción. Ver la tabla y §Ejecución de las sondas.

### Checklist C2–C7 (ronda de solo tests)
- **C2** [x]
  - `feature_list.json` tiene solo #171 en `in_progress`.
  - `progress/current.md` describe la sesión activa de #171 (ver la observación 2).
- **C3** [x] Solo cambian tests de la capa de presentación móvil. No cambia producción ni ninguna otra capa.
- **C4** [x] Los cuatro commits `test(mobile): … (R<n>, E2)` solo añaden líneas. Son requisitos de verificación que nacen verdes, declarados por escrito en la Enmienda E2 antes del handoff (vía (b) de C4). Las once sondas de mutación de abajo los cierran: cada mutación rojea exactamente el `it` nombrado, por aserción.
- **C5** [x] Ninguna fila R1–R15 está «pendiente»; R16 es el smoke humano. Los commits siguen el formato `test(mobile): <desc> (R<n>, E2)`.
- **C6** [x]
  - requirements.md sigue en `status: approved` y tiene marcada `- [x] Enmienda E2 aprobada por humano (fecha: 2026-10-12)`, firmada en 5b7ab10a.
  - requirements.md no cambia después de la firma.
  - tasks.md solo cambia en d65a2140, en los dos comentarios (`#171 E2:` pasa a `#171 R6 (E2):` y `#171 R7 (E2):`). Es mecánica de test por `HEX_LITERAL`, sin valores ni requisitos nuevos.
- **C7** N/A: esta ronda no reemplaza nada.

### Output de ./init.sh
Lo corrió el leader sobre 0da89d9e (subagente sin permiso). Lo leí del log `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/955d966a-80a9-4f5e-a229-fd9e5ecf2412/scratchpad/init171-r2.log`:
```
Test Suites: 187 passed, 187 total
Tests:       1474 passed, 1474 total          (backend unit)
Test Suites: 99 passed, 99 total
Tests:       2861 passed, 2861 total          (móvil = 2856 de la ronda 1 + 5 its de E2)
Test Suites: 3 skipped, 30 passed, 30 of 33 total
Tests:       8 skipped, 468 passed, 476 total (e2e backend)
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
El aviso `A worker process has failed to exit gracefully` del ALL móvil ya existía antes de esta ronda y no la afecta.

### Sondas de mutación (ronda 2)

| Sonda | Mutación (`sed` del handoff) | Fuente | Test | Rojo esperado | Rojo observado | Veredicto |
|---|---|---|---|---|---|---|
| S1 | `duration: MOTION_CONFETTI_MIN_MS` | celebration.tsx | celebration.test.tsx | 1/49: R6.5 | `1 failed, 48 passed, 49 total`: R6.5. Expected 0.194, Received 0.1714 | rojo correcto |
| S2 | borrar `...MOTION_CONFETTI_FALL_TIMING,` | celebration.tsx | celebration.test.tsx | 1/49: R6.5 | `1 failed, 48 passed, 49 total`: R6.5. Expected 0.154, Received 0.5556 | rojo correcto |
| S3 | `[0, 0.5, 1]` | celebration.tsx | celebration.test.tsx | 1/49: R6.5 | `1 failed, 48 passed, 49 total`: R6.5. Expected 0.154, Received 0.2766 | rojo correcto |
| S4 | `index * 53` | celebration.tsx | celebration.test.tsx | 1/49: R6.5 | `1 failed, 48 passed, 49 total`: R6.5. Expected 0.275, Received 0 (la pieza aún no ha arrancado) | rojo correcto |
| S5 | `pingoScale.set(withTiming(1, MOTION_FADE_TIMING))` | celebration.tsx | celebration.test.tsx | 1/49: R7.4 Pingo | `1 failed, 48 passed, 49 total`: R7.4 Pingo. Expected 0.944, Received 0.8727 | rojo correcto |
| S5i | `badgeScale … withTiming(1, MOTION_FADE_TIMING)` | celebration.tsx | celebration.test.tsx | 1/49: R7.4 insignia | `1 failed, 48 passed, 49 total`: R7.4 insignia. Expected 0.944, Received 0.8727 | rojo correcto |
| S5b | `dampingRatio: 1` | motion.ts | celebration.test.tsx | 2/49: los dos R7.4 | `2 failed, 47 passed, 49 total`: R7.4 Pingo y R7.4 insignia. Expected 0.944, Received 0.7102 | rojo correcto |
| Sfade | `pingoOpacity … MOTION_FILL_TIMING` + import | celebration.tsx | celebration.test.tsx | 1/49: R7.4 Pingo | `1 failed, 48 passed, 49 total`: R7.4 Pingo. Expected 0.682, Received 0.0305 (numstat `2 2`) | rojo correcto |
| S10 | `{ ...MOTION_FLOAT_TIMING, duration: 600 }` | empty-state.tsx | empty-state.test.tsx | 1/101: R10.4 | `1 failed, 100 passed, 101 total`: R10.4. Expected −0.579, Received −2 | rojo correcto |
| S10c | `{ duration: 1200 }` | empty-state.tsx | empty-state.test.tsx | 1/101: R10.4 | `1 failed, 100 passed, 101 total`: R10.4. Expected −0.579, Received −0.5 | rojo correcto |
| S12 | `setCelebratePetName(input.name)` | add-pet/index.tsx | add-pet/index.test.tsx | 1/41: R5.4 | `1 failed, 40 passed, 41 total`: R5.4. Expected `"¡Kira ya está en casa!"`, Received `"¡Nala ya está en casa!"` | rojo correcto |

Cada sonda cumplió los tres controles del handoff:
- `mutada=0`: el numstat del fichero mutado es el esperado;
- `sonda=0`: la línea `Tests:` es exacta, la lista de `●` (sin `  ● Console`) es exactamente el `it` nombrado, y no hay `Unable to find|TypeError|ReferenceError|Test suite failed to run`. Es decir, rojo por aserción y no por excepción;
- `limpio=0` tras `git checkout HEAD -- <fichero>`.

Las salidas completas están en `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/955d966a-80a9-4f5e-a229-fd9e5ecf2412/scratchpad/r2-<sonda>.txt`.

### Ejecución de las sondas
- **Primer intento (17:02 UTC).** Antes de S1, `pgrep -fa 'node_modules/(\.bin/jest|jest-worker)|[i]nit\.sh'` encontró un `./init.sh` ajeno: pid 1471745, en `/home/claude/sites/Pet-Tracker-wt-170`. No lancé ningún jest y devolví «esperando carga ajena».
- **Reanudación.** El coordinador avisó de que la máquina estaba libre y él tenía el turno.
  - Corrí las once sondas una a una, con `jest --testTimeout=30000 -w 1 --runTestsByPath <fichero>` y el `pgrep` justo antes de cada una.
  - Durante S3–S5b apareció el jest del spike del leader, con cwd en `…/scratchpad/spike171m/mobile-pet-tracker`. Lo ignoré, como indicó el coordinador.
  - No apareció ningún `init.sh` ajeno ni ningún jest de otro worktree de `/home/claude/sites/*`.
- **Control `limpio` de S1.** La primera comprobación dio `limpio=1`, por un pathspec mal formado y no por la mutación:
  - el `':!progress/…'` relativo al cwd `mobile-pet-tracker/` no excluía este informe;
  - `git status --short` confirmó que solo este informe estaba modificado y que `src/components/celebration.tsx` estaba limpio.

  De S2 en adelante usé `git diff --cached --quiet && git diff --quiet HEAD -- ':(top)' ':(top,exclude)progress/review_mobile-celebrations-and-living-empty.md'`, que dio `limpio=0` tras cada reversión.
- **Estado final.** HEAD = 0da89d9e, índice vacío, y el único fichero modificado es este informe (sin commitear; lo commitea el leader).

### Observaciones (no bloqueantes)
1. **Historial del impl.**
   - a00b8706 reordenó secciones de la ronda 1 de `progress/impl_mobile-celebrations-and-living-empty.md`, y 0da89d9e las devolvió a su orden. Por eso `--numstat` da 3973/3713 y 3750/3740.
   - El efecto neto `d65a2140..0da89d9e` es solo un añadido: las 6349 primeras líneas son idénticas byte a byte a las de d65a2140, y se añaden 270 líneas de `## Ronda 2`.
   - El fichero final está bien. Solo el commit intermedio lo desordenó.
2. **`progress/current.md` no se actualiza desde d01b03bf** (el handoff de la ronda 1). No recoge:
   - el rechazo de la ronda 1;
   - la Enmienda E2 ni su firma (562c4650, 5b7ab10a);
   - el handoff de la ronda 2.

   Describe la sesión activa, así que C2 se cumple, pero está desfasado. Le toca al leader.

## Ronda 3
Fecha: 2026-10-13 22:20–22:55 UTC
HEAD revisado: 7eb051e2 (branch feature/171-mobile-celebrations-and-living-empty, sin push). H1 del handoff de la ronda 3: f0a9fe29. La Enmienda E3 se firmó en 34446b87. El merge de origin/main es 788d1f89 (#167, #168, #169, #170).
Veredicto: APROBADO

### Comprobaciones

1. **E3 implementada.**
   - `src/theme/motion.ts` declara, bajo `// #171 R7`, `MOTION_CELEBRATION_SPRING = { duration: 400, dampingRatio: 0.5, reduceMotion: ReduceMotion.System }`. El `MOTION_POP_SPRING` de #167 sigue intacto (`duration: MOTION_SURFACE_MS`, `dampingRatio: 0.6`).
   - `src/components/celebration.tsx` importa `MOTION_CELEBRATION_SPRING` y lo usa en sus dos `withSpring`. `grep -c MOTION_POP_SPRING` da 0.
   - Fuera de `motion.ts` y su test, el único uso de `MOTION_POP_SPRING` es `src/components/pop-in.tsx`, que es de #167.
   - En `motion.test.ts`:
     - `it('declara MOTION_CELEBRATION_SPRING')` tiene el valor 0.5 de E3;
     - `no exporta nada más` lista `MOTION_CELEBRATION_SPRING` y los tokens de #167;
     - `#167 R2: MOTION_POP_SPRING … 0.6` sigue vivo.
   - `specs/mobile-ui-language/design.md` va §2.23 → §2.24 (#167) → §2.25 (#169) → §2.26 (#170) → §2.27 (#171) → `## 3. La infraestructura`. Las cuatro filas de §2.27 son idénticas a las de la ronda 2. Frente a origin/main, design.md solo añade esas 9 líneas.
   - Las anclas de cierre A5 y A6 del handoff, medidas por mí, cuadran: `MOTION_POP_SPRING` sale motion.test.ts 4, motion.ts 1, celebration.tsx 0; `MOTION_CELEBRATION_SPRING` sale 3, 1 y 3.
   - Las anclas H1 y H2 también: §2.24 de #171 da 0, y §2.25–2.29 dan 3.
2. **C4, test primero en E3.** Tanto `git show --numstat` como los diffs confirman el orden rojo → verde:
   - 87b4fdf0 (R7, test, `3 3` en motion.test.ts) va antes de 3547a943 (R7, refactor, celebration.tsx `3 3` + motion.ts `1 1`);
   - 2cc05156 (R12, test, `2 2` en celebration.test.tsx) va antes de f5e50953 (R12, docs, design.md `1 1`).

   Reproduje los dos rojos yo mismo:
   - **c37.** Con motion.ts y motion.test.ts de 87b4fdf0 (par anterior al merge), sale `2 failed, 15 passed, 17 total`. Los dos `●` son `#152 R1 … › no exporta nada más` y `#171 R7 … › declara MOTION_CELEBRATION_SPRING`, la misma lista que registró Codex.
   - **c39.** celebration.test.tsx es igual en 2cc05156 y en HEAD. Con design.md de 2cc05156, sale `1 failed, 48 passed, 49 total`, con `●` `#171 R12 … › registra las cuatro claves en §2.27 de mobile-ui-language`.

   Restauré los dos con `git checkout HEAD --`; después, `diff --cached` y `diff` salen limpios.
3. **El merge 1647ce72.** Sus padres son f5e50953 y 788d1f89, con merge-base d2b8b0ae. Lo comprobé así:
   - **Sin cambios de más.** Ningún fichero difiere de origin/main salvo los que #171 cambió desde la base. Y ningún fichero difiere de f5e50953 salvo los que main cambió desde la base.
   - **Ficheros que tocan los dos lados.** Son 12. Cinco son idénticos a `git merge-file` (feature_list.json, ui-copy-table.ts, ui-language.test.ts, catalog.ts, welcome/index.test.tsx).
   - **Los siete conflictos** se resolvieron así, revisados uno a uno con `git show --cc`:
     - `motion.ts`, `motion.test.ts`, `design-drift.test.ts`, `docs/ui-guidelines.md` y `specs/mobile-ui-language/design.md`: unión de los dos lados. Lo único que cambia es la línea en blanco que los separa. Lo verifiqué comparando, por lado, el conjunto de líneas +/−.
     - `language-provider.test.tsx`: `+ 4 // #171 R12` junto a `+ 1 // #167 R5`, `+ 2 // #169 R9` y `+ 7 // #170 R1`.
     - `consistency-classnames.test.ts`: cada recuento es base + delta de main + delta de #171.
   - **Recuentos de consistency-classnames:**

     | Recuento | Valor resuelto |
     |---|---|
     | `directUses` | `… + 4 + 1 - 1` |
     | CONTINUOUS_CORNER | `31 + 1 + 4 + 1 - 1` |
     | `rounded-xl bg-accent` (main no lo tocó) | el de #171 |
     | `bg-accent-soft` y `accentSoftCount` | `16 + 2 + 1 - 1 - 1` |
     | `border-lip-gray` y `border-b-6` | `4 + 1 + 1` |

     Además, `food` pasa a 1 (#168). En `#166 R2` quedan las rutas `screens/login|register` de #167 y la fila `components/celebration.tsx` de #171.
   - **Nada de main se pierde.** Frente a 788d1f89, solo quitan líneas los ficheros que #171 ya cambiaba en la ronda 2, y lo que quitan es el diff de #171 desde la base.
   - **Nada de #171 se pierde.** Frente a f5e50953, solo quitan líneas los ficheros que main cambió.
   - **Lo que añade #171 sobre origin/main** sigue siendo el mismo conjunto de ficheros de la ronda 2.
4. **Lista cerrada.** `git log --first-parent --no-merges --name-only f0a9fe29..HEAD` da exactamente los siete ficheros del handoff:
   - celebration.test.tsx, celebration.tsx, motion.test.ts y motion.ts;
   - el impl;
   - traceability.md;
   - `specs/mobile-ui-language/design.md`.

   `git diff 1647ce72 HEAD` sobre `mobile-pet-tracker/`, `docs/` y `specs/mobile-ui-language/` sale vacío. Frente a origin/main no cambia nada en `backend-pet-tracker/` ni en `infra/`. El script del merge no cambia desde H1.
5. **C5, trazabilidad.**
   - Los 40 hashes citados en traceability.md son ancestros de HEAD, y su asunto coincide con el mensaje citado. Entre ellos están 87b4fdf0, 3547a943, 2cc05156 y f5e50953.
   - Los 30 nombres `archivo::describe > it` citados existen en su fichero: 0 ausentes.
   - El word-diff frente a a9b1a1a4 solo añade `; … (E3)` al final de la celda de commits de R7 y de R12.
   - R16 sigue `pendiente` (smoke humano), y su casilla en requirements.md sigue abierta (ancla H6 = 1).
6. **Spec.**
   - requirements.md sigue en `status: approved`, con `- [x] Enmienda E3 aprobada por humano (fecha: 2026-10-13)`, firmada en 34446b87 vía Notion.
   - `git diff 34446b87 HEAD -- specs/mobile-celebrations-and-living-empty/` solo toca traceability.md.

### Checklist C2–C8
- **C2** [x] `feature_list.json` tiene solo #171 en `in_progress`. `progress/current.md` describe la sesión de #171 y la decisión de E3 (ver la observación 2).
- **C3** [x] Solo cambian la capa de presentación móvil (un token de tema y su uso) y un spec de copy. Ninguna otra capa.
- **C4** [x] Cada requisito de E3 tiene su commit rojo antes del verde. Los dos rojos están reproducidos arriba, y los tests nombran su R-id (`#171 R7: …`, `#171 R12: …`).
- **C5** [x]
  - Ninguna fila R1–R15 está «pendiente»; R16 es el smoke humano.
  - Los commits de la ronda siguen `<tipo>(<scope>): <desc> (R<n>, E3)`. `refactor` y `docs` son tipos admitidos en `docs/conventions.md` y los prescribe el handoff.
- **C6** [x] La spec está aprobada, la casilla de E3 está marcada por el humano y requirements.md no cambia tras la firma.
- **C7** [x] E3 renombra el muelle de #171: ya no hay un `MOTION_POP_SPRING` de 0.5 ni su `it`. Solo queda el de #167, que es otro token con su propio test. Las menciones de `MOTION_POP_SPRING` en design.md, tasks.md y requirements.md de #171 son históricas («se llamaba»).
- **C8** [x] E3 no cambia la UI. Tras el merge, la enmienda `## Enmienda #171 — confeti de celebración` sigue en `docs/ui-guidelines.md`, detrás de las de #167 y #168. R15.1 admite enmiendas detrás o delante, y su casilla sigue como en la ronda 2. Los guards de la carta (consistency-classnames, design-drift, ui-language) pasan en el init.sh de HEAD.

### Output de ./init.sh
Lo corrió el leader sobre 7eb051e2; el subagente no tiene permiso para correrlo. Lo leí del log `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/955d966a-80a9-4f5e-a229-fd9e5ecf2412/scratchpad/r3-init-7eb051e2.log`.

Comprobé que corresponde a HEAD:
- el log nace a las 22:41:27 UTC, después del commit 7eb051e2 (22:37:30);
- el reflog no tiene ninguna entrada posterior;
- las rutas del log son `/home/claude/sites/Pet-Tracker-wt-171/…`;
- 0 líneas `❌` o `FAIL`.

```
Test Suites: 187 passed, 187 total
Tests:       1474 passed, 1474 total          (backend unit)
Test Suites: 104 passed, 104 total
Tests:       3187 passed, 3187 total          (móvil; igual al ALL de c41 de Codex)
Test Suites: 3 skipped, 30 passed, 30 of 33 total
Tests:       8 skipped, 468 passed, 476 total (e2e backend)
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
El aviso `A worker process has failed to exit gracefully` y las líneas ERROR de Nest ya existían antes de esta ronda.

### Sondas de mutación (ronda 3)

Base en HEAD: motion.test.ts + celebration.test.tsx dan `70 passed, 70 total`.

Corrí cada sonda con `jest --testTimeout=30000 -w 1 --runTestsByPath` y la revertí con `git checkout HEAD -- <fichero>`. Tras cada una, `git diff --cached --quiet && git diff --quiet HEAD` (excluyendo este informe) dio `limpio=0`. Ninguna salida contiene `Unable to find|TypeError|ReferenceError|Test suite failed to run`, así que todos los rojos son por aserción.

| Sonda | Requisito | Mutación | numstat | Tests | Rojo observado | Veredicto |
|---|---|---|---|---|---|---|
| P1 | E3 §1 / R7.1–R7.2 | celebration.tsx importa y usa `MOTION_POP_SPRING` (el 0.6 de #167) en vez de `MOTION_CELEBRATION_SPRING` | `3 3` | celebration | `2 failed, 47 passed, 49 total`: los dos `R7.4`. Expected 0.944, Received 0.8625 | rojo correcto |
| P2 | E3 §1–2 (nombre) | motion.ts exporta `MOTION_CELEBRATE_SPRING` | `1 1` | motion | `2 failed, 19 passed, 21 total`: `no exporta nada más` y `declara MOTION_CELEBRATION_SPRING` (Received undefined) | rojo correcto |
| P3 | E3 §4 (S5b) | `dampingRatio: 0.5` → `0.6` solo en `MOTION_CELEBRATION_SPRING` | `1 1` | motion + celebration | `3 failed, 67 passed, 70 total`: los dos `R7.4` y `declara MOTION_CELEBRATION_SPRING` | rojo correcto |
| P4 | E3 §3 / R12.3 (número) | `### §2.27 — … #171` → `### §2.26 — …`, que duplica la de #170 | `1 1` | celebration | `1 failed, 48 passed, 49 total`: `registra las cuatro claves en §2.27` | rojo correcto |
| P6 | merge: #167 R2 sobrevive | `dampingRatio: 0.6` → `0.5` en el `MOTION_POP_SPRING` de #167 | `1 1` | motion | `1 failed, 20 passed, 21 total`: `#167 R2: MOTION_POP_SPRING … 0.6` | rojo correcto |
| P5 | R12.3 (posición) | mover el bloque §2.27 entre §2.23 y §2.24 | `9 9` | celebration + language-provider | `77 passed, 77 total`, verde | zona ciega (ver la observación 1) |

Las salidas completas están en `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/955d966a-80a9-4f5e-a229-fd9e5ecf2412/scratchpad/r3rev-<sonda>.txt`, y los rojos de C4 en `r3rev-red-c37.txt` y `r3rev-red-c39.txt`.

Al empezar las sondas, `pgrep` vio un jest focalizado de `/home/claude/sites/Pet-Tracker-wt-172`. No había ningún `init.sh` ajeno, y ninguna sonda dio timeout.

### Observaciones (no bloqueantes)
1. **La posición de §2.27 frente a las §2.* posteriores a §2.23 no tiene candado.** El texto de E3 en R12.3 dice «Va después de §2.23 y de las secciones `§2.*` que la sigan». El `it` R12 solo asevera `> indexOf('### §2.23 ')` y `< indexOf('## 3. La infraestructura')`.
   - La sonda P5 sale verde con el bloque entre §2.23 y §2.24.
   - Implementer y handoff cumplen la spec: E3 «Qué cambia» punto 3, firmado por el humano, dice que «las dos aserciones de posición … no cambian».
   - El estado actual del fichero es correcto (§2.27 detrás de §2.26).
   - Es una brecha de la spec, no del trabajo de esta ronda. No bloquea porque el humano firmó el candado tal cual y afecta al orden de un documento, no al comportamiento. Si el leader quiere cerrarla, basta una aserción `indexOf(SECTION) > indexOf('### §2.26 ')` en una feature futura.
   - Los candados de §2.24 (#167) y §2.25 (#169) en language-provider.test.tsx usan `toContain`, sin posición. Es el mismo patrón de la casa.
2. **`progress/current.md` no se actualiza desde 0cb0a506** (redacción de E3). No recoge:
   - la firma 34446b87;
   - el handoff de la ronda 3 (f0a9fe29);
   - el fin de Codex ni el init.sh de 7eb051e2.

   Describe la sesión activa, así que C2 se cumple. Le toca al leader.
3. **R16 (smoke humano en dev build de Android) sigue pendiente,** con su casilla abierta. No bloquea este veredicto, pero sí el `done` (CLAUDE.md: requisitos que solo cierra un humano).

## Ronda 4
Fecha: 2026-10-14 20:45–21:30 UTC
HEAD revisado: f5e8cc68 (branch feature/171-mobile-celebrations-and-living-empty). H1 del handoff de la ronda 4: 0bfd45fd. Firma de E4: 0268e9bd. origin/main: 788d1f89.
Veredicto: APROBADO

### Comprobaciones
1. **Parches del leader intactos (OK).** `git patch-id --stable` de cada commit rojo o de carta coincide con el de su parche `progress/ronda4_mobile-celebrations-and-living-empty/cNN.patch`: c44 b92f7db0, c45 569db569, c47 03f02ec9, c49 f559feef, c51 b6a63f50, c53 289a5189, c55 8edfce08, c57 edc66e23, c59 0a605fbd, c61 ab15d95e, c62 f9298644, c63 fb89bd3f. Los commits verdes (c46 8316c80b, c48 2e6bb5e1, c50 7f31932c, c52 e71fe950, c54 c265cfda, c56 aada4b5e, c58 d9e96a60, c60 e8acaafe) solo tocan producción: celebration.tsx, motion.ts, global.css y category-palette.ts. Ninguno toca un test ni la carta.
2. **Lista cerrada (OK).** `0bfd45fd..a7f20923` toca exactamente los 14 ficheros del CIERRE del handoff. `a7f20923..HEAD` solo toca `progress/current.md`, `specs/.../tasks.md` (bba94dae, leader), `celebration.test.tsx` y el impl (f5e8cc68). El diff de f5e8cc68 en móvil son tres líneas: un comentario sin `#`, `jest.setTimeout(60_000);` y una línea en blanco, detrás del `jest.mock('heroui-native')`. No cambia ninguna aserción.
3. **C5, trazabilidad (OK).** Las 12 celdas `(E4)` (R2, R6, R7, R8, R12, R13, R15, R17–R21) citan el par del mapa del CIERRE. R12 c61 y R13 c44 nacen verdes. Los 57 hashes citados son ancestros de HEAD con el asunto citado. El diff de traceability.md solo cambia la última columna (12/12 líneas). `(E4)` cuenta 12 y `| pendiente |` cuenta 1 (R16).
4. **C4, test primero (OK).** Los nueve rojos (c45, c47, c49, c51, c53, c55, c57, c59, c62) van antes de su verde, y c44 y c61 nacen verdes como dice el handoff. Comparé por script la lista `●` que el impl registra en cada rojo con la que exige la cadena del handoff: c45 11/11, c47 16/16, c49 10/10, c51 6/6, c53 4/4, c55 6/6, c57 2/2, c59 1/1 y c62 1/1, idénticas. Los verdes salen a la primera salvo c56: el intento 1 dio dos `● Test suite failed to run` por un cierre JSX mal sustituido (`</Animated.View>` en el contenedor del confeti), corregido solo en producción y anotado en el impl. Las tres trampas de alcance mínimo se respetaron: el condicional del anillo y los valores iniciales de la entrada según reduce motion llegan en c58 (d9e96a60), y `cancelAnimation` en c60 (e8acaafe; antes, 0 apariciones).
5. **Producción contra E4.1–E4.14 (OK).** Leí `celebration.tsx` de HEAD entero y los diffs de `motion.ts`, `global.css` y `category-palette.ts`:
   - **E4.1 / R6.** La tabla `CONFETTI` es byte a byte la de E4.1. Cada pieza arranca en `{ position, top: 0, left: '<left>%', opacity: 0, transform: [{ translateY: -40 }, { rotate: '0deg' }] }` y anima con `withDelay(delay, withRepeat(withTiming(1, { ...MOTION_CONFETTI_FALL_TIMING, duration }), -1, false))`.
   - **E4.2.** Los cinco `--color-confetti-*` están en `@theme {` con los hex de la spec. `CONFETTI_FILLS` y su comentario salen de `category-palette.ts`. Fuera de los tests, solo `celebration.tsx` nombra `confetti-*` (y `global.css` los declara), y solo `celebration.tsx` usa `rounded-xs`.
   - **E4.3 / R7.** El pop de Pingo es `withTiming(1, 360)` en opacidad y `withSequence(1.08 en 360, 1 en 240)` en escala (`MOTION_CELEBRATION_POP_MS * 0.6` = 360). La insignia hace lo mismo con 300/200 dentro de `withDelay(MOTION_CELEBRATION_BADGE_DELAY_MS)`, en `right: 18, bottom: 26`.
   - **E4.4 / R17.** El anillo es el primer hijo del hero, con `absolute inset-0 rounded-full bg-accent`, `pointerEvents="none"` y oculto a accesibilidad. Escala 0.55→1.5 y opacidad 0.55→0 con `withRepeat(withTiming(..., EASE_OUT 2200), -1, false)`.
   - **E4.5 / R18.** `withDelay(MOTION_CELEBRATION_POP_MS, withRepeat(withTiming(-10, MOTION_PINGO_FLOAT_TIMING), -1, true))`.
   - **E4.6 / R19.** `useRise(k)` con `k` fijo (título 0, cuerpo 1, fichas 2 y acciones 3, también sin fichas), `withDelay(500 + 80k, withTiming(..., EASE_OUT 400))`. Título y cuerpo son `Animated.Text`, fichas y acciones `Animated.View`, sin envoltorios nuevos.
   - **E4.7 / R20.** Hero, Pingo, check SVG, título, cuerpo y raíz con las clases y los estilos exactos de la spec.
   - **E4.8 / R21.** La limpieza del efecto cancela anillo (escala y opacidad) y `translateY` de Pingo, y cada `ConfettiPiece` cancela su progreso: 3 + 36 = 39. Pops y entrada no se cancelan. Con reduce motion el efecto sale antes de registrar limpieza: 0 llamadas.
   - **E4.9 / R8.** Con reduce motion no se montan confeti ni anillo, Pingo no flota y la entrada arranca en opacidad 1 y `translateY` 0 desde el `useSharedValue` (el efecto de `useRise` sale sin `.set`). Pingo y la insignia conservan su fundido a escala 1 (ver la observación 1 sobre el retardo).
   - **E4.10.** Solo se anima `transform` y `opacity`. `grep` de `LayoutAnimation`, `entering=` y `exiting=` en `celebration.tsx` da 0.
   - **E4.11.** `motion.ts` borra `MOTION_CONFETTI_MIN_MS`, `MOTION_CONFETTI_SPREAD_MS` y `MOTION_CELEBRATION_SPRING`, y añade las once constantes literales de E4.11 bajo el `// #171 R7` existente, sin la línea `// Solo si #172 ...`.
   - **Restos y `#`.** `grep` de `CONFETTI_FILLS|CONFETTI_COUNT|MOTION_CONFETTI_MIN_MS|MOTION_CONFETTI_SPREAD_MS|MOTION_CELEBRATION_SPRING` en `mobile-pet-tracker/src` y `docs/` da 0. Ninguna línea de `celebration.tsx`, `motion.ts` ni del comentario de f5e8cc68 tiene un `#` fuera de `#NNN R<n>`.
6. **C8, la carta (OK).** fb89bd3f solo toca `docs/ui-guidelines.md`. El párrafo del punto 7 aparece una vez, justo tras «…no arrancan con reduce motion.» y con dos espacios de sangría. La sección `## Enmienda #171 — confeti, ping y flotación de la celebración` es, línea a línea, el bloque de E4.13 (comparado por script tras quitar la sangría de la spec). Sustituye a la anterior en la misma posición, detrás de la de #168, y solo hay una sección `## Enmienda #171`. Su casilla queda `- [x] Aprobada por humano (fecha: 2026-10-14)`, que es la fecha de la casilla de carta de E4. Las clases de producción pasan los guards de la carta (design-drift, legibility-classnames y consistency-classnames) en el init.sh de HEAD.
7. **Spec (OK).** `status: approved`, con `- [x] Enmienda E4 aprobada por humano (fecha: 2026-10-14)` y la casilla de carta de R15 marcadas, firmadas en 0268e9bd. Desde la firma, requirements.md no cambia. Solo cambian traceability.md (0bfd45fd del leader y b5e0ef84 de Codex) y tasks.md (bba94dae, nota del timeout).
8. **Duraciones de los tests (observación, OK).** Con la máquina libre y `--verbose`, sobre HEAD: R6.4 3022 ms, R6.5 2277, R6.6 14271, R17.3 3108 y R18.2 5791. Con el `celebration.tsx` del sim del leader (`scratchpad/sim4`) copiado encima, los mismos tests dan 2947, 1840, 14973, 3055 y 5526 ms. La diferencia es ruido. Los 8,5 s de R6.4 que midió Codex vienen de la carga de la máquina, no de trabajo evitable de su producción. El coste es lineal con el tiempo falso avanzado: unos 45 estilos animados por frame.

### Checklist C2–C8
- **C2** [x] `feature_list.json` tiene solo #171 en `in_progress`. `progress/current.md` describe la ronda 4, el rojo por timeout del init.sh sobre a7f20923 y el fallback al subagente `implementer` para `jest.setTimeout`, como exige CLAUDE.md §Excepciones.
- **C3** [x] Solo cambia la capa de presentación móvil: un componente, tokens de tema (`motion.ts`, `global.css`), la paleta (borrado) y la carta. Ni dominio, ni aplicación, ni backend.
- **C4** [x] Cada R-id de E4 tiene su rojo antes de su verde. Las nueve listas `●` del impl son idénticas a las del handoff, y los parches de test llegan intactos (patch-id). Todos los `it` nuevos o cambiados nombran su R-id (`#171 R6: …` a `#171 R21: …`, `#171 R15: …`, `#171 E4: …`).
- **C5** [x] Ninguna fila R1–R15 ni R17–R21 dice «pendiente». R16 es el smoke humano. Los commits siguen `<tipo>(mobile): <desc> (R<n>, E4)`.
- **C6** [x] La spec está aprobada y las dos casillas de E4 están marcadas por el humano. requirements.md no cambia tras la firma.
- **C7** [x] E4 sustituye el confeti de una pasada, el muelle de E3 y la paleta `CONFETTI_FILLS`. Sus símbolos (`CONFETTI_COUNT`, `COLORS`, `SHAPES`, `CONFETTI_FILLS`, `MOTION_CONFETTI_MIN_MS`, `MOTION_CONFETTI_SPREAD_MS`, `MOTION_CELEBRATION_SPRING`) y sus `it` (R6.4/R6.5 de E2, R7.3/R7.4 del muelle) ya no existen. `withSpring` sale de `celebration.tsx`.
- **C8** [x] Ver la comprobación 6.

### Output de ./init.sh
Lo corrió el leader sobre f5e8cc68; el subagente no tiene permiso para correrlo. Lo leí de `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/955d966a-80a9-4f5e-a229-fd9e5ecf2412/scratchpad/r4/init-r4b.log`, con grep sobre la copia sin ANSI `init-r4b.clean.log`.

Comprobé que corresponde a HEAD:
- el log se escribe a las 20:39:21 UTC, después del commit f5e8cc68 (20:32:34);
- el reflog no tiene ninguna entrada posterior a f5e8cc68;
- sus 23 rutas absolutas son `/home/claude/sites/Pet-Tracker-wt-171/…`;
- 0 líneas `❌` o `FAIL`.

```
Test Suites: 187 passed, 187 total
Tests:       1474 passed, 1474 total          (backend unit)
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total              (infra)
Test Suites: 104 passed, 104 total
Tests:       3210 passed, 3210 total          (móvil; igual al ALL de cierre del sim del leader)
Test Suites: 3 skipped, 30 passed, 30 of 33 total
Tests:       8 skipped, 468 passed, 476 total (e2e backend)
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
`PASS src/components/__tests__/celebration.test.tsx (62.088 s)`. El aviso `A worker process has failed to exit gracefully` ya existía antes de esta ronda.

Como referencia, `init-r4.log` sobre a7f20923 salía `2 failed, 3208 passed, 3210 total` con R6.6 y R18.2 por `Exceeded timeout of 5000 ms`, sin ningún rojo por aserción. f5e8cc68 lo corrige con `jest.setTimeout(60_000)` en el fichero.

### Sondas de mutación (ronda 4)

Base en HEAD: `celebration.test.tsx` da `66 passed, 66 total` (55,5 s).

Ninguna sonda repite P1–P12 de Codex ni las de §E4-C. Las corrí con `FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx`, a veces con `-t` cuando el rojo esperado vive en pocos `describe`. Antes de cada corrida, `pgrep -f 'node_modules/(\.bin/jest|jest-worker)|[i]nit\.sh'` salió vacío. Revertí cada sonda con `git checkout HEAD -- src/components/celebration.tsx`, y después `git diff --cached --quiet && git diff --quiet -- mobile-pet-tracker docs specs` dio `limpio=0`. Ninguna salida contiene `Unable to find|TypeError|ReferenceError|Test suite failed to run`, así que todos los rojos son por aserción.

| Sonda | Requisito | Mutación | numstat | Tests | Rojo observado | Veredicto |
|---|---|---|---|---|---|---|
| S2 | R21.1 | borrar `cancelAnimation(pingoTranslateY)` | `0 1` | fichero entero | `1 failed, 65 passed`: `R21.1`. Expected calls 39, Received 38 | rojo correcto |
| S10 | R21.1 («ni una más») | añadir `cancelAnimation(pingoScale)` tras el de `pingoTranslateY` | `1 0` | `-t R21` | `1 failed`: `R21.1`. Expected 39, Received 40 | rojo correcto |
| S3 | R17.3 (mitad de opacidad) | solo el `withRepeat` de `ringOpacity` con `reverse = true` | `1 1` | fichero entero | `1 failed, 65 passed`: `R17.3`. Expected > 0.3, Received 0.208 | rojo correcto |
| S4 | R6.5 (grados) | `rotate` de la pieza `p * 540` → `p * 360` | `1 1` | fichero entero | `1 failed, 65 passed`: `R6.5`. Expected 418.5, Received 278.98 | rojo correcto |
| S5 | R7.4 (insignia) | la opacidad de la insignia dura `MOTION_CELEBRATION_POP_MS * 0.6` (360) en vez de `BADGE_POP_MS * 0.6` (300) | `1 1` | `-t 'R7\|R13\|R8'` | `2 failed`: los dos `R7.4` de la insignia. Expected 0.4884, Received 0.4157 | rojo correcto |
| S7 | R18.2 | la flotación con `withRepeat(..., -1, false)` | `1 1` | `-t 'R18\|R7\|R13'` | `1 failed`: `R18.2`. Expected 0, Received -10 | rojo correcto |
| S8 | R8.5 (mitad de `translateY`) | `useSharedValue(MOTION_CELEBRATION_RISE_OFFSET_Y)` sin depender de reduce motion; la opacidad sí depende | `1 1` | `-t 'R8\|R19\|R13'` | `1 failed`: `R8.5`. Las cuatro filas dan `[1, 14]` contra `[1, 0]` | rojo correcto |
| S9 | R6.4 | el `withRepeat` del confeti con `reverse = true` | `1 1` | fichero entero | `1 failed, 65 passed`: `R6.4`. Expected < 400, Received 1253.8 (R6.6 sigue verde) | rojo correcto |
| S1 | R8.3 (retardo) | el fundido de la insignia con reduce motion vuelve a `withDelay(MOTION_SURFACE_MS, …)` (400, el de antes de E4) | `1 1` | `-t R8` | `8 passed`, verde | zona ciega (ver la observación 1) |
| S2b | R21.1 (qué se cancela) | `cancelAnimation(pingoTranslateY)` → `cancelAnimation(pingoScale)` | `1 1` | `-t 'R21\|R18'` | `3 passed`, verde | zona ciega (ver la observación 2) |
| S11 | R6.2 / R13.2 (claves de layout) | `position`, `top` y `left` salen del worklet de la pieza a un estilo estático: `style={[{ position: 'absolute', top: 0, left }, pieceStyle]}` | `1 2` | `-t 'R6\|R13'` | `7 passed`, verde | informativa (ver la observación 3) |

Las salidas completas están en `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/955d966a-80a9-4f5e-a229-fd9e5ecf2412/scratchpad/r4rev-<sonda>.txt`, y las de tiempos en `r4rev-time-head.txt` y `r4rev-time-sim.txt`.

### Observaciones (no bloqueantes)
1. **El retardo del fundido de la insignia con reduce motion pasó de 400 a 450 ms, y ningún test lo mira.**
   - En c50 (7f31932c), la rama de reduce motion cambió `withDelay(MOTION_SURFACE_MS, …)` por `withDelay(MOTION_CELEBRATION_BADGE_DELAY_MS, …)`. `design.md` §R7–R8 (líneas 267 y 319) aún dice `MOTION_SURFACE_MS` (400), y el sim del leader también usa 400.
   - No lo considero un incumplimiento. R8.3 dice «conserva su fundido retardado» sin fijar el número, E4.3 lleva el retardo de la insignia a 450 y el puntero E4 de `design.md` (línea 255) remite a E4.3–E4.9. El handoff de c50 solo pedía conservar los fundidos de R8.2 y R8.3.
   - La sonda S1 confirma que R8.3 solo muestrea a los 300 y 2400 ms, así que no distingue 400 de 450.
   - Si el leader quiere 400, falta un candado (por ejemplo, la opacidad a los 425 ms) y devolver la constante. Si quiere 450, basta con actualizar las líneas 267 y 319 de `design.md`.
2. **R21.1 cuenta llamadas pero no mira a quién cancelan.** La sonda S2b cancela `pingoScale` en vez de `pingoTranslateY`, sigue en 39 llamadas y sale verde. La producción es correcta (cancela `ringScale`, `ringOpacity`, `pingoTranslateY` y los 36 `progress`). La brecha está en el test: `mockCancelAnimation` recibe el shared value y podría compararse por identidad con su valor.
3. **Riesgo de rendimiento en dispositivo, para el smoke R16.**
   - Cada `ConfettiPiece` devuelve `position`, `top` y `left` constantes dentro del worklet.
   - En Reanimated 4.5.1, `styleUpdater` (`node_modules/react-native-reanimated/src/hook/useAnimatedStyle.ts`, rama sin animaciones inline) llama a `updateProps` con todo `newValues` siempre que `!shallowEqual(oldValues, newValues)`. El array de `transform` es nuevo en cada frame, así que cada frame reenvía también las tres claves de layout de 36 piezas, en bucle mientras la celebración está abierta. Con Fabric, las props de layout no van por la vía rápida de props de UI.
   - Viene de la ronda 1 (`design.md:238` y R6.2 prescriben ese estilo inicial). Con una sola pasada pesaba poco; con 36 bucles infinitos, el coste dura todo lo que la celebración esté abierta.
   - La sonda S11 muestra que sacarlas a un estilo estático, como ya hacen Pingo y la insignia, deja verdes R6 y R13: `getAnimatedStyle` ve el estilo combinado.
   - Que el smoke R16 vigile tirones del confeti en Android. Si aparecen, el arreglo cabe en una línea sin tocar tests.
4. **El timeout de 60 s tiene margen de algo más de 2× bajo carga.** Con la máquina libre, R6.6 tarda 14,3 s. En el init.sh, el fichero entero tardó 62 s. Si varios jest corren a la vez (memoria `jest-timeout-por-carga-entre-codex`), R6.6 puede acercarse al límite. Por ahora es solo una nota.
5. **c56 necesitó dos intentos.** El primero rompió el cierre JSX del contenedor del confeti (dos `● Test suite failed to run`). Codex lo corrigió solo en producción y lo anotó en el impl, como permite el handoff. No afecta a C4.
6. **R16 (smoke humano en dev build de Android) sigue pendiente,** con su casilla abierta. No bloquea este veredicto, pero sí el `done` (CLAUDE.md: requisitos que solo cierra un humano). El smoke debería cubrir también la observación 3.
