# pet-tracker — Status

**Última actualización**: 2026-07-29
**Features completadas**: 0/0 (`feature_list.json`)
**Pendientes**: definir features iniciales
**En producción**: no

---

## Qué es este proyecto

API backend para dueños de mascotas: cada dueño (multi-usuario, con auth)
registra sus mascotas y lleva su historial de salud (vacunas, citas
veterinarias, peso, medicación), ubicaciones GPS y recordatorios de cuidado.

---

## Cómo arrancar

```bash
./init.sh
```

<!-- Añade aquí cualquier paso manual adicional (levantar servicios, cargar
     secretos, etc.) que init.sh no cubra. -->

---

## Estado actual

- Harness SDD configurado y verde (`init.sh` pasa completo).
- Scaffold NestJS en `backend-pet-tracker/` — sin features todavía.
- Decisión de base de datos tomada: **PostgreSQL en Docker local**
  (runner-up DynamoDB rechazado) — ver `docs/data-model.md`.
- Pendiente: rellenar `docs/conventions.md`, estructura de módulo en
  `docs/architecture.md`, docker-compose (Postgres + LocalStack),
  `.env.example`, y declarar features en `feature_list.json`.

---

## Última sesión

- **2026-07-29** — Skills instaladas bajo convención del harness
  (`data-postgresql-table-design`, `backend-nestjs-best-practices`). Alcance
  del MVP definido (salud/cuidado + GPS + recordatorios, dueños con cuenta).
  Decisión M0 de engine: Postgres; modelo starter y ERD en
  `docs/data-model.md`. Resultado: verde. Próximo: conventions.md y
  estructura de módulo, luego docker-compose + .env.example, luego features.

---

## Stack

- **Backend**: NestJS 11 + TypeScript, pnpm (código en `backend-pet-tracker/`)
- **Base de datos**: PostgreSQL (contenedor Docker local)
- **Infra local**: LocalStack community para servicios AWS (sin deploy real)
- **Tests**: Jest
