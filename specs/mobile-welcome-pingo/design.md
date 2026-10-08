---
feature: "mobile-welcome-pingo"
status: draft        # draft | approved
tags: [harness, spec, mobile, ui-delight]
---

# Diseño — [[mobile-welcome-pingo]] (#153)

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.

Toda la feature vive en la capa de presentación de `mobile-pet-tracker/`. No
toca dominio, aplicación, infraestructura ni el backend.

## Dependencia de #152

#152 (`mobile-home-motion-foundations`) crea `src/theme/motion.ts`, su test
`src/theme/__tests__/motion.test.ts` y la enmienda A21 de la carta. #153
**extiende** los dos ficheros (R4) y **consume** cuatro de sus constantes:
`MOTION_FADE_TIMING`, `MOTION_SETTLE_SPRING`, `MOTION_ENTRANCE_OFFSET_Y` y
`MOTION_FEEDBACK_MS`.

- **Lo que se sabe hoy.** Los nombres y valores salen de la spec de #152 en
  `36f91e6e`. Ese commit no tiene código: `motion.ts` todavía no existe en
  ningún commit.
- **Por qué la implementación espera.** Codex no arranca hasta que #152 esté
  en `origin/main`. T0 lo comprueba con anclas grepeables, sin hashes ni
  números de línea.
- **Si #152 mergea con otros nombres o valores.** El leader enmienda R4, R8,
  R9, R11 y C4, y reabre el gate solo para las enmiendas.
- **Reparto.** #153 no prescribe cambios en:
  - `src/screens/home/**`;
  - `src/theme/global.css`;
  - el final de `src/__tests__/design-drift.test.ts`;
  - `docs/ui-guidelines.md` §Animación ni el final de ese fichero.

  El punto 7 de R2 entra antes del checklist de autocrítica, lejos de los dos
  tramos de #152 en la carta.

## Decisiones técnicas

1. **Escena con `Card`.** La escena (`variant="secondary"`) y el bocadillo
   (`variant="surface"`) son el `Card` de `src/components/card.tsx`. Ya da
   `rounded-card`, la esquina continua (`CONTINUOUS_CORNER`) y la sombra de la
   variante. Así no hace falta ninguna clase de radio ni de sombra en la
   pantalla, y los candados de la carta no se mueven.
2. **Pingo en dos capas.** La pose base (`pingo-wave.webp`) está siempre
   pintada. Encima, en `position: 'absolute'`, va una capa con la pose de
   ojos cerrados (`pingo-wave-blink.webp`), que solo cambia de opacidad
   entre 0 y 1.
   - Las dos imágenes se montan una vez, así que el parpadeo nunca espera a
     decodificar una imagen.
   - Las dos poses tienen el mismo recuadro de alfa y solo difieren en la
     zona de los ojos (§Assets), así que la capa encaja sin desplazamiento.
   - El parpadeo es un cambio instantáneo (`duration: 0`) porque un fundido
     dejaría ver las dos poses a la vez, con ojos dobles.
3. **Un solo valor de transformación para Pingo.** La entrada (escala) y la
   flotación (`translateY`) van en el mismo `useAnimatedStyle` de
   `welcome-pingo`. Así la capa de parpadeo, que es hija, flota y escala con
   la pose sin animación propia.
4. **Movimiento.**
   - **Entrada.** El contenido usa `MOTION_FADE_TIMING` y
     `MOTION_SETTLE_SPRING` de #152, que sustituyen a `WELCOME_ENTRANCE_MS` y
     `WELCOME_ENTRANCE_EASING`. Esas dos se borran y no se migran: son lo
     mismo que el preset común. Pingo añade un muelle de escala de 0,9 a 1.
   - **Bucles.** La flotación y el parpadeo son `withRepeat` de Reanimated,
     que corre en el hilo de UI, y no `setInterval` en el hilo de JS.
   - **Reduce motion.** Con reduce motion, la pantalla no arranca los
     bucles: no basta con el `ReduceMotion.System` de las constantes. Así el
     test puede observar que `withRepeat` no se llama, y no queda un bucle
     de duración cero dando vueltas.
   - **Desmontaje.** Lo resuelve Reanimated: `useSharedValue` cancela su
     animación al desmontar (R12). La pantalla no repite esa limpieza.
