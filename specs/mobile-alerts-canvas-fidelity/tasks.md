---
feature: mobile-alerts-canvas-fidelity
id: 174
status: draft
---

# Tareas — #174 Alertas fieles al canvas

Reglas: un commit rojo y un commit verde por requisito, test primero; nunca implementación y test en el
mismo commit. Todas las órdenes desde `mobile-pet-tracker/` (`cd` explícito). Jest de un fichero con
`bunx jest <ruta> --testTimeout=30000`, solo con
`pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'` y `pgrep -f '[i]nit.sh'` vacíos. **No** `./init.sh`.
Abreviaturas de ficheros: requirements §2. Tras cada verde: `bunx prettier --write` de los ficheros
tocados, `bunx tsc --noEmit` y `bunx expo lint --no-cache` en verde.

## H0 — Arranque

1. `git fetch origin && git merge origin/main` en la branch; registrar el hash como H0.
2. Precondición P1–P8 (requirements §1). Si alguna falla: **PARA**, nada más.
3. Medir M1–M36 y anotar base en `progress/impl_mobile-alerts-canvas-fidelity.md`.
4. Medir y anotar las líneas literales de §3 que dependen de H0:
   - `grep -nF ', // #' src/providers/__tests__/language-provider.test.tsx` → última línea de la expresión de longitud (L1);
   - `grep -cF 'expect(count(/border-lip-gray/g)).toBe(' src/__tests__/consistency-classnames.test.ts` = 1 y su expresión (L8);
   - `grep -c '^### §2\.' ../specs/mobile-ui-language/design.md` → `<N>` = valor + 1 (R2.3);
   - la última `## Enmienda #` de `../docs/ui-guidelines.md` (R11.1);
   - el describe `#173 R2.4: inventario de tamaños nuevos` de PF y sus dos listas (R12.2).

## R1 — Tokens

1. **Rojo**: G, describe `#174 R1: tokens del canvas de Alertas`. Falla el `toMatchObject`.
   Commit `test(mobile): #174 R1 rojo — tokens text-15, radius-10 y tracking`.
2. **Verde**: los cuatro literales en `global.css` (R1.1). M1–M4 = 1; P2, P3 = 1.
   Commit `feat(mobile): #174 R1 tokens del canvas de Alertas`.
3. **Refactor**: ninguno.

## R2 — Copy de días

1. **Rojo**: A (`it` «formatea…», R2), LP (describe `#174 R2`, fila L2, expresión L1),
   `ui-copy-table.ts` (fila L3). Correr A, LP y `src/__tests__/ui-language.test.ts`.
   Commit `test(mobile): #174 R2 rojo — Hace 1 día y días con palabra completa`.
2. **Verde**: catálogo (R2.1, M5–M9), formateador (R2.2), `specs/mobile-ui-language/design.md` (R2.3, L4).
   Commit `feat(mobile): #174 R2 alerts.dayAgo y alerts.daysAgo con palabra completa`.
3. **Refactor**: ninguno.

## R3 — Título en el contenido

1. **Rojo**: A (describe `#174 R3` en lugar de `#114 R5`; aserción añadida a `#78 R8`), L (L6),
   `ui-copy-table.ts` (L5), PF (lista de `text-26` con `'screens/alerts/index.tsx'`, R12.2).
   Correr A, L, PF y ui-language.
   Commit `test(mobile): #174 R3 rojo — título Alertas en el contenido`.
2. **Verde**: `_layout.tsx` (`title: ''`, M10 = 0), `ListHeaderComponent` (R3.2, M11, M12), design.md L7.
   Commit `feat(mobile): #174 R3 título de Alertas en el contenido (D-H)`.
3. **Refactor**: ninguno.

## R4 — Contador junto al título

1. **Rojo**: A, doble de `PopIn` y `it` reescrito de `#170 R4`; PF (lista de `text-13` con
   `'screens/alerts/index.tsx'`). Commit `test(mobile): #174 R4 rojo — contador en la fila del título`.
2. **Verde**: R4.1–R4.3 (M13 = 1, M25 = 1). Commit `feat(mobile): #174 R4 contador con PopIn junto al título`.
3. **Refactor**: ninguno.

## R5 — Dimensiones

1. **Rojo**: A, `it` de `#114 R6` con el `toEqual` nuevo. Commit `test(mobile): #174 R5 rojo — padding 20 y gap 12`.
2. **Verde**: `contentContainerStyle` (M14 = 0, M15 = 1). Commit `feat(mobile): #174 R5 métricas del artboard`.
3. **Refactor**: ninguno.

## R6 — Secciones

