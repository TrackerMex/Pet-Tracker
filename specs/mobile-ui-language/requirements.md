---
feature: "mobile-ui-language"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-ui-language]]

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez
> aprobado. Ver [[design]] para **el catálogo completo, clave a clave, con ruta
> y línea** (§2), el inventario rehecho (§1), la infraestructura (§3), el plan
> de los tests (§4), las enmiendas a las specs aprobadas (§6) y lo que queda
> fuera (§7). La copy en español, en hoja aparte para revisión humana, está en
> [[copy-review]] — **no es normativa**: lo normativo es §2.
> Reglas que la implementación debe respetar:
> [[../../docs/ui-guidelines|ui-guidelines]] (carta de UI, gana siempre sobre
> `appllama-app-design-skill`), [[../../docs/conventions|conventions]]
> §Convenciones de la app móvil y [[../../CHECKPOINTS|CHECKPOINTS]] C4, C7, C8.

Feature **#65**, habilitador del Bloque 0 del rediseño derivado de
`progress/explore_design-gap-vs-make.md`. Cierra la **decisión A** de ese
informe y su **ampliación del 2026-09-05**: el humano decidió primero que la UI
va entera en español y después, al preguntar cuánto costaría un selector de
idioma en ajustes, que la feature se convierte en **catálogo de dos idiomas +
interruptor, con español por defecto**.

**El motivo del cambio de alcance está medido, no es preferencia**: sustituir
309 literales ingleses por literales españoles *en el sitio* y añadir el
interruptor después obliga a tocar los mismos 309 sitios y las mismas 178
anclas de test **dos veces**. Metido dentro es el mismo número de ediciones y
solo cambia el texto con el que se sustituye: `t('login.signIn')` en vez de
`'Iniciar sesión'`. Ninguna de las dos decisiones se re-litiga aquí.

Va antes que cualquier pantalla nueva porque toda pantalla nueva escribe texto.

**Base de esta spec**: commit `a44925f` del worktree
`/home/claude/sites/Pet-Tracker-wt-ui`, branch `chore/design-gap-backlog`, que
ya contiene **#61** (`--accent: #178255`, `--accent-strong`, `TOUCH_SLOP`) y
**#62** (escala de radios, `Card` compartido, `CONTINUOUS_CORNER`,
`TABULAR_NUMS`, los `describe('#62 R5')` de título de card). Ninguna de sus
decisiones se reabre. Las **309** filas de [[design]] §2 están verificadas
contra ese commit, línea a línea. Si **#64**
(`mobile-pastel-category-palette`) entra antes, **las líneas se desplazan pero
las cadenas no**: el ancla normativa es *(archivo, cadena inglesa)*, no
*(archivo, línea)*.

---

## Inventario (recontado contra el fuente, no heredado del informe)

| Métrica | Informe `explore_design-gap-vs-make.md` §4 | **Esta spec** |
|---|---|---|
| Cadenas inglesas **distintas** | ~214 | **213** |
| **Ocurrencias** inglesas en el fuente | (no daba) | **309** |
| Ocurrencias **ya en español** | 10 | **11** (8 en `profile`, 2 en `add-pet`, 1 en `docs`) |
| **Ocurrencias de copy totales** | (no daba) | **320** |
| **Claves** del catálogo | (no existía) | **255** (241 de la copy inglesa + 11 de la ya española + 3 del interruptor) |
| Archivos de fuente con copy | (no daba) | **19** |
| Puntos de test anclados a copy | 166 | **178** en **19** ficheros |
| Consultas por `testID` en la suite | 796 | **796** (confirmado) |
| Llamadas `*ByText(` / `toHaveTextContent(` | (no daba) | **246** |
| Plantillas con `${}` en texto visible | 31 (conteo del leader) | **33 sitios**, de los cuales **11 son copy** ([[design]] §2.12) |
| Ficheros de snapshot con copy | 0 | **0** (confirmado) |
| Cadenas de usuario en `src/api/` | 0 | **0** (confirmado) |

> **255 claves, no 213; y 320 ocurrencias, no 309.** El criterio de aceptación
> 1 de `feature_list.json` dice «las 213 claves»: 213 es el número de **cadenas
> inglesas distintas**, no de claves. Dos correcciones al alza, ambas
> necesarias:
>
> 1. **El catálogo tiene que cubrir también las 11 cadenas que ya estaban en
>    español** (`Información`, `Datos básicos`, `Documentos de`…). Si no, un
>    usuario que elija inglés seguiría viéndolas en español. Eso sube las
>    ocurrencias de 309 a **320** y aporta 11 claves cuya columna `en` hay que
>    redactar ([[design]] §2.0 D6).
> 2. **Las claves están acotadas por pantalla, no son planas**, así que la
>    misma cadena inglesa con dos significados distintos son dos claves — y
>    tiene que serlo: `Food` es `Nutrición` en la pestaña (`tabs.food`) y
>    `Comida` como tipo de recordatorio (`reminderType.food`). Con un catálogo
>    plano por cadena esos dos colisionarían y habría que elegir una sola
>    traducción para las dos.
>
> Desglose completo en [[design]] §2.0 D1-D3 y §1.2.

---

## Invariante duro de la feature (aplica a TODOS los R-ids)

> Un requisito que se cumpla violándolo NO está cumplido.

- **Solo cambia texto visible y lo que hace falta para resolverlo por clave.**
  Ni un `useEffect`, ni una llamada a `src/api/`, ni un `router.*`, ni un
  handler, ni un contrato de API cambian de forma o de momento de ejecución.
  Los **cuatro** cambios estructurales permitidos están enumerados y son R12
  (montar el provider en `src/app/_layout.tsx`), R14 (el botón nuevo en
  Profile), R17 (6 `testID` nuevos) y las **tres tablas de constantes** que
  hoy guardan texto y pasan a guardar claves ([[design]] §3.5).
- **Ningún `testID` se renombra ni se elimina.** *Añadir* sí: exactamente **7**
  (`language-toggle` en R14 y los 6 de R17), todos enumerados.
- **Ningún assert de conducta se debilita ni se elimina.** Un `getByText` no se
  sustituye por un `getByTestId(...).toBeVisible()` que deje de comprobar la
  copy. Única excepción: las **4 llamadas** de R17, y ahí la copy sigue
  asertada. Recuento mecánico en R17.
