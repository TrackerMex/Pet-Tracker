---
feature: "mobile-pastel-category-palette"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-pastel-category-palette]]

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para los valores exactos, el método de cálculo y los archivos
> afectados; [[../../docs/ui-guidelines|ui-guidelines]] §Dirección de arte 1 es
> la regla que gobierna esta feature y gana sobre cualquier skill;
> [[../../docs/conventions|conventions]] §Convenciones de la app móvil fija la
> estructura.

Skills cargadas antes de escribir, por [[../../docs/ui-guidelines|ui-guidelines]]
§Skills: `expo:expo-overview` (router) → `expo:expo-design-system`. De la skill
se toma el **patrón** (un solo origen de tokens, "todo valor visual repetido es
un token", "los componentes importan tokens, las pantallas importan
componentes"); su **sistema de estilos** (`theme.ts` en TypeScript,
`Color.ios.*`, `StyleSheet.create`) se descarta por la carta §Decisiones fijas
1-3: aquí los tokens viven **solo** en
`mobile-pet-tracker/src/theme/global.css`.

## Contexto mínimo para implementar sin esta conversación

La app pinta hoy **todas** las categorías con un único tono, `bg-accent-soft`
(el acento al 15 % de alfa, que compuesto da `#DCECE6` en claro y `#0E2220` en
oscuro): los 7 tipos de recordatorio comparten color y los tipos de documento
también. El diseño del Make usa en cambio una paleta pastel **categórica**.
Esta feature añade esa paleta como tokens y la aplica en los tres sitios donde
`accent-soft` significa hoy "categoría" (y **solo** en esos tres).

