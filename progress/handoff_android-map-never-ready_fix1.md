# Handoff fix 1 — #54: el fondo opaco del contenedor tapa el mapa

Branch: `feature/54-android-map-never-ready`.
Spec: `specs/android-map-never-ready/requirements.md` (status `approved`) —
**no la edites**. R1–R7 están implementados y verificados; esto es un defecto
encontrado durante el smoke R8, no un cambio de contrato.

Evidencia completa en `progress/discriminador2_android-map-never-ready.md`.
Léelo antes de tocar nada: documenta siete hipótesis descartadas con datos y
ahorra repetir el trabajo.

## Causa raíz

`mobile-pet-tracker/src/app/(tabs)/map.tsx:175` declara un fondo opaco en el
contenedor de la pantalla:

```tsx
<View testID="screen-map" className="flex-1 bg-background">
```

`GoogleMaps.View` monta un `SurfaceView`. Un `SurfaceView` no se dibuja dentro
de la ventana: la perfora y se compone por detrás. Un ancestro que pinta fondo
opaco sobre esa región tapa el hueco, así que en el dispositivo se ve el color
del tema en lugar del mapa. Los controles de zoom siguen visibles porque son
vistas normales dibujadas encima.

Verificado en dispositivo el 2026-09-01: cambiar esa única clase a `flex-1`
hace aparecer el mapa. Descartados con evidencia el dispositivo, la clave de
Google Maps, el proyecto de Cloud, `expo-maps`, el `BlurView` del tab bar y la
animación `fade` de los tabs.

## Qué hacer

El fondo no desaparece: **baja del contenedor a cada estado que sí lo
necesita**. Los estados sin mapa lo siguen pintando; la rama que monta el mapa
no.

En `mobile-pet-tracker/src/app/(tabs)/map.tsx`:

1. Línea 175 — quitar `bg-background` del contenedor:
   ```tsx
   <View testID="screen-map" className="flex-1">
   ```
2. Línea 177 — `Skeleton` de carga: `className="flex-1 bg-background"`
3. Línea 181 — contenedor del estado de error:
   `className="flex-1 items-center justify-center gap-3 p-6 bg-background"`
4. Línea 192 — contenedor de "No pets yet": misma adición de `bg-background`
5. Línea 200 — contenedor de "Live tracking requires a collar": ídem

No toques `src/components/pet-map.tsx`, ni `app.config.ts`, ni las
dependencias. El diff es de un solo archivo de producción más su test.

## TDD

Un requisito, un ciclo rojo → verde, commits separados. El test vive en
`mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx` y sigue el patrón
de aserción ya usado en ese archivo (`props.className`, ver línea 249).

Test rojo que fija el contrato — el contenedor que envuelve al mapa no puede
declarar fondo:

```ts
expect(screen.getByTestId('screen-map').props.className).not.toContain('bg-');
```

Nómbralo con el R-id `R8` y el sufijo de feature, como hace
`auth-login-me`, para no chocar con R-ids de otras series en archivos de test
compartidos.

Los 31 tests existentes de la suite del tab Map deben seguir verdes sin
tocarlos.

## Documentación

`docs/ui-guidelines.md` — añade la regla, porque esto vuelve a pasar en
cuanto alguien envuelva el mapa en una tarjeta o un contenedor con fondo:

> Ningún ancestro de una vista nativa de mapa puede declarar fondo opaco
> (`bg-*`). El mapa se compone por detrás de la ventana y un fondo encima lo
> tapa sin producir ningún error. Los estados sin mapa declaran su fondo cada
> uno.

Actualiza también la fila correspondiente de
`specs/android-map-never-ready/traceability.md`.

## Prohibiciones

- No marques `#54` como `done` en `feature_list.json`. Eso lo hace el leader
  tras veredicto del reviewer, y R8 además necesita smoke humano.
- No edites `specs/android-map-never-ready/requirements.md` ni ningún otro
  fichero de la spec aprobada, salvo `traceability.md`.
- No metas implementación, tests y documentación en un solo commit: incumple
  C4 de `CHECKPOINTS.md`.

## Al terminar

`bun run test`, `bun run typecheck` y `bun run lint` verdes en
`mobile-pet-tracker/`; `./init.sh` exit 0 desde la raíz (si falla solo por el
flake de `add-pet`, es el conocido #53 — reprodúcelo dirigido y déjalo
anotado, no lo arregles aquí). Escribe el resultado en
`progress/impl_android-map-never-ready.md` como sección nueva. Commitea en la
branch, no pushees.
