---
feature: "mobile-docs-upload-form-polish"
status: approved
tags: [mobile, ui, spec]
---

# #185 mobile-docs-upload-form-polish — Tareas

> TDD por requisito: (1) test rojo con su commit propio, (2) implementación
> mínima, (3) refactor. **Un commit de test rojo antes de cada commit de
> implementación** (C4 de `CHECKPOINTS.md`). Comandos desde
> `mobile-pet-tracker/` salvo que digan otra cosa. Nunca `npx` ni `npm`:
> siempre `bunx` y `bun`. No lances `./init.sh`.
>
> **No se arranca sin que el humano marque UNA rama de P1** en
> `requirements.md` §Aprobación. Las tareas T2A, T2B y T2C son alternativas;
> se ejecuta solo la de la rama marcada. T3 a T8 son comunes.
>
> Orden pensado para que ningún test asevere un nodo que su propia tarea no
> crea: T2 coloca el formulario y le da el `Test-F` (rama A: se crea el fichero
> de test y se mudan los `describe`); T3 envuelve los botones antes de que T5
> aseveren sus hijos.

## Recuento de `it` en `src/screens/docs/index.test.tsx`

Base H0: `59` en `44acd74b` (B13). De ellos, 18 son del formulario (`#158 R5`
6, `R6` 2, `R7` 3, `R8` 2, `R9` 3, `R11` 2); `#158 R10` (3) se queda en la
lista en todas las ramas. Medido con `grep -cE "^\s*it(\.each\(|\()"`.

| Tras | Rama A (lista) | Rama A (`docs-upload-form/index.test.tsx`) | Rama B (lista, incluye formulario) |
|---|---|---|---|
| H0 | 59 | n/a | 59 |
| T1 (R1) | + 2 = 61 | n/a | + 2 = 61 |
| T2A (R2) | + 4 (R2.1 `it.each`, formatos rechazados `it.each`, R2.3 lista x2) − 18 (mudados) = 47 | 18 + 4 (R2.2, R2.3, R2.4, R2.5 `it.each`) = 22 | n/a |
| T2B (R3) | n/a | n/a | + 3 (R3.1, R3.2, R3.3) = 64 |
| T3 (R7) | 47 | + 1 = 23 | + 1 = 65 |
| T4 (R5) | 47 | + 1 = 24 | + 1 = 66 |
| T5 (R6) | 47 | + 1 (`it.each` por campo) = 25 | + 1 = 67 |
| T6 (R8) | 47 | + 1 (`it.each` de seis filas) = 26 | + 1 = 68 |

Los totales cuentan cada `it.each` como un solo `it`, igual que `grep`: el implementer recalcula la tabla en H0 con `grep -cE` real y corrige
los totales, no la medida. La fila T1 asume la fixture doble (con y sin
documentos) como dos `it`.

## Tareas

### T0. H0 (medir antes de escribir nada)

- [ ] **T0.1** `git rev-parse --short HEAD` y `git merge-base --is-ancestor
  44acd74b HEAD`; re-ejecutar B1 a B19 de `requirements.md`. Si un valor
  cambió, parar y avisar al leader (la base se mueve al mergear otra feature).
- [ ] **T0.2** `test ! -e .expo/types/router.d.ts` (rama A; si existe, parar).
- [ ] **T0.3** `bun install` solo si `node_modules` no existe (B20). Anotar en
  `progress/impl_mobile-docs-upload-form-polish.md` cada medida siguiente.
- [ ] **T0.4** R6: leer la anatomía de `TextField` en
  `node_modules/heroui-native` (`grep -rn "gap" node_modules/heroui-native/src/components/text-field/`)
  y anotar si ya separa etiqueta e input y cuánto. Rige R6 como está
  escrito.
- [ ] **T0.5** Rama A: `grep -c dismissTo
  node_modules/expo-router/build/imperative-api.d.ts` (esperado ≥ 1). Rama B:
  leer `node_modules/@expo/ui/community/bottom-sheet` `.d.ts` y anotar
  `snapPoints`, la prop de teclado soportada y si `enablePanDownToClose`
  existe.
- [ ] **T0.6** Recorrer los candados de R10 con `grep -rn "docs"
  src/__tests__/*.ts* src/app/__tests__/*.tsx` y
  `grep -rn "geofence-editor" src/__tests__ src/app/__tests__`; anotar cada
  sitio y su cuenta actual (memoria «candado de catálogo omitido»).
- [ ] **T0.7** Línea base verde: `bunx jest --silent src/screens/docs
  src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts
  src/__tests__/design-drift.test.ts src/app/__tests__` (sin `.`; rutas con
  paréntesis escapadas). Si hay rojos previos, parar.

### T1. R1 — el formulario no es hijo de la lista

1. Rojo: `#185 R1` de `docs/index.test.tsx` (dos fixtures, dos aserciones cada
   una). Commit: `test(docs): el formulario no vive en la lista (#185 R1)`.
