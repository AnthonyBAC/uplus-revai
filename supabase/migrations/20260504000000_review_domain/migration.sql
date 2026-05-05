-- CreateEnum
CREATE TYPE "ReviewSource" AS ENUM ('GOOGLE');

-- CreateEnum
CREATE TYPE "ReviewSyncStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "PlatformConnectionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED');

-- CreateTable
CREATE TABLE "business_platform_connections" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "branchId" TEXT,
    "source" "ReviewSource" NOT NULL,
    "externalAccountId" TEXT NOT NULL,
    "externalLocationId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "status" "PlatformConnectionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_platform_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "branchId" TEXT,
    "connectionId" TEXT NOT NULL,
    "source" "ReviewSource" NOT NULL,
    "externalId" TEXT NOT NULL,
    "authorName" TEXT,
    "authorExternalId" TEXT,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "language" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rawPayload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_sync_jobs" (
    "id" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "branchId" TEXT,
    "status" "ReviewSyncStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "reviewsFetched" INTEGER NOT NULL DEFAULT 0,
    "reviewsNew" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "triggeredBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_sync_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_platform_connections_businessId_source_externalLocationId_key" ON "business_platform_connections"("businessId", "source", "externalLocationId");

-- CreateIndex
CREATE INDEX "business_platform_connections_businessId_idx" ON "business_platform_connections"("businessId");

-- CreateIndex
CREATE INDEX "business_platform_connections_branchId_idx" ON "business_platform_connections"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_businessId_source_externalId_key" ON "reviews"("businessId", "source", "externalId");

-- CreateIndex
CREATE INDEX "reviews_businessId_publishedAt_idx" ON "reviews"("businessId", "publishedAt");

-- CreateIndex
CREATE INDEX "reviews_branchId_publishedAt_idx" ON "reviews"("branchId", "publishedAt");

-- CreateIndex
CREATE INDEX "reviews_connectionId_idx" ON "reviews"("connectionId");

-- CreateIndex
CREATE INDEX "review_sync_jobs_businessId_createdAt_idx" ON "review_sync_jobs"("businessId", "createdAt");

-- CreateIndex
CREATE INDEX "review_sync_jobs_status_idx" ON "review_sync_jobs"("status");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "business_platform_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_sync_jobs" ADD CONSTRAINT "review_sync_jobs_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "business_platform_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
