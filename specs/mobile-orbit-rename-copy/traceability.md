---
feature: "mobile-orbit-rename-copy"
status: approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-orbit-rename-copy]]

Tests de `mobile-pet-tracker/`. Todos los títulos de `it` de la columna 2 son los nombres
finales que debe tener el test.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/__tests__/orbit-rename-copy.test.ts::#221 R1: el catálogo dice Orbit`; `src/screens/welcome/index.test.tsx` (4 `it` enmendados, ver requirements R1) | Test rojo: `5391be19364cbd26f48e120df3f9404497804e50` — `test(welcome): greeting says Orbit (R1, R2)`; verde: `c435c01cb7b1654a8fd5a8551cb7f49401c8eea2` — `feat(i18n): rename greeting to Orbit (R1, R2)` |
| R2 | `src/__tests__/orbit-rename-copy.test.ts::#221 R2: ninguna cadena visible nombra a Pingo` | Test rojo: `5391be19364cbd26f48e120df3f9404497804e50` — `test(welcome): greeting says Orbit (R1, R2)`; verde: `c435c01cb7b1654a8fd5a8551cb7f49401c8eea2` — `feat(i18n): rename greeting to Orbit (R1, R2)` |
| R3 | `src/__tests__/orbit-rename-copy.test.ts::#221 R3: los identificadores pingo-* no cambian aquí` | `8c6ab46049be07796be3377bb0de01f4955b1eab` — `test(i18n): pingo identifiers stay unchanged (R3)`; nace verde, sin feat; mutaciones M3a–M3c verificadas y revertidas |
| R4 | `src/__tests__/orbit-charter-voice.test.ts::#221 R4: la carta nombra a Orbit en el punto 7`; enmiendas T1/T2 en `src/screens/welcome/index.test.tsx`, T3 en `src/components/__tests__/celebration.test.tsx` | pendiente (G4, humano) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
