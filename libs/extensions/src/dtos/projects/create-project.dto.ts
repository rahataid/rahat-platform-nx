import { OmitType, PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '@rahataid/sdk/enums';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'Cash Distribution',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    required: false,
    example: 'Cash Distribution for the flood victims',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    example: 'el',
  })
  @IsString()
  type: string;

  @ApiProperty({
    required: false,
    example: { test: 'test' },
  })
  @IsOptional()
  @IsObject()
  extras?: object;

  @ApiProperty({
    required: false,
    example: '0x123'
  })
  @IsOptional()
  @IsString()
  contractAddress?: string
}

export class UpdateProjectDto extends OmitType(PartialType(CreateProjectDto), [
  'type',
]) {

}

export class UpdateProjectStatusDto {

  @ApiProperty({
    type: 'string',
    required: false,
    example: 'READY',
  })
  @IsString()
  @IsOptional()
  status: ProjectStatus;
}
