# review: mobile-docs-upload-form-polish (#185)
Fecha: 2026-10-18 19:13 UTC (re-revisión tras firma 5064ea1d)
Veredicto: APROBADO (R11 pendiente humano, no bloquea)

Worktree: /home/claude/sites/Pet-Tracker-wt-185 · rama feature/185-mobile-docs-upload-form-polish · P1 = A · HEAD 5064ea1d.

## Alcance de esta re-revisión
- `git diff --stat 5a4603f8..HEAD`: solo `status: draft` → `status: approved` en design, requirements, tasks y traceability (commit 5064ea1d). No cambia código ni texto de requisitos, así que las verificaciones R-id de la revisión anterior siguen válidas sobre el mismo árbol de código.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: [185])
- [x] progress/current.md en plantilla

## Checklist C3 — Arquitectura
- [x] Capa móvil sin domain propio; la pantalla nueva consume `api/media`, `providers/auth-provider`, `utils/civil-today-iso` ya existentes, sin lógica de negocio nueva
- [x] Sin dependencias nuevas (`package.json` sin cambios en el rango)

## Checklist C4 — TDD
- [x] Cada R-id aplicable tiene test que lo nombra (tabla abajo)
- [x] Historial test-primero: R1 `6bf5a61e`→`c001587b`; R2.1 `911d5257`→`c001587b`; R2.3 `2e3e5bf4`→`c001587b`; R5 `cfa63a9d`→`cfafb4c8`; R6 `22b72b13`→`9ee85011` (mutación de producción versionada en el rojo, permitido por C4 quinto punto); R7 `e317c25d`→`fb9fa977`; R8 `6efe40f8`→`28a4aba4` (mismo patrón). No se re-ejecutó jest en cada commit rojo.
- [x] Sin rojos por ReferenceError declarados; sondas S1–S7 documentadas por el implementer

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" (`grep pendiente` vacío; R3/R4 n/a en rama A; R11 pendiente humano, no marcada como superada)
- [x] Commits `tipo(docs): desc (#185 Rn)`

## Checklist C6 — Spec aprobada
- [x] `status: approved` en las cuatro specs (requirements, design, tasks, traceability), commit 5064ea1d
- [x] Casilla humana marcada: P1 = A [x] y «Aprobado por humano» (Notion, 2026-10-18T18:39Z)
- [x] Ningún requisito cambió tras la aprobación: 5064ea1d solo toca la línea de frontmatter

## Checklist C7 — Sin código huérfano
- [x] N/A, la feature no reemplaza ni depreca nada (`docs/index.tsx` ya no contiene `docs-upload-form` ni `selectedDocument`)

## Checklist C8 — UI móvil
- [x] Sin hex ni clases arbitrarias en el código nuevo; sin StyleSheet.create
- [x] Safe area con `useSafeAreaInsets` en la pantalla nueva
- [x] Cabecera nativa `Stack.Screen name="pets/[petId]/docs-upload"` en `src/app/_layout.tsx`; A11 en `docs/conventions.md` y `docs/ui-guidelines.md`
- [x] Sin animaciones nuevas ni Spinner nuevo

