# review: mobile-meal-schedule-canvas-fidelity
Fecha: 2026-10-16
Veredicto: APROBADO

Feature #179. Worktree `/home/claude/sites/Pet-Tracker-wt-179`, branch `feature/179-mobile-meal-schedule-canvas-fidelity`, HEAD `c7b794db33c21e8c2dfb7a82b43109b734f0c795`, base H0 `0aaeda9d800d053b551f0cc38a9129838357cbc7` (36 commits sobre H0).

Alcance del veredicto: R1 a R13 y las enmiendas E1 y E2. R14 (prueba de humo humana en dev build de Android) sigue pendiente por diseño y su casilla está sin marcar; la feature no puede pasar a `done` hasta que el humano la firme (observación 3).

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (la revisión no toca `feature_list.json` ni `progress/current.md`, tal como pidió el leader; el árbol está limpio: `git status --short` vacío, `git diff --cached` vacío).
- [x] progress/current.md no modificado por el reviewer; el informe del implementer existe en `progress/impl_mobile-meal-schedule-canvas-fidelity.md`.

## Checklist C3 — Arquitectura
Feature solo de `mobile-pet-tracker/` (UI, tokens, catálogo, candados). No hay cambios en `backend-pet-tracker/`, así que domain/application/infrastructure no aplican.
- [x] N/A domain sin imports de infrastructure
- [x] N/A contratos en domain
- [x] N/A application depende de interfaces
- [x] N/A infrastructure sin lógica de negocio
- [x] Estructura Expo respetada: rutas delgadas, pantallas en `src/screens/meal-schedule/index.tsx` y `src/screens/meals-history/index.tsx`; la utilidad `src/utils/month-grid.ts` solo cambia `weekday: 'narrow'`.

## Checklist C4 — TDD
- [x] Cada R<n> (R1 a R13) tiene al menos un test que lo nombra en un `describe`/`it` con el prefijo `#179 R<n>` (ver tabla de traceability y lecturas de MST, MHT, global-css, language-provider, design-drift).
- [x] Historial de commits test-primero: cada R1 a R12 tiene un commit rojo solo de tests anterior a su commit verde (pares `test(...)` / `feat|docs(...)` consecutivos en `git log`). R6 tiene además dos commits rojos (`805dbfdd`, `d5451f1a` por E2) y un commit de preparación `a6d1793b` (dobles de entrada e iconos con tamaño, solo test, nace verde por diseño del handoff). R13 (`e3d053ea`) nace verde por diseño y demuestra su rojo con las sondas S1 a S7 (ver ejecuciones).
- [x] Los rojos fallan por aserción, no por `ReferenceError` ni por doble mutado: R4 10 failed / 137 passed, R6 18 failed / 49 passed, R11 13 failed / 127 passed, con 0 `ReferenceError` en cada salida.

## Checklist C5 — Trazabilidad
- [x] `specs/mobile-meal-schedule-canvas-fidelity/traceability.md` sin filas "pendiente" salvo R14 (pendiente de humano por diseño; permitido por el leader). R1 a R13 en "hecho".
- [x] Los 27 hashes de la tabla existen en la rama y su mensaje coincide con el R de la fila (verificado uno a uno con `git cat-file -t` y `git log -1 --format=%s`).
- [x] Commits siguen `feat|test|docs(<scope>): <desc> (#179 R<n>)`.
- [ ] Observación no bloqueante 2: la cabecera de `traceability.md` dice `status: draft` (línea 3), mientras la de #175 dice `approved`. El leader debe fijarla al cierre.

## Checklist C6 — Spec aprobada
- [x] `specs/mobile-meal-schedule-canvas-fidelity/requirements.md` con `status: approved` y casilla humana marcada (`- [x] Aprobado por humano (fecha: 2026-10-15)`, commit `334fcebc`). Enmiendas E1 y E2 con casilla `[X]`. Casilla de R14 sin marcar.
- [x] La casilla de la carta en `docs/ui-guidelines.md:626` (`- [X] Enmienda de fidelidad al canvas aprobada por humano (fecha: 2026-10-15)`) conserva la firma previa; el diff contra H0 de ese fichero solo añade líneas de reglas de #179.

