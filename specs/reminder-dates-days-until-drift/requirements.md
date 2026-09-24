---
feature: "reminder-dates-days-until-drift"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[reminder-dates-days-until-drift]] (#84)

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, [[tasks]] para el orden de
> commits y [[traceability]] para la trazabilidad.
>
> Fuente: `feature_list.json` #84 (description + cuatro criterios). Cada
> premisa del encargo se verificó contra el árbol antes de escribir un
> requisito (§0); las que no cuadraban se corrigen en §0.2.
>
> Feature **solo móvil** y **solo lógica**: cambia el cuerpo de una función
> pura. **Cero cambios en pantallas, cero claves de catálogo, cero
> dependencias, cero clases.**
>
> Base: `446f5581` (= `origin/main` el 2026-09-23). Branch
> `feature/84-reminder-dates-days-until-drift`, worktree
> `/home/claude/sites/Pet-Tracker-wt-backend`. El handoff a Codex se hace
> **después** de que #114 (PR #158) mergee y esta branch se rebase ([[tasks]]
> §Antes de empezar). Rutas relativas a `mobile-pet-tracker/` salvo las que
> empiezan por `docs/`, `specs/` o `progress/`. **Ninguna cita usa número de
> línea**: todo ancla es un texto literal que se encuentra con `grep -n`.

---

## §0. Verificación de premisas contra el árbol

### §0.1 Premisas confirmadas

