---
feature: "mobile-chunky-cta"
---

# Diseño — [[mobile-chunky-cta]] (#166)

> Ver [[requirements]] (premisas M1 a M4 y decisiones por variante) y
> [[tasks]]. Rutas relativas a `mobile-pet-tracker/` salvo que digan otra
> cosa.

**Skills de nuestro catálogo** (carta, §Skills): `expo-overview` como
entrada, `expo-design-system` (token nuevo, recetas compartidas) y
`expo-tailwind-setup` (utilidades de uniwind con Tailwind v4). El leader
traduce estos nombres a los del plugin de Codex en el handoff.

**Capas**: la feature es solo de presentación (`className` de JSX, un token
CSS y la carta). No toca domain, application ni infrastructure, ni ningún
hook, servicio o tipo.

## Decisiones técnicas

### D1. El labio es un borde inferior, no una sombra

El canvas dibuja el labio con `box-shadow: 0 4px 0 var(--lip)`. En RN, una
sombra en Android es `elevation`: difusa y sin desplazamiento duro, y la
carta la evita. Un `border-bottom` más grueso reproduce el bloque sólido en
las dos plataformas y es lo que #153 ya validó en Bienvenida con una prueba
de humo. En RN, `borderBottomWidth` gana a `borderWidth`, así que
`border-2 border-b-6` da 2 px a los lados y arriba, y 6 px abajo.

Consecuencia que se acepta: el borde ocupa sitio dentro del alto del botón
que fija heroui. La etiqueta se centra en un hueco 4 px menor (6 px menos 2
px en el secundario). Por eso R5 mira el caso más justo, `profile-add-pet`
con `size="sm"`, y la etiqueta del secundario de Bienvenida.

### D2. El primario conserva la receta de #153

`border-b-4 border-black/25` es negro al 25 % sobre el acento, que oscurece
el verde en los dos temas sin token propio. Es la opción literal del
humano: «el labio del primario de Bienvenida pasa a todos». La receta se
escribe **justo detrás** de `bg-accent`, y no hay otro sitio válido: los
candados `#62 R1` y `#98 R10` cuentan `rounded-xl bg-accent` seguido de
espacio o comilla. Con el labio delante, el primario dejaría de contarse y
los dos candados se pondrían rojos.

La sustitución es mecánica. Los 18 primarios sin labio terminan su
className en `rounded-xl bg-accent"` (M1), y en todos se cambia ese literal
por `rounded-xl bg-accent border-b-4 border-black/25"`. Bienvenida no se
toca.

### D3. El secundario neutro: borde gris de 2 px y labio de 6 px sobre superficie

El canvas dibuja `background: var(--surface); border: 2px solid var(--lip-gray); box-shadow: 0 4px 0 var(--lip-gray)`,
que da 2 px de borde más 4 px de labio, 6 px abajo en total. La receta:

`rounded-xl border-2 border-b-6 border-lip-gray bg-surface`

- `border-b-6`: Tailwind v4 acepta anchos de borde enteros sin corchetes, y
  `design-drift` no lo ve como valor arbitrario.
- `bg-surface` ya es una utilidad en uso (M2, 9 apariciones). Sustituye al
  `bg-transparent` de Bienvenida y al relleno que traiga la variante de
  heroui.
