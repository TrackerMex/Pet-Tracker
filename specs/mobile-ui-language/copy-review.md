---
feature: "mobile-ui-language"
status: draft        # draft | approved
tags: [harness, spec, revision-humana]
---

# Revisión de copy — [[mobile-ui-language]]

> **Esta hoja NO es normativa.** La tabla normativa es
> [[design]] §2, que además lleva la columna `Ausencia` que necesita el test de
> R13. Esta es la misma copy sin esa columna, para que se pueda leer de
> corrido. **Lo que cambies aquí lo propago yo a `design.md` §2 antes del
> handoff a Codex.**

Feature #65. Son **309 filas**: 213 cadenas inglesas distintas, algunas repetidas
en varios archivos. Las repeticiones van marcadas con `·repetida` y **deben
traducirse igual en todas partes** — si quieres que una diverja, dilo y deja de
ser repetición.

## Cómo revisar

Solo importa la última columna: **el español es copy de producto y lo firmas
tú**, no es decisión técnica. El inglés y la línea están para localizar.

Tres formas de devolvérmelo, la que te resulte más cómoda:

1. **Editas esta tabla directamente** y commiteas. Es lo más rápido si son
   muchos cambios.
2. **Me dices los números de fila**: "la 47 mejor 'Peso actual'". Yo edito.
3. **Firmas tal cual** marcando la casilla del final.

Tres cosas que ya decidí y conviene que mires con ojo crítico, porque son
criterio y no traducción:

- **Tuteo, no usted** (`¿Olvidaste tu contraseña?`, no `¿Olvidó su contraseña?`).
- Donde el diseño del Make ya daba la palabra en español, **usé la del diseño**,
  no una traducción mía: `En línea`, `pasos hoy`, `Accesos rápidos`,
  `Recordatorios`, `Ver todos`.
- Los mensajes de error de servidor se traducen a lenguaje de usuario, no
  literal: `Cannot reach server` es `No se pudo conectar con el servidor`.

> Lo que **no** está aquí y seguirá saliendo en inglés después de #65: los
> mensajes de validación que devuelve el backend y cinco enums que la API pinta
> crudos (`female`, `LTE`, `dry`…). Está declarado en
> [[requirements]] §Fuera de alcance 1 y 2. Si los quieres dentro, dilo antes
> del handoff.

---

## R1 — grupo `(auth)`


**`mobile-pet-tracker/src/app/(auth)/login.tsx`** — 10

| # | Línea | Inglés | **Español (revisa esto)** |
|---|---|---|---|
| 1 | 31 | `Invalid credentials` | `Credenciales inválidas` |
| 2 | 34 | `Cannot reach server` | `No se pudo conectar con el servidor` |
| 3 | 41 | `Something went wrong` | `Algo salió mal` |
| 4 | 44 | `Something went wrong` | `Algo salió mal` ·repetida |
| 5 | 66 | `Sign in` | `Iniciar sesión` |
| 6 | 70 | `Email` | `Correo electrónico` |
| 7 | 83 | `Password` | `Contraseña` |
| 8 | 107 | `Sign in` | `Iniciar sesión` ·repetida |
| 9 | 117 | `Create account` | `Crear cuenta` |
| 10 | 126 | `Forgot password?` | `¿Olvidaste tu contraseña?` |

**`mobile-pet-tracker/src/app/(auth)/forgot.tsx`** — 5

| # | Línea | Inglés | **Español (revisa esto)** |
|---|---|---|---|
| 11 | 37 | `Forgot password` | `Recuperar contraseña` |
| 12 | 40 | `Password recovery coming soon` | `La recuperación de contraseña estará disponible pronto` |
| 13 | 44 | `Email` | `Correo electrónico` ·repetida |
| 14 | 60 | `Send recovery link` | `Enviar enlace de recuperación` |
| 15 | 66 | `Back to sign in` | `Volver al inicio de sesión` |

**`mobile-pet-tracker/src/app/(auth)/register.tsx`** — 14

