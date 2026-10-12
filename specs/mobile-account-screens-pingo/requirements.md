---
feature: "mobile-account-screens-pingo"
status: approved   # draft | spec_ready | approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-account-screens-pingo]] (#167)

> Fila 1 del canvas aprobado (pantallas de cuenta): Pingo y entrada «rise» en
> Login y Registro, icono en el error general de Registro, Pingo y «pop» del
> tile del candado en Recuperar, Pingo y tarjeta de estado con check y «pop» en
> Nueva contraseña, y tres anillos de ping alrededor de Pingo en la Bienvenida
> (N2, metida en alcance por el humano). Decisión N4 del humano (2026-10-12):
> Login y Registro migran a ruta delgada + `src/screens/<x>/index.tsx` en esta
> misma feature, y el **primer commit es un movimiento puro, todo verde, sin
> cambio de comportamiento**. Una sola spec.
>
> Rutas relativas a `mobile-pet-tracker/` salvo las que empiezan por `../`.
> Base congelada: `d2b8b0ae` (= origin/main con #166 mergeada). Carta:
> `docs/ui-guidelines.md`. No se rehace #166 (labio de los primarios, secundario
> gris): ninguna receta de botón cambia en esta feature.

---

## Base medida (d2b8b0ae)

Cada valor se mide desde `mobile-pet-tracker/`. Las anclas son por contenido;
ningún requisito cita números de línea.

| # | Comando | Salida |
|---|---|---|
| B1 | `grep -cF 'export default function Login()' 'src/app/(auth)/login.tsx'` | `1` |
| B2 | `grep -cF 'export default function Register()' 'src/app/(auth)/register.tsx'` | `1` |
| B3 | `test -e src/screens/login/index.tsx; echo $?` | `1` |
| B4 | `test -e src/screens/register/index.tsx; echo $?` | `1` |
| B5 | `grep -cF "'src/app/(auth)/login.tsx'" src/__tests__/ui-copy-table.ts` | `10` |
| B6 | `grep -cF "'src/app/(auth)/register.tsx'" src/__tests__/ui-copy-table.ts` | `14` |
| B7 | `grep -cF '+ 1, // #134 R6' src/__tests__/ui-language.test.ts` | `1` |
| B8 | `grep -cF 'expect(R1_AUTH).toHaveLength(29 + 7); // #117 R10' src/__tests__/ui-language.test.ts` | `1` |
| B9 | `grep -cF "join('app', '(auth)', 'login.tsx')" src/__tests__/consistency-classnames.test.ts` | `2` |
| B10 | `grep -cF "join('app', '(auth)', 'register.tsx')" src/__tests__/consistency-classnames.test.ts` | `2` |
| B11 | `grep -cF "join('app', '(auth)', 'login.tsx'), 2]" src/__tests__/legibility-classnames.test.ts` | `1` |
| B12 | `grep -cF "join('screens', 'reset-password', 'index.tsx'), 2]" src/__tests__/legibility-classnames.test.ts` | `1` |
| B13 | `grep -cF '+ 2, // #118 R11' src/__tests__/legibility-classnames.test.ts` | `1` |
| B14 | `grep -cF "'app/(auth)/register.tsx': 1," src/__tests__/design-drift.test.ts` | `1` |
| B15 | `grep -cF -- '- 1, // #159 R2' src/providers/__tests__/language-provider.test.tsx` | `1` |
| B16 | `grep -cF "'login.pingoGreeting'" src/i18n/catalog.ts` | `0` |
| B17 | `grep -cF "'login.forgotPassword':" src/i18n/catalog.ts` | `2` |
| B18 | `grep -cF "toEqual(['welcome-bubble', 'welcome-pingo'])" src/screens/welcome/index.test.tsx` | `1` |
| B19 | `grep -cF 'MOTION_P' src/theme/motion.ts` | `0` |
| B20 | `grep -cF 'Flotar y parpadear son las únicas animaciones' ../docs/ui-guidelines.md` | `1` |
| B21 | `grep -cF '## Enmienda #167' ../docs/ui-guidelines.md` | `0` |
| B22 | `test -e src/components/pop-in.tsx; echo $?` | `1` |
| B23 | `grep -cF 'className' src/screens/home/home-entrance.tsx` | `0` |
| B24 | `grep -oF 'text-accent-strong' src/screens/reset-password/index.tsx \| wc -l` | `2` |
| B25 | `grep -cF '<Text testID="register-error" className="text-danger">' 'src/app/(auth)/register.tsx'` | `1` |
| B26 | `grep -cF 'style={CONTINUOUS_CORNER}' src/screens/forgot/index.tsx` | `1` |
| B27 | `ls assets/images/pingo-*.webp \| wc -l` | `8` |
| B28 | `grep -cF '## 3. La infraestructura' ../specs/mobile-ui-language/design.md` | `1` |
| B29 | `grep -cF '### §2.24' ../specs/mobile-ui-language/design.md` | `0` |
| B30 | `grep -cF "'MOTION_TRANSITION_MS'," src/theme/__tests__/motion.test.ts` | `1` |
| B31 | `grep -cF '## Checklist de autocrítica' ../docs/ui-guidelines.md` | `1` |

Bloques `it` en la base (`grep -cE '^\s*it(\.each)?[(<]' <fichero>`):

| Fichero | `it` |
|---|---|
| `src/app/(auth)/__tests__/login.test.tsx` | 8 |
| `src/app/(auth)/__tests__/register.test.tsx` | 11 |
| `src/screens/forgot/index.test.tsx` | 24 |
| `src/screens/reset-password/index.test.tsx` | 13 |
| `src/screens/welcome/index.test.tsx` | 63 |
| `src/screens/home/home-entrance.test.tsx` | 6 |
| `src/theme/__tests__/motion.test.ts` | 12 |
| `src/__tests__/design-drift.test.ts` | 46 |
| `src/__tests__/ui-language.test.ts` | 28 |
| `src/providers/__tests__/language-provider.test.tsx` | 16 |
| `src/__tests__/consistency-classnames.test.ts` | 33 |
| `src/__tests__/legibility-classnames.test.ts` | 12 |

---

## Convenciones de esta spec

- **Copy.** El copy del canvas no está aprobado. Los literales nuevos van
  propuestos en voz B de Pingo (guardián sereno) y listados en §Preguntas
  abiertas. Aun así, cada requisito da el literal exacto que el test asevera.
- **Dobles de prueba en pantallas.** Los tests de pantalla no ejercitan la
  animación real de `HomeEntrance` ni de `PopIn`. Los sustituyen por un doble
  que pinta un `View` con el mismo `testID`, `className` y `style`, renderiza
  `children` y registra las props de cada render. Las animaciones reales se
  candan en los tests de cada componente (R3, R4) y de la bienvenida (R12).
