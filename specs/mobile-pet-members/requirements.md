---
feature: "mobile-pet-members"
status: approved     # draft | approved
tags: [mobile, spec, pet-members, invites, expo-router, heroui-native]
---

# Requisitos — [[mobile-pet-members]] (#214)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, la tabla de copy, la de enmiendas
> de candados y las anclas; [[tasks]] para el orden test-primero.
>
> Todas las rutas de este documento son relativas a `mobile-pet-tracker/`
> salvo que empiecen por `specs/`, `docs/` o `backend-pet-tracker/`.
> Contrato de backend: feature #211 (ya en `dev`), resumido en design.md §1.
> Artboards: `specs/mobile-pet-members/canvas/*.dc.html` (G1 aprobado sobre el
> canvas v140 el 2026-10-26 a las 22:47 UTC; los nueve ficheros coinciden por
> sha256 con la copia local v140 `1793036268-d302`, ver design.md §2).
>
> Orden de merge: #214 va **detrás de #218** (`mobile-sheet-surface`). La rama de
> #214 empieza con el Paso 0 de tasks.md (merge de `dev` con #218 dentro y
> re-medida de las anclas de design.md §7). Las recetas de sheet de R11 y R17
> son las que #218 deja en `src/screens/pairing/index.tsx`.
>
> Regla de copy: todo texto visible sale del catálogo `src/i18n/catalog.ts`
> por `t('<clave>'…)` (`useTranslate()` de `src/providers/language-provider.tsx`).
> Las claves y sus literales es/en exactos están en design.md §5. Un requisito
> que cita «X» en español exige el literal es-MX de su clave; los tests corren
> en es-MX salvo que el requisito diga en-US.

## Datos y navegación

- **R1 (cliente HTTP)**: THE SYSTEM SHALL exponer en `src/api/pet-members.ts`
  seis funciones con la firma
  `(baseUrl: string | undefined, token: string, …args, fetchFn: typeof fetch = fetch)`,
  construidas sobre `getJson`/`postJson`/`deleteJson`/`readJson` de
  `src/api/http.ts`, que devuelven uniones `kind` y nunca lanzan:
  - `listPetMembers(baseUrl, token, petId)` → `GET /pets/:petId/members`:
    200 con array → `{ kind: 'ok', members: PetMember[] }`; 401 → `unauthorized`;
    cualquier otro status o cuerpo no-array → `error`; fallo de red →
    `{ kind: 'unreachable', message }`; `baseUrl` vacío → `missing-config`.
  - `listPetInvites(baseUrl, token, petId)` → `GET /pets/:petId/invites`:
    200 con array → `{ kind: 'ok', invites: PetInvite[] }`; resto igual que arriba.
  - `createPetInvite(baseUrl, token, petId)` → `POST /pets/:petId/invites` con
    cuerpo `{}`: 201 → `{ kind: 'ok', invite: CreatedPetInvite }`; 409 con
    `code: 'PET_INVITES_LIMIT'` → `invites-limit`; 409 con
    `code: 'PET_MEMBERS_LIMIT'` → `members-limit`; 401 → `unauthorized`;
    cualquier otro status (incluido un 409 con otro `code` o sin cuerpo) → `error`;
    red → `unreachable`; sin `baseUrl` → `missing-config`.
  - `revokePetInvite(baseUrl, token, petId, inviteId)` →
    `DELETE /pets/:petId/invites/:inviteId`: 204 → `ok`; 404 → `not-found`;
    401 → `unauthorized`; resto → `error`; red → `unreachable`; sin `baseUrl` →
    `missing-config`.
  - `removePetMember(baseUrl, token, petId, userId)` →
    `DELETE /pets/:petId/members/:userId`: 204 → `ok`; 401 → `unauthorized`;
    403, 404 y 409 → `rejected`; resto → `error`; red → `unreachable`; sin
    `baseUrl` → `missing-config`.
  - `acceptInvite(baseUrl, token, code)` → `POST /invites/accept` con cuerpo
    `{ code }`: 201 con `petId` string → `{ kind: 'ok', petId }`; 404 y 400 →
    `not-acceptable` (sin distinguir entre ambos); 409 → `already-member`;
    429 → `rate-limited`; 401 → `unauthorized`; resto (incluido un 201 sin
    `petId`) → `error`; red → `unreachable`; sin `baseUrl` → `missing-config`.

  Tipos exportados del mismo fichero: `PetMember { userId, firstName, lastName, role, joinedAt }`,
  `PetInvite { id, role, createdAt, expiresAt }`,
  `CreatedPetInvite { id, code, role, createdAt, expiresAt }` (role:
  `'owner' | 'family' | 'walker' | 'vet'` en `PetMember`, `string` en las invitaciones).
  Test: `src/api/__tests__/pet-members.test.ts`, un `it` por rama de cada
  función, cada uno empezando por `R1:` y nombrando función y rama
  (p. ej. `'R1: createPetInvite 409 PET_MEMBERS_LIMIT da members-limit'`), más
  `it('R1: ninguna función toca fetch sin baseUrl', …)` y
  `it('R1: cada función llama al método y la ruta del contrato', …)`.

- **R2 (claves de query)**: THE SYSTEM SHALL añadir a `src/api/query-keys.ts`
  `memberKeys = { list: (petId: string) => ['pet-members', petId] as const }` e
  `inviteKeys = { list: (petId: string) => ['pet-invites', petId] as const }`;
  ninguna empieza por `'pets'`, para que invalidar o borrar `petKeys.*` no las
  arrastre ni viceversa.
  Test: `src/api/__tests__/pet-members.test.ts`,
  `it('R2: memberKeys e inviteKeys no comparten prefijo con petKeys', …)`, que
  aserta los dos arrays exactos y que su primer elemento difiere de
  `petKeys.list()[0]`.

- **R3 (rutas)**: THE SYSTEM SHALL añadir tres rutas delgadas y registrarlas como
  protegidas:
  - `src/app/pets/[petId]/members.tsx` →
    `const { petId } = useLocalSearchParams<{ petId: string }>(); return <PetMembersScreen petId={petId} />;`
    (`src/screens/pet-members/index.tsx`, export default `PetMembersScreen`);
  - `src/app/pets/[petId]/invite.tsx` → `<PetInviteScreen />`
    (`src/screens/pet-invite/index.tsx`, export default `PetInviteScreen`, que lee
    sus parámetros con `useLocalSearchParams` dentro de la pantalla);
  - `src/app/join-pet.tsx` → `<JoinPetScreen />`
    (`src/screens/join-pet/index.tsx`, export default `JoinPetScreen`).

  En `src/app/_layout.tsx`, dentro de `Stack.Protected guard={status === 'authenticated'}`,
  tres `<Stack.Screen name="…" options={{ headerShown: false }} />` en este orden
  — `pets/[petId]/members`, `pets/[petId]/invite`, `join-pet` — **justo antes
  de** `<Stack.Screen name="edit-profile" …>`. Sobre la base `8b4cb1bd` eso las
  deja entre `meals-history` y `edit-profile`; si #208 entra antes, su
  `pets/[petId]/vaccines/new` sigue justo tras `meals-history` y las tres de
  #214 van detrás de ella; si #209 entra antes, su `nutrition-profile` sigue
  justo tras `edit-profile`. Ninguna aserción de #214 fija un índice absoluto.
  Test: `src/app/__tests__/layout.test.tsx`,
  `it('R3: registra members, invite y join-pet justo antes de edit-profile sin cabecera nativa', …)`,
  con el mismo arnés que `'#194 R4: edit-profile es la última pantalla protegida'`
  (grupo `Children.toArray(stack?.children)[4]`, `names` = los `props.name` de
  sus hijos): aserta
  `names.slice(names.indexOf('edit-profile') - 3, names.indexOf('edit-profile'))`
  `toEqual(['pets/[petId]/members', 'pets/[petId]/invite', 'join-pet'])` y que
  cada uno de esos tres hijos tiene `options` `toEqual({ headerShown: false })`.
  Que `edit-profile` sea el último lo sigue asertando el `it` `#194 R4` con
  `.at(-1)`, que #214 no toca. Más las enmiendas de design.md §7.1 (filas
  `layout.test.tsx` y `detail-stack.guard.test.tsx`); y
  `src/app/__tests__/detail-stack.guard.test.tsx`: las tres hrefs nuevas
  `'/pets/pet-1/members', '/pets/pet-1/invite', '/join-pet', // #214 R3` en una
  línea propia justo antes de `'/edit-profile', // #194 R4` en la tabla del `it.each`
  `'#194 R4: cierra sesión en %s, aterriza en welcome y no reabre el detalle'`,
  cuyo título pasa a terminar en `(enmendado por #214 R3)`.