| # | Línea | Inglés | **Español (revisa esto)** |
|---|---|---|---|
| 16 | 120 | `Email already registered` | `Ese correo ya está registrado` |
| 17 | 129 | `Cannot reach server` | `No se pudo conectar con el servidor` ·repetida |
| 18 | 133 | `Something went wrong` | `Algo salió mal` ·repetida |
| 19 | 136 | `Something went wrong` | `Algo salió mal` ·repetida |
| 20 | 156 | `Create account` | `Crear cuenta` ·repetida |
| 21 | 161 | `First name` | `Nombres` |
| 22 | 176 | `Last name` | `Apellidos` |
| 23 | 188 | `Email` | `Correo electrónico` ·repetida |
| 24 | 201 | `Phone` | `Teléfono` |
| 25 | 214 | `Password` | `Contraseña` ·repetida |
| 26 | 228 | `Confirm password` | `Confirmar contraseña` |
| 27 | 244 | `Country (2-letter code)` | `País (código de 2 letras)` |
| 28 | 263 | `I accept the terms` | `Acepto los términos` |
| 29 | 279 | `Create account` | `Crear cuenta` ·repetida |

## R2 — barra de pestañas


**`mobile-pet-tracker/src/components/floating-tab-bar.tsx`** — 5

| # | Línea | Inglés | **Español (revisa esto)** |
|---|---|---|---|
| 30 | 49 | `Home` | `Inicio` |
| 31 | 50 | `Map` | `Mapa` |
| 32 | 51 | `Health` | `Salud` |
| 33 | 52 | `Food` | `Nutrición` |
| 34 | 53 | `Profile` | `Perfil` |

## R3 — Home


**`mobile-pet-tracker/src/app/(tabs)/home.tsx`** — 20

| # | Línea | Inglés | **Español (revisa esto)** |
|---|---|---|---|
| 35 | 47 | `No location data yet` | `Sin datos de ubicación todavía` |
| 36 | 48 | ``Last seen ${new Date(iso).toLocaleString()}`` | ``Última señal ${new Date(iso).toLocaleString()}`` |
| 37 | 110 | `Home` | `Inicio` ·repetida |
| 38 | 119 | `Something went wrong` | `Algo salió mal` ·repetida |
| 39 | 122 | `Retry` | `Reintentar` |
| 40 | 129 | `No pets yet` | `Aún no tienes mascotas` |
| 41 | 147 | `Something went wrong` | `Algo salió mal` ·repetida |
| 42 | 149 | `Retry` | `Reintentar` ·repetida |
| 43 | 197 | `Free` | `Sin collar` |
| 44 | 199 | `Online` | `En línea` |
| 45 | 200 | `Offline` | `Sin conexión` |
| 46 | 233 | `No collar — health only` | `Sin collar — solo salud` |
| 47 | 245 | `Pair a collar` | `Vincular collar` |
| 48 | 256 | `Today&apos;s Summary` | `Resumen de hoy` |
| 49 | 265 | `Activity tracking requires a collar` | `La actividad requiere un collar` |
| 50 | 273 | `Could not load activity` | `No se pudo cargar la actividad` |
| 51 | 289 | `Activity` | `Actividad` |
| 52 | 301 | `Sleep` | `Descanso` |
| 53 | 313 | `Distance` | `Distancia` |
| 54 | 332 | `View on map` | `Ver en el mapa` |

## R4 — Map


**`mobile-pet-tracker/src/app/(tabs)/map.tsx`** — 19

| # | Línea | Inglés | **Español (revisa esto)** |
|---|---|---|---|
| 55 | 60 | `Just now` | `Justo ahora` |
| 56 | 61 | ``${Math.floor(seconds / 60)}m ago`` | ``hace ${Math.floor(seconds / 60)} min`` |
| 57 | 62 | ``${Math.floor(seconds / 3600)}h ago`` | ``hace ${Math.floor(seconds / 3600)} h`` |
| 58 | 196 | `No signal` | `Sin señal` |
| 59 | 198 | `Live` | `En vivo` |
| 60 | 199 | `Stale` | `Desactualizado` |
| 61 | 210 | `Something went wrong` | `Algo salió mal` ·repetida |
| 62 | 213 | `Retry` | `Reintentar` ·repetida |
| 63 | 221 | `No pets yet` | `Aún no tienes mascotas` ·repetida |
| 64 | 229 | `Live tracking requires a collar` | `El rastreo en vivo requiere un collar` |
| 65 | 240 | `Something went wrong` | `Algo salió mal` ·repetida |
| 66 | 243 | `Retry` | `Reintentar` ·repetida |
| 67 | 269 | `No location data yet` | `Sin datos de ubicación todavía` ·repetida |
| 68 | 299 | `Speed` | `Velocidad` |
| 69 | 315 | `Distance` | `Distancia` ·repetida |
| 70 | 333 | `Updated` | `Actualizado` |
| 71 | 366 | `Deactivate Lost Mode` | `Desactivar modo perdido` |
| 72 | 367 | `Activate Lost Mode` | `Activar modo perdido` |
| 73 | 376 | `Could not update Lost Mode` | `No se pudo cambiar el modo perdido` |

