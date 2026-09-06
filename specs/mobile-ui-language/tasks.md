---
feature: "mobile-ui-language"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-ui-language]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. **Un commit por
> requisito**, con el test rojo **antes** que la implementación
> ([[../../CHECKPOINTS|CHECKPOINTS]] C4): el historial debe enseñar rojo →
> verde, no todo junto.

## Orden de ejecución (NO es el orden de los ids)

```
R12 → R13 → R16 → R14 → R15      infraestructura: catálogo, persistencia,
                                  defecto, interruptor, locale
R1 → R2 → R3 → … → R11            los 11 lotes de pantalla, 320 ocurrencias
R17 → R18 → R19 → R20             desacople de los tests de estilo, escaneo
                                  global, enmiendas, carta
```

**Por qué la infraestructura va primero**: sin `t` no se puede escribir ninguna
pantalla. Los ids se dejan como están —las pantallas en R1–R11— para no
renumerar [[copy-review]], que ya está en manos del humano para revisar la
copy.

## Cómo está troceado, y por qué

La feature es masiva en **superficie** (320 ocurrencias, 19 archivos de fuente,
19 de test) y pequeña en **profundidad**: cada cambio es sustituir un literal
por `t('clave')`. El troceo es **por pantalla o por módulo**, no por tipo de
cadena:

- Por pantalla, cada requisito es **verificable de una pieza**: se abre esa
  pantalla, se comprueba que no queda literal, y su bloque del fixture pasa de
  rojo a verde entero.
- Por tipo de cadena (todos los errores, luego todos los títulos…) cada
  pantalla quedaría a medias durante varios commits y no se podría probar nada
  a mano hasta el final.

R1–R11 reparten las 320 ocurrencias 29/5/20/19/32/35/35/50/40/40/15.

## Antes del primer commit

- [ ] Cargar `expo:expo-overview` y, por lo que indica `docs/ui-guidelines.md`
      §Skills, `expo-native-ui`. No hay tokens, ni animación, ni componentes
      visuales nuevos: no hacen falta `expo-design-system` ni `expo-animation`.
- [ ] Leer `docs/ui-guidelines.md` entera, `docs/conventions.md` §Convenciones
      de la app móvil y `CHECKPOINTS.md` C4/C7/C8.
- [ ] `./init.sh` verde antes de empezar.
- [ ] Confirmar branch `feature/65-mobile-ui-language` y que
      `backend-pet-tracker/` **no se abre en ningún commit**.
- [ ] Confirmar que **no se añade ninguna dependencia** a
      `mobile-pet-tracker/package.json`. Si algo parece necesitarla, parar.

---

# Fase 1 — Infraestructura

## R12 — El catálogo y `t`

- [ ] (1) Test rojo: `src/providers/__tests__/language-provider.test.tsx` con
      `describe('#65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros')`:
      paridad exacta de claves `es`↔`en`, paridad de marcadores `{{…}}` por
      clave, defecto `'es'`, interpolación de un parámetro, y el caso del
      parámetro que falta (deja el marcador, no lanza).
- [ ] (2) Implementación mínima: `src/i18n/catalog.ts` con las **255**
      entradas de [[design]] §2 y §3.3 —`en` como fuente del tipo, `es` como
      `Record<TranslationKey, string>`— y
      `src/providers/language-provider.tsx` con `LanguageProvider`,
      `useLanguage`, `useTranslate` y `useLocale`, según [[design]] §3.2.
      **Ninguna dependencia nueva.**
- [ ] (3) Refactor con tests verdes: comprobar que `tsc` rompe si se quita una
      clave de `es` (la paridad la garantiza el tipo, no solo el test).

## R13 — La preferencia persiste, best-effort

- [ ] (1) Test rojo: `src/utils/language-preference.test.ts` con
      `describe('#65 R13: la preferencia de idioma persiste y es best-effort')`:
      guarda, lee, valor corrupto → `undefined`, `SecureStore` que lanza en
      lectura y en escritura → no propaga.
