/*
  Warnings:

  - A unique constraint covering the columns `[customId]` on the table `tbl_beneficiaries` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customId` to the `tbl_beneficiaries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tbl_beneficiaries" ADD COLUMN     "customId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tbl_beneficiaries_customId_key" ON "tbl_beneficiaries"("customId");
