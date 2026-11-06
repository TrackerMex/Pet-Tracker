---
feature: "mobile-orbit-cachorro-art"
status: approved        # draft | approved
tags: [mobile, ui, mascota, orbit, assets, spec]
---

# Requisitos — [[mobile-orbit-cachorro-art]] (#243)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Decisiones técnicas en [[design]]; orden de commits en [[tasks]].
>
> **Origen.** Entrada 243 de `feature_list.json`, registrada el 2026-11-05 a pedido
> del humano tras un feedback externo: la mascota «se parece más a una persona que a
> un animal». El humano eligió la **variante A** (cachorro sentado, de frente) entre
> tres propuestas y se generaron las diez poses. El nombre de la mascota **no cambia**:
> es Orbit desde #221/#225.
>
> **Diseño nuevo.** Cachorro de pelaje crema con un parche morado sobre un ojo,
> orejas y cola gris oscuro, nariz negra, lengua rosa y collar morado con una placa
> GPS cuya luz es el verde de marca `#178255`. Render 3D de plastilina suave. Sin
> antena, sin manos y sin botón en el pecho. **Diseño que sustituye:** robot-perro
> bípedo con antena, gorro verde, cara morada y botón en el pecho.
>
> **Fuentes congeladas** (ya en el repo, las puso el leader): los diez PNG
> `specs/mobile-orbit-cachorro-art/design-src/orbit-<pose>.png` y la referencia
> `orbit-reference-a-sit.png`. Todos son RGBA de 1024 × 1024, con alfa residual de 1
> a 3 fuera del contorno. Sus sha256 están en §Constantes.
>
> **Esta spec no escribe código de la aplicación.** La implementación consiste en
> convertir las fuentes con un script de desarrollo (design.md §2), reemplazar diez
> binarios y añadir un test nuevo. Ningún fichero de `mobile-pet-tracker/src/` fuera
> de tests cambia (R5).

## Glosario

- **Las diez poses**: `wave`, `wave-blink`, `talk`, `walk`, `celebrate`, `sleep`,
  `collar`, `health`, `food` y `clipboard`. Su fichero es
  `mobile-pet-tracker/assets/images/orbit-<pose>.webp`.
- **WebP válido**: contenedor `RIFF`/`WEBP` con primer chunk `VP8X`, bandera de alfa
  activa (`bytes[20] & 0x10`), sin animación (`bytes[20] & 0x02` = 0),
  `readUIntLE(24, 3) + 1` = 1024 de ancho y `readUIntLE(27, 3) + 1` = 1024 de alto, y
  como mucho 100000 bytes. Es el mismo criterio que ya fijan `welcome`, `empty-state`,
  `celebration` y `orbit-activity-pose` (§Tests existentes).
- **Arte viejo**: los diez `.webp` de `dev` en el commit H0 del handoff (hashes en
  §Constantes). **Arte nuevo**: la salida del script de design.md §2 sobre las fuentes
  congeladas.
- **Limpieza de alfa**: regla del script, `alfa < 16` pasa a 0 y `alfa >= 252` pasa a
  255. Quita el residuo de 1 a 3 fuera del contorno y el halo casi opaco del cuerpo.

## Usos de las poses en la app

La tabla describe lo que **no cambia** (R5). Los tamaños son los de producción hoy.

| Pose | Dónde se pinta | Tamaño |
|---|---|---|
| `wave` | `screens/login`; `screens/welcome` | 220 en Bienvenida |
| `wave-blink` | `screens/welcome`, superpuesta a `wave` con opacidad 0 a 1 (`blinkStyle`) | 220 |
| `talk` | `screens/forgot`; `screens/home` (`POSES.talk`); `EmptyState` | 56 en Inicio |
| `walk` | `screens/home` (`POSES.walk`, etiqueta `home.orbitWalkLabel`) | 56 |
| `celebrate` | `components/celebration.tsx` | 170 |
| `sleep` | `EmptyState` | 160 / 190 |
| `clipboard` | `screens/register`; `screens/reset-password` (dos usos); `EmptyState` | |
| `collar` | `screens/pairing` (`PAIRING_ORBIT_SOURCE`); `screens/join-pet` (`ORBIT_SOURCE`); `EmptyState` | 120 / 104 |
| `health` | `EmptyState` | |
| `food` | `screens/food`; `screens/nutrition-questionnaire` (dos usos); `EmptyState` | 150 / 112 / 52 / 44 |

