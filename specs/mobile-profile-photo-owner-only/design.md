---
feature: "mobile-profile-photo-owner-only"
status: draft        # draft | approved
tags: [mobile, roles, profile, spec]
---

# Diseño — [[mobile-profile-photo-owner-only]] (#235)

> Ver [[requirements]] para los requisitos que este diseño implementa,
> [[../../docs/architecture|architecture]] para las reglas de capas y
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI móvil. Todas
> las rutas son relativas a `mobile-pet-tracker/` salvo que se diga otra cosa.

## Deriva verificada

Contrastado contra el árbol de `origin/dev` (f05016d3), no contra el plan:

| Premisa del plan | Resultado |
|---|---|
| `change-photo` no mira el rol | Cierta. `grep -cF "isOwner" src/screens/profile/index.tsx` = 0 y `grep -cF "myRole" src/screens/profile/index.tsx` = 0. El botón cuelga de `{pet ? (` justo antes de `<BubblePop testID="profile-change-photo-pop" …>`. |
| El backend responde 403 a family | Cierta. `backend-pet-tracker/src/modules/media/infrastructure/media.controller.ts`: `@RequirePetRole('owner')` sobre la ruta. Vale también para `walker` y `vet`. |
| La app dice «No se pudo subir la foto» | Cierta. `requestPhotoUploadUrl` mapea 403 a `{ kind: 'forbidden' }`; `handleChangePhoto` pinta `t('profile.couldNotUploadPhoto')` para todo `kind !== 'ok'`. |
| #216 decide el rol con un `isOwner` local | Cierta. Cada pantalla calcula `const isOwner = … myRole === 'owner'` sin hook compartido (`docs`, `geofences`, `meal-schedule`, `pairing`, `reminders`, `weight-log`, `home`). |
| No está hecho ya | Cierta. Ningún test de `src/screens/profile/index.test.tsx` usa un `myRole` distinto de `'owner'`. |

No hay deriva: la feature procede.

## Decisiones técnicas

- **Un booleano `isOwner` local, sin hook nuevo** (R1–R3). Es el patrón de
  #216 ([[../mobile-role-aware-actions/design|su design.md]], «Un booleano
  `isOwner` por pantalla»). Un `useIsOwner` esconde la bifurcación de fuentes
  (lista o detalle) que cada pantalla ya resuelve distinto.
- **Forma literal, sin variantes** (R1, R3). En
  `src/screens/profile/index.tsx`, `ProfileScreen`:
  - justo debajo de
    `const pet = detail.data?.kind === 'ok' ? detail.data.pet : null;` va
    `const isOwner = pet?.myRole === 'owner';`;
  - la condición que envuelve al `BubblePop` pasa de `{pet ? (` a
    `{isOwner ? (`. El `BubblePop`, el `Pressable` `change-photo`, sus clases,
    su `style`, su `onPress` y el glifo `Camera` no cambian ni un carácter;
  - el `else` es `) : null}`, como hoy.
  - El diff de producción son dos líneas añadidas y una quitada (anclado en
    R3).
- **Por qué el detalle y no la lista** (R3). Perfil ya tiene `detail`
  (`petKeys.detail(selectedPetId ?? '')`) y el héroe, el nombre y las chips
  salen de él: la cámara actúa sobre esa misma mascota. Leer la lista añadiría
  una segunda fuente que puede ir por detrás del detalle y que obligaría a
  esperar a dos consultas. `PetProfile.myRole` ya viaja en el detalle
  (`src/api/types.ts`). #216 usa la lista en Inicio y Recordatorios porque
  esas pantallas no consultan el detalle antes de pintar la acción; Perfil sí.
- **Cargando, error o sin red = oculto** (R2). `pet` es `null` en esos casos y
  `null?.myRole === 'owner'` es `false`. No hace falta una rama más. Ocultar
  durante la carga evita una cámara que aparece y desaparece. Hoy ya se
  cumplía por `{pet ? (`; la condición nueva lo conserva.
- **Se desmonta, no se oculta con estilo** (R1). `display: 'none'` o
  `opacity: 0` dejarían el botón en el árbol para el lector de pantalla y para
  los tests. Por eso los `queryBy` de R1 y R3 llevan
  `includeHiddenElements: true` (M9).
- **`BubblePop` y la animación de entrada** no cambian. El dueño la ve igual; un
  no dueño no monta el componente y no corre su efecto.
