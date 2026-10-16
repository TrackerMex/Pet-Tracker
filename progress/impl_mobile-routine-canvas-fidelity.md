# Implementación #178 — Recordatorios y Nuevo recordatorio

Fecha: 2026-10-16. Worktree: `/home/claude/sites/Pet-Tracker-wt-178`.

Handoff leído entero: `progress/handoff_mobile-routine-canvas-fidelity.md`.
También se leyeron completos `requirements.md`, `design.md` y `tasks.md`
de la feature. La spec y E1–E5 tienen las casillas humanas firmadas.

## H0 y B0

H0 se conserva en `274ff52d675a4d4e4150fb91c9c7c46f4902b66a`.
El handoff de esta reanudación está en `751c3ad249fbc979eb5bc482796fb084d7ae45ef`.

Salida literal del primer comando B0 (sin salida de `git status --short`):

```text
/home/claude/sites/Pet-Tracker-wt-178/mobile-pet-tracker
feature/178-mobile-routine-canvas-fidelity
274ff52d675a4d4e4150fb91c9c7c46f4902b66a
```

`git merge-base --is-ancestor 58bf412c HEAD`:

```text
exit=0
```

`test ! -e .expo/types/router.d.ts`:

```text
exit=0
```

## B1 — primera ejecución: fallo y parada

Se ejecutó el comando BASE28 literal del handoff, sin modificarlo.
Salida del comando:

```text
exit=1
```

La cadena terminó con código 1 en el primer candado posterior a Jest:
`grep -qE '^Test Suites: +28 passed, 28 total$' /tmp/178-base.txt`.
El log completo está en `/tmp/178-base.txt`. Resumen literal:

```text
Test Suites: 2 failed, 26 passed, 28 total
Tests:       2 failed, 1278 passed, 1280 total
Snapshots:   0 total
Time:        136.281 s
```

Fallos únicos, sin las líneas `Console` ni las copias del resumen de Jest:

```text
  ● R5: plan del día con horarios y warnings › renders kcal, grams, ordered meals, portions, and local-time badges

    Unable to find an element with testID: food-plan-card

  ● #171 R6: confeti › R6.6 a los 13830 ms las 36 piezas siguen en vuelo

    thrown: "Exceeded timeout of 60000 ms for a test.
    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."
```

Ubicaciones:

- `mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx:390`:
  espera de `food-plan-card`; el árbol del error aún muestra los skeletons.
- `mobile-pet-tracker/src/components/__tests__/celebration.test.tsx:337`:
  test `R6.6 a los 13830 ms las 36 piezas siguen en vuelo`.

La parada ocurre antes de escribir los tests de c1. No se ejecutaron
el segundo comando de B1 (typecheck/lint), las anclas ni ningún EJECUTOR cN.
No se corrigieron tests ni candados. El HEAD sigue siendo H0.

## Anclas H0

Se ejecutaron los 73 comandos literales del handoff; todos coincidieron.

