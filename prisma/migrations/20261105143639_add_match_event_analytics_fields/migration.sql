-- AlterTable
ALTER TABLE "MatchEvent" ADD COLUMN     "duelOutcome" TEXT,
ADD COLUMN     "duelType" TEXT,
ADD COLUMN     "foulCard" TEXT,
ADD COLUMN     "passAssistId" INTEGER,
ADD COLUMN     "passAssistedShotId" TEXT,
ADD COLUMN     "passOutcome" TEXT,
ADD COLUMN     "passReciepentId" INTEGER,
ADD COLUMN     "passType" TEXT,
ADD COLUMN     "substitutionReplacementId" INTEGER,
ADD COLUMN     "substitutionReplacementName" TEXT;
