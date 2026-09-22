---
feature: "mobile-routes-to-screens"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, mobile, refactor]
---

# Tareas — [[mobile-routes-to-screens]] (#102)

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]].
> Decisiones cerradas en [[design]].
>
> **Regla de sujeto presente** (lección `sujeto-ausente-en-tasks.md`): ninguna
> tarea asevera sobre un fichero, símbolo o ruta que su propio orden no haya
> creado todavía. Por eso R6 vive dentro del paso (3) de R5 —la forma invertida
> del ternario solo es cierta cuando las **cuatro** rutas ya se movieron— y por
> eso R7 y R8 van al final.
>
> **Requisitos de verificación, vía (b) de C4**: R2–R9 no estrenan conducta.
> Su rojo legítimo está definido en [[requirements]] §0.3: **el movimiento del
> fichero de producción es la mutación**, y el candado lo ve.

## Antes de la primera línea de código

- [ ] (0.a) **El humano** firma la casilla *Enmienda R1* de
      [[requirements]] §Aprobación. Sin esa firma, #102 no existe.
- [ ] (0.b) **El humano** firma la casilla *Aprobado por humano* de
      [[requirements]] §Aprobación.
- [ ] (0.c) **Codex** carga de su plugin `expo` las skills **`expo-overview`** y
      **`expo-project-structure`**.
- [ ] (0.d) **Codex** borra `mobile-pet-tracker/.expo/types/router.d.ts`
      (gitignorado; rompe `tsc` con rutas fantasma, y esta feature mueve
      ficheros de ruta).
- [ ] (0.e) **Codex** mide el baseline en su propio árbol, **sin pipe**, y lo
      escribe en `progress/impl_mobile-routes-to-screens.md`:
      `cd mobile-pet-tracker && bun run test > /tmp/base.txt; echo $?`.
      Debe dar **77 suites / 1386 tests / exit 0**. Si no coincide, **para** y
      lo reporta: el árbol no es el que esta spec midió.

---

## R1 — Enmienda a `docs/conventions.md:445-446`

R1 no es código y no tiene test: es la enmienda que autoriza a la feature a
existir. Su gate es la casilla propia de [[requirements]] §Aprobación.

- [ ] (1) **Codex** verifica que la casilla *Enmienda R1* está marcada. Si no lo
      está, **para**.
- [ ] (2) **Codex** sustituye las líneas 445-446 de `docs/conventions.md` por el
      texto normativo literal de [[requirements]] R1.
- [ ] (3) **Codex** comprueba que
      `grep -c 'enmienda A10 de #102' docs/conventions.md` da **1** y que
      `grep -c 'NO se migran en frío' docs/conventions.md` sigue dando **1**.
      Commit: `docs(conventions): excepcion A10 para migracion en frio (R1)`.

---

## R2 — `map` se muda a `src/screens/map/`

- [ ] (1) **Codex** deja el candado en rojo y lo registra. En este orden:
      **Codex** crea `mobile-pet-tracker/src/screens/map/`; mueve el cuerpo con
      `git mv 'src/app/(tabs)/map.tsx' src/screens/map/index.tsx`; mueve el test
      con `git mv 'src/app/(tabs)/__tests__/map.test.tsx' src/screens/map/index.test.tsx`;
      cambia en `src/screens/map/index.tsx` la línea
      `export default function MapScreen() {` por `export function MapScreen() {`;
      escribe `src/app/(tabs)/map.tsx` con el route delgado literal de
      [[design]] §1.1; y ajusta en `src/screens/map/index.test.tsx` los prefijos
      `'../../../'` → `'../../'`, el de `render-with-providers`
      `'../../../../test/…'` → `'../../../test/…'` (incluidos los de
      `jest.mock(...)`) y el import del body a `import { MapScreen } from '.';`.
      **Codex NO toca todavía ninguno de los cinco candados compartidos.**
      Entonces **Codex** mide, sin pipe:
      ```bash
      cd mobile-pet-tracker
      bunx jest --runTestsByPath 'src/screens/map/index.test.tsx' > /tmp/r2-body.txt; echo $?
      bunx jest --runTestsByPath \
        'src/__tests__/ui-copy-table.ts' \
        'src/__tests__/ui-language.test.ts' \
        'src/__tests__/design-drift.test.ts' \
        'src/__tests__/consistency-classnames.test.ts' \
        'src/__tests__/legibility-classnames.test.ts' > /tmp/r2-red.txt; echo $?
      ```
      El primero debe dar **58 passed, exit 0**; el segundo debe dar **rojo**,
      por ENOENT sobre `src/app/(tabs)/map.tsx` en las aserciones de esos
      candados. **Codex** pega las dos salidas en
      `progress/impl_mobile-routes-to-screens.md`. Commit **rojo**:
      `refactor(mobile): mueve map a src/screens/map (R2, rojo)`.
