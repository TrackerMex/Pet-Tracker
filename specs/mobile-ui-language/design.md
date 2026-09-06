---
feature: "mobile-ui-language"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[mobile-ui-language]]

> Ver [[requirements]] para los requisitos que este diseño implementa,
> [[copy-review]] para la hoja de revisión humana de la copy (no normativa),
> [[../../docs/ui-guidelines|ui-guidelines]] (carta de UI) y
> [[../../docs/conventions|conventions]] para las reglas que la implementación
> debe respetar. Fuente del alcance: `progress/explore_design-gap-vs-make.md`
> §4 y su ampliación del 2026-09-05. Fuente del vocabulario español:
> `specs/mobile-figma-polish/design-src/App.tsx` (el export del Figma Make ya
> versionado en el repo).

Esta spec es **autosuficiente**: Codex CLI no ve la conversación que la
originó. Todo el copy y todas las claves están en §2. **Codex no redacta texto
de producto y no inventa claves**: si encuentra una cadena visible que no está
en la tabla, para y lo anota en `progress/impl_mobile-ui-language.md`.

---

## 1. El inventario

### 1.1 Método (el reviewer lo repite)

Se leyó **entero** cada uno de los 37 ficheros `.ts`/`.tsx` no-test de
`mobile-pet-tracker/src/` y se anotó cada literal que el usuario ve: hijos de
`<Text>`, `label=`, `placeholder=`, `accessibilityLabel=`, los argumentos de
`Alert.alert`, las etiquetas de las tablas `REMINDER_TYPE_META`,
`ADVANCE_OPTIONS` y `TABS`, y las cadenas que pasan por
`setError`/`setFormError`/`setActionError`/`setGeneralError`/`setPhotoError`/
`setGenerateError` para acabar en un `<Text>`. **Excluidos**: `className`,
`testID`, rutas, estilos, claves de objeto, valores de dominio (`'dog'`,
`'female'`, `'online'`) y los `throw new Error` de los providers, que solo ve
un desarrollador.

Cada fila de §2 se verificó con un script que abre el archivo y comprueba que
el literal está **realmente** en la línea declarada (o en el par de líneas que
ocupa un texto JSX partido). **320 de 320 filas verifican** contra `a44925f`.

### 1.2 Resultado

| Métrica | Informe §4 | **Esta spec** | Nota |
|---|---|---|---|
| Cadenas inglesas **distintas** | ~214 | **213** | El informe daba un «~»; `· in ${days} days` se cuenta como **una** plantilla, no dos fragmentos |
| Ocurrencias **inglesas** | — | **309** | |
| Ocurrencias **ya en español** | 10 | **11** | 8 en `profile`, 2 en `add-pet`, 1 en `docs`. El informe contó 7 en `profile` y se dejó el `'No registrado'` de `InfoRow` (`profile/index.tsx:49`) |
| **Ocurrencias de copy totales** | — | **320** | Lo que el catálogo tiene que cubrir |
| **Claves** del catálogo | — | **255** | 241 de la copy inglesa + 11 de la ya española + 3 del interruptor (§3.3) |
| Ficheros de fuente afectados | — | **19** | De 37 no-test; los 13 de `src/api/` y los 5 de `src/theme/` están limpios |
| Puntos de test anclados a copy | 166 | **178** en **19** ficheros | Conteo por **literal**: cada string o regex de un fichero de test que contiene una cadena de la tabla, descontando a mano (a) títulos de `describe`/`it`, (b) `className`/`testID`, (c) **10** literales que son mensajes de validación **del backend** y se quedan en inglés, (d) **4** de `auth-provider.test.tsx` que rotulan botones del propio arnés, y (e) el directorio `src/api/__tests__/` entero, que no renderiza UI |
| Consultas por `testID` | 796 | **796** | Confirmado |
| Llamadas `*ByText(`/`toHaveTextContent(` | — | **246** (102 + 144) | |
| Plantillas con `${}` en texto visible | 31 (leader) | **33 sitios**, **11 son copy** | Enumeradas en §2.12 |
| Snapshots con copy | 0 | **0** | El único `.snap` es la ruta SVG de blobatar |
| Cadenas de usuario en `src/api/` | 0 | **0** | Los 13 módulos devuelven uniones por `kind` |

### 1.3 Reparto por archivo (320 ocurrencias, 19 archivos)

| Archivo | Ocurrencias | R-id |
|---|---:|---|
| `src/screens/pairing/index.tsx` | 40 | R10 |
| `src/screens/add-pet/index.tsx` | 40 | R9 |
| `src/screens/profile/index.tsx` | 28 | R7 |
| `src/screens/add-reminder/index.tsx` | 22 | R8 |
| `src/screens/reminders/index.tsx` | 21 | R8 |
| `src/app/(tabs)/home.tsx` | 20 | R3 |
| `src/app/(tabs)/map.tsx` | 19 | R4 |
| `src/app/(tabs)/meal-schedule.tsx` | 19 | R6 |
| `src/app/(tabs)/weight-log.tsx` | 18 | R5 |
| `src/app/(tabs)/food.tsx` | 16 | R6 |
| `src/screens/reset-password/index.tsx` | 15 | R11 |
| `src/app/(auth)/register.tsx` | 14 | R1 |
| `src/app/(tabs)/health.tsx` | 13 | R5 |
| `src/app/(auth)/login.tsx` | 10 | R1 |
| `src/screens/docs/index.tsx` | 7 | R7 |
| `src/utils/reminder-meta.ts` | 7 | R8 |
| `src/app/(auth)/forgot.tsx` | 5 | R1 |
| `src/components/floating-tab-bar.tsx` | 5 | R2 |
| `src/components/weight-chart.tsx` | 1 | R5 |

### 1.4 Reparto por fichero de test (178 anclas, 19 ficheros)

| Fichero de test | Anclas |
|---|---:|
| `src/screens/pairing/index.test.tsx` | 36 |
| `src/app/(tabs)/__tests__/map.test.tsx` | 21 |
| `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 16 |
| `src/app/(tabs)/__tests__/home.test.tsx` | 14 |
| `src/screens/reminders/index.test.tsx` | 14 |
| `src/screens/add-reminder/index.test.tsx` | 13 |
| `src/app/(tabs)/__tests__/food.test.tsx` | 12 |
| `src/app/(tabs)/__tests__/health.test.tsx` | 10 |
| `src/app/(tabs)/__tests__/weight-log.test.tsx` | 10 |
| `src/screens/reset-password/index.test.tsx` | 7 |
| `src/app/(auth)/__tests__/register.test.tsx` | 5 |
| `src/components/__tests__/floating-tab-bar.test.tsx` | 5 |
| `src/app/(auth)/__tests__/login.test.tsx` | 4 |
| `src/screens/add-pet/index.test.tsx` | 4 |
| `src/screens/profile/index.test.tsx` | 3 |
| `src/__tests__/legibility-classnames.test.ts` | 1 |
| `src/app/(auth)/__tests__/forgot.test.tsx` | 1 |
| `src/app/(tabs)/__tests__/screens.test.tsx` | 1 |
| `src/components/__tests__/weight-chart.test.tsx` | 1 |

`src/screens/docs/index.test.tsx` no aparece: sus aserciones de texto ya son
españolas o de fixture, y **siguen valiendo** porque el idioma por defecto es
español.

---

## 2. El catálogo (normativo)

### 2.0 Decisiones de catálogo

- **D1 — Esquema de claves: `<ámbito>.<nombreEnCamelCase>`, ámbito por
  pantalla.** El ámbito es el slug de la pantalla o del módulo
  (`login`, `forgot`, `register`, `tabs`, `home`, `map`, `health`, `weightLog`,
  `weightChart`, `food`, `mealSchedule`, `profile`, `docs`, `reminders`,
  `reminderType`, `addReminder`, `addPet`, `pairing`, `resetPassword`), más un
  ámbito `common` (D3). El nombre se deriva del **inglés**, no del español, en
  camelCase, con un máximo de cuatro palabras. Dos razones: el inglés es el
  idioma del código en este repo (`docs/conventions.md` §Commits), y **el
  español es lo que puede cambiar** en la revisión del humano — una clave
  derivada del español obligaría a renombrar claves cada vez que el humano
  ajuste una palabra.
  Es legible en el sitio de uso: `t('login.signIn')`, `t('pairing.unpairAlertTitle')`,
  `t('home.summaryTitle')`. No hay anidamiento (`login.form.email`): un solo
  nivel, porque dos niveles no aportan nada con 255 claves y complican el tipo.

- **D2 — El ámbito es por pantalla incluso cuando el texto coincide, y por eso
  hay 255 claves y no 213.** 213 es el número de **cadenas inglesas
  distintas**; las claves están acotadas, así que la misma cadena con dos
  significados son dos claves. **Y tiene que serlo**: `Food` es `Nutrición` en
  la pestaña (`tabs.food`) y `Comida` como tipo de recordatorio
  (`reminderType.food`); un catálogo plano por cadena las colisionaría y
  obligaría a elegir una sola traducción para las dos. El precio de duplicar
  una cadena de tres palabras en un objeto es cero; el precio de no poder
  divergir después es un refactor.

- **D3 — `common` solo para lo que se repite mucho, con umbral numérico.** Una
  cadena sube a `common` si aparece **≥5 veces en ≥5 archivos**. Cumplen
  exactamente cuatro, y son las cuatro genéricas de estado que nadie va a
  querer que diverjan por pantalla:

  | Clave | `en` | `es` | Usos / archivos |
  |---|---|---|---:|
  | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` | 31 / 13 |
  | `common.retry` | `Retry` | `Reintentar` | 14 / 10 |
  | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` | 10 / 9 |
  | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` | 5 / 5 |

  Cubren **60 de las 320** ocurrencias. La siguiente candidata (`Email`, 3/3)
  no llega al umbral y se queda acotada. El umbral es una regla, no un gusto:
  si mañana una quinta cadena llega a 5/5, sube.

