import Link from "next/link";
import { ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react";
import type { Question } from "@/lib/types";

export default function QuestionRow({
  question,
  index,
  total,
  disabled,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  question: Question;
  index: number;
  total: number;
  disabled: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-black/5 bg-white p-4 shadow-sm">
      <div className="flex flex-col">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={disabled || index === 0}
          aria-label="Mover para cima"
          className="text-foreground/40 hover:text-coral disabled:opacity-20"
        >
          <ChevronUp size={18} />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={disabled || index === total - 1}
          aria-label="Mover para baixo"
          className="text-foreground/40 hover:text-coral disabled:opacity-20"
        >
          <ChevronDown size={18} />
        </button>
      </div>

      <div className="flex-1">
        <p className="font-medium">{question.text}</p>
        <p className="text-sm text-foreground/50">
          {question.options.length} alternativas · {question.time_limit_seconds ?? "padrão"}
          {question.time_limit_seconds ? "s" : ""}
        </p>
      </div>

      <Link
        href={`/admin/questions/${question.id}/edit`}
        aria-label="Editar"
        className="text-foreground/40 hover:text-coral"
      >
        <Pencil size={18} />
      </Link>
      <button
        type="button"
        onClick={onDelete}
        aria-label="Excluir"
        className="text-foreground/40 hover:text-red-600"
      >
        <Trash2 size={18} />
      </button>
    </li>
  );
}
