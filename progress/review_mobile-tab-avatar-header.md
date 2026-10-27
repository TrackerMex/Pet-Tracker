Veredicto: APROBADO

# review: mobile-tab-avatar-header (#222)
Fecha: 2026-10-27
Rama: feature/222-mobile-tab-avatar-header, HEAD feb0512d. H0 = 3b65fd09. Diff revisado excluyendo el handoff y sus commits (0194c067, a863a878, e1e7193b, e5e4f1cc).

Aprobado con dos condiciones que no son hallazgos de código: (1) `./init.sh` lo corre el leader, no el reviewer, y debe salir verde antes del cierre; (2) R12 queda pendiente por diseño hasta G4, y G2 y G4 son gates humanos no revisados aquí.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `grep -c '"status": "in_progress"' feature_list.json` = 0 en la rama. #222 sigue `spec_ready` en el worktree; el cambio a in_progress/done lo hace el leader en su cierre.
- [x] progress/current.md sin tocar por Codex (plantilla). Lo actualiza el leader.

## Checklist C3 — Arquitectura
- [x] Solo capa de presentación de `mobile-pet-tracker/` más `docs/` y `specs/`. Sin cambios en `src/api/`, `src/providers/` (salvo el it de recuento autorizado C3b) ni backend.
- [x] `TabPetHeader` no llama a `t()`; las pantallas resuelven `tabHeader.petsScroll`.
- [x] `package.json`, `bun.lock` y `app.json` sin cambios (`git diff --name-only` sin rutas fuera de `mobile-pet-tracker/src`, `specs/`, `docs/conventions.md` y `progress/`).
- [x] Sin `expo-blur` en `tab-pet-header.tsx` (D2).

## Checklist C4 — TDD
- [x] Cada R-id con test nombrado (grep `#222 R<n>` en los `*.test.*`): R1 tab-pet-header.test.tsx; R2 pet-switcher.test.tsx; R3 health; R4 food; R5/R6 profile; R7 health, food y profile; R8 ui-language.test.ts y language-provider.test.tsx; R9 locks reescritos con sufijo `(enmendado por #222 R9)`; R10/R13/R14 tab-headers-canvas.test.ts; R11 hero-header-amendments.test.ts. R12 sin test, por diseño (G4 pendiente).
- [x] Historial test-primero por requisito: 293a41eb→8c5b5981 (R1), 41468ca1→a3a35499 (R2), 6bff6229→939d057d y b310bf02 (R8), 7d38baab→16a33551 (R7), 43439700→82db8291 (R3), 8148f54f/d50782fa→074304a0 (R4), 09acdb5a→3fe62f91 (R6), 205cd084→68dba5b6 (R5), 8bdc8cb1→2886ac98 (R11), 7378a646→10756947 (R13). Los commits de test no tocan producción y los de feat no tocan tests.
- [x] Tests que nacen verdes (R2 default/glass, R6 paddingTop 52, los tres R10, los dos R14): el reporte declara sondas/mutaciones con resultado y restauración. Son guardas de comportamiento ya respetado. R10 prueba el regex contra cadenas positivas y negativas dentro del propio it (no es tautológico). R14.2 solo verifica `not.toMatch(/\bt\(/)` en TabPetHeader; es el candado que pide el spec.
- [x] Copy de R8 literal: es «Mascotas, desliza para ver más»; en «Pets, swipe to see more» (catalog.ts y asserts en ui-language.test.ts).

## Checklist C5 — Trazabilidad
- [x] traceability.md: ninguna fila «pendiente» salvo R12, que queda así por diseño (G4 no delegado; instrucción expresa del leader). Esa excepción la autoriza el leader; si el cierre exige cero filas pendientes, R12 se cierra tras G4.
- [x] Formato de commits `test|feat(mobile): <desc> (R-ids)` respetado.
- [x] Hashes de la tabla existen y corresponden a los commits de rojo y verde listados arriba.

