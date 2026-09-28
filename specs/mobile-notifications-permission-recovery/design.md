---
feature: "mobile-notifications-permission-recovery"
status: approved           # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-notifications-permission-recovery]] (#99)

> Ver [[requirements]] para los requisitos y las premisas verificadas (§0), y
> [[../../docs/architecture|architecture]] para las capas (no tiene sección
> móvil; aplica la estructura de `docs/conventions.md` §Convenciones de la app
> móvil). Anclas por contenido, nunca por número de línea. Todo lo que aquí
> dice «medido» se midió en una copia del árbol en el scratchpad con un
> borrador de la implementación: suite móvil completa `83 / 1528` sobre `b602ff6e` (`83 / 1530` sobre la base de Codex, `d7cb0d60`), exit 0;
> `tsc --noEmit` y `eslint src` exit 0.

## El defecto, de punta a punta

| Paso | Dónde | Qué pasa hoy (Android 13+) |
|---|---|---|
| 1 | primer arranque con sesión: `getPermissionsAsync()` → `{ granted: false, canAskAgain: true }` | #79 R7 lanza el diálogo; «No permitir» → `canAskAgain` sigue `true` (P7) |
| 2 | segundo arranque | #79 R7 lo lanza otra vez; «No permitir» → expo persiste `blocked` → `canAskAgain: false` |
| 3 | tercer arranque y siguientes | `granted: false, canAskAgain: false` → sin diálogo (bien) → `warnPush('skipped: notification permission denied')` y `return` |
| 4 | el usuario | no ve nada, no tiene por dónde activar las notificaciones y los push del backend no llegan porque no hay fila en `push_tokens` |

En Android 7-12 el paso 3 llega **desde el primer arranque** si las
notificaciones de la app están apagadas ([[requirements]] C1).

#99 ataca el paso 4: el hook **publica** el estado del paso 3 (R1), Perfil lo
**enseña** con una acción que lleva a los ajustes (R3), y al volver a la app el
hook **relee** el permiso y registra si quedó concedido (R2).

---

## Carta de UI (`docs/ui-guidelines.md`, gate C8)

Skills (nombres de Claude; el leader da los de Codex en el handoff):
`expo-overview` → `expo-native-ui` (estado y estilo), `expo-router` (por qué
el foco no sirve, C4) y `appllama-app-design-skill` (obligatoria en toda tarea
de UI móvil; de ella se toma el patrón, no el sistema de estilos). La carta
gana sobre las skills.

- **Grep-clean**: ningún hex, ninguna clase arbitraria, ningún
  `StyleSheet.create`. El aviso solo usa clases que ya existen en el repo
  (`items-start gap-3`, `font-normal text-foreground`).
- **Componentes compartidos**: `Card` de `src/components/card.tsx` (variante
  `surface` por defecto, `rounded-card` del token, esquina continua de serie) y
  `Button` de heroui-native. No se crea componente: un solo usuario (regla de
  extracción ≥ 2 pantallas).
- **Radios**: el `Card` trae `rounded-card`; el `Button` de heroui, su radio de
  control de serie. Ninguna clase de radio nueva.
- **Feedback de pulsado y objetivo táctil**: los trae el `Button` de heroui
  (escala animada al pulsar, altura `md`). Es el mismo botón que
  `profile-pet-retry`.
- **Tema**: tokens semánticos (`bg-surface`, `text-foreground`, el primario de
  heroui): claro y oscuro sin trabajo extra. Ningún color imperativo, así que no
  hace falta `useThemeColors`.
- **Dimensiones de pantalla, Skeleton, animación**: no aplica. El aviso entra
  en el `contentContainerStyle` que ya existe; no carga datos (el estado es
  síncrono) y aparece o desaparece sin animación, igual que `profile-pet-error`.
  Un `entering` de Reanimated para algo que se ve pocas veces y que el usuario
  acaba de provocar no pasa el filtro de frecuencia de la skill.
