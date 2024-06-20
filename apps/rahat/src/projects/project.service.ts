import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProjectDto, UpdateProjectDto, UpdateProjectStatusDto } from '@rahataid/extensions';
import {
  BeneficiaryJobs,
  MS_ACTIONS,
  MS_TIMEOUT,
  ProjectEvents,
  ProjectJobs
} from '@rahataid/sdk';
import { BeneficiaryType } from '@rahataid/sdk/enums';
import { PrismaService } from '@rumsan/prisma';
import { UUID } from 'crypto';
import { tap, timeout } from 'rxjs';
import { ERC2771FORWARDER } from '../utils/contracts';
import { createContractSigner } from '../utils/web3';
import { aaActions, beneficiaryActions, c2cActions, cvaActions, elActions, settingActions, vendorActions } from './actions';
@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    @Inject('RAHAT_CLIENT') private readonly client: ClientProxy
  ) { }

  async create(data: CreateProjectDto) {
    // TODO: refactor to proper validator
    // switch (data.type) {
    //   case 'AA':
    //     SettingsService.get('AA')
    //     break;
    //   case 'CVA':
    //     SettingsService.get('CVA')
    //     break;
    //   case 'EL':
    //     SettingsService.get('EL')
    //     break;
    //   default:
    //     throw new Error('Invalid project type.')
    // }

    const project = await this.prisma.project.create({
      data,
    });

    this.eventEmitter.emit(ProjectEvents.PROJECT_CREATED, project);

    return project;
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

  async sendCommand(cmd, payload, timeoutValue = MS_TIMEOUT, client: ClientProxy) {

    return client.send(cmd, payload).pipe(
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

  async handleProjectActions({ uuid, action, payload }) {
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
      ...elActions,
      ...aaActions,
      ...beneficiaryActions,
      ...vendorActions,
      ...settingActions,
      ...metaTxActions,
      ...c2cActions,
      ...cvaActions
    };


    const actionFunc = actions[action];
    if (!actionFunc) {
      throw new Error('Please provide a valid action!');
    }
    return await actionFunc(uuid, payload, (...args) => this.sendCommand(args[0], args[1], args[2], this.client));
  }
}

