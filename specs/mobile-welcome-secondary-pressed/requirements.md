---
feature: "mobile-welcome-secondary-pressed"
status: approved        # draft | approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-welcome-secondary-pressed]] (#231)

> Notación EARS. Capa: móvil (`mobile-pet-tracker/`) más una enmienda de docs
> con casilla humana propia (R7, gate G4). Sin backend, sin copy nuevo, sin
> dependencias nuevas, sin módulo nativo (no hace falta rebuild del dev build).
> Diseño en [[design]]; plan TDD en [[tasks]]; trazabilidad en [[traceability]].

## Contexto

Palabras literales del humano en el smoke G2 del 2026-11-03: «En el welcome el
boton de "Ya tengo una cuenta", quita el hover aplica para dark mode mejoralo».

Diagnóstico, medido en el árbol `f05016d3` (`origin/dev`):

1. **Resaltado verde.** `screens/welcome/index.tsx` pinta «Ya tengo una cuenta»
   (`testID="welcome-have-account"`) como `<Button>` **sin `variant`**. HeroUI
   Native 1.0.8 (`package.json`: `"heroui-native": "1.0.8"`) toma
   `variant = 'primary'` por defecto y, en
   `node_modules/heroui-native/src/components/button/button.tsx`, el `useMemo`
   `highlightColorMap` devuelve para `'primary'` el token `accent-hover` (verde)
   y para `'outline'` un `default-hover` con alfa 0,3 (gris neutro). Ese color
   es el de la capa `PressableFeedback.Highlight` que se anima al pulsar. Por
   eso el botón gris-blanco se tiñe de verde al pulsarlo. (Android no tiene
   «hover»: lo que el humano ve es esta capa de pulsado.)
2. **Borde y labio en oscuro.** La receta del secundario neutro
   (`h-14 rounded-16 border-2 border-lip-gray bg-surface` +
   `style={chunkyLip.neutral}`) resuelve `--color-lip-gray` a `#0A0D12` en
   oscuro (`src/theme/global.css`, bloque `@variant dark`), sobre
   `--surface` `#161B22` y `--background` `#0D1117`: contraste 1,125:1 y 1,028:1.
   El borde casi no se ve. `#0A0D12` está pinado por
   `theme/__tests__/global-css.test.ts` (`#166 R1`) y lo usan unas 25 piezas
   más (interruptor apagado, segmentos de progreso, agarradores, los otros
   secundarios neutros): **el token no cambia**.

Cinco secundarios neutros del repo ya llevan `variant="outline"` con la misma
receta (`docs-upload-cancel`, `geofence-editor-delete`, `home-join-pet-button`,
`pet-invite-copy`, `member-remove-sheet-cancel`); Bienvenida es el único sin él
(`grep -cF 'variant=' src/screens/welcome/index.tsx` → **0**). Esta feature lo
alinea y le da un borde visible en oscuro solo a él.

## Decisiones cerradas (Codex no las reabre)

- **D1.** Resaltado neutro con `variant="outline"`, **no**
  `animation={{ highlight: false }}`: ambas existen en HeroUI 1.0.8
  (`ButtonVariant` incluye `'outline'`; `animation.highlight` acepta `false`),
  pero `highlight: false` quita todo el feedback de la capa y deja a este botón
  distinto de los otros cinco. `outline` mantiene un pulsado sutil y neutro.
  Ni `feedbackVariant` ni `animation` se tocan: la escala 0,985 de pulsado
  sigue activa (es parte del cuerpo «chunky» de la regla 13 de la carta).
- **D2.** Borde visible en oscuro con la clase `dark:border-muted` **añadida al
  final** de la receta, solo en este botón. `--muted` oscuro = `#9CA3AF`:
  contraste 6,81:1 con `--surface` y 7,45:1 con `--background` (umbral de esta
  spec: 3:1, WCAG 1.4.11). Es un token existente; no se crea ninguno.
  Descartados en [[design]]: cambiar `--color-lip-gray`, `dark:border-border`
  (rgba al 8 %, 1,2:1), `dark:border-accent-strong` (los candados prohíben la
  subcadena `border-accent`), `useUniwind` + estilo en línea.
- **D3.** El labio `chunkyLip.neutral` (sombra sólida de 4 px en `lip-gray`) **no
  cambia**: queda como en el canvas; el borde es lo que se hace visible.
- **D4.** Luz sin cambios: en tema claro la clase resultante es idéntica a la de
  hoy (`dark:` solo actúa en oscuro).

