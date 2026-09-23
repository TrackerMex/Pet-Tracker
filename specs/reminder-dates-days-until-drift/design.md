---
feature: "reminder-dates-days-until-drift"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Diseño — [[reminder-dates-days-until-drift]] (#84)

> Ver [[requirements]] para los requisitos y las premisas verificadas (§0), y
> [[../../docs/architecture|architecture]] para las capas. Rutas relativas a
> `mobile-pet-tracker/`. Anclas por contenido, nunca por número de línea.

## Carta de UI (`docs/ui-guidelines.md`, gate C8)

Esta feature **no cambia ninguna vista**: ni nodos, ni clases, ni copy, ni
animación, ni dimensiones. De C8 solo aplica el **grep-clean**, que se cumple
por no tocar ficheros de UI (el test nuevo de R3 sí cae bajo el guard de
clases arbitrarias de `design-drift.test.ts`: ver [[tasks]] §Antes de
empezar). De la carta aplica la **Enmienda #70** (elementos repetidos) en su
alcance exacto: de las doce decisiones por fila, esta feature solo mueve el
**dato que muestra** (la etiqueta) y una **condición de render** (el badge),
y R3 las canda por `within(fila)` en dos escenarios. Las otras diez no se
tocan y no se re-candan aquí.

Skills: `expo:expo-overview` cargada; ninguna hoja aplica (lógica pura, sin
UI, navegación, datos ni animación).

---

## Decisiones técnicas

### D1 — Arreglo en sitio de `daysUntil` (R1, R2, R3)

- **Firma sin cambios**: `export function daysUntil(from: Date, to: Date): number`
  en `src/utils/reminder-dates.ts`. `DAY_MS` sigue siendo `86_400_000`.
- **Cuerpo nuevo** (normativo en su semántica; Codex lo escribe): la
  diferencia entre `Date.UTC(to.getFullYear(), to.getMonth(), to.getDate())`
  y `Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())`, dividida
  por `DAY_MS`. Es la misma aritmética que `calendarDaysUntil` de
  `src/screens/home/format.ts` (#70): «medianoche civil local expresada en
  UTC», que no tiene horario de verano por construcción.
- **Sin `Math.round` ni normalización de `-0`**: la resta de dos `Date.UTC` de
  medianoche es un múltiplo exacto de `DAY_MS`, así que la división da un
  entero exacto, y `0 / DAY_MS` es `+0`. Nada que redondear, ningún `-0`
  posible. La fila 2 de R1 (`toBe(0)`, que usa `Object.is`) lo vigila.
  (`calendarDaysUntil` lleva las dos cosas; son inocuas allí y no se tocan.)
- **Qué pasa la pantalla**: lo mismo que hoy, sin cambio:
  `daysUntil(new Date(), new Date(reminder.dueAt))` en las dos llamadas.
  `reminder.dueAt` es un instante ISO con `Z` (el backend lo serializa con
  `reminder.dueAt.toISOString()` en
  `backend-pet-tracker/src/modules/reminders/infrastructure/mappers/reminder.mapper.ts`),
  así que `new Date(dueAt)` es un instante y sus getters locales dan el día
  civil **del dispositivo**, igual que `localDayOf` en la Home.
- **Por qué no `Math.round` sobre la resta de milisegundos**, que parece el
  arreglo mínimo: sigue dependiendo de la hora (de 00:00 a 23:59 da 1; de
  23:30 a 00:30 da 0; de 09:00 a 08:00 da `-0`). Las filas 2, 3 y 4 de R1 lo
  pillan.
- **Techo conocido**: una implementación con medianoches **locales**
  (`new Date(y, m, d)`) y `Math.ceil`/`Math.floor` pasaría todas las tablas y
  fallaría solo el día de un cambio de hora en una zona con horario de verano,
  cosa que ningún test puede fijar sin forzar la zona (D3). Por eso D1
  prescribe `Date.UTC` y el cierre lo comprueba por lectura
  ([[tasks]] §Cierre: dos `Date.UTC(` en el fichero, cero `Math.ceil`).

### D2 — No se unifica con `calendarDaysUntil` (criterio 4 de la entrada)

Evaluado; se descarta por coste y por dominio. Las dos funciones responden a
entradas distintas: `daysUntil` recibe **instantes** (`Date`), y
`calendarDaysUntil` recibe una **fecha civil** `'YYYY-MM-DD'` (p. ej.
`nextDoseAt` de una vacuna) que no puede pasar por `new Date(string)` sin
desplazarse un día en offset negativo. Las tres formas de dejar una sola
implementación:

| Alternativa | Qué exige | Por qué no |
|---|---|---|
| U1: la pantalla de recordatorios importa `calendarDaysUntil` y `localDayOf` de `../home/format` y se borra `daysUntil` | 2 llamadas + 1 import en `src/screens/reminders/index.tsx` | Primer import entre pantallas del repo (0 hoy, [[requirements]] P5); `docs/conventions.md` §Estructura Expo manda lo compartido a `src/utils/`. Y toca el fichero que #114 tiene vivo |
| U2: mover `calendarDaysUntil` y `localDayOf` a `src/utils/` y que las usen las dos pantallas | imports de `src/screens/home/index.tsx`, `src/screens/home/format.ts`, `src/screens/home/format.test.ts` y de la pantalla de recordatorios; borrar `daysUntil` y su test | Toca la Home (alcance ajeno, #70/#85 cerradas) y deja caducada la descripción de #115, que da por hecho que `calendarDaysUntil` vive en `src/screens/home/format.ts` |
| U3: `calendarDaysUntil` delega en `daysUntil(now, new Date(y, m - 1, d))` | `format.ts` | Pone rojo `#70 R5`: `expect(dateConstructor).not.toHaveBeenCalled()` y la lista exacta de llamadas a `Date.UTC` |

D1 cambia **un** cuerpo y **cero** firmas. La duplicación que queda son dos
líneas de aritmética con semántica idéntica y el test de cada una; se acepta y
se nombra en [[requirements]] §Fuera de alcance como deuda preexistente.

### D3 — Candado de zona horaria con los dobles de `#70 R5` (R2)

- **Qué se medía**: si `process.env.TZ = 'America/Mexico_City'` dentro de un
  test cambia la zona. **No** la cambia: con el jest 29.7 del repo,
  `getTimezoneOffset()` sigue en `0` en el VPS, porque jest da al sandbox una
  copia de `process.env` y el `TZ` real del proceso no se entera (sonda en el
  scratchpad, fuera del repo).
- **Forzar `TZ` en la config global** (script `test`, `globalSetup`) cambiaría
  el entorno de las 80 suites a la vez, en un repo que corre en UTC (VPS, CI)
  y en Windows (humano, sintaxis de `TZ=` distinta). Fuera de proporción para
  una P3.
- **Mecanismo elegido**: el de `describe('#70 R5: la zona horaria no desplaza fechas'`
  en `src/screens/home/format.test.ts`: objetos `as unknown as Date` cuyos
  getters locales y UTC caen en días distintos. Simulan un instante de
  Ciudad de México por la noche en **cualquier** host, sin espiar `Date`.
  #84 no espía `Date.UTC` (R2 asevera el resultado, no el mecanismo), así que
  los dobles solo necesitan los seis getters y `getTime` (tabla en
  [[requirements]] R2).
- **Por qué hace falta además de R1**: las fechas de R1 se construyen con
  componentes locales, así que en un host UTC —VPS y CI— local y UTC
  coinciden y la mutación `getUTC*` pasa R1 entera. Solo los dobles la ven en
  cualquier host.

### D4 — Sin fila de horario de verano (R1)

La tabla de R1 usa fechas del 9 al 20 de septiembre de 2026. Medido con el ICU
del Node del VPS: **ninguna** de las 418 zonas de
`Intl.supportedValuesOf('timeZone')` cambia de offset entre el 8 y el 22 de
septiembre de 2026, así que las tablas son deterministas en cualquier host.
Una fila de cambio de hora solo sería determinista forzando una zona con
horario de verano (D3 lo descarta), y el cuerpo de D1 no lo necesita: la
aritmética sobre `Date.UTC` no tiene cambios de hora.

### D5 — Orden y rojos (C4)

R1 tiene rojo natural (el defecto). R2 y R3 son **de verificación** sobre
código ya correcto y su rojo es una **mutación de producción versionada** en
el commit rojo y revertida en el verde (quinto punto de C4):

| R | Mutación en `src/utils/reminder-dates.ts` | Rojo que la delata |
|---|---|---|
| R2 | `getFullYear/getMonth/getDate` → `getUTCFullYear/getUTCMonth/getUTCDate` en `daysUntil` | las 3 filas de R2 en cualquier host |
| R3 | el cuerpo vuelve a `return Math.ceil((to.getTime() - from.getTime()) / DAY_MS);` | los 2 `it` de R3 (y también R1 y R2, que es lo esperado) |

Escribir R2 y R3 **antes** del verde de R1 también daría rojos reales (vía
(a) de C4), pero el de R2 sería por `Math.ceil`, no por la normalización UTC
que R2 existe para vigilar. La mutación versionada demuestra lo que cada
candado vigila.

### D6 — Arnés del test de pantalla (R3)

- Relojes falsos como `describe('R6: lista con pills, badges y refetch on focus'`:
  `jest.useFakeTimers()` + `jest.setSystemTime(new Date(2026, 8, 10, 8, 0))`
  en `beforeEach` (con el mismo `clearAllMocks`, `EXPO_PUBLIC_API_URL`,
  `mockUseAuth` y `mockListPets` que R6) y `jest.useRealTimers()` en
  `afterEach`. R6 ya prueba que `waitFor` y TanStack Query funcionan con ese
  arnés en este fichero.
- Hora con **componentes locales** (no un ISO con `Z`), para que «las 08:00 del
  10» sea la misma hora civil en cualquier host.
- `mockListReminders.mockResolvedValue({ kind: 'ok', reminders })`, esperar con
  `waitFor` a que la **última** fila esté visible y aseverar después.

---

## Archivos afectados

| Fichero | Capa | Cambio |
|---|---|---|
| `src/utils/reminder-dates.ts` | util de presentación (móvil) | cuerpo de `daysUntil` (D1). En los rojos de R2 y R3, la mutación versionada, revertida en su verde |
| `src/utils/reminder-dates.test.ts` | test | fila `positive` `2` → `1`; `describe` `#84 R1` (10 filas) y `#84 R2` (3 filas) |
| `src/screens/reminders/index.test.tsx` | test | `describe` `#84 R3` al final (2 `it`) |

**No cambian**: `src/screens/reminders/index.tsx`, `src/screens/home/*`,
`src/i18n/catalog.ts`, `src/__tests__/*`, `package.json`, `docs/`.

---

## Alternativas descartadas

- **U1, U2, U3 (unificar)**: D2.
- **`Math.round` sobre la resta de milisegundos**: D1.
- **Forzar `TZ` en el test o en la config de jest**: D3.
- **Espiar `Date.UTC` como `#70 R5`** para fijar el mecanismo: ata el test a
  la implementación sin vigilar nada que la tabla de resultados no vigile ya;
  R2 asevera resultados.
- **Añadir claves «Hoy»/«Mañana»/singular** para que la etiqueta no diga
  `· en 1 días`: cambio de producto con delta en el candado del catálogo
  (D4 de [[requirements]]).
- **Registrar ya la unificación de helpers de día civil como feature**: se
  deja nombrada como deuda en [[requirements]] §Fuera de alcance; decidir si
  se registra es del humano, y el id lo asigna el leader contra `origin/main`.
