"use client";

import type { SanitizedQuestion } from "@/lib/types";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelect,
}: {
  question: SanitizedQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: number | null;
  onSelect: (index: number) => void;
}) {
  const answered = selectedOption !== null;

  return (
    <div className="w-full max-w-xl">
      <p className="mb-2 text-sm font-medium text-foreground/50">
        Pergunta {questionNumber} de {totalQuestions}
      </p>
      <h2 className="mb-6 text-2xl font-semibold leading-snug">{question.text}</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            type="button"
            disabled={answered}
            onClick={() => onSelect(index)}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
              selectedOption === index
                ? "border-coral bg-coral text-white"
                : "border-black/10 bg-white hover:border-coral/60"
            } disabled:cursor-default`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                selectedOption === index ? "bg-white/20" : "bg-black/5"
              }`}
            >
              {OPTION_LETTERS[index]}
            </span>
            <span className="font-medium">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
