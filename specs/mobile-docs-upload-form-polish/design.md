---
feature: "mobile-docs-upload-form-polish"
status: draft
tags: [mobile, ui, spec]
---

# #185 mobile-docs-upload-form-polish — Diseño

> Decisiones técnicas de alto nivel. Sin código. La ubicación del formulario
> (P1) está abierta: las secciones §3.A, §3.B y §3.C describen cada rama y solo
> rige la que el humano marque en `requirements.md` §Aprobación.

## 1. Diagnóstico (medido en 44acd74b)

Los cambios (2) y (3) del humano tienen una sola causa: el contenedor del
formulario (`<View testID="docs-upload-form">`) y sus hijos no llevan clase
alguna (B2, B3, B4 de `requirements.md`), así que los cuatro `TextField` y los
dos `Button` se apilan sin hueco. No hay nada que «ajustar»: hay que dar
espacio por primera vez.

La causa de (1) es estructural: `DocsScreen` guarda `selectedDocument` y pinta
el formulario como un hijo más del `ScrollView`, al final de la lista, bajo la
zona de subida. El humano no lo quiere ahí.

## 2. Decisiones comunes a todas las ramas

| # | Decisión | Por qué |
|---|---|---|
| D1 | Espacio con `gap` en el padre, no con `margin` en cada hijo | Un valor por nivel; los `TextField` de HeroUI no se tocan; sigue el patrón de la app (`gap-3.5` en `docs-list-skeleton`, `gap-1.5` en `docs-filters`) |
| D2 | `docs-upload-form` lleva `gap-4`; cada `TextField` lleva `gap-1.5`; `docs-upload-actions` (nuevo) lleva `gap-3` | Escalas de Tailwind sin tokens nuevos; `gap-1.5` ya compila bajo uniwind en la propia pantalla |
| D3 | Un único `View` nuevo, `docs-upload-actions` | Es lo mínimo para separar la pareja sin tocar la receta del botón |
| D4 | No se tocan clases de botón, etiqueta ni input (R8) | #177, #186 y #187 las reescriben; tocarlas ahora crea conflicto de merge |
| D5 | Sin copy nuevo | La pantalla nueva (rama A) lleva `title: ''` como Docs; ningún texto se añade |
| D6 | Mismos `testID` del formulario en cualquier rama | Los tests `#158 R5-R11` se mudan sin reescribirse; solo cambia el arnés |

### Valores y su origen

| Valor | Clase | Origen | Estado |
|---|---|---|---|
| Entre campos 16 | `gap-4` | `NuevoRecordatorio.dc.html` (gap 16) y A11 de la carta | por confirmar (P2); `Registro`/`NuevaMascota` dibujan 12 |
| Etiqueta a input 6 | `gap-1.5` | `Registro`, `NuevaMascota`, `NuevoRecordatorio` (los tres) | por confirmar (P3) y supeditado a la medición de `TextField` en H0 |
| Entre botones 12 | `gap-3` | analogía: ningún artboard dibuja primario + cancelar | por confirmar (P2) |

El canvas (artifact `VqaQQsRTtis9Dbttqy3z7j`, `Documentos.dc.html`) no dibuja
este formulario. Por eso esta spec no se declara «píxel exacto»: usa los
valores de los formularios hermanos y el humano los confirma en el smoke.

## 3. Ramas de P1

### 3.A Pantalla propia

Archivos por capa (todo es capa de presentación; no hay cambio en domain,
application ni infraestructura):

| Pieza | Ruta |
|---|---|
| Ruta delgada nueva | `src/app/pets/[petId]/docs-upload.tsx` |
| Pantalla nueva | `src/screens/docs-upload-form/index.tsx` |
| Test nuevo | `src/screens/docs-upload-form/index.test.tsx` |
| Registro | `src/app/_layout.tsx` (un `Stack.Screen` con `...headerOptions, title: ''`, junto al de Docs) |
| Lista | `src/screens/docs/index.tsx` (pierde el formulario y la mayor parte de los estados de subida) y `src/app/pets/[petId]/docs.tsx` (lee `uploaded` y lo pasa) |
| Carta | `docs/conventions.md` y `docs/ui-guidelines.md`: se añade la ruta a la lista A11 |

