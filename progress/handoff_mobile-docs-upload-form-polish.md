Worktree: /home/claude/sites/Pet-Tracker-wt-185
Antes de tocar nada, confirma en el reporte: `pwd` y `git branch --show-current` (debe ser feature/185-mobile-docs-upload-form-polish)
Feature: mobile-docs-upload-form-polish (#185), branch: feature/185-mobile-docs-upload-form-polish
Spec aprobada: specs/mobile-docs-upload-form-polish/requirements.md (status: approved, firma en f7a61348; P1 = A, pantalla propia)
Lee también: specs/mobile-docs-upload-form-polish/design.md, tasks.md y traceability.md. Ejecuta las tareas de tasks.md en su orden, rama A (T2A) solamente; T2B y T2C no aplican.
Archivos a crear/modificar (rutas desde la raíz del repo, prefijo mobile-pet-tracker/ salvo indicación):
  - mobile-pet-tracker/src/app/pets/[petId]/docs-upload.tsx (nuevo: ruta delgada, export default DocsUploadRoute)
  - mobile-pet-tracker/src/screens/docs-upload-form/index.tsx (nuevo: DocsUploadFormScreen({ petId }))
  - mobile-pet-tracker/src/screens/docs-upload-form/index.test.tsx (nuevo: Test-F)
  - mobile-pet-tracker/src/screens/docs/index.tsx y index.test.tsx (sacar el formulario de la lista)
  - mobile-pet-tracker/src/app/_layout.tsx (Stack.Screen pets/[petId]/docs-upload)
  - mobile-pet-tracker/src/__tests__/ui-language.test.ts, ui-copy-table.ts, consistency-classnames.test.ts, detail-stack*.test.tsx, layout.test.tsx (deltas Δ1 a Δ4 de R10)
  - docs/conventions.md y docs/ui-guidelines.md (lista A11, Δ5)
Reglas críticas:
  - Seguir la arquitectura documentada en docs/architecture.md
  - Seguir convenciones de docs/conventions.md
  - Toca mobile-pet-tracker/: seguir docs/ui-guidelines.md. Skills del plugin expo de Codex que sí existen para esta feature: `building-native-ui` (UI, componentes, espaciado) y `native-data-fetching` no aplica. NO hay skill de expo-router en tu catálogo: no busques ninguna. La guía de rutas está en la spec (R2). Dilo en el reporte: «cargué building-native-ui» o «no cargué ninguna skill de expo, usé la spec».
  - TDD por requisito: test rojo → verde → refactor (ver tasks.md)
  - UN COMMIT POR REQUISITO como mínimo, con el test rojo antes que su implementación. Un único commit con todo incumple C4 de CHECKPOINTS.md
  - Rellenar specs/mobile-docs-upload-form-polish/traceability.md con los hashes en UN commit final `docs(mobile): ...` tras el último verde. No mezclar ficheros de arnés en los commits TDD
  - Comandos desde mobile-pet-tracker/ con `bunx` y `bun`. Nunca `npx` ni `npm`. No lances `./init.sh`.
  - Antes de cada `bunx tsc --noEmit`: `test ! -e .expo/types/router.d.ts` y PARAR si existe. Nunca `rm -f`
  - NO son tuyos, no los toques: progress/history.md, progress/current.md, STATUS.md, progress/review_*.md y el campo `status` de feature_list.json. Son artefactos de cierre del leader.
  - Si el sandbox te deniega un comando, PARA y repórtalo. No lo sustituyas por otro que haga lo mismo con otra herramienta
  - NO abras la PR ni la edites: la abre el leader al cerrar, con el veredicto en la mano
  - NO crees recursos AWS ni hagas deploy. La prueba de humo R11 la hace el humano en dev build de Android: no la simules
Criterios de aceptación: R1, R2.1 a R2.6 (rama A), R5, R6 (con H0 de T0.4), R7, R8, R9, R10 (deltas de la rama A). R3 y R4 no aplican.
Al terminar: escribir resultado en progress/impl_mobile-docs-upload-form-polish.md (qué R-id cierra cada commit, medidas de H0, skills cargadas, qué quedó pendiente)
Última acción: crear progress/impl_mobile-docs-upload-form-polish.done con una sola línea: la ruta de progress/impl_mobile-docs-upload-form-polish.md. Es el marcador que vigila scripts/harness/watch-impl.sh y avisa al leader; no lo commitees (está en .gitignore).
