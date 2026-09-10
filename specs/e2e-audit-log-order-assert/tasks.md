---
feature: "e2e-audit-log-order-assert"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[e2e-audit-log-order-assert]]

> Disciplina TDD adaptada a un fix de test. Cada tarea corresponde a un
> requisito de [[requirements]] y conserva los 3 sub-items; donde un
> sub-item no aplica se dice por qué en vez de inventarlo.
> Rutas relativas a `backend-pet-tracker/`; líneas del commit base `5666b85`.
>
> **Commits** (CHECKPOINTS C4): esta feature **no tiene commit rojo** — está
> declarado y justificado en [[requirements]] R2 y [[design]] D3, y lo firma
> el humano en §Aprobación. La evidencia que lo sustituye es la mutación de
> R2 (aplicada, ejecutada, capturada, revertida, **nunca commiteada**). Son
> exactamente dos commits, en este orden:
> 1. `test(e2e-audit-log-order-assert): order audit log rows before asserting (R1)`
> 2. `docs(e2e-audit-log-order-assert): mutation evidence, sweep and traceability (R2,R3,R4)`
>
> **Branch**: `feature/76-e2e-audit-log-order-assert`, worktree
> `/home/claude/sites/Pet-Tracker-wt-backend`. Nada va a `main`; el cierre es
> `gh pr create` y el merge lo hace el humano (`docs/conventions.md`
> §Branches y Pull Requests).
>
> **Sujeto de cada tarea**: R1 crea las tres líneas que cambian (import,
> `orderBy`, nombre del `it`) y las commitea. R2, R3 y R4 solo aseveran sobre
> lo que R1 dejó — por eso el orden es R1 → R2 → R3 → R4 y no se puede
> adelantar ninguno.
>
> **Regla dura**: si para poner verde el `it` hace falta tocar cualquier
> línea que no sea las tres de R1, o cualquier archivo bajo `src/`, **para y
> repórtalo** en `progress/impl_e2e-audit-log-order-assert.md`. Significa que
> el diagnóstico de [[requirements]] §Contexto está mal, no que la spec sea
> flexible.
>
> Comandos: `pnpm -C backend-pet-tracker run test:e2e -- health-vaccines`
> (solo este archivo), `pnpm -C backend-pet-tracker run test:e2e` (suite
> completa, exige Docker en `5432` y `4566`), `env -u FORCE_COLOR bash
> ./init.sh` desde la raíz antes de cerrar. Antes de cualquier e2e:
> `pgrep -af 'init\.sh'` y `pgrep -af 'test:e2e'` deben salir vacíos.

## T0 — Precondiciones (sin commit)

- [ ] `git -C /home/claude/sites/Pet-Tracker-wt-backend branch --show-current`
      imprime `feature/76-e2e-audit-log-order-assert`.
- [ ] `docker compose ps` muestra Postgres y LocalStack arriba; `pgrep -af
      'init\.sh'` y `pgrep -af 'test:e2e'` vacíos.
- [ ] Corrida de referencia: `pnpm -C backend-pet-tracker run test:e2e --
      health-vaccines` verde en `5666b85` (confirma que el test pasa aislado,
      como dice el diagnóstico). Anotar la línea `Tests:` en el reporte.

## R1 — la consulta de audit_log se ordena por `at`, `id`

Sujeto que crea esta tarea: el import de `asc`, el `orderBy` y el nombre
nuevo del `it`, en `test/health-vaccines.e2e-spec.ts`, commiteados.

- [ ] (1) «Test rojo»: no aplica un rojo reproducible (ver cabecera y R2).
      En su lugar, **antes** de editar, ejecutar T0 y dejar constancia de
      que el `it` original pasa aislado — ese es el estado de partida que R2
      va a contrastar.
- [ ] (2) Implementación mínima, tres ediciones y ninguna más:
      - línea 3: `import { and, eq, inArray } from 'drizzle-orm';` →
        `import { and, asc, eq, inArray } from 'drizzle-orm';`
      - línea 471: `it('registra create/update/delete y no audita PATCH
        vacio', ...)` → `it('registra create/update/delete en orden
        cronologico y no audita PATCH vacio (e2e-audit-log-order-assert #76:
        R1,R2)', ...)`
      - líneas 493-496: tras
        `.where(and(eq(auditLog.entity, 'vaccine'), eq(auditLog.entityId, id)))`
        añadir `.orderBy(asc(auditLog.at), asc(auditLog.id))` como último
        eslabón de la cadena, antes del `;`.
      Las dos `expect` de las líneas 497-505 se quedan **byte a byte**.
      `pnpm -C backend-pet-tracker run test:e2e -- health-vaccines` verde.
