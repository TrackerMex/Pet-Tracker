# explore: ui-mascota-orbit (renombrar Pingo a Orbit + nueva pose «haciendo actividad»)
Fecha: 2026-10-26
Worktree: /home/claude/sites/Pet-Tracker-wt-ui (rama docs/ui-ola0-mejoras, base origin/main 1316410f). Solo lectura de codigo. No se ejecuto ninguna generacion de imagen.

Nota de entorno: en este worktree no existe `graphify-out/graph.json` (`graphify query` falla con "graph file not found"), asi que el inventario sale de grep/Read directo.

---

## PARTE 8. Renombrar la mascota de Pingo a Orbit

### 8.1 Definicion vigente de la mascota
- `docs/ui-guidelines.md:384-389` (punto 7 «Voz de Pingo: guardian sereno»): decidido por el humano el 2026-10-07 (D1 de #153). «la mascota se llama **Pingo** y habla con la voz B, guardian sereno». Rige todo texto en boca de la mascota (bocadillos, vacios, celebraciones, avisos).
- Reglas de voz (`:391-398`): tono tranquilo y calido, tutea, primera persona, `{{petName}}`, sin emoji, exclamaciones solo para celebrar, sin bromas en alertas, ingles neutro.
- Bucles de reposo (`:399-408`) y secciones de enmienda que nombran a Pingo.
- La memoria `mascota-pingo-voz-b` dice «pendiente en ui-guidelines.md»: ya NO esta pendiente. El punto 7 existe (desde #153). Lo unico que cambia con Orbit es el nombre; la voz B no se toca.
- Aspecto real (visto en `/home/claude/pet-tracker-mascot/mascot-02-talk.png`): perro/robot estilo 3D, cara morada con marco crema, gorro verde con placa blanca y antena con bola roja, orejas grises oscuras, boton verde en el pecho. El nombre Orbit encaja con el robot-perro; no obliga a redisenar.

### 8.2 Hallazgo clave: texto visible al usuario = 2 cadenas
Unica aparicion con «Pingo» como NOMBRE en la UI (grep sin `__tests__` en `mobile-pet-tracker/src`):
- `mobile-pet-tracker/src/i18n/catalog.ts:456` `'welcome.pingoGreeting': 'Hi, I\'m Pingo.'`
- `mobile-pet-tracker/src/i18n/catalog.ts:916` `'welcome.pingoGreeting': 'Hola, soy Pingo.'`
Nada mas en `app/`, `app.json` ni `package.json`. El resto de «pingo» en codigo vivo son identificadores (claves, testIDs, componentes, nombres de fichero), invisibles al usuario.

### 8.3 Inventario de identificadores vivos (codigo movil)
Claves de catalogo (`catalog.ts`, 14 apariciones; en/es): `login.pingoGreeting` (:26, :486), `home.pingoPhraseWalkMeals|Walk|Meals|Calm` (:58-61, :518-521), `addPet.pingoGreeting` (:362, :822), `welcome.pingoGreeting` (:456, :916).
Ficheros fuente con «pingo» en el nombre:
- `src/components/pingo-float.tsx` (componente `PingoFloat`, usado en welcome, register, pairing, home, empty-state hero, celebration indirecto)
- `src/theme/pingo-stage.ts` (`PINGO_STAGE_SHADOW_COLOR`, `PINGO_STAGE_PAW_OPACITY`)
- `src/screens/home/pingo-phrase.ts` (`homePingoPhrase`)
- Constantes `MOTION_PINGO_FLOAT_OFFSET_Y` / `MOTION_PINGO_FLOAT_TIMING` en `src/theme/motion.ts:77-78`
Consumidores (hits de grep en codigo no-test): `components/celebration.tsx` (15, p. ej. :33-41, :125-128), `components/empty-state.tsx` (:12, :18-23, :84, :110, :127), `screens/welcome/index.tsx` (16), `screens/home/index.tsx` (14, :61, :93, :312-319, :487-507), `screens/login`, `register`, `forgot`, `reset-password`, `pairing` (:30, :47, :315-317), `add-pet` (:290).
testIDs que contienen `pingo`: `home-pingo*`, `welcome-pingo*`, `login-pingo`, `register-pingo*`, `forgot-pingo`, `reset-pingo`, `pairing-pingo*`, `<id>-pingo` de celebration.
Assets (9 ficheros, todos en `mobile-pet-tracker/assets/images/`): `pingo-celebrate`, `pingo-clipboard`, `pingo-collar`, `pingo-food`, `pingo-health`, `pingo-sleep`, `pingo-talk`, `pingo-wave`, `pingo-wave-blink` (`.webp`).

### 8.4 Candados (tests que fijan el nombre o el copy)
Copy visible:
- `src/screens/welcome/index.test.tsx:463-464, 476, 481, 518-527` fijan literalmente `'Hi, I\'m Pingo.'` y `'Hola, soy Pingo.'`. Es el unico test de copy que cambia con un renombre solo-visible.
- `src/__tests__/ui-copy-table.ts:16, 70-73, 412, 646` indexa por `{ file, key }` las claves `*pingo*`; si se renombran claves, hay que tocar esta tabla (y `src/__tests__/ui-language.test.ts:508` que suma `screens/home/pingo-phrase.ts` a un recuento: «+1 // #190 R13»).
- `src/providers/__tests__/language-provider.test.tsx:159, 611-666` fijan claves `addPet.pingoGreeting`, `login.pingoGreeting` y un encabezado.
Documentacion viva que los tests LEEN con texto literal (editar el doc sin editar el test lo pone rojo):
- `docs/ui-guidelines.md`: `src/__tests__/home-pingo-phrase.test.ts:46-63` pinea el encabezado `## Enmienda #190 — Burbuja de Pingo en Inicio` y dos parrafos enteros; `src/components/__tests__/celebration.test.tsx:735-736` pinea la enmienda #171 y su punto 7 (contienen «Pingo»); `src/__tests__/add-pet-two-steps.test.ts:9` pinea la regla de radios con «burbuja de Pingo» (docs `:204`).
- `specs/mobile-ui-language/design.md` (vivo, 7 hits: :893, :899, :928, :940...): `empty-state.test.tsx:49, 274, 304` y `language-provider.test.tsx:666` pinean encabezados `### §2.21/§2.23/§2.24 — ... Pingo ...`.
- `docs/verification.md:310`: `empty-state.test.tsx:323-325` pinea «el tab Map muestra a Pingo con `No live location`...».
Assets y rutas:
- `empty-state.test.tsx:60-61, 87-92`, `celebration.test.tsx:15-27, 122` y ~15 tests de pantalla hacen `stringMatching(/pingo-(talk|sleep|...)\.webp$/)` o `require('.../pingo-celebrate.webp')`. Renombrar ficheros `pingo-*.webp` rompe todos ellos y `__tests__/design-drift.test.ts:971` (lista `'components/pingo-float.tsx'`).
- Cada pose tiene candado de formato (ver 11.3): WebP VP8X con alfa, sin animacion, 1024x1024, <= 100 000 bytes.
- `src/screens/home/index.test.tsx:5680-5690`: «#190 R4: Pingo usa su pose decorativa de 56 px», `pingo-talk.webp` como unico hijo de `home-pingo-float`, sin accessibilityLabel. Tambien `:5287` (vacio de Inicio) y `:5790-5814` (PingoFloat).

### 8.5 Que es historico (NO reescribir) frente a lo vivo
Historico, no tocar (registro de lo que se decidio y firmo con ese nombre; reescribirlo falsea la trazabilidad y rompe hashes de traceability):
- `specs/*/` con «pingo» (6 directorios llevan el nombre: `mobile-welcome-pingo`, `mobile-empty-states-pingo`, `mobile-no-collar-states-pingo`, `mobile-account-screens-pingo`, `mobile-pairing-pingo-canvas-fidelity`, `mobile-home-pingo-phrase`; ademas ~50 requirements/design/tasks/traceability y los `.diff` de `specs/mobile-account-screens-pingo/e1/`). Specs firmadas y cerradas.
- `progress/` (~120 ficheros: impl_, handoff_, review_, explore_, mutacion_, `ronda4_*/c*.patch`, `sondas_e1.py`, history.md). Informes y parches historicos.
- `STATUS.md` entradas de cierre (:146-261, :1610-1682) y las lineas de `feature_list.json` de features ya hechas (`name` `mobile-*-pingo`, descripciones; ~32 hits). Los `name` de feature son ids estables.
Vivo, si se renombra:
- `docs/ui-guidelines.md` (37 hits). Texto normativo vigente (:384-408 punto 7, :610-616, :716-725, :806-836, :956-960). Las enmiendas fechadas (`## Enmienda #NNN`) son historia con firma; lo razonable es renombrar solo el punto 7 y dejar una nota «(antes Pingo)» en vez de reescribir cada enmienda. Pero ver 8.4: varias enmiendas estan pineadas por tests.
- `specs/mobile-ui-language/design.md` (vivo, tablas de copy; los tests lo leen).
- `docs/verification.md:310` (plan de humo; pineado).
- `STATUS.md:6-10` (resumen superior) si menciona la mascota por nombre.
- Memoria externa al repo: `mascota-pingo-voz-b` (actualizar a «Orbit»).
- `AGENTS.md`, `CLAUDE.md`, `.claude/agents/*`: 0 apariciones de «pingo». No requieren cambio.
- Falsos positivos al buscar «orbit»: solo `explore_ui-delight-appllama.md:198` («chips orbitando») y lockfiles/skills. No hay colision con otro uso de «Orbit» en el repo.

### 8.6 Opciones (cerradas)
- **A. Solo nombre visible + doc normativo minimo.** Cambiar las 2 cadenas de `catalog.ts` (:456, :916), los 4 `expect` de `welcome/index.test.tsx` que las fijan, el punto 7 de `ui-guidelines.md` («Voz de Orbit: guardian sereno», con «antes Pingo») y la memoria. Conservar identificadores, testIDs, claves, nombres de fichero y assets como «pingo-*» (deuda de nombre interna). Cuesta ~1 commit y no toca candados de rutas. Riesgo: el codigo dice Pingo y la UI dice Orbit; el siguiente agente que lea `PingoFloat` se confunde.
- **B. A + renombrar identificadores y ficheros** (`PingoFloat`->`OrbitFloat`, `pingo-stage.ts`, `pingo-phrase.ts`, claves `*.pingo*`, testIDs, 9 assets). Toca ~47 ficheros de `mobile-pet-tracker/` (~30 son tests), `ui-copy-table.ts`, `design-drift.test.ts:971`, regex de assets en ~15 tests, y los pineados de docs. Es una feature mecanica grande con reviewer; riesgo alto de rojos por candados de conteo (ui-copy-table, ALL_USES, SCREEN_FILES; ver memorias `candados-agregados-65-r18`, `rebase-invalida-hashes-traceability`).
- **C. A ahora, B como feature aparte.** Recomendada: A en esta ola (vale lo que el humano pidio: que la app diga Orbit), B registrada como deuda con id propio. El renombre de assets conviene hacerlo con la imagen nueva (11) para no tocar dos veces los tests de pose.
Sub-decision de A: el copy del saludo. ¿Se mantiene la frase («Hola, soy Orbit.»)? Es el unico copy con nombre; en `specs/mobile-ui-language/design.md:897` la tabla guarda una frase mas larga que ya no coincide con el catalogo (pre-existente, no es del renombre).

---

## PARTE 11. Nueva imagen de Orbit «haciendo actividad»

### 11.1 El mensaje exacto (confirmado con la captura del humano)
Pantalla: **Inicio** (`mobile-pet-tracker/src/screens/home/index.tsx`). Componente: la burbuja de la mascota (spec #190, `specs/mobile-home-pingo-phrase/`).
- Condicion (`home/index.tsx:312-319`): `hasPets && selectedPetId !== null && detail.data?.kind === 'ok' && activity.data !== undefined`. Si no, no se pinta (`:487` `pingoPhrase !== null`).
- Render (`:487-507`): `HomeEntrance index=0` > `View home-pingo-phrase` (`flex-row items-end gap-2.5`) > `BubblePop home-pingo-bubble` (`rounded-tile rounded-br-4 border border-border bg-surface-secondary px-3.5 py-3`) con `Text home-pingo-text` (`text-15 font-semibold`) + `PingoFloat home-pingo-float` > `Image home-pingo` (expo-image) con `source={require('../../../assets/images/pingo-talk.webp')}` y `style={{ width: 56, height: 56 }}` (`:499-505`). Sin `contentFit` explicito en este caso (hereda el default de expo-image, `cover`; la imagen es cuadrada).
- Copy (`screens/home/pingo-phrase.ts:5-26` y `catalog.ts:58-61, 518-521`): elige por datos del dia:
  - distancia >= 100 m y plan de comidas: `home.pingoPhraseWalkMeals` «{{petName}} ya camino {{km}} hoy y lleva {{served}} de {{total}} comidas.» (la de la captura: «Jev ya camino 24.1 km hoy y lleva 3 de 6 comidas.»)
  - solo distancia: `home.pingoPhraseWalk`
  - solo comidas: `home.pingoPhraseMeals`
  - ni una ni otra: `home.pingoPhraseCalm` «Estoy pendiente de {{petName}}.» (aqui «hacer actividad» no encaja)
- Pose hoy: `pingo-talk.webp` (la del gesto de saludo con una mano). Es un PLACEHOLDER declarado: `specs/mobile-home-pingo-phrase/requirements.md` H3 «Placeholder ... no hay pose dedicada a hablar con burbuja».
- Tamano: el codigo dice 56x56 dp. Los «~110 px» de la captura son px de pantalla (56 dp x ~2 de densidad), no 110 dp. La imagen nueva debe ocupar el mismo marco de 56 dp; no hay que cambiar el layout. Bajo reduce motion no flota; con motion flota 10 px (`pingo-float.tsx`, `motion.ts:77-78`).
- El resto de pantallas que el humano nombra: no hay mascota en Rutina ni en la tarjeta de actividad semanal (`screens/home/weekly-activity-chart.tsx` no tiene `Image`). «Actividad» es la frase de Inicio. Rutina/Recordatorios usan `EmptyState` (`reminders/index.tsx:166` pose talk, `:243` clipboard).

### 11.2 Donde se muestra la mascota hoy (catalogo de poses)
| Pose (asset) | Donde se usa | Tamano en pantalla |
|---|---|---|
| `pingo-talk` | burbuja de Inicio (`home/index.tsx:502`, 56), `EmptyState pose="talk"` (home :343/:475, food :205, profile :379, health :310, map :333/:347/:364/:390, reminders :166), forgot (`forgot/index.tsx:106`) | 56 / 160 / 190 hero |
| `pingo-wave` + `pingo-wave-blink` | welcome (`welcome/index.tsx:85-92`, 220), login (`login/index.tsx:98`) | 220 |
| `pingo-celebrate` | `Celebration` (`celebration.tsx:125-128`) | 170 |
| `pingo-clipboard` | register (`:143`), reset-password (`:134`, `:192`), `EmptyState pose="clipboard"` (reminders :243) | 72 a 160 |
| `pingo-collar` | pairing (`pairing/index.tsx:47`, `:316`, 120), geofences (:116) | 120 / 160 |
| `pingo-health` | docs vacio (`docs/index.tsx:192`) | 160 |
| `pingo-food` | comida sin plan (`food/index.tsx:448`) | 160 |
| `pingo-sleep` | alertas vacias (`alerts/index.tsx:150`) | 160 |
`EmptyStatePose = 'talk'|'sleep'|'clipboard'|'health'|'collar'|'food'` (`empty-state.tsx:15`), mapa `POSES` (`:17-24`). No hay pose de caminar/correr/actividad: `05-search` y `10-worried-v2` existen como PNG maestros en `/home/claude/pet-tracker-mascot/` pero nunca entraron al repo (D2 de #153 solo metio las usadas).

### 11.3 Formato, tamano y carga
- Todos los assets de la mascota: **un solo fichero por pose**, WebP VP8X, 1024x1024, con alfa, sin animacion, 47-60 KB cada uno. No hay `@2x/@3x` (expo-image reduce el 1024 al marco; el 1024 cubre hasta ~3x de un marco de 340 dp). No hay variantes dark: el mismo WebP con alfa vale en claro y oscuro; el contraste lo pone la superficie (`bg-surface-secondary` de la burbuja, disco `bg-surface-secondary` del vacio hero). El PNG original de la pose pesa ~700 KB (`/home/claude/pet-tracker-mascot/mascot-NN-*.png`, 1024x1024 RGBA); la conversion a WebP vive en `/home/claude/pet-tracker-mascot/webp/`.
- Carga: `require('../../assets/images/<pose>.webp')` estatico dentro del JSX o de un mapa (`empty-state.tsx:17-24`), pintado con `Image` de `expo-image`. No hay carga remota.
- Candado de formato por pose (`empty-state.test.tsx:56-72`, `celebration.test.tsx:15-27`): `RIFF/WEBP/VP8X`, bit de alfa puesto (`bytes[20] & 0x10`), sin animacion (`& 0x02 == 0`), 1024x1024, `<= 100000` bytes. Una pose nueva necesita su propio `it` equivalente (no hay `it.each` global sobre `assets/images/pingo-*`).
- Herramientas locales de conversion: en este entorno NO hay `cwebp`, `dwebp`, ImageMagick (`convert`) ni Pillow. Si estan `node` y `bun` (candidato: `bunx sharp-cli` o `sharp` via bunx, a verificar; instalar dependencias nuevas requiere autorizacion de la spec). Alternativa: el humano convierte en su PC (como en #155, donde el humano genero los PNG).

### 11.4 Herramientas disponibles para generar la imagen (sin ejecutarlas)
- `mcp__claude_ai_Figma__generate_image` (de pago, consume creditos de Figma AI del plan del archivo destino): modelos `gemini-3.1-flash-lite-image` (default), `gemini-3.1-flash-image`, `gpt-image-2.5-sunburst`; `width/height` hasta 2048 (elige la relacion de aspecto mas cercana, el tamano real puede diferir); exige `fileKey` de un archivo Design/FigJam/Slides editable (se crearia uno con `create_new_file` + `create_session`); devuelve `image.url` descargable. Limites: no garantiza fondo transparente ni consistencia de personaje entre llamadas (el prompt solo describe texto; no recibe la imagen de referencia).
- `mcp__claude_ai_Figma__upload_assets` + `download_assets`: subir los PNG maestros a un archivo Figma para componer la hoja comparativa; bajar el render. No generan imagen.
- Weave (`weave_find_model`, `weave_list_tools`, `weave_run_model`, `weave_run_tool`, `weave_upload_asset`): consultado en lectura (`weave_find_model` y `weave_list_tools`) y **responde «You haven't linked your Figma account to Weave yet»**: https://app.weavy.ai/settings?section=profile. Hasta que el humano enlace la cuenta no hay modelos Weave. `weave_run_model` ademas exige aprobacion explicita de coste cada vez.
- Otros MCP: ninguno de generacion de imagen (Excalidraw/Postman/Spotify/etc. no aplican). Skills de diseno (`appllama-*`) investigan referencias, no generan arte.
- Camino real mas probable: el humano genera las variantes con su herramienta habitual, como en #153/D2 (12 PNG en `/home/claude/pet-tracker-mascot/`), usando `mascot-02-talk.png` / `mascot-00-base.png` como referencia de personaje; el leader solo valida formato. Con Figma, el flujo viable es referencia + prompt en `gpt-image-2.5-sunburst` o `gemini-3.1-flash-image`, aceptando que habra que quitar el fondo fuera de Figma.

### 11.5 Como versionarla
- Ruta: `mobile-pet-tracker/assets/images/<nombre>.webp`. Nombre propuesto: `orbit-walk.webp` si se hace el renombre B; si se aplica solo A, `pingo-walk.webp` seria incoherente con el nombre nuevo (decision abierta 3).
- Especificacion: WebP VP8X, alfa, 1024x1024, sin animacion, `<= 100000 B`, sin `@2x/@3x`, mismo fichero para claro y oscuro, encuadre/escala igual a las otras poses (personaje centrado, antena dentro del lienzo; el marco de 56 dp recorta nada porque es cuadrado y `contentFit` cubre).
- Uso: en `home/index.tsx:502` cambiar `require` por la pose nueva cuando la frase sea de actividad (`PingoPhrase.labelKey` en `WalkMeals|Walk`), manteniendo `talk`/la actual para `Meals|Calm` (ver decision 5). Hoy un test fija `pingo-talk` en la burbuja (`home/index.test.tsx:5680-5690`) y hay que enmendarlo con la spec nueva.
- Maestro PNG: los maestros viven fuera del repo (`/home/claude/pet-tracker-mascot/`); no versionados. Opcion: guardar el PNG maestro en `specs/<feature>/design-src/` (~700 KB) para poder regenerar.
- Documentar la pose en `docs/ui-guidelines.md` (punto 7 o enmienda nueva) y, si cambia el copy, en `ui-copy-table.ts`.

### 11.6 Presentar 2-3 variantes al humano (gate de arte)
La imagen es decision de arte: aprueba el humano; el leader no elige.
- Hoja comparativa unica (un solo mensaje): 3 variantes A/B/C del gesto, cada una mostrada (1) a tamano completo sobre fondo cuadriculado para ver el alfa, y (2) dentro de una maqueta de la burbuja de Inicio a 56 dp (ya x2 = 112 px, como la captura) en claro y oscuro, con la frase real «Jev ya camino 24.1 km hoy y lleva 3 de 6 comidas.». Formatos viables: pagina Artifact privada, o un frame de Figma si se genera ahi.
- Variantes propuestas (gestos distintos del saludo actual): A caminando (de lado/3-4, una pata adelante, mochila o correa opcional), B corriendo (cuerpo inclinado, orejas al viento), C trotando con una pelota o pisada (huella). Todas: mismas proporciones, antena roja, gorro verde y cara morada que `mascot-02-talk`.
- Gate: una casilla propia en la spec/handoff («Variante elegida: A|B|C») que firma el humano con su commit o desde Notion (patron de CLAUDE.md §Gate de specs; memoria `gate-humano-sin-casilla-donde-firmar`). Sin casilla firmada no se mete el WebP.
- Criterios medibles para pre-filtrar antes del gate: alfa real (esquinas y borde alfa 0), 1024x1024, `<= 100000 B`, antena completa dentro del lienzo, sin marca de agua, legible a 56 dp.

---

## Riesgos
1. **Candados de doc pineado.** Editar `docs/ui-guidelines.md`, `specs/mobile-ui-language/design.md` o `docs/verification.md` sin coordinar el test que pinea el texto deja rojo (ver 8.4). El renombre doc+test va en el mismo commit; con TDD el test rojo primero.
2. **Renombrar assets rompe ~15 tests de ruta** y la lista de `design-drift.test.ts:971`; mezclar renombre de assets con pose nueva mezcla dos riesgos.
3. **Alfa de la imagen generada.** Los generadores devuelven fondo opaco; la pose necesita alfa limpio o falla el candado y se ve un cuadrado en la burbuja `bg-surface-secondary`.
4. **Consistencia de personaje.** Una pose generada sin referencia cambia proporciones/colores respecto de las otras 9; para el humano se nota al lado de `talk`.
5. **Formato del dato.** `fmtKm` (`src/screens/home/format.ts:53`, tambien `alert-location.ts:26`, `map/index.tsx:81`) hace `toFixed(1)` sin locale: «24.1 km» con punto tambien en espanol, mientras la tarjeta semanal sustituye `.` por `,` en es (`weekly-activity-chart.tsx:227-232`). Es inconsistencia previa a esta tarea; esta pineada por `home/index.test.tsx:5751` («Luna ya camino 2.4 km hoy»). Cambiarla es feature aparte con enmienda de ese test, no parte de Orbit.
6. **Weave sin enlazar y Figma de pago.** `generate_image` gasta creditos de Figma AI; decision de costo del humano (memoria `decisiones-de-costo-no-inferir`).
7. **Memoria y docs de proceso.** La memoria `mascota-pingo-voz-b` dice «pendiente»; ya esta en `ui-guidelines.md:384`. Actualizar al renombrar.
8. **Guion leader/Codex.** Si se implementa con Codex, la spec debe citar literal: rutas, claves, los 4 expects de `welcome/index.test.tsx` y el nombre del fichero de la pose; lo que no quede por escrito Codex lo inventa (memoria `literales-copy-desde-r1`).

## Decisiones abiertas (opciones cerradas)
1. **Alcance del renombre:** A (solo texto visible + punto 7 de la guia) | B (todo, identificadores y ficheros) | C (A ahora, B como feature aparte). Recomendacion: C.
2. **Copy de bienvenida con Orbit:** mantener «Hola, soy Orbit.» / «Hi, I'm Orbit.» sin mas | ampliar con la frase larga del doc de lenguaje. Recomendacion: mantener la corta (lo que ya esta en el catalogo).
3. **Nombre del fichero nuevo:** `pingo-walk.webp` (coherente con los otros 9 hoy) | `orbit-walk.webp` (coherente con el nombre nuevo, rompe simetria hasta B). Recomendacion: `orbit-walk.webp` si se acepta C, y B renombra el resto despues.
4. **Gesto:** caminando | corriendo | otra (el humano lo dice). Presentar A/B/C de 11.6.
5. **Cuando sale la pose nueva en la burbuja:** siempre que haya frase de actividad (`WalkMeals|Walk`) | tambien con `Meals` | siempre (sustituye a `talk` en la burbuja). Las frases `Calm` (sin datos) no hacen «actividad». Cada opcion es una condicion distinta del test `home/index.test.tsx:5680-5690`. Recomendacion: `WalkMeals|Walk`, resto igual.
6. **Quien genera:** el humano con su herramienta habitual | el leader con `generate_image` de Figma (pago, requiere archivo y cuenta) | esperar a que el humano enlace Weave. Recomendacion: el humano, usando `mascot-02-talk.png` como referencia.
7. **PNG maestro:** guardar en `specs/<feature>/design-src/` | seguir fuera del repo. Recomendacion: guardarlo si pesa menos de ~1 MB.
8. **Feature separada o una sola:** (8) y (11) comparten test y spec en Inicio y el WebP; una sola feature con dos gates (nombre y arte) | dos features con ids distintos (ids contra origin/main, no reusar #208-#216 del plan de mejoras; el maximo actual en `feature_list.json` es #216). Recomendacion: dos features, el renombre primero.
