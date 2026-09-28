---
feature: "mobile-home-weight-without-collar"
status: approved           # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-home-weight-without-collar]] (#77)

R1, R2 y R3 viven en `mobile-pet-tracker/src/screens/home/index.test.tsx`, en
tres `describe` de nivel superior seguidos, inmediatamente antes de
`describe('R10: last position enlaza al mapa', () => {`. Commits con los
mensajes literales de [[tasks]] (`<scope>` = `mobile`).

**Codex rellena las columnas de commit en UN solo commit final**
`docs(mobile): fill #77 traceability`, **después del último verde** (R3). No
se toca este fichero en los commits TDD. El `reviewer` no aprueba si falta un
commit de R1-R3 (CHECKPOINTS C5). R4 la cierra el humano en su
casilla de [[requirements]].

Los rojos de R1 y R2 son **naturales**. R3 es un requisito de verificación
cerrado por la vía **(b)** de C4: su commit rojo versiona la mutación de
producción V3 y su commit verde la revierte ([[design]] D7). El verde de R3
deja `index.tsx` idéntico al del verde de R2.

Recuentos al cierre (base `a8d5cb70`): `src/screens/home/index.test.tsx`
**144 → 151 → 155 → 157** (con #126 ya en la base: **146 → 153 → 157 →
159**); móvil **83 / 1530 → 83 / 1543** (con #126: **83 / 1532 → 83 / 1545**);
backend, infra y e2e sin cambios.

**No rebasear después de rellenar esta tabla**: los hashes dejarían de ser
ancestros y habría que reapuntarlos verificando `git merge-base --is-ancestor`
([[requirements]] §Rebase sobre #126).

| Requisito | Test (título literal del `describe`) | Commit rojo | Commit verde |
|---|---|---|---|
| R1 — la celda de peso se pinta en `no-tracking`, `error`, `unreachable` y `missing-config`: `12.4 kg`, o `—` sin peso o sin perfil; cero llamadas nuevas (4 filas + 3 `it`) | `#77 R1: el peso se pinta aunque la actividad no esté disponible` | `a1ad6fc648b7ec151bfac669a481a926df738a58` | `f3a17f447da175c6c0ba122dc5ac2355a0a1bfdb` |
| R2 — sin actividad, la fila es la celda de peso (anatomía, clases, tinta `muted`) seguida de la nota, dos hijos, dentro de `summary-card`; sin celdas de actividad (4 filas) | `#77 R2: sin actividad, la fila es la celda de peso seguida de la nota` | `f489b4706db0c4413ab4736cbc43d0d27e8dbc55` | `8974590cf8da924a69f8dff72980f8c05df468a2` |
| R3 — ni celda ni nota mientras la actividad carga ni con `unauthorized` (2 `it`; rojo por V3 versionada) | `#77 R3: la fila no se pinta sin sesión ni mientras carga la actividad` | `4a9ab9cfb2e7a6a1c971932ea2d0d0a7bb784932` | `62a92ffd5c58dd30fa353f1bbfebf738f90e2e80` |
| R4 — smoke en dev build de Android con una mascota sin collar y con peso | humano | — | — (smoke humano por ejecutar; casilla de [[requirements]] §Prueba de humo) |
| R5 — (Enmienda 1) el test de orden de food espera la llamada a getNutritionPlan dentro de su waitFor; rojo por Q1 versionada, revertida en commit propio | R4: food resuelve la mascota seleccionada › keeps API order and selects the first pet by default (comentario #77 R5) | 3b0fcb6409dd9fb2ec2eeb9ff1c53ef8fa809b0c | d3cf35b54712bfbbb3853d50c8ed4cd13ff49626 (revert: 55533b96ea145da60b5bf1a5e99c24b75ee5438a) |

## Candados ajenos movidos

Ninguno. `language-provider.test.tsx`, `ui-language.test.ts`,
`consistency-classnames.test.ts` y `design-drift.test.ts` siguen verdes sin
tocarlos ([[requirements]] §Candados «Siguen verdes»). Lo único que se mueve
fuera del fichero de test de la Home es la spec
`specs/mobile-home-stats-strip/requirements.md`, que recibe
`## Enmienda #77 — el peso se desacopla de la actividad` (la escribe el
spec_author, la firma el humano; no viaja en ningún commit de Codex).
