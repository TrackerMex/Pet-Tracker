---
feature: "pet-lost-mode"
issue: 45
branch: "feature/45-pet-lost-mode"
revisado: "origin/feature/45-pet-lost-mode @ 1bc6f07"
fecha: 2026-08-27
veredicto: APROBADO_CON_CONDICIONES
---

# review: pet-lost-mode (#45)

Fecha: 2026-08-27
Veredicto: **APROBADO CON CONDICIONES**

Revisado en worktree detached propio sobre `origin/feature/45-pet-lost-mode`
(HEAD `1bc6f07`). El commit local ajeno `5f74fc6` del checkout principal
quedó fuera del alcance, como indicó el leader.

La implementación es correcta y está verificada de punta a punta: `./init.sh`
re-ejecutado por el reviewer da exit 0, R1–R7 hacen lo que la spec dice, la
contención de R8 se respeta al pie de la letra y el grep C8 sale limpio. La
**única condición bloqueante es documental** (fila R4 de trazabilidad cita un
commit vacío) y no requiere tocar código ni volver a testear.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` (`pet-lost-mode`; `init.sh` lo confirma)
- [x] `progress/current.md` describe la sesión activa (implementer = Codex)
- [x] `feature_list.json` mantiene #45 en `in_progress` — correcto, R9 sigue abierto
- [x] `STATUS.md` sincronizado con `feature_list.json` (46/51)

## Checklist C3 — Arquitectura

- [x] `domain` sin imports de `infrastructure` — el cambio en domain es una
      línea en la interfaz `PetFieldChanges` (`lostMode?: boolean`)
- [x] Los contratos en domain siguen siendo interfaces puras
- [x] `application` depende solo de interfaces: `SetLostModeUseCase` inyecta
      `PET_REPOSITORY` y `AUDIT_LOGGER` por token, nunca la clase Drizzle
- [x] `infrastructure` sin lógica de negocio: el handler replica exactamente el
      patrón del `PATCH` (`parseBody` → use case → `toPetProfileResponse` →
      `mapPetError`)
- [x] `PetDrizzleRepository.update` no necesitó cambios: hace `set({...changes,
      updatedAt: new Date() })`, así que `lostMode` persiste y `updated_at` se
      refresca sin código nuevo (R1)

## Checklist C4 — TDD

- [x] Cada `R<n>` tiene al menos un test que lo nombra:
      - R1 `set-lost-mode.use-case.spec.ts::R1: set lost mode persiste y audita`
        + `pet-lost-mode.e2e-spec.ts::R1: owner activa y desactiva lost mode`
      - R2 `::R2: solo el owner puede togglear lost mode`
      - R3 `set-lost-mode.dto.spec.ts::R3: SetLostModeSchema valida enabled`
        + `::R3: body invalido es 400 y PATCH no toca lostMode`
      - R4 `::R4: el perfil refleja lost mode en detalle y lista`
      - R5 `pets.test.ts::R5: setLostMode contra el endpoint real`
      - R6 `map.test.tsx::R6: owner toglea lost mode contra el endpoint`
      - R7 `map.test.tsx::R7: no-owner deshabilitado y error visible`
      - R8 sin test propio **por diseño de la spec** (requisito de verificación)
- [x] El historial muestra test-primero real, **no** un "todo en uno"

**Orden real verificado commit a commit** (el rango del leader empezaba en
`b9a4ac7`, pero `b9a4ac7` *es* el commit rojo de R1, no la base; la base real
es `aed30ac`):

```
b9a4ac7  test R1 (rojo)   ← use-case.spec + e2e-spec, importa SetLostModeUseCase inexistente
739c582  test R2 (rojo)
8a19603  test R3 (rojo)
bda3b38  test R4 (rojo)
aeed8dc  feat R1 (verde)  ← primer commit de implementación
b8e0cd7  feat R2
e3c64a7  feat R3
d0299ce  test R4 "verify"  ← COMMIT VACÍO (ver Observación 1)
566633a  test R5 (rojo) → e79f234 feat R5
81fc2df  test R6 (rojo) → 322c48d feat R6
f8f17f7  test R7 (rojo) → 75835d8 feat R7
d2c217b  revert del chore de skills ajeno
21445b3  fix R8
```

Los cuatro rojos de backend van agrupados **antes** del primer `feat`, no
intercalados uno a uno. Es un lote rojo→lote verde, no el ciclo ideal, pero
cumple C4: cada test rojo se commiteó antes de su implementación y el rojo era
genuino (`b9a4ac7` importa `SetLostModeUseCase` y `POST /lost-mode`, que no
existían hasta `aeed8dc`). R5–R7 sí van en pares estrictos rojo→verde.

## Checklist C5 — Trazabilidad

- [x] `traceability.md` existe; R1–R8 con test y commit citados
- [ ] **La fila R4 cita `d0299ce`, que es un commit vacío** (ver Observación 1)
- [x] R9 figura como `pendiente` — **correcto, no es incumplimiento**: es el
      gate humano declarado en `requirements.md` §Aprobación
- [x] Commits siguen el formato `feat(<scope>): <desc> (R<n>)`

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved`
- [x] Casilla "Aprobado por humano" marcada con fecha 2026-08-26
- [x] Ningún requisito R1–R9 fue modificado después de la aprobación
      (`git diff origin/main...HEAD -- specs/pet-lost-mode/requirements.md`
      no altera los requisitos)

