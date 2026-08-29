---
feature: "android-map-never-ready"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[android-map-never-ready]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/components/__tests__/pet-map.test.tsx::R1: PetMap renderiza la vista de expo-maps con el contrato del tab Map` | `a574f44 test(map): define expo maps wrapper in red (R1)` → `e99ec43 feat(map): add shared Expo Maps wrapper (R1)` |
| R2 | `src/components/__tests__/pet-map.test.tsx::R2: la cámara se fija con MAP_ZOOM en vez de deltas` | pendiente |
| R3 | `src/components/__tests__/pet-map.test.tsx::R3: marker y polylines llegan a la vista como arrays` + `src/app/(tabs)/__tests__/map.test.tsx::R6: mapa y marker con la última posición::R3 (android-map-never-ready): …` y `::R7: ruta del día como polylines::R3 (android-map-never-ready): …` | pendiente |
| R4 | `src/components/__tests__/pet-map.test.tsx::R4: el tema decide el colorScheme del mapa` + `src/app/(tabs)/__tests__/map.test.tsx::R7 (mobile-figma-polish): mapa adapta su base al tema::R4 (android-map-never-ready): …` | pendiente |
| R5 | `app.config.test.ts::R1: la config resuelta inyecta la clave de Android desde el entorno::R5 (android-map-never-ready): fija android.config.googleMaps.apiKey y no declara plugin de mapas` | pendiente |
| R6 | sin test (documentación) — `docs/ui-guidelines.md` (§4, §5, §9, línea 95) y `docs/verification.md` (§Feature 52 nota + §Feature 54), verificadas por el reviewer | pendiente |
| R7 | sin test propio — `progress/impl_android-map-never-ready.md::Verificación R7` (typecheck / lint / test móvil, `./init.sh`, allowlist de `git diff --stat`, grep-clean C8, ausencia de `react-native-maps` y de `map-style-dark.json`) | pendiente |
| R8 | smoke humano en dev build de Android, en ambos temas, con tiles + marker + polyline confirmados por separado — registrado en `progress/impl_android-map-never-ready.md::Resultado del smoke R8` y con la casilla marcada en [[requirements]] §Aprobación | pendiente |

Rutas relativas a `mobile-pet-tracker/` salvo las que empiezan por `docs/`,
`specs/` o `progress/`.

Regla: el reviewer no aprueba si alguna fila queda "pendiente". Para R6 y R7
la fila registra las secciones escritas y los comandos ejecutados; **R8 la
cierra solo el humano** — ninguna IA puede correr un dev build en un
dispositivo real. Ojo: los tests de R1–R5 pasan igual de verdes con el bug
nativo presente (mockean la librería de mapas), así que una tabla completa sin
R8 marcado **no** significa que el mapa pinte.

Convención de commit: `feat(map): <desc> (R1,R2)`, con commit `test(...)` en
rojo antes de cada `feat(...)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
