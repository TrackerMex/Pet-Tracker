---
feature: "mobile-orbit-cachorro-art"
tags: [mobile, ui, mascota, orbit, assets, design]
---

# Diseño — [[mobile-orbit-cachorro-art]] (#243)

> Decisiones D1 a D9 en [[requirements]] §Decisiones. Aquí está el cómo: ficheros,
> el script de conversión, el test nuevo, el literal de la enmienda y las mutaciones.
> Codex no tiene acceso a la conversación que originó esta spec; todo lo que necesita
> está en estos cuatro ficheros.

## 1. Ficheros afectados

**Assets (R2)**
- Se sobrescriben, bajo el mismo nombre, los diez `mobile-pet-tracker/assets/images/orbit-<pose>.webp`
  (`wave`, `wave-blink`, `talk`, `walk`, `celebrate`, `sleep`, `collar`, `health`, `food`,
  `clipboard`). No hay `git mv` ni ficheros nuevos en `assets/images/`.

**Spec**
- Nuevo `specs/mobile-orbit-cachorro-art/convert-orbit.py` (§2, R3, R4). Es una
  herramienta de desarrollo, no código de la aplicación.
- Las fuentes `specs/mobile-orbit-cachorro-art/design-src/*.png` ya están en el repo;
  no se tocan.

**Tests**
- Nuevo `mobile-pet-tracker/src/__tests__/orbit-cachorro-art.test.ts` (§3, R1 a R3 y,
  al final, R6).
- Ningún test existente cambia (requirements.md §Tests existentes).

**Docs (R6, tras G4)**
- `docs/ui-guidelines.md`: se añade al final la sección del §4. No se edita nada más.

**No se tocan:** `mobile-pet-tracker/src/` fuera de tests, `package.json`, `bun.lock`,
`app.json`, `app.config.ts`, los demás ficheros de `assets/`, `hosting/` y `docs/`
salvo `ui-guidelines.md`.

## 2. Conversión y verificación (R2, R4)

### Script

Guárdalo **byte a byte** como `specs/mobile-orbit-cachorro-art/convert-orbit.py`
(salto de línea final incluido). No lo reformatees: ya lo ejecutó el autor de la
spec con esta versión y de él salen los hashes de requirements.md §Constantes.

```python
# Uso (desde la raíz del repo):
#   uvx --with pillow==13.0.0 python -I specs/mobile-orbit-cachorro-art/convert-orbit.py
# Convierte los diez PNG de design-src a mobile-pet-tracker/assets/images/orbit-<pose>.webp.
import hashlib, sys
from pathlib import Path
from PIL import Image

POSES = ['wave', 'wave-blink', 'talk', 'celebrate', 'sleep', 'collar', 'health', 'food', 'clipboard', 'walk']
SRC = Path('specs/mobile-orbit-cachorro-art/design-src')
DST = Path(sys.argv[1] if len(sys.argv) > 1 else 'mobile-pet-tracker/assets/images')

def clean(v):  # alfa < 16 es residuo fuera del contorno; alfa >= 252 es cuerpo opaco
    return 0 if v < 16 else 255 if v >= 252 else v

for pose in POSES:
    im = Image.open(SRC / f'orbit-{pose}.png')
    assert im.mode == 'RGBA' and im.size == (1024, 1024), (pose, im.mode, im.size)
    r, g, b, a = im.split()
    Image.merge('RGBA', (r, g, b, a.point(clean))).save(DST / f'orbit-{pose}.webp', 'WEBP', quality=80, method=6)

print('pose bytes sha256 bbox(l,t,r,b margins) minAlpha>0')
bad = 0
for pose in POSES:
    path = DST / f'orbit-{pose}.webp'
    data = path.read_bytes()
    a = Image.open(path).convert('RGBA').getchannel('A')
    hist = a.histogram()
    box = a.getbbox()
    margins = (box[0], box[1], 1024 - box[2], 1024 - box[3])
    min_alpha = next(i for i in range(1, 256) if hist[i])
    ok = len(data) <= 100000 and data[:4] == b'RIFF' and data[8:16] == b'WEBPVP8X' and min_alpha >= 16 and min(margins) >= 24
    bad += not ok
    print(pose, len(data), hashlib.sha256(data).hexdigest(), margins, min_alpha, 'ok' if ok else 'FALLA')
sys.exit(1 if bad else 0)
```

### Cómo se ejecuta

1. **Primero a un directorio temporal**, para comparar con R2 sin tocar el repo
   (desde la raíz del repo, con la ruta absoluta o relativa que prefieras):
   `mkdir -p /tmp/orbit-out && uvx --with pillow==13.0.0 python -I specs/mobile-orbit-cachorro-art/convert-orbit.py /tmp/orbit-out; echo "exit=$?"`
   (sin `| tail`: con un pipe el código de salida es el del último comando).
