# Enmienda A1 de #195 (mobile-home-photo-hero-canvas): informe del spec_author

Fecha: 2026-10-21. Worktree `Pet-Tracker-wt-195`, branch `feature/195-mobile-home-photo-hero-canvas`, base `7a0d4f21`.

Estado: la spec editada queda **sin commit** (lo hace el leader) y **sin aprobar**. La casilla `Enmienda A1 de #195 (supuesto 1) aprobada por humano` de `requirements.md` §Aprobación está **sin marcar**. Solo se tocó `specs/mobile-home-photo-hero-canvas/` y este informe; no se tocó `mobile-pet-tracker/`, `backend-pet-tracker/`, `docs/`, `feature_list.json` ni `progress/current.md`. Los cuatro ficheros de la spec conservan `status: approved` en su frontmatter (el resto de la spec sigue aprobado y no se reabre).

`graphify query` no estuvo disponible en esta worktree («graph file not found»), así que las consultas de código fueron con `grep` y lectura directa; el hook de recordatorio de graphify seguía apareciendo en cada comando.

## 1. Qué cambié en cada fichero

### `design.md`

- Bloque de cabecera: párrafo «Enmienda A1 (2026-10-21)» con lo que cambia y lo que no.
- §Premisas, viñeta «Movimiento»: corregida la frase falsa sobre el precedente de `PopIn`. `pop-in.test.tsx` nunca afirma `toBeVisible` sobre hijos: usa `getAnimatedStyle` y `toBeOnTheScreen()`.
- §Premisas, viñeta «Mocks de Reanimated»: añadida la consecuencia medida (con `withTiming: jest.fn(v => v)` el valor final entra en la primera llamada, así que el arranque en 0 y los 80 y 400 ms no se ven en HERO ni en HOME; solo se afirman los argumentos).
- §Supuestos: el punto 1 queda como hueco marcado (los puntos 2 a 5 no se renumeran, porque §Riesgos y R21 los citan por número).
- Nueva sección `## Hechos medidos`, `### H1`: las tres sondas de Codex, el mecanismo con cuatro citas de código (`createAnimatedComponent/PropsFilter.tsx` `filterNonAnimatedProps`, bloque `if (IS_JEST)` de `createAnimatedComponent/AnimatedComponent.tsx`, `jestUtils/index.ts` `getCurrentStyle`, `to-be-visible.js` `isHiddenForStyles` de RNTL 14.0.1), cinco consecuencias y «Qué no cambia».
- §Movimiento: dos viñetas nuevas, «Cómo se prueba» (pruebas (i) y (ii)) y «Mutaciones que las separan».
- §Archivos afectados: añadido el test nuevo HEROMOT (`components/__tests__/pet-hero-header-motion.test.tsx`).
- §Riesgos: viñeta «Visibilidad por construcción, no por tiempo» sobre `pet-hero-media` y el primer montaje con `pet = null`.

### `requirements.md`

- Abreviaturas: **HEROMOT** definida.
- **R14**: se quitó la frase que decía que los hijos siguen siendo `toBeVisible`. Nueva viñeta «Regla de visibilidad en los tests (Enmienda A1)»: (a) `toBeOnTheScreen()` sobre los nodos que arrancan en 0 y sus descendientes; (b) dos pruebas que se complementan, (i) movimiento con Reanimated real y fake timers en HEROMOT (`getAnimatedStyle` con `opacity: 0` y `translateY: 14` antes, `opacity: 1` y `translateY: 0` tras el tiempo exacto más 16 ms) y (ii) reduce motion encendido con `toBeVisible()` síncrono en HERO; (c) fuera de esos nodos `toBeVisible` no se relaja nunca. Nueva viñeta «Tiempos de la prueba (i)» con 64, 416, 496 y 516 ms y el plan B si el reloj simulado no da valores intermedios. La línea `Test` enumera HERO, HEROMOT, `#152 R5` y los `it` enmendados.
- **R16**: nueva viñeta «Regla de visibilidad en los tests» aplicada a la burbuja (BP es un fichero nuevo, con Reanimated real; arranca en `opacity: 0` y `scale: 0.6` hasta los 450 ms; con reduce motion encendido `toBeVisible()` síncrono sobre la burbuja y su texto). Línea `Test` actualizada.
- §Candados: la fila `#190 R7` se reescribe (`bubble.props.style` pasa a ser un array): `[bubble.props.style].flat(Infinity)` con `toContainEqual`, **sin la cadena `StyleSheet`** en HOME (ver sección 3).
- Nueva subsección `### Candados de visibilidad y de forma de style (Enmienda A1)`: tabla de 11 `it` (5 HERO y 6 HOME) con ancla por contenido, lo que afirman hoy, lo que pasan a afirmar y el R; los que no cambian; los comandos de medición; los candados agregados revisados; la prohibición de `StyleSheet` en HOME; la regla hacia delante para los `it` nuevos.
- Nota «Enmienda A1 (2026-10-21)» en §Aprobación: qué cambia, qué no cambia y que el resto sigue aprobado.
- Casilla nueva, sin marcar: `- [ ] Enmienda A1 de #195 (supuesto 1) aprobada por humano (…)`, en el mismo formato que las demás. Se prescribe detectarla con la expresión tolerante `/- \[[ xX]\] Enmienda A1 de #195/`. No coincide con la expresión de R20 (`Enmienda #195 aprobada por humano`), así que no interfiere con GUARD `#195 R20`.

