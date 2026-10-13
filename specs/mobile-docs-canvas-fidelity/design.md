---
feature: "mobile-docs-canvas-fidelity"
status: draft
tags: [mobile, ui, spec]
---

# #175 mobile-docs-canvas-fidelity — Diseño

> Decisiones técnicas de alto nivel. Los valores exactos (clases, textos,
> órdenes, deltas) viven en `requirements.md`; aquí se explica dónde va cada
> cosa y por qué. Rutas relativas a `mobile-pet-tracker/` salvo `docs/` y
> `specs/`.

## 1. Alcance por capa

Solo presentación. No cambia ningún contrato de API, puerto, query key ni
fichero de `src/api/` o `src/utils/`. `docs/architecture.md` no se toca:
el filtro es estado local de la pantalla sobre datos que ya llegan.

| Capa | Fichero | Cambio | R |
|---|---|---|---|
| Tema | `src/theme/global.css` | 5 tokens nuevos en `@theme` | R1 |
| Copy | `src/i18n/catalog.ts` | 7 claves × 2 idiomas | R3 |
| Pantalla | `src/screens/docs/index.tsx` | marco, cabecera, fila, zona de subida, chips y filtro | R4–R10 |
| Carta | `docs/ui-guidelines.md` | sección «Enmienda de fidelidad al canvas», 2 frases sustituidas, regla 2 y §12 extendidas | R2 |
| Registro de copy | `specs/mobile-ui-language/design.md` | sección §2.<N> con 7 filas | R3 |
| Tests | `src/theme/__tests__/global-css.test.ts` | `#175 R1` | R1 |
| Tests | `src/__tests__/design-drift.test.ts` | `#175 R2`, `#175 R10` | R2, R10 |
| Tests | `src/providers/__tests__/language-provider.test.tsx` | `#175 R3` + `+ 7, // #175 R3` | R3 |
| Tests | `src/screens/docs/index.test.tsx` | `#175 R4`–`R9` + Δ1–Δ10 | R4–R9 |
| Tests | `src/__tests__/consistency-classnames.test.ts` | Δ11–Δ13 | R7 |
| Tests | `src/__tests__/ui-copy-table.ts`, `src/__tests__/ui-language.test.ts` | 7 filas, Δ15 | R7, R8 |

`src/app/pets/[petId]/docs.tsx` y `src/app/_layout.tsx` no cambian: la
cabecera nativa ya tiene `title: ''` (B20).

## 2. Tokens (R1)

Esquema compartido con #173 y #174: tokens nombrados por su valor en
píxeles cuando la escala de Tailwind no llega, porque la clase con corchetes
está prohibida (regla 3).

| Necesidad del artboard | Clase | Origen |
|---|---|---|
| 11 px | `text-11` | **nuevo** `--text-11: 11px` |
| 12 px | `text-xs` | escala |
| 13 px | `text-13` | #173 (`--text-13`) |
| 15 px | `text-15` | **nuevo** `--text-15: 15px` |
| 26 px | `text-26` | #173 (`--text-26`) |
| peso 800 | `font-extrabold` | #173 (`--font-extrabold`) |
| peso 900 | `font-black` | existente |
| radio 12 | `rounded-xl` | escala de la carta |
| radio 20 | `rounded-card` | existente |
| radio 24 | `rounded-24` | **nuevo** `--radius-24: 24px` |
| cápsula | `rounded-full` | escala |
| tracking −0.02em | `tracking-title` | **nuevo** `--tracking-title: -0.02em` |
| tracking 0.08em | `tracking-eyebrow` | **nuevo** `--tracking-eyebrow: 0.08em` |
| 3 px de gap | `gap-0.75` | espaciado fraccionario |
| 6 px | `gap-1.5`, `mt-1.5` | escala |
| 14 px | `gap-3.5`, `px-3.5` | escala |
| 18 px | `p-4.5` | espaciado fraccionario |
| 34 px de alto | `h-8.5` | espaciado fraccionario |
| 48 px | `size-12`, `w-12` | escala |
| 56 px | `h-14` | escala |

Comportamiento comprobado por el spike de #173
(`specs/mobile-tab-screens-canvas-fidelity/design.md` §5, commit `164909de`):

