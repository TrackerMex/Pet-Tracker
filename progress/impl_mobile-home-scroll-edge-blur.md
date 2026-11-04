# Implementación — #242 mobile-home-scroll-edge-blur

Resultado: implementación y verificaciones solicitadas completas. **D12
resolvió el bloqueo de tipos: tsc en 0, Home con las mismas 7 suites / 546
tests, lint en 0 con log vacío y mutación del spread detectada y restaurada.**
No cambiaron tests, node_modules ni los hashes anteriores. G2/G3 y el estado
de la feature siguen a cargo del humano/leader.

## Worktree, base y autoría

- Primer comando ejecutado: `cd /home/claude/sites/Pet-Tracker-wt-242 && pwd && git branch --show-current`.
- Salida comprobada: `/home/claude/sites/Pet-Tracker-wt-242` y `feature/242-mobile-home-scroll-edge-blur`.
- H0: `1c9e43741f030897b578d7c7226d7d80ca92ad46`. Los dos commits anteriores de registro y firma no cuentan como trabajo propio.
- Enmienda del leader: `155c8a02321fd313da05d2df8d6ac6258eeb7381`, solo requirements.md, tasks.md y design.md. Autoriza #202 R25 y el commit 2b; tampoco es trabajo propio.
- Alcance propio original: `155c8a02..e6301c85`, más commits 1 y 2; enmienda D12: `37a6267a..HEAD`. Se excluyen los dos commits del leader, `155c8a02` y `37a6267a`. Solo los seis ficheros móviles autorizados y traceability.md.
- Destino: `dev`. No se abrió ni editó PR; lo hace el leader.
- Skills cargadas: `building-native-ui`, `expo-dev-client`, `expo-module`, `ponytail` y `appllama-app-design-skill`. No se cargó `expo-overview`.
- Se leyeron arquitectura, convenciones, carta UI, verificación y specs. Se releyeron requirements/design/tasks tras la enmienda y §Esperas de conventions.md. Documentación versionada consultada: https://docs.expo.dev/versions/v57.0.0/.

## Qué cambió

`expo-backdrop` quedó fijada exactamente en 0.1.3, con bun.lock consistente.
Inicio conserva su ScrollView y contenido dentro de una raíz
`flex-1 bg-background`; después del scroll están los dos ProgressiveBlurView.
Cada uno recibe exclusivamente testID, edge, tint y style. pointerEvents none
va dentro de style. Las alturas siguen los insets y constantes de módulo
24/12/64; el tint sigue useUniwind, llamado antes del early return. La rama
sin mascotas permanece igual. No se añadió copy, i18n ni configuración nativa.

