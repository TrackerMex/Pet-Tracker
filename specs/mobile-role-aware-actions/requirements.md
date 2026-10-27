---
feature: "mobile-role-aware-actions"
status: approved     # draft | approved
tags: [mobile, roles, spec]
---

# Requisitos — [[mobile-role-aware-actions]] (#216)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, los artboards congelados en
> `canvas/`, el inventario de las cinco acciones y los ficheros compartidos con
> otras features. Todas las rutas de código son relativas a
> `mobile-pet-tracker/` salvo que se diga otra cosa.

**Vocabulario.** «Dueño» es una mascota cuyo `PetProfile.myRole` es
`'owner'`. «No dueño» es cualquiera de los otros tres valores del tipo
(`src/api/types.ts`: `myRole: 'owner' | 'family' | 'walker' | 'vet'`). Cada
requisito que oculta algo lleva un candado por rama: una fila para `'family'`,
otra para `'walker'`, otra para `'vet'` y una fila `'owner'` que prueba que el
dueño sigue viendo la acción.

**De dónde sale el rol.** Siempre del doble de la mascota que ya usa cada
fichero de test, con `myRole` en sus `overrides`. Ningún test lee el rol de
otra fuente ni lo inyecta por un provider.

**Patrón.** Cada pantalla calcula un booleano local `isOwner`. Mientras la
consulta de la que sale el rol no ha resuelto en `kind: 'ok'` (cargando, error,
sin red), `isOwner` es `false` y la acción no se pinta. El 403 del backend se
queda como red de seguridad: ningún requisito toca su manejo.

## Requisitos funcionales

### Registro de peso

- **R1**: WHEN la pantalla Peso (`src/screens/weight-log/index.tsx`,
  `WeightLogContent`) se monta para la mascota `petId` THE SYSTEM SHALL leer
  esa mascota con `getPet(baseUrl, token ?? '', petId)` bajo la clave
  `petKeys.detail(petId)` y pintar el formulario de alta (`weight-form` con
  `weight-input`, `weight-date-input`, `weight-bc-input` y `weight-submit`)
  solo cuando `isOwner` es `true`. Con un no dueño, la pantalla sigue pintando
  `weight-log-header`, `weight-chart-card`, `weight-history-title` y las filas
  del historial (`weight-row-<id>`). Mientras `getPet` no ha resuelto, el
  formulario no se pinta.
  - Ancla, en `src/screens/weight-log/index.tsx`:
    - `grep -cF "const isOwner = pet.data?.kind === 'ok' && pet.data.pet.myRole === 'owner';"` = 1
    - `grep -cF "queryKey: petKeys.detail(petId),"` = 1
    - `grep -cF "{isOwner ? ("` = 1
    - `grep -cF "isOwner"` = 2 (la declaración y la condición del formulario)
    - `grep -cF "signOut("` = 1 (sin cambio: la consulta de la mascota no
      cierra sesión, igual que la de `src/screens/docs/index.tsx`; lo vigila
      `screenSignOutCalls` de `src/__tests__/design-drift.test.ts`)
  - Test: `describe('#216 R1: Peso solo deja registrar al dueño')` en
    `src/screens/weight-log/index.test.tsx`.
    - `it.each` con cuatro filas, `[role, formVisible]`: `['owner', true]`,
      `['family', false]`, `['walker', false]`, `['vet', false]`.
    - Cada fila resuelve `getPet` con `{ kind: 'ok', pet: makePet({ myRole: role }) }`
      y `listWeights` con `{ kind: 'ok', weights: [makeWeight()] }`.
    - Cada fila espera `findByTestId('weight-row-weight-1')` y, después,
      `waitFor` hasta que `queryClient.getQueryData(petKeys.detail('pet-1'))`
      es igual a ese `{ kind: 'ok', pet }`. Hoy esa espera agota el tiempo en
      las cuatro filas, porque Peso no consulta la mascota.
    - Cada fila comprueba `expect(mockGetPet).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1')`.
    - Cada fila comprueba que los cinco testID del formulario existen si
      `formVisible` y son `null` si no.
    - Cada fila comprueba que `weight-log-header`, `weight-chart-card` y
      `weight-history-title` existen.
  - Test: un `it('#216 R1 mientras la mascota carga no pinta el formulario')`.
    - `getPet` devuelve `pending()`. Tras `findByTestId('weight-row-weight-1')`,
      `weight-form` y `weight-submit` son `null`. Hoy es rojo: el formulario se
      pinta sin esperar a nadie.

