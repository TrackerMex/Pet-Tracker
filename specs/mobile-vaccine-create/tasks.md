---
feature: "mobile-vaccine-create"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-vaccine-create]] (#208)

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.

## Reglas para esta feature

- **Precondición.** #220 mergeada en `dev`. Primer paso: `git fetch origin && git merge origin/dev`.
  Nunca `rebase`. Ver [[design]] §Dependencia de #220.
- **Commits test primero (C4).** Cada R-id deja **dos commits como mínimo**:
  1. `test(mobile): #208 R<n> <resumen> (rojo)`, solo con ficheros de test
  2. `feat(mobile): #208 R<n> <resumen>`, con la implementación que lo pone en verde

  Prohibido juntar test e implementación en un commit, y prohibido un commit
  único para varios R-ids. El refactor, si lo hay, va en un tercer commit
  `refactor(mobile): #208 R<n> …`.
- **Orden de los R-ids**: R1, R2, R3, R4, R19, R5–R18, R20, R21, R22. R19 va
  pronto porque los tests de pantalla assertan copy literal.
- **Comandos** (`cd /home/claude/sites/Pet-Tracker-wt-208/mobile-pet-tracker` explícito):
  - un fichero: `bunx jest --runTestsByPath '<ruta>'`. Siempre con
    `--runTestsByPath`: el posicional es regex, y los corchetes de `[petId]` lo
    rompen con exit 0.
  - cierre: `bun run test`, `bun run typecheck` y
    `bun run lint > /tmp/lint208.log 2>&1 && test ! -s /tmp/lint208.log`
  - R22, desde la raíz: `node --test init-e2e-gate.test.mjs`
- **Prohibido**: `./init.sh`, e2e, `npx`, `npm i`, y cualquier dependencia nueva.
- **Informe.** Rellenar `progress/impl_mobile-vaccine-create.md`. Debe listar
  cada enmienda de inventario de R21 (regla mecánica) con su antes y su después,
  y actualizar [[traceability]] tras cada commit verde.

## R1 — Clientes de catálogo y alta de vacuna

- [ ] (1) Escribir test que falla para R1 (`api/__tests__/health-records.test.ts`, cinco `it`)
- [ ] (2) Implementación mínima que lo pasa (`getVaccineCatalog`, `createVaccine`, tipos, `healthKeys.vaccineCatalog`)
- [ ] (3) Refactor con tests verdes

## R2 — `addCalendarMonthsIso` con recorte a fin de mes

- [ ] (1) Escribir test que falla para R2 (`utils/__tests__/vaccine-dates.test.ts`, nueve filas, y el `it.each` en America/Mexico_City)
- [ ] (2) Implementación mínima que lo pasa (`utils/vaccine-dates.ts`)
- [ ] (3) Refactor con tests verdes

## R3 — `validateVaccine` exige nombre en «Otra vacuna»

- [ ] (1) Escribir test que falla para R3 (`utils/__tests__/form-rules.test.ts`, tres `it`)
- [ ] (2) Implementación mínima que lo pasa (`utils/form-rules.ts`)
- [ ] (3) Refactor con tests verdes

## R4 — Ruta delgada y `Stack.Screen` tras `meals-history`

- [ ] (1) Escribir test que falla para R4: `layout.test.tsx` con el `it` nuevo
      y los cuatro `+ 1 // #208 R4`, `detail-stack.guard.test.tsx` con su fila,
      y el `it` de ruta en `screens/vaccine-create/index.test.tsx`
- [ ] (2) Implementación mínima que lo pasa: route, `Stack.Screen` y un
      `VaccineCreateScreen` mínimo
- [ ] (3) Refactor con tests verdes

## R19 — 26 claves i18n en es y en

- [ ] (1) Escribir test que falla para R19 (`language-provider.test.tsx`, `+ 26, // #208 R19` y sufijo de título)
- [ ] (2) Implementación mínima que lo pasa (`i18n/catalog.ts`, literales de [[requirements]])
- [ ] (3) Refactor con tests verdes

## R5 — «Agregar vacuna» en la cabecera, solo para el owner

- [ ] (1) Escribir test que falla para R5: owner y `it.each` de tres roles, más
      la enmienda de `#199 R15`
- [ ] (2) Implementación mínima que lo pasa (`vaccines-header` y `vaccines-add` en Salud)
- [ ] (3) Refactor con tests verdes

## R6 — Tarjeta vacía del owner con CTA

- [ ] (1) Escribir test que falla para R6: tarjeta, CTA, `it.each` de tres
      roles, y los tres `it` existentes pasados a `family`
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R7 — Estructura de la pantalla de alta

- [ ] (1) Escribir test que falla para R7 (dimensiones, cabecera y leyenda perro/gato)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R8 — Chips del catálogo

- [ ] (1) Escribir test que falla para R8 (carga, orden con preselección, selección y error)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R9 — Nombre libre con contador

- [ ] (1) Escribir test que falla para R9 (contador, foco y ausencia con catálogo)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R10 — Fechas con `DateField`

- [ ] (1) Escribir test que falla para R10 (hoy y propuesta, recálculo, elección a mano, modo libre)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R11 — Nota del esquema

- [ ] (1) Escribir test que falla para R11 (dos ramas con copy exacto)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R12 — Tarjeta «Recordarme la próxima dosis»

- [ ] (1) Escribir test que falla para R12 (marcado por defecto, subtexto con y sin fecha, alternar)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R13 — Veterinario, clínica y notas

- [ ] (1) Escribir test que falla para R13
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R14 — Envío: validación y cuerpo exacto

- [ ] (1) Escribir test que falla para R14 (cuerpo con catálogo, cuerpo libre, nombre en blanco, CTA bloqueado)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R15 — Recordatorio tras el 201

- [ ] (1) Escribir test que falla para R15 (futura, `it.each` de tres «no», invalidaciones y back)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R16 — Aviso ámbar si falla el recordatorio

- [ ] (1) Escribir test que falla para R16: dos `it` en alta y tres en Salud,
      con `clearVaccineReminderNotice()` en `beforeEach`
- [ ] (2) Implementación mínima que lo pasa (`hooks/vaccine-reminder-notice.ts`, `health-root` y el aviso)
- [ ] (3) Refactor con tests verdes

## R17 — Alerta rosa al fallar el guardado

- [ ] (1) Escribir test que falla para R17 (`it.each` de cinco `kind` y reintento)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R18 — 400 del servidor sin texto crudo

- [ ] (1) Escribir test que falla para R18 (`appliedAt` y otro path)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R20 — Bloque `R19_VACCINE_CREATE` de 30 usos

- [ ] (1) Escribir test que falla para R20: `describe` nuevo en `ui-language.test.ts`,
      `SCREEN_FILES + 1` y el bloque en `blocks`. El bloque y sus 30 filas son
      el propio test, en `ui-copy-table.ts`
- [ ] (2) Implementación mínima que lo pasa: ajustar solo si una fila no cuadra
      con el código. Si todo cuadró ya, el commit `feat` se omite y se dice en
      el informe
- [ ] (3) Refactor con tests verdes

## R21 — Guardas de carta e inventarios

- [ ] (1) Escribir test que falla para R21: el `describe` de deriva nuevo y las
      enmiendas exactas listadas en [[requirements]] R21, cada una con su sufijo
- [ ] (2) Implementación mínima que lo pasa: corregir la deriva que aparezca,
      nunca aflojar la guarda
- [ ] (3) Refactor con tests verdes

## R22 — `seed:vaccines` en `E2E_SETUP_CMD`

- [ ] (1) Escribir test que falla para R22 (`init-e2e-gate.test.mjs`)
- [ ] (2) Implementación mínima que lo pasa (`init.config.sh`)
- [ ] (3) Refactor con tests verdes

## Cierre

- [ ] `bun run test`, `typecheck` y `lint` (con log) verdes; cifras en el informe
- [ ] Grep-clean de la carta sobre los cuatro ficheros nuevos, con salida en el informe
- [ ] [[traceability]] sin filas «pendiente»
- [ ] Marcador de fin de `progress/impl_mobile-vaccine-create.md` escrito
