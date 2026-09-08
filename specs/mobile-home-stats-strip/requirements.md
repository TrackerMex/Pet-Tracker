---
feature: "mobile-home-stats-strip"
status: approved       # draft | spec_ready | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-home-stats-strip]]

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, las premisas verificadas y las
> alternativas descartadas; [[../../docs/ui-guidelines|ui-guidelines]] para la
> carta de UI que gobierna todo trabajo móvil (gana sobre cualquier skill) y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> **Fuente de diseño** (versionada, no de memoria):
> `specs/mobile-figma-polish/design-src/App.tsx:368-383` — la tira de cuatro
> celdas de la Home del Figma Make. **El enunciado dice `App.tsx:366-384` y la
> ruta `design-src/App.tsx`: las dos citas están mal** ([[design]] §2 C1).
> Informe de origen: `progress/explore_design-gap-vs-make.md` §7 (Bloque 1),
> fechado el 2026-09-04 y desactualizado por cinco features.
>
> **Base de medición**: todo delta de esta spec se mide contra el commit base de
> la branch, **`9358cc7`** (merge del PR #113, #68). Ningún requisito congela un
> recuento absoluto: se fijan **deltas** y **consistencias internas**. Es la
> quinta vez que se dice en este repo; las anteriores costaron una sesión cada
> una.
>
> **Skills obligatorias antes de tocar código** (carta §Skills):
> `expo:expo-overview` → `expo:expo-native-ui` y `expo:expo-design-system`, más
> `appllama-app-design-skill`. En Codex CLI, las equivalentes del plugin `expo`.
> La carta gana sobre la skill en todo conflicto de estilo. SDK del proyecto:
> **Expo 57** (`mobile-pet-tracker/package.json:9`, `~57.0.14`); usar la
> documentación fijada a esa versión, nunca `latest`.

---

## 0. Premisas, verificadas una por una contra el árbol

Las cuatro premisas del enunciado de #69 se han comprobado **contra el árbol en
`9358cc7`**, no contra `progress/` ni contra documentación. El detalle con
`fichero:línea` vigente está en [[design]] §1; las correcciones, en [[design]] §2.

| # | Premisa del enunciado | Veredicto |
|---|---|---|
| 1 | El Make monta sobre el hero una tira de 4 celdas con divisores —Peso, Activo, Paseos, Distancia— en `design-src/App.tsx:366-384` | **Cierta en el fondo, falsa en las dos citas**: el fichero es `specs/mobile-figma-polish/design-src/App.tsx` y el rango real es **`:368-383`** ([[design]] §2 C1) |
| 2 | La app tiene hoy un `summary-card` con 3 celdas: actividad, sueño y distancia | **Cierta**, en `src/screens/home/index.tsx:282-353` (celdas en `:311-323`, `:324-336`, `:337-349`) |
| 3 | `walkCount` viene en cada entrada de `activity/daily` y `currentWeightKg` en el perfil | **Cierta en los datos, FALSA en su consecuencia**: `walkCount` **ya se pinta** en el hero desde #67 R7 (`src/screens/home/index.tsx:142`, clave `home.walks`). Añadir una celda "Paseos" duplicaría el dato en la misma pantalla ([[design]] §2 C2) — **esto cambia el trabajo** |
| 4 | No hace falta backend nuevo | **Cierta.** `currentWeightKg` sale de `GET /v1/pets/:petId` (`pet-profile-response.mapper.ts:70`, servido por `pets.controller.ts:82-94`) y la Home **ya lo descarga y lo tira** ([[design]] §1 P4). Cero ficheros de `backend-pet-tracker/` |

Re-verificado, como pidió el encargo: **`restMinutes` no tiene `weekComparison`**
— `WeekComparison` declara exactamente tres campos, `distanceM`, `activeMinutes`
y `walkCount` (`mobile-pet-tracker/src/api/types.ts:92-96`), y el origen backend
es `week-comparison.ts:12-16`. Sigue siendo cierto en `9358cc7`.

### 0.1 Dónde se pinta hoy cada dato, exactamente

Es lo que decide el reparto de celdas de R1, así que va con línea:

| Dato | Dónde se pinta hoy | `testID` |
|---|---|---|
| `walkCount` (hoy) | **hero**, dato destacado en `text-3xl` | `pet-hero-highlight-value` / `-label` (`src/screens/home/index.tsx:140-144`) |
| `activeMinutes` (hoy) | celda 1 de `summary-card` | `summary-activity` (`:314`) |
| `restMinutes` (hoy) | celda 2 de `summary-card` | `summary-sleep` (`:327`) |
| `distanceM` (hoy) | celda 3 de `summary-card` | `summary-distance` (`:340`) |
| `currentWeightKg` | **en ninguna parte de la Home**; se descarga en `detail` y se descarta | — |
| `restMinutes` (día tocado) | panel de detalle de la gráfica, **solo tras tocar una barra** | `weekly-activity-detail-rest` (`src/screens/home/weekly-activity-chart.tsx:713`) |

`walkCount` aparece además en el panel de detalle de la gráfica
(`weekly-activity-detail-walks`, `:708`), también solo tras tocar.

### 0.2 No existe candado global de hex

Confirmado en `9358cc7`, igual que declaró #68: el único test que persigue
hexadecimales es `src/__tests__/design-drift.test.ts`, y lo hace sobre **listas
nominales de ficheros** —bloque `R9` (`:101-110`), bloque `R11` (`:182-186`) y
bloque `#68 R18` (`:204-213`)—. No hay barrido global. Por eso R13 añade su
propio bloque en vez de confiar en uno que podría dejar de cubrir estos
ficheros.

---

## Requisitos

### R1 — La tira tiene cuatro celdas, con divisores, y su reparto es Peso / Actividad / Descanso / Distancia

- **R1**: WHEN la Home renderiza el resumen de hoy THE SYSTEM SHALL renderizar
  dentro de la `Card` compartida con `testID="summary-card"` una fila de
  **exactamente cuatro celdas**, en este orden y con este reparto exacto:

  | # | `testID` del valor | Dato | Formateador | Etiqueta (clave de catálogo) | Icono (`reicon-react-native`) |
  |---|---|---|---|---|---|
  | 1 | `summary-weight` | `detail.data.pet.currentWeightKg` | `fmtKg` (R2) | `home.weight` (**nueva**, R11) | `Weight` |
  | 2 | `summary-activity` | `today.activeMinutes` | `fmtMinutes` | `home.activity` | `Walk` |
  | 3 | `summary-sleep` | `today.restMinutes` | `fmtMinutes` | `home.sleep` | `Moon` |
  | 4 | `summary-distance` | `today.distanceM` | `fmtKm` | `home.distance` | `Map` |

  AND las celdas **1, 2 y 3** SHALL llevar `className` que contenga
  `border-r border-border` y la celda **4** SHALL **no** llevar ningún
  `border-r`, de modo que haya **tres** divisores entre cuatro celdas, como el
  Make (`design-src/App.tsx:376`);
  AND la fila contenedora SHALL declarar `className="flex-row"` —**sin `gap-3`
  y sin `justify-between`**—, para que los divisores queden a ras entre celda y
  celda como en el diseño y para que cuatro valores quepan en una pantalla de
  320 px ([[design]] §3 D5);
  AND cada celda SHALL conservar la receta que las tres existentes ya usan:
  `className="flex-1 items-center gap-1"` más el borde cuando toque, icono de
  20 px con `color={muted}`, valor en `text-sm font-bold text-foreground` y
  etiqueta en `text-2xs font-normal text-muted`;
  AND THE SYSTEM SHALL **no** renombrar ni eliminar los `testID`
  `summary-activity`, `summary-sleep` ni `summary-distance`, ni el del
  contenedor `summary-card`.
  - Test: `src/screens/home/index.test.tsx` ::
    `describe('#69 R1: la tira de hoy tiene cuatro celdas con tres divisores')`,
    con un `it` que asserta los cuatro `testID` en el orden del árbol, un `it`
    que asserta el reparto valor↔celda con un `DayEntry` de **valores
    deliberadamente distintos entre sí** (R3), y un `it` que cuenta los
    `border-r border-border` de la fila y espera **3**.

### R2 — El peso: origen, formato y guion

- **R2**: WHEN se renderiza la celda de peso THE SYSTEM SHALL tomar el valor de
  **`detail.data.pet.currentWeightKg`** —el `getPet` que la Home ya llama
  (`src/screens/home/index.tsx:78-84,92`)— y **nunca** de `activity`, que no lo
  trae;
  AND THE SYSTEM SHALL formatearlo con una función nueva
  `fmtKg(kg: number | null): string` exportada desde
  `mobile-pet-tracker/src/screens/home/format.ts`, con esta conducta exacta:
  `null → '—'`, y cualquier número → `` `${kg} kg` `` sin forzar decimales
  (`12 → '12 kg'`, `12.4 → '12.4 kg'`), que es la forma que el repo ya usa en
  `src/app/(tabs)/weight-log.tsx:277` y `src/app/(tabs)/health.tsx:233`;
  AND WHEN `detail.data` no ha resuelto o no es `ok` THE SYSTEM SHALL pasar
  `null` a `fmtKg`, de modo que la celda pinte `'—'` y **no** desaparezca ni
  rompa la fila de cuatro;
  AND `fmtKg` SHALL **no** aplicar separador decimal por locale ni
  `Intl.NumberFormat`: `fmtKm` (`format.ts:7-9`) tampoco lo hace y un segundo
  criterio en la misma fila sería drift ([[design]] §3 D6).
  - Test: `src/screens/home/format.test.ts` ::
    `describe('#69 R2: fmtKg')` — fichero **nuevo**, con tres `it`: `null`,
    entero y decimal. Más, en `index.test.tsx`, un `it` que monta
    `mockGetPet` en `{ kind: 'unreachable' }` y espera `'—'` en
    `summary-weight` **con la fila de cuatro celdas intacta**.

### R3 — Cada celda pinta su dato y ningún otro

- **R3**: WHEN se renderizan las cuatro celdas THE SYSTEM SHALL asociar cada
  `testID` de la tabla de R1 al dato de esa misma fila y a ningún otro, de modo
  que **intercambiar dos celdas cualesquiera ponga la suite roja**.
  - El test que lo prueba SHALL usar una fixture en la que los cuatro valores
    formateados sean **distintos entre sí y distinguibles a simple vista** —por
    ejemplo `currentWeightKg: 12.4` → `'12.4 kg'`, `activeMinutes: 95` →
    `'1h 35m'`, `restMinutes: 45` → `'45m'`, `distanceM: 2350` → `'2.4 km'`—,
    porque con la fixture por defecto de `makeDay` dos celdas podrían coincidir
    y un intercambio pasaría desapercibido.
  - **Este requisito es el que cierra la lección de #68**: el discriminante
    "qué dato va en qué celda" decide en **cuatro** sitios, así que el criterio
    de aceptación es *plantar la mutación en los cuatro, uno por uno, y que los
    cuatro pongan la suite roja* (R15b, mutaciones 1-4). Un test que solo
    comprueba que "hay cuatro celdas" no es un candado de conducta.
  - Test: mismo `describe` que R1 →
    `it('asigna cada valor a su celda y a ninguna otra')`.

### R4 — El sueño se conserva en la tira: decisión E cerrada

- **R4**: WHEN esta feature reordena el resumen de hoy THE SYSTEM SHALL
  **conservar `restMinutes` como celda siempre visible** de la tira
  (`summary-sleep`, celda 3 de R1), con la misma etiqueta `home.sleep`
  (`Descanso` / `Sleep`) que hoy;
  AND THE SYSTEM SHALL **no** trasladar el sueño al panel de detalle de la
  gráfica como único sitio, ni ocultarlo tras un toque, ni eliminarlo.
  - **Por qué, y esto es la decisión que el encargo obliga a cerrar por
    escrito**: el Make no dibuja el sueño (`design-src/App.tsx:370-374`), y la
    carta §Dirección de arte 5 dice que *"parecerse al diseño no autoriza a
    borrar un dato útil"*. Hoy `restMinutes` se pinta en **dos** sitios
    (§0.1): la celda `summary-sleep`, **siempre visible**, y
    `weekly-activity-detail-rest`, que solo aparece tras tocar una barra. Dejar
    solo el segundo **sí** es pérdida: cambia un dato de "visible al abrir la
    app" a "visible si el usuario descubre que las barras se tocan". La
    fidelidad al Make se paga en el sitio que no cuesta información: la celda
    3 lleva Descanso en lugar de Paseos, **porque Paseos ya está en el hero de
    la misma pantalla, más grande** (R5). El resultado es que la Home enseña
    los cinco datos —peso, actividad, descanso, distancia y paseos— sin
    duplicar ninguno y con exactamente las cuatro celdas del diseño.
  - **Desviación declarada respecto al Make**, que el humano ratifica en
    §Aprobación: la etiqueta de la celda 3 es `Descanso`, no `Paseos`.
  - Test: mismo `describe` que R1 →
    `it('conserva el descanso como celda siempre visible')`, que asserta
    `summary-sleep` visible **sin tocar ninguna barra de la gráfica**.

### R5 — Los paseos no se duplican: siguen solo en el hero

- **R5**: WHEN la Home renderiza la tira THE SYSTEM SHALL **no** renderizar
  ninguna celda de `walkCount` dentro de `summary-card`;
  AND THE SYSTEM SHALL dejar intacto el dato destacado del hero
  (`src/screens/home/index.tsx:140-144`), que sigue pintando
  `fmtCount(today.walkCount)` con la etiqueta `t('home.walks')`, tal y como
  fijó **#67 R7** (`specs/mobile-pet-hero-header/requirements.md:316-341`);
  AND THE SYSTEM SHALL **no** modificar `src/components/pet-hero-header.tsx`.
  - **Por qué no se duplica**: #67 R7 justificó por escrito que `walkCount`
    valía como dato destacado porque *"no se pinta hoy en ninguna pantalla, así
    que el hero no duplica ningún dato ya visible"*. Pintarlo otra vez a 40 px
    de distancia, en `text-sm`, bajo un `text-3xl` que dice lo mismo, invalida
    esa justificación y es el defecto de jerarquía que la carta §Checklist de
    autocrítica busca. En el Make no hay duplicación porque su hero destaca
    **pasos** (`design-src/App.tsx:363`), un dato que **no existe en ninguna
    capa** de este producto (#67 R7 lo verificó: cero ocurrencias de `steps` en
    `mobile-pet-tracker/src/`, y `activitySummary` sale `null` del backend).
  - **Esta es la premisa 3 del enunciado, y sale falsa en su consecuencia**: el
    enunciado pide "las cuatro celdas del diseño, incluida Paseos" porque se
    escribió cuando los paseos no se pintaban en ningún sitio. La Home **sí**
    muestra Paseos desde #67; lo que #69 no debe hacer es enseñarlos dos veces.
  - Test: mismo `describe` que R1 →
    `it('no repite los paseos dentro de la tira')`, que asserta
    `queryByTestId('summary-walks')` a `null`, que `summary-card` **no**
    contiene el texto de `t('home.walks')`, y que
    `pet-hero-highlight-value` sigue pintando el recuento del día.

### R6 — La tira sube: primer hijo de `home-content`, sobre la tarjeta del collar

- **R6**: WHEN se renderiza `home-content` THE SYSTEM SHALL colocar
  `summary-card` como **primer hijo** del envoltorio
  `testID="home-content"`, **antes** de `collar-card`, porque en el diseño la
  tira va pegada bajo el hero y la fila de collar/ubicación viene después
  (`design-src/App.tsx:368-383` y `:384-394`);
  AND el resto del orden SHALL quedar
  `summary-card` → `collar-card` → `weekly-activity-card` →
  `last-position-card`;
  AND THE SYSTEM SHALL **no** tocar el bloque de error del detalle
  (`pet-hero-error` / `pet-hero-retry`, `:194-203`), que sigue siendo lo
  primero que se pinta cuando el detalle falla;
  AND THE SYSTEM SHALL **no** añadir margen negativo para solapar el hero: el
  Make usa `-mt-1` (4 px) sobre una foto a sangre y aquí el hero termina en la
  banda opaca `pet-hero-caption` con `pb-4`, así que el solape no aporta nada y
  rompería el `gap: 16` uniforme de §Dimensiones ([[design]] §3 D4).
  - El candado de orden que dejó #68 (`index.test.tsx:1121-1150`) **sigue verde
    sin tocarlo**: filtra a `summary-card` → `weekly-activity-card` →
    `last-position-card`, y esa secuencia relativa no cambia. Comprobado, no
    supuesto.
  - Test: mismo `describe` que R1 →
    `it('coloca la tira sobre la tarjeta del collar')`, que lee los `testID`
    de los hijos de `home-content` y espera
    `['summary-card', 'collar-card', 'weekly-activity-card', 'last-position-card']`
    tras filtrar a esos cuatro.

### R7 — Los estados de carga y de error no cambian de conducta

- **R7**: WHILE `activity.data === undefined` THE SYSTEM SHALL seguir
  renderizando `summary-skeleton` con `className="h-16 w-full rounded-xl"`
  (`src/screens/home/index.tsx:291-293`), sin celdas;
  AND WHEN `activity.data.kind` es `no-tracking` THE SYSTEM SHALL seguir
  pintando `summary-note` con `t('home.activityNeedsCollar')`, y WHEN es
  `error`, `unreachable` o `missing-config` SHALL seguir pintando
  `summary-note` con `t('home.couldNotLoadActivity')`, en ambos casos **sin
  celdas**;
  AND WHEN `activity.data.kind === 'ok'` THE SYSTEM SHALL renderizar las cuatro
  celdas;
  AND THE SYSTEM SHALL **no** desacoplar la celda de peso de esa condición: la
  fila entera aparece y desaparece junta, como hoy.
  - **Por qué el peso no se emancipa, aunque no dependa del collar**: hacerlo
    obligaría a una fila que a veces tiene una celda y a veces cuatro, con su
    propio juego de divisores, y a reescribir los cinco `it` de
    `describe('R9: summary degrada con gracia')` (`index.test.tsx:441-560`).
    Relativo a hoy **no se pierde nada**: el peso no se pinta en la Home en
    ningún estado. Si el humano quiere el peso visible sin collar, es una
    decisión de producto y va a feature propia ([[design]] §5).
  - Test: los cinco `it` de `describe('R9: summary degrada con gracia')`
    (`index.test.tsx:441-560`) SHALL quedar **verdes sin debilitar ningún
    assert**, más un `it` nuevo en el mismo `describe` que añade
    `summary-weight` a la comprobación de guiones de
    `it('shows dashes instead of zero for missing metrics')`.

### R8 — Cero llamadas nuevas a la API, cero backend

- **R8**: WHEN esta feature se implementa THE SYSTEM SHALL alimentar las cuatro
  celdas con los dos `useApi` que la Home ya tiene —`detailFn`
  (`src/screens/home/index.tsx:78-84`) y `activityFn` (`:85-91`)— sin añadir
  ninguna llamada, sin parámetros nuevos, sin tocar `src/api/` y sin tocar
  `src/hooks/use-api.ts`;
  AND THE SYSTEM SHALL **no** modificar ni un fichero de
  `backend-pet-tracker/`, `infra/` ni `hosting/`.
  - IF durante la implementación aparece un dato de la tira que exija una
    petición nueva THEN **la feature se para y se reporta**: no se añade la
    llamada (mismo criterio que #68).
  - Test: `src/screens/home/index.test.tsx` :: en el `describe` de R1, un `it`
    que compara el recuento de llamadas de `mockGetPet` y
    `mockGetDailyActivity` con el escenario equivalente y espera **el mismo
    número**; más `git diff --stat` limpio fuera de `mobile-pet-tracker/` y
    `specs/`, que verifica el reviewer.

### R9 — Iconos reales, nunca el emoji del Make

- **R9**: WHEN se renderiza el icono de una celda THE SYSTEM SHALL usar un
  componente de `reicon-react-native` con `size={20}` y `color={muted}`
  —`muted` resuelto por el `useThemeColors(['accent-strong','success','warning','muted'])`
  que la pantalla ya hace (`src/screens/home/index.tsx:66-71`)—, con el reparto
  de R1: `Weight` (**import nuevo**, verificado en
  `node_modules/reicon-react-native/index.d.ts:2642`), `Walk`, `Moon` y `Map`;
  AND THE SYSTEM SHALL **no** usar los emoji del Make (`⚖️ ⚡ 🦮 📍`,
  `design-src/App.tsx:371-374`) ni ningún glifo tipográfico como icono, que es
  lo que prohíbe **#62 R7** (candado en
  `src/__tests__/consistency-classnames.test.ts:186-217`);
  AND THE SYSTEM SHALL **no** pedir `useThemeColors(['accent'])`, que el
  candado de #61 R4 (`legibility-classnames.test.ts:145-149`) rechaza en
  cualquier fuente de producción.
  - Test: mismo `describe` que R1 →
    `it('usa iconos de reicon y ningún emoji')`, que lee el fuente con
    `readFileSync` y asserta el import de `Weight`, los cuatro usos
    `size={20} color={muted}` y la ausencia de los cuatro emoji.

### R10 — Los cuatro valores llevan cifras tabulares

- **R10**: WHEN se renderiza el `Text` de valor de cualquiera de las cuatro
  celdas THE SYSTEM SHALL declarar `style={TABULAR_NUMS}` de
  `src/theme/native-styles.ts`, como fijó **#62 R15**
  (`specs/mobile-ui-consistency-polish/requirements.md`, candado en
  `src/__tests__/consistency-classnames.test.ts:334-358`);
  AND THE SYSTEM SHALL **no** añadir ningún `style={CONTINUOUS_CORNER}` nuevo
  en `src/screens/home/index.tsx`: las celdas son `View` sin radio propio y la
  esquina continua de la tarjeta la entrega ya el `Card` compartido
  (`src/components/card.tsx:29`), de modo que el inventario de **#62 R14**
  (`consistency-classnames.test.ts:269-332`) queda **sin cambio** para este
  fichero.
  - **Los dos R-id de #62 citados están verificados en el árbol**, no de
    memoria: R15 es el de cifras tabulares y R14 el de esquinas continuas
    (`consistency-classnames.test.ts:269` y `:334`). El encargo cita "#62 R15"
    para `tabular-nums` y acierta.
  - Test: el candado de #62 R15, con el delta de R14 (fila de
    `screens/home/index.tsx`: 4 → 5).

