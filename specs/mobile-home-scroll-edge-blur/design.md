---
feature: "mobile-home-scroll-edge-blur"
status: approved      # draft | spec_ready | approved
tags: [mobile, home, ui, spike, native, spec]
---

# Diseño — [[mobile-home-scroll-edge-blur]] (#242)

> Ver [[requirements]] para los requisitos que este diseño implementa,
> [[../../docs/architecture|architecture]] para las reglas de capas y
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI móvil. Rutas
> relativas a `mobile-pet-tracker/` salvo que se diga otra cosa.

## Deriva verificada

Contrastado contra el árbol `25c8f0f6` y contra el paquete `expo-backdrop@0.1.3`
(README, `src/`, fuentes Kotlin), no contra el encargo:

| Premisa del encargo | Resultado |
|---|---|
| El `ScrollView` de Inicio está hacia la línea 356 | **Deriva**: `testID="screen-home"` está hacia la línea 371. Se ancla por contenido, no por número. Además hay un early return (`home-no-pets-screen`) antes, por lo que el return principal no tiene raíz común con él. |
| Los overlays pueden ir como hermanos del `ScrollView` | Cierta **solo** con un contenedor común: el return principal devuelve hoy un único `ScrollView`. Hace falta un `View` raíz (D3) o un `Fragment`; se elige `View` por R5/D3 (ver «Decisiones técnicas»). |
| Carga y error son estados aparte | Falsa: `home-loading` y `home-error` se pintan **dentro** del `ScrollView` principal. Los overlays aparecen también ahí (D8, R2). |
| `intensity` por defecto | **Documentación contradictoria**: el README y el Kotlin (`DEFAULT_INTENSITY = 50f`) dicen 50; el JSDoc de TypeScript dice `@default 25`. Da igual para esta spec (D6 no pasa `intensity`), pero el smoke debe tener en cuenta que el valor real es el nativo (50). |
| La librería es compatible con Expo SDK 57 / RN 0.86 | **Riesgo**: sus `devDependencies` apuntan a `expo ^58` y `react-native 0.88` (la compila contra SDK 58). `expo install --check` o `expo-doctor` pueden avisar de versión. No se verifica en jest; lo decide G3/G2. Ver «Riesgos». |
| `tint` admite `systemThinMaterialDark`/`systemThinMaterialLight` | Cierta (nombres válidos en `src/`). |
| Se puede probar en jest con el módulo real | No: es nativo. Se usa un doble de fichero (R2–R8). El módulo debe estar instalado para que `jest.mock` sin `virtual` resuelva su ruta (por eso el commit de la dependencia va antes de los tests de pantalla). |
| El doble de insets de `index.test.tsx` es fijo | Cierta: `{ top: 40, right: 0, bottom: 24, left: 0 }` literal. Pasa a `mockInsets` (patrón de los tests de vacunas) para poder fijar insets distintos entre sí en R3. |
| `useUniwind` está disponible en el test de Inicio | El test importa `Uniwind` real de `'uniwind'` pero no mockea `useUniwind`. Se añade el `jest.mock('uniwind', …)` de fichero (patrón de `profile` y de `floating-tab-bar`). `useThemeColors` también llama a `useUniwind()`: con el doble devuelve `{ theme, hasAdaptiveThemes: false }` y cae a los mismos colores de respaldo, así que los tests viejos no se mueven (con `mockTheme = 'light'` por defecto). |
| Algún guard cuenta líneas de `home/index.tsx` | Solo recuentos de literales concretos (`#195 R19`: `TABULAR_NUMS` 9, `CONTINUOUS_CORNER` 5, `text-accent-strong` 3, `t('profile.addPet'` 1, `home-alerts-bell` 1) que el cambio no toca. `#195 R19` veta `\bBlurView\b`; `ProgressiveBlurView` no lo viola. |
| Los tests de ruta rinden `HomeScreen` | No: stubbean la pantalla. Solo `src/screens/home/index.test.tsx` la renderiza, así que el doble de `expo-backdrop` vive ahí. |

## Decisiones técnicas

