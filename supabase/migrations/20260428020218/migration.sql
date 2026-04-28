/*
  Warnings:

  - You are about to drop the `survey_answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `survey_questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `survey_responses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `surveys` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "survey_answers" DROP CONSTRAINT "survey_answers_questionId_fkey";

-- DropForeignKey
ALTER TABLE "survey_answers" DROP CONSTRAINT "survey_answers_responseId_fkey";

-- DropForeignKey
ALTER TABLE "survey_questions" DROP CONSTRAINT "survey_questions_surveyId_fkey";

-- DropForeignKey
ALTER TABLE "survey_responses" DROP CONSTRAINT "survey_responses_surveyId_fkey";

-- DropTable
DROP TABLE "survey_answers";

-- DropTable
DROP TABLE "survey_questions";

-- DropTable
DROP TABLE "survey_responses";

-- DropTable
DROP TABLE "surveys";

-- DropEnum
DROP TYPE "QuestionType";
