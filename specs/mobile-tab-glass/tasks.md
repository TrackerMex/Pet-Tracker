---
feature: "mobile-tab-glass"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-tab-glass]] (feature #50)

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Commits test-primero
> explícitos: el commit del test rojo precede (o acompaña separadamente) al
> de la implementación — historial rojo→verde exigido por C4.
> Paso 0 (sin commit): verificar que `expo-glass-effect` y `expo-blur`
> resuelven en node_modules (`npx expo install expo-glass-effect expo-blur`).

## R1 — GlassView cuando liquid glass está disponible

- [x] (1) Escribir test que falla para R1 (mocks de [[design]]; branch true/false)
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R2 — Fallback BlurView + overlay translúcido + tokens glass

- [x] (1) Escribir test que falla para R2 (props exactos del BlurView, overlay, tokens en global-css.test.ts)
- [x] (2) Implementación mínima que lo pasa (tokens en global.css incluidos)
- [x] (3) Refactor con tests verdes

## R3 — Pill dimensionado y posicionado tras layout

- [x] (1) Escribir test que falla para R3 (fireEvent layout 360 → ancho 68.8, translateX index×68.8; sin layout no hay pill)
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R4 — Spring interruptible al cambiar de tab

- [x] (1) Escribir test que falla para R4 (rerender con nuevo index → toHaveAnimatedStyle destino; retarget en vuelo; TAB_INDICATOR_SPRING duration 250 / dampingRatio 1)
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R5 — Reduced motion en la config del spring

- [x] (1) Escribir test que falla para R5 (`TAB_INDICATOR_SPRING.reduceMotion === ReduceMotion.System`)
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R6 — animation 'fade' en el layout de Tabs

- [x] (1) Escribir test que falla para R6 (`tabs-layout.test.tsx` nuevo, mocks de [[design]])
- [x] (2) Implementación mínima que lo pasa (una línea en `_layout.tsx`)
- [x] (3) Refactor con tests verdes

## R7 — Comportamiento existente conservado (regresión)

> Sin test rojo nuevo: el test ES la suite existente de
> `floating-tab-bar.test.tsx` (describes "R7"/"R8" de la spec original), que
> debe seguir verde en cada paso de R1–R5 sin relajar aserciones.

- [ ] (1) Confirmar suite existente verde antes de tocar el componente
- [ ] (2) Mantenerla verde durante toda la implementación
- [ ] (3) Refactor final con `npm test` + `npm run typecheck` + `npm run lint` verdes

## Cierre

- [ ] Grep-clean C8: cero hex fuera de `src/theme/`, cero clases `[...]`,
      cero `StyleSheet.create`, cero shadow/elevation legacy
- [ ] Actualizar [[traceability]] tras cada commit
- [ ] `progress/impl_mobile-tab-glass.md` con el reporte