### R11 — Una clave de copy nueva, en los dos idiomas y registrada

- **R11**: WHEN esta feature introduce copy THE SYSTEM SHALL añadir a
  `mobile-pet-tracker/src/i18n/catalog.ts` **exactamente una** clave nueva, en
  los bloques `en` **y** `es`:

  | Clave | `en` | `es` |
  |---|---|---|
  | `home.weight` | `Weight` | `Peso` |

  AND SHALL resolverla con `useTranslate()` dentro de la pantalla, sin dejar
  ningún literal de copy en el fuente;
  AND SHALL añadir **una** fila `{ file: 'src/screens/home/index.tsx', key: 'home.weight' }`
  al bloque `R3_HOME` de `src/__tests__/ui-copy-table.ts:45-82`;
  AND SHALL registrar la clave en la tabla de
  `specs/mobile-ui-language/design.md` §2, bloque de
  `src/screens/home/index.tsx`, como fila `| — | ... | ← añadida por #69 (R11)`,
  siguiendo el formato literal de la fila de `home.walks` (`:300`);
  AND THE SYSTEM SHALL **no** crear ninguna otra clave, **no** reutilizar
  `health.weight` ni `weightLog.weight` —cruzarían ámbito del catálogo, que es
  lo que #68 descartó por escrito para `home.online`— y **no** cambiar el valor
  de ninguna clave existente.
  - **`home.activity` se queda en `Actividad` aunque el Make diga "Activo"**:
    es copy ya aprobada por #65, cambiarla obliga a tocar tests que hoy están
    verdes y no aporta información. Desviación declarada, ratificada en
    §Aprobación.
  - Test: `src/__tests__/ui-language.test.ts` (candados de #65: una clave
    presente en un idioma y ausente en el otro no compila —`:348`—, y
    `checkUses(R3_HOME)` exige una fila por llamada) más el delta de R14.

