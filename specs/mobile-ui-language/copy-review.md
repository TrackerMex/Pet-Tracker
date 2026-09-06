---
feature: "mobile-ui-language"
status: draft        # draft | approved
tags: [harness, spec, revision-humana]
---

# Revisión de copy — [[mobile-ui-language]]

> **Esta hoja NO es normativa.** La normativa es [[design]] §2, que es la misma
> tabla más lo que necesita la implementación. Esta es la vista para leerla de
> corrido. **Lo que cambies aquí lo propago yo a `design.md` §2 antes del
> handoff a Codex.**

Feature #65. Desde el 2026-09-05 la feature es **catálogo de dos idiomas más
interruptor en Profile**, no una traducción: la app se podrá cambiar entre
español e inglés, con **español por defecto**. Así que ahora hay **dos**
columnas de copy y las dos son producto.

Son **323 filas** (320 ocurrencias de pantalla más las 3 del interruptor)
sobre **255 claves** distintas. Una clave que aparece en varias filas es la
misma cadena usada en varios sitios y **se traduce igual en todas**.

## Qué tienes que mirar, y qué no

- **El español de todas las filas.** Es lo que verá el usuario por defecto.
- **El inglés de 14 filas marcadas `·inglés nuevo`.** Son las 11 cadenas que
  hoy **ya estaban en español** en el código (`Información`, `Datos básicos`,
  `Dispositivo GPS`…) más las 3 del interruptor. Su inglés **no existe
  todavía**: es copy nueva. Si no se firma, quien elija inglés seguiría viendo
  español suelto.
- **El inglés del resto no se toca**: es el literal que ya está en el código
  hoy, y cambiarlo sería reescribir la app en inglés, que no es esta feature.
- Las filas `·param` llevan un valor dentro (`{{minutes}}`, `{{kcal}}`). El
  hueco tiene que sobrevivir en los dos idiomas; el orden de la frase alrededor
  puede cambiar.

Tres formas de devolvérmelo: editas la tabla y commiteas, me dices números de
fila, o firmas tal cual con la casilla del final.

## Criterios ya decididos, mirables con ojo crítico

- **Tuteo, no usted.**
- Donde el Make daba la palabra en español, se usó la del diseño: `En línea`,
  `pasos hoy`, `Accesos rápidos`, `Ver todos`.
- Los errores de servidor se traducen a lenguaje de usuario, no literal.
- **`Español` y `English` valen igual en los dos idiomas**, a propósito: son
  endónimos. Un menú que traduce los nombres de los idiomas es justo lo que
  impide salir de un idioma que no entiendes.
- Las unidades (`kg`, `km`, `kcal`, el símbolo de porcentaje) **no** entran al
  catálogo: son símbolos, no palabras.

> Lo que seguirá saliendo en inglés en los dos idiomas: los mensajes de
> validación que devuelve el backend y cinco enums que la API pinta crudos.
> Está declarado en [[requirements]]. Si los quieres dentro, dilo antes del
> handoff.

---

## R1 — grupo (auth)


**`mobile-pet-tracker/src/app/(auth)/login.tsx`**

| # | Línea | Clave | Inglés | Español |
|---|---|---|---|---|
| 1 | 31 | `login.invalidCredentials` | `Invalid credentials` | `Credenciales inválidas` |
| 2 | 34 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
| 3 | 41 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 4 | 44 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 5 | 66 | `login.signIn` | `Sign in` | `Iniciar sesión` |
| 6 | 70 | `login.email` | `Email` | `Correo electrónico` |
| 7 | 83 | `login.password` | `Password` | `Contraseña` |
| 8 | 107 | `login.signIn` | `Sign in` | `Iniciar sesión` |
| 9 | 117 | `login.createAccount` | `Create account` | `Crear cuenta` |
| 10 | 126 | `login.forgotPassword` | `Forgot password?` | `¿Olvidaste tu contraseña?` |

**`mobile-pet-tracker/src/app/(auth)/forgot.tsx`**

