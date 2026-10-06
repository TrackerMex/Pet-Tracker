---
feature: mobile-health-make-parity
id: 115
status: spec_ready
tags: [harness, spec, mobile, ui]
---

# Trazabilidad — #115 mobile-health-make-parity

| R | Requisito | Test (fichero › describe › it) | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|---|
| R1 | Copy: 0 claves nuevas, 3 claves de Home reusadas | `src/__tests__/ui-language.test.ts` › `#65 R5: Health resuelve su copy por clave` › `resuelve las 32 ocurrencias normativas` y `#65 R18: los sitios resuelven por clave y no queda copy suelta` › `resuelve cada ocurrencia de la tabla contra la clave exacta`; literales en las filas de R6 | `a88ce6c8` — `test(mobile-health): #115 R6 red, next vaccine date and countdown` | `08d106e2` — `feat(mobile-health): #115 R6 show next dose date and days left` | verificado |
| R2 | Hero a sangre con el patrón A9 | `src/screens/health/index.test.tsx` › `#115 R2: Salud abre con el hero a sangre (A9)` (3 `it` + `it.each` de 5: 8 casos) + 2 `it` adaptados de `R4: health resuelve la mascota seleccionada` | `78a2a0cd` — `test(mobile-health): #115 R2 R3 red, bleed hero and A9 wrappers` | `3cbdc49b` — `feat(mobile-health): #115 R2 R3 bleed pet hero with A9 layout` | verificado |
| R3 | El hero muestra la mascota seleccionada | `src/screens/health/index.test.tsx` › `#115 R3: el hero muestra la mascota seleccionada de la lista` (3 `it`) | `78a2a0cd` — `test(mobile-health): #115 R2 R3 red, bleed hero and A9 wrappers` | `3cbdc49b` — `feat(mobile-health): #115 R2 R3 bleed pet hero with A9 layout` | verificado |
| R4 | Historial de peso con la clave de weight-log | `src/screens/health/index.test.tsx` › 2 `it` adaptados de `R4: health resuelve la mascota seleccionada` + `#87 R13: HealthScreen lee por TanStack Query` › `deja mascotas, vacunas y el historial de peso en sus claves canónicas` | `4763b520` — `test(mobile-health): #115 R4 red, weights without limit` | `4157d681` — `feat(mobile-health): #115 R4 share the weight-log query` | verificado |
| R5 | WeightChart en la weight card | `src/screens/health/index.test.tsx` › `#115 R5: la weight card dibuja la evolución con WeightChart` (4 `it` + `it.each` de 2: 6 casos) | `7e7f4a90` — `test(mobile-health): #115 R5 red, weight chart in the card` | `1ae2b78f` — `fix(mobile-health): #115 R5 green, assert the chart slot itself` | verificado tras CORRECCIÓN 1 |
| R6 | Fecha y días de la próxima vacuna | `src/screens/health/index.test.tsx` › `#115 R6: la próxima vacuna dice fecha y días restantes` (`it.each` a..g + 2 `it`) + `R5: vacunas con la próxima destacada` › `highlights the nearest future dose and keeps row order` | `a88ce6c8` — `test(mobile-health): #115 R6 red, next vaccine date and countdown` | `08d106e2` — `feat(mobile-health): #115 R6 show next dose date and days left` | verificado |
| R7 | Candados globales: deltas y anclas negativas | `src/__tests__/consistency-classnames.test.ts` › `#62 R15: todo contador usa cifras tabulares` › `screens/health/index.tsx aplica TABULAR_NUMS a sus 3 valores` y `#69 R10: mantiene la base cerrada más los deltas medidos`; `src/__tests__/ui-language.test.ts` › `#65 R5: Health resuelve su copy por clave` › `resuelve las 32 ocurrencias normativas`; comandos R7 de abajo | `a88ce6c8` — `test(mobile-health): #115 R6 red, next vaccine date and countdown` | `08d106e2` — `feat(mobile-health): #115 R6 show next dose date and days left` | verificado; #69 R10 nace verde |
| R8 | Alcance cerrado | comandos R8 de abajo: diff, grep-clean, typecheck, lint y Jest entero; sin test nuevo | — (verificación de alcance) | `08d106e2` — `feat(mobile-health): #115 R6 show next dose date and days left`; evidencia en `bd2f67d9` — `docs(mobile-health-make-parity): record #115 implementation evidence` | verificado |
| R9 | Smoke humano en dev build de Android | gate humano (S1..S9) | — | — | gate humano |

R5 conserva `b6c08b2a` — `feat(mobile-health): #115 R5 render WeightChart history`
como **impl, no verde: aserción de test corregida en `1ae2b78f`**. El hijo
`[2]` es el nodo `weight-chart`; `within()` excluía su raíz. La CORRECCIÓN 1
comprobó directamente `elementChild(card, 2).props.testID`, recuperó la
sangría del bloque y midió 46/46 antes del fix. No se reescribió historia.

