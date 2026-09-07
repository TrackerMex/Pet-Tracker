---
feature: "mobile-home-weekly-activity"
status: spec_ready     # draft | spec_ready | approved
tags: [harness, spec]
---

# Tareas — [[mobile-home-weekly-activity]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Orden obligatorio**: R1 → R2 → R3 → R4 → R4b → R5 → R6 → R7 (el componente,
> aislado) → R8 → R8b (la Home lo adopta) → R9 → R10. Nada de `home.tsx` antes
> de que el componente esté verde solo: si se toca la pantalla primero, el rojo
> del componente se mezcla con el del montaje y deja de demostrar nada. R9 va
> **después** de R8 a propósito: los deltas de los candados de copy solo se
> pueden medir cuando ya existen todas las llamadas a `t()`.
>
> **Commits test-primero, obligatorio** (`CHECKPOINTS.md` C4). Cada requisito
> deja **al menos dos commits**: uno con el test rojo y otro con la
> implementación que lo pone verde. Un único commit con test + implementación +
> docs incumple C4 y el reviewer lo rechaza; ya pasó en #19. El mensaje sigue
> `docs/conventions.md` §Commits:
> `feat(mobile-home-weekly-activity): <desc> (R2)`.
>
> **Ningún rojo puede fallar por `ReferenceError`** de un helper de test que
> todavía no existe (C4). `src/components/__tests__/weekly-activity-chart.test.tsx`
> se crea con sus mocks y sus factorías completos desde el primer commit; lo que
> falta es el componente, no el andamio.
>
> **Antes de tocar nada**:
> - Carga las skills: `expo:expo-overview` → `expo:expo-native-ui` y
>   `expo:expo-design-system`, más `appllama-app-design-skill`. Obligatorio en
>   trabajo móvil (carta §Skills). La carta gana sobre la skill en todo conflicto.
> - Borra `mobile-pet-tracker/.expo/types/router.d.ts` si existe: está
>   gitignorado y rompe el typecheck con rutas fantasma.
> - Comprueba que no hay otro `init.sh` corriendo en un worktree hermano
>   (`pgrep -f init.sh`): comparten el Postgres de docker y se pisan.
> - Trabaja en `feature/68-mobile-home-weekly-activity`. Nunca en `main`.

---

## Andamio común del fichero de tests del componente

Se escribe **una vez**, en el primer commit rojo (R1), y no vuelve a tocarse:

```ts
import { render, screen } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';

import type { DayEntry, WeekComparison } from '../../api/types';
import { LanguageProvider } from '../../providers/language-provider';
import {
  WeeklyActivityChart,
  WEEKLY_BAR_MIN_HEIGHT,
  WEEKLY_CHART_HEIGHT,
  weekdayLabel,
} from '../weekly-activity-chart';

function makeDay(overrides: Partial<DayEntry> = {}): DayEntry { /* como el de home.test.tsx:89-103 */ }
function makeWeek(from: string, minutes: (number | null)[]): DayEntry[] { /* fechas consecutivas desde `from` */ }
const NO_COMPARISON: WeekComparison = { distanceM: null, activeMinutes: null, walkCount: null };
function renderChart(days: DayEntry[], weekComparison: WeekComparison = NO_COMPARISON, language: 'es' | 'en' = 'es') { /* envuelve en LanguageProvider + HeroUINativeProvider */ }
```

`makeWeek` genera fechas consecutivas **a partir de la cadena**, con la misma
descomposición por componentes que exige R4: si el helper de test parseara con
`new Date(cadena)`, arrastraría el mismo bug que el test persigue.

---

## R1 — El componente existe con su API exacta y no habla con la red

- [ ] (1) Escribir test que falla para R1 —
      `src/components/__tests__/weekly-activity-chart.test.tsx`,
      `describe('R1: WeeklyActivityChart recibe los días y no habla con la red')`:
      monta con siete días medidos y espera `testID="weekly-activity-card"`;
      y lee el fuente del componente (`readFileSync`, como
      `consistency-classnames.test.ts`) para asertar que **no** contiene
      `from '../api/activity'`, ni `use-api`, ni `fetch(`, y que su única
      importación de `../api/types` es `import type`.
- [ ] (2) Implementación mínima que lo pasa — crear
      `src/components/weekly-activity-chart.tsx` con la firma de R1, las tres
      constantes exportadas, la `Card` compartida y la cabecera
      (título `text-base font-bold text-foreground`, subtítulo a la derecha).
- [ ] (3) Refactor con tests verdes.

## R2 — Una columna por día, en orden, con altura proporcional

- [ ] (1) Escribir test que falla para R2 —
      `describe('R2: cada día del array es una columna y su altura es proporcional')`:
      con `makeWeek('2026-09-02', [0, 30, 60, 15, 45, 60, 20])` espera siete
      `weekly-activity-day-<fecha>` en el orden del array; que la barra de 60
      mide `WEEKLY_CHART_HEIGHT`; que la de 30 mide la mitad redondeada; y que
      con los siete a 0 todas miden `WEEKLY_BAR_MIN_HEIGHT` (no `NaN`, no 0).
