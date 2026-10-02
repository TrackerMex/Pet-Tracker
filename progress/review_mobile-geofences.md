# review: mobile-geofences (#41)
Fecha: 2026-10-02T05:50Z
Veredicto: APROBADO

- **HEAD revisado:** `d5830bab` (`docs(geofences): fill #41 traceability`),
  branch `feature/41-mobile-geofences`, árbol limpio.
- **HEAD del handoff (H0):** `04cf1c1c`.
- **Base de implementación (E1):** `origin/main` `4e8d6cc3`, sin #60.
- **Prueba de humo:** está pendiente y la hace el humano. Este veredicto cubre
  código, tests e historia; **no** la cubre ni la da por hecha.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `feature_list.json` → `[(41, 'mobile-geofences')]`.
- [x] `progress/current.md` describe la sesión activa de #41.
- [x] `progress/history.md` tiene entrada de las sesiones cerradas (la última es #145, 2026-10-01). La de #41 se escribe al cerrar.

## Checklist C3 — Arquitectura (adaptado a móvil)
- [x] La ruta es delgada: `src/app/pets/[petId]/geofences.tsx` (6 líneas) solo
      lee `petId` y monta `GeofencesScreen`.
- [x] Pantalla y cliente HTTP están separados:
      - `src/screens/geofences/index.tsx` consume `src/api/geofences.ts`.
      - Los estados del cliente son uniones discriminadas por `kind`.
      - La pantalla no hace `fetch` directo.
- [x] El cliente no tiene lógica de UI:
      - `listGeofences` valida con la guarda `isGeofence`.
      - Las escrituras mapean con `writeState(response, okStatus)`.
- [x] Las capas domain/application/infrastructure son del backend y no
      aplican: #41 no toca `backend-pet-tracker/` ni `infra/`. El
      `git diff 04cf1c1c HEAD -- backend-pet-tracker infra` sale vacío.

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra con el prefijo
      `#41 R<n>:`. R1–R10 tienen `describe` en sus ficheros de D7.
- [x] Recuentos de D7: `src/api/__tests__/geofences.test.ts` 35 y
      `src/screens/geofences/index.test.tsx` 33.
- [x] El historial es test-primero, con un par rojo → verde por requisito.
      Lo verifiqué ejecutando cada rojo en un worktree temporal desacoplado,
      ya eliminado. Ningún rojo falla por `ReferenceError` ni `TypeError`.
- [x] R10 es requisito de verificación por la ruta (b), declarada antes del
      handoff:
      - La mutación de producción se versionó en el rojo y se revirtió a mano
        en el verde.
      - No se mutó ningún doble.

### Rojos verificados (jest `--runTestsByPath`, rutas entre comillas simples)

| R | Rojo → verde | Resultado del rojo | Clase de fallo | ¿Coincide con tasks.md? |
|---|---|---|---|---|
| R1 | `f1e3cc4a` → `76cf79b2` | 2 failed | aserción | sí |
| R2 | `c803e7fb` → `3ec49124` | 16 failed; los de base ausente, en verde | aserción | sí |
| R3 | `0f71941a` → `251159ea` | 17 failed | aserción | sí |
| R4 | `c0fe936e` → `02c2158e` | 5 failed | aserción | sí |
| R5 | `b6c046d5` → `eb910bcd` | 11 failed | 9 por consulta + 2 por aserción | sí |
| R6 | `74ba7ceb` → `4562f99d` | 10 por consulta + `#87 R19` | consulta (`-active` ausente) | sí |
| R7 | `1c8b35ae` → `e93b3e18` | 7 failed (6 en `-1-delete`, 1 en `-2-delete`) | consulta | sí |
| R8 | `b6213b03` → `c5495082` | 5 failed (`geofence-geofence-1-status`) | consulta | sí |
| R9 | `1c272b06` → `e7e50117` (E2) → `0ca55015` | 6 failed / 112 passed / 118 en los dos primeros hashes | ver nota de R9 | sí |
| R10 | `4b10b82e` → `76913ff0` | 2 failed / 25 passed / 27 | aserción | sí |

**Nota de R9.**
- **Desglose del rojo, igual en los dos primeros hashes:**
  - El `it` nuevo falla **por consulta**:
    `Unable to find an element with testID: geofences-link`.
  - Los 5 heredados fallan por aserción, con estos recuentos:
    - `#62 R7`: 4 chevrones esperados, 3 recibidos;
    - `#62 R14`: 4 esquinas esperadas, 3 recibidas;
    - `#98 R10`: 32 esperado, 31 recibido;
    - `#65 R7` y `#65 R18`: una fila de tabla de diferencia.
  - `'fusiona la esquina una vez…'` sigue verde, como estaba declarado.
- **Origen del TypeError de E2:** en `1c272b06`, Codex había añadido
  `within(link).UNSAFE_getByType(ChevronRight)`, que la spec no pedía. Ese
  rojo no la alcanzaba, porque la consulta de `geofences-link` falla antes.
  El `TypeError` de RNTL 14 solo saldría en el verde.
- **Corrección:** `e7e50117` borra la consulta y su import (2 líneas), según
  E2. El rojo sigue intacto (6/112/118).
- **Verde:** `0ca55015` da 3 suites, 118 passed.

**Nota de R10.**
- **Mutación plantada en `4b10b82e`:**
  ```
  +  const retryKey = 'common.retry' as const;
  -            <Button.Label>{t('common.retry')}</Button.Label>
  +            <Button.Label>{t(retryKey)}</Button.Label>
  ```
- **Fallos del rojo, los dos por aserción sobre `common.retry`:**
  - `#41 R10` › `'registra cada ocurrencia de la pantalla y de su cabecera'`;
  - `#65 R18` › `'resuelve cada ocurrencia de la tabla contra la clave exacta'`.
- **Reversión:** el verde `76913ff0` la revierte a mano: 1 inserción y 2
  borrados en el diff. `git diff 4b10b82e~1 76913ff0 -- mobile-pet-tracker/src/screens/geofences/index.tsx`
  sale vacío.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene filas "pendiente". Cada R tiene sus hashes
      rojo → verde, y A18 tiene el suyo (`02646e90`).
- [x] Los commits siguen el formato `test(<scope>): … (Rn)` /
      `feat(<scope>): … (Rn)`. El de R10 rojo declara la mutación en el
      asunto.
- [x] `git diff --name-only 04cf1c1c HEAD` lista 28 ficheros y coincide
      exactamente con tasks.md §Cierre, con estos componentes:
      - los ficheros de design §Archivos afectados;
      - `traceability.md`;
      - `impl_mobile-geofences.md`;
      - los 4 del commit E2 del leader.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved`.
- [x] Las casillas "Aprobado por humano" y "Enmienda A18 aprobada por humano"
      están marcadas (2026-10-01), con firma vía Notion en `f044fa79`.
- [x] Las enmiendas posteriores a la firma tienen aprobación humana
      registrada en la cabecera de `requirements.md`:
      - E1 (`3a166fba`) y E2 (`147c90d7`), aprobadas en el chat de la sesión
        Backend.
      - E2 no cambia ningún requisito EARS. Solo quita del `it` de R9 una
        consulta que la spec no pedía.
      - Comprobé lo que E2 afirma: **M46 la caza `#62 R7`** (mutación m15,
        abajo).

