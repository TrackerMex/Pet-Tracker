---
feature: "mobile-geofence-editor"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-geofence-editor]]

## Precondiciones

Todo comando se corre desde `mobile-pet-tracker/` salvo que diga otra cosa.
Ningún comando lleva pipe: la salida va a un log y el código se imprime con
`echo "exit=$?"`.

- [ ] Las dos casillas de [[requirements]] §Aprobación que bloquean a Codex
      están firmadas: la spec y la enmienda A19. La prueba de humo se firma
      al final y no bloquea el arranque.
- [ ] #41 está mergeada en `main` y la branch se ha actualizado desde
      `origin/main`. Desde la raíz del repo:
      `git merge-base --is-ancestor 95b2aaa4 HEAD; echo "exit=$?"` → `exit=0`.
      Las anclas de R11–R18 se verificaron en `d637757e`, descendiente de
      `95b2aaa4` sin cambios en `mobile-pet-tracker/` entre los dos.
      Si #41 entró por squash y da `exit=1`, la comprobación válida es la
      tabla de [[design]] §Anclas: cada ancla da su recuento esperado con
      `grep -cF` sobre el HEAD del handoff. Si una no lo da, **para** y avisa;
      no re-anclas tú.
- [ ] `test ! -e .expo/types/router.d.ts; echo "exit=$?"` → `exit=0`. Si da
      `exit=1`, para y pide al humano que lo borre (tu sandbox deniega el
      borrado); con ese fichero el typecheck falla por rutas fantasma.
- [ ] Base medida por el leader en el handoff (suites / tests / skipped):
      `____ / ____ / ____`. El cierre debe dar base + 2 suites y
      base + 142 tests, con los mismos skipped ([[design]] §Delta de tests).
- [ ] Skills de Codex cargadas: `building-native-ui` y
      `native-data-fetching`. Ninguna otra skill de Expo se pide por nombre.
- [ ] Enmienda A19 aplicada en su propio commit
      `docs(specs): apply amendment A19 of #146`, **antes** del primer commit
      rojo, con las comprobaciones de [[requirements]] §Enmiendas. Su test:
      `bunx jest --runTestsByPath 'src/__tests__/hero-header-amendments.test.ts' > /tmp/146-a19.log 2>&1; echo "exit=$?"` → `exit=0`.
- [ ] Sin dependencias nuevas: `git diff --stat 95b2aaa4 -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock`
      vacío al cerrar. Si algo pidiera instalar, para.

## Conjuntos comunes

Las tareas de abajo los nombran por su nombre; se copian literales al final
del mismo `--runTestsByPath`, cada ruta entre comillas simples (los
corchetes y paréntesis de una ruta sin comillas son regex para jest y el
fichero se salta en silencio con `exit=0`).

**CANDADOS** (4):

```
'src/__tests__/ui-language.test.ts' 'src/__tests__/design-drift.test.ts' 'src/__tests__/consistency-classnames.test.ts' 'src/__tests__/legibility-classnames.test.ts'
```

**RECORRIDOS** (8):

```
'src/app/__tests__/alert-detail.navigation.test.tsx' 'src/app/__tests__/alert-detail.notification.test.tsx' 'src/app/__tests__/detail-stack.guard.test.tsx' 'src/app/__tests__/detail-stack.navigation.test.tsx' 'src/app/__tests__/reminders-alerts-stack.navigation.test.tsx' 'src/app/__tests__/reminders-alerts-stack.notification.test.tsx' 'src/hooks/use-pet-selection.test.tsx' 'src/hooks/use-push-registration.navigation.test.tsx'
```

**Ciclo de cada requisito** (C4 de `CHECKPOINTS.md`, un commit por paso):

1. **Rojo** — commit `test(geofences): <qué> (Rn)` con el test nuevo, los
   cambios de su fila de [[design]] D8 y los esqueletos de tipos que el test
   importe. Se corre el fichero del test: `exit≠0`, con exactamente los
   rojos que dice el requisito, todos por aserción o por consulta; ninguno
   por `Cannot find module` ni por error de tipos. El recuento de rojos se
   anota en `progress/impl_mobile-geofence-editor.md`.