- [ ] (2) Implementación mínima: `src/utils/language-preference.ts`, **clon de
      `src/utils/theme-preference.ts`** con `LANGUAGE_PREFERENCE_KEY =
      'language_preference'`. Dos funciones, `try/catch` que traga, ~20 líneas.
- [ ] (3) Refactor con tests verdes.

## R16 — Español por defecto y arranque

- [ ] (1) Test rojo: `src/app/__tests__/layout.test.tsx` con
      `describe('#65 R16: sin preferencia guardada la app arranca en español')`.
- [ ] (2) Implementación mínima: en `src/app/_layout.tsx`, leer el idioma en el
      **mismo `useEffect` y el mismo gate** que ya usa el tema (`Promise.all`
      con `getStoredTheme()`), y montar `LanguageProvider` con ese `initial`.
      **No se añade un segundo estado de espera ni un segundo render en
      blanco.**
- [ ] (3) Refactor con tests verdes: confirmar que el árbol de providers no
      cambia de orden respecto a `AuthProvider` y `HeroUINativeProvider`.

## R14 — El interruptor en Profile

- [ ] (1) Test rojo: en `src/screens/profile/index.test.tsx`,
      `describe('#65 R14: Profile cambia el idioma y repinta sin reiniciar')`:
      la etiqueta del botón es el endónimo contrario; al pulsar, el título pasa
      de `Perfil` a `Profile`; `setStoredLanguage` recibe `'en'`; un
      `TextInput` con texto escrito **conserva su valor** tras el cambio;
      `theme-toggle` sigue existiendo y sin tocar.
- [ ] (2) Implementación mínima: un `Button` con `testID="language-toggle"`
      dentro de `me-card`, **justo debajo del `theme-toggle`**
      (`src/screens/profile/index.tsx:358-367`), etiqueta
      `t('profile.languageEnglish')` / `t('profile.languageSpanish')` según el
      idioma vigente y `accessibilityLabel={t('profile.changeLanguage')}`.
      **No se crea pantalla de ajustes ni componente nuevo.**
- [ ] (3) Refactor con tests verdes: el mismo `className` y `variant` que el
      `theme-toggle`; cero cambios de layout en `me-card`.

## R15 — Fechas y horas con el locale del idioma

- [ ] (1) Test rojo: `describe('#65 R15: el locale de fechas y números sigue al
      idioma elegido')` en `language-provider.test.tsx` (`useLocale()` →
      `es-MX` / `en-US`) y `describe('#65 R15: la fecha del recordatorio se
      formatea con el locale del idioma')` en `reminders/index.test.tsx`.
- [ ] (2) Implementación mínima: pasar `useLocale()` a las **7** llamadas de
      [[design]] §3.6. `fmtLastSeen` pasa a recibir el locale como parámetro.
      **No se introduce `toLocaleString` en ningún número** que hoy no lo use.
- [ ] (3) Refactor con tests verdes: los tests que recalculan la fecha con la
      misma llamada pasan el mismo locale.

---

# Fase 2 — Las 11 pantallas

> En cada una: (1) añadir el bloque `R<n>_…` al fixture
> `src/__tests__/ui-copy-table.ts` y su `describe('#65 R<n>: … resuelve su copy
> por clave')` en `src/__tests__/ui-language.test.ts` → rojo; (2) sustituir los
> literales por `t('clave')` con **la clave exacta** de la tabla y actualizar
> las anclas del test de pantalla; (3) refactor con verde.
>
> **Regla dura en las tres**: si aparece una cadena visible que no está en la
> tabla, **parar** y anotarla en `progress/impl_mobile-ui-language.md`. Codex no
> redacta copy ni inventa claves.

## R1 — Grupo `(auth)` (29 ocurrencias, 23 claves)

