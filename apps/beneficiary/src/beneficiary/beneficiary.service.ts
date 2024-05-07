import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Beneficiary } from '@prisma/client';
import {
  AddBenToProjectDto,
  AddToProjectDto,
  CreateBeneficiaryDto,
  ListBeneficiaryDto,
  ListProjectBeneficiaryDto,
  UpdateBeneficiaryDto,
} from '@rahataid/extensions';
import {
  BQUEUE,
  BeneficiaryConstants,
  BeneficiaryEvents,
  BeneficiaryJobs,
  ProjectContants,
  TPIIData,
  generateRandomWallet,
} from '@rahataid/sdk';
import { PaginatorTypes, PrismaService, paginator } from '@rumsan/prisma';
import { Queue } from 'bull';
import { UUID } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { isAddress } from 'viem';
import { AuditBeneficiary } from '../utils/audit.util';
import { createListQuery } from './helpers';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 20 });

@Injectable()
export class BeneficiaryService {
  private rsprisma;
  constructor(
    protected prisma: PrismaService,
    @Inject(ProjectContants.ELClient) private readonly client: ClientProxy,
    @InjectQueue(BQUEUE.RAHAT_BENEFICIARY)
    private readonly beneficiaryQueue: Queue,
    private eventEmitter: EventEmitter2
  ) {
    this.rsprisma = this.prisma.rsclient;
  }

  addToProject(dto: AddToProjectDto) {
    return this.prisma.beneficiaryProject.create({
      data: dto,
    });
  }

  async listPiiData(dto: any) {
    const repository = dto.projectId ? this.rsprisma.beneficiaryProject : this.rsprisma.beneficiaryPii;
    const include = dto.projectId ? { Beneficiary: true } : {};
    const where = dto.projectId ? { projectId: dto.projectId } : {};

    const data = await paginate(
      repository,
      {
        where: where,
        include: include,
      },
      {
        page: dto.page,
        perPage: dto.perPage,
      }
    );

    if (dto.projectId && data.data.length > 0) {
      const mergedData = await this.mergeProjectPIIData(data.data);
      data.data = mergedData;
      const projectPayload = { ...data, status: dto.type };
      return this.client.send(
        { cmd: BeneficiaryJobs.LIST, uuid: dto.projectId },
        projectPayload
      );
    }

    if (!dto.projectId) {
      data.data = data?.data?.map((piiData) => ({ piiData }));
    }

    return data;
  }
  async listBenefByProject(dto: ListProjectBeneficiaryDto) {
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    orderBy[dto.sort] = dto.order;
    const data = await paginate(
      this.rsprisma.beneficiaryProject,
      {
        where: {
          projectId: dto.projectId,
        },
        include: { Beneficiary: true },
        orderBy,
      },
      {
        page: dto.page,
        perPage: dto.perPage,
      }
    );
    // return data;

    if (data.data.length > 0) {
      const mergedData = await this.mergeProjectPIIData(data.data);
      data.data = mergedData;
    }
    const projectPayload = { ...data, status: dto.status };
    // return data;
    return this.client.send(
      { cmd: BeneficiaryJobs.LIST, uuid: dto.projectId },
      projectPayload
    );
  }

  async list(
    dto: ListBeneficiaryDto
  ): Promise<PaginatorTypes.PaginatedResult<Beneficiary>> {
    let result = null as any;
    const AND_QUERY = createListQuery(dto);
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    orderBy[dto.sort] = dto.order;
    const projectUUID = dto.projectId;

    result = await paginate(
      this.rsprisma.beneficiary,
      {
        where: {
          //AND: AND_QUERY,
          deletedAt: null,
          BeneficiaryProject: projectUUID ? {
            some: {
              projectId: projectUUID
            }
          } : {}
        },
        include: {
          BeneficiaryProject: {
            include: {
              Project: true,
            },
          },
        },
        orderBy,
      },
      {
        page: dto.page,
        perPage: dto.perPage,
      }
    );

    if (result.data.length > 0) {
      const mergedData = await this.mergePIIData(result.data);
      result.data = mergedData;
    }
    return result;
  }

