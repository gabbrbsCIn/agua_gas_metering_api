/*
  Warnings:

  - Changed the type of `measure_type` on the `Measure` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Measure" DROP COLUMN "measure_type",
ADD COLUMN     "measure_type" TEXT NOT NULL;

-- DropEnum
DROP TYPE "MeasureType";