- **Mapa de entradas.** Donde un requisito dice «el mapa de entradas es
  exactamente X», el test construye
  `Object.fromEntries(calls.map(([p]) => [p.testID, { index: p.index, className: p.className }]))`
  sobre las llamadas registradas del doble de `HomeEntrance` y lo compara con
  `toEqual`. Así también cierra que no haya entradas de más. El «mapa de
  llamadas de `PopIn`» es lo mismo con `{ className: p.className, style: p.style }`.
- **Imágenes de Pingo.** Toda imagen nueva es un `Image` de `expo-image` sin
  `accessibilityLabel` (decorativa: el texto de la pantalla ya dice lo mismo).
  Su `source` se candea como en `src/screens/welcome/index.test.tsx`:
  `[expect.objectContaining({ testUri: expect.stringMatching(/<pose>\.webp$/) })]`.
- **Comentarios de trazabilidad.** Siempre `#167 Rn` con la R: un `#167` suelto
  casa `HEX_LITERAL` de `design-drift.test.ts` (`#(?!\d{2,3} R\d)[\da-f]{3,8}\b`).

---

## Requisitos funcionales

### R1 — Login y Registro migran a ruta delgada (movimiento puro)

**R1.1** WHEN Expo Router resuelve `/login`, THE SYSTEM SHALL renderizar
`LoginScreen`, exportado con `export function LoginScreen()` desde
`src/screens/login/index.tsx`. `src/app/(auth)/login.tsx` SHALL tener
exactamente este contenido (5 líneas y salto final):

```
import { LoginScreen } from '../../screens/login';

export default function LoginRoute() {
  return <LoginScreen />;
}
```

**R1.2** WHEN Expo Router resuelve `/register`, THE SYSTEM SHALL renderizar
`RegisterScreen`, exportado con `export function RegisterScreen()` desde
`src/screens/register/index.tsx`. `src/app/(auth)/register.tsx` SHALL tener
exactamente:

```
import { RegisterScreen } from '../../screens/register';

export default function RegisterRoute() {
  return <RegisterScreen />;
}
```

**R1.3** THE SYSTEM SHALL conservar el comportamiento. El cuerpo de
`LoginScreen` y `RegisterScreen` es el de `Login` y `Register` en la base, con
solo el nombre y la forma del export cambiados. Los imports relativos
(`'../../api/auth'`, `'../../providers/...'`) no cambian: la profundidad desde
`src/screens/<x>/` es la misma que desde `src/app/(auth)/`.

**R1.4** Los tests se mueven con `git mv`, sin cambiar títulos de `describe`/`it`
ni su número:

- `src/app/(auth)/__tests__/login.test.tsx` pasa a `src/screens/login/index.test.tsx` (8 `it`);
- `src/app/(auth)/__tests__/register.test.tsx` pasa a `src/screens/register/index.test.tsx` (11 `it`).

Dentro de ellos solo cambian dos cosas:

- los prefijos relativos `'../../../` pasan a `'../../` en `import` y `jest.mock`;
- el componente probado pasa a ser el default de la ruta, como hace
  `src/screens/forgot/index.test.tsx`: `import LoginRoute from '../../app/(auth)/login';`
  con el JSX `<LoginRoute />`, e `import RegisterRoute from '../../app/(auth)/register';`
  con `<RegisterRoute />`.

`src/app/(auth)/__tests__/layout.test.tsx` no se toca.

**R1.5** Los candados que nombran las rutas viejas pasan a nombrar las nuevas,
sin cambiar ninguna cuenta (inventario en §Deltas de candados, filas R1).

**R1.6** THE SYSTEM SHALL candar las dos rutas delgadas con un
`describe('#167 R1: las rutas de login y registro son delgadas')` en
`src/__tests__/design-drift.test.ts`. Tiene un `it` que lee cada fichero de
ruta y lo compara con `toBe` contra el contenido exacto de R1.1 y R1.2.
**Nace verde** (declarado): se escribe después del movimiento. La sonda está en
tasks.md T2.

### R2 — Tokens de movimiento nuevos en `src/theme/motion.ts`

**R2.1** THE SYSTEM SHALL exportar exactamente estos cuatro tokens nuevos, con
un comentario `// #167 R2` encima de cada uno:

| Símbolo | Valor |
|---|---|
| `MOTION_POP_SPRING` | `{ duration: MOTION_SURFACE_MS, dampingRatio: 0.6, reduceMotion: ReduceMotion.System }` |
| `MOTION_PING_FROM` | `0.55` (escala y opacidad iniciales de cada anillo) |
| `MOTION_PING_TO_SCALE` | `1.5` |
| `MOTION_PING_TIMING` | `{ duration: 2400, easing: Easing.bezier(0.23, 1, 0.32, 1), reduceMotion: ReduceMotion.System }` |

**R2.2** THE SYSTEM SHALL pasar de 13 a 17 exports: la lista ordenada del `it`
`'no exporta nada más'` de `src/theme/__tests__/motion.test.ts` gana los cuatro
nombres en su posición alfabética. Hay un `it` nuevo por token que asevera su
valor con `toEqual` contra literales, nunca contra otro símbolo importado de
producción:

- `MOTION_POP_SPRING`: `{ duration: 400, dampingRatio: 0.6, reduceMotion: ReduceMotion.System }`;
- `MOTION_PING_TIMING`: `{ duration: 2400, easing: { bezier: [0.23, 1, 0.32, 1] }, reduceMotion: ReduceMotion.System }`,
  con el doble de `Easing.bezier` que ya tiene ese fichero;
- `MOTION_PING_FROM`: `0.55`;
- `MOTION_PING_TO_SCALE`: `1.5`.

### R3 — Componente `PopIn`

**R3.1** THE SYSTEM SHALL exponer `export function PopIn({ testID, className, style, children })`
en `src/components/pop-in.tsx`. Todas las props son opcionales salvo `children`.
Pinta un `Animated.View` de Reanimated con `testID={testID}`,
`className={className}` y `style={[style, animatedStyle]}`, donde
`animatedStyle` es `{ opacity, transform: [{ scale }] }`.

**R3.2** WHEN `PopIn` se monta y reduce motion está desactivado, THE SYSTEM SHALL
hacer esto:

- partir de `opacity: 0` y `scale: MOTION_ENTRANCE_SCALE` (0.9);
- animar la opacidad a 1 con `withDelay(MOTION_TRANSITION_MS, withTiming(1, MOTION_FADE_TIMING), ReduceMotion.Never)`;
- animar la escala a 1 con `withDelay(MOTION_TRANSITION_MS, withSpring(1, MOTION_POP_SPRING))`.

