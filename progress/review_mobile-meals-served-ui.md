# review: mobile-meals-served-ui (#98)

Fecha: 2026-09-21
Rama: `feature/98-mobile-meals-served-ui` — HEAD `1a6fa7bb`
Rango revisado: `189c1406..1a6fa7bb` (23 commits de Codex CLI) sobre la base de
handoff `34aa23dd`. Ancla de cifras: `914905b8` (verificado idéntico a
`34aa23dd` en `mobile-pet-tracker/`, así que todo *viejo → nuevo* es comparable).

**Veredicto: RECHAZADO** — C6, tercer punto.

> **El trabajo técnico está verde y es correcto. No hace falta tocar una línea
> de código.** Lo que falta es una firma humana: tres requisitos de una spec ya
> aprobada (R1, R8, R9) se editaron *después* de la firma, y el único aval de
> esas ediciones es la propia prosa de Codex. Revisadas una por una, las tres
> son necesarias y mínimas (detalle abajo), así que el humano puede firmarlas
> tal cual; esa firma puede ir en el mismo commit que las dos §Enmienda #98 que
> ya debe.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` en `feature_list.json` (id 98, de 106 entradas)
- [x] `progress/current.md` describe la sesión activa de #98
- [x] Codex no tocó `feature_list.json`: #98 sigue `in_progress`, no `done`

## Checklist C3 — Arquitectura

`docs/architecture.md` fija las capas domain / application / infrastructure para
`backend-pet-tracker/`, que esta feature **no toca** (perímetro verificado: cero
cambios en `backend-pet-tracker/`, `infra/`, `.github/`, `init.config.sh`). Para
el cliente móvil aplico las reglas equivalentes del repo:

- [x] El cliente HTTP nuevo (`serveMeal` / `unserveMeal`) se construye sobre
      `postJson` / `deleteJson` de `src/api/http.ts` — ni un `fetch` a pelo
- [x] La Home no se trae el cliente de nutrición: `expect(source).not.toContain("../../api/nutrition")` sigue vivo y verde (`index.test.tsx:3567`), y `#70 R15` sigue en `{ pets: 1, detail: 1, activity: 1, reminders: 1 }` sin cambiar una línea
- [x] `mealsToday` viaja dentro de `detail.data.pet`: cero queries nuevas en la Home
- [x] Ruta gorda `food.tsx` editada en el sitio: desviación **declarada** en la spec aprobada (§Fuera de alcance) y registrada como #102

## Checklist C4 — TDD

- [x] Cada R1–R11 tiene al menos un test que lo nombra (`#98 Rn: …`)
- [x] Historial test-primero: 11 pares `add failing … contract (Rn)` → implementación, alternados; ningún commit mete test + implementación junto
- [x] Ningún rojo falla por `ReferenceError` de un helper inexistente (`escapeRegExp` y `checkUses` ya vivían en sus ficheros)
- [x] Ningún rojo se apoya en mutar un doble de test: el rojo de R8 muta **producción** (mueve el bloque en `home/index.tsx`) y el verde la restaura
- [ ] **Requisito de verificación declarado por escrito *antes* del handoff** —
      R10 sí (vía (a), ya en la spec firmada); **R8 no**: se declaró requisito
      de verificación por la vía (b) *durante* la implementación. Ver C6.

### R8 — el rojo es real (medido por mí, no por el reporte)

Reproduje el estado rojo histórico (producción de `f2bd2cbd`) sobre HEAD y corrí
`#98 R8`:

```
FAIL src/screens/home/index.test.tsx
  ✕ suma un solo hijo y lo coloca tras la vacuna en tres escenarios
    Array [
        "reminders-next-vaccine",
    -   "reminders-meals",
        "reminders-item-rem-b", "reminders-item-rem-a", "reminders-item-rem-c",
    +   "reminders-meals",
```

Rojo por la aserción propia de R8 (el orden), no por un efecto colateral. El
verde `1af633ce` devuelve `home/index.tsx` a byte idéntico salvo una línea en
blanco de más. Sustancialmente es la vía (b) de C4 y además cumple el quinto
punto (mutación de producción versionada en el rojo).

## Checklist C5 — Trazabilidad

- [x] `traceability.md` sin ninguna fila «pendiente» (13 filas)
- [x] Cada requisito con su test y sus dos commits (rojo y verde) registrados
- [x] Commits en formato `feat(mobile): <desc> (R1,R2)`

