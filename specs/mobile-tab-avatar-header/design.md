---
feature: "mobile-tab-avatar-header"
status: draft        # draft | approved
tags: [harness, spec, mobile, ui]
---

# Diseño — [[mobile-tab-avatar-header]] (#222)

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas. Todo el
> cambio vive en la capa de presentación de `mobile-pet-tracker/` (componentes,
> pantallas y sus tests) más documentos de `specs/` y `docs/`. No toca
> `src/api/`, `src/providers/` ni el backend. Rige `docs/ui-guidelines.md`.
> Artboards congelados en `specs/mobile-tab-avatar-header/canvas/` (G1,
> 2026-10-27).

## 1. Decisiones

| # | Decisión | Razón |
|---|---|---|
| D1 | Un componente compartido `TabPetHeader` (`src/components/tab-pet-header.tsx`) pinta la cabecera fija de Salud y Nutrición. Exporta `TAB_PET_HEADER_HEIGHT = 65` y `TAB_PET_HEADER_SCROLL_MIN = 7`. | Dos pantallas con la misma receta; sin componente habría dos copias de clases de vidrio y de la suma `7 + 50 + 7 + 1`. Además deja `variant="avatars"` en **un** solo fichero (R10.3), un candado más simple que el inventario de hoy (Salud y Nutrición). |
| D2 | **Vidrio plano**: `bg-glass-surface-strong` más `border-b border-border`, sin `expo-blur`. | El candado `#180 R5.6` (`alert-detail-canvas-fidelity.test.ts`) lista exactamente tres ficheros que pueden importar `expo-blur` (`floating-tab-bar.tsx`, `alert-detail/index.tsx`, `geofence-editor/index.tsx`). Añadir un cuarto es una enmienda a #180 y un coste de rendimiento (una `BlurView` por pestaña bajo un scroll). El token `glass-surface-strong` ya existe y ya se usa en Perfil (cápsula). La diferencia con el artboard (`blur(20px)`) se declara en §4 y la verifica el humano en G2. |
| D3 | La cabecera es **hermana posterior** del `ScrollView` dentro de una raíz `flex-1`, con `absolute inset-x-0 top-0`. | En React Native el orden en el árbol decide qué se pinta encima: sin `zIndex` ni `elevation`. Salud ya tiene raíz `health-root`; Nutrición no, y se le añade `food-root` (R4.2). |
| D4 | El `ScrollView` reserva el hueco con `paddingTop` (no con un espaciador) y solo cuando la cabecera existe. | La altura de la cabecera es conocida (`insets.top + 65`), así que `paddingTop = insets.top + 65 + gap` es determinista y testeable con el doble de insets (121 y 119). Sin mascotas la cabecera no se pinta y el `paddingTop` vuelve a `insets.top + 12` (la excepción de §8 lo recoge en `conventions.md`). |
| D5 | El scroll horizontal llega hasta el borde de la pantalla: el relleno lateral lo pone `contentContainerStyle={{ paddingHorizontal: edgeInset }}` del `ScrollView` del selector, no la raíz de la cabecera. | Es lo que hace que el último chip se vea **cortado** por el borde con muchas mascotas (artboard `SaludSelectorMuchas`). `edgeInset = horizontalInset - 5` porque la caja del chip (50) lleva 5 de aire entre el círculo (40) y su borde: el círculo queda a `horizontalInset` del borde (24 en Salud, 20 en Nutrición). |
| D6 | La separación de 10 sale de quitar `gap-1.5` de la fila `avatars` (R2.1), no de añadir un margen. | Caja del chip 50 = 40 círculo + 2 x 3 (`p-0.75`) + 2 x 2 (`border-2`). Dos cajas contiguas dejan exactamente 10 entre círculos. Quitar el `gap` es un cambio de una clase y un candado (`toBe('flex-row')`), sin números nuevos. |
| D7 | `edgeInset` y `scrollHint` son props opcionales **solo de la rama `avatars`**. | Las ramas `default` y `glass` tienen consumidores con locks propios (#195 R9, R10 y los tests de Inicio y Perfil); no se tocan. |
| D8 | La pista de scroll (`accessibilityLabel` del `ScrollView`) se pasa solo con 7 o más mascotas, y la cadena la resuelve cada pantalla con una llamada `t('tabHeader.petsScroll')`. | Con 6 o menos el selector cabe sin desplazar y la etiqueta sobraría. `TabPetHeader` no llama a `t()` (R1.7): así **`SCREEN_FILES` no crece** (R8.4) y los dos ficheros afectados ya figuran en ella. El umbral 7 sale de la cuenta del artboard: con chips de 50 de caja, `(390 - 2 x 20) / 50 = 7` chips caben justos en 390 de ancho, así que con 7 o más puede haber corte según el dispositivo. Es una constante nombrada (`TAB_PET_HEADER_SCROLL_MIN`), no un número suelto. |
| D9 | El título desaparece pero **el encabezado queda** como `View` sin hijos con `accessibilityRole="header"` y `accessibilityLabel`. | Un lector de pantalla pierde el anuncio de la pestaña si se borra el título. Mantiene vivas las filas `health.health`, `food.food` y `profile.profile` de `ui-copy-table.ts` con uso real (checklist del plan UI §4 punto 2) en vez de dejar copy huérfano. Va con `absolute size-px` (1 x 1 px, fuera del flujo, no consume `gap`); se descarta `opacity-0` porque RN la trata como oculta a la accesibilidad en algunas plataformas. |
| D10 | Perfil con hero **no** usa `TabPetHeader`. La fila superior del hero (`profile-hero-top`) pasa a `justify-between` con el selector `glass` a la izquierda (en un contenedor `min-w-0 flex-1`) y la cápsula a la derecha. | Decisión D4 a de G1: Perfil conserva el hero que se desplaza con la foto. El `min-w-0 flex-1` deja que el selector `glass` se desplace dentro de su ancho sin empujar la cápsula fuera de la pantalla. |
| D11 | El slot `profile-hero-selector` se pinta **siempre** con hero, aunque esté vacío (lista pendiente). | Sin él, la cápsula con `justify-between` y un solo hijo quedaría pegada a la izquierda. El slot vacío ocupa el `flex-1` y deja la cápsula a la derecha. |
| D12 | La cápsula pasa a una constante `addPetCapsule` compartida por las dos ramas de Perfil. | Hoy `titleRow` la declara una vez y la usan las dos ramas. Mantener **una** declaración conserva los recuentos de las clases ternarias (`bg-glass-surface-strong` 1, `bg-tab-pill` 1) que miran `profile-photo-hero-canvas.test.ts` (fila `n: 4`) y `profile-canvas-fidelity.test.ts`. |
| D13 | Perfil sin hero: `profile-top-row` (`flex-row justify-end`) con la cápsula, primer hijo de `profile-content`. | El título desaparece; la cápsula conserva su sitio a la derecha de la primera fila. `profile-content` mantiene `paddingTop: insets.top + 12`. |
| D14 | La celebración (`components/celebration.tsx`) conserva su título. | No es una pestaña; su literal `tracking-title` es el único que queda (L2). |
| D15 | La enmienda a la carta lleva **su propia casilla humana** (G4) y se ejecuta **al final**; la de `conventions.md` (R13) no es gate: la delega el mandato. | Plan UI §4 punto 3 y mandato: las enmiendas a `docs/ui-guidelines.md` no se delegan. Una casilla sin marcar no bloquea R1 a R11 ni R14; bloquea solo R12 y el cierre de la feature. |

## 2. Bloque canónico de la enmienda

El bloque que R11 inserta al final de cada documento enmendado es el texto
literal de este fence (mismo mecanismo que #168 y #196: el test
`hero-header-amendments.test.ts` lo lee de aquí, sustituye `<FEATURE>` y
`<QUÉ CAMBIA>` y compara hasta la línea de firma).

```markdown
## Enmienda #222 — avatares fijos y sin título en las pestañas

`mobile-tab-avatar-header` (#222) modifica una decisión que esta spec dejó
aprobada. La spec de origen es `specs/mobile-tab-avatar-header/`; el detalle
de la enmienda está en su `requirements.md` §R11.

- Spec enmendada: `<FEATURE>`
- Qué cambia: `<QUÉ CAMBIA>`
- Qué NO cambia: ningún otro requisito de esta spec ni su estado de
  aprobación. Los tests que cubren lo enmendado se reescriben en #222 (lista
  en su `requirements.md` §R9 y en su `tasks.md`).

- [ ] Enmienda #222 aprobada por humano
```

Reglas de aplicación:

- El bloque va **al final** del documento; el marcador en prosa de la tabla de
  R11.1 va en la línea siguiente al requisito o encabezado citado. Los dos son
  independientes y el test comprueba ambos.
- La línea de firma de cada documento queda **sin marcar**; la marca el humano
  (`- [ ]` a `- [X]`). El test acepta las dos formas.
- La fila de `docs/ui-guidelines.md` (la séptima de `AMENDED_DOCS_222`) usa
  `<FEATURE>` = `docs/ui-guidelines.md` y `<QUÉ CAMBIA>` = `regla N1: avatares
  fijos y sin título en Salud y Nutrición`.
- Precedente de la carta: #196 reescribió la fila de marcador de la carta en el
  paso verde, junto con la edición de la carta y solo con su casilla marcada.
  #222 hace lo mismo (R12.3).

## 3. Mapa del canvas a React Native

| Medida del artboard | Traducción RN | Dónde |
|---|---|---|
| `position: absolute; top: 0` | `absolute inset-x-0 top-0` | `TabPetHeader` raíz |
| Inset superior 48 + `padding: 60px 20px 12px` | `paddingTop: insets.top + 7`; `paddingBottom: 7` | `style` de la raíz |
| Chip círculo 40, caja 50 | `size-10` + `p-0.75` + `border-2` (sin cambio) | `PetSwitcher` `avatars` |
| Separación 10 | fila `flex-row` sin `gap` | R2.1 |
| Relleno lateral 20 | `contentContainerStyle.paddingHorizontal = 20 - 5` | `edgeInset` |
| `background: var(--glass)` | `bg-glass-surface-strong` | R1.3 |
| `border-bottom: 1px solid var(--border)` | `border-b border-border` | R1.3 |
| `backdrop-filter: blur(20px)` | **no se traduce** (D2, §4) | |
| Heading oculto (`aria-label`) | `View` `absolute size-px` con `accessibilityRole="header"` | R7 |
| Grupo de muchas mascotas `aria-label="Mascotas, desliza para ver más"` | `accessibilityLabel` del `ScrollView` | R2.2, R8 |
| Perfil: cápsula 40, chips 40, separación 8 | cápsula 44 (`h-11`), chips `glass` 44, `gap-2` (sin cambio) | §4 |

Altura total de la cabecera: `insets.top + 65`. Con el doble de insets de los
tests (`top: 40`): 105 de cabecera; contenido a 121 en Salud (`+16`) y a 119 en
Nutrición (`+14`).

## 4. Desviaciones conscientes respecto de los artboards

Todas se anotan también en `progress/spec_mobile-tab-avatar-header.md` para que
el leader las confirme antes de firmar.

1. **Vidrio plano en lugar de `blur(20px)`** (D2). El tinte (blanco al 86 % /
   `#161B22` al 86 %) es el del token `glass-surface-strong`; se verifica en G2.
2. **Cápsula y chips de Perfil a 44** (artboard: 40). #195 R9/R10 y la fila
   `n: 4` de `profile-photo-hero-canvas.test.ts` fijan 44; cambiarlo es otra
   enmienda y no la pide G1.
3. **Inset lateral de Salud a 24** (artboard: 20). Salud ya usa `padding: 24`
   (#199); alinear la cabecera con el contenido es lo coherente. Nutrición usa
   20, igual que el artboard.
4. **Espaciador de 52/54 en los artboards.** Es incoherente con una cabecera de
   113 de altura en el artboard (48 + 65); se trata como artefacto del
   prototipo. La medida vinculante es `paddingTop = insets.top + 65 + gap`.
5. **El contenido se desplaza** `P - 52` px (69 en Salud, 67 en Nutrición,
   con el doble de insets) cuando la lista de
   mascotas termina de cargar y aparece la cabecera. Es el coste de D4 y se
   acepta; la alternativa (reservar el hueco mientras carga) pinta un hueco
   vacío en el estado «sin mascotas», justo el que G1 pidió que suba.

## 5. Archivos por capa

**Presentación — componentes**

- `src/components/tab-pet-header.tsx` (nuevo): R1.
- `src/components/pet-switcher.tsx`: R2 (rama `avatars`, `PetSwitcherProps`).
- `src/components/__tests__/tab-pet-header.test.tsx` (nuevo).
- `src/components/__tests__/pet-switcher.test.tsx`: L9 y R2.

**Presentación — pantallas**

- `src/screens/health/index.tsx` y `index.test.tsx`: R3, R7, R9.
- `src/screens/food/index.tsx` y `index.test.tsx`: R4, R7, R9.
- `src/screens/profile/index.tsx` y `index.test.tsx`: R5, R6, R7, R9.

**Copy**

- `src/i18n/catalog.ts`: R8.1 (una clave, `en` y `es`).
- `src/__tests__/ui-copy-table.ts`: R8.2 (dos filas).
- `src/__tests__/ui-language.test.ts`: R8.3.

**Candados**

- `src/__tests__/tab-headers-canvas.test.ts`: L1, L2, L3 (R12), R10, R13, R14.
- `src/__tests__/canvas-foundations.test.ts`: L4.
- `src/__tests__/profile-canvas-fidelity.test.ts`: L5.
- `src/__tests__/profile-photo-hero-canvas.test.ts`: L6 y L7.
- `src/__tests__/alerts-canvas-fidelity.test.ts`: L8.
- `src/__tests__/hero-header-amendments.test.ts`: R11 y R12.3.

**Documentos**

- Seis specs (tabla de R11.1): bloque y marcador.
- `docs/ui-guidelines.md`: R12 (tras G4).
- `docs/conventions.md`: R13.

No hay cambios en `package.json`, `app.json`, `src/api/`, `src/providers/` ni el
backend.

## 6. Alternativas descartadas

| Alternativa | Por qué no |
|---|---|
| `BlurView` de `expo-blur` en la cabecera | Rompe el candado `#180 R5.6` (D2). |
| Opción B del plan (cabecera que se colapsa al desplazar) | G1 eligió A; B exige un `Animated` ligado al scroll y otro juego de pruebas. |
| Opción C (pies de CTA fijos) | Otro problema (acciones primarias); queda fuera. |
| Cabecera fija también en Perfil | Perfil tiene hero a sangre con foto: una cabecera fija taparía la foto. D10. |
| Un espaciador `View` de `TAB_PET_HEADER_HEIGHT` dentro del scroll | Duplica el cálculo y rompe `gap` (el espaciador cuenta como hijo); el `paddingTop` es una cifra. |
| Medir la cabecera con `onLayout` | Estado asíncrono en el render de la pantalla, flaky bajo `renderRouter` (memoria `renderrouter-fake-timers-setstate-async`); la altura es una constante conocida. |
| Un `SCREEN_FILES` nuevo para `tab-pet-header.tsx` con su propia llamada a `t()` | Rompe la suma manual de `ui-language.test.ts` y es zona de conflicto con features paralelas. D8. |
| Ocultar el título con `opacity-0` o `hidden` | Lo quita también a los lectores de pantalla (D9). |
| Borrar las claves `health.health`, `food.food`, `profile.profile` | Las filas de la tabla exigen su uso real; quitar copy registrado es otra decisión y D9 ya lo conserva con uso. |
| Cambiar `PetSwitcher` `glass` a 40 / `gap-2` a 8 para clavar el artboard de Perfil | Enmienda a #195; no la pide G1. §4.2. |

## 7. Reparto de ficheros con las features paralelas

| Feature | Fichero que comparte | Región de #222 | Región ajena |
|---|---|---|---|
| #208 (en `dev`) | `screens/health/index.tsx` | desde el `return` hasta el primer hijo de contenido | `vaccines-add`, `health-content` y todo lo de dentro |
| #209 | `screens/food/index.tsx` | cabecera, `food-root`, `paddingTop` | `food-profile-empty`, `food-create-profile` |
| #214 | `screens/profile/index.tsx` | `profile-hero-top` y la fila de `profile-content` | tarjeta Familia, dentro de `profile-content` |
| #224 | `screens/food/index.tsx` | idem #209 | tarjeta de IA (`food-ai-*`), dentro del `ScrollView` |
| #221 / #223 | tests y `ui-copy-table.ts` | solo las dos filas de R8.2 | el resto de bloques de `ui-copy-table.ts` |

`catalog.ts`, `ui-copy-table.ts` y los `toHaveLength` de `ui-language.test.ts`
son zonas de conflicto: R8 añade **una** entrada por sitio, siempre junto a
`'tabs.bar'` (catálogo) o al final de su bloque (tabla). Quien mergee segundo
resuelve el conflicto sumando, no reescribiendo. No hay rebase tras la
trazabilidad (memoria `rebase-invalida-hashes-traceability`).

## 8. Texto de la carta y de las convenciones

El texto exacto de la regla N1 está en [[requirements]] R12.1 y el de la
excepción de `conventions.md` en R13.1. No se repiten aquí para que haya una
sola fuente. Antes de la enmienda, la regla vigente es:

`**Regla N1 (enmienda #196)**: Inicio y Perfil abren con PetHeroHeader a sangre; Salud y Nutrición abren con el título grande. En Perfil el título «Perfil» y «Añadir mascota» van en el slot superior del hero y el nombre con los chips en su pie. Devolver el hero a Salud o a Nutrición, o quitárselo a Inicio o a Perfil, es una enmienda a #196.`

Otras reglas de la carta que esta feature **cumple sin enmendar**: la regla 6
(el círculo visible queda en `insets.top + 12` en Perfil sin hero y en
`insets.top + 7 + 5 = insets.top + 12` en la cabecera: 7 de relleno más 5 de
aire de la caja del chip), C8 de `design-drift.test.ts` (sin hex ni
`StyleSheet`), el uso de tokens (`bg-glass-surface-strong`, `border-border`) y
los toques de 44 (los chips de 40 de la cabecera llevan `hitSlop` heredado de
`PetSwitcher`, sin cambio).

## 9. Prueba en dispositivo (G2, no delegada)

Jest no mide píxeles ni TalkBack. El humano verifica en el dev build de Android,
en lote al final de la ola: (a) la cabecera fija con el scroll por debajo, en
claro y oscuro; (b) 10 de separación y último chip cortado con 8 o más
mascotas; (c) TalkBack anuncia «Salud», «Nutrición» y «Perfil» como encabezado
y la pista del grupo con 7 o más mascotas (el `accessibilityLabel` del
`ScrollView` puede ignorarse en iOS); (d) el salto de contenido al cargar la
lista (§4.5).
