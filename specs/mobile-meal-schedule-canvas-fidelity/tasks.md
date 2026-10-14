---
feature: "mobile-meal-schedule-canvas-fidelity"
status: draft
tags: [mobile, ui, spec]
---

# #179 mobile-meal-schedule-canvas-fidelity — Tareas

> Base congelada `fb5b209f`. Abreviaturas de ficheros (MS, MH, MST, MHT, MGT,
> LY, LYT, UC, CC, DD, LG) en requirements.md §Base medida. Todas las
> órdenes se lanzan con `cd mobile-pet-tracker` explícito, `bunx` (nunca
> `npx`) y `--testTimeout=30000`. Ningún R asevera un nodo que su tarea no
> crea: el orden T4–T12 sigue el orden de bloques en pantalla y cada Δ cambia
> en la tarea que §Deltas le asigna, no antes.

## Disciplina de commits (C4 de `CHECKPOINTS.md`)

Por cada T: **commit rojo** (solo tests y los Δ de esa T, con el `jest`
del fichero en rojo por la razón que la T dice) y **commit verde** aparte
(implementación mínima). Nunca implementación y tests en el mismo commit.
Cada verde corre, para los ficheros tocados, `bunx jest <ficheros>
--testTimeout=30000`, `bunx tsc --noEmit` y `bunx eslint <ficheros>`
(incluye `prettier/prettier`; `bunx prettier --write <ficheros>` antes).

## Recuento de `it` (H0 + delta)

`grep -cE '^\s*it[.(]'` cuenta líneas (`it.each` = 1); la columna Jest
cuenta casos. Base: MST 39 (B36), MHT 26 (B37), MGT 8 (B38). El informe
anota el valor medido en H0 y cada fila se escribe como «H0 + n».

| Tras | Fichero | Líneas `it` añadidas | Casos Jest añadidos | Acumulado (líneas) |
|---|---|---|---|---|
| T4 (R4) | MST | 4 (cargando, error, cargado, `not-found`) | 4 | H0 + 4 |
| T5 (R5) | MST | 2 (estructura, segundo plan) | 2 | H0 + 6 |
| T6 (R6) | MST | 2 (dueño, familiar) | 2 | H0 + 8 |
| T7 (R7) | MST | 4 (tres combinaciones, error encima) | 4 | H0 + 12 |
| T8 (R8) | MST | 3 (`bodyCondition` 5, `null`, inglés) | 3 | H0 + 15 |
| T9 (R9) | MHT | 3 (cargando, error, cargado) | 3 | H0 + 3 |
| T10 (R10) | MHT | 3 (mes con comidas, mes vacío, `en-US`) | 3 | H0 + 6 |
| T10 (R10) | MGT | 1 (arrays literales) | 1 | H0 + 1 |
| T11 (R11) | MHT | 1 (`it.each` de las 8 filas de R11) | 8 | H0 + 7 |
| T12 (R12) | MHT | 3 (2, 0 y 5 comidas) | 3 | H0 + 10 |

Los `it` de R1, R2, R3 y R13 viven en sus ficheros (global-css,
design-drift, language-provider); su recuento también es H0 + delta.

## T0 — H0: base, dependencias y dobles

- [ ] T0.1 `git fetch` y `git merge-base --is-ancestor origin/main HEAD`;
  #173 en `main` (D1–D11). Si una D no da su valor, **parar**.
- [ ] T0.2 `test ! -e mobile-pet-tracker/.expo/types/router.d.ts` (si
  existe, parar y avisar: lo borra el leader).
