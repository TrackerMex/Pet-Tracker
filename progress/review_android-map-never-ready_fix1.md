# review: android-map-never-ready — fix 1 (defecto R8, ancestro opaco)

Fecha: 2026-09-01
Branch: `feature/54-android-map-never-ready`
Rango revisado: `3432069..HEAD` (`4468da9`)
Veredicto: **APROBADO — con alcance limitado**

> **Límite del veredicto.** Esta revisión cubre **solo código, tests y
> documentación**. R8 exige un smoke humano en dev build de Android, en ambos
> temas, confirmando por separado tiles + marker + polyline (más stats y Lost
> Mode). Ninguna IA puede ejecutarlo. **La feature #54 no puede cerrarse con
> esta aprobación sola**: falta la casilla de
> `specs/android-map-never-ready/requirements.md:452`, hoy sin marcar.

---

## Qué se revisó

| Commit | Alcance |
|---|---|
| `74f50f7 test(map): reject opaque map ancestor (R8)` | solo `src/app/(tabs)/__tests__/map.test.tsx` (+14) |
| `38168cf fix(map): expose native map surface (R8)` | solo `src/app/(tabs)/map.tsx` (+5/−5) |
| `8a2c1b5 docs(map): document opaque ancestor constraint (R8)` | `docs/ui-guidelines.md`, `specs/.../traceability.md`, `progress/current.md` |
| `4468da9 docs(map): record opaque ancestor verification (R8)` | `progress/impl_...md`, `progress/current.md` |

Seis archivos en total; ninguno fuera de la allowlist del handoff salvo
`progress/current.md` (ver Observación 4).

---

## Verificación de la causa raíz

### El fix ataca la causa, no el síntoma

Cadena de ancestros de `PetMap` recorrida entera, no solo la línea 175:

| Nodo | Archivo | ¿Declara `bg-*` / fondo? |
|---|---|---|
| `GestureHandlerRootView` | `src/app/_layout.tsx:40` | no — `style={{ flex: 1 }}` |
| `HeroUINativeProvider` | `node_modules/heroui-native/src/providers/hero-ui-native/provider.tsx` | no — solo contextos + `SafeAreaListener` + `PortalHost`, ninguna `View` con fondo |
| `AuthProvider`, `SelectedPetProvider` | `src/providers/` | no — grep de `bg-`/`backgroundColor` sin coincidencias |
| `Stack` / `Tabs` | `_layout.tsx` raíz y de `(tabs)` | no declaran `contentStyle`/`sceneStyle`; grep sin coincidencias |
| `screen-map` | `src/app/(tabs)/map.tsx:175` | **no** — ahora `className="flex-1"` |
| fragmento `<>` → `PetMap` | `map.tsx:208-215` | no hay nodo intermedio |

El fondo bajó a los cuatro estados que sí lo necesitan, tal y como exigía el
handoff:

- `map.tsx:177` `Skeleton testID="map-loading"` → `flex-1 bg-background`
- `map.tsx:181` estado de error de pets → `... p-6 bg-background`
- `map.tsx:192` "No pets yet" → `... p-6 bg-background`
- `map.tsx:200` "Live tracking requires a collar" → `... p-6 bg-background`

Ninguno de los cuatro se quedó sin fondo. Los overlays de la rama del mapa
(`map-empty-overlay` con `bg-surface`, `map-stats` con `Card` y `bg-default`)
son hermanos absolutos dibujados **encima** del mapa, no ancestros: su fondo
es correcto y no tapa la superficie.

### El test rojo prueba el contrato de verdad

No me fié del reporte. Reproduje el rojo en un worktree independiente parado
en `74f50f7` (test presente, fix ausente — confirmado: `map.tsx:175` todavía
dice `className="flex-1 bg-background"`):

```
● R6: mapa y marker con la última posición › R8 (android-map-never-ready): el
  contenedor del mapa no declara fondo opaco

    expect(received).not.toContain(expected) // indexOf
    Expected substring: not "bg-"
    Received string:        "flex-1 bg-background"

Test Suites: 1 failed, 1 total
Tests:       1 failed, 31 passed, 32 total
```

Exit 1, un único fallo, los 31 tests previos verdes. El test **no es
tautológico**: lee el `className` real y recibió literalmente
`"flex-1 bg-background"`. Falla si alguien reintroduce cualquier `bg-` en el
contenedor.

Además el test se ejecuta dentro de la rama que **monta el mapa**: mockea
`getLastPosition` en `ok` y espera `map-view` visible antes de assertear. Un
contrato sobre el ancestro que no monta el mapa no probaría nada; este sí.

