Worktree: /home/claude/sites/Pet-Tracker

```text
/home/claude/sites/Pet-Tracker/mobile-pet-tracker
feature/60-mobile-ios-support
```

HEAD del handoff: `00246f6bdde835cccd08cfbc9bb9e9f6f9c5d5b6`.

Inicio: 2026-09-30. Branch comprobada; árbol e índice limpios al arrancar.
Se sigue el guion aprobado de #60. Por instrucción del humano no se ejecuta
init.sh ni se modifican los ficheros de lifecycle del leader.

Skills cargadas: `building-native-ui` (1.0.1), `expo-dev-client` (1.0.0),
`expo-deployment` (1.0.0), del plugin instalado expo v1.0.2;
`appllama-app-design-skill` (1.3.0) de `.agents/skills/`; `ponytail` (full).
Las dos skills de EAS se leen sin ejecutar sus comandos. La carta y el guion
aprobado ganan sobre las recomendaciones genéricas; sin simulator loop.
Documentación versionada SDK 57 consultada antes de editar código:
https://docs.expo.dev/versions/v57.0.0/ y sus páginas Maps e ImagePicker.

Suite completa: el humano respondió «No; dejarla al leader».
Base completa comunicada en el handoff: 86 suites / 1619 tests; no se reejecuta.
Esperado para el leader: 86 / 1640, delta +21 tests / +0 suites.

Blobs de base medidos:

| Ruta | Medido | Resultado |
|---|---|---|
| src/components/pet-map.tsx | 08c6e385cc84eb80cd5482dfc978e2140c148b2d | coincide |
| src/components/__tests__/pet-map.test.tsx | 1e94de457f4a7e5c066c6213cde14ad4e9eb5328 | coincide |
| src/screens/map/index.test.tsx | 2fd0daec7b40f2f2cbe9e3fa0975cbabc64957cc | coincide |
| src/screens/add-pet/index.tsx | 6ee79a8fa8bbdd4a123ada5c67d108f1d4e902c7 | coincide |
| src/screens/add-pet/index.test.tsx | 9b52b5d69159deedbc2aa8c699d3916923cfad75 | coincide |
| src/screens/profile/index.tsx | 4cc1c08b3519578b322a839464262b1896897fd1 | coincide |
| src/screens/profile/index.test.tsx | 08203f122680405794868b20419a1c22d6ca601d | coincide |
| app.json | 9beaa54eca04d46320fd256adb6e0cf2b4909319 | coincide |
| app.config.ts | 9256c22e40c5a010688ecd56a5d034a47dd946dd | coincide |
| app.config.test.ts | fdb6789e68a1e3747de47f6f5c31e336afec3b35 | coincide |
| src/__tests__/hosting-artifacts.test.ts | 03b8322632dde2313819833500740c4ccefbef6e | coincide |
| .env.example | 2f1086a1e4d554a6e15d999020ce1a3c000684a9 | coincide |
| eas.json | b52225c6e3dedb0ca522441f401e0ffdce71201c | coincide |
| package.json | 7ee4a80719e09041e6c3fa63f55d1b03632c0768 | coincide |
| bun.lock | 3bd3a09cd94ec108fbea458427b41209a425636b | coincide |
| ../docs/verification.md | 69b08b469ad018bf811cf5e3dec70e8034819532 | coincide |
| ../hosting/README.md | 9e35e86f45e050b1e8d8aac6bab5302bb372175d | coincide |
| ../AGENTS.md | a15920b3bc61cc5d3b48efdb99cec066ec36ab9f | coincide |
| ../docs/conventions.md | 78ed538c70c544989e296ee71a890b49c2bd7e0d | coincide |

Comprobaciones iniciales: sin router.d.ts (exit=0), AASA y .htaccess ausentes
(exit=0), Platform.OS en producción=3, launchImageLibraryAsync en producción=2.
Base dirigida: Test Suites: 6 passed, 6 total; Tests: 148 passed, 148 total; exit=0.
Guardas de base: Test Suites: 3 passed, 3 total; Tests: 111 passed, 111 total; exit=0.
Introspección de base: expo config exit=0; borrado inmediato de ambos temporales;
comprobación posterior router.d.ts exit=0. Única línea extraída:

```text
{"usage":["NSCameraUsageDescription","NSFaceIDUsageDescription","NSLocalNetworkUsageDescription","NSMicrophoneUsageDescription","NSPhotoLibraryUsageDescription"],"photos":"Allow $(PRODUCT_NAME) to access your photos","aps":"development","android":["android.permission.RECORD_AUDIO"]}
```

Discrepancias: no hay discrepancia entre el prompt y tasks.md que cambie los
literales de la feature. La base completa 1619 comunicada sustituye a 1613;
R10 permite exigir el delta. La instrucción genérica de verification.md de
actualizar trazabilidad en cada commit cede al guion específico de R10.
Se añadió una comprobación de domains antes de imprimir la línea extraída,
para parar sin mostrar ningún dominio inesperado.

