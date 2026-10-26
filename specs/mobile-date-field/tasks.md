---
feature: "mobile-date-field"
status: approved
tags: [harness, spec]
---

# Tareas — [[mobile-date-field]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. El diseño y el inventario de
> candados con sus anclas están en [[design]].

## Cadena de commits (test primero, historial rojo a verde)

Cada par es un commit `test(...)` que deja un test rojo por la razón correcta y un
commit `feat(...)` que lo pone verde. Los candados que se rompen al migrar una pantalla
(inventario de [[design]] §Candados) se enmiendan **en el commit `feat` de esa pantalla**,
con la cifra medida en ese momento (total acumulado, no el final: memorias «Guardas de
cadena en estado intermedio» y «Cuentas de handoff encadenadas»). Ningún commit mezcla
tests, implementación y docs. Cada commit corre `bun run typecheck`, el jest de su
alcance y, antes del `feat` de cada pantalla, el jest completo sin pipe.

Orden con sujeto existente en cada paso: las utilidades antes que el componente, el
componente antes que las pantallas, cada pantalla con su candado.

| Commit | Tipo | Contenido | R |
|---|---|---|---|
| C1 | test | `utils/civil-date.test.ts` rojo (el módulo no existe) | R1 |
| C2 | feat | `utils/civil-date.ts` | R1 |
| C3 | test | `components/__tests__/date-field.test.tsx` rojo (el componente no existe) | R2-R11, R17, R18 |
| C4 | feat | `components/date-field.tsx`; +5 claves `dateField.*` en `i18n/catalog.ts` (en y es); `R18_DATE_FIELD` y su alta en `ui-copy-table.ts`/`ui-language.test.ts`; aritmética de `language-provider.test.tsx` `+ 5`; fila `date-field.tsx` 1 en `directUses` y totales `+ 1` | R2-R11, R16, R17 |
| C5 | test | `weight-log/index.test.tsx` reescrito y rojo | R12 |
| C6 | feat | pantalla de peso; retira `weightLog.yyyyMmDd` (catálogo, fila de `R5_HEALTH`, `R5_HEALTH` `- 1`, aritmética `- 1`) | R12, R16 |
| C7 | test | `docs-upload-form/index.test.tsx` reescrito y rojo | R13 |
| C8 | feat | pantalla de documentos; retira `docs.datePlaceholder` (catálogo, fila de `R7_PROFILE`, `R7_PROFILE` `- 1`, aritmética `- 1`, fila del `it` #158 R1 y su título a 12) | R13, R16 |
| C9 | test | `add-pet/index.test.tsx` reescrito y rojo | R14 |
| C10 | feat | alta de mascota; `directUses` add-pet `6 -> 5`; `add-pet-two-steps` `6 -> 5`; totales `- 1` | R14, R17 |
| C11 | test | `add-reminder/index.test.tsx` reescrito y rojo | R15 |
| C12 | feat | recordatorio; `directUses` add-reminder `3 + 1 - 2`; icono `['Bell']` en #178 R13; totales `- 2` | R15, R17 |
| C13 | docs | `traceability.md` con hashes y `progress/impl_mobile-date-field.md` | todos |

Totales acumulados de `consistency-classnames` (`#62 R14`, las dos sumas): base `+ 0`;
tras C4 `+ 1`; tras C10 `+ 0`; tras C12 `- 2`. Aritmética de claves de
`language-provider.test.tsx`: base `+ 0`; tras C4 `+ 5`; tras C6 `+ 5 - 1`; tras C8
`+ 5 - 2`. `SCREEN_FILES` `+ 1` desde C4. `R5_HEALTH` `- 1` desde C6; `R7_PROFILE` `- 1`
desde C8. Cada commit escribe la cifra de su estado, no la final.

Prohibido para Codex: `./init.sh` (lo corre el leader), crear recursos AWS, tocar
`meal-schedule`, `global.css`, `utils/form-rules.ts`, `utils/date-picker-value.ts`,
`utils/reminder-dates.ts`. Skills: nombres del catálogo de Codex del handoff, no los de
Claude Code. Esperas sobre el árbol: `docs/conventions.md` §Esperas sobre el árbol renderizado (`await` en `fireEvent`, `renderRouter` y `act`; sin contadores de mock).

## R1 — utilidades de fecha civil (`utils/civil-date.ts`)

- [ ] (1) Escribir test que falla para R1
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R2 — etiqueta de fecha formateada en `-value`

- [ ] (1) Escribir test que falla para R2
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — vacío, no analizable, placeholder y hora tal cual

- [ ] (1) Escribir test que falla para R3
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R4 — estructura del disparador (Pressable, InputGroup, icono, sin FieldError)

- [ ] (1) Escribir test que falla para R4
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R5 — `isInvalid` y etiqueta opcional

- [ ] (1) Escribir test que falla para R5
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — selector nativo montado al abrir, props y copy de botones

- [ ] (1) Escribir test que falla para R6
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R7 — conversión de fecha (centinelas, Android, iOS, cierre)

- [ ] (1) Escribir test que falla para R7
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R8 — mínimo y máximo crudos a mediodía local; abrir en hoy limitado

- [ ] (1) Escribir test que falla para R8
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R9 — modo hora sin conversión UTC

- [ ] (1) Escribir test que falla para R9
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R10 — descartar no cambia el valor

- [ ] (1) Escribir test que falla para R10
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R11 — botón de borrar con `allowClear`

- [ ] (1) Escribir test que falla para R11
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R12 — Registro de peso migrado

- [ ] (1) Escribir test que falla para R12
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R13 — Documentos migrado

- [ ] (1) Escribir test que falla para R13
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R14 — Alta de mascota migrada

- [ ] (1) Escribir test que falla para R14
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R15 — Nuevo recordatorio migrado

- [ ] (1) Escribir test que falla para R15
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R16 — copy: cinco claves nuevas, dos retiradas

- [ ] (1) Escribir test que falla para R16
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R17 — candados verdes y `date-field.tsx` grep-limpio

- [ ] (1) Escribir test que falla para R17
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R18 — `meal-schedule` y `global.css` sin cambio

- [ ] (1) Escribir test que falla para R18
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes
