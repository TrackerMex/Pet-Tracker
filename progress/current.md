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

### Mientras Codex trabaja

Un solo escritor sobre el working tree: Claude solo toca `docs/`, `specs/`,
`progress/` y `feature_list.json`. `backend-pet-tracker/` es de Codex.
