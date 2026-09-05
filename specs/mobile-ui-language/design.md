---
feature: "mobile-ui-language"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[mobile-ui-language]]

> Ver [[requirements]] para los requisitos que este diseño implementa,
> [[../../docs/ui-guidelines|ui-guidelines]] (carta de UI) y
> [[../../docs/conventions|conventions]] para las reglas que la
> implementación debe respetar. Fuente del alcance:
> `progress/explore_design-gap-vs-make.md` §4. Fuente del vocabulario:
> `specs/mobile-figma-polish/design-src/App.tsx` (el export del Figma Make ya
> versionado en el repo).

Esta spec es **autosuficiente**: Codex CLI no ve la conversación que la
originó. Todo el copy que hay que escribir está en §2, cadena a cadena, con su
ruta y su línea. **Codex no redacta texto de producto**: si encuentra una
cadena visible que no está en la tabla, para y lo anota en
`progress/impl_mobile-ui-language.md`.

---

## 1. El inventario, rehecho

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
la cadena inglesa está **realmente** en la línea declarada (o en el par de
líneas que ocupa un texto JSX partido). **309 de 309 filas verifican.**

### 1.2 Resultado, y en qué difiere del informe

| Métrica | Informe §4 | **Esta spec** | Por qué difiere |
|---|---|---|---|
| Cadenas inglesas distintas | ~214 | **213** | El informe daba un «~». La diferencia real es de una: `· in ${days} days` se cuenta como **una** plantilla, no como dos fragmentos |
| Ocurrencias en el fuente | — | **309** | El informe no lo daba |
| Ficheros de fuente afectados | — | **19** | De 37 no-test; los 13 de `src/api/` y los 5 de `src/theme/` están limpios |
| Cadenas ya en español | 10 | **10** | Coincide: `profile` ×7, `add-pet` ×2, `docs` ×1 |
| Puntos de test anclados a copy inglesa | 166 | **178** | El informe partía en «108 aserciones + 58 de tablas `it.each`». Este conteo es por **literal**: cada string o regex de un fichero de test que contiene una cadena de la tabla, descontando a mano (a) títulos de `describe`/`it`, (b) `className`/`testID`, (c) **10** literales que son mensajes de validación **del backend** y se quedan en inglés, (d) **4** de `auth-provider.test.tsx` que rotulan botones del propio arnés de test, no de la app, y (e) el directorio `src/api/__tests__/` entero, que no renderiza UI |
| Ficheros de test afectados | 17 | **19** | Aparecen `src/__tests__/legibility-classnames.test.ts` (escaneo de fuente) y `src/app/(tabs)/__tests__/screens.test.tsx` |
| Consultas por `testID` | 796 | **796** | Confirmado con el mismo grep |
| Llamadas `*ByText(`/`toHaveTextContent(` | — | **246** (102 + 144) | El informe daba 245 «sitios de consulta anclados a texto», una métrica distinta |
| Snapshots con copy | 0 | **0** | Confirmado: el único `.snap` es la ruta SVG de blobatar |
| Cadenas de usuario en `src/api/` | 0 | **0** | Confirmado: los 13 módulos devuelven uniones discriminadas por `kind` |

**La conclusión operativa del informe se mantiene**: la mecánica es pequeña
(literales inline, sin librería, sin snapshots, sin nada enterrado en la capa
de API) y lo caro es lo de alrededor —las specs aprobadas (§5) y el inglés que
sigue llegando del backend ([[requirements]] §Fuera de alcance 1)—.

### 1.3 Reparto por archivo (309 ocurrencias, 19 archivos)

| Archivo | Cadenas | R-id |
|---|---:|---|
| `src/screens/pairing/index.tsx` | 40 | R10 |
| `src/screens/add-pet/index.tsx` | 38 | R9 |
| `src/screens/add-reminder/index.tsx` | 22 | R8 |
| `src/screens/reminders/index.tsx` | 21 | R8 |
| `src/app/(tabs)/home.tsx` | 20 | R3 |
| `src/screens/profile/index.tsx` | 20 | R7 |
| `src/app/(tabs)/map.tsx` | 19 | R4 |
| `src/app/(tabs)/meal-schedule.tsx` | 19 | R6 |
| `src/app/(tabs)/weight-log.tsx` | 18 | R5 |
| `src/app/(tabs)/food.tsx` | 16 | R6 |
| `src/screens/reset-password/index.tsx` | 15 | R11 |
| `src/app/(auth)/register.tsx` | 14 | R1 |
| `src/app/(tabs)/health.tsx` | 13 | R5 |
| `src/app/(auth)/login.tsx` | 10 | R1 |
| `src/utils/reminder-meta.ts` | 7 | R8 |
| `src/screens/docs/index.tsx` | 6 | R7 |
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
españolas o de fixture.

---

## 2. La tabla de traducción (normativa)

> **Vista para revisión humana en [[copy-review]]**: las mismas 309 filas sin
> la columna `Ausencia` y numeradas, para leerlas de corrido. Esa hoja **no es
> normativa**; esta sí. Si el humano cambia una redacción allí, el `leader` la
> propaga aquí **antes** del handoff a Codex, y esta tabla sigue siendo la
> única fuente del literal.


### 2.0 Decisiones de traducción

- **D1 — Sin i18n, literales inline.** No se instala `i18next`, `react-intl`,
  `lingui` ni `expo-localization`, y no se crea un `es.ts` en `src/`. Razón: el
  objetivo es **unificar** el idioma, no montar infraestructura de traducción.
  Un catálogo para un solo idioma añade una indirección (`t('home.title')`) que
  no aporta nada, rompe los ~100 `getByText` que hoy leen la copy directamente
  y deja un fichero de claves que hay que gobernar. Si algún día hay un segundo
  idioma real, la infraestructura es su feature y el punto de partida —cadenas
  ya unificadas, la tabla de §2 como catálogo inicial— es mejor que el de hoy.
  **Si el revisor humano prefiere i18n ya, es una enmienda a esta spec antes
  del handoff, no una decisión de Codex.**
- **D2 — Manda la palabra del diseño.** Donde el Make ya da la palabra en
  español se usa **ésa**, no una traducción propia: `En línea` (`:358`),
  `Accesos rápidos` (`:396`), `Recordatorios` (`:427`), `Ver todos` (`:428`),
  `Nutrición` (`:758`, etiqueta de la pestaña `food`), `Objetivo diario`
  (`:607`), `kcal / día` (`:609`), `Comidas hoy` (`:626`), `Servido` (`:639`),
  `Recomendación IA` (`:645`), `Cambiar foto` (`:683`), `Horarios y porciones`
  (`:1465`), `Activos`/`Esta semana`/`Inactivos` (`:933-935`), `¡Próximo!`
  (`:955`), `Agregar recordatorio` (`:1013`), `Vacuna`/`Medicamento`/
  `Consulta`/`Otro` (`:979-983`), `Nueva mascota` (`:1145`), `Tipo de mascota`
  (`:1194`), `Raza`/`Sexo`/`Tamaño` (`:1210, 1222, 1238`), `Esterilizado/a`
  (`:1262`), `Guardar mascota` (`:1304`), `Peso (kg)` (`:1573`), `Fecha`
  (`:1582`), `Batería`/`Conexión` (`:1639-1640`), `Nombres`/`Apellidos`/
  `Correo electrónico`/`País` (`:309-313`), `Contraseña` (`:227`),
  `Iniciar sesión` (`:224`), `¿Olvidaste tu contraseña?` (`:231`),
  `Crear cuenta` (`:290`), `Recuperar contraseña` (`:258`),
  `Volver al inicio de sesión` (`:270`, sin la flecha: la app no dibuja una).
  Las referencias son a `specs/mobile-figma-polish/design-src/App.tsx`.
- **D3 — Trato de «tú», imperativo, sin punto final en botones y etiquetas.**
  Los mensajes de error y las frases completas sí llevan punto si ya lo
  llevaban en inglés; ninguna cadena gana o pierde puntuación por su cuenta.
