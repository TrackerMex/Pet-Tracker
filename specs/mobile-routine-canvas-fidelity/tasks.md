---
feature: "mobile-routine-canvas-fidelity"
status: approved
tags: [mobile, ui, spec]
---

# #178 mobile-routine-canvas-fidelity — Tareas

> Base congelada `fb5b209f`. Cada bloque es (1) test rojo, (2) implementación
> mínima, (3) refactor. Dos commits por R-id: primero
> `test(mobile): #178 Rn <qué>` con el rojo y después
> `feat(mobile): <qué> (#178 Rn)` con el verde. Nunca implementación y test
> en el mismo commit (C4). Los cambios de §Deltas de un R-id van en **su**
> commit `test`.

Todos los comandos, desde `mobile-pet-tracker/` salvo que se diga otra cosa:
`cd mobile-pet-tracker && bunx jest <ficheros> --testTimeout=30000`. Siempre
`bun`/`bunx`, nunca `npx`. **No ejecutar `./init.sh`**: lo corre el leader.

**Regla de parada**: si un `it` que no está en §Deltas de un R-id se pone
rojo, o un rojo no es el que este documento anuncia, Codex para y escribe en
`progress/impl_mobile-routine-canvas-fidelity.md` qué `it`, qué fichero y la
primera línea del error. El leader enmienda la spec.

## H0 — Arranque y medida

1. `git fetch origin` y comprobar que la branch es
   `feature/178-mobile-routine-canvas-fidelity` y contiene `origin/main`
   (`git merge-base --is-ancestor origin/main HEAD`).
2. `cd mobile-pet-tracker && bun install --frozen-lockfile`.
3. `cd mobile-pet-tracker && test ! -e .expo/types/router.d.ts` (si existe, para y
   avisa: no lo borres tú).
4. Medir B1 a B30, D1 a D9 y S1 a S6 de `requirements.md` con sus comandos y
   anotar cada valor en `progress/impl_mobile-routine-canvas-fidelity.md`.
   B1 a B30 son la base de `fb5b209f`; si #173, #174 o #175 ya mergearon,
   algunos cambian: eso **no** para. Para solo lo que la tabla de
   Dependencias o §#177 dicen que para (D1 a D9 distintos de lo esperado,
   S1/S2 con otro valor, S3 con otro texto, D9 ≥ 1).
5. Medir el recuento de `it` (`grep -cE "^\s*it(\.each\(|\()"`) de cada
   fichero de test que toca esta spec y anotarlo: el valor al cerrar es base
   H0 + los `it` que añade cada bloque.
6. `grep -cF '{ minutes: ' src/screens/add-reminder/index.tsx` da 4 (R12).
7. Buscar `it` de #173, #174 o #175 que inventaríen ficheros con `text-11`,
   `text-13`, `text-26`, `rounded-tile`, `tracking-title` o
   `font-extrabold` (`grep -rnE "text-(11|13|26)|rounded-tile|tracking-title|font-extrabold" src/__tests__`)
   y anotarlos para R13.

## R1 — Tokens

1. **Rojo**: `describe('#178 R1: tokens de Recordatorios')` en
   `src/theme/__tests__/global-css.test.ts`. Falla el `toMatchObject` (faltan
   `radius-14/16/22`, y `text-11`/`tracking-title` si S1/S2 dieron 0).
2. **Verde**: los tokens en `@theme` de `src/theme/global.css`, en el sitio
   de la tabla de R1.
3. **Refactor**: ninguno previsto.
- Sonda: borrar `--radius-22: 22px;` pone rojo el `toMatchObject`.
- `bunx jest src/theme/__tests__/global-css.test.ts --testTimeout=30000`

## R2 — Enmienda de la carta

1. **Rojo**: `describe('#178 R2: …')` en `src/__tests__/design-drift.test.ts`,
   ocho aserciones de R2. Si S3 dio 1, el punto 1 y 2 nacen verdes; los
   demás fallan.
