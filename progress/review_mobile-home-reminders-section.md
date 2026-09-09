# review: mobile-home-reminders-section (#70) — CUARTO PASE

Fecha: 2026-09-09
Reviewer: subagente `reviewer` (Claude Opus 5)
Rango revisado: `e71e416..HEAD` (5 commits)
Branch: `feature/70-mobile-home-reminders-section`, HEAD `5eee969`, sincronizada con `origin`

## Veredicto: **APROBADO**

D8 es un cambio de copy de **cuatro valores** y eso es exactamente lo que hay en
el rango: `catalog.ts` (8 líneas) y `index.test.tsx` (6). Ningún fichero de
producción. Ninguna clave renombrada. Ningún recuento movido. El candado nuevo
fija los literales **nuevos** y **muerde**: dos sondas reproducidas por el
reviewer, cada una devolviendo el literal viejo, ponen la suite en rojo en la
línea esperada. `env -u FORCE_COLOR ./init.sh` **exit 0**, corrido por el
reviewer en primer plano.

Un hallazgo **no bloqueante** nuevo (**O7**): la mitad **inglesa** de D8 no
tiene candado — reproducido abajo.

---

## Las tres rondas anteriores, en corto

| Pase | HEAD | Veredicto | Qué lo decidió |
|---|---|---|---|
| **1º** | `82a1cbd` | **RECHAZADO** | **B1**: los candados de zona horaria de R5 eran **inertes** (`process.env.TZ` asignado dentro de un `it` no llega a V8 bajo Jest), así que M1 y M2 dejaban el gate verde |
| **2º** | `434f40c` | **APROBADO** | B1 cerrado por D5: espías de `Date.parse`/`Date.UTC`/constructor. M1 y M2 rojas sin `TZ`. Abiertos **O4** y **O5** |
| **3º** | `d8535f2` | **APROBADO** | D7 mete O4 y O5 en alcance, solo con cambios de test. M9 roja con la suite completa. Nuevo: **O6** (orden vertical nombre/fecha sin vigilar) |

---

## Qué cambió D8, y solo eso

| clave | antes (es / en) | ahora (es / en) |
|---|---|---|
| `home.reminders` | `Recordatorios` / `Reminders` | **`Próxima vacuna`** / **`Next vaccine`** |
| `home.remindersSeeAll` | `Ver todos` / `See all` | **`Ver recordatorios`** / **`See reminders`** |

Los cuatro valores de la tabla del encargo, ni uno más.

---

## Foco 1 — Que sea solo eso

**Inventario de claves, antes vs después**, comparado como conjunto ordenado:

```
diff <(git show e71e416:…/catalog.ts | grep -oE "^  '[a-zA-Z0-9._]+'" | sort) \
     <(git show HEAD:…/catalog.ts     | grep -oE "^  '[a-zA-Z0-9._]+'" | sort)
→ sin salida.  NINGUNA CLAVE RENOMBRADA, AÑADIDA NI ELIMINADA
```

`home.noUpcomingVaccine` **intacto** en los dos idiomas (`catalog.ts:59` `No
upcoming vaccine`, `catalog.ts:352` `Sin vacuna próxima`) — no aparece en el
diff.

Los demás `Recordatorios` del catálogo son de **otros ámbitos** y siguen igual:
`profile.reminders`, `reminders.reminders`, `addReminder.backToReminders`, y el
título de la pantalla en `screens/reminders/index.test.tsx:188`. Ninguno se
tocó, y ninguno debía tocarse.

## Foco 2 — La longitud del catálogo no se movió

`src/providers/__tests__/language-provider.test.tsx` **no aparece en el diff**
del rango. La línea del candado sigue literal:

```
language-provider.test.tsx:41   expect(englishKeys).toHaveLength(260 + 16 + 1 + 4 + 7);
```

Es el candado que paró la implementación en #68 y en #69. D8 cambia valores, no
cardinalidad, así que era el resultado correcto y es el que hay.

