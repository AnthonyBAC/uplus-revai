-- CreateEnum
CREATE TYPE "Sentiment" AS ENUM ('POSITIVE', 'NEGATIVE', 'NEUTRAL');

-- CreateEnum
CREATE TYPE "AnalysisSourceType" AS ENUM ('REVIEW', 'SURVEY');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "analysis_results" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "branchId" TEXT,
    "sourceType" "AnalysisSourceType" NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sentiment" "Sentiment" NOT NULL,
    "summary" TEXT NOT NULL,
    "keywords" TEXT[],
    "periodMonth" TIMESTAMP(3),
    "rawPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analysis_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "branchId" TEXT,
    "title" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "content" JSONB,
    "generatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analysis_results_businessId_createdAt_idx" ON "analysis_results"("businessId", "createdAt");

-- CreateIndex
CREATE INDEX "analysis_results_businessId_sourceType_idx" ON "analysis_results"("businessId", "sourceType");

-- CreateIndex
CREATE INDEX "analysis_results_branchId_idx" ON "analysis_results"("branchId");

-- CreateIndex
CREATE INDEX "reports_businessId_createdAt_idx" ON "reports"("businessId", "createdAt");

-- CreateIndex
CREATE INDEX "reports_branchId_idx" ON "reports"("branchId");
