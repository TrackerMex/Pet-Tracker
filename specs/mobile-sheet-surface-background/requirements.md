---
feature: "mobile-sheet-surface-background"
status: approved
tags: [harness, spec]
---

# Requisitos — [[mobile-sheet-surface-background]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, el inventario cerrado de candados y las
> anclas de medición, y [[../../docs/architecture|architecture]] para las reglas de
> arquitectura.
> Origen: `progress/plan_ui-2026-10-26.md` §0, §1 («Cajón de borrar»), §2 entrada #218
> (punto 9 de la petición de mejoras de UI) y
> `progress/explore_ui-tema-barra-drawer-2026-10-26.md` §(C).
> Todas las rutas son relativas a `mobile-pet-tracker/src/` salvo que se diga otra cosa.
> Medido sobre `origin/dev` = `81ca7529` (worktree `Pet-Tracker-wt-218`).

## Contexto y decisión del humano (cerrada, plan §1)

- Síntoma: el cajón «¿Eliminar recordatorio?» (y el de «¿Desvincular collar?») muestra
  franjas de color rosa del sistema alrededor del contenido, que es `bg-surface`.
- Causa (confirmada leyendo el código instalado de `@expo/ui` 57.0.11,
  `community/bottom-sheet/BottomSheet.android.tsx`): el contenedor nativo
  (`ModalBottomSheet` de Material 3) solo recibe `containerColor` si el `BottomSheet`
  recibe `backgroundStyle`; hoy ninguna de las dos pantallas lo pasa y Material 3 usa su
  color de superficie por defecto. Que ese color sea el tinte dinámico del sistema
  (Material You) es **hipótesis**: la confirma el gate G2 en dispositivo.
- Decisión del humano: **Recordatorios + Vinculación** con `backgroundStyle` por el token
  **`surface`** en ambos `BottomSheet`, **sin tocar `snapPoints`**.
- Solo hay dos `BottomSheet` en la app (`screens/reminders/index.tsx` y
  `screens/pairing/index.tsx`; la pantalla de «Vinculación» vive en `screens/pairing/`).
  Ambos son de `@expo/ui/community/bottom-sheet`, no de HeroUI.

## Requisitos funcionales

### Recordatorios

- **R1**: WHEN el usuario pulsa el botón de borrar de un recordatorio
  (`reminder-delete-<id>`) THE SYSTEM SHALL montar el `BottomSheet` de
  `reminders-delete-host` con la prop `backgroundStyle` aplanada igual a
  `{ backgroundColor: <valor que useThemeColors devuelve para 'surface'> }`, es decir,
  exactamente una clave (`backgroundColor`) y ninguna otra. Con el doble de
  `useThemeColors` del fichero de test (`color:<token>`), ese valor es
  `'color:surface'`. El valor SHALL salir de
  `const [surface] = useThemeColors(['surface']);` y no de un literal.
  - Test: `screens/reminders/index.test.tsx`, nuevo
    `describe('#218 R1: el cajón de borrar pinta su contenedor con el token surface')`
    con `it('#218 R1: backgroundStyle del BottomSheet de borrar es exactamente el token surface')`:
    `renderReminders()`, `await screen.findByTestId('reminder-row-a')`,
    `await fireEvent.press(screen.getByTestId('reminder-delete-a'))`, el nodo
    `within(screen.getByTestId('reminders-delete-host')).getByTestId('community-bottom-sheet')`
    y `expect(flat(sheet.props.backgroundStyle)).toEqual({ backgroundColor: 'color:surface' })`
    con el helper `flat` que el fichero ya define arriba (no `StyleSheet`, ver
    [[design]] §Candados). Rojo hoy: `flat(undefined)` es `{}`.
    Falla si se quita la prop, si se cambia el token (`'color:background'`,
    `'color:danger'`...) o si se pone un literal (`'#FFFFFF'`).

### Vinculación

- **R2**: WHEN el usuario pulsa «Desvincular collar» (`device-unpair`) THE SYSTEM SHALL
  montar el `BottomSheet` de `pairing-unpair-host` con la prop `backgroundStyle`
  aplanada igual a `{ backgroundColor: <valor que useThemeColors devuelve para 'surface'> }`
  (con el doble del test, `'color:surface'`), obtenido de
  `const [surface] = useThemeColors(['surface']);`.
  - Test: `screens/pairing/index.test.tsx`, dentro de
    `describe('#203 R7: hoja de desvincular')`, nuevo
    `it('#218 R2: backgroundStyle del BottomSheet de desvincular es exactamente el token surface')`:
    `await openUnpairSheet()` (helper del describe, que espera con `findByTestId`),
    `within(screen.getByTestId('pairing-unpair-host')).getByTestId('community-bottom-sheet')`
    y `expect(Object.assign({}, ...[community.props.backgroundStyle].flat(Infinity).filter(Boolean))).toEqual({ backgroundColor: 'color:surface' })`.
    Rojo hoy y con las mismas tres mutaciones de R1 (quitar, otro token, literal).

