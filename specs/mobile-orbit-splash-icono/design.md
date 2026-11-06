---
feature: "mobile-orbit-splash-icono"
tags: [mobile, ui, mascota, orbit, assets, icono, splash, design]
---

# Diseño — [[mobile-orbit-splash-icono]] (#244)

> Decisiones D1 a D15 en [[requirements]] §Decisiones. Aquí está el cómo: ficheros,
> el script de conversión, los tests, el `icon.json`, el literal de la enmienda y las
> mutaciones. Codex no tiene acceso a la conversación que originó esta spec; todo lo
> que necesita está en estos cuatro ficheros.

## 1. Ficheros afectados

**Assets (R1, R2, R8, R11)** — rutas relativas a `mobile-pet-tracker/assets/`
- Se sobrescriben, bajo el mismo nombre, los siete PNG de `images/`: `icon.png`,
  `android-icon-foreground.png`, `android-icon-monochrome.png`, `splash-icon.png`,
  `favicon.png`, `pet-tracker-notification-96.png`,
  `pet-tracker-notification-color-96.png`. Los escribe el script, no se tocan a mano.
- Nuevo `expo.icon/Assets/orbit.png` (lo escribe el script).
- Se reescribe `expo.icon/icon.json` (§4).
- Se borran con `git rm`: `expo.icon/Assets/expo-symbol 2.svg`,
  `expo.icon/Assets/grid.png`, `images/pet-tracker-app-icon.png` y
  `images/pet-tracker-notification-monochrome-original.png`.
- **No se tocan:** las diez `images/orbit-*.webp`, `images/logo-glow.png` y cualquier
  otro fichero de `assets/` (R11).

**Scripts**
- Se borra `mobile-pet-tracker/scripts/make-icons.mjs` (pipeline `jimp` del arte del
  robot, sin ninguna referencia viva: D13). Si `scripts/` queda vacío, git ya no lo
  lista; no hay nada más que borrar.

**Spec (ya en el repo, no se tocan)**
- `specs/mobile-orbit-splash-icono/convert-orbit-icons.py` (§2) y las tres fuentes de
  `specs/mobile-orbit-splash-icono/design-src/` (R3). Son herramientas y datos de
  desarrollo, no código de la aplicación.

**Tests (R1 a R8, R10)**
- Nuevo `mobile-pet-tracker/src/__tests__/orbit-brand-assets.test.ts` (§3.1): R1, R2,
  R3, R8 y, al final, R10.
- `mobile-pet-tracker/app.assets.test.ts` (§3.2): se añade el helper `readPixels`,
  `readAlpha` pasa a delegar en él, se **sustituye** un `it` (D10) y se añaden los
  `it` de R5, R6 y R7.

**Docs (R10, tras G4)**
- `docs/ui-guidelines.md`: se añade al final la sección del §5. No se edita nada más.

**No se tocan:** `mobile-pet-tracker/src/` fuera de tests, `app.json`,
`app.config.test.ts`, `app.config.ts`, `package.json`, `bun.lock`, `hosting/`, `STATUS.md`
y `docs/` salvo `ui-guidelines.md`.

## 2. Conversión y verificación (R1, R3, R4)

### Script

`specs/mobile-orbit-splash-icono/convert-orbit-icons.py` ya está en el repo (115
líneas, 5342 bytes, sha256 en requirements.md §Constantes). **No lo edites ni lo
reformatees**: los hashes de R1 salen de esta versión exacta y R3 lo fija por sha256.
Resumen de lo que hace, para que el reviewer lo audite sin reabrirlo:

1. Lee `design-src/orbit-icon.png` (RGB), `orbit-icon-fg.png` y `orbit-splash.png`
   (RGBA), los tres de 1024², y aborta con `assert` si el modo o el tamaño difieren.
2. `fg` = `orbit-icon-fg.png` con la **limpieza de alfa** (`< 16` a 0, `≥ 252` a 255).
3. `mono` = blanco puro con el alfa de `fg` multiplicado por una máscara que deja hueco
   donde la luminancia de `fg` es `< DARK_CUTOFF` (60): ojos, nariz y boca.
4. `splash` = `orbit-splash.png` limpiado, reducido a 799 × 799 con Lanczos, pegado en
   (116, 109) de un lienzo transparente de 1024² y limpiado de nuevo.
