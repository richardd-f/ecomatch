-- AlterTable
ALTER TABLE "products" ADD COLUMN     "freshness_score" INTEGER,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;
