---
feature: "mobile-nutrition-questionnaire"
status: approved     # draft | approved
tags: [harness, spec, mobile, nutrition]
---

# #209 mobile-nutrition-questionnaire — Requisitos

## Contexto

Hoy la app no tiene formulario del perfil nutricional. «Generar plan» en Horario
acaba en 422 `NUTRITION_PROFILE_REQUIRED` para cualquier mascota nueva. Esta
feature añade un cuestionario de 4 pasos sobre el endpoint ya existente
`PUT /v1/pets/:petId/nutrition-profile`. Al guardar llama a
`POST /v1/pets/:petId/nutrition-plan/generate`. Las entradas son el estado
«sin perfil» de Nutrición y de Horario, y «Editar perfil» en Horario.

Evidencia: `progress/explore_nutrition-questionnaire-2026-10-26.md`. Plan:
`progress/plan_mejoras-producto-2026-10-26.md` (ola 2). Dependencia de
contrato: #212 R1 (`specs/nutrition-ai-structured-plan/requirements.md`).

### Canvas congelado (G1)

Los artboards están congelados en `specs/mobile-nutrition-questionnaire/canvas/`.
**Nota para el firmante:** se congelaron de la versión viva
`1793039639-fe0d` del canvas. El 2026-10-26 el leader verificó, sha256 a
sha256, que los ocho artboards son idénticos a los de la v140
(`1793036268-d302`) aprobada en G1. No hay que re-congelar.

| Artboard | sha256 |
|---|---|
| CuestionarioActividad.dc.html | cd11ebc9c388539add9b44458af4b5a09033bd6bb52b1f30eda5d85e3fe2c508 |
| CuestionarioCondicion.dc.html | 3094887c9030422f472c89d71f1c8035e80154bcca94937cea025bc622ba765b |
| CuestionarioPesoObjetivo.dc.html | d448d0dfe4d076b98883fc4d54f79545e507bb9844e1efa33251d4d264f87235 |
| CuestionarioAlimento.dc.html | ddc80bc8bb2acee73c2d41d1ed68ec4410967ef232a9f8ac35d71ff0a8380dfb |
| CuestionarioSalud.dc.html | 64123856358efad215cd42b9a4325ebb1ee0c728c80df27de33176b0c1ec3b1e |
| CuestionarioGenerando.dc.html | b6712e040d86dab57bcc76ab28bae00cc038ebf5971d9288273842b84152350f |
| HorarioEditarPerfil.dc.html | 755e21f1e41fd0685f9bfb7003e55806c9eb1a798b49b82a741916e279071411 |
| NutricionSinPerfil.dc.html | 10970d761e96b64dd2aa90375c74e1bb39df093faa0c481d378c114609a713d6 |

Verificación: `cd specs/mobile-nutrition-questionnaire/canvas && sha256sum *.html`.

### Contrato del backend (verificado contra el árbol)

`backend-pet-tracker/src/modules/nutrition/` tiene `UpsertNutritionProfileSchema`
(zod `strictObject`):

- `activityLevel`: `low | medium | high`. Obligatorio.
- `bodyCondition`: entero 1–9. Opcional.
- `targetWeightKg`: mayor que 0 y como máximo 999.99. Opcional.
- `foodType`: `dry | wet | mixed | homemade`. Obligatorio.
- `kcalPer100g`: número entre 80 y 600 (`KCAL_PER_100G_MIN`, `KCAL_PER_100G_MAX`).
  Obligatorio.
- `allergies` y `diseases`: `string[]`. Por defecto `[]`.

Reglas que la app debe cumplir:

- Los campos opcionales se **omiten**. Nunca se envían como `null`, porque
  `strictObject` daría 400.
- El upsert reemplaza el perfil entero.
- PUT nutrition-profile y POST generate son solo para owner. GET profile lo
  puede leer cualquier miembro.
- Cotas de #212 R1, que la app respeta desde ya: como máximo 20 elementos por
  array y como máximo 100 caracteres por elemento. Por encima, el PUT da 400.
- Tras #212, la respuesta de generate trae `aiStatus` y `aiProposal`.
  `generateNutritionPlan` ya tolera campos extra y esta feature no los pinta.

### Decisiones cerradas (no reabrir)

1. **Wizard de 4 pasos** con el patrón de `src/screens/add-pet/index.tsx`:
   paso en `useState`, `usePreventRemove`, KAV raíz, `ScreenHeader` con
   contador y barra de segmentos. Pasos: Actividad (1), Condición (2),
   Alimento (3), Salud (4).
2. **Peso objetivo** es un subpaso que solo aparece con condición ≥ 7
   (`BODY_CONDITION_OVERWEIGHT_MIN = 7` en el backend). El contador sigue en
   «2 de 4».
3. **La condición (BCS) es obligatoria en el wizard**, aunque el backend la
   admita omitida. En modo edición con `bodyCondition: null`, Siguiente queda
   desactivado hasta elegir una.
4. **Precargas de kcal/100 g**: Seco 350, Húmedo 90, Mixto 220, Casero 130.
   Elegir un tipo **sobrescribe** el campo con su precarga. El valor es
   editable y está acotado a 80–600 (entero).
5. **Alergias y enfermedades**: chips cerrados más «Otra» con texto libre
   (máximo 40 caracteres, con trim). Se envía el texto que muestra el chip,
   `t(clave)`. Con locale `es` es el literal español del artboard. «Carne de
   res» y «Soya» se quedan.
6. **Textos BCS**: un solo juego neutro de 9 textos, con banda de color: 1–3
   blue, 4–5 green, 6–7 amber, 8–9 rose (`CATEGORY_SLOTS`).
7. **`putJson` nuevo** en `src/api/http.ts`, con la misma firma y el mismo
   cuerpo que `patchJson`: `putJson(baseUrl, path, token, body, fetchFn)`,
   que resuelve la URL con `apiUrl(baseUrl, path)`. Solo cambia
   `method: 'PUT'`.
8. **Guardar** = PUT y luego POST generate. CuestionarioGenerando se muestra
   mientras dura y **avanza solo**: cuando generate da ok, la pantalla hace
   `router.back()`. No hay temporizadores ni duración mínima. El enlace «Ver
   el plan de Rocky» del artboard es solo del prototipo y no se implementa.
9. **Ruta y mascota**: `/nutrition-profile`, con el parámetro `petId`
   (`router.push({ pathname: '/nutrition-profile', params: { petId } })`).
   La pantalla lee `useLocalSearchParams<{ petId: string }>()`.
10. **Roles**: «Generar plan», «Crear perfil nutricional» y «Editar perfil»
    solo se pintan con `myRole === 'owner'`. Los demás roles conservan el
    texto vacío de solo lectura.
11. **Pingo** del cuestionario, de Generando y de NutricionSinPerfil:
    `assets/images/pingo-food.webp`. Los artboards usan un mismo blob y la
    pose de comida es la que ya usa el vacío de Nutrición.
12. **Iconos** de las tarjetas de actividad (`reicon-react-native`, ya
    instalado): Baja `TrendDown`, Media `Location`, Alta `TrendUp`. El check
    del radio y de Generando es `Check`. No se candadan los iconos.
13. **Desviaciones declaradas** respecto del canvas:
    - Sin la huella decorativa del escenario de NutricionSinPerfil.
    - Sin el lápiz del enlace «Editar perfil».
    - Los anillos usan `MOTION_PING_TIMING` (2400 ms), no los 2 s del
      artboard.
    - El círculo «en curso» de Generando es un `View` estático. El artboard
      lo hace girar, pero `src/theme/motion.ts` no tiene constante `MOTION_*`
      de giro, y crearla queda fuera de alcance.
    - Ninguna se candada.
14. **Copy en Voz B**, literal de los artboards. «Rocky» se sustituye por
    `{{name}}` (nombre de la mascota). Las notas de kcal de Húmedo, Mixto y
    Casero no están en el canvas y se fijan aquí, en R11.
15. **Reutilización de claves**: antes de crear una clave, Codex busca su
    valor `es` exacto con `grep -nF "'<valor>'" src/i18n/catalog.ts`, desde
    `mobile-pet-tracker/`. Si ya existe una clave con ese valor exacto, se
    reutiliza. Reutilizaciones ya fijadas (la lista es cerrada: R23 cuenta
    con ellas):
    - `addPet.stepProgress` ('{{current}} de {{total}}').
    - `addPet.optional` ('Opcional').
    - `mealSchedule.nutritionProfile` ('Perfil nutricional').
    - `mealSchedule.noNutritionProfileYet` ('Aún no hay perfil nutricional').
    - `profile.editProfile` ('Editar perfil'), texto del enlace
      `nutrition-profile-edit` de Horario (R20).
    - `common.somethingWentWrong`, `common.cannotReachServer`,
      `mealSchedule.errorForbidden` y `mealSchedule.registerWeightFirst`.

## Requisitos

Convenciones:

- Todos los tests de pantalla se escriben con el arnés de
  `src/screens/add-pet/index.test.tsx`: el mismo modo de mockear router, auth
  y `fetch`, y `await` en `fireEvent` y `act` (RNTL 14).
- Fixture de mascota: `name: 'Rocky'`, `currentWeightKg: 12.4`,
  `myRole: 'owner'`.
- Los literales esperados se escriben **a mano en el test**, copiados del
  canvas. Nunca se importan de `catalog.ts`.
- Rutas relativas a `mobile-pet-tracker/`. Todas las anclas `grep` se
  ejecutan desde `mobile-pet-tracker/`; `docs/` se alcanza como `../docs/`.
- Todo nombre de test nuevo empieza por `#209 R<n>:`, con dos puntos. Así
  `-t '#209 R1:'` no recoge los `it` de otras features ni los de `R10`–`R19`.

### API

**R1** — WHEN el código llama a `putJson(baseUrl, path, token, body, fetchFn)`,
THE SYSTEM SHALL hacer ``fetchFn(apiUrl(baseUrl, path), { method: 'PUT',
headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
body: JSON.stringify(body) })`` y devolver un `GetResult`, igual que `patchJson`
(misma firma, mismo `try`/`catch`).
- Test: `src/api/__tests__/nutrition.test.ts` ›
  `it('#209 R1: putJson envía PUT con cuerpo JSON y Bearer')`. Llama a
  `putJson(baseUrl, '/pets/pet-1/nutrition-profile', 'token-1', { a: 1 }, fetchFn)`
  con las constantes `baseUrl` (`'http://example.test/v1/'`) y
  `profileEndpoint` que ya tiene el fichero, y aserta
  `toHaveBeenCalledWith(profileEndpoint, { method: 'PUT', headers: { Authorization: 'Bearer token-1', 'Content-Type': 'application/json' }, body: '{"a":1}' })`.
  Una barra de más o un `/v1` duplicado da rojo.
- Ancla previa: `grep -cF 'export async function putJson' src/api/http.ts` = `0`.
  Posterior: `1`.

**R2** — WHEN el código llama a `upsertNutritionProfile(baseUrl, token, petId,
input, fetchFn = fetch)`, THE SYSTEM SHALL hacer el PUT con
``putJson(baseUrl, `/pets/${petId}/nutrition-profile`, token, input, fetchFn)``
y devolver `UpsertNutritionProfileState`. La ruta no lleva `/v1`:
`EXPO_PUBLIC_API_URL` ya acaba en `/v1`. Tabla de resultados:

| Respuesta | Resultado |
|---|---|
| 200 | `{ kind: 'ok', profile: NutritionProfile }` |
| 400 | `{ kind: 'invalid' }` |
| 401 | `{ kind: 'unauthorized' }` |
| 403 | `{ kind: 'forbidden' }` |
| 404 | `{ kind: 'not-found' }` |
| Otro status | `{ kind: 'error' }` |
| Fallo de red | `{ kind: 'unreachable' }` |
| `baseUrl` vacío | `{ kind: 'missing-config' }`, con la misma guarda que `generateNutritionPlan` |

`NutritionProfileInput` vive en `src/api/types.ts`:
`{ activityLevel; bodyCondition?: number; targetWeightKg?: number; foodType; kcalPer100g: number; allergies: string[]; diseases: string[] }`.
- Tests: `src/api/__tests__/nutrition.test.ts` ›
  - `it('#209 R2: upsertNutritionProfile hace PUT a nutrition-profile y devuelve ok con el perfil')`.
    Llama con el `baseUrl` del fichero y aserta que el primer argumento de
    `fetchFn` es `profileEndpoint`
    (`'http://example.test/v1/pets/pet-1/nutrition-profile'`), con
    `method: 'PUT'`. Un `/v1/v1` da rojo.
  - `it.each(...)('#209 R2: status %i se mapea a %s')`, una fila por status (400, 401, 403, 404, 500).
  - `it('#209 R2: sin red devuelve unreachable')`.

### Ruta y estructura

**R3** — THE SYSTEM SHALL tener:
- la ruta delgada `src/app/nutrition-profile.tsx` (menos de 10 líneas) que
  solo reexporta `src/screens/nutrition-questionnaire/index.tsx`;
- `<Stack.Screen name="nutrition-profile" options={{ headerShown: false }} />`
  en `src/app/_layout.tsx`, como **último hijo** del grupo `Stack.Protected`,
  justo después de la de `edit-profile`. Ponerla en medio movería todos los
  índices que fija `src/app/__tests__/layout.test.tsx`; al final solo mueve
  las cuentas.

