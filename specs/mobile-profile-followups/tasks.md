---
feature: "mobile-profile-followups"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-profile-followups]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Rutas relativas a
> `mobile-pet-tracker/`. Commits test-primero: un commit de test por requisito
> (`test(profile): ... (R<n>)`, o `test(components): ... (R3)`), y solo en R2 un
> commit verde `fix(profile): ... (R2)`. Los literales esperados se escriben a
> mano en los tests, nunca importados de `src/theme/`, `src/i18n/catalog.ts` ni
> del código que se prueba. `await fireEvent.press(...)` y
> `await act(async () => { ... })` siempre (RNTL 14: el `fireEvent` y el `act`
> sin `await` contaminan el `it` siguiente). Esperas según `docs/conventions.md`
> §Esperas: la condición de espera es la misma observación que las aserciones
> posteriores; se espera al árbol, nunca a un contador de mock.
>
> **Reglas del entorno (Codex):** correr solo el test del R en curso
> (`bunx jest <fichero> -t '<nombre>'` desde `mobile-pet-tracker/`); nunca
> `./init.sh` (lo corre el leader); skills de Expo con los nombres del plugin de
> Codex, no los del leader (ver el handoff). Nada de `git add -A`: `git add` por
> ruta. Ninguna mutación se commitea: tras cada una, `git checkout HEAD -- <ruta>`
> y `git diff --stat` vacío antes del commit.
>
> **Orden recomendado:** R5 (más pequeño), R1 (con X1), R3, R4, y al final R2
> (rojo, verde, y luego X2 a X6 y la repetición de X1). Móvil no
> tiene prettier: no lo instales ni lo corras.
>
> **Anclas de partida (H0, medidas con `grep -cF '<literal>' <fichero>`):**
>
> ```
> grep -cF 'disabled={photoUploading}' src/screens/profile/index.tsx            # 1
> grep -cF 'photoBusyRef' src/screens/profile/index.tsx                         # 0
> grep -cF 'ImagePicker.launchImageLibraryAsync' src/screens/profile/index.tsx  # 1
> grep -cF 'className="rounded-xl bg-danger-soft"' src/screens/profile/index.tsx # 1
> grep -cF 'size={40} cacheKey={pet.id}' src/components/pet-switcher.tsx        # 1
> grep -cF 'onStartShouldSetResponder' src/screens/profile/index.test.tsx       # 0
> grep -cF 'danger-soft' src/screens/profile/index.test.tsx                     # 0
> grep -cF "findByText('Ada Lovelace')" src/screens/profile/index.test.tsx      # 0
> grep -cF "getByText('Ada Lovelace')" src/screens/profile/index.test.tsx       # 1
> grep -cF 'cacheKey' src/components/__tests__/pet-switcher.test.tsx            # 0
> ```
>
> Si alguna salida difiere antes del primer commit, parar y reportar: el árbol
> no es el que midió la spec.

## R5 — Flake del me-card: esperar al nombre

Test en `src/screens/profile/index.test.tsx`, describe `R1: me card`, it `shows the real account name and email`.

- [ ] (1) **Spike previo (mutación, no se commitea).** En ese `it`, antes de `await renderProfile();`, sustituir `mockGetMe.mockResolvedValue({...})` por la misma respuesta con retraso real: `mockGetMe.mockImplementation(() => new Promise((resolve) => { setTimeout(() => resolve(<mismo objeto ok>), 50); }));` (el fichero no usa timers falsos: `grep -c useFakeTimers` da 0). Correr el `it` con el cuerpo **antiguo**: debe salir rojo (`getByText('Ada Lovelace')` lanza porque el skeleton ya está pero el nombre no). Anotar el mensaje de error en `progress/impl_mobile-profile-followups.md`. Si sale verde, parar y reportar: la premisa del flake no se reproduce.
- [ ] (2) Editar el cuerpo: sustituir `await waitFor(() => expect(screen.getByTestId('me-card')).toBeVisible());` y `expect(screen.getByText('Ada Lovelace')).toBeVisible();` por `expect(await screen.findByText('Ada Lovelace')).toBeVisible();`; conservar el correo y `expect(mockGetMe).toHaveBeenCalledWith(apiUrl, 'jwt-token');`. Con el spike aún plantado el `it` debe salir verde. Retirar el spike (`mockGetMe.mockResolvedValue` original), correr el `it` y el describe `R1: me card` completos en verde. Verificar: `grep -cF "findByText('Ada Lovelace')" src/screens/profile/index.test.tsx` da `1` y `grep -cF "getByText('Ada Lovelace')"` da `0`; `git diff --stat` solo muestra ese fichero con el cambio de R5.
- [ ] (3) Commit `test(profile): wait for the me-card name instead of the skeleton card (R5)`. Nace verde por naturaleza: el rojo es el spike, ya retirado. Sin refactor.