| # | Línea | Clave | Inglés | Español |
|---|---|---|---|---|
| 11 | 37 | `forgot.forgotPassword` | `Forgot password` | `Recuperar contraseña` |
| 12 | 40 | `forgot.comingSoon` | `Password recovery coming soon` | `La recuperación de contraseña estará disponible pronto` |
| 13 | 44 | `forgot.email` | `Email` | `Correo electrónico` |
| 14 | 60 | `forgot.sendRecoveryLink` | `Send recovery link` | `Enviar enlace de recuperación` |
| 15 | 66 | `forgot.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |

**`mobile-pet-tracker/src/app/(auth)/register.tsx`**

| # | Línea | Clave | Inglés | Español |
|---|---|---|---|---|
| 16 | 120 | `register.emailAlreadyRegistered` | `Email already registered` | `Ese correo ya está registrado` |
| 17 | 129 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
| 18 | 133 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 19 | 136 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 20 | 156 | `register.createAccount` | `Create account` | `Crear cuenta` |
| 21 | 161 | `register.firstName` | `First name` | `Nombres` |
| 22 | 176 | `register.lastName` | `Last name` | `Apellidos` |
| 23 | 188 | `register.email` | `Email` | `Correo electrónico` |
| 24 | 201 | `register.phone` | `Phone` | `Teléfono` |
| 25 | 214 | `register.password` | `Password` | `Contraseña` |
| 26 | 228 | `register.confirmPassword` | `Confirm password` | `Confirmar contraseña` |
| 27 | 244 | `register.country` | `Country (2-letter code)` | `País (código de 2 letras)` |
| 28 | 263 | `register.iAcceptTerms` | `I accept the terms` | `Acepto los términos` |
| 29 | 279 | `register.createAccount` | `Create account` | `Crear cuenta` |

## R2 — barra de pestañas


**`mobile-pet-tracker/src/components/floating-tab-bar.tsx`**

| # | Línea | Clave | Inglés | Español |
|---|---|---|---|---|
| 30 | 49 | `tabs.home` | `Home` | `Inicio` |
| 31 | 50 | `tabs.map` | `Map` | `Mapa` |
| 32 | 51 | `tabs.health` | `Health` | `Salud` |
| 33 | 52 | `tabs.food` | `Food` | `Nutrición` |
| 34 | 53 | `tabs.profile` | `Profile` | `Perfil` |

## R3 — Home


**`mobile-pet-tracker/src/app/(tabs)/home.tsx`**

| # | Línea | Clave | Inglés | Español |
|---|---|---|---|---|
| 35 | 47 | `home.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
| 36 | 48 | `home.lastSeen` | `Last seen {{date}}` ·param | `Última señal {{date}}` |
| 37 | 110 | `home.home` | `Home` | `Inicio` |
| 38 | 119 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 39 | 122 | `common.retry` | `Retry` | `Reintentar` |
| 40 | 129 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
| 41 | 147 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 42 | 149 | `common.retry` | `Retry` | `Reintentar` |
| 43 | 197 | `home.free` | `Free` | `Sin collar` |
| 44 | 199 | `home.online` | `Online` | `En línea` |
| 45 | 200 | `home.offline` | `Offline` | `Sin conexión` |
| 46 | 233 | `home.noCollar` | `No collar — health only` | `Sin collar — solo salud` |
| 47 | 245 | `home.pairCollar` | `Pair a collar` | `Vincular collar` |
| 48 | 256 | `home.summaryTitle` | `Today&apos;s Summary` | `Resumen de hoy` |
| 49 | 265 | `home.activityNeedsCollar` | `Activity tracking requires a collar` | `La actividad requiere un collar` |
| 50 | 273 | `home.couldNotLoadActivity` | `Could not load activity` | `No se pudo cargar la actividad` |
| 51 | 289 | `home.activity` | `Activity` | `Actividad` |
| 52 | 301 | `home.sleep` | `Sleep` | `Descanso` |
| 53 | 313 | `home.distance` | `Distance` | `Distancia` |
| 54 | 332 | `home.viewOnMap` | `View on map` | `Ver en el mapa` |

## R4 — Map


**`mobile-pet-tracker/src/app/(tabs)/map.tsx`**