La ruta es exactamente
`export { NutritionQuestionnaireScreen as default } from '../screens/nutrition-questionnaire';`.

Anclas: `grep -cF 'name="nutrition-profile"' src/app/_layout.tsx` = `0`
antes y `1` después.

Enmiendas de `src/app/__tests__/layout.test.tsx` (regla mecánica de R24, con
el comentario `// #209 R3` delante de los que ya hay). (errata ronda 3) Las
cinco cuentas son las del árbol base `1dbac74f` (dev `b185ae61`, tras el
merge de #208, que añadió `pets/[petId]/vaccines/new` entre `meals-history` y
`edit-profile`). Rojo esperado sin enmendar:
`Expected length: 15 / Received length: 16`; verde con ellas.

| `it` de base | Base | Después |
|---|---|---|
| `#194 R4: declara ocho rutas protegidas y alerts singular (enmendado por #208 R4)` | `toHaveLength(8 + 1 + 1 + 1 + 1 + 1 + 1 + 1)` | `toHaveLength(8 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1); // #209 R3 // #194 R4 // …` |
| `#194 R4: declara alerts/[alertId] como décimo hijo y singular (enmendado por #208 R4)` | `toHaveLength(9 + 1 + 1 + 1 + 1 + 1 + 1)` | `toHaveLength(9 + 1 + 1 + 1 + 1 + 1 + 1 + 1); // #209 R3 // #194 R4 // …` |
| `#194 R4: declara pets/[petId]/geofences como undécimo hijo y no singular (enmendado por #189 R1.1) (enmendado por #208 R4)` | `toHaveLength(10 + 1 + 1 + 1 + 1 + 1)` | `toHaveLength(10 + 1 + 1 + 1 + 1 + 1 + 1); // #209 R3 // #194 R4 // …` |
| `#194 R4: declara pets/[petId]/geofence-editor como duodécimo hijo y no singular (enmendado por #189 R1.1) (enmendado por #208 R4)` | `toHaveLength(11 + 1 + 1 + 1 + 1)` | `toHaveLength(11 + 1 + 1 + 1 + 1 + 1); // #209 R3 // #194 R4 // …` |
| `#194 R4: edit-profile es la última pantalla protegida` | `Children.toArray(group.props.children).at(-1)` | `Children.toArray(group.props.children).at(-1 - 1); // #209 R3` |

Cada uno de esos cinco `it` añade a su nombre el sufijo
` (enmendado por #209 R3)`, al final, detrás de los que ya lleva (en los
cuatro primeros, detrás de ` (enmendado por #208 R4)`). Ningún otro número
de `layout.test.tsx` cambia. El `describe('#208 R4: alta de vacuna protegida')`
busca `vaccines/new` por `indexOf` y no se toca.

- Tests:
  - `src/screens/nutrition-questionnaire/index.test.tsx` ›
    `it('#209 R3: la ruta nutrition-profile es delgada y está en el Stack')`.
    Lee ambas fuentes y aserta menos de 10 líneas y la línea de
    `Stack.Screen`.
  - `src/app/__tests__/layout.test.tsx` ›
    `it('#209 R3: nutrition-profile es el último hijo protegido, justo tras edit-profile')`,
    nuevo, con el mismo arnés que el `it` de `edit-profile` (render de
    `RootLayout`, último `Stack` simulado, grupo en el índice 4). Saca
    `names` (el `props.name` de cada hijo) y aserta
    `expect(names.at(-1)).toBe('nutrition-profile')` y
    `expect(names.indexOf('nutrition-profile')).toBe(names.indexOf('edit-profile') + 1)`.
  - Las cinco enmiendas de la tabla, en verde.

**R4** — WHILE la pantalla carga la mascota (`petKeys.detail(petId)` con
`getPet`) o el perfil (`nutritionKeys.profile(petId)` con
`getNutritionProfile`), THE SYSTEM SHALL pintar
`nutrition-questionnaire-skeleton` con `Skeleton` de HeroUI y ningún
`Spinner`. Cuando ambas consultas acaban:
- IF la mascota no es `ok` o el perfil es `error` o `unreachable`, THEN pinta
  `nutrition-questionnaire-load-error` con «Algo salió mal»
  (`common.somethingWentWrong`).
- IF alguna de las dos es `unauthorized`, THEN llama a `signOut()`.
- En otro caso monta el formulario. Con el perfil `not-found` el formulario
  arranca vacío; con `ok` arranca en modo edición (R15).
- (errata ronda 6, 2026-10-27) La ruta tiene `headerShown: false`, así que el
  esqueleto y el error de carga llevan el mismo margen superior que el
  formulario y el error lleva botón de volver. `NutritionQuestionnaireScreen`
  llama a `const insets = useSafeAreaInsets();` antes del primer `return`, y:
  - el esqueleto es
    `<View testID="nutrition-questionnaire-skeleton" className="flex-1 gap-4 bg-background px-5 pb-5" style={{ paddingTop: insets.top + 12 }}>`,
    con los mismos dos `Skeleton` de hoy;
  - el error de carga es
    `<View testID="nutrition-questionnaire-load-error-screen" className="flex-1 gap-4 bg-background px-5 pb-5" style={{ paddingTop: insets.top + 12 }}>`,
    con dos hijos en este orden:
    `<ScreenHeader testID="nutrition-questionnaire" size={24} backFallback="/food" />`
    (sin `title` ni `accessory`, para no añadir otra llamada a
    `t('mealSchedule.nutritionProfile')` a los inventarios de copy) y el
    `<Text testID="nutrition-questionnaire-load-error" className="text-danger">`
    de hoy.
- Tests: `src/screens/nutrition-questionnaire/index.test.tsx` ›
  - `it('#209 R4: mientras carga pinta el esqueleto')`
  - `it('#209 R4: si la mascota falla pinta el error de carga')`
  - (errata ronda 6) `it('#209 R4: esqueleto y error de carga respetan el inset superior y el error tiene volver')`.
    El fichero ya mockea `useSafeAreaInsets` con `top: 40`, así que
    `paddingTop` vale `52`. Para el esqueleto (con
    `mockGetPet.mockReturnValue(new Promise(() => undefined))`, como el `it`
    del esqueleto) y para el error (con
    `mockGetPet.mockResolvedValue({ kind: 'error' })`, tras `cleanup` o en
    un `it` aparte con otro render), con `node` el
    `nutrition-questionnaire-skeleton` o el
    `nutrition-questionnaire-load-error-screen`, aserta
    `expect(node.props.style).toEqual({ paddingTop: 52 })` y
    `expect(node.props.className).toBe('flex-1 gap-4 bg-background px-5 pb-5')`.
    En el error aserta además que
    `within(errorScreen).getByTestId('nutrition-questionnaire-load-error')`
    tiene el texto «Algo salió mal», y que
    `await fireEvent.press(screen.getByTestId('nutrition-questionnaire-back'))`
    llama a `mockRouter.back` (el doble de `router.canGoBack` devuelve
    `true`; `BackButton` hace `router.back()`). Con el código de hoy (`p-5`
    sin `style`, `Text` suelto y sin cabecera) sale rojo en las dos ramas.
  - (errata ronda 7, 2026-10-27; segunda revisión, H1 y H3) En ese mismo `it`,
    las dos líneas del `press` y del `mockRouter.back` se sustituyen por estas,
    en este orden:

        expect(within(errorScreen).getAllByTestId(/^nutrition-questionnaire-(back|load-error)$/).map(node => node.props.testID)).toEqual(['nutrition-questionnaire-back', 'nutrition-questionnaire-load-error']);
        await fireEvent.press(within(errorScreen).getByTestId('nutrition-questionnaire-back'));
        expect(mockRouter.back).toHaveBeenCalled();
        mockRouter.canGoBack.mockReturnValueOnce(false);
        await fireEvent.press(within(errorScreen).getByTestId('nutrition-questionnaire-back'));
        expect(mockRouter.replace).toHaveBeenCalledWith('/food');

    La primera fija que el botón de volver está **dentro** del `View` con
    inset y antes del `Text`. Sale roja si el `ScreenHeader` queda fuera del
    `View` (falta `-back`) o si los dos hijos se invierten. La última fija
    `backFallback="/food"`: `BackButton` hace
    `router.canGoBack() ? router.back() : router.replace(fallback)`, y
    `jest.clearAllMocks()` del `beforeEach` no borra la implementación
    `() => true` del doble. El código de HEAD ya cumple, así que el rojo es
    una mutación de producción (CHECKPOINTS.md C4): el commit `test` versiona
    el `ScreenHeader` del error fuera del `View`
    (`<><ScreenHeader …/><View …><Text …/></View></>`), y el `feat` la revierte.

**R5** — WHILE el formulario está montado, THE SYSTEM SHALL pintar:
- `ScreenHeader` con `testID="nutrition-questionnaire"`, título «Perfil
  nutricional», `size={24}` y accesorio `nutrition-questionnaire-step-label`
  con «N de 4» (`addPet.stepProgress`).
- La barra `nutrition-questionnaire-step-bar`, con
  `accessibilityRole="progressbar"` y
  `accessibilityValue={{ min: 1, max: 4, now: N }}`. Tiene 4 segmentos
  `h-1.5 flex-1 rounded-full`: `bg-accent` si su índice (de 1 a 4) es ≤ N, y
  `bg-lip-gray` en otro caso.
- La burbuja de Pingo `nutrition-questionnaire-bubble`, con el texto del paso.
  (errata ronda 6, 2026-10-27; mismo motivo que en R16) La imagen de Pingo
  junto a la burbuja es
  `<Image testID="nutrition-questionnaire-pingo" source={require('../../../assets/images/pingo-food.webp')} style={step === 'condition' ? { width: 44, height: 44 } : { width: 52, height: 52 }} />`,
  sin `className`.

Valores de N: Actividad 1, Condición 2, Peso objetivo 2, Alimento 3, Salud 4.
- Test: `it('#209 R5: pinta cabecera, contador «1 de 4» y la barra con un segmento hecho')`.
- (errata ronda 6) Test:
  `it('#209 R5: Pingo de la burbuja mide 52 pt y 44 pt en Condición por style')`,
  justo después del anterior. Empieza por `await goToCondition()` (el helper
  del fichero: renderiza, elige `activity-option-medium` y pulsa Siguiente) y
  aserta
  `expect(screen.getByTestId('nutrition-questionnaire-pingo', { includeHiddenElements: true }).props.style).toEqual({ width: 44, height: 44 })`.
  Después vuelve a Actividad con `await pressBack()` (el helper del fichero:
  pulsa Volver y dispara el callback de `usePreventRemove`, que en Condición
  retrocede un paso, R6), espera `await screen.findByTestId('activity-option-medium')`
  y aserta
  `{ width: 52, height: 52 }` y `props.className` `undefined`. Con el código
  de hoy sale rojo: no existe el `testID` y la imagen solo lleva
  `className="size-13"` o `"size-11"`.
- (errata ronda 7, 2026-10-27; segunda revisión, H2) La rama de 52 pt cubre
  cuatro pasos y el `it` anterior solo la mira en Actividad. Test nuevo, justo
  después:
  `it('#209 R5: Pingo de la burbuja mide 52 pt en Alimento y en Salud')`:

      await goToFood(5);
      expect(screen.getByTestId('nutrition-questionnaire-pingo', { includeHiddenElements: true }).props.style).toEqual({ width: 52, height: 52 });
      await fireEvent.press(screen.getByTestId('food-type-dry'));
      await fireEvent.press(screen.getByTestId('nutrition-questionnaire-next'));
      expect(await screen.findByText('Alergias')).toBeVisible();
      expect(screen.getByTestId('nutrition-questionnaire-pingo', { includeHiddenElements: true }).props.style).toEqual({ width: 52, height: 52 });

  `goToFood(5)` es el helper del fichero: deja el paso Alimento observado con
  `findByText('Tipo de alimento')`. Los tres pasos siguientes son los de
  `goToHealth()`, sin la recursión. El código de HEAD ya cumple, así que el
  rojo es una mutación de producción (CHECKPOINTS.md C4): el commit `test`
  versiona `step === 'condition' || step === 'food' ? { width: 44, height: 44 } : { width: 52, height: 52 }`,
  y el `feat` la revierte.

**R6** — WHEN el usuario pulsa Volver (`nutrition-questionnaire-back`, o el
gesto o botón del sistema, vía `usePreventRemove`) en un paso distinto de
Actividad, THE SYSTEM SHALL retroceder un paso sin salir de la pantalla:
- Salud → Alimento.
- Alimento → Peso objetivo si la condición es ≥ 7, o Condición si es < 7.
- Peso objetivo → Condición.
- Condición → Actividad.

En Actividad, Volver sale de la pantalla.
- Tests:
  - `it('#209 R6: Volver desde Alimento con condición 6 vuelve a Condición')`
  - `it('#209 R6: Volver desde Alimento con condición 7 vuelve a Peso objetivo')`

### Pasos

**R7** — WHILE el paso es Actividad, THE SYSTEM SHALL pintar estos textos:
- Burbuja: «Cuéntame cómo es un día normal de Rocky. Con eso calculo cuánta energía necesita.»
- Leyenda: «¿Cuánto se mueve Rocky?»

