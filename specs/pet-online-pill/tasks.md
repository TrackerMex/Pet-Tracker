---
feature: "pet-online-pill"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[pet-online-pill]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Commits test-primero, obligatorio** (C4 de `CHECKPOINTS.md`): el (1) de cada
> tarea es su propio commit `test(pet-online-pill): … (Rn)` y se empuja en
> **rojo**; el (2) es el commit `feat(...)`/`fix(...)`/`refactor(...)` que lo pone
> verde. Un solo commit con test + implementación + docs incumple C4 — pasó en
> #19. "Rojo por módulo o símbolo inexistente **no vale como rojo**": cuando el
> test importa algo que aún no existe, el (1) crea el símbolo con la firma y un
> cuerpo `throw new Error('not implemented')` (o el valor placeholder que se
> indica) para que el rojo sea de las **aserciones**.
>
> **Dos lados, dos suites.** Backend: `pnpm test` (unit) y `pnpm test:e2e`
> (Postgres + LocalStack reales) desde `backend-pet-tracker/`. Móvil:
> `bun run test` desde `mobile-pet-tracker/`. En cada commit se corre **la suite
> del lado tocado**; `./init.sh` desde la raíz corre todo y es la línea base y el
> cierre. Los commits de backend (R1-R4) van **antes** que los de móvil (R5-R9):
> el móvil no depende del backend en runtime de test (usa fixtures), pero así el
> smoke (R11) encuentra la API lista.
>
> **Sujeto presente**: para cada test se ha verificado contra este orden que
> todo nodo, símbolo, clave o `testID` que nombra **ya existe** en ese punto o lo
> crea el propio (1) como stub. Donde un test nombra algo de un requisito
> posterior, se dice explícitamente.

---

## §0 — Antes de la primera tarea

- [ ] Cargar `expo:expo-overview` y, derivada de ella, `expo:expo-native-ui`
      (píldora, tokens, accesibilidad) antes de tocar `mobile-pet-tracker/`.
      Codex CLI: plugin `expo` (`codex plugin add expo@openai-curated`).
- [ ] Leer `docs/ui-guidelines.md` entero, incluida la **Enmienda #70**
      (elementos con todas sus decisiones candadas): la píldora es uno.
- [ ] Leer [[requirements]] §0 (premisas verificadas y **corregidas**) antes que
      los requisitos: el enunciado de #73 cita un route delgado que no se toca,
      y los tokens del leader se han corregido con números de contraste.
- [ ] Leer [[design]] D7 (tabla de contraste) y D8 (por qué no `Chip`).
- [ ] Si existe `mobile-pet-tracker/.expo/types/router.d.ts`, **borrarlo** antes
      de tocar código: está gitignorado, se queda obsoleto y rompe el `typecheck`
      con rutas fantasma. Se regenera solo.
- [ ] Comprobar con `pgrep -f init.sh` que no hay otro `init.sh` corriendo en
      otro worktree (comparten el Postgres de docker y se pisan). Luego
      `./init.sh` verde desde la raíz **antes** de empezar, para tener la línea
      base.
