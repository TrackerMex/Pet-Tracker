# Signcheck — infra-prod-region-stack (#246)

Read-only audit of spec commit `3cc9c49c` on `feature/246-infra-prod-region-stack`,
worktree `/home/claude/sites/Pet-Tracker-wt-246`. Date 2026-11-06.

**FAIL count: 2**

1. §2a: tasks.md:643, Cierre step 3. The synth runs without `CDK_DISABLE_CLI_TELEMETRY=true`, so the CDK CLI sends telemetry over the network. This breaks the no-network rule at tasks.md:30.
2. §7: tasks.md:189. `secretsReadBy` drops `GetSecretValue` resources it cannot classify. An exec-role grant on `*` or on `pet-tracker/prod/*` passes R10, R14 and R16 (measured exit 0), although requirements.md:203, :248 and :268 say the role reads «exactamente» its secrets.

Notes, not FAIL:
- the TableV2 deprecation warnings are missing from the expected noise at tasks.md:50-52;
- S3 has no deletion-protection property, and DT9 treats Retain plus versioning as the equivalent;
- the Cierre step 6 docs sentence will miss the R10 test file;
- the base suite took 18 s, against the «~30 s» that tasks.md states;
- the leader's premise of an explicit env account is wrong, because the stack is account-agnostic.

Sections below are in the order they were checked.

## 9. Existing infra suite at the base — PASS

Command from tasks.md §Comandos, run from `infra/`, log in the scratchpad (not `/tmp`):

```
cd /home/claude/sites/Pet-Tracker-wt-246/infra
FORCE_COLOR=0 pnpm exec jest > <scratch>/base-jest.log 2>&1; echo "exit=$?"
exit=0
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
```

Took 18 s of wall time. That matches tasks.md §Cuentas de tests: «Hoy la suite de infra tiene 2 suites y 14 tests».
`grep -c W3010` on the log gives 0 at the base, as expected: the dev stack has no fixed AZs.
The suite makes no AWS or network calls (in-memory `Template.fromStack` only).

Synth at the base, using the env prefix from Cierre step 3 plus `CDK_DISABLE_CLI_TELEMETRY=true`, with `-o` pointed at the scratchpad so nothing is written to the tree:
`exit=0`, `dev-ok`, `ls … | grep -c '^PetTrackerProd'` = `0`. The anchors in Cierre 3 hold at the base.


## 2a. No step or test touches real AWS or the network — FAIL

- The tests are in-memory (`Template.fromStack`, `app.synth()`). There is no `aws` call, no deploy, bootstrap or diff, and no lookup. PASS for the tests.
- **FAIL: Cierre step 3** (tasks.md:643) runs `pnpm run synth`, which is the CDK CLI 2.1135.1. Its env prefix has `CDK_DISABLE_VERSION_CHECK=1` but **not** `CDK_DISABLE_CLI_TELEMETRY`. The CLI then sends anonymous telemetry to `https://cdk-cli-telemetry.us-east-1.api.aws/metrics`:
  - `infra/node_modules/aws-cdk/lib/cli/io-host/cli-io-host.js:167-168` sets up the endpoint and gates it with `canCollectTelemetry(args, context)`.
  - `infra/node_modules/aws-cdk/lib/cli/telemetry/collect-telemetry.js:7-11` lets only three things disable it: `CDK_DISABLE_CLI_TELEMETRY=true|1`, context `cli-telemetry=false`, or a CLI arg.
  - `infra/cdk.json` has `"versionReporting": false`. That is the metadata resource, not CLI telemetry, and the telemetry check reads `argv`.
  - Nothing else disables it: there is no `~/.cdk.json` and no `cdk.context.json`.

  This contradicts tasks.md:30, which says «`docker build`, `docker run` y cualquier acceso a la red» are prohibited.
  Fix: add `CDK_DISABLE_CLI_TELEMETRY=true` to the env prefix of Cierre step 3. Alternatively, put `"cli-telemetry": false` in context, but `cdk.json` is frozen by the spec, so the env var is the fix.
  I ran the base synth with that variable added, so this audit made no network call.

## 3a. docs/conventions.md anchor (Cierre step 6) — PASS