Y estas tres tarjetas, con `accessibilityRole="radio"` y
`accessibilityState={{ checked }}`:

| testID | Título | Descripción | Color |
|---|---|---|---|
| `activity-option-low` | «Baja» | «Paseos cortos y mucho descanso.» | blue |
| `activity-option-medium` | «Media» | «Uno o dos paseos al día y algo de juego.» | green |
| `activity-option-high` | «Alta» | «Corre, entrena o juega con intensidad cada día.» | amber |

`nutrition-questionnaire-next` («Siguiente») tiene `isDisabled` hasta que hay
una elección.
- Tests:
  - `it('#209 R7: Actividad pinta las tres opciones con su copy')`
  - `it('#209 R7: Siguiente está desactivado hasta elegir actividad')`

**R8** — WHILE el paso es Condición, THE SYSTEM SHALL pintar estos textos:
- Burbuja: «Pasa la mano por el costado de Rocky y elige lo que más se parezca a lo que sientes.»
- Leyenda: «¿Cómo está su cuerpo?»

Y nueve filas `bcs-option-<n>` (`accessibilityRole="radio"`), cada una con
`bcs-badge-<n>` (número `n`, `CATEGORY_SLOTS.<banda>.surface` + `.ink`):

| n | Título | Descripción | Banda |
|---|---|---|---|
| 1 | Muy delgado | Huesos muy visibles, sin grasa al tacto | blue |
| 2 | Delgado | Costillas y cadera se ven a simple vista | blue |
| 3 | Algo delgado | Costillas fáciles de sentir, cintura marcada | blue |
| 4 | Ideal, esbelto | Costillas se sienten con poca grasa | green |
| 5 | Ideal | Costillas se sienten y la cintura se ve | green |
| 6 | Algo de sobrepeso | Algo de grasa en costillas, poca cintura | amber |
| 7 | Sobrepeso | Costillas difíciles de sentir | amber |
| 8 | Obesidad | No se sienten las costillas ni la cintura | rose |
| 9 | Obesidad severa | Grasa abundante en cuello, lomo y vientre | rose |

Siguiente queda desactivado hasta elegir.
- Tests:
  - `it.each(NINE_ROWS)('#209 R8: fila %i pinta «%s», «%s» y la banda %s')`. La
    tabla se escribe a mano en el test y tiene longitud 9.
  - `it('#209 R8: Siguiente está desactivado hasta elegir condición')`

**R9** — WHEN el usuario pulsa Siguiente en Condición, THE SYSTEM SHALL ir a
Alimento si la condición es < 7, o a Peso objetivo si es ≥ 7.
- Test: `it.each([[1, 'Alimento'], [6, 'Alimento'], [7, 'Peso objetivo'], [9, 'Peso objetivo']])('#209 R9: con condición %i Siguiente va a %s')`.
  Aserta el paso destino por su leyenda: «Tipo de alimento» o «Peso objetivo».

**R10** — WHILE el paso es Peso objetivo, THE SYSTEM SHALL:
- Pintar la burbuja «Con condición 7 conviene que Rocky baje de peso poco a
  poco. ¿Te dijo el veterinario cuál es su peso ideal?», con la condición
  elegida interpolada.
- Pintar la fila resumen `target-weight-summary`:
  - `bcs-badge-summary`, con la banda de R8;
  - el texto «Condición 7/9 · Sobrepeso», con el título de R8;
  - el enlace `target-weight-change` («Cambiar», `text-accent-strong`), que
    vuelve a Condición.
- Pintar el título «Peso objetivo» con «Opcional».
- Pintar el campo `target-weight-input` (`keyboardType="decimal-pad"`,
  `maxLength={6}`) con la unidad «kg».
- Pintar `target-weight-current`, «Peso actual de Rocky: 12.4 kg», solo si
  `currentWeightKg` no es `null`.
- Pintar la nota `target-weight-note`, «Si aún no lo sabes, déjalo vacío:
  calculo con su peso actual y lo ajustas después.»
- Mantener el contador en «2 de 4».
- Desactivar Siguiente solo si el campo no está vacío y su valor (`,` se acepta
  como `.`) no es un número > 0 y ≤ 999.99 con 2 decimales como máximo.

Tests:
- `it('#209 R10: Peso objetivo pinta resumen, copy y contador «2 de 4»')`
- `it('#209 R10: Cambiar vuelve a Condición')`
- `it('#209 R10: sin currentWeightKg no pinta el peso actual')`
- `it.each([['0', true], ['1000', true], ['12,345', true], ['', false], ['10,5', false]])('#209 R10: peso «%s» desactiva Siguiente: %s')`

**R11** — WHILE el paso es Alimento, THE SYSTEM SHALL pintar:
- La burbuja «¿Qué come Rocky? Con las calorías de su alimento calculo cuántos
  gramos servir en cada comida.»
- La leyenda «Tipo de alimento».
- Cuatro chips (`accessibilityRole="radio"`): `food-type-dry` «Seco»,
  `food-type-wet` «Húmedo», `food-type-mixed` «Mixto» y
  `food-type-homemade` «Casero».
- La etiqueta «Calorías del alimento».
- El campo `kcal-input` (`keyboardType="number-pad"`, `maxLength={3}`) con la
  unidad «kcal / 100 g».
- La ayuda «Entre 80 y 600 kcal por cada 100 g.»
- La nota `kcal-note` del tipo elegido.

WHEN el usuario elige un tipo, THE SYSTEM SHALL poner en `kcal-input` su
precarga y pintar su nota:

| Tipo | Precarga | Nota (`kcal-note`) |
|---|---|---|
| `dry` | 350 | «Puse 350, lo habitual en alimento seco. Si la bolsa dice otro número, cámbialo: lo encuentras como energía metabolizable.» |
| `wet` | 90 | «Puse 90, lo habitual en alimento húmedo. Si la lata dice otro número, cámbialo: lo encuentras como energía metabolizable.» |
| `mixed` | 220 | «Puse 220, un punto medio entre seco y húmedo. Si sabes el número exacto, cámbialo.» |
| `homemade` | 130 | «Puse 130, lo habitual en comida casera. Si tu receta tiene otro número, cámbialo.» |

Sin tipo elegido no hay nota.

Tests:
- `it.each(FOUR_TYPES)('#209 R11: %s precarga %s kcal y su nota')`. La tabla se
  escribe a mano en el test y tiene longitud 4.
- `it('#209 R11: cambiar de tipo sobrescribe un valor editado')`

**R12** — WHILE el paso es Alimento, THE SYSTEM SHALL desactivar Siguiente si
falta el tipo o si `kcal-input` no es un entero entre 80 y 600.
- Test: `it.each([['79', true], ['80', false], ['600', false], ['601', true], ['', true]])('#209 R12: kcal «%s» desactiva Siguiente: %s')`.

**R13** — WHILE el paso es Salud, THE SYSTEM SHALL pintar:
- La burbuja «¿Rocky tiene alguna alergia o enfermedad? Si no tiene ninguna,
  déjalo todo sin marcar.»
- La leyenda «Alergias» con los chips `allergy-chip-<slug>`, en este orden:
  - pollo «Pollo»
  - carne-de-res «Carne de res»
  - lacteos «Lácteos»
  - trigo «Trigo»
  - huevo «Huevo»
  - soya «Soya»
  - pescado «Pescado»
  - otra «Otra»
- La leyenda «Enfermedades» con los chips `disease-chip-<slug>`, en este orden:
  - diabetes «Diabetes»
  - enfermedad-renal «Enfermedad renal»
  - pancreatitis «Pancreatitis»
  - enfermedad-hepatica «Enfermedad hepática»
  - problemas-digestivos «Problemas digestivos»
  - problemas-articulares «Problemas articulares»
  - otra «Otra»
- La CTA «Guardar y generar plan». Es el mismo `nutrition-questionnaire-next`
  de los pasos anteriores: el pie tiene una sola CTA en todos los pasos, y en
  Salud solo cambia su texto. No hay otro testID de CTA.

Los chips llevan `accessibilityRole="checkbox"` y
`accessibilityState={{ checked }}`, y se marcan y desmarcan al pulsarlos.

WHILE «Otra» está marcada en una lista, THE SYSTEM SHALL pintar debajo:
- la etiqueta «¿Cuál?»;
- el contador `<lista>-other-count` con «N/40», donde N es la longitud del
  texto;
- el campo `<lista>-other-input` con `maxLength={40}`.

Aquí `<lista>` es `allergy` o `disease`.

Tests:
- `it('#209 R13: Salud pinta las dos listas con su copy y orden')`. También aserta
  que `nutrition-questionnaire-next` contiene «Guardar y generar plan».
- `it.each(['allergy', 'disease'])('#209 R13: marcar Otra en %s muestra ¿Cuál? y el contador pasa de 0/40 a 7/40')`.
  Escribe «Maíz ok», que tiene 7 caracteres.

### Guardar y generar

**R14** — WHEN el usuario pulsa «Guardar y generar plan», THE SYSTEM SHALL
llamar a `upsertNutritionProfile` con un cuerpo que cumpla todo esto:

1. `activityLevel`, `foodType` y `kcalPer100g` (número) siempre.
2. `bodyCondition`: la condición elegida.
3. `targetWeightKg` **solo** si la condición es ≥ 7 y el campo no está vacío,
   como número (`'10,5'` → `10.5`). En cualquier otro caso la clave **no
   existe** en el cuerpo, ni con `null` ni con `undefined` serializado.
4. `allergies` y `diseases`:
   - las etiquetas marcadas en el orden de R13, sin «Otra»;
   - después, el texto de «Otra» con trim, si está marcada y queda no vacío;
   - después, los elementos conservados por R15;
   - sin duplicados exactos;
   - recortado a 20 elementos (`slice(0, 20)`), cada uno con 100 caracteres
     como máximo.

Tests:
- `it('#209 R14: condición 5 omite targetWeightKg aunque se hubiera escrito antes')`.
  El test escribe peso con 7, vuelve y elige 5.
- `it('#209 R14: condición 7 con peso vacío omite targetWeightKg')`
- `it('#209 R14: condición 7 con «10,5» envía targetWeightKg 10.5')`
- `it('#209 R14: Otra con «  Maíz  » añade «Maíz» tras las etiquetas marcadas')`
- `it('#209 R14: Otra con solo espacios no añade nada')`
- `it('#209 R14: con 21 alergias conservadas envía 20')`. Usa el perfil precargado
  de R15.

**R15** — WHEN el perfil existe (`getNutritionProfile` es `ok`), THE SYSTEM
SHALL arrancar con:
- la actividad del perfil;
- la condición del perfil, o ninguna si es `null`;
- el peso objetivo como texto, o vacío si es `null`;
- el tipo y `kcalPer100g` del perfil, sin sobrescribir por la precarga;
- cada alergia y enfermedad cuyo texto coincide con la etiqueta de un chip,
  marcada.

Para los textos que no coinciden: el primero con 40 caracteres o menos marca
«Otra» y rellena su campo. Los demás se conservan tal cual al final del array
enviado (R14.4), aunque no se pintan.
- Tests:
  - `it('#209 R15: con perfil existente precarga actividad, condición, peso, alimento y kcal')`
  - `it('#209 R15: «Pollo» marca su chip y «Maíz» rellena Otra')`
  - `it('#209 R15: con bodyCondition null Siguiente de Condición está desactivado')`

**R16** — WHEN el PUT empieza, THE SYSTEM SHALL sustituir el formulario por
`nutrition-generating`, con:
- el escenario: dos `PingRing` con `testID="nutrition-generating-ring-0"`
  (`delay={0}`) y `testID="nutrition-generating-ring-1"` (`delay={1000}`); si
  `useReducedMotion()` es verdadero, ningún anillo;
- `PingoFloat` con `testID="nutrition-generating-pingo"` y `pingo-food.webp`
  a 112 pt. (errata ronda 6, 2026-10-27) El tamaño va por `style`, no por
  `className`: Uniwind solo traduce `className` en los componentes de
  `react-native` y `expo-image` no lo convierte, así que `size-28` deja la
  imagen en 0×0 en el dispositivo. Todas las `Image` de `expo-image` del repo
  se dimensionan así (`components/empty-state.tsx`,
  `screens/home/index.tsx`, `screens/join-pet/index.tsx`). El hijo es
  `<Image testID="nutrition-generating-pingo-image" source={require('../../../assets/images/pingo-food.webp')} style={{ width: 112, height: 112 }} />`,
  sin `className` (el asset es cuadrado, 1024×1024, y no hace falta
  `contentFit`);
- el título «Preparando el plan de Rocky»;
- el texto «Estoy calculando sus calorías y el reparto de sus comidas. Tarda
  unos segundos.»;
- la lista `nutrition-generating-steps` (`accessibilityLiveRegion="polite"`)
  con «Perfil guardado», «Calculando calorías» y «Repartiendo comidas».

Estado de cada fila:

| Fase | Perfil guardado | Calculando calorías | Repartiendo comidas |
|---|---|---|---|
| Mientras el PUT está en vuelo | en curso | pendiente | pendiente |
| Tras PUT ok, mientras generate está en vuelo | hecho | en curso | pendiente |

WHEN generate devuelve `ok`, THE SYSTEM SHALL invalidar
`nutritionKeys.profile(petId)` y `nutritionKeys.plan(petId)`, y llamar a
`router.back()`.

