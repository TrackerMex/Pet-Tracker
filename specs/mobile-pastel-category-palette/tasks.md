---
feature: "mobile-pastel-category-palette"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-pastel-category-palette]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Los valores exactos, las
> rutas y las clases están en [[design]] — no hay que deducir nada.
>
> **Un commit por requisito como mínimo, y el test rojo va en su propio commit
> antes que la implementación.** C4 de [[../../CHECKPOINTS|CHECKPOINTS]] exige
> ver el historial rojo→verde; en #19 se metió todo en un commit y se incumplió.
> Convención: `test(mobile-pastel-palette): R<n> …` para el rojo y
> `feat(mobile-pastel-palette): R<n> …` para el verde.
>
> **Orden obligatorio**: R1-R4 (tokens) → R5-R6 (mapeo) → R7-R8 (aplicación) →
> R9-R10 (blindaje). Un test de R7 escrito antes de R1 falla por token
> inexistente, no por la razón que debe fallar.
>
> Antes de empezar: cargar `expo-overview` y de ahí `expo-design-system`, como
> exige `docs/ui-guidelines.md` §Skills. Y no tocar nada fuera de la tabla de
> [[design]] §7.

## R1 — Tokens de la paleta en tema claro

- [ ] (1) Test rojo en `src/theme/__tests__/global-css.test.ts` ::
      `describe('#64 R1: global.css declara la paleta pastel categórica en tema claro')`.
      Reutiliza los helpers `extractVariant` / `parseVariables` que ya existen
      en ese archivo. Afirma los diez pares nombre→hex de [[design]] §3.1
      (claro) y, además, que `color-category-green` === `surface-secondary` y
      `color-category-green-strong` === `accent-strong` del mismo bloque.
- [ ] (2) Añadir las diez líneas dentro de `@variant light` en la posición que
      fija [[design]] §4.1.
- [ ] (3) Refactor con tests verdes.

## R2 — Tokens de la paleta en tema oscuro

- [ ] (1) Test rojo en el mismo archivo ::
      `describe('#64 R2: el tema oscuro de la paleta se diseña a la profundidad de surface-secondary')`.
      Afirma los diez pares de [[design]] §3.1 (oscuro) **y** que la luminancia
      relativa de las cinco superficies oscuras coincide con la de `#12231B`
      (0,0141) con `toBeCloseTo(…, 4)`, reutilizando la función `luminance` que
      el archivo ya define en `:163`.
- [ ] (2) Añadir las diez líneas dentro de `@variant dark`.
- [ ] (3) Refactor con tests verdes.

## R3 — Cada tinta pasa AA sobre su superficie, en los dos temas

- [ ] (1) Test rojo ::
      `describe('#64 R3: cada tinta categórica pasa AA sobre su superficie en los dos temas')`.
      Reutiliza la función `contrast` que ya vive en el archivo (`:173`). Doce
      casos (seis huecos × dos temas): `toBeGreaterThanOrEqual(4.5)` y
      `toBeCloseTo(<ratio de [[design]] §3.1>, 3)`. Incluye el ancla
      `contrast('#FFFFFF', '#2AB87C') ≈ 2.547` para demostrar que el aparato de
      cálculo es el mismo que el de #61.
- [ ] (2) Si algún par no llega, el que se mueve es la **tinta**, nunca el
      pastel, siguiendo la regla de derivación de [[design]] §3.0 — pero con
      los valores de la spec no debería moverse nada: el test debe pasar en
      cuanto R1 y R2 estén dentro.
- [ ] (3) Refactor con tests verdes.

## R4 — Ninguna categoría se confunde con otra ni con un token de estado

- [ ] (1) Test rojo ::
      `describe('#64 R4: ninguna categoría se confunde con otra ni con un token de estado')`.
      Necesita CIEDE2000, que el archivo aún no tiene: se añade una función
      `deltaE00(a, b)` junto a `contrast`, documentada con la misma cabecera
      que remite a [[design]] §1. Casos: las 15 parejas de superficies
      categóricas por tema, y cada superficie/tinta categórica contra las
      superficies de estado compuestas de [[design]] §1 y contra `--accent`,
      `--accent-strong`, `--success`, `--warning`, `--warning-strong`,
      `--danger`. Umbral `toBeGreaterThanOrEqual(2.3)`, con la **excepción
      explícita** de la familia verde contra `surface-secondary` /
      `accent-strong`, que es 0 por decisión declarada (R1/R2) y se afirma
      como igualdad, no como distancia.
- [ ] (2) Nada que implementar si R1-R3 están bien: este requisito es un
      candado. Si falla, el valor que se mueve es el de la tinta, no el del
      pastel.
- [ ] (3) Refactor con tests verdes.

## R5 — Cada tipo de recordatorio resuelve un hueco

- [ ] (1) Test rojo en `src/utils/__tests__/category-palette.test.ts` (archivo
      nuevo) :: `describe('#64 R5: cada tipo de recordatorio resuelve un único hueco de la paleta')`.
      Afirma el reparto exacto de [[design]] §2.4 para los siete tipos, que
      `label` y `emoji` siguen valiendo lo que valían, y que
      `Object.keys(REMINDER_TYPE_META)` tiene longitud 7.
