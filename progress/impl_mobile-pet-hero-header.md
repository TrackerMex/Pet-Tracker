# impl: mobile-pet-hero-header
Fecha: 2026-09-07
Branch: `feature/67-mobile-pet-hero-header` (base `d9d5fa6`)
Spec: `specs/mobile-pet-hero-header/` — los cuatro ficheros en `status: approved`,
firmados por el humano el 2026-09-07 (`8cf28e5`).

Skills cargadas antes de tocar código, en el orden que manda
`docs/ui-guidelines.md` §Skills: `expo:expo-overview` →
`expo:expo-design-system`, `expo:expo-native-ui`, `appllama-app-design-skill`.
Límite 1 de la carta respetado: de las skills se tomó el patrón (tres franjas
apiladas, jerarquía, skeleton dimensionado, `borderCurve: 'continuous'`), nunca
su sistema de estilos — cero `Color.ios.*`, cero `StyleSheet.create`, cero hex.

`mobile-pet-tracker/.expo/types/router.d.ts` no existía; nada que borrar.
`pgrep` antes de `./init.sh`: ninguna otra pasada corriendo (hay tres worktrees
hermanos, ninguno activo).

---

## Archivos creados

- `mobile-pet-tracker/src/components/pet-hero-header.tsx` — la cabecera
  fotográfica compartida: root con las dos variantes, slot opcional con
  `insets.top + 12`, zona de medios de `PET_HERO_MEDIA_HEIGHT`, las dos franjas
  de degradado y la banda inferior opaca con nombre, raza y dato destacado.
  Exporta `PetHeroHeader`, `PetHeroHeaderProps`, `PetHeroHighlight`,
  `PET_HERO_MEDIA_HEIGHT` y `PET_HERO_FADE_HEIGHT`.
- `mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx` —
  R1, R2, R3, R3b, R4, R8 (22 tests).
- `mobile-pet-tracker/src/__tests__/hero-header-amendments.test.ts` — R10.

## Archivos modificados — código

- `mobile-pet-tracker/src/components/pet-avatar.tsx` — los tres cambios de
  `design.md` §5 y ninguno más: `size` acepta objeto rectangular, `cacheKey`
  opcional dentro de `source`, y estado interno que degrada al blobatar cuando
  `onError` del `Image` dispara.
- `mobile-pet-tracker/src/app/(tabs)/home.tsx` — muere la pet card inline y el
  `<PetSwitcher>` suelto; nace el hero `variant="bleed"` como primer hijo con el
  switcher dentro; `contentContainerStyle` pierde `padding` y `paddingTop`
  (excepción A9) y el padding horizontal baja a dos envoltorios; la card de
  error del detalle pasa a `pet-hero-error` / `pet-hero-retry`; `highlight` con
  `today.walkCount`.
- `mobile-pet-tracker/src/screens/profile/index.tsx` — muere la función local
  `PetHero` y su llamada; nace `<PetHeroHeader pet={pet} variant="card" />`;
  `profile-hero-skeleton` conserva su nombre y sube de `h-56` a `h-80`.
- `mobile-pet-tracker/src/i18n/catalog.ts` — `home.walks` en `en` (`Walks`) y en
  `es` (`Paseos`).

## Archivos modificados — tests y candados

- `src/app/(tabs)/__tests__/home.test.tsx` — los siete `testID` reanclados
  conducta a conducta, más los describes nuevos de R5, R7 y R8b.
- `src/screens/profile/index.test.tsx` — `profile-pet-photo` reanclado a
  `pet-hero-media` en `:364` y `:588`, más el describe de R6.
- `src/components/__tests__/pet-avatar.test.tsx` — R2 y R2b.
- `src/__tests__/design-drift.test.ts` — `components/pet-hero-header.tsx`
  entra en la lista de la R9.
- `src/__tests__/consistency-classnames.test.ts` — deltas de R9b.
- `src/__tests__/ui-copy-table.ts` + `src/__tests__/ui-language.test.ts` —
  `R3_HOME` +1.
- `src/providers/__tests__/language-provider.test.tsx` — recuento del catálogo
  259 → 260 (delta que la tabla de R9b no enumeraba; ver §Notas).

## Archivos modificados — documentación (R10, sin firmar)

`specs/mobile-figma-polish/design.md` (A1, A3, A4, A6),
`specs/mobile-figma-polish/requirements.md` (A2, A5),
`specs/mobile-pets-profile/requirements.md` (A7), `docs/ui-guidelines.md`
(A8, A9), `docs/conventions.md` (A9), y `specs/mobile-ui-language/design.md`
§2.3 (registro de `home.walks`, R7b — sin bloque de enmienda, no es una
decisión enmendada).