- **D4 — Manda la palabra del diseño.** Donde el Make ya da la palabra en
  español se usa **ésa**: `En línea` (`design-src/App.tsx:358`), `Nutrición`
  (`:758`, etiqueta de la pestaña `food`), `Objetivo diario` (`:607`),
  `kcal / día` (`:609`), `Comidas hoy` (`:626`), `Servido` (`:639`),
  `Recomendación IA` (`:645`), `Cambiar foto` (`:683`), `Horarios y porciones`
  (`:1465`), `Activos`/`Esta semana`/`Inactivos` (`:933-935`), `¡Próximo!`
  (`:955`), `Agregar recordatorio` (`:1013`),
  `Vacuna`/`Medicamento`/`Consulta`/`Otro` (`:979-983`), `Nueva mascota`
  (`:1145`), `Tipo de mascota` (`:1194`), `Raza`/`Sexo`/`Tamaño`
  (`:1210, 1222, 1238`), `Esterilizado/a` (`:1262`), `Guardar mascota`
  (`:1304`), `Peso (kg)` (`:1573`), `Fecha` (`:1582`),
  `Batería`/`Conexión` (`:1639-1640`),
  `Nombres`/`Apellidos`/`Correo electrónico`/`País` (`:309-313`), `Contraseña`
  (`:227`), `Iniciar sesión` (`:224`), `¿Olvidaste tu contraseña?` (`:231`),
  `Crear cuenta` (`:290`), `Recuperar contraseña` (`:258`),
  `Volver al inicio de sesión` (`:270`, sin la flecha).

- **D5 — Tuteo, imperativo, sin punto final en botones y etiquetas.** Los
  mensajes y las frases completas conservan el punto si ya lo llevaban en
  inglés; ninguna cadena gana o pierde puntuación por su cuenta.

- **D6 — Las 11 cadenas que ya estaban en español entran al catálogo con su
  texto intacto en `es`**, y su columna `en` es traducción inversa que fija
  esta tabla (`Documentos` → `Documents`, `Datos básicos` →
  `Basic details`…). No se re-redactan para parecerse al Make: `Dispositivo
  GPS` se queda, aunque el diseño diga `Collar GPS`. Van marcadas
  *(ya en español)* en las tablas.

- **D7 — Las unidades no entran al catálogo.** `kg`, `km`, `km/h`, `kcal`,
  `g`, `%` y la `h`/`m` de `fmtMinutes` (`1h 35m`) son símbolos y siguen
  siendo literales en su formateador. Sí entra `ago`, que es una palabra
  (§2.12). La asimetría `m` (duración) frente a `min` (tiempo transcurrido) es
  deliberada: `hace 2 m` no se lee.

- **D8 — Las máscaras de fecha se traducen, el parseo no.** `YYYY-MM-DD` →
  `AAAA-MM-DD` es texto de ayuda; el valor que `weight-log` envía sigue siendo
  ISO y `localTodayIso()` no se toca. Igual con `BC n/9` → `CC n/9`.

- **D9 — Los emoji no son copy.** Los 7 de `REMINDER_TYPE_META` y el `📄` de
  `docs` se quedan como están: #62 ya declaró que sustituirlos es feature
  aparte. Lo que sale de `REMINDER_TYPE_META` al catálogo es **solo el
  `label`** (§3.5).

### 2.x — Cómo leer las tablas

`Línea` es la del commit base `a44925f`; si #64 entra antes, la línea se
desplaza y **la cadena sigue siendo el ancla**. `Clave` es normativa: es lo que
Codex escribe en el `t(...)`. `(param)` marca las 11 entradas con
interpolación (§2.12); *(ya en español)* marca las 11 de D6. Las claves
`common.*` aparecen repetidas en varios grupos: el recuento de «claves» de cada
cabecera las incluye, así que **la suma de los grupos es mayor que 252**; el
total sin repetir es 252 + 3 del interruptor = **255**.


### §2.1 — R1 — grupo `(auth)` (29 ocurrencias, 23 claves)

**`mobile-pet-tracker/src/app/(auth)/login.tsx`** — 10 ocurrencias

| Línea | Clave | `en` | `es` |
|---|---|---|---|
| 31 | `login.invalidCredentials` | `Invalid credentials` | `Credenciales inválidas` |
| 34 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
| 41 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 44 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 66 | `login.signIn` | `Sign in` | `Iniciar sesión` |
| 70 | `login.email` | `Email` | `Correo electrónico` |
| 83 | `login.password` | `Password` | `Contraseña` |
| 107 | `login.signIn` | `Sign in` | `Iniciar sesión` |
| 117 | `login.createAccount` | `Create account` | `Crear cuenta` |
| 126 | `login.forgotPassword` | `Forgot password?` | `¿Olvidaste tu contraseña?` |

**`mobile-pet-tracker/src/app/(auth)/forgot.tsx`** — 5 ocurrencias

| Línea | Clave | `en` | `es` |
|---|---|---|---|
| 37 | `forgot.forgotPassword` | `Forgot password` | `Recuperar contraseña` |
| 40 | `forgot.comingSoon` | `Password recovery coming soon` | `La recuperación de contraseña estará disponible pronto` |
| 44 | `forgot.email` | `Email` | `Correo electrónico` |
| 60 | `forgot.sendRecoveryLink` | `Send recovery link` | `Enviar enlace de recuperación` |
| 66 | `forgot.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |

**`mobile-pet-tracker/src/app/(auth)/register.tsx`** — 14 ocurrencias

| Línea | Clave | `en` | `es` |
|---|---|---|---|
| 120 | `register.emailAlreadyRegistered` | `Email already registered` | `Ese correo ya está registrado` |
| 129 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
| 133 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 136 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 156 | `register.createAccount` | `Create account` | `Crear cuenta` |
| 161 | `register.firstName` | `First name` | `Nombres` |
| 176 | `register.lastName` | `Last name` | `Apellidos` |
| 188 | `register.email` | `Email` | `Correo electrónico` |
| 201 | `register.phone` | `Phone` | `Teléfono` |
| 214 | `register.password` | `Password` | `Contraseña` |
| 228 | `register.confirmPassword` | `Confirm password` | `Confirmar contraseña` |
| 244 | `register.country` | `Country (2-letter code)` | `País (código de 2 letras)` |
| 263 | `register.iAcceptTerms` | `I accept the terms` | `Acepto los términos` |
| 279 | `register.createAccount` | `Create account` | `Crear cuenta` |


### §2.2 — R2 — barra de pestañas (5 ocurrencias, 5 claves)

**`mobile-pet-tracker/src/components/floating-tab-bar.tsx`** — 5 ocurrencias

| Línea | Clave | `en` | `es` |
|---|---|---|---|
| 49 | `tabs.home` | `Home` | `Inicio` |
| 50 | `tabs.map` | `Map` | `Mapa` |
| 51 | `tabs.health` | `Health` | `Salud` |
| 52 | `tabs.food` | `Food` | `Nutrición` |
| 53 | `tabs.profile` | `Profile` | `Perfil` |


### §2.3 — R3 — Home (20 ocurrencias, 18 claves)

**`mobile-pet-tracker/src/app/(tabs)/home.tsx`** — 20 ocurrencias

| Línea | Clave | `en` | `es` |
|---|---|---|---|
| 47 | `home.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
| 48 | `home.lastSeen` **(param)** | `Last seen {{date}}` | `Última señal {{date}}` |
| 110 | `home.home` | `Home` | `Inicio` |
| 119 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 122 | `common.retry` | `Retry` | `Reintentar` |
| 129 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
| 147 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 149 | `common.retry` | `Retry` | `Reintentar` |
| 197 | `home.free` | `Free` | `Sin collar` |
| 199 | `home.online` | `Online` | `En línea` |
| 200 | `home.offline` | `Offline` | `Sin conexión` |
| 233 | `home.noCollar` | `No collar — health only` | `Sin collar — solo salud` |
| 245 | `home.pairCollar` | `Pair a collar` | `Vincular collar` |
| 256 | `home.summaryTitle` | `Today&apos;s Summary` | `Resumen de hoy` |
| 265 | `home.activityNeedsCollar` | `Activity tracking requires a collar` | `La actividad requiere un collar` |
| 273 | `home.couldNotLoadActivity` | `Could not load activity` | `No se pudo cargar la actividad` |
| 289 | `home.activity` | `Activity` | `Actividad` |
| 301 | `home.sleep` | `Sleep` | `Descanso` |
| 313 | `home.distance` | `Distance` | `Distancia` |
| 332 | `home.viewOnMap` | `View on map` | `Ver en el mapa` |


### §2.4 — R4 — Map (19 ocurrencias, 17 claves)

**`mobile-pet-tracker/src/app/(tabs)/map.tsx`** — 19 ocurrencias

| Línea | Clave | `en` | `es` |
|---|---|---|---|
| 60 | `map.justNow` | `Just now` | `Justo ahora` |
| 61 | `map.agoMinutes` **(param)** | `{{minutes}}m ago` | `hace {{minutes}} min` |
| 62 | `map.agoHours` **(param)** | `{{hours}}h ago` | `hace {{hours}} h` |
| 196 | `map.noSignal` | `No signal` | `Sin señal` |
| 198 | `map.live` | `Live` | `En vivo` |
| 199 | `map.stale` | `Stale` | `Desactualizado` |
| 210 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 213 | `common.retry` | `Retry` | `Reintentar` |
| 221 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
| 229 | `map.trackingNeedsCollar` | `Live tracking requires a collar` | `El rastreo en vivo requiere un collar` |
| 240 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 243 | `common.retry` | `Retry` | `Reintentar` |
| 269 | `map.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
| 299 | `map.speed` | `Speed` | `Velocidad` |
| 315 | `map.distance` | `Distance` | `Distancia` |
| 333 | `map.updated` | `Updated` | `Actualizado` |
| 366 | `map.deactivateLostMode` | `Deactivate Lost Mode` | `Desactivar modo perdido` |
| 367 | `map.activateLostMode` | `Activate Lost Mode` | `Activar modo perdido` |
| 376 | `map.couldNotUpdateLostMode` | `Could not update Lost Mode` | `No se pudo cambiar el modo perdido` |


### §2.5 — R5 — Health, log de peso y gráfica (32 ocurrencias, 27 claves)

**`mobile-pet-tracker/src/app/(tabs)/health.tsx`** — 13 ocurrencias

| Línea | Clave | `en` | `es` |
|---|---|---|---|
| 91 | `health.health` | `Health` | `Salud` |
| 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 103 | `common.retry` | `Retry` | `Reintentar` |
| 110 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
| 127 | `health.vaccines` | `Vaccines` | `Vacunas` |
| 151 | `health.nextDue` | `Next due` | `Próxima dosis` |
| 165 | `health.noVaccinesYet` | `No vaccines yet` | `Aún no hay vacunas` |
| 173 | `health.couldNotLoadVaccines` | `Could not load vaccines` | `No se pudieron cargar las vacunas` |
| 176 | `common.retry` | `Retry` | `Reintentar` |
| 217 | `health.weight` | `Weight` | `Peso` |
| 243 | `health.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
| 249 | `health.couldNotLoadWeight` | `Could not load weight` | `No se pudo cargar el peso` |
| 261 | `health.weightLog` | `Weight log` | `Registro de peso` |