## Convenciones de esta spec

- Rutas relativas a `mobile-pet-tracker/` salvo que se diga otra cosa.
- Cada test nuevo empieza por `#231 R<n>`.
- Cadena de clases nueva, **literal y única** (la llamo `NEW_CLASSES`):
  `w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted`
- Los `fireEvent`, `act` y `render` van con `await` (RNTL 14).
- Corre jest con rutas por prefijo sin paréntesis
  (`src/screens/welcome`, `src/__tests__`, `src/theme`).
- En el test de Bienvenida `heroui-native` está mockeado: `Button` es un `View`
  que recibe las props declaradas por la pantalla, por eso
  `screen.getByTestId('welcome-have-account').props.variant` lee lo declarado.
  **No cambies ese mock.** En jest, `uniwind` no resuelve colores reales (los
  tests ven nombres como `'--color-lip-gray'`, p. ej.
  `screens/alerts/index.test.tsx` línea del `boxShadow` del ack), así que **no
  existe una prueba de render que vea «verde»**: la ausencia de verde se
  candará por el par R1 (lo que declara la pantalla) + R2 (lo que HeroUI hace
  con esa declaración).

## Evidencia (medida en `f05016d3`)

Cuentas con `grep -cF "<literal>" <ruta>` desde la raíz del worktree
(`mobile-pet-tracker/` para las rutas `src/…`):

- `grep -cF 'variant=' src/screens/welcome/index.tsx` → **0**.
- `grep -cF 'border-lip-gray' src/screens/welcome/index.tsx` → **1**.
- `git grep -l 'dark:border-' -- src` → solo ficheros `.test.ts` (ninguno de
  producción): la clase `dark:border-*` aparece **0** veces en producción.
- Pins de la receta de Bienvenida a enmendar (R6):
  `src/screens/welcome/index.test.tsx` (1 `toBe` exacto, dentro de `describe('R8')`),
  `src/__tests__/chunky-cta-canvas-fidelity.test.ts` (fila `welcome-have-account`
  de `NEUTRAL_ROWS`), `src/__tests__/consistency-classnames.test.ts` (fila
  `welcome-have-account` de `describe('#166 R3: el secundario neutro lleva el labio gris')`).
- Contadores que **no se mueven**: `count(/border-lip-gray/g)` (ambos guards),
  `neutralInventory`, `radii`, `count(/text-17/g)`, `count(/<Text className="text-17 font-bold text-accent-strong">/g)`.
  `dark:border-muted` no contiene `border-lip-gray`, y `variant="outline"` ya
  estaba en el inventario por `border-lip-gray`.

## Requisitos funcionales

- **R1**: WHEN la pantalla de Bienvenida se pinta sin sesión, THE SYSTEM SHALL
  declarar el botón `welcome-have-account` con `variant="outline"`, sin las
  props `animation` ni `feedbackVariant`, y el botón `welcome-get-started` SHALL
  seguir sin `variant` (su resaltado verde primario es el correcto).
  - Test: `src/screens/welcome/index.test.tsx` dentro de `describe('R8')`,
    `it('#231 R1: el secundario declara variant outline y conserva el feedback de escala')`:
    sobre `screen.getByTestId('welcome-have-account').props` aserta
    `variant === 'outline'`, `animation === undefined`,
    `feedbackVariant === undefined`; y
    `it('#231 R1: el primario no declara variant')` aserta
    `screen.getByTestId('welcome-get-started').props.variant === undefined`.
  - Mutaciones plantadas (cada una debe poner rojo el `it` indicado, y se
    revierten): (a) quitar `variant="outline"` del tag → rojo el primero;
    (b) cambiarlo a `variant="primary"` → rojo el primero; (c) añadir
    `animation={{ highlight: false }}` al secundario → rojo el primero;
    (d) añadir `variant="outline"` al primario → rojo el segundo.

