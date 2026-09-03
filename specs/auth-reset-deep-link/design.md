---
feature: "auth-reset-deep-link"
status: approved   # draft | spec_ready | approved
tags: [harness, spec, backend, mobile, security]
---

# Diseño — [[auth-reset-deep-link]]

> Ver [[requirements]] para los requisitos que este diseño implementa,
> `docs/architecture.md` para las capas del backend y
> `docs/ui-guidelines.md` para la carta de UI móvil. Todas las decisiones de
> aquí están **cerradas**: Codex las aplica, no las reabre.

## Decisiones técnicas

### D1 — Forma de la URL: https + path fijo + token en query

```
https://<RESET_LINK_HOST>/reset-password?token=<token>
```

- **Path fijo** `PASSWORD_RESET_PATH = '/reset-password'`, exportado desde
  `backend-pet-tracker/src/modules/auth/infrastructure/email/password-reset-link.ts`
  junto a `buildPasswordResetUrl(host, token)` (normaliza slash final del
  host, `encodeURIComponent(token)`). Un solo lugar compone la URL; los dos
  adaptadores de correo la importan (R1, R2).
- **Token en query y no en el path** (`/reset-password/<token>`): con query,
  la ruta Expo es un fichero estático (`reset-password.tsx` +
  `useLocalSearchParams`), el `pathPrefix` del intent filter matchea exacto,
  y la página fallback de Hostinger es un único
  `reset-password/index.html` — un hosting estático ignora el query string.
  Con el token en el path harían falta ruta dinámica `[token].tsx` y
  reescrituras `.htaccess` en el hosting. Cero ganancia.
- El esquema es siempre `https`: es la única forma que Android verifica como
  App Link. Sirve a R1, R4, R9, R10.

### D2 — App Links https, con el scheme propio solo como fallback manual

Un enlace `mobilepettracker://` pelado en el correo está descartado: la
mayoría de clientes de correo no enlazan schemes personalizados y, sin app
instalada, el enlace está muerto. La vía es **Android App Links**:

1. El correo lleva la URL `https` de D1.
2. Con la app instalada y `assetlinks.json` verificado, Android abre la app
   directamente en `/reset-password?token=…` (R4, R5).
3. Sin app (o sin verificación), el navegador carga la página fallback de
   Hostinger (R10), que ofrece el botón «Abrir en la app» con
   `mobilepettracker://reset-password?token=…` — ahí el scheme sí sirve,
   porque es un tap explícito del usuario desde una página nuestra.

### D3 — `RESET_LINK_HOST`: una variable, dos `.env`, dominio fuera del repo

- Host pelado (`app.midominio.tld`), sin esquema ni path. Vive en
  `.env` de la raíz (la consume `auth.module.ts` vía `ConfigService` para el
  correo) y en `mobile-pet-tracker/.env` (la consume `app.config.ts` en
  build time para el intent filter). Son dos procesos distintos en dos
  máquinas distintas; compartir fichero no es posible y el nombre único
  (`RESET_LINK_HOST`) mantiene el grep trivial.