Observable con timers falsos: a los 200 ms el estilo animado sigue siendo
`{ opacity: 0, transform: [{ scale: 0.9 }] }`, y a los 1500 ms es
`{ opacity: 1, transform: [{ scale: 1 }] }`.

**R3.3** WHEN `PopIn` se monta y reduce motion está activado, THE SYSTEM SHALL
conservar el fundido de opacidad con el mismo retardo y no animar la escala,
que vale 1 desde el primer render. Observable: a los 0 y a los 200 ms vale
`{ opacity: 0, transform: [{ scale: 1 }] }`, y a los 1500 ms
`{ opacity: 1, transform: [{ scale: 1 }] }`.

**R3.4** THE SYSTEM SHALL pasar `testID`, `className` y `style` tal cual.

- Con `style={{ borderCurve: 'continuous' }}` y `className="size-16"`,
  `getAnimatedStyle` devuelve en el instante 0 el estilo estático fusionado con
  el animado, `{ borderCurve: 'continuous', opacity: 0, transform: [{ scale: 0.9 }] }`,
  y `props.className` es `'size-16'`.
- Sin `className` ni `style`, `props.className` es `undefined` y el estilo es
  solo el animado.
- Los `children` se pintan dentro del nodo.

**R3.5** `PopIn` no limpia ni cancela animaciones al desmontar, igual que
`HomeEntrance` y la bienvenida en la base.

### R4 — `HomeEntrance` acepta `className`

**R4.1** THE SYSTEM SHALL añadir a `HomeEntrance` (`src/screens/home/home-entrance.tsx`)
una prop opcional `className?: string` que pasa tal cual al `Animated.View`.

- Sin `className`, el nodo sigue sin `className` ni `style`: el
  `it('no añade estilo propio')` de la base sigue verde sin tocarlo.
- Con `className="gap-4"`, `props.className` es `'gap-4'` y `props.style` sigue
  `undefined`.
- No cambia nada más: `homeEntering`, el escalonado y reduce motion quedan como
  están.

### R5 — Clave de copy del saludo de Login

**R5.1** THE SYSTEM SHALL añadir la clave `login.pingoGreeting` en
`src/i18n/catalog.ts`, en los dos idiomas, justo después de `login.forgotPassword`:
`en` → `'Good to see you again.'`, `es` → `'Qué bueno verte de nuevo.'`
(copy propuesto, ver §Preguntas abiertas P1).

**R5.2** THE SYSTEM SHALL registrarla en `../specs/mobile-ui-language/design.md`
con una sección nueva
`### §2.24 — Añadidos por #167 — Pingo en las pantallas de cuenta`, insertada
justo antes de `## 3. La infraestructura`. Lleva la cabecera de tabla de §2.23
y la fila
``| — | `login.pingoGreeting` | `Good to see you again.` | `Qué bueno verte de nuevo.` | ← añadida por #167 (R5) |``.

**R5.3** Candados en `src/providers/__tests__/language-provider.test.tsx`:

- la expresión de longitud cambia `- 1, // #159 R2` por `- 1 // #159 R2` y gana
  la línea `+ 1, // #167 R5`;
- un `it('#167 R5: declara login.pingoGreeting en los dos idiomas y su registro')`
  asevera los dos literales y la fila con el mismo patrón que el `it('#158 R1: …')`:
  la regex `'\\| — \\| `' + escapeRegExp(key) + '`[^\\n]*← (?:añadida|cambiada) por #167 \\(R5\\)'`
  y un `toContain` del título de §2.24.

La fila de uso en `R1_AUTH` llega en R6, no aquí: su sujeto, la llamada
`t('login.pingoGreeting')`, no existe hasta R6.

### R6 — Login: Pingo saluda y la pantalla entra en dos tiempos

**R6.1** WHEN se renderiza `LoginScreen`, THE SYSTEM SHALL envolver el contenido
del scroll `login-form` en dos `HomeEntrance`, importados de
`'../home/home-entrance'`:

- `login-header`, con `index={0}` y `className="gap-4"`;
- `login-body`, con `index={1}` y `className="gap-4"`.

El mapa de entradas es exactamente
`{ 'login-header': { index: 0, className: 'gap-4' }, 'login-body': { index: 1, className: 'gap-4' } }`.

**R6.2** El contenido de cada entrada es este:

- `login-header` SHALL contener, en este orden, un `View` `login-greeting` y el
  título existente (`t('login.signIn')`, «Iniciar sesión» en es, misma
  `className` que en la base).
- `login-body` SHALL contener, en el orden de la base, `login-email`,
  `login-password`, `login-error` (cuando hay error), `login-submit`,
  `link-register` y `link-forgot`.
- Ningún nodo de `login-body` está dentro de `login-header`, ni al revés.

**R6.3** `login-greeting` SHALL tener `className="flex-row items-center gap-3"`
(candado `toBe`) y exactamente dos hijos, en orden `['login-pingo', 'login-bubble']`.
Se cuentan por `children` del nodo, como el `toEqual(['welcome-bubble', 'welcome-pingo'])`
de la bienvenida.

- `login-pingo` es un `Image` con la pose `pingo-wave.webp` y
  `style={{ width: 88, height: 88, transform: [{ rotate: '-8deg' }] }}`. Se
  candea con `toEqual` del `props.style` completo. No lleva `accessibilityLabel`.
- `login-bubble` es un `Card` con `variant="secondary"` y
  `className="flex-1 px-4 py-3"`. Candado: `props.className.split(' ')` contiene
  `'rounded-card'`, `'bg-surface-secondary'`, `'flex-1'`, `'px-4'` y `'py-3'`.
- El único hijo de `login-bubble` es el `Text` `login-bubble-text`, con
  `className="text-sm font-semibold text-foreground"` (candado `toBe`) y el texto
  `t('login.pingoGreeting')`: «Qué bueno verte de nuevo.» en es y «Good to see
  you again.» en en. Hay un `it` por idioma.

**R6.4** Candados de copy:

- `src/__tests__/ui-copy-table.ts` gana la fila
  `{ file: 'src/screens/login/index.tsx', key: 'login.pingoGreeting' }, // #167 R6`
  justo después de la fila de `login.forgotPassword`;
- en `src/__tests__/ui-language.test.ts`, la línea
  `expect(R1_AUTH).toHaveLength(29 + 7); // #117 R10` pasa a
  `expect(R1_AUTH).toHaveLength(29 + 7 + 1); // #117 R10, #167 R6`.

`SCREEN_FILES` no cambia: el fichero ya está en la tabla.

### R7 — Registro: Pingo en la cabecera, que entra con «rise»

