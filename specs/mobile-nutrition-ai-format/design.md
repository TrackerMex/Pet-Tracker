---
feature: "mobile-nutrition-ai-format"
status: draft
tags: [harness, spec]
---

# Diseño — [[mobile-nutrition-ai-format]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Rutas relativas a `mobile-pet-tracker/src/`. Todo vive en la capa de presentación del
> móvil; no hay backend, dominio ni dependencias nuevas. El móvil está regido por
> `docs/ui-guidelines.md` (tokens, sin hex, sin `StyleSheet`, sin clases arbitrarias).

## Premisas verificadas contra el árbol (origin/dev, HEAD `73922b10`)

Ancladas por contenido, no por línea. Cada ancla da la cuenta esperada.

- **La tarjeta actual** vive en `screens/food/index.tsx`: `{loadedPlan.aiExplanation !== null ? (`
  abre un `RiseIn delayMs={140}` con la tarjeta `food-ai-card`
  (`flex-row gap-3 rounded-card ${CATEGORY_SLOTS.violet.surface} p-3.5`), el icono
  `Sparkles size={22}`, un `View` `flex-1 gap-0.5` con `food-ai-title` y el
  `food-ai-body` (`Text` con `text-13 leading-body text-foreground`).
  - `grep -cF "text-13" screens/food/index.tsx` da `1` (solo el cuerpo de IA).
  - `grep -cF "leading-body" screens/food/index.tsx` da `1` (idem).
  - `grep -cF "text-11" screens/food/index.tsx` da `1` (la insignia del acuse, no la IA).
  - `grep -cF "text-17" screens/food/index.tsx` da `1` (no es de la tarjeta: no cambia).
- **Los artboards G1** son más nuevos que el v86 congelado. La tarjeta es una columna
  (`gap:8px`, `padding:14px`, `border-radius:20px`, fondo `--violet`): cabecera en fila
  (icono 20 y título 14/800), cuerpo de `13px/18px` con `max-height:122px` y máscara
  `linear-gradient(180deg,#000 70%,transparent 100%)`, botón «Ver más» (`min-height:44px`,
  `margin:-4px 0 -6px -8px`, 13/800, chevron 16 con `stroke-width 2.6`, `aria-expanded`) y
  aviso de `11px/15px` en `--muted`. Párrafos con `margin:8px 0 0`, lista con `margin:6px
  0 0` y `gap:4px`, ítem `display:flex; gap:8px`, punto `5x5` con `margin-top:7`.
  Esto **enmienda** la anatomía de #200 R8 (ver R10): la tarjeta deja de ser `flex-row`.
- **La explicación es texto libre del modelo**: `FoodPlan.aiExplanation: string | null`
  (mapper del backend, no se toca). Nada del móvil asume un formato; de ahí el parser que
  degrada a texto plano.
- **`CATEGORY_SLOTS.violet`** (`utils/category-palette.ts`) solo tiene las claves
  `surface` y `ink`. El candado `#64 R9` exige que `filesMatching(/bg-category-|text-category-/)`
  sea solo `utils/category-palette.ts`: el fichero nuevo usa `CATEGORY_SLOTS.violet.ink` y
  `useThemeColors`, **nunca** una clase `text-category-*` literal.
- **`HEX_LITERAL`** solo exime la forma de comentario `#NNN R<n>`: un `#224` suelto rompe
  los candados de drift. Todos los comentarios nuevos citan `#224 R<n>`.
- **El degradado** sigue el precedente de `components/pet-hero-header.tsx`:
  `experimental_backgroundImage: 'linear-gradient(to bottom, ${color}00 0%, ${color} 100%)'`
  con el color hex del token y el sufijo alfa. `expo-linear-gradient` está vetado.
- **Prueba con `useThemeColors` identidad.** `screens/food/index.test.tsx` mockea
  `useThemeColors` como `(tokens) => tokens`, sin la opción `virtual` (el candado
  `jest-virtual-mock-lock` prohíbe `virtual:` en cualquier test). El test nuevo hace el
  mismo mock; por eso el color resuelto es el nombre del token.
