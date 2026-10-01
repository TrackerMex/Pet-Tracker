---
feature: "mobile-classnames-own-tag-tree-lock"
status: approved         # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Diseño — [[mobile-classnames-own-tag-tree-lock]] (#127 y #128)

> Ver [[requirements]] para los requisitos y [[../../docs/architecture|architecture]]
> para las capas. Este ciclo solo añade tests a la capa de presentación móvil
> (pantallas de autenticación, salud, recordatorios y reset-password, y el
> componente del hero) y edita una sección de `docs/conventions.md`. No hay
> dominio, aplicación ni infraestructura implicados, ni cambio de UI.

## Decisiones técnicas

### D1. Un ciclo, dos entradas, una numeración

#127 y #128 son solo test, nacen del mismo §Fuera de alcance de #120 y se
cierran igual: con una aserción en el árbol. Además comparten
`src/screens/reminders/index.test.tsx`, donde #127 pone las píldoras y #128 el
botón destructivo. Con dos ciclos separados habría dos branches añadiendo al
final del mismo fichero, y el reparto de ficheros no protege la historia. Por
eso hay una sola spec con una numeración corrida, y el prefijo de cada
`describe` dice de qué entrada es:

| R | Entrada | `describe` | Fichero |
|---|---|---|---|
| R1 | #127 | `#127 R1: el botón de envío de <pantalla> lleva su receta en el árbol` (cuatro, uno por pantalla) | los cuatro tests de autenticación |
| R2 | #127 | `#127 R2: el skeleton de vacunas lleva su receta en el árbol` y `#127 R2: el skeleton del hero lleva su receta en el árbol` | salud y hero |
| R3 | #127 | `#127 R3: las tres píldoras de resumen llevan su receta en el árbol` | recordatorios |
| R4 | #128 | `#128 R4: el botón destructivo del sheet y su etiqueta llevan su receta en el árbol` | recordatorios |
| R5 | las dos | sin test | `docs/conventions.md` |
| R6 | las dos | sin test | cierre medido |

`#128 R4` no tiene un `R1`: la numeración es de la spec, no de cada entrada,
como `#142 R2` dentro del ciclo de #141. `init.sh` solo deja una feature en
`in_progress`, así que #128 tiene un puntero en
`specs/mobile-delete-confirm-label-tree-lock/requirements.md` y se queda en
`spec_ready` hasta el cierre.

### D2. El candado vive en el árbol, en el test de cada elemento

Los límites 2 y 3 del recorte son de **leer fuente**: un comentario o un
`{false && …}` son texto en el fichero y no nodos en el árbol. Ningún arreglo
del recorte los cierra del todo. Quitar los comentarios con una expresión
regular deja vivo el `{false && …}`, y un parser de JSX es una dependencia
nueva o mucho código para un candado. El árbol, en cambio, solo tiene lo que
se renderiza.

Por eso los candados nuevos van **en el test que ya monta cada elemento**, y
no en `consistency-classnames.test.ts` ni en `legibility-classnames.test.ts`,
que no se tocan. Esos dos siguen valiendo para lo que ven: el límite 1, la
receta en otro hijo (`B-login-h`, `P-week-h`, `V-h`, `S-h`) y el `variant`
borrado (`D-v`). Los nuevos se suman a ellos, no los sustituyen.

### D3. `toBe` con la clase entera, incluida la de heroui-native

Cada candado compara el `className` del host con `toBe` contra la cadena
entera, incluidas las clases que compone heroui-native 1.0.8:

- en el `Button`, `pressable-feedback__root button__root button__root--variant-<v> button__root--size-md`
  y `disabled:element-disabled` si está deshabilitado;
- en el `Button.Label`, `button__label button__label--variant-<v> button__label--size-md`;
- en el `Skeleton`, `skeleton__root`.

Con `toContain('rounded-xl')`, la sonda que quita `rounded-xl` daría rojo,
pero una clase de más (`bg-default` junto a `bg-accent`) daría verde, y
`toContain('bg-accent')` también casa dentro de `bg-accent-soft`. Una
expresión regular sobre el sufijo propio (`/ w-full rounded-xl bg-accent$/`)
dejaría fuera la variante y el estado deshabilitado, que también son decisión
del elemento: `Z-d-variant` solo da rojo porque la variante está en el
literal.

**El coste**: siete literales (los cuatro botones de envío, el botón
destructivo, su etiqueta y el skeleton de vacunas) dependen de cómo
heroui-native compone sus clases. Al subir su versión, quien la suba tiene que
volver a medirlos. Es una decisión de firma ([[requirements]] §Qué firma el
humano, punto 3), y R5 la deja escrita en la convención.

### D4. Un `it` por elemento, salvo las píldoras

- **R1 y R2**: un `describe` con un `it` en el test de cada elemento. Cada
  pantalla monta lo suyo, y un rojo nombra la pantalla en el título.
