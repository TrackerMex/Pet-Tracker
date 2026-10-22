# Implementación de mobile-geofences-canvas-fidelity (#189)

Estado: CIERRE TÉCNICO COMPLETO sobre H0 de reanudación `162f151b`. E3 aplicada en `75c6bb6f`; R18 restaurado en `cd26b658`; 131 suites, 4398 tests y 1 snapshot verdes. Typecheck, lint sin caché y graphify exit 0. Trazabilidad R1-R18 completa. Los bloqueos anteriores se conservan abajo como historial; smoke Android y revisión corresponden al humano/leader.

## Identidad y alcance

- Ruta confirmada: `/home/claude/sites/Pet-Tracker-wt-189`.
- Branch confirmada: `feature/189-mobile-geofences-canvas-fidelity`.
- H0 fijo: `4204530efaea6adaf98a27c34391468e4e788654`.
- No se repite el merge de origin/main: el leader ya lo hizo.
- En la tercera reanudación se omiten `./init.sh`, PR, push y bookkeeping del leader por instrucción expresa del handoff. El init accidental de la segunda reanudación se documenta en su sección de desviación.
- Primer comando efectivo: `pwd && git status --short && git branch --show-current`, equivalente de identificación con consulta adicional de estado; mostró ruta/branch esperadas y solo el handoff sin seguimiento.

## Skills y documentación

Cargadas: `ponytail`, `appllama-app-design-skill`, `animate-expo`, `building-native-ui`, `expo-tailwind-setup`. Las dos últimas se localizaron en el cache del plugin Expo. No se buscan las skills inexistentes `expo:expo-overview`, `expo-overview`, `expo-animation`, `expo-router`, `expo-design-system`, según el handoff. Appllama MCP y simulator loop se sustituyen por spec y smoke Android humano como manda la carta. Se consultó https://docs.expo.dev/versions/v57.0.0/ por mobile-pet-tracker/AGENTS.md.

## Precondiciones, medidas y sondas H0

- P1-P10: todas 1.
- P11: imports existentes de Map, AlertCircle y Trash verificados; pendiente corroboración con typecheck. No se usa require CJS del paquete, según handoff.
- M1: 166 líneas (informativo).
- M2: imports de reicon 0 / 0 (Zonas / Editor).
- M3: category-palette 0.
- M4: HomeEntrance 0.
- M5: BlurView 0.
- M6: rounded-16 1 / 1.
- M7: chunkyLip 2 / 2.
- M8: R14_GEOFENCES 20; R15_GEOFENCE_EDITOR 27.
- M9: 2 títulos nativos traducidos.
- CONTINUOUS_CORNER directo: 0 / 0; global producción 38. Editor hoja usa estilo combinado después de R9: medir además por fuente/árbol.
- TABULAR_NUMS: 0 / 1.
- rounded-14: components/segmented-control; screens/meal-schedule (3), meals-history (1), pairing (1), reminders (1).
- rounded-tile: add-pet, add-reminder, home, pairing, profile (1 por fichero).
- rounded-hero: components/card, screens/profile, screens/alert-detail (1 por fichero).
- text-xs: Zonas 0 / Editor 1. Candado legibility no inventaría text-xs/text-11; medir tras los cambios.
- Anclas §4: geofence-editor-delete aparece una vez en excluded; CTA_ROWS conserva isDisabled y onPress; radii y rounded16 1 / 1; neutralInventory 9; títulos de layout actuales presentes; directUses aún no incluye estas pantallas.
- Sonda Uniwind Android: las seis clases `-mt-6.5`, `rounded-t-hero`, `h-1.25`, `h-12.5`, `flex-2`, `size-11` resuelven con compilador Tailwind y compileNativeCSS de Uniwind. Salida temporal en /tmp/geofences-189-compiled.txt, fuera del repo.
- Sonda Card twMerge: conserva rounded-card, border, border-border, bg-surface; resultado `rounded-card border border-border bg-surface p-4 flex-row items-center gap-3 px-3.5 py-3 shadow-none`.
- Selectores existentes /^geofence-geofence-\d$/ y /-delete$/ revisados: los nuevos sufijos entrance/tile no coinciden.

## Incidencias de invocación

- Primera sonda Uniwind invocó dist/common sin resolver alias internos @/: falló antes de compilar (`Cannot find module @/bundler/artifacts/css`). Corregida usando fuentes de Uniwind y tsconfig temporal en /tmp para resolver sus alias. Exit 0; Bun imprimió aviso interno de directory mismatch tras resolver las seis clases; twMerge también terminó correctamente. Ningún archivo de aplicación modificado.

## Tests y commits

- `8aee1c34 test(mobile): #189 R4 rojo — lock zone palette order (R4)` — `Tests: 2 failed, 12 passed, 14 total`. API de producción aún ausente, aserción de constante undefined y llamada no implementada.
- `4a3b7261 feat(mobile): #189 R4 assign zone colors by position (R4)` — `Tests: 14 passed, 14 total`.
- Sonda R4: intercambiar green/blue ⇒ `Tests: 2 failed, 12 passed, 14 total`, exit 1; fuente restaurada.


T0: `Tests: 4297 passed, 4297 total`; `Test Suites: 130 passed, 130 total`, exit 0. Home también verde; no se reproduce el fallo preexistente. Typecheck H0 exit 0 (guarda .expo/types/router.d.ts satisfecha). Catálogo base: 436 claves por idioma. P11 corroborada con typecheck.

## Trazabilidad R1-R18

| R | Test | Commit | Estado |
|---|---|---|---|
| R1 | screens/geofences/index.test.tsx::#189 R1; app/__tests__/layout.test.tsx | ea7fea7a | Verde; text-26 corregido por E1; cierre móvil 4398/4398 verde |
| R2 | screens/geofences/index.test.tsx::#189 R2 | c4feee5c | Verde local y comprobaciones posteriores |
| R3 | screens/geofences/index.test.tsx::#189 R3 | d1cff68a | Verde local y comprobaciones posteriores |
| R4 | utils/__tests__/category-palette.test.ts::#189 R4 | 4a3b7261 | Verde con mutación |
| R5 | screens/geofences/index.test.tsx::#189 R5 | ff2d303e; d89f3bac | Verde local y cuatro guardas; typecheck/lint corregidos verdes |
| R6 | screens/geofences/index.test.tsx::#189 R6 | 77bd89a2 (rojo); a3a97a60 (verde) | F 87/87; profile 26/26; consistency 74/74; typecheck/lint verdes |
| R7 | geofences/index.test.tsx::#189 R7; chunky; design-drift | a74f5566 rojo; 7d93a46d verde | F 94/94; guardas, mutación, tipos y lint verdes |
| R8 | geofence-editor/index.test.tsx::#189 R8; profile; alerts | 10afa5f0 rojo; 80d38dd4 verde | E 79/79; guardas, mutación, tipos y lint verdes |
| R9 | geofence-editor/index.test.tsx::#189 R9; consistency | 4edd48ad rojo; f9f42cbe verde | E 82/82; teclado, mutación, guardas, tipos y lint verdes |
| R10 | geofence-editor/index.test.tsx::#189 R10 y #146 R16 enmendado | fbf654fc rojo; f5ef4230 verde | E 84/84; tipos y lint verdes |
| R11 | geofence-editor/index.test.tsx::#189 R11; ui-language | f571ee79 rojo; f5997745 verde | E 87/87; mutación, guardas, tipos y lint verdes |
| R12 | geofence-editor/index.test.tsx::#189 R12; alerts | 7cb1a089 rojo; fb04857b verde | E 90/90; alerts 27/27; tipos y lint verdes |
| R13 | geofence-editor/index.test.tsx::#189 R13; chunky; consistency | 4fa40659 rojo; d2d3e78d verde | E 100/100; guardas, sondas E2, tipos y lint verdes |
| R14 | geofence-editor/index.test.tsx::#189 R14 | 7e97c547 rojo; e4dc03c3 verde | E 105/105; tipos y lint verdes |
| R15 | providers/__tests__/language-provider.test.tsx::#189 R15 | ce5f6298 | Catálogo 53/53; tablas de uso 22/31 verdes |
| R16 | geofences-canvas-fidelity.test.ts::#189 R16 | aaf229f9 rojo; 644472be verde | C 4/4; guardas, tipos y lint verdes |
| R17 | describes originales #41/#146/#155/#159 y sonda de rol | 44c1e6da rojo; de23d7e5 verde | F 94/94; E 105/105; auditoría, tipos y lint verdes |
| R18 | geofences-canvas-fidelity.test.ts::#189 R18 | 0896a843 rojo; cd26b658 verde | C 17/17; 14 sondas; E3 y cierre móvil 4398/4398 verdes |


## Cierre

R1-R17 implementados y verificados por bloque; R18 C 17/17 con sondas. Bloqueo histórico de heroui-text-size-merge resuelto por E3. Suite móvil completa 4398/4398 y todas las guardas verdes; typecheck/lint exit 0. Medidas y trazabilidad completadas; graphify exit 0. El commit documental final incluye este informe y traceability.md. Smoke de requirements §6 reservado al humano. El .done se crea como última acción tras completar el Cierre.

R4: typecheck exit 0 y lint sin caché exit 0, log vacío.

- `706c5df1 test(mobile): #189 R15 rojo — lock five bilingual keys (R15)` — `Tests: 6 failed, 47 passed, 53 total`.
- `ce5f6298 feat(mobile): #189 R15 add exact bilingual geofence copy (R15)` — `Tests: 53 passed, 53 total`. Catálogo 436 + 5 = 441 por idioma; tablas de uso se ajustan con cada pantalla.

## Avance R15 y R1

R15: typecheck y lint sin caché exit 0; log vacío.
- `ea7fea7a feat(mobile): #189 R1 render content heading and zone counter (R1)`
- `1eada8f8 test(mobile): #189 R1 rojo — lock content heading and counter (R1)`
- `ce5f6298 feat(mobile): #189 R15 add exact bilingual geofence copy (R15)`
- `706c5df1 test(mobile): #189 R15 rojo — lock five bilingual keys (R15)`

R1 rojo: F `Tests: 12 failed, 56 passed, 68 total`; L `Tests: 2 failed, 26 passed, 28 total`. Verde: F 68/68, L 28/28, ui-language 30/30. Sonda contador en no-tracking: exit 1 por aserción; fuente restaurada. R14_GEOFENCES 20 + 1 = 21; R15_GEOFENCE_EDITOR 27 - 1 = 26 transitoriamente: se retira la fila del título nativo del Editor ahora y R8 añadirá las dos llamadas del título en contenido. M9: 2 - 2 = 0.

R1: typecheck y lint sin caché exit 0, log vacío. Sonda R1 exacta: `Tests: 1 failed, 56 skipped, 11 passed, 68 total`.

## Avance R2

- `c4feee5c feat(mobile): #189 R2 render accessible zone progress (R2)`
- `9fbde5f4 test(mobile): #189 R2 rojo — lock five progress segments (R2)`

Rojo F: `Tests: 7 failed, 70 passed, 77 total`. Verde F: `Tests: 77 passed, 77 total`; ui-language: `Tests: 30 passed, 30 total`. Sonda i <= n: `Tests: 4 failed, 67 skipped, 6 passed, 77 total`, exit 1, restaurada. R14_GEOFENCES 21 + 1 = 22.

R2: typecheck y lint sin caché exit 0, log vacío.

## Avance R3

- `d1cff68a feat(mobile): #189 R3 apply canvas spacing and content order (R3)`
- `3b4ed7f9 test(mobile): #189 R3 rojo — lock canvas spacing and child order (R3)`

Rojo F: `Tests: 7 failed, 74 passed, 81 total`. Verde F: `Tests: 81 passed, 81 total`. Para satisfacer el orden exacto de hijos que exige R3, este requisito introduce los envoltorios HomeEntrance de filas y aviso; sus contenidos visuales se completan en R5 y R6, en el orden de tasks.md. La entrada reutiliza HomeEntrance existente sin modificarlo.

R3: typecheck y lint sin caché exit 0, log vacío.

## Avance R5

- `ff2d303e feat(mobile): #189 R5 style zone rows and accessible icon deletion (R5)`
- `485402b9 test(mobile): #189 R5 rojo — lock zone tiles and row actions (R5)`

Rojo F: `Tests: 9 failed, 75 passed, 84 total`. Verde F: `Tests: 84 passed, 84 total`. Guardas individuales verdes: design-drift 115/115, consistency-classnames 74/74, legibility-classnames 27/27, ui-language 30/30.

Medidas: reicon Zonas 0 + 1 = 1 import; category-palette 0 + 1 = 1 import; rounded-14 incorpora Zonas; CONTINUOUS_CORNER directo Zonas 0 + 2 = 2 y global 38 + 2 = 40; directUses añade una fila (un it nuevo). TABULAR_NUMS intacto 0 / 1. R14_GEOFENCES permanece 22 al sustituir la llamada visible delete por deleteLabel. Iconos e índices de HomeEntrance se observan con dobles de host como en Documentos; no se cambia el componente compartido. La sonda de literal bg-category-green prescrita en R5/R18 se ejecutará al crear el candado R18, aún ausente por el orden de tasks.md.

R5: primer lint falló por react/display-name (26:34) en el doble de iconos nuevo. Se corrige el componente anónimo con función nombrada, dentro del fichero autorizado y del mismo requisito; se repiten F, typecheck y lint. No es discrepancia de cifra/ancla de la spec ni requiere ampliar el alcance.

- `d89f3bac test(mobile): #189 R5 name the icon test double (R5)` — `Tests: 84 passed, 84 total`.

## Bloqueo obligatorio en R6

Se detiene el trabajo sin iniciar R7. La guarda `src/__tests__/profile-canvas-fidelity.test.ts` tiene dos inventarios adicionales a los enumerados en requirements §4 y, por tanto, fuera de las filas que el handoff permite editar:

1. Línea 61, `filesMatching(/\btext-26\b/)`: espera 6 consumidores; recibe 7 porque el título exigido por R1 añade `screens/geofences/index.tsx`.
2. Línea 71, `filesMatching(/\btext-13\b/)`: espera 14 consumidores; recibe 15 porque el aviso exigido por R6 añade `screens/geofences/index.tsx`.

La fila autorizada de `rounded-tile` sí pasó después de añadir Zonas en orden alfabético entre add-reminder y home. Ninguna de las dos filas de tamaños se ha editado ni relajado.

Origen de la parada: handoff línea 27, «candados agregados de requirements §4, solo las filas que ahí se nombran»; línea 68, «Si una cifra o ancla no coincide, PARA y reporta. La spec se reescribe; el código no se adapta.» Se necesita enmendar §4 y el alcance del handoff para incluir esos inventarios. R8 también prescribe text-26 en las ramas de estado del Editor: la enmienda debería contemplar ese consumidor adicional cuando se implemente R8. No hay decisiones D1-D10 reabiertas.

Resultados exactos de R6:

- Rojo F: `Tests: 3 failed, 84 passed, 87 total`.
- Implementación F: `Tests: 87 passed, 87 total` (exit 0).
- Profile: `Tests: 2 failed, 24 passed, 26 total` (exit 1), log `progress/r6-profile-189.log`.
- El comando encadenado se detuvo ahí: no ejecutó consistency, typecheck ni lint de R6.
- Último typecheck/lint verde: tras la corrección del doble de R5; log de lint vacío, exit 0.

Árbol al detenerse: solo `mobile-pet-tracker/src/screens/geofences/index.tsx` tiene cambios de producción sin commit (implementación de R6). El test rojo de R6 y las filas agregadas autorizadas están en `77bd89a2`. Se conserva el trabajo para revisión/reanudación, sin fabricar un cierre verde. Este reporte sigue sin commit como exige el handoff hasta el cierre; `traceability.md`, feature_list.json, STATUS.md, progress/current.md e history.md siguen intactos. No se crea sentinel .done, no se abre PR, no se ejecuta init.sh ni graphify de cierre y no se hace smoke Android.

## Historial completo de esta ejecución

- `8aee1c34 test(mobile): #189 R4 rojo — lock zone palette order (R4)` — `Tests:       2 failed, 12 passed, 14 total`.
- `4a3b7261 feat(mobile): #189 R4 assign zone colors by position (R4)` — `Tests:       14 passed, 14 total`.
- `706c5df1 test(mobile): #189 R15 rojo — lock five bilingual keys (R15)` — `Tests:       6 failed, 47 passed, 53 total`.
- `ce5f6298 feat(mobile): #189 R15 add exact bilingual geofence copy (R15)` — `Tests:       53 passed, 53 total`.
- `1eada8f8 test(mobile): #189 R1 rojo — lock content heading and counter (R1)` — `Tests:       12 failed, 56 passed, 68 total`.
- `ea7fea7a feat(mobile): #189 R1 render content heading and zone counter (R1)` — `Tests:       68 passed, 68 total`.
- `9fbde5f4 test(mobile): #189 R2 rojo — lock five progress segments (R2)` — `Tests:       7 failed, 70 passed, 77 total`.
- `c4feee5c feat(mobile): #189 R2 render accessible zone progress (R2)` — `Tests:       77 passed, 77 total`.
- `3b4ed7f9 test(mobile): #189 R3 rojo — lock canvas spacing and child order (R3)` — `Tests:       7 failed, 74 passed, 81 total`.
- `d1cff68a feat(mobile): #189 R3 apply canvas spacing and content order (R3)` — `Tests:       81 passed, 81 total`.
- `485402b9 test(mobile): #189 R5 rojo — lock zone tiles and row actions (R5)` — `Tests:       9 failed, 75 passed, 84 total`.
- `ff2d303e feat(mobile): #189 R5 style zone rows and accessible icon deletion (R5)` — `Tests:       84 passed, 84 total`.
- `d89f3bac test(mobile): #189 R5 name the icon test double (R5)` — `Tests:       84 passed, 84 total`.
- `77bd89a2 test(mobile): #189 R6 rojo — lock amber limit notice (R6)` — `Tests:       3 failed, 84 passed, 87 total`.

## Ficheros tocados desde H0 (hasta la parada)

- `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`
- `mobile-pet-tracker/src/__tests__/design-drift.test.ts`
- `mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts`
- `mobile-pet-tracker/src/__tests__/ui-copy-table.ts`
- `mobile-pet-tracker/src/__tests__/ui-language.test.ts`
- `mobile-pet-tracker/src/app/__tests__/layout.test.tsx`
- `mobile-pet-tracker/src/app/_layout.tsx`
- `mobile-pet-tracker/src/i18n/catalog.ts`
- `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`
- `mobile-pet-tracker/src/screens/geofences/index.test.tsx`
- `mobile-pet-tracker/src/screens/geofences/index.tsx`
- `mobile-pet-tracker/src/utils/__tests__/category-palette.test.ts`
- `mobile-pet-tracker/src/utils/category-palette.ts`

Todos pertenecen a la lista cerrada. No se han editado las filas text-26/text-13 no autorizadas. Cierre completo, R7-R14, R16-R18, sondas R18 y smoke humano pendientes. R15 tiene las cinco claves, con tabla de usos aún dependiente de las pantallas pendientes.

## Enmienda E1 — reanudación

- H0 de reanudación: `314cd64f` (firma E1), HEAD verificado al volver. H0 original del diff final: `4204530e`.
- Ruta/branch confirmadas de nuevo: `/home/claude/sites/Pet-Tracker-wt-189`, `feature/189-mobile-geofences-canvas-fidelity`.
- Gate E1: grep de casilla firmada devuelve 1. Estado inicial exacto: solo implementación R6 modificada y ambos reportes .md de progress sin seguimiento.
- Lista cerrada ampliada únicamente con `src/__tests__/alerts-canvas-fidelity.test.ts`; no se ejecuta init.sh ni merge.
- Primera revisión de pgrep detecta Jest en Pet-Tracker-wt-194. Se espera a que el guard global quede vacío antes de cualquier Jest de esta reanudación.

| Inventario E1 | Base esperada en H0 E1 | Delta total aprobado | Aplicación |
|---|---:|---:|---|
| profile text-26 | 6 | +2 = 8 | +Zonas ahora (R1); +Editor en R8 |
| profile text-13 | 14 | +1 = 15 | R6, junto a su implementación |
| alerts text-15 | 13 | +1 = 14 | Editor en R12 |
| alerts tracking-title | 10 | +2 = 12 | +Zonas ahora (R1); +Editor en R8 |
| consistency border-lip-gray | 10 | +1 = 11 | R13 |

Con el árbol inicial sin commit, las observaciones reales ya incluyen Zonas: text-26 7, text-13 15 y tracking-title 11. Las filas futuras del Editor no se adelantan, según el bloque REANUDACIÓN. El commit E1 contiene solo los dos inventarios que R1 ya movió; la fila text-13 se reserva al commit feat de R6. La parada anterior queda registrada como evidencia histórica, resuelta por E1.

### E1 aplicada y resultados de la comprobación previa

Commit de inventarios adelantados por R1: `bde4290a test(mobile): #189 E1 inventarios por clase de las pantallas de zonas`. Contiene únicamente profile/text-26 (+Zonas: esperado 6→7, observado 7) y alerts/tracking-title (+Zonas: esperado 10→11, observado 11), con sufijo de enmienda R1. Las entradas futuras del Editor permanecen sin adelantar. El código sin commit de R6 no se alteró.

Se ejecutaron **las seis suites completas, individualmente**:

| Suite | Línea Tests: | Resultado |
|---|---|---|
| profile-canvas-fidelity | 1 failed, 25 passed, 26 total | Único rojo esperado de E1: text-13 14→15, reservado al commit feat de R6 |
| alerts-canvas-fidelity | 27 passed, 27 total | Verde |
| consistency-classnames | 74 passed, 74 total | Verde |
| design-drift | 115 passed, 115 total | Verde |
| legibility-classnames | 27 passed, 27 total | Verde |
| chunky-cta-canvas-fidelity | 1 failed, 73 passed, 74 total | **Rojo no cubierto por §4.1: parada** |

Logs: `progress/e1-<suite>-189.log`. Los bucles se detuvieron dos veces con exit 90 antes de lanzar el siguiente Jest al detectar un PID en la guarda global; se reanudaron las suites restantes únicamente al quedar vacía. No se saltó ninguna suite ni la guarda.

### Nuevo bloqueo — chunky-cta #177 R6.2

La primera aserción de `src/__tests__/chunky-cta-canvas-fidelity.test.ts:155` falla:

- `count(/<Button\.Label/g)`: esperado `35 - 15 - 1 = 19`; observado **18**.
- Medición adicional de la siguiente aserción (aún no alcanzada por Jest debido al primer fallo): `count(/Button\.Label/g)` espera `82 - 30 - 2 = 50`; observado **48**.

Causa medida: R5 sustituyó el Button.Label de la papelera de cada fila por Trash dentro de Pressable, como exige R5.6. El delta de fuente es -1 tag de apertura / -2 menciones de Button.Label, contando apertura y cierre. Se comparó `screens/geofences/index.tsx` contra H0 original 4204530e; los demás ficheros no explican ningún delta de esos recuentos.

Resto de contadores del mismo it medidos sin modificar pruebas:

| Patrón | H0 original | Actual | Delta |
|---|---:|---:|---:|
| `<Button.Label` | 19 | 18 | -1 |
| `Button.Label` | 50 | 48 | -2 |
| `text-17` | 24 | 24 | 0 |
| `<Text className="text-17 font-extrabold text-accent-foreground">` | 17 | 17 | 0 |
| `text-17 font-extrabold text-foreground` | 6 | 6 | 0 |
| `<Text className="text-17 font-bold text-accent-strong">` | 1 | 1 | 0 |

Este it no aparece entre las cinco filas E1. Tampoco cabe en su regla residual: los deltas son negativos y proceden de quitar un componente, no de sumar una pantalla a un inventario de clase ni de +1 por uso. Por ello no se ha tocado ni relajado chunky-cta.

Instrucción que determina la parada: bloque REANUDACIÓN, paso 4, «Cualquier otro rojo que no sea de §4.1: PARA y reporta con el diff medido.» Se necesita ampliar la enmienda con estos dos recuentos y su origen R5 antes de retomar el paso 5. Como consecuencia ya prescrita (todavía sin ejecutar), R13 también sustituirá el Button.Label de Eliminar del Editor por Text; conviene contemplar su delta al redactar la enmienda para evitar otra omisión del mismo inventario.

No se ha iniciado R7, no se ha commiteado la implementación de R6 ni su fila text-13, y no se ha creado .done. No se ejecutaron typecheck, lint ni suite completa de cierre durante esta reanudación porque el paso previo quedó rojo. El estado de producción sigue siendo exactamente la implementación de R6 que se pidió conservar; scoped git status muestra solo `M mobile-pet-tracker/src/screens/geofences/index.tsx`. Handoff e informe siguen sin seguimiento; docs y specs no se han editado. No se ha ejecutado init.sh, merge, PR ni despliegue.


## Enmienda E2 — segunda reanudación (2026-10-21)

- H0 de esta reanudación: `73ef8e1a`, firma humana E2; HEAD inicial y ascendencia verificados. La casilla E2 devuelve 1. Base del diff final conserva `4204530e`.
- Ruta y branch confirmadas: `/home/claude/sites/Pet-Tracker-wt-189`, `feature/189-mobile-geofences-canvas-fidelity`. Estado inicial exacto: R6 en `screens/geofences/index.tsx` sin commit, más handoff e informe sin seguimiento. No se hizo merge.
- Commit `b0a94836 test(mobile): #189 E2 recuentos de Button.Label tras R5`: solo chunky-cta; aperturas 19→18 (`35 - 15 - 1 - 1`), menciones 50→48 (`82 - 30 - 2 - 2`). Origen único R5.6, papelera pasa de Button.Label a Trash dentro de Pressable. R13 aún no adelantado. Los demás recuentos de #177 R6.2 conservan 24 / 17 / 6 / 1.
- Seis suites completas y solas, con guarda global antes de cada ejecución:

| Suite | Tests: | Exit |
|---|---|---:|
| profile-canvas-fidelity | 1 failed, 25 passed, 26 total | 1 |
| alerts-canvas-fidelity | 27 passed, 27 total | 0 |
| consistency-classnames | 74 passed, 74 total | 0 |
| design-drift | 115 passed, 115 total | 0 |
| legibility-classnames | 27 passed, 27 total | 0 |
| chunky-cta-canvas-fidelity | 74 passed, 74 total | 0 |

Único rojo: profile/text-13, esperado 14, observado 15 por R6. Logs `progress/e2-<suite>-189.log`. E1 y el bloqueo de chunky quedan resueltos por la enmienda firmada; no se relajan otros candados.

### Desviación de arranque de esta reanudación

Se lanzó `./init.sh` por la regla general de AGENTS.md antes de leer la excepción específica del handoff. Se detuvo mediante SIGTERM al descubrirla (exit 143); alcanzó instalación con lockfiles existentes y arranque del build backend, sin tests. `git status --short` siguió mostrando exactamente los tres ficheros esperados. No se repetirá init: corresponde al leader. El primer comando incluyó pwd/status, pero branch se verificó al leer el bloque final. Estas desviaciones quedan registradas; no se afirma haber omitido init en esta reanudación.

Skills recargadas: ponytail, appllama-app-design-skill, animate-expo, building-native-ui y expo-tailwind-setup (las dos últimas en cache Expo 11c74d6b). Documentación Expo SDK 57 consultada de nuevo según mobile-pet-tracker/AGENTS.md: https://docs.expo.dev/versions/v57.0.0/ . Sin nuevas dependencias ni cambios de configuración.

### Candados enmendados por regla residual E2

R7: chunky #177 R7.5 y R8.1 reconocen el style primario condicional; recuento literal 17→16, inventario semántico conserva 17. Detalle medido y origen por fichero en la sección R7. Las filas text-17 están expresamente enumeradas en §4.2; text-13 y los futuros inventarios del Editor, en §4.1.


### R6 tras E2

La implementación conservada no se reescribió: solo se añade en profile la fila `screens/geofences/index.tsx` al inventario text-13 (14→15) y sufijo `(enmendado por #189 R6)`, como prescribe §4.1.
- F: `Tests: 87 passed, 87 total`.
- Profile: `Tests: 26 passed, 26 total`.
- Consistency: `Tests: 74 passed, 74 total`.
- Primer intento de esta ronda abortó con exit 90 antes de Jest por PID global 3625160; había terminado al consultar ps. Reintento solo con guardas vacías, sin solapar suites.

R6: typecheck exit 0; lint sin caché exit 0 y log vacío. Commit `a3a97a60 feat(mobile): #189 R6 render amber zone limit notice (R6)`. Implementación heredada preservada hasta ese commit, junto a la fila text-13 autorizada.


