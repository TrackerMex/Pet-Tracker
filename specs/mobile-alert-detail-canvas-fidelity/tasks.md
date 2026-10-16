---
feature: mobile-alert-detail-canvas-fidelity
id: 180
status: draft        # draft | approved
tags: [mobile, ui, canvas, alerts, spec]
---

# Tareas — #180 Detalle de alerta fiel al canvas

Reglas: un commit rojo y un commit verde por requisito, test primero; nunca implementación y test en el
mismo commit. Todas las órdenes desde `mobile-pet-tracker/` (`cd` explícito en cada cadena). Jest de un
fichero con `bunx jest <ruta> --testTimeout=30000`, solo con `pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'`
y `pgrep -f '[i]nit.sh'` vacíos. **No** `./init.sh`. Rutas con paréntesis, escapadas (`\(tabs\)`). RNTL 14:
`await` en `fireEvent`, `render` y `act`. Tras cada verde: `bunx tsc --noEmit` y
`bunx expo lint --no-cache > log 2>&1 && ! grep -qF 'Failed to run' log` (el SIGKILL por OOM sale con 0).
Abreviaturas de ficheros: requirements §3 y §4. Skill: `expo:expo-overview` (en Codex, el nombre de su
catálogo). `Date.now()` no va en el render (`react-hooks/purity`).

## H0 — Arranque

1. `git fetch origin && git merge origin/main` en la branch; registrar el hash como H0.
2. Precondición P1-P10 (requirements §2). Si alguna falla: **PARA**, nada más.
3. Medir M1-M20 y anotar base en `progress/impl_mobile-alert-detail-canvas-fidelity.md`.
4. Medir por contenido las líneas literales de §4 que dependen de H0 (no por número de línea):
   - cola de la expresión de longitud en LP: `grep -nF ', // #' src/providers/__tests__/language-provider.test.tsx` (K4);
   - `grep -nF 'toHaveLength(13 + 1' src/__tests__/consistency-classnames.test.ts` (K7);
   - `grep -nF "title: 't:alerts.detailTitle'" src/app/__tests__/layout.test.tsx` (K1);
   - las catorce anclas de R12.1: `grep -cF -e '<ancla>' <spec>` = 1 cada una;
   - `grep -c '^### §2\.' ../specs/mobile-ui-language/design.md` → `<N>` = valor + 1 (R12.3);
   - la última `## Enmienda #` de `../docs/ui-guidelines.md`.
5. Suites de ruta que montan `/alerts/<id>`: correr `alert-detail.navigation`, `alert-detail.notification`,
   `detail-stack`, `detail-stack.guard`; donde den rojo por `Animated.View` indefinido, copiar el doble de
   `alert-detail.navigation.test.tsx` (líneas 47-51, con `__esModule: true`). Es un commit propio
   `test(mobile): #180 H0 — doble de reanimated en las rutas del detalle` solo si hizo falta.
6. Sonda `twMerge` en `Card` (R3.1): `render(<Card variant="hero" className="bg-category-rose" />)` fuera del
   árbol (fichero temporal en el scratchpad, no commiteado) y comprobar que la clase final no contiene
   `bg-surface-secondary`. Anotar el resultado; si contiene, activar el fallback `View` de R3.1.

## R1 — Título en el contenido

1. **Rojo**: DT (3 `it` de R1.2), LT (K1), UL (K2, `every(file === detail)`) y `ui-copy-table.ts` (K3, solo
   la fila movida), PF (K10, lista de `text-26`), AC (K14, lista de `tracking-title`). Correr DT, LT, UL, PF y AC.
   Commit `test(mobile): #180 R1 rojo — título del detalle en el contenido`.
2. **Verde**: `_layout.tsx` (`title: ''`; M1 +1, M2 -1), título en los tres estados de la pantalla (M3 +1, M7 +1,
   M12 +1). Commit `feat(mobile): #180 R1 título del detalle en el contenido (D-H)`.
3. **Refactor**: ninguno.

## R8 — `alerts.mapLabel`

