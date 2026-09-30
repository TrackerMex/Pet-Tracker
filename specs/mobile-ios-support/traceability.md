---
feature: "mobile-ios-support"
status: spec_ready         # draft | spec_ready | approved
tags: [spec, mobile, ios, eas, universal-links]
---

# Trazabilidad — [[mobile-ios-support]] (#60)

Los tests viven en `mobile-pet-tracker/`:

- R1 en `src/components/__tests__/pet-map.test.tsx` («el test de `PetMap`»);
- R2 en `src/screens/map/index.test.tsx` («el test del mapa»);
- R3 en `src/screens/add-pet/index.test.tsx` y
  `src/screens/profile/index.test.tsx`;
- R4 a R7 en `app.config.test.ts`;
- R8 y R9 en `src/__tests__/hosting-artifacts.test.ts`.

Cada nombre es el que imprime jest (`describe › it`); en los `it.each` se
citan todos los casos.

| Requisito | Test (archivo::nombre) | Commit rojo | Commit verde |
|---|---|---|---|
| R1 | `pet-map.test.tsx::#60 R1: en iOS PetMap pinta AppleMaps.View con el contrato del tab Map › #60 R1: en Android pinta GoogleMaps.View y nunca AppleMaps.View` (centinela, verde también en el rojo), `… › en iOS › #60 R1: pinta AppleMaps.View y nunca GoogleMaps.View, con cámara, marker, polylines y estilo del contrato`, `… › en iOS › #60 R1: mapea el tema dark al esquema nativo DARK`, `… › en iOS › #60 R1: mapea el tema light al esquema nativo LIGHT` y `… › en iOS › #60 R1: oculta el botón de mi ubicación y el cambio de inclinación, sin contentPadding` | pendiente | pendiente (verde común de R1 y R2) |
| R2 | `map/index.test.tsx::#60 R2: en iOS el tab Map monta el mapa de Apple con la última posición › #60 R2: centra el mapa de Apple en la última posición y oculta sus controles de ubicación e inclinación` | pendiente | pendiente (el mismo verde común que R1) |
| R3 | `add-pet/index.test.tsx::R7: foto opcional tras alta › #60 R3: pide al picker la representación compatible para que iOS entregue JPEG y no HEIC` y `profile/index.test.tsx::R7: cambiar foto › #60 R3: pide al picker la representación compatible para que iOS entregue JPEG y no HEIC` | pendiente | pendiente |
| R4 | `app.config.test.ts::#60 R4: app.json declara la identidad de iOS › #60 R4: fija bundleIdentifier, deploymentTarget 17.0 y cifrado exento sin tocar el icono` | pendiente | pendiente |
| R5 | `app.config.test.ts::#60 R5: app.json deja solo el permiso de galería, en español › #60 R5: declara expo-image-picker con el texto de galería y sin cámara ni micrófono` y `… › #60 R5: declara expo-secure-store sin Face ID y una sola vez por plugin`; enmienda una línea de `#79 R2: app.json declara el plugin de notificaciones y POST_NOTIFICATIONS › conserva los plugins existentes y añade expo-notifications` | pendiente | pendiente |
| R6 | `app.config.test.ts::#60 R6: RESET_LINK_HOST declara el dominio asociado de iOS › #60 R6: con clave de mapas y google-services.json, añade applinks del host recortado a ios` y `… › #60 R6: sin clave de mapas ni google-services.json (builder de EAS), añade applinks del host recortado a ios` | pendiente | pendiente |
| R7 | `app.config.test.ts::#60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host ausente no declara associatedDomains y avisa una vez por Android e iOS`, `… › #60 R7: con un host vacío …` y `… › #60 R7: con un host solo espacios …` | pendiente | pendiente |
| R8 | `hosting-artifacts.test.ts::#60 R8: apple-app-site-association delega /reset-password en la app de iOS › #60 R8: publica un único detalle para el App ID de iOS y solo la ruta de reset` y `… › #60 R8: fuerza application/json solo para el fichero sin extensión` | pendiente | pendiente |
| R9 | `hosting-artifacts.test.ts::#60 R9: la guía de iOS y RESET_LINK_HOST quedan documentadas › #60 R9: documenta los gates de iOS en la sección Feature 60`, `… › #60 R9: el README de hosting explica el AASA, su .htaccess y el Team ID, y AGENTS.md lo nombra` y `… › #60 R9: la fila de RESET_LINK_HOST y el .env.example móvil nombran la variable de EAS` | pendiente | pendiente |
| R10 | sin test: cierre medido ([[tasks]] §R10 y `progress/impl_mobile-ios-support.md`) | no aplica | pendiente (el hash del **verde de R9**) |
| R11 | sin test: gate humano, AASA publicado en Hostinger ([[requirements]] §Gate humano — R11) | no aplica | pendiente (casilla del humano) |
| R12 | sin test: prueba de humo del humano en el dev build de iOS en iPhone ([[requirements]] §Prueba de humo del humano — R12) | no aplica | pendiente (casilla del humano) |
| R13 | sin test: regresión de Android del humano en el dev build de Android ([[requirements]] §Regresión de Android del humano — R13) | no aplica | pendiente (casilla del humano) |

Regla: el reviewer no aprueba si alguna fila de R1 a R10 queda «pendiente».
Las casillas de R11, R12 y R13 las marca el humano: R11 antes de la prueba de
humo, y R12 y R13 después del veredicto. La feature no pasa a `done` sin las
tres.

## Convención de commit

- Rojo: `test(mobile): <desc> (R<n>)`. Solo toca los tests del requisito.
- Verde: `feat(mobile): <desc> (R<n>)`; el común de R1 y R2 lleva `(R1,R2)`,
  el de R8 es `feat(hosting): …` y el de R9 es `docs: …`. Cada verde toca solo
  los ficheros que cita su paso.
- Evidencia: `docs(mobile): record the iOS support evidence (R10)`.

Los mensajes exactos están en [[tasks]]. Las filas de R1 y R2 citan el mismo
commit verde.

## Requisitos sin test propio

- **R10** se verifica con las medidas de [[tasks]] §R10: los seis ficheros de
  test, los guardas, `tsc`, `eslint`, la introspección de los plugins, las
  cifras de candado, la lista cerrada de ficheros, los ficheros que no cambian,
  la historia, los blobs finales y la tabla de sondas re-medida. Su fila cita
  el hash del **verde de R9**, que es el último commit con cambios de la
  feature. El commit de evidencia solo toca `progress/` y esta tabla, y
  citarlo haría que la fila apuntara a un commit sin código.
- **R11** lo cierra el humano con su casilla en [[requirements]] §Gate humano
  — R11.
- **R12** lo cierra el humano con su casilla en [[requirements]] §Prueba de
  humo del humano — R12.
- **R13** lo cierra el humano con su casilla en [[requirements]] §Regresión
  de Android del humano — R13.

El implementer rellena esta tabla en el commit de evidencia y el reviewer la
valida al aprobar (ver [[../../docs/specs|specs]] y
[[../../CHECKPOINTS|CHECKPOINTS]] C5). **No rebasees** la branch después de
rellenarla, porque los hashes dejarían de valer. Si hace falta, reapunta cada
hash y comprueba con `git merge-base --is-ancestor <hash> HEAD` que sigue en la
historia.
