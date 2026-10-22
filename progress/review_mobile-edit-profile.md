# review: mobile-edit-profile
Fecha: 2026-10-21
Veredicto: APROBADO

Worktree `/home/claude/sites/Pet-Tracker-wt-194`, branch `feature/194-mobile-edit-profile`,
HEAD `923f9875afa8b4c28135019f9e7236d6921097b7`, base H0 `2ab5a1637fb9578ade4563c3a5af0e69ee31ef28`.
Revisado: reporte de Codex (con Reanudaciones 3-5), spec R1-R11 + E1/E2, traceability, handoff,
codigo real de todos los ficheros del diff, historia de 34 commits, mutaciones plantadas por el reviewer.

Alcance de lo que NO cuenta como defecto (acordado con el leader):
- Los recuentos de rojos de la tabla de sondas (S6.1, S7.x, S9.2): Reanudacion 4 los sustituye; una sonda es conforme si el caso nombrado se pone rojo y todo rojo extra lo explica la mutacion.
- E1 (3 inventarios de R6) y E2 (lista text-13 de profile-canvas-fidelity): huecos de la spec, ya enmendados y firmados.
- R11 (humo Android) y las dos casillas de R10 (Enmienda #194 en `docs/ui-guidelines.md`, A22 en `docs/conventions.md`): son del humano y siguen sin marcar a proposito.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`grep -c '"status": "in_progress"' feature_list.json` = 1; es #194 `mobile-edit-profile`)
- [x] progress/current.md actualizado (sesion #194, rama, worktree, humano pendiente R10/R11). Nota menor: su linea «init.sh: NO corrido todavia» esta caducada (el leader lo corrio, exit 0); la corrige el leader al cerrar.

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: no aplica al backend; `git diff --name-only H0..HEAD | grep -c '^backend-pet-tracker/'` = 0
- [x] repositories/contratos en domain son interfaces puras: n/a (sin cambios de backend)
- [x] application depende de interfaces, no implementaciones: n/a
- [x] infrastructure sin logica de negocio: n/a. En movil: ruta delgada `src/app/edit-profile.tsx` (5 lineas, solo `<EditProfileScreen />`), cliente HTTP en `src/api/users.ts` (`updateMe` via `patchJson`, mapeo 401->unauthorized, 400->validation, no 200->error, cuerpo 200 comprobado con `isProfileResponse`), reglas puras en `src/utils/account-rules.ts` (`validateProfile`, `validateRegister` reutiliza `...validateProfile(values)`).

Calidad de `src/screens/edit-profile/index.tsx` (leido entero): semillas con `useState(me.*)` sin `useEffect`; un `FieldErrorMessage` por campo (4 + el import = 5, `grep -c FieldErrorMessage` = 5); un solo `signOut(` (`grep -c 'signOut('` = 1); diff parcial recortado (`firstName/lastName/phone` con `.trim()`, `country` sin recortar); mapeo de errores R8 a claves del catalogo (`validation.checkDetails`, `common.cannotReachServer`, generico), nunca texto del servidor; `isDisabled={submitting}` y guarda `if (submitting) return`; `setQueryData(userKeys.me(), { kind: 'ok', me })` y `router.back()` en exito; no-op cierra sin peticion; `KeyboardAvoidingView behavior="padding"` con `keyboardVerticalOffset={headerHeight}`; sin `timezone`, sin email.

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra (`grep -rlE "#194 R$n\b"` sobre `*.test.ts(x)`): R1 language-provider; R2 account-rules; R3 users.test; R4 detail-stack(.guard/.navigation), layout; R5 edit-profile/index.test, edit-profile.test.ts, ui-language, profile-canvas-fidelity; R6 edit-profile/index.test, ui-language, consistency-classnames, chunky-cta, design-drift; R7 edit-profile/index.test, chunky-cta; R8 edit-profile/index.test, design-drift; R9 profile/index.test; R10 edit-profile.test.ts. R11 no tiene test automatico por diseno (guion en el reporte, firma humana).
- [x] Historial de commits test-primero: 34 commits desde H0 (`git log --oneline H0..HEAD | wc -l` = 34); cada R1-R10 tiene un commit `test(mobile)`/rojo anterior a su `feat`/`docs` verde (hashes en traceability, todos existen: `git cat-file -e <hash>^{commit}` ok para los 26 hashes citados). Excepciones documentadas y legitimas: correcciones de test autorizadas (R2 `5f1defbc`, `1bacbb1c`; R5 `46eab29e`; R9 `d1dd8398`); E2 `0816a95a` sin rojo propio porque el rojo (1 rojo / 25 verdes) se midio sobre `cefbdffc` y consta en la enmienda.
- [x] Verificacion independiente del rojo de R5 contra el stub: `git checkout cd2ec427 -- src/screens/edit-profile/index.tsx` (3 lineas) + `bun run test --runInBand --runTestsByPath src/screens/edit-profile/index.test.tsx -t '#194 R5'` = 6 failed / 20 skipped, todos por aserciones/queries sin nodo (ni ReferenceError ni doble mutado); restaurado con `git checkout HEAD --` (diff 0, cached 0).

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente": filas R1-R10, R11 (humano), E1, E2 con hashes rojo/verde reales; `grep -ci pendiente specs/mobile-edit-profile/traceability.md` solo aparece en la regla del pie, no en filas.
- [x] Commits siguen el formato `feat(mobile): <desc> (#194 Rn)` / `test(mobile): ... (#194 Rn)` / `docs(ui): enmienda #194 (#194 R10)`.

## Checklist C6 — Spec aprobada
- [x] `specs/mobile-edit-profile/requirements.md` con `status: approved`, casilla humana de aprobacion marcada (fecha 2026-10-21) y casillas de E1/E2 marcadas. La unica casilla sin marcar es R11 (humano, a proposito). Cambios en la spec desde H0: solo 4 commits del leader (E1, E2, firma), ninguno de Codex.

## Checklist C7 — Sin codigo huerfano
- [x] Componentes/modulos reemplazados por esta feature fueron eliminados: n/a
- [x] Sus tests tambien: n/a
- [x] N/A — esta feature no reemplaza nada existente (anade ruta, cliente, reglas y una fila en Perfil; `validateRegister` se refactoriza para compartir `validateProfile`, con el NV `#194 R2: validateRegister conserva las issues de perfil`).

## C8 — Carta de UI (nota)
- Catalogo: `bun -e "import {en,es} from './src/i18n/catalog.ts'; ..."` = 438 / 438 claves; `profile.editProfile` y `editProfile.save` aparecen 2 veces en `catalog.ts` (una por idioma) y las 2 filas estan en `specs/mobile-ui-language/design.md` §2.38.
- Docs R10: parrafo A11 de `docs/conventions.md` y `docs/ui-guidelines.md` lista `edit-profile` (enmienda A22 de #194); seccion `## Enmienda #194 — Editar perfil` con `edit-profile-link`, `/edit-profile` y `userKeys.me()`; bloque A22 en conventions. Ambas casillas humanas sin marcar (`- [ ] Enmienda #194 aprobada por humano`, `- [ ] Enmienda A22 aprobada por humano (fecha: ____)`), como corresponde.
- Alcance: `git diff --name-status H0..HEAD` solo toca ficheros de la lista cerrada del handoff mas specs/progress/docs; 0 ficheros en `backend-pet-tracker/`.

## Mutaciones plantadas por el reviewer (solo produccion; cada una revertida con `git checkout HEAD -- <ruta>`)
Tras cada una: `git diff --quiet HEAD -- <ruta>` = 0 y `git diff --cached --quiet` = 0. Al final `git status --short` vacio salvo este fichero.

| # | Mutacion | Fichero | Resultado |
|---|---|---|---|
| M1 | Mover la fila `edit-profile-link` despues de `language-toggle` (orden de hijos de me-card, R9) | `src/screens/profile/index.tsx` | ROJO en `#194 R9: orders the account children for ok without a section label` (1 failed / 154 passed). Atrapada. |
| M2 | Rama «sin cambios» inerte (`length === -1`, R7) | `src/screens/edit-profile/index.tsx` | ROJO en `#194 R7: treats surrounding phone spaces as no change` y `closes without a request when nothing changed` (2 failed / 24 passed). Atrapada. |
| M3 | Quitar `setError(null)` de `handleSubmit` (R8) | idem | ROJO en `#194 R8: clears a server error before displaying field validation` (1 failed). Atrapada. |
| M4 | `changes.firstName = firstName` sin `.trim()` (R7) | idem | ROJO en `#194 R7: sends only the trimmed first name` (1 failed). Atrapada. |
| M5 | `FormError` despues del `Button` (orden de hijos) | idem | VERDE (26/26). Superviviente; ver Observaciones. |
| M6 | Quitar `accessibilityRole="button"` del enlace de Perfil | `src/screens/profile/index.tsx` | ROJO en `#194 R9: opens the editor from the account row` (1 failed). Atrapada. |
| M7 | Enlace visible tambien en estados no-ok (`me.data !== undefined`) | idem | ROJO en `hides editing while the account is pending or unavailable` y los dos `orders the account children for error/unauthorized` (3 failed). Atrapada. |

Comando base: `cd /home/claude/sites/Pet-Tracker-wt-194/mobile-pet-tracker && bun run test --runInBand --runTestsByPath src/screens/<profile|edit-profile>/index.test.tsx`.

## Observaciones
Ninguna bloqueante. Todas informativas / baja severidad:

1. (Baja) M5 sobrevive: la posicion de `edit-profile-error` respecto de `edit-profile-save` no la fija ningun test ni la spec (`grep -n edit-profile-error specs/mobile-edit-profile/requirements.md` solo fija presencia/ausencia y literal). No es un defecto de Codex; si se quiere candar, seria una enmienda de spec.
2. (Baja) `country` se compara sin `trim()` en `handleSubmit` y ninguna fila de R2 cubre un pais con espacios: el contrato (`[A-Z]{2}`, `maxLength={2}`, `toUpperCase`) lo hace inalcanzable por UI; hueco de spec, no de implementacion.
3. (Baja) Parte de R5 (`KeyboardAvoidingView behavior="padding"` / `keyboardVerticalOffset`) se verifica leyendo el texto fuente en lugar de comportamiento; aceptable por la limitacion de RNTL con KAV, y en linea con `teclado-edge-to-edge-kav`.
4. (Cosmetica) `src/api/users.ts`: doble linea en blanco antes del nuevo tipo `UpdateProfileInput`. `prettier` no esta en movil; no rompe lint.
5. (Informativa) `progress/current.md` conserva la linea «init.sh: NO corrido todavia»; el leader la actualiza al cerrar la sesion.
6. (Informativa) Pendientes del humano, NO defectos: firma de Enmienda #194 (ui-guidelines.md), Enmienda A22 (conventions.md) y la prueba R11 en dev build de Android. La feature no debe marcarse `done` hasta que los cierre.

## Output de ./init.sh
Corrido por el leader en el worktree (el clasificador lo deniega al reviewer); log `progress/init-194.log`, posterior al HEAD `923f9875` (HEAD 22:35:44, log 22:52:14). Reviewer no lo repitio, por instruccion expresa.
```
$ expo lint
✅ Lint sin errores
→ Typecheck...
$ tsc --noEmit
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
  Features: 179/192 completadas | 12 pendientes
exit=0

Test Suites: 132 passed, 132 total
Tests:       4356 passed, 4356 total      (movil; T0 130/4297 + 2 suites / +59 tests = 132/4356 esperado)
Test Suites: 3 skipped, 30 passed, 30 of 33 total
Tests:       8 skipped, 468 passed, 476 total   (backend)
```
