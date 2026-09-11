# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #78 — mobile-alerts-center (spec_ready, enmendada, esperando gate humano)

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

### Lo que bloquea ahora

- [ ] **Gate humano de las enmiendas**: casilla `Enmiendas E1-E8 aprobadas por
      humano` en `specs/mobile-alerts-center/requirements.md`. Se firma con
      commit del humano en esta branch (flujo de `main` protegida).
- [ ] Las **cuatro decisiones** de §Aprobacion ya estan firmadas (2026-09-10);
      la (4) queda derogada por E1 y no hay que volver a firmarla.

Con la casilla marcada, lo siguiente es el **handoff a Codex CLI**
(plantilla en `.claude/agents/leader.md`), no implementar aqui.

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

### Recordatorio de entorno

`init.sh` aborta en falso en este VPS con `FORCE_COLOR` (#75, `pending`):
lanzarlo siempre como `env -u FORCE_COLOR bash ./init.sh`.
