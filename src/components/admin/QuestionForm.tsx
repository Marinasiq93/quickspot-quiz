"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import type { Question } from "@/lib/types";
import { MAX_OPTIONS, MIN_OPTIONS } from "@/lib/constants";

type Props =
  | { mode: "create" }
  | { mode: "edit"; question: Question };

export default function QuestionForm(props: Props) {
  const router = useRouter();
  const existing = props.mode === "edit" ? props.question : null;

  const [text, setText] = useState(existing?.text ?? "");
  const [options, setOptions] = useState<string[]>(existing?.options ?? ["", ""]);
  const [correctOption, setCorrectOption] = useState(existing?.correct_option ?? 0);
  const [timeLimit, setTimeLimit] = useState<string>(
    existing?.time_limit_seconds != null ? String(existing.time_limit_seconds) : ""
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function updateOption(index: number, value: string) {
    setOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)));
  }

  function addOption() {
    if (options.length >= MAX_OPTIONS) return;
    setOptions((prev) => [...prev, ""]);
  }

  function removeOption(index: number) {
    if (options.length <= MIN_OPTIONS) return;
    setOptions((prev) => prev.filter((_, i) => i !== index));
    setCorrectOption((prev) => (prev === index ? 0 : prev > index ? prev - 1 : prev));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const trimmedOptions = options.map((o) => o.trim());
    if (trimmedOptions.some((o) => o.length === 0)) {
      setError("Todas as alternativas precisam de um texto.");
      return;
    }

    setSaving(true);
    const payload = {
      text: text.trim(),
      options: trimmedOptions,
      correct_option: correctOption,
      time_limit_seconds: timeLimit.trim() === "" ? null : Number(timeLimit),
    };

    const url =
      props.mode === "create" ? "/api/admin/questions" : `/api/admin/questions/${props.question.id}`;
    const method = props.mode === "create" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/questions");
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Não foi possível salvar.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <div>
        <label className="mb-1 block text-sm font-medium">Pergunta</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          required
          className="w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-coral"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Alternativas <span className="font-normal text-foreground/50">(marque a correta)</span>
        </label>
        <div className="flex flex-col gap-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct_option"
                checked={correctOption === index}
                onChange={() => setCorrectOption(index)}
                aria-label={`Alternativa ${index + 1} é a correta`}
              />
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                required
                placeholder={`Alternativa ${index + 1}`}
                className="flex-1 rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-coral"
              />
              {options.length > MIN_OPTIONS && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  aria-label="Remover alternativa"
                  className="text-foreground/40 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
        {options.length < MAX_OPTIONS && (
          <button
            type="button"
            onClick={addOption}
            className="mt-2 flex items-center gap-1 text-sm font-medium text-coral hover:text-coral-dark"
          >
            <Plus size={16} /> Adicionar alternativa
          </button>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Tempo de referência p/ bônus de velocidade (segundos){" "}
          <span className="font-normal text-foreground/50">
            — opcional, usa o padrão se vazio. Não limita o tempo de resposta, só afeta a pontuação.
          </span>
        </label>
        <input
          type="number"
          min={1}
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
          placeholder="20"
          className="w-32 rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-coral"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-coral px-4 py-2 font-medium text-white hover:bg-coral-dark disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/questions")}
          className="rounded-lg px-4 py-2 font-medium text-foreground/60 hover:bg-black/5"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
