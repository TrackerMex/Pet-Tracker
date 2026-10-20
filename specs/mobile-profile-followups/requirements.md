---
feature: "mobile-profile-followups"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-profile-followups]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
> Rutas relativas a `mobile-pet-tracker/`. Feature #184. UI móvil: rige `docs/ui-guidelines.md`.

## Alcance

Cuatro deudas de Perfil que dejó #173 (observaciones O1, O2 y O6 de `progress/review_mobile-tab-screens-canvas-fidelity.md`) más el flake del me-card. Cuatro requisitos (R1, R3, R4, R5) son **candados de test** sobre código que ya cumple: nacen verdes y se prueban plantando una mutación y revirtiéndola. **Un solo requisito cambia producción: R2**, la guardia de reentrada de `handleChangePhoto`, y es el único con test rojo de verdad. Ningún cambio visual de Perfil.

## Premisas re-medidas (sobre el árbol actual, por contenido)

Los números de línea y los ids de mutación M1, M41, M46 y M58 son de #173 sobre `91b705ab` y caducaron: esta spec no los usa. Cada premisa se midió con `grep -cF '<literal>' <fichero>`; las salidas son el estado base H0, antes de cualquier commit de esta feature (las ausencias solo valen en H0).

| Premisa de la descripción | Veredicto | Evidencia (H0) |
|---|---|---|
| O1: `disabled={photoUploading}` sin candado | VERDADERA | `grep -cF 'disabled={photoUploading}' src/screens/profile/index.tsx` da `1`; `grep -cF 'onStartShouldSetResponder' src/screens/profile/index.test.tsx` da `0`. El único test de la cámara deshabilitada solo lee `accessibilityState`, que la línea `accessibilityState={{ disabled: photoUploading }}` fija por separado (`grep -cF` da `1`): quitar `disabled=` sobrevive. |
| O1: «un test que pulse dos veces durante una subida pendiente» sería el candado útil | PARCIAL | Ese test nace verde y solo candaría `disabled` mientras no exista guardia; tras R2 la guardia también bloquea el segundo toque y el test queda ciego a la mutación de `disabled`. Por eso R1 añade una sonda de host (`onStartShouldSetResponder`) que depende solo de la prop `disabled`. |
| O1: `handleChangePhoto` sin guardia de reentrada | VERDADERA y más grave de lo descrito | `grep -cF 'photoBusyRef' src/screens/profile/index.tsx` da `0`. `setPhotoUploading(true)` ocurre solo **después** de que el picker resuelve (`grep -cF 'ImagePicker.launchImageLibraryAsync' src/screens/profile/index.tsx` da `1`, antes del `setPhotoUploading(true)`): con el picker abierto el control sigue habilitado y dos toques seguidos lanzan dos pickers. Rojo esperado en H0 por lectura del código y de la mecánica de `Pressable` (no se corrió jest al redactar); el rojo real lo confirma el commit de test de R2. |
| O2: `size={40}` y `cacheKey={pet.id}` sin candado | VERDADERA | `grep -cF 'size={40} cacheKey={pet.id}' src/components/pet-switcher.tsx` da `1`; en `src/components/__tests__/pet-switcher.test.tsx` `grep -cF 'cacheKey'`, `grep -cF 'borderRadius'` y `grep -cF 'width: 40'` dan `0`. El único `it` de la foto solo hace `toBeVisible()`. `PetSwitcher` está mockeado en `src/screens/profile/index.test.tsx`: el candado va en el test del componente. |
| O6: `className` de `profile-sign-out` sin candado | VERDADERA | `grep -cF 'className="rounded-xl bg-danger-soft"' src/screens/profile/index.tsx` da `1`; `grep -cF 'danger-soft' src/screens/profile/index.test.tsx` da `0`. Los tests existentes del botón solo lo pulsan (`R3: reminders-link y sign out`; `src/app/(tabs)/__tests__/screens.test.tsx`). |
| Flake: el it `R1: me card › shows the real account name and email` espera a `me-card` (que existe con skeleton) y lee el nombre en síncrono | VERDADERA | `grep -cF "await waitFor(() => expect(screen.getByTestId('me-card')).toBeVisible());" src/screens/profile/index.test.tsx` da `1`; `grep -cF "getByText('Ada Lovelace')"` da `1`; `grep -cF "findByText('Ada Lovelace')"` da `0`. En producción `<Card variant="flat" testID="me-card">` se monta siempre y pinta `me-card-skeleton` mientras `me.data === undefined`. Un solo sitio afectado: los `it.each` hermanos esperan `me-card-state`, que solo existe tras cargar. |