- [ ] (2) Implementación mínima que lo pasa — la fila de columnas
      (`flex-row items-end justify-between`, alto `WEEKLY_CHART_HEIGHT`), la
      barra `w-6 rounded-full` con `backgroundColor` de
      `useThemeColors(['accent-strong'])` y la altura por `style`.
- [ ] (3) Refactor con tests verdes.

## R3 — "Sin dato" y "cero confirmado" no se confunden

- [ ] (1) Escribir test que falla para R3 —
      `describe('R3: un día sin dato no es una barra de altura cero')`: una
      semana con un día `{ source: 'missing', activeMinutes: null }` y otro
      `{ source: 'stored', activeMinutes: 0 }`; espera
      `weekly-activity-missing-<fecha del missing>` presente y
      `weekly-activity-bar-<esa fecha>` **ausente**; y a la inversa para el día
      de cero, cuya barra existe y mide `WEEKLY_BAR_MIN_HEIGHT`. Un `it` más
      con `{ source: 'stored', activeMinutes: null }` —combinación que el
      backend no produce hoy pero que el tipo permite— comprueba que se pinta
      **barra**, no guion: es lo que fija `source` como discriminante.
- [ ] (2) Implementación mínima que lo pasa — la rama por `day.source` y el
      glifo `'—'` en `text-2xs font-normal text-muted`.
- [ ] (3) Refactor con tests verdes.

## R4 / R4b — La letra del eje sale de la fecha y sobrevive a la zona horaria

- [ ] (1) Escribir test que falla para R4 —
      `describe('R4: la letra del eje sale de la fecha, no del índice')`, dos `it`:
      - `it('usa el día real de cada fecha en los dos idiomas')`: rango
        `2026-09-02 … 2026-09-08` (miércoles a martes: **no** empieza en lunes y
        **cruza el fin de semana**); espera
        `['mié','jue','vie','sáb','dom','lun','mar']` con `language='es'` y
        `['Wed','Thu','Fri','Sat','Sun','Mon','Tue']` con `language='en'`.
        Una implementación por índice devolvería siempre la misma secuencia
        empezando en lunes y muere aquí.
      - `it('no se desplaza un día en una zona horaria negativa')`: guarda
        `process.env.TZ`, lo pone a `'America/Mexico_City'`, llama a
        `weekdayLabel('2026-09-06', 'es-MX', 'short')`, espera `'dom'`, y
        restaura la variable en un `finally`. Con `new Date('2026-09-06')`
        devuelve `'sáb'` — comprobado en Node 20.
- [ ] (2) Implementación mínima que lo pasa — `weekdayLabel` con
      `const [year, month, day] = date.split('-').map(Number)` y
      `new Date(year, month - 1, day).toLocaleDateString(locale, { weekday: style })`;
      la etiqueta bajo cada barra en `text-2xs font-semibold text-muted`.
- [ ] (3) Refactor con tests verdes.

## R5 — Cada columna se anuncia por separado

- [ ] (1) Escribir test que falla para R5 —
      `describe('R5: cada columna se anuncia por separado')`: espera que la
      columna de un día de 45 minutos tenga `accessibilityLabel`
      `'sábado: 45 minutos activos'` en `es` y `'Saturday: 45 active minutes'`
      en `en`; que la del día `missing` tenga `'domingo: sin datos'`; y que el
      contenedor de las siete columnas **no** tenga `accessibilityLabel`.
- [ ] (2) Implementación mínima que lo pasa — `accessible` y
      `accessibilityLabel` en la `View` de columna, resueltos con `t()` y
      `weekdayLabel(..., 'long')`.
- [ ] (3) Refactor con tests verdes.

## R6 — La tendencia sale de `weekComparison` y se calla sin base

- [ ] (1) Escribir test que falla para R6 —
      `describe('R6: la tendencia sale de weekComparison y se calla sin base')`,
      cuatro `it`: `activeMinutes: 12.5` pinta `weekly-activity-trend` con
      `'+12,5'` en el texto (`es-MX`) y el icono `TrendUp`; `-8.3` pinta
      `TrendDown`; `0` pinta la fila sin icono; `null` **no** pinta la fila
      (`queryByTestId` devuelve `null`). Un `it` más comprueba que el `Text` del
      porcentaje lleva `style={TABULAR_NUMS}` y que la fila no usa
      `text-success` ni `text-danger`.
- [ ] (2) Implementación mínima que lo pasa — la fila con `TrendUp`/`TrendDown`
      de `reicon-react-native`, color de `useThemeColors(['muted'])`,
      `Intl.NumberFormat(locale, { signDisplay: 'exceptZero', maximumFractionDigits: 1 })`
      y `TABULAR_NUMS`.
- [ ] (3) Refactor con tests verdes.

## R7 — La semana entera sin dato es un mensaje

- [ ] (1) Escribir test que falla para R7 —
      `describe('R7: la semana entera sin dato se resuelve con un mensaje')`:
      siete días `missing` ⇒ `weekly-activity-empty` presente y ningún
      `weekly-activity-day-*`; `days: []` ⇒ igual; y con **un** día medido y
      seis `missing` ⇒ las siete columnas presentes y `weekly-activity-empty`
      ausente. En los tres casos la cabecera sigue.
