/*
  Warnings:

  - A unique constraint covering the columns `[name,scope]` on the table `tbl_auth_roles` will be added. If there are existing duplicate values, this will fail.
  - Made the column `scope` on table `tbl_auth_roles` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "tbl_auth_roles_name_key";

-- AlterTable
ALTER TABLE "tbl_auth_roles" ALTER COLUMN "scope" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tbl_auth_roles_name_scope_key" ON "tbl_auth_roles"("name", "scope");