- **R3**: un solo `it` con una lista `{ testID, className, style }` de las tres
  píldoras, comparada con `toStrictEqual`. Las tres viven en la misma pantalla
  y con el mismo montaje. La lista ve a la vez la clase, la esquina y el orden
  de cada una. `toStrictEqual` y no `toEqual`, para que una clave de más en el
  `style` no pase.
- **R4**: un solo `it` con dos aseveraciones, primero el botón y luego la
  etiqueta. El sheet hay que abrirlo una vez, y las dos decisiones son del
  mismo elemento.

### D5. El rojo de R4 es `D-c`, no `D-d`

La entrada de #128 nombra `D-d` (un `{false && (<Button.Label …>…)}` con la
etiqueta correcta delante de la real). `D-d` da rojo en R4, como pide la
entrada, pero **no sirve como mutación versionada**. Mete una aparición más de
`t('reminders.delete')`, y dos `it` de `src/__tests__/ui-language.test.ts`
(`#65 R8` y `#65 R18`) cuentan esas apariciones con `toEqual`, así que ya dan
rojo hoy. El commit rojo tendría tres rojos y dos de ellos serían ajenos a R4.

`D-c` (la etiqueta correcta en un comentario `{/* … */}` delante de la real,
que pasa a `text-foreground`) es el mismo hueco en el bloque de
`legibility-classnames.test.ts` y solo pone en rojo R4. `D-d` queda en
[[tasks]] §Sondas, con sus tres rojos esperados.

### D6. Esperados literales, nunca importados

Las clases, `{ height: 260 }`, `{ borderCurve: 'continuous' }` y el texto
`'Eliminar'` están escritos en los bloques. No se importan
`PET_HERO_MEDIA_HEIGHT`, `CONTINUOUS_CORNER` ni el catálogo, ni se lee la
fuente. Un candado que compara la pantalla consigo misma es tautológico:
cambiar `PET_HERO_MEDIA_HEIGHT` a 200 movería a la vez el esperado y el
recibido.

### D7. R4 busca la etiqueta con `within(confirm).getByText('Eliminar')`

La etiqueta no tiene `testID`, y añadírselo sería tocar producción. Con
`within` sobre el botón y `getByText`, una etiqueta duplicada que se renderice
da un rojo **por consulta** (`Found multiple elements with text: Eliminar`), y
una etiqueta que no se renderice no existe. `getByText` devuelve el `Text`
host de la etiqueta, y su `className` es el de `Button.Label` (medido).

### D8. Cada rojo es una mutación versionada (C4, vía b)

Los diez elementos ya cumplen, así que cada commit rojo lleva una mutación de
producción y el verde la revierte con `git checkout HEAD~1 --`. Las cuatro
mutaciones son sondas que hoy dan verde en las 33 suites, y cada una solo pone
en rojo los `it` nuevos de su requisito (medido sobre el árbol final):

| R | Mutación | Qué hace | Blobs |
|---|---|---|---|
| R1 | `P1red` | en los cuatro botones, `rounded-xl` sale del `className` y la receta queda en una línea `// rounded-xl bg-accent` dentro del tag (límite 3) | login `00794879`, forgot `a2d2c544`, register `d0cb2b30`, reset `c910abf7` |
| R2 | `P2red` | en salud, `rounded-card` sale de la clase, y la receta entera queda en un `//` dentro del tag. En el hero, la clase pasa a `w-full bg-default` y la de antes queda en un `//` | salud `565067e2`, hero `9b4d1690` |
| R3 | `P3red` = `P-week-l3` | `pill-week` pierde `rounded-xl`, que queda en una línea `// rounded-xl` dentro del tag | recordatorios `baa5baba` |
| R4 | `P4red` = `D-c` | la etiqueta correcta en un `{/* … */}` delante de la real, que pasa a `text-foreground` | recordatorios `74fe6d45` |

Ninguna mutación pone en rojo los candados de fuente, que es justo el hueco
que se cierra. Ninguna es un `ReferenceError` ni un doble de test mutado. Los
rojos son siempre **por aserción**.

### D9. Bloques al final, sin imports nuevos, sin tocar helpers

Cada bloque se pega al final de su test, detrás del último `describe` de la
base. En recordatorios va primero R3 y luego R4. Cada `describe` nuevo trae su
propio `beforeEach`, copiado del montaje que ya usa el test, para no depender
del orden ni de los `beforeEach` de los `describe` vecinos.

Solo usan lo que cada test ya importa o define. No se añade ni se cambia
ningún helper, mock ni import, ni se toca ninguna línea previa. El test de
base es un prefijo exacto del final. Los bloques están en [[tasks]] con su
texto exacto, y el blob de cada test permite comprobar que se pegaron byte a
byte. No hay configuración de prettier en `mobile-pet-tracker/` y no se pasa
ningún formateador.

### D10. El hero se asevera con su `Skeleton` sustituido

