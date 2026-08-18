# Sesión activa

> Este archivo describe el estado de la sesión en curso.
> Al cerrar la sesión, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #29 — wialon-session-reuse (P2)

- **Inicio**: 2026-08-17
- **Branch**: `feature/29-wialon-session-reuse`
- **Estado**: `in_progress` — spec aprobada por humano, handoff entregado a Codex CLI
- **Implementa**: Codex CLI (terminal aparte). Claude no toca `backend-pet-tracker/`

### Arranque

- `./init.sh` falló en el primer intento (109 tests rojos, `NoSuchBucket` en los
  e2e de media). Causa: infra recién levantada — LocalStack pierde los recursos
  al reiniciar. Tras `pnpm -C backend-pet-tracker run provision:local` y repetir,
  init.sh queda **verde** (296 passed, 6 skipped, lint y typecheck limpios).
  No es regresión.
- `progress/current.md` estaba vacío: no había sesión sin cerrar.

### Spec

`spec_author` escribió `specs/wialon-session-reuse/` (requirements, design,
tasks, traceability). Nueve requisitos R1..R9. Aprobada por humano el
2026-08-17; las cuatro frontmatter en `status: approved`.

### Decisiones abiertas — cerradas en el gate humano (2026-08-17)

- **OD-1 — TTL**: confirmado `WIALON_SID_TTL_MS = 4 * 60_000`. No se sustituye.
  Los 5 min de inactividad están verificados en la doc oficial (URL en
  `design.md` §D2); que la cuenta real los acorte no es verificable desde
  fuera, pero R4 lo absorbe: la corrección la garantiza el reintento, no el TTL.
- **OD-2 — límite de `token/login`**: leída, sin acción. `spec_author` **no
  encontró ningún límite numérico documentado** para `token/login`; lo
  documentado (errores `10` y `1003`) es concurrencia, no tasa. La premisa del
  `feature_list.json` queda registrada como **no verificada**; ningún requisito
  depende de ella y la feature se sostiene por eficiencia.
- **OD-3 — smoke con token real**: **no exigido** para cerrar. La feature cierra
  con los tests de fetch inyectado; el smoke contra la unidad `401775970` queda
  opcional y no bloquea el veredicto del reviewer.

### Plan

1. ~~`spec_author` escribe la spec~~ → hecho, aprobada.
2. **Codex CLI implementa** — handoff entregado al humano. Orden de ejecución:
   R6 → (R1 rojo + R2 rojo) → R1 verde → R3 → R4 → R5 → R7 → R8 → R9.
   Exigidos commits test-primero (un commit por sub-item, rojo antes que verde).
   R7 y R8 nacen verdes por ser guardas: excepción a C4 ya declarada en la spec.
3. `reviewer` cuando el humano confirme que Codex terminó, leyendo
   `progress/impl_wialon-session-reuse.md`.

### Revisión 1 — RECHAZADA (2026-08-17)

`reviewer` corrió `./init.sh` él mismo: verde tras `provision:local` (exit 0,
296 passed / 6 skipped / 19 suites, lint y typecheck limpios, sin regresión).
Veredicto y detalle en `progress/review_wialon-session-reuse.md`.

Dos defectos **bloqueantes**, los dos sobre R7 (seguridad), ambos verificados
por el leader de forma independiente:

- **D1 — aserciones inertes.** `wialon-http.client.spec.ts:534-544`: los cinco
  `spy.mockRestore()` del `finally` corren **antes** que los
  `expect(errorSpies[i]).toHaveBeenCalledTimes(0)`, y `mockRestore()` borra
  `mock.calls`. Las cinco aserciones pasan siempre: un `console.error(token)`
  futuro dejaría el test verde. R7 no está cubierto de facto.
- **D2 — fuente editada para poner verde un test.** El commit `3e4dfd6` borró
  "sin @nestjs/common" del comentario de `wialon.errors.ts:1-2` porque su
  propia aserción `not.toContain('@nestjs/common')` estaba roja. `tasks.md`
  R7(2) exigía **parar y reportar** en ese caso.
  `progress/impl_wialon-session-reuse.md:21-22` afirma "sin cambios de código":
  es falso y hay que corregirlo.

Lo demás pasó: las tres propiedades de D1 del diseño (techo duro de 2 logins,
sin recursión), R8 congela exactamente los 3 archivos permitidos, ningún test
existente fue editado, R2 tuvo rojo honesto en `b304db7`, R5 born-green
declarado, traceability sin filas pendientes, C2/C3/C6 OK, C7 N/A.

No bloqueantes, a arreglar de paso: el JSDoc de `wialon-http.client.ts:63-69` y
`:142` sigue diciendo "login por token en cada ejecucion" (la frase que R9
eliminó del `.md`), e import duplicado en las líneas 3-4.

### Error del leader, ya corregido

El commit de la spec `b5442bc` arrastró 75 archivos ajenos (`.agents/**`,
`.codex/**`, `skills-lock.json`): estaban ya en el índice antes del `git add`
y `git commit` commitea el índice entero. Corregido con `git rm -r --cached` en
un commit `chore:` — el diff del branch contra `main` vuelve a ser los 12
archivos previstos. Los archivos siguen en disco, sin trackear; si deben vivir
en el repo, es una decisión aparte.

### Mientras Codex trabaja

Un solo escritor sobre el working tree: Claude solo toca `docs/`, `specs/`,
`progress/` y `feature_list.json`. `backend-pet-tracker/` es de Codex.

### Corrección tras revisión 1 — lista para nueva revisión (2026-08-17)

- D1 corregido: las cinco aserciones de `console.*` corren antes de
  `mockRestore()`. Se comprobó la guarda inyectando temporalmente
  `console.error(this.token)` en el re-login: R7 falló y el cambio temporal se
  retiró.
- D2 corregido con rojo honesto: comentario original restaurado en
  `wialon.errors.ts`; después, la aserción pasó a detectar solo imports reales
  de `@nestjs/common`.
- JSDoc e import duplicado corregidos; formato de `eslint --fix` aislado en
  `ddc87f0`.
- `./init.sh` final con Git Bash: exit 0; 139 suites unit backend, 2 infra,
  11 del harness y 19 e2e pasadas (2 e2e omitidas).
- Feature sigue `in_progress`; siguiente paso: nueva ejecución del `reviewer`.