5. **Excepción de la carta.** §Animación pide muelles para el movimiento y
   reserva los timings para opacidad y color. Una flotación en vaivén no
   tiene destino al que asentarse: un muelle con `withRepeat(…, true)` daría
   un rebote en cada extremo. Por eso el punto 7 (R2) declara la excepción
   para los bucles de reposo, y solo para ellos (G4).
6. **Labio del CTA.** Es `border-b-4 border-black/25` en la `className` de
   `welcome-get-started`. React Native pinta el fondo también bajo el borde,
   así que el negro al 25 % sobre `bg-accent` da un verde oscuro en los dos
   temas, sin token nuevo (G3). El `Button` de heroui no cambia (D4). Si
   heroui pisara el borde inferior con una clase propia, lo detecta el paso 2
   del smoke R14: los tests de clases no pueden verlo.
7. **Copy.** Hay una sola clave nueva, `welcome.pingoGreeting`, en los dos
   idiomas de `src/i18n/catalog.ts`, registrada en
   `specs/mobile-ui-language/design.md` §2.20 y en `R16_WELCOME`.
8. **Accesibilidad.** Las dos imágenes son decorativas y no llevan etiqueta.
   El saludo es texto real y el lector de pantalla lo lee.

## Assets

Las poses fuente están en `/home/claude/pet-tracker-mascot/`, fuera del repo:
PNG 1024×1024 RGBA. Entran dos, convertidas a WebP con alfa.

| Fuente | Destino en el repo | Bytes medidos (2026-10-07) |
|---|---|---|
| `mascot-01-wave.png` | `mobile-pet-tracker/assets/images/pingo-wave.webp` | 56 062 |
| `mascot-01-wave-blink.png` | `mobile-pet-tracker/assets/images/pingo-wave-blink.webp` | 55 608 |

**Comando de conversión.** Lo corre el leader antes del handoff (G2). Usa
Pillow vía `uv`, sin instalar nada en el repo, y tarda unos 8 s:

```bash
mkdir -p /home/claude/pet-tracker-mascot/webp && uv run --with pillow python -I -c "
from PIL import Image
s='/home/claude/pet-tracker-mascot'
for a,b in [('mascot-01-wave','pingo-wave'),('mascot-01-wave-blink','pingo-wave-blink')]:
    Image.open(f'{s}/{a}.png').save(f'{s}/webp/{b}.webp','WEBP',quality=80,method=6)
"
```

Pillow escribe el contenedor `VP8X` con el bit de alfa activo, que es lo que
comprueba R3. El spec_author lo midió con este mismo comando en el
scratchpad. La carpeta `webp/` todavía no existe: la crea el leader.

**Alineación medida.** El recuadro de alfa de las dos poses es idéntico:
`(151, 123, 873, 942)`. Los píxeles distintos caen todos dentro de
`(328, 416, 696, 573)`, la zona de los ojos.

**`splash-icon.png` se queda.** La bienvenida deja de usarlo, pero lo siguen
usando `app.json` (splash), `src/app/index.tsx` (pantalla de carga) y
`app.config.test.ts`.

## Archivos afectados

Rutas relativas a `mobile-pet-tracker/` salvo las que empiezan por `docs/` o
`specs/`.

