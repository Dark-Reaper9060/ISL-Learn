import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { islWords, categories, ISLWord } from "@/data/islWords";
import { BookOpen, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const difficultyColors = {
  beginner: "bg-success/10 text-success border-success/20",
  intermediate: "bg-primary/10 text-primary border-primary/20",
  advanced: "bg-destructive/10 text-destructive border-destructive/20",
};

const Words = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<ISLWord | null>(null);
  const navigate = useNavigate();

  const filteredWords = selectedCategory
    ? islWords.filter((w) => w.category === selectedCategory)
    : islWords;

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
            Word Library
          </h1>
          <p className="text-muted-foreground">
            Learn how to spell words using ISL alphabet signs
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Categories and word list */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Word grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredWords.map((word) => (
                <button
                  key={word.id}
                  onClick={() => setSelectedWord(word)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all duration-300 group",
                    "hover:scale-[1.02] hover:shadow-elevated active:scale-[0.98]",
                    selectedWord?.id === word.id
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-heading font-bold text-foreground">
                      {word.word}
                    </h3>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium border",
                        difficultyColors[word.difficulty]
                      )}
                    >
                      {word.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {word.meaning}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {word.letters.slice(0, 5).map((letter, i) => (
                        <span
                          key={i}
                          className="w-6 h-6 rounded bg-muted flex items-center justify-center text-xs font-bold"
                        >
                          {letter}
                        </span>
                      ))}
                      {word.letters.length > 5 && (
                        <span className="w-6 h-6 rounded bg-muted flex items-center justify-center text-xs">
                          +{word.letters.length - 5}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Word detail */}
          <div className="lg:col-span-1">
            {selectedWord ? (
              <div className="glass-card rounded-2xl p-6 sticky top-24 animate-fade-in">
                {/* Word header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-foreground">
                      {selectedWord.word}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedWord.category}
                    </p>
                  </div>
                </div>

                {/* Meaning */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Meaning
                  </h3>
                  <p className="text-foreground">{selectedWord.meaning}</p>
                </div>

                {/* Letter sequence */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Spell it out
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedWord.letters.map((letter, i) => (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-xl border-2 border-primary/30 bg-primary/5 flex items-center justify-center"
                      >
                        <span className="text-xl font-heading font-bold text-primary">
                          {letter}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Examples */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Example sentences
                  </h3>
                  <ul className="space-y-2">
                    {selectedWord.examples.map((example, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <Sparkles className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Practice CTA */}
                <Button variant="hero" className="w-full" onClick={() => navigate(`/learn/word/${selectedWord.id}`)}>
                  Start Learning
                </Button>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-8 text-center sticky top-24">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">
                  Select a word
                </h3>
                <p className="text-sm text-muted-foreground">
                  Click on any word to see its details and learn how to sign it
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Words;
