/*
  Warnings:

  - Added the required column `rowId` to the `tbl_audits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tbl_audits" ADD COLUMN     "rowId" INTEGER NOT NULL;
