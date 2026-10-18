# review: mobile-alert-detail-canvas-fidelity
Fecha: 2026-10-18
Veredicto: RECHAZADO

Rango revisado: H0 `30e36f12` (excluido) a HEAD `47650745`, 26 commits. Worktree `/home/claude/sites/Pet-Tracker-wt-180`, rama `feature/180-mobile-alert-detail-canvas-fidelity`.

Pre-check (`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/c9d4cb29-412b-4a0b-96f6-89d863ff3133/scratchpad/init-180-pre.txt`): HEAD `47650745`, status vacío, `jest procs: 1`. Tras `init.sh`, HEAD sigue en `47650745` y `git status --short` devuelve una sola línea, `?? progress/review_mobile-alert-detail-canvas-fidelity.md`, que es este informe. No hay ficheros del implementer sin commitear.

Bloqueantes: B1 (C4 en R13) y B2 (R2.3 incumplido en el código, sin anotar, sobre una spec que se contradice). Pendiente para aprobar: C2 (`progress/current.md` describe un estado anterior; lo actualiza el leader). El resto son observaciones no bloqueantes.

---

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress. En `feature_list.json` de HEAD, #180 es la única `in_progress`; `git diff --stat 30e36f12 HEAD -- feature_list.json` está vacío.
- [ ] `progress/current.md` actualizado. La línea 11 dice «Listo para relanzar Codex con el handoff: retoma en R8, solo LP. Antes: paro en R8 (B3, commit `3c099eaa`)». Describe el estado previo a Codex y no refleja HEAD (R1 a R13 hechos, R14 pendiente). Esta revisión no lo modifica: lo actualiza el leader.

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure. El rango no toca `backend-pet-tracker/` ni `infra/` (`git diff --stat 30e36f12 HEAD` sobre esas rutas: 0 líneas). Los cambios están en `mobile-pet-tracker/`, `docs/`, `specs/` y `progress/`.
- [x] Repositorios y contratos en domain son interfaces puras. Sin cambios en el rango.
- [x] Application depende de interfaces, no de implementaciones. Sin cambios de backend en el rango. La pantalla usa `api/`, hooks y providers ya existentes.
- [x] Infrastructure sin lógica de negocio. El rango no toca infrastructure.

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra. Ejemplos: `#180 R2.3:` (`mobile-pet-tracker/src/screens/alert-detail/index.test.tsx:973`), `#180 R3.1:` (`mobile-pet-tracker/src/utils/alert-meta.test.ts:15`), `registra cada ocurrencia del detalle (enmendado por #180 R13.1)` (`mobile-pet-tracker/src/__tests__/ui-language.test.ts:250`). R14 es prueba humana sin test, por diseño.
- [ ] Historial de commits muestra test-primero. Falla en R13: `74f0fa9d` es test-only y nace verde, sin commit rojo (B1). R2 a R12 tienen par rojo→verde en orden (ver tabla).
  - Punto 2 de CHECKPOINTS (L44–45): incumplido en R13.
  - Punto 3 (L46–54), requisitos de verificación: R13.1 asevera una propiedad que R1 ya dejó en el árbol. `requirements.md:417–419` no declara vía (a) ni vía (b); solo dice que «la sonda de mutación de `tasks.md` §«Sondas» los pone en rojo».
  - Punto 4 (L55–57), sin `ReferenceError`: las entradas de S14 y S15 del reporte (`progress/impl_mobile-alert-detail-canvas-fidelity.md` L387 y L395) no citan ningún `ReferenceError`. Los rojos no se han reproducido (ver verificación no reproducida).
  - Punto 5 (L58–62), candado sobre código ya correcto: incumplido en R13 (B1).

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas pendientes. La única aparición de «pendiente» es la regla del reviewer (`traceability.md:47`). R14 figura como «sin ejecutar» (humano, O8).
- [x] Cada requisito tiene test y commit registrados. R1 a R13 tienen commits; R14 no tiene commit por diseño. La fila R13 afirma «rojo bajo S15» sin commit rojo que lo respalde (B1).
- [ ] Commits siguen el formato `feat(<scope>): <desc> (R-ids)`. 24 de 26 commits llevan `#180 R<n>` en el asunto (`test(mobile): #180 R<n> rojo — …`, `feat(mobile): #180 R<n> …`, `style(mobile)`, `docs(mobile)`); `6f858012` y `47650745` (docs) no llevan R-id. Ningún asunto termina en `(R-ids)` (O1, no bloqueante).

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` (L4) y casilla humana marcada con fecha (L500, 2026-10-17).
- [x] Enmiendas firmadas: E1 (casilla L706, 2026-10-18), E2 (casilla L794, 2026-10-18) y E3 (casilla L816; la fecha escrita es 2026-10-17, ver O5). Las ediciones de specs del rango son las autorizadas (R12.1, R12.3, E3.2). Las desviaciones de la spec aprobada (R2.3 en B2; cifras M19 y M25 en O2) no tienen enmienda.

## Checklist C7 — Sin código huérfano
- [x] Componentes/módulos reemplazados eliminados. `surface` ya no existe en `mobile-pet-tracker/src/utils/alert-meta.ts`; `alert-meta.test.ts:15–16` asevera su ausencia. `alerts.detailTitle` salió de `_layout.tsx` en `e37300ec` (R1, anterior a H0); la clave sigue en uso en `index.tsx:164`.
- [x] Tests del código eliminado eliminados. No quedan tests que dependan de `surface`.
- [x] Sin usos residuales de `surface` en la meta de alerta: revisados los consumidores de `alert-meta` y ninguno lee el campo. La única aserción sobre él es `alert-meta.test.ts:16`, que asevera su ausencia.
- [ ] N/A: no aplica, porque esta feature sí sustituye `surface` y el título de `_layout`; la casilla queda sin marcar.

## Checklist C8 — UI móvil conforme a la carta
- [x] Sin hex, `StyleSheet`, shadow, elevation, Spinner ni ActivityIndicator en `index.tsx`, `ping-ring.tsx` y `alert-meta.ts`. `index.tsx` leído completo: sin clases arbitrarias `[...]`. Las guardas de design-drift del init están en verde en el log.
- [x] Dimensiones con safe areas: `useSafeAreaInsets` (`index.tsx:78`), `paddingTop: 24` y `paddingBottom: insets.bottom + 40` (`index.tsx:161`).
- [x] Carga con Skeleton dimensionado: `index.tsx:202` (`h-58 w-full rounded-hero`), sin Spinner.
- [x] Componentes compartidos reutilizados: `Card` hero (`index.tsx:18`, `:133`), `HomeEntrance`, `PetMap`. Riesgo de `text-17` en O7.

---

## Tabla R-id (rojo → verde)

| R | Rojo | Verde | Resultado |
|---|---|---|---|
| R1 | rojo `b07bc024` (según traceability), verde `e37300ec`; ambos ancestros de `30e36f12` | `e37300ec` | anterior al rango; el rojo no se ha re-verificado |
| R2 | `3ae25afc` | `e07b671c` | par correcto; B2 (R2.3) |
| R3 | `b9c7b918` | `a3d851d5` | par correcto |
| R4 | `b9e645f2` | `b897fef4` | par correcto |
| R5 | `878bf9bd` | `e11c0893` | par correcto |
| R6 | `00a609c6` | `d4a38dff` | par correcto; O4 (mock de navegación) |
| R7 | `cdd18c2d` | `e1a0cea0` | par correcto |
| R8 | `3785d0c3` | `a022a8b2` | par correcto; O6 |
| R9 | `cf07abb5` | `81aba5f6` | par correcto |
| R10 | `b5565332` | `c851eb1e` | par correcto |
| R11 | `66d9afc7` | `b17379e5` | par correcto |
| R12 | `4a85717e` | `643daf6d` (docs) | par correcto |
| R13 | ninguno | `74f0fa9d` (test verde al nacer); `4933ce00` (style posterior) | FALLA: B1 |
| R14 | n/a | n/a | humano: smoke en dev build de Android, sin ejecutar (O8) |

---

## Observaciones

### B1 — BLOQUEANTE: C4 incumplido en R13 (`74f0fa9d`)
- `74f0fa9d` (`test(mobile): #180 R13 candados agregados`) toca solo `mobile-pet-tracker/src/__tests__/ui-language.test.ts` (+2/−1). No hay ningún commit rojo de R13 en el rango; el único commit de test de R13 nace verde.
- El candado nuevo es `ui-language.test.ts:255`: `not.toContain('alerts.detailTitle')` sobre `src/app/_layout.tsx`. Aserta una propiedad que ya era cierta: `git show HEAD:mobile-pet-tracker/src/app/_layout.tsx` no contiene `alerts.detailTitle` (lo quitó `e37300ec`, R1, anterior a H0), y en el padre de `e37300ec` aparece en la línea 103. Es un candado sobre código ya correcto.
- CHECKPOINTS.md C4 punto 5 (L58–62) exige en ese caso que la mutación de producción se versione en el commit rojo y se revierta en el verde. No existe tal commit.
- La única evidencia de la mutación es el reporte del implementer: `progress/impl_mobile-alert-detail-canvas-fidelity.md` L389 («S15, primera pasada: LT rojo y UL/K2 verde con el título duplicado en layout (candado ciego)… Se repite S15 antes de continuar»), L395 («S15: ROJO … Ancla: src/app/_layout.tsx:103. Revertida.») y L462 («su nuevo candado falló con S15 plantada y pasó al revertirla»), además de `specs/mobile-alert-detail-canvas-fidelity/traceability.md:24` («rojo bajo S15 y verde al revertir»). El reporte admite que la primera pasada salió verde y no hay commit propio que recoja la corrección.
- `requirements.md` R13.1 (L417–419) cierra con «la sonda de mutación de `tasks.md` §«Sondas» los pone en rojo», sin declarar vía (a) ni vía (b) como exige C4 punto 3 (L46–54).
- Requerido, una de estas tres opciones: (1) un commit rojo de R13 con la mutación de S15 versionada y revertida en el verde (C4 punto 5), con la reordenación de la rama a cargo del leader; (2) excepción firmada por el humano más prueba de mutación (CHECKPOINTS C4, L64–66); (3) enmienda firmada que declare la vía (b) para R13.1, con la mutación reproducida en una pasada posterior, porque esta revisión no ha corrido jest por restricción de coordinación.

