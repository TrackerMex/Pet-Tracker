# review: mobile-pets-profile (#40)
Fecha: 2026-08-24 (revisión inicial) · 2026-08-24 (delta review fix 1)
Veredicto: APROBADO (revisión inicial RECHAZADO por C7; resuelto en fix 1 — ver §Delta review fix1)

> Revisión independiente sobre branch `feature/40-mobile-pets-profile`
> (HEAD `b656540`). Implementación de Codex CLI verificada archivo por
> archivo y gate por gate; no se aceptó el reporte del implementer como
> evidencia. Un único hallazgo bloqueante (C7); todo lo demás está en verde.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` (#40) en `feature_list.json`
- [x] `progress/current.md` describe la sesión activa (handoff, implementación, gates pendientes)

## Checklist C3 — Arquitectura
- [x] `backend-pet-tracker/` e `infra/` sin ningún cambio (`git diff main...HEAD` = 0 archivos)
- [x] Capa `src/api/` móvil pura: sin imports de React ni expo-secure-store; patrón fetchFn/kind de `reminders.ts` replicado en `users.ts`, `media.ts` y `createPet`
- [x] Estructura Expo oficial: routes delgados (`app/(tabs)/profile.tsx` 5 líneas, `app/pets/add.tsx` 3, `app/pets/[petId]/docs.tsx` 7) + cuerpos en `src/screens/{profile,add-pet,docs}/index.tsx` con tests colocados; guardia automática de <10 líneas en design-drift R9
- [x] `floating-tab-bar.tsx` intacto; `_layout.tsx` solo lo mínimo de R4 (restauración del tema antes del árbol estable)

## Checklist C4 — TDD
- [x] Cada R1–R9 tiene tests que lo nombran (`describe('R<n>: ...')`) en los archivos exactos que lista la trazabilidad — verificado por grep
- [x] Historial test-primero real: 9 pares rojo→verde, un par por R-id. Todos los hashes de la trazabilidad existen en `git log` y en orden rojo-antes-que-verde
- [x] Los commits rojos son test-only (verificado con `git show --stat`); en cada commit rojo el módulo bajo test aún NO existía en el árbol (`git ls-tree`: `users.ts`, `pet-avatar.tsx`, `add-pet/index.tsx`, `media.ts`, `docs/index.tsx`, `theme-preference.ts` ausentes en su rojo) — los tests no podían pasar
- [x] Excepción C4 permitida (Q2): retirada de los tests de backend health en `src/app/(tabs)/__tests__/profile.test.tsx`, documentada en el cuerpo del commit `ea75755` ("C4 exception approved by Q2")

## Checklist C5 — Trazabilidad
- [x] R1–R9 con test y par de commits reales registrados
- [x] R10 explícitamente "pendiente (smoke humano, no automatizable)" — es el gate humano previsto por la spec, no un hueco del implementer; se cierra en §Aprobación de requirements.md
- [x] Commits siguen `feat(mobile-pets-profile): <desc> (R<n>)`

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` y casilla humana marcada (2026-08-24, commit humano `49b85d6`)
- [x] Ningún requisito modificado tras la aprobación: el único diff posterior (`7ca9aef`) es el flip administrativo del frontmatter draft→approved

## Checklist C7 — Sin código huérfano
- [ ] **FALLA** (revisión inicial) — módulo del backend health check huérfano (ver Observaciones). **Resuelto en fix 1** (`b7b2fb7`), ver §Delta review fix1.
- [ ] (revisión inicial) Sus tests también siguen vivos (`src/api/__tests__/health.test.ts`). **Resuelto en fix 1.**
- La feature SÍ reemplaza algo existente (Q2/R3: "el check de backend health se ELIMINA"), así que C7 aplica.

