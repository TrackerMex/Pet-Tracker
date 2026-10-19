---
feature: "mobile-home-empty-canvas-fidelity"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-home-empty-canvas-fidelity]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.

Alcance: estado sin mascota de la pantalla Inicio (`home-no-pets-screen` y `home-empty`). Referencia visual: artboard «Inicio sin mascota» del canvas aprobado (https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j) y filas 16–24 de `progress/explore_171-canvas-parity.md`. El copy se queda en la voz B de #155. Las rutas de código son relativas a `mobile-pet-tracker/`.

## Requisitos funcionales

- **R1**: IF `EmptyState` se renderiza sin `variant` o con `variant="default"`, THEN THE SYSTEM SHALL conservar su render actual: pose de 160×160 px, título `text-lg font-bold`, cuerpo sin tamaño propio, CTA sin icono y flotación con la misma amplitud que hoy (4 px, token `MOTION_FLOAT_*`).
- **R2**: WHEN Inicio renderiza su estado sin mascota, THE SYSTEM SHALL pasar `variant="hero"` a `EmptyState` con `testID="home-empty"`.
- **R3**: WHILE no hay mascota seleccionada (`selectedPetId` null), THE SYSTEM SHALL centrar el contenido dentro de `home-no-pets-screen`, sin título de cabecera antes del hero, con padding lateral de 20 px (`px-5`) y vertical sin cambio (`py-6`), según la enmienda de fidelidad de 2026-10-13. El centrado ya lo fija #181 R3.2 y esta spec no lo redefine.
- **R4**: WHILE la variante `hero` está renderizada, THE SYSTEM SHALL dibujar la pose `home-empty-pose` a 190×190 px.
- **R5**: WHILE la variante `hero` está renderizada, THE SYSTEM SHALL dibujar detrás de la pose un escenario con una sombra de suelo (`home-empty-stage-shadow`, color `rgba(13,17,23,0.10)`) y un acento de huella (`home-empty-stage-paw`, opacidad 0.18), tomando ambos valores de constantes de `src/theme/`.
- **R6**: WHILE la variante `hero` está renderizada y reduce motion está desactivado, THE SYSTEM SHALL envolver la pose en `PingoFloat` (`home-empty-float`) con un desplazamiento vertical de `MOTION_PINGO_FLOAT_OFFSET_Y` (10 px) y `MOTION_PINGO_FLOAT_TIMING` (1500 ms por tramo, `ease-in-out`, bucle infinito e invertido).
- **R7**: WHILE reduce motion está activado, THE SYSTEM SHALL no arrancar la flotación de R6 ni la entrada de R13, y mostrar cada elemento de la variante `hero` en su posición y opacidad finales desde el primer fotograma.
- **R8**: WHILE la variante `hero` está renderizada, THE SYSTEM SHALL mostrar el título con `text-26` (26 px), `font-black` (900), `tracking-title`, centrado y en `text-foreground`.
- **R9**: WHILE la variante `hero` está renderizada, THE SYSTEM SHALL mostrar el cuerpo con `text-15` (15 px), centrado, con ancho máximo de 290 px y en `text-muted`.
- **R10**: WHILE la variante `hero` está renderizada, THE SYSTEM SHALL mostrar el título, el cuerpo y la etiqueta del CTA con los mismos literales que origin/main, sin cambiar ninguno en esta feature.
- **R11**: WHEN la feature está mergeada, THE SYSTEM SHALL cumplir la regla grep-clean de `docs/ui-guidelines.md` §3 en los ficheros tocados: cero literales hex fuera de `src/theme/`, cero clases arbitrarias `[...]`, cero `StyleSheet.create` y cero sombras o elevation legacy (solo `boxShadow`).
- **R12**: WHILE la variante `hero` está renderizada, THE SYSTEM SHALL mostrar la acción como botón de ancho completo (`w-full`) cuyo contenido es un icono `+` de 20 px (`home-empty-action-icon`) seguido de la etiqueta de R10, con margen superior de 10 px (`mt-2.5`). Alto, radio, tipografía y sombra del botón vienen de la receta global de #177 y no se definen aquí.
- **R13**: WHEN la variante `hero` se monta con reduce motion desactivado, THE SYSTEM SHALL animar la entrada del escenario, el título, el cuerpo y el CTA en ese orden, con retrasos de 0, 60, 120 y 180 ms (índice × `MOTION_STAGGER_MS`), opacidad con `MOTION_FADE_TIMING` y desplazamiento vertical desde `MOTION_ENTRANCE_OFFSET_Y` (12 px) hasta 0.

## Fuera de alcance

- Celebraciones (confeti, insignia): son de #171 (E4).
- Cambios visuales en las siete pantallas restantes que usan `EmptyState`. Su extensión global es la pregunta Q1 de [[design]].
- Receta global del botón (altura, radio, tipografía, sombra): es de #177.
- Cambios en `MOTION_FLOAT_*` o en la bienvenida (#153, #172).
- Cambios de copy o adopción de la voz del canvas: el copy queda en voz B de #155.
- Contenedor `home-no-pets-screen` más allá del padding lateral de R3: su centrado y la supresión de la tarjeta de error son de #181.
- Estado de Inicio con mascota seleccionada.
- Capas de dominio, aplicación e infraestructura: sin cambios de lógica ni de API.
- Redacción de la Enmienda #176 de `docs/ui-guidelines.md`: no la escribe esta spec. Su aprobación humana es precondición de la fase (2) de R6 y R7 ([[design]] §Precondiciones).
- Smoke en dispositivo: lo corre el humano.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
