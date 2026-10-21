---
feature: "mobile-focus-refetch-guard-no-pet"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-focus-refetch-guard-no-pet]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Para los R de verificación
> (vía b), el sub-item (1) es un test que ya pasa más la mutación de producción de
> la tabla de abajo, y el (2) es revertir esa mutación. Los R rojos (vía a) siguen
> el orden clásico: test rojo, implementación, verde.

## Orden de commits

Rama `feature/193-mobile-focus-refetch-guard-no-pet`, creada desde `origin/main`. Cuatro commits, en este orden:

- **A** `test(mobile): tests de foco sin mascota (R1,R2,R3,R4,R5,R6,R7,R8,R9,R10,R11)`. Añade los describes `#193 R<n>:` de los cuatro ficheros de test. Rojo por aserción en R1, R4 y R7. Verde en R2, R3, R5, R6, R8, R9, R10 y R11, que ya se cumplen hoy. No añade helpers nuevos en `test/` ni símbolos que no existan: un `ReferenceError` no es rojo legítimo (C4).
- **B** `feat(mobile): guarda de refetch sin mascota en Inicio, Perfil y Recordatorios (R1,R4,R7)`. Ref, sincronización y guarda en las tres pantallas (D1 a D3, D5 a D7). Verde en todo. Si un test existente asevera la petición sin mascota, se actualiza aquí y se declara en el mensaje del commit.
- **C** `test(mobile): mutaciones de control para R2,R3,R5,R6,R8,R9,R10,R11 (rojo por aserción)`. Aplica a producción las ocho mutaciones de la tabla a la vez. Cada una afecta solo a su R. Rojo: el `it` de cada R falla por su aserción.
- **D** `test(mobile): revierte mutaciones de control (R2,R3,R5,R6,R8,R9,R10,R11)`. Deshace exactamente lo de C. Verde en todo.

## Mutaciones de control (C4, vía b)

| Id | Pantalla | Mutación de producción (sobre el estado de B) | R que debe fallar por aserción |
|---|---|---|---|
| M-R2 | Inicio | quitar la llamada a `refetchDetail()` de la callback de foco | R2 |
| M-R3 | Inicio | retorno temprano al inicio de la callback de foco si `selectedPetIdRef.current` es `null` | R3 |
| M-R5 | Perfil | quitar la llamada a `refetchDetail()` de la callback de foco | R5 |
| M-R6 | Perfil | envolver la llamada a `refetchPets()` de la callback de foco en la guarda `!== null` | R6 |
| M-R8 | Recordatorios | quitar la llamada a `refetchReminders()` de la callback de foco | R8 |
| M-R9 | Recordatorios | retorno temprano antes de devolver la función de limpieza si `selectedPetIdRef.current` es `null` | R9 |
| M-R10 | Inicio, Perfil y Recordatorios | añadir `selectedPetId` al array de dependencias del `useCallback` de foco | R10 |
| M-R11 | Inicio | añadir un literal hex (por ejemplo `#fff`) en el JSX o en un valor de estilo de `home/index.tsx` | R11 |

Evidencia: cada M-R<n> se aplica sola sobre el estado de B, se corre el `it` de su R, se anota la aserción que falla y se revierte. Después se aplican todas juntas en C y se mide ahí también. El implementer anota en `progress/impl_mobile-focus-refetch-guard-no-pet.md` esas aserciones por cada M-R<n>. El reviewer reproduce la corrida en C y copia en `progress/review_mobile-focus-refetch-guard-no-pet.md` la aserción que falla por cada R (C4). Un fallo de compilación, un import inexistente o un doble alterado no cuenta como evidencia.

## R1 — Inicio sin mascota no pide el detalle al enfocar (rojo, vía a)

- [ ] (1) Escribir test que falla para R1: en `home/index.test.tsx`, describe `#193 R1:`. Falla por la aserción de que `getPet` se invoca con selección nula. Commit A.
- [ ] (2) Implementación mínima que lo pasa: `selectedPetIdRef` con su sincronización y la guarda de `refetchDetail()` en Inicio (D1 a D3, D7). Commit B.
- [ ] (3) Refactor con tests verdes: no aplica.

## R2 — Inicio con mascota pide el detalle al enfocar (verificación, vía b)

- [ ] (1) Test que nombra R2 (`#193 R2:` en `home/index.test.tsx`), verde en A. Mutación M-R2 en C: rojo por aserción.
- [ ] (2) Revertir M-R2 en D: verde.
- [ ] (3) Refactor con tests verdes: no aplica.

## R3 — Inicio sin mascota sigue refrescando lista y alertas (verificación, vía b)

- [ ] (1) Test que nombra R3 (`#193 R3:` en `home/index.test.tsx`), verde en A. Mutación M-R3 en C: rojo por aserción.
- [ ] (2) Revertir M-R3 en D: verde.
- [ ] (3) Refactor con tests verdes: no aplica.