Tests:
- `it('#209 R16: con PUT en vuelo pinta Generando con Perfil guardado en curso')`
- `it('#209 R16: tras PUT ok marca Perfil guardado hecho y Calculando en curso')`
- `it('#209 R16: generate ok invalida perfil y plan y vuelve atrás')`
- `it('#209 R16: con movimiento reducido no pinta anillos')`. Aserta que
  `nutrition-generating-ring-0` y `-ring-1` no existen y que
  `nutrition-generating-pingo` sí.
- (errata ronda 6) `it('#209 R16: Pingo de Generando mide 112 pt por style')`.
  Con el PUT en vuelo (como el primer `it` de R16), aserta
  `expect(image.props.style).toEqual({ width: 112, height: 112 })` y
  `expect(image.props.className).toBeUndefined()`, con
  `image = within(screen.getByTestId('nutrition-generating-pingo', { includeHiddenElements: true })).getByTestId('nutrition-generating-pingo-image', { includeHiddenElements: true })`.
  Con el código de hoy sale rojo: no existe el `testID` y la imagen solo
  lleva `className="size-28"`.

El movimiento reducido se simula como en
`src/components/__tests__/pet-hero-header.test.tsx`: un
`jest.mock('react-native-reanimated', …)` de módulo que devuelve
`{ ...jest.requireActual('react-native-reanimated'), __esModule: true, useReducedMotion: () => mockUseReducedMotion() }`,
con `const mockUseReducedMotion = jest.fn<boolean, []>(() => false)`,
`mockUseReducedMotion.mockReturnValue(true)` solo en el `it` de movimiento
reducido, y `afterEach` que lo devuelve a `false`. Sin `__esModule: true` el
doble pierde la exportación por defecto. El `it` de «PUT en vuelo» aserta
además que los dos anillos existen, para que el de movimiento reducido no
pase en verde con una pantalla que nunca pinta anillos.

**R17** — IF el PUT o generate no devuelven `ok`, THEN THE SYSTEM SHALL volver
al formulario en el paso Salud, con las respuestas intactas, y pintar
`<Text testID="nutrition-questionnaire-error" className="text-danger">`
(la misma clase que `generate-plan-error` en
`src/screens/meal-schedule/index.tsx`) con este texto. Los literales `es` son
los valores actuales de esas claves en `src/i18n/catalog.ts`:

| Resultado | Clave | Texto (`es`, literal en el test) |
|---|---|---|
| PUT `invalid` | `common.somethingWentWrong` | «Algo salió mal» |
| PUT `forbidden` | `mealSchedule.errorForbidden` | «Solo el dueño puede generar el plan» |
| PUT `unreachable` | `common.cannotReachServer` | «No se pudo conectar con el servidor» |
| PUT `error`, `not-found` o `missing-config` | `common.somethingWentWrong` | «Algo salió mal» |
| generate `forbidden` | `mealSchedule.errorForbidden` | «Solo el dueño puede generar el plan» |
| generate `unprocessable` con `PET_WEIGHT_REQUIRED` | `mealSchedule.registerWeightFirst` | «Primero registra un peso» |
| generate, otro `unprocessable` o `error` | `common.somethingWentWrong` | «Algo salió mal» |
| generate `unreachable` | `common.cannotReachServer` | «No se pudo conectar con el servidor» |
| `unauthorized` en cualquiera | — | `signOut()` sin texto |

Si el PUT fue `ok`, `nutritionKeys.profile(petId)` se invalida aunque generate
falle.
- Test: `it.each(ERROR_ROWS)('#209 R17: %s %s pinta «%s»')`. Una fila por fila de
  la tabla, con el texto español literal escrito en el test.

**R18** — WHILE el formulario está montado, THE SYSTEM SHALL tener como raíz
`<KeyboardAvoidingView testID="screen-nutrition-questionnaire" className="flex-1" behavior="padding" keyboardVerticalOffset={0}>`
y un `ScrollView` con `keyboardShouldPersistTaps="handled"`. Así
`target-weight-input`, `kcal-input` y los campos «Otra» quedan visibles con el
teclado abierto.
- Test: `it('#209 R18: la raíz es un KAV con behavior padding y el scroll persiste taps')`.

### Entradas

**R19** — WHILE Nutrición (`src/screens/food/index.tsx`) muestra una mascota
cuyo plan es `not-found`, THE SYSTEM SHALL consultar también
`nutritionKeys.profile(petId)` con `getNutritionProfile`, y pintar:

- Perfil pendiente: `food-plan-skeleton`.
- Perfil `not-found` y `myRole === 'owner'`: la sección
  `food-profile-empty` (NutricionSinPerfil) en lugar de `food-plan-empty`.
  Contiene:
  - el escenario con `PingoFloat` y `pingo-food.webp` a 150 pt. (errata
    ronda 6, 2026-10-27; mismo motivo que en R16) El hijo de
    `food-profile-pingo` es
    `<Image testID="food-profile-pingo-image" source={require('../../../assets/images/pingo-food.webp')} style={{ width: 150, height: 150 }} />`,
    sin `className`;
  - el título «Aún no hay perfil nutricional»;
  - el texto «Respóndeme unas preguntas sobre Rocky y preparo su plan:
    cuántas calorías necesita y cuántos gramos servir en cada comida.»;
  - la CTA `food-create-profile` «Crear perfil nutricional», sin icono, que
    hace `router.push({ pathname: '/nutrition-profile', params: { petId } })`;
  - la nota «Son 4 pasos y podrás cambiar tus respuestas cuando quieras.»
- Cualquier otro caso (no owner, o perfil `ok`): `food-plan-empty`, como hoy.

Tests: `src/screens/food/index.test.tsx` ›
- `it('#209 R19: owner sin perfil ve Crear perfil nutricional y navega al cuestionario')`
- `it.each(['family', 'walker', 'vet'])('#209 R19: %s sin perfil ve el vacío actual')`
- `it('#209 R19: owner con perfil y sin plan ve el vacío actual')`
- (errata ronda 6) `it('#209 R19: Pingo de NutricionSinPerfil mide 150 pt por style')`.
  Con el mismo arreglo que el primer `it` de R19 (owner, plan y perfil
  `not-found`), aserta
  `expect(image.props.style).toEqual({ width: 150, height: 150 })` y
  `expect(image.props.className).toBeUndefined()`, con
  `image = within(screen.getByTestId('food-profile-pingo', { includeHiddenElements: true })).getByTestId('food-profile-pingo-image', { includeHiddenElements: true })`.
  Con el código de hoy sale rojo (sin `testID`, `className="size-37.5"`).

**R20** — WHILE Horario (`src/screens/meal-schedule/index.tsx`) muestra el
perfil nutricional, THE SYSTEM SHALL:
- con perfil `ok` y owner: pintar a la derecha de `nutrition-profile-title`
  (fila `flex-row items-center justify-between`) el enlace
  `nutrition-profile-edit`, con el texto «Editar perfil»
  (`t('profile.editProfile')`, reutilizada) y
  `accessibilityLabel={t('nutritionQuestionnaire.editProfileLabel')}`
  («Editar perfil nutricional»);
- con perfil `not-found` y owner: pintar bajo `nutrition-profile-empty` el
  enlace `nutrition-profile-create`, «Crear perfil nutricional»
  (`t('nutritionQuestionnaire.createProfile')`);
- con cualquier otro rol: no pintar ningún enlace.

Los dos enlaces hacen
`router.push({ pathname: '/nutrition-profile', params: { petId } })` desde
una función local `openNutritionProfile`, y llevan `hitSlop={TOUCH_SLOP}`:
miden `h-9` (36 pt) y la carta exige 44 pt de objetivo táctil
(`docs/ui-guidelines.md`, objetivos táctiles).

**Decisión (A8): «Crear perfil nutricional» de Horario no tiene artboard
propio.** El canvas congelado solo dibuja «Editar perfil»
(`canvas/HorarioEditarPerfil.dc.html`: enlace de 36 px de alto, `padding: 0 12px`,
radio 12, fondo `--surface`, borde de 2 px y sombra `0 3px 0` en `--lip-gray`,
texto de 13 px y peso 800). «Crear perfil nutricional» no sale en ningún
artboard de Horario. No se dibuja uno nuevo:
- el copy es el ya aprobado en NutricionSinPerfil (v140,
  `canvas/NutricionSinPerfil.dc.html`), con la misma clave
  `nutritionQuestionnaire.createProfile`;
- la receta es exactamente la de «Editar perfil», cambiando solo el `testID`
  y el texto:
  `<Pressable testID="nutrition-profile-create" hitSlop={TOUCH_SLOP} className="h-9 flex-row items-center justify-center rounded-xl border-2 border-lip-gray bg-surface px-3" style={chunkyLip.neutralCompact} onPress={openNutritionProfile}>`
  con hijo
  `<Text className="text-13 font-extrabold text-foreground">{t('nutritionQuestionnaire.createProfile')}</Text>`;
- sin `accessibilityLabel` propio: el texto visible ya es la etiqueta
  completa. Sin icono, como «Editar perfil» (decisión 13: sin el lápiz).

Es una decisión del leader del 2026-10-26, no una desviación del canvas.
- Tests: `src/screens/meal-schedule/index.test.tsx` ›
  - `it('#209 R20: owner con perfil ve Editar perfil y navega al cuestionario')`
  - `it('#209 R20: owner sin perfil ve Crear perfil nutricional')`
  - `it.each(['family', 'walker', 'vet'])('#209 R20: %s no ve enlaces de perfil')`

