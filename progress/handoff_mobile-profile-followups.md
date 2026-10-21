# Handoff a Codex CLI — feature #184 mobile-profile-followups

> Pegar el bloque de abajo (desde la linea `Worktree:` hasta el final) en Codex CLI.
> Spec firmada en `816a66bb` (aprobacion via Notion, `page_last_edited_at`
> 2026-10-20T16:11:28.970Z). Las dos decisiones de §Decisiones humanas pendientes
> quedan en su valor por defecto: R2 incluida (cambia produccion) y cadena de R4
> la del precedente de geofence-editor.
>
> Base medida por el leader el 2026-10-20 en este worktree, antes de escribir
> este fichero, sin otra sesion corriendo jest (load average 4.7), FORCE_COLOR=0,
> sin pipe: `profile/index.test.tsx` exit=0 142 passed; `pet-switcher.test.tsx`
> exit=0 7 passed; `bunx tsc --noEmit` exit=0; `router.d.ts` ausente. El
> `init.sh` previo (`init184-rojo.log`) salio rojo solo por carga (load 44, jest
> de otro worktree a la vez): 6 suites ajenas con timeouts de 5 s. No es
> regresion de esta feature.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-184   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro salidas
al principio de progress/impl_mobile-profile-followups.md. El hash es H0 (el
commit que anade este handoff). PARA si la branch no es
feature/184-mobile-profile-followups o si `git status --short` no sale vacio.
No toques /home/claude/sites/Pet-Tracker ni ningun otro worktree
(Pet-Tracker-wt-188, -189, -191, -194 ...), ni cambies de branch en ninguno.

