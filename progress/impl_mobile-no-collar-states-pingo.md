# Implementación #159 mobile-no-collar-states-pingo

```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-159
$ git branch --show-current
feature/159-mobile-no-collar-states-pingo
$ git rev-parse --short HEAD
f9fb79ed
$ git status --short
```

H0: `f9fb79ed`. Status vacío. Guion exclusivo: bloque del handoff.

BASE inicial: `git fetch origin` correcto; `git merge-base --is-ancestor origin/main HEAD`: exit=0. `node_modules`: presente. Router generado: exit=0. `pgrep -af '[i]nit\.sh'`: vacío (exit=1 esperado).

Skills cargadas: `building-native-ui`, `appllama-app-design-skill`, `emil-design-eng` y `ponytail:ponytail`. La spec y la carta prevalecen: se reutiliza EmptyState, sin assets ni motion; smoke Android del humano.

## Anclas en H0

A1:
```text
$ test ! -e mobile-pet-tracker/.expo/types/router.d.ts && echo ok
ok
```

A2:
```text
$ git merge-base --is-ancestor 65f37841 HEAD && echo ok
ok
```

A3:
```text
$ grep -cF '+ 5, // #155 R1' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
1
```

A4:
```text
$ grep -cF "['geofences.needsCollar', 'Safe zones require a collar', 'Las zonas seguras requieren un collar']," mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
1
```

A5:
```text
$ grep -cF 'expect(R4_MAP).toHaveLength(17 + 2); // +2 #155 R4' mobile-pet-tracker/src/__tests__/ui-language.test.ts
1
```

A6:
```text
$ grep -cF 'expect(R14_GEOFENCES).toHaveLength(18 + 1); // +1 #155 R8' mobile-pet-tracker/src/__tests__/ui-language.test.ts
1
```

A7:
```text
$ grep -cF "{ file: 'src/screens/map/index.tsx', key: 'map.trackingNeedsCollar' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
1
```

A8:
```text
$ grep -cF "{ file: 'src/screens/geofences/index.tsx', key: 'geofences.needsCollar' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
1
```

A9:
```text
$ grep -cF "{ file: 'src/screens/geofence-editor/index.tsx', key: 'geofences.needsCollar' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
1
```

A10:
```text
$ grep -cF "['src/screens/map/index.tsx', 1]," mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
1
```

A11:
```text
$ grep -cF "['src/screens/geofences/index.tsx', 1]," mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
1
```

A12:
```text
$ grep -cF "t('map.trackingNeedsCollar')" mobile-pet-tracker/src/screens/map/index.tsx
1
```

A13:
```text
$ grep -cF '<Text testID="map-no-tracking" className="text-center text-muted">' mobile-pet-tracker/src/screens/map/index.tsx
1
```

A14:
```text
$ grep -cF '<Card testID="geofences-no-tracking" className="items-center py-8">' mobile-pet-tracker/src/screens/geofences/index.tsx
1
```

A15:
```text
$ grep -cF "const canSetLostMode = selectedPet?.myRole === 'owner';" mobile-pet-tracker/src/screens/map/index.tsx
1
```

A16:
```text
$ grep -cF "'El rastreo en vivo requiere un collar'," mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

A17:
```text
$ grep -cF "it('pinta el 402 sin Reintentar'" mobile-pet-tracker/src/screens/geofences/index.test.tsx
1
```

A18:
```text
$ grep -cF "it('pinta el 402 sin Reintentar'" mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
1
```

A19:
```text
$ grep -cF 'Las zonas seguras requieren un collar' mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
2
```

A20:
```text
$ grep -cF "'La actividad requiere un collar'" mobile-pet-tracker/src/screens/home/index.test.tsx
3
```

A21:
```text
$ grep -cF 'const mockRouter = jest.mocked(router);' mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

A22:
```text
$ grep -cF '### §2.21 — Añadidos por #155 — Pingo en los estados vacíos' specs/mobile-ui-language/design.md
1
```

A23:
```text
$ grep -cF '### §2.23' specs/mobile-ui-language/design.md
0
```

A24:
```text
$ grep -cF '## 3. La infraestructura' specs/mobile-ui-language/design.md
1
```

A25:
```text
$ grep -cF 'el tab Map muestra `Live tracking requires a collar`' docs/verification.md
1
```

A26:
```text
$ grep -cF 'map.trackingNeedsCollar' mobile-pet-tracker/src/i18n/catalog.ts
2
```

A27:
```text
$ grep -cE "^\s+'(map\.noTrackingTitle|map\.noTrackingBody|geofences\.noTrackingTitle|geofences\.noTrackingBody)':" mobile-pet-tracker/src/i18n/catalog.ts
0
```

A28:
```text
$ grep -cE "react-native-reanimated|\bAnimated\b|LayoutAnimation|entering=|MOTION_" mobile-pet-tracker/src/screens/map/index.tsx mobile-pet-tracker/src/screens/geofences/index.tsx
mobile-pet-tracker/src/screens/map/index.tsx:0
mobile-pet-tracker/src/screens/geofences/index.tsx:0
```

H1:
```text
$ grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-09)' specs/mobile-no-collar-states-pingo/requirements.md
1
```

H2:
```text
$ grep -cF -- '- [ ] Prueba de humo R10 superada en dev build de Android (fecha: ____)' specs/mobile-no-collar-states-pingo/requirements.md
1
```

H3:
```text
$ grep -cF '"status": "in_progress"' feature_list.json
1
```

H4:
```text
$ grep -rlF '#159' mobile-pet-tracker/src | wc -l
0
```

H5:
```text
$ grep -cF "describe('#159" mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
0
```

H6:
```text
$ grep -cF 'function makeDevice(connectivity: string | null): DeviceStatus {' mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

H7:
```text
$ grep -cF 'function pending<T>(): Promise<T> {' mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

H8:
```text
$ grep -cF "function petState(myRole: PetProfile['myRole'] = 'owner'): PetState {" mobile-pet-tracker/src/screens/geofences/index.test.tsx
1
```

H9:
```text
$ grep -cF "function mount(language: Language = 'es', onUnauthorized?: () => void, seedRole = false) {" mobile-pet-tracker/src/screens/geofences/index.test.tsx
1
```

H10:
```text
$ grep -cF "const isOwner = pet.data?.kind === 'ok' && pet.data.pet.myRole === 'owner';" mobile-pet-tracker/src/screens/geofences/index.tsx
1
```

H11:
```text
$ grep -cF 'testID="summary-note"' mobile-pet-tracker/src/screens/home/index.tsx
1
```

H12:
```text
$ grep -cF 'testID={`${testID}-action`}' mobile-pet-tracker/src/components/empty-state.tsx
1
```

H13:
```text
$ grep -cF "t('home.pairCollar')" mobile-pet-tracker/src/screens/map/index.tsx
0
```

H14:
```text
$ grep -cF "router.push('/pairing')" mobile-pet-tracker/src/screens/map/index.tsx
0
```

H15:
```text
$ grep -cF 'function languageDesign(): string {' mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
1
```

H16:
```text
$ grep -cF "describe('R5: mascota free degrada sin mapa'" mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

H17:
```text
$ grep -cF "it('shows the collar requirement without map, stats, lost mode, or polling'" mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

H18:
```text
$ grep -cF "describe('#41 R5: la pantalla pinta la lista de zonas y sus estados'" mobile-pet-tracker/src/screens/geofences/index.test.tsx
1
```

H19:
```text
$ grep -cF "describe('#146 R6: el editor pinta el formulario sobre el mapa y sus estados'" mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
1
```

H20:
```text
$ grep -cF "describe('#146 R8: Guardar crea o actualiza la zona y vuelve a la lista'" mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
1
```

H21:
```text
$ grep -cF "it('registra las once claves en los dos idiomas y en la tabla de la spec de idioma'" mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
1
```

H22:
```text
$ grep -cF "it('explains that activity tracking requires a collar'" mobile-pet-tracker/src/screens/home/index.test.tsx
1
```

H23:
```text
$ grep -cF "it('pinta un guion y la nota cuando el perfil tampoco resuelve'" mobile-pet-tracker/src/screens/home/index.test.tsx
1
```

H24:
```text
$ grep -cE '<Card\s+testID="geofence-editor-no-tracking"' mobile-pet-tracker/src/screens/geofence-editor/index.tsx
1
```

