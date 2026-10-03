# review: mobile-push-registration — delta R13 (E2) y R14 (E3)

Fecha: 2026-09-19
Alcance: **solo el delta de las enmiendas E2/E3**. R1-R11 quedaron aprobados en
`progress/review_mobile-push-registration.md` y aquí solo se miran como regresión.
Rama: `feature/79-mobile-push-registration` @ `d8703096`.
Base de comparación: `git merge-base origin/main HEAD` = `29689598` (la base que
declara la spec). Ojo: `git diff origin/main` **no** sirve como delta — `origin/main`
avanzó con #90 y ensucia la comparación con ficheros que esta rama no tocó.

Veredicto: **APROBADO** (con un pendiente de C5 que cierra el leader, ver §Observaciones)

---

## Commits revisados

| Requisito | Rojo | Verde | Extra |
|---|---|---|---|
| R13 (E2) | `2cc99957 test(mobile-push-registration): name the skipped push path in dev (R13)` | `387d71be feat(mobile-push-registration): warn in dev when push registration is skipped (R13)` | `bda615ee test(mobile-push-registration): type the dev flag override (R13)` |
| R14 (E3) | `63e981d4 test(mobile-push-registration): require google services file wiring (R14)` | `d8703096 feat(mobile-push-registration): wire google-services.json when present (R14)` | — |

