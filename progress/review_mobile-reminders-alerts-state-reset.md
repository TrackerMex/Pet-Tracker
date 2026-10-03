# review: mobile-reminders-alerts-state-reset (#97)
Fecha: 2026-09-15
Branch: `feature/97-mobile-reminders-alerts-state-reset` @ `d698610e`
Base: `0e4aa810` · Spec aprobada por humano en `da957174`
Veredicto: **APROBADO** (sujeto al gate humano, ver §Gate humano no cerrable)

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` en `feature_list.json` (#97; `grep -c` = 1)
- [x] `progress/current.md` en plantilla — estado admitido por C2
- [x] `feature_list.json` sigue en `in_progress`, **no** en `done`: correcto, el
      gate humano no está cerrado

## Checklist C3 — Arquitectura

- [x] No se toca `backend-pet-tracker/`: la regla de dependencia de
      `docs/architecture.md` no entra en juego
- [x] Estructura Expo oficial respetada: el cambio vive en `src/screens/`, los
      route files de `src/app/(tabs)/` quedan intactos (verificado por
      `git diff --name-only`: `app/`, `components/`, `theme/`, `i18n/` sin tocar)
- [x] `useFocusEffect` importado de `expo-router` (no de `@react-navigation`) en
      las dos pantallas, coherente con expo-router `~57.0.14` y con el uso
      preexistente de `reminders/index.tsx:6`

## Checklist C4 — TDD

- [x] Cada R1–R8 tiene `describe` que lo nombra **con prefijo de feature**
      (`#97 R1:` … `#97 R8:`), como exige `docs/conventions.md`
- [x] Historial test-primero real: 27 commits, un `test(...)` rojo y un
      `feat(...)` verde por requisito, más un `docs(...)` de trazabilidad. Nada
      de implementación+tests+docs en un solo commit
- [x] **Rojos verificados por mí, no aceptados del reporte.** Checkout de cada
      commit rojo en worktree aislado y ejecución dirigida:

  | R | commit rojo | exit | falla por |
  |---|---|---|---|
  | R1 | `e4b77d28` | 1 | aserción: el sheet sigue en el árbol (1 failed / 22 skipped / 23) |
  | R3 | `c1705c44` | 1 | aserción `index.test.tsx:788` `Expected: true / Received: false` (1 failed / 24 skipped / 25) |
  | R5 | `9eec5bad` | 1 | aserción: `is not disabled` + `Expected substring: not "AckingId"` (2 failed / 27 skipped / 29) |
  | R6 | `f8cc86ed` | 1 | aserción: `Unable to find … alert-row-alert-1-status` (1 failed / 29 skipped / 30) |
  | R8 | `3ea45ed6` | 1 | aserción: `Expected instance to have text content` (1 failed / 31 skipped / 32) |

  Los recuentos coinciden **exactamente** con los del reporte del implementador.
- [x] **Ningún rojo falla por `ReferenceError`/`TypeError`** de un helper que no
      existe (C4, cuarto punto): los cinco fallan por su propia aserción
- [x] **Ningún rojo falla por mutación del doble de test** (C4, quinto punto):
      ver §Requisitos de verificación

## Requisitos de verificación (R3, R5, R6) — mutación de producción

C4 quinto punto y `traceability.md` exigen las **cuatro** salidas de mutación.
Verificadas las cuatro, y verificado en el `git diff` de cada commit que la
mutación está **versionada en el rojo** y **revertida en el verde**:

| Sonda | Mutación versionada en el rojo | Revertida en el verde |
|---|---|---|
| R3 | `c1705c44` añade `setDeletingId(null);` al cleanup de `RemindersScreen` | `9bbf664f` lo quita — blob `536010fb → 21c11199`, idéntico al estado de R2 |
| R5 (1ª) | `9eec5bad` añade `setAckingId(null);` **y** `ackingIdRef.current = null;` | `f838fe96` quita las dos — blob `8ff15a89 → 4482f40f` |
| R5 (2ª, zona ciega) | solo `ackingIdRef.current = null;` — sonda intermedia, no versionada | reproducida por mí (ver abajo) |
| R6 | `f8cc86ed` añade `setAcked({});` al cleanup de `AlertsScreen` | `3d12a476` lo quita — blob `02b33b92 → 4482f40f` |