| # | Línea | Clave | Inglés | Español |
|---|---|---|---|---|
| 55 | 60 | `map.justNow` | `Just now` | `Justo ahora` |
| 56 | 61 | `map.agoMinutes` | `{{minutes}}m ago` ·param | `hace {{minutes}} min` |
| 57 | 62 | `map.agoHours` | `{{hours}}h ago` ·param | `hace {{hours}} h` |
| 58 | 196 | `map.noSignal` | `No signal` | `Sin señal` |
| 59 | 198 | `map.live` | `Live` | `En vivo` |
| 60 | 199 | `map.stale` | `Stale` | `Desactualizado` |
| 61 | 210 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 62 | 213 | `common.retry` | `Retry` | `Reintentar` |
| 63 | 221 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
| 64 | 229 | `map.trackingNeedsCollar` | `Live tracking requires a collar` | `El rastreo en vivo requiere un collar` |
| 65 | 240 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 66 | 243 | `common.retry` | `Retry` | `Reintentar` |
| 67 | 269 | `map.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
| 68 | 299 | `map.speed` | `Speed` | `Velocidad` |
| 69 | 315 | `map.distance` | `Distance` | `Distancia` |
| 70 | 333 | `map.updated` | `Updated` | `Actualizado` |
| 71 | 366 | `map.deactivateLostMode` | `Deactivate Lost Mode` | `Desactivar modo perdido` |
| 72 | 367 | `map.activateLostMode` | `Activate Lost Mode` | `Activar modo perdido` |
| 73 | 376 | `map.couldNotUpdateLostMode` | `Could not update Lost Mode` | `No se pudo cambiar el modo perdido` |

## R5 — Health, log de peso y gráfica


**`mobile-pet-tracker/src/app/(tabs)/health.tsx`**

| # | Línea | Clave | Inglés | Español |
|---|---|---|---|---|
| 74 | 91 | `health.health` | `Health` | `Salud` |
| 75 | 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 76 | 103 | `common.retry` | `Retry` | `Reintentar` |
| 77 | 110 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
| 78 | 127 | `health.vaccines` | `Vaccines` | `Vacunas` |
| 79 | 151 | `health.nextDue` | `Next due` | `Próxima dosis` |
| 80 | 165 | `health.noVaccinesYet` | `No vaccines yet` | `Aún no hay vacunas` |
| 81 | 173 | `health.couldNotLoadVaccines` | `Could not load vaccines` | `No se pudieron cargar las vacunas` |
| 82 | 176 | `common.retry` | `Retry` | `Reintentar` |
| 83 | 217 | `health.weight` | `Weight` | `Peso` |
| 84 | 243 | `health.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
| 85 | 249 | `health.couldNotLoadWeight` | `Could not load weight` | `No se pudo cargar el peso` |
| 86 | 261 | `health.weightLog` | `Weight log` | `Registro de peso` |

**`mobile-pet-tracker/src/app/(tabs)/weight-log.tsx`**

| # | Línea | Clave | Inglés | Español |
|---|---|---|---|---|
| 87 | 72 | `weightLog.enterValidWeight` | `Enter a valid weight` | `Introduce un peso válido` |
| 88 | 99 | `weightLog.errorForbidden` | `Only the owner can log weights` | `Solo el dueño puede registrar pesos` |
| 89 | 102 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
| 90 | 109 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 91 | 112 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 92 | 133 | `weightLog.backToHealth` | `Back to health` | `Volver a Salud` |
| 93 | 141 | `weightLog.weightLog` | `Weight log` | `Registro de peso` |
| 94 | 154 | `weightLog.weight` | `Weight` | `Peso` |
| 95 | 160 | `weightLog.weightKg` | `Weight (kg)` | `Peso (kg)` |
| 96 | 167 | `weightLog.measuredAt` | `Measured at` | `Fecha de medición` |
| 97 | 172 | `weightLog.yyyyMmDd` | `YYYY-MM-DD` | `AAAA-MM-DD` |
| 98 | 179 | `weightLog.bodyCondition` | `Body condition` | `Condición corporal` |
| 99 | 185 | `weightLog.bodyConditionPlaceholder` | `Body condition 1-9 (optional)` | `Condición corporal 1-9 (opcional)` |
| 100 | 204 | `weightLog.logWeight` | `Log weight` | `Registrar peso` |
| 101 | 220 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 102 | 223 | `common.retry` | `Retry` | `Reintentar` |
| 103 | 230 | `weightLog.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
| 104 | 284 | `weightLog.bodyConditionValue` | `BC {{value}}/9` ·param | `CC {{value}}/9` |

**`mobile-pet-tracker/src/components/weight-chart.tsx`**

| # | Línea | Clave | Inglés | Español |
|---|---|---|---|---|
| 105 | 20 | `weightChart.notEnoughDataYet` | `Not enough data yet` | `Aún no hay datos suficientes` |

## R6 — Food y Meal schedule


**`mobile-pet-tracker/src/app/(tabs)/food.tsx`**

| # | Línea | Clave | Inglés | Español |
|---|---|---|---|---|
| 106 | 80 | `food.food` | `Food` | `Nutrición` |
| 107 | 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 108 | 94 | `common.retry` | `Retry` | `Reintentar` |
| 109 | 101 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
| 110 | 144 | `food.dailyTarget` | `Daily target` | `Objetivo diario` |
| 111 | 150 | `food.dailyKcal` | `{{kcal}} kcal / day` ·param | `{{kcal}} kcal / día` |
| 112 | 156 | `food.dailyGrams` | `{{grams}} g / day` ·param | `{{grams}} g / día` |
| 113 | 174 | `food.mealsToday` | `Meals today` | `Comidas hoy` |
| 114 | 224 | `food.pending` | `Pending` | `Pendiente` |
| 115 | 224 | `food.served` | `Served` | `Servido` |
| 116 | 259 | `food.aiRecommendation` | `AI recommendation` | `Recomendación IA` |
| 117 | 272 | `food.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
| 118 | 281 | `food.couldNotLoadPlan` | `Could not load meal plan` | `No se pudo cargar el plan de alimentación` |
| 119 | 284 | `common.retry` | `Retry` | `Reintentar` |
| 120 | 296 | `food.mealSchedule` | `Meal schedule` | `Horario de comidas` |
| 121 | 299 | `food.mealScheduleLinkSubtitle` | `View nutrition profile and times` | `Ver el perfil nutricional y los horarios` |