- **D4 — Las unidades no se traducen.** `kg`, `km`, `km/h`, `kcal`, `g`, `%`,
  y la `h`/`m` de `fmtMinutes` (`1h 35m`) son símbolos. Sí se traduce `ago`,
  que es una palabra: `fmtAgo` pasa a `Justo ahora` / `hace <n> min` /
  `hace <n> h`. La asimetría `m` (duración) frente a `min` (tiempo
  transcurrido) es deliberada: `hace 2 m` no se lee.
- **D5 — Las máscaras de fecha se localizan, el parseo no.** El `placeholder`
  `YYYY-MM-DD` pasa a `AAAA-MM-DD` porque es texto de ayuda; el valor que
  `weight-log` envía sigue siendo ISO `YYYY-MM-DD` y `localTodayIso()` no se
  toca. Igual con `BC n/9` → `CC n/9` (condición corporal), que es etiqueta.
- **D6 — Los emoji no son copy.** Los 7 de `REMINDER_TYPE_META` y el `📄` de
  `docs` se quedan: #62 ya declaró que sustituirlos es feature aparte.
- **D7 — Género y número.** Los estados que califican a «la mascota» van en
  femenino donde el sujeto es la mascota (`Sin esterilizar`) y en masculino
  donde el sujeto es el dato (`Servido` para una comida, palabra del Make).
  No se inventan formas inclusivas: donde el Make escribe `Esterilizado/a`,
  se escribe `Esterilizado/a`.
- **D8 — Una sola reordenación de JSX.** `pairing/index.tsx:305` pasa de
  `{selectedPet.name}&apos;s collar is paired…` a
  `El collar de {selectedPet.name} está vinculado…` porque el genitivo sajón
  no tiene equivalente antepuesto en español y `Luna — collar vinculado` sería
  telegráfico. Es la única fila de la tabla que mueve una interpolación, y
  está declarada en [[requirements]] R10.

### 2.x — Cómo leer las tablas

`Línea` es la del commit base `da72e97`; si #64 entra antes, la línea se
desplaza y **la cadena sigue siendo el ancla**. `Ausencia` dice si el test de
R13 puede aseverar que la cadena inglesa **desapareció del fichero**: `sí` en
234 de las 274 parejas *(archivo, cadena)*; **`exc.`** en las 40 en que la
misma palabra sigue viva en el fichero como identificador (§3.2).


### §2.1 — R1 — grupo `(auth)` (29 cadenas)

**`mobile-pet-tracker/src/app/(auth)/login.tsx`** — 10

| Línea | Inglés (actual) | Español (normativo) | Ausencia |
|---|---|---|---|
| 31 | `Invalid credentials` | `Credenciales inválidas` | sí |
| 34 | `Cannot reach server` | `No se pudo conectar con el servidor` | sí |
| 41 | `Something went wrong` | `Algo salió mal` | sí |
| 44 | `Something went wrong` | `Algo salió mal` | sí |
| 66 | `Sign in` | `Iniciar sesión` | sí |
| 70 | `Email` | `Correo electrónico` | **exc.** |
| 83 | `Password` | `Contraseña` | **exc.** |
| 107 | `Sign in` | `Iniciar sesión` | sí |
| 117 | `Create account` | `Crear cuenta` | sí |
| 126 | `Forgot password?` | `¿Olvidaste tu contraseña?` | sí |

**`mobile-pet-tracker/src/app/(auth)/forgot.tsx`** — 5

| Línea | Inglés (actual) | Español (normativo) | Ausencia |
|---|---|---|---|
| 37 | `Forgot password` | `Recuperar contraseña` | sí |
| 40 | `Password recovery coming soon` | `La recuperación de contraseña estará disponible pronto` | sí |
| 44 | `Email` | `Correo electrónico` | sí |
| 60 | `Send recovery link` | `Enviar enlace de recuperación` | sí |
| 66 | `Back to sign in` | `Volver al inicio de sesión` | sí |

**`mobile-pet-tracker/src/app/(auth)/register.tsx`** — 14

| Línea | Inglés (actual) | Español (normativo) | Ausencia |
|---|---|---|---|
| 120 | `Email already registered` | `Ese correo ya está registrado` | sí |
| 129 | `Cannot reach server` | `No se pudo conectar con el servidor` | sí |
| 133 | `Something went wrong` | `Algo salió mal` | sí |
| 136 | `Something went wrong` | `Algo salió mal` | sí |
| 156 | `Create account` | `Crear cuenta` | sí |
| 161 | `First name` | `Nombres` | sí |
| 176 | `Last name` | `Apellidos` | sí |
| 188 | `Email` | `Correo electrónico` | **exc.** |
| 201 | `Phone` | `Teléfono` | **exc.** |
| 214 | `Password` | `Contraseña` | **exc.** |
| 228 | `Confirm password` | `Confirmar contraseña` | sí |
| 244 | `Country (2-letter code)` | `País (código de 2 letras)` | sí |
| 263 | `I accept the terms` | `Acepto los términos` | sí |
| 279 | `Create account` | `Crear cuenta` | sí |


### §2.2 — R2 — barra de pestañas (5 cadenas)

**`mobile-pet-tracker/src/components/floating-tab-bar.tsx`** — 5

| Línea | Inglés (actual) | Español (normativo) | Ausencia |
|---|---|---|---|
| 49 | `Home` | `Inicio` | **exc.** |
| 50 | `Map` | `Mapa` | **exc.** |
| 51 | `Health` | `Salud` | sí |
| 52 | `Food` | `Nutrición` | sí |
| 53 | `Profile` | `Perfil` | **exc.** |


### §2.3 — R3 — Home (20 cadenas)

**`mobile-pet-tracker/src/app/(tabs)/home.tsx`** — 20

| Línea | Inglés (actual) | Español (normativo) | Ausencia |
|---|---|---|---|
| 47 | `No location data yet` | `Sin datos de ubicación todavía` | sí |
| 48 | ``Last seen ${new Date(iso).toLocaleString()}`` | ``Última señal ${new Date(iso).toLocaleString()}`` | sí |
| 110 | `Home` | `Inicio` | **exc.** |
| 119 | `Something went wrong` | `Algo salió mal` | sí |
| 122 | `Retry` | `Reintentar` | sí |
| 129 | `No pets yet` | `Aún no tienes mascotas` | sí |
| 147 | `Something went wrong` | `Algo salió mal` | sí |
| 149 | `Retry` | `Reintentar` | sí |
| 197 | `Free` | `Sin collar` | sí |
| 199 | `Online` | `En línea` | sí |
| 200 | `Offline` | `Sin conexión` | sí |
| 233 | `No collar — health only` | `Sin collar — solo salud` | sí |
| 245 | `Pair a collar` | `Vincular collar` | sí |
| 256 | `Today&apos;s Summary` | `Resumen de hoy` | sí |
| 265 | `Activity tracking requires a collar` | `La actividad requiere un collar` | sí |
| 273 | `Could not load activity` | `No se pudo cargar la actividad` | sí |
| 289 | `Activity` | `Actividad` | **exc.** |
| 301 | `Sleep` | `Descanso` | sí |
| 313 | `Distance` | `Distancia` | sí |
| 332 | `View on map` | `Ver en el mapa` | sí |


### §2.4 — R4 — Map (19 cadenas)

**`mobile-pet-tracker/src/app/(tabs)/map.tsx`** — 19

