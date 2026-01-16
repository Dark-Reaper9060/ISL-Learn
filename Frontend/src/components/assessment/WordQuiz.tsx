import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { islWords, ISLWord } from "@/data/islWords";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useCamera } from "@/hooks/useCamera";
import { useToast } from "@/hooks/use-toast";
import { Timer, Trophy, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const WS_URL = "ws://localhost:8000/ws/predict";
const WORDS_COUNT = 5;
const TIME_PER_WORD = 45; // seconds

interface WordQuizProps {
    onComplete: (score: number) => void;
    onExit: () => void;
}

const WordQuiz = ({ onComplete, onExit }: WordQuizProps) => {
    const { toast } = useToast();
    const [words, setWords] = useState<ISLWord[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_PER_WORD);
    const [isFinished, setIsFinished] = useState(false);

    // Hand stability for words
    const stabilityTimerRef = useRef<number | null>(null);

    // Initialize words
    useEffect(() => {
        const shuffled = [...islWords].sort(() => 0.5 - Math.random());
        setWords(shuffled.slice(0, WORDS_COUNT));
    }, []);

    const currentWord = words[currentWordIndex];
    const currentTargetLetter = currentWord?.letters[currentLetterIndex];

    const handlePrediction = useCallback((result: { label: string; confidence: number }) => {
        if (isFinished || !currentWord) return;

        if (result.label === currentTargetLetter && result.confidence >= 0.90) {
            const now = Date.now();
            if (!stabilityTimerRef.current) {
                stabilityTimerRef.current = now;
            } else if (now - stabilityTimerRef.current > 1500) { // 1.5s stability for smoother flow
                // Letter confirmed
                stabilityTimerRef.current = null;

                if (currentLetterIndex < currentWord.letters.length - 1) {
                    // Next letter
                    setCurrentLetterIndex(prev => prev + 1);
                    setScore(prev => prev + 2); // 2 points per letter
                } else {
                    // Word completed
                    setScore(prev => prev + 10); // Bonus for word completion
                    toast({
                        title: "Word Complete!",
                        description: `You spelled ${currentWord.word} correctly!`,
                        className: "bg-success text-success-foreground"
                    });

                    setTimeout(() => {
                        nextWord();
                    }, 1000);
                }
            }
        } else {
            stabilityTimerRef.current = null;
        }
    }, [currentWord, currentLetterIndex, currentTargetLetter, isFinished, toast]);

    const { isConnected, connect, disconnect, sendFrame, lastPrediction } = useWebSocket({
        url: WS_URL,
        onPrediction: handlePrediction,
    });

    const { videoRef, canvasRef, startCamera, stopCamera } = useCamera({
        onFrame: sendFrame,
        frameInterval: 100,
    });

    useEffect(() => {
        if (words.length > 0) {
            connect();
            startCamera();
        }
        return () => {
            disconnect();
            stopCamera();
        };
    }, [words]);

    const nextWord = () => {
        if (currentWordIndex < words.length - 1) {
            setCurrentWordIndex(prev => prev + 1);
            setCurrentLetterIndex(0);
            setTimeLeft(TIME_PER_WORD);
            stabilityTimerRef.current = null;
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        setIsFinished(true);
        stopCamera();
        disconnect();
    };

    // Timer
    useEffect(() => {
        if (isFinished) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Time up for word
                    toast({
                        title: "Time's up!",
                        description: "Moving to next word...",
                        variant: "destructive"
                    });
                    if (currentWordIndex < words.length - 1) {
                        nextWord();
                        return TIME_PER_WORD;
                    } else {
                        finishQuiz();
                        return 0;
                    }
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isFinished, currentWordIndex, words]);


    if (isFinished) {
        return (
            <div className="glass-card rounded-2xl p-8 animate-fade-in max-w-2xl mx-auto text-center">
                <Trophy className="w-20 h-20 text-warning mx-auto mb-6" />
                <h2 className="text-3xl font-heading font-bold mb-4">Quiz Finished!</h2>
                <div className="bg-muted/30 p-6 rounded-xl mb-8">
                    <span className="text-muted-foreground text-sm uppercase tracking-widest">Total Score</span>
                    <div className="text-6xl font-heading font-black text-primary mt-2">{score}</div>
                </div>
                <Button onClick={() => onComplete(score)} variant="hero" className="w-full">
                    Return to Menu
                </Button>
            </div>
        );
    }

    if (!currentWord) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between glass-card p-4 rounded-xl">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Word</span>
                    <span className="text-xl font-heading font-bold">{currentWordIndex + 1}/{words.length}</span>
                </div>

                <div className="text-2xl font-bold font-mono">
                    {score} <span className="text-sm font-sans text-muted-foreground">pts</span>
                </div>

                <div className="flex items-center gap-2">
                    <Timer className={cn("w-5 h-5", timeLeft < 10 && "text-destructive")} />
                    <span className={cn("font-bold text-xl", timeLeft < 10 && "text-destructive")}>{timeLeft}s</span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Word Display */}
                <div className="space-y-6">
                    <div className="glass-card p-8 rounded-2xl min-h-[300px] flex flex-col justify-center items-center">
                        <p className="text-muted-foreground mb-8">Spell the word:</p>

                        <div className="flex flex-wrap justify-center gap-3">
                            {currentWord.letters.map((letter, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "w-12 h-16 rounded-lg flex items-center justify-center text-3xl font-black transition-all duration-300 transform",
                                        i < currentLetterIndex
                                            ? "bg-success text-success-foreground scale-90"
                                            : i === currentLetterIndex
                                                ? "bg-primary text-primary-foreground scale-110 shadow-lg ring-4 ring-primary/20"
                                                : "bg-muted text-muted-foreground opacity-50"
                                    )}
                                >
                                    {i < currentLetterIndex ? <CheckCircle2 className="w-6 h-6" /> : letter}
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 text-center text-sm text-muted-foreground">
                            Current Target: <span className="font-bold text-foreground text-xl mx-2">{currentTargetLetter}</span>
                        </div>
                    </div>
                </div>

                {/* Camera */}
                <div className="relative rounded-2xl overflow-hidden border-4 border-muted aspect-[4/3] bg-black shadow-2xl">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover transform scale-x-[-1]"
                        autoPlay
                        playsInline
                        muted
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Visual Feedback Overlay */}
                    <div className="absolute top-4 right-4">
                        <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/10">
                            {isConnected ? "Live" : "Connecting..."}
                        </div>
                    </div>

                    {/* Prediction Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 animate-fade-in">
                        {isConnected && (
                            <div className="bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white/80 text-sm font-medium">Confidence</span>
                                    <span className="text-white font-bold">{lastPrediction ? Math.round(lastPrediction.confidence * 100) : 0}%</span>
                                </div>
                                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full transition-all duration-300",
                                            (lastPrediction?.confidence || 0) > 0.9 ? "bg-success" : "bg-primary"
                                        )}
                                        style={{ width: `${Math.round((lastPrediction?.confidence || 0) * 100)}%` }}
                                    />
                                </div>
                                <div className="mt-2 text-center">
                                    <span className="text-xs text-white/60">Detected: </span>
                                    <span className="text-white font-bold text-lg ml-1">
                                        {lastPrediction?.label === "Noise" ? "—" : lastPrediction?.label || "—"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <Button variant="ghost" onClick={onExit} className="text-muted-foreground hover:text-destructive">
                    Quit Quiz
                </Button>
            </div>
        </div>
    );
};

export default WordQuiz;
