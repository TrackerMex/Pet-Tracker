---
feature: "mobile-reminders-see-all-source-lock-nesting"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Diseño — [[mobile-reminders-see-all-source-lock-nesting]] (#112)

> Ver [[requirements]] para los requisitos y [[tasks]] para el orden TDD.
> **Todas las tablas están medidas, no estimadas**, sobre `993b62fa`. La
> columna «hoy» es jest real (`bunx jest --runTestsByPath src/screens/home/index.test.tsx`)
> con cada mutación escrita en `src/screens/home/index.tsx` y revertida
> después (`git diff --exit-code 993b62fa` limpio al terminar). La columna
> «nuevo» compone dos mediciones: la pata de árbol, que no depende del recorte
> y sale del mismo jest, y la pata de fuente, simulando en Node el recorte
> nuevo exacto sobre el mismo fichero mutado. El test no se editó para medir.
> El commit rojo de Codex lo confirma con jest.

## Decisión: aplicar el patrón que ya está decidido

`docs/conventions.md` §«Recortes del tag de apertura en candados de fuente» ya
fija el acotado, sus dos límites y cuál de los dos avisa. #109 lo aplicó al
`meal-toggle` y el `reviewer` lo aprobó a la primera. Esta feature lo lleva al
último call-site que queda:

```ts
const block = source.slice(
  source.lastIndexOf('<', anchor),
  source.indexOf('<', anchor),
);
```

**Precondiciones del patrón, verificadas en este call-site:**

- El ancla `testID="reminders-see-all"` aparece **una vez** en `index.tsx`.
- Vive **dentro** del tag de apertura del `<Pressable>` y es su **primera
  prop**.
- En ese tag **no hay ningún `<`**: el recorte nuevo sobre la base mide 313
  caracteres, contiene un único `<` (el suyo) y termina justo antes de
  `<Text `, el primer hijo.
- Entre el `>` del tag y `<Text` solo hay espacio en blanco, así que el límite
  2 (cadena hija) no mete nada en el bloque.

## Dónde está el agujero de verdad

Esta es la diferencia con #109, y es la que decide qué mutación se versiona.

En #109 las dos patas eran `it` separados. Aquí **comparten `it`**, con la de
árbol primero:

```ts
expect(opacityOf(link.props.style)).toBe(1);   // árbol: solo ve el reposo
expect(block).toMatch(/…0\.8…/);                 // fuente
```

La mutación de #109 (V4: quitar el `style` del botón y colgarlo de un hijo)
**no sirve aquí**: medida como **N1p**, da ROJO **hoy** por `toBe(1)`, porque
sin `style` el reposo ya no vale 1. La pata de árbol tapa esa forma.

El agujero vive en la **zona ciega de la pata de árbol**, el estado pulsado. Si
el propio tag conserva `opacity: 1` en reposo pero pierde la receta, y un hijo
anidado la lleva (**N1**), pasa esto:

| | pata de árbol | pata de fuente, recorte viejo | pata de fuente, recorte nuevo |
|---|---|---|---|
| **N1** | verde (reposo = 1) | **verde**: el bloque llega al `</Pressable>` del hijo y contiene su tag de apertura | **ROJO**: el bloque es el tag propio, con `style={{ opacity: 1 }}` |

Con N1 y el recorte viejo, **la suite móvil entera da 82 suites / 1452 tests
verdes** (exit 0). `reminders-see-all` se ha quedado sin feedback de pulsado y
nada se pone rojo. Es la mutación que se versiona en el commit rojo.

**El candado no es tautológico.** La regex es un literal del test y no un
símbolo importado de producción. Tampoco muestrea un continuo: asevera un
valor exacto. V7 (`0.8` → `0.5`) lo demuestra, porque solo la pata de fuente
lo detecta.

**Hay un señuelo real en el fichero.** `home-alerts-bell`, **antes** de
`reminders-see-all`, lleva la receta idéntica. El recorte viejo no lo alcanza
porque `lastIndexOf('<Pressable', anchor)` se detiene en el `<Pressable` propio.
El nuevo tampoco, porque `lastIndexOf('<', anchor)` se detiene en el `<`
propio. S2 lo confirma con un hermano pegado.

## La medición completa

Doce sondas más la base. El texto exacto de cada mutación está en [[tasks]].
«Otros» cuenta los tests del fichero que caen además del candado.

| | Mutación | Hoy (viejo) | Otros | Nuevo | ¿Cambia? |
|---|---|---|---|---|---|
| B0 | base | VERDE | 0 | VERDE | no |
| **N1** | propio `{ opacity: 1 }` + anidado con receta | **VERDE** | 0 (y 0 en la suite) | **ROJO** `toMatch` | **se cierra** |
| **W1** | propio `{ opacity: 1 }` autocerrado + hermano posterior con receta y el `<Text>` | **VERDE** | 3 | **ROJO** `toMatch` | **se cierra** |
| N1p | propio sin `style` + anidado con receta | ROJO `toBe(1)` | 0 | ROJO `toBe(1)` | no |
| N2 | anidado sin receta, propio intacto | VERDE | 0 | VERDE | no |
| S1 | propio `{ opacity: 1 }` | ROJO `toMatch` | 0 | ROJO `toMatch` | no |
| S1p | propio sin `style` | ROJO `toBe(1)` | 0 | ROJO `toBe(1)` | no |
| S2 | S1 + hermano anterior `<Pressable …receta… />` | ROJO `toMatch` | 0 | ROJO `toMatch` | no |
| S3 | S1 + hermano posterior `<Pressable …receta… />` | ROJO `toMatch` | 0 | ROJO `toMatch` | no |
| E2 | `hitSlop={0 < 1 ? 8 : 0}` antes del ancla | VERDE | 0 | VERDE | no |
| E3 | la receta delante del ancla | VERDE | 0 | VERDE | no |
| V6 | receta en tres líneas | ROJO `toMatch` | 0 | ROJO `toMatch` | no |
| V7 | `0.8` → `0.5` | ROJO `toMatch` | 0 | ROJO `toMatch` | no |
| L2 | S1 + receta como cadena hija | ROJO (render roto) | 117 | ROJO (render roto) | no |
| **E1** | `hitSlop={0 < 1 ? 8 : 0}` entre ancla y receta | VERDE | 0 | **ROJO** `toMatch` | **límite 1** |

Tamaño del bloque, viejo → nuevo: B0 457 → 313 caracteres; N1 516 → 278; W1
507 → 277; E1 497 → 81.

Lectura:

- **Se cierran dos verdes falsos**, N1 (anidar) y W1 (ensanchar). Los dos son
  la misma forma del agujero: todo lo que quede entre el `<Pressable` y
  *algún* `</Pressable>` cuenta para la regex.
- **Once filas no cambian.** No aparece ningún rojo falso nuevo en código
  realista.
- **E1 es el único cambio hacia rojo**, y es el límite 1 ya documentado. Falla
  por el lado seguro. En la base no se da.
- **L2 es el límite 2** (la cadena hija). Da verde en la pata de fuente con
  los dos recortes, pero aquí no puede pasar en silencio: una cadena suelta
  dentro de un `Pressable` rompe el render y tumba 118 de los 140 tests. Es lo
  que `docs/conventions.md` ya dice («en la práctica rompe media suite»).
- **V6 da rojo con los dos recortes.** La regex no tolera espacios, al revés
  que la de #109. No es cosa del recorte, así que no se toca ([[requirements]]
  §Fuera de alcance).