- [ ] (2) **Codex** repunta a la ruta nueva, y solo eso, los sitios de la tabla
      de [[requirements]] R2: las 17 filas de `R4_MAP` en `ui-copy-table.ts`;
      `consistency-classnames.test.ts:277` y `:341`;
      `legibility-classnames.test.ts:126`; `design-drift.test.ts:433` y `:529`;
      y **añade `|| screen === 'map'`** a la condición del ternario de
      `design-drift.test.ts:84` (forma provisional; R6 la cierra).
      **Codex** no toca `ui-language.test.ts` (D5) ni
      `design-drift.test.ts:sourceFiles()` (D12). Entonces **Codex** mide, sin
      pipe, las cinco suites de candado más el body: deben dar
      `ui-copy-table` **2**, `ui-language` **25**, `design-drift` **41**,
      `consistency-classnames` **57**, `legibility-classnames` **26** y
      `map/index.test.tsx` **58**, todas verdes. Commit **verde**:
      `refactor(mobile): repunta los candados de map (R2)`.
- [ ] (3) **Codex** verifica que git ve dos renames y que el cuerpo no cambió:
      `git diff -M --stat HEAD~2 HEAD -- mobile-pet-tracker/` debe mostrar
      `src/app/(tabs)/map.tsx → src/screens/map/index.tsx` y
      `src/app/(tabs)/__tests__/map.test.tsx → src/screens/map/index.test.tsx`;
      y `git diff -M HEAD~2 HEAD -- mobile-pet-tracker/src/screens/map/index.tsx`
      debe mostrar **una sola línea** cambiada, la del export. Sin refactor
      adicional: el cuerpo no se toca.

---

## R3 — `health` se muda a `src/screens/health/`

- [ ] (1) **Codex** repite el paso (1) de R2 con `health`: crea
      `src/screens/health/`, `git mv` del cuerpo a
      `src/screens/health/index.tsx` y del test a
      `src/screens/health/index.test.tsx`, cambia
      `export default function HealthScreen() {` por
      `export function HealthScreen() {`, escribe el route delgado
      (`HealthRoute` → `<HealthScreen />`) y ajusta los prefijos del test (D2) y
      su import a `import { HealthScreen } from '.';`. **Codex** deja los cinco
      candados compartidos sin tocar, mide las dos salidas igual que en R2 —el
      body debe dar **28 passed**, los candados **rojo**— y las pega en
      `progress/impl_mobile-routes-to-screens.md`. Commit **rojo**:
      `refactor(mobile): mueve health a src/screens/health (R3, rojo)`.
- [ ] (2) **Codex** repunta los sitios de la tabla de [[requirements]] R3: las 13
      filas de `health.tsx` dentro de `R5_HEALTH` en `ui-copy-table.ts`;
      `consistency-classnames.test.ts:110`, `:275` y `:351`;
      `legibility-classnames.test.ts:124` y `:155`;
      `design-drift.test.ts:432`; y **añade `|| screen === 'health'`** al
      ternario de `design-drift.test.ts:84`. **Codex** comprueba que
      `expect(R5_HEALTH).toHaveLength(32 + 1)` en `ui-language.test.ts:133`
      **no se toca** y sigue verde. Entonces mide las cinco suites de candado más
      el body, sin pipe: mismos recuentos que en R2(2), con
      `health/index.test.tsx` en **28**. Commit **verde**:
      `refactor(mobile): repunta los candados de health (R3)`.
- [ ] (3) **Codex** verifica los dos renames y el diff de una línea del cuerpo,
      igual que en R2(3).

---

## R4 — `weight-log` se muda a `src/screens/weight-log/`

- [ ] (1) **Codex** repite el paso (1) con `weight-log`: crea
      `src/screens/weight-log/`, `git mv` del cuerpo y del test, cambia
      `export default function WeightLogScreen() {` por
      `export function WeightLogScreen() {`, escribe el route delgado
      (`WeightLogRoute` → `<WeightLogScreen />`), ajusta los prefijos del test y
      su import a `import { WeightLogScreen } from '.';`. **Codex** deja los
      candados sin tocar, mide —body **32 passed**, candados **rojo**— y lo
      registra. Commit **rojo**:
      `refactor(mobile): mueve weight-log a src/screens/weight-log (R4, rojo)`.