### R12 — La tira se anuncia por celdas, no como un bloque mudo

- **R12**: WHEN un lector de pantalla recorre la tira THE SYSTEM SHALL dejar
  que anuncie **cuatro elementos**, uno por celda, cada uno leyendo su valor y
  su etiqueta;
  AND THE SYSTEM SHALL **no** declarar `accessible` ni `accessibilityLabel` en
  la fila contenedora —que colapsaría las cuatro celdas en un nodo único, el
  mismo defecto que #68 D5 documentó para el gráfico—;
  AND las celdas SHALL seguir siendo **no interactivas**: ni `Pressable`, ni
  `accessibilityRole="button"`, ni `onPress`, porque no llevan a ningún sitio
  y un objetivo táctil que no hace nada es peor que ninguno.
  - Test: mismo `describe` que R1 →
    `it('deja que cada celda se anuncie por separado')`, que asserta que la
    fila contenedora no tiene `accessible` ni `accessibilityLabel` y que los
    cuatro `Text` de valor son alcanzables por `getByTestId`.

### R13 — Cero drift de estilo en los ficheros de esta feature

- **R13**: WHEN esta feature termine THE SYSTEM SHALL mantener, en **todos** los
  ficheros que toca, cero literales hexadecimales, cero clases arbitrarias
  `[...]`, cero `StyleSheet` y cero clases de radio fuera de la escala de
  #62 R4 (`rounded-card`, `rounded-xl`, `rounded-full`);
  AND SHALL añadir a `src/__tests__/design-drift.test.ts` un bloque propio
  `describe('#69 R13: la tira de estadísticas no mete drift de estilo')` con la
  lista nominal de sus ficheros —`i18n/catalog.ts`, `screens/home/format.ts`,
  `screens/home/format.test.ts`, `screens/home/index.test.tsx`,
  `screens/home/index.tsx`— y el mismo patrón
  `/text-\[10px\]|#[\da-f]{3,8}\b|StyleSheet/i` que ya usan los bloques `R9`
  (`:101-110`) y `#68 R18` (`:204-213`).
  - **Por qué un bloque propio y no confiar en el de #68**: los cinco ficheros
    de esta feature están hoy cubiertos por la lista de `#68 R18`, pero esa
    lista es nominal y de otra feature: si mañana alguien la reordena o la
    recorta, la cobertura de #69 desaparece **en silencio**, y no hay barrido
    global que la sustituya (§0.2). Un bloque propio es la única forma de que
    esta feature quede cerrada por sí misma.
  - **Declarado por escrito, como pide la lección de #68**: este candado es de
    **cadena literal**, no de conducta, y no puede ser otra cosa — "no hay un
    hex en el fuente" no es un comportamiento observable en el árbol
    renderizado, porque un hex y un token resuelven al mismo color en pantalla.
    Los requisitos de **conducta** de esta feature (R1, R3, R4, R5, R6, R7) se
    fijan sobre la salida renderizada, y son ésos los que llevan mutación
    (R15b). R13 es lo que es: un candado de higiene de fuente.
  - Test: `src/__tests__/design-drift.test.ts` :: el bloque nuevo.