## Requisitos funcionales

### O1 — Cámara de la foto de mascota

- **R1** (solo test, nace verde): WHILE la subida de la foto de mascota esté en curso (picker resuelto con un asset válido y `requestPhotoUploadUrl` pendiente) THE SYSTEM SHALL mantener el control `change-photo` fuera de respuesta táctil: `screen.getByTestId('change-photo').props.onStartShouldSetResponder()` devuelve `false` durante la subida y `true` en reposo, `accessibilityState` es `{ disabled: true }` durante la subida, y un segundo `await fireEvent.press` sobre `change-photo` no produce una segunda llamada a `launchImageLibraryAsync` ni a `requestPhotoUploadUrl` (ambos mocks con exactamente 1 llamada). Cierra O1: la mutación «borrar `disabled={photoUploading}` de `src/screens/profile/index.tsx`» debe dejar el test en rojo antes y después de R2.
- **R2** (cambio de producción, test rojo primero): WHEN el usuario pulsa `change-photo` mientras una pulsación anterior sigue sin terminar (picker abierto o subida en curso) THE SYSTEM SHALL ignorar la pulsación sin lanzar otro picker, mediante una guardia síncrona de reentrada en `handleChangePhoto` (`useRef<boolean>` llamado `photoBusyRef`, adquirida tras `if (!pet) return` y liberada en un `finally` que envuelve **todo** el handler). Salidas que deben liberarla, cada una con su propio test: picker cancelado, formato no soportado, `requestPhotoUploadUrl` `unauthorized` (tras `signOut()`), `requestPhotoUploadUrl` distinto de `ok` y de `unauthorized`, `uploadPhotoToUrl` distinto de `ok`, excepción al leer el asset con `fetch`, y subida correcta; tras cualquiera de ellas una nueva pulsación vuelve a lanzar el picker. El estado `photoUploading` se conserva para la UI (`accessibilityState` y `disabled`).

### O2 — Foto en `PetSwitcher variant="avatars"`

- **R3** (solo test, nace verde): WHEN `PetSwitcher variant="avatars"` pinta una mascota con `photoUrl` THE SYSTEM SHALL renderizar el avatar con `size` 40 y `cacheKey` igual al id de **esa** mascota: con dos mascotas con foto (`pet-1`, nombre `Luna`, `http://example.test/luna.jpg`; `pet-2`, nombre `Milo`, `http://example.test/milo.jpg`), el host `pet-avatar-image-pet-1` tiene `props.source` `[{ uri: 'http://example.test/luna.jpg', cacheKey: 'pet-1' }]` y `pet-avatar-image-pet-2` tiene `[{ uri: 'http://example.test/milo.jpg', cacheKey: 'pet-2' }]`, y ambos tienen `props.style` `{ width: 40, height: 40, borderRadius: 20 }`. Los literales se escriben a mano en el test.

### O6 — Botón de cerrar sesión

- **R4** (solo test, nace verde): WHEN Perfil se pinta THE SYSTEM SHALL mantener el botón `profile-sign-out` con variante `danger-soft` y las clases `rounded-xl bg-danger-soft`, sin clases chunky ni de otra variante: `screen.getByTestId('profile-sign-out').props.className` es exactamente `'pressable-feedback__root button__root button__root--variant-danger-soft button__root--size-md rounded-xl bg-danger-soft'`. La cadena sigue el precedente del mismo `Button` (misma variante, clases y tamaño por defecto) en `src/screens/geofence-editor/index.test.tsx`; si la primera corrida la ve distinta, Codex se detiene y lo reporta (ver Decisiones pendientes), no ajusta a ciegas.

### Flake del me-card

