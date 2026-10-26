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
  La v140 no se puede fijar como versión del artifact; los artboards de
  `specs/mobile-pet-members/canvas/` se congelaron desde la versión
  `1793051574-af80`, cuyos literales coinciden con v140 para estas nueve pantallas.
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
  R17), igual que el sheet de desvincular de `src/screens/pairing/index.tsx`
  (`BottomSheet` + `BottomSheetView`, `index` 0 abierto / -1 cerrado). Los tests
  usan el mismo doble que `src/screens/pairing/index.test.tsx`.
- **La pantalla Invitar no hace POST** (R13, R14): Familia crea la invitación y
  pasa `code`, `expiresAt`, `petName` e `inviterName` como parámetros de ruta.
  Así volver atrás e ir otra vez no crea una invitación por visita; el código no
  queda en caché de query.
- **Copiar con `expo-clipboard`** (R15, R23): dependencia nueva declarada,
  instalada con `bunx expo install expo-clipboard` (nunca `npx`, nunca `bun add`
  sin `expo install`). Es módulo nativo: exige rebuild del dev build (G3) antes
  del smoke en dispositivo (G4). Todos los tests que rendericen
  `PetInviteScreen` llevan `jest.mock('expo-clipboard', () => ({ setStringAsync: jest.fn() }))`
  con la implementación por defecto (`mockResolvedValue(undefined)`) en un
  `beforeEach`, porque `restoreAllMocks` borra implementaciones de `jest.fn`.
- **Compartir con `Share` de `react-native`** (R15): sin dependencia nueva. En
  tests, `jest.spyOn(Share, 'share')`.
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
  `CheckCircle`, `Logout`. Colores con `useThemeColors([...])`.

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
- `src/i18n/catalog.ts` — 50 claves × 2 idiomas (R22).
- `package.json`, `bun.lock` — `expo-clipboard` (R23).
- Candados de §7.1 (R24).

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
| `members.leaveTitle` | ¿Salir de {{petName}}? | Leave {{petName}}? |
| `members.leaveBody` | Para volver necesitarás una invitación nueva. | To come back, you'll need a new invite. |
| `members.leaveConfirm` | Salir | Leave |
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

Total: 4 + 28 + 10 + 8 = **50 claves**. Claves reutilizadas (no se crean):
`common.cannotReachServer`, `common.somethingWentWrong`, `common.retry`,
`forgot.tooManyAttempts`.

### 5.1 Copy sin artboard

| Clave o texto | Motivo |
|---|---|
| Todas las columnas en-US | Los artboards solo están en es-MX; traducción propia. |
| `profile.membersSummaryAlone`, `profile.membersSummaryOne` | `PerfilFamilia` solo dibuja el caso «Tú y 2 personas más cuidan a Rocky»; las otras dos ramas de R5 hacen falta para 1 y 2 miembros. |
| `members.removeA11y`, `members.revokeA11y` | Etiquetas de accesibilidad; los botones visibles dicen solo «Quitar» / «Revocar» y hace falta distinguir fila. |
| `members.leaveTitle`, `members.leaveBody`, `members.leaveConfirm` | No hay artboard del sheet de salir; sigue la forma del de quitar. |
| `members.invitesLimit`, `members.membersLimit` | Los 409 de límite no tienen artboard. El 5 de `invitesLimit` es el límite del backend #211. |
| `invite.copied` | Estado posterior al toque de «Copiar código», no dibujado. |
| Tarjeta «Unirme con código» de Perfil | Reutiliza `joinPet.title` y `joinPet.invitedPrompt`; no crea claves. |
| Placeholder `XXXXX-XXXXX` | Literal del artboard `UnirmeConCodigo`, en código (no traducible). |

### 5.2 Desviación de género (a confirmar al firmar)

Dos literales del artboard asumen el género de la persona; la spec usa variantes
neutras. **El leader confirma con el humano al firmar** si se aceptan:

| Clave | Artboard | Spec |
|---|---|---|
| `members.removeBody` | «… Podrás invitarlo otra vez.» | «… Podrás enviarle otra invitación cuando quieras.» |
| `members.ownerNote` | «… Solo ella puede invitar o quitar personas.» | «{{ownerName}} administra a {{petName}} y es quien puede invitar o quitar personas.» |

## 6. Dependencia y entorno

