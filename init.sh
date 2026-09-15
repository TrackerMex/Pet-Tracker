#!/usr/bin/env bash
# init.sh — Verificación e inicialización del proyecto (stack-agnóstico)
# Debe terminar con exit code 0 para que el harness esté en estado válido.
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# shellcheck source=./init.config.sh
source ./init.config.sh

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ok()   { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
fail() { echo -e "${RED}❌ $1${NC}"; exit 1; }

# Node colorea los valores no-string de console.log cuando FORCE_COLOR viene del
# entorno — Claude Code lo exporta como 3. Esas secuencias ANSI acaban dentro de
# las cadenas que este script captura, y entonces "0" deja de ser igual a 0: la
# comprobación de features in_progress reportaba "Más de 1 feature en in_progress
# (0)" y abortaba el arranque. Ninguna de estas consultas quiere color: su salida
# va a una variable, no a la terminal.
nodeq() { FORCE_COLOR=0 node "$@"; }

# ¿Hay algo escuchando en host:puerto? Sin dependencias externas: nc/lsof no
# están garantizados en Git Bash ni en los runners.
port_open() {
  (exec 3<>"/dev/tcp/$1/$2") 2>/dev/null || return 1
  exec 3<&-
  return 0
}

echo ""
echo "══════════════════════════════════════════"
echo "  INIT — ${PROJECT_NAME} (Harness SDD)"
echo "══════════════════════════════════════════"
echo ""

# ── 1. ENTORNO ──────────────────────────────
echo "→ Verificando entorno..."

for tool in "${REQUIRED_TOOLS[@]}"; do
  command -v "$tool" > /dev/null 2>&1 || fail "${tool} no encontrado. Instálalo antes de continuar"
  ok "${tool} disponible ($(command -v "$tool"))"
done

# ── 2. VARIABLES DE ENTORNO ─────────────────
echo ""
echo "→ Verificando variables de entorno..."

if [ "${#REQUIRED_ENV_VARS[@]}" -eq 0 ]; then
  warn "Sin variables de entorno requeridas configuradas en init.config.sh"
else
  if [ ! -f .env ]; then
    if [ -f .env.example ]; then
      warn ".env no encontrado. Copiando desde .env.example..."
      cp .env.example .env
      warn "Edita .env con tus credenciales antes de continuar"
    else
      fail ".env no encontrado y no existe .env.example"
    fi
  else
    ok ".env encontrado"
  fi

  check_env() {
    local var=$1
    if grep -q "^${var}=" .env 2>/dev/null; then
      ok "  ${var} definida"
    else
      warn "  ${var} no definida en .env (puede causar errores en runtime)"
    fi
  }

  for var in "${REQUIRED_ENV_VARS[@]}"; do
    check_env "$var"
  done
fi

# Deriva de claves entre .env y .env.example (#23). Solo avisa: no copia
# valores, no escribe .env y no aborta. El diff lo hace node —ya es
# REQUIRED_TOOL y este script ya lo usa más arriba— porque .env.example
# esta commiteado con CRLF y sort/comm/grep de Git Bash tropiezan con ellos.
if [ -f .env ] && [ -f .env.example ]; then
  ENV_DRIFT="$(nodeq env-drift.mjs || true)"
  if [ -n "$ENV_DRIFT" ]; then
    while IFS= read -r drift_line; do
      warn "$drift_line"
    done <<< "$ENV_DRIFT"
  fi
fi

# ── 3. DEPENDENCIAS ─────────────────────────
echo ""
echo "→ Instalando dependencias..."
if [ -n "$INSTALL_CMD" ]; then
  eval "$INSTALL_CMD"
  ok "Dependencias instaladas"
else
  warn "INSTALL_CMD vacío en init.config.sh — se salta instalación"
fi

# ── 4. HARNESS — coherencia del arnés ───────
echo ""
echo "→ Verificando coherencia del harness..."

[ -f AGENTS.md ]             || fail "AGENTS.md no encontrado"
[ -f CLAUDE.md ]             || fail "CLAUDE.md no encontrado"
[ -f CHECKPOINTS.md ]        || fail "CHECKPOINTS.md no encontrado"
[ -f STATUS.md ]             || fail "STATUS.md no encontrado"
[ -f feature_list.json ]     || fail "feature_list.json no encontrado"
[ -f init.config.sh ]        || fail "init.config.sh no encontrado"
[ -f progress/current.md ]   || fail "progress/current.md no encontrado"
[ -d specs ]                 || fail "specs/ no encontrado"
[ -d specs/_template ]       || fail "specs/_template/ no encontrado"
[ -f specs/_template/requirements.md ] || fail "specs/_template/requirements.md no encontrado"
[ -f specs/_template/design.md ]       || fail "specs/_template/design.md no encontrado"
[ -f specs/_template/tasks.md ]        || fail "specs/_template/tasks.md no encontrado"
[ -f specs/_template/traceability.md ] || fail "specs/_template/traceability.md no encontrado"
[ -f docs/architecture.md ]  || fail "docs/architecture.md no encontrado"
[ -f docs/conventions.md ]   || fail "docs/conventions.md no encontrado"
[ -f docs/verification.md ]  || fail "docs/verification.md no encontrado"
[ -f docs/specs.md ]         || fail "docs/specs.md no encontrado"
[ -f docs/obsidian.md ]      || fail "docs/obsidian.md no encontrado"

for agent in leader spec_author explorer implementer reviewer; do
  [ -f ".claude/agents/${agent}.md" ] || fail ".claude/agents/${agent}.md no encontrado"
done
ok "Archivos del harness presentes"

# Verificar máximo 1 feature in_progress
IN_PROGRESS=$(nodeq -e "
  try {
    const f = require('./feature_list.json');
    console.log(f.filter(x => x.status === 'in_progress').length);
  } catch(e) {
    console.log('ERROR: ' + e.message);
    process.exit(1);
  }
")

if [ "$IN_PROGRESS" = "0" ]; then
  ok "Sin features en progreso (sesión limpia)"
elif [ "$IN_PROGRESS" = "1" ]; then
  FEATURE_NAME=$(nodeq -e "
    const f = require('./feature_list.json');
    const ip = f.find(x => x.status === 'in_progress');
    console.log(ip ? ip.name : 'unknown');
  ")
  warn "Feature en progreso: ${FEATURE_NAME}"
else
  fail "Más de 1 feature en in_progress (${IN_PROGRESS}). Resolver antes de continuar."
fi

# Verificar que toda feature in_progress/done tiene spec (requirements.md)
while IFS='|' read -r name status; do
  [ -z "$name" ] && continue
  spec_file="specs/${name}/requirements.md"
  if [ ! -f "$spec_file" ]; then
    if [ "$status" = "in_progress" ]; then
      fail "Feature '${name}' está in_progress pero falta ${spec_file}"
    else
      warn "Feature '${name}' (done) sin ${spec_file} — probablemente anterior a la adopción de specs"
    fi
  fi
done < <(nodeq -e "
  const f = require('./feature_list.json');
  f.filter(x => x.status === 'in_progress' || x.status === 'done')
   .forEach(x => console.log(x.name + '|' + x.status));
")

# Verificar que STATUS.md refleja el conteo real de feature_list.json
STATUS_SYNC=$(nodeq -e "
  const fs = require('fs');
  const f = require('./feature_list.json');
  const done = f.filter(x => x.status === 'done').length;
  const total = f.length;
  const status = fs.readFileSync('STATUS.md', 'utf8');
  const m = status.match(/Features completadas\*\*:\s*(\d+)\/(\d+)/);
  if (!m) {
    console.log('NO_MATCH');
  } else if (Number(m[1]) !== done || Number(m[2]) !== total) {
    console.log('MISMATCH:' + m[1] + '/' + m[2] + ' declarado vs ' + done + '/' + total + ' real');
  } else {
    console.log('OK');
  }
")

if [ "$STATUS_SYNC" = "OK" ]; then
  ok "STATUS.md sincronizado con feature_list.json"
elif [ "$STATUS_SYNC" = "NO_MATCH" ]; then
  warn "STATUS.md no tiene la línea 'Features completadas: X/Y' en el formato esperado"
else
  warn "STATUS.md desactualizado (${STATUS_SYNC#MISMATCH:}) — actualízalo antes de cerrar la sesión"
fi

# ── 5. BUILD ─────────────────────────────────
echo ""
echo "→ Build..."
if [ -n "$BUILD_CMD" ]; then
  eval "$BUILD_CMD" 2>&1
  ok "Build exitoso"
else
  warn "BUILD_CMD vacío en init.config.sh — se salta build"
fi

# ── 6. TESTS ─────────────────────────────────
echo ""
echo "→ Ejecutando tests..."
if [ -n "$TEST_CMD" ]; then
  eval "$TEST_CMD" 2>&1
  ok "Tests pasados"
else
  warn "TEST_CMD vacío en init.config.sh — se salta tests"
fi

# ── 6b. TESTS E2E ────────────────────────────
# >>> bloque e2e (#96) >>>
# Los e2e necesitan Postgres + LocalStack arriba. Los puertos se derivan del
# .env que consume el backend, en vez de duplicarlos en el harness.
if [ -n "$E2E_CMD" ]; then
  echo ""
  echo "→ Tests e2e..."

  env_value() {
    [ -f .env ] || return 0
    sed -n "s/^[[:space:]]*$1[[:space:]]*=[[:space:]]*//p" .env | tail -n 1 | tr -d '\r'
  }

  url_host_port() {
    local rest="${1##*@}"
    rest="${rest#*://}"
    rest="${rest%%/*}"
    case "$rest" in
      *:*) echo "${rest%:*} ${rest##*:}" ;;
      *)   echo "" ;;
    esac
  }

  E2E_INFRA_READY=true
  for e2e_key in "${E2E_PORT_SOURCES[@]}"; do
    e2e_hp="$(url_host_port "$(env_value "$e2e_key")")"
    if [ -z "$e2e_hp" ]; then
      warn "No se pudo derivar host:puerto de ${e2e_key} en .env — se saltan los e2e"
      E2E_INFRA_READY=false
      break
    fi
    e2e_host="${e2e_hp% *}"
    e2e_port="${e2e_hp#* }"
    if ! port_open "$e2e_host" "$e2e_port"; then
      warn "Infra e2e caída: ${e2e_host}:${e2e_port} no responde (derivado de ${e2e_key} en .env) — se saltan los e2e"
      E2E_INFRA_READY=false
      break
    fi
  done

  if [ "$E2E_INFRA_READY" = true ]; then
    eval "$E2E_CMD" 2>&1
    ok "Tests e2e pasados"
  fi
else
  warn "E2E_CMD vacío en init.config.sh — se saltan tests e2e"
fi
# <<< bloque e2e (#96) <<<

if [ -n "$LINT_CMD" ]; then
  echo ""
  echo "→ Lint..."
  eval "$LINT_CMD" 2>&1
  ok "Lint sin errores"
else
  warn "LINT_CMD vacío en init.config.sh — se salta lint"
fi

if [ -n "$TYPECHECK_CMD" ]; then
  echo ""
  echo "→ Typecheck..."
  eval "$TYPECHECK_CMD" 2>&1
  ok "Typecheck sin errores"
else
  warn "TYPECHECK_CMD vacío en init.config.sh — se salta typecheck"
fi

# ── 7. RESUMEN ───────────────────────────────
echo ""
echo "══════════════════════════════════════════"

PENDING_COUNT=$(nodeq -e "
  const f = require('./feature_list.json');
  console.log(f.filter(x => x.status === 'pending').length);
")
DONE_COUNT=$(nodeq -e "
  const f = require('./feature_list.json');
  console.log(f.filter(x => x.status === 'done').length);
")
TOTAL=$(nodeq -e "
  const f = require('./feature_list.json');
  console.log(f.length);
")

echo -e "${GREEN}✅ Todo verde. Listo para trabajar.${NC}"
echo ""
echo "  Features: ${DONE_COUNT}/${TOTAL} completadas | ${PENDING_COUNT} pendientes"
echo ""

if [ "$PENDING_COUNT" -gt 0 ]; then
  echo "  Próxima feature:"
  nodeq -e "
    const f = require('./feature_list.json');
    const next = f.find(x => x.status === 'pending');
    if (next) console.log('  [#' + next.id + '] ' + next.name + ' (' + next.priority + ')');
  "
fi

echo ""
