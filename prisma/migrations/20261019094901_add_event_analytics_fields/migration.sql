/*
  Warnings:

  - You are about to drop the `playerMatchStat` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[provider,externalId]` on the table `MatchEvent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalId` to the `MatchEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `MatchEvent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "playerMatchStat" DROP CONSTRAINT "playerMatchStat_matchId_fkey";

-- DropForeignKey
ALTER TABLE "playerMatchStat" DROP CONSTRAINT "playerMatchStat_playerId_fkey";

-- AlterTable
ALTER TABLE "MatchEvent" ADD COLUMN     "eventIndex" INTEGER,
ADD COLUMN     "externalId" TEXT NOT NULL,
ADD COLUMN     "locationX" DOUBLE PRECISION,
ADD COLUMN     "locationY" DOUBLE PRECISION,
ADD COLUMN     "period" INTEGER,
ADD COLUMN     "provider" TEXT NOT NULL,
ADD COLUMN     "shotBodyPart" TEXT,
ADD COLUMN     "shotOutcome" TEXT,
ADD COLUMN     "shotTechnique" TEXT,
ADD COLUMN     "shotXg" DOUBLE PRECISION,
ADD COLUMN     "timestamp" TEXT;

-- DropTable
DROP TABLE "playerMatchStat";

-- CreateTable
CREATE TABLE "PlayerMatchStat" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "minutesPlayed" INTEGER,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "shots" INTEGER NOT NULL DEFAULT 0,
    "shotsOnTarget" INTEGER NOT NULL DEFAULT 0,
    "passes" INTEGER NOT NULL DEFAULT 0,
    "keyPasses" INTEGER NOT NULL DEFAULT 0,
    "tackles" INTEGER NOT NULL DEFAULT 0,
    "interceptions" INTEGER NOT NULL DEFAULT 0,
    "yellowCards" INTEGER NOT NULL DEFAULT 0,
    "redCards" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerMatchStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerMatchStat_playerId_matchId_key" ON "PlayerMatchStat"("playerId", "matchId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchEvent_provider_externalId_key" ON "MatchEvent"("provider", "externalId");

-- AddForeignKey
ALTER TABLE "PlayerMatchStat" ADD CONSTRAINT "PlayerMatchStat_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerMatchStat" ADD CONSTRAINT "PlayerMatchStat_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