- **No se instala ninguna librería de i18n** (`i18next`, `react-intl`,
  `lingui`) **ni `expo-localization`**. El catálogo es un objeto TypeScript y
  el idioma un contexto de React; el patrón ya existe en el repo
  (`src/theme/use-theme-colors.ts`, `src/providers/selected-pet-provider.tsx`).
  `expo-localization` queda fuera porque **el idioma es elección explícita del
  usuario, no detección del idioma del teléfono** ([[design]] §3.1 D4).
- **El idioma del código no cambia**: nombres de variables, funciones, tipos,
  ficheros, `testID`, rutas y **las claves del catálogo** siguen en inglés, y
  los mensajes de commit también (`docs/conventions.md` §Commits). Solo cambia
  el texto que ve el usuario.
- **No se re-redacta el español que ya existe.** Las 10 cadenas ya en español
  (`profile` ×7, `add-pet` ×2, `docs` ×1) entran al catálogo con **el mismo
  texto** en la columna `es`; su columna `en` es la traducción inversa que
  fija [[design]] §2. No se alinean con el vocabulario del Make.
- **Grep-clean de #46, #61 y #62 intacto**: cero hex fuera de
  `mobile-pet-tracker/src/theme/`, cero clases arbitrarias `[...]`, cero
  `StyleSheet.create`, cero `shadow*`/`elevation` legacy. `global.css` **no se
  toca**. Lo verifican `src/__tests__/design-drift.test.ts` y
  `src/__tests__/consistency-classnames.test.ts`, ya verdes.
- **Cero cambios de motion, de layout y de `className`.** Ni un `gap`, ni un
  radio, ni una sombra. Si un texto en un idioma descuadra un tile, el arreglo
  **no** es esta feature: se anota en el reporte y va a la feature de fidelidad
  de esa pantalla. En particular, **el cambio de idioma no lleva animación**:
  nada de `withThemeTransition` ni de Reanimated ([[design]] §3.4).
- **Las unidades no se traducen**: `kg`, `km`, `km/h`, `kcal`, `g`, `%`, y la
  `h`/`m` de `fmtMinutes` son símbolos y **no entran al catálogo**
  ([[design]] §2.12).

---

## Orden de implementación

**R12–R16 son la infraestructura y van primero**: sin ellas no existe `t` y
R1–R11 no se pueden escribir. R1–R11 son los 11 lotes de pantalla. R17–R20
cierran. El orden exacto está en [[tasks]]; los ids se dejan como están para no
renumerar [[copy-review]], que ya está en manos del humano.

---

## Requisitos funcionales

> **Cómo leer R1–R11.** Cada uno cubre las ocurrencias de un grupo de
> pantallas. «las N ocurrencias de [[design]] §2.X» significa: exactamente esas
> filas, resolviendo el texto con **la clave** de la columna `Clave`. Codex CLI
> **no redacta copy y no inventa claves**: si encuentra una cadena visible que
> no está en la tabla, para y lo anota en
> `progress/impl_mobile-ui-language.md`.
>
> El test de cada R-id vive en
> `mobile-pet-tracker/src/__tests__/ui-language.test.ts` y consume el catálogo
> y la tabla de uso desde `mobile-pet-tracker/src/__tests__/ui-copy-table.ts`
> ([[design]] §4.1). Además, **los tests de pantalla existentes se actualizan
> en el mismo commit**: si no, quedan rojos.

### Bloque A — Autenticación y contorno

- **R1**: WHEN se renderiza cualquiera de `src/app/(auth)/login.tsx`,
  `forgot.tsx` o `register.tsx` THE SYSTEM SHALL resolver sus **29**
  ocurrencias de texto con las **23** claves de [[design]] §2.1, sin ningún
  literal de copy en el JSX, y mostrar la columna `es` del catálogo por ser el
  idioma por defecto, sin cambiar ningún `testID`, ninguna `className` ni
  ningún `kind` del mapeo de errores.
  - Test: `src/__tests__/ui-language.test.ts` ::
    `describe('#65 R1: el grupo (auth) resuelve su copy por clave')`
  - Tests de pantalla que se actualizan en el mismo commit:
    `src/app/(auth)/__tests__/login.test.tsx` (4 anclas: 73, 74, 75, 76),
    `forgot.test.tsx` (1: 36), `register.test.tsx` (5: 152, 182, 183, 184, 224)

- **R2**: WHEN se renderiza `src/components/floating-tab-bar.tsx` THE SYSTEM
  SHALL rotular las cinco pestañas con las claves `tabs.home`, `tabs.map`,
  `tabs.health`, `tabs.food` y `tabs.profile` ([[design]] §2.2), cuyo valor
  `es` es `Inicio`, `Mapa`, `Salud`, `Nutrición` y `Perfil` —las palabras del
  diseño (`design-src/App.tsx:755-759`)—; AND THE SYSTEM SHALL dejar de guardar
  texto en la constante `TABS` y guardar la clave ([[design]] §3.5),
  conservando los cinco `name` y los cinco `testID`.
  - Test: `src/__tests__/ui-language.test.ts` ::
    `describe('#65 R2: la barra de pestañas resuelve su copy por clave')`
  - Test que se actualiza: `src/components/__tests__/floating-tab-bar.test.tsx:235`
    (5 anclas)

### Bloque B — Pestañas principales

- **R3**: WHEN se renderiza `src/app/(tabs)/home.tsx` THE SYSTEM SHALL resolver
  sus **20** ocurrencias con las **18** claves de [[design]] §2.3, incluida la
  **entrada con parámetro** `home.lastSeen` (`{{date}}`), que sustituye a la
  plantilla `` `Last seen ${…}` `` de `home.tsx:48`.
  - Test: `src/__tests__/ui-language.test.ts` ::
    `describe('#65 R3: Home resuelve su copy por clave')`
  - Test que se actualiza: `src/app/(tabs)/__tests__/home.test.tsx`
    (14 anclas: 172, 329, 330, 351, 372, 400, 453, 492, 504, 581, 583, 600, 613, 771)

