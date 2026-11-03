---
feature: "mobile-profile-photo-owner-only"
status: draft        # draft | approved
tags: [mobile, roles, profile, spec]
---

# Requisitos — [[mobile-profile-photo-owner-only]] (#235)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones, las alternativas descartadas y la batería
> de mutaciones. Todas las rutas de código son relativas a `mobile-pet-tracker/`
> salvo que se diga otra cosa.

**Hallazgo.** Lo vio el leader en la pantalla de Perfil del smoke G2 del
2026-11-03 (`progress/plan_mejoras-smoke-2026-11-03.md` §1, última línea; no es
una frase literal del humano). En `src/screens/profile/index.tsx`, el botón de
cámara `change-photo` (dentro de `profile-change-photo-pop`) se pinta a todos
los roles. El backend lo rechaza para quien no es dueño:
`backend-pet-tracker/src/modules/media/infrastructure/media.controller.ts`
declara `@RequirePetRole('owner')` sobre `POST /v1/pets/:petId/photo-upload-url`.
La app traduce el 403 (`requestPhotoUploadUrl` devuelve `{ kind: 'forbidden' }`)
a `profile.couldNotUploadPhoto`, es decir «No se pudo subir la foto». Quien ve
ese aviso no sabe que el fallo es de permisos y que nunca va a funcionar.

