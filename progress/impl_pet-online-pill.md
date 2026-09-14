---
feature: "pet-online-pill"
issue: 73
branch: "feature/73-pet-online-pill"
date: 2026-09-14
status: in_progress
---

# Implementación — pet-online-pill (#73)

## Línea base y alcance

- `./init.sh`: exit 0 antes de editar; build, tests, e2e, lint y typecheck verdes.
- Branch y worktree verificados: `feature/73-pet-online-pill` en
  `/home/claude/sites/Pet-Tracker-wt-backend`.
- `mobile-pet-tracker/.expo/types/router.d.ts`: ausente.
- Skills aplicadas: `ponytail`, `expo:building-native-ui`,
  `appllama-app-design-skill` y `animate-expo`. Los nombres antiguos del
  handoff (`expo-overview`, `expo-native-ui`, `expo-animation`) no están
  disponibles en el catálogo; se usaron sus equivalentes activos.
- Documentación oficial consultada: Expo SDK 57 y Reanimated 4.5.1.

## R1 — umbral y derivación pura

- Rojo `b9026577`: `pnpm test -- connectivity` terminó exit 1; la primera
  aserción mostró `Expected: 120000`, `Received: 0`, y las otras cinco
  alcanzaron el stub `not implemented`.
- Implementación: umbral inclusivo `2 * 60_000`, documentado con E1, y función
  pura que conserva `null`, considera online el límite y los timestamps futuros.
- Verde: `pnpm test` en backend, exit 0. `connectivity.ts` solo importa la
  constante pura de `@/pipeline/constants`.

## R2 — contrato derivado en lectura

- Rojo preparado: el mapper ya recibe `now`, su fuente ya no acepta
  `connectivity` y los tres controllers pasan el reloj, pero el cuerpo conserva
  el placeholder `connectivity: null`.
- `pnpm test -- device-status pets.controller`: exit 1, cuatro aserciones
  fallaron con `Expected: online|offline`, `Received: null`; `pnpm build`: exit 0.
- Rojo `2f04bc49` publicado.
- Verde: `pnpm test` pasó (166 suites, 1277 tests) y `pnpm build` terminó con
  exit 0 tras delegar la derivación al helper único.

## R3 — tres estados por API contra Postgres

- Rojo preparado con Postgres real, sin sleeps ni `device_subscriptions`.
- `pnpm test:e2e -- device-connectivity`: exit 1; el caso `null` pasó y las
  aserciones de perfil para `offline` (`:163`) y `online` (`:175`) recibieron
  `null`, el placeholder de R2.
- Rojo `b77468ba` publicado.
- Verde: `pnpm test:e2e -- device-connectivity` pasó (1 suite, 3 tests) contra
  Postgres real; los dos endpoints devolvieron las cinco claves esperadas.

## R4 — eliminación del pestillo

- Rojo preparado: el e2e de ingesta conserva todos los checks de batería,
  último mensaje y watermark, pero ahora exige que `connectivity` siga NULL.
- `pnpm test:e2e -- ingestion`: exit 1 en `ingestion.e2e-spec.ts:218`;
  `toBeNull()` recibió `"online"`, demostrando el pestillo vigente.
- Rojo `0bce51d6` publicado.
- Implementación: el store conserva solo batería, `lastMessageAt` y
  `updatedAt`; el puerto, el modelo de datos y la spec de ingesta documentan
  que la conectividad se deriva al leer. La enmienda se copió con la firma E3.
- Verde: `pnpm test:e2e` pasó (26 suites, 365 tests; 3 suites y 8 tests
  omitidos) y `pnpm test:e2e -- ingestion` pasó (1 suite, 3 tests).
- Sonda R4: al restaurar temporalmente `connectivity: 'online',`,
  `pnpm test:e2e -- ingestion` falló en `ingestion.e2e-spec.ts:218` con
  `toBeNull()` / `Received: "online"`; tras quitarla de nuevo, los 3 tests
  pasaron y `rg -n "connectivity: 'online'" backend-pet-tracker/src/workers`
  no devolvió coincidencias.

## R5 — catálogo bilingüe

- Rojo preparado: el candado de cardinalidad espera exactamente dos claves
  nuevas y un test exige sus valores bilingües y filas normativas.
- `bun run test -- language-provider`: exit 1; cardinalidad esperada 304 y
  recibida 302, y `home.unknown` recibió `undefined` en el test nuevo.
- Rojo `d2a7f56f` publicado.
- Verde: se añadieron únicamente `home.unknown` y
  `deviceConnectivity.offline` en `en`/`es`, más sus dos filas normativas;
  `bun run test -- language-provider ui-language` pasó (2 suites, 30 tests).
  No hay literales `Esperando señal`/`Awaiting signal` en pantallas.