**R7.1** WHEN se renderiza `RegisterScreen`, THE SYSTEM SHALL sustituir el título
suelto del scroll `register-form` por un `HomeEntrance` `register-header` con
`index={0}` y `className="flex-row items-center justify-center gap-3"`. Sus
hijos son, en orden, el `Image` `register-pingo` y el título existente
(`t('register.createAccount')`, misma `className` que en la base). El mapa de
entradas es exactamente
`{ 'register-header': { index: 0, className: 'flex-row items-center justify-center gap-3' } }`.

**R7.2** `register-pingo` SHALL usar la pose `pingo-clipboard.webp` con
`style={{ width: 56, height: 56 }}` (candado `toEqual`) y sin `accessibilityLabel`.

**R7.3** Los campos, sus `FieldError`, `register-terms`, el error general y
`register-submit` siguen siendo hijos directos del scroll, y ninguno está dentro
de `register-header`. El `it` de #61 R7 que lo dice sigue siendo verdad.

### R8 — Registro: el error general lleva icono

**R8.1** WHEN el registro termina con error general (`generalError` no vacío),
THE SYSTEM SHALL pintar un `View` `register-error-row` con
`className="flex-row items-center gap-1.5"` (candado `toBe`) y exactamente dos
hijos, en este orden:

1. el icono `AlertCircle` de `reicon-react-native`, con `size={14}` y
   `color` = `useThemeColors(['danger'])[0]`;
2. el `Text` `register-error`, cuya `className` pasa de `"text-danger"` a
   `"flex-1 text-sm font-semibold text-danger"` (candado `toBe`).

El texto del error no cambia.

**R8.2** WHILE no hay error general, THE SYSTEM SHALL no pintar
`register-error-row`: `queryByTestId('register-error-row')` es `null`, igual que
hoy `register-error`.

**R8.3** Los siete `FieldError` por campo no cambian (ver §Preguntas abiertas P4).

### R9 — Recuperar: Pingo y «pop» del tile del candado

**R9.1** WHEN se renderiza `ForgotScreen`, THE SYSTEM SHALL pintar un `Image`
`forgot-pingo` con la pose `pingo-talk.webp` y
`style={{ width: 120, height: 120, transform: [{ rotate: '6deg' }] }}` (candado
`toEqual`), sin `accessibilityLabel`. Es el hermano inmediatamente anterior al
tile del candado, con el mismo padre que `forgot-title`. Vale en el estado de
formulario y en el de enviado, con un candado por estado.

**R9.2** THE SYSTEM SHALL convertir el `View` del tile en
`<PopIn testID="forgot-lock-tile" className="size-16 items-center justify-center rounded-xl bg-accent-soft" style={CONTINUOUS_CORNER}>`,
con el icono `Lock` dentro sin cambios. La `className` y `style={CONTINUOUS_CORNER}`
son literalmente las de la base, así que no cambian ni el helper `lockTile()`
de `src/screens/forgot/index.test.tsx` ni los recuentos globales de
`consistency-classnames.test.ts`. El mapa de llamadas de `PopIn` en `forgot`
es exactamente
`{ 'forgot-lock-tile': { className: 'size-16 items-center justify-center rounded-xl bg-accent-soft', style: { borderCurve: 'continuous' } } }`
en los dos estados, con un candado por estado.

**R9.3** El restyle del tile (fondo `bg-accent`, icono blanco, labio) queda fuera
(§Preguntas abiertas P3).

### R10 — Nueva contraseña: Pingo y tarjeta de estado con check

**R10.1** WHEN se renderiza `ResetPasswordScreen` con token y todavía sin éxito
(rama de formulario), THE SYSTEM SHALL envolver el contenido así:

- el título va en un `HomeEntrance` `reset-header` (`index={0}`,
  `className="flex-row items-center justify-center gap-3"`), con hijos, en orden,
  el `Image` `reset-pingo` y el título existente (`t('resetPassword.resetPassword')`);
- el resto del formulario (`reset-password`, `reset-password-confirm`,
  `reset-error` cuando lo hay y `reset-submit`) va en un `HomeEntrance`
  `reset-body` (`index={1}`, `className="gap-4"`).

El mapa de entradas del primer render es exactamente
`{ 'reset-header': { index: 0, className: 'flex-row items-center justify-center gap-3' }, 'reset-body': { index: 1, className: 'gap-4' } }`.

**R10.2** `reset-pingo` SHALL usar la pose `pingo-clipboard.webp` con
`style={{ width: 72, height: 72 }}` (candado `toEqual`) y sin `accessibilityLabel`,
en la rama de formulario y en la de éxito, con un candado por rama.

**R10.3** WHEN el restablecimiento termina con éxito, THE SYSTEM SHALL pintar en
el scroll `screen-reset-password`, en este orden: `reset-header` (el mismo de
R10.1), un `PopIn` `reset-success-pop` con `className="w-full"`, y `link-login`
sin cambios. `reset-body` no existe en esta rama.

**R10.4** `reset-success-pop` SHALL contener un `Card` `reset-success-card` con
`variant="secondary"` y `className="flex-row items-center gap-3 px-4 py-3.5"`.
Candado: `split(' ')` contiene `'rounded-card'`, `'bg-surface-secondary'`,
`'flex-row'`, `'items-center'`, `'gap-3'`, `'px-4'` y `'py-3.5'`. Tiene
exactamente dos hijos, en orden `['reset-success-check', 'reset-success']`:

- `reset-success-check` es un `View` con
  `className="size-8 items-center justify-center rounded-full bg-accent"`
  (candado `toBe`). Su único hijo es el icono `Check` de `reicon-react-native`,
  con `size={18}` y `color` = `useThemeColors(['accent-foreground'])[0]`.
- `reset-success` es el `Text` existente, ahora con
  `className="flex-1 font-bold text-accent-strong"` (candado `toBe`) y
  `selectable`. Conserva el texto (`t('resetPassword.passwordUpdated')`,
  «Contraseña actualizada»).

El mapa de llamadas de `PopIn` en la rama de éxito es exactamente
`{ 'reset-success-pop': { className: 'w-full', style: undefined } }`.

**R10.5** La rama sin token (`reset-missing-token`) no cambia.

### R11 — Enmienda de la carta: los anillos de ping

**R11.1** THE SYSTEM SHALL sustituir en `../docs/ui-guidelines.md` las cinco
líneas de la viñeta «Bucles de reposo» por exactamente estas seis:

```
- **Bucles de reposo.** Flotar, parpadear y los tres anillos de ping que
  rodean a Pingo en la bienvenida son las únicas animaciones continuas de
  Pingo, y una excepción declarada a §Animación: animan `translateY`,
  `scale` y `opacity` con timing y duraciones fuera de 150/250/400,
  porque no entran, ni salen, ni responden a un gesto. Sus constantes viven en
  `src/theme/motion.ts` y no arrancan con reduce motion.
```

