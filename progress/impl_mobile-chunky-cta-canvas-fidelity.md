# Implementación #177 — verificación automatizada completada

Fecha: 2026-10-19. Receta global aplicada a los 17 ficheros de producción
previstos, con token de labio por tema, hook memoizado, alturas/radios y las
15 conversiones de etiquetas. c1–c11, c5b y las correcciones E2/E3/E4 están
commiteados por separado. Este informe y traceability pertenecen a c12.

Suite final: **3994/3994**, exactamente **T0 + 81**. Los 20 ficheros de test
modificados pasan individualmente; los guards completos, el escáner AST,
las anclas finales, las 14 sondas y la prueba de pisos exactos se verificaron.
**R14 y la aprobación humana de la carta siguen sin marcar**, reservadas al
humano tras el reviewer. No se declara la feature done en feature_list.

## Worktree y referencia inicial

Confirmado antes de tocar archivos en las reanudaciones:

```text
pwd
/home/claude/sites/Pet-Tracker-wt-177
git branch --show-current
feature/177-mobile-chunky-cta-canvas-fidelity
```

H0 = `810697769ae564058dc9daa7635db55c3c7a80bd` (handoff original).
Último `git pull`: `Already up to date.`; HEAD inicial de esta reanudación:
`e1844426d094dc0ff1db2d390c91ced832e9821a`, aprobación de E4.
Se leyó E4 y su casilla firmada. H0 y T0 se conservaron durante las reanudaciones.

Solo se trabajó en este worktree. No hubo init.sh, reinstalación, dependencias
nuevas, AWS, deploy, push, rebase, stash ni cambios de PR. No se editaron STATUS,
progress/current, progress/history, feature_list ni casillas humanas.

## Skills cargadas

Leídas en el intento inicial y conservadas durante las reanudaciones:

- `building-native-ui`: `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`.
- `expo-tailwind-setup`: `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/expo-tailwind-setup/SKILL.md`.
- `ponytail`: `/home/claude/.codex/plugins/cache/ponytail/ponytail/5.3.2/skills/ponytail/SKILL.md`, indicada para tareas de código.

No se cargaron appllama-app-design-skill, animate-expo ni otras skills de Expo.
No se aplicaron las instrucciones genéricas de migrar o instalar dependencias.

## Anclas de H0

A1–A14 coincidieron en el arranque original y se comprobaron de nuevo en una
sola pasada tras la instalación del leader. Se usó el bloque bash de requirements
con el prefijo cd móvil. Las anclas finales constan más abajo.

| Ancla | Medido | Esperado |
|---|---:|---:|
| A1 | 16 | 16 |
| A2 | 18 | 18 |
| A3 | 20 | 20 |
| A4 | 7 | 7 |
| A5 | 10 | 10 |
| A6 | 35 | 35 |
| A7 | 82 | 82 |
| A8 | 8 | 8 |
| A9 | 5 | 5 |
| A10 | 3 | 3 |
| A11 | 5 | 5 |
| A12 | 0 / 0 | 0 / 0 |
| A13 | 0 / 2 | 0 / 2 |
| A14 | 1 / 1 | 1 / 1 |

## T0

Una sola ejecución válida tras instalar el leader las dependencias, antes de
c1 y sin pipe:

```bash
cd "$(git rev-parse --show-toplevel)/mobile-pet-tracker" && bun run test > /tmp/pet-tracker-177-T0-resume.log 2>&1; grep -E '^Tests:' /tmp/pet-tracker-177-T0-resume.log
```

```text
Test Suites: 118 passed, 118 total
Tests:       3913 passed, 3913 total
```

T0 = **3913**. Objetivo final: **3994** (`T0 + 81`), verificado al cierre.
El escáner AST de #187 se confirmó verde por separado en H0 (25/25).

## Grep de R10 en H0

Resultado completo del comando literal, salida 0:

```text
src/__tests__/account-screens-polish.test.ts
src/__tests__/alert-detail-canvas-fidelity.test.ts
src/__tests__/consistency-classnames.test.ts
src/__tests__/design-drift.test.ts
src/__tests__/heroui-text-size-merge.test.ts
src/__tests__/legibility-classnames.test.ts
src/app/(tabs)/__tests__/food.test.tsx
src/components/__tests__/celebration.test.tsx
src/components/__tests__/empty-state.test.tsx
src/screens/add-reminder/index.test.tsx
src/screens/alert-detail/index.test.tsx
src/screens/alerts/index.test.tsx
src/screens/docs-upload-form/index.test.tsx
src/screens/forgot/index.test.tsx
src/screens/geofence-editor/index.test.tsx
src/screens/geofences/index.test.tsx
src/screens/home/index.test.tsx
src/screens/home/weekly-activity-chart.test.tsx
src/screens/login/index.test.tsx
src/screens/meal-schedule/index.test.tsx
src/screens/register/index.test.tsx
src/screens/reminders/index.test.tsx
src/screens/reset-password/index.test.tsx
src/screens/welcome/index.test.tsx
```

Las coincidencias no autorizaron editar fuera del alcance. No se tocaron
alerts, meal-schedule ni sus tests. Las sondas autorizadas sobre esas rutas se ejecutaron y se restauraron.

## Totales individuales en H0 antes del primer commit

Cada fichero corrió solo, con bunx jest, secuencialmente y sin flags.