**`mobile-pet-tracker/src/app/(tabs)/weight-log.tsx`** — 18 ocurrencias

| Línea | Clave | `en` | `es` |
|---|---|---|---|
| 72 | `weightLog.enterValidWeight` | `Enter a valid weight` | `Introduce un peso válido` |
| 99 | `weightLog.errorForbidden` | `Only the owner can log weights` | `Solo el dueño puede registrar pesos` |
| 102 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
| 109 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 112 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 133 | `weightLog.backToHealth` | `Back to health` | `Volver a Salud` |
| 141 | `weightLog.weightLog` | `Weight log` | `Registro de peso` |
| 154 | `weightLog.weight` | `Weight` | `Peso` |
| 160 | `weightLog.weightKg` | `Weight (kg)` | `Peso (kg)` |
| 167 | `weightLog.measuredAt` | `Measured at` | `Fecha de medición` |
| 172 | `weightLog.yyyyMmDd` | `YYYY-MM-DD` | `AAAA-MM-DD` |
| 179 | `weightLog.bodyCondition` | `Body condition` | `Condición corporal` |
| 185 | `weightLog.bodyConditionPlaceholder` | `Body condition 1-9 (optional)` | `Condición corporal 1-9 (opcional)` |
| 204 | `weightLog.logWeight` | `Log weight` | `Registrar peso` |
| 220 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 223 | `common.retry` | `Retry` | `Reintentar` |
| 230 | `weightLog.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
| 284 | `weightLog.bodyConditionValue` **(param)** | `BC {{value}}/9` | `CC {{value}}/9` |

**`mobile-pet-tracker/src/components/weight-chart.tsx`** — 1 ocurrencias

| Línea | Clave | `en` | `es` |
|---|---|---|---|
| 20 | `weightChart.notEnoughDataYet` | `Not enough data yet` | `Aún no hay datos suficientes` |


### §2.6 — R6 — Food y Meal schedule (35 ocurrencias, 29 claves)

**`mobile-pet-tracker/src/app/(tabs)/food.tsx`** — 16 ocurrencias

| Línea | Clave | `en` | `es` |
|---|---|---|---|
| 80 | `food.food` | `Food` | `Nutrición` |
| 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 94 | `common.retry` | `Retry` | `Reintentar` |
| 101 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
| 144 | `food.dailyTarget` | `Daily target` | `Objetivo diario` |
| 150 | `food.dailyKcal` **(param)** | `{{kcal}} kcal / day` | `{{kcal}} kcal / día` |
| 156 | `food.dailyGrams` **(param)** | `{{grams}} g / day` | `{{grams}} g / día` |
| 174 | `food.mealsToday` | `Meals today` | `Comidas hoy` |
| 224 | `food.pending` | `Pending` | `Pendiente` |
| 224 | `food.served` | `Served` | `Servido` |
| 259 | `food.aiRecommendation` | `AI recommendation` | `Recomendación IA` |
| 272 | `food.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
| 281 | `food.couldNotLoadPlan` | `Could not load meal plan` | `No se pudo cargar el plan de alimentación` |
| 284 | `common.retry` | `Retry` | `Reintentar` |
| 296 | `food.mealSchedule` | `Meal schedule` | `Horario de comidas` |
| 299 | `food.mealScheduleLinkSubtitle` | `View nutrition profile and times` | `Ver el perfil nutricional y los horarios` |

**`mobile-pet-tracker/src/app/(tabs)/meal-schedule.tsx`** — 19 ocurrencias

| Línea | Clave | `en` | `es` |
|---|---|---|---|
| 83 | `mealSchedule.errorForbidden` | `Only the owner can generate the plan` | `Solo el dueño puede generar el plan` |
| 87 | `mealSchedule.errorProfileRequired` | `Create a nutrition profile first` | `Primero crea un perfil nutricional` |
| 89 | `mealSchedule.registerWeightFirst` | `Register a weight first` | `Primero registra un peso` |
| 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 95 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
| 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 105 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 126 | `mealSchedule.backToFood` | `Back to food` | `Volver a Nutrición` |
| 135 | `mealSchedule.mealSchedule` | `Meal schedule` | `Horario de comidas` |
| 160 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 163 | `common.retry` | `Retry` | `Reintentar` |
| 178 | `mealSchedule.dailyTarget` | `Daily target` | `Objetivo diario` |
| 184 | `mealSchedule.dailyGrams` **(param)** | `{{grams}} g / day` | `{{grams}} g / día` |
| 190 | `mealSchedule.mealsPerDay` **(param)** | `{{meals}} meals / day` | `{{meals}} comidas / día` |
| 198 | `mealSchedule.timesAndPortions` | `Times and portions` | `Horarios y porciones` |
| 232 | `mealSchedule.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
| 250 | `mealSchedule.generatePlan` | `Generate plan` | `Generar plan` |
| 269 | `mealSchedule.nutritionProfile` | `Nutrition profile` | `Perfil nutricional` |
| 297 | `mealSchedule.noNutritionProfileYet` | `No nutrition profile yet` | `Aún no hay perfil nutricional` |


### §2.7 — R7 — Profile y Documentos (35 ocurrencias, 32 claves)

**`mobile-pet-tracker/src/screens/profile/index.tsx`** — 28 ocurrencias

| Línea | Clave | `en` | `es` |
|---|---|---|---|
| 49 | `profile.notRegistered` *(ya en español)* | `Not registered` | `No registrado` |
| 85 | `profile.sterilized` | `Sterilized` | `Esterilizado` |
| 86 | `profile.notSterilized` | `Not sterilized` | `Sin esterilizar` |
| 87 | `profile.ageMonths` **(param)** | `{{months}} months` | `{{months}} meses` |
| 157 | `profile.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
| 174 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
| 186 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
| 192 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
| 211 | `profile.profile` | `Profile` | `Perfil` |
| 219 | `profile.addPet` | `Add pet` | `Añadir mascota` |
| 234 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
| 240 | `profile.couldNotLoadPets` | `Could not load pets` | `No se pudieron cargar las mascotas` |
| 253 | `profile.couldNotLoadPet` | `Could not load pet profile` | `No se pudo cargar el perfil de la mascota` |
| 255 | `common.retry` | `Retry` | `Reintentar` |
| 272 | `profile.changePhoto` | `Change photo` | `Cambiar foto` |
| 283 | `profile.information` *(ya en español)* | `Information` | `Información` |
| 285 | `profile.breed` *(ya en español)* | `Breed` | `Raza` |
| 286 | `profile.microchip` *(ya en español)* | `Microchip` | `Microchip` |
| 287 | `profile.gpsDevice` *(ya en español)* | `GPS device` | `Dispositivo GPS` |
| 290 | `profile.lastSignal` *(ya en español)* | `Last signal` | `Última señal` |
| 307 | `profile.documents` *(ya en español)* | `Documents` | `Documentos` |
| 319 | `profile.gpsSettings` *(ya en español)* | `GPS device settings` | `Configuración del Dispositivo GPS` |
| 334 | `profile.reminders` | `Reminders` | `Recordatorios` |
| 340 | `profile.account` | `Account` | `Cuenta` |
| 355 | `profile.accountUnavailable` | `Account unavailable` | `Cuenta no disponible` |
| 365 | `profile.useDarkTheme` | `Use dark theme` | `Usar tema oscuro` |
| 365 | `profile.useLightTheme` | `Use light theme` | `Usar tema claro` |
| 376 | `profile.signOut` | `Sign out` | `Cerrar sesión` |

**`mobile-pet-tracker/src/screens/docs/index.tsx`** — 7 ocurrencias

| Línea | Clave | `en` | `es` |
|---|---|---|---|
| 68 | `docs.backToProfile` | `Back to profile` | `Volver a Perfil` |
| 79 | `docs.documentsOf` *(ya en español)* | `Documents of` | `Documentos de` |
| 85 | `docs.pet` | `Pet` | `Mascota` |
| 101 | `docs.noDocumentsYet` | `No documents yet` | `Aún no hay documentos` |
| 103 | `docs.emptyBody` | `Medical documents will appear here.` | `Los documentos médicos aparecerán aquí.` |
| 116 | `docs.couldNotLoadDocuments` | `Could not load documents` | `No se pudieron cargar los documentos` |
| 118 | `common.retry` | `Retry` | `Reintentar` |


### §2.8 — R8 — Recordatorios y su alta (50 ocurrencias, 43 claves)

**`mobile-pet-tracker/src/screens/reminders/index.tsx`** — 21 ocurrencias

| Línea | Clave | `en` | `es` |
|---|---|---|---|
| 87 | `reminders.errorForbidden` | `Only the owner can delete` | `Solo el dueño puede eliminar` |
| 90 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
| 97 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 136 | `reminders.reminders` | `Reminders` | `Recordatorios` |
| 143 | `reminders.new` | `New` | `Nuevo` |
| 171 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 174 | `common.retry` | `Retry` | `Reintentar` |
| 182 | `reminders.noRemindersYet` | `No reminders yet` | `Aún no hay recordatorios` |
| 211 | `reminders.active` | `Active` | `Activos` |
| 236 | `reminders.thisWeek` | `This week` | `Esta semana` |
| 253 | `reminders.inactive` | `Inactive` | `Inactivos` |
| 285 | `reminders.upcoming` | `Upcoming!` | `¡Próximo!` |
| 301 | `reminders.cancelled` | `Cancelled` | `Cancelado` |
| 301 | `reminders.sent` | `Sent` | `Enviado` |
| 305 | `reminders.dueInDays` **(param)** | `· in {{days}} days` | `· en {{days}} días` |
| 319 | `reminders.delete` | `Delete` | `Eliminar` |
| 342 | `reminders.deleteReminder` | `Delete reminder?` | `¿Eliminar recordatorio?` |
| 351 | `reminders.deleteSheetBody` | `This action cannot be undone.` | `Esta acción no se puede deshacer.` |
| 361 | `reminders.delete` | `Delete` | `Eliminar` |
| 370 | `reminders.cancel` | `Cancel` | `Cancelar` |

