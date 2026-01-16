# Project Analysis: SignSiksha

## Overview
**SignSiksha** is an AI-powered educational platform designed to teach Indian Sign Language (ISL). It uses a modern web stack for the frontend and a Python-based deep learning backend for real-time sign recognition.

## System Architecture

### 1. Frontend (Client-Side)
*   **Location:** `Frontend/`
*   **Tech Stack:** 
    *   **Framework:** React (Vite)
    *   **Language:** TypeScript
    *   **Styling:** Tailwind CSS + shadcn/ui
    *   **Runtime:** Browser
*   **Key Components:**
    *   **`CameraPreview.tsx`**: Manages the user's webcam feed. It captures video frames, draws them to a hidden canvas, and converts them to Base64 strings.
    *   **`useWebSocket.ts`**: A custom hook that manages the WebSocket connection. It handles connection stability, sends video frames to the backend, and dispatches received predictions to the UI.
    *   **Assessment Module** (`src/components/assessment/`):
        *   **`QuizStart.tsx`**: The main hub for the quiz section, featuring a mode selection menu and a **Scoreboard** (powered by `localStorage`).
        *   **`AlphabetQuiz.tsx`**: A timed quiz (15s/question) where users must sign a specific random letter.
        *   **`WordQuiz.tsx`**: A sequential recognition challenge where users spell out full words letter-by-letter.
        *   **Features**: Both quiz modes include real-time **Confidence Level** visualization (progress bars) to give users immediate feedback on how well the AI recognizes their sign.

### 2. Backend (Server-Side)
*   **Location:** `Backend/`
*   **Tech Stack:**
    *   **Framework:** FastAPI (Python)
    *   **ML Libraries:** TensorFlow/Keras, MediaPipe, OpenCV
*   **Key Components:**
    *   **`app.py`**: The core application entry point. It serves a WebSocket endpoint at `/ws/predict`.
    *   **MediaPipe HandLandmarker**: Pre-processing step. It detects hands in the incoming frame to:
        1.  Verify a hand is present.
        2.  Extract 21 3D hand landmarks.
        3.  Calculate a bounding box to crop the image, removing background noise.
    *   **Dual-Stream Model (`fusion_effnet_customcnn_best.h5`)**: A complex hybrid model that accepts two inputs:
        1.  **Raw Image Stream:** The cropped hand image, resized to 224x224 and preprocessed for EfficientNet.
        2.  **Landmark Image Stream:** A synthetic black image where the detected landmarks and connections are drawn (Skeleton view).
    *   **Inference Logic:** The model fuses these two features to predict the sign class (A-Z) with a confidence score. Code logic handles "Noise" (no hand/low confidence).

## Data Flow Pipeline

1.  **Capture**: Browser captures webcam video stream.
2.  **Transmission**: Client extracts a frame, converts to Base64, reduces resolution (likely), and sends it to `ws://localhost:8000/ws/predict`.
3.  **Reception & Decode**: FastAPI receives the JSON payload, decodes Base64 to a NumPy array (OpenCV image).
4.  **Hand Extraction (MediaPipe)**: 
    *   System runs MediaPipe Hand Landmarker.
    *   If no hand is found -> Returns "Noise".
    *   If hand found -> Computes bounding box with padding (`OFFSET`).
5.  **Feature Engineering**:
    *   **Input A**: Crop original image -> Resize to 224x224 -> EfficientNet Preprocess.
    *   **Input B**: Create blank canvas -> Draw detected landmarks (Lines/Points) -> Resize to 224x224 -> Normalize.
6.  **Inference**:
    *   `model.predict([Input A, Input B])`
    *   Returns Softmax probabilities.
7.  **Response**:
    *   Server sends JSON `{ "label": "A", "confidence": 0.99 }` back to client.
8.  **Feedback**:
    *   React updates the UI state:
        *   **Learning Mode**: Progress bar updates.
        *   **Quiz Mode**: Real-time confidence overlay updates; if threshold (>90%) and stability (>1.5s) are met, the question is marked correct.

## Key Files
- **Backend**: `app.py` (Orchestrator), `Model/fusion_effnet_customcnn_best.h5` (Brains).
- **Frontend**: 
    - `hooks/useWebSocket.ts` (Comms)
    - `components/learn/CameraPreview.tsx` (Input)
    - `pages/Assessment.tsx` (Quiz Orchestrator)
