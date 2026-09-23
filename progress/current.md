# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

- **Feature**: #95 `mobile-detail-screens-to-stack`
- **Sesion**: Frontend (leader), worktree `/home/claude/sites/Pet-Tracker`,
  branch `feature/95-mobile-detail-screens-to-stack`, base `origin/main` `2be1b023`
- **Inicio**: 2026-09-23 (in_progress tras la firma via Notion, commit `a4b3e69f`)
- **Gate de spec**: Aprobado en Notion
  (https://app.notion.com/p/3e46115a9b27814cb64fde3052521a37,
  `page_last_edited_at` 2026-09-23T14:15:50.438Z). Cubre la spec y las
  enmiendas A11 y A12. La prueba de humo sigue abierta.
- **Plan**: Codex CLI saca las seis pantallas de detalle (`add-reminder`,
  `pets/add`, `pets/[petId]/docs`, `weight-log`, `meal-schedule`, `pairing`) de
  `src/app/(tabs)/` al Stack raiz: `RootStack` con `Stack.Protected`,
  `SelectedPetProvider` subido al layout raiz y ligado a la sesion, cabecera
  nativa, fuera los seis botones de volver y sus seis claves, metricas A11,
  retirada del reset en blur de #63 y `dismissTo('/map')` en pairing. Son 8
  requisitos (R1-R8), en el orden de `specs/mobile-detail-screens-to-stack/tasks.md`.
- **Handoff**: `progress/handoff_mobile-detail-screens-to-stack.md`
- **Coordinacion**:
  - Backend lleva #104 (y reserva #113) en `wt-backend`.
  - Frontend registro #114 `mobile-reminders-alerts-to-stack` en esta branch.
  - `init.sh` solo tras avisar a Backend por SendMessage, porque LocalStack es compartido.
  - Las claves del catalogo `src/i18n/catalog.ts` se coordinan con #113 cuando llegue a spec.
- **Pendiente tras Codex**: reviewer, y despues la prueba de humo en dev build
  de Android (humano).
