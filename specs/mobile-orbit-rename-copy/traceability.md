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
| R1 | `src/__tests__/orbit-rename-copy.test.ts::#221 R1: el catálogo dice Orbit`; `src/screens/welcome/index.test.tsx` (4 `it` enmendados, ver requirements R1) | pendiente |
| R2 | `src/__tests__/orbit-rename-copy.test.ts::#221 R2: ninguna cadena visible nombra a Pingo` | pendiente |
| R3 | `src/__tests__/orbit-rename-copy.test.ts::#221 R3: los identificadores pingo-* no cambian aquí` | pendiente |
| R4 | `src/__tests__/orbit-charter-voice.test.ts::#221 R4: la carta nombra a Orbit en el punto 7`; enmiendas T1/T2 en `src/screens/welcome/index.test.tsx`, T3 en `src/components/__tests__/celebration.test.tsx` | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