  async mergeProjectPIIData(data: any) {
    const mergedData = [];
    for (const d of data) {
      const piiData = await this.rsprisma.beneficiaryPii.findUnique({
        where: { beneficiaryId: d.Beneficiary.id },
      });
      if (piiData) d.piiData = piiData;
      mergedData.push(d);
    }
    return mergedData;
  }

  async mergePIIData(data: any) {
    const mergedData = [];
    for (let d of data) {
      const piiData = await this.rsprisma.beneficiaryPii.findUnique({
        where: { beneficiaryId: d.id },
      });
      if (piiData) d.piiData = piiData;
      mergedData.push(d);
    }
    return mergedData;
  }

  async create(dto: CreateBeneficiaryDto & { userId: number }, projectUuid?: string) {
    const { piiData, userId, ...data } = dto;
    if (!data.walletAddress) {
      data.walletAddress = generateRandomWallet().address;
    }
    if (data.walletAddress) {
      const ben = await this.prisma.beneficiary.findUnique({
        where: {
          walletAddress: data.walletAddress,
        },
      });
      if (ben) throw new RpcException('Wallet should be unique');
      const isWallet = isAddress(data.walletAddress);
      if (!isWallet)
        throw new RpcException('Wallet should be valid Ethereum address');
    }
    if (!piiData.phone) throw new RpcException('Phone number is required');
    const benData = await this.rsprisma.beneficiaryPii.findUnique({
      where: {
        phone: piiData.phone,
      },
    });
    if (benData) throw new RpcException('Phone number should be unique');
    if (data.birthDate) data.birthDate = new Date(data.birthDate);
    // const rdata = await this.rsprisma.beneficiary.create({
    //   data,
    // });
    const rdata = await AuditBeneficiary.create(this.rsprisma, userId, { data });
    if (piiData) {
      await AuditBeneficiary.createPII(this.rsprisma, userId, {
        data: {
          beneficiaryId: rdata.id,
          phone: piiData.phone ? piiData.phone.toString() : null,
          ...piiData,
        },
      }
      )
      // await this.prisma.beneficiaryPii.create({
      //   data: {
      //     beneficiaryId: rdata.id,
      //     phone: piiData.phone ? piiData.phone.toString() : null,
      //     ...piiData,
      //   },
      // });
    }
    this.eventEmitter.emit(BeneficiaryEvents.BENEFICIARY_CREATED, {
      projectUuid,
    });
    return rdata;
  }

  async findOne(uuid: UUID) {
    const row = await this.rsprisma.beneficiary.findUnique({
      where: { uuid },
      include: {
        BeneficiaryProject: {
          include: {
            Project: true,
          },
        },
      },
    });
    if (!row) return null;
    const piiData = await this.rsprisma.beneficiaryPii.findUnique({
      where: { beneficiaryId: row.id },
    });
    if (piiData) row.piiData = piiData;
    return row;
  }

  async findOneByWallet(walletAddress: string) {
    const row = await this.rsprisma.beneficiary.findFirst({
      where: { walletAddress },
      include: {
        BeneficiaryProject: {
          include: {
            Project: true,
          },
        },
      },
    });
    if (!row) return null;
    const piiData = await this.rsprisma.beneficiaryPii.findUnique({
      where: { beneficiaryId: row.id },
    });
    if (piiData) row.piiData = piiData;
    return row;
  }

  async findOneByPhone(phone: string) {
    const piiData = await this.rsprisma.beneficiaryPii.findFirst({
      where: { phone },
    });
    if (!piiData) return null;
    const beneficiary = await this.rsprisma.beneficiary.findUnique({
      where: { id: piiData.beneficiaryId },
      include: {
        BeneficiaryProject: {
          include: {
            Project: true,
          },
        },
      },
    });
    if (!beneficiary) return null;
    beneficiary.piiData = piiData;
    return beneficiary;
  }

