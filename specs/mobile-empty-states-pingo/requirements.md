---
feature: "mobile-empty-states-pingo"
status: approved       # draft | approved
tags: [harness, spec, mobile, ui-delight]
---

# Requisitos — [[mobile-empty-states-pingo]] (#155)

## Contexto

Los estados vacíos de la app son hoy una línea de texto gris. Esta feature
pone a Pingo, la mascota de #153, en los vacíos que ocupan la pantalla: su
pose, un título y una frase con su voz. Los vacíos que viven dentro de una
tarjeta o junto a la acción que los resuelve se quedan en texto, y la spec
los nombra uno a uno. Es la candidata D de
`progress/explore_ui-delight-appllama.md` §4.

**Base medida.** Todo recuento y toda ancla de esta spec se midió una sola vez
sobre `origin/main` `36c8050d` más los tres commits de harness del leader
(`f5df3b00`, `f23fdc9d`, `c31a738d`), que no tocan `mobile-pet-tracker/`.

**Dependencia de #153.** #153 (`mobile-welcome-pingo`) se leyó en
`origin/feature/153-mobile-welcome-pingo` a `19a4178e`, con su enmienda E1.
A esa altura #153 es **solo spec**: su código aún no existe en ningún árbol
(medido: a `19a4178e`, `language-provider.test.tsx` no contiene `#153 R1` y
`specs/mobile-ui-language/design.md` no tiene §2.20). Todo dato de #153 que
cita esta spec sale del texto de su spec y lleva la marca **«re-verificar al
merge de #153»**. La implementación de #155 espera a ese merge. Antes del
handoff, el leader re-mide las anclas marcadas (design.md §Dependencia de
#153).

**Medición de los estados vacíos.** Desde `mobile-pet-tracker/`:

- `grep -n 'testID="[a-z-]*empty' src/screens/*/index.tsx` da **16** testID;
- fuera de ese glob hay **4** testID `*empty` en 3 ficheros:
  `src/components/weight-chart.tsx` (1), `src/app/(tabs)/food.tsx` (2) y
  `src/screens/home/weekly-activity-chart.tsx` (1);
- el glob no ve **`map-no-pets`**, el vacío «sin mascotas» de la pestaña Mapa
  (`src/screens/map/index.tsx`), que es el mismo estado que `home-empty`,
  `health-empty` y `food-empty`.

Son **21 testID** y **20 estados**: `map-empty` y `map-empty-overlay` son un
solo estado (el `Text` y la `Card` que lo envuelve).

## Decisiones del humano

Relatadas en la descripción de #155 y en la de #153; no se repiten las
citas literales, que viven en `specs/mobile-welcome-pingo/requirements.md`
§Decisiones del humano.

- **D1. Pingo con voz B, guardián sereno.** Rige todo el copy nuevo. La voz
  se escribe en `docs/ui-guidelines.md` §Dirección de arte, punto 7, que
  añade #153 R2 (re-verificar al merge de #153).
- **D2. Las poses entran como WebP.** Las doce poses PNG de
  `/home/claude/pet-tracker-mascot/` se convierten con el comando de #153;
  de celebrate y worried solo valen las `-v2`. Esta spec mete las seis que
  usa (R2).
- **D3. Reanimated + PNG, sin dependencias nuevas.** Ni Lottie, ni Rive, ni
  `expo-linear-gradient` (R11).
- **D4. El CTA con labio va solo en bienvenida y celebraciones.** Los vacíos
  usan el `Button` normal de heroui (`rounded-xl bg-accent`), sin
  `border-b-4` (R3).
- **Referencia visual.** El artboard *InicioVacio* del canvas aprobado el
  2026-10-06 (`design-src/inicio-vacio.dc.html`). Su copy no está aprobado y
  esta spec no lo usa. Del artboard se toma la composición (pose centrada
  sobre título y frase, CTA debajo); el óvalo, las huellas, la sombra, el
  flotado y el CTA con labio quedan fuera (§Decisiones abiertas A3 y A5).

## Clasificación de los estados vacíos

**Criterio.** Un vacío se ilustra cuando es el contenido principal de su
pantalla: el usuario llega y no hay nada más que ver, salvo la cabecera o una
acción fija. Se queda en texto cuando vive dentro de una tarjeta, una sección
o un calendario de una pantalla con más contenido; cuando flota sobre un mapa
vivo (regla 10 de la carta); o cuando está junto al formulario o botón que lo
resuelve, que una ilustración empujaría hacia abajo.

**Poses.** Cada pose dice algo del estado:

- `talk` (02, el brazo señala hacia fuera): Pingo se presenta y señala la
  acción. Es la de «sin mascotas», que es el primer vacío que ve un usuario
  nuevo.
- `sleep` (04, ojos cerrados): no hay alertas, todo está tranquilo.
- `clipboard` (09, lista): la lista de recordatorios.
- `health` (07, estetoscopio): los documentos médicos.
- `collar` (06, sostiene un collar): las zonas seguras dependen del collar.
- `food` (08, cuenco): el plan de comidas.

### Ilustrados (9 estados, 9 testID)

| # | testID | Fichero | Pose | CTA | Motivo |
|---|---|---|---|---|---|
| 1 | `home-empty` | `src/screens/home/index.tsx` | `talk` | Añadir mascota | Pestaña raíz sin nada que mostrar. |
| 2 | `health-empty` | `src/screens/health/index.tsx` | `talk` | Añadir mascota | Ídem. |
| 3 | `food-empty` | `src/app/(tabs)/food.tsx` | `talk` | Añadir mascota | Ídem. |
| 4 | `map-no-pets` | `src/screens/map/index.tsx` | `talk` | Añadir mascota | Ídem; la rama sin mascotas no pinta mapa, así que la regla 10 no aplica. |
| 5 | `alerts-empty` | `src/screens/alerts/index.tsx` | `sleep` | — | Es la pantalla entera; no hay acción de crear alertas. |
| 6 | `reminders-empty` | `src/screens/reminders/index.tsx` | `clipboard` | — | Es la lista entera; `reminders-add-link` ya está encima. |
| 7 | `docs-empty` | `src/screens/docs/index.tsx` | `health` | — | Es la pantalla entera; la app no sube documentos. |
| 8 | `geofences-empty` | `src/screens/geofences/index.tsx` | `collar` | — | Es la lista entera; `geofences-add` ya existe y solo lo ve el dueño. |
| 9 | `food-plan-empty` | `src/app/(tabs)/food.tsx` | `food` | — | Es el contenido principal de la pestaña; la tarjeta de horario debajo ya lleva a generar el plan. |

### En texto, sin cambios (11 estados, 12 testID)

| # | testID | Fichero | Motivo |
|---|---|---|---|
| 10 | `vaccines-empty` | `src/screens/health/index.tsx` | Dentro de la tarjeta de vacunas. |
| 11 | `weight-card-empty` | `src/screens/health/index.tsx` | Dentro de la tarjeta de peso. |
| 12 | `weight-chart-empty` | `src/components/weight-chart.tsx` | Dentro de la tarjeta de la gráfica. |
| 13 | `weekly-activity-empty` | `src/screens/home/weekly-activity-chart.tsx` | Dentro de una tarjeta de Inicio. |
| 14 | `meals-history-empty` | `src/screens/meals-history/index.tsx` | Dentro de la tarjeta del calendario. |
| 15 | `meals-history-detail-empty` | `src/screens/meals-history/index.tsx` | Ídem, detalle del día. |
| 16 | `nutrition-profile-empty` | `src/screens/meal-schedule/index.tsx` | Una sección de una pantalla con más contenido. |
| 17 | `meal-schedule-empty` | `src/screens/meal-schedule/index.tsx` | `generate-plan-button` está justo debajo y es el siguiente paso; la pose lo empujaría. |
| 18 | `profile-pets-empty` | `src/screens/profile/index.tsx` | Una sección del perfil; `profile-add-pet` está justo encima. |
| 19 | `weight-log-empty` | `src/screens/weight-log/index.tsx` | El formulario de peso es el contenido principal. |
| 20 | `map-empty` + `map-empty-overlay` | `src/screens/map/index.tsx` | Una tarjeta flotante sobre el mapa vivo (regla 10). |

Ninguno de los 11 cambia de copy, de clases ni de testID (R10).

## Copy final (en/es)

Voz B (D1): primera persona, tuteo en español, sin emoji, sin exclamaciones
(no celebran nada) y cada frase termina en punto. El inglés es neutro. No se
usa `{{petName}}`: ningún vacío necesita cargar datos de la mascota.

**Los títulos no cambian.** Son las claves y valores que ya existen; Pingo
habla en la frase de debajo.

| Clave (existente) | `en` | `es` |
|---|---|---|
| `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
| `alerts.empty` | `No alerts` | `No hay alertas` |
| `reminders.noRemindersYet` | `No reminders yet` | `Aún no hay recordatorios` |
| `docs.noDocumentsYet` | `No documents yet` | `Aún no hay documentos` |
| `geofences.empty` | `No safe zones yet` | `Aún no hay zonas seguras` |
| `food.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
| `profile.addPet` (CTA) | `Add pet` | `Añadir mascota` |

**Frases de Pingo.** Cinco claves nuevas y un valor cambiado. Los literales
son exactos, byte a byte; en inglés el apóstrofo es el recto (`'`).

| Clave | `en` | `es` | Estado |
|---|---|---|---|
| `common.noPetsBody` | `Add your pet and I'll help you know where they are and how they're doing.` | `Añade a tu mascota y te ayudo a saber dónde está y cómo está.` | nueva |
| `alerts.emptyBody` | `All is calm. If anything happens, I'll let you know here.` | `Todo está tranquilo. Si pasa algo, te aviso aquí.` | nueva |
| `reminders.emptyBody` | `Once you create a reminder, I'll let you know on time.` | `Cuando crees un recordatorio, te aviso a tiempo.` | nueva |
| `geofences.emptyBody` | `Once there's a safe zone, I'll let you know if your pet leaves it.` | `Cuando haya una zona segura, te aviso si tu mascota sale de ella.` | nueva |
| `food.noMealPlanBody` | `Once there's a plan, I'll help you keep track of every meal.` | `Cuando haya un plan, te ayudo a llevar la cuenta de cada comida.` | nueva |
| `docs.emptyBody` | `When your pet's medical documents arrive, I'll keep them here.` | `Cuando lleguen los documentos médicos de tu mascota, te los guardo aquí.` | cambia (antes `Medical documents will appear here.` / `Los documentos médicos aparecerán aquí.`) |

## Requisitos funcionales

Convenciones de todos los requisitos:

- **Rutas.** Las rutas sin prefijo cuelgan de `mobile-pet-tracker/`.
  «El test del componente» es
  `mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx`, que es
  nuevo.
- **Nombres de describe.** Los describes nuevos se llaman `#155 R<n>: …`.
- **Comentarios.** En el código de producción, toda cita a esta feature se
  escribe `#155 R<n>`. Un `#155` suelto lo caza `HEX_LITERAL` de
  `src/__tests__/design-drift.test.ts` como si fuera un color.
- **Literales.** Todo valor que un test comprueba se escribe en el test como
  literal: textos, clases, rutas y nombres de fichero. Ningún test compara
  contra un símbolo importado de producción (tampoco `es['…']` ni `en['…']`
  como valor esperado). En los literales ingleses con apóstrofo, el test usa
  comillas dobles o `\'`.
- **Idioma de los tests de pantalla.** Los tests de pantalla ya renderizan en
  español; los literales que comprueban son los de la columna `es`. El inglés
  lo cierra R1 sobre el catálogo.
- **Imagen.** «La pose `<p>`» de un nodo significa que su `props.source` es
  `[expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-<p>\.webp$/) })]`,
  el patrón que ya usa `src/screens/welcome/index.test.tsx` para
  `welcome-hero`.

### R1 — El copy de los vacíos existe en los dos idiomas

THE SYSTEM SHALL declarar en los objetos `en` y `es` de
`src/i18n/catalog.ts` las cinco claves nuevas de §Copy final, cada una en la
línea siguiente a su título:

- `common.noPetsBody` tras `'common.noPetsYet'`;
- `alerts.emptyBody` tras `'alerts.empty'`;
- `reminders.emptyBody` tras `'reminders.noRemindersYet'`;
- `geofences.emptyBody` tras `'geofences.empty'`;
- `food.noMealPlanBody` tras `'food.noMealPlanYet'`.

THE SYSTEM SHALL cambiar además el valor de `docs.emptyBody` en los dos
idiomas al literal de §Copy final.

Observable en el test del componente, describe
`#155 R1: el copy de los vacíos existe en los dos idiomas`. Importa `en` y
`es` de `'../../i18n/catalog'` y tiene estos `it`:

- `it.each` con una fila `[clave, en, es]` por cada una de las seis claves
  de la tabla «Frases de Pingo», título `declara %s en inglés y en español`:
  `en[clave]` es el literal `en` de la fila y `es[clave]` es el literal `es`.
- `it.each` con las mismas seis claves, título
  `%s no exclama, no lleva emoji y termina en punto en los dos idiomas`: para
  `en[clave]` y para `es[clave]`, el valor no casa con `/[!¡]/`, no casa con
  `/\p{Extended_Pictographic}/u` y casa con `/\.$/`.
- `registra las claves en la tabla de mobile-ui-language`: lee
  `join(process.cwd(), '..', 'specs', 'mobile-ui-language', 'design.md')` y
  comprueba que contiene
  `### §2.21 — Añadidos por #155 — Pingo en los estados vacíos`.
- `it.each` con las seis claves, título `%s tiene fila de #155 en mobile-ui-language`:
  el mismo fichero casa con
  `new RegExp('\\| — \\| `' + clave.replace('.', '\\.') + '`[^\\n]*← (?:añadida|cambiada) por #155 \\(R1\\)')`.

La subsección `### §2.21 — Añadidos por #155 — Pingo en los estados vacíos`
de `specs/mobile-ui-language/design.md` va tras la tabla de §2.20 (la añade
#153 R1; re-verificar al merge de #153) y antes de `## 3. La infraestructura`,
con las columnas de §2.20:

```
| # | Clave | `en` | `es` | Origen |
|---|---|---|---|---|
| — | `common.noPetsBody` | `Add your pet and I'll help you know where they are and how they're doing.` | `Añade a tu mascota y te ayudo a saber dónde está y cómo está.` | ← añadida por #155 (R1) |
| — | `alerts.emptyBody` | `All is calm. If anything happens, I'll let you know here.` | `Todo está tranquilo. Si pasa algo, te aviso aquí.` | ← añadida por #155 (R1) |
| — | `reminders.emptyBody` | `Once you create a reminder, I'll let you know on time.` | `Cuando crees un recordatorio, te aviso a tiempo.` | ← añadida por #155 (R1) |
| — | `geofences.emptyBody` | `Once there's a safe zone, I'll let you know if your pet leaves it.` | `Cuando haya una zona segura, te aviso si tu mascota sale de ella.` | ← añadida por #155 (R1) |
| — | `food.noMealPlanBody` | `Once there's a plan, I'll help you keep track of every meal.` | `Cuando haya un plan, te ayudo a llevar la cuenta de cada comida.` | ← añadida por #155 (R1) |
| — | `docs.emptyBody` | `When your pet's medical documents arrive, I'll keep them here.` | `Cuando lleguen los documentos médicos de tu mascota, te los guardo aquí.` | ← cambiada por #155 (R1) |
```

La fila 103 de §2 (`docs.emptyBody` con el valor viejo) no se toca: es
historia de #65, y §2.21 registra el cambio.

Las cinco claves nuevas mueven el recuento del catálogo de
`src/providers/__tests__/language-provider.test.tsx` (design.md §Candados,
fila C1). El valor cambiado no mueve ningún candado: ningún test contiene el
literal viejo (medido: `grep -rlF 'aparecerán aquí' src` da 0 ficheros fuera
de `catalog.ts`).

### R2 — Las seis poses de los vacíos entran como WebP

THE SYSTEM SHALL añadir a `assets/images/` exactamente seis ficheros nuevos:

| Fichero | Sale de |
|---|---|
| `pingo-talk.webp` | `mascot-02-talk.png` |
| `pingo-sleep.webp` | `mascot-04-sleep.png` |
| `pingo-clipboard.webp` | `mascot-09-clipboard.png` |
| `pingo-health.webp` | `mascot-07-health.png` |
| `pingo-collar.webp` | `mascot-06-collar.png` |
| `pingo-food.webp` | `mascot-08-food.png` |

Los seis salen de `/home/claude/pet-tracker-mascot/` con el comando de
design.md §Assets. Cada uno es un WebP con canal alfa de 1024×1024 y pesa
como mucho 100 000 bytes. Ninguna otra pose entra.

Observable en el test del componente, describe
`#155 R2: las poses de los vacíos entran como WebP`, con un `it.each` sobre
los seis nombres de la tabla y el título
`%s es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes`. Lee
`readFileSync(join(process.cwd(), 'assets', 'images', name))` y comprueba:

- `toString('ascii', 0, 4)` es `'RIFF'`;
- `toString('ascii', 8, 12)` es `'WEBP'`;
- `toString('ascii', 12, 16)` es `'VP8X'`;
- `(bytes[20] & 0x10) !== 0`;
- `bytes.readUIntLE(24, 3) + 1` es `1024` y `bytes.readUIntLE(27, 3) + 1`
  es `1024`;
- `bytes.length` es como mucho `100000`.

Además, R2 mueve el candado `no mete otras poses de Pingo` de #153 R3 en
`src/screens/welcome/index.test.tsx` (design.md §Candados, fila C2): la lista
esperada pasa a ser, en este orden,

```
['pingo-clipboard.webp', 'pingo-collar.webp', 'pingo-food.webp', 'pingo-health.webp', 'pingo-sleep.webp', 'pingo-talk.webp', 'pingo-wave-blink.webp', 'pingo-wave.webp']
```

### R3 — Un único componente pinta los vacíos ilustrados

THE SYSTEM SHALL crear `src/components/empty-state.tsx` con:

- el tipo exportado
  `EmptyStatePose = 'talk' | 'sleep' | 'clipboard' | 'health' | 'collar' | 'food'`;
- el componente exportado por nombre `EmptyState`, con estas props:
  `{ testID: string; pose: EmptyStatePose; title: string; body: string; action?: { label: string; onPress: () => void } }`.

`EmptyState` no llama a `t()`: recibe el texto ya traducido. Pinta, en este
orden:

1. Un `View` raíz con `testID={testID}` y
   `className="items-center gap-3 py-8"`. Sin `Card`, sin fondo y sin óvalo.
2. Un `Image` de `expo-image` con `testID={`${testID}-pose`}`, la pose
   cargada con un `require` estático de
   `../../assets/images/pingo-<pose>.webp` (una entrada por pose en un objeto
   del módulo), `style={{ width: 160, height: 160 }}` y
   `contentFit="contain"`. Es decorativa: sin `accessibilityLabel`.
3. Un `Text` con `testID={`${testID}-title`}` y
   `className="text-center text-lg font-bold text-foreground"`.
4. Un `Text` con `testID={`${testID}-body`}` y
   `className="text-center font-normal text-muted"`.
5. Solo si llega `action`: un `Button` de `heroui-native` con
   `testID={`${testID}-action`}`, `className="rounded-xl bg-accent"`,
   `onPress={action.onPress}` y, dentro,
   `<Button.Label className="font-bold text-accent-foreground">{action.label}</Button.Label>`.
   Sin `size`, sin `variant` y sin `border-b-4` (D4).

Observable en el test del componente, describe
`#155 R3: un único componente pinta los vacíos ilustrados`. Renderiza
`EmptyState` envuelto en `HeroUINativeProvider`, como hace `renderHero` en
`src/components/__tests__/pet-hero-header.test.tsx`, con
`testID="probe"`, `title="Título de prueba"` y `body="Cuerpo de prueba."`.
Tiene estos `it`:

- `it.each` con las seis poses, título `pinta la pose %s a 160×160 y sin etiqueta`:
  `probe-pose` tiene la pose de la fila (§Convenciones, «Imagen»),
  `props.style` es `{ width: 160, height: 160 }`, `props.contentFit` es
  `'contain'` y `props.accessibilityLabel` es `undefined`.
- `pinta el contenedor sin tarjeta`: `probe` tiene
  `props.className` `'items-center gap-3 py-8'`.
- `pinta el título y el cuerpo con sus clases`: `probe-title` tiene el texto
  `'Título de prueba'` y `props.className`
  `'text-center text-lg font-bold text-foreground'`; `probe-body` tiene el
  texto `'Cuerpo de prueba.'` y `props.className`
  `'text-center font-normal text-muted'`.
- `sin acción no pinta botón`: `queryByTestId('probe-action')` es `null`.
- `con acción pinta el botón y lo pulsa una vez`: con
  `action={{ label: 'Acción de prueba', onPress }}` y `onPress = jest.fn()`,
  `within(screen.getByTestId('probe-action')).getByText('Acción de prueba')`
  existe; tras `fireEvent.press(screen.getByTestId('probe-action'))`,
  `onPress` se llamó exactamente una vez.
- `declara el botón primario sin labio`: lee
  `src/components/empty-state.tsx` y comprueba que contiene
  `className="rounded-xl bg-accent"` y
  `className="font-bold text-accent-foreground"`, y que no contiene
  `border-b-4`.

El `className="rounded-xl bg-accent"` nuevo mueve los dos candados del
inventario de botones primarios de
`src/__tests__/consistency-classnames.test.ts` (design.md §Candados, fila
C3).

### R4 — Sin mascotas, Pingo se presenta en Inicio, Salud, Comida y Mapa

WHEN la lista de mascotas carga con éxito y está vacía, THE SYSTEM SHALL
pintar en cada una de estas cuatro pantallas, en el sitio del `Text` que hoy
lleva su testID, un `EmptyState` con:

| testID | Fichero |
|---|---|
| `home-empty` | `src/screens/home/index.tsx` |
| `health-empty` | `src/screens/health/index.tsx` |
| `food-empty` | `src/app/(tabs)/food.tsx` |
| `map-no-pets` | `src/screens/map/index.tsx` |

- `pose="talk"`;
- `title={t('common.noPetsYet')}`;
- `body={t('common.noPetsBody')}`;
- `action={{ label: t('profile.addPet'), onPress: () => router.push('/pets/add') }}` (sin cast; enmienda E1).

El padre del `Text` sustituido no cambia. En el mapa, el `EmptyState` queda
dentro del `View` `flex-1 items-center justify-center p-6 bg-background` que
ya envuelve hoy a `map-no-pets`. Solo el mapa importa `router` de
`expo-router`, que aún no tiene; ninguna pantalla añade `type Href`
(enmienda E1). En Inicio, el `router.push`
nuevo no va dentro de `QUICK_ACTIONS`: el test de Inicio prohíbe
`'/pets/add'` en ese bloque.

Observable en cuatro tests, uno por pantalla:

| Pantalla | Test | Describe |
|---|---|---|
| Inicio | `src/screens/home/index.test.tsx` | `#155 R4: Inicio sin mascotas presenta a Pingo` |
| Salud | `src/screens/health/index.test.tsx` | `#155 R4: Salud sin mascotas presenta a Pingo` |
| Comida | `src/app/(tabs)/__tests__/food.test.tsx` | `#155 R4: Comida sin mascotas presenta a Pingo` |
| Mapa | `src/screens/map/index.test.tsx` | `#155 R4: Mapa sin mascotas presenta a Pingo` |

Cada describe arregla la lista vacía igual que el `it` que hoy contiene
`expect(screen.getByTestId('<testID>')).toHaveTextContent(` en ese fichero, y
tiene estos dos `it` (con `<id>` el testID de la fila):

- `pinta la pose, el título y la frase de Pingo`:
  - `<id>-pose` tiene la pose `talk`;
  - `<id>-title` tiene el texto `'Aún no tienes mascotas'`;
  - `<id>-body` tiene el texto
    `'Añade a tu mascota y te ayudo a saber dónde está y cómo está.'`;
  - `within(screen.getByTestId('<id>-action')).getByText('Añadir mascota')`
    existe.
- `lleva a añadir mascota`: tras
  `fireEvent.press(screen.getByTestId('<id>-action'))`, `router.push` se
  llamó exactamente una vez y con `'/pets/add'`. El test del mapa no tiene
  hoy `mockRouter`: importa `router` de `expo-router` y usa
  `jest.mocked(router)`; su mock de `expo-router` ya declara
  `router: { push: jest.fn() }`.

En cada uno de los cuatro tests, el `expect` que hoy hace
`expect(screen.getByTestId('<id>')).toHaveTextContent(` pasa a apuntar a
`'<id>-title'`, con el mismo literal. El raíz de `EmptyState` concatena
título, cuerpo y botón, y `toHaveTextContent` compara exacto.

Cada fichero suma dos filas a su bloque de `src/__tests__/ui-copy-table.ts`,
justo después de su fila `common.noPetsYet`:
`{ file: '<fichero>', key: 'common.noPetsBody' }` y
`{ file: '<fichero>', key: 'profile.addPet' }`. Mueven los recuentos de
`R3_HOME`, `R5_HEALTH`, `R6_FOOD` y `R4_MAP` en
`src/__tests__/ui-language.test.ts` (design.md §Candados, filas C4 a C7).

### R5 — Sin alertas, Pingo duerme

WHEN las alertas cargan con éxito y no hay ninguna, THE SYSTEM SHALL pintar
en `src/screens/alerts/index.tsx`, en el sitio del `Text` `alerts-empty`, un
`EmptyState` con `testID="alerts-empty"`, `pose="sleep"`,
`title={t('alerts.empty')}`, `body={t('alerts.emptyBody')}` y sin `action`.

Observable en `src/screens/alerts/index.test.tsx`, describe
`#155 R5: sin alertas, Pingo duerme`, con el arreglo del `it` que hoy se
llama `pinta el estado vacío`:

- `pinta la pose, el título y la frase de Pingo`: `alerts-empty-pose` tiene
  la pose `sleep`; `alerts-empty-title` tiene el texto `'No hay alertas'`;
  `alerts-empty-body` tiene el texto
  `'Todo está tranquilo. Si pasa algo, te aviso aquí.'`.
- `no ofrece acción`: `queryByTestId('alerts-empty-action')` es `null`.

En el `it` `pinta el estado vacío`:

- el `toHaveTextContent(es['alerts.empty'])` pasa a
  `expect(screen.getByTestId('alerts-empty-title')).toHaveTextContent('No hay alertas')`;
- el `props.className` esperado `'font-normal text-muted'` pasa a
  `screen.getByTestId('alerts-empty-title').props.className` igual a
  `'text-center text-lg font-bold text-foreground'`.

Suma `{ file: 'src/screens/alerts/index.tsx', key: 'alerts.emptyBody' }` a
`R12_ALERTS`, tras su fila `alerts.empty` (C10; ese bloque no tiene
recuento).

### R6 — Sin recordatorios, Pingo sostiene su lista

WHEN los recordatorios cargan con éxito y no hay ninguno, THE SYSTEM SHALL
pintar en `src/screens/reminders/index.tsx`, en el sitio del `Text`
`reminders-empty`, un `EmptyState` con `testID="reminders-empty"`,
`pose="clipboard"`, `title={t('reminders.noRemindersYet')}`,
`body={t('reminders.emptyBody')}` y sin `action`. `reminders-add-link` sigue
donde está.

Observable en `src/screens/reminders/index.test.tsx`, describe
`#155 R6: sin recordatorios, Pingo sostiene su lista`, con el arreglo del
`it` que hoy contiene
`expect(screen.getByTestId('reminders-empty')).toHaveTextContent(`:

- `pinta la pose, el título y la frase de Pingo`: `reminders-empty-pose`
  tiene la pose `clipboard`; `reminders-empty-title` tiene el texto
  `'Aún no hay recordatorios'`; `reminders-empty-body` tiene el texto
  `'Cuando crees un recordatorio, te aviso a tiempo.'`.
- `no duplica la acción de crear`: `queryByTestId('reminders-empty-action')`
  es `null` y `reminders-add-link` es visible.

El `expect` que hoy hace
`expect(screen.getByTestId('reminders-empty')).toHaveTextContent(` pasa a
`'reminders-empty-title'`, con el mismo literal. Suma
`{ file: 'src/screens/reminders/index.tsx', key: 'reminders.emptyBody' }` a
`R8_REMINDERS`, tras su fila `reminders.noRemindersYet` (C8).

### R7 — Sin documentos, Pingo los guarda

WHEN los documentos cargan con éxito y no hay ninguno, THE SYSTEM SHALL
sustituir en `src/screens/docs/index.tsx` la `Card` `docs-empty` y sus dos
`Text` por un `EmptyState` con `testID="docs-empty"`, `pose="health"`,
`title={t('docs.noDocumentsYet')}`, `body={t('docs.emptyBody')}` y sin
`action`. `Card` sigue importado: la usa cada documento de la lista.

Observable en `src/screens/docs/index.test.tsx`, describe
`#155 R7: sin documentos, Pingo los guarda`, con el arreglo del `it` que hoy
contiene `getByTestId('docs-empty')`:

- `pinta la pose, el título y la frase de Pingo`: `docs-empty-pose` tiene la
  pose `health`; `docs-empty-title` tiene el texto `'Aún no hay documentos'`;
  `docs-empty-body` tiene el texto
  `'Cuando lleguen los documentos médicos de tu mascota, te los guardo aquí.'`.
- `no ofrece acción`: `queryByTestId('docs-empty-action')` es `null`.

No mueve filas de `ui-copy-table.ts`: `docs/index.tsx` sigue llamando una
vez a `t('docs.noDocumentsYet')` y una vez a `t('docs.emptyBody')`.

### R8 — Sin zonas seguras, Pingo enseña el collar

WHEN las zonas seguras cargan con éxito y no hay ninguna, THE SYSTEM SHALL
sustituir en `src/screens/geofences/index.tsx` la `Card` `geofences-empty` y
su `Text` por un `EmptyState` con `testID="geofences-empty"`,
`pose="collar"`, `title={t('geofences.empty')}`,
`body={t('geofences.emptyBody')}` y sin `action`.

Observable en `src/screens/geofences/index.test.tsx`. El `it`
`pinta el vacío con su tarjeta y su copy` se borra: afirma la tarjeta que R8
quita. Lo sustituye el describe
`#155 R8: sin zonas seguras, Pingo enseña el collar`, con el mismo arreglo
(`mockList.mockResolvedValue({ kind: 'ok', geofences: [] })` y `mount()`):

- `pinta la pose, el título y la frase de Pingo, sin tarjeta`:
  - `geofences-empty` tiene `props.className` `'items-center gap-3 py-8'`;
  - `geofences-empty-pose` tiene la pose `collar`;
  - `within(empty).getByText('Aún no hay zonas seguras').props.className` es
    `'text-center text-lg font-bold text-foreground'`;
  - `geofences-empty-body` tiene el texto
    `'Cuando haya una zona segura, te aviso si tu mascota sale de ella.'`;
  - `geofences-loading` no existe.
- `no ofrece acción`: `queryByTestId('geofences-empty-action')` es `null`.

Suma `{ file: 'src/screens/geofences/index.tsx', key: 'geofences.emptyBody' }`
a `R14_GEOFENCES`, tras su fila `geofences.empty` (C9).

### R9 — Sin plan de comidas, Pingo enseña el cuenco

WHEN la pestaña Comida tiene mascota pero su plan no existe, THE SYSTEM
SHALL pintar en `src/app/(tabs)/food.tsx`, en el sitio del `Text`
`food-plan-empty`, un `EmptyState` con `testID="food-plan-empty"`,
`pose="food"`, `title={t('food.noMealPlanYet')}`,
`body={t('food.noMealPlanBody')}` y sin `action`. Las tarjetas de horario y
de historial que hoy van debajo siguen igual.

Observable en `src/app/(tabs)/__tests__/food.test.tsx`, describe
`#155 R9: sin plan de comidas, Pingo enseña el cuenco`, con el arreglo del
`it` que hoy contiene
`expect(screen.getByTestId('food-plan-empty')).toHaveTextContent(`:

- `pinta la pose, el título y la frase de Pingo`: `food-plan-empty-pose`
  tiene la pose `food`; `food-plan-empty-title` tiene el texto
  `'Aún no hay plan de alimentación'`; `food-plan-empty-body` tiene el texto
  `'Cuando haya un plan, te ayudo a llevar la cuenta de cada comida.'`.
- `no ofrece acción`: `queryByTestId('food-plan-empty-action')` es `null`.

El `expect` que hoy hace
`expect(screen.getByTestId('food-plan-empty')).toHaveTextContent(` pasa a
`'food-plan-empty-title'`, con el mismo literal. Suma
`{ file: 'src/app/(tabs)/food.tsx', key: 'food.noMealPlanBody' }` a
`R6_FOOD`, tras su fila `food.noMealPlanYet` (segunda parte de C6).

### R10 — Los vacíos que no se ilustran siguen en texto

THE SYSTEM SHALL dejar los 11 estados de §Clasificación «En texto» como
están, y SHALL usar `EmptyState` solo en los 9 ilustrados.

Observable en el test del componente, describe
`#155 R10: los vacíos que no se ilustran siguen en texto`. Lee cada fichero
con `readFileSync(join(process.cwd(), path), 'utf8')`:

- `it.each` con 12 filas `[path, tag, testID]`, título
  `%s abre <%s testID="%s"> una sola vez`: el fuente casa exactamente una vez
  con `new RegExp('<' + tag + '\\s+testID="' + testID + '"', 'g')`. Las filas
  son las de §Clasificación 10 a 20, con `tag` `Text` en todas salvo
  `map-empty-overlay`, que es `Card`:

  | path | tag | testID |
  |---|---|---|
  | `src/screens/health/index.tsx` | `Text` | `vaccines-empty` |
  | `src/screens/health/index.tsx` | `Text` | `weight-card-empty` |
  | `src/components/weight-chart.tsx` | `Text` | `weight-chart-empty` |
  | `src/screens/home/weekly-activity-chart.tsx` | `Text` | `weekly-activity-empty` |
  | `src/screens/meals-history/index.tsx` | `Text` | `meals-history-empty` |
  | `src/screens/meals-history/index.tsx` | `Text` | `meals-history-detail-empty` |
  | `src/screens/meal-schedule/index.tsx` | `Text` | `nutrition-profile-empty` |
  | `src/screens/meal-schedule/index.tsx` | `Text` | `meal-schedule-empty` |
  | `src/screens/profile/index.tsx` | `Text` | `profile-pets-empty` |
  | `src/screens/weight-log/index.tsx` | `Text` | `weight-log-empty` |
  | `src/screens/map/index.tsx` | `Text` | `map-empty` |
  | `src/screens/map/index.tsx` | `Card` | `map-empty-overlay` |

- `it.each` con 8 filas `[path, n]`, título `%s pinta %i EmptyState`: el
  fuente casa `n` veces con `/<EmptyState\b/g`. Las filas son
  `src/screens/home/index.tsx` 1, `src/screens/health/index.tsx` 1,
  `src/app/(tabs)/food.tsx` 2, `src/screens/map/index.tsx` 1,
  `src/screens/alerts/index.tsx` 1, `src/screens/reminders/index.tsx` 1,
  `src/screens/docs/index.tsx` 1 y `src/screens/geofences/index.tsx` 1.
- `ningún otro fichero usa EmptyState`: recorre `src/` (sin directorios
  `__tests__` ni ficheros `*.test.ts(x)`, como `sourceFiles()` de
  `src/__tests__/consistency-classnames.test.ts`); la lista ordenada de los
  ficheros que casan con `/<EmptyState\b/` es la de las 8 filas anteriores,
  ordenada.

### R11 — Los vacíos no traen movimiento ni dependencias

THE SYSTEM SHALL implementar #155 sin animación y sin dependencias nuevas:

- `EmptyState` no anima: no importa `react-native-reanimated`, ni usa
  `entering`, ni constantes `MOTION_*`. Como no hay movimiento, no hay nada
  que reduce motion deba apagar. Si el humano decide en A3 que la pose
  flote, se abre una enmienda con su propio requisito de reduce motion.
- `mobile-pet-tracker/package.json` y `mobile-pet-tracker/bun.lock` no
  cambian respecto del HEAD del handoff.
- Siguen verdes, sin tocarlos más allá de las filas de §Candados,
  `src/__tests__/design-drift.test.ts`,
  `src/__tests__/consistency-classnames.test.ts` y
  `src/__tests__/legibility-classnames.test.ts`, y el describe
  `#153 R13: Pingo no trae dependencias nuevas` (re-verificar al merge de
  #153).

Observable en el test del componente, describe
`#155 R11: los vacíos no traen movimiento ni dependencias`:

- `EmptyState solo importa de react, react-native, expo-image y heroui-native`:
  lee `src/components/empty-state.tsx`; cada especificador de
  `[...source.matchAll(/from '([^']+)'/g)]` está en
  `['react', 'react-native', 'expo-image', 'heroui-native']`.
- `EmptyState no anima`: el mismo fuente no casa con
  `/react-native-reanimated|entering=|MOTION_/`.

La parte del diff la comprueba el reviewer con
`git diff --stat <hash-del-handoff> -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock`;
la salida esperada es vacía.

### R12 — Smoke del humano en dev build de Android

WHEN la implementación está verde, THE SYSTEM SHALL superar un smoke del
humano en la **dev build de Android** (nunca Expo Go), con la dev build ya
instalada y `bunx expo start --dev-client` desde `mobile-pet-tracker/`. Las
poses entran por `require` y viajan en el bundle de JS, así que no hace falta
reconstruir la parte nativa; si no aparecen, `bunx expo run:android`.

Pasos, en español y luego en inglés (Perfil → idioma):

1. Con una cuenta sin mascotas: Inicio, Salud, Comida y Mapa muestran a
   Pingo con la pose `talk`, el título, la frase de §Copy final y el botón
   «Añadir mascota» / «Add pet». Pulsar el botón en cada una abre el alta de
   mascota.
2. Con una mascota recién creada: Alertas (pose `sleep`), Recordatorios
   (`clipboard`, con el botón «Nuevo» / «New» encima), Documentos (`health`)
   y Comida sin plan (`food`, con las tarjetas de horario e historial debajo)
   muestran pose, título y frase, sin botón propio.
3. Con una mascota que tiene collar con suscripción activa y ninguna zona
   segura: Zonas seguras muestra la pose `collar`, el título y la frase, sin
   botón propio. Una mascota sin collar no sirve para este paso, porque
   `PetTrackingGuard` responde 402 y la pantalla pinta
   `geofences-no-tracking`, que queda fuera de alcance.
4. En modo oscuro, la pose no muestra recuadro ni halo: el fondo es
   transparente.
5. Con el texto del sistema al máximo, título y frase se parten en líneas sin
   cortarse y el botón sigue visible al hacer scroll donde la pantalla lo
   tenga.
6. Los vacíos en texto de §Clasificación (por ejemplo, vacunas en Salud o el
   registro de peso) siguen igual que antes.

Lo firma el humano en §Aprobación, casilla «Smoke R12».

## Decisiones abiertas

Cada una lleva la opción por defecto que esta spec ya aplica. Si el humano
no dice nada en el gate, vale el defecto.

- **A1. Pose por estado.** Defecto: la tabla de §Clasificación. Alternativas
  vistas: `clipboard` para Documentos y `base` (00) para Alertas.
- **A2. Casos frontera en texto.** `meal-schedule-empty`,
  `profile-pets-empty` y `weight-log-empty` podrían ilustrarse. Defecto:
  texto, por los motivos de la tabla.
- **A3. Movimiento de la pose.** Defecto: estática. Alertas y Recordatorios
  se ven a menudo, y un flotado continuo en una pantalla que se abre varias
  veces al día cansa. Alternativa: flotar con `MOTION_FLOAT_OFFSET_Y` y
  `MOTION_FLOAT_TIMING` de #153 R4, apagado con reduce motion; costaría un
  requisito más y una enmienda.
- **A4. Tamaño de la pose.** Defecto: 160×160, el tamaño de `welcome-hero`
  en main. Alternativa: 200×200, como Pingo en la bienvenida de #153.
- **A5. Óvalo, huellas y sombra del artboard.** Defecto: fuera. La pose sola
  sobre el fondo de la pantalla, sin tokens nuevos.
- **A6. CTA solo en «sin mascotas».** Defecto: sí. Recordatorios y Zonas
  seguras ya tienen su botón de crear en la pantalla; Alertas, Documentos y
  el plan no tienen acción directa.
- **A7. Títulos.** Defecto: se quedan los actuales y la voz de Pingo va en
  la frase. Alternativa: reescribir también los títulos en primera persona.
- **A8. Copy.** Defecto: los literales de §Copy final.
- **A9. Poses que entran al repo.** Defecto: las seis que se usan (lo mismo
  que #153 hizo con dos). Alternativa: las doce de una vez (#153 G1).

## Fuera de alcance

Cada viñeta dice si es una delimitación (no forma parte de esta feature y no
deja nada pendiente) o deuda (algo que queda mal y alguien debe arreglar).
Ninguna es deuda.

- **Errores y sin conexión (pose `worried`).** Delimitación: los nombra la
  descripción de #155 como fuera.
- **Celebraciones (E), hero con frase del día (F) y onboarding (G).**
  Delimitación: son otras candidatas del explore.
- **Estados «sin collar»** (`map-no-tracking`, `geofences-no-tracking`,
  `geofence-editor-no-tracking`). Delimitación: no son datos vacíos, sino
  falta de un collar emparejado; su testID no casa con `*empty`.
- **`pairing-no-pets`, `reminders-none-upcoming`, `weeklyActivity.noDataForDay`
  y `pairing.noMessagesYet`.** Delimitación: viven en el flujo de
  emparejamiento o dentro de tarjetas de Inicio.
- **Subir documentos.** Delimitación: la pantalla de documentos no tiene hoy
  botón de subir ni de añadir (medido), y R7 no lo crea.
- **Los 11 vacíos en texto.** Delimitación: no cambian ni de copy ni de
  clases (R10).
- **Las poses que no se usan** (`base`, `celebrate-v2`, `search`,
  `worried-v2`). Delimitación: entran con la feature que las pinte (A9).
- **Movimiento.** Delimitación mientras A3 siga en su defecto.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-08) ← gate obligatorio antes de implementar
- [x] Clasificación, poses (A1, A2, A9) y copy final (A7, A8) aprobados (fecha: 2026-10-08)
- [ ] Smoke R12 superado en dev build de Android (fecha: ____)
- [x] Enmienda E1 aprobada (fecha: 2026-10-08) ← gate de la enmienda; Codex no reanuda T4 sin ella
- [ ] Enmienda E2 aprobada (fecha: ____) ← gate de la enmienda; Codex no empieza la Reanudación 3 sin ella

## Premisas falsas

Hechos de la descripción de #155 o del explore que no cuadran con el árbol.

- **P1. «3 ficheros con un testID *empty» fuera del glob.** Son 3 ficheros,
  pero `src/app/(tabs)/food.tsx` tiene dos (`food-empty` y
  `food-plan-empty`): son 4 testID, no 3.
- **P2. Explore §1 D5, «10 de pantalla completa y 6 incrustados».** Cuenta
  `map-empty` y `map-empty-overlay` como dos estados; son el mismo.
- **P3. El glob `*empty` no ve todos los vacíos «sin mascotas».** Se le
  escapa `map-no-pets`, que esta spec ilustra (R4).
- **P4. #153 como base.** A `19a4178e`, #153 es solo spec. Todo lo que esta
  spec toma de #153 (punto 7 de la carta, las constantes de movimiento, la
  clave `welcome.pingoGreeting`, §2.20, el candado de poses y el
  `+ 1, // #153 R1` del catálogo) sale de su texto y se re-verifica al merge.

## Enmienda E1 — el CTA de R4 sin cast `as Href` (2026-10-08)

**Qué paró.** Codex se detuvo en T4 verde: `src/screens/home/index.test.tsx`
dio 1 fallo de 220 tests. No falló ningún test de #155, sino un candado
anterior, el `it` `lleva a la lista de recordatorios existente` del describe
`#70 R10: enlace a la lista de recordatorios`. Ese candado asevera
`expect(source).not.toMatch(/import\s*\{[^}]*\bHref\b[^}]*\}\s*from/)`
sobre `src/screens/home/index.tsx`, y el `it` `#121 R1: usa la ruta real sin
cast Href…` del mismo fichero va en la misma línea. R4 prescribía
`router.push('/pets/add' as Href)` y el import de `type Href` en Inicio, y
eso es justo lo que el candado prohíbe. La spec no lo vio: es un candado
por fichero, no uno de los inventarios globales que revisó.

**Premisa medida en `0c236ef4`, el commit rojo de T4.** El cast no hace
falta.
- `/pets/add` es una ruta real: existe `src/app/pets/add.tsx`.
- Inicio ya empuja rutas literales sin cast: `router.push('/alerts')` y
  `router.push('/reminders')`.
- Salud también: `router.push('/weight-log')`.
- Solo Comida usa `as Href`, en `/meal-schedule` y `/meals-history`, y ya
  importa `router` y `type Href` para esas dos rutas.

**E1.1. La acción de R4, en las cuatro pantallas.** Queda
`onPress: () => router.push('/pets/add')`, sin cast. Esto aplica a Inicio,
Salud, Comida y Mapa. Así el código sigue la línea de #121 R1 y es igual
en las cuatro. En Comida, el import de `type Href` sigue igual: lo usan las
dos rutas ajenas a #155.

**E1.2. Imports.** Solo `src/screens/map/index.tsx` añade algo: `router`
al import de `expo-router` que ya existe (`useFocusEffect`). Ninguna
pantalla añade `type Href`. El candado de #70 R10 no se toca ni se relaja.

**E1.3. Tests.** Ninguno de R4 cambia: los cuatro aseveran
`mockRouter.push` con `'/pets/add'`, y eso sigue siendo cierto. El commit
rojo `0c236ef4` sigue valiendo. Cuentas de T4 verde sin cambios: 441 tests
en los cuatro ficheros y 174 en GUARDAS.

**E1.4. Anclas tras T4 verde**, medidas con `grep` desde `mobile-pet-tracker/`:
- `grep -cF "router.push('/pets/add')"` da `1` en cada uno de los cuatro
  ficheros de pantalla.
- `grep -cF "'/pets/add' as Href"` da `0` en cada uno.
- `grep -cE "import \{[^}]*\bHref\b" src/screens/home/index.tsx src/screens/health/index.tsx src/screens/map/index.tsx`
  da `0` en los tres.

**E1.5. Riesgo.** Si `bun run typecheck` rechaza `'/pets/add'` sin cast,
con `.expo/types/router.d.ts` ausente como exige la cadena, Codex PARA y
copia el error. No vuelve al cast por su cuenta.

## Enmienda E2 — candados de orden, sitio y movimiento (2026-10-08)

**Qué paró.** El reviewer rechazó la ronda 1 (`438b3263`,
`progress/review_mobile-empty-states-pingo.md`). El código de HEAD es
correcto; lo que falla es que cinco cláusulas SHALL no tienen candado en
alguna de sus ramas:

| Bloqueante | Cláusula | Sondas que sobreviven |
|---|---|---|
| B1 | R3: orden de los hijos, «sin `Card`, sin fondo y sin óvalo», «sin `size`, sin `variant`» | S1-S4 |
| B2 | R4: «el padre del `Text` sustituido no cambia» y el envoltorio del mapa | S5-S7 |
| B3 | R6 y R9: «en el sitio del `Text`…»; R9: la tarjeta de historial | S8-S10 |
| B4 | R11: «sin animación» deja pasar `Animated` de React Native | S11 |
| B5 | Todo lo anterior cabe en un solo mutante que deja verdes 16 suites | — |

**Decisión del humano (2026-10-08): candados mínimos.**
- R3 queda candada en orden, hijos directos y `Button` sin `size` ni
  `variant`.
- R11 suma la rama de `Animated`.
- Cada uno de los 9 vacíos ilustrados suma un candado de sitio (padre directo
  y posición entre sus hermanos). Eso cubre B2 y B3, también en R5, R7 y R8,
  que el reviewer no sondeó.
- R9 suma la tarjeta de historial.
- N1 (las clases de los 11 vacíos en texto) y N2 (la regex de comillas de
  R11 y el alias en R10) quedan fuera: son delimitaciones, no deuda.

**Pre-verificación del reviewer (2026-10-08).** Antes de la firma, el
reviewer barrió E2 cláusula por rama (`progress/review_mobile-empty-states-pingo.md`
§Pre-verificación E2). Encontró cuatro ramas sin candado. Juntas formaban un
programa válido que dejaba verdes los 15 ficheros del cierre:

| Hueco | Cláusula | Mutante que sobrevivía | Se cierra en |
|---|---|---|---|
| G1 | R11 «sin animación» | `pingo-talk.webp` con el bit de animación de VP8X puesto | E2.3 |
| G2 | R3 «sin fondo» | `style` inline con fondo y radio en la raíz misma | E2.1 |
| G3 | R3 «un `View` raíz» | la raíz como `Text` | E2.1 |
| G4 | R6 «en el sitio del `Text`» | el vacío detrás de `reminders-action-error`, que puede verse a la vez | E2.2 |

Se suma NIMG, que el reviewer no consideró bloqueante: un `className` en el
`Image`. Va en E2.1.

G4 se trata como una rama de «posición entre sus hermanos», no como
delimitación. El error de acción sobrevive a un cambio de mascota, así que
el vacío y el error conviven. Las cinco líneas van dentro de `it` que ya
existen o que E2 ya añadía, y no cambia ninguna cuenta de E2.4.

E2 **no toca código de producción**. Todos los candados nacen en verde contra
HEAD, porque el código ya cumple. Su rojo se demuestra con las sondas de
E2.5, igual que R10 y R11.

**Base medida.** Medida en un árbol desechable (`git archive 8c142376`)
con RNTL 14.0.1:
- `getByTestId` devuelve un `TestInstance` de `test-renderer` con `parent`
  y `children`;
- la identidad es estable, así que `toBe` entre nodos funciona (el `it` de
  #105 en `food.test.tsx` ya lo usa con `card.parent?.children`);
- con los candados puestos, typecheck y lint salen limpios y
  `src/__tests__` da 8/8 suites.

En todas las listas de hijos, cada nodo se escribe así:

```ts
(child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type))
```

Es decir, su testID o, si no tiene, el nombre de su tipo de host en jest
(`'Text'`, `'View'`, `'RCTScrollView'`). La comparación usa `toEqual` sobre
la lista entera: un nodo de más, de menos o fuera de orden la pone en rojo.

### E2.1 — R3: orden, hijos directos y botón sin `size` ni `variant`

En el test del componente:

- El test no importa nada de `react-native`. Se añade la línea
  `import { View } from 'react-native';` justo debajo de
  `import { HeroUINativeProvider } from 'heroui-native';`, en el mismo
  bloque, que es el orden que acepta el lint.
- `renderProbe` envuelve el `EmptyState` en un marco, dentro del provider:

  ```tsx
  <HeroUINativeProvider>
    <View testID="probe-frame">
      <EmptyState testID="probe" pose="talk" title="Título de prueba" body="Cuerpo de prueba." action={action} />
    </View>
  </HeroUINativeProvider>
  ```

  Los `it` que ya usan `renderProbe` no cambian. El `it.each` de las poses
  (`pinta la pose %s a 160×160 y sin etiqueta`) tiene su propio `render` y
  suma una sola línea, al final:
  `expect(image.props.className).toBeUndefined();`.

El describe `#155 R3: un único componente pinta los vacíos ilustrados` suma
tres `it` al final:

```tsx
it('con acción pinta pose, título, cuerpo y botón como hijos directos, en ese orden', async () => {
  await renderProbe({ label: 'Acción de prueba', onPress: jest.fn() });
  const root = await screen.findByTestId('probe');
  expect(root.parent).toBe(screen.getByTestId('probe-frame'));
  expect(root.type).toBe('View');
  expect(root.props.style).toBeUndefined();
  expect(root.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['probe-pose', 'probe-title', 'probe-body', 'probe-action']);
});

it('sin acción pinta pose, título y cuerpo como hijos directos, en ese orden', async () => {
  await renderProbe();
  const root = await screen.findByTestId('probe');
  expect(root.parent).toBe(screen.getByTestId('probe-frame'));
  expect(root.type).toBe('View');
  expect(root.props.style).toBeUndefined();
  expect(root.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['probe-pose', 'probe-title', 'probe-body']);
});

it('declara el botón sin size ni variant', () => {
  const source = readFileSync(join(process.cwd(), 'src', 'components', 'empty-state.tsx'), 'utf8');
  expect(source.match(/<Button[\s>]/g)).toHaveLength(1);
  expect(source).toContain('<Button testID={`${testID}-action`} className="rounded-xl bg-accent" onPress={action.onPress}>');
});
```

Qué caza cada `it`:
- El marco caza cualquier envoltorio alrededor de la raíz, sea una `Card` o
  un `View` con fondo.
- `root.type` caza una raíz que no sea `View`, por ejemplo un `Text` (G3).
- `root.props.style` caza un fondo, un borde o un radio inline en la raíz
  misma, que no es un envoltorio y el marco no ve (G2).
- La lista de hijos caza el orden y cualquier envoltorio alrededor de la
  imagen, del título, del cuerpo o del botón (un óvalo, por ejemplo).
- `image.props.className` caza clases en el `Image`, por ejemplo un óvalo
  (NIMG). Hoy Uniwind no las aplicaría a `expo-image`, pero la línea
  cierra la rama sin depender de eso.
- La apertura literal del `Button` caza `size`, `variant` (también
  `variant="primary"` explícito), un spread de props y el `border-b-4`.
- `/<Button[\s>]/` no casa con `<Button.Label`.

### E2.2 — R4 a R9: cada vacío queda en su sitio

Cada uno de los 8 describes de pantalla suma un `it` llamado
`queda en el sitio del vacío que sustituye`. El describe de R9 está en el
mismo fichero que el de Comida de R4, así que `food.test.tsx` suma dos, uno
por describe.

**Arreglo.** Se copian del `it` hermano `pinta la pose, el título y la
frase de Pingo` (en geofences, `…de Pingo, sin tarjeta`) sus líneas
anteriores a la espera de la pose: los `mock….mockResolvedValue(…)` y la
llamada de render (`await renderHome();`, `await mount();`…). En geofences
**no** se copian la línea `const empty = …` ni su `expect`. La espera va
**sin asignar**: `await screen.findByTestId('<id>-pose');`. Un
`const pose` sin usar tumba el lint.

**Cuerpo.** Después de la espera, con `<id>` el testID de la fila:

```tsx
const slot = screen.getByTestId('<id>');
expect(<nodo ancla>).toBe(<valor ancla>);
expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(<hermanos>);
```

Se llama `slot` en los nueve, por uniformidad con el spike que midió la
tabla.

| R | Fichero de test | `<id>` | Nodo ancla, `toBe` | Hermanos (`toEqual`) |
|---|---|---|---|---|
| R4 | `src/screens/home/index.test.tsx` | `home-empty` | `slot.parent?.props.testID` → `'home-states'` | `['Text', 'home-empty']` |
| R4 | `src/screens/health/index.test.tsx` | `health-empty` | `slot.parent?.props.testID` → `'health-states'` | `['Text', 'health-empty']` |
| R4 | `src/app/(tabs)/__tests__/food.test.tsx` | `food-empty` | `slot.parent?.parent?.props.testID` → `'screen-food'` | `['Text', 'food-empty']` |
| R4 | `src/screens/map/index.test.tsx` | `map-no-pets` | `slot.parent?.props.className` → `'flex-1 items-center justify-center p-6 bg-background'` **y** `slot.parent?.parent?.props.testID` → `'screen-map'` (dos `expect`) | `['map-no-pets']` |
| R5 | `src/screens/alerts/index.test.tsx` | `alerts-empty` | `slot.parent?.parent?.props.testID` → `'alerts-list'` | `['alerts-empty']` |
| R6 | `src/screens/reminders/index.test.tsx` | `reminders-empty` | `slot.parent?.parent?.props.testID` → `'screen-reminders'` | `['reminders-actions', 'RCTScrollView', 'reminders-empty', 'reminders-delete-host']` y, con el error de acción visible, `['reminders-actions', 'RCTScrollView', 'reminders-empty', 'reminders-action-error', 'reminders-delete-host']` (ver «Arreglo propio de R6») |
| R7 | `src/screens/docs/index.test.tsx` | `docs-empty` | `slot.parent?.parent?.props.testID` → `'screen-docs'` | `['View', 'docs-empty']` |
| R8 | `src/screens/geofences/index.test.tsx` | `geofences-empty` | `slot.parent?.parent?.props.testID` → `'screen-geofences'` | `['geofences-empty', 'geofences-add']` |
| R9 | `src/app/(tabs)/__tests__/food.test.tsx` | `food-plan-empty` | `slot.parent?.parent?.parent?.props.testID` → `'screen-food'` | `['food-plan-empty', 'meal-schedule-link', 'meals-history-link']` |

Cómo se lee la tabla, medido en el árbol de host:
- `'Text'` es el título de la pantalla (`text-2xl font-black`).
- `'View'` en docs es la cabecera `gap-1`.
- `'RCTScrollView'` en reminders es el `PetSwitcher`.
- `reminders-delete-host` es el host del diálogo de borrar.
- Donde el ancla es el abuelo, el padre es el contenedor de contenido del
  `ScrollView` o de la `FlatList`, que no tiene testID. En R9 el padre es el
  `View` `gap-4` de la mascota seleccionada.

**Arreglo propio de R6 (G4).** `reminders-action-error` solo se limpia al
perder el foco, al empezar otro borrado o al abrir el diálogo. Un cambio de
mascota no lo limpia. Así, un borrado fallido seguido de un cambio a una
mascota sin recordatorios deja el vacío y el error visibles a la vez. El
`it` de R6 recorre ese camino y comprueba las dos listas: la de antes del
error y la de después. Va literal, medido en el spike:

```tsx
  it('queda en el sitio del vacío que sustituye', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet(), makePet({ id: 'pet-2', name: 'Milo' })] });
    mockListReminders.mockImplementation((_url, _token, petId) => Promise.resolve<RemindersState>({ kind: 'ok', reminders: petId === 'pet-2' ? [makeReminder({ petId: 'pet-2' })] : [] }));
    mockDeleteReminder.mockResolvedValue({ kind: 'forbidden' });
    await renderReminders();
    await screen.findByTestId('reminders-empty-pose');
    const slot = screen.getByTestId('reminders-empty');
    expect(slot.parent?.parent?.props.testID).toBe('screen-reminders');
    expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['reminders-actions', 'RCTScrollView', 'reminders-empty', 'reminders-delete-host']);
    await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));
    await waitFor(() => expect(screen.getByTestId('reminder-delete-reminder-1')).toBeVisible());
    await confirmDelete('reminder-1');
    await waitFor(() => expect(screen.getByTestId('reminders-action-error')).toBeVisible());
    await fireEvent.press(screen.getByTestId('pet-chip-pet-1'));
    await screen.findByTestId('reminders-empty-pose');
    const slotWithError = screen.getByTestId('reminders-empty');
    expect(slotWithError.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['reminders-actions', 'RCTScrollView', 'reminders-empty', 'reminders-action-error', 'reminders-delete-host']);
  });
```

Usa `makePet`, `makeReminder`, `confirmDelete` y el tipo `RemindersState`,
que el fichero ya tiene. El orden de mascotas de `makePet` deja `pet-1`
seleccionada al montar.

Qué cierra:
- **B2:** un envoltorio en Inicio, Salud o Comida, y el envoltorio del mapa
  quitado o cambiado.
- **B3:** el sitio en las cinco pantallas de R5 a R9; en reminders, el orden
  respecto del `PetSwitcher`, de `reminders-actions` y de
  `reminders-action-error` (G4).
- **R9:** las dos tarjetas siguen debajo del vacío, en su orden, incluida
  la de historial.

### E2.3 — R11: sin `Animated` ni transiciones

El describe `#155 R11: los vacíos no traen movimiento ni dependencias` suma
dos `it` al final. Los dos que ya tiene no cambian.

```tsx
it('EmptyState importa exactamente Image, Button, Text y View', () => {
  const source = readFileSync(join(process.cwd(), 'src', 'components', 'empty-state.tsx'), 'utf8');
  expect(source.match(/^import\b.*$/gm)).toEqual([
    "import { Image } from 'expo-image';",
    "import { Button } from 'heroui-native';",
    "import { Text, View } from 'react-native';",
  ]);
  expect(source.match(/\brequire\(/g)).toHaveLength(6);
});

it('EmptyState no anima con Animated, LayoutAnimation ni transiciones', () => {
  const source = readFileSync(join(process.cwd(), 'src', 'components', 'empty-state.tsx'), 'utf8');
  expect(source).not.toMatch(/\bAnimated\b|LayoutAnimation|transition|animate-/);
});
```

Además, el `it.each` de R2 (`%s es un WebP con alfa de 1024×1024…`) suma
una línea, justo debajo de la del alfa:
`expect(bytes[20] & 0x02).toBe(0);`. Es el bit de animación de la cabecera
VP8X. `expo-image` reproduce los WebP animados por defecto, así que una
pose animada movería la pantalla sin tocar código y fuera de reduce motion
(G1). La línea entra en el commit de R11.

Con esto, la cláusula «`EmptyState` no anima» queda cerrada así:

| Vía | La caza |
|---|---|
| Reanimated, `entering=` y `MOTION_` | los dos `it` que ya existen |
| `Animated` y `LayoutAnimation` de React Native, por import o por `require` | los imports exactos, los 6 `require` (las seis poses) y la regex |
| `transition` de `expo-image` y las clases `animate-*`/`transition-*` | la regex |
| hooks de `react` para animar por estado | los imports exactos |
| una pose WebP animada | el bit `0x02` en el `it.each` de R2 |

Efecto lateral: los imports exactos también cierran, solo para
`empty-state.tsx`, el hueco de comillas dobles de N2. N2 sigue fuera en lo
demás.

### E2.4 — Cuentas

Medidas en `8c142376` con jest acotado al fichero:

| Fichero | Antes | Después |
|---|---|---|
| `src/components/__tests__/empty-state.test.tsx` | 59 | 64 |
| `src/screens/home/index.test.tsx` | 220 | 221 |
| `src/screens/health/index.test.tsx` | 66 | 67 |
| `src/app/(tabs)/__tests__/food.test.tsx` | 61 | 63 |
| `src/screens/map/index.test.tsx` | 96 | 97 |
| `src/screens/alerts/index.test.tsx` | 38 | 39 |
| `src/screens/reminders/index.test.tsx` | 33 | 34 |
| `src/screens/docs/index.test.tsx` | 15 | 16 |
| `src/screens/geofences/index.test.tsx` | 50 | 51 |
| **Total (9 ficheros)** | 638 | 652 |

Las líneas de la pre-verificación (G1-G4 y NIMG) van dentro de `it` que ya
existen o que E2 ya añadía, así que no mueven ninguna cifra de esta tabla.

La suite móvil de `init.sh` pasa de 2351 a 2365 tests. No cambia ninguna
fila de `ui-copy-table.ts`, ningún recuento de `ui-language.test.ts` ni la
longitud del catálogo.

### E2.5 — Sondas

Cada sonda se aplica sobre HEAD, se mide con jest acotado a su fichero de
test, se revierte con `git checkout HEAD -- <fichero>` y se comprueba
`limpio=0` (tasks.md §Reglas, «Sondas»). Todas dan **rojo por aserción**,
nunca por consulta: el nodo sigue existiendo y lo que falla es el `expect`.
Así fallaron todas en el spike.

| Id | Fichero de producción | Mutación | Rojo esperado (`it` y matcher) |
|---|---|---|---|
| E2-S1 | `empty-state.tsx` | los bloques `Text` del título y del cuerpo intercambiados | los dos `…como hijos directos…`, `toEqual` |
| E2-S2 | `empty-state.tsx` | `<View className="rounded-full bg-surface p-4">` envolviendo el `Image` | los dos `…como hijos directos…`, `toEqual` |
| E2-S3 | `empty-state.tsx` | `<Card className="bg-surface">` envolviendo el `View` raíz, con `Card` en el import de `heroui-native` | los dos `…como hijos directos…`, `toBe`, y `…importa exactamente…`, `toEqual` |
| E2-S4 | `empty-state.tsx` | `<View className="bg-surface">` envolviendo el `View` raíz | los dos `…como hijos directos…`, `toBe` |
| E2-S5 | `empty-state.tsx` | `variant="secondary" size="lg"` en el `Button`, tras `testID` | `declara el botón sin size ni variant`, `toContain` |
| E2-S6 | `empty-state.tsx` | `variant="primary"` explícito en el `Button`, tras `testID` | `declara el botón sin size ni variant`, `toContain` |
| E2-S7 | `empty-state.tsx` | `import { useEffect, useRef } from 'react';`, `Animated` en el import de `react-native` y un `Animated.loop(Animated.timing(…))` en un `useEffect` | `…importa exactamente…`, `toEqual`, y `…no anima con Animated…`, `not.toMatch` |
| E2-S8 | `empty-state.tsx` | `transition={300}` en el `Image` | `…no anima con Animated…`, `not.toMatch` |
| E2-S9 | `empty-state.tsx` | `// eslint-disable-next-line` y `const RN = require('react-native');` encima de la función, y `RN.Animated;` como su primera línea, sin tocar los imports | `…no anima con Animated…`, `not.toMatch`, y `…importa exactamente…`, `toHaveLength(6)` |
| E2-S10 a E2-S18 | la pantalla de cada fila de E2.2 | `<View>` pelado envolviendo el `EmptyState` de `<id>` (las 9 filas, en el orden de la tabla) | `queda en el sitio del vacío que sustituye` de su describe, `toBe` |
| E2-S19 | `src/screens/map/index.tsx` | `className` del envoltorio de `map-no-pets` quitado (queda `<View>`) | el `it` de sitio del Mapa, `toBe` |
| E2-S20 | `src/screens/reminders/index.tsx` | bloque de `reminders-empty` movido encima del bloque del `PetSwitcher` | el `it` de sitio de R6, `toEqual` |
| E2-S21 | `src/app/(tabs)/food.tsx` | bloque de `food-plan-empty` movido debajo de la `Card` `meals-history-link` | el `it` de sitio de R9, `toEqual` |
| E2-S22 | `src/app/(tabs)/food.tsx` | la `Card` `meals-history-link` dentro de `{plan.data?.kind !== 'not-found' ? (…) : null}` | el `it` de sitio de R9, `toEqual` |
| E2-S23 | `assets/images/pingo-talk.webp` | bit de animación de VP8X puesto, desde `mobile-pet-tracker/`: `node -e "const fs=require('fs');const f='assets/images/pingo-talk.webp';const b=fs.readFileSync(f);b[20]^=2;fs.writeFileSync(f,b)"` | la fila `pingo-talk.webp` del `it.each` de R2, `toBe` |
| E2-S24 | `empty-state.tsx` | `style={{ backgroundColor: "white", borderRadius: 24 }}` en el `View` raíz, tras `className` | los dos `…como hijos directos…`, `toBeUndefined` |
| E2-S25 | `empty-state.tsx` | el `View` raíz cambiado a `Text`, en la apertura y en el cierre | los dos `…como hijos directos…`, `toBe` |
| E2-S26 | `empty-state.tsx` | `className="rounded-full bg-surface"` en el `Image`, tras `contentFit` | las seis filas de `pinta la pose %s a 160×160 y sin etiqueta`, `toBeUndefined` |
| E2-S27 | `src/screens/reminders/index.tsx` | bloque de `reminders-empty` movido debajo del bloque `{actionError ? (…) : null}` | el `it` de sitio de R6, el segundo `toEqual` |

Ninguna sonda se commitea. Cada una se apunta en el impl con su salida roja
recortada: el `●` del `it` y la línea del matcher.

### E2.6 — Qué no cambia

- **Producción.** Ningún fichero de producción cambia:
  `git diff --name-only <E2H> HEAD -- mobile-pet-tracker`, con `<E2H>` el HEAD con el que arranca la Reanudación 3 del handoff,
  solo lista los 9 ficheros de test de E2.4.
- **Tests existentes.** De los `it` que ya existían solo cambian dos
  `it.each`, con una línea cada uno: el de R2 (bit de animación, E2.3) y
  el de las poses de R3 (`className` del `Image`, E2.1). No se tocan los
  demás, ni R10, ni los dos `it` que ya tiene R11.
- **Poses de bienvenida.** El candado de poses de #153 R3 en welcome
  (`pingo-wave*`) no suma el bit de animación: esas poses no son de #155.
- **Dependencias.** `package.json` y `bun.lock` no cambian.
- **N1 y N2** quedan como delimitación (ver arriba).

### E2.7 — Riesgo

**Si un candado no da verde contra HEAD, Codex PARA.** Copia el `Received`
recortado al impl y no toca producción ni ajusta la lista esperada. La spec
mide el árbol en un arreglo concreto, y si ese arreglo no reproduce lo
medido, quien decide es el leader.