- **`TOUCH_SLOP`** (`theme/touch-target.ts`) es `{top:6,bottom:6,left:6,right:6}`: 32
  visibles más 12 son 44.
- **Los candados no miran `Text`/`View`/`Pressable` de `react-native`** en
  `heroui-text-size-merge`: ese candado solo barre JSX de HeroUI y de `Card`. El fichero
  nuevo importa `Pressable, Text, View` de `react-native` y **nada** de `heroui-native`;
  así `text-11` y `text-13` no los expulsa `twMerge` (memoria `twmerge-expulsa-text-nn-en-heroui`).

## Decisiones técnicas

- **Parser propio, sin dependencias.** `screens/food/parse-ai-explanation.ts` exporta
  `parseAiExplanation(raw: unknown): AiBlock[]`, `aiExplanationPlainText(blocks): string`
  y el tipo `AiBlock`. Es una función pura de ~40 líneas: normaliza `\r\n?` a `\n`,
  parte por línea, decide viñeta/párrafo con `^[-*](?:\s+(.*))?$` sobre la línea
  recortada, extrae negritas con `\*\*([^*]+)\*\*` (clase de caracteres negada: sin
  retroceso, lineal), elimina todo `*` restante y colapsa espacios dobles. No lanza con
  ninguna entrada (R2). Alternativas descartadas: `react-native-markdown-display` y
  similares (dependencia nueva para tres marcas), `marked` (tamaño, HTML) y un parser
  con estado por caracteres (más código y más rincones sin cubrir).
- **Una línea, un bloque.** El modelo separa con `\n`; fusionar líneas consecutivas en
  un párrafo escondería viñetas y haría la etiqueta ambigua. Es también la regla más
  fácil de probar.
- **Listas anidadas aplanadas.** El diseño tiene un solo nivel de viñeta; una sangría
  de más no merece un segundo nivel visual y se ignora.
- **Cabeceras y numeradas literales.** No se promete lo que no se vio en una salida real;
  quedan como pregunta abierta de [[../../progress/spec_mobile-nutrition-ai-format]].
- **Dos ficheros nuevos y un reparto limpio.** `index.tsx` conserva la tarjeta (cáscara
  violeta, cabecera con icono y título) y delega el contenido en `AiExplanation`. Así #215
  importa solo el contenido y #222 no toca los mismos nodos.
- **Recorte por medida, no por conteo de líneas.** `food-ai-content` (un `View` interno
  que no está limitado por el `maxHeight` del padre porque el hijo de una columna de RN no
  se encoge: `flexShrink` por defecto 0) emite `onLayout` con su alto natural. Si es
  mayor que 122 se activa el recorte. 122 es el `max-height` del artboard (6 líneas de
  18,2 más 12 px de la séptima, que el degradado difumina). No hay `numberOfLines` porque
  los bloques y viñetas son varios `Text`.
- **Estado.** `contentHeight` (número, inicia en 0) y `expandedFor: string | null` (el
  texto para el que se expandió). `expanded = expandedFor === text`: un texto nuevo
  colapsa sin efecto ni `useEffect` (R7). `needsClamp = contentHeight > AI_CLAMP_HEIGHT`.
  Sin evento de layout, `needsClamp` es falso y el texto se ve entero sin botón: es el
  comportamiento seguro en jest y en el primer pintado.
- **Etiqueta continua.** `food-ai-body` es `accessible` con `accessibilityLabel` igual al
  texto plano completo; los hijos no se leen aparte. El botón queda fuera, como hermano.
  Los puntos de viñeta son `View` sin texto, así que no hay glifo que el lector pronuncie.
  Que `\n` se lea como pausa en TalkBack **no está verificado**: va a la casilla de smoke.
- **Botón de 44.** `h-8` (32) con `hitSlop={TOUCH_SLOP}` (12) iguala la regla de la carta
  para controles compactos. La diferencia con el artboard (`min-height:44px` con márgenes
  negativos) es de implementación; el espacio visual lo fija el smoke.
