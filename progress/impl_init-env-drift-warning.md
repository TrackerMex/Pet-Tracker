# Implementación — init-env-drift-warning (#23)

## T0 — Línea base de `init.sh` §2

Comando ejecutado antes de editar `init.sh`:

```bash
./init.sh 2>&1 | sed -n '/→ Verificando variables de entorno/,/→ Instalando dependencias/p' > /tmp/env-section-antes.txt
```

Contenido capturado:

```text
→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida

→ Instalando dependencias...
```

## Decisiones de implementación

- R7, R8 y R9 dependen del mismo bloque literal de `init.sh`. Para conservar
  un rojo propio por requisito antes de esa implementación compartida, sus
  tests se commitean por separado y el bloque se inserta después de los tres.
