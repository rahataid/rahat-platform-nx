import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateSettngsDto {
  @ApiProperty({
    type: 'object',
    example: {
      field1: 'value1',
      field2: 'value2',
    },
  })
  @IsOptional()
  @IsNotEmpty()
  value!: object;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
    },
    required: false,
    example: ['field1', 'field2'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredFields?: string[];

  @ApiProperty({
    type: 'boolean',
    example: false,
  })
  @IsBoolean()
  isPrivate!: false;

  @ApiProperty({
    type: 'boolean',
    example: false,
  })
  @IsBoolean()
  isReadOnly!: false;
}

export class ListSettingDto {
  @ApiProperty({ example: 1 })
  @IsString()
  @IsOptional()
  sort!: string;

  @ApiProperty({ example: 'desc' })
  @IsString()
  @IsOptional()
  order!: 'asc' | 'desc';

  @ApiProperty({ example: 1 })
  @IsNumber()
  page!: number;

  @ApiProperty({ example: '10' })
  @IsNumber()
  perPage!: number;

  @ApiPropertyOptional({ example: 'Tayaba' })
  @IsString()
  @IsOptional()
  name?: string;
}
