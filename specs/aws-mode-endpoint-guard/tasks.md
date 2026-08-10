---
feature: "aws-mode-endpoint-guard"
status: approved     # draft | approved
tags: [harness, spec]
---

# Tareas — [[aws-mode-endpoint-guard]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Commits test-primero, obligatorio (C4 de [[../../CHECKPOINTS|CHECKPOINTS]]).**
> Por cada R-id: un commit con el test en rojo, y **después** otro commit con la
> implementación que lo pone en verde. En la feature #19 la implementación, los
> tests y los docs cayeron en un solo commit, sin historial rojo→verde, y eso es
> motivo de rechazo. Formato:
> `test(aws-mode-endpoint-guard): <desc> (R1)` → `feat(aws-mode-endpoint-guard): <desc> (R1)`.
>
> Branch: `feature/21-aws-mode-endpoint-guard`. Trabaja solo en los archivos
> listados en [[design]] §Archivos afectados.
>
> Orden recomendado: R1 → R2 → R3 → R4 → R5 (todo en
> `src/aws/aws-endpoint-guard.spec.ts` + `src/aws/aws-clients.ts`), luego R6
> (e2e), luego R7 (docs), y R9 se cierra al final. No hay R8: el gate humano lo
> descartó, así que `docs/conventions.md` no se toca. R1 y R5 pueden compartir
> el commit de implementación si el helper sale simétrico a la primera: el test
> de R5 debe estar en rojo antes de ese commit igualmente.

## R1 — `UnexpectedAwsEndpointError` en modo aws con endpoint definido

- [ ] (1) Escribir test que falla para R1 — `src/aws/aws-endpoint-guard.spec.ts`,
      `describe('R1: modo aws con AWS_ENDPOINT_URL definida aborta')`. Debe
      fallar por símbolo inexistente (`UnexpectedAwsEndpointError` aún no se
      exporta): eso cuenta como rojo. Commitear el rojo.
- [ ] (2) Implementación mínima que lo pasa — clase `UnexpectedAwsEndpointError`
      + helper privado `assertNoEndpoint` + guarda en `resolveAwsConfigFromEnv`
      ([[design]] §D1, §D3, §D4).
- [ ] (3) Refactor con tests verdes — JSDoc de la función actualizado; `pnpm -C
      backend-pet-tracker run lint` y `typecheck` verdes.

## R2 — Mensaje explícito del error

- [ ] (1) Escribir test que falla para R2 — `describe('R2: el mensaje del error
      nombra la variable y la acción')`, con cuatro `toMatch` de subcadena:
      `AWS_ENDPOINT_URL`, `AWS_MODE`, `process.env`, `.env`.
- [ ] (2) Implementación mínima que lo pasa — copiar el texto literal de
      [[design]] §D2 al constructor.
- [ ] (3) Refactor con tests verdes — confirmar que
      `src/aws/no-real-aws-endpoint.spec.ts` y
      `src/aws/no-hardcoded-credentials.spec.ts` siguen verdes con el texto nuevo.

## R3 — Modo aws sin `AWS_ENDPOINT_URL`: comportamiento idéntico

- [ ] (1) Escribir test que falla para R3 — `describe('R3: modo aws sin
      AWS_ENDPOINT_URL no cambia')`: `undefined`, `''` y `'   '` devuelven
      `{ mode: 'aws', endpoint: '' }` sin lanzar, y `resolveAwsClientOptions`
      sigue sin `endpoint` ni `credentials`.
- [ ] (2) Implementación mínima que lo pasa — `assertNoEndpoint` devuelve `''`
      en vez de lanzar para esos tres casos.
- [ ] (3) Refactor con tests verdes.

## R4 — Modo local intacto

- [ ] (1) Escribir test que falla para R4 — `describe('R4: modo local intacto')`:
      `MissingAwsEndpointError` sigue en `resolveAwsConfigFromEnv({})`;
      `resolveAwsConfigFromConfigService` en modo local con endpoint lo conserva
      y sin endpoint devuelve `''` sin lanzar.
- [ ] (2) Implementación mínima que lo pasa — normalmente ninguna: si el test
      pasa a la primera porque la guarda ya está bien colocada, **dilo en el
      mensaje del commit** en vez de forzar un cambio artificial.
- [ ] (3) Refactor con tests verdes — `git diff --name-only` no debe incluir
      ninguno de los cinco archivos que R4 declara intocables.

## R5 — La guarda cubre las dos vías de resolución

- [ ] (1) Escribir test que falla para R5 — `describe('R5: la guarda cubre las
      dos vías de resolución')`, `it.each` sobre `resolveAwsConfigFromEnv` y
      `resolveAwsConfigFromConfigService` (mock de `ConfigService` como en
      [[design]] §Contrato de tests).
- [ ] (2) Implementación mínima que lo pasa — guarda en
      `resolveAwsConfigFromConfigService` ([[design]] §D4).
- [ ] (3) Refactor con tests verdes — el helper `assertNoEndpoint` es uno solo
      para las dos vías, no dos copias.

## R6 — El e2e de ingest real falla explícito

- [ ] (1) Escribir test que falla para R6 —
      `test/aws-real-ingest.e2e-spec.ts`, primer `it` del `describe`:
      `it('R6: aborta si AWS_ENDPOINT_URL sigue definida')` ([[design]] §D8).
      Para verlo en rojo: ejecutar con `AWS_MODE=aws` y `AWS_ENDPOINT_URL`
      puesta antes de tener la guarda — sin ella, la suite pasa en verde contra
      LocalStack, que es justo el defecto. Registrar esa corrida (comando +
      resultado) en `progress/impl_aws-mode-endpoint-guard.md`.
- [ ] (2) Implementación mínima que lo pasa — ninguna en `src/`: la guarda de R1
      y R5 ya lo cubre. Verificar con `AWS_MODE=aws` + `AWS_ENDPOINT_URL` que la
      suite ahora falla nombrando la variable, sin llamadas de red.
- [ ] (3) Refactor con tests verdes — comprobar que sin `AWS_MODE=aws` la suite
      sigue apareciendo como *skipped* y que `./init.sh` no cambia su recuento
      de omitidos.

## R7 — `docs/verification.md` refleja la guarda

- [ ] (1) Escribir test que falla para R7 —
      `src/aws/aws-endpoint-guard-docs.spec.ts`, `describe('R7: verification.md
      documenta la guarda')`: `toContain('### Feature 21 — aws-mode-endpoint-guard')`,
      `toContain('UnexpectedAwsEndpointError')`, `toContain('AWS_ENDPOINT_URL')`.
- [ ] (2) Implementación mínima que lo pasa — sección nueva + reescritura del
      párrafo R21 de la feature 20 ([[design]] §D6).
- [ ] (3) Refactor con tests verdes — releer que el paso R18 de la feature 20
      sigue exigiendo comentar las tres variables para la CLI de CDK.

## R9 — Evidencia de proceso (C2, C4, C5)

- [ ] (1) Verificar el historial: `git log --oneline` de la branch muestra, para
      cada R-id de R1 a R7, el commit del test rojo antes que el de la
      implementación.
- [ ] (2) Completar `specs/aws-mode-endpoint-guard/traceability.md`: ninguna
      fila "pendiente", cada una con `archivo::describe` y hash de commit.
- [ ] (3) Ejecutar `./init.sh` desde la raíz y registrar en
      `progress/impl_aws-mode-endpoint-guard.md` el exit code y el recuento de
      suites/tests (unit, infra, e2e pasados y omitidos), más la corrida manual
      de R6. No marcar la feature como `done`: eso lo hace el leader tras el
      veredicto del reviewer.
