---
feature: "mobile-pairing-pingo-canvas-fidelity"
status: approved     # draft | approved
tags: [harness, spec]
---

# Diseño — [[mobile-pairing-pingo-canvas-fidelity]]

> Decisiones de alto nivel. Sin código de aplicación. Requisitos en [[requirements]].

## Decisiones técnicas

1. **Capa**: presentación de `mobile-pet-tracker`. No cambia `backend-pet-tracker/` ni ninguna capa de dominio, aplicación o infraestructura. La vista usa el estado que `pairing` ya expone (`phase`, `selectedPet`).
2. **Hero**: `src/screens/pairing/index.tsx` monta el hero solo en la vista de vinculación (R14): Pingo en `pingo-collar.webp` dentro de `PingoFloat` (testID `pairing-pingo-float`), con la imagen `pairing-pingo` y dos anillos detrás.
3. **Anillos**: componente `PingRing` en `src/components/ping-ring.tsx` (D3). Recibe `testID`, `delay` en ms y `className` (tamaño, borde y color). Welcome pasa sus clases actuales (`size-65 rounded-full border-2 border-accent`) y el retardo `index * (MOTION_PING_TIMING.duration / 3)`. Pairing pasa `size-37.5 rounded-full border-3 border-accent` y 1200 ms mediante una constante local con nombre que cita el artboard. Usa `MOTION_PING_FROM`, `MOTION_PING_TO_SCALE` y `MOTION_PING_TIMING` de `src/theme/motion.ts`, sin constantes nuevas. Anima solo `transform` (escala) y `opacity`.
4. **Ciclo de vida**: repetición infinita sin reversa; `cancelAnimation` al desmontar, según la regla de ui-guidelines para bucles.
5. **Reduce motion**: `useReducedMotion()` de Reanimated en `PingRing`. Con reduce motion activo no se inicia la repetición y el anillo queda en reposo (D2). `PingoFloat` ya no anima bajo reduce motion, así que no cambia.
6. **Flotado**: `PingoFloat` sin cambios. El ciclo de 3000 ms sale de `MOTION_PINGO_FLOAT_TIMING` (dos medias vueltas de 1500 ms) y la amplitud de 10 px de `MOTION_PINGO_FLOAT_OFFSET_Y`.
7. **Título**: `Text` de react-native, no un componente de heroui-native, con la clase del token de D4 y `font-black`. Regla #187: una clase `text-<n>` no va en un componente de heroui-native ni en Card, porque tailwind-merge la descarta. E2 (R16) cambia el token a `text-28` y añade `text-center` y `tracking-title`; ver 12.
8. **Margen**: en el `contentContainerStyle` de `pairing-form`, `padding: 24` se sustituye por `paddingHorizontal: 20` y `paddingVertical: 24`; `gap` y `paddingBottom` no cambian. La excepción ya está registrada en `docs/conventions.md` (fidelidad al canvas, 2026-10-13).
9. **Copy**: todo texto por `t()` con claves del catálogo. Sin subtítulo (D5 a). E2 (R18) parte `pairing.freePlanPairPrompt` en dos claves; ver 14.
10. **Botón**: #188 no lo toca. La receta la fija #177. E2 (R19) solo lo ancla al fondo con un espaciador; ver 15.
11. **Maquetación de la vista de vinculación (E2: R15, R17, R19)**. Orden en el árbol de `pairing-form`, solo en la vista de vinculación (`phase === 'idle' && selectedPet?.device === null`):
    - `pairing-pet-row` (R17).
    - `pairing-hero-group` (R15): `View items-center gap-2.5` con dos hijos directos. El primero es `pairing-hero`, la caja de 200 × 150 (`h-37.5 w-50 items-center justify-center`), padre de los dos anillos y de `PingoFloat` con `pairing-pingo`; hereda de la `View` actual las props de accesibilidad que lo ocultan (`accessible={false}`, `accessibilityElementsHidden`, `importantForAccessibility="no-hide-descendants"`) y conserva su lugar como padre de `pairing-ring-0`, `pairing-ring-1` y `pairing-pingo`, así el orden que ya prueba R2 no cambia. El segundo es `pairing-title`.
    - `pairing-error`, si hay `actionError`: no se mueve del sitio que tiene hoy en el árbol.
    - Envoltorio del formulario (la `View gap-4` actual, con `style={{ flexGrow: 1 }}`): `pairing-plan-free` (R18), el bloque del código (R20), `pairing-submit-spacer` y `pairing-submit` (R19).
    `pairing-pingo` pasa de `{ width: 150, height: 150 }` a `{ width: 120, aspectRatio: 1 }`: el asset `pingo-collar.webp` es de 1024 × 1024, así que el alto sale proporcional sin un valor fijo. Se mantiene `contentFit="contain"`.
