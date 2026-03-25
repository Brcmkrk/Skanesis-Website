# Authentication Service

This repository contains the standalone authentication service, split into a React frontend and a Python (FastAPI/Flask) backend with Firebase integration.

## Folder Structure

- `frontend/`: The React-based Authentication UI.
- `backend/`: The Python API that serves the frontend and handles authentication logic.
  - `backend/main.py`: The entry point for the Flask web server.
  - `backend/auth.py`: The Authentication API endpoints.
  - `backend/authenticationLogic/`: The core logic for communicating with Firebase.
- `jsons/`: Contains the Firebase Admin SDK credentials.

## Prerequisites

- Python 3.9+
- Node.js & npm

## Setup & Running

**1. Firebase Credentials** 
Ensure your Firebase Admin SDK JSON is placed inside the `jsons` folder:
`jsons/skanesis-database-firebase-adminsdk-fbsvc-636734c58e.json`

**2. Frontend Setup**
```bash
cd frontend
npm install
npm run build
```
*(The React build output will be served by the Python backend.)*

**3. Backend Setup**
Install the necessary Python dependencies (such as `flask`, `flask_cors`, `firebase_admin`):
```bash
pip install flask flask-cors firebase-admin
```

**4. Run the Server**
```bash
cd backend
python main.py
```
The server will start on `http://0.0.0.0:5000` and will serve both the static React frontend and the `/api/auth` endpoints.