### R7 — TDD y recuentos medidos

- `a74f5566 test(mobile): #189 R7 rojo — lock add-zone CTA states (R7)`: F `Tests: 7 failed, 87 passed, 94 total`. Pruebas de receta exacta en 0/4/5 zonas y ES/EN, labio, cardinalidad, orden, navegación y busy.
- Primera implementación F: `Tests: 2 failed, 92 passed, 94 total`. Los dos tests nuevos omitían el prefijo generado por HeroUI `disabled:element-disabled` en el host deshabilitado, ajeno a la clase de receta fijada por la spec. Se corrige la expectativa del host con `27f70466 test(mobile): #189 R7 include HeroUI disabled host class (R7)`, sin cambiar la receta ni expectativas de estado.

Medición de fuente tras implementar el ternario de R7 (comparada además con `git show 4204530e:<pantalla>`):

| Candado | Antes R7 → después | Delta Zonas desde H0 | Causa |
|---|---|---|---|
| chunky #177 R6.2 text-17 | 24→25 | 1→2 (+1) | dos literales completos de etiqueta, R7.2 |
| chunky #177 R6.2 Text literal acento | 17→16 | 1→0 (-1) | className pasa a ternario, R7.2 |
| chunky #177 R6.2 text-17 foreground | 6→6 | 0→0 | sin cambio |
| chunky #177 R6.2 Text bold strong | 1→1 | 0→0 | sin cambio |
| chunky/design-drift rounded-16 | 27→28 global; Zonas 1→2 | +1 | dos literales completos del botón, R7 |
| chunky #177 R7.5 style primario literal | 17→16 | 1→0 | `style={atLimit ? undefined : chunkyLip.primary}`, R7.2 |
| chunky #177 R8.1 ids con style primario literal | 17→16 | geofences-add deja de casar | mismo ternario, R7.2 |

Los últimos dos inventarios se enmiendan por la regla residual E2 para reconocer exactamente el ternario prescrito; siguen contando 17 estilos/IDs primarios semánticos. CTA_ROWS se actualiza a `mt-auto` y sus tests de clase/etiqueta fijan ambas ramas literales y el estilo condicional exacto, sin cambiar isDisabled ni navegación. Los seis recuentos de #177 R6.2 quedan 18 / 48 / 25 / 16 / 6 / 1. Fuera de Zonas no hay delta en R7.

R7 verde: F `Tests: 94 passed, 94 total`; chunky `Tests: 74 passed, 74 total`; design-drift `Tests: 115 passed, 115 total`; consistency `Tests: 74 passed, 74 total`. Sonda bg-default en la rama primaria: `Tests: 5 failed, 87 skipped, 2 passed, 94 total`, exit 1; fuente restaurada antes de typecheck/lint.

R7: typecheck exit 0; lint sin caché exit 0, log vacío. Commit verde `7d93a46d`.


### R8 — título en contenido del Editor

- Rojo `10afa5f0 test(mobile): #189 R8 rojo — lock editor content titles (R8)`: `Tests: 11 failed, 68 passed, 79 total`.
- Pruebas del formulario: editar/crear/lectura, ES/claro y EN/oscuro, título con rol header, texto/clases, BlurView (intensidad 48, método, tema y clase), cardinalidad y posición después de PetMap. Cinco ramas de estado comprueban el título plano como primer hijo.
- E1 aplicada en este R: profile text-26 7→8 consumidores (Editor añadido); alerts tracking-title 11→12 consumidores (Editor antes de Zonas). Ambos con sufijo R8; se mantiene el resto de filas.
- R15_GEOFENCE_EDITOR: 26→28 al incorporar exactamente dos llamadas de título; la cabecera nativa ya quedó vacía en R1.

R8: primera ejecución de implementación E `Tests: 5 failed, 74 passed, 79 total`: los cinco casos nuevos consultaban los hijos del host ScrollView en vez de su View de contenido. Corrección de test `b6df90b8 test(mobile): #189 R8 inspect ScrollView content children (R8)`: se verifica también que el padre del contenido es el scroll, y el título sigue siendo el primer hijo real. E verde `Tests: 79 passed, 79 total`; profile `Tests: 26 passed, 26 total`; alerts-canvas `Tests: 27 passed, 27 total`; ui-language `Tests: 30 passed, 30 total`.

R8 sonda: mover la píldora antes de PetMap da `Tests: 6 failed, 68 skipped, 5 passed, 79 total`, exit 1. Se restaura el orden correcto antes de typecheck/lint.

R8: typecheck exit 0; lint sin caché exit 0, log vacío. Commit verde `80d38dd4`.


### R9 — hoja estática y teclado

- Rojo `4edd48ad test(mobile): #189 R9 rojo — lock static map sheet and keyboard geometry (R9)`: E `Tests: 9 failed, 73 passed, 82 total`.
- Primera implementación: `Tests: 3 failed, 79 passed, 82 total`; las props behavior/keyboardVerticalOffset son consumidas por KeyboardAvoidingView y no llegan al host View que devuelve RNTL. `65750505 test(mobile): #189 R9 check consumed keyboard props at source (R9)` fija ambas props exactas en el candado de fuente y conserva íntegro el bloque de teclado real de `#146 R6`, incluido `paddingBottom: 291`. No se modifica el comportamiento del teclado.
- Verde: E `Tests: 82 passed, 82 total`; consistency `Tests: 75 passed, 75 total`; profile `Tests: 26 passed, 26 total`; legibility `Tests: 27 passed, 27 total`; ui-language `Tests: 30 passed, 30 total`.
- CONTINUOUS_CORNER del Editor 0→2 referencias (import + uso combinado en array); directos `style={CONTINUOUS_CORNER}` 0→0 y global 41→41. Se añade candado específico del uso combinado y se lee borderCurve en el árbol: el inventario directo no cuenta arrays. No se adultera su cifra para fingir ese uso. Uso de TABULAR_NUMS sigue siendo uno.
- rounded-hero mantiene exactamente los tres consumidores (components/card, alert-detail, profile): rounded-t-hero no casa; no se modifica profile. La sugerencia se mueve de la hoja al mapa conservando su llamada t y su copy. Tabla Editor: 25 llamadas en Editor + 3 usos en Zonas = 28 filas.

R9 sonda de fondo opaco sobre el mapa: `Tests: 4 failed, 73 skipped, 5 passed, 82 total`, exit 1, restaurada. Typecheck exit 0; lint sin caché exit 0, log vacío. Commit verde `f9f42cbe`.


### R10 — Nombre

Rojo `fbf654fc test(mobile): #189 R10 rojo — lock name field and read-only typography (R10)`: `Tests: 6 failed, 78 passed, 84 total`. Se mantienen las pruebas de escribir y maxLength 120; dos nuevos casos ES/EN leen Label.Text en el host por `label__text`, el tamaño del input y la actualización del valor. Los cuatro roles de solo lectura conservan su comportamiento y cambian solo la expectativa tipográfica, con sufijo R10. Implementación mínima: Label.Text, talla h-12.5 y padding del input, peso del nombre de solo lectura.

R10 verde E: `Tests: 84 passed, 84 total`. Sin nuevas claves ni cambios de inventarios; la etiqueta usa text-sm de Tailwind sobre Label.Text, acorde con la enmienda #187.

R10: typecheck exit 0; lint sin caché exit 0 y log vacío. Commit verde `f5ef4230`.


### R11 — Radio

Rojo `f571ee79 test(mobile): #189 R11 rojo — lock radius block and slider endpoints (R11)`: `Tests: 4 failed, 83 passed, 87 total`. Extremos comparados con minValue/maxValue leídos del slider, no valores duplicados; casos ES/EN, orden/cardinalidad, tabulares, cambio del radio y lectura. Se adelanta la enmienda de orden de #146 R13 y R14 porque es R11 el que introduce el contenedor radius-block; R12 no volverá a mover ese orden.

Se conservan las mismas constantes 20 y 2000 para slider, extremos y límites de TalkBack, paso 10. Un único radiusValue JSX mantiene una sola llamada `t('geofences.radius')` y un solo `style={TABULAR_NUMS}`. Tabla R15: 28→31 (28 llamadas de Editor + 3 de Zonas); nuevas llamadas radiusTitle y meters ×2. Legibility no cuenta text-11/text-xs por inventario; no se cambian sus cifras.

R11 E verde: `Tests: 87 passed, 87 total`. Dos lanzamientos de las guardas restantes abortaron con exit 90 antes de Jest (PIDs 3636461 y 3636816); el segundo corresponde a layout/detail-stack en Pet-Tracker-wt-194. Se espera a su fin sin tocar ese proceso.

R11 guardas tras liberarse la ejecución global: ui-language `Tests: 30 passed, 30 total`; legibility `Tests: 27 passed, 27 total`; consistency `Tests: 75 passed, 75 total`. Sonda `maxValue={2001}`: `Tests: 2 failed, 82 skipped, 3 passed, 87 total`, exit 1 por los extremos; fuente restaurada.

R11: typecheck exit 0; lint sin caché exit 0 y log vacío. Commit verde `f5997745`.


### R12 — Activa

Rojo `7cb1a089 test(mobile): #189 R12 rojo — lock active row typography (R12)`: `Tests: 2 failed, 88 passed, 90 total`. Se conserva íntegro #146 R13 (escritura, errores, busy y 401); los nuevos casos leen etiqueta ES/EN, clase exacta, cardinalidad, orden e inexistencia al crear. Cambio productivo de una sola clase. E1 text-15 en alerts: 13→14 consumidores, Editor entre forgot y home, con sufijo R12.

R12 verdes: E `Tests: 90 passed, 90 total`; alerts-canvas `Tests: 27 passed, 27 total`.

R12: typecheck exit 0; lint sin caché exit 0 y log vacío. Commit verde `fb04857b`.

R13: primer lanzamiento rojo abortado por guarda global (exit 90, PID 3641550). Se observa después una corrida de siete suites en Pet-Tracker-wt-194 (PID 3642058); no se solapa ni se cancela. Los cambios de R13 siguen siendo solo tests, antes de la implementación.


### R13 — acciones y E2 al cierre de los botones

Rojo `4fa40659 test(mobile): #189 R13 rojo — lock editor action row and button states (R13)`: `Tests: 21 failed, 79 passed, 100 total`. Diez casos nuevos de recetas/orden/cardinalidad ES/EN, vacío, espacios, nombre válido, creación y busy; los tests anteriores de confirmación, borrado, guardado, 401 y bloqueo permanecen. Solo se enmiendan clases y ancestros de orden/error que cambia actions, con sufijo R13.

Medición agregada tras la implementación, por patrón y por pantalla frente a H0 original:

```
<Button\.Label: total 17; geofences H0 2→1; geofence-editor H0 2→1
Button\.Label: total 46; geofences H0 4→2; geofence-editor H0 4→2
text-17: total 26; geofences H0 1→2; geofence-editor H0 1→2
<Text className="text-17 font-extrabold text-accent-foreground">: total 15; geofences H0 1→0; geofence-editor H0 1→0
text-17 font-extrabold text-foreground: total 6; geofences H0 0→0; geofence-editor H0 0→0
<Text className="text-17 font-bold text-accent-strong">: total 1; geofences H0 0→0; geofence-editor H0 0→0
style=\{chunkyLip\.primary\}: total 15; geofences H0 1→0; geofence-editor H0 1→0
border-lip-gray: total 11; geofences H0 0→0; geofence-editor H0 0→1
\brounded-16\b: total 30; geofences H0 1→2; geofence-editor H0 1→3
```

Recuentos de #177 R6.2 antes R13→después: Button.Label 18→17 / 48→46; text-17 25→26; Text literal acento 16→15; foreground 6→6; bold strong 1→1. Delta exclusivo del Editor: reemplazo Button.Label por Text en Eliminar, y ternario de clase de Guardar, como prescribe E2.

Radii Editor 1→3 (+2), global 28→30; NEUTRAL_ROWS 6→7 filas; neutralInventory 9→10 ids. Delete sale de excluded. border-lip-gray global 10→11, por un uso en Editor (0→1): se actualizan consistency (E1 explícita) y chunky #177 R7.1 (regla residual). El estilo primario literal global 16→15; el inventario reconoce el ternario exacto de Guardar y conserva 17 primarios semánticos.

Candados residuales E2 añadidos en R13: chunky #177 R7.1 border-lip-gray (10→11); chunky #177 R7.5 y R8.1 (literal de estilo 16→15 / ids literales 16→15, 17 semánticos tras reconocer el ternario); consistency inventario de secundarios neutros (9→10, geofence-editor-delete). Todos proceden únicamente del Editor y conservan el resto de ficheros/ids y las anclas isDisabled/onPress/401.

R13 verdes: E `Tests: 100 passed, 100 total`; chunky `Tests: 76 passed, 76 total` (dos tests nuevos por fila NEUTRAL_ROWS); consistency `Tests: 75 passed, 75 total`; design-drift `Tests: 115 passed, 115 total`; ui-language `Tests: 30 passed, 30 total`.

Sondas R13/E2, todas exit 1 por aserción y restauradas en finally antes de tipos/lint:

| Mutación real de Editor | Tests: |
|---|---|
| Primario Guardar gris con nombre válido | 6 failed, 79 skipped, 15 passed, 100 total |
| Volver a Button.Label en Eliminar (#177 R6.2) | 1 failed, 75 skipped, 76 total |
| Quitar border-lip-gray, chunky #177 R7.1 | 1 failed, 75 skipped, 76 total |
| Quitar border-lip-gray, consistency (inventario neutro sigue en 10 por outline) | 1 failed, 74 skipped, 75 total |
| Quitar el style condicional de Guardar, chunky R7.5/R8.1 | 2 failed, 72 skipped, 2 passed, 76 total |

Logs `progress/<sonda>-mutation-189.log`. Los inventarios enmendados siguen detectando pérdida de componente, borde y estilo; las cifras no se relajan.

R13: typecheck exit 0; lint sin caché exit 0 y log vacío. Commit verde `d2d3e78d`.


### R14 — estados conservados

Rojo `7e97c547 test(mobile): #189 R14 rojo — lock state screen canvas metrics (R14)`: `Tests: 6 failed, 99 passed, 105 total`. Se añade una medida por cada rama (carga, no-tracking, error, no encontrada, solo dueño) y se enmienda solo la expectativa de métricas antigua del esqueleto. La implementación modifica únicamente contentContainerStyle de esas ramas, manteniendo copy, lógica, título, avisos y reintentos.

R14 E verde: `Tests: 105 passed, 105 total`.

R14: typecheck exit 0; lint sin caché exit 0, log vacío. Commit verde `e4dc03c3`.


### R16 — carta

Rojo `aaf229f9 test(mobile): #189 R16 rojo — lock charter geofence exceptions (R16)`: `Tests: 4 failed, 4 total`. Las pruebas leen las secciones normativas (no se satisfacen con la enmienda del final): métricas bajo A11, línea nominal de radios, receta gris y excepciones de Eliminar/papelera, reparto único zoneCategory por posición. Se añaden únicamente esas líneas autorizadas; se conserva la firma de Enmienda #189 y las líneas #175-#180. docs/conventions.md no necesita cambios.

R16 verdes: C `Tests: 4 passed, 4 total`; design-drift `Tests: 115 passed, 115 total`; chunky `Tests: 76 passed, 76 total`.

R16: typecheck exit 0; lint sin caché exit 0 y log vacío. Commit verde `644472be`.


### R17 — verificación sin añadir tests

Auditoría AST antes de la mutación: todos los describe originales siguen (Zonas 9→15, Editor 6→13; ninguno perdido). Funciones/constantes de comportamiento idénticas a 4204530e, normalizando solo espacios: Zonas isOwner/write/confirmDelete; Editor isOwner/run/refresh/leave/save/confirmDelete. Línea completa de props de PetMap idéntica, GEOFENCE_MAX_PER_PET = 5 intacto. R17 no añade tests, tal como manda tasks.md.

Para probar que la verificación está viva y dar evidencia C4 sin fabricar un test nuevo, se planta una mutación real y versionable del rol de Zonas (owner→family) y se ejecuta el test existente #41 R6 del interruptor del dueño; el verde revertirá exactamente esa mutación. Es una prueba de verificación de producción, no un cambio final de comportamiento.

R17 rojo real `44c1e6da test(mobile): #189 R17 rojo — verify owner controls by production mutation (R17)`: `Tests: 1 failed, 93 skipped, 94 total`. La aserción existente detecta la ausencia del interruptor del dueño; no hay ReferenceError de helpers ni mutación de mocks. Restaurado owner para el verde de las dos pantallas.


### Lista consolidada de enmiendas por regla residual E2

| Candado | Antes→después | Delta exclusivo frente a 4204530e | R |
|---|---|---|---|
| chunky #177 R7.5, estilo primario por fichero | Literal global 17→16→15; inventario reconocido conserva 17 | Zonas 1→0 literal; Editor 1→0 literal; cada uno conserva un ternario primario | R7, R13 |
| chunky #177 R8.1, ids que reciben primario | Literal 17→16→15; reconoce 17 ids tras enmienda | geofences-add y geofence-editor-save pasan a condición exacta | R7, R13 |
| chunky #177 R7.1, border-lip-gray | 10→11 | Editor 0→1; Zonas 0→0 | R13 |
| consistency #166 R3, inventario neutro | 9→10 ids | +geofence-editor-delete; ninguna otra pantalla | R13 |

Las filas text-17 de chunky (24→26 y 17→15) están expresamente incluidas en E2; Button.Label (19→17 y 50→46) también. Los inventarios text-26/text-13/text-15/tracking-title y border-lip-gray de consistency están expresamente en E1. Radii/CTA_ROWS/NEUTRAL_ROWS y rounded-tile/14 son filas originales de §4. No se enmienda ningún candado de copy, isDisabled, onPress ni 401 por regla residual.

R17 verdes completos: F `Tests: 94 passed, 94 total`; E `Tests: 105 passed, 105 total`. Typecheck exit 0; lint sin caché exit 0, log vacío. Commit verde `de23d7e5`, que revierte exactamente la mutación de rol.


### R18 — candados de fuente con sondas reales

Rojo versionado `0896a843 test(mobile): #189 R18 rojo — prove source guards with production mutations (R18)`: `Tests: 2 failed, 15 passed, 17 total`. En la producción real de Zonas se plantan bg-category-green literal en el tile y Button.Label con text-17 en geofences-add (zona ciega señalada por el handoff). Fallan exactamente las aserciones de paleta y Text nativo. No se usa una mutación de un mock ni un ReferenceError; se versionan las mutaciones de producción en el rojo para cumplir C4. La implementación final restaurará los dos fragmentos correctos ya existentes.

El candado usa el AST de TypeScript para inspeccionar className multilínea/ternarios y comprobar que los tamaños propios van sobre Text importado de React Native. Los iconos/paleta/BlurView se comprueban por sus imports; además hay candados de hex, clases arbitrarias, StyleSheet.create, emojis y construcción dinámica de tamaños.

Sondas R18 independientes, todas con `Tests: 1 failed, 16 passed, 17 total` y exit 1; fuentes restauradas en finally:

- `blur-in-zones`: #189 R18: candados de fuente de ambas pantallas › #189 R18: BlurView procede de expo-blur y solo vive en Editor.
- `blur-origin`: #189 R18: candados de fuente de ambas pantallas › #189 R18: BlurView procede de expo-blur y solo vive en Editor.
- `category-literal`: #189 R18: candados de fuente de ambas pantallas › #189 R18: las clases de categoría se delegan a la paleta.
- `geofence-editor-arbitrary`: #189 R18: candados de fuente de ambas pantallas › #189 R18: geofence-editor no usa clases arbitrarias.
- `geofence-editor-emoji`: #189 R18: candados de fuente de ambas pantallas › #189 R18: geofence-editor no pinta emojis.
- `geofence-editor-hex`: #189 R18: candados de fuente de ambas pantallas › #189 R18: geofence-editor no escribe hex.
- `geofence-editor-stylesheet`: #189 R18: candados de fuente de ambas pantallas › #189 R18: geofence-editor no crea StyleSheet.
- `geofences-arbitrary`: #189 R18: candados de fuente de ambas pantallas › #189 R18: geofences no usa clases arbitrarias.
- `geofences-emoji`: #189 R18: candados de fuente de ambas pantallas › #189 R18: geofences no pinta emojis.
- `geofences-hex`: #189 R18: candados de fuente de ambas pantallas › #189 R18: geofences no escribe hex.
- `geofences-stylesheet`: #189 R18: candados de fuente de ambas pantallas › #189 R18: geofences no crea StyleSheet.
- `hero-label-editor`: #189 R18: candados de fuente de ambas pantallas › #189 R18: geofence-editor solo da tamaños propios a Text de React Native.
- `hero-label-zones`: #189 R18: candados de fuente de ambas pantallas › #189 R18: geofences solo da tamaños propios a Text de React Native.
- `icons`: #189 R18: candados de fuente de ambas pantallas › #189 R18: Map, AlertCircle y Trash solo se importan de reicon.

Logs `progress/r18-*-mutation-189.log`. Son 14 sondas: las cuatro prohibiciones comunes se plantan en ambas pantallas; los dos Button.Label numéricos se prueban en sus CTAs reales, y se prueban origen y pantalla de BlurView. El rojo inicial prueba además la combinación de las dos zonas ciegas, con las mutaciones versionadas.


## Bloqueo obligatorio de esta segunda reanudación — universo HeroUI

Después de restaurar todas las mutaciones, `src/__tests__/geofences-canvas-fidelity.test.ts` completo queda verde: **`Tests: 17 passed, 17 total`** (exit 0).

La siguiente guarda de cierre, `src/__tests__/heroui-text-size-merge.test.ts`, completa y sola, da **`Tests: 1 failed, 24 passed, 25 total`**, exit 1. Log: `progress/r18-heroui-text-size-merge-green-189.log` (el nombre del log indica el intento de verde, no su resultado). Falla `#187 R1: el escáner cubre al menos el universo medido (enmendado por #177 R9)`, línea 125: mínimo 199 nodos HeroUI; observa 197. Una medición AST de las siguientes aserciones descubre también className 163 frente al mínimo 166 (aún no alcanzada por Jest).

Se reproduce el universo exacto del escáner y se mide H0 **leyendo del commit 4204530e los 74 TSX de producción**, además del árbol actual:

| Medida del candado | Mínimo actual | H0 4204530e | Árbol correcto de trabajo | Delta |
|---|---:|---:|---:|---:|
| Ficheros con HeroUI | 28 | 30 | 30 | 0 |
| Nodos HeroUI | 199 | 199 | 197 | -2 |
| Nodos Card | 41 | 41 | 41 | 0 |
| Nodos HeroUI/Card con className | 166 | 166 | 163 | -3 |

| Fichero | HeroUI H0→actual | Card H0→actual | className H0→actual |
|---|---:|---:|---:|
| screens/geofences/index.tsx | 7→5 | 1→1 | 6→4 |
| screens/geofence-editor/index.tsx | 14→14 | 3→3 | 10→9 |

Descomposición comprobada en commits:

- **R5.6**: se eliminan Button y Button.Label de la papelera de Zonas al pasar a Pressable/Trash: HeroUI -2 y className -2. En 77bd89a2 (anterior a E1/E2), Zonas ya mide 5/1/4, por lo que este déficit del universo venía de R5; no es un fallo preexistente ajeno a la feature.
- **R10** (`f5ef4230`): Editor añade Label.Text. HeroUI +1 (14→15); className sin delta (la clase sale de Label y entra en Label.Text: 10→10).
- **R13.1** (`d2d3e78d`): Editor sustituye Button.Label de Eliminar por Text. HeroUI -1 (15→14), className -1 (10→9).
- Resultado global: HeroUI `199 - 2 + 1 - 1 = 197`; className `166 - 2 + 0 - 1 = 163`. Ningún otro fichero explica deltas.

**Por qué no se enmienda aquí:** `heroui-text-size-merge.test.ts` está en las suites exigidas por el Cierre, pero **no** en la lista cerrada de ficheros editables del handoff. §4.2 exige que el candado esté ya en esa lista y manda «PARA y reporta» ante «un fichero fuera de la lista». Que el delta esté completamente explicado por R5/R10/R13 no elimina esa condición. No se añade UI falsa ni se cambia la implementación prescrita para satisfacer el contador, y no se toca ese test.

Para reanudar hace falta que el leader amplíe el alcance a ese fichero y cubra los dos pisos de inventario: HeroUI 199→197 y className 166→163, manteniendo los otros pisos y el candado de tamaños sobre HeroUI. Después: aplicar la enmienda autorizada, repetir la guarda completa, confirmar C 17/17, terminar R18 con el verde y ejecutar el Cierre. No se modifica la spec ni se firma ninguna casilla en esta ejecución.

### Estado preciso al detenerse

- HEAD: `0896a843` (rojo R18 versionado con las dos mutaciones reales, según C4).
- Árbol de trabajo: **solo `M mobile-pet-tracker/src/screens/geofences/index.tsx`**, más handoff e informe sin seguimiento. Ese diff **restaura** los dos fragmentos correctos de producción (paleta y Text nativo); conserva exactamente el contenido de Zonas de `de23d7e5`, anterior al rojo R18. No quedan sondas activas.
- La restauración sigue sin commit porque el bloque no ha pasado la guarda global; no se inventa un verde final. C completo 17/17 sobre ese árbol es la evidencia positiva.
- No se ejecutaron typecheck ni lint de R18: la cadena se detuvo antes, en heroui-text-size-merge. Últimos verdes: R17, typecheck exit 0 y lint sin caché exit 0, log vacío.
- No se ejecuta la suite móvil completa de cierre, graphify ni init de cierre. No se actualizan traceability (reservada al commit final), feature_list.json, STATUS.md, current.md ni history.md. No se crea sentinel .done ni PR, no se hace push, smoke Android ni despliegue.
- Incidencia de invocación de la medición H0: el primer `git ls-tree` se lanzó desde mobile con pathspec de raíz y devolvió universo vacío (ceros descartados). Se corrigió con `git -C <raíz>` y una aserción de universo no vacío: 74 TSX, 30/199/41/166. No fue resultado de Jest ni dato de la aplicación.

### Ficheros actuales desde H0 (lista de cierre parcial)

- `docs/ui-guidelines.md`
- `mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts`
- `mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts`
- `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`
- `mobile-pet-tracker/src/__tests__/design-drift.test.ts`
- `mobile-pet-tracker/src/__tests__/geofences-canvas-fidelity.test.ts`
- `mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts`
- `mobile-pet-tracker/src/__tests__/ui-copy-table.ts`
- `mobile-pet-tracker/src/__tests__/ui-language.test.ts`
- `mobile-pet-tracker/src/app/__tests__/layout.test.tsx`
- `mobile-pet-tracker/src/app/_layout.tsx`
- `mobile-pet-tracker/src/i18n/catalog.ts`
- `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`
- `mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx`
- `mobile-pet-tracker/src/screens/geofence-editor/index.tsx`
- `mobile-pet-tracker/src/screens/geofences/index.test.tsx`
- `mobile-pet-tracker/src/screens/geofences/index.tsx`
- `mobile-pet-tracker/src/utils/__tests__/category-palette.test.ts`
- `mobile-pet-tracker/src/utils/category-palette.ts`

Todos pertenecen a la lista autorizada. `heroui-text-size-merge.test.ts` no se ha editado. Handoff y firma E2 permanecen intactos.


### Commits de la segunda reanudación y evidencia por bloque

Las líneas corresponden al árbol de trabajo del bloque al ejecutar su test (la implementación puede seguir sin commit durante TDD); no se afirma que un commit de test aislado esté verde. Los commits anteriores y E1 están registrados en las secciones históricas.

| Commit y mensaje exacto | Línea Tests: de su bloque |
|---|---|
| `b0a94836 test(mobile): #189 E2 recuentos de Button.Label tras R5` | `profile Tests: 1 failed, 25 passed, 26 total; chunky Tests: 74 passed, 74 total (seis suites en sección E2)` |
| `a3a97a60 feat(mobile): #189 R6 render amber zone limit notice (R6)` | `Tests: 87 passed, 87 total` |
| `a74f5566 test(mobile): #189 R7 rojo — lock add-zone CTA states (R7)` | `Tests: 7 failed, 87 passed, 94 total` |
| `27f70466 test(mobile): #189 R7 include HeroUI disabled host class (R7)` | `Tests: 94 passed, 94 total` |
| `7d93a46d feat(mobile): #189 R7 anchor add-zone CTA and show limit state (R7)` | `Tests: 94 passed, 94 total` |
| `10afa5f0 test(mobile): #189 R8 rojo — lock editor content titles (R8)` | `Tests: 11 failed, 68 passed, 79 total` |
| `b6df90b8 test(mobile): #189 R8 inspect ScrollView content children (R8)` | `Tests: 79 passed, 79 total` |
| `80d38dd4 feat(mobile): #189 R8 render editor glass and state titles (R8)` | `Tests: 79 passed, 79 total` |
| `4edd48ad test(mobile): #189 R9 rojo — lock static map sheet and keyboard geometry (R9)` | `Tests: 9 failed, 73 passed, 82 total` |
| `65750505 test(mobile): #189 R9 check consumed keyboard props at source (R9)` | `Tests: 82 passed, 82 total` |
| `f9f42cbe feat(mobile): #189 R9 overlap static form sheet over map (R9)` | `Tests: 82 passed, 82 total` |
| `fbf654fc test(mobile): #189 R10 rojo — lock name field and read-only typography (R10)` | `Tests: 6 failed, 78 passed, 84 total` |
| `f5ef4230 feat(mobile): #189 R10 match canvas name field typography (R10)` | `Tests: 84 passed, 84 total` |
| `f571ee79 test(mobile): #189 R11 rojo — lock radius block and slider endpoints (R11)` | `Tests: 4 failed, 83 passed, 87 total` |
| `f5997745 feat(mobile): #189 R11 group radius controls and shared endpoints (R11)` | `Tests: 87 passed, 87 total` |
| `7cb1a089 test(mobile): #189 R12 rojo — lock active row typography (R12)` | `Tests: 2 failed, 88 passed, 90 total` |
| `fb04857b feat(mobile): #189 R12 match active row label (R12)` | `Tests: 90 passed, 90 total` |
| `4fa40659 test(mobile): #189 R13 rojo — lock editor action row and button states (R13)` | `Tests: 21 failed, 79 passed, 100 total` |
| `d2d3e78d feat(mobile): #189 R13 arrange editor actions and disabled save recipe (R13)` | `Tests: 100 passed, 100 total` |
| `7e97c547 test(mobile): #189 R14 rojo — lock state screen canvas metrics (R14)` | `Tests: 6 failed, 99 passed, 105 total` |
| `e4dc03c3 feat(mobile): #189 R14 align state screen spacing with canvas (R14)` | `Tests: 105 passed, 105 total` |
| `aaf229f9 test(mobile): #189 R16 rojo — lock charter geofence exceptions (R16)` | `Tests: 4 failed, 4 total` |
| `644472be feat(mobile): #189 R16 document approved geofence canvas exceptions (R16)` | `Tests: 4 passed, 4 total` |
| `44c1e6da test(mobile): #189 R17 rojo — verify owner controls by production mutation (R17)` | `Tests: 1 failed, 93 skipped, 94 total` |
| `de23d7e5 feat(mobile): #189 R17 restore owner gate and verify unchanged behavior (R17)` | `F Tests: 94 passed, 94 total; E Tests: 105 passed, 105 total` |
| `0896a843 test(mobile): #189 R18 rojo — prove source guards with production mutations (R18)` | `Tests: 2 failed, 15 passed, 17 total (mutaciones versionadas)` |

Tras el último rojo versionado, con la restauración todavía sin commit: C `Tests: 17 passed, 17 total`; heroui-text-size-merge `Tests: 1 failed, 24 passed, 25 total`. Este último resultado determina la parada y queda sin resolver por la restricción de alcance.

## Enmienda E3 — tercera reanudación (2026-10-21)

- H0 de esta reanudación: `162f151bfc7b501c8bce774159aa069f2ec074c9`, firma humana E3 presente en HEAD; casilla firmada comprobada (1). Base del diff final: `4204530e`.
- Identidad confirmada: `/home/claude/sites/Pet-Tracker-wt-189`, branch `feature/189-mobile-geofences-canvas-fidelity`. Árbol inicial: solo restauración R18 de `screens/geofences/index.tsx`, handoff e informe sin seguimiento. La consulta literal de pwd/branch se ejecutó después de las lecturas iniciales del handoff y git status/log; no fue el primer comando de esta reanudación.
- Lista cerrada ampliada por §4.3 únicamente con `heroui-text-size-merge.test.ts` y `alert-detail-canvas-fidelity.test.ts`. Sin merge, init, PR, push ni bookkeeping del leader en esta reanudación.
- El init accidental de la segunda reanudación queda documentado en «Desviación de arranque»: se lanzó por AGENTS.md, se detuvo con SIGTERM (143) y no se vuelve a ejecutar. El Cierre aquí omite init por la prohibición expresa del humano y del handoff.
- Skills recargadas: `ponytail`, `appllama-app-design-skill`, `animate-expo`, `building-native-ui`, `expo-tailwind-setup`; no se buscan las cinco ausentes nombradas en el handoff. Se consulta de nuevo la documentación versionada de Expo 57 exigida por AGENTS.md móvil. Se conservan spec/carta sobre las recomendaciones genéricas y el smoke Android queda al humano.
- Incidencia de invocación de lectura: `python` no existe; no llegó a leer feature_list.json ni a ejecutar pruebas. Se consultó con Node y se verificó #189 `in_progress`. Sin cambios de aplicación por esa incidencia.

| Candado E3 | Antes → después | Delta medido desde 4204530e | R |
|---|---|---|---|
| HeroUI, piso de nodos | 199 → 197 | Zonas -2; Editor +1 -1 = 0 | R5.6/R10/R13.1 |
| HeroUI/Card, piso con className | 166 → 163 | Zonas -2; Editor 0 -1 = -1 | R5.6/R10/R13.1 |
| Ficheros con HeroUI / nodos Card | pisos 28 / 41 intactos | observados 30 / 41, sin delta | — |
| Inventario expo-blur | 2 → 3 ficheros | +screens/geofence-editor/index.tsx; barra y detalle intactos | R8/R9 |

Commit `75c6bb6f test(mobile): #189 E3 pisos HeroUI y expo-blur del Editor`: solo los dos candados autorizados. El candado que prohíbe text-NN sobre HeroUI/Card no se modifica. Verdes completos, cada suite sola: heroui `Tests: 25 passed, 25 total`; alert-detail `Tests: 20 passed, 20 total`; geofences C `Tests: 17 passed, 17 total`. Logs `progress/e3-{heroui,alert-detail,geofences}-189.log`, exit 0.

HEAD intermedio `0896a843` contiene las dos mutaciones de producción plantadas para probar el rojo R18 (C4). El commit verde restaura exactamente los dos fragmentos de Zonas ya correctos en `de23d7e5`: categoría desde la paleta y Text nativo en el CTA; no queda ninguna sonda activa.

### Restauración R18 y cierre automatizado tras E3

- `cd26b658 feat(mobile): #189 R18 restore compliant zone sources (R18)` — C `Tests: 17 passed, 17 total` (mismo árbol correcto probado antes del commit); después, suite completa `Tests: 4398 passed, 4398 total`, exit 0.
- `bun run test` completo: `Test Suites: 131 passed, 131 total`; `Tests: 4398 passed, 4398 total`; `Snapshots: 1 passed, 1 total`; `Time: 119.012 s`. Base T0 4297 + 101 casos de esta feature = 4398; E3 y el verde R18 no añaden ni borran tests. Home pasa; no se reproduce su fallo previo.
- Guardas de Cierre, todas PASS dentro de esa corrida completa: design-drift, consistency-classnames, legibility-classnames, heroui-text-size-merge, chunky-cta-canvas-fidelity, profile-canvas-fidelity, ui-language y language-provider. También PASS alerts-canvas-fidelity (E1), alert-detail-canvas-fidelity (E3) y geofences-canvas-fidelity (R16/R18). No se necesita repetirlas para atribuir el verde del mismo árbol.
- Log completo: `progress/closure-test-189.log`. Jest emite al final el aviso «A worker process has failed to exit gracefully and has been force exited». No hay test fallido ni exit distinto de 0; no se atribuye una causa ni se afirma haber resuelto ese aviso de teardown.

### Medidas de cierre — M1-M9 y requirements §4/§4.1/§4.2/§4.3

Medición de fuentes de producción de `4204530e` frente al árbol final restaurado, por contenido; script temporal fuera del repositorio. Evidencia: `progress/closure-measures-189.log` y `progress/closure-neutral-measures-189.log`. En el inventario HeroUI se reutiliza exactamente el escáner AST del test; universo de 74 TSX tanto en H0 como al cerrar. No se cuentan tests como producción.

| Medida | Base H0 + delta = cierre |
|---|---|
| M1, líneas Zonas (informativo) | 166 + 29 = 195 |
| M2, líneas import reicon Zonas / Editor | 0 + 1 = 1 / 0 + 0 = 0 |
| M3, líneas category-palette Zonas | 0 + 1 = 1 |
| M4, líneas con HomeEntrance Zonas | 0 + 5 = 5 (import, dos aperturas y dos cierres) |
| M5, líneas con BlurView Editor | 0 + 5 = 5 (import y dos píldoras) |
| M6, rounded-16 Zonas / Editor | 1 + 1 = 2 / 1 + 2 = 3 |
| M7, líneas chunkyLip Zonas / Editor | 2 + 0 = 2 / 2 + 1 = 3 |
| M8, filas R14_GEOFENCES / R15_GEOFENCE_EDITOR | 20 + 2 = 22 / 27 + 4 = 31 |
| M9, títulos nativos traducidos de ambas pantallas | 2 - 2 = 0; ambos title: '' |

| Candado | Base + delta = cierre | Origen y conservación |
|---|---|---|
| chunky y design-drift, rounded-16 global | 27 + 1 + 2 = 30 | Zonas 1→2 (R7); Editor 1→3 (R13); restantes ficheros intactos |
| CTA_ROWS geofences-add / geofence-editor-save | una ancla primaria por fichero, antes y después | mt-auto / flex-2; isDisabled y onPress intactos; ternarios y ambas recetas comprobados en fuente y árbol |
| NEUTRAL_ROWS / neutralInventory | 6 + 1 = 7 filas / 9 + 1 = 10 ids | +geofence-editor-delete, outline/Text/text-base font-extrabold text-danger (R13) |
| excluded destructivos sin labio | 5 - 1 = 4 ids | sale solo geofence-editor-delete; device-unpair, reminders-delete-confirm, profile-sign-out y lost-mode-button intactos |
| design-drift, consumidores rounded-14 | 5 + 1 = 6 ficheros | +screens/geofences/index.tsx (R5), antes de meal-schedule |
| profile, consumidores rounded-tile | 5 + 1 = 6 ficheros | +screens/geofences/index.tsx (R6), entre add-reminder y home |
| profile, consumidores rounded-hero | 3 + 0 = 3 | components/card, screens/alert-detail y screens/profile; rounded-t-hero no casa, no se enmienda |
| consistency, style={CONTINUOUS_CORNER} global | 38 + 3 = 41 | Zonas 0→3 (tile, papelera, aviso); Editor directo 0→0, uso combinado adicional R9 fijado por candado propio y árbol |
| Referencias CONTINUOUS_CORNER Zonas / Editor | 0 + 4 = 4 / 0 + 2 = 2 | incluye imports; en Editor el estilo combina esquina y flexGrow/flexShrink |
| TABULAR_NUMS directo global | 34 + 0 = 34 | Zonas 0→0, Editor 1→1 |
| Catálogo EN / ES | 436 + 5 = 441 / 436 + 5 = 441 | cinco filas de copy exacta; tablas de uso 22/31 (M8) |
| legibility, text-xs / text-11 de producción | 58 + 1 = 59 / 4 + 2 = 6 menciones | Zonas suma text-xs; Editor suma dos extremos text-11; legibility no inventaría estas clases, sus 27 casos y cifras se conservan sin editarlo |
| E1 profile text-26 | 6 + 2 = 8 consumidores | +Editor y Zonas, orden alfabético (R8/R1) |
| E1 profile text-13 | 14 + 1 = 15 consumidores | +Zonas (R6) |
| E1 alerts text-15 | 13 + 1 = 14 consumidores | +Editor (R12) |
| E1 alerts tracking-title | 10 + 2 = 12 consumidores | +Editor y Zonas (R8/R1) |
| E1 consistency y residual E2 chunky, border-lip-gray | 10 + 1 = 11 menciones | solo Editor 0→1 (R13); Zonas 0→0 |
| E2 aperturas Button.Label | 19 - 1 - 1 = 17 | Zonas 2→1 (R5), Editor 2→1 (R13) |
| E2 menciones Button.Label | 50 - 2 - 2 = 46 | Zonas 4→2, Editor 4→2 |
| E2 text-17 | 24 + 1 + 1 = 26 | etiquetas condicionales R7/R13: 1→2 por pantalla |
| E2 Text literal acento | 17 - 1 - 1 = 15 | 1→0 por pantalla al usar ternarios |
| E2 text-17 foreground / Text bold accent-strong | 6 + 0 = 6 / 1 + 0 = 1 | sin delta en las dos pantallas |
| Residual E2 estilo primario literal / semántico | 17 - 2 = 15 / 17 + 0 = 17 | ambos estilos condicionales reconocidos exactamente; uno primario por pantalla |
| E3 HeroUI / className | 199 - 2 + 1 - 1 = 197 / 166 - 2 + 0 - 1 = 163 | Zonas 7→5 HeroUI y 6→4 className; Editor 14→14 y 10→9 |
| E3 ficheros HeroUI / Card | 30 + 0 = 30 / 41 + 0 = 41 | pisos 28/41 intactos; 0 findings de text-NN sobre HeroUI/Card |
| E3 expo-blur | 2 + 1 = 3 ficheros | +Editor, tras alert-detail; barra y detalle intactos |

GEOFENCE_MAX_PER_PET sigue siendo 5. El bloque de teclado conserva su única aserción `paddingBottom: 291` y la regresión pasa en el Editor. Las pruebas previas de rol, busy, 401, confirmación, navegación, mapa y radio permanecen verdes; R17 documenta además su comparación AST contra H0. No se cambia código compartido para cuadrar contadores.

### Lista residual E2 actualizada tras E3

| Candado | Antes → después | Delta por fichero contra 4204530e | R y evidencia |
|---|---|---|---|
| chunky #177 R7.5, estilo primario | 17 literales → 15; 17 primarios semánticos | Zonas 1→0 literal y Editor 1→0 literal; cada uno conserva un primario condicional | R7/R13; sondas de receta y style documentadas arriba |
| chunky #177 R8.1, ids con primario | 17 ids literales → 15; 17 ids reconocidos tras enmienda | geofences-add y geofence-editor-save pasan al ternario exacto | R7/R13; sondas de style documentadas arriba |
| chunky #177 R7.1, border-lip-gray | 10 → 11 | Editor 0→1; resto sin delta | R13; quitar borde da rojo |
| consistency #166 R3, inventario neutro | 9 → 10 ids | solo +geofence-editor-delete | R13; guarda completa y sonda de borde documentadas arriba |

E3 no añade enmiendas residuales: sus dos ficheros y deltas son autorización explícita de §4.3. Las restantes filas de clase/etiqueta pertenecen a §4, E1 o E2 explícitas. Ninguna excepción residual cambia copy, isDisabled, onPress ni 401.

### Ficheros finales desde H0 y control de alcance

`git diff --name-only 4204530e..HEAD -- mobile-pet-tracker/ docs/` devuelve estos 21 ficheros; todos pertenecen a la lista cerrada original ampliada por E1/E3:

- `docs/ui-guidelines.md`
- `mobile-pet-tracker/src/__tests__/alert-detail-canvas-fidelity.test.ts`
- `mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts`
- `mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts`
- `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`
- `mobile-pet-tracker/src/__tests__/design-drift.test.ts`
- `mobile-pet-tracker/src/__tests__/geofences-canvas-fidelity.test.ts`
- `mobile-pet-tracker/src/__tests__/heroui-text-size-merge.test.ts`
- `mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts`
- `mobile-pet-tracker/src/__tests__/ui-copy-table.ts`
- `mobile-pet-tracker/src/__tests__/ui-language.test.ts`
- `mobile-pet-tracker/src/app/__tests__/layout.test.tsx`
- `mobile-pet-tracker/src/app/_layout.tsx`
- `mobile-pet-tracker/src/i18n/catalog.ts`
- `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`
- `mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx`
- `mobile-pet-tracker/src/screens/geofence-editor/index.tsx`
- `mobile-pet-tracker/src/screens/geofences/index.test.tsx`
- `mobile-pet-tracker/src/screens/geofences/index.tsx`
- `mobile-pet-tracker/src/utils/__tests__/category-palette.test.ts`
- `mobile-pet-tracker/src/utils/category-palette.ts`

No se modifica legibility-classnames ni docs/conventions porque sus guardas no exigen cambios. El diff de _layout.tsx se limita a los dos title; no se tocan rutas, componentes compartidos, tokens, dependencias ni backend. Specs/progress se excluyen de esta orden conforme al handoff. El único cambio de spec de esta reanudación será traceability.md en el commit documental final; requirements y sus casillas quedan intactos.

### Cierre final de la tercera reanudación

- Typecheck: `test ! -e .expo/types/router.d.ts` satisfecho inmediatamente antes de `bun run typecheck`; exit 0. Log `progress/closure-typecheck-189.log` (`$ tsc --noEmit`, sin errores). No se genera ni borra router.d.ts.
- Lint: `bunx expo lint --no-cache > ../progress/lint-189.log 2>&1 && test ! -s ../progress/lint-189.log`; exit 0; log de 0 bytes.
- `graphify update .` en el worktree: exit 0, extracción AST sin LLM de 2358 ficheros; grafo actualizado con 27385 nodos, 35408 aristas y 1821 comunidades. Artefactos en graphify-out/ (ignorados). Aviso: 20 SQL no contribuyen al grafo por faltar tree_sitter_sql. Se conserva esa limitación sin instalar dependencias. Log `progress/graphify-189.log`.
- Medidas repetidas tras el último verde global: coinciden con las tablas de cierre. Los tres ficheros de código/tests cambiados desde la firma E3 son exactamente heroui-text-size-merge.test.ts, alert-detail-canvas-fidelity.test.ts y screens/geofences/index.tsx.
- Traceability contiene las 18 filas completas, tests, hashes y mensajes; documenta los rojos de mutación de R17/R18 y E1/E2/E3. No hay filas pendientes. Commit documental final: `docs(geofences): record E3 closure and R1-R18 traceability`, solo traceability.md y este informe. Las líneas Tests: de los commits de código/tests de esta reanudación constan en E3 y en restauración R18; el commit documental no cambia código ni tests.
- No se modifica feature_list.json, STATUS.md, current.md, history.md ni el handoff. No se ejecuta init.sh en esta tercera reanudación, no se publica PR, no se hace push/merge ni smoke Android. La revisión, el init y el bookkeeping del leader quedan fuera de este handoff.
- El árbol se comprueba limpio con `git status --short -- mobile-pet-tracker/ specs/ docs/` tras el commit final. Handoff sin seguimiento y logs ignorados se conservan como exige el leader. El sentinel ignorado progress/impl_mobile-geofences-canvas-fidelity.done se crea como última acción, con una sola línea que apunta a este informe.

## Enmienda E4 — cuarta reanudación (2026-10-22)

**Estado: PARADA antes de implementar, por contradicción entre el candado R19.2 y el orden rojo → verde firmado.** Esta sección describe la cuarta reanudación; el cierre técnico de la cabecera del informe corresponde exclusivamente a R1-R18/E3.

### Identidad, gate y árbol inicial

Primeras órdenes efectivas, antes de lecturas o escrituras:

```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-189
$ git branch --show-current
feature/189-mobile-geofences-canvas-fidelity
$ grep -c '^- \[[xX]\] Enmienda E4' specs/mobile-geofences-canvas-fidelity/requirements.md
1
```

- H0-E4: `cc175325` (`Approve E4 geofences fidelity amendment`), presente en el historial del HEAD inicial `9daf2703` (`chore(harness): #189 registra el estado de E4 en current.md`), expresamente permitido por el humano. H0 original del diff: `4204530e`.
- Árbol inicial conforme: únicamente los cuatro ficheros sin seguimiento de progress indicados en el handoff (`explore_189-smoke-hallazgos.md`, `handoff_mobile-geofences-canvas-fidelity.md`, `review_mobile-geofences-canvas-fidelity.md`, `spec_189-E4.md`).
- Se leyó la CUARTA REANUDACIÓN, requirements §4.4, design/tasks E4 y el informe anterior. La primera extracción con `sed` de §4.4 no devolvió texto porque el encabezado incluye `§`; se corrigió la lectura por contenido antes de cualquier escritura. Las decisiones DE4-1..DE4-5 conservan los valores por defecto cerrados por la firma.
- Mocks verificados contra fuente: Editor línea 30, `jest.mock('expo-router', () => ({ router: { back: jest.fn() } }));`; Zonas línea 35, equivalente con `push`. Ambos sin `Stack`; no se han modificado.

### Medidas H0-E4

Medición por contenido en el árbol inicial, con Node sobre las fuentes. M11 cuenta ocurrencias (el `grep -o … | wc -l` de requirements), no solo líneas. Todas las bases coinciden con §4.4; al parar no hay delta de producción.

| Medida | Base medida | Delta de esta reanudación | Actual |
|---|---|---|---|
| M10, isDisabled Zonas / Editor | 2 / 3 | 0 / 0 | 2 / 3 |
| M11, KEEP_OPACITY Zonas / Editor / native-styles | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 |
| M12, HeaderHeightContext Editor | 2 | 0 | 2 |
| M13, offset headerHeight / offset 0 | 1 / 0 | 0 / 0 | 1 / 0 |
| M14, contentInsetAdjustmentBehavior Zonas / Editor | 1 / 1 | 0 / 0 | 1 / 1 |
| M15, Stack.Screen Editor / Zonas | 0 / 0 | 0 / 0 | 0 / 0 |
| M16, header-layout.ts | no existe | sin cambio | no existe |
| M17, TRANSPARENT_HEADER_OPTIONS layout / Editor | 0 / 0 | 0 / 0 | 0 / 0 |
| M18, títulos nativos traducidos | 0 | 0 | 0 |
| M19, chunkyLip Zonas / Editor / design-drift | 2 / 3 / 0 | 0 / 0 / 0 | 2 / 3 / 0 |
| export const en native-styles | 2 | 0 | 2 |

No se presentan estas bases como medidas de cierre: los valores finales de E4 todavía no están implementados.

### Bloqueo medido: R19 exige el cambio reservado a R20

`requirements.md` §4.4, líneas 664-669, exige para el candado C de **R19.1/R19.2** que **toda** etiqueta de apertura de `Switch`/`Button` con `isDisabled=` lleve `KEEP_OPACITY`; fija dos etiquetas en Zonas y tres en el Editor, sin excepción de transición.

El orden firmado del mismo fichero, líneas 932-935, y tasks E4 separan:

1. R19: constante, los dos Switch, Eliminar y Guardar del Editor; enmiendas chunky del lado del Editor.
2. R20: Añadir zona; enmiendas chunky del lado de Zonas.

El handoff exige además que un bloque no empiece hasta que el anterior esté verde. Un barrido AST de las etiquetas actuales confirma exactamente el universo del candado:

| Pantalla y línea | Etiqueta con isDisabled | KEEP_OPACITY actual | Cambio asignado |
|---|---|---|---|
| Zonas:136 | Switch geofence-<id>-active | ausente | R19 |
| Zonas:183 | Button geofences-add | ausente | R20 |
| Editor:192 | Switch geofence-editor-active | ausente | R19 |
| Editor:198 | Button geofence-editor-delete | ausente | R19 |
| Editor:201 | Button geofence-editor-save | ausente | R19 |

Tras los cuatro cambios de elementos autorizados en R19, su candado universal seguiría encontrando `geofences-add` sin `KEEP_OPACITY`: Zonas tendría **1/2** etiquetas conformes y el Editor **3/3**. Por tanto R19 no puede quedar verde antes de R20. Adelantar el cambio de Añadir a R19, exceptuarlo en el barrido, aplazar parte del candado o aceptar una suite roja entre requisitos modificaría el contrato firmado; no se ha aplicado ninguna de esas alternativas.

Se cumple la instrucción expresa del humano: «si […] algo no cuadra con la spec, PARA y reporta; no improvises». Hace falta que el leader concilie por escrito la incorporación del barrido universal con el orden R19 → R20 antes de reanudar. No se ha cambiado la spec ni ninguna casilla.

### Skills, verificaciones y alcance al parar

- Cargadas: `ponytail`, `appllama-app-design-skill` del repo, `building-native-ui` y `expo-tailwind-setup` del cache Expo (`/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/`). Ninguna de las tres skills solicitadas quedó sin encontrar. Se aplican los valores de spec/carta sobre las recomendaciones genéricas; no se instala NativeWind ni se cambia Uniwind.
- No cargadas ni buscadas, por instrucción: `expo-router`, `expo-overview`, `expo-animation`, `expo-design-system`. `animate-expo` no se recarga: E4 no cambia movimiento. El smoke Android queda al humano; no se invoca el MCP de Appllama.
- Consultada la documentación versionada exigida por mobile-pet-tracker/AGENTS.md: https://docs.expo.dev/versions/v57.0.0/.
- Commits E4: ninguno. No se inició R23 ni se plantó un rojo después de detectar el conflicto. No hay líneas `Tests:` nuevas: no se ejecutaron Jest, typecheck ni lint; tampoco graphify ni init.sh. La base de 131 suites / 4398 tests procede del leader, no de una corrida propia de esta reanudación.
- Sondas P-E4-1, P-E4-2, P-E4-3, P-E4-4, P-E4-5, P-E4-6, P-E4-7, P-E4-8, P-E4-9, P-E4-10, P-E4-11, P-E4-12 y P-E4-13: **no ejecutadas**, por parada previa a la implementación de sus candados. No se afirma que estén verificadas ni que E4 esté cerrada.
- Candados agregados enmendados: ninguno. consistency-classnames, design-drift y heroui-text-size-merge no se editaron ni ejecutaron. No hubo denegaciones del sandbox.
- Única edición versionada de esta reanudación: esta sección del informe. Producción, tests, docs de UI, traceability, feature_list, STATUS, current, history y handoff permanecen intactos. No se hace push, PR, merge ni commit documental de cierre con trazabilidad incompleta.
- El sentinel ignorado `.done` se recrea como última acción con la ruta de este informe; señala la finalización de esta ejecución con **bloqueo**, no la finalización de E4.

### Reanudación tras el concilio

Inicio 2026-10-22. Primeras órdenes: `pwd` → `/home/claude/sites/Pet-Tracker-wt-189`; `git branch --show-current` → `feature/189-mobile-geofences-canvas-fidelity`. Gate E4 = 1; H0-E4 sigue siendo la firma `cc175325`, HEAD de esta reanudación `a07a740c` (aclaración de tasks). Árbol inicial conforme: solo este informe modificado y los cuatro progress sin seguimiento del leader. Se conserva íntegra la parada anterior.

Se leyó QUINTA REANUDACIÓN y la nota entre R19/R20: R23 rojo/verde, R19 rojo, R20 rojo, un verde conjunto R19 R20, luego R21/R22/R24. Las skills ya cargadas siguen vigentes: ponytail, building-native-ui, expo-tailwind-setup y appllama-app-design-skill; las cuatro ausentes prohibidas no se buscan. Sin init.sh, push, PR ni edición de casillas o bookkeeping del leader. Medidas H0-E4 y mocks: mismas bases documentadas arriba, sin cambios de producción entre ambas reanudaciones.

#### R23 — constantes (primer ciclo tras el concilio)

- Rojo `7e47e13a test(mobile): #189 E4 R23 rojo — lock shared header geometry`: módulo header-layout ausente, `Tests: 0 total`, suite fallida por resolución, exactamente el rojo previsto en tasks. Log e4-r23-red.log.
- Verde `180594ec feat(mobile): #189 E4 R23 centralize header geometry`: seis export const, ventana independiente [34,50]/[62,78], alturas 56/44 y fila 6; `Tests: 21 passed, 21 total`, log e4-r23-green.log. Son 4 casos nuevos (dos instancias de barrido de literales incluidas).
- Typecheck precedido de `test ! -e .expo/types/router.d.ts`: exit 0 (e4-r23-typecheck.log). Lint sin caché: exit 0, lint-189.log vacío. El commit verde se creó mientras el proceso de lint seguía activo; se esperó y verificó su exit 0 antes de continuar el siguiente bloque. No se altera el resultado ni se afirma que ya hubiese acabado al commitear.
- Incidencia de lectura: se intentó leer jest.config.*; no existe porque Jest está configurado en package.json. Se corrigió consultando package.json; no ejecutó tests ni cambió archivos.

#### R19 y R20 — rojos separados, verde conjunto autorizado

Rojo R19 `297b9f4b test(mobile): #189 E4 R19 rojo — lock opacity while controls are disabled`, solo cuatro ficheros de tests. C `Tests: 3 failed, 21 passed, 24 total`; F `Tests: 1 failed, 94 passed, 95 total`; E `Tests: 4 failed, 105 passed, 109 total`; chunky `Tests: 4 failed, 72 passed, 76 total`. Fallan las aserciones de opacidad/fuente y las formas nuevas del Editor; sin ReferenceError de helpers. Logs e4-r19-red-{c,f,e,chunky}.log. El barrido C conserva las cinco etiquetas y se deja rojo hasta el verde conjunto, conforme al concilio.

Rojo R20 `eace0652 test(mobile): #189 E4 R20 rojo — lock add-zone opacity and disabled recipe`, solo F y chunky. F `Tests: 9 failed, 87 passed, 96 total` (incluye el rojo previo de R19); chunky `Tests: 5 failed, 71 passed, 76 total` (incluye los cuatro previos). Logs e4-r20-red-{f,chunky}.log. La frase falsa de R7.2 ya está corregida en requirements §3 por el leader (líneas 253-256, enmendado por E4 R20); se conserva y no se edita requirements fuera de la lista cerrada. Los títulos de pruebas de la CTA y sus aserciones ya expresan el cancelador del atenuado.

#### Nueva parada: igualdad exacta del estilo anfitrión de Button (R20.1)

**Estado de esta reanudación: PARADA antes del verde conjunto R19 R20.** Se implementaron sin commitear los literales de producción prescritos por R19/R20: KEEP_OPACITY en native-styles, ambos Switch y los estilos de Eliminar, Guardar y Añadir. No se ha modificado ninguna prop adicional ni se han eliminado isDisabled, clases o feedback.

Validación del intento de verde, con cada suite completa y sola y guardas de procesos vacías:

- C: `Tests: 24 passed, 24 total`; log `progress/e4-r19-r20-green-c.log`.
- F: `Tests: 3 failed, 93 passed, 96 total`; log `progress/e4-r19-r20-green-f.log`, exit 1. Los únicos fallos son R7 enmendado en el límite en ES/EN y el nuevo R20.1. R19 sobre los dos Switch y las comprobaciones de busy/opacity de Añadir ya pasan.
- Se detuvo la secuencia al primer resultado inesperado. No se ejecutaron E, chunky ni las tres guardas agregadas sobre este intento de verde; no se presentan como verdes.

La spec exige en R20.1 y en el Test F de R20 que `StyleSheet.flatten(add.props.style)` sea **exactamente** `{ opacity: 1 }`. El literal de producción aplicado es exactamente el exigido:

```tsx
style={atLimit ? KEEP_OPACITY : [chunkyLip.primary, KEEP_OPACITY]}
```

Sin embargo, el Button real de HeroUI compone estilos propios antes de la prop: `node_modules/heroui-native/src/components/button/button.tsx:294` usa `[buttonStyleSheet.buttonRoot, style]`; button.styles.ts define `buttonRoot: { borderCurve: 'continuous' }`. PressableFeedback añade además la transformación de escala. El diff medido por Jest en las tres aserciones es:

```diff
 Object {
+  "borderCurve": "continuous",
   "opacity": 1,
+  "transform": Array [
+    Object {
+      "scale": 1,
+    },
+  ],
 }
```

El estilo aplanado recibido es `{ borderCurve: 'continuous', transform: [{ scale: 1 }], opacity: 1 }`; carece de boxShadow, pero no es el objeto exacto que R20.1 prescribe. No es un ReferenceError ni un fallo del cancelador: la opacidad es 1 y la accesibilidad sigue bloqueada. La excepción documentada para un anfitrión Switch que no expone estilos no cubre esta igualdad exacta de Button. Cambiar a una comparación parcial, filtrar propiedades, sustituir el Button por un mock o alterar la composición de HeroUI relajaría/cambiaría el contrato sin autorización. No se hizo ninguna de esas cosas.

Se para conforme a QUINTA REANUDACIÓN y a la orden del humano de reportar otra contradicción. Hace falta conciliar R20.1/Test F con las propiedades que añade el Button real. No se crea el commit verde conjunto ni se empiezan R21/R22/R24.

#### Medidas y alcance al detener el intento de verde

| Medida | Base + delta = árbol actual (incluye producción sin commit) |
|---|---|
| M10, isDisabled Zonas / Editor | 2 + 0 = 2 / 3 + 0 = 3 |
| M11, KEEP_OPACITY Zonas / Editor / native-styles | 0 + 4 = 4 / 0 + 5 = 5 / 0 + 1 = 1 |
| M12, HeaderHeightContext Editor | 2 + 0 = 2 (R22 no iniciado) |
| M13, offset headerHeight / offset 0 | 1 + 0 = 1 / 0 + 0 = 0 |
| M14, ajuste de inset Zonas / Editor | 1 + 0 = 1 / 1 + 0 = 1 |
| M15, Stack.Screen Editor / Zonas | 0 + 0 = 0 / 0 + 0 = 0 |
| M16, header-layout.ts | ausente → presente, 6 export const (R23) |
| M17, TRANSPARENT_HEADER_OPTIONS layout / Editor | 0 + 0 = 0 / 0 + 0 = 0 |
| M18, títulos nativos traducidos | 0 + 0 = 0 |
| M19, chunkyLip Zonas / Editor / design-drift | 2 + 0 = 2 / 3 + 0 = 3 / 0 + 0 = 0 |
| export const native-styles | 2 + 1 = 3 |

Chunky se enmienda solo en los rojos de R19 y R20: R3.1 reconoce el ternario con KEEP_OPACITY para cada fila; R4.1 reconoce el array neutro solo para Eliminar del Editor; R7.5/R8.1 amplían el reconocimiento de los nuevos estilos sin cambiar los recuentos/ids esperados (un primario en cada pantalla y un neutro del Editor). La validación posterior quedó detenida antes de ejecutar chunky; no se afirma un cierre agregado. R16.1 y la carta todavía no se modifican.

`git diff --name-only a07a740c -- mobile-pet-tracker/ docs/` muestra ocho ficheros, todos de la lista cerrada E4: chunky-cta-canvas-fidelity.test.ts, geofences-canvas-fidelity.test.ts, los dos tests de pantalla, las dos pantallas, header-layout.ts y native-styles.ts. Desde el último commit rojo `eace0652` quedan modificados **solo** los tres ficheros de producción de R19/R20 y este informe; se conservan los cuatro progress sin seguimiento del leader.

Sondas P-E4-1..13: **ninguna ejecutada en esta reanudación**, al detenerse antes del verde conjunto. No se confunde un test rojo por ausencia de implementación con una sonda de mutación. R23 queda verde, pero sus subsondas de P-E4-8 también quedan pendientes. R19/R20 tienen sus dos rojos versionados y producción sin commit; R21/R22/R24 sin iniciar. No se marca E4 cerrada ni se rellena traceability con un verde inexistente.

No se ejecutó suite completa, typecheck posterior al intento conjunto, lint posterior, graphify ni smoke. Typecheck/lint R23 constan arriba. Sin init.sh, denegaciones del sandbox, casillas, cambios en los tres candados agregados protegidos, bookkeeping, push, PR o merge. El .done se recrea como última acción y apunta a este informe de **ejecución detenida**, no de feature terminada.

#### E5 — sexta reanudación (2026-10-22)

HEAD inicial `ae69eee5` (firma humana E5), gate E4 = 1 y E5 = 1, branch y cwd conformes. Leída SEXTA REANUDACIÓN, requirements §4.5, tasks E5 y E4; manda sobre las paradas anteriores. El informe preserva esas paradas como historia, no como estado de esta ejecución. Skills cargadas: ponytail, building-native-ui, expo-tailwind-setup y appllama-app-design-skill (las cuatro encontradas); se consultó https://docs.expo.dev/versions/v57.0.0/ conforme al AGENTS móvil. Los valores de carta/spec prevalecen sobre las sugerencias de las skills; smoke Android al humano y sin MCP Appllama conforme al handoff.

Producción preservada mediante `git diff` en `progress/e5-prod.patch`, sin stash; después `git checkout HEAD --` solo los tres ficheros indicados. Numstat previo: Editor +4/-4, Zonas +3/-2, native-styles +3/-0 (10 inserciones, 6 borrados). Se corrigen exclusivamente las tres igualdades de §4.5, conservando cierre de claves y el resto de aserciones.

- R20 rojo-corrección `3a786a89`: `Tests: 9 failed, 87 passed, 96 total` (e5-r20-red.log), suite completa y sola. Los tres casos de igualdad corregidos reciben `{ borderCurve: 'continuous', transform: [{ scale: 1 }] }`; el diff es únicamente `- opacity: 1` respecto al esperado. Los demás rojos son R19/R20 por el mismo cancelador ausente. Sin fallo por claves de heroui.
- R19 rojo-corrección `f3aa4094`: `Tests: 4 failed, 105 passed, 109 total` (e5-r19-red.log), suite completa y sola. Guardar vacío recibe las dos claves de heroui correctas y falta únicamente `opacity: 1`; los tres escenarios busy fallan también por `opacity` indefinida.
- Se restauró `progress/e5-prod.patch` con `git apply`; numstat idéntico al previo: Editor +4/-4, Zonas +3/-2, native-styles +3/-0. `git diff --check` verde. El patch se conserva sin seguimiento; no se usó stash.
- Validación del verde conjunto antes de la nueva parada: C `Tests: 24 passed, 24 total` (e5-r19-r20-green-c.log); F `Tests: 96 passed, 96 total` (e5-r19-r20-green-f.log). Ambas suites completas, solas, precedidas por las dos guardas pgrep vacías. No se ejecutaron E/chunky/guardas agregadas en esta validación; no se crea el commit verde conjunto con validación incompleta.

#### Nueva parada — ancla de test de R21 (L) distinta del fichero

**Estado actual: PARADA por discrepancia de ancla de la spec, detectada durante la lectura de R21 antes de editarlo.** Se conserva el verde conjunto R19/R20 sin commit y pendiente de completar su validación.

requirements.md §4.4 R21 Test (L), líneas 727-734, y CUARTA REANUDACIÓN prescriben enmendar el `it` «declara pets/[petId]/geofences como undécimo hijo y no singular» y afirman que **su** `toEqual` de opciones cambia de la cabecera opaca a la transparente.

Medida contra `src/app/__tests__/layout.test.tsx`:

- Líneas 458-470: ese `it` existe (sufijo previo de R1.1), pero su único `toEqual` compara `[detail.type, detail.props.name, detail.props.dangerouslySingular]` con `[Stack.Screen, 'pets/[petId]/geofences', undefined]`. No contiene aserción de opciones.
- Líneas 472-487: otro `it`, «le da la cabecera nativa de #95 R4 con el título de zonas seguras», es el que contiene el `toEqual` de opciones de la base que cita R21 (líneas 479-486).

El nombre/ancla de test y la aserción citados por la spec no pertenecen al mismo `it`. Se cumple la regla expresa «si una cifra o ancla no coincide, PARA» y la orden de esta sexta reanudación «Ante otra contradicción, PARA y repórtala sin relajar ninguna aserción». No se cambia por iniciativa propia el test objetivo, no se traslada ni duplica su aserción y no se altera ninguna de las dos expectativas existentes. Hace falta conciliar el nombre del `it` a enmendar en R21 (L) con el fichero real, preservando la comprobación de posición/singularidad y la igualdad exacta de opciones solicitada.

R21, R22 y R24 sin iniciar; sondas P-E4-1..13 sin ejecutar. No se presenta E4 como cerrada. Traceability permanece intacta, sin un verde conjunto inexistente. No se ejecutó suite global, typecheck, lint, graphify ni smoke durante esta sexta reanudación; tampoco init.sh, push, PR, casillas ni bookkeeping. No hubo denegaciones de sandbox. El sentinel `.done` se recrea como última acción para señalar fin de esta ejecución detenida, no cierre de E4.

#### Séptima reanudación — aclaración de R21 (L), 2026-10-22

Inicio en HEAD `31b7a082`, cwd y branch conformes. SÉPTIMA REANUDACIÓN y tasks §R21 resuelven el ancla anterior: se enmienda únicamente el `it` de opciones «le da la cabecera nativa de #95 R4 con el título de zonas seguras»; el de undécimo hijo y los del Editor permanecen intactos. Estado inicial conservado: tres ficheros de producción R19/R20 e informe modificados, patch E5 y cinco documentos del leader sin seguimiento. Las cuatro skills ya leídas siguen aplicadas: building-native-ui, expo-tailwind-setup, appllama-app-design-skill y ponytail; ninguna solicitada ausente. Sin init.sh/push/PR/casillas/bookkeeping. Se completan primero las verificaciones pendientes del verde conjunto; C/F ya constan arriba y no se han modificado desde entonces.

Incidencia de invocación previa a Jest y sin ficheros tocados: se intentó añadir esta nota a progress/ desde el cwd móvil, donde la ruta no existe; además el pgrep coincidió con el texto de esa misma nota incluido en el comando de shell. Se separa la escritura desde la raíz de la invocación de guardas/Jest. No arrancó Jest ni hubo fallo de código.

#### Nueva parada — consistency-classnames exige el import anterior a R19

**Estado actual: PARADA en la validación restante del verde conjunto R19/R20. No se crea el commit verde.** La aclaración de R21 ya está aceptada y no es el bloqueo de esta ejecución.

Verificaciones completas y solas, cada una precedida por las guardas pgrep vacías:

| Suite | Resultado | Log |
|---|---|---|
| Editor (E) | `Tests: 109 passed, 109 total` | e7-r19-r20-green-e.log |
| chunky-cta-canvas-fidelity | `Tests: 76 passed, 76 total` | e7-r19-r20-green-chunky-cta-canvas-fidelity.log |
| consistency-classnames | `Tests: 1 failed, 74 passed, 75 total` | e7-r19-r20-green-consistency-classnames.log |

Único fallo: `#189 R9: la hoja del Editor combina esquina continua y flex sin perderlos`, `src/__tests__/consistency-classnames.test.ts:698`. El test exige literalmente:

```ts
expect(source).toContain("import { CONTINUOUS_CORNER, TABULAR_NUMS } from '../../theme/native-styles';");
```

El Editor recibe la importación literal prescrita por E4 R19 (requirements §4.4, tabla «Candados agregados», línea 879):

```diff
-import { CONTINUOUS_CORNER, TABULAR_NUMS } from '../../theme/native-styles';
+import { CONTINUOUS_CORNER, KEEP_OPACITY, TABULAR_NUMS } from '../../theme/native-styles';
```

Esa misma fila de la spec afirma que las importaciones nuevas no están fijadas por ningún candado de texto y que los únicos imports exactos son los de history. La afirmación contradice el `toContain` real de la línea 698. La regla residual (requirements líneas 891-894 y CUARTA REANUDACIÓN) exige parar si consistency-classnames se pone rojo, con delta esperado cero; además ese fichero está fuera de la lista cerrada E4. Se para ante este resultado: ni se enmienda el candado ni se divide/reordena el import de producción para eludirlo.

En la misma inspección del test aparece también un segundo ancla que R22 deberá conciliar: `consistency-classnames.test.ts:701` exige el literal completo de KeyboardAvoidingView con `keyboardVerticalOffset={headerHeight}`, mientras R22.3 prescribe `{0}` y retirar HeaderHeightContext/useContext. En esta ejecución esa aserción aún no falla (R22 no ha comenzado); se informa de la incompatibilidad textual ya visible en el mismo candado, sin atribuirle una ejecución futura.

Validación detenida antes de design-drift y heroui-text-size-merge; tampoco typecheck/lint, suite completa, graphify ni smoke en esta reanudación. C y F conservan sus verdes 24/24 y 96/96 medidos en la sexta reanudación. No hay nuevos commits; R21/R22/R24 y P-E4-1..13 siguen sin iniciar. Producción R19/R20 conserva exactamente sus tres ficheros WIP; se mantiene el patch E5 sin seguimiento. Traceability intacta hasta resolver este conflicto y completar un verde real. No se ejecuta init.sh/push/PR/merge ni se cambian casillas, feature_list, STATUS, current, history o handoff. No se relaja ninguna aserción. Sin denegaciones del sandbox.

El sentinel ignorado `.done` se recrea como última acción y señala fin de esta ejecución detenida, no cierre de E4.

#### Octava reanudación — Enmienda E6, 2026-10-22

H0-E6: `0babf646`, firma humana E6 verificada (también E4/E5). Cwd y branch `feature/189-mobile-geofences-canvas-fidelity` conformes; se conserva el WIP R19/R20 y los documentos del leader. Skills cargadas: building-native-ui y expo-tailwind-setup (cache oficial Expo 11c74d6b), appllama-app-design-skill del repo y ponytail; ninguna solicitada ausente. Consultada la referencia oficial Expo SDK 57 exigida por mobile/AGENTS.md. La carta y la spec mandan sobre las skills; smoke Android a cargo del humano. Sin init.sh/push/PR/casillas/bookkeeping.

M20 ejecutado en H0: salida completa en `progress/e8-m20-h0-files.log` y `progress/e8-m20-h0-lines.log`. Se revisaron las 62 rutas y las 181 líneas: C1/C2 son los únicos literales incompatibles fuera de la lista E4; las demás coincidencias corresponden a las filas de no-choque de §4.6 (opciones de layout ya en lista, imports/usos de constantes sin variación y expectativas de otras pantallas/componentes). C1 se mueve en commit de test aparte tras demostrar su rojo con producción apartada mediante patch; C2 se reserva al rojo de R22.

C1 rojo demostrado con la producción apartada: `Tests: 1 failed, 74 passed, 75 total` (`e8-c1-red.log`), único fallo en el import exacto. Commit de test separado; restaurado `e5-prod.patch` mediante git apply, numstat idéntico Editor +4/-4, Zonas +3/-2, native-styles +3/-0. Sin stash.

C1 commit `889ed6fa`. Verde conjunto R19/R20 validado: C 24/24 y F 96/96 (sexta reanudación), E 109/109 y chunky 76/76 (séptima; producción idéntica restaurada), consistency 75/75, design-drift 115/115, heroui-text-size-merge 25/25 (octava, logs e8-r19-r20-*). Typecheck exit 0 con guarda `.expo/types/router.d.ts` ausente; lint sin caché exit 0, log vacío. `git diff --check` verde. Incidencia de lectura: se consultó jest.config.js inexistente; la configuración vive en package.json y se leyó allí; no afectó a Jest ni al código. Se crea ahora el único commit verde de R19/R20 (solo sus tres ficheros de producción).

R19/R20 verde `cae47221`. R21 base medida: opciones de #95 R4 con fondo token:background, sin headerTransparent; F inset automático, paddingTop 24, encabezado flex-row sin alto/paddingLeft. R21 rojo enmienda exactamente esos tests, con sufijo E4 R21; posición/singularidad y Editor intactos.

R21 rojo `8fae5abf`: F `Tests: 3 failed, 93 passed, 96 total` (solo inset/métricas y encabezado ES/EN); L `Tests: 1 failed, 27 passed, 28 total` (solo opciones de #95 R4). Logs e8-r21-red-{f,l}. Producción mínima: spread transparente después de headerOptions únicamente en Zonas; contenedor sin ajuste automático y con HEADER_ROW_TOP; fila h-11 con ZONES_TITLE_OFFSET.

R21 verde: F `Tests: 96 passed, 96 total`, L `Tests: 28 passed, 28 total`, C `Tests: 24 passed, 24 total` (logs e8-r21-green-*). M14 Zonas 1→0, Editor sigue 1; M17 layout 0→2; título traducido nativo sigue 0. `git diff --check` verde. Se commitea solo producción.

R22 base: Editor importa HeaderHeightContext/useContext y usa offset headerHeight; mapa contiene directamente title-blur con absolute left-4 top-3; mock expo-router solo contiene router.back. Se conserva Provider=91 como guarda inerte; se amplía el mock con Stack.Screen, tests de las ocho ramas, transición y dos identidades; C2 entra en este rojo, conservando las aserciones de esquina y recuento 2. Selectores regex existentes revisados: title-row no coincide con ninguno.

R21 verde `e82549e3`. R22 rojo E: `Tests: 21 failed, 99 passed, 120 total` (teclado 291 recibido frente a 200, píldora antigua y opciones ausentes); consistency C2: `Tests: 1 failed, 74 passed, 75 total`, falla el literal completo de offset 0 (C1 ya verde). Sin fallos de invocación/mocks. Logs e8-r22-red-*.

R22 rojo `d9077a65` (incluye C2): C `Tests: 1 failed, 24 passed, 25 total`, por HeaderHeightContext. Verde E `Tests: 120 passed, 120 total` (`e8-r22-green-e.log`). La producción declara Stack.Screen como hermano de cada raíz, memoiza opaqueHeader antes de las ramas y conserva el literal de KeyboardAvoidingView en una línea con offset 0. La píldora conserva intensidad/tinte/texto dentro de la nueva fila; las 2 llamadas a t('geofenceEditor.title') siguen intactas.

M20 repetido tras R22: mismas 62 rutas; 181→184 líneas. Diferencias de contenido: C1 (import KEEP_OPACITY), C2 (offset 0) y tres coincidencias del nuevo candado negativo R22.3 en C, todos en las listas E4/E6. Las otras seis diferencias son únicamente números de línea desplazados en layout por R21. No aparece ningún literal ajeno/no clasificado; design-drift/heroui-text-size-merge permanecen a delta 0. Salidas completas e8-m20-r22-{files,lines}.log.

R22 verde completo: E 120/120, C 25/25, consistency 75/75, typecheck exit 0 con guarda (logs e8-r22-*). M12 2→0; M13 1/0→0/1; M15 0/0→2/0; M17 Editor 0→2. Producción en commit verde aparte. R24 base: dos métricas de Zonas con paddingTop 24, sin las tres frases nuevas; nota A11 se insertará después de docs-upload, preservando #185 R10 y todo texto de títulos/R16.3 existente.

R22 verde `b3c16b4c`. R24 rojo C: `Tests: 4 failed, 24 passed, 28 total`, solo métricas antiguas y las tres frases ausentes (e8-r24-red-c.log). Commit de test aparte; edición de carta/conventions sin casillas y con la nota después del bloque que menciona docs-upload.

R24 rojo `a49eb6b0`; verde C `Tests: 28 passed, 28 total`, design-drift `Tests: 115 passed, 115 total`, chunky `Tests: 76 passed, 76 total` (e8-r24-green-*). Ningún candado protegido se enmienda; casillas intactas. Inicia la fase de sondas con restauración exacta de cada fichero tras cada mutación.

Sonda P-E4-1 (c): exit 1; `Tests:       1 failed, 27 passed, 28 total`. Fallos: ● #189 R19: bloqueo sin atenuado en todas las etiquetas › #189 R19.2: geofences cancela la opacidad en todas sus etiquetas con isDisabled. Log `e8-probe-P-E4-1-c.log`. Rojo esperado; fichero restaurado tras la sonda.

Sonda P-E4-2 (c): exit 1; `Tests:       1 failed, 27 passed, 28 total`. Fallos: ● #189 R19: bloqueo sin atenuado en todas las etiquetas › #189 R19.2: geofences cancela la opacidad en todas sus etiquetas con isDisabled. Log `e8-probe-P-E4-2-c.log`. Rojo esperado; fichero restaurado tras la sonda.

Sonda P-E4-3 (f): exit 1; `Tests:       8 failed, 88 passed, 96 total`. Fallos: ● #189 R7: Añadir zona conserva una sola CTA anclada al pie › #189 R7: receta y navegación en es con 0 zonas (enmendado por E4 R20); ● #189 R7: Añadir zona conserva una sola CTA anclada al pie › #189 R7: receta y navegación en es con 4 zonas (enmendado por E4 R20); ● #189 R7: Añadir zona conserva una sola CTA anclada al pie › #189 R7: receta y navegación en es con 5 zonas (enmendado por E4 R20); ● #189 R7: Añadir zona conserva una sola CTA anclada al pie › #189 R7: receta y navegación en en con 0 zonas (enmendado por E4 R20); ● #189 R7: Añadir zona conserva una sola CTA anclada al pie › #189 R7: receta y navegación en en con 4 zonas (enmendado por E4 R20); ● #189 R7: Añadir zona conserva una sola CTA anclada al pie › #189 R7: receta y navegación en en con 5 zonas (enmendado por E4 R20); ● #189 R7: Añadir zona conserva una sola CTA anclada al pie › #189 R7: una escritura conserva la receta primaria sin atenuado (enmendado por E4 R20); ● #189 R20.1: el límite conserva disabled:element-disabled y cancela su opacidad por style. Log `e8-probe-P-E4-3-f.log`. Rojo esperado; fichero restaurado tras la sonda.

Sonda P-E4-3 (chunky): exit 1; `Tests:       3 failed, 73 passed, 76 total`. Fallos: ● #177 R3.1: screens/geofences/index.tsx pinta la receta cta de testID="geofences-add" (enmendado por #189 R7) (enmendado por #189 R13) (enmendado por E4 R19) (enmendado por E4 R20); ● #177 R7.5: inventario de los tres estilos y el tile (enmendado por #189 R7) (enmendado por #189 R13) (enmendado por E4 R19) (enmendado por E4 R20); ● #177 R8.1: solo la tabla recibe chunkyLip.primary (enmendado por #189 R7) (enmendado por #189 R13) (enmendado por E4 R19) (enmendado por E4 R20). Log `e8-probe-P-E4-3-chunky.log`. Rojo esperado; fichero restaurado tras la sonda.

Sonda P-E4-4 (f): exit 1; `Tests:       8 failed, 88 passed, 96 total`. Fallos: ● #189 R7: Añadir zona conserva una sola CTA anclada al pie › #189 R7: receta y navegación en es con 0 zonas (enmendado por E4 R20); ● #189 R7: Añadir zona conserva una sola CTA anclada al pie › #189 R7: receta y navegación en es con 4 zonas (enmendado por E4 R20); ● #189 R7: Añadir zona conserva una sola CTA anclada al pie › #189 R7: receta y navegación en es con 5 zonas (enmendado por E4 R20); ● #189 R7: Añadir zona conserva una sola CTA anclada al pie › #189 R7: receta y navegación en en con 0 zonas (enmendado por E4 R20); ● #189 R7: Añadir zona conserva una sola CTA anclada al pie › #189 R7: receta y navegación en en con 4 zonas (enmendado por E4 R20); ● #189 R7: Añadir zona conserva una sola CTA anclada al pie › #189 R7: receta y navegación en en con 5 zonas (enmendado por E4 R20); ● #189 R7: Añadir zona conserva una sola CTA anclada al pie › #189 R7: una escritura conserva la receta primaria sin atenuado (enmendado por E4 R20); ● #189 R20.1: el límite conserva disabled:element-disabled y cancela su opacidad por style. Log `e8-probe-P-E4-4-f.log`. Rojo esperado; fichero restaurado tras la sonda.

Sonda P-E4-5 (f): exit 1; `Tests:       5 failed, 91 passed, 96 total`. Fallos: ● #146 R12: con el máximo de zonas la lista no ofrece añadir otra › con cinco zonas deshabilita Añadir zona y pinta el aviso del máximo justo antes (enmendado por #189 R3) (enmendado por #189 R6); ● #189 R7: Añadir zona conserva una sola CTA anclada al pie › #189 R7: receta y navegación en es con 5 zonas (enmendado por E4 R20); ● #189 R7: Añadir zona conserva una sola CTA anclada al pie › #189 R7: receta y navegación en en con 5 zonas (enmendado por E4 R20); ● #189 R7: Añadir zona conserva una sola CTA anclada al pie › #189 R7: una escritura conserva la receta primaria sin atenuado (enmendado por E4 R20); ● #189 R20.1: el límite conserva disabled:element-disabled y cancela su opacidad por style. Log `e8-probe-P-E4-5-f.log`. Rojo esperado; fichero restaurado tras la sonda.

Sonda P-E4-6 (l): exit 1; `Tests:       1 failed, 27 passed, 28 total`. Fallos: ● #41 R4: la guarda de RootStack declara las zonas seguras tras el detalle de alerta › le da la cabecera nativa de #95 R4 con el título de zonas seguras (enmendado por E4 R21). Log `e8-probe-P-E4-6-l.log`. Rojo esperado; fichero restaurado tras la sonda.

Sonda P-E4-7-inset (f): exit 1; `Tests:       1 failed, 95 passed, 96 total`. Fallos: ● #41 R5: la pantalla pinta la lista de zonas y sus estados › respeta las métricas A11 bajo cabecera nativa (enmendado por #189 R3) (enmendado por E4 R21). Log `e8-probe-P-E4-7-inset-f.log`. Rojo esperado; fichero restaurado tras la sonda.

Sonda P-E4-7-padding (f): exit 1; `Tests:       1 failed, 95 passed, 96 total`. Fallos: ● #41 R5: la pantalla pinta la lista de zonas y sus estados › respeta las métricas A11 bajo cabecera nativa (enmendado por #189 R3) (enmendado por E4 R21). Log `e8-probe-P-E4-7-padding-f.log`. Rojo esperado; fichero restaurado tras la sonda.

Sonda P-E4-8-window (c): exit 1; `Tests:       1 failed, 27 passed, 28 total`. Fallos: ● #189 R23: geometría compartida con ventana independiente › #189 R23.2: los offsets quedan en las ventanas propias del test. Log `e8-probe-P-E4-8-window-c.log`. Rojo esperado; fichero restaurado tras la sonda.

Sonda P-E4-8-wiring (f): exit 1; `Tests:       2 failed, 94 passed, 96 total`. Fallos: ● #189 R1: título y contador en el contenido › #189 R1.2: el título de es tiene clase, rol y posición exactos (enmendado por #189 R3) (enmendado por E4 R21); ● #189 R1: título y contador en el contenido › #189 R1.2: el título de en tiene clase, rol y posición exactos (enmendado por #189 R3) (enmendado por E4 R21). Log `e8-probe-P-E4-8-wiring-f.log`. Rojo esperado; fichero restaurado tras la sonda.

Sonda P-E4-8-literal (c): exit 0; `Tests:       28 passed, 28 total`. Fallos: . Log `e8-probe-P-E4-8-literal-c.log`. PARADA: resultado distinto al rojo prescrito; fichero restaurado tras la sonda.


#### Parada de la octava reanudación — P-E4-8 no detecta el literal 50

**Estado actual: PARADA por contradicción medida entre el rojo exigido por P-E4-8 y el alcance del candado de fuente R23.2. E4 no está cerrada.** HEAD `fb578f0b`; C1, verde conjunto R19/R20, R21, R22 (con C2) y R24 están commiteados. No se continúan las sondas restantes ni las comprobaciones del cierre tras esta contradicción, conforme a la orden del humano.

requirements.md §4.4, tabla «Sondas de mutación», fila P-E4-8 (línea 913), prescribe tres subsondas: ventana con ZONES_TITLE_OFFSET=60, cableado sin paddingLeft, y `paddingLeft: 50` literal dentro de la ventana pero sin constante. La tercera debe poner en rojo «el barrido de literales de R23.2».

Las dos primeras dan el rojo previsto:

- Offset 60: C `Tests: 1 failed, 27 passed, 28 total`, falla la ventana independiente.
- Sin paddingLeft: F `Tests: 2 failed, 94 passed, 96 total`, fallan las dos variantes de cableado R1.2.

Tercera subsonda: se sustituyó únicamente `paddingLeft: ZONES_TITLE_OFFSET` por `paddingLeft: 50` en Zonas y se ejecutó la suite C completa y sola con las dos guardas vacías. Resultado **exit 0**, `Test Suites: 1 passed, 1 total`, `Tests: 28 passed, 28 total` (`progress/e8-probe-P-E4-8-literal-c.log`). El `it` «#189 R23.2: geofences no repite los literales de geometría» permanece verde. Su visitante AST, geofences-canvas-fidelity.test.ts:56, recoge exclusivamente los números `['42', '70', '56']`; no recoge `50`. El literal plantado queda fuera de su alcance.

La propia cláusula R23.2 enumera 42/70/56 en el barrido de fuente, mientras la tabla P-E4-8 exige que ese barrido detecte también 50. Hace falta conciliar ese alcance y el rojo exigido. No se cambia la aserción, no se añade 50 ad hoc, no se cambia la mutación prescrita y no se presenta otra familia de tests como prueba del barrido de fuente. No se ejecutó F para esta tercera subsonda tras observar la contradicción: aunque el cableado podría detectarla, no sería el candado de fuente que la tabla nombra.

El ejecutor de sondas restauró los bytes originales mediante finally antes de devolver la parada. Confirmado: Zonas vuelve a `paddingLeft: ZONES_TITLE_OFFSET`; `git status --short -- mobile-pet-tracker/ specs/ docs/` vacío y `git diff --check` verde. No quedan procesos Jest ni init.sh. Ninguna mutación se commiteó.

Commits de esta reanudación y resultados del bloque:

| Paso | Rojo separado | Verde separado | Verificación |
|---|---|---|---|
| C1 (E6 R19) | `889ed6fa` | comparte `cae47221` | consistency 1 failed/74 passed/75 → 75/75 |
| R19/R20 | rojos previos `297b9f4b`, `eace0652`; E5 `3a786a89`, `f3aa4094` | `cae47221` | C 24/24, F 96/96, E 109/109, chunky 76/76, consistency 75/75, design 115/115, heroui 25/25; tipos/lint verdes |
| R21 | `8fae5abf` | `e82549e3` | F 3 failed/93 passed/96 → 96/96; L 1 failed/27 passed/28 → 28/28; C 24/24 |
| R22 (incluye C2) | `d9077a65` | `b3c16b4c` | E 21 failed/99 passed/120 → 120/120; consistency 1 failed/74 passed/75 → 75/75; C 1 failed/24 passed/25 → 25/25; tipos verdes |
| R24 | `a49eb6b0` | `fb578f0b` | C 4 failed/24 passed/28 → 28/28; design 115/115 y chunky 76/76 |

P-E4-1..7 dieron rojo y se restauraron (P-E4-3 ejecutada en F y chunky; P-E4-7 tanto inset como padding). P-E4-4 vuelve a probar la aserción corregida por E5: falla R20.1 por la clave extra boxShadow. P-E4-8: ventana y cableado rojos, barrido del literal 50 indebidamente verde. **P-E4-9..13 y P-E6-1..3 no ejecutadas**; no se afirma ninguna como probada.

No se ejecutan suite completa, lint final, graphify, medidas finales ni smoke en esta reanudación detenida. Tipos/lint del verde R19/R20 y tipos de R22 sí constan arriba; no se confunden con un cierre final. Traceability permanece intacta: solo se puede editar en el commit final y el cierre está bloqueado. No se marca done ni se tocan feature_list, STATUS, current, history, handoff o casillas. No hubo init.sh/push/PR/merge, dependencias nuevas, recursos AWS ni denegaciones de sandbox. La lista de ficheros desde 4204530e se leyó y sigue dentro de las listas originales/ampliadas; no se toma como cierre.

#### M20 — resultados íntegros de la octava reanudación

Los dos comandos de requirements §4.6 se ejecutaron tanto en H0-E6 como tras el verde de R22. Las 62 rutas del primer comando son idénticas en ambos momentos. El segundo comando pasa de 181 a 184 líneas: C1/C2, tres coincidencias del nuevo candado R22.3 y seis desplazamientos de línea de layout ya clasificados; ningún literal no clasificado fuera de las listas autorizadas.

Primer comando, rutas (H0 y R22 idénticas):

```text
src/__tests__/account-screens-polish.test.ts
src/__tests__/add-pet-two-steps.test.ts
src/__tests__/alert-detail-canvas-fidelity.test.ts
src/__tests__/alerts-canvas-fidelity.test.ts
src/__tests__/chunky-cta-canvas-fidelity.test.ts
src/__tests__/consistency-classnames.test.ts
src/__tests__/design-drift.test.ts
src/__tests__/forms-validation-global.test.ts
src/__tests__/geofences-canvas-fidelity.test.ts
src/__tests__/hero-header-amendments.test.ts
src/__tests__/heroui-text-size-merge.test.ts
src/__tests__/home-pingo-phrase.test.ts
src/__tests__/hosting-artifacts.test.ts
src/__tests__/legibility-classnames.test.ts
src/__tests__/no-pets-states.test.ts
src/__tests__/pairing-canvas-fidelity.test.ts
src/__tests__/profile-canvas-fidelity.test.ts
src/__tests__/tab-headers-canvas.test.ts
src/__tests__/ui-language.test.ts
src/app/(auth)/__tests__/layout.test.tsx
src/app/(tabs)/__tests__/alerts.test.tsx
src/app/(tabs)/__tests__/food.test.tsx
src/app/(tabs)/__tests__/layout.test.tsx
src/app/__tests__/detail-stack.test.tsx
src/app/__tests__/layout.test.tsx
src/app/__tests__/tabs-layout.test.tsx
src/components/__tests__/celebration.test.tsx
src/components/__tests__/empty-state-hero.test.tsx
src/components/__tests__/empty-state.test.tsx
src/components/__tests__/field-error-message.test.tsx
src/components/__tests__/floating-tab-bar.test.tsx
src/components/__tests__/pet-hero-header.test.tsx
src/components/__tests__/segmented-control.test.tsx
src/hooks/use-pet-selection.test.tsx
src/hooks/use-push-registration.navigation.test.tsx
src/providers/__tests__/language-provider.test.tsx
src/screens/add-pet/index.test.tsx
src/screens/add-reminder/index.test.tsx
src/screens/alert-detail/index.test.tsx
src/screens/alerts/index.test.tsx
src/screens/docs-upload-form/index.test.tsx
src/screens/docs/index.test.tsx
src/screens/forgot/index.test.tsx
src/screens/geofence-editor/index.test.tsx
src/screens/geofences/index.test.tsx
src/screens/home/index.test.tsx
src/screens/home/weekly-activity-chart.test.tsx
src/screens/login/index.test.tsx
src/screens/map/index.test.tsx
src/screens/meal-schedule/index.test.tsx
src/screens/meals-history/index.test.tsx
src/screens/pairing/index.test.tsx
src/screens/profile/index.test.tsx
src/screens/register/index.test.tsx
src/screens/reminders/index.test.tsx
src/screens/reset-password/index.test.tsx
src/screens/weight-log/index.test.tsx
src/screens/welcome/index.test.tsx
src/theme/__tests__/font-registration.test.ts
src/theme/__tests__/global-css.test.ts
src/theme/__tests__/motion.test.ts
src/utils/form-rules.test.ts
```

Segundo comando, H0-E6:

```text
src/components/__tests__/floating-tab-bar.test.tsx:345:    expect(style).toMatchObject({ bottom: 46, left: 16, right: 16 });
src/components/__tests__/celebration.test.tsx:169:      pointerEvents: 'none', importantForAccessibility: 'no-hide-descendants', accessibilityElementsHidden: true,
src/components/__tests__/celebration.test.tsx:436:    expect(ring.props.pointerEvents).toBe('none');
src/components/__tests__/celebration.test.tsx:514:    expect(hero.props.className).toBe('mt-10 items-center justify-center');
src/components/__tests__/pet-switcher.test.tsx:133:        `size-10 items-center justify-center overflow-hidden rounded-full ${surfaces[index]}`,
src/components/__tests__/pet-switcher.test.tsx:145:      'size-10 items-center justify-center overflow-hidden rounded-full bg-category-amber',
src/components/__tests__/back-button.test.tsx:42:    expect(back.props.className).toBe('size-11 items-center justify-center rounded-full');
src/components/__tests__/empty-state-hero.test.tsx:53:  expect(stage.props.className).toBe('h-65 w-70 items-center justify-center');
src/components/__tests__/password-input.test.tsx:76:    expect(toggle.props.className).toBe('size-11 items-center justify-center');
src/components/__tests__/pet-hero-header.test.tsx:454:  it('es una capsula rounded-full de text-2xs font-semibold, self-start, sin animate-pulse ni Chip', async () => {
src/components/__tests__/pet-hero-header.test.tsx:468:      'flex-row items-center gap-1 self-start rounded-full px-2.5 py-0.5',
src/components/__tests__/segmented-control.test.tsx:4:import { CONTINUOUS_CORNER } from '../../theme/native-styles';
src/components/__tests__/segmented-control.test.tsx:30:      expect(segment.props.className).toBe('h-9.5 flex-1 items-center justify-center rounded-10' + (selected ? ' bg-surface shadow-sm' : ''));
src/app/__tests__/tabs-layout.test.tsx:38:      headerShown: false,
src/app/__tests__/layout.test.tsx:307:    expect(props?.screenOptions).toEqual({ headerShown: false });
src/app/__tests__/layout.test.tsx:315:      [Stack.Screen, 'index', undefined],
src/app/__tests__/layout.test.tsx:316:      [Stack.Screen, '(tabs)', undefined],
src/app/__tests__/layout.test.tsx:317:      [Stack.Screen, '(auth)', undefined],
src/app/__tests__/layout.test.tsx:318:      [Stack.Screen, 'reset-password', undefined],
src/app/__tests__/layout.test.tsx:329:      [Stack.Screen, 'add-reminder'],
src/app/__tests__/layout.test.tsx:330:      [Stack.Screen, 'pets/add'],
src/app/__tests__/layout.test.tsx:331:      [Stack.Screen, 'pets/[petId]/docs'],
src/app/__tests__/layout.test.tsx:332:      [Stack.Screen, 'pets/[petId]/docs-upload'], // #185 R10
src/app/__tests__/layout.test.tsx:333:      [Stack.Screen, 'weight-log'],
src/app/__tests__/layout.test.tsx:334:      [Stack.Screen, 'meal-schedule'],
src/app/__tests__/layout.test.tsx:335:      [Stack.Screen, 'pairing'],
src/app/__tests__/layout.test.tsx:365:      headerShown: true,
src/app/__tests__/layout.test.tsx:395:      [Stack.Screen, 'reminders', undefined],
src/app/__tests__/layout.test.tsx:396:      [Stack.Screen, 'alerts', true],
src/app/__tests__/layout.test.tsx:419:      : null).toEqual([Stack.Screen, 'alerts/[alertId]', true]);
src/app/__tests__/layout.test.tsx:430:      headerShown: true,
src/app/__tests__/layout.test.tsx:469:      : null).toEqual([Stack.Screen, 'pets/[petId]/geofences', undefined]);
src/app/__tests__/layout.test.tsx:480:      headerShown: true,
src/app/__tests__/layout.test.tsx:508:      : null).toEqual([Stack.Screen, 'pets/[petId]/geofence-editor', undefined]);
src/app/__tests__/layout.test.tsx:519:      headerShown: true,
src/app/__tests__/layout.test.tsx:549:      headerShown: true,
src/app/__tests__/layout.test.tsx:576:      : undefined).toEqual([Stack.Screen, 'meals-history']);
src/app/__tests__/layout.test.tsx:579:      : undefined).toMatchObject({ headerShown: true, title: '' });
src/app/__tests__/layout.test.tsx:601:    )).toEqual([[Stack.Screen, 'welcome']]);
src/app/(auth)/__tests__/layout.test.tsx:51:        headerShown: false,
src/app/(tabs)/__tests__/food.test.tsx:574:    expect(toggle.props.className).toBe('min-h-11 justify-center');
src/app/(tabs)/__tests__/food.test.tsx:1298:    expect(progress.props.className).toBe('size-26 items-center justify-center');
src/app/(tabs)/__tests__/layout.test.tsx:79:      headerShown: false,
src/hooks/use-push-registration.navigation.test.tsx:61:      <Stack screenOptions={{ headerShown: false }} />
src/__tests__/alert-detail-canvas-fidelity.test.ts:31:  expect([...source.matchAll(/rounded-card|min-h-44|text-lg|text-2xs|text-sm|h-52([^.0-9]|$)|min-h-11/g)]).toEqual([]);
src/__tests__/design-drift.test.ts:1197:    expect(history).toContain("import { CONTINUOUS_CORNER, TABULAR_NUMS } from '../../theme/native-styles';");
src/__tests__/geofences-canvas-fidelity.test.ts:2:import { BACK_BUTTON_SIZE, EDITOR_PILL_LEFT, HEADER_BAR_HEIGHT, HEADER_ROW_TOP, TRANSPARENT_HEADER_OPTIONS, ZONES_TITLE_OFFSET } from '../theme/header-layout';
src/__tests__/geofences-canvas-fidelity.test.ts:15:    expect(mainRules).toContain('Zonas seguras (#189): `paddingHorizontal: 20`, `paddingTop: 24`, `gap: 12`, `paddingBottom: insets.bottom + 40`.');
src/__tests__/geofences-canvas-fidelity.test.ts:39:    const source = readFileSync(join(process.cwd(), 'src/theme/header-layout.ts'), 'utf8');
src/__tests__/geofences-canvas-fidelity.test.ts:44:    expect(TRANSPARENT_HEADER_OPTIONS).toEqual({ headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } });
src/__tests__/geofences-canvas-fidelity.test.ts:92:    const source = readFileSync(join(process.cwd(), 'src/theme/native-styles.ts'), 'utf8');
src/__tests__/consistency-classnames.test.ts:174:      'size-13 items-center justify-center bg-accent rounded-16',
src/__tests__/consistency-classnames.test.ts:177:      'size-8 shrink-0 items-center justify-center rounded-xl ${tileClassName}',
src/__tests__/consistency-classnames.test.ts:279:    const nativeStyles = readSource(join('theme', 'native-styles.ts'));
src/__tests__/consistency-classnames.test.ts:294:      /import \{[^}]*\bCONTINUOUS_CORNER\b[^}]*\} from ['"].*theme\/native-styles['"];/,
src/__tests__/consistency-classnames.test.ts:312:      "import { CONTINUOUS_CORNER } from '../theme/native-styles';",
src/__tests__/consistency-classnames.test.ts:356:      /import \{[^}]*\bTABULAR_NUMS\b[^}]*\} from ['"].*theme\/native-styles['"];/,
src/__tests__/consistency-classnames.test.ts:698:  expect(source).toContain("import { CONTINUOUS_CORNER, TABULAR_NUMS } from '../../theme/native-styles';");
src/__tests__/consistency-classnames.test.ts:701:  expect(source).toContain('<KeyboardAvoidingView testID="screen-geofence-editor" className="flex-1" behavior="padding" keyboardVerticalOffset={headerHeight}>');
src/__tests__/account-screens-polish.test.ts:49:    expect(login.match(/testID="link-forgot"\s+className="min-h-11 self-end"/g) ?? []).toHaveLength(1);
src/__tests__/chunky-cta-canvas-fidelity.test.ts:110:  for (const forbidden of ['border-b-4', 'border-black', 'rounded-xl', 'min-h-11']) expect(tag).not.toContain(forbidden);
src/__tests__/chunky-cta-canvas-fidelity.test.ts:154:  expect(tag).toContain('className="size-13 items-center justify-center bg-accent rounded-16"');
src/__tests__/alerts-canvas-fidelity.test.ts:61:    "change": "#100 R6: la columna de texto de la fila pasa a dos hijos (tipo y subtítulo) con justify-center y gap-0.5",
src/screens/register/index.test.tsx:281:        .contentInsetAdjustmentBehavior,
src/screens/docs/index.test.tsx:12:import { HeaderHeightContext } from 'expo-router/react-navigation';
src/screens/docs/index.test.tsx:118:        <HeaderHeightContext.Provider value={91}>
src/screens/docs/index.test.tsx:120:        </HeaderHeightContext.Provider>
src/screens/docs/index.test.tsx:236:      'self-start rounded-full px-2 py-0.5 text-11 font-extrabold bg-category-blue text-category-blue-strong',
src/screens/docs/index.test.tsx:284:      'self-start rounded-full px-2 py-0.5 text-11 font-extrabold bg-category-blue text-category-blue-strong',
src/screens/docs/index.test.tsx:289:      'self-start rounded-full px-2 py-0.5 text-11 font-extrabold bg-default text-muted',
src/screens/docs/index.test.tsx:359:      paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48,
src/screens/docs/index.test.tsx:642:    expect(mosaic.props.className).toBe(`h-14 w-12 items-center justify-center rounded-xl ${surface}`);
src/screens/docs/index.test.tsx:650:    expect(column.children[0]).toHaveProperty('props.className', `self-start rounded-full px-2 py-0.5 text-11 font-extrabold ${surface} ${ink}`);
src/screens/docs/index.test.tsx:729:    expect(circle.props.className).toBe('size-12 items-center justify-center rounded-full bg-surface-secondary');
src/screens/docs/index.test.tsx:805:    expect(chip.props.className).toBe(`h-8.5 items-center justify-center rounded-full px-3 ${surface}`);
src/screens/docs/index.test.tsx:845:    expect(selected.props.className).toBe('h-8.5 items-center justify-center rounded-full px-3 bg-foreground');
src/screens/docs/index.test.tsx:848:    expect(all.props.className).toBe('h-8.5 items-center justify-center rounded-full px-3 bg-default');
src/screens/meal-schedule/index.test.tsx:284:    ).toEqual({ paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48 });
src/screens/meal-schedule/index.test.tsx:1088:      paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48,
src/screens/meal-schedule/index.test.tsx:1194:      expect(tile).toHaveProp('className', 'size-10.5 items-center justify-center rounded-14 bg-category-amber');
src/screens/add-pet/index.test.tsx:1:import { HeaderHeightContext, usePreventRemove } from 'expo-router/react-navigation';
src/screens/add-pet/index.test.tsx:90:        <HeaderHeightContext.Provider value={91}>
src/screens/add-pet/index.test.tsx:92:        </HeaderHeightContext.Provider>
src/screens/add-pet/index.test.tsx:137:    expect(photo.props.className).toBe('size-22 items-center justify-center rounded-full border-2 border-dashed border-accent bg-surface-secondary');
src/screens/add-pet/index.test.tsx:797:    expect(chip.props.className).toBe('h-9.5 flex-1 items-center justify-center rounded-10' + (testID === 'species-dog' ? ' bg-surface shadow-sm' : ''));
src/screens/home/index.test.tsx:34:import { TABULAR_NUMS } from '../../theme/native-styles';
src/screens/home/index.test.tsx:208:      'size-11 items-center justify-center rounded-full',
src/screens/home/index.test.tsx:2556:      expect(tile.props.className).toContain('min-h-11');
src/screens/home/index.test.tsx:3218:        `size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS[slot].surface}`,
src/screens/home/index.test.tsx:3235:      `size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS.neutral.surface}`,
src/screens/home/index.test.tsx:4107:            `size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS.blue.surface}`,
src/screens/home/index.test.tsx:4133:            `size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS.neutral.surface}`,
src/screens/home/index.test.tsx:4362:        `size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS.rose.surface}`,
src/screens/home/index.test.tsx:5477:    expect(container.props.className).toBe('flex-1 items-center justify-center px-5 py-6 bg-background'); // (enmendado por #176 R3)
src/screens/home/weekly-activity-chart.test.tsx:21:import { TABULAR_NUMS } from '../../theme/native-styles';
src/screens/home/weekly-activity-chart.test.tsx:843:      segments.every(({ props }) => props.className.includes('h-11')),
src/screens/home/weekly-activity-chart.test.tsx:1028:    expect(spanishColumn.props.className).toContain('min-h-11');
src/screens/home/weekly-activity-chart.test.tsx:1686:    const resting = 'min-h-11 flex-1 items-center justify-end';
src/screens/home/weekly-activity-chart.test.tsx:1688:      'min-h-11 flex-1 items-center justify-end border-t-2 border-accent-strong';
src/screens/home/weekly-activity-chart.test.tsx:2279:    const resting = 'min-h-11 flex-1 items-center justify-end';
src/screens/home/weekly-activity-chart.test.tsx:2281:      'min-h-11 flex-1 items-center justify-end border-t-2 border-accent-strong';
src/screens/pairing/index.test.tsx:1:import { HeaderHeightContext } from 'expo-router/react-navigation';
src/screens/pairing/index.test.tsx:160:          <HeaderHeightContext.Provider value={91}>
src/screens/pairing/index.test.tsx:162:          </HeaderHeightContext.Provider>
src/screens/pairing/index.test.tsx:622:      expect(source).not.toContain('size-16 items-center justify-center rounded-full bg-accent-soft');
src/screens/pairing/index.test.tsx:1213:      'size-9', 'items-center', 'justify-center', 'overflow-hidden', 'rounded-full', 'bg-category-amber',
src/screens/pairing/index.test.tsx:1259:      'w-50', 'h-37.5', 'items-center', 'justify-center',
src/screens/profile/index.test.tsx:1374:    expect(camera.props.className).toBe('absolute -bottom-0.5 -right-0.5 size-8.5 items-center justify-center rounded-full border-3 border-surface-secondary bg-accent');
src/screens/profile/index.test.tsx:1548:    expect(root.props.className).toBe('flex-row flex-wrap justify-center gap-1.5');
src/screens/profile/index.test.tsx:1730:      expect(avatar.props.className).toBe('size-8.5 items-center justify-center rounded-full bg-default');
src/screens/add-reminder/index.test.tsx:1:import { HeaderHeightContext } from 'expo-router/react-navigation';
src/screens/add-reminder/index.test.tsx:118:          <HeaderHeightContext.Provider value={91}>
src/screens/add-reminder/index.test.tsx:120:          </HeaderHeightContext.Provider>
src/screens/add-reminder/index.test.tsx:186:      paddingTop: 24,
src/screens/add-reminder/index.test.tsx:569:      paddingHorizontal: 20, paddingTop: 24, gap: 16, paddingBottom: 48,
src/screens/add-reminder/index.test.tsx:594:    expect(chip.props.className).toBe('h-9.5 items-center justify-center rounded-full px-3.5 bg-accent border-b-3 border-black/25');
src/screens/add-reminder/index.test.tsx:606:      expect(chip.props.className).toBe(`h-9.5 items-center justify-center rounded-full px-3.5 ${surface}`);
src/screens/add-reminder/index.test.tsx:617:    expect(selected.props.className).toBe('h-9.5 items-center justify-center rounded-full px-3.5 bg-accent border-b-3 border-black/25');
src/screens/add-reminder/index.test.tsx:620:    expect(idle.props.className).toBe('h-9.5 items-center justify-center rounded-full px-3.5 bg-category-blue');
src/screens/add-reminder/index.test.tsx:713:const CHIP_SELECTED = 'h-9.5 items-center justify-center rounded-full px-3.5 bg-accent border-b-3 border-black/25';
src/screens/add-reminder/index.test.tsx:714:const CHIP_IDLE = 'h-9.5 items-center justify-center rounded-full px-3.5 bg-default';
src/screens/health/index.test.tsx:1067:    { id: 'overdue', surface: 'size-10 items-center justify-center rounded-xl bg-category-rose', icon: 'health-icon-clock', color: 'category-rose-strong', texts: ['Vencida', '2026-01-01', '2026-02-28'], dateClass: 'font-normal text-danger' },
src/screens/health/index.test.tsx:1068:    { id: 'next', surface: 'size-10 items-center justify-center rounded-xl bg-category-amber', icon: 'health-icon-clock', color: 'category-amber-strong', texts: ['Próxima', '2026-01-02', '2026-03-31'], dateClass: 'font-normal text-muted' },
src/screens/health/index.test.tsx:1069:    { id: 'future', surface: 'size-10 items-center justify-center rounded-xl bg-category-green', icon: 'health-icon-check', color: 'category-green-strong', texts: ['Futura', '2026-01-03', '2026-04-02'], dateClass: 'font-normal text-muted' },
src/screens/health/index.test.tsx:1070:    { id: 'completed', surface: 'size-10 items-center justify-center rounded-xl bg-category-green', icon: 'health-icon-check', color: 'category-green-strong', texts: ['Sin próxima dosis', '2026-01-04'], dateClass: 'font-normal text-muted' },
src/screens/weight-log/index.test.tsx:1:import { HeaderHeightContext } from 'expo-router/react-navigation';
src/screens/weight-log/index.test.tsx:176:          <HeaderHeightContext.Provider value={91}>
src/screens/weight-log/index.test.tsx:178:          </HeaderHeightContext.Provider>
src/screens/weight-log/index.test.tsx:1042:    expect(toast.props.pointerEvents).toBe('none');
src/screens/meals-history/index.test.tsx:120:    expect(screen.getByTestId('screen-meals-history')).toHaveProp('contentInsetAdjustmentBehavior', 'automatic');
src/screens/meals-history/index.test.tsx:121:    expect(screen.getByTestId('screen-meals-history')).toHaveProp('contentContainerStyle', { paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48 });
src/screens/meals-history/index.test.tsx:418:      paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48,
src/screens/meals-history/index.test.tsx:457:      expect(arrow).toHaveProp('className', 'size-10 items-center justify-center rounded-xl bg-default');
src/screens/meals-history/index.test.tsx:520:      ? 'h-11 flex-1 items-center justify-center gap-0.5 rounded-full bg-tab-pill'
src/screens/meals-history/index.test.tsx:521:      : 'h-11 flex-1 items-center justify-center gap-0.5 rounded-full');
src/screens/login/index.test.tsx:192:    expect(screenRoot.props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/forgot/index.test.tsx:155:    expect(screenRoot.props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/forgot/index.test.tsx:306:      (c) => (c as { props: { className?: string } }).props.className === 'size-13 items-center justify-center bg-accent rounded-16',
src/screens/forgot/index.test.tsx:312:      (c) => (c as { props: { className?: string } }).props.className === 'size-13 items-center justify-center bg-accent rounded-16',
src/screens/forgot/index.test.tsx:539:  it('forgot-form lleva className y contentInsetAdjustmentBehavior de la spec en los dos estados', async () => {
src/screens/forgot/index.test.tsx:544:    expect(screen.getByTestId('forgot-form').props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/forgot/index.test.tsx:548:    expect(screen.getByTestId('forgot-form').props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/forgot/index.test.tsx:609:        className: 'size-13 items-center justify-center bg-accent rounded-16',
src/screens/forgot/index.test.tsx:624:        className: 'size-13 items-center justify-center bg-accent rounded-16',
src/screens/forgot/index.test.tsx:686:    expect(tile.props.className).toBe('size-13 items-center justify-center bg-accent rounded-16');
src/screens/docs-upload-form/index.test.tsx:17:import { HeaderHeightContext } from 'expo-router/react-navigation';
src/screens/docs-upload-form/index.test.tsx:142:            <Stack screenOptions={{ headerShown: false }} />
src/screens/docs-upload-form/index.test.tsx:147:    'pets/[petId]/docs': () => <HeaderHeightContext.Provider value={91}><DocsRoute /></HeaderHeightContext.Provider>,
src/screens/docs-upload-form/index.test.tsx:148:    'pets/[petId]/docs-upload': () => <HeaderHeightContext.Provider value={91}><DocsUploadRoute /></HeaderHeightContext.Provider>,
src/screens/docs-upload-form/index.test.tsx:704:    expect(source).toContain('keyboardVerticalOffset={headerHeight}');
src/screens/welcome/index.test.tsx:131:    expect(screen.getByTestId('screen-welcome').props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/welcome/index.test.tsx:194:    expect(screen.getByTestId('welcome-chips').props.className).toBe('flex-row justify-center gap-2');
src/screens/welcome/index.test.tsx:771:    expect(screen.getByTestId('welcome-stage').props.className).toBe('items-center justify-center');
src/screens/alert-detail/index.test.tsx:217:    expect(elementChild(card, 0).props.className).toBe(`size-18 items-center justify-center rounded-full ${solid}`);
src/screens/alert-detail/index.test.tsx:218:    expect(icon.parent?.props.className).toBe(`size-18 items-center justify-center rounded-full ${solid}`);
src/screens/alert-detail/index.test.tsx:273:    expect(root.props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/alert-detail/index.test.tsx:274:    expect(root.props.contentContainerStyle).toEqual({ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 64, gap: 14, flexGrow: 1 });
src/screens/alert-detail/index.test.tsx:954:    expect(screen.getByTestId('screen-alert-detail').props.contentContainerStyle).toEqual({ paddingHorizontal: 20, paddingTop: 24, paddingBottom: bottom + 40, gap: 14, flexGrow: 1 });
src/screens/reset-password/index.test.tsx:321:    expect(screenRoot.props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/reset-password/index.test.tsx:605:    expect(disk.props.className).toBe('size-8 items-center justify-center rounded-full bg-accent');
src/screens/reminders/index.test.tsx:299:      paddingTop: 24,
src/screens/reminders/index.test.tsx:401:      paddingTop: 24,
src/screens/reminders/index.test.tsx:549:      ['a', 'size-11.5 items-center justify-center rounded-14 bg-category-blue', 'reminders-icon-syringe', 'color:category-blue-strong'],
src/screens/reminders/index.test.tsx:550:      ['b', 'size-11.5 items-center justify-center rounded-14 bg-category-amber', 'reminders-icon-pill', 'color:category-amber-strong'],
src/screens/reminders/index.test.tsx:551:      ['c', 'size-11.5 items-center justify-center rounded-14 bg-default', 'reminders-icon-pin-tack', 'color:muted'],
src/screens/reminders/index.test.tsx:1367:    expect(tile.props.className).toBe('size-14 items-center justify-center rounded-full bg-category-rose');
src/screens/reminders/index.test.tsx:1667:    expect(container.props.className).toBe('flex-1 items-center justify-center p-6 bg-background');
src/screens/map/index.test.tsx:619:        left: 16,
src/screens/map/index.test.tsx:1223:        left: 16,
src/screens/map/index.test.tsx:1250:        left: 16,
src/screens/map/index.test.tsx:1636:      'flex-row items-center gap-2 self-start rounded-full border border-border bg-surface px-3 py-2 shadow-sm',
src/screens/map/index.test.tsx:1964:    expect(slot.parent?.props.className).toBe('flex-1 items-center justify-center p-6 bg-background');
src/screens/map/index.test.tsx:2000:    expect(slot.parent?.props.className).toBe('flex-1 items-center justify-center p-6 bg-background');
src/screens/alerts/index.test.tsx:342:    expect(list.props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/alerts/index.test.tsx:345:      paddingTop: 24,
src/screens/alerts/index.test.tsx:421:        `size-11 items-center justify-center rounded-full ${disc}`,
src/screens/alerts/index.test.tsx:443:      expect(ack.props.className.split(' ')).not.toContain('min-h-11');
src/screens/alerts/index.test.tsx:462:        'min-h-11 min-w-0 flex-1 justify-center gap-0.5',
src/screens/alerts/index.test.tsx:499:        'min-h-11 min-w-0 flex-1 justify-center gap-0.5',
src/screens/alerts/index.test.tsx:509:    expect(ack.props.className.split(' ')).not.toContain('min-h-11');
src/screens/alerts/index.test.tsx:1257:    expect(link.props.className).toBe('min-h-11 min-w-0 flex-1 justify-center gap-0.5');
```