Se añadieron 13 it en total: 1 de R1 y 12 de pantalla. Se enmendaron dos
recuentos ya existentes (#197 R22 y #202 R25), sin añadir otro it por R1(e).

## Commits propios, en el orden autorizado

| Orden | Hash completo | Mensaje |
|---|---|---|
| 1 | `e3dd63c17e1983c0dc5fff7dbbee58169e4a3b4c` | `test(mobile): #242 pin expo-backdrop 0.1.3 and amend the dependency count (R1)` |
| 2 | `e42a223c5153a27570ee2f46341b611a7caaa1fe` | `chore(mobile): #242 add expo-backdrop 0.1.3 as a native dependency (R1)` |
| 2b | `4d8658e26df98b7fa3ac190244e03b003a935d7d` | `test(mobile): #242 amend the second dependency count lock (R1)` |
| 3 | `d184d16d7b8d6f03ce4d1e8ae408371eab1e39bd` | `test(mobile): #242 pin the edge blur overlays on Home (R2, R3, R4, R5, R6, R7, R8)` |
| 4 | `51df26c74f250f17ebe9492c80c26361c45a5b57` | `feat(mobile): #242 render progressive edge blur overlays on Home (R2, R3, R4, R5, R6)` |
| 5 | `e6301c85dbd682b8dbad11779ad7de1d351e6d0b` | `docs(specs): #242 fill traceability` |
| 6 | `83b0ade11a8acb17dafe162fcd542f17eacdb3d4` | `fix(mobile): #242 pass the overlay testID through a typed spread (D12)` |
| 7 | `b3e989a918f319224faec2981e7fd587eaff55da` | `docs(specs): #242 record D12 verification` |

Tests e implementación están en commits distintos. El commit final de docs
solo cambia traceability.md, después del último verde de Jest. Sin rebase.
El gate de tipos inicial y su resolución D12 se declaran en la trazabilidad. Los hashes anteriores se conservaron; no se reescribió el historial.

## T0, rojo/verde y T1

| Medición | Home | Guards | Total |
|---|---|---|---|
| T0, antes de editar | 7 suites / 534 tests | 43 suites / 1059 tests | **50 suites / 1593 tests** |
| T1, después de todas las restauraciones | 7 suites / 546 tests | 43 suites / 1060 tests | **50 suites / 1606 tests** |

Incremento exacto: **13 it**, mismas 50 suites. R1(e) no suma otro it.

- T0 completo: `progress/242-t0-home.log` (152.274 s) y `progress/242-t0-guards.log` (10.607 s), ambos exit 0. Todas las anclas «Hoy» se comprobaron antes de editar (`242-baseline-anchors.log`), dependencias 43/8, paquete ausente de node_modules y bun.lock.
- R1 rojo antes de instalar: 2 rojos / 64 verdes, `progress/242-r1-red.log`.
- Instalación prescrita con `bunx expo install expo-backdrop@0.1.3`; pin ya exacto, sin editar rangos. `bun install --frozen-lockfile` exit 0. Logs `242-install.log`, `242-frozen-install.log`.
- Tras el commit 2: Home 7 suites / 534 tests verdes (`242-after-dependency-home.log`); guards 42 suites verdes / 1 roja, 1059 tests verdes / 1 rojo (`242-after-dependency-guards.log`). El candado omitido #202 R25 esperaba 43 frente a 44; repetición aislada confirmó 19 verdes / 1 rojo (`242-after-dependency-zones-rerun.log`). Se paró antes de tocar un fichero fuera del alcance original.
- La enmienda autorizada `155c8a02` permitió 2b. Nuevo rojo previo: 1/20 (`242-2b-red.log`); verde después: 43 suites / 1060 tests (`242-2b-green.log`).
- R2–R6: el primer rojo de pantalla dio exactamente 10 rojos / 536 verdes (`242-overlays-red.log`). R7 y R8 nacieron verdes, declarado en la spec.
- Tras ajustar la lectura del renderer, se repitió el rojo sin implementación con los 12 tests de #242 seleccionados: 10 rojos, R7/R8 verdes, 534 tests previos no seleccionados (`242-overlays-red-raw-props.log`, 18.229 s). Se corrigió el commit de tests aún no publicado antes del de producción.
- Verde completo antes de registrar 4: Home 7 suites / 546 tests (`242-overlays-green-raw-props.log`, 52.01 s); guards 43 / 1060 (`242-after-overlays-guards.log`, 8.924 s).
- **T1 final**: `progress/242-t1-home.log` (57.067 s) y `progress/242-t1-guards.log` (17.243 s), ambos exit 0.
- Siempre una Jest pesada a la vez, por prefijos sin paréntesis. Se respetó la pausa de carga solicitada por el leader. No hubo timeouts ni SIGKILL; no se incrementaron tiempos ni se usaron flags de ejecución para ocultar carga.

## Adaptación de lectura de R2

El View del preset de RN añade children sintéticamente. La primera medición
con implementación produjo 3 rojos de claves, 543 verdes:
`progress/242-after-overlays-home.log`. Probar parent tampoco servía: RNTL 14
expone hosts y parent es el contenedor. Ese intento dio otros 3 rojos
(`242-overlays-green-corrected-reader.log`); su rojo previo sin implementación
está en `242-overlays-red-corrected-reader.log`.

La lectura definitiva registra las props recibidas dentro del doble y aserta
sus cuatro claves exactas para cada overlay **después de esperar al árbol**.
No se espera a contadores de mocks, no se filtran claves y no se cambia lo que
renderiza el doble: React.createElement(View, props), con todas las props y
sin virtual. Los esperados siguen escritos a mano, sin constantes de producción.

La corrección se incorporó al commit 3 no publicado mediante amend, antes de
registrar producción: `8410feab` → `ef07fa34` → `d184d16d`. Se guardó la
implementación fuera del repo y se restauró index.tsx para medir de nuevo el
rojo antes del amend definitivo. No hubo un commit extra de tests, rebase ni
tests e implementación mezclados. Todos los logs completos se conservaron.

## Mutaciones

**39 variantes únicas verificadas:** 6 de R1, 32 originales de pantalla/guards y 1 del spread D12. Todas
fallaron por su candado y se restauraron con `git checkout HEAD -- <ruta>`,
comprobando `git diff --cached --exit-code` en 0 antes y después y diff de la
ruta en 0 al restaurar. Ningún hueco de candado exigió añadir tests.

Logs completos por caso: `progress/242-mutation-<id>.log`; para pantalla,
también `progress/242-mutation-<id>.json.log`. Resúmenes:
`progress/242-mutations-summary.log` y `progress/242-screen-mutations-summary.log`.

| Caso R1 | Mutación | Resultado |
|---|---|---|
| R1a-tilde | ~0.1.3 | 1 rojo |
| R1a-caret | ^0.1.3 | 1 rojo |
| R1b | Mover a devDependencies | 2 rojos |
| R1c | Añadir expo-linear-gradient | 2 rojos |
| R1d | Quitar sufijo de enmienda de #197 | Ancla 0 frente al 1 requerido |
| R1e | Devolver cifra de #202 a 42 + 1 | 1 rojo / 19 verdes |

**Excepciones de fichero de test mutado**, prescritas: R1d en
`src/__tests__/canvas-foundations.test.ts` y R1e en
`src/__tests__/zones-canvas-fidelity.test.ts`. Las demás mutaciones fueron de
package.json o de home/index.tsx.

Resultados de pantalla, extraídos del resumen real del runner:

| Caso | Rojos por aserción | Restauración |
|---|---|---|
| R2a | 3 | checkout HEAD; staged 0 |
| R2b | 3 | checkout HEAD; staged 0 |
| R2c-top | 3 | checkout HEAD; staged 0 |
| R2c-bottom | 3 | checkout HEAD; staged 0 |
| R2d | 2 | checkout HEAD; staged 0 |
| R3a | 2 | checkout HEAD; staged 0 |
| R3b-no-height | 2 | checkout HEAD; staged 0 |
| R3b-no-gap | 2 | checkout HEAD; staged 0 |
| R3c | 1 | checkout HEAD; staged 0 |
| R3d | 1 | checkout HEAD; staged 0 |
| R4a | 1 | checkout HEAD; staged 0 |
| R4b | 1 | checkout HEAD; staged 0 |
| R4c | 2 | checkout HEAD; staged 0 |
| R4d | 2 | checkout HEAD; staged 0 |
| R5a | 1 | checkout HEAD; staged 0 |
| R5b | 1 | checkout HEAD; staged 0 |
| R5c | 1 | checkout HEAD; staged 0 |
| R5d | 1 | checkout HEAD; staged 0 |
| R6a | 1 | checkout HEAD; staged 0 |
| R6b | 1 | checkout HEAD; staged 0 |
| R6c | 1 | checkout HEAD; staged 0 |
| R6d | 2 | checkout HEAD; staged 0 |
| R7a | 1 | checkout HEAD; staged 0 |
| R7c | 1 | checkout HEAD; staged 0 |
| R7b | 1 | checkout HEAD; staged 0 |
| R8a | 1 | checkout HEAD; staged 0 |
| R8b | 1 | checkout HEAD; staged 0 |
| R8c | 1 | checkout HEAD; staged 0 |
| R8d | 1 | checkout HEAD; staged 0 |
| R9a | 1 | checkout HEAD; staged 0 |
| R9b | 1 | checkout HEAD; staged 0 |
| R9c | 2 | checkout HEAD; staged 0 |
| D12-spread | 3 | checkout HEAD; staged 0; control restaurado 3 verdes |

Qué se plantó en cada grupo:

- R2: quitar inferior (a), edge superior en ambos (b), intensity extra en cada overlay por separado (c-top/c-bottom), y solo montar con contenido (d).
- R3: quitar cola superior (a), quitar alto o separación inferior (b-no-height/b-no-gap), cruzar insets top/bottom (c), y top igual a insets.top (d).
- R4: quitar pointerEvents superior (a), inferior (b), pasarlo como prop fuera de style en ambos (c), y usar box-none (d).
- R5: overlays antes del scroll (a), dentro del scroll (b), raíz sin bg-background (c), y fragmento en vez de raíz (d).
- R6: tint fijo claro (a), fijo oscuro (b), tema solo en superior (c), y condición invertida (d).
- R7: ambos overlays en vacío (a), raíz común envolviendo también vacío (b), y solo inferior en vacío (c).
- R8: quitar fondo del scroll (a), cambiar padding inferior (b), añadir onScroll (c), y quitar inset automático (d).
- R9: t('profile.addPet') extra en overlay (a, ui-language rojo), comentario #242 sin R-id (b, design-drift rojo), y StyleSheet.create (c, design-drift y #195 R19 rojos).

Incidencias del runner, sin cambios de tests ni huecos de candado:

- El primer filtro R1 `#242 R1:` excluía el it de #197, cuyo sufijo termina en `#242 R1)`. R1b produjo un rojo válido en vez de los dos que esperaba el runner. Se corrigió a `#242 R1` y se repitió R1 completa, con 1/1/2/2 rojos y el ancla 0. Logs originales: `242-mutation-R1b-first-filter.log`, `242-mutation-R1b-first-filter.json.log`, `242-mutations-r1-first-run.log`.
- Tras 22 variantes R2–R6, el ancla de R7a también coincidía con EmptyState de error. El runner paró antes de escribir la mutación; staged y fuente estaban limpios. Se acotó a testID home-empty y se reanudaron solo R7–R9. Log íntegro original `242-screen-mutations-run.log`; reanudación `242-screen-mutations-resume-run.log`. El resumen final contiene 32 variantes de pantalla, todas restauradas.

## Tipos y lint: bloqueo inicial resuelto por D12

Antes de tsc se ejecutó **`test ! -e .expo/types/router.d.ts`**, que pasó.
No se borró ese fichero ni ningún artefacto del router.

En la medición inicial anterior a D12, `bunx tsc --noEmit` salió en **2** con exactamente dos TS2322:

- `src/screens/home/index.tsx(1002,9)`: testID no existe en IProgressiveBlurViewProps (overlay superior).
- `src/screens/home/index.tsx(1015,9)`: mismo error en el inferior.

Log completo: `progress/242-tsc.log`, copia de `/tmp/tsc-242.log`.
El paquete instalado declara IBlurSurfaceProps solo con style y children,
sin ViewProps ni testID. No se usaron @ts-ignore, declare module, casts para
ocultarlo ni modificaciones de node_modules; tampoco se eliminó una prop
obligatoria de la spec ni se cambió la versión exacta autorizada.

El leader autorizó la solución D12 en `37a6267a`. El commit 6 la implementa y
las medidas finales que siguen demuestran tsc en 0, manteniendo los props de
ejecución y los tests originales. El bloqueo está resuelto; la trazabilidad
conserva la evidencia previa y añade la resolución sin cambiar hashes.

Lint se ejecutó exactamente como se pidió:
`bunx expo lint > /tmp/lint-242.log 2>&1 && test ! -s /tmp/lint-242.log`.
Exit **0**, log vacío; copia en `progress/242-lint.log`. No se repitieron
estos checks sin cambios que lo justificasen.

## Alcance y cierre de revisión

- Anclas del artefacto anterior a D12: todas pasaron en `progress/242-final-anchors.log`; dependencias 44/8, pin exacto, ambos sufijos de enmienda en 1, bare BlurView en 0. D12 sustituye los atributos JSX explícitos por los objetos autorizados; sus testID y las cuatro props de ejecución se verificaron de nuevo con R2.
- Diff de Home final desde H0 ignorando sangría: **37 líneas añadidas / 0 eliminadas** (35/0 antes de D12). El resto del diff de ese fichero es sangría al envolver el scroll.
- Alcance propio verificado automáticamente: seis ficheros móviles autorizados más traceability.md; los tres ficheros de specs de `155c8a02` pertenecen al leader. Evidencia `progress/242-scope.log`.
- Chequeo de árbol limpio acotado solicitado (mobile/docs/specs y staged completo) en **exit 0**; git diff --check en 0. Este impl permanece sin commit en progress/, fuera del chequeo. Logs ignorados por git.
- Se respetaron los únicos cambios permitidos en zones-canvas-fidelity: título y cifra/comentario de #202 R25. Nada en floating-tab-bar.tsx, src/app/, otra pantalla, i18n, docs/, STATUS.md, progress/current.md ni progress/history.md.
- No se cambiaron los status ni las casillas de requisitos, feature_list.json o G2/G3. G3 rebuild y G2 smoke Android siguen a cargo del humano; no se verificó comportamiento visual nativo.
- No se ejecutaron init.sh, fetch/merge/rebase, prebuild, EAS ni emuladores; no se crearon recursos AWS. Sin denegaciones de sandbox ni vías alternativas de instalación.
- Los avisos del instalador de configuración local preexistente se conservaron en su log; no se cambiaron variables ni configuración.
- Push previo al desbloqueo D12: publicado hasta `e6301c85dbd682b8dbad11779ad7de1d351e6d0b` (`progress/242-final-push.log`). Push final D12: **exit 0**, publicado hasta `b3e989a918f319224faec2981e7fd587eaff55da` (`progress/242-d12-push.log`). No se abrió ni editó PR.

## D12: resolución y medidas finales del commit 6

Se leyó requirements.md D12 y tasks.md 4b del commit del leader `37a6267a`.
El commit 6 solo modifica home/index.tsx: añade las constantes de módulo
TOP_EDGE_BLUR_PROPS y BOTTOM_EDGE_BLUR_PROPS con sus testID y esparce cada
objeto en su overlay. Sin as, @ts-ignore, declare module o cambios al paquete.
Diff del commit: 4 añadidas / 2 eliminadas. Los tests permanecen idénticos.

Se respetó la segunda pausa de carga (Backend en wt-241): se escribió y
registró código con autorización, pero no se lanzó ninguna medición pesada
hasta el aviso de fin de pausa. Después, una Jest pesada a la vez:

| Comprobación | Resultado | Log |
|---|---|---|
| Guard antes de tsc | test ! -e .expo/types/router.d.ts pasó; no se borró el fichero | Comando previo al tsc |
| bunx tsc --noEmit | **exit 0, log vacío** | progress/242-d12-tsc.log |
| bunx jest src/screens/home | **7 suites / 546 tests verdes**, 49.358 s | progress/242-d12-home.log |
| bunx expo lint con redirección y test ! -s | **exit 0, log vacío** | /tmp/lint-242-d12.log; progress/242-d12-lint.log |
| git diff --check | **exit 0** | Comprobación antes de commit y al cierre |
| Quitar spread superior | **3 rojos de R2** por home-edge-blur-top ausente, sin errores de ejecución; 8.016 s | progress/242-d12-mutation.log; 242-d12-mutation.json.log |
| Restaurar y repetir R2 | **3 verdes**, 6.611 s; staged y diff de ruta en 0 | progress/242-d12-restored-r2.log |

La mutación se revirtió con `git checkout HEAD -- src/screens/home/index.tsx`.
No se mutó ningún fichero de test por D12. La suite completa Home conservó
sus cifras; no hubo timeouts ni SIGKILL ni flags para alterar la carga.

El commit 7 añade la evidencia de D12 a traceability.md. Se comprobó de forma
automática que todos sus hashes anteriores permanecen presentes. No hubo
rebase ni amend de commits en esta enmienda.

Chequeo final acotado en 0; alcance propio, tests intactos, hashes conservados
y diff final de Home 37/0 documentados en `progress/242-d12-scope.log`.

Tras el push y el chequeo final de árbol limpio acotado, se crea
`progress/impl_mobile-home-scroll-edge-blur.done` como última acción con una
sola línea: la ruta absoluta de este impl. El marcador no se commitea.
