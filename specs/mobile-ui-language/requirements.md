---
feature: "mobile-ui-language"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-ui-language]]

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez
> aprobado. Ver [[design]] para **la tabla de traducción completa, cadena a
> cadena, con ruta y línea** (§2), el inventario rehecho (§1), el plan de los
> tests (§3), las enmiendas a las specs aprobadas (§5) y lo que queda fuera
> (§6). Reglas que la implementación debe respetar:
> [[../../docs/ui-guidelines|ui-guidelines]] (carta de UI, gana siempre sobre
> `appllama-app-design-skill`), [[../../docs/conventions|conventions]]
> §Convenciones de la app móvil y [[../../CHECKPOINTS|CHECKPOINTS]] C4, C7, C8.

Feature **#65**, habilitador del Bloque 0 del rediseño derivado de
`progress/explore_design-gap-vs-make.md` (2026-09-04). Cierra la **decisión A**
de ese informe: el humano decidió el 2026-09-04 que **la UI va entera en
español**. Esa decisión **no se re-litiga aquí**: esta spec dice *cómo* se hace
sin romper nada, no *si* se hace.

Va antes que cualquier pantalla nueva porque toda pantalla nueva escribe texto:
hacerlo después obliga a tocarlo dos veces.

**Base de esta spec**: commit `da72e97` del worktree
`/home/claude/sites/Pet-Tracker-wt-ui`, que ya contiene **#61** (`--accent:
#178255`, `--accent-strong`, `TOUCH_SLOP`) y **#62** (escala de radios,
`Card` compartido, `CONTINUOUS_CORNER`, `TABULAR_NUMS`, los `describe('#62
R5')` de título de card). Ninguna de sus decisiones se reabre. Si **#64**
(`mobile-pastel-category-palette`) entra antes, **los números de línea de la
tabla de [[design]] §2 se desplazan pero las cadenas no**: el ancla normativa
es *(archivo, cadena inglesa)*, no *(archivo, línea)*. La línea es una ayuda
para localizar, no el contrato.

---

## Inventario rehecho (no heredado del informe)

Recontado archivo por archivo sobre `da72e97`. Donde difiere del informe,
**manda este conteo** y [[design]] §1 explica la diferencia.

| Métrica | Informe `explore_design-gap-vs-make.md` §4 | **Esta spec** |
|---|---|---|
| Cadenas inglesas **distintas** | ~214 | **213** |
| **Ocurrencias** inglesas en el fuente | (no daba) | **309** |
| Archivos de fuente con copy inglés | (no daba) | **19** |
| Puntos de test anclados a copy inglesa | 166 | **178** |
| Ficheros de test afectados | 17 | **19** |
| Consultas por `testID` en la suite | 796 | **796** (confirmado) |
| Llamadas a `*ByText(` / `toHaveTextContent(` | (no daba) | **246** |
| Ficheros de snapshot con copy | 0 | **0** (confirmado) |
| Cadenas de usuario en `src/api/` | 0 | **0** (confirmado) |

---

## Invariante duro de la feature (aplica a TODOS los R-ids)

> Este bloque es parte del contrato de cada requisito. Un requisito que se
> cumpla violándolo NO está cumplido.

- **Solo cambia texto visible.** Ni un `useState`, ni un `useEffect`, ni una
  llamada a `src/api/`, ni un `router.*`, ni un handler, ni un contrato de API
  cambian de forma o de momento de ejecución. El único cambio estructural
  permitido en JSX es el de R10 (`pairing`), que mueve la interpolación
  `{selectedPet.name}` dentro de una frase distinta, y está enumerado.
- **Ningún `testID` se renombra ni se elimina.** *Añadir* `testID` sí está
  permitido y **solo R12 lo hace**, con los 6 nombres exactos de
  [[design]] §3.3.
- **Ningún assert de conducta se debilita ni se elimina.** Un `getByText` no
  se sustituye por un `getByTestId(...).toBeVisible()` que deje de comprobar
  la copy. La única excepción son las **4 llamadas** de R12, y ahí la copy
  sigue asertada (dos aserciones nuevas la reponen). Recuento mecánico en R12.