- **R2**: WHERE la pantalla declara `variant="outline"`, THE SYSTEM SHALL
  apoyarse en que HeroUI Native pinta con un `default-hover` neutro y no con
  `accent-hover` la capa de pulsado de esa variante, y un test SHALL fallar si
  una actualización de la librería rompe esa correspondencia.
  - Test: `src/screens/welcome/index.test.tsx`,
    `it('#231 R2: HeroUI pinta el pulsado de outline con default-hover y el de primary con accent-hover')`
    (nuevo `describe('#231 R2')`). Lee con la `readFileSync` ya disponible en el
    fichero (`jest.requireActual('fs')`) la ruta
    `join(process.cwd(), 'node_modules', 'heroui-native', 'src', 'components', 'button', 'button.tsx')`,
    acota el `switch (variant)` que hay dentro del `useMemo` de
    `highlightColorMap` (de `switch (variant) {` a `}, [` ) y parte en bloques
    por `case '`. Aserta: el bloque `case 'primary':` contiene
    `themeColorAccentHover` (ancla de no-vacuidad: demuestra el mecanismo del
    bug); el bloque `case 'outline':` contiene `themeColorDefaultHover` y **no**
    contiene `themeColorAccentHover`. Antes de asertar, comprueba que se
    encontraron exactamente los bloques `primary` y `outline` (`not.toBeUndefined`),
    para que un cambio de estructura de la librería falle ruidoso y no en verde.
  - Este `it` no depende de la pantalla: su valor es detectar el cambio de
    comportamiento de HeroUI tras un `bun add`/actualización. No se mockea
    `button.tsx`.
  - Mutación plantada: en una copia de seguridad de ese fichero, cambiar en el
    `case 'outline':` `themeColorDefaultHover` por `themeColorAccentHover` →
    rojo; restaurar la copia (`node_modules` no es de git: `cp` de ida y vuelta,
    no `git checkout`).

- **R3**: WHEN el tema es oscuro, THE SYSTEM SHALL pintar el borde de 2 px de
  `welcome-have-account` con el token `muted` (`dark:border-muted`), y WHILE el
  tema es claro THE SYSTEM SHALL conservar la receta del secundario neutro
  intacta (borde `border-lip-gray`).
  - Cambio en `src/screens/welcome/index.tsx`: el `className` de ese `Button`
    pasa a `NEW_CLASSES` (ver Convenciones). `style={chunkyLip.neutral}`,
    `onPress={() => router.push('/login')}`, `testID` y la etiqueta
    `<Text className="text-17 font-bold text-accent-strong">` **no cambian**.
  - Test A: `src/screens/welcome/index.test.tsx`,
    `it('#231 R3: el secundario añade el borde oscuro tras la receta neutra')`:
    `props.className` `toBe(NEW_CLASSES)` y
    `props.className.split(' ')` termina en `['border-lip-gray', 'bg-surface', 'dark:border-muted']`
    (el orden importa: la clase oscura va la última).
  - Test B (ancla negativa, alcance): `src/__tests__/chunky-cta-canvas-fidelity.test.ts`,
    `it('#231 R3: la excepción dark:border-* vive solo en Bienvenida')`:
    `inventory(/dark:border-/g)` `toEqual({ 'screens/welcome/index.tsx': 1 })`
    (usa el helper `inventory` del fichero, que ya excluye `__tests__` y `.test.*`).
  - Mutaciones plantadas: (a) en el tag quitar `dark:border-muted` → rojo A;
    (b) ponerla antes de `border-lip-gray` → rojo A (orden); (c) copiar
    `dark:border-muted` al `className` de `home-join-pet-button`
    (`screens/home/index.tsx`) → rojo B (esta es la zona ciega del candado:
    otro botón neutro).

- **R4**: WHERE `welcome-have-account` declara `dark:border-<token>`, THE SYSTEM
  SHALL resolver ese token en el tema oscuro de `src/theme/global.css` a un
  color hex opaco con contraste de al menos 3:1 frente a `--surface` y frente a
  `--background` de ese mismo tema.
  - Test: `src/theme/__tests__/global-css.test.ts`,
    `it('#231 R4: el borde oscuro de Bienvenida contrasta 3:1 con la superficie y el fondo')`
    (nuevo `describe('#231 R4: …')`). Lee con la `readFileSync` ya declarada
    arriba el fichero `${process.cwd()}/src/screens/welcome/index.tsx`, aísla el
    tag de apertura que contiene `testID="welcome-have-account"` (desde el `<`
    anterior hasta el siguiente `<`), extrae el token con
    `/(?:^|\s)dark:border-([a-z0-9-]+)(?=\s|")/` (falla si no hay coincidencia),
    toma `parseVariables(extractVariant('dark'))` y asierta: el valor del token
    cumple `/^#[0-9A-Fa-f]{6}$/`; `contrast(valor, variables['surface'])` y
    `contrast(valor, variables['background'])` son ambos `>= 3` (helpers
    `extractVariant`, `parseVariables`, `contrast` ya existentes en el fichero).
    **El token sale del código de producción, no del test**: no se escribe
    `'muted'` en el test.
  - Mutaciones plantadas (cada una debe ponerlo rojo y se revierte): (a) en el
    tag cambiar `dark:border-muted` por `dark:border-lip-gray` (1,125:1);
    (b) por `dark:border-border` (rgba, no hex); (c) quitar la clase (sin
    coincidencia); (d) en `global.css`, bloque `@variant dark`, cambiar
    `--muted: #9CA3AF;` por `--muted: #2A2F37;` (el token deja de contrastar).

