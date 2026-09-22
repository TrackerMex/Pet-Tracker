# Implementación #110 — `mobile-reanimated-double-dead-weight`

Fecha: 2026-09-22  
Rama: `feature/110-mobile-reanimated-double-dead-weight`

## Línea base

Medida antes de editar, sin pipes:

| Corrida | Exit | Resultado |
|---|---:|---|
| `bunx jest --runTestsByPath src/screens/home/index.test.tsx` | 0 | 1 suite / 138 tests |
| `bunx jest` | 0 | 77 suites / 1396 tests |

## TDD de R1 y R2

- R1 rojo (`b15c7cd6`): exit 1; 1 fallo / 138 verdes. La aserción
  esperaba `skeleton__root` y recibió `h-12 w-full rounded-card`.
- R1 verde (`52f553ab`): exit 0; 139/139. `#62 R8` siguió verde al montar
  el `Skeleton` real.
- R2 rojo (`e9f07831`): exit 1; 1 fallo / 139 verdes. `Animated.View` era
  el mismo objeto que el `View` real de React Native.
- R2 verde (`1db9f6ff`): exit 0; 140/140. ESLint del fichero salió 0 sin
  warnings.

## R3 — bloque #62 R8 intacto y sonda de mutación

El diff contra `e4c9ea99` en las líneas que contienen `skeleton dimensionado`,
`home-loading` o `rounded-card` solo mostró la adición de R1:

```text
+    expect(screen.getByTestId('home-loading').props.className).toContain(
```

No hubo ninguna línea eliminada del bloque original de `#62 R8`.

Se mutó temporalmente en `src/screens/home/index.tsx` la clase
`h-12 w-full rounded-card` por `h-4 w-1/2 rounded-full`. Output literal de la
sonda:

```text
EXIT=1
FAIL src/screens/home/index.test.tsx (14.955 s)
  #62 R8: home carga con Skeleton dimensionado, no con Spinner suelto
    ✕ reserva el espacio de carga con la forma de una Card (11 ms)
  ● #62 R8: home carga con Skeleton dimensionado, no con Spinner suelto › reserva el espacio de carga con la forma de una Card
    Expected substring: "h-12 w-full rounded-card"
    Received string:    "skeleton__root h-4 w-1/2 rounded-full"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 139 passed, 140 total
```

La mutación se revirtió inmediatamente. `git diff --exit-code --
mobile-pet-tracker/src/screens/home/index.tsx` salió 0.

## R4 — inventario de gemelos

El inventario se añadió a `docs/conventions.md` §Tests. La sonda
`grep -n "pet-hero-header" docs/conventions.md` devolvió la nueva entrada en
la línea 237 (además de las referencias históricas de la enmienda #67). No se
modificó ninguno de los ficheros gemelos inventariados.

## Verificación final

Pendiente de cierre.

## Skills cargadas

- Skills de Expo: **ninguna**.
- Otra skill activa: `ponytail` (modo `full`).

## Decisiones no cerradas por la spec

Ninguna.