| Fichero bajo mobile-pet-tracker/ | Tests: | Log |
|---|---|---|
| `src/theme/__tests__/global-css.test.ts` | `Tests:       69 passed, 69 total` | `/tmp/177-baseline-0.log` |
| `src/__tests__/consistency-classnames.test.ts` | `Tests:       72 passed, 72 total` | `/tmp/177-baseline-1.log` |
| `src/__tests__/design-drift.test.ts` | `Tests:       113 passed, 113 total` | `/tmp/177-baseline-2.log` |
| `src/__tests__/account-screens-polish.test.ts` | `Tests:       13 passed, 13 total` | `/tmp/177-baseline-3.log` |
| `src/__tests__/heroui-text-size-merge.test.ts` | `Tests:       25 passed, 25 total` | `/tmp/177-baseline-4.log` |
| `src/__tests__/alert-detail-canvas-fidelity.test.ts` | `Tests:       20 passed, 20 total` | `/tmp/177-baseline-5.log` |
| `src/components/__tests__/celebration.test.tsx` | `Tests:       66 passed, 66 total` | `/tmp/177-baseline-6.log` |
| `src/components/__tests__/empty-state.test.tsx` | `Tests:       101 passed, 101 total` | `/tmp/177-baseline-7.log` |
| `src/screens/welcome/index.test.tsx` | `Tests:       85 passed, 85 total` | `/tmp/177-baseline-8.log` |
| `src/screens/login/index.test.tsx` | `Tests:       43 passed, 43 total` | `/tmp/177-baseline-9.log` |
| `src/screens/register/index.test.tsx` | `Tests:       73 passed, 73 total` | `/tmp/177-baseline-10.log` |
| `src/screens/forgot/index.test.tsx` | `Tests:       52 passed, 52 total` | `/tmp/177-baseline-11.log` |
| `src/screens/reset-password/index.test.tsx` | `Tests:       52 passed, 52 total` | `/tmp/177-baseline-12.log` |
| `src/screens/pairing/index.test.tsx` | `Tests:       61 passed, 61 total` | `/tmp/177-baseline-13.log` |
| `src/screens/home/index.test.tsx` | `Tests:       227 passed, 227 total` | `/tmp/177-baseline-14.log` |
| `src/screens/alert-detail/index.test.tsx` | `Tests:       127 passed, 127 total` | `/tmp/177-baseline-15.log` |
| `src/screens/add-pet/index.test.tsx` | `Tests:       41 passed, 41 total` | `/tmp/177-baseline-16.log` |
| `src/screens/add-reminder/index.test.tsx` | `Tests:       60 passed, 60 total` | `/tmp/177-baseline-17.log` |
| `src/screens/docs-upload-form/index.test.tsx` | `Tests:       73 passed, 73 total` | `/tmp/177-baseline-18.log` |
| `src/screens/geofence-editor/index.test.tsx` | `Tests:       68 passed, 68 total` | `/tmp/177-baseline-19.log` |
| `src/screens/geofences/index.test.tsx` | `Tests:       58 passed, 58 total` | `/tmp/177-baseline-20.log` |
| `src/screens/weight-log/index.test.tsx` | `Tests:       58 passed, 58 total` | `/tmp/177-baseline-21.log` |
| `src/screens/reminders/index.test.tsx` | `Tests:       64 passed, 64 total` | `/tmp/177-baseline-22.log` |

## Commits reales y orden test primero

Cada hash c1–c11 y cada commit adicional se verificó con git cat-file -e.
Los commits del leader que aprueban/corrigen specs no se renumeran.

| Etapa | Hash | Mensaje |
|---|---|---|
| c1 | `f99457f9c3ef401ef1f5a3f49290644714299551` | `test(#177 R2): token del labio y hook useChunkyLip (R1,R2)` |
| c2 | `0abfc5dab7393809bf9994bd4fa8613086076aa5` | `feat(#177 R2): token --color-lip y hook useChunkyLip (R1,R2)` |
| c3 | `1324002d28ddf8d7e20aad9748b2cf5b8f19d9e4` | `test(#177 R9): pisos de #187 a 211 y 167 (R9)` |
| c4 | `75a9837ef7971e1b0158b47e4e3bdbcc10541f57` | `test(#177 R3): candados de la receta, inventarios y carta (R3-R8,R10-R12)` |
| c5 | `9b8d02eb8f113dc2d80716a725d068432bc407e4` | `test(#177 R3): pruebas de G1 con la receta nueva (R3,R4,R5,R6)` |
| c5b | `feb2cb1759463d909619fc0128a38ea4b98bbaf2` | `test(#177 R10): candados de imports de #155 R11 admiten useChunkyLip (R10)` |
| E2 | `716197a2e44c643c96c60fa13f2597f60cbd8e39` | `test(#177 R3): celebration.test sin StyleSheet (design-drift #171 R13.1)` |
| c6 | `3a0178cb89a412558d3b467d92fd318c54e9b341` | `feat(#177 R3): botones de G1 con labio y Text 17/800 (R3,R4,R5,R6)` |
| c7 | `ec96d1fcb4685f051311d8e5fc066e6dfae5d6bc` | `test(#177 R3): pruebas de G2 con la receta nueva (R3,R4,R6)` |
| c8 | `dcb0b9c355e0f3dbbb842dd0482b6ab99ae9cce8` | `feat(#177 R3): botones de G2 con labio y Text 17/800 (R3,R4,R6)` |
| c9 | `31bfe1184a27892075fa023b8738ac2f0e14c367` | `test(#177 R3): pruebas de G3 con la receta nueva (R3,R4,R5,R6)` |
| E3 | `cb265100be30741b61f5c264845c04b7c17b48e9` | `test(#177 R10): receta omitida de #185 R9 en docs-upload-form (R3,R4,R10)` |
| E4 | `113f09e01ff6d9d43b151d7f01d59697077553bb` | `test(#177 R10): lista blanca de radios de #175 R10 admite 16 (R10)` |
| c10 | `4dcdb0b8a9c202e5fb45f659849ca25527d463ee` | `feat(#177 R3): botones de G3 con labio y Text 17/800 (R3,R4,R5,R6)` |
| c11 | `bedeb4fa0525b8625feb069213a3654f86e4edc1` | `docs(#177 R11): carta §12 y §13, enmienda #177 y bloque en #166 (R11)` |
| c12 | Commit que contiene este informe; resolver con el comando inferior | `docs(#177): trazabilidad y reporte de implementación (R1-R14)` |

El hash literal de c12 se conoce al crear el commit y se entrega al humano al
cierre. No puede incluirse dentro de su propio contenido sin alterar ese hash.
Se resuelve inequívocamente, sin editar ni rebasar, con:

```bash
git log -1 --format=%H -- progress/impl_mobile-chunky-cta-canvas-fidelity.md
```

## Resultados por fichero y etapa

Los resultados de cada par se midieron antes del commit correspondiente.
Se conservan también los intentos detenidos; c10, c10-resume y anteriores
c6 son nombres de intentos del runner, no commits distintos. c10-green cierra
G3 y c10-after verifica design-drift entero tras el commit. c5b aisló #155 R11;
su fichero completo se verificó después. Los demás ficheros se corrieron completos, sin filtros de tests.

