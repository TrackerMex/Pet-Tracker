---
feature: "mobile-nutrition-ai-format"
tags: [harness, progress]
---

# Spec #224 `mobile-nutrition-ai-format` — preguntas dudosas y candados cruzados

Autor: `spec_author`. Estado de la spec: `draft` (sin firmar; las casillas humanas de
`specs/mobile-nutrition-ai-format/requirements.md` § Aprobación están sin marcar).
Worktree `/home/claude/sites/Pet-Tracker-wt-224`, rama `feature/224-mobile-nutrition-ai-format`,
HEAD `73922b10` (origin/dev). No se ha commiteado nada. `feature_list.json` no se tocó.

Ficheros: `specs/mobile-nutrition-ai-format/{requirements,design,tasks,traceability}.md` y
`canvas/{NutricionIAColapsada,NutricionIAExpandida}.dc.html` (copiados de `canvas-ola0-ui`).

## Preguntas dudosas (para el leader antes de firmar)

1. **El artboard G1 contradice la anatomía de #200 R8.** El artboard nuevo pone la tarjeta
   en columna (`gap 8`, cabecera con icono 20) y #200 R8 fijó fila con icono 22 y un
   `View flex-1 gap-0.5`. La spec sigue el artboard más nuevo y **enmienda** el `it`
   `#200 R8: la recomendación es la tarjeta violeta del canvas` (R10: clase de la tarjeta,
   icono 22 a 20, padre del título, cuerpo). Si se prefiere conservar #200 R8, R10 y el
   árbol de `design.md` cambian.
2. **Cabeceras `##` y listas numeradas no se soportan** (salen literales, R1 filas 18 y
   19). No hay salidas reales del modelo para decidir. Si #212 las emite, es una
   enmienda del parser.
3. **Cambio de comportamiento: una explicación en blanco ya no pinta la tarjeta** (hoy
   `''` pinta una tarjeta vacía; `null` ya no la pintaba). La condición pasa a ser
   `parseAiExplanation(...).length > 0`, con candado `#224 R10`.
4. **Inglés del botón**: «See more» / «See less» es elección mía; el copy ES y el aviso
   en ambos idiomas son los literales del leader.
5. **Aviso con `text-11 leading-body text-muted`** en vez de `text-11 text-muted` literal:
   añadí `leading-body` para acercar la línea de 15 px del artboard (11 x 1,4 = 15,4).
   Si se quiere la cadena exacta del leader, se quita `leading-body` en R8.
6. **Lectura de `\n` en TalkBack sin verificar.** La etiqueta une bloques con `\n` y no hay
   forma de probarlo en jest; va en la casilla de smoke.
7. **122 px de recorte y 36 px de degradado** salen del artboard (no medidos en
   dispositivo). Además se asume que el hijo `food-ai-content` informa su alto natural
   bajo el `maxHeight` del padre. Son constantes (`AI_CLAMP_HEIGHT`, `AI_FADE_HEIGHT`);
   la casilla de smoke las confirma o enmienda.
8. **Doble parseo**: `index.tsx` parsea para decidir la tarjeta y `AiExplanation` vuelve a
   parsear. Coste trivial; evita ensanchar la API para #215. Alternativa descartada
   en `design.md`.
9. **Idioma de la explicación**: solo el aviso y el botón siguen el idioma de la app; el
   modelo responde en el idioma que fije el backend (#212).
10. **Choques de merge con #222 y #215** en tres líneas de fórmula (`ui-language`,
    `language-provider`, `ui-copy-table`), el mock de `reicon` de `index.test.tsx` y los
    imports de `index.tsx`. Regla escrita: el segundo en mergear hace `git merge origin/dev`,
    nunca rebase tras la trazabilidad. Las specs de #222 aún no existían al escribir esta
    (solo su `canvas/`), así que el reparto de testIDs lo propuse yo (`design.md` §Reparto):
    #224 posee `food-ai-*`; confirmar con la spec de #222 al firmar.
11. **Estado de la cadena de commits**: tras C4 quedan rojos, declarados, `#200 R8`
    enmendado, `#224 R10` y la lista `text-13` de Perfil (porque `index.tsx` aún conserva su
    `text-13` hasta C5). Si el leader prefiere que ningún `feat` deje un candado ajeno rojo,
    se fusionan C4 y C5.
12. **Dato obsoleto preexistente**: el título del `it` de `R6_FOOD` dice «51 ocurrencias»
    pero la fórmula calcula 67 (más 3 = 70). No lo arreglo; la spec anota «el título está
    obsoleto» y solo suma `+ 3`.

