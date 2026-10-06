---
feature: mobile-sign-out-lands-on-welcome
id: 149
status: draft
tags: [harness, spec, mobile, navigation]
base: e002a4a5 (origin/main con #117)
---

# Diseño — #149 mobile-sign-out-lands-on-welcome

> Ver [[requirements]] para los requisitos y [[tasks]] para el orden. Rutas
> relativas a `mobile-pet-tracker/`.

## Decisión técnica

Una sola línea de producción: en `src/app/(tabs)/_layout.tsx`, la rama
`status === 'unauthenticated'` pasa de `<Redirect href="/login" />` a
`<Redirect href="/welcome" />`.

Por qué basta: todos los orígenes de `signOut` (13 ficheros, 17 llamadas, más
el 401 global de `src/providers/query-provider.tsx`) solo cambian `status`.

- Con una tab enfocada, el layout de tabs re-renderiza y redirige.
- Con un detalle enfocado, `Stack.Protected guard={status === 'authenticated'}`
  de `src/app/_layout.tsx` retira la pantalla, `(tabs)` queda arriba y su layout
  redirige.

`Redirect` de `expo-router` navega en `useFocusEffect`: solo dispara cuando `(tabs)` está enfocado. Por eso, con un detalle encima, el destino depende de que la guarda retire antes el detalle. El `Redirect` reemplaza la pila raíz. Con `/login` queda `['(auth)']`; con
`/welcome` queda `['welcome']`, una pantalla que ya existe bajo
`Stack.Protected guard={status !== 'authenticated'}` (#118 R3), así que la
guarda la permite sin sesión.

## Archivos afectados por capa

La app móvil no tiene capas domain/application/infrastructure en esta zona: es
navegación (capa de presentación, `src/app/`).

| Capa | Fichero | Cambio |
|---|---|---|
| Presentación (layout de rutas) | `src/app/(tabs)/_layout.tsx` | `href="/login"` → `href="/welcome"` (R1) |
| Test unitario | `src/app/(tabs)/__tests__/layout.test.tsx` | Renombrar y reapuntar un `it` (R1) |
| Test de integración de router | `src/app/__tests__/detail-stack.guard.test.tsx` | `describe` nuevo `#149 R2` (5 filas) y `#149 R3` (12 filas); reapuntar `#95 R3` |
| Test de integración de router | `src/app/__tests__/reminders-alerts-stack.navigation.test.tsx` | Reapuntar `#114 R2` |
| Test de inventario | `src/__tests__/design-drift.test.ts` | `describe` nuevo `#149 R4` (1 `it`) |

Sin cambios: `src/providers/auth-provider.tsx`, `src/providers/query-provider.tsx`,
los 13 llamadores de `signOut`, `src/app/_layout.tsx`, `src/app/index.tsx`,
`src/screens/welcome/index.tsx`, el catálogo de copy y `package.json`.

## Alternativas descartadas

- **`Redirect href="/"` y que `index` decida**: un salto más y un frame del
  splash de `index`; acopla el destino a otro fichero; y el arnés de
  `detail-stack.guard.test.tsx` pinta `index` como stub, así que R2/R3 no lo
  verían.
- **Navegar dentro de `signOut` o en cada llamador**: 17 sitios en lugar de
  uno, y `auth-provider` no tiene router.
- **`signOut(reason)` para mandar el 401 a login y el botón a welcome**: toca
  `auth-provider`, `query-provider` y las 17 llamadas; solo procede si el
  humano elige la alternativa de D1.
- **Un `Redirect` o `anchor` extra en la guarda de detalles**: innecesario; la
  guarda ya saca el detalle y el layout de tabs pone el destino.

## Evidencia (spike fuera del árbol)

Spike sobre `e002a4a5` con el arnés de `detail-stack.guard.test.tsx` copiado a
un directorio temporal (`bunx jest --roots <dir> --modulePaths $PWD/node_modules`).
Ningún fichero del árbol cambió.

- Con el layout de tabs clonado y `href="/welcome"`: las 5 filas de tab y las
  12 de detalle (más la re-entrada con `router.push`) pasan, con pathname
  `/welcome` y pila `['welcome']`.
- Con el layout real (`href="/login"`): 17 filas caen **por aserción**,
  `Expected: "/welcome"`, `Received: "/login"`.
- `#95 R3` y `#114 R2` reapuntados a welcome pasan con el layout clonado.
- Deep link en frío a un detalle sin sesión: pathname `/`, pila `['index']`.

### Hallazgo que la implementación debe respetar: `await app`

En RNTL 14 `render` devuelve una promesa, y `renderRouter` le añade
`getPathname`/`getRouterState` con `Object.assign`. En un `it.each`, si no se
hace `await app` justo después de `renderRouter(...)`, la fila N lee el
pathname de la fila N−1 (en el spike, todas las filas tras la primera fallaban
con `Received: "/welcome"` de la anterior). Un `unmount` explícito no lo
arregla (`app.unmount` no existe sobre la promesa). La forma es:

```
const app = renderRouter(routes(), { initialUrl: href });
await app;
```

Se mantiene el `afterEach(() => jest.useRealTimers())` que ya tiene el fichero.

**Enmienda E1.** La fuga no viene solo de la fila anterior del mismo
`it.each`: cualquier `it` anterior del fichero que no haga `await app`
contamina a todos los que vienen detrás. En este fichero, ese `it` es
`#95 R3`, y los `describe` de #149 van justo después. Por eso `#95 R3` también
lleva `await app;` (ver [[requirements]] §Enmienda E1, con el spike de tres
variantes). Regla para cualquier fichero que monte el router en varios `it`:
**todos** hacen `await app;`, no solo los nuevos. Y el spike que valida filas
nuevas las corre detrás de los `it` que ya existen en el fichero, no aisladas.

## Riesgos

- **Comentario con `'/login'` en producción**: R4 lo cuenta (rojo buscado).
  Quien implemente no debe dejar el `href` viejo comentado.
- **Ruta protegida nueva**: no entra sola en R3 (delimitación en
  [[requirements]] §Fuera de alcance).
