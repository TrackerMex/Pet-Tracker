---
feature: "mobile-no-collar-states-pingo"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-no-collar-states-pingo]] (#159)

El implementador rellena cada fila tras el commit verde de su tarea
(tasks.md §Reglas). La columna de tests nombra los `describe` de tasks.md; si
un `it` cambia de nombre al implementarlo, aquí va el nombre real.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/components/__tests__/empty-state.test.tsx::#159 R1: el copy sin collar existe en los dos idiomas` | pendiente |
| R2 | `src/screens/map/index.test.tsx::R5: mascota free degrada sin mapa › shows the collar requirement without map, stats, lost mode, or polling`; `src/screens/map/index.test.tsx::#159 R2: Mapa sin seguimiento presenta a Pingo`; `src/components/__tests__/empty-state.test.tsx::#159 R2: el texto de rastreo en vivo se retira` | pendiente |
| R3 | `src/screens/map/index.test.tsx::#159 R3: el dueño sin collar puede ir a emparejar` | pendiente |
| R4 | `src/screens/map/index.test.tsx::#159 R4: nadie más ve el botón de emparejar` (sondas S4a-S4c) | pendiente |
| R5 | `src/screens/geofences/index.test.tsx::#159 R5: Zonas seguras sin seguimiento presentan a Pingo` | pendiente |
| R6 | `src/screens/geofences/index.test.tsx::#159 R6: en Zonas seguras nadie ve el botón de emparejar` (sondas S6a-S6b) | pendiente |
| R7 | `src/screens/geofence-editor/index.test.tsx::pinta el 402 sin Reintentar` y `::pinta %s bajo Guardar y conserva el borrador`; `src/providers/__tests__/language-provider.test.tsx::registra las once claves en los dos idiomas y en la tabla de la spec de idioma`; `src/components/__tests__/empty-state.test.tsx::#159 R7: la guarda del editor sigue en texto y dice la verdad` (sonda S7) | pendiente |
| R8 | `src/screens/home/index.test.tsx` (los 3 `it` de tasks.md T8); `src/components/__tests__/empty-state.test.tsx::#159 R8: la nota de Inicio sigue en texto y dice la verdad` (sondas S8a-S8b) | pendiente |
| R9 | `src/components/__tests__/empty-state.test.tsx::#159 R9: los estados sin collar no traen movimiento ni dependencias` (sondas S9a-S9b); `git diff` de tasks.md T9 (3) | pendiente |
| R10 | prueba de humo del humano en dev build de Android (requirements.md §Aprobación) | pendiente |

Rutas relativas a `mobile-pet-tracker/`.