| Etapa | Fichero | Tests: | Salida Jest | Log |
|---|---|---|---:|---|
| c1 | `src/theme/__tests__/global-css.test.ts` | `Tests:       2 failed, 69 passed, 71 total` | 1 | `/tmp/177-c1-0.log` |
| c1 | `src/theme/__tests__/chunky-lip.test.tsx` | `Tests:       0 total` | 1 | `/tmp/177-c1-1.log` |
| c1-recheck | `src/theme/__tests__/global-css.test.ts` | `Tests:       2 failed, 69 passed, 71 total` | 1 | `/tmp/177-c1-recheck-0.log` |
| c1-recheck | `src/theme/__tests__/chunky-lip.test.tsx` | `Tests:       0 total` | 1 | `/tmp/177-c1-recheck-1.log` |
| c2 | `src/theme/__tests__/global-css.test.ts` | `Tests:       71 passed, 71 total` | 0 | `/tmp/177-c2-0.log` |
| c2 | `src/theme/__tests__/chunky-lip.test.tsx` | `Tests:       7 passed, 7 total` | 0 | `/tmp/177-c2-1.log` |
| c3 | `src/__tests__/heroui-text-size-merge.test.ts` | `Tests:       25 passed, 25 total` | 0 | `/tmp/177-c3-0.log` |
| c4 | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | `Tests:       53 failed, 19 passed, 72 total` | 1 | `/tmp/177-c4-0.log` |
| c4 | `src/__tests__/consistency-classnames.test.ts` | `Tests:       18 failed, 54 passed, 72 total` | 1 | `/tmp/177-c4-1.log` |
| c4 | `src/__tests__/design-drift.test.ts` | `Tests:       2 failed, 111 passed, 113 total` | 1 | `/tmp/177-c4-2.log` |
| c4 | `src/__tests__/account-screens-polish.test.ts` | `Tests:       4 failed, 9 passed, 13 total` | 1 | `/tmp/177-c4-3.log` |
| c5 | `src/components/__tests__/celebration.test.tsx` | `Tests:       2 failed, 64 passed, 66 total` | 1 | `/tmp/177-c5-0.log` |
| c5 | `src/components/__tests__/empty-state.test.tsx` | `Tests:       2 failed, 99 passed, 101 total` | 1 | `/tmp/177-c5-1.log` |
| c5 | `src/screens/welcome/index.test.tsx` | `Tests:       4 failed, 81 passed, 85 total` | 1 | `/tmp/177-c5-2.log` |
| c5 | `src/screens/login/index.test.tsx` | `Tests:       1 failed, 42 passed, 43 total` | 1 | `/tmp/177-c5-3.log` |
| c5 | `src/screens/register/index.test.tsx` | `Tests:       1 failed, 72 passed, 73 total` | 1 | `/tmp/177-c5-4.log` |
| c5 | `src/screens/forgot/index.test.tsx` | `Tests:       5 failed, 47 passed, 52 total` | 1 | `/tmp/177-c5-5.log` |
| c5 | `src/screens/reset-password/index.test.tsx` | `Tests:       1 failed, 51 passed, 52 total` | 1 | `/tmp/177-c5-6.log` |
| c6 | `src/components/__tests__/celebration.test.tsx` | `Tests:       66 passed, 66 total` | 0 | `/tmp/177-c6-0.log` |
| c6 | `src/components/__tests__/empty-state.test.tsx` | `Tests:       2 failed, 99 passed, 101 total` | 1 | `/tmp/177-c6-1.log` |
| c6 | `src/screens/welcome/index.test.tsx` | `Tests:       85 passed, 85 total` | 0 | `/tmp/177-c6-2.log` |
| c6 | `src/screens/login/index.test.tsx` | `Tests:       43 passed, 43 total` | 0 | `/tmp/177-c6-3.log` |
| c6 | `src/screens/register/index.test.tsx` | `Tests:       73 passed, 73 total` | 0 | `/tmp/177-c6-4.log` |
| c5b | `src/components/__tests__/empty-state.test.tsx` | `Tests:       1 failed, 98 skipped, 2 passed, 101 total` | 1 | `/tmp/177-c5b-0.log` |
| c6-resume | `src/components/__tests__/celebration.test.tsx` | `Tests:       66 passed, 66 total` | 0 | `/tmp/177-c6-resume-0.log` |
| c6-resume | `src/components/__tests__/empty-state.test.tsx` | `Tests:       101 passed, 101 total` | 0 | `/tmp/177-c6-resume-1.log` |
| c6-resume | `src/screens/welcome/index.test.tsx` | `Tests:       85 passed, 85 total` | 0 | `/tmp/177-c6-resume-2.log` |
| c6-resume | `src/screens/login/index.test.tsx` | `Tests:       43 passed, 43 total` | 0 | `/tmp/177-c6-resume-3.log` |
| c6-resume | `src/screens/register/index.test.tsx` | `Tests:       73 passed, 73 total` | 0 | `/tmp/177-c6-resume-4.log` |
| c6-resume | `src/screens/forgot/index.test.tsx` | `Tests:       52 passed, 52 total` | 0 | `/tmp/177-c6-resume-5.log` |
| c6-resume | `src/screens/reset-password/index.test.tsx` | `Tests:       52 passed, 52 total` | 0 | `/tmp/177-c6-resume-6.log` |
| c6-resume | `src/__tests__/legibility-classnames.test.ts` | `Tests:       27 passed, 27 total` | 0 | `/tmp/177-c6-resume-7.log` |
| c6-resume | `src/__tests__/ui-copy-table.test.ts` | `Sin línea Tests:` | 1 | `/tmp/177-c6-resume-8.log` |
| c6-final | `src/components/__tests__/celebration.test.tsx` | `Tests:       66 passed, 66 total` | 0 | `/tmp/177-c6-final-0.log` |
| c6-final | `src/components/__tests__/empty-state.test.tsx` | `Tests:       101 passed, 101 total` | 0 | `/tmp/177-c6-final-1.log` |
| c6-final | `src/screens/welcome/index.test.tsx` | `Tests:       85 passed, 85 total` | 0 | `/tmp/177-c6-final-2.log` |
| c6-final | `src/screens/login/index.test.tsx` | `Tests:       43 passed, 43 total` | 0 | `/tmp/177-c6-final-3.log` |
| c6-final | `src/screens/register/index.test.tsx` | `Tests:       73 passed, 73 total` | 0 | `/tmp/177-c6-final-4.log` |
| c6-final | `src/screens/forgot/index.test.tsx` | `Tests:       52 passed, 52 total` | 0 | `/tmp/177-c6-final-5.log` |
| c6-final | `src/screens/reset-password/index.test.tsx` | `Tests:       52 passed, 52 total` | 0 | `/tmp/177-c6-final-6.log` |
| c6-final | `src/__tests__/legibility-classnames.test.ts` | `Tests:       27 passed, 27 total` | 0 | `/tmp/177-c6-final-7.log` |
| c6-final | `src/__tests__/ui-language.test.ts` | `Tests:       30 passed, 30 total` | 0 | `/tmp/177-c6-final-8.log` |
| c6-final | `src/__tests__/no-pets-states.test.ts` | `Tests:       7 passed, 7 total` | 0 | `/tmp/177-c6-final-9.log` |
| c6-final | `src/__tests__/profile-canvas-fidelity.test.ts` | `Tests:       26 passed, 26 total` | 0 | `/tmp/177-c6-final-10.log` |
| c6-final | `src/__tests__/heroui-text-size-merge.test.ts` | `Tests:       25 passed, 25 total` | 0 | `/tmp/177-c6-final-11.log` |
| c6-design | `src/__tests__/design-drift.test.ts` | `Tests:       3 failed, 110 passed, 113 total` | 1 | `/tmp/177-c6-design-0.log` |
| E2 | `src/components/__tests__/celebration.test.tsx` | `Tests:       66 passed, 66 total` | 0 | `/tmp/177-E2-0.log` |
| E2-design | `src/__tests__/design-drift.test.ts` | `Tests:       2 failed, 111 passed, 113 total` | 1 | `/tmp/177-E2-design-0.log` |
| c6-after | `src/__tests__/design-drift.test.ts` | `Tests:       2 failed, 111 passed, 113 total` | 1 | `/tmp/177-c6-after-0.log` |
| c7 | `src/screens/home/index.test.tsx` | `Tests:       1 failed, 226 passed, 227 total` | 1 | `/tmp/177-c7-0.log` |
| c7 | `src/screens/alert-detail/index.test.tsx` | `Tests:       6 failed, 121 passed, 127 total` | 1 | `/tmp/177-c7-1.log` |
| c7-NV | `src/screens/pairing/index.test.tsx` | `Tests:       61 passed, 61 total` | 0 | `/tmp/177-c7-NV-0.log` |
| c8 | `src/screens/pairing/index.test.tsx` | `Tests:       61 passed, 61 total` | 0 | `/tmp/177-c8-0.log` |
| c8 | `src/screens/home/index.test.tsx` | `Tests:       227 passed, 227 total` | 0 | `/tmp/177-c8-1.log` |
| c8 | `src/screens/alert-detail/index.test.tsx` | `Tests:       127 passed, 127 total` | 0 | `/tmp/177-c8-2.log` |
| c8 | `src/__tests__/legibility-classnames.test.ts` | `Tests:       27 passed, 27 total` | 0 | `/tmp/177-c8-3.log` |
| c8 | `src/__tests__/ui-language.test.ts` | `Tests:       30 passed, 30 total` | 0 | `/tmp/177-c8-4.log` |
| c8 | `src/__tests__/no-pets-states.test.ts` | `Tests:       7 passed, 7 total` | 0 | `/tmp/177-c8-5.log` |
| c8 | `src/__tests__/profile-canvas-fidelity.test.ts` | `Tests:       26 passed, 26 total` | 0 | `/tmp/177-c8-6.log` |
| c8 | `src/__tests__/heroui-text-size-merge.test.ts` | `Tests:       25 passed, 25 total` | 0 | `/tmp/177-c8-7.log` |
| c8-design | `src/__tests__/design-drift.test.ts` | `Tests:       2 failed, 111 passed, 113 total` | 1 | `/tmp/177-c8-design-0.log` |
| c8-after | `src/__tests__/design-drift.test.ts` | `Tests:       2 failed, 111 passed, 113 total` | 1 | `/tmp/177-c8-after-0.log` |
| c9 | `src/screens/docs-upload-form/index.test.tsx` | `Tests:       4 failed, 69 passed, 73 total` | 1 | `/tmp/177-c9-0.log` |
| c9 | `src/screens/geofence-editor/index.test.tsx` | `Tests:       1 failed, 67 passed, 68 total` | 1 | `/tmp/177-c9-1.log` |
| c9 | `src/screens/geofences/index.test.tsx` | `Tests:       1 failed, 57 passed, 58 total` | 1 | `/tmp/177-c9-2.log` |
| c9 | `src/screens/reminders/index.test.tsx` | `Tests:       2 failed, 62 passed, 64 total` | 1 | `/tmp/177-c9-3.log` |
| c9-retry | `src/screens/reminders/index.test.tsx` | `Tests:       1 failed, 63 passed, 64 total` | 1 | `/tmp/177-c9-retry-0.log` |
| c10 | `src/screens/add-pet/index.test.tsx` | `Tests:       41 passed, 41 total` | 0 | `/tmp/177-c10-0.log` |
| c10 | `src/screens/add-reminder/index.test.tsx` | `Tests:       60 passed, 60 total` | 0 | `/tmp/177-c10-1.log` |
| c10 | `src/screens/docs-upload-form/index.test.tsx` | `Tests:       1 failed, 72 passed, 73 total` | 1 | `/tmp/177-c10-2.log` |
| E3 | `src/screens/docs-upload-form/index.test.tsx` | `Tests:       73 passed, 73 total` | 0 | `/tmp/177-E3-0.log` |
| c10-resume | `src/screens/add-pet/index.test.tsx` | `Tests:       41 passed, 41 total` | 0 | `/tmp/177-c10-resume-0.log` |
| c10-resume | `src/screens/add-reminder/index.test.tsx` | `Tests:       60 passed, 60 total` | 0 | `/tmp/177-c10-resume-1.log` |
| c10-resume | `src/screens/docs-upload-form/index.test.tsx` | `Tests:       73 passed, 73 total` | 0 | `/tmp/177-c10-resume-2.log` |
| c10-resume | `src/screens/geofence-editor/index.test.tsx` | `Tests:       68 passed, 68 total` | 0 | `/tmp/177-c10-resume-3.log` |
| c10-resume | `src/screens/geofences/index.test.tsx` | `Tests:       58 passed, 58 total` | 0 | `/tmp/177-c10-resume-4.log` |
| c10-resume | `src/screens/weight-log/index.test.tsx` | `Tests:       58 passed, 58 total` | 0 | `/tmp/177-c10-resume-5.log` |
| c10-resume | `src/screens/reminders/index.test.tsx` | `Tests:       64 passed, 64 total` | 0 | `/tmp/177-c10-resume-6.log` |
| c10-resume | `src/__tests__/design-drift.test.ts` | `Tests:       1 failed, 112 passed, 113 total` | 1 | `/tmp/177-c10-resume-7.log` |
| E4 | `src/__tests__/design-drift.test.ts` | `Tests:       113 passed, 113 total` | 0 | `/tmp/177-E4-0.log` |
| c10-green | `src/screens/add-pet/index.test.tsx` | `Tests:       41 passed, 41 total` | 0 | `/tmp/177-c10-green-0.log` |
| c10-green | `src/screens/add-reminder/index.test.tsx` | `Tests:       60 passed, 60 total` | 0 | `/tmp/177-c10-green-1.log` |
| c10-green | `src/screens/docs-upload-form/index.test.tsx` | `Tests:       73 passed, 73 total` | 0 | `/tmp/177-c10-green-2.log` |
| c10-green | `src/screens/geofence-editor/index.test.tsx` | `Tests:       68 passed, 68 total` | 0 | `/tmp/177-c10-green-3.log` |
| c10-green | `src/screens/geofences/index.test.tsx` | `Tests:       58 passed, 58 total` | 0 | `/tmp/177-c10-green-4.log` |
| c10-green | `src/screens/weight-log/index.test.tsx` | `Tests:       58 passed, 58 total` | 0 | `/tmp/177-c10-green-5.log` |
| c10-green | `src/screens/reminders/index.test.tsx` | `Tests:       64 passed, 64 total` | 0 | `/tmp/177-c10-green-6.log` |
| c10-green | `src/__tests__/design-drift.test.ts` | `Tests:       113 passed, 113 total` | 0 | `/tmp/177-c10-green-7.log` |
| c10-green | `src/__tests__/legibility-classnames.test.ts` | `Tests:       27 passed, 27 total` | 0 | `/tmp/177-c10-green-8.log` |
| c10-green | `src/__tests__/ui-language.test.ts` | `Tests:       30 passed, 30 total` | 0 | `/tmp/177-c10-green-9.log` |
| c10-green | `src/__tests__/no-pets-states.test.ts` | `Tests:       7 passed, 7 total` | 0 | `/tmp/177-c10-green-10.log` |
| c10-green | `src/__tests__/profile-canvas-fidelity.test.ts` | `Tests:       26 passed, 26 total` | 0 | `/tmp/177-c10-green-11.log` |
| c10-green | `src/__tests__/heroui-text-size-merge.test.ts` | `Tests:       25 passed, 25 total` | 0 | `/tmp/177-c10-green-12.log` |
| c10-doc-red | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | `Tests:       5 failed, 67 passed, 72 total` | 1 | `/tmp/177-c10-doc-red-0.log` |
| c10-consistency-red | `src/__tests__/consistency-classnames.test.ts` | `Tests:       1 failed, 71 passed, 72 total` | 1 | `/tmp/177-c10-consistency-red-0.log` |
| c10-after | `src/__tests__/design-drift.test.ts` | `Tests:       113 passed, 113 total` | 0 | `/tmp/177-c10-after-0.log` |
| c11 | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | `Tests:       72 passed, 72 total` | 0 | `/tmp/177-c11-0.log` |
| c11 | `src/__tests__/consistency-classnames.test.ts` | `Tests:       72 passed, 72 total` | 0 | `/tmp/177-c11-1.log` |
| c11 | `src/__tests__/design-drift.test.ts` | `Tests:       113 passed, 113 total` | 0 | `/tmp/177-c11-2.log` |
| c11 | `src/__tests__/profile-canvas-fidelity.test.ts` | `Tests:       26 passed, 26 total` | 0 | `/tmp/177-c11-3.log` |
| c11 | `src/__tests__/alert-detail-canvas-fidelity.test.ts` | `Tests:       20 passed, 20 total` | 0 | `/tmp/177-c11-4.log` |
| floor-green | `src/__tests__/heroui-text-size-merge.test.ts` | `Tests:       25 passed, 25 total` | 0 | `/tmp/177-floor-green-0.log` |
| final-files | `src/__tests__/account-screens-polish.test.ts` | `Tests:       13 passed, 13 total` | 0 | `/tmp/177-final-files-0.log` |
| final-files | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | `Tests:       72 passed, 72 total` | 0 | `/tmp/177-final-files-1.log` |
| final-files | `src/__tests__/consistency-classnames.test.ts` | `Tests:       72 passed, 72 total` | 0 | `/tmp/177-final-files-2.log` |
| final-files | `src/__tests__/design-drift.test.ts` | `Tests:       113 passed, 113 total` | 0 | `/tmp/177-final-files-3.log` |
| final-files | `src/__tests__/heroui-text-size-merge.test.ts` | `Tests:       25 passed, 25 total` | 0 | `/tmp/177-final-files-4.log` |
| final-files | `src/components/__tests__/celebration.test.tsx` | `Tests:       66 passed, 66 total` | 0 | `/tmp/177-final-files-5.log` |
| final-files | `src/components/__tests__/empty-state.test.tsx` | `Tests:       101 passed, 101 total` | 0 | `/tmp/177-final-files-6.log` |
| final-files | `src/screens/alert-detail/index.test.tsx` | `Tests:       127 passed, 127 total` | 0 | `/tmp/177-final-files-7.log` |
| final-files | `src/screens/docs-upload-form/index.test.tsx` | `Tests:       73 passed, 73 total` | 0 | `/tmp/177-final-files-8.log` |
| final-files | `src/screens/forgot/index.test.tsx` | `Tests:       52 passed, 52 total` | 0 | `/tmp/177-final-files-9.log` |
| final-files | `src/screens/geofence-editor/index.test.tsx` | `Tests:       68 passed, 68 total` | 0 | `/tmp/177-final-files-10.log` |
| final-files | `src/screens/geofences/index.test.tsx` | `Tests:       58 passed, 58 total` | 0 | `/tmp/177-final-files-11.log` |
| final-files | `src/screens/home/index.test.tsx` | `Tests:       227 passed, 227 total` | 0 | `/tmp/177-final-files-12.log` |
| final-files | `src/screens/login/index.test.tsx` | `Tests:       43 passed, 43 total` | 0 | `/tmp/177-final-files-13.log` |
| final-files | `src/screens/register/index.test.tsx` | `Tests:       73 passed, 73 total` | 0 | `/tmp/177-final-files-14.log` |
| final-files | `src/screens/reminders/index.test.tsx` | `Tests:       64 passed, 64 total` | 0 | `/tmp/177-final-files-15.log` |
| final-files | `src/screens/reset-password/index.test.tsx` | `Tests:       52 passed, 52 total` | 0 | `/tmp/177-final-files-16.log` |
| final-files | `src/screens/welcome/index.test.tsx` | `Tests:       85 passed, 85 total` | 0 | `/tmp/177-final-files-17.log` |
| final-files | `src/theme/__tests__/chunky-lip.test.tsx` | `Tests:       7 passed, 7 total` | 0 | `/tmp/177-final-files-18.log` |
| final-files | `src/theme/__tests__/global-css.test.ts` | `Tests:       71 passed, 71 total` | 0 | `/tmp/177-final-files-19.log` |

