# review: mobile-app-scaffold (#31)
Fecha: 2026-08-19
Veredicto: APROBADO (R1-R12; R13 queda como gate humano — la feature NO se marca done hasta el smoke)

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: done 29, pending 1 (#18), in_progress 1 (#31))
- [x] progress/current.md describe la sesión activa de #31

## Checklist C3 — Arquitectura
- [x] N/A parcial: las capas de `docs/architecture.md` son de backend y la spec
      las excluye explícitamente para la app (expo-router file-based)
- [x] Convenciones que sí aplican, cumplidas: kebab-case, tests nombran R-id,
      conventional commits
- [x] backend-pet-tracker/ intacto (ver C7/R12)

## Checklist C4 — TDD
- [x] Cada R2-R7 tiene `describe('R<n>: ...')` en
      `mobile-pet-tracker/src/api/__tests__/health.test.ts` (R2-R6) y
      `mobile-pet-tracker/src/app/__tests__/index.test.tsx` (R7)
- [x] Historial test-primero real, verificado empíricamente por el reviewer:
      - checkout `1893f1c` (red R2) + `bun run test src/api/__tests__/health.test.ts`
        → FALLA (module `../health` not found), exit 1
      - checkout `9a82d64` (red R7) + `bun run test src/app/__tests__/index.test.tsx`
        → FALLA (5/5 tests rojos contra la pantalla plantilla), exit 1
      - Cada R2-R7 tiene commit `test(...)` separado ANTES de su `feat(...)` (log verificado)
- [x] Excepción a C4 correctamente acotada: `ee29ed1` es scaffold puro
      (37 archivos, solo plantilla + `.gitignore` con `.env` añadido; cero código a mano,
      sin `src/api/`, `src/app/` solo `_layout.tsx` + `index.tsx`). `f22721c` es solo
      tooling de test (jest-expo, eslint config, package.json/bun.lock)

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" en R1-R12; la fila R13 dice
      "pendiente" POR DISEÑO: es el gate humano (smoke en Android físico) que
      la propia spec asigna al humano. No bloquea este veredicto por
      instrucción del leader; SÍ bloquea marcar la feature done
- [x] Commits siguen `tipo(scope): desc (R<n>)` — scope `mobile` para la app,
      `harness` para R9-R11; hashes de la tabla verificados contra `git log`

## Checklist C6 — Spec aprobada
- [x] `specs/mobile-app-scaffold/requirements.md` con `status: approved`
- [x] Casilla "Aprobado por humano" marcada con fecha 2026-08-19

## Checklist C7 — Sin código huérfano
- [x] N/A — primera feature móvil, no reemplaza nada. El código de ejemplo de
      la plantilla fue eliminado vía reset-project dentro del propio scaffold
- [x] R12: `git diff --stat origin/main...HEAD -- backend-pet-tracker/` → vacío

## Verificaciones específicas del handoff

### R1 — scaffold puro y raíz limpia
- [x] `ee29ed1` contiene SOLO scaffold generado (ver C4)
- [x] `src/app/` reducido a `_layout.tsx` + `index.tsx` (más `__tests__/` añadido después por TDD)
- [x] Sin `example/` ni `scripts/` residuales (verificado en disco y en `git ls-files`)
- [x] Script `reset-project` eliminado de `package.json` (scripts: start/android/ios/web/lint/test/typecheck)
- [x] Raíz del repo sin `package.json`, `bun.lock` ni `node_modules`
- [x] Corrección del gap del addendum confirmada: el trabajo manual incompleto
      del humano (example/ vacío, código de ejemplo en src/, scripts/) no
      aparece en ningún commit

### R6 — sin URL hardcodeada
- [x] `grep -rn "3000" mobile-pet-tracker/src` → vacío (exit 1)
- [x] `fetchHealth` devuelve `missing-config` sin llamar a `fetchFn` cuando
      baseUrl es undefined/vacío; ningún fallback en `health.ts` ni `index.tsx`
- Observación (no bloqueante): el test usa `` `http://x:${30 * 100}/v1` `` para
      esquivar el grep. El fondo del requisito se cumple (los tests no son un
      fallback), pero es jugar con la letra de la verificación; un puerto
      distinto de 3000 en el dato de test habría sido más honesto

### R8 — .env
- [x] `.env` NO tracked (`git ls-files` solo muestra `.env.example`); no existe en disco
- [x] `.gitignore` de la app cubre `.env` (línea 34, añadida en el commit de
      scaffold como ordenó el addendum; `git check-ignore` lo confirma)
- [x] `.env.example` tracked con el placeholder exacto:
      `EXPO_PUBLIC_API_URL=http://192.168.x.x:3000/v1`

### R9 — init.config.sh
- [x] `bun` añadido a `REQUIRED_TOOLS=("node" "pnpm" "bun")` — requisito duro,
      sin `command -v bun && ...` ni ninguna guarda silenciosa en el diff
- [x] INSTALL/TEST/LINT/TYPECHECK con `--cwd mobile-pet-tracker`; `BUILD_CMD` sin cambios (D5)
- [x] `./init.sh` ejecutado por el reviewer → exit 0 (ver output abajo)

### R10 — CI
- [x] `oven-sh/setup-bun@v2` con `bun-version: "1.3.14"` (pineado)
- [x] `actions/cache@v4` sobre `~/.bun/install/cache` con key
      `${{ runner.os }}-bun-${{ hashFiles('mobile-pet-tracker/bun.lock') }}`
- [ ] CI verde remoto: pendiente de confirmar cuando exista el PR (config estática correcta)

### R11 — AGENTS.md
- [x] Fila `mobile-pet-tracker/` presente en la tabla §2 (línea 52)

### R13 — gate humano
- [x] Casilla de smoke en requirements.md sigue VACÍA (correcto: Codex no la marcó)
- Pendiente del humano: smoke de 3 estados en Expo Go / Android físico antes de done

### Contención de cierre
- [x] `feature_list.json`: #31 sigue `in_progress` — Codex no lo tocó
- [x] Sin PR abierta para `feature/31-mobile-app-scaffold` (`gh pr list --state all` vacío)
- [x] R7: 4 estados + retry con `testID="health-state"` y `testID="health-retry"` exactos

## Observaciones
1. (No bloqueante) `30 * 100` en `health.test.ts` para esquivar el grep de R6 — ver arriba.
2. (No bloqueante) Los commits verdes de R6 y R7 tocan sus tests además de la
   implementación: en R6 es el refactor de literales del punto 1; en R7 añade
   `await` a `render`/`fireEvent.press` (API de testing-library). Las aserciones
   no se debilitaron en ningún caso.
3. R10 queda con verificación remota pendiente: el reviewer confirma CI verde
   en el PR cuando el leader lo abra.
4. La fila R13 de traceability.md permanece "pendiente" hasta el smoke humano;
   este APROBADO cubre R1-R12 y NO habilita marcar done sin ese gate.

## Output de ./init.sh (ejecutado por el reviewer, tail)
```
$ jest
PASS src/api/__tests__/health.test.ts
PASS src/app/__tests__/index.test.tsx

Test Suites: 2 passed, 2 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        3.145 s
Ran all test suites.
✅ Tests pasados

→ Tests e2e...
⚠️  Puerto 5432 sin respuesta — se saltan los e2e (levanta la infra con: docker compose up -d)

→ Lint...
> backend-pet-tracker@0.0.1 lint
> pet-tracker-infra@0.0.1 lint
$ expo lint
✅ Lint sin errores

→ Typecheck...
$ tsc --noEmit
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
INIT_EXIT=0
```
Nota: los e2e de backend se saltaron porque Docker/Postgres estaba abajo —
condición conocida y aceptada por el handoff; no es regresión (los tests
unitarios de backend, infra y app corrieron todos verdes).
