# Handoff a Codex CLI — feature #46 mobile-figma-polish

> El humano copia el bloque de abajo como prompt de Codex CLI en su terminal.
> Claude (leader) no toca `mobile-pet-tracker/` mientras Codex implementa.

```
Feature: mobile-figma-polish, branch: feature/46-mobile-figma-polish (ya existe, trabaja ahí)
Spec aprobada: specs/mobile-figma-polish/requirements.md (status: approved)
Lee también: specs/mobile-figma-polish/design.md (mapeo de tokens y dark mode),
tasks.md, y la FUENTE DEL DISEÑO versionada en specs/mobile-figma-polish/design-src/
(App.tsx = pantallas y clases exactas del Figma Make; theme.css = tokens;
las líneas L### citadas en los R-ids refieren a ese App.tsx).
Contexto de la app actual: progress/explore_mobile-figma-polish.md.

INVARIANTE DE TODA LA FEATURE: cero cambios de conducta, lógica, navegación
o API. Ningún testID se renombra/elimina y ningún texto visible cambia.
Diffs de pantalla = solo className/estilo/estructura visual de contenedores.
Diff en __tests__/ = VACÍO salvo los tests nuevos de R1–R3.

Archivos a crear:
  - mobile-pet-tracker/assets/fonts/Inter-{Regular,Medium,SemiBold,Bold,Black}.ttf
    (descarga oficial: https://github.com/rsms/inter/releases — extrae los 5 estáticos)
  - mobile-pet-tracker/src/theme/__tests__/global-css.test.ts (R1/R2, TDD rojo primero)
  - test de R3 (fuentes registradas; ubícalo junto al layout raíz o en theme/__tests__)
Archivos a modificar (solo estilo):
  - mobile-pet-tracker/src/theme/global.css (R1 tokens light, R2 dark derivado — tabla en design.md)
  - mobile-pet-tracker/src/app/_layout.tsx (R3: expo-font con los 5 .ttf, sin bloquear arranque)
  - mobile-pet-tracker/src/components/floating-tab-bar.tsx (R4)
  - mobile-pet-tracker/src/components/weight-chart.tsx (R5)
  - mobile-pet-tracker/src/app/(tabs)/{home,map,health,weight-log,profile}.tsx (R6–R10)
  - mobile-pet-tracker/src/app/(auth)/{login,register,forgot}.tsx (R11)
  - specs/mobile-figma-polish/traceability.md

Reglas críticas:
  - Convenciones docs/conventions.md §app móvil (kebab-case, conventional commits,
    tests nombran su R-id). Capas de docs/architecture.md NO aplican (app móvil).
  - TDD SOLO en R1–R3 (testeables por lectura): test rojo commiteado ANTES que
    su implementación. R4–R11 son re-estilizado sin TDD nuevo — su gate es la
    suite existente verde SIN tocar asserts; aun así UN COMMIT POR REQUISITO
    (C4 de CHECKPOINTS.md se cumple con commits atómicos por R-id).
  - R4: la pill flotante SE CONSERVA (forma/posición/sombras/márgenes
    intactos) — decisión del humano en el gate. Solo re-tokenizar colores/label.
  - CERO dependencias nuevas. Inter = .ttf estáticos + expo-font (ya instalado).
    NADA de @expo-google-fonts ni expo-linear-gradient. El único gradiente
    permitido es el del weight-chart vía <LinearGradient> de react-native-svg (R5).
  - Dark mode (R2): valores derivados de design.md §Dark mode — PROHIBIDO
    copiar los oklch del bloque .dark de design-src/theme.css.
  - Posicionamiento absoluto y offsets numéricos por style inline; el resto
    className + tokens (lección #34, vigente).
  - PROHIBIDO tocar backend-pet-tracker/, infra/, init.config.sh, .github/,
    src/api/, hooks o providers. No crear recursos AWS.
  - design-src/ es REFERENCIA de solo lectura: no importar nada de ahí al
    código de la app, no copiar fotos de stock/Unsplash.

Criterios de aceptación: R1–R11 de requirements.md (R12 es suite completa
verde + smoke humano lado a lado contra el Make, no tuyo). Al final:
bun run typecheck, bun run lint y bun run test verdes en mobile-pet-tracker/
y ./init.sh exit 0.

Al terminar: escribir resultado en progress/impl_mobile-figma-polish.md
(comandos con exit codes, commits por R-id, desviaciones si las hubo) y
actualizar specs/mobile-figma-polish/traceability.md.
```