r1:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       4 failed, 9 passed, 13 total
```

- #60 R1: en iOS PetMap pinta AppleMaps.View con el contrato del tab Map › en iOS › #60 R1: pinta AppleMaps.View y nunca GoogleMaps.View, con cámara, marker, polylines y estilo del contrato
  Primera línea: `expect(jest.fn()).toHaveBeenCalledTimes(expected)`.

- #60 R1: en iOS PetMap pinta AppleMaps.View con el contrato del tab Map › en iOS › #60 R1: mapea el tema dark al esquema nativo DARK
  Primera línea: `expect(jest.fn()).toHaveBeenCalledTimes(expected)`.

- #60 R1: en iOS PetMap pinta AppleMaps.View con el contrato del tab Map › en iOS › #60 R1: mapea el tema light al esquema nativo LIGHT
  Primera línea: `expect(jest.fn()).toHaveBeenCalledTimes(expected)`.

- #60 R1: en iOS PetMap pinta AppleMaps.View con el contrato del tab Map › en iOS › #60 R1: oculta el botón de mi ubicación y el cambio de inclinación, sin contentPadding
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

r2:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       1 failed, 58 passed, 59 total
```

- #60 R2: en iOS el tab Map monta el mapa de Apple con la última posición › #60 R2: centra el mapa de Apple en la última posición y oculta sus controles de ubicación e inclinación
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

g12:

```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       72 passed, 72 total
```

r3:

```text
exit=1
Test Suites: 2 failed, 2 total
Tests:       2 failed, 62 passed, 64 total
```

- R7: foto opcional tras alta › #60 R3: pide al picker la representación compatible para que iOS entregue JPEG y no HEIC
  Primera línea: `expect(jest.fn()).toHaveBeenCalledWith(...expected)`.

- R7: cambiar foto › #60 R3: pide al picker la representación compatible para que iOS entregue JPEG y no HEIC
  Primera línea: `expect(jest.fn()).toHaveBeenCalledWith(...expected)`.

g3:

```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       64 passed, 64 total
```

r4:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       1 failed, 13 passed, 14 total
```

- #60 R4: app.json declara la identidad de iOS › #60 R4: fija bundleIdentifier, deploymentTarget 17.0 y cifrado exento sin tocar el icono
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

g4:

```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       14 passed, 14 total
```

r5:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       2 failed, 14 passed, 16 total
```

- #60 R5: app.json deja solo el permiso de galería, en español › #60 R5: declara expo-image-picker con el texto de galería y sin cámara ni micrófono
  Primera línea: `expect(received).toContainEqual(expected) // deep equality`.

- #60 R5: app.json deja solo el permiso de galería, en español › #60 R5: declara expo-secure-store sin Face ID y una sola vez por plugin
  Primera línea: `expect(received).toContainEqual(expected) // deep equality`.

g5:

```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
```

r6:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       2 failed, 16 passed, 18 total
```

- #60 R6: RESET_LINK_HOST declara el dominio asociado de iOS › #60 R6: con clave de mapas y google-services.json, añade applinks del host recortado a ios
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

- #60 R6: RESET_LINK_HOST declara el dominio asociado de iOS › #60 R6: sin clave de mapas ni google-services.json (builder de EAS), añade applinks del host recortado a ios
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

g6:

```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       18 passed, 18 total
```

r7:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       3 failed, 18 passed, 21 total
```

- #60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host ausente no declara associatedDomains y avisa una vez por Android e iOS
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

- #60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host vacío no declara associatedDomains y avisa una vez por Android e iOS
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

- #60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host solo espacios no declara associatedDomains y avisa una vez por Android e iOS
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

g7:

```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       21 passed, 21 total
```

r8:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       2 failed, 7 passed, 9 total
```

- #60 R8: apple-app-site-association delega /reset-password en la app de iOS › #60 R8: publica un único detalle para el App ID de iOS y solo la ruta de reset
  Primera línea: `expect(received).toBe(expected) // Object.is equality`.

- #60 R8: apple-app-site-association delega /reset-password en la app de iOS › #60 R8: fuerza application/json solo para el fichero sin extensión
  Primera línea: `expect(received).toBe(expected) // Object.is equality`.

g8:

```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
```

r9:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       3 failed, 9 passed, 12 total
```

- #60 R9: la guía de iOS y RESET_LINK_HOST quedan documentadas › #60 R9: documenta los gates de iOS en la sección Feature 60
  Primera línea: `expect(received).toContain(expected) // indexOf`.

- #60 R9: la guía de iOS y RESET_LINK_HOST quedan documentadas › #60 R9: el README de hosting explica el AASA, su .htaccess y el Team ID, y AGENTS.md lo nombra
  Primera línea: `expect(received).toContain(expected) // indexOf`.