La última línea queda idéntica a la base: la asevera el `#153 R2` de la
bienvenida.

**R11.2** THE SYSTEM SHALL añadir al final del fichero una sección
`## Enmienda #167 — anillos de ping de la bienvenida` con este cuerpo exacto:

```
Los tres anillos de ping de la bienvenida amplían los bucles de reposo de
§Animación punto 7. Cada anillo es un círculo de borde `border-accent` que
crece de `MOTION_PING_FROM` a `MOTION_PING_TO_SCALE` mientras su opacidad cae
de `MOTION_PING_FROM` a 0, con `MOTION_PING_TIMING`, en bucle infinito y sin
invertir. Los anillos arrancan escalonados un tercio de la duración. Con
reduce motion no se pintan.

Ninguna otra pantalla usa anillos de ping sin una enmienda propia.

- [ ] Enmienda aprobada por humano
```

`## Checklist de autocrítica` sigue apareciendo una sola vez (B31).

**R11.3** Candado: un `describe('#167 R11: la carta declara los anillos de ping')`
en `src/screens/welcome/index.test.tsx`, que lee la carta igual que el `#153 R2`.
Tiene un `it` por cláusula:

1. contiene el bloque completo de R11.1 una sola vez;
2. no contiene `'Flotar y parpadear son las únicas'`;
3. contiene el título y el cuerpo de R11.2 **sin la línea de la casilla** una
   sola vez, y el texto que sigue al título casa con
   `/- \[[ xX]\] Enmienda aprobada por humano/`: la casilla la marca el humano
   y el candado no puede atarse a que siga sin marcar (mismo criterio que
   `#65 R19` en `ui-language.test.ts` y `consistency-classnames.test.ts`);
4. `'## Checklist de autocrítica'` aparece exactamente una vez. **Nace verde**
   (declarado), con la sonda en tasks.md T12.

### R12 — Bienvenida: tres anillos de ping alrededor de Pingo

**R12.1** WHEN se renderiza la bienvenida y reduce motion está desactivado, THE
SYSTEM SHALL cambiar los hijos de `welcome-scene` a
`['welcome-bubble', 'welcome-stage']`. `welcome-stage` es un `View` con
`className="items-center justify-center"` (candado `toBe`) cuyos hijos son, en
este orden, `['welcome-ring-0', 'welcome-ring-1', 'welcome-ring-2', 'welcome-pingo']`.
`welcome-pingo` es el nodo de la base, sin cambios.

**R12.2** Cada anillo `welcome-ring-<i>` SHALL ser un `Animated.View` con
`className="absolute size-65 rounded-full border-2 border-accent"` (candado
`toBe` por anillo, con `it.each` sobre los tres). Su estilo animado es
`{ opacity, transform: [{ scale }] }`, con los dos valores iniciados en
`MOTION_PING_FROM` (0.55).

**R12.3** THE SYSTEM SHALL animar cada anillo con
`withDelay(i * (MOTION_PING_TIMING.duration / 3), withRepeat(withTiming(<destino>, MOTION_PING_TIMING), -1, false))`.
El destino es `MOTION_PING_TO_SCALE` para la escala y `0` para la opacidad. Eso
da seis llamadas a `withRepeat` cuyos argumentos tras la animación son
`[-1, false]`; el filtro de flotar (`[-1, true]`) y el de parpadear (`[-1]`) no
las cuentan. Candado: `withRepeat` filtrado por
`length === 2 && [0] === -1 && [1] === false` da exactamente seis entradas.

**R12.4** Línea de tiempo observable con timers falsos. El doble de `withRepeat`
es la identidad, así que cada anillo se queda en su valor final.

- Inicial = `{ opacity: 0.55, transform: [{ scale: 0.55 }] }`.
- Final = `{ opacity: 0, transform: [{ scale: 1.5 }] }`.

Hay un `it` por instante:

| Instante | ring-0 | ring-1 | ring-2 |
|---|---|---|---|
| 0 ms | inicial | inicial | inicial |
| 700 ms | ≠ inicial | inicial | inicial |
| 1500 ms | ≠ inicial | ≠ inicial | inicial |
| 2500 ms | final | ≠ final | ≠ final |
| 3300 ms | final | final | ≠ final |
| 4100 ms | final | final | final |

La derivación está en design.md §Timers; los márgenes de 100 ms absorben la
cuantización de frames.

**R12.5** El flotar y el parpadear de Pingo no cambian: sus candados de la base
siguen verdes sin tocarlos.

### R13 — Bienvenida: sin anillos con reduce motion

**R13.1** WHEN reduce motion está activado, THE SYSTEM SHALL no pintar los anillos.
Los hijos de `welcome-stage` son exactamente `['welcome-pingo']`, y
`queryByTestId('welcome-ring-<i>')` es `null` para i = 0, 1, 2 (`it.each`).

**R13.2** WHEN reduce motion está activado, THE SYSTEM SHALL no llamar a
`withRepeat`. Ya lo aseveran los dos `it` de la base
(`expect(mockWithRepeat).not.toHaveBeenCalled()`), y la fila queda declarada
como cubierta por ellos.

**Nace verde** (declarado): R12 ya tiene que condicionar los anillos para que
esos candados de la base sigan verdes. La sonda de mutación de tasks.md T13 lo
demuestra.

### R14 — Guarda de deriva sobre los ficheros de la feature

**R14.1** THE SYSTEM SHALL añadir a `src/__tests__/design-drift.test.ts` un
`describe('#167 R14: las pantallas de cuenta no traen deriva')`. Su lista de
ficheros, relativa a `sourceRoot`, es exactamente:

- `app/(auth)/login.tsx`, `app/(auth)/register.tsx`;
- `screens/login/index.tsx`, `screens/register/index.tsx`;
- `screens/forgot/index.tsx`, `screens/reset-password/index.tsx`;
- `screens/welcome/index.tsx`, `screens/home/home-entrance.tsx`;
- `components/pop-in.tsx`, `theme/motion.ts`.

Tiene un `it` por cláusula, cada uno con `toEqual([])` sobre la lista de
ficheros que violan:

1. `MEALS_BAR_STYLE_ESCAPES.test(source)` (la constante que ya existe en ese fichero);
2. `/\brounded-(?:2xl|lg|md|sm)\b/`;
3. `/text-accent(?![-\w])/`;
4. `/expo-linear-gradient|expo-symbols|lottie-react-native|@rive-app|\buseThemeColor\b|\p{Extended_Pictographic}/u`.

**Nace verde** (declarado): los ficheros de la base pasan las cuatro (medido
con estas mismas regex sobre d2b8b0ae). La sonda está en tasks.md T14.

### R15 — Prueba de humo en dev build de Android (gate humano)

