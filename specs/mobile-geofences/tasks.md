---
feature: "mobile-geofences"
status: approved    # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-geofences]] (#41)

> Disciplina TDD: **(1) test rojo → (2) implementación mínima → (3) refactor**,
> requisito por requisito. Commits **test-primero**: el rojo va en su propio
> commit, separado del verde, y cada `it` nuevo falla por **aserción** o por
> **consulta** (un `getByTestId` o `findByTestId` que no encuentra el nodo),
> nunca por un `ReferenceError`, un módulo inexistente ni un import roto
> (CHECKPOINTS C4). Por eso los rojos de R2 y R3 llevan su **esqueleto** de
> tipos en el mismo commit rojo ([[design]] D2).
>
> **Ruta (b) de C4 en R10**: el copy ya está escrito por clave cuando llega su
> test, así que el commit rojo planta en **producción** la mutación declarada y
> el verde la revierte; el mensaje del commit rojo la nombra. Ningún otro paso
> planta mutaciones: las M-n de [[design]] §1 son las sondas del spec_author,
> no pasos de Codex.
>
> Cada rojo se declara **por `it`**: cuáles de los `it` nuevos fallan y si es
> por aserción o por consulta, y qué `it` heredados caen con ellos. Si en el
> log sale otro `it` rojo, u otra clase de fallo, **parar** y reportarlo en
> `progress/impl_mobile-geofences.md`: no se ajusta el test para que cuadre.
>
> Rutas relativas a `mobile-pet-tracker/` salvo las que empiezan por `../`.
> Todos los comandos se lanzan **desde `mobile-pet-tracker/`**, con `bunx`
> (nunca `npx`) y **sin pipe**: `cmd > /tmp/x.log 2>&1; echo "exit=$?"`.
> Toda ancla es por contenido (`grep -F`), nunca por número de línea.

## Antes de empezar

- [ ] `git branch --show-current` → `feature/41-mobile-geofences`.
- [ ] La branch está encima de `origin/main` `4e8d6cc3`:
      `git merge-base --is-ancestor 4e8d6cc3 HEAD; echo "exit=$?"` → `exit=0`.
      Si sale `1`, **no empezar**: avisar al leader. #60 **no** hace falta
      (enmienda E1 de [[requirements]], 2026-10-02).
- [ ] Anotar `git rev-parse --short HEAD` en `progress/impl_mobile-geofences.md`
      como **HEAD del handoff**. Todos los `git diff` de §Cierre se miden contra
      ese hash. No rebasear después de rellenar [[traceability]].
- [ ] Casillas firmadas en [[requirements]] §Aprobación: **A18** y **spec**.
      Sin las dos no se empieza. La casilla de la prueba de humo es del humano
      y se firma después.
- [ ] `test ! -e .expo/types/router.d.ts; echo "exit=$?"` → `exit=0`. Si sale
      `1`, **no** borrarlo (ni `rm -f`): pedir al humano que lo borre y esperar.
      Repetir la comprobación antes de cada `tsc`.
- [ ] **No lanzar `./init.sh`** ni tocar Postgres ni LocalStack: los comparte
      otra sesión. Se mide con `bunx jest`, `bunx tsc --noEmit` y
      `bunx expo lint`.
- [ ] Sin dependencias nuevas: ni `bun add` ni cambios en `package.json`,
      `bun.lock` o `app.json`.