### Inventario de cajones

- **R3**: THE SYSTEM SHALL tener exactamente dos ficheros de producción que importan
  `@expo/ui/community/bottom-sheet` (`screens/pairing/index.tsx` y
  `screens/reminders/index.tsx`), y cada uno SHALL montar un único `<BottomSheet` con la
  línea literal `backgroundStyle={{ backgroundColor: surface }}` (una sola vez) y
  declarar `const [surface] = useThemeColors(['surface']);`. WHEN alguien añade un tercer
  `BottomSheet` en otro fichero o quita el `backgroundStyle` de uno de los dos THEN el
  candado SHALL fallar.
  - Test: fichero nuevo `__tests__/sheet-surface-background.test.ts`
    (`describe('#218 R3: todo BottomSheet de la app pasa el token surface')`):
    1. `it('#218 R3: solo Recordatorios y Vinculación montan un BottomSheet')`: lista de
       importadores de `src/` (sin `__tests__/` ni `*.test.*`) igual a
       `['screens/pairing/index.tsx', 'screens/reminders/index.tsx']`.
    2. `it.each(importers)('#218 R3: %s monta un BottomSheet con backgroundStyle surface')`:
       `source.match(/<BottomSheet(?![A-Za-z])/g)` tiene longitud 1,
       `source.split('backgroundStyle={{ backgroundColor: surface }}')` tiene longitud 2 y
       `source` contiene `const [surface] = useThemeColors(['surface']);`.
    Mutaciones verificadas por el autor de la spec sobre una copia de `dev`: quitar la
    línea de un fichero pone rojo su fila; plantar un tercer importador pone rojo el
    inventario y su fila; cambiar `'surface'` por `'background'` pone rojo la fila. El
    `it` de inventario **nace verde** (la lista ya es exactamente esa), lo declara el
    implementer en `progress/impl_mobile-sheet-surface-background.md`; sus dos filas
    `it.each` nacen rojas.

### Contrato del cajón (sin regresión)

- **R4**: THE SYSTEM SHALL conservar en los dos `BottomSheet` `index` (0 abierto, -1
  cerrado), `enablePanDownToClose`, `onClose` y `snapPoints={['50%', '100%']}`, y en el
  `View` interior de cada uno el `className` exacto
  `items-center gap-3 bg-surface px-5 pb-9 pt-3` (`reminders-delete-sheet` y
  `pairing-unpair-sheet`), sin añadir, quitar ni reordenar hijos.
  - Test: sin tests nuevos; lo cierran los existentes, que no se editan:
    `screens/reminders/index.test.tsx` → el helper `confirmDelete()` (aserta con
    `expect.objectContaining({ index: 0, onClose: expect.any(Function), enablePanDownToClose: true, snapPoints: ['50%', '100%'] })`)
    y `it('centra los cinco hijos del sheet con el marco del canvas')` (className exacto y
    5 hijos); `screens/pairing/index.test.tsx` →
    `it('#203 R7.2: desvincular abre la hoja con su anatomía y sin diálogo nativo')`
    (`index`, `enablePanDownToClose`, `snapPoints`, className exacto, orden de hijos).
    Los dos `it` nuevos de R1 y R2 repiten además `snapPoints` `['50%', '100%']`.
    Verificación de «no editados»: `git diff --numstat <H0> -- mobile-pet-tracker/src/screens/reminders/index.test.tsx mobile-pet-tracker/src/screens/pairing/index.test.tsx`
    muestra **0 líneas borradas** en las dos filas (solo adiciones).

### Sin literales de color