**R15.1** WHEN el humano abre la app en el **dev build de Android** (no Expo Go)
con `bunx expo start --dev-client`, THE SYSTEM SHALL mostrar:

- Login con Pingo saludando y la entrada en dos tiempos;
- Registro con Pingo en la cabecera;
- Recuperar con Pingo y el tile que aparece con «pop»;
- Nueva contraseña con Pingo y, tras un restablecimiento válido, la tarjeta con
  check que aparece con «pop»;
- la Bienvenida con los tres anillos de ping escalonados, sin tirones.

Con «Quitar animaciones» activado en Ajustes → Accesibilidad, la Bienvenida no
muestra anillos y no hay saltos de escala. Tiene firma propia en
traceability.md §Firma de la prueba de humo (R15).

---

## Deltas de candados (inventario completo)

| Fichero | Antes (ancla) | Después | R |
|---|---|---|---|
| `src/__tests__/ui-copy-table.ts` | B5 = 10, B6 = 14 | `'src/app/(auth)/login.tsx'` → 0 y `'src/screens/login/index.tsx'` → 10; `'src/app/(auth)/register.tsx'` → 0 y `'src/screens/register/index.tsx'` → 14 | R1 |
| `src/__tests__/ui-language.test.ts` | B7 | `+ 1 // #134 R6` y línea nueva `+ 2 - 2, // #167 R1: salen app/(auth)/login.tsx y app/(auth)/register.tsx, entran screens/login/index.tsx y screens/register/index.tsx` | R1 |
| `src/__tests__/consistency-classnames.test.ts` | B9 = 2, B10 = 2 | `join('screens', 'login', 'index.tsx')` → 2 y `join('screens', 'register', 'index.tsx')` → 2; los viejos → 0 | R1 |
| `src/__tests__/legibility-classnames.test.ts` | B11 = 1 | `[join('screens', 'login', 'index.tsx'), 2]` → 1 | R1 |
| `src/__tests__/design-drift.test.ts` | B14 = 1 | `'screens/register/index.tsx': 1,` → 1 | R1 |
| `src/__tests__/design-drift.test.ts` | 46 `it` | +1 (`#167 R1`) y +4 (`#167 R14`) = 51 | R1, R14 |
| `src/theme/__tests__/motion.test.ts` | 12 `it`, lista de 13 | lista de 17; +4 `it` = 16 | R2 |
| `src/components/__tests__/pop-in.test.tsx` | no existe | 4 `it` | R3 |
| `src/screens/home/home-entrance.test.tsx` | 6 `it` | 7 | R4 |
| `src/providers/__tests__/language-provider.test.tsx` | B15; 16 `it` | `- 1 // #159 R2` y `+ 1, // #167 R5`; 17 `it` | R5 |
| `src/__tests__/ui-copy-table.ts` | sin `login.pingoGreeting` | +1 fila | R6 |
| `src/__tests__/ui-language.test.ts` | B8 | `expect(R1_AUTH).toHaveLength(29 + 7 + 1); // #117 R10, #167 R6` | R6 |
| `src/__tests__/legibility-classnames.test.ts` | B12 = 1, B13 = 1 | `[join('screens', 'reset-password', 'index.tsx'), 3]`; `+ 2 // #118 R11` y línea nueva `+ 1, // #167 R10` | R10 |
| `src/screens/welcome/index.test.tsx` | B18 = 1 | la misma aserción pasa a `toEqual(['welcome-bubble', 'welcome-stage'])` | R12 |

Ficheros de test movidos en R1: `src/screens/login/index.test.tsx` (8 `it`) y
`src/screens/register/index.test.tsx` (11 `it`). Los totales finales por
fichero están en tasks.md §Cuentas.

Sin cambio, verificado contra la base:

- `style={CONTINUOUS_CORNER}` global (32);
- `rounded-xl bg-accent` de #166 R2: el tile y la tarjeta no usan esa receta;
- `bg-accent-soft` global;
- `border-b-4` y `border-black/25` (19), `border-lip-gray` y `border-b-6` (4);
- `#149 R4`: `'../../screens/login'` no casa `/['"`]\/(?:\(auth\)\/)?login\b/`;
- `SCREEN_FILES`: el `+ 2 - 2` es solo trazabilidad;
- `inkSites` de login (2);
- la lista de assets `pingo-*`/`mascot-*` de la bienvenida: no se añade ninguno.

---

## Fuera de alcance

Clasificado viñeta a viñeta: **[F]** = trabajo futuro posible, **[D]** = delimitación.

- [D] Recetas de botón (labio del primario, secundario gris): las cerró #166.
- [D] `PetHeroHeader` y `hero-header-amendments.test.ts` (#168), `WeightChart`
  (#169), `pet-map`, `pairing`, `add-pet`, `EmptyState` y celebración (#170/#171).
- [F] Botón de ojo para mostrar u ocultar la contraseña, del canvas.
- [F] Rejilla de dos columnas y botón «Volver» del Registro, del canvas.
- [F] Flotar de Pingo en Registro, Recuperar y Nueva contraseña: solo la
  bienvenida tiene bucles de reposo (carta §7).
- [F] Copy de validación de email en cliente.
- [F] `accessibilityLiveRegion` en la tarjeta de estado de Nueva contraseña.
- [D] La rama sin token de Nueva contraseña.
- [F] Restyle del enlace «Crear cuenta» del Login.
- [D] Mover `HomeEntrance` a `src/components/`: se importa desde
  `src/screens/home/home-entrance.tsx` (alternativa descartada en design.md).
- [F] Restyle del tile del candado de Recuperar (P3).
- [F] Iconos en los siete `FieldError` del Registro (P4).
- [D] Dependencias nuevas: ninguna. `expo-linear-gradient` sigue vetada.

---

## Preguntas abiertas

Ninguna bloquea a Codex: cada una tiene un valor por defecto escrito en el
requisito. El humano las cierra al firmar o pide enmienda.

- **P1 (copy).** `login.pingoGreeting`: es «Qué bueno verte de nuevo.», en «Good
  to see you again.» (voz B, sereno). ¿Vale?
- **P2 (poses).** Login `pingo-wave`; Registro y Nueva contraseña
  `pingo-clipboard`; Recuperar `pingo-talk`. ¿Vale el reparto?
- **P3 (tile de Recuperar).** El canvas lo pinta `bg-accent` con icono blanco y
  labio. Aquí solo se le añade el «pop» y se conserva `bg-accent-soft`. ¿Restyle
  en esta feature o después?
- **P4 (iconos de error).** Hay icono solo en el error general de Registro; los
  siete `FieldError` siguen sin icono. ¿Basta?
- **P5 (pop).** Escala inicial 0.9 (`MOTION_ENTRANCE_SCALE`, la de la casa) en
  vez de la 0.6 del canvas, y `dampingRatio: 0.6`. ¿Vale?
- **P6 (rise).** Escalonado de 60 ms y desplazamiento de 12 px (los de
  `HomeEntrance`) en vez de los 100 ms / 14 px del canvas. ¿Vale?
- **P7 (desborde de los anillos).** A escala 1.5 un anillo mide 390 px y sale de
  la tarjeta `welcome-scene`. No se añade `overflow-hidden`. ¿Vale, o se recorta?
- **P8 (carta).** Texto de la enmienda de §7 y de `## Enmienda #167` (R11). La
  casilla `- [ ] Enmienda aprobada por humano` es su firma.
  **Cerrada 2026-10-12:** el humano marcó `[X]` en esa línea de la página de
  Notion (edición 2026-10-12T15:24:14Z). Codex escribe la casilla sin marcar;
  el leader la marca en el cierre citando esa edición.

