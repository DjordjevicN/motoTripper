import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

const connectionString = String(process.env.DATABASE_URL || '').replace(
  '?sslmode=require',
  '',
)

if (!connectionString) {
  throw new Error('DATABASE_URL is missing.')
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
})

await client.connect()

await client.query(`
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PaidPromotionPlan') THEN
      CREATE TYPE "PaidPromotionPlan" AS ENUM ('WEEK', 'MONTH', 'YEAR');
    END IF;
  END
  $$;
`)

await client.query(`
  ALTER TABLE "Property"
  ADD COLUMN IF NOT EXISTS "paidPromotionPlan" TEXT;
`)

await client.query(`
  ALTER TABLE "Property"
  ADD COLUMN IF NOT EXISTS "paidPromotionUntil" TIMESTAMP(3);
`)

await client.query(`
  ALTER TABLE "Property"
  ALTER COLUMN "paidPromotionPlan" TYPE "PaidPromotionPlan"
  USING CASE
    WHEN "paidPromotionPlan" IS NULL THEN NULL
    ELSE "paidPromotionPlan"::"PaidPromotionPlan"
  END;
`)

await client.end()

console.log('Applied paid promotion DB changes')
