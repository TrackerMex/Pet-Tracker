# review: mobile-ui-consistency-polish

Fecha: 2026-09-04
Feature: **#62**, branch `feature/62-mobile-ui-consistency-polish`
Worktree revisado: `/home/claude/sites/Pet-Tracker-wt-ui`
Commit revisado: `8bc32ce0fc574036fc20f7beb495886c8a2d406e`
Base: `origin/main` = `b222d33` (merge-base verificado)

**Veredicto: APROBADO**

Con la reserva de proceso, no de código, que se detalla en §Observaciones: el
gate humano **AC8 sigue abierto** y el `leader` **no** debe marcar la feature
`done` hasta que el humano lo firme.

Todos los números de este reporte los obtuve yo ejecutando los greps sobre el
árbol en `8bc32ce`. No heredé ninguno del reporte del implementer ni de
`progress/gate_r16_mobile-ui-consistency-polish.md`; comparé al final y
coinciden.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress`: `#62 mobile-ui-consistency-polish`
      (verificado sobre `feature_list.json`; ninguna otra fila en ese estado)
- [x] `progress/current.md` actualizado, con la feature, el worktree, la
      branch, el reparto con la sesión paralela y el solape con #63 anotados
- [x] `./init.sh` reporta `STATUS.md` sincronizado con `feature_list.json`
- [x] El working tree quedó limpio tras mi ejecución de `./init.sh`
      (el paso de lint del backend usa `eslint --fix`, así que lo comprobé:
      `git status --porcelain` vacío, sin drift)

## Checklist C3 — Arquitectura

Feature exclusivamente de superficie móvil; las capas de `docs/architecture.md`
(domain / application / infrastructure) viven en `backend-pet-tracker/`, que
esta rama no toca. Lo que sí aplica es `docs/conventions.md` §Convenciones de
la app móvil y `docs/ui-guidelines.md`:

- [x] `domain` sin imports de `infrastructure` — **N/A**: cero archivos de
      backend en el diff
- [x] `application` depende de interfaces — **N/A** por lo mismo
- [x] Los dos valores nativos nuevos viven en `mobile-pet-tracker/src/theme/`
      (`native-styles.ts`), con el mismo precedente y la misma justificación
      escrita que `TOUCH_SLOP` de `theme/touch-target.ts`. No son tokens de
      diseño (esos siguen solo en `global.css`), son props de React Native sin
      utilidad CSS equivalente
- [x] Route delgado + `src/screens/` intacto: ningún archivo de `src/app/`
      gana lógica
- [x] Cero `StyleSheet.create`, cero hex fuera de `src/theme/`, cero clases
      arbitrarias `[...]`, cero `shadow*`/`elevation` legacy (conteos abajo).
      `StyleSheet.flatten` en `card.tsx` no es `StyleSheet.create` y está
      autorizado por `design.md` §2 D8
- [x] `mobile-pet-tracker/src/theme/global.css` **sin un solo cambio**

## Checklist C4 — TDD

- [x] Cada R1-R15 tiene al menos un `describe` que nombra su R-id. Los 25
      bloques `describe('#62 R…')` están donde `design.md` §6 y
      `traceability.md` dicen. R16 no tiene test de jest por diseño: es el
      gate mecánico que ejecuta este reporte
- [x] **Historial test-primero real, no reconstruido.** Clasifiqué los 55
      commits del rango `b222d33..8bc32ce` por tipo de archivo tocado:
      **ningún commit mezcla un archivo de test con uno de producción.**
      15 commits rojos (solo tests), 15 verdes (solo producción, salvo
      `8732d69` que además escribe la regla de R1 en la carta, que *es* parte
      de R1), 15 de trazabilidad, 4 ajustes aislados y 2 del gate R16
- [x] **Verifiqué que el rojo era rojo**, no solo que el mensaje lo dijera.
      Cinco ciclos reconstruidos con `git checkout` del commit y ejecución
      dirigida de la suite (por encima del mínimo de tres):