| Línea | Inglés (actual) | Español (normativo) | Ausencia |
|---|---|---|---|
| 60 | `Just now` | `Justo ahora` | sí |
| 61 | ``${Math.floor(seconds / 60)}m ago`` | ``hace ${Math.floor(seconds / 60)} min`` | sí |
| 62 | ``${Math.floor(seconds / 3600)}h ago`` | ``hace ${Math.floor(seconds / 3600)} h`` | sí |
| 196 | `No signal` | `Sin señal` | sí |
| 198 | `Live` | `En vivo` | **exc.** |
| 199 | `Stale` | `Desactualizado` | sí |
| 210 | `Something went wrong` | `Algo salió mal` | sí |
| 213 | `Retry` | `Reintentar` | sí |
| 221 | `No pets yet` | `Aún no tienes mascotas` | sí |
| 229 | `Live tracking requires a collar` | `El rastreo en vivo requiere un collar` | sí |
| 240 | `Something went wrong` | `Algo salió mal` | sí |
| 243 | `Retry` | `Reintentar` | sí |
| 269 | `No location data yet` | `Sin datos de ubicación todavía` | sí |
| 299 | `Speed` | `Velocidad` | **exc.** |
| 315 | `Distance` | `Distancia` | sí |
| 333 | `Updated` | `Actualizado` | sí |
| 366 | `Deactivate Lost Mode` | `Desactivar modo perdido` | sí |
| 367 | `Activate Lost Mode` | `Activar modo perdido` | sí |
| 376 | `Could not update Lost Mode` | `No se pudo cambiar el modo perdido` | sí |


### §2.5 — R5 — Health, log de peso y gráfica (32 cadenas)

**`mobile-pet-tracker/src/app/(tabs)/health.tsx`** — 13

| Línea | Inglés (actual) | Español (normativo) | Ausencia |
|---|---|---|---|
| 91 | `Health` | `Salud` | **exc.** |
| 100 | `Something went wrong` | `Algo salió mal` | sí |
| 103 | `Retry` | `Reintentar` | sí |
| 110 | `No pets yet` | `Aún no tienes mascotas` | sí |
| 127 | `Vaccines` | `Vacunas` | **exc.** |
| 151 | `Next due` | `Próxima dosis` | sí |
| 165 | `No vaccines yet` | `Aún no hay vacunas` | sí |
| 173 | `Could not load vaccines` | `No se pudieron cargar las vacunas` | sí |
| 176 | `Retry` | `Reintentar` | sí |
| 217 | `Weight` | `Peso` | **exc.** |
| 243 | `No weight entries yet` | `Aún no hay registros de peso` | sí |
| 249 | `Could not load weight` | `No se pudo cargar el peso` | sí |
| 261 | `Weight log` | `Registro de peso` | sí |

**`mobile-pet-tracker/src/app/(tabs)/weight-log.tsx`** — 18

| Línea | Inglés (actual) | Español (normativo) | Ausencia |
|---|---|---|---|
| 72 | `Enter a valid weight` | `Introduce un peso válido` | sí |
| 99 | `Only the owner can log weights` | `Solo el dueño puede registrar pesos` | sí |
| 102 | `Cannot reach server` | `No se pudo conectar con el servidor` | sí |
| 109 | `Something went wrong` | `Algo salió mal` | sí |
| 112 | `Something went wrong` | `Algo salió mal` | sí |
| 133 | `Back to health` | `Volver a Salud` | sí |
| 141 | `Weight log` | `Registro de peso` | sí |
| 154 | `Weight` | `Peso` | **exc.** |
| 160 | `Weight (kg)` | `Peso (kg)` | sí |
| 167 | `Measured at` | `Fecha de medición` | sí |
| 172 | `YYYY-MM-DD` | `AAAA-MM-DD` | sí |
| 179 | `Body condition` | `Condición corporal` | **exc.** |
| 185 | `Body condition 1-9 (optional)` | `Condición corporal 1-9 (opcional)` | sí |
| 204 | `Log weight` | `Registrar peso` | sí |
| 220 | `Something went wrong` | `Algo salió mal` | sí |
| 223 | `Retry` | `Reintentar` | sí |
| 230 | `No weight entries yet` | `Aún no hay registros de peso` | sí |
| 284 | `BC {entry.bodyCondition}/9` | `CC {entry.bodyCondition}/9` | sí |

**`mobile-pet-tracker/src/components/weight-chart.tsx`** — 1

| Línea | Inglés (actual) | Español (normativo) | Ausencia |
|---|---|---|---|
| 20 | `Not enough data yet` | `Aún no hay datos suficientes` | sí |


### §2.6 — R6 — Food y Meal schedule (35 cadenas)

**`mobile-pet-tracker/src/app/(tabs)/food.tsx`** — 16

| Línea | Inglés (actual) | Español (normativo) | Ausencia |
|---|---|---|---|
| 80 | `Food` | `Nutrición` | **exc.** |
| 91 | `Something went wrong` | `Algo salió mal` | sí |
| 94 | `Retry` | `Reintentar` | sí |
| 101 | `No pets yet` | `Aún no tienes mascotas` | sí |
| 144 | `Daily target` | `Objetivo diario` | sí |
| 150 | `kcal / day` | `kcal / día` | sí |
| 156 | `g / day` | `g / día` | sí |
| 174 | `Meals today` | `Comidas hoy` | sí |
| 224 | `Pending` | `Pendiente` | sí |
| 224 | `Served` | `Servido` | sí |
| 259 | `AI recommendation` | `Recomendación IA` | sí |
| 272 | `No meal plan yet` | `Aún no hay plan de alimentación` | sí |
| 281 | `Could not load meal plan` | `No se pudo cargar el plan de alimentación` | sí |
| 284 | `Retry` | `Reintentar` | sí |
| 296 | `Meal schedule` | `Horario de comidas` | sí |
| 299 | `View nutrition profile and times` | `Ver el perfil nutricional y los horarios` | sí |

**`mobile-pet-tracker/src/app/(tabs)/meal-schedule.tsx`** — 19

| Línea | Inglés (actual) | Español (normativo) | Ausencia |
|---|---|---|---|
| 83 | `Only the owner can generate the plan` | `Solo el dueño puede generar el plan` | sí |
| 87 | `Create a nutrition profile first` | `Primero crea un perfil nutricional` | sí |
| 89 | `Register a weight first` | `Primero registra un peso` | sí |
| 91 | `Something went wrong` | `Algo salió mal` | sí |
| 95 | `Cannot reach server` | `No se pudo conectar con el servidor` | sí |
| 102 | `Something went wrong` | `Algo salió mal` | sí |
| 105 | `Something went wrong` | `Algo salió mal` | sí |
| 126 | `Back to food` | `Volver a Nutrición` | sí |
| 135 | `Meal schedule` | `Horario de comidas` | sí |
| 160 | `Something went wrong` | `Algo salió mal` | sí |
| 163 | `Retry` | `Reintentar` | sí |
| 178 | `Daily target` | `Objetivo diario` | sí |
| 184 | `g / day` | `g / día` | sí |
| 190 | `meals / day` | `comidas / día` | sí |
| 198 | `Times and portions` | `Horarios y porciones` | sí |
| 232 | `No meal plan yet` | `Aún no hay plan de alimentación` | sí |
| 250 | `Generate plan` | `Generar plan` | sí |
| 269 | `Nutrition profile` | `Perfil nutricional` | sí |
| 297 | `No nutrition profile yet` | `Aún no hay perfil nutricional` | sí |


### §2.7 — R7 — Profile y Documentos (26 cadenas)

**`mobile-pet-tracker/src/screens/profile/index.tsx`** — 20

