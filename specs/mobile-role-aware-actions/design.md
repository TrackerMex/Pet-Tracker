---
feature: "mobile-role-aware-actions"
status: draft        # draft | approved
tags: [mobile, roles, spec]
---

# Diseño — [[mobile-role-aware-actions]] (#216)

> Ver [[requirements]] para los requisitos que este diseño implementa,
> [[../../docs/architecture|architecture]] para las reglas de capas y
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI móvil. Todas
> las rutas son relativas a `mobile-pet-tracker/` salvo que se diga otra cosa.

## Artboards congelados (`canvas/`)

No hay artboard nuevo. #216 aplica un patrón que el canvas ya dibujó y que
#202 congeló. Las copias de `canvas/` son las de
`specs/mobile-canvas-zones/canvas/`, versión de canvas `1792777983-cd94`:

| Fichero | sha256 | Qué fija |
|---|---|---|
| `canvas/ZonasSoloLectura.dc.html` | `715b0355e2274c944c170f670b93b34e355b0a85e2d8d53bff89393b080da6cc` | Un no dueño ve el contenido sin la acción. La acción se quita sin dejar hueco ni aviso. Lo aplican R1, R2, R3, R4, R5 y R7. |
| `canvas/EditorZonaSoloLectura.dc.html` | `648ac6cc7fdc9fe3ebf762ae11b670a5371fa6b086f69a0ff5b5877391a455a8` | Cuando la pantalla entera es la acción, una nota en gris (`text-sm`, `text-muted`) ocupa el sitio del formulario. Lo aplica R6. |

Verificación: `sha256sum specs/mobile-role-aware-actions/canvas/*.dc.html`
(desde la raíz del repo) da esos dos valores.

## Inventario de las cinco acciones del plan

El plan (`progress/plan_mejoras-producto-2026-10-26.md` §2, feature 216) pide
ocultar a un no dueño cinco acciones. Este es su estado en `origin/dev`
(4c0c99ac), contrastado contra el árbol y no contra
`progress/explore_roles-sharing-2026-10-26.md` (base `fa3f36c0`):

