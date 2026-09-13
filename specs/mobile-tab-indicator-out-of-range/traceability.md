---
feature: "mobile-tab-indicator-out-of-range"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-tab-indicator-out-of-range]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente | pendiente |
| R2 | pendiente | pendiente |
| R3 | pendiente | pendiente |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |

Tests esperados por requisito (rutas desde `mobile-pet-tracker/`):

| R | Fichero de test | `describe` |
|---|---|---|
| R1 | `src/components/__tests__/floating-tab-bar.test.tsx` | `#91 R1: una ruta fuera de TABS no monta la burbuja` |
| R2 | `src/components/__tests__/floating-tab-bar.test.tsx` | `#91 R2: el primer layout coloca la burbuja por el índice de TABS` |
| R3 | `src/components/__tests__/floating-tab-bar.test.tsx` | `#91 R3: el cambio de ruta desliza la burbuja al índice de TABS` |
| R4 | `src/components/__tests__/floating-tab-bar.test.tsx` | `#91 R4: al volver de una ruta ajena la burbuja aparece ya colocada` |
| R5 | `src/components/__tests__/floating-tab-bar.test.tsx` | `#91 R5: con una ruta ajena las cinco celdas quedan inactivas y siguen navegando` |
| R6 | sin test nuevo — suite existente verde **sin editar ninguna aserción**, más `git diff --stat 072cff40..HEAD -- mobile-pet-tracker/` con exactamente dos ficheros | — |
| R7 | evidencia de mutación en `progress/impl_mobile-tab-indicator-out-of-range.md` §R7 (M1 → rojo `#91 R3`; M2 → rojo `#91 R2`; M3 → rojo `#91 R5`) | — |
| R8 | gate humano en dev build de Android; guion y resultado en `progress/impl_mobile-tab-indicator-out-of-range.md` §R8 | — |

Notas de cierre para el `reviewer`:

- **R5 es requisito de verificación** ([[requirements]] §R5, vía (b) de C4): su
  commit rojo lleva versionada la **mutación de producción M3** y el verde la
  revierte. Un rojo por mutación del doble de `reicon` no cierra R5.
- **R7 exige una mutación por cada uno de los dos sitios** de posicionamiento
  (`useEffect` y `handleLayout`), comprobadas por separado. Una sola mutación no
  cierra el requisito.
- El commit de §T0 (fixture y dobles) es **verde** por diseño: no es un rojo
  fallido, es el sujeto que R1..R5 necesitan por delante ([[tasks]] §T0).

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`; aquí `<scope>` es
`tab-indicator` y la mayoría son `fix(...)` / `test(...)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
