---
feature: "mobile-reminders-see-all-source-lock-nesting"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Requisitos — [[mobile-reminders-see-all-source-lock-nesting]] (#112)

> Notación EARS. Cada requisito lleva su id `R<n>`, inmutable una vez aprobado.
> Ver [[design]] para las decisiones y la medición que las sostiene, [[tasks]]
> para el orden TDD y las sondas, y [[traceability]] para el cierre.
>
> Origen: gemelo del candado que arregló #109
> (`specs/mobile-meal-toggle-source-lock-nesting/`), que lo dejó fuera porque
> el fichero lo tenía tomado #108. #108 y #110 están `done` y el fichero está
> libre.
>
> **Esta feature no toca producción.** El trabajo vive en
> `mobile-pet-tracker/src/screens/home/index.test.tsx` y en
> `docs/conventions.md`.
>
> **Base medida: `993b62fa`** (`origin/main`). Todas las cifras y los
> veredictos de esta spec se midieron ahí. **Los números de línea no son
> anclas**: todo se localiza con los `grep` que se citan, porque las líneas
> se desplazan con cada merge (ya pasó: `docs/conventions.md` cita
> `:3355-3359` y `:309-311`, y los dos han caducado).

## Contexto mínimo para implementar sin más contexto

El candado es el `it` que devuelve
`grep -n "muestra feedback visual al pulsar el enlace" mobile-pet-tracker/src/screens/home/index.test.tsx`
(una sola coincidencia). Vive dentro de
`describe('#70 R10: enlace a la lista de recordatorios')` y, a diferencia de
#109, **junta en el mismo `it` las dos patas**: primero la de árbol y después
la de fuente. Su recorte lo localiza
`grep -n "lastIndexOf('<Pressable'" mobile-pet-tracker/src/screens/home/index.test.tsx`
(una sola coincidencia):

```ts
const anchor = source.indexOf('testID="reminders-see-all"');
const block = source.slice(
  source.lastIndexOf('<Pressable', anchor),
  source.indexOf('</Pressable>', anchor),
);

expect(opacityOf(link.props.style)).toBe(1);          // pata de árbol
expect(block).toMatch(                                 // pata de fuente
  /style=\{\(\{ pressed \}\) => \(\{ opacity: pressed \? 0\.8 : 1 \}\)\}/,
);
```

El elemento que vigila está en `mobile-pet-tracker/src/screens/home/index.tsx`
(`grep -n 'testID="reminders-see-all"'` da una sola coincidencia). El ancla es
la **primera prop** del tag de apertura del `<Pressable>`, y en ese tag **no
hay ningún `<`** entre `<Pressable` y el `>` que lo cierra (medido: el recorte
nuevo sobre la base tiene exactamente un `<`, el del propio tag).

## Requisitos funcionales

- **R1**: WHEN el candado de fuente de `reminders-see-all` recorta
  `src/screens/home/index.tsx`, THE SYSTEM SHALL acotar el bloque **al tag de
  apertura propio** de `reminders-see-all`, desde el `<` que lo abre hasta el
  `<` del primer hijo, con exactamente este recorte:

  ```ts
  const block = source.slice(
    source.lastIndexOf('<', anchor),
    source.indexOf('<', anchor),
  );
  ```

  y el `it` SHALL titularse
  `'#112 R1: muestra feedback visual al pulsar el enlace, acotado a su tag de apertura'`.
  El ancla, la pata de árbol y la regex **no cambian**.

- **R2**: WHEN `src/screens/home/index.tsx` se muta a cualquiera de los **dos
  agujeros medidos**, THEN el `it` de R1 SHALL fallar **por su aserción de
  fuente** (`toMatch`), no por la de árbol, ni por un `ReferenceError`, ni por
  otro test:

  | | Mutación ([[tasks]] tiene el texto exacto) | Hoy, recorte viejo | Exigido |
  |---|---|---|---|
  | **N1** | el propio tag pasa a `style={{ opacity: 1 }}` y un `<Pressable>` **anidado** con la receta envuelve al `<Text>` hijo | **VERDE**: el fichero 140/140 y **la suite móvil entera 82/1452** | **ROJO** por `toMatch` |
  | **W1** | el propio tag pasa a `style={{ opacity: 1 }}` y se **autocierra**; la receta y el `<Text>` pasan a un `<Pressable>` **hermano posterior** | el `it` **VERDE** (caen otros 3 tests del fichero, por el texto) | **ROJO** por `toMatch` |

  N1 es el agujero por anidamiento que da nombre a la feature y **es la
  mutación que se versiona** en el commit rojo (C4, vía **b**). W1 es el mismo
  agujero por el lado de ensanchar la ventana; se sondea y se revierte.

- **R3**: WHEN `src/screens/home/index.tsx` se muta a cualquiera de las sondas
  siguientes, THE SYSTEM SHALL dar el veredicto de la columna «Exigido», que es
  **idéntico al medido hoy** con el recorte viejo salvo en **E1**, declarada
  abajo:

  | | Mutación | Hoy | Exigido |
  |---|---|---|---|
  | **N1p** | V4 pura: sin `style` en el propio tag, anidado con receta | ROJO por `toBe(1)` | ROJO por `toBe(1)` |
  | **N2** | anidado **sin** receta, propio intacto | VERDE | VERDE |
  | **S1** | propio tag a `style={{ opacity: 1 }}` | ROJO por `toMatch` | ROJO por `toMatch` |
  | **S1p** | `style` quitado del propio tag | ROJO por `toBe(1)` | ROJO por `toBe(1)` |
  | **S2** | S1 + receta en un `<Pressable />` hermano **anterior** | ROJO por `toMatch` | ROJO por `toMatch` |
  | **S3** | S1 + receta en un `<Pressable />` hermano **posterior** | ROJO por `toMatch` | ROJO por `toMatch` |
  | **E2** | `hitSlop={0 < 1 ? 8 : 0}` **antes** del ancla | VERDE | VERDE |
  | **E3** | la receta movida delante del ancla, dentro del propio tag | VERDE | VERDE |
  | **V6** | la receta partida en tres líneas | ROJO por `toMatch` | ROJO por `toMatch` |
  | **V7** | `0.8` → `0.5` | ROJO por `toMatch` (el árbol, verde) | ROJO por `toMatch` |
  | **L2** | S1 + la receta como **cadena hija** antes del `<Text>` | ROJO: el render se rompe, 118/140 | ROJO: el render se rompe |
  | **E1** | `hitSlop={0 < 1 ? 8 : 0}` **entre** el ancla y la receta | VERDE | **ROJO** por `toMatch` |

  **E1 cambia a propósito**: es el límite 1 del patrón (un `<` dentro del
  propio tag adelanta el corte), ya documentado en `docs/conventions.md`. Falla
  hacia **rojo**, es decir, avisa. En la base no hay ningún `<` en ese tag, así
  que hoy no se da.

- **R4**: WHEN un lector abra el candado de R1 o `docs/conventions.md`
  §«Recortes del tag de apertura en candados de fuente», THE SYSTEM SHALL
  ofrecerle el estado real del patrón **anclado por contenido**:
  1. un comentario en el call-site, justo encima del `const block`, con el
     texto literal que fija [[tasks]] §R4, y
  2. el último párrafo de esa sección de `docs/conventions.md`, el que empieza
     por «El patrón ya vive en» y termina en «que se registró aparte.»,
     **sustituido** por el texto literal que fija [[tasks]] §R4. Ese texto
     tiene que dejar de decir que queda un gemelo por migrar y no puede citar
     números de línea.

  Tras R4, `grep -rn "lastIndexOf('<[A-Z]" mobile-pet-tracker/src` SHALL no
  devolver nada (exit 1).

- **R5**: WHEN la feature llegue al PR, THE SYSTEM SHALL dejar el diff de
  producción **vacío**:
  `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx`
  SHALL salir con 0. Mientras la base siga siendo `993b62fa`, el blob de
  `HEAD:mobile-pet-tracker/src/screens/home/index.tsx` SHALL ser
  `dbb5b0346895cfc26705bee2257d1f8a8815df6c`. IF algún requisito pareciera
  necesitar tocar `index.tsx` de forma permanente, THEN el implementador SHALL
  parar y devolver el trabajo.

  Esto **no** contradice R2: la mutación N1 se versiona en el commit rojo y se
  revierte en el verde (C4, quinto punto). El diff **acumulado** es vacío
  aunque un commit intermedio lo toque.

## Qué firma el humano al aprobar esta spec

1. Que el acotado es la ventana de `<` a `<` que `docs/conventions.md` ya fija.
   Esta feature no decide ningún patrón nuevo.
2. Que la mutación versionada es **N1** y no la V4 pura de #109. Aquí las dos
   patas comparten `it`, y la V4 pura (N1p) ya da rojo hoy por la de árbol. El
   agujero solo existe donde la pata de árbol no mira: el estado pulsado. Por
   eso N1 conserva `opacity: 1` en reposo. Medición en [[design]] §Dónde está
   el agujero de verdad.
3. Que el `it` se **renombra** con prefijo `#112 R1` (C4 pide que el test
   nombre su R-id) y **conserva entero su título viejo** como subcadena. Así la
   cita de `specs/mobile-home-reminders-section/traceability.md` (fila R10,
   `it('muestra feedback visual al pulsar el enlace')`) sigue resolviendo por
   `grep` y por `-t`, y **no se enmienda**.
4. Que E1 pasa de verde a rojo y se acepta: es el límite 1 documentado y falla
   por el lado seguro.
5. Que la feature **no lleva prueba de humo en dev build de Android**. El diff
   de producción es vacío y en el dispositivo no hay nada que observar.
6. Que **R4 y R5 no tienen test propio**: R4 es un entregable de
   documentación y R5 es una propiedad del diff. Los cierra el `reviewer` por
   inspección, y queda declarado aquí antes del handoff, como pide C4.

## Fuera de alcance

Cada viñeta está clasificada: **(D)** delimitación de esta feature,
**(F)** hallazgo que se registra para otra feature, **(N)** premisa verificada
y descartada.

- **(D)** No se toca la regex de la receta. Es rígida (V6 da rojo con los dos
  recortes), pero cambiar lo que se busca no es cambiar el recorte.
- **(D)** No se separa la pata de fuente en un `it` propio. Eso daría +1 test
  y no cierra nada que el recorte no cierre ya (ver [[design]] §Alternativas).
- **(D)** No se borra la pata de fuente. **V7** demuestra que es el único
  candado del `0.8` de `reminders-see-all`: con `0.5` la pata de árbol sigue
  verde.
- **(D)** No se añade **ninguna clave de copy**: ni `src/i18n/catalog.ts` ni
  `src/providers/__tests__/language-provider.test.tsx`, cuyo candado de
  longitud de catálogo **no se toca**.
- **(D)** No se instala **ninguna dependencia**.
- **(D)** No se enmienda `specs/mobile-home-reminders-section/traceability.md`
  (punto 3 de la firma).
- **(F)** **Primo del patrón, no gemelo:** el helper `elementWithTestId`,
  duplicado en `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`
  y `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts`
  (`grep -n "function elementWithTestId"`), recorta desde el ancla
  `testID="…"` hasta `indexOf(closingTag, start)`, con los hijos dentro. Tiene
  la misma clase de agujero: medido sobre `pill-active` de
  `src/screens/reminders/index.tsx`, si se quita `rounded-xl` del propio tag y
  se añade un hijo `<View className="rounded-xl" />`, el bloque sigue
  conteniendo `rounded-xl` y el candado de `#62 R4` pasa **verde**. No es este
  patrón (no busca un tag de apertura, y en `legibility` el hijo es
  precisamente lo que se asevera), así que **no se amplía el alcance**. Lo
  registra el `leader`, que asigna el id contra `origin/main`. Detalle en
  [[design]] §Barrido de gemelos.
- **(F)** **La campana tiene un candado de fuente sin acotar.** En este mismo
  fichero, `it('usa la ruta real sin cast Href y conserva el feedback de pulsado')`
  de `describe('#78 R10: la campana vive en el hero y lleva al centro de alertas')`
  asevera la receta contra **todo** `index.tsx` (`expect(source).toMatch(…)`).
  Medido: con `style={{ opacity: 1 }}` en `home-alerts-bell` el fichero da
  **140/140 verde**, porque la receta de `reminders-see-all` basta para que
  pase. No es un recorte y no entra aquí. Lo registra el `leader`. Detalle en
  [[design]] §Barrido de gemelos.
- **(N)** *«Hay un tercer gemelo `lastIndexOf('<Tag'` + `indexOf('</Tag>'`.»*
  **Falso**: `grep -rn "lastIndexOf(" mobile-pet-tracker/src` da tres
  coincidencias, y solo la de este candado busca `'<Pressable'`. Las otras dos
  ya usan `'<'`.
- **(N)** *«Una prop anterior al ancla con un `<` pondría rojo el límite 1.»*
  **No aplica, y además está invertido**: el ancla es la primera prop, así que
  no hay props anteriores. Y un `<` **antes** del ancla no pone nada rojo (E2
  queda verde), porque el recorte sigue conteniendo todo lo que hay desde el
  ancla hasta el final del tag. El que avisa es un `<` **entre** el ancla y la
  receta (E1).
- **(N)** *«#84 (sesión Backend) toca este fichero o `docs/`.»* **Falso**: su
  `design.md` §Archivos afectados declara que no cambian `src/screens/home/*` ni
  `docs/`. Solo añade tests en `src/utils/reminder-dates.test.ts` y
  `src/screens/reminders/index.test.tsx`, así que si mergea primero **mueve el
  recuento absoluto de la suite** pero no el delta de esta feature.

## Aprobación

- [x] **Aprobado por humano** (fecha: 2026-09-23) ← gate obligatorio antes de
      implementar. Al marcar esta casilla el humano firma también los seis
      puntos de §Qué firma el humano al aprobar esta spec.

> **Esta es la única casilla de la feature.** No hay gate humano en teléfono:
> sin diff de producción no hay prueba de humo que firmar (punto 5). El cierre
> lo dan el veredicto del `reviewer` y esta casilla.
