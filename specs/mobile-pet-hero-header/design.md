---
feature: "mobile-pet-hero-header"
status: approved     # draft | spec_ready | approved
tags: [harness, spec]
---

# Diseño — [[mobile-pet-hero-header]]

> Ver [[requirements]] para los requisitos que este diseño implementa,
> [[../../docs/ui-guidelines|ui-guidelines]] (carta de UI, gana sobre cualquier
> skill) y [[../../docs/conventions|conventions]] §Convenciones de la app móvil.
>
> Toda afirmación técnica de este documento está verificada contra el árbol en
> `303fc19`; cada una lleva su `fichero:línea`. Las skills cargadas fueron
> `expo-overview` → `expo-design-system`, `expo-native-ui` y
> `appllama-app-design-skill`, con el límite 1 de la carta: de la skill se toma
> el **patrón**, nunca el sistema de estilos.

---

## 1. La forma del componente — sirve a R1, R3, R4, R8

El hero es **tres franjas apiladas**, no una foto con cosas encima. Esa es la
decisión estructural de la que cuelga todo lo demás:

```
<View testID="pet-hero" className="overflow-hidden bg-default"        ← + rounded-card + CONTINUOUS_CORNER si variant="card"
  ├─ zona superior (solo si hay children)      testID="pet-hero-slot"
  │    className="bg-background px-6 pb-3"  style={{ paddingTop: insets.top + 12 }}
  │    → {children}   (en Home: <PetSwitcher/>)
  │
  ├─ zona de medios   style={{ height: PET_HERO_MEDIA_HEIGHT }}
  │    ├─ <PetAvatar testID="pet-hero-media" size={{ width:'100%', height: PET_HERO_MEDIA_HEIGHT }} …/>
  │    ├─ testID="pet-hero-fade-top"     (solo si hay children)  absolute inset-x-0 top-0
  │    └─ testID="pet-hero-fade-bottom"                          absolute inset-x-0 bottom-0
  │
  └─ zona inferior    testID="pet-hero-caption"
       className="flex-row items-end justify-between gap-4 bg-background px-6 pb-4 pt-1"
       ├─ nombre  testID="pet-hero-name"   text-3xl font-black text-foreground
       ├─ raza     testID="pet-hero-breed"  font-normal text-muted
       └─ dato destacado (si hay highlight)
            testID="pet-hero-highlight-value"  text-3xl font-black text-foreground  style={TABULAR_NUMS}
            testID="pet-hero-highlight-label"  text-xs font-medium text-muted
```

Tres consecuencias, todas buscadas:

1. **El alto del hero es intrínseco**, no una constante. Lo fijan la safe area,
   el alto del slot, `PET_HERO_MEDIA_HEIGHT` y el texto. Eso lo hace inmune al
   inset de cada dispositivo y a Dynamic Type, que es lo que pide
   `appllama-app-design-skill` §fidelidad 8 y 12. Ver §4 para el número.
2. **El texto nunca toca la imagen**, así que su contraste es el de un texto
   normal sobre `bg-background`: exactamente los pares que #61 ya validó. Ver §3.
3. **El slot no es el selector.** El hero no importa `pet-switcher` ni sabe qué
   le meten dentro (D2). Eso es lo que hace posible que Home y Profile compartan
   receta sin duplicarla: Profile no pasa slot y la zona superior desaparece
   entera.

`px-6` son 24 px, el mismo padding horizontal que el resto de las pantallas
(`docs/conventions.md` §Dimensiones): el nombre del hero queda alineado con el
borde de las cards de debajo. Es la comprobación de "alineación" de la lista de
autocrítica de la carta, y no sale gratis en un diseño a sangre.

### Las dos variantes, y por qué son dos y no una

| `variant` | Quién | Qué cambia |
|---|---|---|
| `'bleed'` | Home | Sin radio, sin borde, ancho completo. Es el primer hijo del scroll y sangra bajo la barra de estado; su slot asume el `insets.top + 12` que el `contentContainerStyle` deja de poner (R5b) |
| `'card'` (default) | Profile | `rounded-card` + `overflow-hidden` + `style={CONTINUOUS_CORNER}`. Vive dentro del padding de 24 y **no** obliga a reestructurar el scroll de Profile |

No es configuración especulativa: hay dos llamantes y cada uno usa una. La
alternativa —`variant="bleed"` también en Profile— exigiría partir el
`contentContainerStyle` de Profile en tres envoltorios (arriba del hero, hero,
debajo del hero) y rompería el candado de métricas de
`src/screens/profile/index.test.tsx:346-351` sin ganar nada: en Profile el hero
va a media pantalla, debajo del título y del selector, así que a sangre no
significaría "bajo la barra de estado" sino solo "sin margen lateral".

