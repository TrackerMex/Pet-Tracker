---
feature: "mobile-app-and-notification-icons"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-app-and-notification-icons]] (#101)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/app.assets.test.ts::#101 R1: fuente del adaptive icon entregada por el humano › pet-tracker-app-icon-foreground.png mide 1024x1024 RGBA` | pendiente |
| R2 | `mobile-pet-tracker/app.assets.test.ts::#101 R2 › icon.png (expo.icon) mide 1024x1024 RGBA`; `mobile-pet-tracker/app.config.test.ts::#101 R2 › expo.icon es ./assets/images/icon.png` | pendiente |
| R3 | `app.assets.test.ts::#101 R3 › android-icon-foreground.png (adaptiveIcon.foregroundImage) mide 1024x1024 RGBA`; `app.config.test.ts::#101 R3 › android.adaptiveIcon.foregroundImage es ./assets/images/android-icon-foreground.png` | pendiente |
| R4 | `app.assets.test.ts::#101 R4 › android-icon-monochrome.png (adaptiveIcon.monochromeImage) mide 1024x1024 RGBA`; `app.config.test.ts::#101 R4 › android.adaptiveIcon.monochromeImage es ./assets/images/android-icon-monochrome.png` | pendiente |
| R5 | `app.config.test.ts::#101 R5 › android.adaptiveIcon.backgroundColor es #9460FC y no declara backgroundImage`; `app.assets.test.ts::#101 R5 › android-icon-background.png ya no existe en assets/images` | pendiente |
| R6 | `app.config.test.ts::#101 R6 › el plugin expo-splash-screen declara splash-icon.png sobre #9460FC con imageWidth 200`; `app.assets.test.ts::#101 R6 › splash-icon.png (plugin expo-splash-screen) mide 1024x1024 RGBA` | pendiente |
| R7 | `app.config.test.ts::#101 R7 › el plugin expo-notifications declara icon pet-tracker-notification-96.png, color #9460FC y defaultChannel default`; `app.assets.test.ts::#101 R7 › pet-tracker-notification-96.png (plugin expo-notifications) mide 96x96 RGBA` | pendiente |
| R8 | `app.assets.test.ts::#101 R8 › favicon.png (web.favicon) mide 48x48 RGBA`; `app.config.test.ts::#101 R8 › web.favicon es ./assets/images/favicon.png` | pendiente |
| R9 | `app.config.test.ts::#101 R9 › ios.icon sigue siendo ./assets/expo.icon` | pendiente |
| R10 | gate humano: casillas «Smoke R10» de [[requirements]] §Aprobación (sin test jest) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente" (R10 se cierra
con las casillas firmadas, no con un hash de test).
Convención de commit: `feat(mobile-app-and-notification-icons): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