### `tasks.md`

- Abreviaturas con HEROMOT y nota de la Enmienda A1 en la cabecera.
- Notas del handoff: movimiento con Reanimated real también en HEROMOT; la viñeta «si un `toBeVisible` falla por opacidad inicial 0, el arreglo es del componente» se **sustituye** por la regla acotada (esa regla era falsa para estos nodos); nueva viñeta con la prohibición de `StyleSheet` en HOME.
- «Cuentas a re-medir»: 4 filas nuevas (existencia de HEROMOT y BP, `(enmendado por #195 R14)` en HERO = 5 y en HOME = 6, `StyleSheet` en HOME = 0).
- **R14** y **R16** reescritos como rojo / verde / mutación, con tablas de mutaciones. R14: mutaciones (a) slot arranca en 1, (b) con reduce motion arranca en 0, (c) retraso del pie 140, (d) foto arranca en 1, (e) devolver `toBeVisible` a `slot-child` con el verde hecho (sonda de la causa). R16: (a) burbuja arranca en 1, (b) con reduce motion arranca en 0, (c) `shadow-sm`, (d) la burbuja ignora `style`, (e) `StyleSheet` en un comentario de HOME.
- Intactos: todos los demás R, sus cifras y el orden global (R13 → R4 → R1 → R2 → R3 → R5 → R7 → R8 → R6 → R14 → R9 → R11 (GlassCircle) → R10 → R11 (resto) → R12 → R15 → R16 → R17 → R18 → R19 → R20 → R21).

### `traceability.md`

Filas R14 y R16 con los ficheros de test nuevos y los `it` enmendados, **siguen en «pendiente»**; el párrafo final remite a la Enmienda A1. No se inventó ni se tocó ningún hash (R1 a R8 y R13 intactos).

## 2. Lista medida de `it` afectados

Medido desde `mobile-pet-tracker/`, base `7a0d4f21`, árbol sin cambios en `mobile-pet-tracker/`.

Comandos y resultado:

- `grep -n "toBeVisible" src/components/__tests__/pet-hero-header.test.tsx` devuelve 9 líneas (181, 187, 273, 343, 375, 400, 401, 402, 676).
- `grep -c "toBeVisible" src/screens/home/index.test.tsx` devuelve 80.
- `grep -c "toBeOnTheScreen"` en ambos ficheros devuelve 0 y 0.
- `grep -c "enmendado por #195 R14\|enmendado por #195 R16"` en ambos devuelve 0 y 0.
- `grep -c StyleSheet src/screens/home/index.test.tsx` devuelve 0.
- `grep -rlE "pet-hero-slot|pet-hero-caption|home-pingo-bubble|home-pingo-text" --include=*.test.ts --include=*.test.tsx src` devuelve solo `components/__tests__/pet-hero-header.test.tsx` y `screens/home/index.test.tsx`.
- `grep -rlE "PetHeroHeader|pet-hero-header|BubblePop|bubble-pop|screens/home" --include=*.test.ts --include=*.test.tsx src | wc -l` devuelve 13 ficheros.
- `test ! -e` de HEROMOT y BP: ambos ausentes.

Afectados (11 `it` más la forma de `style` de `#190 R7`):