## R1 — Candado de `disabled` en la cámara

Test en `src/screens/profile/index.test.tsx`, describe nuevo `#184 R1: la cámara no responde mientras sube` (el resto de describes `#184` se añaden debajo en el mismo bloque de fixtures). `beforeEach` como describe `R7: cambiar foto` (ver [[design]] §Decisiones técnicas).

- [ ] (1) Escribir el `it` `no responde a toques durante la subida`: `mockLaunchImageLibrary.mockResolvedValue({ canceled: false, assets: [{ uri: 'file:///luna.webp', mimeType: 'image/webp' } as never] })`; `requestPhotoUploadUrl` devuelve una promesa diferida (`let finish!: (value: { kind: 'error' }) => void;` igual que el `it` `expone la cámara deshabilitada mientras la subida está en curso` de `#168 R4`). Pasos: `await renderProfile(); await screen.findByTestId('profile-pet-card');` aseverar en reposo `screen.getByTestId('change-photo').props.onStartShouldSetResponder()` es `true`; `await fireEvent.press(screen.getByTestId('change-photo'));`; `await waitFor(() => expect(screen.getByTestId('change-photo').props.accessibilityState).toEqual({ disabled: true }));`; `expect(screen.getByTestId('change-photo').props.onStartShouldSetResponder()).toBe(false);`; `await fireEvent.press(screen.getByTestId('change-photo'));` (segundo toque); `expect(mockLaunchImageLibrary).toHaveBeenCalledTimes(1); expect(mockRequestPhotoUploadUrl).toHaveBeenCalledTimes(1);`; `await act(async () => { finish({ kind: 'error' }); });` y `await screen.findByTestId('photo-upload-error')`; tras terminar, la sonda vuelve a `true`. Si `props.onStartShouldSetResponder` no existe como función en el host de `change-photo` (error de tipo o `undefined`), parar y reportar sin inventar otra sonda. Nace verde en H0 (sonda y contador); anotar qué filas salieron verdes sin implementación (filas que nacen verdes por requisito previo: R1 completo).
- [ ] (2) **Mutación X1** (ver [[design]] §Tabla de mutaciones): borrar la línea `disabled={photoUploading}` en `src/screens/profile/index.tsx`; correr el `it`: debe salir rojo en la sonda y en el contador (`launchImageLibraryAsync` 2 llamadas). Anotar los dos mensajes. Revertir (`git checkout HEAD -- src/screens/profile/index.tsx`; `grep -cF 'disabled={photoUploading}' src/screens/profile/index.tsx` da `1`; `git diff --stat` vacío). Commit `test(profile): lock the camera disabled prop during upload (R1)`.
- [ ] (3) Sin refactor. La repetición de la mutación tras R2 (X2 y X3) se hace en el bloque R2 (4).

## R3 — Foto de `PetSwitcher avatars`: tamaño y `cacheKey`

Test en `src/components/__tests__/pet-switcher.test.tsx`, `it` nuevo dentro del describe `#173 R4: variante avatars`, con nombre `#184 R3: la foto usa size 40 y la cacheKey de cada mascota`. Reutiliza `renderAvatars` y `makePet`.

