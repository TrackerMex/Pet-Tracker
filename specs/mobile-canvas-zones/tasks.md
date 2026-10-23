---
feature: "mobile-canvas-zones"
status: spec_ready     # draft | spec_ready | approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-canvas-zones]]

TDD por requisito: commit rojo `test(#202): R<n> …` (tests nuevos más las
enmiendas del inventario de ese R) y luego commit verde `feat(#202): R<n> …`.
Requisitos y literales en [[requirements]]; abreviaturas de ficheros de test
(GZ, GE, LY, CD, ZF, GF, UL) en su Contexto.

## Orden recomendado

R7 → R1 → R3 → R4 → R5 → R6 → R8 → R9 → R10 → R11 → R12 → R13 → R14 → R15 →
R16 → R17 → R18 → R19 → R2 → R20 → R21-R24 → R25. R26 es del humano.

- R7 primero: R8 y R9 montan `ConfirmDialog`. Es también el primer commit que
  monta cimientos de #197 (`RiseIn`, `useShadows`): su rojo borra el
  `describe('#197 R20: cimientos sin cablear')` entero de
  `src/__tests__/canvas-foundations.test.ts`.
- R2 casi al final: `header-layout.ts` se borra cuando R1, R12 y R17 ya no lo
  importan.
- R21-R24 nacen verdes (conservación): un solo commit `test(#202): R21-R24
  candados de conservación`, sin commit verde.

## Notas para el handoff

- Precondición: #197 (con `RiseIn` de #197 R24) en `dev` y rama re-basada;
  re-medir la Base medida antes del primer commit. Si
  `src/components/rise-in.tsx`, `screen-header.tsx`, `toggle-switch.tsx` o
  `theme/shadows.ts` no existen, parar. #202 no depende de #199.
- `cd mobile-pet-tracker` explícito; `bun`/`bunx`, nunca `npx`. Sin
  `./init.sh` (lo corre el leader). Sin dependencias nuevas.
- RNTL 14: `await` en `fireEvent` y `act`. Jest con rutas que llevan
  paréntesis: pasar ficheros escapados o por `--testPathPattern` literal.
- El doble de `reicon-react-native` de GZ pasa de
  `{ ...actual, __esModule: true, Map: icon('map'), Trash: icon('trash'), AlertCircle: icon('alert') }`
  a `{ ...actual, __esModule: true, AlertTriangle: icon('alert'), Trash: icon('trash') }`
  (R3 quita `Map`, R5 cambia `AlertCircle` por `AlertTriangle`). El de GE
  pierde `Stack.Screen` en R17.
- `ScreenHeader` se escribe una vez por pantalla (R1, R17): UL cuenta los
  `t('clave'` exactos por fichero y no se enmienda por eso.
- No tocar pantallas de #198, #199 ni #201 ni `EmptyState`.
- Ningún testID nuevo puede terminar en `-delete` (selector `/-delete$/`).
- Los literales del canvas se copian a los tests; nada de importar
  constantes de producción en los candados.
- Enmienda mecánica: ver el párrafo de requirements § Candados.

## Cuentas a re-medir al terminar (base + delta)