Segundo comando, después de R22:

```text
src/components/__tests__/floating-tab-bar.test.tsx:345:    expect(style).toMatchObject({ bottom: 46, left: 16, right: 16 });
src/components/__tests__/celebration.test.tsx:169:      pointerEvents: 'none', importantForAccessibility: 'no-hide-descendants', accessibilityElementsHidden: true,
src/components/__tests__/celebration.test.tsx:436:    expect(ring.props.pointerEvents).toBe('none');
src/components/__tests__/celebration.test.tsx:514:    expect(hero.props.className).toBe('mt-10 items-center justify-center');
src/components/__tests__/pet-switcher.test.tsx:133:        `size-10 items-center justify-center overflow-hidden rounded-full ${surfaces[index]}`,
src/components/__tests__/pet-switcher.test.tsx:145:      'size-10 items-center justify-center overflow-hidden rounded-full bg-category-amber',
src/components/__tests__/back-button.test.tsx:42:    expect(back.props.className).toBe('size-11 items-center justify-center rounded-full');
src/components/__tests__/empty-state-hero.test.tsx:53:  expect(stage.props.className).toBe('h-65 w-70 items-center justify-center');
src/components/__tests__/password-input.test.tsx:76:    expect(toggle.props.className).toBe('size-11 items-center justify-center');
src/components/__tests__/pet-hero-header.test.tsx:454:  it('es una capsula rounded-full de text-2xs font-semibold, self-start, sin animate-pulse ni Chip', async () => {
src/components/__tests__/pet-hero-header.test.tsx:468:      'flex-row items-center gap-1 self-start rounded-full px-2.5 py-0.5',
src/components/__tests__/segmented-control.test.tsx:4:import { CONTINUOUS_CORNER } from '../../theme/native-styles';
src/components/__tests__/segmented-control.test.tsx:30:      expect(segment.props.className).toBe('h-9.5 flex-1 items-center justify-center rounded-10' + (selected ? ' bg-surface shadow-sm' : ''));
src/app/__tests__/tabs-layout.test.tsx:38:      headerShown: false,
src/app/__tests__/layout.test.tsx:307:    expect(props?.screenOptions).toEqual({ headerShown: false });
src/app/__tests__/layout.test.tsx:315:      [Stack.Screen, 'index', undefined],
src/app/__tests__/layout.test.tsx:316:      [Stack.Screen, '(tabs)', undefined],
src/app/__tests__/layout.test.tsx:317:      [Stack.Screen, '(auth)', undefined],
src/app/__tests__/layout.test.tsx:318:      [Stack.Screen, 'reset-password', undefined],
src/app/__tests__/layout.test.tsx:329:      [Stack.Screen, 'add-reminder'],
src/app/__tests__/layout.test.tsx:330:      [Stack.Screen, 'pets/add'],
src/app/__tests__/layout.test.tsx:331:      [Stack.Screen, 'pets/[petId]/docs'],
src/app/__tests__/layout.test.tsx:332:      [Stack.Screen, 'pets/[petId]/docs-upload'], // #185 R10
src/app/__tests__/layout.test.tsx:333:      [Stack.Screen, 'weight-log'],
src/app/__tests__/layout.test.tsx:334:      [Stack.Screen, 'meal-schedule'],
src/app/__tests__/layout.test.tsx:335:      [Stack.Screen, 'pairing'],
src/app/__tests__/layout.test.tsx:365:      headerShown: true,
src/app/__tests__/layout.test.tsx:395:      [Stack.Screen, 'reminders', undefined],
src/app/__tests__/layout.test.tsx:396:      [Stack.Screen, 'alerts', true],
src/app/__tests__/layout.test.tsx:419:      : null).toEqual([Stack.Screen, 'alerts/[alertId]', true]);
src/app/__tests__/layout.test.tsx:430:      headerShown: true,
src/app/__tests__/layout.test.tsx:469:      : null).toEqual([Stack.Screen, 'pets/[petId]/geofences', undefined]);
src/app/__tests__/layout.test.tsx:480:      headerShown: true,
src/app/__tests__/layout.test.tsx:509:      : null).toEqual([Stack.Screen, 'pets/[petId]/geofence-editor', undefined]);
src/app/__tests__/layout.test.tsx:520:      headerShown: true,
src/app/__tests__/layout.test.tsx:550:      headerShown: true,
src/app/__tests__/layout.test.tsx:577:      : undefined).toEqual([Stack.Screen, 'meals-history']);
src/app/__tests__/layout.test.tsx:580:      : undefined).toMatchObject({ headerShown: true, title: '' });
src/app/__tests__/layout.test.tsx:602:    )).toEqual([[Stack.Screen, 'welcome']]);
src/app/(auth)/__tests__/layout.test.tsx:51:        headerShown: false,
src/app/(tabs)/__tests__/food.test.tsx:574:    expect(toggle.props.className).toBe('min-h-11 justify-center');
src/app/(tabs)/__tests__/food.test.tsx:1298:    expect(progress.props.className).toBe('size-26 items-center justify-center');
src/app/(tabs)/__tests__/layout.test.tsx:79:      headerShown: false,
src/hooks/use-push-registration.navigation.test.tsx:61:      <Stack screenOptions={{ headerShown: false }} />
src/__tests__/alert-detail-canvas-fidelity.test.ts:31:  expect([...source.matchAll(/rounded-card|min-h-44|text-lg|text-2xs|text-sm|h-52([^.0-9]|$)|min-h-11/g)]).toEqual([]);
src/__tests__/design-drift.test.ts:1197:    expect(history).toContain("import { CONTINUOUS_CORNER, TABULAR_NUMS } from '../../theme/native-styles';");
src/__tests__/geofences-canvas-fidelity.test.ts:2:import { BACK_BUTTON_SIZE, EDITOR_PILL_LEFT, HEADER_BAR_HEIGHT, HEADER_ROW_TOP, TRANSPARENT_HEADER_OPTIONS, ZONES_TITLE_OFFSET } from '../theme/header-layout';
src/__tests__/geofences-canvas-fidelity.test.ts:15:    expect(mainRules).toContain('Zonas seguras (#189): `paddingHorizontal: 20`, `paddingTop: 24`, `gap: 12`, `paddingBottom: insets.bottom + 40`.');
src/__tests__/geofences-canvas-fidelity.test.ts:39:    const source = readFileSync(join(process.cwd(), 'src/theme/header-layout.ts'), 'utf8');
src/__tests__/geofences-canvas-fidelity.test.ts:44:    expect(TRANSPARENT_HEADER_OPTIONS).toEqual({ headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } });
src/__tests__/geofences-canvas-fidelity.test.ts:92:    const source = readFileSync(join(process.cwd(), 'src/theme/native-styles.ts'), 'utf8');
src/__tests__/geofences-canvas-fidelity.test.ts:149:it('#189 R22.3: el Editor no consume HeaderHeightContext ni useContext', () => {
src/__tests__/geofences-canvas-fidelity.test.ts:151:  expect(editor.source).not.toContain('HeaderHeightContext');
src/__tests__/geofences-canvas-fidelity.test.ts:152:  expect(editor.source).not.toMatch(/\buseContext\b/);
src/__tests__/consistency-classnames.test.ts:174:      'size-13 items-center justify-center bg-accent rounded-16',
src/__tests__/consistency-classnames.test.ts:177:      'size-8 shrink-0 items-center justify-center rounded-xl ${tileClassName}',
src/__tests__/consistency-classnames.test.ts:279:    const nativeStyles = readSource(join('theme', 'native-styles.ts'));
src/__tests__/consistency-classnames.test.ts:294:      /import \{[^}]*\bCONTINUOUS_CORNER\b[^}]*\} from ['"].*theme\/native-styles['"];/,
src/__tests__/consistency-classnames.test.ts:312:      "import { CONTINUOUS_CORNER } from '../theme/native-styles';",
src/__tests__/consistency-classnames.test.ts:356:      /import \{[^}]*\bTABULAR_NUMS\b[^}]*\} from ['"].*theme\/native-styles['"];/,
src/__tests__/consistency-classnames.test.ts:698:  expect(source).toContain("import { CONTINUOUS_CORNER, KEEP_OPACITY, TABULAR_NUMS } from '../../theme/native-styles';");
src/__tests__/consistency-classnames.test.ts:701:  expect(source).toContain('<KeyboardAvoidingView testID="screen-geofence-editor" className="flex-1" behavior="padding" keyboardVerticalOffset={0}>');
src/__tests__/account-screens-polish.test.ts:49:    expect(login.match(/testID="link-forgot"\s+className="min-h-11 self-end"/g) ?? []).toHaveLength(1);
src/__tests__/chunky-cta-canvas-fidelity.test.ts:110:  for (const forbidden of ['border-b-4', 'border-black', 'rounded-xl', 'min-h-11']) expect(tag).not.toContain(forbidden);
src/__tests__/chunky-cta-canvas-fidelity.test.ts:154:  expect(tag).toContain('className="size-13 items-center justify-center bg-accent rounded-16"');
src/__tests__/alerts-canvas-fidelity.test.ts:61:    "change": "#100 R6: la columna de texto de la fila pasa a dos hijos (tipo y subtítulo) con justify-center y gap-0.5",
src/screens/register/index.test.tsx:281:        .contentInsetAdjustmentBehavior,
src/screens/docs/index.test.tsx:12:import { HeaderHeightContext } from 'expo-router/react-navigation';
src/screens/docs/index.test.tsx:118:        <HeaderHeightContext.Provider value={91}>
src/screens/docs/index.test.tsx:120:        </HeaderHeightContext.Provider>
src/screens/docs/index.test.tsx:236:      'self-start rounded-full px-2 py-0.5 text-11 font-extrabold bg-category-blue text-category-blue-strong',
src/screens/docs/index.test.tsx:284:      'self-start rounded-full px-2 py-0.5 text-11 font-extrabold bg-category-blue text-category-blue-strong',
src/screens/docs/index.test.tsx:289:      'self-start rounded-full px-2 py-0.5 text-11 font-extrabold bg-default text-muted',
src/screens/docs/index.test.tsx:359:      paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48,
src/screens/docs/index.test.tsx:642:    expect(mosaic.props.className).toBe(`h-14 w-12 items-center justify-center rounded-xl ${surface}`);
src/screens/docs/index.test.tsx:650:    expect(column.children[0]).toHaveProperty('props.className', `self-start rounded-full px-2 py-0.5 text-11 font-extrabold ${surface} ${ink}`);
src/screens/docs/index.test.tsx:729:    expect(circle.props.className).toBe('size-12 items-center justify-center rounded-full bg-surface-secondary');
src/screens/docs/index.test.tsx:805:    expect(chip.props.className).toBe(`h-8.5 items-center justify-center rounded-full px-3 ${surface}`);
src/screens/docs/index.test.tsx:845:    expect(selected.props.className).toBe('h-8.5 items-center justify-center rounded-full px-3 bg-foreground');
src/screens/docs/index.test.tsx:848:    expect(all.props.className).toBe('h-8.5 items-center justify-center rounded-full px-3 bg-default');
src/screens/meal-schedule/index.test.tsx:284:    ).toEqual({ paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48 });
src/screens/meal-schedule/index.test.tsx:1088:      paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48,
src/screens/meal-schedule/index.test.tsx:1194:      expect(tile).toHaveProp('className', 'size-10.5 items-center justify-center rounded-14 bg-category-amber');
src/screens/add-pet/index.test.tsx:1:import { HeaderHeightContext, usePreventRemove } from 'expo-router/react-navigation';
src/screens/add-pet/index.test.tsx:90:        <HeaderHeightContext.Provider value={91}>
src/screens/add-pet/index.test.tsx:92:        </HeaderHeightContext.Provider>
src/screens/add-pet/index.test.tsx:137:    expect(photo.props.className).toBe('size-22 items-center justify-center rounded-full border-2 border-dashed border-accent bg-surface-secondary');
src/screens/add-pet/index.test.tsx:797:    expect(chip.props.className).toBe('h-9.5 flex-1 items-center justify-center rounded-10' + (testID === 'species-dog' ? ' bg-surface shadow-sm' : ''));
src/screens/home/index.test.tsx:34:import { TABULAR_NUMS } from '../../theme/native-styles';
src/screens/home/index.test.tsx:208:      'size-11 items-center justify-center rounded-full',
src/screens/home/index.test.tsx:2556:      expect(tile.props.className).toContain('min-h-11');
src/screens/home/index.test.tsx:3218:        `size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS[slot].surface}`,
src/screens/home/index.test.tsx:3235:      `size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS.neutral.surface}`,
src/screens/home/index.test.tsx:4107:            `size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS.blue.surface}`,
src/screens/home/index.test.tsx:4133:            `size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS.neutral.surface}`,
src/screens/home/index.test.tsx:4362:        `size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS.rose.surface}`,
src/screens/home/index.test.tsx:5477:    expect(container.props.className).toBe('flex-1 items-center justify-center px-5 py-6 bg-background'); // (enmendado por #176 R3)
src/screens/home/weekly-activity-chart.test.tsx:21:import { TABULAR_NUMS } from '../../theme/native-styles';
src/screens/home/weekly-activity-chart.test.tsx:843:      segments.every(({ props }) => props.className.includes('h-11')),
src/screens/home/weekly-activity-chart.test.tsx:1028:    expect(spanishColumn.props.className).toContain('min-h-11');
src/screens/home/weekly-activity-chart.test.tsx:1686:    const resting = 'min-h-11 flex-1 items-center justify-end';
src/screens/home/weekly-activity-chart.test.tsx:1688:      'min-h-11 flex-1 items-center justify-end border-t-2 border-accent-strong';
src/screens/home/weekly-activity-chart.test.tsx:2279:    const resting = 'min-h-11 flex-1 items-center justify-end';
src/screens/home/weekly-activity-chart.test.tsx:2281:      'min-h-11 flex-1 items-center justify-end border-t-2 border-accent-strong';
src/screens/pairing/index.test.tsx:1:import { HeaderHeightContext } from 'expo-router/react-navigation';
src/screens/pairing/index.test.tsx:160:          <HeaderHeightContext.Provider value={91}>
src/screens/pairing/index.test.tsx:162:          </HeaderHeightContext.Provider>
src/screens/pairing/index.test.tsx:622:      expect(source).not.toContain('size-16 items-center justify-center rounded-full bg-accent-soft');
src/screens/pairing/index.test.tsx:1213:      'size-9', 'items-center', 'justify-center', 'overflow-hidden', 'rounded-full', 'bg-category-amber',
src/screens/pairing/index.test.tsx:1259:      'w-50', 'h-37.5', 'items-center', 'justify-center',
src/screens/profile/index.test.tsx:1374:    expect(camera.props.className).toBe('absolute -bottom-0.5 -right-0.5 size-8.5 items-center justify-center rounded-full border-3 border-surface-secondary bg-accent');
src/screens/profile/index.test.tsx:1548:    expect(root.props.className).toBe('flex-row flex-wrap justify-center gap-1.5');
src/screens/profile/index.test.tsx:1730:      expect(avatar.props.className).toBe('size-8.5 items-center justify-center rounded-full bg-default');
src/screens/add-reminder/index.test.tsx:1:import { HeaderHeightContext } from 'expo-router/react-navigation';
src/screens/add-reminder/index.test.tsx:118:          <HeaderHeightContext.Provider value={91}>
src/screens/add-reminder/index.test.tsx:120:          </HeaderHeightContext.Provider>
src/screens/add-reminder/index.test.tsx:186:      paddingTop: 24,
src/screens/add-reminder/index.test.tsx:569:      paddingHorizontal: 20, paddingTop: 24, gap: 16, paddingBottom: 48,
src/screens/add-reminder/index.test.tsx:594:    expect(chip.props.className).toBe('h-9.5 items-center justify-center rounded-full px-3.5 bg-accent border-b-3 border-black/25');
src/screens/add-reminder/index.test.tsx:606:      expect(chip.props.className).toBe(`h-9.5 items-center justify-center rounded-full px-3.5 ${surface}`);
src/screens/add-reminder/index.test.tsx:617:    expect(selected.props.className).toBe('h-9.5 items-center justify-center rounded-full px-3.5 bg-accent border-b-3 border-black/25');
src/screens/add-reminder/index.test.tsx:620:    expect(idle.props.className).toBe('h-9.5 items-center justify-center rounded-full px-3.5 bg-category-blue');
src/screens/add-reminder/index.test.tsx:713:const CHIP_SELECTED = 'h-9.5 items-center justify-center rounded-full px-3.5 bg-accent border-b-3 border-black/25';
src/screens/add-reminder/index.test.tsx:714:const CHIP_IDLE = 'h-9.5 items-center justify-center rounded-full px-3.5 bg-default';
src/screens/health/index.test.tsx:1067:    { id: 'overdue', surface: 'size-10 items-center justify-center rounded-xl bg-category-rose', icon: 'health-icon-clock', color: 'category-rose-strong', texts: ['Vencida', '2026-01-01', '2026-02-28'], dateClass: 'font-normal text-danger' },
src/screens/health/index.test.tsx:1068:    { id: 'next', surface: 'size-10 items-center justify-center rounded-xl bg-category-amber', icon: 'health-icon-clock', color: 'category-amber-strong', texts: ['Próxima', '2026-01-02', '2026-03-31'], dateClass: 'font-normal text-muted' },
src/screens/health/index.test.tsx:1069:    { id: 'future', surface: 'size-10 items-center justify-center rounded-xl bg-category-green', icon: 'health-icon-check', color: 'category-green-strong', texts: ['Futura', '2026-01-03', '2026-04-02'], dateClass: 'font-normal text-muted' },
src/screens/health/index.test.tsx:1070:    { id: 'completed', surface: 'size-10 items-center justify-center rounded-xl bg-category-green', icon: 'health-icon-check', color: 'category-green-strong', texts: ['Sin próxima dosis', '2026-01-04'], dateClass: 'font-normal text-muted' },
src/screens/weight-log/index.test.tsx:1:import { HeaderHeightContext } from 'expo-router/react-navigation';
src/screens/weight-log/index.test.tsx:176:          <HeaderHeightContext.Provider value={91}>
src/screens/weight-log/index.test.tsx:178:          </HeaderHeightContext.Provider>
src/screens/weight-log/index.test.tsx:1042:    expect(toast.props.pointerEvents).toBe('none');
src/screens/meals-history/index.test.tsx:120:    expect(screen.getByTestId('screen-meals-history')).toHaveProp('contentInsetAdjustmentBehavior', 'automatic');
src/screens/meals-history/index.test.tsx:121:    expect(screen.getByTestId('screen-meals-history')).toHaveProp('contentContainerStyle', { paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48 });
src/screens/meals-history/index.test.tsx:418:      paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48,
src/screens/meals-history/index.test.tsx:457:      expect(arrow).toHaveProp('className', 'size-10 items-center justify-center rounded-xl bg-default');
src/screens/meals-history/index.test.tsx:520:      ? 'h-11 flex-1 items-center justify-center gap-0.5 rounded-full bg-tab-pill'
src/screens/meals-history/index.test.tsx:521:      : 'h-11 flex-1 items-center justify-center gap-0.5 rounded-full');
src/screens/login/index.test.tsx:192:    expect(screenRoot.props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/forgot/index.test.tsx:155:    expect(screenRoot.props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/forgot/index.test.tsx:306:      (c) => (c as { props: { className?: string } }).props.className === 'size-13 items-center justify-center bg-accent rounded-16',
src/screens/forgot/index.test.tsx:312:      (c) => (c as { props: { className?: string } }).props.className === 'size-13 items-center justify-center bg-accent rounded-16',
src/screens/forgot/index.test.tsx:539:  it('forgot-form lleva className y contentInsetAdjustmentBehavior de la spec en los dos estados', async () => {
src/screens/forgot/index.test.tsx:544:    expect(screen.getByTestId('forgot-form').props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/forgot/index.test.tsx:548:    expect(screen.getByTestId('forgot-form').props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/forgot/index.test.tsx:609:        className: 'size-13 items-center justify-center bg-accent rounded-16',
src/screens/forgot/index.test.tsx:624:        className: 'size-13 items-center justify-center bg-accent rounded-16',
src/screens/forgot/index.test.tsx:686:    expect(tile.props.className).toBe('size-13 items-center justify-center bg-accent rounded-16');
src/screens/docs-upload-form/index.test.tsx:17:import { HeaderHeightContext } from 'expo-router/react-navigation';
src/screens/docs-upload-form/index.test.tsx:142:            <Stack screenOptions={{ headerShown: false }} />
src/screens/docs-upload-form/index.test.tsx:147:    'pets/[petId]/docs': () => <HeaderHeightContext.Provider value={91}><DocsRoute /></HeaderHeightContext.Provider>,
src/screens/docs-upload-form/index.test.tsx:148:    'pets/[petId]/docs-upload': () => <HeaderHeightContext.Provider value={91}><DocsUploadRoute /></HeaderHeightContext.Provider>,
src/screens/docs-upload-form/index.test.tsx:704:    expect(source).toContain('keyboardVerticalOffset={headerHeight}');
src/screens/welcome/index.test.tsx:131:    expect(screen.getByTestId('screen-welcome').props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/welcome/index.test.tsx:194:    expect(screen.getByTestId('welcome-chips').props.className).toBe('flex-row justify-center gap-2');
src/screens/welcome/index.test.tsx:771:    expect(screen.getByTestId('welcome-stage').props.className).toBe('items-center justify-center');
src/screens/alert-detail/index.test.tsx:217:    expect(elementChild(card, 0).props.className).toBe(`size-18 items-center justify-center rounded-full ${solid}`);
src/screens/alert-detail/index.test.tsx:218:    expect(icon.parent?.props.className).toBe(`size-18 items-center justify-center rounded-full ${solid}`);
src/screens/alert-detail/index.test.tsx:273:    expect(root.props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/alert-detail/index.test.tsx:274:    expect(root.props.contentContainerStyle).toEqual({ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 64, gap: 14, flexGrow: 1 });
src/screens/alert-detail/index.test.tsx:954:    expect(screen.getByTestId('screen-alert-detail').props.contentContainerStyle).toEqual({ paddingHorizontal: 20, paddingTop: 24, paddingBottom: bottom + 40, gap: 14, flexGrow: 1 });
src/screens/reset-password/index.test.tsx:321:    expect(screenRoot.props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/reset-password/index.test.tsx:605:    expect(disk.props.className).toBe('size-8 items-center justify-center rounded-full bg-accent');
src/screens/reminders/index.test.tsx:299:      paddingTop: 24,
src/screens/reminders/index.test.tsx:401:      paddingTop: 24,
src/screens/reminders/index.test.tsx:549:      ['a', 'size-11.5 items-center justify-center rounded-14 bg-category-blue', 'reminders-icon-syringe', 'color:category-blue-strong'],
src/screens/reminders/index.test.tsx:550:      ['b', 'size-11.5 items-center justify-center rounded-14 bg-category-amber', 'reminders-icon-pill', 'color:category-amber-strong'],
src/screens/reminders/index.test.tsx:551:      ['c', 'size-11.5 items-center justify-center rounded-14 bg-default', 'reminders-icon-pin-tack', 'color:muted'],
src/screens/reminders/index.test.tsx:1367:    expect(tile.props.className).toBe('size-14 items-center justify-center rounded-full bg-category-rose');
src/screens/reminders/index.test.tsx:1667:    expect(container.props.className).toBe('flex-1 items-center justify-center p-6 bg-background');
src/screens/map/index.test.tsx:619:        left: 16,
src/screens/map/index.test.tsx:1223:        left: 16,
src/screens/map/index.test.tsx:1250:        left: 16,
src/screens/map/index.test.tsx:1636:      'flex-row items-center gap-2 self-start rounded-full border border-border bg-surface px-3 py-2 shadow-sm',
src/screens/map/index.test.tsx:1964:    expect(slot.parent?.props.className).toBe('flex-1 items-center justify-center p-6 bg-background');
src/screens/map/index.test.tsx:2000:    expect(slot.parent?.props.className).toBe('flex-1 items-center justify-center p-6 bg-background');
src/screens/alerts/index.test.tsx:342:    expect(list.props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/alerts/index.test.tsx:345:      paddingTop: 24,
src/screens/alerts/index.test.tsx:421:        `size-11 items-center justify-center rounded-full ${disc}`,
src/screens/alerts/index.test.tsx:443:      expect(ack.props.className.split(' ')).not.toContain('min-h-11');
src/screens/alerts/index.test.tsx:462:        'min-h-11 min-w-0 flex-1 justify-center gap-0.5',
src/screens/alerts/index.test.tsx:499:        'min-h-11 min-w-0 flex-1 justify-center gap-0.5',
src/screens/alerts/index.test.tsx:509:    expect(ack.props.className.split(' ')).not.toContain('min-h-11');
src/screens/alerts/index.test.tsx:1257:    expect(link.props.className).toBe('min-h-11 min-w-0 flex-1 justify-center gap-0.5');
```

