---
feature: "pet-online-pill"
status: approved        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[pet-online-pill]]

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Fuente: `feature_list.json` #73 (`description` + los 5 `acceptance_criteria`),
> `progress/explore_pet-online-pill.md` (informe del 2026-09-13, re-verificado
> línea a línea contra este árbol) y las decisiones G1/G2/G4/G5/G6/G7 que el
> leader cerró como **recomendaciones etiquetadas** (§Aprobación: firmar sin
> editar = aceptar los defaults).
>
> Feature **de dos lados**: backend (`backend-pet-tracker/`, suites `pnpm test`
> y `pnpm test:e2e`) y móvil (`mobile-pet-tracker/`, suite `bun run test`).
> Todo lo móvil se rige por `docs/ui-guidelines.md` (carta de UI, gate C8 de
> `CHECKPOINTS.md`). Quien implemente carga `expo:expo-overview` y
> `expo:expo-native-ui` antes de tocar `mobile-pet-tracker/`. **Cero
> dependencias nuevas, cero migraciones, cero env nuevas.**
>
> Las rutas se escriben con su prefijo de paquete (`backend-pet-tracker/…`,
> `mobile-pet-tracker/…`); dentro de un bloque claramente de un solo lado se
> omite el prefijo. Toda cita `ruta:línea` es del commit padre `072cff40`
> (`origin/main`, branch `feature/73-pet-online-pill`).

---

## §0. Verificación de premisas contra el árbol (obligatoria antes de leer los requisitos)

### §0.1 Premisas confirmadas (del informe y del enunciado, releídas en este árbol)