- #60 R9: la guía de iOS y RESET_LINK_HOST quedan documentadas › #60 R9: la fila de RESET_LINK_HOST y el .env.example móvil nombran la variable de EAS
  Primera línea: `expect(received).toContain(expected) // indexOf`.

g9:

```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
```

R1–R9: cada blob intermedio coincidió con el control literal de su paso.
Sin refactors; sin flake de alta observado. Para medir las sondas con
status e índice vacíos, este reporte se guarda temporalmente en
mobile-pet-tracker/.expo/60-report.md (ignorado, dentro del mismo worktree),
y se devuelve a su destino antes del único commit de evidencia.

probe_always_apple:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       3 failed, 10 passed, 13 total
```

- R1: PetMap renderiza la vista de expo-maps con el contrato del tab Map › usa GoogleMaps.View a pantalla completa con el testID estable
  Primera línea: `expect(jest.fn()).toHaveBeenCalledTimes(expected)`.

- R1 (mobile-map-zoom-controls): el wrapper oculta los controles nativos de zoom › pasa solo zoomControlsEnabled y no contentPadding
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

- #60 R1: en iOS PetMap pinta AppleMaps.View con el contrato del tab Map › #60 R1: en Android pinta GoogleMaps.View y nunca AppleMaps.View
  Primera línea: `expect(jest.fn()).toHaveBeenCalledTimes(expected)`.

probe_no_pitch:

```text
exit=1
Test Suites: 2 failed, 2 total
Tests:       2 failed, 70 passed, 72 total
```

- #60 R1: en iOS PetMap pinta AppleMaps.View con el contrato del tab Map › en iOS › #60 R1: oculta el botón de mi ubicación y el cambio de inclinación, sin contentPadding
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

- #60 R2: en iOS el tab Map monta el mapa de Apple con la última posición › #60 R2: centra el mapa de Apple en la última posición y oculta sus controles de ubicación e inclinación
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

probe_apple_dark:

```text
exit=1
Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 71 passed, 72 total
```

- #60 R1: en iOS PetMap pinta AppleMaps.View con el contrato del tab Map › en iOS › #60 R1: mapea el tema dark al esquema nativo DARK
  Primera línea: `expect(received).toBe(expected) // Object.is equality`.

probe_current_addpet:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       1 failed, 24 passed, 25 total
```

- R7: foto opcional tras alta › #60 R3: pide al picker la representación compatible para que iOS entregue JPEG y no HEIC
  Primera línea: `expect(jest.fn()).toHaveBeenCalledWith(...expected)`.

probe_current_profile:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       1 failed, 38 passed, 39 total
```

- R7: cambiar foto › #60 R3: pide al picker la representación compatible para que iOS entregue JPEG y no HEIC
  Primera línea: `expect(jest.fn()).toHaveBeenCalledWith(...expected)`.

probe_target16:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       6 failed, 15 passed, 21 total
```

- #60 R4: app.json declara la identidad de iOS › #60 R4: fija bundleIdentifier, deploymentTarget 17.0 y cifrado exento sin tocar el icono
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

- #60 R6: RESET_LINK_HOST declara el dominio asociado de iOS › #60 R6: con clave de mapas y google-services.json, añade applinks del host recortado a ios
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

- #60 R6: RESET_LINK_HOST declara el dominio asociado de iOS › #60 R6: sin clave de mapas ni google-services.json (builder de EAS), añade applinks del host recortado a ios
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

- #60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host ausente no declara associatedDomains y avisa una vez por Android e iOS
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

- #60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host vacío no declara associatedDomains y avisa una vez por Android e iOS
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

- #60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host solo espacios no declara associatedDomains y avisa una vez por Android e iOS
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

probe_encryption_true:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       6 failed, 15 passed, 21 total
```

- #60 R4: app.json declara la identidad de iOS › #60 R4: fija bundleIdentifier, deploymentTarget 17.0 y cifrado exento sin tocar el icono
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

- #60 R6: RESET_LINK_HOST declara el dominio asociado de iOS › #60 R6: con clave de mapas y google-services.json, añade applinks del host recortado a ios
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

- #60 R6: RESET_LINK_HOST declara el dominio asociado de iOS › #60 R6: sin clave de mapas ni google-services.json (builder de EAS), añade applinks del host recortado a ios
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

- #60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host ausente no declara associatedDomains y avisa una vez por Android e iOS
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

- #60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host vacío no declara associatedDomains y avisa una vez por Android e iOS
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

- #60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host solo espacios no declara associatedDomains y avisa una vez por Android e iOS
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

probe_secure_string:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       1 failed, 20 passed, 21 total
```

- #60 R5: app.json deja solo el permiso de galería, en español › #60 R5: declara expo-secure-store sin Face ID y una sola vez por plugin
  Primera línea: `expect(received).toContainEqual(expected) // deep equality`.