## Rojos, NV y aflojamientos declarados

- c1: dos R1 rojos por color-lip ausente; el módulo nuevo del hook cayó con
  `Cannot find module '../chunky-lip'`, excepción declarada. c2 dejó 71/71 y 7/7 verdes.
- c3: **NV, aflojamiento autorizado por D3**: pisos 226→211 y 182→167;
  ficheros 28 y Card 42 sin cambios. Escáner 25/25 verde.
- c4: el fichero nuevo midió **53 rojos y 19 NV**, frente a 60/12 previstos.
  Los 12 NV de la tabla pasaron. Los siete adicionales fueron R3.2 de login,
  register, forgot, reset-password y alert-detail, y R4.2 de forgot-resend y
  alert-detail-view-map: sus etiquetas ya cumplían H0 y la spec las conserva.
  No se forzaron rojos artificiales. Todos los 53 fallos pertenecían a las
  familias de requisitos indicadas por la tabla. Globales: consistency 18,
  design-drift 2, account-screens 4. La suma directUses nació verde al mover
  el delta del tile, y la fila password-input de R20 también permaneció verde.
- c5: rojos de receta en celebration 2, empty-state 2, welcome 4, login 1,
  register 1, forgot 5, reset-password 1. Los demás it permanecieron verdes.
- c5b/E1: se guardó el parche de G1 en `/tmp/177-g1.patch`, se restauraron
  sus siete ficheros, se midió y commiteó solo el test, y se reaplicó el parche,
  **sin stash**. (a) es **NV y aflojamiento declarado**: admite el nuevo import;
  (b) rojo por la línea ausente, en posición anterior a motion. El tercer it
  y el recuento de seis require no cambiaron. El fichero completo pasó después.
