import { Button } from "@/components/ui/button";
import { Trophy, Type, WholeWord, History } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizStartProps {
    onStartAlphabet: () => void;
    onStartWord: () => void;
    highScores: {
        alphabet: number[];
        words: number[];
    };
}

const QuizStart = ({ onStartAlphabet, onStartWord, highScores }: QuizStartProps) => {
    const getBestScore = (scores: number[]) => Math.max(0, ...scores);
    const getRecentScores = (scores: number[]) => scores.slice(-3).reverse();

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
            {/* Hero Section */}
            <div className="text-center space-y-6">
                <div className="inline-block p-4 rounded-full bg-primary/10 mb-2">
                    <Trophy className="w-12 h-12 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-heading font-bold">
                    Test Your Skills
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Choose a challenge to test your Indian Sign Language knowledge.
                    Race against the clock and track your progress!
                </p>
            </div>

            {/* Mode Selection */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Alphabet Quiz Card */}
                <div className="group relative glass-card p-8 rounded-2xl hover:border-primary/50 transition-all duration-300 hover:shadow-elevated">
                    <div className="absolute inset-x-0 -top-6 flex justify-center">
                        <div className="bg-background border-2 border-primary/20 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                            <Type className="w-8 h-8 text-primary" />
                        </div>
                    </div>

                    <div className="mt-6 text-center space-y-4">
                        <h3 className="text-2xl font-heading font-bold">Alphabet Blitz</h3>
                        <p className="text-muted-foreground">
                            Identify 10 random letters. You have 15 seconds per letter.
                            Great for beginners!
                        </p>

                        <div className="py-4">
                            <div className="text-sm font-medium text-muted-foreground mb-1">
                                Best Score
                            </div>
                            <div className="text-3xl font-bold font-heading text-primary">
                                {getBestScore(highScores.alphabet)}
                            </div>
                        </div>

                        <Button
                            onClick={onStartAlphabet}
                            variant="hero"
                            className="w-full"
                        >
                            Start Alphabet Quiz
                        </Button>
                    </div>
                </div>

                {/* Word Quiz Card */}
                <div className="group relative glass-card p-8 rounded-2xl hover:border-primary/50 transition-all duration-300 hover:shadow-elevated">
                    <div className="absolute inset-x-0 -top-6 flex justify-center">
                        <div className="bg-background border-2 border-primary/20 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                            <WholeWord className="w-8 h-8 text-primary" />
                        </div>
                    </div>

                    <div className="mt-6 text-center space-y-4">
                        <h3 className="text-2xl font-heading font-bold">Word Master</h3>
                        <p className="text-muted-foreground">
                            Spell 5 random words letter-by-letter.
                            Test your speed and fluidity!
                        </p>

                        <div className="py-4">
                            <div className="text-sm font-medium text-muted-foreground mb-1">
                                Best Score
                            </div>
                            <div className="text-3xl font-bold font-heading text-primary">
                                {getBestScore(highScores.words)}
                            </div>
                        </div>

                        <Button
                            onClick={onStartWord}
                            variant="hero"
                            className="w-full"
                        >
                            Start Word Quiz
                        </Button>
                    </div>
                </div>
            </div>

            {/* Recent History */}
            {(highScores.alphabet.length > 0 || highScores.words.length > 0) && (
                <div className="glass-card p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-6">
                        <History className="w-5 h-5 text-muted-foreground" />
                        <h3 className="text-lg font-heading font-bold">Recent Activity</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Alphabets</h4>
                            {highScores.alphabet.length === 0 ? (
                                <p className="text-sm text-muted-foreground/50 italic">No games played yet</p>
                            ) : (
                                <div className="space-y-2">
                                    {getRecentScores(highScores.alphabet).map((score, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                            <span className="font-medium text-sm">Game {highScores.alphabet.length - i}</span>
                                            <span className="font-bold text-primary">{score}/10</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Words</h4>
                            {highScores.words.length === 0 ? (
                                <p className="text-sm text-muted-foreground/50 italic">No games played yet</p>
                            ) : (
                                <div className="space-y-2">
                                    {getRecentScores(highScores.words).map((score, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                            <span className="font-medium text-sm">Game {highScores.words.length - i}</span>
                                            <span className="font-bold text-primary">{score} pts</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizStart;