## R4 — Perfil sin mascota no pide el detalle al enfocar (rojo, vía a)

- [ ] (1) Escribir test que falla para R4: en `profile/index.test.tsx`, describe `#193 R4:`. Falla por la aserción de que `getPet` se invoca con selección nula. Commit A.
- [ ] (2) Implementación mínima que lo pasa: `selectedPetIdRef` con su sincronización y la guarda de `refetchDetail()` en Perfil (D1 a D3, D7). Commit B.
- [ ] (3) Refactor con tests verdes: no aplica.

## R5 — Perfil con mascota pide el detalle al enfocar (verificación, vía b)

- [ ] (1) Test que nombra R5 (`#193 R5:` en `profile/index.test.tsx`), verde en A. Mutación M-R5 en C: rojo por aserción.
- [ ] (2) Revertir M-R5 en D: verde.
- [ ] (3) Refactor con tests verdes: no aplica.

## R6 — Perfil sin mascota sigue refrescando la lista de mascotas (verificación, vía b)

- [ ] (1) Test que nombra R6 (`#193 R6:` en `profile/index.test.tsx`), verde en A. Mutación M-R6 en C: rojo por aserción.
- [ ] (2) Revertir M-R6 en D: verde.
- [ ] (3) Refactor con tests verdes: no aplica.

## R7 — Recordatorios sin mascota no pide recordatorios al enfocar (rojo, vía a)

- [ ] (1) Escribir test que falla para R7: en `reminders/index.test.tsx`, describe `#193 R7:`. Falla por la aserción de que `listReminders` se invoca con selección nula. Commit A.
- [ ] (2) Implementación mínima que lo pasa: `selectedPetIdRef` con su sincronización y la guarda de `refetchReminders()` en Recordatorios (D1 a D3, D7). Commit B.
- [ ] (3) Refactor con tests verdes: no aplica.

## R8 — Recordatorios con mascota pide recordatorios al enfocar (verificación, vía b)

- [ ] (1) Test que nombra R8 (`#193 R8:` en `reminders/index.test.tsx`), verde en A. Mutación M-R8 en C: rojo por aserción.
- [ ] (2) Revertir M-R8 en D: verde.
- [ ] (3) Refactor con tests verdes: no aplica.

## R9 — Recordatorios sin mascota limpia la confirmación y el error al perder el foco (verificación, vía b)

- [ ] (1) Test que nombra R9 (`#193 R9:` en `reminders/index.test.tsx`), verde en A. Prepara la confirmación con selección no nula, cambia la selección a `null` sin desmontar y ejecuta la limpieza. Mutación M-R9 en C: rojo por aserción.
- [ ] (2) Revertir M-R9 en D: verde.
- [ ] (3) Refactor con tests verdes: no aplica.

## R10 — Cambiar la selección con la pantalla enfocada no vuelve a ejecutar la callback (verificación, vía b)

- [ ] (1) Test que nombra R10 en los tres ficheros de pantalla (`#193 R10:` en `home/index.test.tsx`, `profile/index.test.tsx` y `reminders/index.test.tsx`), verde en A. Compara con `Object.is` la callback antes y después de cambiar la selección. Mutación M-R10 en C: rojo por aserción en los tres.
- [ ] (2) Revertir M-R10 en D: verde.
- [ ] (3) Refactor con tests verdes: no aplica.

## R11 — Grep-clean de las tres pantallas (verificación, vía b)

- [ ] (1) Test que nombra R11 (`#193 R11:` en `src/__tests__/design-drift.test.ts`), verde en A con los tres ficheros de pantalla. Mutación M-R11 en C: rojo por aserción.
- [ ] (2) Revertir M-R11 en D: verde.
- [ ] (3) Refactor con tests verdes: no aplica.

## Comandos de verificación

Desde `/home/claude/sites/Pet-Tracker-wt-193/mobile-pet-tracker` (rutas relativas a esa carpeta):

- Antes de la primera corrida en el worktree: `bun install --frozen-lockfile` (no hay `node_modules` en wt-193).
- Por fichero y por R: `bunx jest src/screens/home/index.test.tsx -t '#193 R1:'`. Los dos puntos evitan que `R1` coincida con `R10` o `R11`.
- Suite de regresión de CC1: `bunx jest src/screens/home src/screens/profile src/screens/reminders src/screens/map src/__tests__/design-drift.test.ts`.
- `bunx tsc --noEmit`.
- `bunx expo lint > <log> 2>&1 && test ! -s <log>`. El `&&` toma el código de `expo lint` y `test ! -s` exige log vacío: un SIGKILL u OOM (que sale con código 0) o un aviso dan rojo.
- Ninguna medición de veredicto usa pipes (`| tail` daría el código de `tail`).
- Tras modificar código: `graphify update .` desde la raíz del worktree (CLAUDE.md).