  async addBeneficiaryToProject(dto: AddBenToProjectDto & { userId: number }, projectUid: UUID) {
    const { type, referrerBeneficiary, referrerVendor, ...rest } = dto;
    // 1. Create Beneficiary
    const benef = await this.create(rest, projectUid);
    const projectPayload = {
      uuid: benef.uuid,
      referrerVendor: referrerVendor || '',
      referrerBeneficiary: referrerBeneficiary || '',
      walletAddress: dto.walletAddress || benef?.walletAddress,
      extras: dto?.extras || null,
      type: type || BeneficiaryConstants.Types.ENROLLED,
    };
    // Clear referrer fields if the beneficiary is ENROLLED
    if (type === BeneficiaryConstants.Types.ENROLLED) {
      delete projectPayload.referrerBeneficiary;
      delete projectPayload.referrerVendor;
    }

    // 2. Save Beneficiary to Project
    await this.saveBeneficiaryToProject({
      beneficiaryId: benef.uuid,
      projectId: projectUid,
    });

    // 3. Sync beneficiary to project
    return this.client.send(
      { cmd: BeneficiaryJobs.ADD_TO_PROJECT, uuid: projectUid },
      projectPayload
    );
  }

  async saveBeneficiaryToProject(dto: AddToProjectDto) {
    return this.prisma.beneficiaryProject.create({ data: dto });
  }

  async bulkAssignToProject(dto) {
    const { beneficiaryIds, projectId } = dto;
    const projectPayloads = [];
    const benProjectData = [];

    await Promise.all(
      beneficiaryIds.map(async (beneficiaryId) => {
        const beneficiaryData = await this.rsprisma.beneficiary.findUnique({
          where: { uuid: beneficiaryId },
        });
        const projectPayload = {
          uuid: beneficiaryData.uuid,
          walletAddress: beneficiaryData.walletAddress,
          extras: beneficiaryData?.extras || null,
          type: BeneficiaryConstants.Types.ENROLLED,
        };
        benProjectData.push({
          projectId,
          beneficiaryId,
        });
        projectPayloads.push(projectPayload);
      })
    );

    //2.Save beneficiary to project
    await this.prisma.beneficiaryProject.createMany({
      data: benProjectData,
    });

    this.eventEmitter.emit(BeneficiaryEvents.BENEFICIARY_ASSIGNED_TO_PROJECT, {
      projectUuid: projectId,
    });

    //3. Sync beneficiary to project

    return this.client.send(
      {
        cmd: BeneficiaryJobs.BULK_ASSIGN_TO_PROJECT,
        uuid: projectId,
      },
      projectPayloads
    );
  }

  async assignBeneficiaryToProject(dto: AddToProjectDto) {
    const { beneficiaryId, projectId } = dto;

    // get project info
    const project = await this.prisma.project.findUnique({
      where: {
        uuid: projectId
      }
    })

    //1. Get beneficiary data
    const beneficiaryData = await this.rsprisma.beneficiary.findUnique({
      where: { uuid: beneficiaryId },
    });
    const projectPayload = {
      uuid: beneficiaryData.uuid,
      walletAddress: beneficiaryData.walletAddress,
      extras: beneficiaryData?.extras || null,
      type: BeneficiaryConstants.Types.ENROLLED,
    };

    // if project type if aa, remove type
    if (project.type.toLowerCase() === 'aa') {
      delete projectPayload.type
    }

    //2.Save beneficiary to project

    await this.saveBeneficiaryToProject({
      beneficiaryId: beneficiaryId,
      projectId: projectId,
    });

    this.eventEmitter.emit(BeneficiaryEvents.BENEFICIARY_ASSIGNED_TO_PROJECT, {
      projectUuid: projectId,
    });

    //3. Sync beneficiary to project
    return this.client.send(
      { cmd: BeneficiaryJobs.ADD_TO_PROJECT, uuid: projectId },
      projectPayload
    );
  }