### R14 — Los candados se mueven por delta declarado contra `9358cc7`

- **R14**: WHEN los candados de recuento se actualicen THE SYSTEM SHALL
  registrar **deltas contra `9358cc7`**, nunca cifras absolutas escritas a
  mano, y SHALL distinguir **reubicación** (la ruta cambia, la cifra no) de
  **delta real** (la cifra cambia). Esta feature **no reubica nada** —no mueve
  ningún fichero— así que toda la tabla es delta real:

  | Candado | Fichero del candado | Delta | Motivo |
  |---|---|---|---|
  | `#62 R15` cifras tabulares | `consistency-classnames.test.ts:335-342` | fila `screens/home/index.tsx`: **4 → 5**, y el total cerrado `:355-357` sube **exactamente 1** (`14 + 4` → `14 + 4 + 1`) | el `Text` de `summary-weight` es una cifra nueva |
  | `#62 R14` esquinas continuas | `consistency-classnames.test.ts:270-285`, total `:330` | **sin cambio** | las celdas no dibujan radio propio (R10) |
  | `#62 R1` botones primarios | `consistency-classnames.test.ts:102` | **sin cambio** | esta feature no añade ningún `rounded-xl bg-accent` |
  | `#61 R4` acento como tinta | `legibility-classnames.test.ts:118-138` | **sin cambio** | los iconos van en `muted`, no en `accent-strong` |
  | filas de `R3_HOME` y su `toHaveLength` | `ui-copy-table.ts:45-82`, `ui-language.test.ts:83` | **+1** (`21 + 15` → `21 + 15 + 1`) | la clave `home.weight` de R11 |
  | `SCREEN_FILES` y su `toHaveLength` | `ui-language.test.ts:357` | **sin cambio** | no aparece ningún fichero nuevo con llamadas a `t()`: `home.weight` se usa en `src/screens/home/index.tsx`, que ya está en la lista |
  | `ALL_USES` vs. suma de los bloques | `ui-copy-table.ts:381-393` | **cuadra solo** | el candado ya es consistencia interna |
  | bloque de drift de estilo | `design-drift.test.ts` | **+1 `describe`** | R13 |

  El implementer sustituye cada número por el que devuelva el propio `grep`; el
  reviewer comprueba el **delta**, no el valor. IF un total cerrado se mueve por
  una causa que esta tabla no prevé THEN **para y repórtalo**: no lo absorbas
  subiendo el número.
  - Test: los propios candados, en verde, con los deltas aplicados.