| # | Premisa | Veredicto | Evidencia leída |
|---|---|---|---|
| P1 | El store escribe `connectivity: 'online'` en cada telemetría y nada lo devuelve a otro valor | **cierta** | `backend-pet-tracker/src/workers/ingestion.drizzle.store.ts:97` es el **único** escritor (`grep "'online'"` en `src/` + `test/`: `:97`, el comentario del puerto `src/workers/ingestion-store.ts:45` y la aserción `test/ingestion.e2e-spec.ts:218`; nada más). Claim (`src/modules/devices/infrastructure/repositories/device.drizzle.repository.ts:89-92`) y release (`:107-112`) no tocan la columna |
| P2 | En backend no hay umbral de "en línea"; el móvil tiene `STALE_SECONDS = 120` para la **posición** del mapa | **cierta** | `mobile-pet-tracker/src/app/(tabs)/map.tsx:76`; `specs/positions-api/requirements.md:96-99` (R6, `staleSeconds < 120`); `plans/007-geocercas-alertas-push.md:115` propuso "Scheduler cada 5 min sobre `last_message_at`" |
| P4 | El diseño está en `specs/mobile-figma-polish/design-src/App.tsx` | **cierta** | hero `:334-365`; píldora `:358` (`<Pill green>` con punto `animate-pulse` y "En línea", **encima** del nombre `:359` y de la raza `:360`); componente `Pill` `:71-79`. En Profile el Make pinta `<Pill green>Collar activo</Pill>` (`:672`): es **otro dato** (tener collar), no conectividad |
| P5 | La Home ya pinta "En línea" / "Sin conexión" / "Sin collar" en `collar-status` y **miente** por el pestillo | **cierta** | `mobile-pet-tracker/src/screens/home/index.tsx:454` (`testID="collar-status"`), ternario `:457-461` (`connectivity === 'online'` → `home.online`, cualquier otra cosa → `home.offline`), icono `:445-451`. Test `src/screens/home/index.test.tsx:594-659` (R8), y el `it` de `:640-658` fija `null` → "Sin conexión" |
| P6 | `staleSeconds` se calcula contra el reloj del servidor con `now` inyectado | **cierta** | `backend-pet-tracker/src/modules/positions/domain/stale-seconds.ts:9-11` (satura en 0 si `ts > now`); #9 D5 `specs/positions-api/requirements.md:254-262` |
| P7 | El listado sigue con `device: null` (OD-3 de #66) | **cierta** | `backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.ts:85-87` |
| P9 | "El collar reporta cada 30 s" es supuesto del simulador, no dato de hardware | **cierta** | `backend-pet-tracker/src/integrations/wialon/fake-wialon.client.ts:13-14` (`SIM_STEP_SECONDS = 30`, "constante del fake"); `plans/012-validacion-escalabilidad-costos.md:232` ("30 s es el peor caso; adaptativo cambia TODOS los números"); `docs/brief.md:554` |
| Mapper único | `toDeviceStatusResponse` es passthrough de `connectivity` y lo llaman tres sitios | **cierta** | `backend-pet-tracker/src/modules/devices/infrastructure/mappers/device-status.mapper.ts:24-36` (`:30` passthrough; comentario `:1-6`); llamadores `pets.controller.ts:110` (con `now` en `:97`), `pet-device.controller.ts:43`, `devices.controller.ts:41-43` |
| Cadencias | poller 60 s, consumer 15 s, constantes y no env | **cierta** | `backend-pet-tracker/src/workers/ingestion-scheduler.service.ts:7-10` |
| Estilo de umbrales | constantes nombradas en `src/pipeline/constants.ts`, "cero numeros magicos", sin imports | **cierta** | `backend-pet-tracker/src/pipeline/constants.ts:1-3`; `FUTURE_TS_TOLERANCE_MS = 5 * 60_000` en `:14-16`; `TRIP_MAX_GAP_MINUTES` `:46-48` |
| Hero | `PetHeroHeader` no tiene prop de estado; `highlight` es "dato YA FORMATEADO por el llamante" | **cierta** | `mobile-pet-tracker/src/components/pet-hero-header.tsx:26-38` (props), `:34-35` (`highlight`), caption `:112-154`, columna izquierda `:116-135` (nombre `:119-124`, raza `:125-127`, skeleton `:130-133`), highlight `:137-153`. Home lo monta en `src/screens/home/index.tsx:249-287`; el slot `home-hero-actions` está en `:258`. Profile lo monta sin slot ni highlight (`src/screens/profile/index.tsx:252`) |
| Slot candado | `home-hero-actions` tiene exactamente 2 hijos | **cierta** | `mobile-pet-tracker/src/screens/home/index.test.tsx:152` (`expect(actions.children).toHaveLength(2)`, #78 R10) |
| Caption sin texto con `pet === null` | | **cierta** | `mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx:342-348`; y `:269-282` (nada de texto sobre `pet-hero-media`, `pet-hero-name` dentro de `pet-hero-caption`) |
| Catálogo | `home.free/online/offline`, `deviceConnectivity.online/unknown` | **cierta** | `mobile-pet-tracker/src/i18n/catalog.ts` en `:35-37` / `:342-344`; `:88-89` / `:395-396`. `deviceConnectivity.unknown` vale `Unknown` / **`Desconocida`** |
| Util de Pairing | mapea solo `online`; `null → null` ('—'); otro string → `unknown` | **cierta** | `mobile-pet-tracker/src/utils/device-connectivity.ts:3-8` (`DEVICE_CONNECTIVITY_META`), `:14-23` (`connectivityLabelKey`); test `src/utils/device-connectivity.test.ts:3-19`; Pairing `src/screens/pairing/index.tsx:90-92,424-428`; test `src/screens/pairing/index.test.tsx:104` (`'LTE'`), `:512` ('Desconocida'), `:546` ('—') |
| Candados de copy | | **ciertas, expresiones literales** | `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx:41` `expect(englishKeys).toHaveLength(260 + 16 + 1 + 4 + 7 + 14);` y `:42`; `src/__tests__/ui-language.test.ts:84` `expect(R3_HOME).toHaveLength(21 + 15 + 1 + 4 + 7 + 2);`, `:167` `expect(R10_PAIRING).toHaveLength(42 + 2);`, `:428`, `:437` `expect(SCREEN_FILES).toHaveLength(19 + 2 + 1);`; tabla `src/__tests__/ui-copy-table.ts` `R3_HOME` `:45-96` (filas `home.free/online/offline` `:53-55`), `R10_PAIRING` `:330-375` (filas `deviceConnectivity.*` `:373-374`) |
| Carta | cápsula → `rounded-full`; color nunca único portador; AA calculado; `text-2xs`; sin hex fuera de `src/theme/` | **cierta** | `docs/ui-guidelines.md:134-147` (radios: "**Cápsula** (chip, avatar, píldora de pestaña…) → `rounded-full`"), `:217-218`, `:203`, `:222-225`, `:64`; `src/__tests__/design-drift.test.ts:61-65` (cero clases `[...]` en **todo** `src/`), `:94-100` (cero `text-[10px]`), `:202-226` (hex/StyleSheet en los 11 ficheros de #68, entre ellos `screens/home/index.tsx`, `utils/device-connectivity.ts`, `i18n/catalog.ts`) |
| heroui `Chip` | existe en este worktree | **cierta** | `mobile-pet-tracker/node_modules/heroui-native/lib/module/components/chip/` (`chip.md`, `chip.types.d.ts`: `variant` primary/secondary/tertiary/soft, `color` accent/default/success/warning/danger, `size` sm/md/lg; extiende `PressableProps`). **Nadie lo importa** en `src/`. Ver [[design]] D8 para por qué no se usa |
| Overlap con #91 | ningún fichero de #73 coincide con `src/components/floating-tab-bar.tsx` ni su test | **cierta** | `feature_list.json` #91 `files_affected` |

### §0.2 Premisas corregidas (el implementador no construye sobre la versión anterior)

| # | Premisa (origen) | Corrección | Evidencia |
|---|---|---|---|
| C1 | `files_affected` de #73 cita `mobile-pet-tracker/src/app/(tabs)/home.tsx` | Es el **route delgado** (5 líneas). La Home vive en `mobile-pet-tracker/src/screens/home/index.tsx`; ningún requisito toca el route. `feature_list.json` queda corregido en el mismo commit que deja esta spec en `spec_ready` | `src/app/(tabs)/home.tsx:1-5`; `src/screens/home/index.tsx` (735 líneas) |
| C2 | G7 del leader: "en línea → `success`, desconectado → `warning`" como **tokens de la píldora** | Como **texto**, `success` (`#0F9B5A`) sobre la superficie `success-soft` da **3,04:1** en light — falla AA (4,5:1). Como **punto**, `warning` (`#F59E0B`) sobre `warning-soft` da **1,94:1** en light — falla incluso el 3:1 de componente no textual. Por eso la tinta del texto "en línea" es `accent-strong` (5,12:1) y el punto "desconectado" es `warning-strong` (4,81:1); el punto "en línea" conserva `success` (3,04:1 ≥ 3:1, margen fino, alternativa en §Aprobación). Números completos en [[design]] D7 | tokens en `mobile-pet-tracker/src/theme/global.css:26-45` (light) y `:74-93` (dark); `*-soft` = `color-mix(in oklab, var(--X) 15%, transparent)` (`node_modules/heroui-native/src/styles/theme.css:91,95`), compuesto sobre `bg-background` de la banda (`pet-hero-header.tsx:114`); método idéntico al de `src/theme/__tests__/global-css.test.ts:331-420` |
| C3 | G5 del leader: "reúsa `deviceConnectivity.unknown` para 'desconocido' si el texto vale para la Home" | **No vale**: `Desconocida` es femenino porque concuerda con la fila "Conexión" de Pairing; sola, junto al nombre de la mascota, se lee como atributo de la mascota. Clave nueva `home.unknown` (delta +1) | `catalog.ts:396`; `src/screens/pairing/index.tsx:424-428` |
| C4 | G7 del leader: tinta "en línea" `success` no mueve candados | Al usar `text-accent-strong` en `components/pet-hero-header.tsx` **se mueve** `src/__tests__/legibility-classnames.test.ts:118-134` (lista `inkSites` + total `13 + 1`). Delta declarado en §Candados | `legibility-classnames.test.ts:117-135` |
| C5 | Informe §7: `checkUses` "cuenta claves" | Cuenta **solo** dos formas por fichero: `t('clave')` y `labelKey: 'clave'` (`ui-language.test.ts:49-55`). Un `Record` que no use la forma `labelKey:` deja la fila en 0 y pone rojo. Esto fija la forma del mapa de estado de la Home (R7) | `src/__tests__/ui-language.test.ts:38-63` |
| C6 | Carta §Idioma: "toda spec que introduzca copy nueva … la registra en la tabla de `specs/mobile-ui-language/design.md` §2" — parecía prosa | Es **test**: cada feature que añade claves asevera su fila con regex `\| — \| \`clave\`[^\n]*← añadida por #NN (Rn)` (`ui-language.test.ts:104-125` para #70, `:207-220` para #78). R5 hace lo mismo para #73 | `specs/mobile-ui-language/design.md:288-290` (filas `home.*`), `:682-683` (filas `deviceConnectivity.*`) |
| C7 | Informe §5 opción A: "`pets.controller.spec.ts:216-235`" | El `it` es `:212-234`; la aserción que cambia es `:230` (`connectivity: null` con `lastMessageAt` de 2026-08-01). Las demás citas de línea del informe cuadran con desviaciones ≤ 4 líneas y se han reescrito aquí con la línea exacta | `src/modules/pets/infrastructure/pets.controller.spec.ts:211-244` |
| C8 | Informe §10: `pet-device.controller.ts` y `devices.controller.ts` tienen spec unitario que hay que reescribir | **No existe** ningún `*.spec.ts` en `src/modules/devices/infrastructure/` salvo `mappers/device-status.mapper.spec.ts`. Esos dos llamadores se cubren por e2e (R3) y por los candados de claves de `test/devices.e2e-spec.ts:274-280,312-320` y `test/device-subscriptions.e2e-spec.ts:354-356` | `ls src/modules/devices/infrastructure/` |

### §0.3 Hechos que la spec necesita y que el informe no cubría

- **Precedente de píldora ya en el repo**: `mobile-pet-tracker/src/screens/reminders/index.tsx:296-300` pinta un badge `rounded-full bg-warning-soft px-2 py-0.5 text-2xs font-bold text-warning-strong`. La receta de R8 nace de ahí, no de cero.
- **`elementChild(node, index)`** existe en `mobile-pet-tracker/src/screens/alerts/index.test.tsx:94-101`; los tests de orden (R8, R9) lo copian tal cual si el fichero de test no lo tiene.
- **Reloj inyectable**: `pets.controller.ts:97` ya crea `const now = new Date()` y lo pasa al use case (`:101-104`) y al mapper de perfil (`:106-109`); el mapper de device es el único que aún no lo recibe.
- **Suites**: backend unit `pnpm test` (`rootDir: src`, `*.spec.ts`; `package.json:82-100`), backend e2e `pnpm test:e2e` (`test/jest-e2e.json`, `*.e2e-spec.ts`, Postgres + LocalStack reales); móvil `bun run test` desde `mobile-pet-tracker/` (`package.json:64`). Codex corre **la suite del lado que toca** en cada commit; `./init.sh` desde la raíz corre todo.
- **Semilla del simulador**: `backend-pet-tracker/src/db/seed/simulated-devices.ts:7-9` — `SIM-001`/`ACT-001`/`900001`, `SIM-002`/`ACT-002`/`900002`, `SIM-003`/`ACT-003`/`900003`. Con `SIM_MODE=true` (`.env.example:57-60`) todo collar vinculado reporta siempre; `POLLER_ENABLED` (`.env.example:70`) abre y cierra el poller. Lo usa el smoke (R11).

---

## Decisiones cerradas (defaults del leader; el humano ratifica o cambia en §Aprobación)

| Id | Decisión | Detalle en |
|---|---|---|
| **G1** | **A2**: el backend deriva `connectivity` **en lectura** de `devices.last_message_at` contra el reloj del servidor; el write `'online'` de `ingestion.drizzle.store.ts:97` **se borra**; la columna queda siempre NULL y se declara obsoleta (su borrado por migración es feature aparte) | [[design]] D1, D2 |
| **G2** | Umbral **300 s** (`DEVICE_ONLINE_THRESHOLD_MS = 5 * 60_000` en `src/pipeline/constants.ts`), límite **inclusivo** (`now − lastMessageAt ≤ umbral` ⇒ online), `ts > now` ⇒ online | [[design]] D3 |
| **G4** | El mapa **no se toca**: "Desactualizado" (120 s) mide frescura de la **posición**; la píldora mide conectividad del **collar**. Divergencia declarada | [[design]] D4 |
| **G5** | Cuatro estados en móvil decididos por **un solo helper**: `none` (sin collar) / `unknown` (vinculado, nunca reportó) / `offline` / `online`. Copy: `home.free` / **`home.unknown`** (nueva) / `home.offline` / `home.online`; Pairing gana **`deviceConnectivity.offline`** (nueva) | [[design]] D5 |
| **G6** | La píldora entra por **prop nueva `status`** de `PetHeroHeader`, formateada por el llamante como `highlight`; se pinta en `pet-hero-caption`, columna izquierda, **encima del nombre**; nunca en el slot; Profile **no** la pasa | [[design]] D6 |
| **G7** | Cápsula `rounded-full`, punto + texto, `text-2xs font-semibold`, tokens por tono (tabla en R8), `testID` `pet-hero-status` / `-dot` / `-text`, `accessibilityLabel` = texto, **sin animación**, `View`+`Text` dentro de `pet-hero-header.tsx` (ni `Chip` ni fichero nuevo) | [[design]] D7, D8 |

---

## Requisitos funcionales

### Bloque A — backend: el estado deja de ser un pestillo

#### R1 — umbral nombrado y derivación pura

**WHEN** el backend necesite decidir si un collar está en línea
**THE SYSTEM SHALL** hacerlo con una función pura
`deriveConnectivity(lastMessageAt: Date | null, now: Date): 'online' | 'offline' | null`
en **`backend-pet-tracker/src/modules/devices/domain/connectivity.ts`** (fichero
nuevo; exporta también el tipo `DerivedConnectivity = 'online' | 'offline' | null`),
que:

- (a) devuelve `null` cuando `lastMessageAt === null` (collar que nunca reportó);
- (b) devuelve `'online'` cuando `now.getTime() − lastMessageAt.getTime() ≤ DEVICE_ONLINE_THRESHOLD_MS`
  (límite **inclusivo**: el instante igual al umbral aún respeta la tolerancia);
- (c) devuelve `'offline'` en caso contrario;
- (d) con `lastMessageAt > now` (reloj del collar adelantado; el pipeline lo
  admite hasta `FUTURE_TS_TOLERANCE_MS`, `src/pipeline/validate-positions.ts:43`)
  la diferencia es negativa y cae en (b): `'online'`, nunca `'offline'` —
  misma saturación que `stale-seconds.ts:9-11`;

**AND** el umbral SHALL ser la constante nombrada
**`DEVICE_ONLINE_THRESHOLD_MS = 5 * 60_000`** en
`backend-pet-tracker/src/pipeline/constants.ts`, añadida justo después de
`FUTURE_TS_TOLERANCE_MS` (`:16`), en el estilo del fichero (ASCII, sin tildes,
docblock `/** … */`), con este comentario **literal**:

```ts
/** Silencio maximo (ms) para que un collar siga 'online' en lectura (#73 G2).
 * Formula: cadencia supuesta del collar 30 s (SIM_STEP_SECONDS del simulador,
 * no dato de hardware) + poller 60 s + consumer 15 s = 105 s de latencia peor
 * caso en regimen; 300 s ~= 4 ciclos de poller de margen sobre el retardo de
 * Wialon, coincide con plans/007 §Notas (device_offline cada 5 min) y es
 * simetrico con FUTURE_TS_TOLERANCE_MS. Si la cadencia pasa a adaptativa
 * (plans/012 §Maintenance notes, docs/brief.md §13) este valor se revisa. */
export const DEVICE_ONLINE_THRESHOLD_MS = 5 * 60_000;
```

`connectivity.ts` importa la constante con `import { DEVICE_ONLINE_THRESHOLD_MS } from '@/pipeline/constants';`
— `src/pipeline/` es núcleo puro sin imports (`constants.ts:3`,
`docs/architecture.md:104`), así que `domain` no rompe la regla de dependencia
(`docs/architecture.md:13-22`). Cabecera del fichero, en el estilo de
`stale-seconds.ts:1`: `// Nucleo puro: aritmetica sin imports de framework, SDK ni ORM.`

**Test**: `backend-pet-tracker/src/modules/devices/domain/connectivity.spec.ts`
(fichero nuevo; precedente de forma: `src/modules/positions/domain/stale-seconds.spec.ts`).
`describe('#73 R1: deriveConnectivity decide online/offline contra el reloj del servidor con DEVICE_ONLINE_THRESHOLD_MS')`,
reloj fijo `const now = new Date('2026-09-13T12:00:00.000Z')`, y estos `it`:

1. `'el umbral vale exactamente 300 s (5 min), decision G2 de la spec'` →
   `expect(DEVICE_ONLINE_THRESHOLD_MS).toBe(300_000)`.
2. `'un lastMessageAt de hace umbral - 1 s es online'` →
   `deriveConnectivity(new Date(now.getTime() - DEVICE_ONLINE_THRESHOLD_MS + 1_000), now)` → `'online'`.
3. `'un lastMessageAt de hace umbral + 1 s es offline'` → `'offline'`.
4. `'un lastMessageAt de hace exactamente el umbral sigue online (limite inclusivo)'` → `'online'`.
5. `'un lastMessageAt posterior a now (collar adelantado) es online, nunca offline'` →
   `new Date(now.getTime() + 5_000)` → `'online'`.
6. `'sin lastMessageAt (nunca reporto) devuelve null'` → `null`.

Los `it` 2-5 usan el **símbolo**, no el número: cambiar el umbral solo pone rojo
el `it` 1. **Mutación que lo pone rojo**: `DEVICE_ONLINE_THRESHOLD_MS = 5 * 60_000 - 1_000`
→ rojo `it` 1; cambiar `<=` por `<` en (b) → rojo `it` 4; quitar la rama `null` → rojo `it` 6.

#### R2 — el contrato de device deriva `connectivity` en lectura (enmienda semántica declarada)

**WHEN** cualquiera de las tres rutas que sirven el estado de device
(`POST /v1/devices/claim` 201, `GET /v1/pets/:petId/device`, clave `device` de
`GET /v1/pets/:petId`) serialice un collar
**THE SYSTEM SHALL** escribir en la clave `connectivity` el valor de
`deriveConnectivity(source.lastMessageAt, now)` y **no** el valor de la columna:

- `toDeviceStatusResponse` (`src/modules/devices/infrastructure/mappers/device-status.mapper.ts:24-36`)
  pasa a `toDeviceStatusResponse(source: DeviceStatusSource, now: Date): DeviceStatusResponse`;
  `:30` (`connectivity: source.connectivity`) se sustituye por
  `connectivity: deriveConnectivity(source.lastMessageAt, now)`.
- `DeviceStatusSource` (`:7-13`) **pierde** la propiedad `connectivity` — nadie
  puede volver a hacer passthrough sin un error TS2339. `DeviceStatusResponse`
  (`:15-21`) conserva sus **5 claves** con la misma forma (`connectivity: string | null`;
  se puede estrechar a `DerivedConnectivity`, opcional). `ActivePetDeviceStatus`
  (`src/modules/pets/domain/ports/pet-device-reader.ts:7-13`), el reader
  (`pet-device.drizzle.reader.ts:35-41`) y la entidad `Device`
  (`device.entity.ts:20,41,58`) **no cambian**: siguen leyendo la columna
  obsoleta, y el paso estructural de un objeto con propiedades de más es válido
  en TypeScript.
- El comentario de cabecera `:1-6` se reescribe: *"Contrato unico de estado de
  device (R3, R11, R12 de devices-claim; #73 R2): lo devuelven el 201 del claim,
  GET /v1/pets/:petId/device y la clave `device` del perfil. `connectivity` NO es
  passthrough de la columna: se deriva en lectura de `lastMessageAt` contra `now`
  con `deriveConnectivity` (#73 G1/G2)."*
- Los tres llamadores pasan `now`: `pets.controller.ts:110` →
  `toDeviceStatusResponse(device, now)` con el `now` de `:97`;
  `pet-device.controller.ts:43` → `toDeviceStatusResponse(device, new Date())`;
  `devices.controller.ts:41-43` → `toDeviceStatusResponse(await this.claimDevice.execute(dto, user.id), new Date())`.

**Enmienda semántica**: `specs/devices-claim/requirements.md:153` (R11) sigue
siendo literalmente cierta ("`connectivity` … `null` hasta que #8 los alimente")
porque un collar recién reclamado no tiene `lastMessageAt`; lo que cambia es que
el valor ya no viene de la columna. Se anota en [[design]] D2, sin editar esa spec.

**Test** (dos ficheros existentes, reescritos):

- `src/modules/devices/infrastructure/mappers/device-status.mapper.spec.ts` —
  el `describe` de `:3` pasa a
  `describe('#73 R2 (R11 de devices-claim): el estado de device deriva connectivity de lastMessageAt contra now y conserva las 5 claves')`
  con `const now = new Date('2026-09-13T12:00:00.000Z')` y estos `it`:
  1. `'un lastMessageAt reciente sale como online, serializado a ISO, con las 5 claves exactas'`
     — fuente `{ model: 'sim-collar', batteryPct: 87, lastMessageAt: new Date(now.getTime() - 30_000), esn: 'SIM-001' }`
     → `toEqual({ model, batteryPct: 87, connectivity: 'online', lastMessageAt: '2026-09-13T11:59:30.000Z', esn })`
     y `Object.keys(response).sort()` igual a `['model','batteryPct','connectivity','lastMessageAt','esn'].sort()`
     (misma aserción que hoy en `:20-22`).
  2. `'un lastMessageAt mas viejo que el umbral sale como offline'` —
     `now − (DEVICE_ONLINE_THRESHOLD_MS + 1_000)` → `response.connectivity === 'offline'`.
  3. `'telemetria sin alimentar viaja como null: batteryPct, connectivity y lastMessageAt'` —
     hereda el `it` de `:25-37` sin la propiedad `connectivity` en la fuente.
- `src/modules/pets/infrastructure/pets.controller.spec.ts` — en el `describe` de
  `:211` (título ampliado a
  `'R12 (devices-claim) + #73 R2: el detalle serializa la clave device del use case con connectivity derivada'`):
  el `it` de `:212-234` se retitula
  `'deriva connectivity del lastMessageAt del use case: uno de 2026-08-01 sale offline'`
  y su `toEqual` de `:227-233` espera `connectivity: 'offline'`; se añade
  `it('un lastMessageAt de ahora mismo sale online')` con `lastMessageAt: new Date()`
  (el `now` del controller nace milisegundos después: diferencia ≪ umbral, determinista)
  → `response.device?.connectivity === 'online'`; y
  `it('un collar que nunca reporto sale con connectivity null')` con `lastMessageAt: null`.
  El `it` de `:236-242` ("sin collar activo … null") no cambia.

**Mutación que lo pone rojo**: restaurar `connectivity: source.connectivity` en el
mapper → error TS2339 en `pnpm build` **y** rojo del `it` 2 de mapper.spec (la
fuente no aporta `connectivity`, saldría `undefined`).

#### R3 — e2e contra Postgres real: los tres estados salen por la API sin dormir

**WHEN** una mascota tiene collar activo y `devices.last_message_at` vale
`NULL`, un instante más viejo que el umbral, o un instante reciente
**THE SYSTEM SHALL** responder en `GET /v1/pets/:petId` (`body.device.connectivity`)
y en `GET /v1/pets/:petId/device` (`body.connectivity`) con `null`, `'offline'`
y `'online'` respectivamente, conservando las 5 claves del contrato.

**Test**: **`backend-pet-tracker/test/device-connectivity.e2e-spec.ts`** (fichero
nuevo), `describe('Device connectivity derived at read (e2e)')` →
`describe('#73 R3: GET /v1/pets/:petId y GET /v1/pets/:petId/device derivan connectivity de devices.last_message_at')`.
Arnés copiado de `test/positions.e2e-spec.ts:44-130`: `seedUser` (fila directa
en `users` + `tokenService.sign`), `createPet` vía `POST /v1/pets`, inserción
directa en `devices` (`esn: \`CONN-${deviceId}\``, `status: 'assigned'`,
`isSimulated: true`) y en `petDevices` (`releasedAt` nulo); **sin**
`deviceSubscriptions` (las dos rutas van tras `PetAccessGuard`, no tras
`PetTrackingGuard`). Limpieza en `afterAll` como `positions.e2e-spec.ts`
(`auditLog` por `userId`, `pets` en cascada, `devices`, `users`). El truco de
sembrar en Postgres y leer sin dormir es el de `test/positions.e2e-spec.ts:289-323`.
Importa `DEVICE_ONLINE_THRESHOLD_MS` de `@/pipeline/constants` (como
`positions.e2e-spec.ts:25` importa `FLAG_*`).

1. `it('collar vinculado que nunca reporto: connectivity null en el detalle y en /device')`
   — sin `UPDATE`; ambas rutas `200`, `connectivity === null`,
   `Object.keys(body.device).sort()` = las 5 claves.
2. `it('last_message_at mas viejo que el umbral: offline en ambas rutas')` —
   `db.update(devices).set({ lastMessageAt: new Date(Date.now() - DEVICE_ONLINE_THRESHOLD_MS - 60_000) }).where(eq(devices.id, deviceId))`
   → `'offline'` en ambas.
3. `it('last_message_at reciente: online en ambas rutas')` —
   `new Date(Date.now() - 10_000)` → `'online'` en ambas.

**Orden (C4 vía (a))**: este test se commitea en **rojo antes** de la
implementación de R2 (con el passthrough y la columna NULL, 2 y 3 fallan) y el
commit `feat` de R2 lo pone verde junto con los unitarios: ver [[tasks]] §R2/§R3.
**Mutación que lo pone rojo**: quitar `now` del llamador de
`pet-device.controller.ts` (p. ej. pasar `new Date(0)`) → rojo 3.

#### R4 — el pestillo desaparece: nadie escribe `devices.connectivity`

**WHEN** el consumidor procese telemetría de un collar
**THE SYSTEM SHALL** actualizar `devices` con `battery_pct`, `last_message_at` y
`updated_at` **únicamente**: la línea `connectivity: 'online',` de
`src/workers/ingestion.drizzle.store.ts:97` se **borra** y no se sustituye por
ningún otro escritor. El docblock del puerto `src/workers/ingestion-store.ts:44-48`
pasa a decir *"Actualiza devices (battery_pct, last_message_at) solo si
lastMessageAt es mas reciente que el cacheado — el WHERE vive en la
implementacion (R14). `connectivity` no se escribe desde #73: se deriva en
lectura (`modules/devices/domain/connectivity.ts`)."*

**AND** la columna SHALL declararse obsoleta en `docs/data-model.md:53` (fila
`devices`, añadir a Notas): *"`connectivity` está **obsoleta desde #73**: ningún
escritor la alimenta (queda NULL); el `'online' | 'offline' | null` que sirve la
API se deriva en lectura de `last_message_at` contra el reloj del servidor con
`DEVICE_ONLINE_THRESHOLD_MS` (`src/pipeline/constants.ts`). Su borrado por
migración es feature aparte."*

**AND** `specs/wialon-ingestion-pipeline/requirements.md` SHALL recibir al final
un bloque de enmienda con el formato canónico del repo
(`specs/mobile-pet-hero-header/design.md:539-563`), **sin marcar** la firma:

```markdown
## Enmienda #73 — la conectividad se deriva en lectura

`pet-online-pill` (#73) modifica una decisión que esta spec dejó aprobada. La
spec de origen es `specs/pet-online-pill/`; el detalle de la enmienda está en su
`requirements.md` §R4.

- Spec enmendada: `wialon-ingestion-pipeline`
- Qué cambia: R14 deja de escribir `connectivity = 'online'` (el store solo
  actualiza `battery_pct` y `last_message_at`); la línea de §Fuera de alcance
  "`connectivity = 'offline'` / detección de silencio: nadie la marca" queda
  cerrada por #73 con derivación en lectura, no con una marca en escritura.
- Qué NO cambia: ningún otro requisito de esta spec, ni su estado de
  aprobación, ni los tests que ya la cubren salvo la aserción declarada de
  `test/ingestion.e2e-spec.ts:218`.

- [X] Enmienda aprobada por humano
```

**Test**: `backend-pet-tracker/test/ingestion.e2e-spec.ts:218` — dentro de
`describe('R19: claim ACT-001 + SIM_MODE=true + runOnce() + drainOnce() => …')`
(`:165`), `it('recorre la cadena completa y deja el estado esperado')` (`:166`):
`expect(deviceRow.connectivity).toBe('online');` → **`expect(deviceRow.connectivity).toBeNull(); // #73 R4: nadie escribe la columna`**.
El resto de aserciones de `:219-222` (`batteryPct`, `lastMessageAt`,
`ingestWatermark`) **no** cambian. **Delta declarado** en §Candados.
**Mutación que lo pone rojo**: restaurar la línea `connectivity: 'online',` en
`ingestion.drizzle.store.ts` → rojo este `it` (sonda obligatoria, evidencia en
`progress/impl_pet-online-pill.md` §R4).

### Bloque B — móvil: cuatro estados y la píldora del hero

#### R5 — catálogo: dos claves nuevas en los dos idiomas, registradas

**WHEN** se cargue el catálogo
**THE SYSTEM SHALL** contener, en `en` **y** en `es`, exactamente estas dos
claves nuevas y ninguna otra de esta feature:

| Clave | `en` | `es` | Dónde (`mobile-pet-tracker/src/i18n/catalog.ts`) |
|---|---|---|---|
| `home.unknown` | `Awaiting signal` | `Esperando señal` | tras `'home.offline'` (`:37` en `en`, `:344` en `es`) |
| `deviceConnectivity.offline` | `Offline` | `Sin conexión` | tras `'deviceConnectivity.online'` (`:88` en `en`, `:395` en `es`) |

**AND** las dos filas SHALL quedar registradas en
`specs/mobile-ui-language/design.md` con el formato que el test lee: tras la
fila `home.offline` (`:290`) →
`| — | \`home.unknown\` | \`Awaiting signal\` | \`Esperando señal\` | ← añadida por #73 (R5)`;
tras la fila `deviceConnectivity.unknown` (`:683`) →
`| — | \`deviceConnectivity.offline\` | \`Offline\` | \`Sin conexión\` | ← añadida por #73 (R5)`.

**Test**: `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`:
- `:41` pasa de `toHaveLength(260 + 16 + 1 + 4 + 7 + 14)` a
  **`toHaveLength(260 + 16 + 1 + 4 + 7 + 14 + 2)`** (suma visible, sumando de #73
  al final; comentario `:36` gana "+ 2 de #73"). `:42` (`spanishKeys` igual a
  `englishKeys`) no cambia.
- `it('#73 R5: el catalogo trae home.unknown y deviceConnectivity.offline en los dos idiomas y registrados en la tabla')`
  — `en['home.unknown'] === 'Awaiting signal'`, `es['home.unknown'] === 'Esperando señal'`,
  `en['deviceConnectivity.offline'] === 'Offline'`, `es['deviceConnectivity.offline'] === 'Sin conexión'`,
  y para cada clave `readFileSync('../specs/mobile-ui-language/design.md')`
  hace match con `new RegExp('\\| — \\| `' + escapeRegExp(key) + '`[^\\n]*← añadida por #73 \\(R5\\)')`
  (copiar el patrón de `src/__tests__/ui-language.test.ts:104-125`).

**Mutación que lo pone rojo**: quitar la fila `es` de `home.unknown` → rojo `:42`
y el `it` nuevo; quitar la fila de la tabla → rojo el `it` nuevo.

#### R6 — un solo helper decide el estado; Pairing deja de pintar "Desconocida" a un collar desconectado

**WHEN** una pantalla necesite el estado de conexión de una mascota
**THE SYSTEM SHALL** obtenerlo de **`deviceConnectionState(device: DeviceStatus | null): DeviceConnectionState`**
en `mobile-pet-tracker/src/utils/device-connectivity.ts`, con
`export type DeviceConnectionState = 'none' | 'unknown' | 'offline' | 'online'`:
`device === null` → `'none'`; `device.connectivity === 'online'` → `'online'`;
`=== 'offline'` → `'offline'`; cualquier otro valor (incluido `null` y un string
de proveedor) → `'unknown'`. (`import type { DeviceStatus } from '../api/types'`;
`DeviceStatus.connectivity` **sigue** `string | null`, `src/api/types.ts:47` —
no se estrecha: las fixtures `'LTE'` de Pairing seguirían sin compilar.)

**AND** `DEVICE_CONNECTIVITY_META` (`:3-8`) SHALL ganar la fila
`offline: { labelKey: 'deviceConnectivity.offline' }`, de modo que Pairing
(`src/screens/pairing/index.tsx:424-428`, sin cambios de código) pinte
"Sin conexión" para `'offline'`; `null → null` ('—') y string desconocido →
`deviceConnectivity.unknown` se conservan.

**Test**:
- `mobile-pet-tracker/src/utils/device-connectivity.test.ts`, nuevo
  `describe('#73 R6: el estado de conexion se decide en un solo sitio')`:
  `it('resuelve offline por catalogo para Pairing')` → `connectivityLabelKey('offline') === 'deviceConnectivity.offline'`;
  `it('sin collar es none')`; `it('collar con connectivity null es unknown, no offline')`;
  `it('online y offline se respetan')`; `it('un valor de proveedor desconocido cae en unknown')`
  (`{ …, connectivity: 'LTE' }` → `'unknown'`). El `describe` R16 de `:3-19` no cambia.
- `mobile-pet-tracker/src/screens/pairing/index.test.tsx`: en el `describe` de
  las filas de device (el de `:505`), `it('#73 R6: pinta Sin conexion para un collar desconectado')`
  con `makeDevice({ connectivity: 'offline' })` → `device-connectivity` con texto
  `'Sin conexión'`. Los `it` de `:505-520` (`'LTE'` → 'Desconocida') y `:526-550`
  (`null` → '—') **no** cambian.
- Candados: `src/__tests__/ui-copy-table.ts` gana tras `:374` la fila
  `{ file: 'src/utils/device-connectivity.ts', key: 'deviceConnectivity.offline' }`;
  `src/__tests__/ui-language.test.ts:167` pasa a **`toHaveLength(42 + 2 + 1)`**.

**Mutación que lo pone rojo**: devolver `'offline'` para `connectivity: null` →
rojo `'collar con connectivity null es unknown'`; quitar la fila `offline` de
META → rojo el `it` de Pairing y la fila de `checkUses`.

#### R7 — `collar-status` distingue "desconocido" de "desconectado"

**WHEN** la Home pinte la tarjeta del collar
**THE SYSTEM SHALL** derivar `const connection = deviceConnectionState(detail.data.pet.device)`
(R6) una sola vez y resolver texto, tono e icono por un **único** mapa
declarado en `src/screens/home/index.tsx` (fuera del componente, junto a
`QUICK_ACTIONS`), **con la forma `labelKey:`** que `checkUses` cuenta (§0.2 C5):

```ts
const HOME_CONNECTION: Record<
  DeviceConnectionState,
  { labelKey: TranslationKey; tone: PetHeroStatusTone }
> = {
  none: { labelKey: 'home.free', tone: 'muted' },
  unknown: { labelKey: 'home.unknown', tone: 'muted' },
  offline: { labelKey: 'home.offline', tone: 'warning' },
  online: { labelKey: 'home.online', tone: 'success' },
};
```

(`import type { TranslationKey } from '../../i18n/catalog'`; `PetHeroStatusTone`
lo exporta el hero en R8 — hasta ese commit se declara localmente
`type PetHeroStatusTone = 'success' | 'warning' | 'muted'` y en R9 se cambia
por el import.) El ternario de `:457-461` pasa a
`t(HOME_CONNECTION[connection].labelKey)`; el icono de `:445-451` se decide por
`connection`: `'none'` → `Moon`, `'online'` → `Wifi`, `'unknown'` y `'offline'` →
`WifiOff` (sin icono nuevo). La batería (`:463-…`), `last-position-card` y todo
lo demás no cambian.

**Test**: `mobile-pet-tracker/src/screens/home/index.test.tsx`, `describe` R8 de
`:594`:
- el `it` de `:640-658` se retitula
  `'#73 R7: treats a never-reported collar as unknown (Esperando señal), not offline'`
  y espera `collar-status` con `'Esperando señal'` (la batería sigue `'—'`).
  **Delta de semántica declarado**.
- nuevo `it('#73 R7: shows an offline collar as Sin conexión with its battery')`
  con `connectivity: 'offline', batteryPct: 12` → `'Sin conexión'` y `'12%'`.
- `:607-617` ('Sin collar') y `:619-638` ('En línea') **no** cambian.
- Candados: `src/__tests__/ui-copy-table.ts` gana tras `:55` la fila
  `{ file: 'src/screens/home/index.tsx', key: 'home.unknown' }`;
  `src/__tests__/ui-language.test.ts:84` pasa a
  **`toHaveLength(21 + 15 + 1 + 4 + 7 + 2 + 1)`** (comentario `:81-83` gana
  "#73 añade `home.unknown`"). Las filas `home.free/online/offline` de `:53-55`
  siguen contando 1 cada una porque el mapa las escribe una vez como `labelKey:`.

**Mutación que lo pone rojo**: cruzar `labelKey` de `unknown` y `offline` en
`HOME_CONNECTION` → rojo los dos `it` de R7 (y los de R9).

#### R8 — el hero gana la píldora de estado (elemento con todas sus decisiones candadas)

**WHEN** `PetHeroHeader` reciba `pet !== null` **y** la prop nueva
`status?: PetHeroStatus` (`export interface PetHeroStatus { label: string; tone: PetHeroStatusTone }`,
`export type PetHeroStatusTone = 'success' | 'warning' | 'muted'`; docblock:
*"Estado YA FORMATEADO por el llamante, misma regla que `highlight` (R7 de #67)"*)
**THE SYSTEM SHALL** pintar en `pet-hero-caption`, **columna izquierda, como
primer hijo antes de `pet-hero-name`** (Make `App.tsx:358-360`), este elemento
y nada más:

| # | Decisión | Valor candado |
|---|---|---|
| 1 | Contenedor | `<View testID="pet-hero-status" accessible accessibilityLabel={status.label} className={\`flex-row items-center gap-1 self-start rounded-full px-2.5 py-0.5 ${tone.surface}\`}>` |
| 2 | Hijo 0 (punto) | `<View testID="pet-hero-status-dot" className={\`size-1.5 rounded-full ${tone.dot}\`} />` |
| 3 | Hijo 1 (texto) | `<Text testID="pet-hero-status-text" className={\`text-2xs font-semibold ${tone.text}\`}>{status.label}</Text>` |
| 4 | Cardinalidad | `pet-hero-status` tiene **exactamente 2 hijos**, en ese orden (punto → texto) |
| 5 | Tokens por tono (`STATUS_TONE_CLASSES`, constante del fichero) | `success: { surface: 'bg-success-soft', dot: 'bg-success', text: 'text-accent-strong' }`; `warning: { surface: 'bg-warning-soft', dot: 'bg-warning-strong', text: 'text-warning-strong' }`; `muted: { surface: 'bg-default', dot: 'bg-muted', text: 'text-muted' }` |
| 6 | Nombre accesible | `accessibilityLabel === status.label`, `accessible === true` (un solo nodo para el lector) |
| 7 | Tamaño de fuente | `text-2xs` (10 px, token `:15` de `global.css`); **nunca** `text-[11px]` |
| 8 | Radio | `rounded-full` (cápsula, carta `:141-142`); **nunca** `rounded-xl` |
| 9 | Animación | **ninguna**: el fuente no contiene `animate-pulse` ni importa `react-native-reanimated` |
| 10 | Componente | `View` + `Text` de `react-native` **dentro de `pet-hero-header.tsx`**; el fuente **no** importa `Chip` de heroui y **no** nace fichero nuevo en `src/components/` |
| 11 | Condición de render | solo con `pet !== null && status`; con `pet === null` **no** se pinta aunque llegue `status` (la banda sigue sin texto, `:342-348`); sin `status` (Profile) **no** se pinta |
| 12 | Sitio | dentro de `pet-hero-caption`; **nunca** dentro de `pet-hero-slot` ni sobre `pet-hero-media` |
| 13 | Skeleton | **no** se añade línea de skeleton para la píldora: el hero no sabe si el llamante pasará `status` (Profile no lo hace) y una cápsula fantasma en Profile sería peor que 20 px de reflow en Home (`ponytail:` techo asumido; ver [[design]] D6) |

AA en los dos temas sobre la banda `bg-background` (números en [[design]] D7):
texto ≥ 4,5:1 y punto ≥ 3:1 en cada tono.

**Test**: `mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx`,
nuevo `describe('#73 R8: la pildora de estado vive en la banda inferior, encima del nombre, con todas sus decisiones candadas')`
(`renderHero` de `:107-109`; copiar `elementChild` de
`src/screens/alerts/index.test.tsx:94-101`):

1. `it('pinta la pildora con sus dos hijos en orden punto -> texto y el texto formateado por el llamante')`
   — `status={{ label: 'En línea', tone: 'success' }}`; `pill = getByTestId('pet-hero-status')`;
   `expect(pill.children).toHaveLength(2)`;
   `elementChild(pill, 0).props.testID === 'pet-hero-status-dot'`;
   `elementChild(pill, 1).props.testID === 'pet-hero-status-text'`;
   `within(pill).getByTestId('pet-hero-status-text')` con texto `'En línea'`.
2. `it.each([['success','bg-success-soft','bg-success','text-accent-strong'],['warning','bg-warning-soft','bg-warning-strong','text-warning-strong'],['muted','bg-default','bg-muted','text-muted']])('%s: superficie, punto y tinta usan los tokens del tono')`
   — `pill.props.className` contiene la superficie; `dot.props.className` contiene
   el punto; `text.props.className` contiene la tinta. **Criterio literal**:
   cruzar el token del punto entre `success` y `warning` en `STATUS_TONE_CLASSES`
   pone rojo este `it.each` (dos filas).
3. `it('es una capsula rounded-full de text-2xs font-semibold, self-start, sin animacion ni Chip')`
   — `pill.props.className` contiene `'flex-row items-center gap-1 self-start rounded-full px-2.5 py-0.5'`;
   `dot.props.className` contiene `'size-1.5 rounded-full'`; `text.props.className`
   contiene `'text-2xs font-semibold'`; `readSource('components','pet-hero-header.tsx')`
   `not.toContain('animate-pulse')`, `not.toContain('react-native-reanimated')`,
   `not.toMatch(/\bChip\b/)`.
4. `it('es un solo nodo accesible con el texto del estado como nombre')` —
   `pill.props.accessible === true`, `pill.props.accessibilityLabel === 'En línea'`.
5. `it('va dentro de la banda inferior y antes del nombre, nunca en el slot ni sobre la foto')`
   — con slot (`<Text testID="slot-child">`): `caption = getByTestId('pet-hero-caption')`;
   `left = elementChild(caption, 0)`; `elementChild(left, 0).props.testID === 'pet-hero-status'`;
   `elementChild(left, 1).props.testID === 'pet-hero-name'`;
   `within(getByTestId('pet-hero-slot')).queryByTestId('pet-hero-status')` es `null`;
   `within(getByTestId('pet-hero-media')).queryByTestId('pet-hero-status')` es `null`.
6. `it('sin status no hay pildora (Profile) y con pet null tampoco, aunque llegue status')`
   — `pet={makePet()}` sin `status` → `queryByTestId('pet-hero-status')` `null`;
   `pet={null} status={{ label: 'En línea', tone: 'success' }}` → `null` y
   `within(caption).queryAllByText(/\S/)` igual a `[]`.

Candados que **no** se mueven: `:269-282`, `:342-348`, `:136-139`, `:141-153`
(el hero no gana imports de API ni del selector). Candado que **sí** se mueve:
`src/__tests__/legibility-classnames.test.ts:118-129` gana la fila
`[join('components', 'pet-hero-header.tsx'), 1]` y `:134` pasa a **`toBe(13 + 1 + 1)`**
(una ocurrencia de `text-accent-strong`, la tinta del tono `success`).

**Mutación que lo pone rojo**: además de la de 2, intercambiar punto y texto en
el JSX → rojo 1 y 5; mover la píldora al slot → rojo 5; `rounded-xl` → rojo 3 y
`consistency-classnames` no, pero la carta sí (`rounded-xl` no es cápsula).

#### R9 — la Home monta la píldora desde el mismo estado que `collar-status`

**WHEN** la Home tenga detalle resuelto (`detail.data?.kind === 'ok'`)
**THE SYSTEM SHALL** pasar al hero
`status={{ label: t(HOME_CONNECTION[connection].labelKey), tone: HOME_CONNECTION[connection].tone }}`
con el **mismo** `connection` de R7, y `status={undefined}` mientras el detalle
carga o falla (el hero ya recibe `pet={null}` en ese caso, `:250`). El slot
`home-hero-actions` (`:258`) **no** cambia.

**Test**: `mobile-pet-tracker/src/screens/home/index.test.tsx`, nuevo
`describe('#73 R9: la pildora del hero y collar-status nacen del mismo estado')`
(beforeEach como el de `:595-605`):

1. `it.each([[null, 'Sin collar', 'bg-muted'], [{ …device, connectivity: null, lastMessageAt: null }, 'Esperando señal', 'bg-muted'], [{ …device, connectivity: 'offline' }, 'Sin conexión', 'bg-warning-strong'], [{ …device, connectivity: 'online' }, 'En línea', 'bg-success']])('%s -> pildora "%s" con punto %s')`
   — `mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ device }) })`;
   `pill = await screen.findByTestId('pet-hero-status')`;
   `within(pill).getByTestId('pet-hero-status-text')` texto igual al de
   `getByTestId('collar-status')` (**los dos sitios pintan la misma cadena**);
   `within(pill).getByTestId('pet-hero-status-dot').props.className` contiene el
   punto esperado; `pill.props.accessibilityLabel` igual al texto.
2. `it('la pildora no entra en el slot: home-hero-actions sigue con dos hijos')`
   — `actions.children` longitud 2 y `within(actions).queryByTestId('pet-hero-status')` `null`.
3. `it('mientras el detalle carga no hay pildora y si hay skeleton')` —
   `mockGetPet.mockReturnValue(pending<PetState>())` → `queryByTestId('pet-hero-status')`
   `null`, `pet-hero-skeleton` visible.

**Mutación que lo pone rojo**: pasar al hero `tone: 'success'` fijo → rojo 1
(filas `offline` y `null`); pasar `label: t('home.online')` fijo → rojo 1 (tres
filas: la píldora y `collar-status` divergen).

### Bloque C — verificación y gate

#### R10 — candados que no se mueven, deltas declarados, grep-clean y mapa intacto (requisito de verificación, C4 vía (b))

**WHEN** se ejecuten `pnpm test` y `pnpm test:e2e` desde `backend-pet-tracker/`,
`bun run test` desde `mobile-pet-tracker/` y `./init.sh` desde la raíz
**THE SYSTEM SHALL** terminar con exit 0, **sin** tocar los candados de la tabla
"siguen verdes" de §Candados, **con** exactamente los deltas de la tabla
"cambian" de §Candados, y:

- `git diff --name-only origin/main...HEAD` **no** lista
  `mobile-pet-tracker/src/app/(tabs)/map.tsx` ni
  `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx` (G4), ni
  `mobile-pet-tracker/src/app/(tabs)/home.tsx` (§0.2 C1), ni
  `mobile-pet-tracker/src/components/floating-tab-bar.tsx` (#91);
- grep-clean de C8 sobre lo tocado: cero hex fuera de `src/theme/`, cero clases
  `[...]`, cero `StyleSheet.create`, cero shadow/elevation legacy, cero
  `rounded-2xl|lg|md|sm`, cero `text-[11px]`;
- ningún recuento absoluto nuevo de tests o suites en esta spec: el criterio es
  exit 0 y "ninguna suite que estaba verde queda roja".

**Test**: los candados citados son tests **ya existentes**. Se cierra por la vía
**(b)** con estas sondas, documentadas en `progress/impl_pet-online-pill.md` §R10
(mutación en producción → rojo visto → restaurar con `git diff` vacío):

1. restaurar `connectivity: 'online',` en `ingestion.drizzle.store.ts` → rojo
   `test/ingestion.e2e-spec.ts` R19;
2. `DEVICE_ONLINE_THRESHOLD_MS = 5 * 60_000 - 1_000` → rojo `connectivity.spec.ts` `it` 1;
3. cruzar `dot` entre `success` y `warning` en `STATUS_TONE_CLASSES` → rojo
   `pet-hero-header.test.tsx` R8 `it.each` y `index.test.tsx` R9 `it.each`;
4. cruzar `labelKey` de `unknown`/`offline` en `HOME_CONNECTION` → rojo R7 y R9;
5. (solo lectura) `git diff --name-only origin/main...HEAD | grep -c 'map\.'` = 0.

#### R11 — gate humano: prueba de humo en el dev build de Android (no delegable a IA)

**WHEN** la implementación esté completa e `init.sh` verde
**THE SYSTEM SHALL** quedar pendiente de una prueba de humo que ejecuta **un
humano**, **no delegable a ninguna IA**, en un **dev build de Android** (nunca
Expo Go; carta §Animación), con el backend local en `SIM_MODE=true`, en este
orden:

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
   "Conexión: Sin conexión". Tras **5 min** sin poller, A pasa también a
   "Sin conexión" (es el umbral, no un fallo).
3. **Desconocido** — con el poller aún parado, vincular `ACT-003` a la mascota C
   desde Pairing (o `UPDATE devices SET last_message_at = NULL, battery_pct = NULL WHERE esn = 'SIM-003';`
   si ya estaba vinculado). Home de C: píldora **"Esperando señal"** (gris) y
   `collar-status` "Esperando señal"; Pairing de C: "Conexión: —" y "Sin mensajes todavía".
4. **Sin collar** — una mascota sin collar: píldora **"Sin collar"** (gris) y
   `collar-status` "Sin collar"; sin fila de batería.
5. **Mapa (divergencia G4, esperada)** — con el poller parado el mapa de A dice
   "Desactualizado" a los 120 s mientras la Home dice "En línea" hasta los 300 s.
   **No es un defecto**: el mapa mide la posición, la píldora el collar.
6. **Temas y texto** — cambiar a dark: la píldora sigue legible en los cuatro
   estados; todo en español; sin animación de pulso; el selector y la campana
   siguen en su sitio.
7. **Restaurar** — `POLLER_ENABLED=true`, reiniciar; en ≤ 90 s A, B y C vuelven a "En línea".

El resultado se anota en `progress/impl_pet-online-pill.md` §R11. Hasta que el
humano lo firme, la feature **no** pasa a `done` aunque el `reviewer` haya
aprobado el resto.

---

## Cobertura de los criterios de aceptación de `feature_list.json`

| # | Criterio (literal resumido) | R-ids |
|---|---|---|
| 1 | El pestillo de `ingestion.drizzle.store.ts` queda arreglado y con test | R4 (write borrado; `ingestion.e2e-spec.ts:218` → `toBeNull()`), R1-R3 (lo sustituye la derivación en lectura, con unit + e2e) |
| 2 | Umbral definido por escrito en la spec, con unidad y justificación | R1 (300 s, ms en la constante, comentario literal con la fórmula); §Aprobación G2 |
| 3 | La píldora refleja el estado real y tiene estado explícito "desconocido" ≠ "desconectado" | R5-R9 (`unknown` con `home.unknown`; `offline` con `home.offline`); R3 (la API distingue `null` de `'offline'`) |
| 4 | Suite backend y móvil verdes | R10 |
| 5 | Gate humano: smoke en dev build de Android con una mascota en línea y otra en silencio | R11 |

---

## Candados (tabla fichero:línea → expresión actual → expresión nueva)

### Cambian (deltas declarados; ninguno más)

| Fichero:línea | Expresión actual | Expresión nueva | R |
|---|---|---|---|
| `backend-pet-tracker/test/ingestion.e2e-spec.ts:218` | `expect(deviceRow.connectivity).toBe('online');` | `expect(deviceRow.connectivity).toBeNull();` | R4 |
| `backend-pet-tracker/src/modules/devices/infrastructure/mappers/device-status.mapper.spec.ts:3-38` | passthrough `'lte'` | reescrito: derivación (3 `it`), claves intactas | R2 |
| `backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.spec.ts:230` | `connectivity: null,` (con `lastMessageAt` 2026-08-01) | `connectivity: 'offline',` + 2 `it` nuevos | R2 |
| `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx:41` | `toHaveLength(260 + 16 + 1 + 4 + 7 + 14)` | `toHaveLength(260 + 16 + 1 + 4 + 7 + 14 + 2)` | R5 |
| `mobile-pet-tracker/src/__tests__/ui-language.test.ts:84` | `toHaveLength(21 + 15 + 1 + 4 + 7 + 2)` | `toHaveLength(21 + 15 + 1 + 4 + 7 + 2 + 1)` | R7 |
| `mobile-pet-tracker/src/__tests__/ui-language.test.ts:167` | `toHaveLength(42 + 2)` | `toHaveLength(42 + 2 + 1)` | R6 |
| `mobile-pet-tracker/src/__tests__/ui-copy-table.ts:55` (tras) | — | `+ { file: 'src/screens/home/index.tsx', key: 'home.unknown' }` | R7 |
| `mobile-pet-tracker/src/__tests__/ui-copy-table.ts:374` (tras) | — | `+ { file: 'src/utils/device-connectivity.ts', key: 'deviceConnectivity.offline' }` | R6 |
| `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts:118-129` | 10 filas `inkSites` | `+ [join('components', 'pet-hero-header.tsx'), 1]` | R8 |
| `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts:134` | `toBe(13 + 1)` | `toBe(13 + 1 + 1)` | R8 |
| `mobile-pet-tracker/src/screens/home/index.test.tsx:640-658` | `null` → `'Sin conexión'` ("treats an unknown connection as offline") | `null` → `'Esperando señal'` | R7 |
| `specs/mobile-ui-language/design.md:290,683` (tras) | — | dos filas `← añadida por #73 (R5)` | R5 |

### Siguen verdes sin tocarlos (si alguno se pone rojo, la implementación está mal, no el candado)

| Candado | Qué fija |
|---|---|
| `backend-pet-tracker/test/devices.e2e-spec.ts:274-280,312-320` | 5 claves del claim; `connectivity: null` en el 201 (sin `lastMessageAt` ⇒ `null` también derivado) |
| `backend-pet-tracker/test/device-subscriptions.e2e-spec.ts:354-356` | 5 claves de `device` en el perfil |
| `backend-pet-tracker/test/pets.e2e-spec.ts:64-89,422-433` | 24 claves del perfil; `device: null` sin collar |
| `backend-pet-tracker/src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.spec.ts:35-82` | claves del perfil y `null` por defecto |
| `backend-pet-tracker/src/modules/pets/application/use-cases/get-pet.use-case.spec.ts:98-126` | el use case devuelve el `ActivePetDeviceStatus` del puerto tal cual (con `connectivity: null`) |
| `backend-pet-tracker/src/db/schema/devices.schema.spec.ts:82-90` | `connectivity` nullable; la columna **no** se borra |
| `backend-pet-tracker/src/workers/positions-consumer.service.spec.ts:402-406,431-434` | `updateDeviceTelemetry` recibe `{batteryPct, lastMessageAt}` — nunca tuvo `connectivity` |
| `backend-pet-tracker/test/ingestion.e2e-spec.ts:219-222,255-303` | batería, `lastMessageAt`, watermark y el guard "solo si más reciente" |
| `mobile-pet-tracker/src/screens/home/index.test.tsx:152` | `home-hero-actions` con **2** hijos |
| `mobile-pet-tracker/src/screens/home/index.test.tsx:607-638,864-935,1146-1170,1198-1225` | free/online, last-position, hero compartido, testIDs intactos |
| `mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx:113-357` | todo lo de #67 (medios sin texto, caption opaco, slot, skeleton) |
| `mobile-pet-tracker/src/utils/device-connectivity.test.ts:3-19` | R16 de #68 |
| `mobile-pet-tracker/src/screens/pairing/index.test.tsx:505-550` | `'LTE'` → 'Desconocida'; `null` → '—' |
| `mobile-pet-tracker/src/__tests__/ui-language.test.ts:428,437` | catálogo consistente; `SCREEN_FILES` `19 + 2 + 1` (no nace fichero con `t()`) |
| `mobile-pet-tracker/src/__tests__/design-drift.test.ts:61-65,94-100,202-226,331-355` | clases `[...]`, `text-[10px]`, hex/StyleSheet en los ficheros de #68, texto de la carta sobre `device.connectivity` (**no se edita**) |
| `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts:127-136,149-155,388-437,437-449` | skeleton del hero sin radio; `rounded-2xl|lg|md|sm` prohibidos; clases `category-*` solo en la paleta (la píldora **no** las usa); `bg-accent-soft` = 16 |
| `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts:153-171` | `text-warning-strong` presente donde toca; cero `text-warning` suelto; `bg-warning-soft` en reminders |
| `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx` (entero) | G4: el mapa no se toca |
| `mobile-pet-tracker/src/__tests__/hero-header-amendments.test.ts:85-87` | los 5 docs enmendados por #67 — **no** se edita `specs/mobile-pet-hero-header/design.md` |

---

## Fuera de alcance (cada uno con su porqué)

- **G8 — telemetría heredada tras release + claim**: `release` (`device.drizzle.repository.ts:107-112`)
  y `claim` (`:89-92`) no resetean `battery_pct`/`last_message_at`; un collar
  reclamado por otra mascota puede verse "En línea" con la señal del dueño
  anterior hasta el primer mensaje. Es un reset en escritura de otra feature
  (#7/#8), no de la derivación.
- **G9 — estado por mascota en el selector**: el listado sigue con
  `device: null` (OD-3 de #66); un punto por chip exige `findActiveDevices(petIds)`,
  feature aparte. La píldora es solo de la mascota seleccionada.
- **G10 — silencio por suscripción vencida**: el poller deja de consultar el
  collar (`ingestion.drizzle.store.ts:36-45`) y se verá "Sin conexión" sin
  explicar el motivo. Es decisión de producto; la Home ya trata el 402 de
  actividad aparte.
- **G11 — reloj del collar vs servidor**: se acepta el del servidor (precedente
  #9 D5). Un collar adelantado hasta 5 min parece en línea 5 min de más.
- **Migración que borre `devices.connectivity`**: la columna queda NULL y
  obsoleta; borrarla toca schema, entidad, puerto, reader, `devices.schema.spec.ts`
  y `docs/data-model.md` — feature aparte.
- **G4 — el mapa**: `map.tsx:76` (`STALE_SECONDS = 120`) y `map.test.tsx` no
  se tocan; miden otra cosa. Alinear umbrales o que el mapa consuma el estado
  derivado es feature aparte.
- **Animación de pulso** del Make (`App.tsx:358`, `animate-pulse`): descartada
  por escrito. Si el humano la quiere, es Reanimated + reduced-motion en feature
  aparte.
- **Píldora en Profile**: el Make pinta "Collar activo" (`App.tsx:672`), que es
  otro dato (tener collar, no estar en línea). Profile no pasa `status`.
- **Estrechar `DeviceStatus.connectivity`** en el móvil a `'online' | 'offline' | null`:
  rompería las fixtures `'LTE'` de Pairing sin ganar conducta; el helper ya
  degrada lo desconocido.
- **Alerta `device_offline`** (`plans/007:115`, tipos reservados en
  `alerts.schema.ts:16-19`): esta feature solo pinta el estado; no abre alertas.

---

## Enmiendas tras la firma (2026-09-13)

Tres, **todas a esta misma spec**, y todas por la misma causa: al firmar en
`0a76562b` (2026-09-12 −06:00, 2026-09-13 en UTC) el humano **no** aceptó los
defaults en dos filas de §Aprobación — **G2** (marcó `[X] 120 s`) y **G7b**
(marcó `[X] otra: "Reanimated + reduced-motion para agregar animacion"`) — y
marcó además `[X] Enmienda aprobada por humano` en el bloque literal de R4 (el
que R4 mandaba copiar "sin marcar"). Los requisitos firmados **no se
reescriben**: cada enmienda dice qué cambia, qué no cambia y por qué, con su
propia casilla al final. Codex implementa R1-R11 **leídos a través de E1-E3**.
Ningún R-id se renumera; ninguna otra fila de §Aprobación se reabre.

Todo lo que sigue está verificado contra el árbol de esta branch con `main`
mergeada (`bc29e5a0`), no contra el recuerdo de la spec.

### E1 — G2: el umbral es 120 s, no 300 s

- **Qué cambia**:
  - `DEVICE_ONLINE_THRESHOLD_MS = 2 * 60_000` (120 000 ms). El comentario
    **literal** de R1 se sustituye por este (mismo estilo ASCII del fichero):

    ```ts
    /** Silencio maximo (ms) para que un collar siga 'online' en lectura (#73 G2,
     * enmienda E1: 120 s elegidos por el humano al firmar, 0a76562b).
     * Formula: cadencia supuesta del collar 30 s (SIM_STEP_SECONDS del simulador,
     * no dato de hardware) + poller 60 s + consumer 15 s = 105 s de latencia peor
     * caso en regimen; 120 s deja 15 s de margen. Coincide con STALE_SECONDS = 120
     * del mapa movil (map.tsx) y con R6 de positions-api (staleSeconds < 120): un
     * solo numero para "fresco" en toda la app. El riesgo de parpadeo de un collar
     * sano con el retardo de Wialon queda aceptado por escrito en la spec (E1).
     * Si la cadencia pasa a adaptativa (plans/012 §Maintenance notes,
     * docs/brief.md §13) este valor se revisa. */
    export const DEVICE_ONLINE_THRESHOLD_MS = 2 * 60_000;
    ```

  - R1 `it` 1 se retitula `'el umbral vale exactamente 120 s (2 min), decision G2 enmendada por E1'`
    y espera `expect(DEVICE_ONLINE_THRESHOLD_MS).toBe(120_000)`.
  - Mutación de R1 y **sonda 2 de R10**: `DEVICE_ONLINE_THRESHOLD_MS = 2 * 60_000 - 1_000`
    → rojo `it` 1 (antes `5 * 60_000 - 1_000`).
  - **R11 paso 2**: "Tras **2 min** sin poller, A pasa también a 'Sin conexión'
    (es el umbral, no un fallo)". Consecuencia práctica que el guion debe decir:
    el `UPDATE` de `SIM-002` y la comprobación "A sigue En línea / B Sin
    conexión" se hacen **dentro de los 2 min** siguientes a parar el poller; si
    A ya dice "Sin conexión" al mirar, no es defecto: paso 7 (poller vivo,
    ≤ 90 s) y repetir el paso 2.
  - **R11 paso 5** deja de ser una divergencia temporal y pasa a:
    *"**Mapa (G4 sigue vigente; ya no hay divergencia de umbral)** — con el
    poller parado, el mapa de A dice 'Desactualizado' y la Home 'Sin conexión'
    a partir de los ~120 s, con un desfase de como mucho un ciclo de sondeo
    (`POLL_MS = 15000` del mapa, `map.tsx:77`; refetch al foco en Home). Son
    dos relojes distintos que ahora comparten número: `staleSeconds` de la
    **posición**, calculado en el servidor y sondeado por el mapa, y
    `connectivity` del **collar**, calculado en el servidor al refetch del
    detalle. Que coincidan en 120 s no los une: `map.tsx:76` no se toca (R10
    sonda 5) y alinear ambos en una sola fuente sigue siendo feature aparte."*
  - [[design]] D3 (título y números), D4 (ya no "entre los 120 s y los 300 s"),
    tabla "Decisiones cerradas" G2, fila 2 de "Cobertura de los criterios" (R1
    fija 120 s) y [[tasks]] R1 (1) ("0 ≠ 120 000") / R1 (2) (`2 * 60_000`) /
    R10 (1) (sonda 2): ver el bloque de enmiendas de cada fichero.
- **Qué NO cambia**: nada más de R1-R4. La constante sigue en
  `src/pipeline/constants.ts` tras `FUTURE_TS_TOLERANCE_MS`, en ms, con sufijo
  `_MS`; el límite sigue **inclusivo** (`≤`); `ts > now` sigue `'online'`; los
  `it` 2-6 de R1, los tests de R2 y R3 y el `UPDATE … - interval '10 minutes'`
  de R11 usan el símbolo o un valor muy por encima del umbral y **no se tocan**.
  `FUTURE_TS_TOLERANCE_MS` sigue en 5 min (G11 de §Fuera de alcance: un collar
  adelantado hasta 5 min sigue pareciendo en línea ese tiempo de más — ahora
  5 min + 2 min).
- **Por qué**: decisión del humano al firmar (§Aprobación G2). Lo que se gana
  es un solo número de "fresco" en la app (`STALE_SECONDS = 120`,
  `mobile-pet-tracker/src/app/(tabs)/map.tsx:76`; `specs/positions-api/requirements.md:96-99`);
  lo que se paga —15 s de margen sobre los 105 s de latencia peor caso, parpadeo
  posible con el retardo de Wialon o con ticks solapados del poller
  (`poller.service.ts:37-42`)— queda **aceptado por escrito** aquí y en el
  comentario de la constante. Si el parpadeo aparece en el smoke (R11), es
  conducta esperada, no rechazo.

### E2 — G7b: el punto de "en línea" pulsa (Reanimated + reduced motion)

- **Qué cambia**: la decisión **9** de la tabla de R8 (era "ninguna"), la
  decisión **2** (hijo 0) y la **10** (componentes permitidos), el `it` 3 de R8,
  [[design]] D7 (párrafo "Sin animación") y D8, la bala "Animación de pulso" de
  §Fuera de alcance (derogada), la tabla "Decisiones cerradas" G7 y R11 paso 6
  (+ paso 6-bis). Todo lo demás de R8 y R9 queda intacto.
- **Gate de la skill `expo:expo-animation`** (cargada para escribir esto):
  frecuencia = indicador ambiental, visible en cada visita a Home; propósito =
  **indicación de estado** (el collar está vivo ahora mismo, no solo "estuvo");
  herramienta = shared value + `withRepeat` en UI thread; propiedad = solo
  `opacity` (gratis, sin layout); curva = timing ease-in-out (movimiento en
  pantalla, no entrada/salida); reduced motion **en la misma feature**, no
  después. Rechazado con motivo: animar el texto o la superficie (carta
  `docs/ui-guidelines.md:159-160`: timings solo para opacidad/color, y el texto
  es el portador AA), pulsar `warning` (un ámbar latiendo lee como urgencia que
  el copy "Sin conexión" no lleva) y pulsar `muted`.
- **Decisiones candadas del punto** (amplían la tabla de R8; el criterio sigue
  siendo el de la Enmienda #70 de la carta: cruzar cualquiera pone rojo):

| # | Decisión | Valor candado |
|---|---|---|
| 2' | Hijo 0 (punto), dos ramas | `pulses ? <AnimatedView testID="pet-hero-status-dot" className={\`size-1.5 rounded-full ${tone.dot}\`} style={dotStyle} /> : <View testID="pet-hero-status-dot" className={\`size-1.5 rounded-full ${tone.dot}\`} />` — mismo `testID`, mismas clases en las dos ramas; la píldora sigue con **exactamente 2 hijos**, punto → texto |
| 9' | Cuándo pulsa | `const pulses = !reduceMotion && pet !== null && status?.tone === 'success';` — **solo** el punto, **solo** `success`, **solo** sin reduced motion. `warning`, `muted` y reduced motion → `View` estático (opacidad 1). El texto y la superficie **nunca** animan |
| 9'a | Receta (= `animate-pulse` de Tailwind, Make `App.tsx:358`) | `opacity` 1 → 0.5 → 1; `withRepeat(withSequence(withTiming(0.5, STATUS_DOT_PULSE), withTiming(1, STATUS_DOT_PULSE)), -1, false)` — ciclo 2 s, repetición infinita, **sin** reverse (la secuencia ya vuelve a 1) |
| 9'b | Constante exportada | `export const STATUS_DOT_PULSE = { duration: 1000, easing: Easing.bezier(0.4, 0, 0.6, 1), reduceMotion: ReduceMotion.System } as const;` con docblock *"Pulso del punto 'en línea' (#73 E2): animate-pulse de Tailwind traducido a Reanimated; misma cadencia que el pulse del Skeleton de heroui que ya vive en este hero."* — misma forma y mismo candado que `TAB_INDICATOR_SPRING` (`src/components/floating-tab-bar.tsx:60-64`, test `src/components/__tests__/floating-tab-bar.test.tsx:221-225`) y `METRIC_TAB_SPRING` (`src/screens/home/weekly-activity-chart.tsx:55-59`) |
| 9'c | Nodo animado | `const AnimatedView = Animated.createAnimatedComponent(View);` a nivel de módulo en `pet-hero-header.tsx` — precedente literal `weekly-activity-chart.tsx:91`, cuyo `className` sobre ese nodo está asertado en `weekly-activity-chart.test.tsx:970-972`. **No** `Animated.View`: no pasa por el `View` de uniwind y perdería las clases (`floating-tab-bar.tsx:138-150` lo usa solo con `style`) |
| 9'd | Hooks (en el cuerpo de `PetHeroHeader`, incondicionales, orden fijo) | `const reduceMotion = useReducedMotion();` `const dotOpacity = useSharedValue(1);` `const dotStyle = useAnimatedStyle(() => ({ opacity: dotOpacity.get() }));` `useEffect(() => { if (!pulses) return; dotOpacity.set(withRepeat(…9'a…)); return () => { cancelAnimation(dotOpacity); dotOpacity.set(1); }; }, [pulses, dotOpacity]);` — `.get()/.set()` como `floating-tab-bar.tsx:79-105` (React Compiler activo, `app.json:41`). Con `pulses` falso (Profile, `warning`, `muted`, reduced motion) el efecto no arranca nada |
| 9'e | Limpieza | **sí** hay `cancelAnimation` en el cleanup: `withRepeat(…, -1)` no se cancela solo al desmontar ni al cambiar de tono, y sin él un tono `warning` heredaría una opacidad a medio tramo; `dotOpacity.set(1)` deja el valor listo para el siguiente `success`. Una línea, correcta en el borde |
| 9'f | Reduced motion, doble guarda | (1) `useReducedMotion()` → rama estática del 2'; (2) `reduceMotion: ReduceMotion.System` dentro de `STATUS_DOT_PULSE`. Exactamente el patrón de `weekly-activity-chart.tsx:106-129,144` y la carta `:171-172` |
| 9'g | Hilo y duración | UI thread (shared value + `useAnimatedStyle`); ningún `setState`, ningún timer JS. 1000 ms por tramo **no** está en la lista 150/250/400 de la carta (`:160-162`) porque esa lista es de movimiento de un solo disparo; el bucle copia el tempo del pulse del `Skeleton` de heroui (opacity 0.5→1, 1000 ms, `progress/audit_animations_mobile.md:17`) que **este mismo hero** pinta mientras carga (`pet-hero-header.tsx:130-133`), y el de `animate-pulse` de Tailwind. Sin token `--motion-*`: un solo uso (carta: token a partir de la segunda repetición) |
| 10' | Componentes | `View` + `Text` de `react-native` **y** `AnimatedView` (9'c) de `react-native-reanimated`, todo dentro de `pet-hero-header.tsx`; sigue **sin** `Chip` y **sin** fichero nuevo. Imports nuevos del hero: `import { useEffect, type ReactNode } from 'react';` y `import Animated, { cancelAnimation, Easing, ReduceMotion, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';` |

- **Cero dependencias nuevas** (la cabecera de esta spec sigue siendo cierta):
  `react-native-reanimated` `4.5.1` y `react-native-worklets` `0.10.1` ya están
  en `mobile-pet-tracker/package.json:36,41`; `test/jest-setup.js` ya llama a
  `setUpTests()` y mockea `react-native-worklets`, así que `toHaveAnimatedStyle`
  está disponible en cualquier test del móvil.
- **Test** — `mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx`:
  - Cabecera del fichero: mock de Reanimated **calcado** de
    `src/screens/home/weekly-activity-chart.test.tsx:50,58-65` (patrón también
    en `src/theme/__tests__/theme-transition.test.tsx:11,18-23`):
    `const mockUseReducedMotion = jest.fn<boolean, []>(() => false);` y
    `jest.mock('react-native-reanimated', () => ({ ...jest.requireActual<typeof import('react-native-reanimated')>('react-native-reanimated'), useReducedMotion: () => mockUseReducedMotion(), withRepeat: jest.fn((animation: unknown) => animation), withSequence: jest.fn((...steps: unknown[]) => steps.at(-1)), withTiming: jest.fn((value: number) => value), cancelAnimation: jest.fn() }));`
    más `import { cancelAnimation, ReduceMotion, withRepeat, withTiming } from 'react-native-reanimated';`,
    `STATUS_DOT_PULSE` en el import de `'../pet-hero-header'`, y
    `const mockWithRepeat = jest.mocked(withRepeat); const mockWithTiming = jest.mocked(withTiming); const mockCancelAnimation = jest.mocked(cancelAnimation);`.
    Los `describe` de #67 (R1-R7) no cambian: no montan la píldora.
  - El `it` 3 de R8 se retitula
    `'es una capsula rounded-full de text-2xs font-semibold, self-start, sin animate-pulse ni Chip'`:
    conserva `not.toContain('animate-pulse')` y `not.toMatch(/\bChip\b/)`, y
    **cambia** `not.toContain('react-native-reanimated')` por
    `toContain("from 'react-native-reanimated'")`. **Delta declarado.**
  - Nuevo `describe('#73 E2: el punto de "en linea" pulsa con Reanimated y respeta reduced motion')`
    (`beforeEach`: `mockWithRepeat.mockClear(); mockWithTiming.mockClear(); mockCancelAnimation.mockClear(); mockUseReducedMotion.mockReturnValue(false);`
    `afterEach(() => cleanup())`; `renderHero` con `pet={makePet()}` y
    `status={{ label: 'En línea', tone: 'success' }}` salvo donde se dice otra
    cosa; `dot = within(getByTestId('pet-hero-status')).getByTestId('pet-hero-status-dot')`):
    1. `it('STATUS_DOT_PULSE es el animate-pulse de Tailwind: 1000 ms por tramo, bezier(0.4, 0, 0.6, 1) y reduced motion del sistema')`
       → `expect(STATUS_DOT_PULSE).toMatchObject({ duration: 1000, reduceMotion: ReduceMotion.System })`
       y `expect(readSource('components', 'pet-hero-header.tsx')).toContain('easing: Easing.bezier(0.4, 0, 0.6, 1)')`
       (`Easing.bezier` devuelve una factoría, no comparable por valor: el
       candado de la curva es de fuente, como el resto de `readSource` de R8).
    2. `it('con reduced motion activo el punto es estatico: sin estilo animado y sin arrancar ningun bucle')`
       → `mockUseReducedMotion.mockReturnValue(true)`; `expect(dot).not.toHaveAnimatedStyle({ opacity: 1 })`
       (el matcher falla sin estilo animado, `node_modules/react-native-reanimated/lib/module/jestUtils/index.js:145`);
       `expect(mockWithRepeat).not.toHaveBeenCalled()`; `expect(dot.props.className).toContain('bg-success')`
       (las clases no dependen de la rama).
    3. `it('con tone success el punto es el nodo animado: 1 -> 0.5 -> 1 con STATUS_DOT_PULSE, infinito y sin reverse')`
       → `expect(dot).toHaveAnimatedStyle({ opacity: 1 })`;
       `expect(mockWithTiming).toHaveBeenNthCalledWith(1, 0.5, STATUS_DOT_PULSE)`;
       `expect(mockWithTiming).toHaveBeenNthCalledWith(2, 1, STATUS_DOT_PULSE)`;
       `expect(mockWithRepeat).toHaveBeenCalledTimes(1)`;
       `expect(mockWithRepeat).toHaveBeenCalledWith(expect.anything(), -1, false)`.
    4. `it.each([['warning'], ['muted']])('%s: el punto es estatico y no arranca ningun bucle')`
       → `status={{ label: 'x', tone }}`; `expect(dot).not.toHaveAnimatedStyle({ opacity: 1 })`;
       `expect(mockWithRepeat).not.toHaveBeenCalled()`.
    5. `it('al desmontar cancela el bucle del punto')` → `const { unmount } = await renderHero(…success…)`;
       `unmount()`; `expect(mockCancelAnimation).toHaveBeenCalledTimes(1)`.
  - Los `it` 1, 2, 4, 5 y 6 de R8 **no cambian**: `pill.children` sigue en 2
    (el `AnimatedView` es un solo hijo con `props.testID`), el orden punto →
    texto, las clases por tono, `accessible`/`accessibilityLabel` y las
    condiciones de render son las mismas en ambas ramas.
  - **R9** (`src/screens/home/index.test.tsx`) **no** gana mock de Reanimated:
    la fila `online` del `it.each` monta el bucle real bajo el runtime de
    jest, como ya hace esa suite con las animaciones de
    `weekly-activity-chart.tsx` que la Home monta; RNTL desmonta al acabar
    cada `it` y el cleanup de 9'e lo cancela. Sus aserciones (`className`
    del punto, texto, `accessibilityLabel`) valen igual en las dos ramas.
- **Mutación que lo pone rojo** (además de las de R8): quitar `!reduceMotion`
  de `pulses` → rojo 2; `status?.tone !== 'muted'` en `pulses` → rojo 4 (fila
  `warning`); `withRepeat(…, -1, true)` → rojo 3; `duration: 300` → rojo 1;
  pintar `View` estático también para `success` (o quitar `style={dotStyle}`)
  → rojo 3; quitar el cleanup del efecto → rojo 5; `Animated.View` en vez de
  `AnimatedView` → rojo el `it.each` 2 de R8 (`dot.props.className` vacío).
- **Candados re-verificados** (`grep -rn "react-native-reanimated\|Animated\.View\|useReducedMotion" mobile-pet-tracker/src/__tests__/` → **0** resultados):
  ningún test del repo cuenta imports de Reanimated ni nodos animados por
  fichero. `src/__tests__/design-drift.test.ts` (sin hex, sin `StyleSheet`;
  `style={dotStyle}` es un objeto como el `style={TABULAR_NUMS}` que el hero ya
  tiene), `consistency-classnames.test.ts` (el punto no gana ni pierde clases)
  y `legibility-classnames.test.ts` (ninguna tinta nueva; sigue `13 + 1 + 1`)
  **no se mueven**. `progress/audit_animations_mobile.md` no lo lee ningún test
  (`grep -rl audit_animations mobile-pet-tracker/src` → nada) y **no se edita**:
  su inventario ("cero Reanimated en código propio", `:12`) ya estaba
  desactualizado por `floating-tab-bar.tsx`, `weekly-activity-chart.tsx` y
  `theme-transition.ts`, y ponerlo al día es de otra feature. `docs/ui-guidelines.md`
  **no se edita**: la píldora cumple su §Animación tal como está (Reanimated en
  UI thread, timing solo para opacidad, reduced motion respetado, interrumpible
  por diseño al no tener gesto). **Ningún recuento absoluto nuevo.**
- **R11 paso 6** pierde "sin animación de pulso" y gana el **paso 6-bis**:
  *"**Pulso** — en la mascota en línea el punto verde de la píldora late
  suavemente (2 s por ciclo, nunca el texto); en las de 'Sin conexión',
  'Esperando señal' y 'Sin collar' el punto está fijo. Activar «Quitar
  animaciones» en Ajustes › Accesibilidad de Android y volver a Home: el punto
  verde queda fijo, opacidad plena, sin salto. Desactivarlo: vuelve a latir."*
  Se anota en la misma tabla de `progress/impl_pet-online-pill.md` §R11.
- **Qué NO cambia**: tokens por tono (decisión 5, D7 con sus contrastes),
  cardinalidad, orden, `testID`s, `accessibilityLabel`, `text-2xs`,
  `rounded-full`, condición de render, sitio, ausencia de skeleton, G6 (Profile
  sin píldora), R9 entero, el mapa (G4) y la regla "cero dependencias nuevas".
- **Por qué**: decisión del humano al firmar (§Aprobación G7b). El Make lo
  pinta así (`App.tsx:358`, `animate-pulse` en el `span` verde) y la carta solo
  vetaba hacerlo **sin** Reanimated y **sin** reduced motion; con las dos
  condiciones cumplidas, dejarlo para "feature aparte" era prudencia, no
  restricción. Se descarta la alternativa "CSS animation de Reanimated 4"
  (`animationName` + `animationIterationCount: 'infinite'`) porque no lleva
  `reduceMotion` por animación, no tiene precedente ni mocks en el repo, y el
  candado de constante (`TAB_INDICATOR_SPRING`, `METRIC_TAB_SPRING`) es el que
  el repo ya vigila.

### E3 — R4: el bloque E-#8 se copia **firmado**

- **Qué cambia**: R4 decía que el bloque `## Enmienda #73 — la conectividad se
  deriva en lectura` se añade a `specs/wialon-ingestion-pipeline/requirements.md`
  "**sin marcar** la firma" y §Aprobación E-#8 decía "el humano la marca junto
  con esta casilla". El humano ya la marcó **aquí** (`0a76562b`, línea del
  bloque literal de R4: `- [X] Enmienda aprobada por humano`). Codex copia el
  bloque **tal como está en R4** (con la casilla marcada) y su última línea
  pasa a:
  `- [X] Enmienda aprobada por humano (firmada en \`0a76562b\`, 2026-09-12 — ver §Aprobación de \`specs/pet-online-pill/requirements.md\`)`.
  [[tasks]] R4 (2) se lee con "firma **marcada**".
- **Qué NO cambia**: el resto de R4 (línea `:97` borrada, docblock del puerto,
  nota en `docs/data-model.md:53`, `test/ingestion.e2e-spec.ts:218` →
  `toBeNull()`, sonda de mutación), el sitio del bloque (al final del fichero,
  formato canónico de `specs/mobile-pet-hero-header/design.md:539-563`) ni el
  texto de "Qué cambia / Qué NO cambia" del bloque.
- **Por qué**: una casilla sin marcar en la spec enmendada, con la firma ya
  dada en la spec de origen, obligaría al humano a firmar dos veces lo mismo y
  dejaría un gate abierto que nadie va a cerrar. La referencia al commit deja
  la trazabilidad de la firma en el fichero que la muestra.

- [ ] Enmiendas E1-E3 aprobadas por humano (fecha: ____)

---

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-12) ← gate obligatorio antes de implementar

Al firmar, el humano ratifica **o cambia** estas decisiones (firmar sin editar =
aceptar los defaults; Codex no verá la conversación que las originó):

| Id | Decisión | Default (esta spec) | Alternativa que el humano puede elegir | Marca |
|---|---|---|---|---|
| G1 | Fuente de "en línea" | **A2**: derivar en lectura de `last_message_at` + borrar el write `:97`; columna obsoleta | A1 (dejar el write como caché muerta: no cumple el criterio 1); B (job que apaga el pestillo: dos fuentes de verdad, un tick de retraso, env y docs nuevas); C (derivar en el móvil: reloj del teléfono, rompe fixtures) | [X] default / [ ] otra: ____ |
| G2 | Umbral | **300 s** (`5 * 60_000` ms), límite inclusivo | **120 s** (coherente con `map.tsx:76`; margen de solo 15 s sobre los 105 s de latencia peor caso ⇒ un collar sano puede parpadear con el retardo de Wialon) | [ ] 300 s / [X] 120 s / [ ] otro: ____ |
| G4 | Mapa | **no se toca** (divergencia declarada, R11 paso 5) | alinear `STALE_SECONDS` en feature aparte | [X] default / [ ] otra: ____ |
| G5a | Copy de "desconocido" | **`home.unknown`** = `Esperando señal` / `Awaiting signal` | `Sin señal todavía` / `No signal yet`; o reusar `deviceConnectivity.unknown` (`Desconocida`, desaconsejado: §0.2 C3) | [X] default / [ ] otra: ____ |
| G5b | Copy de Pairing para `offline` | **`deviceConnectivity.offline`** = `Sin conexión` / `Offline` | otro texto: ____ | [X] default / [ ] otra: ____ |
| G6 | Dónde entra la píldora | **prop `status` del hero**, columna izquierda, encima del nombre; Profile sin píldora | Profile también la muestra (entonces R8 `it` 6 cambia y `profile/index.tsx:252` pasa `status`) | [X] default / [ ] otra: ____ |
| G7a | Tokens (texto / punto / superficie) | success: `text-accent-strong` / `bg-success` (3,04:1) / `bg-success-soft`; warning: `text-warning-strong` / `bg-warning-strong` / `bg-warning-soft`; muted: `text-muted` / `bg-muted` / `bg-default` | punto "en línea" `bg-accent-strong` (5,12:1, más margen; misma tinta que el texto) | [X] default / [ ] otra: ____ |
| G7b | Animación | **ninguna** | pulso con Reanimated + reduced-motion, feature aparte | [ ] default / [X] otra:  Reanimated + reduced-motion para agregar animacion  |
| G7c | Componente | **`View`+`Text` dentro de `pet-hero-header.tsx`** | `Chip` de heroui (ver [[design]] D8: AA no garantizable, `Pressable`, clases opacas al grep) | [X] default / [ ] otra: ____ |
| E-#8 | Enmienda a `specs/wialon-ingestion-pipeline/requirements.md` (R4) | bloque canónico al final, firma sin marcar | — (el humano la marca junto con esta casilla) | [X] leída |