- `--text-<px>` emite solo `fontSize`, sin `lineHeight`; el artboard de
  Documentos no fija altura de línea, así que no hace falta
  `--text-<px>--line-height`;
- el espaciado fraccionario compila (`p-4.5` → 18, `gap-3.5` → 14);
- el tracking en `em` se multiplica por el `fontSize` del mismo elemento, por
  eso `tracking-*` siempre va junto a una clase `text-*`.

`border-dashed` no está en el spike. Se verifica en el humo (R11).

## 3. Pantalla (`src/screens/docs/index.tsx`)

### 3.1 Imports

- `react-native`: se añade `Pressable`.
- `reicon-react-native`: `import { ChevronRight, FileText, Upload } from 'reicon-react-native';`
  (un único import, R10).
- `../../providers/language-provider`: se añade `useLocale` al import de
  `useTranslate`.
- `../home/format`: `fmtDate`.
- `../home/home-entrance`: `HomeEntrance`.
- `../../theme/touch-target`: `TOUCH_SLOP`.
- `../../theme/use-theme-colors`: `useThemeColors`.
- `CategorySlot` se importa como tipo desde `../../utils/category-palette`,
  junto a lo que ya se importa de ahí.

### 3.2 Constantes del fichero

```
FILTER_SLOTS: lista fija, en orden blue → green → amber → violet → neutral,
  de { slot, labelKey } con las cinco claves docs.category* (R8).
INK_TOKEN: Record<CategorySlot, token> con la tabla §Tinta por hueco (R6).
```

Las `labelKey: '<clave>'` de `FILTER_SLOTS` son las que cuenta `checkUses`
(`src/__tests__/ui-language.test.ts`) como usos de la clave. `INK_TOKEN`
incluye `rose` para que el `Record` sea exhaustivo, aunque sea inalcanzable.

### 3.3 `DocumentRow`

`DocumentRow` (la función existente) conserva su firma y pasa a pintar el
`Card` de R6. Llama a `useThemeColors([INK_TOKEN[slotName], 'muted'])` en su
nivel superior (es un hook), y a `useLocale()` para la fecha. El
`HomeEntrance` que la envuelve lo pone `DocsScreen` al iterar, porque el
`index` depende de la lista filtrada, no del documento.

### 3.4 `DocsScreen`

- **Estado nuevo**: `const [filter, setFilter] = useState<'all' | CategorySlot>('all');`.
- **Derivados**, calculados en el cuerpo sin `useMemo` (listas de decenas de
  documentos):
  - `presentSlots`: las entradas de `FILTER_SLOTS` cuyo `slot` aparece en
    `docs.data.docs.map(d => documentCategory(d.type))`;
  - `visibleDocs`: todos con `filter === 'all'`, y si no, los que tienen
    `documentCategory(d.type) === filter`, en el orden del backend.
- **Reinicio** (R9, P11): en `submitDocument`, en el camino correcto que
  cierra el formulario tras crear y confirmar (el del `await docs.refetch();`
  posterior a `createPetDocument`), se llama `setFilter('all')`. No se
  reinicia en `cancelUpload` ni en los errores.
- **Orden de bloques** (R7): el JSX del `ScrollView` queda
  cabecera → (esqueleto | error | vacío | chips + entradas) → (zona | formulario) → error de acción.
  Hoy la zona y el formulario van antes de la lista y el error de acción va
  antes de la lista o del vacío; se mueven los dos bloques al final.
- **Zona de subida**: `Pressable` con `style` en función de `pressed`
  (opacidad 0.8 y `...CONTINUOUS_CORNER` extendido). Las esquinas de radio 24
  no son cápsula, así que llevan `CONTINUOUS_CORNER` (regla 12). Se extiende
  dentro de la función y no como `style={CONTINUOUS_CORNER}`, así que el
  recuento de `#62 R14` (B22) no cambia. Pide
  `useThemeColors(['accent-strong'])` en el nivel superior de `DocsScreen`.
- **Chips**: un `Pressable` por chip, inline en el `map` de
  `[{ slot: 'all' }, ...presentSlots]`. Ningún componente nuevo (D7).

### 3.5 Por qué la zona es un `Pressable` y no un `Button`