- **No se instala ninguna librería de i18n** (`i18next`, `react-intl`,
  `lingui`, `expo-localization`): decisión D1 de [[design]] §2.0. No se crea
  ningún módulo de cadenas en `src/`. Las literales se editan en su sitio.
- **El idioma del código no cambia**: nombres de variables, funciones,
  tipos, ficheros, `testID`, rutas, claves de objeto y comentarios se quedan
  como están, y los mensajes de commit siguen en inglés
  (`docs/conventions.md` §Commits). Solo cambia el texto que ve el usuario.
- **No se re-redacta el español que ya existe.** Las 10 cadenas ya en español
  (`profile` ×7, `add-pet` ×2, `docs` ×1) se quedan tal cual, aunque el Make
  use otra palabra (`Collar GPS` frente a `Dispositivo GPS`). Alinear esa
  redacción con el diseño es trabajo de las features de fidelidad, no de ésta.
- **Grep-clean de #46, #61 y #62 intacto**: cero hex fuera de
  `mobile-pet-tracker/src/theme/`, cero clases arbitrarias `[...]`, cero
  `StyleSheet.create`, cero `shadow*`/`elevation` legacy. `global.css` **no se
  toca** en ningún requisito. Verificado por `src/__tests__/design-drift.test.ts`
  y `src/__tests__/consistency-classnames.test.ts`, que ya están verdes.
- **Cero cambios de motion, de layout y de `className`.** Ni un `gap`, ni un
  radio, ni una sombra. Si una cadena española es más larga y descuadra un
  tile, el arreglo **no** es esta feature: se anota en el reporte del
  reviewer y va a la feature de fidelidad que toque esa pantalla.
- **Las unidades no se traducen**: `kg`, `km`, `km/h`, `kcal`, `g`, `%`, `m`
  y `h` de `fmtMinutes` son símbolos, no palabras. `Intl`/`toLocaleString`
  no se tocan: ya siguen el *locale* del dispositivo en las 8 fechas.

---

## Requisitos funcionales

> **Cómo leer R1–R11.** Cada uno cubre las cadenas de un grupo de pantallas.
> «las N cadenas de [[design]] §2.X» significa: exactamente esas filas, con el
> texto español **literal** de la columna «Español (normativo)». Codex CLI **no
> redacta copy**: si una cadena visible no está en la tabla, la implementación
> se detiene y lo reporta en `progress/impl_mobile-ui-language.md` en vez de
> inventar el texto.
>
> El test de cada R-id vive en
> `mobile-pet-tracker/src/__tests__/ui-language.test.ts` y consume la tabla
> desde el fixture `mobile-pet-tracker/src/__tests__/ui-copy-table.ts`
> ([[design]] §3.1). Cada `describe` recorre **su** porción de la tabla y
> comprueba dos cosas sobre el fuente: (a) que la cadena española está
> presente, (b) que la inglesa ha desaparecido, salvo en los pares marcados
> `exc.` en la tabla, que colisionan con un identificador del propio fichero
> y quedan enumerados en [[design]] §3.2. Además, **los tests existentes de
> cada pantalla se actualizan en el mismo commit**: si no, quedan rojos.

### Bloque A — Autenticación y contorno de la app

- **R1**: WHEN se renderiza cualquiera de `src/app/(auth)/login.tsx`,
  `src/app/(auth)/forgot.tsx` o `src/app/(auth)/register.tsx` THE SYSTEM SHALL
  mostrar las **29** cadenas de [[design]] §2.1 en español (10 de `login`, 5 de
  `forgot`, 14 de `register`), con el literal exacto de la tabla, sin cambiar
  ningún `testID`, ninguna `className` ni ningún `kind` del mapeo de errores.
  - Test: `mobile-pet-tracker/src/__tests__/ui-language.test.ts` ::
    `describe('#65 R1: el grupo (auth) está en español')`
  - Tests existentes que se actualizan en el mismo commit:
    `src/app/(auth)/__tests__/login.test.tsx` (4 anclas: 73, 74, 75, 76),
    `src/app/(auth)/__tests__/forgot.test.tsx` (1: 36),
    `src/app/(auth)/__tests__/register.test.tsx` (5: 152, 182, 183, 184, 224)

