---
feature: "mobile-app-and-notification-icons"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-app-and-notification-icons]] (#101)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | sin test jest: `git diff --stat d29d49d5 --` sobre las tres fuentes `pet-tracker-*` vacío ([[design]] §Verificaciones del reviewer) | `32f4c403` (último commit al verificar): `test(mobile-app-and-notification-icons): conservar icono de iOS (R9)`; git diff vacio |
| R2 | `mobile-pet-tracker/app.assets.test.ts::#101 R2 › icon.png (expo.icon) mide 1024x1024 RGBA`; `mobile-pet-tracker/app.config.test.ts::#101 R2 › expo.icon es ./assets/images/icon.png` | Test `a1c7feef`: `test(mobile-app-and-notification-icons): candar icono de la app (R2)`; verde `bd2ac966`: `feat(mobile-app-and-notification-icons): derivar icono de la app (R2)`; rojo por mutación documentado en el reporte |
| R3 | `app.assets.test.ts::#101 R3 › android-icon-foreground.png (adaptiveIcon.foregroundImage) mide 1024x1024 RGBA`; `app.config.test.ts::#101 R3 › android.adaptiveIcon.foregroundImage es ./assets/images/android-icon-foreground.png` | Rojo `1681f62f`: `test(mobile-app-and-notification-icons): candar foreground del adaptive icon (R3)`; verde `190eb04c`: `feat(mobile-app-and-notification-icons): encajar foreground en zona segura (R3)` |
| R4 | `app.assets.test.ts::#101 R4 › android-icon-monochrome.png (adaptiveIcon.monochromeImage) mide 1024x1024 RGBA`; `app.config.test.ts::#101 R4 › android.adaptiveIcon.monochromeImage es ./assets/images/android-icon-monochrome.png` | Rojo `f37d0a73`: `test(mobile-app-and-notification-icons): candar monochrome del adaptive icon (R4)`; verde `6639f8e7`: `feat(mobile-app-and-notification-icons): derivar silueta blanca en zona segura (R4)` |
| R5 | `app.config.test.ts::#101 R5 › android.adaptiveIcon.backgroundColor es #9460FC y no declara backgroundImage`; `app.assets.test.ts::#101 R5 › android-icon-background.png ya no existe en assets/images` | Rojo `64ce999f`: `test(mobile-app-and-notification-icons): candar fondo plano sin PNG (R5)`; verde `e6d959dd`: `feat(mobile-app-and-notification-icons): usar fondo violeta sin PNG (R5)` |
| R6 | `app.config.test.ts::#101 R6 › el plugin expo-splash-screen declara splash-icon.png sobre #9460FC con imageWidth 200`; `app.assets.test.ts::#101 R6 › splash-icon.png (plugin expo-splash-screen) mide 1024x1024 RGBA` | Rojo `e0cdd4b8`: `test(mobile-app-and-notification-icons): candar splash violeta con el perrito (R6)`; verde `a62caa53`: `feat(mobile-app-and-notification-icons): configurar splash y copiar foreground (R6)` |
| R7 | `app.config.test.ts::#101 R7 › el plugin expo-notifications declara icon pet-tracker-notification-96.png, color #9460FC y defaultChannel default`; `app.assets.test.ts::#101 R7 › pet-tracker-notification-96.png (plugin expo-notifications) mide 96x96 RGBA` | Rojo `7edffcb9`: `test(mobile-app-and-notification-icons): candar icono de notificación (R7)`; verde `15028e66`: `feat(mobile-app-and-notification-icons): declarar icono blanco y tinte de notificación (R7)` |
| R8 | `app.assets.test.ts::#101 R8 › favicon.png (web.favicon) mide 48x48 RGBA`; `app.config.test.ts::#101 R8 › web.favicon es ./assets/images/favicon.png` | Test `7f26654d`: `test(mobile-app-and-notification-icons): candar favicon (R8)`; verde `6be5ea45`: `feat(mobile-app-and-notification-icons): derivar favicon desde la fuente (R8)`; rojo por mutación documentado en el reporte |
| R9 | `app.config.test.ts::#101 R9 › ios.icon sigue siendo ./assets/expo.icon` | `32f4c403`: `test(mobile-app-and-notification-icons): conservar icono de iOS (R9)`; rojo por mutación y git diff vacío documentados en el reporte; nada que implementar |
| R10 | gate humano: casillas «Smoke R10» de [[requirements]] §Aprobación (sin test jest) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente" (R1 se cierra
con el hash del último commit de la branch y el `git diff` vacío; R10 con las
casillas firmadas, no con un hash de test).
Convención de commit: `feat(mobile-app-and-notification-icons): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

Evidencia de implementación y de las mutaciones: [[../../progress/impl_mobile-app-and-notification-icons]]. Por instrucción explícita del handoff, los hashes se rellenan en un único commit docs final. El humano confirmó el delta corregido de +15 tests (7 assets y 8 configuración) en la sesión de implementación; R10 conserva su gate pendiente.
