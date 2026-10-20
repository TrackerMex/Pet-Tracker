---
feature: "mobile-pairing-pingo-canvas-fidelity"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-pairing-pingo-canvas-fidelity]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Decisiones técnicas en [[design]]; orden de trabajo en [[tasks]]; trazabilidad en [[traceability]].
> Las decisiones D<n> las cierra el humano en este documento antes de firmar el gate.

## Contexto

Feature #188. Lleva la vista de vinculación de `mobile-pet-tracker/src/screens/pairing/index.tsx` a la fidelidad del artboard «Vincular collar (19)» del canvas aprobado. Fuente: `project/Vincular.dc.html` dentro del canvas vivo `https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j`. El HTML guardado en disco es la carcasa del runtime y no contiene artboards.

Estado de partida, verificado contra cbd964da por contenido: la pantalla no tiene Pingo, ni Reanimated, ni `PingoFloat`; el título de la rama sin dispositivo usa `text-2xl`; el contenedor desplazable usa `padding: 24`; el banner de plan gratuito y la pista de la caja ya existen con claves de catálogo. En `src/theme/global.css` no existen los tokens `--text-24` ni `--text-2xl`. El asset `pingo-collar.webp` sí existe en `mobile-pet-tracker/assets/images/`.

Referencia de exploración: `progress/explore_canvas-parity-2026-10-16.md`, sección «N4 — mobile-pairing-pingo-canvas-fidelity».

