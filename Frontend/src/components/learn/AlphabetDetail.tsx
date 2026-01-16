import { ISLAlphabet } from "@/data/islAlphabets";
import { Lightbulb, CheckCircle2 } from "lucide-react";

interface AlphabetDetailProps {
  alphabet: ISLAlphabet;
  isCompleted?: boolean;
}

const AlphabetDetail = ({ alphabet, isCompleted }: AlphabetDetailProps) => {
  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-6xl font-heading font-bold text-primary">
              {alphabet.letter}
            </span>
            {isCompleted && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-success/10 text-success">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">Mastered</span>
              </div>
            )}
          </div>
          <p className="mt-2 text-muted-foreground">
            ISL Alphabet Sign
          </p>
        </div>
      </div>

      {/* Image Reference */}
      <div className="mb-6 rounded-xl overflow-hidden bg-muted/20 border-2 border-border h-48 w-full max-w-xs mx-auto flex items-center justify-center relative">
        <img
          src={alphabet.image}
          alt={`Sign for ${alphabet.letter}`}
          className="h-full w-full object-contain"
          loading="lazy"
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          How to Sign
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {alphabet.description}
        </p>
      </div>

      {/* Tips */}
      <div className="p-4 rounded-xl bg-accent/20 border border-accent/30">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-accent-foreground" />
          <h4 className="font-heading font-semibold text-foreground">Tips</h4>
        </div>
        <ul className="space-y-2">
          {alphabet.tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="w-5 h-5 rounded-full bg-accent/50 flex items-center justify-center text-xs font-bold text-accent-foreground flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Practice hint */}
      <div className="mt-6 p-4 rounded-xl border border-dashed border-primary/30 bg-primary/5">
        <p className="text-sm text-center text-muted-foreground">
          <span className="font-semibold text-primary">Practice mode:</span> Hold the sign in front of your camera to verify your gesture
        </p>
      </div>
    </div >
  );
};

export default AlphabetDetail;