| Capa | Archivo | Requisitos | Cambio |
|---|---|---|---|
| Presentación | `src/screens/welcome/index.tsx` | R1, R5–R12 | Escena, Pingo, labio, movimiento; borra `WELCOME_ENTRANCE_*` |
| Presentación | `src/i18n/catalog.ts` | R1 | `welcome.pingoGreeting` en `en` y `es` |
| Presentación | `src/theme/motion.ts` | R4 | Cinco constantes nuevas |
| Assets | `assets/images/pingo-wave.webp`, `assets/images/pingo-wave-blink.webp` | R3 | Nuevos |
| Tests | `src/screens/welcome/index.test.tsx` | R1–R3, R5–R13, E1 | Describes `#153 R<n>`; C5–C8 |
| Tests | `src/theme/__tests__/motion.test.ts` | R4 | Describe `#153 R4`; C4 |
| Tests | `src/providers/__tests__/language-provider.test.tsx` | R1 | C1 |
| Tests | `src/__tests__/ui-copy-table.ts` | R1 | C2 |
| Tests | `src/__tests__/ui-language.test.ts` | R1 | C3 |
| Docs | `docs/ui-guidelines.md` | R2, E1 | Punto 7, antes del checklist; párrafo de la sección `## Enmienda #152` (E1) |
| Docs | `specs/mobile-ui-language/design.md` | R1 | §2.20 |
| Harness | `specs/mobile-welcome-pingo/traceability.md`, `progress/impl_mobile-welcome-pingo.md` | todos | Trazabilidad y reporte |

**No cambian** `package.json` ni `bun.lock` (R13), ni ningún fichero del
reparto de #152. La única excepción es el párrafo de E1 en la sección
`## Enmienda #152` de la carta: #152 ya está mergeada y su leader pidió el
cambio.

## Candados existentes que se mueven

Cada fila se ancla por contenido grepeable y no por número de línea. T0
comprueba cada ancla con `grep -cF`.

| # | Fichero | Ancla (contenido actual) | Cambio | Requisito |
|---|---|---|---|---|
| C1 | `src/providers/__tests__/language-provider.test.tsx` | `+ 8, // #118 R1` | Pasa a `+ 8 // #118 R1` y debajo entra una línea nueva `+ 1, // #153 R1`, con la misma sangría | R1 |
| C2 | `src/__tests__/ui-copy-table.ts` | `{ file: 'src/screens/welcome/index.tsx', key: 'welcome.legalNotice' },` | Debajo, dentro de `R16_WELCOME`, entra `{ file: 'src/screens/welcome/index.tsx', key: 'welcome.pingoGreeting' }, // #153 R1` | R1 |
| C3 | `src/__tests__/ui-language.test.ts` | `it('resuelve las 8 ocurrencias de welcome', () => checkUses(R16_WELCOME));` | El título pasa a `resuelve las 9 ocurrencias de welcome (#153 R1)`; el cuerpo no cambia | R1 |
| C4 | `src/theme/__tests__/motion.test.ts` | el `it` `no exporta nada más` de #152 R1 | La lista literal pasa de 8 a 13 nombres, ordenada | R4 |
| C5 | `src/screens/welcome/index.test.tsx` | `it('apila los siete bloques en orden'` | La lista de `testID` pasa a la de R5 (escena en lugar de hero) | R5 |
| C6 | `src/screens/welcome/index.test.tsx` | `it('pinta hero, marca, tagline y legal con sus clases'` | Pierde las aserciones de `welcome-hero` y se renombra `pinta marca, tagline y legal con sus clases` | R5 |
| C7 | `src/screens/welcome/index.test.tsx` | `'w-full rounded-xl bg-accent'` dentro del `it` `es el botón primario del repo` | El `toBe` pasa a `'w-full rounded-xl bg-accent border-b-4 border-black/25'` | R7 |
| C8 | `src/screens/welcome/index.test.tsx` | `describe('R10', () => {` | Se borra entero y lo sustituye el describe `#153 R8`; el import de `WELCOME_ENTRANCE_MS` y `WELCOME_ENTRANCE_EASING` sale de la cabecera | R8 |

**Sin delta.** Estos candados se revisaron y no se mueven:

- **`SCREEN_FILES` y `ALL_USES`.** La bienvenida ya está en `SCREEN_FILES`, y
  `ALL_USES` se cuadra a sí mismo con la suma de sus bloques.