2. Salida esperada: la cabecera y diez líneas `ok`, y `exit=0`. Valores esperados
   (pose, bytes, márgenes izq/arriba/der/abajo, alfa mínimo):

   | pose | bytes | márgenes | alfa mín. |
   |---|---|---|---|
   | wave | 42274 | (121, 115, 125, 83) | 16 |
   | wave-blink | 40048 | (121, 115, 123, 82) | 16 |
   | talk | 40484 | (112, 116, 164, 82) | 16 |
   | celebrate | 45710 | (94, 79, 99, 120) | 16 |
   | sleep | 32570 | (29, 222, 35, 224) | 16 |
   | collar | 39430 | (116, 116, 118, 77) | 16 |
   | health | 43316 | (123, 118, 126, 82) | 16 |
   | food | 42862 | (106, 119, 113, 82) | 16 |
   | clipboard | 41948 | (123, 116, 127, 68) | 16 |
   | walk | 38914 | (128, 147, 128, 148) | 16 |

   Los hashes impresos deben ser los de requirements.md §Constantes («sha256 nuevo»).
3. Solo si coinciden los diez, ejecuta **sin argumento** para escribir en
   `mobile-pet-tracker/assets/images/`. Comprueba además
   `sha256sum mobile-pet-tracker/assets/images/orbit-*.webp` contra la misma tabla.
4. Si un hash difiere: PARA. No edites la tabla ni el test (D2). Anota en
   `progress/impl_mobile-orbit-cachorro-art.md` los diez hashes obtenidos, el
   resultado de `uv --version` y de `uvx --with pillow==13.0.0 python -I -c "import PIL; print(PIL.__version__)"`.

El script no es una dependencia del proyecto: `uvx` crea un entorno aislado y
desechable. `python -I` impide que `import` recoja ficheros del directorio actual.

### Por qué esta regla de alfa

Las fuentes traen alfa 1 a 3 fuera del contorno (invisible a simple vista, pero
ensancha el cuadro delimitador y deja una película que se ve sobre fondos oscuros) y
el cuerpo con alfa 252 a 254. `clean` fija el residuo a 0 y el cuerpo a 255. Entre 16
y 251 se conserva el borde suavizado. La lectura de vuelta exige alfa mínimo
distinto de cero ≥ 16: si `clean` se rompiera, aparecería un 1 a 3 y el script
fallaría.

## 3. El test nuevo (R1, R2, R3, R6)

Fichero: `mobile-pet-tracker/src/__tests__/orbit-cachorro-art.test.ts`. Sigue el
estilo de `src/__tests__/orbit-activity-pose.test.ts`: `jest.requireActual` de `fs`,
`path` y `crypto` (sin imports de módulos de producción), `imagesRoot =
join(process.cwd(), 'assets', 'images')`, `specRoot = join(process.cwd(), '..',
'specs', 'mobile-orbit-cachorro-art')`, `charterPath = join(process.cwd(), '..',
'docs', 'ui-guidelines.md')`. Copia la comprobación de cabecera VP8X del `it`
`#225 R5: orbit-walk.webp es WebP VP8X con alfa…` de ese fichero (bytes 0..4 `RIFF`, 8..12 `WEBP`, 12..16 `VP8X`,
`bytes[20] & 0x10` alfa, `& 0x02` animación, `readUIntLE(24, 3) + 1` y
`readUIntLE(27, 3) + 1`).

Constantes **literales** dentro del propio test (D3, regla de «candados no
tautológicos»: el valor esperado no se calcula desde el fichero ni se importa de
producción):

- `POSES`: las diez en el orden de requirements.md §Glosario.
- `NEW_SHA`, `OLD_SHA`, `SOURCE_SHA`: tres objetos `{ [pose]: sha256 }` con los valores
  de requirements.md §Constantes (`SOURCE_SHA` incluye también la clave
  `reference-a-sit`).

Los `it` (los títulos son literales; la traza de [[traceability]] los cita):

