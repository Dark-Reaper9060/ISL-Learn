import { RefObject } from "react";
import { Camera, CameraOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CameraPreviewProps {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  isActive: boolean;
  isConnecting: boolean;
  error: string | null;
  prediction: { label: string; confidence: number } | null;
  onStart: () => void;
  onStop: () => void;
}

const CameraPreview = ({
  videoRef,
  canvasRef,
  isActive,
  isConnecting,
  error,
  prediction,
  onStart,
  onStop,
}: CameraPreviewProps) => {
  const isNoise = prediction?.label === "Noise";
  const confidencePercent = prediction ? Math.round(prediction.confidence * 100) : 0;

  return (
    <div className="relative">
      {/* Video container */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted border-2 border-border">
        <video
          ref={videoRef}
          className={cn(
            "w-full h-full object-cover transform scale-x-[-1]",
            !isActive && "hidden"
          )}
          autoPlay
          playsInline
          muted
        />

        {/* Hidden canvas for frame capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Placeholder when camera is off */}
        {!isActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <CameraOff className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-center text-muted-foreground">
              Enable camera to practice sign recognition
            </p>
          </div>
        )}

        {/* Prediction overlay */}
        {isActive && prediction && !isNoise && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4 border-primary rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-primary rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-16 h-16 border-l-4 border-b-4 border-primary rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 border-primary rounded-br-lg" />
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 backdrop-blur-sm">
            <div className="bg-card p-4 rounded-xl text-center shadow-elevated">
              <p className="text-destructive font-medium">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Prediction display */}
      {isActive && prediction && (
        <div className="mt-4 p-4 rounded-xl glass-card animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Captured</p>
              <p className={cn(
                "text-4xl font-heading font-bold",
                isNoise ? "text-muted-foreground" : "text-primary"
              )}>
                {isNoise ? "—" : prediction.label}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground font-medium">Confidence</p>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      isNoise ? "bg-muted-foreground" :
                        confidencePercent >= 95 ? "bg-success" :
                          confidencePercent >= 80 ? "bg-primary" : "bg-accent"
                    )}
                    style={{ width: `${confidencePercent}%` }}
                  />
                </div>
                <span className={cn(
                  "text-lg font-bold font-heading",
                  isNoise ? "text-muted-foreground" : "text-foreground"
                )}>
                  {isNoise ? "—" : `${confidencePercent}%`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Camera controls */}
      <div className="mt-4 flex justify-center">
        {isActive ? (
          <Button
            variant="destructive"
            size="lg"
            onClick={onStop}
            className="gap-2"
          >
            <CameraOff className="w-5 h-5" />
            Stop Camera
          </Button>
        ) : (
          <Button
            variant="hero"
            size="lg"
            onClick={onStart}
            disabled={isConnecting}
            className="gap-2"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                Start Practice
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CameraPreview;
