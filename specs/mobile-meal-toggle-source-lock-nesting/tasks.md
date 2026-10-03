---
feature: "mobile-meal-toggle-source-lock-nesting"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, mobile, deuda]
---

# Tareas — [[mobile-meal-toggle-source-lock-nesting]] (#109)

> Disciplina TDD. Ver [[requirements]] para los R-ids y [[design]] para la
> medición que sostiene cada decisión.

## Antes de tocar nada

- [ ] `cd mobile-pet-tracker` — **todos** los comandos de este fichero corren
      desde ahí. La ruta `'src/app/(tabs)/food.tsx'` que el candado abre con
      `readFileSync` es **relativa al cwd de jest**.
- [ ] `rm -f .expo/types/router.d.ts` — los tipos de expo-router están
      gitignorados y rompen el typecheck con rutas fantasma.
- [ ] **`bun` / `bunx`, nunca `npx` ni `npm`.**
- [ ] **Ningún comando con pipe.** `bunx jest | tail` devuelve el exit de
      `tail`, no el de jest. Si hace falta recortar salida, guarda a fichero y
      lee el fichero.
- [ ] **Los paréntesis de `(tabs)` son regex para jest.** Usa siempre
      `--runTestsByPath` con la ruta completa, y **comprueba que jest imprime
      `Test Suites: 1 …`**: un filtro mal escapado no corre nada y sale con 0.

Comandos canónicos de esta feature:

```bash
# suite del candado
bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx'; echo "exit=$?"

# suite completa
bunx jest; echo "exit=$?"

# typecheck
rm -f .expo/types/router.d.ts && bunx tsc --noEmit; echo "exit=$?"
```

**Delta esperado al terminar, contra `73f14d5e`: +0 suites y +0 tests.** R1
edita un `it` que ya existe, no añade ninguno. Si aparecen tests o suites de
más, algo se ha salido del alcance. (No uses recuentos absolutos: caducan.)

---

## R1 + R2 — el recorte se acota al tag de apertura, y lo prueba V4

R1 y R2 **comparten un único par rojo→verde**: R2 es requisito de verificación
por la **vía (b) de C4** —el `style` ya está en producción, así que un candado
escrito sobre él nacería verde—. Por eso **el commit rojo lleva la mutación de
producción y el verde la revierte**, igual que hizo `#107 R5`
(`specs/mobile-meals-bar-motion/traceability.md:28-31`). Mutar un doble de
test no vale: C4, quinto punto.

### (1) Commit ROJO — mutación de producción + recorte nuevo

- [ ] En `src/app/(tabs)/food.tsx`, aplicar **V4**: quitar el atributo
      `style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}` del
      `<Pressable>` del `meal-toggle` (`food.tsx:252-263`, el que lleva
      ``testID={`meal-toggle-${index}`}``) y colgarlo de un `<Pressable>`
      **anidado dentro**, envolviendo al `<Text>` hijo.
- [ ] En `src/app/(tabs)/__tests__/food.test.tsx`, en el segundo `it` de
      `describe('#107 R5: …')` (hoy `:784-795`):
      - [ ] renombrar el `it` a
            `'#109 R1: acota el bloque de fuente al tag de apertura propio del meal-toggle'`
            (título **entero**, sin partir el `#109` — ver [[design]] §El guard
            de hex no alcanza a este fichero);
      - [ ] sustituir el recorte por la ventana al tag de apertura:
            ```js
            const block = source.slice(
              source.lastIndexOf('<', anchor),
              source.indexOf('<', anchor),
            );
            ```
      - [ ] **no tocar** la regex de la receta ni el `it` de árbol que va antes.
- [ ] Correr la suite del candado. Esperado: **rojo, 2 tests** — el `it` de
      árbol (`#107 R5`, porque el botón perdió su opacidad) y **el `#109 R1`,
      que falla por su propia aserción**. Guardar la salida entera.
- [ ] **Evidencia obligatoria en el reporte**: con la mutación V4 puesta y el
      recorte **viejo**, el `#109 R1` **pasaba**. Dejar registrado ese contraste
      —es lo que demuestra que el agujero era real y que el recorte nuevo lo
      cierra—, no solo el rojo.
- [ ] Commit: `test(mobile): expose the meal-toggle source lock nesting hole (R1,R2)`

### (2) Commit VERDE — revertir la mutación

- [ ] Revertir **solo** el cambio de `src/app/(tabs)/food.tsx`, dejándolo byte
      a byte como en `73f14d5e`.
- [ ] `git diff 73f14d5e -- 'src/app/(tabs)/food.tsx'` → **sin salida**.
- [ ] Suite del candado: **verde**, `exit=0`, `Test Suites: 1`.
- [ ] Commit: `test(mobile): bound the meal-toggle source lock to its own opening tag (R1,R2)`

### (3) Refactor

- [ ] Sin refactor pendiente: el cambio son dos líneas. No extraer helper, no
      crear utilidad compartida, no tocar el gemelo de
      `src/screens/home/index.test.tsx` (lo tiene `#108`).

---

## R2 — sondas obligatorias de acotado (las cuatro de la ronda 1)

Sobre el árbol **ya verde**, una por una: aplicar la mutación a
`src/app/(tabs)/food.tsx`, correr la suite del candado, anotar el veredicto y
**revertir antes de la siguiente**. Ninguna queda en el árbol.

