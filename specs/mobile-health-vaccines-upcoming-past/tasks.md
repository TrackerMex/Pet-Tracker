---
feature: "mobile-health-vaccines-upcoming-past"
status: approved        # draft | approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-health-vaccines-upcoming-past]] (#241)

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos tres sub-items, en este orden. Rutas relativas a
> `mobile-pet-tracker/src/`.
>
> - **Commits test-primero** (C4 de `CHECKPOINTS.md`): un commit rojo con el
>   test, un commit verde con la implementación mínima y, si hace falta, uno de
>   refactor. Mensajes en inglés: `test(mobile): <desc> (R<n>)` y
>   `feat(mobile): <desc> (R<n>[, R<m>])`. El móvil no tiene `prettier`.
> - **Orden.** Las tareas van en el orden de este documento, que no es el de
>   los R-ids. La pantalla tiene **un solo** commit verde (T-verde), que pone
>   en verde a la vez R1 y R4 a R11.
> - **`./init.sh` no lo lanza Codex**; lo corre el leader.
> - **Skills.** Antes de la primera tarea de pantalla, carga las cuatro de
>   [[design]] §Skills (el leader da los nombres de Codex en el handoff).

## T0 — Línea base (antes de cualquier test nuevo, sin commit)

- [ ] (1) En el worktree, `cp` del `.env` y `bun install --frozen-lockfile`
  si faltan `node_modules`. **No** lanzar `./init.sh`.
- [ ] (2) Medir cada ancla y cada cuenta de [[requirements]] §Evidencia como
  **ocurrencias**, desde `mobile-pet-tracker/src/`:

  ```
  node -e "const s=require('fs').readFileSync(process.argv[1],'utf8'); console.log(s.split(process.argv[2]).length - 1)" <ruta> '<literal>'
  ```

  Anotar en `progress/impl_mobile-health-vaccines-upcoming-past.md` cualquier
  discrepancia **antes** de seguir. Si un ancla no da su cifra, se para y se
  reporta.
- [ ] (3) Correr la línea base, desde `mobile-pet-tracker/`, sin paréntesis en
  las rutas:

  ```
  bun run jest src/screens/health src/utils src/__tests__ src/providers > ../progress/t0_mobile-health-vaccines-upcoming-past.log 2>&1
  ```

  Si hay un SIGKILL, ese fichero cuenta 0 tests: repetir. Contar los `●` del
  log y anotarlos.

## R2 — `splitVaccines` pone cada vacuna en su lado de hoy

- [ ] (1) Escribir test que falla para R2. En
  `utils/__tests__/vaccine-dates.test.ts`: el import pasa a
  `import { addCalendarMonthsIso, splitVaccines } from '../vaccine-dates';`,
  se añade `import type { Vaccine } from '../../api/types';` y el ayudante
  `vaccine` de [[design]] §Archivos afectados. Al final del fichero, a nivel
  raíz, el `it.each` `#241 R2: hoy %s, próxima dosis %s, va a %s` con la tabla
  de R2. Commit rojo
  `test(mobile): splitVaccines puts each vaccine on its side of today (R2)`.
- [ ] (2) Implementación mínima que lo pasa: `splitVaccines` en
  `utils/vaccine-dates.ts` con el filtro de D1, todavía sin ordenar. Commit
  `feat(mobile): splitVaccines partitions vaccines around today (R2)`.
- [ ] (3) Refactor con tests verdes (`src/utils`).

## R3 — `splitVaccines` ordena las dos secciones

- [ ] (1) Escribir test que falla para R3: el `it`
  `#241 R3: ordena próximas ascendente y pasadas descendente por su fecha, con empate por id`
  con la entrada de R3, al final del fichero. Commit rojo
  `test(mobile): splitVaccines orders both sections with an id tie-break (R3)`.
- [ ] (2) Implementación mínima que lo pasa: el orden de D1 (fecha y luego
  `id` con `<` / `>`), sobre los arrays que devuelve `filter`. Commit
  `feat(mobile): splitVaccines sorts upcoming ascending and past descending (R3)`.
- [ ] (3) Refactor con tests verdes (`src/utils`).

## R1 y R11 — Copy y receta de #227 (test rojo)

- [ ] (1) Escribir test que falla para R1 y R11: el fichero nuevo
  `__tests__/health-vaccines-upcoming-past.test.ts` con la cabecera de
  [[design]] §Archivos afectados, el `it` de R1, el `it.each` `#241 R11: %s`
  sobre los diez literales y el `it` `#241 R11: inventario del fuente` con la
  tabla de producción de §Evidencia (literal, cuenta «Tras el cambio»). Commit
  rojo `test(mobile): copy and #227 recipe locks for the health sections (R1, R11)`.