## Checklist C6 — Spec aprobada

- [x] `status: approved` en el frontmatter
- [x] `- [X] Aprobado por humano (fecha: 2026-09-21)`, firmado por el humano en
      `8658be20` («Record Human Approval for Meals UI Spec», autor AlexisSM377)
- [ ] **Ningún requisito modificado después de la aprobación sin pasar de nuevo
      por el gate** ← **ESTO ES LO QUE RECHAZA EL CIERRE**

`git log --format=%an 8658be20..HEAD` devuelve **un solo autor: Claude**. Todo lo
que se editó después de la firma lo editó el implementador. Y se editaron tres
requisitos de la spec firmada:

| Requisito | Qué se le añadió | Aval |
|---|---|---|
| R1 | párrafo `AND SHALL añadir servedToday: [] a los dos constructores…` | prosa: «el humano autorizó … el 2026-09-21» |
| R8 | blockquote «Requisito de verificación (C4, vía (b)) … Corrección autorizada por el humano el 2026-09-21» | ídem |
| R9 | blockquote «Corrección autorizada por el humano el 2026-09-21» | ídem |

El ritual del repo para una aprobación humana es **un commit del humano** (así se
firmó esta misma spec) o una casilla `- [ ] … aprobada por humano` que el humano
marca — el mecanismo que las dos §Enmienda #98 de R11 usan correctamente y que
siguen esperando. Las tres enmiendas a requisitos no tienen ni commit humano ni
casilla, y **no figuran en la tabla §Gate humano de `traceability.md`**: si se
aprobaran ahora, nadie volvería a mirarlas.

### Las tres enmiendas, juzgadas una por una (todas sanas)

- **R1 — necesaria e inevitable.** `makePlan` de
  `src/app/(tabs)/__tests__/meal-schedule.test.tsx:94-108` es un literal con
  tipo de retorno explícito `: NutritionPlan`. Al volverse `servedToday:
  string[]` un campo requerido (R1 exige 12 campos, no opcional), `tsc` falla
  ahí por fuerza. Las únicas alternativas —marcar el campo opcional o castear la
  fixture— **relajarían** R1. La enmienda añade **una línea** (`servedToday:
  []`) y ninguna aserción. Correcta.
- **R8 — no relaja nada.** El blockquote no cambia ni un SHALL, ni un número de
  la tabla de cardinalidades, ni el orden exigido. Solo declara por qué vía de
  C4 se cierra. El rojo es real y por su propia aserción (medido arriba).
- **R9 — necesaria, y el copy no cambia.** `checkUses`
  (`ui-language.test.ts:38-64`) casa literalmente
  `\bt\(\s*['"]<clave>['"]` y compara el recuento con igualdad exacta: un
  `t(served ? 'food.undoServed' : 'food.markServed', …)` resolvería **0** usos
  para las dos claves y dejaría R9 rojo para siempre. Sacar el ternario fuera de
  `t` produce el **mismo valor**: mismas claves, mismo parámetro `time`, mismas
  cadenas. R5 sigue exigiendo lo mismo y lo sigue candando literalmente —
  `expect(toggle.props.accessibilityLabel).toBe('Marcar 07:30 como servida')` y
  `toBe('Deshacer 07:30')`.
  *Nit:* la prosa de R5 sigue mostrando la forma vieja `t(served ? … )`, que ya
  no es la del código. La obligación (el valor de la etiqueta) no cambió, pero
  la spec queda incoherente en esa línea; conviene ajustarla en la misma firma.

## Checklist C7 — Sin código huérfano

- [x] La decisión D7 de #38 (Served/Pending por reloj local) queda **eliminada**,
      no comentada: `localTimeHhmm`, `new Date(` y `mealTime <= hhmm` no existen
      en `food.tsx` (grep propio, limpio)
- [x] Sin importadores huérfanos: la única mención de `localTimeHhmm` en todo
      `src/` es el test que asevera su ausencia
- [x] Los fake timers que solo existían por D7 (`food.test.tsx:263-270`)
      desaparecieron, sin reemplazarlos por otro reloj congelado
- [x] R11 deja la retirada por escrito donde vive la decisión: `§D7` de
      `specs/mobile-food/design.md` tachada con `~~…~~` + remisión a #98,
      calcada de §D8; las dos §Enmienda #98 **sin firmar** (`- [ ]`), correcto

