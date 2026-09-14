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

### Spec APROBADA — parado esperando a Codex CLI

Firma humana `1a9fef11` (AlexisSM377, 2026-09-14). Verificada: toca **solo** la
casilla de aprobacion, sin drift de codigo colado. Frontmatter de los cuatro
ficheros a `approved`; #63 a `spec_ready`.

`specs/mobile-detail-screens-state-reset/` (R1-R7):

- **D1: reset local en el cleanup de `useFocusEffect`**, no Stack. Cinco costes
  medidos contra el arbol.
- **Cinco pantallas**: add-reminder (R1), add-pet (R2, 15 `useState`),
  weight-log (R3, parcial), meal-schedule (R4, solo `generateError`), pairing
  (R5 blur + R6 cambio de `selectedPetId`). **docs NO** tiene el defecto: cero
  `useState`, con evidencia.
- **R7** cierra por mutacion en dos sitios que `submitting`/`claiming`/
  `releasing` SOBREVIVEN al blur (guardas de peticion en vuelo).
- Erratas del enunciado corregidas contra el arbol y verificadas por el leader:
  `useState` de add-reminder en `:49-57` (no 39-47), segundo `router.back()` en
  `:133`, y `pairing` declara **seis** `useState`, no cuatro.
- Correccion del leader a `design.md`: `unmountOnBlur` SI existe en el arbol
  (`ui/TabContext.d.ts:7`), pero en la API de tabs headless `expo-router/ui`
  que la app no usa. Lo que se verifica y queda escrito es que no esta en
  `BottomTabNavigationOptions`.

### Deuda registrada

**#95 `mobile-detail-screens-to-stack`** (P3), con el enunciado que la spec dejo
listo. La via del Stack queda pospuesta por coste, no descartada; retirar el
reset local de #63 donde quede redundante es parte de su cierre (C7).

### Decision que sigue abierta (del humano, no la tomo yo)

**`reminders` y `alerts`** tienen el mismo patron (`deletingId`,
`deleteCandidate`, `actionError` / `acked`, `ackingId`, `actionError`) y
quedaron FUERA porque el criterio 4 del enunciado de #63 acota a cuatro
pantallas. Anotadas en `design.md` §Auditoria. Decidir si van a feature aparte.
No bloquea #63.

### Estado: handoff escrito, leader PARADO

`progress/handoff_mobile-detail-screens-state-reset.md`. Lo corre el humano en
su terminal de Codex CLI. Mientras Codex implementa, esta sesion **no toca**
`mobile-pet-tracker/`: solo `docs/`, `specs/`, `progress/` y
`feature_list.json`.

El handoff prohibe `./init.sh` a Codex (Postgres compartido con la sesion
Backend, que trabaja #92 en `Pet-Tracker-wt-backend`) y le da el comando
dirigido de jest en su lugar.

### Implementacion Codex en curso

- **Inicio:** 2026-09-14, sobre `b3b957d9`, en la branch entregada.
- **Precondiciones:** skills `expo-overview` y `expo-router` cargadas en ese orden;
  `.expo/types/router.d.ts` ausente; baseline dirigido verde (5 suites, 106 tests).
- **Plan:** ejecutar R1-R7 en el orden de `tasks.md`, con commit rojo, verde y
  trazabilidad por requisito; despues mutaciones R7, typecheck, lint y reporte.

### Pendiente

1. El humano confirma que Codex termino; leer `progress/impl_*.md`.
2. Lanzar `reviewer` — avisando antes a la sesion Backend por SendMessage,
   porque ese si corre `./init.sh`.
3. Gate humano final: smoke en **dev build de Android**, crear dos recordatorios
   seguidos.
