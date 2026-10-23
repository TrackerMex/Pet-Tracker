---
feature: "mobile-canvas-account-flow"
status: spec_ready     # draft | spec_ready | approved
tags: [mobile, tasks]
---

# Tareas — [[mobile-canvas-account-flow]]

## Orden recomendado

R1, R2, R3, R4, R5, R6, R7, R8, R9, R10+R11, R12, R13, R14, R15, R16, R17,
R18, R19, R20.

Por qué este orden:

- R1 va primero porque los demás usan sus tokens (`text-34`, `rounded-32`,
  `rounded-40`).
- El commit rojo de R2 borra el describe `#197 R20` de
  `src/__tests__/canvas-foundations.test.ts`. Ese describe exige que nadie monte
  los cimientos, y R2 es el primer R que monta uno.
- El test de R3 asierta el **orden relativo** de los hijos de la escena, no la
  lista exacta, porque R4 añade el bocadillo después.
- R10 y R11 comparten un commit rojo y uno verde. Su JSX es el mismo, así que
  un R11 aislado nacería verde.
- R14 es un candado de conservación: nace verde (ver su bloque).
- R15 va antes que R16: primero se quita la cabecera nativa y después se monta
  `ScreenHeader`.
- R18 no vuelve a asertar la cabecera, que ya cubre R16.

## Notas para el handoff

- Cada R hace primero un commit con su test rojo y después otro con la
  implementación verde. Nunca juntes test e implementación en un commit (C4).
  Los títulos de los `it` son los literales de requirements.md, con el prefijo
  `#205 R<n>:`.
- Los comandos se lanzan con `cd mobile-pet-tracker` explícito. Solo `bun` /
  `bunx`, nunca `npm` ni `npx`. No hay dependencias nuevas
  (`expo-linear-gradient` está vetado).
- Para correr un fichero de jest: `bunx jest --runTestsByPath <ruta>`.
- Si un comentario de producción cita la feature, va como `#205 R<n>`: es la
  única forma que exime `HEX_LITERAL`.
- No uses `StyleSheet`, clases arbitrarias `[…]`, `shadowColor` ni
  `elevation`. Las sombras salen de `useShadows()`.
- RNTL 14: `await` en `fireEvent` y en `act`.
- Las enmiendas de candados ajenos van en el commit rojo del R que los
  revierte. Cada fila de requirements.md §Candados que esta feature revierte
  lleva el sufijo `(enmendado por #205 R<n>)`. Los agregados de
  §Candados agregados revisados cambian solo en su término, sin reescribirse.
- Los nombres de skills de Codex los fija el leader en el handoff, con el
  catálogo de `.claude/agents/leader.md`.

## Cuentas a re-medir al terminar (base + delta)

Mídelas desde `mobile-pet-tracker/` con `grep -cF -- '<patrón>' <fichero>`. La
base es la de `origin/dev` 81cb6d6b.

| Patrón | Fichero | Base | Delta | Esperado | R |
|---|---|---|---|---|---|
| `--text-34:` | `src/theme/global.css` | 0 | +1 | 1 | R1 |
| `--radius-32:` | `src/theme/global.css` | 0 | +1 | 1 | R1 |
| `--radius-40:` | `src/theme/global.css` | 0 | +1 | 1 | R1 |
| `#197 R20` | `src/__tests__/canvas-foundations.test.ts` | 3 | −3 | 0 | R2 |
| `<RiseIn` | `src/screens/welcome/index.tsx` | 0 | +4 | 4 | R2 |
| `<PingoFloat` | `src/screens/welcome/index.tsx` | 0 | +1 | 1 | R3 |
| `<Card` | `src/screens/welcome/index.tsx` | 2 | −2 | 0 | R3, R4 |
| `entranceStyle` | `src/screens/welcome/index.tsx` | 2 | −2 | 0 | R7 |
| `HomeEntrance` | `src/screens/login/index.tsx` | 5 | −5 | 0 | R8 |
| `<RiseIn` | `src/screens/login/index.tsx` | 0 | +3 | 3 | R8 |
| `<PingoFloat` | `src/screens/register/index.tsx` | 1 | 0 | 1 | R9 |
| `PingoFloat` | `src/screens/forgot/index.tsx` | 3 | −3 | 0 | R10 |
| `PingoFloat` | `src/screens/reset-password/index.tsx` | 5 | −5 | 0 | R12, R13 |
| `rounded-16` | `src/screens/reset-password/index.tsx` | 1 | +1 | 2 | R13 |
| `['pets/add', '']` | `src/app/__tests__/layout.test.tsx` | 1 | −1 | 0 | R15 |
| `shadow-sm` | `src/components/segmented-control.tsx` | 1 | −1 | 0 | R17 |
| `style={CONTINUOUS_CORNER}` | `src/components/segmented-control.tsx` | 2 | −1 | 1 | R17 |
| `bg-accent-soft` | `src/screens/add-pet/index.tsx` | 2 | −2 | 0 | R18 |
| `## Enmienda #205` | `../docs/ui-guidelines.md` | 0 | +1 | 1 | R20 |

Los agregados de `consistency-classnames.test.ts` tienen sus cifras en
requirements.md §Candados agregados revisados. CONTINUOUS_CORNER cierra con un
neto de +3.

## Bloques por requisito

Cada bloque sigue la misma pauta:

- **(1) Test rojo.** Añade los `it` del R en el fichero que fija requirements.md
  y las enmiendas de inventario de ese R. Commit `test(#205): R<n> rojo`.
