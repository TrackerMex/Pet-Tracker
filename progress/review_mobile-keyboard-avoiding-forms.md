# review: mobile-keyboard-avoiding-forms (#148)
Fecha: 2026-10-04
Veredicto: APROBADO (R1-R9 verificados; R10 gate humano pendiente; init.sh no ejecutado, pendiente de autorizacion)

Branch `feature/148-mobile-keyboard-avoiding-forms`, HEAD `5052dde`, H0 `eb595a2`.

## Hallazgos
- Criticos: ninguno.
- Mayores: ninguno.
- Menores (no bloquean):
  - M1. Orden de imports: `import { HeaderHeightContext } from 'expo-router/react-navigation'` va antes de `expo-router`/`heroui-native` en los 7 ficheros, y en pairing `KeyboardAvoidingView` precede a `Alert` y `useContext` a `useCallback`. Solo estetico; `expo lint` exit 0.
  - M2. Fila R9 de traceability.md se autorreferencia (HEAD = commit de cierre `5052dde`); documentado por Codex y resoluble con el grep de su pie. Aceptable.
  - M3. Las sondas M-a..M-d de Codex solo las revise por lectura; las 3 que repeti (abajo) confirman el patron.

## Verificaciones
1. Alcance: `git diff --name-only eb595a2 HEAD` = 16 ficheros, exactamente los de design.md D9 (7 prod + 7 tests + traceability + impl). `git diff --stat eb595a2 HEAD -- package.json bun.lock jest.config.* src/__tests__ src/app/__tests__ feature_list.json` vacio: candados globales (D8) y dependencias intactos.
2. Historial C4: 7 pares test->feat en orden (login, weight-log, register, reset-password, add-pet, add-reminder, pairing); cada commit `test` toca solo ficheros de test, cada `feat` solo produccion; mensajes con R-ids. Un `refactor` (1aa949c, indentacion del Provider en test de add-pet). Los 15 hashes de traceability.md existen. Sin filas "pendiente" (R10 = gate humano, n/a).
3. Produccion (`git diff -w`): KAV raiz `testID="screen-<x>"`, `className="flex-1"`, `behavior="padding"`, `keyboardVerticalOffset={headerHeight}` con `useContext(HeaderHeightContext)` (import de `expo-router/react-navigation`) en el simbolo correcto de D2 (AddReminderContent, WeightLogContent). ScrollView `<x>-form` conserva className/contentInsetAdjustmentBehavior/contentContainerStyle. `keyboardShouldPersistTaps="handled"` anadido en add-pet, add-reminder, pairing, weight-log (login/register/reset ya lo tenian). Greps en los 7 ficheros: Platform 0, `?? 0` 0, `enabled=` 0, useHeaderHeight 0, `<KeyboardAvoidingView` 1 cada uno. reset-password: KAV solo en la rama formulario (diff -w no toca las ramas missing-token/success).
4. Tests: cada R1-R7 tiene un `it` con host `screen-<x>` + layout + `keyboardDidShow` que espera paddingBottom 200/291; R8 x4 asserta `keyboardShouldPersistTaps`. Sondas repetidas por mi (revertir y restaurar con git checkout, working tree limpio al final):
   - login sin `behavior="padding"`: 1 failed (R1).
   - add-pet sin `keyboardShouldPersistTaps`: 1 failed (R8 add-pet).
   - weight-log sin `keyboardVerticalOffset`: 1 failed (R7).
5. Checks desde `mobile-pet-tracker/` (tras `bun install --frozen-lockfile`, que no modifico el arbol):
   - 7 suites afectadas: `Tests: 197 passed, 7 passed`.
   - 5 suites globales (design-drift, consistency-classnames, legibility-classnames, ui-language, layout): 190 passed.
   - Total 12 suites / 387 tests verdes, igual al esperado.
   - `bunx tsc --noEmit`: exit 0. `bunx expo lint`: exit 0.
6. R9 medicion de alcance repetida (puntos 1 y 3): conforme.

## Checklist
- C2 estado: no evaluado en feature_list.json (tarea del leader); progress/current.md fuera de este alcance.
- C3 arquitectura: N/A (solo UI movil); sin logica de negocio anadida.
- C4 TDD: cumplido (ver 2).
- C5 trazabilidad: cumplida (ver 2).
- C6 spec: firmada en faa72f2 segun encargo; no re-auditada la casilla humana en este review.
- C7: N/A, no reemplaza nada.
- init.sh: NO EJECUTADO por instruccion del leader (Postgres/LocalStack compartidos con la sesion #105, humano sin autorizar). Pendiente de autorizacion; los checks moviles independientes si se ejecutaron.
- R10 (smoke en dev build Android, 7 casillas): del humano, NO marcado.
