# Handoff a Codex CLI — D8 de #70 `mobile-home-reminders-section`

> **No corras esto hasta que el humano firme la casilla** de
> `specs/mobile-home-reminders-section/requirements.md` §Decisiones de
> implementación, entrada **D8**.

Branch: `feature/70-mobile-home-reminders-section`, publicada en `origin`.
Trabaja encima. No rebases ni reescribas historial.

**El tercer pase quedó APROBADO.** Esto no es un rechazo ni un hallazgo del
reviewer: lo destapó la **prueba de humo en dev build de Android**.

## El problema

Una mascota **con** recordatorios y **sin** vacuna próxima ve esto:

```
Título        home.reminders          "Recordatorios"
Estado vacío  home.noUpcomingVaccine  "Sin vacuna próxima"
```

El encabezado promete recordatorios; el cuerpo habla de vacunas. Ningún test lo
detecta porque los dos textos son los que la spec pidió. La conducta es correcta
—§Fuera de alcance excluye listar otros recordatorios, porque el contrato del
perfil da una sola próxima vacuna— pero el nombre promete algo que la sección no
hace.

Ampliar la sección a recordatorios reales es **#85**, feature aparte con trabajo
de backend. Aquí solo se arregla el texto.

## Qué hacer

Cambia **dos valores** del catálogo, en los dos idiomas. **No renombres las
claves**: `home.reminders` y `home.remindersSeeAll` siguen llamándose igual, para
no arrastrar el cambio a `index.tsx` ni a la longitud del catálogo.

| clave | es | en |
|---|---|---|
| `home.reminders` | `Próxima vacuna` | `Next vaccine` |
| `home.remindersSeeAll` | `Ver recordatorios` | `See reminders` |

El enlace se re-rotula porque con el título nuevo *"Ver todos"* leería como "ver
todas las vacunas", y en realidad lleva a `/reminders`.

## Lo que NO se toca

- El destino de R10 sigue siendo `/reminders`.
- Ningún `testID`, ninguna anatomía, ningún `className`.
- `home.noUpcomingVaccine` se queda como está.
- **La longitud del catálogo no se mueve**: no se añade ni se quita ninguna
  clave, así que `language-provider.test.tsx` no cambia. Si te ves tocándolo,
  para.

## Trampas conocidas

- `ui-copy-table.ts` y `ui-language.test.ts` pueden fijar los **literales**. Si
  alguno lo hace, actualiza **el literal**, nunca un recuento.
- **Si algún candado te exige mover una cifra, para y repórtalo.** Sería señal de
  que este cambio toca más de lo que dice, y eso es una contradicción con D8.

## Reglas del repo

- TDD: el rojo aquí es el candado de literal, si existe. Un commit por paso.
- Sin mutación nueva: es copy. Deja escrito en el informe qué test cayó y por qué.
- Gate `env -u FORCE_COLOR ./init.sh` desde la raíz (bug #75); comprueba antes
  con `pgrep -f "bash ./init.sh"`.
- Base roja conocida y ajena: `health-vaccines.e2e-spec.ts:497` (#76).
- Añade al informe una sección "Cuarto pase". Actualiza `traceability.md`.
  Corre `graphify update .`.
