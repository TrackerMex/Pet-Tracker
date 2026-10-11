---
feature: "mobile-chunky-cta"
---

# Tareas — [[mobile-chunky-cta]] (#166)

> Ver [[requirements]] y [[design]]. Todos los comandos se lanzan desde
> `mobile-pet-tracker/` (`cd mobile-pet-tracker` literal al empezar cada
> bloque). Herramientas: `bunx` y `bun run`, nunca `npx` ni `npm`. Jest
> siempre con `--runTestsByPath`, que toma la ruta literal: `(auth)` no se
> escapa y se pone entre comillas simples para la shell.
>
> Orden test-primero con commits separados: cada requisito tiene un commit
> `test(mobile): … (Rn)` en rojo y uno `feat(mobile): … (Rn)` (o `docs`) en
> verde. Ningún commit mezcla test e implementación. Un rojo distinto del
> esperado (otro `it`, otro número o un fallo de consulta en vez de
> aserción) **para la cadena**: no se commitea y se reporta.

Variable de producción, igual que en [[requirements]] (sin comillas al usarla):

```bash
PROD="--include=*.ts --include=*.tsx --exclude=*.test.ts --exclude=*.test.tsx --exclude-dir=__tests__"
```

## T0. Base (sin commit)

1. `test ! -e .expo/types/router.d.ts; echo "exit=$?"` → `exit=0`. Si no
   sale 0, no lo borres: pídeselo al humano.
2. Anclas de la base (todas deben dar exactamente esto; si alguna no
   cuadra, para y reporta):

| Ancla | Salida |
|---|---|
| `grep -rhoE "rounded-xl bg-accent([[:space:]]\|\"\|'\|\`)" src $PROD \| wc -l` | `19` |
| `grep -rhoF 'rounded-xl bg-accent"' src $PROD \| wc -l` | `18` |
| `grep -rhoF 'rounded-xl bg-accent border-b-4 border-black/25' src $PROD \| wc -l` | `1` |
| `grep -rhoE 'border-b-[0-9]' src $PROD \| wc -l` | `1` |
| `grep -rhoF 'lip-gray' src \| wc -l` | `0` |
| `grep -cF -- '--color-tab-pill:' src/theme/global.css` | `2` |
| `grep -cF '    para añadírselo.' ../docs/ui-guidelines.md` | `1` |
| `grep -cF '13. **Botón con cuerpo**' ../docs/ui-guidelines.md` | `0` |

   (En la tabla, `\|` es el `|` de la shell, escapado solo para el
   markdown.)
3. Recuento base de la suite: `bunx jest; echo "exit=$?"` → `exit=0`.
   Anota la línea `Tests: N passed, N total`. Es la base de la tabla de
   cuentas de §Cuentas.
4. `bun run typecheck; echo "exit=$?"` y `bunx expo lint --no-cache; echo "exit=$?"`
   → `exit=0` los dos.

## T1. R1: token `--color-lip-gray`

### (1) Test rojo

En `src/theme/__tests__/global-css.test.ts`, al final del fichero, añade:

- describe `'#166 R1: global.css declara el labio gris en los dos temas'`;
- `it.each` con las filas `['light', '#E4E7EC']` y `['dark', '#0A0D12']`,
  nombre `'declara --color-lip-gray exacto en %s'`. Usa los mismos helpers
  que el describe `'R2: tokens glass-surface y tab-pill en light y dark'`
  del mismo fichero (variables del bloque `@variant` del tema, comparadas
  con `toMatchObject({ '--color-lip-gray': valor })`).

`bunx jest --runTestsByPath src/theme/__tests__/global-css.test.ts` →
rojo esperado: **2 failed**, las dos filas del `it.each`, por aserción.

Commit: `test(mobile): falta el token del labio gris (R1)`.

### (2) Implementación mínima

En `src/theme/global.css`, una línea nueva justo debajo de cada ancla
([[design]] D4):

