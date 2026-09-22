# Implementación — mobile-meals-bar-motion (#106 + #107)

Fecha: 2026-09-22  
Branch: `feature/106-mobile-meals-bar-motion`  
Base de comparación: `9df7b5bc`

## Resultado

Se implementaron los cinco requisitos en el orden prescrito
`R1 → R4 → R5 → R2 → R3`, con commit rojo anterior al verde para cada uno.
No se ejecutó `./init.sh`, no se abrió PR y ninguna de las dos entradas se
marcó `done`.

`expo-haptics` quedó resuelto por `bunx expo install expo-haptics` como
`expo-haptics@57.0.3`, declarado con el rango `~57.0.3`.

## Commits y lotes TDD

| R | Rojo | Resultado rojo | Verde | Resultado verde |
|---|---|---|---|---|
| R1 | `91adccde` | `food.test.tsx`: exit 1; 1 test nuevo rojo y 30 heredados verdes | `e14dd598` | `food.test.tsx`: 31/31; suite completa intermedia: 77 suites y 1370 tests verdes; typecheck exit 0 |
| R4 | `47945153` | `food.test.tsx`: exit 1; 4 tests de acción rojos y 32 verdes | `205d8682` | `food.test.tsx`: 36/36 |
| R5 | `8fb833c9` | `food.test.tsx`: exit 1; 2 tests rojos por ausencia del `style` y 36 verdes | `83a63821` | `food.test.tsx`: 38/38; diff neto de producción de R5 igual a cero |
| R2 | `a616ce07` | `index.test.tsx`: exit 1; los 2 candados declarados de #98 y el test nuevo rojos, 134 verdes | `03c68786` | `index.test.tsx`: 137/137 |
| R3 | `592a5046` | `index.test.tsx`: exit 1; solo el test nuevo rojo y 137 verdes | `3626b779` | `index.test.tsx`: 138/138 |

Trazabilidad registrada tras cada verde en `bef47ac0`, `bb9f6cb5`,
`9188c042`, `eba912a6` y `c5a239d1`. Todos los hashes rojos y verdes son
ancestros de `HEAD`.

Corrección posterior de los tests R2/R3: `624ec995`. Conserva en runtime los
nombres exactos `#106 R2: ...` y `#106 R3: ...`, pero separa `'#' + '106'` en
el fuente para que los cinco guardas históricos de drift no interpreten
`#106` como un color hexadecimal. `design-drift.test.ts`: 38/38 verde.

Lote afectado final:

```text
bunx jest --runTestsByPath 'src/screens/home/index.test.tsx' \
  'src/app/(tabs)/__tests__/food.test.tsx' \
  'src/screens/home/weekly-activity-chart.test.tsx' \
  'src/providers/__tests__/language-provider.test.tsx' --silent
exit 0 — 4 suites, 220 tests verdes
```

## Sondas de mutación

### R4 — resultado háptico

- Mutación: se sustituyó temporalmente el tipo `Success` de producción por
  `Error` en la rama exitosa.
- Resultado: `food.test.tsx` quedó rojo, exit 1; 1 suite roja, 3 tests de
  éxito fallaron y 33 tests quedaron verdes.
- Restauración: el fichero de producción volvió al contenido del verde y el
  diff de la mutación quedó vacío.

### R5 — feedback de pulsado

- Mutación: el commit rojo `8fb833c9` quitó de producción las tres líneas
  `style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}`.
- Resultado: `food.test.tsx` quedó rojo, exit 1; 1 suite roja, 2 tests
  fallaron y 36 quedaron verdes. Los fallos fueron exactamente la opacidad
  ausente en el árbol y la receta ausente del fuente.
- Restauración: `83a63821` repuso las tres líneas sin normalizarlas.
  `git diff --exit-code 378c7aa5..83a63821 -- 'mobile-pet-tracker/src/app/(tabs)/food.tsx'`
  devolvió exit 0.

### R2 — configuración de duración

- Mutación: la configuración entregada a `withTiming` usó temporalmente
  `duration: 251` en vez de `MEALS_BAR_TIMING` (`250`).
- Resultado: `index.test.tsx` quedó rojo, exit 1; 1 suite roja, 1 test falló
  por recibir `251` en vez de `250` y 136 quedaron verdes.
- Restauración: volvió la llamada `withTiming(mealsPct, MEALS_BAR_TIMING)`;
  `git diff --exit-code HEAD -- mobile-pet-tracker/src/screens/home/index.tsx`
  devolvió exit 0 antes de continuar.

## Candados de #98 movidos por R2

