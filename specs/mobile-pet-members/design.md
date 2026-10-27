---
feature: "mobile-pet-members"
status: draft        # draft | approved
tags: [mobile, spec, pet-members, invites, expo-router, heroui-native]
---

# Diseño — [[mobile-pet-members]] (#214)

> Ver [[requirements]] para los requisitos que este diseño implementa,
> [[../../docs/architecture|architecture]] para las capas y
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI móvil.
> Rutas relativas a `mobile-pet-tracker/` salvo que empiecen por `specs/`,
> `docs/` o `backend-pet-tracker/`.

## 1. Contrato de backend (#211, ya en `dev`)

Fuente: `backend-pet-tracker/src/modules/pet-members/` (controladores y
`infrastructure/mappers/pet-member-error.mapper.ts`). Todas las rutas exigen
`Authorization: Bearer <token>`.

| Método y ruta | Éxito | Errores que la app distingue |
|---|---|---|
| `GET /pets/:petId/members` | 200 `[{ userId, firstName, lastName, role, joinedAt }]` | 401; cualquier otro status es `error` |
| `GET /pets/:petId/invites` | 200 `[{ id, role, createdAt, expiresAt }]` (sin código) | 401 |
| `POST /pets/:petId/invites` cuerpo `{}` | 201 `{ id, code, role, createdAt, expiresAt }` | 409 `{ code: 'PET_INVITES_LIMIT' }`, 409 `{ code: 'PET_MEMBERS_LIMIT' }`, 401 |
| `DELETE /pets/:petId/invites/:inviteId` | 204 | 404, 401 |
| `DELETE /pets/:petId/members/:userId` | 204 | 403 (no puede), 404 (no es miembro), 409 `OWNER_NOT_REMOVABLE`, 401 |
| `POST /invites/accept` cuerpo `{ code }` | 201 `{ petId, … }` | 404 `INVITE_NOT_ACCEPTABLE`, 400 (formato), 409 `ALREADY_PET_MEMBER`, 429, 401 |

Los 409 llevan cuerpo `{ statusCode, code, message }`; la app solo lee `code`.
El código es de 10 caracteres; el backend normaliza mayúsculas y guiones, así que
la app envía `input.trim()` tal cual (R18). La app nunca muestra `message` del
backend.

Privacidad (R9, R19): la API de miembros no devuelve correo y la app no lo cruza
desde `getMe`. 404 y 400 de `acceptInvite` colapsan en `not-acceptable` con un
único texto, para no revelar si un código existe.

## 2. Artboards y versión del canvas

- G1 se aprobó sobre el canvas v140 (ver `progress/plan_mejoras-producto-2026-10-26.md`).
  Los nueve `.dc.html` de `specs/mobile-pet-members/canvas/` tienen el mismo
  sha256 que sus homónimos de la copia local de v140 `1793036268-d302`
  (comprobado el 2026-10-26). No se vuelven a congelar.
- Los nueve artboards: `PerfilFamilia`, `FamiliaOwner`, `FamiliaQuitarMiembro`,
  `FamiliaInvitar`, `FamiliaFamily`, `InicioVacioUnirme`, `UnirmeConCodigo`,
  `UnirmeCodigoInvalido`, `UnirmeYaMiembro` (`.dc.html`).
- Los artboards fijan disposición y copy es-MX. Clases y tokens de la spec
  traducen el artboard a los tokens existentes de `src/theme/global.css`
  (todos verificados: `--radius-10/14/16/24`, `--text-17/24/28`,
  `--tracking-code/title/eyebrow`, `--leading-note`, `--color-accent-strong`,
  `--color-lip-gray`, `--color-category-*-strong`).

## 3. Decisiones técnicas

- **Cliente en un fichero nuevo `src/api/pet-members.ts`** (R1): mismo patrón que
  `src/api/pets.ts` (uniones `kind`, nunca lanza, `fetchFn` inyectable). Seis
  funciones porque son seis endpoints; no hay capa extra.
- **Claves de query fuera del prefijo `'pets'`** (R2): `removeQueries(petKeys.detail)`
  al salir (R17) y las invalidaciones de mascotas no deben tocar miembros ni
  invitaciones por accidente, y al revés.
- **Una pantalla Familia con dos vistas por `pet.myRole`** (R10, R16): el rol lo
  da `getPet` (`PetProfile.myRole`), no la lista de miembros. `walker` y `vet`
  se tratan como `family` en todo (píldora «Familia», vista de familia).
- **BottomSheet de `@expo/ui/community/bottom-sheet`** para quitar y salir (R11,
  R17), con la receta que #218 deja en el sheet de desvincular de
  `src/screens/pairing/index.tsx` (#214 mergea detrás de #218, Paso 0 de
  tasks.md): `BottomSheet` + `BottomSheetView`, `index` 0 abierto / -1 cerrado,
  `const [surface] = useThemeColors(['surface']);` y
  `backgroundStyle={{ backgroundColor: surface }}` en los dos sheets, y la View
  interior con `items-center gap-3 bg-surface px-5 pb-9 pt-3`. Anclas tras el
  Paso 0, desde `mobile-pet-tracker/`:
  `grep -cF 'backgroundStyle={{ backgroundColor: surface }}' src/screens/pairing/index.tsx` = 1,
  `grep -cF "const [surface] = useThemeColors(['surface']);" src/screens/pairing/index.tsx` = 1,
  `grep -cF 'items-center gap-3 bg-surface px-5 pb-9 pt-3' src/screens/pairing/index.tsx` = 1.
  Los tests usan el mismo doble que `src/screens/pairing/index.test.tsx`.
- **La pantalla Invitar no hace POST** (R13, R14): Familia crea la invitación y
  pasa `code`, `expiresAt`, `petName` e `inviterName` como parámetros de ruta.
  Así volver atrás e ir otra vez no crea una invitación por visita; el código no
  queda en caché de query.
- **Copiar con `expo-clipboard`** (R15, R23): dependencia nueva, decidida por el
  humano el 2026-10-26 a las 22:23 UTC (§5.2). Se instala con
  `bunx expo install expo-clipboard` (nunca `npx`, nunca `bun add` sin
  `expo install`). Es módulo nativo, así que exige el rebuild del dev build
  (no delegado), parte de G4, antes del smoke en dispositivo. El doble de jest
  tiene un único dueño, §6.
- **Compartir con `Share` de `react-native`** (R15): sin dependencia nueva. Es el
  «Share nativo» de G4 del plan §5 y sirve solo a «Compartir»; «Copiar código»
  usa `expo-clipboard`. En tests, `jest.spyOn(Share, 'share')`.
- **Fechas con `toLocale*String` del dispositivo** (R12, R14): sin librería.
  `inviteDateParts` vive en `src/utils/pet-members.ts` junto a `formatInviteCode`
  y `memberInitials`. Valores medidos con Node en es-MX: `6 oct`/`09:05`,
  `30 dic`/`23:59`, `2 ene`/`00:05`, `9 oct`/`14:00`; en en-US `Oct 9`/`14:00`.
  Los tests construyen instantes con `new Date(año, mes, día, h, m)` (hora local),
  así que no dependen de la zona horaria del runner.
