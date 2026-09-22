# Implementación #109 — mobile-meal-toggle-source-lock-nesting

Fecha: 2026-09-22  
Rama: `feature/109-mobile-meal-toggle-source-lock-nesting`  
Base: `73f14d5e`

## Resultado

El candado de fuente de `meal-toggle` recorta ahora solo su tag de apertura,
de `<` a `<` alrededor del ancla. No se cambió la regex. La mutación V4 se
versionó en el commit rojo `97f78f41` y se revirtió en el verde `869441b9`;
el diff acumulado de producción es vacío.

## Diez sondas medidas

Todas las corridas usaron:

```bash
bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx'
```

En V1–V7 se usó además `--silent` para omitir los avisos conocidos de la
suite; no se usaron pipes y el exit code se capturó directamente.

| # | Estado / mutación | Esperado | Medido | Exit |
|---|---|---|---|---:|
| 1 | V4 con el recorte viejo | El candado de fuente queda verde y reproduce el agujero; la pata de árbol queda roja | El `it` viejo de fuente pasó; falló solo `#107 R5` por `Received: undefined` | 1 |
| 2 | V4 con el recorte nuevo, estado rojo | Rojo propio de `#109 R1` y rojo de la pata de árbol | 2 fallos: `#109 R1` por `toMatch` y `#107 R5` por opacidad ausente | 1 |
| 3 | Producción restaurada, recorte nuevo | Verde | 1 suite y 38 tests verdes | 0 |
| 4 | V1 — receta quitada | Rojo en `#109 R1` | 2 fallos; `#109 R1` falló por `toMatch`, no por error incidental | 1 |
| 5 | V2 — receta en hermano anterior | Rojo en `#109 R1` | 2 fallos; `#109 R1` falló por `toMatch`, no por error incidental | 1 |
| 6 | V3 — receta en hermano posterior | Rojo en `#109 R1` | 2 fallos; `#109 R1` falló por `toMatch`, no por error incidental | 1 |
| 7 | V4 — receta en `Pressable` anidado | Rojo en `#109 R1` | 2 fallos; `#109 R1` falló por `toMatch`, no por error incidental | 1 |
| 8 | V5 — `Pressable` anidado sin receta; receta propia intacta | Verde | 1 suite y 38 tests verdes | 0 |
| 9 | V6 — receta en una sola línea | Verde | 1 suite y 38 tests verdes | 0 |
| 10 | V7 — `0.8` cambia a `0.5` | Rojo solo en `#109 R1`; pata de árbol verde | 1 fallo (`#109 R1` por `toMatch`) y 37 tests verdes | 1 |

`food.tsx` se restauró y su diff contra la base se comprobó vacío entre
cada sonda.

## Gates finales

| Comando | Resultado medido |
|---|---|
| `bunx jest` | exit `0`; 77/77 suites, 1396/1396 tests y 1/1 snapshot |
| `bunx tsc --noEmit` | exit `0` después de eliminar `.expo/types/router.d.ts` |

No se ejecutó `./init.sh`, por instrucción expresa del handoff.

## Diff de producción

Salida literal de
`git diff 73f14d5e -- 'mobile-pet-tracker/src/app/(tabs)/food.tsx'`
(el bloque está vacío):

```text
```

`git diff --stat 73f14d5e -- 'mobile-pet-tracker/src/'` midió un solo fichero:
`src/app/(tabs)/__tests__/food.test.tsx`.

## Delta contra `73f14d5e`

| Medida | Delta |
|---|---:|
| Suites | +0 |
| Tests | +0 |

Medición: el conjunto de ficheros `*.test.*` / `*.spec.*` entre el árbol de
Git de `73f14d5e` y HEAD no cambia, y la única suite modificada conserva el
mismo número de declaraciones `it` / `it.each`; se renombra un `it`, no se
añade ni se elimina ninguno.

## Preflight y decisiones

- `expo-overview` no existía en el catálogo de skills disponible; no se dio
  por cargada ni se sustituyó por otra. Se leyó la documentación oficial
  versionada de Expo SDK 57 antes de editar.
- Decisiones no cerradas por la spec: ninguna.
- No se tocó `src/screens/home/index.test.tsx`, ningún fichero de i18n ni
  ninguna dependencia.
