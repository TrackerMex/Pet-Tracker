# Auditoría de firma delegada — #214 mobile-pet-members

- Spec: `specs/mobile-pet-members/` @ 02711b1e (branch feature/214-mobile-pet-members)
- Base: origin/dev 8b4cb1bd (congelada: sin fetch ni checkout)
- Auditor: subagente de solo lectura (no firma; decide el leader)
- Estado: CERRADO. Lo que no se revisó está en §No revisado.
- Sin cambios en ficheros tracked salvo este informe. Las mutaciones van en
  `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/54341eda-28f1-4262-9348-c2fbc9852939/scratchpad/audit214/`.

## Resultados por punto

### A. Desviación de género (§5.2)

Literales lado a lado (no se resuelven aquí; ver decisión humana H1):

| Clave | Canvas (artboard) | Spec (design §5 / R10–R11, R16) |
|---|---|---|
| `members.removeBody` | FamiliaOwner y FamiliaQuitarMiembro: «Luis dejará de ver a Rocky y de recibir sus avisos. Podrás invitarlo otra vez cuando quieras.» | «{{firstName}} dejará de ver a {{petName}} y de recibir sus avisos. Podrás enviarle otra invitación cuando quieras.» |
| `members.ownerNote` | FamiliaFamily: «Marta Ruiz administra a Luna. Solo ella puede invitar o quitar personas.» | «{{ownerName}} administra a {{petName}} y es quien puede invitar o quitar personas.» |

Además, la propia tabla de design §5.2 cita mal el artboard en `removeBody`:
pone «… Podrás invitarlo otra vez.» y el artboard dice «… Podrás invitarlo otra
vez cuando quieras.» (aviso A1). La spec conserva «cuando quieras», así que la
única desviación real es «invitarlo otra vez» → «enviarle otra invitación».

### B. expo-clipboard

- Ausencia en la base: OK. `expo-clipboard` no está en `package.json`, ni en
  `bun.lock`, ni en `node_modules`; ningún fichero de `src/` o `test/` lo cita.
- Instalación: OK. design §6 y R23 dicen `bunx expo install expo-clipboard`
  (bun, no npx), y el test de R23 exige el prefijo `~`, que es lo que escribe
  `expo install`.
- Gate de rebuild: declarado (design §3 y §6), pero con nombres de gate que no
  son los del plan (aviso A2).
- Doble global en el setup real: `package.json` → `jest.setupFilesAfterEnv =
  ["<rootDir>/test/jest-setup.js"]`, que hoy tiene 2 sentencias (mock de
  worklets y `setUpTests()` de reanimated). Añadir un `jest.mock('expo-clipboard',
  …)` ahí no rompe nada: ningún test de la base importa el módulo. OK.
- **Dos dueños del doble: FALLO F2.** design §3 y design §6 prescriben dos
  dobles distintos y con valores por defecto distintos.

### C. consistency-classnames #173 R10 (ChevronRight)

- «Exactamente 2» es coherente: en la base Perfil tiene 0 `ChevronRight`, y
  R4 lo añade en el import y en un único `<ChevronRight` dentro de
  `ProfileWideTile`. R6 reutiliza el componente, así que no suma un tercero. OK.
- **El mismo `it` tiene un segundo candado que la spec no enmienda: FALLO F4.**
  Es el `toContain` de la línea de import exacta, que se rompe al añadir
  `ChevronRight`, `Users` y `Key`.

### D. directUses y agregados

- La lista `directUses` y la suma de `directUses.reduce` están bien enmendadas
  en design §7.1: Perfil `3 + 1 + 4 - 7 + 1`, entrada nueva de join-pet con 1 y
  `+ 2 // #214 R4, R18`. Las anclas cuadran (punto 1). OK.
- **Hay un agregado hermano sin enmendar: parte de FALLO F3.** Es
  `consistency-classnames.test.ts:426`, del `it` #98 R10:
  `count(/style=\{CONTINUOUS_CORNER\}/g)` sobre todo `sourceFiles()`. Sube en
  los mismos +2 y nadie lo toca.
- `home.match(/style=\{CONTINUOUS_CORNER\}/g)` = 5 no cambia: el botón de R7 no
  usa `CONTINUOUS_CORNER` (design §7.2). OK.

### E. Contrato de backend (origin/dev)

OK. Coincide con lo que la spec asume:

- `GET /v1/pets/:petId/members` (PetAccessGuard: vale cualquier miembro)
  devuelve `{ userId, firstName, lastName, role, joinedAt }` con `joinedAt` en
  ISO. `firstName` y `lastName` son notNull en `users`.
- `DELETE /v1/pets/:petId/members/:userId` responde 204. Un no-dueño solo puede
  quitarse a sí mismo (403 si no). Un id que no es uuid da 404. Quitar al dueño
  da 409 `OWNER_NOT_REMOVABLE`.
- `POST /v1/pets/:petId/invites` responde 201 con `{ id, code, role,
  createdAt, expiresAt }`. `GET` devuelve `{ id, role, createdAt, expiresAt }`
  sin `code`. `DELETE /:inviteId` responde 204. Las tres son
  `@RequirePetRole('owner')`.
- Límites: 409 `PET_INVITES_LIMIT` con `MAX_PENDING_INVITES_PER_PET = 5`, y 409
  `PET_MEMBERS_LIMIT` con `MAX_MEMBERS_PER_PET = 10` (activos + pendientes).
- `POST /v1/invites/accept` devuelve `{ petId, role: 'family' }`.
  - El DTO es `code: z.string().trim().min(1).max(64)`: vacío da 400.
  - `normalizeInviteCode` quita espacios y guiones, pasa a mayúsculas y exige 10
    caracteres del alfabeto; lo demás da 404 `INVITE_NOT_ACCEPTABLE`.
  - Ya miembro da 409 `ALREADY_PET_MEMBER`.
  - El rate limit son 10 por hora y responde 429.
- `AuthGuard` global da 401. `PetRole` = `'owner' | 'family' | 'walker' | 'vet'`,
  que coincide con `myRole` en `mobile-pet-tracker/src/api/types.ts:85`.

### 1. Anclas grep -cF

OK. Todas las anclas de design §7 dan la cifra base que declara la spec
(script: `audit214/anchors.sh`). Medido en 8b4cb1bd:

