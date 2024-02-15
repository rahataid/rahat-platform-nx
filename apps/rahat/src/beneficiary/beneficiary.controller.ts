import { InjectQueue } from '@nestjs/bull';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import {
  BQUEUE,
  CreateBeneficiaryDto,
  Enums,
  JOBS,
  ListBeneficiaryDto,
  TFile,
  UpdateBeneficiaryDto,
} from '@rahat/sdk';
import { Queue } from 'bull';
import { UUID } from 'crypto';
import { DocParser } from './parser';

@Controller('beneficiaries')
@ApiTags('Beneficiaries')
export class BeneficiaryController {
  constructor(
    @Inject('BEN_CLIENT') private readonly client: ClientProxy,
    @InjectQueue(BQUEUE.RAHAT) private readonly queue: Queue
  ) {}

  @Get()
  async list(@Query() dto: ListBeneficiaryDto) {
    return this.client.send({ cmd: JOBS.BENEFICIARY.LIST }, dto);
  }

  @Get('stats')
  async getStats() {
    return this.client.send({ cmd: JOBS.BENEFICIARY.STATS }, {});
  }

  @Post()
  async create(@Body() dto: CreateBeneficiaryDto) {
    return this.client.send({ cmd: JOBS.BENEFICIARY.CREATE }, dto);
  }

  @Post('upload-json')
  async uploadBeneficiaries(@Body() bufferData: Buffer) {
    const beneficiaries = await DocParser(
      Enums.UploadFileType.JSON,
      bufferData
    );

    return this.client.send(
      { cmd: JOBS.BENEFICIARY.CREATE_BULK },
      beneficiaries
    );
  }

  @Post('bulk')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBulk(@UploadedFile() file: TFile, @Req() req: Request) {
    const docType: Enums.UploadFileType =
      req.body['doctype']?.toUpperCase() || Enums.UploadFileType.JSON;
    const beneficiaries = await DocParser(docType, file.buffer);

    return this.client.send(
      { cmd: JOBS.BENEFICIARY.CREATE_BULK },
      beneficiaries
    );
  }

  @Post(':uuid')
  @ApiParam({ name: 'uuid', required: true })
  async update(@Param('uuid') uuid: UUID, @Body() dto: UpdateBeneficiaryDto) {
    return this.client.send({ cmd: JOBS.BENEFICIARY.UPDATE }, { uuid, dto });
  }
}