### B2 — BLOQUEANTE: R2.3 incumplido en el código, sin anotar, con la spec contradictoria
- Requisito: `requirements.md:163–165` (R2.3). El mapa va «solo con zona» y «Sin zona no hay mapa y el resto no cambia».
- Código: `index.tsx:90` calcula `position = alertPosition(alert.payload)`. `index.tsx:169` pinta el mapa si hay `position`, sin mirar la zona. Sin zona, `AlertDetailMap` pinta el `PetMap` sin círculo ni zoom (`index.tsx:55–56`). `mobile-pet-tracker/src/utils/alert-location.ts:3–11` (`alertPosition`) no comprueba zona y no cambia en el rango.
- El test #170 R11 (`index.test.tsx:670–680`, «sin geofenceId pinta el mapa sin zona») asevera ese mapa sin zona. R7.2 (`requirements.md:304–307`) dice que «los `it` de #100 R5 (~308), #134 R2 (~380), #170 R6 (~434) y R8–R14 no se tocan y siguen en verde». Entiendo que «R8–R14» remite a #170. E2.2 (`requirements.md:722–724`) declara «Lista cerrada» y su tabla (L726–740) no incluye #170 R11, aunque la regla de L724 reescribe las aserciones visuales que contradicen R2. La spec se contradice en este punto y nadie lo ha resuelto.
- El `it` de R2.3 (`index.test.tsx:973–981`) usa payload `{}` para «sin zona», es decir, sin posición. Por eso pasa aunque el código pinte el mapa sin zona.
- El reporte del implementer no menciona R2.3 ni el caso sin zona. `tasks.md:167` exige «Si algo difiere, anotar y razonar en `progress/impl_*.md`».
- Requerido: decisión del leader o del humano (enmienda firmada que resuelva R2.3 frente a E2.2 y #170 R11). Según la decisión, cambio de código y de test, y anotación en el reporte. Hasta entonces R2.3 no se cumple en el código.

### No bloqueantes
- **O1 (C5, formato).** 24 de 26 commits llevan `#180 R<n>` en el asunto; `6f858012` y `47650745` (docs) no. Ninguno usa el sufijo `(R-ids)` de la plantilla. Decide el leader.
- **O2 (M19 y M25).** El implementer deja M19 = 4 y M25 = 4, frente al objetivo 3 de la spec: M19 fija 3 en R12.2 (`requirements.md:398`, «M19: 2 → 3»); M25 fija 3 en E1.3 (`requirements.md:649`, base 1, +2). La justificación es el bloque canónico de R12.1 (`impl_*.md` L353), repetida en L488 (M19 = 4) y L494 (M25 = 4). No hay enmienda firmada que cubra la diferencia. Decide el leader.
- **O3 (`4933ce00`, style posterior a R13).** Separa las props del ack en líneas propias y toca `index.tsx` (producción) bajo R13. `impl_*.md` L462 dice que R13 «no necesita cambios de producto»; L429 dice que el cambio es solo de formato. Formato verificado: mismas props, mismo orden, misma clase. Confirmar que la base H0 y el delta de medidas no se movieron con el reformateo.
- **O4 (cambio fuera de la lista declarada).** `00a609c6` (commit rojo de R6) añade `Map: icon()` al mock de `reicon-react-native` en `mobile-pet-tracker/src/app/__tests__/alert-detail.navigation.test.tsx:81`. K17 (`requirements.md:465`) declara el `+ Map` solo para el mock de `index.test.tsx` (DT), que sí lo tiene (`Map: icon('Map')`, L99). El navigation test no figura en K1–K24 y es una de las suites que la spec lista como «no cambia, se re-ejecuta» (`requirements.md:469–474`), con una única contingencia: el doble de Animated. El reporte del implementer no menciona este cambio; su L74 habla solo de dobles de Reanimated. Parece necesario para que la suite monte el detalle; no comprobado sin jest. Decidir si basta con anotarlo.
- **O5 (fecha de E3).** La casilla de E3 (`requirements.md:816`) dice 2026-10-17; la firma en Notion es 2026-10-18T06:55:10Z según `progress/current.md` L9. E1 (L706) y E2 (L794) cuadran con 2026-10-18. Confirmar con el humano.
- **O6 (formato, `design.md`).** La fila `alerts.mapLabel` añadida en `specs/mobile-ui-language/design.md` (§2.35, L1044, commit `a022a8b2`) no termina en `|`, a diferencia de las demás filas. Cosmético.
- **O7 (`text-17`).** `index.tsx:197` usa `text-17 font-extrabold text-accent-foreground` en `Button.Label`, igual que R7.1 (`requirements.md:299`). La memoria del proyecto avisa de que twMerge puede expulsar `text-NN` ante una clase de color. Sin verificar. R14.1 debe cubrirlo.
- **O8 (R14, humano).** Smoke en dev build de Android sin ejecutar; casilla de §6 desmarcada. La feature no puede marcarse `done` antes. No es un defecto de código.
- **O9 (logs).** 8 líneas ERROR de Nest/Drizzle en el log (L66, L71, L100, L106, L112, L116, L58010, L58037). Ningún test falla (0 líneas `FAIL` de jest, 0 `not ok`). No atribuidas a un test concreto.
- **O10 (alcance de ficheros, informativo).** Autorizados por la spec: `docs/ui-guidelines.md` y las seis specs de la tabla R12.1 (`requirements.md:370–378`), incluida `specs/mobile-alert-detail-screen/requirements.md` (fila L373). `specs/mobile-ui-language/design.md` lo está por R12.3 (`requirements.md:401–403`, commit `643daf6d`) y por E3.2 (L808, commit `a022a8b2`). Del código mobile, `consistency-classnames.test.ts` y `design-drift.test.ts` están declarados (E1.4 K19 y K20; R7.4 y R7.5). La única suite de las declaradas «no cambia» que cambia es `alert-detail.navigation.test.tsx` (O4).
- **O11 (pre-check).** El pre-check registró `jest procs: 1` antes de `init.sh`. No identificado; puede ser el propio `pgrep`. `init.sh` terminó con `init_exit=0` y 0 líneas FAIL, así que no invalida el resultado.

---

## Verificación no reproducida
- jest, tsc y lint no se relanzaron (restricción de coordinación). Los resultados son los del log de `init.sh` del leader.
- Los rojos históricos de los commits de test no se han reproducido; se toman del registro del implementer.
- Sondas S1–S30 (`tasks.md:172–209`): no reproducidas. S14 y S15 constan en `impl_*.md` L387–395 solo como afirmación.
- Medidas M1–M25 y candados K: no re-medidos. Se han leído las tablas de E1.3 (`requirements.md:644–649`), K1–K18 (L447–466) y los candados de E1.4 (L664–674).
- Fidelidad visual frente al canvas: no comparada (sin capturas en el rango). Queda para R14.
- Expulsión de `text-17` por twMerge (O7): no verificada.
- `scratchpad/tsc.log` y `scratchpad/lint.log` (0 bytes): no usados como evidencia.

---

## Output de ./init.sh
```
init_exit=0   (línea 58271 de /tmp/claude-1002/-home-claude-sites-Pet-Tracker/c9d4cb29-412b-4a0b-96f6-89d863ff3133/scratchpad/init-180.log, 58271 líneas)
L220-221      backend: Test Suites: 187 passed, 187 total | Tests: 1474 passed, 1474 total
L233-234      infra:   Test Suites: 2 passed, 2 total | Tests: 14 passed, 14 total
L57918-57920  mobile:  Test Suites: 115 passed, 115 total | Tests: 3796 passed, 3796 total | Snapshots: 1 passed
L58240-58241  e2e:     Test Suites: 3 skipped, 30 passed, 30 of 33 total | Tests: 8 skipped, 468 passed, 476 total
L459, L508, L656 node: pass 28 / 5 / 15, fail 0 en los tres bloques
L58257 Lint sin errores | L58261 Typecheck sin errores | L58264 Todo verde
Recuento en el log: 0 líneas "FAIL " de jest, 0 "not ok"
Pre-check: HEAD 47650745 = HEAD de la revisión (verificado tras init.sh); status tras init.sh: solo ?? progress/review_mobile-alert-detail-canvas-fidelity.md, este informe
```
Que `init.sh` esté verde no cambia el veredicto: B1 y B2 son de contenido, no de ejecución.

---

## Veredicto final
RECHAZADO por B1 y B2. C2 también queda pendiente: `progress/current.md` lo actualiza el leader. Las observaciones O1 a O11 no cambian el veredicto; el leader decide sobre ellas.

Veredicto: RECHAZADO