- debajo de `      --color-tab-pill: rgba(23,130,85,0.14);` →
  `      --color-lip-gray: #E4E7EC;`
- debajo de `      --color-tab-pill: rgba(23,130,85,0.22);` →
  `      --color-lip-gray: #0A0D12;`

Ancla: `grep -cF -- '--color-lip-gray:' src/theme/global.css` → `2`. El
mismo jest, en verde.

Commit: `feat(mobile): token --color-lip-gray en los dos temas (R1)`.

### (3) Refactor

Ninguno.

### Sondas de mutación de R1 (sin commit; restaurar con `git checkout HEAD -- src/theme/global.css`)

| Sonda | Rojo esperado |
|---|---|
| S1.1: valor dark cambiado a `#E4E7EC` | 1 failed: `declara --color-lip-gray exacto en dark` |
| S1.2: línea light borrada | 1 failed: `declara --color-lip-gray exacto en light` |

## T2. R2: el labio en los diecinueve primarios

### (1) Test rojo

**T2.0. Nuevo describe** al final de `src/__tests__/consistency-classnames.test.ts`:
`'#166 R2: todo primario sólido lleva el labio detrás de bg-accent'`.

- Constante con el mapa esperado de M1 en [[requirements]]: 17 entradas
  `fichero → recuento`, con las rutas construidas con `join(...)` igual que
  `primaryButtons` de `#62 R1` (por ejemplo `join('app', '(auth)', 'login.tsx')`).
  Valores: 1 en todos salvo `screens/docs/index.tsx` y
  `screens/pairing/index.tsx`, que valen 2.
- `it('inventaría los diecinueve primarios con labio, fichero a fichero')`:
  recorre `sourceFiles()` y cuenta por fichero las coincidencias de
  `/rounded-xl bg-accent border-b-4 border-black\/25(?=[\s'"\`])/g`,
  conservando solo los recuentos mayores que 0, con las claves relativas a
  `src/` (como devuelve `filesMatching`). `toEqual` contra el mapa
  esperado. En el **mismo** `it`, el mismo cálculo con
  `/rounded-xl bg-accent(?=[\s'"\`])/g` y `toEqual` contra el mismo mapa:
  es la zona ciega del labio escrito delante de `bg-accent` ([[design]] D6).
- `it('no deja la receta del labio fuera de un primario')`: suma sobre
  `sourceFiles()` las coincidencias de `/\bborder-b-4\b/g` → `toBe(19)`, y
  las de `/border-black\/25/g` → `toBe(19)`.

**T2.1. Cadenas existentes que cambian** (R2.4). En las seis primeras filas
el literal `rounded-xl bg-accent'` aparece **una sola vez** en el fichero,
dentro del `toBe` del `it` nombrado, y se sustituye por
`rounded-xl bg-accent border-b-4 border-black/25'`. El nombre del `it` no
cambia.

| Fichero | `it` | Ancla antes → después |
|---|---|---|
| `src/app/(auth)/__tests__/login.test.tsx` | `'pinta login-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente'` | `grep -cF "rounded-xl bg-accent'"` → `1` → `0` |
| `src/app/(auth)/__tests__/register.test.tsx` | el que empieza por `'pinta register-submit, deshabilitado al montar, con la clase exacta` | igual, `1` → `0` |
| `src/screens/forgot/index.test.tsx` | el que empieza por `'pinta forgot-submit, deshabilitado, con la clase exacta` | igual, `1` → `0` |
| `src/screens/reset-password/index.test.tsx` | el que empieza por `'pinta reset-submit con la clase exacta` | igual, `1` → `0` |
| `src/screens/geofence-editor/index.test.tsx` | `'pinta Guardar con la receta primaria tras la nota de reinicio'` | igual, `1` → `0` |
| `src/screens/geofences/index.test.tsx` | `'pinta Añadir zona con la receta primaria antes del error de acción'` | igual, `1` → `0` |

