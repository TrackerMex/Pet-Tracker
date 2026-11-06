---
feature: "mobile-orbit-cachorro-art"
status: approved        # draft | approved
tags: [mobile, ui, mascota, orbit, assets, spec]
---

# Trazabilidad — [[mobile-orbit-cachorro-art]] (#243)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/__tests__/orbit-cachorro-art.test.ts::#243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos` (nace verde) | pendiente |
| R2 | `src/__tests__/orbit-cachorro-art.test.ts::#243 R2: cada pose tiene el sha256 del arte nuevo` y `::#243 R2: ningún fichero de assets/images conserva el arte viejo` | pendiente |
| R3 | `src/__tests__/orbit-cachorro-art.test.ts::#243 R3: las fuentes PNG están congeladas` (nace verde) y `::#243 R3: el script de conversión está en la spec con sus parámetros` | pendiente |
| R4 | salida de `specs/mobile-orbit-cachorro-art/convert-orbit.py` (exit 0, diez filas `ok`); huella en R2 | pendiente |
| R5 | suites de tasks.md §Verde de la cadena sin modificar, y la guarda de `src/` de §Guardas finales | pendiente |
| R6 | `src/__tests__/orbit-cachorro-art.test.ts::#243 R6: la carta lleva la Enmienda #243 una sola vez, con la descripción nueva` (C4 y C5, tras la firma G4) | pendiente |
| R7 | guarda de `assets/` de tasks.md §Guardas finales (sin test de jest) | pendiente |

Regla: el reviewer no aprueba si alguna fila de R1 a R5 y R7 queda "pendiente". R6 queda
pendiente hasta la casilla G4 de [[requirements]] §Aprobación.
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