## R6 — helper único y Pairing offline

- Rojo preparado: el tipo de cuatro estados y el helper ya existen como
  sujeto (stub), mientras tests de unidad, Pairing y copy exigen `offline`.
- `bun run test -- device-connectivity pairing ui-language`: exit 1 (3 suites,
  8 fallos): `offline` cayó en `unknown`, las cuatro decisiones alcanzaron
  `not implemented`, Pairing pintó `Desconocida` y `checkUses` contó 0.
- Rojo `badf0069` publicado.
- Verde: `DEVICE_CONNECTIVITY_META` reconoce `offline` y
  `deviceConnectionState` resuelve sus cuatro ramas sin estrechar el contrato
  API. `bun run test -- device-connectivity pairing ui-language design-drift`
  pasó (4 suites, 116 tests).

## R7 — cuatro estados en `collar-status`

- Rojo preparado: Home debe pintar `Esperando señal` para un collar sin primer
  reporte y conservar `Sin conexión` con batería para `offline`; el candado de
  copy exige `home.unknown` en la pantalla.
- `bun run test -- screens/home ui-language`: exit 1 (3 fallos); el collar con
  `connectivity: null` pintó `Sin conexión` y `checkUses` contó cero usos de
  `home.unknown` (en sus dos recorridos).
- Rojo `e5a498c9` publicado.
- Verde: Home deriva `connection` una sola vez, resuelve copy y tono con
  `HOME_CONNECTION`, y escoge el icono desde ese estado. `bun run test --
  screens/home ui-language legibility` pasó (5 suites, 223 tests); no queda
  ninguna comparación directa con `device.connectivity` en la pantalla.

## R8 — píldora y pulso accesible

- Gate E1-E3 revalidado inmediatamente antes de R8: `git pull --no-rebase
  origin feature/73-pet-online-pill` indicó `Already up to date` y la casilla
  aprobada sigue marcada en `requirements.md:933`.
- Rojo preparado: tipos y prop públicos más constante E2 placeholder; los
  tests candan estructura, tokens, accesibilidad, ubicación y pulso reducido.
- `bun run test -- pet-hero-header legibility consistency design-drift`: exit
  1; 18 fallos nuevos: no existe `pet-hero-status`, legibilidad cuenta 0,
  `STATUS_DOT_PULSE.duration` es 0 y el cleanup no cancela ningún bucle.
- Rojo `dcff4641` publicado.
- Implementación: píldora accesible de dos hijos con tokens por tono; solo el
  punto `success` usa un shared value de opacidad 1 → 0.5 → 1, 1000 ms por
  tramo, UI thread, doble guarda de reduced motion y cleanup con cancelación.
- El mock prescrito de Reanimated no exponía el `Animated.View` consumido por
  el `Skeleton` de HeroUI en esta suite; el test conserva un `View` nativo para
  ese tercero. El candado de `animate-pulse` busca ahora una clase, no la
  mención obligatoria del nombre en el docblock E2.
- Verde: `bun run test -- pet-hero-header legibility consistency design-drift
  --silent` pasó (4 suites, 152 tests) y `bun run typecheck` terminó exit 0.
- Sondas R8/E2, todas con `bun run test -- pet-hero-header --runInBand
  --silent` y restauración inmediata:
  - cruzar puntos success/warning: rojo en `pet-hero-header.test.tsx:448` para
    ambas filas (`bg-success`/`bg-warning-strong`; también el guard reduced);
  - quitar `!reduceMotion`: rojo en `:564`, el punto resultó animado;
  - pulsar todo tono distinto de muted: rojo en `:597` para `warning`;
  - quitar el cleanup: rojo en `:611`, `cancelAnimation` recibió 0 llamadas.

## R9 — Home monta la píldora desde el mismo estado

- Rojo preparado: cuatro filas comparan la píldora con `collar-status`, más
  candados para mantenerla fuera del slot y ausente durante el skeleton.
- `bun run test -- screens/home --silent`: exit 1 (4 fallos, 176 pasaron);
  cada fila falló porque Home todavía no entregaba `pet-hero-status`, mientras
  los candados de slot y skeleton quedaron verdes.
- Rojo `b0570334` publicado.
- Implementación: Home entrega al hero la etiqueta traducida y el tono del
  mismo `HOME_CONNECTION[connection]` que alimenta `collar-status`; la píldora
  queda fuera del slot y no aparece mientras el detalle carga.
