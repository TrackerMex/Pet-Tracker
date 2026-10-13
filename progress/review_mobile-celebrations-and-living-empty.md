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
