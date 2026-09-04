---
feature: "mobile-ui-language"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-ui-language]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. **Un commit por
> requisito**, con el test rojo **antes** que la implementación
> ([[../../CHECKPOINTS|CHECKPOINTS]] C4): el historial debe enseñar
> rojo → verde, no todo junto.

## Cómo está troceado, y por qué

Esta feature es masiva en **superficie** (309 cadenas, 19 archivos de fuente,
19 de test) pero trivial en **profundidad**: cada cambio es sustituir un
literal. El troceo es **por pantalla o por módulo**, no por tipo de cadena:

- Por pantalla, cada requisito sigue siendo **verificable de una pieza**: se
  abre esa pantalla, se comprueba que no queda inglés, y su bloque del
  fixture pasa de rojo a verde entero.
- Por tipo de cadena (todos los errores, luego todos los títulos…) cada
  pantalla quedaría mitad y mitad durante varios commits, que es exactamente
  el estado que esta feature elimina, y no se podría probar nada a mano hasta
  el final.

R1–R11 son los 11 lotes de traducción (309 cadenas repartidas
29/5/20/19/32/35/26/50/38/40/15). R12–R13 cierran los tests. R14–R15 cierran la
gobernanza y **pueden ir en cualquier orden** respecto a los demás; se dejan al
final para que el gate humano de las 9 enmiendas no bloquee la traducción.

## Antes del primer commit

- [ ] Cargar `expo:expo-overview` y, por lo que indica `docs/ui-guidelines.md`
      §Skills, `expo-native-ui`. No hay tokens, ni animación, ni componentes
      nuevos: no hacen falta `expo-design-system` ni `expo-animation`.
- [ ] Leer `docs/ui-guidelines.md` entera, `docs/conventions.md` §Convenciones
      de la app móvil y `CHECKPOINTS.md` C4/C7/C8.
- [ ] `./init.sh` verde antes de empezar.
- [ ] Confirmar que se trabaja en la branch `feature/65-mobile-ui-language` y
      que `backend-pet-tracker/` **no se abre en ningún commit**.

---

## R1 — El grupo `(auth)` en español (29 cadenas)

- [ ] (1) Test rojo: crear `mobile-pet-tracker/src/__tests__/ui-copy-table.ts`
      con **las 29 filas** de [[design]] §2.1 transcritas literales, y
      `mobile-pet-tracker/src/__tests__/ui-language.test.ts` con el helper
      `checkRows` de [[design]] §3.1 y
      `describe('#65 R1: el grupo (auth) está en español')`. Rojo.
- [ ] (2) Implementación mínima: sustituir las 29 literales en
      `src/app/(auth)/login.tsx`, `forgot.tsx` y `register.tsx`, y actualizar
      las **10** anclas de `login.test.tsx` (73, 74, 75, 76),
      `forgot.test.tsx` (36) y `register.test.tsx` (152, 182, 183, 184, 224).
      **No tocar** los 5 literales de esos tests que son mensajes de
      validación del backend (`login` 93/102, `register` 160/171 y el
      `'Terms must be accepted'`): siguen en inglés a propósito.
- [ ] (3) Refactor con tests verdes: comprobar que no quedó ningún
      `getByText` huérfano y que `screen-login`/`screen-forgot`/
      `screen-register` y sus `testID` de campo están intactos.

## R2 — Etiquetas de la barra de pestañas (5 cadenas)

- [ ] (1) Test rojo: añadir `R2_TABS` al fixture y
      `describe('#65 R2: la barra de pestañas usa las etiquetas del diseño')`.
- [ ] (2) Implementación mínima: `TABS` de
      `src/components/floating-tab-bar.tsx:49-53` pasa a `Inicio`, `Mapa`,
      `Salud`, `Nutrición`, `Perfil`; actualizar el bucle de
      `floating-tab-bar.test.tsx:235`. **Los 5 `name` (`home`, `map`,
      `health`, `food`, `profile`) y los 5 `testID` no se tocan**: son rutas.
