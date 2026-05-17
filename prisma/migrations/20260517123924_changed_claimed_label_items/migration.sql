/*
  Warnings:

  - You are about to drop the `claims` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "claims" DROP CONSTRAINT "claims_product_id_fkey";

-- DropForeignKey
ALTER TABLE "claims" DROP CONSTRAINT "claims_user_id_fkey";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "claim_status" "ClaimStatus" NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "claims";
