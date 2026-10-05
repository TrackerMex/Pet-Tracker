# Trazabilidad — [[mobile-forgot-password]]

> Hashes registrados en el cierre de T1–T11. Mensajes literales del handoff:
> `test(mobile): … (#117 R<n>)` / `feat(mobile): … (#117 R<n>)`.
> R8/R9/R11 nacieron verdes: sus commits test son el registro, y las sondas
> temporales prueban sus candados. Ninguna sonda se commiteó. No rebasear.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/providers/__tests__/language-provider.test.tsx::#117 R1: el catálogo trae las claves de recuperar contraseña › registra las seis claves en los dos idiomas, con {{email}} en forgot.sentTo, y en la tabla de la spec de idioma` y `› retira forgot.comingSoon de los dos idiomas` | `11bc5588` test(mobile): lock the six forgot catalog keys (#117 R1)<br>`6ff636d3` feat(mobile): add the forgot copy in both languages (#117 R1)<br>`0fe5e0fe` test(mobile): lock the forgot route, screen tree and stub removal (#117 R3, R1)<br>`14752498` feat(mobile): move forgot to its own screen behind a thin route (#117 R3, R1) |
| R2 | `src/api/__tests__/auth.test.ts::#117 R2: forgotPassword mapea la respuesta por kind` (7 definiciones de `it`, 8 casos por `it.each`) | `7ba0b3a9` test(mobile): lock the forgotPassword client by kind (#117 R2)<br>`9cb64956` feat(mobile): add the forgotPassword client to the auth api (#117 R2) |
| R3 | `src/screens/forgot/index.test.tsx::#117 R3: la ruta forgot delega en ForgotScreen` (2 `it`) | `0fe5e0fe` test(mobile): lock the forgot route, screen tree and stub removal (#117 R3, R1)<br>`14752498` feat(mobile): move forgot to its own screen behind a thin route (#117 R3, R1) |
| R4 | `src/screens/forgot/index.test.tsx::#117 R4: el formulario pide el correo` (3 `it`) | `ee307c0e` test(mobile): lock the forgot form state (#117 R4)<br>`be75a850` feat(mobile): make the forgot email editable and gate submit on it (#117 R4) |
| R5 | `src/screens/forgot/index.test.tsx::#117 R5: enviar pasa la pantalla a «Revisa tu correo»` (2 `it`) | `c243a37c` test(mobile): lock the check-your-email state after sending (#117 R5)<br>`9e4c8378` feat(mobile): request the recovery link and switch to check your email (#117 R5) |
| R6 | `src/screens/forgot/index.test.tsx::#117 R6: reenviar repite la misma petición` (2 `it`) | `92adb028` test(mobile): lock resend from check your email (#117 R6)<br>`f104949c` feat(mobile): resend the recovery link with the submitted email (#117 R6) |
| R7 | `src/screens/forgot/index.test.tsx::#117 R7: cada kind distinto de ok pinta su copy en forgot-error` (`it.each` ×5 + 1 `it`) | `d05462f1` test(mobile): lock the forgot error copy for every non-ok kind (#117 R7)<br>`4390db9c` feat(mobile): map every non-ok kind to its forgot error copy (#117 R7) |
| R8 | `src/screens/forgot/index.test.tsx::#117 R8: forgot se aparta del teclado en Android › el host screen-forgot añade paddingBottom 200 al abrir el teclado` | `574c3674` test(mobile): lock the forgot keyboard avoidance (#117 R8) |
| R9 | `src/screens/forgot/index.test.tsx::#117 R9: las métricas del stub sobreviven al cambio de estado` + reapuntados `#61 R8 › conserva el centrado…` y `#127 R1 › pinta forgot-submit…` | `0fe5e0fe` test(mobile): lock the forgot route, screen tree and stub removal (#117 R3, R1)<br>`14752498` feat(mobile): move forgot to its own screen behind a thin route (#117 R3, R1)<br>`6b663268` test(mobile): lock the forgot metrics across both states (#117 R9) |
| R10 | `src/__tests__/ui-language.test.ts::#65 R1 › resuelve las 36 ocurrencias normativas`, `::#65 R18 › no deja ningún valor fijo…`, `::resuelve cada ocurrencia de la tabla…`; `src/__tests__/ui-copy-table.ts::cuadra ALL_USES…`; `src/__tests__/consistency-classnames.test.ts` (`#120 R1`, tiles, `#62 R13`, `#62 R14`); `src/__tests__/legibility-classnames.test.ts::#61 R4`; `src/providers/__tests__/language-provider.test.tsx::#65 R12` (longitud) | `6ff636d3` feat(mobile): add the forgot copy in both languages (#117 R1)<br>`14752498` feat(mobile): move forgot to its own screen behind a thin route (#117 R3, R1)<br>`9e4c8378` feat(mobile): request the recovery link and switch to check your email (#117 R5)<br>`4390db9c` feat(mobile): map every non-ok kind to its forgot error copy (#117 R7) |
| R11 | `src/api/__tests__/auth.test.ts::#117 R11: ok no depende del cuerpo` (3 `it`) y `src/screens/forgot/index.test.tsx::#117 R11: la pantalla de éxito es la misma para cualquier correo` | `4ad9baff` test(mobile): lock anti-enumeration in the forgot client and screen (#117 R11) |

## Sondas de mutación plantadas

Todas se ejecutaron sin staging, fallaron por el sujeto previsto y se
restauraron con `git checkout HEAD -- <ruta>`; diff de la ruta y
`git diff --cached --stat` vacíos después de cada reversión. La evidencia
(Expected/Received o consulta, comando, cuentas y exit) está en
`progress/impl_mobile-forgot-password.md`.

| Sonda | `it` que cayó | Consulta / aserción | Reversión (sin commit) |
|---|---|---|---|
| M1-b | `#65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas`<br>`#117 R1: el catálogo trae las claves de recuperar contraseña retira forgot.comingSoon de los dos idiomas` | aserción: toHaveLength / toBeUndefined | `git checkout HEAD -- <ruta>`; HEAD `4ad9baff` |
| M2-b | `#117 R2: forgotPassword mapea la respuesta por kind hace POST a /auth/forgot-password con { email } y mapea 200 a ok sin leer el body`<br>`#117 R2: forgotPassword mapea la respuesta por kind mapea 429 a rate-limited sin leer el body` | aserción: not.toHaveBeenCalled | `git checkout HEAD -- <ruta>`; HEAD `4ad9baff` |
| M3-a | `#117 R3: la ruta forgot delega en ForgotScreen renderiza screen-forgot y forgot-form con el título desde la ruta y sin el aviso del stub` | consulta: getByTestId(forgot-form) | `git checkout HEAD -- <ruta>`; HEAD `4ad9baff` |
| M4-b | `#117 R4: el formulario pide el correo deshabilita forgot-submit con el correo vacío o solo espacios y lo habilita al escribir` | aserción: toBeDisabled con espacios | `git checkout HEAD -- <ruta>`; HEAD `4ad9baff` |
| M5-a | `#117 R5: enviar pasa la pantalla a «Revisa tu correo» envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición` | aserción: toHaveBeenCalledWith | `git checkout HEAD -- <ruta>`; HEAD `4ad9baff` |
| M6-b | `#117 R6: reenviar repite la misma petición un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»` | consulta: getByText(Revisa tu correo) | `git checkout HEAD -- <ruta>`; HEAD `4ad9baff` |
| M7-g | `#65 R1: el grupo (auth) resuelve su copy por clave resuelve las 36 ocurrencias normativas` | aserción: toEqual (uses 1 → 2) | `git checkout HEAD -- <ruta>`; HEAD `4ad9baff` |
| M8-c | `#117 R8: forgot se aparta del teclado en Android el host screen-forgot añade paddingBottom 200 al abrir el teclado` | aserción: toHaveStyle (200 → 291) | `git checkout HEAD -- <ruta>`; HEAD `574c3674` |
| M9-b | `#117 R9: las métricas del stub sobreviven al cambio de estado «Revisa tu correo» conserva el mismo contentContainerStyle y keyboardShouldPersistTaps` | aserción: toEqual (alignItems ausente) | `git checkout HEAD -- <ruta>`; HEAD `6b663268` |
| M10-c | `#61 R4: el acento como tinta usa accent-strong app/(auth)/forgot.tsx pinta con text-accent-strong (1)` | aserción: toHaveLength (1 esperado; null recibido, cero matches) | `git checkout HEAD -- <ruta>`; HEAD `4ad9baff` |
| M11-a | `#117 R11: ok no depende del cuerpo mapea 200 con body {"requested": false} a ok sin leer el body`<br>`#117 R11: ok no depende del cuerpo mapea 200 con JSON inválido a ok` | aserción: resolves.toEqual (ok → error) | `git checkout HEAD -- <ruta>`; HEAD `4ad9baff` |
