# Spec #222 mobile-tab-avatar-header — notas del spec_author

Spec en `specs/mobile-tab-avatar-header/` (status `draft`, sin firmar). Artboards G1 congeladas en `canvas/`. Feature en `spec_ready`.

## Preguntas dudosas (confirmar antes de firmar)

1. **Vidrio plano, no blur** (D2). El artboard pide `blur(20px)`; `expo-blur` solo puede estar en 3 ficheros (candado `#180 R5.6`). Si el humano exige blur real, hay que enmendar #180 aparte.
2. **Perfil a 44 en vez de 40** (cápsula y chips glass). #195 R9/R10 y la fila `n:4` de `profile-photo-hero-canvas.test.ts` fijan 44; el artboard dibuja 40. Se mantiene 44.
3. **Inset lateral de Salud 24** (artboard 20). Coherente con `padding: 24` de #199.
4. **Espaciador 52/54 del artboard** incoherente con cabecera de 113; tratado como artefacto. Medida vinculante: `insets.top + 65 + gap` (121 Salud, 119 Nutrición en tests).
5. **Casilla extra G4b** para `docs/conventions.md` (excepción del `paddingTop`). El plan solo nombra G4 (carta). Confirmar con el humano que no quiere fusionarla en G4.
6. **Cierre**: R12/R13 solo se ejecutan con G4/G4b marcadas; el leader no cierra la feature sin ellas ni sin G2.
7. **Umbral de 7 mascotas** para la pista de scroll: elegido por cuenta (350/50), constante nombrada; el humano puede preferir otro.
8. **`size-px` sin precedente** en el repo y `accessibilityLabel` del ScrollView posiblemente ignorado en iOS: verificar con TalkBack/VoiceOver en G2.
9. **Salto de contenido** (69/67 px) al cargar la lista y aparecer la cabecera; aceptado (design §4.5).
10. **Zona de conflicto con #224/#209/#214/#221/#223**: `catalog.ts`, `ui-copy-table.ts`, `ui-language.test.ts` (una entrada por sitio) y `screens/food/index.tsx`. #224 no se inventa testIDs; si aterriza antes, su tarjeta queda dentro del scroll.

## Candados cruzados (grep real)

- `tab-headers-canvas.test.ts`: `#168 R1` (2 `it`: ocurrencia por fichero, inventario del literal), `#196 R11` carta N1 (se reescribe en R12), `#168 R12` (sin StyleSheet/hex/corchetes: respetado).
- `hero-header-amendments.test.ts`: `AMENDED_DOCS_168` (marcador de la carta, en lockstep con R12) y nuevo describe `#222 R11`.
- `canvas-foundations.test.ts` `#197 R4` (bucle `tracking-title`).
- `profile-canvas-fidelity.test.ts` `#173 R4` (inventario `variant="avatars"`).
- `profile-photo-hero-canvas.test.ts` (`FILAS` fila 3 se elimina, 24 a 23; fila 4 intacta).
- `alerts-canvas-fidelity.test.ts` (inventario `tracking-title`).
- `pet-switcher.test.tsx` (`flex-row gap-1.5` a `flex-row`).
- `ui-language.test.ts` / `ui-copy-table.ts`: `health.health`, `food.food`, `profile.profile` siguen con 1 `t()`; filas nuevas `tabHeader.petsScroll` en `R5_HEALTH` y `R6_FOOD` (+1 cada una); `SCREEN_FILES` sin cambio.
- `alert-detail-canvas-fidelity.test.ts` `#180 R5.6` (lista de `expo-blur`): no se viola.
- `design-drift.test.ts` C8: sin hex ni StyleSheet.
- Tests de pantalla a reescribir: tabla R9.1 de `requirements.md` (por título de `it`).
- Plan §4: (1) candados nombrados con ruta e `it` (R9), (2) copy huérfano resuelto con encabezado oculto y `SCREEN_FILES` fijado (R8.4), (3) cartas con casilla propia (G4, G4b).
