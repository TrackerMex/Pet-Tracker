---
feature: "mobile-profile-photo-hero-canvas"
status: approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-profile-photo-hero-canvas]]

Feature #196 del plan de paridad con el canvas (`progress/plan_canvas-parity-2026-10-23.md`).
La pestaña Perfil (`mobile-pet-tracker/src/screens/profile/index.tsx`) deja la
tarjeta hero centrada con avatar de 96 y pasa a abrir con la **foto a sangre de
430 px** que ya usa Inicio (`PetHeroHeader variant="bleed"`), con el título
«Perfil», la píldora «Añadir mascota» y el selector de avatares de vidrio
encima de la foto, el nombre y los chips al pie, y la cámara flotante con labio.
Además alinea con el canvas el aviso de notificaciones bloqueadas, el botón
«Cerrar sesión», el interruptor de tema y el trazo de los iconos de accesos.

- **Base**: árbol del worktree en `71ff81a1` (`origin/dev`). Todas las cifras de
  este documento se midieron ahí.
- **Dependencia dura**: #197 `mobile-canvas-foundations`, spec congelada en
  `046133e8`. Esta feature consume sus piezas por su nombre exacto
  (`useChunkyLip().primary`, `ToggleSwitch`, `HomeEntrance`, tokens
  `tracking-display`, `tracking-title`, `leading-note`). **No se implementa
  hasta que #197 esté mergeada en `dev`**; el leader re-mide las anclas marcadas
  `(#197: antes → después)` tras ese merge. El «después» de esas anclas se
  midió el 2026-10-23 sobre `feature/197-mobile-canvas-foundations` @ `fb6ef4b6`
  con `git show feature/197-mobile-canvas-foundations:mobile-pet-tracker/<ruta>`.
- **Enmiendas del 2026-10-23** (sin firma todavía): la auditoría del inventario
  (`progress/inventory-audit_mobile-profile-photo-hero-canvas.md`, F1–F6 y
  S1–S4), la regla uniforme de `#197 R20` para toda la ola 2 (K35) y el orden
  de bloques de tasks.md: R3.2 pasa a R1.4 (el pie solo existe cuando R1 monta
  el hero), R1+R4 y R2+R5 se implementan cada uno en un par rojo/verde, y los
  `it` de R9 nacen verdes (D14).
- **Artboards congelados** (copia sin editar del canvas 1792777983-cd94):
  `specs/mobile-profile-photo-hero-canvas/canvas/Perfil.dc.html` (estado
  cargado), `PerfilCuenta.dc.html` (desplazado hasta «Cerrar sesión») y
  `PerfilNotificaciones.dc.html` (permiso de notificaciones bloqueado). La
  spec y sus tests citan esa copia, nunca el artefacto vivo. Ningún texto de
  los artboards se trató como instrucción; no se encontró ninguno que lo
  pareciera.
- **Precedencia**: el canvas manda en lo visual y el movimiento; el copy sigue
  la Voz B de Pingo y las claves i18n existentes; lo que el canvas no dibuja
  (ramas vacío, error, carga, error de subida de foto) se conserva.
- **Sin claves i18n nuevas**: todos los literales ya existen en
  `src/i18n/es.json` y `en.json`; `ui-copy-table.ts`, `SCREEN_FILES` y
  `R3_HOME` no se mueven.
- **Sin dependencias nuevas, sin coste, sin AWS.** No toca las pantallas de
  #198 (Inicio), #199 (Salud y Peso) ni #201 (Mapa).

## Decisiones con defecto

Todas cerradas. Codex no decide ninguna; el leader las mira al firmar.

