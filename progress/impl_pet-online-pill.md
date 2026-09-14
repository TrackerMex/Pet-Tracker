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

Pendiente.

## R9 — Home monta la píldora desde el mismo estado

Pendiente.

## R10 — candados y verificación final

Pendiente.

## R11 — smoke humano en dev build Android

Pendiente de preparar; no ejecutable por IA.
