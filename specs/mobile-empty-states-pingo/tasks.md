---
feature: "mobile-empty-states-pingo"
status: draft        # draft | approved
tags: [harness, spec, mobile, ui-delight]
---

# Tareas — [[mobile-empty-states-pingo]] (#155)

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.

## Reglas de todas las tareas

- **Rutas.** Los comandos se lanzan desde la raíz del repo. Los de jest
  entran antes en `mobile-pet-tracker/`. «El test del componente» es
  `mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx`.
- **Cómo medir.** Cada paso se mide con el fichero concreto y **sin pipe**,
  para que el código de salida sea el de jest:

  ```bash
  cd mobile-pet-tracker && bunx jest src/components/__tests__/empty-state.test.tsx; echo "exit=$?"
  ```

- **Paréntesis en rutas.** El test de Comida está en `src/app/(tabs)/`. Para
  jest la ruta es una regex: sin escapar, `(tabs)` no casa y jest sale con
  `exit=0` sin correr nada. Se escribe siempre así, entre comillas simples:

  ```bash
  cd mobile-pet-tracker && bunx jest 'src/app/\(tabs\)/__tests__/food.test.tsx'; echo "exit=$?"
  ```

  Comprueba en la salida que `Tests:` cuenta más de 0 tests.
- **Gestor de paquetes.** `bun` y `bunx`, nunca `npm` ni `npx`. Esta feature
  no instala nada (R11).
- **Commits test-primero.** Cada tarea de la R1 a la R9 deja **dos commits**
  como mínimo:
  1. `test(mobile-empty-states): #155 R<n> red <qué>`, solo con tests (y los
     candados de §Candados que mueve esa R), medido en rojo antes de
     commitear;
  2. `feat(mobile-empty-states): #155 R<n> <qué>`, con la implementación,
     medido en verde.

  Un commit que mezcle tests e implementación incumple C4 de
  `CHECKPOINTS.md`. El refactor, si lo hay, va en un tercer commit
  `refactor(mobile-empty-states): …`. R10 y R11 son candados que nacen en
  verde: su rojo se demuestra con sondas (ver cada tarea).
- **Esperas.** Rige `docs/conventions.md` §Esperas sobre el árbol
  renderizado. Los `it` nuevos de pantalla esperan igual que el `it`
  existente cuyo arreglo copian (`findByTestId` o `waitFor` sobre el nodo,
  nunca sobre el contador de un mock).
- **Literales.** Los literales de copy, de clases, de rutas y de nombres de
  fichero se copian de requirements.md byte a byte. Ningún test importa el
  valor que comprueba.
- **Texto entero.** En RNTL 14, `toHaveTextContent` compara el texto entero.
  Toda espera de texto lleva el literal completo, nunca un fragmento. Por eso
  los `toHaveTextContent` sobre el raíz de un vacío ilustrado se mueven a
  `-title` (C15).
- **Estilos en los tests.** Ningún test nuevo usa `StyleSheet`, hex ni
  clases arbitrarias: design-drift también recorre los tests. Los estilos
  estáticos se leen con `props.style` y `toEqual`.
- **Comentarios.** Toda cita a la feature en código de producción se
  escribe `#155 R<n>`, nunca `#155` suelto (lo caza `HEX_LITERAL`).
- **Sondas.** Una sonda se revierte con `git checkout HEAD -- <fichero>` y
  se comprueba con `git diff --cached --quiet && git diff --quiet; echo "limpio=$?"`,
  que debe dar `limpio=0`. Nunca `git checkout <commit> -- <fichero>`: deja
  el cambio en el índice.
- **Trazabilidad.** Tras el commit verde de cada tarea, rellena su fila en
  `specs/mobile-empty-states-pingo/traceability.md`.
- **Si algo no cuadra con la spec, para.** Escríbelo en
  `progress/impl_mobile-empty-states-pingo.md` y no improvises.

## T0 — Arranque

