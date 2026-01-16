## Title of Accessibility Problem Statement
Bridging the Communication Gap: AI-Powered Interactive Indian Sign Language (ISL) Learning Platform

## Brief Description of Accessibility Problem Statement
Millions of deaf and hard-of-hearing individuals in India face significant communication barriers due to the general public's limited knowledge of Indian Sign Language (ISL). Traditional methods of learning ISL, such as physical classes or static video tutorials, often lack accessibility, scalability, and, most importantly, immediate feedback. Learners watching static videos struggle to determine if they are mirroring the signs correctly, leading to incorrect practice and low retention rates. This educational gap perpetuates social isolation for the Deaf community and limits opportunities for inclusive interaction in hearing-dominant environments.

## Brief Description of Solution
SignSiksha is a browser-based, interactive learning platform that democratizes ISL education through Artificial Intelligence. It solves the "feedback loop" problem by using computer vision to act as a personal, virtual instructor.

By leveraging a standard webcam and advanced deep learning models (MediaPipe and Custom CNNs), SignSiksha tracks the user's hand movements in real-time. It compares the user's gesture against a database of ISL signs and provides instant visual corrections—visualized as success indicators and confidence bars. This allows learners to correct their form immediately.

The platform gamifies the experience with "Alphabet Blitz" and "Word Master" quizzes, making learning engaging and measurable. By removing the need for specialized hardware or in-person tutors, SignSiksha makes effective ISL learning accessible to anyone with an internet connection.

## Explanation of Details
SignSiksha integrates a modern, responsive frontend with a robust AI backend to deliver a seamless educational experience.

### 1. Technology Stack
*   **Frontend**: Built with **React**, **TypeScript**, and **Tailwind CSS**, providing a WCAG-compliant, accessible user interface. It manages camera access and visualizes feedback.
*   **Backend**: A **Python FastAPI** server backed by **PostgreSQL**. It processes video frames using **MediaPipe** (for hand landmark extraction) and **TensorFlow/Keras** (for sign classification), and manages user data securely.

### 2. Core Features
*   **Real-Time Assessment**: The system analyzes video frames at ~10 FPS, providing instantaneous feedback. A unique "Confidence Meter" shows users exactly how accurate their sign is (e.g., "85% match").
*   **User Profiles & Analytics**: Learners can create personal accounts to save their progress. The system tracks quiz history, calculating statistics like "Best Alphabet Score" and "Total Quizzes Taken" to visualize improvement over time.
*   **Dual-Stream AI Model**: To ensure high accuracy, the underlying model analyzes both the raw image of the hand and the geometric skeleton of the fingers. This makes it robust against varied lighting and backgrounds.
*   **Interactive Quizzes**:
    *   **Alphabet Quiz**: A timed mode to practice individual letters (A-Z).
    *   **Word Quiz**: A sequential mode where users must spell entire words (e.g., H-E-L-L-O), implementing a stability check (must hold sign for 1.5s) to ensure mastery.
*   **Progress Tracking**: A robust database system persists user scores across sessions, ensuring that learning milestones are never lost. Using PostgreSQL, we securely store user credentials and performance metrics.
