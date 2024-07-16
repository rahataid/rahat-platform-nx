import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ListSettingDto, UpdateSettngsDto } from '@rahataid/extensions';
import { CreateSettingDto } from '@rumsan/extensions/dtos';
import { PrismaService } from '@rumsan/prisma';
import { SettingDataType } from '@rumsan/sdk/enums';
import { paginate } from '../utils/paginate';


function getDataType(
  value: string | number | boolean | object,
): SettingDataType {
  if (typeof value === 'string') {
    return SettingDataType.STRING;
  } else if (typeof value === 'number') {
    return SettingDataType.NUMBER;
  } else if (typeof value === 'boolean') {
    return SettingDataType.BOOLEAN;
  } else if (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  ) {
    return SettingDataType.OBJECT;
  }
  throw new Error(`Invalid data type for 'value': ${typeof value}`);
}


@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService
  ) { }
  async createRahatAppSettings(
    createSettingDto: CreateSettingDto,
  ) {
    let {
      name,
      value: dtoValue,
      requiredFields,
      isReadOnly,
      isPrivate,
    } = createSettingDto;
    let value: any = dtoValue;

    const requiredFieldsArray: string[] = requiredFields
      ? requiredFields.map((field) => field)
      : [];

    const dataType = getDataType(value);

    // Check if 'value' is an object and not an array or null
    if (dataType === SettingDataType.OBJECT) {
      // Use type assertion here to tell TypeScript that value is an object
      const rawValueObject = value as Record<string, any>;
      // No capitalization of keys of the 'value' object

      // Check if 'value' object has all the properties specified in 'requiredFields' (case-insensitive)
      if (requiredFieldsArray && requiredFieldsArray.length > 0) {
        value = Object.keys(value)
          .filter((key) => requiredFieldsArray.includes(key))
          .reduce((obj: any, key) => {
            obj[key] = value[key];
            return obj;
          }, {});

        const missingFields = requiredFieldsArray.filter((field) => {
          const matchingKey = Object.keys(value).find(
            (key) => key === field,
          );
          return !matchingKey;
        });

        if (missingFields.length > 0) {
          throw new Error(
            `Required fields missing in 'value' object: ${missingFields.join(
              ', ',
            )}`,
          ); // 400 Bad Request
        }
      }
    } else {
      // If 'value' is not an object, set 'requiredFields' to an empty array []
      requiredFields = [];
    }


    const existingSetting = await this.prisma.setting.findUnique({
      where: { name },
    });

    if (existingSetting) {
      throw new Error('Setting with this name already exists'); // 400 Bad Request
    }
    const newSetting = await this.prisma.setting.create({
      data: {
        name,
        value,
        dataType,
        requiredFields: requiredFieldsArray,
        isReadOnly,
        isPrivate,
      },
    });

    return newSetting;
  }

  async getRahatSettings(query: ListSettingDto) {
    const AND_CONDITIONS = [];
    let conditions = {};

    if (query.name) {
      AND_CONDITIONS.push({
        name: { contains: query.name, mode: 'insensitive' },
      });
      conditions = { AND: AND_CONDITIONS };
    }

    const select: Prisma.SettingSelect = {
      name: true,
      dataType: true,
      isPrivate: true,
      isReadOnly: true,
      requiredFields: true,
      value: true,
    };

    return paginate(
      this.prisma.setting,
      {
        where: { ...conditions },
        select,
      },
      {
        page: query.page,
        perPage: query.perPage,
      },
    );
  }

  async updateRahatSettngs(name: string, dto: UpdateSettngsDto) {
    const { value, requiredFields } = dto;
    console.log(dto);
    const settingsName = await this.prisma.setting.findUnique({
      where: {
        name,
      },
    });
    if (!settingsName) throw new Error('Setting not found');

    if (!value || typeof value !== 'object' || !Array.isArray(requiredFields)) {
      throw new Error('Invalid data structure');
    }

    const matchKeysWithRequiredFields = Object.keys(value).every((key) =>
      requiredFields.includes(key),
    );

    const matchRequiredFieldsWithKey = requiredFields.every((field) =>
      Object.keys(value).includes(field),
    );
    console.log(matchRequiredFieldsWithKey);
    if (!matchKeysWithRequiredFields || !matchRequiredFieldsWithKey)
      throw new Error('Key did not match with the Required Fields');

    return this.prisma.setting.update({
      where: {
        name,
      },
      data: {
        value: dto.value,
        requiredFields: dto.requiredFields,
        isPrivate: dto.isPrivate,
        isReadOnly: dto.isReadOnly,
      },
    });
  }
}
