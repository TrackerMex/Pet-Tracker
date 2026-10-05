---
feature: mobile-map-gps-pill-battery
id: 116
status: approved
tags: [harness, spec, mobile, ui]
---

# Trazabilidad — #116 mobile-map-gps-pill-battery

R1–R11 verificados sobre `08d30121`; cierre móvil: typecheck y lint exit 0,
Jest entero exit 0, 93 suites / 2037 tests / 1 snapshot verdes. Las 8 suites de
T0 pasan de 461 a 491 tests; mapa de 64 a 94, cero it históricos eliminados.
El informe [impl](../../progress/impl_mobile-map-gps-pill-battery.md) conserva
comandos, cada rojo/verde, Expected/Received, anclas y las sondas M25/M13.
CORRECCIONES 1–3 resuelven las paradas y fijan el alcance de 12 ficheros (9 de
Codex y 3 del leader). No se reescriben hashes de implementación.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/screens/map/index.test.tsx::#116 R1: el estado activo usa la palabra del Make::resuelve map.live a GPS active y GPS activo y lo registra en la tabla de copy`; 6 aserciones históricas migradas | `16b93ef8 test(mobile-map): #116 R1 red, GPS activo replaces En vivo` → `cb8b0e79 feat(mobile-map): #116 R1 map.live reads GPS active` |
| R2 | `src/screens/map/index.test.tsx::#116 R2: la píldora existe encima de la tarjeta de stats` (3 it; ausencia demostrada con M25) | `6fadb48b test(mobile-map): #116 R2 R3 red, pet pill above stats` → `f41e1b05 feat(mobile-map): #116 R2 R3 pet pill with avatar and name` |
| R3 | `src/screens/map/index.test.tsx::#116 R3: la píldora muestra avatar y nombre` (avatar de 24, foto/cacheKey de la lista y nombre de la lista en una línea) | Avatar/foto: `6fadb48b` → `f41e1b05 feat(mobile-map): #116 R2 R3 pet pill with avatar and name`; nombre: `762c74c8 test(mobile-map): #116 R4 red, pill status with tone` → `4c10a90a feat(mobile-map): #116 R4 pill dot and connection status` |
| R4 | `src/screens/map/index.test.tsx::#116 R4: la píldora muestra el estado del GPS` (6 filas, orden de 4 hijos y accesibilidad/estado sin cifras tabulares); migraciones de R8 y #94 R2/R3/R4/R7 | `762c74c8 test(mobile-map): #116 R4 red, pill status with tone` → `4c10a90a feat(mobile-map): #116 R4 pill dot and connection status` |
| R5 | `src/screens/map/index.test.tsx::#116 R5: la batería sustituye al tile de conexión` (2 it); #61 R11, #62 R15 y #94 R6 migrados | `2e0987d6 test(mobile-map): #116 R5 R6 R7 red, battery tile replaces connection` → `2129e82a feat(mobile-map): #116 R5 R6 R7 battery tile from device detail` |
| R6 | `src/screens/map/index.test.tsx::#116 R6: la batería se lee con formato entero y tinta por umbral::%i se lee %s con %s` (100, 82, 61, 60, 15 y 0) | `2e0987d6 test(mobile-map): #116 R5 R6 R7 red, battery tile replaces connection` → `2129e82a feat(mobile-map): #116 R5 R6 R7 battery tile from device detail` |
| R7 | `src/screens/map/index.test.tsx::#116 R7: la batería cae al guion y solo la lee el detalle` (6 it: pendiente, error, sin collar, ignora posición, detalle frente a lista y poll 15 s) | `2e0987d6 test(mobile-map): #116 R5 R6 R7 red, battery tile replaces connection` → `2129e82a feat(mobile-map): #116 R5 R6 R7 battery tile from device detail` |
| R8 | `src/screens/map/index.test.tsx::#116 R8: el mapa no estrena animación::no importa Reanimated ni anima el punto`; nace verde, M13 demuestra el rojo por aserción y se revierte | `08d30121 test(mobile-map): #116 R8 lock map without reanimated` |
| R9 | Comando **V9** debajo: grep de los dos títulos retirados → 0; comparación de los 64 it históricos contra JSON de T0, solo los retítulos y el caso de #61 migrados | `16b93ef8 test(mobile-map): #116 R1 red, GPS activo replaces En vivo`; `2e0987d6 test(mobile-map): #116 R5 R6 R7 red, battery tile replaces connection` |
| R10 | Comandos **V10** debajo; anclas 24–28 intactas. `consistency-classnames.test.ts` y `ui-language.test.ts` verdes en el Jest entero, incluidos #65 R4/R18 y #69 R10 | `2e0987d6 test(mobile-map): #116 R5 R6 R7 red, battery tile replaces connection` (deltas de counters y R4_MAP); `2129e82a feat(mobile-map): #116 R5 R6 R7 battery tile from device detail` (verde) |
| R11 | Comandos **V11** debajo y salidas literales en impl: typecheck/lint/Jest entero exit 0, dependencias/backend sin diff, solo export en hero, grep-clean 0 y alcance con exclusiones (9 de Codex; 12 total) | Árbol verificado: `08d30121 test(mobile-map): #116 R8 lock map without reanimated`; producción final `2129e82a feat(mobile-map): #116 R5 R6 R7 battery tile from device detail` |
| R12 | gate humano (smoke en dev build de Android, S1–S6 de requirements) | gate humano; sin marcar casillas ni declarar la feature done |