Las cuentas del rojo T4 fueron exactamente 13 fallos: 9 por consulta y 4
por aserción, incluidos R1 y R7. El humano autorizó el commit rojo cuando
el registrador valida ese resultado y da exit=0; los verdes requieren
Jest y registrador en 0. El informe conserva cada diagnóstico, matcher,
Expected/Received, comando y cuenta de T1–T4.

Las sondas M1–M22 se midieron sobre `08d106e2`, coincidieron con design §2
y se restauraron con `git checkout HEAD -- <ruta>`; ambas comprobaciones
`git diff --quiet -- <ruta>` y `git diff --cached --quiet` dieron exit=0
tras cada sonda. No se commitearon mutaciones.

## Verificación R7

Desde `mobile-pet-tracker/`, estas anclas de cierre dieron 1 cada una.
Los deltas se aplicaron sobre las expresiones de H0, que #117 no cambió;
`directUses` sigue en 2 y solo `counters` pasa a `2 + 1`.

```bash
grep -cF 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3); // +1 #90 R5, +1 #95 R4, -2 #95 R5, +3 #115 R1' src/__tests__/ui-language.test.ts
grep -cF "[join('screens', 'health', 'index.tsx'), 2 + 1], // #115 R6" src/__tests__/consistency-classnames.test.ts
grep -cF '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1, // #146 R18, #105 R11, #116 R5, #115 R6' src/__tests__/consistency-classnames.test.ts
grep -cF "[join('screens', 'health', 'index.tsx'), 1]," src/__tests__/legibility-classnames.test.ts
grep -cF '13 + 1 + 1' src/__tests__/legibility-classnames.test.ts
grep -cF '+ 2, // #118 R11' src/__tests__/legibility-classnames.test.ts
grep -cF '+ 8, // #118 R1' src/providers/__tests__/language-provider.test.tsx
grep -cF "'screens/health/index.tsx': 0," src/__tests__/design-drift.test.ts
grep -cF "import { Card } from '../../components/card';" src/screens/health/index.tsx
```

El Jest entero citado en R8 confirmó los candados globales. Las 45 anclas
de H0 y las 48 de cierre, con comandos y salidas, constan en el
[informe de implementación](../../progress/impl_mobile-health-make-parity.md).

## Verificación R8

Desde la raíz, los dos primeros comandos dieron salida vacía y exit=0.
La CORRECCIÓN 2 del handoff sustituye la comparación con H0 por
`origin/main...HEAD`, tras el merge `a3548767` de #117 hecho por el leader:

```bash
git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock
git diff --stat origin/main -- backend-pet-tracker/
git diff --name-only origin/main...HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-health-make-parity.md' ':!specs/mobile-health-make-parity/requirements.md' ':!specs/mobile-health-make-parity/design.md' ':!specs/mobile-health-make-parity/tasks.md' ':!.claude/agents/leader.md'
```

El tercer comando dio exactamente los siete ficheros de design §1.2 y
exit=0, después del commit previo solo del impl autorizado por el humano.
`origin/main` sigue en `e002a4a5`; `git merge-base --is-ancestor origin/main HEAD`
dio exit=0. No se tocaron dependencias, app.json ni backend.

Desde `mobile-pet-tracker/`, las anclas 28–31 dieron 0:

```bash
grep -cF 'react-native-reanimated' src/screens/health/index.tsx
grep -cF 'StyleSheet.create' src/screens/health/index.tsx
grep -cE '#[0-9A-Fa-f]{3,8}\b' src/screens/health/index.tsx
grep -cE '\w-\[' src/screens/health/index.tsx
```

Cierre medido sin pipe, con los logs y exits en el informe:

```bash
test ! -e .expo/types/router.d.ts; echo "exit=$?"
bun run typecheck > /tmp/115-final-typecheck.txt 2>&1
bun run lint > /tmp/115-final-lint.txt 2>&1
bunx jest --maxWorkers=2 --json --outputFile=/tmp/115-final-jest.json > /tmp/115-final-jest.txt 2>&1
```

Guarda router.d.ts: exit=0. Typecheck, lint y Jest entero: exit=0.
Jest: **94 suites, 2139 tests y 1 snapshot verdes**. Las ocho suites de
control suman 292: Salud 29 → 55 (+26), las otras siete 237. El único
delta ajeno es language-provider 22 → 24 por #117; ese fichero no se
editó. No se borró ningún `it`.

R9 y sus casillas S1–S9 quedan al humano. No se hizo push ni se abrió PR.
