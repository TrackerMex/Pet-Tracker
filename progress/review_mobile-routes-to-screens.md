# review: mobile-routes-to-screens (#102)

Fecha: 2026-09-22
Worktree: `/home/claude/sites/Pet-Tracker-wt-ui`
Branch: `feature/102-mobile-routes-to-screens` · tip `2ae43ea5` · punto de partida `a3f9b602` · baseline `3a52028b`
Veredicto: **APROBADO**

Todo lo que sigue está **re-medido por el reviewer** en este worktree. No se dio
por buena ninguna cifra del reporte de Codex sin volver a tomarla (lección de
#94: su justificación de H1 resultó falsa al medirla el reviewer).

---

## Gate numérico — medido, sin pipe

```
cd /home/claude/sites/Pet-Tracker-wt-ui/mobile-pet-tracker
rm -f .expo/types/router.d.ts
bun run test > .../full-tip.txt; echo "JEST_EXIT=$?"   → JEST_EXIT=0
bunx tsc --noEmit > .../tsc-tip.txt; echo "TSC_EXIT=$?" → TSC_EXIT=0  (0 bytes)
```

```
Test Suites: 77 passed, 77 total
Tests:       1386 passed, 1386 total
Snapshots:   1 passed, 1 total
Time:        36.611 s
```

Ocurrencias de `FAIL` en la salida completa: **0**.

### Por suite (`--runTestsByPath`, rutas entre comillas simples, una llamada por suite)

| Suite | Esperado | Medido | Exit |
|---|---:|---:|---:|
| `src/screens/map/index.test.tsx` | 58 | **58** | 0 |
| `src/screens/health/index.test.tsx` | 28 | **28** | 0 |
| `src/screens/weight-log/index.test.tsx` | 32 | **32** | 0 |
| `src/screens/meal-schedule/index.test.tsx` | 23 | **23** | 0 |
| `src/app/(tabs)/__tests__/screens.test.tsx` | 2 | **2** | 0 |
| `src/__tests__/design-drift.test.ts` | 41 | **41** | 0 |
| `src/__tests__/consistency-classnames.test.ts` | 57 | **57** | 0 |
| `src/__tests__/legibility-classnames.test.ts` | 26 | **26** | 0 |
| `src/__tests__/ui-language.test.ts` | 25 | **25** | 0 |
| `src/__tests__/ui-copy-table.ts` | 2 | **2** | 0 |

Las diez imprimieron `Test Suites: 1 passed, 1 total`, así que ninguna ruta se
saltó en silencio (`jest-paths-con-parentesis`). **Ni un número se movió.**

---

## Los cuatro puntos de rotura del encargo

### 1. C4 — red→green de verdad: verificado commit a commit

Se hizo `git checkout` de cada commit rojo en este worktree y se corrió la suite
de candados y el body. El árbol quedó limpio y de vuelta en `2ae43ea5` al acabar.

| Ruta | Commit rojo | ¿Existe `src/app/(tabs)/<x>.tsx`? | Candados | Body |
|---|---|---|---|---|
| map | `b5562651` | **no** | `EXIT=1` — 4 suites rojas, **10** tests fallidos / 141 ok | `EXIT=0` — **58/58** |
| health | `95ee54fc` | **no** | `EXIT=1` — 4 suites rojas, **11** fallidos / 140 ok | `EXIT=0` — **28/28** |
| weight-log | `d0df4df2` | **no** | `EXIT=1` — 3 suites rojas, **9** fallidos / 142 ok | `EXIT=0` — **32/32** |
| meal-schedule | `1d16260d` | **no** | `EXIT=1` — 4 suites rojas, **9** fallidos / 142 ok | `EXIT=0` — **23/23** |

Coinciden exactamente con lo que declaró el reporte de Codex.

**El rojo es por la razón correcta.** Recuento de causas en las cuatro salidas:

- `ENOENT: no such file or directory, open '…/src/app/(tabs)/<x>.tsx'` →
  **9 / 11 / 9 / 9** ocurrencias, una por test fallido. Es `readFileSync` dentro
  de la aserción del propio candado sobre un fichero **de producción** que se
  movió — la vía (b) de C4 tal como la declaró la spec en §0.3 antes del handoff.
- `ReferenceError` → **0**. `Cannot find module` → **0**. `SyntaxError` → **0**.
  `TypeError` → **0**.
- Los tests que fallan se llaman literalmente por la ruta vieja, p. ej.
  `● #61 R4: el acento como tinta usa accent-strong › app/(tabs)/map.tsx pinta con text-accent-strong (2)`
  y `● #94 R10 › inventaría cada lectura de staleSeconds en producción`: es el
  drift para el que se escribieron.
- El body va **verde** en cada rojo, así que el fallo es atribuible candado a
  candado y no queda enmascarado por un fallo de resolución de módulo.

El historial es test-primero por ruta: el commit rojo contiene **solo** los dos
renames (+ el reporte y la trazabilidad); el verde repunta los candados y crea
el route delgado. Nada se metió "todo junto" (el fallo de #19).

### 2. `sourceFiles()` de `design-drift.test.ts:25-35` — intacto

- `cmp` de las líneas 25-35 entre `3a52028b` y `HEAD` → **exit 0**, byte a byte
  idéntico. El helper sigue excluyendo **solo** carpetas `__tests__/`; no se le
  añadió ningún filtro de `*.test.tsx`.
- `git diff 3a52028b..HEAD -- src/__tests__/design-drift.test.ts` tiene
  **exactamente tres hunks**: el ternario (`:81-89`), el inventario de `#87 R19`
  (`:429-438`) y el de `#94 R10` (`:526-532`). Nada más.
- **Ningún describe apagado**: `design-drift.test.ts` tiene **17** `describe` de
  primer nivel antes y **17** después, y en las **mismas líneas**
  (61, 67, 94, 102, 175, 202, 248, 269, 288, 310, 331, 354, 382, 406, 427, 509, 526).
  La suite sigue en **41** tests.
- R7 re-medido por el reviewer sobre los cuatro tests mudados, que ahora sí
  entran en el escaneo: `grep -cE "[A-Za-z0-9_-]+-\[[^]]+\]"` → **0, 0, 0, 0**;
  `grep -c 'rounded-\[20px\]\|text-\[10px\]'` → **0, 0, 0, 0**. Cero excepciones,
  cero listas de exclusión.

### 3. Ficheros prohibidos — no aparecen

`git diff --name-only a3f9b602..HEAD` (20 ficheros) **no contiene**
`src/app/(tabs)/food.tsx`, `src/app/(tabs)/__tests__/food.test.tsx` ni
`src/__tests__/ui-language.test.ts`. Tampoco `docs/ui-guidelines.md`.

Además se recorrió **commit a commit** el rango buscando esos tres nombres en
`git show --name-only` (para cazar un toca-y-revierte): **cero coincidencias**.

Corolario medido en `ui-copy-table.ts`: quedan **19** ocurrencias de
`src/app/(tabs)/`, y las 19 son de `food.tsx`. Las otras 68 pasaron a
`src/screens/…`: **17** map + **13** health + **19** weight-log +
**19** meal-schedule, que son exactamente los números de las tablas de R2-R5.

### 4. Nada de tests nuevos

- Conjunto de ficheros de test bajo `src/` y `test/`: **77 antes, 77 después**.
  El `diff` de las dos listas son **solo** los cuatro movimientos; cero altas,
  cero bajas.
- Total 1386 = baseline, y las diez suites clavadas una a una (tabla de arriba).
- Diff de los cuatro tests mudados (`git diff -M -C`): **solo** prefijos de
  import (`'../../../'` → `'../../'`, `'../../../../test/…'` → `'../../../test/…'`,
  incluidos los de `jest.mock`) y el import del body a `from '.'`. **Cero
  líneas con `expect(`, `describe(`, `it(` o `test(` añadidas o borradas.**
- No se añadió test de delegación al route delgado (D7 respetada).

---

## R-id por R-id

| R | Veredicto | Evidencia re-medida por el reviewer |
|---|---|---|
| **R1** | ✅ | `grep -n 'enmienda A10 de #102' docs/conventions.md` → **una sola línea**, la 447. La viñeta conserva `NO se migran en frío` en la 445. El texto normativo está literal: las cuatro condiciones y "la regla por defecto no cambia". Commit `ca2d6f80`. Gate humano firmado (§Aprobación → *Enmienda R1*, 2026-09-21) |
| **R2** | ✅ | `src/screens/map/index.tsx`, **406** líneas, `export function MapScreen()` (named). `src/app/(tabs)/map.tsx` son **5 líneas**, literalmente el cuerpo prescrito. Test en `src/screens/map/index.test.tsx`, **58/58**. Los 6 candados repuntados + ternario. Rojo `b5562651` → verde `762c6525` |
| **R3** | ✅ | `src/screens/health/index.tsx`, **279** líneas, `export function HealthScreen()`. Route de 5 líneas (`HealthRoute`). **28/28**. Candados `:110`, `:275`, `:351`, `:124`, `:155`, `:432` repuntados. Rojo `95ee54fc` → verde `64168387` |
| **R4** | ✅ | `src/screens/weight-log/index.tsx`, **341** líneas, `export function WeightLogScreen()`. Route de 5 líneas. **32/32**. Candados `:174`, `:279`, `:352`, `:435`. `R5_HEALTH` sigue en `32 + 1`: `ui-language` verde en 25 sin tocarse. Rojo `d0df4df2` → verde `9f0240af` |
| **R5** | ✅ | `src/screens/meal-schedule/index.tsx`, **324** líneas, `export function MealScheduleScreen()`. Route de 5 líneas. **23/23**. Candados `:278`, `:92`, `:434`. Las 19 filas de `food.tsx` dentro de `R6_FOOD` intactas; `R6_FOOD` sigue en `35 + 3`. Rojo `1d16260d` → verde `e86c6f66` |
| **R6** | ✅ | El ternario **se invirtió**, no se colapsó: `screen === 'food' ? join(sourceRoot,'app','(tabs)',…) : join(sourceRoot,'screens',screen,'index.tsx')`, forma literal de la spec. La aserción que sigue (`toContain("from '../../components/card'")`) no cambió ni un carácter. `design-drift` en **41**, exit 0. Commit `73bb67df` |
| **R7** | ✅ | `sourceFiles()` intacto (`cmp` exit 0) y 17 describes en las mismas líneas. Los cuatro tests mudados dan **0** en las tres formas vigiladas. `design-drift` **41 passed, exit 0** |
| **R8** | ✅ | **77 / 1386 / exit 0** y `tsc --noEmit` con **0 bytes, exit 0**, ambos medidos sin pipe tras borrar `.expo/types/router.d.ts`. `git diff a3f9b602..HEAD -- package.json bun.lock` → **vacío**: cero dependencias nuevas. `git log --stat -M` muestra los **ocho** renames (4 cuerpos + 4 tests). El diff de cada cuerpo en su commit rojo es `similarity index 99%` + **una sola línea**: `export default function XScreen()` → `export function XScreen()` |
| **R9** | ✅ | En la descripción de #102 de `feature_list.json`: `325` → **0**, `388` → **0**, `406` → **1**, `374` → **1**, `DEUDA NOMBRADA` → **1**, `food.tsx` → 7 con la razón (#106/#107 `in_progress`). Registrado por el humano en `7098f985` |

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` en el `feature_list.json` de esta branch (#102)
- [x] `progress/current.md` describe la sesión activa y está actualizado al cierre de la implementación
- [ ] `progress/history.md` — **sin entrada todavía**. Es tarea de cierre del `leader`, no de Codex; no bloquea el veredicto

## Checklist C3 — Arquitectura

No aplica la regla de capas de `docs/architecture.md`: #102 no toca
`backend-pet-tracker/` (diff de 20 ficheros, ninguno bajo ese árbol). La
arquitectura relevante es la convención móvil *route delgado + `src/screens/`*
de `docs/conventions.md` §Estructura Expo, y se cumple:

- [x] Las cuatro rutas de `src/app/(tabs)/` quedan en **5 líneas**: import + `export default function XRoute()` que devuelve `<XScreen />`
- [x] El cuerpo vive en `src/screens/<x>/index.tsx` con export **named**
- [x] Sin fichero de barril (D4): el route importa `'../../screens/map'` y resuelve a `index.tsx`
- [x] Ningún cuerpo cambió un solo import (D1): los dos paths están a profundidad 3 bajo `src/`

## Checklist C4 — TDD

- [x] Vía **(b)** de C4 declarada por escrito en `requirements.md` §0.3 **antes** del handoff, con la mutación definida (el movimiento del fichero de producción)
- [x] Historial test-primero: un commit rojo y uno verde por ruta, cuatro pares, no todo junto
- [x] Los cuatro rojos son **rojos de verdad** (exit 1), verificados por el reviewer con checkout
- [x] Ningún rojo falla por `ReferenceError` de un helper que no existe (0 ocurrencias)
- [x] Ningún rojo falla por mutar un doble de test: no se tocó un solo mock; lo que se movió es producción
- [x] Los R-ids están nombrados en los mensajes de commit y en la trazabilidad. Los candados que los cierran nombran sus R-ids de origen (`#61 R4`, `#62 R14`, `#65 R18`, `#87 R19`, `#94 R10`, `R3`…), que es la forma que tiene esta feature de verificación

## Checklist C5 — Trazabilidad

- [x] `traceability.md` sin ninguna fila "pendiente" (el único hit de `grep pendiente` es la línea 10 de instrucciones de la cabecera)
- [x] Cada R1-R9 tiene test/comprobación, fichero y commit registrados
- [x] Los once hashes citados son **ancestros de HEAD** (`git merge-base --is-ancestor` OK en los once) — sin rebase que invalide la trazabilidad
- [x] Formato de commit conforme a la convención declarada por la propia spec

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` en el frontmatter
- [x] Las **dos** casillas marcadas con fecha: *Enmienda R1* y *Aprobación de la spec*, ambas 2026-09-21
- [x] La firma es del humano: `7098f985` — `author=AlexisSM377 <al222111377@gmail.com>`, no de un agente
- [x] Ningún requisito se modificó tras la aprobación. `git diff 7098f985..HEAD -- specs/mobile-routes-to-screens/requirements.md` devuelve **un solo hunk, de una línea**: el frontmatter `status: spec_ready` → `status: approved`, hecho por el `leader` en `a3f9b602`. Es exactamente el flujo documentado (`vps-spec-approval-flow`: el humano firma la casilla en su commit, el leader pasa el frontmatter). **Cero cambios en el texto de R1-R9** tras la firma, y el fichero no vuelve a aparecer en ninguno de los once commits de Codex

## Checklist C7 — Sin código huérfano

- [x] Los cuatro ficheros viejos desaparecieron: git los presenta como **renames**, no como copias
- [x] Sus tests se movieron, no se duplicaron: `src/app/(tabs)/__tests__/` conserva exactamente los cinco ficheros que la spec predijo (`alerts`, `food`, `layout`, `profile`, `screens`)
- [x] Cero importadores residuales: `grep -rn` por `(tabs)/map|(tabs)/health|(tabs)/weight-log|(tabs)/meal-schedule` y por `'../map'`, `'../health'`, `'../weight-log'`, `'../meal-schedule'` sobre `src/` y `test/` → **sin resultados**
- [x] `_layout.tsx` y `floating-tab-bar.tsx` no se tocaron y siguen resolviendo por nombre de ruta, porque los cuatro ficheros de ruta permanecen

## Checklist C8 — Carta de UI (`docs/ui-guidelines.md`)

Refactor puro: no estrena conducta, copy, token ni animación. Aun así, los
cuatro cuerpos ya en su nueva ubicación se midieron:

- [x] Grep-clean en los cuatro: hex fuera de `src/theme/` = **0**, clases arbitrarias `[...]` = **0**, `StyleSheet.create` = **0**, `shadowColor|shadowOffset|elevation:` = **0**
- [x] El `describe('C8: …')` de `design-drift.test.ts` escanea ahora también los cuatro tests mudados y sigue en `[]`
- [x] Sin animaciones nuevas, sin componentes nuevos, sin claves i18n nuevas
- [x] `docs/ui-guidelines.md` no se editó (es fichero de la sesión #106/#107)

---

## Hallazgos bloqueantes

**Ninguno.**

## Hallazgos no bloqueantes

1. **Desviación de `tasks.md` en los cuatro pasos (1): el route delgado se crea
   en el commit verde, no en el rojo.** `tasks.md` R2(1) ordena literalmente
   *"escribe `src/app/(tabs)/map.tsx` con el route delgado"* dentro del commit
   rojo. Codex lo movió al verde y lo documentó. **Re-medida la justificación y
   es correcta**: `tasks.md` contradice a `requirements.md`, que es el documento
   firmado. (a) R2 §*Rojo esperado* exige que el rojo sea **por ENOENT sobre
   `src/app/(tabs)/map.tsx`**, y con el route recreado ese path existe y no hay
   ENOENT; (b) R8 exige que `git diff -M` presente el par como **rename**, y con
   el path origen recreado en el mismo snapshot git no lo empareja. Verificado:
   los cuatro cuerpos salen `similarity index 99%` + rename, y los ocho renames
   aparecen en `git log --stat -M`. Efecto colateral: los cuatro commits rojos
   dejan el árbol sin ese fichero de ruta, así que son estados intermedios que no
   levantan la app. Nunca se publican y el tip es correcto. **Para la próxima
   spec: el paso (1) de `tasks.md` no puede pedir a la vez el route recreado y un
   rojo por ENOENT.**
2. **Tipo de commit `refactor(…)` / `docs(…)`, no `feat(…)`.** C5 escribe el
   formato como `feat(<scope>): <desc> (R1,R2)`. La propia `traceability.md`
   declaró de antemano `refactor(mobile): <desc> (R2)`, que es el tipo
   Conventional Commits correcto para un refactor puro. Se acepta.
3. **`specs/mobile-routes-to-screens/tasks.md` sigue con `status: spec_ready`**
   en su frontmatter mientras `requirements.md` está `approved`. Viene del
   `spec_author`, no de Codex. Cosmético.
4. **`feature_list.json` de esta branch solo ve #102 en `in_progress`**; #106 y
   #107 viven en la branch vecina. Es el artefacto esperado del reparto en dos
   worktrees, y anticipa conflicto al mergear en `feature_list.json`,
   `progress/current.md` y `progress/history.md`
   (`reparto-de-ficheros-caduca-al-mergear`). El `leader` lo resuelve al cerrar.
5. **#102 sigue `in_progress` en `feature_list.json`.** Pasa a `done` el
   `leader` con este veredicto en la mano, no el reviewer.
6. **R9(3) de `tasks.md` queda abierto para el `leader`**: volver a medir
   `food.tsx` contra el árbol antes de dar la fila por buena. Codex no lo hizo
   —correctamente— porque el handoff le prohíbe abrir ese fichero mientras
   #106/#107 escriben en él. El valor **374** procede del commit humano
   `7098f985` y **puede haber caducado** si #106/#107 engordaron el fichero
   (`constantes-congeladas-en-specs`). El reviewer tampoco lo abrió, por la misma
   regla de un solo escritor.

---

## Sobre `./init.sh`

**No se lanzó, por instrucción explícita del encargo y por §Fuera de alcance de
la spec.** Motivo verificado, no heredado: el diff completo del rango son 20
ficheros y **ninguno** está bajo `backend-pet-tracker/`. Los puertos de Postgres
y LocalStack son de la sesión vecina y el `pgrep` de `init.sh` tiene ventana de
carrera entre worktrees (`init-sh-concurrente-worktrees`), así que lanzarlo
habría podido teñir de rojo los e2e de la otra sesión sin aportar nada a esta
feature.

**El gate real de #102 es jest + `bunx tsc --noEmit`, y los dos están verdes y
re-medidos arriba.** No hace falta `init.sh` para este veredicto.

## Salidas guardadas

Las corridas completas quedaron en el scratchpad de la sesión del reviewer:
`full-tip.txt`, `tsc-tip.txt` y `red-{map,health,weight-log,meal-schedule}-{cand,body}.txt`.

Tras la verificación de los commits rojos, el worktree quedó limpio y de vuelta
en `feature/102-mobile-routes-to-screens` @ `2ae43ea5` (`git status --short`
vacío).
