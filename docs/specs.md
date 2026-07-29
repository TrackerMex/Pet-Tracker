# Specs — El proceso SDD completo

> SDD = Spec-Driven Development. Ninguna feature se implementa sin una spec
> aprobada por un humano. Este documento describe el ciclo completo.

---

## Quién escribe qué

| Rol | Escribe | Nunca hace |
|---|---|---|
| `spec_author` | `specs/<feature>/requirements.md` (requisitos EARS) | Escribir código |
| `explorer` | `progress/explore_<feature>.md` (investigación) | Escribir código o specs |
| `implementer` | Código + tests + `specs/<feature>/traceability.md` | Aprobarse su propia spec |
| `reviewer` | `progress/review_<feature>.md` (veredicto) | Editar código |
| Humano | Aprueba la spec (gate obligatorio) | — |

---

## Estados de una feature

```
pending → spec_ready → in_progress → done
```

1. **`pending`**: la feature existe en `feature_list.json`, sin spec.
2. **`spec_ready`**: `spec_author` copió `specs/_template/` a
   `specs/<feature>/`, escribió requisitos EARS concretos y medibles en
   `requirements.md`, y un **humano marcó la casilla de aprobación**. Sin esa
   marca, ningún agente puede pasar la feature a `in_progress`.
3. **`in_progress`**: `implementer` trabaja siguiendo `specs/<feature>/tasks.md`
   (test rojo → verde → refactor por cada requisito), actualizando
   `traceability.md` tras cada commit.
4. **`done`**: `reviewer` valida contra `CHECKPOINTS.md` (C1–C6), en
   particular que `traceability.md` no tiene filas "pendiente" y que los
   tests nombran sus R-ids.

---

## Schema de una entrada en feature_list.json

Cada elemento del array es un objeto con estos campos:

| Campo | Tipo | Obligatorio | Significado |
|---|---|---|---|
| `id` | number | sí | Identificador único, estable, no se reutiliza |
| `name` | string | sí | Slug usado como nombre de carpeta en `specs/<name>/` |
| `status` | string | sí | Uno de: `pending`, `spec_ready`, `in_progress`, `done` |
| `priority` | string | no | Valor libre (ej: `P1`/`P2`/`P3` o `alta`/`media`/`baja`) — elegir una convención por proyecto y mantenerla |
| `description` | string | no | Resumen de qué hace la feature; usado por `spec_author` como contexto inicial |
| `acceptance_criteria` | string[] | no | Lista de criterios en lenguaje natural; `spec_author` los traduce a requisitos EARS |
| `files_affected` | string[] | no | Rutas o módulos que probablemente toque la feature; pista para `explorer`/`spec_author`, no una restricción dura |

Ejemplo:

```json
{
  "id": 1,
  "name": "user-auth",
  "status": "pending",
  "priority": "P1",
  "description": "Permitir login con email y password",
  "acceptance_criteria": [
    "Usuario puede loguearse con credenciales válidas",
    "Sistema rechaza credenciales inválidas con 401"
  ],
  "files_affected": [
    "src/modules/auth/"
  ]
}
```

Solo `id`, `name` y `status` son leídos por `init.sh`. El resto es contexto
opcional para `spec_author` — vale la pena rellenarlo cuando ya se sabe, pero
no bloquea nada si falta.

---

## Cómo se crea la spec de una feature nueva

```
1. spec_author lee feature_list.json y docs/architecture.md
2. Copia specs/_template/ → specs/<feature-name>/
3. Escribe requirements.md: requisitos R1..Rn en notación EARS,
   concretos y verificables (no vagos)
4. Cambia status de la feature a "spec_ready" en feature_list.json
5. PARA — espera aprobación humana (marca en requirements.md)
6. Solo tras la aprobación, el leader puede lanzar implementer
```

## Notación EARS (Easy Approach to Requirements Syntax)

```
WHEN <disparador>            THE SYSTEM SHALL <respuesta observable>
WHILE <estado>                THE SYSTEM SHALL <comportamiento>
IF <condición de error> THEN  THE SYSTEM SHALL <manejo>
```

Cada requisito debe ser observable y verificable con un test — si no se puede
escribir un test que falle/pase para un requisito, el requisito está mal
escrito.

---

## Cuándo se actualiza traceability.md

- **El implementer**, inmediatamente después de cada commit que satisface un
  requisito: reemplaza la fila "pendiente" de ese `R<n>` con el test que lo
  cubre y el hash del commit.
- **El reviewer**, al validar el cierre de la feature: confirma que no queda
  ninguna fila "pendiente" antes de aprobar (CHECKPOINTS.md C5).

---

## Relación con Obsidian

Las specs usan frontmatter YAML y wikilinks (`[[requirements]]`,
`[[../../docs/architecture|architecture]]`) para que el grafo de Obsidian
conecte feature ↔ spec ↔ sesiones de progreso. Ver `docs/obsidian.md`.