probe_camera_on:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       1 failed, 20 passed, 21 total
```

- #60 R5: app.json deja solo el permiso de galería, en español › #60 R5: declara expo-image-picker con el texto de galería y sin cámara ni micrófono
  Primera línea: `expect(received).toContainEqual(expected) // deep equality`.

probe_no_trim:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       2 failed, 19 passed, 21 total
```

- #60 R6: RESET_LINK_HOST declara el dominio asociado de iOS › #60 R6: con clave de mapas y google-services.json, añade applinks del host recortado a ios
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

- #60 R6: RESET_LINK_HOST declara el dominio asociado de iOS › #60 R6: sin clave de mapas ni google-services.json (builder de EAS), añade applinks del host recortado a ios
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

probe_ios_needs_maps:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       1 failed, 20 passed, 21 total
```

- #60 R6: RESET_LINK_HOST declara el dominio asociado de iOS › #60 R6: sin clave de mapas ni google-services.json (builder de EAS), añade applinks del host recortado a ios
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

probe_old_warning:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       3 failed, 18 passed, 21 total
```

- #60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host ausente no declara associatedDomains y avisa una vez por Android e iOS
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

- #60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host vacío no declara associatedDomains y avisa una vez por Android e iOS
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

- #60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice › #60 R7: con un host solo espacios no declara associatedDomains y avisa una vez por Android e iOS
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

probe_wrong_bundle:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       1 failed, 11 passed, 12 total
```

- #60 R8: apple-app-site-association delega /reset-password en la app de iOS › #60 R8: publica un único detalle para el App ID de iOS y solo la ruta de reset
  Primera línea: `expect(received).toMatch(expected)`.

probe_wide_path:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       1 failed, 11 passed, 12 total
```

- #60 R8: apple-app-site-association delega /reset-password en la app de iOS › #60 R8: publica un único detalle para el App ID de iOS y solo la ruta de reset
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

probe_htaccess_all:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       1 failed, 11 passed, 12 total
```

- #60 R8: apple-app-site-association delega /reset-password en la app de iOS › #60 R8: fuerza application/json solo para el fichero sin extensión
  Primera línea: `expect(received).toEqual(expected) // deep equality`.

probe_secret_doc:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       1 failed, 11 passed, 12 total
```

- #60 R9: la guía de iOS y RESET_LINK_HOST quedan documentadas › #60 R9: documenta los gates de iOS en la sección Feature 60
  Primera línea: `expect(received).not.toMatch(expected)`.

probe_agents_row:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       1 failed, 11 passed, 12 total
```

- #60 R9: la guía de iOS y RESET_LINK_HOST quedan documentadas › #60 R9: el README de hosting explica el AASA, su .htaccess y el Team ID, y AGENTS.md lo nombra
  Primera línea: `expect(received).toContain(expected) // indexOf`.

probe_conv_row:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       1 failed, 11 passed, 12 total
```

- #60 R9: la guía de iOS y RESET_LINK_HOST quedan documentadas › #60 R9: la fila de RESET_LINK_HOST y el .env.example móvil nombran la variable de EAS
  Primera línea: `expect(received).toContain(expected) // indexOf`.

## Tabla de sondas medida

| Sonda | Fichero | Blob | Exigido | Medido |
|---|---|---|---|---|
| `always_apple` | `src/components/pet-map.tsx` | `a8aff9aa` | 3 rojos de 13 | 3 failed, 10 passed, 13 total; exit=1; aserción |
| `no_pitch` | `src/components/pet-map.tsx` | `527bba9d` | 2 rojos de 72 | 2 failed, 70 passed, 72 total; exit=1; aserción |
| `apple_dark` | `src/components/pet-map.tsx` | `671b6512` | 1 rojo de 72 | 1 failed, 71 passed, 72 total; exit=1; aserción |
| `current_addpet` | `src/screens/add-pet/index.tsx` | `970d957f` | 1 rojo de 25 | 1 failed, 24 passed, 25 total; exit=1; aserción |
| `current_profile` | `src/screens/profile/index.tsx` | `b5dad4ba` | 1 rojo de 39 | 1 failed, 38 passed, 39 total; exit=1; aserción |
| `target16` | `app.json` | `2cf6ef07` | 6 rojos de 21 | 6 failed, 15 passed, 21 total; exit=1; aserción |
| `encryption_true` | `app.json` | `bd0a6db4` | 6 rojos de 21 | 6 failed, 15 passed, 21 total; exit=1; aserción |
| `secure_string` | `app.json` | `8d4ecc4f` | 1 rojo de 21 | 1 failed, 20 passed, 21 total; exit=1; aserción |
| `camera_on` | `app.json` | `2731b4f8` | 1 rojo de 21 | 1 failed, 20 passed, 21 total; exit=1; aserción |
| `no_trim` | `app.config.ts` | `6edffe48` | 2 rojos de 21 | 2 failed, 19 passed, 21 total; exit=1; aserción |
| `ios_needs_maps` | `app.config.ts` | `2dbc63cd` | 1 rojo de 21 | 1 failed, 20 passed, 21 total; exit=1; aserción |
| `old_warning` | `app.config.ts` | `a49ccd9e` | 3 rojos de 21 | 3 failed, 18 passed, 21 total; exit=1; aserción |
| `wrong_bundle` | `../hosting/.well-known/apple-app-site-association` | `d5b021a9` | 1 rojo de 12 | 1 failed, 11 passed, 12 total; exit=1; aserción |
| `wide_path` | `../hosting/.well-known/apple-app-site-association` | `4d2af87e` | 1 rojo de 12 | 1 failed, 11 passed, 12 total; exit=1; aserción |
| `htaccess_all` | `../hosting/.well-known/.htaccess` | `ad331d96` | 1 rojo de 12 | 1 failed, 11 passed, 12 total; exit=1; aserción |
| `secret_doc` | `../docs/verification.md` | `50687b1a` | 1 rojo de 12 | 1 failed, 11 passed, 12 total; exit=1; aserción |
| `agents_row` | `../AGENTS.md` | `a15920b3` | 1 rojo de 12 | 1 failed, 11 passed, 12 total; exit=1; aserción |
| `conv_row` | `../docs/conventions.md` | `78ed538c` | 1 rojo de 12 | 1 failed, 11 passed, 12 total; exit=1; aserción |

