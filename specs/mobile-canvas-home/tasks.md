---
feature: "mobile-canvas-home"
status: approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-canvas-home]]

## Orden recomendado

R1 → R2 → R3 → R4 → R5 → R6 → R7 → R8 → R9 → R10 → R11 → R13 → R14 → R18 → R15 → R16 → R12 → R17.

Precondición: #197 mergeada y `dev` mergeado en la branch (design.md §Dependencias). Sin ella, R1, R5, R7 y R10 no compilan.

## Notas para el handoff

- Trabajo en `mobile-pet-tracker/` (`cd` explícito). Gestor: `bun`/`bunx`, nunca `npx` ni `npm`. Sin prettier en móvil.
- **Commits test-primero por requisito (C4)**: `test(#198 R<n>): …` con el rojo (la corrida de jest del fichero sale con fallos que
  nombran `#198 R<n>`), después `feat(#198 R<n>): …` con el verde. Nunca implementación y test en el mismo commit.
- Cada enmienda de §Candados (K1–K47; K7 y K38 sin uso) va en el commit **rojo** del requisito que la causa, con su sufijo ` (enmendado por #198 R<n>)`.
- Candados agregados por pasos, para que cada verde sea verde entero:
  - CF `describe('#197 R20: cimientos sin cablear')` (K28): se borra entero en el commit rojo de R1.
  - CN `bg-accent-soft` (K27): R3 añade ` - 1` (círculo del collar), R11 otro ` - 1` (círculo de última posición), R13 otro
    ` - 1` (enlace de vincular). Total final 4.
  - LG `#61 R4` (K26): en R4 (la cifra del collar gana `text-accent-strong`): `index.tsx` 2 → 3, suma 13 → 14.
  - HP `'%s conserva %s en %s líneas'` (K41), por los mismos pasos que K27 y K26: `bg-accent-soft` 3 → 2 (R3) → 1 (R11) → 0 (R13);
    `text-accent-strong` 2 → 3 (R4). `TABULAR_NUMS` no se mueve (9).
  - K6 en dos pasos: en R2 fila, celda y mosaico; en R13 valor, etiqueta y nota. K25 en dos pasos: la línea de `react` en R18,
    `category-palette` en R15.
  - Resto de filas nuevas, en el commit rojo de: R2 → K36; R5 → K9, K29–K34, PF K45; R9 → CK K35, DD K42, AC K46 (fila `text-15`);
    R14 → K37; R15 → EI K39, K40, DD K43, PF K44, AC K46 (fila `tracking-title`), UL K47.
- **Nacen verdes (declarado)**: `#198 R15 sin tone conserva el escenario de hoy`, `#198 R18 sin badge el escenario no cambia` y
  `#198 R18 sin actionIcon el hero conserva el «+»` (estos dos van en el commit rojo de R18, junto a los cuatro que fallan), R16, R12 (HCF de importaciones) y R17. Van en
  commits `test(#198 R<n>)` sin `feat`; el reviewer los prueba con mutación (R16: pasar `tone="danger"` al vacío; R12: quitar el
  import de `useShadows` de la gráfica; R17: cambiar `h-23` por `h-24` en un tile; R15-default: quitar el defecto de `tone`).
- Jest: rutas sin paréntesis; `bunx jest src/screens/home src/components/__tests__ src/__tests__` para el rojo/verde de cada bloque.
- Copy: solo los literales de R15 (es y en). No inventar otros.
- No lanzar `./init.sh` (lo corre el leader).

## Cuentas a re-medir al terminar (base + delta)

Desde `mobile-pet-tracker/`. Base medida en 71ff81a1 (requirements §Base medida); re-medir tras el merge de #197.

| Comando | Base | Delta | Esperado |
|---|---|---|---|
| `grep -cF 'useShadows' src/screens/home/index.tsx` | 0 | +2 | 2 |
| `grep -cF 'useShadows' src/screens/home/weekly-activity-chart.tsx` | 0 | +2 | 2 |
| `grep -cF '<HomeEntrance index={' src/screens/home/index.tsx` | 7 | 0 | 7 |
| `grep -cF 'border-r border-border' src/screens/home/index.tsx` | 3 | −2 | 1 |
| `grep -cF 'bg-accent-soft' src/screens/home/index.tsx` | 3 | −3 | 0 |
| `grep -cF '<Battery' src/screens/home/index.tsx` | 1 | −1 | 0 |
| `grep -cF 'tracking-widest' src/screens/home/index.tsx` | 1 | −1 | 0 |
| `grep -cF 'text-accent-strong' src/screens/home/index.tsx` | 2 | +1 | 3 |
| `grep -cF 'text-success' src/screens/home/index.tsx` | 1 | −1 | 0 |
| `grep -cF 'className="h-12 w-full rounded-card"' src/screens/home/index.tsx` | 1 | −1 | 0 |
| `grep -cF 'testID="home-error"' src/screens/home/index.tsx` | 1 | 0 | 1 |
| `grep -cF "t('common.somethingWentWrong')" src/screens/home/index.tsx` | 2 | −1 | 1 |
| `grep -cF 'size={24}' src/screens/home/index.tsx` | 1 | −1 +1 | 1 (el `Alert` del badge, R15) |
| `grep -cF 'bg-success' src/screens/home/collar-battery-bar.tsx` | 1 | −1 | 0 |
| `grep -cF 'Math.min(bar.width, height) / 2' src/screens/home/weekly-activity-chart.tsx` | 2 | −2 | 0 |
| `grep -cF 'bg-surface-secondary' src/screens/home/weekly-activity-chart.tsx` | 1 | −1 | 0 |
| `grep -cF 'fillOpacity' src/screens/home/weekly-activity-chart.tsx` | 0 | +≥1 | ≥ 1 |
| `grep -cF 'tone' src/components/empty-state.tsx` | 0 | +≥2 | ≥ 2 |
| `grep -cF 'badge' src/components/empty-state.tsx` | 0 | +≥2 | ≥ 2 |
| `grep -cF 'actionIcon' src/components/empty-state.tsx` | 0 | +≥2 | ≥ 2 |
| `grep -cF "import { Plus } from 'reicon-react-native';" src/components/empty-state.tsx` | 1 | 0 | 1 |
| `grep -cF 'home-error-action-icon' src/screens/home/index.tsx` | 0 | +1 | 1 |
| `grep -cF 'home-error-badge' src/screens/home/index.tsx` | 0 | +1 | 1 |
| `grep -cF 'TABULAR_NUMS' src/screens/home/index.tsx` | 9 | 0 | 9 |
| `grep -cF 'home.loadPetsError' src/i18n/catalog.ts` | 0 | +4 | 4 (dos claves × es/en; si el catálogo declara las claves en otro sitio, reportar la cifra) |
| `grep -cF 'home.loadPetsError' src/__tests__/ui-copy-table.ts` | 0 | +2 | 2 |
| `grep -cF "key: 'common.somethingWentWrong'" src/__tests__/ui-copy-table.ts` (filas de `index.tsx`) | 2 | −1 | 1 |
| total de `bg-accent-soft` en CN (expresión de K27) | 7 | −3 | 4 |
| LG `index.tsx` / suma `#61 R4` | 2 / 13 | +1 / +1 | 3 / 14 |
| `grep -rcF '#198 R' src --include=*.test.ts --include=*.test.tsx \| awk -F: '{s+=$2} END {print s}'` | 0 | + | ≥ 18 |
| `grep -rn 'StyleSheet.create' src/screens/home src/components/empty-state.tsx \| wc -l` | 0 | 0 | 0 |

