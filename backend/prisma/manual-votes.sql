DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'VoteValue') THEN
    CREATE TYPE "VoteValue" AS ENUM ('UP', 'DOWN');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "PropertyVote" (
  "id" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "value" "VoteValue" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PropertyVote_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PropertyVote_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "PropertyVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "PropertyVote_propertyId_userId_key" UNIQUE ("propertyId", "userId")
);

CREATE TABLE IF NOT EXISTS "ReviewVote" (
  "id" TEXT NOT NULL,
  "reviewId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "value" "VoteValue" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReviewVote_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ReviewVote_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ReviewVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ReviewVote_reviewId_userId_key" UNIQUE ("reviewId", "userId")
);
