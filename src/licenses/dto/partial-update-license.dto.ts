import { PartialType, PickType } from '@nestjs/swagger';
import { CreateLicenseDto } from './create-license.dto.js';

export class UpdateLicenseDto extends PartialType(
  PickType(CreateLicenseDto, ['expiryDate'] as const),
) {}