2. **Verde** — commit `feat(geofences): <qué> (Rn)` con la implementación
   mínima. Se corren el fichero, los CANDADOS y lo que diga el requisito:
   `exit=0`. Además `bunx tsc --noEmit > /tmp/146-tsc.log 2>&1; echo "exit=$?"`
   y `bunx expo lint > /tmp/146-lint.log 2>&1; echo "exit=$?"`, los dos
   `exit=0`.
3. **Refactor** — solo si hace falta, commit `refactor(geofences): <qué> (Rn)`
   y los mismos comandos del verde en `exit=0`.

Las mutaciones M-n de [[design]] §Mutaciones se plantan a mano sobre el
verde, se corre el fichero que debe enrojecer, se anota qué `it` cae y se
revierten con `git checkout HEAD -- <ruta>`; `git diff --cached --stat`
debe quedar vacío. Ninguna mutación se commitea salvo M13 en R10 y M24 en
R18 (las dos en su commit rojo, revertidas en el verde).

**Orden de ejecución.** Las secciones van en el orden en que se ejecutan,
que no es el numérico: R17 tras R3 (el editor de R6 nace importando
`DEFAULT_CENTER`), R15 tras R4 (el centro se valida antes de que el editor
y la pestaña Mapa lo lean), R12–R14 y R16 tras R9 (amplían la lista y el
formulario que R6–R9 crean), R11 tras R15 y R17, R10 tras todo el copy
(R12, R13, R14 y R16 añaden ocurrencias) y R18 al final (tras R16, que fija
el único nodo tabular del editor). Ningún requisito asevera nodos que un
requisito posterior en este orden cree.

## R1 — Catálogo de copy

- [ ] **Rojo** `test(geofences): add geofence editor catalog keys test (R1)`
  - `src/providers/__tests__/language-provider.test.tsx`: el `describe` de
    [[requirements]] R1, justo después del `describe('#41 R1: …')`, y la
    fila 1 de [[design]] D8 (`#65 R12`).
  - `bunx jest --runTestsByPath 'src/providers/__tests__/language-provider.test.tsx' > /tmp/146-r1.log 2>&1; echo "exit=$?"`
    → `exit≠0` con 2 rojos por aserción: el nuevo y `#65 R12`.
- [ ] **Verde** `feat(geofences): add geofence editor catalog keys (R1)`
  - `src/i18n/catalog.ts`: las catorce claves `geofenceEditor.*` en `es` y
    en `en`, con los textos de R1 (el catálogo pasa de 320 a 334 claves).
  - `specs/mobile-ui-language/design.md`: la sección
    `### §2.16 — Añadidos por #146 — Editor de zonas seguras` justo antes de
    `## 3. La infraestructura`, una fila por clave.
  - Mismo comando + CANDADOS → `exit=0`; tsc y lint en `exit=0`.

## R2 — `zoomForRadius`

- [ ] **Rojo** `test(geofences): add zoomForRadius test (R2)`
  - `src/utils/zoom-for-radius.test.ts` (nuevo) con el `describe` y las 8
    filas de [[requirements]] R2.
  - Esqueleto en `src/utils/zoom-for-radius.ts`:
    `export function zoomForRadius(radiusM: number): number { return 0; }`.
  - `bunx jest --runTestsByPath 'src/utils/zoom-for-radius.test.ts' > /tmp/146-r2.log 2>&1; echo "exit=$?"`
    → `exit≠0` con 8 rojos por aserción.
- [ ] **Verde** `feat(geofences): frame a circle by its radius (R2)`
  - La fórmula de [[design]] D3.
  - Mismo comando → `exit=0`; tsc y lint en `exit=0`.

## R3 — `PetMap`

