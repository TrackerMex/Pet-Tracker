# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

## #167 `mobile-account-screens-pingo` — Pingo en las pantallas de cuenta

- **Inicio**: 2026-10-12, sesión Frontend (leader), worktree
  `Pet-Tracker-wt-167`, branch `feature/167-mobile-account-screens-pingo`
  desde `origin/main` d2b8b0ae (merge de #166).
- **Estado**: `in_progress` desde 2026-10-12 (spec firmada en Notion, edición
  2026-10-12T15:24:14Z). Implementa Codex CLI.
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
- **Solapes con #169** (sites-99, H0 fc384b44): los mismos de #170 (§2.24, la línea
  `- 1, // #159 R2`, `ui-copy-table.ts`, `ui-language.test.ts` y
  `consistency-classnames.test.ts`). Se tratan igual.
- **Solapes con #170** (Backend, handoff 4a68bfe0, Codex en marcha): #170 también
  abre §2.24, suma +7 al catálogo (la misma expresión que B15) y toca
  `ui-copy-table.ts`, `ui-language.test.ts` y `consistency-classnames.test.ts`. Si
  mergea antes del handoff de #167, re-medir B5–B10, B15 y §2.N. Los conflictos se
  resuelven en el merge sumando los deltas. Antes de lanzar init.sh, avisar a Backend.
- **Firma (2026-10-12)**: `Estado del gate` = Aprobado en Notion. Antes del
  commit de firma, el leader corrigió R11.3 cláusula 3: aseveraba el cuerpo de
  R11.2 con `- [ ] Enmienda aprobada por humano`, así que se habría puesto rojo
  en cuanto se marcara la casilla. Ahora tolera `[ xX]`, como `#65 R19`. El
  humano marcó `[X]` en esa casilla en Notion (P8): el leader la marca en
  `docs/ui-guidelines.md` en el cierre, citando esa edición.
- **Trabajo futuro**: las ocho viñetas [F] de §Fuera de alcance quedan como
  #172 `mobile-account-screens-polish` (`pending`, sin spec), a petición del humano.
- **Handoff** (2026-10-12): `progress/handoff_mobile-account-screens-pingo.md`, 26 commits
  c1–c26 + trazabilidad + impl. 51 anclas re-medidas en H0 con origin/main = d2b8b0ae
  (#168–#171 sin mergear). Cifras no medidas en el árbol real, marcadas `<SIN MEDIR>`:
  ALL tras c1 (2775) y ALL final (99/2841 = 2775 + 66); la simulación tuvo rojos de
  entorno (copia sin `.env.example` ni `hosting/`). Correcciones del leader a
  tasks.md/design.md en H0, listadas en la cabecera del handoff.
- **Siguiente**: esperar a Codex. Después: avisar a Backend (#170) y sites-99 (#169),
  init.sh (pgrep antes), reviewer, push y PR, smoke R15 del humano y cierre (marcar la
  casilla de la carta citando la edición de Notion 2026-10-12T15:24:14Z).
