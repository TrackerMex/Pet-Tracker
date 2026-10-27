# Auditoría de firma delegada — #208 mobile-vaccine-create

- Spec: `specs/mobile-vaccine-create/` @ 7aed18da (branch feature/208-mobile-vaccine-create)
- Base: origin/dev 2041e2b3 (congelada: sin fetch ni checkout)
- Dependencia: #220 mobile-date-field, spec firmada en feature/220-mobile-date-field @ 504aee66 (sin mergear en dev)
- Auditor: subagente de solo lectura (no firma; decide el leader)
- Estado: TERMINADO. **9 fallos bloqueantes (F1–F9), 10 avisos (V1–V10).** Veredicto: no firmable tal cual;
  firmable tras aplicar las erratas del final, que son todas de texto y no reabren artboards ni copy.
- Sin cambios en ficheros tracked salvo este informe. Las pruebas de mutación están en
  `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/54341eda-28f1-4262-9348-c2fbc9852939/scratchpad/audit208/`
  (`mut.mjs`, salida en `out.txt`; se corre con `TZ=UTC node mut.mjs` y `TZ=America/Mexico_City node mut.mjs`).

## Resultados por punto

### A. Anclas con su cifra (checklist §4 punto 1; encargo punto 3) — OK, con avisos V1 y V2

Medidas con `grep -cF` desde `mobile-pet-tracker/src/` (y desde la raíz para R22) en el árbol congelado
(7aed18da; `origin/dev` 2041e2b3 es ancestro y el diff solo toca `specs/` y `progress/`):

- R1 (4), R3 (1), R4 (2), R5 (3), R6 (2), R15 (2), R16 (5, incluidas las dos en 0), R17 (1), R18 (1),
  R22 (2) y la evidencia de backend (`describe('R3: GET /v1/vaccine-catalog'` = 1): **todas dan la cifra
  declarada**. Las dos anclas negativas de R16 (`text-warning-strong` y `text-accent-strong` en
  `screens/health/index.tsx`) dan 0.