| R-id | Commit rojo | Resultado en el rojo | Commit verde | Resultado en el verde |
|---|---|---|---|---|
| R3 | `2357828` | 3 suites fallan, **4 tests fallan** | `4078c42` | 3 suites pasan, 5 tests pasan |
| R6 | `3a63cb5` | 1 suite falla, **1 test falla** | `338de85` | 1 suite pasa, 1 test pasa |
| R12 | `200fbe8` | 3 suites fallan, **4 tests fallan** | `cc1d927` | 3 suites pasan, 4 tests pasan |
| R14 | `20cc490` | 2 suites fallan, **17 tests fallan** | `617d700` | 2 suites pasan, 17 tests pasan |
| R15 | `fe78420` | 2 suites fallan, **6 tests fallan** | `30d3285` | 2 suites pasan, 7 tests pasan |

- [x] Orden de implementación R1→R2→R3→R4→R5…R13→R14→R15→R16 respetado
      exactamente como lo exige `design.md` §10 y `tasks.md`
- [x] Mínimo de 32 commits superado con holgura (51 desde el primer rojo
      `b6ffba4` hasta `ac4537f`)

### Los 4 "ajustes aislados" que tocan tests — revisados uno por uno

El invariante prohíbe editar un `.test.tsx`/`.test.ts` preexistente salvo para
**añadir** bloques `describe('#62 R…')`. Los cuatro caen **dentro de bloques
`#62` añadidos por esta misma feature**; ninguno toca un assert de conducta
preexistente:

| Commit | Qué hace | Dónde | Veredicto |
|---|---|---|---|
| `dd687cc` | Añade `weekComparison` al mock de `getDailyActivity` | `beforeEach` de `describe('#62 R5')` en `home.test.tsx` | Completar una fixture nueva. OK |
| `4d7bcbf` | `.toBe(` → `.toContain(` sobre `home-loading.props.className` | dentro de `describe('#62 R8')` | Es un aflojamiento, pero de un test **nuevo**, y con causa real: el `Skeleton` de heroui añade su clase base, así que la igualdad de cadena era imposible. Sigue aseverando la cadena entera `'h-12 w-full rounded-card'`, así que R8 sigue fijado. `design.md` §4 R3 ya prescribe `toContain` para este caso. OK |
| `5752023` | Añade una segunda medición a la fixture de pesos | `beforeEach` de `describe('#62 R9')` | Sin dos puntos el SVG no se dibuja y el test no ejercitaría nada. OK |
| `07780bc` | Cambia el literal esperado de `TABULAR_NUMS` | dentro de `describe('#62 R14')` | Ver §R15 abajo. OK |

Confirmación mecánica del invariante: `git diff origin/main...HEAD --numstat`
sobre `*.test.ts`/`*.test.tsx` da **0 líneas eliminadas en los 12 archivos**
(343+54+27+103+50+16+34+20+73+35+33+27 inserciones, `0` borrados en cada uno).
No se puede haber reescrito nada; solo se añadió.

### R15: el cambio sobre la línea literal de la spec — motivo verificado

Codex alegó que `tsc` rechaza el `as const` exterior de la spec. **Es cierto y
lo comprobé en la fuente**, no en su palabra:

```
node_modules/react-native/Libraries/StyleSheet/StyleSheetTypes.d.ts:573
  fontVariant?: FontVariant[] | undefined;
```

React Native **0.86.2** declara `fontVariant` como array **mutable**. La línea
de la spec (`{ fontVariant: ['tabular-nums'] } as const`) produce
`readonly ['tabular-nums']`, que no es asignable a `FontVariant[]`, y rompería
los 14 usos. La solución tipa solo la tupla interna:

```ts
export const TABULAR_NUMS = {
  fontVariant: ['tabular-nums'] as ['tabular-nums'],
} as const;
```

Valor en runtime idéntico, nombre exportado idéntico, API pública idéntica.
Cambio mínimo, aislado en su propio commit y cubierto por `tsc --noEmit` verde
en mi ejecución de `./init.sh`.

## Checklist C5 — Trazabilidad

- [x] `traceability.md` **sin ninguna fila "pendiente" en la tabla de R-ids**:
      los 16 requisitos tienen criterio de aceptación, test y commit
- [x] Cada test referenciado en `traceability.md` existe y nombra su R-id.
      Lo verifiqué grepeando `describe('#62 R` sobre los 12 archivos de test:
      25 bloques, todos en la ruta que la spec declara
