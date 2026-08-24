# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #39 mobile-reminders — in_progress

- Inicio: 2026-08-25
- Branch: `feature/39-mobile-reminders` (sincronizada con main, #47 dentro)
- Spec aprobada por humano (`1d9420f`). Dependencia #47 saldada (done,
  PR #71 mergeado).
- Primera feature bajo la estructura Expo oficial (`src/screens/`). Tras el
  rework de R8 usa el picker de `@expo/ui ~57.0.11`, ya instalado, sin
  dependencia community adicional y compatible con Expo Go SDK 57.
- Plan: handoff a Codex → reviewer → smoke humano Expo Go → cierre.
- Implementación R1–R10 y verificación R11 terminadas por Codex con TDD por
  requisito. Suite móvil: 36/36 y 423/423; `./init.sh`: exit 0.
- Informe: `progress/impl_mobile-reminders.md`.
- Siguiente paso: reviewer; después, smoke humano R12 en Expo Go. La feature
  permanece `in_progress` y no se ejecutó el cierre de sesión.
- Rework R8 decidido por el humano: sustituir el picker community por el
  drop-in de `@expo/ui`, con `Host` universal, TDD rojo/verde y nueva
  verificación completa. La decisión de dependencia se toma contra el
  manifest instalado de `@expo/ui@57.0.11` y la documentación de Expo SDK 57.
- Rework R8 completado: rojo `8042a80`, verde `02f02ae`, trazabilidad
  `254dda2`; suite móvil 36/36 y 424/424, bundle Android Expo correcto y
  `./init.sh` exit 0. R12 continúa reservado al smoke humano en Expo Go.
- Rework pre-R12 iniciado por hallazgo del smoke humano: al cambiar de mascota,
  `useApi` expone el valor resuelto para el `fn` anterior. Plan: regresión TDD
  en el hook → fix raíz que distingue cambio de `fn` de refetch por `tick` →
  trazabilidad/progreso R12 → suite móvil completa y `./init.sh`.
- Fix raíz completado: rojo `6a2aa9b` (1 fallo, 5 tests verdes), verde
  `19aa304` (6/6), sin cambio de API pública ni de pantallas. La suite completa
  destapó una única expectativa antigua en Home; se corrigió en `f11a32c` con
  la excepción C4 en el cuerpo del commit. Móvil: 36/36 suites y 424/424 tests;
  typecheck y lint: exit 0; `./init.sh`: exit 0 y mensaje `Todo verde`.
  Pendiente únicamente: re-smoke humano R12 sobre el fix.
- Segundo hallazgo del smoke humano en R12: reemplazar la confirmación de
  borrado `Alert.alert` por el BottomSheet universal de `@expo/ui`. Rojo
  `a6f3a56` (8 fallos esperados, 11 verdes; excepción C4 por retirar asserts
  obsoletos de Alert documentada en el commit) y verde `21e769d` (19/19), con
  `Host`, `isPresented`/`onDismiss`, snap point `half` y el flujo DELETE/refetch
  existente intacto. Móvil: 36/36 suites y 425/425 tests; typecheck/lint y
  bundle Android SDK 57 verdes; `./init.sh`: exit 0 y `Todo verde`. Pendiente
  únicamente: re-smoke humano R12.
- Tercer hallazgo del smoke humano en R12: Expo Go (Android físico, SDK 57)
  cerraba la app al confirmar el borrado por usar el árbol universal raíz de
  `@expo/ui`. Fix completado con el export
  `@expo/ui/community/bottom-sheet`, su API real `index`/`onClose` y children
  RN/HeroUI alojados por `RNHostView`; no se añadieron providers porque el
  wrapper crea su `Host`, el provider modal es no-op y el layout ya tiene
  `GestureHandlerRootView`. Rojo `1cfd679` (8 fallos R7 esperados, 11 verdes;
  excepción C4 documentada) y verde `a55c544` (19/19). Móvil: 36/36 suites y
  425/425 tests; typecheck/lint, bundle Android de 5.270 módulos y `./init.sh`
  exit 0 con `Todo verde`. Trazabilidad e informe actualizados. R12 sigue
  pendiente del re-smoke humano; la feature permanece `in_progress`.