- **R4**: WHEN se renderiza `src/app/(tabs)/map.tsx` THE SYSTEM SHALL resolver
  sus **19** ocurrencias con las **17** claves de [[design]] §2.4; AND WHEN
  `fmtAgo` formatea la antigüedad de la última posición THE SYSTEM SHALL
  resolverla con `map.justNow`, `map.agoMinutes` (`{{minutes}}`) o
  `map.agoHours` (`{{hours}}`), **conservando intactos los umbrales de 60 s y
  3600 s**.
  - Test: `src/__tests__/ui-language.test.ts` ::
    `describe('#65 R4: Map resuelve su copy por clave')`
  - Test que se actualiza: `src/app/(tabs)/__tests__/map.test.tsx`
    (21 anclas: 292, 326, 398, 557, 558, 587, 590, 618, 619, 620, 660, 761, 762, 798, 823, 889, 926, 930, 1151, 1152, 1153)

- **R5**: WHEN se renderiza `src/app/(tabs)/health.tsx`,
  `src/app/(tabs)/weight-log.tsx` o `src/components/weight-chart.tsx` THE
  SYSTEM SHALL resolver sus **32** ocurrencias con las **27** claves de
  [[design]] §2.5, incluidos los tres `placeholder` del formulario de peso, la
  máscara `weightLog.yyyyMmDd` y la entrada con parámetro
  `weightLog.bodyConditionValue` (`{{value}}`); AND THE SYSTEM SHALL seguir
  enviando `measuredAt` en ISO `YYYY-MM-DD` (solo cambia el texto de ayuda, no
  el parseo ni `localTodayIso()`).
  - Test: `src/__tests__/ui-language.test.ts` ::
    `describe('#65 R5: Health, el log de peso y la gráfica resuelven su copy por clave')`
  - Tests que se actualizan: `health.test.tsx` (10: 189, 238, 319, 340, 411,
    427, 460, 493, 509, 612), `weight-log.test.tsx` (10: 138, 203, 206, 217,
    234, 312, 393, 394, 395, 398), `weight-chart.test.tsx` (1: 44)

- **R6**: WHEN se renderiza `src/app/(tabs)/food.tsx` o
  `src/app/(tabs)/meal-schedule.tsx` THE SYSTEM SHALL resolver sus **35**
  ocurrencias con las **29** claves de [[design]] §2.6, incluidas las **cuatro
  entradas con parámetro** `food.dailyKcal` (`{{kcal}}`), `food.dailyGrams` y
  `mealSchedule.dailyGrams` (`{{grams}}`) y `mealSchedule.mealsPerDay`
  (`{{meals}}`); AND THE SYSTEM SHALL seguir renderizando
  `warnings[].message` del backend **tal cual y fuera del catálogo**, que ya
  llega en español.
  - Test: `src/__tests__/ui-language.test.ts` ::
    `describe('#65 R6: Food y Meal schedule resuelven su copy por clave')`
  - Tests que se actualizan: `food.test.tsx` (12: 158, 204, 290, 293, 305, 310,
    371, 388, 426, 521×3), `meal-schedule.test.tsx` (16: 184, 230, 231, 240,
    264, 268, 303, 332, 341, 348, 352, 356, 358, 359, 362, 460)

### Bloque C — Perfil y sus pantallas de detalle

- **R7**: WHEN se renderiza `src/screens/profile/index.tsx` o
  `src/screens/docs/index.tsx` THE SYSTEM SHALL resolver sus **35**
  ocurrencias con las **32** claves de [[design]] §2.7, incluida la entrada con
  parámetro `profile.ageMonths` (`{{months}}`); AND THE SYSTEM SHALL meter al
  catálogo, **con su texto español intacto en la columna `es`** y con la
  traducción inversa que fija la tabla en la columna `en`, las **9** cadenas de
  esas dos pantallas que ya estaban en español: `profile.notRegistered`,
  `profile.information`, `profile.breed`, `profile.microchip`,
  `profile.gpsDevice`, `profile.lastSignal`, `profile.documents`,
  `profile.gpsSettings` y `docs.documentsOf`.
  - Test: `src/__tests__/ui-language.test.ts` ::
    `describe('#65 R7: Profile y Documentos resuelven su copy por clave')`
  - Tests que se actualizan: `src/screens/profile/index.test.tsx`
    (3 anclas: 258, 347, 348) y `src/app/(tabs)/__tests__/screens.test.tsx:77`
    (1: el `title: 'Profile'` de su `it.each`).
    `src/screens/docs/index.test.tsx` **sí** cambia ahora, aunque no tenía
    anclas inglesas: sus 6 aserciones españolas (104-108, 205) siguen valiendo
    tal cual porque el idioma por defecto es español — **se comprueba que
    siguen verdes, no se editan**.

- **R8**: WHEN se renderiza `src/screens/reminders/index.tsx`,
  `src/screens/add-reminder/index.tsx` o se lee `src/utils/reminder-meta.ts`
  THE SYSTEM SHALL resolver sus **50** ocurrencias con las **43** claves de
  [[design]] §2.8, incluida la entrada con parámetro `reminders.dueInDays`
  (`{{days}}`); AND THE SYSTEM SHALL dejar de guardar texto en
  `REMINDER_TYPE_META` y en `ADVANCE_OPTIONS` y guardar la clave
  ([[design]] §3.5), conservando **las 7 claves de tipo de recordatorio**
  (`vaccine`, `deworming`, `medication`, `appointment`, `weight`, `food`,
  `custom`), **sus 7 emoji** y los 4 valores de `minutes` sin tocar.
  - Test: `src/__tests__/ui-language.test.ts` ::
    `describe('#65 R8: Recordatorios y su alta resuelven su copy por clave')`
  - Tests que se actualizan: `reminders/index.test.tsx` (14: 155, 185, 225,
    243, 326, 342, 347, 349, 356, 361, 470, 471, 472, 473),
    `add-reminder/index.test.tsx` (13: 164, 187, 188, 202, 267, 315, 329, 344,
    386, 387, 388, 389, 390), y
    `src/__tests__/legibility-classnames.test.ts:85`, cuyo
    `expect(deleteConfirm).toContain('Delete')` escanea el **fuente** de
    `reminders/index.tsx` y ahí ya no habrá literal: pasa a
    `toContain("t('reminders.delete')")`, que es la forma equivalente de
    comprobar que el botón destructivo sigue rotulado como borrar.