| Comando (desde `mobile-pet-tracker/`) | Base | Delta | Esperado |
|---|---|---|---|
| `grep -oF "<Skeleton" src/screens/geofences/index.tsx \| wc -l` | 1 | +4 | 5 |
| `grep -oF "<Skeleton" src/screens/geofence-editor/index.tsx \| wc -l` | 1 | +2 | 3 |
| `grep -cF "headerShown" src/app/_layout.tsx` | 2 | +2 | 4 |
| `grep -rlF "theme/header-layout" src \| wc -l` | 6 | -6 | 0 |
| `grep -cF "Alert.alert" src/screens/geofences/index.tsx src/screens/geofence-editor/index.tsx` | 1 + 1 | -2 | 0 + 0 |
| `grep -cF "'geofences.loadingLabel'" src/i18n/catalog.ts` | 0 | +2 | 2 |
| `grep -cF "'geofenceEditor.loadingLabel'" src/i18n/catalog.ts` | 0 | +2 | 2 |
| `grep -oF "t('geofences.title'" src/screens/geofences/index.tsx \| wc -l` | 1 | 0 | 1 |
| `grep -oF "t('geofenceEditor.title'" src/screens/geofence-editor/index.tsx \| wc -l` | 2 | 0 | 2 |
| `grep -oF "t('geofences.delete'" src/screens/geofence-editor/index.tsx \| wc -l` | 2 | 0 | 2 |
| `grep -oF "style={CONTINUOUS_CORNER}" src/screens/geofences/index.tsx \| wc -l` | 3 | 0 | 3 |
| `grep -oE "\bCONTINUOUS_CORNER\b" src/screens/geofence-editor/index.tsx \| wc -l` | 2 | 0 | 2 |
| Longitud de `R14_GEOFENCES` (UL `#41 R10`) | 22 | +1 | 23 |
| Longitud de `R15_GEOFENCE_EDITOR` (UL `#146 R10`) | 31 | +1 | 32 |
| Último sumando del catálogo (`language-provider.test.tsx` `#194 R1`) | `+ 7` | `+ 1 + 1` | `+ 7 + 1 + 1` |
| `rounded16` del editor en design-drift | 3 | +1 | 4 |
| `radii` del editor en chunky-cta `#177 R7.3` | 3 | +1 | 4 |
| Total de chunky-cta `#177 R7.3` | `26 + 1 + 1 + 1 + 2` | `+ 1` | `26 + 1 + 1 + 1 + 2 + 1` |
| Claves de `dependencies` en `package.json` | medir en la base re-basada | 0 | igual |
| `grep -cF "leading-body" src/screens/geofence-editor/index.tsx` | 0 | +5 | 5 |

## Bloques por requisito

Cada bloque: (1) test rojo, (2) implementación mínima, (3) refactor.