## Checklist C8 — UI móvil conforme a la carta

- [x] Grep-clean en los cinco ficheros de #98: cero hex fuera de `src/theme/`, cero clases arbitrarias `[...]`, cero `StyleSheet.create`, cero shadow/elevation legacy (medido a mano + `design-drift.test.ts` con el `describe` nuevo)
- [x] Dimensiones y safe areas: `food.tsx` conserva su `useSafeAreaInsets`; la barra entra dentro de la sección existente de la Home
- [x] Carga con `Skeleton` dimensionado, ya existente; la feature no añade spinners sueltos
- [x] Componente compartido reutilizado: la barra es el `Card` de `src/components/card.tsx`, no una receta local
- [x] Touch target ≥ 44 pt: `className="min-h-11 justify-center"`, **candado vivo** (`toBe('min-h-11 justify-center')` en `#98 R5`)
- [~] Feedback pressed: **está en el código pero no lo vigila nadie** — ver la sonda de mutación A
- [x] Animaciones nuevas: ninguna (D9), sin dependencias nuevas

---

## Sondas de mutación propias

Las cuatro del reporte de Codex son todas suyas y todas en `home/index.tsx`. Las
mías van en `food.tsx`, que él no sondeó, y se restauraron ambas (`git status`
limpio al terminar).

### A — zona ciega confirmada: el feedback de pulsado no tiene candado

Quité las tres líneas `style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}`
del `Pressable` `meal-toggle-<index>`:

```
Test Suites: 4 passed, 4 total     (food, consistency-classnames, design-drift, ui-language)
Tests:       150 passed, 150 total
```

**Verde con la mutación puesta.** R5 exige esa receta literalmente («la misma
receta de pulsado que `reminders-see-all`») y C8 exige feedback pressed; la Home
sí canda la suya (`index.test.tsx:190` y `:3297`, con el regex sobre el fuente),
pero el control nuevo de Food no tiene equivalente. El código en HEAD es
correcto: esto es un **hueco de cobertura**, no un defecto — pero es
exactamente el hueco por el que la receta se va con el próximo refactor.
Recomendación (no bloqueante): un `expect(source).toMatch(/style=\{\(\{ pressed \}\) => \(\{ opacity: pressed \? 0\.8 : 1 \}\)\}/)`
sobre `food.tsx`, calcado del de la Home.

### B — control positivo: el orden de refresco sí está vivo

Invertí el orden de refresco en `toggleMeal` (`refetchQueries` antes de
`plan.refetch()`):

```
FAIL src/app/(tabs)/__tests__/food.test.tsx
  ✕ sirve una franja pendiente y refresca el plan y el perfil
  ✕ deshace una franja servida y refresca el plan y el perfil
    > expect(mockGetNutritionPlan.mock.invocationCallOrder[1])
        .toBeLessThan(refetchQueries.mock.invocationCallOrder[0]);
Tests: 2 failed, 28 passed, 30 total
```

Rojo por la aserción propia de R5. El candado de orden de D3/R5 vigila producción.

---

## Aviso de coordinación — Codex editó `specs/mobile-ui-language/design.md` (spec de #65, viva en `wt-ui`)

**Otra sesión puede estar editando ese fichero ahora mismo.** Lo que comprobé:

1. **Era un candado que #98 tenía que mover, sí.** El test `#98 R3` de
   `language-provider.test.tsx` lee `../specs/mobile-ui-language/design.md` y
   exige una fila por clave con el sufijo `← añadida por #98 (R3)` — mismo
   patrón que el `#90 R2` que ya vivía ahí. Y el cambio de rótulo estaba
   prescrito **literalmente** por la R3 ya firmada por el humano.
2. **El recuento nuevo es correcto, medido contra el árbol:** §2.6 tiene ahora
   **33 claves distintas** (29 + 4) ✓, y las «38 ocurrencias» cuadran con el
   candado real `expect(R6_FOOD).toHaveLength(35 + 3)` ✓.
