---
feature: "mobile-owner-timezone-dates"
status: spec_ready     # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-owner-timezone-dates]] (#90)

> Disciplina TDD, un bloque por requisito de [[requirements]]. **El orden importa**:
> cada rojo necesita que su sujeto ya exista (R1 antes que R3/R4, que lo consumen;
> R2 antes que R5, que usa la clave). Un par de commits por R (rojo → verde), C4.
>
> **Dónde**: worktree `/home/claude/sites/Pet-Tracker-wt-backend`, branch
> `feature/90-mobile-owner-timezone-dates` (`git branch --show-current` antes del
> primer commit). Rutas relativas a `mobile-pet-tracker/` salvo que se diga.
>
> **Antes de empezar** (trabajo móvil, `CLAUDE.md` + `docs/ui-guidelines.md`): cargar
> las skills `expo-overview` y `expo-data-fetching`. No se toca pantalla ni estilo,
> así que no hay skill de UI que cargar. Borrar
> `mobile-pet-tracker/.expo/types/router.d.ts` si existe (gitignorado; rompe `tsc`
> con rutas fantasma).
>
> **Comandos de test**, desde `mobile-pet-tracker/`:
> `bunx jest --runTestsByPath <ruta>` (rutas, `(tabs)` **sin** escapar), o filtro
> posicional escapado: `bunx jest 'src/app/\(tabs\)/__tests__/weight-log'`. Un filtro
> posicional sin escapar salta el fichero **en silencio con exit 0**: comprobar
> siempre que `Test Suites:` cuenta los ficheros esperados. Suite completa:
> `bun run test`. **Nunca medir con pipe** (`| tail` devuelve el código de `tail`).
> Guardar la salida de cada rojo en `progress/impl_mobile-owner-timezone-dates.md`.

---

## R1 — Helper `civilTodayIso`

Sujeto: nuevo. Casos (a)-(e) en [[requirements]] §R1; forma en [[design]] D2.

- [ ] **(1) Rojo** — `src/utils/civil-today-iso.test.ts` con
  `describe('#90 R1: civilTodayIso devuelve el día civil de una zona y cae al dispositivo')`
  y los cinco casos, **más** `src/utils/civil-today-iso.ts` como esqueleto que
  ignora `timeZone` y devuelve los componentes locales de `now` (para que el rojo no
  sea `Cannot find module`). Correr
  `bunx jest --runTestsByPath src/utils/civil-today-iso.test.ts`: (a) Kiritimati y
  (e) fallan por la fecha; (b), (c), (d) pasan.
  - Commit: `test(mobile-owner-timezone-dates): civilTodayIso resolves a civil day per zone and falls back to the device (R1)`
- [ ] **(2) Verde** — vía `Intl.DateTimeFormat('en-US', { timeZone, year, month, day })`
  + `formatToParts`, reensamblado `YYYY-MM-DD`, `try/catch` alrededor de todo; el
  `catch` devuelve los componentes locales. Los cinco casos pasan.
  - Commit: `feat(mobile-owner-timezone-dates): civilTodayIso with Intl formatToParts and device fallback (R1)`
- [ ] **(3) Refactor** — confirmar que no depende de `format()` ni del patrón de
  locale (grep `\.format(` en el fichero → 0); `bun run typecheck` limpio.

---

## R2 — Clave del catálogo + candado L1 + registro §2.5

Sujeto: `src/i18n/catalog.ts` y `src/providers/__tests__/language-provider.test.tsx`.