- **R2**: WHEN se renderiza `src/components/floating-tab-bar.tsx` THE SYSTEM
  SHALL rotular las cinco pestañas como `Inicio`, `Mapa`, `Salud`, `Nutrición`
  y `Perfil` —las palabras del diseño (`design-src/App.tsx:755-759`), no una
  traducción propia—, conservando los cinco `testID` `tab-home`, `tab-map`,
  `tab-health`, `tab-food`, `tab-profile` y el orden actual.
  - Test: `mobile-pet-tracker/src/__tests__/ui-language.test.ts` ::
    `describe('#65 R2: la barra de pestañas usa las etiquetas del diseño')`
  - Test existente que se actualiza: `src/components/__tests__/floating-tab-bar.test.tsx:235`
    (las 5 anclas del bucle `for (const label of [...])`)

### Bloque B — Pestañas principales

- **R3**: WHEN se renderiza `src/app/(tabs)/home.tsx` THE SYSTEM SHALL mostrar
  las **20** cadenas de [[design]] §2.3 en español, incluyendo `En línea` como
  estado del collar (palabra del diseño, `design-src/App.tsx:358`) y
  `Última señal …` en el pie de `last-position-card`.
  - Test: `mobile-pet-tracker/src/__tests__/ui-language.test.ts` ::
    `describe('#65 R3: Home está en español')`
  - Test existente que se actualiza: `src/app/(tabs)/__tests__/home.test.tsx`
    (14 anclas: 172, 329, 330, 351, 372, 400, 453, 492, 504, 581, 583, 600, 613, 771)

- **R4**: WHEN se renderiza `src/app/(tabs)/map.tsx` THE SYSTEM SHALL mostrar
  las **19** cadenas de [[design]] §2.4 en español, y WHEN `fmtAgo` formatea la
  antigüedad de la última posición THE SYSTEM SHALL devolver `Justo ahora`,
  `hace <n> min` o `hace <n> h` en vez de `Just now` / `<n>m ago` / `<n>h ago`,
  conservando los umbrales de 60 s y 3600 s intactos.
  - Test: `mobile-pet-tracker/src/__tests__/ui-language.test.ts` ::
    `describe('#65 R4: Map está en español')`
  - Test existente que se actualiza: `src/app/(tabs)/__tests__/map.test.tsx`
    (21 anclas: 292, 326, 398, 557, 558, 587, 590, 618, 619, 620, 660, 761, 762, 798, 823, 889, 926, 930, 1151, 1152, 1153)

- **R5**: WHEN se renderiza `src/app/(tabs)/health.tsx`,
  `src/app/(tabs)/weight-log.tsx` o `src/components/weight-chart.tsx` THE
  SYSTEM SHALL mostrar las **32** cadenas de [[design]] §2.5 en español (13 +
  18 + 1), incluyendo los tres `placeholder` del formulario de peso y la
  máscara de fecha `AAAA-MM-DD`, y THE SYSTEM SHALL seguir aceptando el mismo
  formato ISO `YYYY-MM-DD` en `measuredAt` (solo cambia el texto de ayuda, no
  el parseo).
  - Test: `mobile-pet-tracker/src/__tests__/ui-language.test.ts` ::
    `describe('#65 R5: Health, el log de peso y la gráfica están en español')`
  - Tests existentes que se actualizan:
    `src/app/(tabs)/__tests__/health.test.tsx` (10 anclas: 189, 238, 319, 340, 411, 427, 460, 493, 509, 612),
    `src/app/(tabs)/__tests__/weight-log.test.tsx` (10: 138, 203, 206, 217, 234, 312, 393, 394, 395, 398),
    `src/components/__tests__/weight-chart.test.tsx` (1: 44)

