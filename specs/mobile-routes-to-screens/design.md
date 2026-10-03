---
feature: "mobile-routes-to-screens"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, mobile, refactor]
---

# Diseño — [[mobile-routes-to-screens]] (#102)

> Ver [[requirements]] para los requisitos R1–R9 y [[tasks]] para el orden de
> commits. Capas: [[../../docs/architecture|architecture]]. Carta de UI (C8):
> [[../../docs/ui-guidelines|ui-guidelines]]. Estructura Expo:
> [[../../docs/conventions|conventions]] §Estructura Expo oficial.
>
> **Codex no verá la conversación que originó esta spec.** Toda decisión abierta
> queda cerrada aquí por escrito, con rutas exactas y nombres de símbolo exactos.

## 1. Forma destino, literal

### 1.1 El route delgado

Calcada de `src/app/(tabs)/home.tsx` y `alerts.tsx`, que son el precedente
vigente. Para `map` (las otras tres, igual, cambiando el nombre):

```tsx
import { MapScreen } from '../../screens/map';

export default function MapRoute() {
  return <MapScreen />;
}
```

Los cuatro nombres, cerrados:

| Ruta | Fichero de ruta | Export por defecto de la ruta | Screen body | Export nombrado del body |
|---|---|---|---|---|
| map | `src/app/(tabs)/map.tsx` | `MapRoute` | `src/screens/map/index.tsx` | `MapScreen` |
| health | `src/app/(tabs)/health.tsx` | `HealthRoute` | `src/screens/health/index.tsx` | `HealthScreen` |
| weight-log | `src/app/(tabs)/weight-log.tsx` | `WeightLogRoute` | `src/screens/weight-log/index.tsx` | `WeightLogScreen` |
| meal-schedule | `src/app/(tabs)/meal-schedule.tsx` | `MealScheduleRoute` | `src/screens/meal-schedule/index.tsx` | `MealScheduleScreen` |

### 1.2 El cambio en el cuerpo es **una línea**

Hoy los cuatro cuerpos exportan por defecto con el nombre que ya queremos:

```
src/app/(tabs)/map.tsx:87            export default function MapScreen() {
src/app/(tabs)/health.tsx:40         export default function HealthScreen() {
src/app/(tabs)/weight-log.tsx:333    export default function WeightLogScreen() {
src/app/(tabs)/meal-schedule.tsx:316 export default function MealScheduleScreen() {
```

Y ninguno tiene ningún otro `export` (verificado: `grep -n '^export'` devuelve
solo esas cuatro líneas). El cambio en el cuerpo es, por tanto, **exactamente**:

```diff
-export default function MapScreen() {
+export function MapScreen() {
```

Nada más. Ni un import, ni una línea de JSX (ver **D1**).

## 2. Decisiones cerradas

### D1 — Los cuerpos no cambian ni un import. **Verificado, no supuesto**

`src/app/(tabs)/<x>.tsx` y `src/screens/<x>/index.tsx` están **ambos a
profundidad 3** bajo `src/`, así que todo prefijo relativo `'../../'` queda
idéntico. Medido comparando los dos ficheros:

| | `src/app/(tabs)/map.tsx` | `src/screens/home/index.tsx` |
|---|---|---|
| api | `'../../api/pets'` (`:14`) | `'../../api/activity'` (`:28`) |
| components | `'../../components/card'` (`:22`) | `'../../components/card'` (`:39`) |
| providers | `'../../providers/auth-provider'` (`:25`) | `'../../providers/auth-provider'` (`:47`) |
| theme | `'../../theme/native-styles'` (`:31`) | `'../../theme/native-styles'` (`:56`) |
| utils | `'../../utils/device-connectivity'` (`:35`) | `'../../utils/device-connectivity'` (`:62`) |

Corolario que **abarata y asegura** la feature: `design-drift.test.ts:90` asevera
`expect(contents).toContain("from '../../components/card'")` para las siete
pantallas del `describe.each`, y esa aserción **sobrevive intacta** a la mudanza.
Por eso R6 solo toca la resolución de la ruta y jamás la aserción.