## Checklist C7 — Sin código huérfano

- [x] El stub R10 de `#36` (botón `Coming soon`) fue **reemplazado**, no
      duplicado: el `<Text>Coming soon</Text>` se eliminó de `map.tsx`
- [x] Su test también: el describe `'R10: lost mode es stub deshabilitado'`
      desapareció, sustituido por los describes R6 y R7
- [x] Sin importadores huérfanos: cero referencias a `Coming soon` en el tab Map

## Checklist C8 — UI móvil (carta de UI)

Grep-clean ejecutado por el reviewer sobre `mobile-pet-tracker/src` (producción):

- [x] `hex fuera de src/theme/` = **0**
- [x] clases arbitrarias `[...]` = **0**
- [x] `StyleSheet.create` = **0**
- [x] shadow/elevation legacy = **0**
- [x] Componentes compartidos reutilizados: usa `Button`/`Button.Label` de
      heroui-native y tokens (`text-danger`, `bg-danger-soft`,
      `border-danger/20`), sin fork local
- [x] Sin animación nueva (la carta no la pedía para un toggle)
- [x] **El tab Map sigue siendo fat-route**: no se migró a `src/screens/`,
      como la spec exigía explícitamente

## Verificación por requisito

- **R1** — `POST /v1/pets/:petId/lost-mode` con `{enabled}` persiste y devuelve
  `PetProfileResponse`. El e2e comprueba persistencia, refresco de `updatedAt`,
  idempotencia (3 auditorías `pet.lost_mode` con `{enabled:true}`,
  `{enabled:true}`, `{enabled:false}`) y la fila real en DB. ✔
- **R2/R7 backend** — owner-only vía `@UseGuards(PetAccessGuard)` +
  `@RequirePetRole('owner')`, mismo camino que PATCH/DELETE. El e2e cubre
  family/walker/vet → 403 **sin persistir ni auditar**, no-miembro → 404,
  mascota inexistente → 404, `:petId` malformado → 404, sin token → 401. ✔
- **R3** — `SetLostModeSchema = z.object({ enabled: z.boolean() })`; el spec
  unitario rechaza ausente/string/null/número y verifica el strip de claves
  extra. El e2e además confirma que `PATCH` con `lostMode` **sigue siendo
  no-op** (`lostMode` queda `false` en respuesta y en DB). ✔
- **R4** — el perfil refleja `lostMode` en detalle y lista para otro rol activo,
  y el test compara `Object.keys(...).sort()` contra `profileKeys`, así que el
  contrato no gana ni renombra claves. ✔
- **R5** — `setLostMode` en `src/api/pets.ts` devuelve los seis `kind` exactos
  de la spec vía `postJson` + `isPetProfile`. ✔
- **R6** — label alterna `Activate`/`Deactivate` según `lostMode`, `Coming soon`
  eliminado, press postea la negación, `isDisabled` durante el vuelo,
  `pets.refetch()` al `kind:'ok'`. El union `myRole` de `api/types.ts` quedó
  corregido a `'owner' | 'family' | 'walker' | 'vet'`. ✔
- **R7 móvil** — no-owner: botón **visible y deshabilitado, no oculto**
  (`isDisabled={!canSetLostMode || lostModeBusy}` +
  `accessibilityState={{disabled: ...}}`), y el handler hace `return` temprano
  si `myRole !== 'owner'`, así que no llama la API. Error
  `Could not update Lost Mode` con `testID="lost-mode-error"`, `selectable`,
  clase `text-danger`; se limpia con `setLostModeFailed(false)` al siguiente
  press. ✔
