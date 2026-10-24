# Auditoria del inventario «Candados que esta feature revierte» (#196)

Base: branch `feature/196-mobile-profile-photo-hero-canvas` @ 4490e3bb. Solo lectura, sin jest, sin `init.sh`.
Notacion: `T` = `mobile-pet-tracker/src/screens/profile/index.test.tsx`; `P` = `mobile-pet-tracker/src/screens/profile/index.tsx`; `H` = `src/components/pet-hero-header.tsx`.
Metodo: lectura de `T` entero; `git grep -nF` de cada literal que R1-R9 quitan o cambian sobre `src/**/*.test.*` y `__tests__/**`; lectura de los candados agregados; un script node (sin jest, misma logica que `scan` de `heroui-text-size-merge`) para medir los pisos de conteo.

Resumen: Faltan 6, Sobran o mal descritos 4, Anclas con discrepancia 0.

## Faltan

| # | Fichero › describe › it | Literal o estructura que lo rompe | Afirma hoy | Afirmara / accion | R |
|---|---|---|---|---|---|
| F1 | `T` cabecera L52-57 y L122-127 (tipos de `mockPetSwitcher` y del doble de `PetSwitcher`) | K1 solo ensancha `variant`; ninguna de las dos declaraciones lleva `trailing` | no hay `it`; typecheck | R2 y K4 leen `mockPetSwitcher.mock.lastCall?.[0].trailing` (TS2339 si falta). Anadir `trailing?: ReactNode` a las dos declaraciones en el mismo commit rojo de R2 | R2 |
| F2 | `T` cabecera L161-178 `jest.mock('reicon-react-native')` | `MockIcon({ color, size })` descarta `strokeWidth` | los `it` actuales solo leen `size` y `color` | R2.3, R4.1 y R8 leen `props.strokeWidth` del glifo: el doble debe reenviarlo (cambio de cabecera, como K1) | R2, R4, R8 |
| F3 | `T` entero (no mockea `react-native-reanimated`; `HomeEntrance` si esta mockeado como View) | foto, selector, titulo, chips y camara pasan a vivir bajo `PetHeroHeader` (`pet-hero-photo` con opacity 0 si hay mascota, `pet-hero-slot` y `pet-hero-caption` con opacity 0 y retraso) y bajo `BubblePop` (opacity 0, retraso 450 ms). `H` y Home mockean `withTiming`/`withDelay`/`useReducedMotion`; `T` no | `toBeVisible()` sobre nodos que hoy estan fuera de animacion: L482 (`profile-pet-avatar`, K6), L485 y L520 (`pet-chip-pet-N`), L492/L736/L760/L786/L1393 (`change-photo`), L678 y L687 (`getByText('Perfil'/'Profile')`, `#65 R14`), L1934 | RIESGO no medible sin jest: anadir a la cabecera de `T` el mismo doble de reanimated que `pet-hero-header.test.tsx` (o `useReducedMotion` en true) y listarlo como cambio de cabecera; si no, esos `it` fallan por opacidad, no por la asercion descrita (parada) | R1, R2, R4 |
| F4 | `src/__tests__/heroui-text-size-merge.test.ts` › `#187 R1: ningún componente que fusiona className lleva text-NN` › `#187 R1: el escáner cubre al menos el universo medido` (L123-128) | Perfil pierde dos `<Card>` de `./components/card`: el aviso de notificaciones (R5) y `profile-pet-card` con `variant="hero"` (R3) | `cardElements` total `>= 41`. Medido hoy: hero 211, card 41, className 169 (pisos 197 / 41 / 163), o sea el piso de Card esta sin margen | queda en 39 y falla. Bajar el piso a 39 con comentario `#196 R3, R5`. Los otros dos pisos aguantan (hero ~208, className ~167) | R3, R5 |
| F5 | `src/__tests__/hero-header-amendments.test.ts` › `#168 R11: las specs enmendadas por #168 llevan su bloque` › `aplica además el marcador en prosa que la tabla R11.2 prescribe` (L186-197; fila 4 de `AMENDED_DOCS_168`, L150-155) | `design.md` L163 «sustituye entera» la `**Regla N1 (enmienda B4 de #168)**` de `docs/ui-guidelines.md` (R11.2) | exige en `docs/ui-guidelines.md` el literal `**Regla N1 (enmienda B4 de #168)**: Salud, Nutrición y Perfil abren con el título grande; Inicio es la única pestaña con PetHeroHeader. Devolver el hero a una de las tres es una enmienda a #168.` | el literal desaparece y el `it` falla en esa fila. Los otros dos `it` del `describe` siguen verdes (el bloque `## Enmienda #168` y su firma no se tocan). Reescribir la fila 4 (marcador que sobreviva o texto de #196) o conservar la prosa B4 y anadir la N1 de #196 detras. Solo se pone rojo cuando el humano marque la casilla de R11.2. Tampoco figura en `tasks.md` L93-94 | R11 |
| F6 | `src/__tests__/profile-canvas-fidelity.test.ts` › `#173 R15: grep-limpio` › `screens/profile/index.tsx no tiene escapes de estilo` (L170-186) | «Deben seguir verdes» y `design.md` L114-116 dicen que `#173 R15` «solo mira `className`». No es cierto: tambien hace `expect(source).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)` sobre el FUENTE ENTERO de `P`, comentarios incluidos y sin la exencion `#NNN R<n>`. `P` hoy tiene 0 coincidencias | `P` sin `#NNN` en ningun sitio | un comentario `// #196 R2` en `P` (convencion del repo; lo admiten `design-drift`, `tab-headers-canvas` y `chunky-cta` R12.1) lo pone rojo. Anadir a R1 y al handoff: `grep -cE '#[0-9a-fA-F]{3,8}\b' P` = 0. `H` si puede llevar `#196 R3` (`home-photo-hero-canvas` quita comentarios antes de medir) | R1 a R9 |

## Sobran o mal descritos

| # | Fila | Dice | Realidad | Accion |
|---|---|---|---|---|
| S1 | K3 (`#173 R5` › `pinta Add pet en inglés con la misma receta`, T:318-326) | pasa a la receta de vidrio de K2 | solo asierta `label.props.className === 'text-sm font-extrabold text-accent-strong'` (R2.3 no la cambia); no asierta la clase de la capsula | no se pone rojo: quitar K3 |
| S2 | K14 (T:1358-1367, `sin foto pinta el blobatar de 96 sin source`) | `pet-hero-media` sin `source` | ademas asierta `width`/`height` 96 del `SvgXml`; con `PetAvatar size={{ width: '100%', height: 430 }}` pasan a `'100%'` y 430 | anadir esa aserción a «pasa a afirmar» |
| S3 | K13 (T:1350-1356, `con foto pinta el avatar circular de 96 con su cacheKey`) | «sin tamano 96» | asierta `style` `toEqual` `{ width: 96, height: 96, borderRadius: 48 }`; el nuevo es `{ width: '100%', height: 430 }` | concretarlo |
| S4 | «Deben seguir verdes» (`legibility-classnames` › `#61 R4`) y `design.md` L106-107 | «Perfil conserva sus dos `text-accent-strong`» | el candado de Perfil espera 3 (`1 + 1 - 1 + 1 + 1` en `legibility-classnames.test.ts`) y `P` tiene hoy 3 sitios (L70, L299, L507); la fila de titulo unica de `design.md` L92-96 los deja en 3 | corregir «dos» por «tres» |

## Anclas

Todas las anclas de §Base medida (pantalla `P`, hero `H`, `global.css`, `motion.ts`, tests `T`, carta, los `test ! -e`) y los 17 literales del canvas (columnas Perfil, PerfilCuenta y PerfilNotificaciones) dan la cifra declarada. Sin discrepancias.
Comprobaciones adicionales que tambien coinciden: `variant="avatars"` solo en `P` (K26 correcto), `rounded-hero` x1 en `P` (K27), `text-26` x1 en `P` (K28), `variant="hero"` x1 (K29), `P` sin arbitrarios/hex/StyleSheet/elevation (R12.1 de chunky), cinco `<Card>` hoy en `P`.

## Verificado sin hallazgo

- K1-K24: cada fila contrastada con su `it` en `T` (salvo S1-S3 y los riesgos F1-F3).
- K25: `tab-headers-canvas` › `#168 R12` es el unico `it` que enumera `<PetHeroHeader`; `#168 R1` (literal del titulo) sigue en verde porque #197 renombra `tracking-tight` a `tracking-title` y la rama sin hero conserva `text-3xl font-black tracking-title text-foreground` una vez; `veta hex` admite `#196 R<n>`.
- K26-K29: coinciden (ver Anclas).
- K30-K33: `consumers`, R7.5 (primera y cuarta aserción, dos usos de `style={chunkyLip.primary}`: camara y «Abrir configuración»), R8.1 fila `primary` (el `Button` `notifications-open-settings` no lleva `bg-accent`, por eso R3.3 no se mueve) y R6.2 (`<Button.Label` -1, `Button.Label` -2) cuadran. `R8.4` (`profile-sign-out` sin `chunkyLip`) y `R7.2`/`R7.3` (sin `rounded-16` ni `rounded-xl bg-accent` nuevos) siguen verdes. Nota menor: los titulos de `R7.4`/`R12.1` dicen «diecisiete»/«dieciocho», son cadenas sin aserción.
- K34: `alerts-canvas-fidelity` fila `text-15` coincide. La fila `tracking-title` (L221) y `tracking-display`/`leading-note`: Perfil entra por #197 (no verificable en este arbol); comprobar al mergear.
- `consistency-classnames` `#62 R14` (CONTINUOUS_CORNER de Perfil = 1, `ProfileTile`), `#166 R2/R3` (la camara es `rounded-full`; el CTA del aviso no lleva `bg-accent`; sin `variant` outline/secondary), `#62 R2` (sin skeleton de Perfil en la lista) y `design-drift` (`Card` compartido importado, `signOut` x2, featureFiles) sin cambios.
- `ui-language`/`ui-copy-table`: las filas de `P` no se mueven mientras la fila de titulo sea un unico elemento JSX (cada `t('profile.*')` conserva su numero de apariciones); `no-pets-states`, `empty-state.test.tsx` (1 `EmptyState` en Perfil) y `src/app/_layout.tsx` (no se toca) sin impacto.
- `pet-hero-header.test.tsx`, `pet-hero-header-motion.test.tsx` y `home-photo-hero-canvas.test.ts`: ninguno pasa `caption`; con la rama `caption ?? <lo de hoy>` de `design.md` conservan hijos, clases y conteos (`CONTINUOUS_CORNER` 1, `TABULAR_NUMS` 2, `text-accent-strong` 1).

## Sin auditar (presupuesto de llamadas agotado)

- `src/app/(tabs)/__tests__/profile.test.tsx` y `screens.test.tsx` (solo montan la ruta), `components/__tests__/pet-switcher.test.tsx` (el componente no cambia), `screens/health/index.test.tsx`, K35 y todo lo que dependa de `ToggleSwitch` de #197 (no esta en este arbol).
