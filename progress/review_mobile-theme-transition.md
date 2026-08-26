# review: mobile-theme-transition (feature #43)
Fecha: 2026-08-26 (UTC)
Veredicto: **APROBADO** (con condiciones pendientes del humano/leader, ver §Condiciones)

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