Solo se cambiaron los dos declarados por la spec; el candado de `className`
quedó idéntico.

| Candado | Valor anterior | Valor nuevo |
|---|---|---|
| relleno al 50 % | `expect(fill.props.style).toEqual({ width: '50%' });` | `expect(fill).toHaveAnimatedStyle({ width: '50%' });` |
| bucle 0/50/100 % | `expect((await screen.findByTestId('reminders-meals-fill')).props.style).toEqual({ width });` | `expect(await screen.findByTestId('reminders-meals-fill')).toHaveAnimatedStyle({ width });` |

## Verificación final y delta contra `9df7b5bc`

El fichero `.expo/types/router.d.ts` no existía antes del typecheck.

| Comando exacto | Exit code | Resultado |
|---|---:|---|
| `bunx jest` | 0 | 77/77 suites, 1379/1379 tests, 1 snapshot |
| `bunx tsc --noEmit` | 0 | sin diagnósticos |

Baseline medido en `9df7b5bc`: 77 suites y 1369 tests. Delta final:

- suites: **+0**;
- tests: **+10**;
- suites rojas: **+0**.

`grep -rn 'expo-haptics' docs/ui-guidelines.md` devuelve solo la redacción
nueva en la línea 171. Ninguna de las cinco specs históricas indicadas por la
aprobación fue modificada.

## Decisiones o incidencias no cerradas literalmente por la spec

1. El doble mínimo de Reanimated prescrito rompía animaciones compuestas de
   `PetHeroHeader`, `WeeklyActivityChart` y el `Animated.View` de HeroUI. Se
   amplió únicamente con identidades para `withRepeat`, `withSequence` y
   `withSpring`, el `default.View`/`__esModule` requerido por HeroUI y un
   `Skeleton` host que conserva el array de `style`. La suite completa de
   `index.test.tsx` fue el criterio de aceptación.
2. La carga asíncrona de detalle llama a `withTiming` primero con el fallback
   `0` y después con el porcentaje resuelto. El candado final usa la forma que
   prescribe R2 en su refactor: `toHaveBeenCalledWith(porcentaje,
   MEALS_BAR_TIMING)`, no un conteo de una llamada que contradice el montaje
   real.
3. La primera suite global dejó rojos cinco contratos de drift porque su
   regex toma el R-id `#106` por un hex. Se paró el cierre, se aplicó el patrón
   de concatenación ya existente en `design-drift.test.ts` y se repitió la
   suite global completa en verde.
4. El catálogo de skills instalado no contiene `expo-overview` ni
   `expo-animation`. Se usó la skill disponible `expo:building-native-ui`, su
   referencia de animaciones y la documentación oficial pinneada de Expo
   v57.0.0. El reviewer debe decidir si la ausencia de esos dos nombres en el
   plugin requiere una acción de entorno para C8; no se inventó ni instaló una
   skill sustituta dentro del repositorio.

## Rebote B1

R2 ganó un segundo ciclo rojo→verde sin modificar producción:
`7308a788` → `2004d56d`.

La comparación con una curva fresca
`Easing.bezier(0.77, 0, 0.175, 1)` se midió primero y no sirve por igualdad
estructural: las closures `factory` son referencias distintas. El intento
dejó 1 suite roja y 2 tests rojos aunque ambas curvas tenían los mismos cuatro
parámetros.

Se eligió el candado por comportamiento. Los dos call-sites comprueban
`duration: 250` y `reduceMotion: ReduceMotion.System` sin importar ningún
valor de producción; además ejecutan la curva recibida y una curva fresca con
los literales aprobados en `0.25` y `0.75`, comparando ambos resultados con
seis decimales.

| Mutación en `src/screens/home/index.tsx` | Suites rojas | Tests rojos |
|---|---:|---:|
| `MEALS_BAR_DURATION_MS` 250 → 251 | 1 | 2 |
| `MEALS_BAR_EASING` → `Easing.bezier(0.23, 1, 0.32, 1)` | 1 | 2 |
| borrar `reduceMotion: ReduceMotion.System` | 1 | 2 |

Cada sonda ejecutó la suite completa de `index.test.tsx`, devolvió exit 1 y
dejó los otros 136 tests verdes. Tras cada una se restauró producción y
`git diff --exit-code HEAD -- mobile-pet-tracker/src/screens/home/index.tsx`
devolvió exit 0.

Verificación final del rebote: `bunx jest` sin filtro ni pipe devolvió exit 0,
con 77/77 suites, 1379/1379 tests y 1 snapshot verdes.
