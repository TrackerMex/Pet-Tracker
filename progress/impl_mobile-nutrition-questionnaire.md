Estado: COMPLETO

> **Relevo (subagente implementer, 2026-10-27).** Me detuve en una frontera limpia porque el
> presupuesto de llamadas está casi agotado (unas 340 de 350). HEAD es `f17a05e0` (R18,
> nace verde, con sonda). El árbol está limpio salvo este reporte, que no está trackeado.
> Para R19 no hay nada editado. A `f17a05e0`, tsc y lint salen 0.
> El siguiente paso es la línea 382 del handoff («# -- R19 test --»). Lo que ya se verificó
> en `src/screens/food/index.test.tsx`:
> - la factoría de `jest.mock('../../api/nutrition', …)` está en las líneas 46–50 y hoy
>   solo tiene `getNutritionPlan`, `serveMeal` y `unserveMeal`; el import del módulo está
>   en las líneas 18–23;
> - el `beforeEach` de nivel superior está en las líneas 220–229 y no da ningún default de
>   nutrición;
> - el mock de `expo-router` está en las líneas 64–67 y expone `router.push`, así que
>   `mockRouter`, en la línea 140, sirve para asertar la navegación del R19;
> - `makePet`, en la línea 143, devuelve `name: 'Luna'` y `myRole: 'owner'`, y el
>   cuerpo esperado tiene que usar ese nombre.
>
> En `src/screens/food/index.tsx`:
> - el vacío actual está en las líneas 445–452, con `plan.data?.kind === 'not-found'` y
>   `food-plan-empty`;
> - el bloque de esqueletos está en las líneas 215–232;
> - la mascota activa no se resuelve hoy con `.find(`.
>
> Las claves de catálogo del R19 ya existen: `mealSchedule.noNutritionProfileYet` y
> `nutritionQuestionnaire.profileEmptyBody/createProfile/profileEmptyNote`.
> Cuando cierre todo, la trazabilidad pendiente es:
> - R16: `101c7f11` → `ed2316b1`;
> - R17: `8b0f7d80` → `ce66ba47`;
> - R18: `f17a05e0`, nace verde;
> - D-1 sigue en pie: el rojo de R14 cerró en `6b8a9612`.

# #209 — Reporte de implementación

Fecha: 2026-10-27. Worktree: `/home/claude/sites/Pet-Tracker-wt-209`. Branch: `feature/209-mobile-nutrition-questionnaire`. HEAD: **`a38be138`**.

## Estado y parada obligatoria

Se retomó la cadena desde T0 completa conforme a la Adenda 1 (`48346f15` y `0e7ea32a`). R1, R2, R3, R4, R5, R7 y R8 tienen commits de test rojo y producción verde. R23 tiene implementado y verificado su catálogo; la tabla de copy queda para su posición posterior en la cadena.

**Parada en la sonda R8: «mutación verde».** El handoff, línea 491, pide «R8: la fila 6 con la banda de la 7. Rojo: la fila 6 de #209 R8:». Pero requirements.md líneas 325–326 asigna **amber a ambas filas**:

```text
6 | Algo de sobrepeso | Algo de grasa en costillas, poca cintura | amber
7 | Sobrepeso         | Costillas difíciles de sentir          | amber
```

Aplicar literalmente la banda de la 7 a la 6 da amber → amber. No cambia el fuente ni el comportamiento; las pruebas permanecen verdes:

```text
Sonda R8 literal: fila 6 amber -> banda de fila 7 amber; cambia el fuente: False.
Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
exit=0
```

El handoff, línea 483, ordena: «Si una sonda deja el `it` en verde, anótalo como “mutación verde” y PARA». Se detiene aquí y **no se inicia R9**. No se sustituye por otra mutación ni se alteran bandas o cifras aprobadas. El leader debe corregir la receta de sonda antes de retomar. El candado de la banda 6 está escrito con el literal amber; esta corrida no prueba una mutación que cambie su banda.

La producción está restaurada en HEAD. El chequeo acotado de árbol limpio y el índice dan exit 0. El único archivo sin commit es este reporte, que se deja para revisión del leader. No se genera `.done`, no se rellena traceability con cierres incompletos y no se ejecuta el commit final de cierre.

## Identidad y bases

Comprobación de la primera sesión, ejecutada tras leer el handoff:

```text
/home/claude/sites/Pet-Tracker-wt-209
feature/209-mobile-nutrition-questionnaire
21d43079 docs(progress): #209 Codex handoff
001d5ed4 docs(spec): #209 round-3 re-measure on dev b185ae61 (#208)
```

Primera comprobación de la reanudación:

```text
/home/claude/sites/Pet-Tracker-wt-209
feature/209-mobile-nutrition-questionnaire
0e7ea32a docs(progress): #209 rebase the closing diff checks on the round-4 errata
48346f15 docs(spec): #209 round-4 errata for the extended R24 count
21d43079 docs(progress): #209 Codex handoff
001d5ed4 docs(spec): #209 round-3 re-measure on dev b185ae61 (#208)
1dbac74f Merge remote-tracking branch 'origin/dev' into feature/209-mobile-nutrition-questionnaire
```

H0 original es `001d5ed4`; la base de las tres comprobaciones de diff de cierre es **`48346f15`**, como manda Adenda 1. Integra en dev; no se hizo push, PR, fetch, merge o rebase.

## Lecturas y skills

Se leyeron el handoff completo, `progress/current.md`, la entrada #209 de `feature_list.json`, la instrucción móvil de `AGENTS.md`, `requirements.md`, `design.md`, `tasks.md` y `traceability.md` completos, las convenciones, arquitectura y carta de UI, y los patrones existentes relevantes. Se consultó la documentación versionada que exige el AGENTS móvil: https://docs.expo.dev/versions/v57.0.0/.

Skills cargadas:

- `ponytail:ponytail`: `/home/claude/.codex/plugins/cache/ponytail/ponytail/5.3.2/skills/ponytail/SKILL.md`.
- `appllama-app-design-skill`: `.agents/skills/appllama-app-design-skill/SKILL.md` (1.3.0).
- `building-native-ui`: `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md` (1.0.1).
- `native-data-fetching`: `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/native-data-fetching/SKILL.md` (1.0.0).
- `expo-tailwind-setup`: `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/expo-tailwind-setup/SKILL.md` (1.0.0).

Se encontraron las tres skills de Expo solicitadas. No se buscaron los nombres que el handoff declara inexistentes: `expo:expo-overview`, `expo-overview`, `expo-router`, `expo-animation` y `expo-design-system`. No se usó MCP Appllama ni simulador; el handoff y la carta reservan el smoke Android al humano. La carta y la spec prevalecen sobre las recetas genéricas de las skills.

## T0 y Adenda 1

Las dos mediciones iniciales se conservan sin repetir, como manda la adenda:

| Corrida | Exit | Test Suites | Tests | SIGKILL | failed to run |
|---|---|---|---|---|---|
| T0 guardas | 0 | 37 passed, 37 total | 965 passed, 965 total | 0 | 0 |
| T0 ampliado | 0 | 40 passed, 40 total | 1221 passed, 1221 total | 0 | 0 |
| T0 completa | 1 | 2 failed, 158 passed, 160 total | 2 failed, 5702 passed, 5704 total | 0 | 0 |

T0 ampliado produjo la primera parada por la cifra antigua de 1200. Adenda 1 confirmó 1221 (965 + language-provider 54 + meal-schedule 80 + food 122). Valores ampliados vigentes: **1250 en R24 (2b)** y **1253 tras R25**. Guardas: se conservan 965 de T0, 973 en R24 (2b) y 976 tras R25.

Los comandos se ejecutaron desde mobile-pet-tracker/, sin pipe:

```bash
timeout 580 bunx jest src/__tests__ src/app/__tests__/layout.test.tsx > ../progress/t0-guards-209.log 2>&1; echo exit=$?
timeout 580 bunx jest src/__tests__ src/app/__tests__/layout.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/meal-schedule src/screens/food > ../progress/t0-ext-209.log 2>&1; echo exit=$?
bun run test > ../progress/full-209-t0.log 2>&1; echo exit=$?
```

Únicos dos fallos en T0 completa, ambos flakes de la lista del handoff:

- Inicio: `#152 R8: la batería del collar se dibuja como barra › pinta 12% con bg-warning-strong (enmendado por #198 R4)`. Verde aislado: `Test Suites: 1 passed, 1 total`; `Tests: 319 passed, 319 total`; exit 0. Log `t0-home-isolated-209.log`.
- Salud: `#168 R2: Salud sin hero y con métricas estándar › pone el PetSwitcher como primer hijo de health-content (enmendado por #199 R13) (enmendado por #199 R14) (enmendado por #199 R18)`. Verde aislado: `Test Suites: 1 passed, 1 total`; `Tests: 124 passed, 124 total`; exit 0. Log `t0-health-isolated-209.log`.

Aislados con `bunx jest --runTestsByPath '<ruta>' --testTimeout=30000`, sin filtros ni cambios de test. Antes de **cada** corrida, incluidos los poscommit y sondas, ambos pgrep se ejecutaron por separado y salieron vacíos. Se esperó a los procesos externos de otros worktrees; nunca se los detuvo. No se ejecutó `./init.sh` ni E2E.

## Anclas T0

Todas coincidieron con la base; salida completa conservada también en `progress/anchors-209-t0.log`:

```text
grep -cF -- 'export async function putJson' src/api/http.ts   # R1: 0 → 1
0

grep -cF -- 'name="nutrition-profile"' src/app/_layout.tsx   # R3: 0 → 1
0

grep -cF -- 'name="edit-profile"' src/app/_layout.tsx   # R3: 1 → 1
1

grep -cF -- 'toHaveLength(8 + 1 + 1 + 1 + 1 + 1 + 1 + 1); // #194 R4' src/app/__tests__/layout.test.tsx   # R3: 1 → 0
1

grep -cF -- 'toHaveLength(8 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1); // #209 R3 // #194 R4' src/app/__tests__/layout.test.tsx   # R3: 0 → 1
0

grep -cF -- 'toHaveLength(9 + 1 + 1 + 1 + 1 + 1 + 1); // #194 R4' src/app/__tests__/layout.test.tsx   # R3: 1 → 0
1

grep -cF -- 'toHaveLength(9 + 1 + 1 + 1 + 1 + 1 + 1 + 1); // #209 R3 // #194 R4' src/app/__tests__/layout.test.tsx   # R3: 0 → 1
0

grep -cF -- 'toHaveLength(10 + 1 + 1 + 1 + 1 + 1); // #194 R4' src/app/__tests__/layout.test.tsx   # R3: 1 → 0
1

grep -cF -- 'toHaveLength(10 + 1 + 1 + 1 + 1 + 1 + 1); // #209 R3 // #194 R4' src/app/__tests__/layout.test.tsx   # R3: 0 → 1
0

grep -cF -- 'toHaveLength(11 + 1 + 1 + 1 + 1); // #194 R4' src/app/__tests__/layout.test.tsx   # R3: 1 → 0
1

grep -cF -- 'toHaveLength(11 + 1 + 1 + 1 + 1 + 1); // #209 R3 // #194 R4' src/app/__tests__/layout.test.tsx   # R3: 0 → 1
0

grep -cF -- 'Children.toArray(group.props.children).at(-1);' src/app/__tests__/layout.test.tsx   # R3: 1 → 0
1

grep -cF -- 'Children.toArray(group.props.children).at(-1 - 1); // #209 R3' src/app/__tests__/layout.test.tsx   # R3: 0 → 1
0

grep -cF -- "it('#194 R4: edit-profile es la última pantalla protegida (enmendado por #209 R3)', async () => {" src/app/__tests__/layout.test.tsx   # R3: 0 → 1
0

grep -cF -- '(enmendado por #208 R4) (enmendado por #209 R3)' src/app/__tests__/layout.test.tsx   # R3: 0 → 4
0

grep -cF -- '(enmendado por #209 R3)' src/app/__tests__/layout.test.tsx   # R3: 0 → 5
0

grep -cF -- '+ 26, // #208 R19' src/providers/__tests__/language-provider.test.tsx   # R23: 1 → 0
1

grep -cF -- '+ 26 // #208 R19' src/providers/__tests__/language-provider.test.tsx   # R23: 0 → 1
0

grep -cF -- '+ 77, // #209 R23' src/providers/__tests__/language-provider.test.tsx   # R23: 0 → 1
0

grep -cF -- '+ 5 - 2, // #220 R16' src/providers/__tests__/language-provider.test.tsx   # R23: 0 → 0
0

grep -cF -- '(enmendado por #208 R19) (enmendado por #209 R23)' src/providers/__tests__/language-provider.test.tsx   # R23: 0 → 1
0

grep -cF -- "'nutritionQuestionnaire." src/i18n/catalog.ts   # R23: 0 → 154
0

grep -cF -- "'nutritionQuestionnaire.unitKg'" src/i18n/catalog.ts   # R23: 0 → 0
0

grep -cF -- "'dateField." src/i18n/catalog.ts   # R23: 10 → 10
10

grep -cF -- "'welcome.pingoGreeting'" src/i18n/catalog.ts   # R23: 2 → 2
2

grep -cF -- 'R20_NUTRITION_QUESTIONNAIRE' src/__tests__/ui-copy-table.ts   # R23: 0 → 3
0

grep -cF -- '...R19_VACCINE_CREATE,' src/__tests__/ui-copy-table.ts   # R23: 1 → 1
1

grep -cF -- 'R19_VACCINE_CREATE, R20_NUTRITION_QUESTIONNAIRE,' src/__tests__/ui-copy-table.ts   # R23: 0 → 1
0

grep -cF -- '(enmendado por #208 R20) (enmendado por #209 R23)' src/__tests__/ui-copy-table.ts   # R23: 0 → 1
0

grep -cF -- 'R20_NUTRITION_QUESTIONNAIRE' src/__tests__/ui-language.test.ts   # R23: 0 → 3
0

grep -cF -- '+ 1 // #208 R20: screens/vaccine-create/index.tsx' src/__tests__/ui-language.test.ts   # R23: 1 → 1
1

grep -cF -- '+ 1 // #209 R23: screens/nutrition-questionnaire/index.tsx' src/__tests__/ui-language.test.ts   # R23: 0 → 1
0

grep -cF -- '(enmendado por #208 R20) (enmendado por #209 R23)' src/__tests__/ui-language.test.ts   # R23: 0 → 1
0

grep -cF -- "'Alimento dry 350 kcal/100 g'" src/screens/meal-schedule/index.test.tsx   # R22: 3 → 0
3

grep -cF -- "'Actividad medium'" src/screens/meal-schedule/index.test.tsx   # R22: 3 → 0
3

grep -cF -- "'Activity medium'" src/screens/meal-schedule/index.test.tsx   # R22: 1 → 0
1

grep -cF -- "'Food dry 350 kcal/100 g'" src/screens/meal-schedule/index.test.tsx   # R22: 1 → 0
1

grep -cF -- '(enmendado por #209 R22)' src/screens/meal-schedule/index.test.tsx   # R22: 0 → 4
0

grep -cF -- 'toHaveLength(16 + 1 + 1 + 1 + 1 + 1); // #208 R21 // #194 R6 // #191 R11 // #201 R13' src/__tests__/consistency-classnames.test.ts   # R24 #62 R1: 1 → 0
1

grep -cF -- 'toHaveLength(16 + 1 + 1 + 1 + 1 + 1 + 2); // #209 R24 // #208 R21 // #194 R6 // #191 R11 // #201 R13' src/__tests__/consistency-classnames.test.ts   # R24 #62 R1: 0 → 1
0

grep -cF -- 'expect(textInputs).toHaveLength(6 + 1 + 3); // #208 R21' src/__tests__/consistency-classnames.test.ts   # R24 #62 R12: 1 → 0
1

grep -cF -- 'expect(textInputs).toHaveLength(6 + 1 + 3 + 2); // #209 R24 // #208 R21' src/__tests__/consistency-classnames.test.ts   # R24 #62 R12: 0 → 1
0

grep -cF -- "[join('screens', 'nutrition-questionnaire', 'index.tsx'), 6], // #209 R24" src/__tests__/consistency-classnames.test.ts   # R24 #62 R14: 0 → 1
0

grep -cF -- "[join('screens', 'reset-password', 'index.tsx'), 1], // #205 R13" src/__tests__/consistency-classnames.test.ts   # R24: 1 → 1
1

grep -cF -- '+ 2 + 7 // #208 R21' src/__tests__/consistency-classnames.test.ts   # R24: 2 → 2
2

grep -cF -- '+ 6 // #209 R24' src/__tests__/consistency-classnames.test.ts   # R24 #62 R14 y #98 R10: 0 → 2
0

grep -cF -- '+ 1 - 1 - 2 // #220 R4; #220 R14; #220 R15' src/__tests__/consistency-classnames.test.ts   # R24: 2 → 2
2

grep -cF -- "'screens/food/index.tsx': 1, // #209 R24" src/__tests__/consistency-classnames.test.ts   # R24 #166 R2: 0 → 1
0

grep -cF -- "'screens/nutrition-questionnaire/index.tsx': 1, // #209 R24" src/__tests__/consistency-classnames.test.ts   # R24 #166 R2: 0 → 1
0

grep -cF -- 'toBe(4 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 5); // #209 R24 // #189 R13' src/__tests__/consistency-classnames.test.ts   # R24 #166 R3: 0 → 1
0

grep -cF -- "literalId('nutrition-questionnaire-next'), 'h-14 rounded-16 bg-accent', ['isDisabled={!canContinue}', 'onPress={() => void handleNext()}']], // #209 R24" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 CTA_ROWS: 0 → 1
0

grep -cF -- "literalId('food-create-profile'), 'w-full h-14 rounded-16 bg-accent', ['onPress={openNutritionProfile}']], // #209 R24" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 CTA_ROWS: 0 → 1
0

grep -cF -- "'screens/food/index.tsx', 'screens/profile/index.tsx', 'screens/map/index.tsx'].sort(); // #201 R13" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 consumers: 1 → 0
1

grep -cF -- '].sort(); // #201 R13 // #209 R24: sale screens/food/index.tsx, que entra por CTA_ROWS' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 consumers: 0 → 1
0

grep -cF -- "'screens/food/index.tsx': 2 + 1, // #209 R24" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 radii: 0 → 1
0

grep -cF -- "'screens/nutrition-questionnaire/index.tsx': 2, // #209 R24" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 radii: 0 → 1
0

grep -cF -- 'toBe(8 + 15 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 2); // #209 R24 // #200 R5' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 #177 R6.2 text-17: 0 → 1
0

grep -cF -- 'toBe(5 + 11 + 1 + 1 - 1 - 1 + 1 + 1 + 2); // #209 R24 // #194 R6' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 #177 R6.2 etiqueta: 0 → 1
0

grep -cF -- 'toBe(10 + 1 + 1 + 5); // #209 R24 // #189 R13' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 #177 R7.1: 0 → 1
0

grep -cF -- 'toBe(26 + 1 + 1 + 1 + 2 + 2 + 1 + 1 + 1 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 3); // #209 R24 // #204 R9' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 #177 R7.3: 0 → 1
0

grep -cF -- "toEqual({ 'screens/alerts/index.tsx': 1, 'screens/meal-schedule/index.tsx': 1 + 2 }); // #209 R24" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24 #177 R7.5: 0 → 1
0

grep -cF -- "'screens/food/index.tsx': 2 + 1, // #200 R9 // #209 R24" src/__tests__/design-drift.test.ts   # R24 #178 R13: 0 → 1
0

grep -cF -- "'screens/nutrition-questionnaire/index.tsx': 2, // #209 R24" src/__tests__/design-drift.test.ts   # R24 #178 R13: 0 → 1
0

grep -cF -- "join('screens', 'nutrition-questionnaire', 'index.tsx'), // #209 R24" src/__tests__/design-drift.test.ts   # R24 #178 R13 rounded-14: 0 → 1
0

grep -cF -- "'screens/nutrition-questionnaire/index.tsx', // #209 R24" src/__tests__/design-drift.test.ts   # R24 #179 R13 text-17: 0 → 1
0

grep -cF -- 'expect(schedule.match(/hitSlop=\{TOUCH_SLOP\}/g)).toHaveLength(1 + 2); // #209 R24' src/__tests__/design-drift.test.ts   # R24 #179 R13: 0 → 1
0

grep -cF -- "['<Text className=\"text-13 font-extrabold text-foreground\">', 2 + 2], // #209 R24" src/__tests__/design-drift.test.ts   # R24 #179 R13 etiquetas: 0 → 1
0

grep -cF -- 'expect(schedule.split(label)).toHaveLength(parts);' src/__tests__/design-drift.test.ts   # R24 #179 R13 etiquetas: 0 → 1
0

grep -cF -- 'expect(schedule.split(label)).toHaveLength(2);' src/__tests__/design-drift.test.ts   # R24 #179 R13 etiquetas: 1 → 0
1

grep -cF -- '#209 R25' src/__tests__/design-drift.test.ts   # R25: 0 → 4
0

grep -cF -- "[join('screens', 'nutrition-questionnaire', 'index.tsx'), 1], // #209 R24" src/__tests__/legibility-classnames.test.ts   # R24 #61 R4: 0 → 1
0

grep -cF -- '+ 1, // #198 R4: +1 Inicio' src/__tests__/legibility-classnames.test.ts   # R24 #61 R4: 1 → 0
1

grep -cF -- '+ 1 // #198 R4: +1 Inicio' src/__tests__/legibility-classnames.test.ts   # R24 #61 R4: 0 → 1
0

grep -cF -- '+ 1, // #209 R24' src/__tests__/legibility-classnames.test.ts   # R24 #61 R4: 0 → 1
0

grep -cF -- "'screens/meal-schedule/index.tsx', 'screens/nutrition-questionnaire/index.tsx'], // #179 R6; #174 R12; #209 R24" src/__tests__/alerts-canvas-fidelity.test.ts   # R24 #174 R12 rounded-10: 0 → 1
0

grep -cF -- "'screens/nutrition-questionnaire/index.tsx', // #209 R24" src/__tests__/alerts-canvas-fidelity.test.ts   # R24 #174 R12 text-15 y tracking-title: 0 → 2
0

grep -cF -- "'screens/nutrition-questionnaire/index.tsx', // #209 R24" src/__tests__/profile-canvas-fidelity.test.ts   # R24 #173 R2 y R2.4: 0 → 2
0

grep -cF -- '#209 R24' src/__tests__/consistency-classnames.test.ts   # R24: 0 → ≥ 8 (sube uno por cada `it` con sufijo)
0

grep -cF -- '#209 R24' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # R24: 0 → ≥ 10
0

grep -cF -- '#209 R24' src/__tests__/design-drift.test.ts   # R24: 0 → ≥ 7
0

grep -cF -- '#209 R24' src/__tests__/legibility-classnames.test.ts   # R24: 0 → ≥ 2
0

grep -cF -- '#209 R24' src/__tests__/alerts-canvas-fidelity.test.ts   # R24: 0 → ≥ 3
0

grep -cF -- '#209 R24' src/__tests__/profile-canvas-fidelity.test.ts   # R24: 0 → ≥ 2
0

grep -cF -- '## Enmienda #209' ../docs/ui-guidelines.md   # R26: 0 → 1
0

grep -cE -- '- \[[ xX]\] Enmienda #209 aprobada por humano' ../docs/ui-guidelines.md   # R26: 0 → 1
0
```

## Commits y resultados por paso

Abreviaturas de rutas relativas a mobile-pet-tracker/: API = src/api/__tests__/nutrition.test.ts; NQ = src/screens/nutrition-questionnaire/index.test.tsx; LAY = src/app/__tests__/layout.test.tsx; LP = src/providers/__tests__/language-provider.test.tsx; UI = src/__tests__/ui-language.test.ts.

En cada paso se observó el rojo antes de commitear el test y se volvió a correr tras el commit. La implementación se comprobó en verde antes y después de su commit. Los logs `*-red-209.log`, `*-red-post-209.log`, `*-green-209.log` y `*-green-post-209.log` conservan las dos corridas con el mismo resultado. Prefijos: r1, r2, r3, r23-catalog, r4, r5, r7 y r8.

| Paso | Commit | Ficheros | Salida poscommit |
|---|---|---|---|
| R1 red | `d4204afa` | API | `Tests:       1 failed, 71 passed, 72 total` |
| R1 green | `3556f473` | API | `Tests:       72 passed, 72 total` |
| R2 red | `32b84b81` | API | `Tests:       7 failed, 72 passed, 79 total` |
| R2 green | `96ff9b97` | API | `Tests:       79 passed, 79 total` |
| R3 red | `d5142938` | NQ + LAY | `Tests:       7 failed, 29 passed, 36 total` |
| R3 green | `4da4d427` | NQ + LAY | `Tests:       36 passed, 36 total` |
| R23 catálogo red | `cc0dd710` | LP (rojo); LP + UI (verde) | `Tests:       1 failed, 53 passed, 54 total` |
| R23 catálogo green | `471d4231` | LP (rojo); LP + UI (verde) | `Tests:       87 passed, 87 total` |
| R4 red | `2beed28c` | NQ | `Tests:       2 failed, 1 passed, 3 total` |
| R4 green | `2e9ce25a` | NQ | `Tests:       3 passed, 3 total` |
| R5 red | `9c8c8aa2` | NQ | `Tests:       1 failed, 3 passed, 4 total` |
| R5 green | `bc18b081` | NQ | `Tests:       4 passed, 4 total` |
| R7 red | `25bdcefc` | NQ | `Tests:       2 failed, 4 passed, 6 total` |
| R7 green | `4b45773f` | NQ | `Tests:       6 passed, 6 total` |
| R8 red | `96550549` | NQ | `Tests:       10 failed, 6 passed, 16 total` |
| R8 green | `a38be138` | NQ | `Tests:       16 passed, 16 total` |

Rojo R1: `putJson is not a function`. Rojo R2: los siete casos fallan por `upsertNutritionProfile is not a function`. Son las dos excepciones explícitamente admitidas en tasks.md. Los otros rojos fueron de aserción: nodos ausentes, cuentas y orden; ninguno por imports rotos o excepciones de producción.

R3 rojo: siete fallos, los dos tests nuevos y las cinco enmiendas de layout. Las cuentas esperaban 16 y recibían 15; edit-profile aún era el último hijo. R23 catálogo rojo: esperaba 561 claves y recibía 484. No hubo refactors ni commits que mezclaran producción y tests.

### R-id → it → hashes

| R-id | Archivo::it (nombre completo) | Rojo | Verde |
|---|---|---|---|
| R1 | API::#209 R1: putJson envía PUT con cuerpo JSON y Bearer | `d4204afa` | `3556f473` |
| R2 | API::#209 R2: upsertNutritionProfile hace PUT a nutrition-profile y devuelve ok con el perfil | `32b84b81` | `96ff9b97` |
| R2 | API::#209 R2: status 400 se mapea a invalid | `32b84b81` | `96ff9b97` |
| R2 | API::#209 R2: status 401 se mapea a unauthorized | `32b84b81` | `96ff9b97` |
| R2 | API::#209 R2: status 403 se mapea a forbidden | `32b84b81` | `96ff9b97` |
| R2 | API::#209 R2: status 404 se mapea a not-found | `32b84b81` | `96ff9b97` |
| R2 | API::#209 R2: status 500 se mapea a error | `32b84b81` | `96ff9b97` |
| R2 | API::#209 R2: sin red devuelve unreachable | `32b84b81` | `96ff9b97` |
| R3 | NQ::#209 R3: la ruta nutrition-profile es delgada y está en el Stack | `d5142938` | `4da4d427` |
| R4 | NQ::#209 R4: mientras carga pinta el esqueleto | `2beed28c` | `2e9ce25a` |
| R4 | NQ::#209 R4: si la mascota falla pinta el error de carga | `2beed28c` | `2e9ce25a` |
| R5 | NQ::#209 R5: pinta cabecera, contador «1 de 4» y la barra con un segmento hecho | `9c8c8aa2` | `bc18b081` |
| R7 | NQ::#209 R7: Actividad pinta las tres opciones con su copy | `25bdcefc` | `4b45773f` |
| R7 | NQ::#209 R7: Siguiente está desactivado hasta elegir actividad | `25bdcefc` | `4b45773f` |
| R8 | NQ::#209 R8: fila 1 pinta «Muy delgado», «Huesos muy visibles, sin grasa al tacto» y la banda blue | `96550549` | `a38be138` |
| R8 | NQ::#209 R8: fila 2 pinta «Delgado», «Costillas y cadera se ven a simple vista» y la banda blue | `96550549` | `a38be138` |
| R8 | NQ::#209 R8: fila 3 pinta «Algo delgado», «Costillas fáciles de sentir, cintura marcada» y la banda blue | `96550549` | `a38be138` |
| R8 | NQ::#209 R8: fila 4 pinta «Ideal, esbelto», «Costillas se sienten con poca grasa» y la banda green | `96550549` | `a38be138` |
| R8 | NQ::#209 R8: fila 5 pinta «Ideal», «Costillas se sienten y la cintura se ve» y la banda green | `96550549` | `a38be138` |
| R8 | NQ::#209 R8: fila 6 pinta «Algo de sobrepeso», «Algo de grasa en costillas, poca cintura» y la banda amber | `96550549` | `a38be138` |
| R8 | NQ::#209 R8: fila 7 pinta «Sobrepeso», «Costillas difíciles de sentir» y la banda amber | `96550549` | `a38be138` |
| R8 | NQ::#209 R8: fila 8 pinta «Obesidad», «No se sienten las costillas ni la cintura» y la banda rose | `96550549` | `a38be138` |
| R8 | NQ::#209 R8: fila 9 pinta «Obesidad severa», «Grasa abundante en cuello, lomo y vientre» y la banda rose | `96550549` | `a38be138` |
| R8 | NQ::#209 R8: Siguiente está desactivado hasta elegir condición | `96550549` | `a38be138` |
| R3 | LAY::#194 R4: declara ocho rutas protegidas y alerts singular (enmendado por #208 R4) (enmendado por #209 R3) | `d5142938` | `4da4d427` |
| R3 | LAY::#194 R4: declara alerts/[alertId] como décimo hijo y singular (enmendado por #208 R4) (enmendado por #209 R3) | `d5142938` | `4da4d427` |
| R3 | LAY::#194 R4: declara pets/[petId]/geofences como undécimo hijo y no singular (enmendado por #189 R1.1) (enmendado por #208 R4) (enmendado por #209 R3) | `d5142938` | `4da4d427` |
| R3 | LAY::#194 R4: declara pets/[petId]/geofence-editor como duodécimo hijo y no singular (enmendado por #189 R1.1) (enmendado por #208 R4) (enmendado por #209 R3) | `d5142938` | `4da4d427` |
| R3 | LAY::#194 R4: edit-profile es la última pantalla protegida (enmendado por #209 R3) | `d5142938` | `4da4d427` |
| R3 | LAY::#209 R3: nutrition-profile es el último hijo protegido, justo tras edit-profile | `d5142938` | `4da4d427` |
| R23 catálogo | LP::#194 R1: mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas (enmendado por #189 R15) (enmendado por #199 R5) (enmendado por #199 R9) (enmendado por #199 R14) (enmendado por #199 R17) (enmendado por #198 R15) (enmendado por #206 R8) (enmendado por #202 R10) (enmendado por #202 R18) (enmendado por #220 R16) (enmendado por #208 R19) (enmendado por #209 R23) | `cc0dd710` | `471d4231` |

R6, R9–R22, R23 tabla y R24–R26 no iniciados. R8 queda con verde funcional y sonda bloqueada por su receta; no se declara cerrado. Traceability permanece sin modificar, pues el handoff la reserva al commit final.

### Nacen verdes

Ningún it nuevo de los pasos ejecutados nació verde. Todos los casos nuevos dieron el rojo previsto en su commit de test. Las excepciones declaradas de R18, R19, R20, R21, R23 tabla y R25 aún no se han ejecutado. R5 ya construye la raíz KAV y el ScrollView que R18 prevé verificar después.

## Sondas de mutación

### R1

- Operación: `method: 'PATCH'` en `putJson`. Fichero: `src/api/http.ts`.
- Resultado: `Tests:       1 failed, 71 passed, 72 total`.
- Tests rojos:
  - #209 R1: putJson envía PUT con cuerpo JSON y Bearer
- Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/http.ts`.
- `git diff --quiet HEAD -- mobile-pet-tracker/src/api/http.ts` = **0**; `git diff --cached --quiet` = **0**.
- Log: `progress/r1-mutation-209.log`. Nunca se commiteó una sonda.

### R2

- Operación: 403 se mapea a `error`. Fichero: `src/api/nutrition.ts`.
- Resultado: `Tests:       1 failed, 78 passed, 79 total`.
- Tests rojos:
  - #209 R2: status 403 se mapea a forbidden
- Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/nutrition.ts`.
- `git diff --quiet HEAD -- mobile-pet-tracker/src/api/nutrition.ts` = **0**; `git diff --cached --quiet` = **0**.
- Log: `progress/r2-mutation-209.log`. Nunca se commiteó una sonda.

### R3

- Operación: nutrition-profile antes de edit-profile. Fichero: `src/app/_layout.tsx`.
- Resultado: `Tests:       2 failed, 33 passed, 35 total`.
- Tests rojos:
  - #194 R4: the profile editor is protected › #194 R4: edit-profile es la última pantalla protegida (enmendado por #209 R3)
  - #194 R4: the profile editor is protected › #209 R3: nutrition-profile es el último hijo protegido, justo tras edit-profile
- Restauración: `git checkout HEAD -- mobile-pet-tracker/src/app/_layout.tsx`.
- `git diff --quiet HEAD -- mobile-pet-tracker/src/app/_layout.tsx` = **0**; `git diff --cached --quiet` = **0**.
- Log: `progress/r3-mutation-209.log`. Nunca se commiteó una sonda.

### R23 catálogo

- Operación: se elimina nutritionQuestionnaire.bubbleActivity solo en en. Fichero: `src/i18n/catalog.ts`.
- Resultado: `Tests:       2 failed, 85 passed, 87 total`.
- Tests rojos:
  - #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › #194 R1: mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas (enmendado por #189 R15) (enmendado por #199 R5) (enmendado por #199 R9) (enmendado por #199 R14) (enmendado por #199 R17) (enmendado por #198 R15) (enmendado por #206 R8) (enmendado por #202 R10) (enmendado por #202 R18) (enmendado por #220 R16) (enmendado por #208 R19) (enmendado por #209 R23)
  - #65 R18: los sitios resuelven por clave y no queda copy suelta › mantiene el catálogo consistente entre los dos idiomas
- Restauración: `git checkout HEAD -- mobile-pet-tracker/src/i18n/catalog.ts`.
- `git diff --quiet HEAD -- mobile-pet-tracker/src/i18n/catalog.ts` = **0**; `git diff --cached --quiet` = **0**.
- Log: `progress/r23-catalog-mutation-209.log`. Nunca se commiteó una sonda.

### R4

- Operación: se retira el error de mascota del guard de carga. Fichero: `src/screens/nutrition-questionnaire/index.tsx`.
- Resultado: `Tests:       1 failed, 2 passed, 3 total`.
- Tests rojos:
  - #209 R4: si la mascota falla pinta el error de carga
- Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/nutrition-questionnaire/index.tsx`.
- `git diff --quiet HEAD -- mobile-pet-tracker/src/screens/nutrition-questionnaire/index.tsx` = **0**; `git diff --cached --quiet` = **0**.
- Log: `progress/r4-mutation-209.log`. Nunca se commiteó una sonda.

### R5

- Operación: `index < n` en lugar de `index <= n`. Fichero: `src/screens/nutrition-questionnaire/index.tsx`.
- Resultado: `Tests:       1 failed, 3 passed, 4 total`.
- Tests rojos:
  - #209 R5: pinta cabecera, contador «1 de 4» y la barra con un segmento hecho
- Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/nutrition-questionnaire/index.tsx`.
- `git diff --quiet HEAD -- mobile-pet-tracker/src/screens/nutrition-questionnaire/index.tsx` = **0**; `git diff --cached --quiet` = **0**.
- Log: `progress/r5-mutation-209.log`. Nunca se commiteó una sonda.

### R7

- Operación: canContinue true sin actividad. Fichero: `src/screens/nutrition-questionnaire/index.tsx`.
- Resultado: `Tests:       1 failed, 5 passed, 6 total`.
- Tests rojos:
  - #209 R7: Siguiente está desactivado hasta elegir actividad
- Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/nutrition-questionnaire/index.tsx`.
- `git diff --quiet HEAD -- mobile-pet-tracker/src/screens/nutrition-questionnaire/index.tsx` = **0**; `git diff --cached --quiet` = **0**.
- Log: `progress/r7-mutation-209.log`. Nunca se commiteó una sonda.

### R8

- Primer intento (Codex, receta original): banda de fila 7 aplicada a fila 6: amber → amber; operación sin cambio semántico ni textual. Resultado: `Tests:       16 passed, 16 total`. **mutación verde**: parada; la receta se corrigió en la Adenda 2.
- Receta de la Adenda 2 (implementer fallback): fila 6 de `BCS_ROWS` con `slot: 'rose'` (banda de la fila 8). Fichero: `src/screens/nutrition-questionnaire/index.tsx`.
- Resultado: `Tests:       1 failed, 15 passed, 16 total`, exit 1.
- Tests rojos:
  - #209 R8: fila 6 pinta «Algo de sobrepeso», «Algo de grasa en costillas, poca cintura» y la banda amber
- Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/nutrition-questionnaire/index.tsx`.
- `git diff --quiet HEAD -- mobile-pet-tracker/src/screens/nutrition-questionnaire/index.tsx` = **0**; `git diff --cached --quiet` = **0**.
- Log: `progress/r8-mutation-209.log` (sobrescrito por la corrida de la Adenda 2). Nunca se commiteó una sonda.

## Verificación de tipos, lint y ámbito

- R2: `test ! -e .expo/types/router.d.ts` = 0; `bunx tsc --noEmit` = 0, `r2-tsc-209.log` vacío.
- R3: misma guarda = 0; `bunx tsc --noEmit` = 0, `r3-tsc-209.log` vacío.
- R3: `bunx expo lint --no-cache > ../progress/lint-209.log 2>&1 && test ! -s ../progress/lint-209.log` = 0; log de 0 bytes.
- No se ejecutaron tipos ni lint tras R8: la siguiente comprobación programada está en R9, que no se inicia por la parada.
- R24pre, R24 (2b), R25, corrida completa final, anclas finales y guardas finales: pendientes; no corresponden a esta parada intermedia. Las seis guardas de inventario no se ejecutaron en vuelo.
- Casillas humanas sin modificar; no se tocó R26 ni se hizo smoke en dispositivo.
- Sin dependencias nuevas, instalaciones, variables de entorno nuevas, AWS, push o PR.

Comprobaciones acotadas al parar, todas exit 0:

```bash
cd /home/claude/sites/Pet-Tracker-wt-209/mobile-pet-tracker
git diff --quiet -- . ../docs ../specs
test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"
git diff --cached --quiet
```

La comprobación de ficheros intactos contra 48346f15 dio `intactos` (backend, arnés, estado, theme, componentes, hooks, dependencias, test/ y los dos candados protegidos).

Commits de implementación, con la base de Adenda 1:

```text
a38be138 feat(mobile): #209 R8 condición
96550549 test(mobile): #209 R8 rojo
4b45773f feat(mobile): #209 R7 actividad
25bdcefc test(mobile): #209 R7 rojo
bc18b081 feat(mobile): #209 R5 cabecera, contador y barra
9c8c8aa2 test(mobile): #209 R5 rojo
2e9ce25a feat(mobile): #209 R4 carga
2beed28c test(mobile): #209 R4 rojo
471d4231 feat(mobile): #209 R23 claves del cuestionario
cc0dd710 test(mobile): #209 R23 rojo (catálogo)
4da4d427 feat(mobile): #209 R3 ruta y Stack
d5142938 test(mobile): #209 R3 rojo
96ff9b97 feat(mobile): #209 R2 upsertNutritionProfile
32b84b81 test(mobile): #209 R2 rojo
3556f473 feat(mobile): #209 R1 putJson
d4204afa test(mobile): #209 R1 rojo
```

Ficheros versionados tocados frente a 48346f15 (alcance parcial, 11 rutas; no se aplica la exigencia de 26 rutas del cierre final):

```text
mobile-pet-tracker/src/api/__tests__/nutrition.test.ts
mobile-pet-tracker/src/api/http.ts
mobile-pet-tracker/src/api/nutrition.ts
mobile-pet-tracker/src/api/types.ts
mobile-pet-tracker/src/app/__tests__/layout.test.tsx
mobile-pet-tracker/src/app/_layout.tsx
mobile-pet-tracker/src/app/nutrition-profile.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/nutrition-questionnaire/index.test.tsx
mobile-pet-tracker/src/screens/nutrition-questionnaire/index.tsx
```

## Incidencias y desviaciones

1. En la primera sesión se leyó el handoff antes de conocer su exigencia del primer comando de identidad; esa comprobación se ejecutó inmediatamente después y coincidió. La reanudación sí comenzó por comprobar ruta y rama y leer la adenda.
2. Una lectura exploratoria de jest.config.js en la primera sesión dio No such file or directory. Se localizó la configuración real en package.json. No fue una ejecución fallida de Jest, TypeScript o ESLint y no modificó archivos.
3. La primera diferencia T0 1221 frente a 1200 quedó resuelta por Adenda 1. No se repitieron guardas ni ampliado.
4. Durante la espera por los verdes aislados de T0 se escribió solo el test R1. Su primera ejecución y commit se hicieron después de confirmar ambos verdes aislados.
5. Sonda R8: **mutación verde**, porque la receta intercambia dos bandas iguales. Se para sin inventar otra sonda. No hubo fallos imprevistos en los pasos de implementación ejecutados.
6. Este reporte queda sin commit para que el leader revise la parada. No se ejecutan las acciones del cierre final ni se emite marcador `.done`.

## Smoke del humano

Smoke del humano. Va en el reporte, tal cual. Lo corre el humano en el dev build Android (lote G4 de progress/smoke_mejoras-producto.md); tú no lo corres:
  - Nutrición, owner sin perfil: «Crear perfil nutricional» abre el cuestionario. Con otro rol, el vacío de siempre.
  - Horario, owner: «Editar perfil» con perfil y «Crear perfil nutricional» sin él. Con otro rol, ni enlaces ni «Generar plan».
  - Cuestionario:
    - los cuatro pasos y la rama de condición ≥ 7 a Peso objetivo;
    - Volver y el gesto del sistema retroceden un paso;
    - en Actividad, Volver sale.
  - Teclado: el KAV sube el pie y la CTA con el campo de peso, el de kcal y los dos «Otra».
  - Guardar y generar:
    - Generando pinta los dos anillos de ping, y ninguno con movimiento reducido activado;
    - el perfil se guarda;
    - el plan se genera y la pantalla vuelve atrás con el plan nuevo.
  - Errores: sin red, el error vuelve a Salud con las respuestas intactas.
  - en-US: el copy y las píldoras de Horario («Activity Medium», «Food Dry 350 kcal/100 g»).
  - Casillas del humano: la de smoke en dispositivo y `- [ ] Enmienda #209 aprobada por humano` de docs/ui-guidelines.md (R26).

## Continuación: subagente implementer (fallback de CLAUDE.md §Excepciones)

Codex se quedó sin cuota tras R8 verde. El leader declaró el fallback en `progress/current.md` (commit `b4f0d30f`). Desde aquí escribe el subagente `implementer` (Claude Opus 5.5), con las mismas reglas del handoff y sus Adendas 1 y 2.

Primer comando de la continuación:

```text
/home/claude/sites/Pet-Tracker-wt-209
feature/209-mobile-nutrition-questionnaire
b4f0d30f docs(progress): #209 fallback to the implementer subagent from R8 on (Codex quota at 4%)
1717ed7c docs(progress): #209 handoff addendum 2, R8 probe swaps the row 6 band for rose
a38be138 feat(mobile): #209 R8 condición
96550549 test(mobile): #209 R8 rojo
?? progress/impl_mobile-nutrition-questionnaire.md
```

Skills cargadas (catálogo de Claude Code, no el de Codex): `expo:expo-overview` (router). Las demás se anotan en el paso donde se cargan.

Sonda R8 con la receta de la Adenda 2: rojo en la fila 6, restaurada, los dos `git diff --quiet` = 0 (detalle en «Sondas de mutación › R8»).

### Bitácora por R

| Paso | Commit | Ficheros corridos | `Tests:` poscommit | exit |
|---|---|---|---|---|
| R9 test | 9ecd3ed0 `test(mobile): #209 R9 rojo` | NQ | `Tests:       4 failed, 16 passed, 20 total` (rojo por aserción: «Unable to find an element with text: Tipo de alimento / Peso objetivo»; log progress/r9-red-209.log) | 1 |
| R9 arnés | b3f04d5f `test(mobile): #209 R9 quita símbolos sin uso del arnés` | — (lint) | ver incidencia I-1 | lint 0 |
| R9 feat | c10e2660 `feat(mobile): #209 R9 rama de condición` | NQ | `Tests:       20 passed, 20 total` antes del commit; poscommit, los 4 `it` R9 verdes en la corrida del rojo de R6 | 0 |
| R9 tipos/lint | — | tsc, expo lint | `test ! -e .expo/types/router.d.ts` ok; `bunx tsc --noEmit` exit 0; lint `--no-cache` exit 0 y log de 0 bytes (tras I-1) | 0 |
| R6 test | 86b8eddb `test(mobile): #209 R6 rojo` | NQ | `Tests:       2 failed, 20 passed, 22 total` (rojo por aserción `Expected: true / Received: undefined` en `mockPreventRemove.mock.lastCall?.[0]`) | 1 |
| R6 feat | 31b34e78 `feat(mobile): #209 R6 volver entre pasos` | NQ | `Tests:       22 passed, 22 total` | 0 |

Sondas:
- R9: `bcs >= 7` → `bcs > 7` en `nextStep`. `Tests:       2 failed, 20 passed, 22 total`, exit 1. Rojos: «#209 R9: con condición 7 Siguiente va a Peso objetivo» y «#209 R6: … condición 7 vuelve a Peso objetivo» (pasa por el mismo `nextStep`). Revertida con `git checkout --`; `git diff --quiet` = 0 y `git diff --cached --quiet` = 0. Log progress/r9-mutation-209.log.
- R6: `prevStep('food')` siempre a `'condition'`. `Tests:       1 failed, 21 passed, 22 total`, exit 1. Rojo: «#209 R6: Volver desde Alimento con condición 7 vuelve a Peso objetivo». Revertida; los dos diff = 0. Log progress/r6-mutation-209.log.

Incidencias de la continuación:
- I-1 (lint en R9). El primer lint programado tras R3 (el de R9) salió con 4 avisos `@typescript-eslint/no-unused-vars` en NQ: `act`, `waitFor`, `mockRouter` y `mockPreventRemove`, que Codex importó en el rojo de R4 (2beed28c) sin que ningún `it` los usara; tras R3 no se volvió a correr lint hasta R9. No es una cifra, ancla ni guarda de la spec, y el fichero está en la lista cerrada: los quité en un commit de arnés propio (b3f04d5f, sin cambio de comportamiento: solo imports y dos `const`), para que el `feat` de R9 llevara solo producción. El rojo de R6 vuelve a importar `act`, `router`, `usePreventRemove`, `mockRouter` y `mockPreventRemove`; `waitFor` vuelve cuando un rojo lo use. Es un commit fuera de las formas del handoff: el leader decide si lo acepta.
- I-2 (espera). La primera corrida de jest (rojo de R9) usé un `pgrep` más laxo que el del handoff y no vi el jest de wt-222 en marcha; la corrida verde de R9 coincidió con él (salió verde). Desde ahí uso los dos `pgrep` exactos del handoff, cada uno en su comando, y espero al `init.sh` ajeno con `timeout 540 tail --pid=<pid> -f /dev/null` en primer plano (sin Monitor ni background).

### R10

| Paso | Commit | Ficheros corridos | `Tests:` | exit |
|---|---|---|---|---|
| R10 test | 3885d4c7 `test(mobile): #209 R10 rojo` | NQ | `Tests:       8 failed, 22 passed, 30 total` (rojo por aserción: «Unable to find an element with testID: target-weight-input» ×6, «… target-weight-change», y el texto de la burbuja; log progress/r10-red-209.log). Las filas `''` y `'10,5'` nacieron rojas (el campo no existía) | 1 |
| R10 feat | fe27ac00 `feat(mobile): #209 R10 peso objetivo` | NQ | `Tests:       30 passed, 30 total` (log progress/r10-green-209.log) | 0 |

Forma: `NumberField` (`kind`, ternario de foco, `CONTINUOUS_CORNER`, `TextInput` sin `placeholder`) y `NoteRow` (`InfoCircle` con `muted` de `useThemeColors`) como componentes locales. El resumen usa `t(bcsRow.title.labelKey)` de `BCS_ROWS`, sin literal nuevo. «kg» es literal. Validación: `isWeight` con `/^\d*\.?\d{0,2}$/` tras `,`→`.`, `> 0` y `<= 999.99`.

Sonda R10: `\d{0,2}` → `\d{0,3}` en `isWeight`. `Tests:       1 failed, 29 passed, 30 total`, exit 1. Rojo: «#209 R10: peso «12,345» desactiva Siguiente: true». Revertida con `git checkout HEAD --`; `git diff --quiet HEAD --` = 0 y `git diff --cached --quiet` = 0. Log progress/r10-mutation-209.log.

### R11

| Paso | Commit | Ficheros corridos | `Tests:` | exit |
|---|---|---|---|---|
| R11 test | 6a4d80d7 `test(mobile): #209 R11 rojo` | NQ | `Tests:       5 failed, 30 passed, 35 total` (rojo por aserción: texto de la burbuja ×4 y «Unable to find an element with testID: food-type-dry»; log progress/r11-red-209.log) | 1 |
| R11 feat | d3535d05 `feat(mobile): #209 R11 alimento y precargas` | NQ | `Tests:       35 passed, 35 total` (log progress/r11-green-209.log) | 0 |

Nota: el commit del feat salió primero con el mensaje `feat(mobile): #209 R11 alimento` (d0d49d02); lo corregí con `git commit --amend` (sin nada en el índice, solo el mensaje) a la forma del handoff antes de cualquier otro paso. Local, sin push.

Forma: `FOOD_TYPES` de módulo con `labelKey`, `kcal` y `note: { labelKey }`; chips con la receta de `OptionalChip` copiada, `accessibilityRole="radio"` y `hitSlop={TOUCH_SLOP}`, sin labio; `NumberField kind="kcal"` con la unidad `t('nutritionQuestionnaire.unitKcal')`; ayuda `text-13 font-semibold text-muted`; `NoteRow` `kcal-note` solo con tipo elegido.

Sonda R11: precarga de `wet` de `'90'` a `'350'`. `Tests:       2 failed, 33 passed, 35 total`, exit 1. Rojos: «#209 R11: wet precarga 90 kcal y su nota» y «#209 R11: cambiar de tipo sobrescribe un valor editado» (también pasa por `wet`). Revertida; los dos diff = 0. Log progress/r11-mutation-209.log.

### R12

| Paso | Commit | Ficheros corridos | `Tests:` | exit |
|---|---|---|---|---|
| R12 test | 1e6f655d `test(mobile): #209 R12 rojo` | NQ | `Tests:       3 failed, 37 passed, 40 total` (rojas por aserción `toBeDisabled` las filas `'79'`, `'601'` y `''`; log progress/r12-red-209.log) | 1 |
| R12 feat | 4b42d63d `feat(mobile): #209 R12 cotas de kcal` | NQ | `Tests:       40 passed, 40 total` (log progress/r12-green-209.log) | 0 |

- nace verde: `#209 R12: kcal «80» desactiva Siguiente: false` y `#209 R12: kcal «600» desactiva Siguiente: false`. Motivo: tras R11 la CTA de Alimento estaba siempre activa (está en la lista de «Pueden nacer verdes o rojos»). La sonda de abajo pone rojo el `'79'`; la de `'80'`/`'600'` la cubre la cota del mismo `isKcal`.
- Validación: `isKcal` con `/^\d+$/`, `>= 80` y `<= 600`; `canContinue` en Alimento es `food !== null && isKcal(kcal)`. La rama «falta el tipo» con kcal válido no tiene `it` propio en la spec (las filas de R12 eligen siempre `dry`): queda para el reviewer.

Sonda R12: cota inferior `>= 79`. `Tests:       1 failed, 39 passed, 40 total`, exit 1. Rojo: «#209 R12: kcal «79» desactiva Siguiente: true». Revertida; los dos diff = 0. Log progress/r12-mutation-209.log.

### R13

| Paso | Commit | Ficheros corridos | `Tests:` | exit |
|---|---|---|---|---|
| R13 test | d75d118b `test(mobile): #209 R13 rojo` | NQ | `Tests:       3 failed, 40 passed, 43 total` (las tres rojas por `Unable to find an element with text: Alergias`; log progress/r13-red-209.log) | 1 |
| R13 feat | 0981f9cc `feat(mobile): #209 R13 salud y otra` | NQ | `Tests:       43 passed, 43 total` (log progress/r13-green-209.log) | 0 |

- Ningún `it` nuevo nace verde.
- Forma: constantes de módulo `ALLERGIES` (8) y `DISEASES` (7) con `{ slug, labelKey }`; `otra` usa `nutritionQuestionnaire.other` en las dos. Componentes locales `HealthChips` (receta de R25, labio `isChecked ? chunkyLip.primaryCompact : undefined`, `chunkyLip` por prop con `type ChunkyLip = ReturnType<typeof useChunkyLip>;`) y `OtherField` (segundo `<TextInput`, quinto `style={CONTINUOUS_CORNER}`). Estado: dos arrays de slugs y dos textos de «Otra». Burbuja con `bubbleHealth`. Leyendas con la clase de las demás (`text-lg font-black text-foreground`).

Sonda R13: `pollo` y `carne-de-res` intercambiados en `ALLERGIES`. `Tests:       1 failed, 42 passed, 43 total`, exit 1. Rojo: «#209 R13: Salud pinta las dos listas con su copy y orden». Revertida; los dos diff = 0. Log progress/r13-mutation-209.log.

### R14

| Paso | Commit | Ficheros corridos | `Tests:` | exit |
|---|---|---|---|---|
| R14 test | 4ba22119 `test(mobile): #209 R14 rojo` | NQ | `Tests:       6 failed, 43 passed, 49 total` (cinco rojas por `expect(call).toBeDefined()`, sin PUT; la de «21 alergias» por `Unable to find an element with text: ¿Cómo está su cuerpo?`, sin precarga; log progress/r14-red-209.log) | 1 |
| R14 feat | 25f79882 `feat(mobile): #209 R14 cuerpo del PUT` | NQ | `Tests:       1 failed, 48 passed, 49 total` (log progress/r14-green-209.log) | 1 |

- Ningún `it` nuevo nace verde.
- **Desviación D-1 (orden de tasks.md, «sujeto ausente»).** `#209 R14: con 21 alergias conservadas envía 20` sigue rojo tras el feat de R14, por la misma causa que en el rojo: la spec dice que «usa el perfil precargado de R15», y la precarga (actividad, condición, kcal y los conservados) es `initialFromProfile`, que entra en el feat de R15. No adelanté R15 en el feat de R14: eso haría nacer verdes los `it` de R15, que no están en la lista. Tampoco cambié el test. Tiene que ponerse verde en el feat de R15; queda anotado allí. Para el reviewer: el rojo→verde de ese `it` es 4ba22119 → feat de R15.
- Forma: `buildInput(form, label)` pura, con `Form` como tipo local; `label` es el `t` de la pantalla (la spec dice `buildInput(form)`: el segundo argumento traduce las etiquetas de los chips, sin él la función tendría que leer el idioma y dejaría de ser pura). `bodyCondition` y `targetWeightKg` se añaden por spread condicional, así que no existen en el JSON si no aplican. `healthItems` arma cada lista: etiquetas marcadas en el orden de las constantes sin «Otra», el texto de «Otra» con trim si queda no vacío, los conservados, `new Set` para quitar duplicados exactos, `slice(0, 20)` y cada elemento a 100 caracteres. La CTA de Salud pone `phase = 'saving'` y llama a `upsertNutritionProfile(process.env.EXPO_PUBLIC_API_URL, token ?? '', pet.id, buildInput(...))`. Mientras `phase !== 'form'` la CTA queda desactivada (evita el doble envío; Generando entra en R16). Los conservados van vacíos hasta R15.

Sonda R14: `targetWeightKg` con cualquier condición (`form.target !== ''` en vez de `bcs >= 7 && …`). `Tests:       2 failed, 47 passed, 49 total`, exit 1. Rojo nuevo: «#209 R14: condición 5 omite targetWeightKg aunque se hubiera escrito antes» (el otro rojo es el D-1, ya rojo antes de la sonda). Revertida; los dos diff = 0. Log progress/r14-mutation-209.log.

### R15

| Paso | Commit | Ficheros corridos | `Tests:` | exit |
|---|---|---|---|---|
| R15 test | 392e80b9 `test(mobile): #209 R15 rojo` | NQ | `Tests:       4 failed, 48 passed, 52 total` (los tres R15 y el D-1 de R14; «precarga…» por `toHaveProp` en `activity-option-medium`, los otros por `Unable to find an element with text: ¿Cómo está su cuerpo?`; log progress/r15-red-209.log) | 1 |
| R15 feat | 6b8a9612 `feat(mobile): #209 R15 modo edición` | NQ | `Tests:       52 passed, 52 total` (log progress/r15-green-209.log) | 0 |

- Ningún `it` nuevo nace verde.
- **D-1 cerrado**: `#209 R14: con 21 alergias conservadas envía 20` pasa a verde en 6b8a9612. Su rojo→verde es 4ba22119 → 6b8a9612.
- Forma: `initialFromProfile(profile, label)` pura, con `label` = `t`, como `buildInput`. Se llama una vez en `useState(() => initialFromProfile(initial, t))` y de ahí salen los valores iniciales de cada `useState` (sin `useEffect`, como dice design.md). Actividad y tipo se estrechan buscando el valor en `ACTIVITY_OPTIONS` / `FOOD_TYPES`; peso `String(targetWeightKg ?? '')`; kcal `String(kcalPer100g)`, así que la precarga de tipo no lo pisa (solo corre al pulsar un chip). `initialHealth` recorre los textos: si coincide con la etiqueta de un chip (sin «Otra») lo marca; el primero que no coincide y mide 40 o menos marca «Otra» y rellena su campo; el resto va a `kept`, que `buildInput` añade al final.

Sonda R15: «Otra» se marca pero no se rellena (`other = text;` → `void text;`). `Tests:       1 failed, 51 passed, 52 total`, exit 1. Rojo: «#209 R15: «Pollo» marca su chip y «Maíz» rellena Otra». Revertida; los dos diff = 0. Log progress/r15-mutation-209.log.

### R16

| Paso | Commit | Ficheros corridos | `Tests:` | exit |
|---|---|---|---|---|
| R16 test | 101c7f11 `test(mobile): #209 R16 rojo` | NQ | `Tests:       4 failed, 52 passed, 56 total` (los cuatro R16, todos por `Unable to find an element with testID: nutrition-generating`; log progress/r16-red-209.log) | 1 |
| R16 feat | ed2316b1 `feat(mobile): #209 R16 generando` | NQ | `Tests:       56 passed, 56 total` (log progress/r16-green-209.log) | 0 |

- Ningún `it` nuevo nace verde.
- Esperas: `holdRequests()` sustituye la implementación de `fetchSpy` por una que devuelve promesas resueltas a mano para PUT y generate, y delega el resto (GET del perfil) en la implementación del `beforeEach`. Cada `resolve` va dentro de `await act(async () => …)` y la espera siguiente mira el nodo de la fase siguiente: la clase de la fila «Perfil guardado» (hecho) o de «Calculando calorías» (en curso), y `router.back` para el cierre. Sin timers falsos.
- La invalidación se observa con `jest.spyOn(QueryClient.prototype, 'invalidateQueries')`, porque `goToHealth()` no devuelve el `queryClient` de `renderWithProviders`; las claves se escriben a mano (`['nutrition', 'profile', 'pet-1']`, `['nutrition', 'plan', 'pet-1']`).
- Forma: `GENERATING_ROWS` es constante de módulo con `{ labelKey }` (R23). `Generating({ phase, name, checkColor })` sigue la receta de R25: escenario con los dos `PingRing` (`MOTION_PING_TIMING` por defecto del componente) o `null` con movimiento reducido, `PingoFloat` con la imagen `size-28`, y la sexta `style={CONTINUOUS_CORNER}` en la lista. La fila activa es `phase === 'saving' ? 0 : 1`; las clases del círculo y del texto son ternarios con los literales completos. El color del `Check` llega por prop (`colors[3]`, `accent-foreground`) para no abrir otro `useThemeColors`.
- `QuestionnaireForm` devuelve `<Generating …/>` cuando `phase !== 'form'` (design.md, árbol), tras todos los hooks. `usePreventRemove` pasa a `phase === 'form' && step !== 'activity'` (design.md). La CTA queda en `isDisabled={!canContinue}`, el literal que piden R24 y R25: con la salida temprana, el `|| phase !== 'form'` que tenía era código muerto.
- Los errores de PUT y generate solo cortan el flujo (`return`); devolver al formulario con el texto es R17.
- `bunx tsc --noEmit` exit 0 tras el feat (no lo pide el handoff aquí; lo corrí para no arrastrar un error de tipos hasta R18).

Sonda R16: solo se invalida el plan (se borra la línea `void queryClient.invalidateQueries({ queryKey: nutritionKeys.profile(pet.id) });`). `Tests:       1 failed, 55 passed, 56 total`, exit 1. Rojo: «#209 R16: generate ok invalida perfil y plan y vuelve atrás». Revertida; los dos diff = 0. Log progress/r16-mutation-209.log.

### R17

| Paso | Commit | Ficheros corridos | `Tests:` | exit |
|---|---|---|---|---|
| R17 test | 8b0f7d80 `test(mobile): #209 R17 rojo` | NQ | `Tests:       9 failed, 56 passed, 65 total` (las nueve filas de `ERROR_ROWS`, todas por `Unable to find an element with testID: nutrition-questionnaire-next`: el formulario no vuelve; log progress/r17-red-209.log) | 1 |
| R17 feat | ce66ba47 `feat(mobile): #209 R17 errores` | NQ | `Tests:       65 passed, 65 total` (log progress/r17-green-209.log) | 0 |

- Ningún `it` nuevo nace verde.
- `ERROR_ROWS` tiene 9 filas, una por fila de la tabla de R17, con el texto `es` literal. Las filas que agrupan varios resultados usan un representante: PUT `error` (500) para «`error`, `not-found` o `missing-config`»; generate `unprocessable` con `NUTRITION_PROFILE_REQUIRED` para «otro `unprocessable` o `error`»: en Horario ese código tiene texto propio, y aquí debe dar el genérico; y PUT `unauthorized` (401) para «`unauthorized` en cualquiera», con texto `''` = `signOut()` sin texto. `unreachable` = `fetch` rechaza con `TypeError`.
- Cada fila marca «Pollo» antes de guardar y, tras volver, aserta: Salud (`4 de 4`), «Pollo» sigue marcado (respuestas intactas), el texto en `text-danger` (o ningún nodo de error), `signOut` 1 o 0 veces, que `nutritionKeys.profile` se invalidó solo si el PUT fue `ok` (filas de generate), y que no hubo `router.back`. Todas son aserciones incondicionales: el valor esperado sale de la fila. La espera es la reaparición de `nutrition-questionnaire-next`, que pinta el mismo render que el error (`setPhase` y `setSaveError` van juntos en `backToHealth`).
- Forma: `SAVE_ERRORS` es constante de módulo (`forbidden`, `unreachable`, `weightRequired`, `generic`) con `{ labelKey }` (R23). Los dos `switch` copian el de `handleGenerate` de Horario sin extraerlo (design.md), con su `try/catch` que da el genérico. `NUTRITION_PROFILE_REQUIRED` no tiene clave propia en `SAVE_ERRORS` (R17 lo manda al genérico). El texto se pinta al final del bloque Salud, dentro del `ScrollView`.
- `step` no se toca al volver: guardar solo empieza en Salud y Generando no cambia el paso, así que «volver a Salud» = `setPhase('form')`.
- `bunx tsc --noEmit` exit 0 tras el feat.

Sonda R17: `forbidden` del PUT pinta el genérico (primer `backToHealth('forbidden')` → `backToHealth('generic')`). `Tests:       1 failed, 64 passed, 65 total`, exit 1. Rojo: «#209 R17: PUT forbidden pinta «Solo el dueño puede generar el plan»». Revertida; los dos diff = 0. Log progress/r17-mutation-209.log.

### R18

| Paso | Commit | Ficheros corridos | `Tests:` | exit |
|---|---|---|---|---|
| R18 test | f17a05e0 `test(mobile): #209 R18 teclado` | NQ | `Tests:       66 passed, 66 total` (nace verde; log progress/r18-green-209.log) | 0 |

- **Nace verde**, como declara el handoff («Nacen verdes»): la raíz literal y el `ScrollView` con `keyboardShouldPersistTaps="handled"` están desde R5. Commit del test solo (tasks.md §R18); no hay `feat`.
- El `it` aserta en render que la raíz `screen-nutrition-questionnaire` contiene la CTA (el KAV es la raíz mientras el formulario está montado) y, en el fuente, la etiqueta literal de R18 y `<ScrollView key={step} … keyboardShouldPersistTaps="handled"`. Lo de leer el fuente sigue el precedente de `src/screens/vaccine-create/index.test.tsx` (`behavior` no llega al nodo host de RNTL).
- NQ queda en 66 `it`, la cifra del desglose final del handoff.
- `bunx tsc --noEmit` exit 0. `bunx expo lint --no-cache > ../progress/lint-209.log 2>&1 && test ! -s ../progress/lint-209.log` exit 0 (log vacío).

Sonda R18: `behavior="height"`. `Tests:       1 failed, 65 passed, 66 total`, exit 1. Rojo: «#209 R18: la raíz es un KAV con behavior padding y el scroll persiste taps». Revertida; los dos diff = 0. Log progress/r18-mutation-209.log.

## Segundo relevo: subagente implementer, de R19 al cierre

HEAD de partida `f17a05e0`; `git status --short` solo daba `?? progress/impl_mobile-nutrition-questionnaire.md`. El leader aceptó I-1 (b3f04d5f) y fijó I-2 (los dos `pgrep` exactos, cada uno en su comando, y la espera con `timeout 540 tail --pid=<pid> -f /dev/null`).

Skills cargadas, con nombres del catálogo de Claude Code: `expo:expo-overview` y `expo:expo-data-fetching`. Equivalencias con el handoff, que da los nombres de Codex:
- `native-data-fetching` corresponde a `expo:expo-data-fetching`;
- `building-native-ui` corresponde a `expo:expo-native-ui`;
- `expo-tailwind-setup` corresponde a `expo:expo-tailwind-setup`.

Esperas: antes de cada jest hubo procesos ajenos (jest de wt-212 y `bash ./init.sh`). Esperé con `tail --pid` hasta que los dos `pgrep` salieron vacíos. No maté ningún proceso.

### R19

| Paso | Commit | Ficheros corridos | `Tests:` | exit |
|---|---|---|---|---|
| R19 test | 07371db1 `test(mobile): #209 R19 rojo` | FOOD | `Tests:       1 failed, 126 passed, 127 total` (rojo solo el del owner, por `Unable to find an element with testID: food-create-profile`; log progress/r19-red-209.log) | 1 |
| R19 feat | e23a0fb5 `feat(mobile): #209 R19 entrada en Nutrición` | FOOD | `Tests:       127 passed, 127 total` (log progress/r19-green-209.log) | 0 |

- Nacen verdes:
  - `#209 R19: family|walker|vet sin perfil ve el vacío actual` (3 filas);
  - `#209 R19: owner con perfil y sin plan ve el vacío actual`.
  - Motivo: antes del feat, `food-plan-empty` salía con todo plan `not-found`, y `food-profile-empty` no existía. La sonda pone rojas las tres filas de rol.
- Arnés del test:
  - el mock de `../../api/nutrition` gana `getNutritionProfile`;
  - el `beforeEach` de nivel superior lo resuelve en `ok` con un perfil literal, para que los `it` previos que dan `plan` `not-found` sigan viendo `food-plan-empty`.
- Forma:
  - `profile = useQuery({ queryKey: nutritionKeys.profile(selectedPetId ?? ''), queryFn: … getNutritionProfile …, enabled: planNotFound })`;
  - `profilePending` (plan `not-found` y perfil sin datos) se suma a `showPlanSkeletons`, así que pinta `food-plan-skeleton`;
  - `showProfileEmpty` exige plan `not-found`, perfil `not-found` y `activePet?.myRole === 'owner'`;
  - `food-plan-empty` sale si el plan es `not-found` y no se cumple ninguna de las dos condiciones anteriores;
  - la sección `food-profile-empty` está en línea, sin `EmptyState`, con la receta de R25 tal cual;
  - orden de la sección: escenario, título, cuerpo, CTA y nota, el de la lista de claves de R19;
  - `openNutritionProfile` hace `router.push({ pathname: '/nutrition-profile', params: { petId } })`.
- `bunx tsc --noEmit` exit 0 (con `test ! -e .expo/types/router.d.ts` antes).
- Para el reviewer: la receta del título no tiene clase de color (`text-center text-24 font-black tracking-title`). El título de Generando sí lleva `text-foreground`. La seguí al pie de la letra; si falta, es una enmienda de la spec.

Sonda R19: CTA para cualquier rol (`activePet?.myRole === 'owner'` → `activePet !== undefined`). `Tests:       3 failed, 124 passed, 127 total`, exit 1. Rojos: las tres filas `#209 R19: family|walker|vet sin perfil ve el vacío actual`. Revertida con `git checkout HEAD --`; `git diff --quiet HEAD --` = 0 y `git diff --cached --quiet` = 0. Log progress/r19-mutation-209.log.

### R20

| Paso | Commit | Ficheros corridos | `Tests:` | exit |
|---|---|---|---|---|
| R20 test | 616f288f `test(mobile): #209 R20 rojo` | Horario | `Tests:       2 failed, 83 passed, 85 total`. Rojos solo los dos de owner: «Unable to find an element with testID: nutrition-profile-edit» y «… nutrition-profile-create». Log progress/r20-red-209.log | 1 |
| R20 feat | 12e0c771 `feat(mobile): #209 R20 enlaces en Horario` | Horario | `Tests:       85 passed, 85 total` (log progress/r20-green-209.log) | 0 |

- Nace verde: `#209 R20: family|walker|vet no ve enlaces de perfil` (3 filas). Motivo: antes del feat los enlaces no existían. La sonda pone rojas las tres.
- Arnés del test: `import { router } from 'expo-router'` (ya mockeado en el fichero) y `const mockRouter = jest.mocked(router);`.
- Los `it` de rol esperan como `#147 R4`: `findByTestId('nutrition-profile-title')`, y después un `waitFor` con la mascota del rol en la caché y los dos enlaces a `null` en el mismo callback.
- Forma:
  - `nutrition-profile-title` va ahora en un `View` `flex-row items-center justify-between`. La fila existe para todos los roles; el enlace solo para owner.
  - `nutrition-profile-edit` lleva `accessibilityLabel={t('nutritionQuestionnaire.editProfileLabel')}` justo detrás del `testID`. El resto de la receta (`hitSlop={TOUCH_SLOP} className="h-9 …" style={chunkyLip.neutralCompact} onPress={openNutritionProfile}>`) queda como subcadena literal.
  - `nutrition-profile-create` es hermano directo, justo después de `nutrition-profile-empty`. Lleva la receta literal, sin `accessibilityLabel`.
  - `openNutritionProfile` es local y hace `router.push({ pathname: '/nutrition-profile', params: { petId } })`. Se importan `router` y `Pressable`.
- `bunx tsc --noEmit` exit 0.

Sonda R20: enlaces para cualquier rol (`isOwner ?` → `true ?` en el de editar; `&& isOwner` fuera en el de crear). `Tests:       3 failed, 82 passed, 85 total`, exit 1. Rojos: las tres filas `#209 R20: family|walker|vet no ve enlaces de perfil`. Revertida; los dos diff = 0. Log progress/r20-mutation-209.log.

### R21: PARA antes del test

R21 contradice 13 `it` existentes de Horario que la spec no lista. La spec sí tiene la tabla «Tests existentes que R22 contradice», pero R21 no tiene ninguna.

Medida, sin commit:
- Planté el feat de R21: `generate-plan-button` envuelto en `isOwner ? … : null`.
- Corrí el fichero de Horario: `Tests:       13 failed, 72 passed, 85 total`, exit 1. Log progress/r21-medida-209.log.
- Revertí con `git checkout HEAD --`; los dos diff = 0.

La causa es el `beforeEach` de nivel superior, que pone `mockGetPet.mockResolvedValue(petState('family'))`. Los `it` que pulsan o asertan `generate-plan-button` sin fijar el rol corren como familiar. Rojos:
- `describe('R8: generar plan con degradación por kind')`, 11 `it`:
  - `shows the generate button with a not-found plan`;
  - `shows the generate button with a ok plan`;
  - las siete filas `maps <kind> to "<texto>"`: forbidden, los tres unprocessable, error, missing-config y unreachable;
  - `clears a prior error and refetches the generated plan on success`;
  - `disables the generate button while the request is pending`.
- `describe('#179 R7: acciones del artboard')`, 2 `it`:
  - `el familiar solo ve Generar ocupando el ancho disponible`. Contradice R21 en su propio enunciado;
  - `el error de generar precede a las acciones como hermano`.

No escribí el test de R21 ni cambié ningún `it` existente. Lo que decide el leader:
- qué enmienda reciben esos 13 `it`. Para los 12 que solo dependen del rol por defecto, puede ser fijar `petState('owner')` con el sufijo de la regla mecánica. El del familiar contradice R21 de frente: o se invierte o se borra;
- si las enmiendas van en el mismo commit rojo de R21, como en R22;
- con qué anclas `grep -cF` se miden.

## Tercer relevo (implementer de reserva, desde R21, tras la Adenda 3)

Base del relevo: `46435453`. Skill `expo:expo-overview` ya cargada en el relevo anterior. Sin init.sh, sin fetch, sin bun install.

### R21

| Paso | Commit | Ficheros corridos | Tests: | exit |
|---|---|---|---|---|
| test | `49e7965e` | Horario | 4 failed, 85 passed, 89 total | 1 |
| feat | `b7e84064` | Horario | 89 passed, 89 total | 0 |

- Rojos del test, exactamente los previstos: `#209 R21: family|walker|vet no ve Generar plan` y `el familiar no ve ni Añadir ni Generar (enmendado por #209 R21)`. Nace verde `#209 R21: owner ve Generar plan` (lista cerrada). Los otros cinco `it` enmendados (11 casos) en verde antes y después. Log progress/r21-rojo-209.log.
- Anclas antes del commit, en `src/screens/meal-schedule/index.test.tsx`: `(enmendado por #209 R21)` = 6; `el familiar solo ve Generar ocupando el ancho disponible` = 0; `mockGetPet.mockResolvedValue(petState('owner'));` 11 → 14 (beforeEach de R8, `el error de generar…`, y el `it` owner de R21).
- Los `it` R21 van al final del fichero, a nivel superior, sin `describe` nuevo. Los de no-owner esperan además a que la caché del pet tenga el rol, como los de R20.
- Feat: `canGenerate = isOwner && (loadedPlan !== null || plan.data?.kind === 'not-found')`. Log progress/r21-verde-209.log.

Sonda R21 (Adenda 3): quitar `isOwner` de `canGenerate`. `Tests:       4 failed, 85 passed, 89 total`, exit 1. Rojos: las tres filas de roles de `#209 R21:` y el `it` invertido del familiar. Revertida; los dos diff = 0. Log progress/r21-sonda-209.log.

### R22

| Paso | Commit | Ficheros corridos | Tests: | exit |
|---|---|---|---|---|
| test | `dd6adc68` | Horario | 11 failed, 85 passed, 96 total | 1 |
| feat | `0c2be183` | Horario | 96 passed, 96 total | 0 |

- Rojos del test, los previstos: las 7 filas `#209 R22: actividad|alimento …` y los cuatro `it` enmendados con ` (enmendado por #209 R22)` (`Expected instance to have text content`). Log progress/r22-rojo-209.log.
- Anclas antes del commit: `'Alimento dry 350 kcal/100 g'` 3 → 0; `'Actividad medium'` 3 → 0; `'Activity medium'` 1 → 0; `'Food dry 350 kcal/100 g'` 1 → 0; `(enmendado por #209 R22)` 0 → 4.
- `THREE_ACTIVITIES` y `FOUR_FOODS` son constantes del test con literales a mano; los `it.each` van al final del fichero, a nivel superior.
- Feat: mapas de módulo `ACTIVITY_LABEL` y `FOOD_LABEL` con `{ labelKey: '<clave>' }` (forma de R23), tipo `Partial<Record<string, { labelKey: TranslationKey }>>`, y un `profileLabel(labels, value)` local al componente que hace `t(label.labelKey)` o devuelve el valor crudo si el backend manda un enum desconocido (`NutritionProfile.activityLevel` y `foodType` son `string`). Log progress/r22-verde-209.log.
- `test ! -e .expo/types/router.d.ts` exit 0; `bunx tsc --noEmit` exit 0; lint exit 0 con log vacío.

Sonda R22: `wet` con la clave de `dry`. `Tests:       1 failed, 95 passed, 96 total`, exit 1. Rojo: `#209 R22: alimento wet se lee «Alimento Húmedo 380 kcal/100 g»`. Revertida; los dos diff = 0. Log progress/r22-sonda-209.log.

### R23 (tabla)

| Paso | Commit | Ficheros corridos | Tests: | exit |
|---|---|---|---|---|
| test (nace verde) | `3f87d172` | ui-language | 34 passed, 34 total | 0 |

- `R20_NUTRITION_QUESTIONNAIRE`, 96 filas, justo después de `R19_VACCINE_CREATE` en src/__tests__/ui-copy-table.ts. Orden: las 82 del cuestionario en el orden en que aparecen en la fuente, luego las 4 de Nutrición y las 10 de Horario en el orden de la tabla de requirements.md §R23.
- Antes de escribirlas medí los usos con la misma regex que `checkUses` (`t('<clave>'` y `labelKey: '<clave>'`):
  - el cuestionario da 82 usos: 73 claves `nutritionQuestionnaire.*` únicas (ninguna de `profileEmptyBody`, `createProfile`, `profileEmptyNote` y `editProfileLabel`), las 7 reutilizadas, y repetidas solo `common.somethingWentWrong` y `nutritionQuestionnaire.other`;
  - en Nutrición y Horario, la diferencia entre los usos del fichero y las filas que ya tenía la tabla es exactamente las 4 y las 10 filas de la spec.
  - La producción sigue la «Forma de los usos».
- Registro en `ALL_USES` tras `...R19_VACCINE_CREATE,`, en `blocks` al final de la línea de `R19_VACCINE_CREATE,`, en el import de ui-language tras `  R19_VACCINE_CREATE,`, y `+ 1 // #209 R23: screens/nutrition-questionnaire/index.tsx` tras la de #208 R20. Sufijo ` (enmendado por #209 R23)` en los dos `#194 R5`. `describe('#209 R23: el cuestionario resuelve su copy por clave')` al final de ui-language. `#158 R1` sin tocar.
- Anclas, en ui-copy-table.ts:
  - `R20_NUTRITION_QUESTIONNAIRE` 3;
  - `...R19_VACCINE_CREATE,` 1;
  - `R19_VACCINE_CREATE, R20_NUTRITION_QUESTIONNAIRE,` 1;
  - `(enmendado por #208 R20) (enmendado por #209 R23)` 1.
- Anclas, en ui-language.test.ts:
  - `R20_NUTRITION_QUESTIONNAIRE` 3;
  - `+ 1 // #208 R20: …` 1;
  - `+ 1 // #209 R23: …` 1;
  - `(enmendado por #208 R20) (enmendado por #209 R23)` 1.
- Incidencia sin efecto: mi primer sed del sufijo también casó en `#186 R7: resuelve las 43 ocurrencias normativas …`, que acaba igual. El ancla dio 2. Lo revertí antes de correr y de commitear, y el ancla volvió a 1.
- Además corrí la suite de src/__tests__/ui-copy-table.ts (`#194 R5: cuadra ALL_USES …`): `Tests: 2 passed, 2 total`. Log progress/r23-copytable-209.log.

Sonda R23: quité `'nutritionQuestionnaire.foodWet': 'Wet',` del bloque `en`. Corrí language-provider y ui-language: `Tests:       2 failed, 86 passed, 88 total`, exit 1.
- Rojos: `#194 R1: mantiene la base más las claves de #68 … (enmendado por #208 R19) (enmendado por #209 R23)` de language-provider, y en ui-language `mantiene el catálogo consistente entre los dos idiomas`.
- El `it` de R23 no cae: `checkUses` lee la fuente de la pantalla, no el catálogo.
- Revertida; los dos diff = 0. Log progress/r23-sonda-209.log.

### R24 (1): corrida r24pre

`bun run test > ../progress/full-209-r24pre.log 2>&1` → exit=1. `Test Suites: 5 failed, 156 passed, 161 total`; `Tests: 22 failed, 5779 passed, 5801 total`. `grep -c SIGKILL` = 0, `grep -c 'failed to run'` = 0.

Rojos (22), todos en «Filas en vuelo»:
- consistency-classnames (5): `#62 R1 › deja todos los botones primarios sólidos en un único radio`, `#62 R12 › da color temático a los cinco placeholders`, `#98 R10 › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`, `#166 R2 › inventaría los diecisiete primarios con labio, fichero a fichero`, `#166 R3 › inventaría los cinco secundarios neutros de toda la app`.
- design-drift (4): `#178 R13 › reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto`, y de `#179 R13`: `limita los márgenes táctiles a Editar y las dos flechas`, `limita text-22 a Horario y text-17 al inventario de E1.2`, `ancla las tres etiquetas Text con los literales de E2.3`.
- profile-canvas-fidelity (2): `#173 R2 › reserva rounded-tile a sus consumidores aprobados`, `#173 R2.4 › limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8)`.
- chunky-cta-canvas-fidelity (8): `#177 R3.3`, `#177 R6.2`, `#177 R7.1`, `#177 R7.2`, `#177 R7.3`, `#177 R7.4`, `#177 R7.5`, `#177 R8.1`.
- alerts-canvas-fidelity (3): `#174 R12 › limita rounded-10 …`, `… text-15 …`, `… tracking-title …`.

Verdes de la lista (no es parada; se anotan):
- legibility-classnames entera: `inkSites` de `#61 R4` es una lista cerrada de ficheros y el cuestionario aún no está en ella.
- `#62 R14` (`directUses`) de consistency-classnames, por la misma razón.

Todo lo demás está verde: layout, language-provider, ui-language, Horario, detail-stack.guard, sheet-surface-background y jest-virtual-mock-lock.

Anclas de R24 antes de las enmiendas: las 44 líneas del handoff, sin las de R25 y R26, dan su cifra «antes».

### R24 (2): enmiendas de carta

| Paso | Commit | Ficheros corridos | Tests: | exit |
|---|---|---|---|---|
| enmiendas (test) | `1fc239c5` `test(mobile): #209 R24 enmiendas de carta` | las seis guardas + `src/app/__tests__/layout.test.tsx` (log `progress/r24-suites-209.log`) | `Test Suites: 7 passed, 7 total`; `Tests: 400 passed, 400 total` | 0 |

Las anclas de R24 (las 44 líneas del handoff, sin R25 ni R26), medidas después del commit, dan todas su cifra «después»: 1 → 0, 0 → 1, 2 → 2, `+ 6 // #209 R24` 0 → 2, y así en cada línea.

Cifras reales de `grep -cF '#209 R24'` (las de la spec son mínimos):

| Fichero | Real | Mínimo | Comentarios `// #209 R24` | `it` con sufijo |
|---|---|---|---|---|
| consistency-classnames | 15 | ≥ 8 | 8 | 7 |
| chunky-cta-canvas-fidelity | 22 | ≥ 10 | 10 | 12 |
| design-drift | 10 | ≥ 7 | 6 | 4 |
| legibility-classnames | 4 | ≥ 2 | 2 | 2 |
| alerts-canvas-fidelity | 4 | ≥ 3 | 3 | 1 |
| profile-canvas-fidelity | 4 | ≥ 2 | 2 | 2 |

`it` con ` (enmendado por #209 R24)`:
- consistency-classnames:
  - `#62 R1 › deja todos los botones primarios sólidos en un único radio`
  - `#62 R12 › da color temático a los cinco placeholders`
  - `#62 R14 › %s importa y aplica sus %i esquinas` (el `it.each(directUses)`)
  - `#62 R14 › fusiona la esquina una vez y la entrega a las dos ramas de Card` (el agregado)
  - `#98 R10 › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`
  - `#166 R2 › inventaría los diecisiete primarios con labio, fichero a fichero`
  - `#166 R3 › inventaría los cinco secundarios neutros de toda la app`
- chunky-cta-canvas-fidelity:
  - `#177 R3.1` y `#177 R3.2` (los `it.each(CTA_ROWS)`)
  - `#177 R3.3`, `R6.2`, `R7.1`, `R7.2`, `R7.3`, `R7.4`, `R7.5` y `R8.1`
  - `#177 R12.1/R12.2` y `#177 R12.3` (recorren `consumers`)
- design-drift:
  - `#178 R13 › reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto`
  - `#179 R13 › limita los márgenes táctiles a Editar y las dos flechas`
  - `#179 R13 › limita text-22 a Horario y text-17 al inventario de E1.2`
  - `#179 R13 › ancla las tres etiquetas Text con los literales de E2.3`
- legibility-classnames:
  - `#61 R4 › %s pinta con text-accent-strong (%i)`
  - `#61 R4 › suma las trece ocurrencias que enumera la spec`
- alerts-canvas-fidelity:
  - `#174 R12 › limita $token a su inventario de producción` (un solo `it.each`, que cubre rounded-10, text-15 y tracking-title)
- profile-canvas-fidelity:
  - `#173 R2 › reserva rounded-tile a sus consumidores aprobados`
  - `#173 R2.4 › limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8)`

Criterio de los sufijos. Seguí la regla de requirements.md §R24: «el `it` que contiene (o usa) la línea enmendada». Esa regla da cinco `it` más que los que las tablas nombran por su id:
- consistency `%s importa y aplica sus %i esquinas`: es el `it.each(directUses)`, y la fila nueva le añade un caso.
- chunky `#177 R3.1` y `#177 R3.2`: son los `it.each(CTA_ROWS)`, y las dos filas nuevas les añaden dos casos a cada uno.
- chunky `#177 R12.1/R12.2` y `#177 R12.3`: recorren `consumers`, cuya línea se enmienda.

Hay precedente:
- `#208 R21` puso el sufijo en `%s importa…`, `R3.1` y `R3.2` cuando añadió filas a `directUses` y `CTA_ROWS`.
- `#201 R13` lo puso en `R12.1/R12.2` y `R12.3` cuando cambió el literal de `consumers`.

El handoff (línea 253) pide que la lista «sea la de los `it` que nombran las tablas». Si el reviewer prefiere esa lectura, basta con quitar esos cinco sufijos: no cambian ninguna aserción.

Sonda (no commiteada): añadí un `rounded-16` en `screens/nutrition-questionnaire/index.tsx`, en la `className` del icono seleccionado de la opción. Corrí `src/__tests__/chunky-cta-canvas-fidelity.test.ts`: exit=1, `Tests: 1 failed, 87 passed, 88 total`, y el rojo es `#177 R7.3: inventario de los veintisiete radios de dieciséis …`, el previsto. Revertí con `git checkout HEAD --`. `git diff --quiet HEAD --` y `git diff --cached --quiet` dan los dos 0.

### R24 (2b): guardas y ampliado (sin commit)

| Corrida | Log | Test Suites: | Tests: | exit |
|---|---|---|---|---|
| guardas | `progress/r24-guards-209.log` | `37 passed, 37 total` | `973 passed, 973 total` | 0 |
| ampliado | `progress/r24-ext-209.log` | `40 passed, 40 total` | `1250 passed, 1250 total` | 0 |

Las dos cifras son las que pide el handoff con la Adenda 1: 973, y 1250 para el ampliado. Ningún flake.

### R25: recetas de carta (nace verde)

| Paso | Commit | Ficheros corridos | Tests: | exit |
|---|---|---|---|---|
| test (nace verde) | `d4c139d9` `test(mobile): #209 R25 recetas de carta` | `src/__tests__/design-drift.test.ts` (log `progress/r25-209.log`) | `Tests: 118 passed, 118 total` (los tres `#209 R25` en ✓) | 0 |
| guardas | — | log `progress/r25-guards-209.log` | `Test Suites: 37 passed, 37 total`; `Tests: 976 passed, 976 total` | 0 |
| ampliado | — | log `progress/r25-ext-209.log` | `Test Suites: 40 passed, 40 total`; `Tests: 1253 passed, 1253 total` | 0 |
| tsc | — | `test ! -e .expo/types/router.d.ts` = 0; `bunx tsc --noEmit` | — | 0 |
| lint | — | `bunx expo lint --no-cache > ../progress/lint-209.log 2>&1 && test ! -s ../progress/lint-209.log` | — | 0 |

«Nace verde»: el wizard sigue R25 desde R5, como prevé el handoff. No hizo falta un `feat`, así que ninguna cifra de R24 se movió. `grep -cF '#209 R25' src/__tests__/design-drift.test.ts` pasa de 0 a 4. `grep -cF '#209 R24'` en el mismo fichero sigue en 10.

El `describe('#209 R25: Cuestionario sin deriva')` va justo antes de `describe('#178 R13: Recordatorios sin deriva')`. Tiene `featureFiles = ['screens/nutrition-questionnaire/index.tsx']` y tres `it`, copiados de la forma de `#175 R10`: `MEALS_BAR_STYLE_ESCAPES`, `/text-accent(?![-\w])/` y la regex de dependencias, useThemeColor y emoji.

Antes de esas corridas tuve que esperar: había un jest de otro worktree, `Pet-Tracker-wt-216` (pid 1384417), y lo esperé con `timeout 540 tail --pid=… -f /dev/null`, que salió con 0. Después, los dos pgreps volvieron vacíos.

Sonda (no commiteada): añadí `export const probeStyles = StyleSheet.create({});` al final de `screens/nutrition-questionnaire/index.tsx`. Corrí design-drift: exit=1, `Tests: 1 failed, 117 passed, 118 total`, y el rojo es `#209 R25: no deja hex, clases arbitrarias, StyleSheet ni sombras sueltas`, el previsto. Revertí con `git checkout HEAD --`. `git diff --quiet HEAD --` y `git diff --cached --quiet` dan los dos 0.

### R26: enmienda de la carta

| Paso | Commit | Anclas |
|---|---|---|
| docs | `e2b5ab59` `docs(ui): #209 R26 enmienda` | `grep -cF '## Enmienda #209' ../docs/ui-guidelines.md`: 0 → 1. `grep -cE -- '- \[[ xX]\] Enmienda #209 aprobada por humano' ../docs/ui-guidelines.md`: 0 → 1. `grep -cF -- '- [ ] Enmienda #209 aprobada por humano'` = 1, es decir, la casilla está SIN marcar |

La sección literal de requirements.md §R26 va al final de `docs/ui-guidelines.md`, tras una línea en blanco, como la de #206. Tiene el título, las tres viñetas, una línea en blanco y la casilla. La casilla la marca el humano: las enmiendas de la carta no están delegadas (G4). R26 no cierra hasta que la marque.

### Cierre

Corrida final completa en `progress/final-test-209.log`, exit 0:
- `Test Suites: 161 passed, 161 total` y `Tests: 5810 passed, 5810 total`. Son las cifras de t0 más el delta: 160 + 1 suites y 5704 + 106 tests.
- SIGKILL = 0 y `failed to run` = 0. Ningún flake, ni siquiera los dos de t0.
- tsc y lint dan 0, medidos tras R25. Después solo cambiaron `docs/ui-guidelines.md`, esta traza y este reporte.

Guardas de cierre, todas corridas:
- `#209` en producción da 0 en los 9 ficheros de producción.
- `#209` suelto, sin `R<n>`, da 0 en los 14 ficheros de test.
- `bottom-sheet` da 0 en los 3 ficheros.
- `StyleSheet` en `src/screens/nutrition-questionnaire/index.test.tsx` da 0.
- La guarda de «intactos» imprimió `intactos` (base `48346f15`, sin `progress/current.md`).
- La lista de commits, desde `48346f15` y con las exclusiones de la Adenda 3, solo tiene commits del implementador, de `d4204afa` a `e2b5ab59`, y este de cierre.
- Ficheros tocados antes del commit de cierre: 24, en el orden de la lista del handoff. Con este commit son 26, porque entran el reporte y `specs/mobile-nutrition-questionnaire/traceability.md`.

Anclas finales:
- `#209 R24`:
  - consistency-classnames 15;
  - chunky-cta-canvas-fidelity 22;
  - design-drift 10;
  - legibility-classnames 4;
  - alerts-canvas-fidelity 4;
  - profile-canvas-fidelity 4.
- `#209 R25` en design-drift: 4.
- R26:
  - `## Enmienda #209` = 1;
  - la casilla tolerante `[ xX]` = 1;
  - la casilla sin marcar `- [ ]` = 1.

Traza: `specs/mobile-nutrition-questionnaire/traceability.md` tiene 0 filas «pendiente». Las enmiendas de LAY que R24 cita entraron con el rojo de R3 (`d5142938`).

Desviaciones abiertas para el reviewer:
1. Criterio de sufijos en R24. Seguí la regla de requirements.md, «contiene (o usa)», y no la lectura del handoff (línea 253). Eso deja cinco `it` con sufijo de más:
   - consistency `%s importa y aplica sus %i esquinas`;
   - chunky R3.1, R3.2, R12.1/R12.2 y R12.3.

   Si prefiere la lectura del handoff, basta con quitar esos cinco sufijos. No cambian ninguna aserción. Detalle en «R24 (2)».
2. Reintento de una operación en alerts-canvas-fidelity. Apunté por error a la línea 246; la correcta era la 245. El script falló en la aserción antes de escribir nada, así que no tuvo efecto (`git diff --quiet` = 0). La reapliqué con 245.
3. I-1 y la incidencia del sed de R23, ambas ya descritas arriba. Ninguna llegó a un commit.

Las dos casillas son del humano y siguen sin marcar: la de `docs/ui-guidelines.md` (R26, G4) y el smoke en dispositivo.

## Merge de dev (Adenda 4)

Subagente `implementer` (fallback de CLAUDE.md §Excepciones), 2026-10-27. HEAD de partida `d59d82ba` (cadena cerrada en `da5e5eef` y dos commits del leader en `progress/`). `origin/dev` = `fe624698`, comprobado con `git rev-parse --short origin/dev` antes del merge. No hubo fetch ni rebase. No se corrió `./init.sh` ni se usó Monitor. Commit del merge: `b81edb2b` (padres `d59d82ba` y `fe624698`).

### Conflictos

`git merge origin/dev` dejó en conflicto exactamente los 13 ficheros de la lista de la adenda, ni uno más ni uno menos. Cada uno se resolvió como la unión de los dos lados. En cada fichero, `git diff fe624698` muestra solo lo que #209 añade y `git diff da5e5eef` solo lo que añade `dev`.

| Fichero | Lo que aporta `dev` | Lo que aporta #209 |
|---|---|---|
| `src/__tests__/alerts-canvas-fidelity.test.ts` | `pet-members` en `rounded-10` (#214 R12), `join-pet` en `tracking-title` (#214 R18) y sus sufijos | `nutrition-questionnaire` en las dos listas y ` (enmendado por #209 R24)` al final de la cadena. Además, la fila de `food` en `tracking-title` (ver abajo) |
| `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | las 4 filas de #214 en `CTA_ROWS`, la línea de `neutralInventory` y los términos de #213 y #214 | las 2 filas de #209 en `CTA_ROWS` (`nutrition-questionnaire-next`, `food-create-profile`), la línea de `consumers` sin `food` y los términos `+ 2`, `+ 5`, `+ 3` y `1 + 2` con `// #209 R24` delante. Sufijo ` (enmendado por #209 R24)` tras la cadena de `dev` en R3.1, R3.2, R3.3, R6.2, R7.1, R7.2, R7.3, R7.4, R7.5 y R8.1 |
| `src/__tests__/consistency-classnames.test.ts` (12 conflictos) | los términos y sufijos de #213 y #214, `withPlaceholder` `5 + 3 + 1` | los términos `+ 2`, `+ 6` y `+ 5` al final con `// #209 R24`, y el sufijo tras la cadena de `dev` |
| `src/__tests__/design-drift.test.ts` | la cadena de sufijos de dos `it` | ` (enmendado por #209 R24)` al final de esas dos cadenas. El resto se mezcló solo |
| `src/__tests__/profile-canvas-fidelity.test.ts` | las rutas y sufijos de #214 (`pet-invite`, `pet-members`, `join-pet`) | `nutrition-questionnaire` en orden alfabético y el sufijo al final |
| `src/__tests__/ui-copy-table.ts` | `R21_PET_MEMBERS` y su sitio en `ALL_USES` y `blocks` | `R20_NUTRITION_QUESTIONNAIRE` antes de `R21` en la tabla, en `ALL_USES` y en `blocks`. Cadena `(enmendado por #208 R20) (enmendado por #214 R22) (enmendado por #209 R23)` |
| `src/__tests__/ui-language.test.ts` | el import de `R21`, `+ 3 // #214 R22…` en `SCREEN_FILES` y los describes de #222 R8 y #214 R22 | el import de `R20` antes de `R21`, `+ 1 // #209 R23: screens/nutrition-questionnaire/index.tsx` después del término de #214, el describe de #209 R23 (96 filas) tras los de `dev` y el sufijo |
| `src/app/__tests__/layout.test.tsx` (8 conflictos) | las rutas `members`, `invite`, `join-pet` (#214) y `edit-profile` (#217), con sus términos | el `Stack.Screen` de `nutrition-profile` (R3) en el orden del `_layout.tsx` mezclado (el último), el término `+ 1` al final con `// #209 R3` delante y el sufijo `(enmendado por #214 R3) (enmendado por #209 R3)` |
| `src/i18n/catalog.ts` | las claves de #213, #214 y #222, en `es` y en `en` | las claves `nutritionQuestionnaire.*` detrás, en los dos idiomas. Sin claves duplicadas, 658 por idioma, `'nutritionQuestionnaire.` = 154 |
| `src/providers/__tests__/language-provider.test.tsx` | `+ 54 // #213 R22`, `+ 1 // #222 R8`, `+ 51 // #214 R22` y sus sufijos | `+ 77, // #209 R23` al final y ` (enmendado por #209 R23)` al final de la cadena |
| `src/screens/food/index.tsx` (solo los imports) | la estructura de #222: `food-root`, `food-heading` oculto, sin fila de título, `TabPetHeader` al final; import de `TabPetHeader` y fuera `PetSwitcher` | el import de `PingoFloat` y el resto de R19, mezclado solo: `Image`, `getNutritionProfile`, `openNutritionProfile` y el bloque `food-profile-empty` justo antes de `food-plan-empty` |
| `src/screens/food/index.test.tsx` | los describes `#222 R7` y `#222 R4` | los tres `it` de #209 R19 al final, a nivel superior. El mock de `getNutritionProfile` y el helper `foodChild` se mezclaron solos |
| `progress/current.md` | las secciones de #214 y #212, enteras | la sección de #209, entera, detrás. Nada nuevo |

**Producción = unión de los dos lados.** Para los 9 ficheros de producción de #209 (`http.ts`, `nutrition.ts`, `types.ts`, `_layout.tsx`, `nutrition-profile.tsx`, `catalog.ts`, `food/index.tsx`, `meal-schedule/index.tsx` y `nutrition-questionnaire/index.tsx`), las líneas `+`/`-` de `git diff fe624698 HEAD` coinciden (ordenadas, `md5sum`) con las de `git diff b185ae61 da5e5eef`. Las de `git diff da5e5eef HEAD` en `_layout.tsx`, `catalog.ts` y `food/index.tsx` coinciden con las de `git diff b185ae61 fe624698`. No cambió ni una línea de producción fuera de la unión.

**Nodos de R19 y #222.** #222 envolvió la pantalla en `<View testID="food-root">` y añadió el `food-heading` oculto, pero no tocó el contenido del `ScrollView`. El bloque `food-profile-empty` sigue en el mismo padre, como hermano anterior de `food-plan-empty`. Los cuatro `it` de R19 (con los tres roles del `it.each`) pasan sin cambios. No hubo PARA.

**Cuenta que el merge dejó mal (1).** `alerts-canvas-fidelity.test.ts`, `#174 R12`, inventario de `tracking-title`:
- En la base, `food` estaba en la lista por su título.
- #222 R9 quitó ese título y sacó `food` de la lista.
- #209 R19 había añadido otro `tracking-title` en `food`, el del vacío del perfil (`text-center text-24 font-black tracking-title`).

La unión deja `food` con un `tracking-title` y la lista sin `food`. Las guardas dieron rojo con `+   "screens/food/index.tsx"`. Arreglo, en el commit del merge: la fila `'screens/food/index.tsx', // #209 R24: el título de R19 sigue tras quitar #222 R9 el de la pantalla`, en su sitio alfabético. Es la cifra de `dev` más el delta de #209, solo en el test. Producción no se tocó.

### Instalación y verificación

- `bun install --frozen-lockfile`, exit 0: `+ expo-clipboard@57.0.2`, `1 package installed`.
- `test ! -e .expo/types/router.d.ts`: no existe. `bunx tsc --noEmit`: exit 0.
- `bunx expo lint --no-cache > ../progress/lint-209.log 2>&1 && test ! -s ../progress/lint-209.log`: exit 0, log de 0 bytes.
- Las seis guardas de R24 más layout (comando de R24 (2), con `--testTimeout=30000`):
  - primera corrida: `Tests: 1 failed, 423 passed, 424 total`. El rojo era la cuenta de `tracking-title` descrita arriba;
  - tras el arreglo: `Test Suites: 7 passed, 7 total`, `Tests: 424 passed, 424 total`, exit 0.
- Los ficheros en conflicto con test propio (`food/index.test.tsx`, `ui-language.test.ts` y `language-provider.test.tsx`) más `nutrition-questionnaire/index.test.tsx`: `Test Suites: 4 passed, 4 total`, `Tests: 348 passed, 348 total`, exit 0. Los `● Console` son el `console.warn` de Uniwind (`--color-accent`) y el `console.info` de HeroUI, los mismos de antes.
- Suite completa, con los dos pgreps vacíos antes de empezar: `bun run test > ../progress/merge-test-209.log 2>&1; echo exit=$?` dio `exit=0`.

```
Test Suites: 168 passed, 168 total
Tests:       6183 passed, 6183 total
Snapshots:   1 passed, 1 total
Time:        227.537 s
```

  `SIGKILL` = 0, `failed to run` = 0, `FAIL` = 0, `PASS` = 168. Cuadra con la cifra del leader. No cayó ningún flake, así que no hubo reruns.

### Anclas de R23 a R26, antes y después del merge

Las líneas 184 a 252 del handoff, que incluyen también las de R22 (201 a 205). Se midieron con el mismo `grep -c` en `git show da5e5eef:<ruta>` y en el árbol mezclado. Las rutas son relativas a `mobile-pet-tracker/src/`, salvo `docs/`. La columna «Base → después del handoff» copia el comentario del handoff (`b185ae61` → `da5e5eef`). Las 12 diferencias tienen su causa en `dev` (#213, #214 o #222) o en la cuenta de arriba. Ninguna queda sin explicar.

| Línea del handoff | Fichero | `da5e5eef` | Tras el merge | Base → después del handoff | Causa de la diferencia |
|---|---|---|---|---|---|
| 184 | `providers/__tests__/language-provider.test.tsx` | 0 | 0 | R23: 1 → 0 | igual |
| 185 | `providers/__tests__/language-provider.test.tsx` | 1 | 1 | R23: 0 → 1 | igual |
| 186 | `providers/__tests__/language-provider.test.tsx` | 1 | 1 | R23: 0 → 1 | igual |
| 187 | `providers/__tests__/language-provider.test.tsx` | 0 | 0 | R23: 0 → 0 | igual |
| 188 | `providers/__tests__/language-provider.test.tsx` | 1 | 0 | R23: 0 → 1 | #213 R22, #222 R8 y #214 R22 se meten entre `#208 R19` y `#209 R23`; la cadena tras el merge es `(enmendado por #208 R19) (enmendado por #213 R22) (enmendado por #222 R8) (enmendado por #214 R22) (enmendado por #209 R23)` (1 línea) |
| 189 | `i18n/catalog.ts` | 154 | 154 | R23: 0 → 154 | igual |
| 190 | `i18n/catalog.ts` | 0 | 0 | R23: 0 → 0 | igual |
| 191 | `i18n/catalog.ts` | 10 | 10 | R23: 10 → 10 | igual |
| 192 | `i18n/catalog.ts` | 2 | 2 | R23: 2 → 2 | igual |
| 193 | `__tests__/ui-copy-table.ts` | 3 | 3 | R23: 0 → 3 | igual |
| 194 | `__tests__/ui-copy-table.ts` | 1 | 1 | R23: 1 → 1 | igual |
| 195 | `__tests__/ui-copy-table.ts` | 1 | 1 | R23: 0 → 1 | igual |
| 196 | `__tests__/ui-copy-table.ts` | 1 | 0 | R23: 0 → 1 | #214 R22 se mete entre `#208 R20` y `#209 R23`: `(enmendado por #208 R20) (enmendado por #214 R22) (enmendado por #209 R23)` (1 línea) |
| 197 | `__tests__/ui-language.test.ts` | 3 | 3 | R23: 0 → 3 | igual |
| 198 | `__tests__/ui-language.test.ts` | 1 | 1 | R23: 1 → 1 | igual |
| 199 | `__tests__/ui-language.test.ts` | 1 | 1 | R23: 0 → 1 | igual |
| 200 | `__tests__/ui-language.test.ts` | 1 | 0 | R23: 0 → 1 | igual que 196 en el `it` `#194 R5` (1 línea) |
| 201 | `screens/meal-schedule/index.test.tsx` | 0 | 0 | R22: 3 → 0 | igual |
| 202 | `screens/meal-schedule/index.test.tsx` | 0 | 0 | R22: 3 → 0 | igual |
| 203 | `screens/meal-schedule/index.test.tsx` | 0 | 0 | R22: 1 → 0 | igual |
| 204 | `screens/meal-schedule/index.test.tsx` | 0 | 0 | R22: 1 → 0 | igual |
| 205 | `screens/meal-schedule/index.test.tsx` | 4 | 4 | R22: 0 → 4 | igual |
| 206 | `__tests__/consistency-classnames.test.ts` | 0 | 0 | R24 #62 R1: 1 → 0 | igual |
| 207 | `__tests__/consistency-classnames.test.ts` | 1 | 0 | R24 #62 R1: 0 → 1 | #214 R13, R15, R18, R20 suman `+ 4` antes del `+ 2` de #209: `toHaveLength(16 + 1 + 1 + 1 + 1 + 1 + 4 + 2); // #209 R24 // #208 R21 // #194 R6 // #191 R11 // #201 R13 // #214 R13, R15, R18, R20` |
| 208 | `__tests__/consistency-classnames.test.ts` | 0 | 0 | R24 #62 R12: 1 → 0 | igual |
| 209 | `__tests__/consistency-classnames.test.ts` | 1 | 0 | R24 #62 R12: 0 → 1 | #214 R18 suma `+ 1` antes del `+ 2` de #209: `toHaveLength(6 + 1 + 3 + 1 + 2); // #209 R24 // #208 R21 // #214 R18` |
| 210 | `__tests__/consistency-classnames.test.ts` | 1 | 1 | R24 #62 R14: 0 → 1 | igual |
| 211 | `__tests__/consistency-classnames.test.ts` | 1 | 1 | R24: 1 → 1 | igual |
| 212 | `__tests__/consistency-classnames.test.ts` | 2 | 2 | R24: 2 → 2 | igual |
| 213 | `__tests__/consistency-classnames.test.ts` | 2 | 2 | R24 #62 R14 y #98 R10: 0 → 2 | igual |
| 214 | `__tests__/consistency-classnames.test.ts` | 2 | 2 | R24: 2 → 2 | igual |
| 215 | `__tests__/consistency-classnames.test.ts` | 1 | 1 | R24 #166 R2: 0 → 1 | igual |
| 216 | `__tests__/consistency-classnames.test.ts` | 1 | 1 | R24 #166 R2: 0 → 1 | igual |
| 217 | `__tests__/consistency-classnames.test.ts` | 1 | 0 | R24 #166 R3: 0 → 1 | #213 R6 (+2), #213 R17 (+1) y #214 R7, R11, R15, R17 (+4) entran antes del `+ 5` de #209: `toBe(4 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 4 + 5); // #209 R24 // #213 R6 (+2); #213 R17 (+1) // #214 R7, R11, R15, R17; #189 R13; …` |
| 218 | `__tests__/chunky-cta-canvas-fidelity.test.ts` | 1 | 1 | R24 CTA_ROWS: 0 → 1 | igual |
| 219 | `__tests__/chunky-cta-canvas-fidelity.test.ts` | 1 | 1 | R24 CTA_ROWS: 0 → 1 | igual |
| 220 | `__tests__/chunky-cta-canvas-fidelity.test.ts` | 0 | 0 | R24 consumers: 1 → 0 | igual |
| 221 | `__tests__/chunky-cta-canvas-fidelity.test.ts` | 1 | 1 | R24 consumers: 0 → 1 | igual |
| 222 | `__tests__/chunky-cta-canvas-fidelity.test.ts` | 1 | 1 | R24 radii: 0 → 1 | igual |
| 223 | `__tests__/chunky-cta-canvas-fidelity.test.ts` | 1 | 1 | R24 radii: 0 → 1 | igual |
| 224 | `__tests__/chunky-cta-canvas-fidelity.test.ts` | 1 | 0 | R24 #177 R6.2 text-17: 0 → 1 | #213 R17 (+2) y #214 R13, R15, R18, R20 (+4) entran antes del `+ 2` de #209: `toBe(8 + 15 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 2 + 4 + 2); // #209 R24 // #200 R5; …` |
| 225 | `__tests__/chunky-cta-canvas-fidelity.test.ts` | 1 | 0 | R24 #177 R6.2 etiqueta: 0 → 1 | #214 R13, R15, R18, R20 (+4) entran antes del `+ 2` de #209: `toBe(5 + 11 + 1 + 1 - 1 - 1 + 1 + 1 + 4 + 2); // #209 R24 // #194 R6 …` |
| 226 | `__tests__/chunky-cta-canvas-fidelity.test.ts` | 1 | 0 | R24 #177 R7.1: 0 → 1 | #213 R6, R17 (+2, +1) y #214 R7, R11, R15, R17 (+4) entran antes del `+ 5` de #209: `toBe(10 + 1 + 1 + 2 + 1 + 4 + 5); // #209 R24 // #213 R6 (+2); …` |
| 227 | `__tests__/chunky-cta-canvas-fidelity.test.ts` | 1 | 0 | R24 #177 R7.3: 0 → 1 | `dev` suma `+ 3` (#213 R6 +1, #213 R17 +2) y `+ 11` (#214 R7, R11, R13, R15, R16, R17, R18, R20) antes del `+ 3` de #209: `toBe(26 + … + 1 + 3 + 11 + 3); // #209 R24 // #214 R7, …`. El `+ 3` final es el de #209 |
| 228 | `__tests__/chunky-cta-canvas-fidelity.test.ts` | 1 | 1 | R24 #177 R7.5: 0 → 1 | igual |
| 229 | `__tests__/design-drift.test.ts` | 1 | 1 | R24 #178 R13: 0 → 1 | igual |
| 230 | `__tests__/design-drift.test.ts` | 1 | 1 | R24 #178 R13: 0 → 1 | igual |
| 231 | `__tests__/design-drift.test.ts` | 1 | 1 | R24 #178 R13 rounded-14: 0 → 1 | igual |
| 232 | `__tests__/design-drift.test.ts` | 1 | 1 | R24 #179 R13 text-17: 0 → 1 | igual |
| 233 | `__tests__/design-drift.test.ts` | 1 | 1 | R24 #179 R13: 0 → 1 | igual |
| 234 | `__tests__/design-drift.test.ts` | 1 | 1 | R24 #179 R13 etiquetas: 0 → 1 | igual |
| 235 | `__tests__/design-drift.test.ts` | 1 | 1 | R24 #179 R13 etiquetas: 0 → 1 | igual |
| 236 | `__tests__/design-drift.test.ts` | 0 | 0 | R24 #179 R13 etiquetas: 1 → 0 | igual |
| 237 | `__tests__/design-drift.test.ts` | 4 | 4 | R25: 0 → 4 | igual |
| 238 | `__tests__/legibility-classnames.test.ts` | 1 | 1 | R24 #61 R4: 0 → 1 | igual |
| 239 | `__tests__/legibility-classnames.test.ts` | 0 | 0 | R24 #61 R4: 1 → 0 | igual |
| 240 | `__tests__/legibility-classnames.test.ts` | 1 | 1 | R24 #61 R4: 0 → 1 | igual |
| 241 | `__tests__/legibility-classnames.test.ts` | 1 | 1 | R24 #61 R4: 0 → 1 | igual |
| 242 | `__tests__/alerts-canvas-fidelity.test.ts` | 1 | 0 | R24 #174 R12 rounded-10: 0 → 1 | #214 R12 añade `screens/pet-members/index.tsx` al final de la lista de `rounded-10` y `#214 R12` al comentario: `…, 'screens/nutrition-questionnaire/index.tsx', 'screens/pet-members/index.tsx'], // #179 R6; #174 R12; #214 R12; #209 R24` |
| 243 | `__tests__/alerts-canvas-fidelity.test.ts` | 2 | 2 | R24 #174 R12 text-15 y tracking-title: 0 → 2 | igual |
| 244 | `__tests__/profile-canvas-fidelity.test.ts` | 2 | 2 | R24 #173 R2 y R2.4: 0 → 2 | igual |
| 245 | `__tests__/consistency-classnames.test.ts` | 15 | 15 | R24: 0 → ≥ 8 (sube uno por cada `it` con sufijo) | igual |
| 246 | `__tests__/chunky-cta-canvas-fidelity.test.ts` | 22 | 22 | R24: 0 → ≥ 10 | igual |
| 247 | `__tests__/design-drift.test.ts` | 10 | 10 | R24: 0 → ≥ 7 | igual |
| 248 | `__tests__/legibility-classnames.test.ts` | 4 | 4 | R24: 0 → ≥ 2 | igual |
| 249 | `__tests__/alerts-canvas-fidelity.test.ts` | 4 | 5 | R24: 0 → ≥ 3 | +1 por la fila `'screens/food/index.tsx', // #209 R24: …` en `tracking-title` (ver «Cuenta que el merge dejó mal»). Sigue ≥ 3 |
| 250 | `__tests__/profile-canvas-fidelity.test.ts` | 4 | 4 | R24: 0 → ≥ 2 | igual |
| 251 | `docs/ui-guidelines.md` | 1 | 1 | R26: 0 → 1 | igual |
| 252 | `docs/ui-guidelines.md` | 1 | 1 | R26: 0 → 1 | igual |

Cifras reales de los «≥» de R24 tras el merge:
- `consistency-classnames` 15;
- `chunky-cta` 22;
- `design-drift` 10;
- `legibility` 4;
- `alerts` 5 (4 en `da5e5eef`; +1 por la fila de `food`);
- `profile` 4.

### Comprobaciones de cierre (punto 5)

- **Commits.** `git log --oneline --first-parent 48346f15..HEAD -- . ':!progress/handoff_mobile-nutrition-questionnaire.md' ':!specs/mobile-nutrition-questionnaire/requirements.md' ':!specs/mobile-nutrition-questionnaire/tasks.md' ':!progress/current.md'` daba 52 líneas antes del commit de este reporte:
  - el merge `b81edb2b`;
  - los 51 commits de la cadena, de `d4204afa` a `da5e5eef`.

  Con el commit de este reporte (`docs(mobile): #209 report after the dev merge`) son 53. Ni uno más.
- **Ficheros tocados.** `git diff --name-only fe624698 HEAD -- mobile-pet-tracker docs` da 24 rutas, que son exactamente las 24 primeras de la lista del Cierre y en el mismo orden: de `docs/ui-guidelines.md` a `mobile-pet-tracker/src/screens/nutrition-questionnaire/index.tsx`.
- **Intactos.** `git diff --quiet fe624698 HEAD -- backend-pet-tracker init.sh init.config.sh STATUS.md progress/history.md mobile-pet-tracker/src/theme mobile-pet-tracker/src/components mobile-pet-tracker/src/hooks mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/test mobile-pet-tracker/src/__tests__/sheet-surface-background.test.ts mobile-pet-tracker/src/app/__tests__/detail-stack.guard.test.tsx && echo intactos` da `intactos`.
- **Guardas de «Guardas que R1 a R26 cruzan», sobre el árbol mezclado:**
  - `grep -c '#209'` = 0 en los 9 ficheros de producción: `http.ts`, `types.ts`, `nutrition.ts`, `nutrition-profile.tsx`, `_layout.tsx`, `nutrition-questionnaire/index.tsx`, `food/index.tsx`, `meal-schedule/index.tsx` y `catalog.ts`;
  - `grep -cP -- '#209(?! R[0-9])'` = 0 en los 14 ficheros de test tocados (los 13 `*.test.ts(x)` y `ui-copy-table.ts`);
  - `@expo/ui/community/bottom-sheet` = 0 en `nutrition-questionnaire`, `food` y `meal-schedule`;
  - `StyleSheet` = 0 en `nutrition-questionnaire/index.test.tsx`;
  - `grep -cF -- '- [ ] Enmienda #209 aprobada por humano' ../docs/ui-guidelines.md` = 1: la casilla de R26 sigue sin marcar.
- **`traceability.md`** no se tocó: `git diff --quiet da5e5eef HEAD -- specs/mobile-nutrition-questionnaire/traceability.md`. Los hashes de la cadena siguen valiendo porque no hubo rebase.
- **`git diff --cached --check`** solo avisa de espacios en tres ficheros que vienen tal cual de `dev`: `tab-pet-header.test.tsx`, `firma_mobile-pet-members.md` y `fix-r21…/c1.patch`. `git diff --cached fe624698 --check` sale limpio.

### Notas para el reviewer

- La única edición fuera de las líneas en conflicto es la fila de `food` en `tracking-title`. Una mutación que borre el `tracking-title` del vacío de R19 en `food/index.tsx` vuelve a poner esa guarda en rojo.
- Los logs de esta adenda (`progress/lint-209.log`, `guards-209.log`, `conflicted-209.log` y `merge-test-209.log`) están ignorados por `.gitignore` (`*.log`) y no se commitean.

## Corrección tras la primera revisión (Adenda 5)

Relevo: subagente `implementer` (fallback de Codex, cuota agotada; ver `progress/current.md`), 2026-10-27. Skill cargada: `expo:expo-overview`. Spec: errata ronda 6 (`3c31d6b5`) en R4, R5, R16 y R19.

### Punto de partida

- `pwd` = `/home/claude/sites/Pet-Tracker-wt-209`; branch `feature/209-mobile-nutrition-questionnaire`.
- `git log --oneline -2`: `28cb9ecc docs(progress): #209 handoff Adenda 5 (fixes for the first review)` / `3c31d6b5 docs(spec): #209 errata round 6 for the first review (F1, F2)`. **H5 = `28cb9ecc`**.
- `progress/impl_mobile-nutrition-questionnaire.done` no existía al empezar.

### T0 sobre el merge (punto 1)

Los dos pgreps vacíos antes de cada corrida de jest de esta adenda.
- `bun install --frozen-lockfile`: `Checked 1324 installs across 1145 packages (no changes)`, exit 0.
- `test ! -e .expo/types/router.d.ts` exit 0; `bunx tsc --noEmit` exit 0.
- `bun run test > ../progress/t0-adenda5-209.log 2>&1`: exit=0, `Test Suites: 168 passed, 168 total`, `Tests: 6217 passed, 6217 total` (178 s). SIGKILL = 0, `failed to run` = 0. Cuadra con la cifra del leader. Ningún flake.

### Cadena (punto 2)

Cada commit, con los dos ficheros (`src/screens/nutrition-questionnaire/index.test.tsx` y `src/screens/food/index.test.tsx`) en «Jest de un fichero»:

| # | Commit | Corrida | `Tests:` |
|---|---|---|---|
| 1 | `63d4295e` test(mobile): #209 R4 rojo (errata ronda 6) | `a5-c1-209.log`, exit 1 | `Tests: 1 failed, 201 passed, 202 total` |
| 2 | `f75ece10` feat(mobile): #209 R4 inset y volver en la carga y el error | `a5-c2-209.log`, exit 0 | `Tests: 202 passed, 202 total` |
| 3 | `5333d27c` test(mobile): #209 R5 R16 R19 rojo (errata ronda 6) | `a5-c3-209.log`, exit 1 | `Tests: 3 failed, 202 passed, 205 total` |
| 4 | `fbff52ee` feat(mobile): #209 R5 R16 R19 Pingo por style | `a5-c4-209.log`, exit 0 | `Tests: 205 passed, 205 total` |

Rojos, todos por aserción o por «Unable to find» de RNTL (ninguna excepción de producción):
- Commit 1, `#209 R4: esqueleto y error de carga respetan el inset superior y el error tiene volver`: `expect(skeleton.props.style).toEqual({ paddingTop: 52 })` → `Expected: {"paddingTop": 52}` / `Received: undefined`.
- Commit 3:
  - `#209 R5: Pingo de la burbuja mide 52 pt y 44 pt en Condición por style` → `Unable to find an element with testID: nutrition-questionnaire-pingo`;
  - `#209 R16: Pingo de Generando mide 112 pt por style` → `Unable to find an element with testID: nutrition-generating-pingo-image`;
  - `#209 R19: Pingo de NutricionSinPerfil mide 150 pt por style` → `Unable to find an element with testID: food-profile-pingo-image`.

Producción:
- `nutrition-questionnaire/index.tsx`: `NutritionQuestionnaireScreen` llama a `const insets = useSafeAreaInsets();` tras el `useEffect` y antes del primer `return`. El esqueleto y el error de carga son los dos contenedores literales de R4. El `Text` del error y los dos `Skeleton` no cambian. Las dos `Image` (Generando y burbuja) llevan los literales de R16 y R5: `testID`, `style` y sin `className`.
- `food/index.tsx`: la `Image` de `food-profile-pingo` lleva el literal de R19.

Guardas tras el commit 4 (los dos pgreps vacíos):
- T0 guardas (`a5-guards-209.log`): exit=0, `Test Suites: 37 passed, 37 total`, `Tests: 1010 passed, 1010 total`.
- T0 ampliado (`a5-ext-209.log`): exit=0, `Test Suites: 40 passed, 40 total`, `Tests: 1351 passed, 1351 total`.

### Sondas (punto 3)

Cada una sobre el árbol del commit 4, con solo su `it` (`-t`), revertida con `git checkout HEAD -- <fichero>`. Tras cada reversión, `git diff --quiet HEAD -- <fichero>` = 0 y `git diff --cached --quiet` = 0. Ninguna se commiteó.

| Sonda | Fichero | `it` que cae | Salida |
|---|---|---|---|
| R4: `paddingTop: insets.top + 12` → `insets.top` en la rama del error | `nutrition-questionnaire/index.tsx` | `#209 R4: esqueleto y error de carga respetan el inset superior y el error tiene volver` | `- "paddingTop": 52,` / `+ "paddingTop": 40,` (`a5-probe1-209.log`) |
| R4: sin `ScreenHeader` en la rama del error | `nutrition-questionnaire/index.tsx` | el mismo | `Unable to find an element with testID: nutrition-questionnaire-back` (`a5-probe2-209.log`) |
| R5: `44` y `52` intercambiados | `nutrition-questionnaire/index.tsx` | `#209 R5: Pingo de la burbuja mide 52 pt y 44 pt en Condición por style` | Expected `{"height": 44, "width": 44}` / Received `{"height": 52, "width": 52}` (`a5-probe3-209.log`) |
| R16: sin `style`, con `className="size-28"` | `nutrition-questionnaire/index.tsx` | `#209 R16: Pingo de Generando mide 112 pt por style` | Expected `{"height": 112, "width": 112}` / Received `{}` (`a5-probe4-209.log`) |
| R19: `150` → `112` en `width` y `height` | `food/index.tsx` | `#209 R19: Pingo de NutricionSinPerfil mide 150 pt por style` | Expected `{"height": 150, "width": 150}` / Received `{"height": 112, "width": 112}` (`a5-probe5-209.log`) |

### Cierre (punto 4)

- Suite completa (`adenda5-test-209.log`): exit=0, `Test Suites: 168 passed, 168 total`, `Tests: 6221 passed, 6221 total` (172 s). SIGKILL = 0, `failed to run` = 0. Son 6217 + 4. Ningún flake.
- `test ! -e .expo/types/router.d.ts` exit 0; `bunx tsc --noEmit` exit 0; `bunx expo lint --no-cache > ../progress/lint-209.log 2>&1 && test ! -s ../progress/lint-209.log` exit 0.
- Guardas de «Guardas que R1 a R26 cruzan»:
  - `grep -c '#209'` = 0 en los 9 ficheros de producción;
  - `grep -cP -- '#209(?! R[0-9])'` = 0 en `nutrition-questionnaire/index.test.tsx` y `food/index.test.tsx`;
  - `@expo/ui/community/bottom-sheet` = 0 en `nutrition-questionnaire`, `food` y `meal-schedule`;
  - `StyleSheet` = 0 en `nutrition-questionnaire/index.test.tsx`;
  - `grep -cF -- '- [ ] Enmienda #209 aprobada por humano' ../docs/ui-guidelines.md` = 1.
- `traceability.md`: en R4, R5, R16 y R19, el `it` nuevo va al final de la columna de tests y los dos commits nuevos al final de la de commits. No se tocó ninguna otra fila ni ningún otro hash.

### Desviaciones y notas para el reviewer

- **Trailers.** El commit 1 salió primero como `19fb3778`, sin los trailers `Co-Authored-By`/`Claude-Session` que llevan los commits anteriores de la rama. Lo enmendé en el acto con el mismo árbol y el mismo asunto, y quedó en `63d4295e`, antes de cualquier otro commit. `19fb3778` no aparece en la historia.
- **`cleanup`.** El `it` de R4 rinde las dos ramas en un solo `it`, como permite R4 («tras `cleanup`»). Para eso añadí `cleanup` al import de `@testing-library/react-native` del test.
- **Dos esperas** que la spec no escribe literalmente, ambas según `docs/conventions.md` §Esperas:
  - en R5, `await screen.findByTestId('bcs-option-1')` tras `goToCondition()`, antes de medir los 44 pt, porque el cambio de paso es asíncrono (`void handleNext()`);
  - en R19, `await screen.findByTestId('food-profile-empty')` antes de buscar la imagen.

  Ninguna de las dos cambia las aserciones. Las sondas de R5 y R19 salen rojas por el valor, no por la espera.

## Corrección tras la segunda revisión (Adenda 6)

Relevo: subagente `implementer` (fallback de Codex, cuota agotada; ver `progress/current.md`), 2026-10-27. Skill cargada: `expo:expo-overview`. Spec: errata ronda 7 (`dc801dc3`) en R4 y R5, candados copiados literales.

### Punto de partida

- `pwd` = `/home/claude/sites/Pet-Tracker-wt-209`; branch `feature/209-mobile-nutrition-questionnaire`; árbol limpio.
- `git log --oneline -3`: `fce5984e docs(progress): #209 handoff Adenda 6 (locks for the second review)` / `dc801dc3 docs(spec): #209 errata round 7 for the second review (H1, H2, H3)` / `53de188d docs(review): #209 second review`. **H6 = `fce5984e`**.
- `progress/impl_mobile-nutrition-questionnaire.done` no existía al empezar.
- `git diff --quiet f8b7b130 HEAD -- src/screens/nutrition-questionnaire/index.tsx` = 0 antes de empezar.

### Cadena (punto 1)

Los dos pgreps vacíos antes de cada corrida de jest. Cada corrida con los dos ficheros de la Adenda 5 (`src/screens/nutrition-questionnaire/index.test.tsx` y `src/screens/food/index.test.tsx`) en «Jest de un fichero»:

| # | Commit | Corrida | `Tests:` |
|---|---|---|---|
| 1 | `520944f4` test(mobile): #209 R4 R5 rojo (errata ronda 7) | `a6-c1-209.log`, exit 1 | `Tests: 2 failed, 204 passed, 206 total` |
| 2 | `f638cbdd` feat(mobile): #209 R4 R5 revierte las mutaciones (errata ronda 7) | `a6-c2-209.log`, exit 0 | `Tests: 206 passed, 206 total` |

Commit 1 (dos ficheros):
- test: en el `it` de R4 con inset y volver, las dos últimas líneas pasan a las seis de la errata de R4, literales; el `it('#209 R5: Pingo de la burbuja mide 52 pt en Alimento y en Salud')` de la errata de R5, literal, justo después del `it` de R5 en Condición.
- producción, las dos mutaciones de la errata: en la rama del error, `<><ScreenHeader …/><View …><Text …/></View></>`; en la `Image` de `nutrition-questionnaire-pingo`, `step === 'condition' || step === 'food'`.

Rojo del commit 1: exactamente los dos `it`, los dos por aserción (ningún `ReferenceError` ni `Unable to find`):
- `#209 R4: esqueleto y error de carga respetan el inset superior y el error tiene volver`, en el `toEqual` del orden (línea 126): `- "nutrition-questionnaire-back",` (Received solo `["nutrition-questionnaire-load-error"]`).
- `#209 R5: Pingo de la burbuja mide 52 pt en Alimento y en Salud`, en el `toEqual` de Alimento (línea 165): Expected `{"height": 52, "width": 52}` / Received `{"height": 44, "width": 44}`.

Commit 2: `git checkout f8b7b130 -- src/screens/nutrition-questionnaire/index.tsx`; solo ese fichero. `git diff --quiet f8b7b130 HEAD -- src/screens/nutrition-questionnaire/index.tsx` = 0.

### Sondas (punto 2)

Sobre el árbol del commit 2, sin commitear, cada una con solo su `it` (`-t`), revertida con `git checkout HEAD -- src/screens/nutrition-questionnaire/index.tsx`. Tras cada reversión, `git diff --quiet HEAD -- mobile-pet-tracker` = 0 y `git diff --cached --quiet` = 0. Las cuatro salen rojas, todas en `Tests: 1 failed, 69 skipped, 70 total`:

| Sonda | Mutación | `it` que cae | Salida |
|---|---|---|---|
| P2 | rama del error: `Text` antes del `ScreenHeader`, dentro del `View` | `#209 R4: esqueleto y error de carga respetan el inset superior y el error tiene volver` | `toEqual` del orden: `- "nutrition-questionnaire-back",` arriba / `+ "nutrition-questionnaire-back",` abajo (Received `["nutrition-questionnaire-load-error", "nutrition-questionnaire-back"]`) (`a6-p2-209.log`) |
| P3 | `ScreenHeader` fuera del `View` (la del commit 1) | el mismo | `toEqual` del orden: `- "nutrition-questionnaire-back",` (Received `["nutrition-questionnaire-load-error"]`) (`a6-p3-209.log`) |
| P9 | `backFallback="/food"` → `"/home"` en el `ScreenHeader` del error | el mismo | `toHaveBeenCalledWith`: Expected `"/food"` / Received `"/home"` (`a6-p9-209.log`) |
| P5 | `step === 'condition' \|\| step === 'health'` en la `Image` de la burbuja | `#209 R5: Pingo de la burbuja mide 52 pt en Alimento y en Salud` | en el `toEqual` de Salud (línea 169): Expected `{"height": 52, "width": 52}` / Received `{"height": 44, "width": 44}` (`a6-p5-209.log`) |

### Cierre (punto 3)

- Suite completa (`adenda6-test-209.log`), la única de esta adenda: exit=0, `Test Suites: 168 passed, 168 total`, `Tests: 6222 passed, 6222 total` (168 s). SIGKILL = 0, `failed to run` = 0. Son 6221 + 1. Ningún flake.
- `test ! -e .expo/types/router.d.ts` exit 0; `bunx tsc --noEmit` exit 0; `bunx expo lint --no-cache > ../progress/lint-209.log 2>&1 && test ! -s ../progress/lint-209.log` exit 0.
- T0 guardas (`a6-guards-209.log`): exit=0, `Test Suites: 37 passed, 37 total`, `Tests: 1010 passed, 1010 total`.
- T0 ampliado (`a6-ext-209.log`): exit=0, `Test Suites: 40 passed, 40 total`, `Tests: 1351 passed, 1351 total`.
- Guardas de «Guardas que R1 a R26 cruzan»:
  - `grep -c '#209'` = 0 en los 9 ficheros de producción;
  - `grep -cP -- '#209(?! R[0-9])'` = 0 en `nutrition-questionnaire/index.test.tsx`;
  - `@expo/ui/community/bottom-sheet` = 0 en `nutrition-questionnaire`, `food` y `meal-schedule`;
  - `StyleSheet` = 0 en `nutrition-questionnaire/index.test.tsx`;
  - `grep -cF -- '- [ ] Enmienda #209 aprobada por humano' ../docs/ui-guidelines.md` = 1 (la casilla de R26 sigue sin marcar).
- `traceability.md`: en R4, los dos commits nuevos al final de la columna de commits; en R5, el `it` nuevo al final de la de tests y los dos commits nuevos al final de la de commits. Separador ` / `. Ninguna otra fila ni hash tocado.

### Notas para el reviewer

- Ninguna desviación. Los candados son literales de la errata ronda 7; no se añadió espera ni import (el `it` de R5 usa `goToFood(5)`, que ya observa `Tipo de alimento`, y `findByText('Alergias')` antes de la segunda medida).
