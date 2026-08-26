---
feature: "mobile-theme-transition"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-theme-transition]] (feature #43)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/theme/__tests__/theme-transition.test.tsx::R1: fade nativo en el toggle` | `a92ea6b` rojo → `3b915a2` verde (renderHook de RNTL 14 es async; await corregido en el verde) |
| R2 | `src/screens/profile/index.test.tsx::R2: el toggle dispara el fade vía withThemeTransition` (dentro del describe `R4: toggle persiste` de #40); aserciones existentes de #40 intactas (19/19); smoke de rutas `src/app/(tabs)/__tests__/screens.test.tsx` con mock degradado | `78286d4` rojo → `6f3ec62` verde; `0735838` mock degradado en smoke de rutas (screens.test.tsx monta el ProfileScreen real vía la route — el design solo preveía index.test.tsx) |
| R3 | `src/theme/__tests__/theme-transition.test.tsx::R3: reduced motion salta la animación` | `96d53ca` rojo → `95f3e28` verde |
| R4 | `src/theme/__tests__/theme-transition.test.tsx::R4: degradación sin módulo nativo` (2 casos: camino fade y camino reduced motion); `src/theme/__tests__/theme-transition.degraded.test.tsx::R4: runtime sin módulo nativo (paquete real, sin mock)` + smoke humano Expo Go pendiente del gate | `4113e8f` rojo → `eccf899` verde; fix crash de import en Expo Go (hallazgo del humano 2026-08-26) `d603f19` rojo → `4962ea8` verde (require perezoso con fallback); fix LogBox ERROR pese al catch (2º hallazgo del humano 2026-08-26: Metro guarda el require fuera del arranque y reporta el throw aunque se capture) `7e5f15a` rojo → `6299aef` verde (sonda `hasNitroModules()` vía TurboModuleRegistry.get, test nuevo `theme-transition.test.tsx::R4 › sin módulo nativo ni evalúa el paquete`) |
| R5 | `src/theme/__tests__/theme-transition.test.tsx::R5: THEME_FADE options` + `./init.sh` completo verde con deps nitro (2026-08-26: 538/538 jest móvil, e2e 327 passed/6 skipped, lint, typecheck) | `478766b` rojo → `d08b7b9` verde |
| R6 | **verificación humana, sin test** — dev build en Android + decisión registrada en [[requirements]] §Decisión del gate humano | pendiente (la cierra el humano) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente". R6 solo puede
cerrarla el humano (fade en dev build + decisión mantener/descartar); si la
decisión es **descartar**, todas las filas se cierran con la referencia al
commit de revert y la nota de descarte.
Convención de commit: `feat(mobile-theme): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
