# pet-tracker — Status

**Última actualización**: 2026-07-29
**Features completadas**: 0/7 (`feature_list.json`)
**Pendientes**: 7 (db-setup-drizzle, auth-registration, auth-login, pets-crud, pet-health-records, pet-locations, pet-reminders)
**En producción**: no

---

## Qué es este proyecto

API backend para dueños de mascotas: cada dueño (multi-usuario, con auth)
registra sus mascotas y lleva su historial de salud (vacunas, citas
veterinarias, peso, medicación), ubicaciones GPS y recordatorios de cuidado.

---

## Cómo arrancar

```bash
docker compose up -d   # Postgres + LocalStack (solo si la sesión toca DB/AWS)
./init.sh
```

`init.sh` copia `.env.example` → `.env` si falta. Docker no arranca solo:
levántalo manualmente cuando la feature lo necesite.

---

## Estado actual

- Harness SDD configurado y verde (`init.sh` pasa completo).
- Scaffold NestJS en `backend-pet-tracker/` — sin features todavía.
- Decisión de base de datos tomada: **PostgreSQL en Docker local**
  (runner-up DynamoDB rechazado) — ver `docs/data-model.md`.
- ORM decidido: **Drizzle**. Convenciones (`docs/conventions.md`) y
  estructura de módulo (`docs/architecture.md`) rellenadas.
- Infra local lista: `docker-compose.yml` (Postgres 17 + LocalStack),
  `.env.example` en raíz, `DATABASE_URL` verificada por `init.sh`.
- 7 features declaradas en `feature_list.json`, todas `pending` (sin spec).
- Próximo paso SDD: `spec_author` escribe la spec de `db-setup-drizzle`
  (#1) y para hasta aprobación humana.

---

## Última sesión

- **2026-07-29** — Skills instaladas bajo convención del harness
  (`data-postgresql-table-design`, `backend-nestjs-best-practices`). Alcance
  del MVP definido (salud/cuidado + GPS + recordatorios, dueños con cuenta).
  Decisión M0 de engine: Postgres; modelo starter y ERD en
  `docs/data-model.md`. ORM: Drizzle; conventions y estructura de módulo
  rellenadas. Infra local: docker-compose (Postgres 17 + LocalStack) +
  `.env.example`. Resultado: verde. Próximo: declarar features.

---

## Stack

- **Backend**: NestJS 11 + TypeScript, pnpm (código en `backend-pet-tracker/`)
- **Base de datos**: PostgreSQL (contenedor Docker local)
- **Infra local**: LocalStack community para servicios AWS (sin deploy real)
- **Tests**: Jest