- **#61 R4** (`legibility-classnames.test.ts`). La bienvenida sigue con 2
  usos de `text-accent-strong`: #153 no añade ninguno.
- **`rounded-xl bg-accent`** (`consistency-classnames.test.ts`). La
  expresión es `/rounded-xl bg-accent(?=[\s'"`])/g`. La `className` nueva
  sigue casando una vez, porque tras `bg-accent` viene un espacio.
- **#62 R14** (`CONTINUOUS_CORNER`). La bienvenida no aplica la esquina a
  mano: la ponen los `Card`.
- **#149 R4** (`design-drift.test.ts`). La bienvenida sigue con una sola
  navegación a login.
- **#118 R11** (`design-drift.test.ts`). `border-black/25` no es una clase
  arbitraria, y `rounded-card` no está en la lista prohibida.

## Guards que vigilan los ficheros tocados

Lección de #152: los guards globales también leen ficheros de test. Esta
sección dice qué guard vigila cada fichero que toca #153, medido en `66aaf981`.
Cada cadena que la spec prescribe en esos ficheros se comprobó contra el
guard. Los comandos se lanzan desde la raíz del repo, y la salida esperada
vale **antes y después** de implementar (T13 los repite). Cuando
`grep -c` cuenta 0, sale con código 1: lo que vale es la cifra impresa.
`\x27` es la comilla simple, escrita así para que el comando se pueda pegar
entre comillas simples.

**`src/screens/welcome/index.tsx` (producción).**

```bash
# #118 R11: hex. Esperado: 0
grep -ciP '#(?!\d{2,3} R\d)[\da-f]{3,8}\b' mobile-pet-tracker/src/screens/welcome/index.tsx
# #118 R11: clase arbitraria. Esperado: 0
grep -cP '[A-Za-z0-9_-]+-\[[^\]]+\]' mobile-pet-tracker/src/screens/welcome/index.tsx
# #118 R11: StyleSheet y sombras legacy. Esperado: 0
grep -ciP 'StyleSheet|shadowColor|shadowOffset|shadowOpacity|shadowRadius|\belevation\s*:' mobile-pet-tracker/src/screens/welcome/index.tsx
# #118 R11 y #61 R4: radios fuera de escala y text-accent suelto. Esperado: 0
grep -cP '\brounded-(?:2xl|lg|md|sm)\b|text-accent(?![-\w])' mobile-pet-tracker/src/screens/welcome/index.tsx
# #118 R11: dependencias vetadas y useThemeColor. Esperado: 0
grep -cP 'expo-linear-gradient|expo-symbols|\buseThemeColor\b' mobile-pet-tracker/src/screens/welcome/index.tsx
# #61 R4: ocurrencias de text-accent-strong. Esperado: 2
grep -oP 'text-accent-strong\b' mobile-pet-tracker/src/screens/welcome/index.tsx | wc -l
# #149 R4: rutas a login. Esperado: 1
grep -oP '[\x27"`]/(?:\(auth\)/)?login\b' mobile-pet-tracker/src/screens/welcome/index.tsx | wc -l
# consistency-classnames, rounded-xl bg-accent: la bienvenida aporta 1. Esperado: 1
grep -oP 'rounded-xl bg-accent(?=[\s\x27"`])' mobile-pet-tracker/src/screens/welcome/index.tsx | wc -l
```

Las cadenas que #153 mete en producción son de tres tipos, y ninguna toca
esos guards:

- las clases de R5 y R7, incluido `border-black/25`, que no lleva corchetes;
- los estilos en línea numéricos de R6 (`width`, `height`, `position`,
  `top`, `left`);
- los comentarios `#153 R<n>`, que esquivan la expresión de hex por su
  lookahead.

El emoji lo vigila el propio `#118 R11` con `\p{Extended_Pictographic}`, y el
copy vive en el catálogo y no en la pantalla.

