"use client";

import { useRef, useState } from "react";
import LeadForm, { type Lead } from "@/components/LeadForm";
import QuestionCard from "@/components/QuestionCard";
import Timer from "@/components/Timer";
import ResultScreen, { type QuizResult } from "@/components/ResultScreen";
import type { AnswerInput, SanitizedQuestion } from "@/lib/types";

type Stage = "lead" | "loading" | "quiz" | "submitting" | "result" | "error";

const ADVANCE_DELAY_MS = 450;

export default function QuizFlow() {
  const [stage, setStage] = useState<Stage>("lead");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [questions, setQuestions] = useState<SanitizedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);

  const leadRef = useRef<Lead | null>(null);
  const answersRef = useRef<AnswerInput[]>([]);
  const questionStartedAtRef = useRef(0);

  function startQuestion(index: number) {
    setCurrentIndex(index);
    setSelectedOption(null);
    questionStartedAtRef.current = Date.now();
  }

  async function handleLeadSubmit(lead: Lead) {
    leadRef.current = lead;
    setStage("loading");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/quiz/questions");
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (!data.questions || data.questions.length === 0) {
        throw new Error("Nenhuma pergunta cadastrada.");
      }

      setQuestions(data.questions);
      answersRef.current = [];
      setStage("quiz");
      startQuestion(0);
    } catch {
      setErrorMessage("Não foi possível carregar o quiz. Tente novamente.");
      setStage("error");
    }
  }

  function recordAnswer(questionId: string, selected: number | null) {
    const elapsedMs = Date.now() - questionStartedAtRef.current;
    answersRef.current.push({ questionId, selectedOption: selected, elapsedMs });
  }

  function goToNextOrSubmit() {
    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      startQuestion(nextIndex);
    } else {
      submitQuiz();
    }
  }

  function handleSelect(index: number) {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    recordAnswer(questions[currentIndex].id, index);
    setTimeout(goToNextOrSubmit, ADVANCE_DELAY_MS);
  }

  async function submitQuiz() {
    setStage("submitting");
    const lead = leadRef.current;
    if (!lead) return;

    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, answers: answersRef.current }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Erro ao enviar respostas.");

      setResult(data);
      setStage("result");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erro ao enviar respostas.");
      setStage("error");
    }
  }

  function handleRestart() {
    leadRef.current = null;
    answersRef.current = [];
    setQuestions([]);
    setResult(null);
    setErrorMessage(null);
    setStage("lead");
  }

  if (stage === "lead") {
    return <LeadForm onSubmit={handleLeadSubmit} loading={false} />;
  }

  if (stage === "loading") {
    return <LeadForm onSubmit={handleLeadSubmit} loading={true} />;
  }

  if (stage === "error") {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-black/5 bg-white p-8 text-center shadow-sm">
        <p className="mb-4 text-red-600">{errorMessage}</p>
        <button
          onClick={handleRestart}
          className="rounded-lg bg-coral px-4 py-2 font-medium text-white hover:bg-coral-dark"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (stage === "quiz") {
    const question = questions[currentIndex];
    return (
      <div className="flex w-full max-w-xl flex-col items-center gap-6">
        <Timer key={currentIndex} />
        <QuestionCard
          question={question}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          selectedOption={selectedOption}
          onSelect={handleSelect}
        />
      </div>
    );
  }

  if (stage === "submitting") {
    return <p className="text-foreground/60">Calculando sua pontuação...</p>;
  }

  if (stage === "result" && result) {
    return <ResultScreen result={result} />;
  }

  return null;
}
