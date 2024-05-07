import { AuditOperation, Prisma, PrismaClient } from '@prisma/client'
import { auditTransact } from '@rumsan/extensions/audits'

export const AuditBeneficiary = {
  create: (prisma: PrismaClient, userId: number, payload: Prisma.BeneficiaryCreateArgs) =>
    auditTransact(prisma, {
      userId,
      operation: AuditOperation.CREATE,
      rowIdKey: 'id',
      tableName: 'tbl_beneficiaries',
      args: payload,
      operationFunction: (tx, p) => tx.beneficiary.create(p)
    }),

  createPII: (prisma: PrismaClient, userId: number, payload: Prisma.BeneficiaryPiiCreateArgs) =>
    auditTransact(prisma, {
      userId,
      operation: AuditOperation.CREATE,
      tableName: 'tbl_beneficiaries_pii',
      rowIdKey: 'beneficiaryId',
      args: payload,
      operationFunction: (tx, p) => tx.beneficiaryPii.create(p)
    }),

  update: (prisma: PrismaClient, userId: number, payload: Prisma.BeneficiaryUpdateArgs) =>
    auditTransact(prisma, {
      userId,
      operation: AuditOperation.UPDATE,
      tableName: 'tbl_beneficiaries',
      rowIdKey: 'id',
      args: payload,
      operationFunction: (tx, p) => tx.beneficiary.update(p)
    }),

  updatePII: (prisma: PrismaClient, userId: number, payload: Prisma.BeneficiaryPiiUpdateArgs) =>
    auditTransact(prisma, {
      userId,
      operation: AuditOperation.UPDATE,
      tableName: 'tbl_beneficiaries_pii',
      rowIdKey: 'beneficiaryId',
      args: payload,
      operationFunction: (tx, p) =>
        tx.beneficiaryPii.update(p)
    }),
}