Los 18 blobs mutados coincidieron con su control. Los nombres y primeras
líneas de todos los rojos coinciden con §Sondas. Cada restauración se hizo
con git checkout HEAD -- ruta; git diff --exit-code=0 y
git diff --cached --exit-code=0 en las 18. Status e índice vacíos tras cada
restauración. Ninguna mutación se commiteó.

## R10 — Cierre, puntos 1 a 11

final:

```text
exit=0
Test Suites: 6 passed, 6 total
Tests:       169 passed, 169 total
```

guards_final:

```text
exit=0
Test Suites: 3 passed, 3 total
Tests:       111 passed, 111 total
```

1. Tests dirigidos: 6 suites / 169 tests en verde, exit=0; delta +21 tests / +0 suites sobre 148.

| Fichero | Base | Final medido | Delta |
|---|---|---|---|
| src/components/__tests__/pet-map.test.tsx | 8 | 13 | +5 |
| src/screens/map/index.test.tsx | 58 | 59 | +1 |
| src/screens/add-pet/index.test.tsx | 24 | 25 | +1 |
| src/screens/profile/index.test.tsx | 38 | 39 | +1 |
| app.config.test.ts | 13 | 21 | +8 |
| src/__tests__/hosting-artifacts.test.ts | 7 | 12 | +5 |

2. Guardas: 3 suites / 111 tests en verde, exit=0; delta 0 suites / 0 tests.

3. Suite entera omitida por respuesta explícita «No; dejarla al leader». La base completa 86 / 1619 consta en el handoff y progress/current.md, no es una medida propia de esta sesión. El leader debe medir 86 / 1640 (+21 / +0).

4. Antes de tsc: test ! -e .expo/types/router.d.ts, exit=0. bunx tsc --noEmit: exit=0.

5. bunx eslint sobre los diez ficheros TS/TSX de §R10: exit=0.


6. Introspección final: expo config exit=0; única línea extraída por bun -e:

```text
{"usage":["NSLocalNetworkUsageDescription","NSPhotoLibraryUsageDescription"],"photos":"Se usa para elegir de tu galería la foto de perfil de tu mascota.","encryption":false,"domains":["applinks:reset.example.test"],"aps":"development","android":[]}
```

Coincide exactamente con el esperado. JSON y stderr borrados inmediatamente;
test ! -e .expo/types/router.d.ts tras el comando: exit=0. El JSON resuelto
no se mostró ni copió; la comparación del dominio ocurrió antes de imprimir.

7. Cifras de candado, comandos de §R10.7 ejecutados:

