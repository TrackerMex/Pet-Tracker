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

---
---

# Re-revisión — 2026-09-06, HEAD `159ebf1`

Alcance: **solo el arreglo de R18(b)**. El resto del veredicto de arriba sigue
en pie y no se rehizo.

## Veredicto: **APROBADO**

El falso verde que motivó el rechazo está cerrado y verificado por mí en el
sitio exacto donde lo encontré. `./init.sh` lo corrí yo: **exit 0**.

---

## 1. La mutación A, replicada en `home.tsx:59`

Mismo literal, misma línea, la posición exacta del falso verde. Hecho sobre una
copia extraída con `git archive`, no en el working tree.

`const STRAY_COPY = 'Resumen de hoy';` insertado en la línea 59 de
`src/app/(tabs)/home.tsx` — dentro de lo que era región ciega:

```
● #65 R18: … › no deja ningún valor fijo del catálogo como literal entero en las pantallas
      Object {
        "file": "src/app/(tabs)/home.tsx",
    -   "looseCopy": Array [],
    +   "looseCopy": Array [
    +     "es:home.summaryTitle = Resumen de hoy",
      > 356 |       expect({ file, looseCopy }).toEqual({ file, looseCopy: [] });
```

**Rojo por su aserción, nombrando fichero y cadena.** Antes esto pasaba 20/20. ✅

## 2. Búsqueda de puntos ciegos nuevos del escáner AST

Sondeé la función `wholeLiterals` **real** (no una copia) con 13 fixtures
adversarios, incluidos todos los que pediste:

| Caso | Resultado |
|---|---|
| Apóstrofo tipográfico en nodo JSX (`Today’s Summary`) | ve |
| Apóstrofo ASCII en nodo JSX (`Today's Summary`) | ve |
| Literal **después** de un apóstrofo en JSX | ve (no ciega aguas abajo) |
| Literal **después** de una plantilla con `${…}` | ve (no ciega aguas abajo) |
| Plantilla anidada | ve |
| `JsxExpression` con cadena dentro | ve |
| Cadena en atributo (`label="No"`) | ve |
| Cadena con comilla escapada | ve |
| Nodo JSX multilínea | ve |
| Cadena tras JSX con llaves | ve |
| `` `Peso ${w}` `` (TemplateHead) | **no ve** |
| `` `${a} Resumen de hoy ${b}` `` (TemplateMiddle) | **no ve** |
| `` `${a} Horario de comidas` `` (TemplateTail) | **no ve** |

**Encontré un hueco residual y NO lo cuento como rechazo.** Razones, en orden
de peso:

1. **Está fuera de lo que R18(b) define.** El requisito enumera dos formas:
   «una cadena entrecomillada cuyo contenido normalizado sea igual al valor, o
   un nodo de texto JSX cuyo contenido normalizado lo sea». Un trozo de
   plantilla interpolada **no es ninguna de las dos**: la cadena entrecomillada
   es la plantilla entera, que con `${…}` nunca puede ser igual a un valor fijo.
   El escáner cubre exactamente lo que R18(b) delimita.
2. **No es regresión, y es estrictamente más pequeño.** El regex viejo tampoco
   veía esos trozos (no casaba ninguna plantilla con `${…}`) **y además** cegaba
   ~52 KB aguas abajo. El nuevo solo no ve el trozo, y **no ciega nada
   detrás** — lo comprobé explícitamente en las dos filas «literal después de».
3. **Hoy está vacío.** Escaneé las 19 pantallas incluyendo
   `TemplateHead/Middle/Tail`: **cero copy suelta**.

Anoto una imprecisión menor, sin efecto en el código pero sí en quien lo lea
mañana: el comentario dice «las plantillas CON interpolación no pueden ser
iguales a un valor fijo». Es cierto de la plantilla **entera** y falso de sus
**trozos**. La conclusión del código es correcta por la razón (1), no por la
que el comentario da. Una línea de comentario, cuando se toque el fichero.