- **R7**: (1) CD nuevo con sus cuatro `it` y ZF `#202 R7`; borrar el `describe('#197 R20: cimientos sin cablear')` entero de CF (sin sufijo ni reemplazo); enmiendas profile `#173 R2` `rounded-hero` (añade `components/confirm-dialog.tsx`) y alerts `#174 R12` fila `text-15` (añade `components/confirm-dialog.tsx`); (2) `confirm-dialog.tsx` con `Modal`, velo, `RiseIn` y `Card`; (3) sin `StyleSheet`, constante `SCRIM` local.
- **R1**: (1) GZ `#202 R1` ×2 y enmiendas GZ de `#41 R5` métricas (`paddingTop: 52` y `toBe(40 + 12)`) y `#189 R1`, borrar import de `header-layout` en GZ; profile `#173 R2.4` y alerts `#174 R12` `tracking-title` sin `screens/geofences/index.tsx`; (2) `ScreenHeader` escrito una vez con contador como `accessory`, `paddingTop: insets.top + 12`; (3) quitar `HEADER_ROW_TOP`/`ZONES_TITLE_OFFSET` de la pantalla.
- **R3**: (1) GZ y ZF `#202 R3`, enmiendas `#189 R5` (cada fila; las cinco posiciones; family) y GF `#189 R18`, quitar `Map` del doble de reicon; (2) glifo `Svg` local; (3) quitar `Map`.
- **R4**: (1) GZ/GE/ZF `#202 R4`, enmienda GF `#189 R19.2`; (2) `ToggleSwitch` en las dos pantallas; (3) quitar `Switch`.
- **R5**: (1) GZ/ZF `#202 R5`, enmiendas GZ `#189 R6` y GF `#189 R18`, doble de reicon con `AlertTriangle: icon('alert')`; (2) `AlertTriangle` y `leading-note`; (3) nada.
- **R6**: (1) GZ/ZF `#202 R6`, enmiendas `#41 R7` (recetas) y `#189 R5`; (2) `CATEGORY_SLOTS.rose.surface`, sin `hitSlop` y conservando `style={CONTINUOUS_CORNER}`; (3) nada.
- **R8**: (1) GZ `#202 R8` ×3 y enmiendas `#41 R7` (Alert); (2) estado local del diálogo y `write` de hoy en `onConfirm`; (3) quitar `Alert`.
- **R9**: (1) GE `#202 R9` ×4 y enmiendas `#146 R14` (incluidos `un fallo al borrar pinta el error y no vuelve` y `un 401 al borrar cierra sesión una vez`) y `#189 R19.2`; borrar el helper `alertButton`; (2) igual que R8 en el Editor; (3) quitar `Alert`.
- **R10**: (1) GZ/ZF `#202 R10`, enmiendas `#41 R5` esqueleto, UL `#41 R10` (`+ 1`) y catálogo `#194 R1` (`+ 1 // #202 R10`); (2) filas esqueleto y clave `geofences.loadingLabel` con su fila de copy; (3) nada.
- **R11**: (1) GZ/ZF `#202 R11`, enmiendas `#41 R5` (`pinta %p y Reintentar vuelve a pedir solo la lista`), `#41 R6` (`pinta %s sin recargar y limpia el error al siguiente intento`) y alerts `#174 R12` fila `text-15` (añade `screens/geofences/index.tsx`); (2) clases; (3) nada.
- **R12**: (1) GE/ZF `#202 R12`, enmienda `#189 R8` fila, borrar import de `header-layout` en GE; (2) fila flotante con volver de cristal; (3) quitar `EDITOR_PILL_LEFT`.
- **R13**: (1) GE/ZF `#202 R13`, enmiendas `#146 R6` compone, `#189 R9` compone la hoja (`it.each`, 3 filas) y CC `#189 R9` (`style` con `shadows.sheet`); (2) `RiseIn` (#197 R24) con `className="-mt-6.5 shrink"` y `shadows.sheet`; (3) nada.
- **R14**: (1) GE/ZF `#202 R14`; (2) clases delante del sufijo; (3) nada.
- **R15**: (1) GE/ZF `#202 R15`, enmiendas `#146 R8`, `#146 R14`, `#189 R13`, chunky-cta `#177 R3.1` y `#177 R4.1`; (2) `h-13.5`; (3) nada.
- **R16**: (1) GE/ZF `#202 R16`, enmiendas `#146 R8` (`pinta %s bajo Guardar y conserva el borrador`), `#146 R16`, `#189 R11`; (2) clases; (3) nada.
- **R17**: (1) GE/ZF `#202 R17`, enmiendas `#146 R6` esqueleto (métricas), `#189 R8` plano, `#189 R14`, `#146 R16` solo dueño, borrar `#189 R22`, profile `#173 R2.4` y alerts `tracking-title` sin `screens/geofence-editor/index.tsx`; (2) `ScreenHeader` escrito una vez en las ramas de estado, `STATE_TEXT`, sin `Stack.Screen`; (3) quitar `TRANSPARENT_HEADER_OPTIONS` del Editor.
- **R18**: (1) GE/ZF `#202 R18`, enmiendas `#146 R6` esqueleto (barras), UL `#146 R10` (`+ 1`), catálogo `#194 R1` (`+ 1 // #202 R18`), design-drift `rounded16` y chunky `#177 R7.3` (`radii` y total); (2) tres barras y `geofenceEditor.loadingLabel`; (3) nada.
- **R19**: (1) GE `#202 R19`, enmienda `#146 R6` error; (2) clases; (3) nada.
- **R2**: (1) LY y ZF `#202 R2` (aguja construida con `['theme', 'header-layout'].join('/')`), enmiendas LY ×2, borrar GF `#189 R23`; (2) `headerShown: false` y borrar `header-layout.ts`; (3) nada.
- **R20**: (1) ZF `#202 R20` y enmiendas GF `#189 R16.1`, `R16.3`, `R24.1`, `R24.2`; (2) textos de la carta y conventions; (3) nada.
- **R21-R24**: (1) un commit verde de conservación; (2) y (3) no aplican.
- **R25**: (1) ZF `#202 R25` ×2; (2) nada si ya cumple; (3) nada.
- **R26**: humano, dev build Android.
