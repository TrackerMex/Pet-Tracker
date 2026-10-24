---
feature: "mobile-jest-virtual-mock-poisoning"
status: approved     # draft | spec_ready | approved
tags: [mobile, test-infra, spec]
---

# Trazabilidad — [[mobile-jest-virtual-mock-poisoning]]

> Una fila por requisito. Las rutas son relativas a `mobile-pet-tracker/`. La columna de
> commits se rellena al implementar (hashes completos de A a F de [[tasks]]) y se
> deja intacta si un rebase los invalida: se reapuntan, no se reescriben a mano.

| Requisito | Test (archivo::describe::it) | Commits verificados |
|---|---|---|
| R1 | `src/__tests__/jest-virtual-mock-lock.test.ts::#207 R1: los cuatro tests registran su módulo real sin la opción virtual::cada uno conserva su jest.mock y no pasa la opción virtual` | pendiente |
| R2 | `src/__tests__/jest-virtual-mock-lock.test.ts::#207 R2: ningún test móvil pasa la opción virtual de jest.mock::ningún test móvil pasa la opción virtual`; `src/__tests__/jest-virtual-mock-lock.test.ts::#207 R2: ningún test móvil pasa la opción virtual de jest.mock::el recorrido incluye al propio candado` | pendiente |

## Hashes y mensajes

| Fase | Hash | Mensaje |
|---|---|---|
| A | pendiente | `test(mobile): candado de la opción virtual de jest.mock (R1,R2)` |
| B | pendiente | `test(mobile): quita la opción virtual de los cuatro tests (R1,R2)` |
| C | pendiente | `test(mobile): mutaciones de datos del candado (R1,R2)` |
| D | pendiente | `test(mobile): revierte mutaciones de datos del candado (R1,R2)` |
| E | pendiente | `test(mobile): mutaciones del recorrido del candado (R2)` |
| F | pendiente | `test(mobile): revierte mutaciones del recorrido del candado (R2)` |

R1: rojo por aserción en A (cuatro violaciones), verde en B; su mitad (a) se cierra con M-R1a
(rojo en C, verde en D). R2: primer `it` rojo por aserción en A y verde en B; segundo `it` nace
verde en A y se cierra con M-R2e y M-R2f (rojo en E, verde en F); M-R2a..d (rojo en C, verde en D)
prueban que el barrido ve `(tabs)`, `.ts` fuera de `__tests__`, `doMock`, clave entre comillas y
al propio candado.

Criterios de cierre: CC1 a CC6 sin medir (pendiente). CC4 lo mide el leader con `./init.sh`.
