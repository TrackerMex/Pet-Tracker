---
feature: "mobile-push-registration"
status: approved     # draft | approved
tags: [harness, spec]
---

# Diseño — [[mobile-push-registration]]

> Ver [[requirements]] para los requisitos que este diseño implementa,
> [[../../docs/architecture|architecture]] para las reglas de capas y
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI.
>
> **SDK**: Expo **57** (`expo ~57.0.14`). Toda firma de API citada aquí se leyó
> en la doc versionada `https://docs.expo.dev/versions/v57.0.0/sdk/notifications/`,
> no de memoria. Skill cargada: `expo:expo-overview`.

## Decisiones técnicas

### D1 — `expo-notifications@~57.0.19`, instalado con `bunx expo install` (R1)

Es la **única** dependencia nueva, y esta spec es lo que la autoriza. El rango
`~57.0.19` no es una elección: es el que
`node_modules/expo/bundledNativeModules.json` fija para SDK 57 y el que
`bunx expo install expo-notifications` escribirá. El `dist-tag` `sdk-57` del
registro apunta hoy a `57.0.19`, que cae dentro del rango.

`jest.transformIgnorePatterns` **no se toca**: su primera entrada ya contiene
`expo(nent)?|@expo(nent)?/.*`, que cubre `expo-notifications`. (Contraste con
`#87`, que sí tuvo que cuidar `@tanstack` porque no casaba con ningún fragmento.)

No se instala nada más. `expo-device` (`~57.0.1`) y `expo-constants`
(`~57.0.12`) ya están en `package.json` desde el scaffold y hoy no se usan en
`src/`; esta feature es su primer consumidor.

### D2 — Config estática en `app.json`, `app.config.ts` intacto (R2, R11)

El proyecto tiene config dinámica (`app.config.ts`) que hace `{...config}` sobre
`app.json` e inyecta **solo** valores del entorno (`GOOGLE_MAPS_API_KEY_ANDROID`,
`RESET_LINK_HOST`). Nada de esta feature viene del entorno, así que todo va en
`app.json` y `app.config.ts` no se modifica. Su rama que reconstruye `android`
hace spread, de modo que `permissions` sobrevive; y su early-return devuelve la
config de `app.json` tal cual. `app.config.test.ts` sigue verde porque compara
contra `appJson` mismo.

Tres entradas en `app.json`:

| Entrada | Por qué |
|---|---|
| `plugins: [..., ["expo-notifications", { "defaultChannel": "default" }]]` | El plugin escribe en el `AndroidManifest.xml` durante el prebuild. `defaultChannel` fija `com.google.firebase.messaging.default_notification_channel_id` = `"default"`, el mismo id que el hook crea en runtime (D4). Sin él, un mensaje FCM sin `channelId` —y el `ExpoPushSender` de #13 no manda ninguno— cae en el canal de respaldo de la librería |
| `android.permissions: ["POST_NOTIFICATIONS"]` | Android 13+ exige el permiso de runtime. En Expo, `android.permissions` es **aditivo** (`blockedPermissions` es el que quita), así que no desplaza nada. Se declara explícito en vez de confiar en el merge del manifest de la librería: un permiso que no está en el manifest hace que `requestPermissionsAsync` no muestre diálogo nunca, y ese fallo es silencioso |
| `extra.eas.projectId` | Lo escribe **el humano** (`eas init`, Tarea A). No lleva candado de test: su ausencia es un caso soportado (R6.4), no un fallo de suite. Si tuviera candado, CI se pondría rojo hasta que alguien creara una cuenta Expo |

### D3 — `projectId` explícito, leído de `expo-constants` (R6, R8)

`getExpoPushTokenAsync(options?)` acepta `projectId` y, si no se pasa, cae por
defecto en `Constants.expoConfig.extra.eas.projectId`. La doc v57 **recomienda
pasarlo explícito**, y hacerlo nos da gratis el guard: leemos el valor nosotros,
y si no está, el hook no hace nada en vez de dejar que la librería lance una
excepción opaca en runtime.