- El artboard dibuja una tarjeta discontinua con icono, título y pista, no
  un botón con cuerpo. La regla 13 (labio) no aplica.
- El inventario `'inventaría los cuatro secundarios neutros de toda la app'`
  parte el código por `<Button` y trata como neutro todo tag con
  `border-lip-gray`. Un `<Button` con ese borde entraría en la lista y
  cambiaría su inventario de testIDs. Con `Pressable`, solo cambia el
  recuento global de `border-lip-gray` (Δ13).
- `docs-upload` deja de ser primario con labio. Por eso bajan los
  inventarios de primarios (Δ11, Δ12).

## 4. Dobles de test

En `src/screens/docs/index.test.tsx`, a nivel de fichero:

- **`../home/home-entrance`**: el doble de `src/screens/login/index.test.tsx`.
  Es un `jest.fn` que registra las props y pinta un `View` con ellas. El
  `testID` `docs-entry-<id>` aparece así en `docsChildren()`.
- **`reicon-react-native`**: el doble de `src/screens/profile/index.test.tsx`,
  con `__esModule: true` y el spread de `requireActual`. Pinta
  `<View {...{ size }} testID=… style={{ color }} />` con los testIDs
  `docs-icon-file-text`, `docs-icon-chevron-right` y `docs-icon-upload`.
  Ninguno empieza por `doc-`, así que `/^doc-/` no los ve.
- **`../../theme/use-theme-colors`**: identidad,
  `useThemeColors: (tokens: string[]) => tokens`. El `style.color` del doble
  de icono es el nombre del token, y el test lo asevera literal.

Los tres dobles se aplican a los 40 `it` heredados. Ninguno de ellos asevera
el `Animated.View` de una entrada ni un color resuelto, así que el doble no
cambia su resultado. Lo comprueba la corrida de H0 tras añadir los dobles
(`tasks.md` T0.3).

## 5. Coordinación

- **#173**: dependencia dura (requirements §Dependencias de #173, D1–D8). Si
  #173 cambia `card.tsx` (D5) o no trae algún token, el leader enmienda antes
  del handoff.
- **#174 y #178**: comparten la sección `## Enmienda de fidelidad al canvas
  (2026-10-13)` de la carta y el esquema de tokens. **Al preparar el
  handoff, el leader comprueba** si alguno ya mergeó la sección D-I/D-H
  (`grep -cF '## Enmienda de fidelidad al canvas' docs/ui-guidelines.md` en
  `origin/main`) y si ya existen `--tracking-title` u otros tokens de R1. Si
  ya están, el paso correspondiente de `tasks.md` se omite y el test se
  escribe contra lo que hay (R1, R2).
- **#177** (receta de CTA): puede tocar `docs-upload-submit` y
  `docs-upload-cancel`. Quien se especifique en segundo lugar hereda el
  cambio (Fuera de alcance D6).

## 6. Alternativas descartadas

| Alternativa | Por qué no |
|---|---|
| Zona de subida arriba, antes de la lista (orden actual, opción B) | El artboard la dibuja al final; la fidelidad pedida es píxel exacto |
| Chips por `document.type` crudo | Partiría «Vacunación» y «vaccine» en dos chips; `documentCategory` ya normaliza sinónimos, mayúsculas y espacios |
| Filtro en el servidor (query param) | El backend no lo ofrece y la lista completa ya está en caché; sería un cambio de contrato para una lista corta |
| Mostrar siempre los cinco chips de categoría | Abriría la lista filtrada vacía, que hoy no tiene diseño (D3) |
| `--tracking-caps: 0.06em` (de #174) para el eyebrow | El artboard de Documentos dibuja `.08em`; reutilizarlo rompería el píxel exacto (P10) |
| `--text-11--line-height` y `--text-15--line-height` | El artboard no fija altura de línea; añadirla sería inventar un valor |
| `--radius-upload` (nombre semántico) | El esquema acordado nombra por valor cuando no hay un rol ya nombrado con ese radio |
| Componente `FilterChip` compartido | Un único uso; se extrae cuando #178 o #179 lo necesiten (D7) |
| Fondo de fallback si el filtro queda sin entradas | No hay camino que lo produzca (D3) |
