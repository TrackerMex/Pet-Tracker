# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

- **feature**: #73 `pet-online-pill` (P3, `pending`)
- **inicio**: 2026-09-13
- **sesion**: Backend (asignada por el humano via la sesion Frontend, que arranca #91 en el tree principal)
- **worktree**: `/home/claude/sites/Pet-Tracker-wt-backend`, branch `feature/73-pet-online-pill` desde `origin/main` `072cff40`
- **plan**:
  1. `explorer` → `progress/explore_pet-online-pill.md` (decision G abierta: ultimo ping vs pestillo; umbral de silencio sin definir; el pestillo `connectivity: 'online'` de `ingestion.drizzle.store.ts:97` nunca vuelve a otro valor)
  2. `spec_author` → `specs/pet-online-pill/` → `spec_ready`
  3. PARA hasta firma humana en `requirements.md` (flujo por commit en branch, main protegida)
  4. Handoff a Codex CLI; avisar a la sesion Frontend antes de que Codex toque `mobile-pet-tracker/`
- **coordinacion**: Postgres de docker compartido; avisar por SendMessage antes de cada `init.sh`/e2e
- **hecho 2026-09-13**: `init.sh` verde en el worktree (backend 25 suites/362 tests, movil 73 suites/1230). `explorer` entregado en `progress/explore_pet-online-pill.md`: pestillo confirmado (unico escritor `ingestion.drizzle.store.ts:97`, nadie lo apaga); umbral inexistente en backend, el mapa ya usa `STALE_SECONDS = 120`; `files_affected` de #73 citaba el route delgado `home.tsx` (la Home vive en `src/screens/home/index.tsx`). Recomendacion A2 (derivar en lectura desde `last_message_at`, borrar el write). `spec_author` lanzado con G1=A2, G2=300 s (alternativa 120 s), G4 mapa intacto, G5 tres estados, G6 prop del hero, G7 anatomia sin pulso.