### D2 — Los tests **sí** cambian de prefijo: un nivel menos

`src/app/(tabs)/__tests__/<x>.test.tsx` está a profundidad **4**;
`src/screens/<x>/index.test.tsx` está a profundidad **3**. Reglas mecánicas,
verificadas contra `src/screens/home/index.test.tsx` y `alerts/index.test.tsx`:

| Forma en el test de hoy | Forma tras la mudanza |
|---|---|
| `from '../../../api/…'` | `from '../../api/…'` |
| `from '../../../providers/…'` | `from '../../providers/…'` |
| `from '../../../theme/…'` | `from '../../theme/…'` |
| `from '../../../../test/render-with-providers'` | `from '../../../test/render-with-providers'` |
| `jest.mock('../../../api/…')` | `jest.mock('../../api/…')` |
| `import MapScreen from '../map'` (default) | `import { MapScreen } from '.'` (named) — ver **D3** |

Lo mismo aplica a **todo** `jest.mock('…')` con ruta relativa, no solo a los
`import`. Es el mismo `../../../` → `../../`.

### D3 — El test importa el body como **named, desde `'.'`**

Precedente en el árbol, 7 de 7 screens ya migradas usan named import; **6 de 7**
lo escriben `from '.'` y solo `home` escribe `from './index'`:

```
src/screens/add-pet/index.test.tsx:11        import { AddPetScreen } from '.';
src/screens/alerts/index.test.tsx:29         import { AlertsScreen } from '.';
src/screens/docs/index.test.tsx:16           import { DocsScreen } from '.';
src/screens/profile/index.test.tsx:30        import { ProfileScreen } from '.';
src/screens/reminders/index.test.tsx:24      import { RemindersScreen } from '.';
src/screens/add-reminder/index.test.tsx:24   import { AddReminderScreen } from '.';
src/screens/home/index.test.tsx:33           import { HomeScreen } from './index';
```

**Se adopta la forma mayoritaria**: `import { MapScreen } from '.';`. No se
normaliza `home` de paso — está fuera de alcance.

### D4 — **No hace falta ningún `index.ts` de barril**

Verificado: en `src/screens/` **no existe ni un solo `index.ts`**; cada carpeta
tiene únicamente `index.tsx`. El import del route delgado
(`from '../../screens/map'`) resuelve directamente a `index.tsx` vía la
resolución de Metro/TypeScript. **Crear un barril sería añadir un fichero que
nadie pide** — no se crea.

### D5 — `src/__tests__/ui-language.test.ts` **no se edita**. Ni una línea