- [ ] Verificar la branch: `git branch --show-current` = `feature/73-pet-online-pill`
      en el worktree de esta feature. **No** tocar `src/components/floating-tab-bar.tsx`
      ni su test (#91 vive en otra sesión).
- [ ] Crear `progress/impl_pet-online-pill.md` con una sección por R (vacías);
      ahí van las evidencias de mutación (R4, R10) y el guion del smoke (R11).

---

## Bloque A — backend

### R1 — umbral nombrado y `deriveConnectivity` pura

- [ ] (1) Escribir test que falla para R1 —
      `backend-pet-tracker/src/modules/devices/domain/connectivity.spec.ts`
      (nuevo), `describe('#73 R1: …')` con los 6 `it` literales de [[requirements]]
      R1. Para que el rojo sea de aserciones, este commit crea también:
      `src/pipeline/constants.ts` `+ export const DEVICE_ONLINE_THRESHOLD_MS = 0;`
      (placeholder, **sin** comentario todavía) y
      `src/modules/devices/domain/connectivity.ts` con la firma exportada y
      `throw new Error('not implemented')`. Rojo: `it` 1 (0 ≠ 300 000) y 2-6
      (throw). Suite: `pnpm test -- connectivity`.
- [ ] (2) Implementación mínima que lo pasa — constante `5 * 60_000` con el
      **comentario literal** de R1; función con la comparación inclusiva y la
      rama `null`; cabecera `// Nucleo puro: …`. Verde: `pnpm test`.
- [ ] (3) Refactor con tests verdes — comprobar que `connectivity.ts` no importa
      nada salvo `@/pipeline/constants` (`docs/architecture.md:18-22`).

### R2 — el contrato deriva `connectivity` en lectura

- [ ] (1) Escribir test que falla para R2 — reescribir
      `src/modules/devices/infrastructure/mappers/device-status.mapper.spec.ts`
      (3 `it` de R2; las fuentes **sin** `connectivity`; la llamada con `now`) y
      `src/modules/pets/infrastructure/pets.controller.spec.ts` (el `it` de
      `:212-234` retitulado con `'offline'` esperado + 2 `it` nuevos). Para que el
      rojo sea de **aserciones** y no de compilación (ts-jest tiene los
      diagnósticos activos: un `TS2554`/`TS2741` tumba la suite entera y no
      vale como rojo, regla de cabecera), este commit deja el **stub** de la
      firma nueva: `toDeviceStatusResponse(source: DeviceStatusSource, now: Date)`,
      `DeviceStatusSource` **sin** `connectivity`, cuerpo con el placeholder
      `connectivity: null` (sin llamar a `deriveConnectivity`; `now` sin usar), y
      los tres llamadores pasando `now` (`pets.controller.ts:110`,
      `pet-device.controller.ts:43`, `devices.controller.ts:41-43`) para que
      `pnpm build` y ts-jest compilen. Rojo: mapper.spec `it` 1 (espera
      `'online'`, recibe `null`) e `it` 2 (`'offline'`), `pets.controller.spec`
      (`'offline'` y `'online'` esperados, `null` recibido); verdes los `it` de
      `null`. Sujeto presente: `deriveConnectivity` y `DEVICE_ONLINE_THRESHOLD_MS`
      existen (R1). Suite: `pnpm test -- device-status pets.controller`.
- [ ] (1-bis) **Antes del (2)**: commitear también el test de R3 en rojo (ver
      §R3 (1)). El `feat` de abajo pone verdes los dos.
- [ ] (2) Implementación mínima que lo pasa — sustituir el placeholder por
      `connectivity: deriveConnectivity(source.lastMessageAt, now)` y escribir el
      comentario `:1-6` nuevo (firma y llamadores ya vienen del (1)). Mensaje:
      `feat(pet-online-pill): derive device connectivity at read (R2,R3)`.
      Verde: `pnpm test` **y** `pnpm test:e2e -- device-connectivity`.
- [ ] (3) Refactor con tests verdes — `pnpm build` limpio (el TS2339 de la
      mutación de R2 es la prueba de que el tipo protege).

### R3 — e2e de los tres estados sin dormir

- [ ] (1) Escribir test que falla para R3 —
      `backend-pet-tracker/test/device-connectivity.e2e-spec.ts` (nuevo) con el
      arnés de `test/positions.e2e-spec.ts:44-130` y los 3 `it` de R3. Se
      commitea **antes** del `feat` de R2: con el passthrough y la columna NULL,
      los `it` 2 y 3 son rojos (reciben `null`). Sujeto presente: rutas y
      guards ya existen; `DEVICE_ONLINE_THRESHOLD_MS` existe (R1). Suite:
      `pnpm test:e2e -- device-connectivity` (Postgres levantado por `init.sh`;
      comprobar `pgrep` antes).
- [ ] (2) Implementación mínima que lo pasa — es el `feat` de R2 (2). No hay
      commit propio.
- [ ] (3) Refactor con tests verdes — `afterAll` limpia `users`, `pets`
      (cascada), `devices`, `audit_log`; sin `deviceSubscriptions`.

### R4 — el pestillo desaparece

- [ ] (1) Escribir test que falla para R4 — `test/ingestion.e2e-spec.ts:218`
      `toBe('online')` → `toBeNull()` con el comentario `// #73 R4: nadie escribe la columna`.
      Rojo: el store aún escribe `'online'`. Suite: `pnpm test:e2e -- ingestion`.
- [ ] (2) Implementación mínima que lo pasa — borrar la línea `:97` de
      `src/workers/ingestion.drizzle.store.ts`; docblock de
      `src/workers/ingestion-store.ts:44-48`; nota en `docs/data-model.md:53`;
      bloque de enmienda **literal** de R4 al final de
      `specs/wialon-ingestion-pipeline/requirements.md` con la firma **sin
      marcar**. Mensaje: `fix(pet-online-pill): stop latching devices.connectivity (R4)`.
      Verde: `pnpm test:e2e` completo (el resto de aserciones de `:219-222` y
      `:255-303` siguen verdes).
- [ ] (3) Refactor con tests verdes — **sonda de mutación obligatoria**:
      restaurar `connectivity: 'online',` → `pnpm test:e2e -- ingestion` rojo →
      restaurar con `git diff` vacío. Evidencia (comando + línea del fallo) en
      `progress/impl_pet-online-pill.md` §R4.

---

## Bloque B — móvil

### R5 — catálogo: dos claves nuevas, registradas

- [ ] (1) Escribir test que falla para R5 —
      `src/providers/__tests__/language-provider.test.tsx`: `:41` a
      `260 + 16 + 1 + 4 + 7 + 14 + 2`, comentario `:36` "+ 2 de #73", y el `it`
      `'#73 R5: …'` (valores + regex de la tabla, patrón de
      `src/__tests__/ui-language.test.ts:104-125`). Rojo: recuento 300 ≠ 302,
      `en['home.unknown']` undefined, regex sin match. Suite: `bun run test -- language-provider`.
- [ ] (2) Implementación mínima que lo pasa — 4 líneas en
      `src/i18n/catalog.ts` (`:37`, `:88`, `:344`, `:395`, tras cada una) y 2
      filas en `specs/mobile-ui-language/design.md` (tras `:290` y `:683`).
      Verde: `bun run test -- language-provider ui-language` (`ui-language.test.ts:428`
      sigue verde: los dos idiomas crecen igual).
- [ ] (3) Refactor con tests verdes — comprobar que ninguna pantalla contiene
      `'Esperando señal'` / `'Awaiting signal'` como literal (`ui-language.test.ts:436-447`
      lo vigila).

### R6 — un helper decide el estado; Pairing gana `offline`

- [ ] (1) Escribir test que falla para R6 — `src/utils/device-connectivity.test.ts`
      `describe('#73 R6: …')` con los 5 `it`; `src/screens/pairing/index.test.tsx`
      `it('#73 R6: pinta Sin conexion para un collar desconectado')`;
      `src/__tests__/ui-copy-table.ts` `+ 1` fila tras `:374`;
      `src/__tests__/ui-language.test.ts:167` `42 + 2 + 1`. Para que el rojo sea
      de aserciones, este commit exporta en `device-connectivity.ts`
      `type DeviceConnectionState` y `deviceConnectionState` con
      `throw new Error('not implemented')`. Rojo: `connectivityLabelKey('offline')`
      devuelve `unknown`; los `it` de estado lanzan; Pairing pinta 'Desconocida';
      `checkUses` cuenta 0 para `deviceConnectivity.offline`. Sujeto presente:
      `deviceConnectivity.offline` existe (R5); `makeDevice` de
      `pairing/index.test.tsx:99-108` existe. Suite: `bun run test -- device-connectivity pairing ui-language`.
- [ ] (2) Implementación mínima que lo pasa — fila `offline` en META; cuerpo de
      `deviceConnectionState` (4 ramas). Verde: la misma suite.
- [ ] (3) Refactor con tests verdes — `design-drift.test.ts:202-226` sigue
      verde (el fichero está en su lista: sin hex, sin StyleSheet).

### R7 — `collar-status` con cuatro estados

- [ ] (1) Escribir test que falla para R7 — `src/screens/home/index.test.tsx`:
      retitular y cambiar el `it` de `:640-658` (`'Esperando señal'`), añadir
      `it('#73 R7: shows an offline collar as Sin conexión with its battery')`;
      `src/__tests__/ui-copy-table.ts` `+ 1` fila tras `:55`;
      `src/__tests__/ui-language.test.ts:84` `… + 2 + 1` y comentario `:81-83`.
      Rojo: la Home pinta 'Sin conexión' para `null`; `checkUses` cuenta 0 para
      `home.unknown` en `index.tsx`. Sujeto presente: `home.unknown` (R5),
      `deviceConnectionState` (R6), `collar-status` y `collar-battery` existen.
      Suite: `bun run test -- screens/home ui-language`.
- [ ] (2) Implementación mínima que lo pasa — en `src/screens/home/index.tsx`:
      `import type { TranslationKey } from '../../i18n/catalog'`,
      `import { deviceConnectionState, type DeviceConnectionState } from '../../utils/device-connectivity'`,
      `type PetHeroStatusTone = 'success' | 'warning' | 'muted'` (local hasta R9),
      `HOME_CONNECTION` literal de R7 junto a `QUICK_ACTIONS`, `const connection = …`
      dentro de la rama `detail.data?.kind === 'ok'`, ternario `:457-461` →
      `t(HOME_CONNECTION[connection].labelKey)`, icono `:445-451` por `connection`.
      Verde: `bun run test -- screens/home ui-language legibility` (Home sigue
      con 2 `text-accent-strong`; no se añade ninguno aquí).
- [ ] (3) Refactor con tests verdes — ninguna otra referencia a
      `device.connectivity === 'online'` queda en `home/index.tsx`
      (`grep -n "connectivity" src/screens/home/index.tsx` → solo el import y la
      llamada al helper).

### R8 — el hero gana la píldora (todas las decisiones candadas)

- [ ] (1) Escribir test que falla para R8 —
      `src/components/__tests__/pet-hero-header.test.tsx` `describe('#73 R8: …')`
      con los 6 `it` de R8 (copiar `elementChild` de
      `src/screens/alerts/index.test.tsx:94-101`);
      `src/__tests__/legibility-classnames.test.ts:118-129` `+ [join('components', 'pet-hero-header.tsx'), 1]`
      y `:134` `13 + 1 + 1`. Para que el rojo sea de aserciones, este commit
      exporta en `pet-hero-header.tsx` `PetHeroStatus`, `PetHeroStatusTone` y la
      prop `status?` en `PetHeroHeaderProps` **sin usarla** en el JSX. Rojo:
      `getByTestId('pet-hero-status')` no existe (1-5); `legibility` cuenta 0.
      Sujeto presente: `pet-hero-caption`, `pet-hero-name`, `pet-hero-slot`,
      `pet-hero-media`, `renderHero`, `makePet`, `readSource` existen en ese
      fichero. Suite: `bun run test -- pet-hero-header legibility consistency design-drift`.
- [ ] (2) Implementación mínima que lo pasa — `STATUS_TONE_CLASSES` y el JSX
      literal de la tabla de R8 (decisiones 1-3) como primer hijo de la columna
      izquierda dentro del `pet ? (…)` (`:117-128`), condicionado a `status`;
      docblock de la prop. Verde: la misma suite + `bun run typecheck`.
- [ ] (3) Refactor con tests verdes — **sonda de mutación**: cruzar `dot` entre
      `success` y `warning` en `STATUS_TONE_CLASSES` → rojo el `it.each` (2) →
      restaurar (`git diff` vacío). Evidencia en `progress/impl_pet-online-pill.md` §R8.

### R9 — la Home monta la píldora desde el mismo estado

- [ ] (1) Escribir test que falla para R9 — `src/screens/home/index.test.tsx`
      `describe('#73 R9: …')` con los 3 `it` de R9 (el `it.each` de 4 filas
      compara el texto de la píldora con el de `collar-status`). Rojo:
      `findByTestId('pet-hero-status')` no aparece (la Home aún no pasa `status`).
      Sujeto presente: `pet-hero-status*` los pinta el hero (R8) cuando recibe
      `status`; `HOME_CONNECTION` y `connection` existen (R7); `pending`,
      `makePet`, `renderHome` existen en el fichero. Suite: `bun run test -- screens/home`.
- [ ] (2) Implementación mínima que lo pasa — en `home/index.tsx`: sustituir el
      `type PetHeroStatusTone` local por `import type { PetHeroStatusTone } from '../../components/pet-hero-header'`;
      calcular `connection` **fuera** de la rama de la tarjeta (una sola vez,
      `null` si el detalle no está `ok`) y pasar
      `status={connection ? { label: t(HOME_CONNECTION[connection].labelKey), tone: HOME_CONNECTION[connection].tone } : undefined}`
      al `<PetHeroHeader>` de `:249-257`. `home-hero-actions` intacto. Verde:
      `bun run test` completo del móvil.
- [ ] (3) Refactor con tests verdes — `collar-status` y la píldora leen el mismo
      `HOME_CONNECTION[connection]`; **sonda**: cruzar `labelKey` de `unknown` y
      `offline` → rojo R7 y R9 → restaurar. Evidencia en §R9 del progress.

---

## Bloque C — verificación y gate

### R10 — candados, deltas, grep-clean, mapa intacto (verificación, C4 vía (b))

- [ ] (1) No hay test nuevo: R10 asevera propiedades de lo que R1-R9 dejaron.
      Escribir en `progress/impl_pet-online-pill.md` §R10 la tabla de las 5
      sondas de [[requirements]] R10 con columna "visto en rojo (comando +
      línea)". Las sondas 1-4 ya se ejecutaron en los (3) de R4, R8 y R9 —
      referenciar; la 2 se ejecuta aquí (`DEVICE_ONLINE_THRESHOLD_MS − 1_000` →
      rojo `connectivity.spec.ts` `it` 1 → restaurar).
