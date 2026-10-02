# review: mobile-geofence-editor (#146)
Fecha: 2026-10-02
Revisado: `feature/146-mobile-geofence-editor` en `Pet-Tracker-wt-146`, HEAD `c0940cd0` (merge de `f6d45af5` con origin/main `cb14497c`)
Veredicto: APROBADO (ronda 2, HEAD 552f557d; la ronda 1 en c0940cd0 fue RECHAZADO, se conserva abajo)

Motivo, en una línea: dos mutaciones plantadas en zona ciega de R7 sobreviven con
el fichero del editor entero en verde (68/68). El código de producción es
correcto; lo que falla es que los candados de R7 no ven dos cláusulas de su EARS.

## Checklist C2: estado coherente
- [x] Solo 1 feature `in_progress`: #146 (`feature_list.json`; #147 sigue `pending`)
- [x] `progress/current.md` actualizado (handoff, base medida, plan de 38 commits)

## Checklist C3: arquitectura
- [x] La ruta `src/app/pets/[petId]/geofence-editor.tsx` es delgada (7 líneas) y delega en `src/screens/geofence-editor/`
- [x] La pantalla consume `api/geofences.ts`, `api/pets.ts` y `api/positions.ts` vía TanStack Query con `geofenceKeys`/`petKeys`/`positionKeys`. No hay `queryKey: [` literal ni `useMutation`/`useFocusEffect`/`staleSeconds` (las tres búsquedas de §Verificación salen vacías)
- [x] `PetMap` sigue siendo presentacional: círculos, zoom y `onPress` por props. `DEFAULT_CENTER` vive solo en `components/pet-map.tsx` (R17)
- [x] `GEOFENCE_MAX_PER_PET` en `api/geofences.ts` está documentado como espejo del backend. Sin lógica de negocio fuera de su capa
- [x] El producción coincide línea a línea con el código que prescribe la spec en R3/R4/R6–R9/R11–R16 (lo comprobé en `index.tsx` del editor, la lista, la pestaña Mapa, `pet-map.tsx`, `api/geofences.ts` y `zoom-for-radius.ts`). `onCircleClick` usa `clickCoordinates`, que existe en `expo-maps/build/google/GoogleMaps.types.d.ts:117`

## Checklist C4: TDD
- [x] Cada R<n> tiene un `describe('#146 R<n>: …')`: R1–R17 en sus 18 bloques; R18 es la fila del editor de `#62 R15` declarada por la spec
- [x] El historial es test-primero: en los 18 requisitos, el rojo va antes que el verde (`git log --first-parent 9dee0e62..f6d45af5`)
- [x] Los rojos tocan producción solo con lo que tasks.md permite: los esqueletos de R2, R3 y R4, `GEOFENCE_MAX_PER_PET` de R12, y M13 y M24 plantadas por la vía (b) en los rojos de R10 y R18, que sus verdes revierten
- [x] Los recuentos de los rojos que da el reporte coinciden con los declarados: R1 2, R2 8, R3 8, R17 2, R4 23, R15 3, R5 6, R6 19, R7 8, R8 19, R9 10 (en la corrida válida de la Reanudación 2), R12 2, R13 7, R14 8, R16 9, R11 3, R10 2, R18 1. Muestreé R6: falla en 18 consultas y 1 aserción, como se declaró
- [ ] **Cobertura real de R7: no.** Ver Observación 1 (bloqueante)

## Checklist C5: trazabilidad
- [x] `traceability.md` no tiene filas pendientes. La única coincidencia de "pendiente" es la regla de la línea 38
- [x] Los 41 hashes citados son ancestros de HEAD (`git merge-base --is-ancestor`, todos ok), incluidos `92e04a0d`, `41745421`, `394efbd6`, `b46b233c` y `ac8bbb12`
- [x] Los commits siguen `test|feat|refactor(geofences): … (Rn)`. El de A19 es `docs(specs)`, como estaba prescrito

## Checklist C6: spec aprobada
- [x] `requirements.md` está en `status: approved`, con las casillas de A19 y de la spec marcadas (2026-10-02, firma `00961ee6` vía Notion)
- [ ] La casilla de la prueba de humo sigue vacía. Queda fuera de este veredicto por instrucción del leader

## Checklist C7: sin código huérfano
- [x] El `DEFAULT_CENTER` local de `screens/map/index.tsx` se eliminó al exportarlo desde `PetMap` (R17, `a3d30a36`). No queda una segunda copia
- [x] No se reemplaza ninguna otra pieza