| Línea | Inglés (actual) | Español (normativo) | Ausencia |
|---|---|---|---|
| 85 | `Sterilized` | `Esterilizado` | sí |
| 86 | `Not sterilized` | `Sin esterilizar` | sí |
| 87 | ``${pet.ageMonths} months`` | ``${pet.ageMonths} meses`` | sí |
| 157 | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` | sí |
| 174 | `Could not upload photo` | `No se pudo subir la foto` | sí |
| 186 | `Could not upload photo` | `No se pudo subir la foto` | sí |
| 192 | `Could not upload photo` | `No se pudo subir la foto` | sí |
| 211 | `Profile` | `Perfil` | **exc.** |
| 219 | `Add pet` | `Añadir mascota` | sí |
| 234 | `No pets yet` | `Aún no tienes mascotas` | sí |
| 240 | `Could not load pets` | `No se pudieron cargar las mascotas` | sí |
| 253 | `Could not load pet profile` | `No se pudo cargar el perfil de la mascota` | sí |
| 255 | `Retry` | `Reintentar` | sí |
| 272 | `Change photo` | `Cambiar foto` | sí |
| 334 | `Reminders` | `Recordatorios` | sí |
| 340 | `Account` | `Cuenta` | **exc.** |
| 355 | `Account unavailable` | `Cuenta no disponible` | sí |
| 365 | `Use dark theme` | `Usar tema oscuro` | sí |
| 365 | `Use light theme` | `Usar tema claro` | sí |
| 376 | `Sign out` | `Cerrar sesión` | sí |

**`mobile-pet-tracker/src/screens/docs/index.tsx`** — 6

| Línea | Inglés (actual) | Español (normativo) | Ausencia |
|---|---|---|---|
| 68 | `Back to profile` | `Volver a Perfil` | sí |
| 85 | `Pet` | `Mascota` | **exc.** |
| 101 | `No documents yet` | `Aún no hay documentos` | sí |
| 103 | `Medical documents will appear here.` | `Los documentos médicos aparecerán aquí.` | sí |
| 116 | `Could not load documents` | `No se pudieron cargar los documentos` | sí |
| 118 | `Retry` | `Reintentar` | sí |


### §2.8 — R8 — Recordatorios y su alta (50 cadenas)

**`mobile-pet-tracker/src/screens/reminders/index.tsx`** — 21

| Línea | Inglés (actual) | Español (normativo) | Ausencia |
|---|---|---|---|
| 87 | `Only the owner can delete` | `Solo el dueño puede eliminar` | sí |
| 90 | `Cannot reach server` | `No se pudo conectar con el servidor` | sí |
| 97 | `Something went wrong` | `Algo salió mal` | sí |
| 100 | `Something went wrong` | `Algo salió mal` | sí |
| 136 | `Reminders` | `Recordatorios` | **exc.** |
| 143 | `New` | `Nuevo` | sí |
| 171 | `Something went wrong` | `Algo salió mal` | sí |
| 174 | `Retry` | `Reintentar` | sí |
| 182 | `No reminders yet` | `Aún no hay recordatorios` | sí |
| 211 | `Active` | `Activos` | sí |
| 236 | `This week` | `Esta semana` | sí |
| 253 | `Inactive` | `Inactivos` | sí |
| 285 | `Upcoming!` | `¡Próximo!` | sí |
| 301 | `Cancelled` | `Cancelado` | sí |
| 301 | `Sent` | `Enviado` | sí |
| 305 | ``· in ${days} days`` | ``· en ${days} días`` | sí |
| 319 | `Delete` | `Eliminar` | **exc.** |
| 342 | `Delete reminder?` | `¿Eliminar recordatorio?` | sí |
| 351 | `This action cannot be undone.` | `Esta acción no se puede deshacer.` | sí |
| 361 | `Delete` | `Eliminar` | **exc.** |
| 370 | `Cancel` | `Cancelar` | **exc.** |

**`mobile-pet-tracker/src/utils/reminder-meta.ts`** — 7

| Línea | Inglés (actual) | Español (normativo) | Ausencia |
|---|---|---|---|
| 7 | `Vaccine` | `Vacuna` | sí |
| 8 | `Deworming` | `Desparasitación` | sí |
| 9 | `Medication` | `Medicamento` | sí |
| 10 | `Appointment` | `Consulta` | sí |
| 11 | `Weight` | `Peso` | sí |
| 12 | `Food` | `Comida` | sí |
| 13 | `Other` | `Otro` | sí |

**`mobile-pet-tracker/src/screens/add-reminder/index.tsx`** — 22

| Línea | Inglés (actual) | Español (normativo) | Ausencia |
|---|---|---|---|
| 21 | `Same day` | `El mismo día` | sí |
| 22 | `1 day before` | `1 día antes` | sí |
| 23 | `3 days before` | `3 días antes` | sí |
| 24 | `7 days before` | `7 días antes` | sí |
| 56 | `Title is required` | `El título es obligatorio` | sí |
| 60 | `Pick a date` | `Elige una fecha` | sí |
| 66 | `Date must be in the future` | `La fecha debe ser futura` | sí |
| 86 | `Only the owner can create reminders` | `Solo el dueño puede crear recordatorios` | sí |
| 89 | `Date must be in the future` | `La fecha debe ser futura` | sí |
| 92 | `Cannot reach server` | `No se pudo conectar con el servidor` | sí |
| 99 | `Something went wrong` | `Algo salió mal` | sí |
| 102 | `Something went wrong` | `Algo salió mal` | sí |
| 122 | `Back to reminders` | `Volver a Recordatorios` | sí |
| 132 | `Add reminder` | `Agregar recordatorio` | sí |
| 138 | `Type` | `Tipo` | **exc.** |
| 169 | `Title` | `Título` | **exc.** |
| 176 | `Reminder title` | `Título del recordatorio` | sí |
| 186 | `Date` | `Fecha` | **exc.** |
| 196 | `Select a date` | `Elige una fecha` | sí |
| 202 | `Time` | `Hora` | **exc.** |
| 256 | `Alert` | `Aviso` | sí |
| 292 | `Save reminder` | `Guardar recordatorio` | sí |


### §2.9 — R9 — Alta de mascota (38 cadenas)

**`mobile-pet-tracker/src/screens/add-pet/index.tsx`** — 38

| Línea | Inglés (actual) | Español (normativo) | Ausencia |
|---|---|---|---|
| 114 | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` | sí |
| 148 | `Name is required` | `El nombre es obligatorio` | sí |
| 155 | `Choose a birth date` | `Elige una fecha de nacimiento` | sí |
| 162 | `Enter an age from 0 to 480 months` | `Introduce una edad de 0 a 480 meses` | sí |
| 189 | `Pet created, but the photo could not be uploaded` | `Se creó la mascota, pero no se pudo subir la foto` | sí |
| 198 | `Check the pet details` | `Revisa los datos de la mascota` | sí |
| 201 | `You cannot create a pet` | `No puedes crear una mascota` | sí |
| 204 | `Cannot reach server` | `No se pudo conectar con el servidor` | sí |
| 208 | `Something went wrong` | `Algo salió mal` | sí |
| 211 | `Something went wrong` | `Algo salió mal` | sí |
| 231 | `Back to profile` | `Volver a Perfil` | sí |
| 240 | `Add pet` | `Nueva mascota` | sí |
| 245 | `Pet` | `Mascota` | **exc.** |
| 250 | `Avatar preview` | `Vista previa del avatar` | sí |
| 259 | `Choose photo` | `Elegir foto` | sí |
| 272 | `Species` | `Tipo de mascota` | **exc.** |
| 289 | `Cat` | `Gato` | sí |
| 289 | `Dog` | `Perro` | sí |
| 297 | `Name` | `Nombre` | **exc.** |
| 303 | `Pet name` | `Nombre de la mascota` | sí |
| 311 | `Breed` | `Raza` | **exc.** |
| 317 | `Optional` | `Opcional` | **exc.** |
| 325 | `Sex` | `Sexo` | **exc.** |
| 327 | `Female` | `Hembra` | sí |
| 328 | `Male` | `Macho` | sí |
| 333 | `Size` | `Tamaño` | **exc.** |
| 335 | `Small` | `Pequeño` | sí |
| 336 | `Medium` | `Mediano` | sí |
| 337 | `Large` | `Grande` | sí |
| 344 | `Age` | `Edad` | **exc.** |
| 347 | `Birth date` | `Fecha de nacimiento` | sí |
| 348 | `Approx. months` | `Meses aprox.` | sí |
| 376 | `Select a birth date` | `Elige una fecha de nacimiento` | sí |
| 386 | `Months` | `Meses` | **exc.** |
| 412 | `Sterilized` | `Esterilizado/a` | **exc.** |
| 414 | `Yes` | `Sí` | sí |
| 426 | `Optional` | `Opcional` | **exc.** |
| 440 | `Save pet` | `Guardar mascota` | sí |


