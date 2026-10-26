---
feature: "mobile-sheet-surface-background"
status: approved
tags: [harness, spec]
---

# Diseño — [[mobile-sheet-surface-background]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Solo toca `mobile-pet-tracker/` (presentación). Rutas relativas a
> `mobile-pet-tracker/src/` salvo que se diga otra cosa. Medido sobre `origin/dev` =
> `81ca7529`.

## Decisiones técnicas

- **`backgroundStyle` con el token `surface` en cada `BottomSheet` (R1, R2).**
  `BottomSheet.android.tsx` de `@expo/ui` 57.0.11 solo pasa `containerColor` al
  `ModalBottomSheet` de Material 3 si recibe `backgroundStyle` (extrae el
  `backgroundColor` de `StyleSheet.flatten(backgroundStyle)`); sin él, Material 3 usa su
  color por defecto, que es la franja rosa. Pasarle `surface` iguala el contenedor
  nativo con el `bg-surface` del contenido. Es una prop de un componente de terceros que
  no admite `className`, así que es un color imperativo: **regla 9** de
  `docs/ui-guidelines.md` (`useThemeColors`), sin hex (regla 1).
- **Forma exacta del cambio (R6).** En cada fichero, dos líneas añadidas y ninguna
  borrada:
  1. `const [surface] = useThemeColors(['surface']);`
     - `screens/reminders/index.tsx`: justo antes de `const categoryInk = {`.
     - `screens/pairing/index.tsx`: justo después de
       `const [muted, danger] = useThemeColors(['muted', 'danger']);`.
     Una llamada aparte (no ampliar el array existente) para no cambiar la línea
     existente: el diff es solo adiciones y no choca con #213 en `reminders/index.tsx`.
  2. `backgroundStyle={{ backgroundColor: surface }}` como **última prop** del
     `<BottomSheet`, justo después de la línea `snapPoints={['50%', '100%']}`.
  Cableado como objeto literal en línea (patrón de `weekly-activity-chart.tsx`, que ya
  usa `'surface'`); no se crea constante ni helper.
- **Candado de inventario en un fichero nuevo (R3).** Hoy nada obliga a que un tercer
  `BottomSheet` declare su fondo. `__tests__/sheet-surface-background.test.ts` lee las
  fuentes y exige: importadores de `@expo/ui/community/bottom-sheet` = exactamente los
  dos ficheros, y en cada uno una apertura `<BottomSheet`, la línea literal del
  `backgroundStyle` una sola vez y la declaración de `surface`. Cabecera copiada de
  `__tests__/consistency-classnames.test.ts` (`declare function require` para `fs` y
  `path`); su propio `sourceFiles()` salta `__tests__/` y `*.test.ts(x)`. No se
  reutilizan helpers de otros guards (no se exportan; copiar 10 líneas es menos
  acoplamiento que exportarlos).
- **Sin tests para R4, R5, R6.** Los cierran tests y guards existentes (ver
  [[requirements]]); el diff de producción los deja verdes sin editarlos.
- **La verificación visual es humana (G2).** Jest ve la prop, no el pixel nativo. La
  casilla del humano está en [[requirements]] §Aprobación.

## Archivos afectados

Presentación (`mobile-pet-tracker/src/`):

- `screens/reminders/index.tsx` — +2 líneas (R1, R5, R6).
- `screens/pairing/index.tsx` — +2 líneas (R2, R5, R6).
- `screens/reminders/index.test.tsx` — **solo adiciones**: un `describe` nuevo
  (`#218 R1`) con un `it`, colocado justo antes de
  `describe('#178 R9: el vacío ofrece crear'`; su `beforeEach` se copia del de
  `describe('#204 R9: Eliminar de la hoja'` (el que ya renderiza con un recordatorio `a`). Reusa `flat`.
- `screens/pairing/index.test.tsx` — **solo adiciones**: un `it` (`#218 R2`) dentro de
  `describe('#203 R7: hoja de desvincular'`, justo antes de
  `it('#203 R7.3: Cancelar cierra sin liberar'`. Sin `StyleSheet` (ver Candados).
- `__tests__/sheet-surface-background.test.ts` — **nuevo** (R3).

Sin cambios en domain, application, infrastructure, backend, `global.css`,
`ui-copy-table.ts`, `docs/` ni `feature_list.json` (lo gestiona el leader).

## Candados (inventario cerrado, todos medidos)

Medido por el autor de la spec aplicando el cambio completo (producción + los tres
tests) a una copia de `dev` y ejecutando jest, `tsc --noEmit` y `expo lint`: **ningún
candado existente necesita enmienda**.

- `__tests__/design-drift.test.ts` — cuatro `it` leen estas fuentes (`#193 R11`, `R11
  (mobile-device-pairing)`, `#68 R18`, `#178 R13`): el cambio no añade hex, `StyleSheet`
  ni clases arbitrarias, así que siguen verdes (R5). **Trampa:** `#68 R18` lee también
  `screens/pairing/index.test.tsx` y veta la palabra `StyleSheet` (sin distinguir
  mayúsculas) en él, por eso el `it` de R2 aplana con
  `Object.assign({}, ...[x].flat(Infinity).filter(Boolean))` y no con `StyleSheet.flatten`.
  El de R1 reutiliza el helper `flat` que ya existe en `reminders/index.test.tsx`.
- `__tests__/consistency-classnames.test.ts` — R13 (importar `useThemeColors`): ambos
  ficheros ya lo importan; sin cambio. Los `className` de `reminders-delete-sheet` y
  `pairing-unpair-sheet` no se tocan.
