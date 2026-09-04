# explore: design-gap-vs-make

Fecha: 2026-09-04
Worktree: `/home/claude/sites/Pet-Tracker-wt-ui`, branch `feature/62-mobile-ui-consistency-polish` (HEAD `5e4d9b0`)
Alcance: **solo lectura**. No se tocó `mobile-pet-tracker/`, `specs/` ni `feature_list.json`.
Fuentes: export de Figma Make en `…/scratchpad/make-pet-tracker` (`src/app/App.tsx`, 1849 líneas), el código móvil de este worktree, el backend de este worktree.
Skills cargadas: `expo:expo-overview` (router), `docs/ui-guidelines.md` §Skills.

> Este documento **no decide nada**. Enumera la brecha, su coste y las
> decisiones abiertas. Quien elige alcance e idioma es el humano; quien
> asigna ids y prioriza es el `leader`.

---

## 0. Qué es y qué no es el export nuevo

Confirmado antes de empezar (no re-verificado aquí): `App.tsx`, `theme.css` y
`fonts.css` del export son **byte a byte** los ya versionados en
`specs/mobile-figma-polish/design-src/`. El diseño no cambió desde #46.

Lo que sí es nuevo, y qué vale cada cosa:

| Novedad | Veredicto |
|---|---|
| 26 assets en `src/imports/` | 1 reutilizable (el logo), 5 de relleno, 20 basura. Detalle en §5 |
| `src/imports/pasted_text/pet-tracker-brief.md` (418 líneas) | **Copia vieja e incompleta de `docs/brief.md`.** No aporta requisitos nuevos. Detalle en §6 |
| `guidelines/Guidelines.md` (61 líneas) | Plantilla vacía de Figma Make, íntegramente comentada. **Cero contenido propio.** Ya lo decía `specs/mobile-figma-polish/design-src/README.md` |

**Conclusión de §0**: el humano tiene razón en que "falta mucho diseño", pero
la causa no es que hubiera diseño nuevo sin implementar. La causa es que #46,
#61 y #62 se ejecutaron los tres bajo el mismo invariante duro —cero cambios de
conducta, lógica, navegación, estructura de pantalla ni texto visible— y **todo
lo que falta cae justo del otro lado de ese invariante**. Se portaron tokens,
radios, sombras y contraste; nunca se portó una sola sección nueva.

---

## 1. Mapa de brecha, pantalla por pantalla

Índice rápido. "Secciones que faltan" cuenta bloques visuales de primer nivel.

| # | Pantalla del Make | Implementación | Secciones que faltan | Estado |
|---|---|---|---|---|
| 1 | `SplashScreen` `App.tsx:160` | `src/app/index.tsx` (28 líneas) | 5 de 5 | **inexistente como pantalla** |
| 2 | `LoginScreen` `:207` | `src/app/(auth)/login.tsx` | 3 de 6 | esqueleto funcional |
| 3 | `ForgotScreen` `:247` | `src/app/(auth)/forgot.tsx` | 2 de 5 | **deshabilitada** |
| 4 | `RegisterScreen` `:276` | `src/app/(auth)/register.tsx` | 3 de 6 | funcional, sin stepper |
| 5 | `HomeScreen` `:332` | `src/app/(tabs)/home.tsx` | **4 de 7** | la peor brecha |
| 6 | `MapScreen` `:453` | `src/app/(tabs)/map.tsx` | 3 de 6 | buena base |
| 7 | `HealthScreen` `:519` | `src/app/(tabs)/health.tsx` | 3 de 4 | falta gráfica y expediente |
| 8 | `FoodScreen` `:586` | `src/app/(tabs)/food.tsx` | 2 de 4 | falta consumo |
| 9 | `ProfileScreen` `:657` | `src/screens/profile/index.tsx` | 3 de 6 | estructura correcta |
| 10 | `BottomNav` `:753` | `src/components/floating-tab-bar.tsx` | 0 de 1 | **equivalente o mejor** |
| 11 | `DocsScreen` `:838` | `src/screens/docs/index.tsx` | 4 de 5 | lista sin acciones |
| 12 | `RemindersScreen` `:905` | `src/screens/reminders/index.tsx` | 2 de 4 | **la más fiel** |
| 13 | `AddReminderScreen` `:976` | `src/screens/add-reminder/index.tsx` | 5 de 8 | formulario mínimo |
| 14 | `AddPetScreen` `:1113` | `src/screens/add-pet/index.tsx` | 4 de 10 | sin wizard |
| 15 | `GeofencesScreen` `:1314` | — | **8 de 8** | **NO EXISTE** |
| 16 | `MealScheduleScreen` `:1411` | `src/app/(tabs)/meal-schedule.tsx` | 4 de 6 | solo lectura |
| 17 | `WeightLogScreen` `:1515` | `src/app/(tabs)/weight-log.tsx` | 1 de 4 | **casi completa** |
| 18 | `GpsConfigScreen` `:1634` | `src/screens/pairing/index.tsx` | 3 de 5 | solapa parcialmente |