Verde en `HEAD`: 32/32.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` en `feature_list.json` (#54, `grep -c` = 1)
- [x] `progress/current.md` describe la sesión activa y registra el fix 1
- [x] Working tree sin cambios de la feature sin commitear (solo enlaces no
      trackeados preexistentes bajo `.claude/skills/`)

## Checklist C3 — Arquitectura

No aplica en el sentido backend (domain/application/infrastructure): el diff
es una pantalla Expo. Se verifica la separación equivalente de `docs/ui-guidelines.md` §8:

- [x] El route/pantalla no absorbió lógica del wrapper: `src/components/pet-map.tsx`
      quedó intacto (`git diff` = 0 líneas)
- [x] El color de la polyline sigue saliendo de `useThemeColors`, sin hex
- [x] Sin lógica nueva: el diff es puramente declarativo (movimiento de clases)

## Checklist C4 — TDD

- [x] R8 tiene test que lo nombra: `R8 (android-map-never-ready): el contenedor
      del mapa no declara fondo opaco`, con el sufijo de feature que evita la
      colisión con el `R8 (mobile-design-drift)` ya presente en el mismo archivo
- [x] Historial test-primero, **commits separados y en orden**:
      `74f50f7` (test, 1 archivo, 0 líneas de producción) → `38168cf` (fix, 1
      archivo, 0 líneas de test) → `8a2c1b5` / `4468da9` (docs)
- [x] El commit de test **no** incluye cambios de producción (verificado con
      `git show --stat`)
- [x] Rojo reproducido de forma independiente por el reviewer (ver arriba), no
      aceptado del reporte

## Checklist C5 — Trazabilidad

- [x] La fila R8 de `traceability.md` ya no dice "pendiente" a secas: registra
      el test (ruta::describe::it) y los dos commits del ciclo
- [x] Commits en formato convencional con R-id: `test(map): … (R8)`,
      `fix(map): … (R8)`, `docs(map): … (R8)` — `fix(<scope>): <desc> (R3)` está
      explícitamente en `docs/conventions.md` §Commits, y `test`/`docs` son los
      tipos que la propia feature ya venía usando en R7
- [ ] **Fila R8 cerrada del todo** — queda por escrito `smoke humano pendiente`.
      Es el gate que `traceability.md` reserva al humano ("**R8 la cierra solo
      el humano**"). No es un defecto del fix; es el motivo por el que este
      veredicto no cierra la feature.

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` y casilla de aprobación marcada
      (2026-08-28)
- [x] **La spec no se tocó**: `git diff 3432069..HEAD -- specs/.../requirements.md`
      = 0 archivos. Solo cambió `traceability.md`, que era lo permitido
- [ ] Casilla del gate R8 (`requirements.md:452`) sin marcar — pendiente del humano

## Checklist C7 — Sin código huérfano

- [x] N/A — este fix no reemplaza ni deprecia ningún componente. Es un cambio
      de clases dentro de un archivo existente; no se creó ni borró nada

## Checklist C8 — Carta de UI móvil

- [x] Cero hex en `map.tsx`, cero clases arbitrarias `[...]`, cero
      `StyleSheet.create`, cero shadow/elevation legacy
- [x] `bun run lint` verde (el orden de clases no dispara ninguna regla)
- [x] La regla nueva quedó codificada en `docs/ui-guidelines.md` §10

---

## Prohibiciones del handoff — todas respetadas

| Prohibición | Resultado |
|---|---|
| No marcar #54 `done` | `feature_list.json` intacto (`git diff` = 0 archivos); #54 sigue `in_progress` |
| No editar `requirements.md` ni otro fichero de la spec salvo `traceability.md` | Cumplido: solo `traceability.md` cambió |
| No tocar `src/components/pet-map.tsx` | Intacto |
| No tocar `app.config.ts` | Intacto |
| No tocar dependencias | `package.json` y `bun.lock` intactos |
| No meter impl + tests + docs en un commit | Cumplido: 4 commits, uno por fase |

---

## Verificación independiente ejecutada

Todo corrido por el reviewer, no leído del reporte.

| Comando | Exit | Resultado |
|---|---:|---|
| Suite Map en worktree parado en `74f50f7` (test sin fix) | 1 | 1 fallo = el nuevo test R8; 31/31 previos verdes → **rojo confirmado** |
| `bun run test -- 'src/app/\(tabs\)/__tests__/map.test.tsx' --runInBand` (HEAD) | 0 | 1/1 suite, **32/32 tests** |
| `bun run typecheck` | 0 | `tsc --noEmit` limpio |
| `bun run lint` | 0 | `expo lint` limpio |
| `./init.sh` desde la raíz | **0** | Verde **a la primera**; el flake #53 de `add-pet` no se manifestó en esta corrida |

Los 31 tests previos de la suite del tab Map siguen verdes y ninguno fue
modificado: el diff del test es de +14 líneas, sin borrados.

### Output de `./init.sh`

```
✅ node disponible (/usr/bin/node)
✅ pnpm disponible (/home/claude/.npm-global/bin/pnpm)
✅ bun disponible (/home/claude/.npm-global/bin/bun)
✅ .env encontrado
✅   DATABASE_URL definida
✅ Dependencias instaladas
✅ Archivos del harness presentes
✅ STATUS.md sincronizado con feature_list.json
✅ Build exitoso

# backend
Test Suites: 156 passed, 156 total
Tests:       1198 passed, 1198 total
Snapshots:   0 total

# infra
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Snapshots:   0 total

# móvil
Test Suites: 51 passed, 51 total
Tests:       569 passed, 569 total
Snapshots:   1 passed, 1 total
✅ Tests pasados

# e2e
Test Suites: 3 skipped, 23 passed, 23 of 26 total
Tests:       8 skipped, 349 passed, 357 total
Snapshots:   0 total
✅ Tests e2e pasados

✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.

INIT_EXIT=0
```

