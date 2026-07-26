import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Question } from "@/lib/types";
import QuestionForm from "@/components/admin/QuestionForm";

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: question } = await supabaseAdmin
    .from("quiz_questions")
    .select("*")
    .eq("id", id)
    .single();

  if (!question) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-semibold">Editar pergunta</h1>
      <QuestionForm mode="edit" question={question as Question} />
    </div>
  );
}
