# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #63 `mobile-detail-screens-state-reset` (P2)

- **Sesion**: Frontend, worktree `/home/claude/sites/Pet-Tracker`.
- **Branch**: `feature/63-mobile-detail-screens-state-reset`, desde `origin/main` `66a9d52b`
  (tras mergear #127 y #128).
- **Estado**: `pending` → `spec_author` lanzado. Sin `explorer`: el enunciado de
  `feature_list.json` ya trae la exploracion (causa raiz, lineas y el detalle del
  mock de `useFocusEffect` en `pairing/index.test.tsx`).
- **Baseline**: `./init.sh` VERDE, exit 0, medido sin pipe sobre `66a9d52b` (el commit
  del que sale la branch; el unico commit encima, `2c516932`, solo toca este archivo).
  Sin concurrencia con la sesion Backend (`pgrep` limpio antes de lanzarlo).

  | Bloque | Suites | Tests |
  |---|---|---|
  | backend | 166 | 1277 |
  | infra | 2 | 14 |
  | movil | 73 | 1265 |
  | e2e | 26 de 29 (3 skipped) | 365 passed de 373 (8 skipped) |

  Estas cifras son el punto de comparacion para el **delta** de #63. No las copies
  como constante en la spec: se miden de nuevo contra este commit al cerrar.

### Decision que la spec tiene que cerrar

Criterio 3 del enunciado: **Stack vs reset local**. Sacar las pantallas de detalle
del Tabs arregla de raiz el remount y ademas cierra el teleport sin transicion (M3 de
`progress/audit_animations_mobile.md`) y la cabecera a mano; el reset local es menos
codigo pero deja las dos cosas abiertas. `/pairing` es caso aparte: es pestaña por la
decision D4 de #42 y su arreglo ya esta prescrito (reset de `code`, `actionError`,
`phase` y `readyDevice`).

### Spec entregada — PARADO EN EL GATE HUMANO

`specs/mobile-detail-screens-state-reset/` (R1-R7), pusheada en la branch.

- **D1: reset local en el cleanup de `useFocusEffect`**, no Stack. Cinco costes
  medidos contra el arbol; el Stack queda como deuda con enunciado listo en
  `requirements.md` §Deuda, no descartado.
- **Cinco pantallas**: add-reminder (R1), add-pet (R2, 15 `useState`),
  weight-log (R3, parcial), meal-schedule (R4, solo `generateError`), pairing
  (R5 blur + R6 cambio de `selectedPetId`). **docs NO** tiene el defecto: cero
  `useState`, con evidencia.
- **R7** cierra por mutacion en dos sitios que `submitting`/`claiming`/
  `releasing` SOBREVIVEN al blur (guardas de peticion en vuelo).
- Erratas del enunciado corregidas contra el arbol: `add-reminder` declara sus
  nueve `useState` en `:49-57` (no 39-47), el `router.back()` del alta esta en
  `:89` y hay un segundo en `:133`, y `pairing` declara **seis** `useState`, no
  cuatro. Verificadas por el leader, no solo por el spec_author.
- **Correccion del leader a `design.md`**: la justificacion afirmaba que
  `unmountOnBlur` "ya no existe" en expo-router 57.0.14. Si existe, en
  `ui/TabContext.d.ts:7`, pero es la API de tabs headless (`expo-router/ui`)
  que la app no usa. Lo cierto, y lo que queda escrito, es que no esta en
  `BottomTabNavigationOptions`, que es el navegador que monta
  `(tabs)/_layout.tsx`.

### Dos decisiones que esperan al humano, no las tomo yo

1. **Registrar la deuda `mobile-detail-screens-to-stack`** (seria #95). En
   espera a proposito: si el humano rechaza D1 y elige el Stack, esta deuda no
   existe.
2. **`reminders` y `alerts`** tienen el mismo patron (`deletingId`,
   `deleteCandidate`, `actionError` / `acked`, `ackingId`, `actionError`) y
   quedaron FUERA porque el criterio 4 del enunciado de #63 acota a cuatro
   pantallas. Anotadas en `design.md` §Auditoria. Decidir si se meten en #63
   ampliando el alcance, o si van a feature aparte.

### Pendiente despues del gate

1. Handoff a Codex CLI (plantilla de `.claude/agents/leader.md`, exigiendo
   commits test-primero).
2. `reviewer`.
3. Gate humano final: smoke en **dev build de Android**, crear dos recordatorios
   seguidos.
