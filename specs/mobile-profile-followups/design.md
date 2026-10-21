---
feature: "mobile-profile-followups"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[mobile-profile-followups]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Rutas relativas a `mobile-pet-tracker/`. Todo es capa de presentación móvil (`src/screens`, `src/components`); no hay domain/application/infrastructure del backend implicados.

## Decisiones técnicas

- **Los candados nuevos de Perfil van en un describe nuevo `#184 R<n>: ...` al final de `src/screens/profile/index.test.tsx`**, no mezclados en `R7: cambiar foto` ni en `#168 R4`. Así el commit de cada R toca un bloque propio y el reviewer lo ubica por nombre (R1, R2, R4). El `beforeEach` del describe replica el de `R7: cambiar foto` (clearAllMocks, `process.env.EXPO_PUBLIC_API_URL = apiUrl`, `mockUseAuth` autenticado con `signOut: mockSignOut`, `mockGetMe` pendiente, mascota `makePet({ photoUrl: 'http://example.test/old.jpg' })` en `mockListPets` y `mockGetPet`). El R5 no abre describe: edita su `it` en `R1: me card`. (R1, R2, R4, R5)
- **R1 candaría `disabled` por la sonda de host, no por el contador de llamadas.** RN 0.86 `Pressable` fija `accessibilityState.disabled` cuando recibe `disabled` y su `onStartShouldSetResponder` devuelve `!disabled`; RNTL 14 `fireEvent.press` solo entrega el evento si ese responder no devuelve `false`. Consecuencias medidas: (a) quitar `disabled={photoUploading}` deja `accessibilityState.disabled` en `true` porque la línea `accessibilityState={{ disabled: photoUploading }}` es otra prop explícita, así que el test de `accessibilityState` actual no lo ve; (b) sin `disabled`, un segundo `fireEvent.press` sí llega al handler. Antes de R2 la mutación se ve por el contador (el picker se lanzaría dos veces); después de R2 la guardia absorbe el segundo toque y solo la sonda `onStartShouldSetResponder()` sigue en rojo. Por eso R1 asevera ambas y la tabla de mutaciones corre la misma mutación en dos momentos. (R1)
- **R2: guardia síncrona con `useRef<boolean>`, no con estado.** `setPhotoUploading(true)` se aplica tras el `await` del picker y `setState` no es síncrono: dos pulsaciones en el mismo tick ven `photoUploading === false`. Un ref sí es observable de inmediato. Forma prescrita (intención, no código a copiar): declarar `photoBusyRef` junto a `selectedPetIdRef`; en `handleChangePhoto`, tras `if (!pet) return`, `if (photoBusyRef.current) return; photoBusyRef.current = true;` y envolver el resto en `try { ... } finally { photoBusyRef.current = false; }`; el `try/catch/finally` interno existente (que apaga `photoUploading`) se conserva tal cual, el nuevo `finally` es el externo. El ref se libera en la salida de **todas** las ramas, también las anteriores al `setPhotoUploading(true)` (picker cancelado, formato no soportado), que es justo donde una guardia «solo en el finally interno» se quedaría pegada. (R2)
- **R2 test rojo = doble toque con el picker abierto.** El picker se mockea con una promesa que no resuelve (helper `pending<T>()` ya existente en el fichero) y se pulsa dos veces con `await fireEvent.press`; se espera exactamente 1 llamada a `mockLaunchImageLibrary`. En H0 da 2 (rojo). Al terminar el test se resuelve el picker con `{ canceled: true, assets: null }` dentro de `await act(async () => ...)` para no dejar un `setState` colgado que contamine el `it` siguiente. Las ramas de liberación se prueban con `it.each` por salida: ciclo completo (pulsar, esperar fin, pulsar otra vez, `mockLaunchImageLibrary` con 2 llamadas). Nacen verdes con la guardia completa y se ponen en rojo por mutación (tabla abajo): son el candado de la liberación, no del bloqueo. (R2)
- **R3: aserciones sobre el host de `expo-image`, igual que ya hace el test de `profile-pet-avatar`.** En jest el host expone `props.source` como arreglo `[{ uri, cacheKey }]` y `props.style` como objeto plano. Dos mascotas con ids y nombres distintos cubren las mutaciones `cacheKey={pet.name}`, `cacheKey={pets[0].id}` y `cacheKey` constante; el tamaño se fija por `style` (`width`/`height`/`borderRadius` derivan de `size` en `PetAvatar`). (R3)
- **R4: cadena exacta de `className`, no `toContain`.** Un `toContain('bg-danger-soft')` dejaría pasar `rounded-2xl bg-danger-soft`. Se usa la cadena completa del precedente para el mismo `Button` en geofence-editor (`pressable-feedback__root button__root button__root--variant-danger-soft button__root--size-md rounded-xl bg-danger-soft`). Los demás candados de clases del repo no matchean `rounded-xl bg-danger-soft` (medido: ninguna regex de inventario lo cubre), así que no se mueve ninguno. (R4)
- **R5: se corrige la espera, no se sube el timeout ni se reintenta.** La causa es que `me-card` existe durante la carga con el skeleton dentro, así que `waitFor(me-card)` pasa en el primer render y `getByText('Ada Lovelace')` lanza. La condición de espera debe ser la misma observación que la aserción posterior (docs/conventions.md §Esperas): `await screen.findByText('Ada Lovelace')`. El correo se lee en síncrono justo después: va en el mismo JSX que el nombre y no puede faltar si el nombre ya está. Como el flake depende de la carga y no se reproduce corrido solo, el rojo se demuestra con un spike (retraso artificial de `getMe`), no con un commit rojo. (R5)
- **Un solo escritor sobre `src/screens/profile/index.tsx`, y solo en R2.** Los R1, R3, R4 y R5 no tocan producción; sus mutaciones se plantan en `src/screens/profile/index.tsx` y `src/components/pet-switcher.tsx` y se revierten con `git checkout HEAD -- <ruta>` más `git diff --stat` vacío antes del commit. (R6)

