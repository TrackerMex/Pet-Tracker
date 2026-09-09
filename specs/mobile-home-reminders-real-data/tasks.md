---
feature: "mobile-home-reminders-real-data"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec]
---

# Tareas — [[mobile-home-reminders-real-data]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
> El **orden de las tareas es normativo** y está justificado en [[design]] §6:
> cada test mide un sujeto que ya existe en ese punto. Es la lección de #70 D1.

---

## Antes de empezar (no es un requisito, es higiene)

- [ ] Cargar las skills de la carta §Skills: `expo:expo-overview` →
      `expo:expo-native-ui`, más `appllama-app-design-skill`. **La carta gana
      sobre la skill**: nada de `Color` de `expo-router`, `StyleSheet`, hex ni
      clases arbitrarias.
- [ ] Borrar `mobile-pet-tracker/.expo/types/router.d.ts` si existe (gitignorado,
      rompe el typecheck con rutas fantasma).
- [ ] `pgrep -f init.sh` vacío: dos gates a la vez colisionan en el Postgres de
      docker compartido.
- [ ] `bun run test` verde de partida desde `mobile-pet-tracker/`, **sin
      exportar `TZ`**. Anotar el recuento de partida en el informe.
- [ ] Leer [[requirements]] §0.1 (premisas) y §0.4 (defecto heredado de #82)
      antes de tocar fechas.

**Commits**: `feat(mobile-home-reminders-real-data): <desc> (R1,R2)` en inglés
(`docs/conventions.md` §Commits). **Test-primero, siempre**: rojo → verde →
refactor, un par de commits por requisito como mínimo. Un único commit con
implementación + tests + docs incumple `CHECKPOINTS.md` C4 y **se rechaza**.

---

## R1 — La copy vuelve a "Recordatorios" / "Ver todos", candada en los dos idiomas

- [ ] (1) Escribir test que falla para R1
  - `src/screens/home/index.test.tsx`: `HomeWrapperEn` (idéntico a `HomeWrapper`
    pero `<LanguageProvider initial="en">`).
  - `describe('#85 R1: la sección recupera su rótulo en los dos idiomas')` con
    `it('rotula en español')` e `it('rotula en inglés')`.
  - Actualizar los **dos literales** del `describe('#70 R1: …')`
    (`:1898` `'Próxima vacuna'` → `'Recordatorios'`, `:1903`
    `'Ver recordatorios'` → `'Ver todos'`).
  - **Rojo esperado**: los cuatro literales fallan contra el catálogo actual.
- [ ] (2) Implementación mínima que lo pasa
  - `src/i18n/catalog.ts`: `en['home.reminders'] = 'Reminders'`,
    `en['home.remindersSeeAll'] = 'See all'`,
    `es['home.reminders'] = 'Recordatorios'`,
    `es['home.remindersSeeAll'] = 'Ver todos'`.
  - **Ninguna clave se añade, se quita ni se renombra.**
- [ ] (3) Refactor con tests verdes
  - Comprobar que `language-provider.test.tsx` y `ui-language.test.ts` siguen
    verdes **sin tocarlos** (R13 filas 1-3, delta `+ 0`). Si alguno se mueve,
    **para y reporta**.

## R2 — `localDayOf`: el instante ISO se reduce a día civil local

- [ ] (1) Escribir test que falla para R2
  - `src/screens/home/format.test.ts`:
    `describe('#85 R2: localDayOf reduce el instante a día civil local')` con
    los tres `it` de [[requirements]] R2, copiando el patrón de espía de
    `Date` que ya vive en `:38-52`.
  - **Nunca `process.env.TZ` dentro de un `it`** (§0.1 premisa 11).
  - **Rojo esperado**: la función no existe en producción. El fallo debe nombrar
    el símbolo **de producción**, no un helper de test que falte
    (`CHECKPOINTS.md` C4, cuarto punto).
- [ ] (2) Implementación mínima que lo pasa
  - `src/screens/home/format.ts`: `export function localDayOf(instant: string): string`
    con `new Date(instant)` y los getters **locales**, mes y día con `padStart(2, '0')`.
  - `calendarDaysUntil` y `fmtDate` **no se tocan**.
- [ ] (3) Refactor con tests verdes
  - Plantar **M1** (getters UTC) y comprobar que la suite se pone roja
    **sin exportar `TZ`**. Revertir. Anotar en el informe. Si solo muere con
    `TZ` exportado, **el candado no vale y se para**.

## R3 — `upcomingReminders`: pendientes, futuros, ascendente, tope 3

- [ ] (1) Escribir test que falla para R3
  - `src/screens/home/format.test.ts`: helper `localIso(y, mIndex, d)` y
    `describe('#85 R3: upcomingReminders filtra, ordena y acota')` con los
    cuatro `it` de [[requirements]] R3.
  - **El par empatado se entrega en orden invertido (`rem-z` antes que
    `rem-a`)**: es normativo, ver R15/M6.
  - **Ningún `dueAt` se escribe como literal `…Z`** ([[design]] §D4).
- [ ] (2) Implementación mínima que lo pasa
  - `export function upcomingReminders(reminders: Reminder[], now: Date): Reminder[]`
    en `format.ts`: filtro de `status`, filtro `calendarDaysUntil(localDayOf(dueAt), now) >= 0`,
    orden por `dueAt` con `localeCompare`, desempate por `id`, `slice(0, 3)`.
  - `import type { Reminder } from '../../api/types';` — **solo tipo**.
- [ ] (3) Refactor con tests verdes
  - Plantar **M3**, **M4**, **M5** y **M6** de una en una, comprobar el rojo y
    **que cada una cae por el `it` que R15 nombra**. Revertir cada una. Anotar.
  - **M7 y M8 NO se plantan aquí** (enmienda **A9**): nombran además dos `it` de
    la Home que no existen hasta R5. Se verifican en el refactor de R5, donde
    existen los cuatro.

## R4 — La Home pide los recordatorios: una llamada más, declarada

- [ ] (1) Escribir test que falla para R4
  - `jest.mock('../../api/reminders', () => ({ listReminders: jest.fn(async () => ({ kind: 'ok', reminders: [] })) }));`
    y `const mockListReminders = jest.mocked(listReminders);`.
  - `describe('#85 R4: la Home pide los recordatorios de la mascota')` con sus
    dos `it`.
  - **Ampliar** el `it('no añade ninguna llamada a la API')` de `#70 R15`
    (`:2340-2350`) a `{ pets: 1, detail: 1, activity: 1, reminders: 1 }`.
  - **Rojo esperado**: `mockListReminders` no se llama nunca.
- [ ] (2) Implementación mínima que lo pasa
  - `src/screens/home/index.tsx`: import de `listReminders`, `remindersFn` con
    `useMemo` y `const reminders = useApi(remindersFn);`. **Nada más todavía**:
    no se pinta ninguna fila en esta tarea.
- [ ] (3) Refactor con tests verdes
  - Suite completa verde. Comprobar que los ~20 `describe` que ya renderizaban
    la Home siguen verdes **sin haberlos tocado** (gracias a la implementación
    por defecto de la factoría).
  - **Adaptación autorizada por A10**: en `index.test.tsx:797`, el doble
    posicional de `useApi` del `describe('R10: preserva la mascota durante el
    refetch')` pasa de `hookCall++ % 3` a `hookCall++ % 4`. **Un carácter.** El
    `% 3` codificaba las tres llamadas por render; la cuarta de R4 desalinea el
    ciclo y el hook de la lista acaba recibiendo `emptyResult`. La intención del
    `it` no cambia y sus dos `expect(selectPet).not.toHaveBeenCalled()` siguen
    intactos. **Si al cambiarlo cae algo más, para y repórtalo.**



## R5 — Las filas: hasta tres, con su título, su fecha y su contador

- [x] (1) Escribir test que falla para R5
  - En `index.test.tsx`: helpers `localIso` y `makeReminder`, y la **fixture
    normativa de tres filas** de [[requirements]] R5, entregada **desordenada**.
  - `describe('#85 R5: la sección pinta los recordatorios reales')` con sus
    cinco `it`, incluido `it('cuenta los hijos del cuerpo en tres escenarios')`
    con `children.length` **1 / 2 / 4**.
  - **La cardinalidad se cuenta con `children.length` del contenedor, JAMÁS con
    coincidencias de `testID`.**
  - **Rojo esperado**: no existe ningún `reminders-item-*`.
- [x] (2) Implementación mínima que lo pasa
  - **Antes de nada, enmienda A11**: añadir un `beforeEach` de **nivel de
    fichero**, tras `const mockListReminders = jest.mocked(listReminders);`
    (`:120`), con
    `mockListReminders.mockResolvedValue({ kind: 'ok', reminders: [] });`.
    Sin él, la fixture de R5 se filtra a tres `describe` heredados de #70:
    `jest.clearAllMocks()` limpia llamadas pero **no** implementaciones, así que
    el `[]` de la factoría no vuelve solo.
  - Renombrar `vaccineCountdown` → `dueCountdown` (misma firma, mismas ramas,
    mismas claves) y usarlo desde los dos sitios.
  - Derivar `const upcoming = reminders.data?.kind === 'ok' ? upcomingReminders(reminders.data.reminders, new Date()) : [];`
  - `.map` dentro de `reminders-section-body`, **después** de las ramas de la
    ranura de la vacuna: `Card` con `key`, `testID`,
    `className="flex-row items-center gap-3"`, agrupador `flex-1` con título y
    fecha, y la píldora del contador con `TABULAR_NUMS`.
  - **Sin disco de icono todavía**: entra en R6.
- [x] (3) Refactor con tests verdes
  - Plantar **M7** (comparador invertido) y **M8** (`slice(0, 4)`), aplazadas
    desde R3 por **A9**, y comprobar que cada una cae por **los cuatro** `it`
    que R15 les nombra: los dos de `format.test.ts` y los dos de la Home.
    Revertir cada una. Anotar.
  - Plantar **M2** (pasar `dueAt` crudo) y **M11** (hijo intruso sin `testID`)
    de una en una, ver el rojo, revertir, anotar. **Si M11 queda verde, el
    recuento se está haciendo por `testID` y se arregla antes de seguir.**
  - Corregir el título del `it('deja el cuerpo con un solo hijo')` de `#70 R9`
    (`:2061`) a `it('deja el cuerpo con la fila de la vacuna y nada más cuando
    no hay recordatorios')`. **Sus tres aserciones no se tocan.**

## R6 — Un icono de `reicon` por tipo, con su hueco y su tinta

- [x] (1) Escribir test que falla para R6
  - Añadir al doble de `reicon` (`:86-102`) las **cinco** entradas nuevas:
    `Bacteria`, `Pill`, `Stethoscope`, `Bone`, `Bell`. `Syringe` y `Weight` ya
    están y **no se renombran**.
  - `describe('#85 R6: cada tipo trae su icono, su hueco y su tinta')` con sus
    tres `it`, usando
    `jest.spyOn(Uniwind, 'getCSSVariable').mockImplementation((token) => token)`
    y **`within(fila)`** en todas las aserciones.
  - **Rojo esperado**: las filas no tienen disco ni icono.
- [x] (2) Implementación mínima que lo pasa
  - `REMINDER_ROW_ICONS` como constante de módulo con los siete tipos.
  - Tintas: **una sola** llamada `useThemeColors` de longitud fija, con
    `slot === 'neutral' ? 'muted' : \`category-${slot}-strong\``.
  - Disco `size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS[slot].surface}`
    como **primer hijo** de la `Card`, con `<Icon size={20} color={ink} />`.
  - **Por variable, nunca siete etiquetas literales**: `#70 R13` cuenta
    `<Syringe size={20}` y espera **2**.
- [x] (3) Refactor con tests verdes
  - Plantar **M12** (cruzar dos iconos del mapa), ver el rojo por el `it` de R6,
    revertir, anotar.
  - Comprobar que `#70 R13` (`:2270-2285`) y `#64 R9`
    (`consistency-classnames.test.ts:404`) siguen verdes **sin tocarlos**.

## R7 — Cruzar cualquier decisión entre dos filas pone la suite roja

> **Este requisito añade candados sobre código que R5 y R6 dejaron correcto.**
> Su rojo legítimo es la **mutación de producción**, versionada en el commit
> rojo y revertida en el verde (`CHECKPOINTS.md` C4, quinto punto). Mutar un
> doble de test **no vale**.

- [ ] (1) Escribir test que falla para R7
  - Plantar **M9** (cruce de dato título↔fecha) **y M10** (intercambio de
    posición de los dos hijos del agrupador, sin tocar `testID`) en
    `src/screens/home/index.tsx`, **versionadas en este commit**.
  - `describe('#85 R7: ninguna fila lleva el dato ni el sitio de otra')` con sus
    dos `it`.
  - **Rojo esperado**: `it('no cruza ningún dato…')` cae por M9 e
    `it('fija la posición de los hijos de cada fila')` cae por M10.
  - **Si M10 no pone rojo, el test está escrito solo con
    `within(fila).getByTestId(...)` —que es agnóstico al orden— y hay que
    reescribirlo con `children[i]` antes de seguir.**
- [ ] (2) Implementación mínima que lo pasa
  - **Revertir M9 y M10.** No se escribe código nuevo: el verde es la
    restauración de lo que R5 y R6 dejaron correcto.
- [ ] (3) Refactor con tests verdes
  - Anotar en el informe el mensaje exacto de cada rojo y el `git diff` vacío
    tras revertir.

## R8 — Las filas no son pulsables y la sección se anuncia por partes

- [ ] (1) Escribir test que falla para R8
  - `describe('#85 R8: las filas no son pulsables y se anuncian por partes')`
    con sus tres `it`.
  - **Rojo esperado**: el `accessibilityLabel` del contador no existe todavía.
- [ ] (2) Implementación mínima que lo pasa
  - `accessibilityLabel={countdown.label}` en la píldora de cada fila. Nada más:
    la `Card` sin `onPress` ya es no pulsable (`card.tsx:31-40`).
- [ ] (3) Refactor con tests verdes
  - Comprobar que `#70 R11` (`:2167`) sigue verde **sin tocarlo**.

## R9 — Cargando y fallando: ni fila fantasma, ni error propio

- [ ] (1) Escribir test que falla para R9
  - `describe('#85 R9: la sección aguanta la carga y el fallo de los recordatorios')`
    con el `it` de carga y el `it.each` de los **cinco** kinds de fallo.
  - **Rojo esperado**: si la implementación de R5 no guardó el `kind`, alguna
    rama revienta o pinta filas de más.
- [ ] (2) Implementación mínima que lo pasa
  - El ternario de R5 ya cubre los dos casos; ajustar si hiciera falta. **Sin
    esqueleto propio, sin mensaje de error, sin botón de reintento.**
- [ ] (3) Refactor con tests verdes
  - Comprobar que `#70 R9` (`:2061`) y `#70 R1` siguen verdes.

## R10 — Estilo: `Card` compartido, radios, tintas de #64 y cifras tabulares

- [ ] (1) Escribir test que falla para R10
  - `describe('#85 R10: viste las filas con el Card compartido y los tokens')`
    con su `it`, asertando `className` con **`toBe`**, nunca con `toContain`,
    en título, fecha y contador.
  - **Rojo esperado**: si alguna receta no coincide exactamente con la tabla de
    R5, cae aquí.
- [ ] (2) Implementación mínima que lo pasa
  - Ajustar las recetas exactas. Sin tokens nuevos, sin `bg-accent-soft`, sin
    radios fuera de la escala de #62 R4.
- [ ] (3) Refactor con tests verdes
  - Comprobar `#62 R14` (esquinas, sin cambio), `#62 R4` (radios),
    `#61 R4`/`#61 R5` (tintas) y `#64 R9` (`bg-accent-soft` = 16), todos
    **sin tocarlos**.

## R11 — Copy: cero claves nuevas, cero ocurrencias nuevas

- [ ] (1) Escribir test que falla para R11
  - No hay test nuevo: el candado es que **los existentes siguen verdes sin
    editarlos**. El rojo honesto es la mutación **M13**
    (`en['home.reminders']` → `'Recordatorios'`), plantada **en el commit rojo**
    y revertida en el verde, que demuestra que el `it` inglés de R1 muerde.
- [ ] (2) Implementación mínima que lo pasa
  - **Revertir M13.**
- [ ] (3) Refactor con tests verdes
  - Verificar con `grep -c` que `t('home.nextVaccineDays'`, `…DaysLeft`,
    `…Today`, `…Overdue`, `home.reminders` y `home.remindersSeeAll` siguen con
    **una** ocurrencia cada una en `src/screens/home/index.tsx`.
  - Verificar que `specs/mobile-ui-language/design.md` §2 (`:312-313`) ya lee los
    valores restaurados y **no** hace falta editarlo. Si no fuera así, se
    corrige **el valor**, nunca un recuento.

## R12 — Cero drift de estilo en los ficheros de esta feature

- [ ] (1) Escribir test que falla para R12
  - `src/__tests__/design-drift.test.ts`:
    `describe('#85 R12: la sección de recordatorios reales no mete drift de estilo')`
    con la lista nominal de cinco ficheros y el patrón
    `/text-\[10px\]|#[\da-f]{3,8}\b|StyleSheet/i`.
  - **Rojo esperado**: ninguno si el código ya está limpio. Entonces se demuestra
    con una sonda —meter un hex en `format.ts`, ver el rojo, quitarlo— y se
    anota; el candado no puede quedarse sin haberse visto fallar.
- [ ] (2) Implementación mínima que lo pasa
  - Limpiar lo que salga. No debería salir nada.
- [ ] (3) Refactor con tests verdes
  - Título del `it` **sin** el número de ficheros escrito con letra.

## R13 — Los candados globales se mueven por sumando declarado contra `20c7b3c`

- [ ] (1) Escribir test que falla para R13
  - Los candados existentes ya están rojos si el trabajo anterior movió una
    cifra. Recorrer la tabla de [[requirements]] R13 **fila a fila** y
    comprobar cuál se ha movido de verdad con su propio `grep`.
- [ ] (2) Implementación mínima que lo pasa
  - `consistency-classnames.test.ts`: `HOME_TABULAR_DELTA_85 = 1` y los
    **cuatro** mandos que se mueven con él (fila del fichero, total cerrado,
    guarda `#69 R14`, guarda `#70 R18`).
  - **Todo como sumando**: nunca reescribir `14 + 4 + 1 + 1` como `20`.
- [ ] (3) Refactor con tests verdes
  - IF un total cerrado se ha movido por una causa que la tabla **no** prevé
    THEN **para y repórtalo**. No lo absorbas subiendo el número.

## R14 — Verificación: suite verde, typecheck y grep-clean

- [ ] (1) Escribir test que falla para R14
  - Requisito de verificación: no lleva test propio.
- [ ] (2) Implementación mínima que lo pasa
  - `bun run test` y `bun run typecheck` desde `mobile-pet-tracker/`,
    **sin exportar `TZ`**.
  - Grep-clean de la carta §Decisiones fijas 3.
  - `git diff --stat` sin ficheros fuera de `mobile-pet-tracker/`, `specs/`,
    `progress/` y `feature_list.json`.
- [ ] (3) Refactor con tests verdes
  - `./init.sh` exit 0.
  - Dejar en el informe el recuento de suites/tests, comparado con el de
    partida.

## R15 — Prueba de mutación: cada candado ha de haberse visto fallar

- [ ] (1) Escribir test que falla para R15
  - Requisito de verificación (`CHECKPOINTS.md` C4 vía (b)).
- [ ] (2) Implementación mínima que lo pasa
  - Plantar las **trece** mutaciones **de una en una**, todas en código de
    **producción**. **Ninguna en el doble de `reicon`, en `makePet`, en
    `makeReminder` ni en ningún otro mock.**
  - M1, M9, M10 y M13 ya quedaron versionadas en sus commits rojos (R2, R7,
    R11); las demás se plantan aquí como verificación de cierre.
- [ ] (3) Refactor con tests verdes
  - Escribir en `progress/impl_mobile-home-reminders-real-data.md` §prueba de
    mutación, **por cada mutación**: qué se mutó, qué `it` cayó, con qué mensaje,
    y el `git diff` vacío tras restaurar.
  - Para **M6** y **M10**, escribir además **cuál es el verde esperado en la
    condición contraria** (fixture ordenada / aserciones solo por `testID`).
  - Para **M1**, dejar constancia de que el rojo sale **sin exportar `TZ`**.

---

## Cierre (no es un requisito)

- [ ] `specs/mobile-home-reminders-real-data/traceability.md` sin ninguna fila
      "pendiente".
- [ ] `feature_list.json`: id 85 a `done` **solo** con veredicto aprobado del
      reviewer, y `files_affected` alineado con [[design]] §4.
- [ ] `progress/impl_mobile-home-reminders-real-data.md` con: recuento de suites
      antes/después, la tabla de mutación completa, y qué candados de #70 se
      adaptaron y cuáles quedaron intactos.
- [ ] **Gate humano no delegable**: humo en **dev build de Android**, dos temas,
      con mascota con recordatorios y sin vacuna, con las dos cosas, y sin
      ninguna.
- [ ] PR con `gh pr create`. **El humano mergea**, ningún agente.