- **El dominio real no entra al repositorio**, mismo criterio que
  `RESEND_FROM` (#58 D12). Por eso el intent filter se inyecta por config
  dinámica (D9) y no se hardcodea en `app.json`.
- Sin prefijo `EXPO_PUBLIC_`: la app no necesita el host en runtime (no debe
  inlinearse en el bundle JS), solo el build lo necesita — precedente
  literal de `GOOGLE_MAPS_API_KEY_ANDROID`.
- **Fail-fast en backend** (R3): `EMAIL_ENABLED=true` sin host ⇒
  `MissingResendConfigError(['RESET_LINK_HOST'])` lanzado por el constructor
  de `ResendPasswordResetSender`. Se reutiliza la clase de error exportada
  por `resend-client.ts` — el mensaje resultante
  (`Missing Resend configuration: RESET_LINK_HOST`) es exacto y no hace
  falta un tipo nuevo. La alternativa (mandar el correo sin enlace o con
  enlace roto) es el fallback silencioso que #58 D13 ya prohibió.
- **Degradación en consola** (R2): el adaptador local recibe
  `resetLinkHost: string | null = null` por constructor (el `useFactory` ya
  tiene `ConfigService`; los adaptadores de consola siguen sin depender de
  él, como dejó #58 D3) y solo añade `resetUrl` cuando hay host. El
  `.env.example` la lleva vacía: todo sigue funcionando out-of-the-box y
  `env-drift.mjs` avisará al humano, que es el comportamiento deseado.

### D4 — El copy del correo: la URL se añade, el token no se mueve

Restricción verificada (`resend-client.ts:140`): `sanitize` extrae el
secreto a redactar como el **segundo párrafo** del `text`. Mover el token de
ahí rompería la redacción de logs de #58 R7 o exigiría tocar
`resend-client.ts`, que está fuera de la allowlist. Por tanto el copy
mantiene la estructura de #58 y **añade** la URL:

```
Tu código para restablecer la contraseña de Pet Tracker es:

<token>

O toca este enlace en tu teléfono para abrir la app y restablecerla:

<URL de D1>

Caduca el <expiresAt ISO 8601>. Si no has pedido este cambio, ignora este correo.
```

- Sigue **texto plano, sin `html`**: los clientes de correo autoenlazan URLs
  y los asserts de #58 sobre las keys del payload (`from,subject,text,to`) y
  la ausencia de `html` siguen válidos.
- El único assert de #58 que muere es
  `expect(body.text).not.toEqual(expect.stringContaining('http'))` — era la
  frontera con esta feature, se elimina en la misma línea que se implementa
  R1 (allowlist R12, fichero 12).
- El humano puede reescribir el copy sin romper tests: los tests de R1
  assertan la constante del subject, la presencia del token como segundo
  párrafo y la presencia de la URL compuesta — no literales del texto.

### D5 — La página fallback es estática pura, sin llamada a la API (decisión abierta, cerrada aquí)

La decisión abierta era: ¿la página fallback llama directo a la API pública
desde el navegador (formulario + `fetch` + CORS en el backend) o es
puramente estática con instrucciones?

| | A: formulario + fetch + CORS | B: estática con instrucciones |
|---|---|---|
| Requiere API pública | **Sí — y no existe**: `infra/lib/` no provisiona ningún compute; el backend solo corre en local/docker | No |
| Cambios de backend | `enableCors` acotado + endpoint expuesto a internet | **Cero** |
| Riesgo | Superficie nueva (CORS, origen, token en JS que sale de la página) | El token no sale de la página: cero peticiones |
| Utilidad hoy | Nula (el `fetch` apuntaría a nada) | Completa: explica, ofrece abrir la app, muestra el token |

**Decisión: B.** La opción A no es que sea más cara — es que hoy es
**imposible**: no hay API pública que llamar, y montarla es un gate humano
con coste (deploy) que no pertenece a esta feature. La página estática
cumple los acceptance criteria («página usable»: explica qué hacer, botón al
scheme, token copiable) y cumple trivialmente la propiedad de seguridad:
**cargarla no consume nada porque no habla con nadie** (R10, R11). Vía de
mejora anotada en [[requirements]] §Deuda: cuando el backend esté
desplegado, añadir el formulario con `fetch` y CORS acotado al origen del
dominio propio.

Contenido de `hosting/reset-password/index.html` (autocontenido, español,
CSS inline, sin assets externos):

1. Título «Restablecer contraseña — Pet Tracker».
2. Explicación: el enlace abre la app; si se ve esta página, el teléfono no
   la abrió automáticamente.
3. Botón «Abrir en la app»: href construido en cliente con
   `URLSearchParams(location.search)` →
   `mobilepettracker://reset-password?token=<token>`.
4. Bloque copiable con el token y aviso de caducidad (1 hora, un solo uso).
5. Instrucción de instalar la app si no está instalada y volver a tocar el
   enlace del correo.

### D6 — La ruta móvil vive en la raíz de `src/app/`, fuera de `(auth)` y `(tabs)`

Verificado: `(auth)/_layout.tsx` hace `<Redirect href="/home" />` con sesión
activa, y `(tabs)` exige sesión. Un deep link de reset debe funcionar en
ambos estados (usuario con sesión que olvidó su contraseña incluido); si la
ruta viviera en `(auth)`, el redirect se comería el token. Por eso:

- `src/app/reset-password.tsx` — route delgado (3 líneas, patrón exacto de
  `(tabs)/profile.tsx`): `export default` que renderiza
  `ResetPasswordScreen`.
- `src/screens/reset-password/index.tsx` + `index.test.tsx` colocado —
  estructura oficial del repo (conventions.md, desde #39).
- La pantalla lee el token ella misma con
  `useLocalSearchParams<{ token?: string }>()`; el route no pasa props.
  Expo Router entrega ahí la URL tanto en cold start como con la app abierta;
  no hace falta `expo-linking` ni listener manual.
- URL resultante: `/reset-password` — coincide con `PASSWORD_RESET_PATH` y
  con el `pathPrefix` del intent filter (D1).

### D7 — La pantalla es idempotente: solo el submit habla con la red

Montarse con token **no** dispara nada (R6). Estados de la pantalla:

- `missing-token`: sin parámetro → `reset-missing-token` + link a `/login`.
- `form`: inputs `reset-password` / `reset-password-confirm` (heroui
  `TextField` + `Input secureTextEntry`, calcados de `login.tsx`), botón
  `reset-submit` (deshabilitado en vuelo).
- `success`: `reset-success` («Password updated») + `link-login`; el
  formulario se retira — el token ya está consumido, reintentar no tiene
  sentido.
- errores: `reset-error` (`<Text selectable>` clase `text-danger`), el
  formulario permanece (mapeo por `kind` fijado en R8).

UI: mismos patrones visuales que `login.tsx` (`flex-1 justify-center gap-4
bg-background p-6`, tokens, sin hex, sin clases arbitrarias, sin
`StyleSheet.create`). No hay componentes nuevos que extraer (pantalla única,
regla de extracción de la carta no aplica). Copy de la app en inglés, como
el resto de pantallas.

### D8 — `resetPassword` en `src/api/auth.ts`, unión discriminada como `login`

```ts
export type ResetPasswordState =
  | { kind: 'ok' }
  | { kind: 'invalid-token' }
  | { kind: 'expired' }
  | { kind: 'validation'; errors: FieldError[] }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export async function resetPassword(
  baseUrl: string | undefined,
  body: ResetPasswordRequest,
  fetchFn: typeof fetch = fetch,
): Promise<ResetPasswordState>;
```

Reutiliza los helpers privados existentes del fichero (`postJson`,
`readJson`, `validationErrors`). La ambigüedad del `400` se resuelve por la
forma del body: **con `errors[]` de zod ⇒ `validation`; sin él ⇒
`invalid-token`** (el controller de #44 devuelve `BadRequestException`
con `message` string para token inválido/usado). `410` ⇒ `expired` — es el
`GoneException` de #44 R7. `ResetPasswordRequest` se añade a
`src/api/types.ts` junto a `LoginRequest`/`RegisterRequest`.

### D9 — Intent filters por `app.config.ts`, no en `app.json` ni config plugin

Precedente literal en el repo: `GOOGLE_MAPS_API_KEY_ANDROID`
(`app.config.ts` + `app.config.test.ts`). Mismo patrón:

```ts
const resetLinkHost = process.env.RESET_LINK_HOST?.trim() ?? '';
// si hay host:
android: {
  ...resolvedConfig.android,
  intentFilters: [
    {
      autoVerify: true,
      action: 'VIEW',
      data: [{ scheme: 'https', host: resetLinkHost, pathPrefix: '/reset-password' }],
      category: ['BROWSABLE', 'DEFAULT'],
    },
  ],
},
```

- Sin la variable: `console.warn` (nombrando la variable y
  `docs/verification.md`) y config base intacta — el build sigue
  funcionando, solo sin App Links (R4). Ojo: son dos ramas independientes de
  la de Maps; un build puede tener una, ambas o ninguna variable.
- Por qué no en `app.json`: metería el dominio del humano en un repo público
  (D3). Por qué no un config plugin: `intentFilters` es config de primera
  clase de Expo; un plugin sería máquina de más para un objeto literal.
- El fingerprint del certificado **no** aparece aquí: vive en
  `assetlinks.json` del hosting (R9). Android verifica contra ese fichero al
  instalar; si la verificación falla, el enlace cae al navegador y a la
  página fallback — degradación correcta, no error.

### D10 — `hosting/`: directorio nuevo de primer nivel, deploy humano

`hosting/` contiene exactamente lo que se sube tal cual al hosting web de
Hostinger (`public_html/`): `.well-known/assetlinks.json`,
`reset-password/index.html` y un `README.md` de dos párrafos con el mapeo
fichero→ruta y el recordatorio del fingerprint. Se versiona para que el
contenido tenga review y tests (R9, R10); subirlo es gate humano (G2), igual
que en #58 lo fue el DNS. `AGENTS.md` gana una fila en su tabla-mapa
(disciplina de `docs-readme-sync`; no existe `README.md` raíz).

El fingerprint SHA-256 del certificado de firma del dev build lo aporta el
humano (G1): `keytool -list -v -keystore app/debug.keystore` desde
`mobile-pet-tracker/android`, el keystore del dev build local (los comandos exactos van en
`docs/verification.md` §Feature 59). Hasta entonces el fichero lleva el
placeholder `REPLACE_WITH_DEV_BUILD_SHA256`, y el test de R9 acepta
placeholder o fingerprint bien formado — el repo nunca queda en rojo por un
gate pendiente.

### D11 — Qué cambia exactamente en cada fichero

| Fichero | Capa / zona | Cambio |
|---|---|---|
| `infrastructure/email/password-reset-link.ts` | backend infrastructure | **nuevo**: `PASSWORD_RESET_PATH`, `buildPasswordResetUrl` (R1) |
| `infrastructure/email/resend-password-reset-sender.ts` | backend infrastructure | ctor `(client, resetLinkHost)` que valida host (R3) y párrafo nuevo con la URL (R1, D4) |
| `infrastructure/email/console-password-reset-sender.ts` | backend infrastructure | ctor `(resetLinkHost = null)` y campo `resetUrl` condicional (R2) |
| `auth.module.ts` | backend composición | el `useFactory` de `PASSWORD_RESET_SENDER` pasa `RESET_LINK_HOST` a ambos adaptadores; nada más |
| `test/auth-reset-deep-link.e2e-spec.ts` | backend e2e | **nuevo**: R11 |
| `app.config.ts` / `app.config.test.ts` | móvil build | rama `RESET_LINK_HOST` → `intentFilters` (R4) |
| `src/app/reset-password.tsx` | móvil route | **nuevo**: route delgado (D6) |
| `src/screens/reset-password/index.tsx` + `.test.tsx` | móvil screen | **nuevo**: pantalla (R5, R6, R8) |
| `src/api/auth.ts` / `types.ts` / `__tests__/auth.test.ts` | móvil api | `resetPassword` + `ResetPasswordRequest` (R7) |
| `src/__tests__/hosting-artifacts.test.ts` | móvil tests | **nuevo**: valida los ficheros de `hosting/` (R9, R10) |
| `hosting/**` | web estática | **nuevo**: assetlinks + página fallback + README (R9, R10) |
| `.env.example` (raíz y móvil), `docs/conventions.md`, `docs/verification.md`, `AGENTS.md` | config y docs | variable nueva documentada, sección Feature 59, fila `hosting/` |

Allowlist cerrada y exhaustiva en [[requirements]] R12.

## Archivos afectados

Resumen por zona (detalle en D11): backend solo
`modules/auth/infrastructure/email/` + `auth.module.ts` + un e2e nuevo;
móvil `app.config.*`, `src/app/reset-password.tsx`,
`src/screens/reset-password/`, `src/api/`; web `hosting/**`; config y docs.
**Ni `domain/` ni `application/` ni `auth.controller.ts` se tocan** — la
prueba de que la costura de #44/#58 aguanta: añadir el enlace es cambiar el
cuerpo de dos adaptadores.

## Alternativas descartadas

- **`mobilepettracker://` pelado como enlace del correo**: los clientes de
  correo no lo enlazan y sin app instalada es un enlace muerto (D2).
- **Token en el path** (`/reset-password/<token>`): ruta dinámica en Expo y
  reescrituras en el hosting a cambio de nada (D1).
- **Página fallback con `fetch` a la API**: no hay API pública que llamar;
  cerrada con trade-off en D5 y anotada como deuda.
- **Hardcodear el host en `app.json`**: mete el dominio del humano en un
  repo público; contradice #58 D12 (D3, D9).
- **Config plugin para los intent filters**: `intentFilters` es config de
  primera clase; el plugin sería ceremonia (D9).
- **`EXPO_PUBLIC_RESET_LINK_HOST`**: inlinearía el host en el bundle JS sin
  que ningún código runtime lo necesite (D3).
- **Listener manual de `expo-linking`**: Expo Router ya rutea la URL entrante
  a `/reset-password` en cold y warm start (D6).
- **Auto-submit al abrir la pantalla con token**: violaría la propiedad
  POST-only — el prefetch del cliente de correo o un doble tap consumirían
  el token sin intención del usuario (D7, R6, R11).
- **Nuevo error `MissingResetLinkConfigError`**: `MissingResendConfigError`
  ya expresa «falta config para el correo real» y su mensaje enumera claves;
  un tipo nuevo duplicaría el manejo (D3).
- **Mover el token del segundo párrafo del correo** para que el enlace vaya
  primero: rompe la heurística de `sanitize` de `resend-client.ts`, que está
  fuera de la allowlist (D4).
- **Activar `forgot.tsx` de paso**: es la feature `mobile-forgot-password`
  del backlog; meterla aquí duplicaría el alcance del smoke (§Fuera de
  alcance).
- **iOS Universal Links**: sin build ni credenciales iOS, y el smoke del
  repo es Android; feature propia cuando toque (§Fuera de alcance).