- [ ] (3) Refactor: ninguno. Lint y formato limpios sobre el archivo (los
      mismos comandos que corre `init.sh`). **Commit 1**:
      `test(e2e-audit-log-order-assert): order audit log rows before
      asserting (R1)`. `git show --stat HEAD` lista un solo archivo.

## R2 — la mutación demuestra que el orden gobierna la aserción

Sujeto sobre el que asevera: el `orderBy` que R1 acaba de commitear.

- [ ] (1) Test rojo **por mutación, no versionado**: en la línea del
      `orderBy` de R1 sustituir temporalmente `asc` por `desc` (añadiendo
      `desc` al import de `'drizzle-orm'`) y ejecutar
      `pnpm -C backend-pet-tracker run test:e2e -- health-vaccines`. Debe
      fallar **solo** ese `it`, **por la aserción**
      `expect(rows.map((row) => row.action)).toEqual([...])`, con
      `Received` = `['vaccine.delete', 'vaccine.update', 'vaccine.create']`.
      Copiar el bloque `Expected/Received` de jest al reporte, sección
      `## Mutación (R2)`. Si falla por otra cosa (compilación, timeout,
      `ReferenceError`), la evidencia no vale: arreglar la mutación, no el
      test.
- [ ] (2) Revertir la mutación con
      `git checkout -- test/health-vaccines.e2e-spec.ts` (R1 ya está en el
      commit 1, así que esto devuelve exactamente el estado verde).
      `git status --short` limpio; volver a correr el archivo: verde. Copiar
      también esa línea `Tests:` al reporte.
- [ ] (3) Refactor: ninguno. Sin commit — la evidencia va en el commit 2
      (§Cierre). `git log --oneline 5666b85..HEAD` sigue mostrando un solo
      commit.

## R3 — el barrido no deja otro hallazgo y el diff no toca nada más

Sujeto sobre el que asevera: el commit 1 y el árbol en `HEAD`.

- [ ] (1) Verificación (sin test nuevo): ejecutar en `backend-pet-tracker/`
      los tres `grep` de [[design]] D4 y `git diff --name-only 5666b85...HEAD
      -- backend-pet-tracker/`. Esperado: `orderBy` solo en
      `test/devices.e2e-spec.ts` y `test/health-vaccines.e2e-spec.ts`; ningún
      spec unitario con `.select(`; el diff lista exactamente
      `backend-pet-tracker/test/health-vaccines.e2e-spec.ts`.
- [ ] (2) Si el tercer `grep` muestra algún `.select(` que **no** esté en la
      tabla de [[design]] D4 (delta contra `5666b85`), clasificarlo con los
      criterios (i)+(ii) de D4 en el reporte. Order-safe → anotarlo y seguir.
      Order-dependent → **parar** y reportar; no se arregla fuera de spec.
- [ ] (3) Escribir la sección `## Barrido (R3)` en
      `progress/impl_e2e-audit-log-order-assert.md` con la salida de los
      cuatro comandos. Sin commit aún (va con R4 en el commit 2).

## R4 — la suite entera pasa, y pasa varias veces

Sujeto sobre el que asevera: el árbol completo en `HEAD` con el commit 1.

- [ ] (1) Codex: precondiciones de la cabecera (`pgrep` vacíos, Docker
      arriba) y **una** corrida de `pnpm -C backend-pet-tracker run
      test:e2e`. Verde. Copiar la línea `Tests: N passed, N total` a la
      sección `## Suite completa (R4)` del reporte.
- [ ] (2) Codex: `env -u FORCE_COLOR bash ./init.sh` desde la raíz del
      worktree, verde y **sin** el aviso «se saltan los e2e». Anotar la
      última línea.
- [ ] (3) Reviewer (no Codex): tres corridas consecutivas de la suite e2e
      con las mismas precondiciones, mismo `N` en las tres, más una de
      `env -u FORCE_COLOR bash ./init.sh`. Evidencia en
      `progress/review_e2e-audit-log-order-assert.md`. Este sub-item es del
      gate de revisión; Codex no lo hace.

## Cierre

- [ ] Rellenar [[traceability]]: filas R1-R4, tabla de criterios, y la fila
      del `it` renombrado en §Tests de features anteriores actualizados.
- [ ] **Commit 2**: `docs(e2e-audit-log-order-assert): mutation evidence,
      sweep and traceability (R2,R3,R4)` con
      `progress/impl_e2e-audit-log-order-assert.md` y
      `specs/e2e-audit-log-order-assert/traceability.md`.
- [ ] `git log --oneline 5666b85..HEAD` muestra exactamente los dos commits
      de la cabecera. `gh pr create` contra `main`; el merge es del humano.
