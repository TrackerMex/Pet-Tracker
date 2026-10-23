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

- R7 primero: R8 y R9 montan `ConfirmDialog`.
- R2 casi al final: `header-layout.ts` se borra cuando R1, R12 y R17 ya no lo
  importan.
- R21-R24 nacen verdes (conservación): un solo commit `test(#202): R21-R24
  candados de conservación`, sin commit verde.

## Notas para el handoff

- Precondición: #197 y #199 en `dev` y rama re-basada; re-medir la Base
  medida antes del primer commit. Si `src/components/rise-in.tsx`,
  `screen-header.tsx`, `toggle-switch.tsx` o `theme/shadows.ts` no existen,
  parar.
- `cd mobile-pet-tracker` explícito; `bun`/`bunx`, nunca `npx`. Sin
  `./init.sh` (lo corre el leader). Sin dependencias nuevas.
- RNTL 14: `await` en `fireEvent` y `act`. Jest con rutas que llevan
  paréntesis: pasar ficheros escapados o por `--testPathPattern` literal.
- El doble de `reicon-react-native` de GZ debe registrar `AlertTriangle` y
  `Trash` (R5); el de GE pierde `Stack.Screen` en R17.
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
| `grep -cF "header-layout" -r src` | 3 | -3 | 0 |
| `grep -cF "Alert.alert" src/screens/geofences/index.tsx src/screens/geofence-editor/index.tsx` | 1 + 1 | -2 | 0 + 0 |
| `grep -cF "'geofences.loadingLabel'" src/i18n/catalog.ts` | 0 | +2 | 2 |
| `grep -cF "'geofenceEditor.loadingLabel'" src/i18n/catalog.ts` | 0 | +2 | 2 |
| Longitud de `R14_GEOFENCES` (UL `#65 R14`) | 22 | +1 | 23 |
| Longitud de `R15_GEOFENCE_EDITOR` (UL `#65 R15`) | 31 | +1 | 32 |
| `rounded16` del editor en design-drift | 3 | +1 | 4 |
| `radii` del editor en chunky-cta | 3 | +1 | 4 |
| `CONTINUOUS_CORNER` en consistency `#62 R14` | geofences 4, editor 2 | medir | lo medido |
| Claves de `dependencies` en `package.json` | medir en la base re-basada | 0 | igual |
| `grep -cF "leading-body" src/screens/geofence-editor/index.tsx` | 0 | +5 | 5 |

## Bloques por requisito

Cada bloque: (1) test rojo, (2) implementación mínima, (3) refactor.

- **R7**: (1) CD nuevo con sus cuatro `it` y ZF `#202 R7`; (2) `confirm-dialog.tsx` con `Modal`, velo, `RiseIn` y `Card`; (3) sin `StyleSheet`, constante `SCRIM` local.
- **R1**: (1) GZ `#202 R1` ×2 y enmiendas GZ de `#41 R5`/`#189 R1`, borrar import de `header-layout` en GZ; (2) `ScreenHeader` con contador como `accessory`, `paddingTop: insets.top + 12`; (3) quitar `HEADER_ROW_TOP`/`ZONES_TITLE_OFFSET` de la pantalla.
- **R3**: (1) GZ y ZF `#202 R3`, enmienda `#189 R5` y `#189 R18`; (2) glifo `Svg` local; (3) quitar `Map`.
- **R4**: (1) GZ/GE/ZF `#202 R4`, enmienda GF `#189 R19.2`; (2) `ToggleSwitch` en las dos pantallas; (3) quitar `Switch`.
- **R5**: (1) GZ/ZF `#202 R5`, enmienda `#189 R6` y doble de reicon; (2) `AlertTriangle` y `leading-note`; (3) nada.
- **R6**: (1) GZ/ZF `#202 R6`, enmiendas `#41 R7` (recetas) y `#189 R5`; (2) `CATEGORY_SLOTS.rose.surface`; (3) nada.
- **R8**: (1) GZ `#202 R8` ×3 y enmiendas `#41 R7` (Alert); (2) estado local del diálogo y `write` de hoy en `onConfirm`; (3) quitar `Alert`.
- **R9**: (1) GE `#202 R9` ×4 y enmiendas `#146 R14`, `#189 R19.2`; (2) igual que R8 en el Editor; (3) quitar `Alert`.
- **R10**: (1) GZ/ZF `#202 R10`, enmiendas `#41 R5` esqueleto y UL `#65 R14`; (2) filas esqueleto y clave `geofences.loadingLabel` con su fila de copy; (3) nada.
- **R11**: (1) GZ/ZF `#202 R11`, enmiendas `#41 R5`/`#41 R6` y alerts `text-15`; (2) clases; (3) nada.
- **R12**: (1) GE/ZF `#202 R12`, enmienda `#189 R8` fila, borrar import de `header-layout` en GE; (2) fila flotante con volver de cristal; (3) quitar `EDITOR_PILL_LEFT`.
- **R13**: (1) GE/ZF `#202 R13`, enmienda `#146 R6` compone; (2) `RiseIn` y `shadows.sheet`; (3) nada.
- **R14**: (1) GE/ZF `#202 R14`; (2) clases delante del sufijo; (3) nada.
- **R15**: (1) GE/ZF `#202 R15`, enmiendas `#146 R8`, `#146 R14`, `#189 R13`, chunky-cta filas; (2) `h-13.5`; (3) nada.
- **R16**: (1) GE/ZF `#202 R16`, enmiendas `#146 R8` error, `#146 R16`, `#189 R11`; (2) clases; (3) nada.
- **R17**: (1) GE/ZF `#202 R17`, enmiendas `#189 R8` plano, `#189 R14`, `#146 R16` solo dueño, borrar `#189 R22`, profile y alerts `text-26`/`tracking-title`; (2) `ScreenHeader` en ramas de estado, `STATE_TEXT`, sin `Stack.Screen`; (3) quitar `TRANSPARENT_HEADER_OPTIONS` del Editor.
- **R18**: (1) GE/ZF `#202 R18`, enmiendas `#146 R6` esqueleto, UL `#65 R15`, design-drift y chunky `radii`; (2) tres barras y `geofenceEditor.loadingLabel`; (3) nada.
- **R19**: (1) GE `#202 R19`, enmienda `#146 R6` error; (2) clases; (3) nada.
- **R2**: (1) LY y ZF `#202 R2`, enmiendas LY ×2, borrar GF `#189 R23` y CF `#197 R20` ×2 (el de layout pasa a 4); (2) `headerShown: false` y borrar `header-layout.ts`; (3) nada.
- **R20**: (1) ZF `#202 R20` y enmiendas GF `#189 R16.1`, `R16.3`, `R24.1`, `R24.2`; (2) textos de la carta y conventions; (3) nada.
- **R21-R24**: (1) un commit verde de conservación; (2) y (3) no aplican.
- **R25**: (1) ZF `#202 R25` ×2; (2) nada si ya cumple; (3) nada.
- **R26**: humano, dev build Android.