- [ ] (2) **Codex** repunta los sitios de la tabla de [[requirements]] R4: las 19
      filas de `weight-log.tsx` dentro de `R5_HEALTH` en `ui-copy-table.ts`;
      `consistency-classnames.test.ts:174`, `:279` y `:352`;
      `design-drift.test.ts:435`; y **añade `|| screen === 'weight-log'`** al
      ternario. **Codex** comprueba que `R5_HEALTH` sigue en `32 + 1` sin
      tocarse. Mide las cinco suites más el body (**32**), sin pipe. Commit
      **verde**: `refactor(mobile): repunta los candados de weight-log (R4)`.
- [ ] (3) **Codex** verifica los dos renames y el diff de una línea.

---

## R5 — `meal-schedule` se muda, y R6 cierra el ternario

El paso (3) de este bloque es donde vive **R6**: la forma invertida del ternario
solo es cierta cuando las cuatro rutas ya se movieron, y en este punto del orden
ya lo están.

- [ ] (1) **Codex** repite el paso (1) con `meal-schedule`: crea
      `src/screens/meal-schedule/`, `git mv` del cuerpo y del test, cambia
      `export default function MealScheduleScreen() {` por
      `export function MealScheduleScreen() {`, escribe el route delgado
      (`MealScheduleRoute` → `<MealScheduleScreen />`), ajusta los prefijos del
      test y su import a `import { MealScheduleScreen } from '.';`. **Codex**
      deja los candados sin tocar, mide —body **23 passed**, candados **rojo**—
      y lo registra. Commit **rojo**:
      `refactor(mobile): mueve meal-schedule a src/screens/meal-schedule (R5, rojo)`.
- [ ] (2) **Codex** repunta los sitios de la tabla de [[requirements]] R5: las 19
      filas de `meal-schedule.tsx` dentro de `R6_FOOD` en `ui-copy-table.ts`
      —**sin tocar las 19 de `food.tsx` del mismo bloque**—;
      `consistency-classnames.test.ts:278`; `legibility-classnames.test.ts:92`;
      `design-drift.test.ts:434`; y **añade `|| screen === 'meal-schedule'`** al
      ternario. **Codex** comprueba que `expect(R6_FOOD).toHaveLength(35 + 3)` en
      `ui-language.test.ts:140` **no se toca** y sigue verde. Mide las cinco
      suites más el body (**23**), sin pipe. Commit **verde**:
      `refactor(mobile): repunta los candados de meal-schedule (R5)`.
- [ ] (3) **R6 — refactor del ternario.** Con las cuatro rutas ya en
      `src/screens/`, **Codex** sustituye la condición acumulada de
      `design-drift.test.ts:84-86` —que a estas alturas dice
      `screen === 'profile' || screen === 'home' || screen === 'map' || screen === 'health' || screen === 'weight-log' || screen === 'meal-schedule'`—
      por la forma invertida literal de [[requirements]] R6:
      ```ts
      screen === 'food'
        ? join(sourceRoot, 'app', '(tabs)', `${screen}.tsx`)
        : join(sourceRoot, 'screens', screen, 'index.tsx'),
      ```
      **Codex** deja intacta la aserción que sigue,
      `expect(contents).toContain("from '../../components/card'")`, y mide
      `bunx jest --runTestsByPath 'src/__tests__/design-drift.test.ts'` → debe
      dar **41 passed, exit 0**. Commit:
      `refactor(mobile): invierte el ternario de design-drift sobre food (R6)`.

---

## R7 — los tests mudados entran en el escaneo de `design-drift`

Las cuatro carpetas `src/screens/<x>/` con su `index.test.tsx` ya existen —las
crearon R2–R5—, así que este requisito ya tiene sujeto.

- [ ] (1) **Codex** comprueba que los cuatro tests mudados están de verdad dentro
      del escaneo, y que no lo ensucian:
      ```bash
      cd mobile-pet-tracker
      grep -cE "[A-Za-z0-9_-]+-\[[^]]+\]" src/screens/{map,health,weight-log,meal-schedule}/index.test.tsx
      grep -n 'rounded-\[20px\]\|text-\[10px\]' src/screens/{map,health,weight-log,meal-schedule}/index.test.tsx
      ```
      Los cuatro recuentos deben dar **0** y el segundo grep no debe devolver
      nada. **Codex** pega la salida en
      `progress/impl_mobile-routes-to-screens.md`.