5. `icon.png` = `orbit-icon.png` convertido a RGBA; `favicon.png` = ese icono a
   48 × 48 con Lanczos.
6. Notificaciones: se recorta la caja del alfa de `mono` (y de `fg` para la de color),
   se ajusta a 88 px de ancho con Lanczos y se centra en 96 × 96.
7. Guarda los siete PNG en `<destino>/images/` y `fg` también como
   `<destino>/expo.icon/Assets/orbit.png`.
8. Lectura de vuelta: imprime una fila por fichero (`fichero tamaño modo bytes sha256
   caja radio alfaMín ok|FALLA`) y sale con código 1 si alguna es `FALLA`.

### Cómo se ejecuta

Todo desde la raíz del repo (`cd /home/claude/sites/Pet-Tracker-wt-244`).

1. **Primero a un directorio temporal**, para comparar con R1 sin tocar el repo:
   `mkdir -p /tmp/orbit-icons-out && uvx --with pillow==13.0.0 python -I specs/mobile-orbit-splash-icono/convert-orbit-icons.py /tmp/orbit-icons-out; echo "exit=$?"`
   (sin `| tail`: con un pipe el código de salida es el del último comando).
2. Salida esperada: la cabecera, ocho líneas `ok` y `exit=0`. Tras el nombre y
   `(ancho, alto) RGBA`, cada línea trae estos valores (bytes, sha256, caja, radio,
   alfa mín.); los hashes son los de §Constantes («sha256 nuevo»):

   | fichero | bytes | caja del alfa | radio | alfa mín. |
   |---|---|---|---|---|
   | icon.png | 586918 | (0, 0, 1024, 1024) | 723.4 | 255 |
   | android-icon-foreground.png | 384993 | (183, 233, 841, 792) | 329.1 | 16 |
   | android-icon-monochrome.png | 29443 | (183, 233, 841, 792) | 329.1 | 16 |
   | splash-icon.png | 410234 | (216, 190, 815, 826) | 335.2 | 16 |
   | favicon.png | 3539 | (0, 0, 48, 48) | 33.2 | 255 |
   | pet-tracker-notification-96.png | 4687 | (4, 10, 92, 85) | 45.0 | 1 |
   | pet-tracker-notification-color-96.png | 12946 | (4, 10, 92, 85) | 45.0 | 1 |
   | orbit.png | 384993 | (183, 233, 841, 792) | 329.1 | 16 |

3. Solo si los **ocho** hashes coinciden, ejecuta **sin argumento** (escribe en
   `mobile-pet-tracker/assets/`) y comprueba además
   `sha256sum mobile-pet-tracker/assets/images/{icon,android-icon-foreground,android-icon-monochrome,splash-icon,favicon,pet-tracker-notification-96,pet-tracker-notification-color-96}.png mobile-pet-tracker/assets/expo.icon/Assets/orbit.png`
   contra la misma tabla.
4. Si un hash difiere: PARA. No edites la tabla ni el test (D2). Anota en
   `progress/impl_mobile-orbit-splash-icono.md` los ocho hashes obtenidos y la salida de
   `uv --version` y de `uvx --with pillow==13.0.0 python -I -c "import PIL; print(PIL.__version__)"`.
   Si `uvx` no existe o no hay red, PARA y repórtalo (no instales nada).

El script no es una dependencia del proyecto: `uvx` crea un entorno aislado y
desechable; `python -I` impide que `import` recoja ficheros del directorio actual.

### Por qué cada decisión del script (para el reviewer)

- **Radio de la zona segura 338 (D6, D14).** El launcher de Android enmascara el icono
  adaptativo con círculo, cuadrado redondeado o gota; solo el círculo central de 66 %
  del lienzo se ve siempre. Android 12 enmascara además el icono del splash con un
  círculo de dos tercios del lienzo. Con el mismo 338 se cubre lo uno y lo otro.
- **Splash a 799 px (D14).** La fuente dibuja a Orbit a 1011 × 1000 px dentro de 1024²:
  su radio máximo es 708.5 px frente a los 338 de la zona segura. Hay que reducirlo, no
  recortarlo. 799 con el pegado en (116, 109) es el valor que midió el autor (radio
  335.2, caja dentro de [174, 850)); el script lo comprueba en la lectura de vuelta.