---

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-12)

Firmada en Notion: página https://app.notion.com/p/3f76115a9b27812d88b4ebbe02174d7c
(base *Specs*), `Estado del gate` = Aprobado, última edición
2026-10-12T15:24:14Z, cuenta alexfdgf32@gmail.com. P1–P7 quedan cerradas con
el valor por defecto de su requisito; P8, como dice su viñeta.

---

## Enmienda E1 — R6, R7 y R10: los candados que faltaban

> Escrita el 2026-10-12 sobre la spec aprobada (firma `ed8158b6`), tras la
> revisión **rechazada** (`progress/review_mobile-account-screens-pingo.md`,
> sobre la punta de producción de Codex `108bd291`), por sus bloqueantes B1-B4.
> Ampliada el mismo día con el barrido pre-firma del reviewer (misma review,
> §Barrido de la Enmienda E1): su bloqueante X1, las observaciones X2-X5 y O4
> de la ronda 1, plegadas para no abrir una ronda 3.
> No toca el texto de R1-R15 ni la firma original. **Solo tests**: la
> producción de `108bd291` es correcta y queda idéntica. Su casilla va **sin
> marcar**: el humano reabre el gate solo para esta enmienda.

### Los hechos medidos

El código cumple R6.1, R6.2, R7.1, R7.3, R10.1 y R10.3. Lo que falta es el
candado: en cada caso el reviewer rompió la producción y la suite siguió verde.

Los de la revisión (ronda 1):

| Id | Requisito | Qué pide | Sonda del reviewer | Estado en `108bd291` |
|---|---|---|---|---|
| B1 | R6.2 | `login-error`, cuando lo hay, va entre `login-password` y `login-submit` | A: el bloque del error pasa detrás de `link-forgot` | **verde** 20/20 |
| B2 | R10.3 | en la rama de éxito, `reset-header` es «el mismo de R10.1»: `index={0}`, `className="flex-row items-center justify-center gap-3"`, hijos `[reset-pingo, título]` | G: `index={3}`, `className="items-center gap-8"` y el título delante de Pingo | **verde** 29/29 |
| B3 | R7.3 | campos, `FieldError`, `register-terms`, error general y `register-submit` siguen colgando del scroll | O1: `register-submit` envuelto en un `View` | **verde** 21/21 |
| B4 | R6.2 y R7.1 | el título conserva la `className` de la base, `text-center text-2xl font-black text-foreground` | R1 y R2: otra clase en el título | **verde** |

Los del barrido pre-firma, medidos con los `it` de la primera redacción de E1
ya puestos:

| Id | Requisito | Qué pide | Sonda del reviewer | Estado |
|---|---|---|---|---|
| X1 | R6.2 | sin error, `login-error` no existe («cuando lo hay») | H1: `login-error` se pinta siempre, sin ternario | **verde** 22/22. **Bloqueante** |
| X2 | R10.1 | sin error, `reset-error` no existe («cuando lo hay») | H1b: `reset-error` se pinta siempre, sin ternario | **verde** 30/30 |
| X3 | R6.1 | `login-header` (`index={0}`) va antes que `login-body` (`index={1}`) en el scroll | H2: los dos bloques intercambian su sitio | **verde** 22/22 |
| X4 | R7.1 | `register-header` sustituye al título suelto del scroll: es el primer hijo del contenedor | H3: `register-header` pasa detrás de `register-submit` | **verde** 23/23 |
| X5 | R10.1 | en la rama de formulario, `reset-header` va antes que `reset-body` | H2b: `reset-header` pasa detrás de `reset-body` | **verde** 30/30 |
| O4 | R10.1 | dentro de `reset-body`, el orden de siempre: `reset-password`, `reset-password-confirm`, `reset-error`, `reset-submit` | N: error y envío pasan delante de los dos campos | **verde** 29/29 (ronda 1) |

X3, X5 y O4 no eran bloqueantes: ni R6.1 ni R10.1 dicen «en orden» para esos
nodos. Se pliegan porque cuestan un `it` cada uno y la pantalla de `108bd291`
ya tiene ese orden. E1 fija el orden existente; el texto de R6.1 y R10.1 no
cambia.

Por qué no lo veían los tests de la ronda 1:

- **B1.** `it('#167 R6: el cuerpo lleva el formulario en el orden de siempre')`
  filtra con una regex que no incluye `login-error`, y renderiza sin error.
- **B2.** La cabecera solo se fija en la rama de formulario. En la de éxito
  se miran la pose de `reset-pingo` y el orden
  `[reset-header, reset-success-pop, link-login]`, pero no la cabecera.
- **B3.** La última frase de R7.3 es **falsa**: «El `it` de #61 R7 que lo dice
  sigue siendo verdad». Ese `it`
  (`conserva los campos del formulario como hijos directos del scroll`) solo
  comprueba `toBeVisible()` y que `getAllByText('Crear cuenta')` tenga dos
  nodos. No mira ningún padre. E1 pone el candado que esa frase daba por
  hecho. El texto de R7.3 no cambia.
- **B4.** Ningún `it` lee la `className` del título.
- **X1 y X2.** Los `it` que miran el error lo hacen siempre tras un envío
  fallido; ninguno comprueba su ausencia sin error.
- **X3, X4 y X5.** Los `it` de cabecera miran sus hijos y su `index`, no su
  posición entre los hijos del scroll.

### Qué es «colgar del scroll» en el árbol de host (medido en `108bd291`)

`register-form` se pinta como `RCTScrollView` con un único `View` hijo, el
contenedor de contenido. Ese contenedor es `register-header.parent`, y sus
hijos son, en orden:

1. `register-header`;
2. siete `View` `text-field__root`, uno por `TextField`. Dentro de cada uno, el
   `Input` (`register-first-name`, `-last-name`, `-email`, `-phone`,
   `-password`, `-password-confirmation`, `-country`) y su `FieldError`
   (`<id>-error`) son hermanos;
