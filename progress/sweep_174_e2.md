# sweep_174_e2: candados preexistentes que R4..R10 ponen en rojo y que la spec no mueve

Fecha: 2026-10-15
Alcance: solo lectura. Base: HEAD `51643651` (R1..R3 hechas) más el árbol sin commitear (R3 verde, `progress/impl_*` sin trackear). No se corrió jest ni `init.sh`: todo es lectura de fuente, así que la columna "Por qué rojo" es deducida del código, no medida.
Criterio: `it`/guard sin `#174` en el título, no listado en el bloque `Tests:` de su R, ni en §3 L1..L10, ni en la Enmienda E1.
Rutas relativas a `mobile-pet-tracker/`. Las líneas caducan: cada fila trae contenido grepeable.

## Hallazgos

| # | Fichero › it/guard | R | Por qué rojo | Corrección |
|---|---|---|---|---|
| 1 | `src/screens/alerts/index.test.tsx` › `describe('#170 R3: agrupa la lista en Hoy, Esta semana y Anteriores')` › `it('pinta una cabecera por sección con su copy en español')`; grep: `expect(headers[0].props.className).toBe('text-xs font-bold uppercase text-muted');` | R6 | R6.2 fija la cabecera en `mt-1.5 text-13 font-extrabold uppercase tracking-caps text-muted`; la spec solo reescribe el `it` hermano `envuelve cada cabecera ... View gap-4`, no este, y la aserción es `toBe` exacto. | `toBe('mt-1.5 text-13 font-extrabold uppercase tracking-caps text-muted')`; renombrar con el sufijo ` (enmendado por #174 R6)`. |
| 2 | `src/screens/alerts/index.test.tsx` › `describe('#78 R6: cada fila de alerta trae su icono, ...')` › `it('alterna el tercer hijo entre ack y la píldora traducida')`, bucle `for (const alert of alerts)`; grep: `'min-h-20 flex-row items-center gap-3'` y `'min-h-11 min-w-0 flex-1 gap-1'` dentro de ese `it` | R7 | El bucle asevera `row.props.className` `toContain('min-h-20 flex-row items-center gap-3')` y el enlace `toBe('min-h-11 min-w-0 flex-1 gap-1')`; R7.1 quita `min-h-20` (la subcadena contigua deja de existir) y R7.4 cambia el enlace a `min-h-11 min-w-0 flex-1 justify-center gap-0.5`. La spec cita este `it` solo bajo R8 (ack) y R9 (píldoras); su lista `Tests:` de R7 nombra el `it.each`, `#100 R6` y `#170 R5`, no este bucle. Queda rojo desde el commit de R7, antes de que R8 lo toque. | En el bucle: `toContain` por separado de `flex-row`, `items-center`, `gap-3`, `px-3.5`, `py-3`, `shadow-none` y `not.toContain('min-h-20')`; enlace `toBe('min-h-11 min-w-0 flex-1 justify-center gap-0.5')`. Añadir `(enmendado por #174 R7)` al sufijo que R8 ya le pone. |

Total: 2 filas.

## CUBIERTO POR LA SPEC (o verde esperado)