- [x] Formato de commit según `tasks.md` §Reglas de commit (que es la regla
      operativa y explícitamente "NO negociable"):
      `test(mobile-ui-consistency): R<n> … (rojo)` y
      `feat|fix|refactor(mobile-ui-consistency): R<n> …`. Los 51 commits lo
      cumplen y **todos nombran su R-id**
- [x] La única fila que dice "pendiente" es **AC8**, en la tabla *Criterios de
      aceptación sin R-id propio*: es el gate humano no delegable a IA. La
      propia spec (`requirements.md` §Aprobación) prevé que el reviewer apruebe
      con AC8 abierto y que el `leader` no marque `done` hasta que el humano lo
      cierre. Queda fuera del alcance de C5, que gobierna las filas de R-ids

## Checklist C6 — Spec aprobada

- [x] `specs/mobile-ui-consistency-polish/requirements.md` con
      `status: approved` en el frontmatter
- [x] Casilla humana marcada, **firmada por el humano con su propio commit**:
      `ade9a2f` "Approve Mobile UI Consistency Polish Spec", autor
      `AlexisSM377 <al222111377@gmail.com>`, que voltea las 6 casillas
      (la de aprobación más los 5 puntos que la spec no puede cerrar sola,
      R14 incluido). El `leader` pasó el frontmatter a `approved` después,
      en `feaa7e2`. Es el flujo de aprobación por commit del repo
- [x] `design.md`, `tasks.md` y `traceability.md` también en `approved`

## Checklist C7 — Sin código huérfano

- [x] `Card as HeroUICard` eliminado del import de `food.tsx` al quedar sin
      usos tras R3 (`Spinner` sigue usado en `:83` y se conserva)
- [x] `Spinner` eliminado del import de `home.tsx` al sustituirlo R8 por
      `Skeleton` (`HeroUICard` sigue usado en `pet-card-error` y se conserva)
- [x] `useThemeColor` eliminado del import de heroui en `forgot.tsx` tras R13
- [x] La variante muerta `last:border-b-0` eliminada de `InfoRow` (R6), y
      **cero** variantes de posición `last:`/`first:`/`odd:`/`even:` en todo
      `src/`
- [x] Ningún test quedó huérfano: no se eliminó ningún componente con tests
      propios; las 4 superficies de R3 se **componen** con `Card`, no se
      sustituyen
- [x] `bun run lint` (`expo lint`) termina limpio, sin warnings de
      `@typescript-eslint/no-unused-vars`, que está activo en la config
      efectiva del proyecto

## Checklist C8 — Carta de UI

- [x] Se cargaron `expo:expo-overview` y las skills que `docs/ui-guidelines.md`
      §Skills indica, tanto en la implementación (declarado en el impl report)
      como en esta revisión
- [x] **R1: `docs/ui-guidelines.md` recibió el texto de `design.md` §7 tal
      cual.** Lo comparé mecánicamente, no a ojo: extraje las 22 líneas del
      bloque §7 quitando el prefijo `>` de cita y las diffeé contra las líneas
      128-149 de la carta. `diff` sin salida: **idénticas**
- [x] Cero `Color.ios.*`, cero sistema de estilos de `appllama`; el patrón se
      toma, el sistema no

---

## Verificación de alcance (R16, primera mitad)

`git diff origin/main...HEAD --stat` — 40 archivos:

- **0** archivos bajo `backend-pet-tracker/`
- **0** archivos bajo `infra/`
- **0** cambios en `mobile-pet-tracker/src/theme/global.css`
- **0** líneas eliminadas en cualquier `*.test.ts` / `*.test.tsx`

### `testID`: comparación exhaustiva main vs HEAD

Extraje el conjunto de `testID` de **todos** los archivos de producción de
`mobile-pet-tracker/src` en `origin/main` y en `HEAD` y los diffeé:

```
testIDs en origin/main: 269
testIDs en HEAD:        271
Solo en HEAD:  `warning-card-${warning.code}`, `weight-chart-card`
Solo en main:  (ninguno)
```

Exactamente **+2, cero eliminados, cero renombrados**. Y los dos añadidos son
literalmente los dos que `design.md` §6 autoriza, en la tabla ***`testID`
nuevos (2, ninguno renombrado ni eliminado)***, con el requisito que los pide
(R3 y R9). Confirmado además que `warning-card-` no entra en el regex
`/^plan-warning-/` de `food.test.tsx:332`, que era la razón del nombre.

