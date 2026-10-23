---
feature: "mobile-profile-photo-hero-canvas"
status: spec_ready     # draft | spec_ready | approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-profile-photo-hero-canvas]]

Un bloque TDD por requisito: (1) commit rojo con los `it` del R-id y las
enmiendas de los candados que ese R revierte (requirements.md §Candados que
esta feature revierte); (2) commit verde con la implementación mínima;
(3) refactor solo si hace falta, en commit aparte. Rutas relativas a
`mobile-pet-tracker/` salvo `docs/` y `specs/`. Precondiciones en design.md
§Dependencias y precondiciones: #197 mergeada y la Base medida re-medida.

## Orden recomendado

1. **R3**: el prop `caption` de `PetHeroHeader`. Es aditivo y no cambia Perfil.
2. **R11 (rojo)**: sustituye el `it` de `#168 R12` en
   `src/__tests__/tab-headers-canvas.test.ts` por los dos `it` de `#196 R11` (K25).
   El de la carta pasa a verde con la edición de `docs/ui-guidelines.md`,
   **solo** si la casilla `Enmienda #196 aprobada por humano` está marcada; si
   no lo está, para y avisa. El de `PetHeroHeader` pasa a verde en R1.
3. **R1**: monta el hero, el `contentContainerStyle` nuevo y `profile-content`.
4. **R2**: fila de título y selector en el slot.
5. **R4**: cámara con `BubblePop` y labio.
6. **R5**: aviso ámbar.
7. **R6**: «Cerrar sesión».
8. **R7**: `ToggleSwitch`.
9. **R8**: trazo de los iconos de accesos.
10. **R9**: índices de entrada.
11. **R10** al final: el test de fidelidad lee la producción ya terminada.

## Notas para el handoff a Codex

- **Commits test primero, siempre**: un commit rojo y uno verde por R-id. Nada
  de implementación, tests y docs en un solo commit (C4 de `CHECKPOINTS.md`).
