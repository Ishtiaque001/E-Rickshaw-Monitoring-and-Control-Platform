
import { PartialType } from '@nestjs/mapped-types';
import { UpdateLicenseDto } from './update-license.dto.js';

export class PartialUpdateLicenseDto
  extends PartialType(UpdateLicenseDto) {}