Cómo viaja el archivo elegido: params de ruta como cadenas (`uri`, `name`,
`mimeType`, `size`, `contentType`). `uri` es un `file://` de caché que
`submitDocument` ya lee con `fetch(uri).blob()` y no necesita viajar por otro
medio; sin estado global ni contexto nuevo.

Cómo vuelve el resultado: `router.dismissTo` a la lista con un nonce
`uploaded` (`String(Date.now())`, se calcula en el manejador, no en el
render, así que no cae en `react-hooks/purity`). La lista tiene un efecto sobre
el cambio de `uploaded` que refresca y vuelve a «Todos». Se descarta
`useFocusEffect` + refetch porque reiniciaría el filtro también al cancelar, y
se descarta compartir el filtro por estado global por añadir un módulo para
una sola pantalla. H0 comprueba que `router.dismissTo` existe en el
`expo-router` instalado (`grep -c dismissTo
node_modules/expo-router/build/imperative-api.d.ts`); si no, se usa
`router.navigate` con los mismos params y se anota en `progress/`.

Typed routes: la ruta nueva obliga a regenerar `.expo/types/router.d.ts`
(gitignorado). Antes de tocar código, `test ! -e .expo/types/router.d.ts`; si
existe, lo borra el humano o el leader (el sandbox de Codex lo deniega,
memoria «Tipos de expo-router obsoletos»).

Riesgos: (a) el nombre `docs-upload` ya es el `testID` de la zona; la ruta
usa `docs-upload` como segmento y los `testID` nuevos como `docs-upload-actions`
comparten prefijo con él pero ningún selector por prefijo `docs-` existe (B19).
(b) El error `docs-action-error` queda repartido: el de elegir archivo en la
lista, los de subida en la pantalla nueva (R2.6).

### 3.B Hoja inferior

Archivos: solo `src/screens/docs/index.tsx` y su test. El
`<View testID="docs-upload-form">` se mueve dentro de un `BottomSheetView`
dentro de `BottomSheet` (import de `@expo/ui/community/bottom-sheet`, nunca
de `@gorhom` directo). `index={selectedDocument === null ? -1 : 0}`,
`enablePanDownToClose` solo sin subida, `onClose` ejecuta `cancelUpload`.
Precedente de la hoja y de su doble de jest: `src/screens/reminders/index.tsx`
y `reminders/index.test.tsx` (`grep -n "community/bottom-sheet"` en ambos).

Riesgo de teclado: el `Input` de HeroUI es un `TextInput` normal, no el
`BottomSheetTextInput` de @gorhom, y la hoja de Recordatorios no tiene inputs
(B12). En Android el teclado puede tapar los últimos campos y los botones. No
se resuelve en la spec: se mide en el smoke (R11). Si falla, la salida es
volver a P1 = A. `snapPoints` y la prop de teclado se fijan tras instalar
`@expo/ui` (B20) y leer su `.d.ts`; el implementer anota los valores en
`progress/impl_*.md` y avisa si no existe una prop de teclado soportada.

### 3.C Otra

No diseñada. Si el humano marca C, el spec_author completa esta sección y R4.

## 4. Alternativas descartadas

- **`mb-*` en cada `TextField`**: cuatro puntos de verdad, y el último campo
  llevaría margen que sobraría.
- **Un `Divider` o `Spacer` entre botones**: añade nodos sin ganar nada sobre
  `gap` (D1).
- **Cambiar `Button` a `size="lg"` o `className="mt-3"` en el cancelar**: toca
  la clase del botón, territorio de #177 (R8).
- **Un componente `FormField` compartido** (envoltorio de campo con etiqueta,
  input y error): es justo el componente global de #186; hacerlo aquí
  duplicaría su diseño.
- **Estado global (Zustand/contexto) para el archivo elegido** (rama A): los
  params de ruta bastan y no añaden módulo.

## 5. Candados tocados (qué se mide y quién los mueve)

Ver R10 de `requirements.md`. Resumen: la rama A mueve ficheros entre
`SCREEN_FILES`, `ui-copy-table`, `consistency-classnames` y `detail-stack`; la
rama B no toca ninguno. El `HEX_LITERAL` de `design-drift` no se ve afectado
siempre que los comentarios usen `#185 Rn`. Las clases nuevas (`gap-4`,
`gap-3`, `gap-1.5`) no caen en `legibility-classnames` (no son de color) ni en
la regla de «sin `[...]`» ni de «sin sombra»; H0 lo comprueba con `bunx jest
src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts`
tras el primer verde.