1. `#78 R6` › `canda las doce decisiones para $type` (icono `size` 20, `bg-danger-soft`, `text-sm font-bold`, `column.children` 3, ack `min-h-11`): R7 y R8 lo reescriben en su sitio.
2. `#100 R6` › `da rol, altura y opacidad de pulsado solo al enlace` (`'min-h-11 min-w-0 flex-1 gap-1'`): R7 lo nombra.
3. `#170 R3` › `envuelve cada cabecera con la primera fila ... gap-4`: R6 lo reescribe; ya es tolerante a R10 (`first.props.testID === ... || within(first).queryByTestId(...)`).
4. `#170 R4` › `pinta el contador como hermano anterior de la lista con su anatomía`: R4 lo reescribe; los otros `it` del describe solo miran `alerts-new-count-text` o la ausencia de `alerts-new-count`, tolerantes a mover el nodo al título y al doble de `PopIn` que añade la spec.
5. `#170 R5` (columna `surface` de la tabla) lo mueve R7; los `it` de acked/closed de ese describe quedan verdes: el `Card` conserva `border border-border` y `twMerge` solo cambia `shadow-sm` por `shadow-none`, sin `border-2`.
6. `#78 R4` › `respeta las dimensiones ... (#114 R6)` (`contentContainerStyle` `padding: 24`): R5 lo renombra y corrige. Los `it` de esqueletos, error y vacío (`h-20 w-full rounded-card`, `text-danger`, `text-center text-lg font-bold`) no cambian en R4..R10.
7. `#78 R8` › `mantiene la fila en not-found ...` (`alerts-action-error` hijo 1 de `alerts-header`): R3 lo suma; R4 mete el contador en `alerts-title-row`, no en `alerts-header`, así que sigue verde.
8. `src/__tests__/profile-canvas-fidelity.test.ts` › `#173 R2.4` (`text-26` / `text-13` por `filesMatching`): L9 lo mueve en R3, R4 y R6. `text-15`, `tracking-title`, `tracking-caps` y `rounded-10` no tienen inventario en ningún guard fuera de `global-css.test.ts` (grep = 0), y L10 no aplica porque #175 no está en H0.
9. `src/__tests__/consistency-classnames.test.ts`: `#62 R15` (`alerts` `TABULAR_NUMS` = 1) sigue en 1 si el contador conserva su único `style={TABULAR_NUMS}`; `#64 R9` (`bg-category-` solo en `utils/category-palette.ts`, sin `bg-category-${`) pasa porque `disc` y la píldora `closed` salen de `CATEGORY_SLOTS`; `#166 R3` es L8/E1.2. `#62 R4`, `\b(?:last|first|odd|even):` y `[←›]` no casan con el código previsto.
10. `src/__tests__/ui-language.test.ts`: `#78 R12` (`checkUses`, conteo exacto de `t('alerts.*')` por fichero) no cambia porque R4..R10 no añaden ni quitan llamadas `t(`; `#65 R18` (`wholeLiterals`) normaliza `{' · '}` a `·`, que no es ningún valor del catálogo.
11. `src/__tests__/design-drift.test.ts`: `#134 R6/R7` cuentan `case '`, `signOut(`, `settleAlertAck(`, `ackAlert(baseUrl`, `alertKeys|invalidateQueries|...` que R4..R10 no tocan; `#152 R9`, `#167 R14` y `#171 R13` tienen listas cerradas sin `screens/alerts/index.tsx`. Aviso aparte: un comentario `// #174 E1` casa con `HEX_LITERAL` si algún día el fichero entra en una lista (solo `#NNN R<n>` está exento).
12. `tab-headers-canvas` (`#168 R12`), `account-screens-polish`, `hero-header-amendments`, `legibility-classnames`, `font-registration`, `celebration` y `food`: escanean listas cerradas de ficheros ajenos a Alertas; sus clases (`text-15`, `font-extrabold`, `font-black`) no se cuentan globalmente.
13. `src/app/__tests__/alert-detail.navigation.test.tsx`: monta `AlertsRoute` real con `heroui-native` mockeado (el `Button` propaga `variant`/`hitSlop` por spread al `Pressable`) y solo pulsa `alert-row-alert-2-link` y lee `-status` y `-ack`. `PopIn` y `HomeEntrance` reales bajo `setUpTests` no ocultan nada. Verde esperado, sin ejecutar.
14. `src/screens/alerts/index.test.tsx` › `#97 R5` › `it('no resetea el estado ni el ref desde el cleanup de foco')` (el que hace `source.slice(source.indexOf('useFocusEffect('), source.indexOf('async function handleAck'))` y `not.toContain('AckingId')`): solo se rompe si la implementación coloca entre esos dos anclas algo con `AckingId` o `ackingIdRef`; ninguna R lo exige.
15. `src/theme/__tests__/global-css.test.ts`: los describes de tokens (`#173 R2.3`, `#171 E4`, `#174 R1`) usan `toMatchObject` y conteos por variable; R4..R10 no tocan `global.css`.

## Notas fuera de la tabla (no son tests)

- Premisas de la spec verificadas contra el árbol: `CATEGORY_SLOTS.neutral` es `{ surface: 'bg-default', ink: 'text-muted' }`, `rose`/`amber`/`green` traen `surface` e `ink` con los literales que R7.2 y R9.2 prescriben, y `TOUCH_SLOP` es `{ top: 6, bottom: 6, left: 6, right: 6 }`.
- `Card` hace `twMerge('rounded-card border border-border bg-surface p-4 shadow-sm', className)`: con R7.1 se conservan `p-4` y `px-3.5 py-3` a la vez (twMerge solo descarta `px`/`py` cuando `p` va después). Los tests no lo ven; si el padding real de la fila sale distinto de 14/12, es cuestión de orden de clases en uniwind y se ve en el smoke, no en jest.
- `#155 R5` › `queda en el sitio del vacío que sustituye` es el rojo ya conocido de E2 (R3); no se repite como fila.
