---
feature: "mobile-date-picker-utc-day-shift"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-date-picker-utc-day-shift]] (#123)

> Disciplina TDD: por requisito, **(1) commit rojo → (2) commit verde →
> (3) refactor**, un commit por paso, **nunca implementación y test juntos**.
> Rutas relativas a `mobile-pet-tracker/`. Anclas por contenido (`grep -n`),
> nunca por número de línea. Todo `describe` nuevo lleva el prefijo
> `#123 R<n>:` (o `#123:` el padre). Mensajes en inglés:
> `test(date-picker): <desc> (Rn)` el rojo, `fix(date-picker): <desc> (Rn)` el
> verde, `refactor(date-picker): …` si lo hay, `docs(date-picker): …` el
> cierre. Actualizar [[traceability]] **tras cada commit**, no al final.

## Antes de empezar

- [ ] Branch `feature/123-mobile-date-picker-utc-day-shift` y
      `git merge-base --is-ancestor 70f841f3 HEAD; echo "exit=$?"` → `exit=0`.
- [ ] `test ! -e .expo/types/router.d.ts; echo "exit=$?"` → `exit=0`. Si da
      `1`, **parar y pedir al humano** que lo borre (gitignorado, rompe `tsc`;
      el sandbox de Codex deniega `rm -f`, #121).
- [ ] **No lanzar `./init.sh`** (Postgres y LocalStack compartidos entre
      worktrees). Esta feature se verifica con jest, tsc y lint (§Cierre).
- [ ] Medir y **anotar en el reporte** las bases, sin pipe:
      `bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx; echo "exit=$?"`
      (21 en `70f841f3`),
      `bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx; echo "exit=$?"`
      (20) y `bun run test; echo "exit=$?"` (82 suites / 1471 tests). Los
      deltas de esta spec (+12 en el fichero nuevo, +4, +4, +1 suite) van
      **sobre esa base**.
- [ ] Código de test nuevo: nada de la forma `<palabra>-[` (el guard
      `describe('C8: la UI no usa clases arbitrarias'` de
      `src/__tests__/design-drift.test.ts` lee también los tests colocados).
- [ ] Sin comentarios nuevos en producción. Sin dependencias nuevas. Sin tocar
      `node_modules/`.
- [ ] Skills (nombres de Claude; el leader da los de Codex en el handoff):
      `expo-overview` → `expo-ui`.

## Orden y por qué (candado del sujeto ausente)

`R1 → R2 → R3 → R4 → R5 → R6 → R7`, y R8 (humano) al final.

- R1 **crea** el módulo con el esqueleto de `fromPickerValue`; R2 **añade** el
  esqueleto de `toPickerValue`. Ningún rojo falla por `Cannot find module` ni
  por `ReferenceError`: cada rojo trae el símbolo que usa por primera vez.
- R3 va después de R1 y R2 para que su rojo sea natural: sus verdes convierten
  sin mirar la plataforma ([[design]] D8).
- R4-R7 aseveran nodos que ya existen en `70f841f3` (`date-field`,
  `date-picker`, `time-field`, `time-picker`, `add-reminder-submit`,
  `birth-date-field`, `birth-date-picker`, `name-input`, `add-pet-submit`) y
  usan un helper que ya existe tras R3.
- El helper de test `wallClock` y el de plataforma `setPlatform` entran en el
  commit rojo **donde se usan por primera vez** en cada fichero (R1 en el
  fichero nuevo, R4 en add-reminder, R6 en add-pet).

---

## R1 — `fromPickerValue` convierte el día UTC del diálogo en día local

- [ ] **(1) Commit rojo** `test(date-picker): convert the dialog UTC day to the local day (R1)`.
  - `src/utils/date-picker-value.ts` (nuevo), **esqueleto**:
    `export function fromPickerValue(picked: Date): Date` que devuelve
    `picked` (lo que hace hoy la app).
  - `src/utils/date-picker-value.test.ts` (nuevo): imports de `Platform`
    (`react-native`) y de `fromPickerValue`; `const originalPlatform = Platform.OS;`;
    `function setPlatform(os: string): void` ([[design]] D6);
    `function wallClock(local, utc)` ([[requirements]] §Requisitos, «Dobles
    de zona»); y
    `describe('#123 R1: en Android, fromPickerValue convierte el día UTC del diálogo en día local'`
    con `beforeEach(() => setPlatform('android'))`,
    `afterEach(() => setPlatform(originalPlatform))` y **un** `it.each` de 5
    filas `[título, local, utc, esperado]`, título `'%s'`, cuerpo
    `const r = fromPickerValue(wallClock(local, utc)); expect([r.getFullYear(), r.getMonth(), r.getDate()]).toEqual(esperado);`.
    Filas, títulos y valores: tabla de [[requirements]] R1, literal.
  Rojo esperado: filas 1-4, por aserción, en cualquier host; la fila 5
  (Kiritimati) queda **verde** con el esqueleto (día local = día UTC: fila de
  regresión).
- [ ] **(2) Commit verde** `fix(date-picker): read the UTC day from the Android dialog (R1)`.
  Solo `src/utils/date-picker-value.ts`: `fromPickerValue` devuelve
  `new Date(picked.getUTCFullYear(), picked.getUTCMonth(), picked.getUTCDate())`
  (sin puerta de plataforma todavía: es R3).
- [ ] **(3) Refactor**: ninguno previsto.

## R2 — `toPickerValue` abre el diálogo en el día local

- [ ] **(1) Commit rojo** `test(date-picker): open the dialog on the local day (R2)`.
  - `src/utils/date-picker-value.ts`: **esqueleto**
    `export function toPickerValue(day: Date): Date` que devuelve `day`.
  - Test: `describe('#123 R2: en Android, toPickerValue abre el diálogo en el día local'`
    con el mismo `beforeEach`/`afterEach` de plataforma que R1 y **un**
    `it.each` de 5 filas `[título, local, utc, esperado]`, título `'%s'`,
    cuerpo `expect(toPickerValue(wallClock(local, utc)).toISOString()).toBe(esperado);`.
    Tabla de [[requirements]] R2, literal.
  Rojo esperado **en el VPS**: filas 1, 2, 3 y 5 por aserción; fila 4 verde
  (host UTC: ver [[requirements]] R2). En un host de Ciudad de México, las 5.
- [ ] **(2) Commit verde** `fix(date-picker): send the local day at UTC midnight to the Android dialog (R2)`.
  `toPickerValue` devuelve
  `new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()))`.
- [ ] **(3) Refactor**: ninguno previsto.

## R3 — Fuera de Android no se convierte

- [ ] **(1) Commit rojo** `test(date-picker): leave non-Android picker values untouched (R3)`.
  Test: `describe('#123 R3: fuera de Android las dos conversiones devuelven el mismo objeto'`
  con `beforeEach(() => setPlatform('ios'))`, `afterEach` que restaura, y los
  dos `it` literales de [[requirements]] R3 (`toBe`). Sin cambios de
  producción.
  Rojo esperado: los 2 `it`, por aserción (otro objeto).
- [ ] **(2) Commit verde** `fix(date-picker): convert only on Android (R3)`.
  `import { Platform } from 'react-native';` y, como primera línea de cada
  función, `if (Platform.OS !== 'android') return <argumento>;`.
  Verde: el fichero entero (12 tests).
- [ ] **(3) Refactor**: ninguno previsto.

## R4 — Nuevo recordatorio muestra y guarda el día elegido

- [ ] **(1) Commit rojo** `test(add-reminder): show and save the picked day on Android (R4)`.
  `src/screens/add-reminder/index.test.tsx`:
  - `import { Platform } from 'react-native';` arriba;
  - **al final del fichero** (después de
    `describe('#95 R5: la pantalla no dibuja cabecera propia'`): helpers
    `originalPlatform`, `setPlatform`, `wallClock` (mismos que el fichero del
    util, declarados aquí), el `describe` padre
    `describe('#123: pickers de fecha de Nuevo recordatorio en Android a las 20:00 del 24 de septiembre'`
    con el arnés de [[design]] D7 y, dentro, el hijo
    `describe('#123 R4: Nuevo recordatorio muestra y guarda el día elegido'`
    con **un** `it.each` de 3 filas `[título, local, utc, etiqueta, dueAt]`,
    título `'%s'`, pasos 1-5 y tabla de [[requirements]] R4, literal.
  Sin cambios de producción. Rojo esperado: las 3 filas, por la etiqueta
  (`'23/9/2026'`, `'30/9/2026'`, `'31/12/2026'`); los 21 tests previos
  verdes.
- [ ] **(2) Commit verde** `fix(add-reminder): store the picked day through fromPickerValue (R4)`.
  `src/screens/add-reminder/index.tsx`:
  `import { fromPickerValue } from '../../utils/date-picker-value';` (solo
  ese símbolo: `toPickerValue` entra en R5, para no dejar un import sin uso),
  y
  `setDate(selectedDate);` → `setDate(fromPickerValue(selectedDate));` en el
  `<ExpoDateTimePicker` de `testID="date-picker"`. Nada más.
- [ ] **(3) Refactor**: ninguno previsto.

## R5 — El calendario de Nuevo recordatorio abre en el día local

- [ ] **(1) Commit rojo** `test(add-reminder): open the date dialog on the local day on Android (R5)`.
  Dentro del mismo `describe` padre de R4, el hijo
  `describe('#123 R5: el calendario de Nuevo recordatorio abre en el día local; el mínimo y la hora no se convierten'`
  con el `it` literal de [[requirements]] R5 (pasos 1-3). Sin cambios de
  producción. Rojo esperado: el `it`, por la aserción de `value`
  (`'2026-09-24T20:00:00.000Z'` en el VPS).
- [ ] **(2) Commit verde** `fix(add-reminder): open the date dialog through toPickerValue (R5)`.
  El import pasa a `import { fromPickerValue, toPickerValue } from '../../utils/date-picker-value';`
  y `value={date ?? new Date()}` → `value={toPickerValue(date ?? new Date())}`.
  `minimumDate={new Date()}` y el picker de hora **no** cambian.
- [ ] **(3) Refactor**: ninguno previsto.

## R6 — Añadir mascota muestra y manda el día de nacimiento elegido

- [ ] **(1) Commit rojo** `test(add-pet): show and send the picked birth date on Android (R6)`.
  `src/screens/add-pet/index.test.tsx`:
  - `import { Platform } from 'react-native';` arriba;
  - **al final del fichero** (después de
    `describe('#95 R6: métricas bajo cabecera nativa'`): helpers
    `originalPlatform`, `setPlatform`, `wallClock`, el `describe` padre
    `describe('#123: picker de nacimiento de Añadir mascota en Android a las 20:00 del 24 de septiembre'`
    con el arnés de [[design]] D7 y el hijo
    `describe('#123 R6: Añadir mascota muestra y manda el día de nacimiento elegido'`
    con **un** `it.each` de 3 filas `[título, local, utc, etiqueta, birthDate]`,
    título `'%s'`, pasos 1-4 y tabla de [[requirements]] R6, literal.
  Sin cambios de producción. Rojo esperado: las 3 filas, por la etiqueta; los
  20 tests previos verdes (incluido `#90 R6`).
- [ ] **(2) Commit verde** `fix(add-pet): store the picked birth date through fromPickerValue (R6)`.
  `src/screens/add-pet/index.tsx`:
  `import { fromPickerValue } from '../../utils/date-picker-value';` (solo
  ese símbolo; `toPickerValue` entra en R7) y
  `setBirthDate(selectedDate);` → `setBirthDate(fromPickerValue(selectedDate));`.
  `dateToIso` **no** cambia.
- [ ] **(3) Refactor**: ninguno previsto.

## R7 — El calendario de nacimiento abre en el día local

- [ ] **(1) Commit rojo** `test(add-pet): open the birth date dialog on the local day on Android (R7)`.
  Dentro del mismo `describe` padre de R6, el hijo
  `describe('#123 R7: el calendario de nacimiento abre en el día local y el máximo no se convierte'`
  con el `it` literal de [[requirements]] R7. Rojo esperado: el `it`, por la
  aserción de `value`.
- [ ] **(2) Commit verde** `fix(add-pet): open the birth date dialog through toPickerValue (R7)`.
  El import pasa a `import { fromPickerValue, toPickerValue } from '../../utils/date-picker-value';`
  y `value={birthDate ?? new Date()}` → `value={toPickerValue(birthDate ?? new Date())}`.
  `maximumDate={new Date()}` **no** cambia.
- [ ] **(3) Refactor**: ninguno previsto.

## R8 — Smoke en dev build de Android (humano)

- [ ] Lo corre el humano tras el veredicto del `reviewer`, con los pasos de
      [[requirements]] §Prueba de humo, y firma su casilla allí. Codex no lo
      marca.

---

## Sondas (no se commitean; cada una roja y restaurada con `git diff` vacío)

Las corre Codex antes del cierre y las repite el `reviewer`. Anotar en el
reporte cuántos tests se ponen rojos con cada una.

- **Helper** (`src/utils/date-picker-value.ts`): F0b, F1, F2, F3, F5, F6, F7, F8,
  F9 de [[requirements]] R1; T1, T2, T3, T6, T7, T9 de R2; quitar la puerta en una
  sola función (R3).
- **add-reminder**: `toPickerValue` en lugar de `fromPickerValue` en el
  `onValueChange` de fecha (R4, 3 filas); `setTime(fromPickerValue(selectedTime))`
  (R4, 3 filas); `minimumDate={toPickerValue(new Date())}` (R5);
  `value={toPickerValue(time)}` en `time-picker` (R5).
- **add-pet**: `toPickerValue` en lugar de `fromPickerValue` (R6, 3 filas);
  `maximumDate={toPickerValue(new Date())}` (R7); quitar la puerta de
  plataforma del helper (debe poner rojo `#90 R6`, [[requirements]] C3).

---

## Cierre (Codex, antes de escribir `progress/impl_mobile-date-picker-utc-day-shift.md`)

Todo **sin pipe** (el código de salida de un pipe es el del último comando):

- [ ] `bunx jest --runTestsByPath src/utils/date-picker-value.test.ts src/screens/add-reminder/index.test.tsx src/screens/add-pet/index.test.tsx; echo "exit=$?"`
      → `exit=0`; **12**, base + 4 y base + 4 tests.
- [ ] `bun run test; echo "exit=$?"` → `exit=0`, **+1 suite y +20 tests**
      sobre la base medida al arrancar (con `70f841f3`: 83 / 1491).
- [ ] `bunx tsc --noEmit; echo "exit=$?"` y `bun run lint; echo "exit=$?"` →
      `exit=0`.
- [ ] Helper: `grep -c "Date.UTC(" src/utils/date-picker-value.ts` → `1`;
      `grep -o "getUTC[A-Za-z]*()" src/utils/date-picker-value.ts` → las tres
      (`getUTCFullYear()`, `getUTCMonth()`, `getUTCDate()`), una vez cada una;
      `grep -c "Platform.OS !== 'android'" src/utils/date-picker-value.ts` → `2`;
      `grep -c "getTime\|getTimezoneOffset\|toISOString\|getHours" src/utils/date-picker-value.ts` → `0`.
- [ ] Pantallas: `grep -c "PickerValue(" src/screens/add-reminder/index.tsx`
      → `2` y lo mismo en `src/screens/add-pet/index.tsx`;
      `grep -c "minimumDate={new Date()}" src/screens/add-reminder/index.tsx`
      → `1`; `grep -c "maximumDate={new Date()}" src/screens/add-pet/index.tsx`
      → `1`; `grep -c "getUTC" src/screens/add-reminder/index.tsx src/screens/add-pet/index.tsx`
      → `0` en los dos.
- [ ] `git diff --stat origin/main...HEAD -- mobile-pet-tracker` → exactamente
      los seis ficheros de [[design]] §Archivos afectados (ni `package.json`,
      ni `bun.lock`, ni `patches/`: cero dependencias y cero parches).
- [ ] [[traceability]] con los catorce hashes, y el reporte con las sondas.