Móvil pasó de 568 a **569** tests: exactamente el test R8 añadido, sin
regresiones en las otras 50 suites.

**Nota sobre el flake #53** (`mobile-jest-mock-hygiene`): no hizo falta
reproducirlo dirigido. `./init.sh` salió 0 en la primera y única corrida de
esta revisión y la suite `src/screens/add-pet/index.test.tsx` pasó dentro de
las 51 suites verdes. El flake sigue registrado como #53 y esta feature no lo
toca.

---

## Observaciones (ninguna bloqueante)

1. **Estado sin rama que ahora se queda sin fondo.** `LastPositionState`
   admite `error` y `unauthorized` además de las que `map.tsx` contempla. Si
   `pets` resuelve `ok` con ≥1 mascota y `getLastPosition` devuelve `error`
   (un 500 de `/pets/:id/positions/last`), **ninguna** de las cinco ramas de
   `map.tsx` renderiza: antes del fix la pantalla quedaba en blanco pero
   pintada con `bg-background`; ahora queda en blanco sobre el fondo del
   contenedor de escena de React Navigation, que usa `DefaultTheme` (claro,
   porque la app no envuelve nada en `ThemeProvider`) — es decir, blanco
   también en tema oscuro.
   No es un defecto introducido por este fix en sustancia: el agujero
   —una pantalla vacía sin mensaje— es preexistente, y el handoff enumeró
   correctamente los cuatro estados que sí renderizan. Pero conviene
   registrarlo como defecto propio: `map.tsx` no tiene rama de error para
   `last`. `unreachable` y `missing-config` sí quedan cubiertos, porque
   `pets` comparte esos kinds y su rama de error sí pinta.

2. **La regla §10 es un superconjunto conservador de la evidencia.** Por
   encima de `screen-map` sigue existiendo un ancestro opaco que la app no
   controla —el contenedor de escena de React Navigation, con el fondo de
   `DefaultTheme`— y el mapa pintó igualmente en dispositivo al quitar solo
   `bg-background`. Lo verificado es por tanto "ningún `bg-*` en el árbol de
   vistas propio de la app por encima del mapa", que es lo que la regla
   prohíbe. Redactada así es segura y no hay que cambiarla; solo conviene no
   deducir de ella que cualquier fondo en cualquier nivel rompe el mapa.

3. **El test guarda `screen-map`, no la cadena entera.** Si alguien inserta
   mañana un `<View className="bg-surface">` **entre** `screen-map` y
   `PetMap`, el test sigue verde y el defecto vuelve. Es la limitación
   inherente a assertear sobre un testID; la §10 de `docs/ui-guidelines.md`
   cubre el caso por escrito, que era justo lo que pedía el handoff. Si se
   quisiera blindar, el contrato natural sería assertear que `map-view` no
   tiene ningún ancestro con `bg-` — más caro y más frágil. No lo pido.

4. **`progress/current.md` lo tocó Codex** en `8a2c1b5` y `4468da9`. El
   handoff pedía escribir en `progress/impl_android-map-never-ready.md`, y
   `progress/` es territorio del leader según `CLAUDE.md` §Un solo escritor.
   Los cambios son solo adiciones coherentes y no rompen nada, pero el
   handoff siguiente conviene que lo prohíba explícitamente.

5. **El runbook del smoke pide más de lo necesario ahora.**
   `docs/verification.md` §Feature 54 arranca con
   `npx expo prebuild --clean --platform android` + `bunx expo run:android`.
   Este fix es **solo JS**: el humano puede revalidar R8 con Fast Refresh
   sobre el dev build ya instalado, sin recompilar. Decisión del leader si
   quiere anotarlo en el runbook.

6. **La regla §10 tiene sustancia suficiente** para el caso "alguien envuelve
   el mapa en una tarjeta": prohíbe explícitamente *cualquier* ancestro con
   `bg-*`, explica el mecanismo (composición por detrás de la ventana, sin
   error visible) y da la salida (cada estado sin mapa declara su fondo).
   Mejoraría con un enlace a
   `progress/discriminador2_android-map-never-ready.md`, donde está la
   evidencia en dispositivo. Opcional.

---

## Conclusión

El fix es correcto y mínimo: ataca la causa raíz documentada, la cadena de
ancestros de `PetMap` está limpia de `bg-*`, los cuatro estados sin mapa
conservan su fondo, el ciclo TDD es real (rojo reproducido de forma
independiente) y con commits separados, las prohibiciones se respetaron todas
y la verificación completa sale verde a la primera.

**Aprobado en su alcance.** El leader **no** debe marcar #54 como `done` con
esto: falta el smoke humano de R8 en dev build de Android, en ambos temas, con
tiles + marker + polyline confirmados por separado, y su casilla en
`specs/android-map-never-ready/requirements.md:452`.
