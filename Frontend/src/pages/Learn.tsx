import { useState, useCallback, useRef } from "react";
import PageLayout from "@/components/layout/PageLayout";
import AlphabetCard from "@/components/learn/AlphabetCard";
import AlphabetDetail from "@/components/learn/AlphabetDetail";
import CameraPreview from "@/components/learn/CameraPreview";
import { islAlphabets, ISLAlphabet } from "@/data/islAlphabets";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useCamera } from "@/hooks/useCamera";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";

// Update this URL to your backend WebSocket endpoint
const WS_URL = "ws://localhost:8000/ws/predict";

const Learn = () => {
  const { toast } = useToast();
  const [selectedAlphabet, setSelectedAlphabet] = useState<ISLAlphabet>(islAlphabets[0]);
  const [completedLetters, setCompletedLetters] = useState<Set<string>>(new Set());
  const [capturedSequence, setCapturedSequence] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const stabilityTimerRef = useRef<number | null>(null);

  const handlePrediction = useCallback((result: { label: string; confidence: number }) => {
    // Check if prediction broadly matches target
    if (
      result.label === selectedAlphabet.letter &&
      result.confidence >= 0.95 &&
      !completedLetters.has(result.label)
    ) {
      const now = Date.now();
      if (!stabilityTimerRef.current) {
        // Start stability timer
        stabilityTimerRef.current = now;
      } else if (now - stabilityTimerRef.current > 2000) {
        // Stable for 2 seconds -> Mark as completed
        setCompletedLetters((prev) => new Set([...prev, result.label]));
        setCapturedSequence((prev) => prev + result.label);
        setScore((prev) => prev + 10); // Increment score
        toast({
          title: "🎉 Correct!",
          description: `You've mastered "${result.label}"! Score +10`,
        });
        stabilityTimerRef.current = null; // Reset
      }
    } else {
      // Reset timer if prediction is unstable or incorrect
      stabilityTimerRef.current = null;
    }
  }, [selectedAlphabet, completedLetters, toast]);

  const { isConnected, isConnecting, lastPrediction, connect, disconnect, sendFrame } = useWebSocket({
    url: WS_URL,
    onPrediction: handlePrediction,
    onError: (error) => {
      toast({
        title: "Connection Error",
        description: error,
        variant: "destructive",
      });
    },
  });

  const { isActive, error: cameraError, videoRef, canvasRef, startCamera, stopCamera } = useCamera({
    onFrame: sendFrame,
    frameInterval: 100,
  });

  const handleStartPractice = async () => {
    connect();
    await startCamera();
  };

  const handleStopPractice = () => {
    stopCamera();
    disconnect();
  };

  const progress = Math.round((completedLetters.size / islAlphabets.length) * 100);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
            Learn ISL Alphabets
          </h1>
          <p className="text-muted-foreground">
            Practice signing each letter and get real-time feedback
          </p>

          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              {completedLetters.size}/{islAlphabets.length} Mastered
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Camera and current letter */}
          <div className="space-y-6">
            <CameraPreview
              videoRef={videoRef}
              canvasRef={canvasRef}
              isActive={isActive}
              isConnecting={isConnecting}
              error={cameraError}
              prediction={lastPrediction}
              onStart={handleStartPractice}
              onStop={handleStopPractice}
            />
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-foreground">Captured Sequence</h3>
                <div className="bg-primary/10 px-3 py-1 rounded-full">
                  <span className="text-primary font-bold">Score: {score}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  value={capturedSequence}
                  readOnly
                  placeholder="Captured letters will appear here..."
                  className="font-mono text-lg tracking-widest uppercase bg-muted/50"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCapturedSequence("")}
                  title="Clear Sequence"
                >
                  <Eraser className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <AlphabetDetail
              alphabet={selectedAlphabet}
              isCompleted={completedLetters.has(selectedAlphabet.letter)}
            />
          </div>

          {/* Right: Alphabet grid */}
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
              All Alphabets
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {islAlphabets.map((alphabet) => (
                <AlphabetCard
                  key={alphabet.letter}
                  alphabet={alphabet}
                  isActive={selectedAlphabet.letter === alphabet.letter}
                  isCompleted={completedLetters.has(alphabet.letter)}
                  onClick={() => setSelectedAlphabet(alphabet)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Learn;