| Ancla | Comando | Medido | Esperado |
|---|---|---|---|
| 1 | `test -e node_modules/.bin/prettier; echo $?` | `1` | `1` |
| 2 | `test -e ../.agents/skills/appllama-app-design-skill/SKILL.md; echo $?` | `0` | `0` |
| 3 | `test -e ../.agents/skills/animate-expo/SKILL.md; echo $?` | `0` | `0` |
| 4 | `test -e node_modules/reicon-react-native/package.json; echo $?` | `0` | `0` |
| 5 | `test ! -e .expo/types/router.d.ts; echo $?` | `0` | `0` |
| 6 | `git merge-base --is-ancestor 58bf412c HEAD; echo $?` | `0` | `0` |
| 7 | `grep -cF -- '--font-extrabold: '\''Inter-ExtraBold'\'';' src/theme/global.css` | `1` | `1` |
| 8 | `grep -cF -- '--text-13: 13px;' src/theme/global.css` | `1` | `1` |
| 9 | `grep -cF -- '--text-26: 26px;' src/theme/global.css` | `1` | `1` |
| 10 | `grep -cF -- '--radius-tile: 18px;' src/theme/global.css` | `1` | `1` |
| 11 | `grep -cE -- '^  --radius-(14\|16\|22):' src/theme/global.css` | `0` | `0` |
| 12 | `grep -cF -- '--text-11: 11px;' src/theme/global.css` | `1` | `1` |
| 13 | `echo "$(grep -cF -- '--radius-10: 10px;' src/theme/global.css)/$(grep -cF -- '--radius-24: 24px;' src/theme/global.css)/$(grep -cF -- '--tracking-title: -0.02em;' src/theme/global.css)/$(grep -cF -- '--tracking-caps: 0.06em;' src/theme/global.css)"` | `1/1/1/1` | `1/1/1/1` |
| 14 | `grep -A1 -F -- '--radius-10: 10px;' src/theme/global.css \| tail -1 \| sed 's/^ *//'` | `--radius-24: 24px;` | `--radius-24: 24px;` |
| 15 | `grep -A1 -F -- '--radius-24: 24px;' src/theme/global.css \| tail -1 \| sed 's/^ *//'` | `--tracking-title: -0.02em;` | `--tracking-title: -0.02em;` |
| 16 | `grep -A1 -F -- '--text-26: 26px;' src/theme/global.css \| tail -1 \| sed 's/^ *//'` | `--text-11: 11px;` | `--text-11: 11px;` |
| 17 | `grep -A1 -F -- '--text-11: 11px;' src/theme/global.css \| tail -1 \| sed 's/^ *//'` | `--color-confetti-amber: #F79009;` | `--color-confetti-amber: #F79009;` |
| 18 | `grep -cF -- '**Excepción nombrada (fidelidad al canvas, 2026-10-13)**' ../docs/conventions.md` | `1` | `1` |
| 19 | `grep -cF -- '**Excepción nombrada (fidelidad al canvas, 2026-10-13)**' ../docs/ui-guidelines.md` | `1` | `1` |
| 20 | `grep -cF -- 'Tamaños de letra fuera de la escala de Tailwind' ../docs/ui-guidelines.md` | `1` | `1` |
| 21 | `grep -cF -- '## Enmienda de fidelidad al canvas (2026-10-13)' ../docs/ui-guidelines.md` | `1` | `1` |
| 22 | `grep -cE '^- \[[xX]\] Enmienda de fidelidad al canvas aprobada por humano' ../docs/ui-guidelines.md` | `1` | `1` |
| 23 | `grep -cF -- 'Tracking fuera de la escala de Tailwind' ../docs/ui-guidelines.md` | `1` | `1` |
| 24 | `grep -E '^## ' ../docs/ui-guidelines.md \| tail -1` | `## Enmienda #174 — Alertas fieles al canvas` | `## Enmienda #174 — Alertas fieles al canvas` |
| 25 | `echo "$(grep -cF -- 'la superficie siempre acompaña a un emoji y a un texto.' ../docs/ui-guidelines.md)/$(grep -cF -- '- Títulos de pantalla: header del stack cuando exista, no Text suelto.' ../docs/ui-guidelines.md)"` | `0/0` | `0/0` |
| 26 | `echo "$(grep -cF -- 'Fuera de la escala, por fidelidad al canvas (#174):' ../docs/ui-guidelines.md)/$(grep -cF -- 'Fuera de la escala, por fidelidad al canvas (#175):' ../docs/ui-guidelines.md)"` | `1/1` | `1/1` |
| 27 | `grep -A1 -F -- 'Fuera de la escala, por fidelidad al canvas (#175):' ../docs/ui-guidelines.md \| tail -1 \| wc -c` | `1` | `1` |
| 28 | `grep -cF -- '    - **Sin labio**:' ../docs/ui-guidelines.md` | `1` | `1` |
| 29 | `grep -cF -- '--text-15: 15px' ../docs/ui-guidelines.md` | `1` | `1` |
| 30 | `echo "$(grep -cF -- '(#178):' ../docs/ui-guidelines.md)/$(grep -cF -- 'Chip seleccionado' ../docs/ui-guidelines.md)/$(grep -cF -- '--text-11' ../docs/ui-guidelines.md)"` | `0/0/1` | `0/0/1` |
| 31 | `grep -cF -- '`--text-26: 26px`, `--text-11: 11px`, `--text-15: 15px`; cada uno es token aunque se use una vez' ../docs/ui-guidelines.md` | `1` | `1` |
| 32 | `echo "$(grep -cF -- 'from '\''reicon-react-native'\''' src/screens/reminders/index.tsx)/$(grep -cF -- 'from '\''reicon-react-native'\''' src/screens/add-reminder/index.tsx)/$(grep -cF -- 'from '\''reicon-react-native'\''' src/utils/reminder-meta.ts)"` | `0/0/0` | `0/0/0` |
| 33 | `echo "$(grep -cF -- 'meta.emoji' src/screens/reminders/index.tsx)/$(grep -cF -- 'meta.emoji' src/screens/add-reminder/index.tsx)/$(grep -cF -- 'emoji' src/utils/reminder-meta.ts)"` | `1/1/8` | `1/1/8` |
| 34 | `echo "$(grep -cF -- 'padding: 24,' src/screens/reminders/index.tsx)/$(grep -cF -- 'paddingBottom: insets.bottom + 24,' src/screens/reminders/index.tsx)"` | `1/1` | `1/1` |
| 35 | `echo "$(grep -cF -- 'gap: 16,' src/screens/reminders/index.tsx)/$(grep -cF -- 't('\''reminders.new'\'')' src/screens/reminders/index.tsx)/$(grep -cF -- 'useThemeColors(' src/screens/reminders/index.tsx)"` | `1/1/0` | `1/1/0` |
| 36 | `echo "$(grep -cF -- 'rounded-xl bg-accent border-b-4 border-black/25' src/screens/reminders/index.tsx)/$(grep -cF -- 'rounded-xl bg-accent border-b-4 border-black/25' src/screens/add-reminder/index.tsx)"` | `1/1` | `1/1` |
| 37 | `echo "$(grep -cF -- 'style={CONTINUOUS_CORNER}' src/screens/reminders/index.tsx)/$(grep -cF -- 'style={CONTINUOUS_CORNER}' src/screens/add-reminder/index.tsx)"` | `4/3` | `4/3` |
| 38 | `echo "$(grep -cF -- 'bg-accent-soft' src/screens/reminders/index.tsx)/$(grep -cF -- 'bg-accent-soft' src/screens/add-reminder/index.tsx)"` | `1/2` | `1/2` |
| 39 | `grep -cF -- 'uppercase tracking-widest' src/screens/add-reminder/index.tsx` | `5` | `5` |
| 40 | `grep -cF -- '<Card' src/screens/reminders/index.tsx` | `1` | `1` |
| 41 | `grep -cF -- '{ minutes: ' src/screens/add-reminder/index.tsx` | `4` | `4` |
| 42 | `grep -rlF REMINDER_TYPE_META src \| LC_ALL=C sort \| tr "\n" " "` | `src/screens/add-reminder/index.tsx src/screens/home/index.tsx src/screens/reminders/index.tsx src/utils/__tests__/category-palette.test.ts src/utils/reminder-meta.ts` | `src/screens/add-reminder/index.tsx src/screens/home/index.tsx src/screens/reminders/index.tsx src/utils/__tests__/category-palette.test.ts src/utils/reminder-meta.ts` |
| 43 | `echo "$(grep -cF -- 'title: t('\''reminders.reminders'\'')' src/app/_layout.tsx)/$(grep -cF -- 'title: t('\''addReminder.addReminder'\'')' src/app/_layout.tsx)"` | `1/1` | `1/1` |
| 44 | `echo "$(grep -cF -- '[join('\''screens'\'', '\''reminders'\'', '\''index.tsx'\''), 4],' src/__tests__/consistency-classnames.test.ts)/$(grep -cF -- '[join('\''screens'\'', '\''add-reminder'\'', '\''index.tsx'\''), 3],' src/__tests__/consistency-classnames.test.ts)"` | `1/1` | `1/1` |
| 45 | `grep -cF -- 'toBe(31 + 1 + 4 + 1 - 1 - 7);' src/__tests__/consistency-classnames.test.ts` | `1` | `1` |
| 46 | `grep -cF -- 'toBe(33 + 1 + 1 - 1 - 1 + 1 + 1 - 1 + 4 + 1 - 1 - 7);' src/__tests__/consistency-classnames.test.ts` | `1` | `1` |
| 47 | `echo "$(grep -cF -- '- 7 + 1);' src/__tests__/consistency-classnames.test.ts)/$(grep -cF -- '- 7 + 2);' src/__tests__/consistency-classnames.test.ts)"` | `0/0` | `0/0` |
| 48 | `grep -cF -- 'toBe(16 + 2 + 1 - 1 - 1 - 1 - 1);' src/__tests__/consistency-classnames.test.ts` | `2` | `2` |
| 49 | `grep -cF -- 'toBe(19 + 1 + 1 - 1 - 1 - 1);' src/__tests__/consistency-classnames.test.ts` | `2` | `2` |
| 50 | `grep -cF -- 'expect(reminders.match(/bg-accent-soft/g)).toHaveLength(1);' src/__tests__/consistency-classnames.test.ts` | `1` | `1` |
| 51 | `echo "$(grep -cF -- 'expect(pill).toContain('\''rounded-xl'\'');' src/__tests__/consistency-classnames.test.ts)/$(grep -cF -- 'expect(pill).toContain('\''rounded-16'\'');' src/__tests__/consistency-classnames.test.ts)"` | `1/0` | `1/0` |
| 52 | `echo "$(grep -cF -- 'expect(R8_REMINDERS).toHaveLength(50 + 1 - 2 + 1 - 1 + 1);' src/__tests__/ui-language.test.ts)/$(grep -cF -- '{ file: '\''src/app/_layout.tsx'\'', key: '\''reminders.reminders'\'' }, // #114 R4' src/__tests__/ui-copy-table.ts)/$(grep -cF -- '{ file: '\''src/app/_layout.tsx'\'', key: '\''addReminder.addReminder'\'' }, // #95 R4' src/__tests__/ui-copy-table.ts)"` | `1/1/1` | `1/1/1` |
| 53 | `echo "$(grep -cF -- ''\''screens/reminders/index.tsx'\''' src/__tests__/profile-canvas-fidelity.test.ts)/$(grep -cF -- ''\''screens/add-reminder/index.tsx'\''' src/__tests__/profile-canvas-fidelity.test.ts)"` | `0/0` | `0/0` |
| 54 | `echo "$(grep -cF -- 'filesMatching(/\btext-26\b/)).toEqual([' src/__tests__/profile-canvas-fidelity.test.ts)/$(grep -cF -- 'filesMatching(/\btext-13\b/)).toEqual([' src/__tests__/profile-canvas-fidelity.test.ts)/$(grep -cF -- 'filesMatching(/\brounded-tile\b/)).toEqual(['\''screens/profile/index.tsx'\'']);' src/__tests__/profile-canvas-fidelity.test.ts)/$(grep -cF -- ''\''components/form-error.tsx'\'',' src/__tests__/profile-canvas-fidelity.test.ts)"` | `1/1/1/1` | `1/1/1/1` |
| 55 | `echo "$(grep -cF -- ''\''screens/alerts/index.tsx'\'', // #174 R3' src/__tests__/profile-canvas-fidelity.test.ts)/$(grep -cF -- ''\''screens/alerts/index.tsx'\'', // #174 R4, R6' src/__tests__/profile-canvas-fidelity.test.ts)"` | `1/1` | `1/1` |
| 56 | `echo "$(grep -cF -- '- 4 + 3 // #173 R13' src/providers/__tests__/language-provider.test.tsx)/$(grep -cF -- '+ 1, // #174 R2' src/providers/__tests__/language-provider.test.tsx)/$(grep -cF -- '+ 1 // #174 R2' src/providers/__tests__/language-provider.test.tsx)"` | `1/1/0` | `1/1/0` |
| 57 | `grep -cF -- '#178' src/providers/__tests__/language-provider.test.tsx` | `0` | `0` |
| 58 | `echo "$(grep -cF -- ''\''reminders.' src/i18n/catalog.ts)/$(grep -cF -- ''\''addReminder.' src/i18n/catalog.ts)"` | `32/34` | `32/34` |
| 59 | `echo "$(grep -cF -- '['\''reminders'\'', '\''t:reminders.reminders'\''],' src/app/__tests__/layout.test.tsx)/$(grep -cF -- '['\''add-reminder'\'', '\''t:addReminder.addReminder'\''],' src/app/__tests__/layout.test.tsx)"` | `1/1` | `1/1` |
| 60 | `echo "$(grep -E '^### §2\.[0-9]+' ../specs/mobile-ui-language/design.md \| tail -1)"` | `### §2.31 — Añadidos por #175 — Documentos del canvas` | `### §2.31 — Añadidos por #175 — Documentos del canvas` |
| 61 | `grep -cF -- 'emoji: '\''' src/utils/__tests__/category-palette.test.ts` | `7` | `7` |
| 62 | `grep -cF -- 'it('\''conserva label y emoji mientras asigna los siete huecos exactos'\''' src/utils/__tests__/category-palette.test.ts` | `1` | `1` |
| 63 | `grep -cF -- 'expect(formatDate).toHaveBeenCalledWith('\''es-MX'\'');' src/screens/reminders/index.test.tsx` | `1` | `1` |
| 64 | `grep -cF -- 'it('\''no duplica la acción de crear'\''' src/screens/reminders/index.test.tsx` | `1` | `1` |
| 65 | `echo "$(grep -cF -- 'expect(actions.props.className).toBe('\''flex-row justify-end'\'');' src/screens/reminders/index.test.tsx)/$(grep -cF -- 'expect(screen.queryByText(es['\''reminders.reminders'\''])).toBeNull();' src/screens/reminders/index.test.tsx)"` | `1/2` | `1/2` |
| 66 | `echo "$(grep -cF -- 'const CHIP_SELECTED = '\''rounded-full border border-accent bg-accent-soft px-3 py-2'\'';' src/screens/add-reminder/index.test.tsx)/$(grep -cF -- 'const CHIP_IDLE = '\''rounded-full border border-border bg-default px-3 py-2'\'';' src/screens/add-reminder/index.test.tsx)"` | `1/1` | `1/1` |
| 67 | `echo "$(grep -rnoE "ByTestId\(/\^(reminder\|reminders\|type\|advance)[a-z-]*" src \| wc -l)"` | `6` | `6` |
| 68 | `echo "$(grep -rnoE "ByTestId\(/\^(reminder\|reminders\|type\|advance)[a-z-]*" src \| sed -E "s/^[^:]+:[0-9]+://" \| LC_ALL=C sort -u \| tr "\n" " ")"` | `ByTestId(/^advance-chip- ByTestId(/^reminder-row- ByTestId(/^reminder-row-skeleton- ByTestId(/^reminders-item- ByTestId(/^type-chip-` | `ByTestId(/^advance-chip- ByTestId(/^reminder-row- ByTestId(/^reminder-row-skeleton- ByTestId(/^reminders-item- ByTestId(/^type-chip-` |
| 69 | `test "$(grep -cE '^\s*it(\.each\(\|\()' src/theme/__tests__/global-css.test.ts)" = 39 && test "$(grep -cE '^\s*it(\.each\(\|\()' src/__tests__/design-drift.test.ts)" = 65 && test "$(grep -cE '^\s*it(\.each\(\|\()' src/providers/__tests__/language-provider.test.tsx)" = 26 && test "$(grep -cE '^\s*it(\.each\(\|\()' src/__tests__/consistency-classnames.test.ts)" = 36 && test "$(grep -cE '^\s*it(\.each\(\|\()' src/__tests__/ui-language.test.ts)" = 28 && test "$(grep -cE '^\s*it(\.each\(\|\()' src/screens/reminders/index.test.tsx)" = 27 && test "$(grep -cE '^\s*it(\.each\(\|\()' src/screens/add-reminder/index.test.tsx)" = 28 && test "$(grep -cE '^\s*it(\.each\(\|\()' src/utils/__tests__/category-palette.test.ts)" = 4 && test "$(grep -cE '^\s*it(\.each\(\|\()' src/app/__tests__/layout.test.tsx)" = 21 && test "$(grep -cE '^\s*it(\.each\(\|\()' src/__tests__/profile-canvas-fidelity.test.ts)" = 15 && test "$(grep -cE '^\s*it(\.each\(\|\()' src/__tests__/alerts-canvas-fidelity.test.ts)" = 13 && echo its-ok` | `its-ok` | `its-ok` |
| 70 | `echo "$(grep -cF -- ''\''screens/alerts/index.tsx'\'', // #174 R12: H0 sin consumidores' src/__tests__/alerts-canvas-fidelity.test.ts)/$(grep -cF -- ''\''screens/docs/index.tsx'\'', // #175 R5' src/__tests__/alerts-canvas-fidelity.test.ts)/$(grep -cF -- '#178' src/__tests__/alerts-canvas-fidelity.test.ts)"` | `1/1/0` | `1/1/0` |
| 71 | `grep -rlF tracking-title src --include=*.tsx --exclude=*.test.tsx \| LC_ALL=C sort \| tr "\n" " "` | `src/screens/alerts/index.tsx src/screens/docs/index.tsx` | `src/screens/alerts/index.tsx src/screens/docs/index.tsx` |
| 72 | `echo "$(grep -cF -- ''\''screens/docs/index.tsx'\'', // #175 R5' src/__tests__/profile-canvas-fidelity.test.ts)/$(grep -cF -- ''\''screens/docs/index.tsx'\'', // #175 R8' src/__tests__/profile-canvas-fidelity.test.ts)"` | `1/1` | `1/1` |
| 73 | `bunx jest --listTests \| wc -l` | `111` | `111` |