**`mobile-pet-tracker/src/app/(tabs)/meal-schedule.tsx`**

| # | Línea | Clave | Inglés | Español |
|---|---|---|---|---|
| 122 | 83 | `mealSchedule.errorForbidden` | `Only the owner can generate the plan` | `Solo el dueño puede generar el plan` |
| 123 | 87 | `mealSchedule.errorProfileRequired` | `Create a nutrition profile first` | `Primero crea un perfil nutricional` |
| 124 | 89 | `mealSchedule.registerWeightFirst` | `Register a weight first` | `Primero registra un peso` |
| 125 | 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 126 | 95 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
| 127 | 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 128 | 105 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 129 | 126 | `mealSchedule.backToFood` | `Back to food` | `Volver a Nutrición` |
| 130 | 135 | `mealSchedule.mealSchedule` | `Meal schedule` | `Horario de comidas` |
| 131 | 160 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 132 | 163 | `common.retry` | `Retry` | `Reintentar` |
| 133 | 178 | `mealSchedule.dailyTarget` | `Daily target` | `Objetivo diario` |
| 134 | 184 | `mealSchedule.dailyGrams` | `{{grams}} g / day` ·param | `{{grams}} g / día` |
| 135 | 190 | `mealSchedule.mealsPerDay` | `{{meals}} meals / day` ·param | `{{meals}} comidas / día` |
| 136 | 198 | `mealSchedule.timesAndPortions` | `Times and portions` | `Horarios y porciones` |
| 137 | 232 | `mealSchedule.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
| 138 | 250 | `mealSchedule.generatePlan` | `Generate plan` | `Generar plan` |
| 139 | 269 | `mealSchedule.nutritionProfile` | `Nutrition profile` | `Perfil nutricional` |
| 140 | 297 | `mealSchedule.noNutritionProfileYet` | `No nutrition profile yet` | `Aún no hay perfil nutricional` |

## R7 — Profile y Documentos


**`mobile-pet-tracker/src/screens/profile/index.tsx`**

| # | Línea | Clave | Inglés | Español |
|---|---|---|---|---|
| 141 | 49 | `profile.notRegistered` | `Not registered` **·inglés nuevo** | `No registrado` |
| 142 | 85 | `profile.sterilized` | `Sterilized` | `Esterilizado` |
| 143 | 86 | `profile.notSterilized` | `Not sterilized` | `Sin esterilizar` |
| 144 | 87 | `profile.ageMonths` | `{{months}} months` ·param | `{{months}} meses` |
| 145 | 157 | `profile.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
| 146 | 174 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
| 147 | 186 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
| 148 | 192 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
| 149 | 211 | `profile.profile` | `Profile` | `Perfil` |
| 150 | 219 | `profile.addPet` | `Add pet` | `Añadir mascota` |
| 151 | 234 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
| 152 | 240 | `profile.couldNotLoadPets` | `Could not load pets` | `No se pudieron cargar las mascotas` |
| 153 | 253 | `profile.couldNotLoadPet` | `Could not load pet profile` | `No se pudo cargar el perfil de la mascota` |
| 154 | 255 | `common.retry` | `Retry` | `Reintentar` |
| 155 | 272 | `profile.changePhoto` | `Change photo` | `Cambiar foto` |
| 156 | 283 | `profile.information` | `Information` **·inglés nuevo** | `Información` |
| 157 | 285 | `profile.breed` | `Breed` **·inglés nuevo** | `Raza` |
| 158 | 286 | `profile.microchip` | `Microchip` **·inglés nuevo** | `Microchip` |
| 159 | 287 | `profile.gpsDevice` | `GPS device` **·inglés nuevo** | `Dispositivo GPS` |
| 160 | 290 | `profile.lastSignal` | `Last signal` **·inglés nuevo** | `Última señal` |
| 161 | 307 | `profile.documents` | `Documents` **·inglés nuevo** | `Documentos` |
| 162 | 319 | `profile.gpsSettings` | `GPS device settings` **·inglés nuevo** | `Configuración del Dispositivo GPS` |
| 163 | 334 | `profile.reminders` | `Reminders` | `Recordatorios` |
| 164 | 340 | `profile.account` | `Account` | `Cuenta` |
| 165 | 355 | `profile.accountUnavailable` | `Account unavailable` | `Cuenta no disponible` |
| 166 | 365 | `profile.useDarkTheme` | `Use dark theme` | `Usar tema oscuro` |
| 167 | 365 | `profile.useLightTheme` | `Use light theme` | `Usar tema claro` |
| 168 | 376 | `profile.signOut` | `Sign out` | `Cerrar sesión` |