- `expo-clipboard`: `cd mobile-pet-tracker && bunx expo install expo-clipboard`.
  Commit propio antes del test de R15 (`chore(mobile): add expo-clipboard (R23)`),
  con `package.json` y `bun.lock`. Tras instalar, `bunx tsc --noEmit` y
  `bunx expo lint --no-cache`.
- G3 (no delegado): rebuild del dev build Android antes de G4 (smoke en dispositivo).
- Doble global: `test/jest-setup.js` (el `setupFilesAfterEnv` de `package.json`)
  añade `jest.mock('expo-clipboard', () => ({ setStringAsync: jest.fn() }));`.
  Así ninguna suite que cargue `src/app/pets/[petId]/invite.tsx` por el árbol de
  rutas (`layout.test.tsx`, `detail-stack.guard.test.tsx`, tests de pestañas) toca
  el módulo nativo. `src/screens/pet-invite/index.test.tsx` fija en su
  `beforeEach` `jest.mocked(Clipboard.setStringAsync).mockResolvedValue(true)` y
  sobreescribe con `mockRejectedValue` en el `it` de fallo. `Share` no necesita
  doble global (`jest.spyOn(Share, 'share')` en el test de la pantalla).

## 7. Candados

### 7.1 Enmiendas obligatorias (R24)

Cada fila: fichero, ancla con su cuenta antes → después, y cambio.

| Fichero | Ancla (`grep -cF`) | Cambio |
|---|---|---|
| `src/app/__tests__/layout.test.tsx` | `'expect(children).toHaveLength('` 5 → 5 | Las cuatro sumas que hoy dan 14 (`8 + 1 + …`, `9 + 1 + …`, `10 + 1 + …`, `11 + 1 + …`, comentadas `// #194 R4 // #185 R10 …`) suman `+ 3` con `// #214 R3`. La de `5 + 1` (`// #118 R3`) no cambia. |
| `src/app/__tests__/detail-stack.guard.test.tsx` | `"'/edit-profile', // #194 R4"` 2 → 2; `'/join-pet'` 0 → 1 | Añadir `'/pets/pet-1/members', '/pets/pet-1/invite', '/join-pet', // #214 R3` antes de `'/edit-profile', // #194 R4` del `it.each` `'#194 R4: cierra sesión en %s, aterriza en welcome y no reabre el detalle'`. |
| `src/screens/home/index.test.tsx` | `"toEqual(['home-empty'])"` 2 → 0; `"toEqual(['home-empty', 'home-join-pet'])"` 0 → 2 | Los dos `it` que listan los hijos del vacío añaden `(enmendado por #214 R7)` al título. |
| `src/screens/profile/index.test.tsx` | `'con mascota ordena dos filas de dos tiles'` 1 → 1; `'sin mascota deja recordatorios solo y a ancho completo'` 1 → 1 | El primero pasa de 2 a 4 filas (`profile-links-row-0..3`); el segundo de 1 a 2 (`profile-links-row-0..1`). Ambos títulos con `(enmendado por #214 R4, R6)`. Se añade `jest.mock('../../api/pet-members')` con `listPetMembers.mockResolvedValue({ kind: 'error' })` en `beforeEach`. |
| `src/app/(tabs)/__tests__/screens.test.tsx` | `"jest.mock('../../../api/pet-members')"` 0 → 1 | Mismo doble que Perfil, para que la pestaña Perfil no haga red. |
| `src/__tests__/profile-canvas-fidelity.test.ts` | `"'screens/join-pet/index.tsx'"` 0 → 2; `"'screens/pet-invite/index.tsx'"` 0 → 2; `"'screens/pet-members/index.tsx'"` 0 → 2 | Lista de `rounded-tile`: añadir los tres ficheros en orden alfabético con `// #214 R12, R14, R18`. Lista de `text-13`: `screens/join-pet/index.tsx` entre `home` y `login`; `screens/pet-invite/index.tsx` y `screens/pet-members/index.tsx` entre `pairing` y `profile`, con `// #214 R10, R14, R18`. |
| `src/__tests__/consistency-classnames.test.ts` (esquinas) | `"[join('screens', 'profile', 'index.tsx'), 3 + 1 + 4 - 7]"` 1 → 0; `"3 + 1 + 4 - 7 + 1]"` 0 → 1; `"[join('screens', 'join-pet', 'index.tsx'), 1], // #214 R18"` 0 → 1; `'+ 2 // #214 R4, R18'` 0 → 1 | En la lista `directUses`: la entrada de Perfil pasa a `3 + 1 + 4 - 7 + 1]` con `// #214 R4: ProfileWideTile` añadido al comentario; entrada nueva `[join('screens', 'join-pet', 'index.tsx'), 1], // #214 R18` (alfabética, tras `home`). En la suma comparada con `directUses.reduce` (`grep -cF 'directUses.reduce'` = 1), última línea `+ 2 // #214 R4, R18`. Los títulos del `it.each(directUses)` y del `it` de la suma añaden `(enmendado por #214 R4, R18)`. `pet-members` y `pet-invite` no usan `style={CONTINUOUS_CORNER}`. |
| `src/__tests__/consistency-classnames.test.ts` (glifos) | `'expect(profile.match(/ChevronRight/g)).toBeNull();'` 1 → 0; `'expect(profile.match(/ChevronRight/g)).toHaveLength(2); // #214 R4'` 0 → 1 | El `it` `'profile usa los glifos de reicon sin ChevronRight (#173 R10)'` pasa a `'… (#173 R10) (enmendado por #214 R4)'`: `ChevronRight` aparece exactamente dos veces en Perfil (el import y el único `<ChevronRight` de `ProfileWideTile`); los tiles cuadrados siguen sin chevron. |
| `src/__tests__/ui-copy-table.ts` | `'export const R21_PET_MEMBERS'` 0 → 1; `'R21_PET_MEMBERS,'` 0 → 2 | Bloque nuevo tras `R18_DATE_FIELD` (o tras el último bloque existente al mergear); entra en `ALL_USES` y en `blocks`. El título `'#194 R5: cuadra ALL_USES con la suma de sus bloques (enmendado por #220 R16)'` añade ` (enmendado por #214 R22)`. |
| `src/__tests__/ui-language.test.ts` | `'+ 1 // #220 R16: components/date-field.tsx'` 1 → 1; `'+ 3 // #214 R22'` 0 → 1 | Línea nueva tras la de #220 R16 en la fórmula de `SCREEN_FILES`; título del `it` con `(enmendado por #214 R22)`. Nuevo `describe('#214 R22: copy de Familia', …)` con los tres `it` de R22. |
| `src/__tests__/no-pets-states.test.ts` | — | No se edita; obliga a que los comentarios nuevos de home y profile usen `#214 R<n>`. |

