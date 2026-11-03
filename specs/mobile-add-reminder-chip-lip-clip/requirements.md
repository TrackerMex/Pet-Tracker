---
feature: "mobile-add-reminder-chip-lip-clip"
status: draft        # draft | approved
tags: [mobile, reminders, ui, spec]
---

# Requisitos — [[mobile-add-reminder-chip-lip-clip]] (#232)

> Notación EARS. Capa: móvil (`mobile-pet-tracker/`). Sin backend, sin copy
> nuevo, sin dependencias nuevas, sin módulo nativo (no hace falta rebuild del
> dev build), sin enmienda de la carta (no hay gate G4) y sin artboard nuevo
> (no hay gate G1). Diseño en [[design]]; plan TDD en [[tasks]]; trazabilidad
> en [[traceability]]. Rutas relativas a `mobile-pet-tracker/` salvo que se
> diga otra cosa.

## Contexto

Palabras literales del humano en el smoke G2 del 2026-11-03: «En Agregar
Recordatorios el boton verde cuando se selecciona el Tipo de Recordatorio
aparece cortado».

Diagnóstico, medido en el árbol `bfc65ca6` (`origin/dev` ya mergeado en la
branch):

1. `src/screens/add-reminder/index.tsx` pinta Tipo y Aviso como `ScrollView`
   horizontales (`testID="type-chips-row"` y `testID="advance-chips-row"`, #213
   R5). Cada fila mide lo que miden sus hijos: los chips son `h-9.5` (38 px).
2. El chip seleccionado lleva `style={chunkyLip.primaryCompact}`
   (`src/theme/chunky-lip.ts`: `primaryCompact: lipStyle({ offsetY: 3, color: lip })`),
   una sombra sólida sin desenfoque de 3 px que **cuelga fuera** de los 38 px.
3. Un `ScrollView` recorta su contenido a sus propios límites. La fila mide 38,
   así que los 3 px del labio caen fuera y se pierden: el botón verde se ve
   «cortado» abajo. Los chips de Repetición no sufren el defecto porque viven
   en un `View` con `flex-row flex-wrap gap-2`, que no recorta.
4. En el artboard `specs/mobile-reminders-recurrence/canvas/NuevoRecordatorioRepeticion.dc.html`
   el chip marcado lleva `box-shadow: 0 3px 0 var(--lip)` y la regla 13 de
   `docs/ui-guidelines.md` (viñeta «Chip seleccionado») fija «un labio de 3 px
   que cuelga fuera del alto». La intención es que el labio se vea entero; el
   arreglo no cambia el canvas ni la carta.

**Premisa del plan corregida.** `progress/plan_mejoras-smoke-2026-11-03.md` §2
nombra como candado afectado «#106 R5». No es cierto: `grep -rn "#106 R5"` solo
casa en el propio plan, no en ninguna spec ni test. El candado que fija el estilo de las dos filas es
**#213 R5** (`specs/mobile-reminders-recurrence/requirements.md`), con su test
`#213 R5: Tipo y Aviso son filas horizontales sin salto de línea` en
`src/screens/add-reminder/index.test.tsx` (ver «Enmiendas a otras features»).

## Decisiones cerradas (Codex no las reabre)

- **D1. Dónde se reserva el sitio.** En el `contentContainerStyle` de cada fila,
  con `paddingBottom: 3`. El contenido pasa a medir 38 + 3 = 41 y el
  `ScrollView` (que mide lo que su contenido) también, así que el labio ya cae
  dentro de sus límites.
- **D2. El resto de la pantalla no se mueve.** Cada fila lleva además
  `style={{ marginBottom: -3 }}` (constante de módulo, ver [[design]]): el
  `View` contenedor (`gap-2`) vuelve a medir 38 desde la etiqueta, y el labio
  ocupa los 3 px del hueco de 16 px (`gap: 16` del formulario) que hay antes de
  la sección siguiente. Descartada la alternativa «aceptar 3 px más de
  separación» (mueve Título/Aviso/Guardar; el humano pidió arreglar el
  recorte, no reflowar la pantalla).