**V9**, desde mobile-pet-tracker/ (salida 0):

```sh
grep -c "muestra Conexión y retira GPS\|muestra En vivo aunque" src/screens/map/index.test.tsx
```

**V10**, desde mobile-pet-tracker/ (cada salida 1; los deltas positivos
3 + 1 y la suma + 1 también dan una coincidencia, ver impl):

```sh
grep -cF "[join('screens', 'map', 'index.tsx'), 4]," src/__tests__/consistency-classnames.test.ts
grep -cF '33 + 1 + 1 - 1 - 1 + 1' src/__tests__/consistency-classnames.test.ts
grep -cF "[join('screens', 'map', 'index.tsx'), 2]," src/__tests__/legibility-classnames.test.ts
grep -cF 'toBe(13 + 1 + 1)' src/__tests__/legibility-classnames.test.ts
grep -cF 'expect(R4_MAP).toHaveLength(17)' src/__tests__/ui-language.test.ts
```

**V11**, desde la raíz; las exclusiones son las prescritas por CORRECCION 3:

```sh
git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock
git diff --stat origin/main -- backend-pet-tracker/
git diff origin/main -- mobile-pet-tracker/src/components/pet-hero-header.tsx
git diff --name-only a89aeaf0 HEAD -- . ':!specs/mobile-map-gps-pill-battery/tasks.md' ':!progress/handoff_mobile-map-gps-pill-battery.md' ':!progress/current.md'
git diff --name-only a89aeaf0 HEAD
```

Desde mobile-pet-tracker/, medidos sin pipe (salidas y exits en impl):

```sh
test ! -e .expo/types/router.d.ts; echo "exit=$?"
bun run typecheck > /tmp/pt116-final-typecheck.txt 2>&1; echo "exit=$?"
bun run lint > /tmp/pt116-final-lint.txt 2>&1; echo "exit=$?"
bunx jest --maxWorkers=2 --json --outputFile=/tmp/pt116-final-jest.json > /tmp/pt116-final-jest.txt 2>&1; echo "exit=$?"
grep -cE '#[[:xdigit:]]{3,8}\b' src/screens/map/index.tsx
grep -cE '[[:alpha:]-]+-\[[^]]+\]' src/screens/map/index.tsx
grep -cF 'StyleSheet.create' src/screens/map/index.tsx
```

El aviso de worker forzado en el Jest entero se registra en impl; exit 0 y
cero regresiones. El mismo aviso está documentado en reviews anteriores;
no se atribuye su origen ni se amplía esta feature a diagnóstico del harness.