- Verde: `bun run test --silent` pasó toda la app móvil (73 suites, 1259 tests)
  y `bun run typecheck` terminó exit 0.
- Sonda R9: al cruzar temporalmente los `labelKey` de `unknown` y `offline`,
  `bun run test -- screens/home --silent` quedó rojo (4 fallos en
  `index.test.tsx:658`, `:681` y dos filas en `:747`); tras restaurar, pasó
  (3 suites, 180 tests).

## R10 — candados y verificación final

- Las cinco sondas de producción se restauraron y `git diff --exit-code` dio
  exit 0 antes de escribir este informe.

| # | Sonda | Visto en rojo (comando + línea) |
|---|---|---|
| 1 | Reponer `connectivity: 'online'` en `ingestion.drizzle.store.ts` | R4: `pnpm test:e2e -- ingestion` → `ingestion.e2e-spec.ts:218`, `toBeNull()` recibió `"online"`. |
| 2 | `DEVICE_ONLINE_THRESHOLD_MS = 2 * 60_000 - 1_000` | `pnpm test -- connectivity` → `connectivity.spec.ts:8`, esperado `120000`, recibido `119000`. |
| 3 | Cruzar `dot` entre `success` y `warning` en `STATUS_TONE_CLASSES` | R8/E2: `bun run test -- pet-hero-header --runInBand --silent` → `pet-hero-header.test.tsx:448`, las filas `success`/`warning` quedaron rojas. |
| 4 | Cruzar `labelKey` de `unknown` y `offline` en `HOME_CONNECTION` | R9: `bun run test -- screens/home --silent` → `index.test.tsx:658`, `:681` y dos filas en `:747`, 4 fallos. |
| 5 | Solo lectura: `git diff --name-only origin/main...HEAD \| grep -c 'map\\.'` | Salida `0`; no se modificaron `map.tsx` ni `map.test.tsx`. |

- La sonda 2 restaurada pasó con `pnpm test -- connectivity` (exit 0, 6
  tests). La sonda 4 restaurada pasó con `bun run test -- screens/home
  --silent` (exit 0, 3 suites).
- Grep-clean sobre `components/pet-hero-header.tsx`, `i18n/catalog.ts`,
  `screens/home/index.tsx`, `screens/pairing/index.tsx` y
  `utils/device-connectivity.ts`: cero hex, clases arbitrarias,
  `StyleSheet.create`, shadow/elevation legacy, `rounded-2xl|lg|md|sm` y
  `text-[11px]`.
- `git diff --name-only origin/main...HEAD`:

```text
backend-pet-tracker/src/modules/devices/domain/connectivity.spec.ts
backend-pet-tracker/src/modules/devices/domain/connectivity.ts
backend-pet-tracker/src/modules/devices/infrastructure/devices.controller.ts
backend-pet-tracker/src/modules/devices/infrastructure/mappers/device-status.mapper.spec.ts
backend-pet-tracker/src/modules/devices/infrastructure/mappers/device-status.mapper.ts
backend-pet-tracker/src/modules/devices/infrastructure/pet-device.controller.ts
backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.spec.ts
backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.ts
backend-pet-tracker/src/pipeline/constants.ts
backend-pet-tracker/src/workers/ingestion-store.ts
backend-pet-tracker/src/workers/ingestion.drizzle.store.ts
backend-pet-tracker/test/device-connectivity.e2e-spec.ts
backend-pet-tracker/test/ingestion.e2e-spec.ts
docs/data-model.md
feature_list.json
mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
mobile-pet-tracker/src/components/pet-hero-header.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/home/index.test.tsx
mobile-pet-tracker/src/screens/home/index.tsx
mobile-pet-tracker/src/screens/pairing/index.test.tsx
mobile-pet-tracker/src/utils/device-connectivity.test.ts
mobile-pet-tracker/src/utils/device-connectivity.ts
progress/current.md
progress/explore_pet-online-pill.md
progress/handoff_pet-online-pill.md
progress/impl_pet-online-pill.md
specs/mobile-ui-language/design.md
specs/pet-online-pill/design.md
specs/pet-online-pill/requirements.md
specs/pet-online-pill/tasks.md
specs/pet-online-pill/traceability.md
specs/wialon-ingestion-pipeline/requirements.md
```

- Verificación final: `./init.sh` exit 0 tras `pgrep` vacío; build, tests,
  e2e, lint y typecheck quedaron verdes. Ninguna suite que ya estaba verde
  quedó roja.

## R11 — smoke humano en dev build Android

No ejecutado por IA. Este guion se ejecuta por un humano en un **dev build de
Android** (nunca Expo Go), con backend local en `SIM_MODE=true`:

