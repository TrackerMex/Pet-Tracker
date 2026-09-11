# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #78 — mobile-alerts-center (in_progress, handoff entregado a Codex CLI)

- **Branch**: `feature/78-mobile-alerts-center`, worktree principal
  `/home/claude/sites/Pet-Tracker`.
- **Estado**: `spec_ready`. La spec la aprobo el humano el 2026-09-10
  (`09f1f309`, casilla de §Aprobacion marcada). Falta el gate de las enmiendas.

### Lo que hizo esta sesion (2026-09-11)

1. `git merge origin/main` (`d07427e9`) y `git merge origin/feature/78-...`
   (`2451b66d`) sobre la branch: trae #87 y la firma humana de la spec.
   **Merge, no rebase** — la leccion de #87 con los hashes de trazabilidad.
2. Enmienda **E1-E8** a `specs/mobile-alerts-center/` (`ecb449ee`), porque #87
   `mobile-tanstack-query` se mergeo en `main` (`cea72945`, PR #121) **despues**
   de que el humano firmara la spec y borro `src/hooks/use-api.ts`, sobre el que
   descansaban R4, R8, R9 y R11.

### Las ocho enmiendas, en una linea cada una

| # | Que cierra |
|---|---|
| E1 | Deroga la premisa "no hay TanStack Query" de §0.4 y el punto (4) de §Aprobacion |
| E2 | `alertKeys` en `src/api/query-keys.ts` — obligatorio: `#87 R19` prohibe `queryKey: [` literal en Home |
| E3 | `useInfiniteQuery` en lugar de acumular paginas con `useState` |
| E4 | Los tres estados de la pantalla salen de la query; el `signOut` del `unauthorized` lo hace el `QueryCache` |
| E5 | El ack sigue siendo llamada plana + overlay: ni `useMutation` ni `setQueryData` (moveria la fila, contra R7) |
| E6 | La campana pasa a `useQuery`; **no** se adopta `invalidateQueries`, con la condicion escrita que lo revive |
| E7 | Referencias de linea reapuntadas tras la migracion de #87 |
| E8 | R13 hereda los cuatro candados de #87; unico delta declarado: `'screens/alerts/index.tsx': 1` en `screenSignOutCalls` |

### Gates humanos: los dos firmados

- [X] Spec aprobada — `09f1f309` (2026-09-10), refrescada a 2026-09-11 en
      `4f9298e0`. Con ella, las cuatro decisiones de §Aprobacion; la (4) queda
      derogada por E1.
- [X] **Enmiendas E1-E8 aprobadas** — `4f9298e0` (2026-09-11).

### Estado actual: R1-R13 implementados; R14 reservado al humano

- **Inicio**: 2026-09-11 15:23 UTC.
- Preflight `env -u FORCE_COLOR bash ./init.sh`: verde antes de tocar código
  (build, tests, e2e, lint y typecheck).
- Skills cargadas: `expo-overview`, `expo-router`, `expo-data-fetching`,
  `expo-native-ui`, `expo-ui`, `appllama-app-design-skill` y Ponytail `full`;
  documentación oficial de Expo SDK 57 consultada en su URL versionada.
- R1→R13 completados en el orden de `tasks.md`, con commits rojo/verde y
  trazabilidad cerrada. Evidencia completa en
  `progress/impl_mobile-alerts-center.md`.
- Verificación final `env -u FORCE_COLOR bash ./init.sh`: exit 0 (build, suites,
  e2e, lint y typecheck).
- R14 queda reservado al humano: smoke en dev build de Android con una alerta
  `open` real. Hasta su firma, #78 conserva el estado `in_progress`.

- `feature_list.json`: #78 pasa a **`in_progress`** (2026-09-11).
- Handoff escrito en **`progress/handoff_mobile-alerts-center.md`**. El humano
  lo corre en su terminal; esta sesion **no** toca `mobile-pet-tracker/`
  mientras tanto (un solo escritor sobre el working tree).
- Implementación lista para que el `reviewer` lea
  `progress/impl_mobile-alerts-center.md`; el PR lo abre el leader tras su
  veredicto.
- Queda para el final el gate humano **R14**: smoke en **dev build de Android**
  con una alerta `open` real. No delegable a IA.

### Coordinacion con la sesion Backend (2026-09-11)

- Backend trabaja **#89 dto-dates-owner-timezone** en
  `/home/claude/sites/Pet-Tracker-wt-backend`, branch
  `feature/89-dto-dates-owner-timezone`. #88 ya esta mergeada (PR #120).
- Postgres de docker compartido: `pgrep` antes de cada `init.sh`. Esta sesion
  **no** ha lanzado `init.sh` (trabajo solo de spec).
- Respondido a sus dos preguntas sobre fechas en el movil:
  - `measuredAt` y `birthDate` viajan como **fecha civil `YYYY-MM-DD` en la zona
    del dispositivo**, nunca como instante UTC
    (`app/(tabs)/weight-log.tsx:39-44` `localTodayIso()`,
    `screens/add-pet/index.tsx:34-39` `dateToIso`).
  - **Ningun** test movil depende del margen de +1 dia en pesos; las fixturas son
    fechas pasadas fijas o `localTodayIso()`. Ya existe el camino de error
    (`weight-log.test.tsx:380` mapea el 400 `Date is in the future`).
  - Riesgo que se les traslada: la zona del **dispositivo** puede no ser la del
    owner; hoy el margen de +1 dia lo absorbe.
- **Decision de Backend (2026-09-11)**: #89 va **sin margen**, validando contra
  `users.timezone` del owner, por coherencia con lo que #88 fijo para
  `appliedAt`. El caso "dispositivo por delante del owner" queda en su
  §Fuera de alcance para que lo decida el humano en el gate. La forma del 400 se
  mantiene byte a byte, asi que `src/api/health-records.ts:132` sigue valiendo.
- **Deuda movil que nace si #89 mergea asi** (registrar como feature cuando el
  humano firme, no antes): el movil manda la fecha civil del **dispositivo** y
  tendria que mandar la del owner, o al menos explicar el 400. Afecta a
  `app/(tabs)/weight-log.tsx` (pesos) y a `screens/add-pet/index.tsx`
  (`birthDate`, que con #89 pasa a aceptar hoy a cualquier hora, o sea mejora).
  **Id abierto el 2026-09-11 como #90 `mobile-owner-timezone-dates`** (`pending`,
  P2), despues de que el humano firmara el gate de #89 con la decision por
  defecto (verificado: casilla `[X]` en
  `specs/dto-dates-owner-timezone/requirements.md:701`). Id contrastado contra
  `origin/main` y contra la branch de #89: el maximo era 89 en las dos.
  **Ojo al mergear**: el `feature_list.json` de esta branch no tiene aun la
  entrada de #89 —vive en `feature/89-dto-dates-owner-timezone`—, asi que las
  dos entradas caen en el mismo sitio del array y el merge a `main` pedira una
  resolucion trivial: conservar las dos, #89 antes de #90.
  Anclaje verificado el 2026-09-11: la deuda queda nombrada en
  `specs/dto-dates-owner-timezone/requirements.md:661-673` §Fuera de alcance
  (branch `feature/89-dto-dates-owner-timezone`, `cf51a1a9`), con la condicion
  escrita de que el id lo abre esta sesion solo si el humano firma #89 con la
  decision por defecto.

### Recordatorio de entorno

`init.sh` aborta en falso en este VPS con `FORCE_COLOR` (#75, `pending`):
lanzarlo siempre como `env -u FORCE_COLOR bash ./init.sh`.
