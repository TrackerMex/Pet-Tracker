# Implementación — mobile-food (#38)

- Fecha: 2026-08-24
- Branch: `feature/38-mobile-food`
- Alcance de Codex: R1–R10
- Estado: R1–R9 implementados y verificados; R10 en verificación final y
  R11 reservado al smoke humano con Expo Go en Android físico.

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

En curso: suite móvil completa, `./init.sh` y comprobaciones de contención.

## Pendiente humano

- R11: ejecutar exactamente los pasos de `requirements.md` con Expo Go en un
  Android físico y registrar la fecha en la casilla reservada al humano.
- La feature permanece `in_progress`; no se marca `done` antes del smoke y la
  revisión final.

## Estado del worktree

Los archivos locales preexistentes no relacionados bajo `.agents/`,
`.claude/skills/`, `progress/` y `skills-lock.json` se preservaron y no se
incluyeron en los commits de mobile-food.
