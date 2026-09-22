---
feature: "mobile-meal-toggle-source-lock-nesting"
status: approved         # draft | spec_ready | approved  ← aprobada por el humano en Notion el 2026-09-22T16:52:27Z
tags: [harness, spec, mobile, deuda]
---

# Requisitos — [[mobile-meal-toggle-source-lock-nesting]] (#109)

> Notación EARS. Cada requisito lleva su id `R<n>`, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y la medición que las sostiene,
> [[tasks]] para el orden TDD y las sondas obligatorias, y [[traceability]] para
> el cierre.
>
> Origen: deuda **B2** de `progress/review_mobile-meals-bar-motion.md:125`
> (ronda 1, reconfirmada en ronda 2), con el aviso de **B8**
> (`:712`) sobre reusar localización por índice o por valor.
>
> **Esta feature no toca producción.** Todo el trabajo vive en
> `mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx` y en
> `docs/conventions.md`.

## Contexto mínimo para implementar sin más contexto

El candado afectado es el segundo `it` de
`describe('#107 R5: el botón por franja conserva su feedback de pulsado')`, en
`mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx` (hoy `:784-795`):

```js
it('conserva la receta de opacidad en el bloque fuente del botón', () => {
  const source = readFileSync('src/app/(tabs)/food.tsx', 'utf8');
  const anchor = source.indexOf('testID={`meal-toggle-${index}`}');
  const block = source.slice(
    source.lastIndexOf('<Pressable', anchor),
    source.indexOf('</Pressable>', anchor),
  );

  expect(block).toMatch(
    /style=\{\(\{ pressed \}\) => \(\{\s*opacity: pressed \? 0\.8 : 1,?\s*\}\)\}/,
  );
});
```

Le acompaña, **antes** en el mismo `describe`, la pata de árbol
`it('expone opacidad 1 en reposo en el árbol renderizado')`, que asevera
`expect(opacityOf(toggle.props.style)).toBe(1)`. Las dos patas cierran juntas
el R5 de #107; ninguna de las dos se borra en esta feature (ver §Fuera de
alcance y [[design]] §La tercera vía).

## Requisitos funcionales

- **R1**: WHEN el candado de fuente del `meal-toggle` recorta el bloque de
  `src/app/(tabs)/food.tsx`, THE SYSTEM SHALL acotarlo **al tag de apertura
  propio del `meal-toggle`** —desde el `<` que abre ese tag hasta el `<` del
  primer hijo— de modo que ningún `<Pressable>` **anidado dentro** del botón
  pueda desplazar ninguno de los dos límites, y de modo que ningún
  `<Pressable>` **anterior** en el fichero pueda quedar dentro del bloque.

- **R2**: WHEN el fuente de `src/app/(tabs)/food.tsx` se muta a cualquiera de
  las **cuatro variantes de acotado** que el reviewer probó en la ronda 1
  (`review_mobile-meals-bar-motion.md:125-145`), THEN el test de R1 SHALL
  fallar **por su propia aserción** (no por `ReferenceError` ni por otro test):

  | | Variante de acotado | Dónde queda la receta `opacity: pressed ? 0.8 : 1` |
  |---|---|---|
  | **V1** | `style` quitado del todo | en ningún sitio |
  | **V2** | movida a un `<Pressable>` **hermano anterior** | antes del `meal-toggle` |
  | **V3** | movida a un `<Pressable>` **hermano posterior** | después del `meal-toggle` |
  | **V4** | movida a un `<Pressable>` **anidado dentro** del `meal-toggle` | entre el tag de apertura y `</Pressable>` |

  V4 es el agujero B2: **hoy da verde** y el candado queda vigilando el `style`
  de otro elemento. V1, V2 y V3 ya dan rojo hoy y SHALL seguir dándolo.

- **R3**: WHILE la receta siga escrita en el tag de apertura del `meal-toggle`,
  THE SYSTEM SHALL conservar sin cambios el veredicto del candado en las tres
  mutaciones que **no** son de acotado, medidas contra `73f14d5e`:

  | | Mutación | Veredicto exigido |
  |---|---|---|
  | **V5** | se anida un `<Pressable>` **sin receta** dentro del `meal-toggle`, que conserva la suya | **verde** (no puede aparecer un falso rojo) |
  | **V6** | la receta se reformatea a una sola línea | **verde** (la regex es tolerante a propósito) |
  | **V7** | `0.8` → `0.5` | **rojo** (la pata de árbol no lo detecta: en reposo la opacidad sigue siendo 1) |

- **R4**: WHEN un futuro lector abra el candado de R1, THE SYSTEM SHALL
  ofrecerle el límite del recorte **por escrito en dos sitios**: un comentario
  en el propio call-site de
  `mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx` y una entrada en
  `docs/conventions.md` §Tests que nombre el patrón, su regla y su modo de
  fallo, para que quien lo copie no herede el agujero (deuda **B8**).