3. la fila de términos, cuyo hijo es `register-terms`;
4. `register-error-row`, cuando hay error general;
5. `register-submit`.

Por tanto «cuelga del scroll» se concreta así:

- el `Input` está a dos niveles del contenedor;
- su `FieldError` comparte padre con él;
- `register-terms` está a dos niveles;
- `register-error-row` y `register-submit` están a uno;
- y `register-header` es el primer hijo (X4).

Un `View` intermedio en cualquiera de esos sitios rompe una de las
igualdades. Para que los siete `FieldError` y la fila del error general
existan a la vez, el `it` responde al envío con
`{ kind: 'validation', errors: [...] }` en las ocho rutas: los siete campos y
`termsAccepted`, que va a la fila del error general.

En login y en la rama de formulario de reset la estructura es la misma: el
scroll (`login-form`, `reset-password-form`) tiene un contenedor de contenido
cuyos hijos son exactamente `[cabecera, cuerpo]`. En la rama de formulario de
reset el scroll es `reset-password-form`; `screen-reset-password` es ahí el
`KeyboardAvoidingView`.

### Decisión: diez `it` nuevos y una línea, en los `describe` de #167 que ya existen

Los `it` de la ronda 1 no cambian, ni de nombre ni de cuerpo. El código exacto
está en tasks.md §Enmienda E1.

- **R6.1 y R6.2 (B1, B4, X1 y X3).** En `src/screens/login/index.test.tsx`:
  - `it('#167 R6: con error, el error va entre la contraseña y el envío')`.
    Envía con credenciales inválidas. Exige que, dentro de `login-body`, el
    orden de `[login-email, login-password, login-error, login-submit,
    link-register, link-forgot]` sea exactamente ese.
  - `it('#167 R6: sin error, el cuerpo no lleva el error')`. Sin enviar, la
    misma lista sale sin `login-error`.
  - `it('#167 R6: la cabecera va antes que el cuerpo en el scroll')`. El
    abuelo de `login-header` es `login-form`, y los hijos de su padre son
    exactamente `[login-header, login-body]`.
  - `it('#167 R6: el título de la cabecera conserva su clase')`. Exige un
    `toBe` de la `className` de «Iniciar sesión» dentro de `login-header`.
- **R7.1 y R7.3 (B4, B3 y X4).** En `src/screens/register/index.test.tsx`:
  - `it('#167 R7: el título de la cabecera conserva su clase')`. Igual que el
    de login, con «Crear cuenta» dentro de `register-header`.
  - `it('#167 R7: campos, errores, términos y envío cuelgan del scroll')`. Son
    las igualdades de padre de la sección anterior. Su última línea exige que
    el primer hijo del contenedor sea `register-header` (X4).
- **R10.1 y R10.3 (B2, O4, X2 y X5).** En `src/screens/reset-password/index.test.tsx`:
  - `it('#167 R10: el éxito conserva la cabecera del formulario')`. Tras un
    restablecimiento válido, `reset-header` tiene `index: 0` y la `className`
    de R10.1, y dos hijos: `reset-pingo` y el título «Restablecer contraseña».
  - `it('#167 R10: con error, el error va entre la confirmación y el envío')`.
    Con `invalid-token`, el orden dentro de `reset-body` es exactamente
    `[reset-password, reset-password-confirm, reset-error, reset-submit]`.
  - `it('#167 R10: sin error, el cuerpo no lleva el error')`. Sin enviar,
    `reset-body` no contiene `reset-error`.
  - `it('#167 R10: la cabecera va antes que el cuerpo en el scroll')`. El
    abuelo de `reset-header` es `reset-password-form`, y los hijos de su padre
    son exactamente `[reset-header, reset-body]`.

### Cómo se prueba que los candados vigilan (CHECKPOINTS.md C4, quinto punto)

Son candados sobre código **ya correcto**. Por eso su rojo es una **mutación de
producción**: se versiona en el commit rojo y se revierte en el verde, que
restaura el fichero desde `108bd291`. Hay un par rojo/verde por pantalla, y
cada mutación del rojo junta las sondas del reviewer que quedaron verdes en
esa pantalla. Cada mutación es un parche versionado en
`specs/mobile-account-screens-pingo/e1/`:

| Par | Parche | Mutación versionada | Rojo medido |
|---|---|---|---|
| R6 | `login.diff` | el error pasa detrás de `link-forgot` sin ternario (A y H1), el título a `text-xl` (R2) y la cabecera detrás del cuerpo (H2) | `4 failed, 20 passed, 24 total` |
| R7 | `register.diff` | `register-submit` envuelto en un `View` (O1) y el título a `text-xl` (R1) | `2 failed, 21 passed, 23 total` |
| R10 | `reset-password.diff` | la cabecera del éxito con `index={3}` y `className="items-center gap-8"` (G), el error sin ternario como primer hijo de `reset-body` (H1b y N) y la cabecera del formulario detrás del cuerpo (H2b) | `4 failed, 29 passed, 33 total` |

En cada par fallan exactamente los `it` nuevos de esa pantalla, todos por
aserción, y ningún otro `it`.

Después vienen seis sondas sin commit sobre el árbol verde (S1-S6 en
tasks.md), cada una con su recuento esperado:

- S1-S4 cubren los otros sitios de R7.3 donde un `View` intermedio o un
  `FieldError` fuera de su campo romperían el candado;
- S5 cubre el orden de los hijos de la cabecera de éxito;
- S6 cubre la posición de `register-header` (X4), que el rojo de R7 no puede
  probar porque el `it` cae antes, en la línea del envío.

Todo medido en un spike sobre `a27664f8`:

- verde: `24 + 23 + 33`;
- BASE de 13 ficheros: `443 passed`, que son 433 + 10;
- `typecheck` y `expo lint` limpios, con y sin las mutaciones.

### Fuera de E1

- **Título del reset.** R10.1 dice «el título existente», sin clase. E1 no
  amplía R10.
- **X6 (cláusulas de disposición del fuente).** Comentarios `// #167 R2` y
  posiciones de filas en `ui-copy-table.ts`. El reviewer no pide cambios.
- **O5 (`selectable` en `login-error` y `register-error`).** Es deuda anterior
  a #167. Se registra en #172 en el cierre.
- **O6 (título «36 ocurrencias» con la cuenta en 37).** Es cosmético. Se
  registra junto a O5.
- **O2 (frontmatter `draft` en design, tasks y traceability).** El leader lo
  alinea en el cierre.

### Aprobación de la Enmienda E1

- [ ] Enmienda E1 aprobada por humano (fecha: ____, vía Notion) ← gate obligatorio antes de la ronda 2 de Codex
