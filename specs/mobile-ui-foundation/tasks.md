---
feature: "mobile-ui-foundation"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-ui-foundation]]

> Disciplina TDD adaptada: el spike R6 es el ciclo rojo→verde que cubre toda
> la configuración nacida verde (ver [[requirements]] §Excepción a C4).
> **Commits test-primero explícitos**: el commit del spike ROJO precede en el
> historial a cualquier commit de deps/config — el reviewer rechaza si no hay
> historial rojo→verde (C4, lección de #19). Orden obligatorio: la Tarea 1
> completa ANTES de tocar `src/app/index.tsx`.

## Tarea 1 — Spike: el stack renderiza en jest (R6, R1, R2, R3, R8)

- [ ] (1) **Test rojo**: escribir
      `src/components/__tests__/heroui-smoke.test.tsx` (`describe('R6: ...')`,
      Button de heroui con className + onPress + reicon por subpath, asserts
      no vacíos según R6). Correr `bun run --cwd mobile-pet-tracker test` →
      falla ("Cannot find module 'heroui-native'"). **Commit del rojo**
      (`test(mobile-ui-foundation): red spike for HeroUI stack (R6)`).
- [ ] (2) **Implementación mínima**, en commits separados y este orden:
      1. Deps R1 (comandos exactos de [[requirements]] R1) —
         `feat(mobile-ui-foundation): add UI stack deps (R1)`.
      2. `metro.config.js` (D2) + `src/theme/global.css` (D6) —
         `feat(mobile-ui-foundation): uniwind metro + theme tokens (R2,R3)`.
      3. Bloque jest + `jest/css-stub.js` + `jest-setup.js` (D5) → el spike
         se pone VERDE — `test(mobile-ui-foundation): jest config for UI stack (R8,R6)`.
- [ ] (3) Refactor con tests verdes (limpiar lo que el spike descubrió;
      anotar en `progress/impl_mobile-ui-foundation.md` cualquier paquete
      extra añadido a `transformIgnorePatterns`).

## Tarea 2 — Tipos de className (R4)

- [ ] (1) Guarda: `bun run --cwd mobile-pet-tracker typecheck` ANTES de
      generar el dts — si ya usara `className` en código, debe fallar (rojo
      natural); si no falla, anotar que la guarda nace verde aquí y queda
      cubierta por R6+R7.
- [ ] (2) Añadir script `generate:styles` a `package.json`, ejecutarlo,
      commitear `src/uniwind-types.d.ts` generado.
- [ ] (3) `typecheck` verde sin Metro corriendo.

## Tarea 3 — Provider raíz (R5)

- [ ] (1) Guarda existente: suite de #31 verde antes de tocar el layout.
- [ ] (2) `src/app/_layout.tsx` exactamente como [[design]] §D3 (css import
      primero, GestureHandlerRootView → HeroUINativeProvider → Stack).
- [ ] (3) Suite completa verde de nuevo (si el provider rompe los tests de
      `index.test.tsx`, arreglar la config de R8, no los asserts).

## Tarea 4 — Migración health screen (R7)

- [ ] (1) Guarda: los tests de `src/app/__tests__/index.test.tsx` son el
      rojo→verde histórico de #31 — correrlos verdes antes de empezar
      (refactor bajo verde, sin nuevo test rojo; excepción anotada).
- [ ] (2) Migrar `src/app/index.tsx` según [[design]] §D7 (Button heroui con
      `testID="health-retry"`, className + `stateClasses`, cero
      `StyleSheet.create`), **sin tocar los asserts de los tests**.
- [ ] (3) Suite completa + lint + typecheck verdes; grep de `StyleSheet` en
      `index.tsx` vacío.

## Tarea 5 — eas.json (R9)

- [ ] (1) Sin test posible (config para una CLI que corre el humano) —
      excepción C4 declarada en la spec.
- [ ] (2) Crear `eas.json` exactamente como [[design]] §D8.
- [ ] (3) `bun run --cwd mobile-pet-tracker lint` sigue verde (el archivo no
      rompe nada).

## Tarea 6 — Documentación y cierre (R10, R11)

- [ ] (1) —
- [ ] (2) Sección "Convenciones de la app móvil" en `docs/conventions.md`
      con el contenido mínimo de R10; actualizar
      [[traceability]] con tests y hashes reales;
      escribir `progress/impl_mobile-ui-foundation.md`.
- [ ] (3) Verificación de contención R11:
      `git diff --stat main...HEAD -- backend-pet-tracker/` vacío;
      `./init.sh` completo verde.

## Gate humano (R12) — NO es tarea de Codex

- [ ] Dev build compilado (`bunx expo run:android` o EAS) e instalado en
      Android físico.
- [ ] Smoke R12 completo: estilos HeroUI, light↔dark, retry, `unreachable`.
- [ ] Feedback estético de la paleta D6 (si lo hay) → follow-up, no bloquea.