## R5 — Health, log de peso y gráfica


**`mobile-pet-tracker/src/app/(tabs)/health.tsx`** — 13

| # | Línea | Inglés | **Español (revisa esto)** |
|---|---|---|---|
| 74 | 91 | `Health` | `Salud` ·repetida |
| 75 | 100 | `Something went wrong` | `Algo salió mal` ·repetida |
| 76 | 103 | `Retry` | `Reintentar` ·repetida |
| 77 | 110 | `No pets yet` | `Aún no tienes mascotas` ·repetida |
| 78 | 127 | `Vaccines` | `Vacunas` |
| 79 | 151 | `Next due` | `Próxima dosis` |
| 80 | 165 | `No vaccines yet` | `Aún no hay vacunas` |
| 81 | 173 | `Could not load vaccines` | `No se pudieron cargar las vacunas` |
| 82 | 176 | `Retry` | `Reintentar` ·repetida |
| 83 | 217 | `Weight` | `Peso` |
| 84 | 243 | `No weight entries yet` | `Aún no hay registros de peso` |
| 85 | 249 | `Could not load weight` | `No se pudo cargar el peso` |
| 86 | 261 | `Weight log` | `Registro de peso` |

**`mobile-pet-tracker/src/app/(tabs)/weight-log.tsx`** — 18

| # | Línea | Inglés | **Español (revisa esto)** |
|---|---|---|---|
| 87 | 72 | `Enter a valid weight` | `Introduce un peso válido` |
| 88 | 99 | `Only the owner can log weights` | `Solo el dueño puede registrar pesos` |
| 89 | 102 | `Cannot reach server` | `No se pudo conectar con el servidor` ·repetida |
| 90 | 109 | `Something went wrong` | `Algo salió mal` ·repetida |
| 91 | 112 | `Something went wrong` | `Algo salió mal` ·repetida |
| 92 | 133 | `Back to health` | `Volver a Salud` |
| 93 | 141 | `Weight log` | `Registro de peso` ·repetida |
| 94 | 154 | `Weight` | `Peso` ·repetida |
| 95 | 160 | `Weight (kg)` | `Peso (kg)` |
| 96 | 167 | `Measured at` | `Fecha de medición` |
| 97 | 172 | `YYYY-MM-DD` | `AAAA-MM-DD` |
| 98 | 179 | `Body condition` | `Condición corporal` |
| 99 | 185 | `Body condition 1-9 (optional)` | `Condición corporal 1-9 (opcional)` |
| 100 | 204 | `Log weight` | `Registrar peso` |
| 101 | 220 | `Something went wrong` | `Algo salió mal` ·repetida |
| 102 | 223 | `Retry` | `Reintentar` ·repetida |
| 103 | 230 | `No weight entries yet` | `Aún no hay registros de peso` ·repetida |
| 104 | 284 | `BC {entry.bodyCondition}/9` | `CC {entry.bodyCondition}/9` |

**`mobile-pet-tracker/src/components/weight-chart.tsx`** — 1

| # | Línea | Inglés | **Español (revisa esto)** |
|---|---|---|---|
| 105 | 20 | `Not enough data yet` | `Aún no hay datos suficientes` |

## R6 — Food y Meal schedule


**`mobile-pet-tracker/src/app/(tabs)/food.tsx`** — 16

| # | Línea | Inglés | **Español (revisa esto)** |
|---|---|---|---|
| 106 | 80 | `Food` | `Nutrición` ·repetida |
| 107 | 91 | `Something went wrong` | `Algo salió mal` ·repetida |
| 108 | 94 | `Retry` | `Reintentar` ·repetida |
| 109 | 101 | `No pets yet` | `Aún no tienes mascotas` ·repetida |
| 110 | 144 | `Daily target` | `Objetivo diario` |
| 111 | 150 | `kcal / day` | `kcal / día` |
| 112 | 156 | `g / day` | `g / día` |
| 113 | 174 | `Meals today` | `Comidas hoy` |
| 114 | 224 | `Pending` | `Pendiente` |
| 115 | 224 | `Served` | `Servido` |
| 116 | 259 | `AI recommendation` | `Recomendación IA` |
| 117 | 272 | `No meal plan yet` | `Aún no hay plan de alimentación` |
| 118 | 281 | `Could not load meal plan` | `No se pudo cargar el plan de alimentación` |
| 119 | 284 | `Retry` | `Reintentar` ·repetida |
| 120 | 296 | `Meal schedule` | `Horario de comidas` |
| 121 | 299 | `View nutrition profile and times` | `Ver el perfil nutricional y los horarios` |

