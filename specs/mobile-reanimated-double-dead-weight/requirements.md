---
feature: "mobile-reanimated-double-dead-weight"
status: approved         # draft | spec_ready | approved  ← Gate 1 aprobado en Notion el 2026-09-22T18:43:55Z
tags: [harness, spec, mobile, tests]
---

# Requisitos — [[mobile-reanimated-double-dead-weight]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[tasks]] para el orden TDD.
> Feature **#110**, deuda **B3** de `progress/review_mobile-meals-bar-motion.md`.

**Esta feature no toca código de producción.** Es una feature de *fidelidad de
dobles de test*. Todo lo que cambia vive en ficheros de test y en `docs/`.

---

## Estado medido (base `e4c9ea99`, 2026-09-22)

Todo lo de esta tabla lo midió el `spec_author` sobre el árbol, no viene de
terceros. **Re-mídelo antes de empezar**: si algo no coincide, para y avisa.

| Hecho | Cómo se midió | Resultado |
|---|---|---|
| El doble de `heroui-native` vive en `src/screens/home/index.test.tsx:124-141` (más la línea en blanco `:142`) | `grep -n "jest.mock("` | confirmado |
| `default: { ...actual.default, View },` vive en `:154` | `grep -n` | confirmado |
| `const { View } = jest.requireActual(...)` de `:147-149` **solo** lo usa `:154` | `awk` sobre `143-162` | confirmado |
| La suite del fichero, hoy | `bunx jest --runTestsByPath src/screens/home/index.test.tsx`, sin pipe | exit 0, **1 suite / 138 tests** |
| Quitar las tres piezas | misma corrida sobre una copia | exit 0, **138/138 verde** |
| El test de **#62 R8** al quitar el doble | ídem | **NO se pone rojo** |
| `src/__tests__/design-drift.test.ts` con el borrado aplicado | `--runTestsByPath` | exit 0, **41/41 verde** |
| El huérfano `View` sin borrar | `bunx eslint` | **warning**, no error (`no-unused-vars`); `tsc --noEmit` exit 0 |

### Qué prueba —y qué NO prueba— que #62 R8 siga verde

El `it` de #62 R8 (`:1319-1322`) asevera exactamente:

```
expect(screen.getByTestId('home-loading').props.className).toContain(
  'h-12 w-full rounded-card',
);
```

Se midió si sobrevive a una mutación de **producción** (`src/screens/home/index.tsx:372`,
`h-12 w-full rounded-card` → `h-4 w-1/2 rounded-full`):

| Escenario | Resultado |
|---|---|
| Con el doble puesto (hoy) | **1 rojo** / 137 verdes — justo el `it` de #62 R8 |
| Con el doble quitado | **1 rojo** / 137 verdes — el mismo |

**Conclusión honesta: el doble no estaba cegando esta aserción.** El candado de
#62 R8 vigila igual de bien en los dos mundos, porque el falso y el real
propagan `className` al nodo host y porque la aserción usa `toContain`, no
`toBe`. Si hubiera usado `toBe` se habría puesto roja al quitar el doble, porque
el real **antepone** su clase base.

Lo que el doble sí borraba, medido volcando el nodo `home-loading`:

| | `className` | `style` | props de animación |
|---|---|---|---|
| **Skeleton falso** (hoy) | `h-12 w-full rounded-card` | `[null]` | ninguna |
| **Skeleton real** | `skeleton__root h-12 w-full rounded-card` | `[{"borderCurve":"continuous"},null]` | `entering`, `exiting`, `onLayout`, `collapsable`, `jestAnimatedStyle`, `jestAnimatedProps` |

Es decir: la pérdida de fidelidad es **real pero acotada**. El doble no ocultaba
un fallo de #62 R8; ocultaba el componente entero de terceros —su clase base, su
`borderCurve` y toda su superficie de animación— en los 138 tests del fichero.
Un cambio de `heroui-native` que dejara de propagar `className` habría pasado
inadvertido. Eso es lo que #110 recupera.

`skeleton__root` no es un invento: es la clase base del componente, en
`node_modules/heroui-native/src/components/skeleton/skeleton.styles.ts:38`
(`heroui-native@1.0.8`, versión exacta fijada en `package.json`).

---

## Requisitos funcionales

- **R1**: WHEN la suite de `mobile-pet-tracker/src/screens/home/index.test.tsx`
  renderiza la pantalla home en estado de carga, THE SYSTEM SHALL montar en el
  nodo `home-loading` el componente `Skeleton` **real** de `heroui-native`,
  observable porque su `className` contiene la clase base `skeleton__root`
  además de las clases que pone la pantalla.

- **R2**: WHEN la suite de `mobile-pet-tracker/src/screens/home/index.test.tsx`
  se ejecuta, THE SYSTEM SHALL exponer en el export por defecto de
  `react-native-reanimated` un `View` que **no** sea el `View` de
  `react-native`, es decir el `Animated.View` real de Reanimated.

