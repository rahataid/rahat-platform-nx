import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { CreateProjectDto, IRole, PermissionSet, RolePermsRegistryQueryDto, UpdateProjectDto, UpdateProjectStatusDto, UpdateRolePermsDto } from '@rahataid/extensions';
import {
  BeneficiaryJobs,
  MS_ACTIONS,
  MS_TIMEOUT,
  ProjectEvents,
  ProjectJobs
} from '@rahataid/sdk';
import { ROLE_PERMS_REGISTRY } from '@rahataid/sdk/constants/role-perms';
import { BeneficiaryType } from '@rahataid/sdk/enums';
import { PrismaService } from '@rumsan/prisma';
import { UUID } from 'crypto';
import { tap, timeout } from 'rxjs';
import { RequestContextService } from '../request-context/request-context.service';
import { ERC2771FORWARDER } from '../utils/contracts';
import { createContractSigner } from '../utils/web3';
import { aaActions, beneficiaryActions, c2cActions, cvaActions, elActions, projectActions, settingActions, vendorActions } from './actions';
import { rpActions } from './actions/rp.action';
import { userRequiredActions } from './actions/user-required.action';
@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private requestContextService: RequestContextService,
    @Inject('RAHAT_CLIENT') private readonly client: ClientProxy
  ) { }

  getRegistryInfo(query: RolePermsRegistryQueryDto) {
    const { project, name } = query;
    const registryData = ROLE_PERMS_REGISTRY[project];
    if (!registryData) throw new Error('Project not found. Allowed projects are [el,cva,aa]');
    if (name) {
      const data = registryData[name];
      if (!data) throw new Error('Data not found. Allowed names are [roles,subjects]');
      return data;
    }
  }

  async getRole(txn: PrismaClient, role: string, scope: string) {
    const d = await txn.role.findUnique({
      where: {
        'roleIdentifier': { name: role, scope }
      }
    });
    if (!d) throw new Error('Role not found');
    return d;
  }

  async deleteExistingPerms(txn: PrismaClient, roleId: number) {
    return txn.permission.deleteMany({ where: { roleId } })
  }

  async updateRolesAndPerms(scope: string, dto: UpdateRolePermsDto) {
    const { role, permissions } = dto;
    return this.prisma.$transaction(async (txn: PrismaClient) => {
      const existingRole = await this.getRole(txn, role, scope);
      await this.deleteExistingPerms(txn, existingRole.id);
      await this.createPermissions(txn, existingRole.id, permissions)
      return existingRole;
    })
  }

  async createPermissions(txn: PrismaClient, roleId: number, permissions: PermissionSet) {
    const permissionsData = [];
    for (const subject in permissions) {
      for (const action of permissions[subject]) {
        permissionsData.push({
          roleId,
          subject,
          action,
        });
      }
    }
    return txn.permission.createMany({
      data: permissionsData,
    });
  }

  async createRolesAndPerms(txn: PrismaClient, roles: IRole[]) {
    const payloads = [];
    for (let r of roles) {
      const { permissions, ...rest } = r;
      const created = await txn.role.create({ data: rest });

      for (const [subject, actions] of Object.entries(permissions)) {
        for (const action of actions) {
          payloads.push({ subject, action, roleId: created.id });
        }
      }
    }

    return txn.permission.createMany({ data: payloads });
  }


  async create(dto: CreateProjectDto) {
    const registryData = ROLE_PERMS_REGISTRY[dto.type];
    if (!registryData) throw new Error('Roles & permissions not found for this type');
    const { roles } = registryData;

    return this.prisma.$transaction(async (txn: PrismaClient) => {
      const project = await txn.project.create({
        data: dto,
      });
      if (roles.length) {
        const rolesPayload = roles.map((r: IRole) => {
          return { ...r, scope: project.uuid }
        });
        await this.createRolesAndPerms(txn, rolesPayload)
      }
      this.eventEmitter.emit(ProjectEvents.PROJECT_CREATED, project);
      return project;
    })
  }

  async list() {
    return this.prisma.project.findMany();
  }

  async findOne(uuid: UUID) {
    return this.prisma.project.findUnique({
      where: {
        uuid,
      },
    });
  }

  async update(uuid: UUID, data: UpdateProjectDto) {
    return this.prisma.project.update({
      where: {
        uuid,
      },
      data,
    });
  }

  async updateStatus(uuid: UUID, data: UpdateProjectStatusDto) {
    return this.prisma.project.update({
      where: {
        uuid,
      },
      data
    });
  }

  async remove(uuid: UUID) {
    return this.prisma.project.delete({
      where: {
        uuid,
      },
    });
  }

  async sendWhatsAppMsg(response, cmd, payload) {
    // send whatsapp message after added referal beneficiary to project
    if (
      response?.insertedData?.some((res) => res?.walletAddress) &&
      response?.cmd === BeneficiaryJobs.BULK_REFER_TO_PROJECT &&
      payload?.dto?.type === BeneficiaryType.REFERRED
    ) {
      this.eventEmitter.emit(
        ProjectEvents.BENEFICIARY_ADDED_TO_PROJECT,
        payload.dto
      );
    }
    //send message to all admin
    if (
      response?.id &&
      cmd?.cmd === ProjectJobs.REQUEST_REDEMPTION
    ) {
      this.eventEmitter.emit(
        ProjectEvents.REQUEST_REDEMPTION
      );
    }
    if (
      response?.vendordata?.length > 0 &&
      cmd?.cmd === ProjectJobs.UPDATE_REDEMPTION
    ) {
      this.eventEmitter.emit(
        ProjectEvents.UPDATE_REDEMPTION,
        response.vendordata

      );
    }

  }

  async sendCommand(cmd, payload, timeoutValue = MS_TIMEOUT, client: ClientProxy, action: string) {
    // const user = this.requestContextService.getUser();
    const requiresUser = userRequiredActions.has(action)
    return client.send(cmd, {
      ...payload,
      // ...(requiresUser && { user })
    }).pipe(
      timeout(timeoutValue),
      tap((response) => {
        this.sendWhatsAppMsg(response, cmd, payload)

      })
    );
  }

  async executeMetaTxRequest(params: any) {
    const { metaTxRequest } = params;
    const forwarderContract = await createContractSigner(
      ERC2771FORWARDER,
      process.env.ERC2771_FORWARDER_ADDRESS
    );

    metaTxRequest.gas = BigInt(metaTxRequest.gas);
    metaTxRequest.nonce = BigInt(metaTxRequest.nonce);
    metaTxRequest.value = BigInt(metaTxRequest.value);
    const tx = await forwarderContract.execute(metaTxRequest);
    const res = await tx.wait();

    return { txHash: res.hash, status: res.status };
  }

  async sendSucessMessage(uuid, payload) {
    const { benId } = payload

    this.eventEmitter.emit(
      ProjectEvents.REDEEM_VOUCHER,
      benId
    );
    return this.client.send({ cmd: 'rahat.jobs.project.voucher_claim', uuid }, {}).pipe(timeout(MS_TIMEOUT))

  }

  async checkOnchainRole(currentRoles: string[]) {
    let onChain = false;
    const data = await this.prisma.role.findMany({
      where: {
        name: { in: currentRoles }
      }
    });
    if (!data.length) return onChain;
    for (let d of data) {
      if (d.onChain) {
        onChain = true;
        break;
      }
    }

    return onChain;
  }

  async handleProjectActions({ uuid, action, payload }) {
    let currentUser = payload.cu;
    currentUser.onChain = await this.checkOnchainRole(currentUser.roles);
    payload.cu = currentUser;
    console.log({ uuid, action, payload })
    //Note: This is a temporary solution to handle metaTx actions
    const metaTxActions = {
      [MS_ACTIONS.ELPROJECT.REDEEM_VOUCHER]: async () => await this.executeMetaTxRequest(payload),
      [MS_ACTIONS.ELPROJECT.PROCESS_OTP]: async () => await this.executeMetaTxRequest(payload),
      [MS_ACTIONS.ELPROJECT.SEND_SUCCESS_MESSAGE]: async () => await this.sendSucessMessage(uuid, payload),
      [MS_ACTIONS.ELPROJECT.ASSIGN_DISCOUNT_VOUCHER]: async () => await this.executeMetaTxRequest(payload),
      [MS_ACTIONS.ELPROJECT.REQUEST_REDEMPTION]: async () => await this.executeMetaTxRequest(payload),
    };


    const actions = {
      ...projectActions,
      ...elActions,
      ...aaActions,
      ...beneficiaryActions,
      ...vendorActions,
      ...settingActions,
      ...metaTxActions,
      ...c2cActions,
      ...cvaActions,
      ...rpActions
    };



    const actionFunc = actions[action];
    if (!actionFunc) {
      throw new Error('Please provide a valid action!');
    }
    return await actionFunc(uuid, payload, (...args) => {
      return this.sendCommand(args[0], payload, args[2], this.client, action)
    });
  }
}