- [ ] **Rojo** `test(geofences): add PetMap circles, zoom and press test (R3)`
  - `src/components/__tests__/pet-map.test.tsx`: el `describe` de
    [[requirements]] R3 (8 `it`) y el doble de tema
    `useThemeColors: (tokens) => tokens.map((token) => \`color:${token}\`)`
    en lugar de `useThemeColors: () => ['accent-color'],`.
  - Esqueleto de tipos en `src/components/pet-map.tsx`: `export type MapCircle`
    y las props opcionales `circles?`, `zoom?` y `onPress?` en
    `PetMapProps`, sin usarlas todavía.
  - `bunx jest --runTestsByPath 'src/components/__tests__/pet-map.test.tsx' > /tmp/146-r3.log 2>&1; echo "exit=$?"`
    → `exit≠0` con 8 rojos por aserción. Los `it` de PetMap anteriores a
    #146 siguen verdes con el doble nuevo; si alguno cae, para.
- [ ] **Verde** `feat(geofences): let PetMap draw circles and report taps (R3)`
  - Todo va en `mapViewProps` ([[design]] D2), tras
    `uiSettings: { zoomControlsEnabled: false },`.
  - `bunx jest --runTestsByPath 'src/components/__tests__/pet-map.test.tsx' 'src/screens/map/index.test.tsx'` + CANDADOS
    `> /tmp/146-r3g.log 2>&1; echo "exit=$?"` → `exit=0`; tsc y lint en `exit=0`.
  - Mutaciones de R3 ([[design]] §Mutaciones, M16 incluida).

## R17 — `DEFAULT_CENTER` en un solo sitio

- [ ] **Rojo** `test(geofences): lock the default map center in one place (R17)`
  - `src/__tests__/design-drift.test.ts`: el `describe` de
    [[requirements]] R17 (2 `it`) al final del fichero.
  - `bunx jest --runTestsByPath 'src/__tests__/design-drift.test.ts' > /tmp/146-r17.log 2>&1; echo "exit=$?"`
    → `exit≠0` con 2 rojos por aserción.
- [ ] **Verde** `refactor(map): export DEFAULT_CENTER from PetMap (R17)`
  - `DEFAULT_CENTER` exportado tras `export const MAP_ZOOM = 16;`; la
    pestaña Mapa borra el suyo y lo importa.
  - `bunx jest --runTestsByPath 'src/__tests__/design-drift.test.ts' 'src/screens/map/index.test.tsx' 'src/components/__tests__/pet-map.test.tsx' > /tmp/146-r17.log 2>&1; echo "exit=$?"`
    con CANDADOS añadidos a las rutas → `exit=0`; tsc y lint en `exit=0`.

## R4 — API

- [ ] **Rojo** `test(geofences): add geofence create and update API test (R4)`
  - `src/api/__tests__/geofences.test.ts`: el `describe` de [[requirements]]
    R4 (25 `it`), con los ayudantes del fichero (`response`,
    `invalidJsonResponse`, `baseUrl`).
  - Esqueletos en `src/api/geofences.ts`: los tipos `GeofenceDraft` y
    `GeofenceSaveState`, y `createGeofence` / `updateGeofence` con la firma
    de R4 que devuelven `{ kind: 'missing-config' }`.
  - `bunx jest --runTestsByPath 'src/api/__tests__/geofences.test.ts' > /tmp/146-r4.log 2>&1; echo "exit=$?"`
    → `exit≠0` con 23 rojos por aserción; los 2 Declarado en verde.
- [ ] **Verde** `feat(geofences): create and update geofences with save states (R4)`
  - `saveState` y las dos funciones de [[design]] D4, con `postJson` /
    `patchJson` de `src/api/http.ts`.
  - Mismo comando + CANDADOS → `exit=0`; tsc y lint en `exit=0`.
  - Mutación M6: los 2 Declarado caen con ella.

## R15 — `isGeofence` valida el centro

- [ ] **Rojo** `test(geofences): reject geofences without a numeric center (R15)`
  - `src/api/__tests__/geofences.test.ts`: el `describe` de
    [[requirements]] R15 (3 filas) y la fila 14 de [[design]] D8 (la fila
    `'an item without name'` de `#41 R2` parte de `makeGeofence('zone-1')`
    sin `name`).
  - `bunx jest --runTestsByPath 'src/api/__tests__/geofences.test.ts' > /tmp/146-r15.log 2>&1; echo "exit=$?"`
    → `exit≠0` con 3 rojos por aserción; la fila reescrita de `#41 R2`
    sigue verde (le falta el nombre).
