# Implementación #79 — mobile-push-registration

- **Fecha**: 2026-09-17
- **Rama**: `feature/79-mobile-push-registration`
- **Estado**: R1-R11 verdes; R12 pendiente del gate humano

## Resultado

| Requisito | Resultado | TDD |
|---|---|---|
| R1 | `expo-notifications@~57.0.19` declarado y fijado por Bun | `a4f0bc8c` rojo → `b1204355` instalación E1 → `a6690b38` verde |
| R2 | plugin `expo-notifications` y permiso Android declarados en `app.json` | `fc64f48b` → `97c6e789` |
| R3 | registro autenticado de token con mapeo de estados | `b9bf0010` → `0ba16d6b` |
| R4 | baja autenticada con `expoToken` en el body de `DELETE` | `fed46e38` → `ebf79356` |
| R5 | `signOut` envía el `DELETE` antes de borrar la sesión | `4f18dd80` → `faa03cfa`; probe puro en `0ba7eb7e` |
| R6 | guardas de sesión, dispositivo, plataforma y `projectId` | `0b809f8b` → `ea62e3fd` |
| R7 | canal Android y flujo de permiso sin insistencia | `68a514d4` → `9e48f2c3` |
| R8 | token obtenido con el `projectId`, publicado y registrado | `9fe60971` → `8e85b485`; cleanup de test en `b7fbd56e` |
| R9 | fallos de Expo o red aislados del login | `ac5a63a8` → `c6e6a29a` |
| R10 | banner en primer plano y taps dirigidos a `/alerts` | `1d404ebc` → `be3f8bb5` |
| R11 | hook montado dentro de `QueryProvider`/`AuthProvider` | `bdc95eff` → `0a3ee506` |

Las firmas de `expo-notifications` se comprobaron contra la documentación
versionada de Expo SDK 57 antes de implementarlas. El código lee exclusivamente
`Constants.expoConfig?.extra?.eas?.projectId`; no inventa ni fija ningún UUID.

El contexto de autenticación expone `setPushToken` en ejecución. Su propiedad
TypeScript es opcional para no obligar a modificar fixtures históricas fuera de
la tabla de ficheros autorizados; el hook comprueba su presencia antes de usarla.

## Verificación

- `bunx jest 'src/api/__tests__/push-tokens' 'src/hooks/use-push-registration' 'src/providers/__tests__/auth-provider' 'app.config.test'`: 4 suites, 50 tests verdes.
- `bunx jest --runTestsByPath 'src/app/__tests__/layout.test.tsx'`: 1 suite, 7 tests verdes.
- `bunx jest`: 75 suites, 1326 tests y 1 snapshot verdes.
- `bunx tsc --noEmit`: verde.
- `bun run lint`: verde.
- `./init.sh`: verde; backend 170 suites / 1295 tests, infraestructura 2 / 14,
  móvil 75 / 1326 y e2e 27 suites / 384 tests pasados (3 / 8 omitidos).
- Grep-clean de los cuatro ficheros nuevos: sin hex, clases arbitrarias,
  `StyleSheet.create`, sombras ni `elevation`.
- Delta de i18n: cero. Los ficheros prohibidos de la spec no aparecen en el
  diff de implementación.

`init.sh` conservó avisos no bloqueantes ya conocidos: faltan localmente
`RESEND_API_KEY`, `RESEND_FROM` y `RESET_LINK_HOST`; `STATUS.md` todavía refleja
84/98 frente a las 101 entradas actuales; Expo avisa del futuro requisito de
Node 20.

## R12

**No ejecutado.** R12 es el gate humano y no se sustituye por un test automático.

Las tareas A y B aparecen firmadas con fecha 2026-09-17 en `requirements.md`,
pero la precondición observable de A no está presente: `app.json` no contiene
`extra.eas.projectId`. Por R6 el hook termina sin registrar en ese estado. El
humano debe aportar el identificador público, confirmar las credenciales FCM V1
y recorrer los 11 pasos de la prueba de humo en un dev build Android. Hasta que
anote aquí el resultado y la fecha, R12, la feature y su fila de trazabilidad
permanecen pendientes.
