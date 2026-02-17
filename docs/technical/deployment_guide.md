# Deployment & Installation Guide

This guide details how to set up the **Peadological** platform on a Linux/Unix environment (or macOS).

## 1. System Requirements

- **Operating System**: Linux (Ubuntu 20.04+ recommended) or macOS.
- **Runtime Dependencies**:
  - **Java 17+**: Required for the Spring Boot Backend.
  - **Node.js 18+**: Required for the Next.js Frontend.
  - **Python 3.9+**: Required for the Whisper AI Service.
  - **PostgreSQL**: Required database.
  - **FFmpeg**: Required for audio processing by Whisper.

## 2. Project Structure

The repository consists of three main microservices:

1.  `backend/`: Java Spring Boot application (API & Business Logic).
2.  `frontend/`: Next.js React application (UI).
3.  `whisper-service/`: Python FastAPI application (AI Transcription).

## 3. Configuration

### Backend

Ensure `backend/src/main/resources/application.yaml` is configured with your database credentials.

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/peadological
    username: your_db_user
    password: your_db_password
```

### AI Service

The Whisper service requires an NVIDIA API key if using cloud inference, or sufficient VRAM for local inference. Check `whisper-service/.env` (create if needed).

## 4. Installation & Startup

We provide a convenience script `start_services.sh` to scaffold and launch the entire stack.

### Step 1: Clone and Prepare

```bash
git clone <repository-url>
cd peadological
chmod +x start_services.sh
```

### Step 2: Run the Start Script

This script will:

1.  Create a Python virtual environment and install dependencies (`requirements.txt`).
2.  Start the **Whisper Service** on Port `8000`.
3.  Build and start the **Spring Boot Backend** on Port `8080`.
4.  Install Node modules and start the **Frontend** on Port `3000`.

```bash
./start_services.sh
```

### Step 3: Verify Deployment

Access the following URLs to verify the services are running:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080/api/health](http://localhost:8080/api/health) (or comparable endpoint)
- **Whisper AI**: [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)

## 5. Troubleshooting

- **Port Conflicts**: Ensure ports 3000, 8080, and 8000 are free.
- **Database Connection**: If the backend fails to start, verify PostgreSQL is running and credentials in `application.yaml` are correct.
- **Python venv**: If the AI service fails, try manually creating the venv:
  ```bash
  cd whisper-service
  python3 -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt
  ```