La lectura se estrecha a `string | undefined` en el sitio
(`Constants.expoConfig?.extra` está tipado como `Record<string, any> | null`);
no se deja escapar `any` al resto del hook.

### D4 — Canal `'default'` creado en runtime **y** declarado en el plugin (R7)

Son dos mecanismos distintos y hacen falta los dos: el plugin dice a FCM **a qué
canal** mandar los mensajes que no traen uno; `setNotificationChannelAsync` es lo
que **crea** ese canal en el dispositivo. El id `'default'` los une. La
importancia es `AndroidImportance.MAX` (enum: `MAX`, `HIGH`, `DEFAULT`, `LOW`,
`MIN`): una alerta de que la mascota salió de la zona segura es heads-up, no un
susurro en la bandeja.

### D5 — Un solo módulo importa `expo-notifications` (R6-R10, R11)

`src/hooks/use-push-registration.ts` es el **único** fichero de la app que
importa `expo-notifications`. Motivo práctico: cualquier suite que renderice un
módulo que lo importe tendría que mockearlo. Confinándolo, solo dos suites
existentes necesitan el mock (`src/app/__tests__/layout.test.tsx`, por R11) y el
resto del repo no se entera.

Por eso el `DELETE` de `signOut` **no** lee el token de `expo-notifications`: lo
recibe publicado (D6).

### D6 — `setPushToken` en el `AuthProvider`, sobre un `useRef` (R5, R8)

El `DELETE` tiene que salir **con** la sesión viva y **antes** de borrarla, así
que la orquestación vive en `signOut`, dentro del provider. Pero el provider no
puede conocer `expo-notifications` (D5). Puente mínimo: `AuthContextValue` gana

```
setPushToken: (expoToken: string | null) => void
```

El hook lo llama en cuanto obtiene el token (antes del `POST`: si el `POST`
falla, el `DELETE` posterior es un 204 inofensivo, mientras que no publicarlo
dejaría el token vivo en el servidor en el caso opuesto).

Se guarda en un `useRef`, no en `useState`: escribirlo no debe re-renderizar el
árbol entero, y `setPushToken` queda referencialmente estable con
`useCallback(…, [])`.

`signOut` pasa a `useCallback(…, [state.token])`. No es una regresión: el `value`
del contexto ya se rehace en cada cambio de `state` (`useMemo(…, [signIn, signOut, state])`),
así que la identidad de `signOut` cambiando con el token no altera nada
observable, y evita meter un segundo `ref` para el JWT.

Alternativa descartada: montar el `DELETE` en un `useEffect` de limpieza del
hook, disparado al pasar a `unauthenticated`. Ahí la sesión **ya** está borrada
cuando el efecto corre — exactamente el bug que R5 existe para prevenir.

### D7 — `deleteJson` gana un `body` opcional (R4)

`DELETE /v1/me/push-tokens` lleva body JSON (`DeletePushTokenSchema`), y
`deleteJson` no lo soporta. Se añade un quinto parámetro **opcional**; cuando no
se pasa, la petición emitida es idéntica a la de hoy, así que los dos llamadores
existentes (`devices.ts:103`, `reminders.ts:133`) no se tocan y sus suites siguen
verdes sin editarlas.

Es la corrección en el punto por el que pasan todos los llamadores. La
alternativa —un `fetch` a mano en `push-tokens.ts`— duplicaría el
`try/catch → {kind:'unreachable'}` en un sexto sitio.

### D8 — El hook no guarda estado de "ya registrado" (R8, R9)