Invariante heredado de #46 / #61 / #62, que esta feature **no** rompe: cero
cambios de conducta, lógica, navegación ni texto visible; ningún `testID` se
renombra ni se elimina; los diffs son de `className`, de tokens y de un módulo
de mapeo nuevo. `--accent: #178255` (#61) y `--radius-card: 20px` (#72) **no**
se re-litigan.

## Requisitos funcionales

### Los tokens

- **R1**: WHEN se compila el tema claro de
  `mobile-pet-tracker/src/theme/global.css` THE SYSTEM SHALL declarar dentro de
  `@variant light` los diez tokens de la paleta categórica con estos valores
  exactos — `--color-category-blue: #EFF6FF`,
  `--color-category-blue-strong: #0768E0`, `--color-category-amber: #FFF7ED`,
  `--color-category-amber-strong: #A55E07`, `--color-category-green: #F0FBF6`,
  `--color-category-green-strong: #107148`, `--color-category-violet: #F5F3FF`,
  `--color-category-violet-strong: #7549F7`, `--color-category-rose: #FFF0F3`,
  `--color-category-rose-strong: #D80B34` — AND THE SYSTEM SHALL dejar
  `--color-category-green` y `--color-category-green-strong` idénticos a
  `--surface-secondary` y a `--accent-strong` del mismo tema, de modo que la
  familia verde no se bifurque en dos verdes distintos.
  - Test: `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts` ::
    `describe('#64 R1: global.css declara la paleta pastel categórica en tema claro')`

- **R2**: WHEN se compila el tema oscuro de
  `mobile-pet-tracker/src/theme/global.css` THE SYSTEM SHALL declarar dentro de
  `@variant dark` los mismos diez tokens con los valores **diseñados** (no
  copiados del Make, que solo trae tema claro) — `--color-category-blue: #0B203A`,
  `--color-category-blue-strong: #4A8DDF`, `--color-category-amber: #271E14`,
  `--color-category-amber-strong: #C17B22`, `--color-category-green: #12231B`,
  `--color-category-green-strong: #2AB87C`, `--color-category-violet: #221C33`,
  `--color-category-violet-strong: #9579E7`, `--color-category-rose: #39131A`,
  `--color-category-rose-strong: #E35E78` — AND THE SYSTEM SHALL mantener las
  cinco superficies oscuras a la **misma luminancia relativa** que
  `--surface-secondary` oscuro (`#12231B`, L = 0,0141), variando solo en tono y
  croma, de modo que las cinco categorías tengan la misma profundidad sobre la
  card.
  - Test: `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts` ::
    `describe('#64 R2: el tema oscuro de la paleta se diseña a la profundidad de surface-secondary')`

- **R3**: WHEN se mide el contraste WCAG 2.1 de cada tinta categórica sobre su
  propia superficie categórica THE SYSTEM SHALL dar **≥ 4,5:1** en los seis
  huecos (`blue`, `amber`, `green`, `violet`, `rose` y el `neutral`, que reusa
  `--default` y `--muted`) y en los **dos** temas, con estas ratios exactas:
  claro 4,746 / 4,705 / 5,703 / 4,725 / 4,732 / 4,601; oscuro 4,810 / 4,776 /
  6,432 / 4,811 / 4,788 / 6,148.
  - Test: `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts` ::
    `describe('#64 R3: cada tinta categórica pasa AA sobre su superficie en los dos temas')`

- **R4**: WHEN se mide la distancia perceptual CIEDE2000 entre cualquier par de
  superficies categóricas, y entre cada superficie o tinta categórica y los
  tokens de estado ya existentes (`--accent`, `--accent-strong`, `--success`,
  `--warning`, `--warning-strong`, `--danger` y sus superficies `*-soft`
  compuestas) THE SYSTEM SHALL dar **ΔE00 ≥ 2,3** (umbral de apenas-perceptible)
  en los dos temas, salvo la coincidencia **deliberada y declarada** de la
  familia verde con `surface-secondary` / `accent-strong` (ΔE00 = 0, R1/R2).
  - Test: `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts` ::
    `describe('#64 R4: ninguna categoría se confunde con otra ni con un token de estado')`

### El mapeo categoría → hueco

- **R5**: WHEN un consumidor pide el color de un tipo de recordatorio THE SYSTEM
  SHALL resolverlo a través de `REMINDER_TYPE_META[type].category`, que asigna a
  cada uno de los **siete** tipos de `mobile-pet-tracker/src/api/types.ts`
  exactamente un hueco de `CategorySlot` — `vaccine: 'blue'`,
  `deworming: 'violet'`, `medication: 'amber'`, `appointment: 'green'`,
  `weight: 'neutral'`, `food: 'rose'`, `custom: 'neutral'` — AND THE SYSTEM
  SHALL conservar intactos los campos `label` y `emoji` que ese record ya tiene.
  - Test: `mobile-pet-tracker/src/utils/__tests__/category-palette.test.ts` ::
    `describe('#64 R5: cada tipo de recordatorio resuelve un único hueco de la paleta')`

- **R6**: WHEN un consumidor pide el color de un tipo de documento THE SYSTEM
  SHALL resolverlo con `documentCategory(type)`, que compara el tipo en
  minúsculas contra la tabla de [[design]] §4.2 y devuelve `'blue'` para las
  variantes de vacunación, `'green'` para las de consulta, `'amber'` para las de
  desparasitación y `'violet'` para las de análisis;
  AND IF el tipo no está en la tabla — el contrato del backend lo declara
  `z.string().trim().min(1).max(40)`
  (`backend-pet-tracker/src/modules/media/application/dto/create-pet-document.dto.ts:5`),
  texto libre, no un enum — THEN THE SYSTEM SHALL devolver `'neutral'`, que
  renderiza exactamente el mismo par `bg-default` / `text-muted` que la fila
  muestra hoy, sin fallar ni pintar un color arbitrario.
  - Test: `mobile-pet-tracker/src/utils/__tests__/category-palette.test.ts` ::
    `describe('#64 R6: el tipo de documento resuelve su hueco y cae en neutral si es desconocido')`

### Dónde se aplican

- **R7**: WHEN se renderiza una fila de recordatorio
  (`mobile-pet-tracker/src/screens/reminders/index.tsx:270`, el `View` de
  `size-11` que contiene el emoji del tipo) THE SYSTEM SHALL sustituir
  `bg-accent-soft` por la superficie del hueco de ese tipo,
  `CATEGORY_SLOTS[meta.category].surface`, de modo que dos recordatorios de tipo
  distinto dejen de compartir fondo; AND THE SYSTEM SHALL conservar el resto de
  la clase (`size-11 items-center justify-center rounded-xl`), el
  `style={CONTINUOUS_CORNER}`, el emoji `{meta.emoji}` de `:273` y la etiqueta
  `{meta.label}` de `:278`, de modo que el color **nunca** sea el único portador
  de la categoría (WCAG 1.4.1).
  - Test: `mobile-pet-tracker/src/screens/reminders/index.test.tsx` ::
    `describe('#64 R7: la fila de recordatorio pinta el icono con el color de su tipo')`

- **R8**: WHEN se renderiza una fila de documento
  (`mobile-pet-tracker/src/screens/docs/index.tsx`) THE SYSTEM SHALL pintar el
  contenedor del icono de `:21` con `CATEGORY_SLOTS[slot].surface` en vez de
  `bg-accent-soft`, AND SHALL pintar el badge del tipo de `:26` con
  `CATEGORY_SLOTS[slot].surface` más `CATEGORY_SLOTS[slot].ink` en vez del par
  monocromo `bg-default` / `text-muted`, siendo
  `slot = documentCategory(document.type)`;
  AND THE SYSTEM SHALL conservar el texto `{document.type}`, el emoji `📄`, el
  `testID` `doc-<id>`, la cápsula `rounded-full` (sin `CONTINUOUS_CORNER`, por
  la escala de radios de #62) y el resto de la receta de badge que fijó #62 R10
  (`self-start px-2 py-0.5 text-2xs font-bold`).
  - Test: `mobile-pet-tracker/src/screens/docs/index.test.tsx` ::
    `describe('#64 R8: la fila de documento pinta icono y badge con el color de su tipo')`

  > **Enmienda declarada a #62 R10.** #62 dejó ese badge monocromo *"sin
  > introducir ningún hue nuevo"* explícitamente porque el hue era trabajo de
  > esta feature. R8 lo completa. La aserción exacta de
  > `docs/index.test.tsx:205-207` (`'self-start rounded-full bg-default px-2
  > py-0.5 text-2xs font-bold text-muted'`) se actualiza al par categórico: no
  > se debilita — sigue afirmando un `className` exacto y sigue afirmando que el
  > texto no cambia. Aprobar esta spec aprueba esa enmienda.

### Lo que no se puede romper

- **R9**: WHEN se ejecuta el grep-clean de la carta §Decisiones fijas 3 sobre
  `mobile-pet-tracker/src/` THE SYSTEM SHALL seguir dando cero hex fuera de
  `src/theme/`, cero clases arbitrarias `[...]`, cero `StyleSheet.create` y cero
  `shadow*`/`elevation` legacy;
  AND THE SYSTEM SHALL contener los nombres de clase de la paleta
  (`bg-category-*`, `text-category-*-strong`) **únicamente** dentro de
  `mobile-pet-tracker/src/utils/category-palette.ts`, escritos como literales
  completos y nunca compuestos por interpolación, porque el escáner de
  utilidades de Tailwind solo genera las clases que ve escritas enteras;
  AND IF alguna pantalla escribiera una de esas clases directamente THEN el test
  SHALL fallar nombrando el archivo.
  - Test: `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` ::
    `describe('#64 R9: el color categórico solo se nombra en el módulo de paleta')`

- **R10**: WHEN un agente lea `docs/ui-guidelines.md` §Dirección de arte 1 THE
  SYSTEM SHALL encontrar allí la tabla cerrada de los seis huecos con su token y
  su tipo asignado, y la regla de que toda sección categórica futura consume
  esos tokens en vez de inventar un hex, de modo que #71 y los bloques
  siguientes no tengan que releer esta spec para saber qué usar.
  - Test: `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` ::
    `describe('#64 R10: la carta declara la paleta categórica y su tabla de huecos')`

## Fuera de alcance

Cada exclusión con su motivo, para que el reviewer no la lea como olvido:

1. **La rejilla de accesos rápidos de la Home** (`App.tsx:396-412`). Es la
   feature **#71**, que solo **consume** estos tokens. Aquí no se especifica ni
   se dibuja.
2. **Los diecisiete `bg-accent-soft` que significan "acento", no "categoría"**,
   y por tanto no se tocan. Evidencia sitio a sitio en [[design]] §5; en
   resumen: `pet-switcher.tsx:32` (anillo de la mascota **seleccionada**),
   `(auth)/forgot.tsx:31`, `home.tsx:183`, `:240` y `:329` (círculos de icono y
   CTA de acento), `add-pet/index.tsx:60`, `:283`, `:358` y
   `add-reminder/index.tsx:153`, `:271` (chip **seleccionado**: el color dice
   "elegido", no "vacuna"), `add-pet/index.tsx:253` y `profile/index.tsx:266`
   (Skeleton), `profile/index.tsx:61` (respaldo del avatar), `:94` (píldoras de
   atributos heterogéneos, que no son una taxonomía), `pairing/index.tsx:297` y
   `:450` (estado de éxito), `reminders/index.tsx:198` (píldora de resumen).
3. **Las tres píldoras de resumen de `reminders/index.tsx:198`, `:213`, `:240`**
   (`pill-active` / `pill-week` / `pill-inactive`). Son un eje de **estado**
   (activo / esta semana / inactivo), no una taxonomía; el Make también las
   colorea con verde/ámbar/gris de estado (`App.tsx:933-935`). Si algún día se
   colorean, es con los tokens de estado, no con estos.
4. **La etiqueta de tipo de la fila de recordatorio (`:278`) no se convierte en
   badge de color.** El Make sí la pinta (`App.tsx:947`), pero en el Make el
   badge de urgencia contiguo es **rojo** (`#FEF2F2`/`#EF4444`, `App.tsx:949`)
   mientras que en la app es **ámbar** (`bg-warning-soft` / `text-warning-strong`,
   fijado por #61 R3). Poner el badge categórico ámbar de `medication` junto al
   badge ámbar de "Upcoming!" pondría dos cápsulas de la misma forma y casi el
   mismo ámbar (ΔE00 4,9 en superficie, 6,3 en tinta — [[design]] §3.3) a pocos
   píxeles. La etiqueta se queda como texto `text-muted`.
5. **El emoji `📄` de la fila de documento no se sustituye por el emoji del
   tipo.** El Make da uno por tipo (💉🩺💊🔬); cambiarlo es cambiar contenido
   visible, prohibido por el invariante, y #62 dejó los ocho emoji de
   iconografía explícitamente fuera de alcance.
6. **No se añade un sexto hue.** El Make no tiene un sexto pastel utilizable:
   sus dos azules distan ΔE00 **1,24**, por debajo del umbral de percepción, y
   sus dos ámbares **3,78**. Inventar uno sería salirse del diseño.
   Consecuencia asumida y declarada: `weight` y `custom` **comparten** el hueco
   `neutral` (R5). Mitigación: sus emoji (⚖️ / 📌) y sus etiquetas
   ("Weight" / "Other") siguen distinguiéndolos.
7. **No se instala ninguna dependencia** ni se toca `backend-pet-tracker/`.
8. **No se traduce nada.** El idioma de la UI es la feature **#65**; las claves
   de `documentCategory` cubren español e inglés porque el tipo de documento
   llega **por API** como texto libre del usuario, no como copy de la UI, y eso
   seguirá siendo cierto después de #65.
9. **`--accent`, `--radius-card`, `--warning`, `--danger` y `--success` no se
   modifican.** Ningún token existente cambia de valor en esta feature.

## Riesgo conocido, con su número

El par de superficies claras más próximo es **azul `#EFF6FF` contra neutral
`#F5F6F8`: ΔE00 3,7** (1,6× el umbral de 2,3). Es la naturaleza del pastel:
cinco casi-blancos sobre un blanco. Se declara aquí en vez de esconderlo, y la
mitigación es estructural, no cosmética: por R7 y R8 ninguna pantalla usa el
color como único portador de la categoría — siempre hay emoji y texto al lado.
El gate humano de smoke es quien decide si eso basta en pantalla real.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar

Al firmar, el humano aprueba también:

- [ ] La **enmienda a #62 R10** declarada en R8 (el badge del tipo de documento
      deja de ser monocromo y toma el hue de su categoría).
- [ ] Que `weight` y `custom` **comparten** el hueco `neutral` (§Fuera de
      alcance 6), en vez de inventar un sexto hue que el diseño no tiene.
- [ ] Que la familia verde **reusa** los valores de `surface-secondary` /
      `accent-strong` en vez de declarar un segundo verde (R1, R2).

## Gate humano posterior a la implementación (no delegable a IA)

- [ ] Smoke en **dev build de Android** (no Expo Go), en tema claro **y**
      oscuro, sobre las pantallas Reminders y Documentos, comprobando que las
      categorías se distinguen entre sí y que ninguna queda ilegible.
