-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "nextAvailableDate" TEXT,
ADD COLUMN     "roomsLeft" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sleepingArrangement" JSONB,
ADD COLUMN     "verifiedRiderRecommended" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "photos" TEXT[],
ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "parkingSafetyRating" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "recentViewedPropertyIds" TEXT[],
ADD COLUMN     "savedPropertyIds" TEXT[],
ADD COLUMN     "savedUrgentStopPropertyIds" TEXT[];
