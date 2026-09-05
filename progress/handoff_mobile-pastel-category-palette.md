# Handoff a Codex CLI — #64 mobile-pastel-category-palette

> Preparado el 2026-09-05. **No se entrega hasta que el humano firme las cuatro
> casillas de `specs/mobile-pastel-category-palette/requirements.md`
> §Aprobación.** Sin esa firma, la spec sigue en `draft` y esto no se corre.

```
Feature: mobile-pastel-category-palette (#64), branch: feature/64-mobile-pastel-category-palette

Worktree: /home/claude/sites/Pet-Tracker-wt-ui — trabaja SOLO ahí. NO uses
/home/claude/sites/Pet-Tracker: es otro worktree con otra branch y hay una
sesión paralela activa sobre el backend.

Spec aprobada por humano (los cuatro archivos en status: approved):
  specs/mobile-pastel-category-palette/requirements.md   ← R1..R10 y el invariante
  specs/mobile-pastel-category-palette/design.md         ← valores, cálculos de contraste, inventario sitio a sitio
  specs/mobile-pastel-category-palette/tasks.md          ← qué hacer por R-id y las reglas de commit
  specs/mobile-pastel-category-palette/traceability.md   ← la actualizas tú tras cada commit

Léelos enteros antes de escribir nada. La spec es autosuficiente a propósito:
los diez valores hex, las diez ratios de contraste, las distancias CIEDE2000 y
el inventario sitio a sitio ya están calculados. No recalcules ni "mejores" un
valor: si un número no te cuadra, PARA y dilo en el reporte — no lo cambies.

Antes de la primera línea, carga las skills del plugin expo (obligatorio, carta
docs/ui-guidelines.md §Skills): expo-overview primero, luego expo-design-system.
De appllama tomas el PATRÓN, nunca su sistema de estilos.

Reglas críticas:
  - docs/ui-guidelines.md manda, y en particular su sección §Dirección de arte,
    que es la regla que gobierna esta feature. Gana sobre cualquier skill.
  - TDD POR REQUISITO, historial rojo→verde. Commit rojo con SOLO el test
    fallando que nombra su R-id, luego commit verde con la implementación
    mínima. 10 requisitos ⇒ al menos 20 commits. Un commit que mezcle test rojo
    con su implementación incumple C4 de CHECKPOINTS.md y el reviewer lo
    rechaza aunque la suite esté verde.
  - Corre `bun run test` en mobile-pet-tracker/ antes de cada commit. OJO: la
    orden literal `bun test` invoca el runner nativo de Bun y NO la suite del
    proyecto — es un error que ya se cometió en #62.
  - Al cerrar, corre ./init.sh ENTERO. Su BUILD_CMD incluye
    `pnpm -C infra run synth`, y `cdk synth` compila en local sin crear ningún
    recurso AWS: se ejecuta. Lo prohibido es `bootstrap` y `deploy`. En #62 se
    omitió el gate final con esa premisa falsa; aquí no.
  - Actualiza traceability.md tras cada commit: ninguna fila en "pendiente".

Invariante (requirements.md lo detalla):
  - Cero cambios de conducta, lógica, navegación ni texto visible. Ningún
    testID se renombra ni se elimina.
  - Ningún token existente cambia de valor: --accent, --radius-card, --warning,
    --danger y --success se quedan como están.
  - Los 3 usos de bg-accent-soft que significan CATEGORÍA cambian; los 17 que
    significan ACENTO no se tocan. La lista de los 17, sitio a sitio, está en
    design.md §5. Si tu diff toca uno de esos 17, el requisito está mal
    implementado.
  - Los emoji no se tocan: el color nunca es el único portador de la categoría
    (WCAG 1.4.1), siempre hay emoji y texto al lado.
  - Nada bajo backend-pet-tracker/ ni infra/.
  - Ningún .test.tsx/.test.ts preexistente se edita salvo para AÑADIR bloques
    describe('#64 R…'). La ÚNICA excepción declarada es la aserción de
    docs/index.test.tsx que fijó #62 R10, que R8 actualiza al par categórico:
    está autorizada por escrito en la spec y el humano la firmó.
  - La rejilla de accesos rápidos de la Home es la feature #71 y NO entra aquí.

Archivos a crear:
  mobile-pet-tracker/src/utils/category-palette.ts    (los huecos y el mapeo — design.md §4)

Archivos a modificar: mobile-pet-tracker/src/theme/global.css (los diez tokens
en los dos temas), src/utils/reminder-meta.ts, src/screens/reminders/index.tsx,
src/screens/docs/index.tsx y docs/ui-guidelines.md (R10, la tabla de huecos).
El detalle sitio a sitio está en design.md §4 y §5.

Criterios de aceptación: R1..R10 de requirements.md.

Al terminar: escribe el resultado en
progress/impl_mobile-pastel-category-palette.md (qué R-id cerró cada commit,
qué quedó abierto si algo quedó abierto, y el resultado de `bun run test` y de
./init.sh). No mandes el contenido por chat: el handoff es por disco.
```

## Lo que NO cierra Codex

- **Gate humano**: smoke en dev build de Android, en tema claro y oscuro, sobre
  Reminders y Documentos, comprobando que las categorías se distinguen y que
  ninguna queda ilegible. Casilla en `requirements.md` §Gate humano posterior.
- El riesgo declarado de la spec —azul y neutral claros a ΔE00 3,7— **solo se
  puede juzgar en pantalla real**. Es el punto al que hay que mirar.
