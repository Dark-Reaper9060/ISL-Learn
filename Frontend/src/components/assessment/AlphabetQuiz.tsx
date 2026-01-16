import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { islAlphabets } from "@/data/islAlphabets";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useCamera } from "@/hooks/useCamera";
import { useToast } from "@/hooks/use-toast";
import { Timer, CheckCircle2, XCircle, Trophy, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const WS_URL = "ws://localhost:8000/ws/predict";
const QUESTION_TIME = 15;
const TOTAL_QUESTIONS = 10;

interface QuizResult {
    letter: string;
    correct: boolean;
    userAnswer: string | null;
}

interface AlphabetQuizProps {
    onComplete: (score: number) => void;
    onExit: () => void;
}

const AlphabetQuiz = ({ onComplete, onExit }: AlphabetQuizProps) => {
    const { toast } = useToast();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [targetLetter, setTargetLetter] = useState<string>("");
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
    const [results, setResults] = useState<QuizResult[]>([]);
    const [detectedLetter, setDetectedLetter] = useState<string | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Helper to get random unique letter
    const getRandomLetter = useCallback((currentResults: QuizResult[]) => {
        const letters = islAlphabets.map((a) => a.letter);
        const usedLetters = currentResults.map((r) => r.letter);
        // If we've used all letters (unlikely for 10 qs but possible), reset pool
        const availableLetters = letters.filter((l) => !usedLetters.includes(l));
        const pool = availableLetters.length > 0 ? availableLetters : letters;
        return pool[Math.floor(Math.random() * pool.length)];
    }, []);

    // Initialize
    useEffect(() => {
        setTargetLetter(getRandomLetter([]));
    }, [getRandomLetter]);

    const handlePrediction = useCallback(
        (result: { label: string; confidence: number }) => {
            if (isFinished || hasAnswered) return;

            if (result.label !== "Noise" && result.confidence >= 0.95) {
                setDetectedLetter(result.label);

                if (result.label === targetLetter) {
                    setHasAnswered(true);
                    const newResult = { letter: targetLetter, correct: true, userAnswer: result.label };
                    setResults((prev) => [...prev, newResult]);

                    toast({
                        title: "✅ Correct!",
                        description: `Great job signing "${targetLetter}"!`,
                    });

                    setTimeout(() => {
                        if (currentQuestion < TOTAL_QUESTIONS - 1) {
                            nextQuestion([...results, newResult]);
                        } else {
                            finishQuiz([...results, newResult]);
                        }
                    }, 1500);
                }
            }
        },
        [isFinished, hasAnswered, targetLetter, currentQuestion, results, toast]
    );

    const { isConnected, connect, disconnect, sendFrame, lastPrediction } = useWebSocket({
        url: WS_URL,
        onPrediction: handlePrediction,
    });

    const { videoRef, canvasRef, startCamera, stopCamera } = useCamera({
        onFrame: sendFrame,
        frameInterval: 100,
    });

    useEffect(() => {
        connect();
        startCamera();
        return () => {
            disconnect();
            stopCamera();
        };
    }, []);

    const nextQuestion = (currentResults: QuizResult[]) => {
        setCurrentQuestion((prev) => prev + 1);
        setTargetLetter(getRandomLetter(currentResults));
        setTimeLeft(QUESTION_TIME);
        setDetectedLetter(null);
        setHasAnswered(false);
    };

    const finishQuiz = (finalResults: QuizResult[]) => {
        setIsFinished(true);
        stopCamera();
        disconnect();
        const score = finalResults.filter(r => r.correct).length;
        // Notify parent but keep showing local result UI
        // Parent will update storage
        // But we might want to show results here first
    };

    // Timer
    useEffect(() => {
        if (isFinished || hasAnswered) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    // Time's up
                    const newResult = { letter: targetLetter, correct: false, userAnswer: null };
                    setResults((r) => [...r, newResult]);

                    if (currentQuestion < TOTAL_QUESTIONS - 1) {
                        nextQuestion([...results, newResult]);
                    } else {
                        finishQuiz([...results, newResult]);
                    }
                    return QUESTION_TIME;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isFinished, hasAnswered, currentQuestion, targetLetter, results]);

    const score = results.filter((r) => r.correct).length;
    const scorePercent = Math.round((score / TOTAL_QUESTIONS) * 100);

    if (isFinished) {
        return (
            <div className="glass-card rounded-2xl p-8 animate-fade-in max-w-3xl mx-auto text-center">
                <div className={cn(
                    "w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center",
                    scorePercent >= 70 ? "bg-success/20" : "bg-accent/20"
                )}>
                    <Trophy className={cn(
                        "w-12 h-12",
                        scorePercent >= 70 ? "text-success" : "text-accent"
                    )} />
                </div>

                <h2 className="text-3xl font-heading font-bold mb-2">Quiz Complete!</h2>
                <p className="text-5xl font-heading font-bold text-primary mb-6">
                    {score}/{TOTAL_QUESTIONS}
                </p>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-8 justify-center">
                    {results.map((result, i) => (
                        <div
                            key={i}
                            className={cn(
                                "aspect-square rounded-lg flex items-center justify-center text-lg font-bold border-2",
                                result.correct
                                    ? "bg-success/10 border-success text-success"
                                    : "bg-destructive/10 border-destructive text-destructive"
                            )}
                        >
                            {result.correct ? result.letter : <span className="opacity-50">{result.letter}</span>}
                        </div>
                    ))}
                </div>

                <div className="flex justify-center gap-4">
                    <Button onClick={() => onComplete(score)} variant="hero" size="lg">
                        Save & Continue
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            {/* Header Info */}
            <div className="glass-card rounded-xl p-4 flex justify-between items-center">
                <div>
                    <span className="text-sm text-muted-foreground block">Question</span>
                    <span className="font-heading font-bold text-xl">{currentQuestion + 1}<span className="text-muted-foreground text-base">/{TOTAL_QUESTIONS}</span></span>
                </div>

                <div className="flex-1 mx-8">
                    <Progress value={((currentQuestion) / TOTAL_QUESTIONS) * 100} className="h-2" />
                </div>

                <div className="text-right">
                    <div className="flex items-center gap-2 justify-end text-muted-foreground">
                        <Timer className="w-4 h-4" />
                        <span className={cn(
                            "font-bold font-heading text-xl",
                            timeLeft <= 5 ? "text-destructive" : "text-foreground"
                        )}>
                            {timeLeft}s
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Game Area */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Target */}
                <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                    <p className="text-muted-foreground mb-4">Sign this letter</p>
                    <div className="text-[120px] font-heading font-black text-primary leading-none animate-bounce-soft">
                        {targetLetter}
                    </div>

                    {detectedLetter && detectedLetter !== "Noise" && (
                        <div className="mt-8 flex flex-col items-center gap-2">
                            <div className="px-4 py-2 bg-muted rounded-full">
                                Detected: <span className={cn(
                                    "font-bold",
                                    detectedLetter === targetLetter ? "text-success" : "text-foreground"
                                )}>{detectedLetter}</span>
                            </div>

                            {/* Confidence Bar */}
                            {lastPrediction && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Confidence:</span>
                                    <div className="w-24 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full transition-all duration-300",
                                                lastPrediction.confidence > 0.9 ? "bg-success" : "bg-primary"
                                            )}
                                            style={{ width: `${Math.round(lastPrediction.confidence * 100)}%` }}
                                        />
                                    </div>
                                    <span className="min-w-[3ch]">{Math.round(lastPrediction.confidence * 100)}%</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Camera */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-border bg-black aspect-square md:aspect-auto">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover transform scale-x-[-1]"
                        autoPlay
                        playsInline
                        muted
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {hasAnswered && (
                        <div className="absolute inset-0 bg-success/20 flex items-center justify-center animate-in fade-in">
                            <CheckCircle2 className="w-24 h-24 text-success animate-in zoom-in spin-in-12" />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-center">
                <Button variant="ghost" onClick={onExit}>Cancel Quiz</Button>
            </div>
        </div>
    );
};

export default AlphabetQuiz;