- **`View` raíz, no `Fragment`** (R5). Con `Fragment` los dos overlays serían
  hermanos del `ScrollView` en el padre de la ruta, cuyo layout no controla
  Inicio. Con un `View` `flex-1 bg-background` el posicionamiento absoluto de
  los overlays es relativo a la pantalla, el lavado por defecto de la librería
  (fondo opaco del ancestro al 85 %) es determinista y el orden «scroll primero,
  overlays después» (lo que exige Android para encontrar el scroll) queda
  testeable por `testID`.
- **Overlays después del `ScrollView`** (R5). En Android `ProgressiveBlurView`
  busca el scroll entre sus hermanos anteriores y atenúa el difuminado según
  cuánto contenido lo cubre. Poner los overlays antes del scroll los dejaría sin
  scroll al que seguir.
- **`pointerEvents: 'none'` en el `style`** (R4). El README de la
  librería lo pide dentro de `style`; D6 prohíbe además una prop suelta. Los
  overlays cubren la zona de la barra de estado y la de la tab bar: sin esto
  taparían toques de la fila superior de contenido y del scroll bajo la tab bar.
- **Alturas por insets, no por números fijos** (R3). La carta (regla 6) veta
  `top` fijo en overlays; aquí no es un `top` sino una altura, pero se calcula
  igual con `insets.top`/`insets.bottom` para que el efecto cubra exactamente
  la zona segura. `+ 24` es la cola del degradado; el inferior suma además
  `12 + 64` (separación y alto de la tab bar flotante) para que el efecto
  arranque bajo la tab bar y no a media altura de ella.
- **Estilo como objeto plano inline** (R3, R4). Es lo que ya hace
  `contentContainerStyle` en el mismo fichero y es lo único compatible con la
  guarda que veta `StyleSheet` en el fichero y en el test; además permite que el
  test lea `props.style` con `toEqual` sin `StyleSheet.flatten`.
- **Props mínimas** (R2, D6). El spike mide los valores por defecto de la
  librería; cada prop extra sería una decisión de diseño que el humano no tomó.
- **Tema vía `useUniwind`** (R6). Mismo origen que `floating-tab-bar.tsx`; el
  tint se fija explícito por tema (`systemThinMaterialDark`/`Light`) para no
  depender del valor por defecto de la librería (`systemUltraThinMaterial`).
- **Candados no tautológicos.** Alturas, tints y estilos se escriben a mano en
  los tests; el doble de `expo-backdrop` no importa nada de producción. R3 usa
  insets `47`/`31` (distintos entre sí y de los por defecto `40`/`24`) y los
  ceros: una suma cruzada (`top` con `bottom`) acierta con los por defecto solo
  por casualidad numérica y falla con estos. R4 y R6 tienen **una rama por
  overlay** (`it.each`), para que un candado agregado no deje ciego a uno.
  R7 y R8 nacen verdes y están declarados: son candados de ausencia y de
  conservación, con su mutación plantada en la zona donde el candado podría no
  mirar.
- **Orden de commits con rojo real.** R1 se prueba antes de instalar (rojo por
  el recuento enmendado a 44 y la clave ausente), luego la instalación (verde),
  luego los tests de pantalla con el doble ya resoluble (rojo salvo R7 y R8) y
  por último la implementación (verde). Ver [[tasks]].

## Archivos afectados por capa

Solo capa de presentación móvil y manifiesto:

| Capa | Archivo | Cambio |
|---|---|---|
| Manifiesto | `package.json`, `bun.lock` | `"expo-backdrop": "0.1.3"` en `dependencies` (exacta) y su entrada en `bun.lock`. |
| Pantalla | `src/screens/home/index.tsx` | Imports `ProgressiveBlurView` (`'expo-backdrop'`) y `useUniwind` (`'uniwind'`); `const { theme } = useUniwind();` junto a `insets`; constantes de módulo con nombre para `24`, `12` y `64`; el return principal pasa a `View` raíz (`home-screen-root`) con el `ScrollView` intacto y los dos overlays después. El return de `home-no-pets-screen` no cambia. |
| Tests | `src/screens/home/index.test.tsx` | Doble de `expo-backdrop` y de `uniwind` de fichero; `mockInsets`; doce `it` nuevos en siete `describe('#242 R<n>: …')` al final (R2–R8). |
| Tests | `src/__tests__/canvas-foundations.test.ts` | Enmienda de `#197 R22` (`42 + 1 + 1`) y el `describe('#242 R1: …')` con un `it`. |
| Specs | `specs/mobile-home-scroll-edge-blur/` | Esta carpeta. |