- **Recorte oscuro (D7).** Un monocromo lleno sería una mancha. Con 60 de luminancia,
  los ojos, la nariz y la boca salen como hueco (21940 píxeles medidos, 1309 de ellos
  sombra en el borde de las orejas) y el parche, el collar y el pelo (más claros que
  60) se mantienen. Es una zona ciega de jest (D9).
- **Notificación de 88 px (R7).** Android pinta las notificaciones a 24 dp; el icono
  de 96 px con 4 px de margen evita que el recorte del sistema muerda el alfa.

## 3. Los tests

Jest corre desde `mobile-pet-tracker/` con `bunx jest <ruta>`. Ninguna ruta lleva
paréntesis. **Ningún test importa un módulo de producción** y todo valor esperado es un
literal del propio test (regla de candados no tautológicos).

### 3.1 `src/__tests__/orbit-brand-assets.test.ts` (nuevo)

Estilo de `src/__tests__/orbit-cachorro-art.test.ts`: `jest.requireActual` de `fs`,
`path` y `crypto` (sin imports de módulos de producción), `assetsRoot =
join(process.cwd(), 'assets')`, `specRoot = join(process.cwd(), '..', 'specs',
'mobile-orbit-splash-icono')`, `charterPath = join(process.cwd(), '..', 'docs',
'ui-guidelines.md')`. Un helper local `sha256(path)` y `statSync` para el recorrido.
**No escribas la palabra prohibida por `orbit-rename.test.ts` `#225 R4` (D11) en
ninguna línea de código ni de literal de este fichero.**

Constantes literales:

- `NEW_SHA`: `{ 'images/icon.png', 'images/android-icon-foreground.png',
  'images/android-icon-monochrome.png', 'images/splash-icon.png',
  'images/favicon.png', 'images/pet-tracker-notification-96.png',
  'images/pet-tracker-notification-color-96.png', 'expo.icon/Assets/orbit.png' }` con
  los ocho «sha256 nuevo» de §Constantes.
- `OLD_SHA`: los **once** «sha256 viejo»: los siete de los PNG de marca viejos y los
  cuatro de `pet-tracker-app-icon.png`, `pet-tracker-notification-monochrome-original.png`,
  `expo-symbol 2.svg` y `grid.png`.
- `LOGO_GLOW_SHA`: el de §Constantes.
- `SOURCE_SHA`: `{ 'orbit-icon.png': { sha, colorType: 2 }, 'orbit-icon-fg.png':
  { sha, colorType: 6 }, 'orbit-splash.png': { sha, colorType: 6 } }`.
- `SCRIPT_SHA` y `RETIRED`: los cinco ficheros retirados (cuatro de `assets/` y
  `scripts/make-icons.mjs`; este último relativo a `process.cwd()`).

Los `it` (los títulos son literales; [[traceability]] los cita):

| `it` | Qué asierta | Nace |
|---|---|---|
| `#244 R1: cada PNG de marca tiene el sha256 del arte de Orbit` (`it.each`, ocho filas) | `existsSync(<ruta>)` es `true` **antes** de leer y `sha256(<ruta>) === NEW_SHA[<clave>]` | **rojo** (siete filas por sha; la de `orbit.png` por `existsSync`) |
| `#244 R1: logo-glow.png no cambia` | `sha256(images/logo-glow.png) === LOGO_GLOW_SHA` | verde |
| `#244 R2: ningún fichero de assets conserva el arte del robot` | recorrido **recursivo** de `assetsRoot` (`readdirSync` con `statSync` para entrar en subdirectorios; fuentes incluidas): ningún `sha256` pertenece a `Object.values(OLD_SHA)` | **rojo** |
| `#244 R2: el fichero retirado ya no existe` (`it.each`, cinco filas) | `existsSync(ruta) === false` | **rojo** |
| `#244 R3: las fuentes PNG están congeladas` (`it.each`, tres filas) | `sha256` coincide; firma PNG (`89 50 4E 47 0D 0A 1A 0A`); `IHDR` en 12..16; ancho y alto 1024 (`readUInt32BE(16)` y `(20)`); byte 25 igual al `colorType` de la fila | verde |
| `#244 R3: el script de conversión es el de la spec` | `existsSync` a `true`; `sha256(script) === SCRIPT_SHA`; contiene las cadenas `pillow==13.0.0`, `SAFE_RADIUS = 338`, `SPLASH_SCALE = 799` y `DARK_CUTOFF = 60` | verde |
| `#244 R8: icon.json compone solo a Orbit sobre el violeta de marca` | `JSON.parse(readFileSync(icon.json))` `toEqual` el literal de §4 | **rojo** |
| `#244 R8: expo.icon/Assets contiene solo orbit.png` | `readdirSync(join(assetsRoot, 'expo.icon', 'Assets')).sort()` `toEqual(['orbit.png'])` | **rojo** |
| `#244 R10: la carta lleva la Enmienda #244 una sola vez, con la marca de Orbit` | ver abajo | se añade en C4 (rojo) |

