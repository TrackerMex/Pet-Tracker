---
feature: "mobile-pet-hero-header"
status: spec_ready   # draft | spec_ready | approved
tags: [harness, spec]
---

# Tareas — [[mobile-pet-hero-header]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Orden obligatorio**: R1 → R2 → R3 → R4 → R8 (el componente, aislado) →
> R5 → R6 → R7 (las dos pantallas lo adoptan) → R9 → R10. Nada de Home ni de
> Profile antes de que el componente esté verde solo: si se toca `home.tsx`
> primero, el rojo de R1–R4 se mezcla con el de la migración de `testID` y deja
> de demostrar nada.
>
> **Commits test-primero, obligatorio** (`CHECKPOINTS.md` C4). Cada requisito
> deja **al menos dos commits**: uno con el test rojo y otro con la
> implementación que lo pone verde. Un único commit con test + implementación +
> docs incumple C4 y el reviewer lo rechaza. El mensaje sigue
> `docs/conventions.md` §Commits: `feat(mobile-pet-hero-header): <desc> (R1)`.
>
> **Ningún rojo puede fallar por `ReferenceError`** de un helper de test que
> todavía no existe (C4). El fichero de test nuevo se crea con sus mocks
> completos desde el primer commit; lo que falta es el componente, no el
> andamio.
>
> **Antes de tocar nada**: borra `mobile-pet-tracker/.expo/types/router.d.ts` si
> existe — está gitignorado y rompe el typecheck con rutas fantasma.
> Y comprueba que no hay otro `init.sh` corriendo en un worktree hermano
> (`pgrep -f init.sh`): comparten el Postgres de docker.

---

## R1 — El componente compartido existe con su API exacta

- [ ] (1) Escribir test que falla para R1 —
      `src/components/__tests__/pet-hero-header.test.tsx`,
      `describe('R1: PetHeroHeader es el único hero compartido')`: monta con
      `variant="bleed"` y con `variant="card"`, espera `testID="pet-hero"` en
      ambos, y asserta que el fuente del componente no importa `pet-switcher`
      ni nada de `src/api/` salvo el tipo.
- [ ] (2) Implementación mínima que lo pasa — crear
      `src/components/pet-hero-header.tsx` con las tres franjas de
      [[design]] §1, `PET_HERO_MEDIA_HEIGHT = 260` y
      `PET_HERO_FADE_HEIGHT = 64` exportadas.
- [ ] (3) Refactor con tests verdes.

## R2 — Foto a sangre, blobatar sin foto, blobatar si la foto falla

- [ ] (1) Escribir test que falla para R2 — dos ficheros:
      `src/components/__tests__/pet-avatar.test.tsx`,
      `describe('R2: PetAvatar acepta tamaño rectangular, cacheKey y degrada al
      fallar la foto')` (tamaño objeto sin `borderRadius`; `cacheKey` dentro de
      `source` y `source` sin él idéntico a hoy; `onError` → rama blobatar); y
      `src/components/__tests__/pet-hero-header.test.tsx`,
      `describe('R2: el hero pinta foto a sangre o blobatar')`.
- [ ] (2) Implementación mínima que lo pasa — los **tres** cambios de
      [[design]] §5 en `src/components/pet-avatar.tsx`, y el hero delegando en
      `PetAvatar` con `size={{ width: '100%', height: PET_HERO_MEDIA_HEIGHT }}`
      y `cacheKey={pet.id}`.
- [ ] (3) Refactor con tests verdes — comprobar que los tres llamantes
      existentes de `PetAvatar` (`home.tsx`, `profile/index.tsx`, `add-pet`)
      siguen verdes con `size` numérico y que el snapshot de
      `__snapshots__/pet-avatar.test.tsx.snap` no cambia.

## R3 — Contraste AA por construcción: texto sobre banda opaca

- [ ] (1) Escribir test que falla para R3 —
      `describe('R3: el texto del hero va sobre fondo opaco')` con los cuatro
      `it` de [[requirements]] R3, incluido el candado de forma sobre
      `useThemeColors(['background'])` en los dos temas.
- [ ] (2) Implementación mínima que lo pasa — `bg-background` en
      `pet-hero-caption` y `pet-hero-slot`, y las dos franjas
      `pet-hero-fade-top` / `pet-hero-fade-bottom` con
      `experimental_backgroundImage` en el prop `style`, con la parada
      transparente escrita como `${background}00` ([[design]] §2.4).
