---
name: git-ops-pr-check
description: Corre el checklist de cierre de sesión de AGENTS.md §7 (init.sh verde, STATUS.md sincronizado, progress/current.md volcado a history.md, sin cruft) y, si pasa, push de la branch feature/<id>-<nombre> + gh pr create. Usar al terminar una feature, antes de cerrar sesión.
disable-model-invocation: true
---

# git-ops-pr-check

Ejecuta el checklist de `AGENTS.md` §7 "Cierre de sesión" en orden. Si un
paso falla, **para ahí** y repórtalo — no sigas al siguiente paso con el
repo en estado inconsistente.

No duplica `CHECKPOINTS.md` (C1–C7): eso es trabajo del agente `reviewer`
sobre arquitectura/TDD/trazabilidad. Esta skill es solo la mecánica de cierre
de sesión y el PR.

## Pasos

1. **`./init.sh` verde**
   Ejecútalo. Si falla, para y reporta el error — no continúes.

2. **Estado de la feature en `feature_list.json`**
   - Si la sesión terminó la feature: su `status` debe ser `"done"`.
   - Si tiene spec en `specs/<feature>/`: confirma que
     `specs/<feature>/traceability.md` no tiene ninguna fila "pendiente".
   - Si la feature no se terminó, no la marques `done` — deja `in_progress` y
     salta directo al paso 4 (no hay push/PR sin feature cerrada).

3. **`STATUS.md` sincronizado**
   - Línea `**Features completadas**: X/Y` (línea 4) contra el conteo real
     de `status == "done"` en `feature_list.json`.
   - Sección `## Estado actual` (línea 59) refleja la feature recién cerrada.
   - Sección `## Última sesión` (línea 312) tiene una entrada nueva: fecha,
     qué se hizo, qué sigue.

4. **`progress/current.md` → `progress/history.md`**
   Mueve el contenido de la sesión activa al final de `history.md` (append),
   luego deja `current.md` solo con la plantilla base (ver el propio archivo
   para el formato).

5. **Repo limpio**
   - Sin `console.log` de debug fuera de logging intencional.
   - Sin TODOs sin contexto (`TODO` a secas, sin issue/explicación).
   - `git status` sin archivos temporales o de scratch sin trackear.

6. **Push + PR** (solo si la feature quedó `done` en el paso 2)
   - Confirma que la branch actual es `feature/<id>-<nombre>`, nunca `main`.
   - Muestra al usuario el plan exacto antes de ejecutar:
     `git push -u origin <branch>` y
     `gh pr create --title "feat(<feature>): <resumen>" --body "..."`
     (el body enlaza `specs/<feature>/` y lista los R-ids cubiertos, formato
     en `docs/conventions.md` §Branches y Pull Requests).
   - Pide confirmación antes de correr `git push` / `gh pr create` — son
     acciones visibles para otros.
   - **Nunca mergees.** El humano revisa y mergea en GitHub.

   **Excepción**: si la sesión solo tocó harness/`docs/`/`specs/`/`progress/`
   (sin código de app), no hay branch de feature — ese trabajo va directo a
   `main` y este paso se salta (ver `docs/conventions.md` §Branches, excepción).

## Al terminar

Reporta un resumen de una línea por paso: pasó / falló / no aplica. Si algo
falló, dilo explícito — no reportes cierre exitoso con pasos pendientes.