- [ ] (2) Implementación mínima que lo pasa — la rama de vacío con el `Text` de
      `weeklyActivity.noDataYet`.
- [ ] (3) Refactor con tests verdes.

## R8 / R8b — La Home la monta, en su sitio, sin pedir nada nuevo

- [ ] (1) Escribir test que falla para R8 —
      `src/app/(tabs)/__tests__/home.test.tsx`,
      `describe('R8: la Home monta la actividad semanal sin pedir nada nuevo')`,
      cuatro `it`: la tarjeta aparece con los siete días del mock; el orden de
      hijos de `home-content` es `summary-card` → `weekly-activity-card` →
      `last-position-card` (leído del árbol, no del texto);
      `mockGetDailyActivity` se llama el mismo número de veces que en el
      escenario equivalente ya existente; y (R8b) con `getDailyActivity`
      pendiente aparece `weekly-activity-skeleton` y con `kind: 'error'` no
      aparece ni la tarjeta ni el skeleton, mientras `summary-note` sí.
- [ ] (2) Implementación mínima que lo pasa — el `import` y el bloque en
      `home.tsx` entre `summary-card` y `last-position-card`. **Solo eso**: no
      se toca `today`, ni `summary-card`, ni `collar-card`, ni el hero, ni el
      `contentContainerStyle`.
- [ ] (3) Refactor con tests verdes.

## R9 — Copy en los dos idiomas, registrada donde toca

- [ ] (1) Escribir test que falla para R9 — añadir las **seis filas** de
      `src/components/weekly-activity-chart.tsx` al bloque `R3_HOME` de
      `src/__tests__/ui-copy-table.ts` y subir su `toHaveLength` y el de
      `SCREEN_FILES` por el delta de [[requirements]] R10b. Con el catálogo
      todavía sin las claves, el fichero **no compila** (`TranslationKey` no las
      conoce): ese es el rojo, y es el candado preexistente de #65 haciendo su
      trabajo.
- [ ] (2) Implementación mínima que lo pasa — las seis claves en `en` y en `es`
      de la tabla de [[requirements]] R9, con los valores exactos, y el registro
      en `specs/mobile-ui-language/design.md` §2.
- [ ] (3) Refactor con tests verdes.

## R10 — Verificación, deltas y prueba de mutación

- [ ] (1) Actualizar el candado de `#62 R15` en
      `src/__tests__/consistency-classnames.test.ts`: fila nueva
      `[join('components', 'weekly-activity-chart.tsx'), 1]` y el inventario
      cerrado **+1**. Comprobar con `grep` que `#62 R14` (33) y `#61 R4` (13)
      **no** se mueven; si alguno se mueve, hay un `CONTINUOUS_CORNER` o un
      `text-accent-strong` que la spec no previó: **para y repórtalo**, no lo
      absorbas subiendo el número.
- [ ] (2) Suite completa verde: `bun run test` desde `mobile-pet-tracker/`, con
      `design-drift.test.ts`, `consistency-classnames.test.ts`,
      `legibility-classnames.test.ts`, `global-css.test.ts` y
      `ui-language.test.ts` incluidos. Ningún assert de conducta debilitado,
      ningún `testID` renombrado.
- [ ] (3) **Prueba de mutación** — plantar las cuatro, de una en una, correr la
      suite, comprobar que se pone **roja**, revertir, y dejar la evidencia
      (mutación, test que la mata, salida) en
      `progress/impl_mobile-home-weekly-activity.md` §prueba de mutación:

      | # | Mutación en `src/components/weekly-activity-chart.tsx` | Debe matarla |
      |---|---|---|
      | 1 | la etiqueta del eje pasa a salir del índice (`['lun','mar',…][index]`) | R4 `it` de los dos idiomas |
      | 2 | `new Date(year, month - 1, day)` → `new Date(date)` | R4 `it` de TZ, y **solo** ése |
      | 3 | la rama `missing` pasa a pintar una barra de altura 0 | R3 |
      | 4 | desaparece el `accessibilityLabel` de la columna `missing` | R5 |

      La 2 es la importante: en un runner en UTC pasa toda la suite. Si al
      plantarla la suite sigue verde, el `it` de TZ está mal escrito y hay que
      arreglarlo **antes** de seguir — es exactamente el fallo que se coló en #65.

---

## Cierre

- [ ] Trazabilidad completa: [[traceability]] sin ninguna fila "pendiente".
- [ ] `progress/impl_mobile-home-weekly-activity.md` escrito, con los deltas
      medidos por `grep` (no copiados de esta spec) y la prueba de mutación.
- [ ] PR abierto con `gh pr create` desde
      `feature/68-mobile-home-weekly-activity`. **No se mergea**: lo hace el humano.
- [ ] **Gate humano, no delegable a IA**: smoke en dev build de Android, tema
      claro y oscuro, con una mascota que tenga al menos un día sin dato y al
      menos un día de cero minutos. Guion en [[requirements]] §Aprobación.
