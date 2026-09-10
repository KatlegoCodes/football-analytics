/*
  Warnings:

  - A unique constraint covering the columns `[provider,externalId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "code" TEXT,
ADD COLUMN     "crestUrl" TEXT,
ADD COLUMN     "externalId" INTEGER,
ADD COLUMN     "provider" TEXT,
ALTER COLUMN "shortName" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Team_provider_externalId_key" ON "Team"("provider", "externalId");