## Checklist C7 — Sin código huérfano
- [x] N/A: #41 no reemplaza nada. Añade pantalla, ruta, cliente y fila de
      Perfil. No hay importadores de código retirado.

## Checklist C8 — UI móvil conforme a la carta
Revisado contra `docs/ui-guidelines.md`, con las skills `expo:expo-overview`,
`expo:expo-native-ui`, `expo:expo-router` y `expo:expo-ui` cargadas.
- [x] Grep-clean en los ficheros de la feature: cero hex fuera de
      `src/theme/`, cero clases `[...]`, cero `StyleSheet.create`, cero
      shadow/elevation legacy.
- [x] Dimensiones A11 bajo cabecera nativa:
      - `contentInsetAdjustmentBehavior="automatic"`;
      - `paddingBottom: insets.bottom + 24` vía `useSafeAreaInsets`;
      - lo fija el `it` `'respeta las métricas A11 bajo cabecera nativa'`.
- [x] La carga usa `Skeleton` dimensionado (`h-24 w-full rounded-card`), sin
      Spinner, y espera a la lista **y** al rol.
- [x] Reutiliza los componentes compartidos: `Card` del repo, y `Switch`,
      `Button` y `Skeleton` de heroui-native. No hay recetas duplicadas.
- [x] Tappables:
      - `Switch` con `hitSlop={10}`;
      - borrado con `min-h-11`;
      - "Reintentar" con `min-h-11`;
      - enlace del Perfil con `TOUCH_SLOP`, `CONTINUOUS_CORNER` y feedback
        de `Pressable`/`Button`.