- [ ] **(1) Rojo** — en `language-provider.test.tsx`: `:55` gana `+ 1`
  (`toHaveLength(260 + 16 + 1 + 4 + 7 + 14 + 2 + 1)`), `:50` gana ` + 1 de #90`, y
  bloque nuevo `describe('#90 R2: el catálogo trae weightLog.dateCannotBeAfterToday en los dos idiomas y registrada en la tabla')`
  con `[['weightLog.dateCannotBeAfterToday', 'Date cannot be after today', 'La fecha no puede ser posterior a hoy']]`
  y la regex sobre `specs/mobile-ui-language/design.md`
  (`'\\| — \\| `' + escapeRegExp(key) + '`[^\\n]*← añadida por #90 \\(R2\\)'`),
  con la forma de `:64-89`. Correr
  `bunx jest --runTestsByPath src/providers/__tests__/language-provider.test.tsx`:
  longitud 304 ≠ 305 y clave `undefined`.
  - Commit: `test(mobile-owner-timezone-dates): the catalog must carry weightLog.dateCannotBeAfterToday (R2)`
- [ ] **(2) Verde** — añadir la clave al final del bloque `weightLog.` de `en`
  (`:116-128`) y de `es` (`:425-437`), y la fila
  `| — | `weightLog.dateCannotBeAfterToday` | `Date cannot be after today` | `La fecha no puede ser posterior a hoy` | ← añadida por #90 (R2)`
  al final de la tabla de `weight-log.tsx` en `specs/mobile-ui-language/design.md`
  §2.5 (`:386-407`). `language-provider.test.tsx` y `src/__tests__/ui-language.test.ts`
  verdes (**no** tocar aún `ui-copy-table.ts`: sin el `t()` en pantalla, `checkUses`
  se pondría rojo — eso es R5).
  - Commit: `feat(mobile-owner-timezone-dates): add weightLog.dateCannotBeAfterToday in both languages (R2)`
- [ ] **(3) Refactor** — `grep -c "^  '" src/i18n/catalog.ts` = 610 (base 608 + 2).

---

## R3 — Fecha por defecto en la zona del perfil (los tres puntos)

Sujeto: `src/app/(tabs)/weight-log.tsx` (`:39-44`, `:62`, `:70`, `:104`, `:95`,
`:188-189`) y `src/app/(tabs)/__tests__/weight-log.test.tsx`. Diseño en [[design]]
D1, D3, D5, D7.