### R15 — Verificación: suite verde y grep-clean

- **R15**: WHEN el reviewer valida la feature THE SYSTEM SHALL presentar la
  suite móvil completa en verde —`bun run test` y `bun run typecheck` desde
  `mobile-pet-tracker/`— sin debilitar ni eliminar ningún assert de conducta y
  sin renombrar ningún `testID` existente; AND SHALL mantener el grep-clean de
  la carta §Decisiones fijas 3 intacto: **cero** hex fuera de `src/theme/`,
  **cero** clases arbitrarias `[...]`, **cero** `StyleSheet.create`, **cero**
  shadow/elevation legacy y **cero** clases de radio fuera de la escala de
  #62 R4.
  - Antes de tocar código: borrar `mobile-pet-tracker/.expo/types/router.d.ts`
    si existe (está gitignorado y rompe el typecheck con rutas fantasma) y
    comprobar con `pgrep -f init.sh` que no hay otro gate corriendo en un
    worktree hermano, porque comparten el Postgres de docker.

- **R15b**: WHEN el implementer cierre la feature THE SYSTEM SHALL demostrar,
  con las **seis** mutaciones plantadas **de una en una** y la evidencia en
  `progress/impl_mobile-home-stats-strip.md` §prueba de mutación, que la suite
  se pone **roja** con cada una:
  1. la celda 1 pinta `activeMinutes` en vez de `currentWeightKg` (mata R3);
  2. la celda 2 pinta `restMinutes` en vez de `activeMinutes` (mata R3);
  3. la celda 3 pinta `distanceM` en vez de `restMinutes` (mata R3 y R4);
  4. la celda 4 pinta `currentWeightKg` en vez de `distanceM` (mata R3);
  5. `fmtKg(null)` devuelve `'0 kg'` en vez de `'—'` (mata R2);
  6. `summary-card` vuelve a montarse **detrás** de `collar-card` (mata R6).
  - **Las cuatro primeras son la lección de #68 aplicada por adelantado**: el
    reparto valor↔celda es **un** discriminante que decide en **cuatro** sitios,
    y el criterio de aceptación es que las cuatro mutaciones pongan la suite
    roja **por separado**. Si alguna deja la suite verde, el candado de R3 está
    mal escrito —casi siempre por una fixture con dos valores iguales— y se
    arregla **antes** de seguir.
  - Test: requisito de verificación (`CHECKPOINTS.md` C4 vía (b)); la evidencia
    es el informe.

