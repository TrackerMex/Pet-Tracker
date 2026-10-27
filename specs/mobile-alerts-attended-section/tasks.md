---
feature: "mobile-alerts-attended-section"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-alerts-attended-section]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Rutas relativas a
> `mobile-pet-tracker/src/`. Commits **test-primero** (C4 de `CHECKPOINTS.md`):
> un commit rojo con el test, un commit verde con la implementación mínima y,
> si hay, uno de refactor; `prettier` no aplica al móvil. El orden de las
> tareas es el de este documento.

## T0 — Línea base y mapa de rojos (antes de tocar nada)

- [x] (1) En el worktree, `cp` del `.env` y `bun install --frozen-lockfile`
  (ver memoria de worktree nuevo); **no** lanzar `./init.sh` (lo corre el leader).
- [x] (2) Medir con `grep -cF` cada ancla de [[requirements]] §Evidencia y
  anotar en `progress/impl_mobile-alerts-attended-section.md` cualquier
  discrepancia con la cifra esperada **antes** de seguir.
- [x] (3) Correr `bun run jest` solo con rutas por prefijo `src/screens/alerts`,
  `src/hooks`, `src/__tests__` y guardar el log entero en
  `progress/` (un SIGKILL de jest cuenta 0 tests: repetir). Recomputar las
  cifras de los guards de la tabla de enmiendas.
- [x] (4) Subir el mock de `reicon-react-native` de `screens/alerts/index.test.tsx`
  con `Check`, `ChevronDown` y `ChevronUp` (el doble de iconos del fichero,
  mismo patrón que los que ya hay) antes de escribir cualquier test de pantalla.
- [x] (5) Las filas `R12_ALERTS` y las claves del catálogo se añaden **con** la
  tarea de la pantalla que las pinta (R7, R10, R11), no antes: una clave sin
  uso rompe `checkUses` y una invocación sin fila también.

## R1 — drenado: pide cada página con su cursor, de una en una

- [x] (1) Escribir test que falla para R1 (`hooks/use-alerts-list.test.tsx` · `#223 R1: …`)
- [x] (2) Implementación mínima que lo pasa (`hooks/use-alerts-list.ts (opción drain + useEffect)`)
- [x] (3) Refactor con tests verdes

## R2 — sin drain: una página y clave ['alerts','list']

- [x] (1) Escribir test que falla para R2 (`hooks/use-alerts-list.test.tsx` · `#223 R2: …`)
- [x] (2) Implementación mínima que lo pasa (`hooks/use-alerts-list.ts`)
- [x] (3) Refactor con tests verdes

## R3 — kind != ok corta el drenado

- [x] (1) Escribir test que falla para R3 (`hooks/use-alerts-list.test.tsx` · `#223 R3: …`)
- [x] (2) Implementación mínima que lo pasa (`hooks/use-alerts-list.ts`)
- [x] (3) Refactor con tests verdes

## R16 — seis claves de copy en es/en, filas R12_ALERTS, una invocación por clave

- [x] (1) Escribir test que falla para R16 (`__tests__/alerts-attended-canvas-fidelity.test.ts` · `#223 R16: …`)
- [x] (2) Implementación mínima que lo pasa (`i18n/catalog.ts + __tests__/ui-copy-table.ts (la fila R12_ALERTS y el t() de la clave nacen juntos con el requisito que la pinta: ver nota)`)
- [x] (3) Refactor con tests verdes

## R4 — data solo con abiertas, por sección

- [x] (1) Escribir test que falla para R4 (`screens/alerts/index.test.tsx` · `#223 R4: …`)
- [x] (2) Implementación mínima que lo pasa (`screens/alerts/index.tsx (partición; pasa drain: true; StatusPill local)`)
- [x] (3) Refactor con tests verdes

## R5 — insignia espera al último cursor y suma todas las páginas

- [x] (1) Escribir test que falla para R5 (`screens/alerts/index.test.tsx` · `#223 R5: …`)
- [x] (2) Implementación mínima que lo pasa (`screens/alerts/index.tsx (draining / settled)`)
- [x] (3) Refactor con tests verdes

## R6 — el ack no mueve la fila; pasa a Atendidas tras refetch

- [x] (1) Escribir test que falla para R6 (`screens/alerts/index.test.tsx` · `#223 R6: …`)
- [x] (2) Implementación mínima que lo pasa (`screens/alerts/index.tsx`)
- [x] (3) Refactor con tests verdes

## R7 — «Atendidas» colapsada con contador, solo asentada y con atendidas

- [x] (1) Escribir test que falla para R7 (`screens/alerts/index.test.tsx` · `#223 R7: …`)
- [x] (2) Implementación mínima que lo pasa (`screens/alerts/index.tsx`)
- [x] (3) Refactor con tests verdes

## R8 — alternar sección; 10 filas; recuerda cuántas había

- [x] (1) Escribir test que falla para R8 (`screens/alerts/index.test.tsx` · `#223 R8: …`)
- [x] (2) Implementación mínima que lo pasa (`screens/alerts/index.tsx`)
- [x] (3) Refactor con tests verdes

## R9 — fila atendida compacta, sin ack, abre el detalle

