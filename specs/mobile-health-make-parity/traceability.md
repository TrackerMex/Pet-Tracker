---
feature: mobile-health-make-parity
id: 115
status: approved
tags: [harness, spec, mobile, ui]
---

# Trazabilidad — #115 mobile-health-make-parity

| R | Requisito | Test (fichero › describe › it) | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|---|
| R1 | Copy: 0 claves nuevas, 3 claves de Home reusadas | `src/__tests__/ui-language.test.ts` › `#65 R5: Health resuelve su copy por clave` › `resuelve las 32 ocurrencias normativas` y `#65 R18: los sitios resuelven por clave y no queda copy suelta` › `resuelve cada ocurrencia de la tabla contra la clave exacta`; literales en las filas de R6 | `a88ce6c8` — `test(mobile-health): #115 R6 red, next vaccine date and countdown` | `08d106e2` — `feat(mobile-health): #115 R6 show next dose date and days left` | verificado |
| R2 | Hero a sangre con el patrón A9 | `src/screens/health/index.test.tsx` › `#115 R2: Salud abre con el hero a sangre (A9)` (3 `it` + `it.each` de 5: 8 casos) + 2 `it` adaptados de `R4: health resuelve la mascota seleccionada`; E1.1 liga el padre común a `screen-health` en `con mascotas, pet-hero y health-content son los únicos hijos del scroll, en ese orden` | `78a2a0cd` — `test(mobile-health): #115 R2 R3 red, bleed hero and A9 wrappers` | `3cbdc49b` — `feat(mobile-health): #115 R2 R3 bleed pet hero with A9 layout`; E1.1: `6c8baf9a` — `test(mobile-health): #115 E1.1 lock hero and content under the scroll` | verificado tras E1.1; M25 por aserción |
| R3 | El hero muestra la mascota seleccionada | `src/screens/health/index.test.tsx` › `#115 R3: el hero muestra la mascota seleccionada de la lista` (3 `it`) | `78a2a0cd` — `test(mobile-health): #115 R2 R3 red, bleed hero and A9 wrappers` | `3cbdc49b` — `feat(mobile-health): #115 R2 R3 bleed pet hero with A9 layout` | verificado |
| R4 | Historial de peso con la clave de weight-log | `src/screens/health/index.test.tsx` › 2 `it` adaptados de `R4: health resuelve la mascota seleccionada` + `#87 R13: HealthScreen lee por TanStack Query` › `deja mascotas, vacunas y el historial de peso en sus claves canónicas` | `4763b520` — `test(mobile-health): #115 R4 red, weights without limit` | `4157d681` — `feat(mobile-health): #115 R4 share the weight-log query` | verificado |
| R5 | WeightChart en la weight card | `src/screens/health/index.test.tsx` › `#115 R5: la weight card dibuja la evolución con WeightChart` (4 `it` + `it.each` de 2: 6 casos) | `7e7f4a90` — `test(mobile-health): #115 R5 red, weight chart in the card` | `1ae2b78f` — `fix(mobile-health): #115 R5 green, assert the chart slot itself` | verificado tras CORRECCIÓN 1 |
| R6 | Fecha y días de la próxima vacuna | `src/screens/health/index.test.tsx` › `#115 R6: la próxima vacuna dice fecha y días restantes` (`it.each` a..h + 2 `it`) + `R5: vacunas con la próxima destacada` › `highlights the nearest future dose and keeps row order`; E1.2 usa hora/minuto y TZ por fila, con restauración en finally | `a88ce6c8` — `test(mobile-health): #115 R6 red, next vaccine date and countdown` | `08d106e2` — `feat(mobile-health): #115 R6 show next dose date and days left`; E1.2: `6ac7346d` — `test(mobile-health): #115 E1.2 time zone row for next vaccine days` | verificado tras E1.2; M23 solo h y M24 a–h por aserción |
| R7 | Candados globales: deltas y anclas negativas | `src/__tests__/consistency-classnames.test.ts` › `#62 R15: todo contador usa cifras tabulares` › `screens/health/index.tsx aplica TABULAR_NUMS a sus 3 valores` y `#69 R10: mantiene la base cerrada más los deltas medidos`; `src/__tests__/ui-language.test.ts` › `#65 R5: Health resuelve su copy por clave` › `resuelve las 32 ocurrencias normativas`; comandos R7 de abajo | `a88ce6c8` — `test(mobile-health): #115 R6 red, next vaccine date and countdown` | `08d106e2` — `feat(mobile-health): #115 R6 show next dose date and days left` | verificado; #69 R10 nace verde |
| R8 | Alcance cerrado | comandos R8 de abajo: lista exacta de 10, diff, grep-clean, typecheck, lint y Jest entero; sin test nuevo | — (verificación de alcance) | `08d106e2` — `feat(mobile-health): #115 R6 show next dose date and days left`; E2: `92c4e5d6` — `feat(mobile-assets): #115 R10 transparent splash with the mascot alone`; evidencia T8.9 en el impl | verificado en ronda 2 |
| R9 | Smoke humano en dev build de Android | gate humano (S1..S11; S10–S11 por la Enmienda E2) | — | — | gate humano |
| R10 | Splash y bienvenida: la mascota sola sobre transparente (Enmienda E2) | `app.assets.test.ts` › `#115 R10: el splash es la mascota sola sobre transparente` › `no hay alfa fuera de la zona segura [174, 850)`, `las cuatro esquinas del antiguo cuadrado son transparentes`, `la punta del pin es transparente`, `la cara de la mascota es opaca` | `45198dd4` — `test(mobile-assets): #115 R10 red, splash without square or pin` | `92c4e5d6` — `feat(mobile-assets): #115 R10 transparent splash with the mascot alone` | verificado; PNG firmado; M26–M28 por aserción |