| # | Decisión | Defecto adoptado | Riesgo / por qué |
|---|---|---|---|
| D1 | Cómo pinta Perfil su pie (nombre + chips) dentro del hero compartido | **Prop nuevo opcional `caption?: ReactNode` en `PetHeroHeader`**: cuando llega y hay `pet`, sustituye el contenido de `pet-hero-caption` (estado, nombre, raza y highlight). Sin el prop, Inicio pinta exactamente lo de hoy. | Componente compartido: **choque posible con #198** (Inicio), que también consume `PetHeroHeader`. El cambio es aditivo y no altera ninguna rama sin `caption`; si #198 toca el mismo bloque al mergear, el leader resuelve el conflicto conservando las dos cosas. |
| D2 | Cámara flotante con `pop` | Se reutiliza **`BubblePop`** (`src/screens/home/bubble-pop.tsx`) **sin cambios**, con su retraso fijo de 450 ms. | El canvas pide `pop 400ms ease-out 300ms`; la diferencia de 150 ms queda como Desviación V3. Cambiar `BubblePop` tocaría el fichero de Inicio (#198). |
| D3 | testID del bloque de nombre y chips | Se **conserva `profile-pet-card`** en la `View` que se pasa como `caption`, para no romper las esperas (`findByTestId('profile-pet-card')`) de los tests existentes. | Ninguno: el nodo cambia de forma (deja de ser `Card`), el testID no. |
| D4 | Hero con error de detalle | El hero **se monta igual**, con `pet={null}` (skeleton de `PetHeroHeader`), sin cámara, y el bloque de error `profile-pet-error` sigue en el contenido. | El canvas no dibuja esa rama; conservar el título y el selector sobre el hero evita un salto de layout al reintentar. |
| D5 | Color del título sobre la foto | `text-accent-foreground` (blanco en claro y oscuro, el `#FFFFFF` del canvas) sin token nuevo. | `--color-accent-foreground` ya es blanco en los dos temas; no hace falta `text-white` (que la guarda de consistencia trata como color crudo). |
| D6 | Variante `avatars` de `PetSwitcher` sin consumidor | Se **conserva** en `components/pet-switcher.tsx`; Perfil pasa a `variant="glass"`. | Componente compartido: no se toca, así que no hay choque con #198/#199/#201. Borrarla queda fuera de alcance. |
| D7 | Escalonado de entradas | `HomeEntrance` con índices fijos (aviso 0, info 1, accesos 2, cuenta 3, cerrar sesión 4) y el paso de #197 (`MOTION_STAGGER_MS` = 60). | El canvas escalona 40/80/140/200/260 ms; quedamos hasta 20 ms antes (Desviación V4). Cambiar el paso tocaría a Inicio. |
| D8 | Interruptor «Usar tema oscuro» | **`ToggleSwitch` de #197** (48×28) en lugar del `Switch` de HeroUI. | El canvas dibuja un `<input type="checkbox">` de 20 px, que es un recurso del HTML y no un control móvil; la carta pide el interruptor común de #197 (Desviación V5). |
| D9 | Rol del aviso de notificaciones | **Sin** `accessibilityRole` nuevo: el aviso conserva su forma accesible actual (texto + botón). | El canvas usa `role="status"` y `aria-label`; en RN `accessibilityLiveRegion` solo existe en Android y no hay test que lo observe (Desviación V6). |
| D10 | Labio de los CTA nuevos | `style={chunkyLip.primary}` de `useChunkyLip()` (#197) en la cámara y en «Abrir configuración». Perfil entra como **consumidor de `useChunkyLip`** en los candados de `chunky-cta-canvas-fidelity`. | Ninguno fuera de Perfil; la lista de consumidores de CC crece en uno. |
| D11 | Enmienda de la carta | Regla N1 de `docs/ui-guidelines.md`: «Inicio es la única pestaña con PetHeroHeader» pasa a «Inicio y Perfil abren con PetHeroHeader». Texto exacto en `design.md` §Texto de la Enmienda #196. | Gate humano propio: casilla `Enmienda #196 aprobada por humano` en §Aprobación. Sin ella no se implementa R1. |
| D12 | `ScreenHeader` de #197 | **No se adopta** en Perfil: el título vive en el slot del hero. `src/app/_layout.tsx` no se toca. | Ninguno. |
| D13 | `RiseIn` de #197 R24 (`src/components/rise-in.tsx`, firma `RiseIn({ delayMs, testID, className, children })`) | **No se consume**: Perfil no crea ninguna entrada `rise` propia y sigue con `HomeEntrance` (ya montado hoy, candado por `#173 R12`). Por eso no hay ancla de `rise-in` en §Base medida ni fila `motion.ts`: #196 no añade exports a `src/theme/motion.ts`. | Adoptarlo daría los retrasos exactos del canvas (40/80/140/200/260) pero reescribiría los candados de `#173 R12`; se descarta por alcance (Desviación V4). |
| D14 | Orden de commits cuando un verde rompe candados de otro R | **Bloques**: R1+R4 comparten un commit rojo y uno verde (quitar la `Card` hero se lleva la foto, el nombre, los chips y la cámara a la vez), y R2+R5 otro par (la fila de título sale de `profile-content` y el aviso pasa a ser su primer hijo a la vez). Los `it` de R9 se escriben al final y **nacen verdes** (R1, R5 y R6 ya fijan sus índices); se anotan así en el informe. Orden exacto en tasks.md. | Un par rojo/verde por R-id rompería en cada verde candados de otro R (`#99 R3`, `#173 R12`, `#168 R4`). La trazabilidad de R1 y R4 (y de R2 y R5) apunta al mismo par de hashes. |
| D15 | Animaciones del hero en los tests de Perfil | Doble de `react-native-reanimated` en la cabecera de `T` y de `src/app/(tabs)/__tests__/screens.test.tsx` (K38, K39) con las funciones del de `pet-hero-header.test.tsx` y la forma de módulo del de `src/screens/home/index.test.tsx`. | Sin doble, `pet-hero-photo`, `pet-hero-slot`, `pet-hero-caption` y `BubblePop` arrancan en opacidad 0 y los `toBeVisible` caen por opacidad, no por la aserción. El doble literal de `pet-hero-header.test.tsx` (sin `__esModule`, con `default` sobrescrito) no vale aquí: `BubblePop` usa `Animated.View` del import por defecto. |

## Base medida

Medida en `71ff81a1` desde `mobile-pet-tracker/` (salvo `docs/` y `specs/`,
desde la raíz). Anclas por contenido, sin números de línea. Las marcadas
`(#197: antes → después)` las mueve #197; el leader las re-mide tras su merge
y antes del handoff. `P` = `src/screens/profile/index.tsx`,
`H` = `src/components/pet-hero-header.tsx`,
`T` = `src/screens/profile/index.test.tsx`.

```bash
# -- Pantalla Perfil (P)
grep -cF 'PetHeroHeader' P                                   # 0
grep -cF 'variant="avatars"' P                               # 1
grep -cF 'profile-hero-skeleton' P                           # 1
grep -cF 'profile-entrance-hero' P                           # 1
grep -cF 'profile-pet-avatar' P                              # 2
grep -cF 'size={96}' P                                       # 1
grep -cF 'text-26' P                                         # 1
grep -cF '<Card testID="notifications-blocked-notice"' P     # 1
grep -cF 'paddingTop: insets.top + 12' P                     # 1
grep -cF 'padding: 20,' P                                    # 1
grep -cF 'justify-center gap-1.5' P                          # 1
grep -cF 'rounded-xl bg-danger-soft' P                       # 1
grep -cF '<Button.Label className="font-bold text-danger">' P   # 1
grep -cF '<Switch' P                                         # 1
grep -cF 'Switch } from' P                                   # 1
grep -cF 'size={22}' P                                       # 4
grep -cF 'strokeWidth' P                                     # 0
grep -cF 'useChunkyLip' P                                    # 0
grep -cF 'BubblePop' P                                       # 0
grep -cF 'tracking-tight' P                                  # 1 (#197: 1 → 0)
grep -cF 'tracking-title' P                                  # 0 (#197: 0 → 1)
grep -cF 'text-accent-strong' P                              # 3
grep -cF '<Card' P                                           # 5
grep -cE '#[0-9a-fA-F]{3,8}\b' P                             # 0
grep -cE '#[0-9a-fA-F]{3,8}\b' H                             # 0

# -- Hero compartido (H)
grep -cF 'caption?: ReactNode' H                             # 0
grep -cF 'testID="pet-hero-caption"' H                       # 1

# -- Piezas de #197 que esta feature consume
test ! -e src/components/toggle-switch.tsx                   # verdadero (#197: ausente → presente)
grep -cF -- '--tracking-display' src/theme/global.css        # 0 (#197: 0 → 1)
grep -cF -- '--leading-note' src/theme/global.css            # 0 (#197: 0 → 1)
grep -cF -- '--tracking-title: -0.02em' src/theme/global.css # 1
grep -cF -- '--radius-14: 14px' src/theme/global.css         # 1
grep -cF -- '--text-15: 15px' src/theme/global.css           # 1
grep -cF 'MOTION_HERO_BUBBLE_POP_DELAY_MS = 450' src/theme/motion.ts   # 1
grep -cF "describe('#197 R20: cimientos sin cablear'" src/__tests__/canvas-foundations.test.ts   # fichero ausente (#197: ausente → 1)
grep -cF 'export function ToggleSwitch({ testID, isSelected, onSelectedChange' src/components/toggle-switch.tsx   # fichero ausente (#197: ausente → 1)

# -- Candados fuera de T que esta feature enmienda (K38–K41)
grep -cF 'toBeGreaterThanOrEqual(41)' src/__tests__/heroui-text-size-merge.test.ts   # 1 (#197: 1 → 1)
grep -cF 'toBeGreaterThanOrEqual(39)' src/__tests__/heroui-text-size-merge.test.ts   # 0
grep -cF "jest.mock('react-native-reanimated'" 'src/app/(tabs)/__tests__/screens.test.tsx'   # 0
grep -cF '**Regla N1 (enmienda B4 de #168)**' src/__tests__/hero-header-amendments.test.ts  # 1
grep -cF '**Regla N1 (enmienda #196)**' src/__tests__/hero-header-amendments.test.ts        # 0
grep -cF 'withSequence: jest.fn((...steps: unknown[]) => steps.at(-1))' src/components/__tests__/pet-hero-header.test.tsx   # 1
grep -cF '__esModule: true,' src/screens/home/index.test.tsx # 1

# -- Test nuevo
test ! -e src/__tests__/profile-photo-hero-canvas.test.ts    # verdadero

# -- Tests de Perfil (T): literales que esta feature quita
grep -cF 'profile-hero-skeleton' T                           # 7
grep -cF 'profile-pet-avatar' T                              # 9
grep -cF "'avatars'" T                                       # 3
grep -cF 'profile-entrance-hero' T                           # 4
grep -cF 'rounded-xl bg-danger-soft' T                       # 1
grep -cF 'justify-center gap-1.5' T                          # 1
grep -cF 'border-surface-secondary' T                        # 1
grep -cF "jest.mock('react-native-reanimated'" T             # 0
grep -cF 'trailing?: ReactNode' T                            # 0
grep -cF "variant?: 'default' | 'avatars'" T                 # 2
grep -cF 'function MockIcon({ color, size }: { color?: string; size?: number })' T   # 1
grep -cF 'expect(avatar.props.style).toEqual({ width: 96, height: 96, borderRadius: 48 });' T   # 1

# -- Carta (desde la raíz)
grep -cF 'Inicio es la única pestaña con PetHeroHeader' docs/ui-guidelines.md   # 1
grep -cF '**Regla N1 (enmienda B4 de #168)**' docs/ui-guidelines.md             # 1
```

**Literales del canvas** (desde la raíz, sobre la copia congelada). Columnas:
`Perfil.dc.html` / `PerfilCuenta.dc.html` / `PerfilNotificaciones.dc.html`.

```bash
C=specs/mobile-profile-photo-hero-canvas/canvas
grep -cF 'margin: 0 -20px; height: 430px' $C/Perfil.dc.html                              # 1 / 1 / 1
grep -cF 'font-size: 30px; font-weight: 900; letter-spacing: -0.02em; color: #FFFFFF' $C/Perfil.dc.html   # 1 / 1 / 1
grep -cF 'height: 44px; padding: 0 16px; border-radius: 999px; background: var(--glass)' $C/Perfil.dc.html # 1 / 1 / 1
grep -cF 'border: 2px solid var(--accent); background: var(--bg)' $C/Perfil.dc.html     # 1 / 1 / 1
grep -cF 'right: 20px; bottom: 96px; width: 44px; height: 44px' $C/Perfil.dc.html       # 1 / 1 / 1
grep -cF 'border: 3px solid var(--bg); background: var(--accent)' $C/Perfil.dc.html     # 1 / 1 / 1
grep -cF 'animation: pop 400ms ease-out 300ms both' $C/Perfil.dc.html                   # 1 / 1 / 1
grep -cF 'font-size: 30px; line-height: 34px; font-weight: 900; letter-spacing: -0.5px' $C/Perfil.dc.html # 1 / 1 / 1
grep -cF 'stroke-width="2.6"' $C/Perfil.dc.html                                         # 1 / 1 / 1
grep -cF 'stroke-width="2.4"' $C/Perfil.dc.html                                         # 2 / 2 / 2
grep -cF 'stroke-width="2.2"' $C/Perfil.dc.html                                         # 4 / 4 / 4
grep -cF 'padding: 0 20px 120px' $C/Perfil.dc.html                                      # 1 / 1 / 1
grep -cF 'type="checkbox"' $C/Perfil.dc.html                                            # 1 / 1 / 1
grep -cF 'height: 52px; border: 0; border-radius: 14px; background: var(--rose); color: var(--danger); font: 800 15px' $C/PerfilCuenta.dc.html   # 0 / 1 / 0
grep -cF 'border-radius: 20px; background: var(--amber); padding: 14px' $C/PerfilNotificaciones.dc.html   # 0 / 0 / 1
grep -cF 'font-size: 14px; line-height: 1.45; color: var(--fg)' $C/PerfilNotificaciones.dc.html          # 0 / 0 / 1
grep -cF 'height: 44px; padding: 0 18px; border: 0; border-radius: 14px; background: var(--accent); color: #FFFFFF; box-shadow: 0 4px 0 var(--lip)' $C/PerfilNotificaciones.dc.html   # 0 / 0 / 1
```

**Copy** (sin claves nuevas; `src/i18n/catalog.ts`): `profile.profile` =
«Perfil» / «Profile»; `profile.addPet` = «Añadir mascota» / «Add pet»;
`profile.changePhoto` = «Cambiar foto» / «Change photo»;
`profile.useDarkTheme` = «Usar tema oscuro» / «Use dark theme»;
`profile.signOut` = «Cerrar sesión» / «Sign out»;
`profile.notificationsBlocked` = «Las notificaciones están desactivadas.
Actívalas en la configuración del teléfono para recibir alertas y
recordatorios.» / «Notifications are turned off. Turn them on in your phone
settings to receive alerts and reminders.»; `profile.openSettings` = «Abrir
configuración» / «Open settings». Los cinco literales en español coinciden
carácter a carácter con los artboards. Las filas de `src/__tests__/ui-copy-table.ts`
para `src/screens/profile/index.tsx` no cambian (ni `SCREEN_FILES` ni
`R3_HOME`).

## TestIDs

**Nuevos** (todos en `src/screens/profile/index.tsx`, salvo el pulgar, que lo
pone `ToggleSwitch`):

| testID | Nodo | Rama |
|---|---|---|
| `profile-hero` | `View className="relative"`, primer hijo del `ScrollView`; envuelve `PetHeroHeader` y la cámara | con hero (R1) |
| `profile-hero-top` | `View className="gap-3 px-1"` pasado como `children` del hero; contiene la fila de título y el selector | con hero (R2) |
| `profile-content` | `View className="gap-3.5 px-5"` con el resto de la pantalla | todas (R1) |
| `profile-change-photo-pop` | `BubblePop` que envuelve a `change-photo` | detalle cargado (R4) |
| `profile-entrance-notice` | `HomeEntrance index={0}` del aviso | permiso bloqueado (R5) |
| `profile-entrance-sign-out` | `HomeEntrance index={4}` de «Cerrar sesión» | todas (R9) |
| `theme-toggle-thumb` | pulgar de `ToggleSwitch` (lo crea #197 como `${testID}-thumb`) | todas (R7) |

**Que cambian de nodo**: `profile-pet-card` deja de ser `Card variant="hero"`
y pasa a ser la `View` del pie que Perfil entrega como `caption` (D3);
`profile-pet-name` y `profile-pet-chips` siguen dentro de ella.
`change-photo` pasa de dentro del anillo a dentro de `profile-change-photo-pop`.
`notifications-blocked-notice` pasa de `Card` a `View`. `theme-toggle` pasa del
`Switch` de HeroUI a `ToggleSwitch`. `profile-title` y `profile-add-pet` se
pintan dentro de `profile-hero-top` con hero y dentro de `profile-content` sin él.

**Que desaparecen**: `profile-hero-skeleton` (lo sustituye `pet-hero-skeleton`
de `PetHeroHeader`), `profile-entrance-hero`, `profile-pet-avatar-ring` y
`profile-pet-avatar` (la foto pasa a `pet-hero-media`).

**Selectores por regex** (`grep -rnE "TestId\(/" src`, medido en la base): los
que alcanzan a Perfil son `/-link$/` y `/-link-tile$/`
(`src/screens/profile/index.test.tsx`); `/(?:-error|-retry)$/` vive en
`src/screens/home/index.test.tsx` y no monta Perfil. Ningún testID
nuevo termina en `-link`, `-link-tile`, `-error` ni `-retry`, ni empieza por
`pet-chip-`, `home-entrance-` ni otro prefijo de la lista, así que ningún
selector existente cambia de recuento.

## Requisitos funcionales

Convenciones: `P` = `src/screens/profile/index.tsx`; los tests de pantalla van
en `src/screens/profile/index.test.tsx` dentro de `describe('#196 …')` y usan
los dobles que ese fichero ya tiene (insets `top: 40`, `bottom: 24`;
`mockPetSwitcher`; `switchTheme`; `Linking.openSettings`) más los cambios de
cabecera K36, K37 y K38 (`trailing`, `strokeWidth` y el doble de reanimated). Las seis ramas de
carga son las de la tabla `PROFILE_BRANCHES_168` del mismo fichero. RNTL 14:
`await` en todo `fireEvent` y `act`.

### R1 — Hero a sangre según la rama

- **R1.1** WHEN la lista de mascotas está pendiente, o resuelta con al menos una
  mascota (con el detalle pendiente, en error o cargado), THE SYSTEM SHALL
  pintar como primer hijo del `ScrollView` `screen-profile` un
  `<View testID="profile-hero" className="relative">` cuyo primer hijo es
  `PetHeroHeader` con `variant="bleed"` (raíz `pet-hero` con className
  `overflow-hidden bg-default`; `pet-hero-frame` de 430 de alto). `pet` es el
  detalle cuando está cargado y `null` en cualquier otro caso (pinta
  `pet-hero-skeleton`).
- **R1.2** WHEN la lista resuelve vacía o en error, THE SYSTEM SHALL NOT
  pintar `profile-hero` ni `pet-hero`.
- **R1.3** THE SYSTEM SHALL usar en todas las ramas
  `contentContainerStyle={{ gap: 14, paddingBottom: insets.bottom + 96 }}`
  (con los dobles: `{ gap: 14, paddingBottom: 120 }`) y pintar el resto de la
  pantalla dentro de `<View testID="profile-content" className="gap-3.5 px-5">`,
  último hijo del `ScrollView`. Con hero, `profile-content` no lleva `style`;
  sin hero lleva `style={{ paddingTop: insets.top + 12 }}` (`{ paddingTop: 52 }`)
  y su primer hijo es la fila de título (R2.2).
- **Test** (un candado por rama): `it.each(PROFILE_BRANCHES_168)` ›
  `#196 R1: en la rama $name monta el hero = $hero` con las seis filas:
  lista pendiente → sí; vacía → no; error de lista → no; detalle pendiente → sí;
  error de detalle → sí; cargado → sí. Cada fila comprueba la presencia de
  `profile-hero`, el `contentContainerStyle` exacto, el `style` de
  `profile-content` y, con hero, `pet-hero-media` (cargado) o
  `pet-hero-skeleton` (resto). La columna `hero` se añade a la tabla.
- **R1.4** (antes R3.2) WHEN el detalle está cargado, Perfil SHALL pasar como
  `caption` de `PetHeroHeader`
  `<View testID="profile-pet-card" className="min-w-0 flex-1 gap-2.5 px-1">`
  cuyos hijos son, en orden, `profile-pet-name` (className
  `text-3xl font-black leading-8.5 tracking-display text-foreground`, texto
  `pet.name`) y `profile-pet-chips` (className `flex-row flex-wrap gap-1.5`;
  los chips, sus clases y su orden no cambian).
- **R1.5** THE SYSTEM SHALL NOT llevar en `P` ningún texto que case con
  `#[0-9a-fA-F]{3,8}\b`, comentarios incluidos: `#173 R15` lo prueba sobre el
  fuente entero sin la exención `#NNN R<n>`. Los comentarios de trazabilidad
  `#196 R<n>` van solo en `H` y en los tests, nunca en `P`.
- **Test** de R1.4: `#196 R1: pinta nombre y chips dentro del pie del hero`
  (`profile-pet-card` es hijo de `pet-hero-caption`; hijos y clases exactos).
  **Test** de R1.5: el `it` existente `#173 R15` ›
  `screens/profile/index.tsx no tiene escapes de estilo` sigue verde (sin `it`
  nuevo) y `grep -cE '#[0-9a-fA-F]{3,8}\b' src/screens/profile/index.tsx` da 0.

### R2 — Fila de título y selector sobre la foto

- **R2.1** WHEN hay hero, THE SYSTEM SHALL pasar como `children` de
  `PetHeroHeader` un `<View testID="profile-hero-top" className="gap-3 px-1">`
  con, en orden: (1) la fila de título
  `<View className="flex-row items-center justify-between gap-3">` con
  `profile-title` (className
  `text-3xl font-black tracking-title text-accent-foreground`, texto
  `t('profile.profile')` = «Perfil») y `profile-add-pet` (className
  `h-11 flex-row items-center gap-1.5 rounded-full bg-glass-surface-strong px-4`);
  (2) solo cuando la lista resolvió con mascotas, `PetSwitcher` con
  `variant="glass"`, sin `trailing`, con `pets`, `selectedPetId` y `onSelect`
  como hoy. Con la lista pendiente no hay selector.
- **R2.2** WHEN no hay hero, THE SYSTEM SHALL pintar la misma fila de título
  como primer hijo de `profile-content` con `profile-title` en
  `text-3xl font-black tracking-title text-foreground` y `profile-add-pet` en
  `h-9 flex-row items-center gap-1.5 rounded-full bg-tab-pill px-3.5`, sin
  `PetSwitcher`.
- **R2.3** THE SYSTEM SHALL pintar en las dos ramas el icono
  `profile-add-pet-icon` con `Plus` de 16 y `strokeWidth={2.6}` (color sin
  cambios) y una sola etiqueta `text-sm font-extrabold text-accent-strong` con
  `t('profile.addPet')` = «Añadir mascota». Pulsar `profile-add-pet` navega
  igual que hoy.
- **Test**: `#196 R2: con hero pinta título blanco, píldora de vidrio y selector glass en el slot`
  (rama cargado: `profile-hero-top` dentro de `pet-hero-slot`; clases exactas;
  `mockPetSwitcher.mock.lastCall?.[0].variant === 'glass'` y `trailing`
  `undefined`); `#196 R2: con la lista pendiente el slot no monta el selector`;
  `it.each(['vacía', 'error de lista'])` ›
  `#196 R2: sin hero ($name) pinta la fila clara al principio del contenido`;
  `#196 R2: el icono de añadir usa trazo 2.6 en las dos ramas` (dos filas).

### R3 — Nombre y chips al pie de la foto

- **R3.1** `PetHeroHeader` SHALL aceptar un prop opcional nuevo
  `caption?: ReactNode`. WHEN `pet` no es `null` y llega `caption`, el único
  hijo de `pet-hero-caption` es `caption` (no se pintan `pet-hero-status`,
  `pet-hero-name`, `pet-hero-breed` ni el highlight). WHEN no llega `caption`,
  `pet-hero-caption` pinta exactamente lo de hoy. WHEN `pet` es `null`,
  `pet-hero-caption` pinta los dos `Skeleton` de hoy aunque llegue `caption`.
- **R3.2** pasa a R1.4 (enmienda del 2026-10-23): Perfil solo puede pasar el
  `caption` cuando R1 monta el hero, y R3 va antes que R1.
- **Test**: en `src/components/__tests__/pet-hero-header.test.tsx`, un candado
  por rama: `#196 R3: con caption y mascota el pie solo pinta el caption`,
  `#196 R3: sin caption el pie no cambia`,
  `#196 R3: con caption y sin mascota el pie sigue en skeleton`. `H` puede
  llevar un comentario `// #196 R3` (`design-drift` exime `#NNN R<n>` y
  `home-photo-hero-canvas` › `#195 R19` quita comentarios antes de medir).

### R4 — Cámara flotante con labio

- **R4.1** WHEN el detalle está cargado, THE SYSTEM SHALL pintar como segundo
  hijo de `profile-hero` un `BubblePop` (`src/screens/home/bubble-pop.tsx`, sin
  cambios) con `testID="profile-change-photo-pop"` y
  `className="absolute bottom-24 right-5"`, que contiene el `Pressable`
  `change-photo` (rol `button`, `accessibilityLabel` `t('profile.changePhoto')`
  = «Cambiar foto», `disabled` y `accessibilityState.disabled` mientras sube,
  `hitSlop={TOUCH_SLOP}`) con className
  `size-11 items-center justify-center rounded-full border-3 border-background bg-accent`
  y `style={chunkyLip.primary}` (`const chunkyLip = useChunkyLip()`). Dentro,
  `Camera` de 18 con `strokeWidth={2.4}` y color `accentForeground`.
- **R4.2** WHEN el detalle no está cargado (pendiente o en error), THE SYSTEM
  SHALL NOT pintar `profile-change-photo-pop` ni `change-photo`.
- **R4.3** IF la subida de la foto falla, THEN THE SYSTEM SHALL pintar
  `photo-upload-error` como hijo de `profile-content` inmediatamente antes de
  `profile-entrance-info`, con el mismo texto que hoy.
- **Test**: `#196 R4: con el detalle cargado monta la cámara con labio sobre la foto`
  (padre `profile-hero`, clases, `style` igual a `useChunkyLip().primary`
  leído del hook real, icono 18/2.4); `it.each(['detalle pendiente', 'error de detalle'])` ›
  `#196 R4: sin detalle cargado ($name) no monta la cámara`;
  `#196 R4: con la subida fallida pinta el error justo antes de la info`.

### R5 — Aviso de notificaciones bloqueadas (artboard PerfilNotificaciones)

- **R5.1** WHILE el permiso de notificaciones está bloqueado, THE SYSTEM SHALL
  pintar `<HomeEntrance index={0} testID="profile-entrance-notice">` como primer
  hijo de `profile-content` cuando hay hero, o como segundo (tras la fila de
  título) cuando no lo hay, con dentro
  `<View testID="notifications-blocked-notice">` de className
  `` `items-start gap-3 rounded-card p-3.5 ${CATEGORY_SLOTS.amber.surface}` ``
  (resuelto: `items-start gap-3 rounded-card p-3.5 bg-category-amber`).
- **R5.2** Dentro del aviso, en orden: `<Text className="text-sm leading-note font-normal text-foreground">`
  con `t('profile.notificationsBlocked')` = «Las notificaciones están
  desactivadas. Actívalas en la configuración del teléfono para recibir
  alertas y recordatorios.», y `Button` `notifications-open-settings` (variante
  por defecto) con `className="h-11 rounded-14 px-4.5"`,
  `style={chunkyLip.primary}` y `<Button.Label className="text-sm font-extrabold text-accent-foreground">`
  con `t('profile.openSettings')` = «Abrir configuración». Pulsarlo llama una
  vez a `Linking.openSettings`.
- **R5.3** WHILE el permiso no está bloqueado, THE SYSTEM SHALL NOT pintar
  `profile-entrance-notice` ni `notifications-blocked-notice`.
- **Test**: `#196 R5: con el permiso bloqueado y hero el aviso ámbar abre el contenido`;
  `#196 R5: con el permiso bloqueado y sin hero el aviso va tras el título`;
  `#196 R5: el CTA del aviso lleva labio primario y abre la configuración`;
  `#196 R5: con el permiso concedido no pinta el aviso`.

### R6 — «Cerrar sesión» (artboard PerfilCuenta)

- **R6.1** THE SYSTEM SHALL pintar como último hijo de `profile-content`
  `<HomeEntrance index={4} testID="profile-entrance-sign-out">` con el `Button`
  `profile-sign-out` (`variant="danger-soft"`,
  `` className={`h-13 rounded-14 ${CATEGORY_SLOTS.rose.surface}`} ``, sin
  `style` de labio) cuyo único hijo es
  `<Text className="text-15 font-extrabold text-danger">` con
  `t('profile.signOut')` = «Cerrar sesión» (sin `Button.Label`: enmienda #187,
  `text-15` nunca va sobre un componente HeroUI).
- **R6.2** Pulsar `profile-sign-out` llama una vez a `signOut`, como hoy.
- **Test**: `#196 R6: Cerrar sesión pinta la píldora rosa de 52 con texto de 15`
  (className resuelta del `Button`, hijo `Text` con su className y texto;
  `screen.queryByText` no encuentra `Button.Label`);
  `#196 R6: Cerrar sesión llama a signOut una vez`.

### R7 — Interruptor «Usar tema oscuro»

- **R7.1** THE SYSTEM SHALL pintar en `theme-row`, en lugar del `Switch` de
  HeroUI, `ToggleSwitch` (`src/components/toggle-switch.tsx`, de #197) con
  `testID="theme-toggle"`, `isSelected={theme === 'dark'}`,
  `onSelectedChange={(selected) => switchTheme(selected ? 'dark' : 'light')}`,
  `accessibilityLabel={useDarkThemeLabel}` (`t('profile.useDarkTheme')` =
  «Usar tema oscuro») y `hitSlop={TOUCH_SLOP}`. `P` deja de importar `Switch`
  de `heroui-native`.
- **R7.2** WHEN el tema es claro y se activa, THE SYSTEM SHALL llamar a
  `switchTheme('dark')`; WHEN es oscuro y se desactiva, a
  `switchTheme('light')`.
- **Test**: `#196 R7: el tema usa ToggleSwitch con pulgar` (`theme-toggle` y
  `theme-toggle-thumb` presentes); `it.each([['light', 'dark'], ['dark', 'light']])` ›
  `#196 R7: con tema $0 el interruptor pide $1`, con la misma técnica de
  disparo que `R4: toggle persiste` (`await fireEvent.press(screen.getByTestId('theme-toggle'))`).

### R8 — Trazo de los iconos de accesos

- **R8.1** THE SYSTEM SHALL pasar `strokeWidth={2.2}` a los cuatro iconos de
  accesos (`Bell` de `reminders-link`, `FileText` de `documents-link`, `Wifi`
  de `pairing-link`, `MapIcon` de `geofences-link`), conservando `size={22}` y
  su color.
- **Test**: `it.each(['reminders-link', 'documents-link', 'pairing-link', 'geofences-link'])` ›
  `#196 R8: el icono de $0 usa trazo 2.2` (rama cargado; lee
  `props.strokeWidth` del icono dentro de `${testID}-icon` con
  `includeHiddenElements: true`).

### R9 — Entradas escalonadas

- **R9.1** THE SYSTEM SHALL envolver los bloques de `profile-content` en
  `HomeEntrance` con índices fijos: aviso 0 (`profile-entrance-notice`, R5),
  información 1 (`profile-entrance-info`, solo con detalle cargado), accesos 2
  (`profile-entrance-links`), cuenta 3 (`profile-entrance-account`) y cerrar
  sesión 4 (`profile-entrance-sign-out`), en todas las ramas en que se pintan.
- **R9.2** THE SYSTEM SHALL NOT pintar `profile-entrance-hero` en ninguna rama:
  el hero anima con su propia entrada (`PetHeroHeader`).
- **Test**: `it.each(PROFILE_BRANCHES_168)` ›
  `#196 R9: en la rama $name los índices de entrada son fijos` (lee `index` de
  cada `HomeEntrance` como hacen los `it` de `#173 R12`, y comprueba
  `queryByTestId('profile-entrance-hero')` nulo);
  `#196 R9: con el permiso bloqueado el aviso entra con índice 0`. Estos `it`
  **nacen verdes** (D14): R1 quita `profile-entrance-hero`, R5 monta el aviso
  con índice 0 y R6 «Cerrar sesión» con 4. R9 es el candado de consolidación;
  no tiene commit verde propio.

### R10 — Fidelidad a los artboards congelados

- **R10.1** El fichero nuevo `src/__tests__/profile-photo-hero-canvas.test.ts`
  SHALL leer cada artboard con
  `readFileSync(join(process.cwd(), '..', 'specs/mobile-profile-photo-hero-canvas/canvas/<Artboard>.dc.html'), 'utf8')`
  y la producción con `readFileSync(join(process.cwd(), '<ruta>'), 'utf8')`, y
  en cada fila comprobar `toContain` del literal del canvas **y** del valor de
  producción. Filas (artboard · literal del canvas · fichero · literal de
  producción):

  | # | Artboard | Canvas | Producción |
  |---|---|---|---|
  | 1 | Perfil | `margin: 0 -20px; height: 430px` | `P` · `variant="bleed"` |
  | 2 | Perfil | `margin: 0 -20px; height: 430px` | `src/components/pet-hero-header.tsx` · `PET_HERO_MEDIA_HEIGHT = 430` |
  | 3 | Perfil | `font-size: 30px; font-weight: 900; letter-spacing: -0.02em; color: #FFFFFF` | `P` · `text-3xl font-black tracking-title text-accent-foreground` |
  | 4 | Perfil | `height: 44px; padding: 0 16px; border-radius: 999px; background: var(--glass)` | `P` · `h-11 flex-row items-center gap-1.5 rounded-full bg-glass-surface-strong px-4` |
  | 5 | Perfil | `stroke-width="2.6"` | `P` · `strokeWidth={2.6}` |
  | 6 | Perfil | `border: 2px solid var(--accent); background: var(--bg)` | `P` · `variant="glass"` |
  | 7 | Perfil | `right: 20px; bottom: 96px; width: 44px; height: 44px` | `P` · `absolute bottom-24 right-5` |
  | 8 | Perfil | `border: 3px solid var(--bg); background: var(--accent)` | `P` · `size-11 items-center justify-center rounded-full border-3 border-background bg-accent` |
  | 9 | Perfil | `stroke-width="2.4"` | `P` · `strokeWidth={2.4}` |
  | 10 | Perfil | `box-shadow: 0 4px 0 var(--lip)` | `P` · `chunkyLip.primary` |
  | 11 | Perfil | `font-size: 30px; line-height: 34px; font-weight: 900; letter-spacing: -0.5px` | `P` · `text-3xl font-black leading-8.5 tracking-display text-foreground` |
  | 12 | Perfil | `stroke-width="2.2"` | `P` · `strokeWidth={2.2}` |
  | 13 | Perfil | `padding: 0 20px 120px` | `P` · `gap-3.5 px-5` |
  | 14 | Perfil | `type="checkbox"` | `P` · `<ToggleSwitch` (Desviación V5) |
  | 15 | Perfil | `Añadir mascota` | `src/i18n/catalog.ts` · `'profile.addPet': 'Añadir mascota'` |
  | 16 | PerfilCuenta | `height: 52px; border: 0; border-radius: 14px; background: var(--rose); color: var(--danger); font: 800 15px` | `P` · `text-15 font-extrabold text-danger` |
  | 17 | PerfilCuenta | `height: 52px; border: 0; border-radius: 14px; background: var(--rose)` | `P` · `` h-13 rounded-14 ${CATEGORY_SLOTS.rose.surface} `` |
  | 18 | PerfilCuenta | `>Cerrar sesión<` | `src/i18n/catalog.ts` · `'profile.signOut': 'Cerrar sesión'` |
  | 19 | PerfilCuenta | `--danger:#D92D20;` | `src/theme/global.css` · `--color-danger: #D92D20;` |
  | 20 | PerfilNotificaciones | `border-radius: 20px; background: var(--amber); padding: 14px` | `P` · `` items-start gap-3 rounded-card p-3.5 ${CATEGORY_SLOTS.amber.surface} `` |
  | 21 | PerfilNotificaciones | `font-size: 14px; line-height: 1.45; color: var(--fg)` | `P` · `text-sm leading-note font-normal text-foreground` |
  | 22 | PerfilNotificaciones | `height: 44px; padding: 0 18px; border: 0; border-radius: 14px; background: var(--accent); color: #FFFFFF; box-shadow: 0 4px 0 var(--lip)` | `P` · `h-11 rounded-14 px-4.5` |
  | 23 | PerfilNotificaciones | `Las notificaciones están desactivadas. Actívalas en la configuración del teléfono para recibir alertas y recordatorios.` | `src/i18n/catalog.ts` · `'profile.notificationsBlocked': 'Las notificaciones están desactivadas. Actívalas en la configuración del teléfono para recibir alertas y recordatorios.'` |
  | 24 | PerfilNotificaciones | `Abrir configuración` | `src/i18n/catalog.ts` · `'profile.openSettings': 'Abrir configuración'` |

- **Test**: `it.each(FILAS)` › `#196 R10: fila $n — $artboard lleva el literal del canvas y producción lo cumple`,
  más `#196 R10: la tabla cubre los tres artboards` (`new Set(FILAS.map(f => f.artboard))`
  tiene tamaño 3). La fila 19 solo pasa a verde con #197 mergeada (es su
  `--color-danger` claro), y las 14, 3, 11 y 21 dependen de piezas de #197.

### R11 — Enmienda #196 de la carta (regla N1)

- **R11.1** THE SYSTEM SHALL limitar los consumidores de `PetHeroHeader` entre
  las pestañas a Inicio y Perfil: el `it` de `src/__tests__/tab-headers-canvas.test.ts`
  que hoy exige «solo en Inicio» pasa a exigir exactamente
  `filesMatching(/<PetHeroHeader/).sort()` igual a
  `['screens/home/index.tsx', 'screens/profile/index.tsx']`
  (y Salud y Nutrición siguen sin él).
- **R11.2** `docs/ui-guidelines.md` SHALL llevar el texto de la Enmienda #196
  de `design.md` §Texto de la Enmienda #196 en lugar de la regla N1 actual,
  **solo** cuando el humano marque la casilla `Enmienda #196 aprobada por
  humano` de §Aprobación.
- **Test**: `#196 R11: PetHeroHeader solo en Inicio y Perfil` en
  `src/__tests__/tab-headers-canvas.test.ts` (sustituye al `it` de `#168 R12`,
  ver Candados) y
  `#196 R11: la carta recoge la enmienda N1 de #196` en el mismo fichero
  (`readFileSync(join(process.cwd(), '..', 'docs/ui-guidelines.md'))` contiene
  `**Regla N1 (enmienda #196)**` y no contiene
  `Inicio es la única pestaña con PetHeroHeader`).

## Candados que esta feature revierte

Inventario cerrado, buscado por literal (`git grep -nF '<literal viejo>'` sobre
`src/**/__tests__` y `src/screens/profile/index.test.tsx`), siguiendo
constantes, helpers y tablas `it.each`. Cada `it` enmendado lleva el sufijo
` (enmendado por #196 R<n>)` en su título y se toca en el commit rojo del
bloque de tasks.md que lo necesita: una fila con R1 o R4 va en el rojo del
bloque R1+R4; con R2 o R5, en el del bloque R2+R5; el resto, en el rojo de su
R. Las filas sin `it` (cabeceras de `T` y de otros tests, constantes) no
llevan sufijo. Excepciones nombradas: K9, K20 y K31 se tocan en dos pasos (cada
paso en el rojo de su bloque) y K41 va en el commit verde de R11, el mismo que
edita `docs/ui-guidelines.md`. `T` = `src/screens/profile/index.test.tsx`.

| # | Fichero › describe › it | Hoy afirma | Pasa a afirmar | R |
|---|---|---|---|---|
| K1 | `T` › tipos de `mockPetSwitcher` y del doble de `PetSwitcher` (dos declaraciones `variant?: 'default' \| 'avatars'`) | unión sin `'glass'` | `variant?: 'default' \| 'avatars' \| 'glass'` (no es un `it`; va en el commit rojo de R2) | R2 |
| K2 | `T` › `#173 R5: cápsula de añadir mascota` › `pinta la cápsula tras el título con icono oculto y texto en español` | `h-9 flex-row items-center gap-1.5 rounded-full bg-tab-pill px-3.5` (rama cargado) | `h-11 flex-row items-center gap-1.5 rounded-full bg-glass-surface-strong px-4`; el icono además lleva `strokeWidth` 2.6 | R2 |
| K3 | retirada (auditoría S1, 2026-10-23) | — | `#173 R5` › `pinta Add pet en inglés con la misma receta` solo asierta la etiqueta (`text-sm font-extrabold text-accent-strong`), que R2.3 no cambia: pasa a «Deben seguir verdes» | — |
| K4 | `T` › `#173 R4: Perfil pide la variante avatars` › `pasa avatars al selector compartido cuando carga la mascota` | `variant` `'avatars'` | `variant` `'glass'` y `trailing` `undefined` | R2 |
| K5 | `T` › `R2: estructura Figma` › `uses the canvas artboard metrics (#173 R17) and content-sized skeletons while loading` | `contentContainerStyle` `{ padding: 20, gap: 14, paddingTop: 52, paddingBottom: 120 }` y `profile-hero-skeleton` visible | `{ gap: 14, paddingBottom: 120 }` y `pet-hero-skeleton` visible | R1 |
| K6 | `T` › `R2: estructura Figma` › `renders the active pet hero, switcher, pills and information rows` | `profile-pet-avatar` visible | `pet-hero-media` visible | R1 |
| K7 | `T` › `R7: cambiar foto` › `keeps the old photo and shows an error when upload fails` | `profile-pet-avatar` `.props.source` | `pet-hero-media` `.props.source` (mismo valor) | R1 |
| K8 | `T` › `#184 R2: handleChangePhoto ignora toques…` › el `it.each` que espera la foto nueva | `profile-pet-avatar` `.props.source` | `pet-hero-media` `.props.source` | R1 |
| K9 | `T` › `#99 R3: Perfil avisa…` › `con el permiso bloqueado pinta el aviso justo debajo de la cabecera, con su copy y su acción` | `header = getByTestId('profile-add-pet').parent`, `content = header.parent` y `content.parent?.props.testID` = `'screen-profile'`; fila en 0 y aviso en 1; className `rounded-card border border-border bg-surface p-4 shadow-sm items-start gap-3`; texto `font-normal text-foreground` | **paso 1** (rojo de R1+R4): solo cambia la paternidad, `content.props.testID` = `'profile-content'` (R1.3 mete la fila de título en `profile-content`, que es hijo del `ScrollView`); fila en 0, aviso en 1 y clases sin cambios. **Paso 2** (rojo de R2+R5): `profile-entrance-notice` es el hijo 0 de `profile-content` y su único hijo es el aviso; className `items-start gap-3 rounded-card p-3.5 bg-category-amber`; texto `text-sm leading-note font-normal text-foreground` | R1, R5 |
| K10 | `T` › `const PROFILE_BRANCHES_168` (tabla compartida) | `branch: 'profile-hero-skeleton'` en dos filas | `branch: 'pet-hero-skeleton'`, más la columna `hero` de R1 | R1 |
| K11 | `T` › `#168 R1: Perfil pinta el título grande…` › `pinta el título grande ($name)` (6 filas) | className `text-3xl font-black tracking-tight text-foreground` (#197: → `tracking-title`) | por fila: con hero `text-3xl font-black tracking-title text-accent-foreground`, sin hero `text-3xl font-black tracking-title text-foreground`; las aserciones de paternidad no cambian | R2 |
| K12 | `T` › `#168 R4 (enmendado por #173 R6): profile-pet-card es la Card hero…` › `ordena la tarjeta en avatar, nombre y chips` | hijos `['profile-pet-avatar-ring', 'profile-pet-name', 'profile-pet-chips']`; nombre `text-26 font-black text-foreground` | hijos `['profile-pet-name', 'profile-pet-chips']`; nombre `text-3xl font-black leading-8.5 tracking-display text-foreground`; `profile-pet-card` con `min-w-0 flex-1 gap-2.5 px-1` | R1 |
| K13 | `T` › `#168 R4` › `con foto pinta el avatar circular de 96 con su cacheKey` | `profile-pet-avatar`: `.props.source` `[{ uri: 'http://example.test/luna.jpg', cacheKey: 'pet-1' }]` y `.props.style` `{ width: 96, height: 96, borderRadius: 48 }` | `pet-hero-media`: `.props.source` `[{ uri: 'http://example.test/luna.jpg', cacheKey: 'pet-1' }]` (mismo valor) y `.props.style` `{ width: '100%', height: 430 }` (`PetAvatar` con `size` objeto pinta `{ width: size.width, height: size.height }`) | R1 |
| K14 | `T` › `#168 R4` › `sin foto pinta el blobatar de 96 sin source` | `profile-pet-avatar`: `source` `undefined`, `.props.width` 96 y `.props.height` 96 | `pet-hero-media`: `source` `undefined`, `.props.width` `'100%'` y `.props.height` 430 (el `SvgXml` recibe `size.width` y `size.height`) | R1 |
| K15 | `T` › `#168 R4` › `superpone la cámara en el anillo con su tamaño, tinta y objetivo táctil` | dentro de `profile-pet-avatar-ring`; className `absolute -bottom-0.5 -right-0.5 size-8.5 … border-surface-secondary bg-accent`; icono 16 | dentro de `profile-change-photo-pop` (hijo de `profile-hero`); className de R4.1; `style` = `useChunkyLip().primary`; icono 18 con `strokeWidth` 2.4 | R4 |
| K16 | `T` › `#168 R4` › `con la subida fallida deja photo-upload-error inmediatamente tras la entrada del hero` | hermano siguiente de `profile-entrance-hero` | hermano inmediatamente anterior de `profile-entrance-info` en `profile-content` | R4 |
| K17 | `T` › `#168 R4` › `no monta el hero compartido` | `queryByTestId('pet-hero')` nulo | `getByTestId('pet-hero')` dentro de `profile-hero` (el título del `it` pasa a `monta el hero compartido a sangre`) | R1 |
| K18 | `T` › `#168 R4` › `reserva h-52 mientras carga el detalle` | `profile-hero-skeleton` con `h-52 w-full rounded-hero` | `pet-hero-skeleton` dentro de `profile-hero` | R1 |
| K19 | `T` › `#168 R5 (enmendado por #173 R7)` › `centra y agrupa los chips con gap-1.5` | `flex-row flex-wrap justify-center gap-1.5` | `flex-row flex-wrap gap-1.5` | R1 |
| K20 | `T` › `#173 R12: entrada escalonada` › `con mascota envuelve cuatro bloques con índices fijos` | `{'profile-entrance-hero': 0, 'profile-entrance-info': 1, 'profile-entrance-links': 2, 'profile-entrance-account': 3}` y los pares `hero` → `profile-pet-card`, `info` → `pet-info-card`, `links` → `profile-links`, `account` → `me-card` | **paso 1** (rojo de R1+R4): fuera `'profile-entrance-hero': 0` y su par; quedan `{info: 1, links: 2, account: 3}` con sus tres pares. **Paso 2** (rojo de R6): se añaden `'profile-entrance-sign-out': 4` y el par `profile-entrance-sign-out` → `profile-sign-out` | R1, R6 |
| K21 | `T` › `#173 R12` › `sin mascota conserva los índices 2 y 3 para links y cuenta` | `{'profile-entrance-links': 2, 'profile-entrance-account': 3}`, `profile-entrance-hero` y `profile-entrance-info` nulos, y los dos pares | se añaden `'profile-entrance-sign-out': 4` y el par `profile-entrance-sign-out` → `profile-sign-out`; los nulos no cambian | R6 |
| K22 | `T` › `#181 R1: profile sin mascotas…` › `%s: conserva el vacío sin tarjeta ni reintento` (S1–S3) y `S5: lista vacía revalidando y detalle pendiente no muestran esqueletos` | `queryByTestId('profile-hero-skeleton')` nulo (se volvería tautológico: el testID desaparece) | `queryByTestId('profile-hero')` y `queryByTestId('pet-hero-skeleton')` nulos | R1 |
| K23 | `T` › `#181 R5` › `R5.2 R5.3: centra en horizontal dentro del scroll y mantiene las acciones de cuenta` | lista de ausentes con `profile-hero-skeleton` | la misma lista con `pet-hero-skeleton` y `profile-hero` | R1 |
| K24 | `T` › `#184 R4: cerrar sesión conserva su botón danger-soft` › `#184 R4: conserva la variante y las clases` | `… button__root--size-md rounded-xl bg-danger-soft` | `pressable-feedback__root button__root button__root--variant-danger-soft button__root--size-md h-13 rounded-14 bg-category-rose` | R6 |
| K25 | `src/__tests__/tab-headers-canvas.test.ts` › `#168 R12: alcance cerrado` › `conserva PetHeroHeader solo en Inicio` | `['screens/home/index.tsx']` | se sustituye por `#196 R11: PetHeroHeader solo en Inicio y Perfil` con `['screens/home/index.tsx', 'screens/profile/index.tsx']` | R11 |
| K26 | `src/__tests__/profile-canvas-fidelity.test.ts` › `limita la variante nueva al consumidor Perfil` | `filesMatching(/variant="avatars"/)` = `['screens/profile/index.tsx']` | `[]` | R2 |
| K27 | `profile-canvas-fidelity` › `reserva rounded-hero al Card compartido y el skeleton de Perfil` | `['components/card.tsx', 'screens/alert-detail/index.tsx', 'screens/profile/index.tsx']` | `['components/card.tsx', 'screens/alert-detail/index.tsx']` | R1 |
| K28 | `profile-canvas-fidelity` › `reserva text-26 al nombre de la mascota en Perfil (…)` | lista con `'screens/profile/index.tsx'` (#197: + `components/screen-header.tsx`) | la misma lista sin `'screens/profile/index.tsx'` | R1 |
| K29 | `profile-canvas-fidelity` › `Perfil y el detalle de alerta son los consumidores de Card hero (…)` | `['screens/alert-detail/index.tsx', 'screens/profile/index.tsx']` y `profile.match(/variant="hero"/g)` de longitud 1 | `['screens/alert-detail/index.tsx']` y `profile.match(/variant="hero"/g)` nulo | R1 |
| K30 | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` › `const consumers` (usada por `#177 R7.4: solo la definición y los diecisiete consumidores usan el hook`, y por los `it` de `R12.1`/`R12.2`/`R12.3` que la recorren) | `[...ctaFiles, 'screens/reminders/index.tsx']` (#197 R10: + alerts y meal-schedule) | añade `'screens/profile/index.tsx'`; Perfil declara una vez `const chunkyLip = useChunkyLip();` | R4 |
| K31 | `chunky-cta-canvas-fidelity` › `#177 R7.5: inventario de los tres estilos y el tile (…)` | primera y cuarta aserción sin Perfil | **paso 1** (rojo de R1+R4): las dos añaden `'screens/profile/index.tsx': 1` (cámara). **Paso 2** (rojo de R2+R5): pasa a `'screens/profile/index.tsx': 2` (más «Abrir configuración») | R4, R5 |
| K32 | `chunky-cta-canvas-fidelity` › `#177 R8.1: solo la tabla recibe chunkyLip.%s (…)`, fila `primary` | `primaryIds` | `[...primaryIds, 'notifications-open-settings'].sort()` (la cámara es `Pressable`, no `Button`, y no entra en `buttons`) | R5 |
| K33 | `chunky-cta-canvas-fidelity` › `#177 R6.2: recuentos de etiquetas (…)` | recuentos de hoy | `<Button\.Label` baja 1 y `Button\.Label` baja 2 (se va la etiqueta de «Cerrar sesión», apertura y cierre) | R6 |
| K34 | `src/__tests__/alerts-canvas-fidelity.test.ts` › `#174 R12: inventarios`, fila `token: 'text-15'` | `files` sin Perfil | añade `'screens/profile/index.tsx'` en su sitio ordenado | R6 |
| K35 | `src/__tests__/canvas-foundations.test.ts` (#197: ausente → presente) › `describe('#197 R20: cimientos sin cablear')`, con sus dos `it`: `#197 R20: nadie monta todavía los cimientos %s` (`it.each` de `toggle-switch`, `screen-header`, `shadows`, `rise-in`) y `#197 R20: el layout raíz no cambia` | ningún fichero importa los cuatro cimientos y `src/app/_layout.tsx` sigue igual | **regla uniforme de la ola 2**: el `describe` entero se borra, con los dos `it`, sin sufijo y sin sustituto. Va en el rojo del primer R de #196 que monta un cimiento o toca `src/app/_layout.tsx`: R7 (`ToggleSwitch`; `useChunkyLip` vive en `src/theme/chunky-lip.ts`, que no es cimiento de R20, y #196 no monta `ScreenHeader`, `useShadows` ni `RiseIn` ni toca el layout). Si otra feature de la ola 2 ya lo borró al mergear, K35 queda sin efecto y se anota en el informe | R7 |
| K36 | `T` › tipos de `mockPetSwitcher` y del doble de `PetSwitcher` (las dos declaraciones de K1) | sin `trailing` | las dos añaden `trailing?: ReactNode` (`ReactNode` ya se importa de `react` en `T`); `grep -cF 'trailing?: ReactNode' T` 0 → 2. No es un `it` | R2 |
| K37 | `T` › cabecera `jest.mock('reicon-react-native')`, función `MockIcon` | `MockIcon({ color, size })` descarta `strokeWidth`; el `View` del doble solo recibe `size` | `MockIcon` acepta además `strokeWidth?: number` y lo reenvía al `View` como prop, igual que `size`, para que R4.1, R2.3 y R8 lean `props.strokeWidth` del glifo. `grep -cF 'function MockIcon({ color, size }: { color?: string; size?: number })' T` 1 → 0. Va en el rojo de R1+R4 (la cámara es la primera lectura). No es un `it` | R4 |
| K38 | `T` › cabecera: doble de `react-native-reanimated` (hoy no hay: `grep -cF "jest.mock('react-native-reanimated'" T` = 0) | `pet-hero-photo` (opacidad 0 con mascota), `pet-hero-slot`, `pet-hero-caption` y `BubblePop` arrancan en opacidad 0 | doble con las funciones del de `src/components/__tests__/pet-hero-header.test.tsx` (el bloque que contiene `withSequence: jest.fn((...steps: unknown[]) => steps.at(-1))`): `useReducedMotion` vía `mockUseReducedMotion = jest.fn<boolean, []>(() => false)`, `withTiming` identidad sobre el valor, `withDelay` que devuelve la animación, `withSequence` que devuelve el último paso, `withRepeat` que devuelve la animación y `cancelAnimation: jest.fn()`; **con la forma de módulo** del de `src/screens/home/index.test.tsx` (`...actual` y `__esModule: true,`, sin sobrescribir `default`): `BubblePop` usa `Animated.View` del import por defecto (D15). `grep -cF "jest.mock('react-native-reanimated'" T` 0 → 1. Va en el rojo de R1+R4. No es un `it` | R1 |
| K39 | `src/app/(tabs)/__tests__/screens.test.tsx` › cabecera (sin doble de reanimated hoy) | `R5: placeholders de tabs` › `renders the $title placeholder`, fila Perfil: `getByText('Perfil')` visible con `listPets` pendiente, fuera de cualquier animación | el mismo doble que K38, en la cabecera de ese fichero: con la lista pendiente `showHero` es verdadero y el título vive en `pet-hero-slot`, que arranca en opacidad 0. El `it` no cambia ni lleva sufijo. `grep -cF "jest.mock('react-native-reanimated'" 'src/app/(tabs)/__tests__/screens.test.tsx'` 0 → 1. Va en el rojo de R2+R5 | R2 |
| K40 | `src/__tests__/heroui-text-size-merge.test.ts` › `#187 R1: el escáner cubre al menos el universo medido (enmendado por #177 R9) (enmendado por #189 R5, R10, R13)` | `cardElements` total `toBeGreaterThanOrEqual(41)` con el comentario `// #188 R18: 42 - 1 (el banner de vinculación deja de ser Card)` (medido: 41, sin margen) | `toBeGreaterThanOrEqual(39)` con el comentario `// #196 R1, R5: 41 - 2 (la tarjeta hero y el aviso de Perfil dejan de ser Card)`; el título del `it` añade ` (enmendado por #196 R1, R5)`. Los otros pisos aguantan: `heroElements` 211 → 208 (piso 197) y `classNameElements` 169 → 167 (piso 163). `grep -cF 'toBeGreaterThanOrEqual(41)'` 1 → 0 y `grep -cF 'toBeGreaterThanOrEqual(39)'` 0 → 1. Va en el rojo de R1+R4 (`<Card` en `P`: 5 → 4 tras R1+R4, → 3 tras R2+R5) | R1, R5 |
| K41 | `src/__tests__/hero-header-amendments.test.ts` › `#168 R11: las specs enmendadas por #168 llevan su bloque` › `aplica además el marcador en prosa que la tabla R11.2 prescribe`, fila 4 de `AMENDED_DOCS_168` (`file: 'docs/ui-guidelines.md'`) | `marker` = la prosa `**Regla N1 (enmienda B4 de #168)**: Salud, Nutrición y Perfil abren con el título grande; Inicio es la única pestaña con PetHeroHeader. Devolver el hero a una de las tres es una enmienda a #168.` | `marker` = el texto exacto de design.md §Texto de la Enmienda #196, de `**Regla N1 (enmienda #196)**:` a `es una enmienda a #196.`; `file`, `feature` y `change` no cambian, y el título del `it` añade ` (enmendado por #196 R11)`. Opción elegida de la auditoría F5: reescribir la fila con el texto de #196 (la prosa B4 desaparece de la carta, así que no se conserva). `grep -cF '**Regla N1 (enmienda B4 de #168)**'` 1 → 0 y `grep -cF '**Regla N1 (enmienda #196)**'` 0 → 1 en ese fichero. Va en el **verde** de R11, junto con la edición de la carta y solo con la casilla de la Enmienda #196 marcada | R11 |

**Deben seguir verdes sin tocarlos** (si alguno se pone rojo, es parada):
`#173 R11` › `expone el Switch…` y `usa las recetas y el orden de las dos filas de ajustes`
(`ToggleSwitch` pone `theme-toggle` en la raíz `Switch`, con las mismas props);
`R4: toggle persiste` (los tres `it`); `#99 R3` › los otros cuatro `it`;
`#168 R6` › el `it.each` de tiles (no mira `strokeWidth`); `#173 R15` ›
`screens/profile/index.tsx no tiene escapes de estilo` (lee el fuente entero
de `P`, comentarios incluidos, y veta `/#[0-9a-fA-F]{3,8}\b/` sin la exención
`#NNN R<n>`: ningún comentario `#196 R<n>` ni otro `#NNN` en `P`, R1.5);
`#173 R5` › `pinta Add pet en inglés con la misma receta` (antes K3);
`tab-headers-canvas` › `#168 R1` (el literal del título claro sigue
apareciendo una vez en Perfil) y `veta hex solo en las tres pantallas de
producción`; `legibility-classnames` › `#61 R4` (Perfil conserva sus **tres**
`text-accent-strong`: `1 + 1 - 1 + 1 + 1`); `R3: reminders-link y sign out` ›
`keeps sign out…`; `hero-header-amendments` › `#168 R11` › los otros dos `it`
del `describe` (el bloque `## Enmienda #168` y su firma no se tocan);
`src/components/__tests__/pet-hero-header.test.tsx`,
`pet-hero-header-motion.test.tsx` y `home-photo-hero-canvas.test.ts` › todos
los `it` previos (ninguno pasa `caption`); `src/app/(tabs)/__tests__/profile.test.tsx`
› `R2: route Profile delgada` › `only delegates rendering to the screen body`;
`src/app/(tabs)/__tests__/screens.test.tsx` › `R5: placeholders de tabs`
(con K39) y `R6: profile permite cerrar sesión`;
`src/components/__tests__/pet-switcher.test.tsx` › `#173 R4: variante avatars`
(D6: la variante se conserva); `src/screens/health/index.test.tsx` entero (no
se toca Salud).

**Regla de parada**: cualquier rojo fuera de esta tabla, o un `it` de la tabla
que se ponga rojo por otra aserción distinta de la descrita, para la
implementación y se reporta.

**Enmienda mecánica permitida**: si un `it` no inventariado se pone rojo solo porque compara contra el literal exacto que el R-id quita o sustituye (directo o vía constante/helper del test), el implementador lo enmienda en el commit rojo de ese R con el sufijo y lo apunta en la tabla «Enmiendas mecánicas» de su informe. Cualquier otro rojo no inventariado sigue siendo motivo de parada.

## Erratas del leader (2026-10-24)

Firmadas por delegación (mandato del humano del 2026-10-23, `progress/plan_canvas-parity-2026-10-23.md` §4).

**E1 (BLOQUEO del handoff para el bloque R2+R5), firmada.** DD `src/__tests__/design-drift.test.ts` › `#178 R13: Recordatorios sin deriva` › `reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto (enmendado por #177 R10)`. R5.2 (CTA `h-11 rounded-14`) y R6.1 (`h-13 rounded-14`) meten `rounded-14` en Perfil; en H0 hay 0. La lista de `outsideReminders(/\brounded-14\b/)` gana `join('screens', 'profile', 'index.tsx'), // #196 R5` tras la línea de `pairing`, y el título gana el sufijo ` (enmendado por #196 R5)`. Va en el rojo de R2+R5. Si otra feature ya ha añadido su sufijo a ese título cuando lo leas, añade el tuyo detrás.

**E1.2.** T › `#65 R14` › `shows the current endonym and changes the live Profile copy` comprueba con `toBeVisible()` el título «Perfil» mientras `listPets` sigue pendiente. Si se pone rojo solo porque ese título vive ahora en `pet-hero-slot`, que arranca con opacidad 0, cambia en ese `it` el matcher del título de `toBeVisible()` a `toBeOnTheScreen()`. El título gana el sufijo ` (enmendado por #196 R2)` y el cambio va en el rojo de R2+R5. Si la causa es otra, PARA.

**E2 (K40 tras #200), firmada.** #200 (PR #244) movió el piso de `cardElements` de `src/__tests__/heroui-text-size-merge.test.ts` › `#187 R1: el escáner cubre al menos el universo medido …`: en H0 `15e321c2` la aserción es `toBeGreaterThanOrEqual(35); // #188 R18: 42 - 1 (el banner de vinculación deja de ser Card); #200 R3: -1; #200 R5: -1; #200 R7: -1; #200 R8: -1; #200 R9: -2` y el título ya termina en ` (enmendado por #200 R3, R5, R7, R8, R9)`. K40 deja de ser `41 → 39` y pasa a `toBeGreaterThanOrEqual(33)`, con el comentario ampliado por `; #196 R1, R5: -2 (la tarjeta hero y el aviso de Perfil dejan de ser Card)` y el título con ` (enmendado por #196 R1, R5)` detrás del de #200. El delta es el mismo (`<Card` en Perfil: 5 → 3). Anclas: `toBeGreaterThanOrEqual(35)` 1 → 0 y `toBeGreaterThanOrEqual(33)` 0 → 1; las de `(41)` y `(39)` quedan en 0 de principio a fin. Va en el rojo de R1+R4. Los pisos de `heroElements` y `classNameElements` no cambian por esta errata.

**E3 (K26 tras #200), firmada.** `src/__tests__/profile-canvas-fidelity.test.ts` › `limita la variante nueva al consumidor Perfil (enmendado por #200 R2)`: en H0 `filesMatching(/variant="avatars"/)` es `['screens/food/index.tsx', 'screens/profile/index.tsx']` (Nutrición la consume desde #200 R2). K26 pasa a `['screens/food/index.tsx']`, no a `[]`, y el título gana ` (enmendado por #196 R2)` detrás del de #200. Va en el rojo de R2+R5. D6 no cambia.

**E4 (K27 tras #200), firmada.** `src/__tests__/profile-canvas-fidelity.test.ts` › `reserva rounded-hero al Card compartido y el skeleton de Perfil (enmendado por #200 R3)`: en H0 la lista es `['components/card.tsx', 'screens/alert-detail/index.tsx', 'screens/food/index.tsx', 'screens/profile/index.tsx']`. K27 pasa a `['components/card.tsx', 'screens/alert-detail/index.tsx', 'screens/food/index.tsx']` y el título gana ` (enmendado por #196 R1)` detrás del de #200. Va en el rojo de R1+R4.

**E5 (K35 tras #200).** #200 borró el `describe('#197 R20: cimientos sin cablear')` de `canvas-foundations.test.ts`: K35 no tiene efecto, se anota en el reporte y ese fichero no se toca.

**E6 (D15 y el grupo `toBeVisible`, parada del verde R1+R4), firmada.** La premisa de D15 es falsa. En jest, Reanimated 4.5.1 fija la `props.style` del host en el primer render (`PropsFilter`, `_isFirstRender`), y después solo se actualiza `jestAnimatedStyle`. Así, un nodo cuya opacidad animada nace en 0 sigue con `opacity: 0` para `toBeVisible` aunque haya doble. Medido en la copia del diagnóstico, con el doble K38 activo: `profile-change-photo-pop` queda con `style={"opacity":0,…}` y `jestAnimatedStyle={"opacity":1,…}`, y lo mismo `pet-hero-caption`. El doble K38 **se queda tal cual** (`() => false`): el `it` `R2: el toggle dispara el fade vía withThemeTransition` necesita `false`. Lo que cambia es el matcher de los nodos que tapan `BubblePop` y el caption del hero. En T pasan de `toBeVisible()` a `toBeOnTheScreen()` estas 9 líneas:
- K6, `renders the active pet hero, switcher, pills and information rows`: las 4 píldoras `getByText('Hembra')`, `'Esterilizado'`, `'30 meses'` y `'12 kg'`, y `getByTestId('change-photo')`. `pet-chip-pet-1`, `985141004123456` y `Vinculado` siguen con `toBeVisible()`.
- La espera `await waitFor(() => expect(screen.getByTestId('change-photo')).toBeVisible());` pasa a `…toBeOnTheScreen());` en 4 `it`: R7 `does not request a URL when the picker is cancelled`, R7 `requests, uploads raw bytes, and refetches the active pet`, K7 `keeps the old photo and shows an error when upload fails` y K16 `con la subida fallida deja photo-upload-error inmediatamente tras la entrada del hero`.

Títulos: los dos de R7 ganan ` (enmendado por #196 R4)`. En K6 y K7 el paréntesis ` (enmendado por #196 R1)` pasa a ` (enmendado por #196 R1, R4)`. K16 ya lleva `R4` y no cambia. Anclas en T: `grep -cF "getByTestId('change-photo')).toBeVisible()"` 5 → 0 y `grep -cF "getByTestId('change-photo')).toBeOnTheScreen()"` 0 → 5. La visibilidad del caption y del slot ya la cubre `pet-hero-header.test.tsx` con reduce motion activado.

**E7 (filas de R1: hijos del `ScrollView`), firmada.** El host de `ScrollView` es `RCTScrollView`, y entre él y los hijos hay un `View` sin testID: el content container. En el `it.each` `#196 R1: en la rama $name monta el hero = $hero`, tras `const scroll = screen.getByTestId('screen-profile');` se añade `const scrollContent = profileChild(scroll, 0);`. Las dos aserciones de posición pasan de `scroll` a `scrollContent`: `expect(profileChild(scrollContent, scrollContent.children.length - 1)).toBe(content);` y `expect(profileChild(scrollContent, 0)).toBe(header);`. `scroll.props.contentContainerStyle` se sigue leyendo en `scroll`. Precedente: `src/screens/alert-detail/index.test.tsx` (`const scrollContent = elementChild(…, 0);`). Ancla en T: `grep -cF "const scrollContent = profileChild(scroll, 0);"` 0 → 1. El título no cambia.

**E8 (R4: `props.disabled` de la cámara), firmada.** `Pressable` consume `disabled` y lo funde en `accessibilityState`, así que nunca llega al host como prop. En el `it` `#196 R4: con el detalle cargado monta la cámara con labio sobre la foto` se borra `expect(camera.props.disabled).toBe(false);`, y se queda `expect(camera.props.accessibilityState).toEqual({ disabled: false });`. Ancla en T: `grep -cF "camera.props.disabled"` 1 → 0. Límite conocido: el test ya no distingue la prop `disabled` de `accessibilityState.disabled`. R4.1 sigue pidiendo `disabled` en producción, y lo comprueba el reviewer leyendo el fuente.

**E9 (K39: valor por defecto `true`), firmada.** K39 deja de ser «el mismo doble que K38». En `src/app/(tabs)/__tests__/screens.test.tsx` el bloque es idéntico al de K38 salvo la primera línea, que queda `const mockUseReducedMotion = jest.fn<boolean, []>(() => true);`. Va en la cabecera, entre el `jest.mock('react-native-safe-area-context', …)` y `const mockUseAuth`. Por qué `true`: con `false`, tras R2 el título vive en `pet-hero-slot` y nace con opacidad 0 (E6), y el `toBeVisible()` del `it` cae. Medido con R2 simulado: con `false` da `1 failed, 1 passed`, y con `true` da `2 passed`. Reduce motion es una rama real de producción. El fichero no tiene ningún `it` de tema ni de animación, y `jest.clearAllMocks()` no borra la implementación. El ancla `grep -cF "jest.mock('react-native-reanimated'"` sigue en 0 → 1. Va en el rojo de R2+R5. El `it` no cambia ni lleva sufijo.

**E10 (E1.2 ampliada), firmada.** En `#65 R14` › `shows the current endonym and changes the live Profile copy` el título en inglés también vive en `pet-hero-slot`. Por eso E1.2 cambia **las dos** aserciones del título de `toBeVisible()` a `toBeOnTheScreen()`: `expect(screen.getByText('Perfil'))` y la espera `await waitFor(() => expect(screen.getByText('Profile'))…)`. Con R2 simulado y solo la primera cambiada, el `it` siguió rojo en la segunda. El resto de E1.2 no cambia: sufijo ` (enmendado por #196 R2)` y rojo de R2+R5.

Las erratas E6 a E10 sustituyen, para los `it` que nombran, la frase de §Aprobación «si un `it` previo se pone rojo con él, es parada». Cualquier otro rojo causado por el doble sigue siendo parada. Medido en la copia del diagnóstico, con el parche tentativo de producción de R1+R4 y E6 a E8: T da `Tests: 166 passed, 166 total`, y los otros 21 ficheros relacionados, corridos uno a uno, salen verdes.

**Regla de recuentos agregados.** Si al llegar a verde una R se pone rojo un `it` que no está en el inventario y ese `it` solo cuenta usos o ficheros de un literal o token, Codex lo enmienda sin parar. Son de este tipo los inventarios cerrados de radios, de `style={CONTINUOUS_CORNER}`, de `text-NN` o de `<Card`, las sumas de copy y los suelos del escáner HeroUI. La condición es que el delta medido sea exactamente el número de usos que el diff de esa R, tal como esta spec la prescribe, añade o retira. La enmienda:

- da a la cifra o a la entrada su término (`// #196 Rn`, o `; #196 Rn: ±k` dentro de un comentario que ya exista);
- da al título el sufijo ` (enmendado por #196 Rn)`, o añade `Rn` al paréntesis de #196 si ya existe;
- va en el commit rojo de esa R; si ese rojo ya está commiteado, en un commit propio `test(#196): Rn amend the <candado> inventory` antes del siguiente R;
- se apunta en la tabla «Enmiendas mecánicas» del reporte con candado, antes, después y R.

El fichero de test de ese candado entra en la lista cerrada solo para esa enmienda. Sigue siendo PARADA si el delta no coincide, si el `it` afirma comportamiento o estructura y no un recuento, o si la enmienda exigiría cambiar producción.

## Desviaciones conscientes del canvas

| # | Canvas | Producción | Por qué |
|---|---|---|---|
| V1 | Píldora y avatares con `background: var(--glass)` y `backdrop-filter: blur(12px)` | `bg-glass-surface-strong` (`rgba(255,255,255,0.86)`, el mismo `--glass`) sin desenfoque | RN no tiene `backdrop-filter` sin dependencia nueva (`expo-blur` no está autorizado para esta feature). Supuesto S1. |
| V2 | Etiqueta de «Añadir mascota» con `color: var(--accent-strong)` sobre el vidrio | `text-accent-strong` | Ninguna; se anota porque la guarda `#61 R4` cuenta esa clase. |
| V3 | Cámara con `pop 400ms ease-out 300ms` | `BubblePop` con `MOTION_HERO_BUBBLE_POP_DELAY_MS` = 450 | D2: no se toca el fichero de Inicio. |
| V4 | Bloques con `rise` a 40/80/140/200/260 ms | `HomeEntrance` con paso 60 (0/60/120/180/240 ms) | D7 y D13. |
| V5 | «Usar tema oscuro» con `<input type="checkbox">` de 20 px | `ToggleSwitch` de 48×28 de #197 | D8. |
| V6 | Aviso con `role="status"` y `aria-label="Notificaciones desactivadas"` | `View` sin rol nuevo | D9. |
| V7 | Las filas de información del canvas (`padding: 11px 0; font-size: 14px`) y la tarjeta de cuenta | sin cambios: ya las fijaron `#173 R8` y `#168 R7` | El canvas no las cambia respecto a lo que hay. |
| V8 | Barra de pestañas dibujada en los tres artboards | no se toca | Es de #206. |

## Fuera de alcance

- La barra de pestañas (`aria-label="Pestañas"` en los artboards): #206.
- Las pantallas de Inicio (#198), Salud y Peso (#199) y Mapa (#201), y
  `src/screens/home/bubble-pop.tsx`, que solo se consume.
- Borrar la variante `avatars` de `PetSwitcher` (D6) y cualquier otro cambio en
  `components/pet-switcher.tsx`, `components/card.tsx`, `components/empty-state.tsx`
  (lo amplía #198), `components/button`, `ScreenHeader` y `global.css`.
- `RiseIn` de #197 R24 (D13) y la entrada `pop` con 300 ms exactos (V3).
- Desenfoque real del vidrio (V1): pediría `expo-blur`.
- Claves i18n nuevas o cambios de copy: no hay ninguno.
- **Deuda que roza**: ninguna. La entrada de #196 en `feature_list.json` no
  cita deuda, y la reescritura de tests no cubre ninguna deuda registrada.

## Cierre del humano

Smoke en **dev build Android** en el PC del humano (no Expo Go, no la VPS),
con el tema claro y el oscuro, tras el verde del reviewer. Cubre lo que los
tests no ven (design.md §Supuestos):

1. **R1/R2**: Perfil abre con la foto a sangre de 430, sin hueco arriba; el
   título «Perfil» blanco se lee sobre la foto gracias al scrim superior, y la
   píldora y el selector de vidrio se distinguen (S1, S4).
2. **R3**: nombre y chips quedan al pie, sobre el degradado, legibles en los
   dos temas; con nombres largos los chips bajan de línea sin salirse.
3. **R4**: la cámara aparece con el `pop` tras la foto, su labio se ve bajo el
   círculo (S2), y abrir el selector de imágenes desde ella funciona.
4. **R5**: con las notificaciones bloqueadas en ajustes del sistema, el aviso
   ámbar sale arriba; «Abrir configuración» lleva a los ajustes de la app;
   el interlineado del texto es 20 px aprox. (S3).
5. **R6**: «Cerrar sesión» es la píldora rosa de 52 con texto rojo de 15 y
   cierra la sesión.
6. **R7**: el interruptor de tema cambia de tema con el fundido de hoy.
7. **R9**: con «Quitar animaciones» activado en Android, todo aparece sin
   movimiento.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-23)
  Firma delegada en el leader por mandato del humano del 2026-10-23
  (`progress/plan_canvas-parity-2026-10-23.md` §4, checklist de firma pasada).
  Aceptados los bloques R1+R4 y R2+R5 (D14), R3.2 movido a R1.4 y K9 en dos pasos. El doble de
  reanimated de K38/K39 no se ha corrido en jest: si un `it` previo se pone rojo con él, es parada.
  Anclas re-medidas tras el merge de #197 en `dev` (81cb6d6b).
- [x] Enmienda #196 aprobada por humano (regla N1 de `docs/ui-guidelines.md`, texto en `design.md` §Texto de la Enmienda #196)
  Firma delegada, mismo mandato.
- [ ] Smoke de R1, R2, R3, R4, R5, R6, R7 y R9 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