- [ ] (1) Test rojo: `R1_AUTH` + `describe('#65 R1: …')`.
- [ ] (2) Implementación: `login.tsx`, `forgot.tsx`, `register.tsx` por
      [[design]] §2.1; actualizar las **10** anclas de `login.test.tsx`
      (73, 74, 75, 76), `forgot.test.tsx` (36) y `register.test.tsx`
      (152, 182, 183, 184, 224). **No tocar** los 5 literales de esos tests que
      son mensajes de validación del backend (`login` 93/102, `register`
      160/171 y `'Terms must be accepted'`): siguen en inglés a propósito.
- [ ] (3) Refactor con tests verdes.

## R2 — Barra de pestañas (5 ocurrencias, 5 claves)

- [ ] (1) Test rojo: `R2_TABS` + `describe('#65 R2: …')`.
- [ ] (2) Implementación: `TABS` de `floating-tab-bar.tsx:48-54` pasa de
      `label` a `labelKey` ([[design]] §3.5) y el `<Text>` renderiza
      `t(labelKey)`; actualizar el bucle de `floating-tab-bar.test.tsx:235`.
      **Los 5 `name` y los 5 `testID` no se tocan**: son rutas.
- [ ] (3) Refactor con tests verdes.

## R3 — Home (20 ocurrencias, 18 claves)

- [ ] (1) Test rojo: `R3_HOME` + `describe('#65 R3: …')`.
- [ ] (2) Implementación: [[design]] §2.3, incluida la entrada con parámetro
      `home.lastSeen` (`{{date}}`); actualizar las 14 anclas de
      `home.test.tsx`.
- [ ] (3) Refactor con tests verdes.

## R4 — Map (19 ocurrencias, 17 claves)

- [ ] (1) Test rojo: `R4_MAP` + `describe('#65 R4: …')`.
- [ ] (2) Implementación: [[design]] §2.4, con `fmtAgo` resolviendo
      `map.justNow` / `map.agoMinutes` / `map.agoHours` y **los umbrales 60/3600
      intactos**; actualizar las 21 anclas de `map.test.tsx` y los 2 títulos de
      `it` (919, 935) de [[design]] §4.4.
- [ ] (3) Refactor con tests verdes: `stat-gps` sigue mostrando `GPS`, sigla
      que no entra al catálogo.

## R5 — Health, log de peso y gráfica (32 ocurrencias, 27 claves)

- [ ] (1) Test rojo: `R5_HEALTH` + `describe('#65 R5: …')`.
- [ ] (2) Implementación: [[design]] §2.5, incluida
      `weightLog.bodyConditionValue` (`{{value}}`); actualizar las 21 anclas de
      `health.test.tsx` (10), `weight-log.test.tsx` (10) y
      `weight-chart.test.tsx` (1), más el título de `health.test.tsx:609`.
      **No tocar** `localTodayIso()` ni el ISO que se envía. **No tocar** los 3
      literales de validación del backend de `weight-log.test.tsx`
      (375, 376, 387).
- [ ] (3) Refactor con tests verdes.

## R6 — Food y Meal schedule (35 ocurrencias, 29 claves)

- [ ] (1) Test rojo: `R6_FOOD` + `describe('#65 R6: …')`.
- [ ] (2) Implementación: [[design]] §2.6, incluidas las **4** entradas con
      parámetro (`food.dailyKcal`, `food.dailyGrams`,
      `mealSchedule.dailyGrams`, `mealSchedule.mealsPerDay`); actualizar las 28
      anclas de `food.test.tsx` (12) y `meal-schedule.test.tsx` (16), más el
      título de `meal-schedule.test.tsx:450`. **`warnings[].message` del
      backend se renderiza tal cual y no entra al catálogo**: los dos literales
      españoles de `food.test.tsx:355, 361` no se tocan.
- [ ] (3) Refactor con tests verdes.

## R7 — Profile y Documentos (35 ocurrencias, 32 claves)

