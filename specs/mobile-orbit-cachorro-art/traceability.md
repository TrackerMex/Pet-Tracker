---
feature: "mobile-orbit-cachorro-art"
status: approved        # draft | approved
tags: [mobile, ui, mascota, orbit, assets, spec]
---

# Trazabilidad — [[mobile-orbit-cachorro-art]] (#243)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/__tests__/orbit-cachorro-art.test.ts::#243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos` (nace verde; M4 detectada y revertida) | `42e9c47c` — `test(mobile): R1 R2 R3 red, puppy art locked by content (#243)`; verde en `f7973231`; sonda M4 y restauración verde en el reporte |
| R2 | `src/__tests__/orbit-cachorro-art.test.ts::#243 R2: cada pose tiene el sha256 del arte nuevo` y `::#243 R2: ningún fichero de assets/images conserva el arte viejo` | rojo `42e9c47c`; verde `f7973231` — `feat(mobile): R2 R4 green, Orbit puppy art replaces the robot (#243)` |
| R3 | `src/__tests__/orbit-cachorro-art.test.ts::#243 R3: las fuentes PNG están congeladas` (nace verde; M6 detectada y revertida) y `::#243 R3: el script de conversión está en la spec con sus parámetros` | rojo del script `42e9c47c`; verde `f7973231` — `feat(mobile): R2 R4 green, Orbit puppy art replaces the robot (#243)`; sondas M6/M7 y restauración verde en el reporte |
| R4 | salida de `specs/mobile-orbit-cachorro-art/convert-orbit.py` (exit 0, diez filas `ok`); huella en R2 | `f7973231` — `feat(mobile): R2 R4 green, Orbit puppy art replaces the robot (#243)`; hashes y salidas en `progress/impl_mobile-orbit-cachorro-art.md` |
| R5 | suites de tasks.md §Verde de la cadena, con la única entrada de `exceptions` autorizada por Enmienda 1, y guarda de `src/` con los dos tests | rojo histórico en C5; verde `5fa2e0b7` — `test(mobile): R5 allow the Pingo history literal in the #243 test (#243)`; 13 suites y 512 tests del handoff verdes; ambas mutaciones de C6 detectadas y revertidas, salidas en el reporte |
| R6 | `src/__tests__/orbit-cachorro-art.test.ts::#243 R6: la carta lleva la Enmienda #243 una sola vez, con la descripción nueva` (C4 y C5, tras la firma G4) | rojo `3b178619` — `test(mobile): R6 red, charter amendment for the puppy art (#243)`; carta `7d181887` — `docs(ui): R6 charter amendment, Orbit is a puppy (#243)`; verde global tras `5fa2e0b7`; M10/M11/M12 detectadas y revertidas |
| R7 | guarda de `assets/` de tasks.md §Guardas finales (sin test de jest) | `f7973231` — `feat(mobile): R2 R4 green, Orbit puppy art replaces the robot (#243)`; diez poses tras C2/C5/C6; M13 detectada en un commit hijo temporal sin refs y sin cambiar HEAD, evidencia en el reporte |

Regla: el reviewer no aprueba si alguna fila de R1 a R7 queda sin cerrar.
G4 está firmada. La incompatibilidad inicial R5/R6 quedó resuelta por Enmienda 1
(`31b7c10a`) y C6 (`5fa2e0b7`), conservando el literal documental de R6.
M1–M13 y las dos sondas de Enmienda 1 fueron detectadas y revertidas; las salidas,
hashes y guardas están en `progress/impl_mobile-orbit-cachorro-art.md`.
Implementación y verificación local completas. `./init.sh` y reviewer corresponden
al leader; el smoke G2 sigue siendo del humano y no se altera el estado de la feature.
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras C2 y C5 en commits de documentación; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
