---
feature: "mobile-home-weight-without-collar"
status: approved           # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-home-weight-without-collar]] (#77)

> Ver [[requirements]] para los requisitos que este diseño implementa,
> [[tasks]] para el orden de commits y los tests literales, y
> [[../../docs/architecture|architecture]] para las capas. Toda la feature vive
> en la capa de presentación móvil (`src/screens/home/index.tsx`): no toca
> dominio, aplicación, infraestructura ni la capa de API del cliente.
> Ninguna cita usa número de línea.

## El defecto, de punta a punta

1. El usuario da de alta una mascota y aún no le pone collar. Registra su peso
   desde el acceso rápido «Peso».
2. El backend guarda la medida y actualiza `pets.currentWeightKg`
   (`weight.drizzle.repository.ts`, `async create(`). La Home relee el detalle
   al recuperar el foco (`refetchDetail();`). **El dato llega.**
3. La actividad responde `no-tracking` (no hay collar). En
   `src/screens/home/index.tsx` la fila de la tira entera cuelga de
   `{activity.data?.kind === 'ok' ? (`, así que la celda de peso, que **no**
   depende de la actividad, desaparece con las otras tres.
4. El usuario ve «La actividad requiere un collar» y ningún peso. El dato que
   acaba de registrar no está en la pantalla principal. Lo mismo con la
   actividad en `error`, `unreachable` o `missing-config`.

#69 R7 lo dejó así a sabiendas («no desacoplar la celda de peso de esa
condición») y el humano abrió #77 al firmarla. #77 ataca el paso 3: desacopla
la celda de peso del estado de la actividad sin tocar el estado `ok`.

---

## Carta de UI (`docs/ui-guidelines.md`, gate C8)

Skills (nombres de Claude; el leader da los de Codex en el handoff):
`expo-overview` → `expo-native-ui` (composición y estilo) y
`appllama-app-design-skill` (obligatoria en toda tarea de UI móvil; de ella se
toma el patrón «estados completos, no solo el feliz», no su sistema de
estilos). **La carta gana sobre las skills**: la skill `expo-native-ui` dice
«CSS and Tailwind are not supported - use inline styles» y aquí manda Uniwind
con `className`, como en todo el repo.

- **Grep-clean**: ningún hex, ninguna clase arbitraria `[...]`, ningún
  `StyleSheet`. Clases nuevas en `src`: `flex-3` y `pl-3` (utilidades de escala
  de Tailwind v4; Uniwind 1.11.0 compila `flex-3` a
  `flexGrow: 3, flexShrink: 1, flexBasis: '0%'`). `self-center` ya existe.
  `describe('C8: la UI no usa clases arbitrarias'` sigue verde (medido).
- **Componentes compartidos**: ninguno nuevo. La fila vive dentro del `Card`
  `summary-card` que ya existe; el icono es `Weight` de `reicon-react-native`,
  como en `ok`. Un solo usuario (regla de extracción ≥ 2 pantallas).
- **Dimensiones de pantalla**: no cambian. La fila ocupa el mismo sitio que la
  tira de `ok`; la nota deja de ser un bloque suelto del `Card` (con su
  `gap-4`) y pasa a vivir dentro de la fila. La altura de la tarjeta sin
  actividad pasa de «título + nota» a «título + fila».
- **Radios, sombras, animación**: no aplica. Nada redondeado nuevo, nada
  pulsable, ningún `entering`: la fila aparece cuando la actividad resuelve,
  igual que hoy la tira de `ok`.
- **Skeleton**: el de hoy (`summary-skeleton`), sin cambios. Mientras la
  actividad carga, **no** se pinta la celda (D2): el skeleton tiene la forma de
  la fila que viene.
- **Tema**: tokens semánticos (`text-foreground`, `text-muted`,
  `border-border`) y la tinta `muted` resuelta por `useThemeColors`, como en
  `ok`. Claro y oscuro sin trabajo extra; el smoke los mira (R4 paso 6).