## Checklist C7 — Sin código huérfano
- [x] Las claves de catálogo retiradas (`dailyGrams`, `mealsPerDay`) se eliminaron de `src/i18n/catalog.ts` y sus filas están marcadas como retiradas en `specs/mobile-ui-language/design.md`, con el nuevo registro §2.32.
- [x] Sus tests/candados (`ui-copy-table.ts`, `ui-language.test.ts`, `language-provider.test.tsx`) se actualizaron en los commits correspondientes; ningún test queda apuntando a las claves retiradas.
- [x] `Card` ya no se importa en `meals-history/index.tsx` (el calendario pasa a `View`).
- [ ] N/A

## Checklist C8 — Carta de UI móvil
- [x] Copy: 5 claves nuevas (`perDay`, `mealsPerDayUnit`, `activity`, `condition`, `food`), fila en `ui-copy-table.ts`, candados `checkUses(ALL_USES)` y `SCREEN_FILES` coherentes.
- [x] Sin clases arbitrarias nuevas: se usan los tokens `--text-22` y `--radius-14` (nuevos en `src/theme/global.css`) y los ya existentes (`--radius-24`, etc.).
- [x] Sin `StyleSheet` en los tests de pantalla (guard de design-drift verde).
- [x] E2: las etiquetas de "Editar", "Añadir comida" y "Generar plan" son `Text` plano (no `Button.Label`); el className de los botones lleva los prefijos BEM de HeroUI (`pressable-feedback__root button__root `) y se aserta con `startsWith` más `endsWith` literal; el tracking va emparejado con `text-*` (`text-2xl font-black tracking-title`).
- [x] Candados no tautológicos (ver ejecuciones: sondas y mutaciones propias).

## Verificación del código real (punto 2)
- `src/screens/meal-schedule/index.tsx`: R4 a R8 y E2 conforme. `contentContainerStyle` con padding horizontal 20, top 24, gap 14; título `meal-schedule-heading` con `accessibilityRole="header"` y `text-2xl font-black tracking-title text-foreground`; resumen `rounded-24 bg-accent border-b-5 border-black/25 p-4` con `CONTINUOUS_CORNER` dentro de `HomeEntrance index={0}`; tres columnas `text-22 font-black` con etiqueta `text-xs`; filas `Card variant="flat"` en `HomeEntrance index={index+1}`; tile `size-10.5 ... rounded-14` con `CATEGORY_SLOTS.amber.surface` y `Clock size={20}`; "Editar" con `hitSlop={TOUCH_SLOP}` y etiqueta `Text`; acciones `flex-row gap-2.5` ("Añadir" `h-13.5`, "Generar" `variant="tertiary"` `h-12.5` con `Sparkles size={16}`); píldoras de perfil con la de condición solo si `bodyCondition !== null`.
- `src/screens/meals-history/index.tsx`: R9 a R12 conforme. Título `meals-history-heading`; calendario `rounded-24 border border-border bg-surface p-3.5` con `HomeEntrance index={0}`; flechas `size-10 rounded-xl bg-default` con `hitSlop` y chevrons 18; cabecera de día `text-xs font-bold text-muted`; celdas `h-11 flex-1 ... rounded-full` con `bg-tab-pill` en la seleccionada, punto `size-1.25 rounded-full bg-accent` o espaciador; panel del día fuera del calendario, `rounded-24 bg-surface-secondary p-4` en `HomeEntrance index={1}`, con cajas de hora `min-w-20 flex-1 rounded-14 bg-surface p-2.5`.
- `src/utils/month-grid.ts`: `weekday: 'narrow'`. `src/app/_layout.tsx`: `title: ''` en `meal-schedule` y `meals-history`. `src/theme/global.css`: `--radius-14: 14px` y `--text-22: 22px`. `src/i18n/catalog.ts`: 5 claves nuevas, 2 retiradas.
- Lista cerrada (punto 4): `git diff --no-renames --name-only H0..HEAD -- .` menos los ficheros excluidos del handoff coincide exactamente con las 23 rutas del handoff (sin ficheros de más ni de menos).

## Observaciones
Ninguna bloqueante.