- **R3** *(requisito de verificación — ver §Vías de C4)*: WHILE se cumplen R1 y
  R2, THE SYSTEM SHALL conservar el bloque `describe` de **#62 R8**
  (`index.test.tsx:1302-1323`) **carácter por carácter sin cambios**, y ese
  bloque SHALL seguir poniéndose rojo cuando se mute el `className` del
  `Skeleton` de `src/screens/home/index.tsx:372`.

- **R4** *(requisito de verificación)*: WHEN se cierra la feature, THE SYSTEM
  SHALL dejar registrado en `docs/conventions.md` §Tests el inventario de
  gemelos del doble medido en [[design]] §Gemelos, nombrando para cada uno si es
  el mismo problema, si es legítimo y de quién es.

---

## Restricciones duras

Estas no son requisitos con test propio; son condiciones de aceptación que el
`reviewer` comprueba mecánicamente.

1. **Cero cambio de producción.** Al cerrar,
   `git diff --name-only e4c9ea99..HEAD` NO debe contener ningún fichero bajo
   `mobile-pet-tracker/src/` que no termine en `.test.tsx` / `.test.ts`.
   En particular `src/screens/home/index.tsx` debe quedar **idéntico**.
   La mutación de R3 se aplica, se mide y **se revierte**; no se versiona.
   Si durante el trabajo parece necesario tocar producción: **para y devuelve
   el trabajo**, no improvises.

2. **Zonas prohibidas de `index.test.tsx`** (las trabaja otra sesión en paralelo):
   - `:3790` y `:3835` — los literales partidos `'#' + '106 R2…'` / `'#' + '106 R3…'`. Son de **#108**.
   - `:3350-3363` — el candado de `reminders-see-all` que recorta la fuente.
     La atribución está en disputa (ver [[design]] §Zonas prohibidas); sea de
     quien sea, **no se toca**.

   El trabajo de #110 vive en la **cabecera de dobles** (`:124-154`) y en
   **dos describes nuevos al final del fichero**. Nada más.

3. **Ninguna clave de copy nueva.** Esta feature **no** añade, quita ni renombra
   claves de i18n. No se toca `src/i18n/catalog.ts` ni
   `src/providers/language-provider.test.tsx`, y el candado de longitud del
   catálogo **no cambia**.

4. **Ningún título de test de esta feature contiene `#110`.** Escribir `#110`
   literalmente en `index.test.tsx` dispara los cinco guards de
   `design-drift.test.ts` (medido: la regex `/#[\da-f]{3,8}\b/i` casa con
   `#110`). Ver [[design]] §Cómo se nombran los describes.

---

## Vías de C4 (declarado antes del handoff, como exige `CHECKPOINTS.md` C4)

- **R1 y R2 son requisitos normales con rojo real.** Sus tests se escriben
  **antes** del borrado y fallan de verdad por su propia aserción:
  - R1 rojo: hoy el `className` del nodo es `h-12 w-full rounded-card`, sin
    `skeleton__root`. **Medido.**
  - R2 rojo: hoy `Animated.View === require('react-native').View` es `true`.
    **Medido.**

  Ninguno de los dos rojos es un `ReferenceError` ni una mutación de un doble:
  son la ausencia real de la propiedad que el requisito pide.

- **R3 y R4 son requisitos de verificación** (solo aseveran una propiedad de
  artefactos que R1/R2 ya dejaron en el árbol). Se cierran por la **vía (b)**:
  - R3 por **mutación**: mutar `index.tsx:372`, ver el rojo **por la aserción de
    #62 R8**, revertir, y dejar la evidencia en el reporte. Más
    `git diff e4c9ea99..HEAD -- <fichero>` acotado al rango de #62 R8, vacío.
  - R4 por **grep** sobre `docs/conventions.md`.

---

## Qué pasa si el test de #62 R8 se pone rojo

Está **medido que hoy no se pone rojo** (tabla de arriba). Esto es el plan por
si el árbol cambia bajo los pies del implementador.

1. **Ese rojo es el hallazgo de la feature, no un obstáculo.**
2. **Prohibido restaurarlo con el doble.** Volver a poner el
   `jest.mock('heroui-native')` —entero o recortado a `Skeleton`— devuelve el
   fichero al estado exacto que #110 viene a corregir. No es una salida.
3. **Prohibido reescribir la aserción de #62 R8.** #62 es una feature `done` con
   spec firmada; `CHECKPOINTS.md` C6 dice que ningún requisito se modifica
   después de su aprobación sin volver a pasar por el gate. Ajustar su `it`
   "para que pase" sería justo eso, hecho por la puerta de atrás y por una
   feature que no es su dueña.