- [ ] **Verde** `feat(geofences): validate the geofence center from the list (R15)`
  - Dos `typeof … === 'number'` más en `isGeofence`.
  - `bunx jest --runTestsByPath 'src/api/__tests__/geofences.test.ts' 'src/screens/geofences/index.test.tsx' > /tmp/146-r15.log 2>&1; echo "exit=$?"`
    con CANDADOS añadidos a las rutas → `exit=0` (los fixtures de la lista ya traen centro); tsc y lint en
    `exit=0`.

## R5 — Ruta y stack

- [ ] **Rojo** `test(geofences): add geofence editor route test (R5)`
  - `src/app/__tests__/detail-stack.test.tsx` y
    `src/app/__tests__/layout.test.tsx`: los `describe` de
    [[requirements]] R5 y las filas 2–4 de [[design]] D8.
  - `bunx jest --runTestsByPath 'src/app/__tests__/detail-stack.test.tsx' 'src/app/__tests__/layout.test.tsx' > /tmp/146-r5.log 2>&1; echo "exit=$?"`
    → `exit≠0` con 6 rojos por aserción: 3 nuevos y 3 heredados.
- [ ] **Verde** `feat(geofences): add the geofence editor route (R5)`
  - `src/app/pets/[petId]/geofence-editor.tsx`: route delgado
    ([[design]] D1).
  - `src/app/_layout.tsx`: el `Stack.Screen` del editor justo después de
    `name="pets/[petId]/geofences"`, último hijo de `Stack.Protected`.
  - `src/screens/geofence-editor/index.tsx`: el stub de R5 que devuelve
    `null`.
  - Mismo comando + CANDADOS + RECORRIDOS → `exit=0`; tsc y lint en `exit=0`.

## R6 — Editor: carga y estados

- [ ] **Rojo** `test(geofences): add geofence editor loading and states test (R6)`
  - `src/screens/geofence-editor/index.test.tsx` (nuevo) con los dobles de
    [[design]] D5 y el `describe` de [[requirements]] R6 (19 `it`).
  - `bunx jest --runTestsByPath 'src/screens/geofence-editor/index.test.tsx' > /tmp/146-r6.log 2>&1; echo "exit=$?"`
    → `exit≠0` con 18 rojos por consulta y 1 por aserción (el 17).
- [ ] **Verde** `feat(geofences): load the geofence editor and its states (R6)`
  - Sustituye el stub de R5. De `useAuth()` solo `token`, y solo estado de
    lectura: los setters y manejadores llegan en R7 y R8, y meterlos antes
    deja variables sin usar que el lint rechaza.
  - Mismo comando + CANDADOS → `exit=0`; tsc y lint en `exit=0`.

## R7 — Editor: borrador

- [ ] **Rojo** `test(geofences): add geofence editor draft test (R7)`
  - Mismo fichero: el `describe` de [[requirements]] R7 (8 `it`).
  - `bunx jest --runTestsByPath 'src/screens/geofence-editor/index.test.tsx' > /tmp/146-r7.log 2>&1; echo "exit=$?"`
    → `exit≠0` con 8 rojos por aserción; los 19 de R6 siguen verdes.
- [ ] **Verde** `feat(geofences): move the draft with taps and the slider (R7)`
  - Los setters del borrador y los manejadores de toque, slider y acciones
    de accesibilidad. La cámara no sigue al borrador ([[design]] D3).
  - Mismo comando + CANDADOS → `exit=0`; tsc y lint en `exit=0`.

## R8 — Editor: guardar

- [ ] **Rojo** `test(geofences): add geofence editor save test (R8)`
  - Mismo fichero: el `describe` de [[requirements]] R8 (16 `it`).
  - Filas 5–7 de [[design]] D8 en `src/__tests__/design-drift.test.ts` y
    `src/__tests__/consistency-classnames.test.ts`, y la fila 15 (el `it`
    `'deja los trece botones primarios sólidos en un único radio'` pasa a
    `'deja todos los botones primarios sólidos en un único radio'`).
  - `bunx jest --runTestsByPath 'src/screens/geofence-editor/index.test.tsx' 'src/__tests__/design-drift.test.ts' 'src/__tests__/consistency-classnames.test.ts' > /tmp/146-r8.log 2>&1; echo "exit=$?"`
    → `exit≠0` con 16 rojos por consulta y 3 heredados por aserción.
