---
feature: "mobile-no-collar-states-pingo"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-no-collar-states-pingo]] (#159)

## Decisiones técnicas

Base medida: commit **65f37841**. Rutas relativas a `mobile-pet-tracker/` salvo
`specs/` y `docs/`.

- **D1 — `EmptyState` tal cual.** Se reutiliza `src/components/empty-state.tsx`
  sin tocarlo: ni props nuevas ni poses nuevas. Las dos pantallas usan
  `pose="collar"`, la misma que `geofences-empty`. Así los candados de #155 R3
  y R11 sobre el componente siguen verdes sin editarse.
- **D2 — Mapa: condición del botón.** Junto a `const canSetLostMode = …` se
  declara

  ```ts
  const canPairCollar =
    detail.data?.kind === 'ok' &&
    detail.data.pet.myRole === 'owner' &&
    detail.data.pet.device === null;
  ```

  y la rama sin seguimiento pasa a ser

  ```tsx
  {petsReady && last.data?.kind === 'no-tracking' ? (
    <View className="flex-1 items-center justify-center p-6 bg-background">
      <EmptyState
        testID="map-no-tracking"
        pose="collar"
        title={t('map.noTrackingTitle')}
        body={t('map.noTrackingBody')}
        action={canPairCollar ? { label: t('home.pairCollar'), onPress: () => router.push('/pairing') } : undefined}
      />
    </View>
  ) : null}
  ```

  El rol y el collar salen **del mismo detalle**: una sola respuesta del
  servidor decide, sin cruzar listado y detalle. No hay query nueva: `detail`
  ya existe. Se usa `router.push('/pairing')` sin `as Href`, como
  `collar-pair-link` en Inicio. `canPairCollar` es exactamente lo que el
  backend acepta (dueño, M3) y lo que sirve (sin collar: con collar el claim da
  409, M3). Por eso el caso (b) no ve botón. El orden de commits de tasks.md
  llega a esta forma en dos pasos: el verde de R3 pinta la acción sin
  condición y el de R4 introduce `canPairCollar` entero, para que cada caso de
  R4 nazca rojo de verdad.
- **D3 — Zonas seguras: sin botón para nadie.** Hay tres razones.
  1. La pantalla recibe `petId` por la ruta, pero `/pairing` opera sobre
     `useSelectedPet().selectedPetId` y no acepta parámetro (M4). Con un enlace
     directo a otra mascota, el botón emparejaría **otra** mascota.
  2. La única entrada en la app es Perfil, que ya pinta `pairing-link` justo
     encima de `geofences-link`.
  3. Arreglar lo primero obliga a acoplar la pantalla a `SelectedPetProvider`
     (su suite no lo monta) o a cambiar `/pairing`. Las dos cosas quedan fuera
     de alcance.

  La rama pasa a ser
  `<EmptyState testID="geofences-no-tracking" pose="collar" title={t('geofences.noTrackingTitle')} body={t('geofences.noTrackingBody')} />`,
  sin `action`, en el sitio exacto de la `Card`.
- **D4 — Etiqueta del botón: `home.pairCollar`.** Es la misma acción y la misma
  palabra que `collar-pair-link` en Inicio. Hay precedente: `map-no-pets`
  reutiliza `profile.addPet`. No se crea `map.pairCollar`.
- **D5 — Destino de las claves viejas.**
  - `map.trackingNeedsCollar` se borra: tras R2 nadie la usa.
  - `geofences.needsCollar` se queda con valor nuevo (L6), porque el editor la
    sigue usando en la carga y en el error al guardar.
  - `home.activityNeedsCollar` se queda con valor nuevo (L7).

  Los dos valores viejos dicen «requiere un collar», y eso es falso para el
  caso (b) (`docs/verification.md`, paso 5).
- **D6 — Tabla de idioma.** Hay una sección nueva, §2.23, que lleva todas las
  filas de #159: 4 añadidas, 1 retirada y 2 cambiadas. Las filas originales de
  `home.activityNeedsCollar`, `map.trackingNeedsCollar` y `geofences.needsCollar`
  **no se tocan**, como hizo #155 con `docs.emptyBody`. Además, la de
  `geofences.needsCollar` la ancla el `it` `#41 R1` por su sufijo.
- **D7 — Dónde van los tests.**
  - Los candados estáticos (catálogo, tabla, recuentos, movimiento) van en
    `src/components/__tests__/empty-state.test.tsx`, en `describe('#159 R…')`
    nuevos **al final del fichero**.
  - La conducta va en las suites de cada pantalla, también **al final** de cada
    fichero. En `src/screens/map/index.test.tsx` eso deja `mockRouter` (declarado
    antes de `#155 R4`) en ámbito.

## Candados existentes que este cambio mueve

Medidos en 65f37841, contra ese árbol y no contra otro. Cada fila dice qué
requisito lo mueve, y el commit en que cambia depende del tipo de candado:

- **K1 y K3 a K7** cuentan lo que la implementación añade o quita. Cambian
  **en el mismo commit verde** de ese R; si no, ese commit queda rojo.
- **K2 y K9** son tests que aseveran un literal viejo. Su reescritura es
  parte del **commit rojo** de ese R: fallan por aserción hasta que el verde
  cambia el catálogo.

| # | Candado (fichero → `it`) | Hoy | Tras #159 | Lo mueve |
|---|---|---|---|---|
| K1 | `src/providers/__tests__/language-provider.test.tsx` → `mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas` (longitud de `en`) | 371 | 375 tras R1 y 374 tras R2 | R1 (+4), R2 (−1) |
| K2 | mismo fichero → `registra las once claves en los dos idiomas y en la tabla de la spec de idioma` (`#41 R1`): tupla de `geofences.needsCollar` | `'Safe zones require a collar', 'Las zonas seguras requieren un collar'` | L6 | R7 |
| K3 | `src/__tests__/ui-language.test.ts` → `resuelve las 17 ocurrencias normativas` (`#65 R4`): `R4_MAP` | `17 + 2` (19) | `17 + 2 + 1` (20) tras R2 y `17 + 2 + 1 + 1` (21) tras R3 | R2, R3 |
| K4 | mismo fichero → `registra cada ocurrencia de la pantalla y de su cabecera` (`#41 R10`): `R14_GEOFENCES` | `18 + 1` (19) | `18 + 1 + 1` (20) | R5 |
| K5 | `src/__tests__/ui-copy-table.ts`: filas de `R4_MAP` | 1 fila `map.trackingNeedsCollar` | 0 de esa clave; +1 `map.noTrackingTitle`, +1 `map.noTrackingBody` (R2); +1 `home.pairCollar` con `file: 'src/screens/map/index.tsx'` (R3) | R2, R3 |
| K6 | mismo fichero: filas de `R14_GEOFENCES` | 1 fila `geofences.needsCollar` (`src/screens/geofences/index.tsx`) | 0 de esa clave; +1 `geofences.noTrackingTitle`, +1 `geofences.noTrackingBody` | R5 |
| K7 | `src/components/__tests__/empty-state.test.tsx` → `%s pinta %i EmptyState` (`#155 R10`) | map `1`, geofences `1` | map `2` (R2), geofences `2` (R5) | R2, R5 |
| K8 | mismo fichero → `ningún otro fichero usa EmptyState` | 8 ficheros | **igual**: map y geofences ya estaban | — |
| K9 | literales viejos en tests (requirements §Tabla de literales) | ver allí | reescritos | R2 (map), R5 (geofences), R7 (editor y K2), R8 (home) |

Medidos y **sin cambio**:

- `R15_GEOFENCE_EDITOR` (27): el editor sigue llamando `t('geofences.needsCollar')` una vez.
- `R3_HOME`: Inicio sigue llamando `t('home.activityNeedsCollar')` una vez.
- `SCREEN_FILES`: no hay fichero de pantalla nuevo.
- `#116 R8: el mapa no estrena animación`.
- El escaneo de literales sueltos (`#65 R18`): ningún literal de la tabla entra
  en el fuente de una pantalla; `'collar'` y `'/pairing'` no son valores del catálogo.
- Las guardas de carta y de clases: no se prescribe ninguna clase nueva; el
  envoltorio del mapa ya existe y `EmptyState` trae las suyas.
- Las listas de import por fichero: el mapa ya importa `EmptyState` y `router`,
  y Zonas seguras ya importa `EmptyState`. No entra `Href` ni otro import.

Anclas para comprobar la base al arrancar (salida esperada en 65f37841). Si
una no cuadra, **para** y avisa: alguien movió la base.

```sh
cd mobile-pet-tracker
grep -cF "+ 5, // #155 R1" src/providers/__tests__/language-provider.test.tsx            # 1
grep -cF "expect(R4_MAP).toHaveLength(17 + 2); // +2 #155 R4" src/__tests__/ui-language.test.ts   # 1
grep -cF "expect(R14_GEOFENCES).toHaveLength(18 + 1); // +1 #155 R8" src/__tests__/ui-language.test.ts   # 1
grep -cF "{ file: 'src/screens/map/index.tsx', key: 'map.trackingNeedsCollar' }," src/__tests__/ui-copy-table.ts   # 1
grep -cF "{ file: 'src/screens/geofences/index.tsx', key: 'geofences.needsCollar' }," src/__tests__/ui-copy-table.ts   # 1
grep -cF "['src/screens/map/index.tsx', 1]," src/components/__tests__/empty-state.test.tsx   # 1
grep -cF "['src/screens/geofences/index.tsx', 1]," src/components/__tests__/empty-state.test.tsx   # 1
grep -cF "t('map.trackingNeedsCollar')" src/screens/map/index.tsx               # 1
grep -cF "t('geofences.needsCollar')" src/screens/geofences/index.tsx           # 1
grep -cF "t('geofences.needsCollar')" src/screens/geofence-editor/index.tsx     # 1
grep -cF "t('home.activityNeedsCollar')" src/screens/home/index.tsx             # 1
grep -cF '### §2.21 — Añadidos por #155' ../specs/mobile-ui-language/design.md   # 1
grep -cF '### §2.23' ../specs/mobile-ui-language/design.md                      # 0
```

## Archivos afectados

Solo capa de presentación de la app móvil, más dos documentos. No hay cambio
en `domain`, `application` ni `infrastructure` del backend (M1-M3), ni en
`src/api/`. Rutas relativas a `mobile-pet-tracker/` salvo indicación.

Fuente:

| Fichero | Cambio | R |
|---|---|---|
| `src/i18n/catalog.ts` | +4 claves en `en` y `es` (L1-L4); borra `map.trackingNeedsCollar` en los dos; reescribe `geofences.needsCollar` (L6) y `home.activityNeedsCollar` (L7) en los dos | R1, R2, R7, R8 |
| `src/screens/map/index.tsx` | rama `no-tracking`: `Text` pasa a `EmptyState`; `canPairCollar` | R2, R3, R4 |
| `src/screens/geofences/index.tsx` | rama `no-tracking`: `Card` pasa a `EmptyState` sin acción | R5 |

Tests (solo los que este cambio toca):

| Fichero | Cambio | R |
|---|---|---|
| `src/components/__tests__/empty-state.test.tsx` | K7; `describe` nuevos `#159 R1`, `R2`, `R7`, `R8`, `R9` al final | R1, R2, R5, R7, R8, R9 |
| `src/providers/__tests__/language-provider.test.tsx` | K1, K2 | R1, R2, R7 |
| `src/__tests__/ui-language.test.ts` | K3, K4 | R2, R3, R5 |
| `src/__tests__/ui-copy-table.ts` | K5, K6 | R2, R3, R5 |
| `src/screens/map/index.test.tsx` | literal viejo del `it` R5; `describe` nuevos `#159 R2`, `R3`, `R4` al final | R2, R3, R4 |
| `src/screens/geofences/index.test.tsx` | borra `it('pinta el 402 sin Reintentar')`; `describe` nuevos `#159 R5`, `R6` al final | R5, R6 |
| `src/screens/geofence-editor/index.test.tsx` | 2 literales viejos | R7 |
| `src/screens/home/index.test.tsx` | 3 literales viejos | R8 |

Documentos:

| Fichero | Cambio | R |
|---|---|---|
| `specs/mobile-ui-language/design.md` | sección nueva `### §2.23 — Añadidos por #159 — Pingo sin collar`, tras §2.21 (y tras §2.22 si #158 ya mergeó) | R1, R2, R7, R8 |
| `docs/verification.md` | paso 5: el texto del tab Map | R2 |

**Lista cerrada.** Nada fuera de estas tablas cambia. En concreto **no** se tocan:

- `src/components/empty-state.tsx`
- `src/screens/geofence-editor/index.tsx`
- `src/screens/home/index.tsx`
- `src/screens/docs/`
- `src/api/`
- `package.json`
- `bun.lock`
- `app/`

El editor y la nota de Inicio cambian solo por catálogo.

## Coordinación con #158

#158 (`mobile-docs-upload`, misma base 65f37841) está en vuelo y comparte candados y
ficheros con #159.

- **Deltas de #159, medidos contra 65f37841 y sin sumar los de #158:**
  - `language-provider.test.tsx`: longitud 371 → 374 (+4 en R1, −1 en R2).
  - `ui-language.test.ts`: `R4_MAP` 19 → 21 y `R14_GEOFENCES` 19 → 20.
  - `ui-copy-table.ts`: las filas de K5 y K6.
  - `mobile-ui-language/design.md`: la sección §2.23. **§2.22 queda reservada
    para #158**; #159 no la usa.
- **Quien mergee segundo recuenta los candados compartidos** (language-provider,
  ui-copy-table, consistency-classnames, design-drift) contra el `main` de ese
  momento, y renumera la sección si hace falta para que las dos queden
  consecutivas y sin hueco. Los anclas `grep -cF` de §Candados existentes
  caducan en ese merge.
- **Ficheros que tocan las dos features:**
  - `src/i18n/catalog.ts`.
  - `src/components/__tests__/empty-state.test.tsx`: #158 reescribe
    `docs.emptyBody`, que está en las `copyRows` de #155. #159 añade
    `describe` al final y cambia dos filas de K7.
  - `language-provider.test.tsx`, `ui-copy-table.ts`, `ui-language.test.ts` y
    `mobile-ui-language/design.md`.

  El conflicto esperado es textual (colas de sumas y finales de fichero) y se
  resuelve conservando las dos partes.
- #159 no toca `src/screens/docs/`, `src/api/media.ts` ni `package.json`.

## Alternativas descartadas

- **A1 — Dos copias por caso** (sin collar / collar sin plan). Exigiría una
  query más (o cruzar `device` del detalle) solo para elegir texto, y el texto
  de una rama sería falso mientras la otra query carga o falla. Una sola copia
  verdadera en los dos casos («collar con plan activo») cubre los dos sin
  estado nuevo. El botón sí distingue (D2), porque ahí equivocarse lleva a un
  409.
- **A2 — Pingo también en el editor y en la nota de Inicio.** En el editor, la
  carga sin seguimiento es una de tres guardas hermanas en texto, y la misma
  clave pinta el error al guardar bajo el botón Guardar, sobre el mapa del
  editor, donde una ilustración no cabe (`requirements.md` §Clasificación). La
  nota de Inicio es una línea dentro de `summary-card`, no un estado vacío de
  pantalla.
- **A3 — `{{petName}}` en los cuerpos.** En Zonas seguras el nombre depende de
  la query de detalle, que puede fallar, y el cuerpo tendría que esperar a
  ella. #155 usó «tu mascota» en sus seis cuerpos, incluido
  `geofences.emptyBody` en esta misma pantalla. El catálogo tiene una sola
  clave con `{{petName}}` (`pairing.readySubtitle`).
- **A4 — Botón en Zonas seguras con `selectPet(petId)` antes de navegar.**
  Cambia la mascota seleccionada de toda la app como efecto lateral de un botón
  y obliga a montar `SelectedPetProvider` en la pantalla y en su suite. Perfil
  ya ofrece `pairing-link` (D3).
- **A5 — Distinguir los dos casos en el cuerpo del 402.** Es cambio de backend
  y de contrato, y está fuera de alcance (`requirements.md` §Fuera de alcance).
  Además, el detalle ya distingue por `device`.