| Comando | Base declarada/medida | Final exigido | Final medido |
|---|---|---|---|
| `grep -cF 'AppleMaps' src/components/pet-map.tsx` | 0 | 4 | 4 |
| `grep -cF 'GoogleMaps' src/components/pet-map.tsx` | 4 | 4 | 4 |
| `grep -cF "Platform.OS === 'ios'" src/components/pet-map.tsx` | 0 | 1 | 1 |
| `grep -cF 'uiSettings={{ zoomControlsEnabled: false }}' src/components/pet-map.tsx` | 0 | 1 | 1 |
| `grep -cF 'uiSettings={{ myLocationButtonEnabled: false, togglePitchEnabled: false }}' src/components/pet-map.tsx` | 0 | 1 | 1 |
| `grep -cF 'contentPadding' src/components/pet-map.tsx` | 0 | 0 | 0 |
| `grep -rF 'Platform.OS' src --include='*.ts' --include='*.tsx' \| grep -v '\.test\.tsx\?:' \| grep -v '/__tests__/' \| wc -l` | 3 | 4 | 4 |
| `grep -cF 'UIImagePickerPreferredAssetRepresentationMode.Compatible' src/screens/add-pet/index.tsx` | 0 | 1 | 1 |
| `grep -cF 'UIImagePickerPreferredAssetRepresentationMode.Compatible' src/screens/profile/index.tsx` | 0 | 1 | 1 |
| `grep -rF 'launchImageLibraryAsync(' src --include='*.ts' --include='*.tsx' \| grep -v '\.test\.tsx\?:' \| grep -v '/__tests__/' \| wc -l` | 2 | 2 | 2 |
| `grep -cF 'console.warn(' app.config.ts` | 1 | 1 | 1 |
| `grep -cF 'associatedDomains' app.config.ts` | 0 | 2 | 2 |
| `grep -cF "expect(expo.plugins).toContain('expo-secure-store');" app.config.test.ts` | 1 | 0 | 0 |
| `grep -c '^describe(' src/components/__tests__/pet-map.test.tsx` | 5 | 6 | 6 |
| `grep -c '^describe(' src/screens/map/index.test.tsx` | 22 | 23 | 23 |
| `grep -c '^describe(' src/screens/add-pet/index.test.tsx` | 11 | 11 | 11 |
| `grep -c '^describe(' src/screens/profile/index.test.tsx` | 16 | 16 | 16 |
| `grep -c '^describe(' app.config.test.ts` | 7 | 11 | 11 |
| `grep -c '^describe(' src/__tests__/hosting-artifacts.test.ts` | 3 | 5 | 5 |
| `grep -c '#60' src/components/__tests__/pet-map.test.tsx` | 0 | 5 | 5 |
| `grep -c '#60 R[1-9]' src/components/__tests__/pet-map.test.tsx` | 0 | 5 | 5 |
| `grep -c '#60' src/screens/map/index.test.tsx` | 0 | 2 | 2 |
| `grep -c '#60 R[1-9]' src/screens/map/index.test.tsx` | 0 | 2 | 2 |
| `grep -c '#60' src/screens/add-pet/index.test.tsx` | 0 | 1 | 1 |
| `grep -c '#60 R[1-9]' src/screens/add-pet/index.test.tsx` | 0 | 1 | 1 |
| `grep -c '#60' src/screens/profile/index.test.tsx` | 0 | 1 | 1 |
| `grep -c '#60 R[1-9]' src/screens/profile/index.test.tsx` | 0 | 1 | 1 |
| `grep -c '#60' app.config.test.ts` | 0 | 10 | 10 |
| `grep -c '#60 R[1-9]' app.config.test.ts` | 0 | 10 | 10 |
| `grep -c '#60' src/__tests__/hosting-artifacts.test.ts` | 0 | 7 | 7 |
| `grep -c '#60 R[1-9]' src/__tests__/hosting-artifacts.test.ts` | 0 | 7 | 7 |
| `cat src/components/__tests__/pet-map.test.tsx src/screens/map/index.test.tsx src/screens/add-pet/index.test.tsx src/screens/profile/index.test.tsx app.config.test.ts src/__tests__/hosting-artifacts.test.ts \| grep -c -- '-\['` | 0 | 0 | 0 |
| `cat src/components/__tests__/pet-map.test.tsx src/screens/map/index.test.tsx src/screens/add-pet/index.test.tsx src/screens/profile/index.test.tsx app.config.test.ts src/__tests__/hosting-artifacts.test.ts \| grep -ci stylesheet` | 0 | 0 | 0 |
| `grep -c '^### Feature ' ../docs/verification.md` | 17 | 18 | 18 |
| `grep -cF '### Feature 60 — mobile-ios-support' ../docs/verification.md` | 0 | 1 | 1 |
| `grep -c 'REPLACE_WITH_DEV_BUILD_SHA256' ../docs/verification.md` | 1 | 1 | 1 |
| `grep -c 'REPLACE_WITH_DEV_BUILD_SHA256' ../hosting/README.md` | 1 | 0 | 0 |
| `grep -c 'REPLACE_WITH_APPLE_TEAM_ID' ../hosting/README.md` | 0 | 1 | 1 |
| `grep -c 'REPLACE_WITH_APPLE_TEAM_ID' ../hosting/.well-known/apple-app-site-association` | no existe | 1 | 1 |
| `grep -c 'RESET_LINK_HOST' .env.example` | 1 | 1 | 1 |

8. Diff medido contra HEAD del handoff hasta el último verde (antes del commit de evidencia):