- [ ] (1) Test rojo: `R7_PROFILE` + `describe('#65 R7: …')`.
- [ ] (2) Implementación: [[design]] §2.7, incluida `profile.ageMonths`
      (`{{months}}`) y **las 9 cadenas que ya estaban en español**, que entran
      al catálogo con su texto intacto en `es`; actualizar las 4 anclas de
      `profile.test.tsx` (258, 347, 348) y `screens.test.tsx:77`.
      `docs/index.test.tsx` **no se edita**: sus 6 aserciones españolas siguen
      valiendo porque el idioma por defecto es español — solo se comprueba que
      siguen verdes.
- [ ] (3) Refactor con tests verdes: `profile.test.tsx:346` sigue asertando
      `'female'` crudo, valor de la API y fuera de alcance declarado.

## R8 — Recordatorios y su alta (50 ocurrencias, 43 claves)

- [ ] (1) Test rojo: `R8_REMINDERS` + `describe('#65 R8: …')`.
- [ ] (2) Implementación: [[design]] §2.8, incluida `reminders.dueInDays`
      (`{{days}}`); `REMINDER_TYPE_META` y `ADVANCE_OPTIONS` pasan de `label` a
      `labelKey` ([[design]] §3.5), **conservando las 7 claves de tipo, los 7
      emoji y los 4 valores de `minutes`**; actualizar las 28 anclas de
      `reminders/index.test.tsx` (14), `add-reminder/index.test.tsx` (13) y
      `src/__tests__/legibility-classnames.test.ts:85`, cuyo
      `toContain('Delete')` pasa a `toContain("t('reminders.delete')")` —
      sigue siendo escaneo de fuente, no se convierte en consulta por `testID`.
- [ ] (3) Refactor con tests verdes.

## R9 — Alta de mascota (40 ocurrencias, 38 claves)

- [ ] (1) Test rojo: `R9_ADD_PET` + `describe('#65 R9: …')`.
- [ ] (2) Implementación: [[design]] §2.9, incluidas `addPet.basicDetails` y
      `addPet.medicalDetails` (ya en español, texto intacto en `es`);
      actualizar las 4 anclas de `add-pet/index.test.tsx` (110, 175, 325, 326).
      **Los valores de dominio y los 11 `testID` de chip no se tocan.**
- [ ] (3) Refactor con tests verdes.

## R10 — Emparejado del collar (40 ocurrencias, 33 claves)

- [ ] (1) Test rojo: `R10_PAIRING` + `describe('#65 R10: …')`.
- [ ] (2) Implementación: [[design]] §2.10, incluida `pairing.readySubtitle`
      (`{{petName}}`) con la reordenación autorizada, y los 2 botones del
      `Alert.alert` **resueltos en el momento de la llamada** (mismo orden,
      mismos `style`); actualizar las 36 anclas de `pairing/index.test.tsx`,
      los `getAlertButton('Cancel'|'Unpair')` → `('Cancelar'|'Desvincular')` y
      el título de `:413`.
- [ ] (3) Refactor con tests verdes: `device-connectivity` sigue pintando el
      valor crudo de la API, fuera de alcance declarado.

## R11 — Restablecer contraseña (15 ocurrencias, 11 claves)

- [ ] (1) Test rojo: `R11_RESET` + `describe('#65 R11: …')`.
- [ ] (2) Implementación: [[design]] §2.11; actualizar las 7 anclas de
      `reset-password/index.test.tsx` (71, 136, 147, 149, 150, 151, 152).
      **No tocar** los 3 literales de validación del backend (172, 175, 185).
- [ ] (3) Refactor con tests verdes.

---

# Fase 3 — Cierre

## R17 — Los títulos de card se localizan por `testID`

- [ ] (1) Test rojo: en `food.test.tsx`,
      `describe('#65 R17: los títulos de card se localizan por testID y su copy
      sigue asertada')` con las 2 aserciones de copy nuevas (`Comidas hoy`,
      `Horario de comidas`) y la comprobación de que los 3 `testID` nuevos de
      `food.tsx` existen.