2. **Verde**: editar `docs/ui-guidelines.md` según R2.1 a R2.7 (sección
   literal de §Texto de la enmienda solo si S3 dio 0). Commit
   `docs(ui): enmienda de fidelidad al canvas en Recordatorios (#178 R2)`.
3. **Refactor**: ninguno.
- Sonda: quitar `` `rounded-22` (22 px) `` de §12 pone rojo el punto 7.
- `bunx jest src/__tests__/design-drift.test.ts --testTimeout=30000`

## R3 — Copy nuevo

1. **Rojo**: `describe('#178 R3: claves de Recordatorios del canvas')` en
   `src/providers/__tests__/language-provider.test.tsx` y `+ 2, // #178 R3`
   en la fórmula de `englishKeys` (el último término anterior pierde su
   coma). Fallan los `toBe` (clave `undefined`), el registro y el recuento.
2. **Verde**: las dos claves en `en` y `es` de `src/i18n/catalog.ts` y la
   sección `§2.<N>` en `specs/mobile-ui-language/design.md`. Las filas de
   `ui-copy-table.ts` **no** se tocan aquí.
3. **Refactor**: `bunx prettier --write src/i18n/catalog.ts`.
- Sonda: cambiar `a las` por `alas` en `es` pone rojo el `toBe` de
  `addReminder.notifyPreview`.
- `bunx jest src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts --testTimeout=30000`

## R4 — Recordatorios: marco y título

1. **Rojo**: `describe('#178 R4: …')` en `src/screens/reminders/index.test.tsx`
   (doble de reicon a nivel de fichero con todos los iconos de §Deltas; el de
   `useThemeColors` con `` `color:${token}` ``), más los deltas: `R5`
   (marco), `#114 R5` (B29), fila `['reminders', '']` de
   `src/app/__tests__/layout.test.tsx` y la fila `reminders.reminders` de
   `src/__tests__/ui-copy-table.ts` movida a la pantalla. Rojo esperado:
   `getByTestId('reminders-title')` lanza (rojo por consulta), el `toEqual`
   del marco, el `className` de `reminders-actions`, el `title` del layout y
   `checkUses(R8_REMINDERS)`.
2. **Verde**: R4.1 a R4.5 en `src/screens/reminders/index.tsx` y
   `src/app/_layout.tsx`.
3. **Refactor**: ninguno.
- Sonda: `gap-2` → `gap-3` en `reminders-actions` pone rojo solo ese
  `className`.
- `bunx jest src/screens/reminders/index.test.tsx src/app/__tests__/layout.test.tsx src/__tests__/ui-language.test.ts --testTimeout=30000`

## R5 — Recordatorios: píldoras

1. **Rojo**: `describe('#178 R5: …')` con los fixtures comunes; deltas
   `#127 R3` (reminders test), `#120 R1` (`rounded-xl` → `rounded-16` en
   `pill-*`), B13 (`toBeNull()`) y `bg-accent-soft` global `- 1`
   (`// #178 R5`) en `src/__tests__/consistency-classnames.test.ts`. Rojo
   esperado: `getByTestId('reminders-pills')` lanza.
2. **Verde**: contenedor `reminders-pills` y clases de la tabla de R5, con
   `CATEGORY_SLOTS.amber` en la de semana.
3. **Refactor**: ninguno.
- Sonda: `text-2xl` → `text-xl` en el número activo pone rojo su
  `className`.
- `bunx jest src/screens/reminders/index.test.tsx src/__tests__/consistency-classnames.test.ts --testTimeout=30000`

## R6 — Recordatorios: fila

1. **Rojo**: `describe('#178 R6: fila del canvas')` con zona fijada
   (`hostProcess.env.TZ`), deltas `R6` (lista), `#65 R15` (B26), `#64 R7`,
   `category-palette.test.ts` (`Icon`, `it` renombrado), B11 reminders
   `4 + 1`, `CONTINUOUS_CORNER` global `+ 1` (`// #178 R6`) y la fila nueva
   `reminders.dueAt` en `ui-copy-table.ts` con su `+ 1` en
   `ui-language.test.ts`. Rojo esperado: `getByTestId('reminder-tile-a')`
   lanza; los textos `'2 ene, 09:00'` no existen; `emoji` sigue en las filas.
