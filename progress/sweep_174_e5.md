# sweep_174_e5: recuento declarado frente a medido en las seis sondas S12

Fecha: 2026-10-15
Alcance: solo lectura sobre `progress/impl_mobile-alerts-canvas-fidelity.md` §Sondas (Codex ejecutó las seis sobre el HEAD de c23, `788b4d4a`, con `limpio=0` tras cada una) y sobre `/tmp/174-s12-6.txt`.

| Sonda | Declarado en `tasks.md` | Medido | Coincide |
|---|---|---|---|
| S12.1 | 1 failed (fila `rounded-10`) | 1 failed (`limita rounded-10 a su inventario de producción`) | sí |
| S12.2 | 1 failed (fila `text-15`) | 1 failed (`limita text-15 a su inventario de producción`) | sí |
| S12.3 | 1 failed (recuento) | 1 failed (`declara border-b-5 una sola vez`) | sí |
| S12.4 | 1 failed (grep-limpio de alert-meta) | 1 failed (`utils/alert-meta.ts no introduce escapes de estilo ni emoji`) | sí |
| S12.5 | 1 failed (clases salientes) | 1 failed (`retira las clases salientes de las filas`) | sí |
| S12.6 | 1 en F (R12.4) + 1 en A | 3 failed: 1 en F (R12.4) + 2 en A | **no** |

## Causa de S12.6

`grep -rn 'mt-1.5 text-13' mobile-pet-tracker/src` da tres sitios: producción (`src/screens/alerts/index.tsx`, la cabecera) y dos aserciones literales en `src/screens/alerts/index.test.tsx`, en los `it` `pinta una cabecera por sección con su copy en español` y `envuelve cada cabecera con la primera fila de su sección en un View gap-3`, ambos del describe `#170 R3` y ambos marcados `(enmendado por #174 R6)`. `tasks.md` contó el segundo; el primero lo enmendó E2.2 y quedó fuera de la cuenta. Los tres fallos son deterministas (`toBe` sobre la cadena de clases): no son flake.

`tasks.md` y la sonda están bien en lo demás; solo el recuento de la fila S12.6 era erróneo.
