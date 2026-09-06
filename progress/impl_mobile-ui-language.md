# Implementación — #65 mobile-ui-language

Fecha: 2026-09-06
Branch: `feature/65-mobile-ui-language`
Worktree: `/home/claude/sites/Pet-Tracker-wt-ui`

## Estado

R1-R16 están entregados. R17 tiene rojo legítimo y su implementación está
verde de forma dirigida, pero queda bloqueado antes del commit verde porque
el recuento mecánico aprobado no corresponde al árbol base real de la branch.

## Gate previo

- Skills leídas antes de escribir código: `expo-overview`, `expo-native-ui` y
  `appllama-app-design-skill`; de Appllama solo aplica el patrón, nunca su
  sistema de estilos.
- Documentación oficial leída en su versión fijada: Expo SDK 57 y SecureStore
  para SDK 57.
- Se leyeron completos `requirements.md`, `design.md`, `tasks.md`,
  `traceability.md` y `copy-review.md` de la feature, además de
  `docs/ui-guidelines.md` y `CHECKPOINTS.md` C4/C7/C8.
- Primer `./init.sh`: falló por contaminación concurrente del Postgres y las
  colas LocalStack compartidas (3 fallos e2e ajenos al móvil). La repetición,
  sin cambios en el árbol, terminó con exit code 0: build, `cdk synth`, tests,
  e2e, lint y typecheck verdes. La suite móvil de baseline pasó 59 suites y
  891 tests.

## Bloqueo C4

R17 puede producir un rojo legítimo: sus seis `testID` no existen todavía y el
test falla por una aserción de consulta. No necesita excepción.

R18, en cambio, solo comprueba mecánicamente propiedades que R1-R11 ya exigen
dejar en el árbol: 320 usos de `t('<clave>')` y ausencia de copy literal. En el
orden aprobado (`R1-R11 -> R17 -> R18`) una implementación correcta hace que
el test de R18 nazca verde. La spec aprobada:

- no declara R18 como requisito de verificación;
- no elige por escrito la vía C4(b) de prueba por mutación;
- sigue pidiendo un «Test rojo» en `tasks.md`;
- no contiene una excepción firmada por el humano.

Por tanto no existe un rojo honesto para R18 en la posición obligatoria.
Provocarlo mediante un helper inexistente sería el `ReferenceError` que C4
prohíbe; dejar copy suelta a propósito hasta R18 incumpliría R1-R11. Se para
antes de escribir el primer test, tal como ordena el handoff.

## Enmienda necesaria antes de reanudar

El humano debe aprobar por escrito una de estas dos vías en la spec:

1. Declarar R18 requisito de verificación por C4(b) y exigir evidencia de
   mutación: reintroducir temporalmente un literal conocido, observar que el
   test R18 falla por su aserción, revertir la mutación y dejar la suite verde.
2. Cambiar el orden para escribir el candado R18 antes de las migraciones que
   verifica, de modo que su rojo sea real.

La primera vía conserva el orden y el alcance ya aprobados.

## Resolución del bloqueo

El humano aprobó explícitamente el 2026-09-06 la primera vía: R18 queda
declarado requisito de verificación C4(b) y se probará por mutación temporal.
La firma y el procedimiento quedaron registrados en `requirements.md` y
`tasks.md` antes de reanudar la implementación.

## R-ids y commits

| R-id | Rojo | Verde |
|---|---|---|
| R12 | `ac158f6` | `20397ad` |
| R13 | `e237589` | `ff15b5b` |
| R16 | `5f4e718` | `81a12fd` |
| R14 | `c77fcab` | `8d97da2` |
| R15 | `103353b` | `71015b1` |
| R1 | `8c67895` | `0dcf6bf` |
| R2 | `d6cb58a` | `fd04a3e` |
| R3 | `51bc7ed` | `40f9f6e` |
| R4 | `fc77f22` | `45fd835` |
| R5 | `b593f0f` | `8bf82b0` |
| R6 | `eff8e4c` | `a1a5bee` |
| R7 | `9b3d904` | `5665e0e` |
| R8 | `81a171e` | `f86d1cd` |
| R9 | `d5aa4f3` | `c383345` |
| R10 | `11b3a5b` | `793390b` |
| R11 | `05bbf53` | `663b6e8` |
| R17 | `b682f20` | bloqueado por recuento normativo |

## Bloqueo R17 — recuento de consultas de texto