- **R5** (solo test): WHEN la cuenta resuelve con `kind: 'ok'` THE SYSTEM SHALL mostrar el nombre `Ada Lovelace` y el correo `ada@example.test` en `me-card`, y el test que lo verifica SHALL esperar al árbol que después asevera: en `src/screens/profile/index.test.tsx`, it `shows the real account name and email` del describe `R1: me card`, la espera `await waitFor(() => expect(screen.getByTestId('me-card')).toBeVisible());` más la lectura síncrona `expect(screen.getByText('Ada Lovelace')).toBeVisible();` se sustituyen por `expect(await screen.findByText('Ada Lovelace')).toBeVisible();`; el correo y `expect(mockGetMe).toHaveBeenCalledWith(apiUrl, 'jwt-token')` se conservan. Verificación del arreglo (el flake no se puede poner rojo-primero): un spike con mutación no commiteada que retrasa la resolución de `getMe` pone en rojo el cuerpo antiguo y en verde el nuevo (ver tasks.md §R5).

### Transversales

- **R6**: THE SYSTEM SHALL cerrar esta feature sin ningún cambio visual de Perfil y sin tocar código fuera de tres ficheros: `src/screens/profile/index.tsx` (solo R2: la declaración de `photoBusyRef` y el cuerpo de `handleChangePhoto`; cero cambios en JSX, clases, copy o `src/i18n/`), `src/screens/profile/index.test.tsx` y `src/components/__tests__/pet-switcher.test.tsx`. Criterios medibles al cierre, todos sobre el diff de la feature (`git diff --name-only <H0>..HEAD`, con H0 el HEAD del handoff): la lista es exactamente esos tres ficheros más `specs/`, `progress/` y `feature_list.json`; el diff de `src/screens/profile/index.tsx` no cambia ninguna línea de JSX (ni `className`, ni `testID`, ni `accessibilityState`, ni `disabled`, ni `onPress`); grep-clean de `docs/ui-guidelines.md` §3 sobre las líneas añadidas de los tres ficheros: cero hex (`grep -nE '#(?!\d{2,3} R\d)[0-9a-fA-F]{3,8}\b'` con `-P`; el patrón es el `HEX_LITERAL` de `src/__tests__/design-drift.test.ts`, que exime solo `#NNN R<n>`: todo nombre de `it`/`describe` y todo comentario nuevo cita `#184 R<n>` completo, nunca `#184` suelto), cero clases arbitrarias `[...]` añadidas, cero `StyleSheet.create`, cero `shadow*`/`elevation` legacy; ningún emoji. La suite completa (`./init.sh`, que corre el leader, nunca Codex) queda verde.

## Decisiones humanas pendientes

| Decisión | Valor por defecto de la spec | Si el humano discrepa |
|---|---|---|
| R2 cambia producción (guardia por ref) en lugar de quedarse en test-only | Incluida: sin ella el doble toque con el picker abierto lanza dos pickers | Quitar R2 y su tarea; R1 sigue válido y pierde solo la parte de «un segundo toque no relanza», que queda cubierta por la sonda `onStartShouldSetResponder` |
| Cadena exacta de clases de R4 | La del precedente de geofence-editor (`button__root--size-md`) | Si la primera corrida difiere, Codex reporta la cadena real en `progress/impl_mobile-profile-followups.md` y el leader decide; no se enmienda sola |

## Fuera de alcance

- Salud y Nutrición (features aparte) y cualquier cambio visual de Perfil.
- La `className` del label del botón de cerrar sesión (`font-bold text-danger`): O6 cubre solo la del botón.
- La rama `variant="default"` de `PetSwitcher` (usa `Avatar` de HeroUI, no `PetAvatar`) y el resto de controles de Perfil.
- El `it` de `#87 R16` que lee `queryClient.getQueryData(userKeys.me())` en síncrono: patrón parecido pero sin flake medido; no se toca.
- El rechazo de `launchImageLibraryAsync` (excepción del picker, hoy sin `try`): R2 libera la guardia por el `finally` pero no lo prueba ni cambia su manejo.
- Cambios al copy, al catálogo i18n, a inventarios o a candados de otras features: esta feature no debe moverlos (ver [[design]] §Candados e inventarios).

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-20) ← gate obligatorio antes de implementar
