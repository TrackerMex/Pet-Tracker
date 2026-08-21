# review: mobile-tabs-shell
Fecha: 2026-08-21 (UTC)
Veredicto: APROBADO (re-revisión 2026-08-21 tras fix C6 en `bf16904`; ver apéndice)

## Alcance revisado

- Commits `231c922..a7fb536` en `feature/34-mobile-tabs-shell` (implementación de Codex CLI, R1-R10). HEAD revisado: `a7fb536`.
- Spec: `specs/mobile-tabs-shell/requirements.md` (checkbox humano marcado, commit `ae852b7`).
- R11 (smoke humano Expo Go) fuera de alcance de esta revisión por diseño de la spec; verificado que nada lo bloquea (todo es JS puro compatible con Expo Go SDK 57, cero dependencias nuevas).

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`#34 mobile-tabs-shell` en `feature_list.json`)
- [x] `progress/current.md` describe la sesión activa con historial R1-R10
- [x] `progress/history.md` tiene la entrada de la sesión anterior (#33)

## Checklist C3 — Arquitectura
- [x] N/A capas backend (`docs/architecture.md` es de backend; la spec lo fija en su preámbulo)
- [x] Convenciones móviles: kebab-case en archivos nuevos (`floating-tab-bar.tsx`, pantallas de `(tabs)`)
- [x] Solo tokens del tema: grep de `StyleSheet.create`, colores hex e imports `@react-navigation` en el código de producción nuevo → vacío
- [x] `FloatingTabBar` es JS puro (View + Pressable + reicon), colores vía `useThemeColor` de heroui-native; sin nada nativo nuevo → compatible Expo Go SDK 57
- [x] Contrato D3 respetado: props `{ state, navigation }` tipadas localmente, sin importar tipos de React Navigation

## Checklist C4 — TDD
- [x] Cada R-id con test propio tiene `describe('R<n>: ...')`: R1 (`(tabs)/__tests__/layout.test.tsx`), R2 (`(auth)/__tests__/layout.test.tsx`), R5/R6 (`(tabs)/__tests__/screens.test.tsx`), R7/R8 (`components/__tests__/floating-tab-bar.test.tsx`) — verificado por grep
- [x] Historial test-primero verificado en git log: `929d6b2`→`0822ba7` (R1), `c1dc47d`→`b3028d1` (R2), `f49519b`→`b45c1a4` (R5), `95ecd19`→`9100e17` (R6), `9f7d634`→`e306135` (R7), `f30952c`→`cf99e35` (R8); cada commit rojo contiene solo el test
- [x] Excepción C4 de R3 verificada con `git diff d3992fb~1..2995514`: exactamente 3 hrefs (`index.tsx`, `login.tsx`, `register.tsx`: `/health`→`/home`) + 3 asserts en las suites de #33; los `describe` conservan los R-ids de mobile-auth; nada más cambió
- [x] Excepción C4 de R4 verificada con `git show 0a55b28 -M`: renames 96%/95% de `health.tsx` y su suite a `(tabs)/`; solo cambian 3 rutas de import, asserts intactos

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" para R1-R10; la fila R11 dice "pendiente" porque es el gate humano con checkbox propio en requirements §R11 (mismo tratamiento aceptado en la revisión de #33)
- [x] Cada requisito tiene test y commits rojo→verde registrados; hashes verificados contra `git log`
- [x] Commits siguen conventional commits con R-ids: `test(mobile-tabs-shell): ... (R<n>)` / `feat(mobile-tabs-shell): ... (R<n>)`

## Checklist C6 — Spec aprobada
- [ ] **FALLA**: `specs/mobile-tabs-shell/requirements.md` tiene `status: draft` en el frontmatter (línea 3). El commit humano `ae852b7` solo marcó el checkbox; en #33 el leader actualizó el frontmatter a `approved` en `9fbccae` antes de arrancar — ese paso se omitió en #34 (el commit análogo `08af344` solo tocó `progress/current.md`)
- [x] La casilla "Aprobado por humano" está marcada con fecha 2026-08-21 (commit humano `ae852b7`)
- [x] Ningún requisito modificado tras la aprobación: `git log ae852b7..HEAD -- specs/mobile-tabs-shell/requirements.md` vacío

## Checklist C7 — Sin código huérfano
- [x] `src/app/health.tsx` y `src/app/__tests__/health.test.tsx` movidos (git mv), no duplicados: `src/app/` solo contiene `(auth)`, `(tabs)`, `__tests__`, `_layout.tsx`, `index.tsx`
- [x] Ningún resto de `/health` como destino post-sesión: grep de `replace('/health')` / `href="/health"` en `src/` → vacío

## Verificación R9 (re-ejecutada por el reviewer)
- `bun run typecheck` en `mobile-pet-tracker/`: exit 0
- `bun run lint` en `mobile-pet-tracker/`: exit 0
- `typedRoutes` y `reactCompiler` activos en `app.json`

## Verificación R10 (re-ejecutada por el reviewer)
- `./init.sh`: exit 0 (backend, infra, harness y móvil verdes; e2e omitidos por LocalStack apagado — mismo estado aceptado en #33; esta feature no toca AWS)
- Suite móvil directa: 13 suites, 75 tests, todos verdes
- Contención: `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/` → vacío
- Dependencias: `git diff main...HEAD -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock` → vacío (cero deps nuevas)

## Observaciones

1. **Único bloqueo (C6)**: cambiar `status: draft` → `status: approved` en el
   frontmatter de `specs/mobile-tabs-shell/requirements.md`. Es un arreglo
   documental de una línea que corresponde al leader (los specs son suyos),
   no a Codex. Todo el código y el resto de checkpoints están verdes; tras
   ese cambio la re-revisión es inmediata.
2. Menor (no bloquea): `design.md`, `tasks.md` y `traceability.md` de la
   feature también conservan `status: draft` en su frontmatter; C6 solo exige
   requirements.md, pero conviene alinearlos en el mismo commit.

## Output de ./init.sh (tail)

```
Test Suites: 13 passed, 13 total
Tests:       75 passed, 75 total
✅ Tests pasados
→ Tests e2e...
⚠️  Puerto 4566 sin respuesta — se saltan los e2e (levanta la infra con: docker compose up -d)
→ Lint...
✅ Lint sin errores
→ Typecheck...
✅ Typecheck sin errores
══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
INIT_EXIT=0
```

## Apéndice — Re-revisión 2026-08-21

- Único motivo del rechazo (C6: frontmatter `status: draft`) corregido en
  `bf16904`: los 4 archivos de `specs/mobile-tabs-shell/` pasan a
  `status: approved` (incluye la observación menor sobre design/tasks/traceability).
- Verificado con `git diff a7fb536..bf16904`: exactamente 4 líneas de
  frontmatter cambiadas, 4 files changed, 4 insertions(+), 4 deletions(-);
  ningún otro archivo tocado. Un solo commit en el rango.
- Código intacto desde `a7fb536`; no se re-ejecuta la suite (verde en la
  primera pasada: init.sh exit 0, móvil 13/75, typecheck/lint 0, contención vacía).
- Veredicto final: **APROBADO** (R1-R10; R11 sigue siendo gate humano).