- [ ] (2) `git diff --name-only origin/main...HEAD` no lista `map.tsx`,
      `map.test.tsx`, `app/(tabs)/home.tsx`, `floating-tab-bar.tsx`,
      `docs/ui-guidelines.md`, `specs/mobile-pet-hero-header/design.md`,
      `specs/devices-claim/requirements.md`. Pegar la salida en §R10.
- [ ] (3) `./init.sh` verde desde la raíz (comprobar `pgrep` antes). Anotar
      "exit 0" y que ninguna suite que estaba verde quedó roja. Sin recuentos
      absolutos.

### R11 — gate humano: smoke en dev build de Android

- [ ] (1) Codex deja en `progress/impl_pet-online-pill.md` §R11 el guion literal
      de los 7 pasos de [[requirements]] R11 (con las dos sentencias SQL y los
      códigos `ACT-00x`) y una tabla de resultados vacía.
- [ ] (2) **Humano**: ejecuta el smoke en el dev build de Android y rellena la
      tabla. No delegable a IA.
- [ ] (3) **Leader**: solo con la firma del humano en §R11 y el veredicto del
      `reviewer`, `feature_list.json` #73 pasa a `done`.

---

## Cierre

- [ ] `specs/pet-online-pill/traceability.md` con hash rojo y hash verde por R
      (R3 comparte el verde de R2; R10 y R11 sin hash de test: evidencia y gate).
- [ ] `progress/impl_pet-online-pill.md` completo; `progress/current.md`
      cerrado según `AGENTS.md` §7.
- [ ] `git log --oneline origin/main..HEAD` muestra el patrón test → feat por
      requisito (C4).
- [ ] `gh pr create --title "feat(pet-online-pill): derive collar connectivity at read and show the status pill" --body …`
      enlazando `specs/pet-online-pill/` y los R-ids. **PARA**: el humano mergea.
