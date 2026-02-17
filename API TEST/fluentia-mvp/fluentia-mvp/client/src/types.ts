export type Topic = {
  id: number;
  name: string;
  language: string;
};

export type LessonVocabItem = {
  id: number;
  word: string;
  english: string;
  imageUrl: string;
};

export type LessonQuestion = {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  correctOption: "A" | "B" | "C";
};

export type Lesson = {
  id: number;
  topicId: number;
  title: string;
  skillFocus: string;
  readingPassage: string;
  listeningText: string;
  topic: Topic;
  vocabItems: LessonVocabItem[];
  questions: LessonQuestion[];
};

export type User = {
  id: number;
  name: string;
  language: string;
};

export type Session = {
  id: number;
  userId: number;
  topicId: number;
  lessonId: number;
};

export type EvaluationJSON = {
  grammar: number;
  vocabulary: number;
  fluency: number;
  taskCompletion: number;
  cefr: "A1" | "A2" | "B1" | "B2" | "C1";
  feedbackBullets: string[];
  evidence: Array<{ mistakeQuote: string; correction: string }>;
  wordBank: string[];
  nextExercise: string;
};

export type ChatMessage = {
  id: number;
  role: "USER" | "ASSISTANT";
  content: string;
};

export type DashboardResponse = {
  topicCompletion: Record<string, number>;
  cefrTrend: Array<{ date: string; cefr: string; score: number }>;
  commonMistakes: Array<{ word: string; correction: string; quote: string }>;
  wordBank: string[];
};