- **R8** — ver contención abajo. ✔
- **R9** — **pendiente del humano**, correctamente registrado como tal en
  `traceability.md`, `impl_pet-lost-mode.md` §Handoff humano y en la segunda
  casilla de `requirements.md`. No evaluado. ⏳

## Contención y alcance (R8)

- `git diff origin/main...HEAD --name-only` cae **exactamente** dentro de la
  allowlist de R8 (código + `specs/`, `progress/`, `feature_list.json`).
  Rutas inesperadas: **0**.
- `git diff --check origin/main...HEAD` → exit 0.
- **Sin scope creep**: `grep -rniE 'lostmode|lost_mode'` sobre
  `backend-pet-tracker/src` da **0 referencias fuera del módulo pets y del
  schema**. No hay efectos automáticos en alerts, positions, polling ni
  notificaciones — exactamente lo que la spec pone fuera de alcance.
- **Tests existentes intactos**: en `map.test.tsx` el único bloque sustituido es
  el describe R10; el resto del diff son el import, la entrada `setLostMode` en
  el `jest.mock` y el `mockSetLostMode`, mecánicamente necesarios y sin tocar
  ninguna aserción previa. En `pets.test.ts` la única línea eliminada es el
  import (81 añadidas, 1 eliminada). `pets.controller.spec.ts` **nunca se tocó**.
- **`21445b3` (fix tardío R8) no relaja ninguna aserción.** Lo que rompía:
  `pets.controller.spec.ts::buildController()` construye `new PetsController(...)`
  con 5 argumentos, y el 6º (`SetLostModeUseCase`) lo dejaba inválido en
  typecheck. Como R8 prohíbe tocar ese archivo, Codex hizo el parámetro
  opcional. El resto del diff de ese commit sobre el e2e es **puro reformateo de
  prettier** (saltos de línea): `toBeGreaterThan`, `toHaveLength(1)` y los
  `objectContaining` siguen idénticos. Verificado línea a línea.
- **Revert `d2c217b` limpio**: `git ls-tree -r HEAD` no lista **ningún**
  archivo de `.agents/` ni `skills-lock.json`, y el diff neto
  `a95dab8^..d2c217b` solo contiene trabajo de #45. La rama no deja rastro del
  commit de skills ajeno.

## Observaciones

### 1. BLOQUEANTE (documental) — `d0299ce` es un commit vacío

`d0299ce test(pet-lost-mode): verify profile visibility (R4)` **no tiene diff
alguno** (`git show --numstat` no devuelve nada; es el único commit vacío de la
rama). Sin embargo:

- `specs/pet-lost-mode/traceability.md` lo cita como el commit de R4.
- `progress/impl_pet-lost-mode.md` §Evidencia TDD lo presenta como el "verde"
  de R4, emparejado con el rojo `bda3b38`.

Un commit vacío no es un paso verde. La historia real de R4 es honesta —
`bda3b38` añade el test rojo y R4 pasa a verde con `aeed8dc` (la persistencia
de R1) más el mapper preexistente, sin implementación propia — pero la tabla la
documenta mal. Es un defecto del rastro de auditoría, no del código.

**Corrección exigida antes de `done`** (solo markdown, sin retest):
- En `traceability.md`, fila R4 → citar `bda3b38 test(pet-lost-mode): define
  profile visibility in red (R4)` y `aeed8dc` como el commit que la pone verde.
- En `impl_pet-lost-mode.md`, fila R4 de la tabla TDD → rojo `bda3b38`, verde
  `aeed8dc` (R4 no requirió implementación propia), y decirlo explícitamente.

### 2. No bloqueante (diseño) — dependencia opcional en el controller

`21445b3` dejó en producción:

```ts
private readonly setLostMode?: SetLostModeUseCase,
...
if (!this.setLostMode) {
  throw new Error('SetLostModeUseCase is not configured');
}
```

Es código defensivo muerto: `pets.module.ts` siempre provee el use case y Nest
lo inyecta igual (el `?` de TypeScript no altera `design:paramtypes`), como
prueban los 7 e2e contra la app real. El `?` existe solo para que un test
histórico pueda construir el controller con 5 argumentos.

