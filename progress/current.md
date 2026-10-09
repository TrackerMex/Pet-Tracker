# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

## Feature

#158 `mobile-docs-upload` (P2, in_progress, con Codex). Branch
`feature/158-mobile-docs-upload` en el worktree
`/home/claude/sites/Pet-Tracker-wt-158`, base origin/main `65f37841` (con
#155, #157 y #161 ya mergeadas).

## Estado

- 2026-10-09: elegida por el humano tras el merge de #155 (PR #203). Frontend
  lleva #162 en wt-162, que toca solo el módulo media del backend; #158 es
  solo móvil. Si la spec necesitara tocar el backend de media, hay que
  coordinarlo con Frontend.
- 2026-10-09: `spec_author` terminó: `specs/mobile-docs-upload/`, R1-R13, 7
  decisiones abiertas (DA1-DA7), feature en `spec_ready`. El leader enmendó el
  smoke de R13: se para el backend en vez de poner el modo avión, que corta
  adb inalámbrico y Metro, y se exige `google-services.json` por máquina.
- 2026-10-09: `reviewer` lanzado para pre-verificar la spec antes del gate
  (barrido cláusula × rama × candado, anclas, premisas y entorno del smoke),
  con salida en `progress/review_mobile-docs-upload.md`. Después: aplicar
  hallazgos, espejo en Notion y gate humano.
- 2026-10-09: #159 asignada por el humano a la sesión UI-Pet (wt-159).
  Comparte con #158 `catalog.ts`, `language-provider.test.tsx`,
  `ui-copy-table.ts` y la §2.22 de `specs/mobile-ui-language/design.md`:
  quien mergee segundo recuenta.
- 2026-10-09: pre-verificación de la spec en tres rondas (1: 12 bloqueantes
  y 7 menores; 1b: 3 y 6; 1c: 0 y 2), todas aplicadas. DA8 (`{{petName}}` o
  «tu mascota» en `docs.emptyBody`) queda para el humano. Spec en `b36266e9`.
- 2026-10-09: espejo en Notion, página «#158 mobile-docs-upload» de Specs
  (https://app.notion.com/p/3f46115a9b2781bc8380ead4cfabacbb), con
  `Estado del gate` = En revisión y `Rol actual` = Spec Author. Esperando
  la aprobación del humano.
- 2026-10-09: el humano aprobó la spec en Notion (`Estado del gate` =
  Aprobado, `page_last_edited_at` 2026-10-09T17:31:10.784Z, casilla del gate
  marcada, sin comentarios). DA1-DA8 quedan como estaban escritas: DA8 sigue
  con «de tu mascota». Commit de firma `81d14978`; Notion en `Rol actual` =
  Implementer. origin/main avanzó a `fb1e562d` (#162), que no toca nada de
  móvil.
- 2026-10-09: Frontend arranca #134 (refactor de alertas) en wt-134. Avisado
  de que #158 cambia `'screens/docs/index.tsx'` en `screenSignOutCalls` de
  `design-drift.test.ts`, la línea vecina de las de alerts y alert-detail:
  si #134 cambia las suyas, quien mergee segundo conserva las dos. En
  `ui-copy-table.ts` #158 solo toca `R7_PROFILE`; #134, `R12_ALERTS` y
  `R13_ALERT_DETAIL`.
- 2026-10-09: feature en `in_progress`. Handoff a Codex en
  `progress/handoff_mobile-docs-upload.md` (H0 = el commit que lo añade).
  Plan: Codex instala `expo-document-picker`, añade crear/confirmar y
  `downloadUrl` en `src/api/media.ts`, y en `src/screens/docs/index.tsx` el
  botón y el formulario de subida (solo owner), la apertura con
  `expo-web-browser` (todos los roles) y el `KeyboardAvoidingView`, todo
  test-primero según `tasks.md`. Después: init.sh (lo corre el leader,
  avisando a Frontend y UI-Pet), reviewer y smoke R13 del humano.

### Coordinación con #159 (UI-Pet, 2026-10-09)

UI-Pet fijó sus claves en `feature/159-mobile-no-collar-states-pingo` (b6049e61, medida contra 65f37841). Su spec, `specs/mobile-no-collar-states-pingo/design.md` §Coordinación con #158, recoge los deltas como K1-K9. Ficheros que tocan las dos features:

- `language-provider.test.tsx`, longitud del catálogo:
  - #158: +12 (de 371 a 383).
  - #159: +4 −1 (375 y luego 374).
  - Quien mergee segundo, a 386.
- `ui-copy-table.ts` y `ui-language.test.ts`: no se pisan. #158 solo toca `R7_PROFILE`; #159, `R4_MAP` y `R14_GEOFENCES`.
- `empty-state.test.tsx`:
  - #158 solo cambia la fila `docs.emptyBody` de `copyRows`.
  - #159 cambia K7 de map y geofences y añade `describe` al final.
- `specs/mobile-ui-language/design.md`: la §2.22 es de #158 y la §2.23 de #159.
- UI-Pet confirmó (medido sobre 65f37841 + b6049e61) que #159 no mueve `rounded-xl bg-accent`, ni `design-drift`, ni `SCREEN_FILES`. `consistency-classnames` es solo de #158 (de 17 a 19). Si DA8 cambia los literales o el recuento de #158, hay que avisar a UI-Pet.
- Hecho: §Coordinación con #159 está en el design.md de #158.