## Candados cruzados (grep real contra el árbol)

Todo verificado en `origin/dev` HEAD `73922b10`; anclas por contenido.

- `#200 R8` (`index.test.tsx`): asserta clase de tarjeta, icono `22`, clase del título,
  padre `flex-1 gap-0.5`, clase del cuerpo y orden `food-icon-sparkles / food-ai-title /
  food-ai-body`. Se enmienda (R10). Siguen verdes sin editar: `R6` (texto del plan
  dentro de `food-ai-card`), `#62 R5`, `#200 R10` (delay 140), `#200 R11` (orden de
  secciones).
- `profile-canvas-fidelity.test.ts` lista de `\btext-13\b`: `food/index.tsx` tiene exactamente 1
  `text-13` (el cuerpo de IA); sale de la lista y entra `screens/food/ai-explanation.tsx`
  antes de `screens/forgot/index.tsx`.
- `nutrition-canvas-fidelity.test.ts`: la fila `line-height: 1.4` / `leading-body` se
  re-apunta (index.tsx tiene exactamente 1 `leading-body`, que se muda); `#200 R17`
  recorre `productionFiles` con `replace('index.tsx', 'index.test.tsx')`, que no sirve para
  el fichero nuevo, así que R13 pide un `it.each` propio.
- `ui-language.test.ts`: `R6_FOOD` suma 3 (de 67 a 70) y `SCREEN_FILES` suma 1 (acaba en
  `+ 1 // #208 R20: screens/vaccine-create/index.tsx`); `wholeLiterals` prohíbe copy
  literal en el componente.
- `ui-copy-table.ts`: tres filas nuevas; `checkUses` cuenta `t('clave')` literal, así que el
  rótulo del botón es `expanded ? t('food.aiShowLess') : t('food.aiShowMore')`.
- `language-provider.test.tsx`: fórmula de catálogo, última línea `+ 26, // #208 R19`
  (la coma se mueve), paridad ES/EN y marcadores.
- `#64 R9`: `filesMatching(/bg-category-|text-category-/)` solo admite `utils/category-palette.ts`;
  el fichero nuevo usa `CATEGORY_SLOTS.violet.ink` y `useThemeColors`.
- `heroui-text-size-merge`: solo barre JSX de HeroUI/Card; el fichero nuevo importa de
  `react-native` y la spec prohíbe `heroui-native` (así `twMerge` no expulsa `text-11`/`text-13`).
- `design-drift` / `HEX_LITERAL`: solo exime `#NNN R<n>`; los comentarios usan `#224 R<n>`.
  El patrón hex de `nutrition-canvas-fidelity` es `#[0-9a-fA-F]{3,8}\b(?!\s+R\d)`.
- `jest-virtual-mock-lock`: ningún `virtual:`; `useThemeColors` identidad sin esa opción.
- Inventarios verificados **sin cambio**: `text-17` (food=1), `text-15`, `text-11` (sin
  inventario por fichero), `tracking-*`, `rounded-16`, `chunky-cta`, `hitSlop` de
  alerts/schedule/history, `consistency-classnames` (`<Button` con testID), `font-medium`
  (ya usado en food/index.tsx y otras pantallas; las fuentes son familias `Inter-*`).
- Testid con selector por prefijo: `food-ai-*` nuevos (`food-ai-more`, `food-ai-disclaimer`,
  `food-ai-content`, `food-ai-block-<i>`, `food-ai-dot-<i>`, `food-ai-fade`, `food-ai-header`);
  los `it` existentes usan testIDs exactos o la regex de orden de secciones
  (`food-ai-card` sin sufijo), no un prefijo `food-ai-`.
- Mock cerrado de `reicon-react-native` en `index.test.tsx`: debe sumar `ChevronDown` y `ChevronUp`.

## Tabla de casos del parser

Calculada ejecutando una implementación de referencia en `node` y revisada a mano
(19 filas de gramática y 18 de degradación, con valores literales en `requirements.md`).
El script de referencia vive solo en el scratchpad de la sesión; **no** es parte del repo
ni de la spec. Los textos de ejemplo son sintéticos y la spec lo declara; no hay fixtures
reales de `ai_explanation`.

## Cosas que no hice

- No toqué `nutrition-prompt.ts`, `anthropic-nutrition-explainer.ts` ni el mapper (R12 los
  deja con diff vacío), ni `package.json`.
- No firmé la spec ni toqué `feature_list.json`.
- No corrí `graphify query` útil: este worktree no tenía `graph.json` al empezar; trabajé con
  lectura y grep directos.
