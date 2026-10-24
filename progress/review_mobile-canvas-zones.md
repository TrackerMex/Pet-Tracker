# review: mobile-canvas-zones (#202)
Fecha: 2026-10-24
Veredicto: APROBADO (0 bloqueantes, 6 no bloqueantes)

Base revisada: worktree `/home/claude/sites/Pet-Tracker-wt-202`, branch
`feature/202-mobile-canvas-zones`, HEAD `83599961` (verificado con git).
Diff neto: `git diff 329c613c HEAD`, donde `329c613c` es `origin/dev` y también el merge-base.
Merge de dev revisado: `d3c2b000`. HEAD `83599961` es un commit solo de docs encima de él.
Árbol de trabajo: solo los dos ficheros no rastreados de `progress/`: el handoff del leader y esta review.
El reviewer no editó código ni hizo commits. Las mutaciones se revirtieron con `git checkout --` y `git diff --stat` quedó vacío.

## Gate (./init.sh)

El reviewer no corrió `./init.sh`, por instrucción del leader: el clasificador se lo deniega.
La evidencia es el log del leader
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/init-202.log`.
Terminó a las 05:49 UTC, después del commit HEAD `83599961` (05:33), así que mide el HEAD revisado.

- Harness, build, lint y typecheck en verde.
- Backend 187/187 suites, 1474/1474 tests.
- Infra 2/2, 14/14.
- Móvil 146/146 suites, 4944/4944 tests, 1 snapshot.
- e2e 30 de 33 suites (3 skipped), 468 passed y 8 skipped.
- «Todo verde. Listo para trabajar.»
- 0 líneas `^FAIL`.
- El único aviso es el de worker force-exit, preexistente.

Flakes conocidos (Home #190 R5, tinte `#0D1117`): no se reprodujeron en el log.
Además, `git diff 329c613c HEAD` no toca ningún fichero de home ni de pingo-float (0 líneas), ni backend ni infra.

## Checklist C1 — Harness
- [x] N/A: no es la primera feature del proyecto.

## Checklist C2 — Estado coherente
- [x] Ninguna feature `in_progress`; #202 está en `spec_ready`. init.sh: «Sin features en progreso (sesión limpia)».
- [x] `progress/current.md` es la plantilla. `STATUS.md` está sincronizado con `feature_list.json`, según init.sh. El estado final (`done`) lo registra el leader.

## Checklist C3 — Arquitectura
- [x] La capa domain/infrastructure no aplica: el cambio es solo de la app móvil.
- [x] Capas móviles respetadas. `ConfirmDialog` vive en `src/components/confirm-dialog.tsx` y lo consumen las pantallas `src/screens/geofences/index.tsx` y `src/screens/geofence-editor/index.tsx`. Las rutas siguen delgadas.
- [x] Las pantallas no meten lógica de negocio nueva. El borrado sigue pasando por `deleteGeofence` dentro de `write`/`run`, como en dev.
- [x] Ningún contrato nuevo en domain.

## Checklist C4 — TDD
- [x] R1–R25 tienen al menos un `it` que nombra su R-id (`#202 Rn`):
  - CD (`src/components/__tests__/confirm-dialog.test.tsx`): R7, 5 `it` y 7 casos.
  - ZF (`src/__tests__/zones-canvas-fidelity.test.ts`): R2–R7, R10–R18, R20 y R25.
  - LY: R2.
  - GZ: R1, R3–R6, R8, R10, R11 y R21–R23.
  - GE: R4, R9, R12–R19 y R24.
- [x] El historial es test-primero: cada `test(#202): Rn …` precede a su `feat(#202): Rn …`, y los hashes coinciden con `traceability.md`. El reviewer reprodujo tres rojos en checkout aislado, los tres fallos de aserción y no ReferenceError ni import roto:
  - R8 `e3b327da`: 10 fallos.
  - R7 API `1842bba0`: 1 fallo.
  - R13 `b356fc13`: 12 fallos.
- [x] R21–R24 nacen verdes por conservación (`e30ee110`) y R25 por guarda (`1cf77769`). Así lo marca la spec («n/a»).
- [x] `fbea47b3` (retirar el doble de Stack) y `505bf6ab` (quitar un import sin uso) son limpiezas solo de test, posteriores al verde.
- [x] `71aac698` es una enmienda tardía de R9 al candado agregado chunky-cta `#177 R4.1`: el `onPress={confirmDelete}` pasa a `onPress={() => setDeleteVisible(true)}`. Entre `804f3ccd` y `71aac698` ese candado quedó rojo; está documentado en el reporte. No bloquea: hoy está verde, el delta es el que prescribe R9 y la regla de recuentos agregados de la errata `4c067d76` cubre ese caso. Ver la observación N6.

