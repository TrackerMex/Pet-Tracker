---
feature: "mobile-add-pet-two-steps"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-add-pet-two-steps]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Solo capa de presentación móvil: no hay cambios en domain, application ni backend.

## Decisiones técnicas

- **Un solo componente, un solo estado, un `step`** (R3, R4, R8, R9). `AddPetScreen`
  sigue siendo una pantalla de una ruta (`pets/add`) y gana `const [step, setStep] =
  useState<1 | 2>(1)`. Todos los valores del formulario ya viven en ese componente, por lo
  que «atrás conserva los datos» es gratis: cambiar de paso solo cambia qué nodos se montan.
  El JSX se divide en dos funciones locales del fichero (`renderStep1`, `renderStep2`,
  o dos componentes internos que reciben lo que necesitan por props); no se crea un
  fichero por paso. Si el fichero supera lo razonable al implementar, el refactor (3) puede
  extraer `StepIndicator` dentro del mismo fichero, nunca a `components/` (Fuera de alcance).
- **Paso 2 desmonta el 1** (R4, R8): los campos del otro paso no se montan (`queryByTestId`
  nulo), no se ocultan con estilos. Razón: los tests de R4/R8 pueden afirmar ausencia y un
  campo oculto seguiría recibiendo foco de accesibilidad.
- **`ScrollView key={step}`** (R6): al cambiar de paso el `ScrollView` se remonta y empieza
  arriba; evita un `ref` y un `scrollTo`. No lleva aserción de test (el offset no es
  observable en Jest); lo verifica el humano en el smoke (R12). Contrapartida: el `ScrollView`
  se remonta y el foco del teclado se pierde, que es lo deseado al cambiar de paso.
- **Atrás con `usePreventRemove`** (R9). `usePreventRemove(prevent, callback)` de
  `expo-router/react-navigation` intercepta los tres orígenes de «atrás» (chevrón de la
  cabecera nativa, botón físico de Android, gesto de iOS) con una sola llamada y deja la
  cabecera nativa (`title: ''`) intacta. `prevent = step === 2 && !submitting &&
  celebratePetName === null && !leaving`. El callback hace `setStep(1)` y limpia errores;
  ignora el evento si `submitting`. Fuera de un navigator lanza, por lo que los tests mockean
  el módulo (ver R9 de requirements: `jest.fn()` + `jest.requireActual`, conservando
  `HeaderHeightContext` que la pantalla y el test ya importan del mismo módulo y
  `__esModule: true`, nota de memoria «doble de Reanimated sin __esModule»).
- **Salida tras guardar sin carrera** (R9, R10). `usePreventRemove` evalúa `prevent` en el
  render; si `handleSubmit` llamara `router.back()` en el mismo tick en que `step` sigue en
  2, el listener todavía bloquearía la salida. Solución: `handleSubmit`, cuando no hay
  celebración, hace `setLeaving(true)` y un `useEffect(() => { if (leaving) router.back(); },
  [leaving])` llama `router.back()` ya con `prevent === false`. Misma garantía para los dos
  botones de la celebración, que se muestran con `celebratePetName !== null` (prevent falso
  por construcción) y llaman `router.replace`/`router.back` directamente. El test (e) de R9
  lo prueba.