- **D3. El 3 se ata al labio.** El valor es el `offsetY` de
  `chunkyLip.primaryCompact`. Un test lo lee del fuente de `chunky-lip.ts` y lo
  compara con lo que pinta la pantalla: si el labio crece, el test avisa.
- **D4. Sin ramas por plataforma.** El recorte ocurre igual en Android e iOS;
  no hay `Platform.OS` en el arreglo ni sonda de plataforma en los tests.
- **D5. Solo estas dos filas.** `type-chips-row` y `advance-chips-row` son los
  únicos `ScrollView horizontal` de la app que contienen chips con
  `primaryCompact` (medido: `grep -rn "horizontal" src --include=*.tsx`, sin
  tests, da `components/pet-switcher.tsx`, que es de avatares y no lleva labio,
  y estas dos filas).

## Convenciones de esta spec

- Cada test nuevo o enmendado nombra `#232 R<n>` (siempre seguido de ` R<n>`).
- Los `fireEvent`, `act` y `render` van con `await` (RNTL 14).
- Corre jest con rutas por prefijo sin paréntesis
  (`src/screens/add-reminder`, `src/__tests__`).
- Los tests nuevos van en un `describe('#232 R1: …')` **nuevo al final de**
  `src/screens/add-reminder/index.test.tsx`, con el `beforeEach` del
  `describe('#204 R10: cabecera en contenido')` de ese mismo fichero
  (`jest.clearAllMocks()`, `process.env.EXPO_PUBLIC_API_URL`,
  `mockUseAuth.mockReturnValue(…authenticated…)`,
  `mockCreateReminder.mockReturnValue(pending())`) y, en cada `it`,
  `await renderAddReminder(); await screen.findByTestId('title-input');`.
  No se añade ni se cambia ningún doble de módulo: el `jest.mock` de
  `../../theme/chunky-lip` ya devuelve `mockChunkyLip.primaryCompact` con
  `offsetY: 3`, y **no se toca**.
- `StyleSheet` no aparece en el fichero de test (usa `toHaveStyle`).
- Para leer el fuente de `chunky-lip.ts`, el test usa
  `const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');`
  y `join(process.cwd(), 'src', 'theme', 'chunky-lip.ts')` (patrón de
  `src/components/__tests__/celebration.test.tsx`); `join` viene de
  `jest.requireActual<typeof import('path')>('path')`.

## Evidencia (medida en `bfc65ca6`)

Cuentas con `grep -cF "<literal>" src/screens/add-reminder/index.tsx` desde
`mobile-pet-tracker/`:

| Literal | Hoy | Tras #232 |
|---|---|---|
| `contentContainerStyle={{ gap: 8, paddingRight: 20 }}` | 2 | 0 |
| `className="-mr-5"` | 2 | 2 |
| `style={selected ? chunkyLip.primaryCompact : undefined}` | 3 | 3 |
| `flex-row flex-wrap gap-2` | 1 | 1 |
| `testID="type-chips-row"` / `testID="advance-chips-row"` | 1 / 1 | 1 / 1 |
| `paddingBottom: 3` | 0 | 1 |
| `marginBottom: -3` | 0 | 1 |
| `CHIP_ROW_CONTENT` | 0 | 3 (definición + 2 usos) |
| `CHIP_ROW_STYLE` | 0 | 3 (definición + 2 usos) |

`grep -cF "primaryCompact: lipStyle({ offsetY: 3, color: lip })" src/theme/chunky-lip.ts` → 1.

