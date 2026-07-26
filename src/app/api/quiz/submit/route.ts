import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { quizSubmitSchema } from "@/lib/validation";
import { scoreAnswer } from "@/lib/scoring";
import { DEFAULT_TIME_LIMIT_SECONDS } from "@/lib/constants";
import type { AnswerAudit, Question } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = quizSubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const { name, email, phone, answers } = parsed.data;

  const { data: questions, error: questionsError } = await supabaseAdmin
    .from("quiz_questions")
    .select("*")
    .order("order_index", { ascending: true });

  if (questionsError || !questions || questions.length === 0) {
    return NextResponse.json({ error: "Não foi possível carregar as perguntas." }, { status: 500 });
  }

  const answerByQuestionId = new Map(answers.map((a) => [a.questionId, a]));

  let score = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let totalTimeMs = 0;
  const auditTrail: AnswerAudit[] = [];

  for (const question of questions as Question[]) {
    const timeLimitMs = (question.time_limit_seconds ?? DEFAULT_TIME_LIMIT_SECONDS) * 1000;
    const submitted = answerByQuestionId.get(question.id);

    const selectedOption = submitted?.selectedOption ?? null;
    const isCorrect = selectedOption !== null && selectedOption === question.correct_option;
    const elapsedMs = submitted?.elapsedMs ?? timeLimitMs;

    const { points, clampedElapsedMs } = scoreAnswer(isCorrect, timeLimitMs, elapsedMs);

    score += points;
    totalTimeMs += clampedElapsedMs;
    if (isCorrect) correctCount += 1;
    else wrongCount += 1;

    auditTrail.push({
      question_id: question.id,
      question_text: question.text,
      selected_option: selectedOption,
      correct_option: question.correct_option,
      is_correct: isCorrect,
      points_awarded: points,
      elapsed_ms: clampedElapsedMs,
    });
  }

  const { data: participant, error: participantError } = await supabaseAdmin
    .from("quiz_participants")
    .upsert({ name, email, phone }, { onConflict: "email" })
    .select("*")
    .single();

  if (participantError || !participant) {
    return NextResponse.json({ error: "Não foi possível salvar seus dados." }, { status: 500 });
  }

  const { error: attemptError } = await supabaseAdmin.from("quiz_attempts").insert({
    participant_id: participant.id,
    participant_name: name,
    score,
    correct_count: correctCount,
    wrong_count: wrongCount,
    total_time_ms: totalTimeMs,
    answers: auditTrail,
  });

  if (attemptError) {
    return NextResponse.json({ error: "Não foi possível salvar sua tentativa." }, { status: 500 });
  }

  await supabaseAdmin.rpc("quiz_upsert_leaderboard_best", {
    p_participant_id: participant.id,
    p_participant_name: name,
    p_score: score,
    p_total_time_ms: totalTimeMs,
  });

  return NextResponse.json({
    score,
    correctCount,
    wrongCount,
    totalTimeMs,
    totalQuestions: questions.length,
  });
}