**Delta de R18 sin mover**: ninguno de los ficheros de recuento
(`language-provider.test.tsx`, `consistency-classnames.test.ts`,
`legibility-classnames.test.ts`) está en el diff. La única línea de recuento que
cambió en todo el rango es **prosa** del informe del implementer —fila 10 de la
tabla de deltas, `“Ver todos”` → `“Ver recordatorios”`— y el `Δ0` de esa fila se
conserva. Es un literal en una frase, no una cifra: exactamente lo que D8
autorizaba.

## Foco 3 — Producción intacta

`mobile-pet-tracker/src/screens/home/index.tsx` **no aparece en el diff**. Eso
cierra de un golpe los tres puntos: ningún `testID`, ningún `className`, ninguna
anatomía de sección. El cambio es de **catálogo y de test**, no de producción.

Destino de R10 sin tocar, en el fuente y en su candado:

```
index.tsx:517        onPress={() => router.push('/reminders')}
index.test.tsx:2110  expect(mockRouter.push).toHaveBeenCalledWith('/reminders');
index.test.tsx:2134  expect(quickActions).not.toContain("'/reminders'");   ← candado de #71, verde
```

## Foco 4 — El candado existe, está en orden, y muerde

**Orden correcto**, y cada commit con un solo fichero:

```
e794c96  test(…): lock D8 copy (R1,R10)        index.test.tsx  (+4 −2)   ← rojo
828889e  fix(…): align vaccine copy (R1,R10)   catalog.ts      (+4 −4)   ← verde
```

El candado fija los literales **nuevos**, no los viejos
(`index.test.tsx:1898` `'Próxima vacuna'`, `:1903` `'Ver recordatorios'`), y de
paso saca `reminders-see-all` a variable para poder afirmar su texto además de
su visibilidad.

**Sondas del reviewer** (una cada vez, árbol restaurado con `git checkout --`
después de cada una; línea base `-t "#70 R1"` → 18/18 verde):

```
SONDA A — catalog.ts:346  'Próxima vacuna'    -> 'Recordatorios'
  ✕ dibuja la cabecera y el cuerpo de la sección
    Expected instance to have text content:
    > 1898 | expect(title).toHaveTextContent('Próxima vacuna');
  Tests: 1 failed, 68 skipped, 17 passed, 86 total

SONDA B — catalog.ts:347  'Ver recordatorios' -> 'Ver todos'
  ✕ dibuja la cabecera y el cuerpo de la sección
    > 1903 | expect(seeAll).toHaveTextContent('Ver recordatorios');
  Tests: 1 failed, 68 skipped, 17 passed, 86 total
```

Las dos sondas juntas **son** el estado de `e794c96` (el test es byte-idéntico
en `e794c96` y en HEAD; `828889e` solo tocó el catálogo), así que el rojo que
declara el implementer queda reproducido, no aceptado de palabra.

## Foco 5 — Regresión

| Requisito | Estado | Comprobación |
|---|---|---|
| **R1** | verde | el candado de estructura sigue exigiendo dos hijos, `className` `gap-3`, cabecera/cuerpo en orden, y ahora los dos literales |
| **R10** | verde | destino, unicidad en el fuente, ausencia de `as Href`, y el candado de #71 sobre `QUICK_ACTIONS` — todos sin tocar |
| **R16** | verde | `ui-copy-table.ts:72-73` registra **nombres de clave**, no valores: D8 no le afecta. Las siete filas siguen siendo siete |
| **R18** | sin mover | ver Foco 2 |
| **R19b** | sin tocar | ninguna mutación se replantó; no hacía falta, D8 lo dice explícitamente |

**Recuento de tests sin cambio**: móvil **68 suites / 1078 tests**, el mismo
total de los pases anteriores (`1 fallo + 1077 verdes` = 1078). D8 añadió dos
`expect` dentro de un `it` existente, no un `it` nuevo — que es lo que debía
pasar.

**Base roja conocida**: `health-vaccines.e2e-spec.ts` **no está omitida** y
**pasó** en esta corrida. El e2e cerró 25 suites/354 tests en verde, 3 suites/8
tests omitidos. Es decir: en este gate no hubo rojo ajeno que excusar.

---

# Hallazgo no bloqueante

## O7 — La mitad inglesa de D8 no tiene candado

Devolví **los dos** valores ingleses a su copy anterior y corrí la suite móvil
**entera**:

