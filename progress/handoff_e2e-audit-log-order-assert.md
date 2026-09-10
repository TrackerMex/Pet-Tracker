# Handoff a Codex CLI — feature #76 e2e-audit-log-order-assert

Feature: e2e-audit-log-order-assert (#76), branch: `feature/76-e2e-audit-log-order-assert`
Worktree: `/home/claude/sites/Pet-Tracker-wt-backend` — trabaja SOLO ahí. NO uses
`/home/claude/sites/Pet-Tracker` (otra sesión trabaja #78 en ese árbol) ni `main`.
Spec aprobada: `specs/e2e-audit-log-order-assert/requirements.md` (status: approved,
firmada por el humano en ed09b73 incluida la excepción C4 de R2)
Lee también: `specs/e2e-audit-log-order-assert/design.md` y `tasks.md`

Alcance: un fix de test e2e en `backend-pet-tracker/`. Cero archivos bajo `src/`,
cero dependencias nuevas, cero cambios en `mobile-pet-tracker/` o `infra/`.

- R1: en `backend-pet-tracker/test/health-vaccines.e2e-spec.ts`, la consulta de
  `audit_log` del `it` 'registra create/update/delete y no audita PATCH vacio'
  gana `.orderBy(asc(auditLog.at), asc(auditLog.id))`; `asc` se importa en la
  línea de import existente de `'drizzle-orm'`; el `it` se renombra al texto
  exacto de requirements.md R1. Las dos `expect` que siguen quedan byte a byte.
  Son tres ediciones y ninguna más. Si para poner verde hace falta tocar otra
  línea u otro archivo, PARA y repórtalo: el diagnóstico estaría mal.
- R2: evidencia sustituta del commit rojo (no hay rojo reproducible): mutación
  `asc` → `desc` aplicada, ejecutada, bloque `Expected/Received` de jest copiado
  al reporte, y revertida con `git checkout -- test/health-vaccines.e2e-spec.ts`.
  La mutación NUNCA se commitea.
- R3: barrido por delta contra `5666b85` con los grep de design.md D4 y
  `git diff --name-only 5666b85...HEAD -- backend-pet-tracker/` (debe listar
  exactamente el archivo de R1). Sección `## Barrido (R3)` en el reporte.
- R4: una corrida verde de la suite e2e completa y una de
  `env -u FORCE_COLOR bash ./init.sh` desde la raíz del worktree. Las tres
  corridas consecutivas son del reviewer, no tuyas.

Reglas críticas:

- Postgres compartido: los worktrees de este VPS usan el mismo Postgres de
  docker. Antes de CADA e2e o init.sh: `pgrep -af 'init\.sh'` y
  `pgrep -af 'test:e2e'` deben salir vacíos (ignora tu propio pgrep). Si hay
  otro vivo, espera y repite. Un e2e rojo con filas que no existen o conteos a
  cero es contención, no bug: espera y vuelve a correr una vez limpia.
- `FORCE_COLOR` rompe `init.sh` (bug #75, abierto): lánzalo siempre como
  `env -u FORCE_COLOR bash ./init.sh`.
- Commits: exactamente los dos de `tasks.md` (cabecera), en ese orden.
  Commit 1 = solo el archivo de R1. Commit 2 = `progress/impl_e2e-audit-log-order-assert.md`
  + `specs/e2e-audit-log-order-assert/traceability.md` rellenada (R1-R4 sin
  filas pendientes). La branch ya trae commits de spec, aprobación y handoff
  antes de los tuyos: `git log --oneline 5666b85..HEAD` mostrará esos más tus
  dos; lo que debe ser exactamente dos son los TUYOS.
- Al final: `git push` de la branch (el humano no ve nada sin push). NO abras
  PR: lo abre el leader tras el veredicto del reviewer.
- Si tocas `feature_list.json` (no deberías): edita la línea, nunca reescribas
  el JSON con un dump completo (cambia todas las tildes y rompe el merge con #78).
- Convenciones de `docs/conventions.md`; lint y formato limpios sobre el
  archivo (los mismos comandos que corre `init.sh`).
- No crear recursos AWS reales ni correr `cdk deploy`.

Criterios de aceptación: R1–R4 de `requirements.md`. R1 es el único con test
(el `it` renombrado, que ya nombra `#76: R1,R2`); R2, R3 y R4 son de
verificación y cierran con evidencia en el reporte.

Al terminar: `env -u FORCE_COLOR bash ./init.sh` exit 0 sin el aviso «se saltan
los e2e», push, y resultado en `progress/impl_e2e-audit-log-order-assert.md`
con las secciones `## Mutación (R2)`, `## Barrido (R3)` y `## Suite completa (R4)`.