  // async createBulk(data: CreateBeneficiaryDto[]) {
  //   if (!data.length) return;
  //   const sanitized = data.map((d) => {
  //     return {
  //       ...d,
  //       walletAddress: Buffer.from(d.walletAddress.slice(2), 'hex'),
  //     };
  //   });
  //   return this.rsprisma.beneficiary.createMany({
  //     data: sanitized,
  //   });
  // }

  async update(uuid: UUID, dto: UpdateBeneficiaryDto & { userId: number }) {
    const findUuid = await this.prisma.beneficiary.findUnique({
      where: {
        uuid,
      },
    });

    if (!findUuid) throw new Error('Data not Found');
    const { piiData, userId, ...rest } = dto;

    const rdata = await AuditBeneficiary.update(this.rsprisma, userId, {
      where: {
        uuid,
      },
      data: rest,
    });

    // const rdata = await this.prisma.beneficiary.update({
    //   where: {
    //     uuid,
    //   },
    //   data: rest,
    // });
    if (dto.piiData) await this.updatePIIByBenefUUID(uuid, piiData, userId);
    this.eventEmitter.emit(BeneficiaryEvents.BENEFICIARY_UPDATED);
    return rdata;
  }

  async updatePIIByBenefUUID(benefUUID: UUID, piiData: TPIIData, userId: number) {
    const beneficiary = await this.findOne(benefUUID);
    if (beneficiary) {
      return AuditBeneficiary.updatePII(this.rsprisma, userId, {
        where: { beneficiaryId: beneficiary.id },
        data: piiData,
      });
      // return this.rsprisma.beneficiaryPii.update({
      //   where: { beneficiaryId: beneficiary.id },
      //   data: piiData,
      // });
    }
  }

  async delete(uuid: UUID) {
    const findUuid = await this.prisma.beneficiary.findUnique({
      where: {
        uuid,
      },
    });

    if (!findUuid) throw new Error('Data not Found');

    await this.deletePIIByBenefUUID(uuid);

    const rdata = await this.prisma.beneficiary.delete({
      where: {
        uuid,
      }
    });

    this.eventEmitter.emit(BeneficiaryEvents.BENEFICIARY_UPDATED);
    return rdata;
  }

  async deletePIIByBenefUUID(benefUUID: UUID) {

    const beneficiary = await this.findOne(benefUUID);

    const beneficiaryId = beneficiary.piiData.beneficiaryId;

    if (beneficiary) {
      return this.rsprisma.beneficiaryPii.delete({
        where: { beneficiaryId },
      });
    }
  }

