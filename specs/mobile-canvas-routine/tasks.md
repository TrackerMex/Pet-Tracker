---
feature: "mobile-canvas-routine"
status: spec_ready     # draft | spec_ready | approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-canvas-routine]]

TDD por requisito: por cada R, (1) commit rojo `test(#204 R<n>): …` con los
`it` nuevos y las enmiendas del inventario de ese R (requirements.md § Candados
que esta feature revierte), (2) commit verde `feat(#204 R<n>): …` con la
implementación mínima, (3) refactor opcional `refactor(#204 R<n>): …` sin
cambiar tests. Nunca implementación y tests en el mismo commit. Rutas
relativas a `mobile-pet-tracker/` salvo que digan otra cosa.

## Orden recomendado

R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15, R16, R17.
R18 lo cierra el humano.

Por qué este orden: R2 (`titlePlaceholder`) va antes de R12, que lo usa; R3
(el export) antes de R6, que lo importa; R4 crea `reminders`, que R5 aserta;
R10 deja `flexGrow: 1`, que R11 necesita; R12 crea `docs-header`, que R13
aserta. Ningún test rojo aserta nodos que cree un R posterior.

R15 y R17 son candados sobre lo ya implementado y **nacen verdes**: van en un
único commit `test(#204 R15)` / `test(#204 R17)`. Para demostrar que no son
tautológicos, antes de commitear el implementador planta una mutación por
candado en la zona que mira (R15: `MOTION_REMINDERS_STAGGER_MS = 60` en
`theme/motion.ts`; R17: un `#FFFFFF` en un comentario de
`screens/docs/index.tsx`), ve el rojo, la revierte y lo apunta en su informe
(tabla «Mutaciones plantadas»). R16 sí tiene rojo (la carta aún no tiene el
bloque).

## Notas para el handoff a Codex

- `cd /home/claude/sites/Pet-Tracker-wt-204/mobile-pet-tracker` literal antes de cada comando; `bun install --frozen-lockfile` si no hay `node_modules`.
- **No ejecutar `./init.sh`** (lo corre el leader). Jest por fichero: `bunx jest <ruta>`; las rutas con `[petId]` o paréntesis son regex: usar `--runTestsByPath`.
- `bunx tsc --noEmit` y `bunx expo lint` (con salida a log y `test ! -s` del log de errores: `expo lint` puede salir 0 tras un SIGKILL).
- Commits test-primero, uno rojo y uno verde por R (C4 de `CHECKPOINTS.md`).
- Comentarios nuevos solo con la forma `#204 R<n>` (`HEX_LITERAL` y `#181 R8.3` escanean comentarios).
- Sin clases arbitrarias `-[…]`, sin `StyleSheet.create`, sin `text-13/15/17` dentro de `Button.Label`: R8 y R9 usan `Text` de `react-native`.
- Dobles: `../../components/rise-in` se dobla como hoy `../home/home-entrance` (un `jest.fn` que registra props y pinta un `View` con su `testID`). Comparar nodos por `testID`, no con `toBe(nodo)`.
- Skills de Codex (plugin `expo@openai-curated` v1.0.2): nombrarlas por su nombre en Codex según `.claude/agents/leader.md` § Catálogo real de skills de Codex.
- Ninguna dependencia nueva (`expo-linear-gradient` vetado). Nada de AWS.

## Cuentas a re-medir al terminar (base + delta)

Desde la raíz del worktree. «Base» es `81cb6d6b`; si otra feature mergeó
antes, re-medir la base y sumar el mismo delta.

