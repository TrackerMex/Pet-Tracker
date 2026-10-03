# review: mobile-home-weight-without-collar
Fecha: 2026-09-28T16:20Z (reviewer, subagente de la sesion Backend)
Veredicto: APROBADO

Alcance: R1-R3 (Home) y R5 (Enmienda 1, carrera de `food.test.tsx`). R4 es el
smoke del humano en dev build de Android: **pendiente**, no cubierto por esta
revision y fuera del veredicto (ver Observaciones).

Arbol revisado: `/home/claude/sites/Pet-Tracker-wt-backend`, branch
`feature/77-mobile-home-weight-without-collar`, HEAD
`453aecd691d9182ab984e41e0804cd847dcea8b3`, `git status --porcelain` vacio al
empezar y al terminar. Base: `e9413a6e` (merge-base con origin/main). Main no
se mergeo, por instruccion del leader: los recuentos de la spec son de la base
anterior a #120.

## Evidencia por R-id

### R1 — el peso se pinta aunque la actividad no este disponible
- Test: `describe('#77 R1: el peso se pinta aunque la actividad no esté disponible'`
  (4 filas de `it.each` + 3 `it`), identico, sin contar lineas en blanco, al
  literal de `tasks.md`.
- Rojo `a1ad6fc6` (solo `index.test.tsx`, +80), verde `f3a17f44` (solo
  `index.tsx`).
- Produccion: la guarda de la fila es
  `activity.data !== undefined && activity.data.kind !== 'unauthorized'`; el
  valor de peso sigue leyendo `detail.data`, sin query nueva (el `it` `no añade
  ninguna llamada a la API` cuenta 1/1/1 y descarta `../../api/health-records`).
  Sin cambios de imports en `index.tsx`.

