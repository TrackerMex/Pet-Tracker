# Trazabilidad — [[mobile-forgot-password]]

> Rellena Codex al cerrar cada tarea de `tasks.md`. El reviewer no aprueba si
> alguna fila queda pendiente. Formato de commit:
> `test(mobile-forgot-password): … (R2)` / `feat(mobile-forgot-password): … (R2)`.
> No rebasear después de rellenar los hashes.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/providers/__tests__/language-provider.test.tsx::#117 R1: el catálogo trae las claves de recuperar contraseña › registra las seis claves…` y `› retira forgot.comingSoon…` | pendiente |
| R2 | `src/api/__tests__/auth.test.ts::#117 R2: forgotPassword mapea la respuesta por kind` (7 `it`) | pendiente |
| R3 | `src/screens/forgot/index.test.tsx::#117 R3: la ruta forgot delega en ForgotScreen` (2 `it`) | pendiente |
| R4 | `src/screens/forgot/index.test.tsx::#117 R4: el formulario pide el correo` (3 `it`) | pendiente |
| R5 | `src/screens/forgot/index.test.tsx::#117 R5: enviar pasa la pantalla a «Revisa tu correo»` (2 `it`) | pendiente |
| R6 | `src/screens/forgot/index.test.tsx::#117 R6: reenviar repite la misma petición` (2 `it`) | pendiente |
| R7 | `src/screens/forgot/index.test.tsx::#117 R7: cada kind distinto de ok pinta su copy en forgot-error` (`it.each` ×5 + 1 `it`) | pendiente |
| R8 | `src/screens/forgot/index.test.tsx::#117 R8: forgot se aparta del teclado en Android › el host screen-forgot añade paddingBottom 200 al abrir el teclado` | pendiente |
| R9 | `src/screens/forgot/index.test.tsx::#117 R9: las métricas del stub sobreviven al cambio de estado` + reapuntados `#61 R8 › conserva el centrado…` y `#127 R1 › pinta forgot-submit…` | pendiente |
| R10 | `src/__tests__/ui-language.test.ts::#65 R1 › resuelve las … ocurrencias normativas`, `::#65 R18 › no deja ningún valor fijo…`, `::resuelve cada ocurrencia de la tabla…`; `src/__tests__/ui-copy-table.ts::cuadra ALL_USES…`; `src/__tests__/consistency-classnames.test.ts` (`#120 R1`, tiles, `#62 R13`, `#62 R14`); `src/__tests__/legibility-classnames.test.ts::#61 R4`; `src/providers/__tests__/language-provider.test.tsx::#65 R12` (longitud) | pendiente |
| R11 | `src/api/__tests__/auth.test.ts::#117 R11: ok no depende del cuerpo` (3 `it`) y `src/screens/forgot/index.test.tsx::#117 R11: la pantalla de éxito es la misma para cualquier correo` | pendiente |

## Sondas de mutación plantadas

| Sonda | `it` que cayó | Consulta / aserción | Commit de la reversión |
|---|---|---|---|
| pendiente | | | |