## Trazabilidad R-id (código real + test)
| R | Código verificado | Test (describe) |
|---|---|---|
| R1 | `docs/index.tsx`: el formulario no se renderiza en `screen-docs` ni en `docs-keyboard-avoider` | `src/screens/docs/index.test.tsx` › `#185 R1: el formulario no es hijo de la lista` (2 it) |
| R2.1 | `pickDocument` → `router.push({ pathname: '/pets/[petId]/docs-upload', params })` con strings; sin `selectedDocument` en la lista | `index.test.tsx` › `#185 R2.1: elegir archivo navega…` (it.each PDF/JPEG/PNG + 2 rechazos) |
| R2.2 | `docs-upload-form/index.tsx`: `docs-upload-keyboard-avoider` (padding, `keyboardVerticalOffset={headerHeight}`), `screen-docs-upload` (`keyboardShouldPersistTaps="handled"`, padding 24 / gap 16 / paddingBottom insets+24), maxLength 40/120/-/120, placeholder | Test-F › `#185 R2.2: la pantalla monta el formulario con los params` |
| R2.3 | `confirmPetDocumentUpload` ok → `router.dismissTo({ pathname: '/pets/[petId]/docs', params: { petId, uploaded: String(Date.now()) } })`; lista hace `refetchDocs()` + `setFilter('all')` al cambiar `uploaded` no vacío | Test-F › `#185 R2.3: una subida correcta vuelve a la lista`; `index.test.tsx` › `#185 R2.3: la lista refresca…` (2 it) |
| R2.4 | `docs-upload-cancel` → `router.back()` | Test-F › `#185 R2.4: cancelar vuelve atrás` |
| R2.5 | `useEffect` → `router.back()` si falta uri/name; `return null` | Test-F › `#185 R2.5: params ausentes` (it.each uri/name) |
| R2.6 | estados y `submitDocument` en la pantalla nueva; la lista conserva `pickDocument` y el error de selector | cubierto por R9 y R2.1 (según spec) |
| R5 | `<View testID="docs-upload-form" className="gap-4">`, hijos file, 4×TextField, actions, en orden | Test-F › `#185 R5: espacio entre campos` |
| R6 | 4 TextField sin clase extra; `text-field.css` `gap: calc(var(--spacing) * 1.5)` y `--spacing: 0.25rem` = 6 px (medido en H0) | Test-F › `#185 R6: espacio etiqueta-input` (it.each 4 filas) |
| R7 | `<View testID="docs-upload-actions" className="gap-3">` con submit luego cancelar | Test-F › `#185 R7: botones separados` |
| R8 | Clases de submit, Button.Label, cancel, labels e inputs iguales a la tabla de la spec | Test-F › `#185 R8: clases de botón, etiqueta e input intactas` (it.each 6 filas, `toBe`) |
| R9 | Flujo #158 R5–R11 movido a Test-F, 18 it bajo describes `#185 R9 (antes #158 …)`; `#158 R10` queda en la lista | Test-F › `#185 R9 (antes #158 R5/R6/R7/R8/R9/R11)` (6 describes) |
| R10 | Δ1–Δ6 aplicados: SCREEN_FILES, ui-copy-table, consistency-classnames, detail-stack (`['pets/[petId]/docs-upload.tsx', null, '../../../screens/docs-upload-form']`) y layout, A11 en docs, docsChildren | `ui-language.test.ts`, `ui-copy-table`, `consistency-classnames.test.ts`, `design-drift.test.ts` (`#185 R10`), `detail-stack*.test.tsx`, `layout.test.tsx`; dentro de los 113 suites mobile verdes |
| R3 / R4 | No aplican (P1 = A) | n/a |
| R11 | Prueba de humo en dev build Android | Pendiente humano; no marcada como superada |

## Observaciones (no bloqueantes)
1. `specs/mobile-docs-upload-form-polish/tasks.md` tiene 11 casillas `- [ ]` sin marcar (T0.x y T8). El implementer las documenta como cumplidas en `progress/impl_mobile-docs-upload-form-polish.md`. C5/C6 no exigen marcarlas.
2. El implementer añadió `/progress/impl_mobile-docs-upload-form-polish.done` a `.git/info/exclude` local del worktree. Solo local, no versionado.
3. R9 menciona «los nueve nombres»; los describes reales son seis, sin pérdida de `it`.
4. R6 y R8 tienen mutación de producción versionada en el rojo. Permitido por C4.

## Output de ./init.sh
Ejecutado por el reviewer, 2026-10-18 19:13 UTC: **exit 0**. Log en `/tmp/claude-1002/init_review2.log` (fuera del worktree).
```
Test Suites: 187 passed, 187 total   (backend-pet-tracker, Tests: 1474 passed)
Test Suites: 113 passed, 113 total   (Tests: 3748 passed)  [mobile]
Test Suites: 3 skipped, 30 passed, 30 of 33 total          (e2e)
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
  Features: 167/185 completadas | 17 pendientes
```