| Ancla | Fichero | Esperado | Medido |
|---|---|---|---|
| `welcome.pingoGreeting` | profile | 2 | 2 |
| `expect(children).toHaveLength(` | layout.test | 5 | 5 |
| `'/edit-profile', // #194 R4` | — | 2 | 2 |
| `'/join-pet'` | — | 0 | 0 |
| `toEqual(['home-empty'])` | home/index.test | 2 | 2 |
| `toEqual(['home-empty', 'home-join-pet'])` | home/index.test | 0 | 0 |
| `'con mascota ordena dos filas de dos tiles'` | profile/index.test | 1 | 1 |
| `'sin mascota deja recordatorios solo…'` | profile/index.test | 1 | 1 |
| `jest.mock('../../../api/pet-members')` | screens.test | 0 | 0 |
| las tres rutas nuevas | profile-canvas-fidelity | 0 | 0 |
| `[join('screens', 'profile', 'index.tsx'), 3 + 1 + 4 - 7]` | consistency-classnames | 1 | 1 |
| `3 + 1 + 4 - 7 + 1]` | consistency-classnames | 0 | 0 |
| entrada de join-pet | consistency-classnames | 0 | 0 |
| `+ 2 // #214 R4, R18` | consistency-classnames | 0 | 0 |
| `directUses.reduce` | consistency-classnames | 1 | 1 |
| ChevronRight `toBeNull` | consistency-classnames | 1 | 1 |
| ChevronRight `toHaveLength(2)` | consistency-classnames | 0 | 0 |
| `R21_PET_MEMBERS` (las dos anclas) | ui-copy-table / ui-language | 0 | 0 |
| `+ 1 // #220 R16: components/date-field.tsx` | ui-language | 1 | 1 |
| `+ 3 // #214 R22` | ui-language | 0 | 0 |
| `toHaveLength(5); // (enmendado por #190 R13) // #198 R2` | — | 1 | 1 |
| `export const R18_DATE_FIELD` | ui-copy-table | 1 | 1 |

El título «#194 R5: cuadra ALL_USES… (enmendado por #220 R16)» está en
`ui-copy-table.ts:697`, que es donde lo sitúa el design. OK.

### 2. Rutas

- **Base.** En `src/app/_layout.tsx` el grupo Protected va de `add-reminder`
  (0) a `meals-history` (12) y `edit-profile` (13). Las tres pantallas nuevas en
  13–15, con `edit-profile` en 16, cuadran. OK.
- **Navegación.** Las hrefs de `detail-stack.guard.test.tsx` (`'/pets/pet-1/members'`,
  `'/pets/pet-1/invite'`, `'/join-pet'`) y el `backFallback="/profile"` de la
  cabecera cuadran con las rutas delgadas que declara R3. OK.
- **Choque con #209:** aviso A6.
- **Tipos de rutas:** aviso A13.

### 3. Inventarios y candados agregados

**FALLO F3.** R24 dice que se enmiendan «exactamente» las filas de design
§7.1. Pero quedan fuera inventarios cerrados y cuentas globales que las clases
de R7, R10, R12–R18 cambian:

- `chunky-cta-canvas-fidelity.test.ts`: #177 R3.3, R4.3, R6.2, R7.1–R7.5.
- `design-drift.test.ts` #178 R13: el mapa `rounded16` y la lista de
  `rounded-14`.
- `alerts-canvas-fidelity.test.ts` #174 R12: las listas de `rounded-10` y de
  `tracking-title`.
- `consistency-classnames.test.ts`: #98 R10 `CONTINUOUS_CORNER` (línea 426) y
  la cuenta global de `border-lip-gray` (línea 678).

Detalle en F3.

### 4. Selectores por prefijo

- `profile-links-row-*` y los hijos de `home-empty`: enmendados en design §7.1. OK.
- **`/-link$/` en `profile/index.test.tsx:1293`: FALLO F5.** Es una lista
  cerrada de los `*-link` de Perfil con mascota. Captura `members-link` y
  `join-pet-link`, y no se enmienda.
- **`/-retry$/` de #177 R8.4** (`chunky-cta-canvas-fidelity.test.ts:220`):
  `pet-members-retry` entra en el selector, que le prohíbe `chunkyLip` y
  `border-b-`. R8 no dice la clase ni el estilo del botón (aviso A14).

### 5. Clases de color

- `legibility-classnames` #61 R4 (`inkSites`) cuenta por fichero listado y no
  cierra el conjunto de ficheros. El `text-accent-strong` de
  `pet-invite-code-label` (R14) no lo rompe. OK.
- `requestsAccent`: la spec no pide el token `accent` en `useThemeColors`. OK.
- `bg-accent-soft` (cuenta global en `consistency-classnames:443`): #214 no lo
  usa. OK.
- `text-17` va en `Text` de RN, no en `Button.Label` de HeroUI, así que twMerge
  no lo expulsa. OK.
- `chunkyLip.danger` en `member-remove-sheet-confirm` ya tiene precedente
  (pairing y reminders). #177 R8.4 solo excluye `profile-sign-out`,
  `lost-mode-button` y `-retry`. OK.
- **#64 R9:** aviso A10.

### 6. Copy

OK en cuenta y colisiones (script: `audit214/copy.js`):

- **Cuenta.** Hay 50 filas con 50 claves únicas: profile 4, members 28, invite 10
  y joinPet 8. Cuadra con «50 claves» de R22.
- **Claves nuevas.** Ninguna existe ya en `src/i18n/catalog.ts`, y los
  namespaces `members`, `invite` y `joinPet` están vacíos en la base.