| `it` | Qué asierta | Nace |
|---|---|---|
| `#243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos` | `readdirSync(imagesRoot).filter(n => /^orbit-.*\.webp$/.test(n)).sort()` es igual a los diez nombres `orbit-<pose>.webp` también con `.sort()` (en los dos lados: `wave-blink` precede a `wave` porque `-` < `.`); y por cada pose, la cabecera VP8X (alfa, estático, 1024 × 1024) y `length <= 100000` | verde |
| `#243 R2: cada pose tiene el sha256 del arte nuevo` (`it.each`) | `sha256(orbit-<pose>.webp) === NEW_SHA[pose]` | **rojo** (diez filas) |
| `#243 R2: ningún fichero de assets/images conserva el arte viejo` | `readdirSync(imagesRoot)` con cualquier nombre: ningún `sha256` pertenece a `Object.values(OLD_SHA)` (se calcula por cada fichero; los subdirectorios se saltan) | **rojo** |
| `#243 R3: las fuentes PNG están congeladas` (`it.each` sobre las once claves de `SOURCE_SHA`) | el `sha256` del PNG coincide; empieza por la firma PNG (`89 50 4E 47 0D 0A 1A 0A`); `IHDR` a 12..16; ancho/alto 1024 (`readUInt32BE(16)`, `readUInt32BE(20)`); byte 25 (color type) = 6 (RGBA) | verde |
| `#243 R3: el script de conversión está en la spec con sus parámetros` | `convert-orbit.py` existe y contiene las cadenas `pillow==13.0.0`, `quality=80, method=6` y `def clean(` | **rojo** (hasta C2) |
| `#243 R6: la carta lleva la Enmienda #243 una sola vez, con la descripción nueva` | ver abajo | verde (se añade en C4) |

El `it` de R6 (se escribe en C4, tras la firma de G4; nace rojo contra `dev`):

- `charter.split('## Enmienda #243 — ').length - 1` es 1. Se separa el cuerpo de
  la sección hasta el siguiente `\n## ` o el final del fichero.
- El cuerpo contiene los literales: `cachorro`, `parche morado`, `#178255`, `antena`,
  `Pingo` y `diez poses`.
- El cuerpo coincide con `/- \[[ xX]\] Enmienda #243 aprobada por humano/`.
- Todo encabezado `^## ` posterior en el fichero coincide con `^## Enmienda #` (la
  misma regla de `home-photo-hero-canvas.test.ts`).
- No compares el texto completo: el humano puede ajustar una palabra al firmar. Ver
  casilla tolerante en la memoria `casilla-de-enmienda-tolerante`.

### Qué no se prueba y por qué

- El contenido del alfa y los márgenes: R2 fija los bytes y R4 es determinista (D2);
  jest no decodifica WebP.
- El render: lo cubre el smoke G2.

## 4. Literal de la Enmienda #243 (R6, gate G4)

Es el texto que el humano firma. Se añade **al final** de `docs/ui-guidelines.md`,
precedido de una línea en blanco. No se reescribe el punto 7 ni ninguna enmienda
anterior. `Fecha:` lleva la del commit.

```markdown
## Enmienda #243 — Orbit es un cachorro

Fecha: <la del commit>. Feature #243 `mobile-orbit-cachorro-art`. Sustituye la
descripción gráfica de la mascota; no cambia su nombre ni su voz (punto 7).

1. **Aspecto.** Orbit es un cachorro crema, sentado y visto de frente, en render 3D
   de plastilina suave. Lleva un parche morado sobre un ojo, orejas y cola gris
   oscuro, nariz negra, lengua rosa y un collar morado con una placa GPS cuya luz es
   el verde de marca `#178255`. No lleva antena, manos ni botón en el pecho.
2. **Las diez poses.** `orbit-wave`, `orbit-wave-blink`, `orbit-talk`, `orbit-walk`,
   `orbit-celebrate`, `orbit-sleep`, `orbit-collar`, `orbit-health`, `orbit-food` y
   `orbit-clipboard` (`.webp`, 1024 × 1024 con alfa, como mucho 100000 bytes)
   conservan nombre, tamaño en pantalla y copy. Una pose nueva entra con su propia
   feature.
3. **Historia.** Hasta la feature #243 Orbit era un robot-perro bípedo con antena,
   gorro verde y cara morada, y antes de #225 se llamaba «Pingo». Las enmiendas
   fechadas anteriores conservan «Pingo» y ese aspecto como historia; no se
   reescriben.
4. **Pendiente.** El icono, el splash y las notificaciones siguen con la cabeza
   anterior hasta que el humano entregue el PNG del icono (G6) y exista una feature
   para sustituirlos.

Detalle y tests en `specs/mobile-orbit-cachorro-art/requirements.md` (R1 a R7).