- **R5**: THE SYSTEM SHALL obtener el color del contenedor exclusivamente vía
  `useThemeColors` (regla 9 de `docs/ui-guidelines.md`), sin hex, sin `StyleSheet`, sin
  clase arbitraria ni sombra suelta en los dos ficheros de pantalla (regla 1).
  - Test: no se añade ninguno; lo cierran cuatro `it` existentes, verificados por el
    autor de la spec plantando `backgroundStyle={{ backgroundColor: '#FFFFFF' }}` en una
    copia de `dev` (los cuatro se ponen rojos con esa mutación y verdes sin ella):
    `design-drift.test.ts` → `#193 R11: grep-clean de Inicio, Perfil y Recordatorios` /
    `mantiene las tres pantallas sin escapes de estilo literales`;
    `R11 (mobile-device-pairing): ...` / `keeps pairing free of forbidden styling escapes`;
    `#68 R18: la actividad semanal no mete drift de estilo` /
    `keeps arbitrary text, hex colors, and StyleSheet out of feature sources`;
    `#178 R13: Recordatorios sin deriva` /
    `no deja escapes de estilo, radios vetados ni text-accent suelto`. Y los `it` de R1 y
    R2 (un literal da `'#FFFFFF'`, no `'color:surface'`).

### Diff mínimo y candados

- **R6**: THE SYSTEM SHALL limitar el cambio de producción a **dos líneas añadidas y
  ninguna borrada** en cada fichero: la declaración `const [surface] = useThemeColors(['surface']);`
  y la línea `backgroundStyle={{ backgroundColor: surface }}` como última prop del
  `<BottomSheet` (justo después de `snapPoints={['50%', '100%']}`), de modo que la
  segunda PR en mergear con #213 (que también edita `screens/reminders/index.tsx`)
  resuelva con `merge` de `origin/dev`, nunca con rebase. WHEN se aplica el cambio THE
  SYSTEM SHALL dejar verdes, **sin enmienda alguna**, todos los candados que leen esas
  fuentes (inventario en [[design]] §Candados), `bun run typecheck` y `expo lint`.
  - Test: no se añade ninguno; verificación en el reporte del implementer, con las
    anclas de [[design]] §Anclas: `git diff --numstat <H0> -- mobile-pet-tracker/src/screens/reminders/index.tsx mobile-pet-tracker/src/screens/pairing/index.tsx`
    da `2	0` en cada fila; jest completo sin pipe verde; `tsc --noEmit` y `expo lint`
    limpios (con `test ! -s` sobre el log del lint, memoria `expo-lint-traga-sigkill`).

## Fuera de alcance

- `snapPoints` y el alto del cajón: la banda sobrante bajo «Cancelar» por el 50 % de
  alto **no se toca** (decisión del humano); con el fondo unificado deja de verse como
  franja de otro color.
- El scrim gris (`BottomSheet.android.tsx` solo expone `containerColor`) y el color o
  el tamaño del drag handle (`handleComponent`).
- Un componente compartido `AppBottomSheet` o un envoltorio con el fondo por defecto:
  dos usos, y R3 ya obliga a que un tercero declare el fondo.
- El token `background`, el color de `Card` y cualquier valor de `global.css`
  (`--surface` ya existe en claro `#FFFFFF` y oscuro `#161B22`).
- Los diálogos nativos del selector de fecha/hora (#220) y `confirm-dialog.tsx`.
- Enmiendas a `docs/ui-guidelines.md` o `docs/conventions.md`: ninguna; la regla 9 ya
  cubre este uso (por eso no hay casilla humana de enmienda, plan §4).
- El comportamiento de iOS (la app es solo Android; en iOS el mismo `backgroundStyle`
  alimenta `presentationBackground`).
- Pruebas en dispositivo, tema oscuro real y Material You: no se pueden probar en jest
  (casilla de cierre abajo, gate G2).

## Aprobación

- [x] Aprobado por humano (firma delegada del leader, mandato 2026-10-23 ampliado 2026-10-26; fecha: 2026-10-26) ← gate obligatorio antes de implementar
  (se firma por delegación del leader, mandato del 2026-10-23 ampliado el 2026-10-26,
  con la checklist de `progress/plan_canvas-parity-2026-10-23.md` §4 y los tres puntos
  de `progress/plan_ui-2026-10-26.md` §4).
- [ ] Smoke de los dos cajones en dev build Android hecho y aprobado por el humano
  (cierre, no gate de implementación; gate G2 del plan, `progress/smoke_ui.md`).
  Pasos: Recordatorios → borrar un recordatorio, y Vinculación → «Desvincular collar»,
  en tema claro y oscuro y con Material You activo (cambiar el fondo de pantalla del
  teléfono si hace falta). Pasa si **no hay franja rosa** ni de otro color alrededor del
  contenido, el cajón es del mismo color que el cuerpo (blanco en claro, `#161B22` en
  oscuro, nunca negro/ink de texto), el scrim y el handle siguen como antes y los dos
  botones responden. Si queda una franja distinta, es otra causa (alto, handle): otra
  spec, no se reabre esta.