En los seis, `grep -cF "rounded-xl bg-accent border-b-4 border-black/25'"`
pasa de `0` a `1`.

`src/components/__tests__/empty-state.test.tsx`:

- Antes: `grep -cF 'rounded-xl bg-accent"'` → `2`.
- Los dos literales `className="rounded-xl bg-accent"` (uno en cada `it`
  de abajo) pasan a `className="rounded-xl bg-accent border-b-4 border-black/25"`.
- `it('declara el botón primario sin labio')` se renombra
  `it('declara el botón primario con labio')` y **se borra** su línea
  `expect(source).not.toMatch(/border-b-4/);`. Esta es la reversión del
  candado ([[requirements]] M4).
- `it('declara el botón sin size ni variant')` conserva el nombre. Solo
  cambia el className dentro de su cadena de tag.
- Después: `grep -cF 'border-b-4 border-black/25"'` → `2`,
  `grep -cF 'not.toMatch(/border-b-4/)'` → `0` y
  `grep -cF "it('declara el botón primario sin labio'"` → `0`.

Comando:

```bash
bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts 'src/app/(auth)/__tests__/login.test.tsx' 'src/app/(auth)/__tests__/register.test.tsx' src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/geofences/index.test.tsx src/components/__tests__/empty-state.test.tsx
```

Rojo esperado: **10 failed**, todos por aserción. Son los 2 `it` nuevos de
T2.0 y los 8 de T2.1 (seis `toBe` y los dos de `empty-state`). `#62 R1` y
`#98 R10` siguen verdes.

Commit: `test(mobile): todo primario sólido lleva el labio (R2)`.

### (2) Implementación mínima

En producción, sustitución literal en los 16 ficheros de [[design]]
§Archivos afectados: `rounded-xl bg-accent"` →
`rounded-xl bg-accent border-b-4 border-black/25"` (18 apariciones). No se
toca ninguna otra clase ni `welcome/index.tsx`.

| Ancla | Antes | Después |
|---|---|---|
| `grep -rhoF 'rounded-xl bg-accent"' src $PROD \| wc -l` | `18` | `0` |
| `grep -rhoF 'rounded-xl bg-accent border-b-4 border-black/25"' src $PROD \| wc -l` | `1` | `19` |
| `grep -rhoE "rounded-xl bg-accent([[:space:]]\|\"\|'\|\`)" src $PROD \| wc -l` | `19` | `19` |

El mismo jest de (1), en verde.

Commit: `feat(mobile): labio en los diecinueve primarios sólidos (R2)`.

### (3) Refactor

Ninguno.

### Sondas de mutación de R2

Sin commit. Restaurar cada una con `git checkout HEAD -- <fichero>` y
comprobar `git diff --quiet HEAD; echo "exit=$?"` → `exit=0` antes de la
siguiente.

| Sonda | Rojo esperado (todo por aserción) |
|---|---|
| S2.1: quitar ` border-b-4 border-black/25` a `profile-add-pet` en `screens/profile/index.tsx` | `inventaría los diecinueve…` (mapa con labio sin `profile`) y `no deja la receta…` (18) |
| S2.2, zona ciega por orden: en `ready-map` de `screens/pairing/index.tsx`, escribir `rounded-xl border-b-4 border-black/25 bg-accent` | `inventaría los diecinueve…` (los **dos** mapas dan `pairing` = 1), además de `#62 R1` `deja todos los botones primarios sólidos en un único radio` y `#98 R10` (18). `no deja la receta…` sigue verde (19 y 19) |
| S2.3, zona ciega por carpeta: quitar el labio en `components/empty-state.tsx` | `inventaría los diecinueve…`, `no deja la receta…` y los dos `it` de `empty-state.test.tsx` |
| S2.4, exclusión: añadir ` border-b-4 border-black/25` detrás de `bg-danger` en `device-unpair` (`screens/pairing/index.tsx`) | solo `no deja la receta…` (20 y 20). `inventaría…` sigue verde |