### Inicio

- **R2**: WHEN Inicio (`src/screens/home/index.tsx`) pinta los accesos rápidos
  (`quick-actions-row`) para la mascota seleccionada THE SYSTEM SHALL pintar
  el tile `quick-action-reminder` solo si esa mascota de la lista
  (`petKeys.list()`) es del dueño. Con un no dueño, la fila tiene exactamente
  dos hijos, en este orden: `quick-action-weight` y `quick-action-documents`.
  Cada uno conserva su icono, su tinta, su fondo, el color de su etiqueta y su
  destino de hoy.
  - Ancla, en `src/screens/home/index.tsx`:
    - `grep -cF "const isOwner = petList.find(({ id }) => id === selectedPetId)?.myRole === 'owner';"` = 1
    - `grep -cF "testID === 'quick-action-reminder' && !isOwner"` = 1
    - `grep -cF "testID: 'quick-action-"` = 3 (el literal `QUICK_ACTIONS` no cambia)
    - `grep -cF "{QUICK_ACTIONS.map("` = 1
    - `grep -cF "<Icon size={26} color={quickActionInks[index]} />"` = 1
  - Test: `describe('#216 R2: el tile Recordatorio es solo del dueño')` en
    `src/screens/home/index.test.tsx`, con el `beforeEach` y el `afterEach`
    del `describe('#71 R1: la Home dibuja la rejilla de accesos rápidos')`.
    La mascota de `listPets` y la de `getPet` es la misma `makePet({ myRole: role })`.
    - `it.each` con cuatro filas, `[role, tiles]`:
      - `['owner', ['quick-action-weight', 'quick-action-reminder', 'quick-action-documents']]`
      - `['family', ['quick-action-weight', 'quick-action-documents']]`
      - `['walker', ['quick-action-weight', 'quick-action-documents']]`
      - `['vet', ['quick-action-weight', 'quick-action-documents']]`
    - Cada fila espía `Uniwind.getCSSVariable` con
      `mockImplementation((token) => token)`, igual que el `it('liga icono,
      etiqueta, fondo, destino, tinta y color de etiqueta de cada tile y de
      ninguno más (enmendado por #198 R5)')`.
    - Cada fila espera `findByTestId('quick-action-weight')`.
    - Cada fila comprueba que
      `within(screen.getByTestId('quick-actions-row')).getAllByTestId(/^quick-action-/).map(({ props }) => props.testID)`
      es igual a `tiles`.
    - Cada fila comprueba que `quick-actions-row` tiene `children` de longitud
      `tiles.length`.
    - Para cada tile pintado, la fila recorre esta tabla literal con las mismas
      aserciones que ese `it`:
      - el icono existe y `icon.props.color` es la tinta;
      - la etiqueta existe y su `className` contiene la clase de etiqueta;
      - el `className` del tile contiene el fondo;
      - al pulsar el tile, `router.push` se llama por última vez con el
        destino.

      | tile | icono | tinta | etiqueta | clase de etiqueta | fondo | destino |
      |---|---|---|---|---|---|---|
      | `quick-action-weight` | `icon-weight` | `--color-category-violet-strong` | `Peso` | `text-category-violet-strong` | `bg-category-violet` | `/weight-log` |
      | `quick-action-reminder` | `icon-calendar-plus` | `--color-category-amber-strong` | `Recordatorio` | `text-category-amber-strong` | `bg-category-amber` | `/add-reminder` |
      | `quick-action-documents` | `icon-file-text` | `--color-category-blue-strong` | `Documentos` | `text-category-blue-strong` | `bg-category-blue` | `/pets/pet-1/docs` |

    - `expect(mockRouter.push).toHaveBeenCalledTimes(tiles.length)`.
    - La tinta de `quick-action-documents` con un no dueño es el candado del
      índice: si el tile se filtra antes del `map`, Documentos recibe la tinta
      ámbar de la posición 1.