## Verificación del handoff (reglas específicas #40)
- [x] Dependencias nuevas: SOLO `blobatar@^2.5.0` y `expo-image-picker@~57.0.13` (diff de `package.json` desde `7ca9aef`); `@blobatar/react` ausente; `@gorhom/bottom-sheet` intacto en `^5.2.14`. La guardia design-drift R9 fija las cuatro condiciones en test
- [x] `@expo/ui`: solo `Host` + `@expo/ui/community/datetime-picker` en add-pet (mismo patrón que add-reminder) — apto Expo Go
- [x] Contratos conservados en `src/screens/profile/index.tsx`: `reminders-link` (Pressable, accessibilityRole button, `router.push('/reminders')`), `profile-sign-out` (signOut de useAuth), `theme-toggle` (Uniwind.setTheme + persistencia R4), testID raíz `screen-profile`
- [x] Backend health eliminado de la UI de Profile, con test negativo (`queryByTestId('backend-health-state')` null)
- [x] Dimensiones uniformes patrón home.tsx en Profile, AddPet y Docs: `paddingTop: insets.top + 12`, `padding: 24`, `gap: 16`, `paddingBottom: insets.bottom + 96`; Skeletons dimensionados como el contenido final
- [x] Design-drift: cero hex, cero `StyleSheet`, cero `text-[10px]` en el código nuevo (grep independiente + guardia R9 verde)
- [x] R7: URL presignada solo tras confirmar imagen; `uploadPhotoToUrl` hace PUT crudo con fetchFn, sin token y sin pasar por `http.ts`; MIME limitado a jpeg/png/webp (`resolvePhotoContentType`)
- [x] R6: body cumple `CreatePetSchema` — edad exclusiva (`birthDate` XOR `approxAgeMonths`), opcionales omitidos vía spread condicional, error en `add-pet-error` sin perder lo tecleado, botón deshabilitado durante el POST
- [x] R8: `listPetDocs` contra `GET /pets/:petId/media` (contrato #49) con fetchFn fake en tests; pantalla con skeleton, `docs-empty`, degradación y retry
- [x] R5: `PetAvatar` compartido — `photoUrl` manda, fallback `blobatar(name)` vía SvgXml, determinismo por snapshot; Home reutiliza bajo `pet-card-photo`

## Verificación independiente (ejecutada por el reviewer)
- `bun run test` (mobile-pet-tracker): **exit 0** — 46 suites, 517 tests, 1 snapshot
- `bun run typecheck`: **exit 0**
- `bun run lint`: **exit 0**
- `./init.sh` (raíz): **exit 0** — sin flaky en esta corrida (el e2e de vacunas que el implementer reportó inestable pasó); ver output al final
- `git diff main...HEAD --stat`: 39 archivos, todos dentro de alcance (mobile + specs/progress/STATUS/feature_list); cero cambios en `backend-pet-tracker/`, `infra/`, `floating-tab-bar.tsx`

## Observaciones

### Bloqueante (C7): módulo backend health huérfano

Q2/R3 eliminó el check de backend health de Profile — su ÚNICO consumidor de
producción (verificado: en `main`, `app/(tabs)/profile.tsx` importaba
`fetchHealth` de `../../api/health`; en esta branch ya no lo hace nadie). El
módulo quedó huérfano:

- `mobile-pet-tracker/src/api/health.ts` (`healthUrl`, `fetchHealth`,
  `HealthState`): grep de importadores en todo `src/` devuelve SOLO su propio
  archivo de test. No confundir con `src/api/health-records.ts`
  (vacunas/pesos, #37), que sigue teniendo consumidores y NO se toca.
- `mobile-pet-tracker/src/api/__tests__/health.test.ts`: suite completa de un
  módulo que ya no usa nadie (sigue contando en las 46 suites verdes).

C7 de CHECKPOINTS.md exige eliminar el código reemplazado Y sus tests en el
mismo cierre. Corrección para el implementer: borrar ambos archivos,
documentarlo como parte de la excepción C4/Q2 (mismo criterio que el commit
`ea75755`), actualizar la fila R3 de la trazabilidad si procede, y volver a
dejar `bun run test` + `./init.sh` en verde (quedarán 45 suites).

### Menor (no bloqueante, corregir o justificar en el mismo ciclo)

- `src/app/(tabs)/__tests__/screens.test.tsx` fue modificado (commit
  `91c9ad2`, R9) pese a que R9 enumera como únicos diffs sobre tests
  existentes las extensiones de R2/R3/R5/R6. El diff es solo scaffolding
  (mocks de pets/users/expo-router/image-picker + wrapper con
  `SelectedPetProvider`) necesario porque ProfileScreen ahora carga datos;
  las aserciones originales de #33 (`screen-profile`, sign-out) están
  intactas. Basta con dejarlo anotado en `progress/impl_mobile-pets-profile.md`
  o en la fila R9 de la trazabilidad.

## Output de ./init.sh
```
(cola del output; exit code 0)
Test Suites: 2 skipped, 20 passed, 20 of 22 total
Tests:       6 skipped, 327 passed, 333 total
✅ Tests e2e pasados

→ Lint...
> backend-pet-tracker@0.0.1 lint  (eslint)
> pet-tracker-infra@0.0.1 lint    (eslint)
$ expo lint
✅ Lint sin errores

→ Typecheck...
$ tsc --noEmit
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
INIT_EXIT=0
```

---

## Delta review fix1

Fecha: 2026-08-24. Alcance: commits nuevos desde `b656540` (HEAD ahora
`b7b2fb7`), aplicados por Codex según
`progress/handoff_mobile-pets-profile_fix1.md`. Verificación independiente
del reviewer, no se aceptó el reporte del implementer como evidencia.

### Verificación del delta

- [x] **Un solo commit nuevo**: `b7b2fb7 fix(mobile-pets-profile): remove
  orphaned health module (R3)`. `git diff --stat b656540..HEAD` toca
  exactamente 5 archivos: las 2 eliminaciones de código + 3 archivos de
  docs/progress/spec. Cero cambios de código fuera del fix.
- [x] **Huérfanos eliminados**: `mobile-pet-tracker/src/api/health.ts` (43
  líneas) y `mobile-pet-tracker/src/api/__tests__/health.test.ts` (75
  líneas) ya no existen en el árbol (verificado con `ls`).
- [x] **`src/api/health-records.ts` INTACTO**: `git diff b656540..HEAD` sobre
  el archivo es vacío; su suite `health-records.test.ts` sigue presente y
  verde.
- [x] **Sin referencias colgantes**: grep de `src/api/health` en `src/` no
  devuelve importadores. (El único hit de "health" restante es
  `src/app/(tabs)/__tests__/health.test.tsx` → `src/app/(tabs)/health.tsx`,
  la pantalla del tab Health de #37 — no relacionada con el módulo borrado.)
- [x] **Excepción C4/Q2 documentada en el commit**: cuerpo de `b7b2fb7` dice
  "C4 exception approved by Q2: remove the obsolete backend-health module and
  its tests… leaves health-records.ts untouched" — mismo criterio que
  `ea75755`.
- [x] **Fila R3 de trazabilidad actualizada**: ahora registra "UI, módulo
  huérfano y suite de backend-health retirados; corrección post-review C7".
- [x] **Menor de la revisión inicial resuelto**: la fila R9 de
  `specs/mobile-pets-profile/traceability.md` y
  `progress/impl_mobile-pets-profile.md` §Corrección post-review fix 1
  justifican el diff de `screens.test.tsx` como scaffolding de
  mocks/provider con las aserciones de #33 intactas.

### Verificación independiente (ejecutada por el reviewer, post-fix)

- `bun run test` (mobile-pet-tracker): **exit 0** — 45 suites, 509 tests,
  1 snapshot (antes 46/517: exactamente la suite y los 8 tests del módulo
  huérfano; sin regresiones en el resto)
- `bun run typecheck`: **exit 0**
- `bun run lint`: **exit 0**
- `./init.sh` (raíz): **exit 0** — "✅ Todo verde. Listo para trabajar."

### Output de ./init.sh (delta, cola)

```
→ Lint...
> backend-pet-tracker@0.0.1 lint  (eslint)
> pet-tracker-infra@0.0.1 lint    (eslint)
$ expo lint
✅ Lint sin errores

→ Typecheck...
$ tsc --noEmit
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
INIT_EXIT=0
```

### Veredicto final

**APROBADO.** El bloqueante C7 y el menor de R9 están resueltos; el delta no
introduce ningún otro cambio de código. Queda fuera del veredicto automático
lo ya previsto por la spec: R10 (smoke humano en Expo Go) sigue "pendiente"
por diseño y se cierra en §Aprobación de `requirements.md` antes de marcar
la feature como done; el smoke real de Docs sigue bloqueado por el backend
de #49.
