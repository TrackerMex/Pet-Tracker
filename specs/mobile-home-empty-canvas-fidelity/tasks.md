---
feature: "mobile-home-empty-canvas-fidelity"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-home-empty-canvas-fidelity]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.

Precondiciones de la fase (2) (ver [[design]] §Dependencias y precondiciones):

- Fase (2) de R6 y R7: Enmienda #176 aprobada por humano en `docs/ui-guidelines.md`.
- Fase (2) de R12: #177 mergeada en origin/main.

Sin la enmienda no se implementan R6 y R7. Sin #177 no se implementa R12. El resto no depende de ellas.

Convención de valores: los valores esperados van como literales en cada test, copiados de la spec o de origin/main. No se importan de `src/theme/`: un candado que compara con el mismo símbolo que usa el código es tautológico.

## R1 — Variante default sin cambios (no regresión)

- [ ] (1) Escribir test que falla para R1: el test de caracterización nace verde (fija el estado actual antes de tocar el componente) en `src/components/__tests__/empty-state.test.tsx`. Sin `variant`: pose 160×160, título `text-lg font-bold`, CTA sin icono y amplitud de flotación actual (4 px). Debe seguir verde tras (2) y (3).
- [ ] (2) Implementación mínima que lo pasa: prop `variant?: 'default' | 'hero'` con `default` por defecto, sin cambios en el render de `default`.
- [ ] (3) Refactor con tests verdes: separar las ramas por variante sin cambiar valores.

## R2 — Inicio usa la variante hero

- [ ] (1) Escribir test que falla para R2 en `src/screens/home/index.test.tsx`: con `EmptyState` mockeado, sin mascota seleccionada recibe `variant: 'hero'` y `testID: 'home-empty'`. Candado de alcance: `grep -rn 'variant="hero"' mobile-pet-tracker/src/screens` devuelve solo `home/index.tsx`.
- [ ] (2) Implementación mínima que lo pasa: `variant="hero"` en el `EmptyState` de `src/screens/home/index.tsx`.
- [ ] (3) Refactor con tests verdes.

## R3 — Composición y padding lateral

- [ ] (1) Escribir test que falla para R3 en `src/screens/home/index.test.tsx`: `home-no-pets-screen` tiene `px-5` y `py-6`, no tiene `p-6`, y su primer hijo es `home-empty`.
- [ ] (2) Implementación mínima que lo pasa: `p-6` por `px-5 py-6` en el contenedor.
- [ ] (3) Refactor con tests verdes.

## R4 — Pose de 190 px

- [ ] (1) Escribir test que falla para R4 en `src/components/__tests__/empty-state.test.tsx`: `home-empty-pose` mide 190×190 px en la variante `hero`.
- [ ] (2) Implementación mínima que lo pasa: la variante `hero` aplica 190×190 a la imagen y a su contenedor.
- [ ] (3) Refactor con tests verdes: una sola constante de tamaño por variante, sin literales de color.

## R5 — Escenario: sombra de suelo y huella

- [ ] (1) Escribir test que falla para R5 en `src/components/__tests__/empty-state.test.tsx`: `home-empty-stage-shadow` tiene color `'rgba(13,17,23,0.10)'` y `home-empty-stage-paw` tiene opacidad `0.18`. Los valores van escritos en el test.
- [ ] (2) Implementación mínima que lo pasa: crear `src/theme/pingo-stage.ts` con las dos constantes; la variante `hero` las usa y dibuja la huella con `react-native-svg`.
- [ ] (3) Refactor con tests verdes.

## R6 — Flotación con PingoFloat

- [ ] (1) Escribir test que falla para R6 en `src/components/__tests__/empty-state.test.tsx`: la pose está dentro de `home-empty-float` y, a 1500 ms, el `translateY` vale -10. Con `toHaveAnimatedStyle` se listan todas las claves esperadas (o se usa `shouldMatchAllProps`), para que una propiedad colada no pase en verde. Con la variante `default` no hay `PingoFloat`.
- [ ] (2) Implementación mínima que lo pasa: envolver la pose en `PingoFloat` en la variante `hero`. Precondición: Enmienda #176 aprobada.
- [ ] (3) Refactor con tests verdes.

## R7 — Reduce motion