- **R3**: WHEN Inicio pinta la tarjeta del collar (`collar-card`) de una
  mascota sin collar (`device === null`) THE SYSTEM SHALL pintar
  `collar-pair-link` solo si esa mascota de la lista es del dueño. Con un no
  dueño, `collar-card` y `collar-status` siguen pintándose.
  - Ancla, en `src/screens/home/index.tsx`:
    - `grep -cF "{detail.data.pet.device === null && isOwner ? ("` = 1
    - `grep -cF 'testID="collar-pair-link"'` = 1
  - Test: `describe('#216 R3: Vincular collar en Inicio es solo del dueño')` en
    `src/screens/home/index.test.tsx`, con el `beforeEach` del
    `describe('R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing')`
    salvo la línea de `mockListPets`, que pasa a cada fila.
    - `it.each` con cuatro filas, `[role, linkVisible]`: `['owner', true]`,
      `['family', false]`, `['walker', false]`, `['vet', false]`.
    - Cada fila resuelve `listPets` y `getPet` con la misma
      `makePet({ myRole: role, device: null })`.
    - Cada fila espera `findByTestId('collar-card')` y comprueba que
      `collar-status` existe.
    - Con `linkVisible`, pulsa `collar-pair-link` y comprueba
      `router.push('/pairing')`. Sin él, `collar-pair-link` es `null`.

### Recordatorios

- **R4**: WHEN la lista Recordatorios (`src/screens/reminders/index.tsx`) se
  pinta para la mascota seleccionada THE SYSTEM SHALL pintar el botón Nuevo de
  la cabecera (`reminders-add-link`, `accessory` de `ScreenHeader`) y la
  acción del vacío (`reminders-empty-action`) solo si esa mascota de la lista
  (`petKeys.list()`) es del dueño. Con un no dueño:
  - la cabecera `reminders` tiene exactamente dos hijos (volver y la columna
    del título);
  - `reminders-empty`, `reminders-empty-title` y `reminders-empty-body` siguen
    pintándose sin botón.

  Al cambiar la selección de una mascota del dueño a una que no lo es, el
  botón Nuevo desaparece.
  - Ancla, en `src/screens/reminders/index.tsx`:
    - `grep -cF "const isOwner = pets.data?.kind === 'ok' && pets.data.pets.find(({ id }) => id === selectedPetId)?.myRole === 'owner';"` = 1
    - `grep -cF "accessory={isOwner ? ("` = 1
    - `grep -cF "action={isOwner ? { label: t('reminders.new'), onPress: () => router.push('/add-reminder' as Href) } : undefined}"` = 1
  - Test: `describe('#216 R4: Nuevo es solo del dueño')` en
    `src/screens/reminders/index.test.tsx`, con el `beforeEach` del
    `describe('#204 R4: cabecera en contenido')` salvo las dos líneas de
    `mockListPets` y `mockListReminders`, que pasan a cada `it`.
    - `it.each` A con cuatro filas, `[role, headerChildren]`: `['owner', 3]`,
      `['family', 2]`, `['walker', 2]`, `['vet', 2]`.
      - `listPets` devuelve `[makePet({ myRole: role })]` y `listReminders`
        devuelve `[makeReminder()]`.
      - Tras `findByTestId('reminder-row-reminder-1')`, la cabecera
        `reminders` tiene `children` de longitud `headerChildren`.
      - `reminders-add-link` existe solo en la fila `owner`. En esa fila, el
        último hijo de la cabecera es `reminders-add-link`.
    - `it.each` B con las mismas cuatro filas de rol y `listReminders` vacío.
      - Tras `findByTestId('reminders-empty')`, `reminders-empty-title` existe.
      - `reminders-empty-action` y `reminders-add-link` existen solo en la
        fila `owner`.
    - `it('#216 R4 al pasar a una mascota que no es del dueño, Nuevo se va')`.
      - `listPets` devuelve `[makePet(), makePet({ id: 'pet-2', name: 'Milo', myRole: 'family' })]`
        y `listReminders` devuelve `[]`.
      - Espera `findByTestId('reminders-add-link')` y pulsa `pet-chip-pet-2`.
      - Termina en `waitFor(() => expect(screen.queryByTestId('reminders-add-link')).toBeNull())`.
      - Este `it` atrapa un `isOwner` que mire «alguna mascota» o la primera
        de la lista en vez de la seleccionada.

- **R5**: WHEN la lista Recordatorios pinta una fila (`reminder-row-<id>`)
  THE SYSTEM SHALL pintar su botón final solo si la mascota seleccionada es
  del dueño. Ese botón es `reminder-delete-<id>` en un recordatorio puntual y
  `reminder-cancel-series-<id>` en una serie. Con un no dueño, la fila tiene
  exactamente dos hijos: el mosaico `reminder-tile-<id>` y la columna
  `min-w-0 flex-1 gap-0.75`. La línea `reminder-repeats-<id>` de una serie
  sigue pintándose.
  - Ancla, en `src/screens/reminders/index.tsx`:
    - `grep -cF 'reminder-cancel-series-${reminder.id}'` = 1 y
      `grep -cF 'reminder-delete-${reminder.id}'` = 1 (el botón sigue siendo
      uno solo, envuelto en la condición)
    - `grep -cF "isOwner"` = 4 (la declaración, el `accessory`, la acción del
      vacío y el botón de la fila)
  - Test: `describe('#216 R5: borrar y cancelar serie son solo del dueño')` en
    `src/screens/reminders/index.test.tsx`, con el mismo `beforeEach` que R4.
    - `it.each` con cuatro filas, `[role, rowChildren]`: `['owner', 3]`,
      `['family', 2]`, `['walker', 2]`, `['vet', 2]`.
    - `listPets` devuelve `[makePet({ myRole: role })]` y `listReminders`
      devuelve `[makeReminder(), makeReminder({ id: 'reminder-2', recurrence: { unit: 'month', every: 1 } })]`.
    - Tras `findByTestId('reminder-row-reminder-2')`, cada fila
      (`reminder-1` y `reminder-2`) tiene `children` de longitud `rowChildren`.
      Su `children[0]` tiene testID `reminder-tile-<id>` y su `children[1]`
      tiene `className` `min-w-0 flex-1 gap-0.75`.
    - Con `owner`, `children[2]` tiene testID `reminder-delete-reminder-1` en
      la primera fila y `reminder-cancel-series-reminder-2` en la segunda. Con
      un no dueño, `reminder-delete-reminder-1` y
      `reminder-cancel-series-reminder-2` son `null`.
    - En las cuatro filas, `reminder-repeats-reminder-2` existe.

### Vincular collar