---

## 2. El degradado: `experimental_backgroundImage`, no Tailwind, no SVG, sin dependencias — sirve a R3, R9

**Decisión: los dos degradados se aplican por el prop `style`, con
`experimental_backgroundImage` de React Native.** Ni clases de Tailwind ni
`<LinearGradient>` de `react-native-svg` ni, por supuesto,
`expo-linear-gradient`.

### 2.1 El nombre de la propiedad es `experimental_backgroundImage`

Verificado en el árbol, no de memoria:
`node_modules/react-native/Libraries/StyleSheet/StyleSheetTypes.d.ts:520` declara
`experimental_backgroundImage?: ReadonlyArray<BackgroundImageValue> | string`.
**`backgroundImage` a secas no existe en RN 0.86.2**: cero ocurrencias en
`Libraries/StyleSheet/` y en `src/`. Quien escriba `backgroundImage` obtendrá un
estilo ignorado en silencio y un degradado invisible. El prefijo
`experimental_` es feo y es el correcto en esta versión.

Requiere New Architecture (Fabric), que es el default de Expo SDK 57 / RN 0.86 y
lo que corre el dev build de Android del smoke.

### 2.2 Las utilidades de gradiente de Tailwind **no** resuelven en este proyecto

Comprobado ejecutando el compilador real del repo (`tailwindcss` 4.3.3, API
`compile()`), no leyendo documentación. `bg-linear-to-b from-black/30 to-white`
produce:

```css
.bg-linear-to-b { --tw-gradient-position: to bottom;
  @supports (background-image: linear-gradient(in lab, red, red)) {
    --tw-gradient-position: to bottom in oklab; }
  background-image: linear-gradient(var(--tw-gradient-stops)); }
.from-black\/30 { --tw-gradient-from: color-mix(in srgb, #000 30%, transparent);
  --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position),
    var(--tw-gradient-from) var(--tw-gradient-from-position), …); }
```

uniwind 1.11.0 **sí** tiene camino de gradiente —
`node_modules/uniwind/src/bundler/css-processor/rn.ts:39-41` mapea
`background-image` → `experimental_backgroundImage`, y
`src/core/native/store.ts:224-226` pasa el valor por
`resolveGradient` (`src/core/native/parsers/gradient.ts:7-38`) — pero ese parser
**parte el valor por `', '` y espera paradas de color literales**. Recibiendo
`linear-gradient(var(--tw-gradient-stops))` produce una única parada basura y
ninguna dirección.

Y no puede resolverlo aunque quisiera: `--tw-gradient` no aparece **ni una vez**
en todo `node_modules/uniwind/` (`dist` y `src`), las paradas viven en reglas
CSS **hermanas** (`.from-*`, `.to-*`) que uniwind procesa por separado, y la
dirección sale como `to bottom in oklab` bajo un `@supports`, un espacio de
interpolación que `GradientValue.direction` de RN no acepta. uniwind tampoco
documenta gradientes: cero menciones en su readme y cero `bg-linear` / `bg-gradient`
en todo el paquete.

**Conclusión**: el prop `style` es la única vía, y la clase queda descartada por
un hecho comprobado, no por precaución.

### 2.3 Por qué no `react-native-svg`

`specs/mobile-figma-polish/design.md:99-101` admite `<LinearGradient>` de
`react-native-svg` dentro de un SVG, y es lo que usa `weight-chart.tsx:49`. Ahí
tiene sentido: el degradado rellena un `<Path>` que ya es SVG. Aquí rellenaría
un rectángulo, y para eso habría que montar un `<Svg>` con `<Defs>`, `<Stop>` y
`<Rect>` — media docena de nodos y un árbol SVG entero para lo que RN hace con
una cadena. Se descarta por peso, no por prohibición.

### 2.4 La forma exacta de la cadena, y el porqué del `00`

```ts
const [background] = useThemeColors(['background']);
// abajo: la imagen se funde hacia la banda opaca
`linear-gradient(to bottom, ${background}00 0%, ${background} 100%)`
// arriba: al revés
`linear-gradient(to bottom, ${background} 0%, ${background}00 100%)`
```

La parada transparente se escribe como **el propio color de fondo con alfa 0**
(`#FFFFFF00` / `#0D111700`), **no** con la palabra `transparent`. El Make hace lo
mismo: su degradado (`design-src/App.tsx:337`) pone
`rgba(255,255,255,0) 60%` antes de `#fff 100%` en vez de `transparent`. El motivo
es que `transparent` es `rgba(0,0,0,0)`, negro con alfa cero; en cualquier
implementación que interpole sin premultiplicar, el tramo intermedio se ensucia
de gris o de negro. Escribir la parada con el color destino elimina la duda sin
coste.