1. **Rojo**: LP (K4 longitud `+ 1`, K5 las dos filas), UL (K2 `+ 1`) y `ui-copy-table.ts` (K3 fila nueva).
   Commit `test(mobile): #180 R8 rojo — alerts.mapLabel`.
2. **Verde**: `catalog.ts` (en y es), `specs/mobile-ui-language/design.md` (fila de `alerts.mapLabel`; la nota de
   `alerts.detailTitle` va con R12.3). Commit `feat(mobile): #180 R8 alerts.mapLabel`.
3. **Refactor**: ninguno.

## R11 — `alert-meta.ts` (campos nuevos)

1. **Rojo**: `src/utils/alert-meta.test.ts` nuevo, `it.each` por tipo con los cinco campos nuevos (sin la
   aserción de `surface`, que va en R3). Commit `test(mobile): #180 R11 rojo — campos del héroe en alert-meta`.
2. **Verde**: añadir `solid`, `onSolid`, `onSolidText`, `heroInk`, `ring` (tabla de R11.1). **No** se quita
   `surface` todavía (el detalle aún lo lee). Commit `feat(mobile): #180 R11 campos del héroe en alert-meta`.
3. **Refactor**: ninguno.

## R3 — Héroe

1. **Rojo**: DT (R3.1-R3.6, K16 sin la columna `surface`, el `it` de ~174 reescrito, el de la fecha enmendado);
   `alert-meta.test.ts` (`'surface' in meta === false`); C: `alert-detail-canvas-fidelity.test.ts` (R3.7);
   PF (K10 lista `text-13`, K11 `variant="hero"`), DD (K13 solo `text-22`), AC (K14 `text-15`).
   Commit `test(mobile): #180 R3 rojo — héroe centrado con disco, píldora y fecha corta`.
2. **Verde**: tarjeta, disco, píldora y fecha en `index.tsx`; quitar `surface` de `alert-meta.ts` (M5 = 0).
   M6 +1 (salvo fallback), M8 +1, M9 +1, M11 +1, M20 = 1. Commit
   `feat(mobile): #180 R3 héroe del detalle fiel al canvas`.
3. **Refactor**: extraer la píldora de estado a una función local si el JSX supera 40 líneas; tests intactos.

## R4 — Ping

1. **Rojo**: `ping-ring.test.tsx` (A, R4.1), DT (R4.2 con su control positivo, R4.3), C (R4.4).
   Commit `test(mobile): #180 R4 rojo — ping del héroe`.
2. **Verde**: `ping-ring.tsx` y su uso en la tarjeta detrás del disco. Commit
   `feat(mobile): #180 R4 ping del héroe`.
3. **Refactor**: ninguno.

## R5 — Mapa y píldora

1. **Rojo**: DT (R5.1-R5.4; los `it` de ~459/~503/~600 enmendados; doble de `pet-map` registrando `children`).
   Commit `test(mobile): #180 R5 rojo — mapa h-52.5 rounded-24 con píldora de distancia dentro`.
2. **Verde**: mapa, píldora dentro, `accessible` + `accessibilityLabel`. Commit
   `feat(mobile): #180 R5 mapa con píldora de distancia`.
3. **Refactor**: ninguno.

## R6 — CTA

1. **Rojo**: DT (R6.1, R6.2, K17 `Map` en el doble de reicon). Commit
   `test(mobile): #180 R6 rojo — CTA con icono Map y h-13`.
2. **Verde**: la CTA (`h-13`, icono `Map`, etiqueta). Commit `feat(mobile): #180 R6 CTA Ver en el mapa`.
3. **Refactor**: ninguno.

## R7 — Ack primario

1. **Rojo**: DT (R7.1), CC (K7, K8, K9), DD (K13 `text-17`). Commit
   `test(mobile): #180 R7 rojo — ack primario con labio`.
2. **Verde**: botón del ack (M10, M14, M15, M16 +1). Commit `feat(mobile): #180 R7 ack primario con labio`.
3. **Refactor**: ninguno.

## R2 — Marco y orden de hijos

(Va después de R5-R7 porque R2.3 asevera nodos que esos requisitos crean.)

1. **Rojo**: DT (R2.1 con y sin `insets.bottom`, R2.2 dos `it`, R2.3 `it.each` de cuatro combinaciones, K18).
   Commit `test(mobile): #180 R2 rojo — marco, espaciador y orden de hijos`.