- **R6**: WHEN se renderiza `src/app/(tabs)/food.tsx` o
  `src/app/(tabs)/meal-schedule.tsx` THE SYSTEM SHALL mostrar las **35**
  cadenas de [[design]] §2.6 en español (16 + 19), usando las palabras del
  diseño donde existen: `Objetivo diario`, `kcal / día`, `Comidas hoy`,
  `Servido`, `Recomendación IA` y `Horarios y porciones`
  (`design-src/App.tsx:607, 609, 626, 639, 645, 1465`); AND THE SYSTEM SHALL
  seguir renderizando `warnings[].message` del backend **tal cual**, que ya
  llega en español y no se toca.
  - Test: `mobile-pet-tracker/src/__tests__/ui-language.test.ts` ::
    `describe('#65 R6: Food y Meal schedule están en español')`
  - Tests existentes que se actualizan:
    `src/app/(tabs)/__tests__/food.test.tsx` (12 anclas: 158, 204, 290, 293, 305, 310, 371, 388, 426, 521×3),
    `src/app/(tabs)/__tests__/meal-schedule.test.tsx` (16: 184, 230, 231, 240, 264, 268, 303, 332, 341, 348, 352, 356, 358, 359, 362, 460)

### Bloque C — Perfil y sus pantallas de detalle

- **R7**: WHEN se renderiza `src/screens/profile/index.tsx` o
  `src/screens/docs/index.tsx` THE SYSTEM SHALL mostrar las **26** cadenas de
  [[design]] §2.7 en español (20 + 6); AND THE SYSTEM SHALL dejar intactas las
  **10 cadenas que ya están en español** (`No registrado`, `Información`,
  `Raza`, `Microchip`, `Dispositivo GPS`, `Última señal`, `Documentos`,
  `Configuración del Dispositivo GPS`, `Documentos de`, y las dos de `add-pet`
  que cubre R9), sin re-redactarlas.
  - Test: `mobile-pet-tracker/src/__tests__/ui-language.test.ts` ::
    `describe('#65 R7: Profile y Documentos están en español')`
  - Tests existentes que se actualizan:
    `src/screens/profile/index.test.tsx` (3 anclas: 258, 347, 348) y
    `src/app/(tabs)/__tests__/screens.test.tsx:77` (1 ancla: el `title:
    'Profile'` de la tabla `it.each` de `R5: placeholders de tabs`).
    `src/screens/docs/index.test.tsx` **no tiene ninguna ancla inglesa** —
    sus 6 aserciones de texto (104-108, 205) ya son españolas o de fixture;
    no se toca.

- **R8**: WHEN se renderiza `src/screens/reminders/index.tsx`,
  `src/screens/add-reminder/index.tsx` o se lee `src/utils/reminder-meta.ts`
  THE SYSTEM SHALL mostrar las **50** cadenas de [[design]] §2.8 en español
  (21 + 22 + 7), usando las palabras del diseño donde existen: `Recordatorios`,
  `Activos`, `Esta semana`, `Inactivos`, `¡Próximo!`, `Agregar recordatorio`,
  `Vacuna`, `Medicamento`, `Consulta`, `Otro`
  (`design-src/App.tsx:427, 933-935, 955, 979-983, 1013`); AND THE SYSTEM SHALL
  conservar las 7 claves de `REMINDER_TYPE_META` (`vaccine`, `deworming`,
  `medication`, `appointment`, `weight`, `food`, `custom`) y sus 7 emoji sin
  tocar, porque son la API y la iconografía, no copy.
  - Test: `mobile-pet-tracker/src/__tests__/ui-language.test.ts` ::
    `describe('#65 R8: Recordatorios y su alta están en español')`
  - Tests existentes que se actualizan:
    `src/screens/reminders/index.test.tsx` (14 anclas: 155, 185, 225, 243, 326, 342, 347, 349, 356, 361, 470, 471, 472, 473),
    `src/screens/add-reminder/index.test.tsx` (13: 164, 187, 188, 202, 267, 315, 329, 344, 386, 387, 388, 389, 390),
    `src/__tests__/legibility-classnames.test.ts:85` (1: el `toContain('Delete')`
    del escaneo de fuente de `#61 R11` pasa a `toContain('Eliminar')`; sigue
    siendo un escaneo de fuente, no se convierte en `testID`)