- [ ] (2) Crear `src/utils/category-palette.ts` con `CategorySlot` y
      `CATEGORY_SLOTS` ([[design]] §4.2) y añadir `category` a
      `REMINDER_TYPE_META` ([[design]] §4.3).
- [ ] (3) Refactor con tests verdes.

## R6 — El tipo de documento resuelve su hueco, con respaldo neutral

- [ ] (1) Test rojo en el mismo archivo ::
      `describe('#64 R6: el tipo de documento resuelve su hueco y cae en neutral si es desconocido')`.
      Casos: `'Vacunación'` (el que usa el fixture de `docs/index.test.tsx:193`),
      su variante sin tilde, su variante en inglés, uno de cada uno de los otros
      tres tipos del Make, uno con espacios y mayúsculas raras, y **tres
      desconocidos** (`'Radiografía'`, `''` tras `trim`, y una cadena de 40
      caracteres) que deben devolver `'neutral'`.
- [ ] (2) Añadir `DOCUMENT_TYPE_SLOTS` y `documentCategory` a
      `src/utils/category-palette.ts` ([[design]] §4.2).
- [ ] (3) Refactor con tests verdes.

## R7 — La fila de recordatorio pinta el icono con el color de su tipo

- [ ] (1) Test rojo en `src/screens/reminders/index.test.tsx` ::
      `describe('#64 R7: la fila de recordatorio pinta el icono con el color de su tipo')`.
      Renderiza al menos dos recordatorios de tipo distinto (uno `vaccine` y uno
      `medication`) y afirma que el `className` del tile de cada fila contiene
      `bg-category-blue` y `bg-category-amber` respectivamente, que **no**
      contiene `bg-accent-soft`, y que el emoji y la etiqueta del tipo siguen en
      pantalla (el color no viaja solo).
- [ ] (2) Aplicar el `className` de [[design]] §4.4. Un solo `className`
      cambia; el `style={CONTINUOUS_CORNER}` no se toca.
- [ ] (3) Refactor con tests verdes.

## R8 — La fila de documento pinta icono y badge con el color de su tipo

- [ ] (1) Test rojo en `src/screens/docs/index.test.tsx` ::
      `describe('#64 R8: la fila de documento pinta icono y badge con el color de su tipo')`.
      Dos documentos, uno `'Vacunación'` y uno de tipo desconocido: el primero
      da `bg-category-blue` en el tile y
      `'self-start rounded-full px-2 py-0.5 text-2xs font-bold bg-category-blue text-category-blue-strong'`
      exacto en el badge; el segundo cae en `bg-default` / `text-muted`.
      En el mismo commit se **actualiza** la aserción de `:205-207` del
      `describe` de #62 R10 al valor nuevo — enmienda declarada y firmada en
      [[requirements]] R8. No se borra ese `describe` ni se debilita: sigue
      afirmando una cadena exacta y sigue afirmando que el texto no cambia.
- [ ] (2) Aplicar el `const slot` y los dos `className` de [[design]] §4.5.
- [ ] (3) Refactor con tests verdes.

## R9 — El color categórico solo se nombra en el módulo de paleta

- [ ] (1) Test rojo en `src/__tests__/consistency-classnames.test.ts` ::
      `describe('#64 R9: el color categórico solo se nombra en el módulo de paleta')`.
      Reutiliza `sourceFiles` / `filesMatching` que el archivo ya define.
      Afirma: (a) `filesMatching(/bg-category-|text-category-/)` devuelve
      exactamente `['utils/category-palette.ts']`; (b) no hay interpolación —
      cero coincidencias de `/(?:bg|text)-category-\$\{/`; (c) las diez clases
      aparecen escritas enteras en ese archivo; (d) el conteo de
      `bg-accent-soft` en `src/` baja de 19 a **17**, con `reminders/index.tsx`
      conservando exactamente uno y `docs/index.tsx` ninguno.
- [ ] (2) Nada que implementar si R5-R8 están bien: es el candado del
      grep-clean.
- [ ] (3) Refactor con tests verdes.

## R10 — La carta declara la paleta y su tabla de huecos

- [ ] (1) Test rojo en `src/__tests__/consistency-classnames.test.ts` ::
      `describe('#64 R10: la carta declara la paleta categórica y su tabla de huecos')`.
      Mismo patrón que el `it` de #62 R1 que ya lee `../docs/ui-guidelines.md`
      (`:73-88`): afirma que la carta contiene la cabecera de la tabla, las seis
      filas con su token, y la frase que fija `src/utils/category-palette.ts`
      como único sitio donde se escriben esas clases.
- [ ] (2) Añadir la tabla a `docs/ui-guidelines.md` §Dirección de arte 1, con
      el texto exacto de [[design]] §4.6.
- [ ] (3) Refactor con tests verdes.

## Cierre

- [ ] `traceability.md` sin ninguna fila "pendiente".
- [ ] Suite móvil completa verde: `npm test` en `mobile-pet-tracker/`.
- [ ] `progress/impl_mobile-pastel-category-palette.md` escrito por el
      implementador, con el resultado del grep-clean rehecho a mano.
- [ ] Gate humano de smoke pendiente (dev build de Android, los dos temas,
      pantallas Reminders y Documentos) — **no delegable a IA**.
