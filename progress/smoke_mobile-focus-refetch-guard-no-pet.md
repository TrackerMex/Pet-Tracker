# Smoke CC4: mobile-focus-refetch-guard-no-pet

CC4 lo cierra el humano en su dev build Android; el reviewer no lo ejecuta. Esta casilla no firma la spec: la firma sigue en `specs/mobile-focus-refetch-guard-no-pet/requirements.md` (línea «Aprobado por humano»).

Texto de CC4 (spec): smoke en el dev build Android del humano, no en Expo Go ni en la VPS. Con una cuenta sin mascotas, al enfocar Inicio, Perfil y Recordatorios no sale ninguna petición con id nulo. Con una cuenta con mascota, el detalle se refresca al enfocar.

- Rama: `feature/193-mobile-focus-refetch-guard-no-pet`
- Commit probado: `4e62343a`. Tras mergear `origin/main` (`14ec7307`), HEAD `7a470b7e`: A1 repetida sobre `7a470b7e`.
- Dispositivo y fecha: OnePlus Nord 5 (fecha: 2026-10-19)

## Preparación

1. Clon `C:\dev\pet-tracker`: `git fetch origin` y `git checkout feature/193-mobile-focus-refetch-guard-no-pet`. Comprobar `pwd` y `git branch --show-current` en la misma salida, y `git log -1 --oneline`. Metro sirve el JS del clon desde el que corre `expo start`.
2. `mobile-pet-tracker/.env`: `EXPO_PUBLIC_API_URL=http://<IP-LAN-del-PC>:3000/v1`. Si se cambia, arrancar Metro con `bunx expo start -c`.
3. Backend (`backend-pet-tracker`): `pnpm db:migrate` y `pnpm start:dev`, que escucha en el puerto 3000. Si el móvil no llega a la API, revisar el firewall de Windows para ese puerto.
4. Dev build instalado en el Android. Si no está: `bunx expo run:android` (JDK 21, no 24 ni 25). Con adb por Wi-Fi el móvil aparece dos veces: usar `adb -s <ip:puerto>`.
5. En `mobile-pet-tracker`: `bunx expo start`. Antes de empezar, pulsar `j` para abrir React Native DevTools y su pestaña Network. Después, pulsar `a` para abrir la app.
6. Cuentas: **A** sin mascotas (si tiene alguna, la prueba no vale) y **B** con al menos una mascota.

El log de la API no sirve: el backend no registra peticiones. La pestaña Network del dev build es la vía de comprobación.

## Pruebas

| # | Cuenta | Acción | Esperado | OK/KO | URL vista / nota |
|---|---|---|---|---|---|
| A1 | A | Entrar y esperar Inicio. Repetir 3 veces: Inicio, Perfil, Recordatorios | Filtro `null` vacío al final. Las peticiones de lista (mascotas, alertas) pueden salir: no son el problema | OK | Repetida sobre `7a470b7e` (2026-10-20), confirmado por el humano. |
| B1 | B | Entrar y esperar Inicio con mascota. Filtro `pets`. Enfocar Inicio 2 veces | Cada foco sale `GET …/v1/pets/<id>` | OK | |
| B2 | B | Enfocar Perfil 2 veces | Cada foco sale `GET …/v1/pets/<id>` | OK | |
| B3 | B | Enfocar Recordatorios 2 veces | Cada foco sale `GET …/v1/pets/<id>/reminders` | OK | |
| B4 | B | Cerrar la app del todo y reabrirla, sin cambiar de pestaña | Anotar si el detalle de Inicio carga solo (responde Q1) | OK | |

KO en A1 si aparece cualquier URL con `null`, por ejemplo `…/v1/pets/null` o `…/v1/pets/null/reminders`. Copiar esa URL en la columna de nota.

## Q1: arranque en frío con mascotas

Respuesta: El arranque en frío con mascotas carga el detalle de inicio (¿el detalle de Inicio carga solo tras el arranque en frío, o hace falta cambiar de pestaña?)

## Q2: checklist de autocrítica

Respuesta: No aplica. CC2 fija que el diff solo toca imports, la ref de `selectedPetId` con su efecto y la guarda dentro de la callback de foco, sin cambios de JSX ni de estilos. El reviewer lo declaró no aplicable en la pasada de cierre sobre `7a470b7e`.

## Q3: criterio de cierre del smoke

Respuesta: Sí. CC4 es criterio de cierre: el smoke en el dev build Android debe cubrir la cuenta sin mascotas, además de la cuenta con mascota. CC1 a CC3 no bastan. El humano lo firmó con las cuentas A (sin mascotas) y B (con mascota).

## Casilla de cierre

- [X] CC4 smoke OK (cuentas A y B, fecha: 2026-10-19)

Marcar con `[x]` y commitear en la rama de la feature. `done` en `feature_list.json` solo tras esta casilla. El reviewer ya dio APROBADO en `progress/review_mobile-focus-refetch-guard-no-pet.md`.