Los componentes pintan con `expo-image` y fijan el tamaño por `style` (`className` es
inerte en `expo-image`). La imagen es cuadrada (1024²) como el arte viejo, así que
cambiar el binario no mueve ningún cálculo de layout.

## Requisitos funcionales

### Sustitución del arte

- **R1**: WHEN se lista `mobile-pet-tracker/assets/images/` THE SYSTEM SHALL contener
  exactamente diez ficheros que casen `^orbit-.*\.webp$`, los de las diez poses, y cada
  uno SHALL ser un WebP válido (1024 × 1024, con alfa, estático, ≤ 100000 bytes).
  - Prueba: `src/__tests__/orbit-cachorro-art.test.ts::#243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos`
    (un `it.each` por pose más el `it` de la lista exacta).
  - Nace verde sobre el arte viejo (el formato ya era válido). Su valor es impedir que
    sobre o falte un `orbit-*.webp` (una pose `worried` o `search` colada, M4).

- **R2**: WHEN se calcula el sha256 de cada `orbit-<pose>.webp` THE SYSTEM SHALL
  coincidir con el valor «nuevo» de §Constantes, y ningún fichero de
  `mobile-pet-tracker/assets/images/` (cualquier nombre y extensión) SHALL tener un
  sha256 de la columna «viejo».
  - Prueba: `::#243 R2: cada pose tiene el sha256 del arte nuevo` (`it.each`, 10 filas)
    y `::#243 R2: ningún fichero de assets/images conserva el arte viejo`.
  - Es el candado rojo de la feature: sobre el arte viejo falla en las diez filas.
    Es también el único candado de jest sobre el contenido del alfa y de los márgenes,
    porque jest no decodifica WebP (R4).

- **R3**: WHEN se leen las fuentes congeladas THE SYSTEM SHALL tener en
  `specs/mobile-orbit-cachorro-art/design-src/` los once PNG con el sha256 de
  §Constantes, cada uno PNG RGBA de 1024 × 1024, y SHALL tener el script
  `specs/mobile-orbit-cachorro-art/convert-orbit.py` con la cadena `pillow==13.0.0`,
  `quality=80, method=6` y la función `clean`.
  - Prueba: `::#243 R3: las fuentes PNG están congeladas` (`it.each` sobre los once) y
    `::#243 R3: el script de conversión está en la spec con sus parámetros`.
  - Nace rojo solo el segundo (el script no existe antes de C2). El primero nace verde.

- **R4**: WHEN se ejecuta `convert-orbit.py` sobre las fuentes congeladas THE SYSTEM
  SHALL escribir los diez WebP de R1 y SHALL terminar con código 0 solo si cada uno
  cumple, leído de vuelta: tamaño ≤ 100000 B, cabecera `RIFF`/`WEBPVP8X`, alfa mínimo
  distinto de cero ≥ 16, y margen transparente ≥ 24 px en los cuatro lados.
  - Prueba: la propia salida del script (design.md §2 trae la tabla esperada, diez
    filas `ok`) y el código de salida 0. En jest solo queda su huella: R2 fija los
    bytes que el script produjo, y como la salida es determinista (design.md §2, D2),
    cualquier cambio del alfa o de los márgenes cambia el hash.
  - Los reviewers re-ejecutan el comando de design.md §2 a un directorio temporal y
    comparan los diez hashes con R2. No se prescribe un test de jest que lance Python:
    CI no tiene `uvx` (D2).

### Consumo sin cambios

- **R5**: WHILE la app pinta cualquier pose THE SYSTEM SHALL cargarla desde el mismo
  `require('…/orbit-<pose>.webp')` y con el mismo tamaño que antes de #243, es decir,
  ningún fichero de `mobile-pet-tracker/src/` que no sea un test cambia, y los tests
  existentes de §Tests existentes pasan **sin modificación**.
  - Prueba: las suites listadas en §Tests existentes en verde, más la guarda de
    tasks.md §Guardas finales (`git diff --name-only <H0>..HEAD -- mobile-pet-tracker/src`
    solo lista el test nuevo).

### Documentación (gate G4, humano)

