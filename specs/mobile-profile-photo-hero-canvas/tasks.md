---
feature: "mobile-profile-photo-hero-canvas"
status: approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-profile-photo-hero-canvas]]

Un bloque TDD por requisito o por bloque de requisitos (D14): (1) commit rojo
con los `it` del R-id y las enmiendas de los candados que ese bloque revierte
(requirements.md §Candados que esta feature revierte); (2) commit verde con la
implementación mínima; (3) refactor solo si hace falta, en commit aparte.
Rutas relativas a `mobile-pet-tracker/` salvo `docs/` y `specs/`.
Precondiciones en design.md §Dependencias y precondiciones: #197 mergeada y la
Base medida re-medida.

## Orden

1. **R3**: el prop `caption` de `PetHeroHeader`. Es aditivo y no cambia Perfil.
2. **R11 (rojo)**: sustituye el `it` de `#168 R12` en
   `src/__tests__/tab-headers-canvas.test.ts` por los dos `it` de `#196 R11` (K25).
3. **R11 (verde)**: texto de la Enmienda #196 en `docs/ui-guidelines.md` y
   marcador de la fila 4 de `AMENDED_DOCS_168` (K41), **solo** si la casilla
   `Enmienda #196 aprobada por humano` está marcada; si no lo está, para y
   avisa. El `it` de `PetHeroHeader` de R11 sigue rojo y pasa a verde en el
   verde de R1+R4.
4. **Bloque R1+R4**: hero, pie con nombre y chips (R1.4), cámara y
   `photo-upload-error`. Un rojo y un verde para los dos R-id.
5. **Bloque R2+R5**: fila de título y selector en el slot, aviso ámbar. Un
   rojo y un verde para los dos R-id.
6. **R6**: «Cerrar sesión».
7. **R7**: `ToggleSwitch` (y K35: fuera el `describe` de `#197 R20`).
8. **R8**: trazo de los iconos de accesos.
9. **R9**: índices de entrada. Sus `it` nacen verdes (D14).
10. **R10** al final: el test de fidelidad lee la producción ya terminada.

## Notas para el handoff a Codex

- **Commits test primero, siempre**: un commit rojo y uno verde por R-id o por
  bloque (R1+R4, R2+R5). Nada de implementación, tests y docs en un solo
  commit (C4 de `CHECKPOINTS.md`). La única enmienda de candado que va en un
  verde es K41 (verde de R11, junto con la carta).
