"use client";

import { useState, useTransition } from "react";
import type { Question } from "@/lib/types";
import QuestionRow from "@/components/admin/QuestionRow";

export default function QuestionsList({
  initialQuestions,
}: {
  initialQuestions: Question[];
}) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [isPending, startTransition] = useTransition();

  function persistOrder(next: Question[]) {
    setQuestions(next);
    startTransition(async () => {
      await fetch("/api/admin/questions/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: next.map((q) => q.id) }),
      });
    });
  }

  function move(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= questions.length) return;

    const next = [...questions];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    persistOrder(next);
  }

  async function remove(id: string) {
    if (!confirm("Excluir esta pergunta? Essa ação não pode ser desfeita.")) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
  }

  return (
    <ul className="flex flex-col gap-3">
      {questions.map((question, index) => (
        <QuestionRow
          key={question.id}
          question={question}
          index={index}
          total={questions.length}
          disabled={isPending}
          onMoveUp={() => move(index, -1)}
          onMoveDown={() => move(index, 1)}
          onDelete={() => remove(question.id)}
        />
      ))}
    </ul>
  );
}