- **Sin copy nuevo.** No hay texto de sustitución: la acción se quita sin dejar
  hueco ni aviso, como `ZonasSoloLectura` de #216 (`specs/mobile-role-aware-actions/canvas/`).
  Por eso no hay gate G1.

## Copy

Ninguno. `profile.changePhoto` y `profile.couldNotUploadPhoto` siguen en
`src/i18n/catalog.ts` con su uso real (el dueño los ve). La tabla
`src/__tests__/ui-copy-table.ts` y `SCREEN_FILES` no cambian.

## Guardas que no se mueven

| Guarda | Qué cuenta | Efecto de #235 |
|---|---|---|
| `src/__tests__/profile-photo-hero-canvas.test.ts` filas 7 a 10 | literales `absolute bottom-24 right-5`, `size-11 items-center justify-center rounded-full border-3 border-background bg-accent`, `strokeWidth={2.4}`, `chunkyLip.primary` en `profile/index.tsx` | Sin cambio: el botón se envuelve, no se reescribe. |
| `src/__tests__/design-drift.test.ts` `screenSignOutCalls` | `signOut(` en `screens/profile/index.tsx` = 2 | Sin cambio. |
| `src/__tests__/design-drift.test.ts` `HEX_LITERAL` (featureFiles de Perfil, incluido su test) | `#` seguido de 3 a 8 hex | Todo `#235` en código o test va seguido de ` R<n>`. Un `// #235` suelto tumba la guarda. |
| `src/__tests__/profile-canvas-fidelity.test.ts` | escapes de estilo en `profile/index.tsx` | Sin cambio: no se añade estilo. |
| `src/__tests__/consistency-classnames.test.ts` | inventarios de clases por fichero | Sin cambio: no se añade ni se quita ningún literal de clase. |

Los selectores por prefijo no atrapan ningún testID nuevo: #235 no añade
ninguno.

## Archivos afectados

Solo la capa de presentación móvil. No hay cambios de dominio, aplicación ni
backend.

- `src/screens/profile/index.tsx`: `isOwner` y la condición del botón de
  cámara (R1–R3).
- `src/screens/profile/index.test.tsx`: tres `describe` nuevos al final del
  fichero, sin tocar ninguno existente (R1, R3; R2 y R4 por tests ya
  existentes).

## Batería de mutaciones

Cada candado de [[requirements]] se prueba contra una mutación plantada en
`src/screens/profile/index.tsx`. La tabla dice qué `it` debe ponerse rojo.
«Verificado» significa que las anclas de grep se midieron sobre una copia con
la mutación aplicada y discriminan (no se ejecutó jest: el `spec_author` no
escribe código; el implementer ejecuta la batería en la tarea de cierre).

| M | Mutación sobre el código final | Debe ponerse rojo | Ancla que la detecta (valor con la mutación) |
|---|---|---|---|
| M1 | Volver la condición a `{pet ? (` (la declaración queda) | `#235 R1` filas `family`, `walker`, `vet`; `#235 R3` Test A; `#235 R3` Test B fila `['owner','family',false]` | condición posicional = 0; numstat `1\t0` |
| M2 | `const isOwner = pet?.myRole !== 'family';` | `#235 R1` filas `walker`, `vet`; `#196 R4` filas `detalle pendiente` y `error de detalle` (R2) | `grep -cF "const isOwner = pet?.myRole === 'owner';"` = 0 |
| M3 | `const isOwner = pet?.myRole === 'owner' \|\| pet?.myRole === 'family';` | `#235 R1` fila `family` | declaración = 0 |
| M4 | `const isOwner = pet?.myRole !== 'owner';` | `#235 R1` fila `owner`; filas de R2 (con `pet` nulo da `true`) | declaración = 0 |
| M5 | `const isOwner = pets.data?.kind === 'ok' && pets.data.pets.find(({ id }) => id === selectedPetId)?.myRole === 'owner';` | `#235 R3` Test B ambas filas; `#196 R4` filas `detalle pendiente` y `error de detalle` | declaración = 0; `.find(({ id }) => id === selectedPetId)?.myRole` = 1 (verificado) |
| M6 | `const isOwner = pets.data?.kind === 'ok' && pets.data.pets[0]?.myRole === 'owner';` | `#235 R3` Test A (la cámara sigue con Milo) | declaración = 0; `pets.data.pets[0]` = 1 |
| M7 | Declarar `isOwner` pero dejar la condición en `{pet ? (` (con un `void isOwner;`) | `#235 R1` filas `family`, `walker`, `vet` | `grep -cF isOwner` sigue en 2 (la ancla suelta es ciega); la **posicional** da 0 (verificado) |
| M8 | `const isOwner = pet === null \|\| pet.myRole === 'owner';` | `#196 R4` filas `detalle pendiente` y `error de detalle` (R2) | declaración = 0 |
| M9 | Dejar la condición en `{pet ? (` y poner `style={isOwner ? undefined : { display: 'none' }}` en el `BubblePop` | `#235 R1` filas `family`, `walker`, `vet`: las tres `queryBy… { includeHiddenElements: true }` encuentran el nodo | condición posicional = 0 |