- **`ProfileWideTile` local en Perfil** (R4, R6): un componente de fichero para las
  dos tarjetas anchas (Familia y Unirme). Clases de categoría solo vía
  `CATEGORY_SLOTS[slot].surface` / `.ink` (`src/utils/category-palette.ts`), sin
  construir nombres de clase por interpolación de cadenas (#64 R9). Un único
  `style={CONTINUOUS_CORNER}` en el fuente.
- **Subtítulo de Familia en Perfil** (R5): query propia `memberKeys.list(pet.id)`.
  Pantalla Familia y Perfil comparten caché, así que quitar o salir refresca el
  subtítulo. Su `unauthorized` no cierra sesión: Perfil ya cierra por sus queries
  propias y un subtítulo no debe expulsar al usuario.
- **Join sin `petId` en la ruta** (R3, R18): el código identifica la mascota.
  Al aceptar: `await invalidateQueries(petKeys.list())` antes de `selectPet` para
  que Inicio encuentre la mascota en la lista al aterrizar (R21).
- **Placeholder `XXXXX-XXXXX` como literal en código** (R18): no es copy
  traducible; no entra en el catálogo ni en `R21_PET_MEMBERS`. El `it`
  `#194 R5: no deja ningún valor fijo …` no lo marca porque no coincide con
  ningún valor del catálogo.
- **Errores de acción en un único `pet-members-action-error`** (R11–R13, R17):
  un estado `actionError: string | null` en la pantalla; cada toque nuevo lo
  borra antes de llamar (R13).
- **Mapa de iconos**: todos de `reicon-react-native` (verificados en sus `.d.ts`):
  `Users`, `Key`, `ChevronRight`, `InfoCircle`, `Lock`, `Copy`, `Share`, `Plus`,
  `CheckCircle`, `Logout`. En `src/screens/pet-invite/index.tsx`, `Share` se
  importa como `Share as ShareIcon` para no chocar con `Share` de `react-native`
  (R15). Colores con `useThemeColors([...])`, nunca `useThemeColors(['accent'])`
  (#61 R4).

## 4. Archivos afectados (todo es capa de presentación/infraestructura móvil)

Nuevos:
- `src/api/pet-members.ts` — cliente HTTP (R1).
- `src/api/__tests__/pet-members.test.ts` — R1, R2, R19.
- `src/utils/pet-members.ts` — `formatInviteCode`, `memberInitials`, `inviteDateParts` (R9, R12, R14).
- `src/utils/__tests__/pet-members.test.ts`.
- `src/app/pets/[petId]/members.tsx`, `src/app/pets/[petId]/invite.tsx`, `src/app/join-pet.tsx` — rutas delgadas (R3).
- `src/screens/pet-members/index.tsx` + `index.test.tsx` (R8–R13, R16, R17).
- `src/screens/pet-invite/index.tsx` + `index.test.tsx` (R14, R15, R23).
- `src/screens/join-pet/index.tsx` + `index.test.tsx` (R18–R21).

Modificados:
- `src/api/query-keys.ts` — `memberKeys`, `inviteKeys` (R2).
- `src/app/_layout.tsx` — tres `Stack.Screen` (R3).
- `src/screens/profile/index.tsx` — `ProfileWideTile`, filas nuevas, query de miembros (R4–R6).
- `src/screens/home/index.tsx` — `home-join-pet` (R7).
- `src/i18n/catalog.ts` — 51 claves × 2 idiomas (R22).
- `package.json`, `bun.lock` — `expo-clipboard` (R23).
- `test/jest-setup.js` — doble global de `expo-clipboard` (§6).
- Candados de §7.1 (R24), en `src/__tests__/`, `src/app/__tests__/`,
  `src/app/(tabs)/__tests__/screens.test.tsx`, `src/screens/home/index.test.tsx`,
  `src/screens/profile/index.test.tsx`,
  `src/providers/__tests__/language-provider.test.tsx` (fila 48) y
  `src/hooks/use-pet-selection.test.tsx` (fila 49).

`src/screens/home/index.tsx` y `src/screens/profile/index.tsx` no importan nada
de `pet-members` salvo lo que R5 pide (`listPetMembers`, `memberKeys`).

## 5. Copy (es-MX / en-US exactos)

Se añaden al final de cada bloque de `src/i18n/catalog.ts`, tras
`'welcome.pingoGreeting'` (`grep -cF "'welcome.pingoGreeting'" src/i18n/catalog.ts` = 2
antes y después), en este orden. Apóstrofos en en-US escapados como el resto del
catálogo (`\'`). Los literales es-MX salen de los artboards salvo los marcados
en §5.1.

| Clave | es-MX | en-US |
|---|---|---|
| `profile.membersLink` | Familia | Family |
| `profile.membersSummaryAlone` | Solo tú cuidas a {{petName}} | Only you care for {{petName}} |
| `profile.membersSummaryOne` | Tú y 1 persona más cuidan a {{petName}} | You and 1 more person care for {{petName}} |
| `profile.membersSummaryMany` | Tú y {{count}} personas más cuidan a {{petName}} | You and {{count}} more people care for {{petName}} |
| `members.titleOf` | Familia de {{petName}} | {{petName}}'s family |
| `members.ownerIntro` | Quienes estén aquí ven a {{petName}} y reciben sus avisos. Solo tú puedes invitar o quitar a alguien. | Everyone here sees {{petName}} and gets their alerts. Only you can invite or remove people. |
| `members.familyIntro` | Ves a {{petName}} y recibes sus avisos porque formas parte de su familia. | You see {{petName}} and get their alerts because you're part of their family. |
| `members.membersHeading` | Miembros | Members |
| `members.you` | Tú | You |
| `members.roleOwner` | Dueño | Owner |
| `members.roleFamily` | Familia | Family |
| `members.remove` | Quitar | Remove |
| `members.removeA11y` | Quitar a {{name}} | Remove {{name}} |
| `members.invitesHeading` | Invitaciones pendientes | Pending invites |
| `members.inviteCreated` | Invitación · creada el {{date}} | Invite · created {{date}} |
| `members.inviteExpires` | Vence el {{date}} a las {{time}} | Expires {{date}} at {{time}} |
| `members.revoke` | Revocar | Revoke |
| `members.revokeA11y` | Revocar la invitación creada el {{date}} | Revoke the invite created {{date}} |
| `members.codeNote` | Cada código sirve una sola vez. Si nadie lo usa, vence solo. | Each code works only once. If nobody uses it, it expires on its own. |
| `members.inviteCta` | Invitar a alguien | Invite someone |
| `members.removeTitle` | ¿Quitar a {{name}}? | Remove {{name}}? |
| `members.removeBody` | {{firstName}} dejará de ver a {{petName}} y de recibir sus avisos. Podrás enviarle otra invitación cuando quieras. | {{firstName}} will stop seeing {{petName}} and getting their alerts. You can send a new invite whenever you want. |
| `members.removeConfirm` | Quitar a {{firstName}} | Remove {{firstName}} |
| `members.cancel` | Cancelar | Cancel |
| `members.ownerNote` | {{ownerName}} administra a {{petName}} y es quien puede invitar o quitar personas. | {{ownerName}} manages {{petName}} and is the one who can invite or remove people. |
| `members.leaveHint` | Si sales, dejarás de ver a {{petName}} y de recibir sus avisos. | If you leave, you'll stop seeing {{petName}} and getting their alerts. |
| `members.leave` | Salir de esta mascota | Leave this pet |
| `members.leaveTitle` | ¿Salir de la familia de {{petName}}? | Leave {{petName}}'s family? |
| `members.leaveBody` | Dejarás de ver a {{petName}} y de recibir sus avisos. Para volver, {{ownerName}} tendrá que invitarte otra vez. | You'll stop seeing {{petName}} and getting their alerts. To come back, {{ownerName}} will have to invite you again. |
| `members.leaveBodyNoOwner` | Dejarás de ver a {{petName}} y de recibir sus avisos. Para volver, necesitarás una invitación nueva. | You'll stop seeing {{petName}} and getting their alerts. To come back, you'll need a new invite. |
| `members.leaveConfirm` | Salir de esta mascota | Leave this pet |
| `members.invitesLimit` | Ya hay 5 invitaciones pendientes. Revoca una para crear otra. | There are already 5 pending invites. Revoke one to create another. |
| `members.membersLimit` | {{petName}} ya tiene el máximo de personas. Quita a alguien o revoca una invitación para invitar de nuevo. | {{petName}} already has the most people allowed. Remove someone or revoke an invite to invite again. |
| `invite.title` | Invitar a cuidar a {{petName}} | Invite someone to care for {{petName}} |
| `invite.intro` | Comparte este código con quien quieras que vea a {{petName}} y reciba sus avisos. | Share this code with anyone you want to see {{petName}} and get their alerts. |
| `invite.codeLabel` | Código de invitación | Invite code |
| `invite.expiresOnce` | Vence el {{date}} a las {{time}} · sirve una sola vez | Expires {{date}} at {{time}} · works only once |
| `invite.messageLabel` | Mensaje que se enviará | Message to send |
| `invite.shareMessage` | {{inviterName}} te invita a cuidar a {{petName}} en Pet Tracker. Abre la app, toca «Unirme con código» y escribe {{code}}. Vence el {{date}} a las {{time}}. | {{inviterName}} invited you to care for {{petName}} on Pet Tracker. Open the app, tap "Join with a code" and enter {{code}}. It expires {{date}} at {{time}}. |
| `invite.roleNote` | Quien lo use podrá ver a {{petName}}, pero solo tú podrás invitar o quitar personas. | Whoever uses it will see {{petName}}, but only you can invite or remove people. |
| `invite.share` | Compartir | Share |
| `invite.copy` | Copiar código | Copy code |
| `invite.copied` | Código copiado | Code copied |
| `joinPet.title` | Unirme con código | Join with a code |
| `joinPet.invitedPrompt` | ¿Te invitaron a cuidar una mascota? | Were you invited to care for a pet? |
| `joinPet.note` | Pídele el código a quien cuida a la mascota. Sirve una sola vez y vence pronto. | Ask the person who cares for the pet for the code. It works only once and expires soon. |
| `joinPet.hint` | Son 10 letras y números | It's 10 letters and numbers |
| `joinPet.submit` | Unirme | Join |
| `joinPet.invalid` | Este código no funciona. Puede que haya vencido o que ya se haya usado. Pide uno nuevo a quien te invitó. | This code doesn't work. It may have expired or already been used. Ask the person who invited you for a new one. |
| `joinPet.alreadyMember` | Ya formas parte de la familia de esta mascota. La encontrarás en Inicio. | You're already part of this pet's family. You'll find them in Home. |
| `joinPet.goHome` | Ir a Inicio | Go to Home |

Total: 4 + 29 + 10 + 8 = **51 claves** (`grep -cF "'members.leaveBodyNoOwner'" src/i18n/catalog.ts`
0 → 2). El sheet de salir cancela con `members.cancel`, la misma clave del de
quitar. Claves reutilizadas (no se crean):
`common.cannotReachServer`, `common.somethingWentWrong`, `common.retry`,
`forgot.tooManyAttempts`.

### 5.1 Copy sin artboard

**Decisión de G1 (2026-10-26, 22:47 UTC).** El humano aprobó «ambos» en la sesión
del leader: la fila «Unirme con código» de Perfil (R6) y todo el copy de esta
tabla, incluidas las columnas en-US. La aprobación no cubría
`members.leaveBodyNoOwner`, que nació después (H2), ni el en-US de H2.

**Decisión de G1 (2026-10-27, 02:38 UTC).** El humano aprobó «ambos» en la sesión
del leader: `members.leaveBodyNoOwner` (es-MX y en-US) y el en-US de
`members.leaveTitle`, `members.leaveBody` y `members.leaveConfirm`, tal como
figuran en la tabla de §5. Con esto no queda copy de #214 pendiente de G1.

| Clave o texto | Motivo |
|---|---|
| Todas las columnas en-US | Los artboards solo están en es-MX; traducción propia. |
| `profile.membersSummaryAlone`, `profile.membersSummaryOne` | `PerfilFamilia` solo dibuja el caso «Tú y 2 personas más cuidan a Rocky»; las otras dos ramas de R5 hacen falta para 1 y 2 miembros. |
| `members.removeA11y`, `members.revokeA11y` | Etiquetas de accesibilidad; los botones visibles dicen solo «Quitar» / «Revocar» y hace falta distinguir fila. |
| `members.leaveTitle`, `members.leaveBody`, `members.leaveConfirm` | No hay artboard del sheet de salir. Literales es-MX fijados por el humano (H2); el en-US es traducción propia, aprobada en G1 el 2026-10-27 a las 02:38 UTC. |
| `members.leaveBodyNoOwner` | Sin artboard; aprobada en G1 el 2026-10-27 a las 02:38 UTC. Cuerpo de R17 cuando la lista no tiene dueño y no hay `ownerName` que nombrar. |
| `members.invitesLimit`, `members.membersLimit` | Los 409 de límite no tienen artboard. El 5 de `invitesLimit` es el límite del backend #211. |
| `invite.copied` | Estado posterior al toque de «Copiar código», no dibujado. |
| Tarjeta «Unirme con código» de Perfil | Reutiliza `joinPet.title` y `joinPet.invitedPrompt`; no crea claves. |
| Placeholder `XXXXX-XXXXX` | Literal del artboard `UnirmeConCodigo`, en código (no traducible). |

### 5.2 Desviación de género y dependencia nueva (H1)

**Decidido por el humano el 2026-10-26 a las 22:23 UTC.** Dos literales del
artboard asumen el género de la persona; se aceptan las variantes neutras de la
spec:

| Clave | Artboard | Spec |
|---|---|---|
| `members.removeBody` | «… Podrás invitarlo otra vez cuando quieras.» | «… Podrás enviarle otra invitación cuando quieras.» |
| `members.ownerNote` | «… Solo ella puede invitar o quitar personas.» | «{{ownerName}} administra a {{petName}} y es quien puede invitar o quitar personas.» |

En la misma decisión, el humano aceptó `expo-clipboard` como dependencia nueva
(R23), con el rebuild del dev build hecho por él antes del smoke. El «Share
nativo» de G4 del plan §5 se queda para «Compartir»; «Copiar código» usa
`expo-clipboard`.

## 6. Dependencia y entorno

- **Instalación** (R23): `cd mobile-pet-tracker && bunx expo install expo-clipboard`.
  La CLI fija la versión del SDK 57 (`~57.0.0`) y actualiza `bun.lock`.
- **Orden de commits** (C4):
  1. Rojo: `it('R23: expo-clipboard es dependencia declarada', …)` en
     `src/utils/__tests__/pet-members.test.ts`. Lee `package.json` y no importa el
     módulo; su rojo es la aserción.
  2. Verde, un solo commit: `package.json`, `bun.lock`, el doble de
     `test/jest-setup.js` (abajo) y las filas 26 y 27 de §7.1 (`44 + 1`). El doble
     y la instalación van juntos: un `jest.mock` con factoría de un módulo no
     instalado tumba todas las suites, y sin el doble cualquier suite que cargue
     `src/app/pets/[petId]/invite.tsx` por el árbol de rutas toca el módulo nativo.
  3. Tras ese commit: `bunx tsc --noEmit` y `bunx expo lint --no-cache`.
- **Doble global, único del repo** (dueño de F2): `test/jest-setup.js` (el
  `setupFilesAfterEnv` de `package.json`) añade, al final,
  `jest.mock('expo-clipboard', () => ({ setStringAsync: jest.fn() }));`
  (ancla P18: 0 → 1), **sin** la opción `virtual` (P19:
  `grep -cF 'virtual' test/jest-setup.js` 0 → 0). Ningún otro fichero declara
  `jest.mock('expo-clipboard'`. `#207 R2` solo recorre `src/**/*.test.ts(x)` y no
  mira `test/`, pero la causa del flake de #207 (mapa de IDs de módulo
  envenenado por un doble virtual de un módulo real) vale igual aquí.
- **Valor por defecto** (dueño de F2): `src/screens/pet-invite/index.test.tsx`
  importa `import * as Clipboard from 'expo-clipboard';` (la misma forma que la
  pantalla, R15) y fija en su `beforeEach`
  `jest.mocked(Clipboard.setStringAsync).mockResolvedValue(true);`
  (`setStringAsync` resuelve `Promise<boolean>`). El `it` de fallo de R15
  sobreescribe con `jest.mocked(Clipboard.setStringAsync).mockRejectedValue(new Error('x'))`.
  Ningún otro fichero fija un valor por defecto del doble.
- **Share**: sin doble global. El test de la pantalla usa
  `jest.spyOn(Share, 'share')` con `Share` de `react-native`.
- **Rebuild del dev build (no delegado), parte de G4**: lo hace el humano antes del
  smoke en dispositivo, porque `expo-clipboard` es módulo nativo nuevo (H1).

## 7. Candados

### 7.1 Enmiendas obligatorias (R24)

Lista cerrada: una fila por candado (o por dato que leen varios candados). Todas las
anclas se ejecutan desde `mobile-pet-tracker/` y dan `base → después de #214`. La
base es `dev` `8b4cb1bd` **con #218 mergeada** (Paso 0 de tasks.md): tras ese merge
se re-miden todas antes de tocar nada; si alguna base no cuadra, se para y se avisa
al leader. Cada término nuevo lleva `// #214 R<n>` en su línea y cada título
enmendado gana el sufijo ` (enmendado por #214 R<n>)` al final, salvo donde la fila
diga otra cosa. Las cifras se escriben como base + delta (`16 + 1 + 1 + 1 + 4`,
nunca `23`).

Comprobación de cuadre: la semilla de la auditoría (producción mínima según la spec
más estas 49 filas) da 0 desviaciones con estas anclas y corre en verde
(`progress/firma_mobile-pet-members.md`).

1. **`src/app/__tests__/layout.test.tsx`** · it('#194 R4: declara ocho rutas protegidas y alerts singular') · R3
   - Cambio: La suma `expect(children).toHaveLength(8 + 1 + 1 + 1 + 1 + 1 + 1);` (14 hijos) gana `+ 3` al final, y la línea añade ` // #214 R3` tras su comentario actual. El título gana ` (enmendado por #214 R3)`.
   - `grep -cF 'expect(children).toHaveLength(8 + 1 + 1 + 1 + 1 + 1 + 1);' src/app/__tests__/layout.test.tsx`: 1 → 0
   - `grep -cF 'expect(children).toHaveLength(8 + 1 + 1 + 1 + 1 + 1 + 1 + 3); // #194 R4' src/app/__tests__/layout.test.tsx`: 0 → 1
   - `grep -cF "declara ocho rutas protegidas y alerts singular (enmendado por #214 R3)', async () => {" src/app/__tests__/layout.test.tsx`: 0 → 1
2. **`src/app/__tests__/layout.test.tsx`** · it('#194 R4: declara alerts/[alertId] como décimo hijo y singular') · R3
   - Cambio: La suma `expect(children).toHaveLength(9 + 1 + 1 + 1 + 1 + 1);` (14 hijos) gana `+ 3` al final, y la línea añade ` // #214 R3` tras su comentario actual. El título gana ` (enmendado por #214 R3)`.
   - `grep -cF 'expect(children).toHaveLength(9 + 1 + 1 + 1 + 1 + 1);' src/app/__tests__/layout.test.tsx`: 1 → 0
   - `grep -cF 'expect(children).toHaveLength(9 + 1 + 1 + 1 + 1 + 1 + 3); // #194 R4' src/app/__tests__/layout.test.tsx`: 0 → 1
   - `grep -cF "declara alerts/[alertId] como décimo hijo y singular (enmendado por #214 R3)', async () => {" src/app/__tests__/layout.test.tsx`: 0 → 1
3. **`src/app/__tests__/layout.test.tsx`** · it('#194 R4: declara pets/[petId]/geofences como undécimo hijo y no singular (enmendado por #189 R1.1)') · R3
   - Cambio: La suma `expect(children).toHaveLength(10 + 1 + 1 + 1 + 1);` (14 hijos) gana `+ 3` al final, y la línea añade ` // #214 R3` tras su comentario actual. El título gana ` (enmendado por #214 R3)`.
   - `grep -cF 'expect(children).toHaveLength(10 + 1 + 1 + 1 + 1);' src/app/__tests__/layout.test.tsx`: 1 → 0
   - `grep -cF 'expect(children).toHaveLength(10 + 1 + 1 + 1 + 1 + 3); // #194 R4' src/app/__tests__/layout.test.tsx`: 0 → 1
   - `grep -cF "declara pets/[petId]/geofences como undécimo hijo y no singular (enmendado por #189 R1.1) (enmendado por #214 R3)', async () => {" src/app/__tests__/layout.test.tsx`: 0 → 1
4. **`src/app/__tests__/layout.test.tsx`** · it('#194 R4: declara pets/[petId]/geofence-editor como duodécimo hijo y no singular (enmendado por #189 R1.1)') · R3
   - Cambio: La suma `expect(children).toHaveLength(11 + 1 + 1 + 1);` (14 hijos) gana `+ 3` al final, y la línea añade ` // #214 R3` tras su comentario actual. El título gana ` (enmendado por #214 R3)`.
   - `grep -cF 'expect(children).toHaveLength(11 + 1 + 1 + 1);' src/app/__tests__/layout.test.tsx`: 1 → 0
   - `grep -cF 'expect(children).toHaveLength(11 + 1 + 1 + 1 + 3); // #194 R4' src/app/__tests__/layout.test.tsx`: 0 → 1
   - `grep -cF "declara pets/[petId]/geofence-editor como duodécimo hijo y no singular (enmendado por #189 R1.1) (enmendado por #214 R3)', async () => {" src/app/__tests__/layout.test.tsx`: 0 → 1
5. **`src/app/__tests__/detail-stack.guard.test.tsx`** · it.each('#194 R4: cierra sesión en %s, aterriza en welcome y no reabre el detalle') · R3
   - Cambio: Línea propia `'/pets/pet-1/members', '/pets/pet-1/invite', '/join-pet', // #214 R3` justo antes de `'/edit-profile', // #194 R4` en la tabla del `it.each`. El título gana ` (enmendado por #214 R3)`.
   - `grep -cF "'/pets/pet-1/members', '/pets/pet-1/invite', '/join-pet', // #214 R3" src/app/__tests__/detail-stack.guard.test.tsx`: 0 → 1
   - `grep -cF "'/edit-profile', // #194 R4" src/app/__tests__/detail-stack.guard.test.tsx`: 2 → 2
   - `grep -cF "aterriza en welcome y no reabre el detalle', async (href) => {" src/app/__tests__/detail-stack.guard.test.tsx`: 1 → 0
   - `grep -cF "aterriza en welcome y no reabre el detalle (enmendado por #214 R3)', async (href) => {" src/app/__tests__/detail-stack.guard.test.tsx`: 0 → 1
6. **`src/screens/home/index.test.tsx`** · it('queda en el sitio del vacío que sustituye (enmendado por #181 R3)') · R7
   - Cambio: El `toEqual(['home-empty'])` de los hijos del padre de `slot` pasa a `toEqual(['home-empty', 'home-join-pet']); // #214 R7`. El título gana ` (enmendado por #214 R7)`.
   - `grep -cF "child.type)))).toEqual(['home-empty', 'home-join-pet']); // #214 R7" src/screens/home/index.test.tsx`: 0 → 1
   - `grep -cF "queda en el sitio del vacío que sustituye (enmendado por #181 R3) (enmendado por #214 R7)', async () => {" src/screens/home/index.test.tsx`: 0 → 1
7. **`src/screens/home/index.test.tsx`** · it('R3.2: el contenedor centrado solo contiene home-empty y sustituye la escena (enmendado por #176 R3)') · R7
   - Cambio: El `toEqual(['home-empty'])` de los hijos de `container` pasa a `toEqual(['home-empty', 'home-join-pet']); // #214 R7`. El título gana ` (enmendado por #214 R7)`. Con la fila anterior, `grep -cF "toEqual(['home-empty']);"` pasa de 2 a 0.
   - `grep -cF "child.props.testID)).toEqual(['home-empty', 'home-join-pet']); // #214 R7" src/screens/home/index.test.tsx`: 0 → 1
   - `grep -cF "toEqual(['home-empty']);" src/screens/home/index.test.tsx`: 2 → 0
   - `grep -cF "y sustituye la escena (enmendado por #176 R3) (enmendado por #214 R7)', async () => {" src/screens/home/index.test.tsx`: 0 → 1
8. **`src/screens/profile/index.test.tsx`** · it('pinta la fila de zonas seguras tras la de GPS y abre la ruta de la mascota activa') · R4, R6
   - Cambio: Lista cerrada `/-link$/` en orden DOM: tras la línea `'documents-link', 'pairing-link', 'geofences-link', 'reminders-link',` va la línea `'members-link', 'join-pet-link', // #214 R4, R6`. El título gana ` (enmendado por #214 R4, R6)`.
   - `grep -cF "'documents-link', 'pairing-link', 'geofences-link', 'reminders-link'," src/screens/profile/index.test.tsx`: 1 → 1
   - `grep -cF "'members-link', 'join-pet-link', // #214 R4, R6" src/screens/profile/index.test.tsx`: 0 → 1
   - `grep -cF "abre la ruta de la mascota activa (enmendado por #214 R4, R6)', async () => {" src/screens/profile/index.test.tsx`: 0 → 1
9. **`src/screens/profile/index.test.tsx`** · it('con mascota ordena dos filas de dos tiles') · R4, R6
   - Cambio: `expect(grid.children).toHaveLength(2);` pasa a `expect(grid.children).toHaveLength(2 + 2); // #214 R4, R6`. El título gana ` (enmendado por #214 R4, R6)`.
   - `grep -cF 'expect(grid.children).toHaveLength(2);' src/screens/profile/index.test.tsx`: 1 → 0
   - `grep -cF 'expect(grid.children).toHaveLength(2 + 2); // #214 R4, R6' src/screens/profile/index.test.tsx`: 0 → 1
   - `grep -cF "con mascota ordena dos filas de dos tiles (enmendado por #214 R4, R6)', async () => {" src/screens/profile/index.test.tsx`: 0 → 1
10. **`src/screens/profile/index.test.tsx`** · it('sin mascota deja recordatorios solo y a ancho completo') · R6
   - Cambio: `expect(grid.children).toHaveLength(1);` pasa a `expect(grid.children).toHaveLength(1 + 1); // #214 R6`. El título gana ` (enmendado por #214 R6)`.
   - `grep -cF 'expect(grid.children).toHaveLength(1);' src/screens/profile/index.test.tsx`: 1 → 0
   - `grep -cF 'expect(grid.children).toHaveLength(1 + 1); // #214 R6' src/screens/profile/index.test.tsx`: 0 → 1
   - `grep -cF "sin mascota deja recordatorios solo y a ancho completo (enmendado por #214 R6)', async () => {" src/screens/profile/index.test.tsx`: 0 → 1
11. **`src/screens/profile/index.test.tsx`** · doble de `../../api/pet-members` (no es candado) · R5
   - Cambio: Tres líneas: `import { listPetMembers } from '../../api/pet-members';` tras `import { getPet, listPets, type PetState, type PetsState } from '../../api/pets';`; `jest.mock('../../api/pet-members', () => ({ listPetMembers: jest.fn() }));` tras el `jest.mock('../../api/pets', …)`; y `jest.mocked(listPetMembers).mockResolvedValue({ kind: 'error' }); // #214 R5` como última línea del `beforeEach` global, tras `mockLaunchImageLibrary.mockResolvedValue({ canceled: true, assets: null });`. Con `{ kind: 'error' }` la tarjeta de Familia no pinta subtítulo y ningún `it` previo cambia de texto.
   - `grep -cF "import { getPet, listPets, type PetState, type PetsState } from '../../api/pets';" src/screens/profile/index.test.tsx`: 1 → 1
   - `grep -cF "import { listPetMembers } from '../../api/pet-members';" src/screens/profile/index.test.tsx`: 0 → 1
   - `grep -cF "jest.mock('../../api/pet-members', () => ({ listPetMembers: jest.fn() }));" src/screens/profile/index.test.tsx`: 0 → 1
   - `grep -cF 'mockLaunchImageLibrary.mockResolvedValue({ canceled: true, assets: null });' src/screens/profile/index.test.tsx`: 3 → 3
   - `grep -cF "jest.mocked(listPetMembers).mockResolvedValue({ kind: 'error' }); // #214 R5" src/screens/profile/index.test.tsx`: 0 → 1
12. **`src/app/(tabs)/__tests__/screens.test.tsx`** · doble de `../../../api/pet-members` (no es candado) · R5
   - Cambio: Línea `jest.mock('../../../api/pet-members', () => ({ listPetMembers: jest.fn() })); // #214 R5` tras `jest.mock('../../../api/users', () => ({ getMe: jest.fn() }));`. La pestaña Perfil no hace red.
   - `grep -cF "jest.mock('../../../api/users', () => ({ getMe: jest.fn() }));" 'src/app/(tabs)/__tests__/screens.test.tsx'`: 1 → 1
   - `grep -cF "jest.mock('../../../api/pet-members', () => ({ listPetMembers: jest.fn() })); // #214 R5" 'src/app/(tabs)/__tests__/screens.test.tsx'`: 0 → 1
13. **`src/__tests__/sheet-surface-background.test.ts`** · it('#218 R3: solo Recordatorios y Vinculación montan un BottomSheet') · R11, R17
   - Cambio: El título pasa a `'#218 R3: solo Recordatorios, Vinculación y Familia montan un BottomSheet (enmendado por #214 R11, R17)'`. La aserción de una línea pasa a la lista de tres, una entrada por línea, en este orden: `'screens/pairing/index.tsx',`, `'screens/pet-members/index.tsx', // #214 R11, R17` y `'screens/reminders/index.tsx',`.
   - `grep -cF "expect(importers).toEqual(['screens/pairing/index.tsx', 'screens/reminders/index.tsx']);" src/__tests__/sheet-surface-background.test.ts`: 1 → 0
   - `grep -cF "'screens/pet-members/index.tsx', // #214 R11, R17" src/__tests__/sheet-surface-background.test.ts`: 0 → 1
   - `grep -cF "Vinculación y Familia montan un BottomSheet (enmendado por #214 R11, R17)', () => {" src/__tests__/sheet-surface-background.test.ts`: 0 → 1
14. **`src/__tests__/sheet-surface-background.test.ts`** · it.each(importers)('#218 R3: %s monta un BottomSheet con backgroundStyle surface') · R11, R17
   - Cambio: Entre los dos `it` se declara `const SHEETS: Record<string, number> = { 'screens/pairing/index.tsx': 1, 'screens/pet-members/index.tsx': 2, // #214 R11, R17 'screens/reminders/index.tsx': 1 };` (una entrada por línea). `.toHaveLength(1);` del `<BottomSheet` pasa a `.toHaveLength(SHEETS[path]);` y `.toHaveLength(2);` del `split` pasa a `.toHaveLength(SHEETS[path] + 1);`. El `toContain("const [surface] = useThemeColors(['surface']);")` no cambia. El título gana ` (enmendado por #214 R11, R17)`.
   - `grep -cF "'screens/pet-members/index.tsx': 2, // #214 R11, R17" src/__tests__/sheet-surface-background.test.ts`: 0 → 1
   - `grep -cF '.toHaveLength(SHEETS[path]);' src/__tests__/sheet-surface-background.test.ts`: 0 → 1
   - `grep -cF '.toHaveLength(SHEETS[path] + 1);' src/__tests__/sheet-surface-background.test.ts`: 0 → 1
   - `grep -cF "backgroundColor: surface }}')).toHaveLength(2);" src/__tests__/sheet-surface-background.test.ts`: 1 → 0
   - `grep -cF "con backgroundStyle surface (enmendado por #214 R11, R17)', (path) => {" src/__tests__/sheet-surface-background.test.ts`: 0 → 1
15. **`src/__tests__/design-drift.test.ts`** · it('reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto …') (#178 R13) · R7, R10, R11, R12, R13, R15, R16, R17, R18
   - Cambio: Mapa `rounded16`: `'screens/home/index.tsx': 1,` pasa a `'screens/home/index.tsx': 1 + 1, // #214 R7`; entradas nuevas, en orden alfabético, `'screens/join-pet/index.tsx': 2, // #214 R18`, `'screens/pet-invite/index.tsx': 2, // #214 R15` y `'screens/pet-members/index.tsx': 6, // #214 R11, R13, R16, R17`. Lista `outsideReminders(/\brounded-14\b/)`: entradas nuevas `join('screens', 'join-pet', 'index.tsx'), // #214 R18` (tras `health`) y `join('screens', 'pet-members', 'index.tsx'), // #214 R10, R12` (tras `pairing`). El título, tras `(enmendado por #205 R13)`, gana ` (enmendado por #214 R7, R10, R11, R12, R13, R15, R16, R17, R18)`.
   - `grep -cF "'screens/home/index.tsx': 1 + 1, // #214 R7" src/__tests__/design-drift.test.ts`: 0 → 1
   - `grep -cF "'screens/join-pet/index.tsx': 2, // #214 R18" src/__tests__/design-drift.test.ts`: 0 → 1
   - `grep -cF "'screens/pet-invite/index.tsx': 2, // #214 R15" src/__tests__/design-drift.test.ts`: 0 → 1
   - `grep -cF "'screens/pet-members/index.tsx': 6, // #214 R11, R13, R16, R17" src/__tests__/design-drift.test.ts`: 0 → 1
   - `grep -cF "join('screens', 'join-pet', 'index.tsx'), // #214 R18" src/__tests__/design-drift.test.ts`: 0 → 1
   - `grep -cF "join('screens', 'pet-members', 'index.tsx'), // #214 R10, R12" src/__tests__/design-drift.test.ts`: 0 → 1
   - `grep -cF "(enmendado por #205 R13) (enmendado por #214 R7, R10, R11, R12, R13, R15, R16, R17, R18)', () => {" src/__tests__/design-drift.test.ts`: 0 → 1
16. **`src/__tests__/design-drift.test.ts`** · it('limita text-22 a Horario y text-17 al inventario de E1.2 … (enmendado por #198 R15)') (#179 R13) · R13, R15, R18
   - Cambio: Lista `productionFilesMatching(/\btext-17\b/)`: entradas nuevas `'screens/join-pet/index.tsx', // #214 R18` (tras `home`), `'screens/pet-invite/index.tsx', // #214 R15` y `'screens/pet-members/index.tsx', // #214 R13` (tras `pairing`). La de `text-22` no cambia. El título gana ` (enmendado por #214 R13, R15, R18)`.
   - `grep -cF "'screens/join-pet/index.tsx', // #214 R18" src/__tests__/design-drift.test.ts`: 0 → 1
   - `grep -cF "'screens/pet-invite/index.tsx', // #214 R15" src/__tests__/design-drift.test.ts`: 0 → 1
   - `grep -cF "'screens/pet-members/index.tsx', // #214 R13" src/__tests__/design-drift.test.ts`: 0 → 1
   - `grep -cF "(enmendado por #198 R15) (enmendado por #214 R13, R15, R18)', () => {" src/__tests__/design-drift.test.ts`: 0 → 1
17. **`src/__tests__/consistency-classnames.test.ts`** · it('deja todos los botones primarios sólidos en un único radio (enmendado por #177 R10) (enmendado por #201 R13)') (#62 R1) · R13, R15, R18, R20
   - Cambio: `toHaveLength(16 + 1 + 1 + 1); // #194 R6 // #191 R11 // #201 R13` pasa a `toHaveLength(16 + 1 + 1 + 1 + 4); // #194 R6 // #191 R11 // #201 R13 // #214 R13, R15, R18, R20`. El `toHaveLength(1); // #177 R10` de `primaryRadius` no cambia. El título gana ` (enmendado por #214 R13, R15, R18, R20)`.
   - `grep -cF 'toHaveLength(16 + 1 + 1 + 1); // #194 R6 // #191 R11 // #201 R13' src/__tests__/consistency-classnames.test.ts`: 1 → 0
   - `grep -cF 'toHaveLength(16 + 1 + 1 + 1 + 4); // #194 R6 // #191 R11 // #201 R13 // #214 R13, R15, R18, R20' src/__tests__/consistency-classnames.test.ts`: 0 → 1
   - `grep -cF 'expect(primaryRadius).toHaveLength(1); // #177 R10' src/__tests__/consistency-classnames.test.ts`: 1 → 1
   - `grep -cF "en un único radio (enmendado por #177 R10) (enmendado por #201 R13) (enmendado por #214 R13, R15, R18, R20)', () => {" src/__tests__/consistency-classnames.test.ts`: 0 → 1
18. **`src/__tests__/consistency-classnames.test.ts`** · it('profile usa los glifos de reicon sin ChevronRight (#173 R10)') · R4, R6
   - Cambio: El título pasa a `'profile usa los glifos de reicon y ChevronRight solo en la tarjeta ancha (#173 R10) (enmendado por #214 R4, R6)'`. La cadena del `toContain` del import pasa a `"import { Bell, Camera, ChevronRight, FileText, Key, Map as MapIcon, Plus, Users, Wifi } from 'reicon-react-native';", // #214 R4, R6` (F4). `expect(profile.match(/ChevronRight/g)).toBeNull();` pasa a `expect(profile.match(/ChevronRight/g)).toHaveLength(2); // #214 R4`: el import y el único `<ChevronRight` de `ProfileWideTile`.
   - `grep -cF 'ChevronRight, FileText, Key, Map as MapIcon, Plus, Users, Wifi } from' src/__tests__/consistency-classnames.test.ts`: 0 → 1
   - `grep -cF 'expect(profile.match(/ChevronRight/g)).toBeNull();' src/__tests__/consistency-classnames.test.ts`: 1 → 0
   - `grep -cF 'expect(profile.match(/ChevronRight/g)).toHaveLength(2); // #214 R4' src/__tests__/consistency-classnames.test.ts`: 0 → 1
   - `grep -cF "ChevronRight solo en la tarjeta ancha (#173 R10) (enmendado por #214 R4, R6)', () => {" src/__tests__/consistency-classnames.test.ts`: 0 → 1
19. **`src/__tests__/consistency-classnames.test.ts`** · it('da color temático a los cinco placeholders') (#62 R12) · R18
   - Cambio: El título pasa a `'da color temático a los seis placeholders (enmendado por #214 R18)'`. `expect(textInputs).toHaveLength(6);` pasa a `expect(textInputs).toHaveLength(6 + 1); // #214 R18` y `expect(withPlaceholder).toHaveLength(5);` a `expect(withPlaceholder).toHaveLength(5 + 1); // #214 R18`.
   - `grep -cF 'expect(textInputs).toHaveLength(6);' src/__tests__/consistency-classnames.test.ts`: 1 → 0
   - `grep -cF 'expect(textInputs).toHaveLength(6 + 1); // #214 R18' src/__tests__/consistency-classnames.test.ts`: 0 → 1
   - `grep -cF 'expect(withPlaceholder).toHaveLength(5);' src/__tests__/consistency-classnames.test.ts`: 1 → 0
   - `grep -cF 'expect(withPlaceholder).toHaveLength(5 + 1); // #214 R18' src/__tests__/consistency-classnames.test.ts`: 0 → 1
   - `grep -cF "da color temático a los seis placeholders (enmendado por #214 R18)', () => {" src/__tests__/consistency-classnames.test.ts`: 0 → 1
20. **`src/__tests__/consistency-classnames.test.ts`** · it('elimina el borde duplicado de los seis campos') (#62 R12) · R18
   - Cambio: Solo el título, que pasa a `'elimina el borde duplicado de los siete campos (enmendado por #214 R18)'`: su cuenta sale de `textInputs`, que ya enmienda la fila anterior.
   - `grep -cF "elimina el borde duplicado de los seis campos', () => {" src/__tests__/consistency-classnames.test.ts`: 1 → 0
   - `grep -cF "elimina el borde duplicado de los siete campos (enmendado por #214 R18)', () => {" src/__tests__/consistency-classnames.test.ts`: 0 → 1
21. **`src/__tests__/consistency-classnames.test.ts`** · it.each(directUses)('%s importa y aplica sus %i esquinas …') (#62 R14) · R4, R18
   - Cambio: En `directUses`: entrada nueva `[join('screens', 'join-pet', 'index.tsx'), 1], // #214 R18` (alfabética, tras `home`); la de Perfil pasa de `3 + 1 + 4 - 7]` a `3 + 1 + 4 - 7 + 1]` y su comentario termina en `; #214 R4: ProfileWideTile`. `pet-members` y `pet-invite` no usan `style={CONTINUOUS_CORNER}`. El título, tras `(enmendado por #220 R15)`, gana ` (enmendado por #214 R4, R18)`.
   - `grep -cF "[join('screens', 'join-pet', 'index.tsx'), 1], // #214 R18" src/__tests__/consistency-classnames.test.ts`: 0 → 1
   - `grep -cF "[join('screens', 'profile', 'index.tsx'), 3 + 1 + 4 - 7]," src/__tests__/consistency-classnames.test.ts`: 1 → 0
   - `grep -cF "[join('screens', 'profile', 'index.tsx'), 3 + 1 + 4 - 7 + 1], // #41 R9; #168 R6; #173 R10: ProfileTile; #214 R4: ProfileWideTile" src/__tests__/consistency-classnames.test.ts`: 0 → 1
   - `grep -cF "(enmendado por #220 R15) (enmendado por #214 R4, R18)', (path, count) => {" src/__tests__/consistency-classnames.test.ts`: 0 → 1
22. **`src/__tests__/consistency-classnames.test.ts`** · it('fusiona la esquina una vez y la entrega a las dos ramas de Card …') (#62 R14, suma) · R4, R18
   - Cambio: La suma comparada con `directUses.reduce` gana una última línea `+ 2 // #214 R4, R18` (Perfil +1, Unirme +1). El título, tras `(enmendado por #220 R15)`, gana ` (enmendado por #214 R4, R18)`. Este `it` y el de la fila siguiente comparten el final `', () => {`, por eso las dos últimas anclas cuentan 2.
   - `grep -cF 'directUses.reduce' src/__tests__/consistency-classnames.test.ts`: 1 → 1
   - `grep -cF '+ 2 // #214 R4, R18' src/__tests__/consistency-classnames.test.ts`: 0 → 2
   - `grep -cF "(enmendado por #220 R15) (enmendado por #214 R4, R18)', () => {" src/__tests__/consistency-classnames.test.ts`: 0 → 2
23. **`src/__tests__/consistency-classnames.test.ts`** · it('deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban …') (#98 R10) · R4, R18
   - Cambio: La suma global de `CONTINUOUS_CORNER` gana una última línea `+ 2 // #214 R4, R18`. El `toHaveLength(5)` de Inicio no cambia (§7.2). El título, tras `(enmendado por #220 R15)`, gana ` (enmendado por #214 R4, R18)`. Con la fila anterior, `+ 2 // #214 R4, R18` pasa de 0 a 2 y `(enmendado por #220 R15) (enmendado por #214 R4, R18)` de 0 a 3 en el fichero.
   - `grep -cF '+ 2 // #214 R4, R18' src/__tests__/consistency-classnames.test.ts`: 0 → 2
   - `grep -cF '(enmendado por #220 R15) (enmendado por #214 R4, R18)' src/__tests__/consistency-classnames.test.ts`: 0 → 3
   - `grep -cF 'toHaveLength(5); // (enmendado por #190 R13) // #198 R2' src/__tests__/consistency-classnames.test.ts`: 1 → 1
24. **`src/__tests__/consistency-classnames.test.ts`** · it('inventaría los diecisiete primarios con labio, fichero a fichero …') (#166 R2) · R13, R15, R18, R20
   - Cambio: Mapa por fichero: entradas nuevas, alfabéticas, `'screens/join-pet/index.tsx': 2, // #214 R18, R20`, `'screens/pet-invite/index.tsx': 1, // #214 R15` y `'screens/pet-members/index.tsx': 1, // #214 R13`. El título gana ` (enmendado por #214 R13, R15, R18, R20)`.
   - `grep -cF "'screens/join-pet/index.tsx': 2, // #214 R18, R20" src/__tests__/consistency-classnames.test.ts`: 0 → 1
   - `grep -cF "'screens/pet-invite/index.tsx': 1, // #214 R15" src/__tests__/consistency-classnames.test.ts`: 0 → 1
   - `grep -cF "'screens/pet-members/index.tsx': 1, // #214 R13" src/__tests__/consistency-classnames.test.ts`: 0 → 1
   - `grep -cF "fichero a fichero (enmendado por #177 R10) (enmendado por #201 R13) (enmendado por #214 R13, R15, R18, R20)', () => {" src/__tests__/consistency-classnames.test.ts`: 0 → 1
25. **`src/__tests__/consistency-classnames.test.ts`** · it('inventaría los cinco secundarios neutros de toda la app …') (#166 R3) · R7, R11, R15, R16, R17
   - Cambio: Lista de ids, alfabética, una por línea: `'home-join-pet-button', // #214 R7`, `'member-leave-sheet-cancel', // #214 R17`, `'member-remove-sheet-cancel', // #214 R11`, `'pet-invite-copy', // #214 R15` y `'pet-members-leave', // #214 R16`. `count(/border-lip-gray/g)` pasa de `toBe(4 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1); //` a `toBe(4 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 4); // #214 R7, R11, R15, R17;` seguido del comentario actual (`pet-members-leave` lleva `border-danger`, no `border-lip-gray`). El título gana ` (enmendado por #214 R7, R11, R15, R16, R17)`.
   - `grep -cF "'home-join-pet-button', // #214 R7" src/__tests__/consistency-classnames.test.ts`: 0 → 1
   - `grep -cF "'member-leave-sheet-cancel', // #214 R17" src/__tests__/consistency-classnames.test.ts`: 0 → 1
   - `grep -cF "'member-remove-sheet-cancel', // #214 R11" src/__tests__/consistency-classnames.test.ts`: 0 → 1
   - `grep -cF "'pet-invite-copy', // #214 R15" src/__tests__/consistency-classnames.test.ts`: 0 → 1
   - `grep -cF "'pet-members-leave', // #214 R16" src/__tests__/consistency-classnames.test.ts`: 0 → 1
   - `grep -cF 'toBe(4 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1); //' src/__tests__/consistency-classnames.test.ts`: 1 → 0
   - `grep -cF 'toBe(4 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 4); // #214 R7, R11, R15, R17' src/__tests__/consistency-classnames.test.ts`: 0 → 1
   - `grep -cF "(enmendado por #203 R7) (enmendado por #214 R7, R11, R15, R16, R17)', () => {" src/__tests__/consistency-classnames.test.ts`: 0 → 1
26. **`src/__tests__/canvas-foundations.test.ts`** · it('#197 R22: no añade dependencias') · R23
   - Cambio: `toHaveLength(44);` pasa a `toHaveLength(44 + 1); // #214 R23: expo-clipboard`. El título gana ` (enmendado por #214 R23)`. Va en el commit verde de R23 (§6).
   - `grep -cF 'toHaveLength(44);' src/__tests__/canvas-foundations.test.ts`: 1 → 0
   - `grep -cF 'toHaveLength(44 + 1); // #214 R23: expo-clipboard' src/__tests__/canvas-foundations.test.ts`: 0 → 1
   - `grep -cF "#197 R22: no añade dependencias (enmendado por #214 R23)', () => {" src/__tests__/canvas-foundations.test.ts`: 0 → 1
27. **`src/__tests__/zones-canvas-fidelity.test.ts`** · it('#202 R25: package.json no añade dependencias') · R23
   - Cambio: Igual que la fila anterior: `toHaveLength(44);` pasa a `toHaveLength(44 + 1); // #214 R23: expo-clipboard` y el título gana ` (enmendado por #214 R23)`. Mismo commit verde de R23.
   - `grep -cF 'toHaveLength(44);' src/__tests__/zones-canvas-fidelity.test.ts`: 1 → 0
   - `grep -cF 'toHaveLength(44 + 1); // #214 R23: expo-clipboard' src/__tests__/zones-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "#202 R25: package.json no añade dependencias (enmendado por #214 R23)', () => {" src/__tests__/zones-canvas-fidelity.test.ts`: 0 → 1
28. **`src/__tests__/alerts-canvas-fidelity.test.ts`** · it.each('limita $token a su inventario de producción …') (#174 R12) · R12, R18
   - Cambio: Fila de `rounded-10`: su lista `files` pasa a terminar en `'screens/meal-schedule/index.tsx', 'screens/pet-members/index.tsx'], // #179 R6; #174 R12; #214 R12`. Fila de `tracking-title`: entrada nueva `'screens/join-pet/index.tsx', // #214 R18` tras `'screens/home/index.tsx', // #198 R15`. El título, tras `(enmendado por #205 R16)`, gana ` (enmendado por #214 R12, R18)`.
   - `grep -cF "'screens/meal-schedule/index.tsx'], // #179 R6; #174 R12" src/__tests__/alerts-canvas-fidelity.test.ts`: 1 → 0
   - `grep -cF "'screens/meal-schedule/index.tsx', 'screens/pet-members/index.tsx'], // #179 R6; #174 R12; #214 R12" src/__tests__/alerts-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "'screens/join-pet/index.tsx', // #214 R18" src/__tests__/alerts-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "(enmendado por #205 R16) (enmendado por #214 R12, R18)', ({ pattern, files }) => {" src/__tests__/alerts-canvas-fidelity.test.ts`: 0 → 1
29. **`src/__tests__/profile-canvas-fidelity.test.ts`** · it('reserva rounded-tile a sus consumidores aprobados (enmendado por #190 R13)') (#173 R2) · R13, R14, R18, R20
   - Cambio: Entradas nuevas, alfabéticas: `'screens/join-pet/index.tsx', // #214 R18, R20` (tras `home`), `'screens/pet-invite/index.tsx', // #214 R14` y `'screens/pet-members/index.tsx', // #214 R13` (tras `pairing`). El título gana ` (enmendado por #214 R13, R14, R18, R20)`. La entrada de `pet-invite` es idéntica a la de la fila siguiente, por eso su ancla cuenta 2.
   - `grep -cF "'screens/join-pet/index.tsx', // #214 R18, R20" src/__tests__/profile-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "'screens/pet-invite/index.tsx', // #214 R14" src/__tests__/profile-canvas-fidelity.test.ts`: 0 → 2
   - `grep -cF "'screens/pet-members/index.tsx', // #214 R13" src/__tests__/profile-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "(enmendado por #190 R13) (enmendado por #214 R13, R14, R18, R20)', () => {" src/__tests__/profile-canvas-fidelity.test.ts`: 0 → 1
30. **`src/__tests__/profile-canvas-fidelity.test.ts`** · it('limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8) …') (#173 R2.4) · R9, R12, R13, R14, R16, R18, R19
   - Cambio: Entradas nuevas, alfabéticas: `'screens/join-pet/index.tsx', // #214 R18, R19` (tras `home`), `'screens/pet-invite/index.tsx', // #214 R14` y `'screens/pet-members/index.tsx', // #214 R9, R12, R13, R16` (tras `pairing`). El título, tras `(enmendado por #198 R5)`, gana ` (enmendado por #214 R9, R12, R13, R14, R16, R18, R19)`. Con la fila anterior, `'screens/pet-invite/index.tsx', // #214 R14` pasa de 0 a 2.
   - `grep -cF "'screens/join-pet/index.tsx', // #214 R18, R19" src/__tests__/profile-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "'screens/pet-invite/index.tsx', // #214 R14" src/__tests__/profile-canvas-fidelity.test.ts`: 0 → 2
   - `grep -cF "'screens/pet-members/index.tsx', // #214 R9, R12, R13, R16" src/__tests__/profile-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "(enmendado por #198 R5) (enmendado por #214 R9, R12, R13, R14, R16, R18, R19)', () => {" src/__tests__/profile-canvas-fidelity.test.ts`: 0 → 1
31. **`src/__tests__/chunky-cta-canvas-fidelity.test.ts`** · datos `CTA_ROWS` (los leen R3.1, R3.2, R3.3, R7.2, R7.4, R7.5 y R8.1) · R13, R15, R18, R20
   - Cambio: Cuatro filas nuevas al final de `CTA_ROWS`, en este orden: `['screens/pet-members/index.tsx', literalId('pet-members-invite-cta'), 'w-full h-14 rounded-16 bg-accent', ['isDisabled={busy}']], // #214 R13`; `['screens/pet-invite/index.tsx', literalId('pet-invite-share'), 'w-full h-14 rounded-16 bg-accent', []], // #214 R15`; `['screens/join-pet/index.tsx', literalId('join-pet-submit'), 'w-full h-14 rounded-16 bg-accent', []], // #214 R18`; `['screens/join-pet/index.tsx', literalId('join-pet-go-home'), 'w-full h-14 rounded-16 bg-accent', ["onPress={() => router.dismissTo('/home')}"]], // #214 R20`. `join-pet-submit` no lleva `isDisabled` en `keeps`: R18 lo escribe en otra forma.
   - `grep -cF "literalId('pet-members-invite-cta'), 'w-full h-14 rounded-16 bg-accent', ['isDisabled={busy}']], // #214 R13" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "literalId('pet-invite-share'), 'w-full h-14 rounded-16 bg-accent', []], // #214 R15" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "literalId('join-pet-submit'), 'w-full h-14 rounded-16 bg-accent', []], // #214 R18" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "literalId('join-pet-go-home'), 'w-full h-14 rounded-16 bg-accent'," src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
32. **`src/__tests__/chunky-cta-canvas-fidelity.test.ts`** · datos `neutralInventory` (lo lee R4.3) · R7, R11, R15, R16, R17
   - Cambio: Cinco ids nuevos, en orden alfabético dentro del array: `'home-join-pet-button'` tras `'geofence-editor-delete'`; `'member-leave-sheet-cancel'` y `'member-remove-sheet-cancel'` tras `'meal-time-edit-${index}'`; `'pet-invite-copy'` y `'pet-members-leave'` tras `'pairing-unpair-cancel'`. La línea termina en `]; // #214 R7, R11, R15, R16, R17`.
   - `grep -cF "'geofence-editor-delete', 'home-join-pet-button', 'meal-time-edit-" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "'member-leave-sheet-cancel', 'member-remove-sheet-cancel', 'pairing-unpair-cancel', 'pet-invite-copy', 'pet-members-leave', 'reminders-delete-cancel'" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "'welcome-have-account']; // #214 R7, R11, R15, R16, R17" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
33. **`src/__tests__/chunky-cta-canvas-fidelity.test.ts`** · datos `radii` (lo lee R7.3) · R7, R11, R13, R15, R16, R17, R18, R20
   - Cambio: `'screens/home/index.tsx': 1,` pasa a `'screens/home/index.tsx': 1 + 1, // #214 R7`; entradas nuevas, alfabéticas: `'screens/join-pet/index.tsx': 2, // #214 R18, R20`, `'screens/pet-invite/index.tsx': 2, // #214 R15` y `'screens/pet-members/index.tsx': 6, // #214 R11, R13, R16, R17`.
   - `grep -cF "'screens/home/index.tsx': 1 + 1, // #214 R7" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "'screens/join-pet/index.tsx': 2, // #214 R18, R20" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "'screens/pet-invite/index.tsx': 2, // #214 R15" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "'screens/pet-members/index.tsx': 6, // #214 R11, R13, R16, R17" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
34. **`src/__tests__/chunky-cta-canvas-fidelity.test.ts`** · `#177 R3.1` · R13, R15, R18, R20
   - Cambio: Solo el título: gana ` (enmendado por #214 R13, R15, R18, R20)` al final. Su cuenta cambia por los datos de las tres filas anteriores.
   - `grep -cF "(enmendado por #202 R15) (enmendado por #214 R13, R15, R18, R20)', (path, anchor, classes, keeps) => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
35. **`src/__tests__/chunky-cta-canvas-fidelity.test.ts`** · `#177 R3.2` · R13, R15, R18, R20
   - Cambio: Solo el título: gana ` (enmendado por #214 R13, R15, R18, R20)` al final. Su cuenta cambia por los datos de las tres filas anteriores.
   - `grep -cF "(enmendado por #189 R13) (enmendado por #214 R13, R15, R18, R20)', (path, anchor) => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
36. **`src/__tests__/chunky-cta-canvas-fidelity.test.ts`** · `#177 R3.3` · R13, R15, R18, R20
   - Cambio: Solo el título: gana ` (enmendado por #214 R13, R15, R18, R20)` al final. Su cuenta cambia por los datos de las tres filas anteriores.
   - `grep -cF "el inventario de Button con bg-accent está cerrado (enmendado por #214 R13, R15, R18, R20)', () => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
37. **`src/__tests__/chunky-cta-canvas-fidelity.test.ts`** · `#177 R4.3` · R7, R11, R15, R16, R17
   - Cambio: Solo el título: gana ` (enmendado por #214 R7, R11, R15, R16, R17)` al final. Su cuenta cambia por los datos de las tres filas anteriores.
   - `grep -cF "(enmendado por #203 R7) (enmendado por #214 R7, R11, R15, R16, R17)', () => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
38. **`src/__tests__/chunky-cta-canvas-fidelity.test.ts`** · `#177 R7.4` · R13, R15, R18
   - Cambio: Solo el título: gana ` (enmendado por #214 R13, R15, R18)` al final. Su cuenta cambia por los datos de las tres filas anteriores.
   - `grep -cF "(enmendado por #201 R13) (enmendado por #214 R13, R15, R18)', () => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
39. **`src/__tests__/chunky-cta-canvas-fidelity.test.ts`** · `#177 R6.2: recuentos de etiquetas …` · R13, R15, R18, R20
   - Cambio: `count(/text-17/g)` pasa a `toBe(8 + 15 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 4);` y la etiqueta `text-17 font-extrabold text-accent-foreground` a `toBe(5 + 11 + 1 + 1 - 1 - 1 + 4);`; ambas líneas terminan en ` // #214 R13, R15, R18, R20`. El título, tras `(enmendado por #196 R6)`, gana ` (enmendado por #214 R13, R15, R18, R20)`.
   - `grep -cF 'toBe(8 + 15 + 1 + 1 + 1 + 1 + 1 + 1 + 1);' src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 1 → 0
   - `grep -cF 'toBe(8 + 15 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 4);' src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF 'toBe(5 + 11 + 1 + 1 - 1 - 1);' src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 1 → 0
   - `grep -cF 'toBe(5 + 11 + 1 + 1 - 1 - 1 + 4);' src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "(enmendado por #196 R6) (enmendado por #214 R13, R15, R18, R20)', () => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
40. **`src/__tests__/chunky-cta-canvas-fidelity.test.ts`** · `#177 R7.1: inventarios de los labios de borde restantes …` · R7, R11, R15, R17
   - Cambio: `toBe(10 + 1 + 1); // #189 R13; #203 R7: +1` pasa a `toBe(10 + 1 + 1 + 4); // #189 R13; #203 R7: +1 // #214 R7, R11, R15, R17`. El título gana ` (enmendado por #214 R7, R11, R15, R17)`.
   - `grep -cF 'toBe(10 + 1 + 1); // #189 R13; #203 R7: +1' src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 1 → 0
   - `grep -cF 'toBe(10 + 1 + 1 + 4); // #189 R13; #203 R7: +1 // #214 R7, R11, R15, R17' src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "(enmendado por #203 R7) (enmendado por #214 R7, R11, R15, R17)', () => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
41. **`src/__tests__/chunky-cta-canvas-fidelity.test.ts`** · `#177 R7.2: inventarios de las dos recetas de primario …` · R13, R15, R18, R20
   - Cambio: En el mapa de `rounded-16 bg-accent`, la condición `path === 'screens/add-pet/index.tsx' ? 2 : 1` pasa a `path === 'screens/add-pet/index.tsx' || path === 'screens/join-pet/index.tsx' ? 2 : 1`. El título gana ` (enmendado por #214 R13, R15, R18, R20)`.
   - `grep -cF "'screens/join-pet/index.tsx' ? 2 : 1])), 'screens/map/index.tsx': 1 }); // #201 R13" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "(enmendado por #201 R13) (enmendado por #214 R13, R15, R18, R20)', () => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
42. **`src/__tests__/chunky-cta-canvas-fidelity.test.ts`** · `#177 R7.3: inventario de los veintisiete radios de dieciséis …` · R7, R11, R13, R15, R16, R17, R18, R20
   - Cambio: El total `count(/\brounded-16\b/g)` gana `+ 11` al final de la suma y su comentario empieza por `// #214 R7, R11, R13, R15, R16, R17, R18, R20 (+11)`, seguido del actual. El título, tras `(enmendado por #205 R13)`, gana ` (enmendado por #214 R7, R11, R13, R15, R16, R17, R18, R20)`.
   - `grep -cF '+ 1 + 1 + 1 + 1 + 11); // #214 R7, R11, R13, R15, R16, R17, R18, R20 (+11)' src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "(enmendado por #205 R13) (enmendado por #214 R7, R11, R13, R15, R16, R17, R18, R20)', () => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
43. **`src/__tests__/chunky-cta-canvas-fidelity.test.ts`** · `#177 R7.5: inventario de los tres estilos y el tile …` · R7, R11, R13, R15, R16, R17, R18, R20
   - Cambio: Las dos condiciones de primario ganan `|| path === 'screens/join-pet/index.tsx'` antes de `? 2 : 1` (la de `style=` y la de `chunkyLip.primary\b`, que ya lleva `forgot`). El inventario de `chunkyLip.neutral` añade, tras `['screens/meal-schedule/index.tsx', 1]`, `['screens/home/index.tsx', 1], ['screens/pet-invite/index.tsx', 1], ['screens/pet-members/index.tsx', 3]`. El título, tras `(enmendado por #201 R13)`, gana ` (enmendado por #214 R7, R11, R13, R15, R16, R17, R18, R20)`. Con R7.2, `path === 'screens/add-pet/index.tsx' || path === 'screens/join-pet/index.tsx' ? 2 : 1` pasa de 0 a 3 en el fichero y `path === 'screens/add-pet/index.tsx' ? 2 : 1` de 3 a 0.
   - `grep -cF "path === 'screens/add-pet/index.tsx' || path === 'screens/join-pet/index.tsx' ? 2 : 1" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 3
   - `grep -cF "path === 'screens/add-pet/index.tsx' ? 2 : 1" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 3 → 0
   - `grep -cF "path === 'screens/forgot/index.tsx' || path === 'screens/add-pet/index.tsx' || path === 'screens/join-pet/index.tsx' ? 2 : 1" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "['screens/home/index.tsx', 1], ['screens/pet-invite/index.tsx', 1], ['screens/pet-members/index.tsx', 3]" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "(enmendado por #201 R13) (enmendado por #214 R7, R11, R13, R15, R16, R17, R18, R20)', () => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
44. **`src/__tests__/chunky-cta-canvas-fidelity.test.ts`** · `#177 R8.1: solo la tabla recibe chunkyLip.%s …` (`it.each`) · R7, R11, R13, R15, R16, R17, R18, R20
   - Cambio: La fila `neutral` pasa de `[...neutralIds, 'add-meal-time-button'].sort()` a `[...neutralIds, 'add-meal-time-button', 'home-join-pet-button', 'member-leave-sheet-cancel', 'member-remove-sheet-cancel', 'pet-invite-copy', 'pet-members-leave'].sort()`; la fila `primary` no se edita (crece por `CTA_ROWS`). El título, tras `(enmendado por #196 R5)`, gana ` (enmendado por #214 R7, R11, R13, R15, R16, R17, R18, R20)`. Con R7.3 y R7.5, `(enmendado por #214 R7, R11, R13, R15, R16, R17, R18, R20)` pasa de 0 a 3 en el fichero.
   - `grep -cF "[...neutralIds, 'add-meal-time-button'].sort()" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 1 → 0
   - `grep -cF "[...neutralIds, 'add-meal-time-button', 'home-join-pet-button', 'member-leave-sheet-cancel', 'member-remove-sheet-cancel', 'pet-invite-copy', 'pet-members-leave'].sort()" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF "(enmendado por #196 R5) (enmendado por #214 R7, R11, R13, R15, R16, R17, R18, R20)', (style, ids) => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 1
   - `grep -cF '(enmendado por #214 R7, R11, R13, R15, R16, R17, R18, R20)' src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 3
45. **`src/__tests__/chunky-cta-canvas-fidelity.test.ts`** · agregado de títulos `R3.1`, `R3.2`, `R3.3`, `R6.2` y `R7.2` · R13, R15, R18, R20
   - Cambio: Control de las filas anteriores: el sufijo aparece en cinco títulos.
   - `grep -cF '(enmendado por #214 R13, R15, R18, R20)' src/__tests__/chunky-cta-canvas-fidelity.test.ts`: 0 → 5
46. **`src/__tests__/ui-copy-table.ts`** · bloque `R21_PET_MEMBERS` y `it('#194 R5: cuadra ALL_USES con la suma de sus bloques (enmendado por #220 R16)')` · R22
   - Cambio: Bloque nuevo `export const R21_PET_MEMBERS: UseRow[] = [ // #214 R22` tras `R18_DATE_FIELD` (o tras el último bloque existente al mergear), con las filas de R22. En `ALL_USES`, tras `  ...R18_DATE_FIELD,`, la línea `  ...R21_PET_MEMBERS, // #214 R22`. En `blocks`, `      R16_WELCOME, R17_EDIT_PROFILE, R18_DATE_FIELD,` pasa a `      R16_WELCOME, R17_EDIT_PROFILE, R18_DATE_FIELD, R21_PET_MEMBERS, // #214 R22`. El título gana ` (enmendado por #214 R22)`.
   - `grep -cF 'export const R21_PET_MEMBERS: UseRow[] = [ // #214 R22' src/__tests__/ui-copy-table.ts`: 0 → 1
   - `grep -cF '  ...R21_PET_MEMBERS, // #214 R22' src/__tests__/ui-copy-table.ts`: 0 → 1
   - `grep -cF '  ...R18_DATE_FIELD,' src/__tests__/ui-copy-table.ts`: 1 → 1
   - `grep -cF 'R16_WELCOME, R17_EDIT_PROFILE, R18_DATE_FIELD, R21_PET_MEMBERS, // #214 R22' src/__tests__/ui-copy-table.ts`: 0 → 1
   - `grep -cF "cuadra ALL_USES con la suma de sus bloques (enmendado por #220 R16)', () => {" src/__tests__/ui-copy-table.ts`: 1 → 0
   - `grep -cF "cuadra ALL_USES con la suma de sus bloques (enmendado por #220 R16) (enmendado por #214 R22)', () => {" src/__tests__/ui-copy-table.ts`: 0 → 1
47. **`src/__tests__/ui-language.test.ts`** · `it('#194 R5: no deja ningún valor fijo del catálogo como literal entero en las pantallas …')` e import · R22
   - Cambio: `  R21_PET_MEMBERS,` entra en el import de `./ui-copy-table`. En la fórmula de `SCREEN_FILES`, tras `+ 1 // #220 R16: components/date-field.tsx`, la línea `        + 3 // #214 R22: screens/pet-members, screens/pet-invite y screens/join-pet`. El título, tras `(enmendado por #220 R16)`, gana ` (enmendado por #214 R22)`. El `describe('#214 R22: copy de Familia', …)` nuevo va al final del fichero (R22).
   - `grep -cF '  R21_PET_MEMBERS,' src/__tests__/ui-language.test.ts`: 0 → 1
   - `grep -cF '+ 1 // #220 R16: components/date-field.tsx' src/__tests__/ui-language.test.ts`: 1 → 1
   - `grep -cF '+ 3 // #214 R22: screens/pet-members, screens/pet-invite y screens/join-pet' src/__tests__/ui-language.test.ts`: 0 → 1
   - `grep -cF "(enmendado por #199 R1) (enmendado por #220 R16)', () => {" src/__tests__/ui-language.test.ts`: 1 → 0
   - `grep -cF "(enmendado por #199 R1) (enmendado por #220 R16) (enmendado por #214 R22)', () => {" src/__tests__/ui-language.test.ts`: 0 → 1
48. **`src/providers/__tests__/language-provider.test.tsx`** · `it('#194 R1: mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas … (enmendado por #220 R16)')` · R22
   - Cambio: La última línea de la suma, `        + 5 - 2, // #220 R16`, pierde la coma y queda `        + 5 - 2 // #220 R16`; debajo, la línea `        + 51, // #214 R22` (las 51 claves de design.md §5). El título, tras `(enmendado por #220 R16)`, gana ` (enmendado por #214 R22)`. Candado fuera de la corrida de jest de la auditoría (`src/providers`); lo encontró la corrida complementaria.
   - `grep -cF '        + 5 - 2, // #220 R16' src/providers/__tests__/language-provider.test.tsx`: 1 → 0
   - `grep -cF '        + 5 - 2 // #220 R16' src/providers/__tests__/language-provider.test.tsx`: 0 → 1
   - `grep -cF '        + 51, // #214 R22' src/providers/__tests__/language-provider.test.tsx`: 0 → 1
   - `grep -cF "(enmendado por #202 R18) (enmendado por #220 R16)', () => {" src/providers/__tests__/language-provider.test.tsx`: 1 → 0
   - `grep -cF "(enmendado por #202 R18) (enmendado por #220 R16) (enmendado por #214 R22)', () => {" src/providers/__tests__/language-provider.test.tsx`: 0 → 1
49. **`src/hooks/use-pet-selection.test.tsx`** · `it('R2.4: solo proveedor y hook mencionan clearPet en producción')` (#181 R2) · R17
   - Cambio: R17 llama a `clearPet()` desde `src/screens/pet-members/index.tsx`. El título pasa a `'R2.4: solo proveedor, hook y Familia mencionan clearPet en producción (enmendado por #214 R17)'` y la aserción a `expect(writers).toEqual(['hooks/use-pet-selection.ts', 'providers/selected-pet-provider.tsx', 'screens/pet-members/index.tsx']); // #214 R17`. `join-pet` usa `selectPet`, no `clearPet`, y no entra. Candado fuera de la corrida de la auditoría (`src/hooks`).
   - `grep -cF "solo proveedor y hook mencionan clearPet en producción', () => {" src/hooks/use-pet-selection.test.tsx`: 1 → 0
   - `grep -cF "solo proveedor, hook y Familia mencionan clearPet en producción (enmendado por #214 R17)', () => {" src/hooks/use-pet-selection.test.tsx`: 0 → 1
   - `grep -cF "expect(writers).toEqual(['hooks/use-pet-selection.ts', 'providers/selected-pet-provider.tsx']);" src/hooks/use-pet-selection.test.tsx`: 1 → 0
   - `grep -cF "'providers/selected-pet-provider.tsx', 'screens/pet-members/index.tsx']); // #214 R17" src/hooks/use-pet-selection.test.tsx`: 0 → 1

**Anclas de producción y entorno** (base → esperado tras implementar):

- P1. `grep -cF "import { Bell, Camera, FileText, Map as MapIcon, Plus, Wifi } from 'reicon-react-native';" src/screens/profile/index.tsx`: 1 → 0. F4: el import viejo desaparece.
- P2. `grep -cF "import { Bell, Camera, ChevronRight, FileText, Key, Map as MapIcon, Plus, Users, Wifi } from 'reicon-react-native';" src/screens/profile/index.tsx`: 0 → 1. F4: import literal y ordenado.
- P3. `grep -cF "useThemeColors(['category-blue-strong', 'category-green-strong', 'category-amber-strong', 'category-violet-strong', 'accent-strong', 'accent-foreground']);" src/screens/profile/index.tsx`: 1 → 0. R4: el hook de color viejo desaparece.
- P4. `grep -cF "const [blue, green, amber, violet, rose, accentStrong, accentForeground] = useThemeColors(['category-blue-strong', 'category-green-strong', 'category-amber-strong', 'category-violet-strong', 'category-rose-strong', 'accent-strong', 'accent-foreground']);" src/screens/profile/index.tsx`: 0 → 1. R4: `rose` entra entre `violet` y `accentStrong`.
- P5. `grep -cF '#214' src/screens/profile/index.tsx`: 0 → 0. Sin comentarios `#214` en producción: `#173 R15` cuenta `#NNN` como hex.
- P6. `grep -cF '#214' src/screens/home/index.tsx`: 0 → 0. Igual por `#190 R12`.
- P7. `grep -cF 'backgroundStyle={{ backgroundColor: surface }}' src/screens/pairing/index.tsx`: 1 → 1. Llega con #218 (Paso 0); #214 no lo toca.
- P8. `grep -cF 'backgroundStyle={{ backgroundColor: surface }}' src/screens/reminders/index.tsx`: 1 → 1. Igual.
- P9. `grep -cF 'items-center gap-3 bg-surface px-5 pb-9 pt-3' src/screens/pairing/index.tsx`: 1 → 1. Igual.
- P10. `grep -cF 'items-center gap-3 bg-surface px-5 pb-9 pt-3' src/screens/reminders/index.tsx`: 1 → 1. Igual.
- P11. `grep -cF '<BottomSheet index=' src/screens/pet-members/index.tsx`: 0 → 2. F1: dos hojas (R11, R17).
- P12. `grep -cF 'backgroundStyle={{ backgroundColor: surface }}' src/screens/pet-members/index.tsx`: 0 → 2. F1.
- P13. `grep -cF "const [surface] = useThemeColors(['surface']);" src/screens/pet-members/index.tsx`: 0 → 1. F1: un solo hook para las dos hojas.
- P14. `grep -cF 'items-center gap-3 bg-surface px-5 pb-9 pt-3' src/screens/pet-members/index.tsx`: 0 → 2. F1: View interior de cada hoja.
- P15. `grep -cF '<Button testID="meal-schedule-retry" onPress={retryAll}>' src/screens/meal-schedule/index.tsx`: 1 → 1. A14: modelo que copia el reintento de Familia; #214 no lo toca.
- P16. `grep -cF '<Button testID="pet-members-retry" onPress={retryAll}>' src/screens/pet-members/index.tsx`: 0 → 1. A14: sin labio, misma etiqueta de apertura que Horario. (la semilla mide 0: desviación de la semilla, no de la spec)
- P17. `grep -cF '"expo-clipboard"' package.json`: 0 → 1. R23 (§6).
- P18. `grep -cF "jest.mock('expo-clipboard', () => ({ setStringAsync: jest.fn() }));" test/jest-setup.js`: 0 → 1. F2/§6: único doble de expo-clipboard del repo. Va sin la opción virtual: `#207 R2` solo recorre `src/**/*.test.ts(x)` y no mira `test/`, pero la causa del flake de #207 (mapa de IDs de módulo envenenado) vale igual para un módulo instalado. (la semilla mide 0: desviación de la semilla, no de la spec)
- P19. `grep -cF 'virtual' test/jest-setup.js`: 0 → 0. Mismo motivo que la fila anterior; ningún candado lo cuenta, lo cuenta esta ancla. (la semilla mide 1: desviación de la semilla, no de la spec)
- P20. `grep -cF "'members.leaveBodyNoOwner'" src/i18n/catalog.ts`: 0 → 2. H2: variante sin propietario, es-MX y en-US.

### 7.2 Candados que no cambian

Ninguno de estos se edita. Si alguno se pone rojo, la producción no sigue la spec.

- `src/__tests__/profile-canvas-fidelity.test.ts`: listas de `text-26`,
  `rounded-hero` y `Card` hero; `#173 R15: grep-limpio` (todo `#` seguido de tres
  dígitos cuenta como hex en Perfil: P5).
- `src/__tests__/home-pingo-phrase.test.ts` `#190 R12: los ficheros de la frase
  permanecen grep-clean`: lo mismo en Inicio (P6).
- `src/__tests__/no-pets-states.test.ts` `#181 R8.2` (un solo `<EmptyState` en
  Perfil, dos en Recordatorios: la tarjeta de R6 no es `EmptyState`) y `#181 R8.3`
  (sin `#NNN` sin `R<n>`, sin `text-accent` a secas, sin `StyleSheet` y sin
  valores arbitrarios `-[…]` en Inicio, Recordatorios y Perfil).
- `src/__tests__/consistency-classnames.test.ts`:
  - `bg-accent-soft`, `rounded-xl bg-accent` y `rounded-(2xl|lg|md|sm)` = `[]`;
  - `home.match(/style=\{CONTINUOUS_CORNER\}/g)` = 5
    (`grep -cF 'toHaveLength(5); // (enmendado por #190 R13) // #198 R2' src/__tests__/consistency-classnames.test.ts`
    1 → 1): el botón de R7 no lleva `CONTINUOUS_CORNER`;
  - `#64 R9: el color categórico solo se nombra en el módulo de paleta`: el rosa de
    R4 llega como `${CATEGORY_SLOTS.rose.ink}` y `useThemeColors([... 'category-rose-strong' ...])`
    (P4), nunca como literal `text-category-*` / `bg-category-*` en la pantalla.
- `src/__tests__/canvas-foundations.test.ts`
  `#197 R4: ningún fichero de producción usa tracking-tight (enmendado por #200 R1)`.
- `src/__tests__/chunky-cta-canvas-fidelity.test.ts`
  `#177 R8.4: destructivos, tonales y reintentos no reciben labio …`: lo cumple
  `pet-members-retry` (A14: misma etiqueta de apertura que el reintento de Horario,
  P15 y P16, sin `chunkyLip` ni `border-b-`).
- `src/app/__tests__/layout.test.tsx`
  `'#194 R4: edit-profile es la última pantalla protegida'` (`.at(-1)`): las tres
  rutas de #214 van antes de `edit-profile`. Si #209 entra antes, su enmienda es de
  #209 (§7.3).
- `src/__tests__/ui-language.test.ts` `R7_PROFILE`
  (`toHaveLength(35 - 1 + 2 + …)`): las filas nuevas de Perfil e Inicio van en
  `R21_PET_MEMBERS` con su `file` real.
- `src/__tests__/jest-virtual-mock-lock.test.ts` `#207 R1` y `#207 R2`: ningún test
  nuevo de `src/` pasa la opción `virtual` a `jest.mock`.
- `src/__tests__/sheet-surface-background.test.ts`: el
  `toContain("const [surface] = useThemeColors(['surface']);")` del `it.each` no se
  edita (Familia lo cumple con un solo hook para sus dos hojas, P13).
- **`border-danger`** no tiene inventario propio. `pet-members-leave` (R16) es
  `variant="outline"` con `border-2 border-danger` y `style={chunkyLip.neutral}`;
  lo cuentan los inventarios de neutros (filas 25, 32 y 44) y el de
  `chunkyLip.neutral` (fila 43), pero no el de `border-lip-gray` (fila 25 suma
  `+ 4`, no `+ 5`). El borde de error de `join-pet-code` (R19) es una clase de
  estado (`'border-danger'`) y ningún candado la cuenta.
- **Cancelar de las hojas**: `member-remove-sheet-cancel` (R11) y
  `member-leave-sheet-cancel` (R17) son neutros con `border-lip-gray`; entran en
  las filas 25, 32, 40 y 44. Sus destructivos (`member-remove-sheet-confirm`,
  `member-leave-sheet-confirm`) son `bg-danger` con `style={chunkyLip.danger}`,
  como los de Vinculación y Recordatorios: ningún candado cuenta `bg-danger` ni
  `chunkyLip.danger`, y su `rounded-16` ya está en las filas 15, 33 y 42.

### 7.3 Merge con specs paralelas

**Paso 0 (#218 primero).** #218 (`mobile-sheet-surface`) mergea en `dev` antes que
#214. La rama de #214 hace `git merge origin/dev` (nunca rebase), re-mide todas las
anclas de §7.1 y P1–P20 y solo entonces empieza. #218 comparte con #214 un solo
fichero, `src/__tests__/sheet-surface-background.test.ts` (filas 13 y 14): #214
amplía a tres la lista cerrada de importadores que #218 deja en dos.

**Regla general.** Quien mergee segundo a `dev` hace `git merge origin/dev`,
re-mide cada ancla de los ficheros compartidos y **suma los deltas** de las dos
features sobre la base nueva (base + delta de la otra + delta propio). No
sustituye ni descarta un término ajeno. Si el bloque `R21_*` de
`src/__tests__/ui-copy-table.ts` ya existe con otro nombre, `R21_PET_MEMBERS` pasa
al siguiente número libre (#208 reserva `R19_VACCINE_CREATE` y #209
`R20_NUTRITION_QUESTIONNAIRE`).

Ficheros que #214 comparte con cada hermana:

| Hermana | Ficheros compartidos con #214 | Qué re-mide quien mergee segundo |
|---|---|---|
| #217 | `src/app/_layout.tsx`, `src/app/__tests__/layout.test.tsx`, `package.json`, `bun.lock`, `src/screens/home/index.tsx` y su test, `src/screens/profile/index.tsx` y su test, `src/app/(tabs)/__tests__/screens.test.tsx`, `src/__tests__/design-drift.test.ts` | #217 quita dos dependencias (`bun remove`): si entra antes, filas 26 y 27 pasan a `44 - 2 + 1`. Cabecera `<HeroStatusBar />` en Inicio y Perfil: re-medir P1–P6 y las filas 6–10. |
| #208 | `src/app/_layout.tsx`, `layout.test.tsx`, `detail-stack.guard.test.tsx`, `src/api/query-keys.ts`, `src/i18n/catalog.ts`, `ui-copy-table.ts`, `ui-language.test.ts`, `alerts-canvas-fidelity`, `chunky-cta-canvas-fidelity`, `consistency-classnames`, `design-drift`, `profile-canvas-fidelity` | `pets/[petId]/vaccines/new` entra tras `meals-history`: +1 hijo en las filas 1–4. Sumas de inventarios de las filas 15–45 y 46–47. |
| #209 | `src/app/_layout.tsx`, `layout.test.tsx`, `catalog.ts`, `ui-copy-table.ts`, `ui-language.test.ts`, `design-drift`, `consistency-classnames`, `chunky-cta-canvas-fidelity`, `alerts-canvas-fidelity`, `profile-canvas-fidelity`, `src/providers/__tests__/language-provider.test.tsx`, `src/screens/meal-schedule/index.tsx` y su test | `nutrition-profile` entra justo tras `edit-profile` y la enmienda de `.at(-1)` es de #209. `#194 R1` (fila 48): #209 suma `+ 77`; con las dos, `+ 51` y `+ 77` en líneas propias. #209 toca Horario: re-medir P15 (modelo de A14). |
| #213 | `alerts-canvas-fidelity`, `chunky-cta-canvas-fidelity`, `consistency-classnames`, `design-drift`, `sheet-surface-background`, `ui-copy-table.ts`, `ui-language.test.ts`, `catalog.ts`, `src/screens/home/index.tsx` y su test | Esquinas: #213 suma +1 y #214 +2 a las dos sumas de las filas 22 y 23 (+3 juntas sobre la base). Si #213 entra antes, los fixtures tipados `Reminder` de `src/screens/home/index.test.tsx` llevan `recurrence: null, recurrenceUntil: null` (#214 no crea fixtures `Reminder`; lo detecta `bunx tsc --noEmit`). |
| #218 | `src/__tests__/sheet-surface-background.test.ts` | Paso 0: #218 siempre primero. |

**Hijos del stack protegido (A6).** Las filas 1–4 dan 17 hijos con #214 sola sobre
la base (14 + 3), con `edit-profile` el último. Con #209 dentro son 18 y
`edit-profile` queda penúltimo (`nutrition-profile` es el último); con #208
también, 19. El dueño de la cuenta combinada es quien mergee segundo, que suma
su `+ 1` a la suma que encuentre.

## 8. Alternativas descartadas

- **`ConfirmDialog` para quitar/salir**: el artboard `FamiliaQuitarMiembro` dibuja
  un sheet inferior con avatar; el patrón ya existe en pairing.
- **POST al montar la pantalla Invitar**: cada visita crearía una invitación y
  agotaría el límite de 5.
- **Claves bajo `['pets', …]`**: `removeQueries(petKeys.detail)` y las
  invalidaciones arrastrarían miembros e invitaciones.
- **Hacer pulsable `EmptyState` de Inicio** para unirse: cambiaría un componente
  compartido; R7 añade un bloque hermano.
- **Insertar el guion al escribir**: más lógica de cursor sin ganancia; el
  backend normaliza.
- **Mostrar el código en invitaciones pendientes**: el backend no lo devuelve
  tras el 201.