La sospecha razonable era que `SCREEN_FILES` (`:371`) y su
`expect(SCREEN_FILES).toHaveLength(19 + 2 + 1)` (`:457`) se movieran. **No se
mueven**, y aquí queda por escrito el porqué para que nadie lo ajuste por
reflejo (es el error que descarriló #94):

1. El fichero **no contiene ni una ocurrencia literal de `(tabs)`**
   (`grep -n '(tabs)' src/__tests__/ui-language.test.ts` → vacío). Sus dos
   referencias a pantallas ya migradas (`:103`, `:204`) ya usan la forma
   `src/screens/…/index.tsx`.
2. `SCREEN_FILES` se **deriva** de `ALL_USES.map(u => u.file)` deduplicado. Un
   rename del campo `file` sustituye 4 valores distintos por otros 4 valores
   distintos: el recuento de ficheros únicos sigue siendo **22**. Verificado:
   `grep -o "file: '[^']*'" ui-copy-table.ts | sort -u | wc -l` → **22** hoy.
3. **No hay colisión posible**: `src/screens/map/index.tsx`,
   `…/health/…`, `…/weight-log/…` y `…/meal-schedule/…` **no figuran hoy** en la
   tabla, así que ninguna fila se funde con otra y el 22 no baja a 21.
4. Todos los demás `toHaveLength` del fichero (`:68`, `:75`, `:85`, `:126`,
   `:133`, `:140`, `:166`, `:173`, `:180`, `:187`, `:194`) miden **longitudes de
   bloque** de `ui-copy-table.ts` — cuántas filas hay —, y renombrar el campo
   `file` no cambia cuántas filas hay.

### D6 — En `ui-copy-table.ts` cambia el campo `file`, **nunca el número de filas**

Es un rename de valor, no un cambio de cuenta. Recuento por fichero medido hoy
(`grep -o "file: '[^']*'" | sort | uniq -c`):

| Fichero en la tabla | Filas | Bloque que lo contiene | Destino |
|---|---|---|---|
| `src/app/(tabs)/map.tsx` | **17** | `R4_MAP` (`:101-119`) | `src/screens/map/index.tsx` |
| `src/app/(tabs)/health.tsx` | **13** | `R5_HEALTH` (`:121-155`) | `src/screens/health/index.tsx` |
| `src/app/(tabs)/weight-log.tsx` | **19** | `R5_HEALTH` (`:121-155`) | `src/screens/weight-log/index.tsx` |
| `src/app/(tabs)/meal-schedule.tsx` | **19** | `R6_FOOD` (`:157-196`) | `src/screens/meal-schedule/index.tsx` |
| `src/app/(tabs)/food.tsx` | **19** | `R6_FOOD` (`:157-196`) | **no se toca** (§0.2) |

17 + 13 + 19 + 19 + 19 = **87**, que es justo el total de `(tabs)` del fichero.
De esos, **68 se renombran** y **19 se quedan**.

Dos bloques son compartidos y hay que mirarlos con cuidado: `weight-log` vive
dentro de `R5_HEALTH` y `meal-schedule` dentro de `R6_FOOD`. Sus longitudes
(`33` y `38`) **no se tocan**.

### D7 — **No se añade test de delegación al route delgado.** Decisión, no olvido

Cuando `alerts` y `profile` se migraron (#78), cada una dejó en
`src/app/(tabs)/__tests__/<x>.test.tsx` un test pequeño que mockea el módulo de
pantalla y asevera la delegación —
`src/app/(tabs)/__tests__/profile.test.tsx`, `describe('R2: route Profile delgada')`.

Seguir ese precedente aquí añadiría **4 tests nuevos** (y 4 suites), llevando el
total de **1386 a 1390**. Eso choca de frente con:

- el criterio de aceptación 3 de la entrada #102: *"Cero cambios de aserción en
  los tests: solo se mueven de fichero, y el recuento de tests por suite es
  idéntico antes y después"*;
- **R8**, que fija 77/1386 como el candado de la feature entera.

**Gana el criterio de aceptación.** Los cuatro routes delgados quedan sin test
directo, igual de descubiertos que `home.tsx`, `pairing.tsx`, `reminders.tsx` y
`add-reminder.tsx`, que tampoco lo tienen. Son cuatro líneas cada uno y un fallo
en ellos revienta las 141 aserciones del screen body. La cobertura de delegación,
si se quiere, es una feature aparte con su delta declarado.

### D8 — `src/app/(tabs)/__tests__/screens.test.tsx` **no se toca**

Premisa verificada leyendo el fichero entero: su **único** import de pantalla es
`import ProfileScreen from '../profile'` (`:10`), y `profile.tsx` ya es un route
delgado desde antes de esta feature. **Ninguna de las cuatro rutas de #102
aparece en él.** Sus 2 tests (`R5: placeholders de tabs`, `R6: profile permite
cerrar sesión`) siguen donde están, con su recuento de **2**.

### D9 — La carpeta `src/app/(tabs)/__tests__/` **no desaparece**

Contiene hoy 9 ficheros. Tras la feature le quedan **cinco**:

| Fichero | Por qué se queda |
|---|---|
| `alerts.test.tsx` | test de delegación de #78; `alerts` ya está migrada |
| `food.test.tsx` | de #106/#107 — prohibido abrirlo (§0.2) |
| `layout.test.tsx` | prueba `_layout.tsx`, `pets/add` y `pets/[petId]/docs`; ninguno se mueve |
| `profile.test.tsx` | test de delegación de #78 |
| `screens.test.tsx` | ver **D8** |

Salen cuatro: `map.test.tsx`, `health.test.tsx`, `weight-log.test.tsx`,
`meal-schedule.test.tsx`.

### D10 — `design-drift.test.ts:125-131` **no se amplía**

El `it('keeps the four Expo Router entrypoints thin')` de `#94 R9` lista cuatro
rutas: `app/(tabs)/home.tsx`, `app/(tabs)/profile.tsx`, `app/(tabs)/pets/add.tsx`
y `app/(tabs)/pets/[petId]/docs.tsx`. Tras esta feature, las cuatro rutas de #102
**también** son delgadas y encajarían en esa lista.

**No se añaden.** Añadirlas es una aserción nueva sobre ficheros nuevos: mismo
argumento que **D7**. El test se queda en cuatro entrypoints y su título sigue
diciendo la verdad.

### D11 — Los inventarios de `design-drift.test.ts` que **no** cambian

Verificado uno a uno: son **allow-lists explícitas** recorridas con `flatMap`
sobre un array literal (`featureFiles.flatMap(...)`), **no** escaneos de
directorio. Añadir cuatro carpetas bajo `src/screens/` no las mueve, y ninguna
nombra una de las cuatro rutas:

| Sitio | Describe | Por qué es inerte |
|---|---|---|
| `:108-110` | `#40 R9` | solo `screens/add-pet`, `screens/docs`, `screens/profile` |
| `:204-212` | `#68 R18` | `app/(tabs)/home.tsx` (ya delgada) y `screens/home`, `screens/pairing` |
| `:251-254` | `#69 R13` | solo `screens/home` e `i18n` |
| `:272-273` | `#71 R13` | solo `screens/home` e `i18n` |
| `:292-295` | `#70 R17` | solo `screens/home` e `i18n` |
| `:313-316` | `#85 R12` | solo `screens/home` e `i18n` |
| `:336-337` | `#98` | `app/(tabs)/food.tsx` (no se toca) y `screens/home` |

**Quedan escritos aquí para que nadie los ajuste por reflejo.**

### D12 — `design-drift.test.ts:sourceFiles()` es **intocable**

Es el hallazgo que hace peligrosa esta feature, y no estaba en el encargo.
Los tres candados que recorren directorios **no** filtran igual:

| Fichero | Excluye `__tests__/` | Excluye `*.test.tsx` colocado | Efecto de mudar los tests |
|---|---|---|---|
| `consistency-classnames.test.ts:24-36` | sí | **sí** | inmune |
| `legibility-classnames.test.ts:24-36` | sí | **sí** | inmune |
| `design-drift.test.ts:25-35` | sí | **NO** | **los 4 tests mudados entran en el escaneo por primera vez** |

Los tres consumidores expuestos son `C8 → filesMatching(/[A-Za-z0-9_-]+-\[[^\]]+\]/)`,
`R3 → filesContaining('rounded-[20px]')` y `R4 → filesContaining('text-[10px]')`,
los tres con `.toEqual([])`.

**Medido hoy: los cuatro tests traen cero coincidencias de las tres formas**, así
que R7 se cumple por construcción. Pero la tentación al ver un rojo ahí sería
"arreglar" el helper — y **eso fue el bloqueante H1 que hizo RECHAZAR la ronda 1
de #94** (`specs/mobile-map-staleness-single-source/requirements.md` §E2,
*"R10 no puede volver a apoyarse en el helper compartido: eso es exactamente lo
que provocó el rechazo"*). Si algún día entra un fichero sucio, **se limpia el
fichero, no el helper**.

### D13 — Un commit rojo y uno verde por ruta

Ver [[tasks]] §Orden. El rojo mueve y deja los candados viejos; el verde los
repunta. Alternativa descartada en §4.

### D14 — `git mv`, para que el diff se lea como rename

`git mv` preserva la identidad del blob y hace que `git log --stat -M` y
`git diff -M --stat` muestren `renamed:` en vez de un borrado más un alta. R8 lo
exige como comprobación. Un borrar-y-crear con el mismo contenido también lo
detectaría por similitud, pero `git mv` lo hace determinista.

## 3. Archivos afectados

Todo en la capa de **presentación** de la app móvil (`mobile-pet-tracker/`).
Ninguna capa `domain` / `application` / `infrastructure` del backend se toca,
así que C3 no aplica a esta feature.

Rutas relativas a `mobile-pet-tracker/` salvo la primera fila.

| Fichero | Qué cambia | R-ids |
|---|---|---|
| `docs/conventions.md` (raíz del repo) | líneas 445-446 → viñeta con la excepción A10 | **R1** |
| `src/app/(tabs)/map.tsx` | 406 líneas → route delgado de 5 líneas (`MapRoute`) | R2 |
| `src/screens/map/index.tsx` | **nuevo** (`git mv` del cuerpo); `export default function MapScreen` → `export function MapScreen` | R2 |
| `src/app/(tabs)/__tests__/map.test.tsx` | **desaparece** (`git mv`) | R2 |
| `src/screens/map/index.test.tsx` | **nuevo**; solo prefijos `../../../` → `../../` y el import del body (D2, D3). 58 tests intactos | R2, R8 |
| `src/app/(tabs)/health.tsx` | 279 líneas → route delgado (`HealthRoute`) | R3 |
| `src/screens/health/index.tsx` | **nuevo**; una línea de export | R3 |
| `src/app/(tabs)/__tests__/health.test.tsx` | **desaparece** | R3 |
| `src/screens/health/index.test.tsx` | **nuevo**; 28 tests intactos | R3, R8 |
| `src/app/(tabs)/weight-log.tsx` | 341 líneas → route delgado (`WeightLogRoute`) | R4 |
| `src/screens/weight-log/index.tsx` | **nuevo**; una línea de export | R4 |
| `src/app/(tabs)/__tests__/weight-log.test.tsx` | **desaparece** | R4 |
| `src/screens/weight-log/index.test.tsx` | **nuevo**; 32 tests intactos | R4, R8 |
| `src/app/(tabs)/meal-schedule.tsx` | 324 líneas → route delgado (`MealScheduleRoute`) | R5 |
| `src/screens/meal-schedule/index.tsx` | **nuevo**; una línea de export | R5 |
| `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | **desaparece** | R5 |
| `src/screens/meal-schedule/index.test.tsx` | **nuevo**; 23 tests intactos | R5, R8 |
| `src/__tests__/ui-copy-table.ts` | campo `file` de **68** filas (17+13+19+19). Cero filas añadidas o quitadas | R2, R3, R4, R5 |
| `src/__tests__/consistency-classnames.test.ts` | 7 sitios: `:110`, `:174`, `:275`, `:277`, `:278`, `:279`, `:341`, `:351`, `:352` **menos** `:168` y `:398` (food) | R2, R3, R4, R5 |
| `src/__tests__/legibility-classnames.test.ts` | 4 sitios: `:92`, `:124`, `:126`, `:155` **menos** `:91` y `:125` (food) | R2, R3, R5 |
| `src/__tests__/design-drift.test.ts` | ternario `:84-86` (**R6**); `#87 R19` `:432-435`; `#94 R10` `:529`. **`sourceFiles()` `:25-35` NO se toca** (D12) | R2, R3, R4, R5, R6, R7 |
| `src/__tests__/ui-language.test.ts` | **NADA.** Ver D5 | — |
| `src/app/(tabs)/__tests__/screens.test.tsx` | **NADA.** Ver D8 | — |
| `feature_list.json` (raíz) | #102 → `done`; deuda de `food.tsx` y los números corregidos | R9 |

### 3.1 Ficheros que esta feature tiene **prohibido** abrir

De #106/#107, en vuelo (§0.2):

- `mobile-pet-tracker/src/app/(tabs)/food.tsx`
- `mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx`
- `mobile-pet-tracker/src/screens/home/index.tsx` y `index.test.tsx`
- `mobile-pet-tracker/package.json` (`expo-haptics`)
- `docs/ui-guidelines.md`

Y todo `backend-pet-tracker/`.

### 3.2 Matriz ruta → candados que la nombran

Lo que hay que repuntar en el commit verde de cada ruta. **Verificado con un
`grep -rn` exhaustivo sobre `src/` y `test/`: no hay ningún otro sitio.**

| | map | health | weight-log | meal-schedule |
|---|---|---|---|---|
| `ui-copy-table.ts` | 17 filas | 13 filas | 19 filas | 19 filas |
| `consistency-classnames` `:110` skeleton | — | sí | — | — |
| `consistency-classnames` `:174` tile | — | — | sí | — |
| `consistency-classnames` `:275-279` corner | `:277` (4) | `:275` (2) | `:279` (1) | `:278` (1) |
| `consistency-classnames` `:341-352` tabular | `:341` (3) | `:351` (2) | `:352` (2) | — |
| `legibility-classnames` `:92` accent card | — | — | — | sí |
| `legibility-classnames` `:124-126` tinta | `:126` (2) | `:124` (1) | — | — |
| `legibility-classnames` `:155` warning | — | sí | — | — |
| `design-drift` `:84-86` ternario | sí | sí | sí | sí (**R6**) |
| `design-drift` `:432-435` signOut | `:433` (0) | `:432` (0) | `:435` (1) | `:434` (1) |
| `design-drift` `:529` staleSeconds | `:529` (1) | — | — | — |

## 4. Alternativas descartadas

- **Migrar las cinco rutas, `food.tsx` incluida.** Descartada: #106/#107 la
  tienen en vuelo y moverla rompe la regla de un solo escritor de `CLAUDE.md`.
  El criterio de aceptación 4 de la entrada ya autoriza el recorte. §0.2.
- **Esperar a que #106/#107 mergeen para hacer las cinco de una.** Descartada:
  bloquea #102 por tiempo indefinido y el reparto de ficheros ya garantiza
  intersección vacía. La deuda queda nombrada en R9.
- **Colapsar el ternario de `design-drift.test.ts:84-86` a una sola rama**
  (`join(sourceRoot,'screens',screen,'index.tsx')`), como sugería el encargo.
  **Descartada por falsa**: `food` sigue en `app/(tabs)/`, así que esa rama
  leería `src/screens/food/index.tsx`, que no existe → ENOENT → rojo. Se
  **invierte** a una condición nombrada sobre `food` (R6).
- **Un solo commit por ruta, moviendo y repuntando a la vez.** Descartada: no
  deja historial rojo→verde y **eso es exactamente lo que incumplió #19**
  (C4, punto segundo). Con dos commits el rojo es real, observable y atribuible
  candado a candado.
- **Un solo commit para toda la feature.** Descartada por lo mismo, y además
  haría irrevisable un diff de ~1350 líneas movidas.
- **Relajar `design-drift.test.ts:sourceFiles()` para que excluya los
  `*.test.tsx` colocados**, igualándolo a los otros dos candados. Descartada:
  es el bloqueante H1 que hizo rechazar la ronda 1 de #94. **D12**.
- **Añadir un `index.ts` de barril por screen.** Descartada: `src/screens/` no
  tiene ninguno hoy y la resolución a `index.tsx` ya funciona. **D4**.
- **Normalizar de paso `home/index.test.tsx` a `from '.'`.** Descartada: fuera
  de alcance, y tocar `screens/home/` invade a #106/#107. **D3**.
- **Añadir los cuatro routes a `design-drift.test.ts:125-131`** o darles test de
  delegación. Descartadas: aserciones nuevas, mueven el total. **D7**, **D10**.
