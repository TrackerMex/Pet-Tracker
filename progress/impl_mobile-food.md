# Implementación — mobile-food (#38)

- Fecha: 2026-08-24
- Branch: `feature/38-mobile-food`
- Alcance de Codex: R1–R10
- Estado: R1–R10 implementados y verificados; R11 queda reservado al smoke
  humano con Expo Go en Android físico.

## Resultado

- `src/api/nutrition.ts` incorpora clientes puros para consultar el perfil,
  consultar el plan y generar un plan, con estados discriminados por `kind`
  y sin imports de React ni SecureStore.
- Food resuelve y permite cambiar la mascota, cubre loading/empty/error,
  presenta el plan diario, porciones, warnings y Served/Pending según la hora
  local, y omite por completo la recomendación de IA cuando llega `null`.
- MealSchedule carga plan y perfil, cubre deep-link sin mascota y estados de
  red, muestra horarios y permite generar el plan con degradación específica
  para 403, 422, configuración, red y errores genéricos.
- El botón `Generate plan` existe únicamente en MealSchedule. No se añadieron
  dependencias ni se modificaron el layout o la barra flotante.

## Evidencia TDD y commits de implementación

| R-id | Rojo | Verde / implementación |
|---|---|---|
| R1 | `9365da4` | `807891a` |
| R2 | `97e212d` | `96b8526` |
| R3 | `d2db20d` | `695ad9a` |
| R4 | `628e256` | `95bc9f7` |
| R5 | `ee67f62` | `4498939` |
| R6 | `50be8ee` | `a456c01` |
| R7 | `5b3cd68` | `fc8a951` |
| R8 | `d8cdc9f` | `e92e3b5` |

Cada commit rojo precede al verde correspondiente. La única modificación de
una suite existente fue quitar el import y la fila de Food de
`screens.test.tsx`, conforme a la excepción C4 aprobada en la spec.

## Verificación R9

- `bun run typecheck`: exit 0.
- `bun run lint`: exit 0, sin warnings después de retirar una variable de
  tema solicitada pero no usada en MealSchedule.

## Verificación R10

- `bun run test`: exit 0; 31 suites y 356 tests verdes.
- `./init.sh`: exit 0.
  - backend: 143 suites, 1111 tests;
  - infraestructura: 2 suites, 14 tests;
  - harness env drift: 11 suites, 28 tests;
  - móvil: 31 suites, 356 tests;
  - build, lint y typecheck: verdes.
- E2E: omitidos por el harness porque LocalStack no respondía en el puerto
  4566; mobile-food no requiere AWS y no se levantaron recursos reales.
- Contención contra `origin/main`: diff vacío en `backend-pet-tracker/`,
  `infra/`, `init.config.sh` y `.github/workflows/ci.yml`. La rama local
  `main` estaba seis commits detrás de `origin/main`; el cambio que mostraba
  en `init.config.sh` pertenece al PR #69 ya integrado, no a esta feature.
- `package.json` y `bun.lock` móviles no tienen diff contra `origin/main`; no
  se añadieron dependencias.
- El grep de `expo-secure-store` e imports de React bajo `src/api/` no devolvió
  resultados. Los guards de `StyleSheet.create` y colores hex tampoco
  devolvieron resultados en las dos pantallas nuevas.
- `Generate plan` aparece únicamente en `meal-schedule.tsx`; el diff de
  `screens.test.tsx` contiene solo la eliminación del import y la fila Food
  permitida por la excepción C4.
- `git diff --check origin/main...HEAD`: sin errores.

## Pendiente humano

- R11: ejecutar exactamente los pasos de `requirements.md` con Expo Go en un
  Android físico y registrar la fecha en la casilla reservada al humano.
- La feature permanece `in_progress`; no se marca `done` antes del smoke y la
  revisión final.

## R11 — Correcciones del smoke (2026-08-25)

El primer smoke humano en Expo Go detectó dos defectos visuales:

- El título de Food y la cabecera de MealSchedule quedaban pegados a la status
  bar. Ambas pantallas aplican ahora el mismo `paddingTop: insets.top + 12` de
  Home (`8011711` rojo → `9caafca` verde; R4/R7).
- Food mostraba un spinner suelto y el contenido saltaba al resolverse los
  datos; MealSchedule tenía el mismo patrón. Food conserva `food-loading`
  dentro de una altura estable y reserva skeletons para plan, comidas y enlace.
  MealSchedule usa skeletons dimensionados para resumen, comidas, acción y
  perfil, y no sustituye contenido ya cargado durante un refresh (`43389aa`
  rojo → `8f77e76` verde; R4/R5/R7).

No se cambió ningún testID existente ni se añadieron dependencias. El smoke
humano queda pendiente de repetirse en Expo Go después de estas correcciones;
R11 y la feature permanecen `in_progress` hasta esa validación.

### Verificación post-fix

- `bun run test`: exit 0; 31 suites y 356 tests verdes.
- `bun run typecheck`: exit 0.
- `bun run lint`: exit 0.

### Fix 2 — selector de pets con Avatar

El segundo hallazgo del smoke fue que Home, Health y Food repetían chips de
solo texto para cambiar de mascota. Se extrajo `src/components/pet-switcher.tsx`:
una fila horizontal scrolleable que usa `Avatar` de HeroUI Native, muestra
`photoUrl` cuando existe, usa la inicial del nombre como fallback y conserva el
nombre al lado. La selección se distingue con `border-accent` y
`bg-accent-soft`, sin colores hardcodeados.

El componente conserva sin cambios `pet-chip-<id>`,
`accessibilityRole="button"` y `accessibilityState={{ selected }}`. Home,
Health y Food mantienen su auto-selección del primer pet y delegan solo el
render y el callback de selección. No se modificaron sus suites existentes.

- TDD: `b746530` rojo (`PetSwitcher` aún inexistente) → `602870e` verde.
- Suite nueva:
  `src/components/__tests__/pet-switcher.test.tsx::R11: pet switcher usa Avatar para cambiar de mascota`.
- Suites focalizadas: 4 suites / 61 tests verdes (componente, Home, Health y
  Food).
- `bun run test`: exit 0; 32 suites y 357 tests verdes.
- `bun run typecheck`: exit 0.
- `bun run lint`: exit 0.
- Cero dependencias nuevas y cero cambios en `_layout.tsx`,
  `floating-tab-bar.tsx`, `backend-pet-tracker/`, `infra/` o `src/api/`.
- R11 y la feature permanecen `in_progress` hasta repetir el smoke humano en
  Expo Go.

## Estado del worktree

Los archivos locales preexistentes no relacionados bajo `.agents/`,
`.claude/skills/`, `progress/` y `skills-lock.json` se preservaron y no se
incluyeron en los commits de mobile-food.
