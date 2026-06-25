#!/usr/bin/env bash
set -euo pipefail

if docker info >/dev/null 2>&1; then
  exit 0
fi

echo "Docker daemon is not running."

case "$(uname -s)" in
  Darwin)
    echo "Starting Docker Desktop..."
    open -a Docker 2>/dev/null || open -a "Docker Desktop" 2>/dev/null || true
    ;;
  Linux)
    if command -v systemctl >/dev/null 2>&1; then
      echo "Try: sudo systemctl start docker"
    fi
    ;;
esac

echo -n "Waiting for Docker"
for _ in $(seq 1 90); do
  if docker info >/dev/null 2>&1; then
    echo ""
    echo "Docker is ready."
    exit 0
  fi
  printf "."
  sleep 2
done

echo ""
echo "Error: Docker did not become ready in time."
echo "Start Docker Desktop manually, then run: make up"
exit 1