## Perfil

- **R4 (tarjeta Familia)**: WHILE Perfil tiene mascota cargada (`pet !== null`)
  THE SYSTEM SHALL renderizar en `profile-links` una tercera fila
  `profile-links-row-2` (className `flex-row gap-2`) con un único hijo, el
  Pressable `members-link`, que es una instancia de un componente local nuevo
  `ProfileWideTile` de `src/screens/profile/index.tsx` con las props
  `{ testID, slot, icon, label, subtitle, color, onPress }` (`slot: CategorySlot`,
  `icon: ReactNode`, `subtitle: string | null`, `color: string`):
  - Pressable con `testID={testID}`, `accessibilityRole="button"`,
    `hitSlop={TOUCH_SLOP}`, `style={CONTINUOUS_CORNER}` y
    `` className={`flex-row items-center gap-2.5 rounded-tile p-3 ${CATEGORY_SLOTS[slot].surface}`} ``
    (#64 R9 deja las clases de categoría como literal solo en
    `src/utils/category-palette.ts`: el fichero de Perfil no escribe
    `bg-category-rose` ni `text-category-rose-strong`; para `slot="rose"` la
    clase resuelta es `bg-category-rose`);
  - hijos en orden: `` `${testID}-icon` `` (View con `accessibilityElementsHidden`
    e `importantForAccessibility="no-hide-descendants"` que envuelve `icon`),
    `` `${testID}-text` `` (View `flex-1 gap-0.5`) con `` `${testID}-label` ``
    (`` className={`text-sm font-extrabold ${CATEGORY_SLOTS[slot].ink}`} ``) y,
    solo si `subtitle !== null`, `` `${testID}-subtitle` ``
    (`` className={`text-xs font-semibold ${CATEGORY_SLOTS[slot].ink}`} ``), y
    por último `` `${testID}-chevron` `` (View oculta a accesibilidad como la del
    icono, con `<ChevronRight size={18} strokeWidth={2.4} color={color} />`);
  - `members-link` es
    `<ProfileWideTile testID="members-link" slot="rose" icon={<Users size={22} strokeWidth={2.2} color={rose} />} label={t('profile.membersLink')} subtitle={membersSummary} color={rose} onPress={() => router.push(`/pets/${pet.id}/members` as Href)} />`,
    con `membersSummary` el texto de R5 o `null`, y `rose` el color
    `'category-rose-strong'` añadido a la llamada a `useThemeColors` existente,
    que pasa de
    `const [blue, green, amber, violet, accentStrong, accentForeground] = useThemeColors(['category-blue-strong', 'category-green-strong', 'category-amber-strong', 'category-violet-strong', 'accent-strong', 'accent-foreground']);`
    a
    `const [blue, green, amber, violet, rose, accentStrong, accentForeground] = useThemeColors(['category-blue-strong', 'category-green-strong', 'category-amber-strong', 'category-violet-strong', 'category-rose-strong', 'accent-strong', 'accent-foreground']);`.

  La línea de import de `reicon-react-native` de Perfil pasa de
  `import { Bell, Camera, FileText, Map as MapIcon, Plus, Wifi } from 'reicon-react-native';`
  a, literal y en este orden,
  `import { Bell, Camera, ChevronRight, FileText, Key, Map as MapIcon, Plus, Users, Wifi } from 'reicon-react-native';`
  (R4 añade `ChevronRight` y `Users`; R6, `Key`). Perfil importa además
  `import { listPetMembers } from '../../api/pet-members';` y suma `memberKeys`
  a su import de `../../api/query-keys`. Ningún comentario nuevo de
  `src/screens/profile/index.tsx` cita `#214` (ver R24).

  WHILE Perfil no tiene mascota THE SYSTEM SHALL no renderizar `members-link`.
  Test: `src/screens/profile/index.test.tsx`,
  `it('R4: con mascota añade la fila de Familia a ancho completo y navega a members', …)`
  (aserta que `profile-links-row-2` tiene un solo hijo, `members-link`, que
  `members-link` tiene la className resuelta
  `` `flex-row items-center gap-2.5 rounded-tile p-3 ${CATEGORY_SLOTS.rose.surface}` ``,
  que `members-link-label` tiene `` `text-sm font-extrabold ${CATEGORY_SLOTS.rose.ink}` ``,
  y que al pulsar se llama a `router.push('/pets/pet-1/members')`; las clases se
  escriben con `CATEGORY_SLOTS` importado de `../../utils/category-palette`,
  nunca como literal) y `it('R4: sin mascota no hay tarjeta de Familia', …)`.

- **R5 (subtítulo de Familia)**: WHEN la query `memberKeys.list(pet.id)` de
  Perfil (`listPetMembers`, `enabled` solo con `pet`) resuelve `ok` con
  `members.length = n` THE SYSTEM SHALL mostrar en `members-link-subtitle`, con
  `others = max(n - 1, 0)`:
  - `others = 0` → `t('profile.membersSummaryAlone', { petName })` («Solo tú cuidas a Rocky»);
  - `others = 1` → `t('profile.membersSummaryOne', { petName })` («Tú y 1 persona más cuidan a Rocky»);
  - `others ≥ 2` → `t('profile.membersSummaryMany', { count: others, petName })` («Tú y 2 personas más cuidan a Rocky»).

  WHILE esa query está pendiente o resolvió un `kind` distinto de `ok` THE
  SYSTEM SHALL no renderizar `members-link-subtitle` (la tarjeta sigue). Un
  `unauthorized` de esta query no llama a `signOut()`.
  Test: `src/screens/profile/index.test.tsx`, un `it` por rama:
  `'R5: con un solo miembro dice Solo tú cuidas a Rocky'`,
  `'R5: con dos miembros usa el singular'`,
  `'R5: con tres miembros dice Tú y 2 personas más cuidan a Rocky'`,
  `'R5: oculta el subtítulo mientras carga'`,
  `'R5: oculta el subtítulo si la lista falla'` y
  `'R5: en inglés dice You and 2 more people care for Rocky'`.

