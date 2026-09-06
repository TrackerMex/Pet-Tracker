# review: mobile-ui-language (#65)

Fecha: 2026-09-06
Worktree: `/home/claude/sites/Pet-Tracker-wt-ui`, branch `feature/65-mobile-ui-language`, HEAD `50451ca`
Reviewer: subagente `reviewer` (Claude Code)

## Veredicto: **RECHAZADO**

Un solo defecto bloqueante, acotado a **R18(b)**. Los otros 19 requisitos pasan,
`./init.sh` da **exit 0**, la trazabilidad está completa y las tres firmas
humanas son auténticas. El rechazo **no** cuestiona la migración de copy: la he
verificado por una vía independiente y es correcta y completa.

**Razón en una línea**: el escáner de copy suelta de R18(b) tiene regiones
ciegas en **10 de las 19 pantallas** (hasta el 77 % de un fichero), y he
demostrado un falso verde plantando un literal de copy en una pantalla migrada.

---

## Lo que rehíce, no heredé

Todo con `git archive` a un scratch fuera del árbol. **Nunca `git checkout`.**
El working tree quedó como lo encontré (`git status` limpio, HEAD `50451ca`).

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` en `feature_list.json` (#65, correcto: sigue sin marcarse `done`)
- [x] `progress/current.md` describe la sesión activa, incluido el relevo Codex → `implementer`

## Checklist C3 — Arquitectura

- [x] Los tres módulos nuevos (`src/i18n/catalog.ts`,
      `src/providers/language-provider.tsx`, `src/utils/language-preference.ts`)
      copian patrones ya existentes (`theme-preference`, `selected-pet-provider`)
- [x] Cero dependencias nuevas: `git diff` de `mobile-pet-tracker/package.json` vacío
- [x] `backend-pet-tracker/`, `infra/`, `hosting/`, `app.json` y `src/theme/`: **sin tocar**

## Checklist C4 — TDD

- [x] Cada `R1`–`R20` tiene un `describe('#65 R<n>: …')` que lo nombra — 20/20 comprobados
- [x] **Los 20 ciclos rojo→verde reconstruidos desde git y ejecutados uno a uno**
- [x] **Ningún commit rojo falla por `ReferenceError`** — 0 en las 20 ejecuciones

Resultado de la reconstrucción (rojo de cada R-id, ejecutado con `git archive`):

| R-id | rojo | cómo falla |
|---|---|---|
| R1–R11 | `8c67895`…`05bbf53` | `toEqual` de `checkUses`, nombrando fichero y clave |
| R12 | `ac158f6` | `Cannot find module '../../i18n/catalog'` |
| R13 | `e237589` | `Cannot find module './language-preference'` |
| R14 | `c77fcab` | 2 aserciones (`getByText('Perfil')`) |
| R15 | `103353b` | `expect(formatDate).toHaveBeenCalledWith('es-MX')` en `reminders/index.test.tsx` |
| R16 | `5f4e718` | 2 aserciones |
| R17 | `b682f20` | `Unable to find an element with testID: food-meals-title` |
| R18 | `f82d975` | 2 aserciones, nombrando `map.tsx` y `GPS` |
| R19 | `d26b520` | 2 aserciones |
| R20 | `611c351` | `toContain` del literal de §6.3 |

Dos matices que dejo por escrito en vez de esconderlos:

1. **R12 y R13 fallan por `Cannot find module`**, no por una aserción. No lo
   cuento como incumplimiento: lo que falta es **el módulo de implementación
   que el propio requisito manda crear**, que es el rojo canónico de TDD para
   un módulo nuevo. Lo que C4 prohíbe desde #64 es otra cosa — un **helper de
   test** inexistente, que no demuestra que el candado esté vivo.
2. **La mitad de R15 ya nacía verde** (`useLocale()` en
   `language-provider.test.tsx`). Su otra mitad, la de `reminders`, sí da rojo
   por su aserción. El requisito tiene rojo legítimo.

## Checklist C5 — Trazabilidad

- [x] `traceability.md` con 20 filas, **ninguna «pendiente»**
- [x] Todos los hashes de la tabla existen en la branch y su mensaje coincide
- [x] Formato de commit correcto (`feat|test|docs(<scope>): <desc> (R<n>)`)

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` y la casilla de aprobación marcada (2026-09-05)
- [x] **Las tres firmas de enmienda verificadas una a una**, y las tres son legítimas:

| Enmienda | Firma | Autor | Ficheros que toca | Diff |
|---|---|---|---|---|
| (1) R18 requisito de verificación C4(b) | `5f59a58` | `AlexisSM377 <al222111377@gmail.com>` | solo `requirements.md` | solo casilla + fecha |
| (2) recuento de R17 244 → 265 | `2283806` | `AlexisSM377` | solo `requirements.md` | solo casilla + fecha |
| (3) copy sin clave, opción (B) + consistencia interna | `cb0b53b` | `AlexisSM377` | solo `requirements.md` | solo las 2 casillas + fechas |

- [x] **Ninguna otra casilla de gate marcada por un agente.** Recorrí los 72
      commits de la branch buscando cualquier `+- [X]`: el único de agente es
      el conocido `f90facb`, que replicó a mano la enmienda (1) en vez de hacer
      `pull`. La firma humana real (`5f59a58`) está en el historial y entró por
      el merge `b806911`. No hay ninguna otra.
- [x] **`requirements.md` en HEAD es byte a byte idéntico a `cb0b53b`**, la
      última firma humana: `git diff cb0b53b HEAD -- specs/mobile-ui-language/requirements.md` vacío.
      Ningún requisito se movió después del gate.

## Checklist C7 — Sin código huérfano

- [x] Las tres tablas de constantes que guardaban texto ahora guardan `labelKey`
      (`floating-tab-bar.tsx`, `reminder-meta.ts`); no queda constante de texto muerta
- [x] Cero literales ingleses de los que la feature sustituyó
- [ ] **Menor, no bloqueante**: `progress/impl_mobile-ui-language.R18.patch.txt`
      sigue en el árbol. El propio `implementer` lo declara obsoleto (nota 5 de
      su tramo 3). Borrar en el cierre.

## Checklist C8 — Carta de UI

- [x] Cero hex fuera de `src/theme/`, cero clases arbitrarias `[...]`, cero
      `StyleSheet.create`, cero `shadow*`/`elevation` legacy — los cuatro greps a **0**
- [x] **Cero cambios de layout y de `className`**, comprobado como multiset sobre
      todo el fuente móvil: **160 valores distintos en la base y 160 en HEAD**,
      cero eliminados. Las únicas 2 ocurrencias nuevas
      (`mt-2 rounded-xl bg-default` y `font-semibold text-foreground`) son el
      botón `language-toggle` de **R14**, que copia byte a byte la receta del
      `theme-toggle` vecino dentro de `me-card`, como manda el requisito
- [x] `global.css` sin tocar

---

## Lo que verifiqué requisito a requisito

### R17 — el recuento, rehecho con el comando normativo

`git archive` del padre y del verde, y el comando de `requirements.md` R17
sobre los dos:

| Commit | `*ByText(`/`toHaveTextContent(` | `ByTestId(` |
|---|---:|---:|
| `a44925f` (base de la spec) | 246 | 796 |
| `9825316` (padre de R17) | **267** | 816 |
| `877e30e` (verde de R17) | **265** | **823** |

- **Delta padre → verde = −2 exactos**, que es el invariante que firmó la enmienda (2). ✅
- Absoluto **265** y `ByTestId(` **823 ≥ 800**. ✅
- El −2 cae **solo** en los cuatro ficheros previstos: `food.test.tsx` 19→20,
  `health.test.tsx` 16→15, `home.test.tsx` 27→26, `meal-schedule.test.tsx` 18→17.
  Ningún otro cambia. ✅
- **62 ficheros de test en el padre y 62 en el verde, lista idéntica: ninguno desaparece.** ✅
- **Aserciones de `className` byte a byte idénticas**: el diff de todas las líneas
  con `className` de la suite muestra que solo cambia el **localizador**
  (`findByText` → `findByTestId`, que es justo lo que R17 ordena); el valor
  esperado sigue siendo `'text-base font-bold text-foreground'` en las cuatro. ✅
