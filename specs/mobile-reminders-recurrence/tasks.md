---
feature: "mobile-reminders-recurrence"
status: draft        # draft | approved
tags: [mobile, reminders, recurrence, spec]
---

# Tareas — [[mobile-reminders-recurrence]] (#213)

> Disciplina TDD. Cada requisito de [[requirements]] tiene sus tres pasos.
> **Commits test-primero obligatorios**: por cada grupo, primero un commit
> `test(mobile): … (R<n>)` con el test en rojo y después un commit
> `feat(mobile): … (R<n>)` con la implementación; nunca test e implementación
> en el mismo commit (C4 de `CHECKPOINTS.md`). Rutas relativas a
> `mobile-pet-tracker/`. Comandos con `cd` explícito y `bunx`, nunca `npx`.
> Rutas con corchetes o paréntesis no se pasan como posicional a jest.

## Paso 0 — base

- [ ] `git -C /home/claude/sites/Pet-Tracker-wt-213 merge origin/dev` (merge,
  nunca rebase). Después:
  `grep -cF "backgroundStyle" /home/claude/sites/Pet-Tracker-wt-213/mobile-pet-tracker/src/screens/reminders/index.tsx`
  debe imprimir `1` (#218 ya en `dev`). Si imprime `0`, parar y anotarlo en
  `progress/impl_mobile-reminders-recurrence.md` (ver `design.md` §Orden de
  merge); no implementar R19.
- [ ] Si el merge trae #208 o #209, re-medir las expresiones de mano de
  `#194 R1` y `#186 R5` sumando sus deltas antes de añadir el de R22.

## R1 — tipos `Recurrence` y campos de `Reminder`

- [ ] (1) Test rojo `#213 R1: listReminders conserva recurrence y recurrenceUntil del backend` en `src/api/__tests__/reminders.test.ts`.
- [ ] (2) `Recurrence` y campos obligatorios en `src/api/types.ts`; añadir `recurrence: null, recurrenceUntil: null` a los fixtures tipados de `design.md` §Datos; `cd /home/claude/sites/Pet-Tracker-wt-213/mobile-pet-tracker && bunx tsc --noEmit` en 0.
- [ ] (3) Refactor con tests verdes.

## R2 — cuerpo de `createReminder`

- [ ] (1) Test rojo `#213 R2: createReminder envía el cuerpo %s`.
- [ ] (2) Spread condicional de `recurrence` y `recurrenceUntil`; los tests de cuerpo exacto existentes siguen verdes sin tocarlos.
- [ ] (3) Refactor.

## R3 — `cancelReminderSeries`

- [ ] (1) Tests rojos `#213 R3: …` (mapeo, PATCH y sin baseUrl).
- [ ] (2) Función y `CancelReminderSeriesState` con `patchJson`.
- [ ] (3) Refactor (sin extraer helper común con `deleteReminder`).

## R4 — chips de Repetición

- [ ] (1) Tests rojos `#213 R4: …`. El doble de reicon del fichero añade `Repeat`, `Minus` y `Plus` con testID `add-reminder-icon-repeat`, `add-reminder-icon-minus`, `add-reminder-icon-plus`.
- [ ] (2) `REPEAT_OPTIONS` con `labelKey`, estado `repeat`, sección entre Fecha/Hora y Aviso.
- [ ] (3) Refactor.

## R5 — filas horizontales de Tipo y Aviso

- [ ] (1) Test rojo `#213 R5: Tipo y Aviso son filas horizontales sin salto de línea`.
- [ ] (2) `ScrollView horizontal` `type-chip-row` y `advance-chip-row` (`design.md` §Formulario). Ancla: `grep -cF "flex-row flex-wrap gap-2" src/screens/add-reminder/index.tsx` = 1.
- [ ] (3) Refactor.

## R6 — stepper de horas

- [ ] (1) Tests rojos `#213 R6: …`.
- [ ] (2) Stepper con `hourEvery` (8, límites 1–24), receta de `design.md`.
- [ ] (3) Refactor.

## R7 — stepper de meses y ausencia del stepper

- [ ] (1) Tests rojos `#213 R7: …`.
- [ ] (2) Mismo bloque con `monthEvery` (1, límites 1–12).
- [ ] (3) Refactor.

## R8 — Hasta

- [ ] (1) Tests rojos `#213 R8: …` (con `until-picker` y `until-field-clear`).
- [ ] (2) Sección «Hasta» con `DateField allowClear`; vaciado al mover la fecha.
- [ ] (3) Refactor.

## R9 — Aviso oculto con «Cada N horas»

- [ ] (1) Test rojo `#213 R9: Cada N horas oculta Aviso y envía advanceMinutes 0`.
- [ ] (2) Render condicional y `advanceMinutes: 0`.
- [ ] (3) Refactor.

## R10 — cuerpo al guardar

- [ ] (1) Test rojo `#213 R10: guarda %s con su cuerpo exacto`.
- [ ] (2) `handleSubmit` pasa `recurrence` / `recurrenceUntil` según el chip.
- [ ] (3) Refactor.

## R11 — frases de la nota por unidad

- [ ] (1) Tests rojos `#213 R11: …` con la tabla a–j de `requirements.md` (TZ y timers como `#178 R12`).
- [ ] (2) `summaryText(...)` y cambio de icono `Repeat` / `Bell`.
- [ ] (3) Refactor.

## R12 — tomas de «Cada N horas»

- [ ] (1) Test rojo `#213 R12: con %i horas la nota dice «%s»` (tabla a–h).
- [ ] (2) Regla N ∈ {6, 8, 12, 24} y frases de intervalo; unión con `addReminder.dosesJoin`.
- [ ] (3) Refactor.

## R13 — nombre de la mascota

- [ ] (1) Test rojo `#213 R13: sin nombre de mascota la nota usa la variante sin nombre`. El render del fichero gana `QueryClientProvider` y el doble de `listPets` con `beforeEach` de nivel superior; los tests existentes del fichero siguen verdes.
- [ ] (2) `useQuery(petKeys.list())` y variante `summaryHoursDosesNoPet`.
- [ ] (3) Refactor.

## R14 — línea «Se repite …»

- [ ] (1) Tests rojos `#213 R14: …` (tabla a–j, hoy 30 dic 2026). El doble de reicon del fichero añade `Repeat: mockIcon('reminders-icon-repeat')`; `makeReminder` gana `recurrence: null, recurrenceUntil: null`; el doble de `../../api/reminders` gana `cancelReminderSeries: jest.fn()`.
- [ ] (2) `cadenceText(...)` y línea con `isoToLocalDate` para el hasta.
- [ ] (3) Refactor.

## R15 — Cancelar serie / Eliminar

- [ ] (1) Tests rojos `#213 R15: …`.
- [ ] (2) Un solo `<Button>` con testID, texto, etiqueta y `onPress` según el caso. Ancla: `grep -cF "rounded-14 px-2.5" src/screens/reminders/index.tsx` = 1.
- [ ] (3) Refactor.

## R16 — badge «Hoy»

- [ ] (1) Test rojo `#213 R16: el badge Hoy y el borde ámbar solo marcan el día de hoy`.
- [ ] (2) `upcoming = !inactive && days === 0`; `reminders.upcoming` = «Hoy» / «Today».
- [ ] (3) Enmendar en `src/screens/reminders/index.test.tsx`, añadiendo «(enmendado por #213 R16)» al nombre, estos tests del umbral de 10 días: el fixture que espera badge pasa al mismo día local que `now` (hora posterior) y `'¡Próximo!'` pasa a `'Hoy'`; las filas a 1–10 días que esperaban badge pasan a esperar `null`:
  - `R6: lista con pills, badges y refetch on focus` :: `renders summaries and reminder rows in API order`
  - `#84 R3: …` :: `08:00 del 10 de septiembre: hoy a las 20:00, +7 y +10 días a las 09:00 cuentan 0, 7 y 10` (solo `today-later` conserva badge)
  - `#84 R6: …` :: `08:00 del 10 de septiembre: +8 días queda fuera de la semana con badge y +11 días queda sin badge` (`plus-eight` sin badge)
  - `#178 R6: fila del canvas` :: `distingue las recetas de fila próxima, lejana e inactiva (enmendado por #204 R7)`
  - `#178 R7: entrada escalonada y badge` :: `envuelve el badge próximo con PopIn y la receta del canvas (enmendado por #204 R7)`
  - `#204 R7: ámbar de la fila próxima` :: `#204 R7: la fila próxima y su badge usan el ámbar del canvas`
  Cualquier otro test que caiga solo por el umbral se enmienda con la misma regla y se lista en `progress/impl_mobile-reminders-recurrence.md`. Ancla: `grep -cF "¡Próximo!" src/screens/reminders/index.test.tsx src/i18n/catalog.ts` = 0 en ambos.

## R17 — hoja «Cancelar serie»

- [ ] (1) Tests rojos `#213 R17: …` (mascotas: «Rocky» para el cuerpo con nombre; `listPets` sin la mascota para la variante sin nombre).
- [ ] (2) `cancelCandidate`, hoja hermana dentro del único `BottomSheetView`, `index` y `onClose` compartidos.
- [ ] (3) Refactor. Ancla: `grep -cF "<BottomSheet" src/screens/reminders/index.tsx` = 1.

## R18 — confirmar y errores

- [ ] (1) Tests rojos `#213 R18: …`.
- [ ] (2) `handleCancelSeries` con `useQueryClient().invalidateQueries`.
- [ ] (3) Refactor.

## R19 — fondo heredado de #218

- [ ] (1) Test rojo `#213 R19: la hoja Cancelar serie hereda el fondo surface de #218` (misma consulta del `community-bottom-sheet` que usa `#218 R1`). Solo si el Paso 0 dio `1`.
- [ ] (2) Ninguna implementación extra si R17 comparte el `BottomSheet`; si el test nace verde, anotarlo en el impl como «verde por R17 + #218».
- [ ] (3) Refactor.

## R20 — `notificationHref` de recordatorios

- [ ] (1) Test rojo `#213 R20: …` en `src/hooks/use-push-registration.test.tsx`, un `describe` nuevo que copia el cuerpo del it.each de `#100 R7` (la tabla de `#100 R7` no se toca).
- [ ] (2) Rama `kind === 'reminder'` en `notificationHref`.
- [ ] (3) Refactor.

## R21 — parámetro `petId`

- [ ] (1) Tests rojos `#213 R21: …`. El doble de `expo-router` del fichero gana `useLocalSearchParams: () => mockSearchParams` con `let mockSearchParams: Record<string, unknown> = {}` reiniciado en `beforeEach`.
- [ ] (2) `useLocalSearchParams` + efecto con `selectPet`.
- [ ] (3) Refactor.

## R22 — catálogo y guardas

- [ ] (1) Test rojo `#213 R22: claves de recurrencia en ambos idiomas` en `src/providers/__tests__/language-provider.test.tsx` (it.each de las 55 filas de `design.md` §Copy con su valor es-MX y en-US).
- [ ] (2) Claves en `src/i18n/catalog.ts` (es-MX y en-US).
- [ ] (3) Enmiendas de guardas, cada una con «(enmendado por #213 R22)» en el nombre del it:
  - `src/__tests__/ui-copy-table.ts`, `R8_REMINDERS`: +56 filas con comentario `// #213 R22` — 32 `{ file: 'src/screens/add-reminder/index.tsx', key: 'addReminder.…' }`, 22 `{ file: 'src/screens/reminders/index.tsx', key: 'reminders.…' }`, y `{ file: 'src/screens/reminders/index.tsx', key: 'common.cannotReachServer' }` y `… 'common.somethingWentWrong' }`. Ancla: `grep -cF "// #213 R22" src/__tests__/ui-copy-table.ts` = 56. `ALL_USES` y su test de suma no cambian (suma estructural).
  - `src/__tests__/ui-language.test.ts`, el it cuyo nombre contiene `resuelve las 56 ocurrencias normativas`: `56` pasa a `112` en el nombre y la expresión gana `+ 56 // #213 R22`.
  - `src/providers/__tests__/language-provider.test.tsx`, `#194 R1: mantiene la base …`: la suma gana `+ 54 // #213 R22`.
  - `src/__tests__/design-drift.test.ts`, `importa exactamente los iconos prescritos desde un único import de reicon …`: Recordatorios `['Plus', 'Repeat', 'Trash']`, Nuevo recordatorio `['Bell', 'Minus', 'Plus', 'Repeat']`.
  - `src/__tests__/design-drift.test.ts`, `reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto …`: `rounded-16` de Recordatorios 5 → 7 (confirm y keep de la hoja nueva), `rounded-14` sigue 2, `rounded-22` sigue 1, y en el inventario fuera de Recordatorios `'screens/add-reminder/index.tsx'` 1 → 2 (fila del stepper).
  - `SCREEN_FILES` no cambia. Si otra guarda (legibilidad `#61`, `#193 R11`, `#194 R5`, inventarios de `text-*`) cae, se re-mide contra el fuente, se enmienda con «(enmendado por #213 R22)» y se lista en el impl con su cifra base y la nueva.

## Verificación final (Codex, sin `./init.sh`)

- [ ] `cd /home/claude/sites/Pet-Tracker-wt-213/mobile-pet-tracker && bunx tsc --noEmit`
- [ ] `cd /home/claude/sites/Pet-Tracker-wt-213/mobile-pet-tracker && bunx jest src/api src/screens/add-reminder src/screens/reminders src/screens/home src/hooks src/providers src/__tests__`
- [ ] `cd /home/claude/sites/Pet-Tracker-wt-213/mobile-pet-tracker && bunx expo lint --no-cache > /tmp/lint-213.log 2>&1; echo $?` y revisar el log entero.
- [ ] Rellenar `traceability.md` con el hash de cada commit (sin rebase después).
