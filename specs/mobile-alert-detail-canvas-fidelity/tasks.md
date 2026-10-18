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

7. **E1 (P11-P14 y medidas)**: precondiciones P11-P14 y medidas M21-M25 de `requirements.md` § Enmienda E1; M14
   conserva su base y **no** lleva delta. Si una P falla: **PARA**.
8. **E1, sonda de `expo-blur`** (fichero temporal en el scratchpad, no commiteado): `render(<BlurView intensity={48} />)`
   con el módulo **real** bajo jest. Anotar el resultado. Después, las cuatro suites de ruta de `/alerts/<id>`
   (paso 5): donde den rojo por `expo-blur`, copiar a sus mocks el doble de
   `src/components/__tests__/floating-tab-bar.test.tsx` (`BlurView: (props) => React.createElement(View, props)`).
   Commit propio `test(mobile): #180 H0 — doble de expo-blur en las rutas del detalle` solo si hizo falta.
9. **E1, sonda del ping**: en un `ping-ring.test.tsx` temporal, con el doble de reanimated de Welcome y
   `{ duration: 1800, ...MOTION_CELEBRATION_EASE_OUT }`, medir `getAnimatedStyle` a 0 / 900 / 1900 ms y confirmar los
   extremos de R4.1. Si el doble no avanza `withTiming` con `easing`, PARA y avisa al leader (la spec fija los
   puntos, no la técnica).
10. **E1, orden de la lista de `motion.test.ts`**: `node -e "console.log(['MOTION_ALERT_PING_MS','MOTION_BLINK_INTERVAL_MS'].sort())"`
    y comprobar que `MOTION_ALERT_PING_MS` va primera en la lista «no exporta nada más».

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

1. **Rojo**: `ping-ring.test.tsx` (A, R4.1 enmendado por E1: 0 / 900 / 1900 ms), `motion.test.ts` (M, R4.5: el
   valor 1800 y la lista), DT (R4.2 con su control positivo, R4.3), C (R4.4 y R4.5: sin `MOTION_PING_TIMING` ni `1800`
   en `ping-ring.tsx`). Commit `test(mobile): #180 R4 rojo — ping del héroe`.
2. **Verde**: `motion.ts` (`MOTION_ALERT_PING_MS`), `ping-ring.tsx` (`withTiming` con
   `{ duration: MOTION_ALERT_PING_MS, ...MOTION_CELEBRATION_EASE_OUT }`) y su uso en la tarjeta detrás del disco
   (M23 +1). Commit `feat(mobile): #180 R4 ping del héroe`.
3. **Refactor**: ninguno.

## R5 — Mapa y píldora

1. **Rojo**: DT (R5.1-R5.4; los `it` de ~459/~503/~600 enmendados; doble de `pet-map` registrando `children`; doble
   local de `expo-blur` y los `it` de R5.2 enmendado por E1: props del `BlurView`, `it.each` de tema, clase del texto
   y umbrales), G (R5.5, describe nuevo en `global-css.test.ts`), C (R5.6, importadores de `expo-blur`).
   Commit `test(mobile): #180 R5 rojo — mapa h-52.5 rounded-24 con píldora de cristal y desenfoque`.
2. **Verde**: `global.css` (par `glass-surface-strong` en los dos temas, M24 +4), mapa, píldora dentro con
   `BlurView`, `accessible` + `accessibilityLabel` (M22 +1). Sin `bun add`: `package.json` y lockfile intactos.
   Commit `feat(mobile): #180 R5 mapa con píldora de distancia`.
3. **Refactor**: ninguno.

## R6 — CTA