La implementación exacta de §4.3 da **265** para el comando normativo de
consultas de texto y **823** para consultas por `testID`. El segundo cumple
`>=800`; el primero no coincide con **244**, por lo que `tasks.md` ordena
parar.

La diferencia está trazada y no es una pérdida de aserciones:

- `a44925f`, base usada por la spec: 246 consultas;
- `f90facb`, padre real del primer test de #65: 258 consultas, porque #64
  añadió 12 en `docs/index.test.tsx` y `reminders/index.test.tsx` después de
  que se calculó la spec;
- los tests nuevos obligatorios de R12 y R14 añaden 5 y 4 consultas,
  respectivamente;
- R17 hace el neto prescrito de −2 (cuatro localizadores migrados y dos
  aserciones de copy repuestas): `258 + 9 - 4 + 2 = 265`.

No se han reescrito ni eliminado aserciones de #64 para forzar el número, pues
eso contradiría el alcance y falsearía la señal. Se necesita una enmienda
humana que fije el esperado correcto (265) o indique explícitamente otra
política de recuento antes de cerrar R17 y continuar con R18.

## Copy o layout no previstos

No apareció copy de producto que exigiera inventar una clave o un literal. No
se cambió layout ni `className`.

## Verificación

- `bun run test`: 63 suites / 921 tests verdes al cerrar R11. La verificación
  dirigida de R17 pasó 5 suites / 150 tests; el gate mecánico queda bloqueado
  por 265 frente a 244.
- `./init.sh`: exit code 0 en la repetición completa de baseline.

---

# Tramo 2 — Claude Code como `implementer` (fallback de Codex CLI)

Fecha: 2026-09-06
Branch: `feature/65-mobile-ui-language`, desde `2283806`
Worktree: `/home/claude/sites/Pet-Tracker-wt-ui`

> Sustituye a Codex CLI, que agotó cuota. Fallback autorizado por `CLAUDE.md`
> §Excepciones. **Todo lo que escribió Codex arriba queda intacto**; lo que
> sigue lo corrige donde haya quedado caduco (en particular, el «Bloqueo R17»
> quedó resuelto por la enmienda (2) y R17 está cerrado).

Skills cargadas antes de tocar código móvil: `expo:expo-overview` (y por su
mapa, nada más aplicaba: el tramo no crea pantallas, ni tokens, ni animación —
solo `testID`, tests de escaneo y markdown).

## Estado al cerrar el tramo

| R-id | Rojo | Verde |
|---|---|---|
| R17 | `b682f20` (Codex) | `877e30e` |
| R18 | — (requisito de verificación, C4(b)) | **BLOQUEADO, sin commitear** |
| R19 | `d26b520` | `ff38129` |
| R20 | `611c351` | `55b4bff` |

Trazabilidad: `9a8d4d7` (R17), `3812fe8` (R19, R20 y el bloqueo de R18).

---

## R17 — cerrado

El verde que Codex dejó sin commitear era correcto. Se rehízo la comprobación
de la **enmienda (2)** antes de commitear, con `git archive` a un temporal
(nunca `git checkout`), y cuadra:

| Punto | Commit | `*ByText(`/`toHaveTextContent(` | `ByTestId(` |
|---|---|---:|---:|
| padre de R17 | `9825316` | **267** | 816 |
| rojo de R17 | `b682f20` | 269 | — |
| verde de R17 | `877e30e` | **265** | **823** |

- **Delta padre → verde = −2 exactos**, que es el invariante que decide.
- Se reconcilia entero: `267 + 2` (las 2 aserciones de copy que el rojo repone,
  `Comidas hoy` y `Horario de comidas`) `− 4` (los 4 localizadores migrados de
  `findByText` a `findByTestId`) `= 265`. Es el neto −4/+2 que §4.3 prescribe.
- `ByTestId(` = **823** ≥ 800.
- El delta cae **solo** en los cuatro archivos previstos y en ninguno más:
  `food.test.tsx` 19→20, `health.test.tsx` 16→15, `home.test.tsx` 27→26,
  `meal-schedule.test.tsx` 18→17. Comparación por fichero de los dos árboles:
  **ningún fichero de test desapareció** y ningún otro cambió su recuento.
- Las 4 aserciones de `className` quedan **byte a byte idénticas**
  (`'text-base font-bold text-foreground'` en las cuatro).

Nada se debilitó.

---

## R18 — PARADO. El escaneo destapa copy que el catálogo aprobado no contiene