- **R9**: WHEN se renderiza `src/screens/add-pet/index.tsx` THE SYSTEM SHALL
  mostrar las **38** cadenas de [[design]] §2.9 en español, incluyendo las
  palabras del diseño `Nueva mascota`, `Tipo de mascota`, `Raza`, `Sexo`,
  `Tamaño`, `Esterilizado/a` y `Guardar mascota`
  (`design-src/App.tsx:1145, 1194, 1210, 1222, 1238, 1262, 1304`); AND THE
  SYSTEM SHALL conservar los valores de dominio `'dog' | 'cat'`,
  `'female' | 'male'`, `'small' | 'medium' | 'large'` y los `testID`
  `species-dog`, `species-cat`, `sex-female`, `sex-male`, `size-small`,
  `size-medium`, `size-large`, `sterilized-true`, `sterilized-false`,
  `age-mode-date`, `age-mode-months`: solo cambia la etiqueta visible.
  - Test: `mobile-pet-tracker/src/__tests__/ui-language.test.ts` ::
    `describe('#65 R9: el alta de mascota está en español')`
  - Test existente que se actualiza: `src/screens/add-pet/index.test.tsx`
    (4 anclas: 110, 175, 325, 326)

- **R10**: WHEN se renderiza `src/screens/pairing/index.tsx` THE SYSTEM SHALL
  mostrar las **40** cadenas de [[design]] §2.10 en español, incluida la
  `Alert.alert` nativa de desvinculación con sus dos botones
  (`Cancelar` / `Desvincular`) en el mismo orden y con los mismos `style`
  (`'cancel'` / `'destructive'`); AND WHEN la vinculación termina en éxito THE
  SYSTEM SHALL renderizar el subtítulo como
  `El collar de {selectedPet.name} está vinculado. El rastreo GPS está activo.`,
  moviendo la interpolación al interior de la frase (**única reordenación de
  JSX que autoriza esta spec**), conservando `selectable` y el nodo `Text`.
  - Test: `mobile-pet-tracker/src/__tests__/ui-language.test.ts` ::
    `describe('#65 R10: el emparejado del collar está en español')`
  - Test existente que se actualiza: `src/screens/pairing/index.test.tsx`
    (36 anclas: 176, 181, 192, 249, 251, 253, 254, 350, 354, 358, 362, 366, 368, 369, 370, 371, 443, 445, 502, 540, 558, 568, 582, 698, 699, 701, 703, 709, 726, 742, 743, 744, 745, 751, 772, 790).
    Las llamadas a `getAlertButton('Cancel')` / `getAlertButton('Unpair')`
    pasan a `'Cancelar'` / `'Desvincular'`: siguen buscando el botón por su
    texto en el objeto capturado de `Alert.alert`, que es lo que se está
    probando.

- **R11**: WHEN se renderiza `src/screens/reset-password/index.tsx` en
  cualquiera de sus tres estados (sin token, éxito, formulario) THE SYSTEM
  SHALL mostrar las **15** cadenas de [[design]] §2.11 en español, conservando
  los tres `testID` `screen-reset-password`, `reset-missing-token`,
  `reset-success` y el `selectable` de los tres mensajes.
  - Test: `mobile-pet-tracker/src/__tests__/ui-language.test.ts` ::
    `describe('#65 R11: el restablecimiento de contraseña está en español')`
  - Test existente que se actualiza:
    `src/screens/reset-password/index.test.tsx` (7 anclas: 71, 136, 147, 149, 150, 151, 152)

### Bloque D — Desacoplar los tests de estilo del idioma

- **R12**: WHEN un test necesita **localizar** un nodo para aseverar algo que
  **no es su texto** (hoy: las 4 llamadas de los `describe('#62 R5: el título
  de card usa un único tratamiento')`, que buscan por texto y luego comprueban
  `props.className`) THE SYSTEM SHALL localizarlo por `testID` y no por texto,
  para lo cual THE SYSTEM SHALL añadir los **6 `testID` nuevos** de
  [[design]] §3.3 (`summary-card-title`, `weight-card-title`,
  `food-meals-title`, `food-ai-title`, `meal-schedule-link-title`,
  `nutrition-profile-title`) a los `Text` correspondientes, **sin renombrar ni
  eliminar ninguno de los 796 existentes**; AND THE SYSTEM SHALL mantener las
  aserciones de `className` **byte a byte idénticas**; AND THE SYSTEM SHALL
  reponer en `src/app/(tabs)/__tests__/food.test.tsx` las **2** aserciones de
  copy que esa migración dejaría sin cubrir (`Comidas hoy` y
  `Horario de comidas`), de modo que el recuento mecánico de la suite quede
  en **244** llamadas a `*ByText(` / `toHaveTextContent(` (246 − 4 + 2) y
  **800** consultas por `testID` (796 + 4).
  - Test: `mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx` ::
    `describe('#65 R12: los títulos de card se localizan por testID y su copy sigue asertada')`
  - Verificación mecánica que rehace el reviewer (dos comandos, en
    `mobile-pet-tracker/`):
    `grep -rEoh "(get|query|find)(All)?By(Text|PlaceholderText|LabelText|DisplayValue)\(|toHaveTextContent\(" src --include='*.test.ts*' | wc -l` → **244**
    y `grep -rEoh "By(TestId|testId)\(" src --include='*.test.ts*' | wc -l` → **800**