- Emparejamiento correcto, no cruzado: `Resumen de hoy` → `summary-card-title`,
  `Peso` → `weight-card-title`. ✅
- **Cero `testID` eliminados en toda la feature**: el conjunto de valores de
  `testID` de la base (256) está íntegro en HEAD (269). Los 13 nuevos son los
  **6 de R17 + `language-toggle` de R14** en fuente (exactamente los 7 que
  permite el invariante) y **6 sondas dentro de ficheros de test**, no de app. ✅
- El único fichero que R17 toca fuera de los cuatro previstos es `map.test.tsx`,
  y solo renombra dos `it(...)` («Retry» → «Reintentar»): es la excepción 10 de
  §Fuera de alcance, y su recuento no se mueve. ✅

### R19 — las 9 enmiendas

Las 9 specs llevan su bloque `## Enmienda #65` y **las 9 casillas siguen sin
marcar**. El test **lo asevera activamente**: además de exigir la casilla vacía,
comprueba con `/- \[[xX]\] Enmienda aprobada por humano/` que **no existe
ninguna marcada**. Verificado por grep y por ejecución. ✅

### R20 — la regla 6

El bloque canónico de `design.md` §6.3 (**2020 caracteres**) está **literal** en
`docs/ui-guidelines.md`, y en su sitio: después del punto 5 y antes de
`## Checklist de autocrítica`. ✅

### La desviación 325/42 frente a los 324/41 firmados — **el `implementer` tiene razón**

Lo comprobé, y no es un hallazgo contra él:

- La convención **es** una fila por ocurrencia, y **es preexistente**, no suya:
  ya en `R1_AUTH` (commit `8c67895`, de Codex) `login.signIn` tiene 2 filas y
  `common.somethingWentWrong` tiene varias.
- `checkUses` **cuenta ocurrencias por (fichero, clave)** y compara con `toEqual`.
- `t('pairing.esn')` aparece en **2 sitios reales**, `pairing/index.tsx:319` y
  `:436` — exactamente los dos que la propia enmienda (3) enumera.
- Con **una sola fila**, el test esperaría 1 uso y encontraría 2: **R18 quedaría
  rojo para siempre**. El paréntesis «una fila en la tabla de uso» de la
  enmienda era incompatible con el candado que la misma enmienda ordena.

Y, decisivo: **la propia enmienda (3) degradó esas cifras a descripción** —
«las cifras de arriba quedan en la spec como lo que valían el 2026-09-06, **no
como el candado**». La desviación cae dentro de lo firmado. No hay que volver a
pasar por el gate por esto.

Todo lo demás cuadra **exacto** con la opción (B) firmada, medido por mí:
catálogo **259** claves en `es` y en `en`, paridad de conjunto de claves y de
marcadores `{{…}}` perfecta, **248** valores de cadena fija (259 − 11 con
parámetro), R4 **20**, R9 **42**.

### El candado de consistencia interna — presente

- `ui-copy-table.ts`: **ninguna constante numérica**. `ALL_USES` se **construye**
  como concatenación de los once bloques y hay un test que lo cuadra contra la
  suma calculada de los bloques.
- Dentro del `describe` de R18 no aparece **ni 259, ni 325, ni 248, ni 324, ni 320**.
- El `describe` de R18 perdió el `320`, como se firmó.
- La paridad `es`↔`en` se comprueba en cardinalidad **y** en conjunto de claves.

(Observación menor: el test «cuadra `ALL_USES` con la suma de los once bloques»
es tautológico, porque `ALL_USES` **está definido** como esa concatenación. No
es un defecto — la derivación estructural es más fuerte que la constante que
sustituye —, pero la aserción no añade señal.)

---

## El defecto que bloquea: R18(b) tiene regiones ciegas

### La prueba de mutación, rehecha por mí

Hecha en una copia del árbol de HEAD extraída con `git archive`, no en el
working tree.

**Mutación A — dentro de una región ciega. FALSO VERDE.**
Inserté en `src/app/(tabs)/home.tsx:59` (pantalla migrada, entre dos funciones)
el literal de copy conocido `const STRAY_COPY = 'Resumen de hoy';`, que es el
valor `es` de `home.summaryTitle`.