El test de R18 **está escrito y demostrado vivo**, pero **no se ha commiteado**,
porque no puede ponerse verde sin inventar catálogo. `tasks.md` R18 (2) y (1)
ordenan exactamente esto: *«si aparece una cadena visible que no está en la
tabla, **parar** y anotarla»*.

### Lo que destapó, en su primera ejecución

Barrido completo de los 244 valores fijos (255 − 11 con parámetro), en `es` y
en `en`, contra los **19** archivos de pantalla. **Un solo par (archivo, cadena)
infractor** en todo el árbol:

```
--- src/screens/add-pet/index.tsx
    en:profile.microchip = Microchip
TOTAL OFFENDING (file,string) pairs: 1
```

`mobile-pet-tracker/src/screens/add-pet/index.tsx:436`:

```tsx
<FieldLabel>Microchip</FieldLabel>
```

Es copy visible (la etiqueta de un campo del formulario de alta), sin migrar.
El catálogo **sí** tiene la clave `profile.microchip` (`Microchip` en los dos
idiomas), pero [[design]] §2.9 fija para `add-pet` **40 ocurrencias** y esta no
está entre ellas.

### Un segundo hueco de la misma familia, que el escaneo NO puede ver

`add-pet/index.tsx:431` pinta `label="No"` (el chip contrario a
`t('addPet.yes')`). El catálogo tiene `addPet.yes` pero **no tiene ninguna
clave cuyo valor sea `No`**, así que:

- la parte (a) de R18 no lo ve, porque no está en la tabla de uso;
- la parte (b) tampoco, porque solo compara contra valores del catálogo.

Es copy visible sin clave y sin candado.

### La causa raíz es la misma para los dos

El inventario de §1 se construyó barriendo **literales ingleses que había que
traducir**. `Microchip` y `No` **se escriben igual en los dos idiomas**, así que
no aparecían como «pendientes de traducir» y se colaron del censo. No es un
fallo del escaneo de R18: el escaneo es lo que los ha encontrado.

### Por qué no lo he arreglado yo

Cualquiera de las salidas toca cifras **firmadas**:

- Migrar `Microchip` sube R9 de 40 a **41** ocurrencias y `ALL_USES` de 320 a
  **321**, y **321 aparece en el nombre normativo del `describe` de R18**
  (`'#65 R18: los 320 sitios…'`), que es la firma del requisito.
- Además hay que **elegir clave**: reusar `profile.microchip` (que es de otra
  pantalla; §2.9 usa `addPet.*` en todo salvo `common.*`) o crear
  `addPet.microchip`, que sube el catálogo de **255** a 256 claves. Esa
  elección es del catálogo normativo (§2), no mía.
- `No` necesita **clave nueva** (`addPet.no`, `No`/`No`) → 256/257 claves y otra
  ocurrencia más.
- Añadir una lista de excepciones al escaneo está **prohibido** por `tasks.md`
  R18 (3): *«si alguien necesita añadir una, es señal de que quedó copy
  suelta»*. Aquí la señal es correcta.

Es la misma especie que las enmiendas (1) y (2): una cifra aprobada que el
árbol contradice. **Necesita una enmienda firmada por el humano** que fije
clave, recuento de catálogo y recuento de ocurrencias. Con eso, R18 es un
commit de una línea de código y otra de tabla.

### Evidencia de mutación (la que exige la enmienda (1) y pedirá el reviewer)

Hecha con el test de R18 aplicado temporalmente sobre `55b4bff`.

**1. Literal reintroducido**, en pantalla ya migrada:
`mobile-pet-tracker/src/app/(auth)/login.tsx:68`, el título de la pantalla,
`{t('login.signIn')}` → `Iniciar sesión`.

**2. Rojo por su aserción, nombrando el archivo.** Las **dos** mitades de R18
se dispararon. Ninguna es `ReferenceError`.

Mitad (b), el escaneo de copy suelta:

```
● #65 R18: los 320 sitios resuelven por clave y no queda copy suelta › no deja
  ningún valor fijo del catálogo como literal entero en las 19 pantallas

    expect(received).toEqual(expected) // deep equality

      Object {
        "file": "src/app/(auth)/login.tsx",
    -   "looseCopy": Array [],
    +   "looseCopy": Array [
    +     "es:login.signIn = Iniciar sesión",
    +   ],
      }

    > 312 |       expect({ file, looseCopy }).toEqual({ file, looseCopy: [] });
```

Mitad (a), la resolución por clave:

```
● #65 R18: los 320 sitios resuelven por clave y no queda copy suelta › resuelve
  las 320 ocurrencias normativas contra la clave exacta

      Object {
        "file": "src/app/(auth)/login.tsx",
        "key": "login.signIn",
    -   "uses": 2,
    +   "uses": 1,
      }

    > 55 |     expect({ file, key, uses: resolvedUses }).toEqual({
```

**3. Mutación revertida** y suite verde (63 suites / 926 tests). El test de R18
se retiró del árbol; queda en este reporte y, íntegro, en
`progress/impl_mobile-ui-language.R18.patch.txt`.

> Nota: la mejor evidencia de que el candado no es decorativo no es la mutación
> sintética, sino que **en su primera ejecución encontró un defecto real que
> nadie había puesto ahí** (`Microchip`).

---

## R19 — 9 specs enmendadas, 9 casillas SIN marcar

Rojo `d26b520` → verde `ff38129`.

Las dos ediciones de [[design]] §6.2 en los 9 ficheros: la línea que ratificaba
el inglés queda tachada y apuntando al bloque, y el bloque literal se inserta
antes de `## Aprobación` (o al final, en los 3 `design.md` que no lo tienen).
`mobile-device-pairing` §D7 recibe además el cambio de encabezado y la nota bajo
la tabla de 18 filas: sus 18 strings siguen normativos como columna `en`.

**Las 9 casillas `- [ ] Enmienda aprobada por humano` quedan sin marcar**, y el
test lo **exige activamente**: además de comprobar que la casilla vacía está,
asevera que no existe ninguna marcada (`- [x]`). Firmarlas es del humano
(`AGENTS.md` §3).

Decisiones de implementación, ninguna inventa contenido:

- El test **lee el bloque canónico de `design.md` §6.2** en vez de duplicarlo,
  así que la spec sigue siendo la única fuente del literal y no puede
  divergir. Igual en R20 con §6.3.
- **Reflow**: el texto de §6.2 se insertó respetando el ancho de línea de cada
  fichero. Sin reflow, mis ediciones dejaban las líneas más largas de cada
  spec (hasta 196 caracteres) justo en el párrafo que el humano tiene que leer
  para firmar. Cero líneas nuevas > 80.
- Por ese reflow, la aserción del marcador de la edición (a) compara con
  **espacios colapsados**, no byte a byte: el marcador se inserta en prosa que
  el markdown reparte en varias líneas. Comprobado por mutación que el candado
  sigue vivo (cambiar `(ver §Enmienda #65)` por `(sin referencia)` en
  `mobile-map-live` lo pone rojo; revertido).
- **Ajuste tipográfico en `mobile-reminders`** (única desviación literal, la
  anoto por transparencia): §6.2 prescribe terminar el reemplazo en `…de su
  clave.` y el original continuaba con `; el diseño está en español, …`. Se
  omitió ese punto final para no dejar `.;` y que la frase original siga
  íntegra. Contenido sin cambios.

---

## R20 — la carta de UI fija el catálogo

Rojo `611c351` → verde `55b4bff`.

Punto **6. Idioma** insertado literal de [[design]] §6.3 en
`docs/ui-guidelines.md` §Dirección de arte, tras el punto 5 y antes del
checklist de autocrítica. El test fija el texto **y su posición**.

---

## Copy o decisiones no previstas

- **`Microchip` y `No` en `add-pet`** — arriba, en R18. Es lo único que la spec
  no cierra, y por eso he parado en vez de inventarlo.
- Ninguna otra cadena visible apareció fuera de la tabla.
- No se cambió layout, ni `className`, ni se añadió dependencia alguna.

## Verificación

- `bun run test` (móvil): **63 suites / 926 tests verdes**.
- `bun run typecheck`: limpio (no hizo falta borrar `.expo/types/router.d.ts`).
- `bun run lint`: 0 errores. Queda **1 warning preexistente**,
  `import/first` en `src/__tests__/ui-language.test.ts:12`, heredado de la
  estructura con la que Codex creó el fichero en R1 (los `require` shim van
  antes del `import`). No lo toco: es de un fichero ya commiteado en R1-R11 y
  arreglarlo mueve código de otro requisito.
- `./init.sh`: **exit code 0**. Build, 163+2+63 suites de test, e2e, lint y
  typecheck verdes.
  - La **primera** pasada dio 1 e2e rojo,
    `resource-isolation.e2e-spec.ts::R10` por timeout de 5 s contra las colas
    de LocalStack. Es el flake conocido de infraestructura compartida entre
    worktrees (memoria del proyecto; Codex documentó el mismo). Re-ejecutado
    **sin tocar nada**, verde (`353 passed`), y la pasada completa posterior
    también. No toqué `backend-pet-tracker/`.
