# Implementación #108 — design-drift-hex-guard-rid

Fecha: 2026-09-22  
Branch: `feature/108-design-drift-hex-guard-rid`  
Base medida contra `origin/main`: `2a9219b317f845f2c688fd90f281985de058a8c9`

## Recuentos

| Medida | Base | Cierre | Delta |
|---|---:|---:|---:|
| Suites móviles | 77 | 77 | 0 |
| Tests móviles | 1398 | 1412 | +14 |
| Tests de `design-drift.test.ts` | 41 | 55 | +14 |
| Describes de `design-drift.test.ts` | 17 | 21 | +4 |

Reparto de los 14 tests: R1=2, R2=8, R3=3, R4=1. `bunx tsc --noEmit`
terminó con exit 0. El grep de `'#' + '106` quedó sin aciertos y
el grep de `#106 R2` encuentra el describe entero de Home y el candado de R2.

## Commits por requisito

| R-id | Rojo | Verde |
|---|---|---|
| R1 | `74c7cd29` | `cd1b262a` |
| R2 | `63908134` | `0a56ddf9` |
| R3 | `ed7a1895` | `c9a5561d` |
| R4 | `75b4d0d3` | `7c719c17` |

R3 tiene además el commit de candado `69d5bd5f`: construye por concatenación
la aguja que busca el workaround, para que el propio test no sea un acierto del
grep de cierre.

## Sondas de mutación

- Sin la lookahead de `HEX_LITERAL`, `#108 R2` terminó con exit 1: F1 falló
  por `Expected: false`, `Received: true`; las otras siete filas pasaron.
- Cambiando el esperado de R1 de 1 a 2, `#108 R1` terminó con exit 1: las dos
  filas fallaron por `Expected: 2`, `Received: 1`.
- Ambas mutaciones se restauraron sin commit.

## Desviaciones y entorno

- La base real fue 1398, no los 1396 históricos de la spec, porque #110 ya
  estaba integrada. Se aplicó el delta firmado de +14.
- Se añadió `69d5bd5f` después de los ocho commits prescritos: el grep exacto
  detectó la aguja literal del propio test de R3. No cambia cobertura ni
  recuentos; elimina ese falso positivo.
- La primera corrida final completa tuvo un fallo intermitente ajeno en
  `src/screens/health/index.test.tsx` R6 (`weight-current` aún no visible).
  La suite aislada pasó 28/28 y la repetición completa pasó 77/1412.
- El worktree llegó limpio pero asociado a `feature/111-mobile-flaky-waits`;
  el worktree anterior de #108 estaba limpio, se dejó detached en `6c832281`
  y esta ruta se asoció a la branch solicitada antes de editar.
- `expo-overview` no estaba expuesta en el catálogo de skills de esta sesión.
  La spec ya documenta que no deriva a ninguna leaf para este cambio sin UI,
  navegación, motion ni dependencias. Se cargó Ponytail y se siguió la carta
  móvil del repositorio.
- No se ejecutó `./init.sh`, por instrucción expresa de #108.
