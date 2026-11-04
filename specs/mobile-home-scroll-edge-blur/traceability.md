---
feature: "mobile-home-scroll-edge-blur"
status: approved      # draft | spec_ready | approved
tags: [mobile, home, ui, spike, native, spec]
---

# Trazabilidad — [[mobile-home-scroll-edge-blur]] (#242)

Tests de pantalla en `mobile-pet-tracker/src/screens/home/index.test.tsx`;
R1 en `src/__tests__/canvas-foundations.test.ts` y, por la enmienda autorizada
`155c8a02` del leader, en `src/__tests__/zones-canvas-fidelity.test.ts`.
Los hashes completos y sus mensajes se desarrollan debajo de la tabla.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `canvas-foundations.test.ts::#242 R1: expo-backdrop queda fijada exacta en 0.1.3`; `canvas-foundations.test.ts::#197 R22: no añade dependencias (enmendado por #217 R8) (enmendado por #214 R23) (enmendado por #242 R1)`; `zones-canvas-fidelity.test.ts::#202 R25: package.json no añade dependencias (enmendado por #217 R8) (enmendado por #214 R23) (enmendado por #242 R1)` | `e3dd63c1` test del pin y recuento; `e42a223c` dependencia nativa; `4d8658e2` segundo candado (mensajes íntegros abajo) |
| R2 | `index.test.tsx::#242 R2: el estado contenido pinta ambos bordes`; `…el estado carga pinta ambos bordes`; `…el estado error pinta ambos bordes` | `d184d16d` tests de overlays; `51df26c7` implementación |
| R3 | `index.test.tsx::#242 R3: con insets {"top":47,"bottom":31} las alturas son 71 y 131`; `…con insets {"top":0,"bottom":0} las alturas son 24 y 100` | `d184d16d` tests de overlays; `51df26c7` implementación |
| R4 | `index.test.tsx::#242 R4: home-edge-blur-top lleva pointerEvents none en style`; `…home-edge-blur-bottom lleva pointerEvents none en style` | `d184d16d` tests de overlays; `51df26c7` implementación |
| R5 | `index.test.tsx::#242 R5: la raíz contiene scroll, borde superior y borde inferior en ese orden` | `d184d16d` tests de overlays; `51df26c7` implementación |
| R6 | `index.test.tsx::#242 R6: con tema light el tint es systemThinMaterialLight`; `…con tema dark el tint es systemThinMaterialDark` | `d184d16d` tests de overlays; `51df26c7` implementación |
| R7 | `index.test.tsx::#242 R7: la pantalla vacía no pinta overlays ni raíz del blur` | `d184d16d` candado de ausencia nacido verde; `51df26c7` verificado por mutaciones R7a–c |
| R8 | `index.test.tsx::#242 R8: conserva clase, inset automático y relleno inferior` | `d184d16d` candado de conservación nacido verde; `51df26c7` verificado por mutaciones R8a–d |
| R9 | Anclas de requirements.md §Evidencia, alcance propio por diff y guards de `tasks.md` §R9; T1 de ambos prefijos y mutaciones R9a–c | `51df26c7` artefacto verificado, junto con los commits R1 y `d184d16d`; gate de tipos rojo, descrito abajo |

## Commits test-primero

1. `e3dd63c17e1983c0dc5fff7dbbee58169e4a3b4c` — `test(mobile): #242 pin expo-backdrop 0.1.3 and amend the dependency count (R1)`.
2. `e42a223c5153a27570ee2f46341b611a7caaa1fe` — `chore(mobile): #242 add expo-backdrop 0.1.3 as a native dependency (R1)`.
2b. `4d8658e26df98b7fa3ac190244e03b003a935d7d` — `test(mobile): #242 amend the second dependency count lock (R1)`.
3. `d184d16d7b8d6f03ce4d1e8ae408371eab1e39bd` — `test(mobile): #242 pin the edge blur overlays on Home (R2, R3, R4, R5, R6, R7, R8)`.
4. `51df26c74f250f17ebe9492c80c26361c45a5b57` — `feat(mobile): #242 render progressive edge blur overlays on Home (R2, R3, R4, R5, R6)`.
5. Este documento se registra tras el último verde de Jest en `docs(specs): #242 fill traceability`; su hash se consigna en `progress/impl_mobile-home-scroll-edge-blur.md`, sin rebase posterior.