El sentinel .done señala fin de esta ejecución detenida, no cierre ni aprobación de E4. El informe conserva los estados históricos de las reanudaciones anteriores; el estado vigente es esta parada.

#### Novena reanudación — cierre E4/E6, 2026-10-22

Inicio en HEAD `93785dc43be9dd253909b39fe9f510c9e4517aeb`, cwd `/home/claude/sites/Pet-Tracker-wt-189`, branch `feature/189-mobile-geofences-canvas-fidelity`. NOVENA REANUDACIÓN y tasks §Aclaración P-E4-8 mandan sobre la atribución anterior: 42 literal se prueba en C y 50 literal en F ES/EN. Firmas E4/E5/E6 verificadas (una cada una); árbol de código/spec/docs limpio, informe WIP y documentos del leader conservados.

Skills leídas: `building-native-ui`, `expo-tailwind-setup` (cache oficial Expo 11c74d6b), `appllama-app-design-skill` del repo y `ponytail`; ninguna solicitada ausente. Consultada la [referencia oficial SDK 57](https://docs.expo.dev/versions/v57.0.0/) exigida por mobile/AGENTS.md. Los valores y patrones de la spec/carta prevalecen; MCP appllama y smoke Android reservados según handoff. No se ejecutan init.sh/push/PR ni se modifican casillas o bookkeeping.

Se ejecutan sondas secuenciales con ambas guardas pgrep vacías y restauración exacta en `finally`; cada salida roja debe nombrar el candado previsto.

##### Parada obligatoria — guarda de procesos ocupada antes de P-E4-8

El ejecutor `/tmp/e4-probe-189.cjs` abortó en su primera llamada a `guard()`, ANTES de escribir la mutación de `paddingLeft: 42`. `pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'` devolvió los PID `293150`, `293207`, `293208`, `293209`. Verificación read-only con `ps -p … -o pid,ppid,args`:

```text
293150 293143 node /home/claude/sites/Pet-Tracker-wt-195/mobile-pet-tracker/node_modules/.bin/jest src/components/__tests__/pet-hero-header(-motion)?.test.tsx|src/screens/home/index.test.tsx --testTimeout=30000 --silent
293207 293150 /usr/bin/node /home/claude/sites/Pet-Tracker-wt-195/mobile-pet-tracker/node_modules/jest-worker/build/workers/processChild.js
293208 293150 /usr/bin/node /home/claude/sites/Pet-Tracker-wt-195/mobile-pet-tracker/node_modules/jest-worker/build/workers/processChild.js
293209 293150 /usr/bin/node /home/claude/sites/Pet-Tracker-wt-195/mobile-pet-tracker/node_modules/jest-worker/build/workers/processChild.js
```

No es una contradicción nueva de la spec ni un error de invocación: la guarda detectó procesos reales del worktree vecino. Se aplica la regla vigente del handoff «Solo PARA si falla el código, una cifra de esta lista o una guarda». No se estrecha el patrón, no se detienen procesos ajenos y no se reintenta eludiendo la parada. El ejecutor no alcanzó la segunda guarda; no se afirma que estuviera vacía.

Resultado de esta ejecución: ninguna mutación plantada; ninguna línea `Tests:` nueva. Las dos sustituciones de P-E4-8, P-E4-9..13 y P-E6-1..3 quedan sin ejecutar. Medidas finales, suite completa, typecheck, lint, graphify, traceability y commit documental de cierre E4/E6 quedan sin ejecutar por esta parada. `git diff --stat -- mobile-pet-tracker/ specs/ docs/` vacío; HEAD permanece `93785dc43be9dd253909b39fe9f510c9e4517aeb`. Solo se añade esta subsección al informe; documentos del leader y patch preexistente conservados.

El sentinel `.done` indica el fin de esta ejecución detenida, sin afirmar cierre o aprobación de E4/E6. El estado vigente es esta parada por guarda ocupada.

##### Reanudación autorizada tras liberarse la guarda

Se mantiene HEAD `93785dc4` y la branch indicada; código/spec/docs sin modificaciones. Ambas guardas, con sus patrones originales, comprobadas vacías (pgrep exit 1). Se retoman las dos mutaciones P-E4-8 y las sondas pendientes, sin repetir las ya registradas. Las cuatro skills siguen cargadas; no se estrechan patrones ni se alteran aserciones.

Sonda P-E4-9-offset (src/screens/geofence-editor/index.test.tsx): exit 1; `Tests:       1 failed, 119 passed, 120 total`. Fallos: ● #146 R6: el editor pinta el formulario sobre el mapa y sus estados › compone mapa y formulario sin fondo sobre el mapa y con las métricas A11 en el formulario (enmendado por #189 R9) (enmendado por E4 R22). Log `e4-e9-P-E4-9-offset-0.log`. Rojo esperado; restauración exacta en finally.

P-E4-9 import: ancla negativa M12 mutada = 1 (base final 0).

Sonda P-E4-9-import (src/__tests__/geofences-canvas-fidelity.test.ts): exit 1; `Tests:       1 failed, 27 passed, 28 total`. Fallos: ● #189 R22.3: el Editor no consume HeaderHeightContext ni useContext. Log `e4-e9-P-E4-9-import-0.log`. Rojo esperado; restauración exacta en finally.

P-E4-8 sustitución literal42: exit 1; `Tests:       1 failed, 27 passed, 28 total`. ● #189 R23: geometría compartida con ventana independiente › #189 R23.2: geofences no repite los literales de geometría. Fuente restaurada exactamente por finally; log `e4-e9-P-E4-8-literal42-0.log`.

P-E4-8 sustitución literal50: exit 1; `Tests:       2 failed, 94 passed, 96 total`. ● #189 R1: título y contador en el contenido › #189 R1.2: el título de es tiene clase, rol y posición exactos (enmendado por #189 R3) (enmendado por E4 R21); ● #189 R1: título y contador en el contenido › #189 R1.2: el título de en tiene clase, rol y posición exactos (enmendado por #189 R3) (enmendado por E4 R21). Fuente restaurada exactamente por finally; log `e4-e9-P-E4-8-literal50-0.log`.

Sonda P-E4-10-left (src/screens/geofence-editor/index.test.tsx): exit 1; `Tests:       6 failed, 114 passed, 120 total`. Fallos: ● #189 R8: título en contenido y píldora de cristal sobre el mapa › #189 R8: título del formulario al editar en es (light) (enmendado por E4 R22); ● #189 R8: título en contenido y píldora de cristal sobre el mapa › #189 R8: título del formulario al crear en es (light) (enmendado por E4 R22); ● #189 R8: título en contenido y píldora de cristal sobre el mapa › #189 R8: título del formulario al lectura en es (light) (enmendado por E4 R22); ● #189 R8: título en contenido y píldora de cristal sobre el mapa › #189 R8: título del formulario al editar en en (dark) (enmendado por E4 R22); ● #189 R8: título en contenido y píldora de cristal sobre el mapa › #189 R8: título del formulario al crear en en (dark) (enmendado por E4 R22); ● #189 R8: título en contenido y píldora de cristal sobre el mapa › #189 R8: título del formulario al lectura en en (dark) (enmendado por E4 R22). Log `e4-e9-P-E4-10-left-0.log`. Rojo esperado; restauración exacta en finally.

Sonda P-E4-10-blur (src/screens/geofence-editor/index.test.tsx): exit 1; `Tests:       6 failed, 114 passed, 120 total`. Fallos: ● #189 R8: título en contenido y píldora de cristal sobre el mapa › #189 R8: título del formulario al editar en es (light) (enmendado por E4 R22); ● #189 R8: título en contenido y píldora de cristal sobre el mapa › #189 R8: título del formulario al crear en es (light) (enmendado por E4 R22); ● #189 R8: título en contenido y píldora de cristal sobre el mapa › #189 R8: título del formulario al lectura en es (light) (enmendado por E4 R22); ● #189 R8: título en contenido y píldora de cristal sobre el mapa › #189 R8: título del formulario al editar en en (dark) (enmendado por E4 R22); ● #189 R8: título en contenido y píldora de cristal sobre el mapa › #189 R8: título del formulario al crear en en (dark) (enmendado por E4 R22); ● #189 R8: título en contenido y píldora de cristal sobre el mapa › #189 R8: título del formulario al lectura en en (dark) (enmendado por E4 R22). Log `e4-e9-P-E4-10-blur-0.log`. Rojo esperado; restauración exacta en finally.

Sonda P-E4-11-state (src/screens/geofence-editor/index.test.tsx): exit 1; `Tests:       7 failed, 113 passed, 120 total`. Fallos: ● #189 R22: opciones estables por rama de la cabecera › #189 R22.2: cabecera opaca en carga; ● #189 R22: opciones estables por rama de la cabecera › #189 R22.2: cabecera opaca en no-tracking; ● #189 R22: opciones estables por rama de la cabecera › #189 R22.2: cabecera opaca en error; ● #189 R22: opciones estables por rama de la cabecera › #189 R22.2: cabecera opaca en no-encontrada; ● #189 R22: opciones estables por rama de la cabecera › #189 R22.2: cabecera opaca en solo-dueño; ● #189 R22: opciones estables por rama de la cabecera › #189 R22.2: restaura la cabecera opaca al pasar del formulario a estado; ● #189 R22: opciones estables por rama de la cabecera › #189 R22.1/R22.2: identidad estable de opciones en estado. Log `e4-e9-P-E4-11-state-0.log`. Rojo esperado; restauración exacta en finally.

Sonda P-E4-11-form (src/screens/geofence-editor/index.test.tsx): exit 1; `Tests:       5 failed, 115 passed, 120 total`. Fallos: ● #189 R22: opciones estables por rama de la cabecera › #189 R22.1: cabecera transparente al editar; ● #189 R22: opciones estables por rama de la cabecera › #189 R22.1: cabecera transparente al crear; ● #189 R22: opciones estables por rama de la cabecera › #189 R22.1: cabecera transparente al lectura; ● #189 R22: opciones estables por rama de la cabecera › #189 R22.2: restaura la cabecera opaca al pasar del formulario a estado; ● #189 R22: opciones estables por rama de la cabecera › #189 R22.1/R22.2: identidad estable de opciones en formulario. Log `e4-e9-P-E4-11-form-0.log`. Rojo esperado; restauración exacta en finally.

Sonda P-E4-12-form (src/screens/geofence-editor/index.test.tsx): exit 1; `Tests:       1 failed, 119 passed, 120 total`. Fallos: ● #189 R22: opciones estables por rama de la cabecera › #189 R22.1/R22.2: identidad estable de opciones en formulario. Log `e4-e9-P-E4-12-form-0.log`. Rojo esperado; restauración exacta en finally.

Sonda P-E4-12-state (src/screens/geofence-editor/index.test.tsx): exit 1; `Tests:       1 failed, 119 passed, 120 total`. Fallos: ● #189 R22: opciones estables por rama de la cabecera › #189 R22.1/R22.2: identidad estable de opciones en estado. Log `e4-e9-P-E4-12-state-0.log`. Rojo esperado; restauración exacta en finally.

Sonda P-E4-13 (src/screens/geofences/index.test.tsx): exit 1; `Tests:       2 failed, 94 passed, 96 total`. Fallos: ● #189 R1: título y contador en el contenido › #189 R1.2: el título de es tiene clase, rol y posición exactos (enmendado por #189 R3) (enmendado por E4 R21); ● #189 R1: título y contador en el contenido › #189 R1.2: el título de en tiene clase, rol y posición exactos (enmendado por #189 R3) (enmendado por E4 R21). Log `e4-e9-P-E4-13-0.log`. Rojo esperado; restauración exacta en finally.

Sonda P-E6-1 (src/__tests__/consistency-classnames.test.ts): exit 1; `Tests:       1 failed, 74 passed, 75 total`. Fallos: ● #189 R9: la hoja del Editor combina esquina continua y flex sin perderlos (enmendado por E4 R19) (enmendado por E4 R22). Log `e4-e9-P-E6-1-0.log`. Rojo esperado; restauración exacta en finally.

Sonda P-E6-2 (src/__tests__/consistency-classnames.test.ts): exit 1; `Tests:       1 failed, 74 passed, 75 total`. Fallos: ● #189 R9: la hoja del Editor combina esquina continua y flex sin perderlos (enmendado por E4 R19) (enmendado por E4 R22). Log `e4-e9-P-E6-2-0.log`. Rojo esperado; restauración exacta en finally.

Sonda P-E6-2 (src/screens/geofence-editor/index.test.tsx): exit 1; `Tests:       1 failed, 119 passed, 120 total`. Fallos: ● #146 R6: el editor pinta el formulario sobre el mapa y sus estados › compone mapa y formulario sin fondo sobre el mapa y con las métricas A11 en el formulario (enmendado por #189 R9) (enmendado por E4 R22). Log `e4-e9-P-E6-2-1.log`. Rojo esperado; restauración exacta en finally.

Sonda P-E6-3 (src/__tests__/consistency-classnames.test.ts): exit 1; `Tests:       1 failed, 74 passed, 75 total`. Fallos: ● #189 R9: la hoja del Editor combina esquina continua y flex sin perderlos (enmendado por E4 R19) (enmendado por E4 R22). Log `e4-e9-P-E6-3-0.log`. Rojo esperado; restauración exacta en finally.

Suite completa de cierre (`bun run test`, guardas originales vacías): exit 0; `Test Suites: 131 passed, 131 total`; `Tests:       4426 passed, 4426 total`; `Snapshots:   1 passed, 1 total`; `Time:        130.18 s, estimated 134 s`. Log `e9-closure-test-189.log`.

##### Cierre automatizado E4/E5/E6 — estado vigente

**Completado** sobre código `93785dc4`. Este estado sustituye las paradas históricas preservadas arriba. H0-E4: `cc175325fb42632e48254569af21e89dbc362843`; H0-E5: `ae69eee5857acdc9766509621dd479ef05067bb3`; H0-E6: `0babf6460c115dd5218f3757efa0cc417a62d2cf`. H0 original del diff: `4204530e`.

Los 28 casos nuevos se reparten: C 17→28 (+11), F 94→96 (+2), E 105→120 (+15); sin casos borrados. Total 4398 + 28 = 4426, 131 suites y 1 snapshot. `chunky` conserva sus 76 casos (las 74 de algunas notas antiguas eran anteriores a esta base). La suite completa valida también todos los candados agregados; logs rojos/verdes por commit se conservan arriba.

Medidas obtenidas comparando las fuentes versionadas de la firma H0-E4 con HEAD; ninguna mutación entra en ellas. Evidencia íntegra en `e9-final-measures-189.log`, revalidada tras las sondas.

| Medida | Base + delta = final |
|---|---|
| M10: isDisabled Zonas/Editor | 2 +0 = 2 / 3 +0 = 3 |
| M11: KEEP_OPACITY Zonas/Editor/native-styles | 0 +4 = 4 / 0 +5 = 5 / 0 +1 = 1 |
| M12: HeaderHeightContext Editor | 2 -2 = 0 |
| M13: offset headerHeight/0 | 1 -1 = 0 / 0 +1 = 1 |
| M14: inset automático Zonas/Editor | 1 -1 = 0 / 1 +0 = 1 |
| M15: Stack.Screen Editor/Zonas | 0 +2 = 2 / 0 +0 = 0 |
| M16: header-layout | ausente → existe, seis export const |
| M17: TRANSPARENT_HEADER_OPTIONS layout/Editor | 0 +2 = 2 / 0 +2 = 2 |
| M18: títulos nativos traducidos | 0 +0 = 0 |
| M19: chunkyLip Zonas/Editor/design-drift | 2 +0 = 2 / 3 +0 = 3 / 0 +0 = 0 |
| export const native-styles | 2 + 1 = 3 |
| Forma vieja `? undefined : chunkyLip.primary` Zonas/Editor | 1/1 − 1/1 = 0/0; probada por P-E4-3 |

##### Candados agregados: base E4 + delta = final

Se miden las cifras sin adaptar código ni tests. `design-drift` y `heroui-text-size-merge` tienen diff vacío desde H0-E4. `consistency` solo mueve C1/C2 en su único it autorizado.

| Inventario | Base + delta = final |
|---|---|
| rounded-16 global; Zonas/Editor | 30 + 0 = 30; 2/3 + 0/0 = 2/3 |
| style CONTINUOUS_CORNER directo global; refs Zonas/Editor | 41 + 0 = 41; 4/2 + 0/0 = 4/2 |
| TABULAR_NUMS directo global | 34 + 0 = 34; Editor 1, Zonas 0 |
| Primarios semánticos; primarios literales | 17 + 0 = 17; 15 + 0 = 15 |
| Neutros semánticos por fila NEUTRAL_ROWS; primaryCompact | siete ficheros, uno cada uno, delta 0; reminders 1 + 0 = 1 |
| NEUTRAL_ROWS / inventario secundarios | 7/10 + 0/0 = 7/10 |
| Button.Label aperturas / menciones | 17/46 + 0/0 = 17/46 |
| text-17 / Text acento / foreground / bold accent-strong | 26/15/6/1 + 0 = 26/15/6/1 |
| border-lip-gray | 11 + 0 = 11 |
| HeroUI / className / Card / ficheros HeroUI | 197/163/41/30 + 0 = 197/163/41/30; pisos 197/163/41/28 intactos; cero findings |
| expo-blur | 3 + 0 = 3 consumidores |
| rounded-14 / rounded-tile / rounded-hero | 6/6/3 + 0 = 6/6/3 consumidores |
| text-26 / text-13 / text-15 / tracking-title | 8/15/14/12 + 0 = 8/15/14/12 consumidores |
| copy / idiomas / catálogo | sin cambio desde E4; Editor title exactamente 2; tablas 22/31 |

Enmiendas E4: `#177 R3.1` mueve las dos formas condicionales; `R4.1` mueve solo el neutro del Editor; `R7.5`/`R8.1` amplían predicados manteniendo todos los inventarios/ids. E5 cierra las tres igualdades con borderCurve, transform y opacity; P-E4-4 confirma que boxShadow extra falla. E6 mueve solo el import C1 y la etiqueta C2; esquina y recuento CONTINUOUS_CORNER=2 permanecen.

##### M20 final — barrido y clasificación

Comandos exactos de §4.6 ejecutados de nuevo: `e9-m20-final-files.log` y `e9-m20-final-lines.log`. H0-E6: 62 rutas/181 líneas; tras R22: 62/184; cierre: 62/184. Comparación normalizando únicamente números de línea: tras R22, R24 retira una coincidencia del literal paddingTop:24 en R16.1 y añade una coincidencia de la frase de transparencia R24.1. Ambas pertenecen a C, en la lista cerrada y en R24. C1/C2 y el candado negativo R22.3 explican el delta restante desde H0-E6. No hay línea nueva no clasificada que fije un literal de E4. Se pega la salida completa final de los dos comandos:

```text
src/__tests__/account-screens-polish.test.ts
src/__tests__/add-pet-two-steps.test.ts
src/__tests__/alert-detail-canvas-fidelity.test.ts
src/__tests__/alerts-canvas-fidelity.test.ts
src/__tests__/chunky-cta-canvas-fidelity.test.ts
src/__tests__/consistency-classnames.test.ts
src/__tests__/design-drift.test.ts
src/__tests__/forms-validation-global.test.ts
src/__tests__/geofences-canvas-fidelity.test.ts
src/__tests__/hero-header-amendments.test.ts
src/__tests__/heroui-text-size-merge.test.ts
src/__tests__/home-pingo-phrase.test.ts
src/__tests__/hosting-artifacts.test.ts
src/__tests__/legibility-classnames.test.ts
src/__tests__/no-pets-states.test.ts
src/__tests__/pairing-canvas-fidelity.test.ts
src/__tests__/profile-canvas-fidelity.test.ts
src/__tests__/tab-headers-canvas.test.ts
src/__tests__/ui-language.test.ts
src/app/(auth)/__tests__/layout.test.tsx
src/app/(tabs)/__tests__/alerts.test.tsx
src/app/(tabs)/__tests__/food.test.tsx
src/app/(tabs)/__tests__/layout.test.tsx
src/app/__tests__/detail-stack.test.tsx
src/app/__tests__/layout.test.tsx
src/app/__tests__/tabs-layout.test.tsx
src/components/__tests__/celebration.test.tsx
src/components/__tests__/empty-state-hero.test.tsx
src/components/__tests__/empty-state.test.tsx
src/components/__tests__/field-error-message.test.tsx
src/components/__tests__/floating-tab-bar.test.tsx
src/components/__tests__/pet-hero-header.test.tsx
src/components/__tests__/segmented-control.test.tsx
src/hooks/use-pet-selection.test.tsx
src/hooks/use-push-registration.navigation.test.tsx
src/providers/__tests__/language-provider.test.tsx
src/screens/add-pet/index.test.tsx
src/screens/add-reminder/index.test.tsx
src/screens/alert-detail/index.test.tsx
src/screens/alerts/index.test.tsx
src/screens/docs-upload-form/index.test.tsx
src/screens/docs/index.test.tsx
src/screens/forgot/index.test.tsx
src/screens/geofence-editor/index.test.tsx
src/screens/geofences/index.test.tsx
src/screens/home/index.test.tsx
src/screens/home/weekly-activity-chart.test.tsx
src/screens/login/index.test.tsx
src/screens/map/index.test.tsx
src/screens/meal-schedule/index.test.tsx
src/screens/meals-history/index.test.tsx
src/screens/pairing/index.test.tsx
src/screens/profile/index.test.tsx
src/screens/register/index.test.tsx
src/screens/reminders/index.test.tsx
src/screens/reset-password/index.test.tsx
src/screens/weight-log/index.test.tsx
src/screens/welcome/index.test.tsx
src/theme/__tests__/font-registration.test.ts
src/theme/__tests__/global-css.test.ts
src/theme/__tests__/motion.test.ts
src/utils/form-rules.test.ts
```

```text
src/components/__tests__/floating-tab-bar.test.tsx:345:    expect(style).toMatchObject({ bottom: 46, left: 16, right: 16 });
src/components/__tests__/celebration.test.tsx:169:      pointerEvents: 'none', importantForAccessibility: 'no-hide-descendants', accessibilityElementsHidden: true,
src/components/__tests__/celebration.test.tsx:436:    expect(ring.props.pointerEvents).toBe('none');
src/components/__tests__/celebration.test.tsx:514:    expect(hero.props.className).toBe('mt-10 items-center justify-center');
src/components/__tests__/pet-switcher.test.tsx:133:        `size-10 items-center justify-center overflow-hidden rounded-full ${surfaces[index]}`,
src/components/__tests__/pet-switcher.test.tsx:145:      'size-10 items-center justify-center overflow-hidden rounded-full bg-category-amber',
src/components/__tests__/back-button.test.tsx:42:    expect(back.props.className).toBe('size-11 items-center justify-center rounded-full');
src/components/__tests__/empty-state-hero.test.tsx:53:  expect(stage.props.className).toBe('h-65 w-70 items-center justify-center');
src/components/__tests__/password-input.test.tsx:76:    expect(toggle.props.className).toBe('size-11 items-center justify-center');
src/components/__tests__/pet-hero-header.test.tsx:454:  it('es una capsula rounded-full de text-2xs font-semibold, self-start, sin animate-pulse ni Chip', async () => {
src/components/__tests__/pet-hero-header.test.tsx:468:      'flex-row items-center gap-1 self-start rounded-full px-2.5 py-0.5',
src/components/__tests__/segmented-control.test.tsx:4:import { CONTINUOUS_CORNER } from '../../theme/native-styles';
src/components/__tests__/segmented-control.test.tsx:30:      expect(segment.props.className).toBe('h-9.5 flex-1 items-center justify-center rounded-10' + (selected ? ' bg-surface shadow-sm' : ''));
src/app/__tests__/tabs-layout.test.tsx:38:      headerShown: false,
src/app/__tests__/layout.test.tsx:307:    expect(props?.screenOptions).toEqual({ headerShown: false });
src/app/__tests__/layout.test.tsx:315:      [Stack.Screen, 'index', undefined],
src/app/__tests__/layout.test.tsx:316:      [Stack.Screen, '(tabs)', undefined],
src/app/__tests__/layout.test.tsx:317:      [Stack.Screen, '(auth)', undefined],
src/app/__tests__/layout.test.tsx:318:      [Stack.Screen, 'reset-password', undefined],
src/app/__tests__/layout.test.tsx:329:      [Stack.Screen, 'add-reminder'],
src/app/__tests__/layout.test.tsx:330:      [Stack.Screen, 'pets/add'],
src/app/__tests__/layout.test.tsx:331:      [Stack.Screen, 'pets/[petId]/docs'],
src/app/__tests__/layout.test.tsx:332:      [Stack.Screen, 'pets/[petId]/docs-upload'], // #185 R10
src/app/__tests__/layout.test.tsx:333:      [Stack.Screen, 'weight-log'],
src/app/__tests__/layout.test.tsx:334:      [Stack.Screen, 'meal-schedule'],
src/app/__tests__/layout.test.tsx:335:      [Stack.Screen, 'pairing'],
src/app/__tests__/layout.test.tsx:365:      headerShown: true,
src/app/__tests__/layout.test.tsx:395:      [Stack.Screen, 'reminders', undefined],
src/app/__tests__/layout.test.tsx:396:      [Stack.Screen, 'alerts', true],
src/app/__tests__/layout.test.tsx:419:      : null).toEqual([Stack.Screen, 'alerts/[alertId]', true]);
src/app/__tests__/layout.test.tsx:430:      headerShown: true,
src/app/__tests__/layout.test.tsx:469:      : null).toEqual([Stack.Screen, 'pets/[petId]/geofences', undefined]);
src/app/__tests__/layout.test.tsx:480:      headerShown: true,
src/app/__tests__/layout.test.tsx:509:      : null).toEqual([Stack.Screen, 'pets/[petId]/geofence-editor', undefined]);
src/app/__tests__/layout.test.tsx:520:      headerShown: true,
src/app/__tests__/layout.test.tsx:550:      headerShown: true,
src/app/__tests__/layout.test.tsx:577:      : undefined).toEqual([Stack.Screen, 'meals-history']);
src/app/__tests__/layout.test.tsx:580:      : undefined).toMatchObject({ headerShown: true, title: '' });
src/app/__tests__/layout.test.tsx:602:    )).toEqual([[Stack.Screen, 'welcome']]);
src/app/(auth)/__tests__/layout.test.tsx:51:        headerShown: false,
src/app/(tabs)/__tests__/food.test.tsx:574:    expect(toggle.props.className).toBe('min-h-11 justify-center');
src/app/(tabs)/__tests__/food.test.tsx:1298:    expect(progress.props.className).toBe('size-26 items-center justify-center');
src/app/(tabs)/__tests__/layout.test.tsx:79:      headerShown: false,
src/hooks/use-push-registration.navigation.test.tsx:61:      <Stack screenOptions={{ headerShown: false }} />
src/__tests__/alert-detail-canvas-fidelity.test.ts:31:  expect([...source.matchAll(/rounded-card|min-h-44|text-lg|text-2xs|text-sm|h-52([^.0-9]|$)|min-h-11/g)]).toEqual([]);
src/__tests__/design-drift.test.ts:1197:    expect(history).toContain("import { CONTINUOUS_CORNER, TABULAR_NUMS } from '../../theme/native-styles';");
src/__tests__/geofences-canvas-fidelity.test.ts:2:import { BACK_BUTTON_SIZE, EDITOR_PILL_LEFT, HEADER_BAR_HEIGHT, HEADER_ROW_TOP, TRANSPARENT_HEADER_OPTIONS, ZONES_TITLE_OFFSET } from '../theme/header-layout';
src/__tests__/geofences-canvas-fidelity.test.ts:40:    const source = readFileSync(join(process.cwd(), 'src/theme/header-layout.ts'), 'utf8');
src/__tests__/geofences-canvas-fidelity.test.ts:45:    expect(TRANSPARENT_HEADER_OPTIONS).toEqual({ headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } });
src/__tests__/geofences-canvas-fidelity.test.ts:93:    const source = readFileSync(join(process.cwd(), 'src/theme/native-styles.ts'), 'utf8');
src/__tests__/geofences-canvas-fidelity.test.ts:150:it('#189 R22.3: el Editor no consume HeaderHeightContext ni useContext', () => {
src/__tests__/geofences-canvas-fidelity.test.ts:152:  expect(editor.source).not.toContain('HeaderHeightContext');
src/__tests__/geofences-canvas-fidelity.test.ts:153:  expect(editor.source).not.toMatch(/\buseContext\b/);
src/__tests__/geofences-canvas-fidelity.test.ts:159:    expect(mainRules).toContain("Cabecera nativa transparente (#189 E4): Zonas seguras y la rama de formulario del Editor usan `headerTransparent: true` con `headerStyle: { backgroundColor: 'transparent' }`; el contenido empieza bajo la cabecera, el título comparte fila con la flecha, el `paddingTop` suma `insets.top` y no se usa `contentInsetAdjustmentBehavior`. Las ramas de estado del Editor conservan la cabecera opaca.");
src/__tests__/consistency-classnames.test.ts:174:      'size-13 items-center justify-center bg-accent rounded-16',
src/__tests__/consistency-classnames.test.ts:177:      'size-8 shrink-0 items-center justify-center rounded-xl ${tileClassName}',
src/__tests__/consistency-classnames.test.ts:279:    const nativeStyles = readSource(join('theme', 'native-styles.ts'));
src/__tests__/consistency-classnames.test.ts:294:      /import \{[^}]*\bCONTINUOUS_CORNER\b[^}]*\} from ['"].*theme\/native-styles['"];/,
src/__tests__/consistency-classnames.test.ts:312:      "import { CONTINUOUS_CORNER } from '../theme/native-styles';",
src/__tests__/consistency-classnames.test.ts:356:      /import \{[^}]*\bTABULAR_NUMS\b[^}]*\} from ['"].*theme\/native-styles['"];/,
src/__tests__/consistency-classnames.test.ts:698:  expect(source).toContain("import { CONTINUOUS_CORNER, KEEP_OPACITY, TABULAR_NUMS } from '../../theme/native-styles';");
src/__tests__/consistency-classnames.test.ts:701:  expect(source).toContain('<KeyboardAvoidingView testID="screen-geofence-editor" className="flex-1" behavior="padding" keyboardVerticalOffset={0}>');
src/__tests__/account-screens-polish.test.ts:49:    expect(login.match(/testID="link-forgot"\s+className="min-h-11 self-end"/g) ?? []).toHaveLength(1);
src/__tests__/chunky-cta-canvas-fidelity.test.ts:110:  for (const forbidden of ['border-b-4', 'border-black', 'rounded-xl', 'min-h-11']) expect(tag).not.toContain(forbidden);
src/__tests__/chunky-cta-canvas-fidelity.test.ts:154:  expect(tag).toContain('className="size-13 items-center justify-center bg-accent rounded-16"');
src/__tests__/alerts-canvas-fidelity.test.ts:61:    "change": "#100 R6: la columna de texto de la fila pasa a dos hijos (tipo y subtítulo) con justify-center y gap-0.5",
src/screens/register/index.test.tsx:281:        .contentInsetAdjustmentBehavior,
src/screens/docs/index.test.tsx:12:import { HeaderHeightContext } from 'expo-router/react-navigation';
src/screens/docs/index.test.tsx:118:        <HeaderHeightContext.Provider value={91}>
src/screens/docs/index.test.tsx:120:        </HeaderHeightContext.Provider>
src/screens/docs/index.test.tsx:236:      'self-start rounded-full px-2 py-0.5 text-11 font-extrabold bg-category-blue text-category-blue-strong',
src/screens/docs/index.test.tsx:284:      'self-start rounded-full px-2 py-0.5 text-11 font-extrabold bg-category-blue text-category-blue-strong',
src/screens/docs/index.test.tsx:289:      'self-start rounded-full px-2 py-0.5 text-11 font-extrabold bg-default text-muted',
src/screens/docs/index.test.tsx:359:      paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48,
src/screens/docs/index.test.tsx:642:    expect(mosaic.props.className).toBe(`h-14 w-12 items-center justify-center rounded-xl ${surface}`);
src/screens/docs/index.test.tsx:650:    expect(column.children[0]).toHaveProperty('props.className', `self-start rounded-full px-2 py-0.5 text-11 font-extrabold ${surface} ${ink}`);
src/screens/docs/index.test.tsx:729:    expect(circle.props.className).toBe('size-12 items-center justify-center rounded-full bg-surface-secondary');
src/screens/docs/index.test.tsx:805:    expect(chip.props.className).toBe(`h-8.5 items-center justify-center rounded-full px-3 ${surface}`);
src/screens/docs/index.test.tsx:845:    expect(selected.props.className).toBe('h-8.5 items-center justify-center rounded-full px-3 bg-foreground');
src/screens/docs/index.test.tsx:848:    expect(all.props.className).toBe('h-8.5 items-center justify-center rounded-full px-3 bg-default');
src/screens/meal-schedule/index.test.tsx:284:    ).toEqual({ paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48 });
src/screens/meal-schedule/index.test.tsx:1088:      paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48,
src/screens/meal-schedule/index.test.tsx:1194:      expect(tile).toHaveProp('className', 'size-10.5 items-center justify-center rounded-14 bg-category-amber');
src/screens/add-pet/index.test.tsx:1:import { HeaderHeightContext, usePreventRemove } from 'expo-router/react-navigation';
src/screens/add-pet/index.test.tsx:90:        <HeaderHeightContext.Provider value={91}>
src/screens/add-pet/index.test.tsx:92:        </HeaderHeightContext.Provider>
src/screens/add-pet/index.test.tsx:137:    expect(photo.props.className).toBe('size-22 items-center justify-center rounded-full border-2 border-dashed border-accent bg-surface-secondary');
src/screens/add-pet/index.test.tsx:797:    expect(chip.props.className).toBe('h-9.5 flex-1 items-center justify-center rounded-10' + (testID === 'species-dog' ? ' bg-surface shadow-sm' : ''));
src/screens/home/index.test.tsx:34:import { TABULAR_NUMS } from '../../theme/native-styles';
src/screens/home/index.test.tsx:208:      'size-11 items-center justify-center rounded-full',
src/screens/home/index.test.tsx:2556:      expect(tile.props.className).toContain('min-h-11');
src/screens/home/index.test.tsx:3218:        `size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS[slot].surface}`,
src/screens/home/index.test.tsx:3235:      `size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS.neutral.surface}`,
src/screens/home/index.test.tsx:4107:            `size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS.blue.surface}`,
src/screens/home/index.test.tsx:4133:            `size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS.neutral.surface}`,
src/screens/home/index.test.tsx:4362:        `size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS.rose.surface}`,
src/screens/home/index.test.tsx:5477:    expect(container.props.className).toBe('flex-1 items-center justify-center px-5 py-6 bg-background'); // (enmendado por #176 R3)
src/screens/home/weekly-activity-chart.test.tsx:21:import { TABULAR_NUMS } from '../../theme/native-styles';
src/screens/home/weekly-activity-chart.test.tsx:843:      segments.every(({ props }) => props.className.includes('h-11')),
src/screens/home/weekly-activity-chart.test.tsx:1028:    expect(spanishColumn.props.className).toContain('min-h-11');
src/screens/home/weekly-activity-chart.test.tsx:1686:    const resting = 'min-h-11 flex-1 items-center justify-end';
src/screens/home/weekly-activity-chart.test.tsx:1688:      'min-h-11 flex-1 items-center justify-end border-t-2 border-accent-strong';
src/screens/home/weekly-activity-chart.test.tsx:2279:    const resting = 'min-h-11 flex-1 items-center justify-end';
src/screens/home/weekly-activity-chart.test.tsx:2281:      'min-h-11 flex-1 items-center justify-end border-t-2 border-accent-strong';
src/screens/pairing/index.test.tsx:1:import { HeaderHeightContext } from 'expo-router/react-navigation';
src/screens/pairing/index.test.tsx:160:          <HeaderHeightContext.Provider value={91}>
src/screens/pairing/index.test.tsx:162:          </HeaderHeightContext.Provider>
src/screens/pairing/index.test.tsx:622:      expect(source).not.toContain('size-16 items-center justify-center rounded-full bg-accent-soft');
src/screens/pairing/index.test.tsx:1213:      'size-9', 'items-center', 'justify-center', 'overflow-hidden', 'rounded-full', 'bg-category-amber',
src/screens/pairing/index.test.tsx:1259:      'w-50', 'h-37.5', 'items-center', 'justify-center',
src/screens/profile/index.test.tsx:1374:    expect(camera.props.className).toBe('absolute -bottom-0.5 -right-0.5 size-8.5 items-center justify-center rounded-full border-3 border-surface-secondary bg-accent');
src/screens/profile/index.test.tsx:1548:    expect(root.props.className).toBe('flex-row flex-wrap justify-center gap-1.5');
src/screens/profile/index.test.tsx:1730:      expect(avatar.props.className).toBe('size-8.5 items-center justify-center rounded-full bg-default');
src/screens/add-reminder/index.test.tsx:1:import { HeaderHeightContext } from 'expo-router/react-navigation';
src/screens/add-reminder/index.test.tsx:118:          <HeaderHeightContext.Provider value={91}>
src/screens/add-reminder/index.test.tsx:120:          </HeaderHeightContext.Provider>
src/screens/add-reminder/index.test.tsx:186:      paddingTop: 24,
src/screens/add-reminder/index.test.tsx:569:      paddingHorizontal: 20, paddingTop: 24, gap: 16, paddingBottom: 48,
src/screens/add-reminder/index.test.tsx:594:    expect(chip.props.className).toBe('h-9.5 items-center justify-center rounded-full px-3.5 bg-accent border-b-3 border-black/25');
src/screens/add-reminder/index.test.tsx:606:      expect(chip.props.className).toBe(`h-9.5 items-center justify-center rounded-full px-3.5 ${surface}`);
src/screens/add-reminder/index.test.tsx:617:    expect(selected.props.className).toBe('h-9.5 items-center justify-center rounded-full px-3.5 bg-accent border-b-3 border-black/25');
src/screens/add-reminder/index.test.tsx:620:    expect(idle.props.className).toBe('h-9.5 items-center justify-center rounded-full px-3.5 bg-category-blue');
src/screens/add-reminder/index.test.tsx:713:const CHIP_SELECTED = 'h-9.5 items-center justify-center rounded-full px-3.5 bg-accent border-b-3 border-black/25';
src/screens/add-reminder/index.test.tsx:714:const CHIP_IDLE = 'h-9.5 items-center justify-center rounded-full px-3.5 bg-default';
src/screens/health/index.test.tsx:1067:    { id: 'overdue', surface: 'size-10 items-center justify-center rounded-xl bg-category-rose', icon: 'health-icon-clock', color: 'category-rose-strong', texts: ['Vencida', '2026-01-01', '2026-02-28'], dateClass: 'font-normal text-danger' },
src/screens/health/index.test.tsx:1068:    { id: 'next', surface: 'size-10 items-center justify-center rounded-xl bg-category-amber', icon: 'health-icon-clock', color: 'category-amber-strong', texts: ['Próxima', '2026-01-02', '2026-03-31'], dateClass: 'font-normal text-muted' },
src/screens/health/index.test.tsx:1069:    { id: 'future', surface: 'size-10 items-center justify-center rounded-xl bg-category-green', icon: 'health-icon-check', color: 'category-green-strong', texts: ['Futura', '2026-01-03', '2026-04-02'], dateClass: 'font-normal text-muted' },
src/screens/health/index.test.tsx:1070:    { id: 'completed', surface: 'size-10 items-center justify-center rounded-xl bg-category-green', icon: 'health-icon-check', color: 'category-green-strong', texts: ['Sin próxima dosis', '2026-01-04'], dateClass: 'font-normal text-muted' },
src/screens/weight-log/index.test.tsx:1:import { HeaderHeightContext } from 'expo-router/react-navigation';
src/screens/weight-log/index.test.tsx:176:          <HeaderHeightContext.Provider value={91}>
src/screens/weight-log/index.test.tsx:178:          </HeaderHeightContext.Provider>
src/screens/weight-log/index.test.tsx:1042:    expect(toast.props.pointerEvents).toBe('none');
src/screens/meals-history/index.test.tsx:120:    expect(screen.getByTestId('screen-meals-history')).toHaveProp('contentInsetAdjustmentBehavior', 'automatic');
src/screens/meals-history/index.test.tsx:121:    expect(screen.getByTestId('screen-meals-history')).toHaveProp('contentContainerStyle', { paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48 });
src/screens/meals-history/index.test.tsx:418:      paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48,
src/screens/meals-history/index.test.tsx:457:      expect(arrow).toHaveProp('className', 'size-10 items-center justify-center rounded-xl bg-default');
src/screens/meals-history/index.test.tsx:520:      ? 'h-11 flex-1 items-center justify-center gap-0.5 rounded-full bg-tab-pill'
src/screens/meals-history/index.test.tsx:521:      : 'h-11 flex-1 items-center justify-center gap-0.5 rounded-full');
src/screens/login/index.test.tsx:192:    expect(screenRoot.props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/forgot/index.test.tsx:155:    expect(screenRoot.props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/forgot/index.test.tsx:306:      (c) => (c as { props: { className?: string } }).props.className === 'size-13 items-center justify-center bg-accent rounded-16',
src/screens/forgot/index.test.tsx:312:      (c) => (c as { props: { className?: string } }).props.className === 'size-13 items-center justify-center bg-accent rounded-16',
src/screens/forgot/index.test.tsx:539:  it('forgot-form lleva className y contentInsetAdjustmentBehavior de la spec en los dos estados', async () => {
src/screens/forgot/index.test.tsx:544:    expect(screen.getByTestId('forgot-form').props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/forgot/index.test.tsx:548:    expect(screen.getByTestId('forgot-form').props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/forgot/index.test.tsx:609:        className: 'size-13 items-center justify-center bg-accent rounded-16',
src/screens/forgot/index.test.tsx:624:        className: 'size-13 items-center justify-center bg-accent rounded-16',
src/screens/forgot/index.test.tsx:686:    expect(tile.props.className).toBe('size-13 items-center justify-center bg-accent rounded-16');
src/screens/docs-upload-form/index.test.tsx:17:import { HeaderHeightContext } from 'expo-router/react-navigation';
src/screens/docs-upload-form/index.test.tsx:142:            <Stack screenOptions={{ headerShown: false }} />
src/screens/docs-upload-form/index.test.tsx:147:    'pets/[petId]/docs': () => <HeaderHeightContext.Provider value={91}><DocsRoute /></HeaderHeightContext.Provider>,
src/screens/docs-upload-form/index.test.tsx:148:    'pets/[petId]/docs-upload': () => <HeaderHeightContext.Provider value={91}><DocsUploadRoute /></HeaderHeightContext.Provider>,
src/screens/docs-upload-form/index.test.tsx:704:    expect(source).toContain('keyboardVerticalOffset={headerHeight}');
src/screens/welcome/index.test.tsx:131:    expect(screen.getByTestId('screen-welcome').props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/welcome/index.test.tsx:194:    expect(screen.getByTestId('welcome-chips').props.className).toBe('flex-row justify-center gap-2');
src/screens/welcome/index.test.tsx:771:    expect(screen.getByTestId('welcome-stage').props.className).toBe('items-center justify-center');
src/screens/alert-detail/index.test.tsx:217:    expect(elementChild(card, 0).props.className).toBe(`size-18 items-center justify-center rounded-full ${solid}`);
src/screens/alert-detail/index.test.tsx:218:    expect(icon.parent?.props.className).toBe(`size-18 items-center justify-center rounded-full ${solid}`);
src/screens/alert-detail/index.test.tsx:273:    expect(root.props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/alert-detail/index.test.tsx:274:    expect(root.props.contentContainerStyle).toEqual({ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 64, gap: 14, flexGrow: 1 });
src/screens/alert-detail/index.test.tsx:954:    expect(screen.getByTestId('screen-alert-detail').props.contentContainerStyle).toEqual({ paddingHorizontal: 20, paddingTop: 24, paddingBottom: bottom + 40, gap: 14, flexGrow: 1 });
src/screens/reset-password/index.test.tsx:321:    expect(screenRoot.props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/reset-password/index.test.tsx:605:    expect(disk.props.className).toBe('size-8 items-center justify-center rounded-full bg-accent');
src/screens/reminders/index.test.tsx:299:      paddingTop: 24,
src/screens/reminders/index.test.tsx:401:      paddingTop: 24,
src/screens/reminders/index.test.tsx:549:      ['a', 'size-11.5 items-center justify-center rounded-14 bg-category-blue', 'reminders-icon-syringe', 'color:category-blue-strong'],
src/screens/reminders/index.test.tsx:550:      ['b', 'size-11.5 items-center justify-center rounded-14 bg-category-amber', 'reminders-icon-pill', 'color:category-amber-strong'],
src/screens/reminders/index.test.tsx:551:      ['c', 'size-11.5 items-center justify-center rounded-14 bg-default', 'reminders-icon-pin-tack', 'color:muted'],
src/screens/reminders/index.test.tsx:1367:    expect(tile.props.className).toBe('size-14 items-center justify-center rounded-full bg-category-rose');
src/screens/reminders/index.test.tsx:1667:    expect(container.props.className).toBe('flex-1 items-center justify-center p-6 bg-background');
src/screens/map/index.test.tsx:619:        left: 16,
src/screens/map/index.test.tsx:1223:        left: 16,
src/screens/map/index.test.tsx:1250:        left: 16,
src/screens/map/index.test.tsx:1636:      'flex-row items-center gap-2 self-start rounded-full border border-border bg-surface px-3 py-2 shadow-sm',
src/screens/map/index.test.tsx:1964:    expect(slot.parent?.props.className).toBe('flex-1 items-center justify-center p-6 bg-background');
src/screens/map/index.test.tsx:2000:    expect(slot.parent?.props.className).toBe('flex-1 items-center justify-center p-6 bg-background');
src/screens/alerts/index.test.tsx:342:    expect(list.props.contentInsetAdjustmentBehavior).toBe('automatic');
src/screens/alerts/index.test.tsx:345:      paddingTop: 24,
src/screens/alerts/index.test.tsx:421:        `size-11 items-center justify-center rounded-full ${disc}`,
src/screens/alerts/index.test.tsx:443:      expect(ack.props.className.split(' ')).not.toContain('min-h-11');
src/screens/alerts/index.test.tsx:462:        'min-h-11 min-w-0 flex-1 justify-center gap-0.5',
src/screens/alerts/index.test.tsx:499:        'min-h-11 min-w-0 flex-1 justify-center gap-0.5',
src/screens/alerts/index.test.tsx:509:    expect(ack.props.className.split(' ')).not.toContain('min-h-11');
src/screens/alerts/index.test.tsx:1257:    expect(link.props.className).toBe('min-h-11 min-w-0 flex-1 justify-center gap-0.5');
```

