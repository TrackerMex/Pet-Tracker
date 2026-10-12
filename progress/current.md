# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

## #167 `mobile-account-screens-pingo` — Pingo en las pantallas de cuenta

- **Inicio**: 2026-10-12, sesión Frontend (leader), worktree
  `Pet-Tracker-wt-167`, branch `feature/167-mobile-account-screens-pingo`
  desde `origin/main` d2b8b0ae (merge de #166).
- **Estado**: `pending` → spec en curso con `spec_author`.
- **Decisiones del humano (2026-10-12, cuestionario de opción cerrada,
  literal)**:
  - **N4**: «Migrar en #167». Login y Registro pasan de rutas gordas en
    `src/app/(auth)/` a route delgado + `src/screens/`. Primero va un commit
    que solo mueve y después los cambios de Pingo.
  - **Tamaño**: «Una sola spec #167». Fila 1 entera: Bienvenida (anillos
    ping), Login, Registro, Recuperar y Nueva contraseña.
- **Spec**: `spec_ready` en `specs/mobile-account-screens-pingo/` (R1–R15,
  P1–P8). Revisión previa del leader: anclas B1–B31 dan lo declarado sobre
  d2b8b0ae, `AlertCircle`/`Check` existen en reicon y `--color-danger` y
  `--color-accent-foreground` están en `src/theme/global.css`.
- **Choque previsto al integrar main**: #167 R5.2, #169 y #170 abren todas
  `### §2.24` en `specs/mobile-ui-language/design.md`. La que mergee después
  renumera su sección y sus candados al siguiente §2.N libre.
- **Espejo Notion** (2026-10-12): https://app.notion.com/p/3f76115a9b27812d88b4ebbe02174d7c
  (base Specs, «En revisión», espejo de 8ffd31a1). Las tres celdas de §Deltas con
  `+ n`/`- n` se pasaron a notas (a)-(c) bajo la tabla: Notion convierte `+ ` dentro
  de una celda en viñeta. sites-4c [87612b] avisado: #167 no pide poses nuevas.
- **Solapes con #171** (sites-4c, 169e92c9): si #171 mergea antes del handoff de #167,
  re-medir al hacer el handoff: §2.24 pasa a §2.25; B15 (`- 1, // #159 R2`) ya no
  casa, porque #171 R12 reescribe esa suma; y la carta termina en `## Enmienda #171`.
  R11.2 sigue añadiendo al final, y R11.3 solo pide «una sola vez», sin posición
  (verificado con grep: ningún candado de #167 usa endsWith ni lastIndexOf).
- **Solapes con #170** (Backend, handoff 4a68bfe0, Codex en marcha): #170 también
  abre §2.24, suma +7 al catálogo (la misma expresión que B15) y toca
  `ui-copy-table.ts`, `ui-language.test.ts` y `consistency-classnames.test.ts`. Si
  mergea antes del handoff de #167, re-medir B5–B10, B15 y §2.N. Los conflictos se
  resuelven en el merge sumando los deltas. Antes de lanzar init.sh, avisar a Backend.
- **Siguiente**: gate humano (Estado del gate = Aprobado), luego commit de firma y
  handoff a Codex.
