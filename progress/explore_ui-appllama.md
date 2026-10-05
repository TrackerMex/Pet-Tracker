# Referencias Appllama para el bloque de UI (#115–#119)

Fecha: 2026-10-04. Árbol: `b2a9c2aa` (origin/main con #148). Investigación de
solo lectura hecha por el leader con el MCP de Appllama (contratado el
2026-10-04, plan Pro: 1500 créditos al mes, reinicio el 2026-11-01, límites
90/min y 400/día) y las skills `appllama-usage`, `appllama-app-design-skill`
y `animate-expo`. Consumo de esta sesión: 37 créditos (quedan 1463). Treinta
pantallas vistas como imagen; aquí quedan los **patrones**, nunca los píxeles.

Reglas del material:

- Los ids de app y de pantalla (`<app_id>/<screen_id>`) son durables y se
  reabren con `get_screen(screen_ref=...)`. Las URL de imagen caducan en una
  hora, así que este fichero no enlaza imágenes.
- Las capturas llevan la marca de agua de Appllama arriba a la izquierda; no
  es diseño y no se reproduce.
- No se barre el catálogo. Cada consulta responde a una de las cinco
  features; ampliar la investigación es legítimo, extraer el dataset no.
- Codex **no tiene** el MCP. El handoff le pasa este fichero y la spec, no
  el acceso; es el mismo hueco que B5 para las skills.

Este fichero alimenta al `spec_author` de cada feature. Complementa a
`progress/explore_make-parity-2026-09-23.md` (qué falta respecto al Make) y a
`specs/mobile-figma-polish/design-src/App.tsx` (el Make en código). Donde el
Make y la biblioteca discrepan manda la carta (`docs/ui-guidelines.md`), y
donde la biblioteca y la carta discrepan manda la carta también.

## 0. Cómo se traduce un patrón de la biblioteca a este repo

Cada observación de abajo se adapta con estas reglas antes de llegar a una
spec; el `spec_author` no las re-litiga:

1. **Esqueleto sí, sistema de estilos no.** Se toma la jerarquía, el orden de
   bloques y dónde cae el CTA primario. Colores por tokens de
   `src/theme/global.css` (acento `#178255` ya fijado por #61), nunca hex ni
   `StyleSheet.create` ni clases arbitrarias (carta §Decisiones fijas 1-3).
2. **Nada de emojis en el chrome.** Los chips del Make («📍 GPS», «❤️ Salud»,
   «🍽️ Nutrición») pasan a icono de `expo-symbols` + etiqueta
   (anti-slop 5 de la skill y decisión #46 «iconos reicon en vez de emojis»).
3. **Degradados a sólido.** `expo-linear-gradient` sigue vetado (#46 design
   §5, A4 de #67). Las capas oscuras sobre foto del Make se resuelven con una
   banda opaca o un velo `bg-background/…` ya existente en tokens.
4. **Un solo acento y una sola escala de radios.** Las píldoras, tarjetas e
   inputs usan los radios que ya hay en `global.css`; no se añade uno nuevo.
5. **Copy por catálogo.** Toda cadena nueva entra en `src/i18n/catalog.ts`
   (en y es), suma su fila a `src/__tests__/ui-copy-table.ts` y a
   `specs/mobile-ui-language/design.md` §2, y mueve el candado de longitud de
   `src/providers/__tests__/language-provider.test.tsx`. Si la pantalla es
   nueva, además `SCREEN_FILES` y `checkUses(ALL_USES)` de #65 R18.
6. **Motion por la puerta de frecuencia** (`animate-expo` §1): la bienvenida
   se ve una vez (nivel «raro»: se permite entrada con `scale 0.95` +
   opacidad, nunca `scale(0)`); el mapa y la salud se abren decenas de veces
   al día (solo feedback de pulsación, < 150 ms, o nada). Reduce Motion
   siempre con la animación, no después.
7. **Cero dependencias nuevas** en las cinco features (ya lo dice cada
   entrada de `feature_list.json`). Reanimated, gesture-handler, expo-image y
   expo-symbols ya están instalados; `react-native-svg` también.
8. **Gate humano**: prueba de humo en el dev build de Android, con casilla
   propia por requisito que solo un humano cierra.

## 1. #118 mobile-welcome-splash

### Qué hay hoy (verificado en `b2a9c2aa`)

- `mobile-pet-tracker/src/app/index.tsx`: decide por `useAuth().status`
  (`authenticated` → `/home`, `unauthenticated` → `/login`) y mientras carga
  pinta `splash-logo` (expo-image 120×120 de `assets/images/splash-icon.png`)
  centrado sobre `bg-background`. Test en `src/app/__tests__/index.test.tsx`
  (tres referencias a `splash-logo`).
- `src/app/_layout.tsx`: carga fuentes Inter, precarga tema e idioma y
  devuelve `<></>` hasta `themeReady`; después monta los providers y
  `RootStack`. El splash nativo lo gestiona el plugin `expo-splash-screen`
  de `app.json` con el mismo `splash-icon.png`.
- No hay pantalla de bienvenida: el usuario sin sesión aterriza en login.

### Patrón en la biblioteca

Dos pantallas distintas que el Make funde en una:

- **Splash** (el instante de arranque): logo o wordmark solo, centrado, sobre
  lienzo liso de marca. Cal AI `6480417616/spl_547ob` (manzana negra +
  wordmark sobre blanco), Waterllama `1454778585/spl_vgln0`, Catzy
  `6737681541/spl_b7t82` (fondo sólido de marca + tile del logo). Ningún
  texto, ningún botón. **Esto ya lo hace `index.tsx`**; la feature no lo
  rediseña, solo debe mantener que no parpadee.
- **Welcome** (primera pantalla con decisión): héroe único arriba (foto,
  mascota o icono grande), wordmark o titular, una línea de propuesta, CTA
  primario de ancho completo pegado abajo y enlace secundario «ya tengo
  cuenta». Knowt `6463744184/spl_pjv2g` añade burbujas de prueba social
  («4.8», «7.5 million») flanqueando el icono y una fila de ventajas con
  checks; Waterllama `spl_w8h2n`, Cal AI `spl_obaee`, Ling
  `1403783779/spl_rrspd`, Baby Daybook `1446283219/spl_idq49` y Mealime
  `1079999103/spl_7ggh5` repiten el esqueleto: héroe → marca → tagline →
  primario → secundario (texto o píldora hueca). Varias añaden una píldora de
  idioma arriba a la derecha; aquí no hace falta porque el idioma ya se
  elige dentro.

### El Make (`design-src/App.tsx`, `SplashScreen`, línea 160 en `b2a9c2aa`)

Foto a sangre con velos oscuros, píldora difuminada abajo al centro con
«PET TRACKER» + badge «PRO» + «By» + logo, hoja blanca con radio 28 arriba y
`marginTop -32`, tres chips con emoji, párrafo «Tu centro inteligente de
bienestar, rastreo y nutrición canina profesional», `GreenBtn "Comenzar
ahora"`, `OutlineBtn "Ya tengo una cuenta"` y pie «Al continuar aceptas
nuestros Términos y Política de privacidad» con los dos enlaces en verde y
negrita. Mapea uno a uno con el esqueleto de la biblioteca.

### Adaptación propuesta para la spec

- Dos estados visuales en la misma ruta `index.tsx` o una ruta nueva
  `welcome`: la spec decide; la biblioteca favorece **ruta propia** porque
  la bienvenida tiene navegación (dos CTAs) y el splash no. Si es ruta
  nueva, va fuera de `(auth)` y de `(tabs)`, y el `RootStack` la registra.
- Orden de bloques: héroe (foto o `logo-glow.png`, ya en `assets/images/`),
  marca (texto, sin badge «PRO»: no hay plan de pago), tres chips
  icono+etiqueta (GPS, Salud, Nutrición), tagline, primario «Comenzar
  ahora» (→ `/register`), secundario hueco «Ya tengo una cuenta»
  (→ `/login`), pie legal.
- La skill de diseño exige que la bienvenida sea **puerta de un solo
  sentido**: tras iniciar sesión, atrás no vuelve a verla (`replace`, no
  `push`). Cuando hay sesión, `index.tsx` sigue yendo directo a `/home`.
- Decisiones (a)(b)(c) de la entrada #118 las cierra la spec. Para (a), la
  biblioteca muestra la bienvenida **siempre que no hay sesión** (Knowt,
  Cal AI, Waterllama); ninguna la esconde tras un flag de «primer arranque».
  Eso evita persistir nada y no necesita dependencia nueva. Para (c), las
  apps enlazan a una URL real; si el proyecto no la tiene, el pie se queda
  como texto plano sin enlace, nunca con un enlace muerto.
- Motion: entrada única de la hoja (opacidad + `translateY` corto, timing
  `ease-out` < 300 ms) y nada más; CTA con `scale 0.97` al pulsar. Con
  Reduce Motion, solo opacidad.
- Copy nuevo estimado: 7 claves (marca, tres chips, tagline, dos CTAs, pie);
  el `spec_author` fija la cuenta exacta y el delta del candado.

## 2. #117 mobile-forgot-password

### Qué hay hoy (verificado)

`src/app/(auth)/forgot.tsx` es un stub: `TextField isDisabled`, `Input
editable={false}`, botón `forgot-submit` deshabilitado y la clave
`forgot.comingSoon` («Password recovery coming soon» / «La recuperación de
contraseña estará disponible pronto»). El backend ya expone
`POST /v1/auth/forgot-password` (#44, #58) y `src/app/reset-password.tsx`
recibe el deep link (#59). No hay función `forgot` en `src/api/`. El
contrato y la anti-enumeración se leen en `backend-pet-tracker/src/modules/auth/`.

### Patrón en la biblioteca

- **Paso 1, pedir correo**: flecha atrás, título, explicación de una o dos
  líneas, **un solo input**, CTA de ancho completo abajo. mySymptoms
  `405231632/onb_elolb`, HyNote `6478655348/onb_cpucb`, Quabble
  `6445948886/onb_4vxw1` (login con «Forgot your password?» subrayado).
- **Paso 2, revisa tu correo**: la misma pantalla cambia a estado de éxito
  (banner o titular + cuerpo que repite el correo escrito), primario
  «Abrir correo»/«Ya lo verifiqué», secundario hueco «Reenviar», texto
  «Volver al inicio de sesión». HyNote (verificación de correo), Kidslox
  `914825567/oth_s44mr` (hoja inferior con X y «expire in 15 minutes»),
  Todoist `572688855/onb_2cf0j`, WeWard `1454213029/onb_ylmd8`, Endel
  `1346247457/onb_f7p4i`.
- **Anti-enumeración**: el estado de éxito es idéntico exista o no el
  correo; ninguna app del muestreo dice «este correo no está registrado».
  El backend ya responde igual en ambos casos (#44); la UI no debe
  distinguir por código de respuesta.

### El Make (`ForgotScreen`, línea 247 en `b2a9c2aa`)

Cabecera con botón redondo atrás y «🐾 PET TRACKER PRO»; tile centrado con
candado sobre `#E3F9EE`; h2 «Recuperar contraseña»; cuerpo «Ingresa el
correo electrónico asociado a tu cuenta y te enviaremos las instrucciones.»;
`Field` «Correo electrónico» con placeholder «correo@ejemplo.com»; botón con
degradado «Enviar instrucciones» + flecha; texto «← Volver al inicio de
sesión». Solo tiene el paso 1; el paso 2 lo aporta la biblioteca.

### Adaptación propuesta

- Reutilizar la ruta `forgot.tsx` existente (route delgado + `src/screens/
  forgot/` según `docs/conventions.md`), quitar el stub y la clave
  `forgot.comingSoon` (fila a retirar del catálogo y de ui-copy-table: el
  candado baja y vuelve a subir con las claves nuevas).
- Dos estados en la misma pantalla: formulario y «revisa tu correo»; el
  segundo muestra el correo escrito y ofrece «Reenviar» con el mismo POST.
  Nada de temporizador de expiración si el backend no lo publica.
- Teclado: `KeyboardAvoidingView` calcada de #148 (`behavior="padding"`,
  `keyboardVerticalOffset` desde `HeaderHeightContext`).
- Icono del candado con `expo-symbols`, no emoji; sin degradado en el botón.
- Copy nuevo estimado: 6-8 claves; se retira 1.

## 3. #116 mobile-map-gps-pill-battery

### Qué hay hoy (verificado)

`src/screens/map/index.tsx` pinta mapa a pantalla completa con rejilla de
estadísticas `stat-speed`, `stat-distance`, `stat-updated`, `stat-gps`.
Recibe `device: DeviceStatus | null` con `batteryPct` y `LastPosition.battery`
(`src/api/types.ts`). La Home ya tiene la píldora «En línea» (`home.online`)
decidida en pet-online-pill. La carta (§Dirección de arte 5) pide conservar
la rejilla. Fuera: dirección literal y botones Compartir/Recorrido.

### Patrón en la biblioteca

- Mapa a sangre con **controles flotantes redondos** y una **barra
  translúcida arriba** con avatar o chips de estado: FamilyWall `496889629`
  (fila de círculos de avatar con badge de estado arriba a la izquierda,
  botón de tipo de mapa a la derecha), OurPact `954029412/oth_465gx` y
  `oth_c8z4p` (barra con avatar, badge de alerta y nombre desplegable que
  abre la tarjeta de estado del dispositivo), Find Phone
  `1669041518/oth_khbbk` y `oth_y9rf2` (hoja inferior con asa).
- **Línea de estado coloreada con icono + «visto por última vez» + tiempo
  relativo**: la tarjeta de ubicación en vivo de FamilyWall. Es el patrón
  que mejor encaja con una píldora «GPS activo» sobre el mapa.
- **Batería**: no hay referencias útiles; la búsqueda devuelve apps de
  coche/OBD2. La biblioteca tampoco tiene apps de GPS para mascotas ni
  Life360. La batería se trata como un **estadístico más de la rejilla**
  con el mismo código de color que el Make (`> 60` verde de acento, si no
  ámbar de aviso; ambos tokens ya existen).

### El Make

«GPS activo» en líneas 484 y 1673 de `design-src/App.tsx`; stat «Batería»
en 497 (`pet.battery > 60 ? "#2AB87C" : "#F59E0B"`) y 1639; «Batería baja»
en 1655.

### Adaptación propuesta

- Píldora flotante sobre el mapa, arriba, reutilizando el componente de la
  Home (`home.online`) en vez de duplicarlo; estados: activo (con hora
  relativa del último fix), sin señal, sin collar. Sin animación de
  parpadeo: el mapa se abre decenas de veces al día.
- Quinto stat `stat-battery` en la rejilla existente, con el color por
  umbral; cuando `device` es `null` o `batteryPct` falta, el stat muestra
  el marcador de ausencia que ya usan los otros cuatro.
- Copy nuevo estimado: 3-4 claves (GPS activo, sin señal, batería, batería
  baja); se reutiliza `home.online` si la spec lo elige.

## 4. #115 mobile-health-make-parity

### Qué hay hoy (verificado)

`src/screens/health/index.tsx` consulta `healthKeys.weights(selectedPetId ??
'', 1)` (solo el último peso); `src/components/weight-chart.tsx` existe y lo
usa únicamente `src/screens/weight-log/index.tsx`; `pet-hero-header.tsx` lo
usan Home y Perfil; `calendarDaysUntil` vive en `src/screens/home/format.ts`;
la vacuna próxima se pinta en crudo (`{nextVaccine.nextDoseAt}`). Fuera:
«Expediente médico».

### Patrón en la biblioteca

- **Tarjeta de peso** = título + variación («Weight Change: 0.0 kg», «↓ 0 lbs
  past week») + gráfica de línea con meta discontinua + fechas en el eje +
  CTA «Registrar peso»: Cronometer `1145935738/oth_l1wuz`, Lose It!
  `297368629/oth_4wa38` («TODAY 198.6 lbs» + píldora «Record Weight»).
- **Chips de rango** 1W/1M/3M/6M/1Y/Todo: Carb Manager `410089731/oth_dbdos`,
  HitMeal `1544461026/oth_gymzl` (1 Month/6 Months/1 Year + fila «Average
  weight» + lista de historial), Happy Scale `532430574/oth_aw3e5` (7/30/90/
  365 días).
- **Tiles de resumen** Inicial/Último/Meta: Carb Manager; tres cajas huecas +
  filas de historial «191.0 | Aug 6, 2026» en My Macros+
  `475249619/oth_ud4d4`.
- **Tile de panel** «Weigh In · Last weigh-in: Today · 191 lb»: MyNetDiary
  `287529757/oth_fw4zr` y `oth_fay8y`.
- **Hoja de registro** fecha + hora + valor con conmutador kg/lb + Enviar:
  Carb Manager `oth_vcfnm`. Aquí ya existe `weight-log`, así que el CTA
  navega, no abre hoja.
- **Vacío**: un punto hueco o «Registra un peso para empezar» + CTA.
- Medisafe `573916946`: tarjetas de seguimiento con par de píldoras «Más
  info» / «Registrar»; útil para la tarjeta de vacuna.

### Adaptación propuesta

- Reutilizar `weight-chart.tsx` en Salud con la serie completa (cambiar el
  `1` del `healthKeys.weights(...)` por el límite que la spec fije) y una
  fila de variación respecto al registro anterior. Sin chips de rango en la
  primera entrega salvo que la spec lo pida: el mínimo que cierra la
  paridad con el Make es gráfica + variación + CTA.
- Cabecera con `pet-hero-header.tsx` (ya existe) y días restantes de la
  vacuna con `calendarDaysUntil` movido a un sitio compartido o importado
  desde home/format.ts; la fecha cruda desaparece.
- Vacío: texto + CTA a `weight-log`, no gráfica vacía.
- Copy nuevo estimado: 4-6 claves.

## 5. #119 mobile-hero-food-and-detail

### Qué hay hoy (verificado)

`src/app/(tabs)/food.tsx` sigue siendo ruta gorda (deuda de #102). Las
enmiendas A11 y A13 (`grep "enmienda A11 de #95"` en `docs/conventions.md` y
`docs/ui-guidelines.md`) retiraron el hero de ciertas pantallas; revertirlas
exige enmienda firmada por el humano, o limitar la feature a Nutrición.

### Patrón en la biblioteca

- v0 pet-health-tracker (Home: saludo «Good evening / Here's how your pets
  are doing», tarjeta Health «Weight · 2 entries · 30.1 kg · ↗ +0.7 kg» con
  sparkline, actividad reciente con círculos de icono tintados, FAB «Log
  activity»; Records: chips de mascota + chips de tipo + tarjetas).
- Woofz `1532020050/oth_o1r6y`: fondo crema, segmentado Profile info/
  Moments, avatar circular grande con banda «Edit», filas etiqueta/valor
  NAME/BREED/AGE/GENDER, píldora «Add new dog», texto rojo «Delete profile».
- Dogo `1153294767/oth_v53wy`: avatar centrado con badge verde de edición,
  nombre, fecha de nacimiento + edad, fila de miembros.
- Catzy `6737681541/oth_myz1b`: tarjeta de stats con mascota + peso/altura y
  gráfica radial de rasgos.

### Adaptación propuesta

- `PetHeroHeader` en Nutrición con foto, nombre y título de sección, manteniendo
  la banda opaca de #67 R3. El detalle (Docs) queda condicionado a la
  decisión humana sobre A11/A13; la spec debe nacer con esa decisión cerrada
  por escrito o acotarse a Nutrición.
- Aprovechar la feature para adelgazar `food.tsx` a route delgado +
  `src/screens/food/` (cierra la deuda de #102) solo si la spec lo declara
  en alcance; si no, es tentación de alcance.

## 6. Huecos de la biblioteca y decisiones que siguen abiertas

- No hay apps de GPS para mascotas ni Life360; el patrón de mapa sale de
  apps de localización familiar y de dispositivos.
- «battery» no devuelve nada útil; la batería se diseña por analogía con la
  píldora de la Home y el Make.
- «forgot password» por palabra clave devuelve 0; se usó «reset password» y
  búsqueda semántica.
- #119 depende de una decisión humana (A11/A13) que ninguna referencia
  resuelve.
- Orden recomendado: #118 → #117 → #116 → #115 → #119.