Nada en `src/components/`, `src/app/`, `src/i18n/`, `src/theme/`, `docs/`,
backend, `app.json` ni `app.config.ts`.

## Alternativas descartadas

- **`expo-blur` (`BlurView`) en los bordes**: la carta anota que en Android
  exige `blurTarget` y no se difumina progresivamente; además `#195 R19` veta
  `BlurView` en Inicio. `expo-backdrop` es justo lo que el humano quiere probar.
- **Degradado con `expo-linear-gradient` + máscara**: añade dos dependencias
  (veto explícito del humano, ver memoria `dependencias-nuevas-autorizadas`) y
  no difumina, solo tiñe.
- **Poner los overlays en `src/app/(tabs)/_layout.tsx`** (global a todas las
  pestañas): el humano pidió solo Inicio; el layout global está fuera de
  alcance (D2).
- **`Fragment` en vez de `View` raíz**: ver «Decisiones técnicas».
- **`ScrollView` con `onScroll` y opacidad animada propia**: la librería ya
  lee el scroll nativo; sería código duplicado y un candado más (R8 lo veta).
- **Pasar `intensity`/`tintColor`/`startOffset`** para afinar el efecto: es
  precisamente lo que el spike no hace aún (D6); si convence, es otra feature.
- **Enmendar `docs/ui-guidelines.md`** para documentar el efecto: es un spike
  reversible; si se queda, la carta se actualiza después (G4 de otra feature).

## Riesgos

- **Compatibilidad SDK 57 / RN 0.86** (hecho medido): `expo-backdrop@0.1.3` se
  compila contra `expo ^58` y `react-native 0.88`. Puede fallar el build nativo,
  dar avisos de `expo-doctor` o comportarse distinto. No hay forma de saberlo en
  jest: lo cubre G3 (build) y G2 (smoke). Si el build falla, el spike se
  revierte (D10) y se anota.
- **Rendimiento en scroll de Android**: el difuminado nativo bajo un
  `ScrollView` largo puede dar tirones en dispositivos modestos. Paso 5 de G2.
- **Lavado por defecto**: sin `tintColor`, la librería lava con el fondo opaco
  del ancestro al 85 %; el `View` raíz con `bg-background` lo fija, pero en el
  borde puede verse una banda de color. Paso 1 y 6 de G2.
- **Documentación contradictoria de `intensity`** (25 vs 50): no afecta a los
  tests; solo se menciona para interpretar el smoke.
- **Fricción con otras ramas sobre `home/index.tsx`**: el fichero es grande y
  popular. Si `dev` avanza antes del handoff, se mergea `dev` y se re-miden las
  anclas (memoria `handoff-tras-merge-de-dependencia`).
- **El doble de `uniwind` afecta a `useThemeColors`**: se espera que no (cae a
  los mismos respaldos), pero `T0` y `T1` del handoff comparan cifras de tests
  con el mismo conjunto de suites para detectarlo.

## Decisiones abiertas

Ninguna que bloquee el handoff. Anotadas para el humano en G2/G3:

- **¿Intensidad por defecto suficiente?** Si el efecto se ve débil o fuerte, la
  decisión de tunear `intensity` o `tintColor` es del humano y otra feature.
- **¿Extender a otras pantallas?** Decisión del humano tras el smoke.
- **Versión exacta vs `expo install --check`**: se fija `0.1.3` exacta (D1) por
  ser una librería de versión `0.x` con una sola publicación conocida; si
  `expo-doctor` se queja y el humano prefiere `~0.1.3`, es una enmienda de una
  línea a R1 antes del merge.
