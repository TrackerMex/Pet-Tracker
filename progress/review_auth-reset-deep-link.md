# review: auth-reset-deep-link (#59)
Fecha: 2026-09-03
Veredicto: APROBADO

Revisado sobre `feature/59-auth-reset-deep-link` @ `bb8660a` (working tree
limpio antes y después de la revisión). Feature mixta backend + móvil +
`hosting/` estático. Excepciones autorizadas consideradas: Adenda 1 del
handoff (`11fed77`), R11 como caracterización (autorización humana registrada
en el impl report) y edición mecánica de `env-drift.test.mjs` 23→24
(`08150eb`, precedente #58 `6564994`). Skills `expo:expo-overview` y
`expo:expo-router` cargadas antes de juzgar la parte móvil.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: #59 auth-reset-deep-link;
      #58 done)
- [x] progress/current.md describe la sesión activa de #59

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure — `domain/` y `application/` del
      backend con CERO diff en `37d0c8b..bb8660a` (lista de ficheros del
      diff verificada); el helper nuevo `password-reset-link.ts` vive en
      `infrastructure/email/`
- [x] repositories/contratos en domain son interfaces puras (sin cambios;
      los dos adaptadores siguen implementando `PasswordResetSender` del
      puerto de domain)
- [x] application depende de interfaces, no implementaciones (CERO diff)
- [x] infrastructure sin lógica de negocio: composición de URL + copy del
      correo en los adaptadores; el `useFactory` de `auth.module.ts` solo
      pasa `RESET_LINK_HOST` (`?? ''` a Resend, `?? null` a consola),
      exactamente lo que fija R3/D11

## Checklist C4 — TDD
- [x] Cada R1–R12 tiene al menos un test que lo nombra, con sufijo
      `(auth-reset-deep-link)` en los 5 ficheros compartidos (H5):
      verificado por grep sobre los 8 ficheros de test
- [x] Historial test-primero por requisito, rojo antes que verde:
      R1 (030076c→e0dfff8), R2 (4b816e7→ada573c), R3 (d433535→0a96192),
      R9 (837ad2f→9ba7e93), R10 (0039189→243fcc6), R4 (805bf65→5877535),
      R7 (e729bf4→6139108), R5 (0ad7139→56ea5d6), R6 (158e256→b93c938),
      R8 (99215cf→c1ace87), R12 (9ea6437→c3b5451). Cada commit rojo toca
      SOLO ficheros de test + el impl report (verificado con
      `git show --stat` de los 11 rojos); cada verde toca solo producción
      más las ediciones de test explícitamente permitidas (ver C5/impl)
- [x] R11 verde directo (`1b4bce7`) — excepción de caracterización
      autorizada por humano: pinnea una propiedad ya cumplida, sin fallos
      artificiales ni cambio runtime. Conforme a lo autorizado
- [x] El impl report registra la salida roja literal de cada requisito
- [x] Ajuste de mocks dentro del verde de R5 (`56ea5d6`) inspeccionado:
      corrige el hoisting del factory de `jest.mock` al patrón
      `jest.mocked(...)` del repo y representa la ausencia de param como
      `{}`; ninguna aserción debilitada

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" en la tabla R→test→commit
      (R1–R12 completas)
- [x] Hashes y mensajes de las 12 filas cotejados uno a uno contra
      `git log --oneline 37d0c8b..bb8660a`: coinciden literalmente
- [x] Commits siguen `test|feat|docs|style(auth-reset-deep-link): <desc> (R<n>)`
      (el ajuste de harness usa scope `harness`, como su precedente de #58)
- [x] Nombres de describe copiados literalmente de requirements.md

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved`, casilla humana marcada
      (2026-09-02) y D5 aceptada explícitamente
- [x] Ningún fichero de spec modificado tras la aprobación humana
      (`5d1a62f`) salvo el paso de frontmatter del leader (`b7ba229`) y
      `traceability.md` (permitido). Los dos bloqueos de spec (R3, R11) se
      resolvieron por handoff/autorización, sin editar la spec

## Checklist C7 — Sin código huérfano
- [x] El único artefacto de #58 que esta feature invalida a propósito — el
      assert `not.stringContaining('http')` del describe R1 de
      `resend-password-reset-sender.spec.ts` — fue eliminado en el mismo
      commit que implementa R1 (`e0dfff8`), como exige la allowlist 12
- [x] N/A en lo demás — la feature no reemplaza componentes ni módulos

## Checklist C8 — UI móvil conforme a la carta
- [x] Grep-clean sobre el código nuevo de `mobile-pet-tracker/src/`
      (ruta, pantalla, api): cero hex, cero clases arbitrarias, cero
      `StyleSheet.create`, cero shadow/elevation legacy (los `[...]` del
      grep son destructuring de `useState`, no clases). Los hex de
      `hosting/*.html` son web estática fuera del alcance de la carta
- [x] Estructura oficial: route delgado `src/app/reset-password.tsx`
      (5 líneas, nivel raíz, fuera de `(auth)`/`(tabs)` como exige D6 para
      que ningún `<Redirect>` se coma el token) + pantalla en
      `src/screens/reset-password/index.tsx` con test colocado; kebab-case
      y token vía `useLocalSearchParams<{ token?: string }>()` — conforme a
      Expo Router y a conventions.md
- [x] heroui-native (`TextField`/`Input`/`Button`/`LinkButton`), tokens
      (`bg-background`, `text-danger`, `bg-accent`), mensajes `selectable`
      (assertado en test), botón deshabilitado en vuelo
- [x] Layout `flex-1 justify-center gap-4 bg-background p-6` — patrón
      literal de `login.tsx` que D7 fija (misma familia auth, sin insets,
      igual que login); sin animaciones nuevas ni estados de carga de datos
      (no hay red al montar, por diseño), Skeleton N/A

## Comprobaciones específicas del encargo

1. **Propiedad de seguridad — ningún GET consume el token**:
   - Backend: único handler es `@Post('reset-password')`
     (`auth.controller.ts:155`, sin diff en la feature); ningún `@Get` bajo
     ese path en todo `src/`.
   - e2e R11 REPRODUCIDO por el reviewer:
     `pnpm -C backend-pet-tracker run test:e2e -- --runInBand
     test/auth-reset-deep-link.e2e-spec.ts` → 1 passed. El test hace 3
     `GET /v1/auth/reset-password?token=…` → 404, primer POST → 200,
     segundo POST → 400.
   - Pantalla: test R6 asserta `resetPassword` NO llamado al montar y
     exactamente 1 llamada tras submit; el código no tiene efectos ni
     loaders de red — el único camino a `resetPassword` es el handler de
     `reset-submit`.
   - Página fallback: leída completa — solo `URLSearchParams` sobre
     `location.search`, href `mobilepettracker://` construido con
     `encodeURIComponent`, CSP `default-src 'none'` inline, sin
     fetch/XHR/sendBeacon/form remoto/recursos externos.
   - **Mutación (revertida)**: inyectado un `fetch("https://evil.example/…")`
     en `index.html` → el test R10 falló (1 failed); fichero restaurado y
     árbol limpio. El test de seguridad muerde.

2. **Token pelado como 2º párrafo** (restricción `sanitize`,
   `resend-client.ts:140`, fichero SIN diff): el `text` se construye con
   `join('\n')` y separadores `''` → el token queda como párrafo índice 1
   del split `/\r?\n\r?\n/`; la URL va en párrafo posterior. El test R1
   nuevo asserta exactamente eso con el mismo regex de `sanitize`
   (`paragraphs[1] === token`, URL en `paragraphs.slice(2)`). Suites de #58
   (resend/console/module/guard/e2e delivery) verdes dentro de init.sh.

3. **Contención R12**: el grep literal de la spec sobre `main...HEAD`
   devuelve exactamente los 3 ficheros de las excepciones autorizadas
   (`auth.controller.spec.ts`, `auth-email-delivery.e2e-spec.ts`,
   `env-drift.test.mjs`); incorporándolos, vacío. Diffs de los 3
   inspeccionados línea a línea: los dos primeros contienen SOLO el segundo
   argumento `'reset.test'` en las construcciones señaladas por la
   Adenda 1; el tercero SOLO `assert.equal(keys.length, 23)` → `24`.
   `RESET_LINK_HOST=` vacía en ambos `.env.example` con comentario de host
   pelado; escaneo de secretos y dominios reales sobre el diff completo
   `37d0c8b..bb8660a` → cero hallazgos nuevos (los aciertos de
   `JWT_SECRET` son el valor fijo de desarrollo preexistente; los hosts de
   test usan TLDs reservados `.test`). Prohibidos intactos:
   `resend-client.ts`, `auth.controller.ts`, `email-rate-limit.guard.ts`,
   `*email-verification*`, `app.json`, `forgot.tsx`, `infra/`, `domain/`,
   `application/` — ninguno en el diff.

4. **assetlinks.json**: un único statement,
   `package_name: com.trackermex.pettracker` == `android.package` de
   `app.json` (el test R9 los compara leyendo ambos del disco), fingerprint
   único con el placeholder literal `REPLACE_WITH_DEV_BUILD_SHA256`.
   `hosting/README.md` mapea fichero→ruta sin dominio real.

5. **R4 / App Links**: `app.config.ts` inyecta exactamente un intent filter
   `{autoVerify, VIEW, https + host + pathPrefix /reset-password,
   BROWSABLE/DEFAULT}` con host trimmed, preservando `app.json`
   (`toMatchObject` en el test); sin variable: un único `console.warn` que
   nombra `RESET_LINK_HOST` y `docs/verification.md`, sin lanzar y sin
   filtros (3 casos: ausente/vacía/espacios). Las ramas Maps y App Links
   quedaron independientes; con ambas variables ausentes las advertencias
   se agrupan en una sola llamada a `console.warn` — conserva el contrato
   de advertencia única de ambas features (pinneado en tests).

6. **Adenda 1 respetada**: las dos ediciones heredadas van dentro del verde
   de R3 (`0a96192`) junto con la línea autorizada de `RESET_LINK_HOST` en
   el doble de config del describe R3 de #58 (allowlist 16). En
   `resend-password-reset-sender.spec.ts` el describe R7 de #58 también
   recibe el segundo argumento del ctor — edición mecánicamente obligada
   por el ctor de 2 args y cubierta por la allowlist 12 («se pasa el ctor
   nuevo»); ninguna aserción de #58 cambió salvo la eliminación autorizada.

7. **Docs de cierre (R12)**: `docs/verification.md` §Feature 59 con G1–G4
   paso a paso y `keytool -list -v`; fila `RESET_LINK_HOST` en
   `docs/conventions.md`; fila `hosting/` en la tabla-mapa de `AGENTS.md`.
   Todo además assertado por el describe R12 de `hosting-artifacts.test.ts`.

## Gates humanos G1–G4 — PENDIENTES (bloquean el cierre, no este veredicto)

La tabla de `specs/auth-reset-deep-link/traceability.md` mantiene G1–G4 en
"pendiente" y es el estado CORRECTO: fingerprint del dev build, subida de
`hosting/` a Hostinger, `RESET_LINK_HOST` en los dos `.env` y smoke en dev
build de Android siguen sin ejecutar. Este veredicto aprueba la
implementación automática R1–R12; la feature NO puede pasar a `done` hasta
que el humano cierre los cuatro gates.

## Observaciones (no bloqueantes, para el cierre del leader)

- Casillas de `specs/auth-reset-deep-link/tasks.md` sin marcar (cosmético,
  igual que en #58; el historial las cubre).
- `STATUS.md` desactualizado (51/57 declarado vs 54/59 real) — advertencia
  preexistente de init.sh; actualizar al cerrar la sesión.
- El `.env` local sigue sin `RESEND_API_KEY`, `RESEND_FROM` ni
  `RESET_LINK_HOST` — comportamiento esperado (env-drift avisa; G3 pondrá
  el host real fuera del repo).
- La instalación local del plugin Expo de Codex era 1.0.2 sin
  `expo-overview`; el implementer lo suplió con las skills equivalentes
  disponibles y lo documentó. Considerar actualizar el plugin de Codex
  antes de la próxima feature móvil.

## Output de ./init.sh (ejecutado por el reviewer, exit 0)

```
✅ Build exitoso
backend:  Test Suites: 163 passed, 163 total | Tests: 1235 passed, 1235 total
infra:    Test Suites: 2 passed, 2 total    | Tests: 14 passed, 14 total
harness:  tests 28 | pass 28 | fail 0
mobile:   Test Suites: 53 passed, 53 total  | Tests: 612 passed, 612 total (1 snapshot)
e2e:      Test Suites: 3 skipped, 25 passed, 25 of 28 total
          Tests: 8 skipped, 353 passed, 361 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
Features: 54/59 completadas | 4 pendientes
EXIT: 0
```

Corridas adicionales del reviewer:
- `bun run test` en `mobile-pet-tracker/` → 53 suites, 612 tests, verde.
- `pnpm -C backend-pet-tracker exec tsc --noEmit` → exit 0.
- e2e R11 en aislamiento (`--runInBand`) → 1 passed.
- Mutación R10 (fetch inyectado en la página fallback) → test falla;
  revertida, árbol limpio en `bb8660a`.