- [ ] Enmienda #243 aprobada por humano
```

## 5. Mutaciones a plantar (reviewer)

Cada una se planta sobre el verde final, se corre el test indicado y se revierte
(`git checkout HEAD -- <ruta>` y `git diff --cached` en 0).

| # | Mutación | Debe ponerse rojo |
|---|---|---|
| M1 | Restaurar el arte viejo de `orbit-talk.webp` (`git show <H0>:mobile-pet-tracker/assets/images/orbit-talk.webp > …`) | R2 (la fila de `talk` y «ningún fichero conserva el arte viejo») |
| M2 | Reconvertir una pose **sin** `clean` (`a.point(clean)` por `a`): zona ciega de jest, alfa 1 a 3 reaparece | R2 (la fila de esa pose); y el script en su lectura de vuelta (`FALLA`) |
| M3 | Reconvertir con `quality=90` | R2, y a veces R1 (peso) |
| M4 | Añadir `orbit-worried.webp` (cualquier WebP válido) | R1 «son las únicas» |
| M5 | Quitar `orbit-health.webp` | R1 y `orbit-rename.test.ts` (los `require` de `EmptyState` no resuelven) |
| M6 | Cambiar un byte de un PNG de `design-src/` | R3 «fuentes congeladas» |
| M7 | Borrar `convert-orbit.py` o cambiar `quality=80` por `quality=82` en él | R3 «script» |
| M8 | Reconvertir `orbit-sleep.webp` con un reescalado al 80 % (zona ciega: márgenes) | R2 y, en el script, `FALLA` solo si el margen baja de 24 |
| M9 | Copiar el arte viejo de una pose con otro nombre en `assets/images/` (`orbit-old.webp`) | R1 (lista) y R2 (arte viejo presente) |
| M10 | Duplicar la sección `## Enmienda #243` en la carta | R6 «una sola vez» |
| M11 | Quitar «Pingo» del cuerpo de la enmienda | R6 (literal `Pingo`) |
| M12 | Insertar `## Notas` (sin `Enmienda #`) después de la enmienda | R6 (encabezados posteriores) |
| M13 | Tocar `assets/icon.png` en un commit de la cadena | la guarda de R7 (tasks.md §Guardas finales), no un test de jest |

M2 y M8 son las mutaciones en zona ciega: jest no ve el alfa; el candado es el pin
de bytes. Plantarlas confirma que el pin mira donde el resto de los candados no.

## 6. Alternativas descartadas

- **`bunx sharp-cli`**: el clasificador del entorno denegó `bunx --bun sharp-cli`
  y no hay precedente en el repo. `uvx` + Pillow sí lo tiene (#225).
- **`cwebp`** (libwebp): no está instalado en la VPS ni en CI, y añadirlo es una
  dependencia de sistema.
- **Instalar `sharp` o `pillow` en el proyecto**: añade una dependencia que no es de
  la app (D1).
- **Un test de jest que lance Python**: CI no tiene `uv` (D2).
- **Decodificar WebP en jest** (por ejemplo con un paquete de pixeles): una dependencia
  nueva por una comprobación que ya cubre el pin de bytes (D9).
- **Reescalar o recentrar `sleep`** para igualar el ancho de las otras poses: cambia el
  arte aprobado; el humano lo compara en el smoke (D5).
- **Enmendar el punto 7 de la carta** con la descripción: lo fija
  `orbit-charter-voice.test.ts` y no es el sitio de un aspecto gráfico (D6).
- **Pin solo por tamaño en bytes**: dos conversiones distintas pueden coincidir en
  tamaño; el sha256 no.

## 7. Lecciones de la memoria que rigen este diseño

- **Constantes congeladas** (`constantes-congeladas-en-specs`, `lo-que-se-desplaza-no-es-ancla`):
  la spec ancla por contenido (nombres de pose, hashes), no por números de línea ni
  por recuentos que caduquen.
- **Candados tautológicos** (`candados-tautologicos`): los hashes esperados son
  literales del test; nada se importa de producción ni se calcula de lo que se prueba.
- **Mutación en zona ciega** (`prueba-de-mutacion-en-zona-ciega`): M2 y M8.
- **Anclas negativas** (`anclas-negativas-en-specs`): que `git grep` de «antena» dé 0
  en `docs` es un hecho verificado hoy, no un candado: la propia Enmienda #243 dice
  «antena» y lo rompería. Por eso no hay test que lo exija.
- **Casilla tolerante** (`casilla-de-enmienda-tolerante`): `[ xX]`.
- **Jest y paths con paréntesis** (`jest-paths-con-parentesis`): los comandos de jest
  de tasks.md usan rutas sin `(` ni `)`.
- **Handoff** (`handoff-diff-contra-head-del-handoff`, `handoff-anclas-sin-grep`,
  `handoff-cwd-explicito-y-error-de-invocacion`, `handoff-cabeceras-ejecutadas-como-comando`):
  tasks.md trae `cd` literal, anclas con salida esperada y ninguna cabecera que
  empiece por `#` dentro de una cadena.
- **Skills expo en Codex** (`B5`): este trabajo no toca UI. Si el reviewer pinta
  pantallas, usa los nombres de skills de Codex de `.claude/agents/leader.md`
  §Catálogo real de skills de Codex, no los de Claude.