2. **Verde**: fila como `View` (R6), `REMINDER_TYPE_META` con `Icon`, una
   sola llamada a `useThemeColors` con los ocho tokens, formatos h23. Borrar
   `import { Card }`.
3. **Refactor**: `bunx prettier --write` de los ficheros tocados.
- Sonda: quitar `hourCycle: 'h23'` pone rojo `'2 ene, 09:00'` (sale
  `09:00 a.m.`).
- `bunx jest src/screens/reminders/index.test.tsx src/utils/__tests__/category-palette.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/ui-language.test.ts src/screens/home/index.test.tsx --testTimeout=30000`
  (home lee `REMINDER_TYPE_META.category`).

## R7 — Recordatorios: entrada y badge

1. **Rojo**: `describe('#178 R7: …')` con el doble de `../home/home-entrance`
   calcado de `src/screens/login/index.test.tsx`. Rojo esperado:
   `mockHomeEntrance` sin llamadas y `getByTestId('reminder-upcoming-pop-a')`
   lanza. `queryByTestId('reminder-upcoming-pop-b')` nace verde: va en el
   mismo `it` que una aserción roja.
2. **Verde**: `HomeEntrance` por fila con `index={i}` y `PopIn` en el badge
   con su `className`.
3. **Refactor**: ninguno.
- Sonda: `index={0}` fijo pone rojo `b` con 1.
- `bunx jest src/screens/reminders/index.test.tsx --testTimeout=30000`

## R8 — Recordatorios: sheet de borrado

1. **Rojo**: `describe('#178 R8: …')`. Rojo esperado:
   `children.length` (no es 5) y `reminders-delete-icon` ausente.
2. **Verde**: los cinco hijos de R8, con `Trash` y `CATEGORY_SLOTS.rose`.
3. **Refactor**: ninguno.
- Sonda: `size={26}` → `24` pone rojo el `size` del doble.
- `bunx jest src/screens/reminders/index.test.tsx --testTimeout=30000`

## R9 — Recordatorios: vacío con acción

1. **Rojo**: `describe('#178 R9: el vacío ofrece crear')`; borrar
   `it('no duplica la acción de crear'` (B27); fila nueva `reminders.new` en
   `ui-copy-table.ts` con su `+ 1`. Rojo esperado: `getByText('Nuevo')`
   dentro de `reminders-empty` lanza, y `checkUses`.
2. **Verde**: `action` de `EmptyState` con `t('reminders.new')` y
   `router.push('/add-reminder' as Href)`.
3. **Refactor**: ninguno.
- Sonda: `onPress: () => {}` pone rojo la llamada a `router.push`.
- `bunx jest src/screens/reminders/index.test.tsx src/__tests__/ui-language.test.ts --testTimeout=30000`

## R10 — Nuevo recordatorio: marco, título y chips de tipo

1. **Rojo**: `describe('#178 R10: …')` en
   `src/screens/add-reminder/index.test.tsx`, más los deltas `#95 R6`
   (marco), `'💉 Vacuna'`/`'📌 Otro'` → `'Vacuna'`/`'Otro'`, `#95 R5`, fila
   `['add-reminder', '']` del layout, fila `addReminder.addReminder` movida a
   la pantalla, `border-black/25` `+ 1` y `bg-accent-soft` `- 1`
   (`// #178 R10`). `CHIP_SELECTED`/`CHIP_IDLE` (B28) **no** cambian aquí:
   solo los usan los chips de aviso (R12). Rojo esperado:
   `getByTestId('add-reminder-title')` lanza.
2. **Verde**: R10.1 a R10.6; `SELECTED_CHIP` como constante de módulo.
3. **Refactor**: ninguno.
- Sonda: escribir el literal de `SELECTED_CHIP` también en el chip de aviso
  pone rojo el recuento de `border-black/25`.
