---
feature: "mobile-canvas-map"
status: spec_ready
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-canvas-map]]

## Orden recomendado

1. R15 (`PetMap`): el componente antes que la pantalla. R14 no tiene trabajo:
   la API de `EmptyState` (`badge`, `actionIcon`, `body` opcional) la entregó
   #198 R18 y ya está en la base `ccd5460a`.
2. R1 → R2 → R3 → R4 → R5 → R6 → R7 → R8 → R9: rama con posición.
3. R10: carga.
4. R11 → R12 → R13: escenas de Pingo.
5. R16: guardas al final, cuando los tres ficheros ya tienen su forma.

Cada R es un commit rojo (tests y enmiendas del inventario de ese R) seguido de
un commit verde (producción). Nunca test e implementación en el mismo commit.
Las filas de CF de cada R van en su commit rojo, con la cuenta acumulada que
fija `requirements.md` § Base medida, «Abreviaturas de test» (viñeta CF).

## Cuentas a re-medir al terminar (base + delta)

Las cuentas son las del bloque de `requirements.md` § Base medida, medido en
`ccd5460a` desde `mobile-pet-tracker/`. Cada línea lleva la base y, entre
paréntesis, el R que la mueve y la cifra final. No se copian aquí para que no
diverjan. Al terminar, re-correr ese bloque entero y anotar cada cifra en
`progress/impl_mobile-canvas-map.md`. Si `dev` se movió antes del handoff, se
re-mide la base primero.

Una cuenta más, que no está en Base medida porque solo tiene sentido al final:

| Comando | Base | Delta | Esperado |
|---|---|---|---|
| `grep -cF '(enmendado por #201 R' src/screens/map/index.test.tsx` | 0 | +23: una línea por `it` o plantilla de las filas 1–18 (5 + 7 + 3 + 4 + 1 + 3) | 23 |
| `test -e src/__tests__/map-canvas-fidelity.test.ts` | falso | nuevo (CF) | verdadero |

## Bloques por requisito

Cada bloque sigue: (1) test rojo, (2) implementación mínima, (3) refactor. Los
nombres de test exactos están en `requirements.md` bajo cada R; las filas, en
su § Candados que esta feature revierte.

- **R1**: (1) Doble 1 de Reanimated en MT (`__esModule: true`,
  `mockUseReducedMotion`); MT `#201 R1` ×2; inventario filas 15 y 20 (fila 20:
  título nuevo del `describe` de ES y plantilla `'%s no contiene %s (enmendado
  por #201 R1)'`, de 10 a 6 filas); CF R1 con `className="gap-2.5"` ×1. (2)
  `map-stats` pasa a `Animated.View` con `entering` y `gap-2.5`. (3) Nada.
- **R2**: (1) MT `#201 R2` ×2, filas 6–11 y 27, CF R2. (2) Receta de la
  píldora, `PetAvatar` 28, grupo `map-pet-pill-gps`, punto `bg-accent` en
  línea, `text-15`. (3) Nada.
- **R3**: (1) MT `#201 R3` ×3. (2) Ninguna: debe nacer verde; si nace rojo,
  parar e informar. (3) Nada.
- **R4**: (1) MT `#201 R4` ×2, CF R4. (2) `Card` → `View map-stats-card`. (3)
  Nada.
- **R5**: (1) MT `#201 R5`, filas 12–13, 25 y 26, CF R5. En la fila 26 la
  lista de DD gana `join('screens', 'map', 'index.tsx'), // #201 R5` y el
  título gana `(enmendado por #201 R5)`. (2) Tiles, rótulo arriba, tintas,
  `rounded-14`. (3) Nada.
- **R6**: (1) MT `#201 R6` ×4, fila 14, CF R6. (2) Literal
  `'text-xl font-black text-muted'` para el guion. (3) Nada.
- **R7**: (1) Dobles 2 (reicon) y 3 (`use-theme-colors`) en MT; MT `#201 R7`
  ×2; CF R7 con `h-12.5` ×1. (2) Botón rosa con `AlertTriangle`, color por
  `CATEGORY_SLOTS.rose.surface` / `.ink` (D22). (3) Nada.
- **R8**: (1) MT `#201 R8`, CF R8. (2) Mover `lost-mode-error` dentro de la
  tarjeta y darle `accessibilityRole="alert"`. (3) Nada.
- **R9**: (1) MT `#201 R9`, CF R9. (2) Clases del aviso y `Location`; `testID`
  sigue primer atributo de `map-empty` y `map-empty-overlay`. (3) Nada.
- **R10**: (1) MT `#201 R10` ×3 (incluido `los once bloques laten con pulse`),
  CF R10 (incluido `los once Skeleton del mapa son pulse`); en CF, sube
  `gap-2.5` a ×2 y `h-12.5` a ×2. (2) Esqueleto en línea con
  `variant="pulse"` ×11, sin prop `animation`. (3) Nada.
- **R11**: (1) MT `#201 R11` ×2 (`it.each`), filas 1–5 y 19, CF R11. (2) Dos
  ramas con `EmptyState` hero, badge e icono. (3) Nada.
- **R12**: (1) MT `#201 R12`, fila 16, CF R12 (sube el envoltorio a ×3). (2)
  `variant="hero"`, envoltorio nuevo, «+» de 2.8. (3) Nada.
- **R13**: (1) MT `#201 R13` ×3, filas 17–18, 21–24 y 26, CF R13 (sube el
  envoltorio a ×4 y `<PopIn` a ×3). En la fila 26 el objeto `rounded16` gana
  `'screens/map/index.tsx': 1, // #201 R13` y el sufijo pasa a
  `(enmendado por #201 R5, R13)`. (2) `hero`, `pose="talk"`, badge del collar
  con `const chunkyLip = useChunkyLip();`, icono de enlace. (3) Nada.
- **R14**: (1) Ninguno: EH `#198 R18` ×6 ya nacen verdes en la base. No se
  añade `#201 R14` a ES. (2) Ninguna. (3) Nada.
- **R15**: (1) PM `#201 R15` ×2, MT `#201 R15`, CF R15. (2) Prop
  `polylineWidth`. (3) Nada.
- **R16**: (1) CF `#201 R16` ×4 (guardas, iconos, mutaciones, exención de las
  citas de requisito). (2) Ninguna si R1–R15 cumplieron la carta; si nace
  rojo, corregir el fichero. (3) Nada.
