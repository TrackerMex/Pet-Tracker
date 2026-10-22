# merge origin/main -> feature/189 (resolucion de 3 conflictos, sin commitear)

Ficheros bajo `mobile-pet-tracker/src/`, resueltos y `git add`-eados (sin UU restantes; sin marcadores).

## 1. `__tests__/chunky-cta-canvas-fidelity.test.ts`
Base comun + deltas de main + deltas de #189 (ambos comentarios conservados):
- `<Button\.Label`: `35 - 15 - 1 - 1 - 1` (main 0 sobre base, #189 -1 -1)
- `Button\.Label`: `82 - 30 - 2 - 2 - 2`
- `text-17`: `8 + 15 + 1 + 1 + 1 + 1` (base 8+15+1; main +1 #194 R6; #189 +1 +1)
- `<Text ... text-accent-foreground>`: `5 + 11 + 1 + 1 - 1 - 1` (main +1; #189 -1 -1)
- `rounded-16`: `26 + 1 + 1 + 1 + 2` (base 26+1; main +1; #189 +1 +2)
Suite sola: 78/78 verde (los contadores cuadran con los usos reales).

## 2. `app/__tests__/layout.test.tsx`
Titulos: `#194 R4: declara pets/[petId]/geofences ... (enmendado por #189 R1.1)` y lo mismo para geofence-editor. El sufijo E4 del `it` «#95 R4» (l.473) no estaba en conflicto y se conserva.
Suite: 30/30 verde (src/app/__tests__/layout.test.tsx).

## 3. `providers/__tests__/language-provider.test.tsx`
- Titulo: `#194 R1: ... (enmendado por #189 R15)`.
- Suma: `+ 7, // #194 R1 (+2); #189 R15 (+5)` (el test cuenta el total real: verde).
- Ambos bloques conservados: `describe('#189 R15 ...')` con su `it.each` y `it('#194 R1: declara las claves de edicion de perfil ...')`, cada uno con su cierre.
Suite: 54/54 verde.

## Suites (cada una sola, exit 0)
| patron | resultado |
|---|---|
| chunky-cta-canvas-fidelity.test.ts | 1 suite, 78 tests |
| /layout.test.tsx | 3 suites (auth, raiz, tabs), 38 tests |
| language-provider.test.tsx | 1 suite, 54 tests |
| design-drift | 115 tests |
| consistency-classnames | 75 tests |
| ui-language | 31 tests |
| profile-canvas-fidelity | 26 tests |

Antes de correr: `pgrep` sin procesos ajenos. Sin tocar produccion, sin relajar aserciones, sin commit/init.sh/stash.