Términos usados abajo:
- **Vista de vinculación**: la rama de `pairing` con `phase === 'idle' && selectedPet?.device === null`.
- **Reduce motion**: `useReducedMotion()` de Reanimated devuelve true.
- **Copy**: sale del catálogo `src/i18n/catalog.ts`. El catálogo gana sobre el artboard; no se inventa copy (Voz B, #155).

## Requisitos funcionales

- **R1**: WHILE la vista de vinculación está activa THE SYSTEM SHALL mostrar a Pingo en pose collar (`pingo-collar.webp`) como primer elemento visual del contenido, con testID `pairing-pingo`.
  - Test: el render de la vista contiene `pairing-pingo`; su fuente es `pingo-collar.webp` y no `pingo-wave.webp`.

- **R2**: WHILE la vista de vinculación está activa Y reduce motion está desactivado THE SYSTEM SHALL mostrar exactamente dos anillos (testIDs `pairing-ring-0` y `pairing-ring-1`) detrás de Pingo, cada uno un círculo de 150 px con borde de 3 px en el color `accent`.
  - Test: existen `pairing-ring-0` y `pairing-ring-1`; no existe `pairing-ring-2`; el className de cada anillo contiene `size-37.5`, `rounded-full`, `border-3` y `border-accent`.

- **R3**: WHILE los anillos animan THE SYSTEM SHALL animar cada anillo solo en `transform` (escala de 0.55 a 1.5) y `opacity` (de 0.55 a 0), con `MOTION_PING_TIMING` (2400 ms, repetición infinita sin reversa); el anillo 0 empieza sin retardo y el anillo 1 con retardo de 1200 ms.
  - Test: con `toHaveAnimatedStyle` y `shouldMatchAllProps: true`, en t = 0 ms ambos anillos valen escala 0.55 y opacidad 0.55; en t = 600 ms el anillo 0 tiene escala y opacidad intermedias y el anillo 1 conserva 0.55 y 0.55; en t = 2400 ms el anillo 0 vuelve a 0.55 y 0.55. Los valores son literales en el test, no importados de `src/theme/motion.ts`.

- **R4**: WHILE la vista de vinculación está activa Y reduce motion está desactivado THE SYSTEM SHALL flotar a Pingo mediante `PingoFloat` (testID `pairing-pingo-float`), con medio ciclo de 1500 ms y desplazamiento vertical de 10 px (valores de `PingoFloat`; ciclo completo de 3000 ms).
  - Test: con temporizadores falsos, el `translateY` de `pairing-pingo-float` vale 0 en t = 0 ms, -10 en t = 1500 ms y 0 en t = 3000 ms.

- **R5**: WHILE la vista de vinculación está activa Y reduce motion está activado THE SYSTEM SHALL mostrar los dos anillos en reposo (escala 1, opacidad 0.3, sin animación) y Pingo sin desplazamiento, sin ninguna animación en curso en la vista. El valor lo fija la decisión D2; opción recomendada: anillos estáticos.
  - Test: con `useReducedMotion` simulado a true, los dos anillos existen con escala 1 y opacidad 0.3; sus valores no cambian entre t = 0 ms y t = 2400 ms; `pairing-pingo-float` vale 0 en t = 1500 ms.

- **R6**: WHILE la vista de vinculación está activa THE SYSTEM SHALL mostrar el título, con el texto de la clave `pairing.pairCollar`, como primer texto del contenido desplazable (testID `pairing-title`), y no en la cabecera nativa (la ruta `pairing` mantiene `title: ''`).
  - Literales: es «Vincular collar»; en «Pair collar».
  - Test: `pairing-title` está dentro de `pairing-form`; su texto es «Vincular collar» con locale es y «Pair collar» con locale en.

- **R7**: WHILE la vista de vinculación está activa THE SYSTEM SHALL dar al título tamaño de 24 px y peso 900 mediante el token que fije la decisión D4 (recomendado: `text-24`, con `--text-24: 24px` nuevo en `src/theme/global.css`). THE SYSTEM SHALL NOT usar `text-2xl` ni clases con corchetes en el título.
  - Test: el className de `pairing-title` contiene la clase de D4 y `font-black`, y no contiene `text-2xl` ni `[`.

- **R8**: WHILE la vista de vinculación está activa THE SYSTEM SHALL mostrar, de arriba abajo y en este orden: `pairing-pingo`, `pairing-title`, `pairing-subtitle` (solo si R9 aplica), `pairing-plan-free` (texto de `pairing.freePlanPairPrompt`), la etiqueta de `pairing.activationCode`, `activation-code-input`, la pista de `pairing.printedOnCollarBox` y `pairing-submit`.
  - Literales: es «Código de activación», «Impreso en la caja del collar», «Plan gratuito — solo salud. Vincula un collar con plan activo para ver el mapa.»; en «Activation code», «Printed on the collar box», «Free plan — health only. Pair a collar with an active plan to see the map.»
  - Test: el orden de aparición de los testIDs en el árbol coincide con la lista, y `pairing-subtitle` no existe mientras D5 no esté cerrada con un subtítulo.

- **R9**: WHERE la decisión D5 aprueba un subtítulo, WHILE la vista de vinculación está activa THE SYSTEM SHALL mostrar ese subtítulo debajo del título, dentro del contenido, con el literal aprobado en cada locale. IF D5 no aprueba copy THEN THE SYSTEM SHALL NOT mostrar `pairing-subtitle` en ningún estado.
  - Test: según el resultado de D5, `pairing-subtitle` existe con el literal de cada locale, o no existe en ningún estado.

- **R10**: THE SYSTEM SHALL aplicar un padding horizontal de 20 px al contenedor desplazable `pairing-form` en la vista de vinculación y en el estado con dispositivo emparejado, registrado como excepción nombrada en `docs/conventions.md` (decisión D6). IF D6 se decide en 24 px THEN este requisito se reescribe antes de implementar.
  - Test: el `contentContainerStyle` de `pairing-form` tiene `paddingHorizontal` 20 en la vista de vinculación y en el estado con dispositivo emparejado.

- **R11**: THE SYSTEM SHALL resolver todo texto visible nuevo de `pairing` mediante claves de `src/i18n/catalog.ts` con entrada en `es` y en `en`, sin literales de copy en `src/screens/pairing/index.tsx`, y SHALL registrar cada clave usada por la vista en `src/__tests__/ui-copy-table.ts`.
  - Test: grep-clean sobre `index.tsx` sin literales de copy entre etiquetas JSX ni en props de texto; paridad es/en de las claves de la vista; cada clave de la vista aparece en `ui-copy-table.ts`.

- **R12**: THE SYSTEM SHALL cumplir las guardas de diseño: `design-drift`, `consistency-classnames`, `legibility-classnames` y `heroui-text-size-merge` pasan, y ni `index.tsx` ni `src/components/ping-ring.tsx` contienen colores hexadecimales ni clases con corchetes.
  - Test: las cuatro suites pasan; el grep de cero coincidencias (hex y corchetes) se valida plantando una coincidencia temporal y comprobando que el grep la detecta.

- **R13**: WHEN el anillo se extrae a `src/components/ping-ring.tsx` THE SYSTEM SHALL conservar el comportamiento de `welcome`: tres anillos `welcome-ring-<n>` con sus clases actuales (`size-65 rounded-full border-2 border-accent`) y retardo `index * (MOTION_PING_TIMING.duration / 3)` (800 ms para el índice 1 y 1600 ms para el índice 2), sin cambiar ninguna aserción de `screens/welcome/index.test.tsx` (decisión D3).
  - Test: `PingRing` recibe el retardo por prop y lo aplica (literales 800 y 1600 en el test del componente); `screens/welcome/index.test.tsx` pasa sin editar aserciones.

- **R14**: WHILE la pantalla está en un estado distinto de la vista de vinculación (dispositivo emparejado, fase `ready` o sin mascotas) THE SYSTEM SHALL renderizar sin el hero (`pairing-pingo`, anillos y `pairing-pingo-float`), con sus testIDs actuales (`device-status-card`, `plan-tracked`, `plan-free`, `plan-unknown`, `device-unpair`, `pairing-ready`, `pairing-no-pets`).
  - Test: los tests actuales de `src/screens/pairing/index.test.tsx` pasan, y en cada uno de esos estados no existen `pairing-pingo` ni `pairing-ring-0`.

## Fuera de alcance

- Receta visual del botón `pairing-submit` (alto 56 px, radio 16, 17 px con peso 800, sombra `--lip`): pertenece a #177, ya mergeada en `origin/main` (cbd964da) y no bloquea esta feature. #188 no la define ni la prueba.
- Mensaje de error del campo de código y FieldError global: #186. La receta visual de etiqueta, input y pista del código (alto, borde, tipografía monoespaciada) la trae E2 a #188 como R20 (ED3 b, que reabre D7 solo para eso).
- Estado sin mascotas `pairing-no-pets` y su centrado: #181, ya cerrada. #188 no lo toca (R14).
- Stepper «pasos con progreso»: fuera por defecto (D1).
- Pantalla de celebración `pairing-ready`: #171, sin cambios.
- Anillo de la alerta (`src/screens/alert-detail/ping-ring.tsx`, #180): otra implementación, sin cambios.
- Backend, API, lógica de emparejamiento y estado de dispositivo: sin cambios.
- Copy distinto de los literales ya en el catálogo, salvo el subtítulo aprobado en D5.
- Pose de Pingo distinta de collar.
- Cabecera nativa de la ruta `pairing` (sigue con `title: ''`).
- Título de la rama con dispositivo emparejado (la que contiene `device-status-card`), que sigue con `text-2xl`: #188 no lo toca. R14 no fija su tipografía; queda como deuda de tipografía para una feature propia, sin requisito en esta spec.

## Decisiones abiertas

Cada decisión tiene opciones, recomendación y requisito afectado. El spec_author no cierra ninguna.

- **D1 Stepper «pasos con progreso»**. #170 lo prometió; el artboard no lo contiene. Recomendado: no construirlo en #188; si se quiere, es una feature aparte con su spec. Afecta a: Fuera de alcance.
- **D2 Reduce motion**. (a) Anillos en reposo y Pingo estático: propuesta del leader; coincide con el artboard, cuyo `animation: none` bajo reduce motion deja visibles los anillos en su estado base (opacidad 0.3). (b) No pintar anillos: precedente de #167 en welcome. La opacidad de reposo 0.3 es la base del artboard; la animación parte de 0.55 (`MOTION_PING_FROM`, como welcome). Si el humano prefiere reposo en 0.55, cambia R5 antes de firmar. Recomendado: (a), declarado en la enmienda propia de anillos. Afecta a: R5.
- **D3 Extracción de `PingRing`**. (a) Extraer a `src/components/ping-ring.tsx` con props de `testID`, retardo y clases; welcome lo consume sin cambio de comportamiento. (b) Copia local en `pairing`, con deriva futura. Recomendado: (a). Amplía el reparto a `src/screens/welcome/index.tsx` y al fichero nuevo. Afecta a: R13.
- **D4 Token del título**. El artboard y D-H (#178) piden 24 px; el token `--text-24` no existe. (a) Añadir `--text-24: 24px` a `global.css`; fichero compartido: revisar antes de implementar qué otras features añaden tokens de tipografía. (b) Usar `text-26`, existente, que es 2 px mayor que D-H. (c) Mantener `text-2xl`, que incumple la regla `--text-<px>`. Recomendado: (a). Afecta a: R7.
- **D5 Subtítulo**. El artboard no tiene subtítulo y el catálogo no tiene clave. (a) No mostrar subtítulo; recomendado, porque no se inventa copy. (b) Nueva clave en `catalog.ts` con literal aprobado por el humano en Voz B; la colocación ya decidida (dentro del contenido, bajo el título) se mantiene. Afecta a: R8, R9.
- **D6 Margen horizontal**. El artboard usa 20 px; `docs/conventions.md` fija 24 px como estándar y solo admite excepciones nombradas. (a) Excepción nombrada de 20 px, registrada en `conventions.md`; recomendado, porque la feature es fidelidad al canvas. (b) 24 px estándar: desvío de 4 px del artboard, declarado. Afecta a: R10.
- **D7 Solapes**. #186 (input de código y FieldError global) está pendiente y toca el mismo entorno de la vista; #181 ya está cerrada. Recomendado: #188 no cambia el input ni el estado sin mascotas; la receta del input la fija #186. Si el humano asigna el input a #188, se añade un requisito nuevo en enmienda. Afecta a: Fuera de alcance, R8.

## Supuestos de entorno

- Tests Jest con React Native Testing Library 14 en el worktree de la feature: `fireEvent` y `act` se esperan con `await`.
- Los valores de tiempo de los tests son literales y salen de la duración real del movimiento. R3 mide el reinicio del ciclo en 2401 ms, no en 2400 ms (E1).
- El worktree no tiene `graphify-out/graph.json`; la búsqueda de código se hace con grep acotado.
- El smoke de dispositivo (H1 y H2) lo corre el humano en el build de desarrollo Android de su PC. No se usa Expo Go ni la VPS. Esta feature no mide 60 fps en build release: queda como limitación declarada.
- Reduce motion en Android se activa con el ajuste del sistema «Quitar animaciones» (en inglés «Remove animations»). Los tests lo simulan con el mock de `useReducedMotion`.

## Enmiendas

### E1 — R3: el reinicio del ciclo se mide a 2401 ms, no a 2400 ms

- **Qué cambia**: la cláusula de R3 para t = 2400 ms. Donde R3 dice que en t = 2400 ms el anillo 0 vuelve a 0.55 y 0.55, E1 la sustituye: en t = 2400 ms el anillo 0 vale escala 1.5 y opacidad 0, que es el valor final del ciclo. El resto de R3 no cambia: los valores de t = 0 ms y t = 600 ms, el retardo de 1200 ms del anillo 1, `MOTION_PING_TIMING` y la repetición infinita sin reversa.
- **Por qué**: `withRepeat` sobre `withTiming` con `MOTION_PING_TIMING` entrega el valor final en el instante 2400 ms, y el ciclo siguiente arranca justo después, desde 0.55. Medido con temporizadores falsos de Jest sobre la vista de vinculación (2026-10-19): 2400 ms → escala 1.5, opacidad 0; 2401 ms → escala 0.5517, opacidad 0.5490; 2402 ms → escala 0.5534, opacidad 0.5480; 2416 ms → escala 0.5774, opacidad 0.5341.
- **Qué exige R3 en t = 2401 ms**:
  - Escala estrictamente entre 0.55 y 0.6, y opacidad estrictamente entre 0.5 y 0.55.
  - Se comprueba con desigualdades sobre el estilo leído, con claves exactas `opacity` y `transform`; no con `toHaveAnimatedStyle`. Los límites son literales en el test, no importados de `src/theme/motion.ts`.
- **Por qué intervalos**: a 2401 ms el valor depende de la curva y del reloj. El intervalo exige solo que el ciclo haya reiniciado desde 0.55 y avance hacia 1.5. Un anillo sin reinicio (queda en 1.5 y 0), uno con reversa o un anillo 0 con retardo de 1200 ms quedan fuera de ambos intervalos a 2401 ms.

### E2 — Geometría del artboard: R15–R20 y decisiones ED1–ED4

- **Qué cambia**: añade R15 a R20 y cierra ED1 a ED4. Donde E2 choca con el texto anterior, E2 prevalece:
  - R16 sustituye la cláusula de tamaño de R7: 28 px en lugar de 24 px.
  - R17 es la excepción a «primer elemento visual» de R1 y a «primer texto del contenido» de R6: la fila del avatar, con la inicial de la mascota cuando no hay foto, precede al hero y al título.
  - R18 sustituye la clave `pairing.freePlanPairPrompt` por dos claves. R8 y R11 leen esas dos donde nombran la clave anterior; el texto visible de `pairing-plan-free` no cambia.
  - R19 añade `flexGrow: 1` al `contentContainerStyle` solo en la vista de vinculación. R10 sigue mandando sobre `paddingHorizontal`, `paddingVertical`, `gap` y `paddingBottom`, que no cambian.
  - R20 reabre D7 solo para la etiqueta, el input y la pista del código. El mensaje de error de campo y la validación siguen fuera.
  El resto de R1–R14 no cambia.
- **Por qué**: en el dispositivo, la vista de vinculación no coincide con el artboard «Vincular collar (19)» (`project/Vincular.dc.html`, versión 1792513497-a876). Las diferencias son: título sin centrar, Pingo a 150 px (el artboard usa 120 px), selector de mascota entre título y banner (el artboard tiene un único avatar arriba a la derecha), botón «Vincular collar» sin anclar al fondo, banner de plan gratuito con otro aspecto y etiqueta, input y pista con otra receta. D4 y R7 dan 24 px para el título y atribuyen esa cifra al artboard; el artboard declara `font-size: 28px` en el `h1`. La premisa era incorrecta, y ED1 la corrige.
- **Cierre de ED1–ED4 (2026-10-20)**:
  - Notion: la página del espejo (`3fe6115a-9b27-8138-8b8a-f251f23b7c31`) tiene `Estado del gate` = Aprobado, con `page_last_edited_at` = 2026-10-20T17:55:45.832Z (leída dos veces por el leader, con el mismo valor). La casilla «E2 aprobada por humano» está marcada en el espejo. Notion da la propiedad y la marca de tiempo, no la cuenta que editó.
  - Instrucción del humano en el chat, literal: «listo ya aprobe 188 de ED1 a ED4 aplicalas tal cual como en artboard, el avatar solo debe de aparecer el de la mascota no todo el listado de mascotas que tienme un usuario».
  - Lectura del leader de «tal cual como en artboard»: en cada decisión se elige la opción que reproduce el artboard. ED3 (a) y ED4 (a) listan diferencias declaradas frente al artboard; ED3 (b) y ED4 (b) las eliminan.
  - El texto de R17 (un único avatar), R18 (dos claves) y R20 lo derivó el leader de esa instrucción y de las opciones (b) de ED3 y ED4. El espejo que el humano vio al aprobar tenía en R17 un `PetSwitcher` con `variant="avatars"` y no tenía R20. Si el humano prefiere releerlo, `Estado del gate` vuelve a En revisión y el handoff a Codex no sale hasta la nueva aprobación.
- **Requisitos nuevos**: R15 a R20 se numeran a continuación de R14 y siguen la misma notación. Los literales de copy salen del catálogo; la única clave que cambia es la del banner (R18).

- **R15**: WHILE la vista de vinculación está activa THE SYSTEM SHALL agrupar el hero y `pairing-title` en un bloque vertical (testID `pairing-hero-group`) con 10 px de separación, centrado en horizontal. El hero (testID `pairing-hero`) es una caja de 200 × 150 px que centra los anillos de R2 y `pairing-pingo`; `pairing-pingo` mide 120 px de ancho y alto proporcional a la imagen.
  - Test: `pairing-hero` tiene las clases `w-50` y `h-37.5`; `pairing-pingo` tiene `width` 120 y `aspectRatio` 1 (el asset es de 1024 × 1024) y ningún `height`; `pairing-hero` y `pairing-title` son hijos directos de `pairing-hero-group`, que tiene `items-center` y `gap-2.5`; los anillos y `pairing-pingo-float` son hijos de `pairing-hero` en el orden de R2.

- **R16**: WHILE la vista de vinculación está activa THE SYSTEM SHALL mostrar `pairing-title` centrado en horizontal, con peso 900, espaciado `tracking-title` (−0.02 em) y 28 px (`text-28`, con el token nuevo `--text-28: 28px` en `src/theme/global.css`). Esta cláusula sustituye la de tamaño de R7.
  - Test: el className de `pairing-title` contiene `text-center`, `text-28`, `font-black`, `tracking-title` y `text-foreground`; no contiene `text-24`, `text-2xl` ni `[`.

- **R17**: WHILE la vista de vinculación está activa THE SYSTEM SHALL mostrar, como primer elemento del contenido y encima del hero, una fila alineada a la derecha (testID `pairing-pet-row`) con un único avatar: el de la mascota seleccionada (testID `pairing-pet-avatar`).
  - El avatar mide 36 px (`size-9 rounded-full`) y va dentro de un anillo de 2 px en `accent` con 3 px de separación (`rounded-full border-2 border-accent p-0.75`; 46 px en total), como el «R» de la cabecera del artboard. El anillo lleva `accessibilityLabel` = nombre de la mascota y no es interactivo (sin `onPress` ni rol de botón).
  - Con foto, el avatar es la foto (`PetAvatar`, 36 px, testID `pairing-pet-avatar-image`). Sin foto, es la inicial del nombre en mayúscula (testID `pairing-pet-avatar-fallback`, `text-sm font-extrabold`) sobre el hueco de la paleta categórica que corresponde al índice de la mascota en la lista: `amber`, `violet`, `blue`, `green`, `rose`, en ese orden y cíclico, como en el selector de avatares.
  - THE SYSTEM SHALL NOT mostrar en la vista de vinculación el listado de mascotas: ni `PetSwitcher` en ninguna variante ni ningún `pet-chip-<id>`.
  - En los demás estados (dispositivo emparejado, fase `ready`) el selector `PetSwitcher` no cambia de sitio ni de variante, y la fila de avatar no existe.
  - Test: con dos mascotas y la primera seleccionada, existe exactamente un `pairing-pet-avatar`, aparece en el árbol antes que `pairing-pingo` y su `accessibilityLabel` es el nombre de la primera; no existe ningún `pet-chip-*`. Con la segunda seleccionada, el avatar es el de la segunda y su disco usa `bg-category-violet` (la primera usa `bg-category-amber`). Sin foto, `pairing-pet-avatar-fallback` muestra la inicial en mayúscula; con foto existe `pairing-pet-avatar-image` y no existe el de inicial. El anillo y el disco llevan las clases citadas y el anillo no tiene `onPress`. En el estado emparejado y en `ready` con dos mascotas existen `pet-chip-<id>` y no existe `pairing-pet-avatar`.

- **R18**: WHILE la vista de vinculación está activa THE SYSTEM SHALL mostrar `pairing-plan-free` como banner a ancho completo: un `View` (no un `Card`, porque `twMerge` descarta el radio con nombre en los componentes de heroui-native) con `flex-row items-start gap-2.5 rounded-tile bg-default px-3.5 py-3`, es decir, radio de 18 px, relleno de 12 px arriba y abajo y de 14 px a los lados y 10 px entre icono y texto.
  - A la izquierda va `InfoCircle` de `reicon-react-native`, de 20 px, en el color `muted` resuelto con `useThemeColors`, dentro de un contenedor con `mt-px`.
  - A la derecha va `pairing-plan-free`, un `Text` con `flex-1 text-13 font-normal leading-4.75 text-muted` (19 px de interlineado, el 1.45 del artboard sobre 13 px) que contiene dos textos separados por un espacio: la clave `pairing.freePlanPairLead` en un `Text` anidado con `font-bold text-foreground`, y la clave `pairing.freePlanPairBody` en el color del `Text` exterior.
  - Literales: `pairing.freePlanPairLead` es «Plan gratuito — solo salud.» en es y «Free plan — health only.» en en; `pairing.freePlanPairBody` es «Vincula un collar con plan activo para ver el mapa.» en es y «Pair a collar with an active plan to see the map.» en en. El texto completo de `pairing-plan-free` es el literal de R8 en cada locale.
  - La clave `pairing.freePlanPairPrompt` desaparece de `src/i18n/catalog.ts` (es y en), de `src/__tests__/ui-copy-table.ts` y de la lista de claves de `src/__tests__/pairing-canvas-fidelity.test.ts`; las dos claves nuevas se registran en `ui-copy-table.ts`. El banner está a 16 px de `pairing-title` y de la etiqueta del código, por el `gap` del contenedor.
  - Test: `pairing-plan-free` tiene `text-13`, `font-normal`, `leading-4.75` y `text-muted` y su texto completo es el de R8 en es y en; el `Text` anidado del lead tiene `font-bold` y `text-foreground`; el padre directo del icono y del texto tiene `bg-default`, `rounded-tile` y `gap-2.5` y no es un `Card`; el icono se renderiza con `size` 20 y el color de `muted`; `pairing.freePlanPairPrompt` no existe en `catalog.ts`.

- **R19**: WHILE la vista de vinculación está activa THE SYSTEM SHALL anclar `pairing-submit` al borde inferior del contenido: el `contentContainerStyle` de `pairing-form` tiene `flexGrow: 1` y un espaciador con `flexGrow: 1` (testID `pairing-submit-spacer`) precede a `pairing-submit`. La receta visual de `pairing-submit` de #177 no cambia. En los demás estados el `contentContainerStyle` no gana `flexGrow`.
  - Test: el `contentContainerStyle` de `pairing-form` tiene `flexGrow` 1 en la vista de vinculación y no lo tiene en el estado emparejado; el elemento inmediatamente anterior a `pairing-submit` es `pairing-submit-spacer`, con `flexGrow` 1; `pairing-submit` es el último elemento del formulario.

- **R20**: WHILE la vista de vinculación está activa THE SYSTEM SHALL dar a la etiqueta, al input y a la pista del código la receta del artboard, dentro de un contenedor con 6 px de separación entre los tres (`gap-1.5`):
  - Etiqueta `pairing-activation-code-label`: `text-sm font-extrabold text-foreground` (14 px). Pierde `uppercase`, `tracking-widest`, `text-xs`, `font-semibold` y `text-muted`.
  - Input `activation-code-input`: `h-15 rounded-14 border-2 border-accent bg-default px-4 font-mono text-24 tracking-code text-foreground`, es decir, alto de 60 px, radio de 14 px, borde de 2 px en `accent` siempre, fondo `bg-default`, relleno horizontal de 16 px, monoespaciado de 24 px y espaciado de 0.14 em. Pierde `min-h-12`, `rounded-xl` y `py-3`. Conserva `CONTINUOUS_CORNER`, `autoCapitalize="characters"`, `autoCorrect={false}`, `maxLength={64}`, `value` y `onChangeText`; no transforma el valor, y el código enviado sigue siendo `code.trim()`.
  - Pista `pairing-code-hint`: una fila `flex-row items-center gap-1.5` con el icono `Package` de `reicon-react-native` de 14 px en el color `muted` y, a su lado, el texto de `pairing.printedOnCollarBox` con `text-xs font-semibold text-muted` (12 px).
  - Tokens nuevos en `src/theme/global.css`, dentro de `@theme`: `--text-28: 28px` (R16), `--tracking-code: 0.14em` y `--font-mono: monospace`. Este último fija `font-mono` en la familia genérica `monospace` de Android, porque la pila por defecto de Tailwind empieza por `ui-monospace`, que React Native no resuelve.
  - Test: los className de etiqueta, input y pista contienen las clases citadas y ninguna de las que pierden; el contenedor de los tres tiene `gap-1.5`; el input conserva las props citadas; el icono `Package` se renderiza con `size` 14 y el color de `muted`; al escribir `  ACT-002  ` el valor del input sigue siendo el escrito y `claimDevice` recibe `ACT-002`; `global.css` declara `--text-28: 28px`, `--tracking-code: 0.14em` y `--font-mono: monospace`.

- **Decisiones cerradas** (2026-10-20, ver «Cierre de ED1–ED4»):
  - **ED1 Tamaño del título**: (a) 28 px con el token nuevo `--text-28: 28px`. Afecta a: R16, R7.
  - **ED2 Selector de mascota**: (a) fila superior alineada a la derecha, encima de Pingo, con el avatar de la mascota seleccionada y sin el listado de mascotas (indicación del humano). Afecta a: R17, R18.
  - **ED3 Etiqueta, input y pista**: (b) pasan a #188 como R20 y D7 se reabre solo para eso. Afecta a: R8, Fuera de alcance.
  - **ED4 Negrita del banner**: (b) `pairing.freePlanPairPrompt` se parte en dos claves y «Plan gratuito — solo salud.» va en negrita. Afecta a: R8, R11, R18.
- **Consecuencia de ED2, para el humano**: en la vista de vinculación ya no se puede cambiar de mascota desde `pairing`; el cambio se hace desde otra pantalla. El selector completo sigue en los estados emparejado y `ready`.
- **Diferencias declaradas que E2 no corrige**:
  - Cabecera nativa con atrás: el artboard pone el chevron y el avatar en una misma fila; aquí el chevron vive en la cabecera nativa (la ruta sigue con `title: ''`) y el avatar abre el contenido, debajo.
  - Margen inferior de `insets.bottom + 24` en lugar de 40 px.
  - Entrada animada `rise` de 400 ms del artboard, que esta spec no fija.
  - Separación entre la pista del código y el botón: el artboard usa `margin-top: auto` con 16 px de mínimo; R19 usa un espaciador entre dos `gap` de 16 px, así que el mínimo es 32 px cuando el contenido no cabe en pantalla. Cuando cabe, el botón queda anclado al fondo en ambos.
  - Código del input: el artboard pide peso 900 y monoespaciado a la vez. En este proyecto los pesos son familias de fuente (`--font-black: 'Inter-Black'`) y no se combinan con `monospace`; prevalece el monoespaciado y el peso queda en el del sistema.
  - Código del input: el artboard fuerza mayúsculas con `text-transform`; aquí las pone el teclado (`autoCapitalize="characters"`) y el valor no se transforma.
  - Esquina continua del banner: el banner de R18 es un `View` sin `style={CONTINUOUS_CORNER}` (el `Card` anterior la fusionaba). `borderCurve: 'continuous'` solo actúa en iOS y H3 se verifica en Android; no se añade, así los candados de recuento de `consistency-classnames` no cambian.
  - Solo se verifica en Android (H3). La familia `monospace` es genérica de Android; en iOS cae en la fuente del sistema y no se comprueba.
- **Antes de implementar**: E2 necesita su aprobación (ver §Aprobación). `design.md`, `tasks.md` y `traceability.md` cubren R15–R20; con la casilla de E2 firmada, el handoff a Codex puede salir.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-19) ← gate obligatorio antes de implementar
- [x] D1 cerrada por humano: stepper fuera de #188 (recomendado)
- [x] D2 cerrada por humano: reduce motion con anillos en reposo (a)
- [x] D3 cerrada por humano: extracción de `PingRing` y reparto ampliado a welcome (a)
- [x] D4 cerrada por humano: token `text-24` nuevo (a)
- [x] D5 cerrada por humano: sin subtítulo (a)
- [x] D6 cerrada por humano: margen 20 px como excepción nombrada (a)
- [x] D7 cerrada por humano: solapes con #186 y #181 (recomendado)
- [x] E1 aprobada por humano (Notion, «Estado del gate» = Aprobado)
- [x] E2 aprobada por humano (Notion, «Estado del gate» = Aprobado), con ED1–ED4 cerradas por humano. Gate obligatorio antes de implementar E2.
- [ ] H1 verificado en dispositivo por el humano: anillos de 2400 ms con el segundo a 1200 ms de retardo y flotado de 3000 ms por ciclo, en build de desarrollo Android (no Expo Go, no VPS)
- [ ] H2 verificado en dispositivo por el humano: con «Quitar animaciones» activo, la vista se ve como fija D2
- [ ] H3 verificado por el humano: comparación lado a lado con el artboard «Vincular collar (19)», incluida la amplitud del flotado (diferencia declarada)
