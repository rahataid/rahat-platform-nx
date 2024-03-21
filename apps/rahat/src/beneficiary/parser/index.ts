import { CreateBeneficiaryDto } from '@rahataid/extensions';
import { Enums } from '@rahataid/sdk';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ExcelParser } from './excel.parser';
import { JsonParser } from './json.parser';

export async function DocParser(
  docType: Enums.UploadFileType,
  buffer: Buffer
): Promise<CreateBeneficiaryDto[]> {
  if (
    docType !== Enums.UploadFileType.JSON &&
    docType !== Enums.UploadFileType.EXCEL
  )
    throw new Error('Only allowed JSON and EXCEL docType');
  const parsedData =
    docType === Enums.UploadFileType.JSON
      ? JsonParser(buffer)
      : ExcelParser(buffer);

  const validationErrors = [];
  const beneficiaries = [];

  // Validate each row
  for (const row of parsedData) {
    if (row.birthDate) {
      row.birthDate = new Date(row.birthDate);
    }
    const beneficiaryDto = plainToClass(CreateBeneficiaryDto, row);

    const errors = await validate(beneficiaryDto);

    if (errors.length > 0) {
      validationErrors.push({
        row,
        errors: errors.map((error) => Object.values(error.constraints)),
      });
    } else {
      beneficiaries.push(row);
    }
  }

  // If any validation errors, throw exception
  if (validationErrors.length > 0) {
    throw new Error('Validation errors: ' + JSON.stringify(validationErrors));
  }
  return beneficiaries;
}