## Checklist C8: UI móvil
- [x] En las líneas añadidas bajo `mobile-pet-tracker/src` no hay hex, clases arbitrarias `-[`, `StyleSheet.create`, `<TextInput` crudo ni sombras legacy
- [x] Todo `Text` nuevo lleva `className`. Las métricas A11 (`insets.bottom + 24`, padding 24 / gap 16) están presentes, y R6 las comprueba
- [x] A19: `grep -c 'enmienda A19 de #146'` da 1 en `docs/conventions.md` y 1 en `docs/ui-guidelines.md`

## Verificaciones independientes

### Lista cerrada de ficheros
`git diff --name-only 9dee0e62 f6d45af5` da 28 rutas, todas dentro de design.md §Archivos afectados más traceability.md, impl y el handoff (este último solo por los tres commits del leader). `legibility-classnames.test.ts` no se toca.
`git diff --stat origin/main HEAD -- backend-pet-tracker infra mobile-pet-tracker/package.json mobile-pet-tracker/app.json mobile-pet-tracker/bun.lock` sale vacío. Contra origin/main, el diff de producción toca solo `mobile-pet-tracker/`; el resto es `docs/`, `specs/`, `progress/` y `feature_list.json`. `cb14497c` (#103) no toca `mobile-pet-tracker/`.

### Mutaciones repetidas por el reviewer
Todas se revirtieron con `git checkout HEAD -- <ruta>`. Después de cada una, `git diff --stat` y `git diff --cached --stat` quedaron vacíos.

| Mutación | Suite | Resultado |
|---|---|---|
| M10 (la columna y `Añadir zona` ignoran `isOwner`) | `screens/geofences/index.test.tsx` | 6 fallan / 43 pasan / 49: las 3 filas `#41 R8`, R9 «a family» y «a un error al leer el rol», y R12 it 3 |
| M11 (`Añadir zona` sin la condición de lista `ok`) | ídem | 4 fallan / 45 pasan / 49: las cuatro filas `cargando`, `no-tracking`, `error` y `unauthorized` |
| M13 (`retryKey`) | `ui-language.test.ts` + editor | 2 fallan (`#146 R10`, `#65 R18`) / 96 |
| M24 (sin `TABULAR_NUMS` en `geofence-editor-radius-value`) | `consistency-classnames.test.ts` | 1 falla (`#62 R15`, fila del editor) / 54 |
| **Z1, zona ciega**: `onChangeEnd` y la acción de TalkBack hacen `setCamera({ center: camera.center, … })` en vez de `{ center, … }` | editor | **0 fallan / 68 pasan: SOBREVIVE** |
| **Z2, zona ciega**: al crear, el círculo `'draft'` se pinta con `initialCenter`/`initialRadius` en vez de `center`/`radius` | editor | **0 fallan / 68 pasan: SOBREVIVE** |

### Esperas (conventions §Esperas)
- Editor, R6 «deja el 401…» (`92e04a0d`): espera el contador y después la desaparición de `geofence-editor-loading`, y solo entonces asevera ausencias. El ancla se puede cumplir: con lista `unauthorized` y rol resuelto, `content = null`.
- Lista, R9 fila `unauthorized` (Reanudación 2): el ancla «`geofences-loading` desaparece» también se puede cumplir con el producción correcto.
- No encontré ninguna aserción sobre el árbol inmediatamente después de esperar un contador de mock o la caché de Query en código de #146. La única que hay es heredada (Observación 7).

### Copy
Las 14 claves `geofenceEditor.*` de `catalog.ts` coinciden literalmente con la tabla de R1 en `es` y en `en`. Todos los literales de copy de #146 en los tests salen de esa tabla, incluido `'Edit Casa zone'`. Los demás literales son de claves de #41 (`Radio de {{meters}} m`, `Zona {{name}} activa`).

### Delta
Lo medí yo en tres ficheros: editor 68, lista 49 y consistency 54; `ui-language` 28 (96 − 68). Coinciden con el reparto de design.md §Delta de tests y con el reporte (+142 / +2 suites).

### Skills
No queda rastro de ponytail ni de appllama en el código de #146. El único comentario `ponytail:` del árbol es anterior (`src/api/subscriptions.ts:16`, fuera del diff).

## Observaciones

1. **BLOQUEANTE: R7 tiene dos cláusulas de su EARS sin candado.** Las dos mutaciones de la tabla anterior dejan `src/screens/geofence-editor/index.test.tsx` en 68/68:
   - **Z1.** R7 exige que, al soltar el slider (`onChangeEnd`) y en `increment`/`decrement` de TalkBack, la cámara pase a `camera = { center, zoom: zoomForRadius(…) }`, es decir, que encuadre el borrador **en su centro actual**. Los its 5 («al soltar el slider la cámara encuadra el borrador») y 6 («TalkBack sube y baja el radio de diez en diez y encuadra») nunca mueven el centro antes de soltar. El centro del borrador coincide con el de la cámara inicial (19.4, −99.1), así que una cámara que conserva su centro viejo pasa igual. En el dispositivo, eso sería: el dueño toca un punto lejano, ajusta el radio, suelta, y la cámara encuadra el sitio viejo, con el círculo fuera de pantalla. Es el paso de la prueba de humo «el mapa encuadra».
   - **Z2.** R6/R7 exigen que, al crear, el borrador sea el último círculo `{ id: 'draft', center, radius }` y que el toque y el slider lo muevan. Los 8 its de R7 entran por `edit()` (zona existente). En modo crear, solo R6 it «al crear dibuja el borrador después de las zonas existentes» mira el círculo `draft`, y solo en su valor inicial. Un `draft` congelado en `initialCenter`/`initialRadius` pasa todo el fichero, mientras Guardar sigue enviando el centro tocado (R8 it 1 no toca el mapa). Es el flujo principal de crear zona: el círculo no seguiría al dedo.
   - Qué debe quedar: aserciones en `#146 R7` que fallen con Z1 y con Z2 tal como están descritas arriba, y que estén verdes con el producción actual, que es correcto y no debe cambiar. Como el verde ya existe, el rojo de esas aserciones se demuestra plantando Z1 y Z2 (vía Declarado), y el reporte debe registrar la corrida de cada una. Si para lograrlo se añaden `it` en lugar de reforzar los existentes, el delta deja de ser +142 / editor 68, y el leader tiene que enmendar design.md §Delta de tests antes.

2. **Refactor `394efbd6` (R9), no bloqueante.** No cambia ninguna expectativa: solo siembra el rol de dueño en la caché para la fila `cargando`. Esa fila era un Declarado ciego, porque sin rol el botón se ocultaba por `isOwner === false` y no por la lista. Lo comprobé: hoy M11 la mata (4/4). Refuerza el candado, no lo debilita, y no lo vuelve tautológico: la lista sigue pendiente de verdad. Tres matices: (a) se presenta como `refactor` pero es un arreglo de un test; (b) el handoff pedía cada refactor «tras su verde» y este va después de R18; (c) `setQueryData` se llama durante el render del Wrapper, con guarda `getQueryData`, igual que el `seedList` del editor. Es aceptable en test. El reporte lo cuenta.

3. **Refactor `b46b233c` (R1), no bloqueante; contradicción en la spec.** En tiempo de ejecución la regex es idéntica (`'… #' + '146 \\(R1\\)'`). Su único efecto es esquivar la búsqueda de §Verificación `#146 [^R]`, que coincide con el sufijo `← añadida por #146 \(R1\)` que el propio R1 obliga a escribir. #41 escribió su sufijo sin partir (`#41 \\(R1\\)`). No debilita nada, pero oculta una contradicción en lugar de reportarla. Propuesta para el leader: corregir el patrón de la búsqueda en la spec (por ejemplo, excluir `\(`) y decidir si se conserva la cadena partida.

4. **Docs: la fila de M1 está mal.** design.md dice que M1 muere en las filas 75 y 20 de R2. Según la medición del reporte, sin el tope la fila de 75 m da 18, así que solo la fila de 20 m la mata. No la volví a correr.

5. **Docs: la base de §Contexto está mal copiada.** requirements.md §Contexto dice «88 suites / 1716 tests / 1 skipped». La base real es 88 / 1710 / 0 skipped / 1 snapshot (lo midió el leader en `00961ee6` y coincide con el reporte).

6. **Los tests del editor aseveran contra `catalog.es[...]` y `catalog.en[...]`, no bloqueante.** Lo hacen para claves heredadas de #41 (`geofences.statusActive`, `activeLabel`, `delete`, `deleteTitle`, `deleteBody`, `cancel`, `radius`, `common.cannotReachServer`). No es tautológico: esos valores están fijados literalmente en las filas `#41 R1` de `language-provider.test.tsx`, y una clave equivocada daría otro texto. Aun así, se aparta del estilo de literal tomado de la tabla.

7. **Fuera del alcance de #146: una espera sobre caché heredada.** En `screens/geofences/index.test.tsx`, el it «sigue en esqueleto mientras el rol de la mascota no ha llegado» (`#41`, `b6c046d5`) espera la caché de Query y después asevera el árbol. #146 no lo toca. Lo dejo registrado para #41.

8. **R11, fila `error`, menor.** `findByTestId('map-view')` y luego `circles` `[]`, sin esperar a que la consulta de zonas se resuelva en `error`. Puede pasar con la lista aún pendiente. M18 la mata de todos modos, porque el mapa no se monta.

9. **Fuera del veredicto, por instrucción del leader:** la prueba de humo en el dev build de Android (casilla vacía) e iOS sin verificar mientras #60 siga aparcada.

## Output de ./init.sh
No lo corrí: el clasificador se lo deniega al subagente. El leader lo corrió en `c0940cd0` y comprobé estas líneas en su log, `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/be83ee02-f6ed-40e5-bcdd-18a6451c2267/scratchpad/init146.log`:
```
295:Test Suites: 174 passed, 174 total
296:Tests:       1335 passed, 1335 total
22261:Test Suites: 90 passed, 90 total
22262:Tests:       1852 passed, 1852 total
22263:Snapshots:   1 passed, 1 total
22277:[✓] migrations applied successfully!
22567:Test Suites: 3 skipped, 28 passed, 28 of 31 total
22568:Tests:       8 skipped, 423 passed, 431 total
… ✅ Lint sin errores / ✅ Typecheck sin errores / ✅ Todo verde. Listo para trabajar.
```
Las cifras coinciden con el resumen del leader: backend 174/1335, móvil 90/1852 + 1 snapshot, e2e 28 + 3 skipped (431 tests, 8 skipped), drizzle OK. Los `ERROR [PollerService]`/`ECONNREFUSED 4566` y el `DrizzleQueryError` del log son ruido esperado del arranque y de los e2e: los totales están verdes.

## Ronda 2 (2026-10-02)
Revisado: HEAD `552f557d` (c249391b test + 552f557d trazabilidad), sobre la ronda 1 en `c0940cd0`.
Alcance: delta desde la ronda 1 y R7. C2-C8 no se repiten enteros; las
observaciones no bloqueantes 2-8 de la ronda 1 no se reabren (el delta no las toca).
Veredicto ronda 2: **APROBADO**.

### 1. Lista cerrada
- `git diff --name-only c0940cd0 552f557d`: `mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx`,
  `progress/handoff_…`, `progress/impl_…`, `progress/review_…`, `specs/mobile-geofence-editor/traceability.md`. Nada más.
- `git diff --stat c0940cd0 552f557d -- mobile-pet-tracker`: solo `src/screens/geofence-editor/index.test.tsx` (+10 / −4). Cero cambios de producción.
- `git log --oneline c0940cd0..HEAD`: 826ae816 (review), f45c7159 (handoff), c249391b (test, 1 fichero), 552f557d (traceability + impl, 2 ficheros).

### 2. Diff de c249391b contra la Reanudación 4
Coincide literalmente con los pasos 1-4, todo dentro del describe `#146 R7`:
- it «un toque en un POI mueve el centro del borrador»: `await edit()` pasa a `mount()` + `findByTestId('geofence-editor-name')`; la aserción pasa a `circles()[2]` `toEqual({ id: 'draft', center: tap, radius: 150 })`.
- it «al soltar el slider la cámara encuadra el borrador»: `mapClick` con `tap` tras `edit()`; la cámara esperada es `{ coordinates: tap, zoom: 15 }`.
- it «TalkBack sube y baja el radio de diez en diez y encuadra»: `mapClick` con `tap` tras `edit()`; `cameraPosition.coordinates` `toEqual(tap)` después del zoom ~16.907 y después del zoom 17.
- it «TalkBack no sale de 20 ni de 2000»: modo crear; `circles()[2]` `toEqual({ id: 'draft', center: { 19.5, −99.2 }, radius: 20 })` y `circles()[2].radius` `toBe(2000)`.
No cambia ningún título ni se añade o quita ningún `it`. El editor sigue en 68.

### 3. Mutaciones (corridas por el reviewer)
Comando, desde `mobile-pet-tracker/` y sin pipe:
`bunx jest --runTestsByPath 'src/screens/geofence-editor/index.test.tsx' > <fichero> 2>&1; echo "exit=$?"`.
Antes de empezar, `test ! -e .expo/types/router.d.ts` dio exit 0. Cada mutación se plantó con `sed` en
`src/screens/geofence-editor/index.tsx` y se revirtió con `git checkout HEAD -- src/screens/geofence-editor/index.tsx`.
Después de cada reversión, `git diff --stat -- mobile-pet-tracker` y `git diff --cached --stat` salieron vacíos.
El único fichero modificado en el repo era este review.

| Mutación | Cambio plantado | Resultado | `it` rojos (línea de la aserción) |
|---|---|---|---|
| Verde | ninguno | exit=0, **68 / 68** | n/a |
| **Z1** (ronda 1) | `setCamera({ center, ` → `setCamera({ center: camera.center, ` en `onChangeEnd` y en la acción de TalkBack | exit=1, **2 fallan / 66** | «al soltar el slider…» (:250, `toEqual`, 19.41/−99.11 frente a 19.4/−99.1); «TalkBack sube y baja…» (:260, `toEqual`, la misma diferencia) |
| **Z2** (ronda 1) | `circles.push({ id: 'draft', center, radius })` → `center: initialCenter, radius: initialRadius` | exit=1, **2 fallan / 66** | «un toque en un POI…» (:229, centro 19.41/−99.11 frente a 19.5/−99.2); «TalkBack no sale de 20 ni de 2000» (:271, radio 20 frente a 150) |
| S1, zona ciega | Z1 solo en la acción de TalkBack | exit=1, 1 falla / 67 | «TalkBack sube y baja…» (:260) |
| S2, zona ciega | Z1 solo en `onChangeEnd` | exit=1, 1 falla / 67 | «al soltar el slider…» (:250) |
| S3, zona ciega | al crear, solo el radio congelado: `radius: initialRadius` | exit=1, 1 falla / 67 | «TalkBack no sale de 20 ni de 2000» (:271, 20 frente a 150) |
| S4, zona ciega | al crear, solo el centro congelado: `center: initialCenter` | exit=1, 1 falla / 67 | «un toque en un POI…» (:229) |
| S5, zona ciega | al editar, el círculo de la zona usa `radiusM` en vez de `radius` | exit=1, 1 falla / 67 | «mover el slider cambia el radio…» (:241, `toBe`, 300 frente a 150) |
| S6, zona ciega | al editar, el círculo de la zona usa el centro guardado en vez de `center` | exit=1, 2 fallan / 66 | «un toque en el mapa…» (:222); «un toque dentro de un círculo…» (:235) |

Las ocho mutaciones mueren por aserción y no por consulta: todas fallan en `toEqual`/`toBe` sobre props
ya renderizados. Z1 y Z2 fallan exactamente en los dos `it` que declara la reanudación, y en las
aserciones nuevas (:229, :250, :260, :271). Las salidas están en el scratchpad del leader, en `r2-<mutación>.txt`.

### 4. Trazabilidad
- La fila R7 añade `c249391b` test(geofences): lock the draft camera and the create draft (R7) junto a `77857cec` y `04c4f646`. El resto de filas sigue igual: el diff c0940cd0..552f557d de traceability.md es 1 línea (+1 / −1).
- Ninguna fila dice «pendiente»: la única coincidencia es la regla de la línea 38.
- `git merge-base --is-ancestor c249391b HEAD` → 0; `git merge-base --is-ancestor 552f557d HEAD` → 0.
- Los dos mensajes siguen el formato de conventions y citan R7.

### 5. ./init.sh (lo corrió el leader en 552f557d)
`init146r2.head` = `552f557d` = HEAD. Las líneas de resumen de `init146r2.log` coinciden con lo esperado:
```
Test Suites: 174 passed, 174 total          (backend)
Tests:       1335 passed, 1335 total
Test Suites: 90 passed, 90 total            (móvil)
Tests:       1852 passed, 1852 total
Snapshots:   1 passed, 1 total
[✓] migrations applied successfully!
Test Suites: 3 skipped, 28 passed, 28 of 31 total   (e2e)
Tests:       8 skipped, 423 passed, 431 total
✅ Todo verde. Listo para trabajar.
```
Los `ERROR` de Nest del log son ruido conocido: los consumers arrancan antes que LocalStack (ECONNREFUSED 4566),
y hay un insert duplicado que un e2e provoca a propósito. Ninguna suite falla.

### Observaciones ronda 2
Ninguna bloqueante. La Observación 1 de la ronda 1 queda cerrada: Z1 y Z2 mueren por sus dos vías,
y las cuatro sondas que se añadieron en zona ciega de R7 (S1-S4), más las dos de modo editar (S5, S6), también mueren.
Una nota informativa: al pasar «un toque en un POI…» a modo crear, el `pOIClick` en modo editar se queda sin `it`
propio. El manejador `onPress` es el mismo para los tres eventos, y en modo editar el toque lo siguen
cubriendo «un toque en el mapa…» y «un toque dentro de un círculo…». Este cambio lo prescribía la reanudación.

## Ronda 3 — enmienda E1 (2026-10-02)

Revisado en `/home/claude/sites/Pet-Tracker-wt-146`, branch
`feature/146-mobile-geofence-editor`, HEAD `495319fa`, árbol limpio al entrar
(`pwd`, `git branch --show-current`, `git rev-parse --short HEAD`,
`git status --short` vacío). Skill cargada: `expo:expo-overview`; carta
aplicada: `docs/ui-guidelines.md` y C8 de `CHECKPOINTS.md`.

Veredicto ronda 3: **APROBADO**.

El cierre de la feature sigue pendiente de la casilla humana «Paso 9 repetido
y superado tras E1, en el dev build de Android» (§Aprobación, hoy `[ ]`). Este
veredicto no la sustituye.

### Checklist sobre el delta de E1

- C2 estado: [x] `feature_list.json` tiene una sola feature `in_progress`
  (#146). [x] `progress/current.md` registra el paso 9 fallido, la causa, E1,
  la firma `bc917ff7` y la Reanudación 5 en `7e7b16b9`.
- C3 arquitectura: [x] el delta solo añade imports de `react-native`
  (`KeyboardAvoidingView`), `react` (`useContext`) y
  `expo-router/react-navigation` (`HeaderHeightContext`) en la pantalla. No
  hay capas nuevas ni lógica fuera de la pantalla.
- C4 TDD: [x] el bloque nuevo vive en el `it` de
  `describe('#146 R6: …')`. [x] Historial rojo→verde: `b493f04d` (test,
  1 fichero) → `caffb588` (feat, 1 fichero) → `495319fa` (docs). Rojo
  reproducido por mí (punto 4).
- C5 trazabilidad: [x] la fila R6 cita `b493f04d` y `caffb588`; solo cambia
  esa línea (numstat 1/1). [x] La única aparición de «pendiente» es la regla
  de la línea 38, no una fila. [x] Los tres mensajes son literales del handoff
  y siguen `tipo(scope): desc (R6, E1)`.
- C6 spec aprobada: [x] `status: approved`. [x] La casilla «Enmienda E1
  aprobada por humano, P-E1 incluida» está marcada. La marcó `bc917ff7`
  (`- [ ]` → `- [x] … (fecha: 2026-10-02)`).
- C7 sin código huérfano: [x] la raíz `View` del formulario se sustituye en
  sitio. `View` sigue en uso (contenedor del mapa). No queda ningún módulo ni
  test reemplazado.
- C8 UI móvil: [x] grep-clean sobre `git diff 635087af..HEAD --
  mobile-pet-tracker/`: cero hex, cero clases arbitrarias, cero
  `StyleSheet.create`, cero shadow/elevation (exit=1, sin coincidencias).
  [x] Safe area: `insets.bottom + 24` del `contentContainerStyle` del
  formulario no cambia. [x] Ni Skeleton, ni tappables, ni animaciones
  Reanimated nuevas. [x] `docs/` no menciona `KeyboardAvoidingView` ni
  `HeaderHeightContext`, así que el cambio no choca con ninguna decisión fija
  de la carta.

### 1–2. Producción hace exactamente E1.1

Evidencia: `git show caffb588` y grep en `src/screens/geofence-editor/index.tsx`.

- `:6` `import { Alert, KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';`
  sale de `react-native`.
- `:138` `<KeyboardAvoidingView testID="screen-geofence-editor" className="flex-1" behavior="padding" keyboardVerticalOffset={headerHeight}>`
  y `:182` `</KeyboardAvoidingView>;`. `Platform` no aparece en el fichero.
- `:3` `import { HeaderHeightContext } from 'expo-router/react-navigation';`
  y `:94` `const headerHeight = useContext(HeaderHeightContext);`, justo tras
  `useSafeAreaInsets()`. No hay `?? 0` ni `useHeaderHeight` en el fichero.
- La raíz de carga y errores sigue en `:82` `<ScrollView testID="screen-geofence-editor" className="flex-1 bg-background"`
  y cierra en `:86`. Los cuatro hunks de `caffb588` no la tocan.

### 3. El test hace exactamente E1.2

- `mount()` envuelve los `children` del `Wrapper` en
  `<HeaderHeightContext.Provider value={91}>`, importado de
  `'expo-router/react-navigation'`. `DeviceEventEmitter` viene de
  `'react-native'`. Es el único cambio en `mount()`.
- Comparé el bloque de `requirements.md` E1.2 punto 2 con las líneas
  207–216 de `index.test.tsx`, sin la sangría: **idénticos** (`diff`
  exit=0). El bloque va tras la última aserción previa del `it`
  `'compone mapa y formulario sin fondo sobre el mapa y con las métricas A11 en el formulario'`.
- No hay `it` nuevos. El número de llamadas `it(`/`it.each(` es 51 en
  `635087af` y 51 en HEAD. Mi corrida en HEAD da `Tests: 68 passed, 68 total`
  (exit=0), así que el editor sigue en 68.
- §«Esperas sobre el árbol renderizado»: la única espera nueva es
  `waitFor(() => expect(screen.getByTestId('screen-geofence-editor')).toHaveStyle({ paddingBottom: 291 }))`.
  Espera sobre el árbol, vuelve a consultar el nodo dentro de `waitFor` y
  asevera lo mismo que observa. No hay contadores de mock ni timers.

### 4. Historial rojo→verde

- `b493f04d`: solo `index.test.tsx` (+13 −2). `caffb588`: solo
  `index.tsx` (+6 −4). `495319fa`: solo `traceability.md` e
  `impl_mobile-geofence-editor.md`.
- `git diff b493f04d HEAD -- index.test.tsx` está vacío: el test de HEAD es
  el del commit rojo.
- Para reproducir el rojo hice `git checkout caffb588^ -- index.tsx`
  (el padre de `caffb588` es `b493f04d`) y corrí jest sobre el fichero:
  exit=1, `Tests: 1 failed, 67 passed, 68 total`. Solo cae it 18, **por
  aserción** en `index.test.tsx:207`
  `expect(root).toHaveStyle({ paddingBottom: 0 })`, con
  `- paddingBottom: 0;` y sin Received.
- Restauré con `git checkout HEAD -- …/index.tsx` (exit=0). Después,
  `git diff --cached --stat` quedó vacío y `git diff --stat` solo mostraba
  este fichero de review, aún sin commitear.

### 5. Mutaciones

Cada mutación la planté con `perl` sobre `index.tsx`, corrí jest sobre el
fichero y la revertí con `git checkout HEAD --`. Tras cada reversión,
`git diff --stat -- mobile-pet-tracker` y `git diff --cached --stat`
quedaron vacíos. Los logs están en el scratchpad (`r3-<id>.txt`).

| Id | Mutación | Esperado | Visto | Cómo cae |
|---|---|---|---|---|
| E1-a | quitar `behavior="padding"` | 67/68, it 18 en `paddingBottom: 0` | 67/68, `:207`, `- paddingBottom: 0` | aserción |
| E1-b | `keyboardVerticalOffset={0}` | 67/68, it 18 en 291, llega 200 | 67/68, `:216`, `- 291 / + 200` | aserción |
| E1-c | quitar `keyboardVerticalOffset` | 67/68, it 18 en 291, llega 200 | 67/68, `:216`, `- 291 / + 200` | aserción |
| E1-d | `behavior="height"` | 67/68, it 18 en `paddingBottom: 0` | 67/68, `:207`, `- paddingBottom: 0` | aserción |
| RV-1 | offset `headerHeight + 1` | rojo en 291, llega 292 | 67/68, `:216`, `- 291 / + 292` | aserción |
| RV-2 | `enabled={false}` | rojo en 291, llega 0 | 67/68, `:216`, `- 291 / + 0` | aserción |
| RV-3 | raíz `View`; la KAV (con su propio `useContext`) envuelve `<GeofenceEditorForm>` en `GeofenceEditorScreen` | rojo en `:207` | 67/68, `:207`, `- paddingBottom: 0` | aserción |
| RV-4 | raíz `View`; la KAV envuelve solo el `ScrollView` del formulario | rojo antes del bloque nuevo | 67/68, `:197` `childTestIds(root)` | aserción (la de hijos de antes) |
| RV-5 | `behavior={Platform.OS === "ios" ? "padding" : undefined}` | verde: zona ciega, jest-expo corre como iOS | 68/68, exit=0 | no cae |
| RV-6 | `useHeaderHeight()` en lugar de `useContext(HeaderHeightContext)` | verde: el Provider de `mount()` evita que lance | 68/68, exit=0 | no cae |
| RV-7 | `keyboardVerticalOffset={91}` (literal) | verde: coincide con el valor del Provider | 68/68, exit=0 | no cae |

Las cuatro de la tabla E1.3 caen donde dice la spec y como dice el informe
de Codex. RV-1 a RV-4 confirman que el candado fija el valor exacto del
offset, el `enabled` y que la KAV es la raíz con el testID. RV-5 a RV-7
pasan: ver las observaciones 1 y 2.

### 6. Trazabilidad

`git diff 635087af..HEAD -- specs/mobile-geofence-editor/traceability.md`
cambia una sola línea, la fila R6. Añade
`` `b493f04d` test(geofences): lock the keyboard padding of the editor root (R6, E1); `caffb588` feat(geofences): keep the editor form above the keyboard (R6, E1) ``
tras los tres hashes que ya estaban. Los dos hashes son ancestros de HEAD
(`git merge-base --is-ancestor`, exit=0).

### 7. Alcance cerrado

- `git diff --stat 635087af..HEAD` toca 4 ficheros: `index.test.tsx`,
  `index.tsx`, `traceability.md` e `impl_mobile-geofence-editor.md`.
- `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` contra
  `origin/main` = `cb14497c` (tras un `fetch`) da 22 ficheros, el mismo
  conjunto que en `8944dfe9`, la ronda 2 (`diff` de `--name-only` vacío). Los
  22 aparecen en `design.md`, la lista de ficheros del handoff original.

### 8. El informe de Codex cuadra con el árbol

- Paso 0 en `635087af` con `git diff --stat 7e7b16b9 HEAD` limitado a
  `progress/`: cuadra con el historial.
- Rojo 1/67, `:207`, `- paddingBottom: 0`: lo reproduje igual. Verde 68/68:
  lo reproduje igual.
- E1-a…E1-d: los bloques `●` del informe dan `:207`/`:216` y `200`, como en
  mis corridas.
- Cierre 90 suites / 1852 tests / 1 snapshot: coincide con el log del
  `init.sh` del leader.
- Lista de commits propios: 46 hashes más el documental `495319fa` = 47. Son
  46 distintos, todos ancestros de HEAD, e incluyen `b493f04d` y `caffb588`.
  Al cruzar con `git log --ancestry-path 9dee0e62..HEAD` (64 commits) sale
  64 = 46 + 16 excluidos + `fb3c7488` + `495319fa`. Ver la observación 3.

### init.sh

No lo ejecuté, por orden del leader. El clasificador lo deniega y otra
sesión lanza el suyo. Leí entero el resumen de
`…/scratchpad/init-146-r3.log` (22 854 líneas, rutas de
`/home/claude/sites/Pet-Tracker-wt-146`; el leader lo corrió sobre
`495319fa` con exit=0):

```
Build exitoso
Backend unit:  Test Suites: 174 passed, 174 total / Tests: 1335 passed, 1335 total
               Test Suites: 2 passed, 2 total / Tests: 14 passed, 14 total
Móvil:         Test Suites: 90 passed, 90 total / Tests: 1852 passed, 1852 total / Snapshots: 1 passed, 1 total
               (PASS src/screens/geofence-editor/index.test.tsx)
e2e:           Test Suites: 3 skipped, 28 passed, 28 of 31 total / Tests: 8 skipped, 423 passed, 431 total
Lint sin errores · Typecheck sin errores · Todo verde. Listo para trabajar.
```

Ningún paso del log tiene marca de fallo. Las líneas `ERROR` de Nest
(`PositionsConsumerService`, `PollerService`, `DrizzleQueryError` en e2e)
son logs de casos de error esperados dentro de suites que pasan.

### Observaciones ronda 3

1. **No bloqueante. Zona ciega por plataforma (RV-5).**
   `behavior={Platform.OS === 'ios' ? 'padding' : undefined}`, la receta de
   la guía de Expo que E1.1 descarta a propósito, deja el editor en 68/68.
   jest-expo corre con `Platform.OS === 'ios'`, y en ese caso it 18 no
   distingue Android. Es justo la plataforma del fallo. Hoy la producción no
   importa `Platform` (verificado por grep). La spec ya dice que el efecto en
   el teléfono solo lo ve la prueba de humo (§Fuera de alcance, «Comportamiento
   del teclado»). Por eso la casilla del paso 9 en el dev build de Android es
   la que cierra este hueco, y sigue sin marcar.
2. **No bloqueante. El origen del offset no está candado (RV-6, RV-7).**
   Con el Provider de `mount()` a 91, `useHeaderHeight()` no lanza en este
   fichero, y un literal `keyboardVerticalOffset={91}` da el mismo 291. Las
   dos mutaciones pasan. Lo que it 18 fija es el valor, no que salga de
   `useContext(HeaderHeightContext)`. Hoy el código cumple E1.1 a la letra
   (grep, punto 2). En la app, `useHeaderHeight` funcionaría dentro del stack
   nativo; el literal, no, porque la altura de la cabecera varía según el
   dispositivo.
3. **No bloqueante. Lista de excluidos incompleta en el informe de Codex.**
   La lista de «Commits del leader/humano y merges excluidos» de la
   Reanudación 5 omite `fb3c7488`. Es posterior a H0, es el segundo padre del
   merge `9dbe3de5` y solo toca `progress/current.md`. No cambia la cuenta de
   47 propios ni la afirmación de que los excluidos solo tocan `progress/` o
   `specs/`.
4. **No bloqueante, informativa.** En el log de `init.sh`, la suite móvil
   avisa «A worker process has failed to exit gracefully» justo antes de su
   resumen verde. No sale en los ficheros de E1 ni cambia el resultado
   (90/1852, exit=0).