## T3. R3: el labio gris en los cuatro secundarios neutros

### (1) Test rojo

**T3.0. Nuevo describe** al final de `src/__tests__/consistency-classnames.test.ts`:
`'#166 R3: el secundario neutro lleva el labio gris'`.

- Constante de receta: `'rounded-xl border-2 border-b-6 border-lip-gray bg-surface'`.
- Filas `[fichero, testID, variante]`:
  - `[join('screens', 'welcome', 'index.tsx'), 'welcome-have-account', null]`
  - `[join('screens', 'forgot', 'index.tsx'), 'forgot-resend', 'secondary']`
  - `[join('screens', 'docs', 'index.tsx'), 'docs-upload-cancel', 'outline']`
  - `[join('screens', 'reminders', 'index.tsx'), 'reminders-delete-cancel', 'outline']`
- `it.each(filas)('%s pinta %s con la receta del secundario en su tag de apertura')`:
  - toma el tag con `openingTagWithTestId(readSource(fichero), testID)`;
  - el tag contiene la receta y no contiene `border-accent`,
    `bg-transparent` ni `border-black`;
  - con variante `null` no contiene `variant=`; en los demás contiene
    `` `variant="${variante}"` ``.
- `it('inventaría los cuatro secundarios neutros de toda la app')`:
  - Por cada `.tsx` de `sourceFiles()`, parte el fuente por
    `/<Button(?=[\s>])/`. En cada trozo salvo el primero, el tag es lo que
    hay antes del siguiente `<`.
  - Un tag es secundario neutro si (contiene `variant="outline"` o
    `variant="secondary"`, y no contiene `bg-accent-soft` ni `bg-default`)
    o si contiene `border-lip-gray`.
  - Extrae su testID con `/testID="([^"]+)"/`. La lista ordenada debe ser
    `toEqual` a `['docs-upload-cancel', 'forgot-resend', 'reminders-delete-cancel', 'welcome-have-account']`.
  - En el mismo `it`, las coincidencias en `sourceFiles()` de
    `/border-lip-gray/g` → `toBe(4)` y de `/\bborder-b-6\b/g` → `toBe(4)`.

**T3.1. `src/screens/welcome/index.test.tsx`**:

- Describe `'R8'`, `it('es un botón hueco con tinta accent-strong')`:
  - Se renombra `it('es un botón de superficie con labio gris y tinta accent-strong')`.
  - Su `toBe('w-full rounded-xl border border-accent bg-transparent')`
    pasa a `toBe('w-full rounded-xl border-2 border-b-6 border-lip-gray bg-surface')`.
  - La aserción de la etiqueta (`'font-semibold text-accent-strong'`) no
    cambia.
  - Anclas: `grep -cF "border border-accent bg-transparent" src/screens/welcome/index.test.tsx`
    → `1` → `0`, y `grep -cF "it('es un botón hueco con tinta accent-strong'"` → `1` → `0`.
- Describe `'#153 R7: el CTA primario tiene cuerpo'`:
  - Se **borra entero** `it('deja el CTA secundario sin labio')`; es la
    reversión decidida por el humano.
  - `it('declara el labio en el CTA primario')` no se toca.
  - Ancla: `grep -cF "it('deja el CTA secundario sin labio'"` → `1` → `0`.
- Nuevo describe al final del fichero,
  `'#166 R3: el CTA secundario lleva el labio gris'`, con
  `it('lleva el labio gris en el CTA secundario', async () => …)`:
  - `await renderWelcome();`, el mismo arranque que el `it` borrado;
  - el className de `screen.getByTestId('welcome-have-account')` contiene
    `border-b-6`, `border-lip-gray` y `bg-surface`;
  - no contiene `border-black`, `border-accent` ni `bg-transparent`.

Comando:

```bash
bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts src/screens/welcome/index.test.tsx src/screens/forgot/index.test.tsx src/screens/docs/index.test.tsx src/screens/reminders/index.test.tsx
```

Rojo esperado: **7 failed**, todos por aserción (el nodo existe):

- las 4 filas del `it.each`;
- `inventaría los cuatro…`: la lista sale sin `welcome-have-account` y los
  recuentos dan 0;
- en welcome, el `it` renombrado de `R8` y el nuevo de `#166 R3`.

Los tests de `forgot`, `docs` y `reminders` siguen verdes.

Commit: `test(mobile): el secundario neutro lleva el labio gris (R3)`.

### (2) Implementación mínima

Cuatro sustituciones ([[design]] D3). Cada ancla da `1` antes y `0`
después:

| Fichero | Literal de hoy (ancla `grep -cF`) | Literal nuevo |
|---|---|---|
| `src/screens/welcome/index.tsx` | `className="w-full rounded-xl border border-accent bg-transparent"` | `className="w-full rounded-xl border-2 border-b-6 border-lip-gray bg-surface"` |
| `src/screens/forgot/index.tsx` | `className="w-full rounded-xl"` | `className="w-full rounded-xl border-2 border-b-6 border-lip-gray bg-surface"` |
| `src/screens/reminders/index.tsx` | `className="w-full rounded-xl"` | `className="w-full rounded-xl border-2 border-b-6 border-lip-gray bg-surface"` |
| `src/screens/docs/index.tsx` | `className="rounded-xl"` | `className="rounded-xl border-2 border-b-6 border-lip-gray bg-surface"` |

No cambia ninguna `variant` ni ningún `Button.Label`. Ancla global:
`grep -rhoF 'border-2 border-b-6 border-lip-gray bg-surface' src $PROD | wc -l`
→ `4`.

El mismo jest de (1), en verde.

Commit: `feat(mobile): labio gris en los cuatro secundarios neutros (R3)`.

### (3) Refactor

Ninguno.

### Sondas de mutación de R3 (mismo protocolo de restauración que en R2)

| Sonda | Rojo esperado (todo por aserción) |
|---|---|
| S3.1: quitar `border-lip-gray` de `docs-upload-cancel` | fila `docs` del `it.each` e `inventaría los cuatro…` (recuento 3; la lista sigue con 4 porque entra por `variant="outline"`) |
| S3.2, zona ciega por relleno: quitar `bg-default` de `theme-toggle` (`screens/profile/index.tsx`) | solo `inventaría los cuatro…` (5 testIDs) |
| S3.3, exclusión: añadir ` border-2 border-b-6 border-lip-gray` a `add-pet-photo` (`screens/add-pet/index.tsx`) | solo `inventaría los cuatro…` (5 testIDs, recuentos 5) |
| S3.4, zona ciega por variante: quitar `variant="outline"` de `reminders-delete-cancel` | solo la fila `reminders` del `it.each`. El inventario sigue verde porque el tag entra por `border-lip-gray` |
| S3.5: en welcome, añadir ` border-accent` detrás de `bg-surface` | fila `welcome` del `it.each`, el `it` de `R8` y el de `#166 R3` en `welcome/index.test.tsx` |

## T4. R4: la carta

### (1) Test rojo

Nuevo describe al final de `src/__tests__/consistency-classnames.test.ts`,
`'#166 R4: la carta declara el botón con cuerpo'`, con
`it('declara las dos recetas y el orden del labio')`:

- Lee `join(process.cwd(), '..', 'docs', 'ui-guidelines.md')`, igual que
  `#62 R1`.
- Comprueba con `toContain` cada uno de estos literales:
  - `'13. **Botón con cuerpo** (feature #166, 2026-10-11)'`
  - `` '`rounded-xl bg-accent border-b-4 border-black/25`' ``
  - `` '`rounded-xl border-2 border-b-6 border-lip-gray bg-surface`' ``
  - `` 'El labio va detrás de `bg-accent`, nunca delante' ``
  - `'`--color-lip-gray`'`
  - `'**Sin labio**'`