- **R6**: WHILE la pantalla Vincular collar (`src/screens/pairing/index.tsx`)
  está en `phase === 'idle'` con una mascota seleccionada sin collar
  (`selectedPet?.device === null`) THE SYSTEM SHALL pintar el formulario de
  vinculación solo si esa mascota es del dueño. El formulario es el
  `<View className="gap-4" style={{ flexGrow: 1 }}>` que cuelga del segundo
  `{phase === 'idle' && selectedPet?.device === null ? (` del fichero (el
  primero es el héroe), con `pairing-plan-rise`, `pairing-plan-free`,
  `pairing-code-rise`, `activation-code-input`, `pairing-submit-spacer` y
  `pairing-submit`. Con un no dueño, en su lugar pinta una nota de solo
  lectura:
  - testID `pairing-owner-only`
  - `className` `text-center text-sm font-normal leading-body text-muted`
  - texto `t('pairing.errorForbiddenClaim')`: es «Solo el dueño puede vincular
    un collar.», en «Only the owner can pair a collar.»

  El héroe (`pairing-hero-group` con `pairing-title`) se pinta igual que para
  el dueño. La clave ya existe en el catálogo: no hay copy nuevo y no hay gate
  G1.
  - Ancla, en `src/screens/pairing/index.tsx`:
    - `grep -cF "const isOwner = selectedPet?.myRole === 'owner';"` = 1
    - `grep -cF 'testID="pairing-owner-only"'` = 1
    - `grep -cF 'testID="pairing-submit"'` = 1 (se envuelve, no se duplica)
    - `grep -cF "t('pairing.errorForbiddenClaim')"` = 2 (el mensaje del 403
      que ya existe y la nota)
    - `grep -cF "{phase === 'idle' && selectedPet?.device === null ? ("` = 2
      (sin cambio: la condición del bloque no se toca, la decisión va dentro)
  - Ancla, enmienda de la tabla de copy:
    - `src/__tests__/ui-copy-table.ts`: `R10_PAIRING` gana una segunda fila
      `{ file: 'src/screens/pairing/index.tsx', key: 'pairing.errorForbiddenClaim' }, // #216 R6`,
      justo debajo de la que ya existe. Tras la enmienda,
      `grep -cF "key: 'pairing.errorForbiddenClaim'" src/__tests__/ui-copy-table.ts` = 2.
    - `src/__tests__/ui-language.test.ts`: en el `it` del
      `describe('#65 R10: el emparejado del collar resuelve su copy por clave')`,
      la longitud pasa de `42 + 2 + 1 + 4 - 1 + 1` a
      `42 + 2 + 1 + 4 - 1 + 1 + 1`, y el comentario de esa línea gana
      `; +1 #216 R6: la nota de solo lectura`.
    - El nombre del `it` gana ` (enmendado por #216 R6)`.
  - Test: `describe('#216 R6: el formulario de vincular es solo del dueño')`
    en `src/screens/pairing/index.test.tsx`, con el `beforeEach` del
    `describe('#203 R6: botón de desvincular')` salvo la línea de
    `mockListPets`, que pasa a cada fila.
    - `it.each` con cuatro filas, `[role, formVisible]`: `['owner', true]`,
      `['family', false]`, `['walker', false]`, `['vet', false]`.
    - `listPets` devuelve `[makePet({ myRole: role })]` (sin collar).
    - Cada fila espera `findByTestId('pairing-title')`. Si `formVisible`, espera
      `findByTestId('activation-code-input')`. Si no, espera
      `findByTestId('pairing-owner-only')`.
    - Con `formVisible`, los seis testID del formulario existen y
      `pairing-owner-only` es `null`.
    - Sin él, los seis son `null`, `pairing-owner-only` tiene el texto exacto
      «Solo el dueño puede vincular un collar.» y su `className` es exactamente
      `text-center text-sm font-normal leading-body text-muted`.

- **R7**: WHILE la pantalla Vincular collar está en `phase === 'idle'` con una
  mascota seleccionada con collar THE SYSTEM SHALL pintar `device-unpair` y
  `device-unpair-spacer` solo si esa mascota es del dueño. Con un no dueño,
  `device-title` y `device-status-card` siguen pintándose.
  - Ancla, en `src/screens/pairing/index.tsx`:
    - `grep -cF "isOwner"` = 3 (la declaración, el formulario de R6 y el
      bloque de desvincular)
    - `grep -cF 'testID="device-unpair"'` = 1
    - `grep -cF 'testID="device-unpair-spacer"'` = 1
  - Test: `describe('#216 R7: desvincular es solo del dueño')` en
    `src/screens/pairing/index.test.tsx`, con el `beforeEach` del
    `describe('#203 R6: botón de desvincular')` salvo la línea de
    `mockListPets`, que pasa a cada fila.
    - `it.each` con cuatro filas, `[role, unpairVisible]`: `['owner', true]`,
      `['family', false]`, `['walker', false]`, `['vet', false]`.
    - `listPets` devuelve `[makePet({ myRole: role, device: makeDevice() })]`.
    - Cada fila espera `findByTestId('device-status-card')` y comprueba que
      `device-title` existe.
    - `device-unpair` y `device-unpair-spacer` existen si `unpairVisible` y
      son `null` si no.

## Fuera de alcance

Cada viñeta trae su evidencia en el árbol de `origin/dev` (4c0c99ac). Los
símbolos se anclan por contenido.

