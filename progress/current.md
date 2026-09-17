# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #72 — mobile-add-pet-photo-test-flake (P2)

- **Rama**: `feature/72-mobile-add-pet-photo-test-flake`, creada desde `origin/main` en 9c3dcab6 (merge de #137, cierre de #97).
- **Sesion**: Frontend. La sesion Backend trabaja en su worktree `Pet-Tracker-wt-backend`; la suite movil es jest puro y no toca Postgres ni LocalStack, asi que la reproduccion del flake no colisiona con sus puertos. Lo que si colisiona es `./init.sh` completo: coordinar antes de correrlo.
- **Estado**: `in_progress` desde el 2026-09-17. Spec firmada por el humano ese dia (commit 35573397), incluidas las dos decisiones D-A y D-B. Handoff a Codex CLI entregado; el implementador es Codex, no esta sesion.
- **Plan que implementa Codex**: R1 arregla el sitio reproducido de alerts haciendo que la espera termine en el arbol, con una viga de 200 ms en el notificador de query-core que vuelve el fallo determinista. R2 corrige los otros seis sitios del mismo patron (S2..S7) y prueba que siguen vivos con cinco mutaciones de produccion revertidas en el verde. R3 cierra el agujero de higiene del picker en profile. R4 introduce el invariante PICKER_MOCK_UNARMED para que el proximo rojo de add-pet diga que se rompio.
- **Verificacion**: Protocolo V (V0 recuento, V1 cinco corridas por fichero, V2 veinte corridas de la suite movil, V3 una de init.sh). V3 comparte Postgres y LocalStack con la sesion Backend: comprobar con pgrep antes de correrlo.

### Por que explorer antes que spec_author

El primer criterio de aceptacion exige identificar la causa raiz **con evidencia, no una hipotesis**. De los dos tests afectados solo uno tiene mecanismo localizado:

- `src/screens/alerts/index.test.tsx` — carrera entre la cache de TanStack Query y el render: el `waitFor` espera a `queryClient.getQueryData(...)` y la asercion de DOM que le sigue es sincrona. Localizado desde la corrida de CI del PR #132, que fallo sin tocar una linea de codigo.
- `src/screens/add-pet/index.test.tsx` — sin explicar. El mock de `launchImageLibraryAsync` devuelve `undefined` pese a un `beforeEach` que hace `mockReset()` y luego `mockResolvedValue({ canceled: true, assets: null })`. Esa contradiccion es el nucleo de la investigacion.

La pregunta que decide la forma de la spec es si son dos causas distintas o una sola de aislamiento entre suites.

### Aviso para la spec

`src/screens/alerts/index.test.tsx` lo acaba de tocar #97 (merge 9c3dcab6). Todo numero de linea del historico de la feature es anterior a ese merge y hay que reapuntarlo contra HEAD antes de citarlo en la spec.