```
cd /home/claude/sites/Pet-Tracker-wt-246/infra
grep -cF 'Junto con `.env.example` es el único sitio del repo con el literal del modelo' ../docs/conventions.md   -> 1   (expected 1)
grep -cF 'y `infra/lib/pet-tracker-prod-stack.ts` (entorno del contenedor `api` en producción, #246)' ../docs/conventions.md   -> 0   (expected 0 before the edit)
```

## Prototype used for items 3, 5 and 7

I needed evidence for items 3, 5 and 7, so I wrote a prototype of the design in the scratchpad, outside the repo:
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/514dba8a-c290-4329-b2f8-7d88945d9888/scratchpad/proto/proto.js`.
It uses the design §Ids de construct, DT1–DT15 and the PROPS of design §Props de prueba.

A checker, `.../scratchpad/proto/check.js`, re-implements the helpers of tasks.md §Helpers and the assertions of every R3–R19 `it`.
It ran with `TMPDIR` and `outdir` both in the scratchpad and with `CDK_DISABLE_CLI_TELEMETRY=true`. Nothing was deployed and nothing was written to the repo.

```
MUT= node check.js > run0.log 2>&1; echo "exit=$?"   -> exit=0, fails=0
```

Every value the requirements state matches the synthesized templates of `mx-central-1` and `us-east-2`. That covers:
- Counts: 3 `Route`, 2 gateway `VPCEndpoint` with 6 `RouteTableIds` each, 6 subnets on `<r>a/b/c`, 1 `Secret`, 0 `KMS::Key`, 2 `Listener`, 8 `Alarm`, 5 `ecs-tasks` roles (5 `IAM::Role` in total), 1 Docker image source on `linux/amd64`.
- The `GlobalTable` `Replicas` shape, with `SSESpecification` absent.
- The bucket name `Fn::Join` and its exact lifecycle rule `{ExpiredObjectDeleteMarker, NoncurrentVersionExpiration{30}, Status}`.
- Aurora: `MasterUserPassword` resolves through the secret, `PromotionTier` 0 and 1 on AZs `a` and `b`, the secret is `Retain`, and the cluster is `Snapshot`.
- `PGPASSWORD` `ValueFrom` = `Fn::Join ['', [{Ref: <attachment>}, ':password::']]`.
- `secretsReadBy` for api, workers and ops.
- The R11 and R15 statements are exact.
- The DB ingress port is `Fn::GetAtt [Db, Endpoint.Port]`.
- The ops TD has no `TaskRoleArn`.
- The R18 dimensions.
- The R19 output values.

The checker's output also confirmed two things that tasks.md handles correctly:
- The api `DeploymentConfiguration` has an extra `Alarms` key. tasks.md:392-395 compares field by field.
- The pattern adds 2 outputs of its own (`ApiLoadBalancerDNS…`, `ApiServiceURL…`). tasks.md:600 does not pin the full list.

Warnings printed during synth:
- `W3010` ×8 per region (6 subnets and 2 DB instances), as design §Incertidumbres says.
- Also 2 jsii deprecation lines per `TableV2` built: `[WARNING] aws-cdk-lib.aws_dynamodb.TableGrantsProps#encryptedResource is deprecated` and `…#policyResource is deprecated`. A bare `new TableV2(...)` also prints them (`scratchpad/proto/tv2.js`: 2 lines), so they come from inside aws-cdk-lib 2.263.0 and not from the design. tasks.md:50-52 lists only W3010 as expected noise. NOTE (not FAIL): add the deprecation lines there so Codex does not try to "fix" them.

## 1. Checklist of plan_canvas-parity-2026-10-23.md §4 (Checklist de firma delegada)

- Anchors exist and none depends on a line number — **PASS**.
  - The only `grep -cF` anchors are in Cierre step 6, and they give `1` and `0` (§3a).
  - No anchor in tasks.md or design.md uses a line number. `grep -nE 'línea [0-9]|:[0-9]{2,3}\b'` over both finds only times and ports.
  - The file and symbol premises hold at the base, run from `infra/`:
    - `lib/build-app.ts`, `lib/pet-tracker-prod-stack.ts` and `test/fixtures` are absent, so R1 and R3 create them.
    - `grep -cF 'new PetTrackerDevStack' bin/app.ts` = 1 and `grep -cF 'buildApp(new App())' bin/app.ts` = 0. The third R1 `it` is red by assertion at the base.
    - `grep -cF 'export const DEV_REGION' lib/pet-tracker-dev-stack.ts` = 1.
    - Every constant group design.md:69-71 names is exported by `backend-pet-tracker/src/aws/constants.ts`: lines 9-54.
