# review: mobile-theme-transition (feature #43)
Fecha: 2026-08-26 (UTC) — re-reviews de los fixes post-review: mismo día, ver §Re-review (fix 1) y §Re-review fix 2
Veredicto: **APROBADO** (sostenido tras fix 1 de import R4 y fix 2 de sonda nitro; condiciones pendientes del humano/leader, ver §Condiciones)

Revisión independiente sobre worktree detached propio en
`origin/feature/43-mobile-theme-transition` (HEAD `5763e23`), sin tocar el
worktree del implementador ni el checkout principal. Alcance: R1–R5 (R6 es
gate humano por diseño de la spec).

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (0 en la branch: #43 figura `spec_ready` en
      `feature_list.json` — el leader debe reflejar la transición al cerrar)
- [x] `progress/current.md` — en la branch quedó la sesión de #50 (stale,
      heredado del punto de fork; se gestiona en main, no bloquea)

## Checklist C3 — Arquitectura
- [x] N/A capas backend: la feature toca solo `mobile-pet-tracker/` (capa
      cliente). Cero archivos de `backend-pet-tracker/`/`infra/` en el diff.
- [x] Único punto de import de la librería nativa:
      `src/theme/theme-transition.ts` (como fija el design §Decisión 1)

## Checklist C4 — TDD
- [x] Cada R1–R5 tiene test que lo nombra (`describe('R1: ...')` etc. en
      `src/theme/__tests__/theme-transition.test.tsx`; R2 en
      `src/screens/profile/index.test.tsx`)
- [x] Historial rojo→verde por requisito, verificado commit a commit
      (`git show --stat`): cada commit rojo toca SOLO archivos de test —
      R5 `478766b`→`d08b7b9`, R1 `a92ea6b`→`3b915a2`, R3 `96d53ca`→`95f3e28`,
      R4 `4113e8f`→`eccf899`, R2 `78286d4`→`6f3ec62`+`0735838`. Nada de
      "todo en un commit".

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas pendientes en R1–R5; R6 "pendiente (la
      cierra el humano)" — carve-out explícito de la propia spec, correcto
- [x] Cada R con test y commit registrados; verificados contra el código real
- [x] Commits siguen `feat(mobile-theme): <desc> (R<n>)` / `docs(mobile-theme)`.
      Único no conforme: `3cd9947` — es el commit de aprobación del humano
      (AlexisSM377), exento

## Checklist C6 — Spec aprobada
- [x] Casilla "Aprobado por humano" marcada con fecha 2026-08-26, commit real
      del humano `3cd9947` (incluye su decisión de verificación: correr la
      app en Android para ver el fade)
