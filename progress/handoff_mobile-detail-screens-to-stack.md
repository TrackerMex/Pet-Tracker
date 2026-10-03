# Handoff a Codex CLI — #95 mobile-detail-screens-to-stack

> Pegar el bloque de abajo en Codex CLI. La spec y las enmiendas A11 y A12 ya
> están firmadas (commit `a4b3e69f`, aprobación vía Notion).

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-detail-screens-to-stack.md. Para si la
branch no es feature/95-mobile-detail-screens-to-stack.
No toques /home/claude/sites/Pet-Tracker-wt-backend (otra sesion trabaja alli en
#104) ni cambies de branch en ningun worktree.

Feature: mobile-detail-screens-to-stack (#95), branch: feature/95-mobile-detail-screens-to-stack
Spec aprobada: specs/mobile-detail-screens-to-stack/requirements.md (status: approved)
Lee tambien: specs/mobile-detail-screens-to-stack/design.md, tasks.md y traceability.md,
y specs/mobile-device-pairing/design.md §Enmienda #95 (A12, firmada).

== QUE HACES ==

Sacar las seis pantallas de detalle de mobile-pet-tracker/src/app/(tabs)/ al Stack
raiz. Requisitos R1-R8, en EXACTAMENTE el orden de tasks.md §Orden (su tabla dice
por que ese orden):
  R1  SelectedPetProvider: la seleccion pertenece a la sesion (token de useAuth)
  R2  git mv de las seis rutas a src/app/, provider en el layout raiz, RootStack
      nuevo con Stack.Protected. R2 y R3 comparten UN commit verde (design D1)
  R3  la guarda protege las seis y deja libres (auth) y reset-password
  R4  cabecera nativa en las seis, con las opciones exactas de la tabla de R4
  R5  fuera los seis botones de volver hechos a mano, los titulos del cuerpo y
      las seis claves del catalogo
  A11 commit de docs (texto literal de R6) en docs/conventions.md y
      docs/ui-guidelines.md, con <fecha> = 2026-09-23. Va ANTES del rojo de R6
  R6  contentContainerStyle { padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }
  R7  se retira el reset en blur de #63 en cuatro pantallas; pairing conserva
      exactamente dos useFocusEffect y el reset de #63 R6
  R8  ready-map de pairing llama a router.dismissTo('/map'), nunca a router.push

Ficheros: la lista completa y el inventario de aserciones heredadas que cambian
estan en design.md D1 y D10. NO toques nada que no este ahi. Tres ficheros nuevos:
src/app/__tests__/detail-stack.test.tsx, detail-stack.navigation.test.tsx y
detail-stack.guard.test.tsx. UN SOLO `it` que use renderRouter por fichero (sonda
S11 de design §1).

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md. UI movil:
  docs/ui-guidelines.md (es el gate C8 del reviewer).
- Skills de expo de Codex (plugin v1.0.2, catalogo re-medido el 2026-09-23):
  carga SOLO `building-native-ui` (estilos de cabecera, colores, aspecto nativo).
  En tu catalogo NO existe ninguna skill expo-router ni expo-overview: no las
  busques. La guia de routing (Stack, Stack.Protected, dismissTo, opciones de
  Stack.Screen) YA esta escrita en la spec, con las sondas que la sostienen en
  design.md §1. Si necesitas detalle de API, usa la doc de Expo SDK 57:
  https://docs.expo.dev/versions/v57.0.0/ (lo exige mobile-pet-tracker/AGENTS.md).
  Di en el reporte que skills cargaste.
- TDD por requisito: rojo -> verde -> refactor, segun tasks.md.
- TEST PRIMERO, UN COMMIT POR PASO. El rojo de cada requisito va en SU PROPIO commit,
  ANTES de su implementacion, y falla por SU ASERCION, nunca por un ReferenceError
  o un modulo inexistente. En #19 todo fue en un solo commit e incumplio C4 de
  CHECKPOINTS.md. Aqui significa al menos un commit rojo y uno verde por R-id,
  salvo R2+R3, que llevan dos rojos y un verde compartido, y A11, que es un commit
  de docs. Prefijo del commit y R-id en el mensaje, como dice tasks.md.
- Todo `describe` nuevo lleva el prefijo `#95 R<n>:` (nunca un `#95` suelto).
- Actualiza specs/mobile-detail-screens-to-stack/traceability.md tras cada commit
  (describe + hashes rojo -> verde). No rebasees despues de escribir hashes.
- Catalogo: src/providers/__tests__/language-provider.test.tsx candado la LONGITUD
  del catalogo. El catalogo baja 6 claves por idioma; declara ese delta en ese
  test, como dice R5. Cero claves nuevas.
- Cero dependencias nuevas. react-native-screens 4.26.x ya esta instalado; NO
  regeneres el dev build ni toques app.json.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md, STATUS.md
  y el campo `status` de feature_list.json. Son artefactos de cierre del leader.
  Todo lo que tengas que contar va en progress/impl_mobile-detail-screens-to-stack.md.
- NO abras la PR ni hagas push: lo hace el leader al cerrar.

== ENTORNO ==

- Todo desde mobile-pet-tracker/. bun / bunx. Nunca npx, nunca npm i -g.
- `rm -f .expo/types/router.d.ts` antes de tocar codigo, y otra vez antes de cada
  `bunx tsc --noEmit` a partir de R2 (las rutas fantasma lo rompen).
- Rutas de jest con parentesis ESCAPADOS: 'src/app/\(tabs\)/...' o con
  --runTestsByPath. Sin escapar, `(tabs)` es una regex: se salta ficheros en
  silencio con exit 0. Tras cada comando, comprueba que el numero de suites que
  imprime jest coincide con el de ficheros pedidos.
- Mide SIN pipe: `cmd > fichero; echo "exit=$?"`. `cmd | tail` devuelve el codigo de tail.
- NO lances ./init.sh ni toques Postgres o LocalStack: son compartidos con el
  worktree de Backend. Se mide con bunx jest, bunx tsc --noEmit y bunx expo lint.

== BASE Y CIERRE ==

Base en 2be1b023 (vuelve a medirla al empezar, sobre el HEAD actual de la branch):
  bunx jest --silent -> 77 suites, 1412 tests, exit=0
  bunx tsc --noEmit y bunx expo lint -> exit=0 y salida VACIA
Cierre esperado: +3 suites y +14 tests sobre la base (80 / 1426 en 2be1b023), con
el reparto por fichero de design.md D9. tsc y lint con exit=0 y salida vacia (un
import huerfano de R5/R7 no rompe el exit code pero imprime un warning: cuenta
como fallo). Los greps de C7 y C8 de requirements.md §Verificacion, vacios. La
lista completa esta en tasks.md §Cierre.

Criterios de aceptacion: R1, R2, R3, R4, R5, R6, R7 y R8 de requirements.md, y A11
aplicada literal.

Al terminar, escribe progress/impl_mobile-detail-screens-to-stack.md con: pwd y
branch; skills cargadas; commits por R-id (rojo y verde) con hashes; comandos y
salidas exactas del cierre; la evidencia de mutacion de R3; el delta por fichero
contra D9; y cualquier decision que la spec no cerrara literalmente.
```
