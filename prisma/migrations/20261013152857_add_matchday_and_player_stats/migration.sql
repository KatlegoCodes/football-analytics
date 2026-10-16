/*
  Warnings:

  - A unique constraint covering the columns `[provider,externalId]` on the table `Match` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "matchday" INTEGER,
ALTER COLUMN "homeScore" DROP NOT NULL,
ALTER COLUMN "awayScore" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Match_provider_externalId_key" ON "Match"("provider", "externalId");