- [ ] Frontmatter sigue `status: draft` — **issue conocido, NO bloqueante por
      instrucción del leader** (fix denegado por permisos en la sesión
      Frontend, escalado; mismo patrón que #50). Ver §Condiciones.
- [x] Ningún requisito modificado tras la aprobación (`3cd9947` es el último
      commit que toca `requirements.md`)

## Checklist C7 — Sin código huérfano
- [x] La lógica inline del toggle (Uniwind.setTheme + setStoredTheme en
      `profile/index.tsx`) fue reemplazada Y eliminada: imports de `Uniwind` y
      `setStoredTheme` retirados del screen; único consumidor del hook es el
      toggle. Grep de importadores limpio.
- [x] No había tests del código reemplazado que eliminar (las aserciones de
      #40 siguen válidas contra el nuevo camino, sin relajarse)

## Checklist C8 — UI móvil (carta `docs/ui-guidelines.md`)
- [x] Grep-clean: cero hex fuera de `src/theme/`, cero clases arbitrarias
      nuevas, cero `StyleSheet.create`, cero shadow/elevation legacy
      (verificado por grep sobre `src/` completo)
- [x] Duración 400ms superficie grande (THEME_FADE.durationMs=400, un solo
      uso — regla de promoción a token aplica al repetirse, design §2)
- [x] Reduced motion respetado: guard con `useReducedMotion()` de Reanimated
      → apply directo sin animación (R3, test verde)
- [x] Sin superficies UI nuevas → dimensiones/skeleton/touch targets N/A
      (el Button `theme-toggle` existente no cambia de layout)
- [x] "Todo corre en Expo Go": el fade nativo NO corre en Expo Go — desviación
      **declarada y aprobada en la spec** (R4 garantiza degradación a cambio
      instantáneo sin crash; test verde; verificación del fade real = R6 gate
      humano). Conforme a la propia carta: lo que exige dev build se declara
      en su spec.
- [x] `THEME_FADE`/`settleFrames` viven solo en `src/theme/` (grep verificado)

## Verificación independiente — `./init.sh` (corrido por el reviewer)
- **Run 1: EXIT=1** — falso rojo de entorno del worktree de review: init.sh
  copió `.env` desde `.env.example` (placeholder) y los e2e fallaron con
  `password authentication failed for user "pet_tracker"` (304 fallos en
  masa, todos de conexión). No es regresión de #43 (cero archivos backend en
  el diff).
- **Run 2 (con el `.env` real del checkout): EXIT=0 — todo verde**:
  - Backend unit: 1114/1114 (145 suites)
  - Infra: 14/14
  - Mobile jest: **538/538 (48 suites)** — `PASS src/screens/profile/index.test.tsx`
    (sin aserciones relajadas: el diff de esa suite es solo-adiciones, 19/19
    de #40 intactas + la nueva de R2) y `PASS src/theme/__tests__/theme-transition.test.tsx`
  - E2E: 327 passed / 6 skipped (Postgres + LocalStack arriba)
  - Lint y typecheck sin errores
- El flake de `R7: cambiar foto` que reporta el implementador NO se reprodujo.
- Números idénticos a los del reporte `progress/impl_mobile-theme-transition.md`.

## Observaciones
Ninguna que bloquee R1–R5. La implementación sigue el design al pie de la
letra (hook único, callback síncrono, persistencia fuera del callback, sin
consultar `isThemeTransitionAvailable`, mock degradado idéntico al design §6
en las 3 suites). Las 2 desviaciones declaradas (renderHook async de RNTL 14;
mock también en `screens.test.tsx` porque monta el ProfileScreen real vía la
route) son correctas y menores.

## Condiciones (no cierran con este veredicto — las cierra humano/leader)
1. **R6 — gate humano**: fade verificado en Android físico + decisión
   mantener/descartar registrada en `requirements.md` §Decisión del gate
   humano y reflejada en `feature_list.json`. La fila R6 de traceability
   queda "pendiente" hasta entonces, como manda la spec.
2. **Frontmatter `status: approved`**: el leader debe commitear el cambio
   `draft → approved` en `specs/mobile-theme-transition/requirements.md`
   (sugerencia del implementador: `docs(mobile-theme-transition): frontmatter
   status approved tras gate humano`). Denegado por permisos en la sesión
   implementadora; escalado — mismo patrón que #50.
3. **Estado en `feature_list.json`**: #43 sigue `spec_ready` en la branch;
   el leader registra la transición (y `done` solo tras cerrar R6).

## Re-review fix post-review (HEAD `68c82c0`)

Contexto: tras la aprobación inicial, el humano reportó crash en Expo Go — el
import top-level de `react-native-nitro-modules` lanza sin módulo nativo
(R4 violado en runtime real; los mocks de jest lo enmascaraban). Alcance de
este re-review: solo los 3 commits del fix + sostener/retirar el veredicto.
Worktree detached propio recreado en `origin/feature/43-mobile-theme-transition`.

- [x] **C4 test-primero, verificado empíricamente (no solo por orden de
      commits)**: en `d603f19` (solo añade
      `src/theme/__tests__/theme-transition.degraded.test.tsx`) corrí la suite
      → **FALLA con el crash real**: cadena
      `NativeNitroModules.getEnforcing → react-native-nitro-modules →
      react-native-nitro-theme-transition → theme-transition.ts` (el mismo
      crash de Expo Go). En `4962ea8` (solo toca `theme-transition.ts`) la
      suite pasa. `68c82c0` es docs.
- [x] **El test rojo NO mockea el paquete nitro**: `jest.mock` solo de
      `uniwind` y `theme-preference` (lado app). El paquete real se evalúa —
      es exactamente lo que antes se enmascaraba. Sin enmascaramiento.
- [x] **El require perezoso cubre R4**: el import top-level se eliminó;
      `getWithThemeTransition()` resuelve el módulo en el press con try/catch
      cacheado → sin nativo cae a `apply()` instantáneo + `setStoredTheme`,
      sin lanzar y sin consultar `isThemeTransitionAvailable`. Importar
      `theme-transition.ts` ya no evalúa el paquete (el type usa
      `typeof import(...)`, solo tipos).
- [x] **R1–R3 no degradados**: suite completa `src/theme/__tests__/` en el
      commit del fix: 5 suites / 19 tests verdes. R1 sigue asertando
      `withThemeTransition(apply, THEME_FADE)` cuando el módulo resuelve
      (en device con nativo el require tiene éxito → fade intacto); el camino
      reduced motion ni siquiera resuelve el módulo (R3).
- [x] **`./init.sh` corrido por el reviewer en `68c82c0`: EXIT=0, todo
      verde** — backend 1114/1114, infra 14/14, **mobile 539/539 (49
      suites)** incl. `PASS theme-transition.degraded.test.tsx`, e2e 327
      passed/6 skipped, lint y typecheck sin errores.
- [x] Convención de commits: `feat(mobile-theme): ... (R4)` × 2 +
      `docs(mobile-theme)`. Trazabilidad: fila R4 actualizada con la nueva
      suite y `d603f19` rojo → `4962ea8` verde.

Observación para el gate humano (no bloquea): el smoke Expo Go de R4 (toggle
instantáneo sin crash) cobra prioridad — es el escenario que crasheaba; el
reporte del implementador ya lo recoge.

**Veredicto del re-review: APROBADO — el veredicto anterior se sostiene.**
Las condiciones de §Condiciones siguen vigentes sin cambios (R6 gate humano,
frontmatter `status: approved`, estado en `feature_list.json`).

## Re-review fix 2 — sonda nitro (HEAD `248d17c`)

Contexto: 2º hallazgo del humano en Expo Go — el LogBox ERROR persistía pese
al try/catch del fix 1: fuera del arranque, Metro guarda el require con
`ErrorUtils.reportFatalError` y reporta el throw aunque el caller lo capture.
Contrato nuevo: sin módulo nativo, el paquete nitro no se evalúa en absoluto.
Alcance: commits `7e5f15a` (rojo) → `6299aef` (verde) → `248d17c` (docs).
Worktree detached propio recreado en el nuevo HEAD.

- [x] **C4 rojo→verde, verificado empíricamente**: en `7e5f15a` corrí la
      suite del hook → exactamente el test nuevo falla
      (`✕ sin módulo nativo ni evalúa el paquete: cambio directo`, 1 failed /
      5 passed); en `6299aef` las 5 suites de `src/theme/__tests__/` pasan
      (20/20).
- [x] **El test rojo no se autoconfirma**: el test nuevo mockea la sonda para
      probar la lógica de decisión (probe consultado ANTES del require), y el
      contrato real "el paquete jamás se evalúa" lo vigila la suite
      `theme-transition.degraded.test.tsx`, que sigue SIN mockear los paquetes
      nitro ni la sonda (verificado por grep): si el gate fallara, esa suite
      crashearía con el `getEnforcing` real. Pasa.
- [x] **Sonda correcta**: `src/theme/nitro-availability.ts` importa solo
      `react-native`; `hasNitroModules()` usa
      `TurboModuleRegistry.get('NitroModules')` (devuelve null sin lanzar,
      con try/catch de respaldo). `getWithThemeTransition()` retorna null
      ANTES del require cuando la sonda es false.
- [x] **Cero imports estáticos del paquete nitro en el camino de Expo Go**:
      grep de `src/` fuera de tests — solo el `typeof import(...)` (type-only,
      borrado en runtime) y el `require` gateado por la sonda. Ningún import
      top-level de `react-native-nitro-theme-transition` ni
      `react-native-nitro-modules`.
- [x] **R1 intacto**: con sonda truthy (mock default `true` en la suite del
      hook) el fade sigue invocándose vía `withThemeTransition(apply,
      THEME_FADE)` — aserciones de R1 sin cambios, verdes.
- [x] **R3/R4 intactos**: reduced motion ni consulta la sonda (apply directo);
      camino degradado aplica + persiste; `void setStoredTheme(next)`
      incondicional en todo camino. `screens.test.tsx`/`index.test.tsx`
      mockean la sonda a `true` manteniendo sus aserciones previas.
- [x] **`./init.sh` corrido por el reviewer en `248d17c`**: primer intento
      EXIT=1 por 6 fallos e2e **ambientales** — cross-talk de colas
      LocalStack compartidas con la sesión activa de #51 (mensaje ajeno con
      petId/token de otra corrida recibido por el notifier; backend/infra
      bit-idénticos a los dos estados ya verificados verdes: diff vacío
      `5763e23..248d17c` y `68c82c0..248d17c`; cada suite afectada verde en
      aislamiento). Segundo intento: **EXIT=0, todo verde** — backend
      1114/1114, infra 14/14, **mobile 540/540 (49 suites)** (confirma el
      540/540 de Frontend), e2e 327 passed / 6 skipped, lint y typecheck sin
      errores (también corridos aparte: mobile, backend e infra).
- [x] Convención de commits y trazabilidad: fila R4 actualizada con
      `7e5f15a` rojo → `6299aef` verde y el test nuevo; reporte del
      implementador con §fix de sonda.

Observación (no bloquea, para el gate humano): el smoke Expo Go debe
confirmar además que el LogBox ERROR ya no aparece (era el síntoma del 2º
hallazgo — el fix 1 ya evitaba el crash, este elimina el reporte a LogBox).

**Veredicto fix 2: APROBADO — el veredicto general se sostiene.** Condiciones
de §Condiciones sin cambios (R6 gate humano, frontmatter `status: approved`,
estado en `feature_list.json`).

## Output de ./init.sh (run 2, resumen final)
```
✅ Tests pasados        (backend 1114/1114, infra 14/14, mobile 538/538)
✅ Tests e2e pasados    (327 passed, 6 skipped, 333 total)
✅ Lint sin errores
✅ Typecheck sin errores
══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
  Features: 43/50 completadas | 6 pendientes
EXIT=0
```
Log completo del run del reviewer (scratchpad de sesión, efímero):
`init-43.log` (run 1) / `init-43-run2.log` (run 2).