**`mobile-pet-tracker/src/utils/reminder-meta.ts`** — 7 ocurrencias

| Línea | Clave | `en` | `es` |
|---|---|---|---|
| 7 | `reminderType.vaccine` | `Vaccine` | `Vacuna` |
| 8 | `reminderType.deworming` | `Deworming` | `Desparasitación` |
| 9 | `reminderType.medication` | `Medication` | `Medicamento` |
| 10 | `reminderType.appointment` | `Appointment` | `Consulta` |
| 11 | `reminderType.weight` | `Weight` | `Peso` |
| 12 | `reminderType.food` | `Food` | `Comida` |
| 13 | `reminderType.other` | `Other` | `Otro` |

**`mobile-pet-tracker/src/screens/add-reminder/index.tsx`** — 22 ocurrencias

| Línea | Clave | `en` | `es` |
|---|---|---|---|
| 21 | `addReminder.advanceSameDay` | `Same day` | `El mismo día` |
| 22 | `addReminder.advance1Day` | `1 day before` | `1 día antes` |
| 23 | `addReminder.advance3Days` | `3 days before` | `3 días antes` |
| 24 | `addReminder.advance7Days` | `7 days before` | `7 días antes` |
| 56 | `addReminder.titleIsRequired` | `Title is required` | `El título es obligatorio` |
| 60 | `addReminder.pickDate` | `Pick a date` | `Elige una fecha` |
| 66 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
| 86 | `addReminder.errorForbidden` | `Only the owner can create reminders` | `Solo el dueño puede crear recordatorios` |
| 89 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
| 92 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
| 99 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 122 | `addReminder.backToReminders` | `Back to reminders` | `Volver a Recordatorios` |
| 132 | `addReminder.addReminder` | `Add reminder` | `Agregar recordatorio` |
| 138 | `addReminder.type` | `Type` | `Tipo` |
| 169 | `addReminder.title` | `Title` | `Título` |
| 176 | `addReminder.reminderTitle` | `Reminder title` | `Título del recordatorio` |
| 186 | `addReminder.date` | `Date` | `Fecha` |
| 196 | `addReminder.selectDate` | `Select a date` | `Elige una fecha` |
| 202 | `addReminder.time` | `Time` | `Hora` |
| 256 | `addReminder.alert` | `Alert` | `Aviso` |
| 292 | `addReminder.saveReminder` | `Save reminder` | `Guardar recordatorio` |


### §2.9 — R9 — Alta de mascota (40 ocurrencias, 38 claves)

**`mobile-pet-tracker/src/screens/add-pet/index.tsx`** — 40 ocurrencias

| Línea | Clave | `en` | `es` |
|---|---|---|---|
| 114 | `addPet.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
| 148 | `addPet.nameIsRequired` | `Name is required` | `El nombre es obligatorio` |
| 155 | `addPet.chooseBirthDate` | `Choose a birth date` | `Elige una fecha de nacimiento` |
| 162 | `addPet.errorAgeRange` | `Enter an age from 0 to 480 months` | `Introduce una edad de 0 a 480 meses` |
| 189 | `addPet.errorPhotoAfterCreate` | `Pet created, but the photo could not be uploaded` | `Se creó la mascota, pero no se pudo subir la foto` |
| 198 | `addPet.checkPetDetails` | `Check the pet details` | `Revisa los datos de la mascota` |
| 201 | `addPet.youCannotCreatePet` | `You cannot create a pet` | `No puedes crear una mascota` |
| 204 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
| 208 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 211 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 231 | `addPet.backToProfile` | `Back to profile` | `Volver a Perfil` |
| 240 | `addPet.addPet` | `Add pet` | `Nueva mascota` |
| 245 | `addPet.pet` | `Pet` | `Mascota` |
| 250 | `addPet.avatarPreview` | `Avatar preview` | `Vista previa del avatar` |
| 259 | `addPet.choosePhoto` | `Choose photo` | `Elegir foto` |
| 269 | `addPet.basicDetails` *(ya en español)* | `Basic details` | `Datos básicos` |
| 272 | `addPet.species` | `Species` | `Tipo de mascota` |
| 289 | `addPet.cat` | `Cat` | `Gato` |
| 289 | `addPet.dog` | `Dog` | `Perro` |
| 297 | `addPet.name` | `Name` | `Nombre` |
| 303 | `addPet.petName` | `Pet name` | `Nombre de la mascota` |
| 311 | `addPet.breed` | `Breed` | `Raza` |
| 317 | `addPet.optional` | `Optional` | `Opcional` |
| 325 | `addPet.sex` | `Sex` | `Sexo` |
| 327 | `addPet.female` | `Female` | `Hembra` |
| 328 | `addPet.male` | `Male` | `Macho` |
| 333 | `addPet.size` | `Size` | `Tamaño` |
| 335 | `addPet.small` | `Small` | `Pequeño` |
| 336 | `addPet.medium` | `Medium` | `Mediano` |
| 337 | `addPet.large` | `Large` | `Grande` |
| 341 | `addPet.medicalDetails` *(ya en español)* | `Medical details` | `Datos médicos` |
| 344 | `addPet.age` | `Age` | `Edad` |
| 347 | `addPet.birthDate` | `Birth date` | `Fecha de nacimiento` |
| 348 | `addPet.approxMonths` | `Approx. months` | `Meses aprox.` |
| 376 | `addPet.selectBirthDate` | `Select a birth date` | `Elige una fecha de nacimiento` |
| 386 | `addPet.months` | `Months` | `Meses` |
| 412 | `addPet.sterilized` | `Sterilized` | `Esterilizado/a` |
| 414 | `addPet.yes` | `Yes` | `Sí` |
| 426 | `addPet.optional` | `Optional` | `Opcional` |
| 440 | `addPet.savePet` | `Save pet` | `Guardar mascota` |


### §2.10 — R10 — Emparejado del collar (40 ocurrencias, 33 claves)

**`mobile-pet-tracker/src/screens/pairing/index.tsx`** — 40 ocurrencias

| Línea | Clave | `en` | `es` |
|---|---|---|---|
| 126 | `pairing.errorInvalidCode` | `Invalid activation code. Check the code printed on the box.` | `Código de activación no válido. Revisa el código impreso en la caja.` |
| 130 | `pairing.errorAlreadyClaimed` | `This collar is already paired to another pet.` | `Este collar ya está vinculado a otra mascota.` |
| 133 | `pairing.errorPetHasDevice` | `This pet already has a collar. Unpair it first.` | `Esta mascota ya tiene un collar. Desvincúlalo primero.` |
| 137 | `pairing.errorNoSubscription` | `This collar has no active plan. Contact support to activate it.` | `Este collar no tiene un plan activo. Contacta con soporte para activarlo.` |
| 141 | `pairing.errorForbiddenClaim` | `Only the owner can pair a collar.` | `Solo el dueño puede vincular un collar.` |
| 147 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
| 151 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 155 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 189 | `pairing.errorForbiddenRelease` | `Only the owner can unpair the collar.` | `Solo el dueño puede desvincular el collar.` |
| 195 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
| 199 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 203 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 212 | `pairing.unpairAlertTitle` | `Unpair collar?` | `¿Desvincular collar?` |
| 213 | `pairing.unpairAlertBody` | `Location history stays, but live tracking stops until you pair a collar again.` | `El historial de ubicaciones se conserva, pero el rastreo en vivo se detiene hasta que vincules otro collar.` |
| 215 | `pairing.cancel` | `Cancel` | `Cancelar` |
| 217 | `pairing.unpair` | `Unpair` | `Desvincular` |
| 238 | `pairing.back` | `Back` | `Volver` |
| 267 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 270 | `common.retry` | `Retry` | `Reintentar` |
| 277 | `pairing.addPetFirst` | `Add a pet first` | `Primero añade una mascota` |
| 302 | `pairing.trackerIsReady` | `Tracker is ready` | `El collar está listo` |
| 305 | `pairing.readySubtitle` **(param)** | `{{petName}}'s collar is paired. GPS tracking is on.` | `El collar de {{petName}} está vinculado. El rastreo GPS está activo.` |
| 312 | `pairing.model` | `Model` | `Modelo` |
| 330 | `pairing.viewOnMap` | `View on map` | `Ver en el mapa` |
| 340 | `pairing.done` | `Done` | `Listo` |
| 348 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
| 357 | `pairing.freePlanPairPrompt` | `Free plan — health only. Pair a collar with an active plan to see the map.` | `Plan gratuito — solo salud. Vincula un collar con plan activo para ver el mapa.` |
| 364 | `pairing.activationCode` | `Activation code` | `Código de activación` |
| 377 | `pairing.printedOnCollarBox` | `Printed on the collar box` | `Impreso en la caja del collar` |
| 388 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
| 397 | `pairing.gpsDevice` | `GPS device` | `Dispositivo GPS` |
| 403 | `pairing.model` | `Model` | `Modelo` |
| 408 | `pairing.battery` | `Battery` | `Batería` |
| 417 | `pairing.connection` | `Connection` | `Conexión` |
| 422 | `pairing.lastMessage` | `Last message` | `Último mensaje` |
| 429 | `pairing.noMessagesYet` | `No messages yet` | `Sin mensajes todavía` |
| 453 | `pairing.gpsTrackingActive` | `GPS tracking active` | `Rastreo GPS activo` |
| 461 | `pairing.freePlanNoActivePlan` | `Free plan — health only. This collar has no active plan.` | `Plan gratuito — solo salud. Este collar no tiene plan activo.` |
| 468 | `pairing.planStatusUnavailable` | `Plan status unavailable` | `Estado del plan no disponible` |
| 479 | `pairing.unpairCollar` | `Unpair collar` | `Desvincular collar` |