- **Claves reutilizadas.** Cada una existe en es y en en.
- **SCREEN_FILES.** En la base son 37. Ningún valor fijo nuevo coincide con un
  literal entero de esos ficheros ni de los tres nuevos (#194 R5 no se rompe).
  Tampoco hay literales probables de código (`owner`, `family`…) iguales a un
  valor del catálogo.
- **Literales del canvas.** Todos los literales es están en algún artboard,
  salvo los que design §5.1 y §5.2 declaran sin artboard o desviados:
  - `membersSummaryAlone` y `membersSummaryOne`;
  - `revokeA11y`;
  - `removeBody` y `ownerNote`;
  - `leaveTitle` y `leaveBody`;
  - `invitesLimit` y `membersLimit`;
  - `copied`.
- **Sheet de salir.** El copy contradice la respuesta aprobada a Q13 (decisión
  humana H2).
- **en-US.** No tiene artboard y queda bajo G1 (decisión humana H4).
- **Uso de las claves:** aviso A11.

### 7. Choques con specs paralelas

- **#218 R3 (BottomSheet): FALLO F1.** #218 está en implementación en
  wt-218 y aún no está en dev. Su guard nuevo exige una lista cerrada de
  importadores de `@expo/ui/community/bottom-sheet`, un solo `<BottomSheet`
  por importador y `backgroundStyle={{ backgroundColor: surface }}`. #214 añade
  un tercer importador con dos `<BottomSheet` y sin `backgroundStyle`.
- **#209:** añade `nutrition-profile` tras `edit-profile` en `_layout.tsx` y
  enmienda el `it` #194 R4 a `at(-1 - 1)` (aviso A6).
- **#217:** toca `layout.test.tsx`, `profile/index.test.tsx`,
  `home/index.test.tsx`, `profile/index.tsx` (interruptor de tema) y
  `design-drift.test.ts`. Son los mismos ficheros que #214 enmienda (aviso A3).
- **#208 y #209:** añaden su bloque tras `R18_DATE_FIELD` y su `+ N` tras
  `#220 R16` en `SCREEN_FILES`, igual que #214. Es solo un conflicto de texto, y
  design §7.1 lo cubre con «o tras el último bloque existente al mergear». Los
  dos también tocan las cuentas de `CONTINUOUS_CORNER`.
- **#213:** su BottomSheet va en `reminders`, que ya es importador. Choca con
  #218, no con #214.
- **#219:** toca `home/format.ts` y `weekly-activity-chart`. Sin solape con #214.

### 8. Tests

- **R1, R2, R9, R12, R14, R19 y R21:** tienen un `it` por rama y tablas. No
  encuentro huecos.
- **Avisos:**
  - A4: el R23 va antes del esqueleto;
  - A7: la cláusula universal de R13 tiene un solo `it`;
  - A8: R8 no dice qué query falla;
  - A9: hay `it` negativos que nacen verdes.

### 9. Comentarios y títulos

- **Forma de los comentarios.** Toda la spec usa `#214 R<n>` (también
  `#214 R4, R18` y `#214 R12, R14, R18`), y esa forma pasa las dos guardas:
  - `HEX_LITERAL` de design-drift, `#(?!\d{2,3} R\d)…`;
  - #181 R8.3 de no-pets-states, `#\d+\b(?!\s+R\d)`, en home, reminders y
    profile.
  
  design §7.1 lo declara en su última fila. OK.
- **Títulos.** Todas las filas de §7.1 exigen `(enmendado por #214 R…)` en el
  título del `it`. OK.

### 10. Dependencias

Solo `expo-clipboard` (ver B). No hay más dependencias nuevas.
`expo-linear-gradient` no aparece.

### 11. Canvas

- **Texto.** Ver punto 6.
- **Perfil.** El tile Familia del artboard PerfilFamilia es
  `grid-column: span 2`, es decir, un tile ancho a dos columnas en una fila
  propia. Cuadra con `ProfileWideTile` de R4 y con «quinta tarjeta» del plan:
  es la quinta y ocupa la fila entera. OK.
- **Inicio.** El botón de R7 tiene su artboard, `InicioVacioUnirme`. OK.
- **«Unirme con código» en Perfil.** No aparece en PerfilFamilia (decisión
  humana H3).
- **support.js.** El html del canvas referencia `./support.js`, que no está en
  la carpeta `canvas/`. No impide leer el texto.
- **v140:** aviso A12.

### 12. Mocks y dobles

- **expo-clipboard: FALLO F2.**
- `jest.mock('../../api/pet-members')` es un automock de un módulo de funciones
  planas, con `listPetMembers.mockResolvedValue({ kind: 'error' })` en
  `beforeEach`, tanto en Perfil como en `screens.test.tsx`. OK.
- El doble de `BottomSheet` copia el de `src/screens/pairing/index.test.tsx`,
  que existe. OK.
- El mock de `reicon-react-native` en `profile/index.test.tsx:181` hace spread
  del real, así que `Users`, `Key` y `ChevronRight` están disponibles. Los tres
  existen en `node_modules/reicon-react-native/index.d.ts`. OK.
- La spec no usa ningún `jest.mock` virtual (jest-virtual-mock-lock). OK.

## Fallos bloqueantes

### F1. #214 rompe el guard de #218 R3 (BottomSheet) y design §7.3 no lo nombra

- **Spec #214.** R11 y R17 crean `member-remove-sheet` y `member-leave-sheet`:
  dos `<BottomSheet` en `src/screens/pet-members/index.tsx`, sin
  `backgroundStyle`.
- **design §7.3 (nota de merge).** Solo nombra #209.
- **#218** (wt-218, `src/__tests__/sheet-surface-background.test.ts`):
  ```ts
  expect(importers).toEqual(['screens/pairing/index.tsx', 'screens/reminders/index.tsx'])
  source.match(/<BottomSheet(?![A-Za-z])/g)          // longitud 1 por importador
  source.split('backgroundStyle={{ backgroundColor: surface }}')  // longitud 2
  const [surface] = useThemeColors(['surface']);
  ```
- **Efecto.** Mergee primero quien mergee, el segundo queda en rojo: tercer
  importador, dos `<BottomSheet` y sin `backgroundStyle`. #218 R4 también fija
  la clase de la View interior (`items-center gap-3 bg-surface px-5 pb-9 pt-3`),
  que #214 no sigue.
- **Arreglo.** Decidir el dueño: #214 detrás de #218, enmendando la lista a
  tres importadores y la regla «un sheet» a dos con dos `backgroundStyle`; o
  #218 detrás de #214. Escribirlo en §7.3 con las cifras.

### F2. Dos dueños y dos valores por defecto para el doble de expo-clipboard

- **design §3:** «Todos los tests que rendericen `PetInviteScreen` llevan
  `jest.mock('expo-clipboard', () => ({ setStringAsync: jest.fn() }))` con la
  implementación por defecto (`mockResolvedValue(undefined)`) en un
  `beforeEach`, porque `restoreAllMocks` borra implementaciones de `jest.fn`.»
- **design §6:** «Doble global: `test/jest-setup.js` … añade
  `jest.mock('expo-clipboard', () => ({ setStringAsync: jest.fn() }));` …
  `src/screens/pet-invite/index.test.tsx` fija en su `beforeEach`
  `jest.mocked(Clipboard.setStringAsync).mockResolvedValue(true)`».
- **R23** y tasks R23 (2) dicen «doble en `test/jest-setup.js`», con lo que §3
  sobra o contradice.
- **Tipos.** `setStringAsync` devuelve `Promise<boolean>`, así que
  `mockResolvedValue(undefined)` de §3 no compila con `bunx tsc --noEmit`
  (`undefined` no es asignable a `boolean`).
- **Premisa falsa.** La justificación «porque `restoreAllMocks`» no se aplica:
  `package.json` no tiene `restoreMocks` y los tests vecinos (pairing) usan
  `jest.clearAllMocks`.
- **Arreglo.** Borrar la frase de §3 y dejar §6 como único dueño:
  `mockResolvedValue(true)`.

### F3. R24 «enmendar exactamente» deja fuera inventarios cerrados que #214 rompe

**Cita, R24 y design §7.1.** La tabla solo enmienda estos ficheros:

- `layout`, `detail-stack`, `home`, `profile`, `screens`;
- `profile-canvas-fidelity`;
- `consistency-classnames`: `directUses` y glifos;
- `ui-copy-table` y `ui-language`.

tasks R24 (1) añade: «Enmiendas de design.md §7.1 … (`profile-canvas-fidelity`,
`consistency-classnames` esquinas y glifos)».

**Comando:**

```
$ for f in chunky-cta-canvas-fidelity design-drift alerts-canvas-fidelity "count(/style=" "border-lip-gray/g"; do
    printf '%s: ' "$f"; cat specs/mobile-pet-members/*.md | grep -cF "$f"; done
chunky-cta-canvas-fidelity: 0
design-drift: 0
alerts-canvas-fidelity: 0
count(/style=: 0
border-lip-gray/g: 0
209 chunky/design-drift: 20      # la spec hermana #209 sí los enmienda
```

**Clases que la spec prescribe**
(`grep -n "border-lip-gray\|rounded-16\|rounded-14\|rounded-10\|tracking-title\|text-17" requirements.md`):

- **`border-lip-gray`:**
  - :169, `home-join-pet-button` en Inicio;
  - :401, `pet-invite-copy`.
- **`rounded-16`:** :169, :333, :398, :401, :433 y :495, es decir:
  - Inicio;
  - `pet-members-invite-cta`;
  - `pet-invite-share` y `pet-invite-copy`;
  - `pet-members-leave`;
  - `join-pet-submit`.
- **`rounded-14`:**
  - :244, «Quitar» en pet-members;
  - :490, el input de join-pet.
- **`rounded-10`:** :294, `invite-row-<id>-icon`.
- **`tracking-title`:** :483, el título de join-pet.
- **`text-17 font-extrabold text-accent-foreground`:** :335, :399 y :496.
- **Button `bg-accent` con `chunkyLip.primary`:** los tres de arriba.
- **`chunkyLip.neutral`:**
  - :170, Inicio;
  - :402, Copiar;
  - :434, Salir.

**Candados cerrados que esas clases mueven y que nadie enmienda:**

- **`chunky-cta-canvas-fidelity.test.ts`:**
  - **:126–127 #177 R3.3.**
    `expect(idsWhere(tag => /\bbg-accent(?=[\s'"`])/.test(tag))).toEqual([...primaryIds, 'reminders-add-link'].sort())`.
    Recibe tres ids nuevos.
  - **:146 #177 R4.3.** «conserva los nueve secundarios neutros»:
    `home-join-pet-button`, `pet-invite-copy` y `pet-members-leave`.
  - **:165 #177 R6.2.** Recuentos globales de `text-17` y de
    `<Text className="text-17 font-extrabold text-accent-foreground">`.
  - **:174 #177 R7.1.** Cuenta de `border-lip-gray`.
  - **:180 #177 R7.2.** Inventario de `rounded-16 bg-accent`.
  - **:184 #177 R7.3.** «los veintisiete radios de dieciséis».
  - **:188 #177 R7.4.** «solo la definición y los dieciocho consumidores usan
    el hook». Entran pet-members, pet-invite y join-pet.
  - **:192 #177 R7.5.** Inventario de `chunkyLip.primary` y `chunkyLip.neutral`.
- **`design-drift.test.ts`:**
  - **:1131–1135 #178 R13.** El mapa cerrado `rounded16` por fichero (home pasa
    de 1 a 2, y entran tres ficheros nuevos).
  - **:1158 #178 R13.** `outsideReminders(/\brounded-14\b/)).toEqual([…])`.
    Entran pet-members y join-pet.
- **`alerts-canvas-fidelity.test.ts` :185+ #174 R12:**
  - la lista cerrada de ficheros con `rounded-10` (entra pet-members);
  - la de `tracking-title` (entra join-pet).
- **`consistency-classnames.test.ts`:**
  - **:426 #98 R10.** `expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1 + 4 …)`.
    `count` recorre todo `sourceFiles()` y sube +2 por las mismas dos esquinas
    que §7.1 suma en `directUses`.
  - **:678.** `expect(count(/border-lip-gray/g)).toBe(4 + 1 + …)`, también
    global.

**Efecto.** Con R4, R7, R10, R12–R18 en verde, la corrida completa de R24 (3)
queda en rojo en una decena de `it`, como mínimo
(no se contó cada `it.each` de #174 R12). Codex no puede enmendarlos sin inventarse
cifras, y §7.2 afirma que el resto «no cambia».

**Arreglo.** Añadir a §7.1 una fila por candado, con su ancla `grep -cF`, la
cifra base y la nueva y el comentario `// #214 R<n>`, como hace #209. Para que
el recuento sea mecánico, grep de cada clase de la lista de arriba contra
`src/__tests__/*.ts`.