---

## Enmiendas a specs aprobadas

**Esta feature no necesita ninguna enmienda.** Se ha comprobado uno por uno:

- **#67 R7** (dato destacado = paseos): **no se toca**. R5 lo conserva
  literalmente, con su test (`index.test.tsx:944-1002`) intacto. La
  justificación de #67 R7 —"no duplica ningún dato ya visible"— sigue siendo
  cierta **precisamente porque** #69 no pinta paseos en la tira.
- **#62 R5** (receta del título de card): **no se toca**. La tira conserva
  `summary-card-title` con `t('home.summaryTitle')` y su `className`
  canónica; el `it` de `index.test.tsx:785-792` sigue verde. El Make no pone
  título a la tira, y quitarlo obligaría a enmendar #62 R5 y a borrar una fila
  de `R3_HOME` a cambio de nada ([[design]] §5).
- **#62 R1** (inventario de botones primarios), **#62 R14**, **#61 R4**: sin
  cambio, según R14.
- **#65** (catálogo): R11 añade una clave, que es el procedimiento normal, no
  una enmienda.
- **`docs/ui-guidelines.md`**: sin cambio. Ninguna decisión de esta spec
  contradice la carta.

---

## Decisiones de implementación

### D1 — el candado de longitud de catálogo entra al alcance con delta +1

