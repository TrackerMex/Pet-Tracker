# Implementación: mobile-home-stats-strip (#69)

Fecha: 2026-09-08

Branch: `feature/69-mobile-home-stats-strip`

Base de medición: `9358cc7`

Inicio de implementación: `ae3837f`

Decisión humana D1: `b7b23e6`

Implementador: Codex CLI

## Resultado

Quedaron implementados y trazados R1–R15, incluido R15b. La Home presenta una
tira de cuatro celdas en este orden: Peso, Actividad, Descanso y Distancia, con
tres divisores y cifras tabulares. La tira se monta bajo el hero y por encima
de la tarjeta del collar; sus cuatro celdas aparecen y desaparecen juntas con
el estado `ok` de actividad. El hero conserva `walkCount` como dato destacado y
la tira no duplica Paseos.

El peso reutiliza el perfil ya descargado, degrada `null` o un perfil no
resuelto a `—` y no añade llamadas a la API. No se añadieron dependencias,
tokens ni ficheros de componente. No se tocó ningún fichero de
`backend-pet-tracker/`, `infra/` ni `hosting/`.

La feature permanece `in_progress`: no se marcó `done`, no se abrió PR y no se
hizo merge. El review está aprobado; el smoke humano de Android sigue siendo
el único gate no delegable.

Tras las observaciones 1 y 2 de
`progress/review_mobile-home-stats-strip.md`, el mismo `it` de R3 liga ahora las
tres decisiones de cada celda: valor, icono y etiqueta. El refuerzo es solo de
test; `src/screens/home/index.tsx` no recibió ningún cambio permanente.

## Rojo → verde por requisito

Los requisitos se trabajaron en el orden obligatorio de `tasks.md`. Cada rojo
precede al verde correspondiente; los commits intermedios de trazabilidad
quedan registrados con los mensajes completos en
`specs/mobile-home-stats-strip/traceability.md`.

| R-id | Resultado | Rojo | Verde |
|---|---|---|---|
| R2 | `fmtKg`: `null → —`, enteros sin decimal forzado y decimales intactos | `822fd80` | `a776939` |
| R1 | Cuatro celdas en orden, tres divisores y fila sin `gap-3` ni `justify-between` | `1a8a3e9` | `5f0b334` |
| R3 | Cada una de las cuatro métricas queda ligada a su celda | `71c24f6` | `ba11de7` |
| R4 | Descanso permanece visible sin tocar la gráfica | `646b501` | `cc32d85` |
| R5 | Paseos queda exclusivamente en el hero | `f8a99c9` | `8813b83` |
| R6 | La tira queda antes del collar y conserva el orden de #68 | `2d6fd49` | `23d9904` |
| R7 | Estados de carga/error intactos y peso degradado a guion | `5b0738a` | `df8508c` |
| R9 | Cuatro iconos de `reicon`, tamaño/tinta canónicos y cero emoji | `2b15b2f` | `7a67acb` |
| R10 | Un único uso tabular nuevo, expresado como delta | `ab4cd34` | `7d1f26a` |
| R12 | Cuatro anuncios independientes, sin fila accesible ni celdas táctiles | `cb0543c` | `dc7fb80` |
| R8 | Una petición de detalle y una de actividad; ninguna nueva | `84170d8` | `1e4a0a7` |
| R11 | `home.weight` registrado en inglés, español, usos y tabla normativa | `8509f77` | `984583c` |
| R11, R14 (D1) | Longitud del catálogo con base visible `260 + 16 + 1` | `e090688` | `13026e6` |
| R13 | Bloque propio de drift sobre los cinco ficheros nominales | `400ff4a` | `09b128f` |
| R14 | Solo se aceptan los deltas declarados contra `9358cc7` | `a53fdec` | `22e7fc9` |
| R15, R15b | Suite, typecheck, grep-clean y seis mutaciones independientes | `1586d07` | `6c170da` |
| R1, R3 (refuerzo tras review) | Cada celda liga su valor, icono y etiqueta; los intercambios de iconos y etiquetas quedan bajo candado | `18454a4` | `6e31b6a` |

