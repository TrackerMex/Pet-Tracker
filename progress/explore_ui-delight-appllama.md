# Referencias Appllama: welcome con mascota, Home viva, animación e ilustraciones

Fecha: 2026-10-06. Árbol: `37f6362c` (origin/main con #149); branch `feature/152-mobile-home-motion-foundations`. El leader hizo
esta investigación en solo lectura, con el MCP de Appllama y la skill
`appllama-usage` (playbook *improve-a-screen*). Gastó unos 8 créditos y quedan
1453. Responde a la petición del humano del 2026-10-06: un welcome «como el de
Duolingo o Reddit», una Home y unas pantallas más llamativas, animaciones, e
ilustraciones donde hagan falta.

Las reglas de material de `progress/explore_ui-appllama.md` (§0 y cabecera)
aplican sin cambios:

- Se usan ids durables (`<app_id>/<screen_id>`) y nunca URL de imagen.
- Se toman patrones, no píxeles.
- La marca de agua no se reproduce.
- Codex no tiene el MCP.

Este fichero **amplía** ese explore; no lo sustituye.

## 1. Diagnóstico: lo que hay hoy

Medido contra el árbol `37f6362c` y la captura `s136.png` de la Home (dark,
Android).

**D1. La mascota de marca está desaprovechada.**
- `assets/images/splash-icon.png` es una cabeza 3D de perro-robot (cara
  violeta, orejas grises, antena con bola roja).
- Solo aparece en el splash y en el welcome (`src/screens/welcome/index.tsx`,
  160×160).
- No tiene cuerpo, ni poses, ni voz, ni presencia en ninguna otra pantalla.
- Duolingo, Finch y Catzy construyen *toda* su personalidad sobre esto.

**D2. El welcome (#118) es correcto pero plano.** Esto es lo que hay:
- un bloque centrado: mascota, marca, tres chips, tagline;
- dos botones;
- una única entrada (fade + slide de 16 px en 240 ms).

Lo que no tiene:
- escena;
- personaje que hable;
- continuidad con el splash;
- vida tras la entrada: en cuanto termina, la pantalla queda estática.

**D3. La Home no tiene foco.**
- Los bloques pesan todos lo mismo: el resumen de 4 datos, el collar, los
  accesos rápidos y la gráfica semanal son tarjetas `surface` iguales.
- La cabecera fotográfica sin foto deja una banda oscura casi vacía. En
  `s136.png` se ve el blobatar recortado bajo la barra de estado, y un «—»
  bajo el nombre.
- Ningún bloque cuenta *qué pasa hoy* en una frase.

**D4. Inventario de movimiento: mínimo.** Lo que existe:
- la entrada del welcome;
- el pulso del punto de estado (`pet-hero-header`);
- el spring del indicador del tab bar;
- la barra de comidas (`MEALS_BAR_TIMING`);
- la barra de kcal + háptico en `food`;
- el pressed de los accesos rápidos (#136);
- los Skeleton de heroui.

Lo que no hay:
- **entrada de tarjetas**: ni entering ni stagger;
- **transición del skeleton al contenido**;
- **revelado de datos**;
- **ningún momento de éxito celebrado**: alta de mascota, collar vinculado,
  recordatorio hecho.

**D5. Los dieciséis estados vacíos son texto gris.**
`grep -n 'testID="[a-z-]*empty' src/screens/*/index.tsx` lista 16. Diez son de
pantalla completa:
- `home-empty`, `alerts-empty`, `reminders-empty`, `geofences-empty`,
  `docs-empty`;
- `weight-log-empty`, `meals-history-empty`, `health-empty`, `map-empty`,
  `profile-pets-empty`.

Seis van incrustados dentro de una tarjeta:
- `vaccines-empty`, `weight-card-empty`, `nutrition-profile-empty`;
- `meal-schedule-empty`, `meals-history-detail-empty`, `map-empty-overlay`.

Ninguno lleva ilustración ni CTA propio, salvo `geofences-empty` y
`docs-empty`, que van en `Card`.

**D6. Quedan restos de la plantilla de Expo en `assets/images/`.**
`react-logo*`, `expo-logo`, `expo-badge*`, `tutorial-web` y `tabIcons/` no se
usan. Borrarlos es limpieza trivial y no es parte de este bloque.

## 2. Referencias (ids durables)

### Welcome y onboarding

| Ref | Qué enseña |
|---|---|
| Duolingo `570060128/spl_qzhwp` | Splash a sangre en color de marca: la mascota y el wordmark solos |
| Duolingo `570060128/spl_koxjg` (vídeo) | La mascota **parpadea** en el splash y el corte al welcome conserva la mascota. Dos fotogramas bastan |
| Duolingo `570060128/spl_7vdk2` | Welcome en lienzo claro. Orden: mascota, wordmark, tagline de una línea, vacío generoso, CTA primario «gordo» con labio inferior, secundario con contorno |
| Duolingo `570060128/onb_5m5dr` | La mascota se presenta con un **bocadillo** («¡Hola! Soy Duo») y un solo CTA |
| Duolingo `570060128/onb_2fasx` | Pregunta de onboarding con barra de progreso segmentada arriba y la mascota en pequeño con bocadillo |
| Duolingo `570060128/onb_5mcra` | Espera con la mascota en pose temática y una frase de prueba social |
| Duolingo `570060128/onb_gdxb8` (vídeo) | Recorrido completo: personajes con bocadillo en cada paso y progreso siempre visible |
| Reddit `1064216828/spl_tu53h` | Welcome con **escena 3D** de personajes a media pantalla y titular corto encima. CTAs en píldora abajo |
| Reddit `1064216828/spl_c44qs` (vídeo) | El logo del splash se funde sobre la escena del welcome (crossfade más escala) |
| Reddit `1064216828/onb_3m0g0` | El registro va en sheet sobre el hero oscurecido: la escena no desaparece |
| BitePal `6479529917/onb_wbn0z` | «Este mapache es ahora tu mascota virtual»: titular enorme y personaje a pantalla |

### Home con personaje

| Ref | Qué enseña |
|---|---|
| Finch `1528595748/oth_qzbzi` | La mascota en su **escena** ocupa el primer tercio. Debajo, una barra de progreso del día y la lista de metas |
| Finch `1528595748/oth_i1gpe` | Al completar una meta caen confeti sobre la lista y un **toast con la mascota** («You're amazing!») sin salir de la pantalla |
| Finch `1528595748/oth_u8law` | El modal de acción se centra sobre la Home oscurecida |
| Catzy `6737681541/oth_f3yn6` | Habitación de la mascota como hero, slider de progreso y tareas en tarjetas con icono pastel |
| Catzy `6737681541/oth_a092j` | Celebración: banda de confeti, tarjeta de premio, bocadillo de la mascota y un CTA |

### Celebración

| Ref | Qué enseña |
|---|---|
| Rootd `1289018369/oth_8wz0q` | Hito: mascota celebrando, número grande, semana con check y CTA para compartir |
| Sofa `1276554886/oth_gqlrs` | «You finished!»: confeti sobre el objeto completado, resumen y un CTA |
| Trello `461504587/onb_h5xww` | Ilustración de personaje celebrando con check: plana, un solo color de fondo |
| amma `990178211/onb_q1cfc` | Registro con éxito: ilustración festiva con el nombre del usuario en el titular |
| Cozy Couples `6463766369/oth_zbz0v` | Intro de mascota en modal: icono, título, frase y CTA |

## 3. Patrones extraídos (lo comprobable en una captura)

**P1. La mascota es un personaje, no un logo.**
- Lleva poses por contexto: saluda, celebra, duerme, busca, se preocupa.
- Habla con bocadillo en primera persona.
- Aparece en welcome, vacíos, celebraciones y esperas.
- Nunca aparece en el chrome de uso frecuente (tab bar, cabeceras de lista).

**P2. Welcome = escena + una frase + dos CTA.**
- La escena ocupa del 40 % al 55 % del alto y el texto se queda en una o dos
  líneas.
- Hay continuidad desde el splash: la misma mascota, que escala o se funde.
- Tiene vida en reposo: parpadeo y flotación lenta.

**P3. Hay un CTA primario «con cuerpo».**
- Es una píldora en el color de marca, con un labio inferior más oscuro de
  unos 4 px.
- Al pulsarlo, el labio se comprime y el botón baja 2 px a la vez.
- Es la firma táctil de Duolingo. En este repo se haría con un token de acento
  oscuro y `boxShadow` o un borde: es grep-clean.

**P4. La Home empieza por el estado del día, contado por el personaje o la
mascota.**
- Primero va un hero con la mascota del usuario (foto o blobatar), un
  indicador de estado y **una frase** que resume el día.
- Después vienen los datos.

**P5. El éxito se celebra en proporción a su rareza.**

| Rareza | Ejemplos | Celebración |
|---|---|---|
| Rara | Primera mascota, collar vinculado | Pantalla completa con confeti, mascota y un CTA |
| Frecuente | Recordatorio hecho, peso registrado | Toast con la mascota, háptico Success y sin bloquear |

**P6. Vacío = ilustración, titular, una frase y un CTA.**
- La ilustración es la mascota en la pose del tema.
- El CTA lleva a la acción que llena la pantalla.

**P7. Entrada coreografiada una sola vez.**
- Las tarjetas entran con stagger corto (unos 60 ms) al montar.
- No se repite en refetch ni al volver a la tab.
- El skeleton se funde con el contenido en lugar de saltar.

## 4. Propuesta: features candidatas en orden

Los ids se asignan contra `origin/main` al registrarlas (memoria
`feature-id-asignacion-unica`); aquí van con letra.

**A. Set de ilustraciones de la mascota.** Es un asset, no código, y bloquea a
B, D y E.

- Hacen falta 8-10 poses de **cuerpo entero** del perro-robot, en el mismo
  render 3D que `splash-icon.png`.
- Formato: fondo transparente, encuadre y luz iguales, unos 1024 px y
  exportadas a WebP.
- Lista mínima:
  1. saluda (welcome);
  2. con bocadillo neutro (onboarding);
  3. celebra con los brazos arriba;
  4. duerme (vacío de alertas: «todo tranquilo»);
  5. con lupa o mapa (mapa sin posición, geocercas vacías);
  6. con collar en la pata (vinculación);
  7. con estetoscopio o jeringa (salud, vacunas);
  8. con cuenco (comidas);
  9. con portapapeles (documentos, recordatorios);
  10. preocupada (error o sin conexión).
- Parpadeo: un par de la pose 1 con ojos cerrados permite parpadeo por
  crossfade sin dependencias.
- **Producción:** decide el humano (§5 D2).

**B. Welcome con mascota.** Depende de A.
- Lienzo claro (`bg-background`; el dark se diseña).
- Escena: la mascota de cuerpo entero sobre un óvalo `bg-accent-soft` y los
  tres chips orbitando con entrada escalonada.
- Bocadillo: «¡Hola! Soy <nombre>, cuidaré de <tu peludo> contigo».
- Debajo, la marca y una línea.
- CTA primario «con cuerpo» (P3) y el secundario con contorno.
- Movimiento:
  - la mascota entra con spring de escala desde el centro (continuidad con el
    splash);
  - flota ±4 px con un ciclo de 2,4 s;
  - parpadea cada 3-5 s;
  - los chips aparecen con stagger;
  - todo se apaga con reduce-motion.
- Copy nueva: claves en/es más los candados de catálogo (memoria
  `candado-catalogo-omitido-en-specs`).

**C. Cimientos de movimiento y Home viva.** No depende de A; puede arrancar
ya.
- Tokens `--motion-*` (la carta ya lo pide si los valores se repiten).
- `PressableScale` compartido (audit A1).
- Preset de entrada: `FadeInDown.springify().damping(16).stiffness(180)`, 60
  ms de stagger (audit A2).
- Home:
  - stagger de tarjetas al montar;
  - crossfade del skeleton al contenido;
  - las cifras del resumen se revelan;
  - la batería se rellena con una barra animada.
- La spec declara las siete preguntas (carta §Dirección de arte 3).

**D. Estados vacíos ilustrados.** Depende de A.
- Componente `EmptyState` en `src/components/`: pose, título, frase y CTA
  opcional. Cumple la regla de extracción, porque lo usan 10 pantallas.
- Se aplica a los 10 vacíos de pantalla de D5.
- Los 6 incrustados siguen en texto: no caben.

**E. Celebraciones.** Depende de A.
- Confeti propio con Reanimated (unas 24 `Animated.View` con caída y giro).
  Sin dependencia: no hace falta Skia ni Lottie para esto.
- Raras, a pantalla completa:
  - primera mascota dada de alta;
  - collar vinculado.
- Frecuentes, en toast con la mascota:
  - recordatorio marcado;
  - peso registrado.
- Háptico `notificationAsync(Success)` en el mismo frame (carta
  §Animación).

**F. Hero de la Home con frase del día.** Producto y UI.
- Rehace la cabecera:
  - la mascota del usuario grande, con un anillo de estado (seguro / fuera de
    geocerca / sin señal);
  - una frase que responda a varias de las siete preguntas («Rocky está en
    casa · 3 h 34 m de actividad · collar al 54 %»).
- Resuelve también el «—» y la banda vacía de D3.
- **Antes de la spec hay que verificar** qué datos sirve ya la API.
  Una «meta diaria» como la barra de Finch **no existe** hoy, y no se
  inventa.

**G. Onboarding con preguntas antes del registro.** Opcional, es el patrón
Duolingo:
1. La mascota pregunta en 3 o 4 pasos: nombre de tu mascota, especie, ¿tienes
   collar?
2. La barra de progreso es segmentada.
3. Después viene el registro.
4. Al final, add-pet llega precargado.

Toca el registro y add-pet: es la más cara y la de más riesgo.

Orden recomendado:
1. **C** ya, en paralelo con **A**, que hace el humano.
2. Después **B**, luego **D**, luego **E**.
3. **F** y **G**, solo si el humano las quiere.

## 5. Decisiones del humano (no se infieren)

**D1. Nombre y voz de la mascota.** Hace falta para el bocadillo y el copy en
dos idiomas.

**D2. Quién produce las poses (A).** Hay dos vías:
- **(a)** El humano vincula su cuenta de Figma con Weave
  (app.weavy.ai → Settings → Profile). Con eso el leader puede generar las
  poses con un modelo de imagen, tomando `splash-icon.png` como referencia, y
  el humano aprueba cada una.
- **(b)** El humano las genera con la herramienta con la que hizo
  `splash-icon.png`.

Probado el 2026-10-06: Weave responde «You haven't linked your Figma account
to Weave yet».

**D3. ¿Rive o Lottie, o Reanimated + PNG?**

| Vía | Qué da | Coste |
|---|---|---|
| Reanimated + PNG (recomendada) | Flotación, inclinación, squash y parpadeo por crossfade. Sin dependencias nuevas | Bajo |
| Rive (`rive-react-native`) | Animación de personaje real con máquina de estados | Exige rehacer la mascota en vector 2D, porque el render 3D no se traduce, y añade una dependencia |
| Lottie | Igual que Rive | Mismo problema de estilo |

**D4. ¿El CTA «con cuerpo» (P3) va en toda la app o solo en welcome y
celebraciones?** Si va en toda la app, cambia el Button de heroui y es una
decisión de sistema.

**D5. ¿Onboarding antes del registro (G)?** Sí, no, o más adelante.

**D6. ¿F (hero con frase del día) entra en este bloque?**
