---
feature: "mobile-docs-upload"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-docs-upload]] (#158)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/providers/__tests__/language-provider.test.tsx::#158 R1: claves y nueva frase de Pingo` (it `#158 R1: declara los 13 pares exactos y su registro`); `src/components/__tests__/empty-state.test.tsx::#155 R1: el copy de los vacíos existe en los dos idiomas › declara docs.emptyBody en inglés y en español`; `src/screens/docs/index.test.tsx::#155 R7: sin documentos, Pingo los guarda › pinta la pose, el título y la frase de Pingo` | `33fe49a2 test(mobile-docs-upload): red catalog keys and new Pingo line (R1)`<br>`a1792b86 feat(mobile-docs-upload): catalog keys and new Pingo line (R1)` |
| R2 | `src/api/__tests__/media.test.ts::#158 R2: API de subida de documentos` | `1a2308c5 test(mobile-docs-upload): red media API for document upload (R2)`<br>`d4719d8f feat(mobile-docs-upload): media API creates, uploads and confirms documents (R2)` |
| R3 | `src/screens/docs/index.test.tsx::#158 R3: el owner ve la acción de subir`; `src/screens/docs/index.test.tsx::#155 R7: sin documentos, Pingo los guarda › no ofrece acción a quien no es owner (#158 R4)` (redirigido a family) | `447cdf63 test(mobile-docs-upload): red owner sees the upload action (R3)`<br>`97832d92 feat(mobile-docs-upload): owner sees the upload action (R3)` |
| R4 | `src/screens/docs/index.test.tsx::#158 R4: family, walker y vet no ven la acción` | `ca74f737 test(mobile-docs-upload): lock non-owners without the upload action (R4)`<br>verde de entrada desde `97832d92` (verde de R3; caso A) |
| R5 | `src/screens/docs/index.test.tsx::#158 R5: selector y formulario de subida` | `18f86fe5 test(mobile-docs-upload): red document picker and upload form (R5)`<br>`a9b74613 test(mobile-docs-upload): await R5 events (R5)`<br>`5086136f feat(mobile-docs-upload): document picker and upload form (R5)` |
| R6 | `src/screens/docs/index.test.tsx::#158 R6: validación antes de leer o crear` | `6b300482 test(mobile-docs-upload): red form validation before any call (R6)`<br>`7ad23d67 feat(mobile-docs-upload): form validation before any call (R6)` |
| R7 | `src/screens/docs/index.test.tsx::#158 R7: una subida correcta refresca la lista` | `0bc16f82 test(mobile-docs-upload): red successful upload refreshes the list (R7)`<br>`fec7bbb7 feat(mobile-docs-upload): successful upload refreshes the list (R7)` |
| R8 | `src/screens/docs/index.test.tsx::#158 R8: botones bloqueados durante la subida` | `7e7bed31 test(mobile-docs-upload): red buttons locked while uploading (R8)`<br>`672c8cfe feat(mobile-docs-upload): buttons locked while uploading (R8)` |
| R9 | `src/screens/docs/index.test.tsx::#158 R9: cada fallo conserva el formulario y sus valores`. `crear forbidden` nació verde desde `672c8cfe` porque R8 ya lo implementaba (`tasks.md:219`), autorizado por [Reanudación 4](../../progress/handoff_mobile-docs-upload.md); la otra fila verde fue el nuevo intento tras Error de R6 | `e7f02a8e test(mobile-docs-upload): red upload errors keep the screen up (R9)`<br>`a5d6ac36 feat(mobile-docs-upload): upload errors keep the screen up (R9)` |
| R10 | `src/screens/docs/index.test.tsx::#158 R10: cualquier miembro abre un documento` | `f5df2d44 test(mobile-docs-upload): red any member opens a document (R10)`<br>`9d3d8178 feat(mobile-docs-upload): any member opens a document (R10)` |
| R11 | `src/screens/docs/index.test.tsx::#158 R11: el formulario se aparta del teclado en Android` | `69cc2fd8 test(mobile-docs-upload): red form avoids the keyboard on Android (R11)`<br>`61035b63 feat(mobile-docs-upload): form avoids the keyboard on Android (R11)` |
| R12 | `src/__tests__/ui-language.test.ts::#65 R7: Profile resuelve su copy por clave › resuelve las 53 ocurrencias normativas` | `f2cc98de test(mobile-docs-upload): red copy registry for the upload screen (R12)`<br>`ae8e7fbc feat(mobile-docs-upload): copy registry for the upload screen (R12)` |
| R13 | pendiente (smoke humano; sin test automático) | pendiente (casilla firmada en requirements.md §Prueba de humo) |
| R14 | `src/api/__tests__/media.test.ts::#158 R14: uploadPhotoToUrl sube un Blob con el tipo declarado (Enmienda E1)`; `src/api/__tests__/media.test.ts::#158 R2: API de subida de documentos › uploadPhotoToUrl manda application/pdf sin Authorization` (su `body` esperado pasa a `expect.any(Blob)`) | pendiente: `test(mobile-docs-upload): red typed upload body (R14)`<br>pendiente: `fix(mobile-docs-upload): upload body carries the declared content type (R14)` |

Los recuentos entre paréntesis son los totales del fichero tras el commit rojo
de ese requisito ([[tasks]] §Recuentos). En total, 147 `it` nuevos: 1 en
language-provider, 54 en media y 92 en la pantalla.
La Enmienda E1 suma 12 en media (R14): de 69 a 81.

Regla: el reviewer no aprueba si alguna fila queda "pendiente". La única
excepción es R13, que la cierra el humano después del veredicto.
Convención de commit: `test(mobile-docs-upload): ... (R<n>)` para el rojo y
`feat(mobile-docs-upload): ... (R<n>)` para el verde.
El verde de R14 (Enmienda E1) es `fix(mobile-docs-upload): ... (R14)`.
El implementer actualiza esta tabla tras cada commit, con el hash del rojo y
del verde, y el reviewer la valida al aprobar (ver [[../../docs/specs|specs]] y
[[../../CHECKPOINTS|CHECKPOINTS]] C5).