##### Resumen consolidado de sondas

Todas las mutaciones se restauraron exactamente. Los rojos de P-E4-1..7, ventana/cableado de P-E4-8 y P-E4-4 tras E5 constan en la octava reanudación; las sondas restantes están registradas en esta novena. El verde intermedio del literal 50 en C se conserva como evidencia de la contradicción corregida por `93785dc4`, sin cambiar R ni aserción.

| Sonda | Rojo observado |
|---|---|
| P-E4-1 / 2 | C 1 failed/28 en cada una |
| P-E4-3 | F 8 failed/96; chunky 3 failed/76 |
| P-E4-4 (E5) | F 8 failed/96; R20.1 detecta boxShadow extra |
| P-E4-5 | F 5 failed/96, bloqueos disabled |
| P-E4-6 | L 1 failed/28, opciones exactas |
| P-E4-7 inset / padding | F 1 failed/96 en cada una |
| P-E4-8 ventana / sin cable / literal42 / literal50 | C 1/28; F 2/96; C 1/28 R23.2; F 2/96 R1.2 ES/EN |
| P-E4-9 offset / import | E 1/120 (291≠200); C 1/28 y M12 mutada=1 |
| P-E4-10 left / BlurView | E 6/120 en cada una |
| P-E4-11 sin Stack.Screen estado / formulario | E 7/120 y 5/120, transición incluida |
| P-E4-12 identidad formulario / estado | E 1/120 en cada una |
| P-E4-13 sin h-11 | F 2/96, ES/EN |
| P-E6-1 orden import | consistency 1/75, C1 |
| P-E6-2 offset headerHeight | consistency 1/75, C2; E 1/120 teclado |
| P-E6-3 etiqueta en varias líneas con 0 | consistency 1/75, C2 |