- Every R-id has a named test and a traceability row — **PASS** (see §4).
- Locks are not tautological — **PASS** (see §5).
- New classes counted against the charter guards (`design-drift`, `legibility-classnames`, `ui-copy-table`, `SCREEN_FILES`) — **n/a**. This is infra only.
- Copy literal from the R-id, in Voz B — **n/a**.
- Artboards frozen in `specs/<feature>/canvas/` — **n/a**.
- No open decision — **PASS**.
  - The human answered D2 and D4, the gates "Antes de firmar #246": they are checked on 2026-11-06 at progress/plan_produccion-aws-2026-11-06.md:213-221, and the spec follows them: no NAT, public subnets; `SIM_MODE=false`, `PUSH_ENABLED`, `EMAIL_ENABLED` and `ANTHROPIC_ENABLED` `true`.
  - D1 is checked, and the spec creates the certificate and the alias record as D1 says.
  - Design §Incertidumbres (design.md:472-493) lists assumptions that GA3 will confirm: the AZ letters, SSE-SQS, `max_connections`. None is a choice left to Codex.
- No undeclared new cost or dependency — **PASS**.
  - Dependencies: see §8.
  - Cost: no step of tasks.md creates billable resources. The fixed Fargate cost was accepted in plan §1 (plan_produccion-aws-2026-11-06.md:33) and is incurred only at GA3, by the human.

## 2b. No secret values, only names — PASS

```
grep -nE 'sk-ant|AKIA[0-9A-Z]{12}|re_[A-Za-z0-9]{10}|eyJ[A-Za-z0-9]{10}|SecretString[^T]|secretStringValue|unsafePlainText|fromSecretAttributes|SecretValue\.' specs/infra-prod-region-stack/*.md
```
The only hits are requirements.md:141 and :148-149 and tasks.md:363-364. They are the `{{resolve:…:SecretString:password::}}` dynamic reference and the assertion that `SecretString` is **absent**.

The only secret names are `pet-tracker/prod/{jwt,wialon-token,resend-api-key,anthropic-api-key}` (design.md:298-310).

The Aurora password is generated by `DatabaseSecret`. The checker confirmed `GenerateSecretString` and no `SecretString`. tasks.md:41-42 forbids writing values.

## 2c. Aurora, DynamoDB and S3 declare removalPolicy and deletion protection, each pinned by a named test — PASS (with a note on S3)

- DynamoDB (R6, `it('#246 R6: GlobalTable de una réplica, Retain y sin KMS')`):
  - `DeletionPolicy`/`UpdateReplacePolicy` `Retain`, and `Replicas[0].DeletionProtectionEnabled: true`.
  - Mutation 3 (DESTROY) is red in the prototype.
- Aurora (R8, `it.each(REGIONS)('#246 R8: Aurora de %s')`):
  - `DeletionProtection: true` and `DeletionPolicy`/`UpdateReplacePolicy` `Snapshot`.
  - The secret is `Retain`.
  - Mutation 8 is red in both regions.
- S3 (R7, `it.each(REGIONS)('#246 R7: bucket de %s')`):
  - `DeletionPolicy`/`UpdateReplacePolicy` `Retain` and `VersioningConfiguration` `Enabled`.
  - NOTE: S3 has no deletion-protection property. DT9 argues that `RETAIN` plus versioning stands in for it.
  - There is no S3 `DESTROY` mutation in Cierre step 5. The R7 assertion on `DeletionPolicy` covers it: the checker fails on any value other than `Retain`. `autoDeleteObjects` would need DESTROY.
  - The leader decides whether that equivalence satisfies plan §4 point 3.

## 3. Anchors with an expected output — PASS except 2a

| Anchor | Where | Measured | Expected |
|---|---|---|---|
| base suite | tasks.md:122 | 2 suites, 14 tests, exit 0 | «2 suites y 14 tests» |
| Cierre 3 `test -f … && echo dev-ok` | tasks.md:644 | `dev-ok` (base synth) | `dev-ok` |
| Cierre 3 `ls cdk.out \| grep -c '^PetTrackerProd'` | tasks.md:645 | `0` | `0` |
| Cierre 6 before | tasks.md:678 | `1` | `1` |
| Cierre 6 second grep before the edit | tasks.md:684 | `0` | `0` before, `1` after |
| `**Commit**` entries | tasks.md | `grep -c` = 42 | rev-list `42` (tasks.md:695) |
| Counts table | tasks.md:126-149 | `it` per block, counted from each block's `it(`/`it.each` (R2 has 4 cases, R4/R7/R8 have `it.each(REGIONS)` = 2) | sums to 36; 14 + 36 = 50 |

