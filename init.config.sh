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
TEST_CMD="pnpm -C backend-pet-tracker test --passWithNoTests && pnpm -C infra test --passWithNoTests && node --test env-drift.test.mjs && bun run --cwd mobile-pet-tracker test"
LINT_CMD="pnpm -C backend-pet-tracker run lint && pnpm -C infra run lint && bun run --cwd mobile-pet-tracker lint"
TYPECHECK_CMD="pnpm -C backend-pet-tracker exec tsc --noEmit && pnpm -C infra exec tsc --noEmit && bun run --cwd mobile-pet-tracker typecheck"

# Tests e2e. Viven en backend-pet-tracker/test/ como *.e2e-spec.ts con su
# propia config (test/jest-e2e.json), así que TEST_CMD no los alcanza:
# ese jest usa rootDir "src" y testRegex ".*\.spec\.ts$".
E2E_CMD="pnpm -C backend-pet-tracker run test:e2e"

# Puertos que deben responder para que los e2e tengan sentido (docker-compose).
# Si no responden, init.sh los salta con aviso en vez de fallar.
E2E_REQUIRED_PORTS=(5432 4566)
