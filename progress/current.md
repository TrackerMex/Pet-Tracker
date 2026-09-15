# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #72 — mobile-add-pet-photo-test-flake (P2)

- **Rama**: `feature/72-mobile-add-pet-photo-test-flake`, creada desde `origin/main` en 9c3dcab6 (merge de #137, cierre de #97).
- **Sesion**: Frontend. La sesion Backend trabaja en su worktree `Pet-Tracker-wt-backend`; la suite movil es jest puro y no toca Postgres ni LocalStack, asi que la reproduccion del flake no colisiona con sus puertos. Lo que si colisiona es `./init.sh` completo: coordinar antes de correrlo.
- **Estado**: `pending`, sin spec. Lanzado el `explorer` el 2026-09-15 para reproducir el flake y localizar la causa antes de encargar la spec.

### Por que explorer antes que spec_author

El primer criterio de aceptacion exige identificar la causa raiz **con evidencia, no una hipotesis**. De los dos tests afectados solo uno tiene mecanismo localizado:

- `src/screens/alerts/index.test.tsx` — carrera entre la cache de TanStack Query y el render: el `waitFor` espera a `queryClient.getQueryData(...)` y la asercion de DOM que le sigue es sincrona. Localizado desde la corrida de CI del PR #132, que fallo sin tocar una linea de codigo.
- `src/screens/add-pet/index.test.tsx` — sin explicar. El mock de `launchImageLibraryAsync` devuelve `undefined` pese a un `beforeEach` que hace `mockReset()` y luego `mockResolvedValue({ canceled: true, assets: null })`. Esa contradiccion es el nucleo de la investigacion.

La pregunta que decide la forma de la spec es si son dos causas distintas o una sola de aislamiento entre suites.

### Aviso para la spec

`src/screens/alerts/index.test.tsx` lo acaba de tocar #97 (merge 9c3dcab6). Todo numero de linea del historico de la feature es anterior a ese merge y hay que reapuntarlo contra HEAD antes de citarlo en la spec.
