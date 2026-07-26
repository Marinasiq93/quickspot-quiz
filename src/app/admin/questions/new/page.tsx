import QuestionForm from "@/components/admin/QuestionForm";

export default function NewQuestionPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-semibold">Nova pergunta</h1>
      <QuestionForm mode="create" />
    </div>
  );
}