- **Idioma**: cero claves nuevas (Dirección de arte 6 no aplica).
- **Dirección de arte 3, las siete preguntas de la Home**: #77 mejora **solo**
  «¿cómo fue su actividad hoy?», en la parte que el resumen de hoy sí puede
  responder sin collar (el peso); sigue diciendo por qué no hay actividad. No
  toca ¿está segura?, ¿dónde está?, ¿el collar está conectado?, ¿tiene
  batería?, ¿tiene algún recordatorio pendiente? ni ¿hay alguna alerta?: sus
  secciones no cambian.
- **Dirección de arte 5, fidelidad no es pérdida de información**: es el
  motivo de la feature. La alternativa (D) (cuatro celdas con guiones)
  **ocultaría** la razón (sin collar / error) y se descarta por este punto.

### Enmienda #70: cada decisión del elemento, con su `expect` y su sonda

El elemento es la **celda de peso** en la rama sin actividad, más la fila que
la contiene y la nota que la acompaña. Cada decisión tiene un `expect` en
`describe('#77 R2: …'` (salvo donde se dice otra cosa) y una sonda medida
([[requirements]] §R2, ids N*, y §R1, ids M*).

| # | Decisión | Valor | `expect` | Sonda |
|---|---|---|---|---|
| 1 | Dato que muestra | `fmtKg(currentWeightKg)` del detalle | R1 `it.each` (`12.4 kg`), `pinta un guion sin peso registrado` (`—`), `pinta un guion y la nota…` (`—`) | M1, M2, M3 |
| 2 | Componente de icono | `Weight` (`icon-weight`) | `cellChildren[0].props` `toEqual({ testID: 'icon-weight', … })` | N9 |
| 3 | Etiqueta visible / clave | `t('home.weight')` = `Peso` | `cellChildren[2]` `toHaveTextContent('Peso')` | N11 |
| 4 | Nombre accesible | ninguno propio: se anuncian sus textos | `cell.props.accessibilityLabel` y `row.props.accessibilityLabel` `toBeUndefined()` | N5 |
| 5 | Color o hueco de fondo | ninguno | `cell.props.className` exacto | N6 |
| 6 | Tinta del icono | `muted` | `color: '--color-muted'` con el espía de `Uniwind.getCSSVariable` | N8 |
| 7 | Receta tipográfica de cada texto | valor `text-sm font-bold text-foreground` + cifras tabulares; etiqueta `text-2xs font-normal text-muted`; nota `font-normal text-muted` | `value.props.className`, `value.props.style`, `cellChildren[2].props.className`, `note.props.className` | N12, N13, N14 |
| 8 | Destino de navegación | ninguno | `cell.props.onPress` y `note.props.onPress` `toBeUndefined()` | N16, N17 |
| 9 | Condición de render | actividad resuelta y no `unauthorized` | R1 y R2 (4 estados), R3 (cargando, `unauthorized`), y el estado `ok` de `#69 R1` | M4, V3, V3a, V3b |
| 10 | Forma del contenedor, en esta rama | fila `flex-row` | `row.props.className` `toBe('flex-row')` | N4 |
| 11 | Envoltorios que reparten el espacio | celda `flex-1`, nota `flex-3` | `cell.props.className`, `note.props.className` | N7 |
| 12 | Orden de los hijos | fila: celda, nota; celda: icono, valor, etiqueta | `rowChildren[0]` `toBe(cell)`, `rowChildren[1].props.testID`, `cellChildren[1]` `toBe(value)` | N2, N15 |

**Estructurales:** identidad (`rowChildren[0]` `toBe(cell)`, `cellChildren[1]`
`toBe(value)`), orden (fila 12) y cardinalidad **por hijos**
(`rowChildren` `toHaveLength(2)`, `cellChildren` `toHaveLength(3)`, hijos
`string` filtrados), nunca por recuento de `testID`. Sondas N1, N2, N15.

