/*
  Warnings:

  - Added the required column `measure_value` to the `Measure` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Measure" ADD COLUMN     "measure_value" INTEGER NOT NULL;
