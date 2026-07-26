import * as z from "zod";
import { MAX_OPTIONS, MIN_OPTIONS } from "@/lib/constants";

export const answerInputSchema = z.object({
  questionId: z.uuid(),
  selectedOption: z.number().int().nonnegative().nullable(),
  elapsedMs: z.number().int().nonnegative(),
});

export const quizSubmitSchema = z.object({
  name: z.string().trim().min(2, { error: "Nome muito curto." }),
  email: z.email({ error: "E-mail inválido." }).trim().toLowerCase(),
  phone: z.string().trim().min(8, { error: "Telefone inválido." }),
  answers: z.array(answerInputSchema).min(1),
});

export const questionInputSchema = z.object({
  text: z.string().trim().min(1, { error: "A pergunta não pode ficar em branco." }),
  options: z
    .array(z.string().trim().min(1))
    .min(MIN_OPTIONS, { error: `Mínimo de ${MIN_OPTIONS} opções.` })
    .max(MAX_OPTIONS, { error: `Máximo de ${MAX_OPTIONS} opções.` }),
  correct_option: z.number().int().nonnegative(),
  time_limit_seconds: z.number().int().positive().nullable(),
}).refine((data) => data.correct_option < data.options.length, {
  error: "A opção correta precisa apontar para uma das alternativas.",
  path: ["correct_option"],
});

export const reorderSchema = z.object({
  orderedIds: z.array(z.uuid()).min(1),
});

export const adminLoginSchema = z.object({
  password: z.string().min(1),
});