- [ ] (1) Escribir el `it`: `await renderAvatars([makePet({ id: 'pet-1', name: 'Luna', photoUrl: 'http://example.test/luna.jpg' }), makePet({ id: 'pet-2', name: 'Milo', photoUrl: 'http://example.test/milo.jpg' })]);`. Aseverar con `toEqual`, literales a mano: `screen.getByTestId('pet-avatar-image-pet-1').props.source` es `[{ uri: 'http://example.test/luna.jpg', cacheKey: 'pet-1' }]`, el de `pet-2` es `[{ uri: 'http://example.test/milo.jpg', cacheKey: 'pet-2' }]`, y ambos `props.style` son `{ width: 40, height: 40, borderRadius: 20 }`. Nace verde (producción ya cumple). Si el host no expone `source` como arreglo, copiar la forma que ya asevera el test de `profile-pet-avatar` en `src/screens/profile/index.test.tsx` (`#168 R4`) y reportarlo.
- [ ] (2) **Mutaciones X7, X8, X9 y X10** en `src/components/pet-switcher.tsx` (una a la vez, revirtiendo con `git checkout HEAD -- src/components/pet-switcher.tsx` entre cada una; `grep -cF 'size={40} cacheKey={pet.id}' src/components/pet-switcher.tsx` da `1` al terminar). Cada una debe dejar rojo este `it` (columna «Rojo esperado»). Anotar el resultado de las cuatro. `git diff --stat` vacío. Commit `test(components): lock avatar photo size and cacheKey in PetSwitcher (R3)`.
- [ ] (3) Sin refactor.

## R4 — Candado de la `className` de `profile-sign-out`

Test en `src/screens/profile/index.test.tsx`, describe `#184 R4: cerrar sesión conserva su botón danger-soft`.

- [ ] (1) Escribir el `it` `conserva la variante y las clases`: `await renderProfile();` `await screen.findByTestId('profile-sign-out');` `expect(screen.getByTestId('profile-sign-out').props.className).toBe('pressable-feedback__root button__root button__root--variant-danger-soft button__root--size-md rounded-xl bg-danger-soft');`. Si la primera corrida ve otra cadena, parar, escribir la cadena real y su diferencia en `progress/impl_mobile-profile-followups.md` y esperar al leader (decisión pendiente de [[requirements]]). Nace verde.
- [ ] (2) **Mutaciones X11, X12, X13 y X14** en `src/screens/profile/index.tsx`, una a la vez, cada una roja en este `it`; revertir con `git checkout HEAD -- src/screens/profile/index.tsx` entre ellas (`grep -cF 'className="rounded-xl bg-danger-soft"'` da `1` y `git diff --stat` vacío al terminar). Commit `test(profile): lock the sign-out button variant and classes (R4)`.
- [ ] (3) Sin refactor. El label del botón queda fuera ([[requirements]] §Fuera de alcance).

## R2 — Guardia de reentrada en `handleChangePhoto`

Tests en `src/screens/profile/index.test.tsx`, describe `#184 R2: handleChangePhoto ignora toques mientras hay uno en curso`. `beforeEach` del describe `#184` (ver [[design]]). Las pulsaciones van explícitas con `await fireEvent.press(screen.getByTestId('change-photo'))`, sin helper nuevo.

