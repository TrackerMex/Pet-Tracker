# Paridad de la app móvil con el Figma Make, pantalla por pantalla

Fecha: 2026-09-23. Árbol: `c71d8068` (main con #113). Referencia:
`specs/mobile-figma-polish/design-src/App.tsx`. Rutas de la app relativas a
`mobile-pet-tracker/src/`. Auditoría de solo lectura pedida por el humano; de
aquí salen las features #115-#119. Sustituye a
`progress/explore_design-gap-vs-make.md` (2026-09-04), que está desfasado.

**Tipos de hueco**: **a** desviación deliberada y firmada (spec citada);
**b** hueco que cierra una feature pending (id); **c** hueco sin feature
(incluye lo aplazado como «fuera de alcance» sin id).

**Niveles**: **alta** están todas las secciones, aunque alguna adaptada por (a);
**media** falta alguna sección visible; **baja** solo está el núcleo;
**ausente** no hay pantalla equivalente.

**Desviaciones transversales (a)**: acento `#178255` en vez de `#2AB87C`
(ui-guidelines §Decisiones fijas 11, #61); degradados convertidos en sólido,
`expo-linear-gradient` vetado (#46 design §5, A4 de #67, mobile-food D2);
texto sobre acento a opacidad plena, nunca `white/70` (#61 R3, #113 D4);
iconos reicon en vez de emojis (#46); enums de la API en crudo
(ui-guidelines §Dirección de arte 6); barra de pestañas flotante (#46 §4).

## 1. Tabla por pantalla

| Pantalla del Make | En la app | Paridad | Huecos |
|---|---|---|---|
| SplashScreen | `app/index.tsx` (solo decide sesión y pinta logo) | ausente | **c** toda la bienvenida → **#118** |
| LoginScreen | `app/(auth)/login.tsx` | media | **c** hero de marca, iconos en campos, ojo de contraseña, separador «o», «Crear cuenta» como botón, «Contactar soporte» |
| ForgotScreen | `app/(auth)/forgot.tsx` | media (no funciona) | **c** stub desactivado aunque #44/#58/#59 están hechas → **#117**; cabecera de marca |
| RegisterScreen | `app/(auth)/register.tsx` | baja | **c** cabecera, stepper de 2 pasos, iconos, selector de país, foto, pie fijo |
| HomeScreen | `screens/home/index.tsx` | alta | **a** banda del selector, sin «+», Paseos por pasos, tira distinta, 3 accesos (#67, #69, #71); **b** tira que desaparece sin collar (#77); **c** dirección literal (geocodificación de pago) |
| MapScreen | `screens/map/index.tsx` | media | **a** mapa a pantalla completa, rejilla propia; **b** círculo «Zona Segura» (#41); **c** píldora «GPS activo» y batería → **#116**; dirección, Compartir y Recorrido (backend) |
| HealthScreen | `screens/health/index.tsx` | baja | **c** gráfica de peso, cabecera, días restantes → **#115**; «Expediente médico» (backend) |
| FoodScreen | `app/(tabs)/food.tsx` | media | **a** sin anillo (#113 D1); **b** tarjeta IA (#18); **c** cabecera → **#119**; nombres de comida (backend) |
| ProfileScreen | `screens/profile/index.tsx` | media | **a** hero en tarjeta, sin píldora (#67, pet-online-pill G6); **b** «Geocercas configuradas» (#41); **c** «Tomar foto», accesos con subtítulo |
| DocsScreen | `screens/docs/index.tsx` | baja | **a** tipo en crudo; **c** cabecera (→ #119, con enmienda), «+ Nuevo», filtros, ver/compartir, veterinario, emoji por tipo |
| RemindersScreen | `screens/reminders/index.tsx` | alta | **a** «Eliminar» en vez de interruptor; **b** pasa a detalle (#114); **c** cabecera, chip de categoría |
| AddReminderScreen | `screens/add-reminder/index.tsx` | media | **a** 7 tipos del backend; **c** cabecera, vista previa, campos condicionales, repetición, notas (backend) |
| AddPetScreen | `screens/add-pet/index.tsx` | media | **c** asistente de 2 pasos, cámara, raza por catálogo, color, peso/veterinario/alergias (backend) |
| GeofencesScreen | no existe | ausente | **b** entera (#41) |
| MealScheduleScreen | `screens/meal-schedule/index.tsx` | baja | **b** añadir/editar (#103); **c** cabecera, selector de alimento, servir por fila, aviso de recordatorios |
| WeightLogScreen | `screens/weight-log/index.tsx` | alta | **a** gráfica sin título (#62 R9); **c** cabecera con peso actual, nota (backend) |
| GpsConfigScreen | `screens/pairing/index.tsx` | baja | **b** sección Geocercas (#41); **c** cabecera, «Alertas» (backend), «Apagar dispositivo» (proveedor) |

## 2. Recuento

| Nivel | Nº | Pantallas |
|---|---|---|
| alta | 3 | Home, Reminders, WeightLog |
| media | 7 | Login, Forgot, Map, Food, Profile, AddReminder, AddPet |
| baja | 5 | Register, Health, Docs, MealSchedule, GpsConfig |
| ausente | 2 | Splash, Geofences |

## 3. Qué se registró y qué no

Registradas el 2026-09-23, al final de la cola por orden del humano:
**#115** Salud (gráfica, cabecera, días restantes), **#116** Mapa (píldora GPS
y batería), **#117** Recuperar contraseña, **#118** bienvenida, **#119**
cabecera en Nutrición y, con enmienda de A11/A13, en detalle.

Sin registrar (necesitan backend, proveedor de pago o son pulido menor): dirección
literal, Compartir/Recorrido, expediente médico, nombres de comida, campos extra
de alta de mascota y de recordatorio, notas de peso, alertas y apagado del GPS,
«+ Nuevo»/ver/compartir en Documentos, y el pulido de Login y Registro.

Pending ya existentes que acercan al Make: #41 (Geocercas), #103, #114, #77, #18.
