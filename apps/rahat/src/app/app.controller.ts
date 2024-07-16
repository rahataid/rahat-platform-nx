import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ListSettingDto, UpdateSettngsDto } from '@rahataid/extensions';
import { ACTIONS } from '@rahataid/sdk';
import { CreateSettingDto } from '@rumsan/extensions/dtos';
import { CheckAbilities, SUBJECTS } from '@rumsan/user';
import { AppService } from './app.service';


@Controller('app')
@ApiTags('app')
export class AppController {
  constructor(private readonly appService: AppService,

  ) { }

  @Post('settings')
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.appService.createRahatAppSettings(createSettingDto)
  }

  @Get('settings')
  @ApiBearerAuth('JWT')
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.PUBLIC })
  listRahatSettings(@Query() query: ListSettingDto) {
    return this.appService.getRahatSettings(query);
  }

  @Patch('settings/update/:name')
  @ApiBearerAuth('JWT')
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.PUBLIC })
  updateRahatSettings(@Param('name') name: string, @Body() dto: UpdateSettngsDto) {
    console.log(name);
    return this.appService.updateRahatSettngs(name, dto);
  }
}
