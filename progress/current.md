# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

## Feature #117 mobile-forgot-password

- Sesión: Backend (Claude Code, leader). Fecha de inicio: 2026-10-04.
- Worktree: `/home/claude/sites/Pet-Tracker-wt-backend` (Postgres 5433,
  base `pet_tracker_wt`). Branch `feature/117-mobile-forgot-password` desde
  `origin/main` `b2a9c2aa`.
- Orden del humano: la entrada de `feature_list.json` decía (2026-09-23) que
  #115-#119 iban al final, después de #18 y #60. La sesión Frontend relató el
  2026-10-04 que el humano adelantó ese orden y repartió #117 a esta sesión y
  #118 a Frontend. No lo he verificado con el humano directamente; si no es
  así, la spec se descarta antes del gate.
- `./init.sh`: no se ha corrido en este worktree para esta sesión. Frontend
  lo corrió sobre `b2a9c2aa` en el worktree principal con EXIT=0 (su
  scratchpad). Para escribir la spec no hace falta árbol verde; se correrá
  aquí antes de lanzar al `reviewer`, avisando a Frontend (LocalStack
  compartido).
- Contexto compartido (en `origin/feature/118-mobile-welcome-splash`,
  `711cfd19`, todavía no en main): `progress/explore_ui-appllama.md` §0 y §2
  y la enmienda del límite 3 de `docs/ui-guidelines.md`. No se copian a esta
  branch; la spec los cita por ruta.
- Reparto de ficheros con #118 (pactado con Frontend 2026-10-04):
  - #117: `src/app/(auth)/forgot.tsx`, nuevo `src/screens/forgot/`,
    `src/api/auth.ts` y sus tests.
  - #118: `src/app/index.tsx`, `src/app/_layout.tsx`, posible
    `src/app/welcome.tsx` + `src/screens/welcome/`.
  - Compartidos: `src/i18n/catalog.ts`, `src/__tests__/ui-copy-table.ts`,
    `src/providers/__tests__/language-provider.test.tsx` y
    `specs/mobile-ui-language/design.md` §2. Quien mergee segundo rebasea y
    recuenta; los deltas de candados se declaran como diferencia.
- Contrato backend verificado en `b2a9c2aa`: `POST /v1/auth/forgot-password`
  responde 200 `{ requested: true }` exista o no la cuenta; 400 con `errors`
  de zod (`email: z.email().max(320)`); 429 `{ statusCode: 429, message:
  'Too Many Requests' }` a partir de la cuarta petición por correo en una hora
  (`FORGOT_PASSWORD_MAX_PER_EMAIL = 3`, guard antes del use-case, así que el
  429 tampoco revela existencia). Token con TTL de 1 h, no publicado en la
  respuesta.
- Estado: spec escrita por `spec_author` y verificada contra `b2a9c2aa`;
  `feature_list.json` en `spec_ready`. Espejo a Notion (Specs, En revisión)
  y gate humano pendientes.
