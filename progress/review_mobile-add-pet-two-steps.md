# review: mobile-add-pet-two-steps
Fecha: 2026-10-20
Veredicto: APROBADO

HEAD revisado: `ed4462fd168ee5bfc435c51f215c7aca5940336a` (H0 del handoff `e917238f`, 26 commits).
`init.sh` lo corrió el leader sobre ese mismo HEAD (el log termina en `ed4462fd...` y `exit=0`).
Las pruebas propias (rojos, mutaciones, typecheck, lint) las hice en un worktree desechable del scratchpad,
no en el árbol de la feature.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` (`feature_list.json`: solo la #191; las otras coincidencias de `in_progress` son texto de descripciones)
- [x] `progress/current.md` describe la #191, el worktree y el cierre humano pendiente
- [x] Árbol de la feature limpio (`git status --short` vacío) en `ed4462fd`

## Checklist C3 — Arquitectura
- [x] Los cambios son solo de móvil (pantalla, componente compartido, `utils/form-rules.ts`, catálogo, `_layout.tsx`); backend no se toca
- [x] `validateAddPetBasics` es función pura en `utils/form-rules.ts`; `validateAddPet` la reutiliza sin cambiar su firma
- [x] La pantalla sigue el patrón ruta delgada + `src/screens/add-pet/` (ruta en `src/app` intacta)
- [x] `SegmentedControl` compartido en `src/components/`, sin lógica de negocio

## Checklist C4 — TDD
- [x] Cada R1..R11 tiene al menos un test que lo nombra (ver C5)
- [x] Historial test-primero. Commits rojos separados por R, uno por R con su verde:
  `921a6f89`→`ba085a7d` (R1), `f85328bb`→`0cfc685c` (R7 puro), `1165cefb`→`4f2fc961` (R5), `b021f3e4`→`e499681f` (R2),
  `ae6dc9ad`/`58dcdee7`/`25c59c7e`/`70a0c39d`/`70df424c` (rojos R3, R4, R7, R8, R10)→`3010a03d` (verde conjunto),
  `daf9f91d`→`15395c13` (R6), `813017a0`→`f47fece9` (R9), `7f339d27`→`b331fc88` (R11 carta).
- [x] Los commits de test tocan solo tests (más `ui-copy-table.ts`), los de feat solo producción (más `design.md` en R1)
- [x] Rojos reproducidos por mí en el worktree desechable (checkout del commit rojo, un solo fichero de jest):
  - `daf9f91d` (R6): `add-pet/index.test.tsx` 4 failed / 57 passed / 61. Fallan la prueba nueva de métricas y las tres `#186 R4 ... último hermano` (cuyo contenedor pasa de `gap-2` a `gap-1.5`, que prescribe R6). En `15395c13`: 61/61 verdes.
  - `813017a0` (R9): 6 failed / 61 passed / 67; los seis `it` de `#191 R9`.
  - `921a6f89` (R1): 2 failed / 46 passed / 48; `Expected length: 431 / Received length: 429` (autorizado por el humano).
  - `1165cefb` (R5): `Cannot find module '../segmented-control'`.