- **(2) Implementación mínima.** Lo justo para ponerlo en verde. Commit
  `feat(#205): R<n> verde`.
- **(3) Refactor.** Solo si hace falta y sin tocar los tests. Commit
  `refactor(#205): R<n>`.

### R1 — Tokens del canvas
- [ ] (1) Rojo en `account-flow-canvas-fidelity.test.ts`: crea el fichero.
- [ ] (2) Añade `--text-34`, `--radius-32` y `--radius-40` a `src/theme/global.css`.
- [ ] (3) Refactor.

### R2 — Main: bloques y entradas
- [ ] (1) Rojo en el test de welcome y en F. En este mismo commit borra el describe `#197 R20` de `canvas-foundations.test.ts`.
- [ ] (2) Cuatro `RiseIn` (0/120/200/280), márgenes 16 y espaciador en `welcome/index.tsx`.
- [ ] (3) Refactor.

### R3 — Main: escena
- [ ] (1) Rojo en welcome y F. El orden se asierta por índices relativos.
- [ ] (2) La escena pasa a `View` de 380 con radio 32 y `CONTINUOUS_CORNER`. Pingo mide 220 dentro de `PingoFloat` y lleva el suelo `bg-border`.
- [ ] (3) Refactor.

### R4 — Main: bocadillo
- [ ] (1) Rojo en welcome y F.
- [ ] (2) Bocadillo `View` absoluto con `PopIn` y `shadows.card`.
- [ ] (3) Refactor.

### R5 — Main: saludo
- [ ] (1) Rojo según requirements.md §R5.
- [ ] (2) Cambia `welcome.pingoGreeting` en `src/i18n/catalog.ts` (es y en).
- [ ] (3) Refactor.

### R6 — Main: marca, CTAs y legal
- [ ] (1) Rojo en welcome y F.
- [ ] (2) Marca a 34/900, subtítulo con ancho 300 y legal con margen 16.
- [ ] (3) Refactor.

### R7 — Main: entradas retiradas
- [ ] (1) Rojo en welcome.
- [ ] (2) Retira `entranceStyle` y la flotación de 4 puntos. El muelle de escala de #153 R9 se queda.
- [ ] (3) Refactor.

### R8 — Login
- [ ] (1) Rojo en login y F.
- [ ] (2) `RiseIn` 0/100/200, burbuja `View`, `login-title`, `login-actions` y márgenes 20.
- [ ] (3) Refactor.

### R9 — Registro
- [ ] (1) Rojo en register y F.
- [ ] (2) La cabecera queda fija y el formulario sube con `RiseIn` 0, con márgenes 20 y colchón de 96.
- [ ] (3) Refactor.

### R10 + R11 — Recuperar y RecuperarEnviado
- [ ] (1) Un solo commit rojo con los `it` de R10 y R11 en forgot y F.
- [ ] (2) Un solo commit verde: escena 168x150, Pingo quieto girado, tile absoluto, `forgot-actions` y Reenviar.
- [ ] (3) Refactor.

### R12 — NuevaContrasena (formulario)
- [ ] (1) Rojo en reset-password y F.
- [ ] (2) `RiseIn` 0/100 y Pingo 72 sin `PingoFloat`.
- [ ] (3) Refactor.

### R13 — NuevaContrasena (éxito)
- [ ] (1) Rojo en reset-password y F.
- [ ] (2) La tarjeta de éxito pasa a `View` `rounded-16` con `CONTINUOUS_CORNER`.
- [ ] (3) Refactor.

### R14 — NuevaContrasena (sin token)
- [ ] (1) El candado de conservación nace verde. Demuestra su rojo con una mutación plantada en la rama sin token (`padding: 24` → `padding: 20`): corre el test y revierte. Anota en el reporte el rojo y su reversión. Commit `test(#205): R14 candado de conservación`.
- [ ] (2) Sin implementación.
- [ ] (3) Sin refactor.

### R15 — Cabecera nativa de nueva mascota
- [ ] (1) Rojo en `src/app/__tests__/layout.test.tsx`.
- [ ] (2) `pets/add` pasa a `options={{ headerShown: false }}` en `src/app/_layout.tsx`.
- [ ] (3) Refactor.

### R16 — NuevaMascota (paso 1)
- [ ] (1) Rojo en add-pet y F.
- [ ] (2) Monta `ScreenHeader` (`backFallback="/"`) con el paso como accesorio, saca la barra del scroll y pon `RiseIn` en la intro.
- [ ] (3) Refactor.

### R17 — Sombra del selector segmentado
- [ ] (1) Rojo en F, con la enmienda de `add-pet-two-steps`.
- [ ] (2) `segmented-control.tsx` usa `shadows.segment` y quita `shadow-sm`.
- [ ] (3) Refactor.

### R18 — NuevaMascota2 (paso 2)
- [ ] (1) Rojo en add-pet y F, sin volver a asertar la cabecera.
- [ ] (2) Cuatro `RiseIn` (0/60/120/180) y chips de 44 con `bg-tab-pill`.
- [ ] (3) Refactor.

### R19 — Pie fijo de nueva mascota
- [ ] (1) Rojo en add-pet y F, con la enmienda de `#148 R4`.
- [ ] (2) La CTA pasa a un pie fuera del scroll, y la celebración no lo pinta.
- [ ] (3) Refactor.

### R20 — Enmienda de carta
- [ ] (1) Rojo en F.
- [ ] (2) Añade `## Enmienda #205` a `docs/ui-guidelines.md`.
- [ ] (3) Refactor.