## Bloques por requisito

Formato de cada bloque: (1) test rojo, (2) implementación mínima, (3) refactor. Tests y títulos exactos en requirements §Requisitos.

- **R1** (1) HI `#198 R1 …` + K1 + borrar el `describe` CF `#197 R20` (K28). (2) `useShadows` en `HomeScreen`; clases de `summary-card` y
  su título. (3) Ninguno.
- **R2** (1) HI `#198 R2 …` + K2–K5. (2) `SUMMARY_TILES`, mosaicos, tintas, valor y etiqueta. (3) Reutilizar el `map` de las celdas.
- **R3** (1) HI `#198 R3 …` + K8 (collar), K17 + CN ` - 1` + HP K41. (2) Fila del collar, `collar-icon`, columna,
  quitar `Battery`. (3) Ninguno.
- **R4** (1) HI `#198 R4 …` + K16 + LG K26 + HP K41. (2) Clases de `collar-battery-bar.tsx` y tinta de `collar-battery`. (3) Ninguno.
- **R5** (1) HI `#198 R5 …` + K9, K10. (2) `lip` en `QUICK_ACTIONS`, `useChunkyLip`, clases de tile, icono y etiqueta. (3) Ninguno.
- **R6** (1) HI `#198 R6 …` + K11, K12. (2) Índices 2..7. (3) Ninguno.
- **R7** (1) WC `#198 R7 …`. (2) `useShadows` en la gráfica; clases de tarjeta, título y subtítulo. (3) Ninguno.
- **R8** (1) WC `#198 R8 …`. (2) Clases de etiqueta de métrica, check 13, tooltip 800. (3) Ninguno.
- **R9** (1) WC `#198 R9 …`. (2) `rx`, `fillOpacity`, clases del detalle. (3) Ninguno.
- **R10** (1) HI `#198 R10 …` + K13, K14, K15. (2) Sección, cabecera, filas con sombra, títulos y píldoras. (3) Una constante local
  para la clase de fila si se repite cuatro veces.
- **R11** (1) HI `#198 R11 …` + K8 (última posición) + CN ` - 1`. (2) Clases de `last-position-card`, círculo, etiqueta y hora. (3) Ninguno.
- **R13** (1) HI `#198 R13 …` + K6 (segundo paso) + CN ` - 1` + HP K41. (2) Rama sin dispositivo del resumen y del collar. (3) Ninguno.
- **R14** (1) HI `#198 R14 …` + K18–K21 + K22/K24 (carga) + K37. (2) Esqueleto de cuatro bloques sin título. (3) Ninguno.
- **R18** (1) ES `#198 R18 …` (seis `it`) + EI K25 (línea de `react`). (2) Props `badge`, `actionIcon` y `body?` en `EmptyState`.
  (3) Ninguno.
- **R15** (1) HI y ES `#198 R15 …` + K22/K23/K24 (error) + EI K25 (`category-palette`), K39, K40 + DD K43 + PF K44 + AC K46 + UL K47
  + filas de `ui-copy-table.ts`. (2) Claves en `catalog.ts`, prop `tone` en `EmptyState` (disco, huellas, título), rama de error
  en `home-states` con `badge` y `actionIcon`. (3) Ninguno.
- **R16** Nace verde (declarado): (1) HI `#198 R16 …` en commit `test`. (2) Ninguna. (3) Ninguno.
- **R12** Nace verde tras R1 y R7 (declarado): (1) HCF `#198 R12 …` en commit `test`. (2) Ninguna. (3) Ninguno.
- **R17** Nace verde tras R1–R16 (declarado): (1) HCF `#198 R17 …` con la tabla de design.md §Contraste. (2) Ninguna. (3) Ninguno.
