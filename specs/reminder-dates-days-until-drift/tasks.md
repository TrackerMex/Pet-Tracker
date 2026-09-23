---
feature: "reminder-dates-days-until-drift"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Tareas — [[reminder-dates-days-until-drift]] (#84)

> Disciplina TDD: por requisito, **(1) commit rojo → (2) commit verde →
> (3) refactor**, un commit por paso, nunca implementación y test juntos.
> Rutas relativas a `mobile-pet-tracker/`. Anclas por contenido (`grep -n`),
> nunca por número de línea. Todo `describe` nuevo lleva el prefijo
> `#84 R<n>:` (los dos ficheros ya tienen R-ids desnudos de otra spec).
> Mensajes: `test(reminder-dates): <desc> (Rn)` el rojo,
> `feat(reminder-dates): <desc> (Rn)` el verde, `refactor(reminder-dates): …`
> si lo hay, `docs(reminder-dates): …` el cierre.

## Antes de empezar

- [ ] **#114 mergeada y esta branch rebasada.** `git fetch origin` y
      `git merge-base --is-ancestor origin/main HEAD; echo $?` → `0`, y
      `git log origin/main --oneline | grep -c "#158"` ≥ 1 (el merge de la
      PR de #114). Si #114 no está en `main` o esta branch no la contiene,
      **parar y avisar al leader**, que rebasa antes del primer commit (nunca
      después de rellenar [[traceability]]).
- [ ] `rm -f .expo/types/router.d.ts` (gitignorado; rompe `tsc`).
- [ ] **No lanzar `./init.sh`** (Postgres y LocalStack compartidos). Esta
      feature se verifica con jest, tsc y lint (§Cierre).
- [ ] Medir y **anotar en el reporte** las bases, sin pipe:
      `bunx jest --runTestsByPath src/utils/reminder-dates.test.ts; echo "exit=$?"`
      (4 tests en `446f5581`) y
      `bunx jest --runTestsByPath src/screens/reminders/index.test.tsx; echo "exit=$?"`
      (25 en `446f5581`; 26 esperados con #114). Los deltas de esta spec
      (+13 y +2) van **sobre esa base**.
- [ ] Código de test nuevo: nada de la forma `<palabra>-[` (el guard
      `describe('C8: la UI no usa clases arbitrarias'` de
      `src/__tests__/design-drift.test.ts` lee también los tests colocados).
- [ ] Sin comentarios nuevos en producción.

## Orden y por qué (candado del sujeto ausente)

`R1 → R2 → R3`, y R4 (humano) al final. Ningún test asevera un nodo que no
exista: `daysUntil` existe desde siempre, y `pill-week`,
`reminder-row-<id>` y `reminder-upcoming-<id>` ya existen en la pantalla en
`446f5581` y #114 no los toca. **R2 y R3 son requisitos de verificación** (C4 (b) + quinto punto): su
rojo es una mutación de producción versionada en el rojo y revertida en el
verde ([[design]] D5). Ningún rojo puede fallar por `ReferenceError`: el
helper de dobles de R2 entra en el mismo commit donde se usa por primera vez.

---

## R1 — `daysUntil` cuenta días de calendario locales

- [ ] **(1) Commit rojo** `test(reminder-dates): count local calendar days, not 24 h blocks (R1)`.
  En `src/utils/reminder-dates.test.ts`:
  - fila `['positive', new Date('2026-08-25T09:00:01.000Z'), 2],` → esperado `1`;
  - `describe('#84 R1: daysUntil cuenta días de calendario locales, no bloques de 24 h'`
    al final del fichero, con **un** `it.each` de 10 filas
    `[título, from, to, esperado]` y título `'%s'`, cuerpo
    `expect(daysUntil(from, to)).toBe(esperado)`. Filas, títulos y fechas:
    tabla de [[requirements]] R1, literal. Fechas con
    `new Date(2026, 8, día, hora, minuto)` (mes índice 8 = septiembre).
  Rojo esperado: filas 1, 2, 3, 6, 7, 9, 10 de R1 y la fila `positive`, por
  aserción. Filas 4, 5, 8 verdes.
- [ ] **(2) Commit verde** `feat(reminder-dates): subtract local civil days in daysUntil (R1)`.
  Solo `src/utils/reminder-dates.ts`: el cuerpo de `daysUntil` según
  [[design]] D1 (resta de dos `Date.UTC(getFullYear(), getMonth(), getDate())`
  dividida por `DAY_MS`; sin `Math.round`, sin `Math.ceil`). Firma igual.
  Verde: el fichero entero, y `src/screens/reminders/index.test.tsx` sin
  tocar.
- [ ] **(3) Refactor**: ninguno previsto.

## R2 — La zona horaria no desplaza la cuenta

- [ ] **(1) Commit rojo** `test(reminder-dates): lock local civil day against UTC skew (R2)`.
  - `src/utils/reminder-dates.test.ts`:
    `describe('#84 R2: la zona horaria no desplaza la cuenta de días'` al
    final, con un helper local que construye los dobles `A`, `B`, `C` de
    [[requirements]] R2 (forma de los `skewed` de `#70 R5` en
    `src/screens/home/format.test.ts`: `getFullYear`, `getMonth`,
    `getDate` locales; `getUTCFullYear`, `getUTCMonth`, `getUTCDate` y
    `getTime` del instante ISO de la tabla; `as unknown as Date`), y **un**
    `it.each` de 3 filas con título `'%s'` y
    `expect(daysUntil(from, to)).toBe(esperado)`. Títulos literales de la
    tabla.
  - **Mutación versionada** en `src/utils/reminder-dates.ts`: en `daysUntil`,
    `getFullYear()` → `getUTCFullYear()`, `getMonth()` → `getUTCMonth()`,
    `getDate()` → `getUTCDate()`, las seis llamadas.
  Rojo esperado: las 3 filas de R2, por aserción. En el VPS (UTC) el resto
  del fichero sigue verde; en un host de offset negativo las filas 3 y 4 de
  R1 también fallan, y es lo esperado ([[design]] D3).
- [ ] **(2) Commit verde** `feat(reminder-dates): revert the R2 probe mutation, local getters locked (R2)`.
  Revertir la mutación: `git diff <commit verde de R1> -- src/utils/reminder-dates.ts`
  queda **vacío**.
- [ ] **(3) Refactor**: ninguno previsto.

## R3 — La pantalla cuenta días de calendario en sus tres decisiones

- [ ] **(1) Commit rojo** `test(reminders): lock calendar days in week pill, badge and label (R3)`.
  - `src/screens/reminders/index.test.tsx`, **al final del fichero**:
    `describe('#84 R3: recordatorios cuenta días de calendario en la píldora, el badge y la etiqueta'`
    con el arnés de [[design]] D6 y dos `it`:
    - `it('08:00 del 10 de septiembre: hoy a las 20:00, +7 y +10 días a las 09:00 cuentan 0, 7 y 10')`:
      recordatorios `today-later` (`new Date(2026, 8, 10, 20, 0).toISOString()`),
      `week-edge` (`new Date(2026, 8, 17, 9, 0)`), `badge-edge`
      (`new Date(2026, 8, 20, 9, 0)`), todos `makeReminder({ id, dueAt })`.
      Aserciones: `within(getByTestId('reminder-row-today-later')).getByText('· en 0 días')`,
      ídem `'· en 7 días'` y `'· en 10 días'` en sus filas;
      `getByTestId('reminder-upcoming-<id>')` visible para los tres;
      `within(getByTestId('pill-week')).getByText('2')`.
    - `it('08:00 del 10 de septiembre: ayer a las 09:00 no es de esta semana ni próximo')`:
      solo `yesterday-later` (`new Date(2026, 8, 9, 9, 0).toISOString()`).
      Aserciones: `within(fila).getByText('· en -1 días')`,
      `queryByTestId('reminder-upcoming-yesterday-later')` es `null`,
      `within(getByTestId('pill-week')).getByText('0')`.
  - **Mutación versionada** en `src/utils/reminder-dates.ts`: el cuerpo de
    `daysUntil` vuelve a `return Math.ceil((to.getTime() - from.getTime()) / DAY_MS);`.
  Rojo esperado: los dos `it` de R3, por aserción (y R1 y R2 en el otro
  fichero, que es lo esperado con esa mutación).
- [ ] **(2) Commit verde** `feat(reminder-dates): revert the R3 probe mutation, screen locked (R3)`.
  Revertir: `git diff <commit verde de R2> -- src/utils/reminder-dates.ts`
  queda **vacío**.
- [ ] **(3) Refactor**: ninguno previsto.

## R4 — Smoke en dev build de Android (humano)

- [ ] Lo corre el humano tras el veredicto del `reviewer`, con los pasos de
      [[requirements]] §Prueba de humo, y firma su casilla allí. Codex no lo
      marca.

---

## Cierre (Codex, antes de escribir `progress/impl_reminder-dates-days-until-drift.md`)

Todo **sin pipe** (el código de salida de un pipe es el del último comando):

- [ ] `bunx jest --runTestsByPath src/utils/reminder-dates.test.ts src/screens/reminders/index.test.tsx src/screens/home/format.test.ts; echo "exit=$?"`
      → `exit=0`; recuentos = base + 13 y base + 2; `format.test.ts` sin
      cambio.
- [ ] `bun run test; echo "exit=$?"` → `exit=0`, **+15 tests y +0 suites**
      sobre la base de la suite móvil medida al arrancar.
- [ ] `bunx tsc --noEmit; echo "exit=$?"` y `bun run lint; echo "exit=$?"` →
      `exit=0`.
- [ ] `grep -c "Date.UTC(" src/utils/reminder-dates.ts` → `2`;
      `grep -c "Math.ceil\|getUTC\|getTime" src/utils/reminder-dates.ts` → `0`.
- [ ] `git diff --stat origin/main...HEAD -- mobile-pet-tracker` → exactamente
      los tres ficheros de [[design]] §Archivos afectados.
- [ ] Rellenar [[traceability]] con los seis hashes y las mutaciones.