- **R6 (entrada «Unirme con código» en Perfil)**: THE SYSTEM SHALL renderizar
  siempre, con o sin mascota, como última fila de `profile-links` una fila de un
  hijo — `profile-links-row-3` con mascota, `profile-links-row-1` sin ella — con
  el `ProfileWideTile` (R4) `join-pet-link` en el hueco ámbar:
  `<ProfileWideTile testID="join-pet-link" slot="amber" icon={<Key size={22} strokeWidth={2.2} color={amber} />} label={t('joinPet.title')} subtitle={t('joinPet.invitedPrompt')} color={amber} onPress={() => router.push('/join-pet' as Href)} />`,
  con `amber` el color `'category-amber-strong'` que Perfil ya pide a
  `useThemeColors`. Label `join-pet-link-label` = «Unirme con código»; subtítulo
  `join-pet-link-subtitle` = «¿Te invitaron a cuidar una mascota?»; clases
  resueltas `` `… ${CATEGORY_SLOTS.amber.surface}` `` para el Pressable y
  `` `${CATEGORY_SLOTS.amber.ink}` `` para los dos textos (ninguna escrita como
  literal en Perfil, #64 R9). La misma instancia (constante local `joinPetLink`)
  se usa en las dos ramas. La me-card y el resto de Perfil no cambian.
  Test: `src/screens/profile/index.test.tsx`,
  `it('R6: con mascota la cuarta fila es Unirme con código y navega a join-pet', …)`
  (aserta que `profile-links-row-3` tiene un solo hijo, `join-pet-link`, con la
  className `` `flex-row items-center gap-2.5 rounded-tile p-3 ${CATEGORY_SLOTS.amber.surface}` ``,
  que `join-pet-link-subtitle` tiene `` `text-xs font-semibold ${CATEGORY_SLOTS.amber.ink}` ``
  y que al pulsar se llama a `router.push('/join-pet')`) y
  `it('R6: sin mascota la segunda fila es Unirme con código', …)` (aserta
  `profile-links-row-1` con `join-pet-link` como único hijo).

## Inicio sin mascotas

- **R7 (entrada «Unirme con código» en Inicio)**: WHILE Inicio muestra
  `home-no-pets-screen` THE SYSTEM SHALL renderizar, como segundo hijo del
  contenedor y después de `home-empty`, la View `home-join-pet`
  (className `w-full items-center gap-3.5 pt-5`) con, en orden:
  - `home-join-pet-prompt` = `t('joinPet.invitedPrompt')`
    (className `text-sm font-semibold text-muted`);
  - el `Button` de HeroUI `home-join-pet-button`, `variant="outline"`, className
    `w-full h-13.5 rounded-16 border-2 border-lip-gray bg-surface`,
    `style={chunkyLip.neutral}`, con el icono `Key` (size 20, color
    `foreground`, oculto a accesibilidad) y un `Text` interior
    `t('joinPet.title')` («Unirme con código»,
    className `text-base font-extrabold text-foreground`).

  WHEN se pulsa `home-join-pet-button` THE SYSTEM SHALL llamar a
  `router.push('/join-pet')`. `EmptyState` y su `action` no cambian.
  Test: `src/screens/home/index.test.tsx`,
  `it('R7: el vacío ofrece Unirme con código bajo Añadir mascota', …)` y
  `it('R7: Unirme con código navega a join-pet', …)`.

## Pantalla Familia (`PetMembersScreen`)

- **R8 (carga y error)**: THE SYSTEM SHALL cargar en `PetMembersScreen` tres
  queries — `petKeys.detail(petId)` con `getPet`, `memberKeys.list(petId)` con
  `listPetMembers` y `userKeys.me()` con `getMe` — y:
  - WHILE alguna está pendiente: renderizar
    `<Skeleton testID="pet-members-loading" className="h-40 w-full rounded-card" />`
    (`Skeleton` de `heroui-native`) y ningún `member-row-*`;
  - IF alguna resuelve `unauthorized` THEN llamar a `signOut()`;
  - IF alguna resuelve `unreachable` THEN renderizar `pet-members-error` con
    `pet-members-error-text` = `t('common.cannotReachServer')`;
  - IF alguna resuelve `error` o `missing-config` y ninguna `unreachable` THEN
    `pet-members-error-text` = `t('common.somethingWentWrong')`;
  - en los dos casos de error, el botón `pet-members-retry` copia el reintento de
    `src/screens/meal-schedule/index.tsx`: una función local `retryAll()` que
    llama a `refetch()` de cada una de las tres queries cuyo `data?.kind` no es
    `'ok'`, y el botón
    `<Button testID="pet-members-retry" onPress={retryAll}>` con
    `{t('common.retry')}` como único hijo y sin `className`, `style` ni
    `variant` (sin labio: lo exige `#177 R8.4` de
    `src/__tests__/chunky-cta-canvas-fidelity.test.ts`, que veta `chunkyLip` y
    `border-b-` en todo `-retry`).

  Raíz: View `screen-pet-members` con ScrollView (`contentContainerStyle`
  `{ paddingHorizontal: 20, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24, gap: 12, flexGrow: 1 }`);
  cabecera `ScreenHeader testID="pet-members-header" backFallback="/profile"`
  con `title={t('members.titleOf', { petName: pet.name })}` (tamaño por defecto 26)
  y
  `titlePlaceholder={pet === null ? <Skeleton testID="pet-members-header-skeleton" className="h-8 w-36 rounded-xl" /> : undefined}`.
  Test: `src/screens/pet-members/index.test.tsx`,
  `it('R8: muestra el skeleton mientras carga', …)` (las tres queries con
  promesa pendiente: `pet-members-loading` y `pet-members-header-skeleton`
  visibles, ningún `member-row-*`);
  `it.each(['pet', 'members', 'me'] as const)('R8: %s unreachable dice No se pudo conectar con el servidor y Reintentar repite solo esa carga', …)`:
  la query nombrada (`pet` = `getPet`, `members` = `listPetMembers`,
  `me` = `getMe`) resuelve `{ kind: 'unreachable', message: 'x' }` y las otras dos
  `ok`; aserta el texto, pulsa `pet-members-retry` y aserta que el doble de la
  query nombrada tiene 2 llamadas y los otros dos, 1;
  `it.each(['pet', 'members', 'me'] as const)('R8: %s error dice Algo salió mal', …)`
  (misma tabla, `{ kind: 'error' }`);
  `it.each(['pet', 'members', 'me'] as const)('R8: %s unauthorized cierra sesión', …)`
  (misma tabla, `{ kind: 'unauthorized' }`; aserta una llamada a `signOut`);
  `it('R8: el título es Familia de Rocky', …)`.

- **R9 (filas de miembros)**: WHEN las tres queries de R8 son `ok` THE SYSTEM
  SHALL renderizar `pet-members-heading` = `t('members.membersHeading')`
  («Miembros») y la lista `pet-members-list` (`rounded-card bg-surface border border-border px-3.5`)
  con una fila `member-row-<userId>` por miembro en el orden de la API. Cada fila:
  - `member-row-<userId>-avatar`: círculo `size-9.5 rounded-full` con
    `memberInitials(firstName, lastName)` (en `src/utils/pet-members.ts`: primera
    letra de `firstName.trim()` más primera letra de `lastName.trim()`, en
    mayúsculas; `Ana García` → `AG`; apellido vacío → solo la inicial del nombre).
    Hueco: la fila de `me.id` usa `CATEGORY_SLOTS.neutral`; las demás, por orden
    de aparición entre las no-yo, `blue`, `violet`, `amber`, `green`, `rose` y
    vuelta a empezar (constante `MEMBER_AVATAR_SLOTS` del fichero de la pantalla);
  - `member-row-<userId>-name` = `` `${firstName} ${lastName}`.trim() ``;
  - `member-row-<userId>-you` = `t('members.you')` («Tú») solo en la fila de `me.id`;
  - `member-row-<userId>-role`: píldora View
    `` className={`rounded-full px-2 py-0.75 ${CATEGORY_SLOTS[member.role === 'owner' ? 'green' : 'rose'].surface}`} ``
    con un `Text`
    `` className={`text-xs font-extrabold ${CATEGORY_SLOTS[member.role === 'owner' ? 'green' : 'rose'].ink}`} ``
    cuyo hijo es, literal,
    `{member.role === 'owner' ? t('members.roleOwner') : t('members.roleFamily')}`
    («Dueño» para `owner`; «Familia» para `family`, `walker` y `vet`). Las dos
    llamadas son `t('<clave>'` directas: `checkUses` de
    `src/__tests__/ui-language.test.ts` solo ve llamadas directas, así que no
    vale una clave calculada (`t(roleKey)`) ni un mapa de claves.

  THE SYSTEM SHALL no mostrar en ninguna parte de la pantalla un correo
  electrónico: la API no lo envía y la pantalla no lo pide a otra fuente
  (`getMe` se usa solo por `id` y `firstName`).
  Test: `src/screens/pet-members/index.test.tsx`,
  `it('R9: pinta iniciales, nombre, Tú y la píldora de rol en el orden de la API', …)`,
  `it('R9: walker y vet se muestran como Familia', …)`,
  `it('R9: ningún texto de la pantalla contiene el correo de getMe', …)` (el doble
  de `getMe` devuelve `email: 'ana@correo.com'`; recorre todos los nodos de
  texto con `includeHiddenElements` y aserta que ninguno contiene `@`);
  `src/utils/__tests__/pet-members.test.ts`,
  `it('R9: memberInitials toma nombre y apellido en mayúsculas', …)` y
  `it('R9: memberInitials con apellido vacío deja una sola inicial', …)`.

## Vista de dueño

- **R10 (vista de dueño)**: WHILE `pet.myRole === 'owner'` THE SYSTEM SHALL
  renderizar `pet-members-intro` = `t('members.ownerIntro', { petName })` y, en
  cada fila con `userId !== me.id` y `role !== 'owner'`, el botón
  `member-row-<userId>-remove` = `t('members.remove')` («Quitar»,
  `h-11 rounded-14 px-3 ${CATEGORY_SLOTS.rose.surface}`, texto
  `text-13 font-extrabold text-danger`) con
  `accessibilityLabel={t('members.removeA11y', { name })}` («Quitar a Luis Ortega»).
  En las filas con «Quitar» la píldora de rol va bajo el nombre; en las demás,
  a la derecha de la fila.
  WHILE `pet.myRole !== 'owner'` THE SYSTEM SHALL no renderizar ningún
  `member-row-*-remove`, `pet-invites-*`, `pet-members-code-note` ni
  `pet-members-invite-cta`.
  Test: `src/screens/pet-members/index.test.tsx`,
  `it('R10: el dueño ve Quitar en los demás y no en sí mismo', …)`,
  `it('R10: family no ve Quitar, invitaciones ni CTA', …)`,
  `it('R10: walker tampoco ve acciones de dueño', …)`.

- **R11 (quitar miembro)**: WHEN el dueño pulsa `member-row-<userId>-remove` THE
  SYSTEM SHALL abrir el sheet de quitar, que sigue la receta que #218 deja en
  `src/screens/pairing/index.tsx` (design.md §3, «Sheets»):
  - `BottomSheet` de `@expo/ui/community/bottom-sheet` con
    `index={removing ? 0 : -1}`, `enablePanDownToClose`,
    `onClose={() => setRemoving(null)}`, `snapPoints={['50%', '100%']}` y
    `backgroundStyle={{ backgroundColor: surface }}`, donde `surface` sale de
    `const [surface] = useThemeColors(['surface']);` (una sola llamada para los
    dos sheets de la pantalla);
  - dentro, `BottomSheetView` y la View `member-remove-sheet` con className
    `items-center gap-3 bg-surface px-5 pb-9 pt-3`, que contiene, en orden:
    `member-remove-sheet-avatar` (círculo `size-14 items-center justify-center rounded-full`
    con el `surface` del hueco de la fila y las iniciales en `text-xl font-black`
    con su `ink`), `member-remove-sheet-title` = `t('members.removeTitle', { name })`
    («¿Quitar a Luis Ortega?», `accessibilityRole="header"`,
    `text-center text-xl font-black text-foreground`),
    `member-remove-sheet-body` = `t('members.removeBody', { firstName, petName })`
    (`max-w-80 text-center text-sm leading-note text-muted`),
    `member-remove-sheet-confirm` (Button `w-full h-13.5 rounded-16 bg-danger`,
    `style={chunkyLip.danger}`, `isDisabled={busy}`, con un `Text`
    `text-base font-extrabold text-danger-foreground` =
    `t('members.removeConfirm', { firstName })` «Quitar a Luis») y
    `member-remove-sheet-cancel` (Button `variant="outline"`,
    `w-full h-13.5 rounded-16 border-2 border-lip-gray bg-surface`,
    `style={chunkyLip.neutral}`, con un `Text` `text-base font-extrabold text-foreground`
    = `t('members.cancel')` «Cancelar»).
  - WHEN se pulsa cancelar THE SYSTEM SHALL cerrar el sheet (`index` -1) sin
    llamar a `removePetMember`.
  - WHEN se pulsa confirmar THE SYSTEM SHALL llamar una sola vez a
    `removePetMember(baseUrl, token, petId, userId)` (confirmar queda deshabilitado
    mientras la llamada está en vuelo) y:
    - `ok` → cerrar el sheet e `invalidateQueries({ queryKey: memberKeys.list(petId) })`;
    - `rejected` → cerrar el sheet, invalidar la misma query y mostrar
      `pet-members-action-error` (`accessibilityRole="alert"`, `text-13 font-bold text-danger`)
      = `t('common.somethingWentWrong')`;
    - `unreachable` → dejar el sheet abierto con `pet-members-action-error`
      = `t('common.cannotReachServer')`;
    - `error`/`missing-config` → dejar el sheet abierto con `t('common.somethingWentWrong')`;
    - `unauthorized` → `signOut()`.
  Test: `src/screens/pet-members/index.test.tsx`:
  `'R11: el sheet nombra a la persona y a su mascota'`,
  `'R11: Cancelar cierra sin llamar a la API'`,
  `'R11: confirmar quita e invalida la lista'`, `'R11: rejected invalida y avisa'`,
  `'R11: unreachable deja el sheet abierto'`, `'R11: error deja el sheet abierto'`,
  `'R11: unauthorized cierra sesión'`, `'R11: doble toque llama una sola vez'`.

- **R12 (invitaciones pendientes y revocar)**: WHILE `pet.myRole === 'owner'`
  THE SYSTEM SHALL cargar `inviteKeys.list(petId)` con `listPetInvites`
  (`enabled` solo para el dueño) y, WHEN resuelve `ok` con al menos una
  invitación, renderizar `pet-invites-heading` = `t('members.invitesHeading')`
  («Invitaciones pendientes») y `pet-invites-list` con una fila `invite-row-<id>`
  por invitación en el orden de la API, cada una con:
  - `invite-row-<id>-icon`: cuadro `size-9.5 rounded-10` en el hueco `amber` con
    `Key`, oculto a accesibilidad;
  - `invite-row-<id>-created` = `t('members.inviteCreated', { date })`, con
    `date` = `inviteDateParts(createdAt, locale).date` («Invitación · creada el 6 oct»);
  - `invite-row-<id>-expires` = `t('members.inviteExpires', inviteDateParts(expiresAt, locale))`
    («Vence el 9 oct a las 14:00»);
  - `invite-row-<id>-revoke` = `t('members.revoke')` («Revocar», mismo estilo que
    «Quitar»), con `accessibilityLabel={t('members.revokeA11y', { date })}`.

  `inviteDateParts(iso, locale)` (en `src/utils/pet-members.ts`) devuelve
  `{ date: d.toLocaleDateString(locale, { day: 'numeric', month: 'short' }), time: d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }) }`
  con `d = new Date(iso)`, en la zona horaria del dispositivo; `locale` sale de
  `useLocale()`.
  IF la query de invitaciones está pendiente, no es `ok` o devuelve `[]` THEN THE
  SYSTEM SHALL no renderizar `pet-invites-heading` ni `pet-invites-list`.
  WHEN se pulsa `invite-row-<id>-revoke` THE SYSTEM SHALL llamar una vez a
  `revokePetInvite(baseUrl, token, petId, id)` (botón deshabilitado en vuelo, sin
  confirmación) y: `ok` o `not-found` → `invalidateQueries({ queryKey: inviteKeys.list(petId) })`;
  `unreachable` → `pet-members-action-error` = `t('common.cannotReachServer')`;
  `error`/`missing-config` → `t('common.somethingWentWrong')`;
  `unauthorized` → `signOut()`. Ninguna fila muestra el código de la invitación.
  Test: `src/screens/pet-members/index.test.tsx`,
  `'R12: lista las invitaciones con fecha de creación y vencimiento'` (instantes
  `new Date(2026, 9, 6, 9, 5).toISOString()` y `new Date(2026, 9, 9, 14, 0).toISOString()`),
  `'R12: sin invitaciones no hay sección'`, `'R12: si la lista falla no hay sección'`,
  `'R12: revocar llama a la API e invalida la lista'`,
  `'R12: revocar not-found también invalida'`, `'R12: revocar unreachable avisa'`,
  `'R12: family no pide invitaciones'` (aserta que `listPetInvites` no se llama);
  `src/utils/__tests__/pet-members.test.ts`,
  `it('R12: inviteDateParts cruza mes y año', …)` con la tabla
  `[new Date(2026, 9, 6, 9, 5), '6 oct', '09:05']`,
  `[new Date(2026, 11, 30, 23, 59), '30 dic', '23:59']`,
  `[new Date(2027, 0, 2, 0, 5), '2 ene', '00:05']` en `es-MX`, e
  `it('R12: inviteDateParts en en-US da Oct 9 y 14:00', …)`.

- **R13 (crear invitación)**: WHILE `pet.myRole === 'owner'` THE SYSTEM SHALL
  renderizar `pet-members-code-note` (nota `flex-row items-center gap-2.5 rounded-tile bg-default px-3.5 py-3`,
  icono `InfoCircle`, texto `text-13 font-semibold leading-note text-foreground`)
  = `t('members.codeNote')` y, al pie (tras un espaciador `{ flexGrow: 1 }`), el
  `Button` `pet-members-invite-cta` (className `w-full h-14 rounded-16 bg-accent`,
  `style={chunkyLip.primary}`, icono `Plus` y `Text` `t('members.inviteCta')`
  «Invitar a alguien», `text-17 font-extrabold text-accent-foreground`). WHEN se
  pulsa THE SYSTEM SHALL llamar una vez a `createPetInvite(baseUrl, token, petId)`
  (deshabilitado en vuelo) y:
  - `ok` → `invalidateQueries({ queryKey: inviteKeys.list(petId) })` y
    `router.push({ pathname: '/pets/[petId]/invite', params: { petId, petName: pet.name, inviterName: me.firstName, code: invite.code, expiresAt: invite.expiresAt } })`;
  - `invites-limit` → `pet-members-action-error` = `t('members.invitesLimit')`;
  - `members-limit` → `t('members.membersLimit', { petName })`;
  - `unreachable` → `t('common.cannotReachServer')`;
  - `error`/`missing-config` → `t('common.somethingWentWrong')`;
  - `unauthorized` → `signOut()`.

  WHEN se pulsa cualquiera de los cinco botones de acción de la pantalla
  (`member-row-<userId>-remove`, `member-remove-sheet-confirm`,
  `invite-row-<id>-revoke`, `pet-members-invite-cta`, `pet-members-leave`) THE
  SYSTEM SHALL borrar `pet-members-action-error` antes de abrir el sheet o de
  la nueva llamada.
  Test: `src/screens/pet-members/index.test.tsx`:
  `'R13: ok invalida invitaciones y abre invite con sus parámetros'`,
  `'R13: invites-limit avisa del máximo de invitaciones'`,
  `'R13: members-limit avisa del máximo de personas'`, `'R13: unreachable avisa'`,
  `'R13: error avisa'`, `'R13: unauthorized cierra sesión'`,
  `'R13: doble toque crea una sola invitación'`, y
  `it.each([['member-row-user-2-remove'], ['member-remove-sheet-confirm'], ['invite-row-inv-1-revoke'], ['pet-members-invite-cta'], ['pet-members-leave']])('R13: pulsar %s borra el aviso anterior', …)`
  (una fila por botón: cada caso deja primero un `pet-members-action-error`
  visible con una acción que falla —`createPetInvite` `unreachable`—, prepara el
  estado que el botón necesita —dueño para los cuatro primeros, con el sheet de
  quitar abierto para `member-remove-sheet-confirm`; family para
  `pet-members-leave`, donde el aviso previo sale de un confirmar de salir
  `unreachable`—, pulsa el botón y aserta
  `screen.queryByTestId('pet-members-action-error')` `null`; para los tres
  botones que llaman a la API, el doble de esa llamada devuelve en el caso una
  promesa que no se resuelve, de modo que el aviso desaparece por el toque y no
  por la respuesta). Los dobles del fichero usan `userId: 'user-2'` para el
  miembro no dueño (Luis Ortega) e `id: 'inv-1'` para la invitación pendiente.

## Pantalla Invitar (`PetInviteScreen`)

- **R14 (contenido)**: WHEN `PetInviteScreen` recibe los parámetros `petId`,
  `petName`, `inviterName`, `code` y `expiresAt` THE SYSTEM SHALL renderizar, en
  orden dentro de `screen-pet-invite` (ScrollView con el mismo
  `contentContainerStyle` que R8):
  - `ScreenHeader testID="pet-invite-header" size={24} backFallback="/profile"`
    con `title={t('invite.title', { petName })}` («Invitar a cuidar a Rocky»);
  - `pet-invite-intro` = `t('invite.intro', { petName })`;
  - la tarjeta `pet-invite-code-card` (`items-center gap-2.5 rounded-24 bg-surface-secondary px-4 py-6`,
    `accessibilityLabel={t('invite.codeLabel')}`) con `pet-invite-code-label` =
    `t('invite.codeLabel')` («Código de invitación», `text-13 font-extrabold text-accent-strong`),
    `pet-invite-code` = `formatInviteCode(code)` («K7P4Q-2M9XA»,
    `font-mono text-3xl font-black tracking-eyebrow text-foreground`) y
    `pet-invite-expires` = `t('invite.expiresOnce', inviteDateParts(expiresAt, locale))`
    («Vence el 9 oct a las 14:00 · sirve una sola vez», `text-13 font-bold text-muted`);
  - `pet-invite-message-label` = `t('invite.messageLabel')` («Mensaje que se enviará») y
    `pet-invite-message` (`rounded-tile bg-default p-3.5`, `text-sm font-semibold text-foreground`)
    = `shareText`, con
    `shareText = t('invite.shareMessage', { inviterName, petName, code: formatInviteCode(code), ...inviteDateParts(expiresAt, locale) })`;
  - `pet-invite-role-note` = `t('invite.roleNote', { petName })`
    (`text-13 font-semibold text-muted`, icono `Lock`);
  - al pie, `pet-invite-share` y `pet-invite-copy` (R15).

  `formatInviteCode(code)` (en `src/utils/pet-members.ts`) devuelve
  `` `${code.slice(0, 5)}-${code.slice(5)}` `` cuando `code.length === 10` y `code`
  sin cambios en cualquier otro caso.
  IF falta `code` o `expiresAt`, o `new Date(expiresAt)` no es una fecha válida,
  THEN THE SYSTEM SHALL renderizar solo la cabecera y `pet-invite-invalid` =
  `t('common.somethingWentWrong')`, sin `pet-invite-share` ni `pet-invite-copy`.
  Test: `src/screens/pet-invite/index.test.tsx`,
  `it('R14: muestra el código partido, el vencimiento y el mensaje literal', …)`
  (aserta el `shareText` es-MX completo:
  «Ana te invita a cuidar a Rocky en Pet Tracker. Abre la app, toca «Unirme con código» y escribe K7P4Q-2M9XA. Vence el 9 oct a las 14:00.»),
  `it('R14: en inglés el mensaje usa Join with a code', …)`,
  `it('R14: sin código no ofrece compartir', …)`;
  `src/utils/__tests__/pet-members.test.ts`,
  `it('R14: formatInviteCode parte diez caracteres en 5 y 5', …)` y
  `it('R14: formatInviteCode deja igual cualquier otra longitud', …)`.

- **R15 (Compartir y Copiar)**: THE SYSTEM SHALL renderizar `pet-invite-share`
  (Button `w-full h-14 rounded-16 bg-accent`, `chunkyLip.primary`, icono `Share`
  de `reicon-react-native` importado como
  `import { Copy, Lock, Share as ShareIcon } from 'reicon-react-native';` para no
  chocar con `Share` de `react-native`,
  texto `t('invite.share')` «Compartir», `text-17 font-extrabold text-accent-foreground`)
  y debajo `pet-invite-copy` (Button `variant="outline"`,
  `w-full h-13.5 rounded-16 border-2 border-lip-gray bg-surface`,
  `chunkyLip.neutral`, icono `Copy`, texto `pet-invite-copy-label`,
  `text-base font-extrabold text-foreground`).
  - WHEN se pulsa `pet-invite-share` THE SYSTEM SHALL llamar a
    `Share.share({ message: shareText })` de `react-native` una vez por toque; un
    rechazo de la promesa no muestra error ni rompe la pantalla.
  - WHEN se pulsa `pet-invite-copy` THE SYSTEM SHALL llamar a
    `Clipboard.setStringAsync(formatInviteCode(code))` de
    `import * as Clipboard from 'expo-clipboard';` y, cuando
    la promesa resuelve, cambiar `pet-invite-copy-label` de `t('invite.copy')`
    («Copiar código») a `t('invite.copied')` («Código copiado») hasta que la
    pantalla se desmonte; si rechaza, la etiqueta no cambia.
  Test: `src/screens/pet-invite/index.test.tsx`,
  `it('R15: Compartir abre la hoja nativa con el mensaje', …)`,
  `it('R15: un Share rechazado no rompe la pantalla', …)`,
  `it('R15: Copiar código copia el código con guion y confirma', …)`,
  `it('R15: si copiar falla la etiqueta no cambia', …)`.

## Vista de familia y salir

- **R16 (vista de familia)**: WHILE `pet.myRole !== 'owner'` THE SYSTEM SHALL
  renderizar:
  - como `accessory` de la cabecera, `pet-members-pet-avatar`: círculo `size-10`
    oculto a accesibilidad, hueco `amber`, con la inicial en mayúscula de
    `pet.name` (`text-base font-black`);
  - `pet-members-intro` = `t('members.familyIntro', { petName })`;
  - tras la lista, `pet-members-owner-note` (misma nota que `pet-members-code-note`)
    = `t('members.ownerNote', { ownerName, petName })`, donde `ownerName` es el
    nombre completo del primer miembro con `role === 'owner'`; si no hay
    ninguno, la nota no se renderiza;
  - al pie (tras un espaciador `{ flexGrow: 1 }`), `pet-members-leave-hint` =
    `t('members.leaveHint', { petName })` (`text-center text-13 font-semibold text-muted`)
    y el Button `pet-members-leave` (`variant="outline"`,
    `w-full h-13.5 rounded-16 border-2 border-danger bg-surface`,
    `style={chunkyLip.neutral}`, icono `Logout` color `danger`, texto
    `t('members.leave')` «Salir de esta mascota», `text-base font-extrabold text-danger`),
    cuyo `onPress` borra `pet-members-action-error` (R13) y abre el sheet de R17.

  El mismo `ownerName` (o su ausencia) decide el cuerpo del sheet de salir
  (R17).

  WHILE `pet.myRole === 'owner'` THE SYSTEM SHALL no renderizar
  `pet-members-pet-avatar`, `pet-members-owner-note`, `pet-members-leave-hint` ni
  `pet-members-leave`.
  Test: `src/screens/pet-members/index.test.tsx`,
  `it('R16: family ve la nota del dueño y Salir de esta mascota', …)`,
  `it('R16: sin dueño en la lista no hay nota', …)`,
  `it('R16: el dueño no ve Salir', …)`.

- **R17 (salir)**: WHEN se pulsa `pet-members-leave` THE SYSTEM SHALL abrir el
  sheet de salir, con la misma receta que el de R11:
  - `BottomSheet` con `index={leaveOpen ? 0 : -1}`, `enablePanDownToClose`,
    `onClose={() => setLeaveOpen(false)}`, `snapPoints={['50%', '100%']}` y
    `backgroundStyle={{ backgroundColor: surface }}` (el mismo `surface` de R11);
  - dentro, `BottomSheetView` y la View `member-leave-sheet` con className
    `items-center gap-3 bg-surface px-5 pb-9 pt-3`, que contiene, en orden:
    - `member-leave-sheet-title` = `t('members.leaveTitle', { petName })`
      («¿Salir de la familia de Rocky?», `accessibilityRole="header"`,
      `text-center text-xl font-black text-foreground`);
    - `member-leave-sheet-body` (`max-w-80 text-center text-sm leading-note text-muted`):
      con dueño en la lista (el `ownerName` de R16),
      `t('members.leaveBody', { petName, ownerName })` («Dejarás de ver a Rocky y
      de recibir sus avisos. Para volver, Ana García tendrá que invitarte otra
      vez.»); sin ningún miembro `owner` en la lista,
      `t('members.leaveBodyNoOwner', { petName })` («Dejarás de ver a Rocky y de
      recibir sus avisos. Para volver, necesitarás una invitación nueva.»; variante
      **sin artboard**, ver design.md §5.1). Las dos son llamadas `t('<clave>'`
      directas en un ternario;
    - `member-leave-sheet-confirm` (Button `w-full h-13.5 rounded-16 bg-danger`,
      `style={chunkyLip.danger}`, `isDisabled={busy}`, con un `Text`
      `text-base font-extrabold text-danger-foreground` =
      `t('members.leaveConfirm')` «Salir de esta mascota»);
    - `member-leave-sheet-cancel` (Button `variant="outline"`,
      `w-full h-13.5 rounded-16 border-2 border-lip-gray bg-surface`,
      `style={chunkyLip.neutral}`, con un `Text` `text-base font-extrabold text-foreground`
      = `t('members.cancel')` «Cancelar»).

  `members.leave` (el botón de R16) y `members.leaveConfirm` tienen el mismo
  literal es-MX; los tests de R16 y R17 localizan cada botón por `testID`, nunca
  por texto.
  - Cancelar cierra sin llamar a la API.
  - Confirmar llama una vez a `removePetMember(baseUrl, token, petId, me.id)` y:
    - `ok` → `queryClient.removeQueries({ queryKey: petKeys.detail(petId) })`,
      `queryClient.removeQueries({ queryKey: memberKeys.list(petId) })`,
      `clearPet()` (de `useSelectedPet()`),
      `await queryClient.invalidateQueries({ queryKey: petKeys.list() })` y
      `router.dismissTo('/home')`, en ese orden;
    - `unreachable` → sheet abierto y `pet-members-action-error` = `t('common.cannotReachServer')`;
    - `rejected`, `error` o `missing-config` → sheet abierto y `t('common.somethingWentWrong')`;
    - `unauthorized` → `signOut()`.
  Test: `src/screens/pet-members/index.test.tsx`,
  `it('R17: el sheet de salir nombra a la mascota y al dueño', …)` (aserta el
  título y el cuerpo es-MX completos de arriba; en la vista de familia, los
  dobles son `pet.myRole: 'family'`, `getMe` = `user-2` Luis Ortega y la lista
  `[user-1 Ana García owner, user-2 Luis Ortega family]`, con mascota Rocky),
  `it('R17: sin dueño en la lista el cuerpo usa la variante sin nombre', …)`
  (la lista no tiene ningún `owner`; aserta el cuerpo es-MX de
  `members.leaveBodyNoOwner`),
  `it('R17: Cancelar no llama a la API', …)`,
  `it('R17: salir limpia la mascota, invalida la lista y vuelve a Inicio en orden', …)`
  (registra las cinco llamadas en un array y lo compara entero),
  `it('R17: unreachable deja el sheet abierto', …)`,
  `it('R17: rejected deja el sheet abierto', …)`,
  `it('R17: unauthorized cierra sesión', …)`.

## Unirme con código (`JoinPetScreen`)

- **R18 (formulario)**: THE SYSTEM SHALL renderizar `JoinPetScreen` con el
  patrón de `src/screens/pairing/index.tsx`: `KeyboardAvoidingView`
  `testID="screen-join-pet"` `behavior="padding"`, ScrollView con
  `contentContainerStyle` `{ paddingHorizontal: 20, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24, gap: 16, flexGrow: 1 }`,
  `ScreenHeader testID="join-pet-header" backFallback="/home"` sin título, y en orden:
  - `join-pet-hero` (View `h-37.5 w-50 items-center justify-center self-center`,
    oculta a accesibilidad) con un `PingRing` (`testID="join-pet-ring"`,
    `delay={0}`, `className="size-32.5 rounded-full border-3 border-accent"`),
    un círculo `size-30 rounded-full bg-surface-secondary` y `PingoFloat` con la
    `Image` de `pingo-collar.webp` de ancho y alto 104;
  - `join-pet-title` = `t('joinPet.title')` («Unirme con código»,
    `accessibilityRole="header"`, `text-center text-28 font-black tracking-title text-foreground`);
  - `join-pet-note` (nota como `pet-members-code-note`, icono `InfoCircle`) = `t('joinPet.note')`;
  - `join-pet-label` = `t('invite.codeLabel')` («Código de invitación»,
    `text-sm font-extrabold text-foreground`);
  - `join-pet-input`: `TextInput` con `placeholder="XXXXX-XXXXX"`,
    `placeholderTextColor={muted}` (lo exige `#62 R12` de
    `src/__tests__/consistency-classnames.test.ts`: todo `TextInput` con
    placeholder lleva color temático), `maxLength={11}`,
    `autoCapitalize="characters"`, `autoCorrect={false}`,
    `autoComplete="off"`, `accessibilityLabel={t('invite.codeLabel')}`,
    `` className={`h-15 rounded-14 border-2 ${border} bg-default px-4 font-mono text-24 tracking-code text-foreground`} ``
    con `border` = `'border-accent'` en el formulario (R19 y R20 lo cambian), y
    `style={CONTINUOUS_CORNER}`. Los colores de la pantalla salen de una sola
    llamada
    `const [foreground, muted, accentStrong] = useThemeColors(['foreground', 'muted', 'accent-strong']);`
    (`foreground` para el icono `InfoCircle` de la nota, `muted` para el
    placeholder, `accentStrong` para el `CheckCircle` de R20; nunca
    `useThemeColors(['accent'])`, que veta `#61 R4`);
  - `join-pet-hint` = `t('joinPet.hint')` («Son 10 letras y números»,
    `text-13 font-semibold text-muted`);
  - un espaciador `{ flexGrow: 1 }` y el Button `join-pet-submit`
    (`className="w-full h-14 rounded-16 bg-accent"` y `style={chunkyLip.primary}`
    estáticos —sin el ternario `KEEP_OPACITY` de `disabledCtas`—,
    `isDisabled={input.trim() === '' || busy}`, con un `Text`
    `text-17 font-extrabold text-accent-foreground` = `t('joinPet.submit')` «Unirme»).

  WHILE `input.trim()` está vacío o la llamada está en vuelo THE SYSTEM SHALL
  dejar `join-pet-submit` deshabilitado. WHEN se pulsa con texto THE SYSTEM SHALL
  llamar una vez a `acceptInvite(baseUrl, token, input.trim())`; la app no
  quita guiones ni cambia mayúsculas (lo normaliza el backend).
  Test: `src/screens/join-pet/index.test.tsx`,
  `it('R18: el formulario admite 11 caracteres con el placeholder del artboard', …)`,
  `it('R18: Unirme está deshabilitado sin texto', …)`,
  `it('R18: envía el código recortado una sola vez', …)`.

- **R19 (errores)**: IF `acceptInvite` resuelve un `kind` distinto de `ok` y de
  `already-member` THEN THE SYSTEM SHALL mostrar `join-pet-error`
  (`accessibilityRole="alert"`, `text-13 font-bold text-danger`) bajo el input,
  con, por rama:
  - `not-acceptable` → `t('joinPet.invalid')` («Este código no funciona. Puede que haya vencido o que ya se haya usado. Pide uno nuevo a quien te invitó.»),
    y el className del input cambia `border-accent` por `border-danger`;
  - `rate-limited` → `t('forgot.tooManyAttempts')`;
  - `unreachable` → `t('common.cannotReachServer')`;
  - `error` y `missing-config` → `t('common.somethingWentWrong')`;
  - `unauthorized` → `signOut()` y ningún `join-pet-error`.

  El estado de error es
  `type JoinError = 'not-acceptable' | 'rate-limited' | 'unreachable' | 'error' | 'missing-config';`
  (en `useState<JoinError | 'already-member' | null>(null)`) y el texto de
  `join-pet-error` es, literal, un ternario de llamadas `t('<clave>'` directas
  (las únicas que `checkUses` ve):
  `{state === 'not-acceptable' ? t('joinPet.invalid') : state === 'rate-limited' ? t('forgot.tooManyAttempts') : state === 'unreachable' ? t('common.cannotReachServer') : t('common.somethingWentWrong')}`.
  No vale un mapa `kind → clave` ni `t(errorKey)`.

  WHEN el usuario edita el input tras un error THE SYSTEM SHALL quitar
  `join-pet-error` y volver a `border-accent`. Ningún mensaje distingue un código
  inexistente de uno vencido, usado o mal formado (404 y 400 dan el mismo texto).
  Test: `src/screens/join-pet/index.test.tsx`:
  `'R19: not-acceptable dice Este código no funciona y marca el borde'`,
  `'R19: rate-limited dice Demasiados intentos'`,
  `'R19: unreachable dice No se pudo conectar con el servidor'`,
  `'R19: error dice Algo salió mal'`, `'R19: missing-config dice Algo salió mal'`,
  `'R19: unauthorized cierra sesión sin aviso'`, `'R19: editar borra el error'`;
  `src/api/__tests__/pet-members.test.ts`,
  `it('R19: acceptInvite da el mismo kind con 404 y con 400', …)`.

- **R20 (ya miembro)**: WHEN `acceptInvite` resuelve `already-member` THE SYSTEM
  SHALL dejar de renderizar `join-pet-note`, `join-pet-hint` y `join-pet-submit`,
  cambiar `border-accent` del input por `border-transparent`, renderizar
  `join-pet-already-member` (`accessibilityLiveRegion="polite"`, caja
  `flex-row items-center gap-2.5 rounded-tile bg-surface-secondary p-3.5`, icono
  `<CheckCircle size={20} color={accentStrong} />` con el `accentStrong` de R18,
  texto `text-sm font-bold text-foreground`) =
  `t('joinPet.alreadyMember')` y, en lugar de `join-pet-submit`, el Button
  `join-pet-go-home` (mismo estilo que `join-pet-submit`:
  `className="w-full h-14 rounded-16 bg-accent"`, `style={chunkyLip.primary}`,
  `Text` `text-17 font-extrabold text-accent-foreground` =
  `t('joinPet.goHome')` «Ir a Inicio»), con
  `onPress={() => router.dismissTo('/home')}` escrito así, literal (es la
  condición que la fila de `CTA_ROWS` de design.md §7.1 busca en la etiqueta).
  Editar el input vuelve al formulario de R18.
  Test: `src/screens/join-pet/index.test.tsx`,
  `it('R20: ya miembro sustituye la nota y el botón por Ir a Inicio', …)`,
  `it('R20: Ir a Inicio vuelve a Inicio', …)`,
  `it('R20: editar vuelve al formulario', …)`.

- **R21 (aceptar)**: WHEN `acceptInvite` resuelve `{ kind: 'ok', petId }` THE
  SYSTEM SHALL ejecutar, en este orden,
  `await queryClient.invalidateQueries({ queryKey: petKeys.list() })`,
  `selectPet(petId)` (de `useSelectedPet()`) y `router.dismissTo('/home')`.
  Test: `src/screens/join-pet/index.test.tsx`,
  `it('R21: aceptar invalida las mascotas, selecciona la nueva y vuelve a Inicio en orden', …)`
  (array de orden comparado entero) e
  `it('R21: no selecciona hasta que la invalidación termina', …)` (la promesa de
  `invalidateQueries` queda pendiente y se aserta que `selectPet` aún no se llamó).

## Copy, dependencia y candados

- **R22 (catálogo y tabla de copy)**: THE SYSTEM SHALL añadir a
  `src/i18n/catalog.ts`, al final de cada bloque (`en` y `es`, tras
  `'welcome.pingoGreeting'`), las **51** claves de design.md §5 (4 + 29 + 10 + 8)
  con sus literales exactos y en el orden de esa tabla, y a
  `src/__tests__/ui-copy-table.ts`, justo después del bloque `R18_DATE_FIELD`, el
  bloque `export const R21_PET_MEMBERS: UseRow[] = [ // #214 R22` con una fila
  `{ file, key }` por cada `t('<clave>'` de `src/screens/pet-members/index.tsx`,
  `src/screens/pet-invite/index.tsx` y `src/screens/join-pet/index.tsx` (en el
  orden del fuente, repetidas incluidas), y por cada `t('<clave>'` que #214
  añade a `src/screens/profile/index.tsx` (seis: `profile.membersLink`, las tres
  `profile.membersSummary*`, `joinPet.title`, `joinPet.invitedPrompt`) y a
  `src/screens/home/index.tsx` (dos: `joinPet.invitedPrompt`, `joinPet.title`).
  El bloque entra en `ALL_USES` con la línea `  ...R21_PET_MEMBERS, // #214 R22`
  justo después de `  ...R18_DATE_FIELD,`, y en el array `blocks` del `it`
  `'#194 R5: cuadra ALL_USES con la suma de sus bloques (enmendado por #220 R16)'`
  de ese mismo fichero, cuya línea
  `      R16_WELCOME, R17_EDIT_PROFILE, R18_DATE_FIELD,` pasa a
  `      R16_WELCOME, R17_EDIT_PROFILE, R18_DATE_FIELD, R21_PET_MEMBERS, // #214 R22`
  y cuyo título pasa a terminar en `(enmendado por #220 R16) (enmendado por #214 R22)`.
  En `src/__tests__/ui-language.test.ts`: `R21_PET_MEMBERS` se suma al import de
  `./ui-copy-table`; la fórmula de `SCREEN_FILES` del `it`
  `'#194 R5: no deja ningún valor fijo del catálogo como literal entero en las pantallas …'`
  suma, en una línea propia tras `+ 1 // #220 R16: components/date-field.tsx`,
  `+ 3 // #214 R22: screens/pet-members, screens/pet-invite y screens/join-pet`
  (profile y home ya están en `SCREEN_FILES`), y su título pasa a terminar en
  `(enmendado por #220 R16) (enmendado por #214 R22)`; y un `describe` nuevo al
  final del fichero, `'#214 R22: copy de Familia'`, contiene:
  - `it('R22: resuelve cada fila de R21_PET_MEMBERS', …)` → `checkUses(R21_PET_MEMBERS)`;
  - `it('R22: cada t( de las tres pantallas nuevas tiene su fila', …)`: para cada
    fichero nuevo, el número de coincidencias de `/\bt\(\s*['"][\w.]+['"]/g` en
    `readFileSync(join(SOURCE_ROOT, file), 'utf8')` es igual al número de filas
    de `R21_PET_MEMBERS` con ese `file`;
  - `it('R22: cada clave nueva existe en los dos idiomas y se usa', …)`: la lista
    literal de las 51 claves de design.md §5 tiene `toHaveLength(51)`, y cada
    clave existe en `en` y en `es` y aparece en al menos una fila de
    `R21_PET_MEMBERS`.
  Ninguno de los cinco ficheros contiene como literal entero un valor fijo del
  catálogo (lo verifica el `it` `#194 R5: no deja ningún valor fijo …` existente,
  que con la fórmula enmendada ya recorre los tres ficheros nuevos).

- **R23 (expo-clipboard)**: THE SYSTEM SHALL declarar `expo-clipboard` en
  `dependencies` de `package.json`, instalado con `bunx expo install expo-clipboard`
  (versión que fije la CLI para el SDK del proyecto, con `bun.lock` actualizado), y
  `test/jest-setup.js` lo sustituye para todas las suites con el único doble del
  módulo, **sin** la opción `virtual` (detalle y dueño en design.md §6). La
  instalación y el doble entran en el mismo commit verde: un `jest.mock` con
  factoría de un módulo que no está instalado tumba todas las suites.
  Test: `src/utils/__tests__/pet-members.test.ts`,
  `it('R23: expo-clipboard es dependencia declarada', …)`: lee `package.json`
  con `readFileSync(join(process.cwd(), 'package.json'), 'utf8')` y aserta que
  `dependencies['expo-clipboard']` es un string que empieza por `~`. El fichero
  no importa ninguna pantalla ni `expo-clipboard`, para que el rojo de R23 sea
  la aserción y no un «Cannot find module» de la importación.

- **R24 (candados existentes)**: THE SYSTEM SHALL enmendar exactamente los
  candados de la lista cerrada de design.md §7.1 (una fila por candado, con su
  ancla `grep -cF`, su cifra base → nueva, el comentario `// #214 R<n>` en la
  línea del término y el sufijo `(enmendado por #214 R<n>)` en el título del
  `it`), y SHALL dejar intactos los de design.md §7.2. Ningún candado fuera de
  esa lista cambia en el diff de #214.
  En **producción**, `src/screens/home/index.tsx` y
  `src/screens/profile/index.tsx` no llevan ningún comentario que cite una
  feature: `#190 R12` de `src/__tests__/home-pingo-phrase.test.ts` y `#173 R15`
  de `src/__tests__/profile-canvas-fidelity.test.ts` cuentan todo `#` seguido de
  tres dígitos como literal hex en esos ficheros. Anclas, desde
  `mobile-pet-tracker/`: `grep -cF '#214' src/screens/home/index.tsx` = 0 → 0 y
  `grep -cF '#214' src/screens/profile/index.tsx` = 0 → 0. Los ficheros de test
  sí llevan `// #214 R<n>`.
  Test: los `it` enmendados de design.md §7.1 y la corrida completa
  `bunx jest` de `mobile-pet-tracker/` en verde.

## Fuera de alcance

- Ocultar a family las acciones de dueño en otras pantallas (peso,
  recordatorios, vincular collar, documentos): feature #216.
- Deep links o enlaces universales con el código: el código se escribe a mano.
- Cambiar de dueño, asignar roles `walker`/`vet` o elegir rol al invitar: el
  backend #211 solo crea invitaciones `family`.
- Mostrar el código de una invitación pendiente ya creada: el backend no lo
  devuelve tras el 201.
- Notificaciones push cuando alguien se une o sale.
- Insertar el guion mientras se escribe en `join-pet-input`.
- Cambios en `EmptyState`, en la me-card de Perfil o en `ConfirmDialog`.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-27) ← gate obligatorio antes de implementar
- [ ] Smoke de #214 en dev build por el humano (fecha: ____), tras el rebuild del dev build por
      `expo-clipboard`: invitación entre dos cuentas (crear código, «Copiar código», «Compartir»
      con el Share nativo, unirse con el código, salir y quitar a un miembro). Va en el lote G4 de
      `progress/smoke_mejoras-producto.md`. No bloquea tareas; bloquea `done`.