```
catalog.ts:53  'home.reminders':        'Next vaccine'  -> 'Reminders'
catalog.ts:54  'home.remindersSeeAll':  'See reminders' -> 'See all'

Test Suites: 68 passed, 68 total
Tests:       1078 passed, 1078 total      ← NADA se puso rojo
```

Nada vigila los valores en inglés: `language-provider.test.tsx` compara
**claves** y **marcadores**, no textos, y `ui-language.test.ts` /
`ui-copy-table.ts` trabajan sobre nombres de clave. El único candado literal
mira el español, que es el idioma por defecto del render.

**Por qué no bloquea**: es la práctica preexistente de toda la suite, no una
regresión que introduzca D8; y la propia enmienda pide "el rojo del candado de
literal, **si existe**", en singular. Añadir ahora una aserción inglesa sería
alcance por encima de los dos valores autorizados. **Dónde ponerlo**: como
decisión de #85, que ya va a rehacer estos textos.

La ironía merece quedar escrita: D8 nace de un texto que ningún test miraba, y
deja la otra mitad del mismo texto igual de ciega.

---

# Coherencia de producto (opinión, no bloquea)

Me lo preguntas porque es lo que falló la primera vez, así que lo mojo.

**El conjunto se lee coherente, y mejor que antes en los dos frentes.**

- **Título + estado vacío**: `Próxima vacuna` / `Sin vacuna próxima` ya no
  mienten. El caso que destapó el smoke —mascota **con** recordatorios y **sin**
  vacuna próxima— ahora aterriza en una sección que dice de qué habla y por qué
  está vacía. El defecto está cerrado por donde D8 quería cerrarlo.
- **Título + rótulo del enlace**: `Próxima vacuna` con `Ver recordatorios`
  debajo es un salto de ámbito, sí — pero es un salto **honesto**, y es una
  mejora sobre `Ver todos`. `Ver todos` bajo `Próxima vacuna` habría prometido
  "todas las vacunas" y llevado a otra pantalla; `Ver recordatorios` dice
  exactamente dónde caes, y la pantalla de destino se titula `Recordatorios`.
  El rótulo y el destino concuerdan.
- **Lo que chirría, menor**: `Próxima vacuna` / `Sin vacuna próxima` es un eco de
  las mismas dos palabras invertidas. Es gramatical y claro; solo suena un poco
  a espejo. No lo tocaría por sí solo.
- **Deuda de nombres, para que #85 no se confunda**: los `testID`
  (`reminders-section`, `reminders-see-all`) y las claves i18n (`home.reminders*`)
  siguen diciendo "recordatorios" mientras la copy visible dice "vacuna". D8
  prohibía renombrar y hace bien —renombrar habría movido el inventario—, pero
  el desfase queda ahí. **#85 es el sitio donde se vuelve a alinear**, cuando la
  sección muestre recordatorios de verdad y el nombre vuelva a ser el correcto.