Los cinco documentos enmendados llevan su edición en prosa **y** el bloque
canónico de `design.md` §9 con `- [ ] Enmienda aprobada por humano` **sin
marcar**. Ningún agente firmó nada. La corrección A10 de `feature_list.json`
sigue sin aplicar: la aplica el humano con el texto de `design.md` §10.

---

## Requisitos cubiertos

Historial test-primero, un requisito cada vez, en el orden que fija `tasks.md`
(R1 → R2 → R3 → R4 → R8 → R5 → R6 → R7 → R9 → R10). Cada R-id tiene su commit
rojo y su commit verde separados; ninguno mezcla implementación con test.

| R-id | Rojo | Verde |
|---|---|---|
| R1 | `4c3f958` | `c467df7` |
| R2, R2b | `4985341` | `dafce41` |
| R3, R3b | `559b5e0` | `2dd81ed` |
| R4 | `42f7c1c` | `f0ceb21` |
| R8 | `fba8736` | `63a4799` |
| R5, R5b, R8b | `0918704` | `560fe57` |
| R6 | `3240995` | `87477fe` |
| R7, R7b | `ee45154` | `0ed208c` (+ `ab061fe`) |
| R9, R9b | verificación (vía b) | `b85b21d`, `7fecffe` |
| R10 | `591ec19` | `2bf868d` |

Commits de andamio, todos con prefijo `test(...)` y todos explicados en su
cuerpo: `37196dc` (jest-expo no resuelve `await import()` dentro de un `it`),
`8bb2c2d` (expo-image lee `event.nativeEvent`, así que el payload desnudo
reventaba dentro del componente en vez de fallar en la aserción), `21d50a6`
(tipado del spy sobre la firma sobrecargada de `Uniwind.getCSSVariable`).
Tras `8bb2c2d` se volvió a comprobar el rojo con el andamio ya correcto: con
`pet-avatar.tsx` en su versión previa, los cuatro `it` de R2 fallan **por su
propia aserción** (`toMatchObject`, `toBe`, `toEqual`, `toContain`), no por un
`ReferenceError`.

`941b603` es un `fix` de una línea: el comentario de `PET_HERO_MEDIA_HEIGHT`
contenía el literal de una clase arbitraria y el grep de C8 escanea también los
comentarios. Lo detectó el propio candado.

---

## Prueba de mutación (R9, vía (b) de C4)

Las tres mutaciones de `tasks.md` R9 (1), plantadas **de una en una** en
`src/components/pet-hero-header.tsx` —el fichero nuevo, que es la zona ciega— y
revertidas después. Cada una se plantó donde un implementer descuidado la
escribiría de verdad, no en un sitio decorativo. Las tres cayeron **por la
aserción del candado**, y las tres nombraron el fichero nuevo en el array
recibido:

**1. `rounded-2xl` en el radio de la variante `card`** (sustituyendo
`rounded-card` en el `className` del root, que es exactamente donde se elige el
radio):

```
● #62 R4: la app solo usa los radios de la escala declarada ›
  no deja la clase fuera de escala rounded-2xl en producción
    - Array []
    + Array [ "components/pet-hero-header.tsx", ]
```

**2. Hex literal dentro de la cadena del degradado** (`${background}` → `#FFFFFF`
en `experimental_backgroundImage`, que es el sitio donde el token es más fácil
de saltarse "por ser un color de adorno"):