### 7.2 Candados que no cambian

- `profile-canvas-fidelity`: listas de `text-26`, `rounded-hero` y `Card` hero.
- `consistency-classnames`: `bg-accent-soft`, `rounded-xl bg-accent`,
  `rounded-(2xl|lg|md|sm)` = `[]`, y `home.match(/style=\{CONTINUOUS_CORNER\}/g)`
  = 5 (`grep -cF 'toHaveLength(5); // (enmendado por #190 R13) // #198 R2'` = 1): el
  botón de R7 no lleva `CONTINUOUS_CORNER`.
- `consistency-classnames` #64 R9: las clases `bg-category-*` / `text-category-*`
  solo aparecen como literales en `src/utils/category-palette.ts`.
- `canvas-foundations`: `tracking-tight` prohibido (no se usa).
- `no-pets-states` #181 R8.2 y R8.3; candados de la me-card de Perfil; #202 R2.
- `R7_PROFILE` (`src/__tests__/ui-language.test.ts`, `toHaveLength(35 - 1 + 2 …)`)
  no cambia: las filas nuevas de Perfil e Inicio van en `R21_PET_MEMBERS` con su
  `file` real.

### 7.3 Merge con specs paralelas

#209 y otras de la ola tocan `src/app/_layout.tsx` (tras `edit-profile`),
`ui-copy-table.ts`, `ui-language.test.ts` y `consistency-classnames.test.ts`.
Quien mergee segundo a `dev` hace `git merge origin/dev` (nunca rebase) y vuelve a
medir: cuentas de hijos de `layout.test.tsx`, `ALL_USES`/`blocks`, la fórmula de
`SCREEN_FILES` y la suma de `CONTINUOUS_CORNER`. El nombre `R21_PET_MEMBERS`
se renombra al siguiente número libre si otro bloque `R21_*` llegó antes.

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
