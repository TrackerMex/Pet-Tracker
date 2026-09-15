#!/usr/bin/env bash
# init.config.sh — Comandos específicos del proyecto. Editar al instalar.

PROJECT_NAME="pet-tracker"

# Binarios que deben existir en PATH
# node es necesario para las verificaciones de feature_list.json en init.sh
REQUIRED_TOOLS=("node" "pnpm" "bun")

# Variables de entorno críticas, ej: ("DATABASE_URL" "JWT_SECRET")
# .env vive en la raíz (docker-compose e init.sh lo consumen desde aquí)
REQUIRED_ENV_VARS=("DATABASE_URL")

# Comandos del stack. Vacío = saltar con aviso. Rellenar cuando el proyecto
# tenga manifest. Ejemplo NestJS/pnpm:
#   REQUIRED_TOOLS=("node" "pnpm")
#   INSTALL_CMD="pnpm install"
#   BUILD_CMD="pnpm run build"
#   TEST_CMD="pnpm test -- --passWithNoTests"
#   LINT_CMD="pnpm run lint"
#   TYPECHECK_CMD="pnpm exec tsc --noEmit"
# El backend vive en backend-pet-tracker/ — pnpm -C apunta ahí desde la raíz
INSTALL_CMD="pnpm -C backend-pet-tracker install && pnpm -C infra install && bun install --cwd mobile-pet-tracker"
BUILD_CMD="pnpm -C backend-pet-tracker run build && pnpm -C infra run synth"
TEST_CMD="pnpm -C backend-pet-tracker test --passWithNoTests && pnpm -C infra test --passWithNoTests --runInBand && node --test env-drift.test.mjs && node --test init-color.test.mjs && node --test init-e2e-gate.test.mjs && bun run --cwd mobile-pet-tracker test"
LINT_CMD="pnpm -C backend-pet-tracker run lint && pnpm -C infra run lint && bun run --cwd mobile-pet-tracker lint"
TYPECHECK_CMD="pnpm -C backend-pet-tracker exec tsc --noEmit && pnpm -C infra exec tsc --noEmit && bun run --cwd mobile-pet-tracker typecheck"

# Tests e2e. Viven en backend-pet-tracker/test/ como *.e2e-spec.ts con su
# propia config (test/jest-e2e.json), así que TEST_CMD no los alcanza:
# ese jest usa rootDir "src" y testRegex ".*\.spec\.ts$".
E2E_CMD="pnpm -C backend-pet-tracker run test:e2e"

# Puesta a punto idempotente antes de los e2e (#96): aplica las migraciones con
# su journal y crea en LocalStack los recursos de desarrollo y de test.
E2E_SETUP_CMD="pnpm -C backend-pet-tracker run db:migrate && pnpm -C backend-pet-tracker run provision:local"

# Claves del .env de cuyas URLs se deriva la infra que los e2e necesitan.
# No se duplican puertos: se sondea exactamente el destino que usa el backend.
E2E_PORT_SOURCES=("DATABASE_URL" "AWS_ENDPOINT_URL")