No incumple ningún checkpoint y fue la salida **correcta** dado que R8 prohibía
tocar `pets.controller.spec.ts` — la restricción viene de la spec, no de una
mala decisión de Codex. Pero deja el contrato de DI debilitado de forma
permanente para complacer a un fixture de test.

**Follow-up sugerido** (fuera de #45): volver el parámetro obligatorio, borrar
el `throw`, y añadir el 6º mock en `buildController()`.

### 3. Menor — frontmatter de `traceability.md`

Dice `status: draft`. C6 se evalúa sobre `requirements.md` (que sí está
`approved`), así que no bloquea, pero conviene alinearlo al cerrar.

### 4. Aviso para el humano (R9) — dev build, no Expo Go

El encabezado de R9 pide el smoke **en el dev build de Android**, pero los pasos
de la propia spec (y el §Handoff del impl report) dicen `bunx expo start --go`.
Desde 2026-08-25 el camino es Android Studio + dev build local. El humano debe
correr el smoke en el **dev build**, ignorando la instrucción `--go` heredada.
No es un defecto de la implementación: viene en la spec ya aprobada.

## Condiciones para pasar a `done`

1. Corregir la fila R4 en `traceability.md` y en `impl_pet-lost-mode.md`
   (Observación 1). Bloqueante — es paperwork, no código.
2. El humano ejecuta el smoke R9 en el **dev build de Android**, registra el
   resultado en `progress/impl_pet-lost-mode.md`, actualiza la fila R9 de
   trazabilidad y marca la segunda casilla de `requirements.md` §Aprobación.

Cumplidas ambas, la feature puede marcarse `done` sin nueva revisión de código.

## Output de ./init.sh

Ejecutado por el reviewer en worktree limpio sobre `origin/feature/45-pet-lost-mode`
(`1bc6f07`), con `.env` del checkout principal y Postgres+LocalStack arriba
(puertos 5432 y 4566 respondiendo, así que los e2e **sí** corrieron).

```
→ Verificando entorno...
✅ node disponible (/usr/bin/node)
✅ pnpm disponible (/home/claude/.npm-global/bin/pnpm)
✅ bun disponible (/home/claude/.npm-global/bin/bun)
→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida
→ Instalando dependencias...
✅ Dependencias instaladas
→ Verificando coherencia del harness...
✅ Archivos del harness presentes
⚠️  Feature en progreso: pet-lost-mode
✅ STATUS.md sincronizado con feature_list.json
→ Build...
✅ Build exitoso
→ Ejecutando tests...
Test Suites: 152 passed, 152 total      (backend)
Tests:       1162 passed, 1162 total
Test Suites: 2 passed, 2 total          (infra)
Tests:       14 passed, 14 total
Test Suites: 49 passed, 49 total        (móvil)
Tests:       556 passed, 556 total
Snapshots:   1 passed, 1 total
✅ Tests pasados
→ Tests e2e...
Test Suites: 3 skipped, 22 passed, 22 of 25 total
Tests:       8 skipped, 343 passed, 351 total
✅ Tests e2e pasados
→ Lint...
✅ Lint sin errores
→ Typecheck...
✅ Typecheck sin errores
══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
  Features: 46/51 completadas | 4 pendientes

INIT_EXIT=0
```

Notas de la ejecución:

- **Sin regresiones y sin flakes.** Los dos flakes que el impl report menciona
  del baseline (`health-vaccines.e2e-spec.ts`, `add-pet/index.test.tsx`) **no
  reaparecieron** en esta corrida. Las 3 suites e2e saltadas son gates
  preexistentes, no relacionadas con #45.
- **Suite de lost mode verificada en aislamiento** (por el aviso de cross-talk
  de LocalStack entre sesiones):
  `npx jest --config ./test/jest-e2e.json --testPathPatterns pet-lost-mode`
  → `1 passed, 1 total` / `7 passed, 7 total`. Confirma que la suite corrió de
  verdad y no está entre las saltadas.
- **El código commiteado es lint-limpio de verdad**: `LINT_CMD` del backend usa
  `eslint --fix`, así que podría enmascarar problemas mutando el árbol. Tras
  `init.sh`, `git status --porcelain` sobre archivos trackeados = **0
  modificaciones**. Nada se auto-arregló.
- Las cifras coinciden exactamente con las que declaró el impl report
  (1162 / 14 / 556 / 343), así que el reporte de Codex es fiel.
