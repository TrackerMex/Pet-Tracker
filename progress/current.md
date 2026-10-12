# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

## #169 mobile-weight-draw-and-toasts — implementación con Codex (sesión sites-99)

- Inicio: 2026-10-11. Asignada por Frontend (fila 3 «Salud y rutina» del canvas, parte 1).
- Worktree: `../Pet-Tracker-wt-169`, branch `feature/169-mobile-weight-draw-and-toasts`,
  base origin/main 89fe2009. `.env` copiado del árbol principal.
- Spec aprobada vía Notion (firma ccb4ad61, 2026-10-12; P1 a P7 con su valor
  por defecto). Página: https://app.notion.com/p/3f66115a9b27811b8c72f46cec163a90
- Estado: `in_progress` desde 2026-10-12. Handoff a Codex CLI en
  `progress/handoff_mobile-weight-draw-and-toasts.md` (27 commits, sondas S1,
  S4a, S4b, S6 y S11). H0 = el commit que añade el handoff.
- Plan: el humano lanza Codex y avisa al terminar → el leader lee
  `progress/impl_mobile-weight-draw-and-toasts.md` → pide permiso, avisa y
  corre `./init.sh` → `reviewer` → smoke R14 del humano en el dev build de
  Android → Notion Implementado/Completado → PR.
- Medidas del leader en H0: BASE de 9 ficheros = 326 tests; suite móvil
  entera (ALL) = 98 suites / 2775 tests, exit 0. Cierre esperado: BASE 363,
  ALL 99 suites / 2823.
- #166 mobile-chunky-cta mergeado en main (PR #209, d2b8b0ae) y en esta branch
  (merge, no rebase) en 4d455cab; spec re-medida en 259c7c8f sin cambios.

### Decisiones del humano

- 2026-10-11, cuestionario en el chat: «Solo peso (Recommended)». El toast con
  háptico va solo al registrar peso. La premisa «al completar un recordatorio»
  era falsa contra el árbol: `ReminderStatus = 'scheduled' | 'sent' | 'cancelled'`
  (`mobile-pet-tracker/src/api/types.ts`), el PATCH de `reminders.controller.ts`
  solo cancela o edita y `src/api/reminders.ts` solo trae list/create/delete.
  Corregidas la descripción de #169 en `feature_list.json` y la fila 3 de
  `progress/explore_ui-canvas-parity.md` §6. La feature aparte no reserva id
  todavía (se mide contra origin/main al registrarla).

### init.sh

- Cola acordada entre sesiones: Backend → UI-Pet → sites-99 → sites-4c.
  Lanzado tras el aviso de UI-Pet (EXIT=0). Terminado: EXIT=0, «Todo verde»
  (medido sin pipe). Avisados sites-4c [87612b] y Frontend.

### Paradas de Codex

- Parada 1 (c7, 2026-10-12): `bunx expo lint --no-cache` imprimió
  `Failed to run "eslint" due to signal SIGKILL` pero salió con 0. El `&&`
  dejó pasar el commit `9f78ebbc`, y Codex paró sin reset ni amend, como
  debía. Causa: el entorno, no el código. La carga media fue de 36 en 5 min
  con otras sesiones (16 GB, sin swap).
  - Verificación del leader: lint sobre 9f78ebbc con exit 0 y salida
    vacía, y `bunx eslint --stdin` del fichero de cada commit, c1–c6,
    limpio.
  - Reanudación 1 en el handoff: el lint de las cadenas exige salida vacía
    (`> /tmp/169-lint.txt 2>&1 && test ! -s`) y se permite un reintento
    entero ante SIGKILL. Sigue en S4a/S4b → c8.
- Parada 2 (c12, 2026-10-12): el rojo de T7 salió bien (`4 failed, 33
  passed, 37 total`, por consulta), pero el typecheck falló con TS2769 en el
  doble de reicon: `style={{ color }}` no cabe en `ViewStyle`. Era un
  defecto de la spec, porque la tabla de dobles de `tasks.md` prescribía
  `View` y el leader no la pasó por tsc. c8 a c11 quedaron commiteados con
  typecheck, lint y log vacíos en orden.
  - Verificación del leader fuera del árbol (copia con el test sin
    commitear de Codex): con `Text` y una `function MockIcon` con nombre,
    `tsc` da 0, eslint da 0 (una flecha anónima rompía `react/display-name`)
    y el rojo sale igual. Una sonda aparte confirmó `props.style.color` y
    `props.size` en un `Text`.
  - Enmendada la fila de `reicon-react-native` en `tasks.md`.
    Reanudación 2 en el handoff: cambiar solo el doble, con anclas
    `grep -cF`, y repetir c12 entera. Sigue en c13.
  - c12 cerrado por Codex en `6569bd89`, con typecheck, lint y log vacíos.