Los hashes de blob confirman que cada verde restaura **el blob idéntico**
anterior, no una reescritura equivalente. Es mutación de producción real, no de
un mock.

**Segunda sonda de R5 reproducida por mí** (la única que ningún commit versiona,
por ser intermedia). Aplicada sobre `f838fe96` en el worktree desechable,
nunca en la rama:

```
✓ mantiene bloqueado el ack que sigue en vuelo (232 ms)
✕ no resetea el estado ni el ref desde el cleanup de foco
  Expected substring: not "ackingIdRef"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 skipped, 1 passed, 29 total
```

Coincide literalmente con lo reportado. Es la prueba de que el ref tiene candado
propio: el `it` de comportamiento se queda **verde** (el `ackingId` de estado
sigue deshabilitando el botón) y solo el `it` de fuente lo caza. Exactamente la
lección de *prueba de mutación en zona ciega*: el candado se plantó donde el
observable de comportamiento no mira.

## Checklist C5 — Trazabilidad

- [x] `traceability.md` sin ninguna fila "pendiente" (la única aparición de la
      palabra es la regla en la línea 28, no una fila)
- [x] Los **17 hashes** registrados existen y son **ancestros de HEAD**
      (`git merge-base --is-ancestor`, uno a uno). No hubo rebase que los
      invalidara