- **Aviso siempre visible.** Es un `Text` fijo, no parte del texto del modelo, para que un
  texto largo o expandido nunca lo oculte (R8).
- **Doble parseo.** `index.tsx` llama a `parseAiExplanation(...)` solo para decidir si hay
  tarjeta (`length > 0`) y `AiExplanation` vuelve a parsear con `useMemo`. Coste lineal y
  trivial; evita exponer bloques en la API del componente. Alternativa descartada: pasar
  los bloques como prop (API más ancha para #215).
- **Sin animación.** `LayoutAnimation`/Reanimated no se usan: el cambio de alto es
  instantáneo y no hay valor animado que probar.

## Archivos afectados

Producción (capa de presentación):

- `screens/food/parse-ai-explanation.ts` — **nuevo**. R1, R2, R3.
- `screens/food/ai-explanation.tsx` — **nuevo**. Exporta `AiExplanation`. R5–R9, R11.
- `screens/food/index.tsx` — la tarjeta de IA: nueva anatomía, condición por
  `parseAiExplanation`, importa `AiExplanation` y `parseAiExplanation`. Su línea de
  import de `reicon-react-native` **no cambia** (los chevrones se importan en el fichero
  nuevo). R10.
- `i18n/catalog.ts` — tres claves en español y en inglés junto a `'food.aiRecommendation'`. R4.

Tests y candados:

- `screens/food/parse-ai-explanation.test.ts` — **nuevo**. R1, R2, R3.
- `screens/food/ai-explanation.test.tsx` — **nuevo**. R4 (copy), R5–R9, R11.
- `screens/food/index.test.tsx` — enmienda `#200 R8`, nuevo `#224 R10`, mock de reicon con
  `ChevronDown` y `ChevronUp`. R10.
- `__tests__/ui-copy-table.ts` — tres filas en `R6_FOOD`. R4.
- `__tests__/ui-language.test.ts` — fórmulas de `R6_FOOD` (+3) y `SCREEN_FILES` (+1). R4.
- `providers/__tests__/language-provider.test.tsx` — fórmula de longitud (+3). R4.
- `__tests__/profile-canvas-fidelity.test.ts` — lista de `text-13`. R13.
- `__tests__/nutrition-canvas-fidelity.test.ts` — fila `line-height: 1.4` y `it.each`
  nuevo de grep-limpio de los dos ficheros nuevos. R13.

Ningún otro fichero de `src/` cambia. `git diff origin/dev --stat` lista solo estos,
más `specs/mobile-nutrition-ai-format/`, `progress/impl_mobile-nutrition-ai-format.md`
y, si el reviewer lo pide, `feature_list.json`. **`backend-pet-tracker/` y
`mobile-pet-tracker/package.json` quedan con diff vacío** (R12).

## Reparto de ficheros y testIDs con #222 y #215

| Elemento | Dueño | Nota |
|---|---|---|
| Cabecera de pantalla, avatar de la mascota, título de Nutrición | #222 | no se toca aquí |
| `food-ai-card`, `food-ai-header`, `food-ai-title` y el icono `Sparkles` | #224 | JSX dentro de `index.tsx` |
| `food-ai-body`, `food-ai-content`, `food-ai-block-<i>`, `food-ai-dot-<i>`, `food-ai-fade`, `food-ai-more`, `food-ai-disclaimer` | #224 | nacen en `ai-explanation.tsx` |
| Uso en la pantalla de otra mascota/plan (la que #215 defina) | #215 | importa `AiExplanation` y no toca su interior |

Los dos PR (#222 y #224) tocan `screens/food/index.tsx` en bloques distintos y comparten
tres líneas de fórmula (`ui-language`, `language-provider`, `ui-copy-table`) y el mock de
`reicon` del test. Regla: el segundo en mergear hace `git merge origin/dev` (nunca
rebase tras la trazabilidad, memoria `rebase-invalida-hashes-traceability`) y resuelve
sumando ambos aportes; el reviewer repite la aritmética tras el merge.

## Árbol del componente (referencia para Codex; nombres y clases son contrato)

```
AiExplanation({ text })                                  View  className="gap-2"
├─ food-ai-body            View accessible, accessibilityLabel=<texto plano>,
│                          className="overflow-hidden",
│                          style={ expanded || !needsClamp ? undefined : { maxHeight: AI_CLAMP_HEIGHT } }
│  ├─ food-ai-content      View onLayout=(e) => setContentHeight(e.nativeEvent.layout.height)
│  │  └─ food-ai-block-<i> ... (párrafo: Text; viñeta: View > [food-ai-dot-<i>, Text])
│  └─ food-ai-fade         View pointerEvents="none", solo si needsClamp && !expanded
├─ food-ai-more            Pressable, solo si needsClamp  (rótulo + chevron)
└─ food-ai-disclaimer      Text
```

- `AI_CLAMP_HEIGHT = 122`, `AI_FADE_HEIGHT = 36`: constantes del módulo, con comentario
  `// #224 R6`.
- Los `t('food.aiShowMore')`, `t('food.aiShowLess')` y `t('food.aiDisclaimer')` aparecen
  **una vez cada uno** en el fichero (R4). El rótulo es
  `expanded ? t('food.aiShowLess') : t('food.aiShowMore')`.
- El punto: `style={{ backgroundColor: violetStrong }}` con `violetStrong` de
  `useThemeColors(['category-violet-strong', 'category-violet'])`; el degradado usa el
  segundo valor. Mismo hook para ambos.
- Chevrones: `import { ChevronDown, ChevronUp } from 'reicon-react-native'`.
- Comentarios: `// #224 R<n>` (nunca `#224` suelto).

## Candados que cruza esta feature (inventario cerrado)

Búsquedas hechas con `grep` sobre todo `src/` del móvil. Fórmulas y listas se anclan por
contenido (la memoria `lo-que-se-desplaza-no-es-ancla`).

| Candado | Qué mira | Acción de #224 |
|---|---|---|
| `__tests__/profile-canvas-fidelity.test.ts`, `limita text-13 …` | lista exacta de ficheros con `\btext-13\b`; incluye `'screens/food/index.tsx'` | quitar ese fichero y añadir `'screens/food/ai-explanation.tsx'` (orden alfabético, antes de `screens/forgot/index.tsx`); título `(enmendado por #224 R13)` |
| `__tests__/nutrition-canvas-fidelity.test.ts`, fila `['Nutricion', 'line-height: 1.4', FOOD, ['leading-body']]` | `leading-body` en el fichero de pantalla | apuntar la fila a `AI_EXPLANATION` (`src/screens/food/ai-explanation.tsx`); `index.tsx` ya no tiene `leading-body` |
| `nutrition-canvas-fidelity.test.ts` `#200 R17` | cero `StyleSheet` y cero `\b[\w-]+-\[` en FOOD, SCHEDULE, HISTORY y sus tests | `it.each` nuevo `'#224 R13: %s ...'` con `AI_EXPLANATION` y `AI_PARSER` (mismas dos comprobaciones; no se reutiliza `productionFiles`, cuyo `replace('index.tsx', 'index.test.tsx')` no cambia nada en ficheros con otro nombre); el código nuevo cumple |
| `__tests__/ui-language.test.ts`, `#65 R6 … resuelve las 51 ocurrencias` | `R6_FOOD` fórmula `35 + 3 + 1 - 2 + 1 + 3 + 9 + 11 + 2 + 1 + 3` (calcula 67; el título «51» está obsoleto) | sumar `+ 3 // #224 R4` |
| `ui-language.test.ts`, `#194 R5 … SCREEN_FILES` | fórmula que acaba en `+ 1 // #208 R20: screens/vaccine-create/index.tsx` | sumar `+ 1 // #224 R4: screens/food/ai-explanation.tsx` |
| `ui-language.test.ts` (`wholeLiterals`) | prohíbe como literal entero cualquier valor fijo del catálogo en `SCREEN_FILES` | el componente solo usa `t('…')`; cero literales de copy |
| `__tests__/ui-copy-table.ts` `checkUses` | cada fila exige `t('clave')` una vez en su fichero | tres filas nuevas en `R6_FOOD` con `file: 'src/screens/food/ai-explanation.tsx'` |
| `providers/__tests__/language-provider.test.tsx`, longitud de catálogo | fórmula que acaba en `+ 5 - 2 // #220 R16` y `+ 26, // #208 R19`; paridad ES/EN; marcadores | sumar `+ 3 // #224 R4` (la coma pasa a la última línea) |
| `#64 R9` (`category-palette`) | `filesMatching(/bg-category-\|text-category-/)` es solo `utils/category-palette.ts` | sin cambio: el fichero nuevo usa `CATEGORY_SLOTS.violet.ink` |
| `heroui-text-size-merge` | solo JSX de HeroUI y `Card` | sin cambio: solo `react-native` en el fichero nuevo |
| `design-drift.test.ts` (hex, `StyleSheet`, `text-[`) | ficheros de pantalla y de test | el nuevo código es grep-limpio; comentarios `#224 R<n>` |
| `jest-virtual-mock-lock` | ningún `virtual:` en ningún test | los tests nuevos no lo usan |
| `consistency-classnames.test.ts` (`<Button` + testID) | `<Button` con testID | el código nuevo no usa `<Button` |
| Inventarios de `text-17`, `text-15`, `tracking-*`, `rounded-16`, `chunky-cta`, `hitSlop` de alerts/schedule/history | cuentas por fichero | verificado: no cambian |
| `alert-detail-canvas-fidelity`, `forms-validation-global` | otras pantallas / `TextInput` | no aplican |

Cuentas encadenadas: el número de ficheros de `SCREEN_FILES` pasa de `N` a `N + 1`; el
de `R6_FOOD`, de `67` a `70`; el del catálogo, de `K` a `K + 3` (el test calcula `N` y
`K` con la fórmula, no con un literal). `text-13`: `index.tsx` pasa de `1` a `0` y
`ai-explanation.tsx` de `0` a `3` (párrafo, texto de viñeta y rótulo del botón), pero el candado compara
**ficheros**, no cuentas.

Memoria aplicable a la cadena de commits (en [[tasks]]): un cambio de fórmula nace rojo
solo si la clave/fichero aún no existe; las enmiendas de candados van en el commit de
test que las motiva.

## Alternativas descartadas

- **Dividir el texto en un `Text` único con `numberOfLines`.** No sirve para varios bloques
  y viñetas con puntos; el recorte por `maxHeight` es independiente de la estructura.
- **`expo-linear-gradient` para el degradado.** Vetado por el humano; hay precedente con
  `experimental_backgroundImage`.
- **Botón `Button` de HeroUI.** `twMerge` expulsa `text-NN` y el candado `<Button` exige
  testID; un `Pressable` de RN con `TOUCH_SLOP` es el patrón del repo.
- **Animar el despliegue.** Coste de pruebas y de rendimiento sin requisito del artboard.
- **Persistir el estado expandido.** Fuera de alcance; el estado es local.
- **Una clave nueva para el aviso en un componente aparte.** Un `Text` fijo basta.

## Riesgos y verificación en dispositivo

- 122 y 36 son los valores del artboard: no se miden en jest. Smoke del humano.
- El alto de `food-ai-content` en `onLayout` asume que un hijo de columna no se encoge
  bajo un `maxHeight` con `overflow:hidden`; es el comportamiento documentado de Yoga,
  pero el smoke lo confirma.
- La lectura de `\n` en la etiqueta con TalkBack y la pausa entre viñetas: smoke.
- Si el modelo responde en inglés con la app en español (o al revés), solo el aviso y el
  botón siguen el idioma de la app: aceptado, ver pregunta abierta.
- Choques de merge con #222 y #215: ver «Reparto».