## Checklist C5 — Trazabilidad
- [x] R1–R25 tienen commits rojo y verde (o «n/a» justificado) en `specs/mobile-canvas-zones/traceability.md`.
- [x] La única fila «pendiente» es R26, el smoke humano en dev build Android. La spec la marca como cierre y no como gate de implementación: casilla de `requirements.md`, «(cierre, no gate de implementación)». No bloquea la implementación, pero el leader no debe marcar `done` hasta que el humano la cierre (CLAUDE.md, «requisitos que solo puede cerrar un humano»).
- [x] Los commits siguen `test(#202): Rn …` / `feat(#202): Rn …`, el formato aceptado en las features previas de la ola.
- [ ] Con salvedad, no bloqueante: la columna Estado (R1–R25) y el párrafo «Cierre de implementación» están caducados. Siguen diciendo «cierre global bloqueado por Home #190 R5» y 144 suites / 4747 casos, pero el gate sobre `83599961` está verde con 146/4944. Ver N4.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved`.
- [x] La casilla `[x] Aprobado por humano (fecha: 2026-10-23)` está marcada, con firma delegada en el leader por el mandato de `progress/plan_canvas-parity-2026-10-23.md` §4.
- [x] La casilla `[x]` de la enmienda de la carta (R20) está marcada, con el mismo mandato.
- [x] Tras la firma `af55f048`, la spec solo cambió con la errata `4c067d76` (R7.1 a `px-7` y la regla de recuentos agregados), firmada por delegación. El código cumple la errata: `px-7` en el root y `padding: 0 28px` en ZF R7.
- [x] La casilla del smoke R26 sigue `[ ]`. Es correcto: es el cierre humano.

## Checklist C7 — Sin código huérfano
- [x] `src/theme/header-layout.ts` está borrado, sin referencias a él ni a sus constantes. Lo bloquea ZF `#202 R2` con un recorrido de `src/`.
- [x] Los tests del módulo borrado también se fueron: GF `#189 R23` y el `describe('#197 R20: cimientos sin cablear')` de CF (5 tests).
- [x] Se borraron `#189 R22` y el helper `alertButton` de GE. Los recuentos retirados cuadran con el reporte: 5 CF, 4 GF y 11 GE.
- [ ] Con salvedad, no bloqueante: GZ conserva un helper reimplementado que se llama `alertButton`, pero ya no pulsa un `Alert` sino el diálogo. Además, un título de test dice «nativa». Son nombres caducados, no código muerto. Ver N6.

## Checklist C8 — Carta de UI (`docs/ui-guidelines.md`)
- [x] Grep-clean en los tres ficheros: sin `StyleSheet.create`, sin clases arbitrarias `x-[…]` y sin hex. Lo bloquea ZF `#202 R25` (`it.each`).
- [x] Ninguna dependencia nueva: `dependencies` sigue en 44 y no aparece `expo-linear-gradient` (ZF `#202 R25`).
- [x] Safe areas. La cabecera está en contenido (`ScreenHeader`) con `headerShown: false` en `_layout`. El editor usa `insets.top + 8` en la fila flotante y `insets.top + 12` en el ScrollView de estados.
- [x] Esqueletos con `Skeleton`: 5 en Zonas y 3 en el Editor, contados por ZF R10 y R18.
- [x] Componentes compartidos de #197: `ScreenHeader`, `ToggleSwitch`, `useShadows` (card, dialog y sheet), `RiseIn` y `BackButton strokeWidth={2.4}`. Ya no se importa `Switch` de heroui-native (ZF R4).
- [x] Animación con Reanimated: `FadeIn.duration(MOTION_TRANSITION_MS)` en el velo y `RiseIn` en la tarjeta. Las dos respetan `useReducedMotion` (CD «reduce motion…»).
- [x] Accesibilidad del diálogo: `role="alertdialog"`, título con rol header, acciones con `role="button"` y `min-h-12` (48 pt, ≥44). El velo lleva la etiqueta «Cancelar» y `onRequestClose` va a `onCancel`.
- [ ] Con salvedad, no bloqueante: los dos `Pressable` de acción de `ConfirmDialog` (`confirm-dialog.tsx`, líneas 38 y 41) no tienen respuesta visual al pulsar. La carta exige pressed feedback en todo táctil (línea 274). La receta literal de R7 lo omitía y el implementador la siguió al pie de la letra, por eso no bloquea. Ver N1.