- Anclas **[#220]** (R10 ×3, R12 ×1, R15 ×1): en la base dan 0 porque el fichero no existe. Contra la rama
  `feature/220-mobile-date-field` (HEAD 41663fe9, leída con `git show`, sin tocar el worktree) dan **1** las
  cinco: `export function DateField`, `export function isoToLocalDate`, `export function localDateToIso`,
  `export function hhmmToLocalDate` y el literal `toLocaleDateString(locale, { day: 'numeric', month:
  'short', year: 'numeric' })` (date-field.tsx, en la línea del `display`). Esa rama no está terminada: la
  cifra definitiva **solo se puede medir tras mergear #220 en `dev`**, como ya dice design.md.
- Ninguna ancla depende de un número de línea.
- **V1 (aviso).** El ancla de R12 sobre `toLocaleDateString(...)` exige que el literal quepa en una línea de
  `date-field.tsx`. Hoy cabe, pero un `prettier` o un reflujo la parte en varias y da 0 sin que cambie el
  comportamiento. Es frágil; no bloquea. (Coincide con el hecho (f) del leader.)
- **V2 (aviso).** «miden 0 en 2041e2b3» es inexacto: `grep -cF` sobre un fichero ausente no imprime 0, sale
  con código 2 y un aviso. Cambia la redacción a «el fichero no existe en 2041e2b3».

### B. Contrato de DateField en R10 (hechos (a)–(f) del leader) — FALLO (F1, F2, F3)

Verificados contra `components/date-field.tsx` y `utils/civil-date.ts` de la rama #220 (41663fe9) y contra
la spec firmada de #220 (504aee66, §Contrato público de DateField):

- **(a) — FALLO F1.** DateField no reescribe `value` cuando queda por debajo de `minDate`: solo recorta el
  día con que abre el picker (`minimumDate={localNoon(minDate)}`). R10 (requirements.md:398-401) dice que
  una «Próxima dosis» elegida a mano «se conserva hasta el siguiente cambio de chip», también al mover
  `appliedAt`; y en «Otra vacuna» la próxima dosis nunca se recalcula. Resultado: aplicación 1 sep, próxima
  15 sep a mano, aplicación movida a 1 oct ⇒ se envía `nextDoseAt` < `appliedAt`. El backend no lo rechaza
  (el DTO estricto valida formato y longitudes, no el orden). No hay R ni `it` que lo cubra.
- **(b) — FALLO F2.** `${testID}-clear` se pinta solo con `allowClear && valid` (#220 R11; en el código,
  `{allowClear && valid && <InputGroup.Suffix>…`). El `it` de R10 «Otra vacuna» «Asserta que
  `vaccine-create-next-clear` existe solo en este modo» (requirements.md:421), pero en ese modo la próxima
  dosis **empieza en `null`**: el botón no existe hasta elegir una fecha. Escrito así, el test o falla o se
  satisface con un `queryByTestId` que no prueba nada.
- **(c) — FALLO F3.** La receta de R10 (requirements.md:413-415) dice `fireEvent(picker, 'onValueChange',
  {}, date)` «más `onDismiss`» sin nombrar de dónde sale `picker`. Según #220 el picker es
  `${testID}-picker` (`vaccine-create-applied-picker`, `vaccine-create-next-picker`), **solo se monta tras
  pulsar el disparador** (`${testID}`) y se desmonta tras `onValueChange` o `onDismiss`. Encadenar
  `onValueChange` y luego `onDismiss` sobre el mismo nodo falla (ya está desmontado). Además el `it`
  «empieza hoy… con máximo hoy» no asserta el máximo: solo mira `${testID}-value`. Falta también el `await`
  de RNTL 14 en `fireEvent` (regla de la memoria `rntl14-fireevent-asincrono`).
- **(d) — OK.** R15 ancla `combineDateAndTime` en `utils/reminder-dates.ts` (ya en dev, `grep` = 1) y
  `hhmmToLocalDate` como [#220] en `utils/civil-date.ts`. Las rutas son correctas.
- **(e) — OK.** R10 «Otra vacuna» usa «el placeholder por defecto de DateField («Elige una fecha»)», que es
  #220 R3. No duplica la clave i18n.
- **(f) — aviso V1** (sección A).

### C. Reglas móviles (encargo punto 2) — FALLO (F6, F7), avisos V3 y V4

- **Tokens y guardas de carta — OK salvo F7.** Las clases de R5–R18 pasan contra
  `chunky-cta-canvas-fidelity`, `consistency-classnames`, `legibility-classnames` y `design-drift` (grep de
  cada clase de color contra los guards; los tokens `text-13`, `rounded-tile`, `bg-category-amber`,
  `text-category-amber-strong` existen en `src/theme/global.css`). R21 lista las enmiendas de inventario con
  su regla mecánica.
- **Selectores de testID por prefijo — OK.** Los testID nuevos (`vaccines-header`, `vaccines-add`,
  `vaccines-empty-*`, `vaccine-chip-*`, `vaccine-create-*`, `vaccine-reminder-notice-*`) no caen bajo
  selectores por regex existentes salvo los que R21 ya enmienda (R3.3 y R8.1 de `chunky-cta`).
- **Copy literal — OK.** Cada R da es/en y clave; Voz B y términos mexicanos («Agregar», «Elige»,
  «Pregúntale»). R19 (+26 claves) y R20 (30 usos) cuadran entre sí.
- **Skills de Codex — OK.** Los nombres de design.md existen en `.claude/agents/leader.md` §Catálogo real de
  skills de Codex.
- **Sin dependencias nuevas — OK.** `@expo/ui`, `heroui-native` y `reicon-react-native` ya están; `Plus`,
  `InfoCircle`, `Bell`, `BellOff`, `AlertTriangle` y `Syringe` existen en su `index.d.ts`.
- **Mocks prescritos por intención — FALLO F6.** El doble de `reicon-react-native` de
  `screens/health/index.test.tsx` (líneas 77-91 hoy) es **cerrado**: solo devuelve `Check`, `ChevronRight`,
  `Clock`, `HeartPulse` y `Syringe`. R5 (`<Plus size={16}>`, requirements.md:220), R6 (`<Plus size={20}>`,
  :259) y R16 en Salud (`<BellOff size={20}>`, :605) pintan iconos que el doble no tiene: resuelven a
  `undefined` y el render revienta con «Element type is invalid» en **todos** los `it` de Salud, no solo en
  los nuevos. La spec no lo prescribe y Codex lo descubre a ciegas.
- **Toque mínimo — FALLO F7.** Los chips de R8 son `h-9.5` (38 pt) sin `hitSlop`. La carta exige
  «touch target ≥ 44pt» (`docs/ui-guidelines.md:278`) y el precedente directo, los `type-chip` de
  `add-reminder` (línea 170), declaran `hitSlop={TOUCH_SLOP}` (`theme/touch-target`).
- **V3 (aviso).** `vaccines-add` es `h-10` (40 pt) sin `hitSlop`. Tiene precedente aceptado
  (`reminders-add-link`, misma receta compacta sin `hitSlop`), por eso no bloquea; conviene alinearlo con F7.
- **V4 (aviso).** El handler `openVaccineCreate` solo aparece en R21 (fila `CTA_ROWS`, requirements.md:778,
  que exige el literal `onPress={openVaccineCreate}`). R5 y R6 no lo nombran: si Codex lo llama distinto,
  la guarda de R21 sale roja al final. Nombrarlo en R5 y R6.

### D. Tests y candados (encargo punto 4) — FALLO (F4, F5), aviso V7

- **Un test por R-id con prefijo `#208 R<n>` — OK.** R1–R22 tienen al menos un `it` con título literal;
  traceability.md tiene las 22 filas en «pendiente» (R19 enmienda `#194 R1`).
- **Mutaciones (≥ 3), resultados de `mut.mjs`:**

| Mutación | Filas de la spec, TZ=UTC | Filas de la spec, TZ=Mexico_City | Filas propuestas |
|---|---|---|---|
| R2 M1: sin recorte (desborde de `Date.UTC`) | ROJO | ROJO | ROJO |
| R2 M2: acarreo en base 1 (`mm = total % 12 \|\| 12`) | **verde: sobrevive** | **verde: sobrevive** | ROJO (`2026-11-30+1 = 2027-12-30`) |
| R2 M3: `new Date(iso)` y getters locales | **verde: sobrevive** | ROJO | verde en UTC, ROJO en Mexico_City |
| R3: sin `trim()` | ROJO | — | — |
| R14: `nextDoseAt: null` en el cuerpo | ROJO | — | — |
| R14: `vetName: ''` en vez de omitir | ROJO | — | — |
| R15: `setUTCHours(9)` en vez de 09:00 locales | **verde: sobrevive** | ROJO (`…T15:00:00.000Z`) | — |
| R15: 10:00 en vez de 09:00 | ROJO | ROJO | — |

- **Tablas de fechas que cruzan mes y año — FALLO F4.** Las seis filas de R2 cruzan año una sola vez con
  resultado en enero y ninguna da un resultado **en diciembre**: la mutación M2 (el error clásico de
  acarreo en base 1) pasa en verde. Tampoco hay un 29 de febrero de origen.
- **Sin dependencia de la zona del proceso — FALLO F5.** R2 promete «No depende de la zona horaria del
  proceso» (requirements.md:148) sin candado, y el literal de R15 `new Date(2027, 9, 6, 9, 0, 0, 0)` se
  evalúa en la misma zona que la implementación. La VPS corre en UTC: M3 sobrevive a R2 y `setUTCHours(9)`
  sobrevive a R15. Asignar `process.env.TZ` dentro de jest no cambia `Date` (memoria
  `jest-process-env-tz-ciego`); hay que usar `process.getBuiltinModule('process').env.TZ`.
- **V7 (aviso).** El título `#208 R2: suma %i meses a %s y da %s` pone `months` primero y la tabla pone
  `iso` primero. Con `it.each` posicional, las filas deben ser `[months, iso, esperado]`. Si no, el título
  sale «suma 2026 meses a 12…» (`%i` hace `parseInt` sobre la cadena). Decir el orden de la fila.

### E. Coherencia con las respuestas de diseño y el backend (encargo punto 5) — OK, avisos V5, V6, V8, V10

- **Q4 (09:00 locales) — OK.** R15 fija 09:00 del día de la próxima dosis, `advanceMinutes: 0`, solo si es
  posterior a hoy.
- **Q5 (solo el owner) — OK.** R5 y R6 ocultan el alta a `family`, `vet` y `walker` (`it.each` de tres
  roles). El backend exige `@RequirePetRole('owner')` en el POST y `createReminder` también es solo owner.
- **Q6 (términos mexicanos) — OK.**
- **«Otra vacuna» — OK.** Nombre obligatorio con `trim` (R3), `nextDoseAt` omitido si es `null` (R14),
  `allowClear` solo en este modo (R10).
- **DTO del backend — OK.** Límites 120/120/2000, `trim` y omisión de opcionales vacíos cuadran con el zod
  estricto. Catálogo con `?species=`.
- **V5 (aviso).** El `@Get()` del catálogo devuelve `this.listCatalog.execute(...)`, un **array JSON
  desnudo** (el e2e lo lee como `response.body as Array<…>`). R1 no lo dice; Codex puede esperar
  `{ items }`. Añadir «el 200 es un array JSON, sin envoltorio».
- **V6 (aviso).** `Pet.species` es `string` en `api/types.ts:70`; la leyenda de R7 y el catálogo solo
  cubren perro y gato. Falta decir qué pasa con otra especie (catálogo vacío ⇒ solo «Otra vacuna»).
- **V8 (aviso).** R18 con `errors: []` (p. ej. `VACCINE_SPECIES_MISMATCH`) cae en el texto genérico
  `checkDetails`. Es correcto, pero conviene decirlo para que no se trate como caso sin cubrir.
- **V10 (aviso).** El plan habla de «toast» y la spec de «aviso» ámbar persistente (R16). Lo justifica el
  artboard; no bloquea.

### F. Canvas contra requisitos, en los dos sentidos (encargo punto 6) — OK

- Todo lo dibujado en `canvas/*.dc.html` tiene R (cabecera de Salud con `vaccines-add`, tarjeta vacía con
  CTA, chips, nombre libre, fechas, nota de esquema, tarjeta de recordatorio, campos opcionales, CTA, aviso
  ámbar y alerta rosa) y todo R visual tiene artboard.
- Copy y dimensiones coinciden: 104/16, 24, 22/18/18, 56, 17, 38, 52 y el borde discontinuo de
  «Otra vacuna».
- Desviaciones declaradas y razonadas: el orden de los chips (el de la API) y la altura de DateField (48 de
  #220 frente a 52 del artboard).

### G. Componentes compartidos y solapes con #209 y #220 (encargo punto 7) — FALLO (F8)

- **Sin fork de DateField — OK.** #208 solo consume `DateField` y `civil-date` de #220; no crea componentes
  compartidos ni pisa props.
- Ficheros que crea: `app/pets/[petId]/vaccines/new.tsx`, `screens/vaccine-create/index.tsx` y su test,
  `utils/vaccine-dates.ts` y su test, `hooks/vaccine-reminder-notice.ts`. Ficheros que toca:
  `api/health-records.ts`, `api/types.ts`, `api/query-keys.ts`, `utils/form-rules.ts`, `app/_layout.tsx`,
  `screens/health/index.tsx`, `i18n/catalog.ts`, los inventarios de test y `init.config.sh`.
- **#220 — OK.** Los solapes (suma de `language-provider`, `ui-copy-table`, `SCREEN_FILES`) son aditivos y
  la precondición es `git merge origin/dev`, nunca `rebase`.
- **#209 — FALLO F8.** La spec de #209 (wt-209 @ 7864ea9e, requirements.md:178-179) añade
  `<Stack.Screen name="nutrition-profile" …/>` en `app/_layout.tsx` «junto a la de `meal-schedule`». R4 de
  #208 ancla la pantalla a un **índice absoluto** («en el índice 13», «de 14 a 15 hijos», «decimocuarta»).
  La que mergee segunda rompe el `it` de la otra aunque las dos sean correctas. El resto del solape con #209
  (`api/types.ts`, catálogo, `ui-copy-table`, `CTA_ROWS` +2, `consistency` `#62 R1` y `#62 R14`) es
  aditivo y lo cubre la regla mecánica de R21 al re-medir tras el merge.

### H. Gates humanos y casillas (encargo punto 8) — FALLO (F9)

- Una sola casilla de aprobación (requirements.md:872), que bloquea todas las tareas: OK. Con la firma
  delegada la marca el leader.
- Ningún test lee una casilla, así que la regla `[ xX]` no aplica.
- G1 del plan está `[x]` (canvas v140).
- **FALLO F9.** «Fuera de alcance» (requirements.md:868) remite el smoke en dispositivo a «gates humanos
  del plan», pero G4 de `progress/plan_mejoras-producto-2026-10-26.md` §5 apunta a
  `progress/smoke_mejoras-producto.md`, que no existe, y su alcance no incluye #208. No hay ninguna casilla
  donde el humano firme el smoke de #208, y lo que solo se ve en dispositivo (picker nativo, teclado sobre
  notas, notificación a las 09:00) queda sin gate.

### I. Supuestos de entorno (encargo punto 9) — OK, aviso V9

- `@expo/ui` ya está en el dev build: no hace falta rebuild (G3 no aplica).
- Teclado: `KeyboardAvoidingView` con `behavior="padding"`, según la memoria `teclado-edge-to-edge-kav`.
- `seed:vaccines` en `E2E_SETUP_CMD` (R22) con su test `init-e2e-gate.test.mjs`.
- Zona horaria: ver F5.
- **V9 (aviso).** R15 compara con `civilTodayIso(profileTimeZone)` (zona del perfil) pero construye `dueAt`
  en la zona del dispositivo. Si difieren, «hoy» y «09:00» son de zonas distintas. Está declarado; no
  bloquea.

### J. Checklist §4 consolidada (encargo punto 1)

`progress/plan_canvas-parity-2026-10-23.md` §4:

- Anclas con su cifra: OK (A).
- Un test por R-id y trazabilidad: OK (D).
- Candados que matan mutaciones: **FALLO** (F4, F5).
- Guardas de carta: OK salvo **F7**.
- Copy literal desde R: OK (C).
- Artboards congelados: OK (F).
- Ninguna decisión abierta para Codex: **FALLO** (F1, F2, F3, F6, F8).
- Sin coste ni dependencias nuevas: OK.

`progress/plan_mejoras-producto-2026-10-26.md` §4: sus puntos añadidos son de backend (migración, límite de
IA, prompt). #208 es solo móvil y consume endpoints ya en dev: N/A.

## Erratas propuestas

Todas son cambios de texto en la spec. No tocan artboards ni copy, así que no reabren G1.

**F1 — R10, próxima dosis anterior a la aplicación.** `specs/mobile-vaccine-create/requirements.md`.

- Texto actual (líneas 399-401):
  ```
  - La propuesta se recalcula al cambiar de chip o de `appliedAt`, salvo que el
    usuario haya elegido «Próxima dosis» a mano después del último cambio de chip.
    Entonces su elección se conserva hasta el siguiente cambio de chip.
  ```
- Añadir debajo:
  ```
  - WHEN `appliedAt` cambia y la «Próxima dosis» vigente queda anterior a `appliedAt`,
    THE SYSTEM SHALL descartarla, en los dos modos: con catálogo vuelve a
    `addCalendarMonthsIso(appliedAt, entry.scheme.boosterMonths)`; con «Otra vacuna» vuelve a `null`.
  ```
- Y en la lista de tests de R10, tras la línea 421:
  ```
  - `#208 R10: si la fecha de aplicación supera la próxima dosis elegida, esta vuelve a la propuesta o a vacía`.
    Aplicación 1 sep 2026, próxima 15 sep 2026 a mano, aplicación 1 oct 2026: con catálogo
    `vaccine-create-next-value` pasa a la propuesta; con «Otra vacuna» queda vacío.
  ```

**F2 — R10, botón de borrar.** `specs/mobile-vaccine-create/requirements.md`, línea 421.

- Texto actual: ``    Asserta que `vaccine-create-next-clear` existe solo en este modo.``
- Texto nuevo:
  ```
      Con valor `null` no existe `vaccine-create-next-clear` (#220 R11). Tras elegir una fecha existe;
      pulsarlo deja `vaccine-create-next-value` vacío. Con catálogo y fecha válida no existe.
  ```

**F3 — R10, receta del picker.** `specs/mobile-vaccine-create/requirements.md`.

- Texto actual (líneas 413-415):
  ```
  - Test: `screens/vaccine-create/index.test.tsx`. Se usa el arnés de `@expo/ui`
    de `add-reminder/index.test.tsx`: `fireEvent(picker, 'onValueChange', {}, date)`
    más `onDismiss`.
  ```
- Texto nuevo:
  ```
  - Test: `screens/vaccine-create/index.test.tsx`. Se usa el arnés de `@expo/ui`
    de `add-reminder/index.test.tsx` con los testID de #220: el picker solo existe tras
    `await fireEvent.press(getByTestId('vaccine-create-applied'))`, y entonces
    `await fireEvent(getByTestId('vaccine-create-applied-picker'), 'onValueChange', {}, new Date(2026, 8, 1, 12))`
    cambia el valor y lo desmonta. Ídem `vaccine-create-next` y `vaccine-create-next-picker`.
    `onDismiss` solo para cerrar sin elegir, nunca después de `onValueChange`.
  ```
- En la línea 417, tras «Asserta `${testID}-value` con `value` «6 oct 2026» y «6 oct 2027».», añadir:
  «Tras abrirlo, `vaccine-create-applied-picker` tiene `maximumDate` igual a `new Date(2026, 9, 6, 12)`
  (mediodía local, contrato de #220).»

**F4 — R2, filas que cruzan año con resultado en diciembre.** `specs/mobile-vaccine-create/requirements.md`.

- Tras la fila actual ``| `2026-11-30` | 3        | `2027-02-28` |``, añadir:
  ```
  | `2026-12-31` | 2        | `2027-02-28` |
  | `2024-02-29` | 12       | `2025-02-28` |
  | `2026-11-30` | 1        | `2026-12-30` |
  ```
- En `specs/mobile-vaccine-create/tasks.md`, línea 45: cambiar `seis filas` por `nueve filas`.

**F5 — Zona del proceso sin candado.** `specs/mobile-vaccine-create/requirements.md`.

- Texto actual (línea 148): `- No depende de la zona horaria del proceso.`
- Texto nuevo:
  ```
  - No depende de la zona horaria del proceso. Candado: un segundo `it`
    `#208 R2: la tabla da lo mismo en America/Mexico_City` recorre las mismas filas tras
    `process.getBuiltinModule('process').env.TZ = 'America/Mexico_City'` y restaura el valor previo en
    `afterEach`. Asignar `process.env.TZ` dentro de jest no cambia `Date`.
  ```
- Texto actual (líneas 571-572):
  ```
      El `dueAt` esperado se calcula en el test como
      `new Date(2027, 9, 6, 9, 0, 0, 0).toISOString()`, un literal y no el helper.
  ```
- Añadir debajo:
  ```
    - `#208 R15: el dueAt sigue la hora local del dispositivo`: con la zona fijada como en R2
      antes de montar la pantalla, espera el literal `'2027-10-06T15:00:00.000Z'`.
  ```

**F6 — Doble de iconos de Salud.** `specs/mobile-vaccine-create/requirements.md`, en R5 bajo la línea 234
(`- Test: \`screens/health/index.test.tsx\`:`), añadir como primera viñeta:

```
  - Enmienda del doble: el mock cerrado de `reicon-react-native` de este fichero (hoy `Check`,
    `ChevronRight`, `Clock`, `HeartPulse` y `Syringe`) gana `Plus: icon('health-icon-plus')` y
    `BellOff: icon('health-icon-bell-off')`. Va en el commit rojo de R5 y sirve también a R6 y R16.
```

**F7 — Toque mínimo de los chips.** `specs/mobile-vaccine-create/requirements.md`.

- Texto actual (líneas 328-329):
  ```
  - Cada entrada es un `Pressable` `vaccine-chip-${entry.id}` con
    `accessibilityRole="button"` y `accessibilityState={{ selected }}`.
  ```
- Texto nuevo:
  ```
  - Cada entrada es un `Pressable` `vaccine-chip-${entry.id}` con
    `accessibilityRole="button"`, `accessibilityState={{ selected }}` y `hitSlop={TOUCH_SLOP}`
    (de `theme/touch-target`, como `type-chip` de `add-reminder`). También `vaccine-chip-other`.
  ```
- En el `it` `#208 R8: pulsar un chip lo selecciona…` (línea 354), añadir: «Asserta `props.hitSlop`
  igual a `TOUCH_SLOP`, importado de producción.»

**F8 — R4 con índice absoluto.** `specs/mobile-vaccine-create/requirements.md`.

- Línea 192: «- Va justo después de `meals-history` y antes de `edit-profile`, en el índice 13.» pasa a
  «- Va justo después de `meals-history`.»
- Línea 193: «- El grupo pasa de 14 a 15 hijos.» pasa a «- El grupo gana un hijo (los `+ 1 // #208 R4`).»
- Línea 199: «…la pantalla de alta de vacuna es la decimocuarta protegida y no pinta cabecera nativa» pasa a
  «…la pantalla de alta de vacuna va justo tras meals-history y no pinta cabecera nativa».
- Línea 200: «Asserta el `name` en el índice 13» pasa a
  «Asserta `names.indexOf('pets/[petId]/vaccines/new') === names.indexOf('meals-history') + 1`».
- En `specs/mobile-vaccine-create/tasks.md`, línea 55: «en el índice 13» pasa a «tras `meals-history`».

**F9 — Casilla del smoke de #208.** `specs/mobile-vaccine-create/requirements.md`, tras la línea 872
(`- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar`), añadir:

```
- [ ] Smoke de #208 en dev build por el humano (fecha: ____): picker nativo de las dos fechas, teclado con
      KAV en notas, recordatorio a las 09:00 locales. No bloquea tareas; bloquea `done`.
```

La alternativa es añadir #208 al alcance de G4 en `progress/plan_mejoras-producto-2026-10-26.md` §5 y
crear `progress/smoke_mejoras-producto.md` con su casilla.

**Avisos, opcionales y sin bloqueo:**

- V2: línea 77, «miden 0 en 2041e2b3» pasa a «el fichero no existe en 2041e2b3».
- V4: nombrar `onPress={openVaccineCreate}` en R5 y R6.
- V5: añadir a R1 «el 200 es un array JSON, sin envoltorio».
- V7: añadir a R2 «cada fila es `[months, iso, esperado]`».
