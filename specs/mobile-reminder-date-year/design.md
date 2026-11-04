---
feature: "mobile-reminder-date-year"
status: approved      # draft | approved
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-reminder-date-year]] (#240)

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Rutas relativas a `mobile-pet-tracker/src/`.

## Decisiones técnicas

- **Una sola línea de producción (R1, R2, R3, R5).** En
  `screens/reminders/index.tsx`, dentro de
  `const renderRow = (reminder: Reminder, past: boolean) => {`, la línea

  ```ts
  const date = due.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  ```

  pasa a

  ```ts
  const date = due.toLocaleDateString(locale, due.getFullYear() === new Date(now).getFullYear()
    ? { day: 'numeric', month: 'short' }
    : { day: 'numeric', month: 'short', year: 'numeric' });
  ```

  - `due` y `now` son las variables que ya existen (`const due = new Date(reminder.dueAt);`
    en `renderRow` y `const [now, setNow] = useState(Date.now);` en la
    pantalla). No se crea ninguna variable nueva.
  - Es la misma forma que el «hasta» de la propia fila
    (`until.getFullYear() === new Date(now).getFullYear()`) y que
    `screens/profile/index.tsx`.
  - TypeScript tipa las dos ramas por el contexto del parámetro
    (`Intl.DateTimeFormatOptions`): no hace falta `as const` ni anotación.
  - La línea `const time = …` y el JSX no cambian.
  - **Sin comentario** con `#240` en producción: el guard de
    `__tests__/design-drift.test.ts` (`HEX_LITERAL`) solo exime `#NNN R<n>`.
- **«hasta» sin cambios (R4).** Ver [[requirements]] §Decisiones 1.
- **Tests en el fichero de la pantalla.** Todo va en
  `screens/reminders/index.test.tsx`, en un `describe` nuevo
  (`#240: año en la fecha de la fila`) más las tres enmiendas de la «Tabla de
  enmiendas». No hace falta doble nuevo ni helper de producción.
- **Reloj por caso.** Cada fila de tabla fija su propio reloj dentro del `it`,
  porque las tablas mezclan diciembre y enero. Zona por `hostProcess`, como
  `#178 R6` y `#213 R14` (jest ignora `process.env.TZ`).
- **Envoltorio en inglés.** Una función local del `describe`, igual a
  `RemindersWrapper` pero con `LanguageProvider initial="en"`, pasada como
  `wrapper` a `renderWithProviders`. No se toca `RemindersWrapper` ni
  `renderReminders`.

## Archivos afectados

| Ruta | Capa | Cambio |
|---|---|---|
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | presentación (pantalla) | la línea `const date = …` de `renderRow` (R1, R2, R3, R5) |
| `mobile-pet-tracker/src/screens/reminders/index.test.tsx` | test | `describe('#240: año en la fecha de la fila')` (R1 a R5) y las tres enmiendas |
| `specs/mobile-routine-canvas-fidelity/requirements.md` | spec | sección `## Enmienda #240 — Año en la fecha de Recordatorios` con casilla (la escribe esta spec) |

No cambian: `i18n/catalog.ts`, `__tests__/ui-copy-table.ts`,
`utils/reminder-dates.ts`, `utils/civil-date.ts`, `package.json`, `bun.lock`,
`app.json`, `docs/ui-guidelines.md`, `docs/conventions.md` ni el backend.
Sin dependencias nuevas y sin rebuild del dev build (sin G3): es JS puro.

## Orden con #239 y reanclaje del handoff

#239 (`mobile-reminder-swipe-past-row-bleed`) toca el mismo fichero,
`screens/reminders/index.tsx`, y su `renderRow` (la fila pasada y el panel del
deslizable). Va a Codex **antes** que #240 (plan §3: un Codex a la vez entre
las dos).

- #240 solo cambia la línea `const date = …`. No toca la fila, su `className`,
  el deslizable ni el panel.
- **El handoff de #240 se reancla cuando #239 mergee en `dev`.** Antes de
  lanzar Codex, el leader mergea `dev` en `feature/240-mobile-reminder-date-year`
  y recomputa:
  - las cuentas de [[requirements]] §Evidencia (las de `index.tsx` y las de
    `index.test.tsx`);
  - los localizadores de la «Tabla de enmiendas», por si #239 enmendó alguno
    de esos `it` y les añadió un sufijo;
  - el reparto de nombres de `it` nuevos, por si #239 añadió alguno que
    empiece por `#240` (no debería).

  Si una cuenta de la columna «Cuenta» cambia, el handoff lleva la cifra
  nueva y la spec no se reabre. Solo se reabre si #239 cambia la línea
  `const date = …` o la `const time = …`.

## Skills

Nombres de nuestro catálogo; el leader los traduce a los de Codex en el
handoff (`.claude/agents/leader.md` §Catálogo real de skills de Codex):
`expo-overview` y `expo-native-ui`. No hay animación, navegación ni
componente nuevo.

## Riesgos

- **Hermes formatea distinto de Node.** Los literales de las tablas son de
  Node v20.20.2 con ICU 78.2. Hermes en Android usa su propio ICU y podría
  pintar, por ejemplo, «4 nov. 2027». No rompe tests (corren en Node); lo
  comprueba G2, paso 6.
- **`now` se congela mientras la pantalla está enfocada.** Si la app queda
  abierta en Recordatorios al pasar la medianoche del 31 dic, el año no se
  actualiza hasta el próximo enfoque. Es el mismo comportamiento que ya tienen
  la cuenta «en N días», las secciones y el «hasta». No se cambia.

## Alternativas descartadas

- **Helper compartido** (`formatDayMonthMaybeYear` en `utils/`) para
  Recordatorios y Perfil: tocaría `screens/profile/index.tsx`, fuera del
  hallazgo y de la ventana de #239. Si una tercera pantalla lo necesita, se
  extrae entonces.
- **`Intl.DateTimeFormat(locale, options).format(due)`**: rompe el candado de
  #65 R15, que espía `Date.prototype.toLocaleDateString`.
- **Un solo objeto con `year: sameYear ? undefined : 'numeric'`**: el
  resultado es el mismo, pero la rama de este año deja de ser el objeto
  literal de hoy y la intención se lee peor.
- **Año siempre**: contradice la respuesta del humano («Las fechas del año en
  curso no cambian»).
- **Llevar el «hasta» a día, mes y año** («hasta el 10 feb 2028»): cambia el
  copy de `reminders.untilMonth` y el candado de #213 R14, y el humano no lo
  pidió.
- **Comparar años UTC**: un recordatorio del 31 dic a las 20:00 en Ciudad de
  México es 2027 en UTC y saldría con año siendo de este año (R3).