| Comando | Base | Delta | Esperado |
|---|---|---|---|
| `grep -cF '<Button.Label' mobile-pet-tracker/src/screens/reminders/index.tsx` | 4 | −2 (R8, R9) | 2 |
| `grep -cF 'rounded-14' mobile-pet-tracker/src/screens/reminders/index.tsx` | 1 | +1 (R8) | 2 |
| `grep -cF 'rounded-16' mobile-pet-tracker/src/screens/reminders/index.tsx` | 4 | +1 (R9) | 5 |
| `grep -cF 'style={chunkyLip.danger}' mobile-pet-tracker/src/screens/reminders/index.tsx` | 0 | +1 (R9) | 1 |
| `grep -cF 'export const MOTION_REMINDERS_STAGGER_MS = 70;' mobile-pet-tracker/src/theme/motion.ts` | 0 | +1 (R3) | 1 |
| `grep -cF 'titlePlaceholder' mobile-pet-tracker/src/components/screen-header.tsx` | 0 | ≥ +2 (R2) | ≥ 2 |
| `grep -cF "from '../home/home-entrance'" mobile-pet-tracker/src/screens/reminders/index.tsx mobile-pet-tracker/src/screens/docs/index.tsx` | 1 y 1 | −1 y −1 (R6, R14) | 0 y 0 |
| `grep -cF 'HeaderHeightContext' mobile-pet-tracker/src/screens/add-reminder/index.tsx mobile-pet-tracker/src/screens/docs/index.tsx` | 2 y 2 | −2 y −2 (R10, R12) | 0 y 0 |
| `grep -cF '## Enmienda #204' docs/ui-guidelines.md` | 0 | +1 (R16) | 1 |
| `#177 R6.2`: expresión de `<Button\.Label` | `35 - 15 - 1 - 1 - 1` | `- 1 - 1` (R8, R9) | 15 |
| `#177 R6.2`: expresión de `Button\.Label` | `82 - 30 - 2 - 2 - 2` | `- 2 - 2` (R8, R9) | 42 |
| `#177 R6.2`: expresión de `text-17` | `8 + 15 + 1 + 1 + 1 + 1` | `+ 1` (R9) | 28 |
| `#177 R7.3`: total de radios 16 | `26 + 1 + 1 + 1 + 2` | `+ 1` (R9) | 32 |
| Tests de jest (`bunx jest` en `mobile-pet-tracker`) | N medido por el implementador | +49 `it` nuevos (R1 3, R2 2, R3 1, R4 3, R5 5, R6 1, R7 1, R8 1, R9 1, R10 4, R11 1, R12 5, R13 4, R14 1, R15 11, R16 1, R17 4) − 3 filas (I2 2, I4 1) − los `it` de `#197 R20` (I1, medidos al borrarlos) | N + 46 − I1 |
| Suites de jest | M | +1 (`routine-canvas-fidelity.test.ts`) | M + 1 |

El resto de anclas: requirements.md § Base medida, columna «Después».

## Bloques por requisito

### R1 — Rutas sin cabecera nativa
1. Rojo: describe `#204 R1` en `src/app/__tests__/layout.test.tsx` (it.each de 3 rutas); enmiendas I2 e I4; borrar entero el describe `#197 R20` (I1).
2. Verde: `src/app/_layout.tsx`, las tres `Stack.Screen` a `options={{ headerShown: false }}`.
3. Refactor: ninguno previsto.

### R2 — `titlePlaceholder` en `ScreenHeader`
1. Rojo: dos `it` `#204 R2` en `src/components/__tests__/screen-header.test.tsx`.
2. Verde: prop opcional `titlePlaceholder?: ReactNode` en `src/components/screen-header.tsx`, pintada en la columna `flex-1` cuando `title` falta.
3. Refactor: ninguno.

### R3 — `MOTION_REMINDERS_STAGGER_MS`
1. Rojo: `it('#204 R3: …')` en `src/theme/__tests__/motion.test.ts`; enmienda I12.
2. Verde: `export const MOTION_REMINDERS_STAGGER_MS = 70;` en `src/theme/motion.ts`.
3. Refactor: ninguno.

### R4 — Cabecera y marco de Recordatorios
1. Rojo: tres `it` `#204 R4` en `src/screens/reminders/index.test.tsx`; enmiendas I3, I6, I7, I8, I9, I10, I11.
2. Verde: `ScreenHeader testID="reminders"` con `accessory` «Nuevo», marco `insets.top + 12`, sin `contentInsetAdjustmentBehavior`.
3. Refactor: quitar imports que queden sin uso.

### R5 — Estados bajo la cabecera y sin mascotas
1. Rojo: it.each `#204 R5` (4 estados) e `it` de sin mascotas.
2. Verde: `reminders-no-pets-frame` con `ScreenHeader` solo-volver encima del contenedor intacto.
3. Refactor: ninguno.