```
- experimental_backgroundImage: `linear-gradient(to bottom, ${background}00 0%, ${background} 100%)`,
+ experimental_backgroundImage: `linear-gradient(to bottom, #FFFFFF00 0%, #FFFFFF 100%)`,

● R9: mobile-pets-profile sin drift › keeps arbitrary text, hex colors,
  and StyleSheet out of feature sources
    - Array []
    + Array [ "components/pet-hero-header.tsx", ]
```

Esta es la que demuestra que añadir el fichero a la lista de la R9 de
`design-drift.test.ts` (`b85b21d`) no era decorativo: sin esa fila el hex habría
pasado, porque el candado enumera ficheros.

**3. Clase arbitraria `h-[260px]` en vez de la constante** (sustituyendo
`style={{ height: PET_HERO_MEDIA_HEIGHT }}` en la zona de medios):

```
- <View style={{ height: PET_HERO_MEDIA_HEIGHT }}>
+ <View className="h-[260px]">

● C8: la UI no usa clases arbitrarias ›
  no deja ninguna clase Tailwind con valores entre corchetes
    - Array []
    + Array [ "components/pet-hero-header.tsx", ]
```

Log completo en
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/f6a5ba95-586b-45f3-9449-005414729086/scratchpad/mutation.log`
(fuera del repo, como corresponde a un artefacto de sesión).

Tras revertir las tres, `git status` limpio y la suite verde.

---

## Deltas de R9b, medidos con el grep, no escritos a mano

Cada número sale de `git grep` contra `303fc19` y contra `HEAD`:

| Candado | `303fc19` | HEAD | Delta | ¿Coincide con R9b? |
|---|---:|---:|---:|:--:|
| `style={CONTINUOUS_CORNER}` en `screens/profile/index.tsx` | 4 | 3 | −1 | ✅ |
| `style={CONTINUOUS_CORNER}` en `components/pet-hero-header.tsx` | — | 1 | +1 (fila nueva) | ✅ |
| Total `CONTINUOUS_CORNER` (suma + los 2 de `card.tsx`) | 33 | 33 | sin cambio | ✅ |
| `bg-accent-soft` global | 17 | 16 | −1 | ✅ |
| `text-accent-strong` total / en profile | 13 / 1 | 13 / 1 | sin cambio | ✅ |
| filas de `R3_HOME` | 20 | 21 | +1 | ✅ |
| filas de `R7_PROFILE` | 35 | 35 | sin cambio | ✅ |
| fila del skeleton de Home en #62 R2 | `pet-card-skeleton` + `h-32 w-full rounded-card` | `pet-hero-skeleton` + altura por `style`, sin radio | editada, no contada | ✅ |
| **claves del catálogo** (`language-provider.test.tsx`) | 259 | 260 | **+1** | ⚠️ no estaba en la tabla |

La última fila es la única desviación: R9b enumeraba el candado de `R3_HOME` de
`ui-language.test.ts` pero no el de recuento de claves de
`language-provider.test.tsx:40`, que también se mueve con toda clave nueva. El
delta es +1, es consecuencia mecánica de R7b y no hay forma de evitarlo sin no
añadir la clave. Queda registrado aquí para que el reviewer lo vea como delta
declarado y no como número tocado por su cuenta (`ab061fe`).

---

## Decisiones de diseño

- **`size: number | { width: number | '100%'; height: number }` en `PetAvatar`.**
  `requirements.md` R2 escribe el tipo como `{ width: number; height: number }`,
  pero `design.md` §1 y `tasks.md` R2 (2) mandan llamarlo con
  `size={{ width: '100%', height: PET_HERO_MEDIA_HEIGHT }}` — y sin
  `useWindowDimensions` (que la spec no pide) no hay número que dé el ancho de
  pantalla. Se resolvió **ensanchando**, nunca estrechando: el tipo de la spec
  sigue siendo asignable, el test prescrito (`size={{ width: 300, height: 260 }}`)
  pasa tal cual, y `'100%'` vale a la vez como `DimensionValue` de `Image` y
  como `NumberProp` de `SvgXml`. Ver §Notas para el reviewer.
- **El estado de fallo de foto guarda la URL que falló, no un booleano.** Con un
  booleano, una mascota cuya URL caduca se quedaría en blobatar para siempre
  aunque el refetch trajese una firma nueva; `design.md` §7.3 escenario 3 exige
  justo lo contrario. Guardando la URL, el reintento se resuelve solo sin
  `useEffect` ni prop nueva.
- **`style={CONTINUOUS_CORNER}` se aplica siempre en el root del hero**, no solo
  en `variant="card"`. Sobre un radio 0 `borderCurve` no hace nada, y así el
  candado literal de #62 R14 (`/style=\{CONTINUOUS_CORNER\}/g`, exactamente 1)
  se cumple sin duplicar el árbol JSX en dos ramas.
- **Las franjas de degradado siguen montadas con `pet={null}`.** R8 pide que el
  layout no salte al resolver; mantener la estructura idéntica y cambiar solo el
  contenido de la zona de medios es lo que lo garantiza, y es menos código que
  condicionar las franjas.
- **El título `home.home` se pinta solo cuando no hay hero.** Ver §Notas: es el
  único punto donde la spec calla y hubo que decidir.
- **`profile-hero-skeleton` pasa de `h-56` (224) a `h-80` (320).** R6 dice que
  «solo cambia de dimensión» sin dar el número. El hero en `variant="card"` mide
  ≈260 de foto + ≈72 de banda ≈ **332**; `h-80` es el escalón de la escala más
  cercano y no hay clase arbitraria posible. Ningún candado fija ese valor.

---

## Output de build

`BUILD_CMD` corre dentro de `./init.sh`:

```
✅ Build exitoso
```

## Output de tests (`./init.sh` completo, exit code 0)

```
✅ Build exitoso
Test Suites: 163 passed, 163 total      ← backend
Tests:       1243 passed, 1243 total
Test Suites: 2 passed, 2 total          ← infra
Tests:       14 passed, 14 total
Test Suites: 65 passed, 65 total        ← móvil
Tests:       976 passed, 976 total
✅ Tests pasados
Test Suites: 3 skipped, 25 passed, 25 of 28 total   ← e2e
Tests:       8 skipped, 354 passed, 362 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

Delta contra el baseline de `303fc19` (móvil 932/932 en 63, backend 1243/1243 en
163, infra 14/14, e2e 354 con 8 saltados):

| Suite | Baseline | Ahora | Delta |
|---|---|---|---|
| móvil | 932 en 63 suites | 976 en 65 suites | **+44 tests, +2 suites** |
| backend | 1243 en 163 | 1243 en 163 | sin cambio |
| infra | 14 en 2 | 14 en 2 | sin cambio |
| e2e | 354 pasados, 8 saltados | 354 pasados, 8 saltados | sin cambio |

Las dos suites nuevas son `pet-hero-header.test.tsx` y
`hero-header-amendments.test.ts`. Ningún assert de conducta se debilitó ni se
borró: los que estaban anclados a `pet-card-*` se **reescribieron** contra su
sustituto, uno a uno, y siete de ellos además se convirtieron en aserciones
`queryByTestId(...) === null` que impiden que el nombre viejo vuelva.

El test flaky de add-pet (#72) **no** apareció en ninguna de las pasadas.

---

## Grep-clean (criterio permanente)

Sobre `mobile-pet-tracker/src/`, excluyendo `src/theme/` y los tests:

```
hex fuera de src/theme:   0
clases arbitrarias [...]: 0
StyleSheet.create:        0
shadow/elevation legacy:  0   (el único hit es la propia regex del candado)
```

## C7 — nada huérfano

`grep` de `pet-card`, `profile-pet-photo` y `PetHero` (sin `PetHeroHeader`) en
`src/`: cero resultados en producción. Los únicos hits vivos son las aserciones
que comprueban que esos `testID` ya **no** existen y un comentario que explica
el delta de `bg-accent-soft`. No queda ningún fichero de test de código
eliminado, porque el `PetHero` local de Profile no tenía fichero propio.

---

## Notas para el reviewer

1. **Dos testID nuevos en Home que la spec no nombra: `home-states` y
   `home-content`.** Son los dos envoltorios que R5b exige
   (`{ paddingHorizontal: 24, paddingTop: insets.top + 12, gap: 16 }` para las
   ramas de estado y `{ paddingHorizontal: 24, gap: 16 }` para el contenido
   bajo el hero). Sin un ancla no hay forma de aserta que existen y con qué
   estilo, y R5b es un requisito medible. La spec prohíbe que testID
   desaparezcan o cambien, no que se añadan.

2. **El título `home.home` ya no se pinta cuando hay hero.** Es el único punto
   donde la spec calla y tuve que decidir. R5 manda que el hero sea el **primer
   hijo** del scroll y R5b que todo lo de debajo vaya en un envoltorio con
   padding; dejar el `<Text>Inicio</Text>` ahí lo pondría *bajo* la fotografía,
   que falla el check de jerarquía de la lista de autocrítica de la carta. La
   clave sigue teniendo **exactamente una** llamada `t('home.home')` en
   `home.tsx` —así que `R3_HOME` cuadra sin tocar su fila— y se sigue pintando
   en las tres ramas sin mascota (carga, error, vacío). Si el humano quiere el
   título también con hero, es una línea. **Merece su ojo en el smoke.**

3. **`PetAvatar.size` acepta `'100%'` además de `number`.** Es la única
   discrepancia real entre `requirements.md` R2 (que escribe
   `{ width: number; height: number }`) y `design.md` §1 / `tasks.md` R2 (2)
   (que llaman con `width: '100%'`). Elegí el ensanchamiento porque satisface
   los dos documentos y no debilita ningún test; la alternativa —medir el ancho
   con `useWindowDimensions`— añade una API que la spec no pide. Si el reviewer
   prefiere la lectura literal de R2, la alternativa está a una línea, pero
   entonces el hero deja de sangrar.

4. **El candado del token `background`.** R3 pide que `useThemeColors(['background'])`
   resuelva a hex de 6 dígitos en los dos temas. Está implementado leyendo los
   valores **reales** de `global.css` (mismo parser de llaves que
   `global-css.test.ts`) y pasándolos por `useThemeColors` con un
   `jest.spyOn(Uniwind, 'getCSSVariable')`. Mockear el valor y luego afirmar
   sobre el mock no probaría nada; así el candado salta de verdad si algún día
   `--background` deja de ser `#RRGGBB`.

5. **Dónde mirar en el smoke, además del guion de `requirements.md` §Aprobación**:
   la transición del degradado con foto muy clara y muy oscura (la franja es de
   64 px y el stop transparente se escribe como `${background}00`, no
   `transparent`, justo para que no aparezca gris), y el recorte de la foto:
   `contentFit="cover"` sobre 260 px de alto puede dejar fuera la cara del
   animal en fotos verticales.

6. **Ningún push, ningún `done`, ninguna casilla firmada.** `feature_list.json`
   y `progress/current.md` sin tocar. `backend-pet-tracker/` sin tocar (0
   ficheros en el diff).