### Conducta: cero cambios

Filtré el diff de producción por todo lo que podría ser conducta
(`useState`, `useEffect`, `useFocusEffect`, `useCallback`, `useMemo`,
`router.*`, `onPress=`, `onChangeText`, imports de `api/`, `await`, `async`,
`setTimeout`, `fetch(`). El resultado es **una sola pareja de líneas**:

```
-                onPress={() => router.push('/pairing')}
+                    onPress={() => router.push('/pairing')}
```

Expresión idéntica; solo cambia la indentación al recomponer con `Card`.
Coincide con lo que el implementer declaró. El reset de estado reservado para
#63 no se tocó.

### Texto visible: cero cambios

Comparé las cadenas de texto JSX de producción entre `main` y `HEAD`. Las
únicas tres diferencias (`Meals today`, `Meal schedule`, `Nutrition profile`)
son sitios de R5 donde el `<Text>` pasó a multilínea al alargarse el
`className`: la cadena es byte a byte la misma, solo se reflowó. Verificado
leyendo los tres hunks. **Ninguna cadena añadida, cambiada ni eliminada.**

---

## Conteos anti-slop rehechos (R16, segunda mitad)

Alcance: `mobile-pet-tracker/src/**/*.{ts,tsx}` excluyendo `__tests__/` y
`*.test.ts(x)` — **61 archivos de producción**. Estos son **mis** números.

| Métrica de `design.md` §5 | Esperado | **Obtenido** | ✔ |
|---|---:|---:|:--:|
| Hues de acento distintos | 1 | **1** | ✔ |
| `rounded-2xl` | 0 | **0** | ✔ |
| `rounded-lg` | 0 | **0** | ✔ |
| `rounded-md` | 0 | **0** | ✔ |
| `rounded-sm` | 0 | **0** | ✔ |
| Radios no-cápsula distintos en uso | 2 | **2** (`rounded-card`, `rounded-xl`) | ✔ |
| Glifo `←` | 0 | **0** | ✔ |
| Glifo `›` | 0 | **0** | ✔ |
| Emoji de iconografía preservados | 8 | **8** | ✔ |
| Usos de `CONTINUOUS_CORNER` | 33 sitios | **33 sitios** (32 ocurrencias textuales) | ✔ |
| Usos de `TABULAR_NUMS` | 14 | **14** | ✔ |
| Tratamientos del título de card | 1 | **1** (`text-base font-bold text-foreground`, 6 sitios) | ✔ |
| Radios del botón primario sólido | 1 | **1** (`rounded-xl`, 12 botones) | ✔ |
| `rounded-2xl bg-accent` | 0 | **0** | ✔ |
| `useThemeColor` de heroui en `src/` | 0 | **0** | ✔ |
| `useThemeColors` pidiendo `'accent'` | 0 | **0** | ✔ |
| `TextInput` con `placeholder` y sin `placeholderTextColor` | 0 | **0** (de 5) | ✔ |
| `TextInput` con `border border-border` | 0 | **0** (de 6) | ✔ |
| Variantes de posición (`last:`/`first:`/`odd:`/`even:`) | 0 | **0** | ✔ |
| Recetas de card a mano fuera de `Card` | 0 | **0** | ✔ |
| Gradientes sin razón de marca | 0 | **0** | ✔ |
| Hex fuera de `src/theme/` | 0 | **0** | ✔ |
| Clases arbitrarias `[...]` | 0 | **0** | ✔ |
| `StyleSheet.create` | 0 | **0** | ✔ |
| `shadow*` / `elevation` legacy | 0 | **0** | ✔ |

### Inventario completo de clases `rounded-*` (la escala, medida)

```
     73 rounded-xl
     34 rounded-full
     22 rounded-card
```

Tres clases, ni una más: exactamente los tres roles que R1 declaró en la carta.
No existe ningún `rounded-2xl`, `rounded-lg`, `rounded-md`, `rounded-sm`,
`rounded-3xl` ni radio arbitrario.

### Sobre el "33 vs 32" de `CONTINUOUS_CORNER`

`grep -c` devuelve **32** ocurrencias textuales de uso (47 totales − 1
definición − 14 líneas de `import`), no 33. **No es un sitio que falte.** La
tabla de `design.md` §4 R14 cuenta `src/components/card.tsx` como **2 sitios**
(las dos ramas de retorno). La implementación factoriza la constante una vez:

```ts
const mergedStyle = StyleSheet.flatten([CONTINUOUS_CORNER, style]);
```

y entrega `mergedStyle` **a las dos ramas** (`Pressable` de la rama `onPress`
y `View` de la rama sin `onPress`). Lo verifiqué leyendo `card.tsx`: ambas
ramas lo reciben. Así que **31 usos directos + 2 ramas cubiertas = 33 sitios**,
que es lo que la spec exige. Codex declaró exactamente el mismo desglose
("31 directas + 2 ramas de `Card`") y coincide con lo que yo medí por separado.

Reparto por archivo de los 31 usos directos, contrastado contra la tabla de
`design.md` §4 R14: `forgot` 1, `home` 1, `food` 2, `map` 4, `meal-schedule` 1,
`weight-log` 1, `health` 2, `docs` 1, `profile` 4, `reminders` 4, `add-pet` 5,
`add-reminder` 3, `pairing` 2. **Coincide archivo por archivo.**

### Reparto de los 14 `TABULAR_NUMS`

`home` 4 (`collar-battery`, `summary-activity`, `summary-sleep`,
`summary-distance`), `map` 3 (`stat-speed`, `stat-distance`, `stat-updated`),
`health` 2 (`weight-current`, `weight-variation`), `weight-log` 2,
`reminders` 3. Coincide con la tabla de `design.md` §4 R15.

**`stat-gps` está correctamente excluido**: su `View` sí lleva
`CONTINUOUS_CORNER` (es un tile `rounded-xl`), pero su `Text` **no** lleva
`TABULAR_NUMS`, porque su contenido nunca es numérico. Verificado en el diff.

---

## Verificación R-id por R-id contra `design.md` §4

Recorrí el diff de producción hunk por hunk. Los sitios que cambiaron son los
enumerados, ni más ni menos:

| R | Esperado | Obtenido | ✔ |
|---|---|---|:--:|
| R1 | 4 botones de `rounded-2xl`→`rounded-xl` + los 8 restantes intactos + texto en la carta | `login:102`, `forgot`, `register:274`, `reset-password:192` cambiados; los 8 restantes sin tocar; carta idéntica a §7 | ✔ |
| R2 | 3 skeletons a `rounded-card`, conservando dimensión, `w-full` y `testID` | `pet-card-skeleton` (h-32), `vaccines-skeleton` (h-24), `reminder-row-skeleton-*` (h-20) | ✔ |
| R3 | 4 superficies al `Card` compartido, sin variant nuevo | `collar-card`, `last-position-card`, avisos de plan, `map-empty-overlay`. `style` absoluto del overlay conservado como objeto plano vía `StyleSheet.flatten`; `onPress` y `accessibilityRole="button"` conservados vía `Card`; `plan-warning-<code>` conservado; import huérfano eliminado | ✔ |
| R4 | 6 sitios a `rounded-xl` | 3 píldoras de `reminders`, tile de `food`, tile de `forgot`, tile `size-8` de `weight-log` (era `rounded-lg`) | ✔ |
| R5 | 6 títulos a `text-base font-bold text-foreground` | `home` "Today's Summary", `health` "Weight", `food` ×3, `meal-schedule` "Nutrition profile". La etiqueta de sección en versalitas **no** se tocó | ✔ |
| R6 | `InfoRow` con `isLast`, sin `last:` | Firma y cuerpo exactos a los de la spec; el 4.º llamador recibe `isLast`; los 3 anteriores conservan `border-b` | ✔ |
| R7 | 4 `←`→`ArrowLeft`, 3 `›`→`ChevronRight` | `docs`, `add-pet`, `add-reminder`, `pairing` + los 3 de `profile`. `testID`, `accessibilityLabel/Role`, `hitSlop` y `className` de los 7 `Pressable` conservados; `pairing-link` sigue sin `hitSlop`, como la spec ordena. Los 8 emoji intactos | ✔ |
| R8 | `Skeleton testID="home-loading" className="h-12 w-full rounded-card"` | Idéntico; `Spinner` fuera del import | ✔ |
| R9 | `Card testID="weight-chart-card"` envolviendo `WeightChart` | Idéntico; `testID="weight-chart"` del SVG intacto; sin cabecera nueva | ✔ |
| R10 | Badge `self-start rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted` | Idéntico, sobre `{document.type}` sin cambiar el texto. Cápsula ⇒ sin `CONTINUOUS_CORNER`, correcto | ✔ |
| R11 | `px-4`→`px-3` en los 2 chips + `text-sm` en su `Text` | Idéntico; `hitSlop={TOUCH_SLOP}`, bordes, `rounded-full`, `testID`, `accessibilityState` y texto conservados | ✔ |
| R12 | 5 × `placeholderTextColor={muted}`, 6 × sin `border border-border` | Idéntico. `useThemeColors` compartido con el `foreground` de R7 donde procedía. Los 3 `Pressable` pseudo-campo no se tocaron salvo por R14 | ✔ |
| R13 | `useThemeColors(['accent-strong'])`, `Lock` con ese color | Idéntico; `useThemeColor` de heroui fuera del import y con 0 usos en `src/` | ✔ |
| R14 | 33 sitios; fusión con `StyleSheet.flatten` en `card.tsx`; cero cápsulas | 33 sitios, archivo por archivo. Verifiqué que ninguna cápsula (`rounded-full`, el avatar, el badge de R10, la tab bar) lo lleva | ✔ |
| R15 | 14 contadores; `stat-gps` fuera | 14, reparto exacto; `stat-gps` sin `TABULAR_NUMS` | ✔ |
| R16 | Gate mecánico | Este reporte | ✔ |