| # | Premisa | Evidencia (ancla grepeable, medida en `446f5581`) |
|---|---|---|
| P1 | `daysUntil` cuenta bloques de 24 h redondeados hacia arriba | `return Math.ceil((to.getTime() - from.getTime()) / DAY_MS);` en `src/utils/reminder-dates.ts` |
| P2 | Su **único** consumidor de producción es la pantalla de recordatorios, con dos llamadas | `git grep -n daysUntil -- mobile-pet-tracker` → `src/screens/reminders/index.tsx`: `const days = daysUntil(` (dentro del filtro de la píldora) y `const days = daysUntil(new Date(), new Date(reminder.dueAt));` (por fila). El resto son el propio módulo y su test |
| P3 | «pill-week» es consumidor | **Cierta** (el leader la sospechaba caducada): no es otro componente sino `testID="pill-week"`, la píldora «Esta semana» de la **misma** pantalla. Su número es la primera llamada de P2 (`days >= 0 && days <= 7`) |
| P4 | El recuento por fila consume `days` | Cierto, y la entrada **se deja una tercera decisión**: el badge «¡Próximo!» (`` testID={`reminder-upcoming-${reminder.id}`} ``) sale del mismo `days` de la fila con `!inactive && days >= 0 && days <= 10`. La etiqueta es `{t('reminders.dueInDays', { days })}` → `'· en {{days}} días'` |
| P5 | `calendarDaysUntil(date: string, now: Date)` existe (de #70) | `export function calendarDaysUntil(date: string, now: Date): number {` en `src/screens/home/format.ts`; sus únicos usuarios son `src/screens/home/index.tsx` y el propio `format.ts` (`upcomingReminders`). **Ninguna** pantalla de `src/screens/` importa de otra pantalla (`grep -rn "from '\.\./[a-z-]*/" src/screens` sin `../../` → 0 líneas) |
| P6 | Jest no fija zona horaria | `"test": "jest"` en `package.json`; ni `jest` config, ni `test/jest-setup.js`, ni `TEST_CMD` de `init.config.sh`, ni `.github/workflows/ci.yml` mencionan `TZ`. El VPS es `Etc/UTC`; CI corre en `ubuntu-latest` (UTC). La máquina Windows del humano corre en su zona local, sin suponer cuál |
| P7 | Un test existente **fija el defecto** | `['positive', new Date('2026-08-25T09:00:01.000Z'), 2],` dentro de `describe('R4: reminder-dates combina y cuenta días'` en `src/utils/reminder-dates.test.ts`: 24 h + 1 s son **1** día de calendario, no 2. Se corrige en R1 (§Candados) |
| P8 | Las aserciones de pantalla existentes sobreviven al arreglo | `it('renders summaries and reminder rows in API order'` (`describe('R6: lista con pills, badges y refetch on focus'`) pide `'· en 3 días'`, badge en `upcoming`, ninguno en `later` y `pill-week` = `1`. Medido con la fórmula nueva: `upcoming` = 3 y `later` = 17 tanto con `TZ=UTC` como con `TZ=America/Mexico_City`. **No se toca** |
| P9 | #114 (PR #158) solapa en la pantalla, no en esta feature | `git diff origin/main origin/feature/114-mobile-reminders-alerts-to-stack -- mobile-pet-tracker/src/screens/reminders` (head `94c4cee7`): quita el título, cambia `contentContainerStyle`, añade `testID="reminders-actions"` y en el test añade **un** `it` (`describe('#114 R5: el título vive en la cabecera nativa'`) y renombra otro. No toca `reminder-dates.*` ni las dos llamadas de P2. #84 **no toca** `src/screens/reminders/index.tsx` y solo **añade al final** de su test |

### §0.2 Premisas corregidas (nadie construye sobre la versión anterior)

| # | Qué decía el encargo | Lo que dice el árbol | Evidencia |
|---|---|---|---|
| C1 | «el resultado depende de la hora del día **y se desplaza en zonas de offset negativo**» | **Lo primero es cierto; lo segundo no, en el código actual.** `Math.ceil` sobre una resta de milisegundos no lee la zona: da los mismos valores en cualquier host. Su defecto es contar **bloques de 24 h redondeados hacia arriba**, visible en **toda** zona. El desplazamiento en offset negativo es el riesgo del **arreglo ingenuo** (normalizar con `getUTC*` o `toISOString().slice(0, 10)`), y ese es el que canda R2 | Sonda en el scratchpad: la tabla de R1 evaluada con la fórmula actual da valores idénticos con `TZ=UTC` y con `TZ=America/Mexico_City` |
| C2 | Casos de ejemplo: «de 23:30 a una cita a las 00:30 del día siguiente = 1» y «de 08:00 a las 07:00 del día siguiente = 1» | **Los dos son correctos hoy** (1 h y 23 h → `Math.ceil` = 1); no ponen nada rojo contra el código actual. Los que fallan son: hora **posterior** en un día futuro (+1 de más), hora posterior el **mismo** día (1 en vez de 0), hora anterior el mismo día (`-0`), y **ayer a hora posterior** (`-0` en vez de `-1`, que además cuenta como «Esta semana» y lleva «¡Próximo!»). Los dos ejemplos entran en R1 como filas de regresión; el de 23:30 es justo el que rompe la normalización UTC en un host UTC−6 (da 0) | Tabla de R1, columna «hoy» |
| C3 | Un test bajo TZ negativa lo fija | **No se puede forzar la zona desde un fichero de test.** Medido con el jest 29.7 del repo: `process.env.TZ = 'America/Mexico_City'` dentro de un `test` deja `getTimezoneOffset()` en `0` en el VPS (jest da al sandbox una **copia** de `process.env`). La zona negativa se simula con los dobles `skewed` de `#70 R5` (getters locales y UTC en días distintos), que no dependen del host ([[design]] D3) | Sonda en el scratchpad (fuera del repo); mecanismo de `describe('#70 R5: la zona horaria no desplaza fechas'` en `src/screens/home/format.test.ts` |
| C4 | `files_affected`: solo `src/utils/reminder-dates.ts` | Producción, sí, solo ese. Tests: además `src/utils/reminder-dates.test.ts` y `src/screens/reminders/index.test.tsx` | [[design]] §Archivos afectados |
| C5 | #85 (E2) proponía que #84 unificara `daysUntil`, `calendarDaysUntil` y `localDayOf`, citando `localTodayIso` «duplicado tres veces» | **La cita está caducada**: hoy hay **una** copia, `function localTodayIso(): string {` en `src/screens/health/index.tsx`, más `src/utils/civil-today-iso.ts` (de #90). #84 **no unifica** (D2, y §Fuera de alcance) | `grep -rn "function localTodayIso" src` |

---

## Qué firma el humano al aprobar esta spec

Firmar sin editar = aceptar **D1-D4** tal cual. Detalle y alternativas en
[[design]]; aquí, una línea por decisión.

| Id | Decisión | En una línea |
|---|---|---|
| **D1** | **Arreglo en sitio** | `daysUntil(from: Date, to: Date): number` conserva nombre, firma y módulo; su cuerpo pasa a restar el **día civil local** de cada fecha (`Date.UTC(getFullYear(), getMonth(), getDate())`) y dividir por `DAY_MS`, la misma semántica que `calendarDaysUntil`. La pantalla no cambia: sigue pasando `new Date()` y `new Date(reminder.dueAt)` |
| **D2** | **No se unifica con `calendarDaysUntil`** (criterio 4: evaluado y descartado) | Tienen dominios distintos (instante frente a fecha civil `YYYY-MM-DD`). Unificar exigiría o un import entre pantallas sin precedente, o mover `calendarDaysUntil` y `localDayOf` a `src/utils/` tocando la Home y su candado `#70 R5`, que prohíbe llamar al constructor de `Date` |
| D3 | **Candado de zona horaria por dobles, no por `TZ`** | Los dobles `skewed` de `#70 R5` simulan Ciudad de México (UTC−6, sin horario de verano desde 2022) en cualquier host. No se toca la config global de jest |
| D4 | **Copy intacto** | La etiqueta sigue siendo `'· en {{days}} días'`: con el arreglo muestra `· en 0 días` y `· en 1 días` donde hoy muestra `· en 1 días` y `· en 2 días`. «Hoy», «mañana» y el singular quedan fuera (§Fuera de alcance). **+0** claves de catálogo |

Si el humano **no** firma D2 y quiere la unificación, esta spec se reabre: hay
que mover `calendarDaysUntil` y `localDayOf` a `src/utils/`, reescribir los
imports de `src/screens/home/index.tsx` y `src/screens/home/format.test.ts`, y
avisar a #115, cuya descripción da por hecho que `calendarDaysUntil` vive en
`src/screens/home/format.ts`.

---

## Contrato (normativo)

`daysUntil(from, to)` = (día civil local de `to`) − (día civil local de
`from`), en días enteros. «Día civil local» = `getFullYear()`, `getMonth()`,
`getDate()` de la fecha, **nunca** los `getUTC*` ni `getTime()`. Nunca devuelve
`-0`.

---

## Requisitos funcionales

Todas las `describe` nuevas llevan el prefijo canónico `#84 R<n>:`
(`docs/conventions.md` §Prefijo de feature: los dos ficheros de test ya tienen
R-ids desnudos de `mobile-reminders`).

### R1 — `daysUntil` cuenta días de calendario locales, no bloques de 24 h

**WHEN** `daysUntil(from, to)` recibe dos fechas,
**THE SYSTEM SHALL** devolver el día civil local de `to` menos el de `from`,
sin que la hora del día de ninguna de las dos cambie el resultado, y devolver
`0` positivo cuando caen el mismo día.

- **Test**: `src/utils/reminder-dates.test.ts`,
  `describe('#84 R1: daysUntil cuenta días de calendario locales, no bloques de 24 h'`
  → `it.each(<tabla>)('%s', …)` con `expect(daysUntil(from, to)).toBe(esperado)`.
  **`toBe`**, no `toEqual`: `toBe` compara con `Object.is`, así que `-0` no
  pasa por `0`.
- Todas las fechas se construyen con **componentes locales**,
  `new Date(año, mesIndex, día, hora, minuto)`; la tabla da lo mismo en
  cualquier zona del host (medido con `TZ=UTC` y `TZ=America/Mexico_City`) y
  ninguna de las 418 zonas IANA cambia de offset entre el 8 y el 22 de
  septiembre de 2026 (medido), así que no hay fila de horario de verano
  ([[design]] D4).

| # | Título de la fila (`%s`) | `from` | `to` | Esperado | Hoy (`Math.ceil`) |
|---|---|---|---|---|---|
| 1 | `mismo día, hora posterior = 0` | 2026-09-10 08:00 | 2026-09-10 09:00 | `0` | `1` ✗ |
| 2 | `mismo día, hora anterior = 0 positivo` | 2026-09-10 09:00 | 2026-09-10 08:00 | `0` | `-0` ✗ |
| 3 | `de 00:00 a 23:59 del mismo día = 0` | 2026-09-10 00:00 | 2026-09-10 23:59 | `0` | `1` ✗ |
| 4 | `de 23:30 a 00:30 del día siguiente = 1` | 2026-09-10 23:30 | 2026-09-11 00:30 | `1` | `1` (regresión) |
| 5 | `de 08:00 a 07:00 del día siguiente = 1` | 2026-09-10 08:00 | 2026-09-11 07:00 | `1` | `1` (regresión) |
| 6 | `de 08:00 a 09:00 del día siguiente = 1` | 2026-09-10 08:00 | 2026-09-11 09:00 | `1` | `2` ✗ |
| 7 | `ayer a hora posterior = -1` | 2026-09-10 09:00 | 2026-09-09 10:00 | `-1` | `-0` ✗ |
| 8 | `ayer a hora anterior = -1` | 2026-09-10 09:00 | 2026-09-09 08:00 | `-1` | `-1` (regresión) |
| 9 | `borde de la semana: +7 días a hora posterior = 7` | 2026-09-10 08:00 | 2026-09-17 09:00 | `7` | `8` ✗ |
| 10 | `borde del badge: +10 días a hora posterior = 10` | 2026-09-10 08:00 | 2026-09-20 09:00 | `10` | `11` ✗ |

- **Mismo commit rojo**: la fila existente `['positive', new Date('2026-08-25T09:00:01.000Z'), 2],`
  pasa a esperar **`1`** (P7). Es una corrección, no un debilitamiento: sigue
  siendo `toBe` con un entero.
- **Rojo esperado** contra el código actual: filas 1, 2, 3, 6, 7, 9, 10 y la
  fila `positive`, **por aserción**.
- **Mutaciones que deben dejarlo rojo** (medido con una sonda en el
  scratchpad): la fórmula actual, `Math.ceil` sobre ms (filas 1, 2, 3, 6, 7,
  9, 10); `Math.round` sobre ms (filas 2, 3, 4); `Math.floor` sobre ms (filas
  2, 4, 5, 8); `Math.trunc` sobre ms (filas 2, 4, 5, 7).

### R2 — La zona horaria no desplaza la cuenta (candado de offset negativo)

**IF** el día civil local de una fecha difiere de su día en UTC —zona de
offset negativo por la tarde-noche, p. ej. Ciudad de México a partir de las
18:00—
**THEN THE SYSTEM SHALL** contar por el día civil local, nunca por el UTC.

- **Requisito de verificación** (CHECKPOINTS C4, vía (b) con el quinto
  punto): tras el verde de R1 el código ya es correcto. Su rojo es una
  **mutación de producción versionada** en el commit rojo —los seis getters
  locales de `daysUntil` pasan a `getUTCFullYear()`, `getUTCMonth()`,
  `getUTCDate()`— y el verde la revierte. Nunca una mutación del doble.
- **Test**: `src/utils/reminder-dates.test.ts`,
  `describe('#84 R2: la zona horaria no desplaza la cuenta de días'`
  → `it.each(<tabla>)('%s', …)` con `expect(daysUntil(from, to)).toBe(esperado)`.
- Los dobles tienen la forma de los `skewed` de `#70 R5`: un objeto
  `as unknown as Date` con `getFullYear`, `getMonth`, `getDate` (día civil en
  Ciudad de México), `getUTCFullYear`, `getUTCMonth`, `getUTCDate` (día UTC
  del instante real) y además **`getTime`** con el instante real, para que la
  fórmula anterior dé un número equivocado y no un `TypeError`. Ciudad de
  México es UTC−6 todo el año (medido: `GMT-06:00` en enero y en septiembre
  de 2026).

| Doble | Hora en Ciudad de México | Instante (`getTime`) | Getters locales | Getters UTC |
|---|---|---|---|---|
| `A` | 2026-09-10 08:00 | `'2026-09-10T14:00:00.000Z'` | 2026, 8, 10 | 2026, 8, 10 |
| `B` | 2026-09-10 20:00 | `'2026-09-11T02:00:00.000Z'` | 2026, 8, 10 | 2026, 8, **11** |
| `C` | 2026-09-11 09:00 | `'2026-09-11T15:00:00.000Z'` | 2026, 8, 11 | 2026, 8, 11 |

| # | Título de la fila (`%s`) | `from` | `to` | Esperado | Mutación UTC | `Math.ceil` |
|---|---|---|---|---|---|---|
| 1 | `Ciudad de México, 08:00 → 20:00 del mismo día = 0` | `A` | `B` | `0` | `1` ✗ | `1` ✗ |
| 2 | `Ciudad de México, 20:00 → 09:00 del día siguiente = 1` | `B` | `C` | `1` | `0` ✗ | `1` |
| 3 | `Ciudad de México, 20:00 → 08:00 del mismo día = 0` | `B` | `A` | `0` | `-1` ✗ | `-0` ✗ |

- **Rojo esperado** con la mutación UTC: las **tres** filas, en cualquier
  host. Las filas de R1 siguen verdes en un host UTC (VPS y CI) con esa
  mutación —local y UTC coinciden allí—, y esa es la prueba de que R2 hace
  falta; en un host de offset negativo las filas 3 y 4 de R1 también se
  ponen rojas, y es lo esperado.
- **Mutaciones que deben dejarlo rojo**: la UTC (versionada); la fórmula
  actual (filas 1 y 3); `toISOString().slice(0, 10)` (los dobles no tienen
  `toISOString`: rojo por excepción, válido como sonda extra del reviewer, no
  como rojo versionado).

### R3 — La pantalla de recordatorios cuenta días de calendario en sus tres decisiones

**WHILE** la pantalla de recordatorios muestra recordatorios en estado
`scheduled`,
**THE SYSTEM SHALL** derivar del recuento de R1 las tres decisiones que lo
consumen: el número de la píldora «Esta semana» (`pill-week`, cuenta los que
tienen 0 ≤ días ≤ 7), la presencia del badge «¡Próximo!»
(`reminder-upcoming-<id>`, 0 ≤ días ≤ 10) y la etiqueta `· en N días` de la
fila.

- **Requisito de verificación** (C4 (b), quinto punto): la pantalla no cambia
  y tras R1 ya es correcta. Rojo = **mutación de producción versionada**:
  el cuerpo de `daysUntil` vuelve a
  `return Math.ceil((to.getTime() - from.getTime()) / DAY_MS);` (el patrón
  que la feature retira) en el commit rojo; el verde lo revierte.
- **Test**: `src/screens/reminders/index.test.tsx`, `describe` nuevo **al final
  del fichero**:
  `describe('#84 R3: recordatorios cuenta días de calendario en la píldora, el badge y la etiqueta'`,
  con el arnés de `describe('R6: lista con pills, badges y refetch on focus'`
  (relojes falsos) y hora del sistema **`new Date(2026, 8, 10, 8, 0)`**
  (componentes locales). Todos los recordatorios `status: 'scheduled'` vía
  `makeReminder({ id, dueAt })`, con `dueAt = new Date(…).toISOString()`.
  Aserciones `within(...)` sobre cada fila (carta de UI, Enmienda #70: el dato
  que muestra y la condición de render, en más de un escenario).

| `it` | Recordatorio (`id` → `dueAt` local) | Esperado | Hoy (`Math.ceil`) |
|---|---|---|---|
| `08:00 del 10 de septiembre: hoy a las 20:00, +7 y +10 días a las 09:00 cuentan 0, 7 y 10` | `today-later` → 2026-09-10 20:00 | fila: `· en 0 días`; badge presente | `· en 1 días` ✗; badge presente |
| (mismo `it`) | `week-edge` → 2026-09-17 09:00 | fila: `· en 7 días`; badge presente | `· en 8 días` ✗ |
| (mismo `it`) | `badge-edge` → 2026-09-20 09:00 | fila: `· en 10 días`; badge **presente** | `· en 11 días` ✗; badge ausente ✗ |
| (mismo `it`) | píldora | `within(pill-week)` → `2` | `1` ✗ |
| `08:00 del 10 de septiembre: ayer a las 09:00 no es de esta semana ni próximo` | `yesterday-later` → 2026-09-09 09:00 | fila: `· en -1 días`; badge **ausente**; `within(pill-week)` → `0` | `· en 0 días` ✗; badge presente ✗; píldora `1` ✗ |

- Por qué dos `it` y no uno: con los cuatro recordatorios juntos la píldora da
  `2` con el arreglo **y** `2` con la fórmula actual (hoy cuenta `today-later`
  y `yesterday-later`; el arreglo cuenta `today-later` y `week-edge`). El
  empate escondería el defecto.
- **Rojo esperado** con la mutación: los dos `it`, por aserción.
- **Mutaciones que deben dejarlo rojo** (sondas extra del reviewer, sin
  versionar): intercambiar los argumentos en las dos llamadas de la pantalla;
  `days <= 7` → `days < 7`; `days <= 10` → `days < 10`; `days >= 0` → `days > 0`
  en la píldora o en el badge.
- La etiqueta `· en -1 días` es copy **existente** para un recordatorio
  programado en el pasado; se fija aquí solo para candar el número (D4).

### R4 — Gate humano: smoke en dev build de Android

**WHEN** R1-R3 están en verde y el `reviewer` aprobó,
**THE SYSTEM SHALL** superar la prueba de humo de §Prueba de humo, corrida por
el humano. **No delegable a IA.** Se firma en su propia casilla, no en
§Aprobación.

---

## Candados

### Se mueven (delta declarado; ninguno más)

| Fichero · ancla grepeable | Delta | R · commit |
|---|---|---|
| `src/utils/reminder-dates.test.ts` · `['positive', new Date('2026-08-25T09:00:01.000Z'), 2],` | esperado `2` → `1` | R1 · rojo |
| Recuento de tests de `src/utils/reminder-dates.test.ts` | **+13** (10 de R1 + 3 de R2) sobre la base medida al arrancar (4 en `446f5581`) | R1, R2 · rojo |
| Recuento de tests de `src/screens/reminders/index.test.tsx` | **+2** (R3) sobre la base medida al arrancar (25 en `446f5581`; 26 con #114, que añade un `it`) | R3 · rojo |
| Suite móvil | **+15 tests, +0 suites** sobre la base medida al arrancar (80 suites / 1443 tests en `446f5581`, init.sh del leader; #114 la sube) | — |
| `src/providers/__tests__/language-provider.test.tsx` · `expect(englishKeys).toHaveLength(` | **+0** (ninguna clave nueva) | — |
| `src/__tests__/ui-copy-table.ts` | **+0** | — |

### Siguen verdes sin tocarlos (si uno se pone rojo, la implementación está mal)

| Candado | Qué fija que esta feature no puede mover |
|---|---|
| `reminder-dates.test.ts` · `it('combines the local calendar date and local time without seconds'` | `combineDateAndTime` no se toca |
| `reminder-dates.test.ts` · filas `zero` y `negative` de `it.each(…)('returns a %s integer'` | siguen dando `0` y `-1` |
| `reminders/index.test.tsx` · `it('renders summaries and reminder rows in API order'` | `· en 3 días`, badge en `upcoming` y no en `later`, `pill-week` = `1` (P8) |
| `src/screens/home/format.test.ts` · `#70 R4`, `#70 R5`, `#85 R2`, `#85 R3` | `calendarDaysUntil`, `localDayOf` y `upcomingReminders` no se tocan |
| `src/__tests__/design-drift.test.ts` · `describe('C8: la UI no usa clases arbitrarias'` | recorre **todos** los `.ts`/`.tsx` de `src/` fuera de `__tests__/`, incluidos los tests colocados: el código de test nuevo no puede contener `<palabra>-[` |

---

## Prueba de humo del humano (no delegable a IA) — R4

Runtime: **dev build de Android**, nunca Expo Go. No hace falta regenerarlo:
cero cambios nativos; basta recargar el JS desde Metro. Backend en `main`.
Una mascota **sin otros recordatorios programados** (la Home solo pinta los
tres más próximos).

Anotar la hora del teléfono, **H**. Si H + 2 h pasa de medianoche, hacer la
prueba en otro momento.

1. Crear un recordatorio para **hoy a H + 2 h**. En **Recordatorios**, su fila
   dice `· en 0 días` y lleva «¡Próximo!»; «Esta semana» lo cuenta. En la
   **Home**, el mismo recordatorio dice «Hoy». (Antes de #84, la fila decía
   `· en 1 días` mientras la Home decía «Hoy».)
2. Crear otro para **dentro de 7 días a H + 1 h**. Su fila dice `· en 7 días`
   y «Esta semana» sube en 1. (Antes: `· en 8 días` y no contaba.)
3. Crear otro para **dentro de 10 días a H + 1 h**. Su fila dice
   `· en 10 días` y lleva «¡Próximo!». (Antes: `· en 11 días`, sin badge.)
4. Borrar los tres recordatorios de prueba.

- [ ] Prueba de humo de R4 superada por el humano (fecha: ____, dispositivo: ____)

---

## Cobertura de los criterios de aceptación de `feature_list.json` #84

| Criterio | Cubierto por |
|---|---|
| 1. `daysUntil` deja de depender de la hora del día: normaliza a medianoche antes de restar | D1, R1 |
| 2. Un test bajo TZ negativa lo fija, y muere si alguien vuelve a `Math.ceil` sobre ms | R2 (dobles de Ciudad de México; C3 explica por qué no un `TZ` real), y la mutación versionada de R3, que es literalmente la vuelta a `Math.ceil` y pone rojos R1, R2 y R3 |
| 3. Los consumidores —`pill-week` y el contador por fila— siguen verdes sin debilitar asserts | P8 (el test de pantalla existente no se toca), R3 (las tres decisiones, más el badge que la entrada omitía); la única aserción existente que cambia es la fila `positive`, que fijaba el defecto (P7) |
| 4. Se evalúa unificar con `calendarDaysUntil` | D2: evaluado y descartado, con las tres alternativas en [[design]] |

---

## Fuera de alcance (cada viñeta clasificada y con su premisa verificada)

**Delimitaciones — no son features, no se registran:**

- **Unificar `daysUntil` con `calendarDaysUntil` y `localDayOf`.** D2. Tienen
  entradas distintas: `calendarDaysUntil` recibe una fecha civil
  `'YYYY-MM-DD'` que **no** puede pasar por `new Date(string)` (sería
  medianoche UTC, el día anterior en offset negativo), y `#70 R5` lo canda
  con `expect(dateConstructor).not.toHaveBeenCalled()`.
- **Cambiar el copy de la etiqueta** (`· en 1 días` sin singular, `· en 0 días`
  en vez de «Hoy», `· en -1 días` para un programado ya pasado). El texto es
  `'reminders.dueInDays': '· en {{days}} días'` en `src/i18n/catalog.ts` y
  #84 no lo toca (D4). Hacerlo es una decisión de producto con claves nuevas y
  delta en el candado del catálogo; si el humano la quiere, es otra feature.
- **Contar en la zona del dueño** (`users.timezone`, `civilTodayIso` de
  `src/utils/civil-today-iso.ts`) en vez de la del dispositivo. La Home
  cuenta en la del dispositivo (`calendarDaysUntil` y `localDayOf` leen
  getters locales); #84 alinea Recordatorios con la Home, no cambia el
  criterio.
- **Tocar `src/screens/reminders/index.tsx`.** No hace falta (D1); su diff
  vivo es de #114.
- **Ocultar o filtrar los programados que ya vencieron.** La lista pinta todo
  lo que devuelve la API, en su orden (`it('renders summaries and reminder rows in API order'`).
- **Cambios en `backend-pet-tracker/`, `docs/ui-guidelines.md`,
  `global.css`, `infra/` o CI.**

**Deuda preexistente, ya nombrada, que esta feature no ejecuta:**

- **Helpers de día civil repartidos**: `function localTodayIso(): string {` en
  `src/screens/health/index.tsx`, `civilTodayIso` en `src/utils/`,
  `localDayOf` y `calendarDaysUntil` en `src/screens/home/format.ts` y ahora
  `daysUntil` en `src/utils/reminder-dates.ts`. #85 lo nombró (E2) con una
  cita que ya no es exacta (C5). Si se registra, que cuente con #115, que va a
  consumir `calendarDaysUntil` desde Salud.

---

## Aprobación

- [x] Spec aprobada por humano (fecha: 2026-09-23, vía Notion)

---

## Enmienda E1 — R5 (mes y año del día civil), R6 (umbrales de la pantalla) y filas heredadas a componentes locales

> Escrita el 2026-09-24 sobre la spec aprobada (firma `2665ffd3`), tras el
> **RECHAZO** de la primera revisión (`progress/review_reminder-dates-days-until-drift.md`,
> commit `158fbf43`, sobre la punta de Codex `5b1cb8e9`). No toca D1-D4, ni
> R1-R4, ni sus tests, ni la firma original: todo eso sigue firmado y su
> trazabilidad sigue valiendo. Añade **R5** y **R6** y mueve un candado
> heredado. Su casilla va **sin marcar**: el humano reabre el gate solo para
> esta enmienda.

### El hecho medido (H1-H4 del reviewer)

El código de producción en `5b1cb8e9` es **correcto** (da `1` del 30 de
septiembre al 1 de octubre y del 31 de diciembre al 1 de enero, en `UTC` y en
`America/Mexico_City`). El hueco está en las tablas que esta spec firmó:
todas sus fechas caen entre el 9 y el 20 de septiembre, así que ningún test
observa el **mes** ni el **año** del día civil. Estas mutaciones de
`daysUntil` dejan verde la suite móvil:

| Id | Mutación en `src/utils/reminder-dates.ts` | Efecto en producción |
|---|---|---|
| U8 | `return to.getDate() - from.getDate();` | del 30-sep al 1-oct da `-29`: un recordatorio de mañana sale de «Esta semana» y pierde «¡Próximo!» cada fin de mes. **Suite entera verde: 82/82 suites, 1467/1467 tests** |
| U9 | `getMonth()` → `0` | `-29` a fin de mes |
| U10 | `getFullYear()` → `2026` | `-364` a fin de año |
| U15 | `getMonth()` → `getMonth() + 1` | cuenta mal cruzando meses de distinta longitud |
| U11 | solo `getMonth` → `getUTCMonth` | en Ciudad de México, el último día del mes tras las 18:00, `-29` |
| U12 | solo `getFullYear` → `getUTCFullYear` | en Ciudad de México, el 31 de diciembre tras las 18:00, `-364` |

Y en la pantalla (anterior a #84, bajo en severidad): `days <= 7` → `days <= 8`
en la píldora y `days <= 10` → `days <= 11` en el badge sobreviven, porque
ningún test tiene un recordatorio a +8 ni a +11 días (H3).

Además (H4), las tres filas heredadas `zero` / `positive` / `negative` de
`describe('R4: reminder-dates combina y cuenta días'` usan instantes con `Z`;
con la semántica de día civil, `negative` recibe `-2` en un host UTC−9
(`Pacific/Gambier`). Ningún host del proyecto está en esa zona, pero
contradice «siguen dando `0` y `-1`» de §Candados.

### Decisión: E1 añade **R5** y **R6**, no reescribe R1, R2 ni R3

R1-R3 están firmados, la implementación los cumple al pie y sus pares
rojo→verde están en traceability. Añadir filas a sus tablas sería modificar
requisitos aprobados (C6) y dejaría sin sentido sus rojos versionados. R5 y
R6 aseveran **otras propiedades** en `describe` propios. Los tests de R1-R3 no
se tocan.

### R5 — El día civil incluye el mes y el año

*(requisito de verificación sobre código ya correcto: su rojo es una
**mutación de producción** versionada en el commit rojo y revertida en el
verde, CHECKPOINTS.md C4 quinto punto; nunca una mutación del doble)*

**WHEN** `from` y `to` caen en meses o años civiles locales distintos,
**THE SYSTEM SHALL** contar los días civiles locales que los separan a través
del cambio de mes o de año, usando el año, el mes y el día locales de cada
fecha.

- **Test**: `src/utils/reminder-dates.test.ts`, al final del fichero,
  `describe('#84 R5: el día civil incluye el mes y el año (Enmienda E1)'`
  → **un** `it.each` de 3 filas `[título, from, to, esperado]` con título
  `'%s'` y cuerpo `expect(daysUntil(from, to)).toBe(esperado)` (`toBe`, no
  `toEqual`).
- Filas 1 y 2 con **componentes locales** (`new Date(año, mesIndex, día, hora, minuto)`).
  Fila 3 con dos dobles de Ciudad de México construidos por un helper
  **propio de este `describe`** con la forma del `skewed` de R2 (mismo
  fichero), pero que recibe **año, mes y día locales** además del instante
  ISO: `getFullYear`, `getMonth`, `getDate` devuelven los locales dados;
  `getUTCFullYear`, `getUTCMonth`, `getUTCDate` y `getTime` salen del
  instante ISO; `as unknown as Date`. El helper de R2 no se toca.

| # | Título de la fila (`%s`) | `from` | `to` | Esperado |
|---|---|---|---|---|
| 1 | `fin de mes: 30 de septiembre 20:00 → 1 de octubre 09:00 = 1` | `new Date(2026, 8, 30, 20, 0)` | `new Date(2026, 9, 1, 9, 0)` | `1` |
| 2 | `fin de año: 31 de diciembre 23:30 → 1 de enero 00:30 = 1` | `new Date(2026, 11, 31, 23, 30)` | `new Date(2027, 0, 1, 0, 30)` | `1` |
| 3 | `Ciudad de México, 31 de diciembre 20:00 → 1 de enero 09:00 = 1` | doble: locales 2026, 11, 31; instante `'2027-01-01T02:00:00.000Z'` | doble: locales 2027, 0, 1; instante `'2027-01-01T15:00:00.000Z'` | `1` |

- **Rojo versionado**: U8 (`return to.getDate() - from.getDate();` como
  cuerpo entero de `daysUntil`). Pone rojas las 3 filas (`-29`, `-30`,
  `-30`); el resto de `reminder-dates.test.ts` sigue verde. El verde lo
  revierte: `git diff <verde de R3> -- src/utils/reminder-dates.ts` vacío.
- **Mutaciones que deben dejarlo rojo** (sondas del reviewer, sin versionar;
  medidas por él en `5b1cb8e9` con estas mismas filas): U8 (3 filas), U9 (3),
  U10 (2), U11 (fila 3, recibe `335`), U12 (fila 3, recibe `-364`), U15 (1).
- **Zonas**: medido por el leader el 2026-09-24 en las 419 zonas IANA del
  Node del VPS (más `UTC`): las filas 1 y 2 se construyen sin caer en un
  hueco de cambio de hora, dan `1` con la fórmula de D1 y U8 las pone rojas
  en todas.

### R6 — Los umbrales de la píldora (7) y del badge (10) no se aflojan

*(requisito de verificación sobre código ya correcto; rojo = mutación de
producción versionada en `src/screens/reminders/index.tsx`, revertida en el
verde; C4 quinto punto)*

**WHILE** la pantalla de recordatorios muestra recordatorios `scheduled`,
**THE SYSTEM SHALL** dejar fuera de la píldora «Esta semana» un recordatorio a
8 días, darle el badge «¡Próximo!», y no dar el badge a uno a 11 días.

- **Test**: `src/screens/reminders/index.test.tsx`, `describe` nuevo **al
  final del fichero**:
  `describe('#84 R6: los umbrales de la píldora y del badge no se aflojan (Enmienda E1)'`,
  con el **mismo arnés** que el `describe` de R3 (su `beforeEach` y
  `afterEach`: relojes falsos, hora del sistema `new Date(2026, 8, 10, 8, 0)`),
  y **un** `it`:
  `it('08:00 del 10 de septiembre: +8 días queda fuera de la semana con badge y +11 días queda sin badge')`.
  Recordatorios `scheduled` vía `makeReminder({ id, dueAt })`:
  `plus-eight` → `new Date(2026, 8, 18, 9, 0).toISOString()` y
  `plus-eleven` → `new Date(2026, 8, 21, 9, 0).toISOString()`.
- **Aserciones**: `within(getByTestId('reminder-row-plus-eight')).getByText('· en 8 días')`;
  `getByTestId('reminder-upcoming-plus-eight')` visible;
  `within(getByTestId('reminder-row-plus-eleven')).getByText('· en 11 días')`;
  `queryByTestId('reminder-upcoming-plus-eleven')` es `null`;
  `within(getByTestId('pill-week')).getByText('0')`.
- **Rojo versionado** en `src/screens/reminders/index.tsx`, en el mismo commit
  que el test: en la píldora `days <= 7` → `days <= 8` **y** en el badge
  (`{!inactive && days >= 0 && days <= 10 ? (`) `days <= 10` → `days <= 11`.
  El verde revierte las dos: `git diff origin/main -- mobile-pet-tracker/src/screens/reminders/index.tsx`
  **vacío** al final (D1 sigue valiendo: la pantalla no cambia).
- **Mutaciones que deben dejarlo rojo por separado** (sondas del reviewer):
  solo la de la píldora (S8) y solo la del badge (S9).

### Candado heredado que se mueve con E1 (H4)

En el **commit rojo de R5**, las filas de
`it.each(…)('returns a %s integer'` de
`describe('R4: reminder-dates combina y cuenta días'` pasan de instantes con
`Z` a componentes locales, **con los mismos esperados** (`0`, `1`, `-1`):

| Ancla actual | Pasa a |
|---|---|
| `const from = new Date('2026-08-24T09:00:00.000Z');` | `const from = new Date(2026, 7, 24, 9, 0, 0);` |
| `['zero', new Date('2026-08-24T09:00:00.000Z'), 0],` | `['zero', new Date(2026, 7, 24, 9, 0, 0), 0],` |
| `['positive', new Date('2026-08-25T09:00:01.000Z'), 1],` | `['positive', new Date(2026, 7, 25, 9, 0, 1), 1],` |
| `['negative', new Date('2026-08-23T08:59:59.000Z'), -1],` | `['negative', new Date(2026, 7, 23, 8, 59, 59), -1],` |

Medido por el leader en las 419 zonas: dan `0`, `1` y `-1` en todas. Con U8
siguen verdes (no es su trabajo cazarla: lo hace R5).

### Recuentos con E1

| Fichero | Delta total de #84 sobre la base medida al arrancar |
|---|---|
| `src/utils/reminder-dates.test.ts` | **+16** (R1 10 + R2 3 + R5 3) |
| `src/screens/reminders/index.test.tsx` | **+3** (R3 2 + R6 1) |
| Suite móvil | **+19 tests, +0 suites**: con la base de Codex en esta branch (82 / 1452), **82 / 1471** |
| `language-provider.test.tsx` y `ui-copy-table.ts` | **+0** (ninguna clave nueva) |

El grep de cierre de tasks.md sigue valiendo (`Date.UTC(` ×2; `Math.ceil`,
`getUTC`, `getTime` ×0 en `reminder-dates.ts`).

### Aprobación de la Enmienda E1

- [ ] Enmienda E1 aprobada por humano (fecha: ____) ← gate obligatorio antes de la ronda 2 de Codex
