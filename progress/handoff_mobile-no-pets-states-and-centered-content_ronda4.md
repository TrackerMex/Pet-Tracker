Worktree: /home/claude/sites/Pet-Tracker-wt-181
Rama: feature/181-mobile-no-pets-states-and-centered-content

**Base.** El commit que añade este handoff. Obtenerlo con `git -C /home/claude/sites/Pet-Tracker-wt-181 log -1 --format=%H -- progress/handoff_mobile-no-pets-states-and-centered-content_ronda4.md`. Antes de empezar, HEAD debe ser ese commit y `git status --short` debe estar vacío.

**Qué es esta ronda.** Merge de origin/main en la rama de #181. No hay cambio de comportamiento ni tests nuevos. Solo: resolver un conflicto de merge, verificar y registrar. El reviewer aprobó la ronda 3 (HEAD 0ac2e9de) con condiciones; este merge se revisa aparte.

**Reglas.**
- Eres el único que escribe en la worktree. No ejecutes `init.sh` ni ningún e2e de backend: Postgres y LocalStack son compartidos y los lanza el leader.
- Nada de rebase, squash, ni `git checkout --ours` o `--theirs` sobre el fichero entero: pierdes el lado contrario.
- No hagas push, no abras PR, no toques `specs/`, `feature_list.json`, `progress/current.md` ni `docs/`.
- Ante cualquier fallo fuera de lo descrito: para, no lo arregles, y escríbelo en el informe.

**Pasos.**

1. `cd /home/claude/sites/Pet-Tracker-wt-181`, luego `git fetch origin` y `git merge origin/main`. Se espera un único conflicto: `mobile-pet-tracker/src/__tests__/ui-language.test.ts`. Si aparece otro, para en este paso y escribe en el informe.

2. Resolver ese conflicto. Está en el `expect` de `describe('#65 R7: Profile resuelve su copy por clave')`. La rama tiene `… + 6 + 2); // #181 R5 // #95 R5, …` y origin/main tiene `… + 6 + 2); // #185 R10: errorFileTooLarge y somethingWentWrong en ambas pantallas; #95 R5, …`. Los dos suman +2 a la misma expresión. Deja solo esta línea y quita los marcadores de conflicto:

   `expect(R7_PROFILE).toHaveLength(35 - 1 + 2 + 1 + 16 - 4 + 8 + 1 + 6 + 2 + 2); // #181 R5 // #185 R10: errorFileTooLarge y somethingWentWrong en ambas pantallas; #95 R5, +2 #99 R3, +1 #41 R9 // #158 R12; - 4 + 8 // #173 R13; #175 R7; #175 R8`

   No toques otra línea. Los demás cambios de ambos lados (`R8_REMINDERS` +3 de #181 R4 y `+ 1 // #185 R2` en #65 R18) entran sin conflicto. Si la prueba no confirma el conteo, no lo ajustes a ciegas: anota el conteo real y de dónde sale, y para.

   Después: `git add mobile-pet-tracker/src/__tests__/ui-language.test.ts`.

3. Verificar desde `mobile-pet-tracker`. El argumento de jest es regex: usa rutas literales con `--runTestsByPath`.
   - `bunx jest --runTestsByPath src/__tests__/ui-language.test.ts`: 1 suite pasa.
   - `bunx jest`: suite completa de mobile, todas verdes. No compares con 113 suites / 3759 tests: origin/main trae suites nuevas. Anota los totales y la ruta del log (fuera del repo). Si alguna prueba falla, para: anota los nombres y la ruta del log, y no repitas la corrida por tu cuenta. Jest ejecuta primero las que fallaron antes; una verde posterior no absuelve.
   - `test ! -e .expo/types/router.d.ts && bun run typecheck`: exit 0.

4. Commit del merge: `git commit -m "Merge origin/main en feature/181 (ui-language: +2 de #181 R5 y +2 de #185 R10)"`. Sin trailers. Anota el hash.

5. Añade a `progress/impl_mobile-no-pets-states-and-centered-content.md` una sección `Ronda 4: merge de origin/main` con: base, conflicto y línea final, totales de la suite completa, resultado del typecheck y hash del merge. Commit aparte: `docs(mobile-no-pets-states-and-centered-content): informe de la ronda 4 (merge de origin/main)`.

**Entrega.** Devuelve solo la ruta del informe y los dos hashes. Si paraste, di en qué paso y por qué, con la línea decisiva de la salida del comando que falló.