- **R5**: WHEN se aplican R1 y R3, THE SYSTEM SHALL conservar sin cambio todo lo
  demás de «Ya tengo una cuenta» y de la pantalla: `style={chunkyLip.neutral}`,
  la navegación `router.push('/login')` (una llamada, sin `replace`), la
  etiqueta `text-17 font-bold text-accent-strong` con el copy
  `welcome.haveAccount`, y los dos hermanos del bloque `welcome-rise-actions`
  en su orden (`welcome-get-started`, `welcome-have-account`).
  - Test: **los `it` existentes, sin tocar sus aserciones salvo lo que enmienda
    R6**: `describe('R8')::empuja a login sin reemplazar`;
    `describe('R8')::es un botón de superficie…` (solo su `toBe`, ver R6) que
    también aserta la etiqueta; el `it` de orden de `welcome-rise-actions`
    (`toEqual(['welcome-get-started', 'welcome-have-account'])`);
    `#166 R3: lleva el labio gris en el CTA secundario`;
    `__tests__/chunky-cta-canvas-fidelity.test.ts::#177 R4.1` y `#177 R4.2`
    (valida `style={chunkyLip.neutral}`, `onPress` y la etiqueta por tag).
  - Ningún otro fichero de `src/screens/**` ni de `src/components/**` cambia en
    el diff (lo comprueba el handoff con `git diff --name-only`, no un test).

- **R6**: WHEN R1 y R3 cambian el tag de `welcome-have-account`, THE SYSTEM
  SHALL enmendar en su sitio los tres pins de su receta, sin debilitar su
  intención, con el sufijo `(enmendado por #231 R1, R3)` en el título del `it`
  (o en el del `it.each` cuando el pin es una fila):
  1. `src/screens/welcome/index.test.tsx`, `describe('R8')`,
     `it('es un botón de superficie con labio gris y tinta accent-strong')`: el
     `toBe` pasa de `'w-full h-14 rounded-16 border-2 border-lip-gray bg-surface'`
     a `NEW_CLASSES`; la aserción de la etiqueta no cambia.
  2. `src/__tests__/chunky-cta-canvas-fidelity.test.ts`, fila de
     `welcome-have-account` en `NEUTRAL_ROWS`: la cadena de clases pasa a
     `NEW_CLASSES` y el cuarto elemento (variante) pasa de `null` a `'outline'`.
     Títulos afectados: `#177 R4.1` (`it.each(NEUTRAL_ROWS)`) y, por compartir
     fila, `#177 R4.2`.
  3. `src/__tests__/consistency-classnames.test.ts`, fila `welcome-have-account`
     de `describe('#166 R3: el secundario neutro lleva el labio gris')`: el
     tercer elemento pasa de `null` a `'outline'`. El `it.each` de esa tabla ya
     añade `(enmendado por … )`; añade `#231 R1, R3` a su lista. La constante
     `recipe` de ese describe es una subcadena de `NEW_CLASSES` y **no cambia**.
  - Test: la suite completa de `mobile-pet-tracker/` en verde. Más
    `it('#231 R6: los candados enmendados nombran su enmienda')` en
    `src/screens/welcome/index.test.tsx` que lee por fuente
    (`readSource('screens/welcome/index.test.tsx')`, y con
    `join(sourceRoot, '__tests__', …)` los otros dos) y cuenta que la subcadena
    `enmendado por #231 R1, R3` aparece **≥ 1** vez en cada uno de los tres
    ficheros. Mutación plantada: quitar el sufijo de uno de los tres → rojo.
  - Cuentas: ningún contador de los guards se mueve (ver Evidencia); T0 las
    recomputa antes de editar y el handoff pone la salida esperada de cada una.

