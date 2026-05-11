-- AlterTable
ALTER TABLE "survey_responses" ADD COLUMN     "capturedByUserId" UUID;

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_capturedByUserId_fkey" FOREIGN KEY ("capturedByUserId") REFERENCES "app_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
