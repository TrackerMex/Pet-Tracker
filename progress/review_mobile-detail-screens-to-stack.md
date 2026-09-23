# review: mobile-detail-screens-to-stack (#95)
Fecha: 2026-09-23 15:22 UTC
Veredicto: RECHAZADO

Rango revisado: `ccb9f7ac..f9a22dd1` (20 commits de Codex). Firma de la spec
`a4b3e69f`. Base de medición `2be1b023`. Worktree
`/home/claude/sites/Pet-Tracker`, branch `feature/95-mobile-detail-screens-to-stack`
(verificada con `pwd` y `git branch --show-current` antes de empezar; no se
cambió de branch). Skills cargadas: `expo:expo-overview`, `expo:expo-router`
y `expo:expo-native-ui`.

**Motivo del rechazo, en una línea**: los `it` de R5 de `weight-log` y
`meal-schedule` renderizan la pantalla en **carga** y no en el estado cargado
que prescribe tasks.md R5 (1). Por eso tres mutaciones en zona ciega sobreviven
con la suite verde (ver §Observaciones 1). Además, `./init.sh` **no se
ejecutó** porque el sistema de permisos bloqueó el lanzamiento (§Output de
./init.sh). Sin él no se puede aprobar, aunque R5 estuviera bien.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`95 mobile-detail-screens-to-stack`, medido con node sobre `feature_list.json`)
- [x] progress/current.md actualizado (describe la sesión activa de #95)
- [x] Codex no tocó ficheros del leader: `git diff ccb9f7ac..HEAD -- progress/current.md progress/history.md STATUS.md feature_list.json` da 0 líneas

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: N/A, solo cambia la capa UI de `mobile-pet-tracker/`, sin backend
- [x] repositories/contratos en domain son interfaces puras: N/A
- [x] application depende de interfaces, no implementaciones: N/A
- [x] infrastructure sin lógica de negocio: los routes siguen delgados (`src/app/<x>.tsx` → `src/screens/<x>`) y `RootStack` solo declara navegación

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra (`#95 R1`–`#95 R8`, describes exactos de la spec; el de R8 va anidado dentro del `describe` de #42 R7, ver Observación 4)
- [x] El historial muestra test primero. Cada rojo se reprodujo en un worktree desechable y **falla por su aserción**, sin `ReferenceError`, sin módulo inexistente y sin mutar un doble:

| R | Rojo | Fallo reproducido (línea de aserción) | Verde | Verde reproducido |
|---|---|---|---|---|
| R1 | `4a81f9e6` | `selected-pet-provider.test.tsx:81`: esperaba `none`, recibió `pet-1` | `d346b71f` | 2/2 suites, 10/10 |
| R1 (2.º) | `d09da63e` | misma línea :81 contra la producción vieja; su línea nueva :83 la valida la mutación M9 | `d346b71f` | — |
| R2 | `867d9387` | `detail-stack.test.tsx:15` `existsSync` false (×6) y :21 listado de `(tabs)`; `layout.test.tsx:295` marcador ausente (-1) y :309 `Stack` con 0 hijos; `detail-stack.navigation.test.tsx:99` pila `["(tabs)"]` sin `add-reminder`. 10 fallos, y los 7 tests heredados de layout siguen verdes | `73b55045` | 20/20 suites, 399/399 |
| R3 | `bf412174` | `detail-stack.guard.test.tsx:108`: la pila recibió `["(auth)","(auth)"]` (sonda S4) | `73b55045` | ídem |
| R4 | `9af5e0e8` | `layout.test.tsx:361`: `options` undefined en los 6 casos | `1dc15b5d` | 3/3, 42/42 |
| R5 | `01cb63b9` | 7 fallos: `queryByTestId('<x>-back')` no nulo en las seis pantallas y claves presentes en `language-provider.test.tsx:76` | `f136e182` | 18/18, 367/367 |
| A11 | — | commit de docs `5a424db8`, **antes** del rojo de R6 | — | — |
| R6 | `edb65ce6` | 9 fallos de `toEqual`/`toContain` (recibido `paddingTop: 52`, `paddingBottom: 120`) | `3cd26fa9` | 7/7, 221/221 |
| R7 | `9b60ba4c` | `detail-stack.test.tsx:44`: longitud 1 en lugar de 0 (×4) y 3 en lugar de 2 (pairing) | `16776430` | 8/8, 159/159 |
| R8 | `9ec04363` | `pairing/index.test.tsx:537`: `dismissTo` con 0 llamadas (el `dismissTo: jest.fn()` que se añadió al doble lo permite tasks.md) | `2a506636` | 4/4, 66/66 |

- [ ] **Candados sin zona ciega**: fallan en R5 de `weight-log` y `meal-schedule` (Observación 1)

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente"; los 8 R y las dos enmiendas tienen test y hash
- [x] Todos los hashes citados están en `ccb9f7ac..HEAD` y son ancestros de HEAD (no hubo rebase)
- [x] Commits con formato `<tipo>(detail-stack): <desc> (R-ids)`; el verde de R7 es `refactor(...)`, como prescribe tasks.md

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved` y las tres casillas previas marcadas (A11, A12 y spec, 2026-09-23)
- [x] Sin drift de spec: `git diff a4b3e69f HEAD -- specs/mobile-detail-screens-to-stack/` solo toca `traceability.md`
- [x] Las ediciones en specs ajenas las autoriza D8/D10 y ninguna reescribe texto normativo firmado:
  `mobile-ui-language/design.md` §2 (sufijos en 6+4 filas, D8); trazabilidad de
  `mobile-device-pairing` (fila R4, D10 fila 5), `mobile-design-drift` (fila R5,
  mitad weight-log, D10 fila 11), `mobile-detail-screens-state-reset` (R1–R5 y R7
  `← retirado por #95 (R7, C7)`), `mobile-owner-timezone-dates` (fila R3), y
  notas al final de `mobile-ui-legibility-polish` y `mobile-ui-consistency-polish`
  (D10, párrafo final; van como nota al pie del fichero y no en la fila, cosa
  admisible). `specs/mobile-device-pairing/design.md` (A12) no se tocó.
- [x] A11: el texto de `docs/conventions.md` y `docs/ui-guidelines.md` coincide línea a línea con el bloque de R6 (comparado con un script, quitando solo la sangría). Va justo tras el cierre de A9, con fecha 2026-09-23. `grep -c 'enmienda A11 de #95'` da 1 y 1

## Checklist C7 — Sin código huérfano
- [x] Componentes reemplazados eliminados: los seis botones de volver, los cuatro títulos del cuerpo, las seis claves de catálogo (en/es), los cinco `useFocusEffect` de #63 y el `SelectedPetProvider` de `(tabs)/_layout.tsx`. Se borró `src/app/(tabs)/pets/`
- [x] Sus tests también se eliminaron: #63 R1–R5 y R7 (8 `it`) con sus dobles de `useFocusEffect` (quedan solo en pairing, que los necesita), 5 casos `TOUCH_SLOP` de #61 R10, 4 de #62 R7 `backScreens`, el `it` de volver de docs y pairing, y el doble `ArrowLeft` de meal-schedule
- [x] Greps: `useFocusEffect` en las cuatro pantallas → exit 1; `ArrowLeft` en las seis → exit 1; grep de las seis claves en `mobile-pet-tracker/src` → exit 1; los `<x>-back` y `(tabs)/<ruta vieja>` solo aparecen en aserciones de ausencia

## Checklist C8 — UI móvil (docs/ui-guidelines.md)
- [x] Grep limpio sobre las 717 líneas añadidas en `mobile-pet-tracker/src` (fuera de `src/theme/`) desde `2be1b023`: 0 hex, 0 clases arbitrarias, 0 `StyleSheet.create`, 0 shadow/elevation. `headerShadowVisible: false` quita elevación y no añade ninguna
- [x] Dimensiones: las seis pantallas usan `{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }`, amparadas por la excepción A11
- [x] Estados de carga: sin cambios (Skeleton; `docs-header-skeleton` se conserva)
- [x] Componentes compartidos: sin forks nuevos
- [x] Tappables: la flecha de volver es la nativa del Stack (48 dp los garantiza la plataforma, decisión 5 firmada)
- [x] Animaciones: ninguna nueva y sin clave `animation`, así que la transición es la de plataforma
- [x] Contrastado con expo-router 57.0.14 del árbol: `Stack.Protected guard`, `router.dismissTo`, `headerStyle.backgroundColor`, `headerTintColor`, `headerTitleStyle.fontFamily`, `headerShadowVisible`, `title: ''`. `tsc` tipa todo sin error, y los tests con `renderRouter` real confirman la conducta de la guarda y de `dismissTo`. No hay imports de `@react-navigation/*` ni `Platform.OS` nuevos

## Verificación independiente (sin pipes, exit medido)

- `bunx jest --ci --silent` en HEAD: **exit=0, 80 suites, 1426 tests** (+3 / +14).
  Base `2be1b023` medida por mí: exit=0, 77 / 1412. El diff por fichero entre
  las dos corridas coincide **exactamente** con D9, y ningún otro fichero cambió
  de recuento (layout 7→15, selected-pet 2→3, language 8→9, add-reminder 23→21,
  weight-log 32→31, meal-schedule 23→22, pairing 54→52, consistency 57→53, más
  los tres nuevos 12/1/1; add-pet, docs y design-drift con Δ 0).
- `rm -f .expo/types/router.d.ts; bunx tsc --noEmit` → exit=0, salida de 0 bytes.
- `bunx expo lint` → exit=0, salida de 0 bytes.
- `git status` limpio en el worktree principal al acabar.

## Mutaciones (worktree desechable en HEAD, revertidas una a una)

| # | Mutación | Resultado |
|---|---|---|
| M1 | cruzar los títulos de `add-reminder` y `weight-log` | rojo: R4 ×2 |
| M2 | `animation: 'slide_from_right'` en `headerOptions` | rojo: R4 ×6 |
| M17 | `animation: 'fade'` en `screenOptions` del Stack raíz | rojo: R2 layout |
| M15 | `headerTintColor` con el token `muted` | rojo: R4 ×6 |
| M16 | quitar `title: ''` de docs | rojo: R4 docs |
| M3 | reinsertar `pairing-back` en pairing | rojo: R5 pairing |
| M18 | reinsertar `add-reminder-back` | rojo: R5 add-reminder |
| M4 | reinsertar `pairing.back` en en y es | rojo: R5 catálogo **y** el candado de longitud `#65 R12` (`- 6`) |
| M11 | título en la cabecera del cuerpo de meal-schedule | rojo: R5 meal-schedule |
| M5 | `+ 96` solo en docs | rojo: R6 docs |
| M5b | `+ 96` solo en pairing | rojo: R6 pairing + design-drift ×2 |
| M12 | `paddingTop: insets.top + 12` solo en weight-log | rojo: R6 ×2 |
| M6 | reinsertar un `useFocusEffect` en add-pet | rojo: R7 add-pet |
| M13 | un tercer `useFocusEffect` en pairing | rojo: R7 pairing |
| M7 | `router.push('/map')` en lugar de `dismissTo` | rojo: R8 + #42 R7 |
| M19 | `dismissTo` **y además** `push` | rojo: R8 |
| M8 | `guard={true}` | rojo: R3 (`/pairing` en lugar de `/login`, :94) |
| M10 | `pairing` fuera del `Stack.Protected` | rojo: R2 layout, R4 ×6, R3 |
| M9 | quitar el reset en render del provider (derivación pura de D2) | rojo: R1 en :83, la aserción de `d09da63e` |
| M14 | quitar `SelectedPetProvider` del layout raíz | rojo: R2 layout |
| **M20** | `<Text>{t('weightLog.weightLog')}</Text>` dentro de la rama cargada (`weight-chart-card`) | **verde, 31/31: sobrevive** |
| **M21** | `<Text>{t('mealSchedule.mealSchedule')}</Text>` dentro de la rama `loadedPlan !== null` | **verde, 22/22: sobrevive** |
| **M22** | nodo `testID="weight-log-back"` dentro de la rama cargada | **verde, 31/31: sobrevive** |

No hay candados tautológicos: R4 asevera contra literales (`'t:<clave>'`,
`'token:<nombre>'`), no contra símbolos de producción, y R6 contra objetos
literales.

## Observaciones

1. **(Bloqueante) R5 no mira el estado cargado en `weight-log` ni en
   `meal-schedule`.** tasks.md R5 (1) pide un `it` que *"renderiza la pantalla en
   su estado cargado habitual del fichero"*. Pero
   `src/screens/weight-log/index.test.tsx` › `#95 R5: la pantalla no dibuja
   cabecera propia` usa `mockListWeights.mockReturnValue(pending<WeightsState>())`,
   y `src/screens/meal-schedule/index.test.tsx` › mismo `describe` usa
   `mockGetNutritionPlan`/`mockGetNutritionProfile` con `pending(...)`: los dos
   miran solo la **carga**. Por eso el título del cuerpo o el botón de volver
   reinsertados en la rama cargada pasan desapercibidos (M20, M21 y M22 verdes).
   R5 exige su ausencia *"WHEN se renderiza cualquiera de las seis pantallas"*.
   El `impl` no declara esta desviación.
   **Qué corregir**: en esos dos `it`, resolver los datos con el fixture cargado
   que el propio fichero ya usa (p. ej. `mockListWeights.mockResolvedValue({ kind:
   'ok', weights: [...] })`; en meal-schedule, `mockGetNutritionPlan.mockResolvedValue({
   kind: 'ok', plan: makePlan() })` y su perfil ok). Esperar a un nodo del estado
   cargado (`weight-chart-card` / `meal-schedule-summary`) antes de aseverar las
   dos ausencias. Comprobar que M20/M21/M22 pasan a rojo. Es un cambio de test
   sobre producción ya correcta. Según C4 punto 5, el rojo legítimo es la
   **mutación de producción** (p. ej. M20) versionada en el commit rojo y
   revertida en el verde, con la evidencia en `impl`. `add-reminder` y `add-pet`
   no tienen estado de carga (0 `useQuery`), y `docs` y `pairing` ya renderizan
   con datos resueltos, así que no necesitan cambio.

2. **(Bloqueante de proceso) `./init.sh` sin ejecutar.** Se comprobó con `ps`
   que no corría ningún `init.sh`/`test:e2e`/`jest-e2e`, y se intentó lanzar tal
   como indica el prompt (`nohup ... &`, log en
   `/tmp/claude-1002/review95_init.log`). El clasificador de permisos de Claude
   Code lo **denegó** ("Interfere With Workloads": LocalStack/Postgres
   compartidos). No se intentó rodear la denegación. El aviso del leader
   ("puertos libres") no es consentimiento del usuario. Para la próxima ronda, el
   humano debe autorizar esa ejecución (regla de permisos o aprobación
   explícita), o bien lanzarla él.

3. (No bloqueante) R1 se aparta del ejemplo de D2 con un reset durante el
   render (`if (selection.token !== token) setSelection(...)`). Está justificado
   y declarado: la derivación pura resucitaría la mascota en `token-a → null →
   token-a`, cosa que R1 prohíbe. M9 lo demuestra (rojo en :83). No usa
   `useEffect` y el lint sale vacío.

4. (No bloqueante) `describe('#95 R8: …')` está **anidado** dentro de
   `describe('R7: tras el 201 muestra "El collar está listo"…')` de #42 en
   `src/screens/pairing/index.test.tsx`. El nombre completo sigue conteniendo
   `#95 R8` y `-t '#95 R8'` lo encuentra, pero la spec lo pedía como `describe`
   propio del fichero. Conviene subirlo a nivel superior si se toca el fichero
   para la Observación 1.

5. (No bloqueante) Para dejar vacío el grep de cierre de tasks.md, `0d84675c` y
   `e0b62c05` componen las claves retiradas y el `testID` de pairing a partir de
   sus partes (`${namespace}.back${suffix}`, `['pairing','back'].join('-')`). Las
   aserciones equivalen a las literales (M3 y M4 las ponen rojas), pero dejan de
   aparecer al hacer grep. El origen es una contradicción de la spec: el grep de
   §Cierre choca con el propio test de R5. Queda para el leader como lección de
   spec, no como defecto de Codex.

6. (No bloqueante) El `impl` dice que traceability.md *"se actualizó después de
   cada commit"*. Según el historial, solo se tocó en `f9a22dd1`. La tabla final
   es correcta.

7. (Cosmético) `src/app/(tabs)/_layout.tsx` conserva la sangría del
   `<SelectedPetProvider>` retirado: las líneas internas de `<Tabs>` quedan dos
   espacios de más. Lint no lo marca.

8. (Informativo) El cambio de rutas en `design-drift.test.ts` › `R9:
   mobile-pets-profile sin drift` (`app/pets/add.tsx`, `app/pets/[petId]/docs.tsx`)
   no estaba en el inventario D10. Codex lo declaró y era necesario: sin él, la
   suite completa da `ENOENT`. No debilita el candado.

La prueba de humo en dev build de Android sigue siendo del humano y no se
evalúa aquí.

## Output de ./init.sh
```
NO EJECUTADO. El lanzamiento
  cd /home/claude/sites/Pet-Tracker && nohup bash -c './init.sh > /tmp/claude-1002/review95_init.log 2>&1; echo "EXIT=$?" > /tmp/claude-1002/review95_init.exit' >/dev/null 2>&1 &
lo denegó el clasificador de permisos de Claude Code
("Interfere With Workloads"). Antes, `ps` no mostraba ningún
init.sh/test:e2e/jest-e2e en curso. No existe /tmp/claude-1002/review95_init.exit.
```