`src/components/__tests__/pet-hero-header.test.tsx` sustituye `Skeleton` de
heroui-native por un `View` que pasa sus props. Por eso el literal es
`'w-full'` y no `'skeleton__root w-full'`. R2 no quita esa sustitución: lo que
se cierra es la clase y el estilo que el componente le pasa al `Skeleton`, y
eso lo ve igual. La sustitución tiene una ventaja: el `style` que llega es
exactamente el del componente, y `toStrictEqual({ height: 260 })` ve un radio
colado (`Z-hero-style`). En salud el `Skeleton` es el real, y su `style` no se
asevera (D).

## Archivos afectados

Rutas relativas a `mobile-pet-tracker/` salvo las de `docs/`, `specs/` y
`progress/`.

| Capa | Archivo | Cambio |
|---|---|---|
| presentación (test) | `src/app/(auth)/__tests__/login.test.tsx` | +19 / −0 (R1). De 156 a 175 líneas y de 9 a 10 tests |
| presentación (test) | `src/app/(auth)/__tests__/forgot.test.tsx` | +10 / −0 (R1). De 89 a 99 y de 3 a 4 |
| presentación (test) | `src/app/(auth)/__tests__/register.test.tsx` | +19 / −0 (R1). De 239 a 258 y de 11 a 12 |
| presentación (test) | `src/screens/reset-password/index.test.tsx` | +14 / −0 (R1). De 266 a 280 y de 17 a 18 |
| presentación (test) | `src/screens/health/index.test.tsx` | +28 / −0 (R2). De 689 a 717 y de 28 a 29 |
| presentación (test) | `src/components/__tests__/pet-hero-header.test.tsx` | +13 / −0 (R2). De 614 a 627 y de 36 a 37 |
| presentación (test) | `src/screens/reminders/index.test.tsx` | +86 / −0 (+50 R3 y +36 R4). De 911 a 997 y de 29 a 31 |
| presentación | `src/app/(auth)/login.tsx`, `forgot.tsx` y `register.tsx`, `src/screens/reset-password/index.tsx`, `src/screens/health/index.tsx`, `src/components/pet-hero-header.tsx` y `src/screens/reminders/index.tsx` | ninguno en el diff acumulado. Entran y salen en los pares rojo/verde |
| docs | `docs/conventions.md` | +12 / −3 (R5) |
| harness | `progress/impl_mobile-classnames-own-tag-tree-lock.md` | nuevo, en el commit de evidencia |
| harness | `specs/mobile-classnames-own-tag-tree-lock/traceability.md` | rellenado en el commit de evidencia |

## Coordinación

- **#60** (`feature/60-mobile-ios-support`, en el worktree principal
  `/home/claude/sites/Pet-Tracker`) no toca ninguno de los catorce ficheros.
  En `docs/conventions.md` toca una línea de la sección de `DATABASE_URL`, lejos
  de §Recortes del tag de apertura, así que el merge no debería dar conflicto.
  Si #60 mergea antes, la cuenta de base de la suite puede cambiar (#60 toca
  `src/__tests__/hosting-artifacts.test.ts` y `app.config.test.ts`), y el delta
  exigido sigue siendo +8 tests y +0 suites sobre lo que se mida al arrancar.
- `origin/feature/18-nutrition-ai-explainer` añade 3 líneas a
  `docs/conventions.md` y lleva parada desde el 2026-08-18. No toca esta
  sección.
- #144 está `pending` y no toca ninguno de estos ficheros.
- Si al arrancar algún blob de base no coincide, se para ([[tasks]] §Antes de
  tocar nada, paso 5).

## Alternativas descartadas

- **Arreglar el recorte en `consistency-classnames.test.ts`** (quitar
  comentarios, o parar en el primer `{`). Deja vivo el `{false && …}`, o
  necesita un parser de JSX. Además, un candado de fuente nunca ve si el
  elemento se renderiza. Ver D2.
- **`toContain` por clase, como el `toContain('bg-danger')` de `confirmDelete`**.
  No ve las clases de más, y casa dentro de otra clase (`bg-accent` en
  `bg-accent-soft`). Ver D3.
- **Una expresión regular sobre el sufijo propio**. Deja fuera la variante y el
  estado deshabilitado, y con ella `Z-d-variant` saldría verde. Ver D3.
- **Usar `D-d` como rojo de R4**. Mete dos rojos ajenos de `ui-language`. Ver
  D5.
- **Un helper de montaje compartido o un test nuevo que monte las siete
  pantallas**. Los siete tests ya montan cada pantalla con sus mocks. Un
  fichero nuevo duplicaría esos mocks, y un helper compartido sería código
  nuevo para un solo uso.
- **Dar `testID` a la etiqueta del botón destructivo**. Es tocar producción, y
  la entrada pide cero cambios en producción. `within` + `getByText` basta
  (D7).
- **Cerrar también la tinta de las etiquetas de los cuatro botones de envío**
  (`Z-label`) **y la tipografía de los hijos de las píldoras** (`Z-child`). Son
  otros elementos que la entrada no nombra. Quedan como (F) en
  [[requirements]] §Fuera de alcance.
- **Un gate de dispositivo**. La UI no cambia, así que en pantalla no hay nada
  que ver.