2. **Verde**: `contentContainerStyle`, espaciador. Commit `feat(mobile): #180 R2 marco y ack anclado al fondo`.
3. **Refactor**: ninguno.

## R9 — Entrada

1. **Rojo**: DT (R9.1, doble de `home-entrance` que registra `index`). Commit
   `test(mobile): #180 R9 rojo — entrada escalonada del héroe y el mapa`.
2. **Verde**: `HomeEntrance` en torno al héroe y al mapa. Commit `feat(mobile): #180 R9 entrada escalonada`.
3. **Refactor**: ninguno.

## R10 — Carga y error

1. **Rojo**: DT (R10.1, R10.2), PF (K12 `rounded-hero`). Commit
   `test(mobile): #180 R10 rojo — esqueleto rounded-hero y reintento h-13`.
2. **Verde**: esqueleto y reintento (M13 +1). Commit `feat(mobile): #180 R10 carga y error`.
3. **Refactor**: ninguno.

## R12 — Carta, ui-language y specs

1. **Rojo**: C (describe `#180 R12: enmiendas`), AC (K15). Commit
   `test(mobile): #180 R12 rojo — enmiendas de la carta y de las specs`.
2. **Verde**: los bloques de `design.md` §4 en los siete ficheros de R12.1, los marcadores de las anclas, las
   líneas de la carta de R12.2 (M18 = 0, M19 +1) y `### §2.35` (R12.3, K6). Commit
   `docs(mobile): #180 R12 enmiendas y carta del detalle de alerta`.
3. **Refactor**: ninguno.

## R13 — Cierre de candados

1. Correr todos los candados de §4 y los que «no cambian pero se re-ejecutan». Cada cifra de cierre = base H0
   + delta. Si algo difiere, anotar y razonar en `progress/impl_*.md`.
2. Commit `test(mobile): #180 R13 candados agregados` solo si quedó algo por ajustar.
3. Suite entera del móvil con `bunx jest --testTimeout=30000` y, aparte, **sin** ese flag los `it` nuevos
   (`init.sh` usa 5000 ms). El aviso «worker force-exit» es preexistente: contarlo solo en la medida.

## Sondas de mutación (tras R12; cada una se planta, se corre, se revierte con `git checkout HEAD --`)

Antes de plantar, medir con `grep -n` la línea exacta (no se cita número).

| # | Mutación | Debe ponerse en rojo |
|---|---|---|
| S1 | `insets.bottom + 40` → `+ 24` | R2.1 (los dos `it`) |
| S2 | quitar el espaciador cuando la alerta no está abierta | R2.2 |
| S3 | dejar `bg-surface-secondary` ganando en la tarjeta | R3.1 |
| S4 | píldora abierta con `bg-default` | R3.4 |
| S5 | `onSolid` de `battery_low` → `danger-foreground` | R3.3 y `alert-meta.test.ts` |
| S6 | ping también cuando `status === 'acked'` | R4.2 |
| S7 | ping bajo `useReducedMotion() === true` | R4.2 |
| S8 | `scale` final 1.5 → 1.4 | R4.1 (2500 ms) |
| S9 | la píldora de distancia como hermana del mapa | R5.2 |
| S10 | `PetMap` recibe la píldora como `children` | R5.3 |
| S11 | `accessibilityLabel` con `zone.name` aun existiendo `payload.geofenceName` | R5.4 |
| S12 | `Map` después de la etiqueta | R6.1 |
| S13 | ack también visible con `acked` | R7.1 |
| S14 | error de ack después del botón | R2.3 / R7.1 |
| S15 | restaurar `title: t('alerts.detailTitle')` en `_layout.tsx` | R1.1 y K2 |
| S16 | `Skeleton` con `rounded-card` | R10.1 |
| S17 | quitar `(#180)` de la línea nominal de la carta | R12 |
| S18 | volver a poner `confirmar alerta en el detalle).` en la carta | R12 y K15 |

Si una sonda no se pone en rojo, el candado es ciego: se arregla el candado, no la sonda.