**`mobile-pet-tracker/src/app/(tabs)/meal-schedule.tsx`** — 19

| # | Línea | Inglés | **Español (revisa esto)** |
|---|---|---|---|
| 122 | 83 | `Only the owner can generate the plan` | `Solo el dueño puede generar el plan` |
| 123 | 87 | `Create a nutrition profile first` | `Primero crea un perfil nutricional` |
| 124 | 89 | `Register a weight first` | `Primero registra un peso` |
| 125 | 91 | `Something went wrong` | `Algo salió mal` ·repetida |
| 126 | 95 | `Cannot reach server` | `No se pudo conectar con el servidor` ·repetida |
| 127 | 102 | `Something went wrong` | `Algo salió mal` ·repetida |
| 128 | 105 | `Something went wrong` | `Algo salió mal` ·repetida |
| 129 | 126 | `Back to food` | `Volver a Nutrición` |
| 130 | 135 | `Meal schedule` | `Horario de comidas` ·repetida |
| 131 | 160 | `Something went wrong` | `Algo salió mal` ·repetida |
| 132 | 163 | `Retry` | `Reintentar` ·repetida |
| 133 | 178 | `Daily target` | `Objetivo diario` ·repetida |
| 134 | 184 | `g / day` | `g / día` ·repetida |
| 135 | 190 | `meals / day` | `comidas / día` |
| 136 | 198 | `Times and portions` | `Horarios y porciones` |
| 137 | 232 | `No meal plan yet` | `Aún no hay plan de alimentación` ·repetida |
| 138 | 250 | `Generate plan` | `Generar plan` |
| 139 | 269 | `Nutrition profile` | `Perfil nutricional` |
| 140 | 297 | `No nutrition profile yet` | `Aún no hay perfil nutricional` |

## R7 — Profile y Documentos


**`mobile-pet-tracker/src/screens/profile/index.tsx`** — 20

| # | Línea | Inglés | **Español (revisa esto)** |
|---|---|---|---|
| 141 | 85 | `Sterilized` | `Esterilizado` |
| 142 | 86 | `Not sterilized` | `Sin esterilizar` |
| 143 | 87 | ``${pet.ageMonths} months`` | ``${pet.ageMonths} meses`` |
| 144 | 157 | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
| 145 | 174 | `Could not upload photo` | `No se pudo subir la foto` |
| 146 | 186 | `Could not upload photo` | `No se pudo subir la foto` ·repetida |
| 147 | 192 | `Could not upload photo` | `No se pudo subir la foto` ·repetida |
| 148 | 211 | `Profile` | `Perfil` ·repetida |
| 149 | 219 | `Add pet` | `Añadir mascota` |
| 150 | 234 | `No pets yet` | `Aún no tienes mascotas` ·repetida |
| 151 | 240 | `Could not load pets` | `No se pudieron cargar las mascotas` |
| 152 | 253 | `Could not load pet profile` | `No se pudo cargar el perfil de la mascota` |
| 153 | 255 | `Retry` | `Reintentar` ·repetida |
| 154 | 272 | `Change photo` | `Cambiar foto` |
| 155 | 334 | `Reminders` | `Recordatorios` |
| 156 | 340 | `Account` | `Cuenta` |
| 157 | 355 | `Account unavailable` | `Cuenta no disponible` |
| 158 | 365 | `Use dark theme` | `Usar tema oscuro` |
| 159 | 365 | `Use light theme` | `Usar tema claro` |
| 160 | 376 | `Sign out` | `Cerrar sesión` |

**`mobile-pet-tracker/src/screens/docs/index.tsx`** — 6

| # | Línea | Inglés | **Español (revisa esto)** |
|---|---|---|---|
| 161 | 68 | `Back to profile` | `Volver a Perfil` |
| 162 | 85 | `Pet` | `Mascota` |
| 163 | 101 | `No documents yet` | `Aún no hay documentos` |
| 164 | 103 | `Medical documents will appear here.` | `Los documentos médicos aparecerán aquí.` |
| 165 | 116 | `Could not load documents` | `No se pudieron cargar los documentos` |
| 166 | 118 | `Retry` | `Reintentar` ·repetida |