- C8 grep-clean: cero `StyleSheet.create`, cero clases arbitrarias `[...]`,
  cero hex fuera de `src/theme/` en código de pantalla (los hits de `#RRGGBB`
  son mocks de tema dentro de `*.test.tsx`, preexistentes).
- Alcance: `git diff --name-only 2283806..HEAD` **no toca**
  `backend-pet-tracker/`, `infra/`, `hosting/`, `app.json`, `package.json` ni
  `mobile-pet-tracker/src/theme/`.

## Notas para el reviewer

1. **R18 es el único bloqueo, y es de spec, no de código.** Hay que decidir por
   escrito: clave para `Microchip` (¿`addPet.microchip` nueva o reusar
   `profile.microchip`?), clave para `No` (`addPet.no`), y los recuentos que
   eso mueve — catálogo 255→256/257, R9 40→41/42, `ALL_USES` 320→321/322 y el
   **nombre del `describe` de R18**, que lleva el 320 dentro.
2. El test de R18, entero, está en
   `progress/impl_mobile-ui-language.R18.patch.txt`. Aplicarlo tras la enmienda
   deja R18 a un commit de distancia.
3. **Nada firmado por un humano ha sido marcado.** Las 9 casillas de R19 están
   vacías, `feature_list.json` sin tocar, sin PR, sin merge.
4. R17 se cerró rehaciendo yo la comprobación de la enmienda (2), no fiándome
   del reporte de Codex. La tabla del delta está arriba.
5. Quedan pendientes los **dos gates humanos** de `tasks.md` §Cierre: el smoke
   en dev build de Android y la firma de las 9 enmiendas.

---

# Tramo 3 — R18 cerrado con la enmienda (3), opción (B)

Fecha: 2026-09-06
Branch: `feature/65-mobile-ui-language`, desde `cb0b53b`

## Firma verificada antes de tocar nada

`cb0b53b`, autor `AlexisSM377 <al222111377@gmail.com>`, 2026-09-06, **toca solo
`specs/mobile-ui-language/requirements.md`** (4 inserciones, 4 borrados). Marca
**(B)** y la casilla de consistencia interna; deja **(A) sin marcar**. Sin
código colado en el commit de firma.

## Rojo → verde

| R-id | Rojo | Verde |
|---|---|---|
| R18 | `f82d975` | `24fa49a` |

Trazabilidad en `1ebb968`. **`traceability.md` no tiene ninguna fila pendiente**:
los 20 requisitos están trazados.

### El rojo, y que es honesto

El rojo añade las **4 claves** al catálogo y sus filas a la tabla de uso, y
**deja los 5 sitios sin migrar**. Las dos mitades de R18 fallan **por su
aserción**, nombrando fichero y cadena. Ninguna es `ReferenceError`.

Mitad (a), resolución por clave:

```
● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve
  cada ocurrencia de la tabla contra la clave exacta

      Object {
        "file": "src/app/(tabs)/map.tsx",
        "key": "map.gps",
    -   "uses": 1,
    +   "uses": 0,
      }
```

Mitad (b), escaneo de copy suelta:

```
● #65 R18: los sitios resuelven por clave y no queda copy suelta › no deja
  ningún valor fijo del catálogo como literal entero en las pantallas

      Object {
        "file": "src/app/(tabs)/map.tsx",
    -   "looseCopy": Array [],
    +   "looseCopy": Array [
    +     "en:map.gps = GPS",
    +     "es:map.gps = GPS",
    +   ],
      }
```

El verde migra los 5 sitios:

| Fichero | Sitio | Queda |
|---|---|---|
| `screens/add-pet/index.tsx` | `label="No"` | `label={t('addPet.no')}` |
| `screens/add-pet/index.tsx` | `<FieldLabel>Microchip</FieldLabel>` | `{t('addPet.microchip')}` |
| `screens/pairing/index.tsx` | `label="ESN"` (`ready-esn`) | `label={t('pairing.esn')}` |
| `screens/pairing/index.tsx` | `label="ESN"` (`device-esn`) | `label={t('pairing.esn')}` |
| `app/(tabs)/map.tsx` | `<Text>GPS</Text>` | `{t('map.gps')}` |

Los `testID` no se tocan. `📄` y `✓` quedan fuera, como ordena la enmienda.