- **R7** *(gate G4: casilla humana propia, ver «Aprobación»)*: WHERE la enmienda
  de `docs/ui-guidelines.md` está firmada por el humano, THE SYSTEM SHALL añadir
  al **final** de ese fichero (después de la sección `## Enmienda #209 — Cuestionario de nutrición`,
  que hoy es la última; `grep -n '^## ' docs/ui-guidelines.md | tail -1`) esta
  sección exacta:
  ````text
  ## Enmienda #231 — Secundario de Bienvenida: pulsado neutro y borde en oscuro

  «Ya tengo una cuenta» (`welcome-have-account`) lleva `variant="outline"`: el resaltado al pulsarlo es el neutro de HeroUI y no el verde del primario. En tema oscuro su borde se pinta con `dark:border-muted`, añadido al final de la receta del secundario neutro de la regla 13 (`w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted`), porque `--color-lip-gray` oscuro (`#0A0D12`) apenas se distingue de `--surface` (`#161B22`, 1,125:1) y `--muted` oscuro (`#9CA3AF`) contrasta 6,81:1. Es la única excepción `dark:border-*` de la app; el token `--color-lip-gray` y el labio `chunkyLip.neutral` no cambian.

  - [ ] Enmienda #231 aprobada por humano
  ````
  - Test: `src/screens/welcome/index.test.tsx`,
    `it('#231 R7: la carta trae la enmienda del secundario de Bienvenida')`
    (como `#167 R11` de ese fichero: `readFileSync(join(process.cwd(), '..', 'docs', 'ui-guidelines.md'), 'utf8')`):
    el texto del encabezado más el cuerpo, **sin** la línea de la casilla,
    aparece exactamente **una** vez (`charter.split(texto).length - 1 === 1`) y
    `charter.slice(charter.indexOf('## Enmienda #231'))` cumple
    `/- \[[ xX]\] Enmienda #231 aprobada por humano/` (tolerante a que la
    casilla ya esté marcada). Aserta también `charter.split('## Checklist de autocrítica').length - 1 === 1`.
  - **Orden**: R7 se implementa **solo después** de que el humano marque la
    casilla G4. Hasta entonces ni el test ni la sección de docs entran en la
    rama (nada de `it.skip`) y R7 queda `pendiente` en la trazabilidad; R1 a R6
    no dependen de ella (ningún guard existente exige esa sección).
  - Mutación plantada (cuando R7 se implemente): cambiar `6,81:1` por `6,8:1`
    en el cuerpo → rojo.

## Paso de smoke nuevo (G2, humano, en lote al final)

Anotar en `progress/smoke_mejoras-smoke.md` (lo registra el leader). Reproduce
el fallo original: en el dev build de Android, sin sesión, en la pantalla de
Bienvenida:
1. Tema **claro**: mantener pulsado «Ya tengo una cuenta». Antes: la capa se
   teñía de **verde**. Ahora: gris neutro tenue, el botón se encoge ligeramente.
2. Tema **oscuro**: el borde de 2 px del botón se ve claramente (gris `#9CA3AF`)
   y mantener pulsado tampoco da verde.
3. «Comenzar ahora» sigue resaltando verde al pulsarlo.

## Fuera de alcance

- Cambiar `--color-lip-gray` u otro token de `global.css` (afecta al interruptor
  apagado, segmentos de progreso, agarradores y los demás neutros; sería una
  decisión de canvas, G1).
- El labio `chunkyLip.neutral` en oscuro y cualquier otro secundario neutro de
  la app (solo Bienvenida).
- Quitar por completo el feedback de pulsado (`highlight: false`, `feedbackVariant="none"`).
- El primario «Comenzar ahora», su labio y su resaltado.
- Copy, i18n, animaciones de entrada de Bienvenida, PingRing, Orbit.
- Cambios de backend, dependencias o módulos nativos.
- El smoke en dispositivo (G2) y el rebuild del dev build (G3).

## Aprobación

- [x] Aprobado por humano (firma delegada del leader, mandato 2026-10-23 ampliado 2026-11-03; fecha: 2026-11-03T17:12Z) ← gate obligatorio antes de implementar
  (R1 a R6; la firma delegada la pone el leader con la checklist de
  `progress/plan_canvas-parity-2026-10-23.md` §4 y los tres puntos de
  `progress/plan_ui-2026-10-26.md` §4)
- [ ] **G4**: aprobada la enmienda de `docs/ui-guidelines.md` de R7 (casilla
  humana propia, **no delegada**) (fecha: ____) ← sin esta casilla R7 no se
  implementa
- [ ] **G2**: smoke en el dev build de Android (claro y oscuro, tres pasos de
  «Paso de smoke nuevo») (fecha: ____) ← gate humano, por lote al final
  (`progress/smoke_mejoras-smoke.md`)
- Base congelada: `f05016d3` (`origin/dev`).