- **R5**: WHEN la feature llegue al PR, THE SYSTEM SHALL dejar el diff de
  producción **vacío**: `git diff 73f14d5e -- 'mobile-pet-tracker/src/app/(tabs)/food.tsx'`
  SHALL no imprimir nada. IF algún requisito pareciera necesitar tocar
  `food.tsx` de forma permanente, THEN el implementador SHALL parar y
  devolver el trabajo en vez de tocarlo.

  Esto **no** contradice la mutación de R2: la mutación de producción se
  versiona en el commit rojo y se revierte en el verde (C4, quinto punto), de
  modo que el diff **acumulado** de la feature sobre `food.tsx` es vacío
  aunque commits intermedios lo toquen.

## Qué firma el humano al aprobar esta spec

1. Que se elige **(a)** del criterio 1 del encargo —acotar de otra forma— y no
   **(b)** —solo documentar—, porque (b) por sí sola deja V4 en verde y no
   satisface el criterio 2. La documentación se hace **además**, en R4.
2. Que el acotado elegido **no es un balanceador de tags** sino una ventana al
   tag de apertura, con la justificación medida de [[design]] §Decisión de
   acotado.
3. Que el candado de fuente **no se borra**: [[design]] §La tercera vía mide
   por qué la pata de árbol no lo cubre.
4. Que la feature **no lleva prueba de humo en dev build de Android**, porque
   el diff de producción es vacío y no hay nada observable en el dispositivo.
5. Que **R4 y R5 no tienen test propio** —son un entregable de documentación y
   una propiedad del diff— y los cierra el `reviewer` por inspección. Queda
   declarado aquí, por escrito y antes del handoff, como pide C4.

## Fuera de alcance

Cada viñeta está clasificada: **(D)** delimitación de esta feature,
**(F)** trabajo futuro con dueño, **(N)** premisa verificada y descartada.

- **(D)** No se borra ni se debilita ninguna de las dos patas de `#107 R5`. El
  `it` de fuente se **edita**; el `it` de árbol no se toca.
- **(D)** No se cambia la regex de la receta
  (`/style=\{\(\{ pressed \}\) => \(\{\s*opacity: pressed \? 0\.8 : 1,?\s*\}\)\}/`).
  Cambia el recorte, no lo que se busca dentro.
- **(D)** **No se añade ninguna clave de copy.** Esta feature no toca
  `src/i18n/catalog.ts` ni
  `src/providers/__tests__/language-provider.test.tsx`; su candado de longitud
  de catálogo **no debe tocarse**.
- **(D)** **No se instala ninguna dependencia nueva.**
- **(F)** El gemelo del mismo patrón roto vive en
  `mobile-pet-tracker/src/screens/home/index.test.tsx:3355-3359`
  (`reminders-see-all`, mismo `lastIndexOf('<Pressable', anchor)` /
  `indexOf('</Pressable>', anchor)`). **Queda fuera**: ese fichero lo tiene
  tomado `#108`. Dueño: feature de seguimiento, no esta.
- **(F)** La deuda **B8** propiamente dicha (`expectMealsBarTiming` localizando
  por valor sobre un mock compartido) no se arregla aquí; esta feature solo
  hereda su lección y la escribe en `docs/conventions.md` (R4).
- **(N)** *«El límite de atrás (`lastIndexOf`) es el fallo peligroso.»*
  **Falso tal cual**: medido, el ancla `testID={...}` vive **dentro** del tag
  que `lastIndexOf('<Pressable', …)` busca, así que ese límite se auto-ancla y
  V2 (hermano anterior) sale **rojo**. Solo es explotable en una forma
  compuesta y poco probable, descrita en [[design]] §Los dos límites, medidos.
  El acotado de R1 la cierra igualmente, gratis.
- **(N)** *«`#109` casa con el guard de hex de `design-drift.test.ts` y habrá
  que partir el literal como en #106.»* **Falso para este fichero**: medido,
  `design-drift.test.ts` no llega nunca a
  `src/app/(tabs)/__tests__/food.test.tsx`. Los títulos se escriben con
  `'#109 R<n>: …'` **enteros**. Detalle y medición en [[design]] §El guard de
  hex no alcanza a este fichero.

## Aprobación

- [X] **Aprobado por humano** (fecha: 2026-09-22) ← gate obligatorio antes de
      implementar. Al marcar esta casilla el humano firma también los cinco
      puntos de §Qué firma el humano al aprobar esta spec.

> **Cómo se aprobó, y qué se puede probar de ello.** El humano puso
> `Estado del gate` = **Aprobado** en la página de Notion
> `3e36115a-9b27-815f-a0d9-e0854ea6c602`
> (`Panel de Proyectos — Harness SDD / Specs`), que el `leader` verificó
> leyéndola: propiedad en «Aprobado», `page_last_edited_at` =
> **2026-09-22T16:52:27.198Z**. La casilla la marca el `leader` en su nombre,
> según `.claude/agents/leader.md` §Gate de aprobación vía Notion.
>
> **Lo que NO se puede probar por esta vía:** la API devuelve *qué* cambió y
> *cuándo*, pero **no la cuenta que lo cambió** — el filtro por editor es de
> plan Business. La evidencia es la propiedad y su marca de tiempo, no la
> autoría. Si algún día hace falta autoría demostrable, el humano firma en el
> repo con su propio commit, que es la vía que sigue abierta.

> No hay ningún otro gate humano en esta feature: sin diff de producción no
> hay prueba de humo que firmar. El cierre lo dan el veredicto del `reviewer`
> y esta casilla.