- **R9**: WHEN se renderiza `src/screens/add-pet/index.tsx` THE SYSTEM SHALL
  resolver sus **40** ocurrencias con las **38** claves de [[design]] §2.9,
  incluidas las **2** que ya estaban en español (`addPet.basicDetails` y
  `addPet.medicalDetails`, con su texto intacto en `es`); AND
  THE SYSTEM SHALL conservar los valores de dominio `'dog' | 'cat'`,
  `'female' | 'male'`, `'small' | 'medium' | 'large'` y los 11 `testID` de
  chip: solo cambia la etiqueta visible.
  - Test: `src/__tests__/ui-language.test.ts` ::
    `describe('#65 R9: el alta de mascota resuelve su copy por clave')`
  - Test que se actualiza: `src/screens/add-pet/index.test.tsx`
    (4 anclas: 110, 175, 325, 326)

- **R10**: WHEN se renderiza `src/screens/pairing/index.tsx` THE SYSTEM SHALL
  resolver sus **40** ocurrencias con las **33** claves de [[design]] §2.10,
  incluida la `Alert.alert` nativa de desvinculación con sus dos botones
  (`pairing.cancel` / `pairing.unpair`) **en el mismo orden y con los mismos
  `style`** (`'cancel'` / `'destructive'`), resueltos **en el momento de la
  llamada** para que sigan al idioma vigente; AND THE SYSTEM SHALL renderizar
  el subtítulo de éxito con la entrada con parámetro `pairing.readySubtitle`
  (`{{petName}}`), cuyo valor `es` mueve la interpolación al interior de la
  frase (**única reordenación de JSX que autoriza esta spec**), conservando
  `selectable` y el nodo `Text`.
  - Test: `src/__tests__/ui-language.test.ts` ::
    `describe('#65 R10: el emparejado del collar resuelve su copy por clave')`
  - Test que se actualiza: `src/screens/pairing/index.test.tsx`
    (36 anclas: 176, 181, 192, 249, 251, 253, 254, 350, 354, 358, 362, 366,
    368, 369, 370, 371, 443, 445, 502, 540, 558, 568, 582, 698, 699, 701, 703,
    709, 726, 742, 743, 744, 745, 751, 772, 790). Los
    `getAlertButton('Cancel'|'Unpair')` pasan a `('Cancelar'|'Desvincular')`:
    siguen buscando el botón por su texto en el objeto capturado de
    `Alert.alert`, que es lo que se prueba.

- **R11**: WHEN se renderiza `src/screens/reset-password/index.tsx` en
  cualquiera de sus tres estados (sin token, éxito, formulario) THE SYSTEM
  SHALL resolver sus **15** ocurrencias con las **11** claves de
  [[design]] §2.11, conservando los tres `testID` y el `selectable` de los tres
  mensajes.
  - Test: `src/__tests__/ui-language.test.ts` ::
    `describe('#65 R11: el restablecimiento de contraseña resuelve su copy por clave')`
  - Test que se actualiza: `src/screens/reset-password/index.test.tsx`
    (7 anclas: 71, 136, 147, 149, 150, 151, 152)

### Bloque D — La infraestructura (se implementa PRIMERO)

- **R12**: WHEN la app arranca THE SYSTEM SHALL exponer un catálogo de dos
  idiomas y una función de traducción, según [[design]] §3.2, de modo que:
  (a) `mobile-pet-tracker/src/i18n/catalog.ts` exporte `es` y `en` con las
  **255** claves de [[design]] §2 y §3.3, tipadas de forma que `en` deba tener
  exactamente las mismas claves que `es`;
  (b) `mobile-pet-tracker/src/providers/language-provider.tsx` exponga
  `useTranslate(): (key: TranslationKey, params?: Record<string, string | number>) => string`
  y `useLanguage(): { language, setLanguage }`, con **`'es'` por defecto**;
  (c) `t` sustituya cada `{{param}}` por su valor y, IF falta un parámetro,
  THEN deje el marcador tal cual en vez de lanzar, para que un descuido nunca
  tumbe una pantalla;
  (d) el provider se monte en `src/app/_layout.tsx` **dentro del mismo gate de
  arranque que ya usa el tema** (`themeReady`), sin añadir un segundo estado de
  espera ni un segundo render en blanco;
  AND THE SYSTEM SHALL no añadir ninguna dependencia a `package.json`.
  - Test: `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx` ::
    `describe('#65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros')`
    (paridad exacta de claves `es`↔`en`, paridad de marcadores `{{…}}` por
    clave, defecto `'es'`, interpolación, y el caso del parámetro que falta)

- **R13**: WHEN el usuario ha elegido un idioma THE SYSTEM SHALL guardarlo con
  `expo-secure-store` bajo la clave `language_preference` en
  `mobile-pet-tracker/src/utils/language-preference.ts`, **copiando el patrón
  de `src/utils/theme-preference.ts`** (dos funciones, `try/catch` que traga,
  ~20 líneas); AND WHEN la app vuelve a arrancar THE SYSTEM SHALL leer esa
  preferencia y aplicarla; IF la lectura o la escritura fallan, o el valor
  guardado no es `'es'` ni `'en'`, THEN THE SYSTEM SHALL arrancar en **español**
  sin propagar el error y sin bloquear el arranque.
  - Test: `mobile-pet-tracker/src/utils/language-preference.test.ts` ::
    `describe('#65 R13: la preferencia de idioma persiste y es best-effort')`
    (guarda, lee, valor corrupto → `undefined`, `SecureStore` que lanza en
    lectura y en escritura → no propaga)

- **R14**: WHEN el usuario abre Profile THE SYSTEM SHALL mostrar, **dentro de
  `me-card` y justo debajo del `theme-toggle` existente**
  (`src/screens/profile/index.tsx:358-367`), un `Button` con
  `testID="language-toggle"` cuya etiqueta es el **endónimo del idioma al que
  cambiaría** (`English` cuando el idioma vigente es `es`, `Español` cuando es
  `en`) y cuyo `accessibilityLabel` es `profile.changeLanguage`; AND WHEN se
  pulsa THE SYSTEM SHALL cambiar el idioma **repintando la app sin
  reiniciarla**, de modo que el estado local de las pantallas montadas
  sobreviva (el formulario a medio llenar de `add-reminder`, el código escrito
  en `pairing`, la posición del scroll); AND THE SYSTEM SHALL persistirlo por
  R13. **No se crea pantalla de ajustes.**
  - Test: `mobile-pet-tracker/src/screens/profile/index.test.tsx` ::
    `describe('#65 R14: Profile cambia el idioma y repinta sin reiniciar')`
    (la etiqueta es el endónimo contrario; al pulsar, el título de la pantalla
    pasa de `Perfil` a `Profile`; `setStoredLanguage` recibe `'en'`; un
    `TextInput` con texto escrito **conserva su valor** tras el cambio;
    `theme-toggle` sigue existiendo y no se toca)