→ `describe('#65 R18…')` **se queda VERDE**. El literal no se detecta.

**Mutación B — el mismo literal, en la línea 1 del mismo fichero. ROJO.**

```
● #65 R18: … › no deja ningún valor fijo del catálogo como literal entero en las pantallas
      Object {
        "file": "src/app/(tabs)/home.tsx",
    -   "looseCopy": Array [],
    +   "looseCopy": Array [
    +     "es:home.summaryTitle = Resumen de hoy",
    +   ],
      }
    > 320 |       expect({ file, looseCopy }).toEqual({ file, looseCopy: [] });
```

Falla **por su aserción**, no por `ReferenceError`, y **nombra fichero y
cadena**. El candado está vivo — pero solo en parte del fichero.

### Causa raíz

En `src/__tests__/ui-language.test.ts`, la alternativa de plantilla de
`WHOLE_LITERAL` excluye `$` de su clase de caracteres:

```js
/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\$]|\\.)*)`|>([^<>{}]+)</g
                                               ^^^^^^^^^^^^^^^^
```

Por eso **no puede casar ninguna plantilla que contenga `${…}`**. El motor
sigue avanzando, toma la backtick **de cierre** de esa plantilla como si fuera
de apertura, y se traga todo hasta la siguiente backtick. En `home.tsx` el
culpable es la línea `` `${(meters / 1000).toFixed(1)} km` ``, y el match
resultante **engulle 6363 caracteres seguidos**, dentro de los cuales
`wholeLiterals` no extrae nada.

### Alcance medido

10 de las 19 pantallas tienen región ciega, **52 198 bytes** en total:

| Fichero | bytes ciegos | % del fichero |
|---|---:|---:|
| `src/app/(tabs)/weight-log.tsx` | 7968 | **77.2 %** |
| `src/app/(tabs)/food.tsx` | 7619 | **65.0 %** |
| `src/screens/profile/index.tsx` | 8771 | **64.1 %** |
| `src/app/(tabs)/health.tsx` | 5095 | **52.8 %** |
| `src/app/(tabs)/home.tsx` | 6363 | **50.9 %** |
| `src/screens/reminders/index.tsx` | 5725 | 41.3 % |
| `src/screens/add-reminder/index.tsx` | 3981 | 37.6 % |
| `src/app/(tabs)/map.tsx` | 3569 | 28.5 % |
| `src/screens/add-pet/index.tsx` | 2930 | 18.9 % |
| `src/screens/docs/index.tsx` | 177 | 3.6 % |

R18 dice que la comprobación cubre «**ninguno** de los … valores … en
**ninguno de los 19 archivos**». Cubre un subconjunto de 10 de ellos. El
requisito, tal como está redactado, **no se cumple**.

### Lo que NO está roto — y por qué el arreglo no va a cascada

Esto acota el rechazo, y lo verifiqué antes de emitirlo:

- **R18(a) no tiene puntos ciegos.** Usa un regex por clave sobre el fichero
  entero y compara la **multiplicidad exacta** con `toEqual`. Los 325 sitios ya
  migrados están bien cerrados.
- **La propiedad de R18(b) se cumple hoy.** Escribí un escáner **por AST de
  TypeScript** (sin regiones ciegas, usando el `typescript` que ya es
  `devDependency`), lo validé demostrando que **sí** caza la mutación A que el
  regex no ve, y lo pasé sobre las 19 pantallas de HEAD: **cero literales de
  copy sueltos**. La migración de Codex y del `implementer` es correcta y
  completa.
- Los 5 sitios de la enmienda (3) (`No`, `Microchip`, `ESN` ×2, `GPS`) caen
  todos **fuera** de región ciega, así que el hallazgo real de `Microchip` fue
  legítimo, no suerte.

O sea: **el riesgo es de futuro, no de presente.** Nada que arreglar en las
pantallas; hay que arreglar el candado para que la regla 6 que R20 acaba de
escribir («el catálogo es la única fuente de copy») sea exigible en los 19
ficheros y no en la mitad de 10 de ellos.

### Qué falta exactamente para aprobar

1. Sustituir `wholeLiterals` por una extracción sin puntos ciegos. Lo barato es
   el AST: `ts.createSourceFile(...)` y recoger `StringLiteral`,
   `NoSubstitutionTemplateLiteral`, `JsxText` y `TemplateHead/Middle/Tail`. Son
   ~15 líneas, **sin dependencia nueva** (`typescript` ya está instalado) y sin
   lista de excepciones, que sigue prohibida. Es un cambio dentro de
   `ui-language.test.ts`, que es justo el fichero que la enmienda (3) autoriza a
   tocar.
2. **Rehacer la prueba de mutación de C4(b) plantando el literal DENTRO de una
   región hoy ciega** (por ejemplo `home.tsx:59`, o cualquier punto de
   `weight-log.tsx` tras su primera plantilla con `${}`) y pegar el rojo en el
   reporte. Una mutación en un sitio favorable no vale como evidencia: es
   exactamente lo que ocultó este defecto.
3. La suite debe seguir verde tras el cambio — mi escaneo AST dice que sí, no
   hay copy suelta que aflore.

No hace falta enmienda ni firma humana nueva: no se mueve ninguna cifra ni
ningún requisito.

---

## Sobre el `259` escrito a mano en `language-provider.test.tsx:40`

Pregunta del leader: ¿deuda que cerrar antes del `done`, o puede esperar?

**Puede esperar — pero poco, y conviene cerrarlo en la siguiente feature que
añada copy, no más tarde.** Razonamiento:

- Hoy es correcto (259) y **está fuera de lo firmado**: la enmienda (3) acotó
  explícitamente el cambio a consistencia interna a `ui-copy-table.ts` y al test
  de R18. El `implementer` hizo bien en no tocarlo.
- No es el candado de verdad: la línea de al lado, `expect(spanishKeys).toEqual(englishKeys)`,
  más la paridad de marcadores, es lo que protege el catálogo. El `259` solo
  cuenta.
- Pero es **la misma especie** que ya paró el trabajo tres veces (el R4 de #64,
  el 244 de R17, el 320 de R18): una constante calculada contra un commit que
  envejece en cuanto otra feature mergea. Y la próxima feature del Bloque 1
  (#66/#67) **añade pantallas, o sea claves**, así que este número se romperá
  casi seguro en la siguiente vuelta.

Recomendación: **no bloquear #65 por esto**, y anotarlo como deuda con dueño —
convertirlo a consistencia interna (`Object.keys(es).length === Object.keys(en).length`,
sin el literal) en el primer commit de la feature que añada la primera clave
nueva. Si se prefiere cerrarlo ya, es una línea y cabe en el mismo commit que
arregle R18(b).

---

## Gates humanos que siguen abiertos (no son míos, ni del `implementer`)

`tasks.md` §Cierre deja dos, y ninguno está hecho:

1. **Smoke en dev build de Android**, recorriendo las 18 pantallas y cambiando
   de idioma en los dos sentidos.
2. **Firma de las 9 enmiendas** de `design.md` §6.1 (las 9 casillas están
   correctamente vacías).

Aunque se corrija R18(b), **#65 no puede pasar a `done` sin estos dos**.

---

## Output de `./init.sh`

Lo corrí yo, tras comprobar con `pgrep` que no había otro vivo (los worktrees
comparten el Postgres de docker). **Exit code 0 a la primera, sin flake.**

```
✅ pnpm disponible / bun disponible
✅ .env encontrado — DATABASE_URL definida
✅ Dependencias instaladas
✅ Archivos del harness presentes
✅ Build exitoso

  Test Suites: 163 passed, 163 total      (backend)
  Tests:       1235 passed, 1235 total

  Test Suites: 2 passed, 2 total          (harness)
  Tests:       14 passed, 14 total

  Test Suites: 63 passed, 63 total        (móvil)
  Tests:       931 passed, 931 total
✅ Tests pasados

  Test Suites: 3 skipped, 25 passed, 25 of 28 total   (e2e)
  Tests:       8 skipped, 353 passed, 361 total
✅ Tests e2e pasados

✅ Lint sin errores
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
```

El typecheck pasó sin necesidad de borrar
`mobile-pet-tracker/.expo/types/router.d.ts`.

Working tree al terminar la revisión: **limpio**, HEAD sigue en `50451ca`.
