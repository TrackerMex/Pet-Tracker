---
feature: "mobile-canvas-account-flow"
status: approved
tags: [mobile, tasks]
---

# Tareas — [[mobile-canvas-account-flow]]

## Orden recomendado

R1, R2, R3, R4, R5, R6, R7, R8, R9, R10+R11, R12, R13, R14, R15, R16, R17,
R18, R19, R20.

Por qué este orden:

- R1 va primero porque los demás usan sus tokens (`text-34`, `rounded-32`,
  `rounded-40`). `--text-34` ya lo declaró #199 en la base `ee40d93d` (E5): R1
  añade solo los dos radios.
- El describe `#197 R20` de `src/__tests__/canvas-foundations.test.ts` ya no
  existe: lo borró #200 (E4). R2 no toca ese fichero.
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
base es la de `ee40d93d` (E5: merge de `origin/dev` 8bd88522 con #198 y #199).

| Patrón | Fichero | Base | Delta | Esperado | R |
|---|---|---|---|---|---|
| `--text-34:` | `src/theme/global.css` | 1 | 0 | 1 | R1 (ya lo declaró #199 R27) |
| `--radius-32:` | `src/theme/global.css` | 0 | +1 | 1 | R1 |
| `--radius-40:` | `src/theme/global.css` | 0 | +1 | 1 | R1 |
| `#197 R20` | `src/__tests__/canvas-foundations.test.ts` | 0 | 0 | 0 | ninguno (E4: lo borró #200) |
| `<RiseIn` | `src/screens/welcome/index.tsx` | 0 | +4 | 4 | R2 |
| `<PingoFloat` | `src/screens/welcome/index.tsx` | 0 | +1 | 1 | R3 |
| `<Card` | `src/screens/welcome/index.tsx` | 2 | −2 | 0 | R3, R4 |
| `entranceStyle` | `src/screens/welcome/index.tsx` | 2 | −2 | 0 | R2 (−1: el uso en `welcome-content`), R7 (−1: la declaración) |
| `withRepeat` | `src/screens/welcome/index.tsx` | 3 | −1 | 2 | R3 |
| `pingoFloatY` | `src/screens/welcome/index.tsx` | 4 | −4 | 0 | R3 |
| `translateY` | `src/screens/welcome/index.tsx` | 5 | −5 | 0 | R3 (−1: `pingoStyle`), R7 (−4) |
| suma de `cardElements` (script de abajo) | `src/**/*.tsx` | 33 | −4 | 29 | R3, R4, R8, R13 |
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
| `keyboardVerticalOffset={headerHeight}` | `src/screens/add-pet/index.tsx` | 1 | −1 | 0 | R19 |
| `keyboardVerticalOffset={0}` | `src/screens/add-pet/index.tsx` | 0 | +1 | 1 | R19 |
| `## Enmienda #205` | `../docs/ui-guidelines.md` | 0 | +1 | 1 | R20 |

Los agregados de `consistency-classnames.test.ts` tienen sus cifras en
requirements.md §Candados agregados revisados y su base en E5: `classNames` 54
→ 57, `style={CONTINUOUS_CORNER}` 52 → 55 (neto +3) y `bg-accent-soft` 4 → 2.

Réplica del piso de `cardElements` (mismo recorrido que el escáner de
`heroui-text-size-merge.test.ts`: `.tsx` de `src/` sin `__tests__`, `__mocks__`
ni `.test.tsx`; cuenta cada elemento JSX cuya etiqueta viene de
`components/card` o `./card`). Guárdalo fuera del repo, por ejemplo en
`$TMPDIR/card-count.js`, y córrelo desde `mobile-pet-tracker/` con
`NODE_PATH="$PWD/node_modules" node "$TMPDIR/card-count.js"`. Base medida en
`ee40d93d`: 33, la expresión de hoy `35 - 1 - 1 - 1 + 1`. Esperado al cerrar:
29 (R3, R4, R8, R13), con la expresión `35 - 1 - 1 - 1 + 1 - 1 - 1 - 1 - 1`
(margen 0). El suelo `classNameElements` (`163`) no se toca: cierra en 170,
margen 7 (E5, P1 retirada). Si otra rama mergea antes del cierre, se vuelve a
medir y se recompone la expresión con lo medido.

```js
const ts = require('typescript'), fs = require('fs'), path = require('path');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(d, e.name);
  if (e.isDirectory()) return ['__tests__', '__mocks__'].includes(e.name) ? [] : walk(p);
  return /\.tsx$/.test(e.name) && !/\.test\.tsx$/.test(e.name) ? [p] : [];
});
let card = 0;
for (const f of walk('src')) {
  const s = ts.createSourceFile(f, fs.readFileSync(f, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const names = new Set();
  for (const st of s.statements) {
    if (!ts.isImportDeclaration(st) || !ts.isStringLiteral(st.moduleSpecifier)) continue;
    const m = st.moduleSpecifier.text, b = st.importClause && st.importClause.namedBindings;
    if (!b || !(m.endsWith('components/card') || m === './card')) continue;
    if (ts.isNamedImports(b)) b.elements.forEach((x) => names.add(x.name.text)); else if (ts.isNamespaceImport(b)) names.add(b.name.text);
  }
  (function v(n) { if ((ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) && names.has(n.tagName.getText(s).split('.')[0])) card++; ts.forEachChild(n, v); })(s);
}
console.log(card);
```

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
- [ ] (2) Añade `--radius-32` y `--radius-40` a `src/theme/global.css`, tras `--radius-22: 22px;`. `--text-34` ya existe tras `--text-28: 28px;` (#199, E5): no lo dupliques. El test de R1 asierta las tres líneas, una vez cada una.
- [ ] (3) Refactor.

### R2 — Main: bloques y entradas
- [ ] (1) Rojo en el test de welcome y en F. No toques `canvas-foundations.test.ts`: el describe `#197 R20` ya no existe (E4). Borra los tres `it` de `#153 R8` que miden el estilo animado de `welcome-content` y enmienda `R5 › pinta marca, tagline y legal con sus clases` (` (enmendado por #205 R2, R6)`), según el inventario.
- [ ] (2) Cuatro `RiseIn` (0/120/200/280), márgenes 16 y espaciador en `welcome/index.tsx`. `welcome-content` pasa a `View` plano: sale su uso de `entranceStyle` (la declaración se queda hasta R7).
- [ ] (3) Refactor.

### R3 — Main: escena
- [ ] (1) Rojo en welcome y F. El orden se asierta por índices relativos. Incluye las enmiendas de inventario de R3: muelle de #153 R9 a 220, pose 220×220, listas de hijos de `welcome-stage` de #167 R12 y R13, borrado de dos `it` de #153 R10 y enmienda del tercero, y el piso `cardElements` de `heroui-text-size-merge.test.ts` (`35 - 1 - 1 - 1 + 1 - 1`, con el sufijo ` (enmendado por #205 R3, R4, R8, R13)` al final del título, tras `(enmendado por #199 R19)`, y el comentario `; #205 R3: -1` tras `; #199 R19: +1`). En el mismo commit, el sufijo de R3 en los tres `it` de `consistency-classnames.test.ts` (colas en requirements.md E5).
- [ ] (2) La escena pasa a `View` de 380 con radio 32 y `CONTINUOUS_CORNER`. Pingo mide 220 dentro de `PingoFloat` y lleva el suelo `bg-border`. Borra la flotación de 4 puntos: `pingoFloatY`, su `withRepeat` y el `translateY` de `pingoStyle`, y quita los imports `MOTION_FLOAT_*`.
- [ ] (3) Refactor.

### R4 — Main: bocadillo
- [ ] (1) Rojo en welcome y F, con la enmienda de `#153 R5 › pinta el bocadillo…` y el `- 1` en el piso de `cardElements` (`35 - 1 - 1 - 1 + 1 - 1 - 1`, comentario `; #205 R3, R4: -1, -1`).
- [ ] (2) Bocadillo `View` absoluto con `PopIn` y `shadows.card`.
- [ ] (3) Refactor.

### R5 — Main: saludo
- [ ] (1) Rojo según requirements.md §R5. Enmienda en el mismo commit los tres `it` de `#153 R1` (declara el saludo y lo pinta en español y en inglés).
- [ ] (2) Cambia `welcome.pingoGreeting` en `src/i18n/catalog.ts` (es y en).
- [ ] (3) Refactor.

### R6 — Main: marca, CTAs y legal
- [ ] (1) Rojo en welcome y F. `R5 › pinta marca, tagline y legal con sus clases` ya lleva su sufijo desde R2: aquí se enmiendan sus clases de marca, tagline y legal.
- [ ] (2) Marca a 34/900, subtítulo con ancho 300 y legal con margen 16.
- [ ] (3) Refactor.

### R7 — Main: entradas retiradas
- [ ] (1) Rojo en welcome, con el borrado de `#153 R8 › usa el fundido y el muelle de motion.ts`.
- [ ] (2) Retira la declaración de `entranceStyle`, los valores compartidos `opacity` y `translateY` de entrada y sus `.set`. La flotación de 4 puntos salió en R3. El muelle de escala de #153 R9 se queda.
- [ ] (3) Refactor.

### R8 — Login
- [ ] (1) Rojo en login y F, con las enmiendas del inventario (incluidas las dos filas nuevas de F10 y F11) y el `- 1` en el piso de `cardElements` (`35 - 1 - 1 - 1 + 1 - 1 - 1 - 1`, comentario `; #205 R3, R4, R8: -1, -1, -1`).
- [ ] (2) `RiseIn` 0/100/200, burbuja `View`, `login-title`, `login-actions` y márgenes 20.
- [ ] (3) Refactor.

### R9 — Registro
- [ ] (1) Rojo en register y F, con las enmiendas del inventario (el espaciador de `#172 R19` se rompe por la fila de error dentro de `register-body`).
- [ ] (2) La cabecera queda fija y el formulario sube con `RiseIn` 0, con márgenes 20 y colchón de 96.
- [ ] (3) Refactor.

### R10 + R11 — Recuperar y RecuperarEnviado
- [ ] (1) Un solo commit rojo con los `it` de R10 y R11 en forgot y F. Reescribe `lockTile()` una sola vez a `screen.getByTestId('forgot-lock-tile')` (`// #205 R10`), enmienda los cuatro `it` de `#167 R9` y `#177 R5.2` de `chunky-cta-canvas-fidelity.test.ts`.
- [ ] (2) Un solo commit verde: escena 168x150, Pingo quieto girado, tile absoluto, `forgot-actions` y Reenviar.
- [ ] (3) Refactor.

### R12 — NuevaContrasena (formulario)
- [ ] (1) Rojo en reset-password y F. En `#172 R19: la rama del formulario…` declara una constante propia; no mutes `metrics`, que usan la rama sin token y la de éxito.
- [ ] (2) `RiseIn` 0/100 y Pingo 72 sin `PingoFloat`.
- [ ] (3) Refactor.

### R13 — NuevaContrasena (éxito)
- [ ] (1) Rojo en reset-password y F. Enmienda `#177 R7.3` de `chunky-cta-canvas-fidelity.test.ts` (`reset-password` 1 → 2 y `26 + 1 + 1 + 1 + 2 + 2 + 1 + 1` → `26 + 1 + 1 + 1 + 2 + 2 + 1 + 1 + 1`, 36) y añade el último `- 1` al piso de `cardElements` (la expresión cierra en `35 - 1 - 1 - 1 + 1 - 1 - 1 - 1 - 1`, 29, y el comentario en `; #205 R3, R4, R8, R13: -1, -1, -1, -1`).
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
- [ ] (1) Rojo en add-pet y F, con las enmiendas del inventario y la fila `tracking-title` de `alerts-canvas-fidelity.test.ts` sin `add-pet` (` (enmendado por #205 R16)`).
- [ ] (2) Monta `ScreenHeader` (`backFallback="/"`) con el paso como accesorio, saca la barra del scroll y pon `RiseIn` en la intro.
- [ ] (3) Refactor.

### R17 — Sombra del selector segmentado
- [ ] (1) Rojo en F, con la enmienda de `add-pet-two-steps`, la de `segmented-control.test.tsx` (clase sin `shadow-sm`, `CONTINUOUS_CORNER` en las dos ramas y `shadows.segment` en la seleccionada) y la fila `species-dog` de `#62 R11`.
- [ ] (2) `segmented-control.tsx` usa `shadows.segment` y quita `shadow-sm`.
- [ ] (3) Refactor.

### R18 — NuevaMascota2 (paso 2)
- [ ] (1) Rojo en add-pet y F, sin volver a asertar la cabecera. Enmienda `#191 R6` con `metrics(16)` en el paso 2.
- [ ] (2) Cuatro `RiseIn` (0/60/120/180) y chips de 44 con `bg-tab-pill`.
- [ ] (3) Refactor.

### R19 — Pie fijo de nueva mascota
- [ ] (1) Rojo en add-pet y F, con la enmienda de `#148 R4` (`paddingBottom 291` → `200`) y el segundo sufijo de `#191 R4`.
- [ ] (2) La CTA pasa a un pie fuera del scroll, y la celebración no lo pinta. El KAV usa `keyboardVerticalOffset={0}` y se retiran `headerHeight` y `HeaderHeightContext`; el scroll conserva su `contentContainerStyle`.
- [ ] (3) Refactor.

### R20 — Enmienda de carta
- [ ] (1) Rojo en F.
- [ ] (2) Añade `## Enmienda #205` a `docs/ui-guidelines.md`.
- [ ] (3) Refactor.