- [ ] (3) Refactor con tests verdes.

## R3 — Home (20 cadenas)

- [ ] (1) Test rojo: `R3_HOME` en el fixture +
      `describe('#65 R3: Home está en español')`.
- [ ] (2) Implementación mínima: las 20 de [[design]] §2.3 en
      `src/app/(tabs)/home.tsx`, incluidas `fmtLastSeen` (`Última señal …`) y
      los tres estados del collar (`Sin collar` / `En línea` / `Sin conexión`);
      actualizar las 14 anclas de `home.test.tsx`.
- [ ] (3) Refactor con tests verdes.

## R4 — Map (19 cadenas)

- [ ] (1) Test rojo: `R4_MAP` +
      `describe('#65 R4: Map está en español')`.
- [ ] (2) Implementación mínima: las 19 de [[design]] §2.4 en
      `src/app/(tabs)/map.tsx`, con `fmtAgo` devolviendo `Justo ahora` /
      `hace <n> min` / `hace <n> h` y **los umbrales 60/3600 intactos**;
      actualizar las 21 anclas de `map.test.tsx` y los 2 títulos de `it`
      (919, 935) de [[design]] §3.4.
- [ ] (3) Refactor con tests verdes: `stat-gps` sigue mostrando `GPS`, que es
      una sigla y no se traduce.

## R5 — Health, log de peso y gráfica (32 cadenas)

- [ ] (1) Test rojo: `R5_HEALTH` +
      `describe('#65 R5: Health, el log de peso y la gráfica están en español')`.
- [ ] (2) Implementación mínima: las 32 de [[design]] §2.5 en
      `src/app/(tabs)/health.tsx`, `src/app/(tabs)/weight-log.tsx` y
      `src/components/weight-chart.tsx`; actualizar las 21 anclas de
      `health.test.tsx` (10), `weight-log.test.tsx` (10) y
      `weight-chart.test.tsx` (1), más el título de `health.test.tsx:609`.
      **No tocar** `localTodayIso()` ni el formato ISO que se envía: solo
      cambia el `placeholder` a `AAAA-MM-DD`. **No tocar** los 3 literales de
      validación del backend de `weight-log.test.tsx` (375, 376, 387).
- [ ] (3) Refactor con tests verdes.

## R6 — Food y Meal schedule (35 cadenas)

- [ ] (1) Test rojo: `R6_FOOD` +
      `describe('#65 R6: Food y Meal schedule están en español')`.
- [ ] (2) Implementación mínima: las 35 de [[design]] §2.6 en
      `src/app/(tabs)/food.tsx` y `src/app/(tabs)/meal-schedule.tsx`;
      actualizar las 28 anclas de `food.test.tsx` (12) y
      `meal-schedule.test.tsx` (16), más el título de
      `meal-schedule.test.tsx:450`. **`warnings[].message` del backend se
      renderiza tal cual**: los dos literales españoles de
      `food.test.tsx:355, 361` no se tocan.
- [ ] (3) Refactor con tests verdes.

## R7 — Profile y Documentos (26 cadenas)

- [ ] (1) Test rojo: `R7_PROFILE` +
      `describe('#65 R7: Profile y Documentos están en español')`.
- [ ] (2) Implementación mínima: las 26 de [[design]] §2.7 en
      `src/screens/profile/index.tsx` y `src/screens/docs/index.tsx`;
      actualizar las 4 anclas de `profile.test.tsx` (258, 347, 348) y de
      `screens.test.tsx:77` (el `title: 'Profile'` de su `it.each`).
      **Las 8 cadenas ya españolas de esas dos pantallas no se re-redactan**
      (`No registrado`, `Información`, `Raza`, `Microchip`,
      `Dispositivo GPS`, `Última señal`, `Documentos`,
      `Configuración del Dispositivo GPS`, `Documentos de`), y
      `docs/index.test.tsx` **no se toca**.