Nota sobre `it.each` y R1: las claves usan `/` como separador y `join(assetsRoot,
...clave.split('/'))`; no hay rutas con espacios. `expo-symbol 2.svg` (con espacio) solo
aparece en `RETIRED`, donde se usa `join` con el segmento literal.

El `it` de R10 (se escribe en C4, tras la firma de G4; nace rojo):

- `charter.split('## Enmienda #244 — ').length - 1` es 1. El cuerpo de la sección es lo
  que va hasta el siguiente `\n## ` o el final del fichero.
- El cuerpo contiene los literales: `Orbit`, `icono adaptativo`, `splash`, `radio 338`,
  `#9460FC`, `Enmienda #243` y `rebuild`.
- El cuerpo coincide con `/- \[[ xX]\] Enmienda #244 aprobada por humano/`.
- Todo encabezado `^## ` posterior a la sección coincide con `^## Enmienda #`.
- No compares el texto completo: el humano puede ajustar una palabra al firmar.

### 3.2 `app.assets.test.ts` (edición, R5, R6, R7, D10)

Ficheros: solo `mobile-pet-tracker/app.assets.test.ts`.

1. **Helper `readPixels(relativePath)`**: devuelve `{ width, height, at(x, y) → [r, g,
   b, a] }`. Es la decodificación de `readAlpha` (mismas aserciones `[bitDepth,
   colorType, entrelazado] = [8, 6, 0]`, mismo desfiltrado), extraída. `readAlpha`
   pasa a ser `const { at } = readPixels(p); return (x, y) => at(x, y)[3];`. Los
   `it` que ya usan `readAlpha` no cambian.
   Los PNG que escribe Pillow son RGBA de 8 bits sin entrelazar: la decodificación de
   `readAlpha` ya vale para ellos.
2. **Helper `outsideSafeCircle(at, width, height)`**: cuenta los píxeles con alfa > 0
   para los que `(2x + 1 − 1024)² + (2y + 1 − 1024)² > 676²`, con números enteros (la
   prueba exacta del glosario; no uses `Math.hypot` ni flotantes). `1024` y `676` son
   literales del test, no se derivan de la lectura.
3. **Sustitución (D10).** En `describe('#115 R10: el splash es la mascota sola sobre
   transparente')` se quita el `it` `la punta del pin es transparente` y se añade en
   su lugar el de R5 con el título
   `#244 R5: toda la mascota del splash cabe en el círculo de radio 338`. Los otros
   tres `it` de ese `describe` no cambian.
4. **`it` nuevos** (en un `describe('#244 R5, R6, R7: arte de marca de Orbit')` al final
   del fichero):

   | `it` | Qué asierta | Nace |
   |---|---|---|
   | `#244 R5: la mascota de android-icon-foreground.png y de android-icon-monochrome.png cabe en el círculo de radio 338` (`it.each`, dos filas) | `outsideSafeCircle(...)` es 0 | fila foreground **rojo** (98060); fila monocromo verde |
   | `#244 R6: icon.png y favicon.png no tienen ni un píxel con alfa menor que 255` (`it.each`, dos filas) | el número de píxeles con alfa < 255 es 0 | verde |
   | `#244 R7: el monocromo y la notificación 96 solo tienen píxeles blancos` (`it.each`, dos filas) | todo píxel con alfa > 0 tiene `r = g = b = 255` | verde |
   | `#244 R7: las dos notificaciones dejan 4 px de margen` (`it.each`, dos filas) | caja del alfa a ≥ 4 px de cada borde de 96 × 96 | verde |
   | `#244 R7: la notificación en color conserva su color` | al menos 1000 píxeles con alfa > 0 y no blancos | verde |

   Para las filas de `it.each` usa los nombres de fichero literales de requirements.md
   §Glosario. Cada `it` verde es un candado de regresión (M5, M6, M7, M8); el rojo de la
   cadena está en R1, R2, R5-splash, R5-foreground y R8.

