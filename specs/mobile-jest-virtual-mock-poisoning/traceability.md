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
| R1 | `src/__tests__/jest-virtual-mock-lock.test.ts::#207 R1: los cuatro tests registran su módulo real sin la opción virtual::cada uno conserva su jest.mock y no pasa la opción virtual` | `4500e89b3b794f50439f5adb1f036c3fce002100` (rojo), `c56e7bc7995e1380db02e40029bc504bb9eb9da6` (verde), `d223bc707d1294bd6c8b6a6cbee517aaa36ab524` (mutación M-R1a, rojo), `01d8d2e00313f2db872a5a30f4af8d7cc38e0cab` (verde) |
| R2 | `src/__tests__/jest-virtual-mock-lock.test.ts::#207 R2: ningún test móvil pasa la opción virtual de jest.mock::ningún test móvil pasa la opción virtual`; `src/__tests__/jest-virtual-mock-lock.test.ts::#207 R2: ningún test móvil pasa la opción virtual de jest.mock::el recorrido incluye al propio candado` | `4500e89b3b794f50439f5adb1f036c3fce002100` (rojo), `c56e7bc7995e1380db02e40029bc504bb9eb9da6` (verde), `d223bc707d1294bd6c8b6a6cbee517aaa36ab524` (M-R2a..d, rojo), `01d8d2e00313f2db872a5a30f4af8d7cc38e0cab` (verde), `bffd1e88950b7981f8523f91db31ac743fb750b3` (M-R2e,f, rojo), `f96d4f951adce5df33a36d5c04cd3324e6aee94d` (verde) |

## Hashes y mensajes

| Fase | Hash | Mensaje |
|---|---|---|
| A | `4500e89b3b794f50439f5adb1f036c3fce002100` | `test(mobile): candado de la opción virtual de jest.mock (R1,R2)` |
| B | `c56e7bc7995e1380db02e40029bc504bb9eb9da6` | `test(mobile): quita la opción virtual de los cuatro tests (R1,R2)` |
| C | `d223bc707d1294bd6c8b6a6cbee517aaa36ab524` | `test(mobile): mutaciones de datos del candado (R1,R2)` |
| D | `01d8d2e00313f2db872a5a30f4af8d7cc38e0cab` | `test(mobile): revierte mutaciones de datos del candado (R1,R2)` |
| E | `bffd1e88950b7981f8523f91db31ac743fb750b3` | `test(mobile): mutaciones del recorrido del candado (R2)` |
| F | `f96d4f951adce5df33a36d5c04cd3324e6aee94d` | `test(mobile): revierte mutaciones del recorrido del candado (R2)` |

R1: rojo por aserción en A (cuatro violaciones), verde en B; su mitad (a) se cierra con M-R1a
(rojo en C, verde en D). R2: primer `it` rojo por aserción en A y verde en B; segundo `it` nace
verde en A y se cierra con M-R2e y M-R2f (rojo en E, verde en F); M-R2a..d (rojo en C, verde en D)
prueban que el barrido ve `(tabs)`, `.ts` fuera de `__tests__`, `doMock`, clave entre comillas y
al propio candado.

Criterios de cierre medidos por el implementer en `progress/impl_mobile-jest-virtual-mock-poisoning.md`: CC1 (A y B), CC2, CC3 y CC5. CC4 lo mide el leader con `./init.sh`; CC6 es este fichero.