4. **Entonces: PARA y devuelve el trabajo.** Deja R1 y R2 sin cerrar, escribe en
   `progress/impl_mobile-reanimated-double-dead-weight.md` el output literal del
   rojo (mensaje de jest completo, `expected` y `received`), y di explícitamente
   que hace falta un gate humano para decidir si se enmienda #62 R8. No lo
   decidas tú, no lo decida Codex.

   **Por qué parar y no ajustar**: si #62 R8 se pone rojo contra el `Skeleton`
   real, lo que eso significa es que **la pantalla de producción no cumple lo
   que #62 R8 creía estar exigiendo**. Eso es un posible defecto de producción,
   y esta feature tiene prohibido tocar producción (Restricción 1). Una feature
   de higiene de tests no puede absorber el arreglo de un defecto funcional de
   otra feature: son dos gates distintos.

---

## Fuera de alcance

Cada viñeta está clasificada: **(D)** delimitación de esta feature, **(F)**
feature futura candidata, **(A)** ajeno con dueño.

- **(A)** `src/components/__tests__/pet-hero-header.test.tsx:71` — tiene el
  **mismo** `default: { ...actual.default, View }` y es **también peso muerto**
  (medido: quitarlo deja 36/36 verde). No se toca aquí: ese fichero es de otra
  feature y su comentario `:70` habría que reescribirlo. Queda registrado por R4.
- **(A)** `src/components/__tests__/pet-hero-header.test.tsx:44-58` — su
  `jest.mock('heroui-native')` **sí es load-bearing** (medido: quitarlo pone
  **4 tests rojos**). No es el mismo problema que B3 y **no** se toca.
- **(D)** Migrar el candado de `reminders-see-all` (`:3350-3363`) al patrón de
  recorte de tag de apertura. Es de otra feature (#108 según
  `docs/conventions.md` §Tests).
- **(D)** Arreglar el guard de hex de `design-drift.test.ts` para que no muerda
  R-ids de tres cifras. Es **#108**, con spec propia ya escrita.
- **(D)** Quitar `withRepeat` / `withSequence` / `withSpring` del doble de
  Reanimated: **no** son peso muerto (el reviewer midió 16 rojos al quitarlos).
- **(F)** Revisar si el doble de `heroui-native` de `pet-hero-header.test.tsx`
  debería dejar de ser load-bearing —es decir, si esos 4 tests deberían poder
  correr contra el `Skeleton` real—. Es el mismo problema de fidelidad que B3
  pero con coste real; merece su propia entrada.
- **(D)** Cualquier cambio en `src/screens/home/index.tsx` u otro fichero de
  producción.

---

## Aprobación

> `main` está protegida: la aprobación se firma en la branch con un commit del
> humano, y el `leader` pasa el frontmatter a `approved`.

### Qué firmas en el Gate 1

Además de los requisitos, **una decisión que no es técnica y que nadie más
puede autorizar**:

**Los títulos de los `describe` se apartan de la forma canónica de
`docs/conventions.md` §Tests.** En vez de `#110 R1: …` llevan
`R1 (mobile-reanimated-double-dead-weight): …`, sin `#`.

El motivo está medido en [[design]] §El guard de hex: el literal `#110` casa
con `/#[\da-f]{3,8}\b/i` —`1`, `1` y `0` son dígitos hex— y **pondría rojos
los cinco guards** de `design-drift.test.ts` que enumeran este fichero.

Las alternativas se descartaron por escrito: partir el literal (`'#' + '110…'`)
es justo lo que **#108 está retirando**, y esperar a que #108 mergee acopla
esta feature a otra que todavía no ha tocado código. La forma elegida tiene
**precedente exacto** en el repo: `src/screens/add-pet/index.test.tsx:392`,
`describe('R1 (mobile-jest-mock-hygiene): …')`.

Es una desviación **deliberada, medida y local a este fichero** mientras el
guard siga como está. Firmarla aquí es lo que la convierte en decisión tomada
en vez de en atajo del implementador.

- [X] **Gate 1 — Aprobación de la spec** por humano (fecha: 2026-09-22)
      ← obligatorio antes del handoff a Codex. Al marcarlo firmas también la
      desviación de arriba.

> **Cómo se aprobó el Gate 1.** El humano puso `Estado del gate` = **Aprobado**
> en la página de Notion `3e36115a-9b27-8127-96d3-f551d33a07b8`
> (`Panel de Proyectos — Harness SDD / Specs`), espejada del commit
> `fbf2557b`. El `leader` lo verificó leyéndola: propiedad en «Aprobado»,
> `page_last_edited_at` = **2026-09-22T18:43:55.473Z**, y marcó esta casilla en
> su nombre según `.claude/agents/leader.md` §Gate de aprobación vía Notion.
>
> La evidencia es **la propiedad y su marca de tiempo, no la autoría**: la API
> no devuelve la cuenta que hizo el cambio. El Gate 2, si llegara a hacer
> falta, puede firmarse por la misma vía o en el repo.

- [ ] **Gate 2 — Decisión sobre #62 R8** (no aplica; fecha: 2026-09-22)
      ← **solo se marca si** el implementador paró por el escenario de
      §Qué pasa si el test de #62 R8 se pone rojo. Si no paró, escribir
      «no aplica» y la fecha. Esta casilla es independiente del Gate 1: es el
      gate que autoriza (o no) tocar un requisito de una feature firmada.
