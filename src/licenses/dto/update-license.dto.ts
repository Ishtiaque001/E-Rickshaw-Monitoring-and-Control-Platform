
import {
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';

import { LicenseStatus } from '../entities/license.entity.js';

export class UpdateLicenseDto {

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsEnum(LicenseStatus)
  status?: LicenseStatus;
}
