---
feature: "mobile-home-empty-canvas-fidelity"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[mobile-home-empty-canvas-fidelity]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.

## Premisas contrastadas

Leídas en la worktree (base origin/main d799d714). No se toman tal cual del explore ni de la descripción de #176:

- Composición: `home-no-pets-screen` es `flex-1 items-center justify-center` con `p-6` (`src/screens/home/index.tsx`). Falta el padding lateral (R3).
- Pose: `EmptyState` la dibuja a 160×160 (`src/components/empty-state.tsx`); Inicio pasa `pose="talk"`. Falta 190 px (R4).
- Flotación: `EmptyState` tiene su propio `Animated.View` (`-float`) con `MOTION_FLOAT_*`, que comparte con la bienvenida (#153). Falta PingoFloat (R6).
- Título: `text-lg font-bold` (18/700). Falta 26/900 con tracking (R8).
- Cuerpo: sin tamaño ni ancho máximo. Faltan 15 px y 290 px (R9).
- CTA: `Button` con `rounded-xl bg-accent border-b-4 border-black/25` y `Button.Label` con `font-bold`, sin icono ni ancho completo (R12).
- La descripción de #176 dice «igual al canvas salvo el botón». El código no coincide: título, pose, cuerpo y CTA difieren. Esta spec sigue el código, no la descripción.
- `EmptyState` lo usan ocho pantallas (Inicio y siete más). Aún no tiene `variant`.
- PingoFloat lo usan register, forgot y reset-password (auth). Inicio no lo usa.
- Tokens: `text-26`, `text-15` y `tracking-title` existen en `src/theme/global.css`. `font-black` es la utilidad estándar de Tailwind v4 (900) y no requiere token.
- `Plus` de `reicon-react-native` ya está en uso en el proyecto y `react-native-svg` está instalado. No hay dependencia nueva.

## Supuestos no verificados

Esta pasada no pudo confirmar los puntos siguientes. El implementer los confirma antes del test rojo que los usa:

- Artboard «Inicio sin mascota». La lectura del canvas devolvió instrucciones de tipo, no el artboard. Son supuestos: subida de la entrada (12 px, token), icono `+` (20 px, `Plus`), gap vertical (16 px, D9) y geometría de la sombra de suelo y de la huella (R5). Ver Q3.
- API de `PingoFloat` (`src/components/pingo-float.tsx`): props y si acepta `testID`. Si no lo acepta, se envuelve en un `View` con el testID `home-empty-float`.
- Signo del desplazamiento: tasks.md R6 asume `translateY` de -10 a 1500 ms. Confirmar con la implementación actual de `PingoFloat`.
- Mock de reduce motion: tasks.md R7 asume el de `pingo-float.test.tsx`. Si no existe o no encaja, usar el mock de `useReducedMotion` de Reanimated.
- Nombre `selectedPetId` (R3): confirmar en `src/screens/home/index.tsx`.
- Rutas de test de «Archivos afectados»: confirmar la ubicación real de `empty-state.test.tsx` y `index.test.tsx` antes del test rojo.
- `docs/architecture.md` no se leyó. La afirmación de que el cambio es solo de presentación sale de las rutas de archivo. El reviewer la valida contra ese documento.

## Dependencias y precondiciones

Dependencias por feature:

- #181 (done): dueña de `home-no-pets-screen` (centrado, sin tarjeta de error). Cumplida en origin/main.
- #177 (pending en origin/main): receta global del botón. Precondición de la fase (2) de R12: #177 mergeada antes. Esta spec no define alto, radio, tipografía ni sombra del CTA.
- #172 (done): `PingoFloat` en `src/components/pingo-float.tsx`, sin cambios. Su enmienda dice que ninguna otra pantalla usa PingoFloat sin enmienda propia: R6 necesita la Enmienda #176.
- #187 (done): tamaños de texto de HeroUI. La etiqueta del CTA (R12) se fija con `Label.Text`, según la nota del proyecto sobre `Label` de HeroUI: la `className` de `Button.Label` va al Pressable raíz y no al texto. El implementer confirma el patrón en #187 antes de escribir el test de R12.
- #155 (done): copy voz B y `EmptyState` original (R1, R10).
- #153 (done): `MOTION_FLOAT_*` compartido con la bienvenida. No se toca.
- #166 (done): receta actual del CTA (§13 de la carta), que #177 sustituye.
- #171 (done): celebraciones. Fuera de alcance (E4).

Precondiciones de implementación:

- P1. Enmienda #176 aprobada por humano en `docs/ui-guidelines.md` antes de la fase (2) de R6 y R7. Texto propuesto: «El estado sin mascota de Inicio (variante `hero` de `EmptyState`) usa PingoFloat con `MOTION_PINGO_FLOAT_OFFSET_Y` (10 px) y `MOTION_PINGO_FLOAT_TIMING` (1500 ms por tramo). Con reduce motion no arranca. Esta enmienda no autoriza PingoFloat en ninguna otra pantalla.»
- P2. #177 mergeada antes de la fase (2) de R12 (ver Q2).
- P3. La enmienda de fidelidad de 2026-10-13 cubre el padding lateral de 20 px y el gap del artboard para pantallas aprobadas contra canvas. No hace falta enmienda nueva para R3. Si el gap de D9 no queda cubierto, se trata en Q3.

## Decisiones técnicas

- **D1. Variante `hero` (R1, R2).** `EmptyState` gana `variant?: 'default' | 'hero'`, con `default` por defecto. Inicio pasa `hero`. La variante `default` no cambia, así que las siete pantallas restantes conservan su contrato y sus pruebas. Una variante evita un componente duplicado.
- **D2. Flotación con PingoFloat (R6, R7).** La variante `hero` envuelve la pose en `PingoFloat`, usando su API tal como está. `MOTION_FLOAT_*` no cambia: la bienvenida sigue en 4 px (resuelve el riesgo 3 del explore). Con reduce motion, PingoFloat no arranca.
- **D3. Escenario (R5, R11).** Una capa absoluta detrás de la pose, con la sombra de suelo (un `View` redondeado) y la huella (SVG de `react-native-svg`). Los literales de color y la opacidad 0.18 viven en `src/theme/pingo-stage.ts` (archivo nuevo), el único sitio con literales de color de los ficheros tocados. Así R11 se cumple.
- **D4. Tipografía (R8, R9).** Título `text-26 font-black tracking-title text-center text-foreground`. Cuerpo `text-15 text-center text-muted` con `style={{ maxWidth: 290 }}`. El ancho en píxeles va en `style` numérico, como ya hace el archivo con `style={{ width: 160, height: 160 }}`. Descartado un token `--container-copy` (ver alternativas).
- **D5. CTA (R12).** El botón hereda la receta de #177 y no la define. Esta spec añade `w-full`, un icono `Plus` de `reicon-react-native` a 20 px antes de la etiqueta y `mt-2.5` (10 px de la escala de Tailwind). La etiqueta usa `Label.Text` según #187.
- **D6. Entrada escalonada (R13, R7).** Escenario, título, cuerpo y CTA usan `withDelay` con retraso índice × `MOTION_STAGGER_MS` (0, 60, 120 y 180 ms). La opacidad usa `withTiming` con `MOTION_FADE_TIMING`, y el desplazamiento vertical va desde `MOTION_ENTRANCE_OFFSET_Y` (12 px) hasta 0. Con reduce motion no hay animación: el estado inicial es el final.
- **D7. Copy (R10).** Sin cambios. Decisión humana: voz B de #155, según la descripción de #176.
- **D8. Padding (R3).** `home-no-pets-screen` pasa de `p-6` a `px-5 py-6`. Es el único cambio sobre el contenedor de #181 y viene de la enmienda de fidelidad.
- **D9. Gap vertical (sin R, no implementar hasta Q3).** `gap-4` (16 px) entre pose, título, cuerpo y CTA en la variante `hero`, frente al `gap-3` (12 px) actual. Si Q3 lo confirma, pasa a R12 con su test; hasta entonces no se implementa.

## Archivos afectados

Rutas relativas a `mobile-pet-tracker/`. Todo es capa de presentación; no hay cambios en dominio ni en aplicación.

- `src/components/empty-state.tsx` — prop `variant`; render `hero` (escenario, PingoFloat, título, cuerpo, CTA con icono, entrada escalonada); render `default` sin cambios. Cubre R1 y R4–R13.
- `src/components/__tests__/empty-state.test.tsx` — pruebas de R1 y de la variante `hero` (R4–R9, R12, R13). Ruta por confirmar.
- `src/screens/home/index.tsx` — `variant="hero"` en el `EmptyState` de Inicio (R2) y `px-5 py-6` en `home-no-pets-screen` (R3).
- `src/screens/home/index.test.tsx` — pruebas de R2, R3 y R10 dentro de Inicio. Ruta por confirmar.
- `src/theme/pingo-stage.ts` — archivo nuevo: sombra de suelo y opacidad de la huella (R5, R11).
- `src/components/pingo-float.tsx` — sin cambios; se reutiliza (R6).
- `src/theme/motion.ts` — sin cambios; se reutilizan `MOTION_PINGO_FLOAT_*`, `MOTION_STAGGER_MS`, `MOTION_FADE_TIMING` y `MOTION_ENTRANCE_OFFSET_Y`.
- `src/theme/global.css` — sin cambios.
- `docs/ui-guidelines.md` — Enmienda #176 (P1). La redacta el humano o el leader; no la escribe esta spec.
- Las siete pantallas restantes que usan `EmptyState` — sin cambios. Sus pruebas deben seguir en verde sin editarse.

## Alternativas descartadas

- Cambiar `EmptyState` para las ocho pantallas: cambia el contrato de siete pantallas y exige una enmienda por pantalla para PingoFloat. Descartada; queda como Q1.
- Cambiar `MOTION_FLOAT_*` a 10 px y 1500 ms: rompe la bienvenida (4 px) y la variante `default`.
- Componente nuevo `HeroEmptyState` duplicado: duplica código; la variante cuesta menos.
- Clases arbitrarias (`h-[190px]`, `max-w-[290px]`) o color literal en el componente: prohibido por ui-guidelines §3 (R11).
- Definir la receta del CTA aquí: duplicaría #177 y chocaría con él.
- Icono `+` dibujado a mano en SVG: descartado en favor de `Plus`, que ya está en el proyecto. Si el artboard exige otro trazo, se reabre en Q3.
- Token CSS `--container-copy` para 290 px: una variable para una sola medida. El valor va inline, como el resto del archivo.

## Preguntas abiertas

- **Q1. Alcance.** Propuesta: variante `hero` solo en Inicio. Alternativa: extenderla a las siete pantallas restantes, con una enmienda por pantalla.
- **Q2. Orden con #177.** Propuesta: #177 mergea antes que #176 (P2). Alternativa: #176 avanza con una receta propia temporal, que #177 sustituiría después.
- **Q3. Artboard y enmienda.** Confirmar contra el artboard, que no se pudo leer: subida de la entrada (12 px, token), icono `+` (20 px, `Plus`), gap vertical (16 px, D9), geometría de la sombra de suelo y de la huella, y si el padding lateral de R3 se aplica al contenedor de #181. Aprobar la Enmienda #176 (P1).