##### Commits E4/E5/E6 y trazabilidad R19-R24

Cada hash se resolvió contra Git y es ancestro de HEAD. La tabla principal de traceability usa los mismos hashes reales y el nombre real del it de opciones de #95 R4. Ninguna fila R19-R24/E4/E5/E6 queda sin resolver.

| R | Rojo(s) y verde |
|---|---|
| R23 | `7e47e13a test(mobile): #189 E4 R23 rojo — lock shared header geometry`; `180594ec feat(mobile): #189 E4 R23 centralize header geometry` |
| R19 | `297b9f4b test(mobile): #189 E4 R19 rojo — lock opacity while controls are disabled`; `f3aa4094 test(mobile): #189 E5 R19 rojo-corrección — flatten real de Guardar vacío`; `889ed6fa test(mobile): #189 E6 R19 rojo-corrección — import de KEEP_OPACITY en el candado de la hoja del Editor`; `cae47221 feat(mobile): #189 E4 R19 R20 keep disabled controls fully opaque` |
| R20 | `eace0652 test(mobile): #189 E4 R20 rojo — lock add-zone opacity and disabled recipe`; `3a786a89 test(mobile): #189 E5 R20 rojo-corrección — flatten real de Añadir zona en el límite`; `cae47221 feat(mobile): #189 E4 R19 R20 keep disabled controls fully opaque` |
| R21 | `8fae5abf test(mobile): #189 E4 R21 rojo — lock transparent zones header and title geometry`; `e82549e3 feat(mobile): #189 E4 R21 align zones title with transparent header` |
| R22 | `d9077a65 test(mobile): #189 E4 R22 rojo — lock editor headers keyboard and pill row`; `b3c16b4c feat(mobile): #189 E4 R22 align editor header pill and keyboard` |
| R24 | `a49eb6b0 test(mobile): #189 E4 R24 rojo — lock charter amendments for transparent headers`; `fb578f0b feat(mobile): #189 E4 R24 document transparent headers and opaque disabled controls` |

