# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

## Feature #149 mobile-sign-out-lands-on-welcome

- Sesión: Backend (Claude Code, leader). Inicio: 2026-10-06. Orden del
  humano en el chat: «arranca con #149» (la recomendó el leader por ser la
  única P2 pendiente).
- Worktree: `/home/claude/sites/Pet-Tracker-wt-backend` (Postgres 5433,
  base `pet_tracker_wt`). Branch `feature/149-mobile-sign-out-lands-on-welcome`
  desde `origin/main` `e002a4a5` (con #117 mergeada, PR #195).
- `./init.sh`: no se corre para la spec. El código de `backend-pet-tracker`,
  `mobile-pet-tracker` e `infra-pet-tracker` en `e002a4a5` es idéntico al de
  `588a777a`, donde `./init.sh` dio exit 0 el 2026-10-05 (gate de #117). Se
  correrá aquí antes del `reviewer`, avisando a Frontend.
- En paralelo: Frontend con #115 `mobile-health-make-parity` en el tree
  principal (spec). Avisada del arranque y de los ficheros probables.
- Premisas de la entrada de `feature_list.json` verificadas por grep en
  `e002a4a5`: `src/app/(tabs)/_layout.tsx` devuelve
  `<Redirect href="/login" />` sin sesión y `src/app/index.tsx` redirige a
  `/welcome`. `signOut` se llama desde `src/screens/profile/index.tsx`,
  `src/screens/add-pet/index.tsx`, `src/screens/meal-schedule/index.tsx` y
  `src/providers/query-provider.tsx` (401 global), así que la sesión caducada
  pasa hoy por el mismo Redirect.
- Estado: `pending`; `spec_author` lanzado.
- `spec_author` terminó: `spec_ready`, spec en
  `specs/mobile-sign-out-lands-on-welcome/` (requirements, design, tasks,
  traceability). Revisión del leader (2026-10-06) sin defectos: las 19 anclas
  `grep -cF` ejecutadas en `e002a4a5` coinciden; el mapa de R4 medido con la
  regex da hoy las cuatro claves declaradas más `app/(tabs)/_layout.tsx`; 13
  ficheros y 17 llamadas a `signOut` confirmados; package
  `com.trackermex.pettracker` en `app.json`; base de T0 medida sin pipe:
  6 suites, 97 tests, exit 0.
- Siguiente: espejo en Notion (Specs, En revisión) y gate humano de D1, D2 y
  la spec.
- Frontend (2026-10-06): #115 no toca ningún fichero de #149, así que no
  hace falta reparto. #115 toca `src/screens/health/`, `ui-copy-table.ts`
  (filas `R5_HEALTH`), `ui-language.test.ts` (línea de longitud de
  `R5_HEALTH`) y `consistency-classnames.test.ts`. Choque posible solo si
  #149 añade copy: entonces se mueven `ui-copy-table.ts`,
  `ui-language.test.ts` (#65 R18) y `language-provider.test.tsx`. Misma regla
  de siempre: quien mergea segundo deja la expresión de `main` y añade su
  línea de delta debajo. Frontend avisará antes de su `init.sh`.
