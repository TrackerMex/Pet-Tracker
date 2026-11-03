# review: mobile-tab-avatar-header (#222) R12, carta regla N1
Fecha: 2026-11-03
Veredicto: APROBADO (alcance R12; con una observacion menor para el leader)

Cadena revisada: `95b50ed7` (tests rojos) -> `eb2bced7` (carta) -> `17669a3e` (trazabilidad + reporte), sobre `42a813a7`.

## Checklist C2 — Estado coherente
- [x] Sin cambios en `feature_list.json`, `progress/current.md` ni `STATUS.md` (diff 42a813a7..HEAD).
- [x] Arbol limpio en la rama `feature/222-r12-charter-n1`.

## Checklist C3 — Arquitectura
- [x] N/A en la practica: sin produccion tocada. Diff contra `42a813a7` = solo 6 ficheros, todos de la lista cerrada del handoff:
  `docs/ui-guidelines.md`, `hero-header-amendments.test.ts`, `tab-headers-canvas.test.ts`, `progress/impl_mobile-tab-avatar-header-r12.md`, `specs/.../tasks.md`, `specs/.../traceability.md`.

## Checklist C4 — TDD
- [x] R12 tiene tests que lo nombran: `#222 R12: la carta recoge la enmienda N1 de #222`, los tres `it` de `#222 R11 ... (enmendado por #222 R12)` y el `it` de #168 con sufijo `(enmendado por #222 R12)`.
- [x] Historial rojo->verde real: worktree desechable en `95b50ed7` (carta vieja) con jest dirigido da `5 failed, 18 passed, 23 total`, los mismos cinco `it` que lista el reporte. En HEAD: `23 passed`. Commit 1 solo tests, commit 2 solo carta.
- [x] R12.3 cumplido: (1) test `#222 R12` exige `**Regla N1 (enmienda #222)**` y niega `(enmienda #196)` y `Inicio es la unica pestana con PetHeroHeader`; (2) marker de la fila de `docs/ui-guidelines.md` en `AMENDED_DOCS_168` = `CHARTER_N1_222`; (3) septima fila de `AMENDED_DOCS_222` con `CHARTER_N1_222`. La constante se declara una vez (linea 131) y se usa en las lineas 156 y 258. `toHaveLength(7)`.

## Checklist C5 — Trazabilidad
- [x] Fila R12 con hashes literales completos de `95b50ed7...` y `eb2bced7...` (existen en el historial), tests nombrados, sin "pendiente".
- [x] Commits `test(mobile): #222 R12 ...`, `docs(ui): #222 R12 ...`, `docs(spec): #222 R12 ...` nombran R12.
- [x] tasks.md: las tres casillas de R12 marcadas, nada mas.

## Checklist C6 — Spec aprobada
- [x] R12.3 enmendada por `42a813a7` (permite historial test-primero); casilla G4 marcada (`grep -cE '^- \[[xX]\] G4 '` = 1, fecha 2026-11-03).

## Checklist C7 — Sin codigo huerfano
- [x] N/A: no se reemplaza codigo; la aserciones viejas se reescribieron en su sitio (B17 = 0, B18 = 1 verificados con grep -cF).

## Verificaciones especificas pedidas
- R12.1 byte a byte: extraido el literal de requirements.md y comprobado por script que (a) aparece como linea completa en `docs/ui-guidelines.md` (una sola regla N1) y (b) esta contenido en `CHARTER_N1_222`.
- R12.2: bloque `## Enmienda #222 — avatares fijos y sin titulo en las pestanas` tras `## Enmienda #209` (ultimo existente), con Spec enmendada `docs/ui-guidelines.md` y Que cambia `regla N1: avatares fijos y sin titulo en Salud y Nutricion`; firma `- [X] Enmienda docs/ui-guidelines.md aprobada por humano` + nota identica a la de #209 + referencia a `requirements.md` §Aprobacion, casilla G4. Sin "Firma delegada". El test de firma exige esa forma exacta.
- Las otras seis specs conservan `- [ ] Enmienda #222 aprobada por humano` sin marcar (6 lineas, ninguna `[X]`) y sin diff contra `42a813a7`.
- Lista cerrada: confirmada (ver C3). Sin produccion, dependencias, otras specs.
- `tsc --noEmit`: exit 0. `git diff --check 42a813a7..HEAD`: limpio.
- Jest dirigido en HEAD: 2 suites, 23 tests verdes.

## Observaciones
1. Menor, para el leader (no bloquea R12): la fila R11 de `traceability.md` (linea 23) conserva la prosa obsoleta "septima fila (carta) pendiente solo en R12". Ya no es cierta tras este commit y hace que `grep -i pendiente` de la regla del reviewer dispare. El handoff limitaba la edicion a la fila R12, asi que Codex hizo lo correcto; el leader debe limpiar esa frase en un commit de docs antes del cierre global de la feature (donde se re-aplica la regla "sin filas pendiente").
2. `init.sh` no se corrio (lo corre el leader, segun instruccion). Durante la revision habia un `init.sh` del leader en curso; la verificacion de `init.sh` verde queda a cargo del leader antes de la PR.

## Output de verificacion
```
95b50ed7 (carta vieja): Tests: 5 failed, 18 passed, 23 total
HEAD 17669a3e:         Tests: 23 passed, 23 total
tsc --noEmit: 0
```