##### Lista final de ficheros desde H0

`git diff --name-only 4204530e..HEAD -- mobile-pet-tracker/ docs/`: 24 ficheros, todos en la lista cerrada ampliada E4+E5+E6 y las ampliaciones anteriores. legibility-classnames está autorizada pero sin cambios; no se fuerza una edición. Registro íntegro en `e9-final-files-189.log`.

```text
docs/conventions.md
docs/ui-guidelines.md
mobile-pet-tracker/src/__tests__/alert-detail-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/geofences-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/heroui-text-size-merge.test.ts
mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/app/__tests__/layout.test.tsx
mobile-pet-tracker/src/app/_layout.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
mobile-pet-tracker/src/screens/geofence-editor/index.tsx
mobile-pet-tracker/src/screens/geofences/index.test.tsx
mobile-pet-tracker/src/screens/geofences/index.tsx
mobile-pet-tracker/src/theme/header-layout.ts
mobile-pet-tracker/src/theme/native-styles.ts
mobile-pet-tracker/src/utils/__tests__/category-palette.test.ts
mobile-pet-tracker/src/utils/category-palette.ts
```

##### Verificaciones finales, límites y entrega

- `bun run test` completo: exit 0, `Test Suites: 131 passed, 131 total`, `Tests: 4426 passed, 4426 total`, `Snapshots: 1 passed, 1 total`, 130.18 s. Las dos guardas originales estaban vacías justo antes de iniciarlo. Guardas agregadas design-drift, consistency-classnames, legibility-classnames, heroui-text-size-merge, chunky-cta-canvas-fidelity, profile-canvas-fidelity, ui-language, language-provider, alert-detail-canvas-fidelity, alerts-canvas-fidelity y geofences-canvas-fidelity constan PASS en el log completo. Sin flake de home en esta ejecución.
- `test ! -e .expo/types/router.d.ts` pasó; después `bun run typecheck` exit 0 (`e9-typecheck-189.log`). No se borra/regenera el fichero de tipos.
- `bunx expo lint --no-cache > ../progress/lint-189.log 2>&1 && test ! -s ../progress/lint-189.log`: exit 0, log vacío.
- `graphify update .`: exit 0, solo AST, sin LLM. `e9-graphify-189.log`: 916 ficheros extraídos, 27506 nodos, 35551 aristas, 1794 comunidades; artefactos en graphify-out ignorados por Git. Limitación del entorno: 20 SQL no contribuyen por ausencia de tree_sitter_sql; etiquetas de comunidades previas requieren actualización semántica si se desea. No se instalan dependencias ni se lanza etiquetado LLM.
- M10-M19, inventarios agregados y M20 se volvieron a medir tras el último verde; todas las cifras esperadas coinciden. Las anclas negativas se observaron fallar con sus mutaciones y vuelven a cero tras restaurar.
- Sin nuevas contradicciones de requisito/aserción. La parada anterior por guarda ocupada y el verde intermedio erróneo de la vieja P-E4-8 permanecen documentados como historia; no alteran los resultados finales.
- Smoke Android §6 pasos 6-10 y comparación visual de la flecha: a cargo del humano; no ejecutados ni declarados aprobados. Si la geometría excede ±8 dp, la enmienda posterior es E7. No se cambia ninguna casilla ni el status de la feature/spec; revisión y merge corresponden al humano/leader.
- Código de producción y tests permanecen idénticos a `93785dc4` tras todas las sondas. Solo se entregan este informe y traceability.md en un commit `docs(geofences): record E4 E6 closure and mutation evidence`; este commit documental no cambia el código validado ni requiere repetir la suite. Se conservan el patch E5 y los documentos sin seguimiento del leader. Sin init.sh, push ni PR. La última acción recrea el sentinel .done con la ruta de este informe, sin commitearlo.
