---
feature: "mobile-no-pets-states-and-centered-content"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-no-pets-states-and-centered-content]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. El sujeto de cada tarea es
> el artefacto que ya existe en ese punto del orden; ningún paso asevera un nodo
> que un requisito posterior crea (el rojo de R1 es por aserción sobre nodos
> existentes o por `findByTestId` agotado, nunca por símbolo ausente).

## Reglas de ejecución (para el handoff)

- Todo en `mobile-pet-tracker/`: `cd` literal a esa carpeta en cada orden. `bun` para todo
  (`bun run typecheck`, `bun run lint`); nunca `npx` ni `npm`. Mobile no tiene prettier.
- Jest acotado con `bunx jest --runTestsByPath <rutas>`: cada ruta es literal. Las rutas con
  `(tabs)` van entre comillas simples y sin escapar, p. ej.
  `'src/app/(tabs)/__tests__/food.test.tsx'`; sin escapar, porque con `--runTestsByPath` no son
  regex. Guardas: `bunx jest src/__tests__`.
- `await` en todo `render`, `fireEvent` y `act` de RNTL 14. Esperas con `waitFor` /
  `findBy…`, nunca con `advanceTimersByTime` suelto (conventions §Tests, regla de `waitFor`).
- El verde de lint va con `--no-cache` y con la guarda de que no aparece `Failed to run`.
- **No** correr `./init.sh` ni la suite completa (lo hace el leader).
- Una cadena de handoff acaba siempre en `git commit`; las cabeceras de la cadena van como
  `# --` (comentario), no como línea ejecutable; sin macros con `$'`.
- Commits test-primero (C4): rojo y verde en commits separados; el rojo falla por aserción.
- Los nombres de skills de Codex en el handoff los fija el leader (catálogo real de Codex).

## R1 — Sondas rojas de ausencia de tarjetas (Inicio, Perfil, Recordatorios)

- [ ] (1) Las sondas S1 a S4 de cada pantalla y S5 de Perfil (13 `it`, `describe('#181 R1: …')`)
  se escriben contra el árbol de H0; las de ausencia van con ancla positiva,
  `queryClient.isFetching()` a 0 y solo entonces `queryBy…` a `null` (S5 usa su sincronización
  propia, R1.2); el commit queda rojo por aserción
- [ ] (2) Sin implementación en este paso: R1 se cierra con los verdes de R2, R3, R4 y R5
- [ ] (3) Las sondas se leen una vez más para confirmar que ninguna es tautológica
  (ancla, espera, ausencia sobre el mismo árbol)

## R2 — Raíz: `clearPet` en el proveedor y en `usePetSelection`

- [ ] (1) Los tests del proveedor (`typeof clearPet` igual a `function`, `selectPet` y luego
  `clearPet` deja `none`, identidad estable, el token reinicia) y del hook (un `it` por
  R2.2, uno por cada condición de R2.3, el `it.each` de los cuatro `kind`, el escaneo de
  R2.4) se escriben y fallan por aserción
- [ ] (2) El proveedor expone `clearPet`, el hook lo llama tras los guards de foco y de
  revalidación, y los 17 dobles de `useSelectedPet` lo incorporan (R2.5); `bun run
  typecheck` sale 0
- [ ] (3) El hook se relee para confirmar que la rama de limpieza no duplica la
  computación de `selectionExists` y que las dependencias del efecto incluyen `clearPet`

## R3 — Inicio: sin tarjeta y estado centrado

- [ ] (1) Los tests de R3.2 (contenedor y único hijo, nodos ausentes) y la reescritura del
  `it` de `#155 R4` (§3 de requirements) se escriben y fallan por aserción; R3.1 ya lo cubre
  la sonda S4 de Inicio de R1 (c1), sin `it` nuevo
- [ ] (2) La condición de `pet-hero-error` exige `selectedPetId !== null` y el retorno
  anticipado con `home-no-pets-screen` se coloca tras todos los hooks; el `EmptyState` sale
  de `home-states`
- [ ] (3) Se confirma con una relectura que no queda ningún hook posterior al retorno
  anticipado y que `home-states` conserva su estilo (R3.3)

## R4 — Recordatorios: sin tarjeta y estado centrado

- [ ] (1) Los tests de R4.1 y R4.2 (copy, acción, `router.push('/pets/add')`, ausencia de
  nodos, presencia de `screen-reminders` con una mascota), más las filas de R8.1
  (`R8_REMINDERS` +3, fórmula con `+ 3 // #181 R4`) y el recuento de R8.2 (`reminders`
  2) se escriben y fallan por aserción
- [ ] (2) `petsEmpty`, la condición de `reminders-error` y el retorno anticipado con
  `reminders-no-pets-screen` / `reminders-no-pets` se añaden tras todos los hooks y
  `useCallback`