**`mobile-pet-tracker/src/screens/docs/index.tsx`**

| # | Línea | Clave | Inglés | Español |
|---|---|---|---|---|
| 169 | 68 | `docs.backToProfile` | `Back to profile` | `Volver a Perfil` |
| 170 | 79 | `docs.documentsOf` | `Documents of` **·inglés nuevo** | `Documentos de` |
| 171 | 85 | `docs.pet` | `Pet` | `Mascota` |
| 172 | 101 | `docs.noDocumentsYet` | `No documents yet` | `Aún no hay documentos` |
| 173 | 103 | `docs.emptyBody` | `Medical documents will appear here.` | `Los documentos médicos aparecerán aquí.` |
| 174 | 116 | `docs.couldNotLoadDocuments` | `Could not load documents` | `No se pudieron cargar los documentos` |
| 175 | 118 | `common.retry` | `Retry` | `Reintentar` |

## R8 — Recordatorios y su alta


**`mobile-pet-tracker/src/screens/reminders/index.tsx`**

| # | Línea | Clave | Inglés | Español |
|---|---|---|---|---|
| 176 | 87 | `reminders.errorForbidden` | `Only the owner can delete` | `Solo el dueño puede eliminar` |
| 177 | 90 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
| 178 | 97 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 179 | 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 180 | 136 | `reminders.reminders` | `Reminders` | `Recordatorios` |
| 181 | 143 | `reminders.new` | `New` | `Nuevo` |
| 182 | 171 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 183 | 174 | `common.retry` | `Retry` | `Reintentar` |
| 184 | 182 | `reminders.noRemindersYet` | `No reminders yet` | `Aún no hay recordatorios` |
| 185 | 211 | `reminders.active` | `Active` | `Activos` |
| 186 | 236 | `reminders.thisWeek` | `This week` | `Esta semana` |
| 187 | 253 | `reminders.inactive` | `Inactive` | `Inactivos` |
| 188 | 285 | `reminders.upcoming` | `Upcoming!` | `¡Próximo!` |
| 189 | 301 | `reminders.cancelled` | `Cancelled` | `Cancelado` |
| 190 | 301 | `reminders.sent` | `Sent` | `Enviado` |
| 191 | 305 | `reminders.dueInDays` | `· in {{days}} days` ·param | `· en {{days}} días` |
| 192 | 319 | `reminders.delete` | `Delete` | `Eliminar` |
| 193 | 342 | `reminders.deleteReminder` | `Delete reminder?` | `¿Eliminar recordatorio?` |
| 194 | 351 | `reminders.deleteSheetBody` | `This action cannot be undone.` | `Esta acción no se puede deshacer.` |
| 195 | 361 | `reminders.delete` | `Delete` | `Eliminar` |
| 196 | 370 | `reminders.cancel` | `Cancel` | `Cancelar` |

