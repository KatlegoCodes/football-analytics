ALTER TABLE "Player"
ADD COLUMN "externalId" INTEGER,
ADD COLUMN "provider" TEXT;

CREATE UNIQUE INDEX "Player_provider_externalId_key"
ON "Player"("provider", "externalId");