## R8 — Recordatorios y su alta


**`mobile-pet-tracker/src/screens/reminders/index.tsx`** — 21

| # | Línea | Inglés | **Español (revisa esto)** |
|---|---|---|---|
| 167 | 87 | `Only the owner can delete` | `Solo el dueño puede eliminar` |
| 168 | 90 | `Cannot reach server` | `No se pudo conectar con el servidor` ·repetida |
| 169 | 97 | `Something went wrong` | `Algo salió mal` ·repetida |
| 170 | 100 | `Something went wrong` | `Algo salió mal` ·repetida |
| 171 | 136 | `Reminders` | `Recordatorios` ·repetida |
| 172 | 143 | `New` | `Nuevo` |
| 173 | 171 | `Something went wrong` | `Algo salió mal` ·repetida |
| 174 | 174 | `Retry` | `Reintentar` ·repetida |
| 175 | 182 | `No reminders yet` | `Aún no hay recordatorios` |
| 176 | 211 | `Active` | `Activos` |
| 177 | 236 | `This week` | `Esta semana` |
| 178 | 253 | `Inactive` | `Inactivos` |
| 179 | 285 | `Upcoming!` | `¡Próximo!` |
| 180 | 301 | `Cancelled` | `Cancelado` |
| 181 | 301 | `Sent` | `Enviado` |
| 182 | 305 | ``· in ${days} days`` | ``· en ${days} días`` |
| 183 | 319 | `Delete` | `Eliminar` |
| 184 | 342 | `Delete reminder?` | `¿Eliminar recordatorio?` |
| 185 | 351 | `This action cannot be undone.` | `Esta acción no se puede deshacer.` |
| 186 | 361 | `Delete` | `Eliminar` ·repetida |
| 187 | 370 | `Cancel` | `Cancelar` |

**`mobile-pet-tracker/src/utils/reminder-meta.ts`** — 7

| # | Línea | Inglés | **Español (revisa esto)** |
|---|---|---|---|
| 188 | 7 | `Vaccine` | `Vacuna` |
| 189 | 8 | `Deworming` | `Desparasitación` |
| 190 | 9 | `Medication` | `Medicamento` |
| 191 | 10 | `Appointment` | `Consulta` |
| 192 | 11 | `Weight` | `Peso` ·repetida |
| 193 | 12 | `Food` | `Comida` |
| 194 | 13 | `Other` | `Otro` |

**`mobile-pet-tracker/src/screens/add-reminder/index.tsx`** — 22

| # | Línea | Inglés | **Español (revisa esto)** |
|---|---|---|---|
| 195 | 21 | `Same day` | `El mismo día` |
| 196 | 22 | `1 day before` | `1 día antes` |
| 197 | 23 | `3 days before` | `3 días antes` |
| 198 | 24 | `7 days before` | `7 días antes` |
| 199 | 56 | `Title is required` | `El título es obligatorio` |
| 200 | 60 | `Pick a date` | `Elige una fecha` |
| 201 | 66 | `Date must be in the future` | `La fecha debe ser futura` |
| 202 | 86 | `Only the owner can create reminders` | `Solo el dueño puede crear recordatorios` |
| 203 | 89 | `Date must be in the future` | `La fecha debe ser futura` ·repetida |
| 204 | 92 | `Cannot reach server` | `No se pudo conectar con el servidor` ·repetida |
| 205 | 99 | `Something went wrong` | `Algo salió mal` ·repetida |
| 206 | 102 | `Something went wrong` | `Algo salió mal` ·repetida |
| 207 | 122 | `Back to reminders` | `Volver a Recordatorios` |
| 208 | 132 | `Add reminder` | `Agregar recordatorio` |
| 209 | 138 | `Type` | `Tipo` |
| 210 | 169 | `Title` | `Título` |
| 211 | 176 | `Reminder title` | `Título del recordatorio` |
| 212 | 186 | `Date` | `Fecha` |
| 213 | 196 | `Select a date` | `Elige una fecha` ·repetida |
| 214 | 202 | `Time` | `Hora` |
| 215 | 256 | `Alert` | `Aviso` |
| 216 | 292 | `Save reminder` | `Guardar recordatorio` |