**Vocabulario.** «Dueño» es una mascota cuyo `PetProfile.myRole` es `'owner'`.
«No dueño» es cualquiera de los otros tres valores del tipo
(`src/api/types.ts`: `myRole: 'owner' | 'family' | 'walker' | 'vet'`). Es el
mismo vocabulario de [[../mobile-role-aware-actions/requirements|#216]].

**Patrón de #216.** La pantalla calcula un booleano local `isOwner`. Mientras
la consulta de la que sale el rol no ha resuelto en `kind: 'ok'` (cargando,
error, sin red), `isOwner` es `false` y la acción no se pinta. El 403 del
backend se queda como red de seguridad: ningún requisito toca su manejo.

**De dónde sale el rol.** Del detalle de la mascota seleccionada: `detail`
(`useQuery` con `petKeys.detail(selectedPetId ?? '')` y `getPet`) y su derivado
`pet` (`detail.data?.kind === 'ok' ? detail.data.pet : null`), que ya existen en
`ProfileScreen`. Es la misma mascota que pinta el héroe y sobre la que actúa la
cámara. Perfil no lee el rol de la lista `petKeys.list()`. En los tests, el rol
sale siempre del argumento `myRole` de `makePet` del propio fichero de test.

## Requisitos funcionales

- **R1**: WHEN `ProfileScreen` (`src/screens/profile/index.tsx`) pinta el héroe
  con el detalle de la mascota seleccionada resuelto en `kind: 'ok'` THE SYSTEM
  SHALL pintar `profile-change-photo-pop` con `change-photo` dentro solo si
  `pet.myRole === 'owner'`. Con un no dueño:
  - `profile-hero` tiene exactamente un hijo, `pet-hero` (el `PetHeroHeader`);
    con el dueño tiene dos, `pet-hero` y `profile-change-photo-pop`, en ese
    orden;
  - `profile-change-photo-pop`, `change-photo` y el glifo
    `profile-icon-camera` no existen, ni siquiera ocultos a accesibilidad;
  - el resto de la pantalla se pinta igual que para el dueño: `profile-pet-card`,
    `profile-pet-name` con el nombre de la mascota, `pet-info-card` y
    `profile-add-pet`.
  - Ancla, en `src/screens/profile/index.tsx` (las cifras son las del árbol
    tras el cambio; `origin/dev` f05016d3 da el valor «antes»):
    - `grep -cF "const isOwner = pet?.myRole === 'owner';"`: antes 0, después 1
    - `grep -cF "{isOwner ? ("`: antes 0, después 1
    - `grep -B1 -F 'BubblePop testID="profile-change-photo-pop"' <fichero> | grep -cF "{isOwner ? ("`:
      antes 0, después 1 (la condición envuelve justo al `BubblePop`; con
      `grep -cF "isOwner"` = 2 a secas no basta, porque una declaración
      muerta también lo cumple)
    - `grep -cF "myRole"` = 1 (solo la declaración de `isOwner`)
    - `grep -cF 'testID="change-photo"'` = 1 y
      `grep -cF 'testID="profile-change-photo-pop"'` = 1 (el botón se envuelve,
      no se duplica)
  - Test: `describe('#235 R1: la cámara de Perfil es solo del dueño')` en
    `src/screens/profile/index.test.tsx`, con `beforeEach(setupProfile168)`.
    - `it.each` con cuatro filas, `[role, cameraVisible]`: `['owner', true]`,
      `['family', false]`, `['walker', false]`, `['vet', false]`. Título:
      `'#235 R1 con el rol %s la cámara se pinta: %s'`.
    - Cada fila define `const pet = makePet({ myRole: role });` y hace
      `mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] })` y
      `mockGetPet.mockResolvedValue({ kind: 'ok', pet })`.
    - Cada fila hace `await renderProfile();` y espera
      `await screen.findByTestId('profile-pet-card');`. Con eso el detalle
      está resuelto: la cámara y `profile-pet-card` cuelgan del mismo `pet`,
      así que no hay carrera entre ambos.
    - Con `cameraVisible`: `getByTestId('change-photo')` existe,
      `getByTestId('profile-change-photo-pop')` existe,
      `screen.getByTestId('profile-hero').children` tiene longitud 2 y
      `profileChild(hero, 0)` es `getByTestId('pet-hero')`.
    - Sin él: `queryByTestId('change-photo', { includeHiddenElements: true })`,
      `queryByTestId('profile-change-photo-pop', { includeHiddenElements: true })`
      y `queryByTestId('profile-icon-camera', { includeHiddenElements: true })`
      son `null`; `profile-hero` tiene `children` de longitud 1 y
      `profileChild(hero, 0)` es `getByTestId('pet-hero')`. La opción
      `includeHiddenElements` es obligatoria en los tres `queryBy`: sin ella
      RNTL no ve un nodo oculto a accesibilidad y el `null` sería ciego a una
      cámara pintada con `importantForAccessibility="no-hide-descendants"`.
    - En las cuatro filas: `profile-pet-name` tiene el texto `Luna`,
      `pet-info-card` y `profile-add-pet` existen.
    - Hoy es rojo en las tres filas no dueño: la cámara se pinta a todos.

- **R2**: WHILE el detalle de la mascota seleccionada no ha resuelto en
  `kind: 'ok'` (pendiente, `error`, `unreachable` o `missing-config`) THE SYSTEM
  SHALL no pintar `profile-change-photo-pop` ni `change-photo`, aunque la lista
  de mascotas (`petKeys.list()`) ya haya resuelto con una mascota del dueño.
  - Ancla: la misma de R1. El `isOwner` falso con `pet === null` sale de
    `pet?.myRole === 'owner'`: con `pet` nulo, `undefined === 'owner'` es
    `false`.
  - Test: este requisito **nace verde**. Lo prueba hoy, y debe seguir
    probándolo sin edición, el `it.each` existente
    `'#196 R4: sin detalle cargado ($name) no monta la cámara'` (filas
    `detalle pendiente` y `error de detalle`) del
    `describe('#196 R4: cámara flotante sobre la foto')` en
    `src/screens/profile/index.test.tsx`. Esas dos filas dan a `listPets` una
    mascota del dueño (`makePet()`), así que atrapan un `isOwner` que mire la
    lista o que sea verdadero con `pet` nulo (mutaciones M2, M4, M5 y M8 de
    [[design]]). R2 no añade test nuevo porque cualquiera sería un duplicado.
    La fila de [[traceability]] cita ese `it.each` por nombre.

- **R3**: WHEN el usuario cambia la mascota seleccionada en Perfil THE SYSTEM
  SHALL decidir la cámara con el rol que trae el detalle de la mascota
  seleccionada, no con el de otra mascota ni con el de la lista. Al pasar de
  una mascota del dueño a otra que no lo es, la cámara desaparece; al volver a
  la primera, reaparece.
  - Ancla, en `src/screens/profile/index.tsx`:
    - `grep -cF ".find(({ id }) => id === selectedPetId)?.myRole"` = 0 (el rol
      no sale de la lista; es 0 antes y después)
    - `grep -cF "pets.data.pets[0]"` = 0
    - `git diff --numstat $(git merge-base HEAD origin/dev) -- mobile-pet-tracker/src/screens/profile/index.tsx`
      (desde la raíz del repo, tras `git fetch origin`) da exactamente
      `2<TAB>1<TAB>mobile-pet-tracker/src/screens/profile/index.tsx`: dos líneas
      añadidas (la declaración de `isOwner` y la condición nueva) y una quitada
      (la condición vieja `{pet ? (`). Es el candado de «no se toca nada más» y
      deja intactas las zonas de #229 (ver Fuera de alcance). Con la
      condición sin cambiar (M1 o M7 de [[design]]) da `1<TAB>0`.
  - Test A: `it('#235 R3 al pasar a una mascota que no es del dueño, la cámara se va y vuelve')`
    en `describe('#235 R3: la cámara sigue a la mascota seleccionada')`, con
    `beforeEach(setupProfile168)`.
    - `const luna = makePet();` (dueño) y
      `const milo = makePet({ id: 'pet-2', name: 'Milo', myRole: 'family' });`.
    - `mockListPets.mockResolvedValue({ kind: 'ok', pets: [luna, milo] })`.
    - `mockGetPet.mockImplementation(async (_baseUrl, _token, petId) => ({ kind: 'ok', pet: petId === 'pet-2' ? milo : luna }))`.
    - `await renderProfile();` y `await screen.findByTestId('change-photo');`.
    - `await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));`.
    - Espera `await waitFor(() => expect(screen.getByTestId('profile-pet-name')).toHaveTextContent('Milo'));`.
      Esa espera es obligatoria: sin ella el `null` siguiente se mediría
      mientras el detalle de `pet-2` está pendiente, que ya oculta la cámara
      (R2), y el `it` no probaría el rol.
    - Después, `queryByTestId('change-photo', { includeHiddenElements: true })`
      es `null`.
    - `await fireEvent.press(screen.getByTestId('pet-chip-pet-1'));` y
      `await screen.findByTestId('change-photo');`.
    - Hoy es rojo en el `null`: la cámara se pinta para Milo.
    - Atrapa un `isOwner` que mire la primera mascota o «alguna mascota» de la
      lista (M6 en [[design]]).
  - Test B: `it.each` en el mismo `describe`, título
    `'#235 R3 con la lista en %s y el detalle en %s la cámara se pinta: %s'`,
    con dos filas `[listRole, detailRole, cameraVisible]`:
    `['owner', 'family', false]` y `['family', 'owner', true]`.
    - `listPets` devuelve `[makePet({ myRole: listRole })]` y `getPet` devuelve
      `{ kind: 'ok', pet: makePet({ myRole: detailRole }) }`.
    - Espera `findByTestId('profile-pet-card')`. Si `cameraVisible`, espera
      `findByTestId('change-photo')`; si no, comprueba
      `queryByTestId('change-photo', { includeHiddenElements: true })` `null`.
    - La fila `['owner', 'family', false]` es roja hoy y atrapa M5 (rol de la
      lista); la fila `['family', 'owner', true]` atrapa la misma mutación por
      el otro lado y es verde con el código actual.
    - El desfase lista/detalle no ocurre con datos coherentes: la fila fija la
      fuente, no un caso real (ver «Por qué el detalle» en [[design]]).

- **R4**: WHEN el dueño pulsa `change-photo` THE SYSTEM SHALL conservar el flujo
  de hoy sin cambios: el selector de imágenes, la petición de URL, la subida,
  el refetch del detalle, `photo-upload-error` y el bloqueo mientras sube
  (`accessibilityState` y `disabled` con `photoUploading`). Ni el botón ni
  `handleChangePhoto` cambian.
  - Ancla, en `src/screens/profile/index.tsx`, sin cambio antes/después:
    - `grep -cF "onPress={() => void handleChangePhoto()}"` = 1
    - `grep -cF "if (!pet) return;"` = 1
    - `grep -cF "accessibilityState={{ disabled: photoUploading }}"` = 1
    - `grep -cF "absolute bottom-24 right-5"` = 1
    - `grep -cF "size-11 items-center justify-center rounded-full border-3 border-background bg-accent"` = 1
    - `grep -cF "signOut("` = 2 (lo vigila `screenSignOutCalls` de
      `src/__tests__/design-drift.test.ts`)
  - Test: este requisito **nace verde** y se prueba sin tocar ningún test
    existente. Los tests que ya ejercen el flujo con el `makePet()` por
    defecto (`myRole: 'owner'`) son `describe('R7: cambiar foto')`,
    `describe('#184 R1: la cámara no responde mientras sube')`,
    `describe('#184 R2: handleChangePhoto ignora toques mientras hay uno en curso')`
    y `describe('#196 R4: cámara flotante sobre la foto')`, todos en
    `src/screens/profile/index.test.tsx`. Siguen verdes sin enmienda porque
    el fichero no tiene ningún `myRole` distinto de `'owner'` (hoy
    `grep -cF "myRole" src/screens/profile/index.test.tsx` = 1, la línea del
    `makePet`).
  - Candado de no-edición:
    `git diff --numstat $(git merge-base HEAD origin/dev) -- mobile-pet-tracker/src/screens/profile/index.test.tsx`
    da cero líneas quitadas (la segunda columna es `0`): el cambio es solo
    aditivo. La feature no enmienda ningún `it` ajeno; si uno se pone rojo, se
    para y se anota en el informe de implementación, sin editarlo.

## Fuera de alcance

Cada viñeta trae su evidencia en el árbol de `origin/dev` (f05016d3).

- **Backend.** No se toca. `@RequirePetRole('owner')` en `media.controller.ts`
  ya rechaza al no dueño, y `myRole` ya llega en `GET /pets/:id`.
- **El manejo del 403.** `requestPhotoUploadUrl` sigue devolviendo
  `{ kind: 'forbidden' }` y `handleChangePhoto` lo sigue mostrando como
  `profile.couldNotUploadPhoto`. Es la red de seguridad del patrón de #216. No
  hay copy nuevo ni gate G1.
- **`handleChangePhoto` no gana una guarda de rol.** Sin botón no hay forma de
  llamarlo; la guarda sería código muerto con un test que solo se podría
  escribir llamando a un cierre privado.
- **Otros puntos de entrada de foto.** `src/screens/add-pet/index.tsx` también
  llama a `requestPhotoUploadUrl`, pero quien crea la mascota es su dueño
  (misma razón que en #216 para el alta de mascota).
- **Las filas de enlaces de Perfil.** `members-link` («Familia»),
  `join-pet-link` («Unirme con código»), `profile-links-row-*` y
  `ProfileWideTile` son zona de #229 (`mobile-profile-family-join-row`), que
  va detrás de esta feature en el mismo fichero. #235 no toca ni lee esas
  líneas; R3 lo candea con el recuento de `git diff --numstat`.
- **El enlace `pairing-link` y el resto de acciones de #216.** Su decisión está
  en [[../mobile-role-aware-actions/requirements|#216]] (Fuera de alcance).
- **`docs/ui-guidelines.md` y `docs/conventions.md`.** No cambian: no hay
  estilo, componente ni copy nuevos. No hay gate G4.
- **Artboard.** No hay artboard nuevo y no hay gate G1: la cámara dibujada en el
  artboard `Perfil` (`specs/mobile-profile-photo-hero-canvas/canvas/Perfil.dc.html`,
  filas 7 a 10 de `src/__tests__/profile-photo-hero-canvas.test.ts`) no cambia
  para el dueño, y para un no dueño la acción simplemente se quita, como en
  `ZonasSoloLectura` de #216.

## Aprobación

- [ ] Aprobado por humano (firma delegada del leader, mandato 2026-10-23 ampliado 2026-11-03; fecha: ____) ← gate obligatorio antes de implementar
- [ ] Smoke de #235 en dev build por el humano (fecha: ____): con una cuenta
      dueña y otra `family` de la misma mascota (la family se une con el flujo
      de #214), la cuenta `family` abre Perfil y no ve el botón de cámara sobre
      la foto; ya no puede llegar a «No se pudo subir la foto». La cuenta
      dueña sigue viendo la cámara y sube una foto. El paso reproduce el fallo
      original: antes de #235 la cuenta `family` veía la cámara y, al
      pulsarla y elegir una imagen, la app respondía «No se pudo subir la
      foto». Va en `progress/smoke_mejoras-smoke.md` (lo añade el leader al
      mergear). No bloquea tareas; bloquea `done`.
