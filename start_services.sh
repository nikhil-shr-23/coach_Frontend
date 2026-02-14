#!/bin/bash
#./start_services.sh
# Function to kill all background processes on exit
cleanup() {
    echo "Stopping all services..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

echo "Starting Pedagogical Services..."

# 1. Start Whisper Service (Port 8000)
echo "Starting Whisper Service on port 8000..."
cd whisper-service
# Check if venv exists, if not create it
if [ ! -d "venv" ]; then
    echo "Creating python virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    echo "Installing dependencies..."
    pip install -r requirements.txt
else
    source venv/bin/activate
fi
uvicorn main:app --reload --port 8000 &
WHISPER_PID=$!
cd ..

# 2. Start Backend Service (Port 8080)
echo "Starting Spring Boot Backend on port 8080..."
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ..

# 3. Start Frontend Service (Port 3000)
echo "Starting Next.js Frontend on port 3000..."
cd frontend
# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
npm run dev &
FRONTEND_PID=$!
cd ..

echo "All services started!"
echo "Whisper Service: http://localhost:8000"
echo "Backend API:     http://localhost:8080"
echo "Frontend App:    http://localhost:3000"
echo "Press Ctrl+C to stop all services."

# Wait for all background processes
wait