- **R6**: WHEN se abre `docs/ui-guidelines.md` THE SYSTEM SHALL contener exactamente
  una sección `## Enmienda #243 — …` cuyo texto es el literal de design.md §4, con la
  descripción nueva de Orbit (cachorro crema, parche morado, collar con placa GPS en
  `#178255`, sin antena, manos ni botón), la mención de «Pingo» como historia y su
  casilla `- [ ] Enmienda #243 aprobada por humano`, y todas las secciones `## …`
  que la sigan SHALL empezar por `## Enmienda #`.
  - Prueba: `::#243 R6: la carta lleva la Enmienda #243 una sola vez, con la descripción nueva` (usa
    `[ xX]` en la casilla: al firmar, el humano la marca y no debe ponerse rojo).
  - G4 quedó firmada el 2026-11-06 (§Aprobación): este requisito entra en la cadena.
    Se hace al final (tasks.md C4 y C5) y es del leader o de Codex según el handoff.
  - `orbit-charter-voice.test.ts` (que fija el bloque del punto 7) no cambia: la
    enmienda se añade al final y no toca el punto 7.

### Fuera de la superficie de la feature

- **R7**: WHEN se compara la rama de la feature con H0 THE SYSTEM SHALL mostrar
  cambios bajo `mobile-pet-tracker/assets/` solo en los diez
  `images/orbit-<pose>.webp`; `icon.png`, `splash-icon.png`,
  `android-icon-foreground.png`, `android-icon-monochrome.png`, `favicon.png`,
  `pet-tracker-notification-96.png`, `pet-tracker-notification-color-96.png`,
  `pet-tracker-app-icon.png`, `logo-glow.png` y `assets/expo.icon/` quedan como
  están (D4).
  - Prueba: guarda de tasks.md §Guardas finales:
    `git diff --name-only <H0>..HEAD -- mobile-pet-tracker/assets` da exactamente las
    diez rutas. No hay test de jest: geometría de icono y splash ya la fijan
    `app.assets.test.ts` y `app.config.test.ts`, que no se tocan.

## Constantes

Pins por **contenido** (D3): son el contrato de la feature, no un recuento que
caduque. Si G1 rechaza o rehace una pose, se enmienda esta tabla y el test, y el
leader reabre el gate solo para ese cambio.

| Pose | Bytes (nuevo) | sha256 nuevo (R2) | sha256 viejo (R2) | sha256 de la fuente PNG (R3) |
|---|---|---|---|---|
| wave | 42274 | `329e54a136e9d96a3567e39cc5aa128566723815a5b7cbdc86251d299ee66cec` | `66cd45cb7565be2d4364e705763710109b13a1ad1809a3711c23217026f5f306` | `d24100ccea224165cda2632db653551a6f7131379460e60c0306e9b0fcf68ddc` |
| wave-blink | 40048 | `573277aa19494e1645a6738195518743be97e3eb9b947d219f71e6b588cf6a35` | `a6a44b702e395517f1d7875600cc106455a9972fab14bf871e3c5f4c155b8549` | `4de88e6be17d9d2a342817b65688203f5a7f1f6a8fc5f393afa96babbc45777e` |
| talk | 40484 | `b0e292c12012c2d9468146d5ca8a436b3ea5017ab09db908756d50f950136014` | `af16821827af1d6ff432fd124e22d9c2121ce67c97c3c9d1335d4cda1ad275fb` | `ddf23c63c24f049c066f4413993f7d181e9ed62e3ac0108ae74c13d9a78c48bc` |
| walk | 38914 | `391db95f89c993be39263e8d81ddc8d899c2841aecf3436a4fb75895a7faba41` | `12c52706e7b5cc7124a0974e04834e5e5c6c96a0549bcaacbbef10766cac9687` | `a1f2e72a850f099c985aba55ea0e809137ec055fc9118ee4efd6f45203fe8d00` |
| celebrate | 45710 | `dc04b17c2141975dc7f94f891fceee027d35ea641752b911430e7e2a7899f2f7` | `b8e9745f73dedc6d72f89a588046a7440f32df4b2e9685e70fa96a2b70e3a254` | `a41f9391595cdb2b55c975a1544eba1fdd2b266e9ee13121ed44233ca038962e` |
| sleep | 25882 | `29c241fdfaf29f91b0468b6c4332e59ccabec3f9bf6f475d92dac4045669790e` | `e7fba39ad9c9d24c3520c82c26b2dc3055103f329b13a60715e15f6acba6938b` | `9929b377ffc90d53e3b392317768ca1a55a98cdef0d1a029d1dce85d428b1dca` |
| collar | 39430 | `e398800a813d36d2d2fc401dd298df41f72f856c253126ed98ff47b1fda8edc9` | `298e8a956c853a00b737ab05a0ba3497912cf7bf8f29f86d25bb515031d085b1` | `4fc777280109bcfa96dbc3ad1a30f53f2c9db2c506ea6c16bdb12292005bc820` |
| health | 43316 | `77dcf90cbcada5d500692b4fd1e3bd2507fcd52971584c7fa14035de507c84d8` | `bc02bf6f4b67ba2834847b5c9dac919b66df227e918502238e2e9fe5884f3ccc` | `2033fa59f8bbf0b4e3dafd64f99fc87cc5de592d282b3a18bccebbd8ddbd3b1a` |
| food | 42862 | `c7737dfe65188b16fb42f2e70ce59bfd6aec655d5c7cb3818c675d9ab5d93b13` | `da68c5bbbe82b2bcb448f6a12d7da77774adc261e75d356c747c0a9614fb483f` | `dd61cf8121382a41b87fd6b161207bf479b9df5b5943cda63c2410c8af748760` |
| clipboard | 41948 | `e2c3dec28c20ae6f45ae8fa488ba432f2da1c3d4d4f8a72645e6f9696d7e27f9` | `363e1f6502912709570d7448abf5a80f7ac42258957309a04f5733bf513eda28` | `74d31328a60ec053482dcc21f089074120a298aaef58436c8345e9e0b04c473b` |
| (referencia) | | | | `f280494ba7150945b07bfed5642fa52e3f8f7432766cf19404fbafbd65e88377` (`orbit-reference-a-sit.png`) |