### R2 — sin actividad, la fila es la celda de peso seguida de la nota
- Test: `describe('#77 R2: sin actividad, la fila es la celda de peso seguida de la nota'`
  (4 filas), literal de `tasks.md`; cuenta por hijos, no por testID (regla de
  la Enmienda #70), con `toBe` de identidad entre celda, valor y nota.
- Rojo `f489b470` (solo test, +94), verde `8974590c` (solo `index.tsx`: borra
  los dos bloques de nota sueltos y mete la nota en la rama `else` del
  ternario `ok`).
- `index.tsx` final coincide con el Contrato de `requirements.md`. Un solo
  `testID="summary-note"` en el fichero.

### R3 — la fila no se pinta sin sesion ni mientras carga la actividad
- Test: `describe('#77 R3: la fila no se pinta sin sesión ni mientras carga la actividad'`
  (2 `it`), literal de `tasks.md`.
- Requisito de verificacion, via (b) de C4: la mutacion V3 esta versionada en
  el rojo `4a9ab9cf` (test + `index.tsx`) y revertida en `62a92ffd`.
  `git diff --exit-code 8974590c 62a92ffd -- mobile-pet-tracker/src/screens/home/index.tsx`
  da exit=0.
- Sonda propia V3a (guarda `{activity.data !== undefined ? (`): 1 rojo, `no
  pinta la fila con la sesión caducada`. Coincide con la tabla de la spec.

### R4 — smoke en dev build de Android
- Humano. La casilla `- [ ] Prueba de humo de R4 superada por el humano` sigue
  sin marcar y la fila de trazabilidad dice «smoke humano por ejecutar».
  **Pendiente**: no lo marco ni bloqueo por el, como pidio el leader.

### R5 (Enmienda 1) — la llamada del plan se espera dentro del `waitFor`
- Test: `R4: food resuelve la mascota seleccionada › keeps API order and selects the first pet by default`,
  con la asercion de `mockGetNutritionPlan` dentro del `waitFor` y el
  comentario `// #77 R5: ...`. El `it` no se renombra, por decision escrita
  de la spec (D9 y el handoff).
- Commits: rojo `3b0fcb64` (solo `food.tsx`, Q1 versionada: 200 ms con
  `abort`), verde `d3cf35b5` (solo `food.test.tsx`, 6+/5-), revert `55533b96`
  (solo `food.tsx`), traza `7b56bebf`.
- Diff neto de `food.tsx` contra la base: exit=0 (vacio). Solo lo tocan
  `3b0fcb64` y `55533b96`.
- Medido por mi:
  - Q1 con el test previo al arreglo (ficheros de `3b0fcb64`): exit=1, 1
    failed y 55 passed, `Number of calls: 0`, en el `it` esperado.
  - Q1 con el test arreglado: exit=0, 56/56. El arreglo tolera el retraso, que
    era el objetivo de la enmienda.
  - Q3 (`'pet-2'` en el `queryFn`): exit=1, 1 failed y 55 passed,
    `Number of calls: 1`, `Received: "http://example.test/v1", "jwt-token", "pet-2"`.
    Los argumentos siguen vigilados.

## Corridas independientes (desde `mobile-pet-tracker/`, primer plano, sin pipe)

| Comando | Resultado |
|---|---|
| `bunx jest --runTestsByPath src/screens/home/index.test.tsx` | exit=0, `Test Suites: 1 passed`, 159/159 |
| `bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx'` | exit=0, `Test Suites: 1 passed`, 56/56 |
| `test ! -e .expo/types/router.d.ts` | exit=0 |
| `bun run typecheck` | exit=0 |
| `bun run lint` | exit=0 |

Borre `/tmp/jest_ru/perf-cache-*` antes de cada corrida de jest.

## Sondas de mutacion propias (todas revertidas; `git diff --exit-code` exit=0 tras cada una)

| Sonda | Zona | Rojos medidos |
|---|---|---|
| P3: la nota tambien se pinta con la actividad en `ok` (ternario `ok` a `null` + nota tras el) | ciega para #77: ningun test de #77 asevera la nota ausente en `ok` | 1: `#69 R12: deja que cada celda se anuncie por separado`. Cubierto |
| P1: el fragmento `<>` de las celdas `ok` pasa a `<View className="flex-row">` | ciega para `keeps the row flush` (mira el abuelo y el envoltorio tambien es `flex-row`) | 1: `#69 R12`. Cubierto |
| N8 (tabla): icono de peso con `accent` solo sin actividad | R2 | las 4 filas de `#77 R2` (+ `#69 R9`, porque escribi el ternario dentro de la prop y la cuenta de literales baja a 3; con los dos literales `Weight` de la spec, `#69 R9` sigue en 4). Cubierto |
| V3a (tabla) | R3 | 1: `no pinta la fila con la sesión caducada`. Coincide |
| Q1 con el test previo y con el arreglado, Q3 | R5 | ver R5 arriba. Coinciden |
| Candados de #120 que ya estan en origin/main (`consistency-classnames`, `legibility-classnames`) corridos contra este arbol | riesgo de merge | exit=0, 2 suites, 79/79. `flex-3` y `pl-3` los pasan |

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: #77 `mobile-home-weight-without-collar`)
- [x] progress/current.md actualizado (sesion #77, reanudaciones 1 y 2, Enmienda 1 y firma `139791bd`)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: N/A, cambio solo de UI movil. No se toca backend ni `src/api/`
- [x] repositories/contratos en domain son interfaces puras: N/A
- [x] application depende de interfaces, no implementaciones: N/A. `index.tsx` no cambia imports
- [x] infrastructure sin logica de negocio: N/A. Estructura Expo (route delgado + `src/screens/`) intacta

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra: `#77 R1`, `#77 R2` y `#77 R3` en el titulo del `describe`. `#77 R5` en comentario dentro del `it` existente de food, que la spec prohibe renombrar (D9). Lo acepto como el «equivalente» de C4. R4 es humano
- [x] El historial muestra test primero: R1 y R2 con rojo natural (solo test) y verde (solo produccion). R3 y R5 por la via (b), con mutacion de produccion versionada en el rojo y revertida en commit propio, y evidencia de la mutacion re-medida arriba. Ningun commit mezcla test e implementacion salvo el rojo de R3, que la spec prescribe (test + V3). Ningun rojo por `ReferenceError` ni por mutacion de un doble

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas «pendiente». R1-R3 y R5 con hashes completos; R4 = humano. Los 9 hashes son ancestros de HEAD (`git merge-base --is-ancestor`, exit=0)
- [x] Los commits siguen `<tipo>(mobile): <desc> (R-ids)`, con los mensajes literales de `tasks.md` y del handoff

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved`; `[x] Spec aprobada por humano (fecha: 2026-09-27)` (firma `cf89df8e`) y `[x] Enmienda 1 (R5) aprobada por humano (fecha: 2026-09-28)` (firma `139791bd`), ambas via Notion. La enmienda de #77 a `specs/mobile-home-stats-strip/requirements.md` tambien esta marcada (`[x] Enmienda aprobada por humano (fecha: 2026-09-27)`)

## Checklist C7 — Sin codigo huerfano
- [x] Componentes/modulos reemplazados por esta feature fueron eliminados: los dos bloques de nota sueltos se borraron en `8974590c`; queda un solo `summary-note`. Sin claves de catalogo nuevas ni huerfanas (las dos de siempre siguen en uso)
- [x] Sus tests tambien fueron eliminados: no habia tests propios de los bloques sueltos. Los `it` de `R9: summary degrada con gracia` siguen en verde contra la nota reubicada
- [ ] N/A — esta feature no reemplaza nada existente

## Checklist C8 — UI movil (`docs/ui-guidelines.md`)
- [x] Grep-clean en las lineas anadidas de `index.tsx`, `index.test.tsx` y `food.test.tsx`: 0 hex, 0 clases arbitrarias `-[`, 0 `StyleSheet`, 0 `style={{`
- [x] Guard de deriva `grep -cP '#[0-9]++(?! R[0-9])'`: Home 1, food 9, igual que en la base
- [x] Dimensiones y clases: celda de peso con la anatomia de #69 (`flex-1 items-center gap-1 border-r border-border`, icono 20 `muted`, valor `text-sm font-bold` tabular, etiqueta `text-2xs`); nota `flex-3 self-center pl-3 font-normal text-muted`. Cada decision tiene su `expect` y su sonda (tablas M/N/V de la spec y las mias)
- [x] Skeleton sin cambios: R3 lo asevera visible mientras carga, sin fila
- [x] Componentes compartidos: ninguno nuevo; se reutiliza `Card`
- [x] Tappables >= 44pt: N/A, nada pulsable; `onPress` indefinido en celda y nota esta aseverado
- [x] Animaciones: ninguna
- [x] Skills: el reviewer cargo `expo:expo-overview`; el implementador declaro `building-native-ui` y `appllama-app-design-skill` (nombres del catalogo de Codex)

## Observaciones

No bloquean:

1. **R4 pendiente.** El smoke en dev build de Android lo tiene que correr el
   humano y marcar su casilla en `requirements.md` §Prueba de humo antes del
   `done`.
2. **Cabecera caducada.** La linea 26 de `requirements.md` todavia dice
   «Enmienda 1 (R5, 2026-09-28, pendiente de firma)», aunque la casilla de la
   linea 741 esta firmada (`139791bd`). Es texto de la spec, del leader.
3. **Branch detras de main.** origin/main ya esta en `c06b9749` (con #120).
   Lo unico movil que trae son los dos candados de classnames, y ya los corri
   contra este arbol: 79/79. Aun asi, tras mergear main hay que volver a
   correr la suite movil entera, como dice `progress/current.md`.
4. **Procedencia del log de init.sh.** El log no registra ni el SHA ni el
   exit code. Su mtime (15:41:15Z) es posterior al commit HEAD (15:32:52Z),
   referencia las rutas de wt-backend y la feature en progreso, y termina en
   «Todo verde». Tomo el exit 0 de la palabra del leader, sobre este HEAD.

## Output de ./init.sh

No lo corri yo. El clasificador lo deniega al subagente, y LocalStack y
Postgres son compartidos. Lo corrio el leader sobre HEAD `453aecd6` con exit 0.
Lineas de resumen de
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/f4719a40-0501-4a5f-80e7-b8287f1de20f/scratchpad/init77_453aecd6.log`:

```
⚠️  Feature en progreso: mobile-home-weight-without-collar
✅ STATUS.md sincronizado con feature_list.json
✅ Build exitoso
# backend
Test Suites: 171 passed, 171 total
Tests:       1307 passed, 1307 total
# infra
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
# mobile
Test Suites: 83 passed, 83 total
Tests:       1545 passed, 1545 total
Snapshots:   1 passed, 1 total
✅ Tests pasados
✅ Esquema y recursos e2e listos
# e2e
Test Suites: 3 skipped, 27 passed, 27 of 30 total
Tests:       8 skipped, 389 passed, 397 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
