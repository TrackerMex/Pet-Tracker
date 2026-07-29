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
IN_PROGRESS=$(node -e "
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
  FEATURE_NAME=$(node -e "
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
done < <(node -e "
  const f = require('./feature_list.json');
  f.filter(x => x.status === 'in_progress' || x.status === 'done')
   .forEach(x => console.log(x.name + '|' + x.status));
")

# Verificar que STATUS.md refleja el conteo real de feature_list.json
STATUS_SYNC=$(node -e "
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

PENDING_COUNT=$(node -e "
  const f = require('./feature_list.json');
  console.log(f.filter(x => x.status === 'pending').length);
")
DONE_COUNT=$(node -e "
  const f = require('./feature_list.json');
  console.log(f.filter(x => x.status === 'done').length);
")
TOTAL=$(node -e "
  const f = require('./feature_list.json');
  console.log(f.length);
")

echo -e "${GREEN}✅ Todo verde. Listo para trabajar.${NC}"
echo ""
echo "  Features: ${DONE_COUNT}/${TOTAL} completadas | ${PENDING_COUNT} pendientes"
echo ""

if [ "$PENDING_COUNT" -gt 0 ]; then
  echo "  Próxima feature:"
  node -e "
    const f = require('./feature_list.json');
    const next = f.find(x => x.status === 'pending');
    if (next) console.log('  [#' + next.id + '] ' + next.name + ' (' + next.priority + ')');
  "
fi

echo ""