**R21** — WHILE el rol de la mascota no es `owner`, THE SYSTEM SHALL no pintar
`generate-plan-button` en Horario. Con owner se pinta como hoy.
(errata ronda 5, 2026-10-27) Sin owner tampoco se pinta el bloque que lo
contiene: ni `meal-schedule-actions` ni `generate-plan-error`. En código,
`canGenerate` exige `isOwner`. Sin ese cambio, el familiar vería una fila de
acciones vacía, porque «Añadir comida» ya es solo de owner (#147 R4). Los `it`
R21 de no-owner asertan que `generate-plan-button` y `meal-schedule-actions`
son `null`, después de `await screen.findByTestId('meal-time-row-1')` con un
plan `ok`.
- Tests: `src/screens/meal-schedule/index.test.tsx` ›
  - `it.each(['family', 'walker', 'vet'])('#209 R21: %s no ve Generar plan')`
  - `it('#209 R21: owner ve Generar plan')`

**Tests existentes que R21 contradice** (errata ronda 5, 2026-10-27). El
`beforeEach` de nivel superior pone `petState('family')`. Los `it` que pulsan o
asertan `generate-plan-button` sin fijar rol corren como familiar. Medido con
R21 plantado: `Tests: 13 failed, 72 passed, 85 total` en el fichero de Horario.
Todos están en `src/screens/meal-schedule/index.test.tsx` y cada `it` tocado
suma ` (enmendado por #209 R21)` al final de su nombre. El resto del nombre no
se toca:

| `it` | Enmienda |
|---|---|
| `describe('R8: generar plan con degradación por kind')`, sus cuatro `it`: `shows the generate button with a $kind plan`, `maps $result.kind to "$message"`, `clears a prior error and refetches the generated plan on success` y `disables the generate button while the request is pending` (11 casos) | Una línea `mockGetPet.mockResolvedValue(petState('owner'));` al final del `beforeEach` de ese `describe`, tras su `mockGetNutritionProfile.mockResolvedValue({ kind: 'not-found' });`. En los dos `it.each` el sufijo va dentro del literal del nombre, tras `$kind plan` y tras `"$message"` |
| `el error de generar precede a las acciones como hermano` (`describe('#179 R7: acciones del artboard')`) | Primera línea del cuerpo: `mockGetPet.mockResolvedValue(petState('owner'));` |
| `el familiar solo ve Generar ocupando el ancho disponible` (mismo `describe`) | Se invierte, porque contradice R21 en su enunciado. Nombre nuevo: `el familiar no ve ni Añadir ni Generar (enmendado por #209 R21)`. Cuerpo: conserva sus tres primeras líneas (`petState('family')`, `renderMealSchedule()` y `findByTestId('meal-time-row-1')`), y luego aserta que `meal-schedule-actions`, `add-meal-time-button` y `generate-plan-button` dan `null` con `screen.queryByTestId`. Sin `expectGenerate` |

Van en el commit rojo de R21, junto a los `it` R21, como en R22. En ese commit
el único rojo de las enmiendas es el `it` invertido: la producción aún pinta
Generar al familiar. Los otros cinco pasan antes y después. Anclas, desde
`mobile-pet-tracker/`, en `src/screens/meal-schedule/index.test.tsx`, medidas
en `12e0c771`:
- `grep -cF '(enmendado por #209 R21)'` pasa de `0` a `6`;
- `grep -cF "mockGetPet.mockResolvedValue(petState('owner'));"` pasa de `11` a
  `13`, más las que sumen los `it` R21 nuevos;
- `grep -cF 'el familiar solo ve Generar ocupando el ancho disponible'` pasa de
  `1` a `0`.

Ningún otro `it` del fichero aserta `meal-schedule-actions` ni
`generate-plan-error` con rol por defecto. Las anclas de fuente de
`src/__tests__/design-drift.test.ts` (`testID="generate-plan-error"` antes de
`testID="meal-schedule-actions"`) no cambian. Si con todo esto sale otro rojo,
el implementador para y lo reporta.

**R22** — WHILE Horario pinta las píldoras del perfil, THE SYSTEM SHALL
mostrar las etiquetas en español en lugar de los enums crudos:

| Campo | Valor | Texto de la píldora |
|---|---|---|
| actividad | `low` | «Actividad Baja» |
| actividad | `medium` | «Actividad Media» |
| actividad | `high` | «Actividad Alta» |
| alimento (con 380 kcal) | `dry` | «Alimento Seco 380 kcal/100 g» |
| alimento (con 380 kcal) | `wet` | «Alimento Húmedo 380 kcal/100 g» |
| alimento (con 380 kcal) | `mixed` | «Alimento Mixto 380 kcal/100 g» |
| alimento (con 380 kcal) | `homemade` | «Alimento Casero 380 kcal/100 g» |

Se reutilizan las claves de R7 y R11. La píldora de condición no cambia. En
`en` las píldoras se leen «Activity Medium» y «Food Dry 350 kcal/100 g»
(valores `en` de R23).

**Tests existentes que R22 contradice** (asertan el enum crudo). Se enmiendan
con la regla mecánica de R24: solo cambia el literal citado, y cada `it` suma
` (enmendado por #209 R22)` al final de su nombre. El resto del nombre no se
toca, aunque «valores crudos» y «sin traducir los valores del perfil» queden
viejos. Todos están en `src/screens/meal-schedule/index.test.tsx`:

| `it` | Literal de base | Después |
|---|---|---|
| `renders the plan summary, ordered portions, and complete profile` (`describe('R7: meal schedule muestra horarios y perfil')`) | `'Alimento dry 350 kcal/100 g'` y `'Actividad medium'` | `'Alimento Seco 350 kcal/100 g'` y `'Actividad Media'` |
| `muestra las tres píldoras con condición, prefijos y valores crudos` (`describe('#179 R8: perfil en píldoras')`) | `'Actividad medium'` y `'Alimento dry 350 kcal/100 g'` | `'Actividad Media'` y `'Alimento Seco 350 kcal/100 g'` |
| `omite condición nula y conserva las otras dos píldoras` (mismo `describe`) | `'Actividad medium'` y `'Alimento dry 350 kcal/100 g'` | `'Actividad Media'` y `'Alimento Seco 350 kcal/100 g'` |
| `traduce los prefijos al inglés sin traducir los valores del perfil` (mismo `describe`) | `'Activity medium'` y `'Food dry 350 kcal/100 g'` | `'Activity Medium'` y `'Food Dry 350 kcal/100 g'` |

Los prefijos (`'Actividad '`, `'Alimento '`, `'Activity '`, `'Food '`) no
cambian. Anclas, desde `mobile-pet-tracker/`, en
`src/screens/meal-schedule/index.test.tsx`:
`grep -cF "'Alimento dry 350 kcal/100 g'"` `3` antes y `0` después;
`grep -cF "'Actividad medium'"` `3` → `0`; `grep -cF "'Activity medium'"`
`1` → `0`; `grep -cF "'Food dry 350 kcal/100 g'"` `1` → `0`;
`grep -cF '(enmendado por #209 R22)'` `0` → `4`. Medido en semilla: sin
enmendar, `Tests: 4 failed` en este fichero (`Expected … Actividad medium /
Received: Actividad Media`); con estas enmiendas, verde.
- Tests:
  - `it.each(THREE_ACTIVITIES)('#209 R22: actividad %s se lee «%s»')`
  - `it.each(FOUR_FOODS)('#209 R22: alimento %s se lee «%s»')`

### Copy, carta y guardas

**R23** — THE SYSTEM SHALL servir todo el copy nuevo desde
`src/i18n/catalog.ts`, con **exactamente estas 77 claves**
`nutritionQuestionnaire.*`, en este orden, en `en` y en `es` (al final de cada
locale). Las variables son `{{name}}`, `{{bcs}}`, `{{label}}`, `{{weight}}` y
`{{count}}`.

- `es` lleva el literal de la columna `es`, que es el de R7–R20 con «Rocky»
  sustituido por `{{name}}`.
- `en` lleva el literal de la columna `en`. Lo fija esta spec (decisión del
  leader del 2026-10-26, con el precedente de `specs/mobile-date-field/requirements.md`
  R16): Codex no traduce. Cada valor `en` tiene las mismas variables que su
  `es`, que es lo que aserta `#194 R1` de
  `src/providers/__tests__/language-provider.test.tsx`.
- En el fichero, las claves van en el orden de la tabla. Los valores con
  apóstrofo (`'s`, `don't`, `I'll`, `I'm`, `It's`, `can't`) van entre comillas
  dobles, como los vecinos del catálogo (`"Once there's a plan, …"`).
- `other` es una sola clave para las dos listas (Alergias y Enfermedades).

| Clave (`nutritionQuestionnaire.` +) | `en` | `es` |
|---|---|---|
| `bubbleActivity` | Tell me about a normal day for {{name}}. That tells me how much energy they need. | Cuéntame cómo es un día normal de {{name}}. Con eso calculo cuánta energía necesita. |
| `bubbleCondition` | Run your hand along {{name}}'s side and pick what feels closest. | Pasa la mano por el costado de {{name}} y elige lo que más se parezca a lo que sientes. |
| `bubbleTargetWeight` | With condition {{bcs}}, {{name}} should lose weight slowly. Did the vet give you an ideal weight? | Con condición {{bcs}} conviene que {{name}} baje de peso poco a poco. ¿Te dijo el veterinario cuál es su peso ideal? |
| `bubbleFood` | What does {{name}} eat? With the food's calories I work out how many grams to serve at each meal. | ¿Qué come {{name}}? Con las calorías de su alimento calculo cuántos gramos servir en cada comida. |
| `bubbleHealth` | Does {{name}} have any allergies or illnesses? If not, leave everything unchecked. | ¿{{name}} tiene alguna alergia o enfermedad? Si no tiene ninguna, déjalo todo sin marcar. |
| `activityLegend` | How active is {{name}}? | ¿Cuánto se mueve {{name}}? |
| `conditionLegend` | What shape are they in? | ¿Cómo está su cuerpo? |
| `targetWeightTitle` | Target weight | Peso objetivo |
| `foodLegend` | Food type | Tipo de alimento |
| `allergiesLegend` | Allergies | Alergias |
| `diseasesLegend` | Illnesses | Enfermedades |
| `activityLow` | Low | Baja |
| `activityLowDescription` | Short walks and lots of rest. | Paseos cortos y mucho descanso. |
| `activityMedium` | Medium | Media |
| `activityMediumDescription` | One or two walks a day and some play. | Uno o dos paseos al día y algo de juego. |
| `activityHigh` | High | Alta |
| `activityHighDescription` | Runs, trains or plays hard every day. | Corre, entrena o juega con intensidad cada día. |
| `bcs1` | Very thin | Muy delgado |
| `bcs1Description` | Bones very visible, no fat to the touch | Huesos muy visibles, sin grasa al tacto |
| `bcs2` | Thin | Delgado |
| `bcs2Description` | Ribs and hips visible at a glance | Costillas y cadera se ven a simple vista |
| `bcs3` | Slightly thin | Algo delgado |
| `bcs3Description` | Ribs easy to feel, clear waist | Costillas fáciles de sentir, cintura marcada |
| `bcs4` | Ideal, lean | Ideal, esbelto |
| `bcs4Description` | Ribs felt under a little fat | Costillas se sienten con poca grasa |
| `bcs5` | Ideal | Ideal |
| `bcs5Description` | Ribs can be felt, waist is visible | Costillas se sienten y la cintura se ve |
| `bcs6` | Slightly overweight | Algo de sobrepeso |
| `bcs6Description` | Some fat over the ribs, little waist | Algo de grasa en costillas, poca cintura |
| `bcs7` | Overweight | Sobrepeso |
| `bcs7Description` | Ribs hard to feel | Costillas difíciles de sentir |
| `bcs8` | Obese | Obesidad |
| `bcs8Description` | Ribs and waist can't be felt | No se sienten las costillas ni la cintura |
| `bcs9` | Severely obese | Obesidad severa |
| `bcs9Description` | Heavy fat on the neck, back and belly | Grasa abundante en cuello, lomo y vientre |
| `conditionSummary` | Condition {{bcs}}/9 · {{label}} | Condición {{bcs}}/9 · {{label}} |
| `change` | Change | Cambiar |
| `currentWeight` | {{name}}'s current weight: {{weight}} kg | Peso actual de {{name}}: {{weight}} kg |
| `targetWeightNote` | If you don't know yet, leave it empty: I'll use their current weight and you can adjust it later. | Si aún no lo sabes, déjalo vacío: calculo con su peso actual y lo ajustas después. |
| `foodDry` | Dry | Seco |
| `foodWet` | Wet | Húmedo |
| `foodMixed` | Mixed | Mixto |
| `foodHomemade` | Homemade | Casero |
| `kcalLabel` | Food calories | Calorías del alimento |
| `unitKcal` | kcal / 100 g | kcal / 100 g |
| `kcalHelp` | Between 80 and 600 kcal per 100 g. | Entre 80 y 600 kcal por cada 100 g. |
| `kcalNoteDry` | I set 350, typical for dry food. If the bag says otherwise, change it: look for metabolizable energy. | Puse 350, lo habitual en alimento seco. Si la bolsa dice otro número, cámbialo: lo encuentras como energía metabolizable. |
| `kcalNoteWet` | I set 90, typical for wet food. If the can says otherwise, change it: look for metabolizable energy. | Puse 90, lo habitual en alimento húmedo. Si la lata dice otro número, cámbialo: lo encuentras como energía metabolizable. |
| `kcalNoteMixed` | I set 220, halfway between dry and wet. If you know the exact number, change it. | Puse 220, un punto medio entre seco y húmedo. Si sabes el número exacto, cámbialo. |
| `kcalNoteHomemade` | I set 130, typical for homemade food. If your recipe says otherwise, change it. | Puse 130, lo habitual en comida casera. Si tu receta tiene otro número, cámbialo. |
| `allergyChicken` | Chicken | Pollo |
| `allergyBeef` | Beef | Carne de res |
| `allergyDairy` | Dairy | Lácteos |
| `allergyWheat` | Wheat | Trigo |
| `allergyEgg` | Egg | Huevo |
| `allergySoy` | Soy | Soya |
| `allergyFish` | Fish | Pescado |
| `other` | Other | Otra |
| `diseaseDiabetes` | Diabetes | Diabetes |
| `diseaseKidney` | Kidney disease | Enfermedad renal |
| `diseasePancreatitis` | Pancreatitis | Pancreatitis |
| `diseaseLiver` | Liver disease | Enfermedad hepática |
| `diseaseDigestive` | Digestive problems | Problemas digestivos |
| `diseaseJoints` | Joint problems | Problemas articulares |
| `otherLabel` | Which one? | ¿Cuál? |
| `otherCount` | {{count}}/40 | {{count}}/40 |
| `next` | Next | Siguiente |
| `saveAndGenerate` | Save and generate plan | Guardar y generar plan |
| `generatingTitle` | Preparing {{name}}'s plan | Preparando el plan de {{name}} |
| `generatingBody` | I'm working out their calories and splitting their meals. It takes a few seconds. | Estoy calculando sus calorías y el reparto de sus comidas. Tarda unos segundos. |
| `generatingSaved` | Profile saved | Perfil guardado |
| `generatingCalories` | Calculating calories | Calculando calorías |
| `generatingMeals` | Splitting meals | Repartiendo comidas |
| `profileEmptyBody` | Answer a few questions about {{name}} and I'll prepare their plan: how many calories they need and how many grams to serve at each meal. | Respóndeme unas preguntas sobre {{name}} y preparo su plan: cuántas calorías necesita y cuántos gramos servir en cada comida. |
| `createProfile` | Create nutrition profile | Crear perfil nutricional |
| `profileEmptyNote` | It's 4 steps, and you can change your answers anytime. | Son 4 pasos y podrás cambiar tus respuestas cuando quieras. |
| `editProfileLabel` | Edit nutrition profile | Editar perfil nutricional |

**No hay clave para «kg»**: la unidad del peso se escribe literal
(`unit="kg"`). Un valor de catálogo `'kg'` coincide con el texto JSX ` kg` de
`src/screens/health/index.tsx` y pone en rojo `#65 R18` (medido en semilla).

Ningún valor del catálogo aparece como literal entero en una fuente.

**Forma de los usos** (de ella sale la cifra de filas). `checkUses` cuenta,
por fichero, `t('<clave>'` más `labelKey: '<clave>'`:

- En `src/screens/nutrition-questionnaire/index.tsx` cada clave aparece
  exactamente una vez, salvo dos que aparecen dos veces:
  `common.somethingWentWrong` (el error de carga de R4 y `SAVE_ERRORS.generic`)
  y `nutritionQuestionnaire.other` (la fila `otra` de `ALLERGIES` y la de
  `DISEASES`).
- Las opciones son constantes de módulo con `{ labelKey: '<clave>' }`:
  `ACTIVITY_OPTIONS` (`title` y `description`), `BCS_ROWS` (`title` y
  `description`), `FOOD_TYPES` (`labelKey` y `note: { labelKey }`),
  `ALLERGIES`, `DISEASES`, `SAVE_ERRORS` (`forbidden`, `unreachable`,
  `weightRequired`, `generic`) y `GENERATING_ROWS`. El JSX las pinta con `.map`
  y `t(x.labelKey)`.
- El texto de la CTA es
  `step === 'health' ? t('nutritionQuestionnaire.saveAndGenerate') : t('nutritionQuestionnaire.next')`.
- En `src/screens/meal-schedule/index.tsx` las píldoras de R22 usan dos mapas
  de módulo, `ACTIVITY_LABEL` (`low: { labelKey: 'nutritionQuestionnaire.activityLow' }`, …)
  y `FOOD_LABEL` (`dry: { labelKey: 'nutritionQuestionnaire.foodDry' }`, …).

En `src/__tests__/ui-copy-table.ts` se añade el bloque
`export const R20_NUTRITION_QUESTIONNAIRE: UseRow[]` justo después del último
bloque, `R19_VACCINE_CREATE` (errata ronda 3: #208 ya está mergeada en
`1dbac74f`), con una fila `{ file, key }` por cada uso:

| Fichero | Filas |
|---|---|
| `src/screens/nutrition-questionnaire/index.tsx` | 82 = 73 claves nuevas (las 77 menos `profileEmptyBody`, `createProfile`, `profileEmptyNote` y `editProfileLabel`) + 7 reutilizadas (`mealSchedule.nutritionProfile`, `addPet.stepProgress`, `addPet.optional`, `common.somethingWentWrong`, `mealSchedule.errorForbidden`, `common.cannotReachServer`, `mealSchedule.registerWeightFirst`) + 2 repetidas (`common.somethingWentWrong` y `nutritionQuestionnaire.other`) |
| `src/screens/food/index.tsx` | 4: `mealSchedule.noNutritionProfileYet`, `nutritionQuestionnaire.profileEmptyBody`, `nutritionQuestionnaire.createProfile`, `nutritionQuestionnaire.profileEmptyNote` |
| `src/screens/meal-schedule/index.tsx` | 10: `nutritionQuestionnaire.editProfileLabel`, `profile.editProfile`, `nutritionQuestionnaire.createProfile`, `nutritionQuestionnaire.activityLow`, `…activityMedium`, `…activityHigh`, `nutritionQuestionnaire.foodDry`, `…foodWet`, `…foodMixed`, `…foodHomemade` |

Total: **N = 96**. El bloque se registra en estos sitios:
- en `ALL_USES`, como `...R20_NUTRITION_QUESTIONNAIRE,` justo después de
  `...R19_VACCINE_CREATE,` (errata ronda 3);
- en el array `blocks` del test `#194 R5: cuadra ALL_USES con la suma de sus bloques`,
  al final de la línea que acaba en `R19_VACCINE_CREATE,` (errata ronda 3):
  `R16_WELCOME, R17_EDIT_PROFILE, R18_DATE_FIELD, R19_VACCINE_CREATE, R20_NUTRITION_QUESTIONNAIRE,`.
  Ese `it` suma ` (enmendado por #209 R23)` al final de su nombre, detrás de
  ` (enmendado por #220 R16) (enmendado por #208 R20)`;
- en el import de `src/__tests__/ui-language.test.ts`, en su propia línea,
  `  R20_NUTRITION_QUESTIONNAIRE,`, justo después de `  R19_VACCINE_CREATE,`
  (errata ronda 3).

En `src/__tests__/ui-language.test.ts`:
- `expect(SCREEN_FILES).toHaveLength(…)` gana
  `+ 1 // #209 R23: screens/nutrition-questionnaire/index.tsx` como línea
  nueva justo después de `+ 1 // #208 R20: screens/vaccine-create/index.tsx`
  (errata ronda 3: esa línea va tras `+ 1 // #220 R16: components/date-field.tsx`).
  `food` y `meal-schedule` ya estaban. Su `it`,
  `#194 R5: no deja ningún valor fijo del catálogo como literal entero en las pantallas …`,
  suma ` (enmendado por #209 R23)` al final de su nombre, detrás de
  ` (enmendado por #208 R20)`.
- Se añade al final del fichero, después del `describe('#208 R20: alta de vacuna')`
  (errata ronda 3: ese `describe` va tras el de
  `#194 R5: la pantalla de edición resuelve su copy por clave` y hoy es el
  último), `describe('#209 R23: el cuestionario resuelve su copy por clave')` con
  `it('#209 R23: el bloque del cuestionario tiene 96 filas')`, que hace
  `expect(R20_NUTRITION_QUESTIONNAIRE).toHaveLength(96)` y
  `checkUses(R20_NUTRITION_QUESTIONNAIRE)`.

En `src/providers/__tests__/language-provider.test.tsx`, la suma del `it`
`#194 R1: mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas …`
crece en las 77 claves nuevas. (errata ronda 3) Su última línea en
`1dbac74f` es `        + 26, // #208 R19` (la de `+ 5 - 2 // #220 R16`, justo
encima, ya no lleva coma). Pierde la coma (`        + 26 // #208 R19`) y
debajo se añade `        + 77, // #209 R23`, que queda como la última. El
nombre del `it` suma ` (enmendado por #209 R23)` detrás de
` (enmendado por #208 R19)`. Sus comprobaciones de marcadores en ambos idiomas
cubren las claves nuevas sin aserción adicional. Rojo esperado sin la
enmienda (errata ronda 3: 484 claves por locale en `1dbac74f`):
`Expected length: 484` / `Received length: 561`; con ella, verde. El
`#158 R1` también lleva ` (enmendado por #208 R19)` sin cambio de aserción;
#209 no lo toca.

**Números de bloque.** `R18_DATE_FIELD` es de #220, ya en `origin/dev`
`8b4cb1bd`. `R19_VACCINE_CREATE` es de #208, mergeada en `1dbac74f`. Este
bloque es **R20**: no hay renumeración.
- Anclas (desde `mobile-pet-tracker/`, antes → después; errata ronda 3:
  medidas en `1dbac74f`):
  - `grep -cF 'R20_NUTRITION_QUESTIONNAIRE' src/__tests__/ui-copy-table.ts`:
    `0` → `3` (declaración, `ALL_USES` y `blocks`).
  - `grep -cF '...R19_VACCINE_CREATE,' src/__tests__/ui-copy-table.ts`: `1` → `1`.
  - `grep -cF 'R19_VACCINE_CREATE, R20_NUTRITION_QUESTIONNAIRE,' src/__tests__/ui-copy-table.ts`:
    `0` → `1`.
  - `grep -cF 'R20_NUTRITION_QUESTIONNAIRE' src/__tests__/ui-language.test.ts`:
    `0` → `3` (import, `toHaveLength` y `checkUses`).
  - `grep -cF '+ 1 // #208 R20: screens/vaccine-create/index.tsx' src/__tests__/ui-language.test.ts`:
    `1` → `1`.
  - `grep -cF '+ 1 // #209 R23: screens/nutrition-questionnaire/index.tsx' src/__tests__/ui-language.test.ts`:
    `0` → `1`.
  - `grep -cF '+ 5 - 2, // #220 R16' src/providers/__tests__/language-provider.test.tsx`:
    `0` → `0`.
  - `grep -cF '+ 26, // #208 R19' src/providers/__tests__/language-provider.test.tsx`:
    `1` → `0`.
  - `grep -cF '+ 26 // #208 R19' src/providers/__tests__/language-provider.test.tsx`:
    `0` → `1`.
  - `grep -cF '+ 77, // #209 R23' src/providers/__tests__/language-provider.test.tsx`:
    `0` → `1`.
  - `grep -cF '(enmendado por #209 R23)' src/__tests__/ui-copy-table.ts`,
    `src/__tests__/ui-language.test.ts` y
    `src/providers/__tests__/language-provider.test.tsx`: `0` → `1` en cada uno.
  - `grep -cF "'nutritionQuestionnaire." src/i18n/catalog.ts`: `0` → `154`
    (77 por locale).
  - `grep -cF "'dateField." src/i18n/catalog.ts`: `10` → `10` (no se toca).
  - `grep -cF "'nutritionQuestionnaire.unitKg'" src/i18n/catalog.ts` = `0`.
- Test: los guardas existentes de `src/__tests__/ui-language.test.ts`,
  `src/__tests__/ui-copy-table.ts` y
  `src/providers/__tests__/language-provider.test.tsx`, en verde, más el `it`
  `#209 R23`. Medido en semilla con la forma de arriba y la tabla `en`/`es`:
  verde con 96, sin colisiones en `#65 R18` y con los mismos marcadores en los
  dos idiomas.

**R24** — THE SYSTEM SHALL mantener en verde las guardas de carta. Cada
inventario que esta feature mueve se enmienda con la **regla mecánica**:
- cifra nueva = cifra base + delta, con el comentario `// #209 R24` delante
  de los comentarios que ya tiene la línea;
- nunca se reescribe la base;
- el `it` que contiene (o usa) la línea enmendada suma
  ` (enmendado por #209 R24)` al final de su nombre, una sola vez aunque
  tenga varias enmiendas. El resto del nombre no se toca, aunque su número
  («diecisiete primarios», «cinco secundarios») quede viejo.

(errata ronda 3) Las cifras son las del árbol base `1dbac74f` (merge de
`origin/dev` `b185ae61`, con #219, #218 y #208, en esta rama). Las bases de
ronda 2 se midieron en una semilla del scratch sobre `8b4cb1bd` que sigue la
forma de R25; las de ronda 3 se re-midieron con `grep -cF` y `node -e` sobre
`1dbac74f`, sin jest. #208 movió las bases de `#62 R1`, `#62 R12`, `#62 R14`,
`#98 R10`, `#177 R6.2` y `#177 R7.3`, y el ancla de colocación de `#62 R14` y
`#98 R10`. Ningún delta de #209 cambió. #218 y #219 no tocan estas guardas.
Comando, desde `mobile-pet-tracker/`, sin `| tail` (el código de salida es el
de jest): `timeout 580 bunx jest src/__tests__ src/app/__tests__/layout.test.tsx`.

- Base (errata ronda 3, **derivada**, la mide Codex antes del primer commit):
  exit 0, `Tests: 965 passed, 965 total` (37 suites). Son los 953 de
  `8b4cb1bd` más los 12 que suma el merge: +3 y una suite nueva
  (`sheet-surface-background.test.ts`, #218 R3), +1 en `design-drift`, +1 en
  `ui-language`, +1 en `layout.test.tsx`, +4 en chunky (dos filas de
  `CTA_ROWS`) y +2 en `consistency-classnames` (una fila de `directUses` y
  otra de `counters`).
  `hosting-artifacts.test.ts` está verde en el árbol real (7 tests); solo falla
  en una semilla a la que le falte `AGENTS.md`.
- Semilla sin enmiendas (ronda 2, sobre `8b4cb1bd`): exit 1,
  `Tests: 27 failed, 926 passed, 953 total` (6 suites en rojo).
- Con las enmiendas de R3, R23 y esta lista (errata ronda 3, derivada):
  exit 0, `Tests: 976 passed, 976 total`. Son 965 + 11: los cinco `it` nuevos
  de R3, R23 y R25, y las filas de `it.each` que generan los inventarios
  ampliados (por ejemplo, las dos filas de `CTA_ROWS` suman 4 en chunky).
- Con las suites que también enmienda esta spec (R22 y R23), el comando es
  `timeout 580 bunx jest src/__tests__ src/app/__tests__/layout.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/meal-schedule src/screens/food`.
  Con todas las enmiendas y los `it` nuevos (errata ronda 4, 2026-10-27):
  exit 0, 40 suites, **1253** tests en verde. T0 medido por Codex sobre
  `21d43079`: 1221 (965 de guardas, más 54 de `language-provider`, 80 de
  `meal-schedule` y 122 de `food`). Final: 1221 + 32 `it` nuevos (11 de
  guardas, 16 de Horario y 5 de Nutrición). La cifra de ronda 3 (1232) salía
  de la semilla de ronda 2, que no tenía los 21 `it` nuevos de Horario y
  Nutrición.

La cifra de cada enmienda depende de la **forma** que fija R25 (componentes
locales, `.map` sobre constantes y ternarios con literales completos). Si
Codex se aparta de esa forma, las cifras dejan de cuadrar.

**`src/__tests__/consistency-classnames.test.ts`**

| Candado | Base | Después |
|---|---|---|
| `#62 R1`, `rounded-16 bg-accent(?=…)` global | `toHaveLength(16 + 1 + 1 + 1 + 1 + 1)` (errata ronda 3) | `toHaveLength(16 + 1 + 1 + 1 + 1 + 1 + 2)` (CTA del wizard y CTA de Nutrición; 21 → 23) |
| `#62 R12`, `textInputs` | `toHaveLength(6 + 1 + 3); // #208 R21` (errata ronda 3) | `toHaveLength(6 + 1 + 3 + 2); // #209 R24 // #208 R21` (un `<TextInput` en `NumberField` y otro en `OtherField`; 10 → 12). `withPlaceholder` sigue en `5 + 3` (8) |
| `#62 R14`, `directUses` | — | fila `[join('screens', 'nutrition-questionnaire', 'index.tsx'), 6], // #209 R24` justo después de la de `reset-password` (`[join('screens', 'reset-password', 'index.tsx'), 1], // #205 R13`, que sigue siendo la última), y `+ 6 // #209 R24` en el agregado, justo después de su `+ 2 + 7 // #208 R21` (errata ronda 3; 64 → 70) |
| `#98 R10`, `count(style={CONTINUOUS_CORNER})` | agregado que acaba en `+ 2 + 7 // #208 R21` (errata ronda 3) | `+ 6 // #209 R24` justo después (62 → 68) |
| `#166 R2`, `expected` | — | `'screens/food/index.tsx': 1, // #209 R24` justo después de `edit-profile`, y `'screens/nutrition-questionnaire/index.tsx': 1, // #209 R24` justo después de `map` |
| `#166 R3`, `count(/border-lip-gray/g)` | `toBe(4 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1)` | `toBe(4 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 5)` (medido 12 → 17) |

Los 6 `style={CONTINUOUS_CORNER}` del wizard y los 5 `border-lip-gray` nuevos
son los que lista R25. Los 5 `border-lip-gray`: el radio sin elegir de
Actividad, el círculo «en curso» y el «pendiente» de Generando, y los dos
enlaces de Horario.

**`src/__tests__/chunky-cta-canvas-fidelity.test.ts`**

- `CTA_ROWS`: dos filas al final, tras la de `weight-log`:
  - `['screens/nutrition-questionnaire/index.tsx', literalId('nutrition-questionnaire-next'), 'h-14 rounded-16 bg-accent', ['isDisabled={!canContinue}', 'onPress={() => void handleNext()}']], // #209 R24`
  - `['screens/food/index.tsx', literalId('food-create-profile'), 'w-full h-14 rounded-16 bg-accent', ['onPress={openNutritionProfile}']], // #209 R24`

  Ninguna entra en `disabledCtas` ni lleva `KEEP_OPACITY`: la CTA del wizard
  usa `style={chunkyLip.primary}` tal cual, y `isDisabled={!canContinue}` va
  en sus `keeps`. Los nombres `canContinue`, `handleNext` y
  `openNutritionProfile` son obligatorios.
- `consumers`: se quita `'screens/food/index.tsx'` de la lista literal, que
  acaba en `// #201 R13 // #209 R24: sale screens/food/index.tsx, que entra por CTA_ROWS`.
  Si no, sale duplicado en #177 R7.4.
- `radii`: `'screens/food/index.tsx': 2` pasa a `2 + 1, // #209 R24`, y se
  añade `'screens/nutrition-questionnaire/index.tsx': 2, // #209 R24` al
  final, tras `welcome`.
- `#177 R6.2`: `count(/text-17/g)` gana `+ 2` (errata ronda 3: 33 → 35), y
  `count(/<Text className="text-17 font-extrabold text-accent-foreground">/g)`
  gana `+ 2` (errata ronda 3: 18 → 20).
- `#177 R7.1`: `count(/border-lip-gray/g)` pasa de `toBe(10 + 1 + 1)` a
  `toBe(10 + 1 + 1 + 5)` (medido 12 → 17).
- `#177 R7.3`: `count(/\brounded-16\b/g)` gana `+ 3` (CTA y resumen del
  wizard, CTA de Nutrición; errata ronda 3: 44 → 47).
- `#177 R7.5`: `inventory(/style=\{chunkyLip\.neutralCompact\}/g)` pasa a
  `{ 'screens/alerts/index.tsx': 1, 'screens/meal-schedule/index.tsx': 1 + 2 }`.
  El inventario de `primaryCompact` no cambia: el chip de Salud usa
  `style={isChecked ? chunkyLip.primaryCompact : undefined}`, que ese
  inventario no cuenta.
- `#177 R3.3`, `R7.2`, `R7.4` y `R8.1` no llevan cifra propia: se ponen
  verdes con las filas de `CTA_ROWS` y el cambio de `consumers`.

**`src/__tests__/design-drift.test.ts`**

- `describe('#209 R25: Cuestionario sin deriva')` nuevo, justo antes de
  `describe('#178 R13: Recordatorios sin deriva')`, con
  `const featureFiles = ['screens/nutrition-questionnaire/index.tsx']` y tres
  `it`. Cada uno aserta que `featureFiles.filter(…)` es `[]`:
  - `it('#209 R25: no deja hex, clases arbitrarias, StyleSheet ni sombras sueltas')`,
    con la constante `MEALS_BAR_STYLE_ESCAPES` que ya tiene el fichero;
  - `it('#209 R25: no deja text-accent suelto')`, con `/text-accent(?![-\w])/`;
  - `it('#209 R25: no trae dependencias vetadas, useThemeColor ni emoji')`,
    con `/expo-linear-gradient|expo-symbols|lottie-react-native|@rive-app|\buseThemeColor\b|\p{Extended_Pictographic}/u`.

  No se copian los `it` de radios ni de iconos de `#175 R10`: R25 usa
  `rounded-tile`, `rounded-14` y `rounded-10`, y los iconos los fija la
  decisión 12.
- `#178 R13`, diccionario de `rounded-16`: `'screens/food/index.tsx': 2, // #200 R9`
  pasa a `2 + 1, // #200 R9 // #209 R24`, y se añade
  `'screens/nutrition-questionnaire/index.tsx': 2, // #209 R24` justo
  después de `map`.
- `#178 R13`, lista de `outsideReminders(/\brounded-14\b/)`: añadir
  `join('screens', 'nutrition-questionnaire', 'index.tsx'), // #209 R24`
  justo después de `meals-history`.
- `#179 R13`, `it('limita text-22 a Horario y text-17 al inventario de E1.2 …')`:
  añadir `'screens/nutrition-questionnaire/index.tsx', // #209 R24` justo
  después de `meal-schedule` en la lista de `text-17`.
- `#179 R13`, `it('limita los márgenes táctiles a Editar y las dos flechas')`:
  `expect(schedule.match(/hitSlop=\{TOUCH_SLOP\}/g)).toHaveLength(1)` pasa a
  `toHaveLength(1 + 2)` (los dos enlaces de R20).
- `#179 R13`, `it('ancla las tres etiquetas Text con los literales de E2.3')`:
  su bucle pasa a pares `[label, parts]`, con
  `['<Text className="text-13 font-extrabold text-foreground">', 2 + 2], // #209 R24`
  y las otras dos etiquetas a `2`, y aserta
  `expect(schedule.split(label)).toHaveLength(parts)`.

**`src/__tests__/legibility-classnames.test.ts`**

- `#61 R4`, `inkSites`: fila `[join('screens', 'nutrition-questionnaire', 'index.tsx'), 1], // #209 R24`
  al final, tras la de `welcome` (el «Cambiar» `text-accent-strong`). En el
  agregado, la última línea
  `+ 1, // #198 R4: +1 Inicio` pasa a `+ 1 // #198 R4: +1 Inicio` y se añade
  `+ 1, // #209 R24` debajo.

**`src/__tests__/alerts-canvas-fidelity.test.ts`**

- `#174 R12`, lista de `rounded-10`:
  `files: ['components/segmented-control.tsx', 'screens/alerts/index.tsx', 'screens/meal-schedule/index.tsx', 'screens/nutrition-questionnaire/index.tsx'], // #179 R6; #174 R12; #209 R24`.
- `#174 R12`, listas de `text-15` y de `tracking-title`: añadir
  `'screens/nutrition-questionnaire/index.tsx', // #209 R24`, justo después
  de `meals-history` en la de `text-15` y justo después de `home` en la de
  `tracking-title`.

**`src/__tests__/profile-canvas-fidelity.test.ts`**

- `#173 R2`, lista de `rounded-tile`: añadir
  `'screens/nutrition-questionnaire/index.tsx', // #209 R24` justo después de
  `home`.
- `#173 R2.4`, lista de `text-13`: añadir la misma línea justo después de
  `meal-schedule`.

En las listas y diccionarios de rutas ordenados, el sitio citado es el que
da el orden alfabético (`map` < `meal-schedule` < `meals-history` <
`nutrition-questionnaire` < `pairing`). En `directUses`, `inkSites` y
`radii` la fila nueva va al final.

Anclas (desde `mobile-pet-tracker/`). En `1dbac74f` (errata ronda 3) todas
las de `#209` valen `0`. La
semilla puso los comentarios `// #209 R24` pero casi ningún sufijo de nombre,
así que su cuenta es un mínimo: con los sufijos ` (enmendado por #209 R24)` la
cuenta real sube en uno por cada `it` enmendado.

| Ancla | Base | Semilla (mínimo) |
|---|---|---|
| `grep -cF '#209 R24' src/__tests__/consistency-classnames.test.ts` | 0 | ≥ 8 |
| `grep -cF '#209 R24' src/__tests__/chunky-cta-canvas-fidelity.test.ts` | 0 | ≥ 10 |
| `grep -cF '#209 R24' src/__tests__/design-drift.test.ts` | 0 | ≥ 7 |
| `grep -cF '#209 R24' src/__tests__/legibility-classnames.test.ts` | 0 | ≥ 2 |
| `grep -cF '#209 R24' src/__tests__/alerts-canvas-fidelity.test.ts` | 0 | ≥ 3 |
| `grep -cF '#209 R24' src/__tests__/profile-canvas-fidelity.test.ts` | 0 | ≥ 2 |
| `grep -cF '#209 R25' src/__tests__/design-drift.test.ts` | 0 | = 4 (el `describe` y sus tres `it`) |
| `grep -cF '+ 1 - 1 - 2 // #220 R4; #220 R14; #220 R15' src/__tests__/consistency-classnames.test.ts` | 2 | 2 (errata ronda 3: ya no es la última línea de los agregados) |
| `grep -cF '+ 2 + 7 // #208 R21' src/__tests__/consistency-classnames.test.ts` | 2 | 2 (errata ronda 3: ancla de colocación de `#62 R14` y `#98 R10`) |
| `grep -cF '+ 6 // #209 R24' src/__tests__/consistency-classnames.test.ts` | 0 | 2 |
| `grep -cF "[join('screens', 'reset-password', 'index.tsx'), 1], // #205 R13" src/__tests__/consistency-classnames.test.ts` | 1 | 1 |
- Test: estas suites, en verde: `design-drift`, `consistency-classnames`,
  `chunky-cta-canvas-fidelity`, `legibility-classnames`,
  `alerts-canvas-fidelity`, `profile-canvas-fidelity` (todas en
  `src/__tests__/`) y `src/app/__tests__/layout.test.tsx` (enmiendas de R3).
  Las enmiendas de R22 (`src/screens/meal-schedule/index.test.tsx`) y de R23
  (`src/providers/__tests__/language-provider.test.tsx`) se verifican con el
  comando ampliado de arriba.

**R25** — THE SYSTEM SHALL usar exactamente estas recetas de carta, que salen
del canvas y de `docs/ui-guidelines.md` (reglas 3, 6, 7, 12 y 13; enmiendas
#187 y #197).

**Forma** (de ella salen las cifras de R24; en una semilla con esta forma,
R24 queda verde):
- Componentes locales del fichero del wizard: `NumberField`
  (`kind: 'weight' | 'kcal'`), `OtherField`, `NoteRow`, `BcsBadge`,
  `HealthChips` y `Generating`.
- Hay exactamente dos `<TextInput`: uno en `NumberField` y otro en
  `OtherField`.
- Las listas se pintan con `.map` sobre las constantes de módulo de R23.
- Los `className` que cambian con el estado son ternarios con los dos
  literales completos. La única interpolación permitida es
  `CATEGORY_SLOTS[slot].surface` / `.ink`.
- Hay un solo `const chunkyLip = useChunkyLip();` en la pantalla. Los
  componentes locales lo reciben por prop, con el tipo
  `type ChunkyLip = ReturnType<typeof useChunkyLip>;`.
- El wizard tiene exactamente seis `style={CONTINUOUS_CORNER}`: la tarjeta de
  actividad, `NumberField`, el `TextInput` de `OtherField`, `NoteRow`, la
  burbuja y la lista de Generando.

Recetas:

- **CTA primaria del wizard** (`nutrition-questionnaire-next`, la única CTA del
  pie en los cuatro pasos):
  `<Button testID="nutrition-questionnaire-next" className="h-14 rounded-16 bg-accent" style={chunkyLip.primary} isDisabled={!canContinue} onPress={() => void handleNext()}>`
  con hijo `<Text className="text-17 font-extrabold text-accent-foreground">`,
  cuyo texto es el ternario de R23. El pie es
  `View className="bg-background px-5 pt-4"` con
  `style={{ paddingBottom: Math.max(insets.bottom, 16) }}`.
- **CTA de Nutrición**:
  `<Button testID="food-create-profile" className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary} onPress={openNutritionProfile}>`,
  con el mismo hijo `Text`. El literal de `className` es ese, con `w-full`
  delante, porque `CTA_ROWS` (R24) lo busca entero.
- **Barra de pasos**: `nutrition-questionnaire-step-bar`,
  `flex-row gap-1.5 px-5`. Cada segmento es
  `h-1.5 flex-1 rounded-full bg-accent` (hecho o actual) o
  `h-1.5 flex-1 rounded-full bg-lip-gray`.
- **Tarjeta de actividad**: `Pressable`
  `flex-row items-center gap-3 rounded-tile border-2 p-3.5` +
  `style={CONTINUOUS_CORNER}`.
  - Sin elegir: `border-border bg-surface`.
  - Elegida: `border-accent bg-tab-pill`.
  - Tile del icono, `size-11 items-center justify-center rounded-14`: sin
    elegir, `CATEGORY_SLOTS.<c>.surface` con icono `.ink`; elegida,
    `bg-surface` con icono `.ink`.
  - Título `text-base font-extrabold text-foreground`.
  - Descripción `text-13 text-muted`.
  - Radio `size-6 rounded-full`: sin elegir, `border-2 border-lip-gray`;
    elegido, `items-center justify-center bg-accent` con `Check`.
- **Fila BCS**: `Pressable`
  `flex-row items-center gap-2.5 rounded-14 border-2 px-2.5 py-1.25`.
  - Sin elegir: `border-transparent bg-default`.
  - Elegida: `border-accent bg-tab-pill`.
  - Badge `size-7.5 items-center justify-center rounded-10` con banda; su
    número es `text-sm font-black`.
  - Título `text-sm font-extrabold leading-tight text-foreground`.
  - Descripción `text-xs leading-tight text-muted`.
- **Chip de tipo de alimento**: las clases de `OptionalChip` de
  `src/screens/add-pet/index.tsx`, copiadas, sin labio, con
  `hitSlop={TOUCH_SLOP}`.
  - Sin elegir: `h-11 justify-center rounded-full border border-border bg-default px-4`,
    texto `text-sm font-semibold text-foreground`.
  - Elegido: `h-11 justify-center rounded-full border border-accent bg-tab-pill px-4`,
    texto `text-sm font-bold text-foreground`.
- **Chips de Salud** (`HealthChips`): contenedor `flex-row flex-wrap gap-2`.
  Cada chip es `Pressable` `${list}-chip-${slug}`, con
  `accessibilityRole="checkbox"` y `hitSlop={TOUCH_SLOP}`.
  - Sin marcar: `h-9 justify-center rounded-full bg-default px-3`, texto
    `text-sm font-extrabold text-foreground`.
  - Marcado: `h-9 justify-center rounded-full bg-accent px-3`, texto
    `text-sm font-extrabold text-accent-foreground`.
  - El labio es `style={isChecked ? chunkyLip.primaryCompact : undefined}`.
  - Es `Pressable`, no `Button`.
- **Campo numérico** (`NumberField`): `View` con el ternario
  `h-16 flex-row items-center gap-2 rounded-14 border-2 border-accent bg-default px-4`
  (con foco) /
  `h-16 flex-row items-center gap-2 rounded-14 border-2 border-transparent bg-default px-4`
  (sin foco), más `style={CONTINUOUS_CORNER}`.
  - `TextInput` `flex-1 text-28 font-black text-foreground`, sin
    `placeholder`. Si algún día lleva uno, lleva también
    `placeholderTextColor` y `withPlaceholder` de `#62 R12` gana `+ 1`.
  - Unidad `text-lg font-extrabold text-muted` (`kind="weight"`) o
    `text-15 font-extrabold text-muted` (`kind="kcal"`).
- **Campo «Otra»** (`OtherField`): contenedor `gap-1.5`, con una fila
  `flex-row justify-between`. En ella van la etiqueta y el contador
  `${list}-other-count`, los dos `text-13 font-semibold text-muted`.
  - Debajo, un `TextInput` `${list}-other-input` con `maxLength={40}`, sin
    `placeholder`, y `style={CONTINUOUS_CORNER}`.
  - Su `className` es el ternario
    `h-12 rounded-xl border-2 border-accent bg-default px-3.5 text-15 font-semibold text-foreground`
    (con foco) /
    `h-12 rounded-xl border-2 border-transparent bg-default px-3.5 text-15 font-semibold text-foreground`
    (sin foco), que es la clase del input de `add-pet`.
- **Nota con icono** (`NoteRow`): `flex-row gap-2.5 rounded-tile bg-default px-3.5 py-3` +
  `style={CONTINUOUS_CORNER}`, con icono `InfoCircle` y texto
  `flex-1 text-13 font-semibold leading-body text-foreground`.
- **Ayuda**: `text-13 font-semibold text-muted`.
- **Resumen de Peso objetivo**:
  `flex-row items-center gap-2.5 rounded-16 bg-default px-3 py-2.5`. El
  enlace «Cambiar» es `Pressable` `h-11 justify-center` con texto
  `text-13 font-extrabold text-accent-strong` y `hitSlop={TOUCH_SLOP}`.
- **Burbuja**: `nutrition-questionnaire-bubble`,
  `flex-1 rounded-tile bg-surface-secondary px-3 py-2.5` +
  `style={CONTINUOUS_CORNER}`, con texto
  `text-13 font-semibold leading-body text-foreground`. La cola es
  `absolute -left-1.5 top-5.5 size-3 rotate-45 bg-surface-secondary`
  (`top-4.5` en Condición). Pingo mide 52 pt (44 pt en Condición), por
  `style` y sin `className` (errata ronda 6, ver R5).
- **Leyendas**: `text-lg font-black text-foreground`.
- **Error de guardado**: `<Text testID="nutrition-questionnaire-error" className="text-danger">`
  (R17).
- **Generando** (`Generating`):
  - raíz `nutrition-generating`,
    `flex-1 items-center justify-center gap-5 bg-background px-5`;
  - escenario `size-45 items-center justify-center`, con
    ``{reduceMotion ? null : [0, 1000].map((delay, index) => <PingRing key={delay} testID={`nutrition-generating-ring-${index}`} delay={delay} className="size-45 rounded-full border-3 border-accent" />)}``
    y `<PingoFloat testID="nutrition-generating-pingo">`, cuyo hijo es la
    imagen de Pingo a 112 pt por `style` (errata ronda 6, ver R16);
  - textos en un `View` `gap-2`: título
    `text-center text-24 font-black tracking-title text-foreground`, cuerpo
    `text-center text-15 font-semibold leading-note text-muted`;
  - lista `nutrition-generating-steps`, con
    `accessibilityLiveRegion="polite"`,
    `gap-3 self-stretch rounded-tile bg-default px-4 py-3.5` y
    `style={CONTINUOUS_CORNER}`;
  - cada fila es `flex-row items-center gap-3`, con un círculo:
    - hecho: `size-6.5 items-center justify-center rounded-full bg-accent`
      con `Check` de `size={16}`, y texto `text-15 font-bold text-foreground`;
    - en curso: un `View` estático
      `size-6.5 rounded-full border-3 border-lip-gray border-t-accent`, sin
      animación (decisión 13), y texto `text-15 font-extrabold text-foreground`;
    - pendiente: `size-6.5 rounded-full border-2 border-lip-gray`, y texto
      `text-15 font-semibold text-muted`.
- **Enlaces de Horario** («Editar perfil» y «Crear perfil nutricional», R20):
  `<Pressable testID="nutrition-profile-edit" hitSlop={TOUCH_SLOP} className="h-9 flex-row items-center justify-center rounded-xl border-2 border-lip-gray bg-surface px-3" style={chunkyLip.neutralCompact} onPress={openNutritionProfile}>`
  (y lo mismo con `testID="nutrition-profile-create"`), con hijo
  `<Text className="text-13 font-extrabold text-foreground">`.
  - No es `Button`, para no mover los inventarios de `Button` neutro.
  - `hitSlop` lleva el área táctil de `h-9` (36 pt) a 44 pt.
- **NutricionSinPerfil** (`food-profile-empty`):
  - sección `items-center gap-3`;
  - escenario `h-50 w-55 items-center justify-center`, con un disco
    `absolute size-47.5 rounded-full bg-surface-secondary` y
    `<PingoFloat testID="food-profile-pingo">`, cuyo hijo es la imagen de
    Pingo a 150 pt por `style` (errata ronda 6, ver R19);
  - título `text-center text-24 font-black tracking-title`;
  - texto `text-center text-15 font-medium leading-normal text-muted`;
  - nota `text-center text-13 font-semibold text-muted`.
- **Dimensiones del wizard**: `paddingHorizontal: 20`, `paddingTop: 12` y
  `gap: 16` (`14` en Condición), como en `add-pet`.

Prohibido:
- hex fuera de `theme/`;
- clases arbitrarias `[...]`;
- `StyleSheet.create`;
- pasar `text-13`/`text-15`/`text-17` a componentes de HeroUI (enmienda #187);
- un labio que no venga de `useChunkyLip()` (enmienda #197).

- Test: `src/__tests__/design-drift.test.ts` ›
  `describe('#209 R25: Cuestionario sin deriva')`, con los tres `it` que fija
  R24, más las suites de R24.
- Ancla (desde `mobile-pet-tracker/`):
  `grep -cF '#209 R25' src/__tests__/design-drift.test.ts`: `0` antes, `4`
  después.

**R26** — THE SYSTEM SHALL añadir a `docs/ui-guidelines.md`, al final, la
sección literal siguiente:

```markdown
## Enmienda #209 — Cuestionario de nutrición

- Los anillos de ping de `CuestionarioGenerando` (`src/screens/nutrition-questionnaire/index.tsx`) quedan permitidos: dos `PingRing` con `MOTION_PING_TIMING`, ninguno con movimiento reducido. Es la excepción a «Ninguna otra pantalla usa anillos de ping sin una enmienda propia» (#167).
- Fuera de la escala, por fidelidad al canvas (#209): tarjetas de actividad y lista de Generando en `rounded-tile`, filas BCS y campos numéricos en `rounded-14`, badges BCS en `rounded-10`, resumen de peso objetivo en `rounded-16`.
- Chips de Salud: receta de chip elegido de la regla 13 (`rounded-full bg-accent` + `chunkyLip.primaryCompact`); chips de tipo de alimento: receta de `OptionalChip`, sin labio.

- [ ] Enmienda #209 aprobada por humano
```

La casilla tiene el mismo formato que las de las enmiendas previas
(`- [X] Enmienda #206 aprobada por humano`). Codex la commitea sin marcar.
La marca el humano, porque las enmiendas de `docs/ui-guidelines.md` no están
delegadas. R26 no cierra hasta entonces.
- Anclas (desde `mobile-pet-tracker/`):
  - `grep -cF '## Enmienda #209' ../docs/ui-guidelines.md`: `0` antes, `1`
    después.
  - `grep -cE -- '- \[[ xX]\] Enmienda #209 aprobada por humano' ../docs/ui-guidelines.md`
    = `1`.
- Test: el reviewer ejecuta las anclas. No hay test de jest.

## Fuera de alcance

- Premios y snacks, alimentación mixta detallada (proporción seco/húmedo) y
  objetivo explícito (bajar o subir de peso). El motor no los modela.
- La píldora «Edad» del artboard HorarioEditarPerfil.
- Pintar `aiStatus` o `aiProposal` de la respuesta de generate (#212 y
  posteriores).
- El enlace «Ver el plan de Rocky» de Generando, la huella del escenario de
  NutricionSinPerfil y el lápiz de «Editar perfil» (decisión 13).
- Editar o borrar elementos conservados que no coinciden con ningún chip (R15)
  más allá del primero.
- Cambios en el backend.

## Reglas para la implementación

- Worktree `/home/claude/sites/Pet-Tracker-wt-209`, rama
  `feature/209-mobile-nutrition-questionnaire`, PR a `dev`.
- **Commits test-primero**: por cada R-id, o grupo contiguo declarado en
  `tasks.md`, va primero un commit `test(mobile): #209 R<n> rojo` con el test
  en rojo y después `feat(mobile): #209 R<n> ...`. Nada de implementación,
  tests y docs en un solo commit.
- Prohibido correr `./init.sh` y e2e. Los tests se lanzan con
  `cd /home/claude/sites/Pet-Tracker-wt-209/mobile-pet-tracker && bunx jest <ruta> -t '#209 R<n>:'`.
  Con los dos puntos, `-t '#209 R1:'` no recoge `R10`–`R19`. Las rutas con
  paréntesis se escapan.
- Si `origin/dev` avanza, se hace `git merge origin/dev`, nunca rebase.
  Después se re-miden los agregados de R3, R22, R23 y R24 con la regla
  mecánica. #220 ya está en `8b4cb1bd`. (errata ronda 3) #208, #218 y #219
  ya están en `1dbac74f` (dev `b185ae61`), y la re-medida tras ese merge es
  la ronda 3 de `progress/firma_mobile-nutrition-questionnaire.md`. #209
  conserva los deltas y sufijos de #208 delante de los suyos (lista de
  agregados compartidos en `design.md` §Riesgos).
- (errata ronda 3) #209 no importa `@expo/ui/community/bottom-sheet`: el
  `#218 R3` de `src/__tests__/sheet-surface-background.test.ts` solo admite
  `pairing` y `reminders`.
- No hay dependencias nuevas, ni costo, ni recursos AWS.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-26) ← gate obligatorio antes de implementar
- [ ] Smoke de #209 en dev build por el humano (fecha: ____): teclado con KAV en los campos
      numéricos y en «otra», anillos de ping de Generando, guardar el perfil y generar el plan.
      Va en el lote G4 de `progress/smoke_mejoras-producto.md`. No bloquea tareas; bloquea `done`.
