---
feature: "mobile-orbit-cachorro-art"
status: approved        # draft | approved
tags: [mobile, ui, mascota, orbit, assets, spec]
---

# Trazabilidad — [[mobile-orbit-cachorro-art]] (#243)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/__tests__/orbit-cachorro-art.test.ts::#243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos` (nace verde; M4 no ejecutada por el bloqueo) | `42e9c47c` — `test(mobile): R1 R2 R3 red, puppy art locked by content (#243)`; verde en `f7973231`; revisión de mutación sin cerrar |
| R2 | `src/__tests__/orbit-cachorro-art.test.ts::#243 R2: cada pose tiene el sha256 del arte nuevo` y `::#243 R2: ningún fichero de assets/images conserva el arte viejo` | rojo `42e9c47c`; verde `f7973231` — `feat(mobile): R2 R4 green, Orbit puppy art replaces the robot (#243)` |
| R3 | `src/__tests__/orbit-cachorro-art.test.ts::#243 R3: las fuentes PNG están congeladas` (nace verde; M6 no ejecutada por el bloqueo) y `::#243 R3: el script de conversión está en la spec con sus parámetros` | rojo del script `42e9c47c`; verde `f7973231` — `feat(mobile): R2 R4 green, Orbit puppy art replaces the robot (#243)`; revisión de mutación sin cerrar |
| R4 | salida de `specs/mobile-orbit-cachorro-art/convert-orbit.py` (exit 0, diez filas `ok`); huella en R2 | `f7973231` — `feat(mobile): R2 R4 green, Orbit puppy art replaces the robot (#243)`; hashes y salidas en `progress/impl_mobile-orbit-cachorro-art.md` |
| R5 | suites de tasks.md §Verde de la cadena sin modificar, y la guarda de `src/` de §Guardas finales | verde tras `f7973231`; **BLOQUEADO tras C5**: `orbit-rename.test.ts` #225 R4 rechaza el literal `Pingo` exigido por el test R6. Guarda de `src/` correcta; evidencia en el reporte |
| R6 | `src/__tests__/orbit-cachorro-art.test.ts::#243 R6: la carta lleva la Enmienda #243 una sola vez, con la descripción nueva` (C4 y C5, tras la firma G4) | rojo `3b178619` — `test(mobile): R6 red, charter amendment for the puppy art (#243)`; test nuevo verde con `7d181887` — `docs(ui): R6 charter amendment, Orbit is a puppy (#243)`; cierre global bloqueado por R5 |
| R7 | guarda de `assets/` de tasks.md §Guardas finales (sin test de jest) | `f7973231` — `feat(mobile): R2 R4 green, Orbit puppy art replaces the robot (#243)`; exactamente las diez poses tras C2 y C5, salidas en el reporte |

Regla: el reviewer no aprueba si alguna fila de R1 a R7 queda sin cerrar.
G4 ya está firmada; C4 y C5 están versionados, pero el cierre está bloqueado por
la incompatibilidad entre el literal de R6 y el candado histórico #225 R4 de R5.
No se declara terminada la feature. Las mutaciones y el resto del verde tras C5
no se ejecutan por la orden de parada de tasks.md y del handoff.
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras C2 y C5 en commits de documentación; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