## Verificación de R20 (enmienda de la carta)
- [x] Las filas de la tabla R20 están aplicadas en `docs/ui-guidelines.md` (líneas 132, 135, 137, 220 y 841–843) y en `docs/conventions.md` (línea 640, fila 1).
- [x] ZF `#202 R20` comprueba que «Cabecera nativa transparente (#189 E4)» y «bg-danger-soft`)» ya no están, y que «Cabecera en contenido (#202)» sí está. Las enmiendas de GF `#189 R16.1`, `R16.3`, `R24.1` y `R24.2` están en el commit rojo `11c28902`.
- [ ] Con salvedad, no bloqueante: quedan líneas de la carta caducadas que la tabla R20 no cubre. Ver N5.

## Merge `d3c2b000` (regla «dev + delta»)
Las 8 resoluciones de conflicto son correctas:

| Candado / fichero | Resolución verificada |
|---|---|
| chunky-cta, recuento | `26+1+1+1+2+2+1+1` = dev + delta de #202 |
| catálogo UL | `+ 2 // #198 R15 + 1 // #202 R10 + 1 // #202 R18` |
| profile `rounded-hero` | unión: confirm-dialog (#202) + food (dev) |
| `text-26` | salen los ficheros de geofences (#202 R1/R17), se queda home |
| layout test | se conservan los dos bloques (dev y #202) |
| `_layout.tsx` | geofences, geofence-editor y meals-history, los tres con `headerShown: false` |
| anclas `headerShown` | 6 = dev 4 + 2 |
| resto de inventarios | las cifras coinciden con la tabla de anclas de `tasks.md` |

## Anclas de la spec contra el árbol
- [x] Todas las anclas de `tasks.md` coinciden con HEAD si se re-miden por contenido: `headerShown` 6, `<Skeleton` 5/3, `h-13.5 rounded-16` 3, `style={shadows.card}` 2, `className="items-center px-4 py-6"` 3.

## Mutaciones del reviewer
Cada mutación se aplicó en el árbol y se corrió jest dirigido (`bunx jest --runTestsByPath … --runInBand`). Después se revirtió.

| # | Mutación | Zona | Resultado |
|---|---|---|---|
| M1 | `confirm-dialog.tsx`: `<RiseIn delayMs={0}>` a `delayMs={300}` | ciega (R7.3) | **SOBREVIVE**: 288/288 verdes (CD + ZF + GZ + GE). Hueco de candado, ver N2 |
| M2 | `geofences/index.tsx` `deleteConfirmed`: borra un id distinto de `deleteTarget.id` | R8 | cazada: 2 fallos en GZ |
| M3 | `geofence-editor/index.tsx` `deleteConfirmed`: no llama a `setDeleteVisible(false)` | R9 | cazada: 2 fallos en GE |
| M4 | `geofences/index.tsx`: clase del contador `text-sm font-extrabold text-muted` a otra | R1 | cazada: 3 fallos (GZ y ZF) |

Tres de cuatro cazadas. La superviviente cae en la zona ciega prevista, el retardo de la tarjeta. Ningún test lo mira:
- CD solo afirma `entering({}).initialValues`;
- ZF solo `contains(dialog, 'RiseIn')`.

## Observaciones

### Bloqueantes
Ninguna.

### No bloqueantes
1. **N1. Sin pressed feedback en el diálogo (C8).** Los `Pressable` de cancelar y confirmar de `mobile-pet-tracker/src/components/confirm-dialog.tsx` (líneas 38 y 41) no responden al pulsar. Eso incumple la línea 274 de `docs/ui-guidelines.md`. El origen está en la receta de R7, que no lo pedía, así que el implementador no se desvió de la spec.
   - Arreglo recomendado antes del smoke R26, o como id propio: `style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}`, el mismo patrón del botón de editar en `geofences/index.tsx`, más un candado en CD.
   - La papelera de Zonas tampoco tiene feedback, pero eso ya venía de dev y no lo introduce #202.
2. **N2. `delayMs={0}` del diálogo (R7.3) sin candado.** La mutación M1 sobrevive. Se cierra con un literal de fuente en ZF `#202 R7`, como el que ya tiene R13: `contains(dialog, '<RiseIn delayMs={0}>')`.
3. **N3. El título de R7 usa `accessibilityRole="header"` y la spec dice `role="header"`.** El cambio está justificado: `role="header"` da TS2769 en RN 0.86. Tiene su par rojo/verde (`1842bba0` → `1ca6234f`) y lo bloquea CD (`getByRole('header')`). Falta la errata que lo deje escrito en `specs/mobile-canvas-zones/requirements.md` R7.
4. **N4. `traceability.md` caducado.** La columna Estado de R1–R25 («cierre global bloqueado por Home #190 R5») y el párrafo de cierre (144/4747, 3 rojos) no reflejan el gate verde de `83599961` (146/4944). Hay que actualizarlos al cerrar.
5. **N5. Líneas de la carta caducadas fuera de la tabla R20.** En `docs/ui-guidelines.md`:
   - Las líneas 228 y 843 citan la receta deshabilitada `h-14 rounded-16 bg-default` («Guardar con nombre vacío»). Hoy es `h-13.5` (R15).
   - La línea 231 menciona el `Switch` de heroui, sustituido por `ToggleSwitch` (R4).

   Requieren una enmienda de carta con su propia firma humana. No se pueden arreglar por la vía mecánica.
6. **N6. Restos menores.**
   - `71aac698` dejó rojo el candado agregado chunky-cta `#177 R4.1` entre `804f3ccd` y `71aac698`. El inventario de la spec omitía ese candado; es un caso más de «candado de catálogo omitido en specs».
   - En GZ, el helper `alertButton` y el título de test con «nativa» quedan con nombres caducados tras R8.

## Output de ./init.sh
Extracto del log del leader (`init-202.log`), corrida sobre HEAD `83599961`:
```
✅ Sin features en progreso (sesión limpia)
✅ STATUS.md sincronizado con feature_list.json
✅ Build exitoso
Test Suites: 187 passed, 187 total          # backend
Tests:       1474 passed, 1474 total
Test Suites: 2 passed, 2 total              # infra
Tests:       14 passed, 14 total
Test Suites: 146 passed, 146 total          # mobile
Tests:       4944 passed, 4944 total
Snapshots:   1 passed, 1 total
✅ Tests pasados
✅ Esquema y recursos e2e listos
Test Suites: 3 skipped, 30 passed, 30 of 33 total   # e2e
Tests:       8 skipped, 468 passed, 476 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
`grep -c '^FAIL'` sobre el log: 0.

## Revisión del merge de dev (2026-10-24)

Veredicto: APROBADO sobre `9dcf2fb1` (0 bloqueantes, 0 observaciones nuevas)

Base: worktree `/home/claude/sites/Pet-Tracker-wt-202`. `git branch --show-current` da `feature/202-mobile-canvas-zones` y HEAD es `9dcf2fb1`.
- Commit aprobado: `83599961`. Entre él y el merge solo está `a7eedec0`, la errata de R7.4 (2 líneas en `specs/mobile-canvas-zones/requirements.md`).
- Merge `d5399a07`, con padres `a7eedec0` y `8bd88522` (`origin/dev`, PR #246, #199). Merge-base `329c613c`.
- `9dcf2fb1` solo añade 19 líneas a `progress/impl_mobile-canvas-zones.md`.

El reviewer no editó código ni hizo commits. Las cuatro mutaciones se revirtieron con `git checkout HEAD -- <fichero>`, y después de cada una `git diff --quiet` salió 0.

### 1. Conflictos: se conserva lo de dev y lo de la feature

Para cada fichero que tocan los dos lados se compararon las líneas cambiadas de dos pares de diffs:
- delta de la feature: `git diff 329c613c 83599961` frente a `git diff 8bd88522 9dcf2fb1`;
- delta de dev: `git diff 329c613c 8bd88522` frente a `git diff 83599961 9dcf2fb1`.

De los 11 ficheros compartidos, 7 tienen diferencia 0 en los dos pares: `consistency-classnames`, `profile-canvas-fidelity`, `ui-copy-table.ts`, `ui-language`, `app/__tests__/layout.test.tsx`, `app/_layout.tsx` y `catalog.ts`. Son uniones limpias.

Los 4 en conflicto solo difieren en las líneas que tienen que cambiar:

| Fichero | Diferencia | Recuento: base, dev, #202, fusión |
|---|---|---|
| `alerts-canvas-fidelity` | Título del `it.each`: etiquetas de #199 (R10, R14, R16) seguidas de las de #202 (R7, R1, R11, R17). Las filas de inventario son idénticas en los dos pares | `text-15`: 16, 18, 18, **20** = 18 + 2. `confirm-dialog` y `geofences` (#202 R11) entran en orden; se mantiene `health` (#199 R16). `tracking-title` pierde `geofence-editor` y `geofences` (#202) |
| `chunky-cta-canvas-fidelity` | Título de R7.3 y la expresión del total | `rounded-16`: 34, 35, 35, **36** = 35 + 1, escrito `26 + 1 + 1 + 1 + 2 + 2 + 1 + 1 + 1`. El mapa `radii` tiene `geofence-editor` 4 (#202 R18) y `health` 1 (#199 R14) |
| `design-drift` | Solo el título de «reserva los radios 14, 16 y 22» | El mapa `rounded16` (`geofence-editor` 4, `health` 1) y la lista `rounded-14` (más `health`, #199 R18) se fusionaron solos. No hay cifra literal |
| `language-provider` | Solo el título de `#194 R1`. La suma ya era aditiva y se fusiona línea a línea | Claves por idioma: 445, 452, 447, **454** = 452 + 2, con `+ 1 // #202 R10` y `+ 1, // #202 R18` debajo de los términos de #199 y #198 R15 |

Los cuatro recuentos agregados cumplen la regla dev + delta. Las mutaciones M2 y M3 los confirman contra el árbol real: devuelven 36 y 454.

### 2. Fuera de los conflictos no cambia código de la feature

- Hay 9 ficheros móviles que solo toca #202, incluido el borrado `theme/header-layout.ts`. Para los 9, `git diff 83599961 9dcf2fb1` da 0 líneas.
- Hay 14 ficheros móviles que solo toca dev (#199). Para los 14, `git diff 8bd88522 9dcf2fb1` da 0 líneas.
- Ningún fichero de `git diff --name-only 83599961 9dcf2fb1 -- mobile-pet-tracker` queda fuera del delta de dev. A la inversa, ningún fichero de `8bd88522..9dcf2fb1` queda fuera del delta de #202.
- Fuera de `mobile-pet-tracker/`, lo único que no viene de dev es `progress/impl_mobile-canvas-zones.md` (`9dcf2fb1`) y `specs/mobile-canvas-zones/requirements.md` (`a7eedec0`). El merge no toca backend ni infra respecto del commit aprobado.
- `git grep` no encuentra marcadores de conflicto en `mobile-pet-tracker/src`, `docs`, `specs` ni `feature_list.json`.
- `feature_list.json` deja #199 en `done` y #202 en `spec_ready`.

### 3. Jest dirigido

No había ningún `init.sh` corriendo (`pgrep -af '[i]nit.sh'` salió vacío) y el load average era 1.9. `test ! -e .expo/types/router.d.ts` se cumple.

Comando, desde `mobile-pet-tracker/`: `bunx jest --runTestsByPath` sobre los 4 ficheros en conflicto, con `--runInBand --testTimeout=30000`. Resultado: exit 0, 4/4 suites y 273/273 tests.

### 4. Mutaciones en la zona fusionada

Cada mutación se probó sola y se revirtió antes de la siguiente:

| # | Mutación | Resultado |
|---|---|---|
| M1 | `design-drift`: `'screens/geofence-editor/index.tsx': 4` pasa a `3` | **ROJO**: «reserva los radios 14, 16 y 22…» falla por `toEqual` (Expected −1 / Received +1) |
| M2 | `chunky-cta`: se quita el `+ 1` de #202 R18 del total | **ROJO**: `#177 R7.3` falla, Expected 35 / Received 36 |
| M3 | `language-provider`: `+ 1, // #202 R18` pasa a `+ 0,` | **ROJO**: `#194 R1` falla, Expected length 453 / Received length 454 |
| M4 | `alerts`: se borra la fila `'screens/geofences/index.tsx', // #202 R11` de `text-15` | **ROJO**: «limita text-15 a su inventario…» falla |

### 5. Gate

El reviewer no corrió `./init.sh`, por instrucción del leader. La evidencia es el log del leader
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/init-202b.log`.
Se escribió por última vez a las 06:51:53 UTC, después del commit `9dcf2fb1` (06:44:10), así que mide el HEAD revisado.
- Backend: 187/187 suites, 1474/1474 tests.
- Infra: 2/2 suites, 14/14 tests.
- Móvil: 148/148 suites, 5084/5084 tests.
- e2e: 30 de 33 suites (3 skipped), 468 passed y 8 skipped.
- Termina con «Todo verde. Listo para trabajar.».
- `grep -c '^FAIL'` sobre el log: 0.
