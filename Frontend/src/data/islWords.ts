export interface ISLWord {
  id: string;
  word: string;
  meaning: string;
  letters: string[];
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  examples: string[];
}

export const islWords: ISLWord[] = [
  {
    id: "hello",
    word: "HELLO",
    meaning: "A greeting used when meeting someone",
    letters: ["H", "E", "L", "L", "O"],
    category: "Greetings",
    difficulty: "beginner",
    examples: ["Hello, how are you?", "Say hello to your friend"],
  },
  {
    id: "bye",
    word: "BYE",
    meaning: "A farewell expression when parting",
    letters: ["B", "Y", "E"],
    category: "Greetings",
    difficulty: "beginner",
    examples: ["Bye! See you tomorrow", "Wave bye to grandma"],
  },
  {
    id: "love",
    word: "LOVE",
    meaning: "An intense feeling of deep affection",
    letters: ["L", "O", "V", "E"],
    category: "Emotions",
    difficulty: "beginner",
    examples: ["I love you", "Love conquers all"],
  },
  {
    id: "happy",
    word: "HAPPY",
    meaning: "Feeling or showing pleasure and contentment",
    letters: ["H", "A", "P", "P", "Y"],
    category: "Emotions",
    difficulty: "beginner",
    examples: ["I am happy today", "Happy birthday!"],
  },
  {
    id: "thank",
    word: "THANK",
    meaning: "Express gratitude",
    letters: ["T", "H", "A", "N", "K"],
    category: "Courtesy",
    difficulty: "beginner",
    examples: ["Thank you for helping", "Many thanks"],
  },
  {
    id: "please",
    word: "PLEASE",
    meaning: "A polite request",
    letters: ["P", "L", "E", "A", "S", "E"],
    category: "Courtesy",
    difficulty: "intermediate",
    examples: ["Please help me", "Yes, please"],
  },
  {
    id: "help",
    word: "HELP",
    meaning: "Make it easier for someone to do something",
    letters: ["H", "E", "L", "P"],
    category: "Actions",
    difficulty: "beginner",
    examples: ["Can you help me?", "I need help"],
  },
  {
    id: "water",
    word: "WATER",
    meaning: "A colorless, transparent liquid essential for life",
    letters: ["W", "A", "T", "E", "R"],
    category: "Daily Life",
    difficulty: "beginner",
    examples: ["I want water", "Drink more water"],
  },
  {
    id: "food",
    word: "FOOD",
    meaning: "Any nutritious substance consumed for nourishment",
    letters: ["F", "O", "O", "D"],
    category: "Daily Life",
    difficulty: "beginner",
    examples: ["The food is delicious", "Time for food"],
  },
  {
    id: "friend",
    word: "FRIEND",
    meaning: "A person whom one knows and has mutual affection",
    letters: ["F", "R", "I", "E", "N", "D"],
    category: "Relationships",
    difficulty: "intermediate",
    examples: ["This is my friend", "Best friends forever"],
  },
  {
    id: "family",
    word: "FAMILY",
    meaning: "A group of people related by blood or marriage",
    letters: ["F", "A", "M", "I", "L", "Y"],
    category: "Relationships",
    difficulty: "intermediate",
    examples: ["I love my family", "Family dinner"],
  },
  {
    id: "school",
    word: "SCHOOL",
    meaning: "An institution for educating children",
    letters: ["S", "C", "H", "O", "O", "L"],
    category: "Education",
    difficulty: "intermediate",
    examples: ["Going to school", "School is fun"],
  },
];

export const categories = [...new Set(islWords.map(w => w.category))];

export const getWordsByCategory = (category: string): ISLWord[] => {
  return islWords.filter(w => w.category === category);
};

export const getWordById = (id: string): ISLWord | undefined => {
  return islWords.find(w => w.id === id);
};