- [ ] (1) Escribir test que falla para R7 en `src/components/__tests__/empty-state.test.tsx`: con reduce motion activado (mock igual que en `pingo-float.test.tsx`), a 1500 ms el `translateY` sigue en 0 y el escenario, el título, el cuerpo y el CTA tienen sus valores finales en el primer render.
- [ ] (2) Implementación mínima que lo pasa: condicionar la flotación (R6) y la entrada (R13) al flag de reduce motion. Precondición: Enmienda #176 aprobada.
- [ ] (3) Refactor con tests verdes.

## R8 — Título 26/900 con tracking

- [ ] (1) Escribir test que falla para R8 en `src/components/__tests__/empty-state.test.tsx`: `home-empty-title` tiene `text-26`, `font-black`, `tracking-title`, `text-center` y `text-foreground`.
- [ ] (2) Implementación mínima que lo pasa: clases en la rama `hero`.
- [ ] (3) Refactor con tests verdes.

## R9 — Cuerpo 15 px con ancho máximo 290

- [ ] (1) Escribir test que falla para R9 en `src/components/__tests__/empty-state.test.tsx`: `home-empty-body` tiene `text-15`, `text-center`, `text-muted` y `maxWidth: 290`.
- [ ] (2) Implementación mínima que lo pasa: clases y `style={{ maxWidth: 290 }}` en la rama `hero`.
- [ ] (3) Refactor con tests verdes.

## R10 — Copy sin cambios

- [ ] (1) Escribir test de caracterización (nace verde) en `src/screens/home/index.test.tsx`: título, cuerpo y etiqueta del CTA del Inicio sin mascota son los literales de origin/main, copiados en el test.
- [ ] (2) Ninguna implementación. Si el test se pone rojo, el cambio tocó el copy y hay que revertirlo.
- [ ] (3) Refactor: ninguno sobre texto.

## R11 — Grep-clean (ui-guidelines §3)

- [ ] (1) Escribir la comprobación antes del cambio: plantar `shadowColor: '#0D1117'` en el objeto `style` de `src/components/empty-state.tsx` (zona fuera de `className`, la que un candado de clases no mira). El comando de abajo debe fallar; después se revierte y debe quedar vacío.
- [ ] (2) Implementación mínima que lo pasa: sin literales en los ficheros tocados; colores y opacidades desde `src/theme/pingo-stage.ts`.
- [ ] (3) Refactor con el comando en verde.

Comando (desde la raíz de la worktree):

`grep -nE 'rgba?\(|#[0-9A-Fa-f]{3,8}\b|className="[^"]*\[|StyleSheet\.create|shadowColor|shadowOffset|shadowOpacity|shadowRadius|elevation' mobile-pet-tracker/src/components/empty-state.tsx mobile-pet-tracker/src/screens/home/index.tsx`

Salida esperada: vacía. No escribir `#NNN` en comentarios de esos ficheros: el patrón hex también los cuenta.

## R12 — CTA a todo el ancho con icono

- [ ] (1) Escribir test que falla para R12 en `src/components/__tests__/empty-state.test.tsx`: `home-empty-action` tiene `w-full` y `mt-2.5`; `home-empty-action-icon` es el primer hijo, antes de la etiqueta.
- [ ] (2) Implementación mínima que lo pasa: `w-full`, icono `Plus` de `reicon-react-native` a 20 px y `mt-2.5`. La etiqueta usa `Label.Text` según #187. Precondición: #177 mergeada.
- [ ] (3) Refactor con tests verdes.

## R13 — Entrada escalonada

- [ ] (1) Escribir test que falla para R13 en `src/components/__tests__/empty-state.test.tsx`, con fake timers: con reduce motion desactivado, los retrasos de escenario, título, cuerpo y CTA son 0, 60, 120 y 180 ms; el estado inicial es opacidad 0 con 12 px de desplazamiento y el final es opacidad 1 con 0 px.
- [ ] (2) Implementación mínima que lo pasa: `withDelay` con `withTiming` (`MOTION_FADE_TIMING` para la opacidad) y desplazamiento desde `MOTION_ENTRANCE_OFFSET_Y`.
- [ ] (3) Refactor con tests verdes.

## Cierre

- [ ] Trazabilidad: las 13 filas de `traceability.md` con test y commit reales.
- [ ] Smoke en dispositivo (dev build Android, no Expo Go): lo corre el humano, fuera del ciclo automatizado.
