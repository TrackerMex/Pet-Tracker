# Sesión activa

> Este archivo describe el estado de la sesión en curso.
> Al cerrar la sesión, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Plantilla (sesión sin iniciar)

```
feature: —
inicio: —
agentes lanzados: —
estado: sin sesión activa
```

---

```
feature: aws-cdk-dev-stack (#20)
inicio: 2026-08-10
agentes lanzados: explorer, spec_author
estado: escribiendo spec — para en el gate humano
```

Cerrado antes en esta sesión: fix del harness sobre quién implementa
(PR #37, mergeada) — Codex CLI queda como implementador por defecto.

`init.sh` verde al arrancar: 119 suites / 869 tests unit, lint y typecheck
limpios. Los e2e se saltaron porque el puerto 5432 no responde (docker abajo);
no bloquea la fase de spec, pero hay que levantarlo antes de implementar.

La feature está `pending` y arrastra tres decisiones de diseño abiertas que
impiden escribir una spec autosuficiente, así que va `explorer` antes que
`spec_author`:

1. `BUCKET_MEDIA` vale `'pet-tracker-media-local'`, con un comentario que
   prohíbe expresamente reutilizar ese nombre contra AWS real — pero el
   criterio de aceptación exige que los nombres salgan de `constants.ts`.
   Además los nombres de bucket S3 son globalmente únicos.
2. `infra/` no existe y el repo no es un pnpm workspace: cómo un proyecto CDK
   con su propio `tsconfig` importa símbolos de `backend-pet-tracker/src/aws/`
   está sin decidir.
3. Las colas no llevan sufijo de entorno. En AWS real hay que decidir si `dev`
   lo lleva o si el nombre desnudo se queda.

## Decisiones del humano (2026-08-10, tras leer la exploración)

| # | Decisión | Consecuencia |
|---|---|---|
| D1 | #20 **solo declara infraestructura**. Bucket dev = `pet-tracker-media-dev-<accountId>` desde un helper en `constants.ts`; `BUCKET_MEDIA` conserva su valor exacto | El backend en `AWS_MODE=aws` **todavía no sabe resolver el bucket real** — feature posterior, la spec lo dice explícito |
| D2 | `removalPolicy`: tabla `RETAIN`, bucket `DESTROY` **sin** `autoDeleteObjects` | Datos a salvo de un `destroy`; sin Lambda de custom resource. La tabla retenida sigue consumiendo el cupo gratis de la cuenta aunque se destruya el stack |
| D3 | No habrá `prod` en esta cuenta: **nombres desnudos**, helper de sufijo listo pero inactivo | Único camino compatible con el criterio 9; no desincroniza las cinco specs cerradas |
| D4 | Cuenta AWS creada **después del 2025-07-15** → plan nuevo, créditos y ventana de 6 meses | Riesgo operativo con fecha; verificar en Billing antes del primer `cdk deploy` |

Decisión técnica que tomo yo (leader), derivada de D1: el stack compone el
nombre con el token `Aws.ACCOUNT_ID` sin resolver, **no** con
`Stack.of(this).account`. Así `cdk synth` no necesita credenciales y puede
entrar en el gate de `init.sh` y en CI.

## Hallazgos de la exploración que la spec debe recoger sí o sí

- **Bug latente:** `provisioning.ts` nunca crea la resource-policy de SQS que
  EventBridge necesita para entregar en `geofence-events`. Invisible en
  LocalStack Community (no aplica IAM), en AWS real la entrega falla en
  silencio. Requisito con test de synth, no confianza en que CDK lo haga solo.
- **Divergencia declarada:** `provisioning.ts` usa `PAY_PER_REQUEST`, #20 exige
  `PROVISIONED` 25/25. Los criterios 1 y 2 se contradicen; la spec la declara
  como divergencia única e intencional o el reviewer la marca como incumplimiento.
- **Agujero del gate:** `init.config.sh` cablea `pnpm -C backend-pet-tracker` en
  los seis comandos y CI corre solo `init.sh`. Sin encadenar `infra/`, su lint,
  typecheck y tests no se ejecutan nunca.
