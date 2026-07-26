import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Question } from "@/lib/types";
import QuestionsList from "@/components/admin/QuestionsList";

export const dynamic = "force-dynamic";

export default async function AdminQuestionsPage() {
  const { data: questions } = await supabaseAdmin
    .from("quiz_questions")
    .select("*")
    .order("order_index", { ascending: true });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Perguntas do quiz</h1>
        <Link
          href="/admin/questions/new"
          className="rounded-lg bg-coral px-4 py-2 text-sm font-medium text-white hover:bg-coral-dark"
        >
          Nova pergunta
        </Link>
      </div>

      {questions && questions.length > 0 ? (
        <QuestionsList initialQuestions={questions as Question[]} />
      ) : (
        <p className="text-foreground/60">
          Nenhuma pergunta cadastrada ainda. Clique em &ldquo;Nova pergunta&rdquo; para começar.
        </p>
      )}
    </div>
  );
}