The red-check greps (tasks.md:63-68) and the Cierre step 1/2/4/5 checks apply to the future implementation, so they cannot be run now. The prototype's mutation results support step 5 (see §7).

## 4. R-id coverage — PASS

R1–R20 are each in requirements.md and in order.

Each has at least one named `it` in tasks.md:
- R1: 202, 207, 209
- R2: 229 (it.each, 4)
- R3: 257
- R4: 274
- R5: 295
- R6: 316
- R7: 336
- R8: 355
- R9: 376, 388, 400, 408
- R10: 423, 426
- R11: 446
- R12: 461
- R13: 477, 485
- R14: 500, 501
- R15: 515
- R16: 529, 536
- R17: 554
- R18: 569, 571
- R19: 597
- R20: 613

Each has a row in traceability.md:10-29, all `pendiente` as expected before implementation.

## 5. Tautology — PASS (one note)

- tasks.md:97-100 makes the tests use the literals of requirements.md, not `@backend/aws/constants`. Every assertion the checker reproduced compares against literals or against logical ids read from the same template, which is structural and not tautological.
- NOTE: R1 (tasks.md:204-206) compares `region` with `DEV_REGION`, which is imported from production. It is not blind: dev R14 pins `DEV_REGION` to the literal (`infra/test/pet-tracker-dev-stack.test.ts:316`: `expect(DEV_REGION).toBe('us-east-1')`). The `it` title also says `us-east-1`.
- R1 `BACKEND_IMAGE_DIRECTORY` is compared with `join(__dirname, '..', '..', 'backend-pet-tracker')`, which is computed independently.
- R20 compares with `'mx-central-1'`, a literal, not `PROD_PRIMARY_REGION`.

## 6. Synth needs no AWS — PASS

```
grep -nE 'fromLookup|valueFromLookup|Vpc\.fromLookup|HostedZone\.fromLookup|fromLookupBy|lookup' specs/infra-prod-region-stack/{design,tasks}.md
```
The only hits are prohibitions and rationale. design.md uses `HostedZone.fromHostedZoneAttributes` («sin lookup») and states that the synth is offline (design.md:459-460).

The caller's premise of "an explicit env account" does not hold.
- The design is account-agnostic on purpose: `env: { region }` with no `account` (design.md:51 `account?`, DT1 step 4, the `buildStack` helper at tasks.md:173).
- The account is the token `{ Ref: AWS::AccountId }` (the bucket name in R7). Explicit AZs replace the AZ lookup.
- The tests pass no account and need no credentials.
- The prototype synthesized both regions with no AWS environment variables or credentials.

## 7. Closing mutations — FAIL (one blind zone)

Each mutation was applied to the prototype and the checker re-run (`MUT=<n> node check.js`, exit measured without a pipe):

| n | Result | Failing checks |
|---|---|---|
| 1 | covered by R3 `apiexample.com` (the prototype R3 check throws for it) | R3 |
| 2 | exit=1 | R4 endpoints mx-central-1, us-east-2 |
| 3 | exit=1 | R6 (`'Delete' !== 'Retain'`) |
| 4 | exit=1 | R6 (`SSESpecification` present) |
| 5 | exit=1 | R7 us-east-2 only, as tasks.md says |
| 6 | exit=1 | R7 both regions |
| 7 | exit=1 | R7 both regions |
| 8 | exit=1 | R8 both regions |
| 9 | exit=1 | R9 docker (`linux/arm64`) |
| 10 | exit=1 | R9 lb (`'120' !== '60'`) |
| 11 | exit=1 | R10 env |
| 12 | exit=1 | R11 |
| 13 (both lines removed) | exit=1 | R16 ops TD, R16 roles (`6 !== 5`) |
| 13 with only `addPropertyDeletionOverride` kept | exit=1 | R16 roles (orphan role) |
| 13 with only `tryRemoveChild` kept | exit=1 | R16 ops TD: `TaskRoleArn` dangles to the removed role, and `Template.fromStack` does not reject it |
| 14 | exit=1 | R16 ops TD (`7 !== 30`) |

