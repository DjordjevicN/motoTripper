-- CreateEnum
CREATE TYPE "TrustTier" AS ENUM ('UNVERIFIED', 'TRUSTED', 'HIGH_TRUST', 'ELITE');

-- CreateEnum
CREATE TYPE "RidingStyle" AS ENUM ('TOURING', 'SPORT', 'ADVENTURE', 'COMMUTER', 'MIXED');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'EXPERIENCED', 'VETERAN');

-- CreateEnum
CREATE TYPE "MotorcycleType" AS ENUM ('SPORT', 'NAKED', 'TOURING', 'ADVENTURE', 'CRUISER', 'SCOOTER', 'OTHER');

-- CreateEnum
CREATE TYPE "TypicalTripType" AS ENUM ('DAY_RIDES', 'WEEKEND_TRIPS', 'MULTI_DAY_TOURS', 'MIXED');

-- CreateEnum
CREATE TYPE "PreferredStopStyle" AS ENUM ('BUDGET', 'COMFORT', 'SECURE_PARKING_FIRST', 'MIXED');

-- CreateEnum
CREATE TYPE "PropertyListingSource" AS ENUM ('OFFICIAL', 'COMMUNITY');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('DRAFT', 'LIVE', 'PENDING_REVIEW', 'ARCHIVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "locationLabel" TEXT,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "parkingConfirmationCount" INTEGER NOT NULL DEFAULT 0,
    "photoContributionCount" INTEGER NOT NULL DEFAULT 0,
    "helpfulVotesReceived" INTEGER NOT NULL DEFAULT 0,
    "accountAgeDays" INTEGER NOT NULL DEFAULT 0,
    "trustScore" INTEGER NOT NULL DEFAULT 0,
    "trustTier" "TrustTier" NOT NULL DEFAULT 'UNVERIFIED',
    "xp" INTEGER,
    "levelLabel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiderProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ridingStyle" "RidingStyle",
    "experienceLevel" "ExperienceLevel",
    "typicalTripType" "TypicalTripType",
    "preferredStopStyle" "PreferredStopStyle",
    "memberSince" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Motorcycle" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER,
    "type" "MotorcycleType",
    "engineCc" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Motorcycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "locationLabel" TEXT NOT NULL,
    "city" TEXT,
    "country" TEXT,
    "phone" TEXT,
    "websiteUrl" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "nightlyPrice" DECIMAL(10,2) NOT NULL,
    "cleaningFee" DECIMAL(10,2) NOT NULL,
    "serviceFee" DECIMAL(10,2) NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "bedrooms" INTEGER NOT NULL DEFAULT 1,
    "guests" INTEGER NOT NULL DEFAULT 1,
    "availableTonight" BOOLEAN NOT NULL DEFAULT false,
    "coveredParking" BOOLEAN NOT NULL DEFAULT false,
    "trailerFriendly" BOOLEAN NOT NULL DEFAULT false,
    "motoWashStation" BOOLEAN NOT NULL DEFAULT false,
    "parkingSpaces" INTEGER NOT NULL DEFAULT 0,
    "parkingSecurity" TEXT,
    "wifiSpeedMbps" INTEGER,
    "wifiNotes" TEXT,
    "listingSource" "PropertyListingSource" NOT NULL,
    "status" "PropertyStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyImage" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyTag" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "PropertyTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyAmenity" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "PropertyAmenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "parkingSafetyRating" INTEGER,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "helpfulVotes" INTEGER NOT NULL DEFAULT 0,
    "tripType" TEXT,
    "safeParkingConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "coveredParkingConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParkingConfirmation" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reviewId" TEXT,
    "isSafe" BOOLEAN NOT NULL,
    "isCovered" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "photoEvidenceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParkingConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostListing" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "hostUserId" TEXT NOT NULL,
    "unitCount" INTEGER NOT NULL DEFAULT 1,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "callClicks" INTEGER NOT NULL DEFAULT 0,
    "navigateClicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HostListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityListing" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "submittedByUserId" TEXT NOT NULL,
    "sourceWebsiteUrl" TEXT,
    "sourcePhone" TEXT,
    "parkingNotes" TEXT,
    "lateCheckIn" BOOLEAN NOT NULL DEFAULT false,
    "hasRiderPhotoProof" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityListing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RiderProfile_userId_key" ON "RiderProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Motorcycle_userId_key" ON "Motorcycle"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ParkingConfirmation_reviewId_key" ON "ParkingConfirmation"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "ParkingConfirmation_propertyId_userId_key" ON "ParkingConfirmation"("propertyId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "HostListing_propertyId_key" ON "HostListing"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityListing_propertyId_key" ON "CommunityListing"("propertyId");

-- AddForeignKey
ALTER TABLE "RiderProfile" ADD CONSTRAINT "RiderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Motorcycle" ADD CONSTRAINT "Motorcycle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyImage" ADD CONSTRAINT "PropertyImage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyTag" ADD CONSTRAINT "PropertyTag_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAmenity" ADD CONSTRAINT "PropertyAmenity_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParkingConfirmation" ADD CONSTRAINT "ParkingConfirmation_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParkingConfirmation" ADD CONSTRAINT "ParkingConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParkingConfirmation" ADD CONSTRAINT "ParkingConfirmation_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostListing" ADD CONSTRAINT "HostListing_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostListing" ADD CONSTRAINT "HostListing_hostUserId_fkey" FOREIGN KEY ("hostUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityListing" ADD CONSTRAINT "CommunityListing_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityListing" ADD CONSTRAINT "CommunityListing_submittedByUserId_fkey" FOREIGN KEY ("submittedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
