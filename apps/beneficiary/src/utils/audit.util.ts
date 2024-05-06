import { AuditOperation, Prisma, PrismaClient } from '@prisma/client'
import { auditTransact } from '@rumsan/prisma'


export const AuditBeneficiary = {
  create: (prisma: PrismaClient, userId: number, data: Prisma.BeneficiaryCreateArgs) =>
    auditTransact(prisma, {
      userId,
      operation: AuditOperation.CREATE,
      tableName: 'tbl_beneficiaries',
    })(prisma.beneficiary.create, data),


  createPII: (prisma: PrismaClient, userId: number, data: Prisma.BeneficiaryPiiCreateArgs) =>
    auditTransact(prisma, {
      userId,
      operation: AuditOperation.CREATE,
      tableName: 'tbl_beneficiaries_pii',
    })(prisma.beneficiaryPii.create, data),

  update: (prisma: PrismaClient, userId: number, data: Prisma.BeneficiaryUpdateArgs) =>
    auditTransact(prisma, {
      userId,
      operation: AuditOperation.UPDATE,
      tableName: 'tbl_beneficiaries',
    })(prisma.beneficiary.update, data),
}