## El guard de hex **sí** alcanza a este fichero

Al revés que en #109. `src/screens/home/index.test.tsx` aparece en **cinco**
listas `featureFiles` de `src/__tests__/design-drift.test.ts`
(`grep -n "'screens/home/index.test.tsx'" src/__tests__/design-drift.test.ts`),
todas con `FEATURE_STYLE_ESCAPES`: `text-[10px]`, `StyleSheet` y
`HEX_LITERAL = #(?!\d{2,3} R\d)[\da-f]{3,8}\b`, sin distinguir mayúsculas.

Consecuencias para lo que escribe Codex en ese fichero:

- `#112 R1` en el título o en el comentario **pasa** (es la forma de cita que
  #108 dejó exenta).
- Una cita suelta como `#112`, `#109/#112` o `(#106/#107)`, que es justo la
  que lleva el comentario de #109 en `food.test.tsx`, **pone rojos los cinco
  guards**.
- Tampoco puede aparecer la palabra `StyleSheet` en ninguna capitalización.

El título y el comentario literales de [[tasks]] se pasaron por las tres regex
del guard y salen limpios. La cita suelta `(#109/#112)` de control sale sucia.

## Título del `it`

C4 exige que el test nombre su R-id, y este fichero acumula R-ids de muchas
specs, así que va con prefijo (`docs/conventions.md` §Prefijo de feature). El
título nuevo **conserva el viejo entero** como subcadena:

```
'#112 R1: muestra feedback visual al pulsar el enlace, acotado a su tag de apertura'
```

Por qué: `specs/mobile-home-reminders-section/traceability.md` (fila R10) cita
`it('muestra feedback visual al pulsar el enlace')`. Con el título viejo como
subcadena, esa cita sigue resolviendo por `grep` y por `-t`, y la
trazabilidad de #70 no hay que tocarla. La mención de ese título en
`specs/mobile-reminders-alerts-to-stack/design.md` describe lo que había en su
momento y tampoco se toca.

## Recuentos

Medidos sin pipe sobre `66c83270` (mismo código de aplicación que
`993b62fa`):

| | Base | Delta esperado |
|---|---|---|
| `src/screens/home/index.test.tsx` | **140** tests, exit 0 | **+0** |
| suite móvil (`bunx jest`) | **82** suites, **1452** tests, 1 snapshot, exit 0 | **+0 / +0** |
| `bunx tsc --noEmit` (con `.expo/types/router.d.ts` borrado) | exit 0 | — |

R1 **edita** un `it` que ya existe. **El candado es la derivación, no el
número**: si #84 u otra feature mergea antes, la cifra absoluta cambia y el
delta sigue siendo +0. Quien implemente mide la base al arrancar.

**Candados de recuento que podrían moverse: ninguno.** Ningún test cuenta los
`it` de este fichero ni lee sus números de línea. El único test que lee su
fuente es `#108 R3` en `design-drift.test.ts`, que busca dos títulos de #106
y que no se tocan. `docs/conventions.md` lo leen tres tests
(`hosting-artifacts.test.ts`, `hero-header-amendments.test.ts` y `#108 R4`),
y ninguno mira la sección que enmienda R4.

## Barrido de gemelos

Hecho sobre `mobile-pet-tracker/src` con
`grep -rn "lastIndexOf(" mobile-pet-tracker/src`, además de
`indexOf('</…')`, `indexOf('<Tag')` y todos los `source.slice(`.

| Sitio | Forma | Veredicto |
|---|---|---|
| `src/screens/home/index.test.tsx` · `reminders-see-all` | `lastIndexOf('<Pressable')` → `indexOf('</Pressable>')` | **este**, #112 |
| `src/app/(tabs)/__tests__/food.test.tsx` · `meal-toggle` | `<` → `<` | ya migrado (#109) |
| `src/__tests__/consistency-classnames.test.ts` · `CONTINUOUS_CORNER` | `lastIndexOf('<', use.index)` → `use.index` | la referencia; sano |
| `elementWithTestId` en `consistency-classnames.test.ts` y `legibility-classnames.test.ts` | ancla → `indexOf(closingTag)`, hijos dentro | **primo**: registrar (abajo) |
| `src/app/__tests__/layout.test.tsx` | orden de `indexOf('<AuthProvider>')`… | no recorta; sano |
| `src/screens/alerts/index.test.tsx`, `QUICK_ACTIONS` de la Home | recortes entre anclas de código, no de tags | sanos |
| `#78 R10` de la campana, en este mismo fichero | receta contra **todo** el fuente, sin recorte | **sin acotar**: registrar (abajo) |

**No hay un tercer gemelo exacto.** Hay dos hallazgos vecinos, que se
registran y **no amplían el alcance**:

1. **`elementWithTestId`** (5 call-sites: `</Button>` ×1, `/>` ×2 y `</View>`
   ×1 en `consistency`, y `</Button>` ×1 en `legibility`). Su bloque va desde
   el ancla hasta el primer tag de cierre, **con los hijos dentro**, así que
   un hijo con la clase buscada fabrica un verde. Medido en Node sobre
   `pill-active` de `src/screens/reminders/index.tsx`: se quita `rounded-xl`
   del propio tag, se añade el hijo `<View className="rounded-xl" />` y el
   bloque sigue conteniendo `rounded-xl`. El candado de
   `#62 R4 … lleva las tres píldoras de resumen de reminders a rounded-xl`
   pasa verde. **No es este patrón**: el call-site de `legibility` asevera a
   propósito sobre un **hijo** (`<Button.Label …>`), así que la ventana de `<`
   a `<` lo rompería. Arreglarlo es otra decisión.
2. **El candado de la campana** (`#78 R10` ›
   `usa la ruta real sin cast Href y conserva el feedback de pulsado`) asevera
   la receta contra `index.tsx` entero. Medido con jest: si `home-alerts-bell`
   pasa a `style={{ opacity: 1 }}`, el fichero da **140/140 verde**, porque la
   receta de `reminders-see-all` basta. Es la misma lección que #112 (el
   candado mira otro elemento), pero sin recorte que arreglar: habría que
   **crearle** uno.

El `leader` decide si abre features y les asigna id contra `origin/main`.

## Coordinación

- `#108` y `#110` están `done`, así que `src/screens/home/index.test.tsx` está
  libre.
- `#84` (sesión Backend, worktree `Pet-Tracker-wt-backend`,
  `feature/84-reminder-dates-days-until-drift`) declara en su `design.md`
  §Archivos afectados que no cambian `src/screens/home/*` ni `docs/`. Su diff
  contra `origin/main` solo toca `specs/` y `feature_list.json`. **No hay
  solape de ficheros**. Si mergea antes, sube el recuento absoluto de la suite
  (añade tests) y el delta de #112 no cambia.
- `docs/conventions.md` es superficie compartida. R4 solo sustituye un
  párrafo, localizado por su contenido.

## Archivos afectados

No hay capas de `docs/architecture.md`: esta feature no toca `domain`,
`application` ni `infrastructure`. Todo es andamiaje de verificación.

| Archivo | Qué cambia |
|---|---|
| `mobile-pet-tracker/src/screens/home/index.test.tsx` | R1: título del `it` y las dos líneas del recorte. R4: comentario de 5 líneas encima del `const block` |
| `docs/conventions.md` §Recortes del tag de apertura | R4: se sustituye el último párrafo |
| `mobile-pet-tracker/src/screens/home/index.tsx` | **solo dentro del par rojo→verde**: N1 versionada en el rojo y revertida en el verde. Diff acumulado **vacío** (R5) |
| `specs/mobile-reminders-see-all-source-lock-nesting/traceability.md` | los hashes, que rellena Codex |
| `progress/impl_mobile-reminders-see-all-source-lock-nesting.md` | el reporte de Codex |

**C8** (`docs/ui-guidelines.md`) se cumple de forma trivial, porque no hay
superficie de UI. El grep-clean aplica al comentario y lo vigilan los guards
de `design-drift.test.ts` (ver arriba). La mutación N1 usa
`style={{ opacity: 1 }}`, sin hex ni clases arbitrarias, así que el commit rojo
tampoco ensucia el grep.

## Alternativas descartadas

- **Versionar la V4 pura de #109 (N1p)**: la tapa la pata de árbol y da rojo
  hoy. No demostraría el agujero.
- **Separar la pata de fuente en un `it` propio**: daría +1 test, y el
  recorte nuevo ya cierra N1 y W1 sin separar nada. Separar no cerraría
  ninguna fila más de la tabla.
- **Balanceador de tags**: código nuevo en un test, que a su vez habría que
  vigilar. #109 ya lo descartó y `docs/conventions.md` recoge esa decisión.
- **Borrar la pata de fuente**: V7 demuestra que es el único candado del
  `0.8`.
- **Hacer la regex tolerante a espacios** (como la de #109): arreglaría V6,
  pero cambia lo que se busca y no el recorte. Queda fuera.
- **Enmendar la trazabilidad de #70** con el título nuevo: no hace falta,
  porque el título viejo sobrevive como subcadena.
- **Arreglar de paso `elementWithTestId` o la campana**: son hallazgos con
  forma distinta ([[#Barrido de gemelos]]). Se registran y no se amplía el
  alcance.