1. **Rojo**: A, `it` de `#170 R3` reescrito. Commit `test(mobile): #174 R6 rojo — secciones gap-3 y cabecera 13 extrabold`.
2. **Verde**: R6.1–R6.2 (M16 = 0). Commit `feat(mobile): #174 R6 secciones del artboard`.
3. **Refactor**: ninguno.

## R7 — Fila

1. **Rojo**: A, `#78 R6`, `#100 R6`, `#170 R5` reescritos (R7 Tests).
   Commit `test(mobile): #174 R7 rojo — anatomía de la fila del artboard`.
2. **Verde**: `alert-meta.ts` (`disc`, M20 = 3, M21 = 1) y la fila (R7.1–R7.4; M17, M18 = 0; M19 = 1).
   Commit `feat(mobile): #174 R7 fila con disco de categoría y subtítulo en una línea`.
3. **Refactor**: ninguno.

## R8 — Ack compacto

1. **Rojo**: A (aserciones de ack en `#78 R6` y «alterna…»), CC (`#166 R3`: regex, lista, recuento L8 e
   `it` nuevo). Commit `test(mobile): #174 R8 rojo — ack secundario compacto con labio`.
2. **Verde**: R8.1 (M22 = 1). Commit `feat(mobile): #174 R8 ack compacto de fila`.
3. **Refactor**: ninguno.

## R9 — Píldoras

1. **Rojo**: A, casos `acked` y `closed` con `className` exacto. Commit `test(mobile): #174 R9 rojo — píldoras de estado`.
2. **Verde**: R9.1–R9.2 (M23 = 0). Commit `feat(mobile): #174 R9 píldoras Leída y Resuelta del artboard`.
3. **Refactor**: ninguno.

## R10 — Entrada escalonada

1. **Rojo**: A, describe `#174 R10` con el doble de `HomeEntrance`. Commit `test(mobile): #174 R10 rojo — entrada de las cinco primeras filas`.
2. **Verde**: R10.1–R10.3 (M24 = 1). Commit `feat(mobile): #174 R10 entrada escalonada de filas`.
3. **Refactor**: ninguno.

## R11 — Enmiendas

1. **Rojo**: F (nuevo), describes `#174 R11: enmiendas` y `#174 R11: la carta declara los cambios`.
   Commit `test(mobile): #174 R11 rojo — enmiendas a carta y specs`.
2. **Verde**: bloques, marcadores y textos (R11.1–R11.2; M26, M28–M36).
   Commit `docs(mobile): #174 R11 enmiendas a la carta y a cinco specs`.
3. **Refactor**: ninguno.

## R12 — Agregados y grep-limpio

1. F, describes `#174 R12: inventarios` y `#174 R12: grep-limpio` (nacen verdes). Estructura:
   `it.each` de las cuatro regex de R12.1, `it` del recuento `border-b-5` = 1, `it.each` de grep-limpio por
   fichero (alertas y alert-meta), `it` de clases salientes, `it` de R12.4.
2. **Sondas** (cada una se planta, se corre F y se revierte con `git checkout HEAD -- <fichero>`;
   después `git diff --quiet` y `git diff --cached --quiet` en 0):

   | Sonda | Mutación | Fichero | Resultado esperado en F |
   |---|---|---|---|
   | S12.1 | añadir ` rounded-10` a un `className` | `src/screens/reminders/index.tsx` | 1 failed (fila `rounded-10`) |
   | S12.2 | comentario `// text-15` | `src/screens/reminders/index.tsx` | 1 failed (fila `text-15`) |
   | S12.3 | comentario `// border-b-5` | `src/screens/alerts/index.tsx` | 1 failed (recuento) |
   | S12.4 | comentario `// 🔔` | `src/utils/alert-meta.ts` | 1 failed (grep-limpio de alert-meta) |
   | S12.5 | comentario `// shadow-sm` | `src/screens/alerts/index.tsx` | 1 failed (clases salientes) |
   | S12.6 | quitar `text-13 ` del `className` de la cabecera de sección | `src/screens/alerts/index.tsx` | 1 failed (R12.4); en A, 1 failed (`it` de R6) |

   Si un recuento no cuadra, PARA y anótalo en `progress/impl_…`; no se ajusta la sonda.
3. Commit `test(mobile): #174 R12 inventarios y grep-limpio de Alertas`.
4. Cierre: M1–M38 con su valor «Al cerrar»; correr A, G, LP, L, CC, PF, F, ui-language y design-drift con
   `--testTimeout=30000`, y anotar los recuentos.

## R13 — Humo (humano)

El humano corre R13.1 en dev build de Android y marca la casilla de requirements §6.

## Trazabilidad

Último commit: `docs(mobile): #174 trazabilidad` con `traceability.md` relleno (test y hash por R-id).