- E2: se cambió solo Celebration.test para usar el helper flat literal de
  erratas. 66/66 verde; desapareció #171 R13.1 sin aflojar su guard.
  Las nuevas lecturas de estilo de G2/G3 también usan flat.
- c6 y c8: grupos completos verdes, con typecheck y lint limpios. Design-drift
  se corrió **entero antes y después de cada commit de grupo**: conservó solo
  los dos inventarios de c4 que esperan G3. No se ocultaron ni filtraron.
- c7: Home 1 rojo, AlertDetail 6 rojos, todos de clase o estilo; Pairing 61/61
  **NV**, sin cambios porque no afirmaba la receta anterior.
- c9: Documentos 4, Editor 1, Zonas 1 y Recordatorios 1 rojo válido. El primer
  Recordatorios tuvo además un timeout; su repetición aislada dejó solo el
  rojo esperado del compacto (ver incidencias). Los tests de add-pet,
  add-reminder y weight-log no se reescribieron: no afirmaban las recetas
  modificadas. Sus totales basales constan arriba.
- No se añadieron it a ficheros existentes salvo los dos de R1. c1 suma 9,
  c4 suma 72, c5b/E2 y el resto suman cero: incremento previsto +81.

- E3: **rojo por omisión**, `/tmp/177-c10-2.log`. Se habían omitido cinco
  aserciones de botones/etiquetas del it #185 R9. E3 autorizó enmendarlas sin
  fingir una nueva historia rojo→verde, con commit propio --only antes de G3.
  Inputs, labels de campo y fecha civil se conservaron. Documentos pasó 73/73.
