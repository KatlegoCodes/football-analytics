/*
  Warnings:

  - A unique constraint covering the columns `[provider,externalId]` on the table `Season` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "externalId" INTEGER,
ADD COLUMN     "provider" TEXT;

-- AlterTable
ALTER TABLE "Season" ADD COLUMN     "externalId" INTEGER,
ADD COLUMN     "provider" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Season_provider_externalId_key" ON "Season"("provider", "externalId");