### F4. #173 R10: el `toContain` del import de Perfil no se enmienda

- **Cita** (`consistency-classnames.test.ts:192–199`):
  ```ts
  it('profile usa los glifos de reicon sin ChevronRight (#173 R10)', () => {
    const profile = readSource(join('screens', 'profile', 'index.tsx'));
    expect(profile).toContain(
      "import { Bell, Camera, FileText, Map as MapIcon, Plus, Wifi } from 'reicon-react-native';",
    );
    expect(profile.match(/ChevronRight/g)).toBeNull();
  });
  ```
- **Base.** `profile/index.tsx:8` es exactamente esa línea. Ningún otro fichero
  la cita.
- **Spec.** design §7.1 (fila «glifos») solo cambia `toBeNull()` →
  `toHaveLength(2)`. R4 (:111, :118) añade `Users` y `ChevronRight`, y R6
  (:150) añade `Key`. El import pasa a llevar al menos 9 nombres, y el
  `toContain` cae en rojo en el mismo `it` que la spec dice enmendar.
- **Arreglo.** Dar en la fila la línea de import nueva, literal y ordenada
  (`Bell, Camera, ChevronRight, FileText, Key, Map as MapIcon, Plus, Users,
  Wifi`), con su ancla `grep -cF` 0 → 1.

### F5. `/-link$/` de Perfil: lista cerrada sin enmendar