Guards de la carta que **no se mueven** (el cambio no añade ninguna clase, ni
color, ni radio, ni copy; solo dos objetos de estilo de módulo):
`design-drift.test.ts`, `consistency-classnames.test.ts`,
`legibility-classnames.test.ts`, `chunky-cta-canvas-fidelity.test.ts`,
`ui-copy-table.ts` y los recuentos de `SCREEN_FILES`. Ninguno cuenta
`contentContainerStyle`, `paddingBottom` ni `marginBottom` de ese fichero; el
handoff pone `T0` (suite de `src/__tests__` y de `src/screens/add-reminder` en
verde **antes** de editar) y la misma tras cada commit de producción.

## Requisitos funcionales

- **R1**: WHEN Agregar recordatorio se pinta, THE SYSTEM SHALL dar a cada una de
  las dos filas horizontales de chips (`type-chips-row` y `advance-chips-row`)
  un `contentContainerStyle` exactamente igual a
  `{ gap: 8, paddingRight: 20, paddingBottom: 3 }`, y ese `paddingBottom` SHALL
  ser igual al `offsetY` de `chunkyLip.primaryCompact` declarado en
  `src/theme/chunky-lip.ts`, de modo que el labio del chip seleccionado queda
  dentro de los límites del `ScrollView`.
  - Test: `src/screens/add-reminder/index.test.tsx`,
    `describe('#232 R1: las filas de chips reservan el labio')` con un
    `it.each` de dos filas (una rama por fila):
    `it.each(['type-chips-row', 'advance-chips-row'])('#232 R1: %s reserva 3 px bajo los chips')`.
    Cada `it` lee `screen.getByTestId(row).props.contentContainerStyle`, aserta
    `toEqual({ gap: 8, paddingRight: 20, paddingBottom: 3 })` y que
    `paddingBottom` es igual al número que captura
    `/primaryCompact: lipStyle\(\{ offsetY: (\d+),/` sobre el texto de
    `src/theme/chunky-lip.ts` (la regex debe casar; si no, el `it` falla con
    un mensaje, no pasa en vacío: `expect(match).not.toBeNull()` antes).
    El literal `3` y el número leído del fuente son independientes: ninguno es
    un símbolo importado de producción.
  - Mutaciones plantadas (cada una debe poner rojo lo indicado y se revierte):
    (a) quitar `paddingBottom: 3` del objeto → rojo ambos `it`;
    (b) `paddingBottom: 2` → rojo ambos;
    (c) usar la constante nueva solo en la fila de Tipo y dejar el objeto viejo
    `{ gap: 8, paddingRight: 20 }` en Aviso → rojo solo el `it` de
    `advance-chips-row` (zona ciega: el candado mira cada fila por separado);
    (d) en `chunky-lip.ts` cambiar `primaryCompact` a `offsetY: 4` → rojo
    ambos (el 3 de la pantalla deja de igualar al labio).

- **R2**: WHEN Agregar recordatorio se pinta, THE SYSTEM SHALL dar a cada una de
  las dos filas horizontales de chips un `style` con `marginBottom: -3` (igual
  a `-paddingBottom` de R1), conservar su `className` exactamente `-mr-5`, y no
  añadir ninguna otra propiedad a ese `style`, de modo que la altura que la fila
  aporta al formulario sigue siendo la de los chips (38 + 3 − 3) y Título,
  Fecha, Hora, Repetición, Aviso, la vista previa y Guardar no cambian de
  posición.
  - Test: mismo `describe`, `it.each(['type-chips-row', 'advance-chips-row'])('#232 R2: %s no desplaza el resto del formulario')`.
    Cada `it` aserta `expect(row).toHaveStyle({ marginBottom: -3 })`; que
    `props.className` `toBe('-mr-5')`; y que
    `-(row.props.contentContainerStyle as { paddingBottom: number }).paddingBottom`
    es igual a `-3` (el margen compensa exactamente el relleno: suma neta 0).
  - Mutaciones plantadas: (a) quitar `CHIP_ROW_STYLE` de la fila de Tipo →
    rojo solo el `it` de `type-chips-row`; (b) `marginBottom: -2` → rojo ambos;
    (c) `marginBottom: 3` (signo equivocado) → rojo ambos; (d) quitar el
    `style` de la fila de Aviso → rojo solo el de `advance-chips-row`.

