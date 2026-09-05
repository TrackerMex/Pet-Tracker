# Handoff a Codex CLI — #62 mobile-ui-consistency-polish

> Entregado al humano el 2026-09-04. Se corre en una terminal aparte, en el
> worktree `Pet-Tracker-wt-ui`. El `leader` no ve el output de Codex.

```
Feature: mobile-ui-consistency-polish (#62), branch: feature/62-mobile-ui-consistency-polish

Worktree: /home/claude/sites/Pet-Tracker-wt-ui — trabaja SOLO ahí. NO uses
/home/claude/sites/Pet-Tracker: es otro worktree con otra branch y hay una
sesión paralela activa sobre el backend.

Spec aprobada por humano el 2026-09-04 (los cuatro archivos en status: approved):
  specs/mobile-ui-consistency-polish/requirements.md   ← los 16 R-ids y el invariante duro
  specs/mobile-ui-consistency-polish/design.md         ← decisiones cerradas, inventario sitio a sitio, orden obligatorio (§10)
  specs/mobile-ui-consistency-polish/tasks.md          ← qué hacer por R-id y las reglas de commit
  specs/mobile-ui-consistency-polish/traceability.md   ← la actualizas tú tras cada commit

Léelos enteros antes de escribir nada. La spec es autosuficiente a propósito:
rutas exactas, números de línea, nombres de símbolos y el `describe` exacto de
cada test. No tienes acceso a la conversación que la originó, y no la
necesitas — si algo parece abierto, la respuesta está en design.md §2
(decisiones), §4 (inventario) o tasks.md §Reglas mecánicas.

Antes de la primera línea, carga las skills del plugin expo (obligatorio, carta
docs/ui-guidelines.md §Skills): expo-overview primero, luego expo-design-system
y expo-native-ui, más appllama-app-design-skill. De appllama tomas el PATRÓN,
nunca su sistema de estilos: prohibidos Color.ios.*, StyleSheet.create, hex
sueltos y clases arbitrarias [...].

Reglas críticas:
  - docs/architecture.md y docs/conventions.md rigen; para todo lo de
    mobile-pet-tracker/ manda docs/ui-guidelines.md, que gana sobre cualquier
    skill.
  - TDD POR REQUISITO, historial rojo→verde. Commit rojo con SOLO el test
    fallando que nombra su R-id, luego commit verde con la implementación
    mínima. 16 requisitos ⇒ al menos 32 commits. En la feature #19 se entregó
    todo en un commit único, sin historial, y eso incumplió C4 de
    CHECKPOINTS.md; el reviewer rechaza aunque la suite esté verde. Formato de
    mensaje en tasks.md §Reglas de commit.
  - Orden obligatorio: R1 → R2 → R3 → R4 → R5…R13 → R14 → R15 → R16
    (design.md §10). R1 fija la regla contra la que se miden R2-R4; R3 va
    antes que R14.
  - Corre `bun test` en mobile-pet-tracker/ antes de cada commit.
  - Actualiza specs/mobile-ui-consistency-polish/traceability.md tras cada
    commit: ninguna fila puede quedar en "pendiente".
  - No crees recursos AWS ni corras cdk: eso es del humano.

Invariante duro (requirements.md lo detalla; un requisito cumplido violándolo
NO está cumplido):
  - Cero cambios de conducta, lógica, navegación o contratos de API. Ningún
    useState, useEffect, llamada a api/, router.* ni handler cambia.
  - Ningún testID se renombra ni se elimina; ningún texto visible cambia.
  - Los diffs son de className, style/placeholderTextColor, el argumento de
    useThemeColors, glifo→componente de icono, y estructura visual de
    contenedores. Nada más.
  - mobile-pet-tracker/src/theme/global.css NO se toca en ningún requisito.
    Esta feature no añade ni cambia ningún token.
  - Nada bajo backend-pet-tracker/ ni infra/.
  - Ningún .test.tsx/.test.ts preexistente se edita, salvo para AÑADIR bloques
    describe('#62 R…').
  - Los 8 emoji de iconografía no se tocan (design.md §2 D6). Si el diff toca
    src/utils/reminder-meta.ts o el 📄 de src/screens/docs/index.tsx:18, el
    requisito está mal implementado.
  - El reset de estado de las pantallas de detalle es la feature #63 y no se
    arregla aquí, aunque edites add-reminder y pairing (solape en design.md §8).

Archivos a crear:
  mobile-pet-tracker/src/theme/native-styles.ts            (CONTINUOUS_CORNER, TABULAR_NUMS — design.md §2)
  mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts

Archivos a modificar: los enumerados sitio a sitio en design.md §4 y §6, más
docs/ui-guidelines.md (R1, con el texto exacto ya redactado en design.md §7 —
insértalo tal cual, no lo reescribas).

Criterios de aceptación: R1..R16 de requirements.md. R16 es el gate mecánico
del reviewer; los conteos anti-slop esperados están en design.md §5.

Al terminar: escribe el resultado en
progress/impl_mobile-ui-consistency-polish.md (qué R-id cerró cada commit, qué
quedó abierto si algo quedó abierto, y el resultado de `bun test`). No mandes
el contenido por chat: el handoff es por disco.
```

## Lo que NO cierra Codex

- **Gate humano (criterio de aceptación 8, no delegable a IA)**: smoke en dev
  build de Android, lado a lado con el Figma, en tema claro Y oscuro. Guion de
  14 puntos en `tasks.md` §Cierre.
- **R14 (`borderCurve`) no es verificable en ese smoke**: es no-op en Android.
  El humano lo firmó sabiéndolo; se verá en iOS (#60).