| Acción | Dónde (fichero: símbolo o testID) | ¿La ve hoy un no dueño? | Requisito |
|---|---|---|---|
| Registrar peso | `src/screens/weight-log/index.tsx`: `WeightLogContent`, `weight-form` / `weight-submit` | Sí. La pantalla no consulta la mascota. | R1 |
| Agregar recordatorio | `src/screens/home/index.tsx`: `QUICK_ACTIONS`, `quick-action-reminder` | Sí | R2 |
| | `src/screens/reminders/index.tsx`: `reminders-add-link` y la acción del `EmptyState` `reminders-empty` | Sí | R4 |
| | `src/screens/health/index.tsx`: `vaccine-reminder-notice-action` | No: solo aparece tras dar de alta una vacuna, que ya es del dueño | Fuera de alcance |
| Borrar en Recordatorios | `src/screens/reminders/index.tsx`: `reminder-delete-<id>` y `reminder-cancel-series-<id>` | Sí | R5 |
| Vincular collar | `src/screens/home/index.tsx`: `collar-pair-link` | Sí | R3 |
| | `src/screens/pairing/index.tsx`: formulario con `activation-code-input` y `pairing-submit` | Sí | R6 |
| | `src/screens/pairing/index.tsx`: `device-unpair` | Sí | R7 |
| | `src/screens/map/index.tsx`: `canPairCollar` | No | Fuera de alcance |
| | `src/screens/profile/index.tsx`: `pairing-link` | Sí, pero el destino queda sin acciones con R6 y R7 | Fuera de alcance |
| Subir documentos | `src/screens/docs/index.tsx`: `isOwner` | No (#158 R3 y R4) | Fuera de alcance |

Las premisas del explore se cumplen en el árbol de este worktree. La única
diferencia es de alcance: Vincular collar tiene más superficies que las que
nombra el plan (Inicio, la propia pantalla y Desvincular). Las tres entran.

## Decisiones técnicas

- **Un booleano `isOwner` por pantalla, sin hook nuevo** (R1–R7).
  - El patrón ya vive en línea en `src/screens/docs/index.tsx`,
    `src/screens/meal-schedule/`, `src/screens/geofences/` y
    `src/screens/geofence-editor/`. #216 suma cuatro usos más.
  - Un `useIsOwner` tendría que aceptar dos fuentes (lista o detalle), porque
    cada pantalla ya consulta una distinta. Esa bifurcación es justo lo que el
    hook escondería.
  - Mientras la consulta no resuelve en `ok`, `isOwner` es `false`. Ocultar
    durante la carga evita un formulario que aparece y desaparece. El 403 del
    backend sigue cubriendo cualquier caso que se escape.

- **Peso lee la mascota con `getPet` bajo `petKeys.detail(petId)`** (R1).
  - `WeightLogContent` recibe `petId` y no tiene consulta de mascota. La clave
    de detalle es la que ya usan Inicio, Perfil, Mapa y Documentos, así que el
    dato suele estar en caché al llegar a Peso.
  - Forma literal, sin variantes:

    ```
    const pet = useQuery({
      queryKey: petKeys.detail(petId),
      queryFn: () => getPet(baseUrl, token ?? '', petId),
    });
    const isOwner = pet.data?.kind === 'ok' && pet.data.pet.myRole === 'owner';
    ```

  - Imports: `import { getPet } from '../../api/pets';` y `petKeys` se suma al
    import de `../../api/query-keys` que ya trae `healthKeys` y `userKeys`.
  - La consulta no llama a `signOut`. Un 401 lo sigue gestionando la consulta
    de pesos, igual que hoy. `screenSignOutCalls` de
    `src/__tests__/design-drift.test.ts` sigue en `1` para Peso.
  - Lo que se envuelve es el `<RiseIn delayMs={80}>` del formulario entero:
    `{isOwner ? ( <RiseIn …>…</RiseIn> ) : null}`. El literal `delayMs={80}`
    que vigila `src/__tests__/health-weight-canvas-fidelity.test.ts` no se
    mueve.

- **Inicio decide con la lista (`petKeys.list()`)** (R2, R3).
  - Los accesos rápidos dependen solo de `selectedPetId`, no del detalle, así
    que el rol sale de `petList`:
    `const isOwner = petList.find(({ id }) => id === selectedPetId)?.myRole === 'owner';`,
    justo debajo de la declaración de `petList`.
  - El tile se quita dentro del `map`, no antes:
    `testID === 'quick-action-reminder' && !isOwner ? null : (<Pressable …>)`.
    Así `quickActionInks[index]` sigue alineado con su tile (Documentos
    conserva la tinta azul de la posición 2). Filtrar antes del `map` le daría
    a Documentos la tinta ámbar. El literal `QUICK_ACTIONS` no cambia, ni los
    tres `testID: 'quick-action-`.
  - El enlace del collar cambia solo su condición:
    `{detail.data.pet.device === null && isOwner ? (`. La tarjeta y su texto
    «Sin collar» se quedan. La tarjeta ya espera al detalle, y el detalle no
    arranca hasta que hay `selectedPetId` (`enabled: selectedPetId !== null`),
    que sale de la lista. Cuando la tarjeta se pinta, la lista ya está, así
    que el tiempo de aparición no cambia.

- **Recordatorios decide con su lista de mascotas** (R4, R5).
  - `const isOwner = pets.data?.kind === 'ok' && pets.data.pets.find(({ id }) => id === selectedPetId)?.myRole === 'owner';`
  - `accessory={isOwner ? (<Button testID="reminders-add-link" …>…</Button>) : undefined}`,
    escrito con `accessory={isOwner ? (` en una sola línea.
  - `action={isOwner ? { label: t('reminders.new'), onPress: () => router.push('/add-reminder' as Href) } : undefined}`,
    la misma forma que `src/screens/docs/index.tsx` usa con `t('docs.upload')`.
  - El `Button` de la fila se envuelve en `{isOwner ? (<Button …/>) : null}`.
    Su `testID` con `isSeries` no cambia.
  - Las hojas de confirmación (`reminders-delete-confirm`,
    `reminders-cancel-series-keep`, …) no se tocan: sin botón de fila no se
    abren.

- **Vincular collar decide con `selectedPet`** (R6, R7).
  - `const isOwner = selectedPet?.myRole === 'owner';` debajo de
    `selectedPet`. `isLinking` no cambia.
  - En el segundo bloque `phase === 'idle' && selectedPet?.device === null`,
    la condición externa se queda. Dentro va
    `isOwner ? (<View className="gap-4" style={{ flexGrow: 1 }}>…</View>) : (<Text testID="pairing-owner-only" …>)`.
  - La nota copia la de `src/screens/geofence-editor/index.tsx`
    (`geofence-editor-read-only`: `text-sm font-normal leading-body text-muted`,
    sin `RiseIn`) y le suma `text-center`, porque el héroe de Vincular collar
    va centrado. Clase completa:
    `text-center text-sm font-normal leading-body text-muted`.
  - El `device-unpair-spacer` y el `Button` `device-unpair` se envuelven
    juntos en `{isOwner ? (<>…</>) : null}`. Sin botón, el espaciador sobra.

- **El tiempo de aparición** solo cambia en dos sitios:
  - En Recordatorios, `reminders-add-link` pasa a esperar a la lista de
    mascotas. Lo absorbe una enmienda mecánica (ver tasks.md R4).
  - En Peso, el formulario pasa a esperar a `getPet`. Lo absorben una enmienda
    segura (`#199 R22`) y otra condicional (`#199 R7`, ver tasks.md R1).

## Copy

No hay copy nuevo y no hay gate G1. La nota de R6 reutiliza
`pairing.errorForbiddenClaim`, que ya existe en `src/i18n/catalog.ts`:

- es: «Solo el dueño puede vincular un collar.»
- en: «Only the owner can pair a collar.»

Hoy esa clave es el mensaje del 403 del claim. Ahora también es el texto de la
nota. El tono es Voz B: sereno, sin culpa y sin signos de exclamación.
`reminders.emptyBody` no cambia (ver requirements.md, Fuera de alcance).

## Guardas que se mueven

| Guarda | Qué cuenta | Efecto de #216 |
|---|---|---|
| `src/__tests__/ui-copy-table.ts` `R10_PAIRING` + `checkUses` | `t('clave')` por fichero y clave | `pairing.errorForbiddenClaim` pasa de 1 a 2 usos en `src/screens/pairing/index.tsx`. Se añade una fila (R6). |
| `src/__tests__/ui-language.test.ts` `#65 R10` | longitud de `R10_PAIRING` | `42 + 2 + 1 + 4 - 1 + 1` pasa a `… + 1` (R6). |
| `SCREEN_FILES` | ficheros de pantalla | Sin cambio: `src/screens/pairing/index.tsx` ya está. |
| `src/__tests__/design-drift.test.ts` `HEX_LITERAL` | `#` seguido de 3 a 8 hex | Todo `#216` en código o test va seguido de ` R<n>`. Un `// #216` suelto tumba la guarda. |
| `src/__tests__/design-drift.test.ts` `screenSignOutCalls` | `signOut(` por pantalla | Sin cambio en las cuatro pantallas. |
| `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | etiqueta de `pairing-submit`, `weight-submit`, `reminders-add-link` | Sin cambio: cada testID sigue apareciendo una sola vez y la etiqueta no se toca. |
| `src/__tests__/collar-alerts-canvas-fidelity.test.ts` | etiqueta de `device-unpair` | Sin cambio, por la misma razón. |
| `src/__tests__/consistency-classnames.test.ts` | inventarios `rounded-16 bg-accent`, `rounded-xl bg-accent`, `CONTINUOUS_CORNER`, `TABULAR_NUMS` | Sin cambio: no se añade ni se quita ningún literal, solo se envuelven. |
| `src/__tests__/no-pets-states.test.ts` | `<EmptyState` en Recordatorios = 2 | Sin cambio. |
| `src/__tests__/routine-canvas-fidelity.test.ts` `#204 R17` | Recordatorios grep-limpio | Sin cambio si se respeta la regla de `HEX_LITERAL`. |
| Inicio: comprobaciones estáticas de `QUICK_ACTIONS` | 3 `testID: 'quick-action-`, un `{QUICK_ACTIONS.map(`, un `<Icon size={26}` | Sin cambio. |

Los selectores por prefijo de los tests no atrapan el testID nuevo:

- En Vincular collar son `/^pairing-content-skeleton-/`, `/^pet-chip-/` y
  `/^pairing-(ring-0|ring-1|pingo)$/`. Ninguno casa `pairing-owner-only`.
- En Inicio, `/^quick-action-/` es justo el selector que R2 usa, a propósito.

## Archivos afectados

Todos en la capa de presentación móvil. No hay cambios de dominio, aplicación
ni backend.

- `src/screens/weight-log/index.tsx`: consulta de la mascota, `isOwner` y
  formulario condicionado (R1).
- `src/screens/weight-log/index.test.tsx`:
  - doble de `../../api/pets` y `makePet`;
  - `describe('#216 R1 …')`;
  - enmienda de `#199 R22` y, solo si se pone roja, de `#199 R7`.
- `src/screens/home/index.tsx`: `isOwner`, tile Recordatorio y
  `collar-pair-link` condicionados (R2, R3).
- `src/screens/home/index.test.tsx`: `describe('#216 R2 …')` y
  `describe('#216 R3 …')`.
- `src/screens/reminders/index.tsx`: `isOwner`, Nuevo, acción del vacío y
  botón de fila condicionados (R4, R5).
- `src/screens/reminders/index.test.tsx`: `describe('#216 R4 …')`,
  `describe('#216 R5 …')` y la enmienda de `opens the add-reminder route`.
- `src/screens/pairing/index.tsx`: `isOwner`, nota de solo lectura y
  Desvincular condicionado (R6, R7).
- `src/screens/pairing/index.test.tsx`: `describe('#216 R6 …')` y
  `describe('#216 R7 …')`.
- `src/__tests__/ui-copy-table.ts`: una fila en `R10_PAIRING` (R6).
- `src/__tests__/ui-language.test.ts`: la longitud de `#65 R10` (R6).

## Alternativas descartadas

- **Hook `useIsOwner(petId)`.** Cuatro usos nuevos, cada uno con una fuente
  distinta (lista o detalle). Ver Decisiones técnicas.
- **Inicio con el detalle (`detail.data.pet.myRole`).** Los accesos rápidos se
  pintan con `selectedPetId`, antes de que llegue el detalle. Atarlos al
  detalle retrasaría la fila entera para el dueño.
- **Filtrar `QUICK_ACTIONS` antes del `map`.** Desalinea `quickActionInks`:
  Documentos tomaría la tinta ámbar.
- **Ocultar el `pairing-link` de Perfil.** El destino ya no ofrece acciones con
  R6 y R7, y para un no dueño con collar es la única vía a ver su estado.
  Además, Perfil lo edita #214 en paralelo.
- **Bloquear la pantalla Agregar recordatorio por rol.** Ningún enlace lleva
  ahí a un no dueño tras R2 y R4. Para un deep link, el 403 basta.
- **Copy nuevo para el vacío de Recordatorios** («Solo el dueño puede…»).
  Exigiría el gate G1 por un caso que el texto actual ya cubre sin mentir.
- **Una constante para no pasar por la tabla de copy.** Esquivaría
  `checkUses` en vez de declarar el uso. Se declara la fila.
- **Mostrar el formulario de Peso mientras carga la mascota** y ocultarlo al
  llegar un rol no dueño. Haría que el formulario apareciera y desapareciera, y
  dejaría una ventana en la que un no dueño puede pulsar.

## Riesgos

| Riesgo | Fichero compartido | Dueño | Mitigación |
|---|---|---|---|
| #217 ya está en `origin/dev` (`ca2d0abb`) y la rama de #216 sale de `4c0c99ac` | `src/screens/home/index.tsx`, `src/screens/home/index.test.tsx` | #217 es dueño de sus líneas (`HeroStatusBar`, doble de `expo-status-bar`, `describe('#217 R6 …')`) | Paso 0 de tasks.md: `merge origin/dev`, nunca rebase. Las anclas de #216 en Inicio no tocan esas líneas. |
| Otra feature en paralelo suma filas a la tabla de copy o a su longitud | `src/__tests__/ui-copy-table.ts`, `src/__tests__/ui-language.test.ts` | #216 es dueño solo de su fila `// #216 R6` y de su `+ 1` | Quien mergea segundo a `dev` vuelve a medir la expresión de `#65 R10` y suma, no reemplaza. |
| #214 (miembros) edita Perfil y puede tocar el flujo de invitación | `src/screens/profile/index.tsx` | #214 | #216 no toca Perfil. #216 no necesita código de #214: `myRole` ya llega del backend. Solo el smoke necesita una cuenta `family`, que se crea con el flujo de #214. |
| Alinear las tintas de los tiles | `src/screens/home/index.tsx` | #216 | `null` dentro del `map`. R2 lo candea con la tinta de Documentos para un no dueño. |
| Tests existentes que esperan el formulario de Peso o el botón Nuevo antes de que llegue el rol | `src/screens/weight-log/index.test.tsx`, `src/screens/reminders/index.test.tsx` | #216 | Lista cerrada de enmiendas en tasks.md. Si se pone rojo otro `it`, se para y se anota en `progress/impl_mobile-role-aware-actions.md`, sin enmendarlo. |
| Un `#216` sin ` R<n>` en un comentario | cualquiera de los diez ficheros | #216 | Regla de `HEX_LITERAL`, en la verificación final de tasks.md. |
| Duplicar `testID="device-unpair"` o `testID="pairing-submit"` al reescribir con dos ramas | `src/screens/pairing/index.tsx` | #216 | Las guardas por etiqueta exigen un único literal. Se envuelve, no se duplica. Las anclas de R6 y R7 cuentan 1. |
