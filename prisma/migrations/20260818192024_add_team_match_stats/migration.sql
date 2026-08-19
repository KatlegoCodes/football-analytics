-- CreateTable
CREATE TABLE "teamMatchStat" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "possession" INTEGER NOT NULL,
    "shots" INTEGER NOT NULL DEFAULT 0,
    "shotsOnTarget" INTEGER NOT NULL DEFAULT 0,
    "corners" INTEGER NOT NULL DEFAULT 0,
    "fouls" INTEGER NOT NULL DEFAULT 0,
    "yellowCards" INTEGER NOT NULL DEFAULT 0,
    "redCards" INTEGER NOT NULL DEFAULT 0,
    "offsides" INTEGER NOT NULL DEFAULT 0,
    "passes" INTEGER NOT NULL DEFAULT 0,
    "passAccuracy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teamMatchStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teamMatchStat_teamId_matchId_key" ON "teamMatchStat"("teamId", "matchId");

-- AddForeignKey
ALTER TABLE "teamMatchStat" ADD CONSTRAINT "teamMatchStat_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teamMatchStat" ADD CONSTRAINT "teamMatchStat_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