## Checklist C6 — Spec aprobada
- [x] requirements.md: casilla «Aprobado por humano» marcada (firma delegada del leader, 2026-10-27, commit 3b65fd09). El frontmatter dice `status: draft`, igual que las otras 109 specs de la repo con firma por casilla; convención del repo, no hallazgo.
- [x] G4 sin marcar: `grep -cE '^- \[[xX]\] G4 ' specs/mobile-tab-avatar-header/requirements.md` = 0. G2 sin marcar.

## Checklist C7 — Sin código huérfano
- [x] Títulos retirados: ids `health-title`, `food-title`, `food-title-row`, `profile-title` ausentes de producción (R10 lo candan). `health-header` retirado. Claves `health.health`, `food.food`, `profile.profile` siguen con uso real (headings ocultos, R7).
- [x] Fila n:3 de FILAS en profile-photo-hero-canvas.test.ts retirada junto con el literal, y `toHaveLength` 24→23.
- [ ] N/A

## Desviaciones de design.md §4 implementadas tal cual
- Vidrio plano `bg-glass-surface-strong` + `border-b border-border`, sin expo-blur.
- Cabecera `paddingTop: insets.top + 7`, `paddingBottom: 7`, `TAB_PET_HEADER_HEIGHT = 65`, `TAB_PET_HEADER_SCROLL_MIN = 7`.
- Inset de Salud 24 (`edgeInset = 24 - 5`), Nutrición 20. `paddingTop` del scroll `insets.top + 65 + 16` (Salud) y `+ 14` (Nutrición); sin mascotas `insets.top + 12`.
- Perfil: `profile-hero-top` en `flex-row justify-between`, `profile-hero-selector` `min-w-0 flex-1` siempre presente, cápsula única `addPetCapsule`; sin hero `profile-top-row` `justify-end`. Cápsula y chips sin tocar (44).
- Cabecera hermana posterior al scroll; `food-root` añadido.
- Fila de avatares sin `gap-1.5`; `edgeInset` y `scrollHint` opcionales solo en la rama `avatars`.
- Umbral de pista: `length >= TAB_PET_HEADER_SCROLL_MIN`.

## Adendas autorizadas verificadas
- C3b: en `language-provider.test.tsx` solo cambió el it de recuento (`+ 1, // #222 R8`) y su título.
- C19b: en `screens.test.tsx` solo cambió el it.each `renders the $title placeholder` (`getByRole('header', { name: title })`).

## Gates humanos intactos
- R12/L3 sin ejecutar: `docs/ui-guidelines.md` sin diff contra H0 (0 líneas); L3 sin cambios (`#196 R11` sigue exigiendo `**Regla N1 (enmienda #196)**`).
- R11: bloques insertados en seis specs; la séptima (ui-guidelines) queda para G4.
- R13: conventions.md contiene el párrafo exacto de R13.1 (verificado con `grep -cF` = 1), colocado tras la excepción del 2026-10-13.

## Verificación independiente
- `bunx tsc --noEmit` (mobile-pet-tracker): exit 0.
- `bunx expo lint`: exit 0, log vacío (sin SIGKILL silencioso).
- `bunx jest --runTestsByPath` sobre los 15 ficheros tocados (tab-pet-header, pet-switcher, health, food, profile, tab-headers-canvas, hero-header-amendments, ui-language, canvas-foundations, profile-canvas-fidelity, profile-photo-hero-canvas, alerts-canvas-fidelity, language-provider, `(tabs)/screens`, design-drift): 15 suites, 855 tests, todos verdes, exit 0.
- `./init.sh`: NO ejecutado por el reviewer (instrucción del leader; comparte LocalStack/Postgres). Pendiente de que lo corra el leader. Reporte de Codex: suite completa 5745/5745.

## Observaciones (no bloqueantes)
- La indentación de `food/index.tsx` y `health/index.tsx` queda sin reindentar dentro de la nueva raíz (decisión de R14: no tocar interiores); móvil no tiene prettier.
- R12 y los gates G2/G4, más las firmas humanas de enmienda (casillas `- [ ]` de los bloques de R11), siguen pendientes y no se han marcado.