- Orden: el índice de `'12. **Escala de radios**'` es menor que el de
  `'13. **Botón con cuerpo**'`, y este es menor que el de
  `'## Animación (decisiones por defecto)'`.

`bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts`
→ rojo esperado: **1 failed**.

Commit: `test(mobile): la carta declara el botón con cuerpo (R4)`.

### (2) Implementación mínima

Pega en `docs/ui-guidelines.md` el bloque exacto de [[design]] D5 detrás de
la línea `    para añadírselo.` y antes de `## Animación (decisiones por defecto)`,
con una línea en blanco antes y otra después. Anclas:
`grep -cF '13. **Botón con cuerpo**' ../docs/ui-guidelines.md` → `1`, y
`grep -cF '## Animación (decisiones por defecto)' ../docs/ui-guidelines.md`
→ `1`. El mismo jest, en verde.

Commit: `docs(mobile): punto 13 de la carta, botón con cuerpo (R4)`.

### (3) Refactor

Ninguno.

### Sondas de mutación de R4

| Sonda | Rojo esperado |
|---|---|
| S4.1: en la carta, escribir la receta primaria como `rounded-xl border-b-4 border-black/25 bg-accent` | `declara las dos recetas…` |
| S4.2: mover el punto 13 detrás de `## Animación (decisiones por defecto)` | `declara las dos recetas…` (orden) |

## T5. R5: prueba de humo (humano, no Codex)

La corre el humano en un **dev build de Android** (nunca Expo Go): con el
dev build ya instalado, `bunx expo start --dev-client` desde
`mobile-pet-tracker/`. Si `adb devices` lista el teléfono dos veces (IP y
mDNS), usar `adb -s <ip:puerto>`. El tema se cambia en Perfil →
`theme-toggle`. Recorre la lista de [[requirements]] R5.1 en claro y en
oscuro, y firma en la segunda casilla de §Aprobación.

## Cierre (Codex, tras T4)

1. `bunx jest; echo "exit=$?"` → `exit=0`, con
   `Tests: (base de T0 + 10) passed`.
2. `bun run typecheck; echo "exit=$?"` y `bunx expo lint --no-cache; echo "exit=$?"`
   → `exit=0` los dos.
3. CA-4 y CA-5, contra el commit del handoff (`<H0>`):
   `git diff --quiet <H0> -- package.json bun.lock src/i18n/catalog.ts src/__tests__/ui-copy-table.ts; echo "exit=$?"`
   → `exit=0`.
4. CA-2: `git diff <H0> -- src | grep -cE '^\+.*(shadow-|elevation|boxShadow)'`
   → `0`.
5. Escribe `progress/impl_mobile-chunky-cta.md` con los hashes, los rojos
   vistos en cada commit `test` y el resultado de cada sonda S1.1 a S4.2.
   Rellena `specs/mobile-chunky-cta/traceability.md` con el `it` y los dos
   hashes (rojo y verde) de cada requisito.

## Cuentas

Las cuentas son acumuladas sobre la base `N` de T0. Cada fila es la
anterior más los `it` que se añaden en ese commit.

| Commit | `it` añadidos (netos) | Total de la suite | Rojos en el commit |
|---|---|---|---|
| R1 test | +2 (2 filas del `it.each`) | N + 2 | 2 |
| R1 feat | 0 | N + 2 | 0 |
| R2 test | +2 (los 8 de T2.1 ya existían) | N + 4 | 10 |
| R2 feat | 0 | N + 4 | 0 |
| R3 test | +4 filas + 1 inventario + 1 de welcome − 1 de welcome borrado = +5 | N + 9 | 7 |
| R3 feat | 0 | N + 9 | 0 |
| R4 test | +1 | N + 10 | 1 |
| R4 docs | 0 | N + 10 | 0 |