- E4: **NV y aflojamiento declarado**, aprobado por el humano: la lista blanca
  de radios de #175 R10 gana 16. Mismo it, cero añadidos; design-drift 113/113.
  Commit propio --only anterior a c10. No se restauró G3 para fabricar un rojo.
- G3: se movió la llamada al hook de GeofenceEditorScreen a GeofenceEditorForm
  tras autorización explícita por el TS2552. La revisión por AST confirmó una
  declaración por fichero y que todos los usos pertenecen al mismo componente:
  AddPetScreen, AddReminderContent, DocsUploadFormScreen, GeofenceEditorForm,
  GeofencesScreen, RemindersScreen y WeightLogContent respectivamente.
- c10 deja verde producción y los guards de recetas. Antes de c11 se midieron
  únicamente los cinco R11 y #166 R4 rojos por la carta. c11 los deja verdes.

## Typecheck y lint

Antes de cada commit se comprobó que no existiera .expo/types/router.d.ts,
se ejecutó bun run typecheck sin pipe y se exigió salida 0. Lint se ejecutó
con bunx expo lint --no-cache > log 2>&1 && test ! -s log; los logs están fuera
del árbol. No se borró router.d.ts. Los checks de los commits históricos
terminaron verdes; sus logs se conservan:

- `/tmp/177-c1-lint-recheck.log`.
- `/tmp/177-c2-lint.log`.
- `/tmp/177-c3-lint.log`.
- `/tmp/177-c4-lint.log`.
- `/tmp/177-c5-lint.log`.
- `/tmp/177-c5b-lint.log`.
- `/tmp/177-E2-lint.log`.
- `/tmp/177-c6-E2-lint.log`.
- `/tmp/177-c7-lint.log`.
- `/tmp/177-c8-lint.log`.
- `/tmp/177-c9-lint-retry.log`.
- `/tmp/177-E3-resume-lint.log`.