2. Verde: lo hace T2 (rama A/B). R1 nace rojo y se cierra con el verde de T2;
   no se escribe implementación aparte.
3. Refactor: ninguno.

### T2A. R2 — rama A (solo si P1 = A)

1. Rojo, en este orden de commits: (a) `#185 R2.1` en `docs/index.test.tsx`,
   (b) crear `docs-upload-form/index.test.tsx` mudando los `describe` de
   `#158 R5`, `R6`, `R7`, `R8`, `R9` y `R11` con su nombre `#185 R9 (antes
   #158 Rn)` y los dobles de `docs/index.test.tsx` que necesiten, más
   `#185 R2.2` a `#185 R2.5`; (c) `#185 R2.3` de la lista. Cada uno con su
   commit.
2. Verde: ruta delgada `docs-upload.tsx`, `Stack.Screen`, pantalla
   `DocsUploadFormScreen` (mueve estados y funciones de R2.6), `DocsScreen`
   pierde el formulario y recibe `uploaded`, `docs.tsx` lo lee con
   `useLocalSearchParams`.
3. Refactor: mantener `civilTodayIso` y helpers compartidos en el sitio donde
   ya viven (no duplicar); extraer a `src/screens/docs/` solo lo que importen
   las dos pantallas.
4. Candados Δ1 a Δ5 de R10 (con la rama A) en commits propios: rojo = subir la
   cuenta/ruta en el test, verde = el cambio en código. `docs/conventions.md` y
   `docs/ui-guidelines.md`: lista A11.

### T2B. R3 — rama B (solo si P1 = B)

1. Rojo: `#185 R3.1`, `R3.2`, `R3.3`, con el doble de la hoja copiado del test
   de Recordatorios. Commit propio.
2. Verde: mover el formulario al `BottomSheet`; R1 pasa a verde.
3. Refactor: ninguno. Δ6 de R10.

### T2C. R4 — rama C

Sin tareas: bloqueada hasta que el spec_author redacte R4.

### T3. R7 — botones separados (común)

1. Rojo: `#185 R7` en `Test-F`. Commit `test(docs): botones del formulario
   separados (#185 R7)`.
2. Verde: envolver los dos botones en `View testID="docs-upload-actions"
   className="gap-3"`. No tocar sus clases.
3. Refactor: ninguno.

### T4. R5 — espacio entre campos (común)

1. Rojo: `#185 R5` (clase exacta `gap-4`, hijos en orden, cuatro `TextField`).
2. Verde: `className="gap-4"` en `docs-upload-form`.
3. Refactor: ninguno.

### T5. R6 — espacio etiqueta-input (común)

1. Rojo: `#185 R6`, `it.each` por campo. Según T0.4.
2. Verde: `className="gap-1.5"` en los cuatro `TextField`.
3. Refactor: ninguno.

### T6. R8 — clases intactas (común)

1. Rojo: `#185 R8`, `it.each` de las seis filas. Nace verde (las clases ya son
   esas): documenta el candado. Sonda de mutación obligatoria: cambiar
   `border-b-4` por `border-b-6` en el botón de submit, ver rojo, revertir.
2. Verde: n/a.
3. Refactor: n/a.

### T7. R9 — flujo conservado (común)

Cierra el mudado de T2A / el arnés de T2B. Verificar que ningún `it` de
`#158 R5` a `R11` se perdió: el recuento de `it` del formulario es 18 y
`grep -cF '#158 R' ` sobre el fichero de destino lo confirma (anotar en
`progress/`).

### T8. Cierre

- [ ] `bunx jest` completo de los ficheros de T0.7 más los de las tareas.
- [ ] `bunx tsc --noEmit` y `bunx expo lint --no-cache` con
  `> log 2>&1 && test ! -s log` y `! grep -qF 'Failed to run'` (memoria
  «expo lint SIGKILL sale 0»).
- [ ] `traceability.md` con commits rojo/verde por fila; sin «pendiente».
- [ ] Prueba de humo R11 (humano) en el dev build de Android.

## Guardas y sondas

| Sonda | Dónde | Debe ponerse rojo en |
|---|---|---|
| S1: reinsertar el formulario en el `ScrollView` | R1 | `#185 R1` |
| S2: quitar `gap-4`, o `gap-3` | R5 | `#185 R5` (a) |
| S3: mover el `Text` de archivo dentro del primer `TextField` | R5 | `#185 R5` (b) |
| S4: quitar `gap-1.5` de un solo `TextField` | R6 | la fila de ese campo (`it.each`) |
| S5: invertir el orden de los botones | R7 | `#185 R7` hijos |
| S6: `border-b-4` → `border-b-6` en submit | R8 | fila de submit |
| S7: omitir `uploaded` en el `dismissTo` (solo A) | R2.3 | `#185 R2.3` formulario |
| S8: quitar `enablePanDownToClose={!uploading}` (solo B) | R3.2 | `#185 R3.2` |