Eso obliga a que el token resuelva a hex de 6 dígitos. R3 lo fija con una
aserción explícita sobre `useThemeColors(['background'])` en los dos temas: si
algún día deja de serlo, el candado salta y el implementer para en vez de
concatenar basura. Los colores salen del token, nunca de un literal — grep-clean
de la carta §Decisiones fijas 3, sin excepción por ser "un color de adorno".

**Ninguna dependencia nueva.** `expo-linear-gradient` sigue sin instalarse y esta
spec no lo pide.

---

## 3. Contraste: por qué el texto no va sobre la foto — sirve a R3

Este es el punto donde #67 se aparta del Make a propósito, y se aparta con
números, no con opinión. Método de #61: WCAG 2.x, luminancia relativa sRGB,
contraste calculado sobre los valores literales de `src/theme/global.css`.

### 3.1 Lo que sí pasa AA — la solución adoptada

El texto va sobre banda **opaca** de `bg-background`. Entonces el contraste no
depende de la imagen en absoluto:

| Par | Claro (`--background: #FFFFFF`) | Oscuro (`--background: #0D1117`) |
|---|---:|---:|
| `text-foreground` (`#0D1117` / `#F7F8FA`) | **18,93:1** | **17,81:1** |
| `text-muted` (`#667085` / `#9CA3AF`) | **4,98:1** | **7,45:1** |

Los cuatro superan 4,5:1. Y valen igual **con foto** y **sin foto**, porque
debajo del texto no hay foto: hay `bg-background`.

Esa identidad es justamente lo que exigen los dos criterios de aceptación de
#67 — *"sin foto … el texto encima pasa AA en los dos temas"* y *"con foto, el
degradado a fondo garantiza que el texto encima pasa AA sea cual sea la
imagen"*. La garantía es estructural: el degradado **llega a opaco antes** del
texto, y no "es lo bastante fuerte".

### 3.2 Lo que no pasa AA — la vía fiel al Make, calculada

El Make pone el nombre, la raza y el contador **sobre la foto**, apoyados en un
velo `rgba(0,0,0,0.28)` (`design-src/App.tsx:337`). El peor caso es una foto casi
blanca — que es exactamente el caso que el criterio de aceptación manda cubrir:

| Velo negro α | Compuesto sobre foto blanca | Blanco encima | `--accent` `#178255` encima | `--foreground` `#0D1117` encima |
|---:|---|---:|---:|---:|
| **0,28** (el del Make) | `#B8B8B8` | **1,98:1** ❌ | **2,43:1** ❌ | 9,54:1 |
| 0,42 | `#949494` | 3,03:1 (llega a 1.4.11) | **1,59:1** ❌ | 6,24:1 |
| 0,54 | `#757575` | **4,61:1** ✅ | 1,05:1 ❌ | 4,11:1 |

Tres lecturas:

- Con el velo del Make, texto blanco encima da **1,98:1**: falla AA por un
  factor de 2,3. No es un ajuste fino, es un orden de magnitud.
- Para que el blanco llegue a 4,5:1 haría falta α ≈ **0,54**, un velo que
  oscurece la foto a más de la mitad. Eso ya no es "una foto con un degradado":
  es una foto tapada. La fotografía es el punto entero de la feature.
- Texto oscuro tampoco sirve: `#0D1117` da 9,54:1 sobre una foto blanca velada,
  pero sobre una foto **negra** con el mismo velo cae a ≈1,1:1. Una foto
  arbitraria no acota nada por ningún lado.