**`mobile-pet-tracker/src/utils/reminder-meta.ts`**

| # | Línea | Clave | Inglés | Español |
|---|---|---|---|---|
| 197 | 7 | `reminderType.vaccine` | `Vaccine` | `Vacuna` |
| 198 | 8 | `reminderType.deworming` | `Deworming` | `Desparasitación` |
| 199 | 9 | `reminderType.medication` | `Medication` | `Medicamento` |
| 200 | 10 | `reminderType.appointment` | `Appointment` | `Consulta` |
| 201 | 11 | `reminderType.weight` | `Weight` | `Peso` |
| 202 | 12 | `reminderType.food` | `Food` | `Comida` |
| 203 | 13 | `reminderType.other` | `Other` | `Otro` |

**`mobile-pet-tracker/src/screens/add-reminder/index.tsx`**

| # | Línea | Clave | Inglés | Español |
|---|---|---|---|---|
| 204 | 21 | `addReminder.advanceSameDay` | `Same day` | `El mismo día` |
| 205 | 22 | `addReminder.advance1Day` | `1 day before` | `1 día antes` |
| 206 | 23 | `addReminder.advance3Days` | `3 days before` | `3 días antes` |
| 207 | 24 | `addReminder.advance7Days` | `7 days before` | `7 días antes` |
| 208 | 56 | `addReminder.titleIsRequired` | `Title is required` | `El título es obligatorio` |
| 209 | 60 | `addReminder.pickDate` | `Pick a date` | `Elige una fecha` |
| 210 | 66 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
| 211 | 86 | `addReminder.errorForbidden` | `Only the owner can create reminders` | `Solo el dueño puede crear recordatorios` |
| 212 | 89 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
| 213 | 92 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
| 214 | 99 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 215 | 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 216 | 122 | `addReminder.backToReminders` | `Back to reminders` | `Volver a Recordatorios` |
| 217 | 132 | `addReminder.addReminder` | `Add reminder` | `Agregar recordatorio` |
| 218 | 138 | `addReminder.type` | `Type` | `Tipo` |
| 219 | 169 | `addReminder.title` | `Title` | `Título` |
| 220 | 176 | `addReminder.reminderTitle` | `Reminder title` | `Título del recordatorio` |
| 221 | 186 | `addReminder.date` | `Date` | `Fecha` |
| 222 | 196 | `addReminder.selectDate` | `Select a date` | `Elige una fecha` |
| 223 | 202 | `addReminder.time` | `Time` | `Hora` |
| 224 | 256 | `addReminder.alert` | `Alert` | `Aviso` |
| 225 | 292 | `addReminder.saveReminder` | `Save reminder` | `Guardar recordatorio` |

## R9 — Alta de mascota


**`mobile-pet-tracker/src/screens/add-pet/index.tsx`**

