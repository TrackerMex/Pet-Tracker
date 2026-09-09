---
feature: "mobile-home-reminders-real-data"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec]
---

# Diseño — [[mobile-home-reminders-real-data]]

> Ver [[requirements]] para los requisitos que este diseño implementa,
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI y
> [[../../docs/architecture|architecture]] para las reglas de capas.
> Base de medición: **`20c7b3c`** (merge del PR #116, #70).

---

## 1. La decisión que ordena todo el resto: la opción (b)

El informe planteaba tres caminos. **D-A** cerró el primero de todos —lista
corta, no una sola fila— y eso arrastra el resto:

| opción | coste backend | candados que mueve | veredicto |
|---|---|---|---|
| **(a)** extender el contrato del perfil | puerto + adaptador + módulo envoltorio + campo en `PetProfile` + mapper | si es una **lista**: las **24 claves** del perfil en **6 ficheros** más el comentario normativo de `pet-profile-response.mapper.ts:12-17` | **Descartada.** La ranura `nextReminder` es **singular por diseño documentado**; meterle un array miente al nombre del campo, y una clave 25ª contradice una norma que vive en producción |
| **(b)** la Home llama al endpoint que ya existe | **cero** | ninguno en backend; en móvil, enmendar #70 R15 | **Elegida.** Cero backend, cero contrato congelado tocado, cero dependencia de #82 |
| **(c)** endpoint nuevo | controller + use case + método de repo + e2e | los suyos, nuevos | **Descartada.** Duplica una lectura que ya se sirve; el filtrado que lo justificaría cabe en el cliente sin coste medible (una mascota tiene decenas de recordatorios, no miles) |

Consecuencia arquitectónica que conviene decir en voz alta: `docs/architecture.md`
**no** pide que el perfil sea un agregador. Que la Home haga dos lecturas a dos
recursos distintos es lo normal en esta app —ya hace tres— y es más honesto que
inflar un contrato explícitamente cerrado.

**Coste aceptado**: una petición más al arranque de la Home (R4, enmienda A1).

---

## 2. Anatomía final de la sección

```
reminders-section                       View, gap-3
├─ [0] cabecera                         View, flex-row items-center justify-between
│   ├─ reminders-section-title          Text — t('home.reminders') → "Recordatorios"
│   └─ reminders-see-all                Pressable → router.push('/reminders')
└─ [1] reminders-section-body           View, gap-2
    ├─ [0] RANURA DE LA VACUNA          #70, intacta:
    │       reminders-section-skeleton     (detail cargando)
    │       reminders-next-vaccine         (ok + vacuna)
    │       reminders-none-upcoming        (ok + sin vacuna)
    │       — nada —                       (detail en error)
    ├─ [1] reminders-item-<id>          ← #85, 0..3 filas, por dueAt ascendente
    ├─ [2] reminders-item-<id>
    └─ [3] reminders-item-<id>
```

Cada `reminders-item-<id>` es una `Card` compartida, `flex-row items-center gap-3`:

```
[0] disco   size-9 rounded-full + CATEGORY_SLOTS[slot].surface   →  <Icon size={20} color={ink} />
[1] grupo   flex-1
      [0] reminders-item-<id>-title   text-sm font-semibold text-foreground
      [1] reminders-item-<id>-date    text-xs font-normal text-muted
[2] reminders-item-<id>-days   rounded-full px-2.5 py-1 text-xs font-bold + ámbar + TABULAR_NUMS
```

**Es la misma anatomía que la fila de la vacuna de #70 R6, a propósito**: la
sección no cambia de forma al llenarse, y el reviewer puede comparar las dos
filas nodo a nodo.

---

## 3. Decisiones técnicas

### D1 — La vacuna es primera fila **fija**, no un elemento más del orden

**A qué requisitos sirve**: R5, R7. **Decisión del humano (D-C).**

Fusionarla en la lista obligaría a comparar un **día civil** (`nextDoseAt`,
columna `date`) con un **instante** (`dueAt`, `timestamptz`), y a resolver el
empate entre dos orígenes que no comparten clave. Dejarla arriba y aparte
elimina los dos problemas de raíz y conserva el dato que #70 acaba de entregar.

El precio —que la misma vacuna pueda verse dos veces— se acepta por escrito en
[[requirements]] §0.3, porque **no hay clave para deduplicar**.

### D2 — `localDayOf`: una función nueva, dos existentes reutilizadas

**A qué requisitos sirve**: R2, R3, R5. **Decisión del leader (D-J).**

`calendarDaysUntil` y `fmtDate` son correctos y ya están candados por #70 R5 con
espías de `Date`. Lo único que les falta es que su entrada sea un **día civil**.
Así que #85 escribe **una sola** función —`localDayOf(instant): 'YYYY-MM-DD'`— y
compone:

```ts
calendarDaysUntil(localDayOf(reminder.dueAt), new Date())
fmtDate(localDayOf(reminder.dueAt), locale)
```

Alternativa descartada: `calendarDaysUntilInstant(iso, now)`, una función
hermana que duplicase la aritmética de medianoches. Habría hecho falta una
tercera función igual para la fecha visible, y dos aritméticas paralelas es
exactamente la deuda que #84 existe para pagar.

**La distinción que un reviewer va a mirar dos veces**: `new Date(cadena)` está
prohibido por #70 R5 para cadenas **solo-fecha** (`'2026-09-15'`), que el motor
interpreta como medianoche **UTC** y en offset negativo caen un día antes. Un
ISO **con hora y zona** es un instante inequívoco y `new Date(instante)` es la
forma correcta —y la única— de parsearlo. La disciplina se conserva entera: el
día civil sale de los getters **locales** y la resta de medianoches la sigue
haciendo `calendarDaysUntil` con `Date.UTC` por componentes.

### D3 — El candado de zona horaria: espías de `Date`, jamás `process.env.TZ`

**A qué requisitos sirve**: R2, R15/M1. **Motivo medido, no estimado.**

`process.env.TZ` asignado dentro de un `it` **no llega a V8** bajo Jest (#70 D5,
sonda `PROBE changed= false`), y eso costó el rechazo del primer pase de #70.
El mecanismo que sí muerde ya está escrito en este repo, en
`src/screens/home/format.test.ts:38-52`:

1. espiar `Date.parse` y `Date.UTC`;
2. espiar el **constructor** con `Reflect.construct` para ver los argumentos;
3. donde haga falta distinguir local de UTC, devolver un **doble sesgado** cuyos
   getters locales y UTC discrepen por construcción.

El punto 3 es la lección de #70 D7/O4: sin el doble sesgado, una mutación
`getUTC*` produce en una caja UTC **exactamente las mismas llamadas** y pasa
todas las aserciones de espía. Con él, muere en cualquier zona.

### D4 — Las fixturas de fecha se construyen en hora **local**, nunca como literal `Z`

**A qué requisitos sirve**: R3, R5, y a la salud mental del CI.

Un literal `'2026-09-11T12:00:00.000Z'` cae en un día civil distinto según el
`TZ` de la máquina que corra la suite. El helper de test

```ts
function localIso(year: number, monthIndex: number, day: number): string {
  return new Date(year, monthIndex, day, 12, 0).toISOString();
}
```

produce un instante de **mediodía local**, cuyo día civil local es el pretendido
**en cualquier offset**, incluidos los de ±13/±14. Es la diferencia entre un
test que vigila y un test que depende de dónde corre.

### D5 — El icono lo aporta un mapa nuevo; la **categoría** sigue siendo de `reminder-meta.ts`

**A qué requisitos sirve**: R6. **Decisión del humano (D-G).**

`REMINDER_TYPE_META` ya reparte los siete tipos a `{ labelKey, emoji, category }`
y lo usa `/reminders`. #70 R13 prohíbe el emoji en esta sección. La tercera vía
—un mapa de iconos— es la única que no rompe ninguna de las dos cosas.

Para que no haya **dos verdades sobre la categoría**, el mapa nuevo aporta
**solo el icono**:

```ts
const REMINDER_ROW_ICONS: Record<ReminderType, IconComponent> = { … };
const slot = REMINDER_TYPE_META[type].category;      // única fuente
const surface = CATEGORY_SLOTS[slot].surface;         // única fuente
const inkToken = slot === 'neutral' ? 'muted' : `category-${slot}-strong`;
```

`category-neutral-strong` **no es un token**: `CATEGORY_SLOTS.neutral` vale
`{ surface: 'bg-default', ink: 'text-muted' }`. De ahí el ternario, que R6
prescribe literalmente para que Codex no invente un token inexistente y se
encuentre con un color negro por el fallback de `useThemeColors`.

**Los siete nombres, y por qué esos**:

| tipo | icono | por qué |
|---|---|---|
| `vaccine` | `Syringe` | ya es el glifo de vacuna en la Home (#70 R13) y en Salud (`health.tsx:144-161`) |
| `deworming` | `Bacteria` | `Worm` **no existe** en `reicon-react-native`, verificado |
| `medication` | `Pill` | literal |
| `appointment` | `Stethoscope` | literal |
| `weight` | `Weight` | ya es el glifo de peso en el tile `quick-action-weight` (#71 R7) |
| `food` | `Bone` | **no `ForkKnife`**: es uno de los cinco glifos de la barra de pestañas (`floating-tab-bar.tsx:49-54`) |
| `custom` | `Bell` | catch-all; no colisiona con nada de la Home ni de la barra |

Los siete están verificados presentes en
`node_modules/reicon-react-native/index.d.ts`. **Cero dependencias nuevas.**

**El icono se renderiza por variable** (`<Icon size={20} color={ink} />`), no con
siete etiquetas literales: `#70 R13` asserta que `<Syringe size={20}` aparece
**exactamente 2** veces en el fuente, y siete literales lo romperían.

### D6 — Las filas no son pulsables

**A qué requisitos sirve**: R8. **Decisión del leader (D-E).**

#70 R10 tiene un candado vivo —`it('no añade un segundo camino a la lista desde
la Home')`, `index.test.tsx:2123`— y el enlace de la cabecera ya va a
`/reminders`. Una fila pulsable duplicaría el destino y lo rompería. El destino
que **sí** justificaría hacerla pulsable —el **detalle** de un recordatorio— no
existe todavía; es otra feature.

### D7 — Sin etiqueta de tipo y sin nombre accesible en el icono

**A qué requisitos sirve**: R5, R8, R11.

El tipo lo portan el icono y su hueco de color; el texto que acompaña al hueco
—lo que la carta §Dirección de arte 1 exige— es el **título** que el dueño
escribió. Es exactamente el reparto que #70 R6 ya pasó por el gate con la fila
de la vacuna.

Ponerle etiqueta o `accessibilityLabel` obligaría a meter siete
`labelKey: 'reminderType.*'` en `src/screens/home/index.tsx`, lo que mueve
`R3_HOME` **+7** y la tabla de `ui-copy-table.ts`, para repetir en palabras una
categorización de un título que el propio usuario redactó. Se declara la
omisión en vez de esconderla ([[requirements]] R8, decisión abierta E1).

### D8 — Cero copy nueva: `dueCountdown` se comparte

**A qué requisitos sirve**: R5, R11, R13 filas 1-3.

Si las filas de recordatorio tuviesen su propio contador, habría **cuatro
llamadas `t()` nuevas** en el mismo fichero → cuatro filas nuevas en `R3_HOME` →
dos candados globales movidos, y dos textos que podrían divergir. Renombrar
`vaccineCountdown` a `dueCountdown` y llamarlo desde los dos sitios deja los
recuentos **exactamente donde están** y garantiza que el texto visible y el
nombre accesible salen del mismo sitio para las dos clases de fila.

Es también lo que mantiene el delta del **candado de longitud del catálogo** en
`+ 0`: no se añade ni se quita ninguna clave. Ese candado
(`language-provider.test.tsx:41`) se enumera igualmente el primero en R13, porque
omitirlo —aunque el delta sea cero— es lo que paró el trabajo en #68 y en #69.

### D9 — Sin esqueleto propio y sin error propio para la lista

**A qué requisitos sirve**: R9.

Las dos peticiones arrancan juntas con el mismo `selectedPetId`, así que durante
la carga el cuerpo ya muestra el esqueleto de la ranura de la vacuna (#70 R9) y
nunca está vacío. Un esqueleto para un número de filas desconocido prometería
filas que pueden no existir. La sección crece **hacia abajo** y como mucho tres
filas: no hay reflujo de lo que el usuario está leyendo.

El error se calla por el mismo argumento de #70 R9: `pet-hero-error` ya está
arriba en el mismo `home-content`, y `reminders-see-all` lleva a una pantalla que
tiene su propia petición y su propio reintento. **C8 prohíbe el spinner suelto,
no exige un esqueleto por cada trozo asíncrono.**

### D10 — El defecto de #82 se declara, no se propaga

**A qué requisitos sirve**: §0.4, R3.

Se podría "arreglar" la incoherencia alineando #85 al `gt` UTC del backend. Sería
propagar el bug a la mitad que hoy está sana. El filtro de #85 usa el día civil
**local** e **inclusivo**, igual que la pestaña Salud, y la contradicción del día
de la dosis queda escrita como defecto heredado que cierra **#82** (decisión
**D-I**).

---

## 4. Archivos afectados

Todos en la capa de **infraestructura de UI** del cliente móvil. **Ningún
fichero de producción nuevo. Cero backend.**

| Fichero | Qué cambia | Requisitos |
|---|---|---|
| `mobile-pet-tracker/src/i18n/catalog.ts` | **dos valores** en `en` (`:53-54`) y dos en `es` (`:346-347`). Cero claves añadidas, quitadas o renombradas | R1, R11 |
| `mobile-pet-tracker/src/screens/home/format.ts` | **+2 funciones exportadas**: `localDayOf`, `upcomingReminders`. `calendarDaysUntil` y `fmtDate` **intactos** | R2, R3 |
| `mobile-pet-tracker/src/screens/home/format.test.ts` | dos `describe` nuevos (`#85 R2`, `#85 R3`) + el helper `localIso` | R2, R3 |
| `mobile-pet-tracker/src/screens/home/index.tsx` | import de `listReminders` y de 5 iconos; const `REMINDER_ROW_ICONS`; `vaccineCountdown` → `dueCountdown`; `remindersFn`/`reminders`/`upcoming`; tintas por hueco; el `.map` de filas dentro de `reminders-section-body` | R4-R10 |
| `mobile-pet-tracker/src/screens/home/index.test.tsx` | `jest.mock('../../api/reminders')`; 5 entradas nuevas en el doble de `reicon`; `HomeWrapperEn`; helpers `localIso`/`makeReminder`; seis `describe` nuevos; **tres adaptaciones** a tests de #70 (dos literales de copy, el título del `it` de cardinalidad, el recuento de llamadas) | R1, R4-R10 |
| `mobile-pet-tracker/src/__tests__/design-drift.test.ts` | **+1 `describe`** con la lista nominal de #85 | R12 |
| `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` | `HOME_TABULAR_DELTA_85 = 1` y los **cuatro** mandos que se mueven con él | R13 fila 4 |
| `feature_list.json` | `status` → `done` y `files_affected` alineado con la realidad (cero backend) | cierre |
| `specs/`, `progress/` | spec, trazabilidad e informe | cierre |

**No se tocan**, y si el diff los muestra es un defecto:
`src/api/*` (incluido `types.ts` y `reminders.ts`), `src/utils/*`,
`src/components/*`, `src/theme/*`, `src/app/*`, `src/screens/reminders/*`,
`src/providers/*`, `src/hooks/*`, `backend-pet-tracker/`, `infra/`, `hosting/`,
`specs/mobile-ui-language/design.md`, `docs/`.

---

## 5. Alternativas descartadas

- **Extender el contrato del perfil (opción (a))** — §1. La ranura reservada es
  **singular**; el contrato está congelado con un comentario normativo en
  producción y **24 claves** asertadas en seis ficheros.
- **Endpoint nuevo (opción (c))** — §1. Duplica una lectura que ya se sirve.
- **Filtrar u ordenar en el servidor** — pondría rojo
  `test/pet-reminders.e2e-spec.ts:143-144` por diseño, y el filtrado cabe en el
  cliente sin coste medible.
- **Fusionar vacuna y recordatorios en una sola lista ordenada** — D1.
- **Deduplicar por `title` vs `name`** — es adivinar; §0.3.
- **`calendarDaysUntilInstant` como función hermana** — D2: duplicaría la
  aritmética y haría falta una tercera para la fecha visible.
- **Reutilizar `daysUntil` de `src/utils/reminder-dates.ts`** — vetado hasta
  #84 (`Math.ceil` sobre ms) y con **cero** llamantes en la Home, así que
  evitarlo no cuesta nada.
- **`process.env.TZ` dentro del `it`** — D3: inerte bajo Jest, medido.
- **Ventana temporal además del tope de 3** — D-B: una regla más que candar sin
  resolver nada que el tope no resuelva.
- **`FlatList`** — la lista es de **tres** elementos como mucho y vive dentro
  del `ScrollView` de la Home. `/reminders` ya pinta sus filas con `.map`. La
  skill `expo-native-ui` reserva la virtualización para listas de longitud
  desconocida; ésta tiene tope duro.
- **`@expo/ui` `List`/`ListItem`** — son filas nativas agrupadas estilo Settings,
  con su propio sistema de estilo; aquí manda la carta y el `Card` compartido.
- **Sacar la sección o el mapa de iconos a un módulo propio** — haría crecer
  `SCREEN_FILES` (`ui-language.test.ts:357`) a cambio de nada; la carta solo pide
  extraer con **≥2 pantallas** y aquí hay una.
- **Etiqueta de tipo por fila** — D7: mueve `R3_HOME` +7 para repetir en
  palabras lo que el título ya dice.
- **Renombrar `home.nextVaccine*` a `home.due*`** — obligaría a enmendar la
  lista literal de `#70 R16` y la tabla de `specs/mobile-ui-language/design.md`
  a cambio de cero valor para el usuario. Deuda declarada (E1).
- **Arreglar `localTodayIso` duplicado tres veces** — E2; encaja con #84.
- **Enmendar la carta para que diga "icono" donde dice "emoji"** — E3: no se
  cuela un cambio de norma dentro de una feature de producto.

---

## 6. Orden de trabajo y por qué ése

El orden de [[tasks]] está elegido para que **cada test mida un sujeto que ya
existe** cuando se escribe. Es la lección de #70 D1: allí `tasks.md` prescribía
un assert de cardinalidad sobre un cuerpo cuyos hijos no se creaban hasta tres
requisitos después, y Codex tuvo que parar antes de escribir una línea.

```
R1  copy            → sujeto: el catálogo y el título, ya existen
R2  localDayOf      → función pura nueva, sin dependencias de árbol
R3  upcomingReminders → depende de R2 y de calendarDaysUntil, ya existentes
R4  la petición     → sujeto: los mocks de llamada, no el árbol
R5  las filas       → primer requisito que crea nodos en el árbol
R6  el disco        → añade children[0] a cada fila creada en R5
R7  cruce y posición→ TODOS sus sujetos existen tras R6  ← el orden importa aquí
R8  a11y            → filas ya existentes
R9  carga y error   → ramas de una sección ya completa
R10 estilo          → recetas de nodos ya existentes
R11-R13 candados    → inventarios sobre el árbol final
R14-R15 verificación
```

**R7 no puede ir antes de R6**: sus aserciones leen `fila.children[0]`, que es el
disco de icono. Escribirlo antes repetiría el error de #70 D1.

**R5 sí puede asertar `body.children.length` antes de R6**: los hijos del
*cuerpo* son las filas, y las filas existen desde R5; el disco es hijo de la
*fila*, no del cuerpo.
