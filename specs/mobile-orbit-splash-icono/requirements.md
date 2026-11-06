---
feature: "mobile-orbit-splash-icono"
status: approved      # draft | approved
tags: [mobile, ui, mascota, orbit, assets, icono, splash, spec]
---

# Requisitos — [[mobile-orbit-splash-icono]] (#244)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Decisiones técnicas en [[design]]; orden de commits en [[tasks]].
>
> **Origen.** Entrada 244 de `feature_list.json`, registrada el 2026-11-06 a pedido
> del humano como continuación de #243: las diez poses de Orbit ya son el cachorro,
> pero el icono, el splash y las notificaciones siguen con la cabeza del robot
> (#243 D4 lo dejó fuera a propósito). El humano aprobó G6 (el arte de marca de
> Orbit) el 2026-11-06 y entregó tres PNG, congelados en
> `specs/mobile-orbit-splash-icono/design-src/`.
>
> **Esta spec no escribe código de la aplicación.** La implementación convierte las
> tres fuentes con un script de desarrollo (design.md §2) a ocho PNG, borra cinco
> ficheros que solo servían al arte viejo, reescribe `assets/expo.icon/icon.json` y
> añade tests. Ningún fichero de `mobile-pet-tracker/src/` fuera de tests cambia (R9)
> y `app.json` no cambia.
>
> **Carta de UI.** Rige `docs/ui-guidelines.md`, pero esta feature no toca pantallas,
> componentes ni tokens, así que no hay grep-clean de clases que correr y la guarda de
> R9 lo demuestra (`src/` solo gana un test). La carta no tiene ninguna regla sobre el
> icono, el splash ni las notificaciones (`grep -nE "splash|favicon|adaptive|notificaci"`
> solo da la Enmienda #243 y texto ajeno; verificado el 2026-11-06). Lo único que la
> carta gana es la Enmienda #244 (R10, gate G4).

## Glosario

- **Los ocho PNG de marca**: siete en `mobile-pet-tracker/assets/images/`
  (`icon.png`, `android-icon-foreground.png`, `android-icon-monochrome.png`,
  `splash-icon.png`, `favicon.png`, `pet-tracker-notification-96.png`,
  `pet-tracker-notification-color-96.png`) y `mobile-pet-tracker/assets/expo.icon/Assets/orbit.png`
  (fichero nuevo, mismos bytes que `android-icon-foreground.png`).
- **Arte del robot**: los once ficheros de `dev` en el commit H0 del handoff que
  dibujan la cabeza del robot (hashes en §Constantes, columna «viejo»): los siete PNG
  de marca viejos, `pet-tracker-app-icon.png`,
  `pet-tracker-notification-monochrome-original.png`, `expo-symbol 2.svg` y `grid.png`.
- **Zona segura**: círculo de radio 338 px centrado en el lienzo de 1024 × 1024
  (66 % del lienzo dividido entre dos). Un píxel `(x, y)` con alfa > 0 está dentro si
  `(2x + 1 − 1024)² + (2y + 1 − 1024)² ≤ 676²` (aritmética entera, sin flotantes).
  Es la zona que el launcher de Android no recorta con ninguna forma de máscara, y el
  círculo de dos tercios con que Android 12 enmascara el icono del splash.
- **Limpieza de alfa**: regla del script, `alfa < 16` pasa a 0 y `alfa >= 252` pasa a
  255 (la misma que #243).
- **Recorte oscuro del monocromo**: en `android-icon-monochrome.png` los píxeles del
  primer plano con luminancia < 60 (`DARK_CUTOFF`) quedan transparentes: ojos, nariz y
  boca salen como hueco, y el resto es blanco con el alfa del primer plano.

## Usos de los PNG de marca

La tabla describe lo que **no cambia** (R9): quién referencia cada fichero y qué
geometría ya lo fija un test. `app.json` conserva todas las rutas.

| Fichero | Quién lo usa | Geometría ya fijada por |
|---|---|---|
| `icon.png` | `app.json` `expo.icon` | `app.assets.test.ts` `#101 R2` (1024², RGBA 8 bits); `app.config.test.ts` `#101 R2` (la ruta) |
| `android-icon-foreground.png` | `android.adaptiveIcon.foregroundImage` | `app.assets.test.ts` `#101 R3`; `app.config.test.ts` `#101 R3`; fondo plano `#9460FC` (`#101 R5`) |
| `android-icon-monochrome.png` | `android.adaptiveIcon.monochromeImage` | `app.assets.test.ts` `#101 R4`; `app.config.test.ts` `#101 R4` |
| `splash-icon.png` | plugin `expo-splash-screen` (`imageWidth` 200 sobre `#9460FC`); además `src/app/index.tsx` (`testID="splash-logo"`, 120 × 120, `contentFit="contain"`) | `app.assets.test.ts` `#101 R6` y `#115 R10` (caja [174, 850), esquinas, cara opaca); `app.config.test.ts` `#101 R6`; `src/app/__tests__/index.test.tsx` (solo el `testID`) |
| `favicon.png` | `web.favicon` | `app.assets.test.ts` `#101 R8` (48², RGBA); `app.config.test.ts` `#101 R8` |
| `pet-tracker-notification-96.png` | plugin `expo-notifications` (`icon`, `color` `#9460FC`) | `app.assets.test.ts` `#101 R7` (96², RGBA); `app.config.test.ts` `#101 R7` |
| `pet-tracker-notification-color-96.png` | ninguno en `app.json` ni en `src/` (variante en color de la anterior) | ninguno |
| `assets/expo.icon/` | `ios.icon` | `app.config.test.ts` `#101 R9` (solo la ruta) |
| `logo-glow.png` | ninguno hoy (un destello azul sin mascota) | ninguno |

## Requisitos funcionales

### Sustitución del arte de marca

- **R1**: WHEN se calcula el sha256 de cada uno de los ocho PNG de marca THE SYSTEM
  SHALL coincidir con el valor «nuevo» de §Constantes, y `logo-glow.png` SHALL
  conservar su sha256 de §Constantes.
  - Prueba: `src/__tests__/orbit-brand-assets.test.ts::#244 R1: cada PNG de marca tiene el sha256 del arte de Orbit`
    (`it.each`, ocho filas) y `::#244 R1: logo-glow.png no cambia`.
  - Es el candado rojo de la feature: sobre el arte viejo fallan las ocho filas
    (la de `orbit.png` por ausencia, con `existsSync` afirmado antes de leer). Es también
    el **único** candado sobre el contenido interno de los PNG (el recorte oscuro del
    monocromo, la limpieza de alfa, el escalado del splash): los demás tests solo miran
    geometría (D9).
  - `logo-glow.png` nace verde; su mutación es M15.

- **R2**: WHEN se recorre `mobile-pet-tracker/assets/` entero THE SYSTEM SHALL no
  contener ningún fichero (con cualquier nombre y extensión) con un sha256 de la
  columna «viejo» de §Constantes, y los cinco ficheros retirados de §Constantes SHALL
  no existir.
  - Prueba: `::#244 R2: ningún fichero de assets conserva el arte del robot` (recorre
    `assets/` de forma recursiva, fuentes incluidas) y
    `::#244 R2: el fichero retirado ya no existe` (`it.each`, cinco filas).
  - Nace rojo: los once hashes viejos están presentes y los cinco ficheros existen.

- **R3**: WHEN se leen las fuentes congeladas THE SYSTEM SHALL tener en
  `specs/mobile-orbit-splash-icono/design-src/` los tres PNG con el sha256 de
  §Constantes (cada uno PNG de 1024 × 1024, con el tipo de color de §Constantes) y
  SHALL tener `specs/mobile-orbit-splash-icono/convert-orbit-icons.py` con el sha256 de
  §Constantes y las cadenas `pillow==13.0.0`, `SAFE_RADIUS = 338`, `SPLASH_SCALE = 799`
  y `DARK_CUTOFF = 60`.
  - Prueba: `::#244 R3: las fuentes PNG están congeladas` (`it.each`, tres filas) y
    `::#244 R3: el script de conversión es el de la spec`.
  - **Nacen verdes los dos**: el leader ya puso las fuentes y el script en el commit de
    la spec (a diferencia de #243, el script no se teclea en C2: está en el repo y el
    test lo fija por sha256). Su mutación está en [[design]] §6 (M12, M13).

- **R4**: WHEN se ejecuta `convert-orbit-icons.py` sobre las fuentes congeladas THE
  SYSTEM SHALL escribir los ocho PNG de R1 y SHALL terminar con código 0 solo si cada
  uno cumple, leído de vuelta: PNG RGBA, el tamaño y el tope de bytes de §Constantes,
  las comprobaciones de su fila (§Constantes, «Comprobaciones de vuelta») y, en los
  ficheros de 1024 px que no son `icon.png`, alfa mínimo distinto de cero ≥ 16.
  - Prueba: la salida del propio script (design.md §2 trae la tabla esperada, ocho
    filas `ok`) y el código de salida 0. En jest solo queda su huella: R1 fija los
    bytes que produjo y, como la salida es determinista (D2), cualquier cambio del
    alfa, del recorte o del escalado cambia el hash.
  - Los reviewers re-ejecutan el comando de design.md §2 a un directorio temporal y
    comparan los ocho hashes con R1. No se prescribe un test de jest que lance Python:
    CI no tiene `uvx` (D2).

### Geometría que jest sí puede leer

PNG se decodifica con `zlib` en node (a diferencia de WebP en #243): los cuatro
requisitos siguientes son tests de píxeles, sin dependencias nuevas, con el decodificador
que ya está en `app.assets.test.ts`.

- **R5**: WHEN se lee el alfa de `splash-icon.png`, `android-icon-foreground.png` y
  `android-icon-monochrome.png` THE SYSTEM SHALL no tener ningún píxel con alfa > 0
  fuera de la zona segura, y `splash-icon.png` SHALL seguir cumpliendo los tests
  existentes de `#115 R10` que no cambian (ningún alfa fuera de [174, 850), esquinas
  transparentes, cara opaca en `(512, 560)`).
  - Prueba: `app.assets.test.ts::#244 R5: toda la mascota del splash cabe en el círculo de radio 338`
    (sustituye al `it` `la punta del pin es transparente` de `#115 R10`, D10) y
    `::#244 R5: la mascota de android-icon-foreground.png y de android-icon-monochrome.png cabe en el círculo de radio 338`
    (`it.each`, dos filas).
  - Rojo sobre el arte viejo: el splash viejo deja 25 píxeles fuera del círculo y el
    primer plano viejo 98060. **Nace verde la fila del monocromo** (el viejo ya cabía,
    radio 325.9); su mutación es M4.

- **R6**: WHEN se lee el alfa de `icon.png` y de `favicon.png` THE SYSTEM SHALL no
  encontrar ni un píxel con alfa menor que 255.
  - Prueba: `app.assets.test.ts::#244 R6: icon.png y favicon.png no tienen ni un píxel con alfa menor que 255`
    (`it.each`, dos filas). Apple rechaza un icono de App Store con transparencia y el
    launcher de iOS lo rellena de negro.
  - **Nace verde** (los viejos eran opacos); mutación M5.

- **R7**: WHEN se leen `android-icon-monochrome.png`, `pet-tracker-notification-96.png`
  y `pet-tracker-notification-color-96.png` THE SYSTEM SHALL cumplir: (a) en el
  monocromo y en la notificación 96, todo píxel con alfa > 0 es blanco puro
  (`255, 255, 255`), porque Android solo usa el alfa y lo tiñe; (b) en las dos
  notificaciones, la caja del alfa deja al menos 4 px de margen en los cuatro lados;
  (c) en la notificación en color, al menos 1000 píxeles con alfa > 0 no son blancos.
  - Prueba: `app.assets.test.ts::#244 R7: el monocromo y la notificación 96 solo tienen píxeles blancos`
    (`it.each`, dos filas), `::#244 R7: las dos notificaciones dejan 4 px de margen`
    (`it.each`, dos filas) y `::#244 R7: la notificación en color conserva su color`.
  - **Nacen verdes los tres** (el arte viejo ya los cumplía). Es esperado: lo que
    añaden es impedir una regresión (M6, M7, M8). El contenido del recorte oscuro lo
    cubre R1, no estos tests (zona ciega, D9).

### iOS

- **R8**: WHEN se lee `mobile-pet-tracker/assets/expo.icon/` THE SYSTEM SHALL tener un
  `icon.json` que, leído como JSON, sea igual al objeto literal de design.md §4 (relleno
  `automatic-gradient` con `#9460FC`, un solo grupo con una sola capa
  `{ "image-name": "orbit.png", "name": "orbit" }` y las demás claves del andamiaje), y
  `Assets/` SHALL contener únicamente `orbit.png`.
  - Prueba: `::#244 R8: icon.json compone solo a Orbit sobre el violeta de marca` y
    `::#244 R8: expo.icon/Assets contiene solo orbit.png`.
  - Nace rojo: el `icon.json` viejo declara el relleno azul de Expo, las capas
    `expo-symbol 2` y `grid`, y `Assets/` tiene el SVG y `grid.png`.
  - Riesgo declarado (D8): iOS no se puede compilar ni ver aquí (la feature #60 está
    aparcada, sin cuenta de pago de Apple). El test fija la estructura; el aspecto lo
    revisa el humano con Icon Composer si abre el proyecto, y no hay casilla de gate
    para ello.

### Consumo y superficie sin cambios

- **R9**: WHILE la app arranca y pinta su marca THE SYSTEM SHALL cargar cada PNG por la
  misma ruta y con la misma geometría que antes de #244, es decir: `app.json` y
  `app.config.test.ts` no cambian, ningún fichero de `mobile-pet-tracker/src/` que no
  sea un test cambia, y los tests existentes de §Tests existentes pasan **sin
  modificación**, con una única excepción: en `app.assets.test.ts` un `it` se sustituye
  (R5, D10).
  - Prueba: las suites de tasks.md §Verde de la cadena en verde, más las guardas de
    tasks.md §Guardas finales: `git diff --name-only <H0>..HEAD -- mobile-pet-tracker
    ':!mobile-pet-tracker/assets'` lista exactamente tres rutas
    (`app.assets.test.ts`, `scripts/make-icons.mjs` borrado y el test nuevo) y
    `app.json` no aparece.

- **R10**: WHEN se abre `docs/ui-guidelines.md` THE SYSTEM SHALL contener exactamente
  una sección `## Enmienda #244 — …` cuyo texto es el literal de design.md §5, con la
  marca de Orbit en el icono, el splash y las notificaciones, la zona segura de radio
  338, el fondo `#9460FC`, el cierre del punto 4 de la Enmienda #243 y la casilla
  `- [ ] Enmienda #244 aprobada por humano`, y todas las secciones `## …` que la sigan
  SHALL empezar por `## Enmienda #`.
  - Prueba: `::#244 R10: la carta lleva la Enmienda #244 una sola vez, con la marca de Orbit`
    (usa `[ xX]` en la casilla: al firmar, el humano la marca y no debe ponerse rojo).
  - **Gate G4, humano, sin firmar.** Este requisito se implementa solo después de que
    el humano marque G4 (tasks.md C4 y C5). Hasta entonces, C1 a C3 son mergeables y la
    feature queda `spec_ready`.
  - Ningún test existente cambia por la enmienda: se añade al final, no toca el punto 7
    ni la Enmienda #243 y su título empieza por `## Enmienda #`.

- **R11**: WHEN se compara la rama de la feature con H0 THE SYSTEM SHALL mostrar
  cambios bajo `mobile-pet-tracker/assets/` solo en los trece ficheros de
  §Constantes («Superficie»): los siete PNG de marca modificados, `orbit.png` y
  `icon.json` (uno añadido y otro modificado) y los cuatro borrados; las diez poses
  `orbit-*.webp`, `logo-glow.png` y los demás ficheros quedan como están.
  - Prueba: guarda de tasks.md §Guardas finales, con su salida literal. No es un test
    de jest: la lista de ficheros tocados es un hecho del diff, no del árbol.

## Constantes

Pins por **contenido** (D3): son el contrato de la feature, no un recuento que
caduque. Si el humano cambia una fuente después de firmar, se enmienda esta tabla y el
test, y el leader reabre el gate solo para ese cambio.

**Los ocho PNG nuevos** (R1). Los sha256 «nuevo» se midieron con `pillow==13.0.0` y
`uv 0.12.9` en la VPS (Linux, x86-64), en tres corridas independientes con salida
idéntica. Si en la máquina del implementador el script da otros hashes, ver D2:
**no se edita la tabla**, se reporta y el leader re-mide.

| Fichero | Bytes (nuevo) | sha256 nuevo (R1) | sha256 viejo (R2) | Bytes (viejo) |
|---|---|---|---|---|
| `images/icon.png` | 586918 | `e393931e24bcd95bd695c3b34f0ed25ab0b16d56363cbd7ed50b70510ed58248` | `397688b0222b690ba0677febfe9d7ba94f00f1cd35a434b94301e1046efa657b` | 1256021 |
| `images/android-icon-foreground.png` | 384993 | `6b4d36aa533c64535d7a165b7864aabaf3182c79bfb2155b6d88420839772828` | `8767ad5e565a736a433627a3b9f0f96f7c888e68b023338dd9d0b59efacf2913` | 627059 |
| `images/android-icon-monochrome.png` | 29443 | `472bbcc7cd8337a04fae481f5c17bcc8a375f436941cc76bdd18cdce44b13fa1` | `a3cb3c85ebf3b23bb3c40e630207b3e56abec6e076d12bafac1cb2e30ea3a8ac` | 24210 |
| `images/splash-icon.png` | 410234 | `b2b69eb940cc6e000fdda432479d6aeb6004e7ffd78718e532a37d89544dc6d5` | `087c1eaa69e8324ac46e98073897ddc261d3f25b764f00d6216fb5014c05e56d` | 328999 |
| `images/favicon.png` | 3539 | `d3ff4cf57f6200a8217bd424ca740e7b13e4714b4428bcf60db70e330450a976` | `f85e1808a74971adc6cc2deffedf2845b73724ef614e3cb742dc38cbb3e266fa` | 5416 |
| `images/pet-tracker-notification-96.png` | 4687 | `6639fc98b1d9fd02df99a5ed77c37cfbdd69b327d145a55a68996ee169c7174e` | `3a2d6cd4b288c513a3f12e3ce24bbb978c7e4d119ca7b319b2fa4f43c78c927a` | 3633 |
| `images/pet-tracker-notification-color-96.png` | 12946 | `e3bc99a9567b0b43c93dcfe7c60b5080b8c50e397ca2c2360a949dbfd4f63c3b` | `dcfa119998974c0b11d0c9bcd523ab87530248f8c3b617db8a9a168374bb9f20` | 10299 |
| `expo.icon/Assets/orbit.png` | 384993 | `6b4d36aa533c64535d7a165b7864aabaf3182c79bfb2155b6d88420839772828` (igual que el primer plano) | — (no existe) | — |

(Rutas relativas a `mobile-pet-tracker/assets/`.)

**Arte del robot que además se retira** (R2: su sha256 viejo y su inexistencia):

| Fichero (relativo a `mobile-pet-tracker/`) | sha256 viejo |
|---|---|
| `assets/images/pet-tracker-app-icon.png` | `b802f32fb47d54b706b84883c687ab3abb8f8824ae1f536900a420b4149b2f02` |
| `assets/images/pet-tracker-notification-monochrome-original.png` | `4c1ed33cc0bfeb824d5f41863b4abe72c11fde7a7cbcc4c402ffe0757268b356` |
| `assets/expo.icon/Assets/expo-symbol 2.svg` | `ad117d20fd819f4ec71876ce09c0e8b9275b1f20c5ec3c9d7d1914977ceffec6` |
| `assets/expo.icon/Assets/grid.png` | `8247d79a2b31328fe4e330a973e6fae16924ed9aebd72c64d464d6856ab18c72` |
| `scripts/make-icons.mjs` (solo inexistencia; es código del pipeline viejo, no arte) | — |

Son los **cinco ficheros retirados** de R2. `jimp-compact` (el único import de
`make-icons.mjs`) no está en `package.json`: llega transitivo con `@expo/image-utils`,
así que `package.json` y `bun.lock` no cambian.

**Sin cambios** (R1, fila `logo-glow`): `assets/images/logo-glow.png`, 604 × 604 RGBA,
sha256 `bbd98a3f3c12d090f4df6065b7462fcdf6bc266209d002b4ef5fe554c245f66c`.

**Fuentes congeladas** (R3), en `specs/mobile-orbit-splash-icono/design-src/`:

| Fuente | Modo | Tipo de color PNG (byte 25) | sha256 |
|---|---|---|---|
| `orbit-icon.png` | RGB 1024² | 2 | `4e01caec86196198fcd6afc662f3df7076e2f36fd323a460eafc402778a422e8` |
| `orbit-icon-fg.png` | RGBA 1024² | 6 | `d02da10d4823c81cdd0c0eecfd0407a868b204a3627b9135f037e13b69fe620b` |
| `orbit-splash.png` | RGBA 1024² | 6 | `4b2118767678ea273c49ce8245b6d0622e6db6ac2058a0002318c388c31a6ee8` |

**Script** (R3): `specs/mobile-orbit-splash-icono/convert-orbit-icons.py`, 5342 bytes,
sha256 `ad655780a53befadceafd7cfa7cfb9cadb94f49587089a77c94146116fe53f41`. Se
ejecuta **tal como está** (no se reformatea ni se edita: cualquier cambio rompe
R3 y los hashes de R1).

**Comprobaciones de vuelta** (R4), las que el script imprime y exige. Salida esperada
(caja = `getbbox()` del alfa: izquierda, arriba, derecha, abajo; radio = distancia
máxima del centro de un píxel con alfa > 0 al centro del lienzo, en px; alfa mín. = el
menor alfa distinto de cero):

| Fichero | Caja del alfa | Radio | Alfa mín. | Tope de bytes | Otras exigencias |
|---|---|---|---|---|---|
| `icon.png` | (0, 0, 1024, 1024) | 723.4 | 255 | 720000 | todo alfa = 255 |
| `android-icon-foreground.png` | (183, 233, 841, 792) | 329.1 | 16 | 480000 | radio ≤ 338 |
| `android-icon-monochrome.png` | (183, 233, 841, 792) | 329.1 | 16 | 36000 | radio ≤ 338; blanco en todo píxel visible |
| `splash-icon.png` | (216, 190, 815, 826) | 335.2 | 16 | 500000 | radio ≤ 338; caja dentro de [174, 850) |
| `favicon.png` | (0, 0, 48, 48) | 33.2 | 255 | 4500 | 48 × 48; todo alfa = 255 |
| `pet-tracker-notification-96.png` | (4, 10, 92, 85) | 45.0 | 1 | 6000 | 96 × 96; márgenes ≥ 4 |
| `pet-tracker-notification-color-96.png` | (4, 10, 92, 85) | 45.0 | 1 | 16000 | 96 × 96; márgenes ≥ 4 |
| `orbit.png` (de `expo.icon/Assets`) | (183, 233, 841, 792) | 329.1 | 16 | 480000 | radio ≤ 338 |

El alfa mínimo de las dos notificaciones es 1 porque el reescalado a 96 px antialiasa;
la regla «≥ 16» solo se exige a los ficheros de 1024 px que no son `icon.png`.

**Superficie** (R11): los trece ficheros que la rama puede tocar bajo
`mobile-pet-tracker/assets/`, en el orden de `LC_ALL=C sort`:

```
mobile-pet-tracker/assets/expo.icon/Assets/expo-symbol 2.svg
mobile-pet-tracker/assets/expo.icon/Assets/grid.png
mobile-pet-tracker/assets/expo.icon/Assets/orbit.png
mobile-pet-tracker/assets/expo.icon/icon.json
mobile-pet-tracker/assets/images/android-icon-foreground.png
mobile-pet-tracker/assets/images/android-icon-monochrome.png
mobile-pet-tracker/assets/images/favicon.png
mobile-pet-tracker/assets/images/icon.png
mobile-pet-tracker/assets/images/pet-tracker-app-icon.png
mobile-pet-tracker/assets/images/pet-tracker-notification-96.png
mobile-pet-tracker/assets/images/pet-tracker-notification-color-96.png
mobile-pet-tracker/assets/images/pet-tracker-notification-monochrome-original.png
mobile-pet-tracker/assets/images/splash-icon.png
```

## Tests existentes y qué cambia en cada uno

Verificado contra el árbol de `dev` (H0 = `5f61bdd7`) por **qué leen**, no solo por qué
fijan, con `grep` real sobre `mobile-pet-tracker/` (`src`, `app.*.ts`, `scripts`) y
`hosting/` el 2026-11-06. La lección de la Enmienda 1 de #243 fue que un candado que
**escanea todos los ficheros** rompió a Codex; la tabla separa los dos tipos. Si uno
falla al sustituir los binarios, es un hallazgo: PARA y anótalo, no lo edites.

**A. Tests que leen los PNG de marca.**

| Test | Qué lee o fija | Cambio |
|---|---|---|
| `app.assets.test.ts` `#101 R2`, `R8`, `R3`, `R4`, `R6`, `R7` | cabecera IHDR de `icon`, `favicon`, `foreground`, `monochrome`, `splash` y `notification-96` (tamaño, 8 bits, RGBA). Los nuevos cumplen: 1024², 48², 96², `colorType` 6, `Image.save` de Pillow sin entrelazado | ninguno |
| `app.assets.test.ts` `#101 R5` | `android-icon-background.png` no existe | ninguno |
| `app.assets.test.ts` `#115 R10` — `no hay alfa fuera de la zona segura [174, 850)` | alfa del splash: caja del arte nuevo (216, 190, 815, 826), verificado: 0 píxeles fuera | ninguno |
| `app.assets.test.ts` `#115 R10` — `las cuatro esquinas del antiguo cuadrado son transparentes` | cuatro cuadrados de 26 px en las esquinas de [174, 850): verificado, [0, 0, 0, 0] | ninguno |
| `app.assets.test.ts` `#115 R10` — **`la punta del pin es transparente`** | `countAlpha(alpha, [492, 790, 532, 830]) === 0`: fijaba la punta del pin de la silueta vieja. El perro nuevo ocupa esa caja (su caja llega a y = 826) | **se sustituye** por el `it` de R5 (D10) |
| `app.assets.test.ts` `#115 R10` — `la cara de la mascota es opaca` | `alpha(512, 560) === 255`: verificado en el arte nuevo | ninguno |
| `app.config.test.ts` (`#101 R2`…`R9`) | solo cadenas de `app.json`: rutas, `#9460FC`, `imageWidth: 200`, `ios.icon` | ninguno (R9) |
| `src/app/__tests__/index.test.tsx` | `getByTestId('splash-logo')`; no lee el PNG | ninguno |
| `src/screens/welcome/index.test.tsx` (línea que niega `splash-icon`) | lee el **código fuente** de `screens/welcome/index.tsx` y exige que no contenga la cadena `splash-icon`; no lee el PNG | ninguno |

**B. Tests que escanean directorios o ficheros enteros** (el tipo que rompió #243).

| Test | Qué escanea | Cambio |
|---|---|---|
| `src/__tests__/orbit-rename.test.ts` `#225 R2` | `readdirSync(assets/images)`: ningún nombre casa `/pingo/i`. Los ficheros nuevos y los retirados no lo casan | ninguno |
| `src/__tests__/orbit-rename.test.ts` `#225 R4` (los dos `it`) | **todos los tests de `src/`**: ninguna línea de código nombra `Pingo` salvo títulos, comentarios y las entradas de `exceptions` | ninguno **si** el test nuevo no escribe `Pingo` en código. La spec lo evita a propósito: los literales de R10 no incluyen esa palabra (D11). No hay entrada nueva en `exceptions` |
| `src/screens/welcome/index.test.tsx` (`#225 R2, R5`) | `readdirSync(assets/images)` filtrado por `^(orbit\|mascot)-`: solo las diez poses | ninguno: la feature no añade ni quita ningún `orbit-*` ni `mascot-*` |
| `src/__tests__/orbit-cachorro-art.test.ts` (#243) | `readdirSync(assets/images)`: las diez `orbit-*.webp` y «ningún fichero conserva el arte viejo» (hashes de los WebP); y en R6, la carta: una sola `## Enmienda #243 — `, cuerpo hasta el siguiente `\n## `, y todo encabezado posterior empieza por `## Enmienda #` | ninguno: los PNG nuevos no están en la lista vieja de WebP, y `## Enmienda #244 — ` cumple la regla de encabezados |
| `src/__tests__/home-photo-hero-canvas.test.ts` | todo encabezado `## ` posterior a la Enmienda #195 empieza por `## Enmienda #` | ninguno (R10) |
| `src/__tests__/tab-bar-canvas-fidelity.test.ts`, `profile-canvas-fidelity.test.ts`, `reminders-upcoming-past-canvas-fidelity.test.ts`, `alert-detail-canvas-fidelity.test.ts`, `heroui-text-size-merge.test.ts`, `ui-language.test.ts`, `consistency-classnames.test.ts`, `tab-headers-canvas.test.ts`, `geofences-canvas-fidelity.test.ts` | leen la carta con `toContain`, `match` de su propio `## Enmienda #<n>` o `slice` desde su sección: ninguna cuenta todos los encabezados ni exige que la suya sea la última | ninguno (R10) |
| `src/__tests__/design-drift.test.ts` | recorre el código de `src/` saltando los directorios `__tests__`; no cita ningún PNG de marca | ninguno |
| `src/__tests__/orbit-activity-pose.test.ts`, `orbit-charter-voice.test.ts`, `orbit-rename-copy.test.ts` | maestro viejo de #225, punto 7 de la carta y copy visible; no leen assets de marca | ninguno |

**C. Fuera del árbol móvil.** `hosting/` no referencia el icono, el favicon ni el
splash (`grep` sin resultados). `STATUS.md` (línea 338 y siguientes), la entrada #101 de
`feature_list.json` y varios `progress/*` nombran `make-icons.mjs` y «perrito
robótico»: son historia fechada, no se reescriben. `jimp-compact` solo lo importaba
`make-icons.mjs`. Ni `tsconfig.json`, ni `eslint.config.*`, ni `jest.config.*` ni
`package.json` (sin script `make-icons`) nombran `scripts/`: borrarlo no rompe nada.

## Fuera de alcance

- **Cambiar `app.json`** (rutas, `#9460FC`, `imageWidth`, `ios.icon`) o sus candados:
  no hace falta, ya apuntan a los ficheros que se sustituyen. Una `imageWidth`
  distinta (si el smoke G2 ve el splash grande o pequeño) sería una feature aparte.
- **Reconstruir el dev build** (G3) y **probar en dispositivo** (G2): son del humano.
  Icono, splash, favicon y notificaciones son nativos y no viajan por Metro ni por OTA.
- **iOS**: validación visual y compilación (feature #60, aparcada sin cuenta de pago).
  Variantes oscura y tintada del icono de iOS: no se generan.
- **`logo-glow.png`**: queda como está (D12); la descripción de #244 lo listaba, pero no
  dibuja a la mascota.
- **Las diez poses** `orbit-*.webp`: son de #243 y no se tocan (R11).
- **`src/app/index.tsx`** (la ruta de arranque que pinta `splash-icon.png` a 120 × 120):
  sin cambios de código.
- **Reescribir la Enmienda #243**: su punto 4 («Pendiente») queda como historia y lo
  cierra la Enmienda #244.
- **Retocar a mano las fuentes** o el resultado: todo sale del script (D1).
- **`STATUS.md`, `feature_list.json` #101 y `progress/*`**: no se reescriben.
- **Instalar dependencias del proyecto**: ni `package.json` ni `bun.lock` cambian.

## Decisiones

- **D1. Herramienta: `uvx --with pillow==13.0.0 python -I`.** Es la de #243 y la de
  #225 (precedente en el repo), de uso único y de desarrollo; no entra en
  `package.json`, `bun.lock` ni CI. Lee las tres fuentes y escribe los ocho PNG con
  una sola corrida. El script **vive en el repo como fichero** (no embebido en
  design.md como en #243) porque son 115 líneas con nueve constantes: copiarlo byte a
  byte es una fuente de error que R3 evita fijando su sha256.
- **D2. Determinismo.** Con la versión fijada, tres corridas independientes dieron la
  misma salida y los mismos ocho hashes. Si el implementador obtiene otros hashes, PARA,
  no toca la tabla, deja los hashes que obtuvo en su reporte y el leader re-mide y
  enmienda el pin. No hay test de jest que lance Python.
- **D3. Los pins son por contenido, no por conteo.** La tabla fija ficheros y hashes;
  no hay cifras agregadas («ocho PNG») fuera de las listas nombradas.
- **D4. Limpieza de alfa.** Primer plano y splash pasan por `clean` (`< 16` a 0, `≥ 252`
  a 255): las fuentes traen alfa 1 a 3 que ensancha la caja y deja una película sobre
  fondos oscuros. En el primer plano ese residuo está **dentro** del círculo seguro,
  así que ningún test de jest lo ve: lo ve la lectura de vuelta del script (alfa mín.
  16) y lo fija el sha256 (M2).
- **D5. Icono y favicon.** `icon.png` es `orbit-icon.png` tal cual (RGB 1024² a RGBA,
  opaco, sin transparencia); `favicon.png` es ese icono reducido a 48 × 48 con Lanczos.
  Ninguno se recorta ni recentra.
- **D6. Icono adaptativo.** El primer plano es `orbit-icon-fg.png` limpiado, **sin
  reescalar**: su fuente ya cabe (radio 329.1 ≤ 338). El fondo sigue siendo el plano
  `#9460FC` de `app.json`. `expo.icon/Assets/orbit.png` son los mismos bytes.
- **D7. Monocromo con recorte oscuro.** El monocromo no es la silueta llena del
  primer plano sino el primer plano con ojos, nariz y boca como hueco (luminancia < 60,
  `DARK_CUTOFF`). Con la silueta llena el perro sería una mancha sin cara. Riesgo
  declarado para G2: a 96 px (notificación) el recorte puede verse ruidoso; si el humano
  lo ve así, el remedio es una silueta llena (`DARK_CUTOFF = 0`), una feature de
  seguimiento que enmienda esta tabla.
- **D8. `icon.json` conserva el andamiaje de Expo.** Cambia solo lo que es de la marca:
  el color del relleno (de `0,0.47843,1` a `#9460FC`), la capa única (`orbit.png` en
  lugar de `expo-symbol 2` y `grid`) y se quita su desplazamiento vertical. Se mantiene
  la clave `automatic-gradient` porque es la única que este repo ya usa y que Xcode
  aceptó (iOS no se puede verificar aquí); `shadow`, `translucency` y
  `supported-platforms` no se tocan. Se descartó `solid`: una clave que nadie del
  proyecto ha probado.
- **D9. Qué ve cada candado.** Jest decodifica PNG y por eso R5, R6 y R7 son tests de
  píxeles, pero **no** puede distinguir «bien recortado» de «mal recortado» dentro de
  la silueta: eso lo fija solo el sha256 de R1 (mutaciones M2 y M3, zona ciega).
- **D10. Una sustitución en `app.assets.test.ts`.** El `it` `la punta del pin es
  transparente` fijaba la forma del robot (la punta del pin está en y = 790 a 830) y el
  cachorro la ocupa. Se sustituye por el candado circular de R5, que es el invariante
  real (la zona segura). Los otros tres `it` de `#115 R10` no cambian. Es la única
  edición a un test existente, y va en C1 como parte del rojo.
- **D11. El test nuevo no nombra la palabra prohibida.** `orbit-rename.test.ts`
  `#225 R4` falla con cualquier línea de código de un test que nombre a Pingo, y la
  Enmienda #243 sí la nombra. La Enmienda #244 y su test **no** la necesitan: los
  literales de R10 son `Orbit`, `icono adaptativo`, `splash`, `radio 338`, `#9460FC`,
  `Enmienda #243` y `rebuild`. Si el implementador escribe esa palabra en código, `#225
  R4` se pone rojo y es su error, no una excepción que autorizar.
- **D12. `logo-glow.png` no se toca.** Es un destello azul difuminado, sin mascota ni
  robot, y no lo importa ningún fichero de `src/` (solo la historia de
  `mobile-welcome-splash`). Sustituirlo no tiene objeto; se fija su sha256 para que
  nadie lo toque sin querer. Es una **desviación declarada** de la descripción de la
  feature, que lo listaba.
- **D13. Se borran el maestro viejo, el monocromo original y `make-icons.mjs`.** Son
  la entrada y el pipeline del arte del robot; el pipeline nuevo es el script de la
  spec y el maestro nuevo (`orbit-icon.png`) vive en `design-src/`. Mantener
  `pet-tracker-app-icon.png` con otro contenido sería un duplicado de 586 KB de
  `icon.png`. Es una **desviación declarada** (la descripción hablaba de «sustituir»
  ese fichero): el leader puede vetarla antes del handoff y entonces R2 y R11 pierden
  esa fila.
- **D14. Splash reescalado a 799 px.** El cuerpo de la fuente `orbit-splash.png` mide
  1011 × 1000 px y su radio máximo es 708.5 px frente a los 338 de la zona segura; el script lo
  reduce con Lanczos a 799 × 799 y lo coloca en (116, 109), con lo que su radio
  máximo es 335.2 ≤ 338 y su caja (216, 190, 815, 826) queda dentro de [174, 850). A
  `imageWidth` 200 el perro se ve de unos 117 dp de ancho. El círculo de 2/3 de
  Android 12 es la razón de fondo (documentado por Google; se verifica en G2). Los
  números 799 y (116, 109) están en el script y fijados por su sha256.
- **D15. La enmienda de la carta es una sección nueva** (como #243 D6). No reescribe
  el punto 7 ni la Enmienda #243. Se teclea **después** de la firma de G4.

## Smoke G2 (para `progress/smoke_ui.md`)

**Exige el rebuild del dev build (G3, humano)**: el icono, el splash, el favicon y las
notificaciones están en el binario nativo y no viajan por Metro ni por OTA. Dentro del
smoke en lote al final del plan, con la app instalada tras el rebuild:

1. Launcher: el icono de Orbit se ve completo con la máscara circular y con la
   cuadrada redondeada del launcher; ningún recorte de orejas ni de collar.
2. Icono temático (Android 13+, ajuste «iconos con tema»): la silueta blanca se
   reconoce como un cachorro, con ojos y nariz como hueco.
3. Arranque en frío: el splash muestra a Orbit centrado sobre el violeta `#9460FC`, sin
   recorte por el círculo de Android 12 ni cuadro blanco alrededor. Anota si se ve
   demasiado grande o pequeño (si sí, abrir feature aparte para `imageWidth`).
4. Ruta de arranque (la pantalla de carga de `src/app/index.tsx`, 120 × 120): Orbit
   se reconoce y no se ve borroso.
5. Notificación: el icono de la barra de estado es una silueta blanca legible, tintada
   con `#9460FC` al desplegarla. Anota si el recorte de ojos y nariz se ve ruidoso (D7).
6. En ningún lugar aparece ya la cabeza del robot con antena (launcher, splash,
   notificación, favicon en la web).

Sin casilla: iOS no se verifica (D8, feature #60).

## Aprobación

- [x] Firmada por el leader con la firma delegada (mandato 2026-10-26 UI), tras la
  checklist de `progress/plan_canvas-parity-2026-10-23.md` §4 y los tres puntos de
  `progress/plan_ui-2026-10-26.md` §4 (fecha: 2026-11-06)
- [x] G6: arte de marca de Orbit aprobado por el humano, las tres fuentes de
  `design-src/` con los sha256 de §Constantes (humano; fecha: 2026-11-06; fuente: mensaje
  del humano en la sesión @Frontend el 2026-11-06, «Si apruebo G6», tras ver las tres
  imágenes y la nota del parche morado)
- [x] G4: enmienda de `docs/ui-guidelines.md` aprobada por el humano, con el literal de
  design.md §5 (humano; fecha: 2026-11-06; fuente: mensaje del humano en la sesión
  @Frontend el 2026-11-06, «tienes mi aprobacion para G4 puedes empezar mientras yo
  realizo el dev build»)
- [X] G3: rebuild del dev build con los iconos nuevos (humano; fecha: 2026-11-06)
- [X] Smoke G2 en dispositivo, pasos 1–6 (humano; fecha: 2026-11-06)

#244 se implementa en dos tramos (tasks.md): C1 a C3 (R1 a R9 y R11) no necesitan
G4 y se mergean en `dev` con la firma del leader, G6 y el veredicto «aprobado» del
`reviewer`; C4 y C5 (R10) entran solo cuando el humano marque G4. Queda `spec_ready`,
no `done`, hasta que estén cerradas G4, G3 y G2.