- [ ] (2) Implementación: añadir los **6** `testID` de [[design]] §4.3; migrar
      las **4** llamadas (`home.test.tsx:771`, `health.test.tsx:612`,
      `meal-schedule.test.tsx:460`, `food.test.tsx:522`) de `findByText` a
      `findByTestId`, con la aserción de `className` **idéntica byte a byte**;
      actualizar el título de `food.test.tsx:522`.
- [ ] (3) Refactor con tests verdes + comprobar los dos recuentos de
      [[requirements]] R17: `*ByText(`/`toHaveTextContent(` = **244** y
      `ByTestId(` ≥ **800**. Si el primero no cuadra, algo se debilitó: parar.

## R18 — Cero copy suelta en las pantallas

- [ ] (1) Test rojo: `describe('#65 R18: los 320 sitios resuelven por clave y
      no queda copy suelta')` con `ALL_USES` (320) y el escaneo de literales
      enteros de [[design]] §4.1 sobre los 19 archivos.
- [ ] (2) Implementación: cerrar lo que el escaneo destape. Si aparece una
      cadena que no está en la tabla, **parar** y anotarlo en
      `progress/impl_mobile-ui-language.md`.
- [ ] (3) Refactor con tests verdes: confirmar que el escaneo **no lleva lista
      de excepciones**. Si alguien necesita añadir una, es señal de que quedó
      copy suelta: mirarla, no excusarla.

## R19 — Enmienda de las 9 specs aprobadas

- [ ] (1) Test rojo: `describe('#65 R19: las 9 specs aprobadas llevan su
      enmienda de idioma')`, escaneo sobre los 9 `.md` de [[design]] §6.1
      buscando `## Enmienda #65 — idioma de la UI` y
      `- [ ] Enmienda aprobada por humano`.
- [ ] (2) Implementación: las dos ediciones de [[design]] §6.2 en cada uno de
      los 9 ficheros. **La casilla se deja sin marcar.** Ojo con el tono: la
      enmienda **no dice que el inglés desaparece**, dice que se mueve a la
      columna `en`; la de `mobile-device-pairing` §D7 es la que más cambia.
- [ ] (3) Refactor con tests verdes: no se toca ningún `R<n>` de esas specs ni
      su `traceability.md`.

## R20 — La carta de UI fija el catálogo

- [ ] (1) Test rojo: `describe('#65 R20: la carta de UI fija el catálogo y el
      español por defecto')`, escaneo de `docs/ui-guidelines.md`.
- [ ] (2) Implementación: insertar el texto literal de [[design]] §6.3 como
      punto 6 de §Dirección de arte.
- [ ] (3) Refactor con tests verdes.

---

## Cierre

- [ ] `./init.sh` verde de punta a punta.
- [ ] `specs/mobile-ui-language/traceability.md` sin ninguna fila «pendiente».
- [ ] `git diff --stat` no toca `backend-pet-tracker/`, `infra/`, `hosting/`,
      `app.json`, `package.json` ni `mobile-pet-tracker/src/theme/`.
- [ ] `progress/impl_mobile-ui-language.md` escrito: qué cadenas aparecieron
      que no estaban en la tabla (si alguna), qué pantallas quedaron
      descuadradas por la longitud de un idioma (sin arreglarlas), y los dos
      recuentos de R17.
- [ ] **Gate humano (no delegable a IA)**: smoke en **dev build de Android**
      recorriendo las 18 pantallas, **cambiando de idioma en los dos sentidos**
      desde Profile y comprobando (a) que no queda texto sin traducir en
      ninguno de los dos, (b) que el cambio no reinicia la app ni pierde lo que
      hubiera escrito en un formulario, y (c) que la preferencia sobrevive a
      cerrar y abrir la app. Se espera **seguir viendo inglés en los dos
      idiomas** en los mensajes de validación del backend y en los 5 valores de
      enum de [[requirements]] §Fuera de alcance 1 y 2 — eso es correcto, no un
      defecto.
- [ ] **Gate humano**: firma de las 9 enmiendas de [[design]] §6.1.
