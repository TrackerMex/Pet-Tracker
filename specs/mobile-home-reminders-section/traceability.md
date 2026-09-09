---
feature: "mobile-home-reminders-section"
status: approved       # draft | spec_ready | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-home-reminders-section]]

Rutas relativas a `mobile-pet-tracker/`. La columna **Test** la **prescribe la
spec** (no la improvisa el implementer): es el contrato de qué prueba cada R-id.
La columna **Commit** la rellena el implementer en cuanto ese requisito queda
verde, nunca al final.

Tres abreviaturas para no repetir rutas largas:
`HOME` = `src/screens/home/index.test.tsx`;
`SEC` = `HOME`::`describe('#70 R1: la Home dibuja la sección de recordatorios')`;
`FMT` = `src/screens/home/format.test.ts`.

| Requisito | Test (archivo::nombre) — prescrito por la spec | Commit (hash + mensaje) |
|---|---|---|
| R1 | `SEC`::`it('dibuja la cabecera y el cuerpo de la sección')` (dos hijos directos de `reminders-section`, rótulo con su receta, enlace presente) + `SEC`::`it('deja el cuerpo con un solo hijo')`, que cuenta **`getByTestId('reminders-section-body').children`** —nunca coincidencias de `testID`— y espera `1` cargado, `1` con esqueleto y `0` en error. Es el candado que mata M5 | pendiente |
| R2 | `SEC`::`it('tipa nextVaccine con los tres campos del contrato y ninguno más')`, lectura de `src/api/types.ts`: `id`/`name`/`nextDoseAt` presentes, `daysLeft` y `date` ausentes, `nextReminder` y `activitySummary` **todavía `unknown`**; más `tsc --noEmit` de R19, que es lo que prueba que el tipo compila contra el uso de R6. **Candado de cadena literal**, declarado como tal en [[requirements]] R17 | `df759b8 feat(mobile-home-reminders-section): type next vaccine contract (R2)` |
| R3 | `SEC`::`it('no dibuja la barra de comidas ni pide el plan de nutrición')`: un solo hijo directo en el cuerpo con el perfil cargado, ningún nodo con texto de la forma `n/m` dentro de la sección, y ningún import de `../../api/nutrition`. Se cierra con la mutación **M5** —segundo hijo **sin `testID`**— versionada en el rojo | pendiente |
| R4 | `FMT`::`describe('#70 R4: calendarDaysUntil cuenta días de calendario')`::`it('cuenta futuro, mañana, hoy y pasado')`: `'2026-09-15'`→`5`, `'2026-09-11'`→`1`, `'2026-09-10'`→`0`, `'2026-09-08'`→`-2`, todos desde `new Date(2026, 8, 10, 12, 0)` | `3badfec feat(mobile-home-reminders-section): count normalized calendar days (R4)` |
| R5 | `FMT`:: mismo `describe` → `it('no se desplaza un día en una zona horaria negativa')`, que fija `process.env.TZ = 'America/Mexico_City'`, asserta `calendarDaysUntil('2026-09-15', new Date(2026, 8, 10, 23, 30))` → `5` **y** con `0, 30` → `5`, y restaura en `finally`; más `it('formatea la fecha visible sin desplazarla')` (`fmtDate('2026-09-15','es-MX')` contiene `'15'`, no `'14'`). **Son los únicos candados que matan M1 y M2**: si con ellas plantadas la suite sigue verde, están mal escritos y se arreglan antes de seguir. Patrón heredado de #68 R4 | pendiente |
| R6 | `SEC`::`it('liga nombre, fecha y contador a su nodo y a ninguno más')`, con `within(getByTestId('reminders-next-vaccine'))` sobre la fixture `{ id: 'vac-9', name: 'Antirrábica', nextDoseAt: '2026-09-15' }` y el reloj en el `2026-09-10`: los tres `testID` con su texto exacto, ninguno con el texto de otro, y `'vac-9'` ausente del árbol. **El dato que muestra es la dimensión que más se olvida** (lección de #69). Más `SEC`::`it('no hace pulsable la fila de la vacuna')` | pendiente |
| R7 | `SEC`::`it('resuelve las tres ramas del contador')`, tres renders con `jest.setSystemTime`: `5 d`/`Faltan 5 días`, `Hoy`, `Vencida`; y en ninguna el texto del contador contiene `'-'` | pendiente |
| R8 | `SEC`::`it('dibuja un estado vacío con forma de fila cuando no hay vacuna')`: `reminders-none-upcoming` con su texto, `reminders-next-vaccine` y los tres `testID` de R6 ausentes, rótulo y enlace presentes | pendiente |
| R9 | `SEC`::`it('esqueletiza mientras carga y calla cuando el perfil falla')`: esqueleto con su `className` en `pending()`, cuerpo con **cero** hijos en `{ kind: 'error' }`, ningún `testID` de sección terminado en `-error` o `-retry`, y `reminders-see-all` presente en los dos escenarios | pendiente |
| R10 | `SEC`::`it('lleva a la lista de recordatorios existente')` (`mockRouter.push` **una vez** con `'/reminders'`, cruzado con los ficheros reales de `src/app/(tabs)/` vía el helper `appRoutes`, `HOME:42-57`) + `SEC`::`it('no añade un segundo camino a la lista desde la Home')` (`'/reminders'` **una sola vez** en el fuente; sin `as Href`; sin import de `Href`). El candado de #71 (`HOME:1601-1612`, que prohíbe `'/reminders'` dentro de `QUICK_ACTIONS`) queda **verde y sin tocar** | pendiente |
| R11 | `SEC`::`it('anuncia el enlace como botón y expande la abreviatura del contador')`: `accessibilityRole` `'button'` solo en `reminders-see-all`, `accessibilityLabel` del contador en las tres ramas, y ni `reminders-section` ni `reminders-section-body` con `accessible` o `accessibilityLabel`. Candado sobre código correcto → rojo por **mutación de producción** (quitar el `accessibilityLabel`), nunca por mock | pendiente |
| R12 | `SEC`::`it('viste la sección con el Card compartido y los tokens')`: `className` del contador (fondo y tinta categóricos resueltos), `className` del disco, `TABULAR_NUMS` en el contador y ausente en nombre y fecha. Más, **en verde y sin tocar**, `consistency-classnames.test.ts` #64 R9 (`:404`, `:430`), #62 R4 (`:150-155`) y #62 R1 (`:97-104`); y los deltas declarados de #62 R15 y #61 R4 (R18). Se cierra con **M8** | pendiente |
| R13 | `SEC`::`it('usa el icono de reicon y ningún emoji')`, lectura de fuente: import de `Syringe`, dos usos con `size={20}`, ausencia de `💉`. La entrada `Syringe: mockIcon('icon-syringe')` del doble (`HOME:82-102`) es **preparación de test y no cuenta como rojo**; no renombra ni elimina ninguna de las seis existentes. **Candado de cadena literal**, declarado como tal en [[requirements]] R17 | pendiente |
| R14 | `SEC`::`it('coloca la sección entre la actividad semanal y la última posición')`, que filtra los hijos de `home-content` a la lista blanca de **seis** y espera `['summary-card','collar-card','quick-actions','weekly-activity-card','reminders-section','last-position-card']` + `SEC`::`it('no dibuja la sección sin mascota seleccionada')` + los tres candados de orden heredados, `HOME:1205-1235` (#68), `HOME:1401-1438` (#69) y `HOME:1760-1798` (#71), **en verde y sin tocar**. Se cierra con **M7** | pendiente |
| R15 | `SEC`::`it('no añade ninguna llamada a la API')`, que compara el recuento de `mockGetPet`, `mockGetDailyActivity` y `mockListPets` con el escenario equivalente. Verificación adicional del reviewer: `git diff --stat` sin ficheros fuera de `mobile-pet-tracker/`, `specs/` y `progress/`, y en particular **cero** en `backend-pet-tracker/`, `src/utils/reminder-dates.ts`, `src/components/`, `src/theme/` y `src/app/` | pendiente |
| R16 | `src/__tests__/ui-language.test.ts` (candados de #65: una clave presente en un idioma y ausente en el otro no compila, `:347-350`; `checkUses(R3_HOME)` exige una fila por uso, `:84`) + las **siete** filas nuevas en `ui-copy-table.ts:45-87` + el registro en `specs/mobile-ui-language/design.md` §2. Ninguna clave del ámbito `reminders.*` se reutiliza; `reminders.dueInDays` es además inutilizable aquí por su `·` incorporado | pendiente |
| R17 | `src/__tests__/design-drift.test.ts`::`describe('#70 R17: la sección de recordatorios no mete drift de estilo')`, sobre la lista nominal de los seis ficheros de esta feature —`src/api/types.ts` **no está en ninguna de las cinco listas existentes**, así que sin este bloque quedaría sin vigilar—. Título sin cifra escrita con letra. **Candado de cadena literal, no de conducta**, y así está declarado en [[requirements]] R17 | pendiente |
| R18 | Los deltas de la tabla de [[requirements]] R18, verificados por el reviewer **rehaciendo cada `grep`**, no leyendo el informe del implementer. Fila 1: `src/providers/__tests__/language-provider.test.tsx:41`, `260 + 16 + 1 + 4` → `260 + 16 + 1 + 4 + 7` — el candado que **paró la implementación en #68 y en #69**. Fila 3: **tres expresiones** de `consistency-classnames.test.ts` que solo cuadran juntas (constante `HOME_TABULAR_DELTA_70`, fila de home y total cerrado) más la guarda de `#69 R14` (`:365-368`). Fila 4: `legibility-classnames.test.ts:123` `1 → 2` y `:135-139` `.toBe(13)` → `.toBe(13 + 1)`. Esta feature **no reubica nada**: si aparece una reubicación, alguien está moviendo un fichero que no toca | pendiente |
| R19 | Requisito de **verificación** (C4 vía (b)): `bun run test` y `bun run typecheck` verdes desde `mobile-pet-tracker/`, grep-clean de la carta §Decisiones fijas 3 intacto y escala de radios de #62 R4 sin clase fuera de escala | pendiente |
| R19b | Las **ocho** mutaciones de [[tasks]] §R19 (2), plantadas de una en una y **todas en código de producción** (`CHECKPOINTS.md` C4, quinto punto: mutar el doble de `reicon` o `makePet` **no** cuenta), con la evidencia en `progress/impl_mobile-home-reminders-section.md`. M1 y M2 se plantan en la **zona ciega** —las dos dejan la suite verde en un runner en UTC—; M5 planta el hijo intruso **sin `testID`**, que es por donde se coló el cuarto tile en la corrección O7 de #71 | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente" en la columna
Commit.
Convención de commit: `feat(mobile-home-reminders-section): <desc> (R1,R6)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida al
aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Gates humanos, no delegables

Dos, y ninguno lo puede cerrar una IA:

1. **Aprobación de la spec** ([[requirements]] §Aprobación), con las seis
   ratificaciones de esa sección — en particular que esta feature entrega
   **media sección** del diseño y que la causa por la que la otra mitad no entra
   **no es** la que decía el enunciado.
2. **Prueba de humo en dev build de Android**, en los **dos temas**, con:
   - una mascota **con** vacuna próxima (fila completa: icono, nombre, fecha
     localizada y contador en `N d`);
   - una mascota **sin** vacuna próxima (estado vacío de R8, con la sección
     conservando su altura);
   - el enlace **"Ver todos"** pulsado, comprobando que abre la lista de
     recordatorios y que el botón "Nuevo" de esa pantalla sigue funcionando;
   - el tile **"Recordatorio"** de #71 pulsado en la misma sesión, comprobando
     que lleva al **alta** y no a la lista — que es la distinción que R10
     defiende.