---

## Suite y tooling

- **`bun run test` = `jest`**, la suite configurada del proyecto. Verifiqué que
  `mobile-pet-tracker/package.json` declara `"test": "jest"` con preset
  `jest-expo`, y que **`git diff origin/main...HEAD` no toca ni
  `package.json`, ni la config de jest, ni `tsconfig.json`, ni
  `eslint.config.js`, ni `bun.lock`**. No se cambió tooling para esconder
  fallos: el diff de configuración está vacío
- La explicación de Codex es correcta: `bun test` es un subcomando nativo de
  Bun que ignora el script de npm; `bun run test` sí lo ejecuta. `init.sh`
  usa `bun run --cwd mobile-pet-tracker test`, es decir, la suite real
- La spec (`requirements.md` R16) pide literalmente "`bun test`". Es un error
  de redacción de la spec, no del implementer

## Output de `./init.sh` (ejecutado por mí, no heredado)

Lo corrí entero, incluido el `pnpm -C infra run synth` que Codex omitió.
**El razonamiento de Codex no se sostiene**: `cdk synth` compila la plantilla
en local (`cdk.out`) y no llama a la API de AWS ni crea recursos — lo prohibido
es `bootstrap`/`deploy`. Debió correrlo. Lo corrí yo y sale verde.

```
══════════════════════════════════════════
  INIT — pet-tracker (Harness SDD)
══════════════════════════════════════════

→ Verificando entorno...
✅ node disponible (/usr/bin/node)
✅ pnpm disponible (/home/claude/.npm-global/bin/pnpm)
✅ bun disponible (/home/claude/.npm-global/bin/bun)

→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida
⚠️  .env desactualizado: faltan 3 claves de .env.example
⚠️    configuración ausente: RESEND_API_KEY, RESEND_FROM, RESET_LINK_HOST
⚠️    init.sh no modifica .env — añade a mano las que necesites desde .env.example

→ Instalando dependencias...
✅ Dependencias instaladas

→ Verificando coherencia del harness...
✅ Archivos del harness presentes
⚠️  Feature en progreso: mobile-ui-consistency-polish
✅ STATUS.md sincronizado con feature_list.json

→ Build...
> backend-pet-tracker@0.0.1 build
> nest build && tsc-alias -p tsconfig.build.json
> pet-tracker-infra@0.0.1 synth
> cdk synth --quiet
✅ Build correcto

→ Ejecutando tests...
  backend:  Test Suites: 163 passed, 163 total
            Tests:       1235 passed, 1235 total
  infra:    Test Suites: 2 passed, 2 total
            Tests:       14 passed, 14 total
  móvil:    Test Suites: 58 passed, 58 total
            Tests:       855 passed, 855 total
            Snapshots:   1 passed, 1 total
✅ Tests pasados

→ Tests e2e...
            Test Suites: 3 skipped, 25 passed, 25 of 28 total
            Tests:       8 skipped, 353 passed, 361 total
✅ Tests e2e pasados

→ Lint...
$ expo lint
✅ Lint sin errores

→ Typecheck...
$ tsc --noEmit
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 58/63 completadas | 4 pendientes

EXIT=0
```