- **R13**: WHEN se ejecuta la suite móvil THE SYSTEM SHALL comprobar
  mecánicamente, recorriendo las **309** filas del fixture
  `mobile-pet-tracker/src/__tests__/ui-copy-table.ts`, que (a) cada cadena
  española está presente en su archivo y (b) cada una de las **234** parejas
  *(archivo, cadena inglesa)* marcadas `sí` en la columna «Ausencia» de
  [[design]] §2 ha desaparecido de ese archivo; IF una pareja está entre las
  **40** marcadas `exc.` THEN THE SYSTEM SHALL omitir la comprobación (b) para
  esa pareja y solo para ella, porque la palabra inglesa sigue apareciendo en
  el fichero como identificador (`className`, `Weight` de `WeightChart`,
  `Map` del icono, `Date`, `Type`…); la lista completa de las 40 está en
  [[design]] §3.2 y **no puede crecer** sin pasar de nuevo por el gate.
  - Test: `mobile-pet-tracker/src/__tests__/ui-language.test.ts` ::
    `describe('#65 R13: ninguna cadena inglesa de la tabla sobrevive en el fuente')`

### Bloque E — Gobernanza: specs y carta

- **R14**: WHEN un desarrollador consulta cualquiera de las **9** specs
  aprobadas que ratificaron el inglés THE SYSTEM SHALL encontrar en cada una
  el bloque de enmienda literal de [[design]] §5.2, que remite la copy a
  [[design]] §2 de esta feature y deja constancia de que el requisito, el
  `testID` y la conducta no cambian —solo el idioma del literal—; AND THE
  SYSTEM SHALL dejar la casilla de firma de cada enmienda **sin marcar**: la
  firma es del humano, no de ningún agente. Las 9 specs, con línea exacta,
  están en [[design]] §5.1.
  - Test: `mobile-pet-tracker/src/__tests__/ui-language.test.ts` ::
    `describe('#65 R14: las 9 specs aprobadas llevan su enmienda de idioma')`
    (escaneo de fuente sobre los 9 ficheros `.md`, mismo patrón que
    `src/__tests__/hosting-artifacts.test.ts`, que ya asevera sobre archivos
    fuera de `mobile-pet-tracker/`)

- **R15**: WHEN un desarrollador consulta `docs/ui-guidelines.md` THE SYSTEM
  SHALL encontrar en §Dirección de arte una regla **6. Idioma** con el texto
  literal de [[design]] §5.3, que fija (a) el español como idioma único de la
  UI móvil, (b) que el idioma del código y de los commits no cambia, y (c) que
  los mensajes de validación del backend siguen llegando en inglés y por dónde
  se ven, para que ninguna spec futura vuelva a escribir copy en inglés «por
  consistencia con las demás pantallas».
  - Test: `mobile-pet-tracker/src/__tests__/ui-language.test.ts` ::
    `describe('#65 R15: la carta de UI fija el español como idioma de la UI')`

---

## Fuera de alcance

Lo de aquí abajo **no entra**, y se declara para que nadie lo dé por hecho al
ver la app tras esta feature.

