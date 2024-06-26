import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { GetVendorOtp, VendorAddToProjectDto, VendorRegisterDto, VendorUpdateDto, VerifyVendorOtp } from '@rahataid/extensions';
import { VendorJobs } from '@rahataid/sdk';
import { RequestDetails } from '@rumsan/extensions/decorators';
import { UUID } from 'crypto';
import { Address } from 'viem';
import { VendorsService } from './vendors.service';


@ApiTags('Vendors')
@Controller('vendors')
export class VendorsController {
  constructor(
    private readonly vendorService: VendorsService,
  ) { }

  @Post('')
  registerVendor(@Body() dto: VendorRegisterDto) {
    return this.vendorService.registerVendor(dto);
  }

  @Get('')
  listVendor(@Query() dto) {
    return this.vendorService.listVendor(dto);
  }


  @MessagePattern({ cmd: VendorJobs.LIST_BY_PROJECT })
  listByProject(dto) {
    return this.vendorService.listProjectVendor(dto)
  }

  @Get('/stats')
  getVendorCount(@Query() dto) {
    return this.vendorService.getVendorCount();
  }

  @ApiParam({ name: 'id', required: true })
  @Get('/:id')
  getVendor(@Param('id') id: UUID | Address) {
    return this.vendorService.getVendor(id);
  }

  @Post('/getOtp')
  getOtp(@Body() dto: GetVendorOtp, @RequestDetails() rdetails: any) {
    return this.vendorService.getOtp(dto, rdetails)
  }

  @Post('/verifyOtp')
  verifyOtp(@Body() dto: VerifyVendorOtp, @RequestDetails() rdetails: any) {
    return this.vendorService.verifyOtp(dto, rdetails)
  }

  @ApiParam({ name: 'uuid', required: true })
  @Patch('/update/:uuid')
  updateVendor(
    @Param('uuid') uuid: UUID,
    @Body() dto: VendorUpdateDto) {
    return this.vendorService.updateVendor(dto, uuid)
  }

  ///microservice
  @MessagePattern({ cmd: VendorJobs.GET_REDEMPTION_VENDORS })
  listRedemptionVendors(data) {
    return this.vendorService.listRedemptionVendor(data)
  }

  @MessagePattern({ cmd: VendorJobs.ASSIGN_PROJECT })
  assignToProject(@Payload() dto: VendorAddToProjectDto) {
    return this.vendorService.assignToProject(dto)
  }

  @MessagePattern({ cmd: VendorJobs.GET_VENDOR_STATS })
  getVendorStats(@Payload() dto) {
    return this.vendorService.getVendorClaimStats(dto)
  }


}