- [ ] **Verde** `feat(geofences): save the geofence and return to the list (R8)`
  - `signOut`, `useQueryClient`, `router` y las llamadas de R4;
    `invalidateQueries` antes de `router.back()` ([[design]] D6).
  - Mismo comando + CANDADOS + RECORRIDOS → `exit=0`; tsc y lint en `exit=0`.

## R9 — Lista: entrada al editor

- [ ] **Rojo** `test(geofences): add geofence list editor entry test (R9)`
  - `src/screens/geofences/index.test.tsx`: el doble de `expo-router` que
    el fichero no tiene hoy ([[design]] D5), el `describe` de
    [[requirements]] R9 (12 `it`) y las filas 8 y 9 de [[design]] D8.
  - Filas 10 y 11 en `src/__tests__/consistency-classnames.test.ts`.
  - `bunx jest --runTestsByPath 'src/screens/geofences/index.test.tsx' 'src/__tests__/consistency-classnames.test.ts' > /tmp/146-r9.log 2>&1; echo "exit=$?"`
    → `exit≠0` con 6 rojos por consulta y 4 heredados por aserción; los 6
    Declarado en verde. El resto de `it` de #41 sigue verde con el doble
    nuevo; si alguno cae, para.
- [ ] **Verde** `feat(geofences): open the editor from the geofence list (R9)`
  - La columna de la fila pasa a botón con `min-h-11` y el nombre a
    `selectable={!isOwner}` ([[design]] D7); el botón *Añadir zona* va antes
    de `{actionError ? (`.
  - Mismo comando + CANDADOS + RECORRIDOS → `exit=0`; tsc y lint en `exit=0`.
  - Mutaciones M10, M11 y M17: los Declarado caen con ellas.

## R12 — Lista: límite de 5 zonas en el cliente

- [ ] **Rojo** `test(geofences): lock the client-side geofence limit (R12)`
  - `src/screens/geofences/index.test.tsx`: el doble de `../../api/geofences`
    conserva `GEOFENCE_MAX_PER_PET` real con `jest.requireActual` (fila 18
    de [[design]] D8) y el `describe` de [[requirements]] R12 (4 `it`).
  - Esqueleto de tipos: `export const GEOFENCE_MAX_PER_PET = 5;` en
    `src/api/geofences.ts` entra **en el rojo** (el test lo importa; sin
    él el rojo sería de tipos). La pantalla no lo usa todavía.
  - `bunx jest --runTestsByPath 'src/screens/geofences/index.test.tsx' > /tmp/146-r12.log 2>&1; echo "exit=$?"`
    → `exit≠0` con 1 rojo por aserción y 1 por consulta; los 2 Declarado en
    verde. Los `it` de #41 y de R9 siguen verdes.
- [ ] **Verde** `feat(geofences): disable add zone at the geofence limit (R12)`
  - `atLimit`, `isDisabled={busy || atLimit}` y el aviso
    `geofences-limit` tras `geofences-add`.
  - Mismo comando + CANDADOS + RECORRIDOS → `exit=0`; tsc y lint en `exit=0`.
  - Mutaciones M21 y M22: los Declarado caen con ellas.

## R13 — Editor: activar y desactivar

- [ ] **Rojo** `test(geofences): add geofence editor active switch test (R13)`
  - `src/screens/geofence-editor/index.test.tsx`: el doble de
    `../../api/geofences` gana `setGeofenceActive` y `deleteGeofence`
    ([[design]] D12) y el `describe` de [[requirements]] R13 (7 `it`).
  - `bunx jest --runTestsByPath 'src/screens/geofence-editor/index.test.tsx' > /tmp/146-r13.log 2>&1; echo "exit=$?"`
    → `exit≠0` con 7 rojos por consulta; R6–R8 siguen verdes.