1. **Los mensajes de validación del backend siguen en inglés.** Son de
   `backend-pet-tracker/`, los está tocando otra sesión, y esta feature no
   abre un solo fichero de backend. Tras #65 **seguirá llegando texto inglés
   por API** y se verá, literalmente, en:
   - `login.tsx:37` (`login-error`) — p. ej. `Invalid email address`,
     `Password is too short`.
   - `register.tsx` vía `mapValidationErrors` (`register-*-error` y
     `register-error`) — p. ej. `First name is required`,
     `Terms must be accepted`, y
     `passwordConfirmation must match password`
     (`backend-pet-tracker/src/modules/auth/application/dto/register-user.dto.ts:28`).
   - `weight-log.tsx:96` (`weight-form-error`) — p. ej. `Weight is too high`,
     `Date is in the future`.
   - `reset-password/index.tsx:43` (`reset-error`) — mismo `passwordConfirmation
     must match password` desde `reset-password.dto.ts:12`.
   - `add-pet`: `Exactly one of birthDate or approxAgeMonths is required`
     (`create-pet.dto.ts:46`) llegaría por el `kind: 'invalid'`, que hoy la
     pantalla traduce a su propio mensaje, así que ése **no** se ve.
   Los 10 asserts de test que hoy anclan esos mensajes (`login` 93/102,
   `register` 160/171, `weight-log` 375/376/387, `reset-password` 172/175/185,
   `api/auth` 215) **se quedan en inglés y no se tocan**: cambiarlos sería
   mentir sobre lo que devuelve el backend. Traducirlos es una feature de
   backend aparte.
2. **Los 5 valores de enum que la API devuelve y la pantalla pinta crudos.**
   Son datos, no literales de `src/`, así que el criterio «cero cadenas
   visibles en inglés en `mobile-pet-tracker/src/`» se cumple aunque sigan
   viéndose en inglés: `pet.sex` (`profile/index.tsx:81` → `female`/`male`),
   `device.connectivity` (`pairing/index.tsx:419` → `LTE`, `online`…),
   `document.type` (`docs/index.tsx:28`), `profile.foodType` y
   `profile.activityLevel` (`meal-schedule.tsx:273, 279` → `dry`, `medium`).
   El `connectivity` crudo además choca con `docs/ui-guidelines.md`
   §Dirección de arte 4 («nada de jerga del proveedor»). Mapearlos es
   **cambio de conducta** (una tabla de traducción de valores + su test) y va
   a feature propia. Si el humano quiere incluirlos, es una **enmienda a esta
   spec antes del handoff**, no una decisión de Codex.
3. **El nombre de la app** (`app.json` `expo.name`/`slug`:
   `mobile-pet-tracker`). Es visible bajo el icono, pero cambiarlo toca el
   `slug`, el bundle y la configuración de EAS: feature propia.
4. **`hosting/reset-password/index.html`** ya está en español (`lang="es"`);
   no se toca.
5. **Alinear el español existente con el vocabulario del Make**
   (`Collar GPS` en vez de `Dispositivo GPS`, `Documentos médicos` en vez de
   `Documentos`). Es redacción de producto sobre texto que ya está en el
   idioma correcto: va con la feature de fidelidad de cada pantalla.
6. **Instalar i18n, `expo-localization` o un catálogo de cadenas.** D1 de
   [[design]] §2.0 lo descarta con argumento; si algún día hay un segundo
   idioma real, esa es su feature.
7. **Cualquier cosa que el informe puso en otro bloque**: la paleta pastel
   (#64), los accesos rápidos de Home (#71), la cabecera fotográfica, el
   centro de notificaciones, las geocercas. Ni un `className` de más.
8. **El reset de estado de las pantallas de detalle** (#63) y **cualquier
   cambio de motion** (`progress/audit_animations_mobile.md`).
9. **Renombrar los `describe`/`it` en inglés.** Hay **44** títulos de test que
   citan copy inglesa o están redactados en inglés. No son aserciones y no los
   ve ningún usuario; tocarlos engorda el diff sin ganar nada. Los que citen
   una cadena traducida **sí** se actualizan, y solo ésos: son los 6 de
   [[design]] §3.4.

---

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar

> El gate cubre además, en el mismo acto: (a) la **redacción** de las 213
> cadenas españolas de [[design]] §2 —es copy de producto, y el humano es
> quien la firma—, y (b) las **9 enmiendas** a specs aprobadas de
> [[design]] §5. Sin ambas firmas la implementación no arranca.