- [ ] (3) Refactor con tests verdes: `profile.test.tsx:346` sigue asertando
      `'female'` crudo — es valor de la API, fuera de alcance declarado.

## R8 — Recordatorios y su alta (50 cadenas)

- [ ] (1) Test rojo: `R8_REMINDERS` +
      `describe('#65 R8: Recordatorios y su alta están en español')`.
- [ ] (2) Implementación mínima: las 50 de [[design]] §2.8 en
      `src/screens/reminders/index.tsx`, `src/utils/reminder-meta.ts` y
      `src/screens/add-reminder/index.tsx`; actualizar las 28 anclas de
      `reminders/index.test.tsx` (14), `add-reminder/index.test.tsx` (13) y el
      `toContain('Delete')` → `toContain('Eliminar')` de
      `src/__tests__/legibility-classnames.test.ts:85`. **Las 7 claves y los 7
      emoji de `REMINDER_TYPE_META` no se tocan**: solo el `label`.
- [ ] (3) Refactor con tests verdes: comprobar que
      `legibility-classnames.test.ts` sigue siendo un escaneo de fuente y no
      se convirtió en una consulta por `testID`.

## R9 — Alta de mascota (38 cadenas)

- [ ] (1) Test rojo: `R9_ADD_PET` +
      `describe('#65 R9: el alta de mascota está en español')`.
- [ ] (2) Implementación mínima: las 38 de [[design]] §2.9 en
      `src/screens/add-pet/index.tsx`; actualizar las 4 anclas de
      `add-pet/index.test.tsx` (110, 175, 325, 326). **Los valores de dominio
      (`'dog'`, `'cat'`, `'female'`, `'male'`, `'small'`, `'medium'`,
      `'large'`) y los 11 `testID` de chip no se tocan**; las 2 cadenas ya
      españolas (`Datos básicos`, `Datos médicos`) tampoco.
- [ ] (3) Refactor con tests verdes.

## R10 — Emparejado del collar (40 cadenas)

- [ ] (1) Test rojo: `R10_PAIRING` +
      `describe('#65 R10: el emparejado del collar está en español')`.
- [ ] (2) Implementación mínima: las 40 de [[design]] §2.10 en
      `src/screens/pairing/index.tsx`, incluida la reordenación autorizada de
      `:305` y los 2 botones del `Alert.alert` (mismo orden, mismos `style`);
      actualizar las 36 anclas de `pairing/index.test.tsx`, los
      `getAlertButton('Cancel'|'Unpair')` → `('Cancelar'|'Desvincular')` y el
      título de `:413`.
- [ ] (3) Refactor con tests verdes: `device-connectivity` sigue pintando el
      valor crudo de la API — fuera de alcance declarado.

## R11 — Restablecer contraseña (15 cadenas)

- [ ] (1) Test rojo: `R11_RESET` +
      `describe('#65 R11: el restablecimiento de contraseña está en español')`.
- [ ] (2) Implementación mínima: las 15 de [[design]] §2.11 en
      `src/screens/reset-password/index.tsx`; actualizar las 7 anclas de
      `reset-password/index.test.tsx` (71, 136, 147, 149, 150, 151, 152).
      **No tocar** los 3 literales de validación del backend (172, 175, 185).
- [ ] (3) Refactor con tests verdes.

## R12 — Los títulos de card se localizan por `testID`

- [ ] (1) Test rojo: en `src/app/(tabs)/__tests__/food.test.tsx`, escribir
      `describe('#65 R12: los títulos de card se localizan por testID y su copy sigue asertada')`
      con las 2 aserciones de copy nuevas (`Comidas hoy`,
      `Horario de comidas`) y la comprobación de que los 3 `testID` nuevos de
      `food.tsx` existen. Rojo.
