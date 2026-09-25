---
feature: "mobile-notifications-permission-recovery"
status: approved           # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-notifications-permission-recovery]] (#99)

R1 y R2 viven en `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx`
(antes de `describe('R15: importar el modulo no toca expo-notifications'`);
R3 en `mobile-pet-tracker/src/screens/profile/index.test.tsx` (al final).
Convención de commit: `test(<scope>): <desc> (Rn)` el rojo,
`feat(<scope>): <desc> (Rn)` el verde, con `<scope>` = `push` (R1, R2) o
`profile` (R3) según [[tasks]].

**Codex rellena las columnas de commit en UN solo commit final**
`docs(push): fill #99 traceability`, **después del último verde** (R3). No se
toca este fichero en los commits TDD: ni ficheros de arnés mezclados con test o
producción, ni una actualización por commit. El `reviewer` no aprueba si queda
una fila de R1-R3 en «pendiente» (CHECKPOINTS C5). R4 la cierra el humano en su
casilla de [[requirements]].

Los rojos de R1-R3 son **naturales** ([[design]] D9); el de R1 lleva el
esqueleto `useNotificationsBlocked` que devuelve `false`, nombrado en [[tasks]].
Ninguna mutación versionada.

Recuentos al cierre (base `d7cb0d60`): `use-push-registration.test.tsx`
**26 → 33 → 41**; `src/screens/profile/index.test.tsx` **33 → 38**;
`language-provider.test.tsx` **9** y `ui-language.test.ts` **25** (candados
movidos, sin tests nuevos); móvil **83 / 1510 → 83 / 1530**; backend, infra y
e2e sin cambios.

**No rebasear después de rellenar esta tabla**: los hashes dejarían de ser
ancestros y habría que reapuntarlos verificando `git merge-base --is-ancestor`.

| Requisito | Test (título literal del `describe`) | Commit rojo | Commit verde |
|---|---|---|---|
| R1 — el hook publica el bloqueo solo con `granted` y `canAskAgain` en `false`; se apaga al desmontar (5 filas + 2 `it`) | `#99 R1: el hook publica el bloqueo solo con el permiso denegado y sin poder pedirse` | pendiente | pendiente |
| R2 — al volver a `active` con el aviso encendido relee sin pedir y registra si quedó concedido (3 + 3 filas + 2 `it`) | `#99 R2: al volver a primer plano con el aviso encendido se reevalúa el permiso sin pedirlo` | pendiente | pendiente |
| R3 — aviso en Perfil, acción `Linking.openSettings()`, copy es/en y tabla de idioma (5 `it` + 2 candados movidos) | `#99 R3: Perfil avisa de las notificaciones bloqueadas y abre la configuración de la app` | pendiente | pendiente |
| R4 — smoke en dev build de Android 13+ | humano | — | pendiente (casilla en [[requirements]] §Prueba de humo) |

## Candados ajenos movidos

Declarados en [[requirements]] §Candados «Se mueven»:

| Candado | Spec de origen | Delta | Viaja en |
|---|---|---|---|
| `src/providers/__tests__/language-provider.test.tsx` · `expect(englishKeys).toHaveLength(` | `mobile-ui-language` (#65) | ` + 2` y comentario | rojo de R3 |
| `src/__tests__/ui-language.test.ts` · `describe('#65 R7: Profile resuelve su copy por clave'` | `mobile-ui-language` (#65) | título `36`, `35 - 1 + 2` | rojo de R3 |
| `src/__tests__/ui-copy-table.ts` · `R7_PROFILE` | `mobile-ui-language` (#65) | +2 filas tras `profile.addPet` | verde de R3 |
| `specs/mobile-ui-language/design.md` §2.7 | `mobile-ui-language` (#65) | +2 filas `← añadida por #99 (R3)` | verde de R3 |