## R9 — Alta de mascota


**`mobile-pet-tracker/src/screens/add-pet/index.tsx`** — 38

| # | Línea | Inglés | **Español (revisa esto)** |
|---|---|---|---|
| 217 | 114 | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` ·repetida |
| 218 | 148 | `Name is required` | `El nombre es obligatorio` |
| 219 | 155 | `Choose a birth date` | `Elige una fecha de nacimiento` |
| 220 | 162 | `Enter an age from 0 to 480 months` | `Introduce una edad de 0 a 480 meses` |
| 221 | 189 | `Pet created, but the photo could not be uploaded` | `Se creó la mascota, pero no se pudo subir la foto` |
| 222 | 198 | `Check the pet details` | `Revisa los datos de la mascota` |
| 223 | 201 | `You cannot create a pet` | `No puedes crear una mascota` |
| 224 | 204 | `Cannot reach server` | `No se pudo conectar con el servidor` ·repetida |
| 225 | 208 | `Something went wrong` | `Algo salió mal` ·repetida |
| 226 | 211 | `Something went wrong` | `Algo salió mal` ·repetida |
| 227 | 231 | `Back to profile` | `Volver a Perfil` ·repetida |
| 228 | 240 | `Add pet` | `Nueva mascota` |
| 229 | 245 | `Pet` | `Mascota` ·repetida |
| 230 | 250 | `Avatar preview` | `Vista previa del avatar` |
| 231 | 259 | `Choose photo` | `Elegir foto` |
| 232 | 272 | `Species` | `Tipo de mascota` |
| 233 | 289 | `Cat` | `Gato` |
| 234 | 289 | `Dog` | `Perro` |
| 235 | 297 | `Name` | `Nombre` |
| 236 | 303 | `Pet name` | `Nombre de la mascota` |
| 237 | 311 | `Breed` | `Raza` |
| 238 | 317 | `Optional` | `Opcional` |
| 239 | 325 | `Sex` | `Sexo` |
| 240 | 327 | `Female` | `Hembra` |
| 241 | 328 | `Male` | `Macho` |
| 242 | 333 | `Size` | `Tamaño` |
| 243 | 335 | `Small` | `Pequeño` |
| 244 | 336 | `Medium` | `Mediano` |
| 245 | 337 | `Large` | `Grande` |
| 246 | 344 | `Age` | `Edad` |
| 247 | 347 | `Birth date` | `Fecha de nacimiento` |
| 248 | 348 | `Approx. months` | `Meses aprox.` |
| 249 | 376 | `Select a birth date` | `Elige una fecha de nacimiento` ·repetida |
| 250 | 386 | `Months` | `Meses` |
| 251 | 412 | `Sterilized` | `Esterilizado/a` |
| 252 | 414 | `Yes` | `Sí` |
| 253 | 426 | `Optional` | `Opcional` ·repetida |
| 254 | 440 | `Save pet` | `Guardar mascota` |

## R10 — Emparejado del collar


**`mobile-pet-tracker/src/screens/pairing/index.tsx`** — 40

| # | Línea | Inglés | **Español (revisa esto)** |
|---|---|---|---|
| 255 | 126 | `Invalid activation code. Check the code printed on the box.` | `Código de activación no válido. Revisa el código impreso en la caja.` |
| 256 | 130 | `This collar is already paired to another pet.` | `Este collar ya está vinculado a otra mascota.` |
| 257 | 133 | `This pet already has a collar. Unpair it first.` | `Esta mascota ya tiene un collar. Desvincúlalo primero.` |
| 258 | 137 | `This collar has no active plan. Contact support to activate it.` | `Este collar no tiene un plan activo. Contacta con soporte para activarlo.` |
| 259 | 141 | `Only the owner can pair a collar.` | `Solo el dueño puede vincular un collar.` |
| 260 | 147 | `Cannot reach server` | `No se pudo conectar con el servidor` ·repetida |
| 261 | 151 | `Something went wrong` | `Algo salió mal` ·repetida |
| 262 | 155 | `Something went wrong` | `Algo salió mal` ·repetida |
| 263 | 189 | `Only the owner can unpair the collar.` | `Solo el dueño puede desvincular el collar.` |
| 264 | 195 | `Cannot reach server` | `No se pudo conectar con el servidor` ·repetida |
| 265 | 199 | `Something went wrong` | `Algo salió mal` ·repetida |
| 266 | 203 | `Something went wrong` | `Algo salió mal` ·repetida |
| 267 | 212 | `Unpair collar?` | `¿Desvincular collar?` |
| 268 | 213 | `Location history stays, but live tracking stops until you pair a collar again.` | `El historial de ubicaciones se conserva, pero el rastreo en vivo se detiene hasta que vincules otro collar.` |
| 269 | 215 | `Cancel` | `Cancelar` ·repetida |
| 270 | 217 | `Unpair` | `Desvincular` |
| 271 | 238 | `Back` | `Volver` |
| 272 | 267 | `Something went wrong` | `Algo salió mal` ·repetida |
| 273 | 270 | `Retry` | `Reintentar` ·repetida |
| 274 | 277 | `Add a pet first` | `Primero añade una mascota` |
| 275 | 302 | `Tracker is ready` | `El collar está listo` |
| 276 | 305 | `{selectedPet.name}&apos;s collar is paired. GPS tracking is on.` | `El collar de {selectedPet.name} está vinculado. El rastreo GPS está activo.` |
| 277 | 312 | `Model` | `Modelo` |
| 278 | 330 | `View on map` | `Ver en el mapa` ·repetida |
| 279 | 340 | `Done` | `Listo` |
| 280 | 348 | `Pair collar` | `Vincular collar` ·repetida |
| 281 | 357 | `Free plan — health only. Pair a collar with an active plan to see the map.` | `Plan gratuito — solo salud. Vincula un collar con plan activo para ver el mapa.` |
| 282 | 364 | `Activation code` | `Código de activación` |
| 283 | 377 | `Printed on the collar box` | `Impreso en la caja del collar` |
| 284 | 388 | `Pair collar` | `Vincular collar` ·repetida |
| 285 | 397 | `GPS device` | `Dispositivo GPS` |
| 286 | 403 | `Model` | `Modelo` ·repetida |
| 287 | 408 | `Battery` | `Batería` |
| 288 | 417 | `Connection` | `Conexión` |
| 289 | 422 | `Last message` | `Último mensaje` |
| 290 | 429 | `No messages yet` | `Sin mensajes todavía` |
| 291 | 453 | `GPS tracking active` | `Rastreo GPS activo` |
| 292 | 461 | `Free plan — health only. This collar has no active plan.` | `Plan gratuito — solo salud. Este collar no tiene plan activo.` |
| 293 | 468 | `Plan status unavailable` | `Estado del plan no disponible` |
| 294 | 479 | `Unpair collar` | `Desvincular collar` |

## R11 — Restablecer contraseña


**`mobile-pet-tracker/src/screens/reset-password/index.tsx`** — 15

| # | Línea | Inglés | **Español (revisa esto)** |
|---|---|---|---|
| 295 | 36 | `Reset link is invalid or already used. Request a new one.` | `El enlace no es válido o ya se usó. Solicita uno nuevo.` |
| 296 | 40 | `Reset link expired. Request a new one.` | `El enlace caducó. Solicita uno nuevo.` |
| 297 | 46 | `Cannot reach server` | `No se pudo conectar con el servidor` ·repetida |
| 298 | 50 | `Something went wrong` | `Algo salió mal` ·repetida |
| 299 | 53 | `Something went wrong` | `Algo salió mal` ·repetida |
| 300 | 77 | `Reset password` | `Restablecer contraseña` |
| 301 | 84 | `This reset link is incomplete. Open the link from your email again.` | `Este enlace está incompleto. Ábrelo de nuevo desde tu correo.` |
| 302 | 88 | `Back to sign in` | `Volver al inicio de sesión` ·repetida |
| 303 | 113 | `Reset password` | `Restablecer contraseña` ·repetida |
| 304 | 120 | `Password updated` | `Contraseña actualizada` |
| 305 | 128 | `Back to sign in` | `Volver al inicio de sesión` ·repetida |
| 306 | 151 | `Reset password` | `Restablecer contraseña` ·repetida |
| 307 | 156 | `New password` | `Nueva contraseña` |
| 308 | 171 | `Confirm new password` | `Confirmar nueva contraseña` |
| 309 | 197 | `Update password` | `Actualizar contraseña` |

---

## Firma

- [ ] Firmo la redacción en español de las 309 filas de esta hoja (fecha: ____)

Si has editado alguna fila en vez de firmar tal cual, dilo al firmar para que
propague los cambios a `design.md` §2.
