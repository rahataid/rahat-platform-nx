import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  CreateProjectDto,
  ListProjectBeneficiaryDto,
  ProjectCommunicationDto,
  UpdateProjectDto,
  UpdateProjectStatusDto,
  UpdateRolePermsDto
} from '@rahataid/extensions';
import { APP, BeneficiaryJobs, MS_TIMEOUT, ProjectJobs } from '@rahataid/sdk';
import { CreateSettingDto } from '@rumsan/extensions/dtos';
import { UUID } from 'crypto';
import { timeout } from 'rxjs/operators';
import { CurrentUser, CurrentUserInterface } from '../decorators';
import { ProjectService } from './project.service';

@ApiBearerAuth(APP.JWT_BEARER)
@Controller('projects')
@ApiTags('Projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    @Inject('RAHAT_CLIENT') private readonly rahatClient: ClientProxy,
    @Inject('BEN_CLIENT') private readonly benClient: ClientProxy
  ) { }

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Patch(':uuid/role-perms')
  @ApiParam({ name: 'uuid', required: true })
  updateRolePerms(@Param('uuid') uuid: UUID, @Body() dto: UpdateRolePermsDto) {
    return this.projectService.upsertRolesAndPerms(uuid, dto)
  }

  @Get()
  list() {
    return this.projectService.list();
  }

  @Get(':uuid')
  @ApiParam({ name: 'uuid', required: true })
  findOne(@Param('uuid') uuid: UUID) {
    return this.projectService.findOne(uuid);
  }

  @ApiParam({ name: 'uuid', required: true })
  @Patch(':uuid')
  update(
    @Body() updateProjectDto: UpdateProjectDto,
    @Param('uuid') uuid: UUID
  ) {
    return this.projectService.update(uuid, updateProjectDto);
  }

  @ApiParam({ name: 'uuid', required: true })
  @Patch(':uuid/status')
  updateStatus(
    @Body() data: UpdateProjectStatusDto,
    @Param('uuid') uuid: UUID
  ) {
    return this.projectService.updateStatus(uuid, data);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: UUID) {
    return this.projectService.remove(uuid);
  }

  @ApiParam({ name: 'uuid', required: true })
  @Get(':uuid/beneficiaries')
  listBeneficiaries(@Query() dto: ListProjectBeneficiaryDto) {
    return this.rahatClient
      .send({ cmd: BeneficiaryJobs.LIST }, dto)
      .pipe(timeout(5000));
  }

  @ApiParam({ name: 'uuid', required: true })
  @Post(':uuid/settings')
  addSettings(@Param('uuid') uuid: UUID, @Body() dto: CreateSettingDto) {
    return this.rahatClient
      .send({ cmd: ProjectJobs.PROJECT_SETTINGS, uuid }, dto)
      .pipe(timeout(5000));
  }

  // @UseGuards(JwtGuard)
  // @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.PUBLIC })
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
  @ApiParam({ name: 'uuid', required: true })
  @Get(':uuid/stats')
  projectStats(@Param('uuid') uuid: UUID) {
    return this.benClient
      .send({ cmd: BeneficiaryJobs.PROJECT_STATS }, uuid)
      .pipe(timeout(MS_TIMEOUT));
  }
}
