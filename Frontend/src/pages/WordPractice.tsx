import { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import CameraPreview from "@/components/learn/CameraPreview";
import { getWordById } from "@/data/islWords";
import { getAlphabetByLetter } from "@/data/islAlphabets";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useCamera } from "@/hooks/useCamera";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, RotateCcw, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

// Update this URL to your backend WebSocket endpoint
const WS_URL = "ws://localhost:8000/ws/predict";

const WordPractice = () => {
    const { wordId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [word, setWord] = useState(getWordById(wordId || ""));
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const stabilityTimerRef = useRef<number | null>(null);

    // Redirect if word not found
    useEffect(() => {
        if (!word && wordId) {
            const foundWord = getWordById(wordId);
            if (foundWord) {
                setWord(foundWord);
            } else {
                toast({
                    title: "Word not found",
                    description: "Returning to library...",
                    variant: "destructive",
                });
                navigate("/words");
            }
        }
    }, [wordId, word, navigate, toast]);

    const currentTargetLetter = word?.letters[currentLetterIndex] || "";
    const targetAlphabet = getAlphabetByLetter(currentTargetLetter);

    const handlePrediction = useCallback((result: { label: string; confidence: number }) => {
        if (isCompleted || !word) return;

        // Check if prediction matches target letter
        if (
            result.label === currentTargetLetter &&
            result.confidence >= 0.90
        ) {
            const now = Date.now();
            if (!stabilityTimerRef.current) {
                stabilityTimerRef.current = now;
            } else if (now - stabilityTimerRef.current > 2000) {
                // Stable for 2 seconds -> Success
                stabilityTimerRef.current = null;

                // Calculate bonus based on speed/tries? For now just fixed points
                const points = 10;
                setScore(prev => prev + points);

                toast({
                    title: "Correct!",
                    description: `Great job with letter "${currentTargetLetter}"!`,
                });

                // Move to next letter or finish
                if (currentLetterIndex < word.letters.length - 1) {
                    setCurrentLetterIndex(prev => prev + 1);
                } else {
                    setIsCompleted(true);
                }
            }
        } else {
            stabilityTimerRef.current = null;
        }
    }, [currentLetterIndex, currentTargetLetter, isCompleted, word, toast]);

    const { isConnected, isConnecting, lastPrediction, connect, disconnect, sendFrame } = useWebSocket({
        url: WS_URL,
        onPrediction: handlePrediction,
        onError: (error) => {
            console.error("WebSocket error:", error);
        },
    });

    const { isActive, error: cameraError, videoRef, canvasRef, startCamera, stopCamera } = useCamera({
        onFrame: sendFrame,
        frameInterval: 100,
    });

    // Start camera on mount
    useEffect(() => {
        if (word) {
            connect();
            startCamera();
        }
        return () => {
            disconnect();
            stopCamera();
        };
    }, [word]); // Re-run if word loads late, though usually it's instant

    if (!word) return null;

    return (
        <PageLayout>
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button variant="ghost" size="sm" onClick={() => navigate("/words")} className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Words
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Current Score</p>
                            <p className="text-2xl font-heading font-bold text-primary">{score}</p>
                        </div>
                    </div>
                </div>

                {isCompleted ? (
                    <div className="max-w-md mx-auto text-center space-y-8 animate-fade-in py-12">
                        <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trophy className="w-12 h-12 text-success" />
                        </div>
                        <h1 className="text-4xl font-heading font-bold">Word Completed!</h1>
                        <p className="text-xl text-muted-foreground">
                            You've successfully spelled <span className="font-bold text-foreground">"{word.word}"</span>
                        </p>
                        <div className="bg-card p-6 rounded-xl border-2 border-primary/20 shadow-lg">
                            <p className="text-sm text-muted-foreground mb-2">Total Score</p>
                            <p className="text-5xl font-heading font-bold text-primary">{score}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button size="lg" onClick={() => navigate("/words")} className="w-full">
                                Choose Another Word
                            </Button>
                            <Button variant="outline" onClick={() => {
                                setIsCompleted(false);
                                setCurrentLetterIndex(0);
                                setScore(0);
                            }} className="w-full gap-2">
                                <RotateCcw className="w-4 h-4" /> Practice Again
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                        {/* Left: Camera */}
                        <div className="space-y-6">
                            <div className="relative">
                                <CameraPreview
                                    videoRef={videoRef}
                                    canvasRef={canvasRef}
                                    isActive={isActive}
                                    isConnecting={isConnecting}
                                    error={cameraError}
                                    prediction={lastPrediction}
                                    onStart={async () => {
                                        connect();
                                        await startCamera();
                                    }}
                                    onStop={() => {
                                        stopCamera();
                                        disconnect();
                                    }}
                                />
                                {/* Progress Overlay */}
                                <div className="absolute top-4 left-4 right-4 flex gap-1">
                                    {word.letters.map((letter, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "h-1 flex-1 rounded-full transition-colors duration-300",
                                                i < currentLetterIndex
                                                    ? "bg-success"
                                                    : i === currentLetterIndex
                                                        ? "bg-primary animate-pulse"
                                                        : "bg-white/30"
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Current Word Status */}
                            <div className="bg-card border rounded-xl p-6 shadow-sm">
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {word.letters.map((letter, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "w-10 h-12 rounded-lg flex items-center justify-center text-xl font-bold border-2 transition-all duration-300",
                                                i < currentLetterIndex
                                                    ? "bg-success/10 border-success text-success"
                                                    : i === currentLetterIndex
                                                        ? "bg-primary/10 border-primary text-primary scale-110 shadow-lg"
                                                        : "bg-muted border-transparent text-muted-foreground"
                                            )}
                                        >
                                            {i < currentLetterIndex ? (
                                                <CheckCircle2 className="w-5 h-5" />
                                            ) : (
                                                letter
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Target Instruction */}
                        <div className="space-y-6">
                            <div className="bg-card border rounded-2xl p-6 shadow-sm text-center">
                                <h2 className="text-xl text-muted-foreground mb-4">Form this letter:</h2>

                                {targetAlphabet ? (
                                    <div className="relative w-64 h-64 mx-auto rounded-xl overflow-hidden border-4 border-primary/20 shadow-inner bg-muted/30 group">
                                        <img
                                            src={targetAlphabet.image}
                                            alt={`Sign for ${currentTargetLetter}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                            <span className="text-8xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                                                {currentTargetLetter}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-64 h-64 mx-auto bg-muted rounded-xl flex items-center justify-center">
                                        <span className="text-6xl text-muted-foreground">{currentTargetLetter}</span>
                                    </div>
                                )}

                                <div className="mt-6 space-y-4">
                                    <p className="text-lg font-medium">Hold the sign for 2 seconds</p>

                                    {targetAlphabet?.description && (
                                        <div className="bg-primary/5 p-4 rounded-lg text-sm text-foreground/80 mx-auto max-w-sm">
                                            <p>{targetAlphabet.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default WordPractice;