Feature: mobile-profile-followups (#184)
Branch: feature/184-mobile-profile-followups
Spec aprobada: specs/mobile-profile-followups/requirements.md (status: approved,
firma 816a66bb). No reabras ninguna decision. Lee tambien, enteros:
specs/mobile-profile-followups/design.md (tabla de mutaciones X1 a X15 con su
rojo esperado por consulta), tasks.md (es tu guion) y traceability.md.

== QUE HACES ==

Cinco requisitos de codigo, en el orden de tasks.md: R5, R1, R3, R4, R2.
- R5, R1, R3 y R4 son SOLO TEST sobre codigo que ya cumple: nacen verdes. Un commit
  `test(...)` cada uno con el mensaje exacto de tasks.md. Su rojo se demuestra por
  mutacion (o spike, en R5): plantas, mides, REVIERTES con `git checkout HEAD -- <ruta>`
  y comprobas `git diff --stat` vacio antes de commitear. Ninguna mutacion se commitea.
  Anota en el impl cuales salieron verdes sin implementacion.
- R2 es el UNICO cambio de produccion y exige historial rojo -> verde: primero un
  commit `test(profile): require a reentry guard on the photo picker (R2)` (el
  `it` del doble toque en rojo con `Expected number of calls: 1, Received number of
  calls: 2`; las siete filas de liberacion nacen verdes), y despues un commit
  `fix(profile): ignore photo taps while a picker or upload is in flight (R2)`.
  Si escribes la guardia antes que su test, R2 pierde el historial (C4 de
  CHECKPOINTS.md; en #19 se metio todo en un commit y no vale).
- Total: exactamente 7 commits entre H0 y HEAD, en este orden: R5, R1, R3, R4,
  R2-test, R2-fix y `docs(profile): trazabilidad de #184`. Comprobalo con
  `git rev-list --count <H0>..HEAD` al terminar.
- Trazabilidad: specs/mobile-profile-followups/traceability.md se rellena entera UNA
  vez, en el commit final `docs(profile): trazabilidad de #184`, junto con
  progress/impl_mobile-profile-followups.md. Ningun commit de R1 a R5 la toca. Sin
  rebasear despues (los hashes dejarian de valer).
- Mide con `FORCE_COLOR=0` delante de `bunx jest` y la salida a un fichero fuera del
  arbol, SIN pipe (`> log 2>&1; echo "exit=$?"`).

== BASE ==

origin/main = f32b8d13 y la branch parte de el. Desde mobile-pet-tracker/:
- `test -d node_modules && echo presente` (ya instalado). `.env` ya esta en la raiz.
- `test ! -e .expo/types/router.d.ts; echo "exit=$?"` -> exit=0 antes de cada
  `bunx tsc --noEmit`. Si da 1, PARA y pide al humano que lo borre. Nunca `rm -f`.
- No lances init.sh: lo corre el leader.
- `pgrep -af '[i]nit\.sh'` sin pipe: si sale algo, otra sesion usa la maquina: espera
  antes de correr jest. Los timeouts de 5 s con jest concurrente son carga, no
  regresion: mide sin flag extra y repite antes de llamar nada regresion.

Base medida por el leader, FORCE_COLOR=0, sin pipe, exit=0:
  src/screens/profile/index.test.tsx                      142 passed
  src/components/__tests__/pet-switcher.test.tsx            7 passed
  bunx tsc --noEmit                                         exit=0
Tu medida manda: repitela antes del primer commit y anotala en el impl.

== ANCLAS ==

Desde la RAIZ del worktree antes de tocar nada; copia la salida al impl. Si una no da
EXACTAMENTE su valor, PARA y avisa (ante una diferencia manda el fichero).

A1. grep -c '^status: approved' specs/mobile-profile-followups/requirements.md   -> 1
A2. grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-20)' specs/mobile-profile-followups/requirements.md   -> 1
A3. grep -cF 'disabled={photoUploading}' mobile-pet-tracker/src/screens/profile/index.tsx   -> 1
A4. grep -cF 'photoBusyRef' mobile-pet-tracker/src/screens/profile/index.tsx   -> 0
A5. grep -cF 'ImagePicker.launchImageLibraryAsync' mobile-pet-tracker/src/screens/profile/index.tsx   -> 1
A6. grep -cF 'className="rounded-xl bg-danger-soft"' mobile-pet-tracker/src/screens/profile/index.tsx   -> 1
A7. grep -cF 'size={40} cacheKey={pet.id}' mobile-pet-tracker/src/components/pet-switcher.tsx   -> 1
A8. grep -cF 'onStartShouldSetResponder' mobile-pet-tracker/src/screens/profile/index.test.tsx   -> 0
A9. grep -cF 'danger-soft' mobile-pet-tracker/src/screens/profile/index.test.tsx   -> 0
A10. grep -cF "findByText('Ada Lovelace')" mobile-pet-tracker/src/screens/profile/index.test.tsx   -> 0
A11. grep -cF "getByText('Ada Lovelace')" mobile-pet-tracker/src/screens/profile/index.test.tsx   -> 1
A12. grep -cF 'cacheKey' mobile-pet-tracker/src/components/__tests__/pet-switcher.test.tsx   -> 0
A13. grep -cF 'useFakeTimers' mobile-pet-tracker/src/screens/profile/index.test.tsx   -> 0
A14. grep -cF "describe('#173 R4:" mobile-pet-tracker/src/components/__tests__/pet-switcher.test.tsx   -> 1
A15. grep -cF "describe('R1: me card'" mobile-pet-tracker/src/screens/profile/index.test.tsx   -> 1
A16. test ! -e mobile-pet-tracker/.expo/types/router.d.ts && echo ok   -> ok

== ALCANCE (lista cerrada) ==

Todo bajo mobile-pet-tracker/ salvo donde se indica. Tres ficheros de codigo, ni uno mas:
- Produccion: src/screens/profile/index.tsx, SOLO R2: la declaracion de
  `photoBusyRef` y el cuerpo de `handleChangePhoto`. Cero cambios en JSX, className,
  testID, accessibilityState, disabled, onPress, copy o src/i18n/.
- Tests: src/screens/profile/index.test.tsx (R5, R1, R4, R2) y
  src/components/__tests__/pet-switcher.test.tsx (R3).
- Raiz del repo: specs/mobile-profile-followups/traceability.md y
  progress/impl_mobile-profile-followups.md.
- `git diff --name-only <H0>..HEAD` lista exactamente esos cinco ficheros
  (profile/index.tsx, profile/index.test.tsx, pet-switcher.test.tsx, traceability.md
  e impl). Medirlo y pegarlo en el impl.

Prohibido: dependencias nuevas (package.json, bun.lock), backend-pet-tracker/,
docs/ui-guidelines.md, cualquier cambio visual de Perfil, y en las lineas anadidas:
hex, clases arbitrarias `[...]`, `StyleSheet.create`, sombras legacy, emoji. Todo
nombre de `it`/`describe` y todo comentario nuevo cita `#184 R<n>` completo, nunca
`#184` suelto (el HEX_LITERAL de design-drift exime solo `#NNN R<n>`).

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md; convenciones: docs/conventions.md.
- Skills de expo: NO cargues ninguna. No hay ninguna del plugin `expo` de Codex
  para esto (es una guardia de reentrada con `useRef` y tests de RN; no hay
  diseno ni animacion ni UI nueva). Di en el reporte que no cargaste ninguna y
  por que. `bun` para todo (bunx), nunca npx ni npm i -g.
- Esperas (docs/conventions.md §Esperas sobre el arbol renderizado): la condicion de
  espera es la MISMA observacion que las aserciones posteriores; se espera al
  arbol, nunca a un contador de mock. `await fireEvent.press(...)` y
  `await act(async () => { ... })` siempre: en RNTL 14 el `fireEvent` y el `act`
  sin `await` contaminan el `it` siguiente.
- Los literales esperados de los tests se escriben a mano, nunca importados de
  src/theme/, src/i18n/catalog.ts ni del codigo que se prueba.
- R1: si `props.onStartShouldSetResponder` no existe como funcion en el host de
  `change-photo`, PARA y reporta sin inventar otra sonda.
- R3: si el host no expone `source` como arreglo, copia la forma que ya asevera el
  test de `profile-pet-avatar` (`#168 R4`) en profile/index.test.tsx y reportalo.
- R4: si la primera corrida ve una cadena de clases distinta de la de tasks.md,
  PARA, escribe la cadena real y su diferencia en el impl y espera al leader. No
  ajustes a ciegas.
- R5: el flake no admite commit rojo; el rojo se demuestra con el spike de tasks.md
  §R5 (retraso de 50 ms en `mockGetMe`), que se retira antes de commitear.
- Jest con rutas con parentesis: si aparece alguna, usa `\(tabs\)` escapado o el
  fichero se salta con exit 0.
- Tests por `-t` o aislados no absuelven: ante un rojo ajeno, corre el fichero
  entero varias veces antes de llamarlo regresion.
- Si el sandbox te deniega un comando, PARA y repórtalo; no lo sustituyas por
  otro que haga lo mismo.
- NO son tuyos, no los toques: progress/history.md, progress/current.md, STATUS.md
  y el campo `status` de feature_list.json. Tu sitio para contarlo todo es
  progress/impl_mobile-profile-followups.md.
- No crear recursos AWS reales ni cdk deploy. NO abras la PR ni la edites: la abre
  el leader al cerrar.

Cada commit va encadenado con `&&` a su verificacion (jest del fichero tocado,
`test ! -e .expo/types/router.d.ts` y `bunx tsc --noEmit` antes, y `git commit` al
final), con su propio `git add <ruta exacta>` (nunca `-a` ni `add .`). Nunca
commitees con un exit distinto del esperado. Movil no tiene prettier: respeta el
estilo del fichero.

Criterios de aceptacion: R1 a R6 de specs/mobile-profile-followups/requirements.md.
Al terminar: escribir resultado en progress/impl_mobile-profile-followups.md con:
salida de pwd/branch/H0/status, medidas de base, salida de cada ancla, que skills
cargaste (ninguna), hash y mensaje de cada commit, mensaje de cada rojo (doble toque
de R2, spike de R5, X1 a X15 con que `it` salio rojo y cuales verdes), filas que
nacieron verdes, cualquier desvio pedido por la spec (sonda ausente, cadena de R4,
cifra de `photoBusyRef` distinta de 4) y la medicion del grep-clean de R6 con comando
y cifra.
Ultima accion: crear progress/impl_mobile-profile-followups.done con una sola linea:
la ruta de progress/impl_mobile-profile-followups.md. Es el marcador que vigila
scripts/harness/watch-impl.sh y avisa al leader; no lo commitees (esta en .gitignore).
```
