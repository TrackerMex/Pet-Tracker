---
feature: "mobile-canvas-map"
status: spec_ready
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-canvas-map]]

## Orden recomendado

0. Precondición: #197 mergeada en `dev` y `dev` mergeado en la rama; re-medir
   la tabla de abajo y el inventario de `requirements.md` (D21).
1. R14 (`EmptyState`) y R15 (`PetMap`): los componentes antes que la pantalla.
2. R1 → R2 → R3 → R4 → R5 → R6 → R7 → R8 → R9: rama con posición.
3. R10: carga.
4. R11 → R12 → R13: escenas de Pingo.
5. R16: guardas al final, cuando los tres ficheros ya tienen su forma.

Cada R es un commit rojo (tests y enmiendas del inventario de ese R) seguido de
un commit verde (producción). Nunca test e implementación en el mismo commit.
Las filas de CF de cada R van en su commit rojo.

## Cuentas a re-medir al terminar (base + delta)

Desde `mobile-pet-tracker/`, con `M=src/screens/map/index.tsx`,
`E=src/components/empty-state.tsx`, `T=src/screens/map/index.test.tsx`. Base en
`71ff81a1`; si `dev` se movió, re-medir la base antes del handoff.

| Comando | Base | Delta | Esperado |
|---|---|---|---|
| `grep -cF '<EmptyState' $M` | 2 | +2 (R11) | 4 |
| `grep -cF 'text-accent-strong' $M` | 2 | −1 (R5) | 1 |
| `grep -cF 'style={CONTINUOUS_CORNER}' $M` | 4 | 0 | 4 |
| `grep -cF 'react-native-reanimated' $M` | 0 | +1 (R1) | 1 |
| `grep -cF 'homeEntering(0, MOTION_RISE_OFFSET_Y)' $M` | 0 | +1 (R1) | 1 |
| `grep -cF 'testID="map-retry"' $M` | 1 | −1 (R11) | 0 |
| `grep -cF 'testID="map-last-retry"' $M` | 1 | −1 (R11) | 0 |
| `grep -cF 'pose="collar"' $M` | 1 | −1 (R13) | 0 |
| `grep -cF '<Skeleton' $M` | 1 | +10 (R10) | 11 |
| `grep -cF 'animation="pulse"' $M` | 0 | +11 (R10) | 11 |
| `grep -cF 'bg-lip-gray' $M` | 0 | +10 (R10) | 10 |
| `grep -cF 'useChunkyLip' $M` | 0 | +2 (R13) | 2 |
| `grep -cF "from 'reicon-react-native'" $M` | 0 | +1 (R16) | 1 |
| `grep -cF '<Card' $M` | 2 | −1 (R4) | 1 |
| `grep -cF 'rounded-xl' $M` | 5 | −5 (R5, R7) | 0 |
| `grep -cF 'flex-1 items-center justify-center p-6 bg-background' $M` | 2 | −2 (R12, R13) | 0 |
| `grep -cF 'bg-background px-6 pt-15 pb-30' $M` | 0 | +4 (R11–R13) | 4 |
| `grep -cF 'useThemeColors' $M` | 0 | +2 | 2 |
| `grep -cF '<PopIn' $M` | 0 | +3 (R11, R13) | 3 |
| `grep -cF 'react-native-svg' $M` | 0 | +1 (R13) | 1 |
| `grep -cF 'polylineWidth={5}' $M` | 0 | +1 (R15) | 1 |
| `grep -cF 'body: string' $E` | 1 | −1 (R14) | 0 |
| `grep -cF 'body?: string' $E` | 0 | +1 (R14) | 1 |
| `grep -cF '<Plus size={20}' $E` | 1 | 0 | 1 |
| `grep -cF "'map-retry'" $T` | 2 | −2 | 0 |
| `grep -cF "'map-last-retry'" $T` | 5 | −5 | 0 |
| `grep -cF 'pingo-collar' $T` | 1 | −1 | 0 |
| `grep -cF 'text-base font-black' $T` | 12 | −12 | 0 |
| `grep -cF 'mt-1 text-2xs font-normal text-muted' $T` | 1 | −1 | 0 |
| `grep -cF "['src/screens/map/index.tsx', 2]," src/components/__tests__/empty-state.test.tsx` | 1 | −1 (pasa a `2 + 2`) | 0 |
| `grep -cF "['src/screens/map/index.tsx', 'entering=']," src/components/__tests__/empty-state.test.tsx` | 1 | −1 | 0 |
| `grep -cF "[join('screens', 'map', 'index.tsx'), 2]," src/__tests__/legibility-classnames.test.ts` | 1 | −1 (pasa a `2 - 1`) | 0 |
| `grep -cF 'screens/map/index.tsx' src/__tests__/chunky-cta-canvas-fidelity.test.ts` | 0 | + una por inventario de las filas 21–24 | medir y anotar en el informe |
| `test -e src/__tests__/map-canvas-fidelity.test.ts` | falso | nuevo | verdadero |
| `grep -cF '(enmendado por #201 R' $T` | 0 | + filas 2–18 enmendadas | medir y anotar en el informe |

