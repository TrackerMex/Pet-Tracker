# Implementación #238 — backend-pg-pool-error-listener

Fecha: 2026-11-04 UTC. Implementador: Codex CLI.
Sesión: `01a1a416-3ff8-7e40-b5d2-de8f6f78adc7`.

**Resultado: PARA antes del primer commit.** El rojo tiene las cuentas
esperadas, pero no imprime el diagnóstico literal exigido. Código restaurado
y sin commits nuevos. Además, la revisión automática rechazó el borrado de
temporales con `rm -f`; véase §Limpieza. No se completó la implementación.

Worktree: `/home/claude/sites/Pet-Tracker-wt-238`.
Branch: `feature/238-backend-pg-pool-error-listener`.
H0: `3298a0a96438a468293e70c9d2f375f5da4c7520`.

La spec está aprobada por el humano y firmada en `f5093b22`.
No se ejecuta `./init.sh`: lo corre el leader. No se instala, no se lee
`.env`, no se ejecutan e2e y no se toca la infraestructura compartida.

## Identificación inicial

```sh
cd /home/claude/sites/Pet-Tracker-wt-238 && pwd && git branch --show-current && git log --oneline -4
```

```text
/home/claude/sites/Pet-Tracker-wt-238
feature/238-backend-pg-pool-error-listener
3298a0a9 docs(progress): #238 codex handoff
f5093b22 chore(spec): sign #238 (approved by the human 2026-11-04)
7e24ba36 Merge remote-tracking branch 'origin/dev' into feature/238-backend-pg-pool-error-listener
fd6244a2 Merge pull request #299 from TrackerMex/feature/234-mobile-nutrition-ai-collapse-flicker
```

Nota de procedimiento: antes de esta orden se leyeron el handoff y la skill
`ponytail` y se consultó `git status --short --branch`; no hubo cambios ni
pruebas antes de verificar la identidad del worktree.

## T0 — base sin cambios

Desde `backend-pet-tracker/`, después del `cd` literal del handoff:

```sh
FORCE_COLOR=0 pnpm exec jest --config package.json src/db/drizzle.module.spec.ts > /tmp/impl-238-file.log 2>&1; echo "exit=$?"
grep -E '^(Test Suites|Tests):' /tmp/impl-238-file.log
```