## El candado, ahora por consistencia interna

Como se firmó, la comprobación vinculante deja de ser una constante:

- `ui-copy-table.ts` — `ALL_USES` debe medir la **suma de los once bloques**
  `R1_…R11_`, calculada de los bloques mismos.
- `ui-language.test.ts` R18 — `Object.keys(es)` y `Object.keys(en)` deben
  coincidir en cardinalidad **y en el conjunto de claves**; el escaneo recorre
  `ALL_USES` y el catálogo tal como están.
- El `describe` de R18 **pierde el total**: `'#65 R18: los sitios resuelven por
  clave y no queda copy suelta'`.

Ningún total escrito a mano queda dentro del candado de R18.

## Una desviación de las cifras estimadas, y por qué

La enmienda estimaba `ALL_USES` **324** y R10 **41**. Los reales son **325** y
**42**.

`pairing.esn` se usa en **dos** sitios (`:319` y `:436`) y la enmienda anotó
«una sola fila en la tabla de uso». Pero la tabla lleva **una fila por
ocurrencia** —es la convención que ya existía, no una que yo introduzca:
`login.signIn` tiene 2 filas y `common.somethingWentWrong` tiene 31—, y
`checkUses` **cuenta ocurrencias por (fichero, clave)**: con una sola fila
esperaría 1 uso y encontraría 2, y R18 quedaría rojo para siempre.

Se resolvió a favor de la convención, no del número, porque **la propia
enmienda degradó esas cifras a descripción**: «las cifras de arriba quedan en la
spec como lo que valían el 2026-09-06, **no como el candado**». Todo lo demás
cuadra exacto con lo firmado:

| Magnitud | Firmado | Real |
|---|---:|---:|
| catálogo | 259 | **259** |
| valores de cadena fija R18(b) | 248 | **248** (259 − 11 con parámetro) |
| R4 | 20 | **20** |
| R9 | 42 | **42** |
| R10 | 41 | **42** |
| `ALL_USES` | 324 | **325** |

**Es exactamente el fallo de especie que la enmienda buscaba enterrar**, y la
comprobación de consistencia interna lo absorbió sin drama: no hay ninguna
constante que corregir, solo esta nota.

## Evidencia de mutación de R18 (C4(b))

Sobre el R18 ya commiteado en verde:

1. Literal reintroducido en pantalla migrada:
   `src/app/(auth)/login.tsx:68`, `{t('login.signIn')}` → `Iniciar sesión`.
2. Rojo **por su aserción**, nombrando el fichero:

```
● #65 R18: los sitios resuelven por clave y no queda copy suelta › no deja
  ningún valor fijo del catálogo como literal entero en las pantallas

      Object {
        "file": "src/app/(auth)/login.tsx",
    -   "looseCopy": Array [],
    +   "looseCopy": Array [
    +     "es:login.signIn = Iniciar sesión",
    +   ],
      }
```

3. Mutación revertida, suite verde (63 suites / 931 tests).

## Copy o decisiones no previstas

- **Ninguna.** Rehice el barrido por la vía del `leader` —texto visible en los
  19 ficheros, resuelva o no por `t(`— **después** de migrar: **cero literales
  de copy restantes**. Los únicos aciertos del barrido son nombres de prop en
  su propia línea (`secureTextEntry`, `selectable`, `isLast`, `selectedPetId`)
  y sintaxis de genéricos de TypeScript, que un regex de nodo JSX confunde con
  texto. No hay nada más que enmendar.
- **`language-provider.test.tsx` (R12)**: su aserción fijaba el catálogo en
  **255**. Pasa a **259**, que es literalmente la cifra que la enmienda firma.
  No le cambié la forma del candado —sigue con `toHaveLength` más la paridad
  `es`↔`en`— porque la enmienda acotó el cambio a consistencia interna a
  `ui-copy-table.ts` y al test de R18. Si el `leader` quiere también ahí la
  forma nueva, es una línea.
- Cero dependencias nuevas, cero cambios de layout o `className`.

## Verificación

- `./init.sh`: **exit code 0 a la primera**, sin flake esta vez. Build, 163 + 2
  + 63 suites, e2e (`353 passed`), lint y typecheck verdes.
- `bun run test` (móvil): **63 suites / 931 tests**.
- `bun run typecheck`: limpio.
- `bun run lint`: **0 errores y 0 warnings**. De paso subí los dos `import` por
  encima de los `require` shim en `ui-language.test.ts`: el warning
  `import/first` era preexistente (tramo 2) y mi import lo duplicaba. Los
  `require` siguen ejecutándose antes de su primer uso.