Medidas sobre copias (scratch) del fichero de `origin/dev` f05016d3 con el
cambio aplicado (`ok`) y con las mutaciones (`m1`, `m2`, `m5`, `m7`):

| Medida | ok | m1 | m2 | m5 | m7 |
|---|---|---|---|---|---|
| declaración `const isOwner = pet?.myRole === 'owner';` | 1 | 1 | 0 | 0 | 1 |
| `{isOwner ? (` | 1 | 0 | 1 | 1 | 0 |
| posicional (`-B1` de `BubblePop testID="profile-change-photo-pop"`) | 1 | 0 | 1 | 1 | 0 |
| `grep -cF isOwner` | 2 | 1 | 2 | 2 | 2 |
| `grep -cF myRole` | 1 | 1 | 1 | 1 | 1 |
| `.find(({ id }) => id === selectedPetId)?.myRole` | 0 | 0 | 0 | 1 | 0 |
| `{pet ? (` | 3 | 4 | 3 | 3 | 4 |
| numstat contra la base | `2 1` | `1 0` | `2 1` | `2 1` | `2 0` |

De ahí salen dos lecciones que la spec ya aplica: `grep -cF isOwner` = 2
vale en `ok` y en `m7` (ancla ciega, por eso la posicional) y `myRole` = 1
vale en las cinco (solo el `.find(...)` y la declaración separan M5). El
recuento `{pet ? (` incluye `caption={pet ? (` y otras dos apariciones: no se
usa como ancla, solo como control (baja de 4 a 3).

## Alternativas descartadas

- **Hook `useIsOwner(petId)`.** Mismo argumento que en #216.
- **Leer el rol de la lista `petKeys.list()`.** Segunda fuente, más lenta que
  el detalle que ya pinta el héroe. M5 y los candados de R3 lo atrapan.
- **Guarda de rol dentro de `handleChangePhoto`.** Código inalcanzable sin
  botón. El 403 sigue siendo la red de seguridad.
- **Mostrar la cámara deshabilitada** (`disabled`) a un no dueño. Dejaría una
  acción visible que no puede usar y exigiría copy para explicarlo (gate G1).
- **Sustituir la cámara por una nota de solo lectura.** La foto del héroe no es
  un formulario: una nota sobre la foto estorba. La acción se quita sin dejar
  aviso, igual que Peso o Nuevo en #216.
- **Un test nuevo para R2.** Ya existe, con la lista en dueño, en
  `#196 R4`. Duplicarlo no añade cobertura.

## Riesgos

| Riesgo | Fichero compartido | Dueño | Mitigación |
|---|---|---|---|
| #229 toca el mismo fichero detrás de #235 | `src/screens/profile/index.tsx`, `src/screens/profile/index.test.tsx` | #229 es dueño de `members-link`, `join-pet-link`, `profile-links-row-*` y `ProfileWideTile` | #235 solo toca el bloque de la cámara y una línea bajo `const pet`; el diff acotado (`2 1`) lo prueba. #229 empieza tras mergear #235 (mergear `dev` antes del handoff, como pide el plan §3). Los `describe` de #235 van al final del fichero de test; #229 añade los suyos después de ellos. |
| Un `#235` sin ` R<n>` en un comentario o título | `index.tsx`, `index.test.tsx` | #235 | Regla de `HEX_LITERAL`, en la verificación final de tasks.md. |
| `queryBy` sin `includeHiddenElements` da un `null` ciego | `index.test.tsx` | #235 | R1 y R3 lo exigen; M9 lo prueba. |
| Un `it` que mide el `null` mientras el detalle de la otra mascota está pendiente | `index.test.tsx` | #235 | R3 Test A espera `profile-pet-name` = `Milo` antes del `null`. |
| Flake de carga en el fichero de test de Perfil | `index.test.tsx` | todos | Si un `it` ajeno falla bajo carga, repetir sin el flag y anotarlo; no se enmienda. |