- **Cita** (`src/screens/profile/index.test.tsx:1284–1295`, `it('pinta la fila
  de zonas seguras tras la de GPS y abre la ruta de la mascota activa')`, con
  `mockListPets` → `[pet]`):
  ```ts
  expect(screen.getAllByTestId(/-link$/).map((row) => row.props.testID)).toEqual([
    'documents-link', 'pairing-link', 'geofences-link', 'reminders-link',
  ]);
  ```
- **Comando:**
  ```
  $ grep -n -- '-link$/' src/screens/profile/index.test.tsx src/app/(tabs)/__tests__/*.tsx src/__tests__/*.ts
  src/screens/profile/index.test.tsx:1293: …
  spec cita 'zonas seguras tras': 0     spec cita '-link$': 0
  ```
- **Efecto.** Con mascota, R4 pinta `members-link` y R6 pinta `join-pet-link`.
  Los dos casan con el selector, así que el `toEqual` recibe seis ids y queda en
  rojo. El `beforeEach` que añade §7.1 (`listPetMembers` → error) no lo evita,
  porque la tarjeta Familia se pinta igual con el subtítulo de reserva.
- **Arreglo.** Fila en §7.1 con la lista nueva en orden de DOM y el título
  `(enmendado por #214 R4, R6)`.

## Avisos

- **A1.** design §5.2 cita mal el artboard de `removeBody`: le falta
  «cuando quieras».
- **A2.** Nombres de gate.
  - design §3 y §6 llaman «G3» al rebuild y «G4» al smoke.
  - En `progress/plan_mejoras-producto-2026-10-26.md` §5:
    - G3 es «Confirmar N», ya cerrado.
    - G4 es el smoke en dispositivo.
    - El rebuild no es un gate numerado.
  - Arreglo: decir «rebuild del dev build (no delegado), parte de G4».
- **A3.** design §7.3 no nombra a #217, que toca los mismos ficheros que #214
  enmienda (`layout.test.tsx`, `profile/index.test.tsx`, `home/index.test.tsx`,
  `profile/index.tsx`, `design-drift.test.ts`). Tampoco nombra a #208 ni a
  #213.
- **A4.** El test de R23 va en el commit (1), dentro de
  `src/screens/pet-invite/index.test.tsx`, antes de que R3 cree el esqueleto de
  la pantalla. Si el fichero importa `./index`, el rojo es por import roto,
  contra la regla de tasks.md. Hay que decir que en R23 el fichero aún no
  importa la pantalla, o crear el esqueleto en R23.
- **A5.** La premisa de §3 «porque `restoreAllMocks` borra implementaciones»
  es falsa en este repo (ver F2).