- [ ] Medir la base **sin pipe** y anotarla:
      `bunx jest --silent > /tmp/base41.txt 2>&1; echo "exit=$?"` → `exit=0`.
      Referencias: en `03f57706`, 86 suites / 1640 tests / 1 snapshot; en el
      merge simulado de `4e8d6cc3` con `03f57706`, 86 / 1655 / 1; en
      `6a46f677` (mismo `mobile-pet-tracker/` que `4e8d6cc3`, sin #60), 86 /
      1634 en el `./init.sh` del leader. Manda la que
      mida Codex; de ella sale el delta de §Cierre.
      `bunx tsc --noEmit > /tmp/tsc41.txt 2>&1; echo "exit=$?"` y
      `bunx expo lint > /tmp/lint41.txt 2>&1; echo "exit=$?"` → `exit=0` y los
      dos ficheros con 0 bytes (`wc -c /tmp/tsc41.txt /tmp/lint41.txt`).
- [ ] Anclas por contenido. Cada comando debe dar el número indicado; si uno
      no lo da, **parar** y avisar al leader:

      | Comando | Esperado |
      |---|---|
      | `grep -c 'testID="pairing-link"' src/screens/profile/index.tsx` | `1` |
      | `grep -c '<ChevronRight' src/screens/profile/index.tsx` | `3` |
      | `grep -cF "'alerts.openedAt'" src/i18n/catalog.ts` | `2` |
      | `grep -cF 'name="alerts/[alertId]"' src/app/_layout.tsx` | `1` |
      | `grep -c 'export const mediaKeys' src/api/query-keys.ts` | `1` |
      | `grep -c '^## 3. La infraestructura' ../specs/mobile-ui-language/design.md` | `1` |
      | `grep -cF "'screens/alert-detail/index.tsx': 1," src/__tests__/design-drift.test.ts` | `1` |
      | `grep -cF "key: 'profile.gpsSettings'" src/__tests__/ui-copy-table.ts` | `1` |
      | `grep -cF -- '- 6 + 1 + 2 + 3,' src/providers/__tests__/language-provider.test.tsx` | `1` |

- [ ] Skills de Codex: `building-native-ui` y `native-data-fetching`. **No hay
      skill de router**: lo que hace falta de `expo-router` está en [[design]]
      D1 y D9. No pedir skills por otros nombres.
- [ ] Leer [[design]] D3 (filas de prueba por `describe`) y D7 (plan de tests
      por fichero) antes de escribir el test de la pantalla. Los dobles se
      escriben por la intención de D7 y se comprueban contra el fichero que
      importa la pantalla; no se calcan de otra suite.
- [ ] Filtros de jest: siempre `--runTestsByPath` y cada ruta **entre comillas
      simples**. Tras cada comando, el número de suites que imprime jest debe
      ser el de ficheros pedidos.

**Conjuntos de ficheros que se repiten en los comandos:**

- **Candados de estilo y copy** (4 ficheros): `'src/__tests__/ui-language.test.ts'`
  `'src/__tests__/design-drift.test.ts'`
  `'src/__tests__/consistency-classnames.test.ts'`
  `'src/__tests__/legibility-classnames.test.ts'`.
- **Recorridos con el router real** (8 ficheros, [[design]] D7):
  `'src/app/__tests__/alert-detail.navigation.test.tsx'`
  `'src/app/__tests__/alert-detail.notification.test.tsx'`
  `'src/app/__tests__/detail-stack.guard.test.tsx'`
  `'src/app/__tests__/detail-stack.navigation.test.tsx'`
  `'src/app/__tests__/reminders-alerts-stack.navigation.test.tsx'`
  `'src/app/__tests__/reminders-alerts-stack.notification.test.tsx'`
  `'src/hooks/use-pet-selection.test.tsx'`
  `'src/hooks/use-push-registration.navigation.test.tsx'`.

Donde un comando dice «+ candados» o «+ recorridos», se añaden esas rutas
literales al final del mismo `--runTestsByPath`.

## Orden y por qué es ese (candado del sujeto ausente)

| # | Commit | Asevera sobre | ¿Existe cuando se asevera? |
|---|---|---|---|
| 0 | A18 (docs) | — | Commit de docs, antes del primer rojo |
| 1 | R1 rojo → verde | once claves del catálogo y su fila en la spec de idioma | Sí: el catálogo y `../specs/mobile-ui-language/design.md` existen; el rojo es la ausencia de las claves |
| 2 | R2 rojo → verde | `listGeofences` y `geofenceKeys.list` | El esqueleto de [[design]] D2 va en el commit rojo; el rojo es su respuesta fija `missing-config` y su clave sin `petId` |
| 3 | R3 rojo → verde | `setGeofenceActive` y `deleteGeofence` | Ídem con el esqueleto de escritura |
| 4 | R4 rojo → verde | el route en disco y el décimo hijo de la guarda | Sí: `detail-stack.test.tsx` lee el disco y `layout.test.tsx` recorre la guarda; el rojo es "no existe" y "nueve hijos". El `title` usa `geofences.title`, que existe desde el paso 1. El verde deja el stub de la pantalla |
| 5 | R5 rojo → verde | la raíz, las ramas de pintado y las tarjetas | El test importa `GeofencesScreen`, que existe desde el verde de R4 (stub que devuelve `null`); el rojo es que no pinta nada ni consulta |
| 6 | R6 rojo → verde | el interruptor y la escritura | La pantalla y sus tarjetas existen (paso 5); el rojo es el interruptor ausente |
| 7 | R7 rojo → verde | el botón de borrar y la confirmación | Las tarjetas existen; el rojo es el botón ausente |
| 8 | R8 rojo → verde | la píldora de solo lectura | Las tarjetas existen; el rojo es la píldora ausente |
| 9 | R9 rojo → verde | la fila del Perfil | El Perfil existe y la ruta también (paso 4); el rojo es `geofences-link` ausente |
| 10 | R10 rojo (mutación) → verde | la tabla de copy de la pantalla y su cabecera | Todo el copy existe desde los pasos 4–8; rojo por la ruta (b) |

R1 va primero porque R4 declara `t('geofences.title')` y R5–R8 pintan las
claves `geofences.*`. R2 y R3 van antes que la pantalla porque R5 dobla
`../../api/geofences` y necesita sus tipos. R9 va después de R4 para que su
`push` apunte a una ruta que existe.

---

## Paso 0 — Enmienda A18

- [ ] Aplicar literal el bloque de [[requirements]] §Enmiendas en
      `../docs/conventions.md` y `../docs/ui-guidelines.md`, con
      `<fecha>` = fecha del commit que firma la casilla A18.
- [ ] `grep -c 'enmienda A18 de #41' ../docs/conventions.md ../docs/ui-guidelines.md`
      → `1` y `1`.
- [ ] `bunx jest --runTestsByPath 'src/__tests__/hero-header-amendments.test.ts' > /tmp/a18.log 2>&1; echo "exit=$?"`
      → `exit=0`, 1 suite.
- [ ] Commit: `docs(specs): apply amendment A18 of #41`.

## R1 — Once claves de copy

- [ ] **(1) Rojo.** En `src/providers/__tests__/language-provider.test.tsx`:
      - el `describe('#41 R1: el catálogo trae las once claves de zonas seguras')`
        con su único `it`, calcado del `describe('#100 R1: …')` del mismo
        fichero e insertado justo antes de él (triples `[clave, en, es] as const`
        con los valores literales de [[requirements]] R1, lectura de
        `../specs/mobile-ui-language/design.md` y la regex de [[design]] D6);
      - en el `it` de `#65 R12`, el `+ 11` y el comentario de [[design]] D8
        fila 1.

      `bunx jest --runTestsByPath 'src/providers/__tests__/language-provider.test.tsx' > /tmp/r1.log 2>&1; echo "exit=$?"`
      → `exit=1`, 1 suite. De los `it` nuevos falla **1**, por aserción:
      `'registra las once claves en los dos idiomas y en la tabla de la spec de idioma'`.
      De los heredados falla **1**, por aserción:
      `#65 R12` › `'mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas'`
      (309 ≠ 320).
      Commit: `test(geofences): eleven copy keys for safe zones (R1)`.
- [ ] **(2) Verde.** Las once claves en `src/i18n/catalog.ts`, en `en` y en
      `es`, justo después de `'alerts.openedAt'`; la sección
      `### §2.15 — Añadidos por #41 — Zonas seguras` en
      `../specs/mobile-ui-language/design.md`, justo antes de
      `## 3. La infraestructura` ([[requirements]] R1).
      `bunx jest --runTestsByPath 'src/providers/__tests__/language-provider.test.tsx'`
      + candados `> /tmp/r1g.log 2>&1; echo "exit=$?"` → `exit=0`, 5 suites.
      `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/tsc-r1.log 2>&1; echo "exit=$?"`
      → `exit=0` y 0 bytes.
      Commit: `feat(geofences): add the safe zones copy keys (R1)`.
- [ ] **(3) Refactor.** Ninguno.

## R2 — Cliente de la lista y su clave

- [ ] **(1) Rojo.**
      - Nuevo `src/api/__tests__/geofences.test.ts` con el
        `describe('#41 R2: listGeofences mapea la lista por kind')` (16 `it`,
        [[design]] D7).
      - En `src/api/__tests__/query-keys.test.ts`, el import de `geofenceKeys`
        y el `describe('#41 R2: la lista de zonas seguras tiene su propia clave por mascota')`
        con sus 2 `it`, justo después del `describe('#87 R7: …')`.
      - Esqueleto de R2 ([[design]] D2): `src/api/geofences.ts` nuevo y
        `geofenceKeys` justo después de `mediaKeys` en `src/api/query-keys.ts`.

      `bunx jest --runTestsByPath 'src/api/__tests__/geofences.test.ts' 'src/api/__tests__/query-keys.test.ts' > /tmp/r2.log 2>&1; echo "exit=$?"`
      → `exit=1`, 2 suites. De los `it` nuevos fallan **16**, todos por
      aserción: 14 de `#41 R2` en `geofences.test.ts` y los 2 de
      `query-keys.test.ts`. **Declarado**: los 2
      `'maps missing base URL %p without fetching'` salen verdes (el esqueleto
      ya devuelve `missing-config`). Ningún heredado cae.
      Commit: `test(geofences): list a pet's geofences by kind (R2)`.
- [ ] **(2) Verde.** `listGeofences` y `isGeofence` de [[requirements]] R2;
      `geofenceKeys.list(petId)` = `['geofences', 'list', petId] as const`.
      `bunx jest --runTestsByPath 'src/api/__tests__/geofences.test.ts' 'src/api/__tests__/query-keys.test.ts'`
      + candados `> /tmp/r2g.log 2>&1; echo "exit=$?"` → `exit=0`, 6 suites.
      `tsc` como en R1 → `exit=0`, 0 bytes.
      Commit: `feat(geofences): add the geofences list client and query key (R2)`.
- [ ] **(3) Refactor.** Ninguno.

## R3 — Cliente de escritura

- [ ] **(1) Rojo.**
      - En `src/api/__tests__/geofences.test.ts`, el
        `describe('#41 R3: setGeofenceActive y deleteGeofence mapean la escritura por kind')`
        (19 `it`, [[design]] D7).
      - Esqueleto de R3 en `src/api/geofences.ts` ([[design]] D2):
        `GeofenceWriteState` y las dos funciones devolviendo
        `{ kind: 'missing-config' }`.

      `bunx jest --runTestsByPath 'src/api/__tests__/geofences.test.ts' > /tmp/r3.log 2>&1; echo "exit=$?"`
      → `exit=1`, 1 suite. De los `it` nuevos fallan **17**, todos por
      aserción. **Declarado**: los 2 `'maps missing base URL %p without fetching'`
      de `#41 R3` salen verdes. Los 16 de `#41 R2` siguen verdes.
      Commit: `test(geofences): toggle and delete a geofence by kind (R3)`.
- [ ] **(2) Verde.** `patchJson` en `src/api/http.ts`, entre `postJson` y
      `deleteJson`; el helper privado `writeState(response, okStatus)` y las dos
      funciones de [[requirements]] R3.
      `bunx jest --runTestsByPath 'src/api/__tests__/geofences.test.ts'`
      + candados `> /tmp/r3g.log 2>&1; echo "exit=$?"` → `exit=0`, 5 suites.
      `tsc` → `exit=0`, 0 bytes.
      Commit: `feat(geofences): add the geofence toggle and delete clients (R3)`.
- [ ] **(3) Refactor.** Ninguno.

## R4 — Ruta y décimo hijo de la guarda

- [ ] **(1) Rojo.**
      - En `src/app/__tests__/detail-stack.test.tsx`, justo después del
        `describe('#100 R2: …')`, el
        `describe('#41 R4: las zonas seguras viven en src/app/pets/[petId]/geofences.tsx')`
        con su `it` ([[design]] D7).
      - En `src/app/__tests__/layout.test.tsx`, el
        `describe('#41 R4: la guarda de RootStack declara las zonas seguras tras el detalle de alerta')`
        con sus 2 `it` y el mismo `beforeEach` que el `describe('#100 R2: …')`.
      - Los dos candados heredados de [[design]] D8 filas 2 y 3.

      `bunx jest --runTestsByPath 'src/app/__tests__/detail-stack.test.tsx' 'src/app/__tests__/layout.test.tsx' > /tmp/r4.log 2>&1; echo "exit=$?"`
      → `exit=1`, 2 suites. De los `it` nuevos fallan **3**, por aserción:
      `'es un route delgado que importa la pantalla de src/screens/geofences'`,
      `'declara pets/[petId]/geofences como décimo hijo y no singular'` y
      `'le da la cabecera nativa de #95 R4 con el título de zonas seguras'`.
      De los heredados fallan **2**, por aserción:
      `#114 R1` › `'declara ocho rutas protegidas y alerts singular'` y
      `#100 R2` › `'declara alerts/[alertId] como noveno hijo y singular'`.
      Commit: `test(geofences): the safe zones route lives on the root stack (R4)`.
- [ ] **(2) Verde.**
      - `src/app/pets/[petId]/geofences.tsx`, literal de [[design]] D1.
      - `src/screens/geofences/index.tsx` con el stub
        `export function GeofencesScreen(_props: { petId: string }) { return null; }`.
      - En `src/app/_layout.tsx`, la línea de [[design]] D1 justo después de la
        que contiene `name="alerts/[alertId]"`.

      `bunx jest --runTestsByPath 'src/app/__tests__/detail-stack.test.tsx' 'src/app/__tests__/layout.test.tsx'`
      + candados + recorridos `> /tmp/r4g.log 2>&1; echo "exit=$?"` →
      `exit=0`, 14 suites. Si algún recorrido sale rojo, **parar** y
      reportarlo ([[requirements]] §Verificación).
      `tsc` → `exit=0`, 0 bytes.
      Commit: `feat(geofences): declare pets/[petId]/geofences on the root stack (R4)`.
- [ ] **(3) Refactor.** Ninguno.

## R5 — La pantalla pinta la lista y sus estados

- [ ] **(1) Rojo.** Nuevo `src/screens/geofences/index.test.tsx` con los dobles,
      el montaje, el `beforeEach` y los helpers de [[design]] D7, y el
      `describe('#41 R5: la pantalla pinta la lista de zonas y sus estados')`
      (11 `it`, filas de prueba de [[design]] D3).

      `bunx jest --runTestsByPath 'src/screens/geofences/index.test.tsx' > /tmp/r5.log 2>&1; echo "exit=$?"`
      → `exit=1`, 1 suite, fallan los **11** `it` nuevos:
      - **9 por consulta**: no encuentran `geofences-loading`,
        `geofence-geofence-1`, `geofences-empty`, `geofence-geofence-2`,
        `geofence-geofence-1-radius`, `geofences-no-tracking` ni
        `geofences-error` (los 3 del `it.each` de error);
      - **2 por aserción**:
        `'sigue en esqueleto mientras el rol de la mascota no ha llegado'`
        (la consulta `['geofences', 'list', 'pet-1']` no existe) y
        `'deja el 401 de la lista al manejador global y no pinta estado'`
        (`onUnauthorized` 0 ≠ 1).

      Commit: `test(geofences): the screen renders the zones and their states (R5)`.
- [ ] **(2) Verde.** La pantalla de [[requirements]] R5 con las decisiones de
      [[design]] D3: raíz, dos `useQuery`, las seis ramas y la primera columna
      de cada tarjeta. **Sin** interruptor, botón, píldora, estado ni escritura:
      eso llega en R6–R8.
      `bunx jest --runTestsByPath 'src/screens/geofences/index.test.tsx'`
      + candados `> /tmp/r5g.log 2>&1; echo "exit=$?"` → `exit=0`, 5 suites.
      `tsc` → `exit=0`, 0 bytes.
      Commit: `feat(geofences): render the safe zones list (R5)`.
- [ ] **(3) Refactor.** Ninguno.

## R6 — El dueño activa y desactiva

- [ ] **(1) Rojo.**
      - En `src/screens/geofences/index.test.tsx`, el
        `describe('#41 R6: el dueño activa y desactiva una zona')` (10 `it`).
      - En `src/__tests__/design-drift.test.ts`, la entrada
        `'screens/geofences/index.tsx': 1,` justo después de
        `'screens/alert-detail/index.tsx': 1,` ([[design]] D8 fila 4).

      `bunx jest --runTestsByPath 'src/screens/geofences/index.test.tsx' 'src/__tests__/design-drift.test.ts' > /tmp/r6.log 2>&1; echo "exit=$?"`
      → `exit=1`, 2 suites. De los `it` nuevos fallan los **10**, por
      consulta: no encuentran `geofence-geofence-1-active` (9) ni
      `geofence-geofence-2-active`
      (`'envía el valor contrario una vez y repinta con la lista recargada'`).
      De los heredados falla **1**, por aserción:
      `#87 R19: use-api no deja huella` › `'preserves every mutation sign-out with zero delta'`
      (0 ≠ 1). Los 11 de `#41 R5` siguen verdes.
      Commit: `test(geofences): the owner toggles a zone (R6)`.
- [ ] **(2) Verde.** `useState` de `busy` y `actionError`, `write()`, `isOwner`
      y el `Switch` de [[requirements]] R6 y [[design]] D4. En esta etapa la
      rama de quien no es dueño pinta `null` en ese hueco; la píldora es de R8.
      `bunx jest --runTestsByPath 'src/screens/geofences/index.test.tsx'`
      + candados `> /tmp/r6g.log 2>&1; echo "exit=$?"` → `exit=0`, 5 suites.
      `git grep -n "queryKey: \[" -- src/screens/geofences` y
      `git grep -n "useMutation\|useFocusEffect" -- src/screens/geofences`
      salen vacíos. `tsc` → `exit=0`, 0 bytes.
      Commit: `feat(geofences): let the owner toggle a zone (R6)`.
- [ ] **(3) Refactor.** Ninguno.

## R7 — El dueño borra tras confirmar

- [ ] **(1) Rojo.** En `src/screens/geofences/index.test.tsx`, el
      `describe('#41 R7: el dueño borra una zona tras confirmar')` (7 `it`),
      con `jest.spyOn(Alert, 'alert')` y `jest.restoreAllMocks()` en su
      `afterEach`.

      `bunx jest --runTestsByPath 'src/screens/geofences/index.test.tsx' > /tmp/r7.log 2>&1; echo "exit=$?"`
      → `exit=1`, 1 suite. De los `it` nuevos fallan los **7**, por consulta:
      no encuentran `geofence-geofence-1-delete` (6) ni
      `geofence-geofence-2-delete`
      (`'confirmar borra una vez y quita la tarjeta con la lista recargada'`).
      Los de `#41 R5` y `#41 R6` siguen verdes.
      Commit: `test(geofences): the owner deletes a zone after confirming (R7)`.
- [ ] **(2) Verde.** El `Button` y `confirmDelete` de [[requirements]] R7.
      `bunx jest --runTestsByPath 'src/screens/geofences/index.test.tsx'`
      + candados `> /tmp/r7g.log 2>&1; echo "exit=$?"` → `exit=0`, 5 suites.
      `tsc` → `exit=0`, 0 bytes.
      Commit: `feat(geofences): let the owner delete a zone (R7)`.
- [ ] **(3) Refactor.** Ninguno.

## R8 — Solo lectura para quien no es dueño

- [ ] **(1) Rojo.** En `src/screens/geofences/index.test.tsx`, el
      `describe('#41 R8: quien no es dueño ve las zonas sin controles')` (5 `it`).

      `bunx jest --runTestsByPath 'src/screens/geofences/index.test.tsx' > /tmp/r8.log 2>&1; echo "exit=$?"`
      → `exit=1`, 1 suite. De los `it` nuevos fallan los **5**, por consulta
      (`geofence-geofence-1-status` ausente). Los de R5–R7 siguen verdes.
      Commit: `test(geofences): non-owners see the zones read-only (R8)`.
- [ ] **(2) Verde.** La píldora de [[requirements]] R8 en la rama de quien no
      es dueño.
      `bunx jest --runTestsByPath 'src/screens/geofences/index.test.tsx'`
      + candados `> /tmp/r8g.log 2>&1; echo "exit=$?"` → `exit=0`, 5 suites.
      `tsc` → `exit=0`, 0 bytes.
      Commit: `feat(geofences): show read-only status pills to non-owners (R8)`.
- [ ] **(3) Refactor.** Ninguno.

## R9 — Fila del Perfil

- [ ] **(1) Rojo.**
      - En `src/screens/profile/index.test.tsx`, el
        `describe('#41 R9: Perfil enlaza a las zonas seguras de la mascota activa')`
        con su `beforeEach` propio y su `it` ([[design]] D7).
      - Los candados heredados de [[design]] D8 filas 5–10, en
        `src/__tests__/consistency-classnames.test.ts`,
        `src/__tests__/ui-copy-table.ts` (fila `geofences.title` de
        `R7_PROFILE`) y `src/__tests__/ui-language.test.ts`.

      `bunx jest --runTestsByPath 'src/screens/profile/index.test.tsx' 'src/__tests__/consistency-classnames.test.ts' 'src/__tests__/ui-language.test.ts' > /tmp/r9.log 2>&1; echo "exit=$?"`
      → `exit=1`, 3 suites. De los `it` nuevos falla **1**, por consulta
      (`geofences-link` ausente). De los heredados fallan **5**, por aserción:
      - `#62 R7` › `'profile usa cuatro ChevronRight de reicon'`;
      - `#62 R14` › `'screens/profile/index.tsx importa y aplica sus 4 esquinas'`;
      - `#98 R10` › `'deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban'`;
      - `#65 R7` › `'resuelve las 36 ocurrencias normativas'`;
      - `#65 R18` › `'resuelve cada ocurrencia de la tabla contra la clave exacta'`.

      **Declarado**: el `it` `'fusiona la esquina una vez y la entrega a las
      dos ramas de Card'` (D8 fila 7) sigue verde, porque su tabla y su
      literal se mueven juntos en este commit.
      Commit: `test(profile): profile links to the safe zones (R9)`.
- [ ] **(2) Verde.** El bloque literal de [[design]] D9 en
      `src/screens/profile/index.tsx`, justo después del `</Pressable>` que
      cierra `pairing-link`, sin imports nuevos.
      `bunx jest --runTestsByPath 'src/screens/profile/index.test.tsx'`
      + candados `> /tmp/r9g.log 2>&1; echo "exit=$?"` → `exit=0`, 5 suites.
      `tsc` → `exit=0`, 0 bytes.
      Commit: `feat(profile): link the active pet's safe zones (R9)`.
- [ ] **(3) Refactor.** Ninguno.

## R10 — Copy por clave (ruta b)

- [ ] **(1) Rojo con mutación.**
      - En `src/__tests__/ui-copy-table.ts`: el bloque exportado
        `R14_GEOFENCES` (18 filas, [[design]] D6), `...R14_GEOFENCES` al final
        de `ALL_USES` y `R14_GEOFENCES` al final del array `blocks` del
        `it('cuadra ALL_USES con la suma de los doce bloques')` del mismo
        fichero.
      - En `src/__tests__/ui-language.test.ts`: el
        `describe('#41 R10: las zonas seguras resuelven su copy por clave')`
        con su `it`, y el `+ 1` de `SCREEN_FILES` ([[design]] D8 fila 12).
      - **Mutación** en `src/screens/geofences/index.tsx`: declarar
        `const retryKey = 'common.retry' as const;` dentro del componente y
        cambiar `t('common.retry')` por `t(retryKey)`.

      `bunx jest --runTestsByPath 'src/__tests__/ui-language.test.ts' > /tmp/r10.log 2>&1; echo "exit=$?"`
      → `exit=1`, 1 suite. De los `it` nuevos falla **1**, por aserción:
      `'registra cada ocurrencia de la pantalla y de su cabecera'`. De los
      heredados falla **1**, por aserción (declarado en [[requirements]] R10):
      `#65 R18` › `'resuelve cada ocurrencia de la tabla contra la clave exacta'`.
      Los dos, por `common.retry` sin uso literal en la pantalla.
      Commit: `test(geofences): the screen resolves its copy by key (R10, plants mutation: retry key through a constant)`.
- [ ] **(2) Verde.** Revertir a mano las dos líneas de la mutación.
      `git diff HEAD~1 -- src/screens/geofences/index.tsx` sale vacío (la
      pantalla vuelve a ser la del verde de R9).
      `bunx jest --runTestsByPath 'src/__tests__/ui-language.test.ts' > /tmp/r10g.log 2>&1; echo "exit=$?"`
      → `exit=0`, 1 suite. `tsc` → `exit=0`, 0 bytes.
      Commit: `feat(geofences): resolve the retry label by literal key (R10)`.
- [ ] **(3) Refactor.** Ninguno.

## Cierre

- [ ] Suite completa **sin pipe**:
      `bunx jest --silent > /tmp/close41.txt 2>&1; echo "exit=$?"` →
      `exit=0`. Contra la base anotada: **+2 suites**, **+76 tests**, los
      mismos snapshots, y el reparto por fichero de [[design]] D7.
- [ ] `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/tsc41c.txt 2>&1; echo "exit=$?"`
      y `bunx expo lint > /tmp/lint41c.txt 2>&1; echo "exit=$?"` → `exit=0` y
      0 bytes.
- [ ] Comprobaciones de [[requirements]] §Verificación: C8, los dos `git grep`
      vacíos, y
      `git diff <HEAD del handoff> -- ../backend-pet-tracker ../infra package.json app.json`
      vacío.
- [ ] `git diff --name-only <HEAD del handoff>` lista **solo** los ficheros de
      [[design]] §Archivos afectados, más `../specs/mobile-geofences/traceability.md`
      y `../progress/impl_mobile-geofences.md`, y los cuatro del commit de la
      enmienda E2 del leader: `../specs/mobile-geofences/requirements.md`,
      `../specs/mobile-geofences/design.md`, este `tasks.md` y
      `../progress/handoff_mobile-geofences_r9.md`.
- [ ] [[traceability]]: hash rojo → verde por requisito y el commit de A18.
- [ ] `progress/impl_mobile-geofences.md`: HEAD del handoff, base medida,
      recuentos de cierre, la mutación de R10 plantada y revertida, y
      cualquier desviación de esta spec.
- [ ] Prueba de humo: la corre **el humano** en un dev build de Android
      ([[requirements]] §Prueba de humo). Codex no la marca.
