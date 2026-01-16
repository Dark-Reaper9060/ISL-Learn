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

import { useAuth } from "@/context/AuthContext";

const Assessment = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<QuizMode>("idle");
  const [highScores, setHighScores] = useState<HighScores>({
    alphabet: [],
    words: []
  });

  // Load scores on mount or user change
  useEffect(() => {
    const loadScores = async () => {
      // 1. Always load local scores first (for guests or as fallback)
      const saved = localStorage.getItem("signsiksha_highscores");
      if (saved) {
        try {
          setHighScores(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse high scores", e);
        }
      }

      // 2. If user is logged in, fetch authoritative scores from DB
      if (user) {
        try {
          const res = await fetch(`http://localhost:8000/users/${user.id}`);
          if (res.ok) {
            const data = await res.json();
            // Transform API scores to HighScores format
            // API: [{score: 10, quiz_type: "alphabet"}, ...]
            const alphabetScores = data.scores
              .filter((s: any) => s.quiz_type === "alphabet")
              .map((s: any) => s.score);
            const wordScores = data.scores
              .filter((s: any) => s.quiz_type === "words")
              .map((s: any) => s.score);

            setHighScores({
              alphabet: alphabetScores,
              words: wordScores
            });
          }
        } catch (e) {
          console.error("Failed to fetch user scores", e);
        }
      }
    };

    loadScores();
  }, [user]);

  const saveScore = async (type: "alphabet" | "words", score: number) => {
    // 1. Save to Local State & Storage (Legacy/Guest)
    setHighScores(prev => {
      const newScores = {
        ...prev,
        [type]: [...prev[type], score]
      };
      localStorage.setItem("signsiksha_highscores", JSON.stringify(newScores));
      return newScores;
    });

    // 2. Save to Database (if logged in)
    if (user) {
      try {
        await fetch(`http://localhost:8000/scores/?user_id=${user.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quiz_type: type,
            score: score
          })
        });
      } catch (e) {
        console.error("Failed to save score to database", e);
      }
    }

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