- Sin dependencias nuevas, sin `./init.sh`, sin push, sin tocar
  `src/screens/home/`, `src/screens/health/` ni `src/screens/map/`
  (#198, #199, #201). `bun` para todo en móvil.
- RNTL 14: `await` en todo `fireEvent` y `act`.
- Los dobles ya existen en `src/screens/profile/index.test.tsx`
  (`mockHomeEntrance`, `mockPetSwitcher`, insets `top: 40` / `bottom: 24`).
  No dobles `PetHeroHeader`, `BubblePop` ni `useChunkyLip`: los tests leen el
  componente real y `useChunkyLip().primary` del hook real.
- `text-15` va en un `<Text>` de React Native, nunca en `Button.Label`
  (enmienda #187). `bg-category-*` solo vía `CATEGORY_SLOTS.*.surface`. Cero
  `StyleSheet.create`, cero clases `[…]`, cero hex en `P` y `H`.
- Una sola fila de título con dos className por ternario sobre `showHero`
  (design.md §Decisiones técnicas).
- `BubblePop` se importa de `src/screens/home/bubble-pop.tsx` y no se modifica.
- Un `it` no inventariado en rojo: aplica el párrafo «Enmienda mecánica
  permitida» de requirements.md; cualquier otro rojo es parada.
- Informe en `progress/impl_mobile-profile-photo-hero-canvas.md`, con la tabla
  «Enmiendas mecánicas» y las cuentas de la sección siguiente.

## Cuentas a re-medir al terminar (base + delta)

Desde `mobile-pet-tracker/` (salvo `docs/`). Base = requirements.md §Base
medida tras el merge de #197. `P` = `src/screens/profile/index.tsx`,
`H` = `src/components/pet-hero-header.tsx`.

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
| `grep -cF 'tracking-tight' P` | 0 | 0 | 0 |
| `grep -cF 'text-3xl font-black tracking-title text-accent-foreground' P` | 0 | +1 | 1 |
| `grep -cF 'text-3xl font-black tracking-title text-foreground' P` | 1 (tras #197; hoy `tracking-tight`) | 0 | 1 |
| `grep -cF 'text-3xl font-black leading-8.5 tracking-display text-foreground' P` | 0 | +1 | 1 |
| `grep -cF 'StyleSheet' P` | 0 | 0 | 0 |
| `grep -cF 'caption?: ReactNode' H` | 0 | +1 | 1 |
| `grep -cF 'testID="pet-hero-caption"' H` | 1 | 0 | 1 |
| `test -e src/__tests__/profile-photo-hero-canvas.test.ts` | falso | creado | verdadero |
| `grep -cF 'Inicio es la única pestaña con PetHeroHeader' docs/ui-guidelines.md` | 1 | -1 | 0 |
| `grep -cF '**Regla N1 (enmienda #196)**' docs/ui-guidelines.md` | 0 | +1 | 1 |

Además, `bunx jest` completo en verde y `bunx expo lint` con la salida a un log
(`> log 2>&1`), comprobando que el log no trae `SIGKILL`.

## Bloques TDD por requisito

### R1 — Hero a sangre según la rama
1. Rojo: columna `hero` en `PROFILE_BRANCHES_168` y `it.each` `#196 R1: en la rama $name monta el hero = $hero`; enmiendas K de R1.
2. Verde: `showHero`, `<View testID="profile-hero" className="relative">` con `PetHeroHeader variant="bleed"`, `contentContainerStyle` y `profile-content`. Quita la tarjeta hero, `profile-entrance-hero` y el skeleton propio.
3. Refactor: ninguno previsto.

### R2 — Fila de título y selector sobre la foto
1. Rojo: los cuatro `it` de `#196 R2` y sus enmiendas K.
2. Verde: una fila de título con className por rama, `profile-hero-top` como `children`, `PetSwitcher variant="glass"` sin `trailing`, `Plus` 16/2.6.
3. Refactor: ninguno previsto.

### R3 — Nombre y chips al pie de la foto
1. Rojo: los tres `it` de `#196 R3` en `pet-hero-header.test.tsx` y el de Perfil.
2. Verde: prop `caption` en `H`; Perfil pasa `profile-pet-card` con nombre y chips.
3. Refactor: ninguno previsto.

### R4 — Cámara flotante con labio
1. Rojo: los tres `it` de `#196 R4` y sus enmiendas K.
2. Verde: `BubblePop` `profile-change-photo-pop` como segundo hijo de `profile-hero`, `change-photo` con `chunkyLip.primary` y `Camera` 18/2.4; `photo-upload-error` antes de `profile-entrance-info`.
3. Refactor: ninguno previsto.

### R5 — Aviso de notificaciones bloqueadas
1. Rojo: los cuatro `it` de `#196 R5` y sus enmiendas K (incluidas las de CC y AC).
2. Verde: `HomeEntrance` 0 con el `View` ámbar, texto `leading-note` y `Button` con labio.
3. Refactor: ninguno previsto.

### R6 — «Cerrar sesión»
1. Rojo: los dos `it` de `#196 R6` y sus enmiendas K.
2. Verde: `HomeEntrance` 4, `Button variant="danger-soft"` con `h-13 rounded-14 ${CATEGORY_SLOTS.rose.surface}` y un `Text` `text-15 font-extrabold text-danger`.
3. Refactor: ninguno previsto.

### R7 — Interruptor «Usar tema oscuro»
1. Rojo: `#196 R7: el tema usa ToggleSwitch con pulgar` y el `it.each` de las dos direcciones; enmienda K35 de `#197 R20`.
2. Verde: `ToggleSwitch` `theme-toggle`; fuera el `Switch` de HeroUI.
3. Refactor: ninguno previsto.

### R8 — Trazo de los iconos de accesos
1. Rojo: `it.each` `#196 R8: el icono de $0 usa trazo 2.2`.
2. Verde: `strokeWidth={2.2}` en los cuatro iconos.
3. Refactor: ninguno previsto.

### R9 — Entradas escalonadas
1. Rojo: `it.each` `#196 R9: en la rama $name los índices de entrada son fijos` y el `it` del aviso con índice 0; enmiendas K de `#173 R12`.
2. Verde: índices fijos 0–4 y fuera `profile-entrance-hero`.
3. Refactor: ninguno previsto.

### R10 — Fidelidad a los artboards congelados
1. Rojo: `src/__tests__/profile-photo-hero-canvas.test.ts` con las 24 filas y el `it` de los tres artboards. Las filas que la producción ya cumple nacen verdes: anótalas en el informe.
2. Verde: ajustar la producción hasta que las 24 filas pasen. Si una fila de canvas falla, el artboard congelado manda: para y avisa.
3. Refactor: ninguno previsto.

### R11 — Enmienda #196 de la carta
1. Rojo: los dos `it` de `#196 R11` en `tab-headers-canvas.test.ts` en lugar del de `#168 R12` (K25).
2. Verde: texto de design.md §Texto de la Enmienda #196 en `docs/ui-guidelines.md`, solo con la casilla de la enmienda marcada. El `it` de `PetHeroHeader` pasa a verde en R1.
3. Refactor: ninguno previsto.
