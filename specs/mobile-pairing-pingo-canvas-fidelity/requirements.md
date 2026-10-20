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
- Input de código (alto, borde, tipografía monoespaciada, mayúsculas) y FieldError global: #186. Ver D7.
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

### E2 — Geometría del artboard: R15–R19 y decisiones ED1–ED4

- **Qué cambia**: añade R15 a R19 y las decisiones ED1 a ED4. R16 sustituye la cláusula de tamaño de R7 cuando ED1 es (a) o (b). R17 es la única excepción a «primer elemento visual» de R1. El resto de R1–R14 no cambia.
- **Por qué**: en el dispositivo, la vista de vinculación no coincide con el artboard «Vincular collar (19)» (`project/Vincular.dc.html`, versión 1792513497-a876). Las diferencias son: título sin centrar, Pingo a 150 px (el artboard usa 120 px), selector de mascota entre título y banner (el artboard no lo tiene ahí), botón «Vincular collar» sin anclar al fondo y banner de plan gratuito con otro aspecto. D4 y R7 dan 24 px para el título y atribuyen esa cifra al artboard; el artboard declara `font-size: 28px` en el `h1`. La premisa era incorrecta, y ED1 la decide.
- **Requisitos nuevos**: R15 a R19 se numeran a continuación de R14 y siguen la misma notación. Los literales de copy salen del catálogo, sin texto nuevo.

- **R15**: WHILE la vista de vinculación está activa THE SYSTEM SHALL agrupar el hero y `pairing-title` en un bloque vertical con 10 px de separación. El hero es una caja de 200 × 150 px que centra los anillos de R2 y `pairing-pingo`; `pairing-pingo` mide 120 px de ancho y alto proporcional a la imagen; el bloque se centra en horizontal.
  - Test: el contenedor del hero mide 200 × 150 px; `pairing-pingo` mide 120 px de ancho y no tiene alto fijo; el hero y `pairing-title` son hermanos dentro de un contenedor con `gap` de 10 px.

- **R16**: WHILE la vista de vinculación está activa THE SYSTEM SHALL mostrar `pairing-title` centrado en horizontal, con peso 900, espaciado `tracking-title` (−0.02 em) y el tamaño que fije ED1 (recomendado: 28 px, con el token nuevo `--text-28: 28px` en `src/theme/global.css`). Esta cláusula sustituye la de tamaño de R7 cuando ED1 es (a) o (b).
  - Test: el className de `pairing-title` contiene `text-center`, `font-black`, `tracking-title` y la clase de tamaño de ED1; no contiene `text-2xl` ni `[`.

- **R17**: WHERE ED2 es (a) WHILE la vista de vinculación está activa Y hay mascotas THE SYSTEM SHALL mostrar el selector `PetSwitcher` con `variant="avatars"` en una fila superior alineada a la derecha, encima de `pairing-pingo`, en lugar de entre `pairing-title` y `pairing-plan-free`. Esta fila es la única excepción a «primer elemento visual» de R1. En los demás estados el selector no cambia de sitio.
  - Test: con al menos una mascota, los `pet-chip-<id>` aparecen antes que `pairing-pingo` en el árbol; ninguno aparece entre `pairing-title` y `pairing-plan-free`.

- **R18**: WHILE la vista de vinculación está activa THE SYSTEM SHALL mostrar `pairing-plan-free` como banner a ancho completo: fondo `bg-default`, radio `rounded-tile` (18 px), relleno de 12 px arriba y abajo y de 14 px a los lados, icono informativo de 20 px en color `muted` a la izquierda y 10 px de separación hasta el texto. El texto es de 13 px (`text-13`) en color `muted`, a 16 px de `pairing-title` y de la etiqueta del código. El literal es el de `pairing.freePlanPairPrompt`, sin negrita, salvo que ED4 sea (b).
  - Test: `pairing-plan-free` tiene `text-13` y `text-muted`; su contenedor tiene `bg-default` y `rounded-tile`; el icono mide 20 px.

- **R19**: WHILE la vista de vinculación está activa THE SYSTEM SHALL anclar `pairing-submit` al borde inferior del contenido: el `contentContainerStyle` de `pairing-form` tiene `flexGrow: 1` y un espaciador con `flexGrow: 1` precede a `pairing-submit`. La receta visual de `pairing-submit` de #177 no cambia.
  - Test: el `contentContainerStyle` de `pairing-form` tiene `flexGrow` 1 en la vista de vinculación; el elemento inmediatamente anterior a `pairing-submit` es un espaciador con `flexGrow` 1; `pairing-submit` es el último elemento del formulario.

- **Decisiones**: ED1 a ED4 las cierra el humano en Notion antes de firmar E2. Recomendado: (a) en todas.
- **ED1 Tamaño del título**. (a) 28 px con el token nuevo `--text-28: 28px` en `global.css`; recomendado, es el valor del artboard. (b) 26 px con `text-26`, que ya existe; 2 px menos que el artboard. (c) 24 px según D4; diferencia declarada. Afecta a: R16, R7.
- **ED2 Selector de mascota**. (a) Fila superior con `variant="avatars"`, solo en la vista de vinculación; recomendado. Hipótesis por confirmar: el «R» de la cabecera del artboard es el mismo control. (b) Se queda entre título y banner; diferencia declarada. Afecta a: R17, R18.
- **ED3 Etiqueta, input y pista**. (a) Se quedan con la receta de #186, como dice D7; recomendado. Diferencias declaradas frente al artboard: etiqueta de 14 px en peso 800 sin mayúsculas; input de 60 px con borde de 2 px en `accent` y 24 px monoespaciado en peso 900; pista de 12 px en peso 600 con icono de 14 px. (b) Pasan a #188 como R20 y D7 se reabre. Afecta a: R8, Fuera de alcance.
- **ED4 Negrita del banner**. (a) Texto único del catálogo, sin negrita; recomendado. (b) `pairing.freePlanPairPrompt` se parte en dos claves con el mismo texto, para poner en negrita «Plan gratuito — solo salud.». Afecta a: R8, R11, R18.

- **Diferencias declaradas que E2 no corrige**: cabecera nativa con atrás en lugar de la fila de cabecera del artboard (la ruta sigue con `title: ''`); margen inferior de `insets.bottom + 24` en lugar de 40 px; entrada animada `rise` de 400 ms del artboard, que esta spec no fija.
- **Antes de implementar**: E2 necesita su propia aprobación (ver §Aprobación). `design.md`, `tasks.md` y `traceability.md` no cubren R15–R19; se actualizan tras aprobar E2 y antes del handoff a Codex.

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
- [ ] E2 aprobada por humano (Notion, «Estado del gate» = Aprobado), con ED1–ED4 cerradas por humano. Gate obligatorio antes de implementar E2.
- [ ] H1 verificado en dispositivo por el humano: anillos de 2400 ms con el segundo a 1200 ms de retardo y flotado de 3000 ms por ciclo, en build de desarrollo Android (no Expo Go, no VPS)
- [ ] H2 verificado en dispositivo por el humano: con «Quitar animaciones» activo, la vista se ve como fija D2
- [ ] H3 verificado por el humano: comparación lado a lado con el artboard «Vincular collar (19)», incluida la amplitud del flotado (diferencia declarada)