Antes de escribir nada, comprueba estas anclas. Cada comando lleva al lado su
salida esperada. **Si alguna no da lo esperado, para y repórtalo**: la base no
es la que la spec supone. Las filas marcadas (153) dependen del merge de #153;
el leader las re-verifica antes del handoff (design.md §Dependencia de #153).

| # | Comando | Salida esperada |
|---|---|---|
| A1 | `test ! -e mobile-pet-tracker/.expo/types/router.d.ts && echo ok` | `ok`. Si falla, no lo borres tú: pídeselo al humano |
| A2 | `test ! -e mobile-pet-tracker/src/components/empty-state.tsx && echo ok` | `ok` |
| A3 (153) | `grep -cF '+ 1, // #153 R1' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx` | `1` |
| A4 (153) | `grep -cF "['pingo-wave-blink.webp', 'pingo-wave.webp']" mobile-pet-tracker/src/screens/welcome/index.test.tsx` | `1` |
| A5 (153) | `grep -cF '### §2.20 — Añadidos por #153 — Pingo en la bienvenida' specs/mobile-ui-language/design.md` | `1` |
| A6 | `grep -cF '## 3. La infraestructura' specs/mobile-ui-language/design.md` | `1` |
| A7 | `grep -cF '13 + 1 + 1 + 1); // #146 R8, #146 R9; #118 R7' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` | `2` |
| A8 | `grep -cF 'expect(R3_HOME).toHaveLength(21 + 15 + 1 + 4 + 7 + 2 + 1 + 2);' mobile-pet-tracker/src/__tests__/ui-language.test.ts` | `1` |
| A9 | `grep -cF 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3); // +1 #90 R5, +1 #95 R4, -2 #95 R5, +3 #115 R1' mobile-pet-tracker/src/__tests__/ui-language.test.ts` | `1` |
| A10 | `grep -cF 'expect(R6_FOOD).toHaveLength(35 + 3 + 1 - 2 + 1 + 3 + 9 + 11); // #105 R5; +1 #95 R4, -2 #95 R5, +1 #113 R3, +3 #147 R8, +9 #147 R9' mobile-pet-tracker/src/__tests__/ui-language.test.ts` | `1` |
| A11 | `grep -cF 'expect(R4_MAP).toHaveLength(17);' mobile-pet-tracker/src/__tests__/ui-language.test.ts` | `1` |
| A12 | `grep -cF 'expect(R8_REMINDERS).toHaveLength(50 + 1 - 2 + 1 - 1); // +1 #95 R4, -2 #95 R5, +1 #114 R4, -1 #114 R5' mobile-pet-tracker/src/__tests__/ui-language.test.ts` | `1` |
| A13 | `grep -cF 'expect(R14_GEOFENCES).toHaveLength(18);' mobile-pet-tracker/src/__tests__/ui-language.test.ts` | `1` |
| A14 | `grep -cF "{ file: 'src/screens/alerts/index.tsx', key: 'alerts.empty' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts` | `1` |
| A15 | `grep -cF "{ file: 'src/screens/reminders/index.tsx', key: 'reminders.noRemindersYet' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts` | `1` |
| A16 | `grep -cF "{ file: 'src/screens/geofences/index.tsx', key: 'geofences.empty' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts` | `1` |
| A17 | `grep -cF "{ file: 'src/app/(tabs)/food.tsx', key: 'food.noMealPlanYet' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts` | `1` |
| A18 | bloque A18, debajo de la tabla | `4` |
| A19 | bloque A19, debajo de la tabla | `12` |
| A20 | bloque A20, debajo de la tabla | `0` |
| A21 | bloque A21, debajo de la tabla | una línea `<id> 1` por cada uno de los 7 testID |
| A22 | `grep -cF "expect(screen.getByTestId('alerts-empty').props.className).toBe(" mobile-pet-tracker/src/screens/alerts/index.test.tsx` | `1` |
| A23 | `grep -cF "es['alerts.empty']," mobile-pet-tracker/src/screens/alerts/index.test.tsx` | `1` |
| A24 | `grep -cF "it('pinta el vacío con su tarjeta y su copy'" mobile-pet-tracker/src/screens/geofences/index.test.tsx` | `1` |
| A25 | `grep -cF "getByTestId('docs-empty')" mobile-pet-tracker/src/screens/docs/index.test.tsx` | `1` |
| A26 | `grep -cF "['home-empty', () => mockListPets.mockResolvedValue({ kind: 'ok', pets: [] }), []]," mobile-pet-tracker/src/screens/home/index.test.tsx` | `1` |
| A27 | `grep -cF "import { router" mobile-pet-tracker/src/screens/map/index.test.tsx` | `0` |
| A28 | `ls /home/claude/pet-tracker-mascot/webp/` | los 8 ficheros `pingo-*.webp` de R2 y #153 (los 6 de R2 los convierte el leader antes del handoff) |
| A29 | `git diff --stat origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock` | vacío |

Los comandos con `|` van aquí, fuera de la tabla, para copiarlos tal cual:

```bash
# A18. Las 4 filas common.noPetsYet de las pantallas de R4. Esperado: 4
grep -cE "\{ file: 'src/(screens/home/index|screens/health/index|app/\(tabs\)/food|screens/map/index)\.tsx', key: 'common\.noPetsYet' \}," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
# A19. Los 6 títulos de R1 en los dos idiomas. Esperado: 12
grep -cE "^\s+['\"](common\.noPetsYet|alerts\.empty|reminders\.noRemindersYet|geofences\.empty|food\.noMealPlanYet|docs\.emptyBody)['\"]:" mobile-pet-tracker/src/i18n/catalog.ts
# A20. Nadie usa EmptyState todavía. Esperado: 0
grep -rlE '<EmptyState\b' mobile-pet-tracker/src | wc -l
# A21. Los toHaveTextContent que C15 mueve a -title. Esperado: «<id> 1» en las 7 líneas
for p in "home-empty:src/screens/home/index.test.tsx" "health-empty:src/screens/health/index.test.tsx" "food-empty:src/app/(tabs)/__tests__/food.test.tsx" "food-plan-empty:src/app/(tabs)/__tests__/food.test.tsx" "map-no-pets:src/screens/map/index.test.tsx" "alerts-empty:src/screens/alerts/index.test.tsx" "reminders-empty:src/screens/reminders/index.test.tsx"; do id=${p%%:*}; echo "$id $(grep -cF "getByTestId('$id')).toHaveTextContent(" "mobile-pet-tracker/${p#*:}")"; done
```

Después:

1. Apunta en `progress/impl_mobile-empty-states-pingo.md` el resultado de
   `git rev-parse HEAD`. Es el **HEAD del handoff**, la base del diff de R11.
2. Mide en verde, sin pipe, cada fichero de test que vas a tocar (design.md
   §Archivos afectados, «Tests que cambian»). El de Comida, con la ruta
   escapada. Si alguno nace rojo, para y repórtalo.

## Orden

El orden es el numérico, R1 a R12. Ninguna tarea asevera un nodo que cree
una tarea posterior:

- R1 crea las claves que pintan R4 a R9;
- R2 crea los ficheros que `require` R3;
- R3 crea el componente que usan R4 a R9;
- R10 y R11 cierran el resultado de R3 a R9.

## T1 — R1: el copy de los vacíos existe en los dos idiomas

- [ ] (1) Test rojo: crea el test del componente con el describe
  `#155 R1: el copy de los vacíos existe en los dos idiomas` y sus `it` de
  requirements.md R1. Aplica C1 en `language-provider.test.tsx`. Rojo
  esperado: los `declara %s…` (valores `undefined` o viejos), los
  `registra…` (§2.21 no existe) y el recuento del catálogo (366 frente a
  371). Commit `test(mobile-empty-states): #155 R1 red copy de los vacíos`.
- [ ] (2) Implementación mínima: las cinco claves y el valor nuevo de
  `docs.emptyBody` en `en` y `es` de `src/i18n/catalog.ts`, cada clave en la
  línea siguiente a su título; §2.21 en `specs/mobile-ui-language/design.md`
  antes de `## 3. La infraestructura` (C18). Mide en verde el test del componente
  y `src/providers/__tests__/language-provider.test.tsx`. Commit
  `feat(mobile-empty-states): #155 R1 copy de los vacíos`.
- [ ] (3) Refactor: ninguno previsto.

## T2 — R2: las seis poses entran como WebP

- [ ] (1) Test rojo: describe `#155 R2: las poses de los vacíos entran como WebP`
  en el test del componente, y C2 en `src/screens/welcome/index.test.tsx`
  (lista de 8 nombres). Rojo esperado: `ENOENT` en las seis filas y la lista
  de C2 (2 frente a 8). Commit
  `test(mobile-empty-states): #155 R2 red poses WebP`.
- [ ] (2) Implementación mínima: copia los seis WebP con el comando de
  design.md §Assets. Mide en verde el test del componente y el de la
  bienvenida. Commit `feat(mobile-empty-states): #155 R2 poses WebP`.
- [ ] (3) Refactor: ninguno.

## T3 — R3: un único componente pinta los vacíos ilustrados

- [ ] (1) Test rojo: describe
  `#155 R3: un único componente pinta los vacíos ilustrados` en el test del
  componente, con `import { EmptyState } from '../empty-state';` en la
  cabecera, y C3 en `src/__tests__/consistency-classnames.test.ts`. Rojo
  esperado: `Cannot find module '../empty-state'`, que tumba el fichero
  entero (también R1 y R2, que vuelven en el verde), y los dos recuentos de
  C3 (16 frente a 17). Commit
  `test(mobile-empty-states): #155 R3 red componente EmptyState`.
- [ ] (2) Implementación mínima: `src/components/empty-state.tsx` según
  requirements.md R3. Mide en verde el test del componente y
  `src/__tests__/consistency-classnames.test.ts`. Commit
  `feat(mobile-empty-states): #155 R3 componente EmptyState`.
- [ ] (3) Refactor: ninguno previsto.

## T4 — R4: sin mascotas, Pingo se presenta en cuatro pantallas

Un ciclo rojo-verde para las cuatro pantallas juntas, porque comparten copy
y filas de `ui-copy-table.ts`.

- [ ] (1) Test rojo, en un solo commit:
  - el describe `#155 R4: <pantalla> sin mascotas presenta a Pingo` en los
    cuatro tests de pantalla, con sus dos `it`;
  - en el test del mapa, `import { router } from 'expo-router';` y
    `const mockRouter = jest.mocked(router);` si no existe (A27);
  - C15 para `home-empty`, `health-empty`, `food-empty` y `map-no-pets`;
  - C11 (8 filas) y C4, C5, C6 (parte R4) y C7.

  Rojo esperado: los `-pose`, `-title`, `-body` y `-action` que no existen,
  y `checkUses` de los cuatro bloques (filas sin su `t()`). Commit
  `test(mobile-empty-states): #155 R4 red sin mascotas`.
- [ ] (2) Implementación mínima: el `EmptyState` de R4 en las cuatro
  pantallas, `router.push('/pets/add')` sin cast; solo el mapa añade `router` (enmienda E1). Mide en
  verde, sin pipe: los cuatro tests de pantalla (Comida con la ruta
  escapada) y `src/__tests__/ui-language.test.ts`. Commit
  `feat(mobile-empty-states): #155 R4 sin mascotas`.
- [ ] (3) Refactor: ninguno.

## T5 — R5: sin alertas, Pingo duerme

- [ ] (1) Test rojo: describe `#155 R5: sin alertas, Pingo duerme` en
  `src/screens/alerts/index.test.tsx`; C15 y C16 en el `it`
  `pinta el estado vacío` (el valor esperado pasa a literal); C10. Si
  `es` de `'../../i18n/catalog'` se queda sin uso en el fichero, quita el
  import. Commit `test(mobile-empty-states): #155 R5 red alertas`.
- [ ] (2) Implementación: el `EmptyState` de R5. Mide en verde el test de
  alertas y `ui-language.test.ts`. Commit
  `feat(mobile-empty-states): #155 R5 alertas`.
- [ ] (3) Refactor: ninguno.

## T6 — R6: sin recordatorios, Pingo sostiene su lista

- [ ] (1) Test rojo: describe `#155 R6: sin recordatorios, Pingo sostiene su lista`
  en `src/screens/reminders/index.test.tsx`; C15; C12 y C8. Commit
  `test(mobile-empty-states): #155 R6 red recordatorios`.
- [ ] (2) Implementación: el `EmptyState` de R6. Mide en verde el test de
  recordatorios y `ui-language.test.ts`. Commit
  `feat(mobile-empty-states): #155 R6 recordatorios`.
- [ ] (3) Refactor: ninguno.

## T7 — R7: sin documentos, Pingo los guarda

- [ ] (1) Test rojo: describe `#155 R7: sin documentos, Pingo los guarda` en
  `src/screens/docs/index.test.tsx`, con el arreglo de
  `it('shows a dedicated empty state'`. Commit
  `test(mobile-empty-states): #155 R7 red documentos`.
- [ ] (2) Implementación: el `EmptyState` de R7 en lugar de la `Card`
  `docs-empty`; `Card` sigue importado. Mide en verde el test de documentos
  y `ui-language.test.ts` (sin filas nuevas). Commit
  `feat(mobile-empty-states): #155 R7 documentos`.
- [ ] (3) Refactor: ninguno.

## T8 — R8: sin zonas seguras, Pingo enseña el collar

- [ ] (1) Test rojo: en `src/screens/geofences/index.test.tsx`, borra el
  `it` de C17 y añade el describe
  `#155 R8: sin zonas seguras, Pingo enseña el collar`; C13 y C9. Commit
  `test(mobile-empty-states): #155 R8 red zonas seguras`.
- [ ] (2) Implementación: el `EmptyState` de R8 en lugar de la `Card`
  `geofences-empty`. Si `Card` se queda sin uso en el fichero, quita su
  import. Mide en verde el test de zonas seguras y `ui-language.test.ts`.
  Commit `feat(mobile-empty-states): #155 R8 zonas seguras`.
- [ ] (3) Refactor: ninguno.

## T9 — R9: sin plan de comidas, Pingo enseña el cuenco

- [ ] (1) Test rojo: describe
  `#155 R9: sin plan de comidas, Pingo enseña el cuenco` en
  `src/app/(tabs)/__tests__/food.test.tsx`; C15 para `food-plan-empty`; C14
  y la parte R9 de C6. Commit
  `test(mobile-empty-states): #155 R9 red plan de comidas`.
- [ ] (2) Implementación: el `EmptyState` de R9. Mide en verde el test de
  Comida (ruta escapada) y `ui-language.test.ts`. Commit
  `feat(mobile-empty-states): #155 R9 plan de comidas`.
- [ ] (3) Refactor: ninguno.

## T10 — R10: los vacíos que no se ilustran siguen en texto

Candado que nace en verde: cierra lo que dejaron T4 a T9.

- [ ] (1) Test: describe
  `#155 R10: los vacíos que no se ilustran siguen en texto` en el test del
  componente. Mide en verde. Después, dos sondas, cada una medida en rojo y
  revertida (§Reglas, «Sondas»):
  - S1: en `src/screens/profile/index.tsx`, cambia
    `<Text testID="profile-pets-empty"` por
    `<EmptyState testID="profile-pets-empty"`. Rojo esperado: la fila
    `profile-pets-empty` del primer `it.each` y
    `ningún otro fichero usa EmptyState`.
  - S2: en `src/screens/alerts/index.tsx`, cambia `<EmptyState` por
    `<EmptyStateX`. Rojo esperado: la fila de alertas del segundo `it.each`
    y `ningún otro fichero usa EmptyState`.

  Apunta las dos sondas, con su salida roja resumida, en
  `progress/impl_mobile-empty-states-pingo.md`. Commit
  `test(mobile-empty-states): #155 R10 candado de vacíos en texto`.
- [ ] (2) Implementación: ninguna.
- [ ] (3) Refactor: ninguno.

## T11 — R11: sin movimiento ni dependencias

- [ ] (1) Test: describe
  `#155 R11: los vacíos no traen movimiento ni dependencias` en el test del
  componente. Mide en verde. Sonda S3: añade
  `import Animated from 'react-native-reanimated';` a
  `src/components/empty-state.tsx`; rojo esperado en los dos `it`; revierte.
  Apúntala en el progress. Commit
  `test(mobile-empty-states): #155 R11 candado sin movimiento`.
- [ ] (2) Implementación: ninguna. Comprueba
  `git diff --stat <HEAD del handoff> -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock`:
  salida vacía.
- [ ] (3) Cierre de la suite: `./init.sh` desde la raíz, **sin pipe**, y
  `echo "exit=$?"` debe dar `exit=0`. Si el clasificador te lo deniega,
  dilo en el progress y no lo sustituyas por otra cosa: lo corre el leader.

## T12 — R12: smoke del humano en dev build de Android

- [ ] (1) No hay test automático. El implementador deja en
  `progress/impl_mobile-empty-states-pingo.md` los pasos de requirements.md
  R12, listos para el humano.
- [ ] (2) El humano corre el smoke en la dev build de Android, nunca en Expo
  Go, con `bunx expo start --dev-client` desde `mobile-pet-tracker/`.
- [ ] (3) El humano marca la casilla «Smoke R12» de requirements.md
  §Aprobación con su fecha.