### R6 — `RiseIn` en filas de Recordatorios
1. Rojo: `it('#204 R6: …')` con el doble de `rise-in`; enmiendas I13 e I30.
2. Verde: `RiseIn` con `delayMs={i * MOTION_REMINDERS_STAGGER_MS}`; quitar el import de `home-entrance`.
3. Refactor: ninguno.

### R7 — Ámbar de la fila próxima
1. Rojo: `it('#204 R7: …')`; enmiendas I5, I14, I24, I25.
2. Verde: `border-2 border-category-amber` y badge con `CATEGORY_SLOTS.amber.surface` / `.ink`.
3. Refactor: ninguno.

### R8 — «Eliminar» de fila
1. Rojo: `it('#204 R8: …')`; enmiendas I27 (parte R8) e I31 (parte R8).
2. Verde: receta `h-11 rounded-14 px-2.5 ${CATEGORY_SLOTS.rose.surface}`, sin `size`, etiqueta `Text` 13/800.
3. Refactor: ninguno.

### R9 — «Eliminar» de la hoja
1. Rojo: `it('#204 R9: …')`; enmiendas I15, I23, I27 (parte R9), I28, I29, I31 (parte R9).
2. Verde: `h-14 w-full rounded-16 bg-danger` con `style={chunkyLip.danger}` y etiqueta `Text` 17/800.
3. Refactor: ninguno.

### R10 — Cabecera, marco y teclado de Agregar
1. Rojo: cuatro `it` `#204 R10` en `src/screens/add-reminder/index.test.tsx`; enmiendas I16, I17, I18, I19.
2. Verde: `ScreenHeader testID="add-reminder" size={24}`, marco con `flexGrow: 1`, sin `HeaderHeightContext` ni `keyboardVerticalOffset`.
3. Refactor: quitar `useContext` si queda sin uso.

### R11 — «Guardar» al pie
1. Rojo: `it('#204 R11: …')`; enmienda I26.
2. Verde: `mt-auto` delante de la receta de `add-reminder-submit`.
3. Refactor: ninguno.

### R12 — Cabecera, marco y teclado de Documentos
1. Rojo: cinco `it` `#204 R12` en `src/screens/docs/index.test.tsx`; enmiendas I20 e I21.
2. Verde: `ScreenHeader testID="docs-header"` con eyebrow, `title` o `titlePlaceholder`; marco `insets.top + 12`; sin `HeaderHeightContext` ni `keyboardVerticalOffset`.
3. Refactor: ninguno.

### R13 — Estados de Documentos bajo la cabecera
1. Rojo: it.each `#204 R13` (4 estados). Si nace verde por R12, apuntarlo en el informe («filas que nacen verdes por requisito previo») y plantar una mutación (mover `docs-header` detrás del estado) para ver su rojo.
2. Verde: sin cambio de producción esperado más allá de R12.
3. Refactor: ninguno.

### R14 — `RiseIn` en filas de Documentos
1. Rojo: `it('#204 R14: …')` con el doble de `rise-in`; enmienda I22.
2. Verde: `RiseIn` con `delayMs={index * MOTION_STAGGER_MS}`; quitar el import de `home-entrance`.
3. Refactor: ninguno.

### R15 — Fidelidad al canvas
1. Commit único `test(#204 R15)`: crear `src/__tests__/routine-canvas-fidelity.test.ts` con las once filas; mutación plantada y revertida, apuntada en el informe.

### R16 — Enmienda #204 en la carta
1. Rojo: `it('#204 R16: …')` en `routine-canvas-fidelity.test.ts`.
2. Verde: añadir al final de `docs/ui-guidelines.md` el bloque canónico de design.md § Bloque «Enmienda #204», sin editar ninguna línea existente.

### R17 — Fuentes limpias
1. Commit único `test(#204 R17)`: it.each sobre los cuatro ficheros; mutación plantada y revertida, apuntada en el informe.

### R18 — Smoke en dispositivo
Lo hace el humano (requirements.md § Cierre del humano). No bloquea la implementación.
