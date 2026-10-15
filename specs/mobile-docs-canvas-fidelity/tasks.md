---
feature: "mobile-docs-canvas-fidelity"
status: approved
tags: [mobile, ui, spec]
---

# #175 mobile-docs-canvas-fidelity — Tareas

> TDD por requisito: (1) test rojo con su commit propio, (2) implementación
> mínima, (3) refactor. **Un commit de test rojo antes de cada commit de
> implementación** (C4 de `CHECKPOINTS.md`). Comandos desde
> `mobile-pet-tracker/` salvo que digan otra cosa. Nunca `npx` ni `npm`:
> siempre `bunx` y `bun`.
>
> Orden pensado para que ningún test asevere un nodo que su propia tarea no
> crea: T6 envuelve las filas en `HomeEntrance` y renombra `doc-doc-1` →
> `docs-entry-doc-1` en los órdenes heredados; T7 los reordena; T8 inserta
> `docs-filters` en ellos.

## Recuento de `it` en `src/screens/docs/index.test.tsx`

Medido con `grep -cE "^\s*it(\.each\(|\()" src/screens/docs/index.test.tsx`.
La base es la de H0 (40 en `fb5b209f`). Cada fila suma sobre la anterior.

| Tras | `it` añadidos | Total |
|---|---|---|
| H0 | — | base H0 (40) |
| T4 (R4) | 1 | base + 1 |
| T5 (R5) | 2 | base + 3 |
| T6 (R6) | 5 (`it.each` de huecos, nombre, fechas `es`, fechas `en`, entradas) | base + 8 |
| T7 (R7) | 2 (estructura y textos, opacidad al pulsar) | base + 10 |
| T8 (R8) | 4 (cinco categorías, artboard sin ámbar, `it.each` por chip, `it.each` de ausencia) | base + 14 |
| T9 (R9) | 5 (`it.each` de huecos, `it.each` de sinónimos, desconocidos, «Todos», reinicio) | base + 19 |

Los demás ficheros: `global-css.test.ts` +2 (T1), `design-drift.test.ts` +7
(T2) y +5 (T10), `language-provider.test.tsx` +1 (T3). En
`consistency-classnames.test.ts` y `ui-language.test.ts` solo cambian
valores, no se añaden `it`.

---

## T0 — H0: base y dependencias

- [ ] T0.1 Comprobar que #173 está en `main` y que la rama parte de
  `origin/main` actualizado (`git fetch` y `git merge-base --is-ancestor origin/main HEAD`).
- [ ] T0.2 Medir la tabla de base B1–B29 y la tabla §Dependencias de #173
  (D1–D8) de `requirements.md`, y escribir los valores en
  `progress/impl_mobile-docs-canvas-fidelity.md`. Si una D no da su valor
  esperado, **parar** y avisar al leader. Medir también los `it` de cada
  fichero de test tocado y la suma de `englishKeys`, corriendo
  `bunx jest src/providers/__tests__/language-provider.test.tsx`.
- [ ] T0.3 Añadir a `src/screens/docs/index.test.tsx` los tres dobles de
  design.md §4 (`HomeEntrance`, `reicon-react-native`, `useThemeColors`).
  Correr `bunx jest src/screens/docs/index.test.tsx`: tiene que dar verde
  con base H0 `it`. Commit: `test(docs): dobles de entrada, iconos y colores (#175 R6)`.
- [ ] T0.4 Si `main` ya trae la sección de la enmienda (B26 = 1) o alguno
  de los tokens de R1, anotarlo en el informe y omitir esa edición en T1 o
  T2. El test se escribe igual.

## T1 — R1 tokens

- [ ] (1) Rojo: `describe('#175 R1: tokens de Documentos')` en
  `src/theme/__tests__/global-css.test.ts`, con 2 `it` (`toMatchObject` y
  una sola declaración de cada token nuevo). Falla por las cinco claves que
  faltan. Commit `test(theme): tokens del artboard de Documentos (#175 R1)`.
- [ ] (2) Verde: las cinco líneas de R1 en `src/theme/global.css`, en las
  posiciones de su tabla. Commit `feat(theme): tokens del artboard de Documentos (#175 R1)`.
- [ ] (3) Refactor: nada previsto.

## T2 — R2 enmienda de la carta

- [ ] (1) Rojo: `describe('#175 R2: enmienda de fidelidad al canvas')` en
  `src/__tests__/design-drift.test.ts`, con un `it` por cada uno de los 7
  puntos del test de R2. Commit `test(docs-charter): enmienda de fidelidad al canvas (#175 R2)`.
