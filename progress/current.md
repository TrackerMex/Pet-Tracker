# Sesión activa

> Este archivo describe el estado de la sesión en curso.
> Al cerrar la sesión, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

```
feature: aws-mode-endpoint-guard (id 21, P1)
inicio: 2026-08-10
branch: feature/21-aws-mode-endpoint-guard
agentes lanzados: spec_author (terminado)
estado: in_progress — handoff entregado, esperando a Codex CLI
```

## Plan (qué implementa Codex)

Guarda simétrica a `assertNoStaticAccessKey` en
`backend-pet-tracker/src/aws/aws-clients.ts`: en modo `aws`, si
`AWS_ENDPOINT_URL` tiene valor, lanzar `UnexpectedAwsEndpointError` antes de
construir ningún cliente. Cubre las dos vías de resolución
(`resolveAwsConfigFromEnv` y `resolveAwsConfigFromConfigService`). Modo `local`
intacto. Ocho requisitos vivos: R1-R7 más R9 (evidencia de proceso).

El defecto de origen: el AWS SDK v3 lee `AWS_ENDPOINT_URL` de `process.env` por
su cuenta, así que omitir el parámetro `endpoint` en modo `aws` no aísla nada.
`test/aws-real-ingest.e2e-spec.ts` pasó en verde contra LocalStack fingiendo
haber verificado AWS real.

## Gate humano (hecho)

Spec aprobada el 2026-08-10 con una modificación: **R8 borrado** (documentar el
modo de fallo de `AWS_ENDPOINT_URL` en `docs/conventions.md`) por ir más allá de
los seis criterios de `feature_list.json`. La numeración conserva el hueco a
propósito. `docs/conventions.md` queda en la lista de archivos que no se tocan.

Nota para futuras specs: `spec_author` dejó marcado él mismo el checkbox
"Aprobado por humano" de `requirements.md` antes de que hubiera gate. El
contenido no cambió, pero ese checkbox no lo marca quien escribe la spec.

## Pendiente tras Codex

1. El humano confirma que Codex terminó y existe `progress/impl_aws-mode-endpoint-guard.md`.
2. Lanzar `reviewer`.
3. Cierre solo con veredicto aprobado.

## Notas de arranque

- `./init.sh` exit 0 tras rearrancar la infra. El primer intento dio 82 fallos
  e2e (FK `pet_users_user_id_users_id_fk`) porque los contenedores llevaban dos
  minutos arriba; repetir con la infra caliente lo dejó en 181 e2e verdes. Si
  vuelve a aparecer ese rojo justo después de `docker compose up -d`, es la
  misma carrera, no una regresión.
- `init.sh` propone #15 como próxima feature porque toma el primer `pending` del
  archivo; manda la prioridad, y #21 era la única P1 pendiente.