Y hay un efecto contraintuitivo que conviene dejar escrito: **oscurecer el velo
empeora el acento**. `--accent` `#178255` es un verde oscuro (fue oscurecido a
propósito por #61); al bajar la luminancia del velo, el velo se acerca a la del
acento y el contraste cae, de 2,43:1 a 1,59:1. No existe un α que salve al mismo
tiempo al blanco y al verde.

### 3.3 Consecuencia para el selector de mascota

`pet-switcher` no está diseñado para vivir sobre una foto. Su chip seleccionado
usa `bg-accent-soft`, que es translúcido —
`color-mix(in oklab, var(--accent) 15%, transparent)`,
`node_modules/heroui-native/src/styles/theme.css:83` — y su indicador de estado
es un anillo `border-accent`, que por §3.2 no llega a los 3:1 de WCAG 1.4.11
sobre una foto clara a **ninguna** intensidad de velo.

Por eso el slot va sobre **banda opaca** y no sobre la foto: así el switcher se
monta sobre exactamente la superficie para la que ya está validado
(`bg-background`), `pet-switcher.tsx` **no se toca**, sus cinco pantallas
llamantes no se enteran, y #67 no introduce ninguna regresión de accesibilidad
que luego haya que arreglar en otra feature. Es la opción más barata **y** la
correcta, que no siempre coinciden.

### 3.4 Lo que el smoke ve, y que es esperado

El hero de la app tendrá una franja de fondo de app arriba (donde el Make tiene
foto velada) y otra abajo, y en Home será más alto que los 340 px del Make. Se
declara como desviación, igual que #61 declaró que `--accent` deja de coincidir
con el Figma. No es un defecto: es el precio medido de que el texto se lea.

---

## 4. Dimensiones: cómo convive un hero a sangre con §Dimensiones — sirve a R5b, R9

### 4.1 Las dos constantes, y por qué no son tokens

```ts
export const PET_HERO_MEDIA_HEIGHT = 260;  // alto visible de la fotografía
export const PET_HERO_FADE_HEIGHT = 64;    // alto de cada franja de degradado
```

Viven en `src/components/pet-hero-header.tsx` y se exportan **para los tests**,
no para otros componentes.

**No son tokens de `global.css`.** La carta §Decisiones fijas 2 pide token
cuando *"un valor nuevo se repite 2+"*; cada una se usa una sola vez, en un solo
fichero. Un token para un valor de un solo uso es un segundo sitio donde
buscarlo. Y **no pueden ser clases**: `h-[260px]` está prohibido por
`src/__tests__/design-drift.test.ts:48-52`, que veta toda clase arbitraria en
`src/`, y no hay utilidad de Tailwind que valga 260.

**Los 340 px del Make no se copian, y aquí está el porqué.** En el Make, 340 es
la cabecera **entera** con los overlays translúcidos dentro. Aquí las bandas son
opacas (§3), así que el número que tiene sentido fijar es el de la **foto**, no
el del hero. Si en Home se restaran del alto total la safe area, el slot y el
bloque de texto, quedarían menos de 100 px de fotografía y el hero dejaría de
serlo. Con 260 de foto, el hero mide en Profile ≈ 260 + 72 ≈ **332**, casi
exactamente los 340 del Make; en Home suma además la safe area y el slot. Ajustar
el número es editar una línea en un fichero, y el gate es el smoke.

### 4.2 La convivencia con §Dimensiones

`docs/conventions.md` §Dimensiones y la carta §Decisiones fijas 6 mandan
`paddingTop: insets.top + 12`, `padding: 24`, `gap: 16` y
`paddingBottom: insets.bottom + 96` en `contentContainerStyle`. Un hero a sangre
es incompatible con `padding: 24` en el padre: el hijo quedaría con 24 px de
margen a cada lado y no sangraría nada.

La regla se conserva con una **excepción nombrada** (enmienda A9), no se rompe:

```tsx
<ScrollView testID="screen-home" className="flex-1 bg-background"
  contentInsetAdjustmentBehavior="automatic"
  contentContainerStyle={{ gap: 16, paddingBottom: insets.bottom + 96 }}>

  <PetHeroHeader variant="bleed" pet={…} highlight={…}>
    <PetSwitcher … />
  </PetHeroHeader>

  <View style={{ paddingHorizontal: 24, gap: 16 }}>
    {/* collar-card, summary-card, last-position-card */}
  </View>
</ScrollView>
```

- `gap: 16` y `paddingBottom: insets.bottom + 96` **se quedan donde estaban**.
- El padding horizontal de 24 baja a un envoltorio interior: mismo valor, mismo
  efecto visual, un nivel más abajo.
- El `paddingTop: insets.top + 12` **no desaparece del proyecto**: lo asume el
  slot del hero (R4), calculado con `useSafeAreaInsets`, jamás fijo, que es lo
  que la carta §6 exige de todo overlay.
- Las ramas sin hero (`home-loading`, `home-error`, `home-empty`) llevan su
  propio envoltorio con `paddingTop: insets.top + 12`, porque cuando se muestran
  no hay hero que ocupe la safe area.

**Profile no cambia nada de esto**: su hero es `variant="card"` y vive dentro del
padding de 24, así que `src/screens/profile/index.test.tsx:346-351` sigue verde
sin tocarse. Sólo Home reestructura, y sólo Home necesita la excepción.

### 4.3 Radio

El hero a sangre **no lleva radio**: no tiene esquinas, llega a los bordes de la
pantalla. El de Profile lleva `rounded-card`, que es el radio de superficie de
card que fija la carta §Decisiones fijas 12, más `style={CONTINUOUS_CORNER}` de
`src/theme/native-styles.ts:9`. Ningún `rounded-2xl` / `-lg` / `-md` / `-sm`, que
están prohibidos y verificados por `consistency-classnames.test.ts:139-145`.

---

## 5. La capa de medios: una sola casa para la imagen de mascota — sirve a R2

El render de imagen de mascota vive en **un solo sitio**,
`src/components/pet-avatar.tsx`, como fijó la R5 de #40. El hero no importa
`blobatar` ni `expo-image`: llama a `PetAvatar`.

Para que `PetAvatar` pueda pintar un rectángulo a sangre en vez de un círculo de
72 px, se le añaden **exactamente tres cosas**, todas usadas por el hero y dos de
ellas útiles también para los llamantes actuales:

| Cambio | Firma | Efecto |
|---|---|---|
| Tamaño rectangular | `size: number \| { width: number; height: number }` | Con `number`, comportamiento actual **idéntico** (círculo, `borderRadius: size / 2`, `SvgXml` cuadrado). Con objeto: `width`/`height` del objeto, **sin** `borderRadius`, y `SvgXml` con su `preserveAspectRatio` por defecto (`xMidYMid meet`), que escala el blob al lado menor y lo centra |
| Clave de caché | `cacheKey?: string` | Se pasa dentro de `source`. Sin ella, `source` sigue siendo `{ uri }` byte a byte. Ver §7.2 |
| Degradación al fallar la foto | ninguna prop: estado interno + `onError` | Si `expo-image` no puede cargar la foto, el componente conmuta a la rama blobatar. Es la respuesta a "¿y si la URL caduca?" (§7.3), y la ganan de rebote todos los llamantes |

Tres cambios, un fichero, cero props de contenido nuevas y ningún camino muerto.
La alternativa —que el hero monte su propio `<Image>` y delegue sólo el
blobatar— dejaría la lógica de "la foto manda" duplicada en dos ficheros y
contradiría la R5 de #40, que centralizó ese render a propósito.

`pet-avatar.tsx` está bajo el candado de la R9 de `design-drift.test.ts:89-157` (ni hex ni
la palabra `StyleSheet`): ninguno de los tres cambios lo viola.

**El blobatar no trae fondo.** Verificado sobre la salida real del paquete
(`blobatar@2.5.0`): el SVG es `viewBox="0 0 100 100"` con la mancha y nada más —
el resto es transparente, y el color de la mancha es determinista por nombre pero
**arbitrario en tono y luminancia** (`#d887ce`, `#f8c696`, `#78a6fc`, `#fad03e`,
`#009d81`…). Es decir: sin foto, el fondo del hero es tan poco acotado como con
foto, y la misma banda opaca de §3 lo resuelve sin un caso especial. Debajo del
blobatar se ve el `bg-default` del hero, que es el que da el rectángulo.

---

## 6. El slot: el hero no conoce al selector — sirve a R4

Decisión humana del 2026-09-06 (D2), no re-litigada. El hero expone `children`
para su zona superior y nada más. En `home.tsx` se monta dentro el
`src/components/pet-switcher.tsx` que ya existe, con sus props actuales
(`pets`, `selectedPetId`, `onSelect`) y sus `testID` intactos
(`pet-chip-${id}`, `pet-avatar-image-${id}`, `pet-avatar-fallback-${id}`).
Profile no pasa slot.

Que el hero no importe `pet-switcher` es lo que le permite ser compartido: si lo
importara, Profile arrastraría un selector que ya monta por su cuenta
(`profile/index.tsx:240-244`) y habría dos.

**Sin slot no hay zona superior.** No se renderiza ni la banda ni
`pet-hero-fade-top`: en Profile, gastar 60 px de fondo de app arriba de la foto
sería tirar alto de fotografía sin motivo.

El `insets.top + 12` lo aplica el hero cuando hay slot, con `useSafeAreaInsets`.
No se añade una prop `topInset` porque hoy la única pantalla con slot es la única
que toca la barra de estado; el día que aparezca una con slot a media pantalla,
ése será el momento de la prop, no antes.

---

## 7. Los datos: de dónde sale cada cosa y qué pasa cuando caduca — sirve a R2b, R7

### 7.1 `photoUrl`

| Pantalla | Origen | Petición nueva |
|---|---|---|
| Home | `detail.data.pet.photoUrl`, de `getPet` (`src/api/pets.ts:85`), tal y como hoy en `home.tsx:174` | **Ninguna** |
| Profile | el mismo detalle que ya pide (`profile/index.tsx`) | **Ninguna** |

Corrige la premisa del encargo: Home **no** toma `photoUrl` del listado. Lo que
#66 desbloqueó en Home es `pet-switcher`, que sí lee `pet.photoUrl` del listado
(`pet-switcher.tsx:39`) y hasta `303fc19` lo recibía siempre `null`. Con #66
mergeada, los chips del selector estrenan foto **sin que #67 toque una línea del
switcher**: es una mejora que llega de balde al montarlo en el slot.

Política de firmado vigente (#66 D1): se firma **siempre**, para toda mascota con
`photoKey`, sin `?include` y sin caché de URLs, con
`PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS = 3600`. `device` sigue llegando `null` en
el listado (OD-3 de #66) y el hero **no lo usa**: la píldora de conectividad está
fuera de alcance.

### 7.2 La caché de `expo-image` y la URL prefirmada

`expo-image@57.0.3`, verificado en
`node_modules/expo-image/build/Image.types.d.ts`:

- `cachePolicy` vale `'disk'` por defecto (`:207`).
- *"The cache key used to query and store this specific image. If not provided,
  the `uri` is used also as the cache key"* (`:45-49`).

Consecuencia concreta y desagradable: una URL prefirmada **cambia en cada
petición** (`X-Amz-Date`, `X-Amz-Signature`), así que con la clave por defecto
**cada refetch del detalle produce una clave de caché nueva** — la foto se vuelve
a descargar entera y el disco acumula una entrada por firma. La caché de disco no
acierta jamás.

Por eso el hero pasa `cacheKey={pet.id}` (§5). El identificador de la mascota es
estable y la foto de una mascota es única, así que la caché acierta entre
refetches y entre sesiones. Es una línea y arregla el desperdicio de raíz.

*(El mismo problema lo tiene `pet-switcher.tsx:40-42`, multiplicado por N
mascotas, ahora que #66 le da URLs de verdad. Queda anotado; arreglarlo es tocar
un componente compartido y no entra en #67.)*

### 7.3 Qué pasa si la URL caduca con la pantalla abierta

Tres escenarios, los tres cerrados:

1. **Imagen ya cargada, URL caducada.** No pasa nada visible: `expo-image` sirve
   de su caché de disco bajo la clave estable y no vuelve a pedirla a S3. El TTL
   de 3600 s es además mucho mayor que cualquier permanencia plausible en una
   pantalla.
2. **Caché fría y URL caducada** (la app estuvo suspendida más de una hora y
   vuelve antes de refrescar). S3 responde 403, `expo-image` dispara `onError`, y
   `PetAvatar` conmuta a la rama **blobatar** (§5). El usuario ve el avatar
   determinista de su mascota, no un hueco ni un icono roto. Sin `Alert`, sin
   texto de error: no es un fallo del que el usuario pueda hacer nada.
3. **Recuperación.** Cualquier refetch del detalle vuelve a firmar:
   `pet-hero-retry`, el cambio de mascota, o el `detail.refetch()` que ya dispara
   la subida de foto en Profile (`profile/index.tsx:157-209`).

### 7.4 El dato destacado

`steps` **no existe**: cero ocurrencias en `mobile-pet-tracker/src/`, ausente de
`DayEntry` (`src/api/types.ts:79-90`) y `activitySummary` sale siempre `null` del
mapper del backend (`pet-profile-response.mapper.ts:46`). Es la decisión abierta
**D** del informe de origen, y es de hardware: hasta que no se confirme que el
collar reporta podómetro, no hay nada que pintar.

`walkCount` es el sustituto correcto y no es un premio de consolación:

- Es una métrica de **hoy**, como los pasos del Make.
- **Ya viene descargada**: sale del mismo `DayEntry` que Home usa en
  `home.tsx:96-99` para `summary-activity`, `summary-sleep` y `summary-distance`.
  Cero peticiones nuevas.
- **No se pinta en ninguna pantalla hoy** (grep en `src/`: `walkCount` sólo
  aparece en `types.ts`). Así que el hero no duplica ningún dato ya visible — lo
  que sí pasaría con los minutos activos o la distancia, que están tres tarjetas
  más abajo.
- Es la primera columna que el propio Make pone en su tira de estadísticas, con
  la palabra **"Paseos"** (`design-src/App.tsx:373`), que es la que se adopta por
  la regla D4 del catálogo (*manda la palabra del diseño*).

El hero lo recibe **ya formateado** (`{ value, label }`) y no sabe de dónde sale.
Profile no pasa `highlight` porque no descarga actividad y añadir una petición a
Profile para llenar un hueco decorativo sería gasto sin usuario. El bloque de
nombre y raza ocupa entonces todo el ancho.

`'—'` cuando `walkCount` es `null`, que es lo que ya devuelven `fmtMinutes`
(`home.tsx:39-43`) y `fmtKm` (`:45-47`). `style={TABULAR_NUMS}` en el número,
micro-regla de pulido de la carta.

---

## 8. Archivos afectados

Nada de `backend-pet-tracker/`. Es una feature de UI pura.

**Nuevos**

- `mobile-pet-tracker/src/components/pet-hero-header.tsx` — el componente
  compartido y sus dos constantes (R1–R4, R7, R8).
- `mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx` —
  R1, R2, R3, R4, R8.
- `mobile-pet-tracker/src/__tests__/hero-header-amendments.test.ts` — R10.

**Modificados — código**

- `mobile-pet-tracker/src/components/pet-avatar.tsx` — los tres cambios de §5
  (R2, R2b).
- `mobile-pet-tracker/src/app/(tabs)/home.tsx` — muere el pet-card inline
  (`:168-190`) y el `<PetSwitcher>` suelto (`:145-151`); nace el hero como primer
  hijo con el switcher dentro; reestructura del `contentContainerStyle` (§4.2);
  `highlight` con `walkCount` (R5, R5b, R7, R8b).
- `mobile-pet-tracker/src/screens/profile/index.tsx` — muere la función local
  `PetHero` (`:62-84`) y su llamada (`:277`); nace `<PetHeroHeader variant="card">`
  (R6).
- `mobile-pet-tracker/src/i18n/catalog.ts` — la clave `home.walks` en `en` y en
  `es` (R7b).

**Modificados — tests existentes** (deltas en R9b, nunca números escritos a mano)

- `src/app/(tabs)/__tests__/home.test.tsx` — reancla los siete `testID` de R5.
- `src/screens/profile/index.test.tsx` — reancla `profile-pet-photo`.
- `src/components/__tests__/pet-avatar.test.tsx` — R2.
- `src/__tests__/consistency-classnames.test.ts` — `CONTINUOUS_CORNER` (#62 R14),
  `bg-accent-soft` (#64 R9), skeleton de Home (#62 R2).
- `src/__tests__/design-drift.test.ts` — añade el fichero nuevo al candado R9.
- `src/__tests__/ui-copy-table.ts` + `src/__tests__/ui-language.test.ts` — la
  fila y la longitud de `R3_HOME`.

**Modificados — documentación** (todos con bloque de enmienda firmable, R10)

- `specs/mobile-figma-polish/design.md` (A1, A3, A4, A6)
- `specs/mobile-figma-polish/requirements.md` (A2, A5)
- `specs/mobile-pets-profile/requirements.md` (A7)
- `docs/ui-guidelines.md` (A8, A9)
- `docs/conventions.md` (A9)
- `specs/mobile-ui-language/design.md` §2.3 — registra `home.walks` (R7b)

**Capas**: la app móvil no tiene capas domain/application/infrastructure; el
equivalente que fija `docs/conventions.md` §app móvil es *route delgado + screen
body + componente compartido*. `pet-hero-header.tsx` es componente compartido
porque cumple la regla de extracción de la carta §Decisiones fijas 4: dos
pantallas, rol nombrable ("hero"), y API (cuatro props) menor que la
implementación.

---

## 9. Bloque canónico de enmienda (R10)

Este es el literal que se inserta en cada fichero de la tabla A1–A9,
sustituyendo `<FEATURE>` por el nombre de la feature enmendada y
`<QUÉ CAMBIA>` por la celda correspondiente de la tabla. El test de R10 lo lee
**de aquí**, no de una copia, para que esta spec siga siendo la única fuente del
literal — misma técnica que `src/__tests__/ui-language.test.ts:166-183`.

```markdown
## Enmienda #67 — cabecera fotográfica compartida

`mobile-pet-hero-header` (#67) modifica una decisión que esta spec dejó
aprobada. La spec de origen es `specs/mobile-pet-hero-header/`; el detalle de
la enmienda está en su `requirements.md` §R10.

- Spec enmendada: `<FEATURE>`
- Qué cambia: `<QUÉ CAMBIA>`
- Qué NO cambia: ningún otro requisito de esta spec, ni su estado de
  aprobación, ni los tests que ya la cubren.

- [ ] Enmienda aprobada por humano
```

La línea de firma se entrega **sin marcar**. La marca el humano, y git lo
registra.

---

## 10. Corrección propuesta para `feature_list.json` #67 — la aplica el humano

Ningún agente edita esto. El texto está listo para pegar.

**En `description`**, sustituir:

> Decision B cerrada por el humano el 2026-09-04: cuando la mascota NO tiene
> foto, el hero se pinta como DEGRADADO CON LA INICIAL, que es el patron que ya
> usa pet-avatar en el repo -cero assets nuevos, cero decisiones de arte,
> funciona siempre-.

por:

> Decision B cerrada por el humano el 2026-09-04 y CORREGIDA el 2026-09-06:
> cuando la mascota NO tiene foto, el hero pinta el BLOBATAR determinista de la
> mascota a sangre, escalado al alto de la zona de medios. La redaccion
> anterior decia "degradado con la inicial, que es el patron que ya usa
> pet-avatar" y era falsa de origen: pet-avatar.tsx:29-36 pinta blobatar(name)
> con SvgXml, y la R5 aprobada de #40 (2026-08-21) sustituyo explicitamente el
> fallback de inicial por blobatar. El error venia de
> progress/explore_design-gap-vs-make.md:659-661 y se propago tambien a
> docs/ui-guidelines.md §Direccion de arte 2. Cero assets nuevos, cero
> decisiones de arte, funciona siempre — igual que antes, pero con el
> componente que de verdad existe.

**En `acceptance_criteria`**, sustituir el criterio 2:

> "Sin foto, el hero pinta degradado con la inicial y sigue siendo legible: el
> texto encima pasa AA en los dos temas, con el contraste calculado en la spec"

por:

> "Sin foto, el hero pinta el blobatar de la mascota a sangre y sigue siendo
> legible: el texto encima pasa AA en los dos temas, con el contraste calculado
> en la spec"

---

## Alternativas descartadas

- **`expo-linear-gradient`.** Dependencia nueva, prohibida por
  `specs/mobile-figma-polish/design.md:97-98` y por el criterio de #67 ("ninguna
  dependencia nueva"). RN 0.86.2 lo resuelve nativamente (§2.1) y la propia
  skill `expo-native-ui` dice literalmente *"Do NOT use `expo-linear-gradient`"*.
- **`bg-linear-to-b` / `bg-gradient-to-b` de Tailwind.** No resuelven en este
  proyecto. Comprobado ejecutando el compilador (§2.2), no supuesto.
- **`<LinearGradient>` de `react-native-svg`.** Funciona, pero exige montar un
  árbol SVG completo para rellenar un rectángulo (§2.3).
- **Texto sobre la foto con el velo del Make.** Da 1,98:1 con blanco sobre el
  peor caso y no hay velo que salve a la vez al blanco y al acento (§3.2).
- **Subir el velo a α = 0,54 para salvar el blanco.** Pasa AA y destruye la
  fotografía, que es lo único que esta feature aporta (§3.2).
- **Cambiar `pet-switcher` para que sobreviva sobre una foto.** Toca un
  componente compartido por cinco pantallas y su recuento pineado de
  `bg-accent-soft`, para resolver un problema que desaparece poniendo el slot
  sobre banda opaca (§3.3).
- **`variant="bleed"` también en Profile.** Obligaría a partir el
  `contentContainerStyle` de Profile en tres envoltorios y a romper el candado de
  métricas de `profile/index.test.tsx:346-351`, sin ganancia visual: en Profile
  el hero va a media pantalla (§1).
- **Un token `--hero-height` en `global.css`.** Valor de un solo uso; la carta
  pide token a partir de la segunda repetición (§4.1).
- **Copiar los 340 px del Make como alto total.** Con bandas opacas dejaría menos
  de 100 px de fotografía (§4.1).
- **Que el hero monte su propio `<Image>` y delegue sólo el blobatar.**
  Duplicaría la lógica de "la foto manda" en dos ficheros y contradiría la R5 de
  #40, que la centralizó (§5).
- **Pasar `DayEntry` al hero y que él formatee.** Acoplaría un componente
  compartido a `src/api/activity.ts` y a la forma de la respuesta de actividad,
  para ahorrar dos líneas en el llamante (§7.4).
- **Añadir una petición de actividad a Profile para que también tenga dato
  destacado.** Una petición de red para rellenar un hueco (§7.4).
- **Snapshot del hero.** Congelaría el markup y rompería con cualquier ajuste
  visual futuro, que es exactamente lo contrario de lo que hace falta en una
  feature cuyo gate es un smoke visual. Mismo criterio que
  `specs/mobile-figma-polish/design.md:149-150`.