### 3.3 Qué no se prueba y por qué

- El **contenido** de los PNG (el recorte oscuro, la limpieza de alfa, el escalado):
  jest ve geometría y color, no la intención. Solo lo fijan el sha256 de R1 y la lectura
  de vuelta del script (D9, M2, M3).
- El **render** (launcher con máscara, splash en frío, notificación tintada, iOS): lo
  cubre el smoke G2, tras el rebuild G3.
- Que el script produzca esos hashes **en cualquier máquina**: no hay test de jest con
  Python (D2); lo comprueba el reviewer con el comando de §2.

## 4. `icon.json` literal (R8)

`mobile-pet-tracker/assets/expo.icon/icon.json` debe quedar con **este** contenido (el
test compara el JSON parseado; el formato de espacios no importa, pero conserva el
estilo de Icon Composer: dos espacios y ` : ` entre clave y valor, como el fichero
actual):

```json
{
  "fill" : {
    "automatic-gradient" : "extended-srgb:0.58039,0.37647,0.98824,1.00000"
  },
  "groups" : [
    {
      "layers" : [
        {
          "image-name" : "orbit.png",
          "name" : "orbit"
        }
      ],
      "shadow" : {
        "kind" : "neutral",
        "opacity" : 0.5
      },
      "translucency" : {
        "enabled" : true,
        "value" : 0.5
      }
    }
  ],
  "supported-platforms" : {
    "circles" : [
      "watchOS"
    ],
    "squares" : "shared"
  }
}
```