- Parada 3 (c13, 2026-10-12): en la medida `<PESO>`, el `it` de mobile-health
  R7 `keeps API order and renders each weight detail` falló. Su
  `getAllByTestId(/^weight-row-/)` atrapa también los testIDs nuevos
  `-tone` y `-delta` de R8 (seis ids en vez de dos). Era un defecto de la
  spec: no se buscaron con grep los selectores por prefijo. No se renombra
  (reabriría el gate). Se ancla el selector a
  `/^weight-row-weight-\d+$/` en el commit verde de c13, y es el único
  selector por prefijo de `weight-row-` en el repo.
  - Medido fuera del árbol: `<PESO>` 130, `<GUARDAS>` 92, tsc 0, eslint 0,
    y las anclas de la cadena ejecutadas dan 0.
  - Enmendado T7 (2) en `tasks.md`. Reanudación 3 en el handoff, con la
    cadena de c13 reescrita (dos ficheros). Sigue en c14.
  - Codex cerró c13 `b294c719`, c14 `b10d1dab` y c15 `825abbc7`, y la
    sonda S6 (un rojo, revertida). `<PESO>` dio 130 en c13 y 134 en c15, y
    `<GUARDAS>` 92, como en el bloque principal.
- Parada 4 (c16, 2026-10-12): la herramienta de Codex le devolvió el control
  con jest todavía corriendo. Codex leyó el log sin resumen y lanzó la cadena,
  que cortó en su primer grep, sin typecheck, add ni commit. Al terminar, el
  rojo era el esperado: `3 failed, 41 passed, 44 total`, los tres de
  `#169 R7: tono del delta del mes` por aserción. Fallo de secuencia de
  Codex, no de la spec: no hay enmienda en `tasks.md`.
  - Reanudación 4 en el handoff: cada medida acaba en `echo "exit=$?"` y no
    se lee su log ni se lanza la cadena hasta ver `exit=`. Repetir c16
    entera. Sigue en c17.

### Codex terminado (2026-10-12)

- 27 commits, de `98db0006` a `f314978d`. Hubo dos reintentos de lint por
  SIGKILL (c21 y c23), con `pgrep` de init.sh vacío y sin cambios de código.
- R11 nace verde, como preveía el handoff. S11 dio `9 failed, 45 passed,
  54 total` por aserción, igual que el valor prescrito.
- Medidas de cierre de Codex: BASE 9/363, `monthly-weight-delta` 1/11, ALL
  99/2823, todas con exit 0. typecheck 0 y lint con salida vacía.
- Lista cerrada contra H0 fc384b44: 14 ficheros, verificada también por el
  leader. origin/main sin commits nuevos respecto a la branch.
- Pusheado a origin. El humano autorizó init.sh. Queda en cola tras el
  init.sh de Frontend (#167, wt-167) → reviewer.
- Choques conocidos al mergear main, avisados por Frontend:
  - #167 cambia la misma línea `- 1, // #159 R2` de language-provider.
    Resolución: `- 1 // #159 R2`, `+ 1 // #167 R5`, `+ 2, // #169 R9`.
  - §2.24 de specs/mobile-ui-language/design.md la abren también #167 y
    #170: quien mergee después renumera.

### Gate y revisión (2026-10-12)

- init.sh del leader sobre `dbe183a6`: EXIT=0, «Todo verde» (móvil 99/2823,
  backend 1474, e2e 468 + 8 skipped), con avisos de inicio y fin a los peers.
- Reviewer: **RECHAZADO** (`progress/review_mobile-weight-draw-and-toasts.md`).
  Los tres bloqueantes son de la spec, no del trabajo de Codex:
  - E1: la columna «Test» de `traceability.md` seguía en «pendiente»;
  - E2: R1 y R2 solo muestreaban `p` en 0 y 1, así que un salto brusco pasaba;
  - E3: la tabla de R5 no separaba posición de valor.
- El leader confirmó E2 y E3 fuera del árbol y, al ensanchar cada candado a
  su cláusula entera, halló dos huecos más de R5: M3c (base = la más pesada
  anterior al mes) y M3d (paso 5 por fecha, no por identidad).
- E1 lo cierra el leader: columna «Test» rellena con `archivo::describe`.
- E2 y E3 van a la **Enmienda E1** (requirements.md y tasks.md, solo tests y
  con la producción idéntica a `f314978d`). Primera versión en `02da4c11`:
  2 `it` en weight-chart y las filas 12-14 en monthly.
- Barrido del reviewer sobre `02da4c11` (§Barrido de la Enmienda E1 de la
  revisión): **insuficiente**, con 4 huecos más, cada uno con su cierre
  medido:
  - H1: R1, `L` por cuerda;
  - H2: R1 y R2, `p` parte de 1;
  - H2b: R3, `p` no arranca en 1 (preexistente);
  - H3: R5, redondeo a 1 decimal.
- El leader re-midió los cuatro cierres fuera del árbol con el texto literal
  de tasks.md: rojos 4/15/19, 1/19/20 y 4/11/15, por aserción; siete sondas;
  GRAFICA 145, GUARDAS 92, BASE 368; tsc y eslint 0.
  - Enmienda ensanchada: 5 `it` y el espía `useSharedValue` en weight-chart,
    y las filas 12-15 en monthly, en 7 commits.
  - Cierre esperado: ALL 99/2832.
  - H2b entra en esta ronda y no pasa a deuda: es el mismo fichero y el mismo
    tipo de candado.
- Pendiente de la firma humana vía Notion. Después, Reanudación 5 de Codex.
