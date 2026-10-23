# review: mobile-canvas-foundations (#197)
Fecha: 2026-10-23
Veredicto: APROBADO

Hash revisado: `f408dbf2f0290e42372f61d650a5faa503465f6d`
(branch `feature/197-mobile-canvas-foundations`, worktree `Pet-Tracker-wt-197`,
diff `git diff origin/dev...HEAD`, 50 commits en `origin/dev..HEAD`).

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: #197 es la única)
- [x] progress/current.md en plantilla (la sesión vive en el worktree y en el plan de paridad)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure — N/A, la feature solo toca `mobile-pet-tracker/` (tema, componentes y pantallas)
- [x] repositories/contratos en domain son interfaces puras — N/A
- [x] application depende de interfaces, no de implementaciones — N/A
- [x] infrastructure sin lógica de negocio — N/A
- [x] Capas móviles respetadas: los tokens viven en `global.css`, los hooks de estilo en `src/theme/` (`chunky-lip.ts`, `shadows.ts`, `motion.ts`) y los componentes compartidos en `src/components/`. Las pantallas solo consumen.

## Checklist C4 — TDD
- [x] Cada R1–R22 y R24 tiene al menos un `it` que nombra `#197 R<n>` o un `it` enmendado con el sufijo `(enmendado por #197 R<n>)`. R23 es el smoke humano, sin test automático por diseño.
- [x] El historial muestra test primero. Cada R con producción tiene un commit `test(#197)` rojo y después su `feat(#197)`: R1, R3–R9, R11–R16, R18, R19, R21 y R24.
- [x] Requisitos de verificación (R2, R10, R17, R20, R22) declarados por escrito antes del handoff (`tasks.md` líneas 41, 101, 150, 186 y 198: «nace verde: anotarlo»). Se cierran por la vía (b), mutación. La evidencia está en `progress/impl_mobile-canvas-foundations.md`: R2 3 sondas, R10 11, R17 2, R20 4 y R22 10, todas rojas por aserción y revertidas. Las excepciones se ven en la observación no bloqueante 1.
- [x] Ningún rojo por `ReferenceError` de un helper de test. Los nuevos módulos (`shadows`, `toggle-switch`, `rise-in`) se cargan con `existsSync` y `requireActual`, así que el módulo ausente falla por aserción. Hay una excepción en R24, autorizada (observación no bloqueante 2).
- [x] Ningún rojo por mutar un doble de test.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene filas «pendiente» en R1–R22 ni en R24. R23 queda «pendiente» para el humano, como permite su propia regla.
- [x] Los 47 hashes citados existen en `origin/dev..HEAD` (`git merge-base --is-ancestor` contra HEAD sí, contra origin/dev no).
- [x] Los commits siguen `test(#197): … (R<n>)` y `feat(#197): … (R<n>)`.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla «Aprobado por humano (fecha: 2026-10-23)» marcada con firma delegada (plan §4).
- [x] Las enmiendas tras la aprobación pasaron por el gate. La enmienda R7 (`1e0d70cf`, «Enmienda mecánica permitida») y la Reanudación 2 (`b2f73327`: tres filas de `home-photo-hero-canvas` y R24) están firmadas en § Aprobación.

## Checklist C7 — Sin código huérfano
- [x] La feature no reemplaza ningún módulo. `HomeEntrance` deja de importar `MOTION_SETTLE_SPRING` y su fundido, pero esas constantes siguen exportadas y con otros consumidores; el inventario de `motion.test.ts` pasa de 35 a 37 claves sin bajas.
- [x] Las variantes de labio en `className` (`border-b-3/5/6`, `border-black/25`) se eliminaron de producción. Sus candados se enmendaron, no se dejaron.
- [x] N/A para borrado de tests: no se elimina ningún fichero.

## Checklist C8 — UI móvil (`docs/ui-guidelines.md`)
- [x] Grep-clean en los ficheros de producción tocados fuera de `src/theme/`: sin hex, sin `StyleSheet.create`, sin `shadow*`/`elevation`. Las clases con `[` que aparecen son índices de array, no clases arbitrarias. CF `#197 R22` lo bloquea en 11 ficheros.
- [x] Dimensiones y safe areas: el layout de pantallas no cambia, salvo los altos que fija R9 (`h-9`, `h-12.5`). `_layout.tsx` está intacto (diff vacío, `headerShown` ×2).
- [x] Estados de carga: no se tocan.
- [x] Componentes compartidos: los labios salen de `useChunkyLip()` y las sombras de `useShadows()`. `ToggleSwitch` y `ScreenHeader` son piezas compartidas nuevas, sin forks locales.
- [x] Tappables: `ToggleSwitch` reenvía los props uno a uno. Ack, chips y botones de Horario conservan `hitSlop` y su feedback.
- [x] Animaciones: `RiseIn` y `HomeEntrance` usan worklets de `entering` de Reanimated con `withDelay`/`withTiming` y `ReduceMotion.System`. Con reduce motion, `entering` queda indefinido. No hay `Color` ni var CSS en los estilos animados.
- [x] Enmienda de la carta: `docs/ui-guidelines.md` § «Enmienda #197» es el bloque canónico de `design.md`, con la línea D-H byte a byte intacta. Sigue sin marcar la casilla (observación no bloqueante 3).