- C8: cero `StyleSheet.create`, cero clases arbitrarias, cero hex fuera de
  `src/theme/` en código de pantalla.
- Alcance: sin tocar `backend-pet-tracker/`, `infra/`, `hosting/`, `app.json`,
  `package.json` ni `src/theme/`.

## Notas para el reviewer

1. **R18 cerrado**; `traceability.md` sin filas pendientes, los 20 requisitos
   con rojo y verde.
2. La única divergencia con la enmienda son **`ALL_USES` 325 y R10 42** (no
   324/41), por la convención de una fila por ocurrencia. Justificada arriba;
   si se prefiere el 324, habría que romper `checkUses`, que es peor negocio.
3. **Nada firmado por un humano se ha marcado.** Las 9 casillas de R19 siguen
   vacías, `feature_list.json` sin tocar, sin PR, sin merge.
4. Siguen pendientes los **dos gates humanos** de `tasks.md` §Cierre: smoke en
   dev build de Android y firma de las 9 enmiendas de R19.
5. `progress/impl_mobile-ui-language.R18.patch.txt` queda **obsoleto**: era el
   test cuando R18 estaba bloqueado. El vigente está en el árbol. Se puede
   borrar en el cierre.

---

# Tramo 4 — el escáner de R18(b) deja de tener regiones ciegas

Fecha: 2026-09-06
Branch: `feature/65-mobile-ui-language`

Cierra el único defecto bloqueante del veredicto
`progress/review_mobile-ui-language.md`. **El defecto era mío**, y el reviewer
tiene razón entera: la migración de copy estaba bien, el candado que la vigila
no.

## Rojo → verde

| Qué | Rojo | Verde |
|---|---|---|
| escáner sin regiones ciegas | `2895e9d` | `2f6a2b5` |

Trazabilidad en `ce81fb2`. R18 conserva su fila y su `describe`; no se mueve
ninguna cifra ni ningún requisito, así que **no vuelve al gate humano**.

## El defecto, reproducido antes de tocar nada

Reproduje el falso verde del reviewer tal cual, sobre el árbol de HEAD:
planté `const STRAY_COPY = 'Resumen de hoy';` en `src/app/(tabs)/home.tsx:59`
—valor `es` de `home.summaryTitle`, dentro de la región ciega— y la suite
**pasó 20/20**. Confirmado y revertido antes de escribir el arreglo.

La causa es la que el reviewer señala: en `WHOLE_LITERAL`, la alternativa de
plantilla excluía `$` de su clase de caracteres, así que **ninguna plantilla
con `${…}` podía casar**; el motor seguía, tomaba la backtick **de cierre**
como si fuera de apertura y se tragaba todo hasta la siguiente.

## El rojo lo enseña sin ambigüedad

El test de regresión opera sobre `wholeLiterals` directamente, con un fixture
de dos plantillas con `${…}` y copy entre medias. Con el escáner roto:

```
● #65 R18: … › extrae los literales que siguen a una plantilla con interpolación

    Expected: ArrayContaining ["Resumen de hoy", "Horario de comidas"]
    Received: ["; const stray = 'Resumen de hoy'; const label =", "Horario de comidas"]
```

La región engullida aparece literalmente como **un solo literal falso**. Es la
firma exacta del descuadre.

## El arreglo: AST, no un regex mejor

`wholeLiterals` pasa a recoger `StringLiteral`,
`NoSubstitutionTemplateLiteral` y `JsxText` de un `ts.createSourceFile`.

**Por qué no el arreglo mínimo de un carácter** (`[^`\\$]` → `[^`\\]`), que el
`leader` proponía y que también habría puesto verde este rojo: porque deja
viva la clase de fallo, no solo esta instancia. Emparejar delimitadores de un
lenguaje real a mano se descuadra por más sitios — el más cercano, un
apóstrofo dentro de un nodo de texto JSX (`Today's Summary` es un valor del
propio catálogo), que abriría una cadena y cegaría desde ahí. Hoy hay **cero**
apóstrofos en texto JSX de las 19 pantallas, pero eso es suerte, no una
propiedad. El AST no tiene esa clase de fallo porque no empareja nada.

Cumple las tres condiciones que el `leader` puso: **ninguna dependencia
nueva** (`typescript` ~6.0.3 ya es `devDependency`, y el `package.json` sigue
sin tocarse), no analiza las plantillas —solo las **consume** como nodos— y es
más corto que el lexer que sustituye.