| Fichero | `it` (ancla por contenido) | Líneas de base |
|---|---|---|
| HERO | `R3 › el slot flota sin fondo ni padding (enmendado por #195 R5)` | 273 |
| HERO | `R3 › no renderiza texto sobre la capa de medios` | 343 |
| HERO | `R8 › sigue montando el slot mientras el detalle carga` (el skeleton conserva `toBeVisible`) | 400, 401 |
| HERO | `#195 R5: fila superior flotante › usa inset superior más 12…` (`toEqual({ top: 52 })` más `floating-child`) | 675, 676 |
| HERO | `R4 › baja el slot con insets.top + 12… (enmendado por #195 R5)` (solo `style`) | `toMatchObject({ top: 52 })` |
| HOME | `#78 R10 › compone el selector y la campana…` | 202 |
| HOME | `R6 › selects a pressed pet and reloads…` | 565 |
| HOME | `R10 › does not replace a new selection…` | 1545 |
| HOME | `R5: Home usa el hero compartido › monta el hero con el selector dentro…` (la línea de `pet-hero-media` se conserva) | 1685, 1686 |
| HOME | `R5 › conserva intactos los testID…` (se parte el bucle: `pet-avatar-fallback-pet-1` pasa, el resto se conserva) | 1740 |
| HOME | `R8: el error del detalle… › mantiene el hero y los chips montados…` | 1770, 1771 |
| HOME | `#190 R7` (solo la forma de `bubble.props.style`) | ya en la tabla de §Candados |

Se conservan con `toBeVisible`: HERO `pet-hero` ×2 (181, 187), `pet-hero-fade-bottom` (375), `pet-hero-skeleton` (402); HOME `pet-hero-media` (1684), `pet-hero-error`, `pet-hero`, `pet-hero-retry`, `pet-hero-skeleton`. `pet-switcher.test.tsx` no tiene ningún `toBeVisible` sobre nodos animados del hero. HOME no tiene ningún `toBeVisible` sobre la burbuja de Pingo. De las 80 líneas de HOME, 7 pasan a `toBeOnTheScreen()` (202, 565, 1545, 1685, 1686, 1770, 1771) y quedan 73; el bucle de 1740 conserva su línea.

## 3. Candados agregados revisados

Ninguno cuenta ni vigila `toBeVisible` ni `toBeOnTheScreen`; ninguno cambia por la enmienda.

- `home-pingo-phrase`: solo lee el copy.
- `consistency-classnames`, `legibility-classnames`, `tab-headers-canvas`, `alerts-canvas-fidelity`, `chunky-cta-canvas-fidelity`, `profile-canvas-fidelity` y `components/__tests__/empty-state`: cuentan o escanean código de producción y saltan `__tests__`.
- `hero-header-amendments`: lee marcadores de docs y de la spec.
- `ui-language`: cuenta `t('clave'`.
- `design-drift`: **es el único que lee un test**. Escanea `screens/home/index.test.tsx` con `/text-\[10px\]|HEX_LITERAL|StyleSheet/i` en los `describe` de `#68 R18`, `#69 R13`, `#71 R13`, `#70 R17` y `#85 R12`. Por eso la spec **prohíbe la cadena `StyleSheet`** en HOME (en código, títulos y comentarios) y prescribe `[style].flat(Infinity)` con `toContainEqual`. Sus listas de ficheros no nombran HERO, BP ni HEROMOT. Los comentarios y títulos nuevos usan la forma `#195 R<n>`.
- Ningún guarda enumera los ficheros de test de `components/__tests__/` o `screens/home/` de forma que un fichero nuevo lo ponga rojo.

## 4. Casos en que la enmienda propuesta no bastaba (con el caso concreto)

