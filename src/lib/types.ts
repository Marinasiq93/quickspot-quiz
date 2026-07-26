export type Question = {
  id: string;
  text: string;
  options: string[];
  correct_option: number;
  time_limit_seconds: number | null;
  order_index: number;
  created_at: string;
};

/** Question shape sent to the public quiz — never includes the correct answer. */
export type SanitizedQuestion = {
  id: string;
  text: string;
  options: string[];
  time_limit_seconds: number;
  order_index: number;
};

export type Participant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
};

export type AnswerAudit = {
  question_id: string;
  question_text: string;
  selected_option: number | null;
  correct_option: number;
  is_correct: boolean;
  points_awarded: number;
  elapsed_ms: number;
};

export type QuizAttempt = {
  id: string;
  participant_id: string;
  participant_name: string;
  score: number;
  correct_count: number;
  wrong_count: number;
  total_time_ms: number;
  answers: AnswerAudit[];
  created_at: string;
};

export type LeaderboardEntry = {
  participant_id: string;
  participant_name: string;
  best_score: number;
  best_total_time_ms: number;
  updated_at: string;
};

/** One answer as submitted by the client — untrusted, revalidated server-side. */
export type AnswerInput = {
  questionId: string;
  selectedOption: number | null;
  elapsedMs: number;
};