- [ ] (1) **Tests rojos, un commit** `test(profile): require a reentry guard on the photo picker (R2)`:
  - `it` `un segundo toque con el picker abierto no lanza otro picker` (el único rojo en H0): `mockLaunchImageLibrary.mockReturnValue(pending<ImagePicker.ImagePickerResult>())` (o el tipo que ya use el fichero para ese mock; no inventar tipos), `await renderProfile(); await screen.findByTestId('profile-pet-card');` `await fireEvent.press(...)` dos veces seguidas; `expect(mockLaunchImageLibrary).toHaveBeenCalledTimes(1);`. El picker queda sin resolver al terminar el `it`: no hay `setState` pendiente que contaminar (el handler sigue esperando antes de tocar estado) y el `mockReset` del `beforeEach` global lo limpia. En H0 debe dar rojo con `Expected number of calls: 1, Received number of calls: 2`; anotar el mensaje.
  - `it.each` `libera la guardia tras <salida>` con exactamente estas siete filas (ciclo: pulsar, esperar al fin observable, pulsar de nuevo, `expect(mockLaunchImageLibrary).toHaveBeenCalledTimes(2)`): (a) `picker cancelado`: `{ canceled: true, assets: null }` (sin cambio observable en el árbol: basta el `await fireEvent.press`, que ya vacía los microtasks, y la segunda pulsación; no se espera con un contador de mock); (b) `formato no soportado`: asset `{ uri: 'file:///luna.gif', mimeType: 'image/gif' }` y se espera `await screen.findByTestId('photo-upload-error')`; (c) `URL denegada` (`requestPhotoUploadUrl` `{ kind: 'error' }`, espera a `photo-upload-error`); (d) `sesión caducada` (`requestPhotoUploadUrl` `{ kind: 'unauthorized' }`, espera `await waitFor(() => expect(mockSignOut).toHaveBeenCalledTimes(1))`; el auth mock del describe usa `signOut: mockSignOut` con `mockSignOut.mockResolvedValue()`); (e) `subida rechazada` (`requestPhotoUploadUrl` ok + `fetch` global que devuelve `{ blob: jest.fn().mockResolvedValue(new Blob(['x'], { type: 'image/webp' })) }` + `uploadPhotoToUrl` `{ kind: 'error' }`, espera a `photo-upload-error`); (f) `excepción al leer el asset` (`requestPhotoUploadUrl` ok + `globalThis.fetch = jest.fn().mockRejectedValue(new Error('boom'))`, espera a `photo-upload-error`); (g) `subida correcta` (todo ok, espera `await waitFor(() => expect(mockGetPet).toHaveBeenCalledTimes(2))` como el `it` `requests, uploads raw bytes...`). Restaurar `globalThis.fetch` al original al terminar cada fila que lo reemplaza (guardarlo al inicio del describe y devolverlo en un `afterEach`). La espera de cada fila es la observación que luego se asevera (el control volvió a `{ disabled: false }` en las filas con subida, o el árbol de error), nunca un contador de mock. Estas siete filas **nacen verdes en H0** (sin guardia el picker se vuelve a lanzar siempre): marcar en el informe cuáles salieron verdes sin implementación; su rojo se demuestra por mutación X5 y X6 en (4).
- [ ] (2) **Implementación mínima** en `src/screens/profile/index.tsx`, commit `fix(profile): ignore photo taps while a picker or upload is in flight (R2)`: `photoBusyRef` y guardia como en [[design]] §Decisiones técnicas; sin tocar JSX ni `photoUploading`. Los tests de (1) quedan todos verdes. Verificar: `grep -cF 'photoBusyRef' src/screens/profile/index.tsx` da `4` (declaración, lectura de la guardia, asignación `true`, asignación `false`; si da otra cifra por forma de escribirlo, reportar y razonar la diferencia) y el diff del fichero no contiene líneas de JSX.
- [ ] (3) Refactor con tests verdes (p. ej. mover la liberación a una sola salida si quedó duplicada). Sin commit si no hay cambios.
- [ ] (4) **Mutaciones tras R2**, cada una plantada, corrida y revertida (`git checkout HEAD -- src/screens/profile/index.tsx`, `git diff --stat` vacío): X4 (rojo: solo `un segundo toque con el picker abierto no lanza otro picker`), X5 (rojo: las siete filas de `libera la guardia`; el doble toque verde), X6 (rojo: solo las filas `picker cancelado` y `formato no soportado`), y la repetición de X1 como X2 y X3 sobre el `it` de R1 (rojo: solo la sonda; el contador sigue en 1). Anotar para cada una qué `it` salió rojo y cuáles verdes; si el reparto difiere de la tabla de [[design]], reportarlo sin ajustar la tabla. Sin commit (nada que commitear).

## Cierre

- [ ] `progress/impl_mobile-profile-followups.md` con: salida de cada ancla H0, mensajes de los rojos (R2 doble toque y X1 a X14, spike de R5), filas que nacieron verdes, cualquier desvío pedido por la spec (sonda ausente, cadena de R4, cifra de `photoBusyRef`), y la medición de grep-clean de R6 con comando y cifra.
- [ ] Un commit por R según este fichero; `traceability.md` actualizada con hash y mensaje de cada uno (sin rebasear después: los hashes dejarían de valer).
- [ ] No correr `./init.sh`. El leader corre la suite completa y lanza al reviewer.
