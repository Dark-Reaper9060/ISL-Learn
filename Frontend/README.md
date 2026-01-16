# SignSiksha

**SignSiksha** is an AI-powered educational platform designed to teach Indian Sign Language (ISL). It uses a modern web stack for the frontend and a Python-based deep learning backend for real-time sign recognition.

## Getting Started

### Prerequisites

*   Node.js & npm
*   Python 3.8+ (for Backend)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <YOUR_GIT_URL>
    cd signbridge-isl
    ```

2.  **Frontend Setup:**
    ```sh
    npm install
    npm run dev
    ```

3.  **Backend Setup:**
    Navigate to the `Backend` directory (conceptually, if part of same repo structure).
    ```sh
    cd ../Backend
    pip install -r requirements.txt
    python app.py
    ```

## Technologies Used

*   **Frontend:** Vite, React, TypeScript, Tailwind CSS, shadcn/ui
*   **Backend:** FastAPI, TensorFlow/Keras, MediaPipe