- [ ] **(1) Rojo** — en `weight-log.test.tsx`, todo en un commit:
  - `jest.mock('../../../api/users', () => ({ getMe: jest.fn() }))`, `mockGetMe`,
    `makeProfile(timezone)` (nueve strings de `ProfileResponse`), `beforeEach` de
    **nivel de fichero** que arma `mockGetMe.mockResolvedValue({ kind: 'ok', me: makeProfile('Pacific/Kiritimati') })`.
  - Renombrar la copia `localTodayIso` (`:84-89`) a `deviceTodayIso` (la usará R4).
  - Fake timers + `setSystemTime(new Date('2026-09-17T23:30:00Z'))` +
    `afterEach(jest.useRealTimers)` en los `beforeEach` de `R3` (#63, `:125-136`) y
    `R9` (`:334-344`). Probar los argumentos de `useFakeTimers` **aquí** (con y sin
    `{ doNotFake: ['requestAnimationFrame'] }`) y anotar cuál se usó.
  - Las cuatro aserciones de la tabla de [[requirements]] §R3 → `'2026-09-18'`
    (las de `:355-357` y `:406-408` dentro de un `waitFor`), con sufijo ` (#90 R3)`
    en los cuatro títulos.
  - `describe('#90 R3: la fecha por defecto sale de la zona del perfil')` con el
    `it.each` del par Kiritimati/Pago_Pago (default, `getMe` con `(apiUrl, 'jwt-token')`,
    payload, reset tras `ok`), con `beforeEach` propio igual al de `R9` más el reloj.
  - Correr `bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/weight-log.test.tsx'`:
    fallan por la fecha (`'2026-09-17'` recibido) y por `mockGetMe` no llamado. Nada
    puede fallar por `ReferenceError`.
  - Commit: `test(mobile-owner-timezone-dates): the weight log default date must follow the profile zone (R3)`
- [ ] **(2) Verde** — en `weight-log.tsx`: imports de `getMe`, `userKeys`,
  `civilTodayIso`; `const me = useQuery({ queryKey: userKeys.me(), queryFn: () => getMe(baseUrl, token ?? '') })`;
  `profileTimeZone`; `measuredAtDraft: string | null` inicial `null`;
  `const measuredAt = measuredAtDraft ?? civilTodayIso(profileTimeZone)`;
  `setMeasuredAtDraft(null)` en el cleanup y tras `ok`; `value={measuredAt}`,
  `onChangeText={setMeasuredAtDraft}`; payload con `measuredAt`; **borrar**
  `localTodayIso`. Fichero de test entero verde.
  - Commit: `feat(mobile-owner-timezone-dates): derive the weight date from the profile zone via userKeys.me (R3)`
- [ ] **(3) Refactor** — `grep -rn "restaura los cuatro valores visibles tras el blur\|submits all fields, clears them, and refetches the list" specs/`
  y actualizar las filas de `specs/mobile-detail-screens-state-reset/traceability.md`
  y `specs/mobile-add-pet-photo-test-flake/traceability.md` con los títulos nuevos;
  `rg -n "localTodayIso" src` → 0 (C7).

---

## R4 — Fallback al dispositivo (verificación, mutación M4)

Sujeto: existe tras el verde de R3. Mutaciones en [[design]] §Mutaciones.

- [ ] **(1) Rojo** — en un commit: `describe('#90 R4: sin zona del perfil la fecha cae al dispositivo')`
  con (a) `pending()`, (b) `it.each` de `unreachable`/`error`/`missing-config`
  (ausencia de `weight-form-error` anclada a la aparición de `weight-input`), (c)
  `makeProfile('Not/A/Zone')`; esperado `deviceTodayIso()`; reloj de R3. **Más** M4-i
  (`'Pacific/Kiritimati'` en vez de `undefined` en `weight-log.tsx`) y M4-ii (sin
  `try/catch` en `civil-today-iso.ts`). Correr el fichero de `weight-log` y el de
  `civil-today-iso`: (a)(b) rojos por la fecha, (c) y R1(d) rojos por `RangeError`.
  Guardar la salida.
  - Commit: `test(mobile-owner-timezone-dates): mutate the zone fallback to prove the device path is locked (R4)`
- [ ] **(2) Verde** — revertir M4-i y M4-ii y nada más. Los dos ficheros verdes.
  - Commit: `feat(mobile-owner-timezone-dates): revert the fallback mutations, device path locked (R4)`
- [ ] **(3) Refactor** — `rg -n "Pacific/Kiritimati" src --glob '!*.test.*'` → 0.

---

## R5 — 400 de fecha futura traducido; formato crudo; candado L3

Sujeto: `weight-log.tsx:108-110`; clave de R2. Diseño D4.

- [ ] **(1) Rojo** — en un commit:
  - `weight-log.test.tsx:433-452` reescrito como
    `'joins backend validation messages, translating the future-date one (#90 R5)'`
    (mezcla crudo + traducido) e `it` nuevo
    `'keeps a malformed-date validation message raw (#90 R5)'` (`'Invalid ISO date'`).
  - `src/__tests__/ui-copy-table.ts`: fila `{ file: 'src/app/(tabs)/weight-log.tsx', key: 'weightLog.dateCannotBeAfterToday' }`
    al final del bloque `:136-153`; `ui-language.test.ts:133` → `toHaveLength(32 + 1)`
    con `// +1 #90 R5`, título `:132` → `33 ocurrencias`.
  - Correr `weight-log.test.tsx` y `src/__tests__/ui-language.test.ts`: join crudo,
    `checkUses` 0 ≠ 1, longitud 32 ≠ 33.
  - Commit: `test(mobile-owner-timezone-dates): the future-date 400 must render translated and the rest raw (R5)`
- [ ] **(2) Verde** — constante `MEASURED_AT_IN_FUTURE_MESSAGE` y el `map` con
  `path === 'measuredAt' && message === MEASURED_AT_IN_FUTURE_MESSAGE ? t('weightLog.dateCannotBeAfterToday') : message`;
  una sola llamada literal a `t('weightLog.dateCannotBeAfterToday')`. Ambos ficheros
  verdes. (Si el humano rechazó P1: sin constante, solo `path`, y sin el segundo `it`.)
  - Commit: `feat(mobile-owner-timezone-dates): translate the measuredAt future-date validation message (R5)`
- [ ] **(3) Refactor** — `bunx jest --runTestsByPath src/__tests__/ui-language.test.ts src/providers/__tests__/language-provider.test.tsx`
  verdes; ningún valor nuevo del catálogo aparece como literal en `weight-log.tsx`.

---

## R6 — Regresión `birthDate` (verificación, mutación M6)

Sujeto: `src/screens/add-pet/index.tsx:34-39` (no cambia) y
`src/screens/add-pet/index.test.tsx`. Diseño D6.

- [ ] **(1) Rojo** — en un commit: `describe('#90 R6: birthDate manda el día civil local del picker, no el UTC')`
  declarado tras `#72 R4` (`:402-419`), con `beforeEach` propio (armado de
  `:203-214` + reloj `23:30Z`), `mockCreatePet.mockResolvedValue({ kind: 'ok', … })`
  en el `it`, la fixture de getters sesgados, y la aserción
  `expect.objectContaining({ birthDate: '2026-09-17' })`. **Más** M6 (`dateToIso`
  con getters UTC). Correr `bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx`:
  rojo por `'2026-09-18'`. Ningún test del fichero puede fallar por
  `PICKER_MOCK_UNARMED`.
  - Commit: `test(mobile-owner-timezone-dates): mutate dateToIso to UTC to prove birthDate keeps the local civil day (R6)`
- [ ] **(2) Verde** — revertir M6 y nada más.
  `git diff origin/main..HEAD -- mobile-pet-tracker/src/screens/add-pet/index.tsx`
  **vacío**. Fichero verde.
  - Commit: `feat(mobile-owner-timezone-dates): revert the dateToIso mutation, birthDate regression locked (R6)`
- [ ] **(3) Refactor** — nada que refactorizar; confirmar que el `describe` nuevo no
  pulsa `add-pet-photo`.

---

## R7 — Verificación final

- [ ] `rm -f mobile-pet-tracker/.expo/types/router.d.ts`.
- [ ] Desde `mobile-pet-tracker/`, sin pipes, anotando cada exit code:
  `bun run typecheck`; `bun run lint`; `bunx jest --listTests | wc -l` (= S);
  `bun run test` (`Test Suites: … N total`, **N == S**).
- [ ] C8 grep-clean sobre los ficheros tocados:
  `rg -n "#[0-9a-fA-F]{3,8}\b|StyleSheet\.create|\[[0-9]+px\]" 'src/app/(tabs)/weight-log.tsx' src/utils/civil-today-iso.ts src/i18n/catalog.ts` → 0.
- [ ] `git diff origin/main..HEAD -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock` vacío;
  `git diff origin/main..HEAD --stat` = lista cerrada de [[design]] §Archivos afectados;
  diff vacío en los ficheros «que NO se tocan».
- [ ] Desde la raíz: `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep` vacío;
  `./init.sh ; echo "init exit=$?"` (sin pipe).
- [ ] Rellenar [[traceability]] (ninguna fila «pendiente») y escribir
  `progress/impl_mobile-owner-timezone-dates.md`: salidas de los rojos, evidencia de
  M4/M6, argumentos de `useFakeTimers` elegidos, tabla de R7, y el hueco para el
  smoke Android del humano ([[requirements]] §Gate humano). **El contenido va al
  fichero, no al chat.**
  - Commit: `docs(mobile-owner-timezone-dates): traceability, verification and implementation report (R7)`