- **R15**: WHILE el idioma vigente es `'es'` THE SYSTEM SHALL formatear fechas,
  horas y números con el locale `es-MX`, y WHILE es `'en'` con `en-US`, pasando
  ese locale explícitamente a las **7** llamadas a `toLocale*` de
  [[design]] §3.6 en vez de dejarlas con el locale del sistema; IF el motor no
  tiene datos de ese locale THEN THE SYSTEM SHALL degradar al locale por
  defecto sin lanzar (comportamiento estándar de `Intl`), que es exactamente lo
  que ocurre hoy.
  - Test: `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx` ::
    `describe('#65 R15: el locale de fechas y números sigue al idioma elegido')`
    (`useLocale()` devuelve `es-MX` / `en-US`) y
    `mobile-pet-tracker/src/screens/reminders/index.test.tsx` ::
    `describe('#65 R15: la fecha del recordatorio se formatea con el locale del idioma')`

- **R16**: WHEN se abre la app por primera vez, sin preferencia guardada, THE
  SYSTEM SHALL arrancar en **español**, sin preguntar nada, sin pantalla de
  bienvenida y **sin mirar el idioma del teléfono**; AND THE SYSTEM SHALL
  ofrecer el cambio únicamente en Profile (R14).
  - Test: `mobile-pet-tracker/src/app/__tests__/layout.test.tsx` ::
    `describe('#65 R16: sin preferencia guardada la app arranca en español')`

### Bloque E — Cierre

- **R17**: WHEN un test necesita **localizar** un nodo para aseverar algo que
  **no es su texto** (hoy: las **4** llamadas de los `describe('#62 R5: el
  título de card usa un único tratamiento')`, que buscan por texto y luego
  comprueban `props.className`) THE SYSTEM SHALL localizarlo por `testID`, para
  lo cual THE SYSTEM SHALL añadir los **6 `testID`** de [[design]] §4.3
  (`summary-card-title`, `weight-card-title`, `food-meals-title`,
  `food-ai-title`, `meal-schedule-link-title`, `nutrition-profile-title`),
  **sin renombrar ni eliminar ninguno de los 796 existentes**; AND THE SYSTEM
  SHALL mantener las aserciones de `className` **byte a byte idénticas**; AND
  THE SYSTEM SHALL reponer en `food.test.tsx` las **2** aserciones de copy que
  esa migración dejaría sin cubrir (`Comidas hoy` y `Horario de comidas`).
  - Test: `mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx` ::
    `describe('#65 R17: los títulos de card se localizan por testID y su copy sigue asertada')`
  - Verificación mecánica que rehace el reviewer, desde `mobile-pet-tracker/`:
    `grep -rEoh "(get|query|find)(All)?By(Text|PlaceholderText|LabelText|DisplayValue)\(|toHaveTextContent\(" src --include='*.test.ts*' | wc -l` → **265** (enmienda del 2026-09-06 al final: el invariante es el **delta −2** sobre el padre de R17, no la cifra absoluta)
    y `grep -rEoh "By(TestId|testId)\(" src --include='*.test.ts*' | wc -l` → **≥800**

- **R18**: WHEN se ejecuta la suite móvil THE SYSTEM SHALL comprobar
  mecánicamente, recorriendo la tabla de uso de
  `src/__tests__/ui-copy-table.ts`, que **no queda copy suelta en las
  pantallas**, es decir:
  (a) cada uno de los **320** sitios aparece en su archivo como
  `t('<clave>'`, con la clave exacta de [[design]] §2;
  (b) ninguno de los **244 valores de cadena fija** del catálogo (255 − 11 con
  parámetro) —ni el `es` ni
  el `en`— aparece en ninguno de los **19** archivos de pantalla como
  **literal entero**: una cadena entrecomillada cuyo contenido normalizado sea
  igual al valor, o un nodo de texto JSX cuyo contenido normalizado lo sea;
  (c) las **11 entradas con parámetro** quedan cubiertas por (a), porque su
  plantilla desaparece del fuente por completo;
  IF se detecta un literal de copy en una pantalla THEN el test falla nombrando
  archivo y cadena.
  **No hay lista de excepciones**: la igualdad por literal entero no colisiona
  con identificadores (`className` no es `Name`, `"email-address"` no es
  `Email`), y eso está verificado sobre las 274 parejas *(archivo, cadena)* del
  commit base.
  - Test: `src/__tests__/ui-language.test.ts` ::
    `describe('#65 R18: los 320 sitios resuelven por clave y no queda copy suelta')`

- **R19**: WHEN un desarrollador consulta cualquiera de las **9** specs
  aprobadas que ratificaron el inglés THE SYSTEM SHALL encontrar en cada una el
  bloque de enmienda literal de [[design]] §6.2, que **no dice que el inglés
  desaparece**: dice que el literal inglés que esa spec fijó **sigue siendo
  normativo como columna `en` del catálogo** y que el idioma por defecto pasa a
  ser español; AND THE SYSTEM SHALL dejar la casilla de firma de cada enmienda
  **sin marcar**: la firma es del humano. Las 9 specs, con línea exacta, están
  en [[design]] §6.1.
  - Test: `src/__tests__/ui-language.test.ts` ::
    `describe('#65 R19: las 9 specs aprobadas llevan su enmienda de idioma')`
    (escaneo de fuente sobre los 9 `.md`, mismo patrón que
    `src/__tests__/hosting-artifacts.test.ts`, que ya asevera sobre archivos de
    fuera de `mobile-pet-tracker/`)