Los «bytes» son informativos (el candado de tamaño es ≤ 100000 de R1). Los
sha256 «nuevo» se midieron con `pillow==13.0.0` en la VPS (Linux, x86-64); si en la
máquina del implementador el script da otros hashes, ver D2: **no se edita la
tabla**, se reporta y el leader re-mide.

## Tests existentes y qué cambia en cada uno

Verificado contra el árbol de `dev` por contenido. **Ninguno se modifica**: todos
asertan formato y tamaño o nombres, y el arte nuevo cumple lo mismo. Si uno falla al
sustituir los binarios, es un hallazgo: PARA y anótalo, no lo edites.

| Test | Qué fija sobre el arte | Cambio |
|---|---|---|
| `src/screens/welcome/index.test.tsx` | `it.each(['orbit-wave.webp','orbit-wave-blink.webp'])`: formato y tamaño; `no mete otras poses de Pingo (enmendado por #225 R2, R5)`: lista de las diez | ninguno |
| `src/components/__tests__/empty-state.test.tsx` (`#155 R2`) | seis poses por formato y tamaño; fuentes por regex | ninguno |
| `src/components/__tests__/celebration.test.tsx` | formato de `orbit-celebrate.webp` (el `it` conserva el título histórico `pingo-celebrate.webp…`) | ninguno; no renombrar el título (rompe trazabilidad) |
| `src/components/__tests__/empty-state-hero.test.tsx` | usa `pose="talk"` y no nombra el arte | ninguno |
| `src/__tests__/orbit-activity-pose.test.ts` (#225 R5) | formato de `orbit-walk.webp`; congela el **maestro viejo** `specs/mobile-orbit-activity-pose/design-src/mascot-11-walk.png` y su prompt | ninguno; ese maestro queda como historia |
| `src/__tests__/orbit-rename.test.ts` (#225 R2) | sin `/pingo/i` en los nombres de imagen; nombres existen; todo `require(...webp)` resuelve | ninguno |
| `src/__tests__/orbit-rename-copy.test.ts` (#221) | copy visible | ninguno |
| `src/__tests__/orbit-charter-voice.test.ts` | literales del punto 7 de la carta | ninguno (R6) |
| `src/__tests__/design-drift.test.ts` | solo cita `components/orbit-float.tsx` en una lista de ficheros; sin candado de imágenes | ninguno |
| `app.assets.test.ts`, `app.config.test.ts` (#101, #115 R10) | geometría de icono, splash y notificación | ninguno (R7) |

Ningún texto de `docs/` ni de `mobile-pet-tracker/src/` describe el aspecto viejo:
`git grep -nIiE "antena|antenna|gorro|robot|chest button"` sobre `docs`,
`mobile-pet-tracker/src`, `README.md` y `AGENTS.md` da 0 resultados (verificado el
2026-11-06). La única documentación que cambia es la Enmienda #243 de R6.

## Fuera de alcance

- **Icono, splash y notificaciones.** `icon.png`, `splash-icon.png` (que también se
  pinta en `src/app/index.tsx`, `testID="splash-logo"`, 120 × 120),
  `android-icon-foreground.png`, `android-icon-monochrome.png`, `favicon.png`,
  `pet-tracker-notification-96.png`, `pet-tracker-notification-color-96.png`,
  `pet-tracker-app-icon.png`, `logo-glow.png` y `assets/expo.icon/` siguen con la
  cabeza del robot. El PNG del icono de Orbit es G6, del humano. Hasta que exista
  una feature de seguimiento, el splash y el icono mostrarán la mascota vieja
  (R7, D4).
- **Poses nuevas** (`worried`, `search`): no se generan ni se añaden. R1 lo impide.
- **Renombrar identificadores**: ya son `orbit` desde #225.
- **Landing** (`hosting/`): no contiene arte de la mascota y todavía dice «Pingo».
  Sin cambios.
- **Reescalar o recentrar** ninguna pose (D5), en particular `sleep`.
- **Cambiar copy visible, etiquetas de accesibilidad o claves del catálogo.** El arte
  es el mismo contrato visual (`Orbit caminando`, etc.).
- **Animaciones** (`OrbitFloat`, parpadeo de Bienvenida): sin cambios de código.
- **Reescribir las enmiendas fechadas** de la carta o el maestro viejo de #225.
- **Instalar dependencias del proyecto**: ni `package.json` ni `bun.lock` cambian.

## Decisiones

- **D1. Herramienta de conversión: `uvx --with pillow==13.0.0 python -I`.** Verificada
  en la VPS: genera VP8X con alfa, 1024², entre 32 y 46 KB, y es el mismo precedente
  que #225 (§Conversión). Es de uso único y de desarrollo: no entra en
  `package.json`, `bun.lock` ni CI. Descartados `sharp-cli` (bunx denegado en este
  entorno, sin precedente) y `cwebp` (no instalado).
- **D2. Determinismo.** Con la versión de Pillow fijada y `quality=80, method=6` la
  salida fue idéntica en tres corridas independientes. Si el implementador obtiene
  otros hashes, PARA, no toca la tabla, deja el hash que obtuvo en su reporte y el
  leader re-mide y enmienda el pin. No hay test de jest que lance Python.
- **D3. Los pins son por contenido, no por conteo.** La tabla fija ficheros y
  hashes; no hay cifras agregadas («diez ficheros») fuera de la lista nombrada, que
  caducaría si se añadiera una pose futura (esa feature enmienda R1 a propósito).
- **D4. Icono, splash y notificaciones quedan fuera.** Son G6 (humano) y su geometría
  tiene candados propios. Consecuencia que el humano acepta al firmar: hasta la
  feature de seguimiento, el splash de arranque y el icono mostrarán el robot viejo,
  y Bienvenida el cachorro. Se recomienda registrar esa feature.
- **D5. `sleep` se reescala al 82 % y es la única.** La fuente generada por Codex
  ocupaba 960 px de ancho (márgenes 29 y 35 px), un 23 % más que las demás poses
  (≈ 780 px), y en `EmptyState` (160 / 190) se habría visto desproporcionada junto a
  `talk` o `clipboard`. El humano delegó la decisión en el leader (2026-11-06) y la
  fuente `design-src/orbit-sleep.png` es la original reescalada con Lanczos al 82 %
  alrededor del centro de su silueta (ancho 788 px, márgenes 114, 274, 122 y 275 px),
  con `specs/mobile-orbit-cachorro-art/rescale-sleep.py`
  (`uvx --with pillow==13.0.0 python -I … <entrada> <salida> 0.82`). El original sin
  reescalar queda fuera del repo, en `~/pet-tracker-mascot/v2/poses/pingo-sleep.png`.
  Ninguna otra pose se reescala ni se recentra. El script de conversión sigue
  exigiendo un margen ≥ 24 px.
- **D6. La enmienda de la carta (G4) es una sección nueva y separada.** El punto 7 de
  la carta no se toca (lo fija `orbit-charter-voice.test.ts`). Todo encabezado `##`
  posterior a la Enmienda #195 debe empezar por `## Enmienda #`
  (`home-photo-hero-canvas.test.ts`), de ahí el título. Como el texto lo firma el
  humano, se teclea **después** de la firma (fe de erratas E1 de #225: la enmienda
  toca un fichero de test).
- **D7. Bienvenida: `wave` y `wave-blink` no están registradas entre sí.** El guiño
  tiene otra cabeza y otro parche, y `screens/welcome` las superpone con opacidad
  0 a 1. El salto es visible. Esta feature no cambia código: el humano lo ve en el
  smoke G2 (paso 2). Si lo rechaza, se regenera el par `wave-blink` y se reabre G1
  para esa pose.
- **D8. El nombre sigue siendo Orbit.** «Pingo» se conserva solo como historia en
  la enmienda y en el §Mapa de nombres de #225.
- **D9. La cadena no incluye un test de pixeles.** Jest no decodifica WebP y el
  proyecto no añade dependencias (D1). La comprobación de alfa y márgenes es la
  lectura de vuelta del script (R4) y el pin (R2).

## Smoke G2 (para `progress/smoke_ui.md`)

En el dev build Android ya instalado, sin rebuild (solo cambian imágenes del bundle),
con Metro de la rama, dentro del smoke en lote al final del plan, en claro y en
oscuro:

1. Bienvenida: Orbit saluda (`wave`) a 220 y el guiño (`wave-blink`) lo reemplaza sin
   recortes ni fondo blanco alrededor.
2. Bienvenida, el parpadeo: anota si el cambio de `wave` a `wave-blink` salta de
   forma molesta (D7). Sí/no.
3. Inicio con ≥ 100 m hoy: burbuja con Orbit andando (`walk`) a 56 dp. Con < 100 m:
   burbuja con `talk`. Nítido a 56 dp: se reconoce un cachorro.
4. Iniciar sesión (`wave`), registro y restablecer contraseña (`clipboard`),
   recuperar contraseña (`talk`).
5. Emparejamiento y unirse a mascota (`collar`), alimentación y cuestionario
   (`food`), todos los estados vacíos (`talk`, `sleep`, `clipboard`, `health`,
   `collar`, `food`) y la celebración (`celebrate`).
6. En ningún sitio aparece ya el robot con antena, el gorro verde o la cara morada,
   salvo el splash de arranque y el icono (D4); ninguna imagen falta ni se ve con el
   halo blanco o gris de un alfa mal limpiado; `sleep` no se recorta por los lados.

## Aprobación

- [x] Firmada por el leader con la firma delegada (mandato 2026-10-26 UI), tras la
  checklist de `progress/plan_canvas-parity-2026-10-23.md` §4 y los tres puntos de
  `progress/plan_ui-2026-10-26.md` §4 (fecha: 2026-11-06)
- [x] G1: arte final aprobado por el humano, los diez PNG de `design-src/` con los
  sha256 de §Constantes, y el copy sin cambios (humano; fecha: 2026-11-06; fuente: su
  mensaje en la sesión de Frontend, cuenta alexfdgf32@gmail.com, «G1 ok»; el mismo
  mensaje autoriza el reescalado de `sleep`, D5)
- [x] G4: enmienda de `docs/ui-guidelines.md` aprobada por el humano, con el literal
  de design.md §4 (humano; fecha: 2026-11-06; fuente: su mensaje en la sesión de
  Frontend, cuenta alexfdgf32@gmail.com, «apruebo G4»; lo registra el leader)
- [ ] Smoke G2 en dispositivo, pasos 1–6, claro y oscuro (humano; fecha: ____)

G6 (PNG del icono de Orbit) **no** es una casilla de esta feature: queda fuera (D4).

#243 se implementa entera (C1 a C5 de tasks.md) y se mergea en `dev` con las tres
primeras casillas firmadas y el veredicto «aprobado» del `reviewer` sobre R1–R7. Queda `spec_ready`, no `done`, hasta que estén
cerradas las cuatro.