  async remove(payload: any) {
    const uuid = payload.uuid;
    const findUuid = await this.prisma.beneficiary.findUnique({
      where: {
        uuid,
      },
    });

    if (!findUuid) throw new Error('Data not Found');

    const rdata = await this.prisma.beneficiary.update({
      where: {
        uuid,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    this.eventEmitter.emit(BeneficiaryEvents.BENEFICIARY_REMOVED, {
      projectUuid: uuid
    });

    return rdata;
  }

  async createBulk(dtos: CreateBeneficiaryDto[]) {
    console.log('dtos', dtos);
    const hasPhone = dtos.every((dto) => dto.piiData.phone);
    if (!hasPhone) throw new RpcException('Phone number is required');

    //check if phone number is unique or not
    const ben = await this.checkPhoneNumber(dtos);
    if (ben.length > 0) throw new RpcException('Phone number should be unique');

    const hasWallet = dtos.every((dto) => dto.walletAddress);
    if (hasWallet) {
      //check uniquness of wallet address
      const ben = await this.checkWalletAddress(dtos);
      if (ben.length > 0) throw new RpcException('Wallet should be unique');

      // Pre-generate UUIDs for each beneficiary to use as a linking key
      dtos.forEach((dto) => {
        dto.uuid = dto.uuid || uuidv4(); // Assuming generateUuid() is a method that generates unique UUIDs
      });
    }
    if (!hasWallet)
      // Pre-generate UUIDs for each beneficiary to use as a linking key
      dtos.forEach((dto) => {
        dto.uuid = dto.uuid || uuidv4(); // Assuming generateUuid() is a method that generates unique UUIDs
        dto.walletAddress = dto.walletAddress || generateRandomWallet().address;
      });

    // Separate PII data and prepare beneficiary data for bulk insertion
    const beneficiariesData = dtos.map(({ piiData, ...data }) => data);
    const piiDataList = dtos.map(({ uuid, piiData }) => ({
      ...piiData,
      uuid, // Temporarily store the uuid with PII data for linking
    }));

    try {
      await this.prisma.beneficiary.createMany({
        data: beneficiariesData,
      });
    } catch (e) {
      console.log('e', e);
      throw new RpcException(
        new BadRequestException('Error in creating beneficiaries')
      );
    }
    // Insert beneficiaries in bulk

    // Assuming PII data includes a uuid field for linking purposes
    // Retrieve all just inserted beneficiaries by their uuids to link them with their PII data
    const insertedBeneficiaries = await this.prisma.beneficiary.findMany({
      where: {
        uuid: {
          in: dtos.map((dto) => dto.uuid),
        },
      },
    });

    // Prepare PII data for bulk insertion with correct beneficiaryId
    const piiBulkInsertData = piiDataList.map((piiData) => {
      const beneficiary = insertedBeneficiaries.find(
        (b) => b.uuid === piiData.uuid
      );
      return {
        beneficiaryId: beneficiary.id,
        ...piiData,
        uuid: undefined, // Remove the temporary uuid field
      };
    });

    // Insert PII data in bulk
    if (piiBulkInsertData.length > 0) {
      const sanitizedPiiBenef = piiBulkInsertData.map((b) => {
        return {
          ...b,
          phone: b.phone ? b.phone.toString() : null,
        };
      });
      await this.prisma.beneficiaryPii.createMany({
        data: sanitizedPiiBenef,
      });
    }

    this.eventEmitter.emit(BeneficiaryEvents.BENEFICIARY_CREATED);

    // Return some form of success indicator, as createMany does not return the records themselves
    return { success: true, count: dtos.length };
  }

  async checkWalletAddress(dtos) {
    const wallets = dtos.map((dto) => dto.walletAddress);
    const ben = await this.prisma.beneficiary.findMany({
      where: {
        walletAddress: {
          in: wallets,
        },
      },
    });
    return ben;
  }

  async checkPhoneNumber(dtos) {
    const phoneNumber = dtos.map((dto) => dto.piiData.phone.toString());
    return this.prisma.beneficiaryPii.findMany({
      where: {
        phone: {
          in: phoneNumber,
        },
      },
    });
  }

  async listReferredBen({ bendata }) {
    const uuids = bendata.data.map((item) => item.uuid);
    let result = {};
    const newdata = await this.prisma.beneficiary.findMany({
      where: {
        uuid: {
          in: uuids,
        },
      },
    });
    if (newdata.length > 0) {
      const mergedData = await this.mergePIIData(newdata);
      result = mergedData;
    }

    return { result, meta: bendata.meta };
  }

  async getTotalCount({ projectId }) {
    const benTotal = await this.prisma.beneficiaryProject.count({
      where: {
        projectId,
      },
    });

    const vendorTotal = await this.prisma.projectVendors.count({
      where: {
        projectId,
      },
    });


    return this.client.send(
      { cmd: "rahat.jobs.project.redemption_stats", uuid: projectId },
      { benTotal, vendorTotal })

    // return { benTotal, vendorTotal };
  }

  async getProjectSpecificData(data) {
    const { benId, projectId } = data;
    const benData = await this.findOne(benId);
    if (benData)
      return this.client.send(
        { cmd: BeneficiaryJobs.GET, uuid: projectId },
        { uuid: benId, data: benData }
      );
    return benData;
  }
}