## Skills cargadas

- `ponytail:ponytail`: cambios limitados al alcance autorizado.
- `building-native-ui`: guía de Expo Router y UI nativa, subordinada a la
  carta y a la spec aprobada.
- `appllama-app-design-skill`: criterios de UI móvil y límites locales de
  `docs/ui-guidelines.md`; la prueba visual corresponde al humano.
- `animate-expo`: cargada para R7, junto con la receta de entrada de listas. Se reutilizan los componentes existentes y sus tokens; R14 queda para el humano.

Se consultó además la documentación versionada de Expo SDK 57 indicada por
`mobile-pet-tracker/AGENTS.md`.

## Commits, sondas y cierre

c1–c25 completos (`cadena=0`), con la excepción de R8 de c20 aprobada
en el handoff corregido. Las paradas anteriores y el Flake quedan en Desviaciones.

| Commit | Hash | Mensaje | R | Tipo | Tests: |
|---|---|---|---|---|---|
| c1 | `02b760f2f5aab3b469fbf1ac79688d45a25d9092` | test(mobile): #178 R1 tokens de Recordatorios | R1 | rojo | `Tests:       2 failed, 1280 passed, 1282 total` |
| c2 | `684178bce88acd8035a9805dff74080ee3ea5b9b` | feat(mobile): tokens de Recordatorios (#178 R1) | R1 | verde | `Tests:       1282 passed, 1282 total` |
| c3 | `25c983f31bd41a01395edd66f82044f69afda31e` | test(mobile): #178 R2 enmienda de fidelidad al canvas en Recordatorios | R2 | rojo | `Tests:       2 failed, 1283 passed, 1285 total` |
| c4 | `2ea73831ab3b705be8853337fca4362ce4728db1` | docs(ui): enmienda de fidelidad al canvas en Recordatorios (#178 R2) | R2 | verde | `Tests:       1285 passed, 1285 total` |
| c5 | `1176e1c06a6ffc06c354099e4aa2281e18b01d39` | test(mobile): #178 R3 claves de Recordatorios del canvas | R3 | rojo | `Tests:       2 failed, 1284 passed, 1286 total` |
| c6 | `222cb10a96dc2680e5b3c3233bba7e7fda4299d7` | feat(mobile): claves de Recordatorios del canvas (#178 R3) | R3 | verde | `Tests:       1286 passed, 1286 total` |
| c7 | `20a1676072c60ac2cd67920e8f2d160716f24388` | test(mobile): #178 R4 marco y título en contenido | R4 | rojo | `Tests:       11 failed, 1279 passed, 1290 total` |
| c8 | `97ef9a0e2db7fba18058d906201fd3be099b3373` | feat(mobile): marco y título en contenido (#178 R4) | R4 | verde | `Tests:       1290 passed, 1290 total` |
| c9 | `cd057c2241abb601c9a3d1e5560e58dfac92fdf2` | test(mobile): #178 R5 píldoras de resumen del canvas | R5 | rojo | `Tests:       6 failed, 1286 passed, 1292 total` |
| c10 | `9c5db4291f81e715d375380b3937d9c037e2ad40` | feat(mobile): píldoras de resumen del canvas (#178 R5) | R5 | verde | `Tests:       1292 passed, 1292 total` |
| c11 | `757eb643e29822f22db19c1be21d91e85cdad0d7` | test(mobile): #178 R6 fila del canvas | R6 | rojo | `Tests:       17 failed, 1282 passed, 1299 total` |
| c12 | `2d3b6a78` | feat(mobile): fila del canvas (#178 R6) | R6 | verde | `Tests:       1299 passed, 1299 total` |
| c13 | `3485aaa8` | test(mobile): #178 R7 entrada escalonada y badge | R7 | rojo | `Tests:       4 failed, 1299 passed, 1303 total` |
| c14 | `35c9a389` | feat(mobile): entrada escalonada y badge (#178 R7) | R7 | verde | `Tests:       1303 passed, 1303 total` |
| c15 | `4af957d1` | test(mobile): #178 R8 sheet de borrado del canvas | R8 | rojo | `Tests:       4 failed, 1303 passed, 1307 total` |
| c16 | `da398b32` | feat(mobile): sheet de borrado del canvas (#178 R8) | R8 | verde | `Tests:       1307 passed, 1307 total` |
| c17 | `aa0c6a75` | test(mobile): #178 R9 el vacío ofrece crear | R9 | rojo | `Tests:       5 failed, 1304 passed, 1309 total` |
| c18 | `7860e4d1` | feat(mobile): el vacío ofrece crear (#178 R9) | R9 | verde | `Tests:       1309 passed, 1309 total` |
| c19 | `5a808f72` | test(mobile): #178 R10 marco, título y chips de tipo del canvas | R10 | rojo | `Tests:       17 failed, 1298 passed, 1315 total` |
| c20 | `f8779f27` | feat(mobile): marco, título y chips de tipo del canvas (#178 R10) | R10 | verde con excepción R8 | `Tests:       2 failed, 1313 passed, 1315 total` |
| c21 | `e3a86195` | test(mobile): #178 R11 título, fecha y hora del canvas | R11 | rojo | `Tests:       9 failed, 1310 passed, 1319 total` |
| c22 | `03ff8a52` | feat(mobile): título, fecha y hora del canvas (#178 R11) | R11 | verde | `Tests:       1319 passed, 1319 total` |
| c23 | `2dc68762` | test(mobile): #178 R12 chips de aviso y vista previa | R12 | rojo | `Tests:       30 failed, 1298 passed, 1328 total` |
| c24 | `30dd2a5e` | feat(mobile): chips de aviso y vista previa (#178 R12) | R12 | verde | `Tests:       1328 passed, 1328 total` |
| c25 | `acde7bee` | test(mobile): #178 R13 candados de deriva de Recordatorios | R13 | nace verde | `Tests:       1336 passed, 1336 total` |

- S1–S7: un único fallo propio y `limpio=0` en cada sonda.
- K1–K3: verificados; salidas en Cierre.
- K4–K5: cierre documental y comprobación de lista cerrada, documentados al final.

## Desviaciones

### Reanudación con handoff corregido — HEAD 751c3ad2

El usuario confirmó que el crash de serialización de c11 era un defecto
del handoff y aprobó la preparación de los siete ficheros de tests.
Se conservaron intactos: su diff se guardó en `/tmp/178-c11-prep.diff`.
El log del crash se preservó en `/tmp/178-c11-worker-error.txt`.
Se relanzó el EJECUTOR de c11 tal cual; esta versión usa Jest `-i`.
No se repitieron c1–c10 ni las comprobaciones H0 ya registradas.
Resultado de esta ejecución: `cadena=0`; commit `757eb643e29822f22db19c1be21d91e85cdad0d7`; `Tests:       17 failed, 1282 passed, 1299 total`. Typecheck sin errores y lint vacío.

### Reanudación — reintento por carga (2026-10-16)

El usuario confirmó que la parada anterior fue por carga y autorizó
repetir B1 **una sola vez** según «Reintento» del handoff. Se releyó el
handoff completo y se lanzó su bucle literal de espera antes de repetir
la línea entera de B1. La espera terminó con código 0 y esta salida:

```text
fin-espera
```

Único reintento de BASE28: código 0; salida literal de la cadena:

```text
exit=0
Tests:       1280 passed, 1280 total
```

Resumen literal del log del reintento (`/tmp/178-base.txt`):

```text
Test Suites: 28 passed, 28 total
Tests:       1280 passed, 1280 total
Time:        79.152 s, estimated 102 s
```

El log de la primera corrida se conservó en `/tmp/178-base-initial.txt`.
Typecheck/lint de B1: código 0; log de lint vacío. Salida literal:

```text
$ tsc --noEmit
exit=0
```

### Edición manual de c8

Antes de lanzar el EJECUTOR, un primer parche no encontró el ancla
multilínea del layout; no se aplicó ningún cambio. Salida literal:

```text
apply_patch verification failed: Failed to find expected lines in /home/claude/sites/Pet-Tracker-wt-178/mobile-pet-tracker/src/app/_layout.tsx:
                    title: t('reminders.reminders'),
```

Se leyó la línea real (un `Stack.Screen` compacto) y se aplicó el mismo
cambio previsto por R4. El EJECUTOR de c8 se lanzó después, una sola vez.

### Parada en c11 (fuera de Reintento)

El EJECUTOR literal de c11 devolvió:

```text
exit=1
cadena=1
```

El eslabón `<ROJO>` pasó, pero `<SOLO>` falló: el filtro de describes
permitidos recibió dos líneas `  ● Test suite failed to run` (la principal
y la copia del resumen), en vez de cero. `<ALGUNO>`, `<SINCRASH>`,
typecheck/lint, staging y commit no se alcanzaron. No se produjo un rojo
válido de R6: su suite no pudo reportar los tests.

El error raíz del log es de serialización circular, no `reading 'canceled'`,
`Exceeded timeout` ni `Failed to run` de lint. No se reintentó ni se
ajustaron los tests. Log completo: `/tmp/178-c11.txt`.

Salida literal del error:

```text
node:internal/child_process/serialization:164
    const string = JSONStringify(message) + '\n';
                   ^

TypeError: Converting circular structure to JSON
    --> starting at object with constructor 'Object'
    |     property 'children' -> object with constructor 'Array'
    |     index 0 -> object with constructor 'Object'
    --- property 'parent' closes the circle
    at stringify (<anonymous>)
    at writeChannelMessage (node:internal/child_process/serialization:164:20)
    at process.target._send (node:internal/child_process:851:17)
    at process.target.send (node:internal/child_process:751:19)
    at reportSuccess (/home/claude/sites/Pet-Tracker-wt-178/mobile-pet-tracker/node_modules/jest-worker/build/workers/processChild.js:82:11)

Node.js v20.20.2
FAIL src/screens/reminders/index.test.tsx
  ● Test suite failed to run

    Jest worker encountered 4 child process exceptions, exceeding retry limit
```

Resumen literal:

```text
Test Suites: 6 failed, 22 passed, 28 total
Tests:       7 failed, 1245 passed, 1252 total
Snapshots:   0 total
Time:        64.765 s
```

Los siete ficheros de tests/candados de c11 quedan sin staging ni commit
para revisión; la implementación verde de R6 (c12) no se inició. La
trazabilidad, el estado de la feature y los ficheros del leader no se tocaron.

### Primera ejecución

B1 no dio la base verde prevista (1280 tests). Las salidas exactas están
arriba. Había otra corrida Jest en otro worktree, pero no se ha demostrado
que ninguno de los dos fallos sea un flake. No se reintentó: se cumplió la
instrucción directa del usuario de parar y reportar al fallar un eslabón.

No se ejecutó `./init.sh`, Prettier, push, PR ni merge. El único archivo
añadido es este informe de parada, sin commit.

## R14

Pendiente (humano). Su casilla permanece sin marcar.

## Evidencia c1

```text
exit=1
Tests:       2 failed, 1280 passed, 1282 total
  ● #178 R1: tokens de Recordatorios › define los valores exactos del artboard dentro de @theme
  ● #178 R1: tokens de Recordatorios › declara cada token del artboard una sola vez
cadena=0
```

Typecheck: sin errores TS. Lint: log vacío.

## Evidencia c2

```text
exit=0
Tests:       1282 passed, 1282 total
$ tsc --noEmit
cadena=0
```

Typecheck: sin errores. Lint: log vacío.

## Evidencia c3

```text
exit=1
Tests:       2 failed, 1283 passed, 1285 total
  ● #178 R2: enmienda de fidelidad al canvas en Recordatorios › B: enumera el tracking y los tres radios en sus reglas
  ● #178 R2: enmienda de fidelidad al canvas en Recordatorios › C: coloca la receta del chip seleccionado antes de Sin labio
cadena=0
```

A nació verde, B y C rojos. Typecheck: sin errores TS. Lint: log vacío.

## Evidencia c4

```text
exit=0
Tests:       1285 passed, 1285 total
$ tsc --noEmit
cadena=0
```

Typecheck: sin errores. Lint: log vacío. Carta: diff 2/0.

## Evidencia c5

```text
exit=1
Tests:       2 failed, 1284 passed, 1286 total
  ● #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas
  ● #178 R3: claves de Recordatorios del canvas › declara los dos pares exactos y registra cada clave
cadena=0
```

Typecheck: sin errores TS. Lint: log vacío.

## Evidencia c6

```text
exit=0
Tests:       1286 passed, 1286 total
$ tsc --noEmit
cadena=0
```

Typecheck: sin errores. Lint: log vacío.

## Evidencia c7

```text
exit=1
Tests:       11 failed, 1279 passed, 1290 total
  ● R5: reminders monta con métricas y estados › #114 R5 (revertido por #178 R4): el título vive en el contenido › deja Nuevo junto al título en carga y con filas
  ● R5: reminders monta con métricas y estados › uses the metrics under the native header, selects the first pet, and shows row skeletons (#114 R6)
  ● #178 R4: marco y título en contenido › usa el marco 20/24/14 bajo la cabecera nativa
  ● #178 R4: marco y título en contenido › coloca título y Nuevo en ese orden dentro de la fila de acciones
  ● #178 R4: marco y título en contenido › pinta Recordatorios como título accesible con la receta del canvas
  ● #178 R4: marco y título en contenido › pinta Nuevo compacto con Plus de 16 y tinta accent-foreground
  ● #65 R8: Recordatorios resuelve su copy por clave › resuelve las 49 ocurrencias normativas
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta
  ● #114 R4: reminders y alerts declaran su cabecera nativa › reminders usa exactamente las opciones de cabecera acordadas
  ● #173 R2.4: inventario de tamaños nuevos › reserva text-26 al nombre de la mascota en Perfil
  ● #174 R12: inventarios › limita tracking-title a su inventario de producción
cadena=0
```

Typecheck: sin errores TS. Lint: log vacío.

## Evidencia c8

```text
exit=0
Tests:       1290 passed, 1290 total
$ tsc --noEmit
cadena=0
```

Typecheck: sin errores. Lint: log vacío.

## Evidencia c9

```text
exit=1
Tests:       6 failed, 1286 passed, 1292 total
  ● #178 R5: píldoras de resumen del canvas › agrupa las tres píldoras en el orden activo, semana e inactivo
  ● #178 R5: píldoras de resumen del canvas › pinta cada cifra y etiqueta con su radio, tinta y orden del canvas
  ● #127 R3: las tres píldoras de resumen llevan su receta en el árbol › pinta cada píldora con su clase exacta, rounded-xl incluido, y la esquina continua, las vea o no el recorte de fuente
  ● #62 R4: la app solo usa los radios de la escala declarada › lleva las tres píldoras de resumen de reminders a rounded-xl en su tag de apertura (#120 R1)
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban
  ● #64 R9: el color categórico solo se nombra en el módulo de paleta › conserva los usos de bg-accent-soft que sí son acento
cadena=0
```

Typecheck: sin errores TS. Lint: log vacío.

## Evidencia c10

```text
exit=0
Tests:       1292 passed, 1292 total
$ tsc --noEmit
cadena=0
```

Typecheck: sin errores. Lint: log vacío.

## Evidencia c11 y estado de parada

```text
Tests:       7 failed, 1245 passed, 1252 total
  ● R8: formulario de alta con chips y pickers › renders all reminder types and selects vaccine by default
  ● #62 R14: toda esquina no-cápsula que dibuja el repo es continua › screens/reminders/index.tsx importa y aplica sus 5 esquinas
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban
  ● #65 R8: Recordatorios resuelve su copy por clave › resuelve las 49 ocurrencias normativas
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta
  ● #173 R2.4: inventario de tamaños nuevos › limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8)
  ● #64 R5: cada tipo de recordatorio resuelve un único hueco de la paleta › conserva label e icono mientras asigna los siete huecos exactos
  ● Test suite failed to run
cadena=1
```

Typecheck/lint de c11: no ejecutados; no hay códigos TS nuevos que reportar.

HEAD final:

```text
9c5db4291f81e715d375380b3937d9c037e2ad40 feat(mobile): píldoras de resumen del canvas (#178 R5)
```

Estado literal del worktree:

```text
 M mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
 M mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
 M mobile-pet-tracker/src/__tests__/ui-copy-table.ts
 M mobile-pet-tracker/src/__tests__/ui-language.test.ts
 M mobile-pet-tracker/src/screens/add-reminder/index.test.tsx
 M mobile-pet-tracker/src/screens/reminders/index.test.tsx
 M mobile-pet-tracker/src/utils/__tests__/category-palette.test.ts
?? progress/impl_mobile-routine-canvas-fidelity.md
```

## Evidencia c11 reanudado

```text
Tests:       17 failed, 1282 passed, 1299 total
  ● #173 R2.4: inventario de tamaños nuevos › limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8)
  ● #178 R6: fila del canvas › da a cada mosaico su único icono, tamaño, superficie y tinta
  ● #178 R6: fila del canvas › distingue las recetas de fila próxima, lejana e inactiva
  ● #178 R6: fila del canvas › formatea la fecha y hora próxima y conserva sus días en text-13
  ● #178 R6: fila del canvas › formatea la hora lejana y la meta inactiva con su estado
  ● #178 R6: fila del canvas › ordena mosaico, columna y borrar con la anatomía exacta de cada fila
  ● #178 R6: fila del canvas › pinta tipo y título con sus tintas y pesos propios
  ● #178 R6: fila del canvas › sustituye los emoji de todas las filas por iconos
  ● #62 R14: toda esquina no-cápsula que dibuja el repo es continua › screens/reminders/index.tsx importa y aplica sus 5 esquinas
  ● #64 R5: cada tipo de recordatorio resuelve un único hueco de la paleta › conserva label e icono mientras asigna los siete huecos exactos
  ● #64 R7: la fila de recordatorio pinta el icono con el color de su tipo › mantiene emoji y etiqueta junto a superficies distintas
  ● #65 R15: la fecha del recordatorio se formatea con el locale del idioma › passes es-MX explicitly to the date formatter
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta
  ● #65 R8: Recordatorios resuelve su copy por clave › resuelve las 49 ocurrencias normativas
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban
  ● R6: lista con pills, badges y refetch on focus › renders summaries and reminder rows in API order
  ● R8: formulario de alta con chips y pickers › renders all reminder types and selects vaccine by default
```

Typecheck: `$ tsc --noEmit` sin errores. Lint: fichero vacío.

## Parada c12 — lint

Se implementó el paso manual de c12 en los tres ficheros autorizados y se
lanzó su EJECUTOR exacto, extraído del handoff. Resultado:

```text
exit=0
$ tsc --noEmit
cadena=1
Test Suites: 28 passed, 28 total
Tests:       1299 passed, 1299 total
```

`bunx expo lint --no-cache` emitió el siguiente aviso; el eslabón que falló
fue `test ! -s /tmp/178-lint.txt` de `<TSLINT>`. Salida literal:

```text

/home/claude/sites/Pet-Tracker-wt-178/mobile-pet-tracker/src/utils/reminder-meta.ts
  45:1  warning  Import in body of module; reorder to top  import/first

✖ 1 problem (0 errors, 1 warning)
  0 errors and 1 warning potentially fixable with the `--fix` option.

```

La importación añadida con una inserción sin contexto quedó al final del
módulo, en la línea 45 de `src/utils/reminder-meta.ts`. El aviso `import/first`
no cumple Reintento ni Flake: se PARA sin corregir ni relanzar c12.
No se alteraron los tests preparados de c11 ni se repitieron c1–c10.

HEAD de esta parada: `757eb643e29822f22db19c1be21d91e85cdad0d7`. c11 está commiteado. c12 no está
commiteado ni en staging: quedan modificados `src/screens/reminders/index.tsx`,
`src/screens/add-reminder/index.tsx` y `src/utils/reminder-meta.ts`.
No se ejecutaron c13–c25, S1–S7 ni K1–K5; trazabilidad sin cambios y R14
pendiente del humano. No se lanzó `./init.sh` ni se hizo push.

## Reanudación c12 — HEAD 502b270b

Por instrucción del humano, se releyó el paso c12 del handoff corregido y
las reglas de EJECUTOR, Reintento y Flake, sin repetir c1–c11.
Único ajuste sobre los tres ficheros preparados: import de reicon en la
primera línea de `src/utils/reminder-meta.ts`, antes de los `import type`,
y retirada de la línea en blanco sobrante al final. Se conserva la
implementación preparada de las dos pantallas. Skill cargada en esta
reanudación: `ponytail`. Se relanza el EJECUTOR literal de c12.
Para c22 queda registrada la instrucción: import de reicon junto a los
demás imports de paquetes, arriba.

c12 completado: `exit=0`, `cadena=0`, 28 suites y 1299 tests verdes;
typecheck verde y `/tmp/178-lint.txt` vacío. Commit `2d3b6a78`.
No se activaron Reintento ni Flake. Sigue c13 (rojo de R7), sin repetir
pasos anteriores. Se cargaron además `animate-expo` y
`appllama-app-design-skill` para reutilizar los componentes de movimiento
existentes, conforme a la spec aprobada.

c13 completado, `3485aaa8`: `cadena=0`; 4 fallos de R7 y 1299 tests
verdes, 28 suites. No hay fallos ajenos ni crash. Typecheck y lint verdes.
c14: se envuelve cada fila con `HomeEntrance` y su índice; el badge
reutiliza `PopIn` y la receta `text-11` de R7. Sin componentes nuevos.

c14 completado, `35c9a389`: `cadena=0`, 28 suites y 1303 tests verdes;
typecheck verde y lint vacío. Sin Reintento ni Flake.
c15: cuatro tests de R8 para marco, mosaico/Trash, copy y grupo de acciones
del sheet; solo cambia `src/screens/reminders/index.test.tsx`.

c15 completado, `4af957d1`: `cadena=0`; 4 fallos de R8 y 1303 verdes.
Typecheck y lint verdes; sin Reintento ni Flake.
c16: cinco hijos en el sheet, icono Trash de 26 y mosaico rosa, copy
centrado y grupo de acciones a ancho completo. Se reutiliza el octavo
color `danger` ya pedido por la llamada existente a `useThemeColors`.

c16 completado, `da398b32`: `cadena=0`, 28 suites y 1307 tests verdes;
typecheck verde y lint vacío. Sin Reintento ni Flake.
c17: tres tests de R9, retirada del antiguo «no duplica la acción de crear»
y delta de copy `reminders.new` en la tabla y su longitud.

c17 completado, `aa0c6a75`: `cadena=0`; 5 fallos permitidos (R9, #65 R8,
#65 R18), 1304 verdes. Typecheck y lint verdes; sin Reintento ni Flake.
c18: se añade únicamente `action` al `EmptyState`, con `reminders.new`
y navegación a `/add-reminder`.

c18 completado, `7860e4d1`: `cadena=0`, 28 suites y 1309 tests verdes;
typecheck verde y lint vacío. Sin Reintento ni Flake.
c19: seis tests de R10 y deltas de marco, #95 R5, fecha/hora, layout,
tabla de copy, inventarios de accent-soft/labio y E5 (tracking-title).

c19 completado, `5a808f72`: `cadena=0`; 17 fallos permitidos y 1298
verdes. Typecheck y lint verdes; sin Reintento ni Flake.
c20: marco 20/24/16, título en contenido, cinco etiquetas, huecos de
sección y chips de tipo con `SELECTED_CHIP` y paleta categórica; título
nativo vacío. Los campos y sus formatos siguen reservados a c22.

## Parada c20 — preparación incompleta

El párrafo anterior describe el cambio previsto, no el estado aplicado.
El parche conjunto del formulario y layout falló por un ancla de layout
que suponía una opción multilínea; `apply_patch` no aplicó ninguno de los
dos ficheros. Se corrigió el ancla del layout, pero por error se lanzó
el EJECUTOR de c20 antes de volver a aplicar el parche del formulario.

Salida literal del EJECUTOR:

```text
cadena=1
```

Primer eslabón fallido:

```sh
test "$(grep -cF -- 'add-reminder-title' src/screens/add-reminder/index.tsx)" = 1
```

La cuenta real es `0`. No se ejecutó Jest, typecheck, lint, staging ni
commit de c20. No hay timeout, `reading 'canceled'`, `Failed to run` ni
un `it` fallido que permita Reintento o Flake: se aplica PARA sin corregir
ni relanzar la cadena.

Estado verificado: HEAD `5a808f72` (c19); c12–c19 están commiteados y
no se repitió c1–c11. El único fichero de producción modificado es
`src/app/_layout.tsx` (`add-reminder` con `title: ''`). El formulario
permanece como en c18, con el ajuste de copy de c12; no está aplicado el
paso manual de c20. Este impl sigue sin seguimiento, como al reanudar.
c21–c25, S1–S7 y K1–K5 no se ejecutaron. No se lanzó `./init.sh` ni se
hizo push. En c22 se conserva la instrucción del humano: reicon junto a
los demás imports de paquetes, arriba.

## Reanudación c20 — preparación verificada

Por instrucción del humano se conserva `title: ''` de `src/app/_layout.tsx`
y se aplica ahora el paso manual completo de c20 al formulario: marco
20/24/16, título accesible en contenido, etiquetas en frase y sus huecos,
`SELECTED_CHIP` y chips de tipo con la paleta categórica.
No se repite c1–c19 ni se modifican tests.

Antes de lanzar el EJECUTOR se ejecutó y leyó `git diff --stat`:

```text
 mobile-pet-tracker/src/app/_layout.tsx             |  2 +-
 .../src/screens/add-reminder/index.tsx             | 32 ++++++++++++++--------
 2 files changed, 21 insertions(+), 13 deletions(-)
```

`git diff --check` terminó con código 0. Se lanza el EJECUTOR literal de
c20. Se conservan las reglas de Reintento y Flake y la indicación para
c22: import de reicon arriba, con los demás imports de paquetes.

## Parada c20 — fecha y hora reproducibles tras Flake

Esta vez el paso manual del formulario sí estaba aplicado y su diff
se comprobó antes del EJECUTOR. Todas las anclas de c20 pasaron.
Salida literal de su ejecución:

```text
exit=1
cadena=1
Test Suites: 1 failed, 27 passed, 28 total
Tests:       2 failed, 1313 passed, 1315 total
```

La cadena se detuvo en `<VERDE>`:

```sh
grep -qE '^Test Suites: +28 passed, 28 total$' /tmp/178-c20.txt
```

Los únicos fallos (sin Console ni duplicados del resumen) son:

```text
  ● R8: formulario de alta con chips y pickers › opens the date picker and reflects the selected date
  ● R8: formulario de alta con chips y pickers › opens the time picker with 09:00 and reflects a new time
```

El primero espera `15 sep 2026` y el árbol muestra `15/9/2026`;
el segundo espera `14:45` y muestra `02:45 p.m.`. Estas expectativas se
migraron en c19, mientras que la producción conserva el formato anterior
hasta el paso de campos de c22. Los seis tests nuevos de R10 pasan.

### Desviaciones — comprobación de Flake

Reintento evaluado: no hay `reading 'canceled'` ni `Exceeded timeout` en
el log de c20; la cadena no llegó a lint, por lo que no aplica `Failed to
run`. No se activa el reintento por carga.

Se ejecutó el bucle literal de Flake sobre
`'src/screens/add-reminder/index.test.tsx'` dos veces, con el título
`opens the date picker and reflects the selected date`; se contó además
el segundo título en los dos mismos logs. Resultados:

| Ejecución aislada | Línea Tests: | Cuenta ● fecha | Cuenta ● hora |
|---|---|---|---|
| `/tmp/178-flake-1.txt` | `Tests:       2 failed, 45 passed, 47 total` | 1 | 1 |
| `/tmp/178-flake-2.txt` | `Tests:       2 failed, 45 passed, 47 total` | 1 | 1 |

Los fallos se reproducen aislados: se aplica PARA conforme a Flake, sin
relanzar la cadena ni modificar los tests o adelantar los campos de c22.

Estado al parar: HEAD `5a808f72`; c20 sin commit y sin staging. Quedan
modificados únicamente `src/app/_layout.tsx` y
`src/screens/add-reminder/index.tsx`; este impl sigue sin seguimiento.
No se repitió c1–c19. Typecheck y lint de c20 no se ejecutaron porque
la cadena paró antes. No se ejecutó c21 en adelante, ni `./init.sh`, ni
push. Para c22 sigue vigente el import de reicon arriba entre paquetes.

## Reanudación c20 — handoff corregido, HEAD 33a036c9

Se releyó únicamente el paso c20 actualizado. Por instrucción del humano
se conservan intactos los dos ficheros preparados y no se repite c1–c19.
Se lanza el EJECUTOR literal de c20 extraído del handoff.

### Desviaciones — excepción explícita de c20

El handoff corregido exige exactamente dos tests de R8 aún rojos:
`opens the date picker and reflects the selected date` y
`opens the time picker with 09:00 and reflects a new time`. Los Δ
`15 sep 2026` y `14:45` llegaron en c19; los formatos se implementan en
c22. La cadena de c20 acepta esos dos fallos y ningún otro. Esta
excepción sustituye el gate de 28 suites verdes para c20; no se cambian
tests ni producción para eludirla. En c21 esos dos Δ no se tocan.
En c22 el import de reicon irá arriba, con los imports de paquetes.

### Desviaciones — Flake ajeno en c20 corregido

Primera ejecución del EJECUTOR actualizado: `exit=1`, `cadena=1`;
`Test Suites: 2 failed, 26 passed, 28 total` y
`Tests:       3 failed, 1312 passed, 1315 total`.
A los dos fallos de R8 permitidos se sumó únicamente:
`R1: me card › shows the real account name and email` (perfil).
No hay `reading 'canceled'` ni `Exceeded timeout`; Reintento por carga
no aplica.

Se ejecutó el bucle literal de Flake con
`'src/screens/profile/index.test.tsx'` y el título
`shows the real account name and email`. Ambas ejecuciones dieron:

```text
Tests:       131 passed, 131 total
0
Tests:       131 passed, 131 total
0
```

El código 1 del bucle corresponde al `grep` final con cero coincidencias,
no a Jest. Se confirma Flake. Se conserva el log inicial en
`/tmp/178-c20-before-flake.txt`, se ejecuta el bucle literal de espera y
después se relanza la cadena completa UNA vez con su EJECUTOR.
Los hashes de ambos ficheros preparados siguen iguales a los de inicio.

c20 completado tras Flake, commit `f8779f27`: `cadena=0`, exactamente los
dos tests de R8 permitidos y 1313 verdes; typecheck verde y lint vacío.
Los dos ficheros preparados se commitearon sin cambios adicionales.

c21: cuatro tests de R11, dobles Calendar/Clock, espía de tema acotado al
describe y Δ de las tres fechas de #123 R4. No se tocan los Δ de R8.
Se corrige además una aserción demasiado restrictiva que escribí en c19:
R10 comprueba el hueco de las secciones por token, sin fijar `flex-1` en
Fecha/Hora, porque R11 cambia esas proporciones a 3/2. No cambia el
número de tests ni se relanza c19; esta corrección sigue verde en c21.

c21 completado, `e3a86195`: `cadena=0`; 9 fallos permitidos (R11, R8 y
#123 R4) y 1310 verdes; typecheck y lint verdes, sin Reintento ni Flake.
c22: estado de foco del título, campos con Calendar/Clock y esquinas
continuas, proporciones 3/2 y formatos de fecha/hora prescritos. El
import `import { Calendar, Clock } from 'reicon-react-native';` está arriba,
con los imports de paquetes. Se mantiene una sola llamada a colores.

c22 completado, `03ff8a52`: `cadena=0`, 28 suites y 1319 tests verdes;
typecheck verde y lint vacío. Sin Reintento ni Flake.
c23: cinco `it` de R12 (tabla de cinco avisos, chips por defecto, cambio
de selección, anatomía/orden de vista previa y aviso efectivo), doble
Bell y deltas prescritos de chips, esquinas, accent-soft, copy e E1.3.

c23 completado, `2dc68762`: `cadena=0`; 30 fallos permitidos y 1298
verdes; typecheck y lint verdes, sin Reintento ni Flake.
c24: los avisos reutilizan `SELECTED_CHIP`; vista previa con Bell entre
Aviso y Guardar, calculada desde `selectedAdvance` (efectivo), con fecha
y hora locales prescritas. Sin fecha no se pinta la vista previa.

c24 completado, `30dd2a5e`: `cadena=0`, 28 suites y 1328 tests verdes;
typecheck verde y lint vacío. Sin Reintento ni Flake.
c25: ocho tests de R13, uno por viñeta y el inventario de radios;
solo cambia `src/__tests__/design-drift.test.ts`. Nacen verdes y su rojo
se demostrará con las sondas S1–S5 del handoff tras el commit.

c25 completado, `acde7bee`: `cadena=0`, 28 suites y 1336 tests verdes;
typecheck verde y lint vacío. Sin Reintento ni Flake.
Se inician las sondas literales S1–S7, secuenciales y sin commits de sus
mutaciones; cada una debe producir un solo fallo propio y `limpio=0`.

## Sondas S1–S7

Se ejecutaron los EJECUTORES literales, secuencialmente. Todas las
mutaciones se revirtieron y cada sonda falló únicamente en su test previsto.

### S1

```text
Tests:       1 failed, 89 skipped, 7 passed, 97 total
  ● #178 R13: Recordatorios sin deriva › no deja emoji en las dos pantallas ni en los metadatos
limpio=0
```

### S2

```text
Tests:       1 failed, 89 skipped, 7 passed, 97 total
  ● #178 R13: Recordatorios sin deriva › importa exactamente los iconos prescritos desde un único import de reicon
limpio=0
```

### S3

```text
Tests:       1 failed, 89 skipped, 7 passed, 97 total
  ● #178 R13: Recordatorios sin deriva › reutiliza HomeEntrance y PopIn sin Card en Recordatorios
limpio=0
```

### S4

```text
Tests:       1 failed, 89 skipped, 7 passed, 97 total
  ● #178 R13: Recordatorios sin deriva › sitúa la vista previa después de Aviso y antes de Guardar
limpio=0
```

### S5

```text
Tests:       1 failed, 89 skipped, 7 passed, 97 total
  ● #178 R13: Recordatorios sin deriva › reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto
limpio=0
```

### S6

```text
Tests:       1 failed, 94 skipped, 2 passed, 97 total
  ● #178 R2: enmienda de fidelidad al canvas en Recordatorios › A: conserva la sección, su firma, las directivas y el tamaño text-11
limpio=0
```

### S7

```text
Tests:       1 failed, 94 skipped, 2 passed, 97 total
  ● #178 R2: enmienda de fidelidad al canvas en Recordatorios › A: conserva la sección, su firma, las directivas y el tamaño text-11
limpio=0
```

## Cierre K1–K5

K1, comando literal del handoff, código 0:

```text
its-ok
```

K2, comando literal del handoff, código 0:

```text
exit=0
Test Suites: 28 passed, 28 total
Tests:       1336 passed, 1336 total
```

`K=1336` (supera el mínimo 1332). Se inicia K3 con su espera literal.


### K3 — batería completa, typecheck, lint y commits

Se ejecutaron las líneas literales de K3 en el orden del handoff:

```text
fin-espera
exit=0
Test Suites: 111 passed, 111 total
Tests:       3539 passed, 3539 total
all-ok S=111 M=3539 K=1336
$ tsc --noEmit
exit=0
exit=0
lint-ok
commits-ok
```

La batería completa pasó a la primera. No se activaron Reintento ni Flake
en K1–K3. `M=3539`, `K=1336`; el leader contrasta `M = ALL0 + 56` con
su medición de ALL0. Se verificaron los 25 commits de requisitos.

### K4 — trazabilidad e informe

Trazabilidad preparada con hash y mensaje de los commits rojo/verde de
R1–R12 y c25 para R13, todos en estado «hecho». R14 permanece «pendiente
(humano)» y su casilla en requirements.md sigue sin marcar.

La cadena literal de trazabilidad terminó con código 0. Extracto literal:

```text
[feature/178-mobile-routine-canvas-fidelity c12e0aea] docs(mobile-routine-canvas-fidelity): trazabilidad de #178
 1 file changed, 16 insertions(+), 16 deletions(-)
```

### Desviaciones — registro del resultado de K5

K5 compara contra HEAD e incluye este informe: su salida real solo existe
tras el primer commit del informe. Se registrará después en un segundo
commit documental del mismo fichero, usando de nuevo `git commit --only`.

## Fallos esperados de los rojos c13–c23

Los candados de typecheck y lint de todas estas cadenas pasaron. No se registraron errores TS ni avisos de lint en sus tests.

### c13

```text
  ● #178 R7: entrada escalonada y badge › asigna a cada entrada su índice en el orden del fixture
  ● #178 R7: entrada escalonada y badge › envuelve cada fila en su propia entrada
  ● #178 R7: entrada escalonada y badge › envuelve el badge próximo con PopIn y la receta del canvas
  ● #178 R7: entrada escalonada y badge › reserva el pop para la fila próxima y lo omite en la lejana
```

### c15

```text
  ● #178 R8: sheet de borrado del canvas › centra los cinco hijos del sheet con el marco del canvas
  ● #178 R8: sheet de borrado del canvas › abre el sheet con el mosaico rosa y Trash de 26 en tinta danger
  ● #178 R8: sheet de borrado del canvas › centra título, referencia y cuerpo con sus pesos propios
  ● #178 R8: sheet de borrado del canvas › termina con las dos acciones en un grupo de ancho completo
```

### c17

```text
  ● #178 R9: el vacío ofrece crear › ofrece Nuevo dentro del estado vacío
  ● #178 R9: el vacío ofrece crear › abre el formulario una sola vez desde la acción del vacío
  ● #178 R9: el vacío ofrece crear › ofrece la acción del vacío junto al enlace Nuevo de la cabecera
  ● #65 R8: Recordatorios resuelve su copy por clave › resuelve las 49 ocurrencias normativas
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta
```

### c19

```text
  ● R8: formulario de alta con chips y pickers › uses the metrics under the native header (#95 R6)
  ● R8: formulario de alta con chips y pickers › opens the date picker and reflects the selected date
  ● R8: formulario de alta con chips y pickers › opens the time picker with 09:00 and reflects a new time
  ● #178 R10: marco, título y chips de tipo del canvas › usa el marco 20/24/16 bajo la cabecera nativa
  ● #178 R10: marco, título y chips de tipo del canvas › abre el formulario con Agregar recordatorio como título accesible
  ● #178 R10: marco, título y chips de tipo del canvas › da a las cinco etiquetas y sus secciones las recetas del canvas
  ● #178 R10: marco, título y chips de tipo del canvas › pinta Vacuna seleccionada con cápsula, labio y texto sin emoji
  ● #178 R10: marco, título y chips de tipo del canvas › pinta los chips violeta y neutro sin seleccionar con sus tintas
  ● #178 R10: marco, título y chips de tipo del canvas › invierte las recetas al seleccionar Otro
  ● #95 R5: la pantalla no dibuja cabecera propia › retira el botón; el título vive en el cuerpo (#178 R10)
  ● #65 R8: Recordatorios resuelve su copy por clave › resuelve las 49 ocurrencias normativas
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta
  ● #95 R4: cada pantalla de detalle declara su cabecera nativa › add-reminder usa exactamente las opciones de cabecera acordadas
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban
  ● #64 R9: el color categórico solo se nombra en el módulo de paleta › conserva los usos de bg-accent-soft que sí son acento
  ● #166 R2: todo primario sólido lleva el labio detrás de bg-accent › no deja la receta del labio fuera de un primario salvo el candado de Recuperar
  ● #174 R12: inventarios › limita tracking-title a su inventario de producción
```

### c21

```text
  ● R8: formulario de alta con chips y pickers › opens the date picker and reflects the selected date
  ● R8: formulario de alta con chips y pickers › opens the time picker with 09:00 and reflects a new time
  ● #123: pickers de fecha de Nuevo recordatorio en Android a las 20:00 del 24 de septiembre › #123 R4: Nuevo recordatorio muestra y guarda el día elegido › elegir hoy (24 de septiembre) guarda hoy
  ● #123: pickers de fecha de Nuevo recordatorio en Android a las 20:00 del 24 de septiembre › #123 R4: Nuevo recordatorio muestra y guarda el día elegido › elegir el 1 de octubre guarda el 1 de octubre (cruce de mes)
  ● #123: pickers de fecha de Nuevo recordatorio en Android a las 20:00 del 24 de septiembre › #123 R4: Nuevo recordatorio muestra y guarda el día elegido › elegir el 1 de enero de 2027 guarda el 1 de enero (cruce de año)
  ● #178 R11: título, fecha y hora del canvas › alterna el borde completo del título al recibir y perder foco
  ● #178 R11: título, fecha y hora del canvas › abre cada campo con su icono de 18 y tinta muted
  ● #178 R11: título, fecha y hora del canvas › pinta la fecha vacía como texto base seminegrita y muted
  ● #178 R11: título, fecha y hora del canvas › refleja la hora elegida en formato de 24 horas
```

### c23

```text
  ● #125: avisos que ya pasaron en Nuevo recordatorio › #125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro › a 7 días justos del 1 de julio, el aviso de 7 días cae en el instante actual y cuenta como pasado (cruce de mes)
  ● #125: avisos que ya pasaron en Nuevo recordatorio › #125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro › a 7 días y 1 minuto del 1 de julio, el aviso de 7 días sigue en el futuro (cruce de mes)
  ● #125: avisos que ya pasaron en Nuevo recordatorio › #125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro › el 1 de enero de 2027 desde el mediodía del 29 de diciembre queda el aviso de 1 día (cruce de año)
  ● #125: avisos que ya pasaron en Nuevo recordatorio › #125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro › el 1 de octubre desde la noche del 30 de septiembre solo queda el mismo día (cruce de mes)
  ● #125: avisos que ya pasaron en Nuevo recordatorio › #125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro › el 30 de septiembre a 3 días justos, el aviso de 3 días cuenta como pasado
  ● #125: avisos que ya pasaron en Nuevo recordatorio › #125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro › el 1 de enero de 2027 a 1 día justo, el aviso de 1 día cuenta como pasado (cruce de año)
  ● #125: avisos que ya pasaron en Nuevo recordatorio › #125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro › a la hora exacta del recordatorio todos cuentan como pasados y el formulario lo rechaza
  ● #125: avisos que ya pasaron en Nuevo recordatorio › #125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro › pulsar un chip desactivado no cambia la selección
  ● #125: avisos que ya pasaron en Nuevo recordatorio › #125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro › al cambiar fecha u hora se recalcula: la elección explícita se conserva mientras siga en el futuro y vuelve cuando deja de estar en el pasado
  ● #125: avisos que ya pasaron en Nuevo recordatorio › #125 R4: los chips se evalúan con el instante del último cambio de fecha u hora y guardar recalcula con el del envío › cambiar la hora reevalúa los chips con el instante del cambio
  ● #125: avisos que ya pasaron en Nuevo recordatorio › #125 R4: los chips se evalúan con el instante del último cambio de fecha u hora y guardar recalcula con el del envío › volver a elegir la fecha reevalúa los chips con el instante del cambio
  ● #125: avisos que ya pasaron en Nuevo recordatorio › #125 R4: los chips se evalúan con el instante del último cambio de fecha u hora y guardar recalcula con el del envío › guardar envía el mayor aviso aún futuro en el instante del envío
  ● #125: avisos que ya pasaron en Nuevo recordatorio › #125 R6: la elección explícita del aviso se conserva al cambiar fecha u hora (Enmienda E1) › con avisos mayores activos, cambiar fecha u hora conserva el aviso elegido
  ● #125: avisos que ya pasaron en Nuevo recordatorio › #125 R6: la elección explícita del aviso se conserva al cambiar fecha u hora (Enmienda E1) › con todos los chips desactivados sigue marcada la elección, no un valor fijo
  ● #178 R12: chips de aviso y vista previa › muestra el aviso efectivo null a las 9:0
  ● #178 R12: chips de aviso y vista previa › muestra el aviso efectivo 1440 a las 9:0
  ● #178 R12: chips de aviso y vista previa › muestra el aviso efectivo 0 a las 9:0
  ● #178 R12: chips de aviso y vista previa › muestra el aviso efectivo 4320 a las 9:0
  ● #178 R12: chips de aviso y vista previa › muestra el aviso efectivo 0 a las 20:5
  ● #178 R12: chips de aviso y vista previa › pinta el aviso por defecto y los demás chips con sus recetas y pesos
  ● #178 R12: chips de aviso y vista previa › invierte la receta del seleccionado y su etiqueta al elegir un día antes
  ● #178 R12: chips de aviso y vista previa › coloca Bell y el texto en la vista previa entre Aviso y Guardar
  ● #178 R12: chips de aviso y vista previa › usa el aviso efectivo cuando los tres anticipados ya pasaron
  ● #65 R8: Recordatorios resuelve su copy por clave › resuelve las 49 ocurrencias normativas
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta
  ● #173 R2: inventario de radios nuevos › reserva rounded-tile a los accesos de Perfil
  ● #173 R2.4: inventario de tamaños nuevos › limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8)
  ● #62 R14: toda esquina no-cápsula que dibuja el repo es continua › screens/add-reminder/index.tsx importa y aplica sus 4 esquinas
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban
  ● #64 R9: el color categórico solo se nombra en el módulo de paleta › conserva los usos de bg-accent-soft que sí son acento
```