- **Idioma**: +2 claves en los dos idiomas, registradas en
  `specs/mobile-ui-language/design.md` §2.7 (carta §Dirección de arte 6).
- **Enmienda #70**: no aplica (no hay elemento repetido). Aun así, cada
  decisión del aviso tiene su `expect` en R3: posición en el contenedor,
  variante del `Card`, número y orden de hijos, clase y copy del texto, copy y
  rol del botón, destino de la acción, condición de render.

---

## Decisiones técnicas

### D1 — El aviso vive en Perfil, justo debajo de la cabecera (R3)

| Opción | Por qué sí / por qué no |
|---|---|
| **Perfil, segundo hijo del scroll** (elegida) | Perfil es donde el usuario ya cambia preferencias (tema, idioma); el aviso se ve sin hacer scroll; sale solo en el estado bloqueado y se va solo al arreglarlo; no se solapa con ninguna branch viva |
| Perfil, como fila más entre `documents-link` / `pairing-link` / `reminders-link` | Queda por debajo del héroe de la mascota (`h-80`) y de `pet-info-card`: fuera de pantalla justo cuando el usuario no sabe que tiene que buscarlo |
| Perfil, dentro de `me-card` (Cuenta) | Al final del scroll, mismo problema |
| Banner en la Home | La carta (§Dirección de arte 3) obliga a declarar qué pregunta de las siete responde; el aviso no responde ninguna y compite con «¿hay alguna alerta?», que ya contesta la campana. Un banner permanente en la pantalla principal es la insistencia que #79 R7 evita. Y la Home la está tocando #124 ([[requirements]] C8) |
| Centro de alertas (`/alerts`) | Es una pantalla empujada a la que se llega desde la campana; el usuario sin push tiene menos motivos para abrirla |

### D2 — El aviso sale solo con `granted: false` y `canAskAgain: false` (R1)

- Es exactamente el estado en el que #79 R7 **deja de pedir**: a partir de ahí
  la app no tiene otra vía que los ajustes, que es lo que el aviso ofrece.
- Tras la **primera** negativa en Android 13+ (`canAskAgain: true`) el
  siguiente arranque vuelve a lanzar el diálogo del sistema; enseñar además un
  aviso sería decir lo mismo dos veces.
- Se evalúa sobre el **último** estado conocido: el de la petición, si la hubo
  (fila 2 de R1: segunda negativa en este arranque → aviso en el acto).
- En Android 7-12 el mismo criterio cubre «notificaciones apagadas desde el
  primer día» ([[requirements]] C1) sin una sola línea específica de
  plataforma.

### D3 — La acción es `Linking.openSettings()` (R3)

- **Qué ve el usuario** (Android): la pantalla **«Información de la app»** del
  dev build; toca **«Notificaciones»** y activa el interruptor general. Un toque
  más que el intent directo. El texto del aviso dice «configuración del
  teléfono», que casa con lo que se abre.
- **Por qué no el intent directo**: `Linking.sendIntent('android.settings.APP_NOTIFICATION_SETTINGS', [{ key: 'android.provider.extra.APP_PACKAGE', value: <paquete> }])`
  existe en RN 0.86 sin dependencia, pero pide el paquete en JS
  (`Constants.expoConfig?.android?.package`), una rama por plataforma y un plan
  B: `IntentModule.sendIntent` rechaza si `intent.resolveActivity(...) == null`,
  y esa acción no existe por debajo de API 26 con `minSdk = "24"`. Tres
  piezas y un test más para ahorrar un toque.
- **`expo-intent-launcher`**: no está instalado ([[requirements]] P9) y haría
  lo mismo que `sendIntent`. No se añade.
- **Sin manejar el rechazo** de `openSettings()`: `void Linking.openSettings()`.
  En Android solo rechaza si no hay Activity actual, y el botón solo existe con
  la app en primer plano.

### D4 — Reevaluación con `AppState`, solo con el aviso encendido y sin pedir (R2)