- [x] El verde conjunto R3/R4/R7/R8/R10 (`3010a03d`) lo prescribió el leader en el handoff; está precedido por cinco commits rojos separados, cada uno con su fallo propio. Aceptable.
- [x] Los seis commits R11 de inventarios "nacen verdes": la producción ya contenía los valores, y los rojos intermedios están documentados en el reporte (corridas tras R5/R2/núcleo/R6/R9). No hay commit de producción sin rojo previo. Aceptable.
- [x] Mutaciones en copia desechable (todas revertidas):
  - `heroui-text-size-merge`: mínimos de vuelta a 200 y 167 fallan con `Received: 199` y `Received: 166`, así que 199/166 son exactos, no holgados.
  - Quitar `&& !leaving` de `prevent`: falla `llama router.back tras guardar con prevent ya falso`.
  - Quitar `&& celebratePetName === null`: fallan `la celebración deja salir por later/pair con prevent falso`.
  - Quitar `setFormError(null)` o `setFieldErrors({})` del callback de atrás: sobreviven (67/67). Es mutante equivalente: `formError` solo se pinta en el paso 2 y `handleContinue` los reinicia antes de volver a él. No es hueco de test (ver observación N4).

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" (R1..R11 con test y commit; R12 es cierre humano declarado)
- [x] Los 14 hashes citados existen y son los commits correctos (`git log -1 --format=%s` coincide con el mensaje de la tabla)
- [x] Los tests citados existen y nombran su R-id (grep por nombre): `#191 R1` en `language-provider.test.tsx`; `#191 R2..R10` en `add-pet/index.test.tsx`; `#191 R5: SegmentedControl` en `segmented-control.test.tsx`; `#191 R7: validateAddPetBasics` en `form-rules.test.ts`; `#191 R11` x2 en `add-pet-two-steps.test.ts`; `#95 R4` en `layout.test.tsx`; grupos `R7: foto opcional tras alta`, `#171 R4`, `#171 R5` presentes
- [x] Commits con formato `feat(mobile): <desc> (R-ids)`
- [ ] Nota menor: el frontmatter de `traceability.md` dice `status: draft`; la propia nota lo explica (revisión y cierre humano por hacer). No bloquea.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved`, casilla humana marcada (2026-10-19) y D1..D5 confirmadas
- [x] Las dos casillas de cierre del humano (enmienda #191 y smoke Android) y la casilla `- [ ] Enmienda #191 aprobada por humano` de `docs/ui-guidelines.md` siguen SIN marcar: ninguna IA firmó por el humano

## Checklist C7 — Sin código huérfano
- [x] `addPet.avatarPreview` eliminada de catálogo, tabla de copy y pantalla (solo aparece en el test negativo de `language-provider.test.tsx`)
- [x] Sus filas/pruebas viejas reescritas (`#95 R6`, `#62 R11`, `#95 R5/R6`), no abandonadas
- [x] El bloque de foto de una sola página con vista previa de texto ya no existe; la foto vive en el paso 1

## Checklist C8 — UI móvil (docs/ui-guidelines.md)
- [x] Tokens/clases de la carta; sin hex, `StyleSheet` ni `[...]` arbitrarios en `add-pet/index.tsx` ni `segmented-control.tsx` (grep vacío); esquina continua en 6 y 2 sitios (candados del R11)
- [x] `rounded-16` x2 en la pantalla (foto es `Pressable`; CTA con `chunkyLip.primary`), `FieldErrorMessage` x4, `usePreventRemove` x1
- [x] Zonas táctiles: `TOUCH_SLOP` en segmentos; tamaños `h-14`, `h-12`, `h-9.5` según R3..R6
- [x] Enmienda #191 en la carta con indicador, foto y burbuja, selector, métricas, las siete desviaciones conscientes y la regla de radios dentro de la regla 12
- [x] El canvas no dibuja el paso 2: partición inferida y confirmada por el humano (D1..D5). El paso 2 queda por validar en el smoke Android (R12)

