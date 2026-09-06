#!/bin/bash

# FFCS Timetable Generator - Dev Server Launcher

cleanup() {
    echo ""
    echo "------------------------------------------"
    echo "🛑 Stopping dev servers..."
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null
    fi
    echo "Done."
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "=========================================="
echo "🚀 Starting FFCS Timetable Generator"
echo "=========================================="

# Ensure frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    (cd frontend && npm install)
fi

# Start Backend Server
echo "🐍 Starting Flask Backend Server..."
python3 app.py > /dev/null 2>&1 &
BACKEND_PID=$!

# Start Frontend Server
echo "⚡ Starting Vite Frontend Server..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

# Display server information
sleep 2
echo ""
echo "=========================================="
echo "✨ Development Servers Running!"
echo "📡 Backend API:  http://localhost:8080"
echo "💻 Frontend UI:   http://localhost:5173"
echo "=========================================="
echo "Press Ctrl+C to stop both servers."
echo ""

wait $FRONTEND_PID $BACKEND_PID
