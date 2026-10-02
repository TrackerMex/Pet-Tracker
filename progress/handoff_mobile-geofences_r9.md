# Reanudación de Codex CLI — #41 mobile-geofences, desde la parada en R9

> Pegar el bloque de abajo en Codex CLI. Sigue valiendo entero
> `progress/handoff_mobile-geofences.md`; esto solo añade cómo salir de la
> parada que Codex reportó en `progress/impl_mobile-geofences.md`
> §Bloqueo y parada obligatoria en R9.
>
> Enmienda E2 de #41, aprobada por el humano en el chat de la sesión Backend
> el 2026-10-02 y escrita en `specs/mobile-geofences/requirements.md`. El
> leader la commitea encima del rojo de R9 (1c272b06) junto con este fichero y
> sube la branch, así que el arreglo del test va en un commit nuevo y no se
> reescribe historia.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Feature: mobile-geofences (#41), branch feature/41-mobile-geofences.
Sigue valiendo ENTERO progress/handoff_mobile-geofences.md (reglas, H0 =
04cf1c1c, cierre y reporte). Esto solo te dice como salir de tu parada en R9.

== LA PARADA ==

Tu rojo de R9 (1c272b06) anadio al `it` de `#41 R9` la linea
`expect(within(link).UNSAFE_getByType(ChevronRight).props.size).toBe(20);`
y el import `import { ChevronRight } from 'reicon-react-native';`.
RNTL 14.0.1 no tiene consultas UNSAFE_* (ni en `within` ni en `screen`:
las quito la v14, ver node_modules/@testing-library/react-native/docs/guides/migration-v14.md:347),
asi que el verde da TypeError y tsc da TS2339. La spec no pedia esa
consulta. Paraste bien.

== ENMIENDA E2 (aprobada por el humano, 2026-10-02) ==

Leela en specs/mobile-geofences/requirements.md (cabecera, tras E1). El `it`
de `#41 R9` NO comprueba el tamano del chevron. La mutacion M46 la caza solo
`#62 R7` (literal exacto `<ChevronRight size={20} color={muted} />` cuatro
veces); M47 la sigue cazando `#41 R9` (design.md §1). El leader ya la
commiteo encima de 1c272b06 y subio la branch. Tu no tocas requirements.md,
design.md ni tasks.md de specs/mobile-geofences/.

== PASOS ==

0. `pwd`, `git branch --show-current`, `git log --oneline -3` y
   `git status --short`. HEAD debe ser el commit
   `docs(specs): amend #41 with E2, R9 does not measure the chevron`
   y su padre 1c272b06. El status solo puede tener
   `?? progress/impl_mobile-geofences.md`. Si no, PARA.
1. En mobile-pet-tracker/src/screens/profile/index.test.tsx borra
   EXACTAMENTE dos lineas: el import de ChevronRight y el expect con
   UNSAFE_getByType. Nada mas. Comprueba:
   `git grep -n "ChevronRight\|UNSAFE_" -- mobile-pet-tracker/src/screens/profile/index.test.tsx > /tmp/r9-e2-grep.txt 2>&1; echo "exit=$?"`
   tiene que dar exit=1 y 0 bytes.
2. Vuelve a medir el rojo de R9 con el MISMO comando de tu seccion r9
   (los tres ficheros, comillas simples, sin pipe). Tienen que fallar
   EXACTAMENTE los mismos seis `it`, con los mismos matchers; el de #41 R9
   sigue fallando por `geofences-link` ausente. Si cambia algo, PARA.
   Mide tambien `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit`
   en este rojo y anota exit y bytes.
3. Commit SOLO de ese fichero, con este mensaje literal:
     test(profile): drop the chevron query RNTL 14 lacks (R9, E2)
   `git show --stat HEAD` tiene que listar solo
   mobile-pet-tracker/src/screens/profile/index.test.tsx. No reescribas
   ningun commit (ni --amend, ni rebase): la branch ya esta en remoto.
4. Sigue tasks.md desde el verde de R9 (bloque literal D9, tu comando r9g),
   luego R10 (rojo por mutacion versionada y verde que la revierte a mano)
   y el ultimo commit de trazabilidad, con §Cierre del handoff original.
   Quedan estos cuatro commits, con estos mensajes literales:
     feat(profile): link the active pet's safe zones (R9)
     test(geofences): the screen resolves its copy by key (R10, plants mutation: retry key through a constant)
     feat(geofences): resolve the retry label by literal key (R10)
     docs(geofences): fill #41 traceability
   Desde H0 quedaran 24 commits: tus 18, el de E2 del leader, el tuyo del
   paso 3 y estos cuatro.
5. Cierre: la comprobacion de `git diff --name-only` de tasks.md §Cierre ya
   incluye los cuatro ficheros del commit E2 del leader
   (specs/mobile-geofences/requirements.md, design.md, tasks.md y
   progress/handoff_mobile-geofences_r9.md). Ninguno mas.
   En traceability.md, la fila de R9 lleva tres hashes: el rojo
   (1c272b06), el arreglo E2 del paso 3 y el verde.

== EN EL REPORTE ==

En progress/impl_mobile-geofences.md anade una seccion
"Reanudacion tras E2" con: las salidas del paso 0, el git grep del paso 1,
el rojo re-medido del paso 2 (cuentas, exit, bytes, los seis `it` con
matcher/Expected/Received), el tsc de ese rojo y el hash del paso 3.
Actualiza la tabla de commits. Deja la seccion de la parada como esta:
es historia.

== NO ==

- No sustituyas la consulta por otra que mida el tamano (mock de reicon,
  busqueda por host Svg, etc.): E2 la quita, no la cambia.
- El ultimo commit lleva SOLO specs/mobile-geofences/traceability.md y
  progress/impl_mobile-geofences.md.
- No hagas push ni abras la PR.
```