Los cinco son ancestros de HEAD (lección de #87):

```
$ for h in 2cc99957 387d71be bda615ee 63e981d4 d8703096; do git merge-base --is-ancestor $h HEAD && echo "$h ancestor-of-HEAD OK"; done
2cc99957 ancestor-of-HEAD OK
387d71be ancestor-of-HEAD OK
bda615ee ancestor-of-HEAD OK
63e981d4 ancestor-of-HEAD OK
d8703096 ancestor-of-HEAD OK
```

Commits del humano en medio (`d516f537` + merge `6e8766e2`): **comprobados, no juzgados
como implementación**. `d516f537` (autor `AlexisSM377`) añade a `app.json` el bloque
`extra.eas.projectId = d0441662-a631-49e3-a62a-931972e64148`, `extra.router`, `owner:
"trackergps"`, reformatea el array de permisos y firma E3 en `requirements.md`. Es
exactamente la Tarea humana A que `progress/current.md` daba por pendiente; cierra el
bloqueo que el impl report señalaba en §R12. No toca código de la app.

---

## 1. R13 — el diagnóstico no miente

### 1.1 Las siete salidas están instrumentadas

`mobile-pet-tracker/src/hooks/use-push-registration.ts` — un único emisor,
`warnPush()` (líneas 27-34), guardado entero por `__DEV__`:

```ts
function warnPush(reason: string, error?: unknown): void {
  if (__DEV__) {
    console.warn(`[push] ${reason}`, ...(error === undefined ? [] : [error]));
  }
}
```

| # | Salida | Línea | Mensaje |
|---|---|---|---|
| 1 | `status !== 'authenticated' \|\| token === null` | :40 | `[push] skipped: unauthenticated or missing auth token` |
| 2 | `!setPushToken` | :44 | `[push] skipped: setPushToken unavailable` |
| 3 | `!Device.isDevice` | :48 | `[push] skipped: physical device required` |
| 4 | plataforma no soportada | :53 | `[push] skipped: unsupported platform (web)` |
| 5 | `!projectId` | :58 | `[push] skipped: EAS projectId missing` |
| 6 | `catch` | :100 | `[push] registration failed` **+ el error capturado** |
| 7 | permiso denegado | :88 | `[push] skipped: notification permission denied` |

Las seis que enumera E2 están. La **séptima** (permiso denegado) no aparece en la
lista de seis de la enmienda, pero sí la pide `tasks.md` R13 paso (1) ("R7 el permiso
denegado") y la exige el texto literal de R13: es un caso en que el hook **no llega a
publicar el token**, luego debe nombrarse. No es exceso de alcance.

Prefijo `[push]` estable en las siete. El `catch` es el único que pasa un segundo
argumento; el resto emite un solo string (por eso los tests pueden asertar
`toHaveBeenCalledWith(<string>)` exacto).

### 1.2 Cada salida emite su aviso, y exactamente uno

Reproduje el **rojo** `2cc99957` (test del rojo + hook de su padre `794e717e`,
restaurando el árbol después):

```
$ git checkout 2cc99957 -- mobile-pet-tracker/src/hooks/use-push-registration.test.tsx mobile-pet-tracker/src/hooks/use-push-registration.ts
$ bunx jest --runTestsByPath src/hooks/use-push-registration.test.tsx
...
Test Suites: 1 failed, 1 total
Tests:       9 failed, 15 passed, 24 total
```

Los 9 fallos son los 9 casos de las siete salidas (el `projectId` va por `it.each`
con `undefined` y `''`; el permiso denegado tiene dos casos), y **todos fallan por su
propia aserción**, no por compilación:

```
  ● R6: … › no hace nada sin sesión autenticada
    Expected number of calls: 1
    Received number of calls: 0
    > 169 |     expect(warnSpy).toHaveBeenCalledTimes(1);
          |                     ^
      170 |     expect(warnSpy).toHaveBeenCalledWith(
      171 |       '[push] skipped: unauthenticated or missing auth token',
```

Idéntico patrón en `setPushToken unavailable`, `physical device required`,
`unsupported platform (web)`, `EAS projectId missing` (×2),
`notification permission denied` (×2) y `registration failed` + error. Ningún fallo
por `SyntaxError`/módulo ausente. Con el verde `387d71be` los 24 pasan (ver §6).

### 1.3 El camino feliz no emite nada

`use-push-registration.test.tsx:404-410`, dentro de `describe('R13: …')`:
`expect(mockRegisterPushToken).toHaveBeenCalledTimes(1)` **y**
`expect(warnSpy).not.toHaveBeenCalled()` en el mismo `waitFor`. Verde en la suite.

### 1.4 Con `__DEV__` falso no se emite absolutamente nada — probado ejecutando

El test que trae Codex (`'no avisa en producción'`) solo cubre **una** salida (la de
`projectId`). Para cerrar las siete monté una sonda temporal: copia del fichero de
test con tres sustituciones mecánicas —`devGlobal.__DEV__ = true` → `false` en el
`beforeEach`, `toHaveBeenCalledTimes(1)` → `(0)`, y `toHaveBeenCalledWith(` →
`not.toHaveBeenCalledWith(`— ejecutada y **borrada** acto seguido:

```
$ sed -e 's/devGlobal.__DEV__ = true;/devGlobal.__DEV__ = false;/' \
      -e 's/expect(warnSpy).toHaveBeenCalledTimes(1);/expect(warnSpy).toHaveBeenCalledTimes(0);/' \
      -e 's/expect(warnSpy).toHaveBeenCalledWith(/expect(warnSpy).not.toHaveBeenCalledWith(/' \
      use-push-registration.test.tsx > zz-devfalse-probe.test.tsx
$ bunx jest --runTestsByPath src/hooks/zz-devfalse-probe.test.tsx
  … ✓ los 24 casos …
Test Suites: 1 passed, 1 total
Tests:       24 passed, 24 total
$ rm -f src/hooks/zz-devfalse-probe.test.tsx   # árbol limpio comprobado con git status
```

Con `__DEV__ === false` las **nueve** rutas dan **cero** llamadas a `console.warn`, y
además los 24 casos siguen verdes: el comportamiento observable en producción no
cambia ni un ápice, que es justo lo que promete E2.

---

## 2. R13 no tocó R9

Diff completo de `387d71be` sobre el hook (única fuente modificada): añade `warnPush`
y convierte cada `return` mudo en `{ warnPush(...); return; }`. El único cambio
estructural es partir la guarda combinada
`if (status !== 'authenticated' || token === null || !setPushToken) return;` en dos
para poder nombrar cada motivo — semántica idéntica. El `catch {}` pasa a
`catch (error)` y conserva el comentario "Registration is best-effort and runs again
on the next app start.". **No se añade ningún `throw`, ningún `await` nuevo, ninguna
rama de reintento.**

Los cuatro tests de R9 (`absorbe un fallo al obtener el token y conserva el probe`,
y los tres `no reintenta un resultado unreachable/error/unauthorized dentro del mismo
montaje`) siguen verdes, incluido el `probe.result.current === 'mounted'` que fija que
el render no se rompe. También verdes en la sonda con `__DEV__` falso (§1.4): el
best-effort no depende del aviso.

---

## 3. R14 — las dos ramas, con fichero real

`app.config.ts` resuelve `hasGoogleServicesFile = existsSync(join(__dirname, './google-services.json'))`
y (a) acumula el aviso en el array `warnings` que ya existía, (b) mete
`...(hasGoogleServicesFile ? { googleServicesFile } : {})` dentro del bloque `android`,
(c) amplía el corto-circuito a `if (!googleMapsApiKey && !resetLinkHost && !hasGoogleServicesFile)`.

Probado con el fichero real creado y borrado (está en `.gitignore`, pero dejarlo
cambiaría un build posterior):

**Sin el fichero:**
```
$ bunx expo config --type public
… RESET_LINK_HOST no está definida; … google-services.json no existe; el build local de
Android no podrá inicializar Firebase Messaging. Consulta docs/verification.md §Feature 79
— mobile-push-registration.
$ bunx expo config --type public --json   # exit=0, config resuelta sin romper
  tiene googleServicesFile? false | valor: undefined
```

**Con el fichero:**
```
$ printf '{"project_info":{"project_id":"fake-review-probe"}}\n' > google-services.json
$ bunx expo config --type public | grep google
    googleServicesFile: './google-services.json'
$ rm -f google-services.json     # borrado; git status limpio
```

Con el fichero presente **no** se emite el aviso de google-services; sin él, la clave
**no** aparece (el test usa `Object.hasOwn`, no `toBeUndefined`, así que fija la
ausencia de la clave y no solo un valor vacío) y la resolución no lanza.

El aviso nombra el fichero y cita `docs/verification.md`, y la sección existe de
verdad: `docs/verification.md:833` `### Feature 79 — mobile-push-registration:
google-services.json del dev build` (añadida por el commit de spec `4c460e79`, no por
Codex). Cadena de cita verificada extremo a extremo.

`git check-ignore -v mobile-pet-tracker/google-services.json` →
`mobile-pet-tracker/.gitignore:37:/google-services.json`.

---

## 4. R14 respeta su alcance

```
$ git show --stat 63e981d4 d8703096
63e981d4  mobile-pet-tracker/app.config.test.ts | 92 ++++++---
d8703096  mobile-pet-tracker/.gitignore    |  1 +
          mobile-pet-tracker/app.config.ts | 14 ++-
```

Solo los tres ficheros que autoriza E3. Nada de `src/`, nada de `app.json`:

```
$ grep -n "googleServicesFile" mobile-pet-tracker/app.json
NO googleServicesFile in app.json
```

El único cambio de `app.json` en el delta es el del humano (`d516f537`), y no incluye
la clave. El veto de E3 se respeta: si fuera estática, `bunx expo prebuild` rompería
para quien no tenga el fichero.

**Patrón**: es el mismo que el fichero ya usa dos veces. Misma forma en las tres
ramas — comprobación → `warnings.push('<qué falta>; <consecuencia>. Consulta
docs/verification.md §Feature NN — <slug>.')` → un solo `console.warn(warnings.join(' '))`
→ spread condicional dentro de `android`. No se inventó un mecanismo nuevo: no hay
segundo `console.warn`, ni `throw`, ni variable de entorno nueva. El test tampoco:
`describe('#79 R14: …')` está calcado de los `describe` de `GOOGLE_MAPS_API_KEY_ANDROID`
y `RESET_LINK_HOST` (espía de `console.warn`, `not.toThrow()`, `stringContaining` del
nombre y de `docs/verification.md`).

R13 igual de contenido: `2cc99957` y `387d71be` tocan **solo** el hook y su test.

---

## 5. C4 en los dos requisitos, y qué arregla `bda615ee`

- **R13**: rojo `2cc99957` (solo test, 9 casos fallando por las aserciones del espía,
  §1.2) → verde `387d71be` (solo hook). Orden correcto, historial rojo→verde real.
- **R14**: rojo `63e981d4` (solo test). Reproducido:
  ```
  $ git checkout 63e981d4 -- mobile-pet-tracker/app.config.test.ts mobile-pet-tracker/app.config.ts
  $ bunx jest --runTestsByPath app.config.test.ts
    #79 R14: google-services.json se declara solo cuando existe
      ✕ declara android.googleServicesFile cuando el fichero existe
      ✕ sin el fichero avisa, omite la clave y resuelve la config
    ● … › declara android.googleServicesFile cuando el fichero existe
      Expected: "/…/mobile-pet-tracker/google-services.json"
      Number of calls: 0
      > 263 |     expect(mockExistsSync).toHaveBeenCalledWith(
    ● … › sin el fichero avisa, omite la clave y resuelve la config
      > 284 |     expect(warnSpy).toHaveBeenCalledTimes(1);
  Tests: 2 failed, 11 passed, 13 total
  ```
  Fallan **solo** los dos casos nuevos, por sus propias aserciones, y los 11
  preexistentes siguen verdes pese a que el rojo introduce un `jest.mock('node:fs')`
  global — el mock no contaminó R1-R4. Luego verde `d8703096`.

- **`bda615ee`**: es el paso (3) *refactor* del bloque R13 de `tasks.md`, que exige
  `bunx tsc --noEmit` verde. El rojo había escrito `globalThis.__DEV__`, que compila
  bajo babel-jest pero no bajo `tsc`. Comprobado restaurando el estado previo:
  ```
  $ git checkout 387d71be -- …/use-push-registration.test.tsx && bunx tsc --noEmit
  src/hooks/use-push-registration.test.tsx(80,32): error TS2339: Property '__DEV__' does not exist on type 'typeof globalThis'.
  … (4 errores, líneas 80, 121, 149, 392)   TSC_EXIT=2
  ```
  `bda615ee` introduce `const devGlobal = globalThis as typeof globalThis & { __DEV__: boolean }`
  y sustituye los cuatro accesos. **Solo tipado, cero cambios de aserción o de
  comportamiento**, y aterriza antes de empezar R14. La historia queda coherente:
  rojo → verde → refactor de tipado, con el typecheck cerrado dentro del bloque de R13
  y no arrastrado al siguiente requisito.

---

## 6. Regresión completa (corrida por el reviewer, sin pipe)

Antes de nada, el candado del Postgres/LocalStack compartidos:
```
$ pgrep -af "init.sh|jest"
NINGUN init.sh/jest en curso
```

**Suite móvil completa** (exit code medido sin pipe, lección de `exit-code-tras-pipe`):
```
$ cd mobile-pet-tracker && bunx jest > jest-full.txt 2>&1 ; echo $?
JEST_EXIT=0
Test Suites: 75 passed, 75 total
Tests:       1331 passed, 1331 total
Snapshots:   1 passed, 1 total
```

**Recuento de ficheros de test** (lección de `jest-paths-con-parentesis`: nada saltado
en silencio por los paréntesis de `(tabs)`):
```
$ bunx jest --listTests | wc -l
75
```
75 ejecutadas = 75 listadas. Sin suites fantasma ni omitidas.

**Typecheck móvil**: `bunx tsc --noEmit` → `TSC_EXIT=0`.

**`./init.sh` desde la raíz**, sin pipe:
```
$ ./init.sh > init.txt 2>&1 ; echo $?
INIT_EXIT=0
```
Secciones: entorno ✅ · variables ✅ · dependencias ✅ · harness ✅ · STATUS.md
sincronizado ✅ · build ✅ · tests backend `170 passed, 170 total` / `1295 passed` ·
infra `2 passed` · **móvil `75 passed, 75 total` / `1331 passed`** · e2e
`27 passed, 3 skipped` / `384 passed, 8 skipped` ✅ · lint ✅ · typecheck ✅ ·
`✅ Todo verde. Listo para trabajar.`

El recuento móvil dentro de `init.sh` coincide con el de mi ejecución aislada.
Avisos no bloqueantes ya conocidos: `NodeVersionSupportWarning` del AWS SDK (node
v20 vs v22 en 2027) y el ruido esperado de `PositionsConsumerService` en los tests de
mensajes malformados. Desaparecieron los avisos de `STATUS.md` desincronizado y de
`RESET_LINK_HOST` que registraba el impl report anterior.

`git status --short` vacío antes, durante (tras cada restauración) y después de todas
las reproducciones: no queda ni el `google-services.json` temporal ni la sonda
`zz-devfalse-probe.test.tsx`.

---

## 7. Ni un `npx` nuevo

```
$ git diff $(git merge-base origin/main HEAD)..HEAD | grep "^+" | grep -v "^+++" | grep npx
```
Cinco coincidencias, **todas citas históricas ya aprobadas**, ninguna en código:
`docs/conventions.md` (la propia norma: "Nada de `npm`, `npx` ni `npm i -g`"), el
impl report y el review anterior (relato del bloqueo de R1, con su nota de "cita
historica"), y `requirements.md` §E1 (`npx expo install`, marcado explícitamente como
"tal y como se ejecutaron entonces; la norma vigente es `bunx`").

En el delta de las enmiendas (`794e717e..HEAD`) y en los cinco ficheros tocados
(`app.config.ts`, `app.config.test.ts`, el hook, su test, `.gitignore`): **cero**.
Los comandos de este informe son todos `bunx`.

---

## 8. i18n en delta cero

```
$ git diff --stat 29689598..HEAD -- mobile-pet-tracker/src/i18n/ \
    mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
(vacío)
$ git log --oneline 29689598..HEAD -- mobile-pet-tracker/src/i18n/catalog.ts
(vacío)
```
Ningún commit de la rama toca el catálogo ni el candado de longitud. **Aviso para el
merge**: contra `origin/main` (que ya trae #90) sí aparecen 2 deleciones en
`catalog.ts` y 32 en `language-provider.test.tsx` — es #90, que añadió
`weightLog.dateCannotBeAfterToday` después de esta base. No es deuda de #79, pero el
merge de esta rama tiene que conservar la clave y el recuento de #90 (es exactamente
el acuerdo de colisión que anota `progress/current.md`).

---

## Checklist

### C2 — Estado coherente
- [x] Solo 1 feature `in_progress`: `feature_list.json` → `[79]`
- [x] `progress/current.md` describe la sesión #79 en curso
- [ ] `progress/current.md` todavía dice "R1-R11 implementados", sin las enmiendas
      E2/E3 ni el desbloqueo de la Tarea A por `d516f537` (lo actualiza el leader al
      cerrar; no es trabajo de Codex)

### C3 — Arquitectura
- [x] N/A para capas de backend. El delta es UI/config: el hook vive en
      `src/hooks/`, consume `src/api/push-tokens.ts` y no habla con `fetch` directo;
      `app.config.ts` es configuración de build sin lógica de negocio.
- [x] Sin lógica nueva en el provider ni en las pantallas.

### C4 — TDD
- [x] R13: rojo `2cc99957` fallando por sus 9 aserciones → verde `387d71be` → refactor
      de tipado `bda615ee`
- [x] R14: rojo `63e981d4` fallando por sus 2 aserciones → verde `d8703096`
- [x] Cada requisito tiene al menos un test que lo nombra:
      `describe('R13: cada salida silenciosa se nombra en desarrollo')` y
      `describe('#79 R14: google-services.json se declara solo cuando existe')`
- [x] Ningún rojo falla por compilación o por módulo ausente

### C5 — Trazabilidad
- [ ] **`traceability.md` tiene las filas R13 y R14 en "pendiente"** — Codex no las
      rellenó. Incumplimiento real; lo cierra el leader (§Observaciones) antes de
      pasar la feature a `done`. El contenido **sí** cuadra con los commits, que es
      lo que este review verifica.
- [x] La fila de R12 debe seguir "pendiente": es el gate humano, no lo corre ninguna IA
- [x] Formato de los commits correcto: `test|feat(mobile-push-registration): <desc> (R13|R14)`

### C6 — Spec aprobada
- [x] `requirements.md` `status: approved`
- [x] `- [X] E2 aprobada por humano (fecha: 2026-09-18)`
- [x] `- [X] E3 aprobada por humano (fecha: 2026-09-18)`, firmada por el humano en
      `d516f537` (autor `AlexisSM377`)
- [x] Las dos enmiendas tienen su bloque de tareas en `tasks.md` antes de R12

### C7 — Sin código huérfano
- [x] N/A — ninguna de las dos enmiendas reemplaza ni deprecia nada. R13 solo añade
      avisos sobre `return`s existentes; R14 añade una clave condicional. Ningún
      fichero ni test eliminado en el delta.

### C8 — Carta de UI
- [x] N/A — el delta no pinta un píxel. Sin `StyleSheet`, sin color, sin copy de UI:
      `console.warn` de desarrollo y configuración de build.

---

## Observaciones (no bloquean el veredicto del código; sí el cierre de la feature)

1. **Rellenar las dos filas de `traceability.md`** (C5). Contenido verificado, listo
   para copiar:

   - **R13** → test: `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx::R13: cada salida silenciosa se nombra en desarrollo`
     (el silencio con `__DEV__` falso y el camino feliz); las aserciones del espía de
     las otras siete salidas viven, por diseño de `tasks.md`, dentro de los `describe`
     de `R6`, `R7` y `R9` del mismo fichero — conviene anotarlo en la celda.
     Commits: `2cc99957 test(mobile-push-registration): name the skipped push path in dev (R13)` rojo →
     `387d71be feat(mobile-push-registration): warn in dev when push registration is skipped (R13)` verde →
     `bda615ee test(mobile-push-registration): type the dev flag override (R13)` tipado.

   - **R14** → test: `mobile-pet-tracker/app.config.test.ts::#79 R14: google-services.json se declara solo cuando existe`.
     **Atención**: la celda actual de `traceability.md` anuncia el nombre
     `#79 R14: googleServicesFile se declara solo si el fichero existe`, que **no
     existe** en el árbol. Hay que corregirlo al `describe` real citado arriba.
     Commits: `63e981d4 test(mobile-push-registration): require google services file wiring (R14)` rojo →
     `d8703096 feat(mobile-push-registration): wire google-services.json when present (R14)` verde.

2. **`progress/impl_mobile-push-registration.md` no tiene secciones R13 ni R14.**
   Es la misma omisión de Codex que dejó las filas pendientes: el reporte se quedó en
   R1-R11 + §R12. Además su §R12 sigue diciendo que `app.json` no contiene
   `extra.eas.projectId`, lo que ya no es cierto desde `d516f537`. Conviene añadir las
   dos secciones y corregir esa frase antes de pedir el gate humano, para que el humano
   no recorra el smoke con un diagnóstico caducado.

3. **R12 sigue sin ejecutar** y es lo único que separa a la feature del `done`. Con
   `d516f537` (Tarea A) y la Tarea B firmadas, y con R14 dándole al humano el
   `google-services.json` que faltaba, el smoke ya es ejecutable. Recordatorio para el
   handoff: el fichero lo descarga cada máquina de la consola de Firebase
   (`docs/verification.md:833`), y no se versiona.

4. **Séptima salida instrumentada.** E2 enumera seis y el hook avisa en siete (añade
   `permission denied`). Es correcto según el texto literal de R13 y lo pedía
   `tasks.md`, pero la lista de seis de la enmienda se queda corta respecto al código.
   Si se quiere dejar la spec exacta, basta una nota en E2; no requiere código.

5. **Aviso para el merge**: esta rama está a 49 commits de su base `29689598` y
   `origin/main` ya trae #90 con una clave nueva de i18n. Ver §8.

---

## Salida de `./init.sh`

```
$ cd /home/claude/sites/Pet-Tracker && ./init.sh > init.txt 2>&1 ; echo $?
INIT_EXIT=0

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
✅ STATUS.md sincronizado con feature_list.json

→ Build...
✅ Build exitoso

→ Ejecutando tests...
  backend:  Test Suites: 170 passed, 170 total | Tests: 1295 passed, 1295 total
  infra:    Test Suites: 2 passed, 2 total     | Tests: 14 passed, 14 total
  móvil:    Test Suites: 75 passed, 75 total   | Tests: 1331 passed, 1331 total
            Snapshots: 1 passed  Time: 37.939 s
✅ Tests pasados

→ Tests e2e...
✅ Esquema y recursos e2e listos
Test Suites: 3 skipped, 27 passed, 27 of 30 total
Tests:       8 skipped, 384 passed, 392 total
✅ Tests e2e pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
$ tsc --noEmit
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 84/101 completadas | 16 pendientes
  Próxima feature: [#18] nutrition-ai-explainer (P3)
```

Avisos no bloqueantes conservados: `NodeVersionSupportWarning` del AWS SDK v3 (node
v20.20.2 vs el >=22 que exigirá en 2027) y los logs de error esperados de
`PositionsConsumerService` en sus tests de mensajes malformados.