## Candados e inventarios

Sin delta esperado. No se añade ni cambia ninguna clase, copy ni `testID` de producción, así que no se mueve ningún inventario (`src/__tests__/*canvas-fidelity*`, `ui-copy-table.ts`, `design-drift`, `consistency-classnames`, guards de legibilidad `#61 R1`). Los tests nuevos no importan nada de `src/theme/` ni de `src/i18n/catalog.ts`: literales escritos a mano. Si `design-drift` o un inventario se pone rojo por algo de esta feature, es un hallazgo a reportar, no a parchear en producción.

## Tabla de mutaciones (candado por consulta)

Cada fila se planta a mano en el fichero indicado, se corre **solo** el test nombrado (desde `mobile-pet-tracker/`: `bunx jest <ruta-del-fichero> -t '<nombre del describe o it>'`; la config de jest vive en `package.json`), se anota el rojo y se revierte. Ninguna mutación se commitea.

| # | Mutación | Fichero | Momento | Rojo esperado |
|---|---|---|---|---|
| X1 | borrar la línea `disabled={photoUploading}` | `src/screens/profile/index.tsx` | tras el commit de test de R1, antes de R2 | R1: la sonda `onStartShouldSetResponder()` (esperaba `false`) y el contador (`launchImageLibraryAsync` 2 veces) |
| X2 | la misma que X1 | `src/screens/profile/index.tsx` | tras el verde de R2 | R1: solo la sonda; el contador sigue en 1 por la guardia |
| X3 | `disabled={false}` (control siempre pulsable) | `src/screens/profile/index.tsx` | tras R2 | R1: rojo antes de la sonda, en la espera de `accessibilityState` (medido en #184: RN impone `disabled: false` sobre esa prop); el contador sigue en 1 por la guardia |
| X4 | quitar la guardia: borrar `if (photoBusyRef.current) return;` | `src/screens/profile/index.tsx` | tras R2 | R2: doble toque con el picker abierto (2 llamadas, esperaba 1) |
| X5 | no liberar nunca: borrar `photoBusyRef.current = false;` | `src/screens/profile/index.tsx` | tras R2 | R2: todos los `it.each` de liberación (una fila por salida); el doble toque sigue verde |
| X6 | liberar solo en el `finally` interno (zona ciega) | `src/screens/profile/index.tsx` | tras R2 | R2: las filas de liberación `picker cancelado` y `formato no soportado` (salen antes del `try` interno); las demás salidas siguen verdes |
| X7 | `size={40}` a `size={44}` | `src/components/pet-switcher.tsx` | tras R3 | R3: `style` esperaba `{ width: 40, height: 40, borderRadius: 20 }` |
| X8 | quitar `cacheKey={pet.id}` | `src/components/pet-switcher.tsx` | tras R3 | R3: `source` esperaba `cacheKey` |
| X9 | `cacheKey={pet.name}` | `src/components/pet-switcher.tsx` | tras R3 | R3: `source` de ambos avatares (`Luna` y `Milo` no son sus ids) |
| X10 | `cacheKey={pets[0].id}` | `src/components/pet-switcher.tsx` | tras R3 | R3: `source` de `pet-avatar-image-pet-2` (esperaba `pet-2`) |
| X11 | `className="rounded-2xl bg-danger-soft"` | `src/screens/profile/index.tsx` | tras R4 | R4: cadena exacta |
| X12 | quitar `bg-danger-soft` de la `className` | `src/screens/profile/index.tsx` | tras R4 | R4: cadena exacta |
| X13 | quitar `rounded-xl` de la `className` | `src/screens/profile/index.tsx` | tras R4 | R4: cadena exacta |
| X14 | `variant="danger-soft"` a `variant="danger"` | `src/screens/profile/index.tsx` | tras R4 | R4: cadena exacta (cambia `button__root--variant-*`) |
| X15 | `mockGetMe` con retraso (spike, ver tasks.md §R5) | `src/screens/profile/index.test.tsx` | antes y después de editar R5 | cuerpo antiguo rojo, cuerpo nuevo verde |

La fila X3 afirma que `accessibilityState` no basta; si en la primera corrida de X3 el rojo sale por otra aserción distinta de la sonda, Codex lo anota en su informe (no cambia el requisito).

## Archivos afectados

- `src/screens/profile/index.tsx` — presentación; **solo R2**: declaración de `photoBusyRef` (`useRef<boolean>(false)`, junto a `selectedPetIdRef`) y cuerpo de `handleChangePhoto`. Cero cambios de JSX.
- `src/screens/profile/index.test.tsx` — tests; R1, R2 y R4 en el describe nuevo `#184 R<n>: ...` al final del fichero; R5 edita el it existente `shows the real account name and email`.
- `src/components/__tests__/pet-switcher.test.tsx` — tests; R3 como `it` nuevo dentro del describe `#173 R4: variante avatars`, reutilizando el helper `renderAvatars` y `makePet` del fichero.
- `specs/mobile-profile-followups/*`, `progress/impl_mobile-profile-followups.md`, `feature_list.json` — documentación y harness.

## Alternativas descartadas

- **Dejar R2 fuera y solo candar `disabled`:** descartada. Con el picker abierto `photoUploading` sigue en `false`, el control está habilitado y dos toques reales lanzan dos pickers; candar `disabled` sin guardia fija un comportamiento incompleto. Queda como decisión humana pendiente por si prefiere test-only.
- **Guardia por estado (`if (photoUploading) return`):** descartada: `setState` es asíncrono y dos toques en el mismo tick ven el valor viejo.
- **Mover `setPhotoUploading(true)` antes del picker:** descartada: cambia la UI (la cámara pasaría a «deshabilitada» mientras el selector del sistema está abierto) y las ramas cancelada y formato no soportado tendrían que apagarla; es un cambio visible, fuera de alcance.
- **Candar `disabled` solo con «pulsar dos veces y contar llamadas»:** descartada: queda ciego a la mutación en cuanto existe la guardia (X2).
- **`toContain('bg-danger-soft')` en R4:** descartada: sobrevive a cambios de radio y de variante.
- **Subir el timeout del `waitFor` o reintentar el test para el flake:** descartada: esconde la condición de espera equivocada (esperar a `me-card` en vez de al nombre).
- **Probar R3 desde el test de Perfil:** descartada: `PetSwitcher` está mockeado allí.