E1.1 y E1.2 nacen verdes: producción ya cumple los requisitos. M25 mata la
aserción nueva de R2; M23 mata solo h y M24 mata a–h de R6. Salud pasa de
55 a 56 casos. H2 = `07851dc4ba27c211aafbb4ed14428a2668460268`; el diff de
producción de Salud entre H2 y el cierre es vacío. El informe conserva
cada sonda, su caída por aserción y su restauración.

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
La base de la ronda 2 sigue en `origin/main` `e002a4a5`; la CORRECCIÓN 2
integró #117 con `a3548767`, y E2 amplía la lista cerrada a 10:

```bash
git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock
git diff --stat origin/main -- backend-pet-tracker/
git diff --name-only origin/main...HEAD -- . ':!feature_list.json' ':!STATUS.md' ':!progress/current.md' ':!progress/handoff_mobile-health-make-parity.md' ':!progress/review_mobile-health-make-parity.md' ':!specs/mobile-health-make-parity/requirements.md' ':!specs/mobile-health-make-parity/design.md' ':!specs/mobile-health-make-parity/tasks.md' ':!.claude/agents/leader.md'
```

Salida del tercer comando, exactamente los 10 ficheros de design §1.2:

```text
mobile-pet-tracker/app.assets.test.ts
mobile-pet-tracker/assets/images/splash-icon.png
mobile-pet-tracker/scripts/make-icons.mjs
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/screens/health/index.test.tsx
mobile-pet-tracker/src/screens/health/index.tsx
progress/impl_mobile-health-make-parity.md
specs/mobile-health-make-parity/traceability.md
exit=0
```

`git merge-base --is-ancestor origin/main HEAD` dio exit=0. Sin cambios de
dependencias, app.json, configuración del splash, bienvenida ni backend.
`git diff --quiet H2 HEAD -- src/screens/health/index.tsx` (desde mobile)
dio exit=0: E1–E2 no modifica producción de Salud.

Desde `mobile-pet-tracker/`, las anclas 28–31 siguen dando 0:

```bash
grep -cF 'react-native-reanimated' src/screens/health/index.tsx
grep -cF 'StyleSheet.create' src/screens/health/index.tsx
grep -cE '#[0-9A-Fa-f]{3,8}\b' src/screens/health/index.tsx
grep -cE '\w-\[' src/screens/health/index.tsx
```

Cierre de la ronda 2 medido sin pipe; cada exit fue 0 y los logs completos
se conservan en las rutas de estos comandos y en el informe:

```bash
test ! -e .expo/types/router.d.ts; echo "exit=$?"
bun run typecheck > /tmp/115-r2-final-typecheck.log 2>&1; echo "exit=$?"
bun run lint > /tmp/115-r2-final-lint.log 2>&1; echo "exit=$?"
bunx jest --maxWorkers=2 --json --outputFile=/tmp/115-r2-final-jest.json > /tmp/115-r2-final-jest.log 2>&1; echo "exit=$?"
```

Jest: **94 suites, 2144 tests y 1 snapshot verdes**, 2139 + 5 sobre la
ronda 1. Salud 55 → 56 (+1, fila h); app.assets 7 → 11 (+4, R10). Las
otras siete suites de control mantienen sus recuentos: ui-language 30,
pet-hero-header 37, design-drift 60, weight-chart 4, consistency 55,
language-provider 24 y legibility 27. No se borró ningún `it`.

## Verificación R10

Rojo de `45198dd4`: exactamente dos fallos por aserción, esquinas
`[676, 676, 676, 676]` y pin `1600`; fuera/cara y los siete casos #101
verdes (9 passed, 11 total), Jest exit=1 esperado y registrador exit=0.

El humano aprobó el candidato con firma en `35476758`. SHA256 firmado y
commiteado en el verde `92c4e5d6`:
`087c1eaa69e8324ac46e98073897ddc261d3f25b764f00d6216fb5014c05e56d`.
Imagegen con respaldo cian, eliminación de fondo antes de RESIZE_BICUBIC
a 676×676 y composición en (174,174) sobre 1024×1024 transparente. Las
rutas de outputs, previews, prompt y candidato fallido quedan en el impl.

Antes del verde: app.assets 11, app.config 21 y bienvenida 28, todos verdes
(60 total, Jest exit=0 y registrador exit=0). Ese commit solo modifica el
PNG y elimina el import fs y la copia al splash en make-icons; no ejecuta
el script ni expo prebuild.

| Sonda | Aserción que cae | Resultado | Restauración |
|---|---|---|---|
| M26: PNG de origin/main | esquinas y pin | 2 failed, 9 passed; [676,676,676,676] y 1600; Jest exit=1 | checkout HEAD, diff del PNG exit=0 y cached exit=0 |
| M27: lienzo vacío | cara | 1 failed, 10 passed; 0 ≠ 255; Jest exit=1 | checkout HEAD, diff del PNG exit=0 y cached exit=0 |
| M28: composición en (0,0) | fuera; también cara, que queda vacía con este desplazamiento | 2 failed, 9 passed; fuera 38317 ≠ 0, cara 0 ≠ 255; Jest exit=1 | checkout HEAD, diff del PNG exit=0 y cached exit=0 |

PNG de M27 y M28 en `/tmp/115-splash/`, sin commit. Tras cada restauración
se conserva el SHA256 firmado. Anclas de R10 (declarado / medido):

| Ancla | Antes | Después |
|---|---|---|
| splash-icon en make-icons | 1 / 1 | 0 / 0 |
| node:fs en make-icons | 1 / 1 | 0 / 0 |
| diff assets/ origin/main...HEAD | vacío / vacío | solo splash-icon.png / solo mobile-pet-tracker/assets/images/splash-icon.png |

R9 y sus casillas S1–S11 quedan al humano en el dev build de Android,
tras la review de ronda 2. S10 exige prebuild y reinstalar el dev build;
S11 comprueba bienvenida en ambos temas y splash-logo. No se hizo push ni
se abrió PR por instrucción del handoff; no se marca la feature done.