- `bunx jest src/screens/add-reminder/index.test.tsx src/app/__tests__/layout.test.tsx src/__tests__/consistency-classnames.test.ts src/__tests__/ui-language.test.ts --testTimeout=30000`

## R11 — Nuevo recordatorio: campos

1. **Rojo**: `describe('#178 R11: …')` con dobles `Calendar` y `Clock`;
   deltas de fecha y hora (`'15 sep 2026'`, `'14:45'`) y `#123 R4`
   (`'24 sep 2026'`, `'1 oct 2026'`, `'1 ene 2027'`). Rojo esperado:
   `className` de `title-input`, `getByTestId('add-reminder-icon-calendar')`
   lanza, y los literales de fecha.
2. **Verde**: R11.1 a R11.5.
3. **Refactor**: ninguno.
- Sonda: `flex-3` → `flex-1` no la ve ningún test de jest: queda para el
  humo (R14). Sonda real: `border-transparent` → `border-border` pone rojo
  el foco.
- `bunx jest src/screens/add-reminder/index.test.tsx --testTimeout=30000`

## R12 — Nuevo recordatorio: aviso y vista previa

1. **Rojo**: `describe('#178 R12: …')` con doble `Bell`; deltas B28
   (`CHIP_SELECTED`, `CHIP_IDLE`), B11 add-reminder `3 + 1`,
   `CONTINUOUS_CORNER` `+ 1` y `bg-accent-soft` `- 1` (`// #178 R12`), fila
   nueva `addReminder.notifyPreview` con su `+ 1`. El caso «sin fecha, sin
   vista previa» nace verde: va en el mismo `it` que el primer caso de la
   tabla. Rojo esperado: `getByTestId('add-reminder-preview-text')` lanza.
2. **Verde**: chips de aviso con `SELECTED_CHIP`; vista previa entre Aviso y
   el botón, con `notifyAt` del aviso efectivo.
3. **Refactor**: ninguno.
- Sonda: usar `advance` (el pulsado) en vez del efectivo pone rojo la rama
  del 31 de diciembre.
- `bunx jest src/screens/add-reminder/index.test.tsx src/__tests__/consistency-classnames.test.ts src/__tests__/ui-language.test.ts --testTimeout=30000`

## R13 — Candados de deriva

1. **Test**: `describe('#178 R13: Recordatorios sin deriva')` en
   `src/__tests__/design-drift.test.ts`, un `it` por viñeta, y las listas de
   inventario que H0 (paso 7) encontró. Nace verde (candado sobre R4 a R12):
   antes del commit, cada `it` se prueba con su mutación y se revierte con
   `git checkout HEAD -- <fichero>` (`git diff --cached --quiet` después):
   - emoji `'💉'` en `reminder-meta.ts`;
   - `Check` añadido al import de reicon de reminders;
   - `<Card` en reminders;
   - la vista previa movida tras `add-reminder-submit`;
   - `rounded-22` en add-reminder.
   Cada mutación pone rojo su `it` y solo el suyo. Un commit
   `test(mobile): #178 R13 candados de deriva de Recordatorios`.
- `bunx jest src/__tests__/design-drift.test.ts --testTimeout=30000`

## R14 — Prueba de humo

La corre el humano en el dev build de Android; Codex no la ejecuta ni la
firma.

## Cierre (Codex)

1. Esperar a que no haya otro jest en marcha
   (`pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'` vacío).
2. `cd mobile-pet-tracker && bunx tsc --noEmit`.
3. `cd mobile-pet-tracker && bunx expo lint --no-cache > /tmp/lint178.log 2>&1 && test ! -s /tmp/lint178.log`
   (si sale `Failed to run`, reintentar una vez).
4. `cd mobile-pet-tracker && bunx jest --testTimeout=30000` (ALL). El aviso
   de worker force-exit al final es preexistente y no para.
5. Anotar en `progress/impl_mobile-routine-canvas-fidelity.md` los hashes
   de cada commit y rellenar `traceability.md` (R1 a R13).
