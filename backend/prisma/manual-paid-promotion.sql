DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PaidPromotionPlan') THEN
    CREATE TYPE "PaidPromotionPlan" AS ENUM ('WEEK', 'MONTH', 'YEAR');
  END IF;
END
$$;

ALTER TABLE "Property"
ADD COLUMN IF NOT EXISTS "paidPromotionPlan" "PaidPromotionPlan";

ALTER TABLE "Property"
ADD COLUMN IF NOT EXISTS "paidPromotionUntil" TIMESTAMP(3);
