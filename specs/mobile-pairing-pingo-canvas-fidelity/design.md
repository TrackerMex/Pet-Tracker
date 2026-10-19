---
feature: "mobile-pairing-pingo-canvas-fidelity"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[mobile-pairing-pingo-canvas-fidelity]]

> Decisiones de alto nivel. Sin código de aplicación. Requisitos en [[requirements]].

## Decisiones técnicas

1. **Capa**: presentación de `mobile-pet-tracker`. No cambia `backend-pet-tracker/` ni ninguna capa de dominio, aplicación o infraestructura. La vista usa el estado que `pairing` ya expone (`phase`, `selectedPet`).
2. **Hero**: `src/screens/pairing/index.tsx` monta el hero solo en la vista de vinculación (R14): Pingo en `pingo-collar.webp` dentro de `PingoFloat` (testID `pairing-pingo-float`), con la imagen `pairing-pingo` y dos anillos detrás.
3. **Anillos**: componente `PingRing` en `src/components/ping-ring.tsx` (D3). Recibe `testID`, `delay` en ms y `className` (tamaño, borde y color). Welcome pasa sus clases actuales (`size-65 rounded-full border-2 border-accent`) y el retardo `index * (MOTION_PING_TIMING.duration / 3)`. Pairing pasa `size-37.5 rounded-full border-3 border-accent` y 1200 ms mediante una constante local con nombre que cita el artboard. Usa `MOTION_PING_FROM`, `MOTION_PING_TO_SCALE` y `MOTION_PING_TIMING` de `src/theme/motion.ts`, sin constantes nuevas. Anima solo `transform` (escala) y `opacity`.
4. **Ciclo de vida**: repetición infinita sin reversa; `cancelAnimation` al desmontar, según la regla de ui-guidelines para bucles.
5. **Reduce motion**: `useReducedMotion()` de Reanimated en `PingRing`. Con reduce motion activo no se inicia la repetición y el anillo queda en reposo (D2). `PingoFloat` ya no anima bajo reduce motion, así que no cambia.
6. **Flotado**: `PingoFloat` sin cambios. El ciclo de 3000 ms sale de `MOTION_PINGO_FLOAT_TIMING` (dos medias vueltas de 1500 ms) y la amplitud de 10 px de `MOTION_PINGO_FLOAT_OFFSET_Y`.
7. **Título**: `Text` de react-native, no un componente de heroui-native, con la clase del token de D4 y `font-black`. Regla #187: una clase `text-<n>` no va en un componente de heroui-native ni en Card, porque tailwind-merge la descarta.
8. **Margen**: en el `contentContainerStyle` de `pairing-form`, `padding: 24` se sustituye por `paddingHorizontal: 20` y `paddingVertical: 24`; `gap` y `paddingBottom` no cambian. La excepción ya está registrada en `docs/conventions.md` (fidelidad al canvas, 2026-10-13).
9. **Copy**: todo texto por `t()` con claves del catálogo. Sin subtítulo (D5 a) y sin claves nuevas.
10. **Botón**: #188 no lo toca. La receta la fija #177.

## Enmienda para docs/ui-guidelines.md

La escribe el leader en su commit tras la firma; Codex no toca `docs/`:

> Enmienda #188 (anillos de la vinculación de collar). La vista de vinculación sin dispositivo de `pairing` usa dos anillos con `PingRing` (`src/components/ping-ring.tsx`): escala de 0.55 a 1.5, opacidad de 0.55 a 0, 2400 ms, retardo de 1200 ms en el segundo, borde de 3 px en `accent`, 150 px. Bajo reduce motion, los anillos quedan en reposo (escala 1, opacidad 0.3). Esta enmienda cubre solo esa vista: la regla de #167, «Ninguna otra pantalla usa anillos de ping sin una enmienda propia», sigue vigente para el resto de pantallas.

## Archivos afectados

Todo bajo `mobile-pet-tracker/`, por capa:

- Presentación, propios de la feature:
  - `src/screens/pairing/index.tsx`: hero, título, orden de elementos, padding horizontal (D6), claves de copy.
  - `src/screens/pairing/index.test.tsx`: tests de R1 a R10 y R14.
  - `src/components/ping-ring.tsx` (nuevo).
  - `src/components/__tests__/ping-ring.test.tsx` (nuevo): solo R13.
  - `src/__tests__/pairing-canvas-fidelity.test.ts` (nuevo): R11 y R12.
  - `src/i18n/catalog.ts`: sin cambios (D5 a).
  - `src/__tests__/ui-copy-table.ts`: solo si falta una clave; las cuatro de `pairing` ya están.
- Presentación, compartidos (confirmados al firmar):
  - `src/screens/welcome/index.tsx`: consume `PingRing` (D3). Sin cambio de comportamiento (R13).
  - `src/theme/global.css`: token `--text-24: 24px` (D4 a).
- Documentación, no código:
  - `docs/conventions.md`: sin cambios; la excepción «fidelidad al canvas, 2026-10-13» ya cubre D6 (a).
  - `docs/ui-guidelines.md`: enmienda de anillos (texto arriba), la escribe el leader.
- Sin cambios: `src/app/pairing.tsx`, `src/app/_layout.tsx` (ruta con `title: ''`), `src/components/pingo-float.tsx`, `src/theme/motion.ts` y `src/screens/alert-detail/ping-ring.tsx`.

## Dependencias y coordinación

- **#177 (receta del botón, mergeada)**: en `origin/main` desde cbd964da (PR #231); no bloquea el cierre. El botón `pairing-submit` recibe su receta de #177; #188 no la redefine ni la prueba. Orden: cumplido (#177 mergeada antes de cerrar #188).
- **#186 (input de código y FieldError global, pendiente)**: solapa con `activation-code-input`. D7 fija que #188 no toca el input.
- **#181 (cerrada)**: ya centra `pairing-no-pets`. #188 no lo toca (R14).
- **#178 (cerrada)**: origen del título de 24 px y peso 900 (D-H) y de la regla `--text-<px>`.
- **#187 (cerrada)**: regla de no poner `text-<n>` en componentes de heroui-native (R7).
- **#171 (cerrada)**: celebración `pairing-ready`, sin cambios.
- **#167 (cerrada)**: precedente de anillos en welcome; la enmienda de anillos lo acota a la vinculación.

## Alternativas descartadas

- **Copia local de `PingRing` en `pairing`**: duplica el componente de welcome y deriva con el tiempo.
- **Animar `width`, `height` o `borderWidth`**: incumple la regla de `transform` y `opacity`. Los anillos escalan.
- **Lottie o Skia para los anillos**: dependencia nueva para dos círculos. Reanimated basta.
- **Título con `text-2xl`**: no hay token `--text-2xl` y se incumple `--text-<px>`.
- **Título con `text-26`**: token existente, pero 2 px por encima de D-H. Descartado en D4 (b).
- **Anillos de 260 px como en welcome**: el artboard fija 150 px.
- **Subtítulo inventado**: incumple «no inventar copy». Solo cabe con clave aprobada (D5 b).
- **Margen de 20 px sin excepción nombrada**: incumple la regla de `conventions.md` (D6 a exige la excepción).
- **Stepper de #170 dentro de #188**: fuera de alcance (D1).