12. **Título (E2: R16)**: `text-center text-28 font-black tracking-title text-foreground`. `--text-28: 28px` se añade a `@theme` de `src/theme/global.css`, junto a `--text-24` y `--text-26`. Precedente de la combinación: el título del hero de `src/components/empty-state.tsx` (`text-center text-26 font-black tracking-title text-foreground`). `--text-24` se queda: lo usa el input del código (R20).
13. **Avatar de la mascota (E2: R17)**: función local de `src/screens/pairing/index.tsx`, sin fichero nuevo. Construcción:
    - Fila `pairing-pet-row`: `w-full flex-row justify-end`.
    - Anillo `pairing-pet-avatar`: `View rounded-full border-2 border-accent p-0.75` (46 px por fuera: 36 px de disco, 3 px de separación y 2 px de anillo, como el avatar de la cabecera del artboard), con `accessibilityLabel` = nombre de la mascota. No es un `Pressable`, no tiene `onPress` ni rol de botón.
    - Disco `pairing-pet-avatar-disc`: `size-9 items-center justify-center overflow-hidden rounded-full` más `CATEGORY_SLOTS[slot].surface`.
    - Contenido, igual que el selector de avatares (`src/components/pet-switcher.tsx`): con `photoUrl`, `PetAvatar` (`src/components/pet-avatar.tsx`) con `name`, `photoUrl`, `size={36}`, `cacheKey={pet.id}` y `testID="pairing-pet-avatar-image"`; sin `photoUrl`, `Text testID="pairing-pet-avatar-fallback"` con `text-sm font-extrabold` más `CATEGORY_SLOTS[slot].ink` y `pet.name.charAt(0).toUpperCase()`. La inicial la pinta la pantalla, no `PetAvatar`: sin foto, `PetAvatar` dibuja un blobatar SVG.
    - Hueco: `(['amber', 'violet', 'blue', 'green', 'rose'] as const)[index % 5]`, con `index` = posición de la mascota seleccionada en `pets.data.pets`; `CATEGORY_SLOTS` sale de `src/utils/category-palette.ts`.
    - `PetSwitcher` (cualquier variante) no se monta en la vista de vinculación. Su condición actual (`pets.data.pets.length > 0`) pasa a añadir «y no es la vista de vinculación». En el estado emparejado, `ready`, carga y los demás, el selector no cambia.
    - Consecuencia que acepta ED2: en la vista de vinculación no se puede cambiar de mascota; se cambia desde otra pantalla (por ejemplo Home).
