import { ISLAlphabet } from "@/data/islAlphabets";
import { cn } from "@/lib/utils";

interface AlphabetCardProps {
  alphabet: ISLAlphabet;
  isActive?: boolean;
  isCompleted?: boolean;
  onClick?: () => void;
}

const AlphabetCard = ({ alphabet, isActive, isCompleted, onClick }: AlphabetCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative p-2 rounded-xl border-2 transition-all duration-300 text-left group",
        "hover:scale-[1.02] hover:shadow-elevated active:scale-[0.98]",
        isActive
          ? "border-primary bg-primary/10 shadow-soft"
          : isCompleted
            ? "border-success bg-success/10"
            : "border-border bg-card hover:border-primary/50"
      )}
    >
      {/* Completion badge */}
      {isCompleted && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-success flex items-center justify-center text-success-foreground text-xs font-bold shadow-soft animate-scale-in z-10">
          ✓
        </div>
      )}

      {/* Image */}
      <div className={cn(
        "mb-0 rounded-lg overflow-hidden bg-muted/20 relative group-hover:shadow-sm transition-all duration-300 mx-auto w-full aspect-square",
        isActive && "shadow-md ring-2 ring-primary ring-offset-2"
      )}>
        <img
          src={alphabet.image}
          alt={`ISL Sign for ${alphabet.letter}`}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay gradient for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

        {/* Letter Overlay */}
        <span className={cn(
          "absolute bottom-2 right-3 text-2xl font-heading font-bold text-white shadow-sm",
          isActive && "text-3xl"
        )}>
          {alphabet.letter}
        </span>
      </div>

      {/* Letter */}




      {/* Hover indicator */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-1 rounded-b-xl transition-all duration-300",
        "opacity-0 group-hover:opacity-100",
        isActive ? "bg-primary" : isCompleted ? "bg-success" : "bg-primary/50"
      )} />
    </button>
  );
};

export default AlphabetCard;