### §2.11 — R11 — Restablecer contraseña (15 ocurrencias, 11 claves)

**`mobile-pet-tracker/src/screens/reset-password/index.tsx`** — 15 ocurrencias

| Línea | Clave | `en` | `es` |
|---|---|---|---|
| 36 | `resetPassword.errorInvalidToken` | `Reset link is invalid or already used. Request a new one.` | `El enlace no es válido o ya se usó. Solicita uno nuevo.` |
| 40 | `resetPassword.errorExpiredToken` | `Reset link expired. Request a new one.` | `El enlace caducó. Solicita uno nuevo.` |
| 46 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
| 50 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 53 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 77 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
| 84 | `resetPassword.errorMissingToken` | `This reset link is incomplete. Open the link from your email again.` | `Este enlace está incompleto. Ábrelo de nuevo desde tu correo.` |
| 88 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
| 113 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
| 120 | `resetPassword.passwordUpdated` | `Password updated` | `Contraseña actualizada` |
| 128 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
| 151 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
| 156 | `resetPassword.newPassword` | `New password` | `Nueva contraseña` |
| 171 | `resetPassword.confirmNewPassword` | `Confirm new password` | `Confirmar nueva contraseña` |
| 197 | `resetPassword.updatePassword` | `Update password` | `Actualizar contraseña` |


**Suma de control**: 29 + 5 + 20 + 19 + 32 + 35 + 35 + 50 + 40 + 40 + 15 = **320** ocurrencias y **252** claves distintas; con las 3 del interruptor (§3.3), **255**.

### §2.12 — La interpolación: los 33 sitios, y cuáles son copy

El conteo previo del leader dio **31 plantillas con `${}` en texto visible**.
El barrido completo —plantillas con `${}` **y** llaves JSX dentro de un nodo de
texto, que el grep de backticks no ve— da **33 sitios**. De esos, **11 son
copy** y necesitan una entrada con parámetro; los otros **22 son formateadores
de unidades o datos** y no entran al catálogo. Enumerados, no estimados:

**Los 11 que son copy → entrada con parámetro**

| # | Sitio | Hoy | Clave | `en` | `es` |
|---|---|---|---|---|---|
| 1 | `home.tsx:48` | `` `Last seen ${new Date(iso).toLocaleString()}` `` | `home.lastSeen` | `Last seen {{date}}` | `Última señal {{date}}` |
| 2 | `map.tsx:61` | `` `${Math.floor(seconds / 60)}m ago` `` | `map.agoMinutes` | `{{minutes}}m ago` | `hace {{minutes}} min` |
| 3 | `map.tsx:62` | `` `${Math.floor(seconds / 3600)}h ago` `` | `map.agoHours` | `{{hours}}h ago` | `hace {{hours}} h` |
| 4 | `profile/index.tsx:87` | `` `${pet.ageMonths} months` `` | `profile.ageMonths` | `{{months}} months` | `{{months}} meses` |
| 5 | `reminders/index.tsx:305` | `` `· in ${days} days` `` | `reminders.dueInDays` | `· in {{days}} days` | `· en {{days}} días` |
| 6 | `weight-log.tsx:284` | JSX `BC {entry.bodyCondition}/9` | `weightLog.bodyConditionValue` | `BC {{value}}/9` | `CC {{value}}/9` |
| 7 | `pairing/index.tsx:305` | JSX `{selectedPet.name}&apos;s collar is paired. GPS tracking is on.` | `pairing.readySubtitle` | `{{petName}}'s collar is paired. GPS tracking is on.` | `El collar de {{petName}} está vinculado. El rastreo GPS está activo.` |
| 8 | `food.tsx:150` | JSX `{loadedPlan.merKcal} kcal / day` | `food.dailyKcal` | `{{kcal}} kcal / day` | `{{kcal}} kcal / día` |
| 9 | `food.tsx:156` | JSX `{loadedPlan.dailyGrams} g / day` | `food.dailyGrams` | `{{grams}} g / day` | `{{grams}} g / día` |
| 10 | `meal-schedule.tsx:184` | JSX `{loadedPlan.dailyGrams} g / day` | `mealSchedule.dailyGrams` | `{{grams}} g / day` | `{{grams}} g / día` |
| 11 | `meal-schedule.tsx:190` | JSX `{loadedPlan.mealsPerDay} meals / day` | `mealSchedule.mealsPerDay` | `{{meals}} meals / day` | `{{meals}} comidas / día` |

Los 7 primeros son evidentes: llevan una palabra pegada al número (`ago`,
`months`, `days`, el genitivo sajón, `Last seen`, `BC`). Los cuatro últimos son
menos obvios y por eso van explicados: `day` **es una palabra**, no un símbolo.
Dejarlos como sufijo fijo (`t('food.dayUnit')` pegado detrás del número)
funcionaría hoy y se rompería el día que un idioma ponga la unidad delante o
use un separador distinto, y además deja en el catálogo entradas ilegibles
(` kcal / día` como valor suelto). Se parametrizan: mismo número de entradas y
copy completa en cada una.

> **Validación cruzada de esta lista.** El escaneo de R18 comprueba la
> ausencia de cada valor del catálogo como **literal entero** en su archivo.
> Sobre el commit base, ese escaneo encuentra **exactamente estas 11** filas
> donde el literal entero no existe (porque están partidas por una
> interpolación) y **ninguna más**. La enumeración de arriba no es una
> estimación: es la salida de esa comprobación.

**Los 22 que no son copy → siguen siendo literales en su formateador**

| Sitio | Qué es |
|---|---|
| `home.tsx:37, 38` | `` `${minutes}m` `` y `` `${h}h ${m}m` `` — duración, símbolos |
| `home.tsx:42`, `map.tsx:52` | `` `${km} km` `` — unidad |
| `home.tsx:228`, `pairing/index.tsx:413` | `` `${pct}%` `` — unidad |
| `map.tsx:56` | `` `${kmh} km/h` `` — unidad |
| `health.tsx:36`, `weight-log.tsx:34` | `` `+${v} kg` `` / `` `${v} kg` `` — signo + unidad |
| `health.tsx:31`, `weight-log.tsx:41`, `add-pet/index.tsx:34` | ISO `YYYY-MM-DD` — **valor**, no texto |
| `food.tsx:27` | `` `${hh}:${mm}` `` — hora, valor |
| `health.tsx:224`, `weight-log.tsx:273`, `profile/index.tsx:88` | JSX `{n} kg` — unidad |
| `food.tsx:209`, `meal-schedule.tsx:221` | JSX `{n} g` — unidad |
| `meal-schedule.tsx:181` | JSX `{n} kcal` — unidad |
| `meal-schedule.tsx:276` | JSX `{n} kcal / 100 g` — unidad |
| `food.tsx:180` | JSX `{servidas}/{total}` — números |
| `profile/index.tsx:348` | `` `${firstName} ${lastName}` `` — datos del usuario |
| `add-reminder/index.tsx:159` | `` `${meta.emoji} ${meta.label}` `` — **composición**: el emoji es iconografía (D9) y el `label` ya sale del catálogo |
| `register.tsx:53` | `` `${a}\n${b}` `` — concatena mensajes **del backend**; el `\n` es separador |
| `weight-chart.tsx:36, 37` | coordenadas SVG |

---

## 3. La infraestructura

### 3.1 Decisiones

- **D1 — Sin librería de i18n.** Ni `i18next`, ni `react-intl`, ni `lingui`.
  255 claves × 2 idiomas es un objeto TypeScript; lo que hace falta de una
  librería —resolver una clave, sustituir un parámetro y repintar al cambiar—
  son quince líneas y un contexto de React. El repo ya tiene los dos patrones:
  `src/theme/use-theme-colors.ts` (hook que resuelve por token) y
  `src/providers/selected-pet-provider.tsx` (contexto + `useMemo` + hook que
  lanza fuera del provider). Una librería traería negociación de locale,
  plurales ICU, carga asíncrona de bundles y un `Suspense` que aquí no tienen
  usuario.
- **D2 — Sin `expo-localization`, y por tanto sin detección del idioma del
  teléfono.** El idioma es **elección explícita** del usuario. Un teléfono en
  inglés en México no dice nada sobre en qué idioma quiere la app, y arrancar
  en inglés a un usuario que espera español es peor que arrancar siempre igual.
  Consecuencia asumida: un usuario anglófono ve la primera pantalla en español
  y tiene que ir a Profile. Si algún día se quiere detectar, **ésa** es la
  decisión que se reabre, y es una feature de tres líneas sobre esta base.
- **D3 — Español por defecto**, sin pregunta, sin pantalla de bienvenida (R16).
- **D4 — La persistencia copia `theme-preference.ts` tal cual**: mismo
  `expo-secure-store` (ya instalado, `~57.0.1`), misma forma de dos funciones,
  mismo `try/catch` que traga, misma validación del valor leído. Si el
  almacenamiento falla, `getStoredLanguage()` devuelve `undefined` y la app
  arranca en español (R13). **No se añade ninguna dependencia.**
- **D5 — El idioma vive en un contexto de React, el tema no.** El tema usa
  `Uniwind.setTheme`, un store fuera de React con su propio repintado nativo;
  el idioma no puede usar eso porque no es CSS. Contexto + `useState` es lo
  correcto y además da gratis lo que pide R14: repintar sin desmontar.

### 3.2 Los tres módulos nuevos

```
mobile-pet-tracker/src/i18n/catalog.ts               ← las 255 claves × 2
mobile-pet-tracker/src/providers/language-provider.tsx ← contexto + t + locale
mobile-pet-tracker/src/utils/language-preference.ts  ← persistencia (clon de theme-preference)
```

**`src/i18n/catalog.ts`** — el `en` es la fuente del tipo, y `es` se declara
como `Record<TranslationKey, string>`, de modo que **falta o sobra una clave y
TypeScript rompe la compilación antes que el test**:

```ts
export const en = {
  'common.somethingWentWrong': 'Something went wrong',
  'login.signIn': 'Sign in',
  'home.lastSeen': 'Last seen {{date}}',
  // … 255
} as const;

export type TranslationKey = keyof typeof en;
export const es: Record<TranslationKey, string> = {
  'common.somethingWentWrong': 'Algo salió mal',
  'login.signIn': 'Iniciar sesión',
  'home.lastSeen': 'Última señal {{date}}',
  // … 255
};
export const LOCALES = { es: 'es-MX', en: 'en-US' } as const;
export type Language = keyof typeof LOCALES;
export const DEFAULT_LANGUAGE: Language = 'es';
```

El tipo cubre la paridad de **claves**; el test de R12 cubre lo que el tipo no
puede: la paridad de **marcadores `{{…}}`** por clave (que `es` no se deje un
`{{date}}` que `en` sí tiene, lo que dejaría un hueco en pantalla).

**`src/providers/language-provider.tsx`** — mismo esqueleto que
`selected-pet-provider.tsx`:

```ts
export function LanguageProvider({ initial, children }: { initial: Language; children: ReactNode })
export function useLanguage(): { language: Language; setLanguage: (l: Language) => void }
export function useTranslate(): (key: TranslationKey, params?: Record<string, string | number>) => string
export function useLocale(): string   // LOCALES[language]
```

`t` resuelve `catalog[language][key]` y sustituye cada `{{nombre}}` por
`params[nombre]`. **Si falta un parámetro deja el marcador tal cual** en vez de
lanzar: un descuido debe verse feo, no tumbar la pantalla. `setLanguage`
actualiza el estado **y** llama a `setStoredLanguage` sin esperarlo (`void`),
igual que `useThemeTransition` hace con `setStoredTheme`.

**`src/utils/language-preference.ts`** — clon literal de
`theme-preference.ts` con `LANGUAGE_PREFERENCE_KEY = 'language_preference'` y
`value === 'es' || value === 'en'`.

**Montaje en `src/app/_layout.tsx`** — el layout **ya** espera a
`getStoredTheme()` antes de renderizar nada (`if (!themeReady) return <></>`).
El idioma se lee **en ese mismo `useEffect`**, con un `Promise.all`, y se
guarda en un estado que alimenta el `initial` del provider. **No se añade un
segundo gate ni un segundo render en blanco**: la app ya no pinta nada hasta
que el tema está listo, y leer una clave más de SecureStore es del mismo orden.

### 3.3 Las 3 claves del interruptor (copy nueva, no está en `copy-review`)

| Clave | `en` | `es` | Dónde |
|---|---|---|---|
| `profile.languageSpanish` | `Español` | `Español` | etiqueta del botón cuando el idioma vigente es `en` |
| `profile.languageEnglish` | `English` | `English` | etiqueta del botón cuando el idioma vigente es `es` |
| `profile.changeLanguage` | `Change language` | `Cambiar idioma` | `accessibilityLabel` del botón |

Las dos primeras **valen lo mismo en los dos idiomas a propósito**: son
endónimos. Un menú de idiomas que traduce los nombres de los idiomas
(«Spanish» / «Español» según dónde estés) es justo lo que impide a alguien
salir de un idioma que no entiende. Entran igualmente al catálogo para que la
regla «cero copy suelta» de R18 no tenga excepciones.

**La forma del control es la del `theme-toggle`, no una lista.** El
`theme-toggle` es un `Button` cuya etiqueta nombra el estado al que iría
(`Use dark theme`). El de idioma hace lo mismo: con dos idiomas, un botón que
dice `English` y te lleva a inglés es más corto de entender que un selector, y
son cero componentes nuevos. Si algún día hay un tercer idioma, **ahí** se
cambia a un `Picker` de `@expo/ui/community/picker`, y no antes.

### 3.4 Repintar sin reiniciar, y qué pasa con las pantallas abiertas

`setLanguage` es un `setState` del provider. React vuelve a renderizar el
árbol; **no lo desmonta**. Consecuencias, todas queridas:

- **El estado local sobrevive**: el formulario a medio llenar de
  `add-reminder` (sus nueve `useState`), el código escrito en `pairing`, la
  mascota seleccionada, la posición del scroll y los datos ya cargados por
  `useApi`. Nada se refetchea.
- **Los textos ya renderizados cambian** porque todos salen de `t`, que depende
  del contexto. Los que **no** cambian son los que ya estaban fuera del
  catálogo: los mensajes de error del backend que hay en pantalla en ese
  momento (siguen en inglés, §7.1) y los valores de enum de la API (§7.2).
- **Una `Alert.alert` abierta no cambia**: su texto se resolvió al abrirla.
  Es correcto —el diálogo nativo ya está en pantalla— y por eso R10 exige que
  los textos de la alerta se resuelvan **en el momento de la llamada**, no en
  una constante de módulo.