- [ ] (2) Verde: en `docs/ui-guidelines.md`, la sección literal de
  §Texto de la enmienda R2 al final, las dos sustituciones (B18, B19), la
  extensión de la línea de tamaños, la línea de tracking y la frase de §12.
  Commit `docs(ui-guidelines): enmienda de fidelidad al canvas (#175 R2)`.
- [ ] (3) Refactor: comprobar que siguen verdes los `it` de
  `consistency-classnames` que leen §12 y §13 (`#62 R4`, `#166 R4`), y los
  que leen la carta en `hero-header-amendments.test.ts` y en
  `src/screens/welcome/index.test.tsx`.

## T3 — R3 copy

- [ ] (1) Rojo: `describe('#175 R3: claves de Documentos del canvas')` en
  `src/providers/__tests__/language-provider.test.tsx`, y la línea
  `+ 7, // #175 R3` en `englishKeys`. Commit `test(i18n): claves de Documentos del canvas (#175 R3)`.
- [ ] (2) Verde: 7 claves × 2 idiomas en `src/i18n/catalog.ts` y la
  sección §2.<N> en `specs/mobile-ui-language/design.md`. Ancla: B15 34 → 48.
  Commit `feat(i18n): claves de Documentos del canvas (#175 R3)`.
- [ ] (3) Refactor: `bunx jest src/__tests__/ui-language.test.ts` en verde
  (iguales claves en `es` y `en`). Las claves aún no tienen uso, y ningún
  candado exige que lo tengan.

## T4 — R4 marco y esqueleto

- [ ] (1) Rojo: Δ4 en `'usa solo el inset inferior del dispositivo'` y
  `describe('#175 R4: esqueleto del tamaño de la fila')` (1 `it`). Commit
  `test(docs): marco y esqueleto del artboard (#175 R4)`.
- [ ] (2) Verde: `contentContainerStyle` y `docs-list-skeleton` de R4.
  Anclas: `paddingHorizontal: 20,` y `gap: 14,` dan 1; `padding: 24,` y
  `gap: 16,` dan 0. Commit `feat(docs): marco y esqueleto del artboard (#175 R4)`.
- [ ] (3) Refactor: nada previsto.

## T5 — R5 cabecera

- [ ] (1) Rojo: `describe('#175 R5: cabecera del artboard')` (2 `it`). El
  de `_layout.tsx` nace verde. Se deja así, y el informe lo nombra como
  candado de regresión. Commit `test(docs): cabecera del artboard (#175 R5)`.
- [ ] (2) Verde: el `View` de la cabecera sin `className`, más el eyebrow y
  el título de R5. Ancla: `tracking-widest` → 0. Commit
  `feat(docs): cabecera del artboard (#175 R5)`.
- [ ] (3) Refactor: nada previsto.

## T6 — R6 fila

- [ ] (1) Rojo: `describe('#175 R6: fila del artboard')` (5 `it`), más:
  - Δ1 (fecha y `within`), Δ2, Δ3 y Δ10;
  - en Δ5–Δ9, **solo** el renombrado `'doc-doc-1'` → `'docs-entry-doc-1'`
    en los arrays de `docsChildren()`, sin cambiar el orden.

  Commit `test(docs): fila del artboard (#175 R6)`.
- [ ] (2) Verde: `DocumentRow` según design.md §3.3, `INK_TOKEN` y el
  `HomeEntrance` que envuelve cada fila. Anclas: `📄` → 0 en
  `src/screens/docs/index.tsx` y en el test; `style={CONTINUOUS_CORNER}`
  sigue en 1. El import de reicon en este paso es
  `{ ChevronRight, FileText }`. Commit `feat(docs): fila del artboard (#175 R6)`.
- [ ] (3) Refactor: nada previsto.

## T7 — R7 zona de subida y orden

- [ ] (1) Rojo, todo en un commit:
  - `describe('#175 R7: zona de subida del artboard')` (2 `it`);
  - Δ5 sin `'docs-filters'`: orden `['View', 'docs-entry-doc-1', 'docs-upload']`, el texto con `within` y las clases;
  - Δ6–Δ9 con el orden nuevo, sin `'docs-filters'`;
  - Δ11, Δ12 y Δ13 en `src/__tests__/consistency-classnames.test.ts`;
  - la fila `docs.uploadHint` en `src/__tests__/ui-copy-table.ts` y `+ 1 // #175 R7` en Δ15.

  Commit `test(docs): zona de subida y orden del artboard (#175 R7)`.
- [ ] (2) Verde: la zona `Pressable`, el icono `Upload` en el import de
  reicon, y el traslado de la zona, el formulario y `docs-action-error` al
  final (design.md §3.4). Anclas: B7 2 → 1, y las tres anclas de cierre de
  la sección de `consistency-classnames` de §Deltas. Commit
  `feat(docs): zona de subida y orden del artboard (#175 R7)`.