Además, **una pantalla entera del Make no tiene ni ruta**: el centro de
notificaciones que abre la campana de `App.tsx:351-356`. Y **una pantalla de la
app no existe en el Make**: `src/app/reset-password.tsx` (deep link de #59).

---

### 1.1 `HomeScreen` — `App.tsx:332-452` vs `src/app/(tabs)/home.tsx`

La brecha que el humano señaló. El Make monta **siete** bloques verticales; la
implementación monta **cuatro**, y ninguno coincide con los del Make.

**Lo que dibuja el Make, de arriba abajo:**

| Bloque | Línea | Contenido |
|---|---|---|
| Hero fotográfico | `:335-373` | Foto de la mascota a **340 px** con degradado a blanco (`linear-gradient(180deg,rgba(0,0,0,.28) 0%,transparent 38%,#fff 100%)`); encima, superpuestos: selector de mascotas como **avatares circulares** de 44/34 px con borde verde y punto de estado (`:337-350`), botón **`+`** de alta rápida (`:347-349`), **campana de notificaciones** con punto rojo (`:351-356`), píldora "**En línea**" con punto pulsante (`:358`), nombre en **`text-3xl font-black`** (`:359`), raza, y a la derecha **contador de pasos** en `text-3xl` con la etiqueta "pasos hoy" (`:362-365`) |
| Tira de 4 estadísticas | `:374-390` | Una card horizontal partida en 4 celdas con separador vertical: Peso / Activo / Paseos / Distancia, cada una con emoji, valor y label |
| Fila de ubicación | `:391-401` | Icono en círculo pastel + `pet.address` + `pet.lastSeen` + icono batería + `%` |
| **Accesos rápidos** | `:395-419` | Título en versalitas + **grid de 4 tiles pastel** (`#EEF4FF` Mapa, `#FFF7ED` Actividad, `#FFF0F3` Vacunas, `#F0FBF6` Comidas) con emoji grande |
| **Actividad semanal** | `:411-436` | Título + "últimos 7 días" + **gráfica de barras de 7 días** (`BarChart data={pet.weekData}`, barras verdes de 22 px, eje X L-M-X-J-V-S-D) |
| **Recordatorios** | `:425-450` | Título + enlace "Ver todos" + card de próxima vacuna con badge naranja "26d" + card de **Alimentación con barra de progreso** `meals/totalMeals` |

**Lo que dibuja la implementación:**

| Bloque | Línea | Contenido |
|---|---|---|
| Título `Home` | `home.tsx:110` | `Text` suelto, `text-2xl` |
| `PetSwitcher` | `:133-139` | Fila horizontal de `Avatar` de heroui tamaño `sm`, sin punto de estado, sin botón `+` |
| `pet-card` | `:156-176` | `PetAvatar` de 72 px + nombre `text-xl` + raza. Sin foto de fondo, sin degradado |
| `collar-card` | `:178-249` | Icono Wifi/WifiOff/Moon + "Online/Offline/Free" + batería + botón "Pair a collar" |
| `summary-card` | `:254-318` | "Today's Summary" + **3** stats (Activity / Sleep / Distance). **No 4**: no hay Peso ni Paseos |
| `last-position-card` | `:322-339` | "View on map" + `chevron` + "Last seen \<fecha\>" |

**Faltan, íntegras:** el hero fotográfico, la campana de notificaciones, el
botón `+` de alta rápida, el contador de pasos, la cuarta estadística, la fila
de dirección, **Accesos rápidos**, **Actividad semanal** y **Recordatorios**.

**Sobra respecto al Make:** la `collar-card` como bloque propio (el Make funde
batería y conectividad dentro de la fila de ubicación) y el `last-position-card`
(el Make no tiene una card de "ver en el mapa": el acceso al mapa es un tile de
Accesos rápidos).

**Bloqueo técnico del selector de mascotas**: el Make lo dibuja como avatares
**con la foto de cada mascota** (`App.tsx:337-350`), y hoy `PetSwitcher` recibe
`pets.data.pets` de `GET /v1/pets` — endpoint que devuelve `photoUrl: null` para
todas (§2.3.1). Ese detalle, y no el estilo, es lo que hace que el selector se
vea como iniciales sobre un círculo. No se arregla en la pantalla.

---

### 1.2 `MapScreen` — `App.tsx:453-518` vs `src/app/(tabs)/map.tsx`

**Falta:**
- Píldora flotante superior con **avatar + nombre + "GPS activo"** (`:479-486`). La implementación no rotula el mapa con la mascota seleccionada.
- Bloque "**Ubicación actual**" con **dirección literal** y antigüedad (`:489-495`). Ver §2: `address` no existe en ningún sitio.
- Botones "**Compartir**" y "**Recorrido**" (`:507-510`). "Compartir" es enlace temporal (brief §12/§19); "Recorrido" es una vista de historial que no existe.
- El Make muestra el **círculo de geocerca** y la etiqueta "✓ Zona Segura" dibujados sobre el mapa (`:472-479`). La implementación no pinta geocercas.

**Tiene y el Make no:** rejilla 2×2 de Speed / Distance / Updated / GPS
(`map.tsx:283-353`) y estados de error/vacío bien resueltos. La implementación
es aquí **funcionalmente superior** al Make.

**Coincide:** el CTA rojo de Modo Mascota Perdida (`App.tsx:511-513` ↔
`map.tsx:354-369`), aunque en inglés.

---

### 1.3 `HealthScreen` — `App.tsx:519-585` vs `src/app/(tabs)/health.tsx`

**Falta:**
- **Hero fotográfico de 280 px** con "SALUD DE / \<nombre\>" sobre la foto (`:522-529`).
- **"Evolución de peso"**: `AreaChart` de 6 puntos mensuales con degradado y peso actual en verde (`:537-557`). La implementación muestra solo el **último** peso y su variación (`health.tsx:216-239`); `src/components/weight-chart.tsx` existe pero solo se usa en `weight-log`.
- **"Expediente médico"**: timeline vertical con puntos de color por tipo (Consulta / Vacunación / Desparasitación) y nota "Dr. García" (`:558-582`). La implementación lista vacunas planas, una card por vacuna (`health.tsx:181-207`).

**Coincide parcialmente:** "Próximos eventos" / `next-vaccine-card`
(`:530-536` ↔ `health.tsx:138-160`), pero el Make muestra los **días restantes**
en grande (`{daysLeft}` + "días") y la implementación solo la fecha.

---

### 1.4 `FoodScreen` — `App.tsx:586-656` vs `src/app/(tabs)/food.tsx`

**Falta:**
- Hero fotográfico de 280 px "NUTRICIÓN DE / \<nombre\>" (`:594-601`).
- **Anillo de progreso calórico**: SVG donut con el % consumido y barra de progreso `caloriesConsumed/calories` dentro de la card verde (`:604-624`). La implementación solo muestra el objetivo (`food.tsx:136-166`).
- Nombres de comida ("Desayuno / Comida / Cena / Snack") y chip "**✓ Servido**" (`:588-593`, `:628-641`). La implementación rotula cada comida con su hora (`food.tsx:205-207`) y deriva "Served/Pending" comparando con el reloj local (`:185`), no con un registro real.

**Coincide:** la card de recomendación IA (`:642-651` ↔ `food.tsx:250-266`) y la
estructura general de la card de objetivo.

---

### 1.5 `ProfileScreen` — `App.tsx:657-751` vs `src/screens/profile/index.tsx`

**Falta:**
- Hero fotográfico de 340 px con selector de mascotas superpuesto, píldora "Collar activo" y botón flotante "**Cambiar foto**" sobre la foto (`:659-686`). La implementación tiene un `PetHero` de 224 px que **centra un avatar sobre fondo `accent-soft`** (`profile/index.tsx:55-77`) — no es una foto a sangre.
- Card "**Foto de la mascota**" con miniatura + "Subir nueva foto" / "Tomar foto" + nota "JPG, PNG o HEIC · Máx. 10 MB" (`:688-712`). La implementación tiene un único botón "Change photo" que solo abre la galería (`profile/index.tsx:264-274`, `handleChangePhoto` usa `launchImageLibraryAsync`); **no hay cámara**.
- El cuarto acceso, "**Geocercas configuradas**" (`:737`), con su subtítulo "Casa · Parque · Veterinaria".

**Coincide bien:** píldoras sexo/esterilizado/edad/peso (`:714-719` ↔
`PetPills`), card "Información" con las cuatro filas exactas —Raza, Microchip,
Dispositivo GPS, Última señal— (`:720-733` ↔ `profile/index.tsx:281-297`), y los
accesos a Documentos, Recordatorios y Configuración del Dispositivo GPS.

**Sobra respecto al Make:** `me-card` con datos de cuenta, toggle de tema y
"Sign out" (`:338-377`). El Make no tiene pantalla de cuenta de usuario.

---

### 1.6 `BottomNav` — `App.tsx:753-778` vs `src/components/floating-tab-bar.tsx`

**Sin brecha estructural.** Mismos 5 destinos y mismo orden
(Inicio/Mapa/Salud/Nutrición/Perfil ↔ Home/Map/Health/Food/Profile,
`floating-tab-bar.tsx:48-54`). La implementación es **mejor**: barra flotante con
blur/liquid glass e indicador animado con spring, frente a una `nav` sólida con
borde superior. Única diferencia real: **el idioma de las 5 etiquetas**.

---

### 1.7 `DocsScreen` — `App.tsx:838-904` vs `src/screens/docs/index.tsx`

**Falta:**
- Hero de 160 px con la foto al 60 % de opacidad (`:850-858`).
- Botón "**+ Nuevo**" para subir un documento (`:859-863`). El backend ya acepta `POST /v1/pets/:petId/media` (ver §2); el cliente móvil no tiene la función.
- **Chips de filtro** "Todos / Vacunas / Consultas / Análisis" (`:846`, `:865-874`).
- Botones por fila de **ver (ojo)** y **compartir** (`:886-893`).
- **Color por tipo de documento**: cada tipo lleva su pastel (`#EFF6FF` azul vacunación, `#F0FBF6` verde consulta, `#FFFBEB` ámbar desparasitación, `#F5F3FF` violeta análisis). La implementación pinta todos los iconos con `bg-accent-soft` y un emoji `📄` fijo (`docs/index.tsx:19-25`).

---

### 1.8 `RemindersScreen` — `App.tsx:905-975` vs `src/screens/reminders/index.tsx`

**La pantalla más fiel del repo.** #46 portó la estructura entera: las tres
píldoras de resumen Activos/Esta semana/Inactivos (`:928-941` ↔
`reminders/index.tsx:195-254`), la fila con tile de emoji + categoría + badge
"¡Próximo!" (`:958-961` ↔ `:279-286`, "Upcoming!"), título, fecha y "en N días".

**Falta:**
- Hero de 140 px + botón "**+ Nuevo**" sobre la foto (`:917-926`). La implementación tiene un botón "Add" plano en la cabecera.
- **Toggle activo/inactivo por recordatorio** (`:965-970`). La implementación pone un botón "Delete" en su lugar (`reminders/index.tsx:309-321`) y solo refleja el estado con `opacity-50`. Nota: el backend modela `status: 'scheduled'|'sent'|'cancelled'`, no un booleano `active`.
- **Color por categoría** (5 pasteles). La implementación usa `bg-accent-soft` para las siete categorías (`:269-274`).

---

### 1.9 `AddReminderScreen` — `App.tsx:976-1112` vs `src/screens/add-reminder/index.tsx`

**Falta:**
- Cabecera con foto al 50 % y "NUEVO RECORDATORIO · \<nombre\>" (`:1007-1020`).
- **Card de preview** del tipo elegido, con su pastel y su emoji grande (`:1039-1046`).
- **Campos condicionales por tipo**: veterinario, clínica y teléfono de emergencia si es Vacuna o Consulta; "Medicamento / Dosis" si es Medicamento (`:1050-1058`).
- **Repetición** (Una vez / Mensual / Semestral / Anual) (`:1061-1074`). No existe en el modelo: `Reminder` no tiene campo de recurrencia.
- **Notas** (textarea) (`:1090-1097`).
- Las 7 categorías de la implementación (`REMINDER_TYPE_META`) no son las 5 del Make (Vacuna/Medicamento/Consulta/Baño/Otro): faltan **Baño** y sobran deworming/weight/food.

**Coincide:** chips de tipo, título, fecha, hora y anticipación
(`add-reminder/index.tsx:137-283`); el Make llama a la anticipación "Enviar
alerta" con opciones en días, la implementación usa minutos.

---

### 1.10 `AddPetScreen` — `App.tsx:1113-1313` vs `src/screens/add-pet/index.tsx`

**Falta:**
- **Wizard de 2 pasos** con cabecera verde oscura en degradado y stepper (`:1136-1163`). La implementación pone los dos títulos —"Datos básicos" (`:269`) y "Datos médicos" (`:341`)— **en la misma pantalla scrolleable**, sin pasos.
- **Subida de foto en el alta**: la implementación tiene `add-pet-photo` pero no ofrece cámara (`:1168-1189` en el Make trae galería y cámara).
- Campos ausentes: **Color / pelaje** (`:1247`), **Nombre del veterinario**, **Clínica veterinaria**, **Teléfono de emergencia** (`:1271-1273`), **Alergias / condiciones especiales** (`:1276-1282`), **Peso actual** (`:1256`).
- Card de cierre "**¡Casi listo!**" explicando qué viene después (`:1284-1287`).
- **Raza como `select` de catálogo** por especie (`:1216-1227`). La implementación usa un `TextInput` libre (`add-pet/index.tsx:311-320`).

**Coincide:** especie, nombre, sexo, talla, fecha de nacimiento / edad aproximada, esterilizado, microchip.

---

### 1.11 `GeofencesScreen` — `App.tsx:1314-1410` — **NO EXISTE**

Ocho bloques, cero implementados: mapa con las geocercas dibujadas y el pin de
la mascota (`:1321-1352`), píldora "\<nombre\> · En zona segura" (`:1354-1357`),
botón "+ Nueva zona" (`:1358-1360`), lista de zonas configuradas con icono,
nombre, radio, **toggle activo**, **slider de radio 50-500 m** y botones
Editar / Eliminar (`:1366-1405`).

**No hay ruta, no hay pantalla y no hay cliente de API.** El backend, en
cambio, tiene el CRUD completo (§2).

---

### 1.12 `MealScheduleScreen` — `App.tsx:1411-1514` vs `src/app/(tabs)/meal-schedule.tsx`

**Falta:**
- Cabecera con foto de 130 px + botón "**+ Añadir comida**" (`:1420-1432`).
- **`select` de alimento principal** con marcas (`:1452-1461`). No existe catálogo de marcas.
- **Editar horario** y **Marcar servido** por comida (`:1487-1490`).
- Nombres de comida (Desayuno/Comida/Cena) y estado **Servido/Pendiente** por fila (`:1414-1418`, `:1470-1476`).
- Aviso "Recordatorios activos · notificación 15 min antes" (`:1502-1506`).

**Coincide:** card verde de resumen con kcal objetivo y nº de raciones
(`:1437-1450` ↔ `meal-schedule.tsx:171-193`) y la lista de horarios
(`meal-schedule.tsx:197-227`).

**Tiene y el Make no:** sección de perfil nutricional con alergias y
enfermedades (`meal-schedule.tsx:265-294`) y el botón de generar plan.

---

### 1.13 `WeightLogScreen` — `App.tsx:1515-1633` vs `src/app/(tabs)/weight-log.tsx`

**La menor brecha de las pantallas de detalle.** Gráfica, formulario de alta e
historial están los tres.

**Falta:** cabecera con foto de 130 px y peso actual en grande (`:1524-1537`), y
el campo **"Nota (opcional)"** del formulario (`:1592-1597`) — la implementación
pide en su lugar la condición corporal 1-9, que el Make no tiene. En el
historial, el Make marca el delta con emoji 📈/📉/➖ y color; la implementación
muestra la variación en texto.

---

### 1.14 `GpsConfigScreen` — `App.tsx:1634-1704` vs `src/screens/pairing/index.tsx`

Se solapan a medias: `pairing` cubre el **emparejamiento** (código de
activación, estado del dispositivo, desemparejar); `GpsConfigScreen` cubre la
**configuración** del collar ya emparejado.

**Falta:**
- Cabecera con foto de 140 px e indicador "GPS activo" (`:1665-1681`).
- Sección "**Geocercas**" con las zonas y su radio (`:1643-1650`).
- Sección "**Alertas**" con tres switches: Salida de zona, Batería baja, Sin señal (`:1651-1658`).
- CTA rojo "**Apagar dispositivo GPS**" (`:1693-1696`).

**Coincide:** "Estado del dispositivo" con batería y conexión
(`:1637-1642` ↔ `pairing/index.tsx:400-436`).

---

### 1.15 Autenticación — `App.tsx:160-331`

| | Make | Implementación |
|---|---|---|
| Splash | Pantalla completa: foto a sangre, logo `PET TRACKER` + badge `PRO` + `By TrackerMexico GPS`, hoja blanca con radio 28 px, 3 chips de features, copy de valor, "Comenzar ahora", "Ya tengo una cuenta", aviso de Términos (`:160-206`) | `src/app/index.tsx`: 28 líneas, un logo centrado mientras resuelve la sesión, y `Redirect`. **No es una pantalla de bienvenida** |
| Login | Hero fotográfico de 280 px con degradado verde oscuro + marca; campos con **icono a la izquierda** y ojo de mostrar contraseña; "¿Olvidaste tu contraseña?"; separador "o"; "Crear cuenta nueva"; "Contactar soporte" (`:207-246`) | `login.tsx`: título "Sign in", dos `TextField`, botón y dos `LinkButton`. Sin hero, sin marca, sin iconos de campo, **sin toggle de ver contraseña** |
| Forgot | Icono en cuadro pastel, título, copy, campo de correo, "Enviar instrucciones", "← Volver" (`:247-275`) | `forgot.tsx`: **deshabilitada** — `isDisabled`, `editable={false}` y el texto "Password recovery coming soon" (`:38-40`). El backend ya tiene `auth-forgot-password`, `auth-email-delivery` (#58) y `auth-reset-deep-link` (#59) en `done`, y existe `src/app/reset-password.tsx` |
| Register | **Stepper de 2 pasos** ("Datos personales" / "Cuenta y acceso"), campos con icono, **país como `select` con banderas**, foto decorativa de grupo, footer fijo con "Continuar" (`:276-331`) | `register.tsx`: formulario plano de 7 campos + checkbox de términos, un solo paso, país como texto libre |

**Hallazgo aparte**: `ForgotScreen` deshabilitada con el backend listo es una
inconsistencia funcional, no de diseño. Merece su propia feature con o sin
rediseño.

---

## 2. Datos: qué exige cada sección que falta, y si el backend los da

Clasificación: **EXISTE** / **EXISTE-RENOMBRADO** / **DERIVABLE** /
**FALTA-BACKEND**. Todas las rutas llevan el prefijo `/v1` que aporta
`EXPO_PUBLIC_API_URL` (`mobile-pet-tracker/src/api/http.ts:5-7`).

### 2.1 El hallazgo que más cambia el coste

> **La gráfica "Actividad semanal" de la Home ya se está descargando hoy. La
> app pide los 7 días y dibuja 1.**

`GET /v1/pets/:petId/activity/daily` devuelve **una entrada por día, sin huecos**,
con `distanceM`, `activeMinutes`, `restMinutes`, `walkCount`, `avgWalkMinutes`,
`firstWalkAt`, `lastWalkAt`, `timeAwayMinutes` y `source`
(`mobile-pet-tracker/src/api/types.ts:79-90`), más un `weekComparison`. Acepta
`?from=&to=` (`activity/application/dto/get-daily-activity.dto.ts:9-12`), pero
**no hace falta pasarlos**: el caso de uso ya usa por defecto
`ACTIVITY_DEFAULT_RANGE_DAYS = 7` terminando hoy en la zona horaria del dueño.

El cliente móvil llama sin parámetros (`src/api/activity.ts:26-31`) y la Home
descarta seis de las siete entradas:
`activity.data.days[activity.data.days.length - 1]` (`home.tsx:86-89`).
`pet.weekData` del Make **ya está en memoria**.

Tres avisos que cualquier spec de esa gráfica debe recoger:

1. Un día pasado sin datos vuelve con `source: 'missing'` y **todas las métricas
   a `null`**, no a cero — es deliberado ("un cero significaría descanso
   confirmado y mentiría"). La gráfica necesita un render de "sin dato", no una
   barra de altura 0.
2. El array es **cronológico terminando hoy**, no lunes→domingo. La letra del eje
   (L-M-X-J-V-S-D) se deriva de `date`, **nunca del índice**.
3. `weekComparison { distanceM, activeMinutes, walkCount }` da la variación
   contra los 7 días previos — flechas de tendencia gratis que el Make no dibuja.

### 2.2 Segundo hallazgo: dos huecos reservados en el contrato del perfil

`PetProfileResponse` congela las claves y deja **placeholders explícitos**
(`backend-pet-tracker/src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.ts:41-47`):

```ts
/** null hasta pet-vaccines (#14). */   nextVaccine: NextPetVaccine | null;   // ← REAL
/** null hasta pet-reminders (#16). */  nextReminder: null;                    // ← hardcodeado null
/** null hasta activity-summary (#10). */ activitySummary: null;               // ← hardcodeado null
```

`nextVaccine` ya se rellena de verdad (`pets.controller.ts:91-100`), y su forma es
`{ id, name, nextDoseAt }` (`pets/domain/ports/pet-vaccine-reader.ts:3-7`) — sin
`daysLeft`, que es trivial de calcular en cliente. `nextReminder` y
`activitySummary` siguen devolviendo `null` **literal** en el mapper: rellenarlos
es trabajo de backend, pero pequeño y con el contrato ya diseñado para ello.

En el cliente móvil los tres están tipados como `unknown`
(`api/types.ts:72-74`) y **ninguna pantalla los lee**.

### 2.3 Trampas del backend que toda spec de estas pantallas debe declarar

Siete cosas que el contrato hace y que, si no se escriben en la spec, Codex CLI
no puede adivinar. Varias invalidan el diseño tal cual está dibujado.

1. **`GET /v1/pets` (lista) devuelve `photoUrl: null`, `device: null` y
   `nextVaccine: null` para *todas* las mascotas.** El controlador llama
   `toPetProfileResponse(pet, role, now)` (`pets.controller.ts:69-79`) y el mapper
   deja esos tres argumentos en su valor por defecto `null`
   (`pet-profile-response.mapper.ts:55-61`). Consecuencia directa: **el selector
   de mascotas como avatares con foto del Make (`App.tsx:337-350`) no se puede
   construir con una sola llamada.** O se hacen N llamadas de detalle, o se toca
   el backend. Es la trampa de mayor frecuencia de todo el diseño: afecta a Home,
   Profile y a cualquier carrusel.
2. **`device.connectivity` está roto como señal.** El *store* de ingesta escribe
   `'online'` a pelo (`src/workers/ingestion.drizzle.store.ts:97`) y un grep de
   `'offline'` en todo el backend da **cero** resultados: es un pestillo de un
   solo sentido. La píldora "En línea" del Make (`App.tsx:358`) **no debe leer
   ese campo**. La señal real es `LastPosition.staleSeconds` o
   `lastCommunicationAt` contra el reloj. **El umbral no existe en ningún sitio
   del repo → decisión abierta.**
3. **`restMinutes` no es lo que el Make dibuja.** El pipeline lo calcula como
   `observedMinutes − activeMinutes`, donde `observedMinutes` va del primer al
   último *fix* GPS (`pipeline/activity.ts:74`), no sobre 1440. El `891` del mock
   asume un día completo. O se acepta otro número, o se especifica un cambio.
4. **`aiExplanation` del plan nutricional siempre llega `null`** — el mapper lo
   fija. La card "Recomendación IA" existe en el código (`food.tsx:250-266`) pero
   nunca se pinta en producción.
5. **Las rutas de tracking devuelven `402`** (`PetTrackingGuard`) sin suscripción
   activa: posiciones, viajes, actividad **y geocercas**. `getPetTracking` da
   `tracked: boolean`. **El Make no dibuja ningún estado de "sin suscripción"** —
   es una pantalla que falta en el diseño, no un campo.
6. **No se puede crear un recordatorio con fecha pasada**: `FutureDueAtSchema`
   rechaza cualquier `dueAt` que no sea estrictamente futuro.
7. **Una geocerca pertenece a exactamente una mascota**: `geofences.pet_id` es
   `NOT NULL` con único `(pet_id, name)`. El "nº de mascotas dentro" del diseño
   es 0 o 1, derivable de `state.value === 'inside'`. Si el diseño quiere decir
   *una zona compartida con varias mascotas dentro*, eso es un cambio de modelo
   caro (relación N:M + endpoint agregado). **No se puede deducir del mock →
   decisión abierta.**

### 2.4 Tabla campo a campo

| Dato que pide el Make | Veredicto | Dónde está / qué haría falta |
|---|---|---|
| `pet.name`, `breed`, `sex`, `sterilized`, `microchip`, `photoUrl`, `size`, `color` | **EXISTE** | `GET /v1/pets/:id` → `PetProfileResponse` |
| `pet.age` ("3 años 2 meses") | **EXISTE-RENOMBRADO** | `ageMonths: number` (`types.ts:60`). El Make lo quiere en prosa; formateo de cliente |
| `pet.weight` | **EXISTE-RENOMBRADO** | `currentWeightKg` (`types.ts:61`) |
| `pet.hero` + `pet.thumb` (dos fotos) | **EXISTE-RENOMBRADO**, una sola URL, **y no en la lista** | `photoUrl`: GET prefirmada de S3, TTL 1 h. Una URL, no dos (una miniatura real sería backend nuevo; lo barato es la misma URL a dos tamaños). **`GET /v1/pets` la devuelve `null` siempre** — ver §2.3.1 |
| `pet.battery` | **EXISTE-RENOMBRADO** | `device.batteryPct` (`types.ts:46`) y también `LastPosition.battery` (`:103`). Ninguna de las dos viaja en `GET /v1/pets` |
| `pet.connected` | **DERIVABLE** (el campo servido está roto) | `device.connectivity` es un pestillo que solo vale `'online'` — ver §2.3.2. Usar `staleSeconds` o `lastCommunicationAt` con un umbral **que hay que decidir** |
| `pet.lastSeen` ("hace 2 min") | **EXISTE-RENOMBRADO** | `lastCommunicationAt` ISO (`types.ts:69`) y `LastPosition.staleSeconds` (`:104`). "hace N min" es formateo |
| `pet.nextVaccine {name,date,daysLeft}` | **EXISTE** (`daysLeft` **DERIVABLE**) | `GET /v1/pets/:id` → `nextVaccine {id,name,nextDoseAt}` (`nextDoseAt` es fecha `YYYY-MM-DD`, no *datetime*). Hoy tipado `unknown` y sin uso. **Solo en el detalle**, nunca en la lista |
| `pet.nextMed` | **DERIVABLE** | Primer `Reminder` de tipo `medication` con `dueAt` futuro, vía `GET /v1/pets/:id/reminders`. El hueco `nextReminder` del perfil está en `null` |
| `pet.activity.distance` | **EXISTE-RENOMBRADO** | `DayEntry.distanceM` (metros, no km) |
| `pet.activity.activeMin` | **EXISTE-RENOMBRADO** | `DayEntry.activeMinutes` |
| `pet.activity.restMin` | **EXISTE-RENOMBRADO**, **semántica distinta** | `DayEntry.restMinutes` = ventana observada − activo, no 1440 — ver §2.3.3 |
| `pet.activity.walks` | **EXISTE-RENOMBRADO** | `DayEntry.walkCount` — **servido y nunca mostrado**. Es la 4.ª estadística que falta en la Home |
| `pet.weekData` (7 días) | **EXISTE, ya descargado** | 7 días por defecto en `/activity/daily`. Ver §2.1 |
| `pet.weightData` (6 puntos mensuales) | **EXISTE**, requiere agrupar en cliente | `GET /v1/pets/:id/weights?limit=` → `WeightEntry[]` (más reciente primero, `limit` por defecto 50, máx. 100). `health.tsx:61` lo llama **con `limit=1`**; basta subirlo. Las filas son **por pesaje, no una por mes**: los 6 puntos mensuales se agrupan en cliente. `src/components/weight-chart.tsx` ya existe |
| `pet.weight` — quién lo escribe | ojo | El **único** escritor de `currentWeightKg` es `POST /v1/pets/:petId/weights` (`weight.drizzle.repository.ts:34`). Ni el alta ni la edición de mascota lo aceptan: una mascota sin pesaje muestra `null`, y sin `currentWeightKg` **no se puede generar plan nutricional** |
| **`pet.steps`** | **FALTA-BACKEND** | **Cero ocurrencias** de `steps` en todo el repo (backend y móvil). No hay podómetro. El brief §10 solo promete "parámetros de acelerómetro" *cuando el dispositivo lo permita*. Construir el contador de pasos exige: comprobar que el collar lo reporta, ingerirlo desde Wialon, columna nueva y campo nuevo en `/activity/daily` |
| **`pet.address`** ("Jr. Los Pinos 142") | **FALTA-BACKEND** | **Cero geocodificación inversa** en el repo. `LastPosition` trae solo `lat`/`lng` (`types.ts:98-105`). Exige un proveedor de geocoding (Google/Mapbox), **que cuesta dinero por petición** y necesita caché. Decisión de coste → humano |
| `pet.calories` (objetivo) | **EXISTE** | `NutritionPlan.merKcal` (`types.ts:182`) |
| **`pet.caloriesConsumed`** | **FALTA-BACKEND** | No hay registro de consumo. `nutrition.schema.ts` guarda perfil y plan, nada de ingesta |
| **`pet.meals` / `totalMeals`** (servidas hoy) | `totalMeals` **EXISTE** (`mealsPerDay`), `meals` **FALTA-BACKEND** | `food.tsx:185` finge el "servido" comparando `mealTime <= hhmm` con el reloj local. Marcar una comida como servida (`MealScheduleScreen:1489`) exige tabla y endpoint nuevos |
| Documentos {type,name,date,vet} | **EXISTE** | `GET /v1/pets/:petId/media` → `{id,type,name,date,vet,key}`; tabla `pet_documents` (`db/schema/media.schema.ts:5-21`). Ojo: `date` es la **fecha del documento que teclea el usuario**, no la de subida |
| Fecha de subida del documento | **FALTA-BACKEND** | `pet_documents` **no tiene `created_at`** |
| Tamaño del documento | **FALTA-BACKEND** | No hay columna de tamaño; haría falta o que el cliente lo mande al crear, o un `HeadObject` de S3 |
| Subir documento ("+ Nuevo") | **EXISTE en backend, FALTA cliente** | `POST /v1/pets/:petId/media` → `{document, uploadUrl, expiresInSeconds}` (`pet-media.controller.ts:41-43`). `api/media.ts` solo exporta `listPetDocs`, `requestPhotoUploadUrl`, `uploadPhotoToUrl` |
| Ver / descargar un documento (botón ojo) | **FALTA-BACKEND** | La respuesta devuelve la `key` cruda de S3, nunca una GET prefirmada. El adaptador *sabe* firmar GETs (`photo-storage.s3.adapter.ts:34`) pero solo está cableado a la foto de la mascota. **Abrir un documento exige endpoint nuevo** |
| **Expediente médico cronológico** (Consulta / Desparasitación / Análisis) | **FALTA-BACKEND** | `db/schema/health.schema.ts` solo tiene `vaccine_catalog` y `pet_vaccines`. No hay tabla de eventos clínicos genéricos. El brief §15 la pide con 10 campos |
| **Geocercas** {name, radiusM, active, centro, estado} | **EXISTE en backend, FALTA cliente** | CRUD completo: `GET/POST /v1/pets/:petId/geofences`, `GET/PATCH/DELETE …/:geofenceId` (`geofences.controller.ts:41-127`). Respuesta congelada `{id,petId,name,type,centerLat,centerLng,radiusM,active,state{value:'unknown'\|'inside'\|'outside',updatedAt},createdAt,updatedAt}`. **`mobile-pet-tracker/src/api/` no tiene `geofences.ts`**. Rutas tras `PetTrackingGuard` → **402** sin suscripción |
| Nº de mascotas dentro de una zona | **DERIVABLE** (0 o 1) o **FALTA-BACKEND** (caro) | Una geocerca es de **una** mascota — ver §2.3.7. Decisión abierta |
| **Centro de alertas / campana** | **EXISTE en backend, FALTA cliente** | `GET /v1/alerts?status=open\|acked\|closed&cursor=`, `POST /v1/alerts/:id/ack` (`alerts.controller.ts:34-66`). Respuesta `{id,petId,petName,type,status,geofenceId,payload,openedAt,ackedAt,closedAt}`. "No leída" ≈ `status==='open'`; el *ack* es el "leído". **No hay `api/alerts.ts`: el centro de alertas entero está sin consumir** |
| **Contador exacto del badge de la campana** | **FALTA-BACKEND** | `ListAlertsQuerySchema` es `strictObject` sin `limit` y la página es de tamaño fijo (`list-alerts.dto.ts:9-12`): `?limit=` responde **400**. El **punto rojo** sí es derivable; el **número** exige `GET /v1/alerts/count` o un `unreadCount` en la lista |
| **Qué cabe en la campana** | ojo | `alert_events_type_check` solo admite `'geofence_exit'` y `'battery_low'`. Los recordatorios de vacuna y medicación los despacha el *scheduler* y **nunca entran en `/alerts`**. Una campana que mezcle ambas cosas necesita fusionar dos fuentes en cliente, o backend nuevo |
| Repetición de recordatorio (Una vez / Mensual / Anual) | **FALTA-BACKEND** | `Reminder` es `{id,petId,type,title,dueAt,advanceMinutes,status}` (`types.ts:203-211`). No hay recurrencia |
| Notas del recordatorio | **FALTA-BACKEND** | Idem, no hay campo `notes` |
| Vet / clínica / teléfono en el alta de recordatorio | **FALTA-BACKEND** | `pet_vaccines` sí tiene `vetName` y `clinic`; `reminders` no |
| Toggle activo/inactivo de recordatorio | **EXISTE-RENOMBRADO** | `PATCH /v1/reminders/:id` acepta `{status:'cancelled'}` y edición de `dueAt`/`advanceMinutes`/`title` — **sin cliente móvil**. Es **cambio de conducta**, no de estilo |
| "Hecho" (el usuario cumplió el recordatorio) | **FALTA-BACKEND** | `'sent'` significa *se envió el push*, no *lo hizo el humano*. Un "done" de usuario exige valor nuevo en el CHECK y soporte en el PATCH |
| Categoría "Baño"/*grooming* del Make | **FALTA-BACKEND** | `reminders_type_check` fija los 7 tipos. *Baño* mapea a `'appointment'`/`'custom'`; un `'grooming'` literal exige migración del CHECK |
| Crear recordatorio con fecha pasada | **imposible** | `FutureDueAtSchema` lo rechaza — ver §2.3.6 |
| Marca de alimento ("Royal Canin Adult") | **FALTA-BACKEND** | `nutrition_profiles.foodType` es `'dry'\|'wet'\|'mixed'\|'homemade'` (`nutrition.schema.ts:28-31`). No hay catálogo de marcas |
| Alergias / enfermedades en el alta de mascota | **EXISTE-RENOMBRADO** | `nutritionProfiles.allergies` y `.diseases` son `jsonb string[]` — pero cuelgan del **perfil nutricional**, no del alta de mascota |
| Color / pelaje | **EXISTE** | `PetProfile.color` (`types.ts:63`) — servido y **no mostrado ni capturado** |
| Firmware del collar, LED, buzzer, intervalo de reporte, ahorro de energía | **FALTA-BACKEND, y antes que eso FALTA INTEGRACIÓN** | `DeviceStatus` es `{model,batteryPct,connectivity,lastMessageAt,esn}` (`types.ts:44-50`); grep de `firmware\|buzzer\|led\|reporting_interval\|power_sav` da **cero**. Peor: **no hay canal de bajada al dispositivo** — `wialon-http.client.ts` expone exactamente `listUnits()` y `getMessages()`, solo lectura. Escribir configuración al collar exige una API de comandos del proveedor que no está integrada y **puede no estar contratada** |
| Switches de alerta (salida de zona / batería baja / sin señal) | **FALTA-BACKEND** | No hay preferencias de notificación por usuario ni por mascota |
| Compartir ubicación / enlace temporal | **FALTA-BACKEND** | Brief §12/§19 lo pide; nada implementado |
| Estado "sin suscripción" (402) | **FALTA en el DISEÑO** | `getPetTracking` → `tracked: boolean`, y toda ruta de tracking puede devolver 402. **El Make no dibuja ninguna pantalla de *paywall*** |

### 2.5 Lo que la app sirve y el diseño ignora

Datos reales, ya expuestos, que el Make no dibuja en ningún sitio:

- **Perfil**: `size`, `color`, `birthDate`, `approxAgeMonths`, `lostMode` como estado persistido, **`myRole`** (`owner|family|walker|vet` — *el modelo entero de permisos y compartición*), `device.model`, `device.esn`.
- **Actividad**: `weekComparison` (variación contra los 7 días previos), `avgWalkMinutes`, `firstWalkAt`, `lastWalkAt`, `timeAwayMinutes`, `source`.
- **Posiciones y viajes**: `speedKmh`, `course`, `altitude`, `sats`, `accuracyM`, `flags` (`low_accuracy`, `suspect_jump`), `staleSeconds`; `TripDetail.path` (la polilínea), `durationMin`, `pointCount`.
- **Salud**: `Vaccine.appliedAt/vetName/clinic/notes/documentKey/catalogId`; `WeightEntry.bodyCondition` (1-9) y `variation`.
- **Nutrición**: `rerKcal`, `objective` (`maintenance|weight_loss|growth`), `warnings[]`, `allergies[]`, `diseases[]`, `activityLevel`, `targetWeightKg`.
- **Suscripciones enteras**, incluido el estado 402.

Y hay **rutas de backend sin ningún cliente móvil**: `GET /v1/vaccine-catalog`,
`PATCH|DELETE /v1/pets/:petId`, `GET /v1/pets/:petId/device`,
`PATCH|DELETE /v1/pets/:petId/vaccines/:id`,
`PUT /v1/pets/:petId/nutrition-profile`, `POST /v1/pets/:petId/media`,
`PATCH /v1/reminders/:id`, `PATCH /v1/me`, `POST|DELETE /v1/me/push-tokens`, las
**cinco** de geocercas y las **dos** de alertas.

Traducción: **el diseño no es un superconjunto de la app**. Copiarlo al pie de
la letra escondería datos que hoy sí se muestran (la rejilla del mapa, el perfil
nutricional, las advertencias del plan) y dejaría sin interfaz a features de
backend ya pagadas. Cualquier spec que porte una pantalla del Make debe decir
explícitamente qué hace con lo que el Make no contempla.

---

## 3. Qué rompe el invariante de #46 / #61 / #62

#46, #61 y #62 se aceptaron bajo "cero cambios de conducta, lógica, navegación,
estructura de pantalla ni texto visible". Marcado por tipo de ruptura:

| Hallazgo | Conducta | Navegación | Texto | Estructura |
|---|---|---|---|---|
| Hero fotográfico en Home / Health / Food / Profile / detalle | | | | **sí** |
| Campana de notificaciones + centro de alertas | **sí** | **sí** (ruta nueva) | **sí** | **sí** |
| Botón `+` de alta rápida en el hero de Home | | **sí** | | **sí** |
| Accesos rápidos (4 tiles) | | **sí** (4 destinos) | **sí** | **sí** |
| Gráfica de actividad semanal | **sí** (nueva llamada con `from`/`to`) | | **sí** | **sí** |
| Sección Recordatorios en Home | **sí** (nueva llamada) | **sí** ("Ver todos") | **sí** | **sí** |
| Contador de pasos | **sí** | | **sí** | **sí** |
| Fila de dirección literal | **sí** (geocoding) | | **sí** | **sí** |
| 4.ª estadística (Paseos) | **sí** (leer `walkCount`) | | **sí** | **sí** |
| Gráfica de peso en Health | **sí** (subir el `limit=1`) | | | **sí** |
| Expediente médico cronológico | **sí** | | **sí** | **sí** |
| Anillo de calorías consumidas | **sí** | | **sí** | **sí** |
| Pantalla de geocercas | **sí** | **sí** | **sí** | **sí** |
| Wizard de 2 pasos en alta de mascota / registro | **sí** (estado de paso) | | **sí** | **sí** |
| Toggle activo/inactivo de recordatorio | **sí** (PATCH de status) | | | |
| Cámara en subida de foto | **sí** (permiso nuevo) | | **sí** | |
| Reactivar "Forgot password" | **sí** | | **sí** | |
| Paleta pastel por categoría | | | | **sí** (tokens nuevos) |
| Traducir la UI al español | | | **sí** | |
| Etiquetas de la barra de pestañas en español | | | **sí** | |

**Ni un solo hallazgo** de este informe cabe dentro del invariante de #62. Todos
son features nuevas. Esa es la respuesta técnica a "aún falta mucho diseño".

---

## 4. El idioma

### 4.1 El estado real: no es "app en inglés", es **app mezclada**

La app **ya tiene español dentro de pantallas en inglés**, y el `audit_ui_polish.md`
lo había anotado como fuera de alcance. Ejemplos verificados en este worktree:

- `src/screens/profile/index.tsx`: "Profile" (`:211`), "Add pet" (`:220`), "Account" (`:340`), "Sign out" (`:376`) conviven con "**Información**" (`:283`), "**Raza**" (`:285`), "**Microchip**" (`:286`), "**Dispositivo GPS**" (`:287`), "**Última señal**" (`:290`), "**Documentos**" (`:307`), "**Configuración del Dispositivo GPS**" (`:319`) y "**No registrado**" (`:49`).
- `src/screens/add-pet/index.tsx`: "Add pet" (`:240`), "Species", "Name", "Breed", "Sex", "Size" conviven con "**Datos básicos**" (`:269`) y "**Datos médicos**" (`:341`).

Es decir: la divergencia no es app-vs-diseño, es **incoherencia interna ya
existente**. Eso es un argumento independiente para cerrar el idioma, gane el
español o gane el inglés.

### 4.2 Cuántas cadenas hay, exactamente

Contadas las literales **tal como aparecen en el fuente** (una cadena escrita dos
veces cuenta dos): hijos de `<Text>`, `label=`, `placeholder=`,
`accessibilityLabel=`, argumentos de `Alert.alert`, etiquetas de pestaña y los
`setError`/`setFormError` que se renderizan en un `<Text>` de error. Excluidos
`className`, `testID`, rutas, estilos y los `throw new Error` de los providers.

| | Total | Inglés | Español | Neutro |
|---|---|---|---|---|
| **Cadenas visibles en toda la app** | **359** | **309** | **10** | **40** |

**Cadenas inglesas distintas: ~214.** Hay mucha repetición:
`'Something went wrong'` ×21, `'Retry'` ×14 en 10 ficheros,
`'Cannot reach server'` ×10, `'No pets yet'` ×5.

Los ficheros más cargados: `screens/pairing` 50, `screens/add-pet` 42,
`screens/profile` 29, `app/(tabs)/home` 24, `app/(tabs)/map` 23,
`app/(tabs)/meal-schedule` 22, `screens/add-reminder` 22,
`app/(tabs)/weight-log` 21, `screens/reminders` 21. Las 10 españolas están en
`profile` (7), `add-pet` (2) y `docs` (1).

**No hay infraestructura de i18n.** Ni `i18next`, ni `react-intl`, ni `lingui`,
ni `expo-localization` en `package.json`; ningún fichero de *locale*, ningún
módulo de cadenas, ninguna clave `locales` en `app.json`. **Todo está inline en
el JSX.** Las dos únicas tablas de cadenas centralizadas son
`src/utils/reminder-meta.ts` (7 etiquetas) y las constantes `ADVANCE_OPTIONS` y
`TABS`. `Intl`/`toLocaleString` ya siguen el *locale* del dispositivo en las 8
fechas: eso no hay que tocarlo.

**Y `src/api/` está limpio**: los 13 módulos de API devuelven uniones
discriminadas de códigos `kind` y **cero** cadenas de usuario. Todo el copy se
elige en la pantalla. Es lo mejor que tiene esta operación a su favor.

### 4.3 El acoplamiento de los tests

| Métrica | Valor |
|---|---|
| Consultas por **`testID`** | **796** |
| Sitios de consulta anclados a **texto** | **245** (222 con literal inline, 23 alimentados por `it.each`) |
| Proporción del suite ya inmune al idioma | **796 de 1041 = 76 %** |
| **Puntos de contacto con copy en inglés** | **166** = 108 aserciones directas + 58 cadenas en tablas `it.each` / objetos de `Alert.alert` |
| Cadenas inglesas distintas implicadas | **~109** (87 de varias palabras, 22 genéricas de una: `'Unpair'`, `'Cancel'`, `'Health'`…) |
| Ficheros de snapshot | **1** (`src/components/__tests__/__snapshots__/pet-avatar.test.tsx.snap`) — contiene una ruta SVG de blobatar y **cero copy de UI**. Nada que regenerar |

Reparto de las aserciones inglesas directas: `map.test.tsx` 18,
`pairing/index.test.tsx` 18, `home.test.tsx` 13, `health.test.tsx` 10,
`reminders/index.test.tsx` 9, `food.test.tsx` 7, `meal-schedule.test.tsx` 7,
`add-reminder/index.test.tsx` 6, `floating-tab-bar.test.tsx` 5,
`weight-log.test.tsx` 4, y 1-2 en otros seis. Las 58 de tablas se concentran en
`pairing/index.test.tsx` (13, las matrices de error de *claim*/*release*),
`meal-schedule` (7), `weight-log` (4), `login` (4), `register` (3).

Dos apuntes útiles: **ya hay 10 aserciones que anclan copy en español**
(`docs/index.test.tsx:104`, `add-pet/index.test.tsx:100-101`,
`profile/index.test.tsx:370,640,681,735,736`), así que el patrón está
establecido. Y un test **escanea el fuente**:
`src/__tests__/legibility-classnames.test.ts:85` hace
`expect(deleteConfirm).toContain('Delete')` sobre el texto crudo de
`reminders/index.tsx`.

### 4.4 Lectura honesta: barato de hacer, caro de gobernar

La mecánica es genuinamente pequeña: ~214 cadenas distintas, todas inline, sin
librería que instalar (para un solo idioma basta editar las literales o un mapa
`es.ts`), cero snapshots que regenerar, nada enterrado en la capa de API, y el
76 % del suite ya inmune. Del orden de un día de ediciones en 22 ficheros de
fuente más ~166 sustituciones mecánicas en 17 de test.

**Lo caro es lo de alrededor, y es lo que hay que decirle al humano:**

1. **El inglés es una decisión ratificada en al menos seis specs aprobadas** —
   `specs/mobile-food/design.md` §D8 ("Textos de UI en inglés"),
   `specs/mobile-device-pairing/design.md` §D7 ("Copy: inglés, strings exactos"),
   `specs/mobile-auth/requirements.md:248`,
   `specs/mobile-reminders/requirements.md:64` ("decisión de #38 vigente"),
   `specs/auth-reset-deep-link/design.md:182`,
   `specs/mobile-food/requirements.md:332`. Revertirlo **no es editar código: es
   enmendar specs aprobadas y su trazabilidad R-id↔test**, y cada enmienda pasa
   por el gate humano de spec.
2. **La app se quedaría a medio traducir aunque se traduzca entera.** Los
   mensajes de validación Zod del backend (auth, mascotas, recordatorios) están
   **en inglés** —`'passwordConfirmation must match password'`,
   `'Exactly one of birthDate or approxAgeMonths is required'`, los defaults de
   Zod— y se pintan tal cual en `login.tsx:37`, `register.tsx`,
   `weight-log.tsx:96` y `reset-password/index.tsx:43`. Y al revés: las
   advertencias nutricionales del backend (`NUTRITION_WARNING_MESSAGES`) **ya
   están en español** y `food.tsx` las renderiza crudas. Traducir la app sin
   tocar el backend deja la incoherencia viva.
3. **El argumento real no es el Figma, es la incoherencia.** La app ya mezcla los
   dos idiomas dentro de una misma pantalla (§4.1) y ya recibe español del
   backend. El estado actual no es "consistentemente en inglés": es incoherente.

**Decisión abierta A (idioma)** — para el humano:
1. **Español, sin i18n** — cadenas inline. Coste: 1 feature de traducción móvil + ~166 sustituciones en test + **enmendar 6 specs aprobadas** + 1 feature de backend para los mensajes de validación. Alinea con el Make y con el mercado del brief (Perú/México/Colombia).
2. **Español, con i18n** — lo anterior más `expo-localization` y un catálogo. Solo se justifica si va a haber inglés real algún día.
3. **Inglés** — traducir al inglés las 10 cadenas españolas de `profile`/`add-pet`/`docs` y las advertencias nutricionales del backend. Coste casi nulo, no toca ninguna spec aprobada, pero deja la app permanentemente desalineada del diseño y del mercado.
4. **No decidir** — sigue costando: la incoherencia es visible hoy en `profile`.

---

## 5. Los 26 assets

### 5.1 Qué son realmente

| Grupo | Ficheros | Qué es | ¿Versionar? |
|---|---|---|---|
| **Marca** | `LOGO_BLANCO_CON_A_EN_VERDE.png` (48 KB) | Logotipo real **TRACKER MEXICO GPS**, letras blancas con la "A" en verde. Único activo de marca del export | **SÍ** |
| Relleno referenciado | `pastor-1.jpg` = `pastor-2.jpg` = `pastor-3.jpg` = `pastor.jpg` (**md5 idéntico** `d269be38…`, 4 copias del mismo fichero de 118 KB) | Foto de pastor alemán generada por IA. Sirve de hero de Luna, de login y de splash | **NO** (una copia como referencia visual, a lo sumo) |
| Relleno referenciado | `grok-image-b5f773cf….jpg` (254 KB), `grupo_mascotas.jpg` (58 KB) | Fondo de splash y foto decorativa del registro, generadas por IA | **NO** |
| Relleno **no** referenciado | `grok-image-3090b1c8….jpg`, `luna.jpg` | Generadas por IA, ningún import las usa | **NO** |
| **Basura** | `image.png` + `image-1.png` … `image-16.png` (17 ficheros, **5,1 MB**) | **Capturas de pantalla**: unas son iteraciones del propio Make (p. ej. `image-9.png` es un screenshot de la pantalla Nutrición con la barra de estado "9:41"), otras son **material de la competencia** — `image.png` es una captura del store de **Tractive DOG 6 XL** con su marca, su copy y su sello de Trustpilot | **NO, y en el caso de `image.png` NUNCA**: es marketing de terceros con copyright |

### 5.2 Verificado

- Solo **6 de los 26** ficheros están importados por `App.tsx`: el logo, `grok-image-b5f773cf…`, `grupo_mascotas.jpg` y `pastor-1/2/3.jpg`. Los otros **20 son peso muerto** del export (≈ 5,4 MB de los 6,2 MB del directorio).
- `pastor.jpg`, `pastor-1`, `-2` y `-3` son **el mismo fichero cuatro veces**.

### 5.3 Recomendación

Versionar **solo el logo**, y no en `specs/`: si va a ser marca de la app, su
sitio es `mobile-pet-tracker/assets/images/`. Los `grok-*`/`pastor-*`/`grupo_*`
solo tendrían sentido como *fixtures* de un smoke con foto, y para eso ya hay
`photoUrl` real vía S3 (#pet-photos-s3). Los `image-*.png` y `image.png` no
entran al repo bajo ningún concepto.

**Decisión abierta B (fotografía)**: los heroes fotográficos del Make asumen
**una foto grande y bien encuadrada por mascota**. Hoy `PetAvatar` degrada a una
inicial sobre `accent-soft` cuando `photoUrl` es `null`
(`src/components/pet-avatar.tsx`). Un hero de 340 px sin foto es un rectángulo
vacío. Antes de portar cualquier hero hay que decidir el *fallback*: ilustración
por especie, degradado con la inicial, o pedir foto obligatoria en el alta.

---

## 6. El brief de 418 líneas vs `docs/ui-guidelines.md`

### 6.1 El brief del Make es una copia **vieja** del que ya está en el repo

Comparación normalizada (sin marcado) de
`src/imports/pasted_text/pet-tracker-brief.md` contra `docs/brief.md`:

| | `docs/brief.md` (repo, 997 líneas md) | Brief del Make (418 líneas) |
|---|---|---|
| App móvil | **Expo** | **Flutter** |
| Backend | NestJS/TypeScript | Node.js con TypeScript y NestJS |
| BD | PostgreSQL | PostgreSQL, "preferentemente mediante Supabase" |
| Notificaciones | Por definir | Firebase Cloud Messaging |
| Archivos | Por definir | Supabase Storage |
| §20 Alcance del MVP (21 puntos) | **presente** | **ausente** |
| §21 Funciones post-MVP (17 puntos) | **presente** | **ausente** |
| §22 Resultado solicitado / §23 Criterio de éxito | **presente** | **ausente** |

Fuera de esas 5 líneas de arquitectura y las 4 secciones que le faltan, **el
texto es idéntico**. No aporta ni un requisito nuevo. Es la versión que el
equipo ya corrigió. `specs/mobile-figma-polish/design-src/README.md` ya lo había
identificado como "es `docs/brief.md` de este repo" en agosto.

**No hay que versionarlo.** Y si alguien lo lee por error, dará por buenos
Flutter, Supabase y FCM: conviene dejar constancia (este informe) de que es una
copia obsoleta.

### 6.2 Lo que el brief fija y la carta de UI **no** recoge

Esto sí es hallazgo, y viene de `docs/brief.md` (el bueno), no del export.
`docs/ui-guidelines.md` (188 líneas) es una carta **de sistema de estilos**:
tokens, radios, componentes, animación, dimensiones. **No dice nada sobre
dirección de arte ni sobre qué debe responder cada pantalla.** Grep sobre la
carta: cero apariciones de "pastel", "foto", "fotografía", "imagen" o "hero".

Lo que el brief fija y la carta no:

1. **Dirección de arte** (brief §1): *"diseño moderno, amigable, lúdico con
   muchas imágenes de perros y gatos. Colores pastel."* La carta define **un
   solo acento** (`--accent #178255`, más `danger`/`warning`/`success`) y ni un
   token pastel. El Make, en cambio, usa una **paleta pastel categórica** en
   todas partes: `#EEF4FF` azul, `#FFF7ED` ámbar, `#FFF0F3` rosa, `#F5F3FF`
   violeta, `#F0FBF6` verde, `#EFF6FF`, `#FFFBEB`. Hoy la app pinta **todas** las
   categorías (7 tipos de recordatorio, todos los tipos de documento) con
   `bg-accent-soft`. **Sin esos tokens no se puede portar ninguna de las
   secciones categóricas.**
2. **Qué debe responder la Home** (brief §18), siete preguntas literales:
   ¿está segura? ¿dónde está? ¿el collar está conectado? ¿tiene batería?
   ¿tiene recordatorio pendiente? ¿cómo fue su actividad hoy? ¿hay alguna alerta?
   La Home actual responde 3 de 7 (conectado, batería, actividad de hoy). No
   responde dónde está —sin dirección—, ni recordatorios, ni alertas, ni un
   estado de "seguridad" agregado.
3. **Prohibición explícita** (brief §18): *"Los términos técnicos de Wialon no
   deberán mostrarse al usuario final."* La carta no lo recoge. Conviene
   auditarlo (`ESN`, que hoy se muestra en `pairing`, es terminología de
   dispositivo, no de Wialon — pero la regla merece estar escrita).
4. **Consistencia Android/iOS** (brief §18). Enlaza con #60 `mobile-ios-support`, `pending`.

**Recomendación**: añadir a `docs/ui-guidelines.md` una sección corta de
dirección de arte que fije (a) la paleta pastel categórica como tokens, (b) la
política de fotografía y su *fallback*, y (c) las siete preguntas de la Home como
criterio de aceptación de cualquier spec que la toque. Eso es edición de `docs/`
— la puede hacer el `leader`.

---

## 7. Propuesta de troceado en features

Sin ids: el máximo en `origin/main` es **63**. Los asigna el `leader`.
Ordenadas por dependencia. "UI pura" = no toca `backend-pet-tracker/`.

### Bloque 0 — habilitadores (bloquean a casi todo lo demás)

| Nombre propuesto | Qué hace | Tipo | Por qué va primero |
|---|---|---|---|
| `mobile-pastel-category-palette` | Añade a `global.css` los tokens de la paleta pastel categórica (light y dark, con contraste AA verificado como en #61) y los aplica a los tipos de recordatorio y de documento que hoy comparten `accent-soft` | **UI pura** | Sin estos tokens, cualquier sección categórica del Make se implementa con clases arbitrarias y rompe el grep-clean (carta §Decisiones fijas 3) |
| `mobile-ui-language` | Cierra la **decisión A**. Unifica el idioma de la UI y actualiza las aserciones de texto afectadas | **UI pura** | Toda pantalla nueva escribiría texto: hacerlo después duplica el trabajo. Depende de que el humano elija idioma |
| `docs-art-direction-charter` | Añade a `docs/ui-guidelines.md` la sección de dirección de arte de §6.2 | **solo `docs/`** | Es el criterio contra el que se revisarán las demás. Lo puede editar el `leader` |
| `pets-list-response-enrichment` | Rellena `photoUrl` (y decide si también `device`) en `GET /v1/pets` en vez de dejarlos `null` | **backend pequeño** | **Bloquea todo avatar con foto**: selector de mascotas, hero, Profile. Sin esto, cualquier carrusel con foto sale con N+1 llamadas. Cuidado: firmar N URLs de S3 por listado tiene coste — decidir si se firma siempre o solo bajo un `?include=photo` |

### Bloque 1 — Home (lo que el humano vio)

| Nombre propuesto | Qué hace | Tipo | Datos |
|---|---|---|---|
| `mobile-home-weekly-activity` | Gráfica de barras de 7 días en la Home; pasa `from`/`to` a `/activity/daily` y reutiliza el patrón de `weight-chart.tsx` | **UI pura** | Todo **EXISTE** (§2.1) |
| `mobile-home-stats-strip` | Sustituye `summary-card` por la tira de 4 celdas del Make: Peso / Activo / **Paseos** / Distancia | **UI pura** | `walkCount` y `currentWeightKg` ya servidos |
| `mobile-home-reminders-section` | Sección "Recordatorios" en la Home: próxima vacuna con días restantes + acceso a la lista | **UI pura** | `nextVaccine` **EXISTE** sin tipar |
| `mobile-home-quick-actions` | "Accesos rápidos": 4 tiles pastel a Mapa / Actividad / Vacunas / Comidas | **UI pura** (depende de la paleta) | ninguno |
| `mobile-pet-hero-header` | Componente compartido de cabecera fotográfica con degradado + *fallback*; se aplica primero a Home y Profile | **UI pura** (depende de la decisión B) | `photoUrl` **EXISTE** |

### Bloque 2 — lo que el backend ya sirve y el móvil ignora

| Nombre propuesto | Qué hace | Tipo | Datos |
|---|---|---|---|
| `mobile-alerts-center` | `api/alerts.ts` + campana en la Home con punto rojo + pantalla de centro de alertas con *ack* | **UI + cliente API** (backend listo) | `GET /v1/alerts`, `POST /v1/alerts/:id/ack` **EXISTEN**. Acotar a **punto rojo, no número** (§2.4) y a los dos tipos que el CHECK admite; mezclar recordatorios es otra feature |
| `mobile-geofences-screen` | `api/geofences.ts` + pantalla de geocercas: lista, toggle, radio, alta/edición/borrado, y dibujo del círculo sobre `pet-map.tsx` | **UI + cliente API** (backend listo) | CRUD completo **EXISTE**. Requiere cerrar la **decisión F** (una geocerca por mascota) y manejar el **402** |
| `mobile-no-tracking-paywall` | Estado de "sin suscripción" coherente para las cinco rutas que devuelven 402 (posiciones, viajes, actividad, geocercas) | **UI pura** | `getPetTracking` **EXISTE**. **El Make no dibuja esta pantalla**: hay que diseñarla, no portarla |
| `mobile-health-weight-chart` | Gráfica de evolución de peso en el tab Salud (subir el `limit=1` de `health.tsx:61`) | **UI pura** | `GET /pets/:id/weights` **EXISTE** |
| `mobile-docs-actions` | Chips de filtro por tipo, color por tipo y botón de subir documento | **UI + cliente API** (`POST /media` listo). El botón "ver" queda fuera hasta que haya URL de lectura | parcial |

### Bloque 3 — arrastra backend

| Nombre propuesto | Qué hace | Tipo | Qué backend hace falta |
|---|---|---|---|
| `pet-profile-summary-slots` | Rellena los dos placeholders `nextReminder` y `activitySummary` del mapper de perfil | **backend pequeño** | `pet-profile-response.mapper.ts:44-47`; contrato ya diseñado para ello |
| `device-connectivity-signal` | Arregla el pestillo `'online'` de la ingesta y define el umbral de "en línea" | **backend pequeño + decisión** | `ingestion.drizzle.store.ts:97`. Bloquea la píldora "En línea" del hero (§2.3.2) |
| `pet-documents-download-url` | Endpoint que devuelve una GET prefirmada de un documento; habilita el botón "ver" del vault | **backend pequeño** | El adaptador ya sabe firmar GETs; solo está cableado a la foto |
| `clinical-records` | Expediente médico cronológico (consultas, desparasitaciones, análisis) | **backend + UI** | Tabla nueva de eventos clínicos + CRUD. Brief §15 |
| `meal-tracking` | Marcar comida como servida; consumo calórico real; anillo de progreso | **backend + UI** | Tabla de tomas + endpoint. Habilita `caloriesConsumed` y `meals` |
| `reminders-recurrence-and-notes` | Repetición, notas y campos de veterinario en recordatorios | **backend + UI** | Columnas nuevas en `reminders` |
| `position-reverse-geocoding` | Dirección literal de la última posición | **backend + coste** | Proveedor de geocoding + caché. **Decisión abierta C: cuesta dinero por petición.** El humano decide proveedor y presupuesto |
| `device-settings` | Configuración del collar: alertas, firmware, intervalo, LED, buzzer | **backend + integración + contrato** | **La más cara de todas y la que no debe especificarse todavía.** No hay canal de bajada al dispositivo: `wialon-http.client.ts` solo lee. Exige API de comandos del proveedor, campos nuevos de ingesta, columnas, endpoints de lectura y escritura. **Decisión abierta H antes de nada** |
| `activity-steps` | Contador de pasos | **hardware antes que backend** | **Decisión abierta D: primero hay que confirmar que el collar reporta podómetro.** Cadena completa: campo en `rawPositionSchema` → columna `activity_daily.steps` + migración → agregación en `pipeline/activity.ts` → clave nueva en `DayEntry`. Si el collar no lo reporta, hay que **rediseñar ese cuadrante del hero de la Home** |

### Bloque 4 — flujos y formularios

| Nombre propuesto | Qué hace | Tipo |
|---|---|---|
| `mobile-auth-welcome-screen` | Splash/bienvenida real: marca, chips de features, "Comenzar ahora" / "Ya tengo cuenta", aviso de Términos | **UI pura** |
| `mobile-auth-visual-polish` | Hero fotográfico y marca en Login y Registro; ojo de mostrar contraseña; iconos de campo | **UI pura** |
| `mobile-forgot-password-enable` | Reactiva `forgot.tsx` contra el backend ya `done` de #58/#59 | **UI + cliente API** |
| `mobile-add-pet-wizard` | Wizard de 2 pasos + campos que faltan (color, peso, vet, clínica, teléfono, alergias) + raza de catálogo | **UI**, y **backend** para el catálogo de razas |
| `mobile-register-wizard` | Stepper de 2 pasos + país como selector | **UI pura** |
| `mobile-detail-screens-hero` | Cabecera fotográfica en docs / reminders / meal-schedule / weight-log / pairing | **UI pura**, depende de `mobile-pet-hero-header` |

**Orden mínimo obligatorio**: Bloque 0 → Bloque 1 → Bloque 2 → Bloques 3 y 4 en
paralelo. Dentro del Bloque 1, `mobile-pet-hero-header` antes que
`mobile-detail-screens-hero`.

**Solape conocido a vigilar**: #63 `mobile-detail-screens-state-reset` (pending)
toca `add-reminder` y `pairing`; varias de las de arriba también. Y #60
`mobile-ios-support` (pending) tocará todo lo visual: conviene decidir si va
antes o después del Bloque 1.

---

## 8. Decisiones abiertas (las cierra el humano, no el `leader` ni yo)

| # | Decisión | Opciones y consecuencia |
|---|---|---|
| **A** | **Idioma de la UI** | Cuatro opciones detalladas en §4.4. Lo que hay que saber para decidir: la mecánica es ~1 día (214 cadenas, 166 puntos en test, sin i18n que instalar), pero el inglés está **ratificado en 6 specs aprobadas** y enmendarlas pasa por el gate humano; y los mensajes de validación del backend son ingleses, así que hay una segunda feature detrás. Hoy la app está **mezclada**: no decidir también cuesta |
| **B** | **Fotografía y *fallback*** | Los heroes del Make asumen foto por mascota. Sin foto, un hero de 340 px queda vacío. Opciones: ilustración por especie / degradado con inicial / foto obligatoria en el alta |
| **C** | **Geocodificación inversa** | La dirección literal (Home y Mapa, y el brief §Pilar 1 la pide) exige un proveedor de pago. Decidir proveedor, presupuesto y política de caché — o aceptar mostrar coordenadas |
| **D** | **Pasos** | El contador de pasos del hero de la Home no se puede construir sin saber si el collar lo reporta. **Es una pregunta de hardware, no de backend.** Si no lo reporta, hay que rediseñar ese cuadrante del hero |
| **E** | **Fidelidad vs funcionalidad** | El Make **oculta** datos reales que la app ya muestra (rejilla del mapa, perfil nutricional, advertencias del plan, `myRole`) y **no dibuja** el estado 402 de "sin suscripción". Decidir si el diseño manda (y se pierden), o si cada spec debe conservarlos y diseñar lo que falta |
| **F** | **Modelo de geocerca** | En el esquema, una geocerca pertenece a **una** mascota (`geofences.pet_id` NOT NULL, único `(pet_id, name)`). El mock sugiere zonas compartidas con "N mascotas dentro". Si eso es lo que se quiere, es un cambio de modelo N:M + endpoint agregado. **Del mock no se deduce** |
| **G** | **Umbral de "en línea"** | `connectivity` está roto (§2.3.2) y no existe en el repo ningún valor de cuántos segundos de silencio convierten a una mascota en "desconectada". Sin ese número, la píldora "En línea" no se puede implementar |
| **H** | **Canal de bajada al collar** | Toda la pantalla `GpsConfigScreen` (intervalo, ahorro de energía, LED, buzzer, apagar el GPS) asume escribir al dispositivo. La integración con Wialon es **solo lectura**. Antes de especificar nada: ¿existe API de comandos y está contratada? |
| **I** | **Acento** | La carta §11 ya declaró la desviación (`#178255` en vez de `#2AB87C`) por accesibilidad. Los heroes y CTAs nuevos heredarán esa desviación y el smoke lado a lado la verá. **Se asume, no se re-litiga** — pero conviene que el humano lo tenga presente al comparar |
| **J** | **Alcance total** | §7 propone **29 features** (4 + 5 + 5 + 9 + 6). Es un rediseño largo, no un pulido. Decidir si se ataca completo, o solo Bloque 0 + Bloque 1 —nueve features, la Home, que es lo que el humano vio— y se para a reevaluar |

---

## 9. Recomendación (sin implementar nada)

1. **Empezar por el Bloque 0.** Sin tokens pastel y sin cerrar el idioma, cada
   feature posterior arrastra deuda o rompe el grep-clean de la carta. Y
   `pets-list-response-enrichment` es literalmente el fichero que impide que
   ninguna mascota tenga foto en ningún listado.
2. **Después, el Bloque 1 completo.** Es lo que el humano vio y lo que el brief
   §18 exige que la Home responda. Cuatro de sus cinco features son **UI pura con
   datos ya servidos** — la relación valor/coste más alta de todo el informe, y
   la gráfica semanal se dibuja con datos que la app **ya está descargando**.
3. **`mobile-alerts-center` y `mobile-geofences-screen` son la sorpresa barata**:
   dos pantallas enteras del diseño cuyo backend está terminado y **sin un solo
   consumidor**. Ninguna de las dos necesita backend nuevo (con las acotaciones
   de §2.4: punto rojo en vez de número, y decisión F cerrada).
4. **`device-settings` es la trampa cara.** Parece una pantalla más del Make y en
   realidad exige un canal de escritura al collar que no existe. **No debe
   entrar en ninguna spec hasta cerrar la decisión H.**
5. **No versionar el brief del Make** (es una copia obsoleta que dice Flutter y
   Supabase) ni los `image-*.png` (capturas, una de ellas marketing de la
   competencia). Del export, solo el logo tiene valor duradero.
6. **Cerrar A, B, C, D, F, G y H antes de escribir la primera spec** que las
   toque: son exactamente el tipo de decisión abierta que, si llega sin cerrar al
   handoff, Codex CLI no puede resolver por escrito — y varias de ellas
   (geocoding, podómetro, comandos al collar) ni siquiera son decisiones de
   ingeniería, sino de coste y de contrato con el proveedor.
