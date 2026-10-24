# Medición de CC1 de #207 en `bc5a26e7` (2026-10-24)

Solo medición: ningún commit, árbol de nuevo limpio al final (`git diff --quiet; echo $?` = 0).
Worktree `/home/claude/sites/Pet-Tracker-wt-207`, HEAD `bc5a26e7`, rama
`feature/207-mobile-jest-virtual-mock-poisoning`. Todo desde `mobile-pet-tracker/`, caché de jest
vacía por corrida (`C=$(mktemp -d)`), `--runInBand`. Sin `init.sh` ni jest ajeno en marcha
(`pgrep -af '[i]nit.sh'` vacío); carga de la máquina 2 a 7 durante las corridas.
Logs: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/e207/*.log`
(`A30`, `Alit`, `Alit2`, `B30`, `Blit`, `Blit2`) y `.../scratchpad/solo-{profile,health}.log`.

## 1. Los tres rojos, cada fichero solo

Ficheros (grep del título): los dos primeros en `src/screens/profile/index.test.tsx`, el tercero
en `src/screens/health/index.test.tsx`.

```bash
C=$(mktemp -d); bunx jest --runInBand --testTimeout=30000 --cacheDirectory="$C" \
  --runTestsByPath "$PWD/src/screens/<profile|health>/index.test.tsx"
```

| Fichero solo | Línea `Tests:` | exit | Tiempo |
|---|---|---|---|
| `profile/index.test.tsx` | `Tests: 155 passed, 155 total` | 0 | 128 s |
| `health/index.test.tsx` | `Tests: 112 passed, 112 total` | 0 | 61 s (caché fría) |

Ninguno de los tres rojos es real en la base: pasan solos.

## 2. CC1 sin corrección (estado A, HEAD tal cual)

CC1 de requirements.md tal cual (sin `--testTimeout`) y con `--testTimeout=30000` añadido:

| Corrida | Flags | exit | Suites | Tests | Rojos |
|---|---|---|---|---|---|
| `Alit` | ninguno (CC1 literal) | 1 | `2 failed, 3 passed, 5 total` | `2 failed, 475 passed, 477 total` | `#172 R2` y `#173 R5` |
| `Alit2` | ninguno (CC1 literal) | 1 | `1 failed, 4 passed, 5 total` | `1 failed, 476 passed, 477 total` | solo `#172 R2` |
| `A30` | `--testTimeout=30000` | 1 | `1 failed, 4 passed, 5 total` | `1 failed, 476 passed, 477 total` | solo `#172 R2` |

`#172 R2` falla siempre con `Expected: "color:foreground"` / `Received: "#0D1117"` (el
envenenamiento que la spec describe). `#173 R5` en `Alit` falló con
`Unable to find an element with testID: pet-info-card` en `screen.findByTestId('pet-info-card')`
(`profile/index.test.tsx:294`, el `findBy` de 1000 ms por defecto de RNTL) mientras el árbol ya
pintaba el resto: es un timeout de espera, no una aserción de contenido. No reapareció en `Alit2` ni
en `A30`.

La medición del leader (`cc1-207.log`) tardó 1194 s en total (el fichero `profile` solo, 1062 s,
frente a 108 a 131 s en mis corridas): la máquina estaba cargada. Sus tres rojos extra se
explican así:

- `#168 R4` (cámara deshabilitada): `Exceeded timeout of 5000 ms for a test` (timeout por carga).
- `#173 R5` (cápsula): `findByTestId` de 1000 ms (el mismo patrón que reproduje en `Alit`).
- `#168 R2` (Salud, primer hijo de `health-content`): `Expected "vaccines-section"`,
  `Received undefined` en `health/index.test.tsx:1040`, con el fichero sano en 9 s. No lo reproduje
  en ninguna de mis 6 corridas de CC1 ni solo; lo más probable es la misma causa (el árbol se
  lee antes de que lleguen los datos asíncronos, bajo carga), pero esa parte es inferencia, no
  medición.

## 3. CC1 con la corrección B aplicada (temporal)

Edición exacta de tasks.md: borrar `  { virtual: true },` en `food`, `health` y `meal-schedule`;
`}), { virtual: true });` por `}));` en `profile`. `git diff --numstat` dio `0 1`, `0 1`, `0 1`
y `1 1` (coincide con CC2) y `grep -rlE "virtual['\"]?[[:space:]]*:" src | wc -l` dio 0.

| Corrida | Flags | exit | Suites | Tests |
|---|---|---|---|---|
| `Blit` | ninguno (CC1 literal) | 0 | `5 passed, 5 total` | `477 passed, 477 total` |
| `Blit2` | ninguno (CC1 literal) | 0 | `5 passed, 5 total` | `477 passed, 477 total` |
| `B30` | `--testTimeout=30000` | 0 | `5 passed, 5 total` | `477 passed, 477 total` |

Después: `git checkout HEAD -- <los cuatro tests>`; `git diff --quiet; echo $?` = 0 y
`git diff --cached --quiet; echo $?` = 0.

## 4. Rojos que sobreviven a B

Ninguno (0 de 3 corridas). Los tres rojos extra no son reales en la base ni dependen del orden de
los virtual mocks: pasan solos, no aparecen con B ni con A en 5 de 6 corridas, y los dos que
dejaron mensaje son timeouts por carga (el de 5000 ms de jest y el `findBy` de 1000 ms de RNTL en
el fichero `profile`, que tarda más de 100 s). El del fichero `health` no se reprodujo.

## Conclusión

- El total no es 441 sino 477 en `bc5a26e7` (lo que #199 sumó al merge de `origin/dev`). CC1 debe
  decir, para A: `exit=1`, `Test Suites: 1 failed, 4 passed, 5 total`, `Tests: 1 failed, 476 passed, 477 total`
  (solo `#172 R2`); para B: `exit=0`, `Test Suites: 5 passed, 5 total`, `Tests: 477 passed, 477 total`.
  B basta; no hace falta cambiar la corrección.
- Los rojos extra del leader son carga de máquina (el fichero `profile` tardó 1062 s): conviene que CC1
  diga que se mide sin otro jest ni `init.sh` concurrente y que, si salen rojos distintos de `#172 R2`,
  se repite una vez antes de dar el criterio por incumplido. Añadir `--testTimeout=30000` a CC1 quita
  el timeout de 5000 ms pero no el `findBy` de 1000 ms de RNTL, así que no lo vuelve determinista.
