#!/bin/bash

# Simpel startscript voor EndsMeet

# Altijd in de project-root beginnen
cd /Users/jonathanmorrison/endsmeet/endsmeet || exit 1

echo "🔹 Stop oude backend/frontend (als die nog draaien)..."
pkill -f "uvicorn" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

echo "🔹 Activeer virtualenv..."
source .venv/bin/activate

echo "🔹 Start backend op poort 8020..."
uvicorn app.main:app --reload --host 127.0.0.1 --port 8020 &

# heel klein beetje wachten zodat backend kan opstarten
sleep 2

echo "🔹 Start frontend op poort 3010..."
cd frontend || exit 1
npm run dev -- -p 3010