## Bloques por requisito

Cada bloque sigue: (1) test rojo, (2) implementación mínima, (3) refactor. Los
nombres de test exactos están en `requirements.md` bajo cada R.

- **R1**: (1) MT `#201 R1` ×2, inventario filas 15 y 20, CF R1. (2) `map-stats`
  pasa a `Animated.View` con `entering` y `gap-2.5`. (3) Nada.
- **R2**: (1) MT `#201 R2` ×2, filas 6–11 y 26, CF R2. (2) Receta de la
  píldora, `PetAvatar` 28, grupo `map-pet-pill-gps`, punto `bg-accent` en
  línea. (3) Nada.
- **R3**: (1) MT `#201 R3` ×3. (2) Ninguna: debe nacer verde; si nace rojo,
  parar e informar. (3) Nada.
- **R4**: (1) MT `#201 R4` ×2, CF R4. (2) `Card` → `View map-stats-card`. (3)
  Nada.
- **R5**: (1) MT `#201 R5`, filas 12–13 y 25, CF R5. (2) Tiles, rótulo arriba,
  tintas. (3) Nada.
- **R6**: (1) MT `#201 R6` ×4, fila 14, CF R6. (2) Literal
  `'text-xl font-black text-muted'` para el guion. (3) Nada.
- **R7**: (1) MT `#201 R7` ×2, CF R7. (2) Botón rosa con `AlertTriangle`. (3)
  Nada.
- **R8**: (1) MT `#201 R8`, CF R8. (2) Mover `lost-mode-error` dentro de la
  tarjeta y darle `accessibilityRole="alert"`. (3) Nada.
- **R9**: (1) MT `#201 R9`, CF R9. (2) Clases del aviso y `Location`. (3) Nada.
- **R10**: (1) MT `#201 R10` ×3, CF R10. (2) Esqueleto en línea. (3) Nada.
- **R11**: (1) MT `#201 R11` ×2 (`it.each`), filas 1–5 y 19, CF R11. (2) Dos
  ramas con `EmptyState` hero, badge e icono. (3) Nada.
- **R12**: (1) MT `#201 R12`, fila 16, CF R12. (2) `variant="hero"`, envoltorio
  nuevo, «+» de 2.8. (3) Nada.
- **R13**: (1) MT `#201 R13` ×3, filas 17–18 y 21–24, CF R13. (2) `hero`,
  `pose="talk"`, badge del collar, icono de enlace. (3) Nada.
- **R14**: (1) ES `#201 R14` ×6. (2) Props `badge`, `actionIcon` y `body`
  opcional. (3) Nada.
- **R15**: (1) PM `#201 R15` ×2, MT `#201 R15`, CF R15. (2) Prop
  `polylineWidth`. (3) Nada.
- **R16**: (1) CF `#201 R16` ×3 (guardas, iconos, mutaciones). (2) Ninguna si
  R1–R15 cumplieron la carta; si nace rojo, corregir el fichero. (3) Nada.
