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
  `feature_list.json` en `spec_ready`. Espejada en Notion (base Specs,
  Estado del gate = En revisión, commit citado `08631f9e`):
  https://app.notion.com/p/3ef6115a9b27811c8cd6e29408fdfe4c
  Aprobada por el humano el 2026-10-04 (Estado del gate = Aprobado,
  page_last_edited_at 2026-10-04T20:26:30.168Z, confirmado por chat);
  commit de firma `6a85ea5c`; `Rol actual` = Implementer en Notion;
  `feature_list.json` en `in_progress`.
- Implementación: Codex CLI en este mismo worktree
  (`/home/claude/sites/Pet-Tracker-wt-backend`), handoff en
  `progress/handoff_mobile-forgot-password.md` (H0 = el commit que lo añade).
  Base medida el 2026-10-04 sobre `6a85ea5c`: 8 suites / 243 tests / exit 0,
  typecheck exit 0, lint exit 0. Mientras Codex implementa, esta sesión no
  toca el working tree; al terminar: `./init.sh` aquí (avisando a Frontend)
  y `reviewer`.
- Primera corrida de Codex (2026-10-04): paró antes de T1, correctamente,
  porque dos anclas del handoff transcribían filas de §1 de
  `specs/mobile-ui-language/design.md` sin sus backticks. Base jest medida
  por Codex igual a la del leader (8 suites / 243 tests, exit 0). El leader
  reescribió las anclas como 27 comandos `grep` ejecutados contra el árbol
  (27/27) y añadió dos avisos verificados: los contadores globales de
  consistency y legibility excluyen `*.test.tsx`, y design-drift sí lee la
  suite co-ubicada nueva. Nuevo H0 = el commit que corrige el handoff.
- #118 (relatado por Frontend 2026-10-04): spec firmada en `16c8e565`, ya
  `in_progress`; Codex implementa en `/home/claude/sites/Pet-Tracker-wt-118`
  sobre `feature/118-mobile-welcome-splash`; el worktree principal volvió a
  `main` (`b2a9c2aa`) para la spec de #116. Sus deltas compartidos: catálogo
  +8 (`welcome.*`), `ui-language` +1 bloque `R16_WELCOME` tras
  `R15_GEOFENCE_EDITOR`, `SCREEN_FILES` +1 (`screens/welcome/index.tsx`),
  consistency `13 + 1 + 1` pasa a `+ 1` en las dos cuentas, layout
  `toHaveLength(5)` +1, legibility fila `[join('screens','welcome','index.tsx'), 2]`,
  `design.md` §2.19 nueva. Si #118 mergea antes, el handoff de #117 debe
  decirle a Codex que mida la base y aplique los deltas de la spec como
  diferencia sobre esos valores.
- Ronda 1 de Codex terminada (relatado por el humano el 2026-10-05): 18
  commits sobre el H0 `90a19d86`, HEAD `d39a9ea5`, rojo→verde por R-id y
  trazabilidad con hashes. `./init.sh` corrido por el leader en este worktree
  sobre `d39a9ea5` (avisando antes a Frontend): exit 0 (log en el scratchpad
  de la sesión).
- `reviewer` ronda 1: **rechazado** (`progress/review_mobile-forgot-password.md`,
  commit `33f261ba`). La producción cumple, pero cuatro cláusulas universales
  (R2 «cualquier otro status», R6 «kind distinto de ok» al reenviar, R7
  «arranca un envío nuevo» desde los dos botones, R9 «los dos estados» del
  ScrollView) tenían candado en una sola rama, porque así lo prescribía la
  spec. Las sondas P4-P8 sobreviven. Notion: Estado del gate = Bloqueado, con
  el motivo en Bloqueadores.
- Enmienda E1, solo de tests (`5362da73`): requirements.md §Enmienda E1 y
  tasks.md §Enmienda E1 (T12-T16). Cifras esperadas: auth 40→43, forgot
  20→27, 8 suites 272→282, global 93 / 2036→2046. Lista cerrada: 4 ficheros.
  Antes de la firma humana, un `reviewer` barre la enmienda en busca de más
  ramas sin candado (regla tras el primer rechazo); el resultado se añade al
  final del fichero de review. Después: espejo en Notion, gate = En revisión,
  firma humana de la enmienda, handoff de la ronda 2 a Codex.
- Barrido previo a la firma (`18c06d0e`): seis ramas más sin candado (R2 `3xx`,
  R3 `link-login` desde el estado enviado, R4 `forgot-resend` en vuelo, R5
  tile `Lock`, R6 cuerpo y petición tras un reenvío fallido) y una redacción
  de R4 que choca con R7. Todo integrado en la enmienda E1 (`5f417797`, tareas
  T12-T18). Cifras nuevas: auth 44, forgot 29, 8 suites 285, global
  93 / 2049. Sigue siendo solo de tests; la lista cerrada no cambia.
- Notion (2026-10-05): enmienda espejada al final de la página, Estado del
  gate = En revisión, Bloqueadores = gate de la enmienda E1. Branch empujada
  (`origin/feature/117-mobile-forgot-password`). Esperando la aprobación
  humana de la enmienda; tras ella, commit de firma y handoff de la ronda 2.
- Enmienda E1 aprobada por el humano en Notion (Estado del gate = Aprobado,
  leído el 2026-10-05T03:13:01Z; casilla fechada 2026-10-04, hora local).
  Commit de firma `75cb3104`. Notion: Rol actual = Implementer, Bloqueadores
  vacío.
- Handoff de la ronda 2: `progress/handoff_mobile-forgot-password.md`
  §Ronda 2 — Enmienda E1 (H0 = el commit que añade esa sección). Tareas
  T12-T18, solo tests, lista cerrada de 4 ficheros, 45 anclas `grep`
  ejecutadas contra el árbol (45/45). Base 2 suites / 60; cierre 8 suites
  285, global 93 / 2049. Mientras Codex trabaja, esta sesión no toca el
  working tree; al terminar: `./init.sh` (avisando a Frontend) y `reviewer`
  ronda 2.