**Invariantes compartidos:**

| Invariante | Valor | `expect` | Sonda |
|---|---|---|---|
| Tamaño de icono | `20` (**por literal**, no por variable) | `size: 20` en el `toEqual` de las props | N10 |
| Objetivo táctil y reparto | nada pulsable; reparto `flex-1` / `flex-3` | `onPress` `toBeUndefined()`; clases exactas | N7, N16, N17 |
| Radio | ninguno | `className` exactos de fila, celda y nota | N4, N6, N7 |
| Rol y agrupación accesible | la fila y la celda no agrupan (`accessible` ausente): celda y nota se anuncian por separado | `row.props.accessible`, `cell.props.accessible` `toBeUndefined()` | N5 |
| Sitio de render | dentro de `summary-card` | `within(screen.getByTestId('summary-card')).getByTestId('summary-note')` `toBe(note)` | N3 |
| Feedback de pulsado | ninguno (no es pulsable) | `onPress` `toBeUndefined()` | N16, N17 |

---

## Decisiones técnicas

### D1 — Composición (B): la celda y la nota en una fila (R2)

Sin actividad, la fila `flex-row` tiene dos hijos: la celda de peso, con la
**misma** anatomía y las **mismas** clases que en `ok`
(`flex-1 items-center gap-1 border-r border-border`), y la nota
`flex-3 self-center pl-3 font-normal text-muted`.

- **Ancho**: `flex-1` + `flex-3` reparte el ancho en cuartos, así que la celda
  mide **un cuarto**, lo mismo que en `ok` (cuatro `flex-1`). Cambiar de
  mascota entre una con collar y otra sin él no mueve la celda.
- **Divisor**: el `border-r border-border` que la celda ya lleva en `ok` es el
  único divisor. No hay borde suelto (la nota no lleva borde) y **ninguna clase
  es condicional**: la celda no sabe en qué estado está.
- **Nota**: `self-center` la centra en vertical respecto a la celda (tres
  líneas de alto); `pl-3` la separa del divisor. Mismo copy, misma receta
  tipográfica que hoy.

Resuelve C3 (no hace falta «su propio juego de divisores») y el criterio 2.

### D2 — Estados (R1, R3)

| `activity.data` | Qué pinta la tarjeta bajo el título |
|---|---|
| `undefined` (cargando) | `summary-skeleton`, como hoy. **Ni celda ni nota** |
| `ok` | la tira de #69, **sin cambios** |
| `no-tracking` | celda de peso + nota `home.activityNeedsCollar` |
| `error`, `unreachable`, `missing-config` | celda de peso + nota `home.couldNotLoadActivity` |
| `unauthorized` | **nada** (la sesión se cierra: `onUnauthorized` del `QueryClient`) |

Por qué no la celda mientras carga: aparecería antes que las otras tres en
`ok` y el skeleton dejaría de tener la forma de lo que viene (dos bloques que
se recolocan). Por qué no en `unauthorized`: la Home se desmonta al cerrar la
sesión; pintar la celda un instante es un parpadeo sin valor. Resuelve C5.

### D3 — El peso sale del detalle y la fila no lo espera (R1)

La celda sigue pintando
`fmtKg(detail.data?.kind === 'ok' ? detail.data.pet.currentWeightKg : null)`:
el mismo dato y el mismo formato que en `ok`. La guarda de la fila mira
**solo** la actividad; mientras el detalle carga o si falla, `—`, que es lo que
ya fija `#69 R7` en `ok` (sonda M3: esperar al detalle lo rompe). **Cero**
peticiones nuevas: ni `health-records` ni una segunda query del detalle
(sondas M5 y el `not.toContain('../../api/health-records')` de R1). Resuelve C2
y el criterio 5.

### D4 — Las notas entran en la fila (R2)