- [ ] (2) Implementación mínima que lo pasa: en T-verde.
- [ ] (3) Refactor con tests verdes: en T-verde.

## R4 a R10 — Pantalla (tests rojos, un commit por R-id)

Todos van en `screens/health/index.test.tsx`, en un `describe` nuevo al final
del fichero:

```ts
const FIXTURE_241 = [ /* las cinco vacunas de [[requirements]] §Pantalla, en ese orden */ ];

describe('#241: vacunas próximas y pasadas', () => {
  beforeEach(() => {
    setupHealth168();
    mockSemanticColors = true;
    jest.useFakeTimers({ now: new Date(2026, 11, 31, 12, 0) });
    mockListVaccines.mockResolvedValue({ kind: 'ok', vaccines: FIXTURE_241 });
  });
  afterEach(() => jest.useRealTimers());
  // its de R4 a R10
});
```

Un `it` que necesite otro fixture llama a `mockListVaccines.mockResolvedValue`
antes de `await renderHealth();` (filtrando `FIXTURE_241` por `id`).

- **R4** (1) El `it` de R4 con `FIXTURE_241` y el `describe` de arriba. Commit
  rojo `test(mobile): health paints Upcoming with its rows nearest first (R4)`.
- **R5** (1) Los dos `it` de R5. En el mismo commit, en el doble de
  `reicon-react-native`, después de
  `    ChevronRight: icon('health-icon-chevron-right'),`:
  `    ChevronDown: icon('health-icon-chevron-down'),` y
  `    ChevronUp: icon('health-icon-chevron-up'),`. Commit rojo
  `test(mobile): health Past starts collapsed with its count (R5)`.
- **R6** (1) El `it` de R6. En el mismo commit, después de la función
  `elementChild`:
  `async function expandVaccinesPast() { await fireEvent.press(await screen.findByTestId('vaccines-past-toggle')); }`.
  Commit rojo `test(mobile): health Past toggles and sorts most recent first (R6)`.
- **R7** (1) El `it.each` de R7. Commit rojo
  `test(mobile): vaccine rows keep their tile and per-section delay (R7)`.
- **R8** (1) El `it` de R8. Commit rojo
  `test(mobile): a dose due today shows in the hero and in Past (R8)`.
- **R9** (1) El `it` `#241 R9: sin próximas no pinta su cabecera ni su lista`.
  Commit rojo `test(mobile): health omits Upcoming when nothing is ahead (R9)`.
- **R10** (1) El `it.each` de R10 con el patrón `hostProcess` de
  [[requirements]] §Convenciones. Dentro del `try`, después de fijar `TZ`:
  `jest.setSystemTime(new Date(...now))` y el `mockResolvedValue` con la vacuna
  `edge`. Commit rojo
  `test(mobile): health splits vaccines by the local day (R10)`.

Cada uno es rojo porque, sin T-verde, no existen `vaccines-upcoming-list`,
`vaccines-past-toggle` ni `vaccines-past-count`. Ninguno toca un candado
existente.

## T-verde — Pantalla, copy, §2.41 y guards (R1, R4 a R11)

- [ ] (2) Implementación mínima que pone en verde R1 y R4 a R11, en un commit
  `feat(mobile): split health vaccines into Upcoming and collapsed Past (R1, R4, R5, R6, R7, R8, R9, R10, R11)`:
  - `screens/health/index.tsx`: el código de [[design]] §Código prescrito, tal
    cual (los atributos del `Pressable` en una línea y en ese orden).
  - `i18n/catalog.ts`: después de `  'health.createReminderNow': 'Create now',`
    van `  'health.sectionUpcoming': 'Upcoming',` y
    `  'health.sectionPast': 'Past',`; después de
    `  'health.createReminderNow': 'Crear ahora',` van
    `  'health.sectionUpcoming': 'Próximas',` y `  'health.sectionPast': 'Pasadas',`.
  - `__tests__/ui-copy-table.ts`: después de
    `  { file: 'src/screens/health/index.tsx', key: 'tabHeader.petsScroll' }, // #222 R8`
    (la de la ruta de Salud; la de Nutrición se parece),
    `  { file: 'src/screens/health/index.tsx', key: 'health.sectionUpcoming' }, // #241 R1`
    y `  { file: 'src/screens/health/index.tsx', key: 'health.sectionPast' }, // #241 R1`.
  - `specs/mobile-ui-language/design.md`: §2.41 de [[design]].
  - Los guards de [[requirements]] §Candados de guards y de recuento, sin
    sufijo todavía.
  - Los candados de [[requirements]] §Candados en `screens/health/index.test.tsx`
    (renombre, `waitFor`, `expandVaccinesPast`, `past` y `renderDates199`),
    sin sufijo todavía.
  - Cualquier otro candado que caiga por la Regla de cierre, sin sufijo
    todavía y anotado con su causa.
