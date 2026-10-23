---
feature: "mobile-canvas-health-weight"
status: approved
tags: [mobile, ui, spec, canvas-parity]
---

# Tareas — [[mobile-canvas-health-weight]]

## Orden recomendado

0. **Precondición (D25):** #197 mergeada en `dev` y mergeada en la branch.
   Re-medir las anclas `(#197: …)` de requirements §Base medida y las firmas de
   `ScreenHeader` y `RiseIn`; si algo difiere, parar y avisar al leader.
1. Cimientos: R27 (`--text-34`, siete constantes de movimiento) y los helpers
   de fecha de R11, R14 y R5 (`fmtDayMonth`, `fmtDayMonthLong`,
   `fmtMonthShort`) con DT.
2. `WeightChart`: R5 y después R6.
3. Peso: R1, R2, R3, R4, R7, R8, R9, R10, R11, R22, R23.
4. Salud: R12, R13, R14, R15, R16, R17, R18, R19, R20, R21.
5. Copy: R25 (claves y filas de `ui-copy-table.ts`).
6. Carta: Enmienda #199 en `docs/ui-guidelines.md` (R24),
   **solo si** la casilla «Enmienda #199 aprobada por humano» de requirements
   §Aprobación está marcada.
7. CF (R26) y las filas de requirements §Candados que esta feature revierte.
8. Cuentas a re-medir (abajo) y suite completa.

## Notas para el handoff

- **Commits test primero (C4).** Por cada requisito, primero un commit con el
  test en rojo (`test(#199): R<n> …`) y después el de la implementación
  (`feat(#199): R<n> …`). Nada de mezclar implementación, tests y docs en un
  commit. Las enmiendas de candados ajenos van en el commit rojo del
  requisito que las provoca.
- **No correr `./init.sh`.** El leader lo corre. Tests acotados con
  `cd mobile-pet-tracker && bunx jest --runTestsByPath <ruta>`; nunca `npx`
  ni `npm`.