**Comprobación extra que no pediste**: forzar `ScriptKind.TSX` sobre las 19
pantallas (hay `.ts` además de `.tsx`) podría dar árboles parciales y cegar en
silencio. Verifiqué `parseDiagnostics` de las 19: **ninguno**. Sugerencia
barata para el futuro, no bloqueante: aseverar `parseDiagnostics.length === 0`
dentro del escaneo, y así un fichero que deje de parsear no puede pasar
inadvertido.

## 3. ¿Se aflojó algo?

No. El diff completo de `ui-language.test.ts` entre `50451ca` (mi rechazo) y
HEAD es quirúrgico: **se sustituye el extractor y se añade un test de
regresión**, nada más.

- `FIXED_KEYS`, `FIXED_COPY`, `SCREEN_FILES`, `checkUses` y el bucle de copy
  suelta: **intactos**.
- **Sigue sin lista de excepciones** y sin ningún filtro que silencie hallazgos.
- La comparación sigue siendo de **igualdad**, no de subcadena.
- Único fichero del móvil tocado: `ui-language.test.ts`. `package.json` y
  `bun.lock` **byte a byte idénticos**; `typescript ~6.0.3` ya era
  `devDependency`. Cero dependencias nuevas.

Un escáner que viera más y perdonara más sería peor que el roto — no es el caso:
ve **364 literales más** y no perdona ninguno.

## 4. El rojo `2895e9d`

Falla **por su aserción** (`toEqual` con `arrayContaining`), **no** por
`ReferenceError`. Y su salida es la mejor prueba del defecto: la región
engullida aparece como **un solo literal falso**.

```
● #65 R18: … › extrae los literales que siguen a una plantilla con interpolación
    Expected: ArrayContaining ["Resumen de hoy", "Horario de comidas"]
    Received: ["; const stray = 'Resumen de hoy'; const label =", "Horario de comidas"]
```

## 5. Reproducción independiente de lo que el reporte afirma

| Afirmación del tramo 4 | Mi medida |
|---|---|
| 364 literales que el regex no veía, en 11 de 19 pantallas | **364 en 11 de 19** ✅ |
| Cero copy suelta con esos 364 a la vista | **cero** ✅ |
| Cero apóstrofos en texto JSX hoy («es suerte, no una propiedad») | **ninguno** ✅ |
| `typescript` ya era devDependency, `package.json` intacto | ✅ |

Mi 10-de-19 y su 11-de-19 no se contradicen: yo medí **bytes** engullidos por
un match desbocado, él **literales distintos** ganados. `meal-schedule` y
`docs` aportan pocos y quedaban bajo mi umbral.

## 6. La desviación de tu indicación — **hizo bien**

Pediste el arreglo mínimo del regex (`` [^`\\$] `` → `` [^`\\] ``) y se fue al
AST. Lo juzgo a favor suyo:

- El arreglo de un carácter pone verde **este** rojo y deja **viva la clase**.
  El siguiente descuadre está a un apóstrofo de distancia, y el catálogo tiene
  **dos valores con apóstrofo** (`Today's Summary` y el de `pairing`). Que hoy
  no haya ninguno en texto JSX lo verifiqué: es cierto, y es suerte.
- Emparejar delimitadores de un lenguaje real a mano es la causa raíz; el AST
  no empareja nada.
- Coste real cero: sin dependencia nueva, y el resultado es **más corto** que el
  lexer que sustituye.

Es el arreglo de la causa, no del síntoma. Endosado.

## 7. Forma

- **`ec07835` no tocó mi informe.** Entró como **fichero nuevo, 396 líneas
  añadidas y 0 borradas**, y ningún commit posterior lo ha modificado
  (`git log ec07835..HEAD -- progress/review_mobile-ui-language.md` vacío).
  Íntegro. Como `progress/` se versiona en este harness, **se queda dentro**.
