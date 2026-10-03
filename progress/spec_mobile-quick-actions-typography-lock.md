---
feature: "mobile-quick-actions-typography-lock"
id: 81
tipo: reporte de spec_author
fecha: 2026-09-29
---

# Spec de #81: medidas, sondas y decisiones

Spec en `specs/mobile-quick-actions-typography-lock/`. Worktree
`Pet-Tracker-wt-backend`, branch `feature/81-mobile-quick-actions-typography-lock`,
base `4efb6c81` (= `origin/main`, con #100 mergeado). El worktree principal
(#132) no se ha leído ni tocado.

## Base medida

- `test ! -e .expo/types/router.d.ts`: no existe.
- Suite completa sin pipe: 86 suites / 1597 tests / 1 snapshot, `exit=0`,
  33 bloques `Console`.
- `index.test.tsx`: 159 tests, 40 `describe` de primer nivel, `#81` 0 veces,
  `quick-actions-row` 1 vez.
- Blobs de base: `index.tsx` `ff591a1f567e00c0aee57db29ca1706b3a925cad`,
  `index.test.tsx` `234bd11772b8c1c8dce1782c620ae1a5e0c53368`.

## Test prototipo (no commiteado)

Para medir las sondas se escribió el `describe` de #81 con sus siete `it`
en una copia fuera del árbol, que se copió sobre `index.test.tsx` solo durante
cada sonda y se restauró con `git checkout HEAD --`. **No va en el commit**:
la spec lo prescribe literal en `tasks.md` y lo escribe Codex.

- Blob final prescrito: `f91c8971e21198c4a65eebf0e40aaf35f0ac6472`: 166
  tests, 41 `describe`, `#81` 11 veces (todas `#81 R[1-6]`),
  `quick-actions-row` 5 veces, `stylesheet|text-[10px]` 0 y `-[` 0.
- Blobs por paso: R1 `43d73077`, R2 `89ee0a77`, R3 `9f447048`, R4 `48b550b4`,
  R5 `0c5b27f5`, R6 `f91c8971`.
- Con el prototipo y la Home de base: suite 1604/1604 verde, 33 bloques
  `Console`, `tsc --noEmit` `exit=0`, `eslint` de los dos ficheros `exit=0`.

## Sondas sobre la base («Hoy»)

Suite completa; tras cada una, `git checkout HEAD --`, y porcelain de
`mobile-pet-tracker` y `diff --cached` vacíos en todas.

| Sonda | Blob Home | Resultado |
|---|---|---|
| `e13`, `m4_title_style`, `a2_0`, `a2_1`, `m2_swap0`, `m2_swap2`, `m3_round0`, `m3_round2`, `e12_0`, `e12_1`, `e1_style`, `m5_one_1`, `m5_one_2`, `m6_tile0` | ver `tasks.md` | verde, 1597/1597 |
| `m6_tile1` | `cd0f6a17` | rojo 1: `#71 R1 › dibuja el rótulo y los tres tiles en orden`, por `toEqual` |
| `m6_tile2` | `e6fee5b7` | rojo 1: `#71 R1 › usa iconos de reicon y ningún emoji`, `Unable to find an element with testID: quick-action-documents` |

El resto de la columna «Hoy» (`a1`, `a2`, `m1_*`, `b`, `m2_swap1`, `c`, `e9`,
`e1`, `e2`, `e6`, `m3_round1`, `e12`, `e11`, `e3`, `e4`, `m4_style`, `e5`,
`e5b`, `e7`, `m5_aria`, `m5_one`, `e8`, `e8b`, `m6_both`, `m6_tile`, `d`,
`e10`) se midió antes, en la misma sesión, con el mismo procedimiento. Todas
dan verde salvo `d` (rojo 1 en `#71 … usa iconos…`) y `e11` (rojo 2: #62 R14
y #98 R10).

**Hallazgo `m6_tile1`/`m6_tile2`.** El rojo de hoy no viene de un candado de
la condición de render. Viene de que los `it` de #71 esperan a
`quick-action-weight` (tile 0) y aseveran los otros tiles mientras la
actividad sigue cargando. Si el tile condicionado es el 0, `findByTestId`
espera y todo queda verde (`m6_tile0`). La condición de render sigue sin
candado hoy, y R6 la cierra.

## Sondas sobre el árbol final («Tras #81»)

Suite completa, 1604 tests, todas `exit=1`, porcelain y cached vacíos:

| Sondas | Rojo |
|---|---|
| `a1`, `a2_0`, `a2_1`, `a2`, `m1_bold` | 1: R1, por `toBe` |
| `m1_style` | 1: R1, por `toBeUndefined` |
| `b`, `m2_swap0`, `m2_swap1`, `m2_swap2` | 1: R2, por `toHaveProperty(path, value)` |
| `c`, `e9` | 1: R2, por `toHaveLength` |
| `e1`, `e2` | 1: R2, por `not.toMatch` |
| `e1_style`, `e6`, `m3_round0`, `m3_round1`, `m3_round2`, `e12_0`, `e12_1`, `e12` | 1: R3, por `toEqual` |
| `e11` | 3: R3 (`toEqual`), #62 R14 y #98 R10 (`toHaveLength`) |
| `e3` | 1: R4, por `toHaveProperty(path, value)` |
| `e4`, `e5`, `e5b` | 1: R4, por `toBe` |
| `m4_style`, `m4_title_style` | 1: R4, por `toBeUndefined` |
| `e13` | 1: R4, por `toEqual` |
| `e7`, `m5_aria`, `m5_one` | 1: R5, por `expect(instance).toHaveAccessibleName()` |
| `d` | 1: `#71 R1 › usa iconos…`, por `toHaveLength`; ningún `it` de #81 |

Solo `index.test.tsx` (por el cierre que pidió el leader):

| Sonda | Blob Home | Resultado |
|---|---|---|
| `m6_both` | `256e5a7e` | `exit=1`, 2 de 166: los dos `it` de R6, por consulta (`Unable to find an element with testID: quick-actions-row`) |
| `e10` | `72cfc47c` | `exit=0`, 166/166: la composición interior queda libre |

**No validadas en spec** (el lote se paró por el cierre): `m5_one_1`,
`m5_one_2`, `e8`, `e8b`, `m6_tile`, `m6_tile0`, `m6_tile1` y `m6_tile2`.
`tasks.md` §Sondas las marca así. Su «Exigido» es un mínimo (los `it` que
nombra tienen que estar entre los rojos), y el implementer anota los rojos de
más sin parar.

Los rojos de cada paso (R1 1/1598 … R5 1/1602, R6 2/1604) están **derivados,
no medidos** con el test a medio escribir. Cada mutación roja (`a1`, `b`, `e6`,
`e4`, `e7`, `m6_both`) se midió con los siete `it`, y solo pone rojo el `it`
de su requisito. En el paso k solo existen R1 a Rk, así que el rojo es el mismo.

## Veredicto sobre las premisas de la entrada

- `index.tsx:544-555`: **caducada**. Las anclas de la spec van por contenido.
- «68/68 y 1054/1054»: **caducadas**. La base es 86 suites / 1597 tests.
- O6 (orden de los hijos de la fila): **ya cerrado por #85 R7**. La sonda
  (Home `705984ec`) da rojo en `#85 R7 › fija la posición de los hijos de cada
  fila`, por `toHaveProperty`. Queda como (N) en §Fuera de alcance.
- `docs/ui-guidelines.md` en `files_affected`: **no hace falta**. La regla de
  `children[i]` ya está en §Enmienda #70, punto 12. No se toca, y
  `feature_list.json` tampoco se corrige (instrucción del leader).
- «Las otras seis quedaron bajo candado»: **cierta para las seis, falsa como
  inventario**. Seguían abiertos el nombre accesible, la condición de render,
  el radio, la anatomía y el orden, y la sección y la fila.
- El tamaño del icono ya tenía candado (sonda `d`).
- El feedback de pulsación no tiene id. Va como (F) sin id.

## Decisiones de la spec

- Siete `it` en un `describe` de #81, entre el de #71 R1 y el de #85 R1. Se
  asevera sobre nodos host, tile a tile, con esperados literales. No hay
  imports nuevos.
- R1 usa `toBe` sobre la receta entera y `style` `toBeUndefined()`, porque
  `toContain` deja pasar `m1_bold`.
- R2 fija la anatomía de D1: dos hijos, el icono en `children[0]` y la
  etiqueta en `children[1]`. Eso cierra W4 (`c`), el envoltorio (`e9`) y la
  dirección (`e1`, `e2`, con `not.toMatch`).
- `items-center gap-1.5 py-3` **quedan libres**, porque ninguna decisión D los
  fija. La prueba es `e10`, que da verde.
- R3 exige que los tokens `rounded*` sean exactamente `['rounded-xl']` y que
  `style` sea `toEqual({ borderCurve: 'continuous' })`.
- R4 cierra los dos contenedores contando `children`, más el `style` del
  rótulo.
- R5 usa `toHaveAccessibleName`. La etiqueta redundante igual al texto se
  deja como (D): no cambia lo que se oye, y cerrar la prop sería una lista
  abierta.
- R6 tiene dos escenarios de error (detalle `unreachable`, actividad
  `error`). El rojo es por consulta si se condiciona la sección, y por
  aserción si se condiciona un tile.
- C4 va por la vía b: mutación versionada en el commit rojo y
  `git checkout HEAD~1 --` en el verde. El diff de producción acaba vacío.
- R7 da la base como suma, 1597 + 7 = 1604. «Ninguna cifra de candado se
  mueve» es criterio de aceptación.
- Coordinación: #132 solo toca `weekly-activity-chart.test.tsx`. #129
  (`pending`) lista `index.test.tsx`, y si mergea antes cambia el blob y la
  spec manda parar.

## Estado del árbol al cerrar

`index.tsx` e `index.test.tsx` restaurados con `git checkout HEAD --`,
`git diff --cached` vacío y porcelain limitado a ` M progress/current.md` (del
leader, no se commitea) más la spec y este reporte.
