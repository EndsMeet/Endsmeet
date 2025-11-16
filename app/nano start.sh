#!/bin/bash

# Stop running processes on the same ports
pkill -f "uvicorn" 2>/dev/null
pkill -f "next dev" 2>/dev/null

# Start backend
echo "Starting backend on 8020..."
source .venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8020 &

# Start frontend
echo "Starting frontend on 3010..."
cd frontend
npm run dev -- -p 3010

