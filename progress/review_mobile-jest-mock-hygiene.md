# review: mobile-jest-mock-hygiene
Fecha: 2026-09-03 18:40:47 UTC
Veredicto: APROBADO

Revisado sobre el worktree `/home/claude/sites/Pet-Tracker-wt-53`, branch
`feature/53-mobile-jest-mock-hygiene`, HEAD `99a69d0` (base `041d5b8`,
`origin/main` = `0a5773e`, ancestro de HEAD). Toda la evidencia de abajo la
ejecutó el reviewer; no se aceptó ninguna cifra del impl report sin repetirla.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`#53 mobile-jest-mock-hygiene`)
- [x] progress/current.md actualizado (describe la sesión #53 y el worktree)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure — N/A: no se tocó código de aplicación
- [x] repositories/contratos en domain son interfaces puras — N/A
- [x] application depende de interfaces, no implementaciones — N/A
- [x] infrastructure sin lógica de negocio — N/A
- Único archivo de código en `git diff 041d5b8 HEAD -- mobile-pet-tracker/`:
  `mobile-pet-tracker/src/screens/add-pet/index.test.tsx` (+15, -0). La
  pantalla `index.tsx` no cambia.

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra: R1 →
  `describe('R1 (mobile-jest-mock-hygiene): el mock del picker se reinicializa por test')`
  (línea 269, al final del archivo tras `R7`, como pide D5). R2 y R3 son
  gates de verificación sin test propio por diseño (precedente #52 R5).
- [x] Historial rojo→verde: `79caf8c` (test rojo, 18:11:39Z) precede a
  `43183c4` (beforeEach, 18:12:11Z); commits separados, el rojo solo añade
  el `describe` R1, el verde solo añade el `beforeEach` de archivo.
- Rojo reproducido por el reviewer con el archivo de `79caf8c` sobre el
  worktree (`bun run test -- src/screens/add-pet/index.test.tsx`, exit 1):
  ```
  Tests:       1 failed, 7 passed, 8 total
  -   "assets": null,
  -   "canceled": true,
  +   "assets": Array [ Object { "mimeType": "image/jpeg", "uri": "file:///new-pet.jpg" } ],
  +   "canceled": false,
  ```
  Es la fuga del test de la línea 215/222, no un expect artificial. Archivo
  restaurado a HEAD después (`git status` limpio).
- Bucle D6 sobre HEAD (10 corridas, comando literal de design.md): 10/10
  `Tests:       8 passed, 8 total`, exit 0.

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" (R1, R2, R3 rellenas con test/evidencia y hash)
- [x] Commits siguen el formato `<tipo>(<scope>): <desc> (R-ids)`:
  `test(...) (R1)`, `fix(...) (R1)`, `test(...) (R2)`, `test(...) (R2,R3)`,
  `docs(...) (R1,R2,R3)`

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved` y casilla humana marcada
  (2026-09-03). Aprobación humana en `acafd69` (AlexisSM377). Desde ese
  commit solo cambió el frontmatter `draft → approved` en
  requirements/design/tasks (flujo documentado) y traceability.md; ningún
  requisito modificado tras el gate.

## Checklist C7 — Sin código huérfano
- [ ] Componentes/módulos reemplazados por esta feature fueron eliminados
- [ ] Sus tests también fueron eliminados
- [x] N/A — esta feature no reemplaza nada existente

## Verificaciones específicas de la spec
- R1 / D1 / D4: un único `beforeEach` de nivel de archivo (líneas 76-79),
  entre `renderAddPet` y `describe('R6')`, con `mockReset()` seguido de
  `mockResolvedValue({ canceled: true, assets: null })` en ese orden.
- Los 7 tests previos (6 en R6, 1 en R7) conservan nombre y contenido: el
  diff `041d5b8..HEAD` no tiene líneas borradas; el override de
  `'uploads a chosen preview only after createPet succeeds'` sigue intacto
  (ahora línea 222). El archivo en `041d5b8` es byte-idéntico al de `origin/main`.
- R3 / D2 / D7: `git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/test/`
  vacío; `mobile-pet-tracker/jest.config.*` no existe. Ningún flag
  `clearMocks`/`resetMocks`/`restoreMocks`.
- C8 no aplica: sin UI.

## Observaciones
Ninguna bloqueante. Notas de bookkeeping para el leader (fuera del alcance de
la implementación, ya señaladas en la spec): `feature_list.json` #53 lista
`mobile-pet-tracker/jest.config.js` en `files_affected` y ese archivo no
existe; `init.sh` avisa `STATUS.md desactualizado (55/59 declarado vs 55/60 real)`.

## Output de ./init.sh
Ejecutado por el reviewer desde `/home/claude/sites/Pet-Tracker-wt-53`
(log completo: 10730 líneas; aquí las líneas de resumen). Exit 0.
```
✅ node disponible (/usr/bin/node)
✅ pnpm disponible (/home/claude/.npm-global/bin/pnpm)
✅ bun disponible (/home/claude/.npm-global/bin/bun)
✅ .env encontrado
✅   DATABASE_URL definida
⚠️  .env desactualizado: faltan 3 claves de .env.example
⚠️    configuración ausente: RESEND_API_KEY, RESEND_FROM, RESET_LINK_HOST
✅ Dependencias instaladas
✅ Archivos del harness presentes
⚠️  Feature en progreso: mobile-jest-mock-hygiene
⚠️  STATUS.md desactualizado (55/59 declarado vs 55/60 real) — actualízalo antes de cerrar la sesión
✅ Build exitoso
# backend
Test Suites: 163 passed, 163 total
Tests:       1235 passed, 1235 total
# infra
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
# móvil (etapa de R3)
Test Suites: 53 passed, 53 total
Tests:       613 passed, 613 total
✅ Tests pasados
# e2e
Test Suites: 3 skipped, 25 passed, 25 of 28 total
Tests:       8 skipped, 353 passed, 361 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
init.sh exit: 0
```
