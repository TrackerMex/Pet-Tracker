---
feature: "mobile-reminders-upcoming-past"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-reminders-upcoming-past]] (#227)

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos tres sub-items, en este orden. Rutas relativas a
> `mobile-pet-tracker/src/`.
>
> - **Commits test-primero** (C4 de `CHECKPOINTS.md`): un commit rojo con el
>   test, un commit verde con la implementación mínima y, si hace falta, uno de
>   refactor. Mensajes en inglés: `test(mobile): <desc> (R<n>)` y
>   `feat(mobile): <desc> (R<n>[, R<m>])`. El móvil no tiene `prettier`.
> - **Orden.** Las tareas van en el orden de este documento, que no es el de
>   los R-ids.
> - **`./init.sh` no lo lanza Codex**; lo corre el leader.
> - **Skills.** Antes de la primera tarea de pantalla, carga las cuatro de
>   [[design]] §Skills (el leader da los nombres de Codex en el handoff).

## T0 — Línea base, dobles y relojes (antes de cualquier test nuevo)

- [ ] (1) En el worktree, `cp` del `.env` y `bun install --frozen-lockfile`
  si faltan `node_modules`. **No** lanzar `./init.sh`.
- [ ] (2) Medir con `grep -cF -- "<literal>" <ruta>` cada ancla de
  [[requirements]] §Evidencia y de la «Tabla de enmiendas». Anotar en
  `progress/impl_mobile-reminders-upcoming-past.md` cualquier discrepancia
  **antes** de seguir. Si un ancla no da su cifra, se para y se reporta.
- [ ] (3) Correr la línea base, desde `mobile-pet-tracker/`, sin paréntesis
  en las rutas:

  ```
  bun run jest src/screens/reminders src/utils src/theme src/__tests__ src/providers > ../progress/t0_mobile-reminders-upcoming-past.log 2>&1
  ```

  Si hay un SIGKILL, ese fichero cuenta 0 tests: repetir. Contar los `●` del
  log y anotarlos.
- [ ] (4) Editar `screens/reminders/index.test.tsx`, solo tests, y hacer un
  commit verde
  `test(mobile): icon doubles, relative default date and fixed clocks for reminders (T0)`.
  Los cambios son tres:
  - En el doble de `reicon-react-native`, justo después de
    `    Trash: mockIcon('reminders-icon-trash'),`, añadir
    `    ChevronDown: mockIcon('reminders-icon-chevron-down'),` y
    `    ChevronUp: mockIcon('reminders-icon-chevron-up'),`.
  - En `makeReminder`, `dueAt: '2026-08-27T09:00:00.000Z',` pasa a
    `dueAt: new Date(Date.now() + 3 * 86_400_000).toISOString(),` (D10).
  - En los `beforeEach` de `#178 R8: sheet de borrado del canvas`,
    `#218 R1: el cajón de borrar pinta su contenedor con el token surface`,
    `#204 R6: entrada de las filas`, `#204 R8: Eliminar de la fila` y
    `#204 R9: Eliminar de la hoja`, justo después de `jest.clearAllMocks();`,
    añadir `jest.useFakeTimers({ now: new Date('2026-12-30T15:00:00.000Z') });`.
    En cada uno de esos `describe`, que hoy no tienen `afterEach`, añadir
    `afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });`.

  La pantalla no ha cambiado, así que todo debe seguir verde. Bajo el reloj
  de `R6: lista…` el `dueAt` relativo vale lo mismo que antes, y bajo reloj
  real (`#65 R15`, `R7: borrar…`, `#87 R14`, etc.) la fila pasa de un día
  pasado a uno futuro: eso la mantiene en Próximos cuando llegue la partición.
  Si algo se pone rojo **solo** por las causas (c) o (d) de la Regla de
  cierre, se enmienda en este commit (sin sufijo todavía) y se anota en el
  reporte. Cualquier otro rojo se para y se reporta.

## R2 — `splitReminders` parte por día civil y `status`

- [ ] (1) Escribir test que falla para R2 (`utils/reminder-dates.test.ts` ·
  `#227 R2: %s`).
  - El import pasa a
    `import { combineDateAndTime, daysUntil, splitReminders } from './reminder-dates';`
    y se suma `import type { Reminder } from '../api/types';`.
  - Ayudante local `reminder(id, status, due)` y las nueve filas de la tabla
    de R2, con el nombre exacto de cada caso.
- [ ] (2) Implementación mínima que lo pasa (`utils/reminder-dates.ts`).
  `export function splitReminders(reminders: Reminder[], now: Date): { upcoming: Reminder[]; past: Reminder[] }`
  con `filter`, sin ordenar todavía. Lleva
  `import type { Reminder } from '../api/types';` arriba.
- [ ] (3) Refactor con tests verdes.

## R3 — orden ascendente y descendente con empate por `id`

- [ ] (1) Escribir test que falla para R3 (`utils/reminder-dates.test.ts` ·
  `#227 R3: ordena próximos ascendente y pasados descendente, con empate por id`),
  con la entrada y las salidas literales de R3.
- [ ] (2) Implementación mínima que lo pasa (`utils/reminder-dates.ts`).
  - Orden: `[...lista].sort(...)` sobre una copia, por `Date.parse(dueAt)` y
    luego `a.id.localeCompare(b.id)`.
  - Sentido: ascendente en `upcoming`, descendente en `past` por fecha. El
    empate por `id` es ascendente en los dos.
  - La entrada no se muta.
- [ ] (3) Refactor con tests verdes.

## R1 y R11 — copy y clases del canvas (solo el rojo)

- [ ] (1) Escribir los tests que fallan para R1 y R11, en un solo commit rojo
  `test(mobile): copy and canvas classes of reminders sections (R1, R11)`, en
  el fichero nuevo `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts`.
  - Cabecera calcada de `__tests__/alerts-attended-canvas-fidelity.test.ts`
    (`declare function require` de `fs` y `path`, `sourceRoot`, `readSource`).
  - Además:
    - `const canvas = (file: string) => readFileSync(join(process.cwd(), '..', 'specs', 'mobile-reminders-upcoming-past', 'canvas', file), 'utf8');`
    - `const uiLanguageDesign = () => readFileSync(join(process.cwd(), '..', 'specs', 'mobile-ui-language', 'design.md'), 'utf8');`
    - `import { R8_REMINDERS } from './ui-copy-table';`
  - Los `it` llevan los títulos exactos de R1 y R11:
    - `#227 R1: las cuatro claves existen en es y en con su literal, una invocación cada una y su fila en §2.40`;
    - `#227 R11: %s`, un `it.each` sobre las diez filas de la tabla de R11,
      con el nombre de la columna «Elemento»;
    - `#227 R11: inventario del fuente`.
  - El recorte de §2.40 es
    `design.split('### §2.40 — Añadidos por #227')[1]?.split('\n### ')[0] ?? ''`.
  - El rojo esperado es que faltan las claves, la sección y los literales.
- [ ] (2) Implementación mínima: ninguna en este commit. Se vuelven verdes por
  tandas, con las tareas de pantalla (ver Notas).
- [ ] (3) Sin refactor aquí.

## R4, R5, R6, R7 y R12 — las dos secciones

- [ ] (1) Escribir los tests que fallan, un commit rojo por requisito y en
  este orden. Todos van en el `describe('#227: próximos y pasados', …)` nuevo,
  al final de `screens/reminders/index.test.tsx`:
  - Reloj y montaje: `beforeEach` con `jest.clearAllMocks();`,
    `jest.useFakeTimers({ now: new Date(2026, 11, 31, 8, 0) });`, y después
    las mismas líneas de montaje que el `beforeEach` de
    `#204 R6: entrada de las filas`:
    - `process.env.EXPO_PUBLIC_API_URL = apiUrl;`;
    - `mockUseAuth` autenticado;
    - `mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });`;
    - `mockListReminders` con el fixture común.

    Al cerrar,
    `afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });`.
  - Fixture: los seis recordatorios del fixture común de [[requirements]]
    §Pantalla, con `makeReminder({ id, status, dueAt: new Date(…).toISOString(), … })`
    y el `dueAt` siempre explícito. Van en una constante del `describe`.
    Los `it` de R5 («sin pasados»), R8 y R9 sobrescriben `mockListReminders`
    antes de `renderReminders()`.
  - Ayudante: `async function expandPast() { await fireEvent.press(screen.getByTestId('reminders-past-toggle')); }`,
    declarado a nivel de módulo junto a `renderReminders`. Entra en el commit
    rojo de R5, el primero que lo usa.
  - Los commits rojos, en orden:
    1. `#227 R4: pinta «Próximos» y debajo sus filas en orden ascendente` →
       `test(mobile): upcoming heading and ascending list (R4)`.
    2. Los dos `it` de R5 → `test(mobile): collapsed Past section with count and chevron (R5)`.
    3. `#227 R6: …` → `test(mobile): Past header toggles and dims rows newest first (R6)`.
    4. `#227 R7: …` → `test(mobile): opacity follows the section, the rest follows status (R7)`.
    5. `#227 R12: …` → `test(mobile): row actions stay in their row in both sections (R12)`.
- [ ] (2) Implementación mínima que los pasa, en un solo commit verde
  `feat(mobile): reminders split into Upcoming and collapsed Past (R4, R5, R6, R7, R12)`.
  Cubre la pantalla, las enmiendas de pantalla y los guards. La pantalla es
  `screens/reminders/index.tsx`:
  - **Imports.** Se reemplazan estas líneas:
    - `import { ScrollView, Text, View } from 'react-native';` →
      `import { Pressable, ScrollView, Text, View } from 'react-native';`
    - `import { Plus, Repeat, Trash } from 'reicon-react-native';` →
      `import { ChevronDown, ChevronUp, Plus, Repeat, Trash } from 'reicon-react-native';`
    - `import { daysUntil } from '../../utils/reminder-dates';` →
      `import { daysUntil, splitReminders } from '../../utils/reminder-dates';`

    Y se añade `import { TOUCH_SLOP } from '../../theme/touch-target';` junto
    a los otros imports de `../../theme/`.
  - **Estado.** Tras
    `const [actionError, setActionError] = useState<string | null>(null);`,
    `const [pastExpanded, setPastExpanded] = useState(false);`.
  - **Derivados.** Tras `const isOwner = …`:
    - `const sections = splitReminders(reminders.data?.kind === 'ok' ? reminders.data.reminders : [], new Date(now));`
    - `const PastChevron = pastExpanded ? ChevronUp : ChevronDown;`
    - `const renderRow = (reminder: Reminder, past: boolean) => ( … )`, con
      el cuerpo **íntegro** de la fila actual (el `View`
      `reminder-row-${reminder.id}` con sus variables locales, que pasan a
      ser un cuerpo con `return` si hace falta). El **único** cambio es que
      `${inactive ? ' opacity-50' : ''}` pasa a `${past ? ' opacity-50' : ''}`.
  - **Lista.** Desaparece el `map` de
    `{reminders.data.reminders.map((reminder, i) => {` y su
    `<View className="gap-3">`. En su sitio, bajo las píldoras, va este
    árbol:

    ```tsx
    <Text testID="reminders-upcoming-heading" accessibilityRole="header" className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted">{t('reminders.sectionUpcoming')}</Text>
    {sections.upcoming.length > 0 ? (
      <View testID="reminders-upcoming-list" className="gap-3">
        {sections.upcoming.map((reminder, i) => (
          <RiseIn key={reminder.id} testID={`reminders-entry-${reminder.id}`} delayMs={i * MOTION_REMINDERS_STAGGER_MS}>{renderRow(reminder, false)}</RiseIn>
        ))}
      </View>
    ) : null}
    {sections.past.length > 0 ? (
      <View testID="reminders-past" className="gap-3">
        <Pressable testID="reminders-past-toggle" className="mt-1 h-10 w-full flex-row items-center gap-2" accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}>
          <View className="flex-1 flex-row items-center gap-2">
            <Text testID="reminders-past-label" className="text-13 font-extrabold uppercase tracking-caps text-muted">{t('reminders.sectionPast')}</Text>
            <Text testID="reminders-past-count" className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}>{sections.past.length}</Text>
          </View>
          <View className="size-8 items-center justify-center rounded-full bg-default">
            <PastChevron size={18} color={muted} />
          </View>
        </Pressable>
        {pastExpanded ? (
          <View testID="reminders-past-list" className="gap-3">
            {sections.past.map((reminder, index) => (
              <RiseIn key={reminder.id} testID={`reminders-entry-${reminder.id}`} delayMs={index * MOTION_REMINDERS_STAGGER_MS}>{renderRow(reminder, true)}</RiseIn>
            ))}
          </View>
        ) : null}
      </View>
    ) : null}
    ```

    El `: null` de Próximos lo sustituye la caja en R8, y el paso de las
    pasadas lo cambia R10. El chevron va **sin** `testID` (Convenciones de
    [[requirements]]).
  - **Copy en el mismo commit**, porque una clave sin uso, o un uso sin fila,
    rompe `ui-language.test.ts`:
    - `reminders.sectionUpcoming` y `reminders.sectionPast` en `en` y `es`
      de `i18n/catalog.ts`, tras la línea `'reminders.errorCancelForbidden'`
      de cada idioma;
    - sus dos filas en `R8_REMINDERS`;
    - en `specs/mobile-ui-language/design.md`, la cabecera `### §2.40 …`,
      la tabla y sus dos filas;
    - en los recuentos de `#194 R1` y `#186 R5`, la coma final pasa de
      `+ 1, // #225 R1` (o `+ 57, // #213 R22`) a la línea nueva
      `+ 2, // #227 R1`, como dice la Tabla de enmiendas. Pasa a `+ 4` en R8.
  - **Guards** del commit, con el contenido de la «Tabla de enmiendas» y sin
    sufijo todavía:
    - `design-drift`: la lista de iconos de Recordatorios;
    - `consistency-classnames`: `%s aplica TABULAR_NUMS a sus %i valores`
      (`3 + 1`) y `#69 R10` (`+ 1`);
    - `alerts-canvas-fidelity`: la fila `tracking-caps`, con la línea
      completa de abajo.

    La línea completa de la fila `tracking-caps`:
    `      files: ['screens/alerts/index.tsx', 'screens/food/index.tsx', 'screens/health/index.tsx', 'screens/meal-schedule/index.tsx', 'screens/reminders/index.tsx'], // #179 R5; #174 R12; #200 R5; #199 R14; #227 R4`
  - **Enmiendas de pantalla**: todas las filas de la tabla «Candados en
    `screens/reminders/index.test.tsx`», salvo las de solo reloj, que ya
    entraron en T0. Van con renombres y `expandPast()`, y todavía sin el
    sufijo `(enmendado por #227 R13)`.
- [ ] (3) Refactor con tests verdes.

## R8 — caja «Nada pendiente por ahora»

- [ ] (1) Escribir test que falla para R8 (`screens/reminders/index.test.tsx` ·
  `#227 R8: sin próximos pinta la caja «Nada pendiente por ahora» encima de «Pasados»`).
- [ ] (2) Implementación mínima que lo pasa
  (`feat(mobile): empty upcoming box above Past (R8)`).
  - El `: null` de Próximos pasa a:

    ```tsx
    (
      <View testID="reminders-upcoming-empty" className="items-center gap-1 rounded-22 bg-default px-4 py-5" style={CONTINUOUS_CORNER}>
        <Text testID="reminders-upcoming-empty-title" className="text-center text-15 font-extrabold text-foreground">{t('reminders.upcomingEmptyTitle')}</Text>
        <Text testID="reminders-upcoming-empty-body" className="text-center text-13 text-muted">{t('reminders.upcomingEmptyBody')}</Text>
      </View>
    )
    ```
  - **Copy en el mismo commit:**
    - las claves `reminders.upcomingEmptyTitle` y
      `reminders.upcomingEmptyBody` en `en` y `es`;
    - sus filas en `R8_REMINDERS` y en §2.40;
    - los recuentos de `#194 R1` y `#186 R5` pasan de `+ 2, // #227 R1` a
      `+ 4, // #227 R1`.
  - **Guards**, sin sufijo todavía:
    - `design-drift` `rounded-22`: `1 + 1`;
    - `consistency-classnames`: las tres esquinas, que son la fila
      `4 + 1 + 1` y `+ 1 // #227 R8` tras cada `+ 3 // #215 R20`, anclado
      por su `it`;
    - `alerts-canvas-fidelity` `text-15`: se inserta
      `'screens/reminders/index.tsx', // #227 R8`.
- [ ] (3) Refactor con tests verdes.

## R9 — sin recordatorios, sin secciones (candado de no regresión)

- [ ] (1) Escribir el test de R9 (`screens/reminders/index.test.tsx` ·
  `#227 R9: sin recordatorios conserva el vacío sin secciones`).
  - **Nace verde**: el vacío ya se evalúa antes de la lista (D4).
  - Probar el candado con una **sonda de mutación sin commitear**: pintar la
    cabecera también en la rama de `reminders-empty` y comprobar que el test
    se pone rojo. Revertir y anotar en
    `progress/impl_mobile-reminders-upcoming-past.md` la sonda y el rojo
    observado.
  - Commit `test(mobile): empty list keeps EmptyState without sections (R9)`.
- [ ] (2) Implementación mínima: ninguna (comportamiento existente).
- [ ] (3) Refactor con tests verdes.

## R10 — paso de 30 ms para las pasadas

- [ ] (1) Escribir los tests que fallan para R10, en un commit rojo:
  - `theme/__tests__/motion.test.ts` · `#227 R10: declara el paso de 30 ms de las filas pasadas`,
    `it` de primer nivel tras `#204 R3: …`;
  - `screens/reminders/index.test.tsx` ·
    `#227 R10: escalona los próximos cada 70 ms y los pasados cada 30 ms desde 0`.
- [ ] (2) Implementación mínima que lo pasa
  (`feat(mobile): past reminders rise with a 30 ms step (R10)`).
  - En `theme/motion.ts`, tras `export const MOTION_REMINDERS_STAGGER_MS = 70;`:
    `// #227 R10: paso de entrada de las filas pasadas de Recordatorios.` y
    `export const MOTION_REMINDERS_PAST_STAGGER_MS = 30;`.
  - En la pantalla, el import de movimiento pasa a
    `import { MOTION_REMINDERS_PAST_STAGGER_MS, MOTION_REMINDERS_STAGGER_MS } from '../../theme/motion';`
    y el `delayMs` de las pasadas pasa a
    `delayMs={index * MOTION_REMINDERS_PAST_STAGGER_MS}`.
  - En `theme/__tests__/motion.test.ts` › `no exporta nada más`, se añade
    `'MOTION_REMINDERS_PAST_STAGGER_MS',` justo antes de
    `'MOTION_REMINDERS_STAGGER_MS',`, todavía sin sufijo.
  - Con este commit, `#227 R1` y `#227 R11` quedan en verde. Si no lo
    están, se para y se reporta.
- [ ] (3) Refactor con tests verdes.

## R13 — los candados enmendados nombran su enmienda

- [ ] (1) Escribir test que falla para R13
  (`__tests__/reminders-upcoming-past-canvas-fidelity.test.ts` ·
  `#227 R13: los candados enmendados nombran su enmienda y las specs enmendadas llevan su casilla`).
  - Constante `AMENDED` con estos pares `[ruta relativa a src, localizador]`.
    Cada localizador sale exactamente en una línea de su fichero.
  - `screens/reminders/index.test.tsx`:
    - `renders summaries and reminder rows by section`
    - `distingue las recetas de fila próxima, lejana e inactiva`
    - `ordena mosaico, columna y borrar con la anatomía exacta de cada fila`
    - `da a cada mosaico su único icono, tamaño, superficie y tinta`
    - `pinta tipo y título con sus tintas y pesos propios`
    - `formatea la hora lejana y la meta inactiva con su estado`
    - `sustituye los emoji de todas las filas por iconos`
    - `asigna a cada entrada su índice dentro de su sección`
    - `envuelve cada fila en su propia entrada`
    - `describe('#178 R8: sheet de borrado del canvas`
    - `describe('#218 R1: el cajón de borrar pinta su contenedor con el token surface`
    - `#204 R6: escalona las filas próximas cada 70 ms y la pasada desde 0`
    - `describe('#204 R8: Eliminar de la fila`
    - `describe('#204 R9: Eliminar de la hoja`
    - `shows a delete action for reminders in every status`
    - `08:00 del 10 de septiembre: ayer a las 09:00 no es de esta semana ni próximo`
    - `#213 R14: sin línea de repetición si no hay recurrencia o la serie no está programada`
    - `#213 R15: una serie cancelada o enviada conserva Eliminar (%s)`
    - `#213 R16: el badge Hoy y el borde ámbar solo marcan el día de hoy`
  - `providers/__tests__/language-provider.test.tsx`:
    - `#194 R1: mantiene la base más las claves de #68`
  - `__tests__/ui-language.test.ts`:
    - `#186 R5: resuelve las 113 ocurrencias normativas`
  - `__tests__/design-drift.test.ts`:
    - `importa exactamente los iconos prescritos desde un único import de reicon`
    - `reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto`
  - `__tests__/consistency-classnames.test.ts`:
    - `%s importa y aplica sus %i esquinas`
    - `fusiona la esquina una vez y la entrega a las dos ramas de Card`
    - `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`
    - `%s aplica TABULAR_NUMS a sus %i valores`
    - `#69 R10: mantiene la base cerrada más los deltas medidos`
  - `__tests__/alerts-canvas-fidelity.test.ts`:
    - `limita $token a su inventario de producción`
  - `theme/__tests__/motion.test.ts`:
    - `no exporta nada más`
  - Se suma cada `it` que la Regla de cierre haya enmendado, anotado en el
    reporte.
  - Specs: `../specs/mobile-reminders/requirements.md`,
    `../specs/mobile-routine-canvas-fidelity/requirements.md` y
    `../specs/mobile-canvas-routine/requirements.md`, leídas con
    `join(process.cwd(), '..', 'specs', …)`. Cada una lleva una vez
    `## Enmienda #227 — Recordatorios próximos y pasados` y casa con
    `/- \[[ xX]\] Enmienda #227 aprobada por humano/`. Esa parte ya está
    verde desde el commit de la spec.
  - Commit rojo `test(mobile): amended locks name their amendment (R13)`.
- [ ] (2) Implementación mínima que lo pasa
  (`test(mobile): suffix amended locks with #227 R13 (R13)`).
  - Añadir ` (enmendado por #227 R13)` al final del título de cada `it`
    (o del `describe`, en las cuatro filas `describe('…`) de `AMENDED`.
  - No cambia nada más.
- [ ] (3) Refactor con tests verdes. Correr, desde `mobile-pet-tracker/`:

  ```
  bun run jest src/screens/reminders src/utils src/theme src/__tests__ src/providers > ../progress/final_mobile-reminders-upcoming-past.log 2>&1
  ```

  Además, el typecheck y `expo lint` con
  `> log 2>&1 && test ! -s log` en cada uno. La suite completa la corre el
  leader con `./init.sh`.

## Notas por tarea

- **R1 y R11 por tandas.** Su test se escribe una vez, en rojo, antes de la
  pantalla, y se vuelve verde por partes:

  | Commit | Qué se pone verde |
  |---|---|
  | `R4, R5, R6, R7, R12` | filas 1 a 6 de `#227 R11: %s` |
  | R8 | filas 8 a 10 de `#227 R11: %s`; las cuatro claves están, así que `#227 R1` pasa a verde |
  | R10 | fila 7 de `#227 R11: %s` y `#227 R11: inventario del fuente`, que necesita las seis esquinas de R8 y el `delayMs` de las pasadas |

  `#227 R1` y `#227 R11: inventario del fuente` son un `it` cada uno: siguen
  en rojo hasta su commit de la tabla, aunque parte de lo que asertan ya
  esté.

  Ningún commit intermedio deja rojo un candado **ajeno**.
- **Guards en el commit que los provoca**, nunca en uno aparte posterior: un
  guard rojo entre commits rompe la cadena. El sufijo
  `(enmendado por #227 R13)` se añade solo en R13.
- **Regla de cierre** ([[requirements]] §Tabla de enmiendas). Un `it` que
  falle solo por las causas (a) a (e) se enmienda en el commit del requisito
  que lo provoca y se suma a `AMENDED`. Cualquier otro rojo se reporta y no
  se toca.
- **Ruido de entorno.** Un rojo en Salud `#168 R2`, Inicio `#152 R8` o
  Nutrición `#200 R9`/`R10` es un flake conocido: repetir una vez y, si pasa,
  anotarlo; no enmendar. Un `jest` con timeout bajo carga se mide de nuevo sin
  el flag.
- **Lo que no se toca:**
  - `docs/ui-guidelines.md` y `docs/conventions.md`;
  - las tres specs enmendadas, que ya llevan su sección;
  - `screens/home/format.ts`;
  - el backend.
