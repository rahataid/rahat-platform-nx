import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class ProjectCommunicationDto {
  @ApiProperty({ example: 'beneficiary.create', type: 'string' })
  @IsString()
  action: string;

  @ApiProperty({ example: { name: 'John Doe' }, type: 'object' })
  @IsObject()
  payload: any;
}

export class RolePermsRegistryQueryDto {
  @ApiProperty({ example: 'el', type: 'string' })
  @IsString()
  project: string;

  @ApiProperty({ example: 'subjects' })
  @IsString()
  name?: string;
}