- [ ] (2) **Codex** confirma que `design-drift.test.ts:sourceFiles()` (`:25-35`)
      **no tiene ni un carácter cambiado** respecto de `3a52028b`:
      `git diff 3a52028b -- mobile-pet-tracker/src/__tests__/design-drift.test.ts`
      no debe mostrar ninguna línea dentro de ese rango (D12). Si algún grep de
      (1) sale distinto de cero, **Codex limpia el fichero de test, jamás el
      helper**, y lo reporta.
- [ ] (3) **Codex** mide
      `bunx jest --runTestsByPath 'src/__tests__/design-drift.test.ts'` → **41
      passed, exit 0**. Sin commit propio si (1) y (2) no exigieron cambios;
      basta con la evidencia escrita.

---

## R8 — el recuento no se mueve, y el typecheck está limpio

- [ ] (1) **Codex** mide la suite móvil completa y el typecheck, **sin pipe**:
      ```bash
      cd mobile-pet-tracker
      rm -f .expo/types/router.d.ts
      bun run test > /tmp/final.txt; echo "JEST_EXIT=$?"
      bunx tsc --noEmit > /tmp/tsc.txt; echo "TSC_EXIT=$?"
      ```
      `JEST_EXIT` debe ser **0** con `Test Suites: 77 passed, 77 total` y
      `Tests: 1386 passed, 1386 total`. `TSC_EXIT` debe ser **0** con
      `/tmp/tsc.txt` **vacío**.
- [ ] (2) **Codex** mide una por una las diez suites de la tabla de
      [[requirements]] R8 con `--runTestsByPath` y las rutas **entre comillas
      simples** (sin escapar, `(tabs)` es regex y jest salta ficheros en
      silencio con exit 0). Comprueba que jest imprime **1 suite** en cada
      llamada y el recuento exacto: 58, 28, 32, 23, 2, 41, 57, 26, 25, 2.
- [ ] (3) **Codex** comprueba que no entró ninguna dependencia
      (`git diff --stat 3a52028b -- mobile-pet-tracker/package.json
      mobile-pet-tracker/bun.lock` **vacío**) y que
      `git log --stat -M 3a52028b..HEAD` muestra los **ocho** renames (cuatro
      cuerpos, cuatro tests). **Codex** pega las tres salidas en
      `progress/impl_mobile-routes-to-screens.md`.

---

## R9 — `food.tsx` queda como deuda nombrada

- [x] (1) **El `spec_author`** corrigió la entrada #102 de `feature_list.json` en
      el mismo commit que esta spec: `map.tsx` pasa a **406** líneas y
      `food.tsx` a **374**, con la provenencia de cada número (los engordaron
      #94/PR #143 y #98), y quedó registrada la **deuda nombrada** de migrar
      `food.tsx` a `src/screens/food/` cuando #106/#107 mergeen, junto con sus
      19 filas de `ui-copy-table.ts`.
- [ ] (2) **El leader**, al cerrar, comprueba que la corrección sobrevivió al
      merge: `325` y `388` no aparecen en la descripción de #102, y `406`, `374`
      y `DEUDA NOMBRADA` sí. Un merge de #106/#107 sobre `feature_list.json`
      puede haberla pisado (`reparto-de-ficheros-caduca-al-mergear`).
- [ ] (3) **El leader** vuelve a medir los dos tamaños contra el árbol antes de
      dar la fila por buena —un recuento absoluto caduca
      (`constantes-congeladas-en-specs`)— y, si #106/#107 movieron `food.tsx`,
      actualiza el número al cerrar en vez de dejar uno obsoleto.

---

## Cierre

- [ ] **Codex** deja `progress/impl_mobile-routes-to-screens.md` con las
      evidencias de rojo y verde de R2–R5, los greps de R7 y las tres medidas de
      R8, y rellena [[traceability]] con test y commit por R-id.
- [ ] **El leader** lanza el `reviewer` cuando el humano confirme que Codex
      terminó.
- [ ] **No se lanza `./init.sh`**: #102 no toca `backend-pet-tracker/` y los
      puertos de Postgres/LocalStack son de la sesión vecina.