1. No bloqueante, cosmética. `mobile-pet-tracker/src/app/_layout.tsx:99`: la línea de `<Stack.Screen name="meal-schedule" ...>` tiene 12 espacios de sangría cuando sus vecinas (p. ej. `weight-log`, línea 98) llevan 8. El móvil no tiene prettier ni regla de lint que lo cace, por eso `init.sh` está verde. Puede arreglarse en la PR o dejarse.
2. No bloqueante. `specs/mobile-meal-schedule-canvas-fidelity/traceability.md:3` dice `status: draft`; en #175 la misma cabecera es `approved`. El leader debe ponerla en `approved` en el commit de cierre (la tabla de la línea 14 en adelante ya es correcta).
3. No bloqueante, pendiente por diseño. R14 (prueba de humo humana en dev build de Android) y su casilla `- [ ] Prueba de humo #179 R14 firmada por: ____ — fecha: ____` en `requirements.md` §Aprobación siguen sin marcar. El leader no debe marcar `done` en `feature_list.json` hasta que el humano la cierre. Esta revisión no exime ese gate.
4. No bloqueante, cosmética. `mobile-pet-tracker/src/screens/meal-schedule/index.tsx:53` (`useThemeColors(['category-amber-strong', 'category-violet-strong'])`) supera 140 caracteres; una sola línea del fichero. Sin regla de lint que lo impida en móvil.
5. Informativo, preexistente. El log de `init.sh` contiene el aviso `A worker process has failed to exit gracefully and has been force exited` (línea 47841) y el drift de `.env`; ambos salen en todo ALL móvil desde main y no son regresión de #179.

## Ejecuciones del reviewer (todo en primer plano, sin `./init.sh`, sin AWS)

Lectura de `init.sh` desde el log aportado por el leader (`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/6fddaf9d-e9fb-4a55-ab6a-896f4072fedb/scratchpad/init179-final.log`, 48195 líneas):
```
Test Suites: 111 passed, 111 total
Tests:       3533 passed, 3533 total        (ALL móvil: ALL0 3483 + K 1342 - 1292 = 3533)
Test Suites: 3 skipped, 30 passed, 30 of 33 total
Tests:       8 skipped, 468 passed, 476 total   (e2e backend)
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

Focused tests (`bunx jest --runTestsByPath`, sin la suite entera):
- BASE28 (los 28 ficheros de la lista del handoff, sin flag de timeout): `Test Suites: 28 passed, 28 total` / `Tests: 1342 passed, 1342 total`. K = 1342 confirmado.
- Rojos de R4, R6 y R11 re-ejecutados desde el árbol de un worktree temporal (ya eliminado): R4 `10 failed, 137 passed`; R6 `18 failed, 49 passed`; R11 `13 failed, 127 passed`. 0 ocurrencias de `ReferenceError` en las tres salidas; fallan por aserción.

Sondas del handoff (S2, S3, S4, S6, S7; plantar un defecto, correr `design-drift.test.ts`, revertir con `git checkout HEAD -- <f>`):
```
Tests: 1 failed, 98 passed, 99 total
● #179 R13 ... (un único bloque ● por sonda)
limpio=0   (árbol limpio tras revertir)
```
Cada sonda dejó exactamente un `●` de `#179 R13` en rojo y `limpio=0`.

Mutaciones propias en zona ciega (13): rama `bodyCondition === null`, `key` de los pesos de la semana, `hitSlop` de las flechas, `bg-tab-pill` solo en la rama seleccionada, panel del día dentro/fuera del calendario, clases de color de los números por rama, `index` de `HomeEntrance` en filas, entre otras. Las 13 fueron detectadas por un test o candado y dejaron `limpio=0`.

Estado final del árbol: `git rev-parse HEAD` = `c7b794db33c21e8c2dfb7a82b43109b734f0c795`, `git status --short` vacío, `git diff --cached` vacío. El reviewer solo añade este fichero (sin commitear) en `progress/`.

## Output de ./init.sh
Tomado del log del leader (el clasificador deniega `./init.sh` al subagente; ver política en memoria `init-sh-reviewer-denegado`). Líneas decisivas:
```
Test Suites: 187 passed, 187 total          (backend unit)
Tests:       1474 passed, 1474 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Test Suites: 111 passed, 111 total          (móvil ALL)
Tests:       3533 passed, 3533 total
Test Suites: 3 skipped, 30 passed, 30 of 33 total   (e2e)
Tests:       8 skipped, 468 passed, 476 total
→ Lint...        ✅ Lint sin errores
→ Typecheck...   ✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
