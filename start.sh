#!/usr/bin/env bash
set -e

# Ga naar de root van de repo (waar dit script staat)
cd "$(dirname "$0")"

# Start de FastAPI app op de poort die Render toewijst
uvicorn app.main:app --host 0.0.0.0 --port "$PORT"