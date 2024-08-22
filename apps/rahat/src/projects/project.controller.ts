import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  CreateProjectDto,
  ListProjectBeneficiaryDto,
  ProjectCommunicationDto,
  RolePermsRegistryQueryDto,
  UpdateProjectDto,
  UpdateProjectStatusDto,
  UpdateRolePermsDto
} from '@rahataid/extensions';
import { ACTIONS, APP, BeneficiaryJobs, MS_TIMEOUT, ProjectJobs, SUBJECTS } from '@rahataid/sdk';
import { CreateSettingDto } from '@rumsan/extensions/dtos';
import { AbilitiesGuard, CheckAbilities, JwtGuard } from "@rumsan/user";
import { UUID } from 'crypto';
import { timeout } from 'rxjs/operators';
import { CurrentUser, CurrentUserInterface } from '../decorators';
import { ProjectService } from './project.service';

@ApiBearerAuth(APP.JWT_BEARER)
@UseGuards(JwtGuard, AbilitiesGuard)
@Controller('projects')
@ApiTags('Projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    @Inject('RAHAT_CLIENT') private readonly rahatClient: ClientProxy,
    @Inject('BEN_CLIENT') private readonly benClient: ClientProxy
  ) { }

  @CheckAbilities({ actions: ACTIONS.MANAGE, subject: SUBJECTS.ALL })
  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectService.create(dto);
  }

  @Patch(':uuid/role-perms')
  @ApiParam({ name: 'uuid', required: true })
  updateRolePerms(@Param('uuid') uuid: UUID, @Body() dto: UpdateRolePermsDto) {
    return this.projectService.updateRolesAndPerms(uuid, dto)
  }
  @CheckAbilities({ actions: ACTIONS.MANAGE, subject: SUBJECTS.PROJECT })
  @Get()
  list() {
    return this.projectService.list();
  }

  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.PROJECT })
  @Get('/registry')
  getRegistry(@Query() query: RolePermsRegistryQueryDto) {
    return this.projectService.getRegistryInfo(query);
  }

  @CheckAbilities({ actions: ACTIONS.MANAGE, subject: SUBJECTS.PROJECT })
  @Get(':uuid')
  @ApiParam({ name: 'uuid', required: true })
  findOne(@Param('uuid') uuid: UUID) {
    return this.projectService.findOne(uuid);
  }

  @CheckAbilities({ actions: ACTIONS.MANAGE, subject: SUBJECTS.ALL })
  @ApiParam({ name: 'uuid', required: true })
  @Patch(':uuid')
  update(
    @Body() updateProjectDto: UpdateProjectDto,
    @Param('uuid') uuid: UUID
  ) {
    return this.projectService.update(uuid, updateProjectDto);
  }

  @CheckAbilities({ actions: ACTIONS.MANAGE, subject: SUBJECTS.ALL })
  @ApiParam({ name: 'uuid', required: true })
  @Patch(':uuid/status')
  updateStatus(
    @Body() data: UpdateProjectStatusDto,
    @Param('uuid') uuid: UUID
  ) {
    return this.projectService.updateStatus(uuid, data);
  }


  @CheckAbilities({ actions: ACTIONS.MANAGE, subject: SUBJECTS.ALL })
  @Delete(':uuid')
  remove(@Param('uuid') uuid: UUID) {
    return this.projectService.remove(uuid);
  }

  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.BENEFICIARY })
  @ApiParam({ name: 'uuid', required: true })
  @Get(':uuid/beneficiaries')
  listBeneficiaries(@Query() dto: ListProjectBeneficiaryDto) {
    return this.rahatClient
      .send({ cmd: BeneficiaryJobs.LIST }, dto)
      .pipe(timeout(5000));
  }


  @CheckAbilities({ actions: ACTIONS.MANAGE, subject: SUBJECTS.ALL })
  @ApiParam({ name: 'uuid', required: true })
  @Post(':uuid/settings')
  addSettings(@Param('uuid') uuid: UUID, @Body() dto: CreateSettingDto) {
    return this.rahatClient
      .send({ cmd: ProjectJobs.PROJECT_SETTINGS, uuid }, dto)
      .pipe(timeout(5000));
  }


  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.PUBLIC })
  @ApiParam({ name: 'uuid', required: true })
  @Post(':uuid/actions')
  projectActions(
    @Param('uuid') uuid: UUID,
    @Body() data: ProjectCommunicationDto,
    @CurrentUser() cu: CurrentUserInterface
  ) {
    data = { payload: { ...data.payload, cu }, action: data.action };
    const response = this.projectService.handleProjectActions({
      uuid,
      ...data,
    });
    return response;
  }

  //list project specific stats
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.PROJECT })
  @ApiParam({ name: 'uuid', required: true })
  @Get(':uuid/stats')
  projectStats(@Param('uuid') uuid: UUID) {
    return this.benClient
      .send({ cmd: BeneficiaryJobs.PROJECT_STATS }, uuid)
      .pipe(timeout(MS_TIMEOUT));
  }



  //Get datasource for entire project
  // @Get('statsSources')
  // statsSource() {
  //   return this.benClient
  //     .send({ cmd: BeneficiaryJobs.GET_ALL_STATS }, {})
  //     .pipe(timeout(MS_TIMEOUT));
  // }

  //Get datasource for entire project
  // @Get('statsSources')
  // statsSource() {
  //   return this.benClient
  //     .send({ cmd: BeneficiaryJobs.GET_ALL_STATS }, {})
  //     .pipe(timeout(MS_TIMEOUT));
  // }

  //list project specific stats sources
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.PROJECT })
  @ApiParam({ name: 'uuid', required: false })
  @Get(':uuid/statsSources')
  projectStatsSources(@Param('uuid') uuid: UUID) {
    return this.benClient
      .send({ cmd: BeneficiaryJobs.GET_STATS }, { uuid })
      .pipe(timeout(MS_TIMEOUT));
  }

}
