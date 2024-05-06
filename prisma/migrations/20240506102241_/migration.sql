-- CreateEnum
CREATE TYPE "AuditOperation" AS ENUM ('CREATE', 'CREATE_MANY', 'UPDATE', 'UPDATE_MANY', 'DELETE', 'DELETE_MANY', 'UPSERT');

-- CreateTable
CREATE TABLE "tbl_audits" (
    "id" SERIAL NOT NULL,
    "tableName" TEXT NOT NULL,
    "operation" "AuditOperation" NOT NULL,
    "fieldName" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "version" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_audits_id_key" ON "tbl_audits"("id");

-- AddForeignKey
ALTER TABLE "tbl_audits" ADD CONSTRAINT "tbl_audits_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "tbl_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