Los dos bloques de nota sueltos se sustituyen por **un** `Text` en la rama
`else` del ternario de la fila, con el mismo `testID="summary-note"`, las
mismas claves y un ternario sobre `activity.data.kind === 'no-tracking'`. La
nota **no** es pulsable (N17): la tarjeta del collar ya lleva al
emparejamiento y reintentar la actividad es de otra feature. Todos los tests
que leen `summary-note` por `testID` (R9, R14) siguen verdes sin tocarlos.

### D5 — Una sola celda de peso, compartida por las dos ramas (R1, R2)

La celda de peso se escribe **una vez**, primera hija de la fila, fuera del
ternario. `Walk`, `Moon` y `Map` van dentro de `<>…</>` en la rama `ok`. El
fragmento no crea nodo host: en `ok` la fila tiene los mismos cuatro hijos
que hoy, así que `#69 R1` (sus diez `it`) y `#126 R1` siguen verdes sin tocar
nada (medido).

Es también lo que exige el candado de fuente: `#69 R9` cuenta **4** literales
`<(?:Weight|Walk|Moon|Map) size={20} color={muted} />`. Escribir el icono de
peso (o la celda entera) una vez por rama deja dos literales `Weight` y lo pone
rojo con 5, aunque las dos copias sean idénticas (sonda N19: el icono en un
ternario con `muted` en las dos ramas). Y si la copia de la rama sin actividad
lleva otra tinta (N8), el recuento sigue en 4 (solo cuenta `muted`) y #126 R1
no la ve (solo mira `ok`): la cierra el `toEqual` de las props del icono en
#77 R2.

### D6 — Arnés de los tests (R1-R3)

- **Sitio**: tres `describe` de nivel superior, seguidos, inmediatamente antes
  de `describe('R10: last position enlaza al mapa', () => {`. Ninguno dentro de
  `describe('R9: summary degrada con gracia'`: sus siete `it` no se tocan (C1).
- **Nombres**: prefijo `#77 R<n>:` (`docs/conventions.md` §Prefijo de
  feature). En los comentarios nuevos, `#` seguido de cifras solo como
  `#77 R<n>` (guard de drift de #126).
- **Setup**: `beforeEach` propio en cada `describe` (auth autenticada,
  `makePet({ currentWeightKg: 12.4 })`). Ningún `jest.mock` ni import nuevo:
  `within`, `Uniwind`, `DailyActivityState`, `renderWithProviders`,
  `readFileSync`, `join`, `pending`, `HomeWrapper`, `renderHome` y `makePet`
  ya están en el fichero.
- **Tinta**: solo R2 espía `Uniwind.getCSSVariable` para que cada variable
  resuelva a su nombre. Sin espía, en jest `useThemeColors`
  (`src/theme/use-theme-colors.ts`) devuelve para **todos** los tokens el mismo
  respaldo de `foreground`, así que `muted` y `accent-strong` serían el mismo
  string y la sonda N8 no se distinguiría. `afterEach` restaura.
- **Sesión caducada**: R3 usa `renderWithProviders(<HomeScreen />, { wrapper:
  HomeWrapper, onUnauthorized })`, porque `renderHome()` no expone
  `onUnauthorized`.
- **Anclas de espera**: `collar-card` y `pet-hero-error` necesitan el detalle
  resuelto, así que el `—` que se asevera después es el del perfil y no el de
  la carga. Nunca `advanceTimersByTime`.
- **Recuento por hijos**: `children.filter((child) => typeof child !== 'string')`
  y `toHaveLength`, nunca por `testID`.

### D7 — Orden y rojos (C4)

- **R1** primero: rojo natural (la celda no existe sin actividad). Su verde
  cambia la guarda y envuelve las tres celdas en el fragmento, **sin** mover
  las notas: es la implementación mínima.
- **R2** después: rojo natural sobre el verde de R1 (la fila tiene un hijo, no
  dos). Su verde borra las notas sueltas y pone la nota en la fila.
- **R3** al final: **requisito de verificación**. La base y el verde de R1 ya
  lo cumplen (la guarda final ya excluye `undefined` y `unauthorized`), así
  que no hay orden que dé un rojo natural: la vía (a) de C4 no existe. Se
  cierra por la vía **(b)**: la mutación de producción V3 (la guarda se relaja
  a `selectedPetId !== null`) se **versiona** en el commit rojo y se
  **revierte** en el verde. Nunca se muta un doble.
- Ningún rojo es `ReferenceError` ni de tipos: `tsc --noEmit` exit 0 en los
  tres rojos (medido).

### D8 — Enmienda a #69 R7 (spec, no código)

`specs/mobile-home-stats-strip/requirements.md` §R7 dice «sin celdas» para
los estados sin actividad y «THE SYSTEM SHALL **no** desacoplar la celda de
peso de esa condición». #77 R1-R3 lo sustituyen. El spec_author añade
`## Enmienda #77 — el peso se desacopla de la actividad` antes de su
`## Aprobación`, con casilla propia `- [ ] Enmienda aprobada por humano`. No
cambia nada más de #69 (el estado `ok`, el skeleton, el copy, el resto de
R7). Resuelve C4 de §0.2.