```text
AGENTS.md
docs/conventions.md
docs/verification.md
hosting/.well-known/.htaccess
hosting/.well-known/apple-app-site-association
hosting/README.md
mobile-pet-tracker/.env.example
mobile-pet-tracker/app.config.test.ts
mobile-pet-tracker/app.config.ts
mobile-pet-tracker/app.json
mobile-pet-tracker/src/__tests__/hosting-artifacts.test.ts
mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx
mobile-pet-tracker/src/components/pet-map.tsx
mobile-pet-tracker/src/screens/add-pet/index.test.tsx
mobile-pet-tracker/src/screens/add-pet/index.tsx
mobile-pet-tracker/src/screens/map/index.test.tsx
mobile-pet-tracker/src/screens/profile/index.test.tsx
mobile-pet-tracker/src/screens/profile/index.tsx

1	1	AGENTS.md
1	1	docs/conventions.md
155	0	docs/verification.md
3	0	hosting/.well-known/.htaccess
10	0	hosting/.well-known/apple-app-site-association
6	2	hosting/README.md
2	0	mobile-pet-tracker/.env.example
161	1	mobile-pet-tracker/app.config.test.ts
9	1	mobile-pet-tracker/app.config.ts
20	2	mobile-pet-tracker/app.json
98	1	mobile-pet-tracker/src/__tests__/hosting-artifacts.test.ts
114	0	mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx
27	7	mobile-pet-tracker/src/components/pet-map.tsx
18	0	mobile-pet-tracker/src/screens/add-pet/index.test.tsx
2	0	mobile-pet-tracker/src/screens/add-pet/index.tsx
58	0	mobile-pet-tracker/src/screens/map/index.test.tsx
19	0	mobile-pet-tracker/src/screens/profile/index.test.tsx
2	0	mobile-pet-tracker/src/screens/profile/index.tsx
18 files changed, 706 insertions(+), 16 deletions(-)
```

Los únicos dos borrados en los tests son la enmienda de #79 R2 y el import de node:fs; los 18 blobs finales exactos confirman los literales y todos los it existentes restantes.

9. git diff --exit-code del handoff a HEAD para los once ficheros de §R10.9: sin salida, exit=0. Comprobación extendida a lifecycle del leader, requirements/design/tasks y weekly-activity-chart.test.tsx: sin salida, exit=0.

10. Historial medido, 17 commits en el orden literal. Por cada commit se comprobó su lista exacta de ficheros contra el git add del paso: nueve rojos de solo tests y ocho verdes con el ámbito declarado. Sin arnés mezclado.

| Commit | Mensaje literal | Ficheros |
|---|---|---|
| 97ed1c54af934fe06bfbe0d96064d25f82ada3f5 | test(mobile): expect Apple Maps on iOS in PetMap (R1) | mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx |
| 88b0b72cd1d233375157ec8ce645c09422a64791 | test(mobile): expect the map tab to mount Apple Maps on iOS (R2) | mobile-pet-tracker/src/screens/map/index.test.tsx |
| 050617300d8a7713ee3ce6eaa1692360ca45305f | feat(mobile): render Apple Maps on iOS in PetMap (R1,R2) | mobile-pet-tracker/src/components/pet-map.tsx |
| 572ef3c3b4194660c99eb8d543964a2edb73cda0 | test(mobile): expect the compatible asset representation from the photo picker (R3) | mobile-pet-tracker/src/screens/add-pet/index.test.tsx, mobile-pet-tracker/src/screens/profile/index.test.tsx |
| 98ec9c49536703a92a09da8a8a63aa9b99063e1c | feat(mobile): ask the photo picker for JPEG instead of HEIC on iOS (R3) | mobile-pet-tracker/src/screens/add-pet/index.tsx, mobile-pet-tracker/src/screens/profile/index.tsx |
| 0742e5fbf3b4c85fa83dc478da2560ed2b72fa66 | test(mobile): expect the iOS identity in app.json (R4) | mobile-pet-tracker/app.config.test.ts |
| 0f45bab5eead1721ac7ff29a154b6c8ad690510d | feat(mobile): declare the iOS bundle identifier, deployment target and exempt encryption (R4) | mobile-pet-tracker/app.json |
| db2da5b3e25090286a69b7a974ca69ee3d47208f | test(mobile): expect only the Spanish gallery permission and amend #79 R2 (R5) | mobile-pet-tracker/app.config.test.ts |
| 53446ec3c7b78479cb8374341fcf51e9a3cde72e | feat(mobile): keep only the gallery permission and drop camera, microphone and Face ID (R5) | mobile-pet-tracker/app.json |
| a2d6463f3b15bcc9f1e776233f4b0163f7d46698 | test(mobile): expect associatedDomains from RESET_LINK_HOST (R6) | mobile-pet-tracker/app.config.test.ts |
| 53867e41cb1531570400cd27c184f45ff6a9b890 | feat(mobile): declare the iOS associated domain from RESET_LINK_HOST (R6) | mobile-pet-tracker/app.config.ts |
| 3796b5d56bbcf0e2ce0fd3c1e73d819e1fc663c6 | test(mobile): expect the RESET_LINK_HOST warning to cover iOS (R7) | mobile-pet-tracker/app.config.test.ts |
| 150ec51daa0f48854e51004561fe53acdc5bc098 | feat(mobile): warn that iOS loses Universal Links without RESET_LINK_HOST (R7) | mobile-pet-tracker/app.config.ts |
| 7569bca85d4672baa20b9f40987627e33875e653 | test(mobile): expect the apple-app-site-association and its .htaccess (R8) | mobile-pet-tracker/src/__tests__/hosting-artifacts.test.ts |
| 51dd3e6e7956199382b0076dacf92fb3508c20e0 | feat(hosting): publish the apple-app-site-association for /reset-password (R8) | hosting/.well-known/.htaccess, hosting/.well-known/apple-app-site-association |
| 0aeefa722b286d9f6fcf00d12e73ce0ea703fd9a | test(mobile): expect the iOS guide and the RESET_LINK_HOST EAS variable documented (R9) | mobile-pet-tracker/src/__tests__/hosting-artifacts.test.ts |
| 7139fbfdcc7d481044031ba0adc9b45443d492cb | docs: document the iOS dev build gates and the EAS variable (R9) | AGENTS.md, docs/conventions.md, docs/verification.md, hosting/README.md, mobile-pet-tracker/.env.example |

