# Spec — mobile-profile-followups (#184)

Spec: `specs/mobile-profile-followups/requirements.md` (status `spec_ready`, gate humano sin firmar).
Base medida: `f32b8d13` (origin/main). Solo lectura y grep; no se corrió jest, tsc, lint ni init.sh.

## Premisas de la descripción

- O1 `disabled={photoUploading}` sin candado: VERDADERA.
- O1 «test que pulse dos veces durante una subida pendiente»: PARCIAL. Solo candaría `disabled` y queda ciego en cuanto exista la guardia. R1 añade la sonda `onStartShouldSetResponder()` del host, que depende solo de la prop `disabled`.
- O1 sin guardia de reentrada: VERDADERA y mayor de lo descrito. `setPhotoUploading(true)` solo ocurre tras resolver el picker, así que con el picker abierto el control sigue habilitado y dos toques lanzan dos pickers. Por eso R2 es cambio de producción (guardia por `useRef`, test rojo primero).
- O2 (`size={40}`, `cacheKey={pet.id}`): VERDADERA. El candado va en `pet-switcher.test.tsx` porque `PetSwitcher` está mockeado en el test de Perfil.
- O6 (`className` de `profile-sign-out`): VERDADERA.
- Flake me-card: VERDADERA, un solo sitio. Los `it.each` hermanos esperan `me-card-state` (solo existe tras cargar). `#87 R16` lee `getQueryData` en síncrono: fuera de alcance, sin flake medido.

## Decisiones abiertas para el humano

1. R2 incluida por defecto (cambia producción solo en `handleChangePhoto` y su ref). Si prefiere test-only, se quita R2; R1 sigue siendo válido.
2. R4 usa la cadena de clases del mismo `Button` en `src/screens/geofence-editor/index.test.tsx` (`button__root--size-md`). No se pudo confirmar sin correr jest; si la primera corrida difiere, Codex reporta y decide el leader.

## Notas para el handoff

- El flake no admite commit rojo: el rojo de R5 se demuestra con un spike (retraso artificial de `getMe`), descrito en tasks.md §R5.
- R1, R3, R4, R5 nacen verdes; su rojo es por mutación (X1 a X15, tabla en design.md con rojo esperado por consulta). R2: solo el doble toque con picker abierto es rojo en H0; las siete filas de liberación nacen verdes y se candan por X5 y X6 (X6 es la zona ciega: liberar solo en el `finally` interno).
- Hex: los nombres de tests y comentarios nuevos deben citar `#184 R<n>` completo (el `HEX_LITERAL` de design-drift exime solo `#NNN R<n>`).
- Codex: nombres de skills del plugin `expo@openai-curated` v1.0.2 en el handoff, no los del leader; `await fireEvent.press` y `await act(async ...)`; no correr `init.sh`.
- Fuera de alcance anotado: label del botón de cerrar sesión, rama `default` de PetSwitcher, rechazo del picker (sin `try` hoy), `#87 R16`.