| # | Línea | Clave | Inglés | Español |
|---|---|---|---|---|
| 226 | 114 | `addPet.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
| 227 | 148 | `addPet.nameIsRequired` | `Name is required` | `El nombre es obligatorio` |
| 228 | 155 | `addPet.chooseBirthDate` | `Choose a birth date` | `Elige una fecha de nacimiento` |
| 229 | 162 | `addPet.errorAgeRange` | `Enter an age from 0 to 480 months` | `Introduce una edad de 0 a 480 meses` |
| 230 | 189 | `addPet.errorPhotoAfterCreate` | `Pet created, but the photo could not be uploaded` | `Se creó la mascota, pero no se pudo subir la foto` |
| 231 | 198 | `addPet.checkPetDetails` | `Check the pet details` | `Revisa los datos de la mascota` |
| 232 | 201 | `addPet.youCannotCreatePet` | `You cannot create a pet` | `No puedes crear una mascota` |
| 233 | 204 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
| 234 | 208 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 235 | 211 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 236 | 231 | `addPet.backToProfile` | `Back to profile` | `Volver a Perfil` |
| 237 | 240 | `addPet.addPet` | `Add pet` | `Nueva mascota` |
| 238 | 245 | `addPet.pet` | `Pet` | `Mascota` |
| 239 | 250 | `addPet.avatarPreview` | `Avatar preview` | `Vista previa del avatar` |
| 240 | 259 | `addPet.choosePhoto` | `Choose photo` | `Elegir foto` |
| 241 | 269 | `addPet.basicDetails` | `Basic details` **·inglés nuevo** | `Datos básicos` |
| 242 | 272 | `addPet.species` | `Species` | `Tipo de mascota` |
| 243 | 289 | `addPet.cat` | `Cat` | `Gato` |
| 244 | 289 | `addPet.dog` | `Dog` | `Perro` |
| 245 | 297 | `addPet.name` | `Name` | `Nombre` |
| 246 | 303 | `addPet.petName` | `Pet name` | `Nombre de la mascota` |
| 247 | 311 | `addPet.breed` | `Breed` | `Raza` |
| 248 | 317 | `addPet.optional` | `Optional` | `Opcional` |
| 249 | 325 | `addPet.sex` | `Sex` | `Sexo` |
| 250 | 327 | `addPet.female` | `Female` | `Hembra` |
| 251 | 328 | `addPet.male` | `Male` | `Macho` |
| 252 | 333 | `addPet.size` | `Size` | `Tamaño` |
| 253 | 335 | `addPet.small` | `Small` | `Pequeño` |
| 254 | 336 | `addPet.medium` | `Medium` | `Mediano` |
| 255 | 337 | `addPet.large` | `Large` | `Grande` |
| 256 | 341 | `addPet.medicalDetails` | `Medical details` **·inglés nuevo** | `Datos médicos` |
| 257 | 344 | `addPet.age` | `Age` | `Edad` |
| 258 | 347 | `addPet.birthDate` | `Birth date` | `Fecha de nacimiento` |
| 259 | 348 | `addPet.approxMonths` | `Approx. months` | `Meses aprox.` |
| 260 | 376 | `addPet.selectBirthDate` | `Select a birth date` | `Elige una fecha de nacimiento` |
| 261 | 386 | `addPet.months` | `Months` | `Meses` |
| 262 | 412 | `addPet.sterilized` | `Sterilized` | `Esterilizado/a` |
| 263 | 414 | `addPet.yes` | `Yes` | `Sí` |
| 264 | 426 | `addPet.optional` | `Optional` | `Opcional` |
| 265 | 440 | `addPet.savePet` | `Save pet` | `Guardar mascota` |

## R10 — Emparejado del collar


**`mobile-pet-tracker/src/screens/pairing/index.tsx`**

| # | Línea | Clave | Inglés | Español |
|---|---|---|---|---|
| 266 | 126 | `pairing.errorInvalidCode` | `Invalid activation code. Check the code printed on the box.` | `Código de activación no válido. Revisa el código impreso en la caja.` |
| 267 | 130 | `pairing.errorAlreadyClaimed` | `This collar is already paired to another pet.` | `Este collar ya está vinculado a otra mascota.` |
| 268 | 133 | `pairing.errorPetHasDevice` | `This pet already has a collar. Unpair it first.` | `Esta mascota ya tiene un collar. Desvincúlalo primero.` |
| 269 | 137 | `pairing.errorNoSubscription` | `This collar has no active plan. Contact support to activate it.` | `Este collar no tiene un plan activo. Contacta con soporte para activarlo.` |
| 270 | 141 | `pairing.errorForbiddenClaim` | `Only the owner can pair a collar.` | `Solo el dueño puede vincular un collar.` |
| 271 | 147 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
| 272 | 151 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 273 | 155 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 274 | 189 | `pairing.errorForbiddenRelease` | `Only the owner can unpair the collar.` | `Solo el dueño puede desvincular el collar.` |
| 275 | 195 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
| 276 | 199 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 277 | 203 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 278 | 212 | `pairing.unpairAlertTitle` | `Unpair collar?` | `¿Desvincular collar?` |
| 279 | 213 | `pairing.unpairAlertBody` | `Location history stays, but live tracking stops until you pair a collar again.` | `El historial de ubicaciones se conserva, pero el rastreo en vivo se detiene hasta que vincules otro collar.` |
| 280 | 215 | `pairing.cancel` | `Cancel` | `Cancelar` |
| 281 | 217 | `pairing.unpair` | `Unpair` | `Desvincular` |
| 282 | 238 | `pairing.back` | `Back` | `Volver` |
| 283 | 267 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 284 | 270 | `common.retry` | `Retry` | `Reintentar` |
| 285 | 277 | `pairing.addPetFirst` | `Add a pet first` | `Primero añade una mascota` |
| 286 | 302 | `pairing.trackerIsReady` | `Tracker is ready` | `El collar está listo` |
| 287 | 305 | `pairing.readySubtitle` | `{{petName}}'s collar is paired. GPS tracking is on.` ·param | `El collar de {{petName}} está vinculado. El rastreo GPS está activo.` |
| 288 | 312 | `pairing.model` | `Model` | `Modelo` |
| 289 | 330 | `pairing.viewOnMap` | `View on map` | `Ver en el mapa` |
| 290 | 340 | `pairing.done` | `Done` | `Listo` |
| 291 | 348 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
| 292 | 357 | `pairing.freePlanPairPrompt` | `Free plan — health only. Pair a collar with an active plan to see the map.` | `Plan gratuito — solo salud. Vincula un collar con plan activo para ver el mapa.` |
| 293 | 364 | `pairing.activationCode` | `Activation code` | `Código de activación` |
| 294 | 377 | `pairing.printedOnCollarBox` | `Printed on the collar box` | `Impreso en la caja del collar` |
| 295 | 388 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
| 296 | 397 | `pairing.gpsDevice` | `GPS device` | `Dispositivo GPS` |
| 297 | 403 | `pairing.model` | `Model` | `Modelo` |
| 298 | 408 | `pairing.battery` | `Battery` | `Batería` |
| 299 | 417 | `pairing.connection` | `Connection` | `Conexión` |
| 300 | 422 | `pairing.lastMessage` | `Last message` | `Último mensaje` |
| 301 | 429 | `pairing.noMessagesYet` | `No messages yet` | `Sin mensajes todavía` |
| 302 | 453 | `pairing.gpsTrackingActive` | `GPS tracking active` | `Rastreo GPS activo` |
| 303 | 461 | `pairing.freePlanNoActivePlan` | `Free plan — health only. This collar has no active plan.` | `Plan gratuito — solo salud. Este collar no tiene plan activo.` |
| 304 | 468 | `pairing.planStatusUnavailable` | `Plan status unavailable` | `Estado del plan no disponible` |
| 305 | 479 | `pairing.unpairCollar` | `Unpair collar` | `Desvincular collar` |

