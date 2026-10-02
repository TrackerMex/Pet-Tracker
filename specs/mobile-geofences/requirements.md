---
feature: "mobile-geofences"
status: approved    # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-geofences]] (#41)

> Notación EARS. Cada requisito tiene un id único R<n>, que no cambia una vez
> aprobado. Ver:
>
> - [[design]] para:
>   - las decisiones técnicas (D1–D9);
>   - las sondas y mutaciones que las sostienen (§1);
>   - la errata del enunciado (§0);
>   - el inventario de aserciones heredadas que cambian (D8).
> - [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI móvil (gate C8).
>
> **Commit base de toda medición: `03f57706`.** Es el HEAD de
> `feature/60-mobile-ios-support`, que **aún no está en `main`**
> (`origin/main` = `4e8d6cc3`, merge de #145). El humano decidió el
> 2026-10-01 escribir esta spec contra la branch de #60, porque #60 también
> toca `src/screens/profile/index.tsx` y su test (§Coordinación).
>
> **Enmienda E1 (2026-10-02, aprobada por el humano en el chat de la sesión
> Backend):** el handoff a Codex **ya no espera a #60**. Codex implementa
> sobre `origin/main` `4e8d6cc3`, sin #60. El leader verificó en ese árbol
> las nueve anclas de [[tasks]] §Antes de empezar y los literales de las
> filas 5–10 de [[design]] D8 (§Coordinación).
>
> **Enmienda E2 (2026-10-02, aprobada por el humano en el chat de la sesión
> Backend):** el `it` de R9 **no** comprueba el `size` del chevrón.
>
> - Codex le había añadido
>   `within(link).UNSAFE_getByType(ChevronRight)`, que no estaba en la spec.
> - RNTL 14.0.1 quitó las consultas `UNSAFE_*` (`docs/guides/migration-v14.md`
>   del paquete), así que el verde de R9 daba `TypeError`.
> - La consulta y su import se borran y no se sustituyen. La mutación M46 la
>   caza solo `#62 R7`, que cuenta cuatro veces el literal exacto
>   `<ChevronRight size={20} color={muted} />` ([[design]] §1).
> - Se arregla en un commit de test propio entre el rojo y el verde de R9
>   (`progress/handoff_mobile-geofences_r9.md`). El commit de esta enmienda
>   añade al `git diff --name-only` de [[tasks]] §Cierre cuatro ficheros del
>   leader: este, [[design]], [[tasks]] y ese handoff.
>
> **Enmienda E3 (2026-10-02, aprobada por el humano en el chat de la sesión
> Backend):** el texto de "sin rastreo" (R5 rama 4) lleva la clase
> `text-center font-normal text-muted`, la misma receta que el estado vacío.
>
> - El reviewer la encontró como hueco de spec (H1 de
>   `progress/review_mobile-geofences.md`): R5 no fijaba la clase, Codex dejó
>   un `<Text>` sin `className` y su mutación m13 (`text-danger`) sobrevivió
>   con la suite en verde.
> - El `it` `'pinta el 402 sin Reintentar'` de `#41 R5` añade una aserción
>   sobre la clase del texto; el número de `it` no cambia ([[design]] D7, M58).
> - Por ser un cambio trivial lo implementa el subagente `implementer` (la
>   excepción de `CLAUDE.md`), en dos commits rojo→verde y uno de
>   trazabilidad ([[tasks]] §Enmienda E3).
>
> **Medición de la base**:
>
> - La tomó el spec_author el 2026-10-01, sobre una copia
>   `git archive 03f57706`, desde `mobile-pet-tracker/` y sin pipe
>   (`bunx jest --silent > f 2>&1; echo exit=$?`).
> - Resultado: **86 suites, 1640 tests, 1 snapshot, `exit=0`**.
> - `bunx tsc --noEmit` y `bunx expo lint` dan `exit=0` con **salida de 0
>   bytes**.
> - `.expo/types/router.d.ts` **no existe**.
>
> **Corroboración en el árbol que verá Codex.** Es un merge simulado de
> `origin/main` `4e8d6cc3` con `03f57706`, sin conflictos en
> `mobile-pet-tracker/`:
>
> - base: 86 suites / 1655 tests / 1 snapshot;
> - con #41 aplicada: 88 / 1731 / 1;
> - mismo delta que sobre `03f57706`: **+2 suites, +76 tests**.
>
> Ningún requisito congela recuentos absolutos: se declara el **delta**
> contra la base (§Verificación). Si la base se mueve, manda el delta.
>
> **Todo `describe` nuevo lleva el prefijo `#41 R<n>:`**
> (`docs/conventions.md` §Prefijo de feature). La cita es siempre
> `#41 R<n>`, nunca `#41` suelto: es el contrato con
> `src/__tests__/design-drift.test.ts` (#108).
>
> **Rutas y anclas.** Las rutas de fichero son relativas a
> `mobile-pet-tracker/`, salvo las que empiezan por `docs/` o `specs/`, que
> son relativas a la raíz del repo. Toda ancla es **por contenido** (un
> literal que se puede buscar con `grep -F`), nunca por número de línea.

## Contexto en una línea

El backend expone las geocercas de una mascota desde #11 y #145 las dejó
coherentes con sus alertas, pero la app no tiene ninguna pantalla para
verlas. Esta feature crea la **lista** de zonas seguras de la mascota activa,
con la ruta delgada `pets/[petId]/geofences` en el `Stack.Protected` raíz:

- el dueño activa y desactiva cada zona (`PATCH {active}`);
- el dueño borra una zona tras confirmarlo (`DELETE`, que responde 204);
- los demás roles ven la lista sin controles;
- se entra desde una fila nueva del Perfil.

El editor sobre el mapa (crear y editar) es #146.

## Qué firma además el humano al aprobar esta spec

Las decisiones de producto de esta spec van numeradas **P-n**; en
[[design]], D-n son las decisiones técnicas. Cada P-n lleva la recomendación
del spec_author.

Firmar la spec (§Aprobación) es firmar las dieciséis tal como están
escritas. Si el humano quiere otra opción en alguna, la spec se reescribe
antes de aprobarla.

1. **P1 — El copy dice "Zonas seguras" / "Safe zones", no "Geocercas".**
   - El enunciado, el explore y el Make (§1.5, fila "Geocercas
     configuradas") dicen "Geocercas".
   - El catálogo ya llama "zona" a la geocerca en la alerta de salida:
     `alerts.typeGeofenceExit` es "Salió de la zona" / "Left the safe zone".
   - "Zonas seguras" casa con ese copy y con el tipo `safe_circle`.

   Cambiar a "Geocercas" solo cambia los valores de las claves de R1, no su
   número. *Recomendación: "Zonas seguras".*
2. **P2 — El interruptor no es optimista.**
   - Al tocarlo se envía `PATCH {active}`. Mientras está en vuelo, **todos**
     los interruptores y botones de borrar de la pantalla quedan
     deshabilitados.
   - El estado que se pinta es el que devuelve la lista recargada.
   - Si falla, el interruptor se queda como estaba y aparece el error bajo la
     lista.
   - No pide confirmación. Por #145 R3, cambiar `active` cierra las alertas
     abiertas de la zona y reinicia su estado de evaluación, y es reversible
     tocándolo otra vez.

   *Recomendación: sí.*
3. **P3 — Las zonas inactivas se listan**, con el interruptor apagado (o la
   píldora "Inactiva"), en el orden del backend (`createdAt` ascendente). No
   hay filtro. *Recomendación: sí.*
4. **P4 — Copy del borrado.**
   - Título: "¿Eliminar {nombre}?" / "Delete {name}?".
   - Cuerpo: "Dejarás de recibir alertas de esta zona. Esta acción no se puede
     deshacer." / "You'll stop getting alerts for this zone. This can't be
     undone.".
   - Botones: "Cancelar" (estilo `cancel`) y "Eliminar" (estilo
     `destructive`).

   El cuerpo es cierto tras #145: el `DELETE` responde 204 y cierra las
   alertas no cerradas de la zona (#145 R1 y R2). *Recomendación: tal cual.*
5. **P5 — Quien no es dueño (`family`, `walker`, `vet`) ve la misma lista.**
   - Cada fila lleva una píldora "Activa" / "Inactiva" y no tiene interruptor
     ni botón de borrar.
   - Si el rol no se puede leer (`getPet` no da `ok`), la pantalla también
     queda en solo lectura.

   Es un espejo del backend: `POST`, `PATCH` y `DELETE` llevan
   `@RequirePetRole('owner')` y el `GET` no. *Recomendación: sí.*
6. **P6 — Los fallos de escritura muestran el error genérico.**
   - Cualquier respuesta que no sea 2xx, 401, 402 o 404 (incluidos 403 y 400)
     muestra "Algo salió mal".
   - Un fallo de red muestra "No se pudo conectar con el servidor".
   - Un 404 (zona ya borrada) o un 402 (suscripción caducada) recargan la
     lista sin mensaje, y la lista recargada pinta lo que haya.
   - Un 401 cierra sesión.

   *Recomendación: sí.*
7. **P7 — La pantalla no muestra el nombre de la mascota.** El título de la
   cabecera es "Zonas seguras" y la mascota es la activa del Perfil, que el
   usuario acaba de ver. *Recomendación: sí.*
8. **P8 — La fila "Zonas seguras" del Perfil se pinta para todos los roles**,
   como las de documentos y emparejamiento. Para quien no es dueño, la
   pantalla es de solo lectura (P5). *Recomendación: sí.*
9. **P9 — Clave nueva `geofences.needsCollar`** ("Las zonas seguras requieren
   un collar") para el 402 de la lista.
   - El 402 llega porque el backend aplica `PetTrackingGuard` también a los
     `GET`.
   - Se descarta reutilizar `map.trackingNeedsCollar` ("El rastreo en vivo
     requiere un collar"), porque habla de otra cosa.

   *Recomendación: sí.*
10. **P10 — El esqueleto espera a la lista y al rol.**
    - La pantalla pinta el esqueleto hasta que han llegado las dos consultas:
      la lista y `getPet`, que da `myRole`.
    - Así no aparece un instante la versión de solo lectura y luego cambia a
      la del dueño.
    - `getPet` comparte la clave `petKeys.detail(petId)` con el Perfil, así
      que al entrar desde el Perfil suele estar ya en caché.

    *Recomendación: sí.*
11. **P11 — La confirmación de borrado es `Alert.alert` nativo**, como la
    desvinculación del collar en `src/screens/pairing/`, y no un sheet como
    en recordatorios. *Recomendación: sí.*
12. **P12 — El botón "Eliminar" de cada fila mide 44 pt de alto mínimo**
    (`min-h-11`), aunque es `size="sm"`. *Recomendación: sí.*
13. **P13 — Las claves del borrado son del dominio**: `geofences.delete` y
    `geofences.cancel`. Existen `reminders.*` y `pairing.cancel`, pero el
    catálogo no comparte claves entre pantallas. *Recomendación: sí.*
14. **P14 — Enmienda A18**: la lista de la excepción A11 de métricas en
    `docs/conventions.md` y `docs/ui-guidelines.md` gana
    `pets/[petId]/geofences`. Tiene su propia casilla. *Recomendación:
    aprobarla; sin ella, R5 contradice la carta.*
15. **P15 — El nombre accesible del botón de borrar es "Eliminar"**, sin el
    nombre de la zona, porque el título de la confirmación sí lo nombra. El
    interruptor sí lleva el nombre ("Zona Casa activa"). *Recomendación:
    dejarlo así.*
16. **P16 — La prueba de humo con una cuenta que no es dueña necesita un
    `insert` manual en `pet_users`.**
    - No existe API ni script para invitar a miembros. Es una fila de datos,
      no un cambio de esquema.
    - El paso lo dice tal cual y la borra al final (§Prueba de humo).
    - Si el humano no quiere tocar la base a mano, ese paso se salta y R8
      queda cubierto solo por los tests.

    *Recomendación: hacerlo.*

## Requisitos funcionales

### R1 — Once claves de copy nuevas

- **R1**: THE SYSTEM SHALL añadir a `src/i18n/catalog.ts`, en los dos
  idiomas y justo después de la entrada `'alerts.openedAt'` de cada uno,
  **exactamente** estas once claves:

  | Clave | `en` | `es` |
  |---|---|---|
  | `geofences.title` | `Safe zones` | `Zonas seguras` |
  | `geofences.empty` | `No safe zones yet` | `Aún no hay zonas seguras` |
  | `geofences.needsCollar` | `Safe zones require a collar` | `Las zonas seguras requieren un collar` |
  | `geofences.radius` | `{{meters}} m radius` | `Radio de {{meters}} m` |
  | `geofences.activeLabel` | `{{name}} zone active` | `Zona {{name}} activa` |
  | `geofences.statusActive` | `Active` | `Activa` |
  | `geofences.statusInactive` | `Inactive` | `Inactiva` |
  | `geofences.delete` | `Delete` | `Eliminar` |
  | `geofences.cancel` | `Cancel` | `Cancelar` |
  | `geofences.deleteTitle` | `Delete {{name}}?` | `¿Eliminar {{name}}?` |
  | `geofences.deleteBody` | `You'll stop getting alerts for this zone. This can't be undone.` | `Dejarás de recibir alertas de esta zona. Esta acción no se puede deshacer.` |

  THE SYSTEM SHALL además registrarlas en `specs/mobile-ui-language/design.md`:

  - en una sección nueva
    `### §2.15 — Añadidos por #41 — Zonas seguras`, insertada justo antes de
    la línea `## 3. La infraestructura`;
  - con una fila por clave de la forma
    `` | — | `<clave>` | `<en>` | `<es>` | ← añadida por #41 (R1) ``;
  - las filas de `geofences.radius`, `geofences.activeLabel` y
    `geofences.deleteTitle` añaden ` **(param)**` tras la clave.

  El candado de longitud del catálogo SHALL crecer en `+ 11`, **visible**
  como último sumando.

  *Tests*:

  - Nuevo: `src/providers/__tests__/language-provider.test.tsx`,
    `describe('#41 R1: el catálogo trae las once claves de zonas seguras')`,
    `it('registra las once claves en los dos idiomas y en la tabla de la spec de idioma')`.
    Va calcado del `describe('#100 R1: …')` del mismo fichero y se inserta
    justo antes de él.
  - Candado heredado: en el
    `it('mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas')`
    del `describe('#65 R12: …')`:
    - la expresión que termina en `- 6 + 1 + 2 + 3,` pasa a terminar en
      `- 6 + 1 + 2 + 3 + 11,`;
    - el comentario que empieza por `// 259 en` se amplía con
      `+ 11 de #41 R1 (geofences.*)`.

  Rojo real en `03f57706`: las claves no existen y el catálogo tiene 309.

### R2 — Cliente de la lista y su clave de caché

- **R2**: THE SYSTEM SHALL exportar desde `src/api/geofences.ts` (nuevo):

  - **La interfaz `Geofence`** con exactamente estos campos: `id: string`,
    `petId: string`, `name: string`, `type: 'safe_circle'`,
    `centerLat: number`, `centerLng: number`, `radiusM: number`,
    `active: boolean`,
    `state: { value: 'unknown' | 'inside' | 'outside'; updatedAt: string | null }`,
    `createdAt: string` y `updatedAt: string`.
  - **La unión `GeofenceListState`**: `{ kind: 'ok'; geofences: Geofence[] }`
    | `{ kind: 'no-tracking' }` | `{ kind: 'unauthorized' }`
    | `{ kind: 'error' }` | `{ kind: 'unreachable'; message: string }`
    | `{ kind: 'missing-config' }`.
  - **La función**
    `listGeofences(baseUrl: string | undefined, token: string, petId: string, fetchFn: typeof fetch = fetch): Promise<GeofenceListState>`.
    Hace `GET <baseUrl>/pets/<petId>/geofences` con `getJson` de
    `src/api/http.ts` y mapea así:
    - sin `baseUrl` (`undefined` o `''`) → `missing-config`, **sin llamar a
      `fetch`**;
    - fallo de red → `unreachable` con su mensaje;
    - 402 → `no-tracking`;
    - 401 → `unauthorized`;
    - cualquier otro estado distinto de 200 → `error`;
    - 200 con cuerpo JSON → `ok` con los elementos **en el orden del
      backend**, pero **solo** si el cuerpo es un array y cada elemento es un
      objeto con `id` y `name` de tipo string, `radiusM` de tipo number y
      `active` de tipo boolean;
    - cualquier otro cuerpo, incluido un JSON inválido → `error`.

  THE SYSTEM SHALL además exportar `geofenceKeys` desde
  `src/api/query-keys.ts`, justo después de `mediaKeys`, con
  `list: (petId: string) => ['geofences', 'list', petId] as const`.

  *Tests*:

  - `src/api/__tests__/geofences.test.ts` (nuevo),
    `describe('#41 R2: listGeofences mapea la lista por kind')`, 16 `it`
    ([[design]] D7).
  - `src/api/__tests__/query-keys.test.ts`,
    `describe('#41 R2: la lista de zonas seguras tiene su propia clave por mascota')`,
    con `it('devuelve la clave exacta del dominio geofences')` y
    `it('no colisiona entre mascotas')`.

  **Declarado**: los 2 `it` de `'maps missing base URL %p without fetching'`
  pasan ya en el commit rojo, porque el esqueleto de tipos devuelve
  `missing-config`. Su rojo lo da la mutación M1 de [[design]] §1, que quita
  la guarda de `baseUrl`.

### R3 — Cliente de escritura: activar o desactivar y borrar

- **R3**: THE SYSTEM SHALL añadir a `src/api/http.ts`, entre `postJson` y
  `deleteJson`, la función
  `patchJson(baseUrl: string, path: string, token: string, body: unknown, fetchFn: typeof fetch): Promise<GetResult>`.
  Hace `PATCH` con `Authorization: Bearer <token>`,
  `'Content-Type': 'application/json'` y `body: JSON.stringify(body)`, y
  mapea un rechazo de `fetch` a `unreachable`, igual que `postJson`.

  THE SYSTEM SHALL exportar desde `src/api/geofences.ts`:

  - **La unión `GeofenceWriteState`**: `{ kind: 'ok' }`
    | `{ kind: 'not-found' }` | `{ kind: 'no-tracking' }`
    | `{ kind: 'unauthorized' }` | `{ kind: 'error' }`
    | `{ kind: 'unreachable'; message: string }` | `{ kind: 'missing-config' }`.
  - **`setGeofenceActive(baseUrl, token, petId, geofenceId, active: boolean, fetchFn = fetch): Promise<GeofenceWriteState>`**.
    Hace `PATCH <baseUrl>/pets/<petId>/geofences/<geofenceId>` con cuerpo
    **solo** `{ active }`. Su respuesta correcta es **200**.
  - **`deleteGeofence(baseUrl, token, petId, geofenceId, fetchFn = fetch): Promise<GeofenceWriteState>`**.
    Hace `DELETE` a la misma ruta, sin cuerpo y sin `Content-Type`. Su
    respuesta correcta es **204**.

  Las dos mapean igual el resto de casos:

  - la respuesta correcta propia → `ok`;
  - 404 → `not-found`;
  - 402 → `no-tracking`;
  - 401 → `unauthorized`;
  - cualquier otro estado, **incluida la respuesta correcta de la otra
    función**, → `error`;
  - fallo de red → `unreachable`;
  - sin `baseUrl` → `missing-config`, sin llamar a `fetch`.

  *Test*: `src/api/__tests__/geofences.test.ts`,
  `describe('#41 R3: setGeofenceActive y deleteGeofence mapean la escritura por kind')`,
  19 `it` ([[design]] D7).

  **Declarado**: los 2 `it` de `'maps missing base URL %p without fetching'`
  pasan ya en el rojo (el esqueleto devuelve `missing-config`); su rojo lo da
  M2.

### R4 — Ruta `pets/[petId]/geofences` en el Stack raíz, con cabecera nativa

- **R4**: THE SYSTEM SHALL tener el route delgado
  `src/app/pets/[petId]/geofences.tsx`, sin más lógica que esta:

  - lee `petId` con `useLocalSearchParams<{ petId: string }>()`;
  - devuelve `<GeofencesScreen petId={petId} />`, importado de
    `'../../../screens/geofences'`.

  THE SYSTEM SHALL además declarar en el
  `Stack.Protected guard={status === 'authenticated'}` de `RootStack`
  (`src/app/_layout.tsx`) **diez** `Stack.Screen`:

  - los nueve de #100, en su orden y sin cambios;
  - por último, `name="pets/[petId]/geofences"`, **sin**
    `dangerouslySingular` y con
    `options={{ ...headerOptions, title: t('geofences.title') }}`.

  *Tests*:

  - `src/app/__tests__/detail-stack.test.tsx`,
    `describe('#41 R4: las zonas seguras viven en src/app/pets/[petId]/geofences.tsx')`,
    `it('es un route delgado que importa la pantalla de src/screens/geofences')`.
  - `src/app/__tests__/layout.test.tsx`,
    `describe('#41 R4: la guarda de RootStack declara las zonas seguras tras el detalle de alerta')`,
    con `it('declara pets/[petId]/geofences como décimo hijo y no singular')`
    y `it('le da la cabecera nativa de #95 R4 con el título de zonas seguras')`.
  - Dos candados heredados de recuento ([[design]] D8 filas 2 y 3).

  Rojo real en `03f57706`: el fichero no existe y la guarda tiene nueve
  hijos.

### R5 — La pantalla pinta la lista de zonas y sus estados

- **R5**: THE SYSTEM SHALL exportar `GeofencesScreen({ petId }: { petId: string })`
  desde `src/screens/geofences/index.tsx`.

  **Raíz.** Un `ScrollView` con `testID="screen-geofences"`,
  `className="flex-1 bg-background"` y las métricas A11 (enmienda A18):
  `contentInsetAdjustmentBehavior="automatic"` y
  `contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}`.

  **Consultas.** La pantalla lanza dos `useQuery`:

  - `petKeys.detail(petId)` con `getPet`;
  - `geofenceKeys.list(petId)` con `listGeofences`.

  Las dos con `process.env.EXPO_PUBLIC_API_URL` y el `token` de `useAuth()`.

  **Pintado.** La pantalla SHALL pintar **una sola** de estas ramas, en este
  orden de precedencia:

  1. **Esqueleto.** Mientras la lista **o** el rol no han llegado:
     `Skeleton` `geofences-loading` con `h-24 w-full rounded-card`, y nada
     más (P10).
  2. **Vacío.** Lista `ok` y vacía: `Card` `geofences-empty` con
     `items-center py-8`, con el texto `geofences.empty` (clase
     `text-center font-normal text-muted`).
  3. **Lista.** Lista `ok` con zonas: una `Card` por zona, en el orden del
     backend. Cada una tiene `testID="geofence-<id>"`,
     `className="flex-row items-center gap-3"` y no tiene rol. Su **primer
     hijo** es una `View` `min-w-0 flex-1 gap-1` con dos `Text`, en este
     orden:
     - `geofence-<id>-name`: `selectable`, `font-bold text-foreground`, con el
       nombre;
     - `geofence-<id>-radius`: `text-sm font-normal text-muted`, con
       `geofences.radius` y `meters` = `Math.round(radiusM)`.

     El resto de hijos lo fijan R6–R8.
  4. **Sin rastreo.** `no-tracking`: `Card` `geofences-no-tracking` con
     `items-center py-8` y un `Text` con `geofences.needsCollar` y la clase
     `text-center font-normal text-muted` (enmienda E3). Sin "Reintentar".
  5. **Sesión caducada.** `unauthorized`: nada. El cierre de sesión lo hace
     el `onUnauthorized` global del `QueryCache`; la pantalla no llama a
     `signOut`.
  6. **Error.** `error`, `missing-config` o `unreachable`:
     - un `Text` `geofences-error`, `selectable` y `text-danger`, con
       `common.cannotReachServer` si es `unreachable` y
       `common.somethingWentWrong` en los demás casos;
     - un `Button` `geofences-retry` con `min-h-11` y la etiqueta
       `common.retry`, que **vuelve a pedir solo la lista**.

  *Test*: `src/screens/geofences/index.test.tsx` (nuevo),
  `describe('#41 R5: la pantalla pinta la lista de zonas y sus estados')`,
  11 `it` ([[design]] D7).

### R6 — El dueño activa y desactiva una zona

- **R6**: WHILE el rol de la mascota es `owner`, THE SYSTEM SHALL pintar
  como **segundo hijo** de cada tarjeta un `Switch` de heroui-native
  `geofence-<id>-active` con:

  - `isSelected={active}`, `hitSlop={10}` e `isDisabled={busy}`;
  - `accessibilityLabel` = `geofences.activeLabel` con `name`.

  WHEN el dueño lo toca, THE SYSTEM SHALL:

  1. llamar **una vez** a
     `setGeofenceActive(baseUrl, token, petId, <id>, <valor contrario>)`;
  2. marcar `busy` mientras la llamada está en vuelo: **todos** los
     interruptores y botones de borrar de la pantalla quedan deshabilitados y
     no aceptan otro toque;
  3. según el resultado:
     - `ok`, `not-found` o `no-tracking` → recargar la lista sin mensaje;
     - `unauthorized` → `signOut()` una vez;
     - `unreachable` → `common.cannotReachServer`;
     - `error`, `missing-config` o un rechazo → `common.somethingWentWrong`.

  Los mensajes de error se pintan en el `Text` `geofences-action-error`
  (`selectable`, `text-danger`), **último hijo** de la raíz. Un error no
  recarga la lista y deja el interruptor como estaba. El siguiente intento
  borra el mensaje al empezar.

  *Tests*:

  - `src/screens/geofences/index.test.tsx`,
    `describe('#41 R6: el dueño activa y desactiva una zona')`, 10 `it`.
  - Candado heredado: el mapa `screenSignOutCalls` de
    `src/__tests__/design-drift.test.ts` gana
    `'screens/geofences/index.tsx': 1` ([[design]] D8 fila 4).

  **Declarado**: el rojo de R6 también pone rojo el
  `it('preserves every mutation sign-out with zero delta')` del
  `describe('#87 R19: use-api no deja huella')` (0 ≠ 1).

### R7 — El dueño borra una zona tras confirmar

- **R7**: WHILE el rol es `owner`, THE SYSTEM SHALL pintar como **tercer
  hijo** de cada tarjeta un `Button` `geofence-<id>-delete` con:

  - `variant="danger-soft"`, `size="sm"`,
    `className="min-h-11 rounded-xl bg-danger-soft"` e `isDisabled={busy}`;
  - un `Button.Label` `font-semibold text-danger` con `geofences.delete`.

  WHEN el dueño lo toca, THE SYSTEM SHALL llamar **una vez** a
  `Alert.alert` con:

  - título `geofences.deleteTitle` con `name`;
  - cuerpo `geofences.deleteBody`;
  - los botones
    `[{ text: geofences.cancel, style: 'cancel' }, { text: geofences.delete, style: 'destructive', onPress }]`.

  "Cancelar" no llama a nada. "Eliminar" llama **una vez** a
  `deleteGeofence(baseUrl, token, petId, <id>)` con el mismo `busy` y la
  misma tabla de resultados de R6.

  *Test*: `src/screens/geofences/index.test.tsx`,
  `describe('#41 R7: el dueño borra una zona tras confirmar')`, 7 `it`.

### R8 — Quien no es dueño ve las zonas sin controles

- **R8**: WHILE el rol es `family`, `walker` o `vet`, o `getPet` no da `ok`,
  THE SYSTEM SHALL pintar como **segundo y último hijo** de cada tarjeta un
  `Text` `geofence-<id>-status`:

  - clase `self-start rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted`;
  - texto `geofences.statusActive` o `geofences.statusInactive` según
    `active`;
  - ningún `Switch` ni botón de borrar en toda la pantalla.

  *Test*: `src/screens/geofences/index.test.tsx`,
  `describe('#41 R8: quien no es dueño ve las zonas sin controles')`, 5 `it`.

### R9 — El Perfil enlaza a las zonas de la mascota activa

- **R9**: WHILE el Perfil tiene mascota activa, THE SYSTEM SHALL pintar en
  `src/screens/profile/index.tsx` un `Pressable` `geofences-link`:

  - va justo después del `Pressable` `pairing-link`, dentro del mismo
    `{pet ? (<>…</>) : null}`;
  - lleva `accessibilityRole="button"`, `hitSlop={TOUCH_SLOP}`,
    `className="flex-row items-center justify-between rounded-xl bg-default px-3 py-2"`
    y `style={CONTINUOUS_CORNER}`;
  - contiene un `Text` `font-semibold text-foreground` con
    `geofences.title` y un `<ChevronRight size={20} color={muted} />`.

  WHEN se toca, THE SYSTEM SHALL hacer
  `router.push(`/pets/${pet.id}/geofences` as Href)` una vez.

  *Tests*:

  - `src/screens/profile/index.test.tsx`,
    `describe('#41 R9: Perfil enlaza a las zonas seguras de la mascota activa')`,
    `it('pinta la fila de zonas seguras tras la de GPS y abre la ruta de la mascota activa')`.
  - Seis candados heredados ([[design]] D8 filas 5–10).

  **Declarado**: el rojo de R9 también pone rojos estos cinco `it`
  heredados:
  - `'profile usa cuatro ChevronRight de reicon'` (`#62 R7`);
  - `'screens/profile/index.tsx importa y aplica sus 4 esquinas'`
    (`#62 R14`);
  - `'deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban'`
    (`#98 R10`);
  - `'resuelve las 36 ocurrencias normativas'` (`#65 R7`);
  - `'resuelve cada ocurrencia de la tabla contra la clave exacta'`
    (`#65 R18`).

### R10 — Las zonas seguras resuelven su copy por clave

- **R10**: THE SYSTEM SHALL resolver todo el copy de la pantalla y de su
  cabecera por clave literal, con exactamente las 18 ocurrencias de la tabla
  `R14_GEOFENCES` de `src/__tests__/ui-copy-table.ts` ([[design]] D6).

  *Test*: `src/__tests__/ui-language.test.ts`,
  `describe('#41 R10: las zonas seguras resuelven su copy por clave')`,
  `it('registra cada ocurrencia de la pantalla y de su cabecera')`.

  Rojo **por la ruta (b)**, porque el copy ya está escrito así tras R8:

  - el commit rojo planta en `src/screens/geofences/index.tsx`
    `const retryKey = 'common.retry' as const;` y `t(retryKey)`;
  - el commit verde lo revierte.

  **Declarado**: la mutación también pone rojo el `it` heredado
  `'resuelve cada ocurrencia de la tabla contra la clave exacta'` del
  `describe('#65 R18: …')`.

## Enmiendas a docs y a specs ajenas (gates propios)

Codex aplica la enmienda **después** de la firma de su casilla y **antes**
del primer commit rojo, en un commit propio
`docs(specs): apply amendment A18 of #41`. `<fecha>` es la fecha del commit
que firma la casilla.

- **A18 — lista de A11 en los docs.** En `docs/conventions.md` y en
  `docs/ui-guidelines.md`, Codex sustituye **literal** este fragmento (único
  en cada fichero en `03f57706` y en `4e8d6cc3`):

  ```
  `meal-schedule`, `pairing`, `reminders`, `alerts` (estas dos por la enmienda A13 de #114, 2026-09-23) y `alerts/[alertId]` (por la enmienda A15 de #100, 2026-09-28)—
  ```

  por este otro:

  ```
  `meal-schedule`, `pairing`, `reminders`, `alerts` (estas dos por la enmienda A13 de #114, 2026-09-23), `alerts/[alertId]` (por la enmienda A15 de #100, 2026-09-28) y `pets/[petId]/geofences` (por la enmienda A18 de #41, <fecha>)—
  ```

  Comprobaciones:
  - `grep -c 'enmienda A18 de #41' docs/conventions.md docs/ui-guidelines.md`
    → `1` en cada uno;
  - `src/__tests__/hero-header-amendments.test.ts` sigue verde.

  **A18 es el siguiente id libre.** La A17 es la última aplicada (#100) y
  ninguna spec abierta en `03f57706` ni en `4e8d6cc3` reserva la A18.

## Fuera de alcance

Clasificado viñeta a viñeta, con su premisa verificada contra `03f57706` y
`4e8d6cc3`.

**Delimitaciones — no son features, no se registran:**

- **Crear y editar zonas, y dibujarlas en un mapa**: es #146, que reutiliza
  `src/api/geofences.ts` y `geofenceKeys`.
- **Los círculos en la pestaña Mapa** (Make §1.2): fuera de #41 y de #146,
  por decisión del humano del 2026-10-01.
- **Polígonos y zonas compartidas entre mascotas**: el backend solo tiene
  `safe_circle` y `geofences.pet_id` es `NOT NULL` (decisiones 1 y 9 del
  explore).
- **El estado de evaluación (`state.value`: dentro, fuera, desconocido)** no
  se pinta. El enunciado pide nombre, radio y activa.
- **Cambios fuera de la app móvil**: ninguno en `backend-pet-tracker/`,
  `infra/`, `init.sh`, CI, `app.json` ni `package.json`.
  - Cero dependencias nuevas: `Switch` y `Skeleton` son de
    `heroui-native 1.0.8`, ya instalado.
  - No se regenera el dev build: todo es JS.
- **Recarga al recuperar el foco** (`useFocusEffect`): no. La lista se
  recarga al montar (`staleTime: 0`) y tras cada escritura.

**Deuda candidata para el leader (sin id reservado):**

- **El 402 en los `GET` impide ver o preparar zonas de una mascota sin
  suscripción.** Es una decisión de producto de backend; el explore la dejó
  fuera (decisión 11 (b)) y #145 también.
- **El límite de 5 zonas por mascota** (`GEOFENCE_MAX_PER_PET`) solo aparece
  al crear, así que es cosa de #146. La lista no lo muestra.
- **Huérfanas previas a #145**: las alertas que quedaron con
  `geofence_id` nulo antes de #145 no se limpian (#145 D7). La lista no las
  ve.
- **Las filas del Perfil no tienen respuesta visual al pulsarlas**: ni
  documentos, ni emparejamiento, ni esta. #138 lo hizo para la fila de
  emparejamiento de otra pantalla.
- **Títulos que no siguen a sus recuentos:**
  - el `it('resuelve las 36 ocurrencias normativas')` de `#65 R7` asevera 37
    tras R9;
  - el `it('cuadra ALL_USES con la suma de los doce bloques')` suma catorce.

  No se renombran aquí porque cambiar un título rompe la trazabilidad de su
  spec dueña.
- **No hay API para añadir miembros a una mascota**, y eso obliga al
  `insert` manual de la prueba de humo (P16).

## Coordinación con otras sesiones

- **#60 (sesión Frontend, `feature/60-mobile-ios-support`).**
  - Toca `src/screens/profile/index.tsx`, su test y `docs/conventions.md`.
  - Esta spec está anclada a los blobs de `03f57706`: `ef3e7362` (pantalla)
    y `b52c4b44` (test). En `main`, hoy, son `4cc1c08b` y `08203f12`.
  - **Enmienda E1 (2026-10-02):** el handoff se hace sobre `main` sin #60.
    En `4e8d6cc3`, #60 solo cambia en esos dos ficheros tres cosas, y
    ninguna toca las anclas de R9 ni los recuentos de D8:
    - la llamada a `ImagePicker.launchImageLibraryAsync` (+2 líneas);
    - el mock de `expo-image-picker` (+5);
    - un `it` dentro del `describe('R7: cambiar foto')` (+14).

    Fuera de esos ficheros, #60 no toca ningún candado de #41: de
    `src/__tests__`, `src/app`, `src/i18n`, `src/api` y `src/providers` solo
    cambia `src/__tests__/hosting-artifacts.test.ts`.
  - Quien mergee **segundo** (#41 o #60) resuelve el posible conflicto
    textual en `src/screens/profile/index.test.tsx` conservando los dos
    cambios. Si #60 cambia el Perfil fuera de esas líneas antes de mergear,
    re-verifica R9 y las filas 5–10 de [[design]] D8.
- **Candados compartidos.** Cualquier otra feature que añada claves al
  catálogo, rutas al `Stack.Protected`, filas al Perfil o bloques a
  `ui-copy-table.ts` mueve los mismos candados:
  - la expresión de `#65 R12`;
  - `SCREEN_FILES`;
  - los recuentos de `#62 R7`, `#62 R14` y `#98 R10`;
  - los `toHaveLength` de `#114 R1` y `#100 R2`;
  - el nombre `R14_GEOFENCES`.

  Quien mergee **segundo** recuenta sobre `main`, conservando la suma visible
  y el comentario de cada feature.
- **#146** depende de #41: usa su cliente, su clave y su pantalla.

## Verificación

- **Comandos dirigidos.** Se lanzan **desde `mobile-pet-tracker/`** con
  `--runTestsByPath`, y las rutas con corchetes van **entre comillas
  simples** (`docs/conventions.md` §Filtros de jest). La lista exacta vive en
  [[tasks]]. Comprobar siempre que el número de suites que imprime jest
  coincide con el de ficheros pedidos.
- **Delta de cierre contra la base medida al arrancar**: **+2 suites**
  (`src/api/__tests__/geofences.test.ts` y
  `src/screens/geofences/index.test.tsx`) y **+76 tests**, con el reparto
  por fichero de [[design]] D7. Ninguna suite pasa de verde a roja.
- **Medición hecha, no pendiente.** Los ocho ficheros que recorren
  `src/app/` con el router real (lista en [[design]] D7) siguen verdes con la
  ruta nueva: se midió en el verde de R4. Si alguno sale rojo en el árbol de
  Codex, Codex para y lo reporta.
- **Typecheck y lint.** `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit`
  y `bunx expo lint`, con **`exit=0` y salida vacía**. Si `router.d.ts`
  existe, Codex **no** lo borra: pide al humano que lo borre.
- **C8** (`CHECKPOINTS.md`):
  - cero hex fuera de `src/theme/`;
  - cero clases arbitrarias;
  - cero `StyleSheet.create`;
  - cero sombras legacy;
  - métricas vía A11.
- **Búsquedas que deben salir vacías:**
  - `git grep -n "queryKey: \[" -- mobile-pet-tracker/src/screens/geofences`
    (la clave sale de `geofenceKeys`);
  - `git grep -n "useMutation\|useFocusEffect" -- mobile-pet-tracker/src/screens/geofences`.
- **Ficheros intocables:**
  `git diff <HEAD del handoff> -- backend-pet-tracker infra mobile-pet-tracker/package.json mobile-pet-tracker/app.json`
  sale vacío.

## Prueba de humo del humano (no delegable a IA)

Runtime: **dev build de Android**, nunca Expo Go. **No se regenera**, porque
no entra ningún módulo nativo. La app va en español salvo en el paso 8.

**Precondiciones**

- **Metro y backend.** Metro sirve el branch de #41 al dev build del
  teléfono, y el backend de tu LAN está arriba. `EXPO_PUBLIC_API_URL` ya
  termina en `/v1`; en los comandos de abajo, `<API>` es ese valor tal cual,
  **sin añadir otro `/v1`**.
- **Token.** Obtén un `<jwt>` de tu cuenta (en Windows, `curl.exe`):
  `curl.exe -X POST -H "Content-Type: application/json" --data "@login.json" "<API>/auth/login"`,
  con `login.json` = `{"email":"…","password":"…"}`.
- **Mascota con rastreo (`<petId>`).** Tómala de
  `curl.exe -H "Authorization: Bearer <jwt>" "<API>/pets"`. Tiene que tener
  collar y suscripción activa. Si caducó, ejecuta desde
  `backend-pet-tracker/`:
  `pnpm run subscription:set -- --unit-id <unitId> --status active`.
- **Dos zonas en esa mascota.** Créalas en este orden:
  1. `curl.exe -X POST -H "Authorization: Bearer <jwt>" -H "Content-Type: application/json" --data "{\"name\":\"Casa\",\"type\":\"safe_circle\",\"centerLat\":19.4326,\"centerLng\":-99.1332,\"radiusM\":150}" "<API>/pets/<petId>/geofences"`
  2. Lo mismo con `"name":"Parque"`, `"radiusM":300` y `"active":false`.
- **Mascota sin collar.** Una mascota tuya sin collar emparejado; vale una
  recién creada.
- **Cuenta que no es dueña (P16).**
  1. Registra una segunda cuenta `<email2>` desde la app.
  2. Desde la máquina del backend, dale acceso de `family`:
     `docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker -c "insert into pet_users (pet_id, user_id, role, status) values ('<petId>', (select id from users where email = '<email2>'), 'family', 'active');"`
- **adb.** El teléfono sale **dos veces** en `adb devices -l` (IP y mDNS).
  En Windows, `adb devices -l | findstr 192.168` da la línea de la IP; usa
  **siempre** `adb -s <ip:puerto>` con ese valor.

**Pasos**

- [ ] 1. **Entrada desde el Perfil.** Con la mascota con rastreo activa,
      entra en Perfil. La fila "Zonas seguras" aparece justo después de
      "Configuración del Dispositivo GPS", con chevrón. Al tocarla entra
      "Zonas seguras" con cabecera nativa y flecha, sin barra flotante.
- [ ] 2. **Lista.** Aparecen "Casa" (Radio de 150 m, interruptor encendido)
      y debajo "Parque" (Radio de 300 m, interruptor apagado), cada una con
      "Eliminar".
- [ ] 3. **Activar.** Enciende "Parque": el interruptor queda encendido.
      Luego:
      1. Atrás y vuelve a entrar: sigue encendido.
      2. `adb -s <ip:puerto> shell am force-stop com.trackermex.pettracker`,
         abre la app y vuelve a la pantalla: sigue encendido, es decir, lo
         guardó el servidor.
      3. Apágalo otra vez.
- [ ] 4. **Borrar.**
      1. Toca "Eliminar" en "Parque": sale "¿Eliminar Parque?" con el cuerpo
         de P4.
      2. "Cancelar": la zona sigue.
      3. Repite y pulsa "Eliminar": "Parque" desaparece y "Casa" sigue.
- [ ] 5. **Cuenta que no es dueña.** Cierra sesión y entra con `<email2>`.
      En Perfil, "Zonas seguras" de esa mascota muestra "Casa" con la
      píldora "Activa", sin interruptor ni "Eliminar".
- [ ] 6. **Sin collar.** De vuelta en tu cuenta, activa la mascota sin
      collar y entra en "Zonas seguras": se ve "Las zonas seguras requieren
      un collar", sin "Reintentar".
- [ ] 7. **Vacío.** Borra "Casa" desde la app: se ve "Aún no hay zonas
      seguras".
- [ ] 8. **Tema e idioma.** Con tema oscuro (Profile) e inglés, la pantalla
      toma fondo y texto del tema y su título es "Safe zones". Métricas: no
      queda hueco entre la cabecera y la primera tarjeta, y el contenido
      termina unos 24 px sobre la barra del sistema.
- [ ] 9. **Limpieza.** Borra la fila de membresía:
      `docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker -c "delete from pet_users where pet_id = '<petId>' and role = 'family' and user_id = (select id from users where email = '<email2>');"`
      Debe responder `DELETE 1`.

- [ ] Prueba de humo superada (fecha: )

## Aprobación

> Tres casillas, tres gates (lección `gate-humano-sin-casilla-donde-firmar`):
>
> - la de A18 autoriza cambiar texto normativo ajeno;
> - la de la spec autoriza implementar y firma P1–P16;
> - la de §Prueba de humo cierra la feature.

### Enmienda A18 — lista de A11 en `docs/conventions.md` y `docs/ui-guidelines.md`

- [x] Enmienda A18 aprobada por humano (fecha: 2026-10-01)

### Aprobación de la spec

- [x] Aprobado por humano (fecha: 2026-10-01) ← gate obligatorio antes de implementar
