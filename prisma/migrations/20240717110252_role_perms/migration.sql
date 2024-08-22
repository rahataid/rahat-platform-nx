-- AlterTable
ALTER TABLE "tbl_auth_roles" ADD COLUMN     "onChain" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scope" TEXT;
