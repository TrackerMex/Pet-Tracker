# Implementación #79 — mobile-push-registration

- **Fecha**: 2026-09-17
- **Rama**: `feature/79-mobile-push-registration`
- **Estado**: R1-R11 verdes; R10 reparado tras el rechazo; R12 pendiente de repetir el gate humano

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
| R10 | banner en primer plano y taps dirigidos a `/alerts`; el cold start espera al redirect autenticado y conserva la pila Home → Alerts | `1d404ebc` → `be3f8bb5`; regresión `c231651a` → `0a68e99e` |
| R11 | hook montado dentro de `QueryProvider`/`AuthProvider` | `bdc95eff` → `0a3ee506` |

Las firmas de `expo-notifications` se comprobaron contra la documentación
versionada de Expo SDK 57 antes de implementarlas. El código lee exclusivamente
`Constants.expoConfig?.extra?.eas?.projectId`; no inventa ni fija ningún UUID.

El contexto de autenticación expone `setPushToken` en ejecución. Su propiedad
TypeScript es opcional para no obligar a modificar fixtures históricas fuera de
la tabla de ficheros autorizados; el hook comprueba su presencia antes de usarla.

## Verificación

- Tras reparar R10,
  `bunx jest --runTestsByPath 'src/app/__tests__/layout.test.tsx' 'src/hooks/use-push-registration.navigation.test.tsx' 'src/hooks/use-push-registration.test.tsx' --runInBand --silent`:
  3 suites y 32 tests verdes.
- `bunx jest --runInBand --silent`: 76 suites, 1332 tests y 1 snapshot verdes.
- `bunx tsc --noEmit`: verde.
- `bun run lint`: verde.
- `./init.sh`: verde; backend 170 suites / 1295 tests, infraestructura 2 / 14,
  móvil 76 / 1332 y e2e 27 suites / 384 tests pasados (3 / 8 omitidos).
- Grep-clean de los cinco ficheros nuevos: sin hex, clases arbitrarias,
  `StyleSheet.create`, sombras ni `elevation`.
- Delta de i18n: cero. Los ficheros prohibidos de la spec no aparecen en el
  diff de implementación.

`init.sh` conservó avisos no bloqueantes ya conocidos: faltan localmente
`RESEND_API_KEY`, `RESEND_FROM` y `RESET_LINK_HOST`; una feature histórica no
tiene spec; el AWS SDK avisa de su futuro requisito de Node 22.

## R12

**Ejecutado y rechazado el 2026-09-19 en el paso 8.** En un teléfono Android
físico pasaron el registro del token, el banner en primer plano y el tap con la
app viva en segundo plano. Con la app matada, el tap abrió Home en vez de Alerts
y dejó una entrada extra en la pila.

La regresión automática nueva reproduce que el `replace('/home')` pendiente
puede ganar al `push('/alerts')` inicial y comprueba el resultado observable:
Alerts final, una vuelta a Home y ninguna vuelta adicional. El arreglo quedó en
`0a68e99e`, sin modificar `src/app/index.tsx` ni usar temporizadores. R12, la
feature y su fila de trazabilidad siguen pendientes hasta que un humano repita
el paso 8 (y complete los pasos restantes aplicables) en el dev build.

## R15 — el modulo no toca expo-notifications al importarse (enmienda E4)

Anotado por el `leader` al cerrar la ronda, a partir de los commits y del
veredicto; Codex no dejo seccion propia.

- Rojo `7b6b3b92`: aisla el modulo con el doble de `expo-notifications`
  configurado para lanzar y asevera que **importarlo** no lanza. Falla contra la
  version anterior porque `setNotificationHandler` vivia en el nivel superior del
  modulo.
- Verde `b6c3392e`: el `import * as Notifications` estatico desaparece y queda
  un `type NotificationsModule = typeof import('expo-notifications')`, que se
  borra al compilar; la libreria se carga dentro del efecto, **despues** de los
  guards de R6, y el handler de primer plano se instala ahi. Se anade la
  condicion de Expo Go por entorno de ejecucion, que es lo que R6.2 creia cubrir
  con `Device.isDevice` y no cubria.
- Verificado por el `reviewer` en el JS transpilado: ningun `require` de
  `expo-notifications` en el cuerpo del modulo. Detalle en
  `progress/review_mobile-push-registration-r15.md`.

