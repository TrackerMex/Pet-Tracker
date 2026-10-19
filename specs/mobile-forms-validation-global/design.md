---
feature: "mobile-forms-validation-global"
status: draft
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-forms-validation-global]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas. La feature
> es solo del móvil (`mobile-pet-tracker/`): no toca el backend, que sigue
> siendo la fuente de verdad de las reglas.

## Decisiones técnicas

- **Primitivas más un componente fino, no un campo completo (R3; pregunta P1).**
  `FieldErrorMessage({ testID, issue })` solo pinta el mensaje. El control lo
  sigue montando cada pantalla. Razón: las cuatro pantallas tienen cuatro
  maneras de montar un campo (`FieldLabel` + `TextInput` crudo en add-pet y
  add-reminder, `Label` + `Input` de heroui en docs y peso, un `Pressable` para
  la fecha), y un `FormField` único obligaría a reescribir layouts y a tocar
  clases que fijan los candados de #185 R8, #172 R20 y `text-13`.
- **El componente envuelve `FieldError` de heroui y `FormError`, no los
  reemplaza (R3).** `FieldError` ya devuelve `null` cuando el campo no es
  inválido, y la prop local `isInvalid` pisa al contexto del `TextField`, así que
  el mismo componente sirve dentro y fuera de un `TextField`. `FormError` ya
  pinta el icono y el texto con las clases aprobadas, y no cambia (B12). Resultado:
  el componente **no declara ninguna clase** y no mueve ningún guard.
- **El `testID` base es el del control (R3).** De él salen `<base>-error`,
  `<base>-message` y `<base>-message-row`, el mismo esquema de #183, de modo que la
  migración de R8 no cambia el árbol.