14. **Banner del plan gratuito (E2: R18)**: `View` simple con `flex-row items-start gap-2.5 rounded-tile bg-default px-3.5 py-3`, no `Card`: `twMerge` descarta el radio con nombre en los componentes de heroui-native (regla #187). Icono: `InfoCircle` de `reicon-react-native`, 20 px, color de `useThemeColors(['muted'])`, dentro de un `View` con `mt-px` y testID `pairing-plan-icon`. El banner no lleva `style={CONTINUOUS_CORNER}` (solo iOS; los recuentos de `consistency-classnames` para `pairing` siguen en 1, el del input). Texto: `Text testID="pairing-plan-free"` con `flex-1 text-13 font-normal leading-4.75 text-muted` y `selectable`; contiene un `Text` anidado `font-bold text-foreground` con `t('pairing.freePlanPairLead')`, un `{' '}` (cadena de un espacio, que el candado de copy suelto de R11 admite por quedar vacía al recortarla) y `t('pairing.freePlanPairBody')`. `leading-4.75` son 19 px, el 1.45 del artboard sobre 13 px (precedente de interlineado fraccionario: `leading-5.25`). Claves: `pairing.freePlanPairLead` y `pairing.freePlanPairBody` (literales en R18); `pairing.freePlanPairPrompt` se borra de `catalog.ts`, de `ui-copy-table.ts` y de la lista de claves del test de R11.
15. **Botón anclado (E2: R19)**: el `contentContainerStyle` de `pairing-form` gana `flexGrow: 1` solo en la vista de vinculación; los demás estados mantienen el objeto actual. El envoltorio del formulario lleva `style={{ flexGrow: 1 }}` y un `View testID="pairing-submit-spacer" style={{ flexGrow: 1 }}` justo antes de `pairing-submit`, que es el último hijo.
16. **Código de activación (E2: R20)**: contenedor `View gap-1.5` alrededor de etiqueta, input y pista. Recetas de clase en R20; no se transforma el valor (el envío sigue siendo `code.trim()`). El icono `Package` de `reicon-react-native` mide 14 px y toma el color de `useThemeColors(['muted'])`; los tests simulan `reicon-react-native` por fichero, como `form-error.test.tsx`, y el mock debe exponer `size` y `color`. Tokens nuevos en `@theme` de `src/theme/global.css`: `--tracking-code: 0.14em` y `--font-mono: monospace`. No hay otro uso de `font-mono` en `src`, y la pila por defecto de Tailwind (`ui-monospace, ...`) no resuelve en Android; `monospace` es la familia genérica de Android. Si uniwind no compila o no resuelve `font-mono` con ese token, Codex para y vuelve al leader: no se inventa otra familia. Los pesos del proyecto son familias de fuente (`--font-black: 'Inter-Black'`), así que el peso 900 y el monoespaciado no se combinan: prevalece el monoespaciado y no se usa `font-black` en el input (diferencia declarada en E2). Antes de E2 el input era `min-h-12 rounded-xl bg-default px-4 py-3 text-foreground`, la etiqueta `text-xs font-semibold uppercase tracking-widest text-muted`, la pista `text-sm font-normal text-muted` y el contenedor `gap-2`.

## Enmienda para docs/ui-guidelines.md

La escribe el leader en su commit tras la firma; Codex no toca `docs/`:

> Enmienda #188 (anillos de la vinculación de collar). La vista de vinculación sin dispositivo de `pairing` usa dos anillos con `PingRing` (`src/components/ping-ring.tsx`): escala de 0.55 a 1.5, opacidad de 0.55 a 0, 2400 ms, retardo de 1200 ms en el segundo, borde de 3 px en `accent`, 150 px. Bajo reduce motion, los anillos quedan en reposo (escala 1, opacidad 0.3). Esta enmienda cubre solo esa vista: la regla de #167, «Ninguna otra pantalla usa anillos de ping sin una enmienda propia», sigue vigente para el resto de pantallas.

Con E2 se escribe además, en el mismo commit del leader, una segunda enmienda (`rounded-14` está nombrado como excepción en `docs/ui-guidelines.md` solo para #178 y #179):

> Enmienda #188 (vinculación de collar, geometría del artboard). El input del código de activación de `pairing` usa `rounded-14` (14 px, `--radius-14`) con `h-15`, `border-2 border-accent` y `bg-default`, como el artboard «Vincular collar (19)». El avatar de la mascota de la fila superior usa el anillo de 2 px en `accent` con 3 px de separación (`border-2 border-accent p-0.75`), el mismo que el selector de avatares, y no es interactivo. El código se muestra en `font-mono` (`--font-mono: monospace`, familia genérica de Android) con `tracking-code` (0.14 em); no combina con `font-black` porque los pesos del proyecto son familias de fuente. Esta enmienda cubre solo esta pantalla.

## Archivos afectados

Todo bajo `mobile-pet-tracker/`, por capa:

- Presentación, propios de la feature:
  - `src/screens/pairing/index.tsx`: hero, título, orden de elementos, padding horizontal (D6), claves de copy; con E2, grupo del hero, fila y avatar de la mascota, banner, espaciador del botón y receta del código (R15–R20).
  - `src/screens/pairing/index.test.tsx`: tests de R1 a R10, R14 y R15 a R20, y los tests migrados que lista `tasks.md`.
  - `src/components/ping-ring.tsx` (nuevo).
  - `src/components/__tests__/ping-ring.test.tsx` (nuevo): solo R13.
  - `src/__tests__/pairing-canvas-fidelity.test.ts` (nuevo): R11 y R12; con E2, la lista de claves de R11 y el test de tokens.
  - `src/i18n/catalog.ts`: con E2 (R18), se borra `pairing.freePlanPairPrompt` y se añaden `pairing.freePlanPairLead` y `pairing.freePlanPairBody`, en es y en.
  - `src/__tests__/ui-copy-table.ts`: con E2 (R18), se borra la entrada de `pairing.freePlanPairPrompt` y se registran las dos claves nuevas con `file: 'src/screens/pairing/index.tsx'`.
- Presentación, compartidos (confirmados al firmar):
  - `src/screens/welcome/index.tsx`: consume `PingRing` (D3). Sin cambio de comportamiento (R13).
  - `src/theme/global.css`: token `--text-24: 24px` (D4 a, ya añadido); con E2, `--text-28: 28px`, `--tracking-code: 0.14em` y `--font-mono: monospace`.
- Documentación, no código:
  - `docs/conventions.md`: sin cambios; la excepción «fidelidad al canvas, 2026-10-13» ya cubre D6 (a).
  - `docs/ui-guidelines.md`: enmienda de anillos y enmienda de E2 (texto arriba), las escribe el leader.
- Sin cambios: `src/app/pairing.tsx`, `src/app/_layout.tsx` (ruta con `title: ''`), `src/components/pingo-float.tsx`, `src/theme/motion.ts` y `src/screens/alert-detail/ping-ring.tsx`.

## Dependencias y coordinación

- **#177 (receta del botón, mergeada)**: en `origin/main` desde cbd964da (PR #231); no bloquea el cierre. El botón `pairing-submit` recibe su receta de #177; #188 no la redefine ni la prueba. Orden: cumplido (#177 mergeada antes de cerrar #188).
- **#186 (formularios y validación, cerrada)**: no tocó el input de vinculación (su spec lo deja fuera, P4). D7 fijó que #188 no tocaba el input; E2 (ED3 b, R20) reabre D7 solo para la receta visual de etiqueta, input y pista. El mensaje de error de campo sigue fuera.
- **#181 (cerrada)**: ya centra `pairing-no-pets`. #188 no lo toca (R14).
- **#178 (cerrada)**: origen del título de 24 px y peso 900 (D-H) y de la regla `--text-<px>`.
- **#187 (cerrada)**: regla de no poner `text-<n>` en componentes de heroui-native (R7).
- **#171 (cerrada)**: celebración `pairing-ready`, sin cambios.
- **#167 (cerrada)**: precedente de anillos en welcome; la enmienda de anillos lo acota a la vinculación.

## Alternativas descartadas

- **Copia local de `PingRing` en `pairing`**: duplica el componente de welcome y deriva con el tiempo.
- **Animar `width`, `height` o `borderWidth`**: incumple la regla de `transform` y `opacity`. Los anillos escalan.
- **Lottie o Skia para los anillos**: dependencia nueva para dos círculos. Reanimated basta.
- **Título con `text-2xl`**: no hay token `--text-2xl` y se incumple `--text-<px>`.
- **Título con `text-26`**: token existente, pero 2 px por encima de D-H. Descartado en D4 (b).
- **Anillos de 260 px como en welcome**: el artboard fija 150 px.
- **Subtítulo inventado**: incumple «no inventar copy». Solo cabe con clave aprobada (D5 b).
- **Margen de 20 px sin excepción nombrada**: incumple la regla de `conventions.md` (D6 a exige la excepción).
- **Stepper de #170 dentro de #188**: fuera de alcance (D1).
- **`PetSwitcher variant="avatars"` en la fila superior (versión previa de R17)**: lista todas las mascotas; el humano pidió solo la de la mascota seleccionada (2026-10-20).
- **Avatar de la mascota como `Pressable` que abre un selector**: el artboard no lo define y el humano no lo pidió; el avatar es solo informativo.
- **Banner con `Card`**: `twMerge` descarta `rounded-tile` en los componentes de heroui-native (regla #187).
- **`font-black` en el input del código**: con `font-mono` no se combinan; el peso 900 del artboard es una diferencia declarada.
- **Alto fijo en `pairing-pingo`**: el asset es cuadrado, `aspectRatio: 1` basta.
