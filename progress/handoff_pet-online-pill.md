# Handoff a Codex CLI — #73 `pet-online-pill`

Feature: `pet-online-pill` (#73), branch: `feature/73-pet-online-pill`
Worktree: `/home/claude/sites/Pet-Tracker-wt-backend` (HEAD incluye `origin/main` 572a24e4).
Trabaja SOLO ahí. El tree principal `/home/claude/sites/Pet-Tracker` lo usa otra
sesión (#91) — no lo toques.

Spec aprobada: `specs/pet-online-pill/requirements.md` (status: approved, firma
humana en `0a76562b`). Lee también `design.md`, `tasks.md` y `traceability.md`,
y el informe `progress/explore_pet-online-pill.md`.

**Enmiendas E1-E3** (§Enmiendas tras la firma de `requirements.md`, espejo en
`design.md` y `tasks.md`): E1 umbral 120 s, E2 pulso del punto con Reanimated +
reduced motion, E3 bloque E-#8 copiado firmado. Son decisiones del humano al
firmar. Su casilla `- [ ] Enmiendas E1-E3 aprobadas por humano` puede estar aún
sin marcar cuando empieces: R1-R7 se implementan igual (E1 y E3 son la elección
literal del humano en §Aprobación); **antes de empezar R8 haz `git pull` y
comprueba que la casilla está marcada**; si no lo está, PARA en R8 y dilo en
`progress/impl_pet-online-pill.md`.

Archivos a crear/modificar: los de `files_affected` de #73 en `feature_list.json`
y la sección "Archivos afectados" de `design.md`. Los que NO se tocan están en
R10: `map.tsx`, `map.test.tsx`, `app/(tabs)/home.tsx`, `floating-tab-bar.tsx`,
`docs/ui-guidelines.md`, `specs/mobile-pet-hero-header/design.md`,
`specs/devices-claim/requirements.md`.

Reglas críticas:
- Seguir `docs/architecture.md` y `docs/conventions.md`.
- Móvil: `docs/ui-guidelines.md` manda. Carga las skills del plugin expo de
  Codex: `expo-overview` primero, luego `expo-native-ui` y `expo-animation`
  (E2). Borra `mobile-pet-tracker/.expo/types/router.d.ts` si existe antes de
  tocar código (tasks §0).
- TDD por requisito en el orden de `tasks.md`: backend R1-R4 primero, móvil
  R5-R9 después. **UN COMMIT POR REQUISITO COMO MÍNIMO, test rojo antes que su
  implementación**: `test(pet-online-pill): … (Rn)` en rojo y luego
  `feat|fix(pet-online-pill): … (Rn)` en verde. El rojo debe ser de
  aserciones: `tasks.md` dice en cada (1) qué stub/placeholder deja para que
  compile (R1, R2, R6, R8). Un único commit con todo incumple C4 de
  `CHECKPOINTS.md`.
- Los candados de copy y legibilidad se mueven SOLO con los deltas de la tabla
  §Candados "Cambian" (sumas visibles, p. ej. `260 + 16 + 1 + 4 + 7 + 14 + 2`).
  Si otro candado se pone rojo, la implementación está mal: no ajustes cifras
  que la spec no declara; PARA y anótalo.
- Suites: backend `pnpm test` y `pnpm test:e2e` desde `backend-pet-tracker/`;
  móvil `bun run test` desde `mobile-pet-tracker/`. Antes de cada
  `pnpm test:e2e` o `./init.sh`: `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep`
  debe estar vacío (el Postgres de docker se comparte con otra sesión; si hay
  otro vivo, espera y repite una sola corrida limpia).
- Sondas de mutación obligatorias (R4, R8, R9, R10, E2): mutación en producción
  → rojo visto → restaurar con `git diff` vacío; evidencia (comando + línea)
  en `progress/impl_pet-online-pill.md`.
- Actualizar `specs/pet-online-pill/traceability.md` tras cada commit (hash
  rojo y hash verde por R). No rebasear la branch después.
- No crear recursos AWS reales ni correr `cdk deploy`.
- **Push** de la branch al cerrar cada bloque (backend, móvil) y al terminar:
  `git push origin feature/73-pet-online-pill`. El humano y el reviewer leen
  desde el remoto.

Criterios de aceptación: R1-R10 de `requirements.md` (con E1-E3). R11 es el
smoke humano: deja el guion literal y la tabla vacía en
`progress/impl_pet-online-pill.md` §R11, no lo ejecutes.

Al terminar: `./init.sh` verde desde la raíz del worktree (pgrep antes),
resultado en `progress/impl_pet-online-pill.md` (una sección por R con
evidencias), push, y para. No abras el PR: lo abre el leader tras el veredicto
del reviewer.
