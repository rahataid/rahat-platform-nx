-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "Service" AS ENUM ('EMAIL', 'PHONE', 'WALLET', 'GOOGLE', 'APPLE', 'FACEBOOK', 'TWITTER', 'GITHUB', 'LINKEDIN');

-- CreateEnum
CREATE TYPE "SignupStatus" AS ENUM ('PENDING', 'APPROVED', 'FAILED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SettingDataType" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'OBJECT');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('NOT_READY', 'ACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "BeneficiaryTypes" AS ENUM ('ENROLLED', 'REFERRED');

-- CreateEnum
CREATE TYPE "BankedStatus" AS ENUM ('UNKNOWN', 'UNBANKED', 'BANKED', 'UNDER_BANKED');

-- CreateEnum
CREATE TYPE "InternetStatus" AS ENUM ('UNKNOWN', 'NO_INTERNET', 'HOME_INTERNET', 'MOBILE_INTERNET');

-- CreateEnum
CREATE TYPE "PhoneStatus" AS ENUM ('UNKNOWN', 'NO_PHONE', 'FEATURE_PHONE', 'SMART_PHONE');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'FAILED');

-- CreateEnum
CREATE TYPE "GrievanceStatus" AS ENUM ('NEW', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "GrievanceType" AS ENUM ('TECHNICAL', 'NON_TECHNICAL', 'OTHER');

-- CreateTable
CREATE TABLE "tbl_users" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT,
    "gender" "Gender" NOT NULL DEFAULT 'UNKNOWN',
    "email" TEXT,
    "phone" TEXT,
    "wallet" TEXT,
    "extras" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,

    CONSTRAINT "tbl_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_auth_roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "expiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER
);

-- CreateTable
CREATE TABLE "tbl_auth_permissions" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "action" VARCHAR NOT NULL,
    "subject" VARCHAR NOT NULL,
    "inverted" BOOLEAN NOT NULL DEFAULT false,
    "conditions" JSONB,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "tbl_users_roles" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "expiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,

    CONSTRAINT "tbl_users_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_auth" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "service" "Service" NOT NULL,
    "serviceId" TEXT NOT NULL,
    "details" JSONB,
    "challenge" TEXT,
    "falseAttempts" INTEGER NOT NULL DEFAULT 0,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedOnAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_auth_sessions" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "authId" INTEGER NOT NULL,
    "ip" TEXT,
    "details" JSONB,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_auth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_users_signups" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "userIdentifier" TEXT,
    "data" JSONB,
    "status" "SignupStatus" NOT NULL DEFAULT 'PENDING',
    "rejectedReason" TEXT,
    "approvedBy" INTEGER,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_users_signups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_settings" (
    "name" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "dataType" "SettingDataType" NOT NULL,
    "requiredFields" TEXT[],
    "isReadOnly" BOOLEAN NOT NULL DEFAULT false,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tbl_settings_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "tbl_beneficiaries" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'UNKNOWN',
    "walletAddress" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "age" INTEGER,
    "location" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "extras" JSONB,
    "notes" TEXT,
    "bankedStatus" "BankedStatus" NOT NULL DEFAULT 'UNKNOWN',
    "internetStatus" "InternetStatus" NOT NULL DEFAULT 'UNKNOWN',
    "phoneStatus" "PhoneStatus" NOT NULL DEFAULT 'UNKNOWN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tbl_beneficiaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_grouped_beneficiaries" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "beneficiaryGroupId" UUID NOT NULL,
    "beneficiaryId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_grouped_beneficiaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_beneficiaries_group" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_beneficiaries_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_beneficiaries_gorup_projects" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "beneficiaryGroupId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_beneficiaries_gorup_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_beneficiaries_projects" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "beneficiaryId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_beneficiaries_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_beneficiaries_pii" (
    "beneficiaryId" INTEGER NOT NULL,
    "name" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "extras" JSONB
);