## Puntos del leader
1. TDD: ver C4. Reproducidos cuatro rojos (R1, R5, R6, R9).
2. Ampliaciones autorizadas: el diff H0..HEAD de los guards coincide con lo declarado (alerts +1 `rounded-10`/+1 `text-15`/+1 `tracking-title`; chunky-cta Continuar, `Set` en `ctaFiles`, radios 1→2, 26→27 `rounded-16`; consistency primarios 16→17, `bg-accent-soft` −2, esquinas +3; design-drift; profile-canvas; heroui 200→199 y 167→166; #177 R8.4 con comprobación explícita de `<Pressable` sin `chunkyLip|border-b-`). Sin `skip`/`only`/`todo` en el diff. Tests antiguos adaptados conservan la intención (validación, payload, mensajes, persistencia, foto, fechas locales, teclado, celebración, `PICKER_MOCK_UNARMED` x3). Cambios menores: aserciones de `name-input value` sustituidas por payload exacto de `createPet` (el nombre no se pinta en el paso 2); "último hermano" por testID del último hijo. Ninguno debilita.
3. Los 29 fallos tras R9 no reaparecieron: `init.sh` corrió la suite móvil completa sobre `ed4462fd` con `Test Suites: 126 passed, 126 total / Tests: 4192 passed, 4192 total`, igual que el 126/4192 final del implementer. Compatible con flake por carga (worktrees en paralelo; H0 ya mostraba timeouts de carga que pasan solos). No hay contaminación entre ficheros que se vea en dos corridas completas verdes. Sin causa probada, ver N3b.
4. Producción vs spec: coincide (SegmentedControl, `validateAddPetBasics`, catálogo 3 claves nuevas y `avatarPreview` fuera, `_layout.tsx` con `title: ''`, paso 2→1 con datos conservados, 400 se queda en el paso 2, fallo de foto post-alta, celebración #171 intacta, es/en).
5. Trazabilidad: ver C5.
6. UI: ver C8.
7. Deriva: la rama está 57 commits detrás de `origin/main` (`6668bda4`: #190 y #184 mergeadas). Ficheros tocados por ambos lados: `docs/ui-guidelines.md`, `alerts-canvas-fidelity.test.ts`, `consistency-classnames.test.ts`, `profile-canvas-fidelity.test.ts`, `ui-copy-table.ts`, `ui-language.test.ts`, `src/i18n/catalog.ts`, `language-provider.test.tsx`. `_layout.tsx` y `add-pet/index.tsx` no se solapan. Main además cambia `screens/home`, `screens/profile`, `theme/global.css`, `pet-switcher.test.tsx`. Tras mergear main hay que re-medir: B1 (EN pasa de 429 a 433 por las cuatro `home.pingoPhrase*`; fórmula `+ 3 - 1` y el test de longitud de `language-provider`), `R9_ADD_PET` y `ui-copy-table.ts` (filas de #190 y #184), mínimos de `heroui-text-size-merge` (199/166, porque profile y home cambian), inventarios de `consistency-classnames`/`chunky-cta`/`design-drift`/`profile-canvas-fidelity`/`alerts-canvas-fidelity` (conteos globales y listas), numeración `§2.37` de `specs/mobile-ui-language/design.md` (hoy libre en main), e `init.sh` completo. No he mergeado.
8. `bun run typecheck`: salida 0. `bunx expo lint --no-cache`: salida 0 con log vacío (`test ! -s`); verifiqué que el linter detecta una variable sin usar plantada (y la revertí). `init.sh` además imprimió "Lint sin errores" y "Typecheck sin errores".

## Observaciones
Ninguna bloqueante. No bloqueantes:
- N1: `birth-date-field` lleva `h-12 ... px-3.5` sin `justify-center`; la receta del R6 es literal, pero el texto de la fecha puede quedar arriba en la caja de 48 px mientras los `TextInput` se centran solos. Mirar en el smoke Android y, si se ve mal, enmienda de spec.
- N2: un `photoError` del paso 1 (p. ej. formato inválido) sigue pintándose bajo el CTA del paso 2. UX menor, sin spec que lo prohíba.
- N3: `usePreventRemove` es falso mientras `submitting` (literal de la spec): atrás durante el guardado sale de la pantalla.
- N3b: el implementer no atribuyó causa a los 29 fallos de la corrida intermedia; queda como flake por carga, sin prueba directa.
- N4: las limpiezas de `setFieldErrors({})`/`setFormError(null)` del callback de atrás son redundantes en lo observable (mutante equivalente); inofensivas.
- N5: R12 (casilla de la enmienda en carta y spec, smoke en dev build Android, paso 2 sin canvas) sigue siendo del humano. La feature no debe pasar a `done` sin él.
- N6: antes de la PR hay que mergear `origin/main` y re-medir lo listado en el punto 7; no rebasear tras la trazabilidad (los hashes cambiarían).

## Output de ./init.sh
Log: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/2dbbb28f-b9c4-47cc-991b-ea8141606dae/scratchpad/init191.log` (HEAD del log == HEAD del worktree == `ed4462fd168ee5bfc435c51f215c7aca5940336a`)
```
✅ Build exitoso
Test Suites: 187 passed, 187 total      (backend/infra)
Tests:       1474 passed, 1474 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Test Suites: 126 passed, 126 total      (mobile)
Tests:       4192 passed, 4192 total
Snapshots:   1 passed, 1 total
✅ Tests pasados
Test Suites: 3 skipped, 30 passed, 30 of 33 total      (e2e)
Tests:       8 skipped, 468 passed, 476 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
ed4462fd168ee5bfc435c51f215c7aca5940336a
exit=0
```
