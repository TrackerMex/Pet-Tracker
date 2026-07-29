# Conventions — pet-tracker

> Reglas de estilo, nombres y patrones que todo el código de este proyecto
> debe seguir. Cuando tengas duda sobre cómo hacer algo, busca aquí primero.
>
> **Rellenar en la primera sesión del proyecto.** Este archivo es un esqueleto
> a completar con las convenciones reales de `NestJS + TypeScript + pnpm + LocalStack (AWS local)` — no lo dejes vacío
> más de una sesión de trabajo.

---

## Nombres de archivos

<!-- Tabla tipo-de-archivo → patrón → ejemplo, análoga a la convención NestJS
     original: domain entity, repository interface, ORM entity, DTO, use case,
     controller, mapper, module, guard, etc. Adaptar a los tipos de archivo
     reales de NestJS + TypeScript + pnpm + LocalStack (AWS local). -->

| Tipo | Patrón | Ejemplo |
|---|---|---|
| — | — | — |

---

## Tokens de inyección / resolución de dependencias

<!-- Si el stack usa inyección de dependencias con tokens string (como NestJS),
     documentar aquí la regla de que el token en el registro y el token en el
     punto de inyección deben ser byte-idénticos. -->

---

## DTOs / validación de entrada

<!-- Librería de validación usada, patrón de DTOs de creación vs actualización. -->

---

## Manejo de errores

<!-- Tabla situación → tipo de excepción/error → código HTTP o equivalente. -->

| Situación | Excepción/Error | Código |
|---|---|---|
| Recurso no encontrado | — | 404 |
| Conflicto | — | 409 |
| Sin autenticación | — | 401 |
| Sin permisos | — | 403 |
| Datos inválidos | — | 400 |

---

## Tests

<!-- Framework de test, convención de nombres de archivo, cómo se nombra un
     test que cubre un requisito (ver docs/verification.md para la disciplina
     TDD completa): -->

```
describe('R1: <resumen del requisito>', () => { ... })
```

---

## Commits

Conventional commits, en inglés:

```
feat(<scope>): <descripción> (R1,R2)
fix(<scope>): <descripción> (R3)
refactor(<scope>): <descripción>
```

El `<scope>` es el nombre de la feature o módulo. Los R-ids referencian los
requisitos de `specs/<feature>/requirements.md` que ese commit satisface.

---

## Variables de entorno

<!-- Lista de variables requeridas por el proyecto, sin valores reales. -->
