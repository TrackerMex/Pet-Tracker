# Implementación #227 — mobile-reminders-upcoming-past

## Identidad y autorización

Ruta: `/home/claude/sites/Pet-Tracker-wt-227`.
Branch: `feature/227-mobile-reminders-upcoming-past`.
H0: `70987986`. Spec aprobada: `dc58b2de`.

Salida del comando de identidad exigido por el handoff:

```text
/home/claude/sites/Pet-Tracker-wt-227
feature/227-mobile-reminders-upcoming-past
73fe9ec6 docs(progress): #227 codex handoff
70987986 Merge remote-tracking branch 'origin/dev' into feature/227-mobile-reminders-upcoming-past
dc58b2de chore(spec): firma delegada #227 (mandato del humano 2026-10-23, ampliado 2026-11-03)
2c11e818 docs(spec): #227 mobile-reminders-upcoming-past
```

Nota: antes de leer el handoff se ejecutó `pwd && git status --short && cat progress/handoff_mobile-reminders-upcoming-past.md`; árbol limpio. El comando de identidad se ejecutó inmediatamente después de leerlo. No se ejecutará `./init.sh`, fetch, merge, rebase ni instalación. Sin edición de PR.

## T0 (2): anclas de Evidencia

Medidas con `grep -cF -- <literal> <ruta>`; cada cero es salida 1 de grep, sin error de lectura.

