# Reanudación de Codex CLI — #103 meal-schedule-editing desde R11

> Pega el bloque de abajo en la MISMA sesión de Codex que paró antes de R11,
> o en una nueva. La enmienda E2 de la spec declara el arrastre de R11 y
> convierte el «Exigido» de las sondas en un mínimo.

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Reanudas #103 donde paraste: R10 verde en 7b44b604. Antes de nada, ejecuta
`git branch --show-current`, `git rev-parse HEAD` y `git log --oneline -3`,
y pega las salidas en progress/impl_meal-schedule-editing.md §R11. HEAD debe
ser el commit de la enmienda E2 del leader, cuyo padre es 7b44b604. Si no lo
es, PARA.

El arrastre que reportaste esta declarado en la Enmienda E2 de
specs/meal-schedule-editing/requirements.md (cabecera, §R11 y pie de
§Sondas) y en tasks.md R11 (1) y §Sondas. Con la mutacion versionada de R11
caen, todos por matcher sobre `mealsToday`:
  test/meal-times.e2e-spec.ts  R11 (el propio), R5 it 1, R6 it 1, 2 y 3
  test/meals.e2e-spec.ts       R10 it 4 (#83, "excluye las franjas del plan
                               anterior tras regenerar")
En el rojo de R11 corre <e2e-mt> y <e2e-nut> y anota cada `it` que cae con
su linea decisiva. Si cae alguno mas, o alguno de estos no cae por matcher,
PARA. El verde de R11 los devuelve todos a verde: compruebalo con los dos
mismos comandos.

Sondas (cambia el handoff original): el «Exigido» es el MINIMO de rojos,
no el conjunto exacto. Sustituye la linea del handoff original que dice
"Si alguna no da exactamente su «Exigido», PARA" por el criterio de tasks.md
§Sondas:
  - un rojo por matcher en otro `it` de los ficheros corridos NO para:
    va a la columna «Otros rojos» de la tabla, con el `it` y la linea decisiva;
  - PARA si falta un rojo exigido o no es por matcher, si cae un verde
    declarado (S3 "el resto verdes", S8 "2 y 4 verdes"), o si aparece
    cualquier rojo que no sea por matcher.
La tabla del impl gana la columna: | Sonda | Mutacion | Ficheros corridos |
Resultado | Exigido cumplido | Otros rojos |

No cambian los tests, la implementacion, las mutaciones de R11 y R12, las
sondas ni los recuentos finales.

Sigue el handoff original, progress/handoff_meal-schedule-editing.md, con
TODAS sus reglas salvo la linea de sondas citada y H0 = 2ae63956, desde R11
hasta el cierre: R11 -> R12 -> §Sondas -> R13 (a) 1-7, (b) y (c). Cambios
respecto a ese handoff:
- Faltan 6 commits literales, del
  `test(meal-schedule-editing): lock readers on edited plan (R11)`
  al `docs(meal-schedule-editing): fill #103 traceability`, en el orden del
  handoff original.
- La lista cerrada de ficheros de §Cierre gana dos mas del leader: este
  fichero y progress/current.md (lo tocan E1 y E2). Con los tres de E1 son
  cinco. No los edites.
- En el impl, §R11 anota la reanudacion y la E2, y sustituye la tabla de
  arrastre "previsto" por la medida en el rojo.
- progress/impl_meal-schedule-editing.md sigue sin commitear hasta el
  ultimo commit, como hasta ahora.
- Sigue sin ser tuyo: ./init.sh, `pnpm test:e2e` entero, la PR y el push.
```
