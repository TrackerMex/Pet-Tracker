---
feature: "mobile-pet-hero-header"
status: approved     # draft | spec_ready | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-pet-hero-header]]

Rutas relativas a `mobile-pet-tracker/`. La columna **Test** la **prescribe la
spec** (no la improvisa el implementer): es el contrato de qué prueba cada
R-id. La columna **Commit** la rellena el implementer en cuanto ese requisito
queda verde, nunca al final.

| Requisito | Test (archivo::nombre) — prescrito por la spec | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/components/__tests__/pet-hero-header.test.tsx`::`R1: PetHeroHeader es el único hero compartido` | pendiente |
| R2 | `src/components/__tests__/pet-avatar.test.tsx`::`R2: PetAvatar acepta tamaño rectangular, cacheKey y degrada al fallar la foto` **y** `src/components/__tests__/pet-hero-header.test.tsx`::`R2: el hero pinta foto a sangre o blobatar` | pendiente |
| R2b | `src/components/__tests__/pet-avatar.test.tsx`::`R2: PetAvatar acepta tamaño rectangular, cacheKey y degrada al fallar la foto` → `it('vuelve al blobatar cuando la foto no carga')` | pendiente |
| R3 | `src/components/__tests__/pet-hero-header.test.tsx`::`R3: el texto del hero va sobre fondo opaco` (4 `it`: banda inferior opaca, slot opaco, forma de las dos cadenas de degradado, forma hex del token `background` en los dos temas) | pendiente |
| R3b | mismo `describe` que R3 → `it('no renderiza texto sobre la capa de medios')`: `pet-hero-media` no tiene descendientes `Text` | pendiente |
| R4 | `src/components/__tests__/pet-hero-header.test.tsx`::`R4: el slot superior respeta la safe area` | pendiente |
| R5 | `src/app/(tabs)/__tests__/home.test.tsx`::`R5: Home usa el hero compartido` | pendiente |
| R5b | mismo `describe` que R5 → `it('conserva gap y paddingBottom y saca el padding horizontal a un envoltorio')` | pendiente |
| R6 | `src/screens/profile/index.test.tsx`::`R6: Profile usa el hero compartido` | pendiente |
| R7 | `src/app/(tabs)/__tests__/home.test.tsx`::`R7: el hero pinta los paseos de hoy` **y** `src/screens/profile/index.test.tsx`::`R6: Profile usa el hero compartido` → `it('no pinta dato destacado')` | pendiente |
| R7b | `src/__tests__/ui-language.test.ts` (candado de catálogo ya existente: una clave sin traducción en algún idioma no compila) + `src/__tests__/ui-copy-table.ts` fila nueva de `R3_HOME` | pendiente |
| R8 | `src/components/__tests__/pet-hero-header.test.tsx`::`R8: el hero sin mascota es un skeleton dimensionado` | pendiente |
| R8b | `src/app/(tabs)/__tests__/home.test.tsx`::`R8: el error del detalle deja el selector alcanzable` | pendiente |
| R9 | Requisito de **verificación** (C4 vía (b)): suite móvil completa verde + **prueba de mutación** con las tres mutaciones de [[tasks]] R9 (1) plantadas en `src/components/pet-hero-header.tsx`, con la evidencia en `progress/review_mobile-pet-hero-header.md` | pendiente |
| R9b | Los deltas contra `303fc19` de la tabla de [[requirements]] R9b, verificados por el reviewer rehaciendo cada grep | pendiente |
| R10 | `src/__tests__/hero-header-amendments.test.ts`::`R10: las specs enmendadas por #67 llevan su bloque` | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente" en la columna
Commit.
Convención de commit: `feat(mobile-pet-hero-header): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida al
aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

**Fuera de esta tabla y no delegable a IA**: el gate humano de smoke en dev
build de Android, con foto y sin foto, en tema claro y oscuro. Sin él la
feature no pasa a `done`, tenga la tabla las filas que tenga.