| Etapa final | Typecheck | Lint | Bytes en log | router.d.ts | Log |
|---|---:|---:|---:|---|---|
| E4 | 0 | 0 | 0 | Ausente | `/tmp/177-E4-lint.log` |
| c10 | 0 | 0 | 0 | Ausente | `/tmp/177-c10-lint.log` |
| c11 | 0 | 0 | 0 | Ausente | `/tmp/177-c11-lint.log` |
| c12 | 0 | 0 | 0 | Ausente | `/tmp/177-c12-lint.log` |

## Sondas S1–S14 y pisos exactos

Todas se plantaron después de c10 y c11. Tras cada sonda se ejecutó git checkout
HEAD -- ruta, git diff --cached --quiet -- ruta y git diff --quiet -- ruta,
con salidas 0. No se conservaron mutaciones, ni siquiera en Alertas/Horario.
Los rojos fueron los esperados de cada requisito, sin fallos de montaje.

| Sonda | Tests: | Rojos medidos | Restaurada | Log |
|---|---|---|---|---|
| S1 | `Tests:       2 failed, 70 passed, 72 total` | #177 R3.1: screens/home/index.tsx pinta la receta cta de testID="weekly-activity-day-map"; #177 R7.1: inventarios de los labios de borde restantes | Sí, índice y árbol limpios | `/tmp/177-probe-S1.log` |
| S2 | `Tests:       1 failed, 71 passed, 72 total` | #177 R3.3: el inventario de Button con bg-accent está cerrado | Sí, índice y árbol limpios | `/tmp/177-probe-S2.log` |
| S3 | `Tests:       3 failed, 69 passed, 72 total` | #177 R4.1: screens/docs-upload-form/index.tsx pinta la receta neutra de testID="docs-upload-cancel"; #177 R7.5: inventario de los tres estilos y el tile; #177 R8.1: solo la tabla recibe chunkyLip.neutral | Sí, índice y árbol limpios | `/tmp/177-probe-S3.log` |
| S4 | `Tests:       2 failed, 70 passed, 72 total` | #177 R7.4: solo la definición y los diecisiete consumidores usan el hook; #177 R8.2: Alertas y Horario quedan fuera de useChunkyLip | Sí, índice y árbol limpios | `/tmp/177-probe-S4.log` |
| S5 | `Tests:       2 failed, 70 passed, 72 total` | #177 R4.2: screens/welcome/index.tsx pinta la etiqueta de testID="welcome-have-account"; #177 R6.2: recuentos de etiquetas | Sí, índice y árbol limpios | `/tmp/177-probe-S5.log` |
| S6 | `Tests:       1 failed, 71 passed, 72 total` | #177 R7.4: solo la definición y los diecisiete consumidores usan el hook | Sí, índice y árbol limpios | `/tmp/177-probe-S6.log` |
| S7 | `Tests:       2 failed, 70 passed, 72 total` | #177 R5.2: el tile conserva la esquina y recibe el labio con el orden exacto; #177 R7.2: inventarios de las dos recetas de primario | Sí, índice y árbol limpios | `/tmp/177-probe-S7.log` |
| S8 | `Tests:       1 failed, 6 passed, 7 total` | #177 R2.2: forma de primary | Sí, índice y árbol limpios | `/tmp/177-probe-S8.log` |
| S9 | `Tests:       1 failed, 70 passed, 71 total` | #177 R1: global.css declara el labio del primario en los dos temas › declara --color-lip exacto en light | Sí, índice y árbol limpios | `/tmp/177-probe-S9.log` |
| S10 | `Tests:       1 failed, 24 passed, 25 total` | #187 R1: ningún componente que fusiona className lleva text-NN › #187 R1: el escáner cubre al menos el universo medido (enmendado por #177 R9) | Sí, índice y árbol limpios | `/tmp/177-probe-S10.log` |
| S10-class | `Tests:       1 failed, 24 passed, 25 total` | #187 R1: ningún componente que fusiona className lleva text-NN › #187 R1: el escáner cubre al menos el universo medido (enmendado por #177 R9) | Sí, índice y árbol limpios | `/tmp/177-probe-S10-class.log` |
| S11 | `Tests:       1 failed, 71 passed, 72 total` | #177 R12.1/R12.2: los dieciocho ficheros respetan los guards de la carta | Sí, índice y árbol limpios | `/tmp/177-probe-S11.log` |
| S12 | `Tests:       2 failed, 70 passed, 72 total` | #177 R7.1: inventarios de los labios de borde restantes; #177 R8.3: screens/meal-schedule/index.tsx conserva el ancla positiva h-13.5 flex-1 rounded-14 border-2 border-b-6 border-lip-gray bg-surface | Sí, índice y árbol limpios | `/tmp/177-probe-S12.log` |
| S13 | `Tests:       4 failed, 68 passed, 72 total` | #177 R5.1: el compacto conserva talla, etiqueta e icono con labio de tres; #177 R7.5: inventario de los tres estilos y el tile; #177 R8.1: solo la tabla recibe chunkyLip.primary; #177 R8.1: solo la tabla recibe chunkyLip.primaryCompact | Sí, índice y árbol limpios | `/tmp/177-probe-S13.log` |
| S14 | `Tests:       1 failed, 71 passed, 72 total` | #177 R3.1: screens/login/index.tsx pinta la receta cta de testID="login-submit" | Sí, índice y árbol limpios | `/tmp/177-probe-S14.log` |

**Piso exacto**: S10 pone 212/168 y cae en 212 con Received 211. La sonda
complementaria S10-class deja 211 y pone solo 168: cae con Received 167.
Tras restaurar 211/167 el fichero entero pasa 25/25 (floor-green). Los pisos de
ficheros (28) y Card (42) no cambiaron. El escáner AST siguió en verde.

S7 mantiene 16 ficheros con rounded-16 bg-accent, pero Forgot pasa de una a dos
ocurrencias al invertir el tile; R7.2 detecta ese mapa, además de R5.2. La tabla
de tasks decía 17 ficheros: la mutación no crea un fichero, duplica la ocurrencia
en el mismo. S13 también cae en R8.1 primary al meter el compacto en esa rama,
además de la rama primaryCompact indicada en tasks.

## Anclas finales y recuentos R6/R7

Git grep vio todos los archivos nuevos porque se añadieron antes de medir.
Los mapas por fichero se verifican completos en el guard #177, no solo sumas.

