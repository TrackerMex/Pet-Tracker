# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #90 `mobile-owner-timezone-dates` (P2)

- **Fecha de arranque**: 2026-09-17
- **Worktree**: `/home/claude/sites/Pet-Tracker-wt-backend`, branch `feature/90-mobile-owner-timezone-dates` desde `origin/main` 29689598 (incluye #83 PR #138 y #72 PR #139)
- **Baseline `./init.sh`**: verde, EXIT=0 (movil 170 suites / 1295 tests; backend 73 / 1286; e2e 27 de 30, 3 `aws-real` skipped). Log en el scratchpad de la sesion, `init-90-baseline.log`. Sin `reading 'canceled'`, sin `PICKER_MOCK_UNARMED`, sin `alerts-error`.
- **Sesion paralela**: Frontend trabaja #79 `mobile-push-registration` en el tree principal. Unico cruce: catalogo i18n (`language-provider.test.tsx:55`); ambas specs declaran el candado como `base + delta` y quien mergee segundo conserva la suma. Avisar antes de `./init.sh` o `test:e2e` (LocalStack compartido).

### Estado

1. Explorer: `progress/explore_mobile-owner-timezone-dates.md` (hecho). Hallazgo clave: `POST /pets/:id/weights` es owner-only y `birthDate` valida contra el requester, asi que la zona del perfil propio (`GET /v1/me`) es exacta; la opcion (b) del enunciado sobra.
2. Decisiones del humano (2026-09-17, AskUserQuestion): **D-A = (a)** zona del perfil propio via `GET /v1/me`; **D-B = B1** solo `weight-log` en produccion + test de regresion de `birthDate` sin tocar `add-pet/index.tsx`; **D-C = C-A** el campo de fecha sigue siendo texto libre y el 400 con `path === 'measuredAt'` se muestra via `t()` con una clave nueva.
3. Decisiones tecnicas del leader (no de producto): fallback a la zona del dispositivo si no hay perfil o la zona no es IANA (try/catch sobre `Intl.DateTimeFormat`); `useQuery(userKeys.me())` inline en `weight-log` con la configuracion global (`staleTime: 0`), sin hook nuevo; test de regresion de `birthDate` como test en `add-pet/index.test.tsx` con `setSystemTime` en frontera (sin cambio de produccion); smoke humano en dev build de Android con zona del dispositivo distinta a la del perfil.
4. Spec en `spec_ready` (95678193); firmada por el humano el 2026-09-17 (e5d11b4a, aprobado + P1 aceptada); frontmatters `approved`; #90 `in_progress`.
5. Handoff a Codex CLI: `progress/handoff_mobile-owner-timezone-dates.md`. Codex implementa en este worktree; el leader no toca `mobile-pet-tracker/` mientras tanto.
6. Siguiente: cuando el humano confirme que Codex terminó, `reviewer` (init.sh en primer plano, avisar a Frontend antes por LocalStack).

### Coordinacion con Frontend

- Delta del catalogo i18n comunicado: +1 (`weightLog.dateCannotBeAfterToday`). #79 no mueve el catalogo.
- Ids reservados por Frontend en `feature/79-mobile-push-registration` (commit eea813d3, aun no en main): #99, #100, #101. **Siguiente id libre: 102.** No mirar solo `origin/main` (ahi el maximo sigue siendo 98).
- #100 `mobile-alert-detail-screen` puede pedir un `GET /v1/alerts/:id` en backend; decision abierta en su spec, no en la nuestra.
