---
feature: "mobile-add-pet-photo-test-flake"
status: approved     # draft | approved
tags: [harness, spec, mobile, tests]
---

# Trazabilidad — [[mobile-add-pet-photo-test-flake]] (#72)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/screens/alerts/index.test.tsx` :: `#78 R4: … › pinta y reintenta cada error de la primera página (#72 R1)` | `b7095168` `test(add-pet-photo-test-flake): reproduce the alerts cache-vs-render race on demand (R1)` (rojo) + `1688dc94` `fix(add-pet-photo-test-flake): end the alerts wait on the rendered tree (R1)` (verde) |
| R2 | `mobile-pet-tracker/src/screens/alerts/index.test.tsx` :: `deshabilita durante el vuelo y corta dos pulsaciones seguidas (#72 R2)` y `cierra sesión en unauthorized sin pintar error (#72 R2)`; `mobile-pet-tracker/src/screens/pairing/index.test.tsx` :: `signs out for unauthorized without showing an error message (#72 R2)` y `signs out for unauthorized without showing a local error (#72 R2)`; `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx` :: `selects the first pet and loads its first position (#72 R2)`; `mobile-pet-tracker/src/app/(tabs)/__tests__/weight-log.test.tsx` :: `submits all fields, clears them, and refetches the list (#72 R2)` | pendiente (rojo con mutaciones) + pendiente (verde sin mutaciones) |
| R3 | `mobile-pet-tracker/src/screens/profile/index.test.tsx` :: `#72 R3: el mock del picker no hereda implementación entre tests` | pendiente (rojo) + pendiente (verde) |
| R4 | `mobile-pet-tracker/src/screens/add-pet/index.test.tsx` :: `#72 R4: el fallo del picker nombra el invariante roto` | pendiente (rojo) + pendiente (verde) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`; aquí los pares son
`test(add-pet-photo-test-flake): … (Rn)` para el rojo y
`fix(add-pet-photo-test-flake): … (Rn)` para el verde.

Evidencias que además exige esta feature y que **no** son filas de esta tabla (viven
en `progress/impl_mobile-add-pet-photo-test-flake.md`):

- La salida del rojo de R1 con la viga de 200 ms puesta (la firma
  `Unable to find an element with testID: alerts-error`).
- La tabla de las cinco mutaciones de R2 con su rojo, más la **prueba de zona ciega**
  de S3, S4 y S5 (misma mutación: test viejo verde, test corregido rojo).
- `git diff origin/main..HEAD` vacío sobre los tres ficheros de producción mutados.
- Las tablas de V1 (5 corridas por fichero), V2 (20 corridas de la suite, exit code y
  `Test Suites: … N total` de cada una) y V3 (`./init.sh`, sin pipe).
