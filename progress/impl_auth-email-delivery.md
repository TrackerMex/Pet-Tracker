# Implementación — Feature #58 `auth-email-delivery`

- Fecha: 2026-09-02
- Branch: `feature/58-auth-email-delivery`
- Alcance previsto: R1–R12, backend puro
- Resultado: **bloqueada antes de implementación por inconsistencia en el gate
  de aprobación de la spec**.

## Bloqueo

El handoff y la casilla de aprobación humana afirman que la spec está
aprobada, pero los cuatro documentos de la spec conservan `status: draft` en
su frontmatter:

```text
specs/auth-email-delivery/requirements.md:3:status: draft
specs/auth-email-delivery/design.md:3:status: draft
specs/auth-email-delivery/tasks.md:3:status: draft
specs/auth-email-delivery/traceability.md:3:status: draft
```

El commit de handoff `8110530` (`docs(auth): approve #58 spec and hand off to
Codex CLI`) no modificó ninguno de esos cuatro archivos; su diff contiene
únicamente `feature_list.json`, `progress/current.md` y
`progress/handoff_auth-email-delivery.md`.

Esto contradice tanto `progress/current.md` (que dice que el frontmatter de
los cuatro ficheros pasó a `approved`) como el prompt del handoff (que declara
`requirements.md` con `status: approved`). De acuerdo con la regla explícita
del handoff —si la spec tiene un error, parar, reportarlo aquí y no editar la
spec— no se auto-corrigió ningún documento de `specs/` y no se inició TDD.

## Verificación previa

Antes de detectar el bloqueo se sincronizó la branch y se ejecutó el gate
inicial obligatorio:

```text
$ git checkout feature/58-auth-email-delivery
Already on 'feature/58-auth-email-delivery'

$ git pull
Already up to date.

$ ./init.sh
exit 0
build: OK
backend: 158 suites, 1210 tests passed
infra: 2 suites, 14 tests passed
harness env-drift: 28 tests passed
mobile: 51 suites, 578 tests passed, 1 snapshot
lint y typecheck: OK
e2e: omitidos porque el puerto 5432 no estaba disponible
```

`init.sh` también reportó dos advertencias preexistentes: ocho claves ausentes
en el `.env` local y `STATUS.md` con conteo 51/57 frente a 53/59. Ninguna se
modificó.

## Cambios y estado TDD

- No se modificó código de backend.
- No se tocó `mobile-pet-tracker/`, `infra/`, `src/db/` ni `src/workers/`.
- No se tocó `feature_list.json` ni `progress/current.md`.
- No se ejecutó red real, no se creó cuenta de Resend, no se tocó DNS y no se
  envió correo.
- No existen commits rojo/verde porque el gate bloquea el inicio de R1.
- G1–G4 permanecen pendientes y fuera del alcance del implementer.

## Acción requerida

El leader o el humano que aprobó la spec debe corregir el frontmatter de los
cuatro documentos a `status: approved` en un commit previo y volver a entregar
la branch. Después puede reanudarse la implementación R1–R12 con el historial
rojo→verde exigido.
