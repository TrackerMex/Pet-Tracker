---
feature: "mobile-date-field"
status: approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-date-field]]

Rutas relativas a `mobile-pet-tracker/src/`. Cada fila enlaza el commit primario de test y el de implementación. Los cambios escalonados de copy y candados se detallan después.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `utils/civil-date.test.ts::#220 R1` | Test `a6cb67d4` — test(#220): R1 civil-date utilities; feat `2d7baf24` — feat(#220): R1 add civil-date utilities |
| R2 | `components/__tests__/date-field.test.tsx::#220 R2` | Test `865ae690` — test(#220): R2-R11 R17 R18 lock DateField; feat `1adba14a` — feat(#220): R2-R11 R16 R17 add DateField |
| R3 | `components/__tests__/date-field.test.tsx::#220 R3` | Test `865ae690` — test(#220): R2-R11 R17 R18 lock DateField; feat `1adba14a` — feat(#220): R2-R11 R16 R17 add DateField |
| R4 | `components/__tests__/date-field.test.tsx::#220 R4` | Test `865ae690` — test(#220): R2-R11 R17 R18 lock DateField; feat `1adba14a` — feat(#220): R2-R11 R16 R17 add DateField |
| R5 | `components/__tests__/date-field.test.tsx::#220 R5` | Test `f7948393` — test(#220): R5 use rendered label query for RNTL 14; feat `1adba14a` — feat(#220): R2-R11 R16 R17 add DateField |
| R6 | `components/__tests__/date-field.test.tsx::#220 R6` | Test `865ae690` — test(#220): R2-R11 R17 R18 lock DateField; feat `1adba14a` — feat(#220): R2-R11 R16 R17 add DateField |
| R7 | `components/__tests__/date-field.test.tsx::#220 R7` | Test `865ae690` — test(#220): R2-R11 R17 R18 lock DateField; feat `1adba14a` — feat(#220): R2-R11 R16 R17 add DateField |
| R8 | `components/__tests__/date-field.test.tsx::#220 R8` | Test `865ae690` — test(#220): R2-R11 R17 R18 lock DateField; feat `1adba14a` — feat(#220): R2-R11 R16 R17 add DateField |
| R9 | `components/__tests__/date-field.test.tsx::#220 R9` | Test `865ae690` — test(#220): R2-R11 R17 R18 lock DateField; feat `1adba14a` — feat(#220): R2-R11 R16 R17 add DateField |
| R10 | `components/__tests__/date-field.test.tsx::#220 R10` | Test `865ae690` — test(#220): R2-R11 R17 R18 lock DateField; feat `1adba14a` — feat(#220): R2-R11 R16 R17 add DateField |
| R11 | `components/__tests__/date-field.test.tsx::#220 R11` | Test `865ae690` — test(#220): R2-R11 R17 R18 lock DateField; feat `1adba14a` — feat(#220): R2-R11 R16 R17 add DateField |
| R12 | `screens/weight-log/index.test.tsx::#220 R12` | Test `faf9cf94` — test(#220): R12 weight log on DateField; feat `57e3fe1f` — feat(#220): R12 R16 migrate weight log |
| R13 | `screens/docs-upload-form/index.test.tsx::#220 R13` | Test `84911d37` — test(#220): R13 docs upload on DateField; feat `41663fe9` — feat(#220): R13 R16 migrate docs upload |
| R14 | `screens/add-pet/index.test.tsx::#220 R14` | Test `92d22a84` — test(#220): R14 add pet on DateField; feat `fda5417a` — feat(#220): R14 R17 migrate add pet |
| R15 | `screens/add-reminder/index.test.tsx::#220 R15` | Test `fcfea405` — test(#220): R15 add reminder on DateField; feat `bc818706` — feat(#220): R15 R17 migrate add reminder |
| R16 | `components/__tests__/date-field.test.tsx::#220 R3/R6/R11; __tests__/ui-language.test.ts::#220 R16 y aritmética de language-provider.test.tsx` | Test `865ae690` — test(#220): R2-R11 R17 R18 lock DateField; feat `41663fe9` — feat(#220): R13 R16 migrate docs upload |
| R17 | `components/__tests__/date-field.test.tsx::#220 R17; candados y completo final de 5548 tests` | Test `865ae690` — test(#220): R2-R11 R17 R18 lock DateField; feat `bc818706` — feat(#220): R15 R17 migrate add reminder |
| R18 | `components/__tests__/date-field.test.tsx::#220 R18; diff protegido desde c584ba3c vacío` | Test `865ae690` — test(#220): R2-R11 R17 R18 lock DateField; feat `bc818706` — feat(#220): R15 R17 migrate add reminder |

## Cambios escalonados y correcciones

- C3 se dejó rojo por import inexistente, excepción prevista. `f7948393` adapta el test de Label a RNTL 14 antes de implementar el componente.
- R16 añade las cinco claves y su registro en `1adba14a`, retira la clave de Peso en `57e3fe1f` y la de Documentos en `41663fe9`; el test primario de C3 fija los textos de ambos idiomas antes de esos cambios.
- R6/R17: el candado de accent omitido se autoriza con firma delegada en `504aee66` y se enmienda en `b39d2864` — `test(#220): R6 amend the accent-request lock for DateField`. La mutación de quitar accent del consumidor se vio roja y se revirtió.
- R14/R17: las cifras de esquinas de Alta de mascota se enmiendan en `fda5417a`; las de Recordatorio y su inventario de iconos, en `bc818706`.
- `aa7eabb6` — `test(#220): R4 R6 R15 align native-field test doubles and structure` nombra dos dobles para lint y adapta la aserción del control de fecha al InputGroup, conservando su mensaje hermano. Se probó la nueva aserción con un prefijo extra en producción, rojo y revertido.

## Casos de texto que el selector ya no puede introducir

Estos casos conservan cobertura en `utils/form-rules.test.ts`, sin modificar ese fichero. Las tablas puras ya estaban en H0 y pasan en la suite final. La última versión de ese fichero procede de `f85328bb`.

| Caso de pantalla retirado o reexpresado | Test puro que conserva la validación | Sustituto de interacción / commit |
|---|---|---|
| Peso: `#186 R7: fecha «2026-02-30» es real y se envía recortada` | `utils/form-rules.test.ts::#186 R2: fecha del peso «2026-02-30»` | Elección civil válida y máximo de perfil: `#220 R12`; test faf9cf94 / feat 57e3fe1f |
| Peso: `#186 R7: fecha « 2026-08-20 » es real y se envía recortada` | `utils/form-rules.test.ts::#186 R2: fecha del peso « 2026-10-09 »` (misma rama de trim) | Payload civil `2026-08-20`: `#220 R12`; test faf9cf94 / feat 57e3fe1f |
| Peso: `bad-date` en el caso de tres errores simultáneos | `utils/form-rules.test.ts::#186 R2: fecha del peso «09/10/2026»` y `«2026-2-3»` (formato inválido) | Se conservan peso y condición inválidos, con fecha válida sin error; errores de fecha futura del servidor siguen probados; faf9cf94 / 57e3fe1f |
| Documentos: fila `fecha sin formato ISO`, `09/10/2026` | `utils/form-rules.test.ts::#186 R2: fecha de documento «09/10/2026»` | `#220 R13` elige una fecha válida; 84911d37 / 41663fe9 |
| Documentos: `rechaza un calendario falso`, `2026-02-30` | `utils/form-rules.test.ts::#186 R2: fecha de documento «2026-02-30»` | Selector civil en `#220 R13`; 84911d37 / 41663fe9 |
| Documentos: `bad-date` en el caso de tres errores simultáneos | `utils/form-rules.test.ts::#186 R2: fecha de documento «09/10/2026»` y `«2026-2-3»` (formato inválido) | Se conservan tipo/nombre inválidos y se asevera ausencia de error de fecha válida; 84911d37 / 41663fe9 |
| Documentos: escritura ` 2026-10-09 ` en fecha recortada | `utils/form-rules.test.ts::#186 R2: fecha de documento « 2026-10-09 »` | El mismo test elige el 9 por el selector y conserva payload/ausencia de mensajes; 84911d37 / 41663fe9 |
| Documentos: escritura ` 2026-10-01 ` al subir PDF con campos recortados | `utils/form-rules.test.ts::#186 R2: fecha de documento « 2026-10-09 »` (misma rama de trim) | La fecha se elige; se conservan las demás aserciones de recorte, orden, payload y éxito; 84911d37 / 41663fe9 |

No se retiraron otros casos. Los tests reescritos conservan su título original con el sufijo de R12/R13/R14/R15, salvo el cambio expresamente aprobado de 13 a 12 pares de traducción.

## Verificación

- Completo final `progress/final-test-220.log`: exit 0; **157 suites y 5548 tests verdes**, sin FAIL. Los once ficheros de candados/pantallas indicados en el handoff, más legibility y el componente, están incluidos.
- Typecheck final: exit 0, con `test ! -e .expo/types/router.d.ts` previo.
- Lint sin caché: exit 0, log vacío.
- R18 y límites de alcance: diff vacío desde H0 para dependencias, theme/global.css, meal-schedule y los helpers protegidos. El selector de Horario mantiene sus dos apariciones de ExpoDateTimePicker.
- La prueba nativa en Android pertenece al humano; no se marca su casilla. No se ejecutó init.sh, no se hizo push ni se abrió PR.

Sondas, estados intermedios, cifras, hashes y límites completos: [reporte de implementación](../../progress/impl_mobile-date-field.md).