Los avisos de `.env` son preexistentes y ajenos a esta feature (claves de
Resend, que #62 no toca). La suite móvil coincide exactamente con lo que
reportó el implementer: 58 / 855 / 1.

Cero regresiones: los 1235 tests de backend, los 14 de infra y los 353 e2e
siguen verdes.

---

## Observaciones

Ninguna bloquea la aprobación. Se dejan anotadas.

1. **Codex omitió `./init.sh` al cierre con una premisa falsa.** Dijo que
   `BUILD_CMD` incluía CDK y que ejecutarlo estaba prohibido. `cdk synth` no
   crea recursos AWS ni cuesta dinero; lo prohibido es `bootstrap`/`deploy`.
   Debió correrlo. Lo corrí yo y sale verde, así que no hay impacto material,
   pero conviene que el próximo handoff a Codex diga explícitamente que
   `synth` sí se ejecuta. Es la misma clase de error que llevó a saltarse el
   gate final: una prohibición interpretada de más.

2. **Indentación rota en `home.tsx`**, en el `Pressable` `collar-pair-link`
   (~línea 237): el bloque quedó indentado a 20 espacios mientras su `>` de
   cierre y sus hijos siguen a 14 y 16. Es puramente cosmético — `expo lint` y
   `tsc` pasan, el repo no ejecuta `prettier --check` en ningún gate — pero
   ensucia el archivo. Si se quiere limpiar, es un `refactor(...)` de una
   línea; no lo pido como condición.

3. **Import fuera de orden en `add-reminder/index.tsx`**: `native-styles` se
   importa después de `utils/reminder-meta`, rompiendo el agrupamiento que
   sigue el resto del repo. eslint no lo detecta porque `import/order` no está
   activo. Cosmético.

4. **`describe('#62 R14')` contiene el assert de `TABULAR_NUMS`**, que es de
   R15 (`consistency-classnames.test.ts:276`, dentro del bloque que empieza en
   `:259`). Los dos R-ids tienen cobertura propia y suficiente, así que no
   afecta a C4; es solo un bloque mal etiquetado que confunde a quien lo lea
   luego.

5. **El aflojamiento de `4d7bcbf` (`.toBe`→`.toContain`) está justificado pero
   es el patrón que conviene vigilar.** Aquí es inofensivo porque el test es
   nuevo y sigue aseverando la cadena completa. Anotado para que no se
   normalice como recurso ante un test que falla.

6. **`requirements.md` R16 pide literalmente `bun test`**, que en Bun invoca su
   runner nativo y no la suite del proyecto. Corregir la redacción en la
   próxima spec móvil: lo correcto es `bun run test` (o
   `bun run --cwd mobile-pet-tracker test` desde la raíz).

---

## Lo que queda abierto (no lo cierra el reviewer)

- **AC8 — gate humano, no delegable a IA.** Smoke en **dev build de Android**,
  comparando lado a lado con el Figma, en tema **claro Y oscuro**, siguiendo
  los 13 puntos de `tasks.md` §Cierre, y confirmando en particular:
  (a) el placeholder "Reminder title" se lee en tema oscuro — el defecto
  reportado el 2026-09-04; (b) los skeletons no cambian de forma al resolverse
  en Home, Health y Reminders; (c) el título de card se ve igual en Home,
  Health, Food y Meal schedule; (d) la última fila de "Información" en Profile
  ya no cuelga su separador; (e) las flechas de volver y los chevrons se ven
  iguales en todas las pantallas.

  Recordatorio de `design.md` §2 D8: `borderCurve` es **no-op en Android**, así
  que R14 no se verá en el smoke. Es esperado y estaba firmado por el humano
  en el punto 5 de §Aprobación.

- **El `leader` no debe marcar `#62` como `done`** hasta que ese gate esté
  firmado, aunque este veredicto sea APROBADO.

- Antes de cerrar, verificar drift de código entre `origin/main` y el commit de
  este veredicto (`8bc32ce`), como manda el aprendizaje de #59.
