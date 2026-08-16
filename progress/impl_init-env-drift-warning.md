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