- **Fuera de mi informe no hay ni una casilla de gate marcada por un agente.**
  Recorrí los commits nuevos buscando `+- [X]`: el único acierto es **prosa**
  dentro de `impl_mobile-ui-language.md`, no una casilla. Las **9 casillas de
  R19 siguen sin marcar** y no hay ninguna marcada en `specs/`.
- Los 20 `- [x]` de este fichero son mi checklist de review, no gates humanos.

## 8. `./init.sh` — lo corrí yo

Comprobé `pgrep` antes. Mi primer intento **no llegó a lanzarse** (el guard
saltó porque había otro vivo); lo relancé y esperé. **Exit 0, sin flake.**

```
✅ Build exitoso
  Test Suites: 163 passed, 163 total     (backend)
  Tests:       1235 passed, 1235 total
  Test Suites: 2 passed, 2 total         (harness)
  Tests:       14 passed, 14 total
  Test Suites: 63 passed, 63 total       (móvil)
  Tests:       932 passed, 932 total     ← +1, el test de regresión
✅ Tests pasados
  Test Suites: 3 skipped, 25 passed, 25 of 28 total   (e2e)
  Tests:       8 skipped, 353 passed, 361 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

Cero `❌` y cero `✕` en las 11 080 líneas. Otro `init.sh` (PID 2665903, sobre
`/dev/pts/3`) arrancó a las 18:30, **después** de que el mío terminara a las
18:25:48: no hubo solape ni contención sobre el Postgres compartido.

---

## Lo que sigue abierto (sin cambios respecto al veredicto anterior)

R18(b) queda cerrado, pero **#65 todavía no puede pasar a `done`**. Faltan los
dos gates humanos de `tasks.md` §Cierre, y ninguno es delegable:

1. **Smoke en dev build de Android**, las 18 pantallas, cambiando de idioma en
   los dos sentidos.
2. **Firma de las 9 enmiendas** de `design.md` §6.1.

Deuda anotada, no bloqueante: el `259` escrito a mano en
`src/providers/__tests__/language-provider.test.tsx:40`, a convertir en
consistencia interna en la primera feature que añada una clave nueva.

Working tree al terminar la re-revisión: **limpio**, HEAD en `159ebf1`.

---
---

# Validación final — 2026-09-06, HEAD `2ffc5ee`

Alcance: **solo el arreglo del test de R19** (`bc57919`) y la verificación de
las firmas humanas. La aprobación de los 20 requisitos sigue en pie.

## Veredicto: **APROBADO**

El arreglo no afloja R19, el candado sigue vivo por las dos vías, las 9
enmiendas están firmadas por el humano y `./init.sh` —que corrí yo— da
**exit 0**.

---

## 1. El juicio que pediste que auditara: ¿defecto de test o enmienda de spec?

**Coincido contigo: es defecto del test, y no necesitaba gate humano.**

R19 dice «AND THE SYSTEM SHALL **dejar** la casilla de firma de cada enmienda
**sin marcar**: la firma es del humano». En EARS, `THE SYSTEM` es lo que se
construye, así que la obligación recae sobre **lo que entrega la
implementación**, no sobre un invariante perpetuo del repositorio. Y la
coletilla —«la firma es del humano»— dice el propósito en voz alta: la casilla
se deja vacía **para que el humano la firme**.

Medirlo como invariante permanente convertía el requisito en una contradicción:
exigía 9 casillas firmables y prohibía que se firmaran. **El texto del
requisito no se ha tocado**; lo que se ha corregido es un test que medía algo
que el requisito no dice. Eso es un arreglo de test, no una enmienda, y no pasa
por el gate.

Lo confirma el propio historial: el rojo llegó **por la firma del humano**, no
por un cambio de código.

## 2. ¿Afloja R19?

No. Lo que sigue bajo llave tras el arreglo:

- El bloque de enmienda se compara **byte a byte** con el literal de
  `design.md` §6.2 vía `includes(canonicalAmendment(feature))`, en las 9 specs.
- El marcador de la edición (a), `(ver §Enmienda #65)`, se sigue asertando.
- La **línea de firma debe existir** en las 9, con su texto exacto.
- **Sin lista de excepciones y sin casos por fichero**: el bucle recorre las 9
  igual que antes.

Lo único que deja de asertarse es **el estado** de la casilla. Y eso nunca fue
trabajo de R19: un test solo puede ver *que* está marcada, nunca *quién* la
marcó, así que como guardia de gobernanza siempre fue débil — y en cuanto el
humano firma legítimamente, muere de todas formas. Quién marca cada casilla lo
comprueba la **autoría de git** y este review, que es lo que acabo de hacer en
§4. Es un cambio de guardia, no una pérdida.

## 3. El corte antes de la firma — lo más delicado, verificado

`canonicalAmendment()` ahora devuelve `block.slice(0, block.indexOf(SIGNATURE_LINE)).trimEnd()`.

Medido sobre el bloque real de §6.2: **1290 caracteres**, la línea de firma
empieza en el **1242**. Lo que el corte descarta es, literalmente y en su
totalidad:

```
- [ ] Enmienda aprobada por humano (fecha: ____)
```

**Cero contenido normativo perdido.** Siguen dentro del byte a byte los cuatro
bullets: «Qué cambia», «Qué NO cambia» (el literal inglés sigue normativo como
columna `en`), «Fuente única del literal y de la clave» y «Los mensajes de
validación del backend siguen en inglés en los dos idiomas». 1242 de 1290
caracteres se siguen comparando.

Y lo comprobé además **por mutación**, no solo por inspección — ver (b2) abajo.

## 4. El candado sigue vivo — mutación por las dos vías

Sobre una copia de HEAD extraída con `git archive`. Baseline: 2/2 verdes.

| # | Mutación | Resultado |
|---|---|---|
| (a) | Borrar la línea de firma de `mobile-map-live` | **rojo**, `hasSignatureLine: true → false`, nombrando `specs/mobile-map-live/requirements.md` |
| (b1) | Alterar texto normativo del medio del bloque en `mobile-health` (`manda la tabla` → `manda la spec`) | **rojo**, `hasAmendment: true → false`, nombrando el fichero |
| (b2) | Alterar el **último bullet, el pegado al corte**, en `mobile-food` (`en inglés` → `en portugués`) | **rojo**, `hasAmendment: true → false`, nombrando el fichero |

(b2) es la que decide: si el corte se hubiera comido contenido normativo, esa
mutación habría pasado en silencio. Da rojo. **El corte es exacto.**

Las tres fallan **por su aserción**, ninguna por `ReferenceError`, y las tres
**nombran el fichero**.

## 5. El rojo `bc57919^` = `00151e6`

Falla **por su aserción** (`toEqual`), sin `ReferenceError`, nombrando
`specs/mobile-home-dashboard/requirements.md`:

```
● #65 R19 › deja la casilla de firma de las 9 enmiendas sin marcar
    -   "unsigned": true,
    +   "unsigned": false,
● #65 R19 › inserta el bloque literal de §6.2 en las 9 specs …
        "file": "specs/mobile-home-dashboard/requirements.md",
```

**Las DOS mitades estaban rojas**, no solo la de la casilla. Esto valida
independientemente la razón por la que el `implementer` tocó la segunda
aserción pese a tu indicación: el bloque de §6.2 **termina en la línea de la
firma**, así que firmar rompía también el `includes` byte a byte. No era
iniciativa suya: sin ese cambio el rojo no se podía cerrar. **Hizo bien.**

## 6. ¿Alguna otra aserción daba por vacías las casillas?

No. Barrí toda la suite móvil, el harness y el backend buscando
`aprobada por humano`, `unsigned`, `- [ ]`, `[xX]`, `Aprobado por humano` y
`Smoke ejecutado`: los únicos aciertos con aserción están en
`ui-language.test.ts`, dentro del bloque de R19 ya arreglado. **Ninguna otra
prueba dependía del estado de una casilla.**

## 7. Firmas humanas — verificadas una a una

| Commit | Autor | Ficheros | Qué marca |
|---|---|---|---|
| `7167ac9` | `AlexisSM377 <al222111377@gmail.com>` | solo `specs/mobile-ui-language/requirements.md` | humo de #65 en dev build de Android (2026-09-06) |
| `00151e6` | `AlexisSM377` | solo 9 ficheros de `specs/` | 8 de las 9 enmiendas **+ la casilla equivocada** de `mobile-auth:218` |
| `2ffc5ee` | `AlexisSM377` | solo `specs/mobile-auth/requirements.md` | la enmienda que faltaba, `mobile-auth:274` |

**Las 9 enmiendas están firmadas**, las 9 con fecha 2026-09-06. Verificado
fichero a fichero.

**Casilla `mobile-auth:218`** (`Smoke ejecutado por el humano`, gate de #33):
está marcada, y **la marcó el humano** en `00151e6` — no un agente. Como me
indicas que es decisión consciente suya, lo dejo **anotado, no como hallazgo
pendiente**. Solo dejo constancia de que su veracidad descansa en la palabra
del humano, que es exactamente donde el harness la pone.

**Fuera de esas casillas, ningún agente marcó ninguna.** Recorrí los commits
nuevos buscando toda casilla marcada añadida —**incluidas las indentadas**, que
es como está la 218 y que un patrón descuidado se salta—: **todas** son de
`AlexisSM377`. Cero de agente.

## 8. Un apunte, no bloqueante: un falso verde latente en el corte

`canonicalAmendment()` no comprueba que `indexOf(SIGNATURE_LINE)` encuentre
algo. Si algún día §6.2 dejara de llevar su línea de firma, `indexOf` devuelve
`-1`, `slice(0, -1)` **trunca un carácter en silencio** y el `includes` sigue
pasando porque compara un prefijo. Lo verifiqué por mutación: quitando la firma
del bloque canónico de `design.md`, el test **pasa 2/2 sin quejarse**.

No lo cuento como defecto y no bloquea: hoy el índice es correcto (1242), la
degradación sería de **un solo carácter** de 1242, y requiere una edición de la
spec que pasaría por review. Pero es la misma especie que ya nos costó dos
rondas, y el arreglo es una línea, en el estilo que el propio fichero ya usa
dos veces:

```ts
const idx = block.indexOf(SIGNATURE_LINE);
expect(idx).toBeGreaterThan(-1);
```

Recomiendo meterlo en la próxima feature que toque el fichero, no reabrir #65
por esto.

## 9. `./init.sh` — lo corrí yo

`pgrep` antes: libre. **Exit 0, sin flake, cero `❌` y cero `✕`** en 11 080
líneas.

```
✅ Build exitoso
  Test Suites: 163 passed, 163 total     (backend)
  Tests:       1235 passed, 1235 total
  Test Suites: 2 passed, 2 total         (harness)
  Tests:       14 passed, 14 total
  Test Suites: 63 passed, 63 total       (móvil)
  Tests:       932 passed, 932 total
✅ Tests pasados
  Test Suites: 3 skipped, 25 passed, 25 of 28 total   (e2e)
  Tests:       8 skipped, 353 passed, 361 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

---

## Estado de #65 al cerrar esta validación

Los 20 requisitos aprobados, `traceability.md` sin filas pendientes, `init.sh`
verde, **los dos gates humanos firmados** (humo en dev build de Android en
`7167ac9`; las 9 enmiendas en `00151e6` + `2ffc5ee`).

Por mi parte **no queda nada pendiente en #65**. Marcar `done` en
`feature_list.json`, abrir el PR y mergear son tuyos y del humano, no míos.

Deuda anotada que no bloquea, para la siguiente feature que toque estos
ficheros:

1. El `259` escrito a mano en `language-provider.test.tsx:40`.
2. El guard de `indexOf` del §8 de arriba.
3. El comentario impreciso sobre las plantillas interpoladas (re-revisión §2).

Working tree al terminar: **limpio**, HEAD en `2ffc5ee`.