- **La variante se conserva** (`outline` en dos, `secondary` en uno,
  ninguna en Bienvenida). Las clases de variante de heroui son BEM
  (`button__root--variant-outline`) y las utilidades del `className` les
  ganan: el `bg-transparent` de Bienvenida sobre la primaria por defecto es
  el precedente (#153). Quitar la variante cambiaría el color por defecto de
  la etiqueta, y además `docs/index.test.tsx` asevera
  `'button__root--variant-outline'` en `docs-upload-cancel`.
- La receta **sustituye** las clases de borde y fondo del secundario
  (`border border-accent bg-transparent` en Bienvenida) y **se añade**
  detrás de `rounded-xl` en los otros tres, que hoy no llevan ninguna. El
  ancho (`w-full`) se queda delante.

| testID | Fichero | className de hoy | className tras R3 |
|---|---|---|---|
| `welcome-have-account` | `screens/welcome/index.tsx` | `w-full rounded-xl border border-accent bg-transparent` | `w-full rounded-xl border-2 border-b-6 border-lip-gray bg-surface` |
| `forgot-resend` | `screens/forgot/index.tsx` | `w-full rounded-xl` | `w-full rounded-xl border-2 border-b-6 border-lip-gray bg-surface` |
| `docs-upload-cancel` | `screens/docs/index.tsx` | `rounded-xl` | `rounded-xl border-2 border-b-6 border-lip-gray bg-surface` |
| `reminders-delete-cancel` | `screens/reminders/index.tsx` | `w-full rounded-xl` | `w-full rounded-xl border-2 border-b-6 border-lip-gray bg-surface` |

### D4. Un token de color directo, sin semántico de heroui

`--color-lip-gray` se declara como `--color-*` directo, igual que
`--color-tab-pill` y `--color-glass-surface`, sin pareja `--lip-gray` sin
prefijo: ningún componente de heroui lo consume y solo lo usa la clase
`border-lip-gray`. Va en la línea siguiente a `--color-tab-pill:` de cada
tema:

| Tema | Línea ancla (`grep -cF` → 1 por tema) | Línea nueva |
|---|---|---|
| light | `      --color-tab-pill: rgba(23,130,85,0.14);` | `      --color-lip-gray: #E4E7EC;` |
| dark | `      --color-tab-pill: rgba(23,130,85,0.22);` | `      --color-lip-gray: #0A0D12;` |

Los hex son los `--lip-gray` del canvas y viven en `src/theme/`, el único
sitio donde la carta los admite.

### D5. Texto exacto del punto 13 de la carta

Va en `docs/ui-guidelines.md`, en §Decisiones fijas, justo detrás del
párrafo que cierra el punto 12 (la línea `    para añadírselo.`, con
`grep -cF` → 1) y antes de `## Animación (decisiones por defecto)`, con una
línea en blanco antes y otra después:

```markdown
13. **Botón con cuerpo** (feature #166, 2026-10-11). Los botones de acción
    llevan un labio inferior: un borde inferior más grueso que los
    laterales, nunca una sombra.
    - **Primario sólido** (todo `Button` con `rounded-xl bg-accent`):
      `rounded-xl bg-accent border-b-4 border-black/25`
      El labio va detrás de `bg-accent`, nunca delante: el recuento de
      primarios de `consistency-classnames` busca `rounded-xl bg-accent`
      seguido de espacio o comilla.
    - **Secundario neutro** (`variant="outline"` o `variant="secondary"`
      sin relleno tonal, y el secundario de Bienvenida):
      `rounded-xl border-2 border-b-6 border-lip-gray bg-surface`
      El gris sale del token `--color-lip-gray` de `src/theme/global.css`,
      nunca de un hex ni de una clase entre corchetes.
    - **Sin labio**: los tonales (`bg-accent-soft`, `bg-default`), los
      destructivos (`bg-danger`, `variant="danger-soft"`) y las primarias
      de heroui sin color en `className` (reintentos, confirmar alerta).
    Los inventarios que lo verifican viven en
    `src/__tests__/consistency-classnames.test.ts`.
```

### D6. Candados de conjunto completo, no de muestra

Las cláusulas de R2 y R3 son universales («todo primario», «todo
secundario neutro», «ningún otro»), así que cada una se cierra con un
inventario de toda la producción y no con un caso:

- **R2.1 y R2.2**: un mapa `fichero → recuento` de la receta con labio
  sobre `sourceFiles()`, comparado con `toEqual` contra el mapa de 17
  entradas de M1. En el mismo `it`, el mismo mapa con la regex sin labio
  (`rounded-xl bg-accent(?=[\s'"\`])`). Este segundo mapa es la zona ciega
  de D2: un labio escrito delante de `bg-accent` saca al primario de los
  dos mapas a la vez.
- **R2.3**: recuento global de `border-b-4` (con límite de palabra, para no
  contar `border-b-40`) y de `border-black/25`, igual a 19. Un labio colado
  en un destructivo o en un tonal sube el recuento a 20.
- **R3.1**: `openingTagWithTestId` (helper de #120 que ya está en el
  fichero) sobre cada uno de los cuatro, con la receta, las clases
  prohibidas y la variante.
- **R3.2 y R3.3**: se parte cada fichero `.tsx` de producción por
  `<Button` seguido de espacio o `>`, el tag es el trozo hasta el siguiente
  `<`, y se clasifica por la regla de R3.2. La lista ordenada de testIDs
  debe ser exactamente la de los cuatro. Además, los recuentos globales de
  `border-lip-gray` y de `border-b-6` deben ser 4. La regla mira la
  variante **y** el relleno: si alguien quita el `bg-default` de un toggle,
  aparece un quinto secundario neutro sin labio y el inventario se pone
  rojo.

Las sondas de mutación de [[tasks]] plantan un fallo en cada rama, también
en las zonas ciegas: delante de `bg-accent`, en `components/` en vez de
`screens/`, en una exclusión y en un relleno tonal quitado.

## Tabla de decisión por elemento

Las 58 etiquetas de M3, sin dejar ninguna fuera:

| Familia | Nº | Labio | Requisito que lo cierra |
|---|---|---|---|
| Primario sólido | 19 | `border-b-4 border-black/25` | R2.1, R2.2 |
| Secundario neutro | 4 | `border-2 border-b-6 border-lip-gray` sobre `bg-surface` | R3.1, R3.2 |
| Tonal acento | 4 | no | R2.3, R3.2, R3.3 |
| Tonal neutro | 2 | no | R2.3, R3.2 (por `bg-default`), R3.3 |
| Destructivo sólido | 2 | no | R2.3, R3.3 |
| Destructivo tonal | 5 | no | R2.3, R3.3 |
| Primaria de heroui sin color | 22 | no | R2.3, R3.3 |

## Archivos afectados

Presentación (`mobile-pet-tracker/src/`):

- `theme/global.css`: 2 líneas (D4).
- Primarios, 16 ficheros y 18 tags (D2): `app/(auth)/login.tsx`,
  `app/(auth)/register.tsx`, `components/empty-state.tsx`,
  `screens/add-pet/index.tsx`, `screens/add-reminder/index.tsx`,
  `screens/docs/index.tsx` (×2), `screens/forgot/index.tsx`,
  `screens/geofence-editor/index.tsx`, `screens/geofences/index.tsx`,
  `screens/home/index.tsx`, `screens/meal-schedule/index.tsx`,
  `screens/pairing/index.tsx` (×2), `screens/profile/index.tsx`,
  `screens/reminders/index.tsx`, `screens/reset-password/index.tsx`,
  `screens/weight-log/index.tsx`.
- Secundarios (D3): `screens/welcome/index.tsx`, más tres que ya están en la
  lista anterior (`forgot`, `docs`, `reminders`).

Tests:

- Nuevos describes: `src/__tests__/consistency-classnames.test.ts` (R2, R3,
  R4, al final del fichero), `src/theme/__tests__/global-css.test.ts` (R1,
  al final) y `src/screens/welcome/index.test.tsx` (R3).
- Cadenas actualizadas (R2.4): `src/app/(auth)/__tests__/login.test.tsx`,
  `src/app/(auth)/__tests__/register.test.tsx`,
  `src/screens/forgot/index.test.tsx`,
  `src/screens/reset-password/index.test.tsx`,
  `src/screens/geofence-editor/index.test.tsx`,
  `src/screens/geofences/index.test.tsx` y
  `src/components/__tests__/empty-state.test.tsx`.

Carta: `docs/ui-guidelines.md` (D5).

Sin cambios: `package.json`, `bun.lock`, `src/i18n/catalog.ts`,
`src/__tests__/ui-copy-table.ts`, `design-drift.test.ts`,
`legibility-classnames.test.ts`, y los candados `#62 R1` y `#98 R10`.

## Alternativas descartadas

- **Sombra (`shadow-*`, `elevation`) como en el canvas**: en Android no hay
  desplazamiento duro, sale un halo difuso (D1).
- **`border-b-4` también en el secundario**: con `border-2`, el labio
  visible sería de 2 px y no de los 4 px del canvas (D3).
- **Token `--lip` verde para el primario**, como en el canvas: el humano
  eligió extender la receta de #153 tal cual, y `border-black/25` funciona
  en los dos temas sin token.
- **Un componente `ChunkyButton` que envuelva el `Button` de heroui**:
  sería una abstracción nueva con 23 llamadas que migrar. El repo fija
  recetas de clase por rol (#62) y las cierra con inventarios. Si la
  receta crece, que lo proponga otra feature.
- **Quitar la variante a los secundarios**: cambia el color de etiqueta por
  defecto y rompe el candado de `variant-outline` de `docs` (D3).
- **Un requisito aparte para las exclusiones**: nacería verde. Las
  exclusiones quedan cerradas por los recuentos de R2.3 y R3.3, que nacen
  rojos (1 y 0 frente a 19 y 4).
- **Meter las 22 primarias sin color o los destructivos**: ver P1 y P2 de
  [[requirements]].