### Cuánto tapaba, medido

Comparando el escáner viejo con el nuevo sobre las 19 pantallas, por literales
distintos extraídos:

| Fichero | regex | AST | no veía |
|---|---:|---:|---:|
| `screens/profile/index.tsx` | 64 | 129 | **67** |
| `app/(tabs)/weight-log.tsx` | 26 | 86 | **65** |
| `app/(tabs)/food.tsx` | 54 | 104 | **56** |
| `app/(tabs)/home.tsx` | 66 | 107 | **45** |
| `app/(tabs)/health.tsx` | 52 | 84 | **36** |
| `screens/reminders/index.tsx` | 81 | 104 | 34 |
| `screens/add-pet/index.tsx` | 114 | 131 | 29 |
| `screens/add-reminder/index.tsx` | 65 | 83 | 22 |
| `app/(tabs)/map.tsx` | 81 | 83 | 5 |
| `app/(tabs)/meal-schedule.tsx` | 98 | 99 | 3 |
| `screens/docs/index.tsx` | 55 | 52 | 2 |

**364 literales que el regex nunca vio, en 11 de las 19 pantallas.** (El
reviewer contó 10 midiendo bytes ciegos; contando literales distintos salen 11
— `meal-schedule` y `docs` aportan poco y se le quedaron por debajo del
umbral.) Donde el AST extrae *menos* que el regex —`login` 47→46, `pairing`
146→142— es porque el regex fabricaba basura: regiones engullidas y trozos de
`a > b` leídos como texto JSX.

## Mutación endurecida, y así se queda

Como pide el `leader`, la prueba de mutación de C4(b) pasa a hacerse **en una
región que antes estaba ciega**, no en un sitio cómodo. Esto **aprieta** el
requisito firmado, no lo afloja, así que no necesita gate nuevo.

Mismo sitio del falso verde, `home.tsx:59`, ahora con el escáner arreglado:

```
● #65 R18: … › no deja ningún valor fijo del catálogo como literal entero en las pantallas

      Object {
        "file": "src/app/(tabs)/home.tsx",
    -   "looseCopy": Array [],
    +   "looseCopy": Array [
    +     "es:home.summaryTitle = Resumen de hoy",
    +   ],
      }
```

Falla **por su aserción**, nombrando fichero y cadena. Mutación revertida y
suite verde.

> **Regla para quien siga**: la mutación de R18 se planta **después de la
> primera plantilla con `${…}` del fichero**. Una mutación en la cabecera de un
> fichero no vale como evidencia — es exactamente lo que ocultó este defecto
> durante dos tramos.

## Copy o decisiones no previstas

- **Ninguna.** El escáner nuevo, con 364 literales más a la vista, sigue sin
  encontrar copy suelta en las 19 pantallas: coincide con el barrido AST
  independiente del reviewer. La migración estaba bien; solo estaba mal
  vigilada.
- Borrado `progress/impl_mobile-ui-language.R18.patch.txt`, obsoleto desde que
  R18 entró.
- **No toqué** lo que el veredicto excluye: la desviación 325/42 se queda, el
  `259` de `language-provider.test.tsx:40` se queda como deuda anotada, y el
  test tautológico de `ALL_USES` se queda donde está.

## Verificación

- `./init.sh`: **exit code 0**, sin flake. Build, 163 + 2 + 63 suites, e2e
  (`353 passed`), lint y typecheck verdes.
- `bun run test` (móvil): **63 suites / 932 tests** (+1, el de regresión).
- `bun run typecheck` y `bun run lint`: limpios, **0 warnings**.
- Alcance: solo `ui-language.test.ts`, `traceability.md` y este reporte. Sin
  tocar `backend-pet-tracker/`, `infra/`, `hosting/`, `app.json`,
  `package.json` ni `src/theme/`. Ninguna casilla humana marcada,
  `feature_list.json` intacto, sin PR ni merge.

## Notas para el reviewer

1. El fixture del test de regresión vive **dentro del test**, no en un fichero
   aparte: prueba `wholeLiterals` como unidad, sin tocar el árbol.
2. Si quieres rehacer la medida de cobertura, el script está en el commit
   `2f6a2b5` — o más simple: planta el literal en `home.tsx:59` y comprueba que
   ahora es rojo.
3. `progress/review_mobile-ui-language.md` sigue **sin versionar** (untracked).
   Lo dejo como está: es tu artefacto, no mío.