### §2.10 — R10 — Emparejado del collar (40 cadenas)

**`mobile-pet-tracker/src/screens/pairing/index.tsx`** — 40

| Línea | Inglés (actual) | Español (normativo) | Ausencia |
|---|---|---|---|
| 126 | `Invalid activation code. Check the code printed on the box.` | `Código de activación no válido. Revisa el código impreso en la caja.` | sí |
| 130 | `This collar is already paired to another pet.` | `Este collar ya está vinculado a otra mascota.` | sí |
| 133 | `This pet already has a collar. Unpair it first.` | `Esta mascota ya tiene un collar. Desvincúlalo primero.` | sí |
| 137 | `This collar has no active plan. Contact support to activate it.` | `Este collar no tiene un plan activo. Contacta con soporte para activarlo.` | sí |
| 141 | `Only the owner can pair a collar.` | `Solo el dueño puede vincular un collar.` | sí |
| 147 | `Cannot reach server` | `No se pudo conectar con el servidor` | sí |
| 151 | `Something went wrong` | `Algo salió mal` | sí |
| 155 | `Something went wrong` | `Algo salió mal` | sí |
| 189 | `Only the owner can unpair the collar.` | `Solo el dueño puede desvincular el collar.` | sí |
| 195 | `Cannot reach server` | `No se pudo conectar con el servidor` | sí |
| 199 | `Something went wrong` | `Algo salió mal` | sí |
| 203 | `Something went wrong` | `Algo salió mal` | sí |
| 212 | `Unpair collar?` | `¿Desvincular collar?` | sí |
| 213 | `Location history stays, but live tracking stops until you pair a collar again.` | `El historial de ubicaciones se conserva, pero el rastreo en vivo se detiene hasta que vincules otro collar.` | sí |
| 215 | `Cancel` | `Cancelar` | sí |
| 217 | `Unpair` | `Desvincular` | **exc.** |
| 238 | `Back` | `Volver` | sí |
| 267 | `Something went wrong` | `Algo salió mal` | sí |
| 270 | `Retry` | `Reintentar` | sí |
| 277 | `Add a pet first` | `Primero añade una mascota` | sí |
| 302 | `Tracker is ready` | `El collar está listo` | sí |
| 305 | `{selectedPet.name}&apos;s collar is paired. GPS tracking is on.` | `El collar de {selectedPet.name} está vinculado. El rastreo GPS está activo.` | sí |
| 312 | `Model` | `Modelo` | sí |
| 330 | `View on map` | `Ver en el mapa` | sí |
| 340 | `Done` | `Listo` | sí |
| 348 | `Pair collar` | `Vincular collar` | sí |
| 357 | `Free plan — health only. Pair a collar with an active plan to see the map.` | `Plan gratuito — solo salud. Vincula un collar con plan activo para ver el mapa.` | sí |
| 364 | `Activation code` | `Código de activación` | sí |
| 377 | `Printed on the collar box` | `Impreso en la caja del collar` | sí |
| 388 | `Pair collar` | `Vincular collar` | sí |
| 397 | `GPS device` | `Dispositivo GPS` | sí |
| 403 | `Model` | `Modelo` | sí |
| 408 | `Battery` | `Batería` | sí |
| 417 | `Connection` | `Conexión` | sí |
| 422 | `Last message` | `Último mensaje` | sí |
| 429 | `No messages yet` | `Sin mensajes todavía` | sí |
| 453 | `GPS tracking active` | `Rastreo GPS activo` | sí |
| 461 | `Free plan — health only. This collar has no active plan.` | `Plan gratuito — solo salud. Este collar no tiene plan activo.` | sí |
| 468 | `Plan status unavailable` | `Estado del plan no disponible` | sí |
| 479 | `Unpair collar` | `Desvincular collar` | **exc.** |


### §2.11 — R11 — Restablecer contraseña (15 cadenas)

**`mobile-pet-tracker/src/screens/reset-password/index.tsx`** — 15

| Línea | Inglés (actual) | Español (normativo) | Ausencia |
|---|---|---|---|
| 36 | `Reset link is invalid or already used. Request a new one.` | `El enlace no es válido o ya se usó. Solicita uno nuevo.` | sí |
| 40 | `Reset link expired. Request a new one.` | `El enlace caducó. Solicita uno nuevo.` | sí |
| 46 | `Cannot reach server` | `No se pudo conectar con el servidor` | sí |
| 50 | `Something went wrong` | `Algo salió mal` | sí |
| 53 | `Something went wrong` | `Algo salió mal` | sí |
| 77 | `Reset password` | `Restablecer contraseña` | sí |
| 84 | `This reset link is incomplete. Open the link from your email again.` | `Este enlace está incompleto. Ábrelo de nuevo desde tu correo.` | sí |
| 88 | `Back to sign in` | `Volver al inicio de sesión` | sí |
| 113 | `Reset password` | `Restablecer contraseña` | sí |
| 120 | `Password updated` | `Contraseña actualizada` | sí |
| 128 | `Back to sign in` | `Volver al inicio de sesión` | sí |
| 151 | `Reset password` | `Restablecer contraseña` | sí |
| 156 | `New password` | `Nueva contraseña` | sí |
| 171 | `Confirm new password` | `Confirmar nueva contraseña` | sí |
| 197 | `Update password` | `Actualizar contraseña` | sí |


**Suma de control**: 29 + 5 + 20 + 19 + 32 + 35 + 26 + 50 + 38 + 40 + 15 = **309** ocurrencias, **213** cadenas inglesas distintas, **19** archivos.

---

## 3. Los tests

### 3.1 El fixture y el test mecánico

Dos ficheros nuevos, ambos **del lado de test** (viven en `__tests__/`, no
entran en el bundle — esto es lo que hace innecesaria una librería de i18n):

- `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` — la tabla de §2
  transcrita como dato:

  ```ts
  export type CopyRow = {
    file: string;   // ruta relativa a mobile-pet-tracker/src/
    en: string;     // literal inglés actual
    es: string;     // literal español normativo
    absent: boolean;// false ⇒ pareja (file, en) de la lista de excepciones §3.2
  };
  export const R1_AUTH: CopyRow[] = [ /* 29 filas */ ];
  export const R2_TABS: CopyRow[] = [ /* 5 */ ];
  // … R3_HOME 20, R4_MAP 19, R5_HEALTH 32, R6_FOOD 35, R7_PROFILE 26,
  //    R8_REMINDERS 50, R9_ADD_PET 38, R10_PAIRING 40, R11_RESET 15
  export const ALL_ROWS: CopyRow[] = [...]; // 309
  ```

  Las filas se copian **literalmente** de §2. `absent` es `false` exactamente
  para las 40 parejas de §3.2 y para ninguna más.

- `mobile-pet-tracker/src/__tests__/ui-language.test.ts` — un `describe` por
  R-id. El cuerpo es el mismo para todos, así que se extrae a un helper local:

  ```ts
  const norm = (s: string) => s.replace(/\s+/g, ' ');
  function checkRows(rows: CopyRow[]) {
    for (const row of rows) {
      const src = norm(readFileSync(join(SRC, row.file), 'utf8'));
      expect(src).toContain(norm(row.es));
      if (row.absent) expect(src).not.toContain(norm(row.en));
    }
  }
  ```

  La normalización de espacios es imprescindible: **7** cadenas ocupan dos
  líneas en el JSX (p. ej. `pairing/index.tsx:357-358`), y sin normalizar el
  `toContain` fallaría por el salto de línea y la indentación.

  Patrón ya usado en el repo para escanear fuente:
  `src/__tests__/design-drift.test.ts`,
  `src/__tests__/consistency-classnames.test.ts`,
  `src/__tests__/legibility-classnames.test.ts` y
  `src/__tests__/hosting-artifacts.test.ts` (este último ya asevera sobre
  archivos de fuera de `mobile-pet-tracker/`, que es lo que necesita R14).

