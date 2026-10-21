---
feature: "mobile-edit-profile"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-edit-profile]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> El backend no cambia: `PATCH /v1/me` ya existe. Todo el trabajo vive en
> `mobile-pet-tracker/` más las dos docs de la carta.

## Decisiones técnicas

- **Reglas de perfil como función pura compartida (R2).** `validateProfile` sale de
  `validateRegister` y este la llama. Así el registro y la edición no pueden
  divergir en límites (120, 7..20, país de dos letras mayúsculas) y las 8 reglas
  se prueban una vez. Alternativa descartada: copiar las reglas a la pantalla.
- **`updateMe` espeja a `getMe` y a los clientes de `geofences.ts` (R3).** Resultado
  discriminado por `kind`, `fetchFn` inyectable, `patchJson` de `http.ts`. El 400 no
  devuelve el cuerpo del servidor: la enmienda #186 prohíbe pintar texto crudo, y así
  el tipo mismo impide que la pantalla lo muestre.
- **Misma `queryKey` y mismo `queryFn` que Perfil (R5, R7, R9).** La pantalla de edición
  lee `userKeys.me()`; al venir de Perfil el dato ya está en caché, sin parpadeo. El éxito
  del `PATCH` escribe esa clave con `setQueryData`: Perfil se repinta sin segunda petición
  y sin `invalidateQueries`. Alternativa descartada: `invalidateQueries` (una petición
  extra y un parpadeo del Skeleton).
- **El formulario se monta solo con el perfil `ok` y siembra el estado una vez (R5).**
  `EditProfileForm({ me })` inicializa con `useState(me.x)`; no hay `useEffect` que
  sincronice. Así un refetch en segundo plano no pisa lo que el usuario escribe.
  Alternativa descartada: un único componente con `useEffect` que copia `data` al estado
  (carrera entre escritura y refetch, y un render con valores vacíos).
- **Validar al pulsar, reemplazar `fieldErrors` entero (R6).** Mismo contrato que #183 y
  #186. Un campo corregido pierde el mensaje al siguiente Guardar, no al escribir.
- **Solo lo que cambió, recortado (R7, D3).** El body del `PATCH` lleva únicamente los
  campos distintos; el DTO admite todos opcionales y un body vacío es no-op sin auditoría.
  Evita pisar un campo con el valor de una caché vieja y deja `timezone` intacta (D2).
  Alternativa descartada: enviar siempre los cuatro (más ruido de auditoría y pisa cambios
  hechos desde otro dispositivo).
- **Sin cambios no hay petición (R7, D4).** Se cierra con `router.back()`.
- **Errores por clave de catálogo, nunca texto del servidor (R8).** 401 cierra sesión sin
  mensaje (patrón de las pantallas de cuenta); 400, red y resto caen en tres claves ya
  existentes, así que no se añade copy de error.
- **Ruta empujada al Stack raíz, protegida (R4).** `src/app/edit-profile.tsx` delgado, la
  pantalla en `src/screens/edit-profile/` (estructura Expo de #39). Se registra al final del
  `Stack.Protected`, con cabecera nativa y `title: ''`; el título vive en el contenido. Se
  añade a la excepción A11 (padding 24, gap 16) en las dos docs: enmienda A22.
- **Punto de entrada: fila dentro de `me-card` (R9).** Reutiliza la receta de fila de
  `language-toggle`; no mueve el lienzo de Perfil más que una fila. La decisión de producto
  es P5 del gate.
- **Copy mínimo (R1).** Dos claves nuevas; las etiquetas reutilizan `register.*`.
- **Todo candado de inventario se mueve en el R que introduce la línea** (ver §Deltas de
  candados): el `t(` exacto por fila, el CTA del chunky, el recuento de `rounded-16`. Un
  delta en un R anterior al de su línea nace rojo por la razón equivocada.

## Archivos afectados

Rutas relativas al repo. Capas: la app móvil es solo presentación y cliente; no hay
domain/application/infrastructure propios.

Producción (móvil):

- `mobile-pet-tracker/src/i18n/catalog.ts` — 2 claves, `en` y `es` (R1).
- `mobile-pet-tracker/src/utils/account-rules.ts` — extrae `ProfileValues` y `validateProfile`; `validateRegister` la llama (R2).
- `mobile-pet-tracker/src/api/users.ts` — `UpdateProfileInput`, `UpdateMeState`, `updateMe` (R3).
- `mobile-pet-tracker/src/screens/edit-profile/index.tsx` — nuevo: `EditProfileScreen` y `EditProfileForm` (R4 stub, R5 a R8).
- `mobile-pet-tracker/src/app/edit-profile.tsx` — nuevo: route delgado (R4).
- `mobile-pet-tracker/src/app/_layout.tsx` — `Stack.Screen name="edit-profile"` al final del grupo protegido (R4).
- `mobile-pet-tracker/src/screens/profile/index.tsx` — fila `edit-profile-link` en `me-card` (R9).

Tests y candados:

- `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx` (R1).
- `mobile-pet-tracker/src/utils/account-rules.test.ts` (R2).
- `mobile-pet-tracker/src/api/__tests__/users.test.ts` (R3).
- `mobile-pet-tracker/src/app/__tests__/{detail-stack,layout,detail-stack.guard,detail-stack.navigation}.test.tsx` (R4).
- `mobile-pet-tracker/src/screens/edit-profile/index.test.tsx` — nuevo (R5 a R8).
- `mobile-pet-tracker/src/screens/profile/index.test.tsx` (R9).
- `mobile-pet-tracker/src/__tests__/ui-copy-table.ts`, `ui-language.test.ts`, `design-drift.test.ts`, `chunky-cta-canvas-fidelity.test.ts`, `consistency-classnames.test.ts` (deltas por R).
- `mobile-pet-tracker/src/__tests__/edit-profile.test.ts` — nuevo: grep-clean, D2, carta (R5, R10).

Docs:

- `specs/mobile-ui-language/design.md` — sección §2.N (R1).
- `docs/ui-guidelines.md` — lista A11 y `## Enmienda #194` (R10).
- `docs/conventions.md` — lista A11 y bloque de enmienda A22 (R10).

Backend: ninguno.

## Alternativas descartadas

- **Editar en un modal o en una pestaña propia.** Las pantallas de formulario del repo son rutas empujadas con cabecera nativa; el patrón A11 ya existe.
- **Reutilizar `register/index.tsx` con un prop `mode`.** Mezcla correo, contraseña y huso del dispositivo con un formulario que no los tiene; la receta se copia, no se parametriza.
- **Campo de zona horaria o reenviar la del dispositivo.** Ver P1 del gate. Se descarta como defecto por la consecuencia de pisar un dato que el usuario no ve.
- **Mostrar el correo de solo lectura.** Añade copy y decisión de diseño sin necesidad; P2 del gate.
- **Aviso de éxito.** La tarjeta de Perfil actualizada es la confirmación; P3.
- **`useMutation` de React Query.** El resto de pantallas de formulario usan `async function` con `useState`; una sola forma de hacerlo. El costo es manejar `submitting` a mano.
- **Selector de países.** El DTO no tiene catálogo; sería feature de UI aparte (P6).