H25:
```text
$ grep -cF '(child.props.testID ?? child.type)' mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

H26:
```text
$ grep -cF '(child.props.testID ?? child.type)' mobile-pet-tracker/src/screens/geofences/index.test.tsx
1
```

HEAD del handoff: f9fb79ed076b8aae7115e02a0634fdf4c86270d6

## BASE

`FORCE_COLOR=0 bunx jest (10 ficheros del comando BASE) > /tmp/159-base.txt 2>&1; echo "exit=$?"`

```text
Test Suites: 10 passed, 10 total
Tests:       699 passed, 699 total
exit=0
```

## ALL base

`FORCE_COLOR=0 bunx jest > /tmp/159-all-base.txt 2>&1; echo "exit=$?"`

```text
Test Suites: 97 passed, 97 total
Tests:       2365 passed, 2365 total
exit=0
```

## c1

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-r1.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       13 failed, 64 passed, 77 total
exit=1
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › declara map.noTrackingTitle en inglés y en español

    expect(received).toBe(expected) // Object.is equality

    Expected: "No live location"
    Received: undefined
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › declara map.noTrackingBody en inglés y en español

    expect(received).toBe(expected) // Object.is equality

    Expected: "Once your pet has a collar with an active plan, I'll show you where they are."
    Received: undefined
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › declara geofences.noTrackingTitle en inglés y en español

    expect(received).toBe(expected) // Object.is equality

    Expected: "Safe zones unavailable"
    Received: undefined
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › declara geofences.noTrackingBody en inglés y en español

    expect(received).toBe(expected) // Object.is equality

    Expected: "Once your pet has a collar with an active plan, I'll let you know if they leave a safe zone."
    Received: undefined
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › map.noTrackingBody no exclama, no lleva emoji y termina en punto en los dos idiomas

    expect(received).toBe(expected) // Object.is equality

    Expected: "string"
    Received: "undefined"
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › geofences.noTrackingBody no exclama, no lleva emoji y termina en punto en los dos idiomas

    expect(received).toBe(expected) // Object.is equality

    Expected: "string"
    Received: "undefined"
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › map.noTrackingTitle no exclama, no lleva emoji y no termina en punto en los dos idiomas

    expect(received).toBe(expected) // Object.is equality

    Expected: "string"
    Received: "undefined"
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › geofences.noTrackingTitle no exclama, no lleva emoji y no termina en punto en los dos idiomas

    expect(received).toBe(expected) // Object.is equality

    Expected: "string"
    Received: "undefined"
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › abre la sección §2.23 en mobile-ui-language tras §2.21 y antes de la infraestructura

    expect(received).toContain(expected) // indexOf

    Expected substring: "### §2.23 — Añadidos por #159 — Pingo sin collar"
    Received string:    "---
    feature: \"mobile-ui-language\"
    status: approved     # draft | approved
    tags: [harness, spec]
    ---·
    # Diseño — [[mobile-ui-language]]·
    > Ver [[requirements]] para los requisitos que este diseño implementa,
    > [[copy-review]] para la hoja de revisión humana de la copy (no normativa),
    > [[../../docs/ui-guidelines|ui-guidelines]] (carta de UI) y
    > [[../../docs/conventions|conventions]] para las reglas que la implementación
    > debe respetar. Fuente del alcance: `progress/explore_design-gap-vs-make.md`
    > §4 y su ampliación del 2026-09-05. Fuente del vocabulario español:
    > `specs/mobile-figma-polish/design-src/App.tsx` (el export del Figma Make ya
    > versionado en el repo).·
    Esta spec es **autosuficiente**: Codex CLI no ve la conversación que la
    originó. Todo el copy y todas las claves están en §2. **Codex no redacta texto
    de producto y no inventa claves**: si encuentra una cadena visible que no está
    en la tabla, para y lo anota en `progress/impl_mobile-ui-language.md`.·
    ---·
    ## 1. El inventario·
    ### 1.1 Método (el reviewer lo repite)·
    Se leyó **entero** cada uno de los 37 ficheros `.ts`/`.tsx` no-test de
    `mobile-pet-tracker/src/` y se anotó cada literal que el usuario ve: hijos de
    `<Text>`, `label=`, `placeholder=`, `accessibilityLabel=`, los argumentos de
    `Alert.alert`, las etiquetas de las tablas `REMINDER_TYPE_META`,
    `ADVANCE_OPTIONS` y `TABS`, y las cadenas que pasan por
    `setError`/`setFormError`/`setActionError`/`setGeneralError`/`setPhotoError`/
    `setGenerateError` para acabar en un `<Text>`. **Excluidos**: `className`,
    `testID`, rutas, estilos, claves de objeto, valores de dominio (`'dog'`,
    `'female'`, `'online'`) y los `throw new Error` de los providers, que solo ve
    un desarrollador.·
    Cada fila de §2 se verificó con un script que abre el archivo y comprueba que
    el literal está **realmente** en la línea declarada (o en el par de líneas que
    ocupa un texto JSX partido). **320 de 320 filas verifican** contra `a44925f`.·
    ### 1.2 Resultado·
    | Métrica | Informe §4 | **Esta spec** | Nota |
    |---|---|---|---|
    | Cadenas inglesas **distintas** | ~214 | **213** | El informe daba un «~»; `· in ${days} days` se cuenta como **una** plantilla, no dos fragmentos |
    | Ocurrencias **inglesas** | — | **309** | |
    | Ocurrencias **ya en español** | 10 | **11** | 8 en `profile`, 2 en `add-pet`, 1 en `docs`. El informe contó 7 en `profile` y se dejó el `'No registrado'` de `InfoRow` (`profile/index.tsx:49`) |
    | **Ocurrencias de copy totales** | — | **320** | Lo que el catálogo tiene que cubrir |
    | **Claves** del catálogo | — | **255** | 241 de la copy inglesa + 11 de la ya española + 3 del interruptor (§3.3) |
    | Ficheros de fuente afectados | — | **19** | De 37 no-test; los 13 de `src/api/` y los 5 de `src/theme/` están limpios |
    | Puntos de test anclados a copy | 166 | **178** en **19** ficheros | Conteo por **literal**: cada string o regex de un fichero de test que contiene una cadena de la tabla, descontando a mano (a) títulos de `describe`/`it`, (b) `className`/`testID`, (c) **10** literales que son mensajes de validación **del backend** y se quedan en inglés, (d) **4** de `auth-provider.test.tsx` que rotulan botones del propio arnés, y (e) el directorio `src/api/__tests__/` entero, que no renderiza UI |
    | Consultas por `testID` | 796 | **796** | Confirmado |
    | Llamadas `*ByText(`/`toHaveTextContent(` | — | **246** (102 + 144) | |
    | Plantillas con `${}` en texto visible | 31 (leader) | **33 sitios**, **11 son copy** | Enumeradas en §2.12 |
    | Snapshots con copy | 0 | **0** | El único `.snap` es la ruta SVG de blobatar |
    | Cadenas de usuario en `src/api/` | 0 | **0** | Los 13 módulos devuelven uniones por `kind` |·
    ### 1.3 Reparto por archivo (320 ocurrencias, 19 archivos)·
    | Archivo | Ocurrencias | R-id |
    |---|---:|---|
    | `src/screens/pairing/index.tsx` | 40 | R10 |
    | `src/screens/add-pet/index.tsx` | 40 | R9 |
    | `src/screens/profile/index.tsx` | 28 | R7 |
    | `src/screens/add-reminder/index.tsx` | 22 | R8 |
    | `src/screens/reminders/index.tsx` | 21 | R8 |
    | `src/app/(tabs)/home.tsx` | 20 | R3 |
    | `src/app/(tabs)/map.tsx` | 19 | R4 |
    | `src/app/(tabs)/meal-schedule.tsx` | 19 | R6 |
    | `src/app/(tabs)/weight-log.tsx` | 18 | R5 |
    | `src/app/(tabs)/food.tsx` | 16 | R6 |
    | `src/screens/reset-password/index.tsx` | 15 | R11 |
    | `src/app/(auth)/register.tsx` | 14 | R1 |
    | `src/app/(tabs)/health.tsx` | 13 | R5 |
    | `src/app/(auth)/login.tsx` | 10 | R1 |
    | `src/screens/docs/index.tsx` | 7 | R7 |
    | `src/utils/reminder-meta.ts` | 7 | R8 |
    | `src/screens/forgot/index.tsx` (movida por #117) | 12 | R1 |
    | `src/components/floating-tab-bar.tsx` | 5 | R2 |
    | `src/components/weight-chart.tsx` | 1 | R5 |·
    ### 1.4 Reparto por fichero de test (178 anclas, 19 ficheros)·
    | Fichero de test | Anclas |
    |---|---:|
    | `src/screens/pairing/index.test.tsx` | 36 |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 21 |
    | `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 16 |
    | `src/app/(tabs)/__tests__/home.test.tsx` | 14 |
    | `src/screens/reminders/index.test.tsx` | 14 |
    | `src/screens/add-reminder/index.test.tsx` | 13 |
    | `src/app/(tabs)/__tests__/food.test.tsx` | 12 |
    | `src/app/(tabs)/__tests__/health.test.tsx` | 10 |
    | `src/app/(tabs)/__tests__/weight-log.test.tsx` | 10 |
    | `src/screens/reset-password/index.test.tsx` | 7 |
    | `src/app/(auth)/__tests__/register.test.tsx` | 5 |
    | `src/components/__tests__/floating-tab-bar.test.tsx` | 5 |
    | `src/app/(auth)/__tests__/login.test.tsx` | 4 |
    | `src/screens/add-pet/index.test.tsx` | 4 |
    | `src/screens/profile/index.test.tsx` | 3 |
    | `src/__tests__/legibility-classnames.test.ts` | 1 |
    | `src/screens/forgot/index.test.tsx` (movida por #117) | 1 |
    | `src/app/(tabs)/__tests__/screens.test.tsx` | 1 |
    | `src/components/__tests__/weight-chart.test.tsx` | 1 |·
    `src/screens/docs/index.test.tsx` no aparece: sus aserciones de texto ya son
    españolas o de fixture, y **siguen valiendo** porque el idioma por defecto es
    español.·
    ---·
    ## 2. El catálogo (normativo)·
    ### 2.0 Decisiones de catálogo·
    - **D1 — Esquema de claves: `<ámbito>.<nombreEnCamelCase>`, ámbito por
      pantalla.** El ámbito es el slug de la pantalla o del módulo
      (`login`, `forgot`, `register`, `tabs`, `home`, `map`, `health`, `weightLog`,
      `weightChart`, `food`, `mealSchedule`, `profile`, `docs`, `reminders`,
      `reminderType`, `addReminder`, `addPet`, `pairing`, `resetPassword`), más un
      ámbito `common` (D3). El nombre se deriva del **inglés**, no del español, en
      camelCase, con un máximo de cuatro palabras. Dos razones: el inglés es el
      idioma del código en este repo (`docs/conventions.md` §Commits), y **el
      español es lo que puede cambiar** en la revisión del humano — una clave
      derivada del español obligaría a renombrar claves cada vez que el humano
      ajuste una palabra.
      Es legible en el sitio de uso: `t('login.signIn')`, `t('pairing.unpairAlertTitle')`,
      `t('home.summaryTitle')`. No hay anidamiento (`login.form.email`): un solo
      nivel, porque dos niveles no aportan nada con 255 claves y complican el tipo.·
    - **D2 — El ámbito es por pantalla incluso cuando el texto coincide, y por eso
      hay 255 claves y no 213.** 213 es el número de **cadenas inglesas
      distintas**; las claves están acotadas, así que la misma cadena con dos
      significados son dos claves. **Y tiene que serlo**: `Food` es `Nutrición` en
      la pestaña (`tabs.food`) y `Comida` como tipo de recordatorio
      (`reminderType.food`); un catálogo plano por cadena las colisionaría y
      obligaría a elegir una sola traducción para las dos. El precio de duplicar
      una cadena de tres palabras en un objeto es cero; el precio de no poder
      divergir después es un refactor.·
    - **D3 — `common` solo para lo que se repite mucho, con umbral numérico.** Una
      cadena sube a `common` si aparece **≥5 veces en ≥5 archivos**. Cumplen
      exactamente cuatro, y son las cuatro genéricas de estado que nadie va a
      querer que diverjan por pantalla:·
      | Clave | `en` | `es` | Usos / archivos |
      |---|---|---|---:|
      | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` | 31 / 13 |
      | `common.retry` | `Retry` | `Reintentar` | 14 / 10 |
      | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` | 10 / 9 |
      | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` | 5 / 5 |·
      Cubren **60 de las 320** ocurrencias. La siguiente candidata (`Email`, 3/3)
      no llega al umbral y se queda acotada. El umbral es una regla, no un gusto:
      si mañana una quinta cadena llega a 5/5, sube.·
    - **D4 — Manda la palabra del diseño.** Donde el Make ya da la palabra en
      español se usa **ésa**: `En línea` (`design-src/App.tsx:358`), `Nutrición`
      (`:758`, etiqueta de la pestaña `food`), `Objetivo diario` (`:607`),
      `kcal / día` (`:609`), `Comidas hoy` (`:626`), `Servido` (`:639`),
      `Recomendación IA` (`:645`), `Cambiar foto` (`:683`), `Horarios y porciones`
      (`:1465`), `Activos`/`Esta semana`/`Inactivos` (`:933-935`), `¡Próximo!`
      (`:955`), `Agregar recordatorio` (`:1013`),
      `Vacuna`/`Medicamento`/`Consulta`/`Otro` (`:979-983`), `Nueva mascota`
      (`:1145`), `Tipo de mascota` (`:1194`), `Raza`/`Sexo`/`Tamaño`
      (`:1210, 1222, 1238`), `Esterilizado/a` (`:1262`), `Guardar mascota`
      (`:1304`), `Peso (kg)` (`:1573`), `Fecha` (`:1582`),
      `Batería`/`Conexión` (`:1639-1640`),
      `Nombres`/`Apellidos`/`Correo electrónico`/`País` (`:309-313`), `Contraseña`
      (`:227`), `Iniciar sesión` (`:224`), `¿Olvidaste tu contraseña?` (`:231`),
      `Crear cuenta` (`:290`), `Recuperar contraseña` (`:258`),
      `Volver al inicio de sesión` (`:270`, sin la flecha).·
    - **D5 — Tuteo, imperativo, sin punto final en botones y etiquetas.** Los
      mensajes y las frases completas conservan el punto si ya lo llevaban en
      inglés; ninguna cadena gana o pierde puntuación por su cuenta.·
    - **D6 — Las 11 cadenas que ya estaban en español entran al catálogo con su
      texto intacto en `es`**, y su columna `en` es traducción inversa que fija
      esta tabla (`Documentos` → `Documents`, `Datos básicos` →
      `Basic details`…). No se re-redactan para parecerse al Make: `Dispositivo
      GPS` se queda, aunque el diseño diga `Collar GPS`. Van marcadas
      *(ya en español)* en las tablas.·
    - **D7 — Las unidades no entran al catálogo.** `kg`, `km`, `km/h`, `kcal`,
      `g`, `%` y la `h`/`m` de `fmtMinutes` (`1h 35m`) son símbolos y siguen
      siendo literales en su formateador. Sí entra `ago`, que es una palabra
      (§2.12). La asimetría `m` (duración) frente a `min` (tiempo transcurrido) es
      deliberada: `hace 2 m` no se lee.·
    - **D8 — Las máscaras de fecha se traducen, el parseo no.** `YYYY-MM-DD` →
      `AAAA-MM-DD` es texto de ayuda; el valor que `weight-log` envía sigue siendo
      ISO y `localTodayIso()` no se toca. Igual con `BC n/9` → `CC n/9`.·
    - **D9 — Los emoji no son copy.** Los 7 de `REMINDER_TYPE_META` y el `📄` de
      `docs` se quedan como están: #62 ya declaró que sustituirlos es feature
      aparte. Lo que sale de `REMINDER_TYPE_META` al catálogo es **solo el
      `label`** (§3.5).·
    ### 2.x — Cómo leer las tablas·
    `Línea` es la del commit base `a44925f`; si #64 entra antes, la línea se
    desplaza y **la cadena sigue siendo el ancla**. `Clave` es normativa: es lo que
    Codex escribe en el `t(...)`. `(param)` marca las 11 entradas con
    interpolación (§2.12); *(ya en español)* marca las 11 de D6. Las claves
    `common.*` aparecen repetidas en varios grupos: el recuento de «claves» de cada
    cabecera las incluye, así que **la suma de los grupos es mayor que 252**; el
    total sin repetir es 252 + 3 del interruptor = **255**.··
    ### §2.1 — R1 — grupo `(auth)` (36 ocurrencias, 28 claves)·
    **`mobile-pet-tracker/src/app/(auth)/login.tsx`** — 10 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 31 | `login.invalidCredentials` | `Invalid credentials` | `Credenciales inválidas` |
    | 34 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 41 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 44 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 66 | `login.signIn` | `Sign in` | `Iniciar sesión` |
    | 70 | `login.email` | `Email` | `Correo electrónico` |
    | 83 | `login.password` | `Password` | `Contraseña` |
    | 107 | `login.signIn` | `Sign in` | `Iniciar sesión` |
    | 117 | `login.createAccount` | `Create account` | `Crear cuenta` |
    | 126 | `login.forgotPassword` | `Forgot password?` | `¿Olvidaste tu contraseña?` |·
    **`mobile-pet-tracker/src/screens/forgot/index.tsx`** — 12 ocurrencias (movido por #117 desde src/app/(auth)/forgot.tsx)·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `forgot.forgotPassword` | `Forgot password` | `Recuperar contraseña` |
    | — | `forgot.comingSoon` ← retirada por #117 (R1) | `Password recovery coming soon` | `La recuperación de contraseña estará disponible pronto` |
    | — | `forgot.email` | `Email` | `Correo electrónico` |
    | — | `forgot.sendRecoveryLink` | `Send recovery link` | `Enviar enlace de recuperación` |
    | — | `forgot.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | — | `forgot.instructions` ← añadida por #117 (R1) | `Enter the email linked to your account and we'll send you a link to reset your password.` | `Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.` |
    | — | `forgot.checkYourEmail` ← añadida por #117 (R1) | `Check your email` | `Revisa tu correo` |
    | — | `forgot.sentTo` ← añadida por #117 (R1) | `If an account exists for {{email}}, we sent a link to reset your password. Check your inbox and spam folder.` | `Si existe una cuenta para {{email}}, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.` |
    | — | `forgot.resend` ← añadida por #117 (R1) | `Resend` | `Reenviar` |
    | — | `forgot.invalidEmail` ← añadida por #117 (R1) | `Enter a valid email address` | `Ingresa un correo electrónico válido` |
    | — | `forgot.tooManyAttempts` ← añadida por #117 (R1) | `Too many attempts. Try again later.` | `Demasiados intentos. Inténtalo más tarde.` |
    | — | `common.cannotReachServer` ← uso añadido por #117 (R7) | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | — | `common.somethingWentWrong` ← uso añadido por #117 (R7) | `Something went wrong` | `Algo salió mal` |·
    **`mobile-pet-tracker/src/app/(auth)/register.tsx`** — 14 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 120 | `register.emailAlreadyRegistered` | `Email already registered` | `Ese correo ya está registrado` |
    | 129 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 133 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 136 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 156 | `register.createAccount` | `Create account` | `Crear cuenta` |
    | 161 | `register.firstName` | `First name` | `Nombres` |
    | 176 | `register.lastName` | `Last name` | `Apellidos` |
    | 188 | `register.email` | `Email` | `Correo electrónico` |
    | 201 | `register.phone` | `Phone` | `Teléfono` |
    | 214 | `register.password` | `Password` | `Contraseña` |
    | 228 | `register.confirmPassword` | `Confirm password` | `Confirmar contraseña` |
    | 244 | `register.country` | `Country (2-letter code)` | `País (código de 2 letras)` |
    | 263 | `register.iAcceptTerms` | `I accept the terms` | `Acepto los términos` |
    | 279 | `register.createAccount` | `Create account` | `Crear cuenta` |··
    ### §2.2 — R2 — barra de pestañas (5 ocurrencias, 5 claves)·
    **`mobile-pet-tracker/src/components/floating-tab-bar.tsx`** — 5 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 49 | `tabs.home` | `Home` | `Inicio` |
    | 50 | `tabs.map` | `Map` | `Mapa` |
    | 51 | `tabs.health` | `Health` | `Salud` |
    | 52 | `tabs.food` | `Food` | `Nutrición` |
    | 53 | `tabs.profile` | `Profile` | `Perfil` |··
    ### §2.3 — R3 — Home (20 ocurrencias, 18 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/home.tsx`** — 20 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 47 | `home.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
    | 48 | `home.lastSeen` **(param)** | `Last seen {{date}}` | `Última señal {{date}}` |
    | 110 | `home.home` | `Home` | `Inicio` |
    | 119 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 122 | `common.retry` | `Retry` | `Reintentar` |
    | 129 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 147 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 149 | `common.retry` | `Retry` | `Reintentar` |
    | 197 | `home.free` | `Free` | `Sin collar` |
    | 199 | `home.online` | `Online` | `En línea` |
    | 200 | `home.offline` | `Offline` | `Sin conexión` |
    | — | `home.unknown` | `Awaiting signal` | `Esperando señal` | ← añadida por #73 (R5)
    | 233 | `home.noCollar` | `No collar — health only` | `Sin collar — solo salud` |
    | 245 | `home.pairCollar` | `Pair a collar` | `Vincular collar` |
    | 256 | `home.summaryTitle` | `Today&apos;s Summary` | `Resumen de hoy` |
    | 265 | `home.activityNeedsCollar` | `Activity tracking requires a collar` | `La actividad requiere un collar` |
    | 273 | `home.couldNotLoadActivity` | `Could not load activity` | `No se pudo cargar la actividad` |
    | 289 | `home.activity` | `Activity` | `Actividad` |
    | 301 | `home.sleep` | `Sleep` | `Descanso` |
    | 313 | `home.distance` | `Distance` | `Distancia` |
    | — | `home.weight` | `Weight` | `Peso` | ← añadida por #69 (R11)
    | 332 | `home.viewOnMap` | `View on map` | `Ver en el mapa` |
    | — | `home.walks` | `Walks` | `Paseos` | ← añadida por #67 (R7b)
    | — | `home.quickActions` | `Quick actions` | `Accesos rápidos` | ← añadida por #71 (R11)
    | — | `home.quickActionWeight` | `Weight` | `Peso` | ← añadida por #71 (R11)
    | — | `home.quickActionReminder` | `Reminder` | `Recordatorio` | ← añadida por #71 (R11)
    | — | `home.quickActionDocuments` | `Documents` | `Documentos` | ← añadida por #71 (R11)·
    **`mobile-pet-tracker/src/screens/home/index.tsx`** — claves de la sección de
    recordatorios añadidas por #70·
    | Línea | Clave | `en` | `es` | Nota |
    |---|---|---|---|---|
    | — | `home.reminders` | `Reminders` | `Recordatorios` | ← añadida por #70 (R16)
    | — | `home.remindersSeeAll` | `See all` | `Ver todos` | ← añadida por #70 (R16)
    | — | `home.nextVaccineDays` **(param)** | `{{days}} d` | `{{days}} d` | ← añadida por #70 (R16)
    | — | `home.nextVaccineDaysLeft` **(param)** | `In {{days}} days` | `Faltan {{days}} días` | ← añadida por #70 (R16)
    | — | `home.nextVaccineToday` | `Today` | `Hoy` | ← añadida por #70 (R16)
    | — | `home.nextVaccineOverdue` | `Overdue` | `Vencida` | ← añadida por #70 (R16)
    | — | `home.noUpcomingVaccine` | `No upcoming vaccine` | `Sin vacuna próxima` | ← añadida por #70 (R16)·
    **`mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`** — claves
    añadidas por #68, registradas como delta sobre la tabla existente·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `weeklyActivity.title` | `Weekly activity` | `Actividad semanal` |
    | — | `weeklyActivity.lastSevenDays` | `last 7 days` | `últimos 7 días` |
    | — | `weeklyActivity.noDataYet` | `No activity recorded yet` | `Aún no hay actividad registrada` |
    | — | `weeklyActivity.noDataForDay` | `No data for this day` | `Sin datos de este día` |
    | — | `weeklyActivity.metricActiveMinutes` | `Active minutes` | `Minutos activos` |
    | — | `weeklyActivity.metricDistance` | `Distance` | `Distancia recorrida` |
    | — | `weeklyActivity.metricWalks` | `Walks` | `Paseos` |
    | — | `weeklyActivity.dayLabelActiveMinutes` **(param)** | `{{day}}: {{value}} active minutes` | `{{day}}: {{value}} minutos activos` |
    | — | `weeklyActivity.dayLabelDistance` **(param)** | `{{day}}: {{value}} travelled` | `{{day}}: {{value}} de recorrido` |
    | — | `weeklyActivity.dayLabelWalks` **(param)** | `{{day}}: {{value}} walks` | `{{day}}: {{value}} paseos` |
    | — | `weeklyActivity.dayLabelMissing` **(param)** | `{{day}}: no data` | `{{day}}: sin datos` |
    | — | `weeklyActivity.chartSummary` **(param)** | `Chart of {{metric}} over the last 7 days` | `Gráfica de {{metric}} de los últimos 7 días` |
    | — | `weeklyActivity.average` **(param)** | `Average {{value}}` | `Media {{value}}` |
    | — | `weeklyActivity.trend` **(param)** | `{{percent}}% vs. previous week` | `{{percent}} % frente a la semana previa` |··
    ### §2.4 — R4 — Map (19 ocurrencias, 17 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/map.tsx`** — 19 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 60 | `map.justNow` | `Just now` | `Justo ahora` |
    | 61 | `map.agoMinutes` **(param)** | `{{minutes}}m ago` | `hace {{minutes}} min` |
    | 62 | `map.agoHours` **(param)** | `{{hours}}h ago` | `hace {{hours}} h` |
    | 196 | `map.noSignal` | `No signal` | `Sin señal` |
    | 198 | `map.live` | `GPS active` | `GPS activo` ← literal cambiado por #116 (R1); antes `Live` / `En vivo` |
    | 199 | `map.stale` | `Stale` | `Desactualizado` |
    | 210 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 213 | `common.retry` | `Retry` | `Reintentar` |
    | 221 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 229 | `map.trackingNeedsCollar` | `Live tracking requires a collar` | `El rastreo en vivo requiere un collar` |
    | 240 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 243 | `common.retry` | `Retry` | `Reintentar` |
    | 269 | `map.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
    | 299 | `map.speed` | `Speed` | `Velocidad` |
    | 315 | `map.distance` | `Distance` | `Distancia` |
    | 333 | `map.updated` | `Updated` | `Actualizado` |
    | 366 | `map.deactivateLostMode` | `Deactivate Lost Mode` | `Desactivar modo perdido` |
    | 367 | `map.activateLostMode` | `Activate Lost Mode` | `Activar modo perdido` |
    | 376 | `map.couldNotUpdateLostMode` | `Could not update Lost Mode` | `No se pudo cambiar el modo perdido` |··
    ### §2.5 — R5 — Health, log de peso y gráfica (32 ocurrencias, 27 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/health.tsx`** — 13 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 91 | `health.health` | `Health` | `Salud` |
    | 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 103 | `common.retry` | `Retry` | `Reintentar` |
    | 110 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 127 | `health.vaccines` | `Vaccines` | `Vacunas` |
    | 151 | `health.nextDue` | `Next due` | `Próxima dosis` |
    | 165 | `health.noVaccinesYet` | `No vaccines yet` | `Aún no hay vacunas` |
    | 173 | `health.couldNotLoadVaccines` | `Could not load vaccines` | `No se pudieron cargar las vacunas` |
    | 176 | `common.retry` | `Retry` | `Reintentar` |
    | 217 | `health.weight` | `Weight` | `Peso` |
    | 243 | `health.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
    | 249 | `health.couldNotLoadWeight` | `Could not load weight` | `No se pudo cargar el peso` |
    | 261 | `health.weightLog` | `Weight log` | `Registro de peso` |·
    **`mobile-pet-tracker/src/app/(tabs)/weight-log.tsx`** — 18 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 72 | `weightLog.enterValidWeight` | `Enter a valid weight` | `Introduce un peso válido` |
    | 99 | `weightLog.errorForbidden` | `Only the owner can log weights` | `Solo el dueño puede registrar pesos` |
    | 102 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 109 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 112 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 133 | `weightLog.backToHealth` | `Back to health` | `Volver a Salud` ← retirada por #95 (R5) |
    | 141 | `weightLog.weightLog` | `Weight log` | `Registro de peso` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 154 | `weightLog.weight` | `Weight` | `Peso` |
    | 160 | `weightLog.weightKg` | `Weight (kg)` | `Peso (kg)` |
    | 167 | `weightLog.measuredAt` | `Measured at` | `Fecha de medición` |
    | 172 | `weightLog.yyyyMmDd` | `YYYY-MM-DD` | `AAAA-MM-DD` |
    | 179 | `weightLog.bodyCondition` | `Body condition` | `Condición corporal` |
    | 185 | `weightLog.bodyConditionPlaceholder` | `Body condition 1-9 (optional)` | `Condición corporal 1-9 (opcional)` |
    | 204 | `weightLog.logWeight` | `Log weight` | `Registrar peso` |
    | 220 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 223 | `common.retry` | `Retry` | `Reintentar` |
    | 230 | `weightLog.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
    | 284 | `weightLog.bodyConditionValue` **(param)** | `BC {{value}}/9` | `CC {{value}}/9` |
    | — | `weightLog.dateCannotBeAfterToday` | `Date cannot be after today` | `La fecha no puede ser posterior a hoy` | ← añadida por #90 (R2) |·
    **`mobile-pet-tracker/src/components/weight-chart.tsx`** — 1 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 20 | `weightChart.notEnoughDataYet` | `Not enough data yet` | `Aún no hay datos suficientes` |··
    ### §2.6 — R6 — Food y Meal schedule (38 ocurrencias, 33 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/food.tsx`** — 16 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 80 | `food.food` | `Food` | `Nutrición` |
    | 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 94 | `common.retry` | `Retry` | `Reintentar` |
    | 101 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 144 | `food.dailyTarget` | `Daily target` | `Objetivo diario` |
    | 150 | `food.dailyKcal` **(param)** | `{{kcal}} kcal / day` | `{{kcal}} kcal / día` |
    | 156 | `food.dailyGrams` **(param)** | `{{grams}} g / day` | `{{grams}} g / día` |
    | 174 | `food.mealsToday` | `Meals today` | `Comidas hoy` |
    | — | `food.markServed` | `Mark {{time}} as served` | `Marcar {{time}} como servida` | ← añadida por #98 (R3)
    | — | `food.undoServed` | `Undo {{time}}` | `Deshacer {{time}}` | ← añadida por #98 (R3)
    | — | `food.couldNotUpdateMeal` | `Could not update the meal` | `No se pudo actualizar la comida` | ← añadida por #98 (R3)
    | — | `food.mealsServedOfTotal` | `{{served}} of {{total}} meals served` | `{{served}} de {{total}} comidas servidas` | ← añadida por #98 (R3)
    | — | `food.kcalConsumedOfTarget` **(param)** | `{{consumed}} of {{target}} kcal served today` | `{{consumed}} de {{target}} kcal servidas hoy` | ← añadida por #113 (R3)
    | 224 | `food.pending` | `Pending` | `Pendiente` |
    | 224 | `food.served` | `Served` | `Servido` |
    | 259 | `food.aiRecommendation` | `AI recommendation` | `Recomendación IA` |
    | 272 | `food.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
    | 281 | `food.couldNotLoadPlan` | `Could not load meal plan` | `No se pudo cargar el plan de alimentación` |
    | 284 | `common.retry` | `Retry` | `Reintentar` |
    | 296 | `food.mealSchedule` | `Meal schedule` | `Horario de comidas` |
    | 299 | `food.mealScheduleLinkSubtitle` | `View nutrition profile and times` | `Ver el perfil nutricional y los horarios` |·
    **`mobile-pet-tracker/src/app/(tabs)/meal-schedule.tsx`** — 19 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 83 | `mealSchedule.errorForbidden` | `Only the owner can generate the plan` | `Solo el dueño puede generar el plan` |
    | 87 | `mealSchedule.errorProfileRequired` | `Create a nutrition profile first` | `Primero crea un perfil nutricional` |
    | 89 | `mealSchedule.registerWeightFirst` | `Register a weight first` | `Primero registra un peso` |
    | 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 95 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 105 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 126 | `mealSchedule.backToFood` | `Back to food` | `Volver a Nutrición` ← retirada por #95 (R5) |
    | 135 | `mealSchedule.mealSchedule` | `Meal schedule` | `Horario de comidas` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 160 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 163 | `common.retry` | `Retry` | `Reintentar` |
    | 178 | `mealSchedule.dailyTarget` | `Daily target` | `Objetivo diario` |
    | 184 | `mealSchedule.dailyGrams` **(param)** | `{{grams}} g / day` | `{{grams}} g / día` |
    | 190 | `mealSchedule.mealsPerDay` **(param)** | `{{meals}} meals / day` | `{{meals}} comidas / día` |
    | 198 | `mealSchedule.timesAndPortions` | `Times and portions` | `Horarios y porciones` |
    | 232 | `mealSchedule.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
    | 250 | `mealSchedule.generatePlan` | `Generate plan` | `Generar plan` |
    | 269 | `mealSchedule.nutritionProfile` | `Nutrition profile` | `Perfil nutricional` |
    | 297 | `mealSchedule.noNutritionProfileYet` | `No nutrition profile yet` | `Aún no hay perfil nutricional` |··
    ### §2.7 — R7 — Profile y Documentos (35 ocurrencias, 32 claves)·
    **`mobile-pet-tracker/src/screens/profile/index.tsx`** — 28 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 49 | `profile.notRegistered` *(ya en español)* | `Not registered` | `No registrado` |
    | 85 | `profile.sterilized` | `Sterilized` | `Esterilizado` |
    | 86 | `profile.notSterilized` | `Not sterilized` | `Sin esterilizar` |
    | 87 | `profile.ageMonths` **(param)** | `{{months}} months` | `{{months}} meses` |
    | 157 | `profile.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
    | 174 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 186 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 192 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 211 | `profile.profile` | `Profile` | `Perfil` |
    | 219 | `profile.addPet` | `Add pet` | `Añadir mascota` |
    | — | `profile.notificationsBlocked` | `Notifications are turned off. Turn them on in your phone settings to receive alerts and reminders.` | `Las notificaciones están desactivadas. Actívalas en la configuración del teléfono para recibir alertas y recordatorios.` | ← añadida por #99 (R3)
    | — | `profile.openSettings` | `Open settings` | `Abrir configuración` | ← añadida por #99 (R3)
    | 234 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 240 | `profile.couldNotLoadPets` | `Could not load pets` | `No se pudieron cargar las mascotas` |
    | 253 | `profile.couldNotLoadPet` | `Could not load pet profile` | `No se pudo cargar el perfil de la mascota` |
    | 255 | `common.retry` | `Retry` | `Reintentar` |
    | 272 | `profile.changePhoto` | `Change photo` | `Cambiar foto` |
    | 283 | `profile.information` *(ya en español)* | `Information` | `Información` |
    | 285 | `profile.breed` *(ya en español)* | `Breed` | `Raza` |
    | 286 | `profile.microchip` *(ya en español)* | `Microchip` | `Microchip` |
    | 287 | `profile.gpsDevice` *(ya en español)* | `GPS device` | `Dispositivo GPS` |
    | 290 | `profile.lastSignal` *(ya en español)* | `Last signal` | `Última señal` |
    | 307 | `profile.documents` *(ya en español)* | `Documents` | `Documentos` |
    | 319 | `profile.gpsSettings` *(ya en español)* | `GPS device settings` | `Configuración del Dispositivo GPS` |
    | 334 | `profile.reminders` | `Reminders` | `Recordatorios` |
    | 340 | `profile.account` | `Account` | `Cuenta` |
    | 355 | `profile.accountUnavailable` | `Account unavailable` | `Cuenta no disponible` |
    | 365 | `profile.useDarkTheme` | `Use dark theme` | `Usar tema oscuro` |
    | 365 | `profile.useLightTheme` | `Use light theme` | `Usar tema claro` |
    | 376 | `profile.signOut` | `Sign out` | `Cerrar sesión` |·
    **`mobile-pet-tracker/src/screens/docs/index.tsx`** — 7 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 68 | `docs.backToProfile` | `Back to profile` | `Volver a Perfil` ← retirada por #95 (R5) |
    | 79 | `docs.documentsOf` *(ya en español)* | `Documents of` | `Documentos de` |
    | 85 | `docs.pet` | `Pet` | `Mascota` |
    | 101 | `docs.noDocumentsYet` | `No documents yet` | `Aún no hay documentos` |
    | 103 | `docs.emptyBody` | `Medical documents will appear here.` | `Los documentos médicos aparecerán aquí.` |
    | 116 | `docs.couldNotLoadDocuments` | `Could not load documents` | `No se pudieron cargar los documentos` |
    | 118 | `common.retry` | `Retry` | `Reintentar` |··
    ### §2.8 — R8 — Recordatorios y su alta (50 ocurrencias, 43 claves)·
    **`mobile-pet-tracker/src/screens/reminders/index.tsx`** — 21 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 87 | `reminders.errorForbidden` | `Only the owner can delete` | `Solo el dueño puede eliminar` |
    | 90 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 97 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 136 | `reminders.reminders` | `Reminders` | `Recordatorios` ← se pinta desde `src/app/_layout.tsx` por #114 (R4) |
    | 143 | `reminders.new` | `New` | `Nuevo` |
    | 171 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 174 | `common.retry` | `Retry` | `Reintentar` |
    | 182 | `reminders.noRemindersYet` | `No reminders yet` | `Aún no hay recordatorios` |
    | 211 | `reminders.active` | `Active` | `Activos` |
    | 236 | `reminders.thisWeek` | `This week` | `Esta semana` |
    | 253 | `reminders.inactive` | `Inactive` | `Inactivos` |
    | 285 | `reminders.upcoming` | `Upcoming!` | `¡Próximo!` |
    | 301 | `reminders.cancelled` | `Cancelled` | `Cancelado` |
    | 301 | `reminders.sent` | `Sent` | `Enviado` |
    | 305 | `reminders.dueInDays` **(param)** | `· in {{days}} days` | `· en {{days}} días` |
    | 319 | `reminders.delete` | `Delete` | `Eliminar` |
    | 342 | `reminders.deleteReminder` | `Delete reminder?` | `¿Eliminar recordatorio?` |
    | 351 | `reminders.deleteSheetBody` | `This action cannot be undone.` | `Esta acción no se puede deshacer.` |
    | 361 | `reminders.delete` | `Delete` | `Eliminar` |
    | 370 | `reminders.cancel` | `Cancel` | `Cancelar` |·
    **`mobile-pet-tracker/src/utils/reminder-meta.ts`** — 7 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 7 | `reminderType.vaccine` | `Vaccine` | `Vacuna` |
    | 8 | `reminderType.deworming` | `Deworming` | `Desparasitación` |
    | 9 | `reminderType.medication` | `Medication` | `Medicamento` |
    | 10 | `reminderType.appointment` | `Appointment` | `Consulta` |
    | 11 | `reminderType.weight` | `Weight` | `Peso` |
    | 12 | `reminderType.food` | `Food` | `Comida` |
    | 13 | `reminderType.other` | `Other` | `Otro` |·
    **`mobile-pet-tracker/src/screens/add-reminder/index.tsx`** — 22 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 21 | `addReminder.advanceSameDay` | `Same day` | `El mismo día` |
    | 22 | `addReminder.advance1Day` | `1 day before` | `1 día antes` |
    | 23 | `addReminder.advance3Days` | `3 days before` | `3 días antes` |
    | 24 | `addReminder.advance7Days` | `7 days before` | `7 días antes` |
    | 56 | `addReminder.titleIsRequired` | `Title is required` | `El título es obligatorio` |
    | 60 | `addReminder.pickDate` | `Pick a date` | `Elige una fecha` |
    | 66 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
    | 86 | `addReminder.errorForbidden` | `Only the owner can create reminders` | `Solo el dueño puede crear recordatorios` |
    | 89 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
    | 92 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 99 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 122 | `addReminder.backToReminders` | `Back to reminders` | `Volver a Recordatorios` ← retirada por #95 (R5) |
    | 132 | `addReminder.addReminder` | `Add reminder` | `Agregar recordatorio` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 138 | `addReminder.type` | `Type` | `Tipo` |
    | 169 | `addReminder.title` | `Title` | `Título` |
    | 176 | `addReminder.reminderTitle` | `Reminder title` | `Título del recordatorio` |
    | 186 | `addReminder.date` | `Date` | `Fecha` |
    | 196 | `addReminder.selectDate` | `Select a date` | `Elige una fecha` |
    | 202 | `addReminder.time` | `Time` | `Hora` |
    | 256 | `addReminder.alert` | `Alert` | `Aviso` |
    | 292 | `addReminder.saveReminder` | `Save reminder` | `Guardar recordatorio` |··
    ### §2.9 — R9 — Alta de mascota (40 ocurrencias, 38 claves)·
    **`mobile-pet-tracker/src/screens/add-pet/index.tsx`** — 40 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 114 | `addPet.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
    | 148 | `addPet.nameIsRequired` | `Name is required` | `El nombre es obligatorio` |
    | 155 | `addPet.chooseBirthDate` | `Choose a birth date` | `Elige una fecha de nacimiento` |
    | 162 | `addPet.errorAgeRange` | `Enter an age from 0 to 480 months` | `Introduce una edad de 0 a 480 meses` |
    | 189 | `addPet.errorPhotoAfterCreate` | `Pet created, but the photo could not be uploaded` | `Se creó la mascota, pero no se pudo subir la foto` |
    | 198 | `addPet.checkPetDetails` | `Check the pet details` | `Revisa los datos de la mascota` |
    | 201 | `addPet.youCannotCreatePet` | `You cannot create a pet` | `No puedes crear una mascota` |
    | 204 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 208 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 211 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 231 | `addPet.backToProfile` | `Back to profile` | `Volver a Perfil` ← retirada por #95 (R5) |
    | 240 | `addPet.addPet` | `Add pet` | `Nueva mascota` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 245 | `addPet.pet` | `Pet` | `Mascota` |
    | 250 | `addPet.avatarPreview` | `Avatar preview` | `Vista previa del avatar` |
    | 259 | `addPet.choosePhoto` | `Choose photo` | `Elegir foto` |
    | 269 | `addPet.basicDetails` *(ya en español)* | `Basic details` | `Datos básicos` |
    | 272 | `addPet.species` | `Species` | `Tipo de mascota` |
    | 289 | `addPet.cat` | `Cat` | `Gato` |
    | 289 | `addPet.dog` | `Dog` | `Perro` |
    | 297 | `addPet.name` | `Name` | `Nombre` |
    | 303 | `addPet.petName` | `Pet name` | `Nombre de la mascota` |
    | 311 | `addPet.breed` | `Breed` | `Raza` |
    | 317 | `addPet.optional` | `Optional` | `Opcional` |
    | 325 | `addPet.sex` | `Sex` | `Sexo` |
    | 327 | `addPet.female` | `Female` | `Hembra` |
    | 328 | `addPet.male` | `Male` | `Macho` |
    | 333 | `addPet.size` | `Size` | `Tamaño` |
    | 335 | `addPet.small` | `Small` | `Pequeño` |
    | 336 | `addPet.medium` | `Medium` | `Mediano` |
    | 337 | `addPet.large` | `Large` | `Grande` |
    | 341 | `addPet.medicalDetails` *(ya en español)* | `Medical details` | `Datos médicos` |
    | 344 | `addPet.age` | `Age` | `Edad` |
    | 347 | `addPet.birthDate` | `Birth date` | `Fecha de nacimiento` |
    | 348 | `addPet.approxMonths` | `Approx. months` | `Meses aprox.` |
    | 376 | `addPet.selectBirthDate` | `Select a birth date` | `Elige una fecha de nacimiento` |
    | 386 | `addPet.months` | `Months` | `Meses` |
    | 412 | `addPet.sterilized` | `Sterilized` | `Esterilizado/a` |
    | 414 | `addPet.yes` | `Yes` | `Sí` |
    | 426 | `addPet.optional` | `Optional` | `Opcional` |
    | 440 | `addPet.savePet` | `Save pet` | `Guardar mascota` |··
    ### §2.10 — R10 — Emparejado del collar (40 ocurrencias, 33 claves)·
    **`mobile-pet-tracker/src/screens/pairing/index.tsx`** — 40 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 126 | `pairing.errorInvalidCode` | `Invalid activation code. Check the code printed on the box.` | `Código de activación no válido. Revisa el código impreso en la caja.` |
    | 130 | `pairing.errorAlreadyClaimed` | `This collar is already paired to another pet.` | `Este collar ya está vinculado a otra mascota.` |
    | 133 | `pairing.errorPetHasDevice` | `This pet already has a collar. Unpair it first.` | `Esta mascota ya tiene un collar. Desvincúlalo primero.` |
    | 137 | `pairing.errorNoSubscription` | `This collar has no active plan. Contact support to activate it.` | `Este collar no tiene un plan activo. Contacta con soporte para activarlo.` |
    | 141 | `pairing.errorForbiddenClaim` | `Only the owner can pair a collar.` | `Solo el dueño puede vincular un collar.` |
    | 147 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 151 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 155 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 189 | `pairing.errorForbiddenRelease` | `Only the owner can unpair the collar.` | `Solo el dueño puede desvincular el collar.` |
    | 195 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 199 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 203 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 212 | `pairing.unpairAlertTitle` | `Unpair collar?` | `¿Desvincular collar?` |
    | 213 | `pairing.unpairAlertBody` | `Location history stays, but live tracking stops until you pair a collar again.` | `El historial de ubicaciones se conserva, pero el rastreo en vivo se detiene hasta que vincules otro collar.` |
    | 215 | `pairing.cancel` | `Cancel` | `Cancelar` |
    | 217 | `pairing.unpair` | `Unpair` | `Desvincular` |
    | 238 | `pairing.back` | `Back` | `Volver` ← retirada por #95 (R5) |
    | 267 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 270 | `common.retry` | `Retry` | `Reintentar` |
    | 277 | `pairing.addPetFirst` | `Add a pet first` | `Primero añade una mascota` |
    | 302 | `pairing.trackerIsReady` | `Tracker is ready` | `El collar está listo` |
    | 305 | `pairing.readySubtitle` **(param)** | `{{petName}}'s collar is paired. GPS tracking is on.` | `El collar de {{petName}} está vinculado. El rastreo GPS está activo.` |
    | 312 | `pairing.model` | `Model` | `Modelo` |
    | 330 | `pairing.viewOnMap` | `View on map` | `Ver en el mapa` |
    | 340 | `pairing.done` | `Done` | `Listo` |
    | 348 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
    | 357 | `pairing.freePlanPairPrompt` | `Free plan — health only. Pair a collar with an active plan to see the map.` | `Plan gratuito — solo salud. Vincula un collar con plan activo para ver el mapa.` |
    | 364 | `pairing.activationCode` | `Activation code` | `Código de activación` |
    | 377 | `pairing.printedOnCollarBox` | `Printed on the collar box` | `Impreso en la caja del collar` |
    | 388 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
    | 397 | `pairing.gpsDevice` | `GPS device` | `Dispositivo GPS` |
    | 403 | `pairing.model` | `Model` | `Modelo` |
    | 408 | `pairing.battery` | `Battery` | `Batería` |
    | 417 | `pairing.connection` | `Connection` | `Conexión` |
    | 422 | `pairing.lastMessage` | `Last message` | `Último mensaje` |
    | 429 | `pairing.noMessagesYet` | `No messages yet` | `Sin mensajes todavía` |
    | 453 | `pairing.gpsTrackingActive` | `GPS tracking active` | `Rastreo GPS activo` |
    | 461 | `pairing.freePlanNoActivePlan` | `Free plan — health only. This collar has no active plan.` | `Plan gratuito — solo salud. Este collar no tiene plan activo.` |
    | 468 | `pairing.planStatusUnavailable` | `Plan status unavailable` | `Estado del plan no disponible` |
    | 479 | `pairing.unpairCollar` | `Unpair collar` | `Desvincular collar` |·
    **`mobile-pet-tracker/src/utils/device-connectivity.ts`** — claves añadidas por
    #68, registradas como delta sobre la tabla existente·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `deviceConnectivity.online` | `Online` | `En línea` |
    | — | `deviceConnectivity.unknown` | `Unknown` | `Desconocida` |
    | — | `deviceConnectivity.offline` | `Offline` | `Sin conexión` | ← añadida por #73 (R5)··
    ### §2.11 — R11 — Restablecer contraseña (15 ocurrencias, 11 claves)·
    **`mobile-pet-tracker/src/screens/reset-password/index.tsx`** — 15 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 36 | `resetPassword.errorInvalidToken` | `Reset link is invalid or already used. Request a new one.` | `El enlace no es válido o ya se usó. Solicita uno nuevo.` |
    | 40 | `resetPassword.errorExpiredToken` | `Reset link expired. Request a new one.` | `El enlace caducó. Solicita uno nuevo.` |
    | 46 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 50 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 53 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 77 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 84 | `resetPassword.errorMissingToken` | `This reset link is incomplete. Open the link from your email again.` | `Este enlace está incompleto. Ábrelo de nuevo desde tu correo.` |
    | 88 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | 113 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 120 | `resetPassword.passwordUpdated` | `Password updated` | `Contraseña actualizada` |
    | 128 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | 151 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 156 | `resetPassword.newPassword` | `New password` | `Nueva contraseña` |
    | 171 | `resetPassword.confirmNewPassword` | `Confirm new password` | `Confirmar nueva contraseña` |
    | 197 | `resetPassword.updatePassword` | `Update password` | `Actualizar contraseña` |··
    **Suma de control**: 29 + 5 + 20 + 19 + 32 + 35 + 35 + 50 + 40 + 40 + 15 = **320** ocurrencias y **252** claves distintas; con las 3 del interruptor (§3.3), **255**.·
    ### §2.12 — La interpolación: los 33 sitios, y cuáles son copy·
    El conteo previo del leader dio **31 plantillas con `${}` en texto visible**.
    El barrido completo —plantillas con `${}` **y** llaves JSX dentro de un nodo de
    texto, que el grep de backticks no ve— da **33 sitios**. De esos, **11 son
    copy** y necesitan una entrada con parámetro; los otros **22 son formateadores
    de unidades o datos** y no entran al catálogo. Enumerados, no estimados:·
    **Los 11 que son copy → entrada con parámetro**·
    | # | Sitio | Hoy | Clave | `en` | `es` |
    |---|---|---|---|---|---|
    | 1 | `home.tsx:48` | `` `Last seen ${new Date(iso).toLocaleString()}` `` | `home.lastSeen` | `Last seen {{date}}` | `Última señal {{date}}` |
    | 2 | `map.tsx:61` | `` `${Math.floor(seconds / 60)}m ago` `` | `map.agoMinutes` | `{{minutes}}m ago` | `hace {{minutes}} min` |
    | 3 | `map.tsx:62` | `` `${Math.floor(seconds / 3600)}h ago` `` | `map.agoHours` | `{{hours}}h ago` | `hace {{hours}} h` |
    | 4 | `profile/index.tsx:87` | `` `${pet.ageMonths} months` `` | `profile.ageMonths` | `{{months}} months` | `{{months}} meses` |
    | 5 | `reminders/index.tsx:305` | `` `· in ${days} days` `` | `reminders.dueInDays` | `· in {{days}} days` | `· en {{days}} días` |
    | 6 | `weight-log.tsx:284` | JSX `BC {entry.bodyCondition}/9` | `weightLog.bodyConditionValue` | `BC {{value}}/9` | `CC {{value}}/9` |
    | 7 | `pairing/index.tsx:305` | JSX `{selectedPet.name}&apos;s collar is paired. GPS tracking is on.` | `pairing.readySubtitle` | `{{petName}}'s collar is paired. GPS tracking is on.` | `El collar de {{petName}} está vinculado. El rastreo GPS está activo.` |
    | 8 | `food.tsx:150` | JSX `{loadedPlan.merKcal} kcal / day` | `food.dailyKcal` | `{{kcal}} kcal / day` | `{{kcal}} kcal / día` |
    | 9 | `food.tsx:156` | JSX `{loadedPlan.dailyGrams} g / day` | `food.dailyGrams` | `{{grams}} g / day` | `{{grams}} g / día` |
    | 10 | `meal-schedule.tsx:184` | JSX `{loadedPlan.dailyGrams} g / day` | `mealSchedule.dailyGrams` | `{{grams}} g / day` | `{{grams}} g / día` |
    | 11 | `meal-schedule.tsx:190` | JSX `{loadedPlan.mealsPerDay} meals / day` | `mealSchedule.mealsPerDay` | `{{meals}} meals / day` | `{{meals}} comidas / día` |·
    Los 7 primeros son evidentes: llevan una palabra pegada al número (`ago`,
    `months`, `days`, el genitivo sajón, `Last seen`, `BC`). Los cuatro últimos son
    menos obvios y por eso van explicados: `day` **es una palabra**, no un símbolo.
    Dejarlos como sufijo fijo (`t('food.dayUnit')` pegado detrás del número)
    funcionaría hoy y se rompería el día que un idioma ponga la unidad delante o
    use un separador distinto, y además deja en el catálogo entradas ilegibles
    (` kcal / día` como valor suelto). Se parametrizan: mismo número de entradas y
    copy completa en cada una.·
    > **Validación cruzada de esta lista.** El escaneo de R18 comprueba la
    > ausencia de cada valor del catálogo como **literal entero** en su archivo.
    > Sobre el commit base, ese escaneo encuentra **exactamente estas 11** filas
    > donde el literal entero no existe (porque están partidas por una
    > interpolación) y **ninguna más**. La enumeración de arriba no es una
    > estimación: es la salida de esa comprobación.·
    **Los 22 que no son copy → siguen siendo literales en su formateador**·
    | Sitio | Qué es |
    |---|---|
    | `home.tsx:37, 38` | `` `${minutes}m` `` y `` `${h}h ${m}m` `` — duración, símbolos |
    | `home.tsx:42`, `map.tsx:52` | `` `${km} km` `` — unidad |
    | `home.tsx:228`, `pairing/index.tsx:413` | `` `${pct}%` `` — unidad |
    | `map.tsx:56` | `` `${kmh} km/h` `` — unidad |
    | `health.tsx:36`, `weight-log.tsx:34` | `` `+${v} kg` `` / `` `${v} kg` `` — signo + unidad |
    | `health.tsx:31`, `weight-log.tsx:41`, `add-pet/index.tsx:34` | ISO `YYYY-MM-DD` — **valor**, no texto |
    | `food.tsx:27` | `` `${hh}:${mm}` `` — hora, valor |
    | `health.tsx:224`, `weight-log.tsx:273`, `profile/index.tsx:88` | JSX `{n} kg` — unidad |
    | `food.tsx:209`, `meal-schedule.tsx:221` | JSX `{n} g` — unidad |
    | `meal-schedule.tsx:181` | JSX `{n} kcal` — unidad |
    | `meal-schedule.tsx:276` | JSX `{n} kcal / 100 g` — unidad |
    | `food.tsx:180` | JSX `{servidas}/{total}` — números |
    | `profile/index.tsx:348` | `` `${firstName} ${lastName}` `` — datos del usuario |
    | `add-reminder/index.tsx:159` | `` `${meta.emoji} ${meta.label}` `` — **composición**: el emoji es iconografía (D9) y el `label` ya sale del catálogo |
    | `register.tsx:53` | `` `${a}\\n${b}` `` — concatena mensajes **del backend**; el `\\n` es separador |
    | `weight-chart.tsx:36, 37` | coordenadas SVG |·
    ---·
    ### §2.13 — Añadidos por #78 — Centro de alertas móvil·
    | Línea | Clave | `en` | `es` | Nota |
    |---|---|---|---|---|
    | — | `alerts.title` | `Alerts` | `Alertas` | ← añadida por #78 (R3) · se pinta desde `src/app/_layout.tsx` por #114 (R4)
    | — | `alerts.empty` | `No alerts` | `No hay alertas` | ← añadida por #78 (R3)
    | — | `alerts.ack` | `Mark as read` | `Marcar leída` | ← añadida por #78 (R3)
    | — | `alerts.typeGeofenceExit` | `Left the safe zone` | `Salió de la zona` | ← añadida por #78 (R3)
    | — | `alerts.typeBatteryLow` | `Low battery` | `Batería baja` | ← añadida por #78 (R3)
    | — | `alerts.typeUnknown` | `Notice` | `Aviso` | ← añadida por #78 (R3)
    | — | `alerts.statusAcked` | `Read` | `Leída` | ← añadida por #78 (R3)
    | — | `alerts.statusClosed` | `Resolved` | `Resuelta` | ← añadida por #78 (R3)
    | — | `alerts.justNow` | `Just now` | `Ahora mismo` | ← añadida por #78 (R3)
    | — | `alerts.minutesAgo` **(param)** | `{{minutes}} min ago` | `Hace {{minutes}} min` | ← añadida por #78 (R3)
    | — | `alerts.hoursAgo` **(param)** | `{{hours}} h ago` | `Hace {{hours}} h` | ← añadida por #78 (R3)
    | — | `alerts.daysAgo` **(param)** | `{{days}} d ago` | `Hace {{days}} d` | ← añadida por #78 (R3)
    | — | `home.alertsBell` | `Alerts` | `Alertas` | ← añadida por #78 (R3)
    | — | `home.alertsBellUnread` | `Unread alerts` | `Alertas sin leer` | ← añadida por #78 (R3)·
    ### §2.14 — Añadidos por #100 — Detalle de alerta·
    | — | `alerts.detailTitle` | `Alert` | `Alerta` | ← añadida por #100 (R1)
    | — | `alerts.statusOpen` | `Unread` | `Sin leer` | ← añadida por #100 (R1)
    | — | `alerts.openedAt` **(param)** | `Detected {{date}}` | `Detectada el {{date}}` | ← añadida por #100 (R1)·
    ### §2.15 — Añadidos por #41 — Zonas seguras·
    | Literal | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `geofences.title` | `Safe zones` | `Zonas seguras` | ← añadida por #41 (R1)
    | — | `geofences.empty` | `No safe zones yet` | `Aún no hay zonas seguras` | ← añadida por #41 (R1)
    | — | `geofences.needsCollar` | `Safe zones require a collar` | `Las zonas seguras requieren un collar` | ← añadida por #41 (R1)
    | — | `geofences.radius` **(param)** | `{{meters}} m radius` | `Radio de {{meters}} m` | ← añadida por #41 (R1)
    | — | `geofences.activeLabel` **(param)** | `{{name}} zone active` | `Zona {{name}} activa` | ← añadida por #41 (R1)
    | — | `geofences.statusActive` | `Active` | `Activa` | ← añadida por #41 (R1)
    | — | `geofences.statusInactive` | `Inactive` | `Inactiva` | ← añadida por #41 (R1)
    | — | `geofences.delete` | `Delete` | `Eliminar` | ← añadida por #41 (R1)
    | — | `geofences.cancel` | `Cancel` | `Cancelar` | ← añadida por #41 (R1)
    | — | `geofences.deleteTitle` **(param)** | `Delete {{name}}?` | `¿Eliminar {{name}}?` | ← añadida por #41 (R1)
    | — | `geofences.deleteBody` | `You'll stop getting alerts for this zone. This can't be undone.` | `Dejarás de recibir alertas de esta zona. Esta acción no se puede deshacer.` | ← añadida por #41 (R1)·
    ### §2.16 — Añadidos por #146 — Editor de zonas seguras·
    | Pantalla | Clave | en | es | Origen |
    |---|---|---|---|---|
    | — | `geofenceEditor.title` | Safe zone | Zona segura | ← añadida por #146 (R1) |
    | — | `geofenceEditor.nameLabel` | Name | Nombre | ← añadida por #146 (R1) |
    | — | `geofenceEditor.mapHint` | Tap the map to move the zone's center. | Toca el mapa para mover el centro de la zona. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.radiusLabel` | Zone radius | Radio de la zona | ← añadida por #146 (R1) |
    | — | `geofenceEditor.resetNote` | Saving a new center or radius re-evaluates the zone and closes its open alerts. | Al guardar un centro o radio nuevos, la zona se vuelve a evaluar y se cierran sus alertas abiertas. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.save` | Save | Guardar | ← añadida por #146 (R1) |
    | — | `geofenceEditor.nameTaken` | You already have a zone with that name. | Ya tienes una zona con ese nombre. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.limitReached` | This pet already has the maximum number of zones. | Esta mascota ya tiene el máximo de zonas. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.invalid` | Check the zone name and radius. | Revisa el nombre y el radio de la zona. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.notFound` | This pet or zone is no longer available. | La mascota o la zona ya no están disponibles. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.add` | Add zone | Añadir zona | ← añadida por #146 (R1) |
    | — | `geofenceEditor.editLabel` | Edit {{name}} zone | Editar zona {{name}} | ← añadida por #146 (R1) |
    | — | `geofenceEditor.limitNotice` | This pet already has {{max}} zones, the maximum. Delete one to add another. | Esta mascota ya tiene {{max}} zonas, el máximo. Elimina una para añadir otra. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.ownerOnly` | Only the pet's owner can create or edit zones. | Solo el dueño de la mascota puede crear o editar zonas. | ← añadida por #146 (R1) |·
    ### §2.17 — Añadidos por #147 — Horario de comidas editable·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `mealSchedule.addMeal` | `Add meal` | `Añadir comida` | ← añadida por #147 (R1)
    | — | `mealSchedule.editTime` | `Edit` | `Editar` | ← añadida por #147 (R1)
    | — | `mealSchedule.editTimeLabel` **(param)** | `Edit {{time}} meal time` | `Editar horario de las {{time}}` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorInvalidTime` | `That time is not valid` | `La hora no es válida` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorEditForbidden` | `Only the owner can change meal times` | `Solo el dueño puede cambiar los horarios` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorPlanRequired` | `Generate a meal plan first` | `Primero genera un plan de alimentación` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorTimeNotInPlan` | `That meal time is no longer in the plan` | `Ese horario ya no está en el plan` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorDuplicateTime` | `There is already a meal at that time` | `Ya hay una comida a esa hora` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorMealLimit` | `The plan already has the maximum of 6 meals` | `El plan ya tiene el máximo de 6 comidas` | ← añadida por #147 (R1)·
    ### §2.18 — Añadidos por #105 — Historial de comidas·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `food.mealsHistory` | `Meals history` | `Historial de comidas` | ← añadida por #105 (R5) |
    | — | `food.mealsHistoryLinkSubtitle` | `See which days meals were served` | `Ver qué días se sirvieron comidas` | ← añadida por #105 (R5) |
    | — | `mealsHistory.mealsHistory` | `Meals history` | `Historial de comidas` | ← añadida por #105 (R5) |
    | — | `mealsHistory.previousMonth` | `Previous month` | `Mes anterior` | ← añadida por #105 (R5) |
    | — | `mealsHistory.nextMonth` | `Next month` | `Mes siguiente` | ← añadida por #105 (R5) |
    | — | `mealsHistory.emptyMonth` | `No meals were served this month` | `Este mes no se sirvió ninguna comida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.noMealsOnDay` | `No meals were served this day` | `Ese día no se sirvió ninguna comida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.servedOne` | `1 meal served` | `1 comida servida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.servedMany` | `{{count}} meals served` | `{{count}} comidas servidas` | ← añadida por #105 (R5) |·
    ### §2.19 — Añadidos por #118 — Bienvenida·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `welcome.brand` | `Pet Tracker` | `Pet Tracker` | ← añadida por #118 (R1) |
    | — | `welcome.chipGps` | `GPS` | `GPS` | ← añadida por #118 (R1) |
    | — | `welcome.chipHealth` | `Health` | `Salud` | ← añadida por #118 (R1) |
    | — | `welcome.chipNutrition` | `Nutrition` | `Nutrición` | ← añadida por #118 (R1) |
    | — | `welcome.tagline` | `Your smart hub for canine wellness, tracking and nutrition` | `Tu centro inteligente de bienestar, rastreo y nutrición canina profesional` | ← añadida por #118 (R1) |
    | — | `welcome.getStarted` | `Get started` | `Comenzar ahora` | ← añadida por #118 (R1) |
    | — | `welcome.haveAccount` | `I already have an account` | `Ya tengo una cuenta` | ← añadida por #118 (R1) |
    | — | `welcome.legalNotice` | `By continuing you accept our Terms and Privacy Policy` | `Al continuar aceptas nuestros Términos y Política de privacidad` | ← añadida por #118 (R1) |·
    ### §2.20 — Añadidos por #153 — Pingo en la bienvenida·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `welcome.pingoGreeting` | `Hi, I'm Pingo. I'll help you know where your pet is and how they're doing.` | `Hola, soy Pingo. Te ayudo a saber dónde está y cómo está tu mascota.` | ← añadida por #153 (R1) |·
    ### §2.21 — Añadidos por #155 — Pingo en los estados vacíos·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `common.noPetsBody` | `Add your pet and I'll help you know where they are and how they're doing.` | `Añade a tu mascota y te ayudo a saber dónde está y cómo está.` | ← añadida por #155 (R1) |
    | — | `alerts.emptyBody` | `All is calm. If anything happens, I'll let you know here.` | `Todo está tranquilo. Si pasa algo, te aviso aquí.` | ← añadida por #155 (R1) |
    | — | `reminders.emptyBody` | `Once you create a reminder, I'll let you know on time.` | `Cuando crees un recordatorio, te aviso a tiempo.` | ← añadida por #155 (R1) |
    | — | `geofences.emptyBody` | `Once there's a safe zone, I'll let you know if your pet leaves it.` | `Cuando haya una zona segura, te aviso si tu mascota sale de ella.` | ← añadida por #155 (R1) |
    | — | `food.noMealPlanBody` | `Once there's a plan, I'll help you keep track of every meal.` | `Cuando haya un plan, te ayudo a llevar la cuenta de cada comida.` | ← añadida por #155 (R1) |
    | — | `docs.emptyBody` | `When your pet's medical documents arrive, I'll keep them here.` | `Cuando lleguen los documentos médicos de tu mascota, te los guardo aquí.` | ← cambiada por #155 (R1) |·
    ## 3. La infraestructura·
    ### 3.1 Decisiones·
    - **D1 — Sin librería de i18n.** Ni `i18next`, ni `react-intl`, ni `lingui`.
      255 claves × 2 idiomas es un objeto TypeScript; lo que hace falta de una
      librería —resolver una clave, sustituir un parámetro y repintar al cambiar—
      son quince líneas y un contexto de React. El repo ya tiene los dos patrones:
      `src/theme/use-theme-colors.ts` (hook que resuelve por token) y
      `src/providers/selected-pet-provider.tsx` (contexto + `useMemo` + hook que
      lanza fuera del provider). Una librería traería negociación de locale,
      plurales ICU, carga asíncrona de bundles y un `Suspense` que aquí no tienen
      usuario.
    - **D2 — Sin `expo-localization`, y por tanto sin detección del idioma del
      teléfono.** El idioma es **elección explícita** del usuario. Un teléfono en
      inglés en México no dice nada sobre en qué idioma quiere la app, y arrancar
      en inglés a un usuario que espera español es peor que arrancar siempre igual.
      Consecuencia asumida: un usuario anglófono ve la primera pantalla en español
      y tiene que ir a Profile. Si algún día se quiere detectar, **ésa** es la
      decisión que se reabre, y es una feature de tres líneas sobre esta base.
    - **D3 — Español por defecto**, sin pregunta, sin pantalla de bienvenida (R16).
    - **D4 — La persistencia copia `theme-preference.ts` tal cual**: mismo
      `expo-secure-store` (ya instalado, `~57.0.1`), misma forma de dos funciones,
      mismo `try/catch` que traga, misma validación del valor leído. Si el
      almacenamiento falla, `getStoredLanguage()` devuelve `undefined` y la app
      arranca en español (R13). **No se añade ninguna dependencia.**
    - **D5 — El idioma vive en un contexto de React, el tema no.** El tema usa
      `Uniwind.setTheme`, un store fuera de React con su propio repintado nativo;
      el idioma no puede usar eso porque no es CSS. Contexto + `useState` es lo
      correcto y además da gratis lo que pide R14: repintar sin desmontar.·
    ### 3.2 Los tres módulos nuevos·
    ```
    mobile-pet-tracker/src/i18n/catalog.ts               ← las 255 claves × 2
    mobile-pet-tracker/src/providers/language-provider.tsx ← contexto + t + locale
    mobile-pet-tracker/src/utils/language-preference.ts  ← persistencia (clon de theme-preference)
    ```·
    **`src/i18n/catalog.ts`** — el `en` es la fuente del tipo, y `es` se declara
    como `Record<TranslationKey, string>`, de modo que **falta o sobra una clave y
    TypeScript rompe la compilación antes que el test**:·
    ```ts
    export const en = {
      'common.somethingWentWrong': 'Something went wrong',
      'login.signIn': 'Sign in',
      'home.lastSeen': 'Last seen {{date}}',
      // … 255
    } as const;·
    export type TranslationKey = keyof typeof en;
    export const es: Record<TranslationKey, string> = {
      'common.somethingWentWrong': 'Algo salió mal',
      'login.signIn': 'Iniciar sesión',
      'home.lastSeen': 'Última señal {{date}}',
      // … 255
    };
    export const LOCALES = { es: 'es-MX', en: 'en-US' } as const;
    export type Language = keyof typeof LOCALES;
    export const DEFAULT_LANGUAGE: Language = 'es';
    ```·
    El tipo cubre la paridad de **claves**; el test de R12 cubre lo que el tipo no
    puede: la paridad de **marcadores `{{…}}`** por clave (que `es` no se deje un
    `{{date}}` que `en` sí tiene, lo que dejaría un hueco en pantalla).·
    **`src/providers/language-provider.tsx`** — mismo esqueleto que
    `selected-pet-provider.tsx`:·
    ```ts
    export function LanguageProvider({ initial, children }: { initial: Language; children: ReactNode })
    export function useLanguage(): { language: Language; setLanguage: (l: Language) => void }
    export function useTranslate(): (key: TranslationKey, params?: Record<string, string | number>) => string
    export function useLocale(): string   // LOCALES[language]
    ```·
    `t` resuelve `catalog[language][key]` y sustituye cada `{{nombre}}` por
    `params[nombre]`. **Si falta un parámetro deja el marcador tal cual** en vez de
    lanzar: un descuido debe verse feo, no tumbar la pantalla. `setLanguage`
    actualiza el estado **y** llama a `setStoredLanguage` sin esperarlo (`void`),
    igual que `useThemeTransition` hace con `setStoredTheme`.·
    **`src/utils/language-preference.ts`** — clon literal de
    `theme-preference.ts` con `LANGUAGE_PREFERENCE_KEY = 'language_preference'` y
    `value === 'es' || value === 'en'`.·
    **Montaje en `src/app/_layout.tsx`** — el layout **ya** espera a
    `getStoredTheme()` antes de renderizar nada (`if (!themeReady) return <></>`).
    El idioma se lee **en ese mismo `useEffect`**, con un `Promise.all`, y se
    guarda en un estado que alimenta el `initial` del provider. **No se añade un
    segundo gate ni un segundo render en blanco**: la app ya no pinta nada hasta
    que el tema está listo, y leer una clave más de SecureStore es del mismo orden.·
    ### 3.3 Las 3 claves del interruptor (copy nueva, no está en `copy-review`)·
    | Clave | `en` | `es` | Dónde |
    |---|---|---|---|
    | `profile.languageSpanish` | `Español` | `Español` | etiqueta del botón cuando el idioma vigente es `en` |
    | `profile.languageEnglish` | `English` | `English` | etiqueta del botón cuando el idioma vigente es `es` |
    | `profile.changeLanguage` | `Change language` | `Cambiar idioma` | `accessibilityLabel` del botón |·
    Las dos primeras **valen lo mismo en los dos idiomas a propósito**: son
    endónimos. Un menú de idiomas que traduce los nombres de los idiomas
    («Spanish» / «Español» según dónde estés) es justo lo que impide a alguien
    salir de un idioma que no entiende. Entran igualmente al catálogo para que la
    regla «cero copy suelta» de R18 no tenga excepciones.·
    **La forma del control es la del `theme-toggle`, no una lista.** El
    `theme-toggle` es un `Button` cuya etiqueta nombra el estado al que iría
    (`Use dark theme`). El de idioma hace lo mismo: con dos idiomas, un botón que
    dice `English` y te lleva a inglés es más corto de entender que un selector, y
    son cero componentes nuevos. Si algún día hay un tercer idioma, **ahí** se
    cambia a un `Picker` de `@expo/ui/community/picker`, y no antes.·
    ### 3.4 Repintar sin reiniciar, y qué pasa con las pantallas abiertas·
    `setLanguage` es un `setState` del provider. React vuelve a renderizar el
    árbol; **no lo desmonta**. Consecuencias, todas queridas:·
    - **El estado local sobrevive**: el formulario a medio llenar de
      `add-reminder` (sus nueve `useState`), el código escrito en `pairing`, la
      mascota seleccionada, la posición del scroll y los datos ya cargados por
      `useApi`. Nada se refetchea.
    - **Los textos ya renderizados cambian** porque todos salen de `t`, que depende
      del contexto. Los que **no** cambian son los que ya estaban fuera del
      catálogo: los mensajes de error del backend que hay en pantalla en ese
      momento (siguen en inglés, §7.1) y los valores de enum de la API (§7.2).
    - **Una `Alert.alert` abierta no cambia**: su texto se resolvió al abrirla.
      Es correcto —el diálogo nativo ya está en pantalla— y por eso R10 exige que
      los textos de la alerta se resuelvan **en el momento de la llamada**, no en
      una constante de módulo.
    - **Sin animación.** El tema tiene un *fade* nativo opcional
      (`withThemeTransition`, #58); el idioma **no lo lleva**: cambiar el idioma no
      es un cambio de superficie y meter Reanimated aquí sería añadir motion no
      pedido, contra el invariante de [[requirements]].·
    ### 3.5 Las tres tablas de constantes que hoy guardan texto·
    Son el único sitio donde el texto se congela en tiempo de import y por eso no
    bastaría con envolverlas en `t`. Dejan de guardar texto y guardan **la clave**:·
    | Constante | Archivo | Hoy | Después |
    |---|---|---|---|
    | `TABS` | `src/components/floating-tab-bar.tsx:48-54` | `{ name, label: 'Home', Icon }` | `{ name, labelKey: 'tabs.home', Icon }`, y el `<Text>` renderiza `t(labelKey)` |
    | `REMINDER_TYPE_META` | `src/utils/reminder-meta.ts:3-14` | `{ label: 'Vaccine', emoji: '💉' }` | `{ labelKey: 'reminderType.vaccine', emoji: '💉' }` — **las 7 claves del `Record<ReminderType, …>` y los 7 emoji no se tocan** |
    | `ADVANCE_OPTIONS` | `src/screens/add-reminder/index.tsx:20-25` | `{ minutes: 0, label: 'Same day' }` | `{ minutes: 0, labelKey: 'addReminder.advanceSameDay' }` — **los 4 valores de `minutes` no se tocan** |·
    Los dos consumidores de `REMINDER_TYPE_META` (`reminders/index.tsx:278` y
    `add-reminder/index.tsx:159`) pasan de `meta.label` a `t(meta.labelKey)`. En
    `add-reminder:159` la plantilla `` `${meta.emoji} ${meta.label}` `` pasa a
    `` `${meta.emoji} ${t(meta.labelKey)}` ``: sigue siendo composición, no copy
    (§2.12).·
    ### 3.6 Fechas y números: se atan al idioma elegido·
    **Decisión: sí.** Hoy las 7 llamadas a `toLocale*` van sin argumento, así que
    siguen el locale **del sistema**, que puede no coincidir con el idioma elegido:
    un teléfono en inglés con la app en español pinta `9/4/2026` junto a
    `Última señal`. Eso se ve, y es exactamente el tipo de mezcla que esta feature
    viene a eliminar. Se pasa el locale explícito de `useLocale()`
    (`es-MX` / `en-US`):·
    | Archivo | Línea | Llamada |
    |---|---:|---|
    | `src/app/(tabs)/home.tsx` | 48 | `new Date(iso).toLocaleString()` — dentro de `fmtLastSeen`, que pasa a recibir el locale |
    | `src/screens/profile/index.tsx` | 293 | `new Date(pet.lastCommunicationAt).toLocaleString()` |
    | `src/screens/pairing/index.tsx` | 428 | `new Date(...lastMessageAt).toLocaleString()` |
    | `src/screens/reminders/index.tsx` | 294 | `new Date(reminder.dueAt).toLocaleDateString()` |
    | `src/screens/add-reminder/index.tsx` | 196 | `date.toLocaleDateString()` |
    | `src/screens/add-reminder/index.tsx` | 212 | `time.toLocaleTimeString([], { hour, minute })` — el `[]` pasa a ser el locale |
    | `src/screens/add-pet/index.tsx` | 376 | `birthDate.toLocaleDateString()` |·
    `es-MX` porque el mercado del brief es Perú/México/Colombia y México es el
    mayor de los tres (el diseño usa prefijos `+52`); `en-US` como su contrapartida
    natural. Son dos constantes en `catalog.ts`, no una tabla de países.·
    **Riesgo declarado**: si el motor no tiene datos de ese locale, `Intl` degrada
    al locale por defecto **sin lanzar** — el comportamiento es exactamente el de
    hoy, así que el peor caso de este cambio es «no mejora», nunca «rompe». Hermes
    en RN 0.86 (Expo SDK 57) trae `Intl` con datos, así que se espera que mejore.·
    **Los tests no se rompen por esto**: los que asertan fechas las recalculan con
    la misma llamada (`home.test.tsx:583`), así que basta con que pasen el mismo
    locale. Los formatos numéricos de la app (`toFixed`, `%`, `kg`) no usan `Intl`
    y no cambian: `toLocaleString` de números **no se introduce aquí** — eso sería
    cambiar cómo se ven todas las cifras, y no lo pide nadie.·
    ---·
    ## 4. Los tests·
    ### 4.1 El fixture y el escaneo·
    Dos ficheros nuevos del lado de test:·
    - `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` — la **tabla de uso**:
      qué clave se usa en qué archivo, transcrita de §2.·
      ```ts
      export type UseRow = { file: string; key: TranslationKey };
      export const R1_AUTH: UseRow[] = [ /* 29 */ ];
      // … R2 5, R3 20, R4 19, R5 32, R6 35, R7 35, R8 50, R9 40, R10 40, R11 15
      export const ALL_USES: UseRow[] = [...]; // 320
      ```·
    - `mobile-pet-tracker/src/__tests__/ui-language.test.ts` — un `describe` por
      R-id, todos sobre el mismo helper:·
      ```ts
      const norm = (s: string) => s.replace(/\\s+/g, ' ').trim();
      function checkUses(uses: UseRow[]) {
        for (const { file, key } of uses) {
          const src = readFileSync(join(SRC, file), 'utf8');
          expect(src).toContain(`t('${key}'`);          // (a) resuelve por clave
        }
      }
      function checkNoLooseCopy(files: string[]) {      // (b) cero copy suelta
        for (const file of files) {
          const src = readFileSync(join(SRC, file), 'utf8');
          for (const value of [...Object.values(en), ...Object.values(es)]) {
            if (value.includes('{{')) continue;         // (c) las 11 con parámetro
            expect(wholeLiterals(src)).not.toContain(norm(value));
          }
        }
      }
      ```·
      `wholeLiterals(src)` extrae **cadenas entrecomilladas completas** y **nodos
      de texto JSX completos**, normaliza espacios y devuelve la lista. La
      comparación es de **igualdad**, no de subcadena, y eso es lo que hace que
      **no haga falta ninguna lista de excepciones**: `className` no es igual a
      `Name`, `\"email-address\"` no es igual a `Email`, `WeightChart` no es igual a
      `Weight`. Verificado sobre las 274 parejas *(archivo, cadena)* del commit
      base: la igualdad por literal entero coincide con el conteo de copy en
      **todas** salvo las 11 con interpolación, que quedan cubiertas por (a).·
      Patrón de escaneo de fuente ya usado en el repo:
      `src/__tests__/design-drift.test.ts`,
      `src/__tests__/consistency-classnames.test.ts`,
      `src/__tests__/legibility-classnames.test.ts` y
      `src/__tests__/hosting-artifacts.test.ts` (este último ya asevera sobre
      archivos de fuera de `mobile-pet-tracker/`, que es lo que necesita R19).·
    ### 4.2 En qué idioma corren los tests: en **español**, el de por defecto·
    **Decisión: los ~178 tests de pantalla corren en español** y siguen aseverando
    la cadena visible tal cual (`getByText('Iniciar sesión')`), sin envolver nada.·
    Tres razones:·
    1. **El español es lo que ve el usuario por defecto.** La suite prueba lo que
       se envía, no una configuración que casi nadie tendrá.
    2. **Repetir los 178 asserts en inglés no descubre nada nuevo.** Lo que puede
       romperse del inglés es *que falte una clave o un parámetro*, y eso lo
       demuestra el test de R12 —paridad de claves por tipo, paridad de marcadores
       por test— sobre las 255 entradas de golpe, no 178 renders.
    3. **El coste del alternativo es real**: los 19 ficheros de test tienen su
       propio `renderX()`, así que correr en dos idiomas pide un parámetro de
       idioma en 19 helpers, ~178 aserciones duplicadas y un fixture con las dos
       columnas por ancla. Es más de la mitad del trabajo de la feature para
       confirmar lo que el tipo ya garantiza.·
    **Lo que sí se prueba en inglés**, para que la columna no sea decorativa: el
    test de R14 cambia el idioma y comprueba que **la pantalla se repinta en
    inglés**, con al menos **seis** aserciones que cubren los seis tipos de copy —
    título de pantalla, etiqueta de pestaña, botón, mensaje de error, estado vacío
    y `placeholder`—. Seis renders en inglés, no 178.·
    > Si el humano prefiere la suite en los dos idiomas, es una enmienda a esta
    > spec antes del handoff, y el coste está arriba, medido.·
    ### 4.3 Los 6 `testID` nuevos de R17·
    Los `describe('#62 R5: el título de card usa un único tratamiento')` localizan
    un nodo **por su texto** para después aseverar su `props.className`. El texto
    ahí es un *localizador*, no lo que se prueba: anclarlo a la copy es el
    acoplamiento que encarece esta feature.·
    | Archivo de fuente | Línea | Nodo | `testID` nuevo | Test que lo consume |
    |---|---:|---|---|---|
    | `src/app/(tabs)/home.tsx` | 255 | título `home.summaryTitle` | `summary-card-title` | `home.test.tsx:771` |
    | `src/app/(tabs)/health.tsx` | 217 | título `health.weight` | `weight-card-title` | `health.test.tsx:612` |
    | `src/app/(tabs)/food.tsx` | 174 | título `food.mealsToday` | `food-meals-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/food.tsx` | 259 | título `food.aiRecommendation` | `food-ai-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/food.tsx` | 296 | título `food.mealSchedule` | `meal-schedule-link-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/meal-schedule.tsx` | 269 | título `mealSchedule.nutritionProfile` | `nutrition-profile-title` | `meal-schedule.test.tsx:460` |·
    Cambios exactos: `home.test.tsx:771`, `health.test.tsx:612` y
    `meal-schedule.test.tsx:460` pasan de `findByText('…')` a
    `findByTestId('<id>')`, con la aserción de `className` **idéntica byte a
    byte**; `food.test.tsx:521-522` cambia su `it.each` de las tres cadenas a los
    tres `testID`, `findByText(title)` a `findByTestId(testID)`, y el título del
    `it` de `'aplica la receta canónica a %s'` a
    `'aplica la receta canónica al título %s'`.·
    **No se pierde ni una aserción de copy.** Cuatro de las seis cadenas siguen
    asertadas en otro sitio (`Resumen de hoy` en `home.test.tsx:453`, `Peso` en
    `health.test.tsx:460`, `Recomendación IA` en `food.test.tsx:426`,
    `Perfil nutricional` en `meal-schedule.test.tsx:240`); las **2** que se
    quedarían sin cubrir —`Comidas hoy` y `Horario de comidas`— se reponen con dos
    `getByText` en el test que ya renderiza el plan de `food`. Neto: **246 → 244**
    llamadas de texto (−4 migradas, +2 nuevas) y **796 → ≥800** consultas por
    `testID` (+4 migradas, +1 `language-toggle`, y `≥` porque los tests de R14 y
    R17 añaden alguna más).·
    **Ningún otro ancla se migra.** Las otras 172 comprueban *el texto que se
    muestra*, que es justo lo que esta feature cambia. Convertirlas a `testID`
    borraría la aserción, no la desacoplaría.·
    ### 4.4 Los 6 títulos de test que citan copy y hay que actualizar·
    | Fichero | Línea | Actual | Nuevo |
    |---|---:|---|---|
    | `src/app/(tabs)/__tests__/health.test.tsx` | 609 | `aplica la receta canónica a Weight` | `… a Peso` |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 919 | `muestra mensaje y Retry cuando last devuelve error` | `… y Reintentar …` |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 935 | `Retry llama al refetch de last y recupera el mapa` | `Reintentar llama al refetch …` |
    | `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 450 | `aplica la receta canónica a Nutrition profile` | `… a Perfil nutricional` |
    | `src/app/(tabs)/__tests__/food.test.tsx` | 522 | `aplica la receta canónica a %s` | `aplica la receta canónica al título %s` |
    | `src/screens/pairing/index.test.tsx` | 413 | `R7: … muestra \"Tracker is ready\" …` | `… muestra \"El collar está listo\" …` |·
    Los otros ~44 títulos en inglés se quedan: [[requirements]] §Fuera de alcance 10.·
    ---·
    ## 5. Archivos afectados·
    Todo es capa de **presentación** de la app móvil. `backend-pet-tracker/` **no
    se abre en ningún commit**.·
    **Fuente, nuevos (3)** — `src/i18n/catalog.ts`,
    `src/providers/language-provider.tsx`, `src/utils/language-preference.ts`.·
    **Fuente, modificados (21)** — los 19 de §1.3, más `src/app/_layout.tsx`
    (montaje del provider, §3.2) y `src/utils/reminder-meta.ts` ya contado en los
    19. En total: los 19 con copy + `_layout.tsx`.·
    **Tests nuevos (3)** — `src/__tests__/ui-copy-table.ts` (fixture),
    `src/__tests__/ui-language.test.ts`,
    `src/providers/__tests__/language-provider.test.tsx`,
    `src/utils/language-preference.test.ts`.·
    **Tests que se actualizan (19 + 2)** — los 19 de §1.4, más
    `src/app/__tests__/layout.test.tsx` (R16) y
    `src/screens/profile/index.test.tsx` (R14, además de sus 3 anclas).·
    **Docs y specs (10)** — `docs/ui-guidelines.md` (R20) y las 9 specs de §6.1
    (R19).·
    **No se tocan**: `mobile-pet-tracker/src/theme/` (incluido `global.css`),
    `src/api/`, `src/hooks/`, `app.json`, `package.json`, `hosting/`,
    `backend-pet-tracker/`, `infra/`.·
    ---·
    ## 6. Gobernanza·
    ### 6.1 Las 9 specs aprobadas que ratificaron el inglés·
    El informe nombraba **6**. El barrido de `specs/` encuentra **9**: las 6 más 3
    que el informe no listó, en las listas de «decisiones menores objetables en
    este gate» de #35, #36 y #37, que son ratificación igual.·
    | # | Fichero | Línea | Frase que ratifica el inglés |
    |---|---|---:|---|
    | 1 | `specs/mobile-auth/requirements.md` | 248 | «Decisiones menores objetables en este gate: … **copy en inglés**, `headerShown: false` global (§D5).» |
    | 2 | `specs/mobile-home-dashboard/requirements.md` | 309 | «… **textos en inglés** (`Free`, `No pets yet`, etc.) …» |
    | 3 | `specs/mobile-map-live/requirements.md` | 285 | «Menores objetables: … **textos en inglés**, botón Lost Mode con `Coming soon` …» |
    | 4 | `specs/mobile-health/requirements.md` | 379-380 | «Menores objetables: … **textos en inglés**, vencidas en `text-danger` sin badge.» |
    | 5 | `specs/mobile-food/design.md` | 197-200 | «**D8 — Idiomas.** Textos de UI **en inglés** (consistencia con Home/Map/Health). Los `warnings[].message` del backend llegan en español y se muestran tal cual …» |
    | 6 | `specs/mobile-food/requirements.md` | 332 | «Menores (… **UI en inglés** con warnings del backend en español tal cual …): sin objeción, quedan como están.» |
    | 7 | `specs/mobile-reminders/requirements.md` | 64-65 | «**UI en inglés** (decisión de #38 vigente); el diseño está en español, los literales de esta spec son los normativos.» |
    | 8 | `specs/auth-reset-deep-link/design.md` | 182-183 | «**Copy de la app en inglés**, como el resto de pantallas.» |
    | 9 | `specs/mobile-device-pairing/design.md` | 202-228 | «**### D7 — Copy: inglés, strings exactos**» + una tabla de **18 filas** de «Texto exacto» que fija literalmente `Pair collar`, `Free plan — health only…`, `Activation code`, `Tracker is ready`, `Unpair collar?`… Es la ratificación más fuerte: no dice «en inglés», enumera los strings |·
    **Dos notas de aplazamiento que NO son ratificación y no necesitan gate**:
    `specs/mobile-ui-legibility-polish/requirements.md:286` (#61) y
    `specs/mobile-ui-consistency-polish/requirements.md:343` (#62) listan «unificar
    el idioma de la UI» como **fuera de alcance**. Aplazar no es ratificar, y esta
    feature es la que cierra el aplazamiento.·
    ### 6.2 La enmienda concreta (texto literal a insertar)·
    **El tono cambia respecto de una traducción a secas, y es importante**: con el
    catálogo, **el literal inglés que esas specs fijaron no desaparece**. Se mueve
    a la columna `en` y sigue siendo lo que ve un usuario que elija inglés. La
    enmienda no revoca sus strings: los **reubica** y cambia el idioma **por
    defecto**.·
    **(a)** En la línea que ratifica el inglés (columna «Línea» de §6.1), marcar la
    frase y apuntar al bloque. Una forma por caso:·
    - #1, #2, #3, #4, #6 (listas de menores): `copy en inglés` →
      `~~copy en inglés~~ copy en los dos idiomas desde #65, español por defecto (ver §Enmienda #65)`
      — y equivalentes para `textos en inglés` / `UI en inglés`.
    - #5: `- **D8 — Idiomas.**` →
      `- **D8 — Idiomas.** ~~Textos de UI en inglés (consistencia con Home/Map/Health).~~ **Enmendado por #65: los textos de UI viven en el catálogo de dos idiomas; el inglés de esta spec es la columna `en` y el español por defecto es la `es` (ver §Enmienda #65).**`
      El resto de D8 —los `warnings[].message` del backend en español, mostrados
      tal cual— **sigue vigente y no se toca**: es justo lo que R6 conserva, y en
      los dos idiomas.
    - #7: `UI en inglés (decisión de #38 vigente)` →
      `~~UI en inglés (decisión de #38 vigente)~~ **UI en catálogo de dos idiomas desde #65, español por defecto (ver §Enmienda #65)**; los literales de esta spec pasan a ser la columna `en` de su clave.`
    - #8: `Copy de la app en inglés, como el resto de pantallas.` →
      `~~Copy de la app en inglés, como el resto de pantallas.~~ **Copy de la app en el catálogo de dos idiomas desde #65, español por defecto (ver §Enmienda #65).**`
    - #9 (la que más cambia de tono): el encabezado
      `### D7 — Copy: inglés, strings exactos` pasa a
      `### D7 — Copy: strings exactos, ahora en dos idiomas (enmendado por #65)` y,
      justo debajo de la tabla de 18 filas, se inserta:
      `> **Enmendada por #65.** Los 18 «Texto exacto» de esta tabla **siguen siendo normativos**: son la columna `en` de su clave en `specs/mobile-ui-language/design.md` §2.10, y un usuario que elija inglés los sigue viendo palabra por palabra. Lo que cambia es que ya no son el único idioma y que el idioma por defecto es español; el texto que ve ese usuario está en la columna `es` de la misma fila. Los testID de esta tabla no cambian.`·
    **(b)** Al final de cada uno de los 9 ficheros, antes de `## Aprobación` si lo
    hay, insertar **este bloque, literal**, sustituyendo `<FEATURE>` por el nombre
    de la carpeta de esa spec:·
    ```markdown
    ## Enmienda #65 — idioma de la UI·
    El 2026-09-04 el humano decidió que la UI móvil va en español, y el 2026-09-05
    que la feature sea un **catálogo de dos idiomas con interruptor en Profile y
    español por defecto** (`progress/explore_design-gap-vs-make.md` §4, decisión A
    y su ampliación). Esta spec ratificó el inglés en su día; esa parte queda
    **enmendada**.·
    - **Qué cambia**: el literal de UI que esta spec fija deja de estar escrito en
      la pantalla y pasa a resolverse por clave contra el catálogo. El idioma por
      defecto es el español.
    - **Qué NO cambia**: **el literal inglés de esta spec sigue siendo normativo**
      como columna `en` de su clave — un usuario que elija inglés lo sigue viendo
      palabra por palabra. Y no cambia ningún requisito `R<n>`, ningún `testID`,
      ninguna conducta, ningún contrato de API ni ninguna decisión visual. La
      trazabilidad `R-id ↔ test` de `<FEATURE>` sigue siendo válida.
    - **Fuente única del literal y de la clave**:
      `specs/mobile-ui-language/design.md` §2. Si esta spec y esa tabla discrepan,
      **manda la tabla**.
    - **Los mensajes de validación del backend siguen en inglés en los dos
      idiomas** y esta enmienda no los toca
      (`specs/mobile-ui-language/requirements.md` §Fuera de alcance 1).·
    - [ ] Enmienda aprobada por humano (fecha: ____)
    ```·
    La casilla la marca **el humano**, en el mismo gate que aprueba esta spec.
    Ningún agente la marca (`AGENTS.md` §3).·
    ### 6.3 Texto literal para `docs/ui-guidelines.md` (lo escribe R20)·
    Se añade como punto **6** de §Dirección de arte, después de «5. Fidelidad no es
    pérdida de información»:·
    ```markdown
    **6. Idioma: catálogo de dos idiomas, español por defecto.** Decidido por el
    humano el 2026-09-04 (español) y el 2026-09-05 (catálogo + interruptor), y
    ejecutado por la feature #65. **Ninguna pantalla escribe texto**: todo lo que
    ve el usuario —títulos, etiquetas, placeholders, `accessibilityLabel`,
    mensajes de error, botones de `Alert`— se resuelve con `t('<ámbito>.<clave>')`
    contra `mobile-pet-tracker/src/i18n/catalog.ts`. Toda spec que introduzca copy
    nueva **añade su clave en los dos idiomas** en el mismo gate y la registra en
    la tabla de `specs/mobile-ui-language/design.md` §2; una clave que exista en un
    idioma y no en el otro no compila. Donde el diseño del Make da la palabra en
    español se usa **la del diseño**. **No hay librería de i18n y no se instala
    una**, ni `expo-localization`: el idioma es elección explícita del usuario en
    Profile, no detección del idioma del teléfono. Las fechas y las horas siguen al
    idioma elegido (`es-MX` / `en-US`), no al locale del sistema.·
    Tres corolarios que nadie debe confundir con lo anterior:·
    - **El idioma del código no cambia.** Nombres de variables, funciones, tipos,
      ficheros, `testID`, rutas y **las claves del catálogo** siguen en inglés, y
      los mensajes de commit también (`docs/conventions.md` §Commits).
    - **El backend sigue devolviendo validaciones en inglés, en los dos idiomas.**
      Se ve en `login-error`, `register-*-error`, `weight-form-error` y
      `reset-error`, porque son mensajes de Zod de `backend-pet-tracker/`.
      Traducirlos es una feature de backend. Al revés, las advertencias
      nutricionales del backend ya llegan en español y se muestran tal cual — y en
      inglés también, porque tampoco se traducen.
    - **Los valores de enum que la API devuelve se pintan crudos**: `pet.sex`,
      `document.type`, `foodType`, `activityLevel`. Siguen en inglés en los dos
      idiomas. Mapearlos es cambio de conducta y va a feature propia.
      `device.connectivity` dejó de pintarse crudo en la feature #68 (R16): se
      resuelve por catálogo en `src/utils/device-connectivity.ts`.
    ```·
    ---·
    ## 7. Alternativas descartadas·
    - **Traducir los 309 literales en el sitio ahora y añadir el interruptor
      después.** Descartado por el humano el 2026-09-05 con la cuenta hecha: son
      los mismos 309 sitios y las mismas 178 anclas **dos veces**. Metido dentro,
      el número de ediciones es idéntico y solo cambia con qué se sustituye.
    - **Instalar `i18next` / `react-intl` / `lingui`.** §3.1 D1: 255 claves × 2
      idiomas es un objeto y un contexto, y el repo ya tiene los dos patrones.
    - **`expo-localization` para detectar el idioma del teléfono.** §3.1 D2: el
      idioma es elección explícita. Es la decisión que se reabre si algún día se
      quiere, y son tres líneas sobre esta base.
    - **Catálogo plano, una clave por cadena inglesa (213 claves).** Descartado en
      §2.0 D2: colisiona `Food` (pestaña `Nutrición`) con `Food` (tipo de
      recordatorio `Comida`) y obliga a elegir una sola traducción para dos cosas
      distintas.
    - **Claves derivadas del español.** Descartado en §2.0 D1: el español es lo que
      el humano puede cambiar en la revisión, y renombrar claves cada vez que se
      ajusta una palabra es churn puro. Además el idioma del código es el inglés.
    - **Claves anidadas (`login.form.email`).** Dos niveles no aportan nada con 255
      claves y complican el tipo `TranslationKey`.
    - **Un selector de idioma con lista o `Picker`.** Descartado en §3.3: con dos
      idiomas, un botón que dice `English` es más corto de entender y son cero
      componentes nuevos. El `Picker` entra cuando entre el tercer idioma.
    - **Una pantalla de ajustes.** No existe hoy; crearla no entra aquí (decisión
      del humano del 2026-09-05).
    - **Correr la suite en los dos idiomas.** §4.2, con el coste medido: parámetro
      de idioma en 19 helpers, ~178 aserciones duplicadas, fixture con dos
      columnas por ancla. Lo que descubriría —que falta una clave o un parámetro—
      lo demuestra el tipo y el test de R12 sobre las 255 entradas de golpe.
    - **Dejar las fechas con el locale del sistema.** §3.6: se ve, y es la misma
      mezcla que la feature elimina. El peor caso del cambio es «no mejora».
    - **Motor de plurales / ICU.** No hay ni un plural que se rompa en el catálogo
      (`{{days}} días` funciona con 1 y con 5). Infraestructura sin usuario.
    - **Animar el cambio de idioma** con `withThemeTransition`. §3.4: no es un
      cambio de superficie y sería motion no pedido.
    - **Reescribir los literales dentro de las 9 specs aprobadas.** §6.2:
      duplicaría el catálogo en nueve sitios y garantizaría la deriva. El bloque de
      enmienda deja **una** fuente de verdad — y además, con el catálogo, esos
      literales **siguen siendo válidos** como columna `en`.
    - **Migrar a `testID` todas las anclas de texto.** §4.3: 172 de las 178
      comprueban *el texto que se muestra*. Cambiarlas borraría la aserción.
    - **Mapear los 5 enums de la API de paso.** Cambio de conducta sobre datos.
      Declarado en [[requirements]] §Fuera de alcance 2 con sus 5 sitios exactos,
      para que la brecha se vea y no se descubra en el smoke.
    "
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › map.noTrackingTitle tiene fila de #159 en mobile-ui-language

    expect(received).toContain(expected) // indexOf

    Expected substring: "| — | `map.noTrackingTitle` | `No live location` | `Sin ubicación en vivo` | ← añadida por #159 (R1) |"
    Received string:    ""
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › map.noTrackingBody tiene fila de #159 en mobile-ui-language

    expect(received).toContain(expected) // indexOf

    Expected substring: "| — | `map.noTrackingBody` | `Once your pet has a collar with an active plan, I'll show you where they are.` | `Cuando tu mascota tenga un collar con plan activo, te muestro dónde está.` | ← añadida por #159 (R1) |"
    Received string:    ""
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › geofences.noTrackingTitle tiene fila de #159 en mobile-ui-language

    expect(received).toContain(expected) // indexOf

    Expected substring: "| — | `geofences.noTrackingTitle` | `Safe zones unavailable` | `Zonas seguras no disponibles` | ← añadida por #159 (R1) |"
    Received string:    ""
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › geofences.noTrackingBody tiene fila de #159 en mobile-ui-language

    expect(received).toContain(expected) // indexOf

    Expected substring: "| — | `geofences.noTrackingBody` | `Once your pet has a collar with an active plan, I'll let you know if they leave a safe zone.` | `Cuando tu mascota tenga un collar con plan activo, te aviso si sale de una zona segura.` | ← añadida por #159 (R1) |"
    Received string:    ""
```

Cadena literal del handoff c1:
```text
grep -qE '^Tests: +13 failed, 64 passed, 77 total$' /tmp/159-r1.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r1.txt)" = 13 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-r1.txt \
    && ! grep -qF 'Unable to find' /tmp/159-r1.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/__tests__/empty-state.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'test(mobile-no-collar-states): #159 R1 red no-collar copy'
[feature/159-mobile-no-collar-states-pingo 6906af80] test(mobile-no-collar-states): #159 R1 red no-collar copy
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 51 insertions(+)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `6906af80 test(mobile-no-collar-states): #159 R1 red no-collar copy`.

## c2

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx > /tmp/159-g1.txt 2>&1; echo "exit=$?"
Test Suites: 2 passed, 2 total
Tests:       101 passed, 101 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-g1-guardas.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
exit=0
```

Cadena literal del handoff c2:
```text
grep -qE '^Tests: +101 passed, 101 total$' /tmp/159-g1.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g1-guardas.txt \
    && test "$(grep -cE "^\s+'(map\.noTrackingTitle|map\.noTrackingBody|geofences\.noTrackingTitle|geofences\.noTrackingBody)':" src/i18n/catalog.ts)" = 8 \
    && test "$(grep -cF '### §2.23 — Añadidos por #159 — Pingo sin collar' ../specs/mobile-ui-language/design.md)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/i18n/catalog.ts src/providers/__tests__/language-provider.test.tsx ../specs/mobile-ui-language/design.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx specs/mobile-ui-language/design.md ' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'feat(mobile-no-collar-states): #159 R1 no-collar copy in catalog and language table'
[feature/159-mobile-no-collar-states-pingo b77f23ff] feat(mobile-no-collar-states): #159 R1 no-collar copy in catalog and language table
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 3 files changed, 19 insertions(+), 1 deletion(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `b77f23ff feat(mobile-no-collar-states): #159 R1 no-collar copy in catalog and language table`.

## c3

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-r2-map.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       3 failed, 96 passed, 99 total
exit=1
```

```text
  ● R5: mascota free degrada sin mapa › shows the collar requirement without map, stats, lost mode, or polling

    Unable to find an element with testID: map-no-tracking-body

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-map"[39m
      [36m>[39m
        [36m<View>[39m
          [36m<Text[39m
            [33mtestID[39m=[32m"map-no-tracking"[39m
          [36m>[39m
            [0mEl rastreo en vivo requiere un collar[0m
          [36m</Text>[39m
        [36m</View>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m
```

```text
  ● #159 R2: Mapa sin seguimiento presenta a Pingo › pinta la pose del collar, el título y la frase de Pingo

    Unable to find an element with testID: map-no-tracking-pose

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-map"[39m
      [36m>[39m
        [36m<View>[39m
          [36m<Text[39m
            [33mtestID[39m=[32m"map-no-tracking"[39m
          [36m>[39m
            [0mEl rastreo en vivo requiere un collar[0m
          [36m</Text>[39m
        [36m</View>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m
```

```text
  ● #159 R2: Mapa sin seguimiento presenta a Pingo › queda en el sitio del texto que sustituye y sin mapa debajo

    Unable to find an element with testID: map-no-tracking-pose

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-map"[39m
      [36m>[39m
        [36m<View>[39m
          [36m<Text[39m
            [33mtestID[39m=[32m"map-no-tracking"[39m
          [36m>[39m
            [0mEl rastreo en vivo requiere un collar[0m
          [36m</Text>[39m
        [36m</View>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m
```

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-r2-es.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 77 passed, 79 total
exit=1
```

```text
  ● #159 R2: el texto de rastreo en vivo se retira › map.trackingNeedsCollar ya no existe en ningún idioma y queda retirada en mobile-ui-language

    expect(received).not.toContain(expected) // indexOf

    Expected value: not "map.trackingNeedsCollar"
    Received array:     ["login.invalidCredentials", "common.cannotReachServer", "common.somethingWentWrong", "login.signIn", "login.email", "login.password", "login.createAccount", "login.forgotPassword", "forgot.forgotPassword", "forgot.email", "forgot.sendRecoveryLink", "forgot.instructions", "forgot.checkYourEmail", "forgot.sentTo", "forgot.resend", "forgot.invalidEmail", "forgot.tooManyAttempts", "forgot.backToSignIn", "register.emailAlreadyRegistered", "register.createAccount", "register.firstName", "register.lastName", "register.email", "register.phone", "register.password", "register.confirmPassword", "register.country", "register.iAcceptTerms", "tabs.home", "tabs.map", "tabs.health", "tabs.food", "tabs.profile", "home.noLocationDataYet", "home.lastSeen", "home.home", "common.retry", "common.noPetsYet", "common.noPetsBody", "home.free", "home.online", "home.offline", "home.unknown", "home.noCollar", "home.pairCollar", "home.summaryTitle", "home.activityNeedsCollar", "home.couldNotLoadActivity", "home.activity", "home.walks", "home.sleep", "home.distance", "home.weight", "home.quickActions", "home.quickActionWeight", "home.quickActionReminder", "home.quickActionDocuments", "home.viewOnMap", "home.reminders", "home.remindersSeeAll", "home.nextVaccineDays", "home.nextVaccineDaysLeft", "home.nextVaccineToday", "home.nextVaccineOverdue", "home.noUpcomingVaccine", "home.alertsBell", "home.alertsBellUnread", "alerts.title", "alerts.empty", "alerts.emptyBody", "alerts.ack", "alerts.typeGeofenceExit", "alerts.typeBatteryLow", "alerts.typeUnknown", "alerts.statusAcked", "alerts.statusClosed", "alerts.justNow", "alerts.minutesAgo", "alerts.hoursAgo", "alerts.daysAgo", "alerts.detailTitle", "alerts.statusOpen", "alerts.openedAt", "geofences.title", "geofences.empty", "geofences.emptyBody", "geofences.noTrackingTitle", "geofences.noTrackingBody", "geofences.needsCollar", "geofences.radius", "geofences.activeLabel", "geofences.statusActive", "geofences.statusInactive", "geofences.delete", "geofences.cancel", "geofences.deleteTitle", "geofences.deleteBody", "geofenceEditor.title", "geofenceEditor.nameLabel", "geofenceEditor.mapHint", "geofenceEditor.radiusLabel", "geofenceEditor.resetNote", "geofenceEditor.save", "geofenceEditor.nameTaken", "geofenceEditor.limitReached", "geofenceEditor.invalid", "geofenceEditor.notFound", "geofenceEditor.add", "geofenceEditor.editLabel", "geofenceEditor.limitNotice", "geofenceEditor.ownerOnly", "weeklyActivity.metricActiveMinutes", "weeklyActivity.metricDistance", "weeklyActivity.metricWalks", "weeklyActivity.dayLabelActiveMinutes", "weeklyActivity.dayLabelDistance", "weeklyActivity.dayLabelWalks", "weeklyActivity.dayLabelMissing", "weeklyActivity.chartSummary", "weeklyActivity.trend", "weeklyActivity.title", "weeklyActivity.lastSevenDays", "weeklyActivity.noDataYet", "weeklyActivity.noDataForDay", "weeklyActivity.average", "deviceConnectivity.online", "deviceConnectivity.unknown", "deviceConnectivity.offline", "map.justNow", "map.agoMinutes", "map.agoHours", "map.noSignal", "map.live", "map.stale", "map.noTrackingTitle", "map.noTrackingBody", "map.trackingNeedsCollar", "map.noLocationDataYet", "map.gps", "map.speed", "map.distance", "map.updated", "map.deactivateLostMode", "map.activateLostMode", "map.couldNotUpdateLostMode", "health.health", "health.vaccines", "health.nextDue", "health.noVaccinesYet", "health.couldNotLoadVaccines", "health.weight", "health.noWeightEntriesYet", "health.couldNotLoadWeight", "health.weightLog", "weightLog.enterValidWeight", "weightLog.errorForbidden", "weightLog.weightLog", "weightLog.weight", "weightLog.weightKg", "weightLog.measuredAt", "weightLog.yyyyMmDd", "weightLog.bodyCondition", "weightLog.bodyConditionPlaceholder", "weightLog.logWeight", "weightLog.noWeightEntriesYet", "weightLog.bodyConditionValue", "weightLog.dateCannotBeAfterToday", "weightChart.notEnoughDataYet", "food.food", "food.dailyTarget", "food.dailyKcal", "food.dailyGrams", "food.kcalConsumedOfTarget", "food.mealsToday", "food.markServed", "food.undoServed", "food.couldNotUpdateMeal", "food.mealsServedOfTotal", "food.pending", "food.served", "food.aiRecommendation", "food.noMealPlanYet", "food.noMealPlanBody", "food.couldNotLoadPlan", "food.mealSchedule", "food.mealScheduleLinkSubtitle", "mealSchedule.errorForbidden", "mealSchedule.errorProfileRequired", "mealSchedule.registerWeightFirst", "mealSchedule.mealSchedule", "mealSchedule.dailyTarget", "mealSchedule.dailyGrams", "mealSchedule.mealsPerDay", "mealSchedule.timesAndPortions", "mealSchedule.noMealPlanYet", "mealSchedule.generatePlan", "mealSchedule.nutritionProfile", "mealSchedule.noNutritionProfileYet", "mealSchedule.addMeal", "mealSchedule.editTime", "mealSchedule.editTimeLabel", "mealSchedule.errorInvalidTime", "mealSchedule.errorEditForbidden", "mealSchedule.errorPlanRequired", "mealSchedule.errorTimeNotInPlan", "mealSchedule.errorDuplicateTime", "mealSchedule.errorMealLimit", "profile.notRegistered", "profile.sterilized", "profile.notSterilized", "profile.ageMonths", "profile.errorPhotoFormat", "profile.couldNotUploadPhoto", "profile.profile", "profile.addPet", "profile.couldNotLoadPets", "profile.couldNotLoadPet", "profile.changePhoto", "profile.information", "profile.breed", "profile.microchip", "profile.gpsDevice", "profile.lastSignal", "profile.documents", "profile.gpsSettings", "profile.reminders", "profile.account", "profile.accountUnavailable", "profile.useDarkTheme", "profile.useLightTheme", "profile.signOut", "profile.notificationsBlocked", "profile.openSettings", "docs.documentsOf", "docs.pet", "docs.noDocumentsYet", "docs.emptyBody", "docs.couldNotLoadDocuments", "reminders.errorForbidden", "reminders.reminders", "reminders.new", "reminders.noRemindersYet", "reminders.emptyBody", "reminders.active", "reminders.thisWeek", "reminders.inactive", "reminders.upcoming", "reminders.cancelled", "reminders.sent", "reminders.dueInDays", "reminders.delete", "reminders.deleteReminder", "reminders.deleteSheetBody", "reminders.cancel", "reminderType.vaccine", "reminderType.deworming", "reminderType.medication", "reminderType.appointment", "reminderType.weight", "reminderType.food", "reminderType.other", "addReminder.advanceSameDay", "addReminder.advance1Day", "addReminder.advance3Days", "addReminder.advance7Days", "addReminder.titleIsRequired", "addReminder.pickDate", "addReminder.dateMustBeFuture", "addReminder.errorForbidden", "addReminder.addReminder", "addReminder.type", "addReminder.title", "addReminder.reminderTitle", "addReminder.date", "addReminder.selectDate", "addReminder.time", "addReminder.alert", "addReminder.saveReminder", "addPet.errorPhotoFormat", "addPet.nameIsRequired", "addPet.chooseBirthDate", "addPet.errorAgeRange", "addPet.errorPhotoAfterCreate", "addPet.checkPetDetails", "addPet.youCannotCreatePet", "addPet.addPet", "addPet.pet", "addPet.avatarPreview", "addPet.choosePhoto", "addPet.basicDetails", "addPet.species", "addPet.cat", "addPet.dog", "addPet.name", "addPet.petName", "addPet.breed", "addPet.optional", "addPet.sex", "addPet.female", "addPet.male", "addPet.size", "addPet.small", "addPet.medium", "addPet.large", "addPet.medicalDetails", "addPet.age", "addPet.birthDate", "addPet.approxMonths", "addPet.selectBirthDate", "addPet.months", "addPet.sterilized", "addPet.yes", "addPet.no", "addPet.microchip", "addPet.savePet", "pairing.errorInvalidCode", "pairing.errorAlreadyClaimed", "pairing.errorPetHasDevice", "pairing.errorNoSubscription", "pairing.errorForbiddenClaim", "pairing.errorForbiddenRelease", "pairing.unpairAlertTitle", "pairing.unpairAlertBody", "pairing.cancel", "pairing.unpair", "pairing.addPetFirst", "pairing.trackerIsReady", "pairing.readySubtitle", "pairing.model", "pairing.esn", "pairing.viewOnMap", "pairing.done", "pairing.pairCollar", "pairing.freePlanPairPrompt", "pairing.activationCode", "pairing.printedOnCollarBox", "pairing.gpsDevice", "pairing.battery", "pairing.connection", "pairing.lastMessage", "pairing.noMessagesYet", "pairing.gpsTrackingActive", "pairing.freePlanNoActivePlan", "pairing.planStatusUnavailable", "pairing.unpairCollar", "resetPassword.errorInvalidToken", "resetPassword.errorExpiredToken", "resetPassword.resetPassword", "resetPassword.errorMissingToken", "resetPassword.backToSignIn", "resetPassword.passwordUpdated", "resetPassword.newPassword", "resetPassword.confirmNewPassword", "resetPassword.updatePassword", "profile.languageSpanish", "profile.languageEnglish", "profile.changeLanguage", "food.mealsHistory", "food.mealsHistoryLinkSubtitle", "mealsHistory.mealsHistory", "mealsHistory.previousMonth", "mealsHistory.nextMonth", "mealsHistory.emptyMonth", "mealsHistory.noMealsOnDay", "mealsHistory.servedOne", "mealsHistory.servedMany", "welcome.brand", "welcome.chipGps", "welcome.chipHealth", "welcome.chipNutrition", "welcome.tagline", "welcome.getStarted", "welcome.haveAccount", "welcome.legalNotice", "welcome.pingoGreeting"]
```

```text
  ● #159 R2: el texto de rastreo en vivo se retira › docs/verification.md describe a Pingo en el paso 5 del plan Free

    expect(received).toContain(expected) // indexOf

    Expected substring: "el tab Map muestra a Pingo con `No live location`, sin el botón `Pair a collar` (la mascota ya tiene collar)"
    Received string:    "# Verification — Cómo demostrar que una feature funciona·
    > Antes de declarar cualquier feature como `done`, el implementer debe verificar
    > todos los puntos de esta guía. El reviewer repetirá los pasos críticos de
    > forma independiente.·
    ---·
    ## Verificación base (toda feature)·
    Los comandos exactos viven en `init.config.sh` de este proyecto.·
    ### 1. Build limpio·
    ```bash
    $BUILD_CMD
    # Debe terminar sin errores (ver init.config.sh para el comando real)
    ```·
    ### 2. Tests sin regresión·
    ```bash
    $TEST_CMD
    # Todos los tests previos deben seguir pasando
    ```·
    ### 3. Init verde·
    ```bash
    docker compose up -d
    ./init.sh
    # Debe terminar con \"✅ Todo verde\"
    ```·
    `./init.sh` requiere Postgres y LocalStack levantados. Si falta cualquiera de
    los destinos derivados del `.env`, aborta en vez de saltarse los E2E.·
    ---·
    ## Disciplina TDD·
    Esta es la regla central de verificación de este harness, no una sugerencia:·
    1. **El implementer escribe el test ANTES que el código.** Por cada requisito
       `R<n>` de `specs/<feature>/requirements.md`: primero un test que falla
       (rojo), después la implementación mínima que lo pasa (verde), después
       refactor manteniendo los tests en verde. Esto es exactamente el checklist
       de `specs/<feature>/tasks.md`.
    2. **Cada test nombra su requisito.** Convención: `describe('R1: ...', ...)`
       o el equivalente idiomático del framework de test de `NestJS + TypeScript + pnpm + LocalStack (AWS local)`
       (documentado en `docs/conventions.md`).
    3. **El reviewer verifica en el diff/historia** que los tests existen y
       nombran los R-ids correctos — no le basta con que \"algo\" tenga cobertura.
       Si una feature no tiene tests que nombren sus requisitos, el reviewer
       **rechaza**, sin excepción.
    4. **`specs/<feature>/traceability.md` se actualiza en cada commit**, nunca
       al final: cada fila pasa de \"pendiente\" a `test::nombre` + `hash commit`
       tan pronto ese requisito queda verde.·
    ---·
    ## Verificación por feature (a rellenar por el proyecto)·
    <!-- Cuando el proyecto tenga features concretas, añade aquí un bloque de
         verificación manual por feature (curl, comandos de CLI, pasos de UI),
         análogo a:·
    ### Feature <id> — <nombre>·
    ```bash
    # pasos de verificación manual específicos de esta feature
    ```
    -->·
    ### Feature 19 — aws-real-credentials·
    1. Inicia una sesión válida con `aws login`.
    2. En el `.env` raíz, comenta `AWS_ACCESS_KEY_ID=test` y
       `AWS_SECRET_ACCESS_KEY=test`. La cadena del SDK prioriza esas variables
       sobre la sesión y la suite falla de forma explícita si siguen presentes.
    3. Desde la raíz del repositorio, ejecuta:·
    ```bash
    AWS_MODE=aws pnpm -C backend-pet-tracker run test:e2e -- --runInBand test/aws-real-smoke.e2e-spec.ts
    ```·
    El `--` antes de `--runInBand` es obligatorio: sin él pnpm no reenvía los flags
    a jest. En PowerShell no existe el prefijo `VAR=valor comando`, así que usa
    Bash, o exporta `$env:AWS_MODE='aws'` en una línea aparte.·
    Resultado esperado: una suite con dos tests verdes, **sin `skipped`** — si la
    suite aparece saltada, `AWS_MODE` no llegó al proceso. La única llamada remota
    es `ListQueues`; no crea ni modifica recursos. Después de verificar, restaura
    las dos credenciales dummy para seguir usando LocalStack.·
    ### Feature 20 — aws-cdk-dev-stack·
    Estos pasos crean y usan recursos AWS reales. Los ejecuta el humano, en orden,
    y registra cada resultado en `progress/impl_aws-cdk-dev-stack.md` con ARNs y
    account-id redactados.·
    1. **R17 — Billing.** En la consola de AWS Billing, confirma que la cuenta del
       plan nuevo (creada después del 2025-07-15) cubre DynamoDB Standard
       provisionado hasta 25 RCU, 25 WCU y 25 GB. Registra también qué ocurre al
       agotar los créditos o al cumplirse la ventana de 6 meses antes de desplegar.
    2. **R18 — Bootstrap.** Comenta **las tres** variables de LocalStack en el
       `.env` raíz — `AWS_ENDPOINT_URL`, `AWS_ACCESS_KEY_ID` y
       `AWS_SECRET_ACCESS_KEY`. Comentar solo las credenciales **no basta**: el SDK
       v3 lee `AWS_ENDPOINT_URL` del entorno por su cuenta, así que con esa variable
       puesta `AWS_MODE=aws` sigue hablando con LocalStack y los tests pasan en
       verde sin tocar AWS (ocurrió de verdad al cerrar #20, ver
       `progress/impl_aws-cdk-dev-stack.md` §E2E AWS real).·
       Después inicia una sesión válida con `aws login` y usa un principal con
       `iam:*`. `PowerUserAccess` **no** los incluye; confírmalo antes de gastar un
       intento:·
       ```bash
       aws iam simulate-principal-policy \\
         --policy-source-arn arn:aws:iam::<accountId>:user/<user> \\
         --action-names iam:CreateRole iam:AttachRolePolicy iam:PutRolePolicy \\
         --query 'EvaluationResults[].{action:EvalActionName,decision:EvalDecision}'
       ```·
       Si sale `implicitDeny`, adjunta `AdministratorAccess` al usuario desde la
       consola con el root user, corre el bootstrap y **quítala después**: los
       deploys de R19-R20 funcionan con PowerUserAccess, verificado.·
       ```bash
       pnpm -C infra exec cdk bootstrap aws://<accountId>/us-east-1 --termination-protection
       ```·
       No añadas `--bootstrap-customer-key`.
    3. **R19 — Primer deploy.** Con PowerUserAccess y la sesión anterior:·
       ```bash
       pnpm -C infra exec cdk deploy PetTrackerDev --require-approval never
       ```·
       `--require-approval never` hace falta si lo lanzas desde un agente: sin TTY,
       CDK crea el changeset y se queda esperando una confirmación que nadie puede
       dar (`terminal (TTY) is not attached`). El cambio que pide aprobar es el de
       R11, la `QueuePolicy` de `geofence-events`. Desde una terminal normal puedes
       omitir el flag y confirmar a mano.·
       Debe terminar en `CREATE_COMPLETE`. El contador de CDK dirá `12/12` porque
       incluye el propio `AWS::CloudFormation::Stack`; los recursos de R13 son 11.
       No te fíes del contador, cuéntalos:·
       ```bash
       aws cloudformation list-stack-resources --stack-name PetTrackerDev \\
         --query 'StackResourceSummaries[].ResourceType' --output json
       ```
    4. **R20 — Deploy idempotente.** Ejecuta de nuevo el mismo comando `cdk deploy`
       sin cambiar `infra/`. Debe reportar `no changes` y no actualizar la stack.
    5. **R21 — Ingest real.** Desde Bash, ejecuta la suite específica:·
       ```bash
       AWS_MODE=aws pnpm -C backend-pet-tracker run test:e2e -- --runInBand test/aws-real-ingest.e2e-spec.ts
       ```·
       Ojo con el shell: el prefijo `!` de Claude Code corre **Bash**, no
       PowerShell. Si escribes ahí la forma `$env:AWS_MODE='aws'`, Bash la rechaza
       con `command not found`, `AWS_MODE` no llega al proceso y la suite se salta
       entera — verde falso por omisión. Usa `$env:` solo en una terminal
       PowerShell de verdad.·
       Debe quedar verde y **sin `skipped`**.·
       Desde la feature 21 la guarda automática aborta la corrida si
       `AWS_ENDPOINT_URL` sigue definida: resolver la configuración lanza
       `UnexpectedAwsEndpointError` antes de construir ningún cliente. El
       procedimiento manual ya no es la única red contra un verde falso.·
       Como verificación positiva opcional, comprueba el destino de una de estas
       dos formas:·
       - Mira los `QueueUrl` del output: si aparece
         `localhost.localstack.cloud` o el account `000000000000`, fuiste a
         LocalStack.
       - Mejor, prueba positiva: apaga LocalStack
         (`docker compose stop localstack`) y repite la suite. Si sigue verde, fue
         contra AWS real sin ambigüedad.·
       Al terminar, restaura las tres variables comentadas, vuelve a
       `AWS_MODE=local` y levanta LocalStack (`docker compose start localstack`).·
    Consecuencias de las políticas de borrado: si el bucket tiene objetos,
    `cdk destroy` falla y hay que vaciarlo manualmente antes; la tabla retenida
    sigue provisionada a 25/25 y consumiendo el cupo de la cuenta después de
    destruir la stack, hasta que el humano la elimine por separado.·
    ### Feature 21 — aws-mode-endpoint-guard·
    La guarda es automática y vive en `backend-pet-tracker/src/aws/aws-clients.ts`:
    con `AWS_MODE=aws` y `AWS_ENDPOINT_URL` definida, resolver la configuración
    lanza `UnexpectedAwsEndpointError` antes de construir ningún cliente, así que
    ninguna suite puede volver a pasar en verde contra LocalStack creyendo hablar
    con AWS real. Es simétrica a `MissingAwsEndpointError`, que cubre el caso
    inverso en modo `local`.·
    Para comprobarla a mano, desde la raíz y con `AWS_ENDPOINT_URL` sin comentar
    en el `.env`:·
    ```bash
    AWS_MODE=aws pnpm -C backend-pet-tracker run test:e2e -- --runInBand test/aws-real-ingest.e2e-spec.ts
    ```·
    Resultado esperado: la suite **falla** nombrando `AWS_ENDPOINT_URL`, sin
    ejecutar ninguna llamada remota. No hay que apagar LocalStack para
    distinguirlo.·
    Lo que la guarda **no** cubre: la CLI de CDK (`cdk bootstrap`, `cdk deploy`)
    no pasa por `aws-clients.ts` y lee `AWS_ENDPOINT_URL` del entorno por su
    cuenta, así que el paso R18 de la feature 20 sigue exigiendo comentar la
    variable a mano.·
    ### Feature 23 — init-env-drift-warning·
    Desde Git Bash y con la infraestructura local levantada, verifica el `.env`
    incompleto sin modificarlo:·
    ```bash
    stat -c '%Y %s' .env
    ./init.sh 2>&1 | tee /tmp/init-env-drift.txt
    stat -c '%Y %s' .env
    ./init.sh; echo $?
    ```·
    Los dos `stat` deben ser idénticos y el último comando debe imprimir `0`. Con
    las ocho claves del caso de #23 ausentes, §2 debe incluir exactamente:·
    ```text
    ⚠️  .env desactualizado: faltan 8 claves de .env.example
    ⚠️    gates ausentes (apagan features enteras en silencio): ACTIVITY_AGGREGATOR_ENABLED, ALERTS_ENGINE_ENABLED, EMAIL_ENABLED, PUSH_ENABLED
    ⚠️    configuración ausente: AWS_MODE, SIM_HOME_LAT, SIM_HOME_LNG, SIM_SEED
    ⚠️    init.sh no modifica .env — añade a mano las que necesites desde .env.example
    ```·
    Para R9(b), captura `/tmp/env-section-antes.txt` antes de editar `init.sh`.
    Después usa una copia temporal con un `.env` completo; no reemplaces el `.env`
    humano:·
    ```bash
    tmp_dir=\"$(mktemp -d)\"
    cp init.sh init.config.sh env-drift.mjs .env.example \"$tmp_dir/\"
    cp .env.example \"$tmp_dir/.env\"
    (cd \"$tmp_dir\" && ./init.sh 2>&1 | sed -n '/→ Verificando variables de entorno/,/→ Instalando dependencias/p') > /tmp/env-section-despues.txt
    diff /tmp/env-section-antes.txt /tmp/env-section-despues.txt
    rm -r \"$tmp_dir\"
    ```·
    El `diff` debe salir vacío y la captura no debe contener ninguna línea de
    deriva. Esta feature no añade variables de entorno.·
    ### Feature 28 — test-dev-resource-isolation·
    Este procedimiento manual lo ejecuta un humano desde la raíz del repositorio.
    Compara las tres colas de desarrollo antes y después de la corrida e2e
    completa; los valores deben quedar exactamente iguales.·
    ```bash
    # 1. Infra levantada y recursos de ambos entornos creados
    docker compose up -d
    pnpm -C backend-pet-tracker run provision:local·
    # 2. Recuento ANTES, de las tres colas de desarrollo
    for q in positions-raw notifications geofence-events; do
      aws --endpoint-url http://localhost:4566 sqs get-queue-attributes \\
        --queue-url \"$(aws --endpoint-url http://localhost:4566 sqs get-queue-url \\
          --queue-name \"$q\" --query QueueUrl --output text)\" \\
        --attribute-names ApproximateNumberOfMessages \\
          ApproximateNumberOfMessagesNotVisible ApproximateNumberOfMessagesDelayed
    done·
    # 3. Corrida e2e COMPLETA
    pnpm -C backend-pet-tracker run test:e2e·
    # 4. Recuento DESPUÉS: repetir el paso 2
    # Esperado: los tres recuentos idénticos a los del paso 2.
    ```·
    ### Feature 42 — mobile-device-pairing·
    Prerrequisitos: `docker compose up -d`, `.env` raíz con `SIM_MODE=true`
    (default) y `POLLER_ENABLED=true`; backend arriba; dev build de Android
    instalado con `EXPO_PUBLIC_API_URL` apuntando a la IP LAN
    (`docs/verification.md` §Feature 52/54 para regenerar el build). Un
    usuario con **dos mascotas** (A y B) sin collar.·
    ```bash
    cd backend-pet-tracker
    pnpm run seed:devices            # SIM-001..003 / ACT-001..003, suscripción grandfathered activa
    ```·
    1. **Código inválido**: Home → collar card `Pair a collar` (o Perfil →
       `Configuración del Dispositivo GPS`) → mascota A → `ACT-999` → `Pair
       collar` → mensaje `Invalid activation code…`; el botón vuelve a estar
       habilitado.
    2. **Éxito**: `ACT-001` → vista `Tracker is ready` con `Model sim-collar`
       y `ESN SIM-001` → `View on map` → el tab Map muestra posiciones del
       simulador en ≤ 2 min de cron.
    3. **Ya reclamado**: mascota B → `ACT-001` → `This collar is already paired
       to another pet.`
    4. **Tracked**: volver a `/pairing` con A → vista `GPS device` con pill
       `GPS tracking active`.
    5. **Free**: en otra terminal
       `pnpm run subscription:set -- --unit-id 900001 --status canceled`
       → salir y volver a `/pairing` (refetch en foco) → bloque `Free plan —
       health only…`; el tab Map muestra `Live tracking requires a collar`.
       Reactivar: `pnpm run subscription:set -- --unit-id 900001 --status active`
       → pill `GPS tracking active` y posiciones de nuevo **sin re-claim**
       (R5/R6 de #25).
    6. **Sin plan al reclamar (402)**:
       `pnpm run subscription:set -- --unit-id 900003 --status canceled` →
       mascota B → `ACT-003` → `This collar has no active plan…`.
    7. **Unpair**: mascota A → `Unpair collar` → diálogo nativo → `Cancel` no
       hace nada; `Unpair` → vuelve al formulario; Home muestra `Free`; nuevo
       claim de `ACT-001` en B → `Tracker is ready` (el collar quedó
       `available`).
    8. **Solo owner** (opcional si hay segunda cuenta con rol `family` sobre A):
       claim → `Only the owner can pair a collar.`·
    Collar real (opcional): con `WIALON_TOKEN` real y `SIM_MODE=false`,
    `pnpm run provision:device -- --unit-id <wialon_unit_id>` imprime el
    `activation_code`; repetir el paso 2 con él. Registrar solo resultados y
    status en `progress/impl_mobile-device-pairing.md`.·
    ### Feature 44 — auth-forgot-password·
    Usa una cuenta local ya registrada y verificada cuyo password anterior
    conozcas. Levanta Postgres y LocalStack, y arranca el backend guardando su
    salida para poder recuperar el token del log estructurado:·
    ```bash
    docker compose up -d
    pnpm -C backend-pet-tracker run start:dev 2>&1 | tee /tmp/pet-tracker-auth-forgot.log
    ```·
    En otra terminal, solicita el reset. La respuesta debe ser siempre
    `{\"requested\":true}` y no debe contener el token:·
    ```bash
    export API_BASE='http://localhost:3000/v1'
    export EMAIL='usuario-verificado@example.com'
    export OLD_PASSWORD='<password-anterior>'
    export NEW_PASSWORD='<password-nuevo-de-8-a-128-caracteres>'·
    curl --fail --silent --show-error \\
      -H 'Content-Type: application/json' \\
      -d \"{\\\"email\\\":\\\"$EMAIL\\\"}\" \\
      \"$API_BASE/auth/forgot-password\"
    ```·
    Localiza el último evento del email solicitado y copia únicamente el campo
    `token` de su JSON a `RESET_TOKEN`. El evento esperado es
    `auth.password_reset.issued`; el token aparece en claro solo en este log local
    y la base de datos guarda su SHA-256:·
    ```bash
    rg 'auth\\.password_reset\\.issued' /tmp/pet-tracker-auth-forgot.log | tail -1
    export RESET_TOKEN='<token-del-evento>'
    ```·
    Consume el token y comprueba el round-trip de login. El reset debe devolver
    `{\"reset\":true}`, el password anterior debe dar `401` y el nuevo `200`:·
    ```bash
    curl --fail --silent --show-error \\
      -H 'Content-Type: application/json' \\
      -d \"{\\\"token\\\":\\\"$RESET_TOKEN\\\",\\\"password\\\":\\\"$NEW_PASSWORD\\\",\\\"passwordConfirmation\\\":\\\"$NEW_PASSWORD\\\"}\" \\
      \"$API_BASE/auth/reset-password\"·
    curl --silent --output /tmp/login-old.json --write-out '%{http_code}\\n' \\
      -H 'Content-Type: application/json' \\
      -d \"{\\\"email\\\":\\\"$EMAIL\\\",\\\"password\\\":\\\"$OLD_PASSWORD\\\"}\" \\
      \"$API_BASE/auth/login\"·
    curl --silent --output /tmp/login-new.json --write-out '%{http_code}\\n' \\
      -H 'Content-Type: application/json' \\
      -d \"{\\\"email\\\":\\\"$EMAIL\\\",\\\"password\\\":\\\"$NEW_PASSWORD\\\"}\" \\
      \"$API_BASE/auth/login\"·
    rm -f /tmp/login-old.json /tmp/login-new.json /tmp/pet-tracker-auth-forgot.log
    unset API_BASE EMAIL OLD_PASSWORD NEW_PASSWORD RESET_TOKEN
    ```·
    ### Feature 51 — media-bucket-aws-mode·
    Este smoke crea tráfico S3 y un objeto temporal en la cuenta AWS real. Solo lo
    ejecuta el humano. Antes de empezar, usa una sesión válida de `aws login` y
    comenta en el `.env` raíz las tres variables de LocalStack:
    `AWS_ENDPOINT_URL`, `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY`. Si alguna
    sigue activa, las guardas abortan antes de llamar a AWS.·
    Obtén y revisa el nombre del bucket desplegado por `PetTrackerDev`:·
    ```bash
    aws s3 ls | grep pet-tracker-media
    export MEDIA_BUCKET_NAME=\"pet-tracker-media-dev-<accountId>\"
    test \"$MEDIA_BUCKET_NAME\" != \"pet-tracker-media-local\"
    ```·
    Sustituye `<accountId>` por el valor de la salida; no copies literalmente el
    placeholder. El nombre debe empezar por `pet-tracker-media-dev-` y nunca por
    `pet-tracker-media-local`.·
    #### 1. Round-trip gated a nivel adapter·
    Desde la raíz del repositorio:·
    ```bash
    AWS_MODE=aws MEDIA_BUCKET_NAME=\"$MEDIA_BUCKET_NAME\" \\
      pnpm -C backend-pet-tracker run test:e2e -- \\
      --runInBand test/aws-real-media.e2e-spec.ts
    ```·
    Resultado esperado: una suite con dos tests verdes y **cero `skipped`**. La
    suite construye `PhotoStorageS3Adapter` con la configuración real, firma un
    PUT, sube bytes, firma un GET, compara los bytes y borra el objeto
    `smoke/<timestamp>-<uuid>.bin` con `DeleteObject` al cerrar. Si aparece
    `skipped`, `AWS_MODE=aws` no llegó al proceso. No aceptes un verde omitido.·
    #### 2. Flujo HTTP de la aplicación·
    Usa un owner y una mascota existentes en el Postgres local. Arranca el backend
    en modo AWS con los workers desactivados para no generar tráfico ajeno al
    smoke:·
    ```bash
    AWS_MODE=aws MEDIA_BUCKET_NAME=\"$MEDIA_BUCKET_NAME\" \\
    POLLER_ENABLED=false ACTIVITY_AGGREGATOR_ENABLED=false \\
    ALERTS_ENGINE_ENABLED=false NOTIFIER_ENABLED=false REMINDERS_ENABLED=false \\
      pnpm -C backend-pet-tracker run start
    ```·
    En otra terminal, define los datos de prueba y obtiene el token. `PHOTO_FILE`
    debe apuntar a una imagen JPEG pequeña y `PET_ID` a una mascota cuyo owner sea
    el usuario del login:·
    ```bash
    API_BASE=http://localhost:3000/v1
    LOGIN_EMAIL='owner@example.com'
    LOGIN_PASSWORD='<password>'
    PET_ID='<pet-uuid>'
    PHOTO_FILE='/ruta/a/smoke.jpg'·
    LOGIN_BODY=\"$(jq -n \\
      --arg email \"$LOGIN_EMAIL\" \\
      --arg password \"$LOGIN_PASSWORD\" \\
      '{email: $email, password: $password}')\"·
    AUTH_TOKEN=\"$(curl --fail --silent --show-error \\
      -H 'Content-Type: application/json' \\
      -d \"$LOGIN_BODY\" \\
      \"$API_BASE/auth/login\" | jq -er '.access_token')\"·
    UPLOAD_URL=\"$(curl --fail --silent --show-error \\
      -X POST \\
      -H \"Authorization: Bearer $AUTH_TOKEN\" \\
      -H 'Content-Type: application/json' \\
      -d '{\"contentType\":\"image/jpeg\"}' \\
      \"$API_BASE/pets/$PET_ID/photo-upload-url\" | jq -er '.uploadUrl')\"·
    curl --fail --silent --show-error \\
      -X PUT -H 'Content-Type: image/jpeg' \\
      --data-binary \"@$PHOTO_FILE\" \"$UPLOAD_URL\"·
    PHOTO_URL=\"$(curl --fail --silent --show-error \\
      -H \"Authorization: Bearer $AUTH_TOKEN\" \\
      \"$API_BASE/pets/$PET_ID\" | jq -er '.photoUrl')\"·
    DOWNLOADED_FILE=\"$(mktemp)\"
    curl --fail --silent --show-error \"$PHOTO_URL\" --output \"$DOWNLOADED_FILE\"
    cmp \"$PHOTO_FILE\" \"$DOWNLOADED_FILE\"
    rm \"$DOWNLOADED_FILE\"
    ```·
    El `cmp` debe salir sin diferencias. Al terminar, detén el backend, vuelve a
    `AWS_MODE=local`, restaura las tres variables de LocalStack en `.env`, elimina
    la variable exportada con `unset MEDIA_BUCKET_NAME` y registra el resultado
    en `progress/impl_media-bucket-aws-mode.md`. Solo el humano marca la casilla
    R5 en `specs/media-bucket-aws-mode/requirements.md`; hasta entonces la feature
    permanece `in_progress`.·
    ### Feature 52 — android-maps-api-key·
    Este procedimiento prepara una clave restringida de Maps SDK for Android y
    regenera el dev build que la incorpora. La clave real nunca se pega en el
    repositorio ni en los reportes de progreso.·
    Desde #54, `app.config.ts` transporta la clave mediante
    `android.config.googleMaps.apiKey`. El prebuild sigue generando la misma
    meta-data `com.google.android.geo.API_KEY`, por lo que su `grep` y el resto de
    este runbook no cambian.·
    1. Haz un prebuild inicial sin clave para generar `android/` y
       `android/app/debug.keystore`. La config avisa por consola, pero no aborta:·
       ```bash
       cd mobile-pet-tracker && bunx expo prebuild --clean --platform android
       ```·
    2. Obtén la SHA-1 del keystore de debug desde el proyecto Android generado:·
       ```bash
       cd mobile-pet-tracker/android && ./gradlew signingReport
       ```·
       En Windows usa `gradlew.bat signingReport`. Como alternativa, desde
       `mobile-pet-tracker/android` ejecuta:·
       ```bash
       keytool -J-Duser.language=en -list -v -keystore app/debug.keystore -alias androiddebugkey -storepass android -keypass android
       ```·
       El flag `-J-Duser.language=en` es obligatorio: con locale español,
       `keytool` puede terminar con `MissingFormatArgumentException`.·
    3. En Google Cloud, con billing activo, habilita **Maps SDK for Android** y
       crea una clave de API. Restringe la aplicación Android al package
       `com.trackermex.pettracker` más la SHA-1 del paso 2, y restringe la clave
       por API para permitir únicamente Maps SDK for Android.·
    4. Inyecta la clave localmente sin commitearla. Desde
       `mobile-pet-tracker/`, si todavía no existe `.env`, ejecuta:·
       ```bash
       cp .env.example .env
       ```·
       Después edita ese archivo y define
       `GOOGLE_MAPS_API_KEY_ANDROID=<clave>`.·
    5. Regenera e instala el dev build. Este paso es obligatorio después de crear
       o rotar la clave, porque la meta-data se escribe en `AndroidManifest.xml`
       durante el prebuild:·
       ```bash
       bunx expo prebuild --clean --platform android
       grep -c \"com.google.android.geo.API_KEY\" android/app/src/main/AndroidManifest.xml
       bunx expo run:android
       ```·
       El `grep` debe imprimir `1`; no pegues el valor del manifest en ningún
       reporte. Si después de `--clean` el `signingReport` devuelve otra SHA-1,
       actualiza la restricción de la clave en Google Cloud antes de reintentar.·
    6. Ejecuta el smoke R6 de
       `specs/android-maps-api-key/requirements.md`: con el backend local arriba,
       inicia sesión y abre el tab **Map**; confirma que monta sin crash y que la
       vista nativa del mapa existe — el watermark \"Google\" es visible. Revisa
       `adb logcat`: no deben aparecer `IllegalStateException: API key not found`,
       `addViewAt: failed to insert view`, `Authorization failure` ni
       `API_KEY_ANDROID_APP_BLOCKED`; si salen los dos últimos, repite los pasos
       2–3 porque no coinciden package y SHA-1. Después ejecuta el smoke R9 de
       `specs/pet-lost-mode/requirements.md`. Registra el resultado, sin la clave,
       en `progress/impl_android-maps-api-key.md`.·
       Que el mapa pinte tiles, marker y polyline **no** forma parte de R6 desde
       la acotación del 2026-08-28. El discriminador de #54 confirmó que
       `onMapReady` sí dispara y aisló un defecto independiente de composición
       de la superficie nativa bajo Fabric, rastreado en
       `android-map-never-ready`.·
    Para un futuro EAS Build, crea la variable por separado:·
    ```bash
    eas env:create --name GOOGLE_MAPS_API_KEY_ANDROID --visibility secret --environment development
    ```·
    Además exige añadir `\"environment\": \"development\"` al perfil `development`
    de `eas.json`. Este plumbing de EAS queda **documentado, no implementado ni
    verificado** en esta feature.·
    ### Feature 54 — android-map-never-ready·
    Este smoke es el gate humano R8. Requiere un dispositivo Android real, el
    backend local arriba y `mobile-pet-tracker/.env` con
    `GOOGLE_MAPS_API_KEY_ANDROID` y `EXPO_PUBLIC_API_URL` apuntando a la IP LAN.
    Regenera e instala el dev build porque `expo-maps` no está disponible en Expo
    Go:·
    ```bash
    cd mobile-pet-tracker
    bunx expo prebuild --clean --platform android
    grep -c \"com.google.android.geo.API_KEY\" android/app/src/main/AndroidManifest.xml
    bunx expo run:android
    ```·
    El `grep` debe imprimir `1`; no copies el valor del manifest a ningún
    reporte.·
    Si ya tienes el dev build de esta branch instalado y solo revalidas el fix del
    ancestro opaco (fix 1, commits `74f50f7`–`4468da9`), sáltate el bloque anterior:
    ese cambio es solo JS y basta `bunx expo start --dev-client` con Fast Refresh.
    El `prebuild` completo solo hace falta si cambian dependencias nativas o la
    clave de Maps.·
    Después verifica y registra, sin incluir la clave:·
    1. Inicia sesión y abre el tab **Map** con una mascota premium que tenga
       última posición y al menos un viaje del día.
    2. En **tema claro**, confirma por separado:
       - **tiles**: se ven calles y etiquetas, no solo el watermark \"Google\";
       - **marker**: se ve el pin de la última posición;
       - **polyline**: se ve la traza del día.
    3. Desde **Profile**, cambia a **tema oscuro**, vuelve a Map y confirma que el
       mapa se ve oscuro y que siguen visibles tiles, marker y polyline.
    4. Comprueba en `adb logcat` que no haya `Authorization failure`,
       `API_KEY_ANDROID_APP_BLOCKED` ni excepciones de `expo-maps`.
    5. Confirma que la tarjeta de stats y el botón **Lost Mode** siguen
       funcionando encima del mapa.·
    \"Monta sin crash y hay watermark\" **no cierra R8**: ese es el estado
    defectuoso. Se necesita confirmación explícita de tiles, marker y polyline en
    ambos temas. Si el encuadre necesita ajuste, cambia solo `MAP_ZOOM` (R2).
    Registra el resultado humano en `progress/impl_android-map-never-ready.md`;
    ninguna suite Jest ni este implementer pueden cerrar R8.·
    ### Feature 55 — mobile-map-zoom-controls·
    Este smoke es el gate humano R3. Requiere el dev build de Android de #54 ya
    instalado, el backend local arriba y una mascota premium con última posición y
    al menos un viaje del día. El cambio es solo JS: no ejecutes `prebuild` ni
    `run:android`; basta Fast Refresh sobre el dev build existente:·
    ```bash
    cd mobile-pet-tracker
    bunx expo start --dev-client
    ```·
    Abre el tab **Map** y confirma por separado:·
    1. La esquina inferior derecha no muestra los controles nativos `+` / `−`.
    2. El pinch con dos dedos acerca el mapa y el pinch inverso lo aleja.
    3. Siguen visibles tiles, marker y polyline; la tarjeta `map-stats` y el botón
       **Lost Mode** siguen funcionando encima del mapa.·
    Registra el resultado en `progress/impl_mobile-map-zoom-controls.md` y marca
    la casilla R3 en la spec. La suite Jest de `PetMap` usa una vista mockeada:
    solo prueba que `uiSettings` llega a `GoogleMaps.View`; no prueba que los
    botones desaparezcan ni que el gesto funcione en el dispositivo.·
    ### Feature 57 — localstack-presigned-url-lan-host·
    Este smoke es el gate humano R6. Requiere LocalStack y el backend local
    arriba, un dispositivo Android físico en la misma LAN y el dev build con
    `EXPO_PUBLIC_API_URL` apuntando a la IP LAN de la máquina de desarrollo.·
    En el `.env` raíz define el endpoint con esa misma IP y reinicia el backend
    para que `ConfigService` vuelva a leerlo:·
    ```bash
    AWS_PRESIGN_ENDPOINT_URL=http://<IP LAN>:4566
    docker compose up -d localstack
    pnpm -C backend-pet-tracker run start:dev
    ```·
    Sustituye `<IP LAN>` por el valor real; no copies literalmente el placeholder.
    Después confirma y registra **por separado** estos cuatro resultados:·
    1. Pide una URL de foto mediante la API (un `uploadUrl` o el `photoUrl` del
       perfil) y comprueba que su host es `<IP LAN>:4566`, nunca `localhost:4566`.
    2. Con una URL GET prefirmada vigente, desde la máquina de desarrollo ejecuta:·
       ```bash
       curl -fsS \"<url firmada>\" -o /dev/null
       ```·
       Debe salir con exit 0: LocalStack responde en la interfaz LAN y la firma
       sigue siendo válida con ese header `Host`.
    3. En el dispositivo físico, sube una foto de mascota desde la app y confirma
       que se muestra después. Este paso prueba por separado la URL PUT y la GET.
    4. Limpia logcat antes del flujo y revisa después que ExpoImage no intentó
       conectar con el loopback del teléfono:·
       ```bash
       adb logcat -c
       # Repetir en la app la subida y carga de la foto.
       adb logcat -d | rg 'ConnectException.*(localhost|127\\.0\\.0\\.1):4566'
       ```·
       El último `rg` debe salir sin coincidencias (exit 1 esperado).·
    Si la firma lleva el host LAN pero `curl` o el teléfono no conectan, confirma
    que `docker-compose.yml` publica `4566:4566` — Docker lo expone en `0.0.0.0` —
    y que el firewall de Windows permite entrada TCP al puerto 4566, igual que ya
    debe permitirla al 3000 de la API. Al cambiar de red puede cambiar la IP LAN:
    actualiza tanto `AWS_PRESIGN_ENDPOINT_URL` en el `.env` raíz como
    `EXPO_PUBLIC_API_URL` en `mobile-pet-tracker/.env`, y reinicia backend y Metro.
    Para un emulador Android se puede usar `http://10.0.2.2:4566`; eso no sustituye
    el smoke obligatorio en dispositivo físico.·
    Registra el resultado en
    `progress/impl_localstack-presigned-url-lan-host.md` y solo entonces marca la
    casilla R6 en la spec. R4 verde prueba la firma en memoria, pero no cierra este
    gate de red/dispositivo.·
    ### Feature 58 — auth-email-delivery·
    Esta verificación modifica servicios externos, DNS de producción y envía
    correo real. La ejecuta exclusivamente una persona; el implementer y el
    reviewer automático no crean cuentas, claves ni registros. Usa valores propios
    en los placeholders y no copies claves, dominios privados ni tokens al
    repositorio o al reporte.·
    1. **G1 — verificar un subdominio dedicado en Resend.**·
       - Crea la cuenta de Resend y añade como dominio un subdominio dedicado
         elegido por el humano, nunca el dominio raíz.
       - Copia literalmente desde Resend al panel DNS de Hostinger los tres
         registros mostrados: MX y TXT SPF bajo `send.<subdominio>`, y TXT DKIM
         bajo `resend._domainkey.<subdominio>`.
       - No crees, borres ni edites el MX ni el TXT `v=spf1` de la raíz.
       - Espera hasta que Resend marque el subdominio como verificado y registra
         solo el resultado, sin copiar valores DKIM al reporte.·
    2. **G2 — guardar la API key solo en el entorno.**·
       - Crea en Resend una clave con el alcance mínimo necesario para enviar.
       - En el `.env` gitignoreado de la raíz configura
         `EMAIL_ENABLED=true`, `RESEND_API_KEY=<clave creada en Resend>` y
         `RESEND_FROM=\"Pet Tracker <no-reply@<subdominio>>\"`.
       - No pongas el valor real en `.env.example`, documentación, terminal
         compartida ni commits. `git status --short -- .env` no debe mostrar el
         fichero.·
    3. **G3 — completar los dos envíos reales de extremo a extremo.**·
       - Levanta la infraestructura y el backend con
         `docker compose up -d` y
         `pnpm -C backend-pet-tracker run start:dev`.
       - Con una dirección propia ya registrada, ejecuta
         `POST /v1/auth/forgot-password`; debe responder exactamente
         `200 {\"requested\":true}`. Confirma que el correo llega a inbox, no a
         spam, y usa su token una sola vez en
         `POST /v1/auth/reset-password` hasta obtener
         `200 {\"reset\":true}`.
       - Registra otra dirección propia mediante `POST /v1/auth/register`.
         Confirma que el correo de verificación llega a inbox y usa su token una
         sola vez en `POST /v1/auth/verify-email` hasta obtener
         `200 {\"verified\":true}`.
       - No copies direcciones, tokens ni cuerpos de correo al reporte; anota solo
         status HTTP, recepción en inbox y resultado del consumo.·
    4. **G4 — comprobar que el buzón de Hostinger sigue vivo.**·
       - Después del cambio DNS, envía un correo desde el buzón humano existente
         de Hostinger a otra cuenta controlada y confirma su recepción.
       - Responde desde esa segunda cuenta y confirma que el buzón de Hostinger
         recibe la respuesta. Este round-trip demuestra que G1 no degradó el
         correo de la raíz.·
    El humano registra G1, G2, G3-reset, G3-verificación y G4 como confirmados, con
    fecha, en `progress/impl_auth-email-delivery.md`, sin secretos ni tokens. El
    reviewer no aprueba la feature mientras cualquiera de ellos siga pendiente.·
    ### Feature 59 — auth-reset-deep-link·
    Estos cuatro gates los ejecuta una persona, en orden. Requieren el dev build
    de Android; Expo Go no puede validar App Links. Sustituye los placeholders
    solo en los entornos indicados y nunca copies el dominio real, fingerprints,
    direcciones de correo, contraseñas ni tokens al reporte.·
    1. **G1 — obtener y publicar el fingerprint SHA-256 del dev build.**·
       El dev build local (`bunx expo run:android`) se firma con el keystore que
       genera el prebuild en `mobile-pet-tracker/android/app/debug.keystore`, no
       con `~/.android/debug.keystore` de Android Studio. Desde
       `mobile-pet-tracker/android` ejecuta:·
       ```bash
       keytool -list -v -J-Duser.language=en -keystore app/debug.keystore -alias androiddebugkey -storepass android -keypass android
       ```·
       En Windows usa `app\\debug.keystore` (PowerShell y cmd no expanden `~`
       para programas externos). El flag `-J-Duser.language=en` evita el
       `MissingFormatArgumentException` con locale español. Alternativa:
       `gradlew signingReport` (`gradlew.bat` en Windows) y lee la variante
       `debug`.·
       Copia el valor `SHA256` completo, no el `SHA1`, y sustituye
       `REPLACE_WITH_DEV_BUILD_SHA256` en
       `hosting/.well-known/assetlinks.json`. Debe conservar los 32 pares
       hexadecimales separados por `:` y el fichero debe seguir conteniendo un
       único statement para `com.trackermex.pettracker`.·
    2. **G2 — subir los artefactos estáticos a Hostinger.**·
       Sube el contenido de `hosting/` tal cual a `public_html/`, incluida la
       carpeta oculta `.well-known`. Con el host real sustituido localmente en los
       comandos, confirma:·
       ```bash
       curl -fsSI https://<RESET_LINK_HOST>/.well-known/assetlinks.json
       curl -fsS 'https://<RESET_LINK_HOST>/reset-password?token=TEST_ONLY'
       ```·
       La primera ruta debe responder 200 con `Content-Type: application/json` y
       la segunda debe servir la página fallback. Su carga no debe efectuar
       ninguna petición adicional ni consumir el token de prueba.·
    3. **G3 — configurar el mismo host en backend y móvil.**·
       Define `RESET_LINK_HOST=<host real>` tanto en el `.env` gitignoreado de la
       raíz como en `mobile-pet-tracker/.env`. Usa solo el host pelado: sin
       `https://`, path ni slash final. Reinicia el backend para recargar
       `ConfigService` y regenera el dev build de Android para que el intent
       filter quede escrito en la aplicación. Ninguno de los dos `.env` se
       commitea.·
    4. **G4 — smoke completo y de un solo uso.**·
       - Con el backend levantado y una cuenta propia, ejecuta un
         `POST /v1/auth/forgot-password`; debe responder 200 y el correo debe
         llegar con el enlace HTTPS.
       - Abre el enlace dos veces antes de enviar el formulario. Las dos aperturas
         deben entrar en `/reset-password` del dev build con el token intacto; no
         debe existir petición de reset durante el montaje.
       - Completa el formulario una vez y confirma el 200. Reabre el mismo enlace
         e intenta repetirlo: el segundo `POST /v1/auth/reset-password` debe
         responder 400.
       - Confirma que el login con la contraseña anterior responde 401 y con la
         nueva responde 200.
       - En un dispositivo o perfil sin la app instalada, abre el enlace y
         confirma que aparece la página fallback de Hostinger.·
    Registra únicamente los resultados y status en
    `progress/impl_auth-reset-deep-link.md`. G1–G4 siguen pendientes hasta esa
    confirmación humana; las suites automáticas no los sustituyen.·
    ### Feature 79 — mobile-push-registration: `google-services.json` del dev build·
    El registro del push token falla en un dev build **local** si Firebase no está
    inicializado en el APK. El síntoma exacto, con el diagnóstico de R13 puesto:·
    ```
    [push] registration failed [Error: Unable to get Firebase Messaging instance.
    Did you configure `googleServicesFile` path in app config? …
    Default FirebaseApp is not initialized in this process com.trackermex.pettracker]
    ```·
    **Por qué pasa aunque las credenciales FCM V1 estén subidas a EAS**: esas
    credenciales las inyecta **EAS Build**. Un dev build compilado en la máquina del
    humano con `bunx expo run:android` no pasa por EAS, así que necesita el fichero
    de configuración de Firebase en el proyecto.·
    **Cómo obtenerlo** (una vez por máquina):·
    1. Consola de Firebase → el proyecto ligado a la credencial FCM V1 de esta app.
    2. Configuración del proyecto → tus apps → la app de Android con
       `applicationId` **`com.trackermex.pettracker`**. Si no existe, añadirla con ese
       mismo id.
    3. Descargar `google-services.json` y dejarlo en `mobile-pet-tracker/`.·
    **El fichero NO se versiona**: está en `mobile-pet-tracker/.gitignore` porque
    identifica el proyecto de Firebase del humano. Cada máquina que compile un dev
    build de Android lo descarga por su cuenta.·
    **Después de colocarlo**, el build nativo hay que rehacerlo — la configuración
    entra en el `AndroidManifest.xml` durante el prebuild:·
    ```bash
    cd mobile-pet-tracker
    bunx expo prebuild --clean --platform android
    bunx expo run:android
    ```·
    Si el fichero falta, `app.config.ts` **no** declara `googleServicesFile` y avisa
    por consola remitiendo a esta sección (R14). Eso es deliberado: sin el aviso, el
    build salía adelante y el fallo aparecía mucho más tarde, en forma de un push que
    nunca llega.·
    #### Disparar la notificación a mano desde Windows (añadido en #114, 2026-09-23)·
    La ruta alternativa determinista de la prueba de humo de #79 (`aws sqs
    send-message` contra la cola `notifications`) falla de dos formas en la máquina
    del humano:·
    - **Pide `aws login`.** El comando apunta a LocalStack, que no necesita la
      cuenta real, pero la CLI exige credenciales de todos modos. Se usan las
      mismas de relleno que `.env.example` (`test`/`test`, `us-east-1`). **No inicies
      sesión en la cuenta real** para esto.
    - **PowerShell rompe las comillas** del JSON al pasarlo a `aws`. El cuerpo va en
      un fichero y se pasa con `file://`.·
    ```powershell
    $env:AWS_ACCESS_KEY_ID = \"test\"
    $env:AWS_SECRET_ACCESS_KEY = \"test\"
    $env:AWS_DEFAULT_REGION = \"us-east-1\"
    $pet = \"<petId>\"   # una mascota de tu cuenta: pets ⋈ pet_users ⋈ users por email
    $q = aws --endpoint-url http://localhost:4566 sqs get-queue-url --queue-name notifications --query QueueUrl --output text
    $id = [guid]::NewGuid().ToString()   # cualquier UUID: el notifier resuelve por petId
    @{ version = 1; kind = \"alert\"; alertId = $id; petId = $pet; title = \"Smoke\"; body = \"Prueba de toque\"; data = @{ petId = $pet; alertId = $id } } |
      ConvertTo-Json -Compress | Set-Content -Encoding ascii msg.json
    aws --endpoint-url http://localhost:4566 sqs send-message --queue-url $q --message-body file://msg.json
    ```·
    Antes de disparar nada, comprueba que el dev build de **esa** máquina tiene
    `google-services.json` (la sección de arriba). Sin él, el registro avisa con
    `[push] registration failed` y no llega ningún push. En #114 la spec daba por
    hecho que no hacía falta regenerar el dev build, y en esa máquina no era cierto.·
    ### Push en un build de producción — lo que habrá que resolver (nota, 2026-09-18)·
    Nada de esto aplica todavía: no hay build de producción. Se anota aquí al
    descubrirse durante el gate de #79, para no volver a deducirlo.·
    1. **El `google-services.json` no está en el repo** (`.gitignore`), así que un
       build de EAS no lo encuentra solo. Hay que subirlo como *file secret*
       (`eas secret:create --type file`) y referenciarlo en el perfil de build. Si
       falta, el APK de producción falla **igual que en local pero en silencio**: el
       aviso de R13 está guardado por `__DEV__`.
    2. **Credenciales FCM V1 por perfil.** La clave de service account se subió para
       el perfil `development`; verificar con `eas credentials` que el perfil de
       producción también la tiene.
    3. **El fichero está atado al `applicationId`.** Si producción usa un id distinto
       de `com.trackermex.pettracker`, hace falta una **segunda app** en el proyecto
       de Firebase y su propio `google-services.json`.
    4. **Un registro fallido es invisible para el usuario y para nosotros.** No da
       error: simplemente no llega ningún push. La señal explotable está en el
       backend — un usuario sin fila en `push_tokens` es un registro que falló. Vale
       una feature de observabilidad antes del lanzamiento.
    5. **El backend de producción necesita `PUSH_ENABLED=true` y la cola
       `notifications` creada en la cuenta AWS real**, no solo en LocalStack.
    6. **iOS no usa FCM**: va por APNs con su propia clave, y entra por #60
       `mobile-ios-support`.·
    ### Feature 96 — harness-e2e-nunca-corre-en-ci·
    `./init.sh` ya requiere Postgres y LocalStack levantados con
    `docker compose up -d`; si alguna URL de infraestructura del `.env` no
    responde, termina con error antes de los E2E. En CI, el workflow levanta el
    Compose versionado y espera sus healthchecks antes de ejecutar el harness.·
    Las tres suites `aws-real-*` se saltan por diseño con `AWS_MODE=local`: el
    verde correcto ejecuta todas las suites menos esas tres. No congeles el
    recuento; comprueba en el commit evaluado que:·
    ```text
    suites ejecutadas = ficheros test/*.e2e-spec.ts - ficheros test/aws-real-*.e2e-spec.ts
    ```·
    El resultado debe ser distinto de cero. Nunca cambies CI a `AWS_MODE=aws` para
    forzar las suites reales.·
    **G1 — demostrar que un CI verde ejecuta los E2E (solo humano):**·
    1. Abre el PR de `feature/96-harness-e2e-nunca-corre-en-ci` contra `main` y
       espera al job `verify`.
    2. En el log confirma la sección `→ Tests e2e...` y la línea de resumen
       `Test Suites: …` de Jest.
    3. Recuenta los dos globs del commit y verifica la igualdad anterior: el
       número de suites ejecutadas debe ser distinto de cero.
    4. Confirma que el job termina verde y registra su URL en
       `progress/impl_harness-e2e-nunca-corre-en-ci.md`.·
    Si el rojo procede del flake móvil conocido de `add-pet` o `alerts`, relanza el
    job: ese fallo no demuestra nada sobre este gate.·
    **G2 — demostrar que un E2E rojo pone el PR en rojo (solo humano, después de
    G1):**·
    1. Crea la rama temporal `test/96-ci-red-probe` desde la rama de la feature.
    2. En `backend-pet-tracker/test/app.e2e-spec.ts`, cambia únicamente el
       `.expect(401)` del único test por `.expect(418)` y commitea con
       `test(ci): probe deliberado de rojo e2e (no mergear)`.
    3. Publica la rama y abre un PR en borrador contra `main`.
    4. Comprueba que el check queda rojo, que falla el paso
       `Harness verification (init.sh)` dentro de `→ Tests e2e...`, y que el log
       nombra `app.e2e-spec.ts` y `expected 418`.
    5. Cierra el PR sin mergear y borra la rama temporal local y remota.
    6. Registra en el reporte la URL de esta corrida roja, su línea de fallo y la
       URL verde de G1.·
    G1 y G2 son gates humanos: ninguna suite automática ni reviewer los cierra.·
    **Techo conocido del candado de `AWS_MODE` (enmienda E1).** El candado cuenta
    las claves YAML `AWS_MODE:` **a principio de línea** y prohíbe `AWS_MODE=` en
    cualquier `run:`. Eso cubre las formas que se escriben en la práctica, pero no
    un mapping de flujo:·
    ```yaml
    env: { AWS_MODE: aws }     # la suite sigue verde
    ```·
    Medido por el reviewer el 2026-09-15. No se cerró porque hacerlo exige parsear
    YAML de verdad, y el gasto está además cortado aguas abajo por el guard
    `runSmoke` de las tres suites `aws-real-*`. Si algún día se edita `ci.yml` con
    esa forma, el candado no lo va a parar: cerrarlo pide una enmienda nueva con su
    propia firma.·
    **Ruido esperado en el log, que no es un fallo de la guarda.** La corrida
    imprime varias líneas `ERROR [PollerService] ... connect ECONNREFUSED
    127.0.0.1:4566`. No son LocalStack caído: salen de un `mockRejectedValue(new
    Error('connect ECONNREFUSED 127.0.0.1:4566'))` en
    `backend-pet-tracker/src/workers/poller.service.spec.ts`, el test que comprueba
    que el ciclo del poller se salta sin tumbar el proceso cuando SQS falla. Ya
    aparecían antes de la feature 96. Si la guarda nueva fuese la que falla, la
    línea sería otra y la corrida no llegaría a los E2E:·
    ```
    Infra e2e caída: <host>:<puerto> no responde (derivado de <CLAVE> en .env).
    Levántala con: docker compose up -d
    ```·
    ### Feature 117 — mobile-forgot-password·
    Prueba de humo en el dev build de Android, firmada por el humano el
    2026-10-06 en `specs/mobile-forgot-password/requirements.md` §Prueba de humo
    (commit `ea802d9b`).·
    - Fecha: 2026-10-06.
    - Build: dev build de Android de `feature/117-mobile-forgot-password`. El
      humano no relató el commit del build; el código de `mobile-pet-tracker/` es
      el mismo desde el merge con #116 (`588a777a`) hasta la firma.
    - Ruta: A (correo real por Resend), relatada por el humano en el chat.
    - Resultado: S1-S9 OK, relatado por el humano («todos los pasos ok»): S1
      formulario, S2 envío, S3 enlace y reset con login 200, S4 reenvío, S5 429 a
      la cuarta petición, S6 correo inválido, S7 anti-enumeración, S8 sin red y
      S9 teclado.·
    ---·
    ### Feature 18 — nutrition-ai-explainer·
    Prueba de humo con clave real: la ejecuta exclusivamente un humano tras la revisión. R19 permanece pendiente hasta que marque su casilla en la spec.·
    ```
    0. Pre-vuelo (en el worktree y en la shell que arrancará el servidor):
       grep -cE '^NODE_ENV=' .env           -> 0   (con NODE_ENV=test el factory apaga la IA)
       env | grep -c '^ANTHROPIC_'          -> 0   (una variable exportada gana sobre .env)
       Mascota con collar vinculado y suscripcion vigente (isPetTracked true).
       Candidata local: Rex18, 01a0181f-5e2d-7cd2-beb9-b3761c405d39, collar SIM-002,
       si sigue en la BD local; si no, cualquier mascota con collar activo.
    1. En .env (nunca en .env.example): ANTHROPIC_ENABLED=true,
       ANTHROPIC_API_KEY=<clave real>, ANTHROPIC_MODEL=claude-haiku-5-5.
       Parar el servidor (Ctrl-C) y arrancarlo otra vez: `nest start --watch` NO
       vigila .env.
    2. API_BASE=http://localhost:3000/v1 y AUTH_TOKEN con el login de la seccion
       \"Feature 51 — media-bucket-aws-mode\" de este documento (LOGIN_BODY con jq -n,
       POST $API_BASE/auth/login | jq -er '.access_token').
       Cambiar kcalPer100g para forzar un hash nuevo: GET el perfil, PUT el mismo
       perfil con kcalPer100g distinto
         (jq '{activityLevel, bodyCondition, targetWeightKg, foodType, allergies,
               diseases, kcalPer100g: <nuevo>} | with_entries(select(.value != null))').
    3. POST $API_BASE/pets/<petId>/nutrition-plan/generate -> 200, kcal y gramos
       coherentes y aiExplanation = texto en español (no null). Anotar id y texto.
       GET $API_BASE/pets/<petId>/nutrition-plan -> mismo aiExplanation.
    4. Repetir el mismo POST generate sin tocar nada -> mismo id y mismo texto
       (hash hit: la IA NO se vuelve a llamar).
    5. En .env: ANTHROPIC_API_KEY=PENDING. Reiniciar el servidor. Cambiar
       kcalPer100g otra vez (sin esto el hash hit devuelve el texto anterior) y
       POST generate -> 200 con aiExplanation null; en la salida del servidor,
       un warn con \"ai explanation disabled\" y \"key-missing\".
    6. Dejar ANTHROPIC_API_KEY=PENDING y ANTHROPIC_ENABLED=false en .env y
       reiniciar el servidor, para que init.sh y el desarrollo no facturen.
    ```·
    Y esta tabla de diagnóstico, para cuando el paso 3 devuelva `null`:·
    | En la salida del servidor | Significa |
    |---|---|
    | `ai explanation disabled` + `node-env-test` | `NODE_ENV=test` en `.env` o en la shell |
    | `ai explanation disabled` + `not-enabled` / `key-missing` / `model-missing` | variable mal puesta o servidor sin reiniciar |
    | `ai explanation unusable` + `stopReason` / `usage` | respuesta sin texto útil (ver P4) |
    | `warn` con el mensaje de un error (401, 429, …) | clave o cuenta |
    | ningún `warn` de `nutrition-ai` | mascota sin entitlement (`isPetTracked` falso) |·
    IF la clave real falla con `401`/`429` persistente THEN el humano SHALL dejar
    `ANTHROPIC_ENABLED=false`, reportarlo y **no** bloquear el cierre por ese
    motivo (condición de STOP del plan 009).·
    **Coste estimado por llamada** (estimación, no factura: precios de Haiku 5.5
    según la skill `claude-api` a 2026-10-08, $0.10 por millón de tokens de
    entrada y $0.50 por millón de salida, para prompts de hasta 100 000 tokens):
    peor caso con las cotas de C-3, ≤ 1 500 tokens de entrada (≈ $0.00015) más
    ≤ 1 200 de salida (≈ $0.0006), es decir **≤ ~$0.00075 por llamada**; caso
    típico del orden de **$0.0003**. La prueba de humo completa hace **una**
    llamada facturada (paso 3).·
    ## Notas para el implementer·
    - No declares done solo porque el build pasa. Prueba los casos edge (errores,
      permisos, condiciones límite).
    - Los scripts de verificación manual (curl, CLI, etc.) no sustituyen a los
      tests automáticos exigidos por la disciplina TDD.
    - Si alguna verificación falla, documenta por qué en `progress/impl_<feature>.md`
      antes de reportar al leader.
    "
```

Cadena literal del handoff c3:
```text
grep -qE '^Tests: +3 failed, 96 passed, 99 total$' /tmp/159-r2-map.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r2-map.txt)" = 3 \
    && grep -qF 'Unable to find an element with testID: map-no-tracking-body' /tmp/159-r2-map.txt \
    && grep -qF 'Unable to find an element with testID: map-no-tracking-pose' /tmp/159-r2-map.txt \
    && grep -qE '^Tests: +2 failed, 77 passed, 79 total$' /tmp/159-r2-es.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r2-es.txt)" = 2 \
    && ! grep -qF 'Unable to find' /tmp/159-r2-es.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-r2-map.txt /tmp/159-r2-es.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/__tests__/empty-state.test.tsx src/screens/map/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/screens/map/index.test.tsx ' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'test(mobile-no-collar-states): #159 R2 red map no-tracking empty state'
[feature/159-mobile-no-collar-states-pingo 56918113] test(mobile-no-collar-states): #159 R2 red map no-tracking empty state
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 45 insertions(+), 2 deletions(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `56918113 test(mobile-no-collar-states): #159 R2 red map no-tracking empty state`.

Lectura anticipada de /tmp/159-r2-es.txt antes de que existiera: `No such file or directory`, sin cambios en esa lectura. Se repitió tras acabar la medición desde el cd literal de BASE; lectura correcta.

## c4

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts > /tmp/159-g2.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       232 passed, 232 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-g2-guardas.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
exit=0
```

Cadena literal del handoff c4:
```text
grep -qE '^Tests: +232 passed, 232 total$' /tmp/159-g2.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g2-guardas.txt \
    && test "$(grep -cF "t('map.trackingNeedsCollar')" src/screens/map/index.tsx)" = 0 \
    && test "$(grep -cF 'map.trackingNeedsCollar' src/i18n/catalog.ts)" = 0 \
    && test "$(grep -cF 'Live tracking requires a collar' ../docs/verification.md)" = 0 \
    && test "$(grep -cF 'el tab Map muestra a Pingo con `No live location`' ../docs/verification.md)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts src/components/__tests__/empty-state.test.tsx src/i18n/catalog.ts src/providers/__tests__/language-provider.test.tsx src/screens/map/index.tsx ../docs/verification.md ../specs/mobile-ui-language/design.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'docs/verification.md mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/screens/map/index.tsx specs/mobile-ui-language/design.md ' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'feat(mobile-no-collar-states): #159 R2 map no-tracking empty state'
[feature/159-mobile-no-collar-states-pingo 00755951] feat(mobile-no-collar-states): #159 R2 map no-tracking empty state
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 8 files changed, 14 insertions(+), 10 deletions(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `00755951 feat(mobile-no-collar-states): #159 R2 map no-tracking empty state`.

## c5

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-r3.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 99 passed, 101 total
exit=1
```

```text
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar al dueño de una mascota sin collar

    Unable to find an element with testID: map-no-tracking-action

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-map"[39m
      [36m>[39m
        [36m<View>[39m
          [36m<View[39m
            [33mtestID[39m=[32m"map-no-tracking"[39m
          [36m>[39m
            [36m<ViewManagerAdapter_ExpoImage[39m
              [33mplaceholder[39m=[32m{[]}[39m
              [33mtestID[39m=[32m"map-no-tracking-pose"[39m
            [36m/>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"map-no-tracking-title"[39m
            [36m>[39m
              [0mSin ubicación en vivo[0m
            [36m</Text>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"map-no-tracking-body"[39m
            [36m>[39m
              [0mCuando tu mascota tenga un collar con plan activo, te muestro dónde está.[0m
            [36m</Text>[39m
          [36m</View>[39m
        [36m</View>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m
```

```text
  ● #159 R3: el dueño sin collar puede ir a emparejar › lleva a emparejar una sola vez

    Unable to find an element with testID: map-no-tracking-action

    [36m<RNCSafeAreaProvider>[39m
      [36m<View[39m
        [33mtestID[39m=[32m"screen-map"[39m
      [36m>[39m
        [36m<View>[39m
          [36m<View[39m
            [33mtestID[39m=[32m"map-no-tracking"[39m
          [36m>[39m
            [36m<ViewManagerAdapter_ExpoImage[39m
              [33mplaceholder[39m=[32m{[]}[39m
              [33mtestID[39m=[32m"map-no-tracking-pose"[39m
            [36m/>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"map-no-tracking-title"[39m
            [36m>[39m
              [0mSin ubicación en vivo[0m
            [36m</Text>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"map-no-tracking-body"[39m
            [36m>[39m
              [0mCuando tu mascota tenga un collar con plan activo, te muestro dónde está.[0m
            [36m</Text>[39m
          [36m</View>[39m
        [36m</View>[39m
      [36m</View>[39m
    [36m</RNCSafeAreaProvider>[39m
```

Cadena literal del handoff c5:
```text
grep -qE '^Tests: +2 failed, 99 passed, 101 total$' /tmp/159-r3.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r3.txt)" = 2 \
    && grep -qF 'Unable to find an element with testID: map-no-tracking-action' /tmp/159-r3.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-r3.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/map/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/map/index.test.tsx' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'test(mobile-no-collar-states): #159 R3 red pair collar action'
[feature/159-mobile-no-collar-states-pingo f346baf3] test(mobile-no-collar-states): #159 R3 red pair collar action
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 22 insertions(+)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `f346baf3 test(mobile-no-collar-states): #159 R3 red pair collar action`.

## c6

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx src/__tests__/ui-language.test.ts > /tmp/159-g3.txt 2>&1; echo "exit=$?"
Test Suites: 2 passed, 2 total
Tests:       131 passed, 131 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-g3-guardas.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
exit=0
```

Cadena literal del handoff c6:
```text
grep -qE '^Tests: +131 passed, 131 total$' /tmp/159-g3.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g3-guardas.txt \
    && test "$(grep -cF "router.push('/pairing')" src/screens/map/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts src/screens/map/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/screens/map/index.tsx ' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'feat(mobile-no-collar-states): #159 R3 pair collar action on map'
[feature/159-mobile-no-collar-states-pingo 9b89f6c8] feat(mobile-no-collar-states): #159 R3 pair collar action on map
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 3 files changed, 3 insertions(+), 1 deletion(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `9b89f6c8 feat(mobile-no-collar-states): #159 R3 pair collar action on map`.

## c7

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-r4.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       8 failed, 101 passed, 109 total
exit=1
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a family

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)

    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a walker

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)

    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a vet

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)

    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón al dueño de una mascota con collar

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)

    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón si el detalle resuelve error

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)

    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón si el detalle resuelve unreachable

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)

    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón si el detalle resuelve missing-config

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)

    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón mientras el detalle carga

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)

    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

Cadena literal del handoff c7:
```text
grep -qE '^Tests: +8 failed, 101 passed, 109 total$' /tmp/159-r4.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r4.txt)" = 8 \
    && ! grep -qF 'Unable to find' /tmp/159-r4.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-r4.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/map/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/map/index.test.tsx' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'test(mobile-no-collar-states): #159 R4 red pair action only for owner without collar'
[feature/159-mobile-no-collar-states-pingo 9506bd88] test(mobile-no-collar-states): #159 R4 red pair action only for owner without collar
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 49 insertions(+)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `9506bd88 test(mobile-no-collar-states): #159 R4 red pair action only for owner without collar`.

## c8

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx src/__tests__/ui-language.test.ts > /tmp/159-g4.txt 2>&1; echo "exit=$?"
Test Suites: 2 passed, 2 total
Tests:       139 passed, 139 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-g4-guardas.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
exit=0
```

Cadena literal del handoff c8:
```text
grep -qE '^Tests: +139 passed, 139 total$' /tmp/159-g4.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g4-guardas.txt \
    && test "$(grep -cF 'const canPairCollar =' src/screens/map/index.tsx)" = 1 \
    && test "$(grep -cF 'detail.data.pet.device === null;' src/screens/map/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/map/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/map/index.tsx' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'feat(mobile-no-collar-states): #159 R4 gate pair action on detail'
[feature/159-mobile-no-collar-states-pingo f4f48736] feat(mobile-no-collar-states): #159 R4 gate pair action on detail
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 5 insertions(+), 1 deletion(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `f4f48736 feat(mobile-no-collar-states): #159 R4 gate pair action on detail`.

## Sonda S4a

HEAD: `f4f48736 feat(mobile-no-collar-states): #159 R4 gate pair action on detail`.

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-s4a.txt 2>&1; echo "exit=$?"
Tests:       1 failed, 108 passed, 109 total
exit=1

  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón al dueño de una mascota con collar
$ git checkout HEAD -- src/screens/map/index.tsx
$ git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
limpio=0
```

Todas las caídas son por aserción; sin errores de ejecución.

## Sonda S4b

HEAD: `f4f48736 feat(mobile-no-collar-states): #159 R4 gate pair action on detail`.

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-s4b.txt 2>&1; echo "exit=$?"
Tests:       3 failed, 106 passed, 109 total
exit=1

  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a family
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a walker
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a vet
$ git checkout HEAD -- src/screens/map/index.tsx
$ git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
limpio=0
```

Todas las caídas son por aserción; sin errores de ejecución.

## Sonda S4c

HEAD: `f4f48736 feat(mobile-no-collar-states): #159 R4 gate pair action on detail`.

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-s4c.txt 2>&1; echo "exit=$?"
Tests:       4 failed, 105 passed, 109 total
exit=1

  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón si el detalle resuelve error
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón si el detalle resuelve unreachable
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón si el detalle resuelve missing-config
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón mientras el detalle carga
$ git checkout HEAD -- src/screens/map/index.tsx
$ git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
limpio=0
```

Todas las caídas son por aserción; sin errores de ejecución.

## c9

```text
$ FORCE_COLOR=0 bunx jest src/screens/geofences/index.test.tsx > /tmp/159-r5.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       3 failed, 50 passed, 53 total
exit=1
```

```text
  ● #159 R5: Zonas seguras sin seguimiento presentan a Pingo › pinta la pose del collar, el título y la frase de Pingo, sin tarjeta

    expect(received).toBe(expected) // Object.is equality

    Expected: "items-center gap-3 py-8"
    Received: "rounded-card border border-border bg-surface p-4 shadow-sm items-center py-8"
```

```text
  ● #159 R5: Zonas seguras sin seguimiento presentan a Pingo › pinta el título y la frase en inglés

    Unable to find an element with testID: geofences-no-tracking-title

    [36m<RNCSafeAreaProvider>[39m
      [36m<RCTScrollView[39m
        [33mtestID[39m=[32m"screen-geofences"[39m
      [36m>[39m
        [36m<View>[39m
          [36m<View[39m
            [33mtestID[39m=[32m"geofences-no-tracking"[39m
          [36m>[39m
            [36m<Text>[39m
              [0mSafe zones require a collar[0m
            [36m</Text>[39m
          [36m</View>[39m
        [36m</View>[39m
      [36m</RCTScrollView>[39m
    [36m</RNCSafeAreaProvider>[39m
```

```text
  ● #159 R5: Zonas seguras sin seguimiento presentan a Pingo › queda en el sitio de la tarjeta que sustituye

    Unable to find an element with testID: geofences-no-tracking-pose

    [36m<RNCSafeAreaProvider>[39m
      [36m<RCTScrollView[39m
        [33mtestID[39m=[32m"screen-geofences"[39m
      [36m>[39m
        [36m<View>[39m
          [36m<View[39m
            [33mtestID[39m=[32m"geofences-no-tracking"[39m
          [36m>[39m
            [36m<Text>[39m
              [0mLas zonas seguras requieren un collar[0m
            [36m</Text>[39m
          [36m</View>[39m
        [36m</View>[39m
      [36m</RCTScrollView>[39m
    [36m</RNCSafeAreaProvider>[39m
```

Cadena literal del handoff c9:
```text
grep -qE '^Tests: +3 failed, 50 passed, 53 total$' /tmp/159-r5.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r5.txt)" = 3 \
    && grep -qF 'Unable to find an element with testID: geofences-no-tracking-title' /tmp/159-r5.txt \
    && grep -qF 'Unable to find an element with testID: geofences-no-tracking-pose' /tmp/159-r5.txt \
    && grep -qF 'items-center gap-3 py-8' /tmp/159-r5.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-r5.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/geofences/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/geofences/index.test.tsx' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'test(mobile-no-collar-states): #159 R5 red safe zones no-tracking empty state'
[feature/159-mobile-no-collar-states-pingo 14e76905] test(mobile-no-collar-states): #159 R5 red safe zones no-tracking empty state
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 34 insertions(+), 9 deletions(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `14e76905 test(mobile-no-collar-states): #159 R5 red safe zones no-tracking empty state`.

## c10

```text
$ FORCE_COLOR=0 bunx jest src/screens/geofences/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/ui-language.test.ts > /tmp/159-g5.txt 2>&1; echo "exit=$?"
Test Suites: 3 passed, 3 total
Tests:       162 passed, 162 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-g5-guardas.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
exit=0
```

Cadena literal del handoff c10:
```text
grep -qE '^Tests: +162 passed, 162 total$' /tmp/159-g5.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g5-guardas.txt \
    && test "$(grep -cF "t('geofences.needsCollar')" src/screens/geofences/index.tsx)" = 0 \
    && test "$(grep -cF "t('geofences.needsCollar')" src/screens/geofence-editor/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts src/components/__tests__/empty-state.test.tsx src/screens/geofences/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/screens/geofences/index.tsx ' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'feat(mobile-no-collar-states): #159 R5 safe zones no-tracking empty state'
[feature/159-mobile-no-collar-states-pingo 176d9d45] feat(mobile-no-collar-states): #159 R5 safe zones no-tracking empty state
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 4 files changed, 5 insertions(+), 6 deletions(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `176d9d45 feat(mobile-no-collar-states): #159 R5 safe zones no-tracking empty state`.

## c11

```text
$ FORCE_COLOR=0 bunx jest src/screens/geofences/index.test.tsx > /tmp/159-g6.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       58 passed, 58 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-g6-guardas.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
exit=0
```

Cadena literal del handoff c11:
```text
grep -qE '^Tests: +58 passed, 58 total$' /tmp/159-g6.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g6-guardas.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/geofences/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/geofences/index.test.tsx' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'test(mobile-no-collar-states): #159 R6 lock no pair action in safe zones'
[feature/159-mobile-no-collar-states-pingo cc53c018] test(mobile-no-collar-states): #159 R6 lock no pair action in safe zones
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 18 insertions(+)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `cc53c018 test(mobile-no-collar-states): #159 R6 lock no pair action in safe zones`.

## Sonda S6a

HEAD: `cc53c018 test(mobile-no-collar-states): #159 R6 lock no pair action in safe zones`.

```text
$ FORCE_COLOR=0 bunx jest src/screens/geofences/index.test.tsx > /tmp/159-s6a.txt 2>&1; echo "exit=$?"
Tests:       1 failed, 57 passed, 58 total
exit=1

  ● #159 R6: en Zonas seguras nadie ve el botón de emparejar › no ofrece acción a owner
$ git checkout HEAD -- src/screens/geofences/index.tsx
$ git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
limpio=0
```

Todas las caídas son por aserción; sin errores de ejecución.

## Sonda S6b

HEAD: `cc53c018 test(mobile-no-collar-states): #159 R6 lock no pair action in safe zones`.

```text
$ FORCE_COLOR=0 bunx jest src/screens/geofences/index.test.tsx > /tmp/159-s6b.txt 2>&1; echo "exit=$?"
Tests:       4 failed, 54 passed, 58 total
exit=1

  ● #159 R6: en Zonas seguras nadie ve el botón de emparejar › no ofrece acción a family
  ● #159 R6: en Zonas seguras nadie ve el botón de emparejar › no ofrece acción a walker
  ● #159 R6: en Zonas seguras nadie ve el botón de emparejar › no ofrece acción a vet
  ● #159 R6: en Zonas seguras nadie ve el botón de emparejar › no ofrece acción si el detalle falla
$ git checkout HEAD -- src/screens/geofences/index.tsx
$ git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
limpio=0
```

Todas las caídas son por aserción; sin errores de ejecución.

## c12

```text
$ FORCE_COLOR=0 bunx jest src/screens/geofence-editor/index.test.tsx > /tmp/159-r7-ed.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 66 passed, 68 total
exit=1
```

```text
  ● #146 R6: el editor pinta el formulario sobre el mapa y sus estados › pinta el 402 sin Reintentar

    expect(instance).toHaveTextContent()

    Expected instance to have text content:
      Las zonas seguras necesitan un collar con plan activo.
    Received:
      Las zonas seguras requieren un collar
```

```text
  ● #146 R8: Guardar crea o actualiza la zona y vuelve a la lista › pinta no-tracking bajo Guardar y conserva el borrador

    expect(instance).toHaveTextContent()

    Expected instance to have text content:
      Las zonas seguras necesitan un collar con plan activo.
    Received:
      Las zonas seguras requieren un collar
```

```text
$ FORCE_COLOR=0 bunx jest src/providers/__tests__/language-provider.test.tsx > /tmp/159-r7-lp.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 23 passed, 24 total
exit=1
```

```text
  ● #41 R1: el catálogo trae las once claves de zonas seguras › registra las once claves en los dos idiomas y en la tabla de la spec de idioma

    expect(received).toBe(expected) // Object.is equality

    Expected: "Safe zones need a collar with an active plan."
    Received: "Safe zones require a collar"
```

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-r7-es.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 80 passed, 81 total
exit=1
```

```text
  ● #159 R7: la guarda del editor sigue en texto y dice la verdad › geofences.needsCollar tiene fila de #159 en mobile-ui-language

    expect(received).toContain(expected) // indexOf

    Expected substring: "| — | `geofences.needsCollar` | `Safe zones need a collar with an active plan.` | `Las zonas seguras necesitan un collar con plan activo.` | ← cambiada por #159 (R7) |"
    Received string:    "### §2.23 — Añadidos por #159 — Pingo sin collar·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `map.noTrackingTitle` | `No live location` | `Sin ubicación en vivo` | ← añadida por #159 (R1) |
    | — | `map.noTrackingBody` | `Once your pet has a collar with an active plan, I'll show you where they are.` | `Cuando tu mascota tenga un collar con plan activo, te muestro dónde está.` | ← añadida por #159 (R1) |
    | — | `geofences.noTrackingTitle` | `Safe zones unavailable` | `Zonas seguras no disponibles` | ← añadida por #159 (R1) |
    | — | `geofences.noTrackingBody` | `Once your pet has a collar with an active plan, I'll let you know if they leave a safe zone.` | `Cuando tu mascota tenga un collar con plan activo, te aviso si sale de una zona segura.` | ← añadida por #159 (R1) |
    | — | `map.trackingNeedsCollar` ← retirada por #159 (R2) | `Live tracking requires a collar` | `El rastreo en vivo requiere un collar` |
    "
```

Cadena literal del handoff c12:
```text
grep -qE '^Tests: +2 failed, 66 passed, 68 total$' /tmp/159-r7-ed.txt \
    && grep -qE '^Tests: +1 failed, 23 passed, 24 total$' /tmp/159-r7-lp.txt \
    && grep -qE '^Tests: +1 failed, 80 passed, 81 total$' /tmp/159-r7-es.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r7-ed.txt)" = 2 \
    && test "$(grep -cE '^  ● ' /tmp/159-r7-lp.txt)" = 1 \
    && test "$(grep -cE '^  ● ' /tmp/159-r7-es.txt)" = 1 \
    && ! grep -qF 'Unable to find' /tmp/159-r7-ed.txt /tmp/159-r7-lp.txt /tmp/159-r7-es.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-r7-ed.txt /tmp/159-r7-lp.txt /tmp/159-r7-es.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/geofence-editor/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx ' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'test(mobile-no-collar-states): #159 R7 red truthful editor guard'
[feature/159-mobile-no-collar-states-pingo c3312097] test(mobile-no-collar-states): #159 R7 red truthful editor guard
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 3 files changed, 15 insertions(+), 3 deletions(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `c3312097 test(mobile-no-collar-states): #159 R7 red truthful editor guard`.

## c13

```text
$ FORCE_COLOR=0 bunx jest src/screens/geofence-editor/index.test.tsx src/providers/__tests__/language-provider.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/ui-language.test.ts > /tmp/159-g7.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       203 passed, 203 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-g7-guardas.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
exit=0
```

Cadena literal del handoff c13:
```text
grep -qE '^Tests: +203 passed, 203 total$' /tmp/159-g7.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g7-guardas.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/i18n/catalog.ts ../specs/mobile-ui-language/design.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/i18n/catalog.ts specs/mobile-ui-language/design.md ' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'feat(mobile-no-collar-states): #159 R7 truthful editor guard copy'
[feature/159-mobile-no-collar-states-pingo 92d9a59b] feat(mobile-no-collar-states): #159 R7 truthful editor guard copy
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 3 insertions(+), 2 deletions(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `92d9a59b feat(mobile-no-collar-states): #159 R7 truthful editor guard copy`.

## Sonda S7

HEAD: `92d9a59b feat(mobile-no-collar-states): #159 R7 truthful editor guard copy`.

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-s7.txt 2>&1; echo "exit=$?"
Tests:       1 failed, 80 passed, 81 total
exit=1

  ● #159 R7: la guarda del editor sigue en texto y dice la verdad › el editor abre <Card testID="geofence-editor-no-tracking"> una sola vez y no usa EmptyState
$ git checkout HEAD -- src/screens/geofence-editor/index.tsx
$ git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
limpio=0
```

Todas las caídas son por aserción; sin errores de ejecución.

## c14

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/159-r8-home.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       3 failed, 218 passed, 221 total
exit=1
```

```text
  ● R9: summary degrada con gracia › explains that activity tracking requires a collar

    expect(instance).toHaveTextContent()

    Expected instance to have text content:
      La actividad necesita un collar con plan activo
    Received:
      La actividad requiere un collar
```

```text
  ● #77 R1: el peso se pinta aunque la actividad no esté disponible › pinta un guion y la nota cuando el perfil tampoco resuelve

    expect(instance).toHaveTextContent()

    Expected instance to have text content:
      La actividad necesita un collar con plan activo
    Received:
      La actividad requiere un collar
```

```text
  ● #77 R2: sin actividad, la fila es la celda de peso seguida de la nota › sin collar: compone la celda y la nota en una sola fila

    expect(instance).toHaveTextContent()

    Expected instance to have text content:
      La actividad necesita un collar con plan activo
    Received:
      La actividad requiere un collar
```

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-r8-es.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 83 passed, 85 total
exit=1
```

```text
  ● #159 R8: la nota de Inicio sigue en texto y dice la verdad › home.activityNeedsCollar declara el literal nuevo en inglés y en español

    expect(received).toBe(expected) // Object.is equality

    Expected: "Activity needs a collar with an active plan"
    Received: "Activity tracking requires a collar"
```

```text
  ● #159 R8: la nota de Inicio sigue en texto y dice la verdad › home.activityNeedsCollar tiene fila de #159 en mobile-ui-language

    expect(received).toContain(expected) // indexOf

    Expected substring: "| — | `home.activityNeedsCollar` | `Activity needs a collar with an active plan` | `La actividad necesita un collar con plan activo` | ← cambiada por #159 (R8) |"
    Received string:    "### §2.23 — Añadidos por #159 — Pingo sin collar·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `map.noTrackingTitle` | `No live location` | `Sin ubicación en vivo` | ← añadida por #159 (R1) |
    | — | `map.noTrackingBody` | `Once your pet has a collar with an active plan, I'll show you where they are.` | `Cuando tu mascota tenga un collar con plan activo, te muestro dónde está.` | ← añadida por #159 (R1) |
    | — | `geofences.noTrackingTitle` | `Safe zones unavailable` | `Zonas seguras no disponibles` | ← añadida por #159 (R1) |
    | — | `geofences.noTrackingBody` | `Once your pet has a collar with an active plan, I'll let you know if they leave a safe zone.` | `Cuando tu mascota tenga un collar con plan activo, te aviso si sale de una zona segura.` | ← añadida por #159 (R1) |
    | — | `map.trackingNeedsCollar` ← retirada por #159 (R2) | `Live tracking requires a collar` | `El rastreo en vivo requiere un collar` |
    | — | `geofences.needsCollar` | `Safe zones need a collar with an active plan.` | `Las zonas seguras necesitan un collar con plan activo.` | ← cambiada por #159 (R7) |
    "
```

Cadena literal del handoff c14:
```text
grep -qE '^Tests: +3 failed, 218 passed, 221 total$' /tmp/159-r8-home.txt \
    && grep -qE '^Tests: +2 failed, 83 passed, 85 total$' /tmp/159-r8-es.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r8-home.txt)" = 3 \
    && test "$(grep -cE '^  ● ' /tmp/159-r8-es.txt)" = 2 \
    && ! grep -qF 'Unable to find' /tmp/159-r8-home.txt /tmp/159-r8-es.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-r8-home.txt /tmp/159-r8-es.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/__tests__/empty-state.test.tsx src/screens/home/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/screens/home/index.test.tsx ' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'test(mobile-no-collar-states): #159 R8 red truthful activity note'
[feature/159-mobile-no-collar-states-pingo c6430e68] test(mobile-no-collar-states): #159 R8 red truthful activity note
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 28 insertions(+), 3 deletions(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `c6430e68 test(mobile-no-collar-states): #159 R8 red truthful activity note`.

## c15

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts > /tmp/159-g8.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       360 passed, 360 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-g8-guardas.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
exit=0
```

Cadena literal del handoff c15:
```text
grep -qE '^Tests: +360 passed, 360 total$' /tmp/159-g8.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g8-guardas.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/i18n/catalog.ts ../specs/mobile-ui-language/design.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/i18n/catalog.ts specs/mobile-ui-language/design.md ' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'feat(mobile-no-collar-states): #159 R8 truthful activity note copy'
[feature/159-mobile-no-collar-states-pingo 1e45b478] feat(mobile-no-collar-states): #159 R8 truthful activity note copy
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 3 insertions(+), 2 deletions(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `1e45b478 feat(mobile-no-collar-states): #159 R8 truthful activity note copy`.

## Sonda S8a

HEAD: `1e45b478 feat(mobile-no-collar-states): #159 R8 truthful activity note copy`.

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-s8a.txt 2>&1; echo "exit=$?"
Tests:       2 failed, 83 passed, 85 total
exit=1

  ● #159 R8: la nota de Inicio sigue en texto y dice la verdad › home.activityNeedsCollar declara el literal nuevo en inglés y en español
  ● #159 R8: la nota de Inicio sigue en texto y dice la verdad › home.activityNeedsCollar no exclama, no lleva emoji y no termina en punto en los dos idiomas
$ git checkout HEAD -- src/i18n/catalog.ts
$ git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
limpio=0
```

Todas las caídas son por aserción; sin errores de ejecución.

## Sonda S8b

HEAD: `1e45b478 feat(mobile-no-collar-states): #159 R8 truthful activity note copy`.

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-s8b.txt 2>&1; echo "exit=$?"
Tests:       1 failed, 84 passed, 85 total
exit=1

  ● #159 R8: la nota de Inicio sigue en texto y dice la verdad › Inicio abre <Text testID="summary-note"> una sola vez
$ git checkout HEAD -- src/screens/home/index.tsx
$ git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
limpio=0
```

Todas las caídas son por aserción; sin errores de ejecución.

## c16

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-g9.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       95 passed, 95 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-g9-guardas.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
exit=0
```

Cadena literal del handoff c16:
```text
grep -qE '^Tests: +95 passed, 95 total$' /tmp/159-g9.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g9-guardas.txt \
    && git diff --quiet f9fb79ed -- package.json bun.lock src/components/empty-state.tsx assets/ \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/__tests__/empty-state.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'test(mobile-no-collar-states): #159 R9 lock no motion on no-collar screens'
[feature/159-mobile-no-collar-states-pingo 1c54b04d] test(mobile-no-collar-states): #159 R9 lock no motion on no-collar screens
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 18 insertions(+)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `1c54b04d test(mobile-no-collar-states): #159 R9 lock no motion on no-collar screens`.

T9 (3):
```text
$ cd /home/claude/sites/Pet-Tracker-wt-159 && pwd
/home/claude/sites/Pet-Tracker-wt-159
$ git diff --quiet f9fb79ed -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/components/empty-state.tsx mobile-pet-tracker/assets/; echo "sin-diff=$?"
sin-diff=0
```

## Sonda S9a

HEAD: `1c54b04d test(mobile-no-collar-states): #159 R9 lock no motion on no-collar screens`.

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-s9a.txt 2>&1; echo "exit=$?"
Tests:       5 failed, 90 passed, 95 total
exit=1

  ● #159 R9: los estados sin collar no traen movimiento ni dependencias › src/screens/map/index.tsx no contiene react-native-reanimated
  ● #159 R9: los estados sin collar no traen movimiento ni dependencias › src/screens/map/index.tsx no contiene \bAnimated\b
  ● #159 R9: los estados sin collar no traen movimiento ni dependencias › src/screens/map/index.tsx no contiene LayoutAnimation
  ● #159 R9: los estados sin collar no traen movimiento ni dependencias › src/screens/map/index.tsx no contiene entering=
  ● #159 R9: los estados sin collar no traen movimiento ni dependencias › src/screens/map/index.tsx no contiene MOTION_
$ git checkout HEAD -- src/screens/map/index.tsx
$ git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
limpio=0
```

Todas las caídas son por aserción; sin errores de ejecución.

## Sonda S9b

HEAD: `1c54b04d test(mobile-no-collar-states): #159 R9 lock no motion on no-collar screens`.

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-s9b.txt 2>&1; echo "exit=$?"
Tests:       5 failed, 90 passed, 95 total
exit=1

  ● #159 R9: los estados sin collar no traen movimiento ni dependencias › src/screens/geofences/index.tsx no contiene react-native-reanimated
  ● #159 R9: los estados sin collar no traen movimiento ni dependencias › src/screens/geofences/index.tsx no contiene \bAnimated\b
  ● #159 R9: los estados sin collar no traen movimiento ni dependencias › src/screens/geofences/index.tsx no contiene LayoutAnimation
  ● #159 R9: los estados sin collar no traen movimiento ni dependencias › src/screens/geofences/index.tsx no contiene entering=
  ● #159 R9: los estados sin collar no traen movimiento ni dependencias › src/screens/geofences/index.tsx no contiene MOTION_
$ git checkout HEAD -- src/screens/geofences/index.tsx
$ git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
limpio=0
```

Todas las caídas son por aserción; sin errores de ejecución.

## Cierre — BASE final

```text
$ cd /home/claude/sites/Pet-Tracker-wt-159/mobile-pet-tracker && pwd
/home/claude/sites/Pet-Tracker-wt-159/mobile-pet-tracker
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/map/index.test.tsx src/screens/geofences/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/home/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-final.txt 2>&1; echo "exit=$?"
Test Suites: 10 passed, 10 total
Tests:       749 passed, 749 total
exit=0
```

Comando BASE original en H0 (mismo filtro de 10 ficheros):
```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/map/index.test.tsx src/screens/geofences/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/home/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-base.txt 2>&1; echo "exit=$?"
Test Suites: 10 passed, 10 total
Tests:       699 passed, 699 total
exit=0
```

Antes de ALL final: `pgrep -af '[i]nit\.sh'` vacío (exit=1 esperado).

## Cierre — ALL final

```text
$ FORCE_COLOR=0 bunx jest > /tmp/159-all.txt 2>&1; echo "exit=$?"
Test Suites: 97 passed, 97 total
Tests:       2415 passed, 2415 total
exit=0
```

ALL final = 2365 + 50 = 2415 tests; 97 suites.

```text
$ bun run typecheck; echo "exit=$?"
exit=0
$ tsc --noEmit
```

```text
$ bunx expo lint --no-cache; echo "exit=$?"
exit=0
```

```text
$ git diff --stat f9fb79ed -- package.json bun.lock app.json src/theme
```
Salida vacía; exit=0.

## Anclas de cierre

```text
$ cd /home/claude/sites/Pet-Tracker-wt-159 && pwd
/home/claude/sites/Pet-Tracker-wt-159
```

A1:
```text
$ test ! -e mobile-pet-tracker/.expo/types/router.d.ts && echo ok
ok
```

A2:
```text
$ git merge-base --is-ancestor 65f37841 HEAD && echo ok
ok
```

A3:
```text
$ grep -cF '+ 5, // #155 R1' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
0
```

A4:
```text
$ grep -cF "['geofences.needsCollar', 'Safe zones require a collar', 'Las zonas seguras requieren un collar']," mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
0
```

A5:
```text
$ grep -cF 'expect(R4_MAP).toHaveLength(17 + 2); // +2 #155 R4' mobile-pet-tracker/src/__tests__/ui-language.test.ts
0
```

A6:
```text
$ grep -cF 'expect(R14_GEOFENCES).toHaveLength(18 + 1); // +1 #155 R8' mobile-pet-tracker/src/__tests__/ui-language.test.ts
0
```

A7:
```text
$ grep -cF "{ file: 'src/screens/map/index.tsx', key: 'map.trackingNeedsCollar' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
0
```

A8:
```text
$ grep -cF "{ file: 'src/screens/geofences/index.tsx', key: 'geofences.needsCollar' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
0
```

A9:
```text
$ grep -cF "{ file: 'src/screens/geofence-editor/index.tsx', key: 'geofences.needsCollar' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
1
```

A10:
```text
$ grep -cF "['src/screens/map/index.tsx', 1]," mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
0
```

A11:
```text
$ grep -cF "['src/screens/geofences/index.tsx', 1]," mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
0
```

A12:
```text
$ grep -cF "t('map.trackingNeedsCollar')" mobile-pet-tracker/src/screens/map/index.tsx
0
```

A13:
```text
$ grep -cF '<Text testID="map-no-tracking" className="text-center text-muted">' mobile-pet-tracker/src/screens/map/index.tsx
0
```

A14:
```text
$ grep -cF '<Card testID="geofences-no-tracking" className="items-center py-8">' mobile-pet-tracker/src/screens/geofences/index.tsx
0
```

A15:
```text
$ grep -cF "const canSetLostMode = selectedPet?.myRole === 'owner';" mobile-pet-tracker/src/screens/map/index.tsx
1
```

A16:
```text
$ grep -cF "'El rastreo en vivo requiere un collar'," mobile-pet-tracker/src/screens/map/index.test.tsx
0
```

A17:
```text
$ grep -cF "it('pinta el 402 sin Reintentar'" mobile-pet-tracker/src/screens/geofences/index.test.tsx
0
```

A18:
```text
$ grep -cF "it('pinta el 402 sin Reintentar'" mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
1
```

A19:
```text
$ grep -cF 'Las zonas seguras requieren un collar' mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
0
```

A20:
```text
$ grep -cF "'La actividad requiere un collar'" mobile-pet-tracker/src/screens/home/index.test.tsx
0
```

A21:
```text
$ grep -cF 'const mockRouter = jest.mocked(router);' mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

A22:
```text
$ grep -cF '### §2.21 — Añadidos por #155 — Pingo en los estados vacíos' specs/mobile-ui-language/design.md
1
```

A23:
```text
$ grep -cF '### §2.23' specs/mobile-ui-language/design.md
1
```

A24:
```text
$ grep -cF '## 3. La infraestructura' specs/mobile-ui-language/design.md
1
```

A25:
```text
$ grep -cF 'el tab Map muestra `Live tracking requires a collar`' docs/verification.md
0
```

A26:
```text
$ grep -cF 'map.trackingNeedsCollar' mobile-pet-tracker/src/i18n/catalog.ts
0
```

A27:
```text
$ grep -cE "^\s+'(map\.noTrackingTitle|map\.noTrackingBody|geofences\.noTrackingTitle|geofences\.noTrackingBody)':" mobile-pet-tracker/src/i18n/catalog.ts
8
```

A28:
```text
$ grep -cE "react-native-reanimated|\bAnimated\b|LayoutAnimation|entering=|MOTION_" mobile-pet-tracker/src/screens/map/index.tsx mobile-pet-tracker/src/screens/geofences/index.tsx
mobile-pet-tracker/src/screens/map/index.tsx:0
mobile-pet-tracker/src/screens/geofences/index.tsx:0
```

H1:
```text
$ grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-09)' specs/mobile-no-collar-states-pingo/requirements.md
1
```

H2:
```text
$ grep -cF -- '- [ ] Prueba de humo R10 superada en dev build de Android (fecha: ____)' specs/mobile-no-collar-states-pingo/requirements.md
1
```

H3:
```text
$ grep -cF '"status": "in_progress"' feature_list.json
1
```

H4:
```text
$ grep -rlF '#159' mobile-pet-tracker/src | wc -l
6
```

H5:
```text
$ grep -cF "describe('#159" mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
5
```

H6:
```text
$ grep -cF 'function makeDevice(connectivity: string | null): DeviceStatus {' mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

H7:
```text
$ grep -cF 'function pending<T>(): Promise<T> {' mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

H8:
```text
$ grep -cF "function petState(myRole: PetProfile['myRole'] = 'owner'): PetState {" mobile-pet-tracker/src/screens/geofences/index.test.tsx
1
```

H9:
```text
$ grep -cF "function mount(language: Language = 'es', onUnauthorized?: () => void, seedRole = false) {" mobile-pet-tracker/src/screens/geofences/index.test.tsx
1
```

H10:
```text
$ grep -cF "const isOwner = pet.data?.kind === 'ok' && pet.data.pet.myRole === 'owner';" mobile-pet-tracker/src/screens/geofences/index.tsx
1
```

H11:
```text
$ grep -cF 'testID="summary-note"' mobile-pet-tracker/src/screens/home/index.tsx
1
```

H12:
```text
$ grep -cF 'testID={`${testID}-action`}' mobile-pet-tracker/src/components/empty-state.tsx
1
```

H13:
```text
$ grep -cF "t('home.pairCollar')" mobile-pet-tracker/src/screens/map/index.tsx
1
```

H14:
```text
$ grep -cF "router.push('/pairing')" mobile-pet-tracker/src/screens/map/index.tsx
1
```

H15:
```text
$ grep -cF 'function languageDesign(): string {' mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
1
```

H16:
```text
$ grep -cF "describe('R5: mascota free degrada sin mapa'" mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

H17:
```text
$ grep -cF "it('shows the collar requirement without map, stats, lost mode, or polling'" mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

H18:
```text
$ grep -cF "describe('#41 R5: la pantalla pinta la lista de zonas y sus estados'" mobile-pet-tracker/src/screens/geofences/index.test.tsx
1
```

H19:
```text
$ grep -cF "describe('#146 R6: el editor pinta el formulario sobre el mapa y sus estados'" mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
1
```

H20:
```text
$ grep -cF "describe('#146 R8: Guardar crea o actualiza la zona y vuelve a la lista'" mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
1
```

H21:
```text
$ grep -cF "it('registra las once claves en los dos idiomas y en la tabla de la spec de idioma'" mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
1
```

H22:
```text
$ grep -cF "it('explains that activity tracking requires a collar'" mobile-pet-tracker/src/screens/home/index.test.tsx
1
```

H23:
```text
$ grep -cF "it('pinta un guion y la nota cuando el perfil tampoco resuelve'" mobile-pet-tracker/src/screens/home/index.test.tsx
1
```

H24:
```text
$ grep -cE '<Card\s+testID="geofence-editor-no-tracking"' mobile-pet-tracker/src/screens/geofence-editor/index.tsx
1
```

H25:
```text
$ grep -cF '(child.props.testID ?? child.type)' mobile-pet-tracker/src/screens/map/index.test.tsx
2
```

H26:
```text
$ grep -cF '(child.props.testID ?? child.type)' mobile-pet-tracker/src/screens/geofences/index.test.tsx
2
```

P1:
```text
$ grep -cF '<EmptyState' mobile-pet-tracker/src/screens/map/index.tsx
2
```

P2:
```text
$ grep -cF '<EmptyState' mobile-pet-tracker/src/screens/geofences/index.tsx
2
```

P3:
```text
$ grep -cF 'const canPairCollar =' mobile-pet-tracker/src/screens/map/index.tsx
1
```

P4:
```text
$ grep -cF 'detail.data.pet.device === null;' mobile-pet-tracker/src/screens/map/index.tsx
1
```

P5:
```text
$ grep -cF "t('home.pairCollar')" mobile-pet-tracker/src/screens/geofences/index.tsx
0
```

P6:
```text
$ grep -cF '+ 4 // #159 R1' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
1
```

P7:
```text
$ grep -cF -- '- 1, // #159 R2' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
1
```

P8:
```text
$ grep -cF 'expect(R4_MAP).toHaveLength(17 + 2 + 1 + 1); // +2 #155 R4, +1 #159 R2, +1 #159 R3' mobile-pet-tracker/src/__tests__/ui-language.test.ts
1
```

P9:
```text
$ grep -cF 'expect(R14_GEOFENCES).toHaveLength(18 + 1 + 1); // +1 #155 R8, +1 #159 R5' mobile-pet-tracker/src/__tests__/ui-language.test.ts
1
```

P10:
```text
$ grep -cF '### §2.23 — Añadidos por #159 — Pingo sin collar' specs/mobile-ui-language/design.md
1
```

P11:
```text
$ grep -cF 'el tab Map muestra a Pingo con `No live location`' docs/verification.md
1
```

P12:
```text
$ grep -cF "{ file: 'src/screens/map/index.tsx', key: 'home.pairCollar' }, // #159 R3" mobile-pet-tracker/src/__tests__/ui-copy-table.ts
1
```

## Cierre — diffs y alcance

```text
$ git diff --stat f9fb79ed -- backend-pet-tracker/ infra-pet-tracker/
```
exit=0. Salida vacía.

```text
$ git diff --name-only f9fb79ed HEAD -- docs/
docs/verification.md
```
exit=0.

```text
$ git diff --name-only f9fb79ed HEAD -- mobile-pet-tracker/ | LC_ALL=C sort
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
mobile-pet-tracker/src/screens/geofences/index.test.tsx
mobile-pet-tracker/src/screens/geofences/index.tsx
mobile-pet-tracker/src/screens/home/index.test.tsx
mobile-pet-tracker/src/screens/map/index.test.tsx
mobile-pet-tracker/src/screens/map/index.tsx
```
exit=0.

## Historial T1–T9 (16 commits, orden exacto)

```text
6906af80 test(mobile-no-collar-states): #159 R1 red no-collar copy
b77f23ff feat(mobile-no-collar-states): #159 R1 no-collar copy in catalog and language table
56918113 test(mobile-no-collar-states): #159 R2 red map no-tracking empty state
00755951 feat(mobile-no-collar-states): #159 R2 map no-tracking empty state
f346baf3 test(mobile-no-collar-states): #159 R3 red pair collar action
9b89f6c8 feat(mobile-no-collar-states): #159 R3 pair collar action on map
9506bd88 test(mobile-no-collar-states): #159 R4 red pair action only for owner without collar
f4f48736 feat(mobile-no-collar-states): #159 R4 gate pair action on detail
14e76905 test(mobile-no-collar-states): #159 R5 red safe zones no-tracking empty state
176d9d45 feat(mobile-no-collar-states): #159 R5 safe zones no-tracking empty state
cc53c018 test(mobile-no-collar-states): #159 R6 lock no pair action in safe zones
c3312097 test(mobile-no-collar-states): #159 R7 red truthful editor guard
92d9a59b feat(mobile-no-collar-states): #159 R7 truthful editor guard copy
c6430e68 test(mobile-no-collar-states): #159 R8 red truthful activity note
1e45b478 feat(mobile-no-collar-states): #159 R8 truthful activity note copy
1c54b04d test(mobile-no-collar-states): #159 R9 lock no motion on no-collar screens
```

No hay decisiones de producto adicionales: se aplicaron las decisiones y los literales cerrados de la spec. No se ejecutó init.sh, ni se tocó Postgres o LocalStack; el gate de init.sh corresponde al leader. No se hizo push ni se abrió PR, según el guion.

## R10 — pasos listos para el humano

Desde `mobile-pet-tracker/`, ejecutar `bunx expo start --dev-client` y abrir un dev build de Android (nunca Expo Go). Entrar con cuenta de dueño y crear una mascota desde la app, que nace sin collar.

1. Seleccionar esa mascota y abrir Mapa: comprobar Pingo con el collar, `Sin ubicación en vivo`, `Cuando tu mascota tenga un collar con plan activo, te muestro dónde está.` y el botón `Vincular collar`.
2. Pulsar `Vincular collar`: comprobar que abre la pantalla de emparejar.
3. Abrir Perfil → Zonas seguras: comprobar Pingo con el collar, `Zonas seguras no disponibles` y `Cuando tu mascota tenga un collar con plan activo, te aviso si sale de una zona segura.`, sin botón.
4. Abrir Inicio: comprobar la nota `La actividad necesita un collar con plan activo` en la tarjeta de resumen.
5. Activar reduce motion en Ajustes de Android y repetir 1 y 3: deben verse igual y nada debe moverse.

El humano firma con fecha su casilla de R10 en requirements.md. La feature sigue in_progress hasta ese smoke.

R10: pendiente del smoke humano