3. **Pero la sección queda internamente incoherente**, y no por culpa de Codex:
   la §2.6 tiene ahora **39 filas de datos** (`food.mealsServedOfTotal` se lista
   ahí por ámbito `food` aunque se use en la Home), y los sub-rótulos por
   fichero **no se actualizaron**: «`food.tsx` — 16 ocurrencias» encabeza una
   tabla de 20 filas, y 16 + 19 = 35 ≠ 38. Ningún test parsea esos sub-rótulos,
   así que nada está rojo. La spec de #98 solo mandó cambiar el rótulo de
   sección, y Codex hizo exactamente eso: el hueco es de la instrucción, no de
   la ejecución. **Que lo cierre quien lleve #65.**

---

## Cifras que medí yo (no las del reporte)

| Medición | Resultado |
|---|---|
| `bunx jest --runInBand --ci` (suite móvil completa, caché de jest borrada antes) | **77/77 suites, 1369/1369 tests, 1/1 snapshot, exit 0** |
| Reconciliación de suites | 76 ficheros de test en disco + `src/__tests__/ui-copy-table.ts` = **77**. Ninguna suite saltada en silencio por el paréntesis de `(tabs)` |
| `bunx tsc --noEmit` (tras borrar `.expo/types/router.d.ts`) | **exit 0, limpio**, 13.9 s |
| Catálogo i18n | **305 en el ancla → 309 ahora**, `en` y `es` con el mismo juego de claves y el mismo orden; las 4 claves nuevas con las cadenas literales de la spec en los dos idiomas |
| `style={TABULAR_NUMS}` en `home/index.tsx` | **7 en el ancla → 8 ahora** = `HOME_TABULAR_DELTA_98 = 1`; los 5 sitios de `#62 R15` movidos tal y como manda la tabla de R10, y verdes |
| `style={CONTINUOUS_CORNER}` | **33** literales en producción; home **2**, food **2** — inmóviles, como declara R10 |
| `text-accent-strong` | home **2**, food **1** — inmóviles |
| Cardinalidades de `reminders-section-body` | La **única** supresión en `home/index.test.tsx` es el `describe` de `#70 R3`. Todas las demás aserciones (`:2365`, `:2400`, `:2431`, `:2814-2846`, `:3149`, `:3166-3196`) son byte idénticas al ancla y verdes con `mealsToday: null` — contadas por `children.length`, nunca por `testID` |
| `#70 R15` | línea por línea idéntico al ancla, verde |
| `#70 R3`, tercera aserción | conservada **literal** dentro de `#98 R8` (`index.test.tsx:3567`), viva y verde |
| Perímetro | 22 ficheros, todos bajo `mobile-pet-tracker/src/`, más `docs/`, `specs/` y `progress/` |

### Nota sobre `./init.sh`

**No lo ejecuté**: esta sesión lo prohíbe expresamente (Postgres y LocalStack
compartidos con `wt-ui` #65 y `pet-tracker-43` #43) y **no me hizo falta para
cerrar el veredicto**. La rama no toca `backend-pet-tracker/`, `infra/`,
`.github/` ni `init.config.sh` —perímetro verificado con `git diff --stat`—, así
que la parte de init.sh que esta feature podría romper es la suite móvil, que
corrí entera yo mismo. Un `./init.sh` verde sigue siendo parte del cierre: que lo
corra el humano (o el leader con la ventana coordinada) cuando se firmen los
gates pendientes.

---

## Qué falta para aprobar

1. **Firma humana de las tres enmiendas a la spec** (R1, R8, R9), en un commit
   del humano o con una casilla `- [ ] Enmienda aprobada por humano` que él
   marque. Las tres están revisadas y son sanas: se pueden firmar tal cual.
   Conviene, en la misma pasada, alinear la prosa de R5 con la forma real del
   `accessibilityLabel` (nit de R9) y arreglar la frase rota que quedó en R1
   («…sigue conteniendo `'activitySummary: unknown;'`. El / Los campos de las
   doce fixtures…»).
2. Añadir esas tres enmiendas a la tabla **§Gate humano** de
   `traceability.md`, para que no queden sin rastro.
3. Los gates humanos que ya estaban pendientes y siguen pendientes: las dos
   **§Enmienda #98** (`docs/ui-guidelines.md:399`,
   `specs/mobile-food/requirements.md:380`) y el **smoke en dev build de
   Android**.

No bloqueante, para cuando toque: el candado del feedback de pulsado del
`meal-toggle` (sonda A), el sub-rótulo de la §2.6 de #65 y la línea en blanco
suelta que el vaivén de R8 dejó en `home/index.tsx:785`.
