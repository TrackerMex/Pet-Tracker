# Implementación — mobile-tab-indicator-out-of-range (#91)

Fecha: 2026-09-13

Branch: `feature/91-mobile-tab-indicator-out-of-range`  
Base verificada: `072cff40` es ancestro de `HEAD`.

## R6 — Nada más se mueve

| Candado | Comprobación | Resultado frente a `072cff40` |
|---|---|---|
| Geometría del indicador | Las aserciones heredadas conservan ancho de layout `360`, `width: 68.8`, `translateX: 137.6` para índice 2 y `translateX: 68.8` para índice 1. `git diff -U0` no elimina ni modifica ninguna de ellas. | **PASS — delta 0** |
| `TAB_INDICATOR_SPRING` | Producción conserva `duration: 250`, `dampingRatio: 1` y `ReduceMotion.System`; sus pruebas heredadas pasan. | **PASS — delta 0** |
| Cinco pestañas, sin `alerts` | `TABS` tiene 5 entradas y no contiene `alerts`; `_layout.tsx` mantiene 5 `<Tabs.Screen>` y no registra `alerts`. | **PASS — delta 0** |
| Longitud del catálogo de idiomas | `Object.keys(en).length === 302` y `Object.keys(es).length === 302`; no hay diff en el catálogo. | **PASS — +0 claves** |
| Copy `R2_TABS` | La tabla conserva 5 filas y `ui-language.test.ts` mantiene su aserción en 5. | **PASS — delta 0** |
| `text-accent-strong` | `floating-tab-bar.tsx` conserva 1 ocurrencia y el candado `inkSites` conserva su suma declarada de 14. El barrido global da 15 tanto en la base como en `HEAD` por la ocurrencia heredada de `weekly-activity-chart.tsx`, fuera de `inkSites`. | **PASS — delta 0** |
| Escala de radios | Producción mantiene 0 ocurrencias de `rounded-2xl`, `rounded-lg`, `rounded-md` y `rounded-sm`; #91 no modifica ninguna `className`. | **PASS — delta 0** |
| Dependencias | `mobile-pet-tracker/package.json` no tiene diff. | **PASS — 0 dependencias** |
| Grep-clean | Fuera de `src/theme/`: 0 hex; producción: 0 clases arbitrarias, 0 `StyleSheet.create` y 0 propiedades legacy `shadowColor`/`shadowOffset`/`shadowOpacity`/`shadowRadius`/`elevation`. | **PASS — delta 0** |

Verificación ejecutada desde la raíz:

- `./init.sh`: exit 0; backend 165 suites/1268 tests, infra 2 suites/14 tests,
  móvil 73 suites/1236 tests, e2e 25 suites/362 tests; build, lint y typecheck
  verdes.
- Candados móviles dirigidos: 6 suites/162 tests verdes; el candado de tabs,
  ejecutado por ruta exacta, 1 suite/3 tests verdes.
- `git diff --stat 072cff40..HEAD -- mobile-pet-tracker/`: exactamente
  `src/components/floating-tab-bar.tsx` y
  `src/components/__tests__/floating-tab-bar.test.tsx`.