- `__tests__/legibility-classnames.test.ts` — no se añade ni cambia ningún `className`.
- `__tests__/ui-copy-table.ts` (y sus `ALL_USES` / `SCREEN_FILES`) — no se añade copy
  ni se mueve ninguna fila; sin catálogo nuevo.
- `screens/reminders/index.test.tsx` y `screens/pairing/index.test.tsx` — los `it`
  existentes de contrato (`confirmDelete()`, «centra los cinco hijos», `#203 R7.2`)
  asertan `index`, `enablePanDownToClose`, `snapPoints`, className y orden de hijos, no
  la ausencia de otras props: añadir `backgroundStyle` no los rompe (R4).
- Candado nuevo `__tests__/sheet-surface-background.test.ts` (R3). Su nombre no cae bajo
  ningún selector por prefijo de los guards existentes.

Cuentas encadenadas (jest sobre `src/`, medido sobre `dev` + cambio completo): los
guards y tests de pantalla afectados suman **37 suites / 1138 tests** verdes; el
implementer debe reportar los totales de jest completo medidos sin pipe y no heredar
esta cifra (caduca al mergear #213 u otra, ver memoria `constantes-congeladas-en-specs`).

## Anclas de medición (con salida esperada)

Ejecutar desde `mobile-pet-tracker/src`. Las cifras «antes» se miden sobre `dev` antes
del cambio; las «después» tras la implementación (cifra = base + delta).

| Ancla | Antes | Después |
|---|---|---|
| `grep -cF "backgroundStyle" screens/reminders/index.tsx` | 0 | 1 |
| `grep -cF "backgroundStyle" screens/pairing/index.tsx` | 0 | 1 |
| `grep -cF "useThemeColors(" screens/reminders/index.tsx` | 1 | 2 |
| `grep -cF "useThemeColors(" screens/pairing/index.tsx` | 1 | 2 |
| `grep -cF "snapPoints={['50%', '100%']}" screens/reminders/index.tsx` | 1 | 1 |
| `grep -cF "snapPoints={['50%', '100%']}" screens/pairing/index.tsx` | 1 | 1 |
| `grep -cF "items-center gap-3 bg-surface px-5 pb-9 pt-3" screens/reminders/index.tsx` | 1 | 1 |
| `grep -cF "items-center gap-3 bg-surface px-5 pb-9 pt-3" screens/pairing/index.tsx` | 1 | 1 |
| `grep -cF "#218" screens/reminders/index.test.tsx` | 0 | 2 |
| `grep -cF "#218" screens/pairing/index.test.tsx` | 0 | 1 |
| `grep -cF "community-bottom-sheet" screens/reminders/index.test.tsx` | 6 | 7 |
| `grep -cF "community-bottom-sheet" screens/pairing/index.test.tsx` | 4 | 5 |

(`#218` en reminders = el `describe` + el `it`; en pairing, solo el `it`. Los 6 y 4 de
`community-bottom-sheet` son los del doble del módulo y los `getByTestId` existentes; si
el conteo «antes» difiere en el momento de implementar, la base la manda `git show
<H0>:<ruta> | grep -cF ...` y el «después» es base + 1.)

Orden de comandos del handoff: `git diff --numstat <H0> -- <ruta>` por commit (memoria
`handoff-diff-contra-head-del-handoff`), `prettier --write` no aplica en móvil, y
`cd` literal a `mobile-pet-tracker` antes de jest/tsc/lint.

## Alternativas descartadas

- **Componente compartido `AppBottomSheet` con el fondo por defecto**: dos usos y ya hay
  un candado (R3) que impide un tercero sin fondo; el envoltorio añade un fichero, un
  re-export y obliga a tocar los dos imports (más superficie de conflicto con #213).
- **Ampliar la llamada existente `useThemeColors(['muted','danger'])` en pairing y la
  de reminders**: cambia líneas existentes (diff con borrados) y reordena los
  desestructurados; una llamada aparte son dos líneas puramente añadidas.
- **Cambiar `snapPoints` para que el cajón se ajuste al contenido**: el humano decidió
  explícitamente no tocarlos (plan §1).
- **Tinte en tema oscuro con otro token (`background`, `card`)**: `surface` es el que
  usa el contenido (`bg-surface`) y ya tiene valor claro y oscuro; otro token dejaría
  una franja de otro tono.
- **Guard por AST o regex de `backgroundStyle` en todo `src/`**: el inventario por
  importador + cadena literal es más corto y suficiente para dos usos (YAGNI).

## Riesgos y supuestos que no se prueban en jest

- **Que el rosa sea el tinte dinámico de Material You** es hipótesis (sin dispositivo
  no hay forma de verlo); si tras el cambio queda franja, es otra causa y va en otra
  spec. Lo decide el smoke G2.
- **Que `useThemeColors(['surface'])` resuelva en dispositivo**: el hook lee
  `Uniwind.getCSSVariable('--color-surface')` y cae a `--surface` y luego al color de
  primer plano; `global.css` define `--surface` en claro y oscuro y
  `weekly-activity-chart.tsx` ya lo usa con éxito. Si en dispositivo cayera al
  foreground el cajón saldría del color del texto: el smoke lo detecta (criterio «nunca
  negro/ink de texto»).
- **Conflicto con #213** (`mobile-reminders-recurrence`, pendiente) en
  `screens/reminders/index.tsx`: ambas PRs tocan ese fichero. Las dos líneas son
  adiciones aisladas; la segunda PR que mergee resuelve con `git merge origin/dev`, no
  con rebase (memoria `rebase-invalida-hashes-traceability`), y se vuelve a medir la
  tabla de anclas.