| Ancla | Medido | Esperado |
|---|---:|---:|
| A1 compacto | 1 | 1 |
| A2 border-b-4 | 0 | 0 |
| A3 border-black/25 | 2 | 2 |
| A4 border-b-6 | 1 | 1 |
| A5 border-lip-gray | 10 | 10 |
| A6 Button.Label abre | 20 | 20 |
| A7 Button.Label total | 52 | 52 |
| A8 text-17 | 23 | 23 |
| A9 Text acento | 16 | 16 |
| A10 Text neutro | 6 | 6 |
| A11 rounded-16 | 26 | 26 |
| A12 chunkyLip | 41 | 41 |
| R6 Text 17/700 | 1 | 1 |
| R7.2 primarios | 16 | 16 |
| R7.5 primary | 16 | 16 |
| R7.5 neutral | 6 | 6 |
| R7.5 compact | 1 | 1 |
| R7.5 primary más tile | 17 | 17 |
| A13 color-lip | 2 | 2 |
| A13 color-lip-gray | 2 | 2 |
| A14 piso 211 | 1 | 1 |
| A14 piso 167 | 1 | 1 |
| R7.4 ficheros hook | 18 | 18 |
| A12 hook trackeado | 1 | 1 |

## Suite completa final

Una sola ejecución final válida, sin pipe; se conservó el código de salida de
bun antes de mostrar Tests: desde el log externo:

```bash
cd "$(git rev-parse --show-toplevel)/mobile-pet-tracker" && bun run test > /tmp/177-final-suite.log 2>&1; grep -E '^Tests:' /tmp/177-final-suite.log
```

```text
Test Suites: 120 passed, 120 total
Tests:       3994 passed, 3994 total
```

Salida de bun: 0. Incremento exacto: 3994 − 3913 = **81** (c1: 9, c4: 72).
Las reescrituras colocadas, E1/E2/E3/E4 y los demás commits añaden cero it.
Apareció el aviso `A worker process has failed to exit gracefully`,
preexistente y permitido por el handoff; bun salió con 0.

## R13, alcance y cierre

R13.2: git diff H0..HEAD -- src/i18n package.json bun.lock app.json, desde móvil:
salida 0, diff vacío. R13.3: git diff H0..HEAD --stat -- ../backend-pet-tracker:
salida 0, diff vacío. También se comprobaron HEAD contra el árbol sin commit en
esas rutas, con salida 0. No cambiaron copy, traducciones, testID, callbacks,
isDisabled, iconos ni variantes: guards keeps y colocados completos verdes.
No se editaron producción ni tests de Alertas/Horario; solo hubo mutaciones de
sonda autorizadas y restauradas.

c12 contiene únicamente traceability.md y este reporte. Se verificaron los
hashes reales c1–c11 con git cat-file -e, sin rebase. El marcador .done se
recrea como última acción con una sola línea que apunta a este reporte, y no
se commitea. El reviewer y el humano conservan sus gates de cierre.

## Incidencias y desviaciones históricas

1. Primer arranque: Jest no estaba instalado; el intento de T0 salió con 127
   y se paró. El leader instaló dependencias; la reanudación midió T0 válido.
2. Hubo una preparación de llamada JavaScript con error de sintaxis antes de
   ejecutar shell; se corrigió sin modificar archivos. En otra lectura se
   intentó jest.config.js, inexistente: la config real está en package.json.
3. Primer lint de c1: la sonda asignaba una variable externa durante render.
   Se movió la captura a useEffect sin cambiar aserciones; lint posterior limpio.
   El auxiliar de registro clasificó erróneamente el nombre c1-recheck, aunque
   el único error era el módulo ausente autorizado; se corrigió solo el auxiliar.
4. En c1 faltó el && entre registro de rojo y commit: hubo salto de línea.
   El registro sí terminó correctamente; no se reescribió el commit. Los
   commits rojos posteriores encadenaron el registro con &&.
5. Primera parada de c6: dos inventarios de imports de #155 R11 rechazaban el
   hook. No se ajustaron al ver el fallo; E1, aprobada en caf2a75d tras 3be15f39,
   autorizó c5b. El runner había seguido algunos ficheros antes de advertir la
   incidencia; se detuvo y se corrigió para parar ante un fallo del modo verde.
6. Segunda parada de c6: ui-copy-table.test.ts no existía. Se paró sin
   sustituirla. fdfcdd9f corrigió tasks a ui-language y no-pets-states; ambos
   se ejecutaron enteros en verde en las reanudaciones posteriores.
7. Tercera parada de c6: #171 R13.1 rechazó StyleSheet en Celebration.test.
   No se modificó el guard ni se escondió el import. E2, en 9bfdf6e7 y en la
   instrucción del humano, autorizó reemplazarlo por flat en un commit propio.
8. c9 bajo carga: lint informó `Failed to run "eslint" due to signal SIGKILL`
   en `/tmp/177-c9-lint.log`; Recordatorios tuvo un timeout de 5000 ms en
   #97 R3, además del rojo de receta. Se repitió **solo el fichero y sin flags**:
   1 fallo esperado, 63 verdes, 64 total. No se ajustó el timeout ni el test.
   Después se repitieron typecheck y lint sin Jest concurrente: salida 0 y
   log vacío. El registro efectivo de c9 usa la repetición válida y conserva
   el primer intento en la tabla de evidencia.
9. Parada anterior: se omitió en c9 el it anterior #185 R9 de Documentos.
   Al fallar en c10 se paró sin ajustar la aserción, conforme al handoff.

10. Reanudación E3: se corrigió la omisión autorizada y Documentos pasó 73/73.
    El typecheck previo al commit separado detectó TS2552 en Editor de zona:
    el hook se declaró en el componente padre y se usa en el formulario hijo.
    Se paró sin corregir producción, sin commit E3 y sin avanzar a c10.

11. Reanudación previa a E4: el humano autorizó corregir el ámbito del hook de G3.
    Typecheck y lint pasaron; E3 se guardó con --only y rojo por omisión.
    Los siete ficheros G3 pasaron; design-drift detectó el candado #175 R10 de
    radios de Documentos no enmendado. Se paró sin ajustarlo ni crear c10.


12. E4, aprobada por el humano en e1844426 tras cd33d2d3, autorizó ampliar
    exclusivamente la lista blanca de #175 R10. Se declaró NV, se verificó
    design-drift entero y se creó un commit separado --only antes de c10.
    Esa parada quedó resuelta; se completaron cadena, sondas y verificaciones.