- **`AppState` y no el foco de expo-router** ([[requirements]] C4): volver de
  los ajustes del sistema no cambia la navegación, y `useFocusEffect` solo
  escucha `focus`/`blur` del navegador. En Android, `'active'` sale de
  `onHostResume` (P10).
- **Solo con el aviso encendido**:
  1. El diálogo de permiso de Android es otra Activity: mientras está en
     pantalla, la app pasa por `'background'` y vuelve a `'active'` **con la
     primera evaluación aún esperando la respuesta** ([[requirements]] C7).
     Con el aviso apagado en ese momento, la condición deja fuera esa segunda
     evaluación concurrente.
  2. Con el permiso concedido no hay nada que recuperar; releerlo en cada
     vuelta a primer plano sería una llamada nativa por nada.
  3. Tras la primera negativa, el siguiente arranque ya pregunta (D2).
- **Sin pedir**: `evaluate(false)` salta `requestPermissionsAsync()` aunque la
  relectura traiga `canAskAgain: true` (fila 3 de vuelta de R2). La vuelta de
  los ajustes nunca lanza el diálogo que #79 R7 evita a propósito.
- **Una carrera inocua que el humano puede ver**: tras la segunda negativa, el
  resultado de la petición y el `'active'` del cierre del diálogo llegan a JS
  en orden no garantizado. Si llega antes el resultado, el aviso ya está
  encendido cuando llega `'active'`, y hay una relectura más (sin UI) con un
  segundo `[push] skipped: notification permission denied` en Metro. Paso 8
  del smoke.