- [x] (1) Escribir test que falla para R9 (`screens/alerts/index.test.tsx` · `#223 R9: …`)
- [x] (2) Implementación mínima que lo pasa (`screens/alerts/index.tsx`)
- [x] (3) Refactor con tests verdes

## R10 — «Ver más» suma 10; pie «Mostrando N de M»

- [x] (1) Escribir test que falla para R10 (`screens/alerts/index.test.tsx` · `#223 R10: …`)
- [x] (2) Implementación mínima que lo pasa (`screens/alerts/index.tsx`)
- [x] (3) Refactor con tests verdes

## R11 — sin abiertas: tarjeta «Todo en calma»

- [x] (1) Escribir test que falla para R11 (`screens/alerts/index.test.tsx` · `#223 R11: …`)
- [x] (2) Implementación mínima que lo pasa (`screens/alerts/index.tsx`)
- [x] (3) Refactor con tests verdes

## R12 — sin alertas: EmptyState; primera página con error: reintento

- [x] (1) Escribir test que falla para R12 (`screens/alerts/index.test.tsx` · `#223 R12: …`)
- [x] (2) Implementación mínima que lo pasa (`screens/alerts/index.tsx (sin regresión)`)
- [x] (3) Refactor con tests verdes

## R13 — esqueleto mientras drena sin abiertas

- [x] (1) Escribir test que falla para R13 (`screens/alerts/index.test.tsx` · `#223 R13: …`)
- [x] (2) Implementación mínima que lo pasa (`screens/alerts/index.tsx`)
- [x] (3) Refactor con tests verdes

## R14 — falla una página tardía: parcial + error

- [x] (1) Escribir test que falla para R14 (`screens/alerts/index.test.tsx` · `#223 R14: …`)
- [x] (2) Implementación mínima que lo pasa (`screens/alerts/index.tsx`)
- [x] (3) Refactor con tests verdes

## R15 — sin onEndReached

- [x] (1) Escribir test que falla para R15 (`screens/alerts/index.test.tsx` · `#223 R15: …`)
- [x] (2) Implementación mínima que lo pasa (`screens/alerts/index.tsx (borrar onEndReached)`)
- [x] (3) Refactor con tests verdes

## R17 — clases y dianas del canvas

- [x] (1) Escribir test que falla para R17 (`__tests__/alerts-attended-canvas-fidelity.test.ts` · `#223 R17: …`)
- [x] (2) Implementación mínima que lo pasa (`screens/alerts/index.tsx`)
- [x] (3) Refactor con tests verdes

## R18 — candados enmendados nombran su enmienda

- [x] (1) Escribir test que falla para R18 (`__tests__/alerts-attended-canvas-fidelity.test.ts` · `#223 R18: …`)
- [x] (2) Implementación mínima que lo pasa (`tests y guards de la tabla de enmiendas (solo tests)`)
- [x] (3) Refactor con tests verdes

## R19 — línea de docs/ui-guidelines.md (solo tras la casilla G4)

- [ ] (1) Escribir test que falla para R19 (`__tests__/alerts-attended-canvas-fidelity.test.ts` · `#223 R19: …`)
- [ ] (2) Implementación mínima que lo pasa (`docs/ui-guidelines.md`)
- [ ] (3) Refactor con tests verdes

## Notas por tarea

- **R16 con R7/R10/R11.** El test de R16 (catálogo) se escribe una vez al
  principio y queda rojo hasta cerrar R11; las claves entran en `catalog.ts` y
  en `R12_ALERTS` en el commit verde del requisito que las pinta
  (`alerts.attended` en R7, `alerts.attendedMore` y `alerts.attendedShowing`
  en R10, `alerts.calmTitle` y `alerts.calmBody` en R11, `alerts.sectionOpen`
  en R11). Esto mantiene `ui-language.test.ts` en verde en cada commit.
- **R17 por tandas.** Un `it` de fidelidad por fila de la tabla de clases; cada
  uno nace rojo con el commit del test de su requisito y se vuelve verde con el
  commit de su implementación. Las dianas táctiles se miden por clase.
- **R18.** Las enmiendas de guards (`chunky-cta`, `design-drift`,
  `alerts-canvas-fidelity`) van en el **commit del requisito que las provoca**
  (`rounded-16` y la fila → R9; `rounded-14` y «Ver más» → R10; `tracking-caps`
  → R7/R11), nunca en un commit aparte posterior: un guard rojo entre commits
  rompe la cadena. Cada enmienda lleva el sufijo `(enmendado por #223 R18)`.
- **R6 y R15.** Antes de borrar `onEndReached` (R15) se enmiendan los `it` de
  `#78 R9` que lo disparan; el commit rojo de R15 es el test que aserta su
  ausencia.
- **R19.** No se implementa hasta que el leader confirme la casilla G4 firmada
  por el humano; hasta entonces `traceability.md` lo deja `pendiente`.
- **Ruido de entorno.** Un rojo en Salud #168 R2, Inicio #152 R8 o Nutrición
  #200 R9/R10 es un flake conocido: repetir una vez y, si pasa, anotarlo; no
  enmendar.