---

## Archivos afectados

- `mobile-pet-tracker/src/screens/home/index.tsx` — presentación. Guarda de la
  fila, fragmento de las tres celdas de actividad, nota dentro de la fila;
  borra las dos notas sueltas. 51 inserciones y 51 borrados (medido).
- `mobile-pet-tracker/src/screens/home/index.test.tsx` — tres `describe`
  nuevos (`#77 R1`, `#77 R2`, `#77 R3`), 220 líneas añadidas, 0 borradas;
  +13 tests.
- `specs/mobile-home-stats-strip/requirements.md` — la enmienda de D8 (la
  escribe el spec_author en esta spec; Codex **no** la toca).
- `specs/mobile-home-weight-without-collar/traceability.md` — la rellena Codex
  una vez, en el último commit.

Nada más: ni `format.ts`, ni `src/api/`, ni el catálogo, ni `global.css`, ni
`docs/`, ni backend, ni e2e, ni `package.json`/`bun.lock`.

---

## Alternativas descartadas

- **(A) Celda a todo el ancho con la nota debajo.** La celda cambia de ancho
  entre mascotas con y sin collar (un cuarto frente al ancho entero), y el
  `border-r` quedaría pegado al borde de la tarjeta: necesita una rama de
  clases propia. Más código y el borde suelto que el criterio 2 prohíbe.
- **(C) Celda de un cuarto con la nota debajo.** Conserva el ancho, pero su
  `border-r` queda colgando junto a tres cuartos vacíos: borde suelto, o
  clases condicionales para quitarlo.
- **(D) Cuatro celdas, con guiones en las de actividad.** Reutiliza la tira
  entera, pero tres guiones dicen «cero» o «sin dato» donde la verdad es «sin
  collar» o «no se pudo cargar». Sin la nota, **oculta** la razón (viola
  Dirección de arte 5 y pone rojos los `it` de `R9` y `R14` que leen
  `summary-note`); con la nota debajo, la tarjeta dice lo mismo dos veces y
  gana una fila de guiones que no informa.
- **Pedir el peso a `health-records` (`listWeights`).** Una llamada nueva por
  Home para un dato que el detalle ya trae; rompe el criterio 5 y los seis
  candados de recuento de llamadas.
- **Pintar la celda mientras la actividad carga.** Descolocaría el skeleton y
  haría aparecer la celda antes que sus vecinas en `ok` (D2).
- **Duplicar la celda de peso en cada rama del ternario.** Más código, y
  `#69 R9` lo pone rojo por el segundo literal `Weight` (N19): una celda
  compartida es menos diff y el candado ya la exige (D5).
- **Hacer la nota pulsable para reintentar.** Otra feature; hoy no lo es (N17).