- **Sin animación.** El tema tiene un *fade* nativo opcional
  (`withThemeTransition`, #58); el idioma **no lo lleva**: cambiar el idioma no
  es un cambio de superficie y meter Reanimated aquí sería añadir motion no
  pedido, contra el invariante de [[requirements]].

### 3.5 Las tres tablas de constantes que hoy guardan texto

Son el único sitio donde el texto se congela en tiempo de import y por eso no
bastaría con envolverlas en `t`. Dejan de guardar texto y guardan **la clave**:

| Constante | Archivo | Hoy | Después |
|---|---|---|---|
| `TABS` | `src/components/floating-tab-bar.tsx:48-54` | `{ name, label: 'Home', Icon }` | `{ name, labelKey: 'tabs.home', Icon }`, y el `<Text>` renderiza `t(labelKey)` |
| `REMINDER_TYPE_META` | `src/utils/reminder-meta.ts:3-14` | `{ label: 'Vaccine', emoji: '💉' }` | `{ labelKey: 'reminderType.vaccine', emoji: '💉' }` — **las 7 claves del `Record<ReminderType, …>` y los 7 emoji no se tocan** |
| `ADVANCE_OPTIONS` | `src/screens/add-reminder/index.tsx:20-25` | `{ minutes: 0, label: 'Same day' }` | `{ minutes: 0, labelKey: 'addReminder.advanceSameDay' }` — **los 4 valores de `minutes` no se tocan** |

Los dos consumidores de `REMINDER_TYPE_META` (`reminders/index.tsx:278` y
`add-reminder/index.tsx:159`) pasan de `meta.label` a `t(meta.labelKey)`. En
`add-reminder:159` la plantilla `` `${meta.emoji} ${meta.label}` `` pasa a
`` `${meta.emoji} ${t(meta.labelKey)}` ``: sigue siendo composición, no copy
(§2.12).

### 3.6 Fechas y números: se atan al idioma elegido

**Decisión: sí.** Hoy las 7 llamadas a `toLocale*` van sin argumento, así que
siguen el locale **del sistema**, que puede no coincidir con el idioma elegido:
un teléfono en inglés con la app en español pinta `9/4/2026` junto a
`Última señal`. Eso se ve, y es exactamente el tipo de mezcla que esta feature
viene a eliminar. Se pasa el locale explícito de `useLocale()`
(`es-MX` / `en-US`):

| Archivo | Línea | Llamada |
|---|---:|---|
| `src/app/(tabs)/home.tsx` | 48 | `new Date(iso).toLocaleString()` — dentro de `fmtLastSeen`, que pasa a recibir el locale |
| `src/screens/profile/index.tsx` | 293 | `new Date(pet.lastCommunicationAt).toLocaleString()` |
| `src/screens/pairing/index.tsx` | 428 | `new Date(...lastMessageAt).toLocaleString()` |
| `src/screens/reminders/index.tsx` | 294 | `new Date(reminder.dueAt).toLocaleDateString()` |
| `src/screens/add-reminder/index.tsx` | 196 | `date.toLocaleDateString()` |
| `src/screens/add-reminder/index.tsx` | 212 | `time.toLocaleTimeString([], { hour, minute })` — el `[]` pasa a ser el locale |
| `src/screens/add-pet/index.tsx` | 376 | `birthDate.toLocaleDateString()` |

`es-MX` porque el mercado del brief es Perú/México/Colombia y México es el
mayor de los tres (el diseño usa prefijos `+52`); `en-US` como su contrapartida
natural. Son dos constantes en `catalog.ts`, no una tabla de países.

**Riesgo declarado**: si el motor no tiene datos de ese locale, `Intl` degrada
al locale por defecto **sin lanzar** — el comportamiento es exactamente el de
hoy, así que el peor caso de este cambio es «no mejora», nunca «rompe». Hermes
en RN 0.86 (Expo SDK 57) trae `Intl` con datos, así que se espera que mejore.

**Los tests no se rompen por esto**: los que asertan fechas las recalculan con
la misma llamada (`home.test.tsx:583`), así que basta con que pasen el mismo
locale. Los formatos numéricos de la app (`toFixed`, `%`, `kg`) no usan `Intl`
y no cambian: `toLocaleString` de números **no se introduce aquí** — eso sería
cambiar cómo se ven todas las cifras, y no lo pide nadie.

---

## 4. Los tests

### 4.1 El fixture y el escaneo

Dos ficheros nuevos del lado de test:

- `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` — la **tabla de uso**:
  qué clave se usa en qué archivo, transcrita de §2.

  ```ts
  export type UseRow = { file: string; key: TranslationKey };
  export const R1_AUTH: UseRow[] = [ /* 29 */ ];
  // … R2 5, R3 20, R4 19, R5 32, R6 35, R7 35, R8 50, R9 40, R10 40, R11 15
  export const ALL_USES: UseRow[] = [...]; // 320
  ```

- `mobile-pet-tracker/src/__tests__/ui-language.test.ts` — un `describe` por
  R-id, todos sobre el mismo helper:

  ```ts
  const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
  function checkUses(uses: UseRow[]) {
    for (const { file, key } of uses) {
      const src = readFileSync(join(SRC, file), 'utf8');
      expect(src).toContain(`t('${key}'`);          // (a) resuelve por clave
    }
  }
  function checkNoLooseCopy(files: string[]) {      // (b) cero copy suelta
    for (const file of files) {
      const src = readFileSync(join(SRC, file), 'utf8');
      for (const value of [...Object.values(en), ...Object.values(es)]) {
        if (value.includes('{{')) continue;         // (c) las 11 con parámetro
        expect(wholeLiterals(src)).not.toContain(norm(value));
      }
    }
  }
  ```

  `wholeLiterals(src)` extrae **cadenas entrecomilladas completas** y **nodos
  de texto JSX completos**, normaliza espacios y devuelve la lista. La
  comparación es de **igualdad**, no de subcadena, y eso es lo que hace que
  **no haga falta ninguna lista de excepciones**: `className` no es igual a
  `Name`, `"email-address"` no es igual a `Email`, `WeightChart` no es igual a
  `Weight`. Verificado sobre las 274 parejas *(archivo, cadena)* del commit
  base: la igualdad por literal entero coincide con el conteo de copy en
  **todas** salvo las 11 con interpolación, que quedan cubiertas por (a).

  Patrón de escaneo de fuente ya usado en el repo:
  `src/__tests__/design-drift.test.ts`,
  `src/__tests__/consistency-classnames.test.ts`,
  `src/__tests__/legibility-classnames.test.ts` y
  `src/__tests__/hosting-artifacts.test.ts` (este último ya asevera sobre
  archivos de fuera de `mobile-pet-tracker/`, que es lo que necesita R19).

### 4.2 En qué idioma corren los tests: en **español**, el de por defecto

**Decisión: los ~178 tests de pantalla corren en español** y siguen aseverando
la cadena visible tal cual (`getByText('Iniciar sesión')`), sin envolver nada.

Tres razones:

1. **El español es lo que ve el usuario por defecto.** La suite prueba lo que
   se envía, no una configuración que casi nadie tendrá.
2. **Repetir los 178 asserts en inglés no descubre nada nuevo.** Lo que puede
   romperse del inglés es *que falte una clave o un parámetro*, y eso lo
   demuestra el test de R12 —paridad de claves por tipo, paridad de marcadores
   por test— sobre las 255 entradas de golpe, no 178 renders.
3. **El coste del alternativo es real**: los 19 ficheros de test tienen su
   propio `renderX()`, así que correr en dos idiomas pide un parámetro de
   idioma en 19 helpers, ~178 aserciones duplicadas y un fixture con las dos
   columnas por ancla. Es más de la mitad del trabajo de la feature para
   confirmar lo que el tipo ya garantiza.

**Lo que sí se prueba en inglés**, para que la columna no sea decorativa: el
test de R14 cambia el idioma y comprueba que **la pantalla se repinta en
inglés**, con al menos **seis** aserciones que cubren los seis tipos de copy —
título de pantalla, etiqueta de pestaña, botón, mensaje de error, estado vacío
y `placeholder`—. Seis renders en inglés, no 178.

> Si el humano prefiere la suite en los dos idiomas, es una enmienda a esta
> spec antes del handoff, y el coste está arriba, medido.

### 4.3 Los 6 `testID` nuevos de R17

Los `describe('#62 R5: el título de card usa un único tratamiento')` localizan
un nodo **por su texto** para después aseverar su `props.className`. El texto
ahí es un *localizador*, no lo que se prueba: anclarlo a la copy es el
acoplamiento que encarece esta feature.

| Archivo de fuente | Línea | Nodo | `testID` nuevo | Test que lo consume |
|---|---:|---|---|---|
| `src/app/(tabs)/home.tsx` | 255 | título `home.summaryTitle` | `summary-card-title` | `home.test.tsx:771` |
| `src/app/(tabs)/health.tsx` | 217 | título `health.weight` | `weight-card-title` | `health.test.tsx:612` |
| `src/app/(tabs)/food.tsx` | 174 | título `food.mealsToday` | `food-meals-title` | `food.test.tsx:521` |
| `src/app/(tabs)/food.tsx` | 259 | título `food.aiRecommendation` | `food-ai-title` | `food.test.tsx:521` |
| `src/app/(tabs)/food.tsx` | 296 | título `food.mealSchedule` | `meal-schedule-link-title` | `food.test.tsx:521` |
| `src/app/(tabs)/meal-schedule.tsx` | 269 | título `mealSchedule.nutritionProfile` | `nutrition-profile-title` | `meal-schedule.test.tsx:460` |

Cambios exactos: `home.test.tsx:771`, `health.test.tsx:612` y
`meal-schedule.test.tsx:460` pasan de `findByText('…')` a
`findByTestId('<id>')`, con la aserción de `className` **idéntica byte a
byte**; `food.test.tsx:521-522` cambia su `it.each` de las tres cadenas a los
tres `testID`, `findByText(title)` a `findByTestId(testID)`, y el título del
`it` de `'aplica la receta canónica a %s'` a
`'aplica la receta canónica al título %s'`.

**No se pierde ni una aserción de copy.** Cuatro de las seis cadenas siguen
asertadas en otro sitio (`Resumen de hoy` en `home.test.tsx:453`, `Peso` en
`health.test.tsx:460`, `Recomendación IA` en `food.test.tsx:426`,
`Perfil nutricional` en `meal-schedule.test.tsx:240`); las **2** que se
quedarían sin cubrir —`Comidas hoy` y `Horario de comidas`— se reponen con dos
`getByText` en el test que ya renderiza el plan de `food`. Neto: **246 → 244**
llamadas de texto (−4 migradas, +2 nuevas) y **796 → ≥800** consultas por
`testID` (+4 migradas, +1 `language-toggle`, y `≥` porque los tests de R14 y
R17 añaden alguna más).

**Ningún otro ancla se migra.** Las otras 172 comprueban *el texto que se
muestra*, que es justo lo que esta feature cambia. Convertirlas a `testID`
borraría la aserción, no la desacoplaría.

### 4.4 Los 6 títulos de test que citan copy y hay que actualizar

| Fichero | Línea | Actual | Nuevo |
|---|---:|---|---|
| `src/app/(tabs)/__tests__/health.test.tsx` | 609 | `aplica la receta canónica a Weight` | `… a Peso` |
| `src/app/(tabs)/__tests__/map.test.tsx` | 919 | `muestra mensaje y Retry cuando last devuelve error` | `… y Reintentar …` |
| `src/app/(tabs)/__tests__/map.test.tsx` | 935 | `Retry llama al refetch de last y recupera el mapa` | `Reintentar llama al refetch …` |
| `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 450 | `aplica la receta canónica a Nutrition profile` | `… a Perfil nutricional` |
| `src/app/(tabs)/__tests__/food.test.tsx` | 522 | `aplica la receta canónica a %s` | `aplica la receta canónica al título %s` |
| `src/screens/pairing/index.test.tsx` | 413 | `R7: … muestra "Tracker is ready" …` | `… muestra "El collar está listo" …` |

Los otros ~44 títulos en inglés se quedan: [[requirements]] §Fuera de alcance 10.

---

## 5. Archivos afectados

Todo es capa de **presentación** de la app móvil. `backend-pet-tracker/` **no
se abre en ningún commit**.

**Fuente, nuevos (3)** — `src/i18n/catalog.ts`,
`src/providers/language-provider.tsx`, `src/utils/language-preference.ts`.

**Fuente, modificados (21)** — los 19 de §1.3, más `src/app/_layout.tsx`
(montaje del provider, §3.2) y `src/utils/reminder-meta.ts` ya contado en los
19. En total: los 19 con copy + `_layout.tsx`.

**Tests nuevos (3)** — `src/__tests__/ui-copy-table.ts` (fixture),
`src/__tests__/ui-language.test.ts`,
`src/providers/__tests__/language-provider.test.tsx`,
`src/utils/language-preference.test.ts`.

**Tests que se actualizan (19 + 2)** — los 19 de §1.4, más
`src/app/__tests__/layout.test.tsx` (R16) y
`src/screens/profile/index.test.tsx` (R14, además de sus 3 anclas).

**Docs y specs (10)** — `docs/ui-guidelines.md` (R20) y las 9 specs de §6.1
(R19).

**No se tocan**: `mobile-pet-tracker/src/theme/` (incluido `global.css`),
`src/api/`, `src/hooks/`, `app.json`, `package.json`, `hosting/`,
`backend-pet-tracker/`, `infra/`.

---

## 6. Gobernanza

### 6.1 Las 9 specs aprobadas que ratificaron el inglés

El informe nombraba **6**. El barrido de `specs/` encuentra **9**: las 6 más 3
que el informe no listó, en las listas de «decisiones menores objetables en
este gate» de #35, #36 y #37, que son ratificación igual.

| # | Fichero | Línea | Frase que ratifica el inglés |
|---|---|---:|---|
| 1 | `specs/mobile-auth/requirements.md` | 248 | «Decisiones menores objetables en este gate: … **copy en inglés**, `headerShown: false` global (§D5).» |
| 2 | `specs/mobile-home-dashboard/requirements.md` | 309 | «… **textos en inglés** (`Free`, `No pets yet`, etc.) …» |
| 3 | `specs/mobile-map-live/requirements.md` | 285 | «Menores objetables: … **textos en inglés**, botón Lost Mode con `Coming soon` …» |
| 4 | `specs/mobile-health/requirements.md` | 379-380 | «Menores objetables: … **textos en inglés**, vencidas en `text-danger` sin badge.» |
| 5 | `specs/mobile-food/design.md` | 197-200 | «**D8 — Idiomas.** Textos de UI **en inglés** (consistencia con Home/Map/Health). Los `warnings[].message` del backend llegan en español y se muestran tal cual …» |
| 6 | `specs/mobile-food/requirements.md` | 332 | «Menores (… **UI en inglés** con warnings del backend en español tal cual …): sin objeción, quedan como están.» |
| 7 | `specs/mobile-reminders/requirements.md` | 64-65 | «**UI en inglés** (decisión de #38 vigente); el diseño está en español, los literales de esta spec son los normativos.» |
| 8 | `specs/auth-reset-deep-link/design.md` | 182-183 | «**Copy de la app en inglés**, como el resto de pantallas.» |
| 9 | `specs/mobile-device-pairing/design.md` | 202-228 | «**### D7 — Copy: inglés, strings exactos**» + una tabla de **18 filas** de «Texto exacto» que fija literalmente `Pair collar`, `Free plan — health only…`, `Activation code`, `Tracker is ready`, `Unpair collar?`… Es la ratificación más fuerte: no dice «en inglés», enumera los strings |

**Dos notas de aplazamiento que NO son ratificación y no necesitan gate**:
`specs/mobile-ui-legibility-polish/requirements.md:286` (#61) y
`specs/mobile-ui-consistency-polish/requirements.md:343` (#62) listan «unificar
el idioma de la UI» como **fuera de alcance**. Aplazar no es ratificar, y esta
feature es la que cierra el aplazamiento.

### 6.2 La enmienda concreta (texto literal a insertar)

**El tono cambia respecto de una traducción a secas, y es importante**: con el
catálogo, **el literal inglés que esas specs fijaron no desaparece**. Se mueve
a la columna `en` y sigue siendo lo que ve un usuario que elija inglés. La
enmienda no revoca sus strings: los **reubica** y cambia el idioma **por
defecto**.

**(a)** En la línea que ratifica el inglés (columna «Línea» de §6.1), marcar la
frase y apuntar al bloque. Una forma por caso:

- #1, #2, #3, #4, #6 (listas de menores): `copy en inglés` →
  `~~copy en inglés~~ copy en los dos idiomas desde #65, español por defecto (ver §Enmienda #65)`
  — y equivalentes para `textos en inglés` / `UI en inglés`.
- #5: `- **D8 — Idiomas.**` →
  `- **D8 — Idiomas.** ~~Textos de UI en inglés (consistencia con Home/Map/Health).~~ **Enmendado por #65: los textos de UI viven en el catálogo de dos idiomas; el inglés de esta spec es la columna `en` y el español por defecto es la `es` (ver §Enmienda #65).**`
  El resto de D8 —los `warnings[].message` del backend en español, mostrados
  tal cual— **sigue vigente y no se toca**: es justo lo que R6 conserva, y en
  los dos idiomas.
- #7: `UI en inglés (decisión de #38 vigente)` →
  `~~UI en inglés (decisión de #38 vigente)~~ **UI en catálogo de dos idiomas desde #65, español por defecto (ver §Enmienda #65)**; los literales de esta spec pasan a ser la columna `en` de su clave.`
- #8: `Copy de la app en inglés, como el resto de pantallas.` →
  `~~Copy de la app en inglés, como el resto de pantallas.~~ **Copy de la app en el catálogo de dos idiomas desde #65, español por defecto (ver §Enmienda #65).**`
- #9 (la que más cambia de tono): el encabezado
  `### D7 — Copy: inglés, strings exactos` pasa a
  `### D7 — Copy: strings exactos, ahora en dos idiomas (enmendado por #65)` y,
  justo debajo de la tabla de 18 filas, se inserta:
  `> **Enmendada por #65.** Los 18 «Texto exacto» de esta tabla **siguen siendo normativos**: son la columna `en` de su clave en `specs/mobile-ui-language/design.md` §2.10, y un usuario que elija inglés los sigue viendo palabra por palabra. Lo que cambia es que ya no son el único idioma y que el idioma por defecto es español; el texto que ve ese usuario está en la columna `es` de la misma fila. Los testID de esta tabla no cambian.`

**(b)** Al final de cada uno de los 9 ficheros, antes de `## Aprobación` si lo
hay, insertar **este bloque, literal**, sustituyendo `<FEATURE>` por el nombre
de la carpeta de esa spec:

```markdown
## Enmienda #65 — idioma de la UI

El 2026-09-04 el humano decidió que la UI móvil va en español, y el 2026-09-05
que la feature sea un **catálogo de dos idiomas con interruptor en Profile y
español por defecto** (`progress/explore_design-gap-vs-make.md` §4, decisión A
y su ampliación). Esta spec ratificó el inglés en su día; esa parte queda
**enmendada**.

- **Qué cambia**: el literal de UI que esta spec fija deja de estar escrito en
  la pantalla y pasa a resolverse por clave contra el catálogo. El idioma por
  defecto es el español.
- **Qué NO cambia**: **el literal inglés de esta spec sigue siendo normativo**
  como columna `en` de su clave — un usuario que elija inglés lo sigue viendo
  palabra por palabra. Y no cambia ningún requisito `R<n>`, ningún `testID`,
  ninguna conducta, ningún contrato de API ni ninguna decisión visual. La
  trazabilidad `R-id ↔ test` de `<FEATURE>` sigue siendo válida.
- **Fuente única del literal y de la clave**:
  `specs/mobile-ui-language/design.md` §2. Si esta spec y esa tabla discrepan,
  **manda la tabla**.
- **Los mensajes de validación del backend siguen en inglés en los dos
  idiomas** y esta enmienda no los toca
  (`specs/mobile-ui-language/requirements.md` §Fuera de alcance 1).

- [ ] Enmienda aprobada por humano (fecha: ____)
```

La casilla la marca **el humano**, en el mismo gate que aprueba esta spec.
Ningún agente la marca (`AGENTS.md` §3).

### 6.3 Texto literal para `docs/ui-guidelines.md` (lo escribe R20)

Se añade como punto **6** de §Dirección de arte, después de «5. Fidelidad no es
pérdida de información»:

```markdown
**6. Idioma: catálogo de dos idiomas, español por defecto.** Decidido por el
humano el 2026-09-04 (español) y el 2026-09-05 (catálogo + interruptor), y
ejecutado por la feature #65. **Ninguna pantalla escribe texto**: todo lo que
ve el usuario —títulos, etiquetas, placeholders, `accessibilityLabel`,
mensajes de error, botones de `Alert`— se resuelve con `t('<ámbito>.<clave>')`
contra `mobile-pet-tracker/src/i18n/catalog.ts`. Toda spec que introduzca copy
nueva **añade su clave en los dos idiomas** en el mismo gate y la registra en
la tabla de `specs/mobile-ui-language/design.md` §2; una clave que exista en un
idioma y no en el otro no compila. Donde el diseño del Make da la palabra en
español se usa **la del diseño**. **No hay librería de i18n y no se instala
una**, ni `expo-localization`: el idioma es elección explícita del usuario en
Profile, no detección del idioma del teléfono. Las fechas y las horas siguen al
idioma elegido (`es-MX` / `en-US`), no al locale del sistema.

Tres corolarios que nadie debe confundir con lo anterior:

- **El idioma del código no cambia.** Nombres de variables, funciones, tipos,
  ficheros, `testID`, rutas y **las claves del catálogo** siguen en inglés, y
  los mensajes de commit también (`docs/conventions.md` §Commits).
- **El backend sigue devolviendo validaciones en inglés, en los dos idiomas.**
  Se ve en `login-error`, `register-*-error`, `weight-form-error` y
  `reset-error`, porque son mensajes de Zod de `backend-pet-tracker/`.
  Traducirlos es una feature de backend. Al revés, las advertencias
  nutricionales del backend ya llegan en español y se muestran tal cual — y en
  inglés también, porque tampoco se traducen.
- **Los valores de enum que la API devuelve se pintan crudos**: `pet.sex`,
  `device.connectivity`, `document.type`, `foodType`, `activityLevel`. Siguen
  en inglés en los dos idiomas, y `connectivity` además enseña jerga del
  proveedor, contra el punto 4 de esta misma sección. Mapearlos es cambio de
  conducta y va a feature propia.
```

---

## 7. Alternativas descartadas

- **Traducir los 309 literales en el sitio ahora y añadir el interruptor
  después.** Descartado por el humano el 2026-09-05 con la cuenta hecha: son
  los mismos 309 sitios y las mismas 178 anclas **dos veces**. Metido dentro,
  el número de ediciones es idéntico y solo cambia con qué se sustituye.
- **Instalar `i18next` / `react-intl` / `lingui`.** §3.1 D1: 255 claves × 2
  idiomas es un objeto y un contexto, y el repo ya tiene los dos patrones.
- **`expo-localization` para detectar el idioma del teléfono.** §3.1 D2: el
  idioma es elección explícita. Es la decisión que se reabre si algún día se
  quiere, y son tres líneas sobre esta base.
- **Catálogo plano, una clave por cadena inglesa (213 claves).** Descartado en
  §2.0 D2: colisiona `Food` (pestaña `Nutrición`) con `Food` (tipo de
  recordatorio `Comida`) y obliga a elegir una sola traducción para dos cosas
  distintas.
- **Claves derivadas del español.** Descartado en §2.0 D1: el español es lo que
  el humano puede cambiar en la revisión, y renombrar claves cada vez que se
  ajusta una palabra es churn puro. Además el idioma del código es el inglés.
- **Claves anidadas (`login.form.email`).** Dos niveles no aportan nada con 255
  claves y complican el tipo `TranslationKey`.
- **Un selector de idioma con lista o `Picker`.** Descartado en §3.3: con dos
  idiomas, un botón que dice `English` es más corto de entender y son cero
  componentes nuevos. El `Picker` entra cuando entre el tercer idioma.
- **Una pantalla de ajustes.** No existe hoy; crearla no entra aquí (decisión
  del humano del 2026-09-05).
- **Correr la suite en los dos idiomas.** §4.2, con el coste medido: parámetro
  de idioma en 19 helpers, ~178 aserciones duplicadas, fixture con dos
  columnas por ancla. Lo que descubriría —que falta una clave o un parámetro—
  lo demuestra el tipo y el test de R12 sobre las 255 entradas de golpe.
- **Dejar las fechas con el locale del sistema.** §3.6: se ve, y es la misma
  mezcla que la feature elimina. El peor caso del cambio es «no mejora».
- **Motor de plurales / ICU.** No hay ni un plural que se rompa en el catálogo
  (`{{days}} días` funciona con 1 y con 5). Infraestructura sin usuario.
- **Animar el cambio de idioma** con `withThemeTransition`. §3.4: no es un
  cambio de superficie y sería motion no pedido.
- **Reescribir los literales dentro de las 9 specs aprobadas.** §6.2:
  duplicaría el catálogo en nueve sitios y garantizaría la deriva. El bloque de
  enmienda deja **una** fuente de verdad — y además, con el catálogo, esos
  literales **siguen siendo válidos** como columna `en`.
- **Migrar a `testID` todas las anclas de texto.** §4.3: 172 de las 178
  comprueban *el texto que se muestra*. Cambiarlas borraría la aserción.
- **Mapear los 5 enums de la API de paso.** Cambio de conducta sobre datos.
  Declarado en [[requirements]] §Fuera de alcance 2 con sus 5 sitios exactos,
  para que la brecha se vea y no se descubra en el smoke.