## Prueba de mutación de R15b

Cada mutación se plantó sola, se ejecutó y se restauró antes de introducir la
siguiente. Las seis primeras son las prescritas originalmente por R15b. Tras
las observaciones 1 y 2 del review se replantaron las cuatro mutaciones de
valor y se añadieron las sondas 7 y 8 para las otras dos decisiones del mismo
discriminante, icono y etiqueta. Todas terminaron con exit 1 por el assert
prescrito, nunca por un `ReferenceError` ni por un helper ausente.

| # | Mutación temporal | Comando dirigido | Evidencia roja |
|---|---|---|---|
| 1 | Celda Peso: `currentWeightKg` → `activeMinutes` | `bun run test --runInBand --silent src/screens/home/index.test.tsx -t 'asigna cada valor'` | R3 esperaba `12.4 kg` en `summary-weight` y recibió `1h 35m` |
| 2 | Celda Actividad: `activeMinutes` → `restMinutes` | mismo comando de R3 | R3 esperaba `1h 35m` en `summary-activity` y recibió `45m` |
| 3 | Celda Descanso: `restMinutes` → `distanceM` | mismo comando de R3 | R3 esperaba `45m` en `summary-sleep` y recibió `2.4 km` |
| 4 | Celda Distancia: `distanceM` → `currentWeightKg` | mismo comando de R3 | R3 esperaba `2.4 km` en `summary-distance` y recibió `12.4 kg` |
| 5 | `fmtKg(null)`: `—` → `0 kg` | `bun run test --runInBand --silent src/screens/home/format.test.ts -t '#69 R2: fmtKg'` | R2 esperaba `—` y recibió `0 kg` |
| 6 | `summary-card` detrás de `collar-card` | `bun run test --runInBand --silent src/screens/home/index.test.tsx -t 'coloca la tira sobre la tarjeta del collar'` | R6 recibió `collar-card, summary-card, weekly-activity-card, last-position-card` en vez de comenzar por `summary-card` |
| 7 | Iconos de las celdas Peso y Descanso: `Weight` ↔ `Moon` | comando dirigido de R3 (`-t 'asigna cada valor'`) | R3 buscó `summary-icon-weight` dentro de `summary-weight`; recibió `summary-icon-sleep` y terminó con exit 1 |
| 8 | Etiquetas de las celdas Peso y Distancia: `t('home.weight')` ↔ `t('home.distance')` | comando dirigido de R3 (`-t 'asigna cada valor'`) | R3 buscó `Peso` dentro de `summary-weight`; recibió `Distancia` y terminó con exit 1 |

La sexta mutación quedó visible en el commit rojo `1586d07`. La restauración
`6c170da` devolvió el fichero de Home byte a byte al contenido anterior a ese
rojo. Después de restaurar las seis, la corrida conjunta de R2, R3 y R6 pasó
con 2 suites y 5 tests verdes.

El refuerzo rojo `18454a4` reprodujo el intercambio `Weight`/`Moon` dentro del
doble de `reicon`, sin tocar producción; `6e31b6a` restauró el mapeo canónico.
Ya en verde se plantaron sobre producción, una por una y con restauración
comprobada por diff vacío, las cuatro mutaciones de valor, el intercambio real
`Weight`/`Moon` y el intercambio real de `home.weight`/`home.distance`. Las seis
corridas murieron en el mismo `it` de R3. Restaurado el árbol, el conjunto que
usó el reviewer quedó en 9/9 suites y 194/194 tests verdes.

## Deltas medidos de R14 y D1