- **R20**: WHEN un desarrollador consulta `docs/ui-guidelines.md` THE SYSTEM
  SHALL encontrar en §Dirección de arte una regla **6. Idioma** con el texto
  literal de [[design]] §6.3, que fija (a) el catálogo como única fuente de
  copy y el español como idioma por defecto, (b) que toda pantalla nueva añade
  sus claves **en los dos idiomas** en el mismo gate, (c) que el idioma del
  código, de las claves y de los commits no cambia, y (d) que los mensajes de
  validación del backend siguen llegando en inglés en **ambos** idiomas y por
  dónde se ven.
  - Test: `src/__tests__/ui-language.test.ts` ::
    `describe('#65 R20: la carta de UI fija el catálogo y el español por defecto')`

---

## Fuera de alcance

1. **Los mensajes de validación del backend siguen en inglés — en los dos
   idiomas.** Son de `backend-pet-tracker/`, los está tocando otra sesión, y
   esta feature no abre un solo fichero de backend. Un usuario que elija
   español seguirá viendo inglés en:
   - `login.tsx:37` (`login-error`) — `Invalid email address`,
     `Password is too short`.
   - `register.tsx` vía `mapValidationErrors` (`register-*-error`,
     `register-error`) — `First name is required`, `Terms must be accepted`,
     `passwordConfirmation must match password`
     (`backend-pet-tracker/src/modules/auth/application/dto/register-user.dto.ts:28`).
   - `weight-log.tsx:96` (`weight-form-error`) — `Weight is too high`,
     `Date is in the future`.
   - `reset-password/index.tsx:43` (`reset-error`) — el mismo
     `passwordConfirmation must match password` desde `reset-password.dto.ts:12`.
   - `add-pet`: `Exactly one of birthDate or approxAgeMonths is required`
     (`create-pet.dto.ts:46`) llegaría por `kind: 'invalid'`, que la pantalla
     traduce a su propio mensaje: ése **no** se ve.
   Los **10** asserts de test que anclan esos mensajes (`login` 93/102,
   `register` 160/171, `weight-log` 375/376/387, `reset-password` 172/175/185)
   **se quedan en inglés y no se tocan**: cambiarlos sería mentir sobre lo que
   devuelve el backend. Al revés, `NUTRITION_WARNING_MESSAGES` ya llega en
   español y se muestra tal cual en los dos idiomas.
2. **Los 5 valores de enum que la API devuelve y la pantalla pinta crudos**:
   `pet.sex` (`profile/index.tsx:81` → `female`/`male`),
   `device.connectivity` (`pairing/index.tsx:419` → `LTE`, `online`…),
   `document.type` (`docs/index.tsx:28`), `profile.foodType` y
   `profile.activityLevel` (`meal-schedule.tsx:273, 279` → `dry`, `medium`).
   Son datos, no copy: no tienen clave. El `connectivity` crudo además choca
   con `docs/ui-guidelines.md` §Dirección de arte 4 («nada de jerga del
   proveedor»). Mapearlos es cambio de conducta y va a feature propia; si el
   humano los quiere dentro, es **enmienda a esta spec antes del handoff**.
3. **Detectar el idioma del teléfono** (`expo-localization`). Decisión cerrada:
   el idioma es elección explícita. Queda anotado en [[design]] §3.1 D4 como
   la decisión que habría que reabrir si algún día se quiere.
4. **Un tercer idioma, plurales, géneros y formato ICU.** El `t` de R12
   sustituye `{{param}}` y nada más. Un motor de plurales para dos idiomas que
   no tienen ningún plural en el catálogo (`{{days}} días` funciona con 1 y con
   5) es infraestructura sin usuario.
5. **El nombre de la app** (`app.json` `expo.name`/`slug`). Cambiarlo toca el
   bundle y EAS: feature propia.
6. **`hosting/reset-password/index.html`**, ya en español (`lang="es"`).
7. **Alinear el español existente con el vocabulario del Make**
   (`Collar GPS` en vez de `Dispositivo GPS`). Redacción de producto sobre
   texto que ya está bien: va con la feature de fidelidad de cada pantalla.
