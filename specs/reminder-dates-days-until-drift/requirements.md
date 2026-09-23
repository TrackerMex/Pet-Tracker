---
feature: "reminder-dates-days-until-drift"
status: spec_ready       # draft | spec_ready | approved
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

- [ ] Spec aprobada por humano (fecha: ____)
