# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature: #91 mobile-tab-indicator-out-of-range

- **Inicio:** 2026-09-13
- **Rama:** `feature/91-mobile-tab-indicator-out-of-range`, creada desde `origin/main` en
  `072cff40` (merge del PR #123, cierre de #78)
- **Estado:** `pending` -> `spec_author` lanzado. La sesion PARA cuando la spec quede en
  `draft`, a la espera de la firma humana.
- **Reparto acordado con el humano:** el lado movil (#91) lo lleva esta sesion; la feature
  #73 `pet-online-pill` se paso a la sesion Backend, que trabaja en el worktree
  `/home/claude/sites/Pet-Tracker-wt-backend`. Sin solape de archivos: #91 solo toca
  `mobile-pet-tracker/src/components/floating-tab-bar.tsx` y su test; #73 toca
  `backend-pet-tracker/src/workers/ingestion.drizzle.store.ts` y
  `mobile-pet-tracker/src/app/(tabs)/home.tsx`.

### Plan

Spec del defecto del indicador de la barra de pestanas: la burbuja se posiciona con
`state.index * tabWidth` (indice sobre `state.routes`, que incluye todas las rutas del
grupo `(tabs)/`) mientras la geometria se calcula sobre `TABS.length` (cinco ranuras).
Cualquier ruta fuera de `TABS` cae en indice >= 5 y la burbuja sale del rango. El arreglo
deriva la posicion de `TABS` via `activeRouteName`, sin dependencias nuevas.

Verificado en el arbol antes de especificar: hay **dos** sitios que posicionan la burbuja
—el `useEffect` y `handleLayout`—, no uno; los dos entran en el alcance. El fixture
`routes` del test solo contiene las cinco rutas de `TABS`, asi que el caso nuevo exige
extenderlo.

### Bloqueos y observaciones

- `./init.sh` corre y sale con codigo 0, pero imprime
  `Mas de 1 feature en in_progress (0). Resolver antes de continuar.` con el `0` envuelto
  en codigos de color ANSI. Es exactamente la feature #75 `harness-init-force-color`, ya
  registrada: `FORCE_COLOR` hace que `console.log` de Node coloree el numero, y la
  comparacion `[ "$IN_PROGRESS" = "0" ]` de `init.sh:137` falla contra la cadena
  coloreada. No bloquea (exit 0) pero el harness reporta un falso negativo en cada
  arranque. Queda fuera del alcance de #91.

### Baseline de la suite en 072cff40

La sesion Backend corrio `./init.sh` en su worktree sobre el mismo commit y reporto:
backend 25 suites / 362 tests, movil 73 suites / 1230 tests. Sirve de referencia para
declarar el delta de #91 en el gate, no como cifra congelada: lo que se compara es el
delta contra este commit.