- **Qué hace al volver concedido**: la misma secuencia de #79 R8 (token,
  `setPushToken`, `POST`), con los mismos `warnPush` y el mismo `catch` sin
  reintento (#79 R9). El aviso se apaga **en cuanto** el permiso está
  concedido, antes del token: el aviso habla del permiso, y un fallo de red lo
  cubre #79 R9/R13.

| Alternativa | Por qué no |
|---|---|
| `useFocusEffect` en Perfil | No se dispara al volver de otra app (C4) |
| Reevaluar en todo `'active'` | Evaluación concurrente con el primer diálogo (C7) y una llamada nativa por cada vuelta a primer plano |
| Reevaluar desde Perfil | Perfil puede no estar montado al volver (la app puede estar en otra pestaña), y duplicaría las guardas de #79 (Expo Go, web, sin sesión) |
| Un intervalo de sondeo | Temporizador, limpieza y batería para lo que `AppState` ya avisa |

### D5 — El estado vive en un almacén de módulo del propio hook (R1)

- **Qué**: un booleano y un `Set` de suscriptores a nivel de módulo en
  `use-push-registration.ts`, una función privada que los actualiza y
  `export function useNotificationsBlocked(): boolean` con
  `useSyncExternalStore` (React 19, sin dependencia).
- **Por qué hace falta compartirlo**: el hook corre en `PushRegistration`, en
  el layout raíz (P1), y quien pinta es `ProfileScreen`, dentro del Stack. El
  valor de retorno del hook no llega hasta allí.
- **Limpieza**: `setNotificationsBlocked(false)` en la limpieza del efecto
  (cerrar sesión, desmontar) y la guarda `active` para que una evaluación que
  termine tarde no lo encienda otra vez (R1, M3/M4). Además deja cada test del
  fichero limpio: la limpieza automática de RNTL desmonta tras cada `it`.

| Alternativa | Por qué no |
|---|---|
| Campo nuevo en `AuthContextValue` | Mezcla el permiso con la sesión; un campo obligatorio rompe los 14 `satisfies AuthContextValue` de `src/screens/profile/index.test.tsx` y los dobles de las otras suites que tipan `AuthContextValue` (23 ficheros lo nombran), y uno opcional es tipado flojo. Cada cambio re-renderiza a todos los consumidores de `useAuth` |
| Proveedor nuevo en `_layout.tsx` | Fichero, test y cableado más, y los tres tests de pila (P13) mockean el módulo del hook con `{ usePushRegistration: jest.fn() }`: un `Provider` exportado desde ahí sería `undefined` y los rompería |
| Que Perfil lea el permiso por su cuenta | Duplica las guardas de #79 (la importación perezosa de `expo-notifications` existe porque en Expo Go revienta, R15) y deja dos fuentes de verdad |

- **Techo** (§Fuera de alcance, deuda): vale para un único
  `usePushRegistration` montado. Si algún día hay dos, el último en evaluar
  gana.

### D6 — Copy (R3)

| Clave | `es` | `en` |
|---|---|---|
| `profile.notificationsBlocked` | `Las notificaciones están desactivadas. Actívalas en la configuración del teléfono para recibir alertas y recordatorios.` | `Notifications are turned off. Turn them on in your phone settings to receive alerts and reminders.` |
| `profile.openSettings` | `Abrir configuración` | `Open settings` |

- Dice **qué pasa**, **dónde se arregla** y **qué se pierde** (alertas de
  geocerca y recordatorios, los dos push que manda el backend).
- «Configuración», no «Ajustes»: es como se llama la app de ajustes de Android
  en español de México y la palabra que ya usa el catálogo
  (`'profile.gpsSettings': 'Configuración del Dispositivo GPS'`).
- Claves en inglés y en el ámbito `profile.` (carta §Dirección de arte 6: la
  clave nombra la pantalla que la usa).

### D7 — Anatomía del aviso: la de `profile-pet-error` (R3)

- `Card` (surface) con `className="items-start gap-3"`, un `Text` con
  `className="font-normal text-foreground"` y un `Button` **por defecto**
  (primario, sin `className`), igual que `profile-pet-retry`.
- **Por qué el botón por defecto y no la receta de `change-photo`**
  (`bg-accent-soft` / `text-accent-strong`): esa receta mueve dos contadores
  globales (`bg-accent-soft` 16 de `#98 R10` y `text-accent-strong` de Perfil 1
  de `#61 R4`, [[requirements]] P15) sin ganar nada. Con la anatomía elegida,
  **ningún** candado de estilo se mueve (medido).
- **`text-foreground` y no `text-muted`**: es un mensaje que pide acción, no una
  etiqueta secundaria.
- **Sin icono**: `reicon-react-native` trae `BellOff`, pero un icono pide
  tamaño, tinta vía `useThemeColors` y sus candados (carta, enmienda #70
  §Invariantes), y el texto ya lleva el significado. Si el humano lo quiere, es
  una enmienda. Sin `accessibilityRole="alert"`:
  el aviso no aparece por sorpresa (sale al entrar en Perfil) y TalkBack lee
  texto y botón en orden.

### D8 — Arnés de los tests (R1-R3)

- **Hook** (`use-push-registration.test.tsx`):
  - Los `describe` de #99 van **antes** de `describe('R15: importar el modulo no toca expo-notifications'`
    ([[requirements]] C6: su `jest.resetModules()` deja al hook con otra
    instancia de los dobles; medido, 13 rojos si se ponen detrás).
  - El estado se observa con `useRegistrationProbe()` (el hook más
    `useNotificationsBlocked()` en el mismo `renderHook`) y, cuando hay que
    desmontar el hook, con un segundo `renderHook(() => useNotificationsBlocked())`
    que sigue montado.
  - Cada aserción de estado se ancla a la **última** señal de la evaluación
    (el `POST` o el `warnPush`), y luego `flushEvaluation()`: una aserción de
    `false` inmediata pasaría antes de que la evaluación termine
    (`docs/conventions.md` §Esperas).
  - `AppState` y `Linking` son los dobles del preset (P11); el listener se
    captura con `mockImplementation` en el `beforeEach` de R2, como ya hace el
    fichero con `addNotificationResponseReceivedListener`.
- **Perfil** (`src/screens/profile/index.test.tsx`):
  - `jest.mock` del módulo del hook con `useNotificationsBlocked: jest.fn(() => false)`,
    y `afterEach` que lo devuelve a `false` (`jest.clearAllMocks()` no borra
    un `mockReturnValue`).
  - El `describe` va al final del fichero, con los dobles de API en
    `pending<…>()`: el aviso no depende de datos.
  - Posiciones con `children.indexOf(…)`: medido, un `toBe` fallido entre dos
    elementos del árbol tumba el worker de jest («4 child process exceptions»)
    en vez de dar un rojo legible.
- **Guard C8**: nada de la forma `<palabra>-[` en código de test nuevo.

### D9 — Orden y rojos (C4)

Todos los rojos son **naturales** (vía (a) de C4): o el código de hoy **es** el
defecto, o el verde anterior aún no hace lo que pide el siguiente requisito.
Ninguna mutación versionada.

| R | Producción en el commit rojo | Por qué el rojo es legítimo |
|---|---|---|
| R1 | la de `d7cb0d60` más un **esqueleto** `export function useNotificationsBlocked(): boolean { return false; }` | los tests importan un símbolo que existe; filas 1-2 y `al desmontar…` fallan por aserción, no por `TypeError` |
| R2 | el verde de R1 (publica el estado, sin `AppState`) | los tests piden una suscripción a `AppState` que no existe: fallan por `mockAddAppStateListener` sin llamar |
| R3 | el verde de R2; Perfil, catálogo y `ui-copy-table.ts` de `d7cb0d60` | el aviso no existe y el catálogo no tiene las claves; los dos candados movidos fallan por aserción. `tsc --noEmit` pasa (medido) |

---

## Archivos afectados

| Fichero | Capa | Cambio |
|---|---|---|
| `mobile-pet-tracker/src/hooks/use-push-registration.ts` | hook | almacén de módulo + `useNotificationsBlocked`; `evaluate(ask)`; publicación del bloqueo; listener de `AppState`; limpieza (D4, D5) |
| `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx` | test | helpers, `#99 R1` (7) y `#99 R2` (8), antes de `R15` |
| `mobile-pet-tracker/src/screens/profile/index.tsx` | pantalla | `useNotificationsBlocked()`, `Linking`, el `Card` del aviso (D1, D3, D7) |
| `mobile-pet-tracker/src/screens/profile/index.test.tsx` | test | `jest.mock` del hook, imports, `#99 R3` (5) al final |
| `mobile-pet-tracker/src/i18n/catalog.ts` | i18n | +2 claves en `en` y en `es` (D6) |
| `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx` | test | ` + 2` y comentario |
| `mobile-pet-tracker/src/__tests__/ui-language.test.ts` | test | `#65 R7`: `36` y `35 - 1 + 2` |
| `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` | test | dos filas en `R7_PROFILE` |
| `specs/mobile-ui-language/design.md` | spec | dos filas en §2.7 |

**No cambian**: `src/app/_layout.tsx`, `src/providers/auth-provider.tsx`,
`src/screens/home/`, `src/components/`, `src/api/push-tokens.ts`,
`src/theme/`, `app.json`, `app.config.ts`, `package.json`, `bun.lock`,
`docs/`, `backend-pet-tracker/`, `infra/`.

---

## Alternativas descartadas

- **Aviso en la Home, en `me-card`, entre los enlaces o en `/alerts`**: D1.
- **Aviso también tras la primera negativa**: D2.
- **`Linking.sendIntent` con `APP_NOTIFICATION_SETTINGS`, `expo-intent-launcher`**: D3.
- **`useFocusEffect`, reevaluar en todo `'active'`, reevaluar desde Perfil, sondeo**: D4.
- **Estado en `AuthContext`, proveedor nuevo, lectura propia de Perfil**: D5.
- **Receta de botón de `change-photo`, icono, `accessibilityRole="alert"`, animación de entrada**: D7 y §Carta de UI.