8. **Todo lo que el informe puso en otro bloque**: la paleta pastel (#64), los
   accesos rápidos de Home (#71), la cabecera fotográfica, el centro de
   notificaciones, las geocercas. Ni un `className` de más.
9. **El reset de estado de las pantallas de detalle** (#63) y **cualquier
   cambio de motion**.
10. **Renombrar los ~44 `describe`/`it` en inglés.** No son aserciones. Solo se
    actualizan los **6** que citarían copy equivocada ([[design]] §4.4).

---

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-05) ← gate obligatorio antes de implementar

> El gate cubre, en el mismo acto:
> **(a)** la **redacción española** de las 241 entradas traducidas — es copy de producto y
> la firma el humano; está en [[copy-review]], que es la hoja de revisión;
> **(b)** las **3 entradas nuevas** del interruptor que [[copy-review]] no
> incluye porque no existían: `profile.languageSpanish` (`Español` en los dos
> idiomas), `profile.languageEnglish` (`English` en los dos) y
> `profile.changeLanguage` (`Cambiar idioma` / `Change language`), **más la
> columna `en` de las 11 entradas que ya estaban en español**, que también es
> redacción nueva ([[design]] §2.0 D6);
> **(c)** las **9 enmiendas** a specs aprobadas de [[design]] §6.1.
> Sin las tres firmas la implementación no arranca.

### Enmienda del 2026-09-06 — R18 es requisito de verificación (C4 b)

Codex CLI **paró antes de escribir la primera línea**, como el handoff le
ordenaba, y el bloqueo es real: en el orden aprobado (`R1-R11 → R17 → R18`),
una implementación correcta hace que el test de R18 **nazca verde**. R18 solo
comprueba mecánicamente propiedades que R1-R11 ya dejaron en el árbol. La spec
no declaraba la vía, y `CHECKPOINTS.md` §C4 —escrito tras el mismo problema en
#64— exige que se elija **por escrito antes del handoff**.

R17 **no** entra en esta enmienda: sus seis `testID` no existen todavía, así
que su rojo es legítimo y no necesita excepción.

**Se elige la vía (b) de C4: R18 se declara requisito de verificación y su
cierre se prueba por mutación.** Descartada la vía (a) —escribir el candado de
R18 antes de las migraciones que verifica— por una razón que Codex no llegó a
articular y que pesa más que conservar el orden: el test de R18 se quedaría
**rojo a propósito durante los ~30 commits** de R1-R11, y eso destruye la
señal de "cada commit deja la suite verde", que es lo que hace útil correr los
tests antes de cada commit. Cambiar un candado por otro no es un buen negocio.

Evidencia que el `reviewer` exigirá para dar R18 por cerrado:

1. Reintroducir **un literal de copy conocido** en una pantalla ya migrada,
   nombrando cuál y dónde.
2. Observar que `describe('#65 R18…')` se pone rojo **por su aserción** —no por
   un `ReferenceError`— y que el mensaje **nombra el archivo** contaminado.
3. Revertir la mutación y dejar la suite verde.

El commit rojo de R18 deja de ser obligatorio; el resto de su ciclo (verde y
trazabilidad) no cambia. Los otros 19 requisitos mantienen su rojo→verde real.

- [X] Firmo que **R18 es requisito de verificación** y se cierra por prueba de
      mutación en vez de por commit rojo, con la evidencia de los tres puntos
      de arriba en el reporte del `reviewer` (fecha: 2026-09-05)

### Enmienda del 2026-09-06 (2) — el recuento de R17 es 265, no 244

Codex CLI paró en el paso (3) de R17, como `tasks.md` le ordenaba: el comando
normativo daba **265** y la spec pedía **244**. Paró bien. La cifra de la spec
estaba **caduca, no equivocada**: se calculó correctamente contra `a44925f`, y
el árbol se movió por debajo dos veces, las dos de forma legítima.

Recuento independiente del `leader` con el comando normativo, vía
`git archive` (sin tocar el árbol de trabajo):

| Commit | `*ByText(`/`toHaveTextContent(` | `ByTestId(` | Qué es |
|---|---:|---:|---|
| `a44925f` | 246 | 796 | base sobre la que se escribió la spec |
| `f90facb` | 258 | 801 | firma de la enmienda (1); **#64 ya dentro** |
| `9825316` | 267 | — | padre de R17, con R1-R16 cerrados |
| árbol de R17 en verde | **265** | **823** | lo que Codex tiene sin commitear |

De dónde sale cada salto, verificado archivo a archivo:

- **+12 (246 → 258)**: los metió **#64** al mergear, en `screens/docs/index.test.tsx`
  (6 → 12) y `screens/reminders/index.test.tsx` (18 → 24). Ninguno es de #65.
- **+9 (258 → 267)**: los meten los **tests obligatorios de esta misma spec**:
  `providers/__tests__/language-provider.test.tsx` 0 → 5 (R12) y
  `screens/profile/index.test.tsx` 19 → 23 (R14).
- **−2 (267 → 265)**: es **exactamente** el neto que R17 prescribe, y cae solo
  en los cuatro archivos previstos: `food.test.tsx` 19 → 20,
  `health.test.tsx` 16 → 15, `home.test.tsx` 27 → 26,
  `meal-schedule.test.tsx` 18 → 17. Ningún otro archivo de test cambia su
  recuento y **ninguno desaparece**.

Nada se debilitó. La cifra absoluta protegió mal un invariante que sí se
cumple, porque una constante calculada contra un commit envejece en cuanto
otra feature mergea. **El invariante de R17 es el delta, no el absoluto.**

Lo que rehace el `reviewer`, en este orden:

1. `git archive` del **padre** de R17 y del **verde** de R17, y el comando
   normativo sobre los dos: la diferencia debe ser **−2 exactos**. Esta es la
   comprobación que decide, y no caduca aunque mergee otra feature.
2. Sobre el verde de R17, el absoluto: **265** y `ByTestId(` **≥ 800** (823).
3. Que ningún archivo de test desapareció ni perdió aserciones fuera de los
   cuatro de la tabla de [[design]] §4.3.

- [X] Firmo que el esperado mecánico de R17 pasa de **244** a **265**, y que
      lo que se comprueba es el **delta −2** entre el padre y el verde de R17
      (fecha: 2026-09-06)

### Enmienda del 2026-09-06 (3) — copy sin clave que el inventario no vio

El `implementer` paró en R18 y paró bien: su escaneo destapó **copy visible que
el catálogo aprobado no contiene**. No es un fallo del test ni del código
migrado — es un hueco de mi inventario, y cerrarlo mueve cifras firmadas.

**Causa raíz, y por qué no es un descuido suelto**: el inventario de las 255
entradas barrió los literales **ingleses pendientes de traducir**. Toda copy
que se escribe **igual en español y en inglés** era invisible a ese barrido.
Por eso los huecos no aparecen dispersos al azar: son exactamente las palabras
que no cambian entre idiomas.

Al descubrirlo, el `leader` rehizo el barrido por la otra vía —literales de
texto visible en los 19 ficheros de pantalla, resuelvan o no por `t(`— y salen
**cinco sitios**, no los dos que encontró el test:

| Fichero | Línea | Literal | Lo ve R18 | Por qué se coló |
|---|---:|---|---|---|
| `screens/add-pet/index.tsx` | 431 | `label="No"` | **no** | hermana de `t('addPet.yes')`, que sí tiene clave |
| `screens/add-pet/index.tsx` | 436 | `<FieldLabel>Microchip</FieldLabel>` | **sí** | choca con el valor de `profile.microchip` |
| `screens/pairing/index.tsx` | 319 | `label="ESN"` | no | acrónimo, igual en los dos idiomas |
| `screens/pairing/index.tsx` | 436 | `label="ESN"` | no | segunda ocurrencia, misma clave |
| `app/(tabs)/map.tsx` | 354 | `<Text>GPS</Text>` | no | acrónimo, igual en los dos idiomas |

Solo el de la línea 436 de `add-pet` pone R18 en rojo, porque es el único que
**coincide con un valor que ya está en el catálogo**. Los otros cuatro son
invisibles a R18 por construcción: no están en el catálogo, así que no hay
valor con el que colisionar. Dejarlos fuera no rompe ningún test — los deja
sin gestionar, que es como llegaron hasta aquí.

Descartados por no ser copy: `📄` (`screens/docs/index.tsx:31`) y `✓`
(`screens/pairing/index.tsx:300`). Son glifos, no texto traducible.

**Las cuatro claves nuevas tienen el mismo valor en los dos idiomas**, que es
justo lo que las hizo invisibles. No hay redacción que decidir:

| Clave | `es` | `en` | Sitios |
|---|---|---|---|
| `addPet.no` | `No` | `No` | 1 |
| `addPet.microchip` | `Microchip` | `Microchip` | 1 |
| `pairing.esn` | `ESN` | `ESN` | 2 (una fila en la tabla de uso) |
| `map.gps` | `GPS` | `GPS` | 1 |

#### Qué se firma

Dos opciones. **Marca una sola.**

- [ ] **(A) Mínimo para desbloquear** — solo `addPet.no` y `addPet.microchip`.
      Catálogo **255 → 257**, `ALL_USES` **320 → 322**, R9 **40 → 42**,
      valores de cadena fija de R18(b) **244 → 246**. `ESN` y `GPS` se quedan
      como literales sin clave, y ningún test los vigila.
      (fecha: ______)

- [X] **(B) Cerrar la familia entera** *(recomendada por el `leader`)* — las
      cuatro claves. Catálogo **255 → 259**, `ALL_USES` **320 → 324**,
      R4 **19 → 20**, R9 **40 → 42**, R10 **40 → 41**, valores de cadena fija
      de R18(b) **244 → 248**.
      (fecha: 2026-09-06)

**Por qué el `leader` recomienda (B)**: (A) desbloquea pero deja tres literales
de copy que nada vigila, y la regla 6 que R20 acaba de escribir en
`docs/ui-guidelines.md` dice que el catálogo es la **única fuente de copy**.
Además el rediseño ya tiene en cola cambiar el vocabulario a `Collar GPS`, así
que esa cadena se va a tocar. La diferencia entre las dos opciones son **dos
claves y tres sitios**; el coste de volver por ellas más tarde es otra ronda de
enmienda y firma como esta.

#### Y para que no haya una cuarta ronda

Es la **tercera** vez en dos features que una constante numérica congelada en
una spec aprobada para el trabajo: el R4 de #64, el 244 de R17 y ahora el 320
de R18. La cifra nunca estuvo mal cuando se escribió; envejeció.

Así que, además de las claves, se firma esto: en `ui-copy-table.ts` y en el
test de R18, **la comprobación vinculante pasa a ser de consistencia interna**,
no de constante:

- `ALL_USES.length` debe ser igual a la **suma de los once bloques** `R1_…R11_`;
- `Object.keys(es).length` debe ser igual a `Object.keys(en).length`;
- el escaneo recorre `ALL_USES` y el catálogo **tal como están**, sin comparar
  contra ningún número escrito a mano.

Las cifras de arriba quedan en la spec como **lo que valían el 2026-09-06**, no
como el candado. El nombre del `describe` de R18 pierde el `320`.

- [X] Firmo también el cambio a comprobación por consistencia interna
      (fecha: 2026-09-06)

---

## Gate de cierre — lo que solo puede firmar un humano

El `reviewer` aprobó los 20 requisitos el 2026-09-06 (veredicto y re-revisión en
`progress/review_mobile-ui-language.md`). Faltan **dos firmas humanas** antes de
que la feature pase a `done`. Ningún agente puede cerrarlas.

### (1) Prueba de humo en **dev build de Android**

No en Expo Go: esta feature toca `expo-secure-store`, que ahí no se comporta
igual. Recorrido mínimo, en este orden:

1. **Instalación limpia** (o borrando los datos de la app): arranca **en
   español**, sin haber elegido nada. *(R16)*
2. **Perfil → interruptor de idioma → English**: la pantalla **se repinta al
   momento**, sin reiniciar. Mira el título, la etiqueta de pestaña, un botón,
   un estado vacío y un `placeholder`. *(R14)*
3. **Cierra la app del todo y reábrela**: sigue en **English**. *(R13)*
4. **Vuelve a español** y repite el cierre y la reapertura: sigue en español.
5. **Recorre las 11 pantallas migradas** —Home, Mapa, Salud, Comida, Horario de
   comidas, Recordatorios, Perfil, Documentos, Alta de mascota, Emparejado del
   collar, Restablecer contraseña— y confirma que **no queda ni un texto en
   inglés** con el idioma en español. *(R1-R11)*
6. **Fechas y horas en español**: en Recordatorios y en Salud, que el formato
   sea el de `es-MX` y no el de `en-US`. Cambia a inglés y confirma que
   cambian. *(R15)*
7. **Los cuatro sitios que se descubrieron tarde**: `No` en esterilizado y
   `Microchip` en el alta de mascota, `ESN` en el emparejado y `GPS` en el
   mapa. Se escriben igual en los dos idiomas: lo que se comprueba es que
   **están y se ven bien**, no que cambien. *(enmienda (3))*

**Lo que NO es un fallo de esta feature**: los mensajes de validación que
manda el backend siguen llegando **en inglés en los dos idiomas** (`Invalid
email address`, `First name is required`…). Está declarado en §Fuera de alcance
1 y es de `backend-pet-tracker/`, que esta feature no abre.

- [X] Humo pasado en dev build de Android (fecha: 2026-09-06)

### (2) Firma de las 9 enmiendas de R19

#65 cambia el idioma por defecto de 9 specs ya aprobadas, así que cada una lleva
un bloque de enmienda con **su propia casilla sin marcar**. La enmienda **no
dice que el inglés desaparezca**: dice que el literal inglés que esa spec fijó
sigue siendo normativo como columna `en` del catálogo, y que el idioma por
defecto pasa a ser español.

| # | Fichero | Línea de la casilla |
|---|---|---:|
| 1 | `specs/mobile-auth/requirements.md` | 274 |
| 2 | `specs/mobile-home-dashboard/requirements.md` | 339 |
| 3 | `specs/mobile-map-live/requirements.md` | 313 |
| 4 | `specs/mobile-health/requirements.md` | 406 |
| 5 | `specs/mobile-food/design.md` | 273 |
| 6 | `specs/mobile-food/requirements.md` | 360 |
| 7 | `specs/mobile-reminders/requirements.md` | 392 |
| 8 | `specs/auth-reset-deep-link/design.md` | 347 |
| 9 | `specs/mobile-device-pairing/design.md` | 444 |

La más fuerte es la 9: `mobile-device-pairing` no dijo «en inglés», **enumeró
los 18 strings exactos**. Su enmienda deja claro que esos 18 siguen siendo
palabra por palabra lo que ve quien elija inglés.

El test de R19 **vigila que estas 9 casillas sigan vacías** hasta que las
marques tú: si un agente marcase una, la suite se pone roja.
