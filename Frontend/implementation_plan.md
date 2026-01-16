# Assessment Section Enhancement Plan

## Goal
Expand the existing `Assessment.tsx` to support two modes: **Alphabet Quiz** (existing) and **Word Quiz** (new), and add a **Scoreboard**.

## Proposed Changes

### 1. New Components
We will split the monolithic `Assessment.tsx` into modular components in `src/components/assessment/`:
*   **`QuizStart.tsx`**: The landing screen. Displays mode selection (Alphabet vs Words) and the High Score board.
*   **`AlphabetQuiz.tsx`**: Encapsulates the logic for the single-letter recognition quiz.
*   **`WordQuiz.tsx`**: Implements the new word spelling quiz logic (sequential letter recognition).

### 2. File Modifications

#### `src/pages/Assessment.tsx`
*   **Role**: Orchestrator.
*   **State**: 
    *   `mode`: 'idle' | 'alphabet' | 'word'
    *   `highScores`: Load from `localStorage` on mount.
    *   `lastScore`: To show results after a quiz.
*   **Logic**:
    *   Polls `localStorage` for high scores.
    *   Renders `QuizStart` when idle.
    *   Renders `AlphabetQuiz` or `WordQuiz` based on selection.
    *   Handles "Quiz Completed" callbacks to update high scores and show summary.

#### `src/components/assessment/AlphabetQuiz.tsx`
*   **Source**: Migrated from current `Assessment.tsx`.
*   **Logic**: 
    *   10 random questions.
    *   15s per question.
    *   Internal `useCamera` and `useWebSocket`.
    *   Returns final score to parent on completion.

#### `src/components/assessment/WordQuiz.tsx` [NEW]
*   **Logic**:
    *   Select 5 random words from `islWords.ts`.
    *   For each word, user must sign all letters in sequence.
    *   Visuals: Progress bar for the word (e.g., H **E** L L O).
    *   Timer: 30s per word.
    *   Scoring: Points per word completed.
    *   Returns final score to parent.

### 3. Data Flow
1.  User visits `/assessment`.
2.  `Assessment.tsx` loads high scores.
3.  User clicks "Word Quiz".
4.  `Assessment.tsx` sets `mode = 'word'`.
5.  `WordQuiz` mounts, starts Camera/WS.
6.  User plays.
7.  Quiz finishes, `WordQuiz` calls `onComplete(score)`.
8.  `Assessment.tsx` updates high scores, saves to local storage, shows Result/Start screen.

## Scoreboard Implementation
*   Simple `localStorage` key: `signbridge_highscores`.
*   Format: `{ alphabet: [scores...], words: [scores...] }`.
*   Display: A card in `QuizStart` showing top 3 recent/best scores.

## Verification Plan
1.  **Manual Verification**:
    *   Start "Alphabet Quiz", ensure it works as before.
    *   Start "Word Quiz", verify word selection and sequential letter checking.
    *   Verify high scores persist after page reload.