- **R3**: WHEN el usuario cambia el chip seleccionado de Tipo o de Aviso, THE
  SYSTEM SHALL seguir pintando el labio `chunkyLip.primaryCompact` solo en el
  chip seleccionado de esa fila y conservar sin cambio la receta de todos los
  chips (`h-9.5 items-center justify-center rounded-full px-3.5`, sus
  `testID`, `hitSlop`, `accessibilityState` y los conteos 7 y 4).
  - Test: **los `it` existentes, sin tocar sus aserciones**, en
    `src/screens/add-reminder/index.test.tsx`: 
    `pinta Vacuna seleccionada con cápsula, labio y texto sin emoji (enmendado por #197 R7)`,
    `invierte las recetas al seleccionar Otro (enmendado por #197 R7)`,
    el `it` de `#123 R5` que recorre `advance-chip-*` y aserta
    `style` `toEqual(minutes === 10080 ? mockChunkyLip.primaryCompact : undefined)`,
    y el `#213 R5` enmendado por R4 (que sigue contando 7 y 4 chips por fila).
    Todos deben seguir verdes sin cambio.
  - Mutación plantada: poner `style={chunkyLip.primaryCompact}` fijo (sin
    condicional `selected`) en los chips de una fila → rojo el `it` de esa fila
    de los listados.

- **R4**: WHEN R1 y R2 cambian el estilo de las filas, THE SYSTEM SHALL enmendar
  en su sitio el pin de #213 R5 y dejar el resto del fichero y del repo sin
  tocar: el `it` `#213 R5: Tipo y Aviso son filas horizontales sin salto de línea`
  pasa a `toEqual({ gap: 8, paddingRight: 20, paddingBottom: 3 })` en su línea
  de `contentContainerStyle` y su título gana el sufijo
  ` (enmendado por #232 R1)` al final; el resto de ese `it` (`horizontal`,
  `showsHorizontalScrollIndicator`, `className` `-mr-5`, sin `flex-wrap`, 7 y 4
  chips) no cambia; y la fila de Repetición (`flex-row flex-wrap gap-2`)
  conserva su receta.
  - Test A: el `it` enmendado, en `describe('#213 R4: controles de repetición')`.
  - Test B (candado de no-regresión, nace verde): mismo `describe('#232 R1…')`
    nuevo, `it('#232 R4: la fila de Repetición no cambia')`:
    `screen.getByTestId('repeat-chip-once').parent?.props.className` `toBe('flex-row flex-wrap gap-2')`
    y esa fila no tiene `style` con `paddingBottom` ni `marginBottom`
    (`expect(row).not.toHaveStyle({ marginBottom: -3 })`). Si `.parent`
    devuelve un nodo intermedio del `Pressable` y no el `View` de la fila,
    subir un nivel hasta el `View` con ese `className`: la intención es fijar
    la receta de la fila. Nace verde porque fija lo que R1/R2 no deben tocar;
    su mutación plantada lo comprueba. Las etiquetas `Tipo`/`Aviso` con
    `gap-2` ya las fija el `it` existente `da a las cinco etiquetas y sus
    secciones las recetas del canvas`, que no se toca.
  - Test C (alcance, por diff, no por jest): el handoff comprueba
    `git diff --name-only <H0>..HEAD` y sólo permite bajo `mobile-pet-tracker/`
    `src/screens/add-reminder/index.tsx` y
    `src/screens/add-reminder/index.test.tsx`. Ni `src/i18n/`, ni
    `src/__tests__/ui-copy-table.ts`, ni `src/theme/`, ni `docs/` cambian.
  - Mutaciones plantadas: (a) añadir `paddingBottom: 3` a la fila de
    Repetición (`flex-row flex-wrap gap-2` → añadirle `className` o `style`
    con relleno) → rojo el Test B; (b) ancla de handoff, no un `it`:
    `grep -cF "(enmendado por #232 R1)" src/screens/add-reminder/index.test.tsx`
    debe imprimir `1`.