- [ ] (3) Refactor con tests verdes. Correr
  `bun run jest src/screens/health src/utils src/__tests__ src/providers`
  con salida a `../progress/` y comparar los `●` con T0: solo pueden faltar
  los rojos que este commit arregla.

## R9 — Vacío sin secciones (nace verde)

- [ ] (1) Escribir el `it` `#241 R9: sin vacunas conserva el vacío sin secciones`.
  Nace verde, así que antes de commitear se hace la **sonda de mutación** sin
  commitear: en `screens/health/index.tsx` cambiar
  `{sections && sections.upcoming.length > 0 ? (` por `{sections ? (` (con la
  lista vacía `sections` es `{ upcoming: [], past: [] }`, así que la mutación
  pinta la cabecera de Próximas), correr `src/screens/health`, ver ese `it` en
  rojo, y revertir desde `mobile-pet-tracker/` con
  `git checkout HEAD -- src/screens/health/index.tsx` (comprobar después
  `git diff --cached --quiet` y `git diff --quiet -- src/screens/health/index.tsx`). Anotar la sonda y su rojo en
  `progress/impl_mobile-health-vaccines-upcoming-past.md`.
- [ ] (2) Commit `test(mobile): empty vaccines keep the empty state without sections (R9)`.
- [ ] (3) Refactor con tests verdes.

## R12 — Los candados enmendados nombran su enmienda

- [ ] (1) Escribir test que falla para R12: el `it` de R12 en
  `__tests__/health-vaccines-upcoming-past.test.ts`, con `AMENDED` = los diez
  pares de [[requirements]] §Tabla de enmiendas (seis de
  `screens/health/index.test.tsx` y cuatro de guards) más los que añadió la
  Regla de cierre. La parte de `../specs/mobile-health/requirements.md` ya
  está verde desde el commit de la spec. Commit rojo
  `test(mobile): amended locks name their amendment (R12)`.
- [ ] (2) Implementación mínima que lo pasa: añadir
  ` (enmendado por #241 R12)` al final del título de cada `it`, `it.each` o
  `describe` de `AMENDED`, después de los sufijos que ya tenga. No cambia nada
  más. Commit `test(mobile): suffix amended locks with #241 R12 (R12)`.
- [ ] (3) Refactor con tests verdes. Correr, desde `mobile-pet-tracker/`:

  ```
  bun run jest src/screens/health src/utils src/__tests__ src/providers > ../progress/final_mobile-health-vaccines-upcoming-past.log 2>&1
  ```

  Además, el typecheck y `expo lint` con `> log 2>&1 && test ! -s log` en
  cada uno. La suite completa la corre el leader con `./init.sh`.

## Cierre

- [ ] Rellenar [[traceability]] con el hash y el mensaje de cada commit verde
  (y del rojo de cada R-id) en un commit `docs(spec): traceability for #241`.
  No rebasear después.
- [ ] Escribir `progress/impl_mobile-health-vaccines-upcoming-past.md`: las
  cuentas de T0, los `●` de T0 y del final, la sonda de R9, los candados de la
  Regla de cierre con su causa y los flakes repetidos.

## Notas por tarea

- **Guards en el commit que los provoca**, nunca en uno aparte posterior: un
  guard rojo entre commits rompe la cadena. Por eso van todos en T-verde. El
  sufijo `(enmendado por #241 R12)` se añade solo en R12.
- **Ningún commit intermedio deja rojo un candado ajeno.** Los rojos entre
  commits son solo los `#241` nuevos.
- **Regla de cierre** ([[requirements]] §Tabla de enmiendas). Un `it` que
  falle solo por las causas (a) a (d) se enmienda en T-verde y se suma a
  `AMENDED`. Cualquier otro rojo se reporta y no se toca.
- **Ruido de entorno.** Un rojo en Salud `#168 R2`, Inicio `#152 R8` o
  Nutrición `#200 R9`/`R10` es un flake conocido: repetir una vez y, si pasa,
  anotarlo; no enmendar. Un `jest` con timeout bajo carga se mide de nuevo sin
  el flag.
- **Lo que no se toca:**
  - `docs/ui-guidelines.md` y `docs/conventions.md`;
  - `specs/mobile-health/requirements.md`, que ya lleva su sección;
  - `screens/reminders/` (R11 solo lo lee);
  - el backend.