Re-registrar en cada arranque con sesión es gratis: el backend hace
`INSERT … ON CONFLICT (expo_token) DO UPDATE` (#13 R3), conserva `id` y
`created_at`, y solo mueve `last_seen_at`. Una marca en `SecureStore` añadiría un
estado que puede desincronizarse del servidor (token borrado en otro dispositivo,
`DeviceNotRegistered` limpiado por #13 R12) y no ahorra nada.

Por la misma razón no hay backoff: el reintento **es** el siguiente arranque.

### D9 — Fallos absorbidos dentro del hook, nunca en el camino del login (R9, R11)

El componente que monta el hook devuelve `null` y es **hermano** de `<Stack />`,
no su padre: no puede retrasar ni un frame del render de la navegación. Todo el
cuerpo asíncrono va en un `try/catch` que no relanza. Resultado: un `signIn` con
la red caída entra a Home igual, y el registro se reintenta al siguiente
arranque.

No se añade bandera `mounted`: la única escritura posterior a un `await` es
`setPushToken`, que escribe un `ref` — inocua tras desmontar.

### D10 — Tap: listener + cold start, destino fijo `/alerts` (R10)

`setNotificationHandler` va a **nivel de módulo** (se ejecuta al importar), que
es donde la doc lo coloca: si viviera en un efecto, una notificación que llegue
antes del primer render no mostraría banner. Devuelve los cuatro campos de
SDK 53+ (`shouldShowBanner`, `shouldShowList`, `shouldPlaySound`,
`shouldSetBadge`); `shouldShowAlert` está obsoleto y **no** se usa.

Dos caminos, porque cubren estados distintos del proceso:

- App viva (primer plano o segundo plano): `addNotificationResponseReceivedListener`.
- App muerta y abierta **por** el tap: `getLastNotificationResponseAsync()`, que
  devuelve la última respuesta pendiente. Se consulta **una vez por sesión de
  app**, con guarda de `useRef` — sin ella, cada re-ejecución del efecto volvería
  a leer la misma respuesta y a empujar `/alerts` otra vez.

El camino de app muerta espera además a que `usePathname()` deje `/`. En `/`,
`src/app/index.tsx` todavía tiene pendiente su `<Redirect href="/home" />`; hacer
el `push` antes permite que ese `replace` posterior gane la carrera y deje Home
encima de una pila incorrecta. El efecto de registro publica mediante un `ref`
que ya pasaron las guardas de sesión/dispositivo/plataforma/proyecto, y un efecto
separado consulta la respuesta inicial cuando esa marca está activa y el redirect
ya cambió el pathname. No hay temporizador ni se modifica `index.tsx`.

Destino: `router.push('/alerts')`, literal. #78 está mergeada, la ruta existe
(`src/app/(tabs)/alerts.tsx`) y `src/screens/home/index.tsx:306` ya usa esa forma
exacta bajo `typedRoutes: true`; su test prohíbe el cast `as Href`. **No hay
condicional "si #78 existe"**: existe.

Ambos caminos se activan solo con sesión: navegar a una pestaña sin sesión
rebota por el `Redirect` de `src/app/index.tsx`.

### D11 — La forma de `push-tokens.ts` se calca de `src/api/alerts.ts` (R3, R4)

Mismo orden de parámetros (`baseUrl` primero, `fetchFn` último con default
`fetch`), misma unión discriminada por `kind`, mismo `missing-config` cuando
`baseUrl` es `undefined`, mismos helpers de `./http`. No se inventa una forma
nueva ni se toca `src/api/types.ts`: el body del 200 no se parsea (nadie lo
consume), así que no hay tipo que declarar.

## Archivos afectados

Todo bajo `mobile-pet-tracker/`. **Capa**: la app móvil no tiene el layering
domain/application/infrastructure del backend (`docs/architecture.md` §capas
aplica a `backend-pet-tracker/`); su equivalente es
`src/api/` (transporte) → `src/hooks/` + `src/providers/` (estado y efectos) →
`src/app/` (rutas) → `src/screens/` + `src/components/` (presentación). Esta
feature no llega a la capa de presentación.

### Nuevos

| Archivo | Qué es |
|---|---|
| `src/api/push-tokens.ts` | `registerPushToken` y `deletePushToken` (R3, R4). Transporte |
| `src/api/__tests__/push-tokens.test.ts` | Tests de R3 y R4 |
| `src/hooks/use-push-registration.ts` | `usePushRegistration()` — único símbolo público; único importador de `expo-notifications` (R6-R10) |
| `src/hooks/use-push-registration.test.tsx` | Tests de R6-R10. Junto al fichero, como `use-pet-selection.test.tsx` — **no** en un `__tests__/` |
| `src/hooks/use-push-registration.navigation.test.tsx` | Regresión de R10 sobre destino y pila observables cuando el redirect autenticado se compromete después de la respuesta inicial |

### Modificados

| Archivo | Qué cambia |
|---|---|
| `package.json` | `dependencies["expo-notifications"] = "~57.0.19"` (R1). Nada más: ni scripts, ni `transformIgnorePatterns` |
| `app.json` | Plugin, `android.permissions` (R2) y, **por mano humana**, `extra.eas.projectId` (Tarea A) |
| `src/api/http.ts` | `deleteJson` gana un quinto parámetro opcional `body?: unknown` (R4, D7) |
| `src/providers/auth-provider.tsx` | `setPushToken` en `AuthContextValue` + `DELETE` antes de borrar la sesión en `signOut` (R5, D6) |
| `src/app/_layout.tsx` | Componente local que llama `usePushRegistration()` y devuelve `null`, hermano de `<Stack />` dentro de `<QueryProvider>` (R11) |
| `src/__tests__/design-drift.test.ts` | Candado de la dependencia, `describe('#79 R1: …')` (R1) |
| `app.config.test.ts` | Candado del plugin y del permiso, `describe('#79 R2: …')` (R2) |
| `src/providers/__tests__/auth-provider.test.tsx` | Tests de R5, prefijados `#79 R5:` (el fichero ya tiene `R3` y `R4` de `mobile-auth`) |
| `src/app/__tests__/layout.test.tsx` | Mock de `expo-notifications` y `expo-device` + test de R11, prefijado `#79 R11:` (el fichero ya tiene `R4`, `#65 R16`, `#87 R4`) |

### Explícitamente NO tocados

`app.config.ts`, `src/i18n/catalog.ts`,
`src/providers/__tests__/language-provider.test.tsx`, `src/api/devices.ts`,
`src/api/reminders.ts`, `src/api/types.ts`, `test/jest-setup.js`, cualquier
fichero de `src/screens/` o `src/components/`, y todo `backend-pet-tracker/`.

## Alternativas descartadas

- **`fetch` a mano en `push-tokens.ts` en vez de tocar `deleteJson`** (D7):
  duplica el `try/catch → unreachable` por sexta vez y deja el bug del DELETE sin
  body vivo para el siguiente que lo necesite.
- **Hacer el `DELETE` desde el hook, reaccionando a `status === 'unauthenticated'`**
  (D6): cuando ese efecto corre, la sesión ya se borró y la petición sale sin
  bearer. Es exactamente el fallo que R5 previene.
- **Importar `expo-notifications` dentro de `auth-provider.tsx`** (D5): obligaría
  a mockearlo en toda suite que renderice `AuthProvider` — decenas de ficheros.
- **Marca de "ya registrado" en `SecureStore`** (D8): estado local que puede
  divergir del servidor, a cambio de ahorrar un upsert idempotente.
- **`getExpoPushTokenAsync()` sin `projectId`, confiando en el default de
  `expo-constants`** (D3): sin la Tarea A lanza en runtime en vez de degradar.
- **Candado de test sobre `extra.eas.projectId`** (D2): pondría CI en rojo hasta
  que un humano cree una cuenta Expo. Su ausencia es un caso soportado (R6.4).
- **Contador/badge de alertas sin leer** (`shouldSetBadge: true`): #78 §0.3 ya
  cerró que no hay número honesto por encima de 50 sin backend nuevo.
- **Navegar al detalle de la alerta con `data.alertId`**: no hay pantalla de
  detalle; #78 dejó la fila sin navegación.
- **`icon` / `color` en el config plugin**: exigen un PNG blanco 96×96 que no
  existe en `assets/`. Sin ellos Android usa el icono de la app.
- **`googleServicesFile` en `app.json`**: la credencial FCM V1 vive en EAS
  (Tarea B) y metería un JSON de servicio en el árbol.