- [ ] **V1** — quitar el `style` del `meal-toggle` → se espera **ROJO** (el
      `#109 R1` entre los fallos).
- [ ] **V2** — mover la receta a un `<Pressable>` **hermano anterior** al
      `meal-toggle` → se espera **ROJO**.
- [ ] **V3** — mover la receta a un `<Pressable>` **hermano posterior** →
      se espera **ROJO**.
- [ ] **V4** — mover la receta a un `<Pressable>` **anidado dentro** →
      se espera **ROJO**. *(Esta es la que hoy da verde: es el agujero B2 y la
      razón de ser de #109.)*
- [ ] En las cuatro, comprobar que el fallo es **de la aserción del `#109 R1`**
      y no un `ReferenceError` ni un fallo de otro test (C4, cuarto punto).
- [ ] `git diff 73f14d5e -- 'src/app/(tabs)/food.tsx'` vacío al terminar la
      tanda.
- [ ] Volcar la tabla de las cuatro en
      `progress/impl_mobile-meal-toggle-source-lock-nesting.md`.

---

## R3 — sondas de no-regresión (que no aparezcan falsos rojos)

Mismo método: mutar, correr, anotar, revertir.

- [ ] **V5** — anidar un `<Pressable onPress={() => undefined}>` dentro del
      `meal-toggle` **sin** receta, dejando la receta en su sitio → se espera
      **VERDE**. Es la sonda del criterio 2 del encargo: anidar por sí solo no
      puede poner el candado rojo.
- [ ] **V6** — reformatear la receta a una sola línea
      (`style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}`) → se espera
      **VERDE** (la regex es tolerante a propósito).
- [ ] **V7** — `0.8` → `0.5` → se espera **ROJO** en el `#109 R1` y **VERDE**
      en el `it` de árbol. Esta fila es la que justifica que el candado de
      fuente **no se borre**: la pata de árbol no ve el valor de pulsado.
- [ ] `git diff 73f14d5e -- 'src/app/(tabs)/food.tsx'` vacío al terminar.
- [ ] Volcar las tres al reporte, junto a la tabla de R2.

---

## R4 — el límite queda documentado en dos sitios

Sin par rojo→verde: es un entregable de documentación y lo verifica el
`reviewer` leyendo los dos sitios.

- [ ] (1) En `src/app/(tabs)/__tests__/food.test.tsx`, **justo encima** del
      `const block = …` del `#109 R1`, un comentario que diga las tres cosas:
      **qué** es el bloque (el tag de apertura del `meal-toggle`, de `<` a
      `<`), **por qué** no se acota con `</Pressable>` (un `Pressable` anidado
      metía su `style` dentro — deuda B2 de #106/#107) y **cuál es el límite**
      (un `<` dentro del propio tag, p. ej. `disabled={a < b}`, recorta antes
      de tiempo y el candado falla hacia **rojo**, nunca hacia verde).
- [ ] (2) En `docs/conventions.md`, §Tests, una subsección corta —al nivel de
      las que ya existen para `(tabs)` y para las esperas— que nombre el
      patrón: **recortar el tag de apertura de un elemento va de `<` a `<`
      alrededor del ancla, no de `<Tag>` a `</Tag>`**; que el ancla tiene que
      vivir **dentro** del tag que se busca; que encoger es seguro y ensanchar
      no; y que el patrón ya vive en
      `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts:309-311`.
      Mencionar que queda un gemelo por migrar en
      `mobile-pet-tracker/src/screens/home/index.test.tsx:3355-3359`, **sin
      tocarlo** (`#108`).
- [ ] (3) Commit: `docs(mobile): document the opening-tag slicing pattern (R4)`

---

## R5 — cierre: cero diff de producción

- [ ] `git diff 73f14d5e -- 'mobile-pet-tracker/src/app/(tabs)/food.tsx'` →
      **sin salida**. Si imprime algo, la feature **no** está lista.
- [ ] `git diff --stat 73f14d5e -- 'mobile-pet-tracker/src/'` → solo
      `src/app/(tabs)/__tests__/food.test.tsx`.
- [ ] `bunx jest; echo "exit=$?"` → `exit=0`, **sin pipe**, y con el delta
      `+0 suites / +0 tests` contra `73f14d5e`.
- [ ] `rm -f .expo/types/router.d.ts && bunx tsc --noEmit; echo "exit=$?"` →
      `exit=0`.
- [ ] `specs/mobile-meal-toggle-source-lock-nesting/traceability.md` con sus
      dos columnas de commit rellenas y ninguna fila «pendiente».
- [ ] Reporte en `progress/impl_mobile-meal-toggle-source-lock-nesting.md` con
      las dos tablas de sondas (R2 y R3) y el contraste de la §(1) de R1.

## Lo que NO hay que tocar

- `src/i18n/catalog.ts` y `src/providers/__tests__/language-provider.test.tsx`
  — esta feature **no añade claves de copy**; el candado de longitud del
  catálogo no se toca.
- `src/__tests__/design-drift.test.ts` y `src/screens/home/index.test.tsx`
  — los tiene `#108` en vuelo.
- El `it` de árbol de `#107 R5`, y la regex de la receta.
- Ninguna dependencia nueva.