- [ ] (2) Implementación mínima: añadir los **6** `testID` de [[design]] §3.3
      a los `Text` correspondientes; migrar las **4** llamadas
      (`home.test.tsx:771`, `health.test.tsx:612`,
      `meal-schedule.test.tsx:460`, `food.test.tsx:522`) de `findByText` a
      `findByTestId`, con la aserción de `className` **idéntica byte a byte**;
      actualizar el título de `food.test.tsx:522`.
- [ ] (3) Refactor con tests verdes + comprobar los dos recuentos de
      [[requirements]] R12: `*ByText(`/`toHaveTextContent(` = **244** y
      `ByTestId(` = **800**. Si no cuadran, algo se debilitó: parar.

## R13 — El escaneo global no deja sobrevivir ninguna cadena inglesa

- [ ] (1) Test rojo: `describe('#65 R13: ninguna cadena inglesa de la tabla
      sobrevive en el fuente')` recorriendo `ALL_ROWS` (309) con la
      comprobación de ausencia sobre las **234** parejas marcadas `sí` y
      saltándose las **40** de [[design]] §3.2. Debe estar rojo si alguna de
      R1–R11 quedó a medias.
- [ ] (2) Implementación mínima: cerrar lo que el escaneo destape. Si aparece
      una cadena que no está en la tabla, **parar** y anotarlo en
      `progress/impl_mobile-ui-language.md`: no se inventa copy.
- [ ] (3) Refactor con tests verdes: confirmar que la lista de excepciones
      sigue teniendo **exactamente 40** entradas.

## R14 — Enmienda de las 9 specs aprobadas

- [ ] (1) Test rojo: `describe('#65 R14: las 9 specs aprobadas llevan su
      enmienda de idioma')`, escaneo de fuente sobre los 9 `.md` de
      [[design]] §5.1 comprobando que cada uno contiene el encabezado
      `## Enmienda #65 — idioma de la UI` y la línea
      `- [ ] Enmienda aprobada por humano`.
- [ ] (2) Implementación mínima: las dos ediciones de [[design]] §5.2 en cada
      uno de los 9 ficheros: tachar la frase que ratificaba el inglés e
      insertar el bloque literal. **La casilla se deja sin marcar.**
- [ ] (3) Refactor con tests verdes: no se toca ningún `R<n>` de esas specs ni
      su `traceability.md`.

## R15 — La carta de UI fija el español

- [ ] (1) Test rojo: `describe('#65 R15: la carta de UI fija el español como
      idioma de la UI')`, escaneo de `docs/ui-guidelines.md` buscando
      `**6. Idioma: español, y solo español.**` y las tres frases clave de los
      corolarios.
- [ ] (2) Implementación mínima: insertar el texto literal de [[design]] §5.3
      como punto 6 de §Dirección de arte.
- [ ] (3) Refactor con tests verdes.

---

## Cierre

- [ ] `./init.sh` verde de punta a punta.
- [ ] `specs/mobile-ui-language/traceability.md` sin ninguna fila «pendiente».
- [ ] `git diff --stat` no toca `backend-pet-tracker/`, `infra/`, `hosting/`,
      `app.json`, `package.json` ni `mobile-pet-tracker/src/theme/`.
- [ ] `progress/impl_mobile-ui-language.md` escrito: qué cadenas aparecieron
      que no estaban en la tabla (si alguna), qué pantallas quedaron
      descuadradas por la longitud del español (sin arreglarlas), y los dos
      recuentos de R12.
- [ ] **Gate humano (no delegable a IA)**: smoke en **dev build de Android**
      recorriendo las 18 pantallas en tema claro y oscuro, confirmando que no
      queda texto inglés escrito por la app; se espera **seguir viendo inglés**
      en los mensajes de validación del backend y en los 5 valores de enum de
      [[requirements]] §Fuera de alcance 1 y 2 — eso es correcto, no un defecto.
- [ ] **Gate humano**: firma de las 9 enmiendas de [[design]] §5.1.