## Enmiendas a otras features

| Enmendado | Ruta | Qué cambia | Dónde se anota |
|---|---|---|---|
| #213 R5 | `specs/mobile-reminders-recurrence/requirements.md` (R5) y su `it` `#213 R5: Tipo y Aviso son filas horizontales sin salto de línea` en `src/screens/add-reminder/index.test.tsx` | `contentContainerStyle` de las dos filas pasa de `{ gap: 8, paddingRight: 20 }` a `{ gap: 8, paddingRight: 20, paddingBottom: 3 }`, y las filas ganan `style` con `marginBottom: -3`. `horizontal`, `showsHorizontalScrollIndicator={false}`, `className="-mr-5"`, el conteo 7/4 y la ausencia de `flex-wrap` siguen igual | Sufijo `(enmendado por #232 R1)` en el título del `it` (R4). El texto de la spec #213 no se edita: la enmienda y su casilla viven aquí (§Aprobación) |

## Paso de smoke nuevo (G2, humano, en lote al final)

Anotar en `progress/smoke_mejoras-smoke.md` (lo registra el leader). Reproduce
el fallo original, en el dev build de Android, en tema **claro** y en **oscuro**:
1. Abrir Recordatorios → «Agregar». «Vacuna» viene seleccionado: antes el
   verde se veía **cortado** por abajo; ahora se ve el labio inferior completo
   (una franja verde oscura de unos 3 px bajo la cápsula).
2. Pulsar «Desparasitación», «Otro» y los demás chips de Tipo (deslizar la fila
   para llegar al último): el labio se ve entero en cada uno.
3. En «Aviso», con «7 días» seleccionado y luego «Mismo día», «1 día» y
   «3 días»: el labio se ve entero.
4. Comparar con antes: la separación entre «Tipo», «Título», «Aviso» y la vista
   previa no cambia (la pantalla no se mueve 3 px).

## Fuera de alcance

- Cualquier otra fila o pantalla con chips: Repetición (ya no recorta), Salud,
  Nutrición, vacunas, cuestionario. El selector de mascotas es de avatares y no
  lleva labio.
- Un guard repo-wide «ningún `ScrollView horizontal` con labio sin relleno».
  Hoy solo estas dos filas lo necesitan (D5); un guard general sería otra feature.
- Cambiar `chunkyLip.primaryCompact`, `--color-lip` u otro token; el canvas;
  `docs/ui-guidelines.md` (el arreglo cumple su regla 13, no la enmienda).
- Copy, i18n, animaciones, el color o el tamaño de los chips, `hitSlop`.
- Backend, dependencias, módulos nativos.
- El smoke en dispositivo (G2) y cualquier rebuild del dev build.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
  (R1 a R4; la firma delegada la pone el leader con la checklist de
  `progress/plan_canvas-parity-2026-10-23.md` §4, los tres puntos de
  `progress/plan_ui-2026-10-26.md` §4 y los dos de
  `progress/plan_mejoras-smoke-2026-11-03.md` §4)
- [ ] Enmienda de #213 R5 aprobada (la firma de esta spec la cubre; casilla
  propia porque el plan §4 pide dejar la casilla de la enmienda) (fecha: ____)
- [ ] **G2**: smoke en el dev build de Android (claro y oscuro, cuatro pasos de
  «Paso de smoke nuevo») (fecha: ____) ← gate humano, por lote al final
  (`progress/smoke_mejoras-smoke.md`)
- Base congelada: `bfc65ca6` (`origin/dev` mergeado en `feature/232-mobile-add-reminder-chip-lip-clip`).