-- CreateTable
CREATE TABLE "tbl_projects" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'NOT_READY',
    "type" TEXT NOT NULL,
    "contractAddress" TEXT,
    "extras" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_stats" (
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "group" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_stats_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "tbl_vendors" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "location" TEXT,
    "wallet" TEXT,
    "extras" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_projects_vendors" (
    "id" SERIAL NOT NULL,
    "projectId" UUID NOT NULL,
    "vendorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_projects_vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_transactions" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "beneficiaryId" UUID NOT NULL,
    "vendorId" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "extras" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_grievances" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "reportedBy" TEXT NOT NULL,
    "reporterUserId" INTEGER NOT NULL,
    "reporterContact" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "GrievanceType" NOT NULL,
    "projectId" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "status" "GrievanceStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_grievances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_temp_beneficiaries" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "govtIDNumber" TEXT,
    "gender" "Gender" NOT NULL DEFAULT 'UNKNOWN',
    "birthDate" TIMESTAMP(3),
    "walletAddress" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "notes" TEXT,
    "bankedStatus" "BankedStatus" NOT NULL DEFAULT 'UNKNOWN',
    "internetStatus" "InternetStatus" NOT NULL DEFAULT 'UNKNOWN',
    "phoneStatus" "PhoneStatus" NOT NULL DEFAULT 'UNKNOWN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "extras" JSONB,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_temp_beneficiaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_temp_group" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_temp_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_temp_beneficiary_group" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "tempGroupUID" UUID NOT NULL,
    "tempBenefUID" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_temp_beneficiary_group_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_uuid_key" ON "tbl_users"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_auth_roles_id_key" ON "tbl_auth_roles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_auth_roles_name_key" ON "tbl_auth_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_auth_permissions_id_key" ON "tbl_auth_permissions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_roles_userId_roleId_key" ON "tbl_users_roles"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_auth_service_serviceId_key" ON "tbl_auth"("service", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_auth_sessions_sessionId_key" ON "tbl_auth_sessions"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_signups_uuid_key" ON "tbl_users_signups"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_settings_name_key" ON "tbl_settings"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_beneficiaries_uuid_key" ON "tbl_beneficiaries"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_beneficiaries_walletAddress_key" ON "tbl_beneficiaries"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_grouped_beneficiaries_uuid_key" ON "tbl_grouped_beneficiaries"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_grouped_beneficiaries_beneficiaryGroupId_beneficiaryId_key" ON "tbl_grouped_beneficiaries"("beneficiaryGroupId", "beneficiaryId");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_beneficiaries_group_uuid_key" ON "tbl_beneficiaries_group"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_beneficiaries_group_name_key" ON "tbl_beneficiaries_group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_beneficiaries_gorup_projects_uuid_key" ON "tbl_beneficiaries_gorup_projects"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_beneficiaries_gorup_projects_projectId_beneficiaryGroup_key" ON "tbl_beneficiaries_gorup_projects"("projectId", "beneficiaryGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_beneficiaries_projects_uuid_key" ON "tbl_beneficiaries_projects"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_beneficiaries_projects_projectId_beneficiaryId_key" ON "tbl_beneficiaries_projects"("projectId", "beneficiaryId");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_beneficiaries_pii_beneficiaryId_key" ON "tbl_beneficiaries_pii"("beneficiaryId");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_beneficiaries_pii_phone_key" ON "tbl_beneficiaries_pii"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_projects_uuid_key" ON "tbl_projects"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_stats_name_key" ON "tbl_stats"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_vendors_uuid_key" ON "tbl_vendors"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_projects_vendors_projectId_vendorId_key" ON "tbl_projects_vendors"("projectId", "vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_transactions_uuid_key" ON "tbl_transactions"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_grievances_uuid_key" ON "tbl_grievances"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_temp_beneficiaries_uuid_key" ON "tbl_temp_beneficiaries"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_temp_group_uuid_key" ON "tbl_temp_group"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_temp_group_name_key" ON "tbl_temp_group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_temp_beneficiary_group_uuid_key" ON "tbl_temp_beneficiary_group"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_temp_beneficiary_group_tempGroupUID_tempBenefUID_key" ON "tbl_temp_beneficiary_group"("tempGroupUID", "tempBenefUID");

-- AddForeignKey
ALTER TABLE "tbl_auth_permissions" ADD CONSTRAINT "tbl_auth_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "tbl_auth_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_users_roles" ADD CONSTRAINT "tbl_users_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tbl_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_users_roles" ADD CONSTRAINT "tbl_users_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "tbl_auth_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_auth" ADD CONSTRAINT "tbl_auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tbl_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_auth_sessions" ADD CONSTRAINT "tbl_auth_sessions_authId_fkey" FOREIGN KEY ("authId") REFERENCES "tbl_auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_users_signups" ADD CONSTRAINT "tbl_users_signups_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "tbl_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_grouped_beneficiaries" ADD CONSTRAINT "tbl_grouped_beneficiaries_beneficiaryGroupId_fkey" FOREIGN KEY ("beneficiaryGroupId") REFERENCES "tbl_beneficiaries_group"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_grouped_beneficiaries" ADD CONSTRAINT "tbl_grouped_beneficiaries_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "tbl_beneficiaries"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_beneficiaries_gorup_projects" ADD CONSTRAINT "tbl_beneficiaries_gorup_projects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "tbl_projects"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_beneficiaries_gorup_projects" ADD CONSTRAINT "tbl_beneficiaries_gorup_projects_beneficiaryGroupId_fkey" FOREIGN KEY ("beneficiaryGroupId") REFERENCES "tbl_beneficiaries_group"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_beneficiaries_projects" ADD CONSTRAINT "tbl_beneficiaries_projects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "tbl_projects"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_beneficiaries_projects" ADD CONSTRAINT "tbl_beneficiaries_projects_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "tbl_beneficiaries"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_beneficiaries_pii" ADD CONSTRAINT "tbl_beneficiaries_pii_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "tbl_beneficiaries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_projects_vendors" ADD CONSTRAINT "tbl_projects_vendors_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "tbl_projects"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_projects_vendors" ADD CONSTRAINT "tbl_projects_vendors_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "tbl_users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_grievances" ADD CONSTRAINT "tbl_grievances_reporterUserId_fkey" FOREIGN KEY ("reporterUserId") REFERENCES "tbl_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_grievances" ADD CONSTRAINT "tbl_grievances_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "tbl_projects"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_temp_beneficiary_group" ADD CONSTRAINT "tbl_temp_beneficiary_group_tempGroupUID_fkey" FOREIGN KEY ("tempGroupUID") REFERENCES "tbl_temp_group"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_temp_beneficiary_group" ADD CONSTRAINT "tbl_temp_beneficiary_group_tempBenefUID_fkey" FOREIGN KEY ("tempBenefUID") REFERENCES "tbl_temp_beneficiaries"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