```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

## Anclas de partida

Medidas antes del primer commit y antes de cambiar producción, usando
`grep -cF` por literal. Todas coinciden; no se cambió ninguna expectativa.

```text
src/db/drizzle.module.ts | new Pool( | actual=1 | esperado=1
src/db/drizzle.module.ts | on('error' | actual=0 | esperado=0
src/db/drizzle.module.ts | Logger | actual=0 | esperado=0
src/db/drizzle.module.ts | throw | actual=0 | esperado=0
src/db/drizzle.module.ts | provide: PG_POOL, | actual=1 | esperado=1
src/db/drizzle.module.ts | connectionString: config.get<string>('DATABASE_URL'), | actual=1 | esperado=1
src/db/drizzle.module.ts | await this.pool.end(); | actual=1 | esperado=1
src/db/drizzle.module.ts | exports: [DRIZZLE], | actual=1 | esperado=1
src/db/drizzle.module.spec.ts | describe('R4: DrizzleModule exposes a Drizzle client under the DRIZZLE token' | actual=1 | esperado=1
src/db/drizzle.module.spec.ts | it('resolves a drizzle-orm/node-postgres client under DRIZZLE' | actual=1 | esperado=1
src/db/drizzle.module.spec.ts | #238 | actual=0 | esperado=0
src/db/drizzle.module.spec.ts | PG_POOL | actual=0 | esperado=0
src/db/drizzle.module.spec.ts | Logger | actual=0 | esperado=0
```

## Rojo R1 — PARA antes del primer commit

Se añadió únicamente el test descrito en `design.md`. Producción siguió
idéntica a H0. Se ejecutaron los tres pasos en el orden exigido:

```sh
pnpm exec prettier --write src/db/drizzle.module.ts src/db/drizzle.module.spec.ts
pnpm exec prettier --check src/db/drizzle.module.ts src/db/drizzle.module.spec.ts && pnpm exec eslint src/db/drizzle.module.ts src/db/drizzle.module.spec.ts && pnpm exec tsc --noEmit -p tsconfig.json; echo "exit=$?"
FORCE_COLOR=0 pnpm exec jest --config package.json src/db/drizzle.module.spec.ts > /tmp/impl-238-file.log 2>&1; echo "exit=$?"
grep -E '^(Test Suites|Tests):' /tmp/impl-238-file.log
```

Formato `--write`: exit=0; ambos archivos `unchanged`.
Formato `--check`, eslint y tsc: exit=0.
Resultado del fichero:

```text
exit=1
Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
```

Solo cae
`#238 R1: an error emitted by PG_POOL is logged with Logger.error and does not throw`.
La aserción es `expect(() => pool.emit('error', error)).not.toThrow()`.
Se recibe un `Error` cuyo mensaje comienza por
`Unhandled error. (Error: terminating connection due to administrator command`.
No hay error de importación, `ReferenceError` ni error de tipos.

**Diferencia que obliga a parar:** el handoff y la spec exigen que el rojo
imprima `Expected the function not to throw an error.`. El log real no
contiene esa frase: imprime `expect(received).not.toThrow()` seguido del
error recibido. Aunque el código de salida y las cuentas coinciden, el
handoff §Reglas críticas ordena: «Si una cifra, ancla o salida no coincide
con la que dan tasks.md o este handoff, PARA y anota la diferencia. No
ajustes la cifra». No se interpreta otra salida como equivalente ni se
modifica la spec aprobada.

Comprobación del literal ausente:

```sh
grep -cF "Expected the function not to throw an error." /tmp/impl-238-file.log; echo "grep_exit=$?"
```

```text
0
grep_exit=1
```

Log completo del rojo, conservado aquí antes de borrar el temporal:

```text
FAIL src/db/drizzle.module.spec.ts
  ● #238: PG_POOL logs idle client errors instead of crashing › #238 R1: an error emitted by PG_POOL is logged with Logger.error and does not throw

    expect(received).not.toThrow()

    Error name:    "Error"
    Error message: "Unhandled error. (Error: terminating connection due to administrator command

      61 |     const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
      62 |     const pool = moduleRef.get<Pool>(PG_POOL);
    > 63 |     const error = new Error(
         |                   ^
      64 |       'terminating connection due to administrator command',
      65 |     );
      66 |

      at Object.<anonymous> (db/drizzle.module.spec.ts:63:19)
            61 |     const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
            62 |     const pool = moduleRef.get<Pool>(PG_POOL);
          > 63 |     const error = new Error(
               |                   ^
            64 |       'terminating connection due to administrator command',
            65 |     );
            66 |
      at Object.<anonymous> (db/drizzle.module.spec.ts:63:19)
      at db/drizzle.module.spec.ts:68:25
      at Object.<anonymous> (../node_modules/.pnpm/expect@30.4.1/node_modules/expect/build/index.js:1824:9)
      at Object.throwingMatcher [as toThrow] (../node_modules/.pnpm/expect@30.4.1/node_modules/expect/build/index.js:2235:93)
      at Object.<anonymous> (db/drizzle.module.spec.ts:68:51)
      at Object.<anonymous> (db/drizzle.module.spec.ts:68:51)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
Snapshots:   0 total
Time:        0.959 s, estimated 1 s
Ran all test suites matching src/db/drizzle.module.spec.ts.
```

## Commits, pasos restantes y esperas

No se creó ningún commit: el PARA se produjo antes del commit rojo
`test(backend-pg-pool-error-listener): PG_POOL error is logged and does not throw (R1)`.
HEAD sigue en H0 (`3298a0a96438a468293e70c9d2f375f5da4c7520`).
No hay hashes de implementación ni de cierre que reportar.

No se ejecutaron el verde R1, M1, M2, las cuentas finales de R1 ni R2:
dependen de superar el rojo con la salida exigida. No se editó
`traceability.md`, pues el handoff reserva su edición al cierre de la cadena.

No se ejecutó ninguna suite unitaria completa. Por tanto no hubo ninguna
corrida que requiriera la espera de §Esperas; los dos tests de fichero
(T0 y rojo) están exentos expresamente. No se ejecutó `./init.sh` ni se
mataron procesos. No hubo timeouts. La denegación al limpiar temporales
queda registrada en §Limpieza.

Para reanudar, el leader necesita resolver explícitamente la diferencia
entre el diagnóstico literal exigido y el diagnóstico real de Jest.

## Test candidato conservado para revisión

Este es el diff exacto que produjo el rojo. No se commiteó; se restauró
el fichero de test a HEAD para dejar limpio `backend-pet-tracker/`.

```diff
diff --git a/backend-pet-tracker/src/db/drizzle.module.spec.ts b/backend-pet-tracker/src/db/drizzle.module.spec.ts
index ffa4f80c..a937b33b 100644
--- a/backend-pet-tracker/src/db/drizzle.module.spec.ts
+++ b/backend-pet-tracker/src/db/drizzle.module.spec.ts
@@ -1,8 +1,10 @@
+import { Logger } from '@nestjs/common';
 import { Test, TestingModule } from '@nestjs/testing';
 import { ConfigService } from '@nestjs/config';
 import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
+import type { Pool } from 'pg';
 import { DrizzleModule } from './drizzle.module';
-import { DRIZZLE } from './drizzle.constants';
+import { DRIZZLE, PG_POOL } from './drizzle.constants';
 
 describe('R4: DrizzleModule exposes a Drizzle client under the DRIZZLE token', () => {
   let moduleRef: TestingModule;
@@ -33,3 +35,44 @@ describe('R4: DrizzleModule exposes a Drizzle client under the DRIZZLE token', (
     expect(typeof db.execute).toBe('function');
   });
 });
+
+describe('#238: PG_POOL logs idle client errors instead of crashing', () => {
+  let moduleRef: TestingModule;
+
+  beforeAll(async () => {
+    moduleRef = await Test.createTestingModule({
+      imports: [DrizzleModule],
+    })
+      .overrideProvider(ConfigService)
+      .useValue({
+        get: (key: string) =>
+          key === 'DATABASE_URL'
+            ? 'postgresql://pet_tracker:pet_tracker@localhost:5432/pet_tracker'
+            : undefined,
+      })
+      .compile();
+  });
+
+  afterAll(async () => {
+    await moduleRef.close();
+  });
+
+  it('#238 R1: an error emitted by PG_POOL is logged with Logger.error and does not throw', () => {
+    const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
+    const pool = moduleRef.get<Pool>(PG_POOL);
+    const error = new Error(
+      'terminating connection due to administrator command',
+    );
+
+    try {
+      expect(() => pool.emit('error', error)).not.toThrow();
+      expect(errorSpy).toHaveBeenCalledTimes(1);
+      expect(errorSpy).toHaveBeenCalledWith(
+        'Idle client error: terminating connection due to administrator command',
+        error.stack,
+      );
+    } finally {
+      errorSpy.mockRestore();
+    }
+  });
+});
```

## Limpieza

Se restaura solo el test añadido en esta sesión. Producción no se modificó.
Se comprobó que el módulo y el test coinciden con HEAD:

```sh
git diff --quiet HEAD -- backend-pet-tracker/src/db/drizzle.module.ts backend-pet-tracker/src/db/drizzle.module.spec.ts; echo "exit=$?"
git status --short -- backend-pet-tracker specs
```

```text
exit=0
```

La segunda orden no imprimió nada. `git status --short --branch` mostró
únicamente el reporte sin seguimiento, y `git log -1 --oneline` confirmó H0.

**Segundo PARA, durante la limpieza:** se intentó borrar los temporales con
`rm -f /tmp/impl-238-file.log /tmp/impl-238-unit.log`. La revisión automática
rechazó el comando antes de ejecutarlo:

```text
rm -f style commands are not permitted. Use a safer approach
```

El handoff §Reglas críticas exige: «Si el sandbox te deniega un comando,
PARA y repórtalo». No se intentó otra vía de borrado tras esa denegación.
`/tmp/impl-238-file.log` queda pendiente de borrar por el leader; esta sesión
no creó `/tmp/impl-238-unit.log`. El log del rojo está copiado íntegro arriba.

El reporte y el marcador `.done` quedan sin commit para que el leader
reciba el bloqueo; no se hace push ni se abre o edita ninguna PR.