**Por qué este test y no un detector de inglés.** Un detector genérico
—«ninguna cadena visible parece inglesa»— es un clasificador de idioma con
falsos positivos garantizados (`GPS`, `ESN`, `kcal`, `Microchip`, nombres de
mascota). El escaneo contra una tabla cerrada es determinista, se rehace en un
comando, y falla exactamente cuando debe: si alguien deja una cadena sin
traducir, o si alguien reintroduce una inglesa. Su límite —y hay que decirlo—
es que **no detecta copy inglesa nueva** que nadie haya metido en la tabla; de
eso se encarga R15 (la regla escrita en la carta) y el gate humano de la spec
que la introduzca.

### 3.2 Las 40 excepciones de la comprobación de ausencia

Parejas *(archivo, cadena inglesa)* donde la palabra sobrevive en el fichero
por motivos que **no son copy**: un `className`, un import de icono, un nombre
de componente, una clave de objeto o un `testID`. `copy` es cuántas veces
aparece como texto visible; `total`, cuántas veces aparece en el fichero.

| Archivo | Cadena | copy | total | Por qué sobrevive |
|---|---|---:|---:|---|
| `src/app/(auth)/login.tsx` | `Email` | 1 | 3 | `keyboardType="email-address"`, `testID="login-email"` |
| `src/app/(auth)/login.tsx` | `Password` | 1 | 3 | `setPassword`, `testID="login-password"` |
| `src/app/(auth)/register.tsx` | `Email` | 1 | 4 | `setEmail`, `testID`, `keyboardType` |
| `src/app/(auth)/register.tsx` | `Password` | 1 | 5 | `passwordConfirmation`, `setPassword`, `testID` |
| `src/app/(auth)/register.tsx` | `Phone` | 1 | 3 | `setPhone`, `keyboardType="phone-pad"` |
| `src/app/(tabs)/food.tsx` | `Food` | 1 | 2 | `FoodScreen` |
| `src/app/(tabs)/health.tsx` | `Health` | 1 | 2 | `HealthScreen` |
| `src/app/(tabs)/health.tsx` | `Vaccines` | 1 | 3 | `listVaccines`, `vaccines-*` |
| `src/app/(tabs)/health.tsx` | `Weight` | 1 | 4 | `listWeights`, `weight-*`, `fmtVariation` |
| `src/app/(tabs)/home.tsx` | `Activity` | 1 | 4 | `getDailyActivity`, `activeMinutes` |
| `src/app/(tabs)/home.tsx` | `Home` | 1 | 2 | `HomeScreen` |
| `src/app/(tabs)/map.tsx` | `Live` | 1 | 2 | `isLastError` / `LastPositionState` |
| `src/app/(tabs)/map.tsx` | `Speed` | 1 | 5 | `fmtSpeed`, `speedKmh`, `stat-speed` |
| `src/app/(tabs)/weight-log.tsx` | `Body condition` | 1 | 2 | el `placeholder` largo de la misma pantalla |
| `src/app/(tabs)/weight-log.tsx` | `Weight` | 1 | 19 | `WeightChart`, `weightKg`, `createWeight`, `WeightsState`… |
| `src/components/floating-tab-bar.tsx` | `Home` | 1 | 3 | icono `Home` de `reicon-react-native` |
| `src/components/floating-tab-bar.tsx` | `Map` | 1 | 3 | icono `Map` |
| `src/components/floating-tab-bar.tsx` | `Profile` | 1 | 3 | icono `Profile` |
| `src/screens/add-pet/index.tsx` | `Age` | 1 | 13 | `AgeMode`, `ageMode`, `approxAgeMonths`… |
| `src/screens/add-pet/index.tsx` | `Breed` | 1 | 6 | `setBreed`, `breed-input`, `trimmedBreed` |
| `src/screens/add-pet/index.tsx` | `Months` | 1 | 9 | `approxAgeMonths` |
| `src/screens/add-pet/index.tsx` | `Name` | 1 | 47 | `className`, `setName`, `trimmedName`… |
| `src/screens/add-pet/index.tsx` | `Optional` | 2 | 10 | `OptionalChip` |
| `src/screens/add-pet/index.tsx` | `Pet` | 1 | 20 | `AddPetScreen`, `createPet`, `PetAvatar`, `PetSize`… |
| `src/screens/add-pet/index.tsx` | `Sex` | 1 | 6 | `setSex`, `sex-female` |
| `src/screens/add-pet/index.tsx` | `Size` | 1 | 7 | `PetSize`, `setSize`, `size-*` |
| `src/screens/add-pet/index.tsx` | `Species` | 1 | 5 | `setSpecies`, `species-*` |
| `src/screens/add-pet/index.tsx` | `Sterilized` | 1 | 4 | `setSterilized`, `sterilized-*` |
| `src/screens/add-reminder/index.tsx` | `Date` | 1 | 26 | `setDate`, `DateTimePicker`, `dueAt`… |
| `src/screens/add-reminder/index.tsx` | `Time` | 1 | 20 | `setTime`, `showTimePicker`, `combineDateAndTime` |
| `src/screens/add-reminder/index.tsx` | `Title` | 1 | 7 | `setTitle`, `title-input`, `trimmedTitle` |
| `src/screens/add-reminder/index.tsx` | `Type` | 1 | 11 | `ReminderType`, `type-chip-*` |
| `src/screens/docs/index.tsx` | `Pet` | 1 | 7 | `getPet`, `listPetDocs`, `PetDocument`, `petName` |
| `src/screens/pairing/index.tsx` | `Unpair` | 1 | 4 | `device-unpair`, el propio `Unpair collar` |
| `src/screens/pairing/index.tsx` | `Unpair collar` | 1 | 2 | `Unpair collar?` del `Alert` |
| `src/screens/profile/index.tsx` | `Account` | 1 | 2 | `me-card` / `Account unavailable` |
| `src/screens/profile/index.tsx` | `Profile` | 1 | 5 | `ProfileScreen`, `PetProfile`, `profile-*` |
| `src/screens/reminders/index.tsx` | `Cancel` | 1 | 2 | `Cancelled` del estado |
| `src/screens/reminders/index.tsx` | `Delete` | 2 | 15 | `deleteReminder`, `deleteCandidate`, `reminders-delete-*` |
| `src/screens/reminders/index.tsx` | `Reminders` | 1 | 13 | `RemindersScreen`, `listReminders`, `refetchReminders` |

**Esta lista no puede crecer sin volver al gate.** Si al traducir aparece una
pareja nueva que no se puede aseverar ausente, es señal de que la cadena
inglesa quedó viva en algún sitio: hay que mirarla, no añadirla a la lista.

### 3.3 Los 6 `testID` nuevos de R12 (única adición de `testID`)

Los `describe('#62 R5: el título de card usa un único tratamiento')` localizan
un nodo **por su texto** para después aseverar su `props.className`. El texto
ahí es un *localizador*, no lo que se prueba: anclarlo a la copy es
exactamente el acoplamiento que hace cara esta feature —cambiar una palabra
rompe un test de estilo que no tiene nada que ver con las palabras—. Se
desacopla de una vez.

| Archivo de fuente | Línea | Nodo | `testID` nuevo | Test que lo consume |
|---|---:|---|---|---|
| `src/app/(tabs)/home.tsx` | 255 | `<Text>` `Today's Summary` → `Resumen de hoy` | `summary-card-title` | `home.test.tsx:771` |
| `src/app/(tabs)/health.tsx` | 217 | `<Text>` `Weight` → `Peso` | `weight-card-title` | `health.test.tsx:612` |
| `src/app/(tabs)/food.tsx` | 174 | `<Text>` `Meals today` → `Comidas hoy` | `food-meals-title` | `food.test.tsx:521` |
| `src/app/(tabs)/food.tsx` | 259 | `<Text>` `AI recommendation` → `Recomendación IA` | `food-ai-title` | `food.test.tsx:521` |
| `src/app/(tabs)/food.tsx` | 296 | `<Text>` `Meal schedule` → `Horario de comidas` | `meal-schedule-link-title` | `food.test.tsx:521` |
| `src/app/(tabs)/meal-schedule.tsx` | 269 | `<Text>` `Nutrition profile` → `Perfil nutricional` | `nutrition-profile-title` | `meal-schedule.test.tsx:460` |

