# review: mobile-pet-hero-header (#67)

Fecha: 2026-09-07
Reviewer: subagente `reviewer`
Commit revisado (fingerprint): **`9313069`** — `docs(mobile-pet-hero-header): report the implementation and tick the task plan`
Branch: `feature/67-mobile-pet-hero-header`
Base de medición del delta: `303fc19`

**Veredicto: APROBADO**, con una observación menor de arreglo obligatorio antes
del merge (§Observaciones O2) que **no** afecta a ningún requisito: la propiedad
que ese test dice guardar la verifiqué yo directamente y se cumple.

> Este veredicto **no sustituye** los dos gates humanos. Ver §Lo que no cierra
> el reviewer.

---

## Drift de código

`git fetch` + comparación con `origin/feature/67-mobile-pet-hero-header`:

- `origin` está en `8cf28e5` y **es ancestro de `HEAD`**: 36 commits locales por
  delante, **0 commits en origin que no estén en HEAD**. No hay divergencia; la
  branch simplemente no se ha empujado todavía.
- Árbol de trabajo limpio (`git status --porcelain` vacío) antes y después de
  mis pruebas de mutación.
- El veredicto cubre exactamente `9313069`. Si se empuja algo por encima, deja
  de cubrirlo (lección de #59).

---

## Checklist C2 — Estado coherente

- [x] Máximo 1 feature `in_progress` — hay **0** (`feature_list.json` solo usa
      `done`/`pending` en este repo: 62 `done`, 10 `pending`)
- [x] `progress/current.md` describe la sesión activa de #67
- [x] Toda feature `done` tiene test que la cubre (no cambia con esta feature)

Nota: #67 sigue en `pending` mientras `progress/current.md` la da por
implementada. Es la convención de este repo (no se usa el estado intermedio) y
es bookkeeping del leader, no del implementer. No bloquea.

## Checklist C3 — Arquitectura

- [x] La feature es **100 % móvil**: `backend-pet-tracker/` e `infra/` con **0
      ficheros** en el diff, así que las capas domain/application/infrastructure
      quedan intactas
- [x] Estructura Expo de `docs/conventions.md`: el componente compartido vive en
      `src/components/`, las pantallas en `src/app/(tabs)/home.tsx` y
      `src/screens/profile/`; ningún route engorda
- [x] El hero no conoce la capa de datos: `pet-hero-header.tsx` solo importa
      `type { PetProfile } from '../api/types'`. Ni `pet-switcher`, ni
      `src/api/pets`, ni `src/api/activity`. El dato destacado llega **ya
      formateado** desde `home.tsx` (`fmtCount`), como manda R7

## Checklist C4 — TDD

- [x] Cada `R<n>` tiene al menos un test que lo nombra en su `describe`
- [x] El historial muestra test-primero, no todo junto: **34 commits**, patrón
      `test(...)` → `feat(...)` → `docs(...)` repetido para R1…R8 y R10
- [x] Ningún rojo por `ReferenceError` de andamio. Verificado en tres rojos:
      - `4c3f958` (R1): el fichero de test existe **completo**; lo que falta es
        `src/components/pet-hero-header.tsx`
      - `0918704` (R5): `home.tsx` todavía tiene `testID="pet-card"`, así que el
        rojo es por la aserción
      - `591ec19` (R10): el test existe y `docs/conventions.md` tiene **0**
        bloques `Enmienda #67` → rojo por aserción
- [x] R9 se declaró **requisito de verificación por vía (b)** en `tasks.md`
      antes del handoff, y se cierra por **prueba de mutación** (abajo, rehecha
      por mí)

## Checklist C5 — Trazabilidad

- [x] `traceability.md` **sin ninguna fila "pendiente"**: las 16 filas (R1, R2,
      R2b, R3, R3b, R4, R5, R5b, R6, R7, R7b, R8, R8b, R9, R9b, R10) tienen
      commit rojo → verde, o commit + evidencia de mutación en el caso de R9
- [x] Cada test prescrito por la columna Test **existe con ese nombre exacto** y
      prueba de verdad ese R-id (no un fichero de nombre parecido). Comprobado
      uno a uno contra el fuente
- [x] Formato de commit `<tipo>(mobile-pet-hero-header): <desc> (R-ids)` en los
      34 commits

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved`
- [x] Casilla marcada: `- [X] Aprobado por humano (fecha: 2026-09-07)`, firmada
      por el humano en **su propio commit `8cf28e5`** (autor `AlexisSM377`)
- [x] Ningún requisito modificado después de la aprobación. `git diff
      8cf28e5..HEAD` sobre `requirements.md` y `design.md` devuelve **una sola
      línea cada uno**: el frontmatter `spec_ready` → `approved`, hecho por el
      leader en `d9d5fa6`. Los cuerpos de R1–R10 son byte a byte los aprobados
- [x] `tasks.md` solo cambió en casillas `- [ ]` → `- [x]` (verificado filtrando
      el diff: **cero** líneas no-casilla)

## Checklist C7 — Sin código huérfano

- [x] Los ocho `testID` que la feature mata **no existen ya en producción**:
      `pet-card`, `pet-card-photo`, `pet-card-name`, `pet-card-breed`,
      `pet-card-skeleton`, `pet-card-error`, `pet-card-retry` (todos de
      `home.tsx`) y `profile-pet-photo` (de `profile/index.tsx`)
- [x] La función local `PetHero` de `screens/profile/index.tsx:62-84` y su
      llamada están eliminadas; `profile/index.tsx` ahora importa
      `PetHeroHeader` y lo monta con `variant="card"`
- [x] `profile-hero-skeleton` **conserva su nombre**, como R6 exige
- [x] No queda ningún `.test`/`.spec` de código eliminado: las únicas
      referencias vivas a los nombres muertos son las 8 aserciones de ausencia

## Checklist C8 — Carta de UI

- [x] **Grep-clean sin delta**. Contra `303fc19` y contra `HEAD`: hex fuera de
      `src/theme/` = 4 en ambos (los 4 son de ficheros `.test.tsx` colocados),
      `StyleSheet` = 2 en ambos (`StyleSheet.flatten` en el `card.tsx`
      preexistente, no `.create`), clases arbitrarias `[...]` = **0**,
      shadow/elevation legacy = **0**. La feature **no introduce ninguna**
- [x] Radios dentro de la escala: el hero solo usa `rounded-card` y
      `rounded-xl`
- [x] Dimensiones §Dimensiones con la **única desviación declarada** de R5b:
      `contentContainerStyle` = `{ gap: 16, paddingBottom: insets.bottom + 96 }`,
      y el padding horizontal baja a `home-content`
      (`{ paddingHorizontal: 24, gap: 16 }`) y a `home-states`
      (`{ paddingHorizontal: 24, paddingTop: insets.top + 12, gap: 16 }`). El
      `paddingTop` lo asume el slot del hero vía `useSafeAreaInsets`
- [x] Carga con `Skeleton` dimensionado, nunca `Spinner` suelto: el
      `pet-hero-skeleton` reserva `PET_HERO_MEDIA_HEIGHT` por `style` y la banda
      inferior reserva sus dos líneas
- [x] Componentes compartidos reutilizados, no forkeados: el render de la imagen
      de mascota sigue viviendo **solo** en `pet-avatar.tsx`; `pet-switcher.tsx`
      no se toca (solo cambia dónde se monta)
- [x] Sin animaciones nuevas

---

## Los seis puntos mirados con lupa

### 1. La fila `home.walks` en `specs/mobile-ui-language/design.md:300` — **está bien así**

Es un cambio a una spec **aprobada** (#65) que no es ninguna de las enmiendas
A1–A9. Pero **sí está autorizado, y por escrito**: R7b de esta misma spec dice
literalmente que el sistema *"SHALL registrarla en la tabla §2.3 de
`specs/mobile-ui-language/design.md`"*. El humano firmó R7b el 2026-09-07.

Además es un **apunte de registro, no un cambio de decisión**: añade una fila a
una tabla-índice de claves de catálogo, no toca ningún R de #65, ni su estado de
aprobación, ni ningún test suyo. Por eso no necesita bloque de enmienda propio:
el mecanismo de R10 existe para decisiones enmendadas, y aquí no se enmienda
ninguna.

**No sobra y no necesita firma.** Queda anotado en §Observaciones O1 como la
única edición a una spec aprobada de todo el cierre que no lleva línea de firma,
por si el harness quiere endurecer ese invariante más adelante.

**Nada más fuera de lo que R10 autoriza.** El diff completo `d9d5fa6..HEAD` toca
24 ficheros: los 5 documentos de A1–A9, `mobile-ui-language/design.md` (R7b),
los `tasks.md` y `traceability.md` de la propia #67, `progress/impl_*.md`, y 16
ficheros de `mobile-pet-tracker/`. **Cero** ficheros de `backend-pet-tracker/`,
`infra/`, `feature_list.json` o `STATUS.md`.

### 2. Las nueve enmiendas A1–A9 — correctas y **sin firmar**

Los cinco ficheros llevan su bloque:

| Fichero | Bloque | Línea de firma | Prosa |
|---|:--:|---|:--:|
| `specs/mobile-figma-polish/design.md` | :163 | :174 `- [ ]` | A1 :109, A3 :95, A4 :102, A6 :160 |
| `specs/mobile-figma-polish/requirements.md` | :221 | :232 `- [ ]` | A2 :187, A5 :194 |
| `specs/mobile-pets-profile/requirements.md` | :272 | :283 `- [ ]` | A7 :136 |
| `docs/ui-guidelines.md` | :295 | :306 `- [ ]` | A8 :227, A9 :101 |
| `docs/conventions.md` | :301 | :312 `- [ ]` | A9 :293 |

- **Las cinco líneas de firma llegan sin marcar** (`- [ ]`), verificado por grep
  directo sobre los ficheros. Ninguna llegó marcada.
- **El test lee el literal de `design.md` §9, no de una copia.** No me fié del
  código: mutando **solo** `design.md` §9 (`"ningún otro requisito"` →
  `"NADA EN ABSOLUTO"`) el test se pone **rojo**, lo que solo puede pasar si lo
  lee de ahí. Y mutando **solo** un documento enmendado
  (`docs/ui-guidelines.md`) también se pone rojo **nombrando ese fichero**.
  Candado vivo en las dos direcciones.

Desviación menor, aceptable: `design.md` §9 dice sustituir `<QUÉ CAMBIA>` por
*"la celda correspondiente de la tabla"*, y el implementer puso en su lugar un
puntero (`"enmiendas A1, A3, A4 y A6 de la tabla de #67 §R10"`). Es la única
lectura posible: R10 manda **un bloque por documento** y un documento hospeda
hasta cuatro enmiendas, así que no hay una celda única que pegar.

### 3. A7 no tocó la decisión de blobatar — **confirmado**

El diff de `specs/mobile-pets-profile/requirements.md` es **puramente aditivo**:
cero líneas borradas. El texto original de la R5 de #40 —incluido su
`testID="pet-card-photo"` histórico y la frase *"IF la mascota tiene `photoUrl`
THEN la foto manda y el blobatar no se genera"*— sigue intacto palabra por
palabra. Lo añadido dice explícitamente *"la decisión de blobatar **no se
toca**. Sólo cambian el anfitrión y el nombre del ancla"*, y confirma que
`pet-avatar.tsx` sigue siendo el único sitio donde vive el render — que es
verdad en el código. **El fondo de la R5 de #40 está inalterado.**

### 4. Ningún `testID` perdido sin sustituto — **confirmado uno a uno**

| Muere | Sustituto | Assert de conducta que ocupa su sitio | ¿Debilitado? |
|---|---|---|---|
| `pet-card` | `pet-hero` | `home.test.tsx:259` monta el hero al resolver `ok` | no |
| `pet-card-photo` | `pet-hero-media` | `:260` `source` = `[{uri, cacheKey: pet.id}]`; `:276` `.props.xml` contiene `'<svg'`; `:316` descendiente de `pet-hero` | **reforzado**: antes `[{uri}]`, ahora exige `cacheKey` |
| `pet-card-name` | `pet-hero-name` | `:263` pinta `'Luna'` | no |
| `pet-card-breed` | `pet-hero-breed` | `:264` `'Mixed'`; `:277` `'—'` sin raza | no |
| `pet-card-skeleton` | `pet-hero-skeleton` | `:250` visible mientras carga; `:548` al cambiar de mascota | no |
| `pet-card-error` | `pet-hero-error` | `:286` visible con el detalle en error | no |
| `pet-card-retry` | `pet-hero-retry` | `:287-289` `press` → `getPet` llamado 2 veces | no |
| `profile-pet-photo` | `pet-hero-media` | `profile/index.test.tsx:365` visible; `:589` `source` con `cacheKey` | **reforzado** |

**Las siete aserciones de ausencia existen** y son exactamente las que el
implementer afirma (`home.test.tsx:842-848`), más `profile/index.test.tsx:852`
para `profile-pet-photo` = **ocho** en total.

Además, el `contentContainerStyle` de Home se **reforzó** al reanclarlo: pasó de
`toEqual(expect.objectContaining({paddingTop: 52, paddingBottom: 120}))` a un
`toEqual` **exacto** `{gap: 16, paddingBottom: 120}`, y el `paddingTop: 52` no
se perdió — se movió a un assert exacto nuevo sobre `home-states`.
`legibility-classnames.test.ts` no se tocó (0 líneas de diff contra `303fc19`).

**No encontré ningún assert debilitado ni eliminado en toda la feature.**

### 5. Prueba de mutación de R9 — **replantada por mí, las tres caen**

Planté las tres mutaciones de `tasks.md` R9 (1) de una en una en
`src/components/pet-hero-header.tsx` y revertí con `git checkout` tras cada una
(árbol limpio verificado al final):

| # | Mutación | Candado | Resultado |
|---|---|---|---|
| 1 | `rounded-2xl` añadido al `className` de `pet-hero-fade-bottom` | `consistency-classnames.test.ts` #62 R4 | **ROJO** `1 failed, 50 passed` — `Array [ "components/pet-hero-header.tsx" ]` |
| 2 | `${background}00` → `#FFFFFF00` en `experimental_backgroundImage` | `design-drift.test.ts` R9 | **ROJO** `1 failed, 19 passed` — mismo array |
| 3 | `style={{height: PET_HERO_MEDIA_HEIGHT}}` → `className="h-[260px]"` | `design-drift.test.ts` C8 | **ROJO** `1 failed, 19 passed` — mismo array |

Las tres caen **por la aserción del candado**, no por `ReferenceError`.

**La mutación 2, en concreto** — el punto que pedías verificar. Hice la prueba
en negativo, que es la que de verdad lo demuestra:

- (a) hex plantado, **con** `'components/pet-hero-header.tsx'` en la lista de R9
  de `design-drift.test.ts` → **ROJO**, `1 failed, 19 passed`.
- (b) **el mismo hex**, quitando esa única fila de la lista → **VERDE,
  `20 passed, 20 total`**. El hex pasa entero.
- (c) el mismo hex, corriendo `pet-hero-header.test.tsx` completo → **VERDE,
  `22 passed, 22 total`**. El candado de forma de R3 **no lo ve**, porque
  `#FFFFFF00` satisface su regex `/^linear-gradient\(to bottom,
  #[0-9A-Fa-f]{6}00 0%, #[0-9A-Fa-f]{6} 100%\)$/`.

Es decir: **la fila que `b85b21d` añadió a `design-drift.test.ts` es lo único en
todo el repo que atrapa un hex incrustado en el degradado**. Registrar el
fichero nuevo no era decorativo — sin esa línea, la zona ciega existía de verdad.

### 6. Los números de contraste de R3 — **recalculados y correctos**

Recalculados con WCAG 2.x (luminancia relativa sRGB) contra los tokens que la
implementación usa **de verdad**: `src/theme/global.css` líneas 26-27 y 36
(claro), 74-75 y 84 (oscuro). Y verifiqué en el componente que los pares son
los que la spec midió: la banda es `bg-background`, el nombre y el valor
destacado son `text-foreground`, la raza y la etiqueta son `text-muted`.

| Par | Tokens reales | Calculado | Spec | AA |
|---|---|---:|---:|:--:|
| `foreground` / `background` claro | `#0D1117` / `#FFFFFF` | **18,9246** | 18,93 | ✅ |
| `muted` / `background` claro | `#667085` / `#FFFFFF` | **4,9748** | 4,98 | ✅ |
| `foreground` / `background` oscuro | `#F7F8FA` / `#0D1117` | **17,8092** | 17,81 | ✅ |
| `muted` / `background` oscuro | `#9CA3AF` / `#0D1117` | **7,4540** | 7,45 | ✅ |

Y de paso los dos de R3b, que justifican descartar la vía fiel al Make: velo
`rgba(0,0,0,0.28)` sobre foto casi blanca compone `#B8B8B8`; blanco encima =
**1,9837** (spec: 1,98) y `--accent` `#178255` = **2,4277** (spec: 2,43). Los
seis cuadran. Ninguno depende de la foto, porque la banda es opaca — que es el
mecanismo que R3 exige.

---

## Verificación independiente de los deltas de R9b

Rehechos con mi propio grep contra `303fc19`, no leídos del informe:

| Candado | `303fc19` | `HEAD` | Delta | Declarado | ✓ |
|---|---:|---:|---:|---:|:--:|
| `CONTINUOUS_CORNER` en `screens/profile/index.tsx` | 4 | 3 | **−1** | −1 | ✅ |
| `CONTINUOUS_CORNER` en `components/pet-hero-header.tsx` | 0 | 1 | **+1** | +1 | ✅ |
| `CONTINUOUS_CORNER` total | 31 | 31 | **0** | sin cambio | ✅ |
| `bg-accent-soft` total | 26 | 25 | **−1** | −1 | ✅ |
| `text-accent-strong` total | 13 | 13 | **0** | sin cambio | ✅ |
| filas de `R3_HOME` | 20 | 21 | **+1** | +1 | ✅ |
| filas de `R7_PROFILE` | — | — | **0** | sin cambio | ✅ |
| claves del catálogo (`language-provider.test.tsx`) | 259 | 260 | **+1** | (deriva de R7b) | ✅ |
| fila del skeleton de Home en #62 R2 | — | — | editada, no contada | editada | ✅ |

La fila de #62 R2 no se debilitó al reescribirse: el `it.each` viejo comprobaba
un `className` literal; el `it` nuevo comprueba `className="w-full"` **más**
`style={{ height: PET_HERO_MEDIA_HEIGHT }}` **más** `not.toContain('rounded-')`.
Es más estricta.

`home.walks` está en los **dos** idiomas (`catalog.ts:44` `'Walks'`, `:309`
`'Paseos'`), como exige R7b.

---

## Observaciones

### O1 — La fila de `mobile-ui-language/design.md` es la única edición a una spec aprobada sin firma (informativo, no bloquea)

Está autorizada por R7b, que el humano aprobó, y es un apunte de registro, no
una enmienda de decisión. Pero es el único punto del cierre donde se edita una
spec aprobada sin bloque ni línea de firma, y no hay precedente en ese fichero
(grep: es la única fila con marca `← añadida por #NN`). Si el harness quiere el
invariante duro *"ninguna spec aprobada se edita sin firma"*, la vía sería que
la próxima spec que añada claves de catálogo enrute ese apunte por R10 como una
enmienda más. **No requiere acción en #67.**

### O2 — `hero-header-amendments.test.ts`, cuarto `it`: la aserción está muerta (arreglar antes del merge)

```ts
it('no marca ninguna casilla: la firma es del humano', () => {
  expect({ file, signed: source.includes('- [X] Enmienda #67') })
    .toEqual({ file, signed: false });
});
```

Busca la cadena `- [X] Enmienda #67`, que **no existe en ningún fichero en
ningún estado**. La línea de firma real es `- [ ] Enmienda aprobada por
humano`, así que su forma marcada sería `- [X] Enmienda aprobada por humano`.

Lo comprobé por mutación: marcando la casilla de `docs/conventions.md` como
`- [X] Enmienda aprobada por humano`, **los cuatro `it` siguen verdes**
(`4 passed, 4 total`). El candado no puede fallar nunca. Es exactamente el tipo
de test decorativo contra el que se escribió C4.

**Por qué no es rechazo:**

1. Ese `it` **no está prescrito por la spec**. R10 solo pide bloque presente +
   línea de firma presente *"marcada o no"* — y esas tres aserciones **sí están
   vivas**, probadas por mis dos mutaciones de §2.
2. La propiedad que dice guardar —que ninguna firma llegue marcada— **la
   verifiqué yo directamente por grep sobre los cinco ficheros**, y se cumple.
   Mi aprobación descansa en esa comprobación, no en ese test.

**Arreglo**: una línea, sustituir la cadena buscada por
`'- [X] Enmienda aprobada por humano'`. Ojo: en cuanto el humano firme, ese test
pasará a ser rojo por diseño, así que lo correcto es **borrar el `it`** (el
tercer `it` ya acepta la firma marcada o no) en vez de arreglar la cadena.
Recomiendo borrarlo.

### O3 — Para el ojo del humano en el smoke: el título "Inicio" desaparece de Home cuando hay mascota

El implementer lo declara en su nota 2 y estoy de acuerdo en que la spec no lo
cubre: R5 obliga a que el hero sea el **primer hijo** del scroll, lo que fuerza
a que el `<Text>{t('home.home')}</Text>` caiga bajo la fotografía o desaparezca.
Eligió que desaparezca cuando hay hero, y se sigue pintando en las tres ramas
sin mascota. `t('home.home')` conserva **exactamente 1** ocurrencia en
`home.tsx`, así que `R3_HOME` cuadra sin tocar su fila. Es una decisión de
producto declarada, no un descuido — pero es visible y merece el ojo del humano.

### O4 — `PetAvatar.size` acepta `'100%'` además de `number` (correcto)

`requirements.md` R2 escribe el tipo como `{ width: number; height: number }`,
pero `design.md` §1 y `tasks.md` R2 (2) —los dos igualmente aprobados— mandan
llamar con `size={{ width: '100%', height: PET_HERO_MEDIA_HEIGHT }}`, y el
propio R2 exige que la foto ocupe *"el 100 % del ancho"*, que un `number` no
puede expresar. El ensanchamiento a `number | '100%'` es la lectura que
satisface los tres documentos con el diff más corto. **Correcto tal cual.**

---

## Lo que NO cierra el reviewer

Dos gates son del humano y este veredicto **no los sustituye**:

1. **Las nueve casillas de firma A1–A9.** Las cinco líneas
   `- [ ] Enmienda aprobada por humano` llegan **sin marcar**, como debe ser.
   Ningún agente las ha tocado. Hasta que el humano las firme, las enmiendas a
   `specs/mobile-figma-polish/`, `specs/mobile-pets-profile/`,
   `docs/ui-guidelines.md` y `docs/conventions.md` están propuestas, no
   ratificadas. (Y A10 —la corrección de `feature_list.json` #67, redactada en
   `design.md` §10— sigue sin aplicar, que es lo correcto: la aplica el humano.)
2. **El smoke en dev build de Android** (nunca Expo Go), con mascota **con
   foto** y **sin foto**, en tema **claro** y **oscuro** — las cuatro
   combinaciones, con la lista de `requirements.md` §Aprobación: nombre, raza y
   dato destacado legibles en las cuatro; sin banda gris ni oscura en la
   transición del degradado; selector alcanzable y utilizable; la foto sin
   recortar la cara del animal; y cambio de mascota posible con el detalle en
   error.

Añadir a esa lista: **O3** (el título "Inicio" ausente con hero) y el recorte de
`contentFit="cover"` sobre 260 px en fotos verticales.

**Sin esos dos gates, #67 no pasa a `done`**, tenga la trazabilidad las filas
que tenga.

---

## Output de `./init.sh`

Corrido por mí, en primer plano, tras comprobar con `pgrep -af init.sh` que no
había otra pasada en los worktrees hermanos, y tras borrar
`mobile-pet-tracker/.expo/types/router.d.ts`. **Exit code 0.**

```
→ Verificando entorno...
✅ node disponible (/usr/bin/node)
✅ pnpm disponible (/home/claude/.npm-global/bin/pnpm)
✅ bun disponible (/home/claude/.npm-global/bin/bun)

→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida
⚠️  .env desactualizado: faltan 3 claves de .env.example
⚠️    configuración ausente: RESEND_API_KEY, RESEND_FROM, RESET_LINK_HOST
⚠️    init.sh no modifica .env — añade a mano las que necesites desde .env.example

→ Instalando dependencias...
✅ Dependencias instaladas

→ Verificando coherencia del harness...
✅ Archivos del harness presentes
✅ Sin features en progreso (sesión limpia)
✅ STATUS.md sincronizado con feature_list.json

→ Build...
✅ Build exitoso

→ Ejecutando tests...
Test Suites: 163 passed, 163 total      ← backend
Tests:       1243 passed, 1243 total
Test Suites: 2 passed, 2 total          ← infra
Tests:       14 passed, 14 total
Test Suites: 65 passed, 65 total        ← móvil
Tests:       976 passed, 976 total
✅ Tests pasados

→ Tests e2e...
Test Suites: 3 skipped, 25 passed, 25 of 28 total
Tests:       8 skipped, 354 passed, 362 total
✅ Tests e2e pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 62/72 completadas | 10 pendientes
```

Log completo (11 877 líneas, casi todo avisos de `NodeVersionSupportWarning` del
AWS SDK, preexistentes) en el scratchpad de sesión, fuera del repo.

### Delta contra el baseline `303fc19`

| Suite | Baseline `303fc19` | Medido ahora | Delta |
|---|---|---|---|
| Móvil | 932/932 en 63 suites | **976/976 en 65 suites** | **+44 tests, +2 suites** |
| Backend | 1243/1243 en 163 | **1243/1243 en 163** | sin cambio |
| Infra | 14/14 | **14/14 en 2 suites** | sin cambio |
| e2e | 354 pasados, 8 saltados | **354 pasados, 8 saltados** | sin cambio |

Los cuatro coinciden **exactamente** con lo que reporta el implementer. Las dos
suites nuevas son `pet-hero-header.test.tsx` y `hero-header-amendments.test.ts`.
**Cero regresiones**: ningún test preexistente pasó a rojo ni desapareció.

El test flaky de selección de foto de add-pet (#72, deuda registrada) **no
apareció en rojo** en esta pasada; no hizo falta repetir.