- [ ] (3) Refactor con tests verdes.

## R4 — Slot de la zona superior y safe area

- [ ] (1) Escribir test que falla para R4 —
      `describe('R4: el slot superior respeta la safe area')`: con
      `useSafeAreaInsets` mockeado a `{ top: 40, … }`, `pet-hero-slot` declara
      `paddingTop: 52`; sin `children`, `pet-hero-slot` y `pet-hero-fade-top`
      son `null`.
- [ ] (2) Implementación mínima que lo pasa.
- [ ] (3) Refactor con tests verdes.

## R8 — Skeleton dimensionado y error del detalle alcanzable

> Va antes que R5/R6 a propósito: Home necesita el hero con `pet={null}` para
> poder montar el selector durante la carga y durante el error.

- [ ] (1) Escribir test que falla para R8 —
      `describe('R8: el hero sin mascota es un skeleton dimensionado')`:
      con `pet={null}`, `pet-hero-skeleton` existe con
      `height: PET_HERO_MEDIA_HEIGHT`, `pet-hero-media` es `null`, y el slot
      sigue montado si hay `children`.
- [ ] (2) Implementación mínima que lo pasa — `Skeleton` de heroui, nunca un
      `Spinner` suelto (carta §Decisiones fijas 7).
- [ ] (3) Refactor con tests verdes.

## R5 — Home sustituye su pet-card por el hero

- [ ] (1) Escribir test que falla para R5 —
      `src/app/(tabs)/__tests__/home.test.tsx`,
      `describe('R5: Home usa el hero compartido')`: los siete sustitutos de la
      tabla de [[requirements]] R5, `queryByTestId('pet-card')` y
      `queryByTestId('pet-card-photo')` a `null`, `pet-hero-media` descendiente
      de `pet-hero` (sustituto de `home.test.tsx:310`), y el
      `contentContainerStyle` de `screen-home` igual a
      `{ gap: 16, paddingBottom: 120 }`. Los asserts viejos anclados a
      `pet-card-*` (`:244-312`) se **reescriben**, no se borran: cada conducta
      que cubrían tiene su fila en la tabla.
- [ ] (2) Implementación mínima que lo pasa — borrar el pet-card inline
      (`home.tsx:168-190`) y el `<PetSwitcher>` suelto (`:145-151`); montar el
      hero como primer hijo con el switcher dentro; reestructurar el
      `contentContainerStyle` según [[design]] §4.2, incluido el envoltorio con
      `paddingTop: insets.top + 12` de las ramas `home-loading` / `home-error` /
      `home-empty`.
- [ ] (3) Refactor con tests verdes — confirmar que `collar-*`, `summary-*`,
      `last-position-*`, `home-*` y `screen-home` siguen intactos y que
      `pet-chip-*` sigue respondiendo al `onPress`.

## R6 — Profile sustituye su `PetHero` local por el compartido

- [ ] (1) Escribir test que falla para R6 —
      `src/screens/profile/index.test.tsx`,
      `describe('R6: Profile usa el hero compartido')`: `pet-hero` presente,
      `pet-hero-media` con la foto, `profile-pet-photo` a `null`,
      `pet-hero-slot` a `null`, y `change-photo` presente y **fuera** de
      `pet-hero`. Reanclar `:364` y `:588`.
- [ ] (2) Implementación mínima que lo pasa — borrar la función local `PetHero`
      (`profile/index.tsx:62-84`) y su llamada (`:277`); montar
      `<PetHeroHeader variant="card" pet={pet} />` en su lugar. **C7**: no queda
      código huérfano ni ningún importador de lo borrado.
- [ ] (3) Refactor con tests verdes — comprobar que
      `profile/index.test.tsx:346-351` (métricas de `screen-profile`) sigue
      verde **sin tocarse**: si hubo que editarlo, la reestructuración se ha
      colado donde no debía.

## R7 — Dato destacado: paseos de hoy en Home, ninguno en Profile

- [ ] (1) Escribir test que falla para R7 —
      `src/app/(tabs)/__tests__/home.test.tsx`,
      `describe('R7: el hero pinta los paseos de hoy')`: con `walkCount: 3`,
      `pet-hero-highlight-value` da `'3'` y `pet-hero-highlight-label` la
      etiqueta traducida; con `walkCount: null`, `'—'`. En
      `profile/index.test.tsx`, `pet-hero-highlight-value` es `null`.