1. **Preparación** — `POLLER_ENABLED=true`; tres mascotas del mismo usuario;
   desde Pairing vincular `ACT-001` a la mascota A y `ACT-002` a la mascota B
   (`src/db/seed/simulated-devices.ts:7-9`); esperar ≥ 90 s (un ciclo de poller
   + consumer). Home de A y de B: píldora **"En línea"** (verde, punto verde)
   encima del nombre, y `collar-status` "En línea". Pairing de A: "Conexión: En línea".
2. **Silencio provocado** — parar el backend, `POLLER_ENABLED=false`, arrancar
   (con el poller vivo el simulador refrescaría `last_message_at` en ≤ 75 s y
   el silencio no duraría). En Postgres:
   `UPDATE devices SET last_message_at = now() - interval '10 minutes' WHERE esn = 'SIM-002';`
   Volver a Home (refetch al foco) → B: píldora **"Sin conexión"** (ámbar) y
   `collar-status` "Sin conexión"; A sigue **"En línea"**. Pairing de B:
   "Conexión: Sin conexión". Hacer el `UPDATE` y comprobar "A sigue En línea /
   B Sin conexión" **dentro de los 2 min** siguientes a parar el poller; si A
   ya dice "Sin conexión" al mirar, no es defecto: paso 7 (poller vivo, ≤ 90 s)
   y repetir el paso 2. Tras **2 min** sin poller, A pasa también a "Sin conexión"
   (es el umbral, no un fallo).
3. **Desconocido** — con el poller aún parado, vincular `ACT-003` a la mascota C
   desde Pairing (o `UPDATE devices SET last_message_at = NULL, battery_pct = NULL WHERE esn = 'SIM-003';`
   si ya estaba vinculado). Home de C: píldora **"Esperando señal"** (gris) y
   `collar-status` "Esperando señal"; Pairing de C: "Conexión: —" y "Sin mensajes todavía".
4. **Sin collar** — una mascota sin collar: píldora **"Sin collar"** (gris) y
   `collar-status` "Sin collar"; sin fila de batería.
5. **Mapa (G4 sigue vigente; ya no hay divergencia de umbral)** — con el
   poller parado, el mapa de A dice "Desactualizado" y la Home "Sin conexión"
   a partir de los ~120 s, con un desfase de como mucho un ciclo de sondeo
   (`POLL_MS = 15000` del mapa, `map.tsx:77`; refetch al foco en Home). Son
   dos relojes distintos que ahora comparten número: `staleSeconds` de la
   **posición**, calculado en el servidor y sondeado por el mapa, y
   `connectivity` del **collar**, calculado en el servidor al refetch del
   detalle. Que coincidan en 120 s no los une: `map.tsx:76` no se toca (R10
   sonda 5) y alinear ambos en una sola fuente sigue siendo feature aparte.
6. **Temas y texto** — cambiar a dark: la píldora sigue legible en los cuatro
   estados; todo en español; el selector y la campana siguen en su sitio.
6-bis. **Pulso** — en la mascota en línea el punto verde de la píldora late
   suavemente (2 s por ciclo, nunca el texto); en las de "Sin conexión",
   "Esperando señal" y "Sin collar" el punto está fijo. Activar «Quitar
   animaciones» en Ajustes › Accesibilidad de Android y volver a Home: el punto
   verde queda fijo, opacidad plena, sin salto. Desactivarlo: vuelve a latir.
7. **Restaurar** — `POLLER_ENABLED=true`, reiniciar; en ≤ 90 s A, B y C vuelven
   a "En línea".

| Paso | Resultado humano | Fecha / firma |
|---|---|---|
| 1 |  La prueba funciona correctamente activando el POLLER_ENABLED en las tres mascotas | 2026-09-14 |
| 2 | El silencio provocado funciona correctamente, realice el proceso de silencio y verifique que el punto verde de la píldora no latirá | 2026-09-14 |
| 3 | Funciona correctamente, el status se actualiza correctamente en las tres mascotas | 2026-09-14 |
| 4 |  La prueba funciona correctamente con una mascota sin collar las pildoras muestran el status correcto| 2026-09-14 |
| 5 | El mapa funciona correctamente |  2026-09-14 |
| 6 |  Las pildoras se adaptan correctamente al dark theme el texto se ve legible |  2026-09-14 |
| 6-bis | La animación de pulso funciona correctamente en la mascota en línea |  2026-09-14 |
| 7 | Al activar el POLLER_ENABLED a true funciona correctamente |  2026-09-14 |