| Inventario | Base → resultado | Delta |
|---|---:|---:|
| `TABULAR_NUMS` en Home | `4 → 5` | `+1` |
| `CONTINUOUS_CORNER` en Home | `1 → 1` | `0` |
| Filas de `R3_HOME` | `36 → 37` | `+1` |
| Claves del catálogo inglés | `276 → 277` | `+1` |
| Claves del catálogo español | `276 → 277` | `+1` |
| `describe` de drift nominal | `7 → 8` | `+1` |
| Botones primarios, tinta de acento y `SCREEN_FILES` | sin cambio | `0` |

`ALL_USES` siguió cuadrando con la suma de sus bloques. No hubo
reubicaciones ni otro contador alterado. La suma del candado global conserva
la historia como `260 + 16 + 1`, no como un `277` plano.

## Decisión D1 y archivo añadido al alcance

La primera suite completa detectó que R14 y `design.md` §5 omitían
`src/providers/__tests__/language-provider.test.tsx`, aunque R11 añadía una
clave. Se paró sin ajustar la cifra. Tras la autorización humana en
`requirements.md` §D1 se cambió únicamente la línea 41:

`expect(englishKeys).toHaveLength(260 + 16 + 1)`.

El `expect(spanishKeys).toEqual(englishKeys)` y el bucle que compara marcadores
quedaron intactos. El ciclo D1 fue rojo en 276/277 (`e090688`) y verde al
restaurar `home.weight` en ambos idiomas (`13026e6`). Este fichero queda
declarado como candado adicional de #69.

## Verificación final

- Suite móvil completa restaurada: 68/68 suites, 1041/1041 tests y 1 snapshot,
  exit 0.
- Refuerzo tras review: `src/screens/home/index.test.tsx` + `src/__tests__`,
  9/9 suites y 194/194 tests, exit 0.
- `bun run typecheck`: exit 0.
- Grep de producción: cero hex fuera de `src/theme/`, clases arbitrarias,
  `StyleSheet.create`, shadow/elevation legacy o radios fuera de
  `rounded-card`, `rounded-xl` y `rounded-full`.
- Corrida final posterior al refuerzo, `env -u FORCE_COLOR ./init.sh`: exit 0
  y `Todo verde`.
  - backend: 163 suites, 1243 tests;
  - infra: 2 suites, 14 tests;
  - harness: 11 suites, 28 tests;
  - móvil: 68 suites, 1041 tests;
  - e2e: 25 suites pasadas y 3 saltadas; 354 tests pasados y 8 saltados;
  - build, lint y typecheck: verdes.
- `graphify update .`: exit 0; 10908 nodos, 16900 aristas y 694 comunidades.
  Actualizó `graphify-out` sin cambio versionado. El aviso por la dependencia
  SQL opcional `tree_sitter_sql` no impidió actualizar el grafo de código.
- Los avisos existentes de tres claves ausentes en `.env`, `STATUS.md`
  desactualizado y futura versión mínima de Node para AWS SDK no abortaron el
  gate y no pertenecen a #69.

## Premisas de la spec que no coincidieron con el árbol

1. `describe('R9: summary degrada con gracia')` tenía seis `it` previos, no
   cinco. Se conservaron los seis sin debilitar asserts; con el caso nuevo son
   siete y todos quedan verdes.
2. La fixture común del `describe` de R1 usa `device: null`. El test de orden
   de R6 necesitó declarar un collar para que `collar-card` y
   `last-position-card` existieran; su rojo quedó causado solo por el orden.
3. R14 y `design.md` §5 omitían el candado de longitud de catálogo en
   `language-provider.test.tsx`. Se reportó y se resolvió exclusivamente por la
   decisión humana D1, sin absorber ningún otro delta.

## Archivos fuera de la lista original de `design.md` §5

- `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`:
  incorporado expresamente por D1; solo cambió `260 + 16` a
  `260 + 16 + 1`.
- `progress/current.md`: bitácora obligatoria de sesión.
- `specs/mobile-home-stats-strip/traceability.md`: trazabilidad incremental.
- `progress/impl_mobile-home-stats-strip.md`: este informe solicitado.

No se tocó ningún otro fichero fuera de la lista aprobada. Graphify no dejó
archivos versionados modificados.