`155c8a02321fd313da05d2df8d6ac6258eeb7381` es la enmienda de requirements,
tasks y design realizada por el leader entre 2 y 2b. No es trabajo del
implementer. H0 es `1c9e43741f030897b578d7c7226d7d80ca92ad46`; registro y
firma anteriores tampoco cuentan como trabajo propio.

## Evidencia

| Medición | Home | Guards | Total |
|---|---|---|---|
| T0, antes de editar | 7 suites / 534 tests | 43 suites / 1059 tests | 50 suites / 1593 tests |
| T1, tras restaurar todas las mutaciones | 7 suites / 546 tests | 43 suites / 1060 tests | 50 suites / 1606 tests |

Incremento exacto: **13 tests**. R1(e) enmienda un it existente y no suma otro.
T1 en `progress/242-t1-home.log` (57.067 s) y
`progress/242-t1-guards.log` (17.243 s), ambos exit 0. Las mediciones y
mutaciones se ejecutaron una Jest pesada a la vez, respetando la pausa de
carga solicitada por el leader.

- R1: primer rojo 2 tests; dependencia exacta y frozen install en 0. El candado omitido #202 R25 dio 1 rojo aislado, quedó verde en 2b y su mutación R1(e) volvió a dar 1 rojo.
- R2–R6: rojo de 10 tests antes de implementar. En el commit 3 definitivo se repitió seleccionando los 12 tests de #242: 10 rojos y R7/R8 verdes, con 534 tests previos no seleccionados. El verde completo posterior pasó los 546 tests de Home.
- Lectura R2: el View nativo de Jest añade children y RNTL 14 expone solo hosts. El doble registra las props recibidas; las claves exactas se comprueban tras esperar al árbol, sin esperar a contadores de mocks, filtrar claves ni modificar las props que renderiza el doble. Los intentos anteriores y la corrección están documentados con logs íntegros en el impl. El commit de tests aún no publicado se corrigió antes de registrar el de producción; no hubo un commit extra ni rebase.
- **38 variantes de mutación detectadas y restauradas**: 6 de R1 (incluye ambas variantes de rango y R1e), 5 de R2, 5 de R3, 4 de R4, 4 de R5, 4 de R6, 3 de R7, 4 de R8 y 3 de R9. Resúmenes `progress/242-mutations-summary.log` y `progress/242-screen-mutations-summary.log`, con logs completos por caso. Cada mutación se restauró con `git checkout HEAD -- <ruta>` y staged en 0.
- Únicas excepciones de test mutado, prescritas: R1d en canvas-foundations.test.ts y R1e en zones-canvas-fidelity.test.ts.
- Anclas finales en `progress/242-final-anchors.log`: todas pasan; dependencies/devDependencies 44/8, ambos sufijos de enmienda en 1, bare BlurView en 0. Diff de index.tsx desde H0 ignorando sangría: **35 añadidas / 0 eliminadas**.
- Alcance propio: diff desde `155c8a02`, más los commits 1 y 2. Solo los seis ficheros autorizados de móvil y esta trazabilidad; los tres ficheros de specs de `155c8a02` son del leader.
- Lint exacto de tasks.md: exit 0 y log vacío (`progress/242-lint.log`, copia de `/tmp/lint-242.log`).

## Gate de tipos incumplido

`test ! -e .expo/types/router.d.ts` pasó antes de ejecutar
`bunx tsc --noEmit`. **tsc salió en 2**, con dos TS2322 en index.tsx:
`testID` no existe en `IProgressiveBlurViewProps` de expo-backdrop 0.1.3.
`IBlurSurfaceProps` solo declara style y children, sin heredar ViewProps.
Log entero: `progress/242-tsc.log` y `/tmp/tsc-242.log`.

No se usaron supresiones, casts para ocultar el error, declare module ni
cambios al paquete instalado. La implementación y la verificación Jest son
revisables, pero el cierre está **bloqueado por tipos**. No se declara done
ni se crea el marcador `.done`. Resolver este conflicto entre el contrato de
la spec y los tipos publicados requiere una decisión del leader/humano.

G3 (rebuild) y G2 (smoke Android) siguen sin ejecutar, a cargo del humano en
[[requirements]] §Aprobación. No se tocó ninguna casilla ni campo status.
No se ejecutaron init.sh, fetch/merge/rebase, prebuild, EAS ni emuladores.