11. Blobs finales medidos con git rev-parse HEAD:ruta:

| Ruta | Blob medido | Resultado |
|---|---|---|
| AGENTS.md | 200ec9af6888fc2b96fa7795ba7174072b50bad3 | coincide |
| docs/conventions.md | 001aad65409bde2dc5baa0ac8526a58ec3bea3d3 | coincide |
| docs/verification.md | f329a871c8e72255031a28cccb32f2c8c66966f1 | coincide |
| hosting/.well-known/.htaccess | 325926fa08861a4fdb377665512cbee4e158084e | coincide |
| hosting/.well-known/apple-app-site-association | 862b64580ea871d3d20ea11507c047e327c20ed4 | coincide |
| hosting/README.md | d867e0af61c8045f310f0a7200e8ffb895188937 | coincide |
| mobile-pet-tracker/.env.example | 8c6003b99719f5523ed09f02a2799f33c69b6a28 | coincide |
| mobile-pet-tracker/app.config.test.ts | 1426e188781303134757416605b4e3c07f16932f | coincide |
| mobile-pet-tracker/app.config.ts | e417003de04b00c5f4ac108ee9f56ef976abd428 | coincide |
| mobile-pet-tracker/app.json | 0d35cce92271599325aa97ad8e6c5d105c6e0962 | coincide |
| mobile-pet-tracker/src/__tests__/hosting-artifacts.test.ts | 8abaacbfc7f218c9f353a67a3dac77d41ea73913 | coincide |
| mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx | d8328887c3de2038b6f577b7215115d8c0331e35 | coincide |
| mobile-pet-tracker/src/components/pet-map.tsx | 5801249b877e4cdb6fdc885b90da1c1ce5a735bb | coincide |
| mobile-pet-tracker/src/screens/add-pet/index.test.tsx | 62971928b8891ae1971e23dd080638a7d57863a2 | coincide |
| mobile-pet-tracker/src/screens/add-pet/index.tsx | e02a048d9e22700d4b93797356b32671c7408aab | coincide |
| mobile-pet-tracker/src/screens/map/index.test.tsx | 906220e8b390b419ad3e8a3d9e864edc8d5d284e | coincide |
| mobile-pet-tracker/src/screens/profile/index.test.tsx | b52c4b440f37c42c5c9d55a7a4c1cd75ceaa1764 | coincide |
| mobile-pet-tracker/src/screens/profile/index.tsx | ef3e7362a0d451f9965332666a7faeca79de92c3 | coincide |

Gates humanos: R11, R12 y R13 siguen pendientes y sus casillas intactas. No se ejecutaron EAS, prebuild, run:ios/run:android, init.sh, e2e, infraestructura ni comandos AWS. No se abrió .env, google-services.json ni credenciales. Sin push ni PR; cierre del leader y veredicto del reviewer pendientes.

12. Evidencia: R1–R10 sin filas pendientes; los 17 hashes son ancestros de HEAD. R1 y R2 citan el verde común; R10 cita el verde de R9. R11–R13 mantienen sus casillas y sus filas humanas pendientes. La lista de 18 archivos / +706 / −16 se midió en 7139fbfdcc7d481044031ba0adc9b45443d492cb contra el handoff, antes de añadir los dos archivos de evidencia. El commit final solo incluye este reporte y traceability.md; sin rebase, push ni PR.