---

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` (#70, `feature_list.json:1312`)
- [x] `progress/current.md` actualizado con el cuarto pase, su plan, el rojo/verde y el siguiente paso

## Checklist C3 — Arquitectura
- [x] N/A por capas backend: el rango no toca `backend-pet-tracker/`
- [x] Móvil: catálogo i18n y test; ninguna capa cruzada, ninguna lógica nueva

## Checklist C4 — TDD
- [x] `e794c96` (test, rojo) **precede** a `828889e` (fix, verde); un fichero cada uno
- [x] Los dos commits nombran sus R-ids `(R1,R10)`
- [x] El rojo está reproducido por el reviewer, no aceptado del informe

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente"; R1, R10, R16 y R19 amplían su columna de commits con los hashes de D8
- [x] Formato `tipo(scope): desc (R-ids)` respetado en los cuatro commits de IA
- [x] El gate humano del §final actualiza el rótulo `"Ver todos"` → `"Ver recordatorios"`, que es lo que el humano tendrá que pulsar

## Checklist C6 — Spec aprobada
- [x] `requirements.md` `status: approved`
- [x] Casilla de D8 (`requirements.md:1236`) marcada por el **humano** en `28ebba8`, `AlexisSM377 <al222111377@gmail.com>`, verificado con `git blame` sobre esa línea exacta
- [x] El commit humano toca **una línea y nada más** — sin código colado (la comprobación que #59 obligó a añadir)
- [x] La firma **precede** al primer commit de implementación

## Checklist C7 — Sin código huérfano
- [x] N/A — D8 sustituye **valores**, no componentes. Nada que eliminar; el arreglo de fondo es #85

## Checklist C8 — UI móvil
- [x] Sin cambios de estilo, token, icono ni layout: `index.tsx` fuera del diff
- [ ] Verificación visual en dev build — **es el gate humano abierto**, y es justo lo que D8 vino a arreglar

---

## Gates humanos pendientes — ninguno lo puede cerrar una IA

1. **Aprobación de la spec** — **CERRADO** (`40413db` D1-D3, `6eae6ed` D4-D6,
   `4e4efdd` D7, `28ebba8` D8).
2. **Prueba de humo en dev build de Android** — **ABIERTO, y ahora obligatorio
   repetirlo**: es el smoke el que destapó D8, así que hay que volver a pasarlo
   con los rótulos nuevos. En los **dos temas**, con los cuatro escenarios:
   - mascota **con** vacuna próxima: fila completa (icono, nombre, fecha
     localizada, contador `N d`), **con el nombre arriba y la fecha debajo** —
     O6 sigue diciendo que si ese orden se invirtiera, ningún test lo diría;
   - mascota **sin** vacuna próxima: cabecera **`Próxima vacuna`** sobre estado
     vacío **`Sin vacuna próxima`** —el par que D8 arregla—, con la sección
     conservando su altura y el icono **a la izquierda** del texto;
   - enlace **`Ver recordatorios`** (rótulo nuevo): abre la lista de
     recordatorios y el botón "Nuevo" de esa pantalla sigue funcionando;
   - tile **"Recordatorio"** de #71 en la misma sesión: lleva al **alta**, no a
     la lista.

   Memoria del proyecto, explícita: **dev build de Android, no Expo Go**.
3. **Merge del PR** a `main` — el leader abre el PR, el humano mergea
   (`docs/conventions.md` §Branches y Pull Requests).

**Tareas de cierre del leader, no gates**: `STATUS.md` sigue desactualizado
(66/81 declarado vs 66/85 real, por ids abiertos por el leader, no por esta
feature); abrir/confirmar **#85** con el arreglo de fondo y la decisión de O7; y
marcar `status: "done"` en `feature_list.json` **solo tras el smoke**.

---

## Output de `./init.sh`

Corrido por el reviewer, en primer plano, con el árbol limpio, tras comprobar
con `ps` que **ningún** `bash ./init.sh` estaba vivo (los dos aciertos de
`pgrep` eran el propio patrón: un bucle de espera y mi propia orden).

```
Test Suites: 3 skipped, 25 passed, 25 of 28 total
Tests:       8 skipped, 354 passed, 362 total
Time:        75.431 s
✅ Tests e2e pasados

→ Lint...
> backend-pet-tracker@0.0.1 lint  → eslint "{src,apps,libs,test}/**/*.ts" --fix
> pet-tracker-infra@0.0.1 lint    → eslint "{bin,lib,test}/**/*.ts"
$ expo lint
✅ Lint sin errores

→ Typecheck...
$ tsc --noEmit
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 66/85 completadas | 18 pendientes
```

Suite móvil, corrida aparte para dejar la cifra registrada:

```
Test Suites: 68 passed, 68 total
Tests:       1078 passed, 1078 total
Snapshots:   1 passed, 1 total
```

Los avisos de `NodeVersionSupportWarning` (node v20 vs AWS SDK) son los no
bloqueantes de siempre del harness.

---

## Sondas ejecutadas por el reviewer

```
A  catalog.ts:346  'Próxima vacuna'    -> 'Recordatorios'    -> ROJO  (:1898)
B  catalog.ts:347  'Ver recordatorios' -> 'Ver todos'        -> ROJO  (:1903)
C  catalog.ts:53-54  ambos valores EN  -> copy anterior      -> VERDE 1078/1078  → O7
```

Árbol restaurado con `git checkout -- src/i18n/catalog.ts` tras cada sonda;
`git status --porcelain` vacío al terminar.