**Codex paró aquí, y paró bien.** R14 y [[design]] §5 **no enumeran**
`src/providers/__tests__/language-provider.test.tsx`, que en su línea 41 cierra
la longitud del catálogo con `expect(englishKeys).toHaveLength(260 + 16)`.
`home.weight`, que R11 aprueba, lo sube a 277. Codex no tocó el candado ni
ninguna spec aprobada: se detuvo y lo reportó, que es exactamente lo que el
handoff le exigía.

- **No es una decisión de producto**: es la consecuencia mecánica de un
  requisito que esta spec ya aprueba. R11 añade **una** clave en los dos
  idiomas; un candado que cuenta claves tiene que moverse en **+1** o ponerse
  rojo. No hay alternativa que no sea no añadir la clave.
- **Qué se autoriza, y solo esto**: cambiar `260 + 16` por `260 + 16 + 1` en
  `language-provider.test.tsx:41`, conservando la base histórica **visible como
  suma** y sin tocar ninguna otra línea de ese fichero. `src/providers/` se
  suma a los ficheros de candado de [[design]] §5 para esta feature.
- **Qué NO se autoriza**: reescribir la base como un `277` plano —perdería la
  trazabilidad de qué feature aportó qué—, debilitar el `toEqual` que compara
  los dos idiomas, ni tocar nada más de `src/providers/`.
