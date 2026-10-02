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
      Si #41 entró por squash y da `exit=1`, la comprobación válida es la
      tabla de [[design]] §Anclas: cada ancla da su recuento esperado con
      `grep -cF` sobre el HEAD del handoff. Si una no lo da, **para** y avisa;
      no re-anclas tú.
- [ ] `test ! -e .expo/types/router.d.ts; echo "exit=$?"` → `exit=0`. Si da
      `exit=1`, para y pide al humano que lo borre (tu sandbox deniega el
      borrado); con ese fichero el typecheck falla por rutas fantasma.
- [ ] Base medida por el leader en el handoff (suites / tests / skipped):
      `____ / ____ / ____`. El cierre debe dar base + 2 suites y
      base + 101 tests, con los mismos skipped ([[design]] §Delta de tests).
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
debe quedar vacío. Ninguna mutación se commitea salvo M13 en R10.

## R1 — Catálogo de copy

- [ ] **Rojo** `test(geofences): add geofence editor catalog keys test (R1)`
  - `src/providers/__tests__/language-provider.test.tsx`: el `describe` de
    [[requirements]] R1, justo después del `describe('#41 R1: …')`, y la
    fila 1 de [[design]] D8 (`#65 R12`).
  - `bunx jest --runTestsByPath 'src/providers/__tests__/language-provider.test.tsx' > /tmp/146-r1.log 2>&1; echo "exit=$?"`
    → `exit≠0` con 2 rojos por aserción: el nuevo y `#65 R12`.
- [ ] **Verde** `feat(geofences): add geofence editor catalog keys (R1)`
  - `src/i18n/catalog.ts`: las doce claves `geofenceEditor.*` en `es` y en
    `en`, con los textos de R1 (el catálogo pasa de 320 a 332 claves).
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
    `src/__tests__/consistency-classnames.test.ts`.
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

## R10 — Copy por clave

Vía (b) de C4: cuando R10 llega, el copy ya se resuelve por clave, así que
el rojo se fabrica con la mutación M13 y el verde la quita.

- [ ] **Rojo** `test(geofences): add geofence editor copy-by-key test (R10)`
  - `src/__tests__/ui-copy-table.ts`: `R15_GEOFENCE_EDITOR` (17 filas),
    añadido tras `...R14_GEOFENCES,` y en la línea de bloques.
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

## Cierre

- [ ] Suite completa, sin pipe:
      `bunx jest > /tmp/146-full.log 2>&1; echo "exit=$?"` → `exit=0`, con
      base + 2 suites y base + 101 tests y los mismos skipped
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