## R11 — Restablecer contraseña


**`mobile-pet-tracker/src/screens/reset-password/index.tsx`**

| # | Línea | Clave | Inglés | Español |
|---|---|---|---|---|
| 306 | 36 | `resetPassword.errorInvalidToken` | `Reset link is invalid or already used. Request a new one.` | `El enlace no es válido o ya se usó. Solicita uno nuevo.` |
| 307 | 40 | `resetPassword.errorExpiredToken` | `Reset link expired. Request a new one.` | `El enlace caducó. Solicita uno nuevo.` |
| 308 | 46 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
| 309 | 50 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 310 | 53 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
| 311 | 77 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
| 312 | 84 | `resetPassword.errorMissingToken` | `This reset link is incomplete. Open the link from your email again.` | `Este enlace está incompleto. Ábrelo de nuevo desde tu correo.` |
| 313 | 88 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
| 314 | 113 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
| 315 | 120 | `resetPassword.passwordUpdated` | `Password updated` | `Contraseña actualizada` |
| 316 | 128 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
| 317 | 151 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
| 318 | 156 | `resetPassword.newPassword` | `New password` | `Nueva contraseña` |
| 319 | 171 | `resetPassword.confirmNewPassword` | `Confirm new password` | `Confirmar nueva contraseña` |
| 320 | 197 | `resetPassword.updatePassword` | `Update password` | `Actualizar contraseña` |

## R14 — Interruptor de idioma


**`mobile-pet-tracker/src/screens/profile/index.tsx`**

| # | Línea | Clave | Inglés | Español |
|---|---|---|---|---|
| 321 | — | `profile.languageSpanish` | `Español` **·inglés nuevo** | `Español` |
| 322 | — | `profile.languageEnglish` | `English` **·inglés nuevo** | `English` |
| 323 | — | `profile.changeLanguage` | `Change language` **·inglés nuevo** | `Cambiar idioma` |

---

## Firma

- [ ] Firmo la redacción de las 323 filas: el español de todas, y el inglés de
      las 14 marcadas `·inglés nuevo` (fecha: ____)

Si editaste alguna fila en vez de firmar tal cual, dilo al firmar para que
propague los cambios a `design.md` §2.