**`src/screens/welcome/index.test.tsx` (test colocado).** Los guards de
`consistency-classnames.test.ts` y `legibility-classnames.test.ts` excluyen
los tests colocados, y `#118 R11` solo lee producción. Pero el
`sourceFiles()` de `design-drift.test.ts` **sí** recorre los tests colocados:
solo salta las carpetas `__tests__`. Por eso este fichero lo vigilan:

```bash
# design-drift C8, R3 y R4: clase arbitraria en el test colocado. Esperado: 0
grep -cP '[A-Za-z0-9_-]+-\[[^\]]+\]' mobile-pet-tracker/src/screens/welcome/index.test.tsx
# design-drift, huella del hook legacy. Esperado: 0
grep -cP 'use-api|useApi' mobile-pet-tracker/src/screens/welcome/index.test.tsx
```

Ninguna expresión que la spec prescribe para el test lleva un guion pegado a
un `[`. Si al escribir un test hiciera falta una clase de caracteres tras un
guion, se escribe con `\-` o se reordena, y se vuelve a medir.

**`src/theme/motion.ts`.** Tras el merge de #152, lo vigila `#152 R9`
(`design-drift.test.ts`) con `MEALS_BAR_STYLE_ESCAPES`: hex, clase
arbitraria, `StyleSheet` y sombras legacy. #153 solo le añade números,
`Easing.bezier(0.37, 0, 0.63, 1)`, `ReduceMotion.System` y comentarios
`// #153 R4`. Se mide en T0 y en T13:

```bash
# #152 R9: hex, clase arbitraria, StyleSheet y sombras en motion.ts. Esperado: 0
grep -ciP '#(?!\d{2,3} R\d)[\da-f]{3,8}\b|[A-Za-z0-9_-]+-\[[^\]]+\]|StyleSheet|shadowColor|shadowOffset|shadowOpacity|shadowRadius|\belevation\s*:' mobile-pet-tracker/src/theme/motion.ts
```

**Otros ficheros.** `src/i18n/catalog.ts` y los tests de `src/__tests__/` y
de `src/theme/__tests__/` no están en ninguna lista de ficheros con escapes
de estilo. Los tests de `__tests__/` tampoco los recorre `sourceFiles()`.

**Lectura de estilos en los tests.** Ningún test nuevo usa
`StyleSheet.flatten`. Los estilos animados se leen con `getAnimatedStyle` o
con `toHaveAnimatedStyle(…, { shouldMatchAllProps: true })`, y los de las
imágenes con `props.style` y `toEqual`, como ya hace #118 con `welcome-hero`.
El `StyleSheet.flatten` que el test de la bienvenida ya tiene, en el `it`
de C6 sobre `welcome-content`, se queda como está.

## Alternativas descartadas

- **Rive o Lottie.** Las descarta D3: son dependencias nuevas.
- **Cambiar la `source` de una sola imagen para parpadear.** Re-decodifica
  en cada parpadeo y puede dar un destello en blanco.
- **Parpadeo con fundido.** A mitad del fundido se ven las dos poses: ojos
  dobles.
- **Intervalo de parpadeo aleatorio.** Necesita un temporizador en JS o
  re-lanzar la animación con valores nuevos, y el test deja de ser
  determinista (G9).
- **Labio con `accent-strong`.** En tema oscuro es más claro que el acento.
- **Token `--accent-lip` en `global.css`.** Tiene un solo uso, y
  `global.css` es de #152 en este ciclo (G3).
- **Variante nueva del `Button` global.** La descarta D4.
- **Constantes de Pingo locales en la pantalla.** La enmienda A21 de #152
  manda el movimiento a `motion.ts` (G5).
- **Re-exportar `WELCOME_ENTRANCE_*` desde `motion.ts`.** Serían alias de
  `MOTION_FADE_TIMING`, y la carta no quiere dos nombres para un valor.
- **Bocadillo con cola, arriba a la derecha (canvas).** Pide una forma fuera
  de la escala de radios (G7).
- **Meter las doce poses ya.** Serían diez ficheros sin uso en el árbol
  (G1).