- **Es la segunda vez que este candado se omite**: en #68 pasó igual, con un
  delta de +16. Queda como apunte para el `spec_author`: la lista de candados
  de catálogo debe incluir `language-provider.test.tsx` siempre que la feature
  añada claves.

- [X] Aprobado por humano

## Fuera de alcance

Todo lo de esta lista queda **explícitamente fuera** y ninguna decisión de aquí
lo habilita de paso.

- **Una celda de "Paseos" en la tira.** R5, y es la corrección central de esta
  spec: los paseos ya están en el hero desde #67 R7.
- **Cambiar el dato destacado del hero.** Sigue siendo `walkCount` (#67 R7).
  Ni se sustituye por el descanso ni se elimina.
- **Un contador de pasos.** El dato no existe en ninguna capa del producto —lo
  verificó #67 R7— y su origen es una pregunta de hardware (decisión **D** del
  informe de origen). No se inventa.
- **Emancipar la celda de peso del estado de la actividad**, para que se vea con
  una mascota sin collar. R7 explica por qué no, y qué costaría. Si el humano lo
  quiere, es feature propia.
- **Quitar el título `Resumen de hoy` de la tira** para parecerse más al Make.
  Enmendaría #62 R5 a cambio de cero información ([[design]] §5).
- **Cambiar `home.activity` de `Actividad` a `Activo`.** R11.
- **Los accesos rápidos** (`design-src/App.tsx:395-412`). Feature **#71**.
- **La píldora "En línea"** y el pestillo de conectividad. Feature **#73**.
- **Tocar la gráfica de actividad semanal** (`weekly-activity-chart.tsx`) o
  cualquiera de sus `testID`. #68 está cerrada; esta feature no la roza.
- **Tocar `src/components/pet-hero-header.tsx`, `pet-switcher.tsx`, `card.tsx`
  o cualquier otro componente compartido.** La tira vive dentro de la Home.
- **Cualquier llamada nueva a la API, cualquier parámetro nuevo y cualquier
  ruta nueva.** R8.
- **Backend, infraestructura y configuración de Expo.** Cero ficheros.
- **Dependencias nuevas.** Esta feature no necesita ninguna: el icono `Weight`
  ya está en `reicon-react-native`, que ya es dependencia. `expo-linear-gradient`
  sigue vetado por nombre.
- **Migrar ninguna pantalla ni mover ningún fichero.** La Home ya vive en
  `src/screens/home/` con route delgado desde #68 R15; **no se vuelve a
  migrar**. Por eso R14 no tiene reubicaciones.
- **Añadir tokens a `src/theme/global.css`.** Los que la tira necesita
  —`border`, `muted`, `foreground`, `--text-2xs`, `--radius-card`— ya existen.

---

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-08) ← gate obligatorio antes de implementar

Al aprobar, el humano ratifica además:

1. **La decisión sobre el sueño (decisión E), cerrada en R4**: `restMinutes`
   **se conserva como celda siempre visible** de la tira, y lo que se cede al
   diseño es la etiqueta de la celda 3, que dice `Descanso` en vez de `Paseos`.
   Ningún dato se pierde y ninguno se duplica.
2. **La corrección de la premisa 3 del enunciado, en R5**: la Home **ya pinta
   los paseos** desde #67 R7 (`src/screens/home/index.tsx:142`), así que la
   tira **no** lleva celda de Paseos. El enunciado pedía lo contrario porque se
   escribió antes de #67.
3. **Las tres desviaciones declaradas respecto al Make**, ninguna re-litigable
   aquí: la celda 3 dice `Descanso`; la tira conserva el título
   `Resumen de hoy`; y la etiqueta de la celda 2 dice `Actividad` y no
   `Activo`.
4. **Que las cuatro celdas se alimentan de dos orígenes distintos** —peso del
   perfil, las otras tres del día de actividad— y que la fila entera aparece y
   desaparece con el estado de la **actividad** (R7), como hoy.
5. **Que las siete preguntas de la Home** (carta §Dirección de arte 3) quedan
   como las declara [[design]] §4: #69 **mejora una** —*¿cómo fue su actividad
   hoy?*, añadiendo el peso al resumen y subiéndolo bajo el hero— y **no
   degrada ninguna**.
6. **Que esta feature no necesita ninguna enmienda** a spec aprobada, según la
   sección §Enmiendas.

**Gate humano de verificación, no delegable a IA**: smoke en **dev build de
Android** (nunca Expo Go), en tema **claro** y **oscuro**. Se comprueba: que la
tira aparece **pegada bajo el hero y encima de la tarjeta del collar**; que las
cuatro celdas caben en una línea **sin truncar** en la pantalla más estrecha
disponible, con un peso de dos decimales (`12.4 kg`) y una actividad de más de
una hora (`1h 35m`); que los tres divisores se ven en los dos temas; que una
mascota **sin peso registrado** pinta `—` en la celda 1 y no rompe la fila; que
los paseos **solo** salen en el hero y no en la tira; que el descanso sigue
visible sin tocar nada; y que TalkBack anuncia las cuatro celdas por separado.