- [x] Animaciones nuevas: ninguna.
- [x] Elementos repetidos (enmienda #70): todas las decisiones de cada fila
      se cruzan entre fila 1 y fila 2, con recuento por hijos
      (`childTestIds`) y orden fijado. Las mutaciones m1–m4 y m8–m11 lo
      demuestran.

A18: la línea aparece una vez en `docs/conventions.md` y una vez en
`docs/ui-guidelines.md`.

## Mutaciones sembradas (sobre `d5830bab`, de una en una)

Procedimiento:
- Cada mutación se aplicó con un reemplazo exacto, abortando si el literal no
  aparecía exactamente una vez.
- Jest se corrió desde `mobile-pet-tracker/` con
  `bunx jest --ci --verbose --runTestsByPath '<ruta>' … > log 2>&1; echo "exit=$?"`.
- Se restauró con `git checkout HEAD -- <fichero>`.
- Tras cada restauración se comprobó que `git status --short` salía vacío y
  `git diff --cached` en 0 líneas.

| # | Fichero | Mutación | Esperado | Obtenido | Clase |
|---|---|---|---|---|---|
| m1 (M31–M52) | `src/screens/geofences/index.tsx` | `.map((geofence, index)`; el radio de la fila 2 pasa a `text-foreground` con `index === 0 ? …` | `#41 R5` `'pinta cada nombre y radio…'` | exit=1, 1 failed/33. `Received: "text-sm font-normal text-foreground"` (línea 135) | aserción |
| m2 (M31–M52, zona ciega `hitSlop`) | ídem | `hitSlop={index === 0 ? 10 : 6}` | `#41 R6` `'pinta el interruptor…'` | exit=1, 1 failed. `Expected: 10, Received: 6` (l. 201) | aserción |
| m3 (M31–M52, píldora) | ídem | la píldora de la fila 2 pasa a `text-foreground` | `#41 R8` ×3 | exit=1, 3 failed (family/walker/vet) (l. 398) | aserción |
| m4 (nombre accesible) | ídem | `accessibilityLabel` con `geofences.data.geofences[0].name` | `#41 R6` `'pinta el interruptor…'` | exit=1, 1 failed. `Expected "Zona Parque activa", Received "Zona Casa activa"` | aserción |
| m5 (destino del PATCH) | ídem | `setGeofenceActive(…, geofences.data.geofences[0].id, active)` | `#41 R6` `'envía el valor contrario…'` | exit=1, 1 failed. Recibido `geofence-1` en vez de `geofence-2` (l. 216) | aserción |
| m6 (M56, valor del PATCH) | ídem | `active` → `geofence.active` | `'envía…'` y `'bloquea…'` | exit=1, 2 failed. Recibido `false` en vez de `true` | aserción |
| m7 (destino del DELETE) | ídem | `deleteGeofence(…, geofences.data.geofences[0].id)` | `#41 R7` `'confirmar borra…'` | exit=1, 1 failed. Recibido `geofence-1` (l. 357) | aserción |
| m8 (M53) | ídem | `Switch isDisabled={busy && index === 0}` | `'bloquea los dos interruptores…'` | exit=1, 1 failed (l. 229, `accessibilityState`) | aserción |
| m9 (M54) | ídem | borrado `isDisabled={busy && index === 0}` | `'deshabilita los dos borrados…'` | exit=1, 1 failed. `Expected: true, Received: false` (l. 322) | aserción |
| m10 (M55) | ídem | la fila 1 escribe con `'geofence-x'` | `'bloquea los dos interruptores…'` | exit=1, 1 failed. Recibido `geofence-x` (l. 233) | aserción |
| m11 (zona ciega: orden en la columna) | ídem | intercambiar los `Text` nombre ↔ radio | `#41 R5` `'pinta cada nombre y radio…'` | exit=1, 1 failed (`childTestIds(column)`, l. 128) | aserción |
| m12 (zona ciega: posición del error) | ídem | `actionError` movido antes de la lista | 4 `it.each` de error de R6 | exit=1, 4 failed (`parent.children.at(-1)`, l. 264) | aserción |
| m13 (zona ciega: texto sin rastreo) | ídem | `<Text>` de `needsCollar` → `className="text-danger"` | sin candado (R5.4 no fija clase) | **exit=0, 33/33 verde. Sobrevive.** Ver hallazgo H1 | — |
| m14 (M47) | `src/screens/profile/index.tsx` | la etiqueta de `geofences-link` pasa a `font-normal` | `#41 R9` | exit=1, 1 failed/119. `Received: "font-normal text-foreground"` | aserción |
| m15 (M46, afirmación de E2) | ídem | el chevrón de `geofences-link` pasa a `size={28}` | `#62 R7` | exit=1, 1 failed. `Expected length: 4, Received length: 3` (l. 194) | aserción |
| m16 (URL del PATCH) | `src/api/geofences.ts` | ruta sin `/${geofenceId}` | `#41 R3` `'patches only the active flag %p'` | exit=1, 2 failed/35 (l. 77) | aserción |
| m17 (URL del DELETE) | ídem | `petId` ↔ `geofenceId` en la ruta | `#41 R3` `'deletes without a body and maps 204 to ok'` | exit=1, 1 failed/35 (l. 88) | aserción |

- **Clase de fallo:** todas las muertas lo hicieron **por aserción**
  (`query-errors=0` en todos los logs). Ninguna oculta el nodo.
- **Candados tautológicos:** ninguno.
  - Las aserciones comparan contra literales de la spec (clases, copy en
    es/en, ids de fixture), no contra símbolos importados de producción.
  - `#62 R7` cuenta literales del fuente, y m15 demuestra que vigila.
- **Archivos de log:** en el scratchpad de la sesión (`mut-<tag>.log`).

## Observaciones (no bloqueantes)

- **H1 — media, de spec. Texto del estado "sin rastreo" sin color ni receta
  tipográfica.**
  - **Dónde:** `src/screens/geofences/index.tsx:128` renderiza
    `<Text>{t('geofences.needsCollar')}</Text>` sin `className`. Es el único
    `<Text>` desnudo de `src/` fuera de tests.
  - **Por qué pasa la suite:** R5.4 de `requirements.md` no fija clase para
    ese texto, y el `it` `'pinta el 402 sin Reintentar'` solo bloquea el
    contenido y la clase de la `Card`. Por eso m13 sobrevive.
  - **Qué choca con la carta:** `docs/ui-guidelines.md` pide que cada par
    texto/superficie se verifique AA en claro y oscuro, y que cada texto
    fije color y receta (decisión 7).
  - **Riesgo:** el texto sin color toma el valor por defecto de la
    plataforma sobre `bg-surface`. No lo verifiqué en dispositivo, y en tema
    oscuro podría no cumplir AA.
  - **Atribución:** el implementador cumplió la spec al pie de la letra; el
    hueco está en la spec aprobada. No bloquea este veredicto.
  - **Qué falta:** registrarlo como deuda o enmienda, y mirarlo en la prueba
    de humo con tema oscuro y una mascota sin collar.
- **H2 — baja, resuelta. Consulta fuera de spec en el rojo de R9.**
  - Codex añadió `UNSAFE_getByType(ChevronRight)`, que la spec no pedía y
    que RNTL 14 ya no expone.
  - Se resolvió con E2: un commit de test propio, `e7e50117`, entre rojo y
    verde.
  - La cobertura de M46 se mantiene vía `#62 R7`, comprobado con m15.
- **H3 — informativa. Fechas de A18.**
  - La línea A18 en `docs/` dice 2026-10-02, que es la fecha UTC del commit
    de firma `f044fa79` (03:26 UTC).
  - Las casillas de `requirements.md` dicen 2026-10-01, en hora local.
  - Es coherente con la regla "fecha del commit". Lo anoto solo para que no
    se lea como una discrepancia.

## Output de ./init.sh

Lo ejecutó el leader sobre `d5830bab`, sin pipe, con exit=0. Este reviewer no
lo relanzó, por instrucción del leader: podía haber otro init.sh de otra
sesión sobre el LocalStack y el Postgres compartidos. Estos son extractos del
log (`scratchpad/init41.log`, 21395 líneas):

```
218:   Test Suites: 171 passed, 171 total
219:   Tests:       1307 passed, 1307 total          (backend unit)
231:   Test Suites: 2 passed, 2 total
232:   Tests:       14 passed, 14 total              (infra)
21067: Test Suites: 88 passed, 88 total
21068: Tests:       1710 passed, 1710 total          (mobile)
21069: Snapshots:   1 passed, 1 total
21365: Test Suites: 3 skipped, 27 passed, 27 of 30 total
21366: Tests:       8 skipped, 399 passed, 407 total (e2e)
21381: $ expo lint
21385: $ tsc --noEmit
       ✅ Typecheck sin errores
       ✅ Todo verde. Listo para trabajar.
```

Delta móvil contra la base 86/1634: **+2 suites, +76 tests**, el mismo
snapshot. Coincide con tasks.md §Cierre.