- **A6.** R3 afirma que «el de índice 16, el último, es `edit-profile`».
  - #209 R3 añade `nutrition-profile` como último hijo y enmienda el `it`
    '#194 R4: edit-profile es la última pantalla protegida' a `at(-1 - 1)`.
  - §7.3 solo dice «vuelve a medir».
  - Hay que fijar quién va detrás y la cifra resultante: con las dos specs, 18
    hijos (14 de base, +3 de #214 y +1 de #209) y `edit-profile` en el
    penúltimo.
- **A7.** R13 tiene una cláusula universal con un solo `it`:
  - la cláusula: «WHEN se pulsa cualquier botón de acción (Quitar, confirmar,
    Revocar, Invitar, Salir) THE SYSTEM SHALL borrar
    `pet-members-action-error`»;
  - su único `it`: 'R13: un toque nuevo borra el aviso anterior'.

  Hace falta un candado por botón, o un `it.each` de los cinco.
- **A8.** R8 dice «IF alguna resuelve…» sobre tres queries (`pet`, miembros,
  `me`). La precedencia está definida (unauthorized > unreachable > error), pero
  los `it` van uno por tipo de error y no dicen qué query falla. Una
  implementación que solo mire una query pasa. Hace falta una tabla de qué query
  falla en cada `it`, o un `it.each` por query.
- **A9.** Hay `it` negativos que nacen verdes en el commit rojo: R4 «sin
  mascota no hay tarjeta», R16 «el dueño no ve Salir» y similares. tasks.md no
  los marca. El historial rojo→verde de C4 no podrá mostrarlos en rojo, y el
  reporte de Codex debería anotarlos.
- **A10.** La prosa de R4 y R6 escribe `text-sm font-extrabold
  text-category-rose-strong` y `text-category-amber-strong` como si fueran
  literales. #64 R9 (design §7.2) solo admite esas clases literales en
  `src/utils/category-palette.ts`. design.md:88–92 y R10 (:244) ya usan
  `${CATEGORY_SLOTS.<slot>.ink/.surface}`. Conviene escribir R4 y R6 igual, para
  que Codex no copie el literal.
- **A11.** `R21_PET_MEMBERS` no tiene `toHaveLength` propio. `checkUses` solo ve
  `t('clave')` literal, así que un mapa dinámico como ``t(`members.role.${role}`)``
  dejaría claves «sin uso». Conviene prescribir un mapa de literales para las
  píldoras de rol y los errores de join-pet.
- **A12.** design §2 dice que los artboards se congelaron desde
  `1793051574-af80`, «cuyos literales coinciden con v140». Los nueve `.dc.html`
  no llevan marcador de versión: desde el disco no se puede verificar la
  equivalencia con v140.
- **A13.** Los `router.push({ pathname: '/pets/[petId]/invite', params })` y el
  `dismissTo` dependen de los tipos de expo-router regenerados. El handoff
  debería incluir el `test ! -e` de `router.d.ts` obsoleto antes de
  `bunx tsc --noEmit`.
- **A14.** R8 no da clase ni estilo para `pet-members-retry`. #177 R8.4 le
  prohíbe `chunkyLip` y `border-b-` por el sufijo `-retry`. Conviene decir
  «sin labio», con su clase, para que Codex no le ponga uno.

## Puntos que requieren decisión humana

- **H1.** Las desviaciones de `removeBody` y `ownerNote` frente al artboard
  (punto A). Son copy, así que caen bajo G1, que no está delegado.
- **H2.** El copy del sheet de salir contradice la respuesta aprobada a Q13 de
  `progress/design_ola0-mejoras-2026-10-26.md` §Preguntas abiertas.
  - Q13 aprobada: «¿Salir de la familia de Luna?» · «Dejarás de ver a Luna y de
    recibir sus avisos. Para volver, Marta tendrá que invitarte otra vez.» ·
    «Salir de esta mascota» · «Cancelar».
  - Spec: `leaveTitle` «¿Salir de {{petName}}?», `leaveBody` «Para volver
    necesitarás una invitación nueva.», `leaveConfirm` «Salir».
  - Según el propio documento, las specs adoptan Q13 salvo que el humano la
    cambie antes de firmar. Se puede tratar como errata (adoptar Q13) o como
    cambio que decide el humano.
- **H3.** El tile «Unirme con código» en Perfil (R6) no tiene artboard; cae bajo
  G1.
- **H4.** El copy de design §5.1 sin artboard, incluido todo el en-US; cae
  bajo G1.

## No revisado

- **layout.test.** Las cuatro sumas `+ 3` de `layout.test.tsx` solo se
  revisaron por ancla, sin rehacer cada suma.
- **ui-language.** Los tres `it` de R22 en `ui-language.test.ts` no se
  revisaron línea a línea.
- **Cifras exactas de F3.** No se calcularon las cifras nuevas de cada candado
  de F3 (las de R4.3 y R6.2, por id). Las cuentas de F3 son mínimas, sacadas de
  las líneas de requirements; las clases de los botones Cancelar de los sheets
  no se cruzaron.
- **Guards fuera de `src/__tests__/`.** Solo se revisaron los de
  profile/home/tabs/layout/detail-stack.
- **`border-danger`.** No se buscaron guards de `border-danger`, la clase del
  botón Salir.
- **v140.** No se pudo comprobar la equivalencia con v140 (A12).

## Veredicto

**No firmable.**

- **Fallos.** Hay 5 bloqueantes:
  - F1, choque con #218;
  - F2, doble de clipboard;
  - F3, inventarios cerrados sin enmendar;
  - F4, import de #173 R10;
  - F5, `/-link$/` de Perfil.

  F3, F4 y F5 dejan la corrida de R24 (3) en rojo sin que Codex tenga cifras
  escritas.
- **Avisos.** Hay 14 (A1–A14).
- **Decisiones humanas.** Hay 4 (H1–H4). Caen bajo G1 y no se delegan.

## Erratas aplicadas (spec_author, 2026-10-26)

> Terminado el 2026-10-27: 25 erratas aplicadas, 2 pendientes (A13 y `leaveBodyNoOwner`). Base congelada `8b4cb1bd` (origin/dev). Semilla:
> `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/54341eda-28f1-4262-9348-c2fbc9852939/scratchpad/audit214/seed`
> (`git archive 8b4cb1bd` sin `backend-pet-tracker/`, `node_modules` enlazado al de wt-214).

### Corrida base de la semilla (sin tocar)

```
$ cd seed/mobile-pet-tracker && timeout 590 bunx jest src/__tests__ src/app src/screens/profile src/screens/home > audit214/jest-base.log 2>&1; echo "exit=$?"
Test Suites: 58 passed, 58 total
Tests:       1657 passed, 1657 total
exit=0
```

(La primera corrida, con solo `mobile-pet-tracker/` extraído, dio 254 `ENOENT` por
`../docs` y `../specs`: los candados leen fuera del paquete. La semilla lleva ahora
todo el árbol salvo el backend.)

### Corrida 1 de la semilla (producción mínima de R3–R7, R10–R18, sin tocar tests)

Semilla con #218 aplicada (`p218.diff`) y la producción mínima de la spec al pie
de la letra. Ningún test enmendado.

```
$ timeout 590 bunx jest src/__tests__ src/app src/screens/profile src/screens/home > audit214/jest-seed-1.log 2>&1; echo "exit=$?"
Test Suites: 13 failed, 46 passed, 59 total
Tests:       41 failed, 1620 passed, 1661 total
exit=1
```

Rojos (Expected → Received). «spec» = la spec ya lo enmienda; «NUEVO» = falta en §7.1.

| Candado (fichero:línea del fallo) | Expected → Received | Estado |
|---|---|---|
| #218 R3 importadores (`sheet-surface-background.test.ts:44`) | 2 ficheros → + `screens/pet-members/index.tsx` | F1 |
| #218 R3 `<BottomSheet` de pet-members (`:49`) | length 1 → 2 | F1 |
| #194 R4 ×4 (`layout.test.tsx:384, :410, :455, :487`) | length 14 → 17 | spec (R3) |
| #178 R13 mapa `rounded16` (`design-drift.test.ts:1135`) | home 1 → 2; + join-pet 2, pet-invite 2, pet-members 6 | NUEVO |
| #179 R13 lista `text-17` (`design-drift.test.ts:1239`) | + join-pet, pet-invite, pet-members | NUEVO |
| #62 R1 `rounded-16 bg-accent` (`consistency-classnames.test.ts:103`) | length 19 → 23 | NUEVO |
| #173 R10 import de Perfil (`:196`) | `toContain` de la línea de 6 glifos → no está | F4 |
| #62 R12 TextInput (`:215`) | length 6 → 7 | NUEVO |
| #62 R14 profile (`:300`) | length 1 → 2 | spec |
| #62 R14 suma (`:326`) | 55 → 56 (semilla sin join-pet en `directUses`) | spec (+2 con join-pet) |
| #98 R10 `CONTINUOUS_CORNER` global (`:426`) | 53 → 55 | NUEVO |
| #166 R2 primarios por fichero (`:610`) | + join-pet 2, pet-invite 1, pet-members 1 | NUEVO |
| #166 R3 neutros (`:661`) | + 5 ids | NUEVO |
| #197 R22 dependencias (`canvas-foundations.test.ts:314`) | length 44 → 45 | NUEVO (R23) |
| #202 R25 dependencias (`zones-canvas-fidelity.test.ts:164`) | length 44 → 45 | NUEVO (R23) |
| #41 R9 `/-link$/` (`profile/index.test.tsx:1293`) | + `members-link`, `join-pet-link` | F5 |
| #168 R6 filas con mascota (`:1636`) | length 2 → 4 | spec |
| #168 R6 filas sin mascota (`:1657`) | length 1 → 2 | spec |
| #174 R12 `rounded-10` (`alerts-canvas-fidelity.test.ts:245`) | + pet-members | NUEVO |
| #174 R12 `tracking-title` (`:245`) | + join-pet | NUEVO |
| #177 R3.3 Button `bg-accent` (`chunky-cta-canvas-fidelity.test.ts:127`) | + 4 ids | NUEVO |
| #177 R4.3 neutros (`:147`) | + 5 ids | NUEVO |
| #177 R6.2 etiquetas (`:169`) | 30 → 34 | NUEVO |
| #177 R7.1 labios de borde (`:178`) | 12 → 16 | NUEVO |
| #177 R7.2 recetas (`:181`) | + 3 ficheros | NUEVO |
| #177 R7.3 radios 16 (`:185`) | home 1 → 2; + 3 ficheros | NUEVO |
| #177 R7.4 consumidores del hook (`:189`) | + 3 ficheros | NUEVO |
| #177 R7.5 estilos (`:193`) | + 3 ficheros | NUEVO |
| #177 R8.1 primary / neutral (`:203`) | + 4 / + 5 | NUEVO |
| #190 R12 hex en home (`home-pingo-phrase.test.ts:36`) | `not /#[\da-f]{3,8}\b/i` → casa `#214` del comentario | NUEVO (R24 mal escrito) |
| #173 R15 hex en profile (`profile-canvas-fidelity.test.ts:180`) | `not /#[0-9a-fA-F]{3,8}\b/` → casa `#214` | NUEVO (R24 mal escrito) |
| #61 R4 `useThemeColors(['accent'])` (`legibility-classnames.test.ts:206`) | + join-pet | NUEVO (R20) |
| #173 R2 `rounded-tile` (`profile-canvas-fidelity.test.ts:48`) | + 3 ficheros | spec |
| #173 R2.4 `text-13` (`:68`) | + 3 ficheros | spec |
| #155 R4 / #181 R3.2 (`home/index.test.tsx:5278, :5508`) | `['home-empty']` → + `home-join-pet` | spec (R7) |
| #190 R5 PingoFloat (`home/index.test.tsx:5797`) | translateY -10 → 0 | ajeno: se re-corre solo |

Los tres rojos de la semilla que no son de candado se corrigieron en la producción de la
semilla y cada uno es errata de spec: comentarios `#214` en home y profile (R24),
`useThemeColors(['accent'])` en join-pet (R20, pasa a `accent-strong`) y el
`TextInput` sin `placeholderTextColor={muted}` (#62 R12, R18).

### Corrida 2 de la semilla

Comando, desde `seed/mobile-pet-tracker/` y sin pipe:
`timeout 590 bunx jest src/__tests__ src/app src/screens/profile src/screens/home > audit214/jest-seed-2.log 2>&1; echo "exit=$?"`

Resultado: `exit=0`, `Test Suites: 59 passed, 59 total`, `Tests: 1673 passed, 1673 total`.
Hay 11 `● Console`, los mismos 11 que en la corrida base. `Query data cannot be undefined`
no aparece ni en la base ni en esta corrida.

Antes de esta corrida se aplicaron en la semilla las enmiendas de test que faltaban:
- Perfil: el doble de `../../api/pet-members` con `mockResolvedValue({ kind: 'error' })`
  en el `beforeEach` global, F5 y las dos filas.
- `screens.test.tsx`: el doble de `pet-members`.
- `profile-canvas-fidelity`, `alerts-canvas-fidelity` #174 R12 y `chunky-cta-canvas-fidelity`.
  Los primarios nuevos van como filas de `CTA_ROWS` y los neutros como añadidos explícitos.
- Los dos `toEqual(['home-empty'])` de Inicio y las hrefs de `detail-stack.guard`.

En producción se aplicó A11: llamadas `t('…')` directas en la píldora de rol y en el error
de Unirme.

El rojo de #190 R5 (PingoFloat, translateY -10 → 0) no se repite en esta corrida. Era un
flake ajeno a #214.

### Corrida 3 de la semilla

Tras F2 (doble en `test/jest-setup.js`) y las filas de §7.1 que faltaban en la corrida 2.
Desde `seed/mobile-pet-tracker/`, sin pipe:
`timeout 590 bunx jest src/__tests__ src/app src/screens/profile src/screens/home > audit214/jest-seed-3.log 2>&1; echo exit=$? >> audit214/jest-seed-3.log`

Resultado: `exit=0`, `Test Suites: 59 passed, 59 total`, `Tests: 1676 passed, 1676 total`.
Hay 11 `● Console`, los mismos que en la base.

Para comprobar los títulos de las filas 1–4 hubo una corrida suelta,
`timeout 590 bunx jest src/app/__tests__/layout.test.tsx > audit214/jest-seed-layout-title.log`.
Dio `1 passed`, `33 passed`.

### Corrida complementaria (lo que la corrida pedida no cubre)

El comando de la tarea no recorre `src/providers`, `src/hooks`, `src/api`, `src/utils`,
`src/components`, `src/theme`, `src/i18n`, el resto de `src/screens` ni `test/`. Como
los candados de #214 pueden vivir ahí, se corrió también:
`timeout 590 bunx jest src/providers src/api src/utils src/components src/hooks src/theme src/i18n src/screens test app.config.test.ts app.assets.test.ts > audit214/jest-seed-rest.log`

Resultado: `Test Suites: 1 failed, 157 passed, 158 total`, `Tests: 1 failed, 5568 passed, 5569 total`.

Un rojo:
- Test: `src/hooks/use-pet-selection.test.tsx`, `#181 R2: limpieza de la selección › R2.4: solo proveedor y hook mencionan clearPet en producción`.
- Expected: `["hooks/use-pet-selection.ts", "providers/selected-pet-provider.tsx"]`.
- Received: lo mismo más `"screens/pet-members/index.tsx"`.
- Causa: R17 llama a `clearPet()` desde Familia, y el candado no está en §7.1. Es la errata N3 (fila 49).

Antes de esta corrida, la fila 48 (`#194 R1` en `src/providers/__tests__/language-provider.test.tsx`)
ya se había aplicado en la semilla. Es la errata N2.

Con la fila 49 aplicada en la semilla, se repitió la corrida:
`timeout 590 bunx jest src/hooks/use-pet-selection.test.tsx src/providers/__tests__/language-provider.test.tsx > audit214/jest-seed-rest-2.log`.
Dio `exit=0`, `Test Suites: 2 passed`, `Tests: 71 passed`.

### Arreglos de la semilla frente a la spec

La semilla se aparta de la spec en tres anclas de producción:
- P16: la semilla pinta el reintento de Familia con otra etiqueta de apertura.
- P18: falta el doble en `test/jest-setup.js`, porque la semilla lo declaraba en el test.
- P19: la semilla usaba un doble `virtual`.

Ninguna de las tres cambia lo que cuentan los candados de §7.1. La spec fija lo correcto en design.md §6 y §7.1 P16–P19, y Codex sigue la spec, no la semilla.

### Erratas: estado final

| Id | Estado | Dónde |
|---|---|---|
| F1 | Aplicada. #218 va primero (Paso 0 de tasks.md), las dos hojas usan la receta de #218 y la lista de importadores pasa a tres (filas 13 y 14). | design §3, §7.1 filas 13–14, P7–P14; §7.3; tasks Paso 0 |
| F2 | Aplicada. §6 es el único dueño del doble de expo-clipboard. El valor por defecto es `mockResolvedValue(true)` en el `beforeEach` de pet-invite. | design §6, P18–P19 |
| F3 | Aplicada. 49 filas en §7.1, cada una con su ancla `grep -cF` (base → después), `// #214 R<n>` y sufijo de título. Los Cancelar de las hojas y `border-danger` están cruzados en §7.2. La tabla cerrada está en tasks R24. | design §7.1, §7.2; tasks R24 |
| F4 | Aplicada. Import literal de Perfil (P1, P2; fila 18). | requirements R4; design §7.1 |
| F5 | Aplicada. Lista `/-link$/` en orden del DOM (filas 8–10). | design §7.1 |
| A1 | Aplicada. Cita de `removeBody` con «cuando quieras». | design §5.2 |
| A2 | Aplicada. «Rebuild del dev build (no delegado), parte de G4». No queda ningún «G3». | design §3, §6 |
| A3 | Aplicada. §7.3 cubre #217, #208, #209, #213 y #218, con la regla de sumar deltas y los fixtures `recurrence: null, recurrenceUntil: null` de #213. | design §7.3 |
| A4 | Aplicada. El test de R23 está en `src/utils/__tests__/pet-members.test.ts`, lee `package.json` y no importa nada. | requirements R23; design §6; tasks R23 |
| A5 | Aplicada. La premisa de `restoreAllMocks` desaparece. | design §3 |
| A6 | Aplicada. 17 hijos con #214 sola; 18 con #209 (`edit-profile` penúltimo); 19 con #208. | design §7.3 |
| A7 | Aplicada. `it.each` de cinco botones en R13. El orden de tasks pasa R13 detrás de R16 y R17. | requirements R13; tasks R13 |
| A8 | Aplicada. Un `it.each(['pet', 'members', 'me'])` por tipo de error. | requirements R8; tasks R8 |
| A9 | Aplicada. tasks.md marca cada `it` que nace verde, y traceability.md los anota. | tasks; traceability |
| A10 | Aplicada. `${CATEGORY_SLOTS.<slot>.ink}` en R4 y R6. | requirements R4, R6 |
| A11 | Aplicada. Llamadas `t('…')` directas en las píldoras de rol y en los errores de Unirme. | requirements R9, R19 |
| A12 | Aplicada. sha256 frente a la copia local de v140. | requirements cabecera; design §2 |
| A13 | **Pendiente.** Va al handoff, no a la spec: el `test ! -e` de `router.d.ts` antes de `tsc`. | handoff del leader |
| A14 | Aplicada. `pet-members-retry` sin labio, con la misma etiqueta de apertura que Horario (P15, P16). | requirements R8; design §7.2 |
| H1 | Registrada (22:23 UTC). Copy neutro y expo-clipboard aceptados. | design §5.1, §6 |
| H2 | Registrada. Copy de salir fijado por el humano. El en-US de leaveTitle, leaveBody y leaveConfirm se escribió después de las 22:47 UTC. | design §5.1 |
| H3 | Registrada. G1 del 2026-10-26 a las 22:47 UTC («ambos»), tomada en la sesión del leader. | design §5.1 |
| H4 | Registrada. Lo mismo que H3, para todo el copy de §5.1, en-US incluido. No cambia ningún literal. | design §5.1 |
| N1 | Aplicada. Sin comentarios `#214` en la producción de Inicio y Perfil (P5, P6), por `#190 R12` y `#173 R15`. | requirements R24; design §7.2 |
| N2 | Aplicada. `#194 R1` gana `+ 51` (fila 48). R22 pasa a 51 claves. | requirements R22; design §7.1 fila 48 |
| N3 | Aplicada. `#181 R2.4` acepta Familia como tercer escritor de `clearPet` (fila 49). | design §7.1 fila 49; tasks R17 |

### Cifras de §7.1 (resumen)

- Filas 1–4: 14 + 3 hijos.
- Filas 26 y 27: `44 + 1`.
- Fila 17: `16 + 1 + 1 + 1 + 4`.
- Fila 19: `6 + 1` y `5 + 1`.
- Filas 22 y 23: `+ 2`.
- Fila 48: `+ 51`.
- Fila 49: tres escritores de `clearPet`.

El resto está fila a fila en design.md §7.1. Todas las cifras van como base + delta, con
la base medida en la semilla (dev `8b4cb1bd` + `p218.diff`).

### Pendiente para el leader

1. **`members.leaveBodyNoOwner` (es-MX y en-US) no lo cubre G1.** La variante nació con H2, después de la aprobación de las 22:47 UTC. Queda marcada así en design §5.1 y en P20.
2. **El en-US de H2 (`leaveTitle`, `leaveBody`, `leaveConfirm`) es traducción propia, escrita después de las 22:47 UTC.** Hay que confirmar con el humano si la aprobación «ambos» lo cubre.
3. **A13 va al handoff:** `test ! -e` del `router.d.ts` obsoleto antes de `bunx tsc --noEmit`.
4. **Gates no delegados:** G2 (artboards y copy, incluidos los puntos 1 y 2), G4 (smoke en dispositivo, con el rebuild del dev build por `expo-clipboard`) y G5 (`dev` → `main`).
5. **#218 mergea antes que #214.** La base de toda la auditoría ya incluye `p218.diff`. Si #218 cambia antes de mergear, hay que re-medir las filas 13, 14 y P7–P10.
6. **Cifras con hermanas.** Las calcula quien mergee segundo, según la regla de §7.3:
   - con #217 dentro, las filas 26 y 27 pasan a `44 - 2 + 1`;
   - con #209 dentro, la fila 48 lleva `+ 77` y `+ 51` en líneas propias, la enmienda de `.at(-1)` es de #209 y hay que re-medir P15.
7. **Alternativa a N3, sin aplicar.** Quitar `clearPet` de R17 y dejar que la selección se limpie sola al invalidar la lista. Cambia el comportamiento de R17, así que lo decide el leader.
8. **Orden de tasks.md:**
   - R13 va detrás de R16 y R17, porque su `it.each` necesita el botón Salir y el aviso de salir.
   - R22 (tabla) va al final y nace verde entero. El rojo y el verde de R22 son los de R22 (catálogo), fila 48.
9. **`it` que pueden nacer verdes sin estar marcados:**
   - la fila `pet-members-leave` del `it.each` de R13;
   - los dos de R15 con rechazo;
   - `R20: editar vuelve al formulario`;
   - `R21: no selecciona hasta que la invalidación termina`.

   tasks.md los marca como posibles. Si nacen verdes, Codex los anota en `progress/impl_mobile-pet-members.md`.