All 14 named mutations turn red on the requirement tasks.md names. Each half of mutation 13 is covered separately.

**FAIL — blind zone in `secretsReadBy` (R10, R14, R16).**
- Requirements R10 (requirements.md:203), R14 (:248) and R16 (:268) say the execution role «SHALL leer **exactamente**» its secrets.
- The helper at tasks.md:189 only labels a `Resource` that is the `SecretTargetAttachment` `Ref` or matches `/:secret:pet-tracker\/prod\/([a-z-]+)-\?{6}/`. Any other resource in a `secretsmanager:GetSecretValue` statement is silently dropped.
- Two widening mutations pass every test:
  ```
  MUT=x1  api exec role += GetSecretValue on "*"                                   -> exit=0, fails=0
  MUT=x2  api exec role += GetSecretValue on "arn:aws:secretsmanager:<r>:<acct>:secret:pet-tracker/prod/*"  -> exit=0, fails=0
  ```
- Fix: in `secretsReadBy`, map any `Resource` of a `GetSecretValue` statement that is neither the attachment `Ref` nor a regex match to a visible label, for example `JSON.stringify(resource)`. The `toEqual` then fails on a wildcard. Also add mutation 15 to Cierre step 5: GetSecretValue on `'*'` in the api execution role, which must fail R10.

Other blind zones considered and found covered, or harmless:
- A second `fromAsset` on the same directory is deduplicated by hash, so `dockerImageSources` = 1. Harmless: same image.
- Extra task-role grants are caught by the exact `statementsOf` comparison (R11, R15).
- Extra SG ingress is caught by the exact `ingressesTo` lists (R9, R13, R17).
- `deletionProtection: false` on the table or Aurora is caught by R6 `Replicas` and R8 `DeletionProtection`.
- A bucket `DESTROY` is caught by R7 `DeletionPolicy`.

## 8. New dependencies — PASS

tasks.md:39 and design.md:449 say «Sin dependencias nuevas». The imports the spec names are:
- `aws-cdk-lib` submodules, among them `aws-cdk-lib/cx-api` (tasks.md:186), `aws-cdk-lib/aws-ecr-assets` (`Platform`) and `aws-cdk-lib/assertions`;
- `constructs`;
- `node:path`.

All of them are covered by `infra/package.json`: `aws-cdk-lib` 2.263.0 and `constructs` are in dependencies. The prototype resolved every one of them from `infra/node_modules`. tasks.md:37 forbids touching `package.json` and the lockfile.

## 10. Internal contradictions — PASS

- The R-id order is R1..R20 in requirements, tasks (`## R<n>` ×20, in order) and traceability.
- There are 42 commit messages, in order: `test`/`feat` per R plus the 2 `docs` messages of Cierre. That equals tasks.md:146-147 («40 + 2») and tasks.md:695 (`42`).
- Every Refactor is «no previsto» (`grep -c` = 20).
- The construct ids in tasks.md (`OpsLogs`, `OpsTask`, `PositionsTable`, `MediaBucket`, `DbSecret`, the four `…Secret`, `AlarmTopic`, `ApiLogs`, `WorkersLogs`, `WorkersTask`, `HostedZone`) all appear in the design ids table (design.md:78-98).
- Paths agree across the three files: `infra/lib/build-app.ts`, `infra/lib/pet-tracker-prod-stack.ts`, `infra/test/build-app.test.ts`, `infra/test/pet-tracker-prod-stack.test.ts`, `infra/test/fixtures/backend-image/Dockerfile`.
- Counts agree: R16's 5 roles, R18's 8 alarms, R19's 6 outputs (with tasks.md:600 not pinning the full list), 2 suites growing to 4 (build-app at R1, prod-stack at R3).
- R20's context values (design.md:398-407) differ from PROPS, as the design intends.
- NOTE (minor): the Cierre step 6 sentence says `.env.example` and `infra/lib/pet-tracker-prod-stack.ts` are the only places in the repo with the model literal. `infra/test/pet-tracker-prod-stack.test.ts` (R10 `toEqual` with `ANTHROPIC_MODEL`) will also contain it, so the docs sentence will be inexact after the merge. It is not a test failure.
