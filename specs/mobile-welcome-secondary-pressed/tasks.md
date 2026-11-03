---
feature: "mobile-welcome-secondary-pressed"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-welcome-secondary-pressed]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Commits test-primero:
> el commit rojo de cada R va **antes** que su implementación (C4).
>
> **T0 (antes de editar nada):** desde `mobile-pet-tracker/`, medir las cuentas de
> «Evidencia» (`grep -cF`) y la suite de Bienvenida y de los dos guards en verde,
> y guardar la salida en `progress/impl_mobile-welcome-secondary-pressed.md`.
>
> Orden de commits: (a) los `it` rojos de R1, R3, R4 y las filas enmendadas de R6
> (el rojo es el pin nuevo contra el tag viejo); (b) un único commit de
> producción que pone `variant="outline"` y `NEW_CLASSES`; (c) refactor. R2 nace
> verde (prueba de contrato de librería): su mutación plantada demuestra que
> puede fallar; no cuenta como rojo de arranque.

## R1 — Secundario declara `variant="outline"` sin `animation`/`feedbackVariant`; primario sin variant

- [ ] (1) Escribir test que falla para R1 (dos `it` en `describe('R8')` de `src/screens/welcome/index.test.tsx`)
- [ ] (2) Implementación mínima que lo pasa (`variant="outline"` en `welcome-have-account`)
- [ ] (3) Refactor con tests verdes (+ mutaciones a, b, c, d de R1 y revertir)

## R2 — Contrato de HeroUI: outline pinta `default-hover`, primary `accent-hover`

- [ ] (1) Escribir test de contrato `describe('#231 R2')` leyendo `node_modules/heroui-native/src/components/button/button.tsx` (nace verde; verificar con la mutación plantada que falla)
- [ ] (2) Sin implementación de producción (el contrato lo da la librería); confirmar la mutación en copia de `button.tsx` y restaurarla con `cp`
- [ ] (3) Refactor con tests verdes (el `it` falla ruidoso si cambia la estructura del `switch`)

## R3 — Borde oscuro `dark:border-muted` al final de la receta; claro intacto

- [ ] (1) Escribir test que falla para R3 (Test A en `welcome/index.test.tsx`; Test B `inventory(/dark:border-/g)` en `chunky-cta-canvas-fidelity.test.ts`)
- [ ] (2) Implementación mínima que lo pasa (`className` = `NEW_CLASSES`)
- [ ] (3) Refactor con tests verdes (+ mutaciones a, b, c de R3 y revertir; la c va a `screens/home/index.tsx`)

## R4 — Contraste del token del borde oscuro >= 3:1 frente a `surface` y `background`

- [ ] (1) Escribir test que falla para R4 (`describe('#231 R4')` en `src/theme/__tests__/global-css.test.ts`; token extraído de `welcome/index.tsx`; nace rojo si se escribe antes del tag nuevo, porque no hay `dark:border-*` aún)
- [ ] (2) Implementación mínima que lo pasa (ya cubierta por R3 (2); no añade código)
- [ ] (3) Refactor con tests verdes (+ mutaciones a, b, c, d de R4 y revertir; la d se hace sobre `global.css`)

## R5 — Resto de «Ya tengo una cuenta» y de la pantalla sin cambio

- [ ] (1) Confirmar que los `it` existentes (R8 login, orden de `welcome-rise-actions`, `#166 R3`, `#177 R4.1`, `#177 R4.2`) están en la lista de la suite antes de editar
- [ ] (2) Sin implementación: no tocar `style`, `onPress`, `testID`, etiqueta ni hermanos
- [ ] (3) Refactor con tests verdes; `git diff --name-only <base>..HEAD` solo lista los ficheros de «Archivos afectados»

## R6 — Pins enmendados con sufijo `(enmendado por #231 R1, R3)`

- [ ] (1) Escribir test que falla para R6 (`it('#231 R6 …')` de lectura de fuente; y las tres filas/aserciones enmendadas, rojas contra el tag viejo)
- [ ] (2) Implementación mínima que lo pasa (las enmiendas + sufijo en los títulos)
- [ ] (3) Refactor con tests verdes; suite completa de `mobile-pet-tracker/` y T0 recomputado

## R7 — Enmienda `## Enmienda #231` en `docs/ui-guidelines.md` (gate G4)

- [ ] (0) **No empezar** hasta que el humano marque la casilla G4 de [[requirements]] § Aprobación; si Codex termina R1 a R6 antes, deja R7 `pendiente` y lo dice en `progress/impl_mobile-welcome-secondary-pressed.md`
- [ ] (1) Escribir test que falla para R7 (`it('#231 R7 …')` en `welcome/index.test.tsx`, lee `../docs/ui-guidelines.md`)
- [ ] (2) Implementación mínima que lo pasa (la sección exacta de R7, al final del fichero, con la casilla sin marcar)
- [ ] (3) Refactor con tests verdes (+ mutación `6,81:1` → `6,8:1`)
