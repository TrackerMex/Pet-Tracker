#!/usr/bin/env bash
# Espera el marcador que Codex deja al terminar su implementación y avisa al
# leader por Herdr para que lance el reviewer. No lee el contenido de Codex:
# solo pasa la referencia que trae el marcador.
#
# Uso: scripts/harness/watch-impl.sh <marcador-absoluto> [agente-leader]
#   marcador      progress/impl_<feature>.done dentro del worktree de la feature
#   agente-leader nombre del agente Herdr del leader (por defecto: leader)
set -euo pipefail

marker="$1"
leader="${2:-leader}"

while [ ! -e "$marker" ]; do
  sleep 15
done

ref=$(tr '\n' ' ' < "$marker" | head -c 300)

# El leader puede estar ocupado; esperar a idle evita encolar el prompt a medias.
herdr agent wait "$leader" --until idle --timeout 1800000 >/dev/null
# Sin --wait: es un aviso, no hace falta esperar la respuesta del leader.
herdr agent prompt "$leader" "Implementación lista: ${ref}Lanza reviewer con esa referencia."
