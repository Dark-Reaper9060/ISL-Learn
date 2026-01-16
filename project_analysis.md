# Project Analysis: SignSiksha

## Overview
**SignSiksha** is an AI-powered educational platform designed to teach Indian Sign Language (ISL). It uses a modern web stack for the frontend and a Python-based deep learning backend for real-time sign recognition, now integrated with a PostgreSQL database for comprehensive user management and progress tracking.

## System Architecture

### 1. Frontend (Client-Side)
*   **Tech Stack:** 
    *   **Framework:** React (Vite)
    *   **Language:** TypeScript
    *   **Styling:** Tailwind CSS + shadcn/ui
    *   **State Management:** React Context (Auth) + React Query
    *   **Runtime:** Browser
*   **Key Components:**
    *   **`AuthContext.tsx`**: Manages user authentication state, session persistence, and login/logout functionality.
    *   **`CameraPreview.tsx`**: Manages the user's webcam feed, capturing frames and converting them for WebSocket transmission.
    *   **`useWebSocket.ts`**: Handles the resilient WebSocket connection to the AI inference engine.
    *   **`ProtectedRoute.tsx`**: A higher-order component that secures private routes (`/profile`, `/assessment`) from unauthenticated access.
    *   **Assessment Module**:
        *   **`Assessment.tsx`**: Orchestrates the quiz flow, fetching high scores from the API for logged-in users while maintaining a local fallback for guests.
        *   **`AlphabetQuiz.tsx`** & **`WordQuiz.tsx`**: Interactive testing modules with real-time AI feedback and stability checks.
    *   **User Module**:
        *   **`Login.tsx`**: Handles user registration and authentication.
        *   **`Profile.tsx`**: Visualizes user statistics, total quizzes taken, and best scores using data fetched from the backend.

### 2. Backend (Server-Side)
*   **Tech Stack:**
    *   **Framework:** FastAPI (Python)
    *   **Database:** PostgreSQL (with SQLAlchemy ORM)
    *   **ML Libraries:** TensorFlow/Keras, MediaPipe, OpenCV
    *   **Security:** Passlib (pbkdf2_sha256) for password hashing
*   **Key Components:**
    *   **`app.py`**: The application entry point, integrating the AI WebSocket endpoint (`/ws/predict`) with the REST API router.
    *   **`database.py`**: Manages the PostgreSQL connection pool and session lifecycle.
    *   **`routes.py`**: Defines REST endpoints for User Registration, Login, Score Submission, and Profile Retrieval.
    *   **`models.py`**: Defines the SQL schema for `User` (credentials, metadata) and `Score` (quiz results, timestamps).
    *   **AI Engine**:
        *   **MediaPipe HandLandmarker**: Extracts 21 3D hand landmarks and computes bounding boxes.
        *   **Dual-Stream Model**: Fuses raw image data (EfficientNet) with skeletal landmark data to predict ISL signs with high robustness against noise.

## Data Flow Pipeline

1.  **Capture**: Browser captures webcam video stream.
2.  **Transmission**: Video frames are sent via WebSocket to the inference engine.
3.  **Inference**: The Dual-Stream model predicts the sign class and confidence score.
4.  **Feedback**: The frontend receives the prediction and updates the active confidence meter.
5.  **Scoring & Persistence**:
    *   Upon quiz completion, the final score is calculated.
    *   **Guest**: Score is saved to `localStorage`.
    *   **User**: `Assessment.tsx` POSTs the score to the `/scores/` API endpoint, where it is securely stored in PostgreSQL linked to the unique `user_id`.

## Key Files
-   **Backend**: `app.py`, `models.py`, `routes.py`, `crud.py`.
-   **Frontend**: `App.tsx` (Routing), `AuthContext.tsx`, `Assessment.tsx`, `Profile.tsx`.
