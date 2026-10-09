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
| R1 | `src/components/__tests__/empty-state.test.tsx::#159 R1: el copy sin collar existe en los dos idiomas` | 6906af80 test(mobile-no-collar-states): #159 R1 red no-collar copy → b77f23ff feat(mobile-no-collar-states): #159 R1 no-collar copy in catalog and language table |
| R2 | `src/screens/map/index.test.tsx::R5: mascota free degrada sin mapa › shows the collar requirement without map, stats, lost mode, or polling`; `src/screens/map/index.test.tsx::#159 R2: Mapa sin seguimiento presenta a Pingo`; `src/components/__tests__/empty-state.test.tsx::#159 R2: el texto de rastreo en vivo se retira` | 56918113 test(mobile-no-collar-states): #159 R2 red map no-tracking empty state → 00755951 feat(mobile-no-collar-states): #159 R2 map no-tracking empty state |
| R3 | `src/screens/map/index.test.tsx::#159 R3: el dueño sin collar puede ir a emparejar` | f346baf3 test(mobile-no-collar-states): #159 R3 red pair collar action → 9b89f6c8 feat(mobile-no-collar-states): #159 R3 pair collar action on map |
| R4 | `src/screens/map/index.test.tsx::#159 R4: nadie más ve el botón de emparejar` (sondas S4a-S4c) | 9506bd88 test(mobile-no-collar-states): #159 R4 red pair action only for owner without collar → f4f48736 feat(mobile-no-collar-states): #159 R4 gate pair action on detail |
| R5 | `src/screens/geofences/index.test.tsx::#159 R5: Zonas seguras sin seguimiento presentan a Pingo` | 14e76905 test(mobile-no-collar-states): #159 R5 red safe zones no-tracking empty state → 176d9d45 feat(mobile-no-collar-states): #159 R5 safe zones no-tracking empty state |
| R6 | `src/screens/geofences/index.test.tsx::#159 R6: en Zonas seguras nadie ve el botón de emparejar` (sondas S6a-S6b) | sondas S6a-S6b (impl) → cc53c018 test(mobile-no-collar-states): #159 R6 lock no pair action in safe zones |
| R7 | `src/screens/geofence-editor/index.test.tsx::pinta el 402 sin Reintentar` y `::pinta %s bajo Guardar y conserva el borrador`; `src/providers/__tests__/language-provider.test.tsx::registra las once claves en los dos idiomas y en la tabla de la spec de idioma`; `src/components/__tests__/empty-state.test.tsx::#159 R7: la guarda del editor sigue en texto y dice la verdad` (sonda S7) | c3312097 test(mobile-no-collar-states): #159 R7 red truthful editor guard → 92d9a59b feat(mobile-no-collar-states): #159 R7 truthful editor guard copy |
| R8 | `src/screens/home/index.test.tsx` (los 3 `it` de tasks.md T8); `src/components/__tests__/empty-state.test.tsx::#159 R8: la nota de Inicio sigue en texto y dice la verdad` (sondas S8a-S8b) | c6430e68 test(mobile-no-collar-states): #159 R8 red truthful activity note → 1e45b478 feat(mobile-no-collar-states): #159 R8 truthful activity note copy |
| R9 | `src/components/__tests__/empty-state.test.tsx::#159 R9: los estados sin collar no traen movimiento ni dependencias` (sondas S9a-S9b); `git diff` de tasks.md T9 (3) | sondas S9a-S9b (impl) → 1c54b04d test(mobile-no-collar-states): #159 R9 lock no motion on no-collar screens |
| R10 | prueba de humo del humano en dev build de Android (requirements.md §Aprobación) | pendiente |

Rutas relativas a `mobile-pet-tracker/`.