- **Reglas puras en `src/utils/form-rules.ts`, devolviendo claves y no texto
  (R2).** Mismo patrón que `account-rules.ts` (#183): `RuleIssue` y `FieldIssues`
  se importan como tipo; el componente traduce con `useTranslate()`. Así un
  cambio de idioma cambia el mensaje sin recalcular, y las reglas se prueban
  sin renderizar. Cada `labelKey` se declara una sola vez (constante) porque
  `ui-language` cuenta literales por fichero y clave.
- **No hay mensaje de «demasiado largo» (R4, R5, R6).** Los campos de texto ya
  llevan `maxLength` igual al DTO; el candado congela el valor. El
  módulo de reglas **no** reusa `tooLong` de `account-rules.ts`, así que
  `account-rules.ts` no cambia.
- **Se validan todos los campos a la vez, al pulsar, antes de `setSubmitting`
  (R4–R7).** Es el comportamiento de #183 (reemplazo del estado en cada pulsación)
  y mejora lo de hoy, que paraba en el primer fallo con un solo aviso. Los
  errores de servidor y de red **no** cambian: siguen como aviso de formulario.
- **Peso: el cliente copia el DTO (R2, R7).** `parseFloat` aceptaba `12abc` y
  `72,5` como 12 y 72; ahora una regex decimal rechaza lo primero, y la coma se
  normaliza a punto (P5). El rango es el del DTO, `gt(0)` y `lte(999.99)`.
- **Peso: el texto crudo del servidor desaparece (R7).** Es la única pantalla que
  lo mostraba. El error de «fecha demasiado futura», que el servidor decide, pasa
  a mensaje de campo traducido; cualquier otro 400 cae en
  `validation.checkDetails`, que ya existe desde #183.
- **Fecha real de calendario (R2).** Documento y peso aceptan `2026-02-30` hoy y
  el servidor lo rechaza. El módulo porta la regla de `isIsoDate` del backend.
- **El mensaje se monta como hermano posterior del control (R4, R5).** Dentro del
  `View` del campo y nunca dentro de un `Pressable`: hay candados que cuentan los
  hijos del `Pressable` de la fecha (`field.children` de longitud 2).
- **Migración de #183 al componente (R8; pregunta P2).** Mismo esquema de
  `testID`, así que no cambia ningún test. Se hace **último** y solo cuando #177
  está mergeada, porque #177 toca las mismas cuatro pantallas.
- **Cierre en la carta (R9).** La regla «mensaje por campo con el componente» y
  «el texto crudo del servidor no se muestra» van a `docs/ui-guidelines.md` con
  su propia casilla de aprobación y un candado de lectura de fichero, como
  #172 R18 y #187. Ese candado también fija quién puede importar `FieldError`.
- **Prueba de humo humana (R10).** El teclado, el layout bajo edge-to-edge y la
  colocación de los mensajes solo se ven en un dev build de Android.

## Archivos afectados

Todo bajo `mobile-pet-tracker/`, salvo lo indicado.

**Presentación (componentes compartidos)**
- `src/components/field-error-message.tsx` — nuevo (R3).
- `src/components/__tests__/field-error-message.test.tsx` — nuevo (R3).
- `src/components/form-error.tsx` — **no cambia**.

**Aplicación (reglas puras, sin React)**
- `src/utils/form-rules.ts` — nuevo (R2).
- `src/utils/form-rules.test.ts` — nuevo (R2).
- `src/utils/account-rules.ts` — **no cambia** (solo se importan sus tipos).

**Pantallas**
- `src/screens/add-pet/index.tsx` y `index.test.tsx` (R4).
- `src/screens/add-reminder/index.tsx` y `index.test.tsx` (R5).
- `src/screens/docs-upload-form/index.tsx` y `index.test.tsx` (R6).
- `src/screens/weight-log/index.tsx` y `index.test.tsx` (R7).
- `src/screens/login/index.tsx`, `register/index.tsx`, `forgot/index.tsx`,
  `reset-password/index.tsx` (R8, condicional a P2; sus tests no cambian).

**Catálogo y candados**
- `src/i18n/catalog.ts` — cuatro claves `validation.*` (R1).
- `src/providers/__tests__/language-provider.test.tsx` — fórmula `+ 4` y `describe` de R1.
- `src/__tests__/ui-copy-table.ts` y `src/__tests__/ui-language.test.ts` — filas de
  `form-rules.ts`, fórmulas y títulos (R2, R4, R5, R7).
- `src/__tests__/forms-validation-global.test.ts` — nuevo (R8, R9).

**Documentación**
- `../docs/ui-guidelines.md` — enmienda #186 y corolario corregido (R9).
- `../specs/mobile-ui-language/design.md` — sección §2.36 (R1).

## Alternativas descartadas

- **`FormField` completo (etiqueta + control + mensaje).** Descartada (P1 B):
  los cuatro layouts difieren y las clases están candadas; el coste de la
  uniformidad supera el beneficio, y el mensaje es lo único realmente repetido.
- **Un componente de solo texto, sin `FieldError` de heroui (P1 C).** Pierde el
  estado `isInvalid` heredado del `TextField` y la coherencia con #183.
- **Prop de tipo `string` en vez de `RuleIssue`.** Obligaría a cada pantalla a
  traducir y a repetir el `t(...)`; con `RuleIssue` el componente traduce, y el
  cambio de idioma funciona sin recalcular.
- **Mover `RuleIssue` y `FieldIssues` a un fichero de tipos común.** Cambia
  imports de #183 sin necesidad; se importan como tipo desde donde están.
- **Borde rojo en los `TextInput` crudos (P6).** Exige una clase nueva y su
  candado en grep-clean/design-drift/consistency; se deja para quien lo pida.
- **Validar al escribir o al salir del campo.** Cambia la regla de #183 (al
  pulsar); sería una feature aparte.
- **Dejar `parseFloat` en peso.** Seguiría aceptando `12abc` y `72,5` como 12 y 72
  y enviando `NaN` en la condición corporal.
- **Añadir zod al móvil.** Pesa y duplica un esquema que el backend ya tiene;
  como en #183, se copian las reglas y se verifican con tablas.
- **Una sola `validateForm` genérica con un esquema por campo.** Más abstracta que
  cuatro validadores de cuatro formularios, y #191 solo necesita `validateAddPet`.
