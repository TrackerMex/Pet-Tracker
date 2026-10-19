---
feature: "mobile-home-empty-canvas-fidelity"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-home-empty-canvas-fidelity]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.

Alcance: estado sin mascota de la pantalla Inicio (`home-no-pets-screen` y `home-empty`). Referencia visual: artboard «Inicio sin mascota» del canvas aprobado (https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j) y filas 16–24 de `progress/explore_171-canvas-parity.md`. El copy se queda en la voz B de #155. Las rutas de código son relativas a `mobile-pet-tracker/`. Geometría del escenario, del CTA y del gap contrastada con la copia del artboard de #155 (`specs/mobile-empty-states-pingo/design-src/inicio-vacio.dc.html`, canvas versión `1791473009-3376`): ver [[design]] §Contraste con la copia del artboard. Reconciliada el 2026-10-19 con origin/main cbd964da (#177 y #181 mergeadas): ver [[design]] §Premisas contrastadas.

## Requisitos funcionales

- **R1**: IF `EmptyState` se renderiza sin `variant` o con `variant="default"`, THEN THE SYSTEM SHALL conservar su render actual: pose de 160×160 px, título `text-lg font-bold`, cuerpo sin tamaño propio, CTA sin icono y flotación con la misma amplitud que hoy (4 px, token `MOTION_FLOAT_*`).
- **R2**: WHEN Inicio renderiza su estado sin mascota, THE SYSTEM SHALL pasar `variant="hero"` a `EmptyState` con `testID="home-empty"`.
- **R3**: WHEN la cuenta no tiene mascotas (`pets.data?.kind === 'ok'` y `pets.data.pets.length === 0` en `src/screens/home/index.tsx`), THE SYSTEM SHALL pintar `home-no-pets-screen` con la clase exacta `flex-1 items-center justify-center px-5 py-6 bg-background` (padding lateral de 20 px y vertical de 24 px, según la enmienda de fidelidad de 2026-10-13) y `home-empty` como único hijo, sin título de cabecera antes del hero. El centrado y la ausencia de cabecera los fijó #181 R3.2; esta spec solo cambia `p-6` por `px-5 py-6` y enmienda el test de #181 R3.2 que fija la clase exacta (ver [[tasks]] §Tests enmendados).
- **R4**: WHILE la variante `hero` está renderizada, THE SYSTEM SHALL dibujar la pose `home-empty-pose` a 190×190 px.
- **R5**: WHILE la variante `hero` está renderizada, THE SYSTEM SHALL pintar la pose dentro de un escenario `home-empty-stage` de 280×260 px (`h-65 w-70 items-center justify-center`) cuyos hijos, en este orden, son: un disco `home-empty-stage-disc` de 240 px (`absolute size-60 rounded-full bg-surface-secondary`); tres huellas decorativas `home-empty-stage-paw` (un `Svg` de `react-native-svg` de 280×260 px, absoluto, relleno con el token `accent` vía `useThemeColors`, con opacidad `PINGO_STAGE_PAW_OPACITY` = 0.18 y la geometría de [[design]] D3); la pose con su flotación (`home-empty-float`, R6); y una sombra de suelo `home-empty-stage-shadow` (`absolute bottom-4.5 h-3.5 w-30 rounded-full`, es decir elipse de 120×14 px a 18 px del borde inferior, con `backgroundColor` `PINGO_STAGE_SHADOW_COLOR` = `rgba(13,17,23,0.10)`). La opacidad y el color vienen de las constantes de `src/theme/pingo-stage.ts`.
- **R6**: WHILE la variante `hero` está renderizada y reduce motion está desactivado, THE SYSTEM SHALL envolver la pose en `PingoFloat` (`home-empty-float`) con un desplazamiento vertical de `MOTION_PINGO_FLOAT_OFFSET_Y` (10 px) y `MOTION_PINGO_FLOAT_TIMING` (1500 ms por tramo, `ease-in-out`, bucle infinito e invertido).
- **R7**: WHILE reduce motion está activado, THE SYSTEM SHALL no arrancar la flotación de R6 ni la entrada de R13, y mostrar cada elemento de la variante `hero` en su posición y opacidad finales desde el primer fotograma.
- **R8**: WHILE la variante `hero` está renderizada, THE SYSTEM SHALL mostrar el título con `text-26` (26 px), `font-black` (900), `tracking-title`, centrado y en `text-foreground`.
- **R9**: WHILE la variante `hero` está renderizada, THE SYSTEM SHALL mostrar el cuerpo con `text-15` (15 px), centrado, con ancho máximo de 290 px y en `text-muted`.
- **R10**: WHILE la variante `hero` está renderizada, THE SYSTEM SHALL mostrar el título, el cuerpo y la etiqueta del CTA con los mismos literales que origin/main, sin cambiar ninguno en esta feature.
- **R11**: WHEN la feature está mergeada, THE SYSTEM SHALL cumplir la regla grep-clean de `docs/ui-guidelines.md` §3 en los ficheros tocados: cero literales hex fuera de `src/theme/`, cero clases arbitrarias `[...]`, cero `StyleSheet.create` y cero sombras o elevation legacy (solo `boxShadow`).
- **R12**: WHILE la variante `hero` está renderizada y hay acción, THE SYSTEM SHALL pintar la acción dentro de un envoltorio `View` (`home-empty-action-wrap`, clase `w-full mt-2.5`: ancho completo y margen superior de 10 px) cuyo único hijo es el `Button` `home-empty-action` ya existente, y dentro del botón un icono `Plus` de `reicon-react-native` de 20 px (`home-empty-action-icon`, color del token `accent-foreground` vía `useThemeColors`, `marginRight` de 8 px) antes de la etiqueta de R10. El botón hereda sin cambios la receta de #177 (`h-14 rounded-16 bg-accent`, `style={chunkyLip.primary}` de `useChunkyLip()`, etiqueta `Text` `text-17 font-extrabold text-accent-foreground`): esta spec no toca esas clases ni añade `w-full` ni `mt-2.5` al `Button`. La etiqueta sigue siendo `Text` de react-native, no `Button.Label` (Enmienda #187).
- **R13**: WHEN la variante `hero` se monta con reduce motion desactivado, THE SYSTEM SHALL animar la entrada del escenario, el título, el cuerpo y el CTA en ese orden, con retrasos de 0, 60, 120 y 180 ms (índice × `MOTION_STAGGER_MS`), opacidad de 0 a 1 con `MOTION_FADE_TIMING` y desplazamiento vertical desde `MOTION_ENTRANCE_OFFSET_Y` (12 px) hasta 0 con `MOTION_SETTLE_SPRING`, la misma pareja de curvas que la entrada del resto de Inicio (`homeEntering`). La entrada se hace con valores compartidos dentro de `EmptyState`, sin `entering=`/`exiting=`.
- **R14**: WHILE la variante `hero` está renderizada, THE SYSTEM SHALL pintar la raíz de `EmptyState` (`home-empty`) con la clase exacta `w-full items-center gap-3.5` (ancho completo del contenedor, para que el CTA de R12 ocupe el ancho útil, y 14 px entre escenario, título, cuerpo y CTA) y sus hijos directos, en este orden, `home-empty-stage`, `home-empty-title-enter`, `home-empty-body-enter` y, si hay acción, `home-empty-action-wrap`. `home-empty-title` y `home-empty-body` son los `Text` de R8 y R9 dentro de sus envoltorios `-enter`. La variante `default` conserva `items-center gap-3 py-8`.

## Fuera de alcance

- Celebraciones (confeti, insignia): son de #171 (E4).
- Cambios visuales en las siete pantallas restantes que usan `EmptyState`. Su extensión global es la pregunta Q1 de [[design]].
- Receta global del botón (altura, radio, tipografía, sombra): es de #177, ya mergeada (PR #231). Esta spec la hereda y no la modifica.
- Cambios en `MOTION_FLOAT_*` o en la bienvenida (#153, #172).
- Cambios de copy o adopción de la voz del canvas: el copy queda en voz B de #155.
- Contenedor `home-no-pets-screen` más allá del padding lateral de R3: su centrado y la supresión de la tarjeta de error son de #181.
- Estado de Inicio con mascota seleccionada.
- Capas de dominio, aplicación e infraestructura: sin cambios de lógica ni de API.
- Redacción de la Enmienda #176 de `docs/ui-guidelines.md`: no la escribe esta spec. Su aprobación humana es precondición de la fase (2) de R6 y R7 ([[design]] §Precondiciones).
- Smoke en dispositivo: lo corre el humano.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
