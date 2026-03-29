-- CreateEnum
CREATE TYPE "PlatformRole" AS ENUM ('RIDER', 'HOST', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "platformRole" "PlatformRole" NOT NULL DEFAULT 'RIDER';
