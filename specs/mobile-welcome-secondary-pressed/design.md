---
feature: "mobile-welcome-secondary-pressed"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-welcome-secondary-pressed]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Cambio solo de presentación en `mobile-pet-tracker/`: no hay domain,
> application ni infrastructure. Reglas de UI: `docs/ui-guidelines.md`
> (regla 13, CTA chunky; regla de tokens; lista de enmiendas).

## Decisiones técnicas

- **`variant="outline"` en lugar de `animation={{ highlight: false }}`** (R1, R2).
  La capa de pulsado de `Button` (`PressableFeedback.Highlight`) toma su color de
  `highlightColorMap`, y para la variante por defecto (`primary`) es
  `accent-hover`, verde. `outline` lo cambia a `default-hover` (alfa 0,3), un gris
  neutro; ya es lo que llevan los otros cinco secundarios neutros del repo. La
  receta completa (`h-14 rounded-16 border-2 border-lip-gray bg-surface` +
  `chunkyLip.neutral`) la dibuja la pantalla, así que la variante solo decide el
  color de la capa de feedback.
- **El borde oscuro es de pantalla, no de tema** (R3, R4). `--color-lip-gray`
  oscuro (`#0A0D12`) es el valor del canvas y lo pinan `global-css.test.ts` y los
  guards de paridad; lo comparten el interruptor, los segmentos y unos 18
  secundarios neutros. Cambiarlo es una decisión de canvas (G1), no de esta
  feature. Una clase `dark:border-muted` añadida al final del `className` se
  limita a un botón y a un tema.
- **Token `muted`** (R4): ya existe, es un hex opaco (`#9CA3AF`) y contrasta
  6,81:1 con `--surface` y 7,45:1 con `--background` en oscuro. No hay token nuevo
  ni hex en la pantalla (la regla de tokens de la carta y los guards de
  `design-drift` siguen limpios).
- **Orden de clases** (R3): tailwind-merge ya está en la cadena de `Button`; con
  `dark:border-muted` al final no hay conflicto, porque el modificador `dark:`
  separa las claves de conflicto de `border-lip-gray`. Se candana el orden para
  que un refactor no la anteponga.
- **Candado de «sin verde» en dos capas** (R1 + R2). En jest, `uniwind` no
  resuelve colores y `Button` está mockeado como `View` en el test de Bienvenida,
  así que un render nunca puede ver «verde». Candar la pantalla sola (R1) es
  correcto pero no prueba que `outline` sea neutro; candar la librería sola (R2)
  no prueba que la pantalla use `outline`. Juntas cubren la cadena entera:
  pantalla declara `outline` y `outline` no es `accent-hover`.
- **R2 lee el código de la librería, no la mockea** (R2). Es una prueba de
  contrato, con ancla de no-vacuidad (`case 'primary'` sí contiene
  `themeColorAccentHover`) para que un cambio de estructura de `button.tsx` falle
  ruidoso. Si el nombre del archivo cambia, ese `it` se actualiza con la
  actualización de la librería: es su función.
- **Contraste derivado del código, no escrito en el test** (R4). El token se
  extrae del `className` de producción y el contraste se calcula contra el
  `global.css` parseado: cambiar el token, o el color de `muted`, hace fallar el
  `it`, sin un `'muted'` literal que lo convierta en tautología.
- **Enmienda de carta en gate propio** (R7). La excepción `dark:border-*` es una
  desviación de la receta de la regla 13 y de la ausencia de variantes oscuras por
  clase en la carta, así que va como `## Enmienda #231` con casilla humana G4. R1
  a R6 no dependen de ella.

## Archivos afectados

Todos bajo `mobile-pet-tracker/` salvo `docs/`:

- `src/screens/welcome/index.tsx` — presentación: `variant="outline"` y
  `NEW_CLASSES` en `welcome-have-account` (R1, R3).
- `src/screens/welcome/index.test.tsx` — test: `it` nuevos de R1, R2, R3, R6 y R7;
  enmienda del `toBe` exacto de `describe('R8')` (R6).
- `src/__tests__/chunky-cta-canvas-fidelity.test.ts` — test: fila
  `welcome-have-account` de `NEUTRAL_ROWS` (clases + variante `'outline'`) y `it`
  de alcance `dark:border-*` (R3, R6).
- `src/__tests__/consistency-classnames.test.ts` — test: fila
  `welcome-have-account` de `#166 R3` pasa a `'outline'` (R6).
- `src/theme/__tests__/global-css.test.ts` — test: `describe` nuevo de R4 con
  `extractVariant`, `parseVariables` y `contrast`.
- `../docs/ui-guidelines.md` — **solo con G4 firmado**: sección
  `## Enmienda #231 …` al final (R7).
- No cambian: `src/theme/global.css`, `src/theme/chunky-lip.ts`, i18n,
  `src/components/**`, otras pantallas, `package.json`, `bun.lock`.

## Alternativas descartadas

- **`animation={{ highlight: false }}`**: quita todo el feedback de la capa y
  distingue a este botón del resto; ganancia nula frente a `outline`.
- **`feedbackVariant="none"`**: además de la capa quita la escala de pulsado, que
  es parte del cuerpo chunky de la regla 13.
- **Subir el contraste de `--color-lip-gray` oscuro**: toca ~25 piezas y rompe la
  paridad con el canvas (v140); sería G1.
- **`dark:border-border`**: `--border` oscuro es un rgba al 8 % (1,2:1), no
  alcanza 3:1 ni es hex opaco (R4 lo rechaza).
- **`dark:border-accent-strong`**: `chunky-cta-canvas-fidelity` y otros guards
  prohíben la subcadena `border-accent` en los neutros; añadiría ruido para un
  color que además compite con el primario.
- **Estilo en línea con `useUniwind()` para el borde**: salta la vía de tokens y
  hace falta una sonda de plataforma/tema por `it`; la clase `dark:` es el patrón
  de la app para el tema.
- **Un componente `SecondaryButton` compartido**: abstracción para un solo uso;
  los otros cinco ya repiten la receta y refactorizarlos cambia 5 pantallas.
