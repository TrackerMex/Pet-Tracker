# Handoff a Codex CLI — #99 `mobile-notifications-permission-recovery`

> Pegar el bloque de abajo en la terminal de Codex CLI. El humano lo lanza;
> el leader no lo ejecuta.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA: trabaja AQUI y solo aqui
Antes de tocar nada, confirma en el reporte: `pwd` y `git branch --show-current`.
Tienen que dar /home/claude/sites/Pet-Tracker-wt-backend y
feature/99-mobile-notifications-permission-recovery. Si no, PARA.
NO toques /home/claude/sites/Pet-Tracker: es el worktree de otra sesion.

Feature: mobile-notifications-permission-recovery (#99, P3),
branch: feature/99-mobile-notifications-permission-recovery
Spec aprobada por humano el 2026-09-25 (commit de firma 5a2c9b5a):
  specs/mobile-notifications-permission-recovery/requirements.md  (status: approved, R1-R4; R4 es del humano)
  specs/mobile-notifications-permission-recovery/design.md        (D1-D9, Archivos afectados)
  specs/mobile-notifications-permission-recovery/tasks.md         (orden, esqueleto, sondas y cierre: seguirlo tal cual)
  specs/mobile-notifications-permission-recovery/traceability.md  (se rellena UNA vez, en el commit final)
Lee las cuatro enteras antes de tocar nada. No viste la conversacion que las
origino: toda decision abierta ya esta cerrada por escrito ahi. El Contrato
(normativo) de requirements.md fija el codigo de produccion; los tests de
R1, R2 y R3 van literales desde requirements.md.

== QUE ES ==

Solo movil. Si el usuario deniega el permiso de notificaciones y Android ya
no deja pedirlo (granted false y canAskAgain false), hoy la app se queda sin
salida.
- R1: el hook de #79 (use-push-registration.ts) publica ese estado en un
  almacen de modulo; useNotificationsBlocked() lo lee con
  useSyncExternalStore. Al desmontar el hook, vuelve a false.
- R2: con el aviso encendido, al volver a 'active' (AppState) el hook relee
  el permiso SIN pedirlo (evaluate(false)) y, si quedo concedido, registra
  el token sin reiniciar la app.
- R3: Perfil pinta un Card con el aviso y un boton que llama a
  Linking.openSettings() (abre Informacion de la app). +2 claves de
  catalogo (profile.notificationsBlocked, profile.openSettings) con sus
  candados. Cero dependencias, ni intent de Android.

== BASE ==

La branch sale de origin/main d7cb0d60. Compruebalo con
`git merge-base --is-ancestor d7cb0d60 HEAD; echo "exit=$?"` (0).
mobile-pet-tracker/.expo/types/router.d.ts no existe ahora (el leader lo
comprobo). Antes de cada typecheck: `test ! -e .expo/types/router.d.ts; echo "exit=$?"`
desde mobile-pet-tracker/. Si da 1, PARA y avisa: tu sandbox deniega `rm -f`.

== FICHEROS (lista cerrada de design.md §Archivos afectados; un diff fuera de ella es un hallazgo del reviewer) ==

  mobile-pet-tracker/src/hooks/use-push-registration.ts
  mobile-pet-tracker/src/hooks/use-push-registration.test.tsx
  mobile-pet-tracker/src/screens/profile/index.tsx
  mobile-pet-tracker/src/screens/profile/index.test.tsx
  mobile-pet-tracker/src/i18n/catalog.ts
  mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
  mobile-pet-tracker/src/__tests__/ui-language.test.ts
  mobile-pet-tracker/src/__tests__/ui-copy-table.ts
  specs/mobile-ui-language/design.md                                         (solo dos filas en §2.7)
  specs/mobile-notifications-permission-recovery/traceability.md
  progress/impl_mobile-notifications-permission-recovery.md                  (lo creas tu)

NO cambian: src/app/_layout.tsx, src/providers/auth-provider.tsx,
src/screens/home/, src/components/, src/api/push-tokens.ts, src/theme/,
app.json, app.config.ts, package.json, bun.lock, docs/, backend-pet-tracker/,
infra/.

== SKILLS ==

- Carga `building-native-ui` (tu plugin expo) para R3.
- Carga la skill del repo `.agents/skills/appllama-app-design-skill` para
  R3: la carta docs/ui-guidelines.md la exige en toda UI movil. De ella se
  toma el patron, nunca el sistema de estilos: nada de hex, StyleSheet.create
  ni clases arbitrarias. La carta gana siempre sobre la skill.
- Tu plugin no tiene skill de router, ni de animacion, ni de design system:
  no cargues ninguna otra de expo. R1 y R2 son un hook y sus tests; las
  decisiones que haria falta (AppState, openSettings, copy, Card) ya estan
  cerradas en la spec (D1-D9).
- Di en el reporte que skills cargaste.

== REGLAS CRITICAS ==

- TDD por requisito, en el orden de tasks.md: R1, R2, R3. UN COMMIT POR
  PASO, el test rojo SIEMPRE antes que su verde; mensajes literales de tasks.md:
    1. test(push): publish the blocked notification permission state (R1)                            rojo + esqueleto
    2. feat(push): track a notification permission that can no longer be requested (R1)              verde
    3. test(push): re-evaluate the blocked permission when the app returns to the foreground (R2)    rojo
    4. feat(push): register the push token after returning from settings with permission (R2)        verde
    5. test(profile): show the blocked notifications notice with a settings action (R3)              rojo
    6. feat(profile): add the blocked notifications notice and its copy (R3)                         verde
    7. docs(push): fill #99 traceability                                                             final
  Un commit con test + implementacion juntos incumple C4 de CHECKPOINTS.md.
  La UNICA produccion que viaja en un rojo es el esqueleto de R1:
  `export function useNotificationsBlocked(): boolean` que devuelve false,
  al final de use-push-registration.ts.
- Rojos esperados (medidos por el spec_author), todos por asercion:
    commit 1: 3 rojos, 30 verdes (33 en el fichero del hook)
    commit 3: 7 rojos, 34 verdes (41 en el fichero del hook)
    commit 5: 7 rojos (los 5 it de #99 R3, `mantiene la base mas las claves
              de #68...` y `resuelve las 36 ocurrencias normativas`);
              `bunx tsc --noEmit` pasa en ese commit.
  Si un rojo sale distinto (otro numero, o por Cannot find module /
  ReferenceError / TypeError), PARA y escribelo en el reporte.
- Donde van los tests nuevos:
    #99 R1 y #99 R2 (con sus helpers): INMEDIATAMENTE ANTES de
      `describe('R15: importar el modulo no toca expo-notifications'`, en
      ese orden (R1, luego R2).
    #99 R3: AL FINAL de profile/index.test.tsx, despues de
      `describe('#72 R3: el mock del picker no hereda implementación entre tests'`.
- Los candados movidos (requirements §Candados «Se mueven») van
  exactamente donde dice tasks.md:
    en el ROJO de R3: ` + 2` en la suma de `expect(englishKeys).toHaveLength(`
      y en su comentario (language-provider.test.tsx); en ui-language.test.ts
      `resuelve las 36 ocurrencias normativas` y `35 - 1 + 2`.
    en el VERDE de R3: las dos filas de R7_PROFILE en ui-copy-table.ts (su
      campo key es TranslationKey: en el rojo no compilaria) y las dos filas
      de specs/mobile-ui-language/design.md §2.7, con el copy de D6. En
      design.md escribe las celdas con `|` y backticks normales, sin barras
      invertidas.
  Si al arrancar la suma de englishKeys ya no es la que cita requirements,
  el ` + 2` va sobre la que haya. NINGUN otro test existente puede cambiar
  (lista en requirements §Candados «Siguen verdes»): si otro se pone rojo,
  la implementacion esta mal; PARA y escribelo en el reporte.
- Valores esperados LITERALES de las tablas de R1, R2 y R3. Prohibido
  calcularlos en el test con simbolos de produccion (ni el catalogo, ni el
  hook). NOTICE_ES va literal.
- Codigo de test nuevo: nada de la forma `<palabra>-[` (lo vigila
  `describe('C8: la UI no usa clases arbitrarias'`).
- Sin comentarios nuevos en produccion. Sin anclas por numero de linea:
  localiza cada sitio con grep -n del texto que cita la spec.
- Movil: bun para todo (bunx, bun run); nunca npx ni npm. Cero dependencias.
- Jest siempre con --runTestsByPath. Rutas con `(tabs)` entre comillas
  simples, tal cual las escribe tasks.md.
- Haz las sondas de tasks.md §Sondas (M1-M7 y N1-N7 en el hook, P1-P9 en
  Perfil) y deja su rojo en el reporte comparado con las tablas de
  requirements; restaura cada una con `git diff` vacio. No se commitean.
- Trazabilidad: rellena los seis hashes UNA vez, en el commit final 7 (no
  tras cada commit).
- Si el sandbox te deniega un comando, PARA y reportalo; no lo sustituyas por
  otro que haga lo mismo.
- NO rebasees, NO mergees main, NO hagas push.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y el campo `status` de feature_list.json. Tu sitio para contarlo
  todo es progress/impl_mobile-notifications-permission-recovery.md.
- NO abras la PR. NO marques la casilla de R4: es del humano.

== ENTORNO ==

- NO corras ./init.sh ni el e2e (Postgres y LocalStack compartidos con otra
  sesion). La linea base la midio el leader con ./init.sh exit=0 en b602ff6e,
  y la suite movil otra vez en d7cb0d60; copialas al reporte:
    backend unit: 171 suites, 1307 tests; infra: 2 suites, 14 tests
    movil: 83 suites, 1508 tests en b602ff6e; 83 suites, 1510 tests en d7cb0d60
    e2e: 27 suites passed + 3 skipped (30), 389 tests passed + 8 skipped
- Mide tu al arrancar las bases de tasks.md "Antes de empezar" (hook 26,
  profile 33, language-provider 9 + ui-language 25, movil 83 / 1510).
- Aviso conocido: en una corrida completa de la suite movil el test
  "selects the first pet and loads its first position (#72 R2)" de
  src/screens/map/index.test.tsx ha fallado alguna vez y pasa solo. Si te
  pasa, correlo aislado, anotalo en el reporte y repite la suite completa;
  no toques ese fichero.
- Verificacion: SOLO los comandos de tasks.md §Cierre, sin pipe
  (`cmd; echo "exit=$?"`, nunca `cmd | tail`), incluidos los greps y el
  `git diff --stat origin/main...HEAD -- mobile-pet-tracker specs/mobile-ui-language`
  (exactamente los nueve ficheros).
- Recuentos esperados al cierre: hook 41, profile 38, las cuatro suites de
  §Cierre 9 + 25 + 2 + 1, movil 83 / 1530; typecheck y lint exit=0.

Criterios de aceptacion: R1-R3 de requirements.md (R4 lo firma el humano).

Al terminar: escribir el resultado en
progress/impl_mobile-notifications-permission-recovery.md (pwd y branch,
skills cargadas, bases medidas, salida de cada rojo y cada verde con sus
fallos esperados, candados movidos, sondas con su rojo, recuentos finales,
greps de cierre, git diff --stat, lista de commits con hash) y parar.
```