- Sin dependencias nuevas, sin `./init.sh`, sin push, sin tocar
  `src/screens/home/`, `src/screens/health/` ni `src/screens/map/`
  (#198, #199, #201). `bun` para todo en móvil.
- RNTL 14: `await` en todo `fireEvent` y `act`.
- Dobles de `src/screens/profile/index.test.tsx`: los que ya existen
  (`mockHomeEntrance`, `mockPetSwitcher`, insets `top: 40` / `bottom: 24`) más
  tres cambios de cabecera, cada uno en el rojo que los necesita: K38 (doble de
  `react-native-reanimated`) y K37 (`MockIcon` reenvía `strokeWidth`) en el
  rojo de R1+R4; K36 (`trailing?: ReactNode` en las dos declaraciones de
  `PetSwitcher`) en el rojo de R2+R5. K39 pone el mismo doble de reanimated en
  `src/app/(tabs)/__tests__/screens.test.tsx`, en el rojo de R2+R5.
- **Doble de reanimated (K38, K39)**: funciones del doble de
  `src/components/__tests__/pet-hero-header.test.tsx` (el bloque con
  `withSequence: jest.fn((...steps: unknown[]) => steps.at(-1))`) y forma de
  módulo del de `src/screens/home/index.test.tsx` (`...actual` y
  `__esModule: true,`, sin sobrescribir `default`). Léelos los dos antes de
  escribirlo; no copies el de `pet-hero-header.test.tsx` tal cual (D15).
- No dobles `PetHeroHeader`, `BubblePop` ni `useChunkyLip`: los tests leen el
  componente real y `useChunkyLip().primary` del hook real.
- **Cero `#NNN` en `src/screens/profile/index.tsx`**, comentarios incluidos
  (R1.5): `#173 R15` veta `/#[0-9a-fA-F]{3,8}\b/` sobre el fuente entero sin
  exención. Los comentarios `#196 R<n>` van en los tests y, si quieres, en
  `src/components/pet-hero-header.tsx`.
- `text-15` va en un `<Text>` de React Native, nunca en `Button.Label`
  (enmienda #187). `bg-category-*` solo vía `CATEGORY_SLOTS.*.surface`. Cero
  `StyleSheet.create`, cero clases `[…]`, cero hex en `P` y `H`.
- Una sola fila de título con dos className por ternario sobre `showHero`
  (design.md §Decisiones técnicas). Hasta el verde de R2+R5 la fila sigue
  como primer hijo de `profile-content` en las dos ramas.
- `BubblePop` se importa de `src/screens/home/bubble-pop.tsx` y no se modifica.
- **Filas que nacen verdes**: anótalas en el informe con su motivo. Se
  esperan las de R4.2 (`sin detalle cargado ($name) no monta la cámara`),
  R5.4 (`con el permiso concedido no pinta el aviso`) y todas las de R9. Si un
  `it` de la tabla de candados nace verde, compruébalo contra los `it`
  anteriores antes de seguir.
- Un `it` no inventariado en rojo: aplica el párrafo «Enmienda mecánica
  permitida» de requirements.md; cualquier otro rojo es parada.
- Informe en `progress/impl_mobile-profile-photo-hero-canvas.md`, con la tabla
  «Enmiendas mecánicas», las filas que nacieron verdes y las cuentas de la
  sección siguiente.

## Cuentas a re-medir al terminar (base + delta)

Desde `mobile-pet-tracker/` (salvo `docs/`). Base = requirements.md §Base
medida tras el merge de #197. `P` = `src/screens/profile/index.tsx`,
`H` = `src/components/pet-hero-header.tsx`,
`T` = `src/screens/profile/index.test.tsx`.

| Comando | Base | Delta | Esperado |
|---|---|---|---|
| `grep -cF 'PetHeroHeader' P` | 0 | +3 (import, apertura, cierre) | 3 |
| `grep -cF 'variant="avatars"' P` | 1 | -1 | 0 |
| `grep -cF 'profile-hero-skeleton' P` | 1 | -1 | 0 |
| `grep -cF 'profile-entrance-hero' P` | 1 | -1 | 0 |
| `grep -cF 'profile-pet-avatar' P` | 2 | -2 | 0 |
| `grep -cF 'size={96}' P` | 1 | -1 | 0 |
| `grep -cF 'text-26' P` | 1 | -1 | 0 |
| `grep -cF '<Card testID="notifications-blocked-notice"' P` | 1 | -1 | 0 |
| `grep -cF '<Card' P` | 5 | -2 (tarjeta hero, aviso) | 3 |
| `grep -cF 'paddingTop: insets.top + 12' P` | 1 | 0 (pasa a `profile-content` sin hero) | 1 |
| `grep -cF 'padding: 20,' P` | 1 | -1 | 0 |
| `grep -cF 'rounded-xl bg-danger-soft' P` | 1 | -1 | 0 |
| `grep -cF '<Button.Label className="font-bold text-danger">' P` | 1 | -1 | 0 |
| `grep -cF '<Switch' P` | 1 | -1 | 0 |
| `grep -cF "Switch } from 'heroui-native'" P` | 1 | -1 | 0 |
| `grep -cF 'ToggleSwitch } from' P` | 0 | +1 | 1 |
| `grep -cF 'size={22}' P` | 4 | 0 | 4 |
| `grep -cF 'strokeWidth' P` | 0 | +6 (4 accesos, `Plus`, `Camera`) | 6 |
| `grep -cF 'useChunkyLip' P` | 0 | +2 (import, llamada) | 2 |
| `grep -cF 'chunkyLip.primary' P` | 0 | +2 (cámara, CTA del aviso) | 2 |
| `grep -cF 'BubblePop' P` | 0 | +3 (import, apertura, cierre) | 3 |
| `grep -cF 'text-accent-strong' P` | 3 | 0 | 3 |
| `grep -cF 'tracking-tight' P` | 0 | 0 | 0 |
| `grep -cF 'text-3xl font-black tracking-title text-accent-foreground' P` | 0 | +1 | 1 |
| `grep -cF 'text-3xl font-black tracking-title text-foreground' P` | 1 (tras #197; hoy `tracking-tight`) | 0 | 1 |
| `grep -cF 'text-3xl font-black leading-8.5 tracking-display text-foreground' P` | 0 | +1 | 1 |
| `grep -cF 'StyleSheet' P` | 0 | 0 | 0 |
| `grep -cE '#[0-9a-fA-F]{3,8}\b' P` | 0 | 0 | 0 |
| `grep -cF 'caption?: ReactNode' H` | 0 | +1 | 1 |
| `grep -cF 'testID="pet-hero-caption"' H` | 1 | 0 | 1 |
| `grep -cP '#(?!\d{2,3} R\d)[\da-fA-F]{3,8}\b' H` | 0 | 0 | 0 |
| `grep -cF "jest.mock('react-native-reanimated'" T` | 0 | +1 (K38) | 1 |
| `grep -cF 'trailing?: ReactNode' T` | 0 | +2 (K36) | 2 |
| `grep -cF 'function MockIcon({ color, size }: { color?: string; size?: number })' T` | 1 | -1 (K37) | 0 |
| `grep -cF "jest.mock('react-native-reanimated'" 'src/app/(tabs)/__tests__/screens.test.tsx'` | 0 | +1 (K39) | 1 |
| `grep -cF 'toBeGreaterThanOrEqual(41)' src/__tests__/heroui-text-size-merge.test.ts` | 1 | -1 (K40) | 0 |
| `grep -cF 'toBeGreaterThanOrEqual(39)' src/__tests__/heroui-text-size-merge.test.ts` | 0 | +1 (K40) | 1 |
| `grep -cF '**Regla N1 (enmienda B4 de #168)**' src/__tests__/hero-header-amendments.test.ts` | 1 | -1 (K41) | 0 |
| `grep -cF '**Regla N1 (enmienda #196)**' src/__tests__/hero-header-amendments.test.ts` | 0 | +1 (K41) | 1 |
| `grep -cF "describe('#197 R20: cimientos sin cablear'" src/__tests__/canvas-foundations.test.ts` | 1 (tras #197) | -1 (K35) | 0 |
| `test -e src/__tests__/profile-photo-hero-canvas.test.ts` | falso | creado | verdadero |
| `grep -cF 'Inicio es la única pestaña con PetHeroHeader' docs/ui-guidelines.md` | 1 | -1 | 0 |
| `grep -cF '**Regla N1 (enmienda B4 de #168)**' docs/ui-guidelines.md` | 1 | -1 | 0 |
| `grep -cF '**Regla N1 (enmienda #196)**' docs/ui-guidelines.md` | 0 | +1 | 1 |

Si otra feature de la ola 2 ya borró el `describe` de `#197 R20` antes de
#196, su fila da base 0, delta 0 y esperado 0 (K35 sin efecto; se anota).

Además, `bunx jest` completo en verde y `bunx expo lint` con la salida a un log
(`> log 2>&1`), comprobando que el log no trae `SIGKILL`.

## Bloques TDD

### R3 — Prop `caption` de `PetHeroHeader`
1. Rojo: los tres `it` de `#196 R3` en `src/components/__tests__/pet-hero-header.test.tsx`.
2. Verde: prop `caption?: ReactNode` en `H`; dentro de `pet-hero-caption`,
   `pet ? (caption ?? <lo de hoy>) : <skeletons de hoy>`. Perfil no cambia.
3. Refactor: ninguno previsto.

### R11 — Enmienda #196 de la carta
1. Rojo: los dos `it` de `#196 R11` en `tab-headers-canvas.test.ts` en lugar
   del de `#168 R12` (K25).
2. Verde (solo con la casilla `Enmienda #196 aprobada por humano` marcada; si
   no, para y avisa): texto de design.md §Texto de la Enmienda #196 en
   `docs/ui-guidelines.md`, en lugar de la línea `**Regla N1 (enmienda B4 de #168)**`,
   y en el mismo commit K41: el `marker` de la fila 4 de `AMENDED_DOCS_168` en
   `src/__tests__/hero-header-amendments.test.ts` pasa a ese mismo texto y el
   título del `it` añade ` (enmendado por #196 R11)`. Pasa a verde
   `#196 R11: la carta recoge la enmienda N1 de #196`; el de `PetHeroHeader`
   sigue rojo hasta el verde de R1+R4.
3. Refactor: ninguno previsto.

### Bloque R1+R4 — Hero a sangre, pie y cámara
1. Rojo, en un solo commit:
   - Cabecera de `T`: K38 (doble de reanimated) y K37 (`MockIcon` con `strokeWidth`).
   - `it` nuevos: columna `hero` en `PROFILE_BRANCHES_168` e `it.each`
     `#196 R1: en la rama $name monta el hero = $hero`;
     `#196 R1: pinta nombre y chips dentro del pie del hero` (R1.4); los tres
     `it` de `#196 R4`.
   - Enmiendas: K5, K6, K7, K8, K9 paso 1, K10, K12, K13, K14, K15, K16, K17,
     K18, K19, K20 paso 1, K22, K23, K27, K28, K29, K30, K31 paso 1 y K40.
2. Verde: `showHero`, `<View testID="profile-hero" className="relative">` con
   `PetHeroHeader variant="bleed"` y `caption` (`profile-pet-card` con nombre
   y chips), `contentContainerStyle` y `profile-content`; la fila de título
   queda como primer hijo de `profile-content` en las dos ramas. Quita la
   tarjeta hero, `profile-entrance-hero` y el skeleton propio. `BubblePop`
   `profile-change-photo-pop` como segundo hijo de `profile-hero`,
   `change-photo` con `chunkyLip.primary` y `Camera` 18/2.4;
   `photo-upload-error` antes de `profile-entrance-info`. Pasa a verde además
   `#196 R11: PetHeroHeader solo en Inicio y Perfil`. R1.5: ningún `#NNN` en `P`.
3. Refactor: ninguno previsto.

### Bloque R2+R5 — Fila de título y selector sobre la foto, aviso ámbar
1. Rojo, en un solo commit:
   - Cabeceras: K1 y K36 en `T`; K39 en `src/app/(tabs)/__tests__/screens.test.tsx`.
   - `it` nuevos: los cuatro de `#196 R2` y los cuatro de `#196 R5`.
   - Enmiendas: K2, K4, K9 paso 2, K11, K26, K31 paso 2 y K32.
2. Verde: una fila de título con className por rama, `profile-hero-top` como
   `children` del hero, `PetSwitcher variant="glass"` sin `trailing`, `Plus`
   16/2.6; `HomeEntrance` 0 con el `View` ámbar, texto `leading-note` y
   `Button` con labio.
3. Refactor: ninguno previsto.

### R6 — «Cerrar sesión»
1. Rojo: los dos `it` de `#196 R6`; enmiendas K20 paso 2, K21, K24, K33 y K34.
2. Verde: `HomeEntrance` 4, `Button variant="danger-soft"` con
   `h-13 rounded-14 ${CATEGORY_SLOTS.rose.surface}` y un `Text`
   `text-15 font-extrabold text-danger`.
3. Refactor: ninguno previsto.

### R7 — Interruptor «Usar tema oscuro»
1. Rojo: `#196 R7: el tema usa ToggleSwitch con pulgar` y el `it.each` de las
   dos direcciones; K35: borra entero `describe('#197 R20: cimientos sin cablear')`
   de `src/__tests__/canvas-foundations.test.ts`, con sus dos `it`, sin sufijo
   y sin sustituto (si ya no existe, se anota y se sigue).
2. Verde: `ToggleSwitch` `theme-toggle`; fuera el `Switch` de HeroUI.
3. Refactor: ninguno previsto.

### R8 — Trazo de los iconos de accesos
1. Rojo: `it.each` `#196 R8: el icono de $0 usa trazo 2.2` (lee
   `props.strokeWidth`, que `MockIcon` reenvía desde K37).
2. Verde: `strokeWidth={2.2}` en los cuatro iconos.
3. Refactor: ninguno previsto.

### R9 — Entradas escalonadas
1. `it.each` `#196 R9: en la rama $name los índices de entrada son fijos` y
   `#196 R9: con el permiso bloqueado el aviso entra con índice 0`, en un solo
   commit de test. **Nacen verdes** (D14): R1+R4, R2+R5 y R6 ya fijan los
   índices 0–4 y quitan `profile-entrance-hero`. Anótalo en el informe; no hay
   commit verde propio.
2. Verde: no aplica.
3. Refactor: ninguno previsto.

### R10 — Fidelidad a los artboards congelados
1. Rojo: `src/__tests__/profile-photo-hero-canvas.test.ts` con las 24 filas y
   el `it` de los tres artboards. Las filas que la producción ya cumple nacen
   verdes: anótalas en el informe.
2. Verde: ajustar la producción hasta que las 24 filas pasen. Si una fila de
   canvas falla, el artboard congelado manda: para y avisa.
3. Refactor: ninguno previsto.
