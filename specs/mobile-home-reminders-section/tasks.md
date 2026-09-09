---
feature: "mobile-home-reminders-section"
status: approved       # draft | spec_ready | approved
tags: [harness, spec]
---

# Tareas — [[mobile-home-reminders-section]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Orden obligatorio**:
> `R2 → R4 → R5 → R1 → R6 → R7 → R8 → R9 → R10 → R11 → R12 → R13 → R14 → R15 → R3 → R16 → R17 → R18 → R19`.
>
> Cuatro cosas de ese orden no son negociables:
> - **R2 va primero** porque sin tipar `nextVaccine` ningún test de render
>   compila: `unknown` no deja leer `.name`. Es el desbloqueo de todo lo demás.
> - **R4 y R5 van antes que R1** porque son funciones puras con su propio
>   fichero de test (`format.test.ts`): dan rojo y verde sin montar la Home, y
>   R6 las necesita ya verdes para que su propio rojo sea el de la fila y no el
>   del helper.
> - **R3 va después de R15**, aunque sea la decisión central de la spec: su
>   candado —un solo hijo en el cuerpo, sin barra de comidas— solo puede dar
>   rojo cuando el cuerpo ya existe. Antes de eso el `it` fallaría por
>   `TestingLibraryElementError`, que **no** es un rojo legítimo (C4, cuarto
>   punto).
> - **R16 (copy) va casi al final** a propósito, igual que en #69 y #71: el
>   delta de las filas de `R3_HOME` solo se puede medir cuando ya existen los
>   usos. Ojo: R1, R7, R8 y R10 necesitan las **claves** desde su propio commit,
>   así que el primero de ellos añade las siete entradas al catálogo (si no, el
>   `t()` no compila); lo que se difiere a R16 es el **registro** —filas de
>   `ui-copy-table.ts`, tabla de `specs/mobile-ui-language/design.md`— y sus dos
>   deltas de candado.
>
> **Commits test-primero, obligatorio** (`CHECKPOINTS.md` C4). Cada requisito
> deja **al menos dos commits**: uno con el test rojo y otro con la
> implementación que lo pone verde. Un único commit con test + implementación +
> docs incumple C4 y el reviewer lo rechaza; ya pasó en #19. El mensaje sigue
> `docs/conventions.md` §Commits:
> `feat(mobile-home-reminders-section): <desc> (R1)`.
>
> **Ningún rojo puede fallar por `ReferenceError`** de un helper de test que
> todavía no existe (C4, cuarto punto). El fichero `index.test.tsx` ya tiene sus
> mocks, sus factorías (`makePet`, `makeDay`, `pending`), su `HomeWrapper` y su
> helper `appRoutes` (`:42-57`); `format.test.ts` ya existe desde #69. Lo que
> falta es la sección, no el andamio.
>
> **Ningún rojo puede plantarse en un mock** (C4, **quinto** punto, añadido el
> 2026-09-08 tras #69). Cuando un candado se añade sobre código **ya correcto**
> —R11, R12, R13, R17 y la lectura de fuente de R2—, el rojo legítimo es la
> **mutación de producción**: se versiona en el commit rojo y se revierte en el
> verde. Intercambiar entradas del doble de `reicon`, o tocar `makePet`, **no
> cuenta**. La entrada `Syringe` que R13 añade al doble es preparación, no rojo.
>
> **Antes de tocar nada**:
> - Carga las skills: `expo:expo-overview` → `expo:expo-native-ui` y
>   `expo:expo-design-system`, más `appllama-app-design-skill`. Obligatorio en
>   trabajo móvil (carta §Skills). La carta gana sobre la skill en todo
>   conflicto. SDK del proyecto: **Expo 57** (`~57.0.14`); documentación fijada
>   a esa versión, nunca `latest`.
> - Borra `mobile-pet-tracker/.expo/types/router.d.ts` si existe: está
>   gitignorado y rompe el typecheck con rutas fantasma. **Esta feature toca una
>   ruta.**
> - Comprueba que no hay otro `init.sh` corriendo en un worktree hermano
>   (`pgrep -f init.sh`): comparten el Postgres de docker y se pisan.
> - Trabaja en `feature/70-mobile-home-reminders-section`. Nunca en `main`.
> - **No crees ficheros de producción.** La sección vive dentro de
>   `src/screens/home/index.tsx` y los dos helpers dentro de
>   `src/screens/home/format.ts`, los dos ya existentes ([[design]] §3 D10). Si
>   te ves creando `reminders-section.tsx`, has entendido mal la tarea.
> - **No toques `backend-pet-tracker/`.** El `gt` del lector de vacunas es una
>   decisión abierta del humano (E1), no un bug que arreglar aquí.
> - **No toques `src/utils/reminder-dates.ts`.** Su `daysUntil` tiene el mismo
>   defecto que #68 corrigió y **aun así no se arregla aquí** (E3).
> - **No toques la gráfica de #68, la tira de #69 ni los tiles de #71.** La
>   sección es un hermano nuevo.

---

## Forma exacta de lo que hay que escribir

Esto no es una sugerencia de implementación: es el contrato que hace
verificables R1, R4, R6, R7 y R19b.

### 1. El tipo (R2) — `src/api/types.ts`

```ts
export interface NextVaccine {
  id: string;
  name: string;
  nextDoseAt: string;
}
```

y en `PetProfile`, **solo esta línea cambia** (`:72`):

```ts
  nextVaccine: NextVaccine | null;
  nextReminder: unknown;        // ← NO se toca
  activitySummary: unknown;     // ← NO se toca
```

### 2. Los dos helpers (R4, R5, R6) — `src/screens/home/format.ts`

```ts
const DAY_MS = 86_400_000;

export function calendarDaysUntil(date: string, now: Date): number {
  const [year, month, day] = date.split('-').map(Number);
  const target = Date.UTC(year, month - 1, day);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

  return Math.round((target - today) / DAY_MS);
}

export function fmtDate(date: string, locale: string): string {
  const [year, month, day] = date.split('-').map(Number);

  return new Date(year, month - 1, day).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
```

### 3. El contador (R7) — nivel de módulo en `src/screens/home/index.tsx`, junto a `fmtLastSeen`

```ts
function vaccineCountdown(
  days: number,
  t: ReturnType<typeof useTranslate>,
): { text: string; label: string } {
  if (days < 0) {
    const overdue = t('home.nextVaccineOverdue');
    return { text: overdue, label: overdue };
  }

  if (days === 0) {
    const today = t('home.nextVaccineToday');
    return { text: today, label: today };
  }

  return {
    text: t('home.nextVaccineDays', { days }),
    label: t('home.nextVaccineDaysLeft', { days }),
  };
}
```

### 4. El color del icono (R12) — dentro de `HomeScreen`

**Se extiende la llamada que ya existe** (`:91-96`), no se abre una segunda:

```ts
const [accent, success, warning, muted, vaccineInk] = useThemeColors([
  'accent-strong',
  'success',
  'warning',
  'muted',
  'category-blue-strong',
]);
```

### 5. El JSX — entre el fragmento de actividad semanal y `last-position-card`

```tsx
{selectedPetId ? (
  <View testID="reminders-section" className="gap-3">
    <View className="flex-row items-center justify-between">
      <Text
        testID="reminders-section-title"
        className="text-base font-bold text-foreground"
      >
        {t('home.reminders')}
      </Text>
      <Pressable
        testID="reminders-see-all"
        accessibilityRole="button"
        className="min-h-11 justify-center"
        onPress={() => router.push('/reminders')}
      >
        <Text className="text-xs font-semibold text-accent-strong">
          {t('home.remindersSeeAll')}
        </Text>
      </Pressable>
    </View>

    <View testID="reminders-section-body" className="gap-2">
      {detail.data === undefined ? (
        <Skeleton
          testID="reminders-section-skeleton"
          className="h-16 w-full rounded-card"
        />
      ) : null}

      {detail.data?.kind === 'ok' && detail.data.pet.nextVaccine ? (
        <Card
          testID="reminders-next-vaccine"
          className="flex-row items-center gap-3"
        >
          <View
            className={`size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS.blue.surface}`}
          >
            <Syringe size={20} color={vaccineInk} />
          </View>
          <View className="flex-1">
            <Text
              testID="reminders-next-vaccine-name"
              className="text-sm font-semibold text-foreground"
            >
              {detail.data.pet.nextVaccine.name}
            </Text>
            <Text
              testID="reminders-next-vaccine-date"
              className="text-xs font-normal text-muted"
            >
              {fmtDate(detail.data.pet.nextVaccine.nextDoseAt, locale)}
            </Text>
          </View>
          <Text
            testID="reminders-next-vaccine-days"
            accessibilityLabel={
              vaccineCountdown(
                calendarDaysUntil(detail.data.pet.nextVaccine.nextDoseAt, new Date()),
                t,
              ).label
            }
            style={TABULAR_NUMS}
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${CATEGORY_SLOTS.amber.surface} ${CATEGORY_SLOTS.amber.ink}`}
          >
            {
              vaccineCountdown(
                calendarDaysUntil(detail.data.pet.nextVaccine.nextDoseAt, new Date()),
                t,
              ).text
            }
          </Text>
        </Card>
      ) : null}

      {detail.data?.kind === 'ok' && !detail.data.pet.nextVaccine ? (
        <Card
          testID="reminders-none-upcoming"
          className="flex-row items-center gap-3"
        >
          <View
            className={`size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS.neutral.surface}`}
          >
            <Syringe size={20} color={muted} />
          </View>
          <Text className="flex-1 text-sm font-normal text-muted">
            {t('home.noUpcomingVaccine')}
          </Text>
        </Card>
      ) : null}
    </View>
  </View>
) : null}
```

> El doble `vaccineCountdown(...)` del bloque de arriba es deliberadamente
> ingenuo para que el contrato se lea de un vistazo. **En el commit de refactor
> de R7 se extrae a una sola llamada** (una `const countdown = …` en un
> envoltorio, o una función local que reciba el `nextVaccine`), sin cambiar
> ningún `testID` ni ninguna clase. Extraerlo es refactor; el rojo y el verde ya
> pasaron.

Nueve cosas que **no** se pueden cambiar sin romper un candado o un requisito:

1. **`nextReminder` y `activitySummary` se quedan en `unknown`.** No tiparlos es
   la prueba en el árbol de que esta feature no los usa (R2). Tocarlos es
   alcance de otra feature.
2. **La entrada de `calendarDaysUntil` es la cadena, no un `Date`.** Convertirla
   fuera y pasar un `Date` mueve la trampa a donde el test no la ve.
3. **Los dos helpers descomponen la cadena en componentes.** Ni `new Date(date)`
   ni `Date.parse(date)` en ninguno de los dos. Es el defecto de #68.
4. **`now` es parámetro de `calendarDaysUntil`.** Leer `new Date()` dentro
   impide fijar el día en el test sin tocar el reloj del runner.
5. **El cuerpo tiene un contenedor propio** (`reminders-section-body`). La
   cardinalidad de R1 se cuenta sobre **sus hijos directos**, no sobre
   coincidencias de `testID`.
6. **Las dos filas usan el `Card` compartido y sin `onPress`.** Con `onPress` se
   vuelven `Pressable` con `accessibilityRole="button"` (`card.tsx:31-40`), que
   es justo lo que R6 prohíbe. Y el `Card` es lo que mantiene el delta de #62
   R14 en **cero**.
7. **Los colores salen de `CATEGORY_SLOTS[...]`.** Escribir `bg-category-blue`
   en este fichero pone rojo **#64 R9** (`consistency-classnames.test.ts:404`).
8. **`style={TABULAR_NUMS}` va solo en el contador.** Ni en el nombre ni en la
   fecha: el delta de #62 R15 es **+1** (R18 fila 3).
9. **`router.push('/reminders')` sin `as Href` y sin importar `Href`.**
   [[design]] §3 D6. Si `/reminders` empieza a necesitar cast por su cuenta,
   **para y repórtalo**: algo ha cambiado en el tipado de rutas.

---

## R2 — El tipo del cliente contra el contrato

1. **Test rojo**: en `src/screens/home/index.test.tsx`, abre
   `describe('#70 R1: la Home dibuja la sección de recordatorios')` con
   `it('tipa nextVaccine con los tres campos del contrato y ninguno más')`, que
   lee `src/api/types.ts` con `readFileSync` y asserta: la interfaz
   `NextVaccine` con `id`, `name` y `nextDoseAt`; **ausencia** de `daysLeft` y
   de `date` dentro de su bloque; `nextVaccine: NextVaccine | null` en
   `PetProfile`; y que `nextReminder` y `activitySummary` **siguen** en
   `unknown`.
2. **Implementación mínima**: la interfaz y el cambio de la línea `:72`. Nada
   más.
3. **Refactor**: ninguno. Comprueba `bun run typecheck`: la fixture `makePet`
   (`index.test.tsx:138`) ya trae `nextVaccine: null` y debe seguir compilando
   sin tocarse.

---

## R4 — `calendarDaysUntil` cuenta días de calendario

1. **Test rojo**: en `src/screens/home/format.test.ts`, añade
   `describe('#70 R4: calendarDaysUntil cuenta días de calendario')` con
   `it('cuenta futuro, mañana, hoy y pasado')`:
   `calendarDaysUntil('2026-09-15', new Date(2026, 8, 10, 12, 0))` → `5`;
   `('2026-09-11', …)` → `1`; `('2026-09-10', …)` → `0`;
   `('2026-09-08', …)` → `-2`.
2. **Implementación mínima**: la función de §Forma exacta 2.
3. **Refactor**: extrae `DAY_MS` a constante de módulo si no existe.

---

## R5 — La zona horaria no desplaza el resultado

1. **Test rojo**: mismo `describe` que R4 →
   `it('no se desplaza un día en una zona horaria negativa')`, que guarda
   `process.env.TZ`, lo fija a `'America/Mexico_City'`, asserta
   `calendarDaysUntil('2026-09-15', new Date(2026, 8, 10, 23, 30))` → `5` **y**
   `calendarDaysUntil('2026-09-15', new Date(2026, 8, 10, 0, 30))` → `5`, y lo
   restaura en un `finally`. Más
   `it('formatea la fecha visible sin desplazarla')`, que bajo la misma zona
   asserta que `fmtDate('2026-09-15', 'es-MX')` contiene `'15'` y **no** `'14'`.
   Es el patrón exacto de #68 R4 (`weekly-activity-chart.test.tsx`), que ya está
   verde en este repo.
2. **Implementación mínima**: `fmtDate` de §Forma exacta 2. `calendarDaysUntil`
   ya lo cumple si se escribió como manda R4 — **si este `it` sale verde de
   entrada, no es un rojo legítimo**: planta antes la mutación M1 de R19b
   (versionada en el commit rojo, revertida en el verde), como manda C4 quinto
   punto.
3. **Refactor**: si el `split('-').map(Number)` se repite en las dos funciones,
   extrae un helper privado de módulo. No lo exportes: R4 fija la superficie
   pública en dos funciones.

---

## R1 — La sección, su cabecera y **un solo** hijo en el cuerpo

1. **Test rojo**: en el `describe` de R2 →
   `it('dibuja la cabecera y el cuerpo de la sección')`, que asserta
   `reminders-section` con **dos** hijos directos, el rótulo con
   `'Recordatorios'` y su receta `text-base font-bold text-foreground`, y
   `reminders-see-all` presente. Más
   `it('deja el cuerpo con un solo hijo')`, que asserta
   `screen.getByTestId('reminders-section-body').children` con longitud **`1`**
   en el escenario cargado, **`1`** en el escenario con `pending()` y **`0`** en
   el de `{ kind: 'error' }`. **La longitud se cuenta sobre `children`, nunca
   sobre coincidencias de `testID`.**
2. **Implementación mínima**: la `View` de sección, la fila de cabecera y el
   cuerpo vacío. Añade **las siete claves** de R16 a `catalog.ts` en `en` y `es`
   en este mismo commit: sin ellas el `t()` no compila.
3. **Refactor**: ninguno.

---

## R6 — Cada dato en su nodo

1. **Test rojo**: mismo `describe` →
   `it('liga nombre, fecha y contador a su nodo y a ninguno más')`, con
   `makePet({ nextVaccine: { id: 'vac-9', name: 'Antirrábica', nextDoseAt: '2026-09-15' } })`
   y el reloj fijado al `2026-09-10`, que con
   `within(screen.getByTestId('reminders-next-vaccine'))` asserta los tres
   `testID` con su texto exacto, que ninguno contiene el texto de otro, y que
   `'vac-9'` **no** aparece en el árbol de la sección. Más
   `it('no hace pulsable la fila de la vacuna')`.
2. **Implementación mínima**: la `Card` de §Forma exacta 5, con el disco, el
   nombre, la fecha y el contador.
3. **Refactor**: extrae la doble llamada a `vaccineCountdown` a una sola.

---

## R7 — Las tres ramas del contador

1. **Test rojo**: mismo `describe` → `it('resuelve las tres ramas del contador')`
   con tres renders —dosis a 5 días, dosis hoy, dosis hace 2 días—, fijando el
   reloj con `jest.useFakeTimers().setSystemTime(...)` y restaurándolo, que
   asserta el texto visible **y** el `accessibilityLabel` de cada rama, y que
   **en ninguna** el texto del contador contiene `'-'`.
2. **Implementación mínima**: `vaccineCountdown` de §Forma exacta 3.
3. **Refactor**: ninguno. **No** simplifiques a dos ramas: la de `< 0` es la que
   evita `-3 d` (mutación M4).

---

## R8 — El estado vacío con forma de fila

1. **Test rojo**: mismo `describe` →
   `it('dibuja un estado vacío con forma de fila cuando no hay vacuna')`, con
   `makePet()` (que ya trae `nextVaccine: null`), que asserta
   `reminders-none-upcoming` con su texto, `reminders-next-vaccine` ausente, los
   tres `testID` de R6 ausentes, y `reminders-section-title` y
   `reminders-see-all` presentes.
2. **Implementación mínima**: la segunda `Card`, con el hueco `neutral`.
3. **Refactor**: ninguno. **No** unifiques las dos `Card` en una con ternarios
   dentro: R1 cuenta hijos del cuerpo y las dos ramas son mutuamente
   excluyentes; unificarlas haría ilegible qué rama pinta qué.

---

## R9 — Esqueleto al cargar, silencio al fallar

1. **Test rojo**: mismo `describe` →
   `it('esqueletiza mientras carga y calla cuando el perfil falla')`, con dos
   renders (`pending()` y `{ kind: 'error' }`), que asserta el esqueleto y su
   `className` en el primero, el cuerpo con **cero** hijos en el segundo, la
   ausencia de cualquier `testID` terminado en `-error` o `-retry` dentro de
   `reminders-section` en los dos, y `reminders-see-all` presente en los dos.
2. **Implementación mínima**: la rama del `Skeleton`.
3. **Refactor**: ninguno.

---

## R10 — El enlace a la lista

1. **Test rojo**: mismo `describe` →
   `it('lleva a la lista de recordatorios existente')`, que pulsa
   `reminders-see-all` y espera `mockRouter.push` llamado **una vez** con
   `'/reminders'`, y que cruza esa ruta con los ficheros reales de
   `src/app/(tabs)/` usando el helper `appRoutes` que ya existe
   (`index.test.tsx:42-57`). Más
   `it('no añade un segundo camino a la lista desde la Home')`, que asserta que
   `'/reminders'` aparece **exactamente una vez** en el fuente de
   `src/screens/home/index.tsx` y que el fuente no contiene
   `'/reminders' as Href` ni un import de `Href`.
2. **Implementación mínima**: el `Pressable` de la cabecera con su `onPress`.
3. **Refactor**: ninguno. Comprueba que el candado de #71
   (`index.test.tsx:1601-1612`, que prohíbe `'/reminders'` **dentro del bloque
   `QUICK_ACTIONS`**) sigue **verde y sin tocar**: el enlace vive fuera de esa
   constante.

---

## R11 — Anuncio por partes y abreviatura expandida

1. **Test rojo**: mismo `describe` →
   `it('anuncia el enlace como botón y expande la abreviatura del contador')`,
   que asserta `accessibilityRole` `'button'` solo en `reminders-see-all`, el
   `accessibilityLabel` del contador en las tres ramas, y que ni
   `reminders-section` ni `reminders-section-body` declaran `accessible` ni
   `accessibilityLabel`.
2. **Implementación mínima**: ya está escrita si se siguió §Forma exacta 5.
   Como el candado se añade sobre código correcto, **planta antes la mutación**
   (quita el `accessibilityLabel` del contador), versiónala en el commit rojo y
   reviértela en el verde. **No mutes ningún mock** (C4, quinto punto).
3. **Refactor**: ninguno.

---

## R12 — Card compartido, radios, tokens y cifras tabulares

1. **Test rojo**: mismo `describe` →
   `it('viste la sección con el Card compartido y los tokens')`, que asserta la
   `className` del contador (fondo y tinta categóricos ya resueltos), la del
   disco, `TABULAR_NUMS` presente en el contador y ausente en nombre y fecha.
   Candado sobre código correcto: **planta la mutación M8** (quitar
   `TABULAR_NUMS`) en el commit rojo y reviértela en el verde.
2. **Implementación mínima**: ya está escrita si se siguió §Forma exacta 4 y 5.
3. **Refactor**: ninguno. Comprueba **en verde y sin tocar** los candados #64 R9
   (`:404` y `:430`), #62 R4 (`:150-155`) y #62 R1 (`:97-104`).

---

## R13 — `Syringe` de reicon, cero emoji

1. **Preparación** (fichero de test, **no cuenta como rojo**): añade
   `Syringe: mockIcon('icon-syringe')` al doble de `reicon`
   (`index.test.tsx:82-102`), sin renombrar ni quitar las seis entradas que ya
   hay.
2. **Test rojo**: mismo `describe` → `it('usa el icono de reicon y ningún
   emoji')`, que lee el fuente y asserta el import de `Syringe`, sus **dos**
   usos con `size={20}` y la ausencia de `💉`.
3. **Implementación mínima**: el import y los dos usos.
4. **Refactor**: ninguno.

---

## R14 — Sitio en el árbol y condición de render

1. **Test rojo**: mismo `describe` →
   `it('coloca la sección entre la actividad semanal y la última posición')`,
   que lee los `testID` de los hijos de `home-content`, filtra a la **lista
   blanca de seis** —`summary-card`, `collar-card`, `quick-actions`,
   `weekly-activity-card`, `reminders-section`, `last-position-card`— y espera
   esa secuencia exacta. Más
   `it('no dibuja la sección sin mascota seleccionada')`.
2. **Implementación mínima**: mover el bloque a su sitio, si no se escribió ya
   ahí.
3. **Refactor**: ninguno. Comprueba **en verde y sin tocar** los tres candados
   de orden heredados (`:1205-1235`, `:1401-1438`, `:1760-1798`): filtran a
   lista blanca y un hermano nuevo no los mueve.

---

## R15 — Cero llamadas nuevas, cero backend

1. **Test rojo**: mismo `describe` → `it('no añade ninguna llamada a la API')`,
   que compara el recuento de `mockGetPet`, `mockGetDailyActivity` y
   `mockListPets` con el escenario equivalente y espera **el mismo número**.
2. **Implementación mínima**: ninguna — es un candado sobre conducta ya
   correcta. Planta la mutación (una llamada extra a `getPet` dentro de la
   sección), versiónala en el rojo y reviértela en el verde.
3. **Refactor**: ninguno. Verificación adicional del reviewer:
   `git diff --stat` sin ficheros fuera de `mobile-pet-tracker/`, `specs/` y
   `progress/`; y en particular **cero** ficheros de `backend-pet-tracker/`,
   `src/utils/reminder-dates.ts`, `src/components/`, `src/theme/` y `src/app/`.

---

## R3 — La barra de comidas queda fuera

1. **Test rojo**: mismo `describe` →
   `it('no dibuja la barra de comidas ni pide el plan de nutrición')`, que
   asserta un solo hijo directo en `reminders-section-body` con el perfil
   cargado, que ningún nodo de la sección tiene un texto con la forma `n/m`, y
   que el fuente de `src/screens/home/index.tsx` no importa nada de
   `../../api/nutrition`. Planta la **mutación M5** —un segundo hijo en el
   cuerpo, `<View className="h-1.5 rounded-full bg-default" />`, **sin
   `testID`**— y versiónala en el commit rojo.
2. **Implementación mínima**: revertir la mutación. La ausencia es la
   implementación.
3. **Refactor**: ninguno. **Si M5 deja la suite verde, R1 está mal escrito** —se
   estará contando `testID` en vez de hijos— y se arregla antes de seguir. Es
   literalmente el defecto O7 de #71.

---

## R16 — La copy, registrada

1. **Test rojo**: añade las **siete** filas
   `{ file: 'src/screens/home/index.tsx', key: '<clave>' }` a `R3_HOME`
   (`ui-copy-table.ts:45-87`) y sube el delta de `ui-language.test.ts:83` a
   `21 + 15 + 1 + 4 + 7`. El rojo es natural si el registro se hace antes que
   los usos, o si los usos ya existen y las filas faltan.
2. **Implementación mínima**: las siete claves ya están en `catalog.ts` desde el
   commit de R1; aquí se cierra el registro y se sube
   `language-provider.test.tsx:41` a `260 + 16 + 1 + 4 + 7`.
3. **Refactor**: registra las siete claves en la tabla de
   `specs/mobile-ui-language/design.md` §2, bloque de
   `src/screens/home/index.tsx`, con el sufijo `← añadida por #70 (R16)`.

---

## R17 — Bloque propio de drift de estilo

1. **Test rojo**: añade a `src/__tests__/design-drift.test.ts`
   `describe('#70 R17: la sección de recordatorios no mete drift de estilo')`
   con `it('mantiene sus ficheros sin escapes de estilo literales')` sobre
   `['api/types.ts', 'i18n/catalog.ts', 'screens/home/format.test.ts',
   'screens/home/format.ts', 'screens/home/index.test.tsx',
   'screens/home/index.tsx']` y el patrón
   `/text-\[10px\]|#[\da-f]{3,8}\b|StyleSheet/i`. Candado sobre código correcto:
   planta un hex en `src/screens/home/index.tsx` (por ejemplo, el `#FFF7ED` del
   Make en el `className` del contador), versiónalo en el rojo y reviértelo en
   el verde.
2. **Implementación mínima**: revertir la mutación.
3. **Refactor**: ninguno. **No** escribas el número de ficheros con letra en el
   título del `it`: #69 dice *"sus cinco"* y #71 dice *"sus tres"*, y las dos
   cifras caducan.

---

## R18 — Deltas de candado contra `b0ec5a8`

1. **Test rojo**: los propios candados, rojos por el delta natural de las siete
   claves (filas 1 y 2), del `TABULAR_NUMS` (fila 3) y del `text-accent-strong`
   (fila 4).
2. **Implementación mínima**: aplicar los deltas de la tabla de [[requirements]]
   R18, **uno por uno**, sustituyendo cada número por el que devuelva el propio
   `grep`. Cuidado especial con la fila 3: son **tres** expresiones en
   `consistency-classnames.test.ts` que solo cuadran si se mueven a la vez —la
   constante nueva `HOME_TABULAR_DELTA_70`, la fila de home y el total cerrado—
   más la guarda de `#69 R14` (`:365-368`).
3. **Refactor**: ninguno. IF un total cerrado se mueve por una causa que la
   tabla no prevé THEN **para y repórtalo**: no lo absorbas subiendo el número.

---

## R19 — Verificación y prueba de mutación

1. `bun run test` y `bun run typecheck` desde `mobile-pet-tracker/`, verdes, sin
   debilitar ningún assert de conducta y sin renombrar ningún `testID` de
   producción. Grep-clean de la carta §Decisiones fijas 3 intacto.
2. **Prueba de mutación (R19b)**: planta las **ocho** mutaciones **de una en
   una**, cada una en un commit rojo con su reversión en el verde, y anota en
   `progress/impl_mobile-home-reminders-section.md` §prueba de mutación cuántos
   tests caen con cada una:

   | # | Mutación | Debe matar |
   |---|---|---|
   | M1 | `calendarDaysUntil` → `Math.ceil((Date.parse(date) - now.getTime()) / DAY_MS)` | R4, R5 |
   | M2 | `fmtDate` → `new Date(date).toLocaleDateString(locale, …)` | R5, R6 |
   | M3 | el nodo del nombre pinta `nextDoseAt` y el de la fecha `name` | R6 |
   | M4 | desaparece la rama `days < 0` | R7 |
   | M5 | un segundo hijo en el cuerpo, **sin `testID`** | R1, R3 |
   | M6 | `reminders-see-all` navega a `/add-reminder` | R10 |
   | M7 | `reminders-section` se monta delante de `quick-actions` | R14 |
   | M8 | el contador pierde `style={TABULAR_NUMS}` | R12, R18 fila 3 |

   **M1 y M2 se plantan en la zona ciega a propósito**: las dos dejan la suite
   verde bajo un runner en UTC. Si no se ponen rojas, el `it` de R5 no está
   fijando la zona horaria y no vigila nada — arréglalo antes de seguir.
   **M5 es la lección de #71**: el hijo intruso no lleva `testID`. Si la suite
   sigue verde, R1 cuenta `testID` en vez de hijos.
   **Las ocho son de producción.** Mutar el doble de `reicon`, `makePet` o
   cualquier otro mock **no cuenta** (`CHECKPOINTS.md` C4, quinto punto).
3. Deja el informe en `progress/impl_mobile-home-reminders-section.md` con: los
   deltas medidos de R18 (comando y salida), la evidencia de las ocho
   mutaciones, y el recuento de suites/tests antes y después.

---

## Lo que NO hay que hacer, por si acaso

- **No** dibujes la barra de comidas, ni la derives del reloj como
  `food.tsx:185`. R3.
- **No** tipes `nextReminder` ni `activitySummary`. R2.
- **No** toques `backend-pet-tracker/`, ni el `gt` del lector de vacunas. E1.
- **No** arregles `src/utils/reminder-dates.ts`. E3.
- **No** reutilices su `daysUntil`. R4.
- **No** hagas pulsable la fila de la vacuna. R6.
- **No** añadas un segundo enlace a `/reminders` desde la Home. R10.
- **No** uses `as Href`. [[design]] §3 D6.
- **No** crees ficheros de producción nuevos, ni en `src/app/` ni en
  `src/screens/home/`. R15.
- **No** toques `weekly-activity-chart.tsx` (#68), las celdas de `summary-card`
  (#69) ni `QUICK_ACTIONS` (#71). R14.
- **No** muevas `last-position-card`. R14.
- **No** añadas tokens a `src/theme/global.css`. R12.
- **No** instales dependencias. `Syringe` ya está en `reicon-react-native`, y
  `expo-linear-gradient` sigue vetado por nombre.
- **No** escribas `bg-category-…` ni `text-category-…` en la Home. #64 R9.
- **No** pongas un `›` ni un `→` junto a "Ver todos". #62 R7.
- **No** metas implementación y test en el mismo commit. C4.
- **No** plantes ningún rojo en un mock. C4, quinto punto.