Cambios en los tests, exactamente:

- `home.test.tsx:771`, `health.test.tsx:612`, `meal-schedule.test.tsx:460`:
  `findByText('…')` → `findByTestId('<nuevo id>')`. La aserción
  `.props.className).toBe('text-base font-bold text-foreground')` **no cambia
  ni un byte**.
- `food.test.tsx:521-522`: la tabla `it.each(['Meals today', 'AI
  recommendation', 'Meal schedule'])` pasa a
  `it.each(['food-meals-title', 'food-ai-title', 'meal-schedule-link-title'])`
  y `findByText(title)` a `findByTestId(testID)`; el título del `it` pasa de
  `'aplica la receta canónica a %s'` a `'aplica la receta canónica al título %s'`.

**Y no se pierde ni una aserción de copy.** De las 6 cadenas, 4 siguen
asertadas en otro sitio (`Resumen de hoy` en `home.test.tsx:453`, `Peso` en
`health.test.tsx:460`, `Recomendación IA` en `food.test.tsx:426`,
`Perfil nutricional` en `meal-schedule.test.tsx:240`). Las **2** que se
quedarían sin cubrir —`Comidas hoy` y `Horario de comidas`— se reponen con dos
`getByText` en el test que ya renderiza el plan de `food`. Neto: la suite pasa
de **246** llamadas de texto a **244** (−4 llamadas migradas, +2 nuevas) y de
**796** consultas por `testID` a **800**. La suite **no se debilita**: pierde 4
localizadores frágiles y gana 2 aserciones de copy.

**Ningún otro ancla se migra a `testID`.** Las otras 172 comprueban *el texto
que se muestra*, que es justo lo que esta feature cambia y lo que hay que
seguir probando. Convertirlas a `testID` sería debilitar la suite, no
desacoplarla: se prohíbe expresamente en el invariante de [[requirements]].

### 3.4 Los 6 títulos de test que citan copy y hay que actualizar

No son aserciones, pero quedarían mintiendo:

| Fichero | Línea | Actual | Nuevo |
|---|---:|---|---|
| `src/app/(tabs)/__tests__/health.test.tsx` | 609 | `aplica la receta canónica a Weight` | `aplica la receta canónica a Peso` |
| `src/app/(tabs)/__tests__/map.test.tsx` | 919 | `muestra mensaje y Retry cuando last devuelve error` | `…y Reintentar…` |
| `src/app/(tabs)/__tests__/map.test.tsx` | 935 | `Retry llama al refetch de last y recupera el mapa` | `Reintentar llama al refetch…` |
| `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 450 | `aplica la receta canónica a Nutrition profile` | `…a Perfil nutricional` |
| `src/app/(tabs)/__tests__/food.test.tsx` | 522 | `aplica la receta canónica a %s` | `aplica la receta canónica al título %s` |
| `src/screens/pairing/index.test.tsx` | 413 | `R7: tras el 201 muestra "Tracker is ready" …` | `… muestra "El collar está listo" …` |

Los **otros ~44 títulos** en inglés o que citan copy de refilón se quedan como
están: [[requirements]] §Fuera de alcance 9.

---

## 4. Archivos afectados

Todo es capa de **presentación** de la app móvil. Ni `domain`, ni
`application`, ni `infrastructure` del backend: `backend-pet-tracker/` **no se
abre en ningún commit** de esta feature.

**Fuente (19, solo literales visibles)** — los de §1.3.

**Tests que se actualizan (19)** — los de §1.4.

**Tests nuevos (2)**
- `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` (fixture, §3.1)
- `mobile-pet-tracker/src/__tests__/ui-language.test.ts` (R1–R11, R13–R15)

**Docs y specs (10)**
- `docs/ui-guidelines.md` — R15, §5.3
- las 9 specs aprobadas de §5.1 — R14, §5.2

**No se tocan**: `mobile-pet-tracker/src/theme/` (incluido `global.css`),
`src/api/`, `src/providers/`, `src/hooks/`, `app.json`, `package.json`,
`hosting/`, `backend-pet-tracker/`, `infra/`.

---

## 5. Gobernanza

### 5.1 Las specs aprobadas que ratificaron el inglés

El informe nombraba **6**. El barrido de `specs/` encuentra **9**
ratificaciones (las 6 del informe más 3 que el informe no listó, en las listas
de «decisiones menores objetables en este gate» de #35, #36 y #37, que son
ratificación igual: el humano las aprobó ahí).

| # | Fichero | Línea | Frase que ratifica el inglés |
|---|---|---:|---|
| 1 | `specs/mobile-auth/requirements.md` | 248 | «Decisiones menores objetables en este gate: … **copy en inglés**, `headerShown: false` global (§D5).» |
| 2 | `specs/mobile-home-dashboard/requirements.md` | 309 | «Decisiones menores objetables en este gate: … **textos en inglés** (`Free`, `No pets yet`, etc.) …» |
| 3 | `specs/mobile-map-live/requirements.md` | 285 | «Menores objetables: … región default CDMX, **textos en inglés**, botón Lost Mode con `Coming soon` …» |
| 4 | `specs/mobile-health/requirements.md` | 379-380 | «Menores objetables: … `limit=1` para la card Weight del hub, **textos en inglés**, vencidas en `text-danger` sin badge.» |
| 5 | `specs/mobile-food/design.md` | 197-200 | «**D8 — Idiomas.** Textos de UI **en inglés** (consistencia con Home/Map/Health). Los `warnings[].message` del backend llegan en español y se muestran tal cual …» |
| 6 | `specs/mobile-food/requirements.md` | 332 | «Menores (… **UI en inglés** con warnings del backend en español tal cual …): sin objeción, quedan como están.» |
| 7 | `specs/mobile-reminders/requirements.md` | 64-65 | «**UI en inglés** (decisión de #38 vigente); el diseño está en español, los literales de esta spec son los normativos.» |
| 8 | `specs/auth-reset-deep-link/design.md` | 182-183 | «**Copy de la app en inglés**, como el resto de pantallas.» |
| 9 | `specs/mobile-device-pairing/design.md` | 202-228 | «**### D7 — Copy: inglés, strings exactos**» + una tabla de **18 filas** de «Texto exacto» que fija literalmente `Pair collar`, `Free plan — health only…`, `Activation code`, `Tracker is ready`, `Unpair collar?`, etc. Es la ratificación más fuerte de las nueve: no dice «en inglés», enumera los strings |

**Dos notas de aplazamiento que NO son ratificación y no necesitan gate**:
`specs/mobile-ui-legibility-polish/requirements.md:286` (#61) y
`specs/mobile-ui-consistency-polish/requirements.md:343` (#62) listan
«unificar el idioma de la UI» como **fuera de alcance**. Aplazar no es
ratificar, y esta feature es precisamente la que cierra el aplazamiento. Se
mencionan aquí para que el reviewer no las cuente como pendientes.

### 5.2 La enmienda concreta (texto literal a insertar)

**Qué frase cambia y por cuál.** No se reescriben los ~60 literales ingleses
citados dentro de esas 9 specs: eso duplicaría la tabla de §2 en nueve sitios y
la haría derivar. Se inserta **un bloque de enmienda** que remite a la tabla
como fuente única, y la frase que ratificaba el inglés queda **tachada** en su
sitio con un puntero al bloque. Dos ediciones por fichero, mecánicas:

**(a)** En la línea que ratifica el inglés (columna «Línea» de §5.1), envolver
la frase entre `~~` y añadir el puntero. Ejemplos textuales, uno por forma:

- #1, #2, #3, #4, #6 (listas de menores): `copy en inglés` →
  `~~copy en inglés~~ (enmendado por #65, ver §Enmienda #65)`
  — y equivalentes para `textos en inglés` / `UI en inglés`.
- #5: el título `- **D8 — Idiomas.**` pasa a
  `- **D8 — Idiomas.** ~~Textos de UI en inglés (consistencia con Home/Map/Health).~~ **Enmendado por #65: textos de UI en español (ver §Enmienda #65).**`
  El resto de D8 —los `warnings[].message` del backend en español, mostrados
  tal cual— **sigue vigente y no se toca**: es justo lo que R6 conserva.
- #7: `UI en inglés (decisión de #38 vigente)` →
  `~~UI en inglés (decisión de #38 vigente)~~ **UI en español desde #65 (ver §Enmienda #65)**; el diseño está en español, los literales de esta spec quedan sustituidos por su fila en la tabla de #65.`
- #8: `Copy de la app en inglés, como el resto de pantallas.` →
  `~~Copy de la app en inglés, como el resto de pantallas.~~ **Copy de la app en español desde #65 (ver §Enmienda #65).**`
- #9: el encabezado `### D7 — Copy: inglés, strings exactos` pasa a
  `### D7 — Copy: español, strings exactos (enmendado por #65)` y, justo debajo
  de la tabla de 18 filas, se inserta:
  `> **Enmendada por #65.** Los 18 «Texto exacto» de esta tabla siguen siendo normativos en su ROL y su testID; su LITERAL queda sustituido por la fila correspondiente de `specs/mobile-ui-language/design.md` §2.10. Los testID de esta tabla no cambian.`

**(b)** Al final de cada uno de los 9 ficheros, antes de `## Aprobación` si lo
hay, insertar **este bloque, literal**, sustituyendo `<FEATURE>` por el nombre
de la carpeta de esa spec:

```markdown
## Enmienda #65 — idioma de la UI

El 2026-09-04 el humano decidió que la UI móvil va **entera en español**
(`progress/explore_design-gap-vs-make.md` §4, decisión A). Esta spec ratificó
el inglés en su día; esa parte queda **enmendada**.

- **Qué cambia**: solo el idioma de los literales de UI que esta spec fija.
- **Qué NO cambia**: ningún requisito `R<n>`, ningún `testID`, ninguna
  conducta, ningún contrato de API, ninguna decisión de diseño visual. La
  trazabilidad `R-id ↔ test` de `<FEATURE>` sigue siendo válida: los tests
  siguen probando lo mismo, con el literal traducido.
- **Fuente única del literal**: `specs/mobile-ui-language/design.md` §2. Si
  esta spec y esa tabla discrepan, **manda la tabla**.
- **Los mensajes de validación del backend siguen en inglés** y esta enmienda
  no los toca (`specs/mobile-ui-language/requirements.md` §Fuera de alcance 1).

- [ ] Enmienda aprobada por humano (fecha: ____)
```

La casilla la marca **el humano**, en el mismo gate que aprueba esta spec.
Ningún agente la marca (`AGENTS.md` §3).

### 5.3 Texto literal para `docs/ui-guidelines.md` (lo escribe R15)

Se añade como punto **6** de §Dirección de arte, después de «5. Fidelidad no es
pérdida de información»:

```markdown
**6. Idioma: español, y solo español.** Decidido por el humano el 2026-09-04 y
ejecutado por la feature #65. Todo texto que ve el usuario en
`mobile-pet-tracker/` va en español —títulos, etiquetas, placeholders,
`accessibilityLabel`, mensajes de error, botones de `Alert`—, y donde el diseño
del Make ya da la palabra se usa **la del diseño**, no una traducción propia.
La tabla normativa cadena a cadena vive en
`specs/mobile-ui-language/design.md` §2; una spec que introduzca copy nueva la
escribe en español y la añade a esa tabla en el mismo gate. **No hay librería
de i18n y no se instala una** para un solo idioma (decisión D1 de #65).

Tres corolarios que nadie debe confundir con lo anterior:

- **El idioma del código no cambia.** Nombres de variables, funciones, tipos,
  ficheros, `testID`, rutas y claves de objeto siguen en inglés, y los mensajes
  de commit también (`docs/conventions.md` §Commits).
- **El backend sigue devolviendo validaciones en inglés.** Tras #65 se seguirá
  viendo texto inglés en `login-error`, `register-*-error`,
  `weight-form-error` y `reset-error`, porque son mensajes de Zod de
  `backend-pet-tracker/`. Traducirlos es una feature de backend, no de UI. Al
  revés, las advertencias nutricionales del backend ya llegan en español y se
  muestran tal cual.
- **Los valores de enum que la API devuelve se pintan crudos**: `pet.sex`,
  `device.connectivity`, `document.type`, `foodType`, `activityLevel`. Siguen
  en inglés y `connectivity` además enseña jerga del proveedor, contra el punto
  4 de esta misma sección. Mapearlos es cambio de conducta y va a feature
  propia.
```

---

## 6. Alternativas descartadas

- **Instalar `i18next` / `expo-localization` y un catálogo `es.ts`.**
  Descartado por D1: infraestructura de traducción para un solo idioma. Añade
  una indirección en las ~309 llamadas, rompe los ~100 `getByText` que hoy leen
  la copy directamente, y crea un fichero de claves que gobernar. Se deja
  anotado como **decisión abierta para el humano**: si quiere i18n ya, es una
  enmienda a esta spec antes del handoff. No se implementa como hecho
  consumado.
- **Traducir al inglés las 10 cadenas españolas y quedarse en inglés.** Era la
  opción 3 de la decisión A del informe. **Descartada por el humano el
  2026-09-04.** No se re-litiga.
- **Una sola feature «traducir todo» sin trocear por pantalla.** Un requisito
  único de 309 cadenas es un commit gigante que no se puede revisar y viola C4
  (no hay rojo→verde por requisito). El troceo de R1–R11 es **por pantalla o
  módulo**, que es la unidad en la que un requisito sigue siendo verificable de
  una pieza: cada uno tiene su `describe` en `ui-language.test.ts`, su lote de
  tests de pantalla que actualizar y su commit.
- **Trocear por *tipo* de cadena** (todos los errores, luego todos los títulos…).
  Descartado: dejaría cada pantalla mitad en inglés mitad en español durante
  varios commits, que es exactamente el estado que esta feature viene a
  eliminar, y haría imposible una prueba de humo intermedia.
- **Un test que detecte inglés automáticamente** en vez de una tabla cerrada.
  Descartado en §3.1: es un clasificador de idioma con falsos positivos
  garantizados (`GPS`, `ESN`, `kcal`, `Microchip`, nombres propios).
- **Migrar a `testID` todas las anclas de texto** para «desacoplar la suite del
  idioma». Descartado: 172 de las 178 comprueban *el texto que se muestra*.
  Cambiarlas a `testID` no desacopla, borra la aserción. Solo migran las 4
  llamadas de §3.3, donde el texto era localizador y no aserción.
- **Reescribir los literales dentro de las 9 specs aprobadas.** Descartado en
  §5.2: duplicaría la tabla en nueve sitios y garantizaría la deriva. El bloque
  de enmienda deja **una** fuente de verdad.
- **Alinear de paso el español ya existente con el vocabulario del Make**
  (`Collar GPS`, `Documentos médicos`). Descartado: es redacción de producto
  sobre texto que ya está en el idioma correcto; ampliaría el diff sin servir a
  ningún criterio de aceptación de #65.
- **Mapear los 5 enums de la API a español de paso.** Descartado: es cambio de
  conducta (tabla de valores + test) sobre datos, no sobre literales. Queda
  declarado en [[requirements]] §Fuera de alcance 2, con sus 5 sitios exactos,
  para que la brecha se vea y no se descubra en el smoke.