`0.58039, 0.37647, 0.98824` son `0x94/255`, `0x60/255` y `0xFC/255` (`#9460FC`) con cinco
decimales. La capa no lleva `position`: el PNG ya viene centrado (D8). Lo que no se
puede verificar aquí es cómo lo pinta Xcode (iOS, #60 aparcada): riesgo declarado.

## 5. Literal de la Enmienda #244 (R10, gate G4)

Es el texto que el humano firma. Se añade **al final** de `docs/ui-guidelines.md`,
precedido de una línea en blanco. No se reescribe el punto 7 ni ninguna enmienda
anterior. `Fecha:` lleva la del commit. **No contiene la palabra «Pingo»** (D11): no la
añadas.

```markdown
## Enmienda #244 — El icono y el splash son de Orbit

Fecha: <la del commit>. Feature #244 `mobile-orbit-splash-icono`. Cierra el punto 4
(«Pendiente») de la Enmienda #243; no cambia ninguna regla de pantalla.

1. **Marca.** El icono de la app, el icono adaptativo de Android (primer plano y
   monocromo), el splash, el favicon, los dos iconos de notificación y
   `assets/expo.icon/` muestran a Orbit, el cachorro de la Enmienda #243. Ningún
   asset de marca dibuja ya la cabeza del robot.
2. **Icono.** Orbit de frente sobre el violeta de marca `#9460FC`, 1024 × 1024 y sin
   transparencia. El icono adaptativo usa el mismo fondo plano `#9460FC` y el
   primer plano es solo Orbit.
3. **Zona segura.** Todo píxel visible del icono adaptativo y del splash cae dentro
   de un círculo de radio 338 px sobre un lienzo de 1024 px (66 % del lienzo): lo
   que no recortan el launcher de Android ni la máscara circular del splash de
   Android 12. El splash se pinta con `imageWidth` 200 sobre `#9460FC`.
4. **Monocromo y notificaciones.** El monocromo y la notificación son siluetas
   blancas de Orbit con los ojos, la nariz y la boca como hueco. La notificación
   solo aporta el alfa: Android la tiñe con `#9460FC`.
5. **Fuentes.** Las tres fuentes aprobadas y el script que las convierte viven en
   `specs/mobile-orbit-splash-icono/` y están congeladas por sha256. Los ocho PNG
   salen del script; no se retocan a mano.
6. **Rebuild.** Icono, splash, favicon y notificaciones son nativos: no viajan por
   Metro ni por OTA, y exigen un rebuild del dev build para verse.

Detalle y tests en `specs/mobile-orbit-splash-icono/requirements.md` (R1 a R11).

- [ ] Enmienda #244 aprobada por humano
```

La Enmienda #243 queda como historia: su punto 4 sigue diciendo «Pendiente» y la #244
lo cierra por referencia.

## 6. Mutaciones a plantar (reviewer)

Cada una se planta sobre el verde final, se corre lo indicado y se revierte
(`git checkout HEAD -- <ruta>` y `git diff --cached` en 0). «Zona ciega» marca las que
jest no ve y solo cazan el sha256 o la lectura de vuelta del script.

| # | Mutación | Debe ponerse rojo |
|---|---|---|
| M1 | Restaurar el `splash-icon.png` viejo (`git show <H0>:mobile-pet-tracker/assets/images/splash-icon.png > …`) | R1 (fila splash), R2 (arte del robot) y R5 (círculo del splash) |
| M2 | Reconvertir el primer plano **sin** `clean` (`cleaned(fg_src)` por `fg_src.convert('RGBA')`) y copiarlo como `android-icon-foreground.png` | **zona ciega**: R1 (fila) y, en el script, `FALLA` por alfa mín. 1; R5 no lo ve (la fuente cabe en el círculo) |
| M3 | Poner `DARK_CUTOFF = 0` en una copia del script y regenerar el monocromo | **zona ciega**: R1 (fila monocromo); R3 también si se edita el script del repo |
| M4 | Poner `SPLASH_SCALE = 830` (radio > 338), o reescalar el primer plano a 1100 px | R5 (círculo, fila afectada), R1 y R3 |
| M5 | Hacer transparente un píxel de la esquina de `icon.png` | R6 (fila icon), R1 |
| M6 | Pintar de gris un píxel visible del monocromo | R7 «solo blancos», R1 |
| M7 | Reemplazar `pet-tracker-notification-96.png` por una versión sin margen (perro a 96 px de ancho) | R7 «margen», R1 |
| M8 | Copiar el monocromo blanco como `pet-tracker-notification-color-96.png` | R7 «conserva su color», R1 |
| M9 | Restaurar `grid.png` o `expo-symbol 2.svg` bajo `expo.icon/Assets/` | R2 (arte del robot / fichero retirado) y R8 (listado) |
| M10 | Añadir una segunda capa a `icon.json` o cambiar `image-name` | R8 (JSON) |
| M11 | Cambiar el color del relleno de `icon.json` (por ejemplo a `0.00000,0.47843,1.00000,1.00000`) | R8 (JSON) |
| M12 | Cambiar un byte de un PNG de `design-src/` | R3 «fuentes congeladas» |
| M13 | Cambiar `SAFE_RADIUS = 338` por `340` en el script del repo | R3 «script» |
| M14 | Copiar el `icon.png` viejo con otro nombre (`assets/images/icon-old.png`) | R2 (el recorrido recursivo ve el sha256 viejo) |
| M15 | Tocar un byte de `logo-glow.png` | R1 «logo-glow no cambia» |
| M16 | Borrar `expo.icon/Assets/orbit.png` | R1 (fila `orbit.png` por `existsSync`) y R8 (listado) |
| M17 | Cambiar `imageWidth` de 200 a 220 en `app.json` | `app.config.test.ts` y la guarda de R9 |
| M18 | Duplicar la sección `## Enmienda #244` en la carta | R10 «una sola vez» |
| M19 | Insertar `## Notas` (sin `Enmienda #`) después de la enmienda | R10 (encabezados posteriores) |
| M20 | Quitar «radio 338» del cuerpo de la enmienda | R10 (literal) |
| M21 | Tocar un fichero de `src/` que no sea test (por ejemplo `src/app/index.tsx`) | la guarda de R9 (tasks.md §Guardas finales), no un test de jest |
| M22 | Restaurar `scripts/make-icons.mjs` | R2 «el fichero retirado ya no existe» |

M2 y M3 son las mutaciones en zona ciega: jest no distingue «bien recortado» de «mal
recortado» dentro de la silueta; el candado es el pin de bytes. Plantarlas confirma que
el pin mira donde los demás candados no.

## 7. Alternativas descartadas

- **Embeber el script en design.md** (como #243): 115 líneas y nueve constantes copiadas
  a mano son una fuente de error; el fichero con su sha256 (R3) no la tiene.
- **`jimp` desde `make-icons.mjs`**: es el pipeline del arte viejo, sin determinismo
  fijado; lo reemplaza el script de Pillow (D13).
- **Un test de jest que lance Python**: CI no tiene `uv` (D2).
- **Decodificar con una librería de píxeles**: no hace falta, `zlib` decodifica el PNG
  (R5 a R7) y no hay dependencia nueva.
- **Monocromo como silueta llena**: un perro sin cara; se elige el recorte oscuro (D7)
  y queda `DARK_CUTOFF = 0` como remedio si el smoke lo ve ruidoso.
- **`fill` `solid` en `icon.json`**: una clave que nadie del proyecto ha probado frente
  a `automatic-gradient`, que ya es del andamiaje (D8).
- **Sustituir también `logo-glow.png`**: un destello sin mascota que no se usa (D12).
- **Mantener `pet-tracker-app-icon.png` con el icono nuevo**: un duplicado de
  `icon.png` (D13).
- **Dejar el splash sin reescalar**: 196775 píxeles quedarían fuera de la zona segura
  y Android 12 los recortaría (D14).
- **Enmendar el punto 4 de la Enmienda #243**: se enmienda con una sección nueva que lo
  cierra (D15), como mandan los tests de encabezados.
- **Pin solo por tamaño en bytes**: dos conversiones distintas pueden coincidir en
  tamaño; el sha256 no.

## 8. Lecciones de la memoria que rigen este diseño

- **Candado que escanea todos los ficheros** (Enmienda 1 de #243,
  `orbit-rename.test.ts` `#225 R4`): auditado en requirements.md §Tests existentes
  (grupo B); el test nuevo no nombra la palabra prohibida.
- **Constantes congeladas** (`constantes-congeladas-en-specs`, `lo-que-se-desplaza-no-es-ancla`):
  se ancla por contenido (hashes, nombres), no por líneas ni recuentos.
- **Candados tautológicos** (`candados-tautologicos`): `OLD_SHA`, `NEW_SHA`, `1024` y
  `676` son literales del test; nada se importa de producción ni se deriva de lo que se
  prueba.
- **Mutación en zona ciega** (`prueba-de-mutacion-en-zona-ciega`): M2 y M3.
- **Filas que nacen verdes** (`filas-que-nacen-verdes-por-requisito-previo`): R1
  `logo-glow`, R3, R5-monocromo, R6 y R7 nacen verdes y la spec lo dice; el rojo de la
  cadena está en R1, R2, R5-splash, R5-foreground y R8.
- **Casilla tolerante** (`casilla-de-enmienda-tolerante`): `[ xX]`.
- **Jest y paths con paréntesis** (`jest-paths-con-parentesis`): los comandos de
  tasks.md no llevan `(` ni `)`.
- **Anclas negativas** (`anclas-negativas-en-specs`): «ningún fichero conserva el arte
  viejo» se prueba con la mutación M14 (copia con otro nombre) y M9/M22.
- **Orden de `.sort()`** (`orden-sort-a-mano-en-specs`): en R8 solo hay un nombre; en la
  guarda de R11 el orden es el de `LC_ALL=C sort`.
- **Handoff** (`handoff-diff-contra-head-del-handoff`, `handoff-anclas-sin-grep`,
  `handoff-cwd-explicito-y-error-de-invocacion`, `handoff-cabeceras-ejecutadas-como-comando`,
  `codex-lanza-init-sh-por-agents-md`): tasks.md trae `cd` literal, anclas con salida
  esperada, ninguna cabecera que empiece por `#` dentro de una cadena y la prohibición
  de `init.sh`.
- **Skills expo en Codex** (`B5`): este trabajo no toca pantallas ni componentes. Skills
  de Codex a nombrar en el handoff: **ninguna**.