- **Subir documentos.** Ya está cubierto.
  - `src/screens/docs/index.tsx` declara
    `const isOwner = pet.data?.kind === 'ok' && pet.data.pet.myRole === 'owner';`.
  - La acción del vacío lleva `action={isOwner ? { label: t('docs.upload'), onPress: pickDocument } : undefined}`.
  - El botón de subir con documentos va bajo `{isOwner && docs.data?.kind === 'ok' && docs.data.docs.length > 0 ? (`.
  - Lo prueban `describe('#158 R3: el owner ve la acción de subir')` y
    `describe('#158 R4: family, walker y vet no ven la acción')` de
    `src/screens/docs/index.test.tsx`.
  - El tile `quick-action-documents` de Inicio y `documents-link` de Perfil
    llevan a esa lista, que es de lectura para todos. Se quedan.
- **Vincular desde el Mapa.** Ya está cubierto: `src/screens/map/index.tsx`
  calcula `canPairCollar` con `detail.data.pet.myRole === 'owner' &&` y su
  vacío lleva
  `action={canPairCollar ? { label: t('home.pairCollar'), onPress: () => router.push('/pairing') } : undefined}`.
- **Vacunas.** Ya está cubierto.
  - `src/screens/health/index.tsx` envuelve `vaccines-add` y
    `vaccines-empty-card` en `selectedPet?.myRole === 'owner'`.
  - `vaccine-reminder-notice-action` (que lleva a `/add-reminder`) solo aparece
    después de dar de alta una vacuna, y eso ya es solo del dueño.
- **El enlace `pairing-link` de Perfil** (`src/screens/profile/index.tsx`) no
  se oculta.
  - Lleva a Vincular collar, que con R6 y R7 ya no ofrece ninguna acción a un
    no dueño. Para un no dueño con collar, ahí ve el estado del collar.
  - Además, Perfil es de #214 (miembros), que lo edita en paralelo.
- **Alta de mascota.** `src/screens/add-pet/index.tsx` manda a `/pairing` con
  `router.replace('/pairing')` tras crear la mascota, y quien la crea es su
  dueño.
- **La pantalla Agregar recordatorio** (`src/screens/add-reminder/`) no
  comprueba el rol. Con R2 y R4 ningún enlace de la app lleva ahí a un no
  dueño. Un deep link que llegue igual choca con el 403 del backend, que es la
  red de seguridad.
- **Los enlaces de lectura a Peso.** `quick-action-weight` de Inicio y
  `weight-log-link` de Salud se quedan: un no dueño puede ver la gráfica y el
  historial (R1).
- **El texto del vacío de Recordatorios** (`reminders.emptyBody`) no cambia
  para el no dueño. Cambiarlo sería copy nuevo, y la carta pide copy nuevo
  solo si es imprescindible.
- **El manejo del 403.** Ni `pairing.errorForbiddenClaim` como error del claim,
  ni los mensajes de borrado ni el alta de peso cambian. Quedan como red de
  seguridad.
- **El selector de mascota de Vincular collar.** Mientras se vincula
  (`isLinking`), la vista no pinta `PetSwitcher` ni para el dueño
  (`pets.data.pets.length > 0 && !isLinking ? (`). Con R6, `isLinking` no
  cambia: un no dueño sin collar ve la misma vista sin selector, con la nota
  en lugar del formulario. El avatar `PairingPetAvatar` de la cabecera tampoco
  cambia: no es una acción.
- **Backend.** No se toca. El rol ya llega en `myRole` de `GET /pets` y de
  `GET /pets/:id`.

## Aprobación

- [x] Aprobado por humano (firma delegada del leader, mandato 2026-10-23 ampliado 2026-10-26; fecha: 2026-10-27) ← gate obligatorio antes de implementar
- [ ] Smoke de #216 en dev build por el humano (fecha: ____): con una cuenta
      dueña y otra `family` de la misma mascota (la family se une con el flujo
      de #214), la family no ve el formulario de Peso, el tile Recordatorio, el
      enlace Vincular collar de Inicio, Nuevo ni los botones de borrar en
      Recordatorios. En Vincular collar ve la nota y no ve Desvincular. La
      cuenta dueña lo sigue viendo todo. Va en el lote G4 de
      `progress/smoke_mejoras-producto.md`. No bloquea tareas; bloquea `done`.
