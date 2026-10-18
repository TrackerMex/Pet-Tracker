---
feature: "mobile-docs-upload-form-polish"
status: approved
tags: [mobile, ui, spec]
---

# #185 mobile-docs-upload-form-polish — Requisitos

> Pule el formulario de subida de documentos de `src/screens/docs/index.tsx`
> (ruta delgada `src/app/pets/[petId]/docs.tsx`): lo saca de la lista, separa
> los campos y separa los dos botones. Rutas relativas a `mobile-pet-tracker/`
> salvo las que empiezan por `docs/`, `specs/` o `progress/`, que son relativas
> a la raíz del repo.
>
> **Base**: worktree `feature/185-mobile-docs-upload-form-polish` en
> `44acd74b` (origin/main con #175, #178, #179 y #183 mergeadas). Base
> congelada: todo número de la tabla «Base medida» se vuelve a medir en el paso
> H0 de `tasks.md`.
>
> **Origen** (texto literal del humano, 2026-10-15, al firmar la prueba de humo
> R11 de #175): «en otra feature son pequeños cambios cuando subo un documento
> selecciono el documneto pero el formulario se queda en la screen de los
> documentos tambien mejorar los espacios de los inputs el boton de subir
> documento y cancelar estan pegados». La descripción de #185 en
> `feature_list.json` es la fuente de verdad del alcance.
>
> Rige `docs/ui-guidelines.md` (C8 de `CHECKPOINTS.md`).
>
> **Esta spec tiene UNA decisión abierta que bloquea la implementación: P1,
> dónde vive el formulario.** El humano la responde en §Aprobación marcando
> una sola casilla. Los requisitos que dependen de ella (R2, R3, R4, R10)
> están redactados para cada rama; solo rige la rama marcada. El resto (R1,
> R5 a R9, R11) es común a todas las ramas.

## Decisiones del humano (no se reabren)

| Decisión | Respuesta literal | Qué fija en esta spec |
|---|---|---|
| Alcance | «tres cambios» de la descripción de #185 | formulario fuera de la lista, espacio entre inputs, espacio entre los dos botones |
| Errores de validación | «van en #186» (descripción de #185) | no se toca cómo ni dónde se muestra `docs-action-error`; ver §Fuera de alcance |
| Smoke | «Smoke humano en dev build de Android» | R11, con casilla propia |

La ubicación del formulario **no** está decidida: es P1.

## Convenciones de esta spec

- **Comentarios de trazabilidad** en tests y código: siempre `#185 Rn`, nunca
  `#185` suelto. El `HEX_LITERAL` de `src/__tests__/design-drift.test.ts` lo
  trata como color hexadecimal; solo exime `#NNN R<n>`.
- Cada `describe` de test nombra su R-id: `describe('#185 Rn: ...')`.
- Los tests aseveran **literales** (clases, ids, cadenas), nunca contra un
  símbolo importado de producción.
- RNTL 14: `await fireEvent...` y `await act(...)` siempre; el `renderRouter`
  se espera con `await app;`.
- Se cuenta por **hijos** del contenedor, no por `testID` suelto: el
  inventario de hijos del formulario es el de R5 y el de los botones el de R7.
- Ningún `testID` nuevo empieza por `doc-` (el selector `/^doc-/` de
  `src/screens/docs/index.test.tsx` cuenta filas). Los nuevos empiezan por
  `docs-`.
- `Fichero-F` y `Test-F` se leen según la rama de P1: en las ramas A y B el
  formulario vive en un fichero distinto (tabla en R2 y R3). Para R5 a R9, el
  fichero que contiene el formulario es **Fichero-F** y su test es **Test-F**.
- Sin dependencias nuevas. `@expo/ui` y `@gorhom/bottom-sheet` ya están en
  `package.json`; la rama B solo importa `@expo/ui/community/bottom-sheet`.
- Todo trabajo móvil carga `expo:expo-overview` (Claude) o los equivalentes de
  Codex de `.claude/agents/leader.md` §Catálogo real de skills de Codex.

## Base medida (44acd74b)

Desde `mobile-pet-tracker/`. «Valor» es la salida real; H0 de `tasks.md`
vuelve a ejecutarlas.

| Id | Comando | Valor |
|---|---|---|
| B1 | `git rev-parse --short HEAD` | `44acd74b` |
| B2 | `grep -cF '<View testID="docs-upload-form">' src/screens/docs/index.tsx` | `1` (el contenedor del formulario no lleva `className`) |
| B3 | `grep -cE '<TextField [^>]*className' src/screens/docs/index.tsx` | `0` (ningún `TextField` lleva `className`) |
| B4 | `grep -cF 'docs-upload-actions' src/screens/docs/index.tsx` | `0` (ancla negativa: no existe contenedor de botones) |
| B5 | `grep -rnF 'docs-upload-actions' src \| wc -l` | `0` |
| B6 | `grep -rnF 'docs-upload' src/app \| wc -l` | `0` (no hay ruta de subida) |
| B7 | `ls src/app/pets/\[petId\]/` | `docs.tsx`, `geofence-editor.tsx`, `geofences.tsx` |
| B8 | `ls src/screens \| grep -c 'docs-upload'` | `0` |
| B9 | `grep -cF 'rounded-xl bg-accent border-b-4 border-black/25' src/screens/docs/index.tsx` | `1` (botón «Subir documento») |
| B10 | `grep -cF 'rounded-xl border-2 border-b-6 border-lip-gray bg-surface' src/screens/docs/index.tsx` | `1` (botón «Cancelar») |
| B11 | `grep -cF "bottom-sheet" src/screens/docs/index.tsx` | `0` |
| B12 | `grep -rn "@expo/ui/community/bottom-sheet" src --include=*.tsx -l` | solo `src/screens/reminders/index.tsx` y su test: la hoja de Recordatorios no contiene ningún input |
| B13 | `grep -cE "^\s*it(\.each\(\|\()" src/screens/docs/index.test.tsx` | `59` |
| B14 | `grep -cF 'docs-upload-form' src/screens/docs/index.test.tsx` | `20` |
| B15 | `grep -cF "src/screens/docs/index.tsx" src/__tests__/ui-copy-table.ts` | `29` filas; las de `// #158 R12` (`docs.upload` x3, `docs.type`, `docs.name`, `docs.date`, `docs.datePlaceholder`, `docs.vet`, `docs.cancel`, `docs.errorFileFormat`, `docs.errorFileTooLarge`, `docs.errorInvalidForm`, `docs.errorUploadForbidden`, `docs.errorUploadFailed`, `common.cannotReachServer`, `common.somethingWentWrong`) incluyen las del formulario |
| B16 | `grep -cF "docs-upload-cancel" src/__tests__/consistency-classnames.test.ts` | `2` (receta secundaria `outline` y la lista de botones `outline` sin `variant` explícito) |
| B17 | `grep -cF "'screens', 'docs', 'index.tsx'" src/__tests__/consistency-classnames.test.ts` | `4` |
| B18 | `grep -E '^### §2\.[0-9]+' ../specs/mobile-ui-language/design.md \| tail -1` | `### §2.34 — Añadidos por #178 — Recordatorios del canvas` (esta spec no añade copy: no se toca) |
| B19 | `grep -rnE "ByTestId\(/\^docs-" src \| wc -l` | `0` (ningún selector por prefijo `docs-` que un testID nuevo pueda colar) |
| B20 | `ls node_modules/heroui-native/package.json node_modules/@expo/ui/package.json` | **no existen en este worktree** (sin `bun install`): ni la anatomía de `TextField` ni el `.d.ts` de la hoja están medidos. H0 los mide (ver R6, R3) |

Hechos del código que la spec usa (anclar por contenido, no por línea):

- El formulario es `{selectedDocument ? (<View testID="docs-upload-form"> ...`
  y contiene, en este orden: `docs-upload-file` (Text con el nombre del
  archivo), cuatro `TextField` (`docs-type-input`, `docs-name-input`,
  `docs-date-input`, `docs-vet-input`), `docs-upload-submit` y
  `docs-upload-cancel`. Nada lleva `gap`, `margin` ni `padding`: por eso los
  inputs y los dos botones salen pegados.
- Los tres puntos de entrada a la subida (`docs-upload` zona,
  `docs-empty-action`, y el submit) solo se pintan con `isOwner`. El
  formulario solo existe con `selectedDocument !== null`.
- El flujo de `pickDocument` valida formato (`resolveDocumentContentType`) y
  tamaño (`DOCUMENT_MAX_BYTES`) **antes** de fijar `selectedDocument`; esos dos
  errores (`docs.errorFileFormat`, `docs.errorFileTooLarge`) ocurren al elegir
  y no en el formulario.
- `submitDocument` termina con `docs.refetch()`, `setFilter('all')` y
  `cancelUpload()` (que vacía `selectedDocument`, `type`, `name`, `date`,
  `vet` y `actionError`).

## Requisitos

### R1. El formulario ya no está en la lista (común a todas las ramas)

WHEN el owner elige un archivo válido (PDF, JPEG o PNG de hasta
`DOCUMENT_MAX_BYTES`) con el selector, THE SYSTEM SHALL NOT renderizar el
nodo `docs-upload-form` como descendiente del `ScrollView` `screen-docs` ni
del `KeyboardAvoidingView` `docs-keyboard-avoider` de `DocsScreen`.

**Test** — `src/screens/docs/index.test.tsx` › `#185 R1: el formulario no es
hijo de la lista`. Fixture: owner con un documento, selector que devuelve un
PDF de 1 KB. Tras `await fireEvent.press(docs-upload)` y esperar a que el
selector responda: `within(screen.getByTestId('screen-docs')).queryByTestId(
'docs-upload-form')` es `null` **y**
`within(screen.getByTestId('docs-keyboard-avoider')).queryByTestId(
'docs-upload-form')` es `null`. Segunda fixture, sin documentos
(`EmptyState`), pulsando `docs-empty-action`: mismas dos aserciones. Mutación
que debe ponerlo rojo: reinsertar el `<View testID="docs-upload-form">` dentro
del `ScrollView`.

### R2. Rama A (P1 = A): pantalla propia

Solo rige si el humano marca A en §Aprobación.

Nombres exactos:

| Pieza | Ruta | Símbolo |
|---|---|---|
| Ruta delgada | `src/app/pets/[petId]/docs-upload.tsx` | `DocsUploadRoute` (export default) |
| Pantalla | `src/screens/docs-upload-form/index.tsx` | `DocsUploadFormScreen({ petId })` |
| Test-F | `src/screens/docs-upload-form/index.test.tsx` | — |
| Registro en el Stack | `src/app/_layout.tsx` | `<Stack.Screen name="pets/[petId]/docs-upload" options={{ ...headerOptions, title: '' }} />`, junto a la de `pets/[petId]/docs` |

- **R2.1** WHEN `pickDocument` acepta un archivo, THE SYSTEM SHALL llamar a
  `router.push` exactamente una vez con
  `{ pathname: '/pets/[petId]/docs-upload', params: { petId, uri, name,
  mimeType, size, contentType } }`, todos los valores `string` (`size` como
  `String(asset.size ?? 0)`; `mimeType` como `asset.mimeType ?? ''`) y SHALL NOT
  fijar `selectedDocument` en `DocsScreen` (el estado `selectedDocument` y el
  formulario salen de `docs/index.tsx`). **Test** — `src/screens/docs/index.test.tsx
  › #185 R2.1: elegir archivo navega a la pantalla del formulario`: `it.each`
  PDF, JPEG, PNG (tres `contentType` distintos); aserta los params literales
  de cada uno, `router.push` llamado 1 vez, y que `docs-upload` (la zona)
  sigue pintada. Un archivo de formato no admitido o mayor que el tope SHALL
  NOT navegar: `it.each` de los dos casos, `router.push` con 0 llamadas y
  `docs-action-error` con el texto de `docs.errorFileFormat` /
  `docs.errorFileTooLarge` (el literal en inglés del catálogo, no el símbolo).
- **R2.2** WHEN `DocsUploadFormScreen` monta con esos params, THE SYSTEM
  SHALL pintar `docs-upload-form` con `docs-upload-file` mostrando `name` y
  los cuatro campos con los mismos `testID` y las mismas props que hoy
  (`maxLength` 40, 120, sin tope, 120; `placeholder` `docs.datePlaceholder`;
  fecha inicial `civilTodayIso`). La pantalla lleva el `KeyboardAvoidingView`
  `docs-upload-keyboard-avoider` (`behavior="padding"`,
  `keyboardVerticalOffset` = `HeaderHeightContext`) y el `ScrollView`
  `screen-docs-upload` con `keyboardShouldPersistTaps="handled"` y
  `contentContainerStyle` `padding 24`, `gap 16`, `paddingBottom
  insets.bottom + 24` (enmienda A11: pantalla empujada con cabecera nativa).
  **Test** — Test-F › `#185 R2.2: la pantalla monta el formulario con los
  params`.
- **R2.3** WHEN la subida termina con éxito (`confirmPetDocumentUpload`
  resuelve), THE SYSTEM SHALL llamar a `router.dismissTo` una vez con
  `{ pathname: '/pets/[petId]/docs', params: { petId, uploaded:
  String(Date.now()) } }`; `DocsScreen` recibe `uploaded` por prop (la ruta
  delgada lo lee de `useLocalSearchParams`) y, cuando cambia a un valor no
  vacío, llama a `docs.refetch()` y `setFilter('all')`. **Tests** — Test-F ›
  `#185 R2.3: una subida correcta vuelve a la lista` (aserta `dismissTo` con
  los params y `uploaded` casando `/^\d+$/`) y `src/screens/docs/index.test.tsx
  › #185 R2.3: la lista refresca y vuelve a «Todos» al recibir uploaded`
  (fixture: filtro «Vacunas» activo, se re-renderiza con `uploaded="1"`;
  `refetch` llamado 1 vez y «Todos» seleccionado; con `uploaded` sin cambiar
  no se llama de nuevo. Segunda fixture con `uploaded=""`: no refetch).
- **R2.4** WHEN el owner pulsa `docs-upload-cancel` y no hay subida en curso,
  THE SYSTEM SHALL llamar a `router.back()` una vez y NOT llamar a
  `router.dismissTo`. **Test** — Test-F › `#185 R2.4: cancelar vuelve atrás`.
- **R2.5** IF `DocsUploadFormScreen` monta sin `uri` o sin `name` en los
  params (enlace profundo roto), THEN THE SYSTEM SHALL llamar a `router.back()`
  y NOT pintar `docs-upload-form`. **Test** — Test-F › `#185 R2.5: params
  ausentes`: `it.each` de los dos casos (sin `uri`, sin `name`).
- **R2.6** THE SYSTEM SHALL mover a `DocsUploadFormScreen` los estados y
  funciones de la subida (`type`, `name`, `date`, `vet`, `uploading`,
  `submitDocument`, y el error `docs-action-error` de los fallos de subida y
  de formulario inválido). `DocsScreen` conserva solo `pickDocument` y el
  error de elegir archivo (`docs-action-error` con `errorFileFormat` /
  `errorFileTooLarge`). **Test** — cubierto por R9 (flujo conservado) en
  Test-F y por R2.1 en la lista.

### R3. Rama B (P1 = B): hoja inferior

Solo rige si el humano marca B en §Aprobación.

- **R3.1** THE SYSTEM SHALL pintar, dentro de `DocsScreen` pero **fuera** del
  `ScrollView` `screen-docs` (hermano suyo, bajo el `KeyboardAvoidingView` o
  junto a él), un contenedor `docs-upload-host` con un
  `BottomSheet` de `@expo/ui/community/bottom-sheet` con
  `index={selectedDocument === null ? -1 : 0}`, `enablePanDownToClose` y
  `snapPoints` fijados en `design.md` §3.B tras la medición de H0 (B20). El
  `docs-upload-form` va dentro de su `BottomSheetView`. **Test** —
  `src/screens/docs/index.test.tsx › #185 R3.1: la hoja se abre al elegir
  archivo` con el doble de `@expo/ui/community/bottom-sheet` copiado de
  `src/screens/reminders/index.test.tsx` (se localiza con `grep -n
  "community/bottom-sheet" src/screens/reminders/index.test.tsx`): antes de
  elegir, `props.index` del doble es `-1`; tras elegir, `0`; tras
  `docs-upload-cancel`, `-1`.
- **R3.2** WHILE `uploading` es verdadero, THE SYSTEM SHALL NOT permitir que
  la hoja se cierre por gesto: `enablePanDownToClose` es `false` y `onClose`
  no vacía el formulario. WHEN no hay subida en curso y la hoja se cierra por
  gesto, THE SYSTEM SHALL ejecutar `cancelUpload`. **Test** — `#185 R3.2:
  cierre por gesto`: lee `props.enablePanDownToClose` y llama a `props.onClose`
  del doble con `uploading` verdadero (no vacía) y falso (vacía).
- **R3.3** WHEN la subida termina con éxito, THE SYSTEM SHALL cerrar la hoja
  (`index` vuelve a `-1`), refrescar la lista y volver a «Todos» (el
  comportamiento actual, ahora con la hoja). **Test** — `#185 R3.3`.
- **R3.4** THE SYSTEM SHALL mantener el `KeyboardAvoidingView`
  `docs-keyboard-avoider` y el test `#158 R11` del padding 291 sin cambios, y
  el teclado de la hoja se verifica solo en R11 (la hoja de Recordatorios no
  contiene inputs, B12: no hay precedente de inputs en hoja en el repo).

### R4. Rama C (P1 = C): otra ubicación

Solo rige si el humano marca C y describe la ubicación en la línea de
§Aprobación. **La spec no la redacta**: si el humano elige C, el leader
devuelve la spec a `spec_author` para redactar R4 con esa descripción antes de
la firma. Hasta entonces R4 está vacío y la implementación no arranca.

### R5. Espacio entre campos (común)

THE SYSTEM SHALL pintar el contenedor `docs-upload-form` con
`className="gap-4"` (16 px) y NO añadir `margin` ni `padding` a los
`TextField`. Los hijos de `docs-upload-form`, en este orden, son exactamente:
`docs-upload-file`, `TextField` (tipo), `TextField` (nombre), `TextField`
(fecha), `TextField` (veterinario) y `docs-upload-actions`.

**Test** — Test-F › `#185 R5: espacio entre campos`. Aserta (a)
`props.className` de `docs-upload-form` es exactamente `gap-4`; (b) la
lista de hijos (por `testID` o `View`/`TextField` por tipo) es la de arriba,
con **cuatro** `TextField` y un solo `docs-upload-actions`; (c) ningún
`TextField` lleva `margin` ni `padding` en `className`. Mutaciones: quitar
`gap-4` (rojo en a), pasar a `gap-3` (rojo en a), mover el `Text` de archivo
dentro del primer `TextField` (rojo en b).

Valor: **16** viene de `NuevoRecordatorio.dc.html` (gap 16 entre campos) y de
la regla A11 de la carta (`gap 16`); `Registro` y `NuevaMascota` dibujan 12.
El canvas **no dibuja** el formulario de Documentos (`Documentos.dc.html` no lo
incluye), así que 16 vs 12 es un valor **por confirmar** (P2).

### R6. Espacio entre etiqueta e input (común)

Cada uno de los cuatro `TextField` SHALL llevar `className="gap-1.5"` (6 px),
el valor que dibujan `Registro`, `NuevaMascota` y `NuevoRecordatorio` entre
etiqueta e input. SI el paso H0 mide en `heroui-native` instalado que
`TextField` ya separa etiqueta e input 6 px por su cuenta, entonces R6 se
reduce a un test que lo asevera y NO añade clase; si lo separa otro valor, o
cero, `className="gap-1.5"` rige. **El resultado de H0 no se infiere: lo mide
el implementer (B20, `tasks.md` T0.4) y lo anota en `progress/impl_*.md`.**

**Test** — Test-F › `#185 R6: espacio etiqueta-input`: `it.each` de las cuatro
filas (tipo, nombre, fecha, veterinario) que aserta, por campo, el
`className` del `TextField` (literal `gap-1.5`) y que cada `Label.Text`
precede a su `Input` (orden por hijos del `TextField`). Valor **por
confirmar** (P3) hasta el smoke.

### R7. Los dos botones separados (común)

THE SYSTEM SHALL envolver `docs-upload-submit` y `docs-upload-cancel` en un
`View testID="docs-upload-actions"` con `className="gap-3"` (12 px), con los
hijos exactamente en este orden: `docs-upload-submit`, `docs-upload-cancel`.

**Test** — Test-F › `#185 R7: botones separados`. Aserta
`props.className` de `docs-upload-actions` es exactamente `gap-3`, sus hijos
son `['docs-upload-submit', 'docs-upload-cancel']` y `docs-upload-actions` es
el último hijo de `docs-upload-form`. Mutaciones: quitar el contenedor (rojo
por `getByTestId`), invertir el orden (rojo en hijos), `gap-2` (rojo en clase).

Valor: **12** se elige por analogía (ningún artboard dibuja una pareja
primario + cancelar). Queda **por confirmar** (P2).

### R8. Clases que esta feature NO toca (común)

THE SYSTEM SHALL conservar, byte a byte, las clases de los dos botones, de las
etiquetas y de los inputs; son territorio de #177 (receta de botón), #186
(errores de validación) y #187.

| Nodo | `className` exacto que se conserva |
|---|---|
| `docs-upload-submit` | `rounded-xl bg-accent border-b-4 border-black/25` (+ `isDisabled`) |
| `Button.Label` de submit | `font-bold text-accent-foreground` |
| `docs-upload-cancel` | `rounded-xl border-2 border-b-6 border-lip-gray bg-surface`, `variant="outline"` |
| `Button.Label` de cancelar | `font-semibold` |
| `Label` y `Label.Text` de los 4 campos | `text-2xs font-semibold text-foreground` |
| los 4 `Input` | `rounded-xl bg-default` |

**Test** — Test-F › `#185 R8: clases de botón, etiqueta e input intactas`:
`it.each` de las seis filas con el literal de la tabla y `toBe` (no
`stringContaining`). Esto bloquea a #177/#186/#187: la primera que mergee
actualiza estos literales con una enmienda (ver §Solape).

### R9. El flujo de subida se conserva (común)

THE SYSTEM SHALL conservar el comportamiento que cubren hoy `#158 R5` a
`#158 R11` de `src/screens/docs/index.test.tsx`, ahora ejercido contra el
formulario en su sitio nuevo: selector con PDF/JPEG/PNG, campos y valores,
cancelar vacía y cierra, validación antes de leer/crear, éxito refresca y
vuelve a «Todos», ambos botones bloqueados durante la subida, cada fallo
conserva el formulario y sus valores, y el formulario se aparta del teclado en
Android.

Test-F recibe esos `describe` renombrados `#185 R9 (antes #158 R5): ...` etc.
(los nueve nombres, sin perder ni un `it`). En la rama A se **mueven** del
fichero de la lista al de la pantalla del formulario; en la rama B se quedan
y cambian de arnés (el doble de la hoja). El recuento de `it` de
`docs/index.test.tsx` y del Test-F se fija en `tasks.md` §Recuento. El `it`
`#158 R11` (padding 291) migra a `#185 R9`: en A se pregunta por
`docs-upload-keyboard-avoider`; en B sigue en `docs-keyboard-avoider`.

### R10. Deltas de los candados de #175 y de la carta

THE SYSTEM SHALL mantener verdes `ui-language`, `ui-copy-table`,
`consistency-classnames`, `design-drift`, `legibility-classnames` y
`detail-stack` con los cambios mínimos de la tabla. Es un requisito
**compuesto**: se verifica con sus filas, no con un test propio; cada fila
tiene su test (nombrado en `traceability.md`).

| Δ | Fichero | Rama A | Rama B |
|---|---|---|---|
| Δ1 | `src/__tests__/ui-language.test.ts` (`SCREEN_FILES`, el `toHaveLength(19 + 2 + 1 + ...)` de «no deja ningún valor fijo del catálogo...») | **+1** (fichero nuevo `screens/docs-upload-form/index.tsx`; el ancla es el comentario `// #185 R2` añadido al sumando) | sin cambio |
| Δ2 | `src/__tests__/ui-copy-table.ts` | las filas `// #158 R12` cuyo `t()` se muda al fichero nuevo pasan a `file: 'src/screens/docs-upload-form/index.tsx'`; el total de filas no cambia salvo que una clave se use en los dos ficheros (entonces una fila por fichero) | sin cambio |
| Δ3 | `src/__tests__/consistency-classnames.test.ts` (`docs-upload-cancel` en dos listas, y la entrada `[join('screens','docs','index.tsx'), 1]` del recuento de `rounded-xl bg-accent`) | las entradas de `docs/index.tsx` que se mudan pasan a la ruta nueva; las cuentas globales (`primaryRadius`, `border-b-4`) NO cambian de valor, solo de fichero | sin cambio |
| Δ4 | `src/app/__tests__/detail-stack.test.tsx` y `detail-stack.guard.test.tsx`, `src/app/__tests__/layout.test.tsx` | una fila nueva `['pets/[petId]/docs-upload.tsx', null, '../../../screens/docs-upload-form']` y un `Stack.Screen` más en el recuento de pantallas empujadas | sin cambio |
| Δ5 | `docs/conventions.md` §Dimensiones (lista A11) y `docs/ui-guidelines.md` (misma lista) | `pets/[petId]/docs-upload` se añade a la lista de pantallas empujadas con cabecera nativa; si algún test bloquea el texto de la lista, sube con su delta | sin cambio |
| Δ6 | `src/screens/docs/index.test.tsx` `docsChildren()` | los órdenes que hoy incluyen el formulario lo pierden | los órdenes pierden el formulario y ganan `docs-upload-host` |

H0 recorre con `grep` cada fichero antes de firmar los números (memoria
«candado de catálogo omitido»): `grep -rn "docs" src/__tests__/*.ts*
src/app/__tests__/*.tsx` y `grep -rn "geofence-editor"` (como ancla de la
lista A11) enumeran los sitios.

### R11. Prueba de humo humana (dev build de Android)

Se hace en el **dev build de Android** (no Expo Go), en claro y en oscuro, con
una mascota propia. La lista está en `traceability.md` §Prueba de humo. No es
código: cierra con la casilla propia de §Aprobación («Prueba de humo R11»).

## Deltas de candados (resumen)

Ver R10. Ningún candado se afloja a prefijo ni se borra. Las tres cuentas que
dependen del número de pantallas con receta (`primaryRadius`, `border-b-4`,
`rounded-xl bg-accent`) **no cambian de valor**: el formulario cambia de
fichero (rama A) o no se mueve (rama B), no de recuento.

## Solape con otras features

- **#186** (`mobile-forms-validation-global`) toca el mismo formulario
  (`docs-action-error`, errores por campo) y se escribe después de #185. Esta
  feature NO toca cómo se muestran los errores de validación; solo mueve de
  sitio el `docs-action-error` de los fallos de subida en la rama A (R2.6).
- **#177** (receta de botón) sigue `pending`. R8 fija las clases de los dos
  botones; la receta nueva de #177 las sustituye con una enmienda de este
  test. #185 no añade ninguna clase a un botón.
- **#187** (tamaños de letra de HeroUI) toca `Label`/`Label.Text`: R8 las
  congela con la misma salvedad.
- **#175** está mergeada; sus candados son la base de R10.

## Fuera de alcance

| # | Ítem | Clase | Nota |
|---|---|---|---|
| F1 | Errores de validación del formulario (texto, componente global, posición) | [D] feature #186 | no se toca |
| F2 | Nueva receta de botones (alto 56, radio 16, 17/800, sombra de labio) | [D] feature #177 | R8 la candada |
| F3 | Tamaño de letra de etiquetas e inputs | [D] feature #187 | R8 los congela |
| F4 | Alto y radio de los inputs al canvas (50/12, 52) | [D] ninguna | el canvas no dibuja este formulario; `rounded-xl bg-default` no se toca |
| F5 | Copy nuevo | [F] | esta feature no añade claves; `specs/mobile-ui-language/design.md` no se toca |
| F6 | Cambiar de qué campos se compone el formulario o sus topes | [F] | R2.2 conserva `maxLength` y `placeholder` |
| F7 | Selector de fecha nativo | [F] | sigue siendo texto libre (`civilTodayIso`) |
| F8 | Backend | [F] | ninguna llamada de API nueva |

## Preguntas abiertas

**P1. ¿Dónde vive el formulario tras elegir el archivo?** (bloquea la
implementación; el humano la responde en §Aprobación).

| Opción | Qué es | Consecuencias |
|---|---|---|
| **A. Pantalla propia** | `pets/[petId]/docs-upload`, empujada sobre el Stack con cabecera nativa | Ruta delgada + `src/screens/docs-upload-form/` + `Stack.Screen` en `_layout`. Entra en la lista A11 de la carta (padding 24, gap 16). `SCREEN_FILES` +1, `ui-copy-table` re-apuntada, `detail-stack` +1 fila, y la lista A11 de `docs/conventions.md` y `docs/ui-guidelines.md`. El archivo elegido viaja por params de ruta (cadenas) y el éxito vuelve con `router.dismissTo` y un nonce `uploaded`. Los tests del formulario (`#158 R5`, `R6`, `R7`, `R8`, `R9` y `R11`: 18 `it`; `R10` se queda en la lista; 20 líneas con `docs-upload-form`) se mudan de fichero. El `KeyboardAvoidingView` ya resuelto en Docs (`HeaderHeightContext`) se copia; no hay riesgo nuevo de teclado. Mismo patrón que `add-pet`, `add-reminder`, `geofence-editor`, `weight-log`: todos los formularios con inputs de la app son pantallas propias. #186 aplicará sus errores por campo en una pantalla con su propio árbol. Coste: el de más superficie. |
| **B. Hoja inferior** | `BottomSheet` de `@expo/ui/community/bottom-sheet` dentro de `DocsScreen` | Sin ruta nueva ni `_layout`; `SCREEN_FILES`, `ui-copy-table` y `detail-stack` no cambian. Menos superficie. Pero **no hay precedente de inputs dentro de una hoja** (la de Recordatorios no tiene ninguno, B12) y el `TextField` de HeroUI no es el `BottomSheetTextInput` de @gorhom: el teclado de Android puede tapar los campos, y eso solo lo ve el smoke (R11). Hay que duplicar el doble de la hoja en el test de Docs. `@expo/ui` no está instalado aquí (B20): las props del wrapper no están medidas. Cuatro inputs y dos botones en una hoja de ~50 a 90 % es apretado. |
| **C. Otra** | p. ej. sustituir la lista por el formulario en la misma pantalla (estado), o un modal | No redactada. Si se elige, el humano la describe y el spec_author redacta R4. Una variante «mismo screen, sin lista» no cumple lo que pidió el humano si el formulario «se queda en la screen de los documentos». |

**Recomendación: A.** Es la que menos riesgo de teclado tiene y la que sigue el
patrón de todos los formularios de la app; la hoja B es válida si el humano
prefiere no salir de la lista, a costa del riesgo de teclado en Android. Se
recomienda, no se infiere: **ninguna rama rige hasta que el humano marque su
casilla**.

**P2. Valores de espacio por confirmar contra el canvas**, que no dibuja este
formulario: entre campos `gap-4` (16: `NuevoRecordatorio`; `Registro` y
`NuevaMascota` usan 12); entre botones `gap-3` (12: por analogía). Por defecto
rige lo escrito en R5 y R7. Si el humano ve el smoke y quiere otro valor,
cambia R5/R7 y sus tests por enmienda.

**P3. Espacio etiqueta-input** `gap-1.5` (6 px, los tres artboards). Por
defecto rige R6 (medido en H0).

## Aprobación

Rama de P1 (marca **una**):

- [x] P1 = A, pantalla propia
- [ ] P1 = B, hoja inferior
- [ ] P1 = C, otra (descríbela): ____

- [x] Aprobado por humano (Notion, `Estado del gate` = Aprobado, página `3fb6115a9b2781f4a80cc3e7aacbad62`, última edición 2026-10-18T18:39Z)

## Prueba de humo humana (R11)

- [x] Prueba de humo R11 superada por humano (fecha: 2026-10-18)