- [ ] **Verde** `feat(geofences): toggle the zone from the editor (R13)`
  - Extrae `run`, `refresh` y `leave` ([[design]] D12); Guardar pasa a
    `run(…, leave)`; la fila del interruptor entre el slider y la nota de
    reinicio.
  - Mismo comando + CANDADOS + RECORRIDOS → `exit=0`; tsc y lint en `exit=0`.
    `#87 R19` (en CANDADOS) sigue verde: un solo `signOut(`.

## R14 — Editor: eliminar

- [ ] **Rojo** `test(geofences): add geofence editor delete test (R14)`
  - Mismo fichero: el espía de `Alert.alert` en el `beforeEach` del
    `describe` y el `describe` de [[requirements]] R14 (9 `it`).
  - `bunx jest --runTestsByPath 'src/screens/geofence-editor/index.test.tsx' > /tmp/146-r14.log 2>&1; echo "exit=$?"`
    → `exit≠0` con 7 rojos por consulta y 1 por aserción; el Declarado en
    verde.
- [ ] **Verde** `feat(geofences): delete the zone from the editor (R14)`
  - Botón `geofence-editor-delete` tras Guardar y `confirmDelete` con
    `run(…, leave)`.
  - Mismo comando + CANDADOS + RECORRIDOS → `exit=0`; tsc y lint en `exit=0`.
  - Mutación M23: el Declarado cae con ella.

## R16 — Editor: solo lectura para quien no es dueño

- [ ] **Rojo** `test(geofences): add geofence editor read-only test (R16)`
  - `src/screens/geofence-editor/index.test.tsx`: el doble de
    `../../api/pets` con `getPet` dueño en el `beforeEach` común
    ([[design]] D13) y el `describe` de [[requirements]] R16 (9 `it`).
  - `bunx jest --runTestsByPath 'src/screens/geofence-editor/index.test.tsx' > /tmp/146-r16.log 2>&1; echo "exit=$?"`
    → `exit≠0` con 6 rojos por aserción y 3 por consulta; R6–R14 siguen
    verdes con el doble nuevo.
- [ ] **Verde** `feat(geofences): show the zone read-only to non-owners (R16)`
  - La consulta del rol, la rama 6 y `readOnly` en el formulario
    ([[design]] D13); un solo `geofence-editor-radius-value` en el JSX.
  - Mismo comando + CANDADOS + RECORRIDOS → `exit=0`; tsc y lint en `exit=0`.

## R11 — Pestaña Mapa: círculos de las zonas

- [ ] **Rojo** `test(geofences): add map tab geofence circles test (R11)`
  - `src/screens/map/index.test.tsx`: el doble de `../../api/geofences`
    ([[design]] D10), `listGeofences` pendiente en el `beforeEach` común, el
    `describe` de [[requirements]] R11 (6 `it`) y la fila 13 de [[design]]
    D8 (`#87 R18`).
  - `bunx jest --runTestsByPath 'src/screens/map/index.test.tsx' > /tmp/146-r11.log 2>&1; echo "exit=$?"`
    → `exit≠0` con 2 rojos por aserción y 1 heredado por aserción
    (`#87 R18`); los 4 Declarado en verde. El resto de `it` del fichero
    sigue verde con el doble nuevo; si alguno cae, para.
- [ ] **Verde** `feat(geofences): draw active geofences on the map tab (R11)`
  - La consulta de zonas con `enabled: selectedPetId !== null`, fuera del
    poll, y `circles` con solo las activas.
  - `bunx jest --runTestsByPath 'src/screens/map/index.test.tsx' 'src/components/__tests__/pet-map.test.tsx' > /tmp/146-r11.log 2>&1; echo "exit=$?"`
    con CANDADOS y RECORRIDOS añadidos a las rutas → `exit=0`; tsc y lint en `exit=0`.
  - Mutaciones M18, M19 y M20: los Declarado caen con ellas.

## R10 — Copy por clave

Vía (b) de C4: cuando R10 llega, el copy ya se resuelve por clave, así que
el rojo se fabrica con la mutación M13 y el verde la quita.