- **Sin dependencias nuevas.** Nada de `expo-linear-gradient`.
- **No tocar** `components/pet-switcher.tsx`, `components/card.tsx`,
  `components/screen-header.tsx`, `components/rise-in.tsx` (de #197), `screens/home/index.tsx` ni nada fuera de
  design §Archivos afectados.
- **Candados de la casa:** nada de clases `[…]`, nada de `StyleSheet.create`
  (tampoco en los tests de HE, WL, WC, DT y CF), ningún hex salvo en
  comentarios `#199 R<n>`, colores de categoría solo vía
  `CATEGORY_SLOTS[slot].surface`/`.ink`, `CONTINUOUS_CORNER` en esquinas que
  no son cápsula, texto con `text-13/15/17` en `Text` de RN (no `cn()` de
  heroui).
- **Nombres de test:** `describe` nuevo `#199 R<n>: …`, `it` nuevo empieza por
  `#199 R<n>`, `it` ajeno enmendado lleva el sufijo
  ` (enmendado por #199 R<n>)`.
- **RNTL 14:** `await` en cada `fireEvent` y `act`; `await` del render de
  `renderRouter` antes de asertar.
- **Timers:** asertar en el ms anterior al arranque y tras duración + retraso
  completos (requirements R5, R6, R22, R23); no a mitad de curva salvo el
  pico del `pop` (1540 ms).
- **Retraso de `RiseIn` en WL y HE:** doble `jest.mock` de `components/rise-in` y
  helper `riseDelayOf(node)` de requirements §Requisitos funcionales, en el
  primer test de cada fichero que lea el retraso (WL: R3; HE: R14). El
  `RiseIn` real y su test son de #197 R24.
- **Copy:** los literales salen de requirements R25; no inventar textos.
- **Lint:** `cd mobile-pet-tracker && bunx expo lint --no-cache > /tmp/lint199.log 2>&1 && test ! -s /tmp/lint199.log`.
- **Skills:** el leader nombra en el prompt las skills de Codex que
  correspondan (catálogo de `.claude/agents/leader.md`); aquí no se nombran.
- **Reporte:** `progress/impl_mobile-canvas-health-weight.md`.

## Cuentas a re-medir al terminar (base + delta)

La base es la medida tras mergear #197 (paso 0), no la de esta spec. Desde
`mobile-pet-tracker/`:

| Medida | Comando | Delta |
|---|---|---|
| Filas de Salud en la tabla de copy | `grep -cF "'src/screens/health/index.tsx'" src/__tests__/ui-copy-table.ts` | +5 |
| Filas de Peso en la tabla de copy | `grep -cF "'src/screens/weight-log/index.tsx'" src/__tests__/ui-copy-table.ts` | +2 |
| Filas de la gráfica en la tabla de copy | `grep -cF "'src/components/weight-chart.tsx'" src/__tests__/ui-copy-table.ts` | +1 |
| Filas de `_layout` en la tabla de copy | `grep -cF "file: 'src/app/_layout.tsx'" src/__tests__/ui-copy-table.ts` | −1 (queda 0) |
| `SCREEN_FILES` (UL `#194 R5`) | cifra que asierta UL | −1 |
| Claves nuevas por idioma | `grep -cF "'weightLog.history'" src/i18n/catalog.ts` (y las otras seis de R25) | +1 por idioma cada una |
| `--text-34` | `grep -cF -- '--text-34' src/theme/global.css` | +1 (si #198 ya lo trajo, 0) |
| Constantes de dibujo | `grep -cF 'MOTION_DRAW' src/theme/motion.ts` | +3 |
| Exportaciones de `motion.ts` (MT `no exporta nada más`) | `node -e` sobre `Object.keys(require(...))` o longitud del array del `it` | +7 sobre la base medida (#200 suma 2 más si mergea antes) |
| `inkSites` y `warningSites` (LG `#61 R4`, `#61 R5`) | cifras por fichero que asierta LG | las de requirements §Candados |
| Agregados CC `#62 R14`, `#62 R15` y PCF `text-13` | cifras que asiertan | re-medir; no copiar de la spec |

Si un delta no cuadra, se explica en el reporte antes de enmendar un candado.

## Bloques TDD por requisito

Cada bloque: (1) test rojo, (2) implementación mínima, (3) refactor. Rutas
relativas a `mobile-pet-tracker/src/`; abreviaturas de test en requirements
§Alcance.

### R1 — Cabecera propia de Peso
1. WL `#199 R1` (`weight-log-header`, `-back`, `-title`) y LY: `weight-log`
   con `headerShown: false` y sin título nativo. Borrar de F197 el `describe`
   `#197 R20: cimientos sin cablear` entero (requirements §Candados).
2. `ScreenHeader` en `screens/weight-log/index.tsx`; opción en `app/_layout.tsx`.
3. Quitar el uso huérfano de `t('weightLog.weightLog')` en `_layout`.

### R2 — Métricas del scroll y teclado
1. WL `#199 R2` (padding, gap, `keyboardVerticalOffset` 0); enmendar `#148 R7`
   (291 → 200).
2. Quitar `HeaderHeightContext` y fijar las métricas.
3. Nada.

### R3 — Tarjeta de la gráfica
1. WL `#199 R3` (`View` `rounded-24`, `CONTINUOUS_CORNER`).
2. Sustituir el `Card` de la gráfica.
3. Nada.

### R4 — Cifra y delta del mes
1. WL `#199 R4` (`text-34`, tonos up/down/flat, `TABULAR_NUMS` en el texto
   del delta); enmendar WL `#169 R6` (`weight-current`, `weight-month-delta`
   ausente, y `no pinta el resumen sin entradas` espera `weight-log-empty`).
2. `DELTA_TONE` (design §Decisiones 3).
3. Compartir `DELTA_TONE` con R10.

### R5 — Gráfica completa
1. WC `#199 R5` (ventana `chartMonths`, `viewBox` 310x110, rejilla, área
   `tab-pill`, `draw`, `pop`, meses, etiqueta accesible, reduce motion); DT
   para `fmtMonthShort`. Enmendar WC `#169 R4` (`R4a`–`R4c`: longitudes
   nuevas y recuento solo de las llamadas con `MOTION_DRAW_TIMING`); si el
   `Path` real no expone `testID` ni `strokeDasharray`, el mock de
   `react-native-svg` de WC suma un `Path`.
2. Geometría parametrizada, `useAnimatedProps` del trazo y del `r`.
3. Quitar `LinearGradient` y el código del `viewBox` 100x40.

### R6 — Gráfica mini
1. WC `#199 R6` (`variant="mini"`, geometría 56, `draw` a los 300 ms, sin
   meses ni `pop`).
2. Rama `mini` de la geometría.
3. Una sola función de puntos para ambas variantes.

### R7 — Formulario en dos columnas
1. WL `#199 R7` (`Card` flat, `weight-form`, dos columnas); enmendar PCF
   `#173 R3` (lista de `filesMatching`, junto con R16 y R19).
2. Recolocar los campos.
3. Nada.

### R8 — Envío sin cambios
1. WL `#199 R8` (receta `h-14 rounded-16 bg-accent` intacta).
2. Ninguna si ya pasa: el test nace verde y lo dice el reporte.
3. Nada.

### R9 — Historial
1. WL `#199 R9` (`weight-history-title`, filas sin `HeroUICard`); enmendar
   CTA `#177 R6.2` (dos `+ 1`) y WL `R7…` (fecha corta).
2. Título y filas.
3. Nada.

### R10 — Tile, cifra y delta de la fila
1. WL `#199 R10` (`size-9`, `tileClassName`); CC enmendado.
2. Cambiar `size-8` por `size-9`.
3. Nada.

### R11 — Fecha corta de la fila
1. DT `#199 R11` (`fmtDayMonth`, filas que cruzan mes y año) y WL
   `weight-row-${id}-date`.
2. Helper en `screens/home/format.ts`.
3. Nada.

### R12 — Cabecera de Salud
1. HE `#199 R12` (`health-header`).
2. Cabecera.
3. Nada.

### R13 — Avatares
1. HE `#199 R13` (`variant="avatars"`); enmendar HE `#168 R2` (selector desde
   `health-header`).
2. Elegir la variante.
3. Nada.

### R14 — Panel de la próxima dosis
1. HE `#199 R14` (ámbar, `rounded-24`, tile `rounded-16`, fecha larga y día
   relativo); DT para `fmtDayMonthLong`.
2. Panel y helper.
3. Nada.

### R15 — Título de Vacunas
1. HE `#199 R15` (`vaccines-title`, sin `HeartPulse`).
2. Título.
3. Nada.

### R16 — Filas de vacunas
1. HE `#199 R16` (`Card` flat); enmendar HE `#168 R3` (`pinta el estado de
   $id…`: columna de dos hijos, con R17).
2. Filas.
3. Nada.

### R17 — Subtítulo de una línea
1. HE `#199 R17` (`vaccine-dates-${id}`).
2. Subtítulo.
3. Nada.

### R18 — Tarjeta de peso de Salud
1. HE `#199 R18` (píldora, `WeightChart variant="mini"`, enlace `rounded-14`);
   enmendar HE `#115 R5` (3 hijos, aviso en el índice 1).
2. Tarjeta y `VARIATION_TONE`.
3. Nada.

### R19 — Vacunas: carga, vacío y error
1. HE `#199 R19` (`vaccines-skeleton-tile`).
2. Estados.
3. Nada.

### R20 — Peso de Salud: vacío y error
1. HE `#199 R20`.
2. Estados.
3. Nada.

### R21 — Mascotas: carga y error
1. HE `#199 R21` (`health-loading-0/1`).
2. Estados.
3. Nada.

### R22 — Peso: carga, vacío y error
1. WL `#199 R22` (`weight-log-skeleton-row-0..2`, retrasos `60 · i`).
2. Estados.
3. Nada.

### R23 — Toast
1. WL `#199 R23` (`FadeIn` con retraso, `useShadows().toast`, sin
   `absolute top-4`); enmendar WL `#169 R13` (`el fuente declara el fundido…`)
   y `#169 R10` (`className` y check en `accent-strong`).
2. Toast.
3. Nada.

### R24 — Enmienda #199
1. CF `#199 R24`: encabezado de la carta una vez y casilla con
   `/- \[[ xX]\] Enmienda #199 aprobada por humano/`.
2. Copiar a la carta el texto literal de design §Decisiones técnicas 5 (tras
   la firma). `RiseIn` se consume sin modificarlo y sin anidarlo.
3. Nada.

### R25 — Copy nuevo y su tabla
1. UL con las filas nuevas en `ui-copy-table.ts`; fila de `_layout` movida a
   `weight-log`; `SCREEN_FILES` −1.
2. Siete claves en `i18n/catalog.ts`.
3. Nada.

### R26 — Fidelidad al canvas
1. CF `#199 R26` (las 17 filas de requirements R26).
2. Ajustar lo que no case con el canvas.
3. Nada.

### R27 — Tokens, constantes y guardas
1. CF `#199 R27` (`--text-34`, siete constantes), DD y la enmienda MT `no exporta nada más` (§Candados).
2. Token y constantes.
3. Nada.
