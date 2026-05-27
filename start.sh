#!/bin/bash

echo "=============================================="
echo " Starting Ecoberg (Django + React ecosystem)  "
echo "=============================================="

# Define cleanup procedure
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Trap exit signals
trap cleanup EXIT INT TERM

# 1. Start Django Backend
echo "[1/2] Starting Django backend on port 8000..."
cd backend
source venv/bin/activate
python manage.py runserver 127.0.0.1:8000 &
BACKEND_PID=$!
cd ..

# 2. Wait a moment
sleep 2

# 3. Start Vite Frontend
echo "[2/2] Starting Vite frontend server..."
npm run dev -- --host &
FRONTEND_PID=$!

echo "=============================================="
echo " Ecoberg is now running!"
echo " Backend: http://127.0.0.1:8000/api/"
echo " Frontend: check Vite output below"
echo " Press Ctrl+C to stop both servers."
echo "=============================================="

# Wait for both processes to complete
wait $BACKEND_PID $FRONTEND_PID