- [ ] (3) Se relee que `reminders-empty` y `#155 R6` no se tocaron

## R5 — Perfil: vacío ilustrado y sin tarjeta ni esqueletos

- [ ] (1) Los tests de R5.1/R5.2 (copy, pose, acción, mismo testID, ausencia de error y
  esqueletos), más R8.1 (`R7_PROFILE` +2, `+ 2 // #181 R5`) y R8.2 (fila de texto fuera,
  `profile` 1, 9 ficheros, lista con Perfil) se escriben y fallan por aserción
- [ ] (2) El `EmptyState` con testID `profile-pets-empty` sustituye al `<Text>`, `petLoading`
  añade `&& !petsEmpty` y la tarjeta de error exige `selectedPetId !== null && !petsEmpty`
- [ ] (3) Se verifica con `node` el orden del `.sort()` de la lista de R8.2 y que los 3
  tests de Perfil que nombran `profile-pets-empty` siguen verdes sin edición (M16)

## R6 — Comida y Salud heredan la raíz

- [ ] (1) Las dos sondas (selección rancia, estado vacío presente, `selected-pet-id` igual a
  `none`; Comida además sin `food-plan-error`) se escriben; nacen verdes tras R2, así que se
  cierran por mutación X1 (R10) y no por rojo
- [ ] (2) Sin implementación propia: la da R2
- [ ] (3) Se confirma que cada sonda se pone roja con X1 planteada

## R7 — Convergencia al crear la primera mascota

- [ ] (1) La sonda `[]` a `[pet]` con `refetchQueries` sobre `petKeys.list()` se escribe en
  `src/screens/home/index.test.tsx`; nace verde tras R2 y R3, y se cierra por mutación
- [ ] (2) Sin implementación propia
- [ ] (3) Se confirma que la limpieza intermedia no deja `home-empty` ni selección nula al
  final

## R8 — Candados agregados y de catálogo

- [ ] (1) Las filas, los recuentos y la lista de R8.1/R8.2 viajan en los commits rojos de R4
  y R5 (arriba); R8.3 se verifica corriendo `design-drift` y `legibility-classnames`
- [ ] (2) Sin implementación propia: la dan R4 y R5
- [ ] (3) `checkUses(ALL_USES)` y la longitud de `SCREEN_FILES` se confirman sin cambios

## R9 — Enmienda A20 de la carta

- [ ] (1) `src/__tests__/no-pets-states.test.ts` (aparición única de «enmienda A20 de #181»
  y regex tolerante de la casilla) se escribe y falla por aserción (cero apariciones)
- [ ] (2) La viñeta y el bloque de firma se añaden a `docs/conventions.md`, con la casilla
  sin marcar
- [ ] (3) Se confirma que `docs/ui-guidelines.md` sigue intacto (R9.3)

## R10 — Pruebas de mutación

- [ ] (1) La tabla X1 a X12 se prepara en `progress/impl_mobile-no-pets-states-and-centered-content.md`
  con el `it` esperado en rojo por mutación
- [ ] (2) Cada mutación se planta una a una sobre el árbol verde, se anota el `it` que cae y se
  revierte con `git checkout HEAD -- <ruta>` (diff `--cached` a 0)
- [ ] (3) Se confirma que ninguna mutación sobrevive salvo X5 (equivalente, documentada) y
  que X1 en S3 no tumba S3

## Plan de commits

| Commit | Contenido | Estado esperado | Tests nuevos acumulados |
|---|---|---|---|
| c1 | R1: 13 sondas (S1 a S5) | rojo | 13 |
| c2 | R2: tests de proveedor, hook y escaneo | rojo | 13 + n2 |
| c3 | R2: `clearPet`, hook y 17 dobles | verde en R2; S1 de R6 y parte de R1 | 13 + n2 |
| c4 | R3: tests, reescritura `#155 R4` | rojo | + n3 |
| c5 | R3: Inicio | verde | + n3 |
| c6 | R4: tests, R8.1 reminders, R8.2 reminders | rojo | + n4 |
| c7 | R4: Recordatorios | verde | + n4 |
| c8 | R5: tests, R8.1 profile, R8.2 profile | rojo | + n5 |
| c9 | R5: Perfil | verde | + n5 |
| c10 | R6 y R7: sondas nacidas verdes | verde | + 3 |
| c11 | R9: test | rojo | + 2 |
| c12 | R9: conventions | verde | + 2 |
| c13 | R10: log de mutaciones y trazabilidad | verde | 0 |

Total de cada commit = anterior + `it` añadidos en ese commit; el implementador rellena n2 a n5
con su recuento real en `progress/impl_…md`, nunca una cifra fijada aquí.