1. **El propio nodo, no solo los descendientes.** `toBeVisible` falla también sobre `pet-hero-slot` y `pet-hero-caption` (`isHiddenForStyles` mira el `style` del propio host). Ejemplo: HERO `R8 › sigue montando el slot…` afirma `pet-hero-slot` con `toBeVisible`. Cubierto en R14 (a).
2. **Una tercera capa: `pet-hero-photo`.** Su valor inicial es `reduceMotion || !pet ? 1 : 0` (`pet-hero-header.tsx`), así que con una mascota en el primer render y reduce motion apagado arranca en 0 y `pet-hero-media` hereda el problema. La lista de nodos de la enmienda (slot, pie, burbuja) no la incluía. **La añadí** a la regla de R14 y a HEROMOT (c), y reescribí la cláusula (c) («`pet-hero-media` nunca se relaja») que contradecía el código. Es una **ampliación mía sobre la lista del leader**: se puede quitar borrando esas tres menciones, pero entonces la regla de R14 se contradice con el árbol. Hoy ningún `it` existente afirma visibilidad de la foto con mascota en el primer render; es una regla hacia delante.
3. **`props.style` deja de ser un objeto.** No es un problema de visibilidad, y el listado del leader (solo `toBeVisible`) no lo cubría: los dos `it` de HERO que leen `top: 52` y `#190 R7` de HOME (`toEqual({ borderCurve: 'continuous' })`) se ponen rojos al animar. Añadidos a la tabla.
4. **`#190 R7` y `design-drift`.** La fila aprobada decía «estilo aplanado», lo que empujaba a Codex a `StyleSheet.flatten` en HOME y ponía rojo `design-drift`. Reescrito con `flat(Infinity)` y `toContainEqual`.
5. **La prueba (i) no puede vivir en HERO.** El mock `withTiming: jest.fn(v => v)` entrega el valor final en la primera llamada; el arranque en 0 y los 80 y 400 ms no son observables. Hace falta un fichero con Reanimated real: HEROMOT (nuevo). Un fichero de test no puede tener el doble y el real a la vez.
6. **Regla hacia delante.** El listado del leader cubre solo los `it` existentes. Los `it` que R5, R7, R9 a R12, R15 y R18 añaden **después** de R14 (HOME `#195 R11/R12/R15/R18`, HERO `#195 R18`) caerían en lo mismo. La regla de R14 y R16 se declara aplicable a los `it` nuevos.
7. **Premisa falsa en el propio design.** La frase sobre el «precedente de `PopIn`» (que sus hijos fueran `toBeVisible`) era falsa; corregida.
8. **El candado de visibilidad de R16 en HOME es estructural.** No hay `it` de visibilidad de la burbuja en HOME; el rojo real de R16 en HOME es solo `#190 R7`. La visibilidad la lleva BP.

## 5. Dudas abiertas

- **Margen de 16 ms frente al «tiempo exacto».** La spec dice tiempo exacto más 16 ms de fotograma (regla de memoria «ampliar ventana, no aserción»). Si el primer verde muestra que Reanimated arranca la animación en el fotograma siguiente al montaje, la spec autoriza subir a 32 ms (anotándolo) y prohíbe cambiar un valor final.
- **No ejecuté nada** (un spec_author no escribe código). Quedan por confirmar con el primer rojo: (1) que el `style` del host en el primer render sea `[{ top: 52 }, { opacity: 0, transform: [{ translateY: 14 }] }]` (la tabla H4 lo prescribe; si difiere se anota en `progress/`); (2) que `HeroUINativeProvider` más Reanimated real funcione en HEROMOT con los mocks copiados de HERO (`Skeleton`, `ping-ring`, insets); (3) que el reloj simulado de Reanimated entregue valores intermedios (las comprobaciones a 64 ms). La spec prescribe el plan B para (3).
- **`pet-hero-media` en HOME depende del primer montaje con `pet = null`.** Es una fragilidad previa de R2: HOME conserva ahí `toBeVisible`. Si el primer verde la rompe (p. ej. con la caché de react-query precargada), esa línea pasa a `toBeOnTheScreen()` por la misma regla; anotado en §Riesgos de design.
- **Orden y gate.** R14 va antes de R9 a R12, R15 y R16, y la casilla A1 está sin firmar. Hasta la firma, en la práctica no se puede implementar nada a partir de R14. Si se quiere avanzar con R9 a R12 antes, haría falta cambiar el orden global (que dejé intacto por tu instrucción) y que esos `it` nuevos sigan la regla igualmente.
- **Cuentas de sufijo.** Las filas «5» y «6» de `(enmendado por #195 R14)` suponen que el sufijo va solo en los títulos; un comentario con la misma cadena las inflaría (lo dice la fila).
- **Sufijos acumulados.** `#78 R10 › compone…` (R14 y R12) y los dos `it` de HERO que ya llevan `(enmendado por #195 R5)` acumulan sufijos en paréntesis separados; un título con otro formato rompería la cuenta.

## 6. Reapertura del gate

Reabre solo lo que cambió: `design.md` (Premisas, Supuestos, Hechos medidos, Archivos afectados, Riesgos), `requirements.md` (R14, R16, §Candados de visibilidad, fila `#190 R7`, §Aprobación), `tasks.md` (R14, R16, notas del handoff, cuentas) y `traceability.md` (filas R14, R16 y párrafo final). El humano firma la casilla A1; el resto sigue aprobado. Ninguna constante de R13, valor numérico, `testID`, clase ni argumento de R14 o R16 cambió.