- [x] `0e4aa810` sigue siendo ancestro de HEAD
- [x] Commits con el formato `feat|test|docs(reminders-alerts-state-reset): …`

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved`
- [x] Casilla "Aprobado por humano (fecha: 2026-09-15)" marcada en `da957174`,
      **autoría humana real** (`AlexisSM377 <al222111377@gmail.com>`), no Claude
- [x] Enmienda **E9** firmada en los dos sitios: el humano marca la casilla de
      `specs/mobile-reminders-alerts-state-reset/requirements.md` en ese mismo
      `da957174`; la casilla espejo de `specs/mobile-alerts-center/requirements.md`
      la propaga `784ac942` citando ese commit. Ningún requisito se modificó
      después del gate
- [x] E9 implementada **tal cual**: el overlay solo se aplica mientras la alerta
      descargada siga siendo `open`; `fetched` y `ordered` intactos

## Checklist C7 — Sin código huérfano

- [ ] N/A — esta feature no reemplaza ni deja obsoleto ningún componente,
      pantalla o módulo. Añade un cleanup, un `refetch` y una condición; no
      borra nada. No hay tests huérfanos

## Checklist C8 — Carta de UI

- [x] Grep-clean en los dos ficheros de producción tocados: cero hex, cero
      `StyleSheet.create`, cero shadow/elevation legacy, cero clases arbitrarias
- [x] No se añade ni una `className`, token, dimensión, animación ni componente,
      conforme a §Fuera de alcance
- [x] `src/__tests__/design-drift.test.ts` y `ui-language.test.ts` verdes dentro
      de las 73 suites móviles de `./init.sh`

---

## Verificaciones específicas del encargo

**1. Los 8 R-ids contra el código real.** Leídas las aserciones, no los títulos.
Producción en HEAD:

- `reminders`: cleanup = `setDeleteCandidate(null); setActionError(null);` → R1, R2
- `alerts`: cuerpo `void refetchAlerts();` (R7), cleanup = `setActionError(null);` (R4)
- `alerts` R8: `ordered.map((alert) => alert.status === 'open' ? (acked[alert.id] ?? alert) : alert)`

R3, R5, R6 son negativos y se cierran por candado + mutación (arriba).

**2. `deletingId` NO se resetea.** Confirmado en HEAD: el cleanup de
`RemindersScreen` contiene exactamente dos líneas y ninguna toca `deletingId`.
Su único camino a `null` sigue siendo el `finally` de `handleDelete`. La
divergencia razonada en §Divergencia del enunciado se respetó; Codex **no** la
"arregló" por el camino. El candado de R3 lo vigila con mutación probada.

**3. `acked` SOBREVIVE.** Confirmado: el cleanup de `AlertsScreen` no menciona
`setAcked`. No hay regresión: una alerta atendida sigue atendida al volver. R6 lo
prueba con `listAlerts` **pendiente** tras la primera página, así que ninguna
descarga nueva puede explicar el verde.

**4. R8 / E9.** El código implementa la línea de composición enmendada y nada
más. El motivo se sostiene contra el árbol:
`backend-pet-tracker/src/workers/alerts-engine/alerts-engine.drizzle.store.ts:102`
cierra por `status IN ('open','acked')`, así que una alerta `acked` puede pasar a
`closed` en el servidor y el overlay incondicional la habría dejado "Atendida"
para siempre. Con R8 el overlay caduca en cuanto la descarga deja de darla por
abierta.

**5. El patrón de #72 NO se ha reproducido.** Revisados los 9 `it` nuevos uno a
uno. **Cero apariciones de `queryClient` o `getQueryData` en las líneas añadidas**
de los dos ficheros de test (verificado con grep sobre el diff `0e4aa810..HEAD`).
Todas las esperas son a la condición **de la pantalla**
(`await waitFor(() => expect(screen.getBy…))`) y las aserciones van después. No
se siembra el flake que #72 tiene que arrancar.

**6. Cero claves de i18n.** Verificado por hash de blob, que es más fuerte que un
diff vacío:

```
src/providers/__tests__/language-provider.test.tsx  base=HEAD=1b8306e7402b793a187cb5f7589bc5219ff955ef
src/i18n/catalog.ts                                 base=HEAD=86b82f5f990f66f7219441d57f3eb9e9275f55b1
```

El candado de longitud queda **byte a byte idéntico**. El acuerdo con la otra
sesión se mantiene.

**7. Los dos commits extra de R1 son refuerzo legítimo, no tapan un fallo.**
- `7f8fad59` cambia una sola línea: `queryByText('¿Eliminar recordatorio?')` →
  `queryByTestId('reminders-delete-sheet')`, que es el testID que **la propia R1
  nombra literalmente**. Alinea el test con la spec.
- Comprobado que el ciclo original ya era honesto: R1 en su rojo `e4b77d28` falla
  por aserción (exit 1) y en su verde original `958bc293` **pasa** (exit 0, 1
  passed / 22 skipped). El commit extra no repara un verde roto.
- La aserción nueva **no es vacua**: `reminders-delete-sheet` existe en
  producción (`reminders/index.tsx:359`) y aparece en el árbol renderizado que
  imprime el rojo de R1.
- `8bb3b318` solo refleja ese cambio en `traceability.md`.

**8. Alcance del diff: la explicación de Codex se sostiene.** El total literal
contra `0e4aa810` son **once** ficheros y son exactamente los previstos: los
nueve de `tasks.md` (2 producción + 2 test + `specs/mobile-alerts-center/requirements.md`
+ los 4 de esta spec), más `feature_list.json` (cuyo único cambio es
`pending → in_progress`, del commit de aprobación `784ac942`) y el propio reporte
de implementación. **Ningún fichero fuera de esos once.**

**9. Filtro de jest con paréntesis escapados.** Repetido el comando de
§Verificación tal cual, en worktree limpio a HEAD:

```
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/app/(tabs)/__tests__/alerts.test.tsx
PASS src/screens/alerts/index.test.tsx (7.391 s)
PASS src/screens/reminders/index.test.tsx (7.632 s)
Test Suites: 4 passed, 4 total
Tests:       66 passed, 66 total       exit 0
```

**Cuatro suites, las cuatro nombradas.** El filtro no saltó ningún fichero en
silencio.

**10. Sin regresiones ni `it` perdidos.** Delta de `it(` contra `0e4aa810`:
`alerts` 21 → 27 (+6: R4, R5×2, R6, R7, R8), `reminders` 12 → 15 (+3: R1, R2, R3).
**Ningún `it` existente desapareció ni cambió de nombre** (`comm -23` vacío en los
dos ficheros).

**11. Flakes de #72.** No se manifestaron: `./init.sh` salió verde **a la
primera**, sin FAIL, incluidos `src/screens/alerts/index.test.tsx` y
`src/screens/add-pet/index.test.tsx`. No hubo por tanto ningún rojo que
distinguir entre flake preexistente y defecto de #97. Los dos flakes de #72
siguen vivos como deuda P2 — esta feature no los arregla (está fuera de alcance)
pero tampoco los agrava, y no toca el `it` afectado.

---

## Observaciones

Ninguna que impida el cierre. Dos notas menores, sin efecto sobre el veredicto:

1. `progress/current.md` está en plantilla en vez de describir la sesión. C2 lo
   admite explícitamente ("vacío (plantilla) **o** describe la sesión activa").
2. La segunda sonda de R5 es, por naturaleza, intermedia y no queda versionada en
   ningún commit. La he reproducido yo para no depender del reporte; queda arriba
   con su salida. Si se quisiera trazable sin reviewer, habría que versionarla
   como un tercer commit, pero la spec no lo pide.

## Gate humano no cerrable por una IA

La feature **no pasa a `done`** hasta que el humano cierre su gate. Comprobado
que sigue pendiente y que **el reporte del implementador no lo da por cumplido**
("El smoke test en dev build Android queda pendiente de ejecución humana").

Pendiente, en **dev build de Android** (nunca Expo Go):

1. Abrir la confirmación de borrado en Recordatorios, salir por la barra de tabs
   y volver: la hoja no está abierta y el recordatorio sigue existiendo.
2. Provocar un error de borrado, salir y volver: el mensaje rojo ya no está.
3. Atender una alerta, salir y volver: sigue atendida, sin parpadeo.
4. Con red, volver a entrar en Alertas: la lista se ha refrescado.

Yo apruebo C2–C8 y la trazabilidad. El paso a `done` es del humano.

---

## Output de `./init.sh`

Ejecutado por mí, en primer plano y **sin tubería** (redirección a fichero, que
preserva el exit code del gate):

```
cd /home/claude/sites/Pet-Tracker && ./init.sh > init1.log 2>&1; echo "EXIT_CODE=$?"
EXIT_CODE=0
```

Hitos (sin FAIL en todo el log, 15679 líneas):

```
→ Verificando entorno...
→ Verificando variables de entorno...
→ Instalando dependencias...
→ Verificando coherencia del harness...
→ Build...
→ Ejecutando tests...
Test Suites: 166 passed, 166 total        (backend unit)
Tests:       1279 passed, 1279 total
Test Suites: 2 passed, 2 total            (infra)
Tests:       14 passed, 14 total
Test Suites: 73 passed, 73 total          (mobile)
Tests:       1284 passed, 1284 total
→ Tests e2e...
Test Suites: 3 skipped, 26 passed, 26 of 29 total
Tests:       8 skipped, 367 passed, 375 total
✅ Tests e2e pasados
→ Lint...
✅ Lint sin errores
→ Typecheck...
✅ Typecheck sin errores
══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
  Features: 81/97 completadas | 15 pendientes
```

Nota de contención: la otra sesión (`Pet-Tracker-wt-backend`, #83) puede correr
`pnpm test`/`tsc`/`db:migrate` contra `pet_tracker_wt` sin avisar. Durante este
gate no se observó ningún rojo atribuible a contención de CPU.

## Nota de método

No se editó ni un fichero del proyecto. Las verificaciones de commits rojos y la
segunda sonda de R5 se hicieron en un `git worktree` desechable bajo el
scratchpad, con `node_modules` enlazado; el worktree se eliminó al terminar y el
árbol principal quedó limpio en `d698610e`.
