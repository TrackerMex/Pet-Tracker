---
feature: "mobile-classnames-own-tag-tree-lock"
status: approved         # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Trazabilidad — [[mobile-classnames-own-tag-tree-lock]] (#127 y #128)

R1, R2 y R3 son de #127, R4 de #128, y R5 y R6 de las dos ([[requirements]],
tabla de entradas). R1 tiene cuatro `it`, uno por pantalla, y R2 dos: cada uno
tiene su fila, y las filas de un mismo requisito citan los mismos dos commits.

Rutas de los tests, relativas a `mobile-pet-tracker/`:

- `src/app/(auth)/__tests__/login.test.tsx`
- `src/app/(auth)/__tests__/forgot.test.tsx`
- `src/app/(auth)/__tests__/register.test.tsx`
- `src/screens/reset-password/index.test.tsx`
- `src/screens/health/index.test.tsx`
- `src/components/__tests__/pet-hero-header.test.tsx`
- `src/screens/reminders/index.test.tsx`

| Requisito | Test (archivo::nombre) | Commit rojo | Commit verde |
|---|---|---|---|
| R1 (#127) | `login.test.tsx::#127 R1: el botón de envío de login lleva su receta en el árbol › pinta login-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente` | pendiente | pendiente |
| R1 (#127) | `forgot.test.tsx::#127 R1: el botón de envío de forgot lleva su receta en el árbol › pinta forgot-submit, deshabilitado, con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente` | pendiente | pendiente |
| R1 (#127) | `register.test.tsx::#127 R1: el botón de envío de register lleva su receta en el árbol › pinta register-submit, deshabilitado al montar, con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente` | pendiente | pendiente |
| R1 (#127) | `reset-password/index.test.tsx::#127 R1: el botón de envío de reset-password lleva su receta en el árbol › pinta reset-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente` | pendiente | pendiente |
| R2 (#127) | `health/index.test.tsx::#127 R2: el skeleton de vacunas lleva su receta en el árbol › pinta vaccines-skeleton con la clase exacta, rounded-card incluido, la vea o no el recorte de fuente` | pendiente | pendiente |
| R2 (#127) | `pet-hero-header.test.tsx::#127 R2: el skeleton del hero lleva su receta en el árbol › pinta pet-hero-skeleton con la clase w-full sin radio y el alto de 260 como único estilo, los vea o no el recorte de fuente` | pendiente | pendiente |
| R3 (#127) | `reminders/index.test.tsx::#127 R3: las tres píldoras de resumen llevan su receta en el árbol › pinta cada píldora con su clase exacta, rounded-xl incluido, y la esquina continua, las vea o no el recorte de fuente` | pendiente | pendiente |
| R4 (#128) | `reminders/index.test.tsx::#128 R4: el botón destructivo del sheet y su etiqueta llevan su receta en el árbol › pinta reminders-delete-confirm con la variante danger y bg-danger, y su única etiqueta Eliminar con text-danger-foreground, haya o no un señuelo en la fuente` | pendiente | pendiente |
| R5 (las dos) | sin test propio: cuentas de `grep` de [[tasks]] §R5, y las cuatro suites que leen o citan `docs/conventions.md` en verde | no aplica | pendiente |
| R6 (las dos) | sin test: cierre medido ([[tasks]] §R6 y `progress/impl_mobile-classnames-own-tag-tree-lock.md`) | no aplica | pendiente |

Regla: el reviewer no aprueba si alguna fila queda «pendiente».

## Convención de commit

Mensajes exactos, en este orden:

1. Rojo de R1: `test(mobile): expose the auth submit recipes with a versioned mutation (R1)`.
   Añade los cuatro `describe` de `#127 R1` y la mutación `P1red` en los
   cuatro ficheros de producción de autenticación.
2. Verde de R1: `test(mobile): lock the auth submit buttons' className in the tree (R1)`.
   Solo revierte esos cuatro ficheros.
3. Rojo de R2: `test(mobile): expose the skeleton recipes with a versioned mutation (R2)`.
   Añade los dos `describe` de `#127 R2` y la mutación `P2red` en salud y en
   el hero.
4. Verde de R2: `test(mobile): lock the vaccines and hero skeletons in the tree (R2)`.
   Solo revierte esos dos ficheros.
5. Rojo de R3: `test(mobile): expose the summary pill recipe with a versioned mutation (R3)`.
   Añade el `describe` de `#127 R3` y la mutación `P3red` en recordatorios.
6. Verde de R3: `test(mobile): lock the three summary pills in the tree (R3)`.
   Solo revierte recordatorios.
7. Rojo de R4: `test(mobile): expose the delete-confirm label decoy with a versioned mutation (R4)`.
   Añade el `describe` de `#128 R4` y la mutación `P4red` (`D-c`) en
   recordatorios.
8. Verde de R4: `test(mobile): lock the delete-confirm button and its label in the tree (R4)`.
   Solo revierte recordatorios.
9. R5: `docs: close the opening-tag slice limits with the tree locks (R5)`.
   Solo toca `docs/conventions.md`.
10. Evidencia: `docs(mobile): record the own-tag tree lock evidence (R1,R2,R3,R4,R5,R6)`.
    Solo toca `progress/impl_mobile-classnames-own-tag-tree-lock.md` y esta
    tabla.

## Notas

- R1 a R4 son candados sobre código ya correcto (C4, vía **b**): su commit
  rojo lleva una mutación versionada de producción y su verde la revierte con
  `git checkout HEAD~1 --` ([[design]] D8). Sus filas citan esos dos commits.
- **R5** no tiene rojo: es documentación. Su fila cita el commit 9 en la
  columna verde.
- **R6** se verifica con las medidas de [[tasks]] §R6. Su fila cita también
  el commit 9 (R5), que es el último con cambios fuera de `progress/` y
  `specs/`, y no el de evidencia.
- #128 no tiene trazabilidad propia: su puntero
  (`specs/mobile-delete-confirm-label-tree-lock/requirements.md`) remite aquí.

El implementer rellena esta tabla en el commit de evidencia y el reviewer la
valida al aprobar (ver [[../../docs/specs|specs]] y
[[../../CHECKPOINTS|CHECKPOINTS]] C5). **No rebasees** la branch después de
rellenarla: los hashes dejarían de valer. Si hace falta, reapunta cada hash y
comprueba con `git merge-base --is-ancestor <hash> HEAD` que sigue en la
historia.
