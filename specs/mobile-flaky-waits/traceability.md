---
feature: "mobile-flaky-waits"
status: approved       # draft | spec_ready | approved
tags: [harness, spec, mobile, tests]
---

# Trazabilidad — [[mobile-flaky-waits]] (#111)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/screens/health/index.test.tsx` :: `R6: weight card enlaza al log › shows the current weight and opens the weight log` | `a054f085 test(mobile-flaky-waits): wait for resolved weight (R1)` — rojo real: `60cf0534` |
| R2 · S2 | `mobile-pet-tracker/src/screens/health/index.test.tsx` :: `R4: health resuelve la mascota seleccionada › keeps API order and selects the first pet by default` | `bcd8ba8a test(mobile-flaky-waits): align health query waits (R2)` |
| R2 · S3 | `mobile-pet-tracker/src/screens/map/index.test.tsx` :: `R7: ruta del día como polylines › R3 (android-map-never-ready): pasa una polyline mapeada por cada viaje` | `9051eb77 test(mobile-flaky-waits): align map waits with assertions (R2)` |
| R2 · S4 | `mobile-pet-tracker/src/screens/map/index.test.tsx` :: `R7: ruta del día como polylines › R3 (android-map-never-ready): pasa un array vacío para un día sin viajes` | `9051eb77 test(mobile-flaky-waits): align map waits with assertions (R2)` |
| R2 · S5 | `mobile-pet-tracker/src/screens/map/index.test.tsx` :: `R8: stats calculadas de positions y trips › uses the latest speed, trip total, fresh age, and live GPS` | `9051eb77 test(mobile-flaky-waits): align map waits with assertions (R2)` |
| R2 · S6 | `mobile-pet-tracker/src/screens/map/index.test.tsx` :: `R8: stats calculadas de positions y trips › #94 R2: la antigüedad de la posición ya no mueve el tile de conexión` | `9051eb77 test(mobile-flaky-waits): align map waits with assertions (R2)` |
| R2 · S7 | `mobile-pet-tracker/src/screens/map/index.test.tsx` :: `R6: owner toglea lost mode contra el endpoint › posts the inverse, disables in flight, and refetches the new label` | `9051eb77 test(mobile-flaky-waits): align map waits with assertions (R2)` |
| R3 | `mobile-pet-tracker/src/screens/map/index.test.tsx` :: `R4: map resuelve la mascota seleccionada › selects the first pet and loads its first position (#72 R2)` — **sin editar**; la prueba es el `git diff` de [[requirements]] §R3 | `fba9c4c5 docs(mobile-flaky-waits): record verification evidence (R1,R2,R3,R4,R5,R6)` — bloque protegido idéntico (`cmp` exit 0) |
| R4 | `git diff origin/main..HEAD -- mobile-pet-tracker/package.json` **vacío** | `fba9c4c5 docs(mobile-flaky-waits): record verification evidence (R1,R2,R3,R4,R5,R6)` — diff vacío |
| R5 | `git diff --name-only origin/main..HEAD -- mobile-pet-tracker/ ':!*.test.tsx'` **vacío** | `fba9c4c5 docs(mobile-flaky-waits): record verification evidence (R1,R2,R3,R4,R5,R6)` — diff vacío |
| R6 | [[design]] §Protocolo V: V0 (`N == S`), V1 (`86`), V2 (5 × exit 0, `77 passed` / `1396 passed`) | `fba9c4c5 docs(mobile-flaky-waits): record verification evidence (R1,R2,R3,R4,R5,R6)` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(mobile-flaky-waits): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

> **R3, R4 y R5 son requisitos de no-cambio**: su "test" es el `git diff` que el
> `reviewer` ejecuta él mismo, no un `it` del árbol. Están declarados como vía
> **(b)** en [[requirements]] §C4, con casilla propia de firma humana.
>
> **Aviso sobre los hashes**: si esta rama se rebasa después de rellenar la tabla,
> los hashes dejan de existir. En ese caso se reapuntan y se verifica con
> `git merge-base --is-ancestor <hash> HEAD` antes de dar C5 por bueno.
