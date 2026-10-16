---
feature: "mobile-account-heroui-text-sizes"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Requisitos: tamaños 13 px y 17 px de las pantallas de cuenta (#187)

> Pedido: que `Label.Text` (13 px) y `Button.Label` (17 px) de `login`,
> `register`, `forgot` y `reset-password` pinten el tamaño de su artboard del
> canvas. Hoy `text-13` y `text-17` no hacen nada en esos 17 sitios y el texto
> cae a 16 px. Más un candado de familia que impida volver a pasar un
> `text-<n>` de la escala propia a un componente que fusiona `className`.
>
> Ver [[design]] para las decisiones, [[tasks]] para la cadena de commits y
> [[traceability]] para la trazabilidad.
>
> Esta spec la lee Codex sin acceso a la conversación: rutas, símbolos, `it` y
> cifras son literales. Los nombres de skills de Codex NO son los nuestros; esta
> spec no nombra ninguna y el leader traduce los nombres en el handoff.

## Base medida

Medido sobre `44acd74b17d793e1dc15c0a11213f7bc50f36a68` (HEAD de `main` al
escribir esta spec). **H0 es el commit del handoff**, no este hash: Codex
arranca con `git rev-parse HEAD` (= H0) y re-mide las anclas de abajo. Si una no
da su valor, **para y avisa**. Toda cifra de este documento es «base + delta» y
dice su base. Ninguna ancla usa números de línea.

Comandos desde `mobile-pet-tracker/` (cada uno es un `cd` explícito en el
handoff). `$n` recorre `login register forgot reset-password`.

```bash
# A1  Label.Text con receta 13 px            -> login 2, register 7, forgot 1, reset-password 2   (total 12)
for n in login register forgot reset-password; do printf '%s %s\n' $n "$(grep -cF '<Label.Text className="text-13 font-semibold text-muted">' src/screens/$n/index.tsx)"; done
# A2  Button.Label primario 17 px            -> 1, 1, 1, 1   (total 4)
for n in login register forgot reset-password; do printf '%s %s\n' $n "$(grep -cF '<Button.Label className="text-17 font-extrabold text-accent-foreground">' src/screens/$n/index.tsx)"; done
# A3  Button.Label secundario 17 px          -> login 0, register 0, forgot 1, reset-password 0   (total 1)
for n in login register forgot reset-password; do printf '%s %s\n' $n "$(grep -cF '<Button.Label className="text-17 font-extrabold text-foreground">' src/screens/$n/index.tsx)"; done
# A4  Los 17 sitios en una cuenta            -> 17
grep -rnE '<(Label\.Text|Button\.Label) className="text-(13|17) ' src --include=*.tsx | grep -v '\.test\.' | wc -l
# A5  Ficheros que los contienen             -> forgot, login, register, reset-password (4 rutas, en ese orden)
grep -rlE '<(Label\.Text|Button\.Label) className="text-(13|17) ' src --include=*.tsx | grep -v '\.test\.' | sort
# A6  Los destinos aún no existen            -> 0 en las cuatro pantallas, para los tres literales
for n in login register forgot reset-password; do printf '%s %s %s %s\n' $n "$(grep -cF '<Text className="text-13 font-semibold text-muted">' src/screens/$n/index.tsx)" "$(grep -cF '<Text className="text-17 font-extrabold text-accent-foreground">' src/screens/$n/index.tsx)" "$(grep -cF '<Text className="text-17 font-extrabold text-foreground">' src/screens/$n/index.tsx)"; done
# A7  Text ya se importa de react-native     -> 1 en cada pantalla
grep -cF "import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';" src/screens/{login,register,forgot,reset-password}/index.tsx
# A8  Cierres que acompañan                  -> </Label.Text>: login 2, register 7, forgot 1, reset-password 2;  </Button.Label>: 1, 1, 2, 1
for n in login register forgot reset-password; do printf '%s %s %s\n' $n "$(grep -cF '</Label.Text>' src/screens/$n/index.tsx)" "$(grep -cF '</Button.Label>' src/screens/$n/index.tsx)"; done
# A9  Único importador de tailwind-merge     -> src/components/card.tsx
grep -rln "from 'tailwind-merge'" src
# A10 Versiones fijadas                      -> heroui-native "1.0.8" (exacta), tailwind-merge ^3.6.0, tailwind-variants ^3.3.1, uniwind ^1.11.0
grep -nE '"(heroui-native|tailwind-variants|tailwind-merge|uniwind)"' package.json
# A11 Tokens de tamaño ya existen            -> 7 líneas: 2xs 10px, 13 13px, 15 15px, 17 17px, 22 22px, 26 26px, 11 11px
grep -nE '^\s*--text-(11|13|15|17|22|26|2xs):' src/theme/global.css
```

Medidas por AST (no reproducibles con grep; las re-mide el `it` 2 de R1 como
piso): 244 elementos JSX de HeroUI en 28 ficheros de producción; 42 elementos del
`Card` local (`src/components/card.tsx`); 198 con `className` (195 cadena
literal, 2 plantilla, 1 binaria con `+`); 0 con el `className` repartido en
varias líneas; 1 con spread (`src/components/password-input.tsx`,
`InputGroup.Input`); 17 con un token `text-<n>` (los de A4).

Totales de `it` por fichero a la base (`bunx jest <fichero>`, un fichero a la
vez, línea `Tests:`): `src/__tests__/account-screens-polish.test.ts` 13;
`src/screens/login/index.test.tsx` 40; `src/screens/register/index.test.tsx` 65;
`src/screens/forgot/index.test.tsx` 49; `src/screens/reset-password/index.test.tsx`
49. Ningún test de las cuatro pantallas ni de ningún guard compartido menciona
`label__text` ni `button__label` (medido): el cambio no rompe ninguno salvo
#172 R6.

## Causa (medida con `heroui-native` 1.0.8, `tailwind-variants` 3.3.1)

`tailwind-merge` toma `text-13`, `text-15` y `text-17` por **color** (su regla de
color acepta cualquier valor) y los descarta si detrás va otra clase de color.
Render real con `HeroUINativeProvider`:

| Elemento | `className` que pasa la pantalla | `className` que llega al nodo de texto |
|---|---|---|
| `Button.Label` primario | `text-17 font-extrabold text-accent-foreground` | `button__label button__label--variant-primary button__label--size-md font-extrabold text-accent-foreground` (sin `text-17`; `--size-md` es 16 px) |
| `Button.Label` secundario | `text-17 font-extrabold text-foreground` | `button__label button__label--variant-secondary button__label--size-md font-extrabold text-foreground` |
| `Label.Text` en campo inválido | `text-13 font-semibold text-muted` | `label__text label__text--is-invalid font-semibold text-muted` (sin `text-13`; `label__text` es 16 px). El estado válido **no está medido**: debería omitir el segundo token |
| `Text` de `react-native` (CTA) | `text-17 font-extrabold text-accent-foreground` | igual, intacto |
| `Text` de `react-native` dentro de `Label` | `text-13 font-semibold text-muted` | igual, intacto, sin `label__text--is-invalid` |

`cn('text-13 text-muted')` de `heroui-native/utils` da `text-muted`;
`cn('text-17 font-extrabold text-accent-foreground')` da `font-extrabold
text-accent-foreground`. Sobreviven: `text-xs`, `text-2xs`, `text-2xl` (escala de
tallas de Tailwind), `text-[17px]` y `text-17 font-extrabold` si no hay color
detrás. Ningún otro componente de `heroui-native` de la app recibe `text-<n>`; los
`text-13/15/17` restantes de la app están en `Text` y `Animated.Text` planos y
funcionan.

## Alcance medido

17 sitios, todos con `className` de cadena literal en una sola línea:

| Pantalla | `Label.Text` (13 px) | `Button.Label` (17 px) | `testID` del botón |
|---|---|---|---|
| `src/screens/login/index.tsx` | 2: `login.email`, `login.password` | 1 primario | `login-submit` |
| `src/screens/register/index.tsx` | 7: firstName, lastName, email, phone, country, password, confirmPassword | 1 primario | `register-submit` |
| `src/screens/forgot/index.tsx` | 1: `forgot.email` | 2: primario y secundario (`variant="secondary"`) | `forgot-submit`, `forgot-resend` |
| `src/screens/reset-password/index.tsx` | 2: nueva contraseña y confirmación | 1 primario | `reset-submit` |

Textos en español (los tests renderizan con `<LanguageProvider initial="es">`):

- login: `Correo electrónico`, `Contraseña`; botón `Iniciar sesión`.
- register: `Nombres`, `Apellidos`, `Correo electrónico`, `Teléfono`, `País`,
  `Contraseña`, `Confirmar contraseña`; botón `Crear cuenta`.
- forgot: `Correo electrónico`; botones `Enviar enlace de recuperación` y `Reenviar`.
- reset-password: `Nueva contraseña`, `Confirmar nueva contraseña`; botón
  `Actualizar contraseña`.

Las etiquetas se buscan con `screen.getByText('<texto>')` (coincidencia exacta;
se espera un único nodo por pantalla, **no medido por render**). Los botones se
buscan **siempre acotados por su `testID`** con
`within(screen.getByTestId('<testID>')).getByText('<texto>')`, porque
`Iniciar sesión` y `Crear cuenta` aparecen también como título de su pantalla.
Un error de consulta (`Unable to find` o `Found multiple elements`) **no es un
rojo válido**: significa que la consulta está mal y se para y se avisa.

## Decisiones abiertas para el humano

Esta spec está escrita sobre la opción recomendada de D1 (a). Quien aprueba elige
D1, D2 y D3 en § Aprobación. Si elige otra, el leader reabre la spec **solo en
lo que cambia**.

### D1. Cómo se llega a 13 px y 17 px

| Opción | Qué es | Consecuencia medida |
|---|---|---|
| **(a) Hijo `Text` plano** (recomendada) | En los 17 sitios, `Label.Text` y `Button.Label` pasan a `Text` de `react-native` con la misma receta. `Label` y `Button` renderizan el hijo no-string tal cual | Verificado por render: el nodo pinta la receta sin prefijo. Toca solo las 4 pantallas y no parchea la librería. **Pierde** `label__text--is-invalid` (color de etiqueta en error) y la fuente base de HeroUI, que `font-semibold`/`font-extrabold` sustituyen. La clase de error probablemente ya perdía contra `text-muted` por orden de capas CSS, pero **no es verificable en jest**: lo observa el smoke R6 |
| (b) Registrar 13/15/17 en la config de merge | Dar a `tailwind-merge` un grupo `font-size` con `text-13/15/17` (idealmente los seis: 11, 13, 15, 17, 22, 26) para que no los tome por color | Medido en 6 escenarios sobre `Button.Label` y `Label.Text`: **solo funciona** mutando `require('heroui-native/utils').twMergeConfig.classGroups['font-size']` **antes** de evaluar `require('heroui-native')`. Fallan: registrar en `defaultConfig.twMergeConfig` (antes o después de importar HeroUI: HeroUI pasa su propia config y la pisa) y mutar el `twMergeConfig` exportado después de importar el barril. Es frágil: `package.json` `main` es `expo-router/entry`, haría falta un entry propio que registre antes de nada, y el setup de jest ocultaría un fallo de orden en producción. Muta un objeto de una librería fijada a 1.0.8 |
| (c) Quitar la clase de color | `Label.Text className="text-13 font-semibold"` | Descartada: pierde el `text-muted` del artboard |
| (d) `text-[13px]` o `style={{ fontSize }}` | Valor arbitrario | Descartada: la carta (`docs/ui-guidelines.md`, Decisiones fijas) prohíbe clases arbitrarias entre corchetes y exige tokens |

**Recomendación: (a).** Es lo único probable tal y como corre en producción, es
contenida (17 sitios) y la pérdida de la clase de error es observable en el
smoke. (b) solo compensaría si #177 quiere conservar `Button.Label` en la receta
global (≈106 usos de `Button.Label`/`Label.Text` en la app, medido por grep);
eso se decide **dentro de #177**, no aquí.

Si el humano elige (b): R2 y R3 se sustituyen por «el nodo de `Label.Text` y de
`Button.Label` no pierde `text-13`/`text-17`», con un entry propio, el registro
de los seis tamaños y un test que renderiza `Button.Label` y `Label.Text` reales;
R1 se mantiene (sigue siendo cierto para `Card`).

### D2. Orden con #177 (receta global de botón)

| Opción | Consecuencia |
|---|---|
| **(a) #187 antes, estrecha** (recomendada) | #187 deja los 5 `Button.Label` como `Text` con receta `text-17 font-extrabold`. #177 (pending, sin spec, `files_affected` nulo) hereda el `Text` y el candado R1 le impide reintroducir `Button.Label className="text-17 …"` |
| (b) #177 antes | #177 reescribiría esos `className` conservando `text-17 font-extrabold`, que seguiría inerte (el mismo fallo pintado dos veces); después #187 tocaría las mismas cinco líneas |
| (c) Fundir #187 en #177 | #177 no tiene spec ni alcance cerrado; ampliar su gate retrasa el arreglo de 17 sitios ya medidos |

Solape por **contenido** (no por línea): #187 toca las 17 aperturas y 17 cierres
de `Label.Text`/`Button.Label`, tres literales de `textRecipes` en
`account-screens-polish.test.ts`, las cuatro `index.test.tsx` de las pantallas y
el final de `docs/ui-guidelines.md`. #177 tocará los `className` de `Button` y de
`Button.Label` de esos mismos cinco botones (solape alto) y los literales
`'<Button.Label className="text-17 font-extrabold text-accent-foreground">'` y
`'<Button.Label className="text-17 font-extrabold text-foreground">'` de
`textRecipes` (solape alto en CTA, bajo en etiquetas). El reparto caduca al
mergear el primero: el segundo mergea main y reaplica sus literales.

### D3. Orden con #186 (validación de formularios global)

#186 (pending) toca `FieldError`/`FormError`, que en las cuatro pantallas viven
**después** del `Input`, no en la línea del `Label.Text`. El solape con #187 es
de ficheros (las mismas `index.tsx` y `index.test.tsx`), no de contenido, salvo
que ambas toquen líneas adyacentes. **Recomendación: #187 primero** (más
pequeña, sin dependencias; #186 hereda cuatro pantallas ya limpias). Cualquier
orden es válido; el segundo mergea main (nunca rebasa).

## Requisitos

Notación EARS. Cada requisito nombra el fichero y el título exacto del `it` que
lo prueba y los símbolos exactos. Los nodos medidos son `Text` plano de
`react-native` (sin prefijo BEM), así que en R2 y R3 la igualdad exacta
(`toBe`) es correcta. Un test que lea el `className` de un nodo de **HeroUI**
(no es el caso aquí) usaría `startsWith('<prefijo BEM> ')` y
`endsWith(' <literal>')`, nunca el literal entero.

### R1. Ningún componente que fusiona `className` recibe `text-<n>`

WHEN `src/**/*.tsx` de producción se recorre por AST, THE SYSTEM SHALL NOT
contener un token de clase `text-<n>` en el `className` de ningún elemento JSX
cuya etiqueta raíz sea un import de `heroui-native` (nombrado, con alias o por
espacio de nombres, con o sin acceso por miembros como `Button.Label`) o el
`Card` local importado de `components/card`, sea cual sea la forma del
`className`: cadena en una o varias líneas, plantilla sin o con sustituciones,
ternario, operadores lógicos, llamada tipo `cn(...)`, array u objeto con claves
de cadena.

Definiciones exactas del escáner:

- **Recorrido**: todos los `.tsx` bajo `src/`, descubiertos por directorio
  (`readdirSync` recursivo), excluyendo rutas con `/__tests__/` o `/__mocks__/` y
  ficheros `*.test.tsx`. Se parsea con `ts.createSourceFile(..., ts.ScriptKind.TSX)`.
- **Componente que fusiona**: etiqueta JSX cuyo identificador raíz (el primero de
  `A.B.C`) es: (i) un binding importado de `'heroui-native'` — `import { X }`,
  `import { X as Y }` (cuenta `Y`), `import * as H` (cuenta `H`); o (ii) el
  binding local importado de un especificador que termina en `components/card` o
  es `./card`. No se consideran `Text`, `View`, `Animated.Text` ni nada de
  `react-native` o `react-native-reanimated`.
- **Fragmentos**: el texto de cada literal de cadena y de plantilla (cabeza y
  trozos tras cada `${}`), y recursivamente ambas ramas de un ternario, ambos
  lados de `+`, `&&`, `||` y `??`, cada argumento de una llamada, cada elemento de
  un array, las claves de cadena de un objeto y el interior de paréntesis y `as`.
- **Token ofensor**: pieza de un fragmento, partida por `/\s+/`, que casa con
  `^(?:[a-z0-9-]+:)*!?text-\d+(?:\.\d+)?$`. `text-xs`, `text-2xs`, `text-2xl`,
  `text-base` y `text-muted` no casan.
- **Opaco**: `className` cuyo valor es un identificador o un acceso a propiedad
  (no analizable), o un spread `{...x}` sobre el elemento. No es hallazgo, pero
  se inventaría (`it` 4).
- **Hallazgo**: la cadena `"<ruta relativa a src> <Etiqueta> <token>"`, p. ej.
  `screens/login/index.tsx Label.Text text-13`, ordenada por ruta y orden de
  aparición. La etiqueta se escribe tal cual (`Hero.Button.Label`, `HeroUICard`).
- **Agujero declarado**: una clase fabricada en ejecución (`` `text-${n}` ``) no
  se detecta. Se documenta en la carta (R5); no se simula.

Fichero nuevo: `mobile-pet-tracker/src/__tests__/heroui-text-size-merge.test.ts`
(importa `* as ts from 'typescript'`, igual que `ui-language.test.ts`; no se
añade ninguna dependencia). Contiene
`describe('#187 R1: ningún componente que fusiona className lleva text-NN', …)`
con estos 24 `it` (el 25.º es el de R5):

| # | Título del `it` | Qué asevera |
|---|---|---|
| 1 | `#187 R1: el árbol de producción no pasa text-NN a HeroUI ni a Card` | la lista de hallazgos del árbol real es `[]` |
| 2 | `#187 R1: el escáner cubre al menos el universo medido` | pisos, no igualdades: elementos HeroUI `>= 244`, ficheros con algún elemento HeroUI `>= 28`, elementos `Card` local `>= 42`, elementos con `className` `>= 198`. Bajarlos exige decisión humana |
| 3 | `#187 R1: Card es el único componente local que fusiona con tailwind-merge` | los ficheros de `src` (sin tests) con `from 'tailwind-merge'` son exactamente `['components/card.tsx']` |
| 4 | `#187 R1: los className opacos son solo los medidos` | la lista de opacos del árbol real es `['components/password-input.tsx InputGroup.Input']` |
| 5 | `#187 R1: la premisa sigue viva: cn() de heroui-native descarta text-NN ante un color` | con `cn` de `heroui-native/utils` (`jest.requireActual`; si `tsc` no resuelve el tipo del subpath, tipar con una interfaz local `{ cn: (...inputs: string[]) => string }` y `as unknown as`): `cn('text-13 font-semibold text-muted')` es `'font-semibold text-muted'`; `cn('text-17 font-extrabold text-accent-foreground')` es `'font-extrabold text-accent-foreground'`; `cn('text-17 font-extrabold')` es `'text-17 font-extrabold'`. Las cadenas esperadas están escritas a mano; el oráculo es la librería. Si una actualización de HeroUI lo arregla, este `it` se pone rojo y avisa de que la regla puede relajarse |
| 6 a 18 | `#187 R1 sonda %s` (`it.each`, 13 filas P1 a P13; el `%s` es el id) | cada fila pasa su fragmento de código (cadena escrita en el test, con su `import` y su JSX) al mismo escáner y espera el número exacto de hallazgos de la tabla |
| 19 a 24 | `#187 R1 control %s` (`it.each`, 6 filas N1 a N6) | igual, esperando 0 hallazgos |

El escáner debe poder invocarse sobre un fragmento (`ts.createSourceFile` con un
nombre de fichero ficticio) y sobre el árbol real: una función
`scan(fileName: string, text: string)` que devuelve `{ findings: string[];
opaque: string[]; heroElements: number; cardElements: number; classNameElements:
number }`. Es un detalle de diseño del test: no es un símbolo de producción.

Corpus. Cada fila lleva su propio `import`. Las expectativas son literales del
test, **no se derivan del escáner**.

| Id | Código bajo prueba | Hallazgos |
|---|---|---|
| P1 | `import { Button } from 'heroui-native'` y `<Button.Label className="text-17 font-extrabold text-accent-foreground">` | 1 |
| P2 | el mismo elemento con el atributo `className=` en una línea propia (multilínea de atributos) | 1 |
| P3 | una sola cadena con salto de línea dentro: `"font-semibold` / `text-13 text-muted"` (multilínea de valor) | 1 |
| P4 | plantilla sin sustitución: `` className={`text-17 font-extrabold`} `` | 1 |
| P5 | plantilla con sustitución al final: `` className={`text-17 ${tone}`} `` | 1 |
| P6 | plantilla con sustitución al inicio: `` className={`${base} text-13`} `` | 1 |
| P7 | ternario `className={danger ? 'text-13 text-danger' : 'text-13 text-muted'}` | 2 |
| P8 | `className={cn('text-17', big && 'text-22')}` | 2 |
| P9 | alias: `import { Button as HeroButton } from 'heroui-native'` y `<HeroButton.Label className="text-17 font-extrabold">` | 1 |
| P10 | espacio de nombres: `import * as Hero from 'heroui-native'` y `<Hero.Button.Label className="text-17 font-extrabold">` | 1 |
| P11 | `import { Card } from '../../components/card'` y `<Card className="text-13 p-4">` | 1 |
| P12 | prefijo de variante: `<Label.Text className="dark:text-13 text-muted">` | 1 |
| P13 | decimal: `<Label.Text className="text-13.5 text-muted">` | 1 |
| N1 | `import { Text } from 'react-native'` y `<Text className="text-17 font-extrabold text-accent-foreground">` | 0 |
| N2 | `<Button.Label className="text-xs font-extrabold text-accent-foreground">` | 0 |
| N3 | `<Label.Text className="text-2xs text-muted">` y `<Label.Text className="text-2xl text-muted">` | 0 |
| N4 | `<Button.Label className="font-extrabold">` | 0 |
| N5 | `import Animated from 'react-native-reanimated'` y `<Animated.Text className="text-13 font-semibold text-muted">` | 0 |
| N6 | `import { Text as RNText } from 'react-native'` y `<RNText className="text-13 text-muted">` | 0 |

**Rojo esperado de R1** (commit de test T1): falla **solo el `it` 1**, con
`Received` igual a los 17 hallazgos. Los otros 23 `it` **nacen verdes** porque
validan el escáner, no el árbol; se declara así y se prueba con la tabla de
sondas, no con un rojo.

#### Tabla de sondas de R1 (mutación, `it` que cae, consulta que falla)

Cada mutación se aplica sin commitear, se corre
`bunx jest src/__tests__/heroui-text-size-merge.test.ts` y se revierte con
`git checkout HEAD -- <ruta>`; después `git diff --quiet -- <ruta>` y
`git diff --cached --quiet -- <ruta>` deben dar 0 (un checkout parcial conserva
el rojo en el índice). Las sondas S1 a S6 se corren en el último commit de código
(c5); las S7 a S17, sobre el escáner, tras c1.

| Id | Mutación | `it` que cae | Consulta que falla |
|---|---|---|---|
| S1 | en `login/index.tsx`, volver una etiqueta a `<Label.Text className="text-13 font-semibold text-muted">` | `it` 1; el `it` de esa etiqueta en R2; y el `it.each` de #172 R6 de login | `expect(findings).toEqual([])`: `Received` contiene `screens/login/index.tsx Label.Text text-13` |
| S2 **zona ciega: multilínea** | en `forgot/index.tsx`, el reenvío pasa a tres líneas: `<Button.Label` / `className="text-17 font-extrabold text-foreground"` / `>` | `it` 1 | `Received` contiene `screens/forgot/index.tsx Button.Label text-17`. El `grep -cF` de una línea da 0 sobre esa mutación: **solo el AST la ve** |
| S3 **zona ciega: plantilla y alias** | en `home/index.tsx`, a un `<HeroUICard …>` (importado como `Card as HeroUICard`) darle `` className={`p-4 text-13 ${x}`} `` | `it` 1 | `Received` contiene `screens/home/index.tsx HeroUICard text-13` |
| S4 **zona ciega: fichero nuevo** | crear `src/components/zz-sonda.tsx` con `import { Button } from 'heroui-native'` y `<Button.Label className="text-15 text-muted">` | `it` 1 | `Received` contiene `components/zz-sonda.tsx Button.Label text-15`. Prueba que el recorrido descubre por directorio y no por lista. Borrar el fichero al terminar |
| S5 | `<Card className="text-13 text-muted p-4">` del `Card` local en cualquier pantalla | `it` 1 | `Received` contiene la ruta y `Card text-13` |
| S6 control | en un `*.test.tsx`, añadir `<Button.Label className="text-17 font-extrabold">` | ninguno | `it` 1 sigue verde. Si cae, el escáner no excluye tests |
| S7 | escáner: ignorar plantillas | P4, P5, P6 | `expected 1, received 0` |
| S8 | escáner: partir por `' '` en vez de `/\s+/` | P3 | `expected 1, received 0` |
| S9 | escáner: comparar el nombre importado en vez del local | P9 | `expected 1, received 0` |
| S10 | escáner: ignorar el espacio de nombres | P10 | `expected 1, received 0` |
| S11 | escáner: exigir `^text-\d+$` sin prefijo ni decimal | P12 y P13 | `expected 1, received 0` |
| S12 | escáner: no mirar ternarios ni argumentos de llamada | P7 y P8 | `expected 2, received 0` |
| S13 | escáner: dejar de tratar `Card` local | P11 y `it` 2 | `expected 1, received 0`; y el piso `>= 42` |
| S14 | escáner: recorrer solo `src/screens` | `it` 2 | el piso de ficheros con elementos HeroUI (`>= 28`) |
| S15 | escáner: ofender cualquier `text-<palabra>` | N2 y N3 | `expected 0, received 1`; y `it` 1 con falsos positivos |
| S16 | premisa: invertir una cadena esperada | `it` 5 | `expect(received).toBe(expected)` |
| S17 | en una pantalla, `className={tone}` (identificador) en un `Button` | `it` 4 | la lista de opacos deja de ser la medida |

**Ancla negativa de R1**, medida contra su mutación (no se afloja a prefijo): tras
c5, A4 da `0`; aplicando S1 da `1`. Ese `grep` **solo cubre el caso de una
línea**: S2 deja A4 en `0`, y es el `it` 1 el que la caza. La cadena de commits
mide los hallazgos como `17 → 5 → 0` (c1, c3, c5).

### R2. Las doce etiquetas de campo pintan 13 px

WHEN `login`, `register`, `forgot` o `reset-password` pintan la etiqueta de un
campo, THE SYSTEM SHALL pintarla con un `Text` de `react-native`, hijo de
`Label`, cuyo `className` es exactamente `text-13 font-semibold text-muted`, y
SHALL NOT usar `Label.Text` en esas cuatro pantallas.

Cambios de código (doce): en cada ocurrencia de A1,
`<Label.Text className="text-13 font-semibold text-muted">` pasa a
`<Text className="text-13 font-semibold text-muted">` y su `</Label.Text>` a
`</Text>`. `<Label>` y todo lo demás quedan igual.

Tests: doce filas en cuatro `it.each` (una fila = un test), una por etiqueta, en
`src/screens/<pantalla>/index.test.tsx`. Cada fila renderiza la pantalla con el
mismo helper y los mismos `jest.mock` que ya usa esa suite (copiar el primer
`it` existente de la suite que lee `getByText(…).props.className`), hace
`screen.getByText('<texto es>')` y
`expect(nodo.props.className).toBe('text-13 font-semibold text-muted')`.

| Fichero | Plantilla del título (`%s` = texto de la etiqueta) | Filas |
|---|---|---|
| `src/screens/login/index.test.tsx` | `#187 R2: la etiqueta "%s" de login pinta 13 px` | `Correo electrónico`, `Contraseña` |
| `src/screens/register/index.test.tsx` | `#187 R2: la etiqueta "%s" del registro pinta 13 px` | `Nombres`, `Apellidos`, `Correo electrónico`, `Teléfono`, `País`, `Contraseña`, `Confirmar contraseña` |
| `src/screens/forgot/index.test.tsx` | `#187 R2: la etiqueta "%s" de forgot pinta 13 px` | `Correo electrónico` |
| `src/screens/reset-password/index.test.tsx` | `#187 R2: la etiqueta "%s" de reset-password pinta 13 px` | `Nueva contraseña`, `Confirmar nueva contraseña` |

**Rojo esperado**: cada fila falla en `toBe` con `Received` que **empieza por
`label__text`** (medido en inválido: `label__text label__text--is-invalid
font-semibold text-muted`; en válido, sin el segundo token, no medido). Un
error `Unable to find` o `Found multiple elements` es rojo mal formado.

Sonda: volver una sola etiqueta de register a `Label.Text` hace caer solo su
fila de R2 (y el `it` 1 de R1, y la fila de #172 R6 de register); las otras seis
filas siguen verdes.

Además se enmienda el literal 3 de `textRecipes` (§ Enmienda a #172 R6).

### R3. Los cinco botones de cuenta pintan 17 px

WHEN `login-submit`, `register-submit`, `forgot-submit`, `forgot-resend` o
`reset-submit` se pintan, THE SYSTEM SHALL pintar su etiqueta con un `Text` de
`react-native`, hijo directo del `Button`, con `className` exacto
`text-17 font-extrabold text-accent-foreground` en los cuatro primarios y
`text-17 font-extrabold text-foreground` en `forgot-resend`
(`variant="secondary"`), y SHALL NOT usar `Button.Label` en esas cuatro
pantallas.

Cambios de código (cinco): `<Button.Label className="…">` pasa a
`<Text className="…">` con la misma receta y su `</Button.Label>` a `</Text>`.
`Button` conserva `testID`, `variant`, `isDisabled` y `className`.

Tests (cinco `it`, uno por botón, en `src/screens/<pantalla>/index.test.tsx`):
`within(screen.getByTestId('<testID>')).getByText('<texto es>')` y
`toBe(<receta>)`. Mismo patrón que `within(save).getByText('Guardar')` de
`src/screens/geofence-editor/index.test.tsx`.

| Fichero | Título del `it` | testID, texto, receta |
|---|---|---|
| login | `#187 R3: el botón login-submit pinta su etiqueta a 17 px` | `login-submit`, `Iniciar sesión`, primaria |
| register | `#187 R3: el botón register-submit pinta su etiqueta a 17 px` | `register-submit`, `Crear cuenta`, primaria |
| forgot | `#187 R3: el botón forgot-submit pinta su etiqueta a 17 px` | `forgot-submit`, `Enviar enlace de recuperación`, primaria |
| forgot | `#187 R3: el botón forgot-resend pinta su etiqueta a 17 px` | `forgot-resend`, `Reenviar`, secundaria (`text-foreground`) |
| reset-password | `#187 R3: el botón reset-submit pinta su etiqueta a 17 px` | `reset-submit`, `Actualizar contraseña`, primaria |

**Rojo esperado**: `Received` que **empieza por `button__label `** y contiene
`button__label--size-md` (medido: primario
`button__label button__label--variant-primary button__label--size-md
font-extrabold text-accent-foreground`; secundario con
`button__label--variant-secondary` y `text-foreground`). Se enmiendan además los
literales 10 y 11 de `textRecipes`.

### R4. Invariantes: lo que no se toca

IF R2 y R3 están aplicados, THEN THE SYSTEM SHALL conservar sin cambio:

- el inventario de `text-13` de `src/__tests__/profile-canvas-fidelity.test.ts`
  (`it` `limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8)`) y el
  de `text-17` de `src/__tests__/design-drift.test.ts` (`it` `limita text-22 a
  Horario y text-17 al inventario de E1.2`): listan ficheros, y los cuatro
  ficheros siguen conteniendo `text-13` y `text-17`; ambos `it` siguen verdes
  **sin editar esos ficheros**;
- `src/theme/global.css`, `package.json` y el lockfile de bun, byte a byte (los
  siete tokens de A11 ya existen; no se crea ninguno ni se añade dependencia);
- todos los `it` existentes de las cuatro suites y de
  `account-screens-polish.test.ts`: ninguno se borra ni se renombra;
- `LinkButton.Label` (#172 R7) y toda otra pantalla.

Verificación: los dos `it` con nombre verdes en cada commit de la cadena;
`git diff --quiet H0 -- src/theme/global.css package.json` sale 0 (desde
`mobile-pet-tracker/`, con `bun.lock` incluido si existe); y
`git diff --name-only H0..HEAD` es exactamente la lista cerrada de § Cierre de
`tasks.md`, descontando commits del leader.

### R5. La carta recoge la regla

WHEN `docs/ui-guidelines.md` se lee, THE SYSTEM SHALL contener al final del
fichero una sección `## Enmienda #187 — Tamaños de letra sobre componentes de
HeroUI` con el texto de abajo, que fija: (1) un `text-<n>` de la escala propia no
se pasa a un componente de `heroui-native` ni a `Card`; (2) el texto con ese
tamaño se pinta con `Text` de `react-native` como hijo, con las dos recetas de R2
y R3; (3) las tallas de Tailwind no se ven afectadas; (4) el agujero de la clase
fabricada en ejecución; (5) la ruta del candado.

Test: `it('#187 R5: la carta fija la regla y la receta con Text plano', …)`
dentro de `describe('#187 R5: la carta prohíbe text-NN sobre HeroUI', …)` en el
mismo `heroui-text-size-merge.test.ts`. Lee
`join(process.cwd(), '..', 'docs', 'ui-guidelines.md')` (mismo patrón que
`consistency-classnames.test.ts`) y hace `toContain` de estas cinco cadenas
exactas (sin comillas invertidas, para no depender del escape):

1. `## Enmienda #187 — Tamaños de letra sobre componentes de HeroUI`
2. `no se pasa nunca a un componente de`
3. `<Label><Text className="text-13 font-semibold text-muted">`
4. `<Button><Text className="text-17 font-extrabold text-accent-foreground">`
5. `src/__tests__/heroui-text-size-merge.test.ts`

**Rojo**: antes de editar la carta, `toContain` falla en la cadena 1.

Texto exacto que se añade al final de `docs/ui-guidelines.md` (después de
`## Enmienda #174`, dejando una línea en blanco antes):

```
## Enmienda #187 — Tamaños de letra sobre componentes de HeroUI

1. **Un `text-<n>` de la escala propia (`text-11`, `text-13`, `text-15`, `text-17`, `text-22`, `text-26`) no se pasa nunca a un componente de `heroui-native` ni a `Card`.** `tailwind-merge` toma esas clases por color y las descarta si detrás va otra clase de color (`text-muted`, `text-accent-foreground`...), así que el texto cae a `text-base` (16 px) sin avisar. Medido con `heroui-native` 1.0.8.
2. **El texto con uno de esos tamaños se pinta con `Text` de `react-native`, como hijo del componente:** `<Label><Text className="text-13 font-semibold text-muted">...</Text></Label>` y `<Button><Text className="text-17 font-extrabold text-accent-foreground">...</Text></Button>`.
3. Las tallas de Tailwind (`text-xs`, `text-sm`, `text-2xs`...) no se ven afectadas y siguen valiendo sobre `Label.Text` y `Button.Label`.
4. El candado no ve una clase fabricada en ejecución (`text-${n}`): no se construyen tamaños así.
5. El candado es `src/__tests__/heroui-text-size-merge.test.ts` (#187 R1).
```

Guards de la carta, medidos para este texto y para las recetas: la carta no
prohíbe ninguna clase de R2/R3 (`text-13`, `text-17`, `font-semibold`,
`font-extrabold`, `text-muted`, `text-accent-foreground`, `text-foreground`);
`text-accent` suelto lo prohíbe #61 R4 y aquí no aparece (`text-accent-foreground`
no es `text-accent`). Ningún guard de `design-drift`, `legibility-classnames`,
`consistency-classnames`, `ui-language` ni `ui-copy-table.ts` menciona
`Label.Text` ni `Button.Label` de estas cuatro pantallas: solo
`account-screens-polish.test.ts` (#172 R6) las cuenta. Las filas de
`ui-copy-table.ts` son pares fichero y clave de `t()` y no dependen de la
etiqueta JSX. Comentarios de código: en esta feature solo se escribe `#187 R<n>`
(el guard de hex solo exime `#NNN R<n>`; `// #187 E1` o una nota copiada de la
spec se lee como hex y rompe `design-drift`).

### R6. Smoke humano en dev build de Android

WHEN el humano abre en un dev build de Android (nunca Expo Go) las cuatro
pantallas con el código de R2 y R3, THE SYSTEM SHALL mostrar las etiquetas de
campo a 13 px y los botones a 17 px con la fuente extra negrita, como el
artboard, sin cambio de color ni de posición respecto al canvas.

Pasos que firma el humano (no se automatiza; jest no mide píxeles):

1. Login: etiquetas `Correo electrónico` y `Contraseña` a 13 px, semibold, color
   `muted`; botón `Iniciar sesión` a 17 px, extrabold, texto claro sobre el
   acento. Comparar con el artboard de Login del canvas aprobado.
2. Registro: las siete etiquetas a 13 px y el botón `Crear cuenta` a 17 px.
3. Recuperar: etiqueta a 13 px; `Enviar enlace de recuperación` a 17 px sobre el
   acento; `Reenviar` a 17 px extrabold con color de texto normal.
4. Nueva contraseña: dos etiquetas a 13 px y el botón a 17 px.
5. **Campo en error** (enviar el formulario vacío en login o registro): anotar el
   color de la etiqueta. D1 (a) la deja en `muted` también en error; si el humano
   la quiere roja, es otra feature, no un fallo de ésta.

Casilla propia: § Aprobación, «Smoke R6». No la marca ningún agente.

## Enmienda a #172 R6

`src/__tests__/account-screens-polish.test.ts`,
`describe('#172 R6: recetas de texto de cuenta')`: constante `textRecipes` (15
literales, índices 0 a 14) e `it.each` de cuatro filas (`login`, `register`,
`forgot`, `reset-password`, título `'#172 R6: %s pinta títulos, etiquetas, cuerpos
y CTA con su receta'`) que cuenta `source.split(literal).length - 1` contra
`counts[index]`.

**Se sustituyen tres literales en su sitio; los cuatro vectores de cuentas no
cambian de valor ni de longitud.** Es una enmienda explícita a #172 R6.

| Índice | Literal en la base | Literal enmendado | Cuentas (login, register, forgot, reset-password) |
|---|---|---|---|
| 3 | `'<Label.Text className="text-13 font-semibold text-muted">'` | `'<Text className="text-13 font-semibold text-muted">'` | 2, 7, 1, 2 (sin cambio) |
| 10 | `'<Button.Label className="text-17 font-extrabold text-accent-foreground">'` | `'<Text className="text-17 font-extrabold text-accent-foreground">'` | 1, 1, 1, 1 (sin cambio) |
| 11 | `'<Button.Label className="text-17 font-extrabold text-foreground">'` | `'<Text className="text-17 font-extrabold text-foreground">'` | 0, 0, 1, 0 (sin cambio) |

No cambian: el índice 4 (`'<Label>'`: 2, 7, 1, 2), el 5 (`'<Label className='`: 0 en
todas) porque `Label` se conserva, el resto de índices, #172 R7
(`LinkButton.Label`) y el resto de `it` del fichero. El total del fichero sigue en
13.

Con A6 en 0, cada literal enmendado **nace en rojo** en las cuatro filas: el 3 en
el commit de test de R2 y los 10 y 11 en el de R3 (cada fila contiene el literal
nuevo con cuenta ≥ 1 y la base lo tiene en 0). Comentario obligatorio junto a la
fila enmendada: `// #187 R2` en el 3 y `// #187 R3` en los 10 y 11.

## Fuera de alcance

Clasificado viñeta a viñeta; cada premisa está verificada.

- **Delimitación (sale de esta feature, no necesita otra):** `LinkButton.Label`
  (`text-sm`/`text-base`, tallas de Tailwind que no se expulsan; #172 R7 las
  cubre); los `Text` y `Animated.Text` planos con `text-13/15/17` que ya
  funcionan (A4 no los cuenta); cualquier otra pantalla.
- **Otra feature registrada:** la receta global de botón (altura, radio, etiqueta
  17/800, sombra) es #177; esta spec no cambia `className` de `Button`.
- **Otra feature registrada:** el componente global de error de campo es #186.
- **Decisión de producto, no se decide aquí:** que la etiqueta se ponga roja en
  error (D1 (a) la deja en `muted`; R6 paso 5).
- **Deuda que esta spec no cierra:** las clases fabricadas en ejecución (R1,
  agujero declarado).

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
- D1 elegida (a o b): ____
- D2 elegida (a, b o c): ____
- D3 elegida (orden respecto a #186): ____

Cualquier test o comando que lea esta casilla usa el patrón tolerante
`^- \[[ xX]\] Aprobado por humano`: con la casilla marcada o sin marcar da `1`.

## Gate humano de cierre

- [ ] Smoke R6 en dev build de Android hecho por el humano (fecha: ____)