| Ruta | Literal | Esperado | Medido |
|---|---|---|---|
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `{reminders.data.reminders.map((reminder, i) => {` | 1 | 1 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `${inactive ? ' opacity-50' : ''}` | 1 | 1 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `${past ? ' opacity-50' : ''}` | 0 | 0 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `import { Plus, Repeat, Trash } from 'reicon-react-native';` | 1 | 1 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `import { ScrollView, Text, View } from 'react-native';` | 1 | 1 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `import { MOTION_REMINDERS_STAGGER_MS } from '../../theme/motion';` | 1 | 1 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `import { daysUntil } from '../../utils/reminder-dates';` | 1 | 1 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `<EmptyState` | 2 | 2 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `touch-target` | 0 | 0 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `style={CONTINUOUS_CORNER}` | 5 | 5 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `style={TABULAR_NUMS}` | 3 | 3 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `rounded-22` | 1 | 1 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `t('` | 46 | 46 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `className="gap-3"` | 2 | 2 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `tracking-caps` | 0 | 0 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `text-15` | 0 | 0 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `bg-default` | 1 | 1 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `hitSlop={TOUCH_SLOP}` | 0 | 0 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `delayMs={i * MOTION_REMINDERS_STAGGER_MS}` | 1 | 1 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `delayMs={index * MOTION_REMINDERS_PAST_STAGGER_MS}` | 0 | 0 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `splitReminders(` | 0 | 0 |
| `mobile-pet-tracker/src/theme/motion.ts` | `export const MOTION_REMINDERS_STAGGER_MS = 70;` | 1 | 1 |
| `mobile-pet-tracker/src/screens/home/format.ts` | `export function upcomingReminders` | 1 | 1 |
| `mobile-pet-tracker/src/screens/home/format.ts` | `.slice(0, 3)` | 1 | 1 |
| `mobile-pet-tracker/src/i18n/catalog.ts` | `'reminders.errorCancelForbidden': 'Only the owner can cancel the series',` | 1 | 1 |
| `mobile-pet-tracker/src/i18n/catalog.ts` | `'reminders.errorCancelForbidden': 'Solo el dueño puede cancelar la serie',` | 1 | 1 |
| `mobile-pet-tracker/src/screens/reminders/index.test.tsx` | `dueAt: '2026-08-27T09:00:00.000Z',` | 1 | 1 |
| `mobile-pet-tracker/src/screens/reminders/index.test.tsx` | `    Trash: mockIcon('reminders-icon-trash'),` | 1 | 1 |
| `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` | `export const R8_REMINDERS: UseRow[] = [` | 1 | 1 |
| `mobile-pet-tracker/src/../../specs/mobile-ui-language/design.md` | `### §2.39 — Añadidos por #225 — Orbit renombrado y su pose de actividad` | 1 | 1 |
| `mobile-pet-tracker/src/../../specs/mobile-ui-language/design.md` | `### §2.40` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosProximosPasados.dc.html` | `.sec{margin: 4px 0 0; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: var(--muted)}` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosPasadosExpandida.dc.html` | `.sec{margin: 4px 0 0; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: var(--muted)}` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosSinProximos.dc.html` | `.sec{margin: 4px 0 0; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: var(--muted)}` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosProximosPasados.dc.html` | `.tog{margin: 4px 0 0; padding: 0; border: 0; background: none; color: inherit; font: inherit; width: 100%; height: 40px; flex: none; display: flex; align-items: center; gap: 8px; text-align: left}` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosPasadosExpandida.dc.html` | `.tog{margin: 4px 0 0; padding: 0; border: 0; background: none; color: inherit; font: inherit; width: 100%; height: 40px; flex: none; display: flex; align-items: center; gap: 8px; text-align: left}` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosSinProximos.dc.html` | `.tog{margin: 4px 0 0; padding: 0; border: 0; background: none; color: inherit; font: inherit; width: 100%; height: 40px; flex: none; display: flex; align-items: center; gap: 8px; text-align: left}` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosProximosPasados.dc.html` | `.cnt{padding: 2px 8px; border-radius: 999px; background: var(--default); color: var(--muted); font-size: 12px; font-weight: 800}` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosPasadosExpandida.dc.html` | `.cnt{padding: 2px 8px; border-radius: 999px; background: var(--default); color: var(--muted); font-size: 12px; font-weight: 800}` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosSinProximos.dc.html` | `.cnt{padding: 2px 8px; border-radius: 999px; background: var(--default); color: var(--muted); font-size: 12px; font-weight: 800}` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosProximosPasados.dc.html` | `.chev{width: 32px; height: 32px; border-radius: 50%; background: var(--default); color: var(--muted); display: flex; align-items: center; justify-content: center}` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosPasadosExpandida.dc.html` | `.chev{width: 32px; height: 32px; border-radius: 50%; background: var(--default); color: var(--muted); display: flex; align-items: center; justify-content: center}` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosSinProximos.dc.html` | `.chev{width: 32px; height: 32px; border-radius: 50%; background: var(--default); color: var(--muted); display: flex; align-items: center; justify-content: center}` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosProximosPasados.dc.html` | `.past{opacity: .5}` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosPasadosExpandida.dc.html` | `.past{opacity: .5}` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosSinProximos.dc.html` | `.past{opacity: .5}` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosProximosPasados.dc.html` | `border-radius: 22px; background: var(--default); padding: 20px 16px; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosPasadosExpandida.dc.html` | `border-radius: 22px; background: var(--default); padding: 20px 16px; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosSinProximos.dc.html` | `border-radius: 22px; background: var(--default); padding: 20px 16px; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosProximosPasados.dc.html` | `<span style="font-size: 15px; font-weight: 800">Nada pendiente por ahora</span>` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosPasadosExpandida.dc.html` | `<span style="font-size: 15px; font-weight: 800">Nada pendiente por ahora</span>` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosSinProximos.dc.html` | `<span style="font-size: 15px; font-weight: 800">Nada pendiente por ahora</span>` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosProximosPasados.dc.html` | `<span style="font-size: 13px; color: var(--muted)">Los recordatorios nuevos aparecerán aquí.</span>` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosPasadosExpandida.dc.html` | `<span style="font-size: 13px; color: var(--muted)">Los recordatorios nuevos aparecerán aquí.</span>` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosSinProximos.dc.html` | `<span style="font-size: 13px; color: var(--muted)">Los recordatorios nuevos aparecerán aquí.</span>` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosProximosPasados.dc.html` | `<article class="card" style="animation-delay: 70ms">` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosPasadosExpandida.dc.html` | `<article class="card" style="animation-delay: 70ms">` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosSinProximos.dc.html` | `<article class="card" style="animation-delay: 70ms">` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosProximosPasados.dc.html` | `<article class="card" style="animation-delay: 140ms">` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosPasadosExpandida.dc.html` | `<article class="card" style="animation-delay: 140ms">` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosSinProximos.dc.html` | `<article class="card" style="animation-delay: 140ms">` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosProximosPasados.dc.html` | `<article class="card past">` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosPasadosExpandida.dc.html` | `<article class="card past">` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosSinProximos.dc.html` | `<article class="card past">` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosProximosPasados.dc.html` | `<article class="card past" style="animation-delay: 30ms">` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosPasadosExpandida.dc.html` | `<article class="card past" style="animation-delay: 30ms">` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosSinProximos.dc.html` | `<article class="card past" style="animation-delay: 30ms">` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosProximosPasados.dc.html` | `<article class="card past" style="animation-delay: 60ms">` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosPasadosExpandida.dc.html` | `<article class="card past" style="animation-delay: 60ms">` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosSinProximos.dc.html` | `<article class="card past" style="animation-delay: 60ms">` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosProximosPasados.dc.html` | `aria-expanded="false"` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosPasadosExpandida.dc.html` | `aria-expanded="false"` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosSinProximos.dc.html` | `aria-expanded="false"` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosProximosPasados.dc.html` | `aria-expanded="true"` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosPasadosExpandida.dc.html` | `aria-expanded="true"` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosSinProximos.dc.html` | `aria-expanded="true"` | 0 | 0 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosProximosPasados.dc.html` | `class="cnt">3<` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosPasadosExpandida.dc.html` | `class="cnt">3<` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosSinProximos.dc.html` | `class="cnt">3<` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosProximosPasados.dc.html` | `>Próximos<` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosPasadosExpandida.dc.html` | `>Próximos<` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosSinProximos.dc.html` | `>Próximos<` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosProximosPasados.dc.html` | `>Pasados<` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosPasadosExpandida.dc.html` | `>Pasados<` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosSinProximos.dc.html` | `>Pasados<` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosProximosPasados.dc.html` | `¡Próximo!` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosPasadosExpandida.dc.html` | `¡Próximo!` | 1 | 1 |
| `specs/mobile-reminders-upcoming-past/canvas/RecordatoriosSinProximos.dc.html` | `¡Próximo!` | 0 | 0 |

Todas las anclas de Evidencia coinciden.

## T0 (2): Tabla de enmiendas

| Ruta | Ancla previa | Esperado | Medido |
|---|---|---|---|
| `screens/reminders/index.test.tsx` | `renders summaries and reminder rows in API order` | 1 | 1 |
| `screens/reminders/index.test.tsx` | `distingue las recetas de fila próxima, lejana e inactiva` | 1 | 1 |
| `screens/reminders/index.test.tsx` | `ordena mosaico, columna y borrar con la anatomía exacta de cada fila` | 1 | 1 |
| `screens/reminders/index.test.tsx` | `da a cada mosaico su único icono, tamaño, superficie y tinta` | 1 | 1 |
| `screens/reminders/index.test.tsx` | `pinta tipo y título con sus tintas y pesos propios` | 1 | 1 |
| `screens/reminders/index.test.tsx` | `formatea la hora lejana y la meta inactiva con su estado` | 1 | 1 |
| `screens/reminders/index.test.tsx` | `sustituye los emoji de todas las filas por iconos` | 1 | 1 |
| `screens/reminders/index.test.tsx` | `asigna a cada entrada su índice en el orden del fixture` | 1 | 1 |
| `screens/reminders/index.test.tsx` | `envuelve cada fila en su propia entrada` | 1 | 1 |
| `screens/reminders/index.test.tsx` | `describe('#178 R8: sheet de borrado del canvas` | 1 | 1 |
| `screens/reminders/index.test.tsx` | `describe('#218 R1: el cajón de borrar pinta su contenedor con el token surface` | 1 | 1 |
| `screens/reminders/index.test.tsx` | `#204 R6: escalona las filas 0, 70 y 140 ms con RiseIn` | 1 | 1 |
| `screens/reminders/index.test.tsx` | `describe('#204 R8: Eliminar de la fila` | 1 | 1 |
| `screens/reminders/index.test.tsx` | `describe('#204 R9: Eliminar de la hoja` | 1 | 1 |
| `screens/reminders/index.test.tsx` | `shows a delete action for reminders in every status` | 1 | 1 |
| `screens/reminders/index.test.tsx` | `08:00 del 10 de septiembre: ayer a las 09:00 no es de esta semana ni próximo` | 1 | 1 |
| `screens/reminders/index.test.tsx` | `#213 R14: sin línea de repetición si no hay recurrencia o la serie no está programada` | 1 | 1 |
| `screens/reminders/index.test.tsx` | `#213 R15: una serie cancelada o enviada conserva Eliminar (%s)` | 1 | 1 |
| `screens/reminders/index.test.tsx` | `#213 R16: el badge Hoy y el borde ámbar solo marcan el día de hoy` | 1 | 1 |
| `providers/__tests__/language-provider.test.tsx` | `#194 R1: mantiene la base más las claves de #68` | 1 | 1 |
| `__tests__/ui-language.test.ts` | `#186 R5: resuelve las 113 ocurrencias normativas` | 1 | 1 |
| `__tests__/design-drift.test.ts` | `importa exactamente los iconos prescritos desde un único import de reicon` | 1 | 1 |
| `__tests__/design-drift.test.ts` | `reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto` | 1 | 1 |
| `__tests__/consistency-classnames.test.ts` | `%s importa y aplica sus %i esquinas` | 1 | 1 |
| `__tests__/consistency-classnames.test.ts` | `fusiona la esquina una vez y la entrega a las dos ramas de Card` | 1 | 1 |
| `__tests__/consistency-classnames.test.ts` | `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban` | 1 | 1 |
| `__tests__/consistency-classnames.test.ts` | `%s aplica TABULAR_NUMS a sus %i valores` | 1 | 1 |
| `__tests__/consistency-classnames.test.ts` | `#69 R10: mantiene la base cerrada más los deltas medidos` | 1 | 1 |
| `__tests__/alerts-canvas-fidelity.test.ts` | `limita $token a su inventario de producción` | 1 | 1 |
| `theme/__tests__/motion.test.ts` | `no exporta nada más` | 1 | 1 |
| `providers/__tests__/language-provider.test.tsx` | `+ 1, // #225 R1` | 1 | 1 |
| `__tests__/ui-language.test.ts` | `+ 57, // #213 R22` | 1 | 1 |
| `__tests__/design-drift.test.ts` | `'screens/reminders/index.tsx': ['Plus', 'Repeat', 'Trash'],` | 1 | 1 |
| `__tests__/design-drift.test.ts` | `[/\brounded-22\b/g, 1]` | 1 | 1 |
| `__tests__/consistency-classnames.test.ts` | `[join('screens', 'reminders', 'index.tsx'), 4 + 1], // #178 R6 fila sin Card` | 1 | 1 |
| `__tests__/consistency-classnames.test.ts` | `+ 3 // #215 R20` | 2 | 2 |
| `__tests__/consistency-classnames.test.ts` | `[join('screens', 'reminders', 'index.tsx'), 3],` | 1 | 1 |
| `__tests__/alerts-canvas-fidelity.test.ts` | `files: ['screens/alerts/index.tsx', 'screens/food/index.tsx', 'screens/health/index.tsx', 'screens/meal-schedule/index.tsx'],` | 1 | 1 |
| `theme/__tests__/motion.test.ts` | `'MOTION_REMINDERS_STAGGER_MS',` | 1 | 1 |

Todas coinciden.

## Skills y reglas consultadas

- `ponytail`: `/home/claude/.codex/plugins/cache/ponytail/ponytail/5.3.3/skills/ponytail/SKILL.md`.
- `building-native-ui`: `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md` (encontrada fuera del catálogo inicial).
- `appllama-app-design-skill`: `.agents/skills/appllama-app-design-skill/SKILL.md`.
- `animate-expo`: `.agents/skills/animate-expo/SKILL.md`, receta «List entrances».
- Arquitectura, convenciones, carta de UI, verificación TDD y C4 consultados. La carta prevalece: clases/tokens existentes; smoke Android G2 del humano; patrón ya fijado por la spec y Alertas.
- `mobile-pet-tracker/AGENTS.md` exige consultar [docs Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/): leído antes de escribir código.
- Movimiento: entrada ocasional al desplegar, propósito de indicar el cambio de estado; se reutiliza RiseIn (transform/opacity, UI thread, reduce motion existente). Solo cambia el escalonado fijado de 30 ms.

## Ejecución

T0 (1) omitido: preparado por el leader. T0 (2): 88 anclas de Evidencia y 39 de enmiendas verificadas sin discrepancias. T0 (3) en curso.

T0 (3) verde: 73 suites, 1842 tests, exit 0, 111.376 s. `●` totales: 2 (Console; cero fallos). Sin SIGKILL.

- `7fffbd60` — `test(mobile): icon doubles, relative default date and fixed clocks for reminders (T0)`. Verde: bunx jest src/screens/reminders, 127/127; sin enmiendas de cierre.

- `c5736b68` — `test(mobile): splitReminders splits by civil day and status (R2)`. Rojo: 9/9 casos nuevos fallan en expect(splitReminders).toEqual(expect.any(Function)), recibe undefined; no TypeError/import roto. 20 previos verdes.

- `c54e6d8f` — `feat(mobile): splitReminders splits by civil day and status (R2)`. Verde: 29/29 tests, partición con filter sin ordenar.

- `94bb456d` — `test(mobile): splitReminders orders upcoming ascending and past descending (R3)`. Rojo por aserción: upcoming recibido [u-b,u-c,u-a2,u-a], esperado [u-a,u-c,u-a2,u-b]; 29 previos verdes.

- `4065cc5f` — `feat(mobile): splitReminders orders upcoming ascending and past descending (R3)`. Verde: 30/30; fecha ascendente/descendente, empate por id ascendente y entrada sin mutar.

- `abf97b14` — `test(mobile): copy and canvas classes of reminders sections (R1, R11)`. Rojo: los 12 it nuevos fallan por aserción (claves undefined, literales de producción ausentes e inventario 5 frente a 6 esquinas); 2 it existentes importados de ui-copy-table verdes.

- `98b02bb3` — `test(mobile): upcoming heading and ascending list (R4)`. Rojo: cabecera reminders-upcoming-heading null tras esperar reminders-pills; 1 it nuevo falla por aserción.

- `cbd7a1f2` — `test(mobile): collapsed Past section with count and chevron (R5)`. Rojo: 2 it nuevos fallan por aserción de toggle y upcoming-list ausentes. expandPast literal entra aquí.

- `db2b9c12` — `test(mobile): Past header toggles and dims rows newest first (R6)`. Rojo: toggle null por aserción; aún no existe la sección desplegable.

- `08541523` — `test(mobile): opacity follows the section, the rest follows status (R7)`. Rojo: aserción de toggle presente recibe null. Las seis recetas, estado, Hoy y recurrencia quedan congeladas para la implementación.

- `83637841` — `test(mobile): row actions stay in their row in both sections (R12)`. Rojo: toggle ausente por aserción; acciones se comprobarán dentro de sus filas, dueño y family.

- `3ffb6b75` — `feat(mobile): reminders split into Upcoming and collapsed Past (R4, R5, R6, R7, R12)`. Pantalla verde: 133/133. Tanda amplia 74 suites: 1866 verdes, solo 6 rojos previstos (R1; R11 filas 7–10 e inventario). R11 filas 1–6 verdes. Cero rojos ajenos; ninguna enmienda adicional de Regla de cierre.

- `8ab788c5` — `test(mobile): empty upcoming box above Past (R8)`. Rojo por aserción: reminders-upcoming-empty null; el fixture solo tiene tres pasados.

- `e4db6d58` — `feat(mobile): empty upcoming box above Past (R8)`. R8 verde, 134 tests de pantalla. Tanda amplia: 1871 verdes, solo 2 rojos esperados (R11 paso de pasadas e inventario); R1 y R11 filas 8–10 verdes. Ningún rojo ajeno.

### R9: nace verde y sonda

Nace verde: D4 ya evalúa `reminders-empty` antes de la rama no vacía. `bunx jest src/screens/reminders`: 135/135 verdes antes de mutar.

Mutación temporal de producción: envolver la rama `reminders-empty` en fragmento y añadir `<Text testID="reminders-upcoming-heading">Próximos</Text>` antes de EmptyState. Orden desde `mobile-pet-tracker/`: `bunx jest src/screens/reminders > ../progress/r9_mutation_227.log 2>&1`.

Rojo: R9 falla en `expect(screen.queryByTestId('reminders-upcoming-heading')).toBeNull()`, recibe el Text inyectado. 2 rojos / 133 verdes: también cae el candado anterior de posición del vacío, por la misma mutación (detalle abajo). Sin fallo de import. Mutación no commiteada. Reversión exacta: `git checkout HEAD -- mobile-pet-tracker/src/screens/reminders/index.tsx`; `git diff --exit-code HEAD -- mobile-pet-tracker/src/screens/reminders/index.tsx` sale 0, sin diferencias.

  ● #155 R6: sin recordatorios, Pingo sostiene su lista › queda en el sitio del vacío que sustituye (enmendado por #204 R4)
  ● #227: próximos y pasados › #227 R9: sin recordatorios conserva el vacío sin secciones

- `96e183c5` — `test(mobile): empty list keeps EmptyState without sections (R9)`. Nace verde (D4). Sonda de producción roja descrita arriba, revertida sin diferencias; R9 otra vez verde tras revertir.

- `97bf13c6` — `test(mobile): past reminders rise with a 30 ms step (R10)`. Rojo: 2 it por aserción, constante undefined frente a 30 y retardos de pasados [0,70,140] frente a [0,30,60].

- `c4c60215` — `feat(mobile): past reminders rise with a 30 ms step (R10)`. Verde: 74 suites, 1876/1876 tests. R1 y todo R11 verdes como exige la tarea; no rojos ajenos.

- `e16a4e31` — `test(mobile): amended locks name their amendment (R13)`. Rojo: R13 falla por aserción de sufijo ausente en renders summaries…; 14 tests restantes verdes. AMENDED contiene las 30 filas prescritas; sin adicionales.

### Enmiendas aplicadas

Las 30 filas siguientes reciben su sufijo R13; contenido según la tabla aprobada. No apareció ningún it adicional que enmendar por Regla de cierre.

| Ruta desde src | Localizador tras la enmienda |
|---|---|
| `screens/reminders/index.test.tsx` | `renders summaries and reminder rows by section` |
| `screens/reminders/index.test.tsx` | `distingue las recetas de fila próxima, lejana e inactiva` |
| `screens/reminders/index.test.tsx` | `ordena mosaico, columna y borrar con la anatomía exacta de cada fila` |
| `screens/reminders/index.test.tsx` | `da a cada mosaico su único icono, tamaño, superficie y tinta` |
| `screens/reminders/index.test.tsx` | `pinta tipo y título con sus tintas y pesos propios` |
| `screens/reminders/index.test.tsx` | `formatea la hora lejana y la meta inactiva con su estado` |
| `screens/reminders/index.test.tsx` | `sustituye los emoji de todas las filas por iconos` |
| `screens/reminders/index.test.tsx` | `asigna a cada entrada su índice dentro de su sección` |
| `screens/reminders/index.test.tsx` | `envuelve cada fila en su propia entrada` |
| `screens/reminders/index.test.tsx` | `describe('#178 R8: sheet de borrado del canvas` |
| `screens/reminders/index.test.tsx` | `describe('#218 R1: el cajón de borrar pinta su contenedor con el token surface` |
| `screens/reminders/index.test.tsx` | `#204 R6: escalona las filas próximas cada 70 ms y la pasada desde 0` |
| `screens/reminders/index.test.tsx` | `describe('#204 R8: Eliminar de la fila` |
| `screens/reminders/index.test.tsx` | `describe('#204 R9: Eliminar de la hoja` |
| `screens/reminders/index.test.tsx` | `shows a delete action for reminders in every status` |
| `screens/reminders/index.test.tsx` | `08:00 del 10 de septiembre: ayer a las 09:00 no es de esta semana ni próximo` |
| `screens/reminders/index.test.tsx` | `#213 R14: sin línea de repetición si no hay recurrencia o la serie no está programada` |
| `screens/reminders/index.test.tsx` | `#213 R15: una serie cancelada o enviada conserva Eliminar (%s)` |
| `screens/reminders/index.test.tsx` | `#213 R16: el badge Hoy y el borde ámbar solo marcan el día de hoy` |
| `providers/__tests__/language-provider.test.tsx` | `#194 R1: mantiene la base más las claves de #68` |
| `__tests__/ui-language.test.ts` | `#186 R5: resuelve las 113 ocurrencias normativas` |
| `__tests__/design-drift.test.ts` | `importa exactamente los iconos prescritos desde un único import de reicon` |
| `__tests__/design-drift.test.ts` | `reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto` |
| `__tests__/consistency-classnames.test.ts` | `%s importa y aplica sus %i esquinas` |
| `__tests__/consistency-classnames.test.ts` | `fusiona la esquina una vez y la entrega a las dos ramas de Card` |
| `__tests__/consistency-classnames.test.ts` | `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban` |
| `__tests__/consistency-classnames.test.ts` | `%s aplica TABULAR_NUMS a sus %i valores` |
| `__tests__/consistency-classnames.test.ts` | `#69 R10: mantiene la base cerrada más los deltas medidos` |
| `__tests__/alerts-canvas-fidelity.test.ts` | `limita $token a su inventario de producción` |
| `theme/__tests__/motion.test.ts` | `no exporta nada más` |

- `6d4ad407` — `test(mobile): suffix amended locks with #227 R13 (R13)`. Verde final R13 (3): 74 suites y 1877/1877 tests; solo cambian los 30 títulos.

## Inventario final de la pantalla

| Literal | Esperado | Medido con grep -cF |
|---|---|---|
| `{reminders.data.reminders.map((reminder, i) => {` | 0 | 0 |
| `${inactive ? ' opacity-50' : ''}` | 0 | 0 |
| `${past ? ' opacity-50' : ''}` | 1 | 1 |
| `import { Plus, Repeat, Trash } from 'reicon-react-native';` | 0 | 0 |
| `import { ScrollView, Text, View } from 'react-native';` | 0 | 0 |
| `import { MOTION_REMINDERS_STAGGER_MS } from '../../theme/motion';` | 0 | 0 |
| `import { daysUntil } from '../../utils/reminder-dates';` | 0 | 0 |
| `<EmptyState` | 2 | 2 |
| `touch-target` | 1 | 1 |
| `style={CONTINUOUS_CORNER}` | 6 | 6 |
| `style={TABULAR_NUMS}` | 4 | 4 |
| `rounded-22` | 2 | 2 |
| `t('` | 50 | 50 |
| `className="gap-3"` | 4 | 4 |
| `tracking-caps` | 2 | 2 |
| `text-15` | 1 | 1 |
| `bg-default` | 4 | 4 |
| `hitSlop={TOUCH_SLOP}` | 1 | 1 |
| `delayMs={i * MOTION_REMINDERS_STAGGER_MS}` | 1 | 1 |
| `delayMs={index * MOTION_REMINDERS_PAST_STAGGER_MS}` | 1 | 1 |
| `splitReminders(` | 1 | 1 |

Las 21 anclas finales coinciden.

Revisión del diff contra H0: cuerpo de renderRow idéntico al de la fila anterior salvo opacidad y whitespace (comparación normalizada). Los 16 archivos del trabajo están dentro de la lista cerrada. Las 21 anclas finales coinciden. TypeScript: router.d.ts ausente antes del comando, exit 0 y log de 0 bytes.

## Verificación final

| Comprobación | Orden (desde mobile-pet-tracker/) | Resultado |
|---|---|---|
| T0 | `bun run jest src/screens/reminders src/utils src/theme src/__tests__ src/providers` | 73 suites; 1842/1842 tests; exit 0; 111.376 s |
| R13 (3) | `bunx jest src/screens/reminders src/utils src/theme src/__tests__ src/providers` | 74 suites; 1877/1877 tests; exit 0; 24.037 s |
| Guardas | `bunx jest src/__tests__ src/app/__tests__ src/components/__tests__` | 80 suites; 1658/1658 tests; 1/1 snapshot; exit 0; 92.336 s |
| Tipos | `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > ../progress/tsc_227.log 2>&1; echo $?` | router.d.ts ausente; salida 0; log de 0 bytes |
| Lint | `bunx expo lint --no-cache > ../progress/lint_227.log 2>&1 && test ! -s ../progress/lint_227.log && echo LINT_OK` | exit 0; LINT_OK; log de 0 bytes |

Nota de orden exacta: la tanda final se ejecutó mediante `bunx jest` (mismo ejecutable local) con los cinco prefijos anteriores y redirección a `../progress/final_mobile-reminders-upcoming-past.log`; T0 sí usó `bun run jest` como en tasks.md.

- `t0_mobile-reminders-upcoming-past.log`: 2 símbolos `●`; todos corresponden a Console, cero fallos. Sin SIGKILL.
- `final_mobile-reminders-upcoming-past.log`: 2 símbolos `●`; todos corresponden a Console, cero fallos. Sin SIGKILL.
- `guards_227.log`: 20 símbolos `●`; todos corresponden a Console, cero fallos. Sin SIGKILL.

No se necesitaron reintentos por timeout ni flakes conocidos. Ninguna prueba nueva nació verde salvo R9, cuya razón y sonda se documentan arriba. Los dos it que aparecen al importar ui-copy-table ya existían y siguieron verdes.

No hubo enmiendas adicionales por Regla de cierre. No se ejecutó `./init.sh` ni la suite móvil completa del leader; no se ejecutó smoke en dispositivo. La casilla G2 sigue sin tocarse. Feature/status/progress general no se modificaron por la lista cerrada del handoff. Sin dependencias nuevas, sin fetch/merge/rebase/install, sin PR.

## Incidencias y límites

Ningún PARA. Se conserva documentada la lectura inicial anterior al comando de identidad. Una consulta inicial con `python` no estaba disponible; las comprobaciones se ejecutaron con `python3`, sin tocar el entorno. No hubo denegaciones de sandbox. Una aserción auxiliar de auditoría se estrechó para distinguir estados de trazabilidad sin resolver del literal de copy «Nada pendiente…»; el documento no cambió su copy.

El reporte se entrega como artefacto local de progress (fuera del commit documental), para registrar también el hash del commit 20. El marcador .done no se commitea.

- `a86ff399` — `docs(spec): #227 traceability`. Trazabilidad R1–R13 con hashes 1–19, guardas verdes antes de este commit; sin rebase posterior.

## Cierre

HEAD final: `a86ff3994c31f84226978b25fea094619269258d` (`docs(spec): #227 traceability`), commit 20. Branch `feature/227-mobile-reminders-upcoming-past` subida a origin con éxito (exit 0), upstream coincide con HEAD. No se abrió ni editó PR: corresponde al leader.

`git status --short -- mobile-pet-tracker specs`: vacío. `git diff --check`: exit 0. 20 commits exactos tras el handoff. Sin rebase. Logs temporales de Jest, tsc y lint eliminados (11). Reporte local conservado; marcador .done sin commitear. No hubo PARA.
