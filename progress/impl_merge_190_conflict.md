# impl: merge_190_conflict
Resolución del conflicto en mobile-pet-tracker/src/screens/home/index.tsx (~292-305).

- Resolución: conservados ambos bloques intactos, sin marcadores: primero `const pingoPhrase = ...` (#190), luego `useEffect(() => { selectedPetIdRef.current = selectedPetId; }, [selectedPetId]);` (#193), luego el `useFocusEffect` existente.
- Orden: `selectedPetIdRef` se declara en la línea 188 (antes de ambos). Ambos bloques quedan antes del primer `return` condicional (empty state, ~317) y fuera de ramas. El orden relevante es que el useEffect del ref vaya antes del `useFocusEffect` que lo lee; `pingoPhrase` es un const puro, su posición es indiferente.
- `grep -nE '^(<<<<<<<|=======|>>>>>>>)'` sobre el fichero: sin salida.
- `bunx tsc --noEmit`: exit 0.
- `bunx jest --runInBand --silent --runTestsByPath src/screens/home/index.test.tsx`: exit 0, 1 suite, 258/258 tests.
- Hecho `git add` del fichero; sin commit. Logs en el scratchpad (fuera del árbol).