- [ ] T0.3 Medir B1–B55, S1–S11 y D9 (#177) de requirements.md con sus
  greps literales y escribir declarado y medido en
  `progress/impl_mobile-meal-schedule-canvas-fidelity.md`. Si un valor
  medido difiere del declarado, si S7 = 1 con texto distinto, si un token de
  S1–S6 existe con otro valor (P12) o si D9 ≥ 1 (#177 caso A), **parar**.
  Medir también el total de `englishKeys` de language-provider y la longitud
  de `R6_FOOD` corriendo sus dos ficheros de test.
- [ ] T0.4 Dobles, en un commit
  `test(meal-schedule): dobles de entrada e iconos con tamaño (#179 R6)`:
  - MST y MHT: el doble de `../home/home-entrance` de
    `src/screens/login/index.test.tsx` (función `HomeEntrance` que llama a
    `mockHomeEntrance(props)` y pinta un `View` con las props;
    `const mockHomeEntrance = jest.fn<void, [ViewProps & { index: number }]>()`).
  - MST y MHT: el `MockIcon` de `reicon-react-native` pasa a
    `({ color, size }: { color?: string; size?: number })` y pinta
    `{...{ size }}` (MST sobre `View`, MHT sobre su `Text`), como
    `src/screens/profile/index.test.tsx`.
  - Verde obligatorio: MST y MHT con sus `it` de H0 en verde, `tsc` y
    `eslint` limpios (los dobles son transparentes).

## T1 — R1 tokens

- [ ] (1) Rojo: `describe('#179 R1: tokens de Horario e Historial')` en
  `src/theme/__tests__/global-css.test.ts`. Rojo garantizado por
  `--text-17` y `--text-22`, que ninguna otra spec declara; los tokens que
  S1–S6 dieron 1 nacen verdes (anotado en T0.3).
- [ ] (2) Verde: las líneas que falten en `@theme`, en la posición de la
  tabla de R1.
- [ ] (3) Refactor: nada previsto.

## T2 — R2 enmienda de la carta

- [ ] (1) Rojo: `describe('#179 R2: …')` en `src/__tests__/design-drift.test.ts`.
  Rojo garantizado por las aserciones 5, 7 y 8; las 1–4 nacen verdes si S7,
  S9 y S10 lo dijeron en T0.3.
- [ ] (2) Verde: `docs/ui-guidelines.md` según R2 puntos 1–7 y los casos S.
- [ ] (3) Refactor: los `it` de enmienda de #173 (y de #174, #175, #178 si
  están en `main`) siguen verdes.

## T3 — R3 copy

- [ ] (1) Rojo: `describe('#179 R3: …')` en language-provider más Δ18
  (`+ 5, // #179 R3`). Rojo: las cinco claves no existen.
- [ ] (2) Verde: 5 claves × 2 idiomas en `src/i18n/catalog.ts` (literales
  de R3) y la sección `### §2.<N> — Añadidos por #179 — Horario e Historial del canvas`
  en `specs/mobile-ui-language/design.md` (N = última §2.x medida en H0 + 1;
  a la base, 27).
- [ ] (3) Refactor: `ui-language.test.ts` en verde (las filas de UC llegan
  con su R: R4, R5, R8, R9).

## T4 — R4 Horario: marco y título

- [ ] (1) Rojo: `describe('#179 R4: …')` (4 `it`) más Δ1, Δ2 y Δ15, y la
  fila de UC de R3 para R4. Rojo: `getByTestId('meal-schedule-heading')`
  lanza en los 4 `it`; Δ1 rojo en su `toEqual`; Δ15 rojo en LYT.
- [ ] (2) Verde: `contentContainerStyle`, `gap-3.5`, el título y
  `title: ''` en LY.
- [ ] (3) Refactor: nada previsto.

## T5 — R5 resumen

- [ ] (1) Rojo: `describe('#179 R5: …')` (2 `it`), Δ3, Δ17 (2 filas de UC),
  Δ18 (`- 2`), Δ20 (LG), Δ23–Δ25 (`+ 1`) y Δ27 (`19 + 1`). Rojo: el
  `toHaveProp('className', …)` del resumen; Δ3 lanza en `getByText('656')`.
- [ ] (2) Verde: el `View` del resumen dentro de `HomeEntrance index={0}`,
  columnas de R5, retiro de `mealSchedule.dailyGrams` y
  `mealSchedule.mealsPerDay` del catálogo y marca
  `← retirada por #179 (R5)` en sus filas del registro.
- [ ] (3) Refactor: nada previsto.

## T6 — R6 filas

- [ ] (1) Rojo: `describe('#179 R6: …')` (2 `it`), Δ4, Δ5, Δ6, Δ22, Δ31
  (`- 1, // #179 R6`), Δ32 y Δ34 (`+ 1`). Rojo: `childTestIds(section)` no
  trae `meal-time-entry-0` (aserción); Δ6 en `toHaveProp('className', …)`.
  Cruce: el `queryByTestId('meal-time-edit-0')` `null` del familiar ya es
  `null` a la base, pero el mismo `it` está rojo por `row.children` (3 → 2).
- [ ] (2) Verde: filas `Card variant="flat"`, mosaico, «Editar» e imports
  de R6.
- [ ] (3) Refactor: nada previsto.

## T7 — R7 acciones

- [ ] (1) Rojo: `describe('#179 R7: …')` (4 `it`), Δ7, Δ8, Δ27 (`- 1`),
  Δ28–Δ31, Δ33, Δ34 (`+ 1`) y Δ35; además, quitar
  `add-meal-time-button` de la lista de `section.children` del `it` de
  dueño de `#179 R6`. Rojo: `getByTestId('meal-schedule-actions')` lanza en
  los 4 `it` (el del error también busca `meal-schedule-actions` para
  comparar el orden de hermanos).
- [ ] (2) Verde: `meal-schedule-actions`, «Añadir comida» fuera de la
  sección y «Generar plan» tonal violeta con `Sparkles`.
- [ ] (3) Refactor: nada previsto.

## T8 — R8 perfil

- [ ] (1) Rojo: `describe('#179 R8: …')` (3 `it`), Δ9, Δ10 y las 3 filas
  de UC (Δ17, `R6_FOOD` `+ 3`). Rojo:
  `getByTestId('nutrition-profile-pills')` lanza.
- [ ] (2) Verde: h2 y píldoras de R8.
- [ ] (3) Refactor: nada previsto.

## T9 — R9 Historial: marco y título

- [ ] (1) Rojo: `describe('#179 R9: …')` (3 `it`), Δ11, Δ16 y la fila de UC
  de R9. Rojo: `getByTestId('meals-history-heading')` lanza.
- [ ] (2) Verde: contenedor, título y `title: ''` en LY.
- [ ] (3) Refactor: nada previsto.

## T10 — R10 calendario

- [ ] (1) Rojo: `describe('#179 R10: …')` (3 `it`), el `it` nuevo de MGT,
  Δ12, Δ19, Δ21 y Δ24–Δ26 (`+ 1`). Rojo:
  `getByTestId('meals-history-calendar')` lanza; MGT en su `toEqual`
  literal.
- [ ] (2) Verde: `View` del calendario, flechas, `narrow` en
  `src/utils/month-grid.ts` y `key={index}`.
- [ ] (3) Refactor: nada previsto.

## T11 — R11 celdas

- [ ] (1) Rojo: `describe('#179 R11: …')` (`it.each` de 8 filas), Δ13, Δ14
  y Δ31 (`- 1, // #179 R11`). Rojo: las 8 filas en el `className` literal
  del `Pressable` (`gap-0.5` nuevo); ninguna nace verde por R10, que no toca
  celdas.
- [ ] (2) Verde: celdas de R11 con punto o espaciador y `bg-tab-pill`.
- [ ] (3) Refactor: nada previsto.

## T12 — R12 panel del día

- [ ] (1) Rojo: `describe('#179 R12: …')` (3 `it`) y Δ24–Δ26 (`+ 2`). Rojo:
  el `within(calendar).queryByTestId('meals-history-detail')` no es `null`
  (el detalle sigue dentro tras T10) en el `it` de 2 comidas; los otros dos,
  en el `className` literal de la cabecera.
- [ ] (2) Verde: panel fuera del calendario en `HomeEntrance index={1}`.
- [ ] (3) Refactor: nada previsto.

## T13 — R13 candados de deriva

- [ ] (1) Candado: `describe('#179 R13: …')` en DD. Nace verde porque T4–T12
  ya dejaron los fuentes así: el rojo se demuestra con las sondas, una por
  punto, plantada y revertida sin commitear (`git checkout HEAD -- <ruta>`
  y `git diff --cached --quiet`). Sonda mínima: `shadow-sm` en la fila da
  rojo en el punto 3; `ForkKnife` de vuelta en el import, en el punto 2;
  `rounded-xl` en el mosaico, en el punto 10.
- [ ] (2) Verde: nada que implementar.
- [ ] (3) Refactor: `graphify update .`.

## T14 — R14 prueba de humo (humano)

- [ ] El humano la corre en un dev build de Android (no Expo Go), en claro y
  en oscuro, y firma la casilla de §Aprobación. Ni Codex ni un subagente la
  marcan.