## Verificación de código contra spec (resumen)
- R1/R5/R14 `global.css`: los valores claros cambian según R1. El tema oscuro solo gana tokens: cinco labios y seis sombras tras `--color-lip-gray`, en los dos temas.
- R3: seis tokens tras `--tracking-code`.
- R4: `tracking-tight` pasa a `tracking-title` en food, celebration, health y profile.
- R6: `useChunkyLip` tiene 11 claves y está memoizado sobre los 7 colores.
- R7: chips con `style={selected ? chunkyLip.primaryCompact : undefined}`.
- R8: el ack usa `neutralCompact` y ya no lleva `border-b-5`.
- R9: el resumen es `[CONTINUOUS_CORNER, chunkyLip.summary]`, Editar `h-9` + `neutralCompact` y Añadir `h-12.5` + `neutral`. «Generar plan» no se toca.
- R11: `MOTION_RISE_OFFSET_Y = 14` y `MOTION_RISE_TIMING` de 400 ms con `bezier(0,0,0.58,1)` y `ReduceMotion.System`.
- R12/R13: `HomeEntrance` con rise y escalonado; bajo reduce motion `entering` es `undefined`.
- R15: `useShadows` tiene 10 claves y está memoizado sobre 8 colores.
- R16/R17: `ToggleSwitch` mide `h-7 w-12`, pista `lipGray`/`accent`, pulgar `h-5.5 w-5.5` con `shadow-none` y `left: 3`.
- R18: `strokeWidth` opcional en BackButton.
- R19: `ScreenHeader` según la spec.
- R20: las piezas nuevas no se cablean.
- R22: `package.json` y `bun.lock` sin diff.
- R24: `RiseIn` con initialValues `{opacity 0, translateY 14}`.

## Observaciones

### Bloqueantes
Ninguna.

### No bloqueantes
1. **Dos filas de verificación sin sonda de mutación.** No hay sonda para la fila `_layout.tsx` de R20 ni para la fila `package.json`/`bun.lock` de R22: el handoff prohibía tocar esos ficheros. Las dos se sostienen por diff vacío contra `origin/dev` (verificado por el reviewer: `git diff --stat origin/dev...HEAD` sobre los tres ficheros sale vacío) y por los recuentos 44/8 y `headerShown` ×2. El impl report lo declara sin atribuirles sonda. Además, las sondas de los requisitos que nacen verdes se plantaron y revirtieron en local y no quedaron versionadas; la evidencia son los logs ignorados `progress/*-197.log`.
2. **El rojo de R24 (`3b96b769`) es parcialmente por import ausente.** La suite RI no carga porque falta el módulo de producción `rise-in.tsx`, no un helper de test. Lo autoriza la Reanudación 2. El caso nuevo de CF R22 sí falla por aserción (longitud 0). No es un `ReferenceError` de helper, así que no incumple C4 literalmente. Se anota para el registro.
3. **Casilla `- [ ] Enmienda #197 aprobada por humano` sin marcar en `docs/ui-guidelines.md:898`.** La spec la prescribe así (design.md:159) y el implementer no debe firmarla. La aprobación consta en `requirements.md` § Aprobación. Hay que marcarla al cierre, como se hizo con las de #195 y anteriores.
4. **El log de `init.sh` es anterior en unos 2 minutos al HEAD revisado.** El merge `f408dbf2` solo toca `progress/plan_canvas-parity-2026-10-23.md` (17+/4-), así que el resultado sigue valiendo para el código revisado.
5. **R23 (smoke humano en dev build Android, claro y oscuro) sigue pendiente.** No bloquea este veredicto. La feature no debe marcarse `done` hasta que el humano cierre la casilla «Smoke de R23».
6. Al final del log aparece el aviso de jest «worker force-exit». Viene de main y no es una regresión de #197.

## Output de ./init.sh
El reviewer **no** corrió `./init.sh`: el clasificador se lo deniega (lo corrió el leader). Este es el resumen de `progress/init-leader-197.log`, que termina en `exit=0`:

```
backend : 187/187 suites   Tests: 1474 passed, 1474 total
infra   : 2/2 suites       Tests: 14 passed, 14 total
mobile  : 142/142 suites   Tests: 4683 passed, 4683 total (1 snapshot)
e2e     : 30 passed, 3 skipped (33 suites)   Tests: 8 skipped, 468 passed, 476 total
lint OK · typecheck OK
✅ Todo verde. Listo para trabajar.
exit=0
```

El total móvil (4683) coincide con el que declara el impl report. No hay regresiones.
