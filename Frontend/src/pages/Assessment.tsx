import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import QuizStart from "@/components/assessment/QuizStart";
import AlphabetQuiz from "@/components/assessment/AlphabetQuiz";
import WordQuiz from "@/components/assessment/WordQuiz";

type QuizMode = "idle" | "alphabet" | "word";

interface HighScores {
  alphabet: number[];
  words: number[];
}

const Assessment = () => {
  const [mode, setMode] = useState<QuizMode>("idle");
  const [highScores, setHighScores] = useState<HighScores>({
    alphabet: [],
    words: []
  });

  // Load scores on mount
  useEffect(() => {
    const saved = localStorage.getItem("signsiksha_highscores");
    if (saved) {
      try {
        setHighScores(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse high scores", e);
      }
    }
  }, []);

  const saveScore = (type: "alphabet" | "words", score: number) => {
    setHighScores(prev => {
      const newScores = {
        ...prev,
        [type]: [...prev[type], score]
      };
      localStorage.setItem("signsiksha_highscores", JSON.stringify(newScores));
      return newScores;
    });
    setMode("idle");
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl min-h-[calc(100vh-80px)]">
        {mode === "idle" && (
          <QuizStart
            onStartAlphabet={() => setMode("alphabet")}
            onStartWord={() => setMode("word")}
            highScores={highScores}
          />
        )}

        {mode === "alphabet" && (
          <AlphabetQuiz
            onComplete={(score) => saveScore("alphabet", score)}
            onExit={() => setMode("idle")}
          />
        )}

        {mode === "word" && (
          <WordQuiz
            onComplete={(score) => saveScore("words", score)}
            onExit={() => setMode("idle")}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default Assessment;