- [ ] **Rojo** `test(geofences): add geofence editor copy-by-key test (R10)`
  - `src/__tests__/ui-copy-table.ts`: `R15_GEOFENCE_EDITOR` (27 filas),
    añadido tras `...R14_GEOFENCES,` y en la línea de bloques; el `it`
    `'cuadra ALL_USES con la suma de los doce bloques'` se renombra a
    `'cuadra ALL_USES con la suma de sus bloques'` (fila 16 de [[design]]
    D8).
  - `src/__tests__/ui-language.test.ts`: el `describe` de [[requirements]]
    R10 justo después del `describe('#41 R10: …')`, y la fila 12 de
    [[design]] D8.
  - M13 plantada en `src/screens/geofence-editor/index.tsx`:
    `const retryKey = 'common.retry' as const;` y `t(retryKey)` en el botón
    de reintentar.
  - `bunx jest --runTestsByPath 'src/__tests__/ui-language.test.ts' > /tmp/146-r10.log 2>&1; echo "exit=$?"`
    → `exit≠0` con 1 rojo nuevo por aserción y `#65 R18` heredado.
- [ ] **Verde** `feat(geofences): resolve geofence editor copy by key (R10)`
  - Revierte M13: vuelve `t('common.retry')`.
  - Mismo comando + CANDADOS → `exit=0`; tsc y lint en `exit=0`.

## R18 — El editor entra en los contadores de `TABULAR_NUMS`

Vía (b) de C4, como R10: el editor ya cumple desde R6, así que el rojo
planta M24 y el verde la quita.

- [ ] **Rojo** `test(geofences): count the editor among tabular counters (R18)`
  - `src/__tests__/consistency-classnames.test.ts`: la fila del editor en
    `counters` y el `+ 1` de `#69 R10` (fila 17 de [[design]] D8).
  - M24 plantada en `src/screens/geofence-editor/index.tsx`: sin
    `style={TABULAR_NUMS}` en `geofence-editor-radius-value` (y sin el
    import, que lint daría por no usado).
  - `bunx jest --runTestsByPath 'src/__tests__/consistency-classnames.test.ts' > /tmp/146-r18.log 2>&1; echo "exit=$?"`
    → `exit≠0` con 1 rojo por aserción (la fila nueva).
- [ ] **Verde** `feat(geofences): use tabular digits in the editor radius (R18)`
  - Revierte M24.
  - Mismo comando + CANDADOS + `'src/screens/geofence-editor/index.test.tsx'` → `exit=0`; tsc y lint en `exit=0`.

## Cierre

- [ ] Suite completa, sin pipe:
      `bunx jest > /tmp/146-full.log 2>&1; echo "exit=$?"` → `exit=0`, con
      base + 2 suites y base + 142 tests y los mismos skipped
      ([[design]] §Delta de tests).
- [ ] `bunx tsc --noEmit` y `bunx expo lint`, cada uno a su log, en `exit=0`.
- [ ] Desde la raíz, las búsquedas de [[requirements]] §Verificación salen
      vacías:
      `git grep -n "queryKey: \[" -- mobile-pet-tracker/src/screens/geofence-editor`
      y
      `git grep -n "useMutation\|useFocusEffect\|staleSeconds" -- mobile-pet-tracker/src/screens/geofence-editor`.
- [ ] `git diff --name-only <hash del handoff>..HEAD` solo lista ficheros de
      `files_affected` de #146 en `feature_list.json` más `progress/`.
- [ ] Cada M-n de [[design]] §Mutaciones probada y anotada (qué `it` cae);
      `git diff --cached --stat` vacío tras revertirlas.
- [ ] `graphify update .` desde la raíz.
- [ ] [[traceability]] rellena: una fila por R-id y la de A19, con test y
      hash de commit.
- [ ] `progress/impl_mobile-geofence-editor.md` con la base medida, los
      rojos de cada requisito, el resultado de cada mutación, las cifras
      finales y cualquier desvío de esta spec.
- [ ] La prueba de humo **no** es de Codex: la corre el humano en el dev
      build de Android ([[requirements]] §Prueba de humo). Codex no marca
      ninguna casilla de §Aprobación ni cambia el `status` de la feature.