- [ ] (3) Refactor: nada previsto.

## T8 — R8 chips (composición)

- [ ] (1) Rojo, todo en un commit:
  - `describe('#175 R8: chips de filtro')` (4 `it`);
  - en Δ5–Δ9, insertar `'docs-filters'` justo antes de `'docs-entry-doc-1'`
    en cada array con documentos; los arrays sin documentos no cambian;
  - 6 filas en `ui-copy-table.ts` y `+ 6 // #175 R8` en Δ15.

  Commit `test(docs): chips de filtro (#175 R8)`.
- [ ] (2) Verde: `FILTER_SLOTS`, `presentSlots` y los chips con el filtro
  fijo en `'all'`. El estado todavía no cambia al pulsar. Commit
  `feat(docs): chips de filtro (#175 R8)`.
- [ ] (3) Refactor: comprobar con un `grep` que ningún testID nuevo empieza
  por `doc-`:
  `grep -oE 'testID=[{"\x60]+doc-[a-z$]' src/screens/docs/index.tsx` saca solo
  ``testID={`doc-$`` (la fila).

## T9 — R9 filtro

- [ ] (1) Rojo: `describe('#175 R9: filtrar por categoría')` (5 `it`). El
  reinicio usa los fixtures de `'sube el PDF en orden con los cuatro campos recortados'`
  (`mockListPetDocs.mockResolvedValueOnce` ×2). Commit
  `test(docs): filtrar por categoría (#175 R9)`.
- [ ] (2) Verde: `useState` de `filter`, `visibleDocs`, `onPress` de cada
  chip, `index` sobre `visibleDocs` y `setFilter('all')` en el camino
  correcto de `submitDocument`. Commit `feat(docs): filtrar por categoría (#175 R9)`.
- [ ] (3) Refactor: nada previsto.

## T10 — R10 candados de deriva

- [ ] (1) Test: `describe('#175 R10: Documentos sin deriva')` en
  `src/__tests__/design-drift.test.ts` (5 `it`). Tras T6–T9 nacen verdes.
  Commit `test(design-drift): Documentos sin deriva (#175 R10)`.
- [ ] (2) Sondas, sin commitear. Plantar una mutación por guarda en
  `src/screens/docs/index.tsx` y anotar en el informe el `it` que se pone
  rojo:

  | Sonda | Mutación | Rojo esperado |
  |---|---|---|
  | S1 | añadir `{'📄'}` dentro de la zona de subida | el `it` de dependencias vetadas y emoji |
  | S2 | añadir `Bell` al import de reicon | el `it` de iconos |
  | S3 | `rounded-xl` → `rounded-2xl` en el mosaico | el `it` de radios |
  | S4 | `text-muted` → `text-accent` en la pista | el `it` de `text-accent` |
  | S5 | `bg-surface-secondary` → `bg-[#F0FBF6]` en el círculo | el `it` de hex y corchetes |

  Cada sonda puede tumbar además `it` de `src/screens/docs/index.test.tsx`
  que asevera clases exactas. Se anota cuántos, pero no se corre ese
  fichero en la sonda: basta con `bunx jest src/__tests__/design-drift.test.ts -t '#175 R10'`.
  Revertir con `git checkout HEAD -- src/screens/docs/index.tsx`, y después
  comprobar que `git diff --quiet -- src/screens/docs/index.tsx` y
  `git diff --cached --quiet -- src/screens/docs/index.tsx` salen 0.

## T11 — Cierre

- [ ] T11.1 Comprobar todas las anclas de cierre de §Deltas de
  `requirements.md`.
- [ ] T11.2 `bunx tsc --noEmit`, `bunx prettier --check` sobre los ficheros
  tocados, y `bunx expo lint --no-cache > <log> 2>&1`, seguido de
  `! grep -qF 'Failed to run' <log>`. `expo lint` sale 0 aunque lo mate
  SIGKILL.
- [ ] T11.3 Suite móvil completa con `--testTimeout=30000`, después de
  esperar a que no quede otro jest en marcha en el VPS. El recuento de `it`
  de `src/screens/docs/index.test.tsx` es base H0 + 19.
- [ ] T11.4 Rellenar `traceability.md` (test, commit rojo y commit verde por
  R-id) y `progress/impl_mobile-docs-canvas-fidelity.md`.
- [ ] T11.5 R11 lo hace el humano en el dev build de Android, y lo firma en
  `traceability.md` §Prueba de humo R11. Codex no lo marca.
