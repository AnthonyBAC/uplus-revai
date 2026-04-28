import { z } from 'zod';

// ---------- Enums ----------

export const QuestionTypeSchema = z.enum([
  'TEXT',
  'RATING',
  'SINGLE_CHOICE',
  'MULTIPLE_CHOICE',
]);

// ---------- Survey ----------

export const CreateSurveySchema = z.object({
  businessId: z.string().uuid(),
  branchId: z.string().uuid().optional(),
  title: z.string().min(1, 'El título es requerido').max(255),
  questions: z
    .array(
      z.object({
        text: z.string().min(1, 'El texto de la pregunta es requerido'),
        type: QuestionTypeSchema,
        order: z.number().int().min(1),
      })
    )
    .min(1, 'La encuesta debe tener al menos una pregunta'),
});

export const UpdateSurveySchema = z.object({
  title: z.string().min(1).max(255).optional(),
  isActive: z.boolean().optional(),
});

// ---------- Response ----------

export const CreateSurveyResponseSchema = z.object({
  businessId: z.string().uuid(),
  branchId: z.string().uuid().optional(),
  answers: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        value: z.string().min(1, 'La respuesta no puede estar vacía'),
      })
    )
    .min(1, 'Debe incluir al menos una respuesta'),
});

// ---------- Types ----------

export type CreateSurveyInput = z.infer<typeof CreateSurveySchema>;
export type UpdateSurveyInput = z.infer<typeof UpdateSurveySchema>;
export type CreateSurveyResponseInput = z.infer<typeof CreateSurveyResponseSchema>;