- [ ] (2) Implementación mínima que lo pasa — añadir `'home.walks'` a `en`
      (`'Walks'`) y a `es` (`'Paseos'`) en `src/i18n/catalog.ts`, pasar
      `highlight` desde `home.tsx` con `today.walkCount`, y registrar la clave
      en la tabla §2.3 de `specs/mobile-ui-language/design.md`.
- [ ] (3) Refactor con tests verdes — actualizar `R3_HOME` en
      `src/__tests__/ui-copy-table.ts` con **una fila más** y su
      `toHaveLength` en `src/__tests__/ui-language.test.ts` **+1** respecto a
      `303fc19` (R9b: delta, no número escrito a mano).

## R9 — Grep-clean intacto y candados actualizados por delta

> Requisito de **verificación** en el sentido de `CHECKPOINTS.md` C4: solo
> asevera propiedades de artefactos que R1–R8 ya dejaron en el árbol. Se
> declara aquí por escrito **antes del handoff** y se cierra por la **vía (b)**:
> **prueba de mutación**. No se le exige rojo previo, porque su rojo genuino es
> imposible — los candados que actualiza son ficheros que ya existen y ya pasan.

- [ ] (1) Prueba de mutación, **antes** de tocar los candados y con la
      evidencia en el reporte: plantar a propósito, **de una en una**, estas
      tres mutaciones y ver el test rojo **por su propia aserción**, no por un
      `ReferenceError`:
      - un `rounded-2xl` en `src/components/pet-hero-header.tsx`
        → `consistency-classnames.test.ts` #62 R4;
      - un hex literal (`#FFFFFF`) en la cadena del degradado
        → `design-drift.test.ts` R9, tras añadir el fichero a su lista;
      - una clase arbitraria `h-[260px]` en lugar de la constante
        → `design-drift.test.ts` C8.
      **Plantar cada mutación en el fichero nuevo, que es la zona ciega**: el
      candado enumera ficheros y el riesgo real es que no mire el que se acaba
      de crear. Una mutación que solo se prueba en un fichero ya vigilado no
      demuestra nada sobre el nuevo.
- [ ] (2) Actualizar los candados con los **deltas** de [[requirements]] R9b,
      sustituyendo cada número por el que devuelva el propio grep:
      `CONTINUOUS_CORNER` (profile −1, fichero nuevo +1, total sin cambio),
      `bg-accent-soft` (−1), la fila del skeleton de Home en #62 R2, y la
      entrada nueva en la lista de R9 de `design-drift.test.ts`.
- [ ] (3) `./init.sh` verde de punta a punta y suite móvil completa verde sin
      debilitar ni eliminar ningún assert de conducta.

## R10 — Enmiendas a specs aprobadas y a la carta de UI

- [ ] (1) Escribir test que falla para R10 —
      `src/__tests__/hero-header-amendments.test.ts`,
      `describe('R10: las specs enmendadas por #67 llevan su bloque')`: lee el
      bloque canónico de `specs/mobile-pet-hero-header/design.md` §9 (misma
      técnica que `ui-language.test.ts:166-183`) y comprueba que aparece en
      cada fichero de la tabla A1–A9 con su línea de firma.
- [ ] (2) Implementación mínima que lo pasa — insertar el bloque en los seis
      ficheros de la tabla ([[design]] §8, bloque "Modificados —
      documentación"), **con la casilla sin marcar**.
- [ ] (3) Refactor con tests verdes. **PARA aquí**: la casilla la marca el
      humano, y la corrección A10 de `feature_list.json` la aplica el humano
      con el texto de [[design]] §10. Ningún agente firma ni edita esas dos
      cosas.

---

## Cierre

- [ ] `traceability.md` sin ninguna fila "pendiente" (C5).
- [ ] `progress/impl_mobile-pet-hero-header.md` escrito mientras se trabaja, no
      al final.
- [ ] `./init.sh` verde.
- [ ] **PARA antes del gate humano.** El smoke en dev build de Android —con
      foto y sin foto, en tema claro y oscuro, las cuatro combinaciones— **no
      es delegable a IA** y es la condición para que la feature pase a `done`.
      El guion está al final de [[requirements]] §Aprobación.