- **`SegmentedControl` compartido en `src/components/`** (R5), no inline: lo usan tres
  campos de esta pantalla y es el componente que la carta nombra para otras pantallas
  (selectores del canvas en Alertas, #189). Genérico en `T extends string`; `allowEmpty`
  sustituye a la lógica de `OptionalChip` (pulsar la opción activa la desactiva) para sexo y
  tamaño y la desactiva para especie. Conserva los testID que reciben los tests de hoy.
  `OptionalChip` se queda para Esterilizado/a y modo de edad (el canvas no los dibuja).
- **Burbuja como `View`, no `Card`** (R4): `heroui-native` `Card` lleva `rounded-card` y
  `twMerge` no lo sustituye por `rounded-tile` (el mismo problema que #178 resolvió para
  `rounded-22`). `View` + `CONTINUOUS_CORNER` es la receta de las filas del resto de pantallas.
  La cola es otro `View` absoluto rotado 45º con el mismo fondo; `-left-1.5` y `top-5.5` salen
  del `left:-6px; top:22px` del canvas con la escala de 4 px de Tailwind.
- **CTA dentro del scroll** (R7, R8): el canvas lo fija abajo con un degradado, que exigiría
  `expo-linear-gradient` (vetado). Ambos CTAs son el último hijo del `ScrollView`, con la
  receta de #177 (`chunkyLip.primary`, `h-14 rounded-16 bg-accent`) para que
  `chunky-cta-canvas-fidelity.test.ts` los reconozca por fila.
- **`validateAddPetBasics` en `form-rules.ts`** (R7): función pura nueva, sin I/O, que
  devuelve el mismo `RuleIssue` de nombre que ya produce `validateAddPet`. Para no duplicar la
  regla, `validateAddPet` la **llama** y mezcla el resultado con los de edad; su firma y su
  salida no cambian (las 89 aserciones de #186 R2 son el candado). Capa: `utils` (reglas
  puras de formulario, como `account-rules.ts`).
- **Cabecera nativa con `title: ''`** (R2): la cabecera conserva el botón atrás nativo
  (D-H de la carta, precedente `add-reminder`) y el título pasa al contenido, que es donde el
  canvas lo dibuja junto con «1 de 2». Con `title: ''` el título no se duplica.
- **Sin animaciones** (Fuera de alcance): la entrada `rise` y el `fill` del canvas exigirían
  constantes nuevas en `src/theme/motion.ts` y pruebas de `toHaveAnimatedStyle`; el humano no
  las ha pedido para esta feature.
- **Candados por contenido, no por línea** (R11): cada guard se mueve en su propio commit
  (test rojo con el inventario nuevo, ajuste verde), con anclas por literal (§Base medida de
  requirements). El implementer re-mide en H0.

## Salida tras guardar

Orden en `handleSubmit` tras `createPet` ok: `selectPet` → `uploadSelectedPhoto` →
`wasFirst ? setCelebratePetName(name) : setLeaving(true)`. El `useEffect` de salida llama
`router.back()`. Nada más cambia respecto al flujo de #171/#72.

## Deuda del picker (#72, `mobile-add-pet-photo-test-flake`)

#72 dejó un único invariante: el guard `PICKER_MOCK_UNARMED` de `pressPickPhoto()`, que
lanza si el mock de `expo-image-picker` no tiene implementación. En esta feature:
(a) todo `it` que elija foto lo hace con `pressPickPhoto()` y **nunca** con
`mockLaunchImageLibrary.mockResolvedValueOnce`; (b) cada `fireEvent`/`act` va con `await`
(RNTL 14); (c) los `it` que antes elegían foto y rellenaban el formulario entero pasan a
`await goToStep2()` **después** de elegir la foto (la foto vive en el paso 1; `photoAsset`
persiste al cambiar de paso porque el estado es del componente); (d) el `beforeEach` raíz
que rearma `mockResolvedValue({ canceled: true, assets: null })` no se toca. Si en H0 la
suite de la pantalla da el rojo intermitente de #72, se guarda el log entero y se sigue la
instrucción de `specs/mobile-add-pet-photo-test-flake/requirements.md`; no se añade
`jest.retryTimes` ni se sube un timeout.

## Archivos afectados

Capa presentación (`mobile-pet-tracker/`):

- `src/screens/add-pet/index.tsx` — `step`, `leaving`, `usePreventRemove`, título, indicador,
  fila foto + burbuja, `SegmentedControl` x3, métricas y recetas de campo, `add-pet-continue`,
  paso 2 con su CTA.
- `src/screens/add-pet/index.test.tsx` — reescritura y adaptación de grupos (tabla de
  abajo) y `it` nuevos `#191 R2…R10`.
- `src/components/segmented-control.tsx` — nuevo (R5).
- `src/components/__tests__/segmented-control.test.tsx` — nuevo (R5).
- `src/app/_layout.tsx` — `title: ''` en `pets/add` (R2).
- `src/app/__tests__/layout.test.tsx` — fila `['pets/add', '']` (R2).
- `src/i18n/catalog.ts` — tres claves, una baja (R1); `es` en las mismas posiciones.
- `src/providers/__tests__/language-provider.test.tsx` — fórmula `+ 3 - 1 // #191 R1` y `it`
  `#191 R1`.
- `src/__tests__/ui-copy-table.ts` — filas de `R9_ADD_PET` (R1).
- `src/__tests__/ui-language.test.ts` — fórmula `+ 3 - 1` (R1).
- `src/utils/form-rules.ts` y `src/utils/form-rules.test.ts` — `validateAddPetBasics` (R7).
- Candados (R11), cada uno en su commit: `design-drift.test.ts`,
  `chunky-cta-canvas-fidelity.test.ts`, `consistency-classnames.test.ts`,
  `alerts-canvas-fidelity.test.ts`; nuevo `src/__tests__/add-pet-two-steps.test.ts`.

Docs: `docs/ui-guidelines.md` (Enmienda #191, R11), `specs/mobile-ui-language/design.md`
(sección nueva, R1).

Reparto: el implementer (Codex) toca `mobile-pet-tracker/` y los dos ficheros de docs
nombrados; esta spec, `progress/` y `feature_list.json` los toca el leader.

### Qué pasa con cada grupo del `index.test.tsx` actual

| Grupo | Acción |
|---|---|
| `renders the complete two-section form and deterministic preview` | Reescribir como `#191 R4` y `#191 R8` |
| `#186 R4` (`maxLength` y errores por campo) | Mantener aserciones; `maxLength` de `name`/`breed` se miden en el paso 1, los de `approx-age`/`microchip` en el 2 vía `goToStep2()` |
| `#186 R7` / envíos con errores de servidor | Llegar al paso 2 con `goToStep2()`; aserciones iguales |
| Foto (`pressPickPhoto()`, `photo-upload-error`, `#72 R4`, `R1 (mobile-jest-mock-hygiene)`) | Mantener; el selector vive en el paso 1 |
| `#90 R6` | Mantener |
| `#61 R10` (`TOUCH_SLOP` en `species-dog`, `sex-female`, `size-small`, `sterilized-true`, `age-mode-date`) | Adaptar: los tres primeros en el paso 1, los dos últimos en el 2 |
| `#62 R11` (receta de chip de especie) | Reescribir para la receta del `SegmentedControl` |
| `#62 R12` (color del placeholder) | Mantener (en el paso 1 y en el 2) |
| `#95 R5` | Reescribir como `#191 R2` |
| `#95 R6` | Reescribir como `#191 R6` |
| `#123`, `#148 R4/R8` (teclado) | Adaptar al `renderRouter`/paso correspondiente; aserciones iguales |
| `#171 R4/R5` (celebración) | Llegar con `goToStep2()`; aserciones iguales |

## Alternativas descartadas

- **Dos rutas (`pets/add` y `pets/add-step-2`)**: el estado compartido entre rutas exigiría
  un contexto o parámetros de ruta con todos los campos y la foto; atrás nativo ya conserva
  datos pero a costa de un provider nuevo. Un componente con `step` es lo mínimo.
- **Cabecera propia con chevrón en el contenido (como el canvas)**: rompe la convención D-H
  y el gesto nativo de iOS; el chevrón nativo hace el mismo trabajo.
- **`BackHandler` de React Native**: solo cubre el botón físico de Android; el gesto de iOS y
  el chevrón de la cabecera seguirían saliendo de la pantalla.
- **`useFocusEffect`/`beforeRemove` a mano**: `usePreventRemove` es el envoltorio oficial de
  ese evento y `detail-stack.test.tsx` exige 0 `useFocusEffect` en add-pet.
- **Pie fijo con `expo-linear-gradient`**: vetado por el humano; ver Desviaciones.
- **`Card` para la burbuja**: ver arriba (`twMerge` y `rounded-tile`).
- **Extraer `SegmentedControl` y la barra de pasos a un paquete de UI común antes de
  tiempo**: el selector se comparte desde el primer uso (3 en esta pantalla); la barra de
  pasos solo la usa esta pantalla y se extrae cuando haya un segundo consumidor.
- **Validar todo solo al guardar** (D4 alternativa) y **mover la edad al paso 1** (D1
  alternativa): descritas en las decisiones humanas pendientes; no se implementan salvo
  que el humano las elija.