1. **Rojo**: DT (R6.1 enmendado por E1: `h-13 rounded-16 …`, R6.2, K17 `Map` en el doble de reicon); CC (K20: la
   fila `alert-detail-view-map` sale de `rows` de `#166 R3` y entra el `it` `#180 R7.5: «Ver en el mapa» …`; va
   aquí y no en R7 porque la CTA deja `rounded-xl` en este verde y la fila vieja se pondría roja); DD (K19:
   `outsideReminders(/\brounded-(?:16|22)\b/)` = `[detalle]`). Commit
   `test(mobile): #180 R6 rojo — CTA con icono Map, h-13 y rounded-16`.
2. **Verde**: la CTA (`h-13 rounded-16`, icono `Map`, etiqueta; M21 +1). Commit `feat(mobile): #180 R6 CTA Ver en el mapa`.
3. **Refactor**: ninguno.

## R7 — Ack primario

1. **Rojo**: DT (R7.1 enmendado por E1: `w-full h-14 rounded-16 bg-accent border-b-4 border-black/25`), CC (K9: los
   conteos de `border-b-4` y `border-black/25` de `#166 R2` suben 1; **K7 y K8 sin cambio**; el `it`
   `#180 R7.5: el ack …`), DD (K13 `text-17`; el `it` de R7.4 con rounded-16 = 2, rounded-22 = 0, rounded-14 = 0).
   Commit `test(mobile): #180 R7 rojo — ack primario con labio y rounded-16`.
2. **Verde**: botón del ack (M10, M15, M16, M21 +1; **M14 sin delta**). Commit
   `feat(mobile): #180 R7 ack primario con labio`.
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
   El describe cubre además las novedades de E1: la ancla `### R3.` de `mobile-chunky-cta` (quince anclas), la
   viñeta y la línea nominal con `rounded-16` y el `<QUÉ CAMBIA>` nuevo de tres filas.
2. **Verde**: los bloques de `design.md` §4 en los siete ficheros de R12.1, los marcadores de las **quince** anclas,
   las líneas de la carta de R12.2 con los literales de E1 (M18 = 0, M19 +1, M25 +2) y `### §2.35` (R12.3, K6). Commit
   `docs(mobile): #180 R12 enmiendas y carta del detalle de alerta`.
3. **Refactor**: ninguno.

## R13 — Cierre de candados

1. Correr todos los candados de §4, los de E1.4 y los que «no cambian pero se re-ejecutan»
   (`floating-tab-bar.test.tsx`, `design-drift`, la bienvenida). Cada cifra de cierre = base H0 + delta; en K7 y K8
   el delta es **0**. Si algo difiere, anotar y razonar en `progress/impl_*.md`.
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

Sondas de E1 (misma técnica):

| # | Mutación | Debe ponerse en rojo |
|---|---|---|
| S19 | `MOTION_ALERT_PING_MS` → `2400` en `motion.ts` | R4.5 (M) y R4.1 a 1900 ms (A) |
| S20 | el anillo vuelve a `MOTION_PING_TIMING` | R4.1 (A) y R4.5 (C) |
| S21 | la píldora sin `BlurView` (el `Text` directo en el mapa) | R5.2 (los `it` del `BlurView`) |
| S22 | `intensity={48}` → `24` | R5.2 |
| S23 | `tint` fijo `'light'` | R5.2 (`it.each` de tema, caso `dark`) |
| S24 | el texto con `bg-glass-surface` en vez de `-strong` | R5.2 (clase exacta y no contiene el token suelto) |
| S25 | `--glass-surface-strong` claro → `0.60` | R5.5 (G) |
| S26 | un segundo fichero de producción importa `expo-blur` | R5.6 (C) |
| S27 | la CTA vuelve a `rounded-xl` | R6.1 (F) y R7.5 (CC) |
| S28 | el ack vuelve a `rounded-xl` | R7.1 (F), R7.5 (CC) y K7/K8 (CC) |
| S29 | el ack con `rounded-16` pero sin `border-b-4` | R7.5 (CC) y los conteos de K9 |
| S30 | `rounded-22` en la CTA | K19 / R7.4 (DD) |

Si una sonda no se pone en rojo, el candado es ciego: se arregla el candado, no la sonda.
